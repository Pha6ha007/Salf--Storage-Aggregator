import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateOperatorDto {
  @ApiPropertyOptional({ example: 'Mohammed Al-Rashid' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '+971501234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in E.164 format' })
  phone?: string;

  @ApiPropertyOptional({ example: 'StorageHub LLC' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  company_name?: string;

  @ApiPropertyOptional({ example: 'TRN-123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  trade_license_number?: string;

  @ApiPropertyOptional({ example: 'info@storagehub.ae' })
  @IsOptional()
  @IsString()
  business_email?: string;

  @ApiPropertyOptional({ example: '+97143001234' })
  @IsOptional()
  @IsString()
  business_phone?: string;

  @ApiPropertyOptional({ example: 'https://storagehub.ae' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Dubai, Business Bay, Building 12' })
  @IsOptional()
  @IsString()
  legal_address?: string;
}
