import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CrmLeadStatus, UserRole } from '@prisma/client';
import { CrmService } from './crm.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { LeadResponseDto } from './dto/lead-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';

/**
 * CRM endpoints - Admin only
 * Manage leads, contacts, and activities
 */
@ApiTags('crm')
@Controller('crm/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@ApiCookieAuth('auth_token')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Lead created successfully',
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.crmService.createLead(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads with filters and pagination (admin only)' })
  @ApiQuery({ name: 'status', enum: CrmLeadStatus, required: false })
  @ApiQuery({ name: 'warehouseId', type: Number, required: false })
  @ApiQuery({ name: 'isSpam', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Leads retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/LeadResponseDto' } },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  async findAll(
    @Query('status') status?: CrmLeadStatus,
    @Query('warehouseId', new ParseIntPipe({ optional: true })) warehouseId?: number,
    @Query('isSpam') isSpam?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.crmService.findAllLeads({
      status,
      warehouseId,
      isSpam: isSpam === 'true' ? true : isSpam === 'false' ? false : undefined,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details by ID with contacts and activities (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 200,
    description: 'Lead retrieved successfully',
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.crmService.findLeadById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 200,
    description: 'Lead updated successfully',
    type: LeadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.crmService.updateLead(id, updateLeadDto, user.id);
  }

  @Post(':id/contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add contact to lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 201,
    description: 'Contact added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async addContact(
    @Param('id', ParseIntPipe) id: number,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.crmService.addContact(id, createContactDto);
  }

  @Post(':id/activities')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log activity for lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 201,
    description: 'Activity logged successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async addActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.crmService.addActivity(id, createActivityDto);
  }

  @Get(':id/contacts')
  @ApiOperation({ summary: 'Get all contacts for a lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async getContacts(@Param('id', ParseIntPipe) id: number) {
    return this.crmService.getLeadContacts(id);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get all activities for a lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async getActivities(@Param('id', ParseIntPipe) id: number) {
    return this.crmService.getLeadActivities(id);
  }

  @Get(':id/status-history')
  @ApiOperation({ summary: 'Get status change history for a lead (admin only)' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  @ApiResponse({
    status: 200,
    description: 'Status history retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async getStatusHistory(@Param('id', ParseIntPipe) id: number) {
    return this.crmService.getLeadStatusHistory(id);
  }
}
