import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

class ReviewUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Ahmed Ali' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  @Expose()
  email: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 101 })
  @Expose()
  warehouse_id: number;

  @ApiProperty({ example: 1001 })
  @Expose()
  booking_id: number;

  @ApiProperty({ example: 5, description: 'Rating (1-5 stars)' })
  @Expose()
  rating: number;

  @ApiProperty({
    example: 'Great warehouse, clean and secure.',
    description: 'Review comment',
  })
  @Expose()
  comment: string;

  @ApiProperty({
    example: 'Thank you for your feedback!',
    nullable: true,
    description: 'Operator response to the review',
  })
  @Expose()
  operator_response: string | null;

  @ApiProperty({
    example: '2025-11-30T10:00:00.000Z',
    nullable: true,
    description: 'When operator responded',
  })
  @Expose()
  responded_at: Date | null;

  @ApiProperty({ example: true, description: 'Whether review is verified' })
  @Expose()
  verified: boolean;

  @ApiProperty({ example: true, description: 'Whether review is visible' })
  @Expose()
  is_visible: boolean;

  @ApiProperty({
    example: '2025-11-30T10:00:00.000Z',
    description: 'When review was created',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    example: '2025-11-30T10:00:00.000Z',
    description: 'When review was last updated',
  })
  @Expose()
  updated_at: Date;

  @ApiProperty({ type: () => ReviewUserDto, description: 'User who wrote the review' })
  @Expose()
  @Type(() => ReviewUserDto)
  user: ReviewUserDto;

  @Exclude()
  userId: string;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  @Expose()
  data: ReviewResponseDto[];

  @ApiProperty({
    example: {
      total: 127,
      page: 1,
      per_page: 10,
      total_pages: 13,
    },
  })
  @Expose()
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };

  @ApiProperty({
    example: {
      average_rating: 4.8,
      total_reviews: 127,
      rating_distribution: {
        '1': 1,
        '2': 2,
        '3': 7,
        '4': 28,
        '5': 89,
      },
    },
  })
  @Expose()
  summary: {
    average_rating: number;
    total_reviews: number;
    rating_distribution: Record<string, number>;
  };
}
