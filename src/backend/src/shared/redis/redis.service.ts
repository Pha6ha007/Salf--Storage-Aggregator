import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * RedisService - Redis client wrapper
 *
 * Used for:
 * - Sessions
 * - Rate limiting
 * - Geo cache
 * - General caching
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis client error', error);
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis client disconnected');
  }

  /**
   * Get Redis client instance
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Ping Redis server (for health checks)
   */
  async ping(): Promise<string> {
    return this.client.ping();
  }

  /**
   * Set a value in Redis
   */
  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (expirySeconds) {
      await this.client.setex(key, expirySeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Get a value from Redis
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Delete a key from Redis
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  /**
   * Set expiry on a key
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /**
   * Get TTL of a key
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Increment a value
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Decrement a value
   */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  /**
   * Get multiple keys
   */
  async mget(...keys: string[]): Promise<(string | null)[]> {
    return this.client.mget(...keys);
  }

  /**
   * Set multiple keys
   */
  async mset(keyValuePairs: Record<string, string>): Promise<string> {
    const args: string[] = [];
    for (const [key, value] of Object.entries(keyValuePairs)) {
      args.push(key, value);
    }
    return this.client.mset(...args);
  }

  /**
   * Delete keys by pattern
   */
  async deleteByPattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    return this.client.del(...keys);
  }
}
