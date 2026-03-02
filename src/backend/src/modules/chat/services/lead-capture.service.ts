import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';

export interface LeadCaptureData {
  phoneNumber?: string;
  email?: string;
  name?: string;
  location?: string;
  storageNeeds?: string;
  budget?: number;
  duration?: string;
  warehouseInterests?: number[];
  conversationSummary?: string;
}

@Injectable()
export class LeadCaptureService {
  private readonly logger = new Logger(LeadCaptureService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Determine if we have enough data to create a lead
   */
  canCaptureLead(data: LeadCaptureData): boolean {
    // Minimum requirements: contact info + storage intent
    const hasContactInfo = !!(data.phoneNumber || data.email);
    const hasStorageIntent = !!(
      data.location ||
      data.storageNeeds ||
      data.warehouseInterests?.length
    );

    return hasContactInfo && hasStorageIntent;
  }

  /**
   * Create a CRM lead from chat data
   */
  async captureLead(
    sessionId: string,
    channel: string,
    data: LeadCaptureData,
  ): Promise<number | null> {
    if (!this.canCaptureLead(data)) {
      this.logger.debug(
        `Not enough data to capture lead for session ${sessionId}`,
      );
      return null;
    }

    try {
      // Build lead notes
      const notes = this.buildLeadNotes(data);

      // Create CRM lead
      const lead = await this.prisma.crmLead.create({
        data: {
          name: data.name || 'Chat Lead',
          phone: data.phoneNumber || '',
          email: data.email,
          source: channel === 'whatsapp' ? 'whatsapp_chat' : 'web_chat',
          notes,
          status: 'new',
          warehouseId: data.warehouseInterests?.[0] || null, // First interested warehouse
        },
      });

      this.logger.log(`CRM lead created: id=${lead.id}, source=${channel}`);

      // Emit events for notifications/analytics
      this.eventEmitter.emit('crm.lead.created', {
        leadId: lead.id,
        source: channel,
        sessionId,
        data,
      });

      // Emit chat-specific lead captured event
      this.eventEmitter.emit('chat.lead.captured', {
        leadId: lead.id,
        sessionId,
        channel,
        phoneNumber: data.phoneNumber,
        email: data.email,
        name: data.name,
        location: data.location,
        storageNeeds: data.storageNeeds,
        budget: data.budget,
        capturedAt: new Date().toISOString(),
      });

      return lead.id;
    } catch (error) {
      this.logger.error('Error creating CRM lead:', error);
      return null;
    }
  }

  /**
   * Build structured notes from lead data
   */
  private buildLeadNotes(data: LeadCaptureData): string {
    const notes: string[] = [];

    if (data.location) {
      notes.push(`📍 Location: ${data.location}`);
    }

    if (data.storageNeeds) {
      notes.push(`📦 Storage Needs: ${data.storageNeeds}`);
    }

    if (data.budget) {
      notes.push(`💰 Budget: ${data.budget} AED/month`);
    }

    if (data.duration) {
      notes.push(`📅 Duration: ${data.duration}`);
    }

    if (data.warehouseInterests && data.warehouseInterests.length > 0) {
      notes.push(
        `🏢 Interested Warehouses: ${data.warehouseInterests.join(', ')}`,
      );
    }

    if (data.conversationSummary) {
      notes.push(`\n💬 Conversation:\n${data.conversationSummary}`);
    }

    return notes.join('\n');
  }

  /**
   * Extract lead data from conversation history
   * Enhanced: Better extraction patterns, name detection, UAE-specific locations
   */
  extractLeadData(conversationHistory: any[]): LeadCaptureData {
    const data: LeadCaptureData = {
      warehouseInterests: [],
    };

    // Analyze conversation for lead data
    for (const message of conversationHistory) {
      const content = message.content.toLowerCase();
      const originalContent = message.content; // For name extraction

      // Extract phone number (UAE formats)
      // Patterns: +971501234567, 0501234567, 971-50-123-4567
      const phonePatterns = [
        /\+971\s*\d{9}/g, // +971 501234567
        /971\s*\d{9}/g, // 971501234567
        /0\d{9}/g, // 0501234567
        /\d{3}-\d{3}-\d{4}/g, // 050-123-4567
      ];
      for (const pattern of phonePatterns) {
        const phoneMatch = content.match(pattern);
        if (phoneMatch && !data.phoneNumber) {
          data.phoneNumber = phoneMatch[0].replace(/\s/g, '');
          break;
        }
      }

      // Extract email
      const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
      if (emailMatch && !data.email) {
        data.email = emailMatch[0];
      }

      // Extract name (if user introduces themselves)
      // Patterns: "my name is", "i'm", "i am", "this is"
      const namePatterns = [
        /(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/i,
      ];
      if (!data.name) {
        for (const pattern of namePatterns) {
          const nameMatch = originalContent.match(pattern);
          if (nameMatch) {
            data.name = nameMatch[1].trim();
            break;
          }
        }
      }

      // Extract location (UAE-specific, with priority)
      const uaeLocations = [
        // Emirates
        { keyword: 'dubai', display: 'Dubai' },
        { keyword: 'abu dhabi', display: 'Abu Dhabi' },
        { keyword: 'sharjah', display: 'Sharjah' },
        { keyword: 'ajman', display: 'Ajman' },
        { keyword: 'ras al khaimah', display: 'Ras Al Khaimah' },
        { keyword: 'fujairah', display: 'Fujairah' },
        { keyword: 'umm al quwain', display: 'Umm Al Quwain' },
        // Dubai districts
        { keyword: 'jlt', display: 'JLT' },
        { keyword: 'jumeirah lake towers', display: 'JLT' },
        { keyword: 'business bay', display: 'Business Bay' },
        { keyword: 'dubai marina', display: 'Dubai Marina' },
        { keyword: 'al quoz', display: 'Al Quoz' },
        { keyword: 'jebel ali', display: 'Jebel Ali' },
        { keyword: 'dubai south', display: 'Dubai South' },
        { keyword: 'dip', display: 'DIP' },
        { keyword: 'dubai investment park', display: 'DIP' },
        { keyword: 'downtown', display: 'Downtown Dubai' },
        { keyword: 'deira', display: 'Deira' },
        { keyword: 'bur dubai', display: 'Bur Dubai' },
        // Abu Dhabi areas
        { keyword: 'mussafah', display: 'Mussafah' },
        { keyword: 'khalifa city', display: 'Khalifa City' },
      ];

      if (!data.location) {
        for (const loc of uaeLocations) {
          if (content.includes(loc.keyword)) {
            data.location = loc.display;
            break;
          }
        }
      }

      // Extract storage needs (enhanced patterns)
      const storageNeedsPatterns = [
        { pattern: /(\d+)\s*bedroom/, match: (m: any) => `${m[1]}-bedroom apartment` },
        { pattern: /(\d+)\s*br/, match: (m: any) => `${m[1]}-bedroom apartment` },
        { pattern: /studio\s+apartment/, match: () => 'studio apartment' },
        { pattern: /villa/, match: () => 'villa' },
        { pattern: /office\s+(?:furniture|equipment|inventory)/, match: () => 'office storage' },
        { pattern: /business\s+inventory/, match: () => 'business inventory' },
        { pattern: /furniture/, match: () => 'furniture storage' },
        { pattern: /boxes?\s+of\s+(\w+)/, match: (m: any) => `boxes of ${m[1]}` },
        { pattern: /moving\s+house/, match: () => 'moving/relocation' },
        { pattern: /vehicle|car|motorcycle/, match: () => 'vehicle storage' },
      ];

      if (!data.storageNeeds) {
        for (const { pattern, match } of storageNeedsPatterns) {
          const needMatch = content.match(pattern);
          if (needMatch) {
            data.storageNeeds = match(needMatch);
            break;
          }
        }
      }

      // Extract budget (enhanced)
      if (!data.budget) {
        const budgetPatterns = [
          /budget.*?(\d{3,5})\s*(?:aed|dirham)/i,
          /(\d{3,5})\s*(?:aed|dirham).*?(?:month|per month)/i,
          /around\s+(\d{3,5})/i,
          /under\s+(\d{3,5})/i,
          /less than\s+(\d{3,5})/i,
        ];
        for (const pattern of budgetPatterns) {
          const budgetMatch = content.match(pattern);
          if (budgetMatch) {
            data.budget = parseInt(budgetMatch[1], 10);
            break;
          }
        }
      }

      // Extract duration (enhanced)
      if (!data.duration) {
        const durationPatterns = [
          { pattern: /(\d+)\s*months?/, match: (m: any) => `${m[1]} month${m[1] > 1 ? 's' : ''}` },
          { pattern: /(\d+)\s*years?/, match: (m: any) => `${m[1]} year${m[1] > 1 ? 's' : ''}` },
          { pattern: /short\s*term/, match: () => 'short-term (< 3 months)' },
          { pattern: /long\s*term/, match: () => 'long-term (6+ months)' },
          { pattern: /temporary|few weeks/, match: () => 'temporary (few weeks)' },
        ];
        for (const { pattern, match } of durationPatterns) {
          const durationMatch = content.match(pattern);
          if (durationMatch) {
            data.duration = match(durationMatch);
            break;
          }
        }
      }
    }

    // Build conversation summary (last 5 messages for better context)
    const recentMessages = conversationHistory.slice(-5);
    data.conversationSummary = recentMessages
      .map((msg) => `${msg.role === 'user' ? 'Customer' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    return data;
  }
}
