import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChatSessionService } from './chat-session.service';
import { IntentClassifierService, ChatIntent } from './intent-classifier.service';
import { ClaudeChatService, ChatMessage } from './claude-chat.service';
import { RagService } from './rag.service';
import { LeadCaptureService } from './lead-capture.service';
import { AiRequestStatus } from '@prisma/client';

export interface ProcessMessageRequest {
  sessionId: string;
  message: string;
  pageContext?: Record<string, any>;
}

export interface ProcessMessageResponse {
  reply: string;
  intent: ChatIntent;
  confidence: number;
  suggestions?: string[];
  warehouses?: any[];
  sessionId: string;
}

@Injectable()
export class ConversationEngineService {
  private readonly logger = new Logger(ConversationEngineService.name);
  private readonly maxHistoryMessages: number = 20;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatSessionService: ChatSessionService,
    private readonly intentClassifier: IntentClassifierService,
    private readonly claudeChat: ClaudeChatService,
    private readonly ragService: RagService,
    private readonly leadCapture: LeadCaptureService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Process incoming chat message and generate response
   * Main orchestration method
   */
  async processMessage(
    request: ProcessMessageRequest,
  ): Promise<ProcessMessageResponse> {
    const startTime = Date.now();

    try {
      // 1. Get or validate session
      const session = await this.chatSessionService.findById(request.sessionId);
      if (!session) {
        throw new Error(`Session not found: ${request.sessionId}`);
      }

      // 2. Classify intent
      const classification = this.intentClassifier.classify(request.message);
      this.logger.log(
        `Intent: ${classification.intent} (${classification.confidence.toFixed(2)})`,
      );

      // 3. Detect language
      const language = this.intentClassifier.detectLanguage(request.message);

      // 4. Extract entities (location, size, price)
      const entities = this.intentClassifier.extractEntities(request.message);

      // 5. Get conversation history (sliding window)
      const history = await this.getConversationHistory(request.sessionId);

      // 6. Build context based on intent
      const context = await this.buildContext(
        classification.intent,
        request.message,
        entities,
        request.pageContext,
      );

      // 7. Build system prompt
      const systemPrompt = this.claudeChat.buildSystemPrompt(language);

      // 8. Get AI response
      const aiResponse = await this.claudeChat.generateResponse({
        systemPrompt,
        conversationHistory: history,
        userMessage: this.enrichUserMessage(request.message, context),
        maxTokens: 1024,
        temperature: 0.3,
      });

      // 9. Save conversation to database
      await this.saveConversation(
        request.sessionId,
        session.channel,
        request.message,
        aiResponse.content,
        classification,
        aiResponse,
      );

      // 10. Update session
      await this.chatSessionService.incrementMessageCount(request.sessionId);

      // 11. Extract warehouses from response (if any)
      const warehouses = this.extractWarehousesFromResponse(aiResponse.content);

      // 12. Generate suggestions
      const suggestions = this.generateSuggestions(classification.intent);

      // 13. Check for lead capture
      await this.attemptLeadCapture(request.sessionId, session.channel, history);

      // 14. Log processing time
      const processingTime = Date.now() - startTime;
      this.logger.log(`Message processed in ${processingTime}ms`);

      return {
        reply: aiResponse.content,
        intent: classification.intent,
        confidence: classification.confidence,
        suggestions,
        warehouses,
        sessionId: request.sessionId,
      };
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Get conversation history (last N messages)
   */
  private async getConversationHistory(
    sessionId: string,
  ): Promise<ChatMessage[]> {
    const conversations = await this.prisma.aiConversation.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: this.maxHistoryMessages,
    });

    // Reverse to get chronological order
    return conversations
      .reverse()
      .map((conv) => ({
        role: conv.role as 'user' | 'assistant',
        content: conv.content,
      }));
  }

  /**
   * Build context based on intent
   */
  private async buildContext(
    intent: ChatIntent,
    message: string,
    entities: any,
    pageContext?: Record<string, any>,
  ): Promise<string> {
    let context = '';

    // Add RAG context
    if (
      intent === ChatIntent.SEARCH_WAREHOUSE ||
      intent === ChatIntent.PRICE_INQUIRY ||
      intent === ChatIntent.FAQ
    ) {
      const ragContext = await this.ragService.searchContext(message, 5);
      context += this.ragService.buildContextString(ragContext);
    }

    // Add entity context
    if (Object.keys(entities).length > 0) {
      context += `\n\nEXTRACTED ENTITIES:\n`;
      if (entities.location) context += `Location: ${entities.location}\n`;
      if (entities.size) context += `Size preference: ${entities.size}\n`;
      if (entities.maxPrice) context += `Max budget: ${entities.maxPrice} AED\n`;
    }

    // Add page context (for web chat)
    if (pageContext && Object.keys(pageContext).length > 0) {
      context += `\n\nPAGE CONTEXT:\n${JSON.stringify(pageContext, null, 2)}\n`;
    }

    return context;
  }

