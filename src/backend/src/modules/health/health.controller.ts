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

  /**
   * Detailed health check - admin only
   * Returns detailed status including database, Redis, and S3 checks
   */
  @Get('detailed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({
    summary: 'Detailed health check (Admin only)',
    description: 'Returns detailed health status including database, Redis, and S3 connection checks',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ok', 'error'], example: 'ok' },
        timestamp: { type: 'string', format: 'date-time', example: '2026-02-27T10:00:00.000Z' },
        uptime: { type: 'number', example: 123456.789 },
        version: { type: 'string', example: '1.0.0' },
        checks: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'], example: 'ok' },
                message: { type: 'string', example: 'Connection successful' },
                responseTime: { type: 'number', example: 5, description: 'Response time in ms' },
              },
            },
            redis: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'], example: 'ok' },
                message: { type: 'string', example: 'Connection successful' },
                responseTime: { type: 'number', example: 2 },
              },
            },
            s3: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'], example: 'ok' },
                message: { type: 'string', example: 'Connection successful' },
                responseTime: { type: 'number', example: 50 },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getDetailedHealth(): Promise<DetailedHealthStatus> {
    return this.healthService.getDetailedHealth();
  }
}
