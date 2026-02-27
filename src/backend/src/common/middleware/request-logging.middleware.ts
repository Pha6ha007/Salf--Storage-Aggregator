import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Request Logging Middleware
 *
 * Logs all incoming HTTP requests with structured JSON format
 * Captures: method, path, statusCode, responseTime, userId, IP
 * Skips health check endpoints to reduce log noise
 */
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Skip health check endpoints
    if (originalUrl.startsWith('/api/v1/health')) {
      next();
      return;
    }

    // Extract user ID from request if available (set by JWT auth)
    // @ts-ignore - req.user is set by passport JWT strategy
    const userId = req.user?.id || null;

    // Log when response finishes
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      const logData = {
        method,
        path: originalUrl,
        statusCode,
        responseTimeMs: responseTime,
        userId,
        ip: ip || req.socket.remoteAddress,
        userAgent,
        timestamp: new Date().toISOString(),
      };

      // Use appropriate log level based on status code
      if (statusCode >= 500) {
        this.logger.error(JSON.stringify(logData));
      } else if (statusCode >= 400) {
        this.logger.warn(JSON.stringify(logData));
      } else {
        this.logger.log(JSON.stringify(logData));
      }
    });

    next();
  }
}
