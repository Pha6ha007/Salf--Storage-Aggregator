import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChatChannel } from '@prisma/client';

interface CreateSessionDto {
  channel: ChatChannel;
  userId?: string;
  phoneNumber?: string;
  sessionToken?: string;
  language?: string;
  pageContext?: Record<string, any>;
}

interface UpdateSessionDto {
  messageCount?: number;
  lastMessageAt?: Date;
  leadCaptured?: boolean;
  leadId?: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class ChatSessionService {
  private readonly logger = new Logger(ChatSessionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new chat session
   */
  async create(data: CreateSessionDto) {
    this.logger.log(`Creating new chat session: channel=${data.channel}`);

    const session = await this.prisma.chatSession.create({
      data: {
        channel: data.channel,
        userId: data.userId,
        phoneNumber: data.phoneNumber,
        sessionToken: data.sessionToken,
        language: data.language || 'en',
        pageContext: data.pageContext || {},
        messageCount: 0,
        lastMessageAt: new Date(),
      },
    });

    this.logger.log(`Chat session created: id=${session.id}`);
    return session;
  }

  /**
   * Find session by ID
   */
  async findById(id: string) {
    return this.prisma.chatSession.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        lead: true,
      },
    });
  }

  /**
   * Find session by phone number (WhatsApp)
   */
  async findByPhone(phoneNumber: string) {
    // Find the most recent non-expired session
    return this.prisma.chatSession.findFirst({
      where: {
        phoneNumber,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        lead: true,
      },
    });
  }

  /**
   * Find session by session token (Web Chat)
   */
  async findByToken(sessionToken: string) {
    return this.prisma.chatSession.findFirst({
      where: {
        sessionToken,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        lead: true,
      },
    });
  }

  /**
   * Update session
   */
  async update(id: string, data: UpdateSessionDto) {
    return this.prisma.chatSession.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Increment message count
   */
  async incrementMessageCount(id: string) {
    return this.prisma.chatSession.update({
      where: { id },
      data: {
        messageCount: {
          increment: 1,
        },
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Mark lead as captured
   */
  async markLeadCaptured(id: string, leadId: number) {
    this.logger.log(`Marking session ${id} as lead captured: leadId=${leadId}`);

    return this.prisma.chatSession.update({
      where: { id },
      data: {
        leadCaptured: true,
        leadId,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Extend session expiry (24 hours from now)
   */
  async extendExpiry(id: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return this.prisma.chatSession.update({
      where: { id },
      data: {
        expiresAt,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete expired sessions (cleanup job)
   */
  async deleteExpired() {
    const result = await this.prisma.chatSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    this.logger.log(`Deleted ${result.count} expired chat sessions`);
    return result.count;
  }

  /**
   * Get session statistics
   */
  async getStats(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, byChannel, leadsCaptured] = await Promise.all([
      // Total sessions
      this.prisma.chatSession.count({ where }),

      // Sessions by channel
      this.prisma.chatSession.groupBy({
        by: ['channel'],
        where,
        _count: true,
      }),

      // Leads captured
      this.prisma.chatSession.count({
        where: {
          ...where,
          leadCaptured: true,
        },
      }),
    ]);

    return {
      total,
      whatsapp: byChannel.find(c => c.channel === 'whatsapp')?._count || 0,
      web: byChannel.find(c => c.channel === 'web')?._count || 0,
      leadsCaptured,
    };
  }
}
