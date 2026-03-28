import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isProduction = process.env.NODE_ENV === 'production';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Report unhandled errors (5xx) to Sentry with request context
    if (status >= 500) {
      Sentry.withScope((scope) => {
        scope.setTag('http.method', request.method);
        scope.setTag('http.status_code', String(status));
        scope.setExtra('url', request.path); // path only — no query string (no PII)
        // Attach user ID if authenticated (helps trace impact)
        const user = (request as any).user;
        if (user?.id) {
          scope.setUser({ id: user.id });
        }
        Sentry.captureException(exception);
      });

      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Build user-facing error body
    const safePath = isProduction && status >= 500
      ? request.path
      : request.url;

    let message: string | string[];
    if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = (exceptionResponse as any).message;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (status >= 500 && isProduction) {
      message = 'Internal server error';
    } else {
      message = String(exception instanceof Error ? exception.message : 'Internal server error');
    }

    const errorCode =
      exceptionResponse && typeof exceptionResponse === 'object' && 'error' in exceptionResponse
        ? (exceptionResponse as any).error
        : undefined;

    response.status(status).json({
      statusCode: status,
      ...(errorCode ? { error: errorCode } : {}),
      message,
      path: safePath,
      timestamp: new Date().toISOString(),
    });
  }
}
