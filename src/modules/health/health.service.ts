import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { S3Service } from '../../shared/s3/s3.service';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
}

export interface DetailedHealthStatus extends HealthStatus {
  checks: {
    database: {
      status: 'ok' | 'error';
      message?: string;
      responseTime?: number;
    };
    redis: {
      status: 'ok' | 'error';
      message?: string;
      responseTime?: number;
    };
    s3: {
      status: 'ok' | 'error';
      message?: string;
      responseTime?: number;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly s3: S3Service,
  ) {}

  /**
   * Get basic health status
   */
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  /**
   * Get detailed health status with dependency checks
   */
  async getDetailedHealth(): Promise<DetailedHealthStatus> {
    const baseHealth = this.getHealth();

    const [dbCheck, redisCheck, s3Check] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkS3(),
    ]);

    // Determine overall status
    const overallStatus =
      dbCheck.status === 'ok' && redisCheck.status === 'ok' && s3Check.status === 'ok'
        ? 'ok'
        : 'error';

    return {
      ...baseHealth,
      status: overallStatus,
      checks: {
        database: dbCheck,
        redis: redisCheck,
        s3: s3Check,
      },
    };
  }

  /**
   * Check PostgreSQL connection
   */
  private async checkDatabase(): Promise<{
    status: 'ok' | 'error';
    message?: string;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;
      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'error',
        message: error.message || 'Database connection failed',
        responseTime: Date.now() - start,
      };
    }
  }

  /**
   * Check Redis connection
   */
  private async checkRedis(): Promise<{
    status: 'ok' | 'error';
    message?: string;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      await this.redis.ping();
      const responseTime = Date.now() - start;
      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return {
        status: 'error',
        message: error.message || 'Redis connection failed',
        responseTime: Date.now() - start,
      };
    }
  }

  /**
   * Check S3 connection (by listing buckets)
   */
  private async checkS3(): Promise<{
    status: 'ok' | 'error';
    message?: string;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      await this.s3.checkConnection();
      const responseTime = Date.now() - start;
      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      this.logger.error('S3 health check failed', error);
      return {
        status: 'error',
        message: error.message || 'S3 connection failed',
        responseTime: Date.now() - start,
      };
    }
  }
}