  /**
   * Enrich user message with context for Claude
   */
  private enrichUserMessage(message: string, context: string): string {
    if (!context.trim()) {
      return message;
    }

    return `${context}\n\n---\n\nUSER MESSAGE: ${message}`;
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(
    sessionId: string,
    channel: string,
    userMessage: string,
    assistantReply: string,
    classification: any,
    aiResponse: any,
  ): Promise<void> {
    try {
      // Save user message
      await this.prisma.aiConversation.create({
        data: {
          sessionId,
          channel,
          chatSessionId: sessionId,
          role: 'user',
          content: this.claudeChat.maskPII(userMessage),
          intent: classification.intent,
          confidence: classification.confidence,
          metadata: {
            keywords: classification.keywords,
          },
        },
      });

      // Save assistant reply
      await this.prisma.aiConversation.create({
        data: {
          sessionId,
          channel,
          chatSessionId: sessionId,
          role: 'assistant',
          content: assistantReply,
          tokensUsed: aiResponse.tokensUsed,
          model: aiResponse.model,
          metadata: {},
        },
      });

      // Log AI request
      await this.prisma.aiRequestLog.create({
        data: {
          requestType: 'chat_message',
          inputText: this.claudeChat.maskPII(userMessage),
          outputText: assistantReply.substring(0, 500), // Truncate for storage
          model: aiResponse.model,
          tokensUsed: aiResponse.tokensUsed,
          status: AiRequestStatus.success,
          processingTimeMs: 0, // Set by caller if needed
          metadata: {
            intent: classification.intent,
            confidence: classification.confidence,
          },
        },
      });
    } catch (error) {
      this.logger.error('Error saving conversation:', error);
      // Don't throw - conversation should continue even if logging fails
    }
  }

  /**
   * Extract warehouse references from AI response
   */
  private extractWarehousesFromResponse(response: string): any[] {
    // Look for warehouse IDs in markdown links
    // Format: [name](https://storagecompare.ae/warehouse/123)
    const warehousePattern = /warehouse\/(\d+)/g;
    const matches = [...response.matchAll(warehousePattern)];

    return matches.map((match) => ({
      id: parseInt(match[1], 10),
    }));
  }

  /**
   * Generate quick reply suggestions based on intent
   */
  private generateSuggestions(intent: ChatIntent): string[] {
    const suggestionMap: Record<ChatIntent, string[]> = {
      [ChatIntent.SEARCH_WAREHOUSE]: [
        'Show me prices',
        'What sizes are available?',
        'View on map',
      ],
      [ChatIntent.SIZE_RECOMMENDATION]: [
        'Show me warehouses',
        'Compare prices',
        'How do I book?',
      ],
      [ChatIntent.PRICE_INQUIRY]: [
        'Find cheapest options',
        'What is included?',
        'View warehouse details',
      ],
      [ChatIntent.BOOKING_HELP]: [
        'How long can I rent?',
        'What documents do I need?',
        'Can I visit first?',
      ],
      [ChatIntent.OPERATOR_CONTACT]: [
        'Call now',
        'Send email',
        'Browse catalog instead',
      ],
      [ChatIntent.COMPLAINT]: [
        'Talk to manager',
        'Submit formal complaint',
        'View refund policy',
      ],
      [ChatIntent.FAQ]: [
        'View all FAQs',
        'Search warehouses',
        'Contact support',
      ],
      [ChatIntent.GENERAL]: [
        'Search warehouses',
        'What size do I need?',
        'View pricing',
      ],
    };

    return suggestionMap[intent] || suggestionMap[ChatIntent.GENERAL];
  }

  /**
   * Attempt to capture lead if enough data is available
   */
  private async attemptLeadCapture(
    sessionId: string,
    channel: string,
    history: ChatMessage[],
  ): Promise<void> {
    try {
      // Check if lead already captured
      const session = await this.chatSessionService.findById(sessionId);
      if (session?.leadCaptured) {
        return;
      }

      // Extract lead data from conversation
      const leadData = this.leadCapture.extractLeadData(history);

      // Check if we can capture lead
      if (this.leadCapture.canCaptureLead(leadData)) {
        const leadId = await this.leadCapture.captureLead(
          sessionId,
          channel,
          leadData,
        );

        if (leadId) {
          await this.chatSessionService.markLeadCaptured(sessionId, leadId);
          this.logger.log(`Lead captured for session ${sessionId}: leadId=${leadId}`);
        }
      }
    } catch (error) {
      this.logger.error('Error in lead capture:', error);
      // Don't throw - lead capture failure shouldn't break chat
    }
  }
}
