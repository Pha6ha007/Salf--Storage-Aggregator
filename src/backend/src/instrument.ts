/**
 * Sentry Instrumentation
 *
 * IMPORTANT: This file must be imported FIRST in main.ts — before any other imports.
 * Sentry needs to hook into Node.js internals before any modules load.
 *
 * Docs: https://docs.sentry.io/platforms/javascript/guides/nestjs/
 */
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const dsn = process.env.SENTRY_DSN;

// Only initialize if DSN is configured — skip silently in development
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION || '1.0.0',

    integrations: [
      nodeProfilingIntegration(), // Performance profiling
    ],

    // Capture 100% of transactions in production for performance monitoring
    // Lower this to 0.1 (10%) if traffic grows and Sentry costs increase
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

    // Profile 10% of sampled transactions
    profilesSampleRate: 0.1,

    // Don't send errors from health check endpoints — too noisy
    ignoreErrors: [
      /health/i,
    ],

    // Scrub sensitive data before sending to Sentry
    // Never send passwords, tokens, or cookies
    beforeSend(event) {
      // Strip auth cookies from request data
      if (event.request?.cookies) {
        const cookies = event.request.cookies as Record<string, string>;
        if (cookies['auth_token']) cookies['auth_token'] = '[REDACTED]';
        if (cookies['refresh_token']) cookies['refresh_token'] = '[REDACTED]';
      }

      // Strip Authorization header
      if (event.request?.headers) {
        const headers = event.request.headers as Record<string, string>;
        if (headers['authorization']) headers['authorization'] = '[REDACTED]';
        if (headers['cookie']) headers['cookie'] = '[REDACTED]';
      }

      // Strip password fields from request body
      if (event.request?.data && typeof event.request.data === 'object') {
        const data = event.request.data as Record<string, unknown>;
        const sensitiveFields = ['password', 'passwordHash', 'newPassword', 'currentPassword', 'token'];
        for (const field of sensitiveFields) {
          if (field in data) data[field] = '[REDACTED]';
        }
      }

      return event;
    },
  });

  console.log(`📡 Sentry initialized (env: ${process.env.NODE_ENV})`);
} else if (process.env.NODE_ENV === 'production') {
  // Warn in production if Sentry is not configured — errors will go unmonitored
  console.warn('⚠️  SENTRY_DSN not set — error monitoring is disabled in production');
}
