import { Module } from '@nestjs/common';
import { WarehouseBoxesController, OperatorBoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseBoxesController, OperatorBoxesController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
