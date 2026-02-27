import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Cookie parser for JWT authentication
  app.use(cookieParser());

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
  const allowedOrigins = [
    'https://storagecompare.ae',
    'https://www.storagecompare.ae',
    'https://api.storagecompare.ae',
    configService.get<string>('app.appUrl') || 'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
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

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
