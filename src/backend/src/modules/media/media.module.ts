import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { S3Module } from '../../shared/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
