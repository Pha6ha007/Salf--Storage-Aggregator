import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma, WarehouseStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleMapsService, GeocodeResult } from '../../shared/google-maps/google-maps.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { FilterWarehousesDto } from './dto/filter-warehouses.dto';
import {
  WarehouseCreatedEvent,
  WarehouseUpdatedEvent,
  WarehouseStatusChangedEvent,
} from '../../common/events/warehouse.events';

@Injectable()
export class WarehousesService {
  constructor(
    private prisma: PrismaService,
    private googleMapsService: GoogleMapsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(operatorId: number, createWarehouseDto: CreateWarehouseDto) {
    // Geocode address to get coordinates
    const geocodeResult = await this.googleMapsService.geocodeAddress(
      createWarehouseDto.address,
    );

    // Create warehouse
    const warehouse = await this.prisma.warehouse.create({
      data: {
        operatorId,
        name: createWarehouseDto.name,
        description: createWarehouseDto.description,
        address: geocodeResult.formattedAddress,
        emirate: createWarehouseDto.emirate,
        district: createWarehouseDto.district,
        latitude: geocodeResult.latitude,
        longitude: geocodeResult.longitude,
        hasClimateControl: createWarehouseDto.hasClimateControl ?? false,
        has24x7Access: createWarehouseDto.has24x7Access ?? false,
        hasSecurityCameras: createWarehouseDto.hasSecurityCameras ?? false,
        hasInsurance: createWarehouseDto.hasInsurance ?? false,
        hasParkingSpace: createWarehouseDto.hasParkingSpace ?? false,
        workingHours: createWarehouseDto.workingHours as any,
        contactPhone: createWarehouseDto.contactPhone,
        contactEmail: createWarehouseDto.contactEmail,
        status: 'draft',
      },
      include: {
        operator: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    // Update PostGIS coordinates using raw SQL
    await this.updateWarehouseCoordinates(warehouse.id, geocodeResult.latitude, geocodeResult.longitude);

    // Emit warehouse.created event
    this.eventEmitter.emit(
      'warehouse.created',
      new WarehouseCreatedEvent(
        warehouse.id,
        operatorId,
        warehouse.name,
        warehouse.emirate,
        String(operatorId), // actorId
      ),
    );

    return warehouse;
  }

  async update(id: number, operatorId: number, updateWarehouseDto: UpdateWarehouseDto) {
    // Check if warehouse exists and belongs to operator
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (existing.operatorId !== operatorId) {
      throw new ForbiddenException('You can only update your own warehouses');
    }

    // Track status change for event emission
    const statusChanged = updateWarehouseDto.status && updateWarehouseDto.status !== existing.status;
    const oldStatus = existing.status;

    // If address is being updated, re-geocode
    let geocodeResult: GeocodeResult | null = null;
    if (updateWarehouseDto.address) {
      geocodeResult = await this.googleMapsService.geocodeAddress(
        updateWarehouseDto.address,
      );
    }

    // Update warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: {
        name: updateWarehouseDto.name,
        description: updateWarehouseDto.description,
        address: geocodeResult?.formattedAddress ?? updateWarehouseDto.address,
        emirate: updateWarehouseDto.emirate,
        district: updateWarehouseDto.district,
        latitude: geocodeResult?.latitude,
        longitude: geocodeResult?.longitude,
        hasClimateControl: updateWarehouseDto.hasClimateControl,
        has24x7Access: updateWarehouseDto.has24x7Access,
        hasSecurityCameras: updateWarehouseDto.hasSecurityCameras,
        hasInsurance: updateWarehouseDto.hasInsurance,
        hasParkingSpace: updateWarehouseDto.hasParkingSpace,
        workingHours: updateWarehouseDto.workingHours as any,
        contactPhone: updateWarehouseDto.contactPhone,
        contactEmail: updateWarehouseDto.contactEmail,
        status: updateWarehouseDto.status,
      },
      include: {
        operator: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    // Update PostGIS coordinates if address changed
    if (geocodeResult) {
      await this.updateWarehouseCoordinates(id, geocodeResult.latitude, geocodeResult.longitude);
    }

    // Emit warehouse.updated event
    const changes: Record<string, any> = {};
    Object.keys(updateWarehouseDto).forEach(key => {
      if (updateWarehouseDto[key] !== undefined) {
        changes[key] = updateWarehouseDto[key];
      }
    });

    this.eventEmitter.emit(
      'warehouse.updated',
      new WarehouseUpdatedEvent(
        warehouse.id,
        operatorId,
        changes,
        String(operatorId), // actorId
      ),
    );

    // Emit warehouse.status_changed event if status changed
    if (statusChanged && updateWarehouseDto.status) {
      this.eventEmitter.emit(
        'warehouse.status_changed',
        new WarehouseStatusChangedEvent(
          warehouse.id,
          operatorId,
          oldStatus,
          updateWarehouseDto.status,
          String(operatorId), // actorId
        ),
      );
    }

    return warehouse;
  }

  async delete(id: number, operatorId: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only delete your own warehouses');
    }

    // Soft delete
    await this.prisma.warehouse.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Warehouse deleted successfully' };
  }

  async findAll(filters: FilterWarehousesDto) {
    const {
      emirate,
      district,
      search,
      hasClimateControl,
      has24x7Access,
      hasSecurityCameras,
      hasInsurance,
      hasParkingSpace,
      minRating,
      latitude,
      longitude,
      radiusKm = 10,
      status = 'active',
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.WarehouseWhereInput = {
      deletedAt: null,
      isActive: true,
      status: status,
    };

    if (emirate) {
      where.emirate = { contains: emirate, mode: 'insensitive' };
    }

    if (district) {
      where.district = { contains: district, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (hasClimateControl !== undefined) {
      where.hasClimateControl = hasClimateControl;
    }

    if (has24x7Access !== undefined) {
      where.has24x7Access = has24x7Access;
    }

    if (hasSecurityCameras !== undefined) {
      where.hasSecurityCameras = hasSecurityCameras;
    }

    if (hasInsurance !== undefined) {
      where.hasInsurance = hasInsurance;
    }

    if (hasParkingSpace !== undefined) {
      where.hasParkingSpace = hasParkingSpace;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Geospatial search with PostGIS
    if (latitude !== undefined && longitude !== undefined) {
      // Use raw SQL for geospatial query
      const radiusMeters = radiusKm * 1000;

      const warehouses = await this.prisma.$queryRaw<any[]>`
        SELECT
          w.*,
          ST_Distance(
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ST_MakePoint(w.longitude, w.latitude)::geography
          ) / 1000 as distance
        FROM warehouses w
        WHERE
          w.deleted_at IS NULL
          AND w.is_active = true
          AND w.status = ${status}::warehouse_status
          AND ST_DWithin(
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ST_MakePoint(w.longitude, w.latitude)::geography,
            ${radiusMeters}
          )
          ${emirate ? Prisma.sql`AND LOWER(w.emirate) LIKE LOWER(${'%' + emirate + '%'})` : Prisma.empty}
          ${district ? Prisma.sql`AND LOWER(w.district) LIKE LOWER(${'%' + district + '%'})` : Prisma.empty}
          ${minRating ? Prisma.sql`AND w.rating >= ${minRating}` : Prisma.empty}
          ${hasClimateControl !== undefined ? Prisma.sql`AND w.has_climate_control = ${hasClimateControl}` : Prisma.empty}
          ${has24x7Access !== undefined ? Prisma.sql`AND w.has_24x7_access = ${has24x7Access}` : Prisma.empty}
          ${hasSecurityCameras !== undefined ? Prisma.sql`AND w.has_security_cameras = ${hasSecurityCameras}` : Prisma.empty}
          ${hasInsurance !== undefined ? Prisma.sql`AND w.has_insurance = ${hasInsurance}` : Prisma.empty}
          ${hasParkingSpace !== undefined ? Prisma.sql`AND w.has_parking_space = ${hasParkingSpace}` : Prisma.empty}
        ORDER BY
          ${sortBy === 'distance' ? Prisma.sql`distance` : Prisma.empty}
          ${sortBy === 'rating' ? Prisma.sql`w.rating ${sortOrder === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`}` : Prisma.empty}
          ${sortBy === 'createdAt' ? Prisma.sql`w.created_at ${sortOrder === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`}` : Prisma.empty}
          ${sortBy === 'name' ? Prisma.sql`w.name ${sortOrder === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`}` : Prisma.empty}
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      const total = await this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM warehouses w
        WHERE
          w.deleted_at IS NULL
          AND w.is_active = true
          AND w.status = ${status}::warehouse_status
          AND ST_DWithin(
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ST_MakePoint(w.longitude, w.latitude)::geography,
            ${radiusMeters}
          )
      `;

      // Get operator info for each warehouse
      const warehousesWithOperator = await Promise.all(
        warehouses.map(async (w) => {
          const operator = await this.prisma.operator.findUnique({
            where: { id: w.operator_id },
            select: { id: true, companyName: true },
          });
          return { ...w, operator, distance: parseFloat(w.distance) };
        }),
      );

      return {
        data: warehousesWithOperator,
        meta: {
          total: Number(total[0].count),
          page,
          limit,
          totalPages: Math.ceil(Number(total[0].count) / limit),
        },
      };
    }

    // Standard query without geospatial filtering
    const orderBy: Prisma.WarehouseOrderByWithRelationInput = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    }

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where,
        include: {
          operator: {
            select: {
              id: true,
              companyName: true,
            },
          },
          media: {
            where: { isPrimary: true },
            select: { fileUrl: true },
            take: 1,
          },
          boxes: {
            where: { isAvailable: true, deletedAt: null },
            select: { priceMonthly: true, size: true },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    // Compute minPrice and availableSizes for each warehouse
    const data = warehouses.map((wh) => {
      const { media, boxes, ...warehouseFields } = wh;
      const prices = boxes.map((b) => Number(b.priceMonthly));
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;
      const availableSizes = [...new Set(boxes.map((b) => b.size))];
      const primaryPhoto = media[0]?.fileUrl ?? null;
      return {
        ...warehouseFields,
        minPrice,
        availableSizes,
        primaryPhoto,
        totalReviews: warehouseFields.reviewCount,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        operator: {
          select: {
            id: true,
            companyName: true,
            businessPhone: true,
            businessEmail: true,
            website: true,
          },
        },
        media: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
        boxes: {
          where: { deletedAt: null },
          select: {
            id: true,
            boxNumber: true,
            name: true,
            size: true,
            priceMonthly: true,
            isAvailable: true,
            availableQuantity: true,
          },
        },
      },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async findByOperator(operatorId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where: {
          operatorId,
          deletedAt: null,
        },
        include: {
          operator: {
            select: {
              id: true,
              companyName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.warehouse.count({
        where: {
          operatorId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: warehouses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Change warehouse status (operator-allowed transitions)
   * Operator: draft↔pending_moderation, active↔inactive
   * Admin: any transition
   */
  async changeStatus(id: number, operatorId: number, newStatus: WarehouseStatus) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse || warehouse.deletedAt) {
      throw new NotFoundException('Warehouse not found');
    }

    if (warehouse.operatorId !== operatorId) {
      throw new ForbiddenException('You can only change status of your own warehouses');
    }

    const currentStatus = warehouse.status;

    // Operator-allowed transitions
    const allowedTransitions: Partial<Record<WarehouseStatus, WarehouseStatus[]>> = {
      draft: ['pending_moderation'],
      pending_moderation: ['draft'],
      active: ['inactive'],
      inactive: ['active'],
    };

    const allowed = allowedTransitions[currentStatus] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition warehouse from "${currentStatus}" to "${newStatus}". Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: newStatus },
    });

    // Emit status_changed event
    this.eventEmitter.emit(
      'warehouse.status_changed',
      { warehouseId: id, oldStatus: currentStatus, newStatus, operatorId },
    );

    return updated;
  }

  private async updateWarehouseCoordinates(warehouseId: number, latitude: number, longitude: number) {
    // Update PostGIS geography column using raw SQL
    // Note: coordinates column will be added via migration
    try {
      await this.prisma.$executeRaw`
        UPDATE warehouses
        SET coordinates = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        WHERE id = ${warehouseId}
      `;
    } catch (error) {
      // Column might not exist yet if migration hasn't run
      // This is acceptable during initial development
    }
  }
}
