import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, BookingCancelledBy } from '@prisma/client';

export class BookingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'BK-2026-000001' })
  bookingNumber: string;

  @ApiProperty({ example: 'pending', enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 1 })
  warehouseId: number;

  @ApiProperty({ example: 1 })
  boxId: number;

  @ApiProperty({ example: '2026-03-01T00:00:00Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-06-01T00:00:00Z' })
  endDate: Date;

  @ApiProperty({ example: 3 })
  durationMonths: number;

  @ApiProperty({ example: 250.0, description: 'Original box price per month (immutable snapshot)' })
  basePricePerMonth: number;

  @ApiProperty({ example: 10.0, description: 'Applied discount percentage (0-100)' })
  discountPercentage: number;

  @ApiProperty({ example: 225.0, description: 'Monthly price after discount' })
  monthlyPrice: number;

  @ApiProperty({ example: 675.0, description: 'Total price for entire booking period' })
  priceTotal: number;

  @ApiProperty({ example: null, enum: BookingCancelledBy, required: false })
  cancelledBy?: BookingCancelledBy;

  @ApiProperty({ example: null, required: false })
  cancelReason?: string;

  @ApiProperty({ example: null, required: false })
  cancelledAt?: Date;

  @ApiProperty({ example: null, required: false })
  notes?: string;

  @ApiProperty({ example: '+971501234567', required: false })
  contactPhone?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  contactEmail?: string;

  @ApiProperty({ example: '2026-02-27T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, required: false })
  confirmedAt?: Date;

  @ApiProperty({ example: null, required: false })
  completedAt?: Date;

  @ApiProperty({ example: null, required: false })
  expiredAt?: Date;

  @ApiProperty({ example: null, required: false })
  deletedAt?: Date;
}
