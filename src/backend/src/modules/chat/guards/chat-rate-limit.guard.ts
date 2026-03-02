import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../../shared/redis/redis.service';

@Injectable()
export class ChatRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(ChatRateLimitGuard.name);

  // Rate limits (requests per hour)
  private readonly ANONYMOUS_LIMIT = 20;
  private readonly AUTHENTICATED_LIMIT = 50;
  private readonly WINDOW_MS = 3600000; // 1 hour in milliseconds

  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Determine rate limit based on authentication
    const limit = user ? this.AUTHENTICATED_LIMIT : this.ANONYMOUS_LIMIT;
    const identifier = user
      ? `user:${user.id}`
      : `ip:${this.getClientIp(request)}`;

    const key = `chat_rate_limit:${identifier}`;

    try {
      // Get current count from Redis
      const redis = this.redisService.getClient();
      const current = await redis.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= limit) {
        this.logger.warn(
          `Rate limit exceeded for ${identifier}: ${count}/${limit}`,
        );
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Rate limit exceeded. ${user ? 'Authenticated' : 'Anonymous'} users are limited to ${limit} messages per hour.`,
            retryAfter: 3600, // seconds
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Increment counter
      const newCount = count + 1;
      if (count === 0) {
        // Set with expiry
        await redis.set(key, newCount.toString(), 'EX', 3600); // 1 hour
      } else {
        // Just increment
        await redis.incr(key);
      }

      this.logger.debug(
        `Rate limit check: ${identifier} - ${newCount}/${limit}`,
      );

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // If Redis fails, allow the request but log error
      this.logger.error('Redis error in rate limit guard:', error);
      return true;
    }
  }

  /**
   * Get client IP address from request
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }
}
