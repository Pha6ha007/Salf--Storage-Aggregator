import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBoxDto } from './create-box.dto';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateBoxDto extends PartialType(CreateBoxDto) {
  @ApiProperty({
    example: 5,
    description: 'Update available quantity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableQuantity?: number;

  @ApiProperty({
    example: 2,
    description: 'Update reserved quantity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reservedQuantity?: number;

  @ApiProperty({
    example: 3,
    description: 'Update occupied quantity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  occupiedQuantity?: number;
}
