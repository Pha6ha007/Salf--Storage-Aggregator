import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  Matches,
  Equals,
} from 'class-validator';

export class RegisterOperatorDto {
  @ApiProperty({ example: 'operator@company.ae' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password_confirmation: string;

  @ApiProperty({ example: 'Mohammed Al-Rashid' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '+971501234567' })
  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in E.164 format, e.g. +971501234567' })
  phone: string;

  @ApiProperty({ example: 'StorageHub LLC' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  company_name: string;

  @ApiPropertyOptional({ example: 'TRN-123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  trade_license_number?: string;

  @ApiProperty({ example: true, description: 'Must be true to accept terms' })
  @IsBoolean()
  @Equals(true, { message: 'You must agree to the terms of service' })
  agree_to_terms: boolean;

  @ApiProperty({ example: true, description: 'Must be true to accept privacy policy' })
  @IsBoolean()
  @Equals(true, { message: 'You must agree to the privacy policy' })
  agree_to_privacy: boolean;
}
