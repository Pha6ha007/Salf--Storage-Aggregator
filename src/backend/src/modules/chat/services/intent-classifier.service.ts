import { Injectable, Logger } from '@nestjs/common';

export enum ChatIntent {
  SEARCH_WAREHOUSE = 'search_warehouse',
  SIZE_RECOMMENDATION = 'size_recommendation',
  PRICE_INQUIRY = 'price_inquiry',
  BOOKING_HELP = 'booking_help',
  OPERATOR_CONTACT = 'operator_contact',
  COMPLAINT = 'complaint',
  FAQ = 'faq',
  GENERAL = 'general',
}

export interface IntentClassificationResult {
  intent: ChatIntent;
  confidence: number;
  keywords: string[];
}

@Injectable()
export class IntentClassifierService {
  private readonly logger = new Logger(IntentClassifierService.name);

  // Keyword patterns for intent classification
  private readonly intentPatterns = {
    [ChatIntent.SEARCH_WAREHOUSE]: {
      keywords: [
        // Location-based search
        'near', 'close to', 'area', 'location', 'where', 'find',
        'around', 'in', 'district', 'city', 'emirate',
        // Storage-related
        'storage', 'warehouse', 'facility', 'space', 'unit',
        // Arabic transliterations
        'قريب', 'بالقرب', 'في', 'موقع',
      ],
      weight: 1.0,
    },
    [ChatIntent.SIZE_RECOMMENDATION]: {
      keywords: [
        // Size-related
        'size', 'fit', 'room', 'bedroom', 'apartment', 'items',
        'how much space', 'what size', 'need', 'big enough',
        // Items
        'furniture', 'boxes', 'sofa', 'bed', 'wardrobe',
        // Arabic
        'حجم', 'مساحة', 'غرفة',
      ],
      weight: 1.0,
    },
    [ChatIntent.PRICE_INQUIRY]: {
      keywords: [
        // Price-related
        'price', 'cost', 'how much', 'rate', 'aed', 'dirham',
        'expensive', 'cheap', 'budget', 'affordable', 'payment',
        'per month', 'monthly', 'total',
        // Arabic
        'سعر', 'كم', 'درهم', 'تكلفة',
      ],
      weight: 1.0,
    },
    [ChatIntent.BOOKING_HELP]: {
      keywords: [
        // Booking-related
        'book', 'reserve', 'reservation', 'rent', 'lease',
        'available', 'availability', 'when can', 'start',
        // Arabic
        'حجز', 'احجز', 'متاح',
      ],
      weight: 0.9,
    },
    [ChatIntent.OPERATOR_CONTACT]: {
      keywords: [
        // Human contact
        'human', 'agent', 'operator', 'person', 'talk to',
        'speak with', 'call', 'phone', 'contact',
        'representative', 'manager', 'help',
        // Arabic
        'موظف', 'شخص', 'تحدث', 'اتصل',
      ],
      weight: 1.2, // Higher weight - important to escalate
    },
    [ChatIntent.COMPLAINT]: {
      keywords: [
        // Negative feedback
        'complain', 'complaint', 'issue', 'problem', 'bad',
        'terrible', 'awful', 'disappointed', 'not satisfied',
        'refund', 'cancel', 'unhappy',
        // Arabic
        'شكوى', 'مشكلة', 'سيء',
      ],
      weight: 1.3, // Highest weight - needs attention
    },
    [ChatIntent.FAQ]: {
      keywords: [
        // General questions
        'hours', 'open', 'close', 'working hours', 'schedule',
        'access', '24/7', 'security', 'insurance', 'parking',
        'climate control', 'features', 'amenities',
        // Arabic
        'ساعات', 'مفتوح', 'مغلق', 'أمان',
      ],
      weight: 0.8,
    },
  };

