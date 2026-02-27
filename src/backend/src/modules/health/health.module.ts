import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { S3Module } from '../../shared/s3/s3.module';

@Module({
  imports: [PrismaModule, RedisModule, S3Module],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
