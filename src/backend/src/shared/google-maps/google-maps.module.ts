import { Module, Global } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}
