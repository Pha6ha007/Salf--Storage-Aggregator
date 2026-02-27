import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BoxSizeRecommendation {
  @ApiProperty({ description: 'Recommended box size code', example: 'M' })
  size: string;

  @ApiProperty({ description: 'Box dimensions description', example: '4-5 m² (2m x 2.5m x 2.5m)' })
  dimensions: string;

  @ApiProperty({ description: 'Why this size is recommended' })
  reasoning: string;

  @ApiProperty({ description: 'Estimated fit percentage', example: 0.85 })
  fitScore: number;
}

export class WarehouseRecommendation {
  @ApiProperty({ description: 'Warehouse ID' })
  warehouseId: number;

  @ApiProperty({ description: 'Warehouse name' })
  warehouseName: string;

  @ApiProperty({ description: 'Box size available' })
  boxSize: string;

  @ApiProperty({ description: 'Price per month in AED' })
  pricePerMonth: number;

  @ApiProperty({ description: 'Distance from preferred location in km' })
  distanceKm?: number;

  @ApiProperty({ description: 'Match score (0-1)' })
  matchScore: number;
}

export class BoxRecommendationResponseDto {
  @ApiProperty({ description: 'Primary size recommendation' })
  primaryRecommendation: BoxSizeRecommendation;

  @ApiPropertyOptional({ description: 'Alternative size options', type: [BoxSizeRecommendation] })
  alternatives?: BoxSizeRecommendation[];

  @ApiPropertyOptional({ description: 'Matching warehouses', type: [WarehouseRecommendation] })
  warehouses?: WarehouseRecommendation[];

  @ApiProperty({ description: 'Additional packing tips and advice', type: [String] })
  packingTips: string[];

  @ApiProperty({ description: 'Confidence level of recommendation (0-1)', example: 0.9 })
  confidence: number;

  @ApiProperty({ description: 'AI model used' })
  aiModel: string;

  @ApiProperty({ description: 'Whether AI was available or fallback was used' })
  usedFallback: boolean;
}
