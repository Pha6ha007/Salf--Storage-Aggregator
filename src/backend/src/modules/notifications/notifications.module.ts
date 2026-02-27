import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationListener } from './listeners/notification.listener';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationService, NotificationListener],
  exports: [NotificationService],
})
export class NotificationsModule {}
