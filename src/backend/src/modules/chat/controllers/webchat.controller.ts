import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Logger,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ChatRateLimitGuard } from '../guards/chat-rate-limit.guard';
import { ChatSessionService } from '../services/chat-session.service';
import { ConversationEngineService } from '../services/conversation-engine.service';
import {
  SendChatMessageDto,
  ChatMessageResponseDto,
  ChatHistoryResponseDto,
} from '../dto/chat-message.dto';
import { ChatChannel } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Controller('chat')
export class WebChatController {
  private readonly logger = new Logger(WebChatController.name);

  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly conversationEngine: ConversationEngineService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Send web chat message
   * POST /api/v1/chat/message
   *
   * Rate Limits:
   * - Anonymous: 20 requests/hour
   * - Authenticated: 50 requests/hour
   */
  @Public()
  @UseGuards(ChatRateLimitGuard)
  @Post('message')
  async sendMessage(
    @Body() dto: SendChatMessageDto,
    @CurrentUser() user: any,
  ): Promise<ChatMessageResponseDto> {
    this.logger.log(
      `Web chat message received: sessionId=${dto.session_id}, userId=${user?.id || 'anonymous'}`,
    );

    try {
      // 1. Get or create session
      let session = await this.chatSessionService.findByToken(dto.session_id);

      if (!session) {
        // Create new session
        const sessionToken = this.generateSessionToken();
        const newSession = await this.chatSessionService.create({
          channel: ChatChannel.web,
          sessionToken,
          userId: user?.id,
          language: 'en',
          pageContext: dto.page_context || {},
        });

        // Fetch full session with relations
        session = await this.chatSessionService.findById(newSession.id);
        if (!session) {
          throw new Error('Failed to create session');
        }

        this.logger.log(`Created new web chat session: id=${session.id}`);
      } else {
        // Update session with latest page context
        if (dto.page_context) {
          await this.chatSessionService.update(session.id, {
            metadata: {
              ...((session.metadata as any) || {}),
              lastPageContext: dto.page_context,
            },
          });
        }

        // Extend session expiry
        await this.chatSessionService.extendExpiry(session.id);
      }

      // 2. Process message via ConversationEngine
      const response = await this.conversationEngine.processMessage({
        sessionId: session.id,
        message: dto.message,
        pageContext: dto.page_context,
      });

      // 3. Return response
      return {
        success: true,
        data: {
          reply: response.reply,
          intent: response.intent,
          confidence: response.confidence,
          suggestions: response.suggestions,
          warehouses: response.warehouses,
          session_id: session.sessionToken || session.id,
        },
      };
    } catch (error) {
      this.logger.error('Error processing web chat message:', error);
      throw new HttpException(
        'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get chat history
   * GET /api/v1/chat/history?session_id=xxx&limit=50
   */
  @Public()
  @Get('history')
  async getHistory(
    @Query('session_id') sessionId: string,
    @Query('limit') limit?: string,
  ): Promise<ChatHistoryResponseDto> {
    this.logger.log(`Chat history requested: sessionId=${sessionId}`);

    if (!sessionId) {
      throw new HttpException(
        'session_id is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Find session
      const session = await this.chatSessionService.findByToken(sessionId);
      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // Get conversation history
      const messageLimit = limit ? Math.min(parseInt(limit, 10), 100) : 50;
      const messages = await this.prisma.aiConversation.findMany({
        where: {
          chatSessionId: session.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: messageLimit,
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        data: {
          session: {
            id: session.sessionToken || session.id,
            channel: session.channel,
            created_at: session.createdAt.toISOString(),
          },
          messages: messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            created_at: msg.createdAt.toISOString(),
          })),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error fetching chat history:', error);
      throw new HttpException(
        'Failed to fetch history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate unique session token for web chat
   */
  private generateSessionToken(): string {
    return `web_${randomBytes(16).toString('hex')}`;
  }
}

