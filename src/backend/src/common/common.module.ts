import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityLogService } from './services/activity-log.service';
import { SearchLogService } from './services/search-log.service';
import { ActivityLogListener } from './listeners/activity-log.listener';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [ActivityLogService, SearchLogService, ActivityLogListener],
  exports: [ActivityLogService, SearchLogService],
})
export class CommonModule {}
