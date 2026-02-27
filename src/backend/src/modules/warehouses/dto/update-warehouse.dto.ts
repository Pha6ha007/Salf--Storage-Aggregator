import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { WarehouseStatus } from '@prisma/client';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({
    example: 'active',
    enum: ['draft', 'pending_moderation', 'active', 'inactive', 'blocked'],
    description: 'Warehouse status',
    required: false,
  })
  @IsOptional()
  @IsEnum(WarehouseStatus)
  status?: WarehouseStatus;
}
