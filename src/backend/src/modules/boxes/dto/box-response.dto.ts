import { ApiProperty } from '@nestjs/swagger';
import { BoxSize } from '@prisma/client';

export class BoxResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  warehouseId: number;

  @ApiProperty({ example: 'A-101' })
  boxNumber: string;

  @ApiProperty({ example: 'Small Climate Controlled Box' })
  name?: string;

  @ApiProperty({ example: 'Perfect for documents and small items' })
  description?: string;

  @ApiProperty({ example: 'S', enum: BoxSize })
  size: BoxSize;

  @ApiProperty({ example: 1.5 })
  lengthMeters?: number;

  @ApiProperty({ example: 1.5 })
  widthMeters?: number;

  @ApiProperty({ example: 2.0 })
  heightMeters?: number;

  @ApiProperty({ example: 2.25 })
  areaSquareMeters?: number;

  @ApiProperty({ example: 250.0 })
  priceMonthly: number;

  @ApiProperty({ example: 10 })
  totalQuantity: number;

  @ApiProperty({ example: 7 })
  availableQuantity: number;

  @ApiProperty({ example: 2 })
  reservedQuantity: number;

  @ApiProperty({ example: 1 })
  occupiedQuantity: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiProperty({ example: true })
  hasClimateControl: boolean;

  @ApiProperty({ example: false })
  hasElectricity: boolean;

  @ApiProperty({ example: true })
  hasShelf: boolean;

  @ApiProperty({ example: '2025-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-27T14:30:00Z' })
  updatedAt: Date;
}
