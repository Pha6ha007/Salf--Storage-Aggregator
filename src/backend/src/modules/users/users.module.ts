import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookingsModule } from '../bookings/bookings.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [PrismaModule, BookingsModule, FavoritesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
