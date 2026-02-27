import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({
    example: '+971501234567',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;
}
