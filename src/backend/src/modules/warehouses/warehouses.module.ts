import { Module } from '@nestjs/common';
import { WarehousesController, OperatorWarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { GoogleMapsModule } from '../../shared/google-maps/google-maps.module';

@Module({
  imports: [PrismaModule, GoogleMapsModule],
  controllers: [WarehousesController, OperatorWarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
