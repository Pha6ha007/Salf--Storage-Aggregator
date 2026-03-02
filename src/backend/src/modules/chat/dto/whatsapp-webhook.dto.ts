import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for incoming Twilio WhatsApp webhook
 * Twilio sends data as form-urlencoded
 */
export class WhatsAppWebhookDto {
  @IsString()
  @IsNotEmpty()
  MessageSid: string;

  @IsString()
  @IsNotEmpty()
  From: string; // whatsapp:+971501234567

  @IsString()
  @IsNotEmpty()
  To: string; // whatsapp:+14155238886

  @IsString()
  @IsNotEmpty()
  Body: string;

  @IsString()
  @IsOptional()
  ProfileName?: string;

  @IsString()
  @IsOptional()
  NumMedia?: string;

  @IsString()
  @IsOptional()
  MediaUrl0?: string;

  @IsString()
  @IsOptional()
  MediaContentType0?: string;

  @IsString()
  @IsOptional()
  AccountSid?: string;

  @IsString()
  @IsOptional()
  MessagingServiceSid?: string;
}

/**
 * Internal DTO for processing WhatsApp message
 */
export class ProcessWhatsAppMessageDto {
  phoneNumber: string; // +971501234567 (without whatsapp: prefix)
  message: string;
  profileName?: string;
  messageSid: string;
  hasMedia: boolean;
  mediaUrl?: string;
}
