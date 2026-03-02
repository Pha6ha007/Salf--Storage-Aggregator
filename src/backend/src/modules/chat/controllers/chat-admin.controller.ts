import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ChatSessionService } from '../services/chat-session.service';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * ChatAdminController — Admin monitoring endpoints for chat analytics
 * Provides session list, statistics, and analytics for admin/operators
 */
@ApiTags('Chat Admin')
@ApiBearerAuth()
@Controller('admin/chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
export class ChatAdminController {
  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /api/v1/admin/chat/sessions
   * Retrieves list of chat sessions with filters and statistics
   */
  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chat sessions with filters and stats',
    description:
      'Admin endpoint to retrieve chat sessions, filter by channel/lead status, and get analytics stats',
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    enum: ['whatsapp', 'web'],
    description: 'Filter by channel type',
  })
  @ApiQuery({
    name: 'has_lead',
    required: false,
    type: Boolean,
    description: 'Filter sessions with captured leads',
  })
  @ApiQuery({
    name: 'date_from',
    required: false,
    type: String,
    description: 'Filter sessions from this date (ISO 8601)',
  })
  @ApiQuery({
    name: 'date_to',
    required: false,
    type: String,
    description: 'Filter sessions until this date (ISO 8601)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    type: Number,
    description: 'Items per page (default: 20, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat sessions retrieved successfully with stats',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              channel: { type: 'string' },
              phoneNumber: { type: 'string', nullable: true },
              userId: { type: 'string', nullable: true },
              messageCount: { type: 'number' },
              leadCaptured: { type: 'boolean' },
              leadId: { type: 'number', nullable: true },
              lastMessageAt: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            per_page: { type: 'number' },
            total: { type: 'number' },
            total_pages: { type: 'number' },
          },
        },
        stats: {
          type: 'object',
          properties: {
            total_sessions_today: { type: 'number' },
            whatsapp_sessions: { type: 'number' },
            web_sessions: { type: 'number' },
            leads_captured: { type: 'number' },
            avg_messages_per_session: { type: 'number' },
            avg_response_time_ms: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin/operator only' })
  async getSessions(
    @Query('channel') channel?: 'whatsapp' | 'web',
    @Query('has_lead') hasLead?: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('page') page = '1',
    @Query('per_page') perPage = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const perPageNum = Math.min(100, Math.max(1, parseInt(perPage, 10)));
    const skip = (pageNum - 1) * perPageNum;

    // Build filters
    const where: any = {};

    if (channel) {
      where.channel = channel;
    }

    if (hasLead === 'true') {
      where.leadCaptured = true;
    } else if (hasLead === 'false') {
      where.leadCaptured = false;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Execute queries in parallel
    const [sessions, total, stats] = await Promise.all([
      // Get sessions list
      this.prisma.chatSession.findMany({
        where,
        select: {
          id: true,
          channel: true,
          phoneNumber: true,
          userId: true,
          messageCount: true,
          leadCaptured: true,
          leadId: true,
          lastMessageAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPageNum,
      }),

      // Get total count
      this.prisma.chatSession.count({ where }),

      // Get statistics
      this.calculateStats(),
    ]);

    return {
      success: true,
      data: sessions,
      pagination: {
        page: pageNum,
        per_page: perPageNum,
        total,
        total_pages: Math.ceil(total / perPageNum),
      },
      stats,
    };
  }

  /**
   * Calculate chat statistics
   * - Today's sessions count
   * - Sessions by channel
   * - Leads captured
   * - Average messages per session
   * - Average response time (from ai_requests_log)
   */
  private async calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parallel queries for stats
    const [
      totalToday,
      whatsappCount,
      webCount,
      leadsCount,
      avgMessagesResult,
      avgResponseTimeResult,
    ] = await Promise.all([
      // Total sessions today
      this.prisma.chatSession.count({
        where: {
          createdAt: { gte: today },
        },
      }),

      // WhatsApp sessions (all time)
      this.prisma.chatSession.count({
        where: { channel: 'whatsapp' },
      }),

      // Web sessions (all time)
      this.prisma.chatSession.count({
        where: { channel: 'web' },
      }),

      // Leads captured (all time)
      this.prisma.chatSession.count({
        where: { leadCaptured: true },
      }),

      // Average messages per session
      this.prisma.chatSession.aggregate({
        _avg: {
          messageCount: true,
        },
      }),

      // Average response time from ai_request_log (chat requests only)
      this.prisma.aiRequestLog.aggregate({
        where: {
          requestType: {
            in: ['chat_whatsapp', 'chat_web'],
          },
          processingTimeMs: {
            not: null,
          },
        },
        _avg: {
          processingTimeMs: true,
        },
      }),
    ]);

    return {
      total_sessions_today: totalToday,
      whatsapp_sessions: whatsappCount,
      web_sessions: webCount,
      leads_captured: leadsCount,
      avg_messages_per_session: avgMessagesResult._avg.messageCount
        ? parseFloat(avgMessagesResult._avg.messageCount.toFixed(1))
        : 0,
      avg_response_time_ms:
        avgResponseTimeResult._avg && avgResponseTimeResult._avg.processingTimeMs
          ? Math.round(avgResponseTimeResult._avg.processingTimeMs)
          : 0,
    };
  }
}
