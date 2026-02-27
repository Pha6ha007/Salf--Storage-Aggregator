import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsObject,
  Matches,
} from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    example: 'Dubai Storage Center',
    description: 'Warehouse name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Modern storage facility with 24/7 access and climate control',
    description: 'Warehouse description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Sheikh Zayed Road, Trade Centre, Dubai, UAE',
    description: 'Full warehouse address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'Dubai',
    description: 'Emirate name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  emirate: string;

  @ApiProperty({
    example: 'Trade Centre',
    description: 'District/area name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiProperty({
    example: false,
    description: 'Has climate control',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasClimateControl?: boolean;

  @ApiProperty({
    example: true,
    description: 'Has 24/7 access',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  has24x7Access?: boolean;

  @ApiProperty({
    example: true,
    description: 'Has security cameras',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasSecurityCameras?: boolean;

  @ApiProperty({
    example: false,
    description: 'Has insurance coverage',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasInsurance?: boolean;

  @ApiProperty({
    example: true,
    description: 'Has parking space',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasParkingSpace?: boolean;

  @ApiProperty({
    example: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '09:00-14:00',
      sunday: 'Closed',
    },
    description: 'Working hours (JSON object)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  workingHours?: Record<string, string>;

  @ApiProperty({
    example: '+971501234567',
    description: 'Contact phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiProperty({
    example: 'info@dubaistoragecentre.ae',
    description: 'Contact email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;
}
