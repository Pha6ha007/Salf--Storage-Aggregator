import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchLogService {
  private readonly logger = new Logger(SearchLogService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log a search query
   */
  async logSearch(params: {
    userId?: string;
    queryText?: string;
    filters?: any;
    emirate?: string;
    boxSize?: string;
    maxPrice?: number;
    resultsCount: number;
    resultIds?: number[];
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<number> {
    try {
      const searchLog = await this.prisma.searchLog.create({
        data: {
          userId: params.userId,
          queryText: params.queryText,
          filters: params.filters,
          emirate: params.emirate,
          boxSize: params.boxSize,
          maxPrice: params.maxPrice,
          resultsCount: params.resultsCount,
          resultIds: params.resultIds,
          sessionId: params.sessionId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });

      return searchLog.id;
    } catch (error) {
      this.logger.error('Failed to log search', error.stack);
      return 0;
    }
  }

  /**
   * Log a click on a warehouse from search results
   */
  async logClick(searchLogId: number, warehouseId: number) {
    try {
      await this.prisma.searchLog.update({
        where: { id: searchLogId },
        data: {
          clickedWarehouseId: warehouseId,
          clickedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log click for search ${searchLogId}`, error.stack);
    }
  }

  /**
   * Log a conversion (booking created from search)
   */
  async logConversion(searchLogId: number, bookingId: number) {
    try {
      await this.prisma.searchLog.update({
        where: { id: searchLogId },
        data: {
          conversionBookingId: bookingId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log conversion for search ${searchLogId}`, error.stack);
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(filters?: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [
      totalSearches,
      searchesWithClicks,
      searchesWithConversions,
      topEmirates,
      topBoxSizes,
    ] = await Promise.all([
      this.prisma.searchLog.count({ where }),
      this.prisma.searchLog.count({
        where: { ...where, clickedWarehouseId: { not: null } },
      }),
      this.prisma.searchLog.count({
        where: { ...where, conversionBookingId: { not: null } },
      }),
      this.prisma.searchLog.groupBy({
        by: ['emirate'],
        where: { ...where, emirate: { not: null } },
        _count: true,
        orderBy: { _count: { emirate: 'desc' } },
        take: 5,
      }),
      this.prisma.searchLog.groupBy({
        by: ['boxSize'],
        where: { ...where, boxSize: { not: null } },
        _count: true,
        orderBy: { _count: { boxSize: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      totalSearches,
      searchesWithClicks,
      searchesWithConversions,
      clickThroughRate: totalSearches > 0 ? searchesWithClicks / totalSearches : 0,
      conversionRate: searchesWithClicks > 0 ? searchesWithConversions / searchesWithClicks : 0,
      topEmirates,
      topBoxSizes,
    };
  }
}
