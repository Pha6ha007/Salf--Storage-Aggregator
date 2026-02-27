import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString, IsBoolean, MaxLength } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ description: 'Activity title', example: 'Follow up call' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Activity description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Due date for activity (ISO 8601 format)' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Activity type ID' })
  @IsInt()
  @IsOptional()
  activityTypeId?: number;

  @ApiPropertyOptional({ description: 'Mark as completed', default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
