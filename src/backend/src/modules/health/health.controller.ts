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

    // 1b. Create operator profile for admin user too (so they can access operator dashboard)
    const adminOperator = await this.prisma.operator.findUnique({ where: { userId: adminUser.id } });
    if (!adminOperator) {
      await this.prisma.operator.create({
        data: {
          userId: adminUser.id,
          companyName: 'StorageCompare Admin',
          isVerified: true,
          verifiedAt: new Date(),
        },
      });
      results.push(`Operator profile created for admin@storagecompare.ae`);
    }

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

      // Create additional demo warehouses in other emirates
      const demoWarehouses = [
        {
          name: 'Abu Dhabi Al Reem Island Storage',
          description: 'Modern self-storage facility on Al Reem Island. Climate-controlled units, 24/7 CCTV, and flexible monthly contracts.',
          address: 'Al Reem Island, Abu Dhabi, UAE',
          emirate: 'Abu Dhabi',
          district: 'Al Reem Island',
          latitude: 24.5007,
          longitude: 54.4073,
          hasClimateControl: true,
          has24x7Access: false,
          hasSecurityCameras: true,
          hasParkingSpace: true,
          rating: 4.2,
          boxes: [
            { boxNumber: 'AD-S01', name: 'Small Unit', size: 'S', length: 1.5, width: 1.5, height: 2.4, area: 2.25, price: 279, qty: 12, avail: 10 },
            { boxNumber: 'AD-M01', name: 'Medium Unit', size: 'M', length: 3.0, width: 3.0, height: 2.4, area: 9.0, price: 549, qty: 8, avail: 6 },
            { boxNumber: 'AD-L01', name: 'Large Unit', size: 'L', length: 5.0, width: 5.0, height: 2.4, area: 25.0, price: 1199, qty: 4, avail: 2 },
          ],
        },
        {
          name: 'Sharjah Industrial Area Storage',
          description: 'Affordable storage solutions in Sharjah Industrial Area. Large units ideal for business inventory and household goods.',
          address: 'Industrial Area 1, Sharjah, UAE',
          emirate: 'Sharjah',
          district: 'Industrial Area',
          latitude: 25.3463,
          longitude: 55.4209,
          hasClimateControl: false,
          has24x7Access: true,
          hasSecurityCameras: true,
          hasParkingSpace: true,
          rating: 3.9,
          boxes: [
            { boxNumber: 'SH-S01', name: 'Small Unit', size: 'S', length: 1.5, width: 1.5, height: 2.4, area: 2.25, price: 199, qty: 20, avail: 15 },
            { boxNumber: 'SH-M01', name: 'Medium Unit', size: 'M', length: 3.0, width: 3.0, height: 2.4, area: 9.0, price: 399, qty: 15, avail: 10 },
            { boxNumber: 'SH-XL01', name: 'XL Unit', size: 'XL', length: 8.0, width: 5.0, height: 3.0, area: 40.0, price: 1499, qty: 6, avail: 4 },
          ],
        },
        {
          name: 'Dubai JLT Premium Storage',
          description: 'Premium storage in Jumeirah Lakes Towers. Climate-controlled, 24/7 access with valet service available.',
          address: 'JLT Cluster T, Dubai, UAE',
          emirate: 'Dubai',
          district: 'Jumeirah Lakes Towers',
          latitude: 25.0657,
          longitude: 55.1414,
          hasClimateControl: true,
          has24x7Access: true,
          hasSecurityCameras: true,
          hasParkingSpace: false,
          rating: 4.7,
          boxes: [
            { boxNumber: 'JLT-XS01', name: 'Extra Small Unit', size: 'XS', length: 1.0, width: 1.0, height: 2.4, area: 1.0, price: 199, qty: 15, avail: 8 },
            { boxNumber: 'JLT-S01', name: 'Small Unit', size: 'S', length: 1.5, width: 1.5, height: 2.4, area: 2.25, price: 349, qty: 10, avail: 7 },
            { boxNumber: 'JLT-M01', name: 'Medium Unit', size: 'M', length: 3.0, width: 3.0, height: 2.4, area: 9.0, price: 699, qty: 8, avail: 3 },
          ],
        },
      ];

      for (const demo of demoWarehouses) {
        const exists = await this.prisma.warehouse.findFirst({ where: { name: demo.name } });
        if (!exists) {
          const wh = await this.prisma.warehouse.create({
            data: {
              operatorId: operator.id,
              name: demo.name,
              description: demo.description,
              status: 'active',
              address: demo.address,
              emirate: demo.emirate,
              district: demo.district,
              latitude: demo.latitude,
              longitude: demo.longitude,
              hasClimateControl: demo.hasClimateControl,
              has24x7Access: demo.has24x7Access,
              hasSecurityCameras: demo.hasSecurityCameras,
              hasInsurance: false,
              hasParkingSpace: demo.hasParkingSpace,
              contactPhone: '+97144001234',
              contactEmail: operatorEmail,
              rating: demo.rating,
              reviewCount: Math.floor(Math.random() * 20) + 3,
              isActive: true,
            },
          });
          await this.prisma.box.createMany({
            data: demo.boxes.map(b => ({
              warehouseId: wh.id,
              boxNumber: b.boxNumber,
              name: b.name,
              size: b.size as any,
              lengthMeters: b.length,
              widthMeters: b.width,
              heightMeters: b.height,
              areaSquareMeters: b.area,
              priceMonthly: b.price,
              totalQuantity: b.qty,
              availableQuantity: b.avail,
              isAvailable: true,
              hasClimateControl: demo.hasClimateControl,
            })),
          });
          results.push(`Demo warehouse created: ${demo.name}`);
        } else {
          results.push(`Demo warehouse exists: ${demo.name}`);
        }
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
