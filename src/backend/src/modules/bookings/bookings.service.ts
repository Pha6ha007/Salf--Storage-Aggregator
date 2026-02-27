import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingStatus, BookingCancelledBy, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BoxesService } from '../boxes/boxes.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import {
  BookingCreatedEvent,
  BookingConfirmedEvent,
  BookingCancelledEvent,
  BookingCompletedEvent,
  BookingExpiredEvent,
} from '../../common/events/booking.events';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private boxesService: BoxesService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new booking (initial status: pending)
   * - Validates box availability
   * - Snapshots pricing (immutable)
   * - Reserves box quantity (available → reserved)
   */
  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { warehouseId, boxId, startDate, durationMonths, discountPercentage = 0 } = createBookingDto;

    // Verify warehouse exists and is active
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.status !== 'active') {
      throw new BadRequestException('Warehouse is not accepting bookings');
    }

    // Verify box exists, belongs to warehouse, and has availability
    const box = await this.prisma.box.findUnique({
      where: { id: boxId },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (box.warehouseId !== warehouseId) {
      throw new BadRequestException('Box does not belong to this warehouse');
    }

    if (!box.isAvailable || box.availableQuantity < 1) {
      throw new BadRequestException('Box is not available for booking');
    }

    // Calculate dates
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);

    // Validate start date is in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (start < now) {
      throw new BadRequestException('Start date must be in the future');
    }

    // Snapshot pricing (immutable)
    const basePricePerMonth = box.priceMonthly.toNumber();
    const discountAmount = basePricePerMonth * (discountPercentage / 100);
    const monthlyPrice = basePricePerMonth - discountAmount;
    const priceTotal = monthlyPrice * durationMonths;

    // Generate booking number
    const bookingCount = await this.prisma.booking.count();
    const bookingNumber = `BK-${new Date().getFullYear()}-${String(bookingCount + 1).padStart(6, '0')}`;

    // Create booking in a transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      // Create booking with status: pending
      const newBooking = await tx.booking.create({
        data: {
          userId,
          warehouseId,
          boxId,
          bookingNumber,
          status: BookingStatus.pending,
          startDate: start,
          endDate: end,
          durationMonths,
          basePricePerMonth,
          discountPercentage,
          monthlyPrice,
          priceTotal,
          notes: createBookingDto.notes,
        },
      });

      // Reserve box (available → reserved)
      await this.boxesService.reserveBox(boxId);

      return newBooking;
    });

    // Emit event
    this.eventEmitter.emit(
      'booking.created',
      new BookingCreatedEvent(
        booking.id,
        userId,
        warehouseId,
        boxId,
        priceTotal,
        userId,
      ),
    );

    return booking;
  }

  /**
   * Get all bookings for a user
   */
  async findByUser(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
            emirate: true,
          },
        },
        box: {
          select: {
            id: true,
            boxNumber: true,
            name: true,
            size: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  }

  /**
   * Get all bookings for an operator (their warehouses)
   */
  async findByOperator(operatorId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        warehouse: {
          operatorId,
        },
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        box: {
          select: {
            id: true,
            boxNumber: true,
            name: true,
            size: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  }

  /**
   * Get a single booking by ID
   */
  async findOne(id: number, userId?: string, operatorId?: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
            emirate: true,
            operatorId: true,
          },
        },
        box: {
          select: {
            id: true,
            boxNumber: true,
            name: true,
            size: true,
            priceMonthly: true,
          },
        },
      },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    // Authorization check
    if (userId && booking.userId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    if (operatorId && booking.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only view bookings for your warehouses');
    }

    return booking;
  }

  /**
   * Confirm a booking (pending → confirmed)
   * Operator only
   */
  async confirm(id: number, operatorId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { warehouse: true },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only confirm bookings for your warehouses');
    }

    // State machine validation
    if (booking.status !== BookingStatus.pending) {
      throw new BadRequestException(
        `Cannot confirm booking with status: ${booking.status}. Only pending bookings can be confirmed.`,
      );
    }

    // Update booking and box quantities in transaction
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: BookingStatus.confirmed,
          confirmedAt: new Date(),
        },
      });

      // Move box quantity: reserved → occupied
      await this.boxesService.confirmReservation(booking.boxId);

      return updated;
    });

    // Emit event
    this.eventEmitter.emit(
      'booking.confirmed',
      new BookingConfirmedEvent(
        id,
        booking.userId,
        booking.warehouseId,
        operatorId,
      ),
    );

    return updatedBooking;
  }

  /**
   * Complete a booking (confirmed → completed)
   * Operator only
   */
  async complete(id: number, operatorId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { warehouse: true },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only complete bookings for your warehouses');
    }

    // State machine validation
    if (booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException(
        `Cannot complete booking with status: ${booking.status}. Only confirmed bookings can be completed.`,
      );
    }

    // Update booking and box quantities in transaction
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: BookingStatus.completed,
          completedAt: new Date(),
        },
      });

      // Release box: occupied → available
      await this.boxesService.releaseBox(booking.boxId, 'occupied');

      return updated;
    });

    // Emit event
    this.eventEmitter.emit(
      'booking.completed',
      new BookingCompletedEvent(
        id,
        booking.userId,
        booking.warehouseId,
        operatorId,
      ),
    );

    return updatedBooking;
  }

  /**
   * Cancel a booking
   * - From pending: user or operator can cancel
   * - From confirmed: only operator can cancel
   */
  async cancel(
    id: number,
    cancelBookingDto: CancelBookingDto,
    userId?: string,
    operatorId?: number,
    userRole?: UserRole,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { warehouse: true },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    // State machine validation
    if (booking.status === BookingStatus.completed) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    if (booking.status === BookingStatus.cancelled) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.expired) {
      throw new BadRequestException('Cannot cancel an expired booking');
    }

    // Authorization check
    let cancelledBy: BookingCancelledBy;

    if (operatorId) {
      // Operator cancellation
      if (booking.warehouse.operatorId !== operatorId) {
        throw new ForbiddenException('You can only cancel bookings for your warehouses');
      }
      cancelledBy = BookingCancelledBy.operator;
    } else if (userId) {
      // User cancellation
      if (booking.userId !== userId) {
        throw new ForbiddenException('You can only cancel your own bookings');
      }

      // Users can only cancel pending bookings
      if (booking.status === BookingStatus.confirmed) {
        throw new ForbiddenException(
          'Cannot cancel confirmed booking. Please contact the warehouse operator.',
        );
      }

      cancelledBy = BookingCancelledBy.user;
    } else {
      throw new ForbiddenException('Unauthorized cancellation attempt');
    }

    // Determine which status to release from
    const releaseFrom: 'reserved' | 'occupied' =
      booking.status === BookingStatus.pending ? 'reserved' : 'occupied';

    // Update booking and box quantities in transaction
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: BookingStatus.cancelled,
          cancelledBy,
          cancelReason: cancelBookingDto.cancelReason,
          cancelledAt: new Date(),
        },
      });

      // Release box quantity back to available
      await this.boxesService.releaseBox(booking.boxId, releaseFrom);

      return updated;
    });

    // Emit event
    this.eventEmitter.emit(
      'booking.cancelled',
      new BookingCancelledEvent(
        id,
        booking.userId,
        booking.warehouseId,
        cancelledBy,
        cancelBookingDto.cancelReason,
      ),
    );

    return updatedBooking;
  }

  /**
   * Auto-expire pending bookings after 24 hours
   * Called by cron job
   */
  async expirePendingBookings() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find all pending bookings created more than 24 hours ago
    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.pending,
        createdAt: {
          lt: twentyFourHoursAgo,
        },
        deletedAt: null,
      },
    });

    if (expiredBookings.length === 0) {
      return { expired: 0 };
    }

    // Expire each booking and release box quantities
    for (const booking of expiredBookings) {
      await this.prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: BookingStatus.expired,
          },
        });

        // Release box: reserved → available
        await this.boxesService.releaseBox(booking.boxId, 'reserved');
      });

      // Emit event
      this.eventEmitter.emit(
        'booking.expired',
        new BookingExpiredEvent(
          booking.id,
          booking.userId,
          booking.warehouseId,
        ),
      );
    }

    return { expired: expiredBookings.length };
  }
}
