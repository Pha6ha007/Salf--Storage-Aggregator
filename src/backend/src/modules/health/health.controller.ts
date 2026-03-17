import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService, HealthStatus, DetailedHealthStatus } from './health.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Basic health check', description: 'Public endpoint' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  getHealth(): HealthStatus {
    return this.healthService.getHealth();
  }

  @Get('detailed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Detailed health check (Admin only)' })
  @ApiResponse({ status: 200, description: 'Detailed health status' })
  async getDetailedHealth(): Promise<DetailedHealthStatus> {
    return this.healthService.getDetailedHealth();
  }
}
