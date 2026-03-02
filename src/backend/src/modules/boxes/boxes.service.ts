import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { FilterBoxesDto } from './dto/filter-boxes.dto';
import {
  BoxCreatedEvent,
  BoxPriceChangedEvent,
} from '../../common/events/box.events';

@Injectable()
export class BoxesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(warehouseId: number, operatorId: number, createBoxDto: CreateBoxDto) {
    // Verify warehouse exists and belongs to operator
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only add boxes to your own warehouses');
    }

    // Check if box number already exists in this warehouse
    const existing = await this.prisma.box.findUnique({
      where: {
        warehouseId_boxNumber: {
          warehouseId,
          boxNumber: createBoxDto.boxNumber,
        },
      },
    });

    if (existing && !existing.deletedAt) {
      throw new BadRequestException('Box number already exists in this warehouse');
    }

    const totalQuantity = createBoxDto.totalQuantity ?? 1;

    // Create box
    const box = await this.prisma.box.create({
      data: {
        warehouseId,
        boxNumber: createBoxDto.boxNumber,
        name: createBoxDto.name,
        description: createBoxDto.description,
        size: createBoxDto.size,
        lengthMeters: createBoxDto.lengthMeters,
        widthMeters: createBoxDto.widthMeters,
        heightMeters: createBoxDto.heightMeters,
        areaSquareMeters: createBoxDto.areaSquareMeters,
        priceMonthly: createBoxDto.priceMonthly,
        totalQuantity,
        availableQuantity: totalQuantity,
        reservedQuantity: 0,
        occupiedQuantity: 0,
        isAvailable: true,
        hasClimateControl: createBoxDto.hasClimateControl ?? false,
        hasElectricity: createBoxDto.hasElectricity ?? false,
        hasShelf: createBoxDto.hasShelf ?? false,
      },
    });

    // Emit box.created event
    this.eventEmitter.emit(
      'box.created',
      new BoxCreatedEvent(
        box.id,
        warehouseId,
        box.size,
        box.priceMonthly.toNumber(),
        String(operatorId), // actorId
      ),
    );

    return box;
  }

  async update(id: number, operatorId: number, updateBoxDto: UpdateBoxDto) {
    // Get box with warehouse
    const box = await this.prisma.box.findUnique({
      where: { id },
      include: { warehouse: true },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (box.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only update boxes in your own warehouses');
    }

    // Track price change for event emission
    const priceChanged = updateBoxDto.priceMonthly !== undefined &&
                        updateBoxDto.priceMonthly !== box.priceMonthly.toNumber();
    const oldPrice = box.priceMonthly.toNumber();

    // If updating quantities, validate
    const newTotal = updateBoxDto.totalQuantity ?? box.totalQuantity;
    const newAvailable = updateBoxDto.availableQuantity ?? box.availableQuantity;
    const newReserved = updateBoxDto.reservedQuantity ?? box.reservedQuantity;
    const newOccupied = updateBoxDto.occupiedQuantity ?? box.occupiedQuantity;

    // Validate quantity invariant: total = available + reserved + occupied
    if (newAvailable + newReserved + newOccupied > newTotal) {
      throw new BadRequestException(
        'Sum of available, reserved, and occupied quantities cannot exceed total quantity',
      );
    }

    // Check if box number is being changed and if it conflicts
    if (updateBoxDto.boxNumber && updateBoxDto.boxNumber !== box.boxNumber) {
      const existing = await this.prisma.box.findUnique({
        where: {
          warehouseId_boxNumber: {
            warehouseId: box.warehouseId,
            boxNumber: updateBoxDto.boxNumber,
          },
        },
      });

      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new BadRequestException('Box number already exists in this warehouse');
      }
    }

    // Update box
    const updatedBox = await this.prisma.box.update({
      where: { id },
      data: {
        boxNumber: updateBoxDto.boxNumber,
        name: updateBoxDto.name,
        description: updateBoxDto.description,
        size: updateBoxDto.size,
        lengthMeters: updateBoxDto.lengthMeters,
        widthMeters: updateBoxDto.widthMeters,
        heightMeters: updateBoxDto.heightMeters,
        areaSquareMeters: updateBoxDto.areaSquareMeters,
        priceMonthly: updateBoxDto.priceMonthly,
        totalQuantity: newTotal,
        availableQuantity: newAvailable,
        reservedQuantity: newReserved,
        occupiedQuantity: newOccupied,
        isAvailable: newAvailable > 0,
        hasClimateControl: updateBoxDto.hasClimateControl,
        hasElectricity: updateBoxDto.hasElectricity,
        hasShelf: updateBoxDto.hasShelf,
      },
    });

    // Emit box.price_changed event if price changed
    if (priceChanged && updateBoxDto.priceMonthly !== undefined) {
      this.eventEmitter.emit(
        'box.price_changed',
        new BoxPriceChangedEvent(
          updatedBox.id,
          box.warehouseId,
          oldPrice,
          updateBoxDto.priceMonthly,
          String(operatorId), // actorId
        ),
      );
    }

    return updatedBox;
  }

  async delete(id: number, operatorId: number) {
    const box = await this.prisma.box.findUnique({
      where: { id },
      include: { warehouse: true },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (box.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only delete boxes in your own warehouses');
    }

    // Check if box has active bookings
    const activeBookings = await this.prisma.booking.count({
      where: {
        boxId: id,
        status: {
          in: ['pending', 'confirmed'],
        },
      },
    });

    if (activeBookings > 0) {
      throw new BadRequestException(
        'Cannot delete box with active bookings. Cancel bookings first.',
      );
    }

    // Soft delete
    await this.prisma.box.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Box deleted successfully' };
  }

  async findByWarehouse(warehouseId: number, filters: FilterBoxesDto) {
    const {
      size,
      minPrice,
      maxPrice,
      isAvailable,
      hasClimateControl,
      hasElectricity,
      hasShelf,
    } = filters;

    // Build where clause
    const where: Prisma.BoxWhereInput = {
      warehouseId,
      deletedAt: null,
    };

    if (size) {
      where.size = size;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceMonthly = {};
      if (minPrice !== undefined) {
        where.priceMonthly.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.priceMonthly.lte = maxPrice;
      }
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    if (hasClimateControl !== undefined) {
      where.hasClimateControl = hasClimateControl;
    }

    if (hasElectricity !== undefined) {
      where.hasElectricity = hasElectricity;
    }

    if (hasShelf !== undefined) {
      where.hasShelf = hasShelf;
    }

    const boxes = await this.prisma.box.findMany({
      where,
      orderBy: [
        { isAvailable: 'desc' },
        { priceMonthly: 'asc' },
      ],
    });

    return boxes;
  }

  async findOne(id: number) {
    const box = await this.prisma.box.findUnique({
      where: { id },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
            emirate: true,
          },
        },
      },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    return box;
  }

  async updateAvailability(boxId: number, availableDelta: number) {
    // Internal method for booking system to update availability
    const box = await this.prisma.box.findUnique({
      where: { id: boxId },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    const newAvailable = box.availableQuantity + availableDelta;

    if (newAvailable < 0) {
      throw new BadRequestException('Insufficient available quantity');
    }

    if (newAvailable > box.totalQuantity) {
      throw new BadRequestException('Available quantity cannot exceed total quantity');
    }

    await this.prisma.box.update({
      where: { id: boxId },
      data: {
        availableQuantity: newAvailable,
        isAvailable: newAvailable > 0,
      },
    });
  }

  async reserveBox(boxId: number) {
    // Move 1 unit from available to reserved
    const box = await this.prisma.box.findUnique({
      where: { id: boxId },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (box.availableQuantity < 1) {
      throw new BadRequestException('No available units for this box');
    }

    await this.prisma.box.update({
      where: { id: boxId },
      data: {
        availableQuantity: box.availableQuantity - 1,
        reservedQuantity: box.reservedQuantity + 1,
        isAvailable: (box.availableQuantity - 1) > 0,
      },
    });
  }

  async confirmReservation(boxId: number) {
    // Move 1 unit from reserved to occupied
    const box = await this.prisma.box.findUnique({
      where: { id: boxId },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (box.reservedQuantity < 1) {
      throw new BadRequestException('No reserved units for this box');
    }

    await this.prisma.box.update({
      where: { id: boxId },
      data: {
        reservedQuantity: box.reservedQuantity - 1,
        occupiedQuantity: box.occupiedQuantity + 1,
      },
    });
  }

  async releaseBox(boxId: number, fromStatus: 'reserved' | 'occupied') {
    // Move 1 unit back to available
    const box = await this.prisma.box.findUnique({
      where: { id: boxId },
    });

    if (!box || box.deletedAt) {
      throw new NotFoundException('Box not found');
    }

    if (fromStatus === 'reserved') {
      if (box.reservedQuantity < 1) {
        throw new BadRequestException('No reserved units to release');
      }

      await this.prisma.box.update({
        where: { id: boxId },
        data: {
          reservedQuantity: box.reservedQuantity - 1,
          availableQuantity: box.availableQuantity + 1,
          isAvailable: true,
        },
      });
    } else if (fromStatus === 'occupied') {
      if (box.occupiedQuantity < 1) {
        throw new BadRequestException('No occupied units to release');
      }

      await this.prisma.box.update({
        where: { id: boxId },
        data: {
          occupiedQuantity: box.occupiedQuantity - 1,
          availableQuantity: box.availableQuantity + 1,
          isAvailable: true,
        },
      });
    }
  }
}
