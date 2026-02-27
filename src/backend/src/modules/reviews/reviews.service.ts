import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { plainToInstance } from 'class-transformer';
import { ReviewResponseDto, PaginatedReviewsResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a review for a warehouse
   * - Validates booking is completed
   * - Validates user owns the booking
   * - Prevents duplicate reviews per booking
   * - Updates warehouse average rating
   */
  async createReview(userId: string, warehouseId: number, createReviewDto: CreateReviewDto) {
    const { booking_id, rating, comment } = createReviewDto;

    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    // Verify booking exists and belongs to user
    const booking = await this.prisma.booking.findUnique({
      where: { id: booking_id },
      include: {
        review: true,
      },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    if (booking.warehouseId !== warehouseId) {
      throw new BadRequestException('Booking does not belong to this warehouse');
    }

    // Check booking status - must be completed
    if (booking.status !== BookingStatus.completed) {
      throw new BadRequestException(
        'You can only review after the booking is completed',
      );
    }

    // Check if review already exists for this booking
    if (booking.review) {
      throw new ConflictException(
        'You have already reviewed this booking',
      );
    }

    // Create review in a transaction and update warehouse rating
    const review = await this.prisma.$transaction(async (tx) => {
      // Create the review
      const newReview = await tx.review.create({
        data: {
          userId,
          warehouseId,
          bookingId: booking_id,
          rating,
          comment,
          verified: true, // Auto-verify since it's tied to a completed booking
        },
        include: {
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

      // Recalculate warehouse average rating and review count
      const stats = await tx.review.aggregate({
        where: {
          warehouseId,
          isVisible: true,
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      });

      // Update warehouse rating and review count
      await tx.warehouse.update({
        where: { id: warehouseId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.id || 0,
        },
      });

      return newReview;
    });

    // Transform user data
    const reviewWithUser = {
      ...review,
      user: {
        id: review.user.id,
        name: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous',
        email: review.user.email,
      },
    };

    return plainToInstance(ReviewResponseDto, reviewWithUser, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get reviews for a warehouse with pagination
   * Includes rating distribution summary
   */
  async getWarehouseReviews(warehouseId: number, queryDto: QueryReviewsDto) {
    const { page = 1, per_page = 10, rating } = queryDto;

    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    // Build where clause
    const where = {
      warehouseId,
      isVisible: true,
      ...(rating && { rating }),
    };

    // Get total count
    const total = await this.prisma.review.count({ where });

    // Get reviews with pagination
    const reviews = await this.prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    // Get rating distribution and average
    const ratingStats = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        warehouseId,
        isVisible: true,
      },
      _count: {
        rating: true,
      },
    });

    // Build rating distribution
    const ratingDistribution: Record<string, number> = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    };

    ratingStats.forEach((stat) => {
      ratingDistribution[stat.rating.toString()] = stat._count.rating;
    });

    // Calculate average rating
    const avgStats = await this.prisma.review.aggregate({
      where: {
        warehouseId,
        isVisible: true,
      },
      _avg: {
        rating: true,
      },
    });

    // Transform reviews
    const reviewsWithUser = reviews.map((review) => ({
      ...review,
      warehouse_id: review.warehouseId,
      booking_id: review.bookingId,
      operator_response: review.operatorResponse,
      responded_at: review.respondedAt,
      is_visible: review.isVisible,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      user: {
        id: review.user.id,
        name: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous',
        email: review.user.email,
      },
    }));

    const data = reviewsWithUser.map((review) =>
      plainToInstance(ReviewResponseDto, review, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data,
      pagination: {
        total,
        page,
        per_page,
        total_pages: Math.ceil(total / per_page),
      },
      summary: {
        average_rating: Number((avgStats._avg.rating || 0).toFixed(2)),
        total_reviews: total,
        rating_distribution: ratingDistribution,
      },
    } as PaginatedReviewsResponseDto;
  }

  /**
   * Update operator response to a review
   * Only the warehouse operator or admin can respond
   */
  async addOperatorResponse(
    reviewId: number,
    operatorUserId: string,
    responseText: string,
  ) {
    // Get review with warehouse
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        warehouse: {
          include: {
            operator: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Verify operator owns the warehouse
    if (review.warehouse.operator.userId !== operatorUserId) {
      throw new ForbiddenException(
        'You can only respond to reviews for your own warehouses',
      );
    }

    // Update review with operator response
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        operatorResponse: responseText,
        respondedAt: new Date(),
      },
      include: {
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

    const reviewWithUser = {
      ...updatedReview,
      warehouse_id: updatedReview.warehouseId,
      booking_id: updatedReview.bookingId,
      operator_response: updatedReview.operatorResponse,
      responded_at: updatedReview.respondedAt,
      is_visible: updatedReview.isVisible,
      created_at: updatedReview.createdAt,
      updated_at: updatedReview.updatedAt,
      user: {
        id: updatedReview.user.id,
        name: `${updatedReview.user.firstName || ''} ${updatedReview.user.lastName || ''}`.trim() || 'Anonymous',
        email: updatedReview.user.email,
      },
    };

    return plainToInstance(ReviewResponseDto, reviewWithUser, {
      excludeExtraneousValues: true,
    });
  }
}
