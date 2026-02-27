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
} from '@nestjs/swagger';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { FilterBoxesDto } from './dto/filter-boxes.dto';
import { BoxResponseDto } from './dto/box-response.dto';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

// Public endpoints - get boxes by warehouse
@ApiTags('warehouses')
@Controller('warehouses/:warehouseId/boxes')
export class WarehouseBoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get boxes for a warehouse (public)' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Boxes retrieved successfully',
    type: [BoxResponseDto],
  })
  async findByWarehouse(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() filters: FilterBoxesDto,
  ) {
    return this.boxesService.findByWarehouse(warehouseId, filters);
  }
}

// Operator endpoints - manage boxes
@ApiTags('operator/boxes')
@Controller('operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.operator)
@ApiCookieAuth('auth_token')
export class OperatorBoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Post('warehouses/:warehouseId/boxes')
  @ApiOperation({ summary: 'Create box in warehouse (operator only)' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID' })
  @ApiResponse({
    status: 201,
    description: 'Box created successfully',
    type: BoxResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async create(
    @CurrentUser() user: CurrentUserData,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() createBoxDto: CreateBoxDto,
  ) {
    // Get operator ID
    const operator = await this.boxesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.boxesService.create(warehouseId, operator.id, createBoxDto);
  }

  @Patch('boxes/:id')
  @ApiOperation({ summary: 'Update box (operator only)' })
  @ApiParam({ name: 'id', description: 'Box ID' })
  @ApiResponse({
    status: 200,
    description: 'Box updated successfully',
    type: BoxResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Box not found' })
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoxDto: UpdateBoxDto,
  ) {
    const operator = await this.boxesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.boxesService.update(id, operator.id, updateBoxDto);
  }

  @Delete('boxes/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete box (operator only)' })
  @ApiParam({ name: 'id', description: 'Box ID' })
  @ApiResponse({
    status: 200,
    description: 'Box deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Box not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete box with active bookings' })
  async delete(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const operator = await this.boxesService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.boxesService.delete(id, operator.id);
  }

  @Get('boxes/:id')
  @ApiOperation({ summary: 'Get box details (operator only)' })
  @ApiParam({ name: 'id', description: 'Box ID' })
  @ApiResponse({
    status: 200,
    description: 'Box retrieved successfully',
    type: BoxResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Box not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boxesService.findOne(id);
  }
}
