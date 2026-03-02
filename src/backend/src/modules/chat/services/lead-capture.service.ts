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

      // Emit event for notifications/analytics
      this.eventEmitter.emit('crm.lead.created', {
        leadId: lead.id,
        source: channel,
        sessionId,
        data,
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
   */
  extractLeadData(conversationHistory: any[]): LeadCaptureData {
    const data: LeadCaptureData = {
      warehouseInterests: [],
    };

    // Analyze conversation for lead data
    for (const message of conversationHistory) {
      const content = message.content.toLowerCase();

      // Extract phone number
      const phoneMatch = content.match(/\+?\d{10,15}/);
      if (phoneMatch && !data.phoneNumber) {
        data.phoneNumber = phoneMatch[0];
      }

      // Extract email
      const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch && !data.email) {
        data.email = emailMatch[0];
      }

      // Extract location hints
      const locations = [
        'dubai',
        'abu dhabi',
        'sharjah',
        'jlt',
        'business bay',
        'marina',
      ];
      for (const loc of locations) {
        if (content.includes(loc) && !data.location) {
          data.location = loc;
          break;
        }
      }

      // Extract storage needs
      const needsKeywords = ['bedroom', 'apartment', 'office', 'furniture'];
      for (const keyword of needsKeywords) {
        if (content.includes(keyword) && !data.storageNeeds) {
          data.storageNeeds = keyword;
          break;
        }
      }

      // Extract budget
      const budgetMatch = content.match(/(\d{3,5})\s*aed/i);
      if (budgetMatch && !data.budget) {
        data.budget = parseInt(budgetMatch[1], 10);
      }

      // Extract duration
      const durationKeywords = ['month', 'months', 'year', 'years'];
      for (const keyword of durationKeywords) {
        if (content.includes(keyword) && !data.duration) {
          const durationMatch = content.match(
            new RegExp(`(\\d+)\\s*${keyword}`),
          );
          if (durationMatch) {
            data.duration = `${durationMatch[1]} ${keyword}`;
            break;
          }
        }
      }
    }

    // Build conversation summary (last 3 messages)
    const recentMessages = conversationHistory.slice(-3);
    data.conversationSummary = recentMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    return data;
  }
}
