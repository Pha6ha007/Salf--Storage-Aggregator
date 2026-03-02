import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { TwilioSignatureGuard } from '../guards/twilio-signature.guard';
import { WhatsAppWebhookDto, ProcessWhatsAppMessageDto } from '../dto/whatsapp-webhook.dto';
import { ChatSessionService } from '../services/chat-session.service';
import { ConversationEngineService } from '../services/conversation-engine.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ChatChannel } from '@prisma/client';

@Controller('chat/whatsapp')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly conversationEngine: ConversationEngineService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  /**
   * Twilio WhatsApp webhook endpoint
   * Receives incoming WhatsApp messages
   *
   * POST /api/v1/chat/whatsapp/webhook
   */
  @Public()
  @UseGuards(TwilioSignatureGuard)
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() webhook: WhatsAppWebhookDto): Promise<void> {
    this.logger.log(`WhatsApp message received: From=${webhook.From}, MessageSid=${webhook.MessageSid}`);

    // Process webhook asynchronously (don't block Twilio)
    setImmediate(() => this.processWebhookAsync(webhook));

    // Return 200 immediately to Twilio
    return;
  }

  /**
   * Process webhook asynchronously
   * This runs after we've already responded to Twilio
   */
  private async processWebhookAsync(webhook: WhatsAppWebhookDto): Promise<void> {
    try {
      // 1. Parse webhook data
      const messageData = this.parseWebhookData(webhook);

      this.logger.debug(
        `Processing WhatsApp message: phone=${messageData.phoneNumber}, message="${messageData.message}"`,
      );

      // 2. Check for media (not supported in MVP)
      if (messageData.hasMedia) {
        await this.whatsappService.sendMessage(
          webhook.From,
          'Sorry, media messages are not supported yet. Please send text only.',
        );
        return;
      }

      // 3. Get or create chat session
      let session = await this.chatSessionService.findByPhone(
        messageData.phoneNumber,
      );

      if (!session) {
        // Create new session
        const newSession = await this.chatSessionService.create({
          channel: ChatChannel.whatsapp,
          phoneNumber: messageData.phoneNumber,
          language: 'en', // Will be detected from message
        });

        // Fetch full session with relations
        session = await this.chatSessionService.findById(newSession.id);
        if (!session) {
          throw new Error('Failed to create session');
        }

        this.logger.log(`Created new WhatsApp session: id=${session.id}`);
      } else {
        // Extend session expiry
        await this.chatSessionService.extendExpiry(session.id);
      }

      // 4. Process message via ConversationEngine
      const response = await this.conversationEngine.processMessage({
        sessionId: session.id,
        message: messageData.message,
        pageContext: {
          channel: 'whatsapp',
          profileName: messageData.profileName,
        },
      });

      // 5. Send AI reply back via WhatsApp
      const sent = await this.whatsappService.sendMessage(
        webhook.From,
        response.reply,
      );

      if (!sent) {
        this.logger.error(`Failed to send WhatsApp reply to ${webhook.From}`);
      } else {
        this.logger.log(
          `WhatsApp reply sent: intent=${response.intent}, confidence=${response.confidence.toFixed(2)}`,
        );
      }
    } catch (error) {
      this.logger.error('Error processing WhatsApp webhook:', error);

      // Try to send error message to user
      try {
        await this.whatsappService.sendMessage(
          webhook.From,
          "I'm having trouble processing your message. Please try again in a moment or contact us at +971-XXX-XXXX.",
        );
      } catch (sendError) {
        this.logger.error('Failed to send error message:', sendError);
      }
    }
  }

  /**
   * Parse Twilio webhook data into internal format
   */
  private parseWebhookData(webhook: WhatsAppWebhookDto): ProcessWhatsAppMessageDto {
    // Extract phone number (remove 'whatsapp:' prefix)
    const phoneNumber = webhook.From.replace('whatsapp:', '');

    // Check for media
    const numMedia = webhook.NumMedia ? parseInt(webhook.NumMedia, 10) : 0;
    const hasMedia = numMedia > 0;

    return {
      phoneNumber,
      message: webhook.Body.trim(),
      profileName: webhook.ProfileName,
      messageSid: webhook.MessageSid,
      hasMedia,
      mediaUrl: hasMedia ? webhook.MediaUrl0 : undefined,
    };
  }
}
