import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsCronService {
  private readonly logger = new Logger(BookingsCronService.name);

  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Auto-expire pending bookings after 24 hours
   * Runs every hour on the hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpireBookings() {
    this.logger.log('Running scheduled job: expire pending bookings');

    try {
      const result = await this.bookingsService.expirePendingBookings();

      if (result.expired > 0) {
        this.logger.log(`Successfully expired ${result.expired} pending booking(s)`);
      } else {
        this.logger.debug('No pending bookings to expire');
      }
    } catch (error) {
      this.logger.error('Failed to expire pending bookings', error.stack);
    }
  }
}
