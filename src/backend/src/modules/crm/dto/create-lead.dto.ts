import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ description: 'Lead full name', example: 'Ahmed Al Mansoori' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Lead phone number', example: '+971501234567' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({ description: 'Lead email address', example: 'ahmed@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Warehouse ID of interest' })
  @IsInt()
  @IsOptional()
  warehouseId?: number;

  @ApiPropertyOptional({ description: 'User ID if associated with registered user' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Lead source (e.g., website, phone, referral)', example: 'website' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Additional notes about the lead' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mark as spam', default: false })
  @IsBoolean()
  @IsOptional()
  isSpam?: boolean;
}
