import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { FilterWarehousesDto } from './dto/filter-warehouses.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  // Public endpoints
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all warehouses (public)' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses list retrieved successfully',
  })
  async findAll(@Query() filters: FilterWarehousesDto) {
    return this.warehousesService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID (public)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse retrieved successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehousesService.findOne(id);
  }
}

// Operator endpoints
@ApiTags('operator/warehouses')
@Controller('operator/warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.operator)
@ApiCookieAuth('auth_token')
export class OperatorWarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOperation({ summary: 'Get operator warehouses (operator only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Operator warehouses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Operator only' })
  async getMyWarehouses(
    @CurrentUser() user: CurrentUserData,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Get operator ID from user
    const operator = await this.warehousesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.warehousesService.findByOperator(operator.id, pageNum, limitNum);
  }

  @Post()
  @ApiOperation({ summary: 'Create warehouse (operator only)' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Operator only' })
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createWarehouseDto: CreateWarehouseDto,
  ) {
    // Get operator ID from user
    const operator = await this.warehousesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found. Please create operator profile first.');
    }

    return this.warehousesService.create(operator.id, createWarehouseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update warehouse (operator only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const operator = await this.warehousesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.warehousesService.update(id, operator.id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete warehouse (operator only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async delete(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const operator = await this.warehousesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.warehousesService.delete(id, operator.id);
  }
}
