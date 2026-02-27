import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { Twilio } from 'twilio';

/**
 * NotificationService - Multi-channel notification delivery
 *
 * Channels:
 * - Email via SendGrid
 * - SMS via Twilio
 * - WhatsApp via Twilio Business API
 *
 * All methods are fail-safe: log errors but never throw to caller
 * This ensures notification failures don't break main application flow
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly sendGridClient: typeof sgMail | null;
  private readonly twilioClient: Twilio | null;
  private readonly fromEmail: string;
  private readonly fromPhone: string;
  private readonly fromWhatsApp: string;

  constructor(private configService: ConfigService) {
    // Initialize SendGrid
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (sendGridApiKey) {
      sgMail.setApiKey(sendGridApiKey);
      this.sendGridClient = sgMail;
      this.fromEmail =
        this.configService.get<string>('SENDGRID_FROM') ||
        'noreply@storagecompare.ae';
      this.logger.log('SendGrid client initialized');
    } else {
      this.sendGridClient = null;
      this.fromEmail = '';
      this.logger.warn('SendGrid API key not configured - email disabled');
    }

    // Initialize Twilio
    const twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    if (twilioAccountSid && twilioAuthToken) {
      this.twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
      this.fromPhone =
        this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';
      this.fromWhatsApp =
        this.configService.get<string>('TWILIO_WHATSAPP_NUMBER') || '';
      this.logger.log('Twilio client initialized');
    } else {
      this.twilioClient = null;
      this.fromPhone = '';
      this.fromWhatsApp = '';
      this.logger.warn('Twilio credentials not configured - SMS/WhatsApp disabled');
    }
  }

  /**
   * Send email via SendGrid
   *
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param html - HTML email body
   * @param text - Plain text fallback (optional)
   * @returns true if sent, false if failed
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<boolean> {
    if (!this.sendGridClient) {
      this.logger.warn('Cannot send email - SendGrid not configured');
      return false;
    }

    try {
      await this.sendGridClient.send({
        to,
        from: this.fromEmail,
        subject,
        html,
        text: text || this.stripHtml(html),
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${subject}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Send SMS via Twilio
   *
   * @param to - Recipient phone number (E.164 format: +971xxxxxxxxx)
   * @param message - SMS message text
   * @returns true if sent, false if failed
   */
  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('Cannot send SMS - Twilio not configured');
      return false;
    }

    try {
      await this.twilioClient.messages.create({
        to,
        from: this.fromPhone,
        body: message,
      });

      this.logger.log(`SMS sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}`, error.stack);
      return false;
    }
  }

  /**
   * Send WhatsApp message via Twilio Business API
   *
   * @param to - Recipient phone number (E.164 format with whatsapp: prefix)
   * @param message - WhatsApp message text
   * @returns true if sent, false if failed
   */
  async sendWhatsApp(to: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('Cannot send WhatsApp - Twilio not configured');
      return false;
    }

    try {
      // Ensure whatsapp: prefix
      const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      await this.twilioClient.messages.create({
        to: whatsappTo,
        from: this.fromWhatsApp,
        body: message,
      });

      this.logger.log(`WhatsApp sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp to ${to}`, error.stack);
      return false;
    }
  }

  /**
   * Strip HTML tags for plain text fallback
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
