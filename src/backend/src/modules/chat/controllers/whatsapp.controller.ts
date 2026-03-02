import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('chat/whatsapp')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  /**
   * Twilio WhatsApp webhook endpoint
   * Receives incoming WhatsApp messages
   */
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-twilio-signature') signature: string,
  ): Promise<void> {
    this.logger.log('WhatsApp webhook received');
    this.logger.debug('Webhook body:', body);

    // TODO: Phase 2 - Implement webhook processing
    // 1. Validate Twilio signature
    // 2. Extract message data
    // 3. Process via ConversationEngine
    // 4. Send reply via WhatsAppService

    // For now, just log and return 200
    return;
  }
}
