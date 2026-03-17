import { Controller, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService, HealthStatus, DetailedHealthStatus } from './health.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const SEED_SECRET = process.env.SEED_SECRET || 'storagecompare-seed-2026';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly prisma: PrismaService,
  ) {}

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

  /**
   * Seed endpoint — creates test admin + operator users
   * Protected by secret key query param
   * GET /api/v1/health/seed?secret=storagecompare-seed-2026
   */
  @Public()
  @Get('seed')
  async seed(@Query('secret') secret: string) {
    if (secret !== SEED_SECRET) {
      throw new UnauthorizedException('Invalid seed secret');
    }

    const results: string[] = [];
    const salt = await bcrypt.genSalt(10);

    // 1. Create/update admin user
    const adminEmail = 'admin@storagecompare.ae';
    const adminPassword = await bcrypt.hash('Admin1234!', salt);

    const adminUser = await this.prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'admin', isActive: true },
      create: {
        email: adminEmail,
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'StorageCompare',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      },
    });
    results.push(`Admin user: ${adminEmail} (password: Admin1234!)`);

    // 2. Create/update operator user
    const operatorEmail = 'operator@storagecompare.ae';
    const operatorPassword = await bcrypt.hash('Operator1234!', salt);

    const operatorUser = await this.prisma.user.upsert({
      where: { email: operatorEmail },
      update: { role: 'operator', isActive: true },
      create: {
        email: operatorEmail,
        passwordHash: operatorPassword,
        firstName: 'Test',
        lastName: 'Operator',
        role: 'operator',
        isActive: true,
        emailVerified: true,
      },
    });
    results.push(`Operator user: ${operatorEmail} (password: Operator1234!)`);

    // 3. Create operator profile if not exists
    const existingOperator = await this.prisma.operator.findUnique({
      where: { userId: operatorUser.id },
    });

    let operator = existingOperator;
    if (!existingOperator) {
      operator = await this.prisma.operator.create({
        data: {
          userId: operatorUser.id,
          companyName: 'Dubai Storage Solutions LLC',
          businessPhone: '+97144001234',
          businessEmail: operatorEmail,
          isVerified: true,
          verifiedAt: new Date(),
        },
      });
      results.push(`Operator profile created: Dubai Storage Solutions LLC`);
    } else {
      await this.prisma.operator.update({
        where: { userId: operatorUser.id },
        data: { isVerified: true, verifiedAt: new Date() },
      });
      results.push(`Operator profile updated (verified)`);
    }

    // 4. Also fix photobp2019@gmail.com — make sure operator record exists
    const mainUser = await this.prisma.user.findUnique({
      where: { email: 'photobp2019@gmail.com' },
    });
    if (mainUser) {
      const mainOperator = await this.prisma.operator.findUnique({
        where: { userId: mainUser.id },
      });
      if (!mainOperator) {
        await this.prisma.operator.create({
          data: {
            userId: mainUser.id,
            companyName: 'StorageCompare Admin',
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
        results.push(`Operator profile created for photobp2019@gmail.com`);
      }
      results.push(`Main admin (photobp2019@gmail.com): operator profile ready`);
    }

    // 5. Create a test warehouse
    if (operator) {
      const existingWarehouse = await this.prisma.warehouse.findFirst({
        where: { operatorId: operator.id },
      });

      if (!existingWarehouse) {
        const warehouse = await this.prisma.warehouse.create({
          data: {
            operatorId: operator.id,
            name: 'Dubai Business Bay Storage',
            description: 'Premium self-storage facility in Business Bay with 24/7 access, climate control, and top security.',
            status: 'active',
            address: 'Business Bay, Dubai, UAE',
            emirate: 'Dubai',
            district: 'Business Bay',
            latitude: 25.1855,
            longitude: 55.2625,
            hasClimateControl: true,
            has24x7Access: true,
            hasSecurityCameras: true,
            hasInsurance: false,
            hasParkingSpace: true,
            contactPhone: '+97144001234',
            contactEmail: operatorEmail,
            rating: 4.5,
            reviewCount: 12,
            isActive: true,
          },
        });

        // Create boxes
        await this.prisma.box.createMany({
          data: [
            {
              warehouseId: warehouse.id,
              boxNumber: 'S001',
              name: 'Small Storage Unit',
              size: 'S',
              lengthMeters: 1.5,
              widthMeters: 1.5,
              heightMeters: 2.4,
              areaSquareMeters: 2.25,
              priceMonthly: 299,
              totalQuantity: 10,
              availableQuantity: 8,
              isAvailable: true,
              hasClimateControl: false,
            },
            {
              warehouseId: warehouse.id,
              boxNumber: 'M001',
              name: 'Medium Storage Unit',
              size: 'M',
              lengthMeters: 3.0,
              widthMeters: 3.0,
              heightMeters: 2.4,
              areaSquareMeters: 9.0,
              priceMonthly: 599,
              totalQuantity: 8,
              availableQuantity: 5,
              isAvailable: true,
              hasClimateControl: true,
            },
            {
              warehouseId: warehouse.id,
              boxNumber: 'L001',
              name: 'Large Storage Unit',
              size: 'L',
              lengthMeters: 5.0,
              widthMeters: 5.0,
              heightMeters: 2.4,
              areaSquareMeters: 25.0,
              priceMonthly: 1299,
              totalQuantity: 5,
              availableQuantity: 3,
              isAvailable: true,
              hasClimateControl: true,
            },
          ],
        });

        results.push(`Test warehouse created: ${warehouse.name} (id: ${warehouse.id})`);
        results.push(`3 boxes created: S (AED 299), M (AED 599), L (AED 1299)`);
      } else {
        results.push(`Warehouse already exists: ${existingWarehouse.name}`);
      }
    }

    return {
      status: 'ok',
      message: 'Seed completed',
      results,
      credentials: {
        admin: { email: 'admin@storagecompare.ae', password: 'Admin1234!' },
        operator: { email: 'operator@storagecompare.ae', password: 'Operator1234!' },
      },
    };
  }
}
