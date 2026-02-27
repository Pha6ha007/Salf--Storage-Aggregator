import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Warehouse ID' })
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ example: 1, description: 'Box ID' })
  @IsNotEmpty()
  @IsNumber()
  boxId: number;

  @ApiProperty({ example: '2026-03-01', description: 'Booking start date (ISO 8601)' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: 3, description: 'Duration in months (1-12)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  durationMonths: number;

  @ApiProperty({ example: 0, description: 'Discount percentage (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({ example: 'Need climate control for documents', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '+971501234567', description: 'Contact phone number', required: false })
  @IsOptional()
  @IsPhoneNumber('AE')
  contactPhone?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Contact email', required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
