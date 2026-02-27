import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Upload media for warehouse (operator only)
   */
  @Post('operator/warehouses/:id/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('operator')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload media file for warehouse',
    description: 'Upload photo for warehouse. Max 20 photos per warehouse, max 5MB per file. Allowed: jpg, png, webp',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'fileType'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Media file (jpg, png, webp)',
        },
        fileType: {
          type: 'string',
          enum: ['image', 'video'],
          description: 'File type',
        },
        displayOrder: {
          type: 'number',
          description: 'Display order (optional)',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    type: MediaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error or file too large' })
  @ApiResponse({ status: 403, description: 'Not warehouse owner' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async uploadMedia(
    @Param('id', ParseIntPipe) warehouseId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadMediaDto,
    @CurrentUser() user: any,
  ): Promise<MediaResponseDto> {
    // Get operator ID from user
    const operator = await this.mediaService['prisma'].operator.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.mediaService.uploadMedia(
      warehouseId,
      file,
      uploadDto,
      operator.id,
    );
  }

  /**
   * Delete media (operator only)
   */
  @Delete('operator/media/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('operator')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete media file',
    description: 'Delete media file from warehouse. Owner only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Media deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Media deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Not warehouse owner' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  async deleteMedia(
    @Param('id', ParseIntPipe) mediaId: number,
    @CurrentUser() user: any,
  ) {
    // Get operator ID from user
    const operator = await this.mediaService['prisma'].operator.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!operator) {
      throw new Error('Operator profile not found');
    }

    return this.mediaService.deleteMedia(mediaId, operator.id);
  }

  /**
   * Get warehouse media (public)
   */
  @Get('warehouses/:id/media')
  @ApiOperation({
    summary: 'Get warehouse media files',
    description: 'Get all media files for a warehouse (public endpoint)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of media files',
    type: [MediaResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async getWarehouseMedia(
    @Param('id', ParseIntPipe) warehouseId: number,
  ): Promise<MediaResponseDto[]> {
    return this.mediaService.listWarehouseMedia(warehouseId);
  }
}
