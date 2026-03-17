import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperatorStatisticsDto {
  @ApiProperty() total_warehouses: number;
  @ApiProperty() active_warehouses: number;
  @ApiProperty() total_boxes: number;
  @ApiProperty() occupied_boxes: number;
  @ApiProperty() available_boxes: number;
  @ApiProperty() total_bookings: number;
  @ApiProperty() active_bookings: number;
  @ApiProperty() pending_bookings: number;
  @ApiProperty() average_rating: number;
}

export class OperatorCompanyInfoDto {
  @ApiProperty() company_name: string;
  @ApiPropertyOptional() trade_license_number?: string;
  @ApiPropertyOptional() tax_registration_number?: string;
  @ApiPropertyOptional() legal_address?: string;
  @ApiPropertyOptional() business_phone?: string;
  @ApiPropertyOptional() business_email?: string;
  @ApiPropertyOptional() website?: string;
}

export class OperatorResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() user_id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() phone?: string;
  @ApiProperty() role: string;
  @ApiProperty() is_verified: boolean;
  @ApiPropertyOptional() verified_at?: Date;
  @ApiProperty() company_info: OperatorCompanyInfoDto;
  @ApiPropertyOptional() statistics?: OperatorStatisticsDto;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}
