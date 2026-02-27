import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsInt, IsBoolean, IsEnum, MaxLength } from 'class-validator';
import { CrmLeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Lead full name' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Lead phone number' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Lead email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Lead status', enum: CrmLeadStatus })
  @IsEnum(CrmLeadStatus)
  @IsOptional()
  status?: CrmLeadStatus;

  @ApiPropertyOptional({ description: 'Warehouse ID of interest' })
  @IsInt()
  @IsOptional()
  warehouseId?: number;

  @ApiPropertyOptional({ description: 'User ID if associated with registered user' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Lead source' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Additional notes about the lead' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mark as spam' })
  @IsBoolean()
  @IsOptional()
  isSpam?: boolean;

  @ApiPropertyOptional({ description: 'Reason for status change (required when status changes)' })
  @IsString()
  @IsOptional()
  statusChangeReason?: string;
}
