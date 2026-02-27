import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { GoogleMapsModule } from './shared/google-maps/google-maps.module';
import { RedisModule } from './shared/redis/redis.module';
import { S3Module } from './shared/s3/s3.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CrmModule } from './modules/crm/crm.module';
import { AiModule } from './modules/ai/ai.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';

// Configuration imports
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import googleMapsConfig from './config/google-maps.config';

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, googleMapsConfig],
      envFilePath: '.env',
    }),
    // Schedule module for cron jobs
    ScheduleModule.forRoot(),
    // Event emitter module for event-driven architecture
    EventEmitterModule.forRoot(),
    // Rate limiting module (global: 100 req/min per IP)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds (1 minute)
        limit: 100, // 100 requests per TTL window
      },
    ]),
    // Global Prisma module
    PrismaModule,
    // Global common module (activity logging, search logging)
    CommonModule,
    // Global shared modules
    GoogleMapsModule,
    RedisModule,
    S3Module,
    // Feature modules
    AuthModule,
    UsersModule,
    WarehousesModule,
    BoxesModule,
    BookingsModule,
    ReviewsModule,
    FavoritesModule,
    CrmModule,
    AiModule,
    MediaModule,
    NotificationsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Note: ThrottlerGuard is applied via @Throttle() decorators on specific endpoints
    // Global 100 req/min limit is configured in ThrottlerModule.forRoot() above
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
