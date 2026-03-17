import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust proxy (required for Railway/Vercel)
  app.set('trust proxy', 1);

  // Global API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Cookie parser for JWT authentication
  app.use(cookieParser());

  // Global exception filter — logs all 500s with stack trace
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration for storagecompare.ae
  const frontendUrl = process.env.FRONTEND_URL || configService.get<string>('app.appUrl') || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    'https://storagecompare.ae',
    'https://www.storagecompare.ae',
    'https://storagecompare.vercel.app',
    'https://salf-storage-aggregator.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // In development, allow all localhost origins
  const isDevelopment = process.env.NODE_ENV === 'development';

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        return callback(null, true);
      }

      // In development, allow localhost on any port
      if (isDevelopment && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      // Allow any vercel.app preview deployment
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger API documentation
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

  // Railway assigns PORT dynamically
  const port = process.env.PORT || configService.get<number>('app.port') || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Railway

  const environment = process.env.NODE_ENV || 'development';
  console.log(`🚀 Application is running on port ${port} (${environment})`);
  console.log(`📚 Swagger documentation: /${apiPrefix}/docs`);
}
bootstrap();
