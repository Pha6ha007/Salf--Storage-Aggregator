import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterOperatorDto } from './dto/register-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { UserRegisteredEvent } from '../../common/events/user.events';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Register a new operator account.
   * Creates both a User (role=operator) and an Operator record in a transaction.
   * Returns the operator profile and issues JWT cookies.
   */
  async register(dto: RegisterOperatorDto) {
    // Validate passwords match
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check email uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Split name into first/last
    const nameParts = dto.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    // Create User + Operator in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone: dto.phone,
          role: 'operator',
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      });

      const operator = await tx.operator.create({
        data: {
          userId: user.id,
          companyName: dto.company_name,
          tradeLicenseNumber: dto.trade_license_number,
          isVerified: false,
        },
      });

      // Create default operator settings
      await tx.operatorSettings.create({
        data: {
          operatorId: operator.id,
          autoConfirmBookings: false,
          emailNotifications: true,
          smsNotifications: false,
          whatsappNotifications: false,
        },
      });

      return { user, operator };
    });

    // Emit event (fire-and-forget)
    try {
      this.eventEmitter.emit(
        'user.registered',
        new UserRegisteredEvent(result.user.id, result.user.email, result.user.role),
      );
    } catch (err) {
      this.logger.warn(`Failed to emit user.registered event: ${err.message}`);
    }

    return result;
  }

  /**
   * Generate JWT tokens for operator (delegates to same pattern as AuthService).
   */
  async generateTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (this.configService.get<string>('jwt.accessExpiry') || '15m') as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (this.configService.get<string>('jwt.refreshExpiry') || '7d') as any,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Get operator profile for current authenticated operator.
   */
  async getProfile(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!operator || operator.deletedAt) {
      throw new NotFoundException('Operator profile not found');
    }

    const stats = await this.computeStatistics(operator.id);

    return this.formatProfile(operator, stats);
  }

  /**
   * Update operator profile fields.
   */
  async updateProfile(userId: string, dto: UpdateOperatorDto) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!operator || operator.deletedAt) {
      throw new NotFoundException('Operator profile not found');
    }

    // Update operator record
    const updatedOperator = await this.prisma.operator.update({
      where: { id: operator.id },
      data: {
        companyName: dto.company_name ?? operator.companyName,
        tradeLicenseNumber: dto.trade_license_number ?? operator.tradeLicenseNumber,
        businessEmail: dto.business_email ?? operator.businessEmail,
        businessPhone: dto.business_phone ?? operator.businessPhone,
        website: dto.website ?? operator.website,
        legalAddress: dto.legal_address ?? operator.legalAddress,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    // Update user name/phone if provided
    if (dto.name || dto.phone) {
      const nameParts = dto.name ? dto.name.trim().split(' ') : [];
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.name && {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' ') || undefined,
          }),
          ...(dto.phone && { phone: dto.phone }),
        },
      });
    }

    return this.formatProfile(updatedOperator, null);
  }

  /**
   * Get operator statistics (warehouse, box, booking aggregates).
   */
  async getStatistics(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });

    if (!operator || operator.deletedAt) {
      throw new NotFoundException('Operator profile not found');
    }

    return this.computeStatistics(operator.id);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private async computeStatistics(operatorId: number) {
    const [
      warehouseStats,
      boxStats,
      bookingStats,
      ratingStats,
    ] = await Promise.all([
      // Warehouse counts
      this.prisma.warehouse.groupBy({
        by: ['status'],
        where: { operatorId, deletedAt: null },
        _count: { id: true },
      }),
      // Box counts via warehouse
      this.prisma.box.aggregate({
        where: {
          warehouse: { operatorId, deletedAt: null },
          deletedAt: null,
        },
        _sum: {
          totalQuantity: true,
          occupiedQuantity: true,
          availableQuantity: true,
        },
      }),
      // Booking counts via warehouse
      this.prisma.booking.groupBy({
        by: ['status'],
        where: {
          warehouse: { operatorId },
          deletedAt: null,
        },
        _count: { id: true },
      }),
      // Average rating across all warehouses
      this.prisma.warehouse.aggregate({
        where: { operatorId, deletedAt: null },
        _avg: { rating: true },
      }),
    ]);

    const totalWarehouses = warehouseStats.reduce((s, g) => s + g._count.id, 0);
    const activeWarehouses = warehouseStats.find(g => g.status === 'active')?._count.id ?? 0;

    const totalBoxes = boxStats._sum.totalQuantity ?? 0;
    const occupiedBoxes = boxStats._sum.occupiedQuantity ?? 0;
    const availableBoxes = boxStats._sum.availableQuantity ?? 0;

    const totalBookings = bookingStats.reduce((s, g) => s + g._count.id, 0);
    const activeBookings =
      (bookingStats.find(g => g.status === 'confirmed')?._count.id ?? 0) +
      (bookingStats.find(g => g.status === 'pending')?._count.id ?? 0);
    const pendingBookings = bookingStats.find(g => g.status === 'pending')?._count.id ?? 0;

    return {
      total_warehouses: totalWarehouses,
      active_warehouses: activeWarehouses,
      total_boxes: totalBoxes,
      occupied_boxes: occupiedBoxes,
      available_boxes: availableBoxes,
      total_bookings: totalBookings,
      active_bookings: activeBookings,
      pending_bookings: pendingBookings,
      average_rating: Number((ratingStats._avg.rating ?? 0).toFixed(2)),
    };
  }

  private formatProfile(operator: any, statistics: any) {
    const user = operator.user;
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

    return {
      id: operator.id,
      user_id: user.id,
      email: user.email,
      name: fullName,
      phone: user.phone,
      role: user.role,
      is_verified: operator.isVerified,
      verified_at: operator.verifiedAt,
      company_info: {
        company_name: operator.companyName,
        trade_license_number: operator.tradeLicenseNumber,
        tax_registration_number: operator.taxRegistrationNumber,
        legal_address: operator.legalAddress,
        business_phone: operator.businessPhone,
        business_email: operator.businessEmail,
        website: operator.website,
      },
      ...(statistics && { statistics }),
      created_at: operator.createdAt,
      updated_at: operator.updatedAt,
    };
  }
}
