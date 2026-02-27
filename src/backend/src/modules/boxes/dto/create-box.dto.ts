import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { BoxSize } from '@prisma/client';

export class CreateBoxDto {
  @ApiProperty({
    example: 'A-101',
    description: 'Box identification number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  boxNumber: string;

  @ApiProperty({
    example: 'Small Climate Controlled Box',
    description: 'Box name/title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: 'Perfect for documents and small items',
    description: 'Box description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'S',
    enum: ['S', 'M', 'L', 'XL'],
    description: 'Box size category (S: 1-3m², M: 3-6m², L: 6-12m², XL: 12+m²)',
  })
  @IsEnum(BoxSize)
  size: BoxSize;

  @ApiProperty({
    example: 1.5,
    description: 'Box length in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  lengthMeters?: number;

  @ApiProperty({
    example: 1.5,
    description: 'Box width in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  widthMeters?: number;

  @ApiProperty({
    example: 2.0,
    description: 'Box height in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  heightMeters?: number;

  @ApiProperty({
    example: 2.25,
    description: 'Box floor area in square meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(1000)
  areaSquareMeters?: number;

  @ApiProperty({
    example: 250.0,
    description: 'Monthly rental price in AED',
  })
  @IsNumber()
  @Min(0.01)
  priceMonthly: number;

  @ApiProperty({
    example: 1,
    description: 'Total quantity of this box type',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  totalQuantity?: number;

  @ApiProperty({
    example: true,
    description: 'Has climate control',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasClimateControl?: boolean;

  @ApiProperty({
    example: false,
    description: 'Has electricity connection',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasElectricity?: boolean;

  @ApiProperty({
    example: true,
    description: 'Has shelving',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasShelf?: boolean;
}
