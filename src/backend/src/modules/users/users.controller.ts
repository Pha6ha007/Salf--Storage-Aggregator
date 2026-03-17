import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { BookingsService } from '../bookings/bookings.service';
import { FavoritesService } from '../favorites/favorites.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiCookieAuth('auth_token')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bookingsService: BookingsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@CurrentUser() user: CurrentUserData) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateMyProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password' })
  @ApiResponse({ status: 400, description: 'New password must be different' })
  async changeMyPassword(
    @CurrentUser() user: CurrentUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user account (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteMyAccount(@CurrentUser() user: CurrentUserData) {
    return this.usersService.deleteAccount(user.id);
  }

  // ── Spec aliases: /users/me/bookings and /users/me/favorites ────────────────

  @Get('me/bookings')
  @ApiOperation({ summary: 'Get current user bookings (spec alias)' })
  @ApiResponse({ status: 200, description: 'Bookings list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyBookings(@CurrentUser() user: CurrentUserData) {
    return this.bookingsService.findByUser(user.id);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get current user favorites (spec alias)' })
  @ApiResponse({ status: 200, description: 'Favorites list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyFavorites(
    @CurrentUser() user: CurrentUserData,
    @Query() queryDto: any,
  ) {
    return this.favoritesService.getUserFavorites(user.id, queryDto);
  }

  @Post('me/favorites')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add to favorites (spec alias)' })
  @ApiResponse({ status: 201, description: 'Added to favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addToFavorites(
    @CurrentUser() user: CurrentUserData,
    @Body('warehouse_id') warehouseId: number,
  ) {
    return this.favoritesService.addFavorite(user.id, warehouseId);
  }

  @Delete('me/favorites/:warehouseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove from favorites (spec alias)' })
  @ApiResponse({ status: 200, description: 'Removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromFavorites(
    @CurrentUser() user: CurrentUserData,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.favoritesService.removeFavorite(user.id, parseInt(warehouseId, 10));
  }

  // Admin endpoints
  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.usersService.getAllUsers(pageNum, limitNum);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
