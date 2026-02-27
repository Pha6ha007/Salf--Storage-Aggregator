import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({
    example: 'Customer changed plans and no longer needs storage',
    description: 'Reason for cancellation (required, min 10 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  cancelReason: string;
}
