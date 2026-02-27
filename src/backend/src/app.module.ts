import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GoogleMapsModule } from './shared/google-maps/google-maps.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

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
    // Global Prisma module
    PrismaModule,
    // Global shared modules
    GoogleMapsModule,
    // Feature modules
    AuthModule,
    UsersModule,
    WarehousesModule,
    BoxesModule,
    BookingsModule,
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
  ],
})
export class AppModule {}
