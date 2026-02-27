import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MediaFileType } from '@prisma/client';

/**
 * DTO for uploading media files
 *
 * Validation:
 * - File type: image only (jpg, png, webp)
 * - Max size: 5MB
 * - Max 20 photos per warehouse
 */
export class UploadMediaDto {
  @ApiProperty({
    description: 'File type',
    enum: MediaFileType,
    example: MediaFileType.image,
  })
  @IsEnum(MediaFileType)
  fileType: MediaFileType;

  @ApiProperty({
    description: 'Display order (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
