import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, WarehouseStatus, Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Users ────────────────────────────────────────────────────────────────

  async listUsers(params: {
    page?: number;
    perPage?: number;
    search?: string;
    role?: UserRole;
    status?: 'active' | 'suspended' | 'all';
  }) {
    const page = params.page ?? 1;
    const perPage = Math.min(params.perPage ?? 20, 100);
    const skip = (page - 1) * perPage;

    const where: Prisma.UserWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } },
      ];
    }
    if (params.role) {
      where.role = params.role;
    }
    if (params.status === 'active') {
      where.isActive = true;
    } else if (params.status === 'suspended') {
      where.isActive = false;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          _count: {
            select: { bookings: true, reviews: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
        phone: u.phone,
        role: u.role,
        status: u.isActive ? 'active' : 'suspended',
        email_verified: u.emailVerified,
        created_at: u.createdAt,
        updated_at: u.updatedAt,
        last_login_at: u.lastLoginAt,
        bookings_count: u._count.bookings,
        reviews_count: u._count.reviews,
      })),
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }

  async getUserDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true, reviews: true, favorites: true },
        },
        bookings: {
          select: { status: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const bookingCounts = user.bookings.reduce(
      (acc: Record<string, number>, b) => {
        acc[b.status] = (acc[b.status] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return {
      data: {
        id: user.id,
        email: user.email,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        phone: user.phone,
        role: user.role,
        status: user.isActive ? 'active' : 'suspended',
        email_verified: user.emailVerified,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        last_login_at: user.lastLoginAt,
        bookings: {
          total: user._count.bookings,
          pending: bookingCounts['pending'] ?? 0,
          confirmed: bookingCounts['confirmed'] ?? 0,
          completed: bookingCounts['completed'] ?? 0,
          cancelled: bookingCounts['cancelled'] ?? 0,
        },
        favorites_count: user._count.favorites,
      },
    };
  }

  async suspendUser(id: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new BadRequestException('User is already suspended');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      }),
      // Revoke all refresh tokens so active sessions are invalidated
      this.prisma.refreshToken.updateMany({
        where: { userId: id },
        data: { revokedAt: new Date() },
      }),
    ]);

    return {
      data: {
        id,
        status: 'suspended',
        suspended_at: new Date(),
        reason,
      },
    };
  }

  async restoreUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isActive) throw new BadRequestException('User is already active');

    await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    return {
      data: {
        id,
        status: 'active',
        restored_at: new Date(),
      },
    };
  }

  // ── Operators ─────────────────────────────────────────────────────────────

  async listOperators(params: {
    page?: number;
    perPage?: number;
    search?: string;
    verified?: boolean;
  }) {
    const page = params.page ?? 1;
    const perPage = Math.min(params.perPage ?? 20, 100);
    const skip = (page - 1) * perPage;

    const where: Prisma.OperatorWhereInput = {};

    if (params.verified !== undefined) {
      where.isVerified = params.verified;
    }

    if (params.search) {
      where.OR = [
        { companyName: { contains: params.search, mode: 'insensitive' } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [operators, total] = await Promise.all([
      this.prisma.operator.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              isActive: true,
            },
          },
          _count: { select: { warehouses: true } },
        },
      }),
      this.prisma.operator.count({ where }),
    ]);

    return {
      data: operators.map((op) => ({
        id: op.id,
        user_id: op.userId,
        company_name: op.companyName,
        trade_license_number: op.tradeLicenseNumber,
        contact_name: `${op.user.firstName ?? ''} ${op.user.lastName ?? ''}`.trim(),
        email: op.user.email,
        phone: op.user.phone,
        is_verified: op.isVerified,
        verified_at: op.verifiedAt,
        user_active: op.user.isActive,
        warehouses_count: op._count.warehouses,
        created_at: op.createdAt,
      })),
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }

  async approveOperator(id: number) {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: { user: { select: { email: true, firstName: true } } },
    });
    if (!operator) throw new NotFoundException('Operator not found');

    const updated = await this.prisma.operator.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    return {
      data: {
        id: updated.id,
        is_verified: updated.isVerified,
        verified_at: updated.verifiedAt,
        message: 'Operator approved successfully',
      },
    };
  }

  async rejectOperator(id: number, reason?: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
    });
    if (!operator) throw new NotFoundException('Operator not found');

    // Deactivate the operator's user account
    await this.prisma.user.update({
      where: { id: operator.userId },
      data: { isActive: false },
    });

    return {
      data: {
        id,
        status: 'rejected',
        reason,
        rejected_at: new Date(),
        message: 'Operator rejected and account deactivated',
      },
    };
  }

  // ── Warehouses ────────────────────────────────────────────────────────────

  async listWarehouses(params: {
    page?: number;
    perPage?: number;
    status?: WarehouseStatus;
    search?: string;
    operatorId?: number;
  }) {
    const page = params.page ?? 1;
    const perPage = Math.min(params.perPage ?? 20, 100);
    const skip = (page - 1) * perPage;

    const where: Prisma.WarehouseWhereInput = { deletedAt: null };

    if (params.status) {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { address: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.operatorId) {
      where.operatorId = params.operatorId;
    }

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          operator: {
            include: {
              user: { select: { email: true, firstName: true, lastName: true } },
            },
          },
          _count: { select: { boxes: true } },
        },
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    return {
      data: warehouses.map((wh) => ({
        id: wh.id,
        name: wh.name,
        address: wh.address,
        emirate: wh.emirate,
        status: wh.status,
        operator: {
          id: wh.operator.id,
          company_name: wh.operator.companyName,
          contact_email: wh.operator.user.email,
          contact_name: `${wh.operator.user.firstName ?? ''} ${wh.operator.user.lastName ?? ''}`.trim(),
        },
        boxes_count: wh._count.boxes,
        created_at: wh.createdAt,
        updated_at: wh.updatedAt,
      })),
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }

  async approveWarehouse(id: number, adminNotes?: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    if (warehouse.status !== 'pending_moderation') {
      throw new BadRequestException(
        `Cannot approve warehouse with status '${warehouse.status}'. Expected 'pending_moderation'.`,
      );
    }

    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: 'active' },
    });

    return {
      data: {
        id: updated.id,
        status: updated.status,
        admin_notes: adminNotes,
        message: 'Warehouse approved and is now active',
      },
    };
  }

  async rejectWarehouse(id: number, reason: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: 'blocked' },
    });

    return {
      data: {
        id: updated.id,
        status: updated.status,
        reason,
        rejected_at: new Date(),
        message: 'Warehouse rejected and blocked',
      },
    };
  }

  async forceDisableWarehouse(id: number, reason: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: 'blocked', isActive: false },
    });

    return {
      data: {
        id: updated.id,
        status: updated.status,
        reason,
        disabled_at: new Date(),
      },
    };
  }

  // ── Bookings ──────────────────────────────────────────────────────────────

  async listBookings(params: {
    page?: number;
    perPage?: number;
    status?: string;
    warehouseId?: number;
    userId?: string;
  }) {
    const page = params.page ?? 1;
    const perPage = Math.min(params.perPage ?? 20, 100);
    const skip = (page - 1) * perPage;

    const where: Prisma.BookingWhereInput = {};
    if (params.status) where.status = params.status as any;
    if (params.warehouseId) where.warehouseId = params.warehouseId;
    if (params.userId) where.userId = params.userId;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          warehouse: { select: { id: true, name: true } },
          box: { select: { id: true, boxNumber: true, size: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }

  // ── Reviews (moderation) ──────────────────────────────────────────────────

  async listReviews(params: { page?: number; perPage?: number; isVisible?: boolean }) {
    const page = params.page ?? 1;
    const perPage = Math.min(params.perPage ?? 20, 100);
    const skip = (page - 1) * perPage;

    const where: Prisma.ReviewWhereInput = {};
    if (params.isVisible !== undefined) where.isVisible = params.isVisible;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          warehouse: { select: { id: true, name: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      pagination: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    };
  }

  async setReviewVisibility(id: number, isVisible: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { isVisible },
    });

    return {
      data: {
        id: updated.id,
        is_visible: updated.isVisible,
        message: isVisible ? 'Review is now visible' : 'Review hidden',
      },
    };
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const [
      totalUsers,
      totalOperators,
      pendingOperators,
      totalWarehouses,
      pendingWarehouses,
      totalBookings,
      activeBookings,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'user' } }),
      this.prisma.operator.count(),
      this.prisma.operator.count({ where: { isVerified: false } }),
      this.prisma.warehouse.count({ where: { deletedAt: null } }),
      this.prisma.warehouse.count({ where: { status: 'pending_moderation', deletedAt: null } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'confirmed' } }),
    ]);

    return {
      data: {
        users: { total: totalUsers },
        operators: { total: totalOperators, pending_verification: pendingOperators },
        warehouses: { total: totalWarehouses, pending_moderation: pendingWarehouses },
        bookings: { total: totalBookings, active: activeBookings },
      },
    };
  }
}
