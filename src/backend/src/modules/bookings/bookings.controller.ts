import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

// User endpoints - manage own bookings
@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.user, UserRole.operator, UserRole.admin)
@ApiCookieAuth('auth_token')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking (authenticated users)' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully with status: pending',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or box unavailable' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Warehouse or box not found' })
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for current user' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByUser(@CurrentUser() user: CurrentUserData) {
    return this.bookingsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID (own bookings only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.findOne(id, user.id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a booking (user can only cancel pending bookings)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your booking or already confirmed' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancel(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelBookingDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, cancelBookingDto, user.id, undefined, user.role as UserRole);
  }
}

// Operator endpoints - manage bookings for their warehouses
@ApiTags('operator/bookings')
@Controller('operator/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.operator)
@ApiCookieAuth('auth_token')
export class OperatorBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings for operator warehouses' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - operator role required' })
  async findByOperator(@CurrentUser() user: CurrentUserData) {
    // Get operator ID
    const operator = await this.bookingsService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.bookingsService.findByOperator(operator.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID (operator warehouses only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your warehouse' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const operator = await this.bookingsService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.bookingsService.findOne(id, undefined, operator.id);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a pending booking (pending → confirmed)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking confirmed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot confirm booking - invalid state' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async confirm(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const operator = await this.bookingsService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.bookingsService.confirm(id, operator.id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete a confirmed booking (confirmed → completed)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking completed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot complete booking - invalid state' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async complete(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const operator = await this.bookingsService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.bookingsService.complete(id, operator.id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a booking (operator can cancel pending or confirmed)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking - invalid state' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your warehouse or not operator' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancel(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelBookingDto: CancelBookingDto,
  ) {
    const operator = await this.bookingsService['prisma'].operator.findUnique({
      where: { userId: user.id },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.bookingsService.cancel(id, cancelBookingDto, undefined, operator.id, user.role as UserRole);
  }
}
