import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { CrmContactType, CrmInitiatedBy } from '@prisma/client';

export class CreateContactDto {
  @ApiProperty({ description: 'Type of contact', enum: CrmContactType })
  @IsEnum(CrmContactType)
  contactType: CrmContactType;

  @ApiProperty({ description: 'Who initiated the contact', enum: CrmInitiatedBy })
  @IsEnum(CrmInitiatedBy)
  initiatedBy: CrmInitiatedBy;

  @ApiPropertyOptional({ description: 'Contact subject' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'Contact message or notes' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ description: 'Duration in seconds (for calls)' })
  @IsInt()
  @IsOptional()
  durationSeconds?: number;
}
