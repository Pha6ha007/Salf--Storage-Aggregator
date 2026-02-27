import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log an event to events_log table
   */
  async logEvent(params: {
    eventName: string;
    entityType?: string;
    entityId?: string;
    actorId?: string;
    payload?: any;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  }) {
    try {
      await this.prisma.eventLog.create({
        data: {
          eventName: params.eventName,
          entityType: params.entityType,
          entityId: params.entityId,
          actorId: params.actorId,
          payload: params.payload,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          requestId: params.requestId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log event ${params.eventName}`, error.stack);
    }
  }

  /**
   * Get event logs with filters
   */
  async getEventLogs(filters?: {
    eventName?: string;
    entityType?: string;
    entityId?: string;
    actorId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.eventName) where.eventName = filters.eventName;
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.entityId) where.entityId = filters.entityId;
    if (filters?.actorId) where.actorId = filters.actorId;

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });
  }
}
