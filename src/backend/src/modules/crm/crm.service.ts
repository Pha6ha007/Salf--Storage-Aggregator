import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CrmLeadStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { LeadCreatedEvent, LeadStatusChangedEvent } from '../../common/events/crm.events';

@Injectable()
export class CrmService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a new lead
   */
  async createLead(createLeadDto: CreateLeadDto) {
    const lead = await this.prisma.crmLead.create({
      data: {
        name: createLeadDto.name,
        phone: createLeadDto.phone,
        email: createLeadDto.email,
        warehouseId: createLeadDto.warehouseId,
        userId: createLeadDto.userId,
        source: createLeadDto.source,
        notes: createLeadDto.notes,
        isSpam: createLeadDto.isSpam || false,
        status: CrmLeadStatus.new,
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create status history entry for initial status
    await this.prisma.crmStatusHistory.create({
      data: {
        leadId: lead.id,
        fromStatus: null,
        toStatus: CrmLeadStatus.new,
        reason: 'Lead created',
      },
    });

    // Emit event
    this.eventEmitter.emit(
      'lead.created',
      new LeadCreatedEvent(
        lead.id,
        lead.name,
        lead.phone,
        lead.email || undefined,
        lead.source || undefined,
      ),
    );

    return lead;
  }

  /**
   * Get all leads with filters and pagination
   */
  async findAllLeads(filters?: {
    status?: CrmLeadStatus;
    warehouseId?: number;
    isSpam?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.isSpam !== undefined) {
      where.isSpam = filters.isSpam;
    }

    const [leads, total] = await Promise.all([
      this.prisma.crmLead.findMany({
        where,
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              contacts: true,
              activities: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.crmLead.count({ where }),
    ]);

    return {
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get lead by ID with full details
   */
  async findLeadById(id: number) {
    const lead = await this.prisma.crmLead.findUnique({
      where: { id },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contacts: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            activityType: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedByUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  /**
   * Update lead (including status changes)
   */
  async updateLead(id: number, updateLeadDto: UpdateLeadDto, changedByUserId?: string) {
    const existingLead = await this.prisma.crmLead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      throw new NotFoundException('Lead not found');
    }

    // Status change validation
    if (updateLeadDto.status && updateLeadDto.status !== existingLead.status) {
      this.validateStatusTransition(existingLead.status, updateLeadDto.status);
    }

    const { statusChangeReason, ...updateData } = updateLeadDto;

    // Update lead and create status history in transaction
    const updatedLead = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.crmLead.update({
        where: { id },
        data: updateData,
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // If status changed, record it in history
      if (updateLeadDto.status && updateLeadDto.status !== existingLead.status) {
        await tx.crmStatusHistory.create({
          data: {
            leadId: id,
            fromStatus: existingLead.status,
            toStatus: updateLeadDto.status,
            changedByUserId,
            reason: statusChangeReason || 'Status updated',
          },
        });
      }

      return updated;
    });

    // Emit event if status changed
    if (updateLeadDto.status && updateLeadDto.status !== existingLead.status) {
      this.eventEmitter.emit(
        'lead.status_changed',
        new LeadStatusChangedEvent(
          id,
          existingLead.status,
          updateLeadDto.status,
          statusChangeReason,
          changedByUserId,
        ),
      );
    }

    return updatedLead;
  }

  /**
   * Validate CRM status state machine transitions
   * State machine: new → contacted → in_progress → closed
   */
  private validateStatusTransition(from: CrmLeadStatus, to: CrmLeadStatus) {
    const validTransitions: Record<CrmLeadStatus, CrmLeadStatus[]> = {
      [CrmLeadStatus.new]: [CrmLeadStatus.contacted, CrmLeadStatus.closed],
      [CrmLeadStatus.contacted]: [CrmLeadStatus.in_progress, CrmLeadStatus.closed],
      [CrmLeadStatus.in_progress]: [CrmLeadStatus.closed],
      [CrmLeadStatus.closed]: [], // Terminal state
    };

    if (!validTransitions[from].includes(to)) {
      throw new BadRequestException(
        `Invalid status transition from ${from} to ${to}. Valid transitions: ${validTransitions[from].join(', ') || 'none (terminal state)'}`,
      );
    }
  }

  /**
   * Add contact to lead
   */
  async addContact(leadId: number, createContactDto: CreateContactDto) {
    // Verify lead exists
    const lead = await this.prisma.crmLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const contact = await this.prisma.crmContact.create({
      data: {
        leadId,
        contactType: createContactDto.contactType,
        initiatedBy: createContactDto.initiatedBy,
        subject: createContactDto.subject,
        message: createContactDto.message,
        durationSeconds: createContactDto.durationSeconds,
      },
    });

    return contact;
  }

  /**
   * Add activity to lead
   */
  async addActivity(leadId: number, createActivityDto: CreateActivityDto) {
    // Verify lead exists
    const lead = await this.prisma.crmLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const activity = await this.prisma.crmActivity.create({
      data: {
        leadId,
        title: createActivityDto.title,
        description: createActivityDto.description,
        dueDate: createActivityDto.dueDate ? new Date(createActivityDto.dueDate) : null,
        activityTypeId: createActivityDto.activityTypeId,
        completed: createActivityDto.completed || false,
        completedAt: createActivityDto.completed ? new Date() : null,
      },
      include: {
        activityType: true,
      },
    });

    return activity;
  }

  /**
   * Get lead contacts
   */
  async getLeadContacts(leadId: number) {
    const lead = await this.prisma.crmLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.crmContact.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get lead activities
   */
  async getLeadActivities(leadId: number) {
    const lead = await this.prisma.crmLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.crmActivity.findMany({
      where: { leadId },
      include: {
        activityType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get lead status history
   */
  async getLeadStatusHistory(leadId: number) {
    const lead = await this.prisma.crmLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.crmStatusHistory.findMany({
      where: { leadId },
      include: {
        changedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
