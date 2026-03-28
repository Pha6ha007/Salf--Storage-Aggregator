/**
 * Security Configuration
 *
 * Central place for all security-related constants and helpers.
 * Consumed by main.ts, guards, and middleware.
 */

export const SECURITY = {
  /**
   * Rate limit windows (in ms) and request caps by endpoint category.
   * Values mirror the @Throttle() decorators — kept here for documentation.
   *
   * Global default  : 100 req / 60s (ThrottlerModule.forRoot)
   * Auth sensitive   : 5  req / 60s  (login, register, forgot-password)
   * Auth refresh     : 10 req / 60s  (token refresh)
   * Search           : 30 req / 60s  (warehouse search — heavier DB)
   * Admin / CRM      : 60 req / 60s  (authenticated staff, higher trust)
   */
  rateLimits: {
    global:         { limit: 100, ttl: 60_000 },
    authSensitive:  { limit: 5,   ttl: 60_000 },
    authRefresh:    { limit: 10,  ttl: 60_000 },
    search:         { limit: 30,  ttl: 60_000 },
    adminCrm:       { limit: 60,  ttl: 60_000 },
  },

  /**
   * Cookie settings per environment.
   * access_token  : 15 min, path=/
   * refresh_token : 7 days, path scoped to /api/v1/auth/refresh
   */
  cookies: {
    accessToken: {
      name: 'auth_token',
      maxAge: 15 * 60 * 1_000,
      path: '/',
    },
    refreshToken: {
      name: 'refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1_000,
      path: '/api/v1/auth/refresh', // scoped — not sent on every request
    },
  },

  /**
   * JWT lifetimes (must match JWT_ACCESS_EXPIRY / JWT_REFRESH_EXPIRY env vars).
   */
  jwt: {
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  /**
   * Password reset token TTL.
   */
  passwordReset: {
    ttlMs: 60 * 60 * 1_000, // 1 hour
  },
} as const;
