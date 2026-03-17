import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole, WarehouseStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SuspendUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  internal_notes?: string;
}

class RejectOperatorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

class ApproveWarehouseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  admin_notes?: string;
}

class RejectWarehouseDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reason: string;
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Dashboard ─────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Admin dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'suspended', 'all'] })
  listUsers(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('status') status?: 'active' | 'suspended' | 'all',
  ) {
    return this.adminService.listUsers({ page, perPage, search, role, status });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details' })
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Post('users/:id/suspend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspend user account' })
  suspendUser(@Param('id') id: string, @Body() dto: SuspendUserDto) {
    return this.adminService.suspendUser(id, dto.reason);
  }

  @Post('users/:id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore suspended user' })
  restoreUser(@Param('id') id: string) {
    return this.adminService.restoreUser(id);
  }

  // ── Operators ─────────────────────────────────────────────────────────────

  @Get('operators')
  @ApiOperation({ summary: 'List operators' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'verified', required: false, type: Boolean })
  listOperators(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('search') search?: string,
    @Query('verified') verified?: string,
  ) {
    const verifiedFilter =
      verified === 'true' ? true : verified === 'false' ? false : undefined;
    return this.adminService.listOperators({ page, perPage, search, verified: verifiedFilter });
  }

  @Post('operators/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve operator' })
  approveOperator(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveOperator(id);
  }

  @Post('operators/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject operator application' })
  rejectOperator(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectOperatorDto,
  ) {
    return this.adminService.rejectOperator(id, dto.reason);
  }

  // ── Warehouses ────────────────────────────────────────────────────────────

  @Get('warehouses')
  @ApiOperation({ summary: 'List all warehouses (admin view)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: WarehouseStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'operator_id', required: false, type: Number })
  listWarehouses(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('status') status?: WarehouseStatus,
    @Query('search') search?: string,
    @Query('operator_id') operatorId?: number,
  ) {
    return this.adminService.listWarehouses({ page, perPage, status, search, operatorId });
  }

  @Post('warehouses/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve warehouse (pending_moderation → active)' })
  approveWarehouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveWarehouseDto,
  ) {
    return this.adminService.approveWarehouse(id, dto.admin_notes);
  }

  @Post('warehouses/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject warehouse (→ blocked)' })
  rejectWarehouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectWarehouseDto,
  ) {
    return this.adminService.rejectWarehouse(id, dto.reason);
  }

  @Post('warehouses/:id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force-disable warehouse (→ blocked + inactive)' })
  disableWarehouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectWarehouseDto,
  ) {
    return this.adminService.forceDisableWarehouse(id, dto.reason);
  }

  // ── Bookings ──────────────────────────────────────────────────────────────

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings (admin view)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'warehouse_id', required: false, type: Number })
  @ApiQuery({ name: 'user_id', required: false })
  listBookings(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('status') status?: string,
    @Query('warehouse_id') warehouseId?: number,
    @Query('user_id') userId?: string,
  ) {
    return this.adminService.listBookings({ page, perPage, status, warehouseId, userId });
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  @Get('reviews')
  @ApiOperation({ summary: 'List all reviews (moderation)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'is_visible', required: false, type: Boolean })
  listReviews(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('is_visible') isVisible?: string,
  ) {
    const visibleFilter =
      isVisible === 'true' ? true : isVisible === 'false' ? false : undefined;
    return this.adminService.listReviews({ page, perPage, isVisible: visibleFilter });
  }

  @Patch('reviews/:id/visibility')
  @ApiOperation({ summary: 'Show or hide a review' })
  setReviewVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Body('is_visible') isVisible: boolean,
  ) {
    return this.adminService.setReviewVisibility(id, isVisible);
  }
}
