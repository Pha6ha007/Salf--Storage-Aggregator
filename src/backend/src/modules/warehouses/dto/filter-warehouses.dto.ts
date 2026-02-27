import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WarehouseStatus } from '@prisma/client';

export class FilterWarehousesDto {
  @ApiProperty({
    example: 'Dubai',
    description: 'Filter by emirate',
    required: false,
  })
  @IsOptional()
  @IsString()
  emirate?: string;

  @ApiProperty({
    example: 'Trade Centre',
    description: 'Filter by district',
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    example: 'storage',
    description: 'Search query (name, description, address)',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: true,
    description: 'Filter by climate control availability',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasClimateControl?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by 24/7 access',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  has24x7Access?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by security cameras',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasSecurityCameras?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by insurance availability',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasInsurance?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by parking space',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasParkingSpace?: boolean;

  @ApiProperty({
    example: 4.0,
    description: 'Minimum rating (0-5)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiProperty({
    example: 25.2048,
    description: 'Latitude for geospatial search',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    example: 55.2708,
    description: 'Longitude for geospatial search',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    example: 10,
    description: 'Search radius in kilometers (requires latitude & longitude)',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  radiusKm?: number;

  @ApiProperty({
    example: 'active',
    enum: ['draft', 'pending_moderation', 'active', 'inactive', 'blocked'],
    description: 'Filter by status (defaults to active for public)',
    required: false,
  })
  @IsOptional()
  @IsEnum(WarehouseStatus)
  status?: WarehouseStatus;

  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 20,
    description: 'Items per page',
    required: false,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    example: 'rating',
    enum: ['rating', 'createdAt', 'name', 'distance'],
    description: 'Sort by field',
    required: false,
    default: 'rating',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    required: false,
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
