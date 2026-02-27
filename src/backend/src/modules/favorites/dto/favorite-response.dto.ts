import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

class FavoriteWarehouseDto {
  @ApiProperty({ example: 101 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Dubai Storage Center' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'JLT, Dubai Marina' })
  @Expose()
  address: string;

  @ApiProperty({ example: 'Dubai' })
  @Expose()
  emirate: string;

  @ApiProperty({ example: 4.8 })
  @Expose()
  rating: number;

  @ApiProperty({ example: 127 })
  @Expose()
  review_count: number;

  @ApiProperty({ example: 'https://cdn.storagecompare.ae/warehouse-101.jpg', nullable: true })
  @Expose()
  primary_image: string | null;
}

export class FavoriteResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 101 })
  @Expose()
  warehouse_id: number;

  @ApiProperty({
    example: '2025-11-30T10:00:00.000Z',
    description: 'When favorite was added',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: () => FavoriteWarehouseDto, description: 'Warehouse details' })
  @Expose()
  @Type(() => FavoriteWarehouseDto)
  warehouse: FavoriteWarehouseDto;

  @Exclude()
  userId: string;

  @Exclude()
  warehouseId: number;

  constructor(partial: Partial<FavoriteResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PaginatedFavoritesResponseDto {
  @ApiProperty({ type: [FavoriteResponseDto] })
  @Expose()
  data: FavoriteResponseDto[];

  @ApiProperty({
    example: {
      total: 15,
      page: 1,
      per_page: 10,
      total_pages: 2,
    },
  })
  @Expose()
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