  /**
   * Classify user message intent based on keywords
   */
  classify(message: string): IntentClassificationResult {
    const normalizedMessage = message.toLowerCase().trim();

    // Calculate scores for each intent
    const scores: Record<ChatIntent, { score: number; keywords: string[] }> = {
      [ChatIntent.SEARCH_WAREHOUSE]: { score: 0, keywords: [] },
      [ChatIntent.SIZE_RECOMMENDATION]: { score: 0, keywords: [] },
      [ChatIntent.PRICE_INQUIRY]: { score: 0, keywords: [] },
      [ChatIntent.BOOKING_HELP]: { score: 0, keywords: [] },
      [ChatIntent.OPERATOR_CONTACT]: { score: 0, keywords: [] },
      [ChatIntent.COMPLAINT]: { score: 0, keywords: [] },
      [ChatIntent.FAQ]: { score: 0, keywords: [] },
      [ChatIntent.GENERAL]: { score: 0, keywords: [] },
    };

    // Score each intent based on keyword matches
    for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
      for (const keyword of pattern.keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          scores[intent as ChatIntent].score += pattern.weight;
          scores[intent as ChatIntent].keywords.push(keyword);
        }
      }
    }

    // Find the intent with highest score
    let maxScore = 0;
    let topIntent: ChatIntent = ChatIntent.GENERAL;
    let matchedKeywords: string[] = [];

    for (const [intent, result] of Object.entries(scores)) {
      if (result.score > maxScore) {
        maxScore = result.score;
        topIntent = intent as ChatIntent;
        matchedKeywords = result.keywords;
      }
    }

    // Calculate confidence (0.0 to 1.0)
    // If no keywords matched, confidence is 0
    // Otherwise, normalize score to confidence
    const confidence = maxScore > 0
      ? Math.min(maxScore / 3, 1.0) // Cap at 1.0, normalize based on typical scores
      : 0.0;

    this.logger.debug(
      `Intent classified: ${topIntent} (confidence: ${confidence.toFixed(2)}, keywords: [${matchedKeywords.join(', ')}])`
    );

    return {
      intent: topIntent,
      confidence,
      keywords: matchedKeywords,
    };
  }

  /**
   * Detect language (simple heuristic)
   */
  detectLanguage(message: string): 'en' | 'ar' {
    // Check for Arabic characters
    const arabicPattern = /[\u0600-\u06FF]/;
    const hasArabic = arabicPattern.test(message);

    if (hasArabic) {
      return 'ar';
    }

    return 'en';
  }

  /**
   * Extract entities from message (location, size, price)
   */
  extractEntities(message: string): {
    location?: string;
    size?: string;
    maxPrice?: number;
  } {
    const normalizedMessage = message.toLowerCase();
    const entities: {
      location?: string;
      size?: string;
      maxPrice?: number;
    } = {};

    // Extract location (Dubai emirates and districts)
    const locations = [
      'dubai', 'abu dhabi', 'sharjah', 'ajman', 'ras al khaimah', 'fujairah', 'umm al quwain',
      'jlt', 'jumeirah lake towers', 'business bay', 'downtown', 'marina', 'deira',
      'bur dubai', 'al barsha', 'tecom', 'dmcc', 'jbr', 'palm jumeirah',
    ];

    for (const loc of locations) {
      if (normalizedMessage.includes(loc)) {
        entities.location = loc;
        break;
      }
    }

    // Extract size (S, M, L, XL)
    const sizePatterns = [
      { pattern: /\b(small|s|1-3m|1-3\s*m²)\b/i, size: 'S' },
      { pattern: /\b(medium|m|3-6m|3-6\s*m²)\b/i, size: 'M' },
      { pattern: /\b(large|l|6-12m|6-12\s*m²)\b/i, size: 'L' },
      { pattern: /\b(extra large|xl|12\+m|12\+\s*m²|very large)\b/i, size: 'XL' },
    ];

    for (const { pattern, size } of sizePatterns) {
      if (pattern.test(normalizedMessage)) {
        entities.size = size;
        break;
      }
    }

    // Extract max price (AED)
    const pricePattern = /(\d{1,5})\s*(aed|dirham)/i;
    const priceMatch = normalizedMessage.match(pricePattern);
    if (priceMatch) {
      entities.maxPrice = parseInt(priceMatch[1], 10);
    }

    return entities;
  }
}
