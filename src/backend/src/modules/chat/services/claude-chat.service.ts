import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponseOptions {
  systemPrompt: string;
  conversationHistory: ChatMessage[];
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

@Injectable()
export class ClaudeChatService {
  private readonly logger = new Logger(ClaudeChatService.name);
  private readonly anthropic: Anthropic | null;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.model =
      this.configService.get<string>('AI_CHAT_MODEL') ||
      this.configService.get<string>('ANTHROPIC_MODEL') ||
      'claude-sonnet-4-20250514';

    this.maxTokens =
      this.configService.get<number>('AI_CHAT_MAX_TOKENS') || 1024;
    this.temperature =
      this.configService.get<number>('AI_CHAT_TEMPERATURE') || 0.3;

    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
      this.logger.log(`Claude Chat API initialized: model=${this.model}`);
    } else {
      this.logger.warn('Anthropic API key not found - chat will use fallback');
      this.anthropic = null;
    }
  }

  /**
   * Generate chat response using Claude API
   */
  async generateResponse(
    options: ClaudeResponseOptions,
  ): Promise<ClaudeResponse> {
    if (!this.anthropic) {
      // Fallback response when API not available
      return {
        content:
          "I'm having trouble connecting right now. Please try again in a moment or browse our catalog: https://storagecompare.ae/catalog",
        tokensUsed: 0,
        model: 'fallback',
      };
    }

    try {
      const startTime = Date.now();

      // Build messages array: history + new user message
      const messages: Anthropic.MessageParam[] = [
        ...options.conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: options.userMessage,
        },
      ];

      // Call Claude API
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
        system: options.systemPrompt,
        messages,
      });

      const processingTime = Date.now() - startTime;

      // Extract text content from response
      const content =
        response.content[0].type === 'text'
          ? response.content[0].text
          : '';

      const tokensUsed =
        response.usage.input_tokens + response.usage.output_tokens;

      this.logger.log(
        `Claude response generated: tokens=${tokensUsed}, time=${processingTime}ms`,
      );

      return {
        content,
        tokensUsed,
        model: this.model,
      };
    } catch (error) {
      this.logger.error('Claude API error:', error);

      // Return graceful fallback
      return {
        content:
          "I'm having trouble processing your request right now. Please try again or contact support at +971-XXX-XXXX.",
        tokensUsed: 0,
        model: 'error-fallback',
      };
    }
  }

  /**
   * Build system prompt for chat assistant
   */
  buildSystemPrompt(language: string = 'en'): string {
    const basePrompt = `You are the StorageCompare.ae AI assistant — helpful, friendly, and concise.

RULES:
1. Base answers ONLY on provided context (RAG + search results). Never invent data.
2. Prices in AED/month. Box sizes: S (1-3m²), M (3-6m²), L (6-12m²), XL (12m²+).
3. Keep responses short: max 3-4 sentences for simple questions, 6-8 for complex ones.
4. When suggesting warehouses: include name, district, price, rating, and link.
5. Do NOT make bookings or modify data. Only provide information and links.
6. If unsure, say so clearly. Suggest browsing catalog or calling support.
7. Capture lead data when possible: what they need, location, duration, budget.
8. When user wants human contact: provide phone +971-XXX-XXXX or link to /contact.

FORMAT for warehouse recommendations:
📦 {name} — {district}, {city}
   ⭐ {rating} · From {price} AED/month
   👉 View: https://storagecompare.ae/warehouse/{id}

IMPORTANT: If no relevant context is provided, don't make up information. Instead, guide user to browse catalog or contact support.`;

    if (language === 'ar') {
      return (
        basePrompt +
        '\n\nNote: Respond in Arabic if the user is communicating in Arabic.'
      );
    }

    return basePrompt;
  }

  /**
   * Mask PII (personally identifiable information) for logging
   */
  maskPII(text: string): string {
    return text
      .replace(/\+?\d{10,15}/g, '+***PHONE***')
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '***EMAIL***')
      .replace(/\b\d{16}\b/g, '***CARD***');
  }
}
