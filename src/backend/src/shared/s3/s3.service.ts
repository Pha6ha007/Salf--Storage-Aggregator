import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomBytes } from 'crypto';

/**
 * S3Service - AWS S3 file storage operations
 *
 * Configured for AWS me-south-1 (Bahrain region) for low latency to UAE/GCC
 * Handles warehouse photos, documents, and other media
 */
@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'me-south-1';
    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET') ||
      'storagecompare-media';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.logger.log(
      `S3 Service initialized (region: ${this.region}, bucket: ${this.bucketName})`,
    );
  }

  /**
   * Upload file to S3
   *
   * @param buffer - File buffer
   * @param key - S3 object key (path)
   * @param mimeType - File MIME type
   * @returns S3 public URL
   */
  async uploadFile(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ACL: 'public-read', // Make publicly accessible
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      this.logger.log(`File uploaded to S3: ${fileUrl}`);

      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${key}`, error.stack);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Delete file from S3
   *
   * @param key - S3 object key (path)
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted from S3: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file from S3: ${key}`, error.stack);
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  /**
   * Generate presigned URL for temporary access
   *
   * @param key - S3 object key (path)
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Presigned URL
   */
  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.debug(`Generated presigned URL for: ${key}`);

      return url;
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned URL for: ${key}`,
        error.stack,
      );
      throw new Error(`Presigned URL generation failed: ${error.message}`);
    }
  }

  /**
   * Generate unique S3 key for warehouse media
   *
   * @param warehouseId - Warehouse ID
   * @param originalFileName - Original file name
   * @returns S3 key path
   */
  generateWarehouseMediaKey(
    warehouseId: number,
    originalFileName: string,
  ): string {
    const timestamp = Date.now();
    const randomSuffix = randomBytes(8).toString('hex');
    const extension = originalFileName.split('.').pop();
    const key = `warehouses/${warehouseId}/photo-${timestamp}-${randomSuffix}.${extension}`;

    return key;
  }

  /**
   * Extract S3 key from full URL
   *
   * @param url - Full S3 URL
   * @returns S3 key
   */
  extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove leading slash
      return urlObj.pathname.substring(1);
    } catch (error) {
      this.logger.warn(`Failed to extract key from URL: ${url}`);
      // Fallback: try to extract everything after bucket name
      const parts = url.split(`${this.bucketName}.s3.${this.region}.amazonaws.com/`);
      return parts.length > 1 ? parts[1] : url;
    }
  }

  /**
   * Check S3 connection by checking bucket access
   * Used for health checks
   */
  async checkConnection(): Promise<void> {
    try {
      const command = new HeadBucketCommand({
        Bucket: this.bucketName,
      });
      await this.s3Client.send(command);
      this.logger.debug(`S3 connection check passed for bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error(`S3 connection check failed: ${error.message}`, error.stack);
      throw new Error(`S3 connection failed: ${error.message}`);
    }
  }
}
