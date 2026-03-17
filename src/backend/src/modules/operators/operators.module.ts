import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'your-secret-key-change-in-production',
        signOptions: {
          expiresIn: (configService.get<string>('jwt.accessExpiry') || '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}
