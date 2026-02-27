import { Module } from '@nestjs/common';
import { BookingsController, OperatorBookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsCronService } from './bookings.cron';
import { PrismaModule } from '../../prisma/prisma.module';
import { BoxesModule } from '../boxes/boxes.module';

@Module({
  imports: [PrismaModule, BoxesModule],
  controllers: [BookingsController, OperatorBookingsController],
  providers: [BookingsService, BookingsCronService],
  exports: [BookingsService],
})
export class BookingsModule {}
