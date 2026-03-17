import {
  Controller,
  Get,
  Post,
  Put,
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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { ReviewResponseDto, PaginatedReviewsResponseDto } from './dto/review-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Public endpoint - get warehouse reviews
  @Get('warehouses/:warehouseId/reviews')
  @ApiOperation({ summary: 'Get reviews for a warehouse (public)' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID', type: 'integer' })
  @ApiQuery({ name: 'page', required: false, type: 'integer', example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: 'integer', example: 10 })
  @ApiQuery({ name: 'rating', required: false, type: 'integer', description: 'Filter by rating (1-5)' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: PaginatedReviewsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async getWarehouseReviews(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() queryDto: QueryReviewsDto,
  ) {
    return this.reviewsService.getWarehouseReviews(warehouseId, queryDto);
  }

  // Protected endpoint - create review
  @Post('warehouses/:warehouseId/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.user, UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a review for a warehouse (requires completed booking)',
  })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID', type: 'integer' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - booking not completed or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your booking' })
  @ApiResponse({ status: 404, description: 'Warehouse or booking not found' })
  @ApiResponse({ status: 409, description: 'Conflict - review already exists for this booking' })
  async createReview(
    @CurrentUser() user: CurrentUserData,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user.id, warehouseId, createReviewDto);
  }

  // Protected endpoint - operator response
  @Post('operator/reviews/:reviewId/response')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add or update operator response to a review',
  })
  @ApiParam({ name: 'reviewId', description: 'Review ID', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Operator response added successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your warehouse' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async addOperatorResponse(
    @CurrentUser() user: CurrentUserData,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body('response_text') responseText: string,
  ) {
    return this.reviewsService.addOperatorResponse(reviewId, user.id, responseText);
  }

  // User: update own review
  @Put('reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.user, UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update own review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateReview(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body('rating') rating?: number,
    @Body('comment') comment?: string,
  ) {
    return this.reviewsService.updateReview(user.id, id, rating, comment);
  }

  // User: delete own review
  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.user, UserRole.operator, UserRole.admin)
  @ApiCookieAuth('auth_token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete own review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reviewsService.deleteReview(user.id, id);
  }
}
