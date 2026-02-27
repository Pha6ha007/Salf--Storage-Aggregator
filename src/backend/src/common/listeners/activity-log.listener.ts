import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogService } from '../services/activity-log.service';
import {
  BookingCreatedEvent,
  BookingConfirmedEvent,
  BookingCancelledEvent,
  BookingCompletedEvent,
  BookingExpiredEvent,
} from '../events/booking.events';
import {
  WarehouseCreatedEvent,
  WarehouseUpdatedEvent,
  WarehouseStatusChangedEvent,
} from '../events/warehouse.events';
import { BoxCreatedEvent, BoxPriceChangedEvent } from '../events/box.events';
import { UserRegisteredEvent } from '../events/user.events';
import { ReviewCreatedEvent } from '../events/review.events';
import { LeadCreatedEvent, LeadStatusChangedEvent } from '../events/crm.events';
import { MediaUploadedEvent, MediaDeletedEvent } from '../events/media.events';

@Injectable()
export class ActivityLogListener {
  constructor(private readonly activityLogService: ActivityLogService) {}

  // ==================== BOOKING EVENTS ====================

  @OnEvent('booking.created')
  async handleBookingCreated(event: BookingCreatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'booking.created',
      entityType: 'booking',
      entityId: String(event.bookingId),
      actorId: event.actorId || event.userId,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
        boxId: event.boxId,
        priceTotal: event.priceTotal,
      },
    });
  }

  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(event: BookingConfirmedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'booking.confirmed',
      entityType: 'booking',
      entityId: String(event.bookingId),
      actorId: event.actorId,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
        operatorId: event.operatorId,
      },
    });
  }

  @OnEvent('booking.cancelled')
  async handleBookingCancelled(event: BookingCancelledEvent) {
    await this.activityLogService.logEvent({
      eventName: 'booking.cancelled',
      entityType: 'booking',
      entityId: String(event.bookingId),
      actorId: event.actorId,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
        cancelledBy: event.cancelledBy,
        cancelReason: event.cancelReason,
      },
    });
  }

  @OnEvent('booking.completed')
  async handleBookingCompleted(event: BookingCompletedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'booking.completed',
      entityType: 'booking',
      entityId: String(event.bookingId),
      actorId: event.actorId,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
        operatorId: event.operatorId,
      },
    });
  }

  @OnEvent('booking.expired')
  async handleBookingExpired(event: BookingExpiredEvent) {
    await this.activityLogService.logEvent({
      eventName: 'booking.expired',
      entityType: 'booking',
      entityId: String(event.bookingId),
      actorId: undefined,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
      },
    });
  }

  // ==================== WAREHOUSE EVENTS ====================

  @OnEvent('warehouse.created')
  async handleWarehouseCreated(event: WarehouseCreatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'warehouse.created',
      entityType: 'warehouse',
      entityId: String(event.warehouseId),
      actorId: event.actorId,
      payload: {
        operatorId: event.operatorId,
        name: event.name,
        emirate: event.emirate,
      },
    });
  }

  @OnEvent('warehouse.updated')
  async handleWarehouseUpdated(event: WarehouseUpdatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'warehouse.updated',
      entityType: 'warehouse',
      entityId: String(event.warehouseId),
      actorId: event.actorId,
      payload: {
        operatorId: event.operatorId,
        changes: event.changes,
      },
    });
  }

  @OnEvent('warehouse.status_changed')
  async handleWarehouseStatusChanged(event: WarehouseStatusChangedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'warehouse.status_changed',
      entityType: 'warehouse',
      entityId: String(event.warehouseId),
      actorId: event.actorId,
      payload: {
        operatorId: event.operatorId,
        fromStatus: event.fromStatus,
        toStatus: event.toStatus,
      },
    });
  }

  // ==================== BOX EVENTS ====================

  @OnEvent('box.created')
  async handleBoxCreated(event: BoxCreatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'box.created',
      entityType: 'box',
      entityId: String(event.boxId),
      actorId: event.actorId,
      payload: {
        warehouseId: event.warehouseId,
        size: event.size,
        priceMonthly: event.priceMonthly,
      },
    });
  }

  @OnEvent('box.price_changed')
  async handleBoxPriceChanged(event: BoxPriceChangedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'box.price_changed',
      entityType: 'box',
      entityId: String(event.boxId),
      actorId: event.actorId,
      payload: {
        warehouseId: event.warehouseId,
        oldPrice: event.oldPrice,
        newPrice: event.newPrice,
      },
    });
  }

  // ==================== USER EVENTS ====================

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    await this.activityLogService.logEvent({
      eventName: 'user.registered',
      entityType: 'user',
      entityId: event.userId,
      actorId: event.userId,
      payload: {
        email: event.email,
        role: event.role,
      },
    });
  }

  // ==================== REVIEW EVENTS ====================

  @OnEvent('review.created')
  async handleReviewCreated(event: ReviewCreatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'review.created',
      entityType: 'review',
      entityId: String(event.reviewId),
      actorId: event.actorId || event.userId,
      payload: {
        userId: event.userId,
        warehouseId: event.warehouseId,
        bookingId: event.bookingId,
        rating: event.rating,
      },
    });
  }

  // ==================== CRM EVENTS ====================

  @OnEvent('lead.created')
  async handleLeadCreated(event: LeadCreatedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'lead.created',
      entityType: 'lead',
      entityId: String(event.leadId),
      actorId: event.actorId,
      payload: {
        name: event.name,
        phone: event.phone,
        email: event.email,
        source: event.source,
      },
    });
  }

  @OnEvent('lead.status_changed')
  async handleLeadStatusChanged(event: LeadStatusChangedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'lead.status_changed',
      entityType: 'lead',
      entityId: String(event.leadId),
      actorId: event.actorId,
      payload: {
        fromStatus: event.fromStatus,
        toStatus: event.toStatus,
        reason: event.reason,
      },
    });
  }

  // ==================== MEDIA EVENTS ====================

  @OnEvent('media.uploaded')
  async handleMediaUploaded(event: MediaUploadedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'media.uploaded',
      entityType: 'media',
      entityId: String(event.mediaId),
      actorId: event.actorId,
      payload: {
        warehouseId: event.warehouseId,
        fileUrl: event.fileUrl,
        fileType: event.fileType,
      },
    });
  }

  @OnEvent('media.deleted')
  async handleMediaDeleted(event: MediaDeletedEvent) {
    await this.activityLogService.logEvent({
      eventName: 'media.deleted',
      entityType: 'media',
      entityId: String(event.mediaId),
      actorId: event.actorId,
      payload: {
        warehouseId: event.warehouseId,
        fileUrl: event.fileUrl,
      },
    });
  }
}
