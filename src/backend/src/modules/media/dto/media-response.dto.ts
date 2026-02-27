import { ApiProperty } from '@nestjs/swagger';
import { MediaFileType } from '@prisma/client';

/**
 * Media response DTO
 */
export class MediaResponseDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: 456 })
  warehouseId: number;

  @ApiProperty({ enum: MediaFileType, example: MediaFileType.image })
  fileType: MediaFileType;

  @ApiProperty({
    example: 'https://storagecompare-media.s3.me-south-1.amazonaws.com/warehouses/456/photo-123.jpg',
  })
  fileUrl: string;

  @ApiProperty({ example: 'warehouse-photo.jpg' })
  fileName: string;

  @ApiProperty({ example: 1024000, nullable: true })
  fileSizeBytes: number | null;

  @ApiProperty({ example: 'image/jpeg', nullable: true })
  mimeType: string | null;

  @ApiProperty({ example: 1, nullable: true })
  displayOrder: number | null;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z' })
  createdAt: Date;
}
