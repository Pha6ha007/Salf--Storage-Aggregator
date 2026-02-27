import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { BoxSize } from '@prisma/client';

export class FilterBoxesDto {
  @ApiProperty({
    example: 'M',
    enum: ['S', 'M', 'L', 'XL'],
    description: 'Filter by box size',
    required: false,
  })
  @IsOptional()
  @IsEnum(BoxSize)
  size?: BoxSize;

  @ApiProperty({
    example: 100,
    description: 'Minimum monthly price (AED)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    example: 500,
    description: 'Maximum monthly price (AED)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    example: true,
    description: 'Filter by availability (has available quantity > 0)',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by climate control',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasClimateControl?: boolean;

  @ApiProperty({
    example: false,
    description: 'Filter by electricity',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasElectricity?: boolean;

  @ApiProperty({
    example: true,
    description: 'Filter by shelving',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasShelf?: boolean;
}
