import { ApiProperty } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';

export class WarehouseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Dubai Storage Center' })
  name: string;

  @ApiProperty({ example: 'Modern storage facility with 24/7 access' })
  description?: string;

  @ApiProperty({ example: 'active', enum: WarehouseStatus })
  status: WarehouseStatus;

  @ApiProperty({ example: 'Sheikh Zayed Road, Trade Centre, Dubai, UAE' })
  address: string;

  @ApiProperty({ example: 'Dubai' })
  emirate: string;

  @ApiProperty({ example: 'Trade Centre' })
  district?: string;

  @ApiProperty({ example: 25.2048 })
  latitude: number;

  @ApiProperty({ example: 55.2708 })
  longitude: number;

  @ApiProperty({ example: false })
  hasClimateControl: boolean;

  @ApiProperty({ example: true })
  has24x7Access: boolean;

  @ApiProperty({ example: true })
  hasSecurityCameras: boolean;

  @ApiProperty({ example: false })
  hasInsurance: boolean;

  @ApiProperty({ example: true })
  hasParkingSpace: boolean;

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
  })
  workingHours?: Record<string, string>;

  @ApiProperty({ example: '+971501234567' })
  contactPhone?: string;

  @ApiProperty({ example: 'info@dubaistoragecentre.ae' })
  contactEmail?: string;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 25 })
  reviewCount: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-27T14:30:00Z' })
  updatedAt: Date;

  @ApiProperty({
    example: {
      id: 1,
      companyName: 'Dubai Storage LLC',
    },
    description: 'Operator information',
  })
  operator?: {
    id: number;
    companyName: string;
  };

  @ApiProperty({
    example: 5.2,
    description: 'Distance in kilometers (only in geospatial search)',
    required: false,
  })
  distance?: number;
}
