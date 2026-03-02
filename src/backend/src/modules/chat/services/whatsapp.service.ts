import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly twilioClient: twilio.Twilio | null;
  private readonly whatsappNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.whatsappNumber =
      this.configService.get<string>('TWILIO_WHATSAPP_NUMBER') ||
      'whatsapp:+14155238886'; // Sandbox default

    if (accountSid && authToken) {
      try {
        this.twilioClient = twilio.default(accountSid, authToken);
        this.logger.log('Twilio WhatsApp client initialized');
      } catch (error) {
        this.logger.warn(`Twilio initialization failed: ${error.message} - WhatsApp disabled`);
        this.twilioClient = null;
      }
    } else {
      this.logger.warn('Twilio credentials not found - WhatsApp disabled');
      this.twilioClient = null;
    }
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendMessage(to: string, body: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.error('Twilio client not initialized');
      return false;
    }

    try {
      // Ensure 'to' has whatsapp: prefix
      const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      const message = await this.twilioClient.messages.create({
        from: this.whatsappNumber,
        to: toNumber,
        body,
      });

      this.logger.log(`WhatsApp message sent: sid=${message.sid}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Validate Twilio signature for webhook security
   */
  validateSignature(
    signature: string,
    url: string,
    params: Record<string, any>,
  ): boolean {
    if (!this.twilioClient) {
      return false;
    }

    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    if (!authToken) {
      return false;
    }

    try {
      return twilio.default.validateRequest(
        authToken,
        signature,
        url,
        params,
      );
    } catch (error) {
      this.logger.error('Error validating Twilio signature:', error);
      return false;
    }
  }
}
