// ⚠️  Must be first import — Sentry needs to instrument before any modules load
import './instrument';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction;

  // Trust proxy (required for Railway/Vercel — but only 1 hop)
  app.set('trust proxy', 1);

  // Global API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ── Security headers (Helmet) ─────────────────────────────────────────────
  // Applied before all other middleware so every response gets headers
  app.use(
    helmet({
      // Content-Security-Policy: lock down resource origins
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
            },
          }
        : false, // Disable CSP in development (Swagger UI needs inline scripts)
      // HSTS: force HTTPS for 1 year in production
      hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
      // Prevent clickjacking
      frameguard: { action: 'deny' },
      // Prevent MIME type sniffing
      noSniff: true,
      // XSS filter (legacy browsers)
      xssFilter: true,
      // Hide X-Powered-By header (don't advertise Express)
      hidePoweredBy: true,
      // Referrer policy: only send origin on same-origin requests
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // Disable browser DNS prefetch
      dnsPrefetchControl: { allow: false },
      // Prevent IE from opening downloads in site context
      ieNoOpen: true,
    }),
  );

  // Cookie parser for JWT authentication
  app.use(cookieParser());

  // Global exception filter — logs all 500s with stack trace
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Strip fields not in DTO
      forbidNonWhitelisted: true, // Reject requests with unknown fields
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── CORS ─────────────────────────────────────────────────────────────────
  // Explicit allowlist only — no wildcard subdomains in production
  const frontendUrl = process.env.FRONTEND_URL || configService.get<string>('app.appUrl');

  const productionOrigins = new Set([
    'https://storagecompare.ae',
    'https://www.storagecompare.ae',
    'https://storagecompare.vercel.app',          // main Vercel deployment
    'https://salf-storage-aggregator.vercel.app', // legacy deployment URL
  ]);

  // Add FRONTEND_URL to allowlist if it's a valid https URL
  if (frontendUrl && frontendUrl.startsWith('https://')) {
    productionOrigins.add(frontendUrl);
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, health checks, curl)
      if (!origin) {
        return callback(null, true);
      }

      // Development: allow any localhost port
      if (isDevelopment && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      // Production: strict allowlist only — no wildcard matching
      if (productionOrigins.has(origin)) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  });

  // ── Swagger — development only ────────────────────────────────────────────
  // Never expose API docs in production (enumerates all endpoints for attackers)
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('StorageCompare API')
      .setDescription('API for storagecompare.ae platform - MVP v1')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('warehouses', 'Warehouse management')
      .addTag('boxes', 'Storage box management')
      .addTag('bookings', 'Booking management')
      .addTag('reviews', 'Review management')
      .addTag('favorites', 'Favorites management')
      .addTag('crm', 'CRM management')
      .addTag('ai', 'AI-powered features')
      .addTag('media', 'Media management')
      .addTag('notifications', 'Notifications')
      .addTag('Health', 'Health checks')
      .addCookieAuth('auth_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth_token',
        description: 'JWT access token stored in httpOnly cookie',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    console.log(`📚 Swagger docs: http://localhost:${process.env.PORT || 3000}/${apiPrefix}/docs`);
  }

  // Railway assigns PORT dynamically
  const port = process.env.PORT || configService.get<number>('app.port') || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on port ${port} (${process.env.NODE_ENV || 'development'})`);
}
bootstrap();
