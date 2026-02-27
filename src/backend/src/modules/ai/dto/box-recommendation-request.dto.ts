import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';

export class BoxRecommendationRequestDto {
  @ApiProperty({
    description: 'Description of items to store (free text)',
    example: 'I need to store furniture from a 1-bedroom apartment: sofa, bed, wardrobe, 10 boxes',
  })
  @IsString()
  @MaxLength(2000)
  itemsDescription: string;

  @ApiPropertyOptional({
    description: 'Duration in months',
    example: 3,
    minimum: 1,
    maximum: 120,
  })
  @IsInt()
  @Min(1)
  @Max(120)
  @IsOptional()
  durationMonths?: number;

  @ApiPropertyOptional({
    description: 'Preferred location (emirate, district, or area)',
    example: 'Dubai, Al Quoz',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum monthly budget in AED',
    example: 8000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxMonthlyBudget?: number;
}
