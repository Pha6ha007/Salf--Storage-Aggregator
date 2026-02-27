import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';
import { AiRequestStatus, BoxSize } from '@prisma/client';
import { BoxRecommendationRequestDto } from './dto/box-recommendation-request.dto';
import {
  BoxRecommendationResponseDto,
  BoxSizeRecommendation,
  WarehouseRecommendation,
} from './dto/box-recommendation-response.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly anthropic: Anthropic | null;
  private readonly model: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.model = this.configService.get<string>('ANTHROPIC_MODEL') || 'claude-sonnet-4-20250514';

    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
      this.logger.log('Anthropic Claude API initialized');
    } else {
      this.logger.warn('Anthropic API key not found - will use fallback mode');
      this.anthropic = null;
    }
  }

  /**
   * Get box size recommendation using AI
   * Falls back to rule-based system if AI unavailable
   */
  async getBoxRecommendation(
    request: BoxRecommendationRequestDto,
    userId?: string,
  ): Promise<BoxRecommendationResponseDto> {
    const startTime = Date.now();
    let aiResponse: BoxRecommendationResponseDto;
    let usedFallback = false;
    let status: AiRequestStatus = AiRequestStatus.success;
    let errorMessage: string | undefined;
    let tokensUsed: number | undefined;

    try {
      if (this.anthropic) {
        // Try AI recommendation
        aiResponse = await this.getAIRecommendation(request);
        tokensUsed = aiResponse['_tokensUsed']; // Internal metadata
        delete aiResponse['_tokensUsed'];
      } else {
        // Fallback to rule-based
        aiResponse = this.getFallbackRecommendation(request);
        usedFallback = true;
      }
    } catch (error) {
      this.logger.error('AI recommendation failed, using fallback', error.stack);
      aiResponse = this.getFallbackRecommendation(request);
      usedFallback = true;
      status = AiRequestStatus.error;
      errorMessage = error.message;
    }

    aiResponse.usedFallback = usedFallback;

    // Log request to database
    await this.logAiRequest({
      userId,
      requestType: 'box_recommendation',
      inputText: JSON.stringify(request),
      outputText: JSON.stringify(aiResponse),
      model: usedFallback ? 'fallback' : this.model,
      tokensUsed,
      status,
      responseTimeMs: Date.now() - startTime,
      errorMessage,
    });

    return aiResponse;
  }

  /**
   * Get AI-powered recommendation from Claude
   */
  private async getAIRecommendation(
    request: BoxRecommendationRequestDto,
  ): Promise<BoxRecommendationResponseDto> {
    const prompt = this.buildPrompt(request);

    const response = await this.anthropic!.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const contentBlock = response.content[0];
    let responseText = '';

    if (contentBlock.type === 'text') {
      responseText = contentBlock.text;
    }

    // Parse AI response
    const recommendation = this.parseAIResponse(responseText, request);
    recommendation['_tokensUsed'] = response.usage.input_tokens + response.usage.output_tokens;

    // Enrich with warehouse data
    if (request.location) {
      const warehouses = await this.findMatchingWarehouses(
        recommendation.primaryRecommendation.size,
        request.location,
        request.maxMonthlyBudget,
      );
      recommendation.warehouses = warehouses;
    }

    return recommendation;
  }

  /**
   * Build prompt for Claude AI
   */
  private buildPrompt(request: BoxRecommendationRequestDto): string {
    return `You are a storage space expert helping users find the right storage box size in the UAE.

User's storage needs:
${request.itemsDescription}
${request.durationMonths ? `Duration: ${request.durationMonths} months` : ''}
${request.location ? `Preferred location: ${request.location}` : ''}
${request.maxMonthlyBudget ? `Max budget: ${request.maxMonthlyBudget} AED/month` : ''}

Available box sizes:
- XS: 1-2 m² (1m x 1m x 2m) - Small boxes, seasonal items
- S: 2-3 m² (1.5m x 2m x 2m) - Studio apartment, small items
- M: 4-5 m² (2m x 2.5m x 2.5m) - 1-bedroom apartment furniture
- L: 6-8 m² (2.5m x 3m x 2.5m) - 2-bedroom apartment furniture
- XL: 10-12 m² (3m x 4m x 3m) - 3-bedroom apartment or office
- XXL: 15+ m² (4m x 5m x 3m) - Large villa, commercial storage

Respond with a JSON object in this exact format:
{
  "primaryRecommendation": {
    "size": "M",
    "dimensions": "4-5 m² (2m x 2.5m x 2.5m)",
    "reasoning": "Detailed explanation why this size fits",
    "fitScore": 0.85
  },
  "alternatives": [
    {
      "size": "L",
      "dimensions": "6-8 m² (2.5m x 3m x 2.5m)",
      "reasoning": "If you need more space",
      "fitScore": 0.65
    }
  ],
  "packingTips": [
    "Disassemble furniture to save space",
    "Use vertical stacking",
    "Label all boxes clearly"
  ],
  "confidence": 0.9
}

Return ONLY the JSON, no other text.`;
  }

  /**
   * Parse AI response (expecting JSON)
   */
  private parseAIResponse(
    responseText: string,
    request: BoxRecommendationRequestDto,
  ): BoxRecommendationResponseDto {
    try {
      // Extract JSON from markdown code block if present
      let jsonText = responseText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonText);

      return {
        primaryRecommendation: parsed.primaryRecommendation,
        alternatives: parsed.alternatives || [],
        warehouses: [],
        packingTips: parsed.packingTips || [],
        confidence: parsed.confidence || 0.8,
        aiModel: this.model,
        usedFallback: false,
      };
    } catch (error) {
      this.logger.error('Failed to parse AI response, using fallback', error);
      return this.getFallbackRecommendation(request);
    }
  }

  /**
   * Rule-based fallback recommendation
   */
  private getFallbackRecommendation(
    request: BoxRecommendationRequestDto,
  ): BoxRecommendationResponseDto {
    const description = request.itemsDescription.toLowerCase();
    let size = 'M';
    let reasoning = 'Based on typical storage needs';

    // Simple keyword-based sizing
    if (description.includes('studio') || description.includes('small') || description.includes('few boxes')) {
      size = 'S';
      reasoning = 'Small amount of items suitable for S size (2-3 m²)';
    } else if (
      description.includes('1-bedroom') ||
      description.includes('one bedroom') ||
      description.match(/\d+ boxes/i)
    ) {
      size = 'M';
      reasoning = 'Medium-sized items suitable for M size (4-5 m²)';
    } else if (description.includes('2-bedroom') || description.includes('two bedroom')) {
      size = 'L';
      reasoning = 'Larger amount of items suitable for L size (6-8 m²)';
    } else if (
      description.includes('3-bedroom') ||
      description.includes('three bedroom') ||
      description.includes('villa')
    ) {
      size = 'XL';
      reasoning = 'Large amount of items suitable for XL size (10-12 m²)';
    } else if (description.includes('commercial') || description.includes('office')) {
      size = 'XXL';
      reasoning = 'Commercial/office items suitable for XXL size (15+ m²)';
    }

    const sizeMap = {
      XS: '1-2 m² (1m x 1m x 2m)',
      S: '2-3 m² (1.5m x 2m x 2m)',
      M: '4-5 m² (2m x 2.5m x 2.5m)',
      L: '6-8 m² (2.5m x 3m x 2.5m)',
      XL: '10-12 m² (3m x 4m x 3m)',
      XXL: '15+ m² (4m x 5m x 3m)',
    };

    return {
      primaryRecommendation: {
        size,
        dimensions: sizeMap[size],
        reasoning,
        fitScore: 0.7,
      },
      alternatives: [],
      warehouses: [],
      packingTips: [
        'Disassemble furniture to maximize space',
        'Use sturdy boxes for heavy items',
        'Label all boxes clearly',
        'Create an inventory list',
      ],
      confidence: 0.6,
      aiModel: 'fallback',
      usedFallback: true,
    };
  }

  /**
   * Find matching warehouses with available boxes
   */
  private async findMatchingWarehouses(
    recommendedSize: string,
    location: string,
    maxBudget?: number,
  ): Promise<WarehouseRecommendation[]> {
    // Map size string to BoxSize enum
    const sizeEnum = recommendedSize as BoxSize;

    const whereClause: any = {
      status: 'active',
      deletedAt: null,
      boxes: {
        some: {
          size: sizeEnum,
          isAvailable: true,
          availableQuantity: { gt: 0 },
          deletedAt: null,
        },
      },
    };

    // Simple location filter (emirate)
    if (location) {
      const emirate = location.split(',')[0].trim();
      whereClause.emirate = { contains: emirate, mode: 'insensitive' };
    }

    const warehouses = await this.prisma.warehouse.findMany({
      where: whereClause,
      include: {
        boxes: {
          where: {
            size: sizeEnum,
            isAvailable: true,
            availableQuantity: { gt: 0 },
            deletedAt: null,
          },
          orderBy: { priceMonthly: 'asc' },
          take: 1,
        },
      },
      take: 5,
    });

    return warehouses
      .filter((wh) => {
        if (!wh.boxes.length) return false;
        if (maxBudget) {
          const price = wh.boxes[0].priceMonthly.toNumber();
          return price <= maxBudget;
        }
        return true;
      })
      .map((wh) => ({
        warehouseId: wh.id,
        warehouseName: wh.name,
        boxSize: wh.boxes[0].size,
        pricePerMonth: wh.boxes[0].priceMonthly.toNumber(),
        distanceKm: undefined, // TODO: Calculate distance if coordinates available
        matchScore: 0.8,
      }));
  }

  /**
   * Log AI request to database
   */
  private async logAiRequest(data: {
    userId?: string;
    requestType: string;
    inputText: string;
    outputText: string;
    model: string;
    tokensUsed?: number;
    status: AiRequestStatus;
    responseTimeMs: number;
    errorMessage?: string;
  }) {
    try {
      await this.prisma.aiRequestLog.create({
        data: {
          userId: data.userId,
          requestType: data.requestType,
          inputText: data.inputText,
          outputText: data.outputText,
          model: data.model,
          tokensUsed: data.tokensUsed,
          status: data.status,
          processingTimeMs: data.responseTimeMs,
          errorMessage: data.errorMessage,
        },
      });
    } catch (error) {
      this.logger.error('Failed to log AI request', error);
    }
  }
}
