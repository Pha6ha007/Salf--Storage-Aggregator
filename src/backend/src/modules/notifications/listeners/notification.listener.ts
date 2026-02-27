import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationService } from '../notification.service';
import {
  BookingCreatedEvent,
  BookingConfirmedEvent,
  BookingCancelledEvent,
  BookingCompletedEvent,
} from '../../../common/events/booking.events';
import { UserRegisteredEvent } from '../../../common/events/user.events';
import {
  generateBookingCreatedEmail,
  BookingCreatedData,
} from '../templates/booking-created.template';
import {
  generateBookingConfirmedEmail,
  generateBookingConfirmedSMS,
  BookingConfirmedData,
} from '../templates/booking-confirmed.template';
import {
  generateBookingCancelledEmail,
  BookingCancelledData,
} from '../templates/booking-cancelled.template';
import {
  generateBookingCompletedEmail,
  BookingCompletedData,
} from '../templates/booking-completed.template';
import { generateWelcomeEmail, WelcomeData } from '../templates/welcome.template';

/**
 * NotificationListener - Event-driven notification dispatcher
 *
 * Listens to Event Bus and sends notifications via email, SMS, WhatsApp
 * All operations wrapped in try/catch to ensure failures don't break main flow
 */
@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);
  private readonly appUrl: string;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl =
      this.configService.get<string>('APP_URL') || 'https://storagecompare.ae';
  }

  /**
   * Booking Created → Email to operator
   */
  @OnEvent('booking.created')
  async handleBookingCreated(event: BookingCreatedEvent) {
    try {
      this.logger.log(`Sending booking created notification for booking ${event.bookingId}`);

      // Fetch booking with related data
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.bookingId },
        include: {
          user: true,
          warehouse: {
            include: {
              operator: {
                include: {
                  user: true,
                },
              },
            },
          },
          box: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking ${event.bookingId} not found`);
        return;
      }

      const operatorEmail = booking.warehouse.operator.user.email;
      const operatorName = `${booking.warehouse.operator.user.firstName} ${booking.warehouse.operator.user.lastName}`;

      const emailData: BookingCreatedData = {
        operatorName,
        warehouseName: booking.warehouse.name,
        bookingId: booking.id,
        customerName: `${booking.user.firstName} ${booking.user.lastName}`,
        customerPhone: booking.user.phone || '',
        customerEmail: booking.user.email,
        boxSize: booking.box.size,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        priceTotal: booking.priceTotal.toNumber(),
        dashboardUrl: `${this.appUrl}/operator/bookings/${booking.id}`,
      };

      const { subject, html } = generateBookingCreatedEmail(emailData);
      await this.notificationService.sendEmail(operatorEmail, subject, html);
    } catch (error) {
      this.logger.error(
        `Failed to send booking created notification for booking ${event.bookingId}`,
        error.stack,
      );
    }
  }

  /**
   * Booking Confirmed → Email + SMS to user
   */
  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(event: BookingConfirmedEvent) {
    try {
      this.logger.log(`Sending booking confirmed notification for booking ${event.bookingId}`);

      // Fetch booking with related data
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.bookingId },
        include: {
          user: true,
          warehouse: {
            include: {
              operator: true,
            },
          },
          box: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking ${event.bookingId} not found`);
        return;
      }

      const userEmail = booking.user.email;
      const userName = `${booking.user.firstName} ${booking.user.lastName}`;
      const userPhone = booking.user.phone;

      const emailData: BookingConfirmedData = {
        customerName: userName,
        bookingId: booking.id,
        warehouseName: booking.warehouse.name,
        warehouseAddress: booking.warehouse.address,
        boxSize: booking.box.size,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        priceTotal: booking.priceTotal.toNumber(),
        operatorPhone: booking.warehouse.contactPhone || '',
        bookingUrl: `${this.appUrl}/bookings/${booking.id}`,
      };

      // Send email
      const { subject, html } = generateBookingConfirmedEmail(emailData);
      await this.notificationService.sendEmail(userEmail, subject, html);

      // Send SMS if user has phone
      if (userPhone) {
        const smsText = generateBookingConfirmedSMS(emailData);
        await this.notificationService.sendSMS(userPhone, smsText);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send booking confirmed notification for booking ${event.bookingId}`,
        error.stack,
      );
    }
  }

  /**
   * Booking Cancelled → Email to both parties
   */
  @OnEvent('booking.cancelled')
  async handleBookingCancelled(event: BookingCancelledEvent) {
    try {
      this.logger.log(`Sending booking cancelled notification for booking ${event.bookingId}`);

      // Fetch booking with related data
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.bookingId },
        include: {
          user: true,
          warehouse: {
            include: {
              operator: {
                include: {
                  user: true,
                },
              },
            },
          },
          box: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking ${event.bookingId} not found`);
        return;
      }

      const cancelledBy = event.actorId === booking.userId ? 'user' : 'operator';

      // Email to user
      const userEmailData: BookingCancelledData = {
        recipientName: `${booking.user.firstName} ${booking.user.lastName}`,
        recipientType: 'user',
        bookingId: booking.id,
        warehouseName: booking.warehouse.name,
        boxSize: booking.box.size,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        cancelledBy,
        reason: event.cancelReason,
      };

      const userEmail = generateBookingCancelledEmail(userEmailData);
      await this.notificationService.sendEmail(
        booking.user.email,
        userEmail.subject,
        userEmail.html,
      );

      // Email to operator
      const operatorEmailData: BookingCancelledData = {
        recipientName: `${booking.warehouse.operator.user.firstName} ${booking.warehouse.operator.user.lastName}`,
        recipientType: 'operator',
        bookingId: booking.id,
        warehouseName: booking.warehouse.name,
        boxSize: booking.box.size,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        cancelledBy,
        reason: event.cancelReason,
      };

      const operatorEmail = generateBookingCancelledEmail(operatorEmailData);
      await this.notificationService.sendEmail(
        booking.warehouse.operator.user.email,
        operatorEmail.subject,
        operatorEmail.html,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send booking cancelled notification for booking ${event.bookingId}`,
        error.stack,
      );
    }
  }

  /**
   * Booking Completed → Email to user (encourage review)
   */
  @OnEvent('booking.completed')
  async handleBookingCompleted(event: BookingCompletedEvent) {
    try {
      this.logger.log(`Sending booking completed notification for booking ${event.bookingId}`);

      // Fetch booking with related data
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.bookingId },
        include: {
          user: true,
          warehouse: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking ${event.bookingId} not found`);
        return;
      }

      const emailData: BookingCompletedData = {
        customerName: `${booking.user.firstName} ${booking.user.lastName}`,
        bookingId: booking.id,
        warehouseName: booking.warehouse.name,
        reviewUrl: `${this.appUrl}/warehouses/${booking.warehouseId}/review?bookingId=${booking.id}`,
      };

      const { subject, html } = generateBookingCompletedEmail(emailData);
      await this.notificationService.sendEmail(
        booking.user.email,
        subject,
        html,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send booking completed notification for booking ${event.bookingId}`,
        error.stack,
      );
    }
  }

  /**
   * User Registered → Welcome email
   */
  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    try {
      this.logger.log(`Sending welcome email to user ${event.userId}`);

      // Fetch user
      const user = await this.prisma.user.findUnique({
        where: { id: event.userId },
      });

      if (!user) {
        this.logger.warn(`User ${event.userId} not found`);
        return;
      }

      const emailData: WelcomeData = {
        firstName: user.firstName || 'User',
        email: user.email,
      };

      const { subject, html } = generateWelcomeEmail(emailData);
      await this.notificationService.sendEmail(user.email, subject, html);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to user ${event.userId}`,
        error.stack,
      );
    }
  }
}
