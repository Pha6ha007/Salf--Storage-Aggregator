import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MediaFileType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from '../../shared/s3/s3.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import {
  MediaUploadedEvent,
  MediaDeletedEvent,
} from '../../common/events/media.events';

@Injectable()
export class MediaService {
  // Validation constants
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_PHOTOS_PER_WAREHOUSE = 20;

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Upload media file for warehouse
   * Operator must own the warehouse
   */
  async uploadMedia(
    warehouseId: number,
    file: Express.Multer.File,
    uploadDto: UploadMediaDto,
    operatorId: number,
  ) {
    // Verify warehouse exists and operator owns it
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      select: { id: true, operatorId: true, deletedAt: true },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only upload media to your own warehouses');
    }

    // Validate file
    this.validateFile(file);

    // Check photo count limit
    const photoCount = await this.prisma.media.count({
      where: {
        warehouseId,
        fileType: MediaFileType.image,
      },
    });

    if (photoCount >= this.MAX_PHOTOS_PER_WAREHOUSE) {
      throw new BadRequestException(
        `Maximum ${this.MAX_PHOTOS_PER_WAREHOUSE} photos allowed per warehouse`,
      );
    }

    // Generate S3 key and upload
    const s3Key = this.s3Service.generateWarehouseMediaKey(
      warehouseId,
      file.originalname,
    );

    const fileUrl = await this.s3Service.uploadFile(
      file.buffer,
      s3Key,
      file.mimetype,
    );

    // Create media record
    const media = await this.prisma.media.create({
      data: {
        warehouseId,
        fileType: uploadDto.fileType,
        fileUrl,
        fileName: file.originalname,
        fileSizeBytes: file.size,
        mimeType: file.mimetype,
        displayOrder: uploadDto.displayOrder,
      },
    });

    // Emit event
    this.eventEmitter.emit(
      'media.uploaded',
      new MediaUploadedEvent(
        media.id,
        warehouseId,
        fileUrl,
        uploadDto.fileType,
        String(operatorId),
      ),
    );

    return media;
  }

  /**
   * Delete media file
   * Operator must own the warehouse
   */
  async deleteMedia(mediaId: number, operatorId: number) {
    // Get media with warehouse
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        warehouse: {
          select: { id: true, operatorId: true },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only delete media from your own warehouses');
    }

    // Extract S3 key and delete from S3
    const s3Key = this.s3Service.extractKeyFromUrl(media.fileUrl);
    await this.s3Service.deleteFile(s3Key);

    // Delete media record
    await this.prisma.media.delete({
      where: { id: mediaId },
    });

    // Emit event
    this.eventEmitter.emit(
      'media.deleted',
      new MediaDeletedEvent(
        mediaId,
        media.warehouseId,
        media.fileUrl,
        String(operatorId),
      ),
    );

    return { message: 'Media deleted successfully' };
  }

  /**
   * List media for warehouse (public)
   */
  async listWarehouseMedia(warehouseId: number) {
    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      select: { id: true, deletedAt: true },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    const media = await this.prisma.media.findMany({
      where: { warehouseId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return media;
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Check MIME type
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    // Check if file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }
  }
}
