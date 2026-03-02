import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

/**
 * DTO for web chat message request
 */
export class SendChatMessageDto {
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  channel?: string; // 'web' by default

  @IsObject()
  @IsOptional()
  page_context?: Record<string, any>;
}

/**
 * DTO for chat message response
 */
export class ChatMessageResponseDto {
  success: boolean;
  data: {
    reply: string;
    intent: string;
    confidence: number;
    suggestions?: string[];
    warehouses?: any[];
    session_id: string;
  };
}

/**
 * DTO for chat history request
 */
export class GetChatHistoryDto {
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsOptional()
  limit?: number;
}

/**
 * DTO for chat history response
 */
export class ChatHistoryResponseDto {
  success: boolean;
  data: {
    session: {
      id: string;
      channel: string;
      created_at: string;
    };
    messages: Array<{
      id: string;
      role: string;
      content: string;
      created_at: string;
    }>;
  };
}
