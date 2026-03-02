import { Controller, Post, Get, Body, Query, Logger } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('chat')
export class WebChatController {
  private readonly logger = new Logger(WebChatController.name);

  /**
   * Send web chat message
   * POST /api/v1/chat/message
   */
  @Public()
  @Post('message')
  async sendMessage(@Body() body: any): Promise<any> {
    this.logger.log('Web chat message received');

    // TODO: Phase 3 - Implement web chat processing
    // 1. Get or create session
    // 2. Process via ConversationEngine
    // 3. Return AI response

    return {
      success: true,
      data: {
        reply: 'Hello! This is a placeholder response. Full chat coming in Phase 3.',
        sessionId: body.session_id || 'temp-session',
      },
    };
  }

  /**
   * Get chat history
   * GET /api/v1/chat/history?session_id=xxx
   */
  @Public()
  @Get('history')
  async getHistory(@Query('session_id') sessionId: string): Promise<any> {
    this.logger.log(`Chat history requested: sessionId=${sessionId}`);

    // TODO: Phase 3 - Implement history retrieval

    return {
      success: true,
      data: {
        session: { id: sessionId, channel: 'web' },
        messages: [],
      },
    };
  }
}
