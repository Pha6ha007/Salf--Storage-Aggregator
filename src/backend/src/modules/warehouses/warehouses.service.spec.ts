import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleMapsService } from '../../shared/google-maps/google-maps.service';
import {
  mockWarehouse,
  mockOperator,
  mockCreateWarehouseDto,
} from '../../../test/helpers/test-data';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prismaService: PrismaService;
  let googleMapsService: GoogleMapsService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    warehouse: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  const mockGoogleMapsService = {
    geocodeAddress: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockGeocodeResult = {
    latitude: 25.2048,
    longitude: 55.2708,
    formattedAddress: '123 Test Street, Dubai, UAE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: GoogleMapsService, useValue: mockGoogleMapsService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    prismaService = module.get<PrismaService>(PrismaService);
    googleMapsService = module.get<GoogleMapsService>(GoogleMapsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a warehouse', async () => {
      // Arrange
      const operatorId = 1;
      const createDto = mockCreateWarehouseDto;
      mockGoogleMapsService.geocodeAddress.mockResolvedValue(mockGeocodeResult);
      mockPrismaService.warehouse.create.mockResolvedValue(mockWarehouse);
      mockPrismaService.$executeRaw.mockResolvedValue(1);

      // Act
      const result = await service.create(operatorId, createDto);

      // Assert
      expect(mockGoogleMapsService.geocodeAddress).toHaveBeenCalledWith(
        createDto.address,
      );
      expect(mockPrismaService.warehouse.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            operatorId,
            name: createDto.name,
            description: createDto.description,
            address: mockGeocodeResult.formattedAddress,
            latitude: mockGeocodeResult.latitude,
            longitude: mockGeocodeResult.longitude,
            status: 'draft',
          }),
        }),
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'warehouse.created',
        expect.any(Object),
      );
      expect(result).toEqual(mockWarehouse);
    });

    it('should handle geocoding errors gracefully', async () => {
      // Arrange
      const operatorId = 1;
      mockGoogleMapsService.geocodeAddress.mockRejectedValue(
        new Error('Geocoding failed'),
      );

      // Act & Assert
      await expect(
        service.create(operatorId, mockCreateWarehouseDto),
      ).rejects.toThrow('Geocoding failed');
      expect(mockPrismaService.warehouse.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated list of warehouses', async () => {
      // Arrange
      const warehouses = [mockWarehouse];
      const filters = { page: 1, limit: 10 };
      mockPrismaService.warehouse.findMany.mockResolvedValue(warehouses);
      mockPrismaService.warehouse.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(filters);

      // Assert
      expect(mockPrismaService.warehouse.findMany).toHaveBeenCalled();
      expect(mockPrismaService.warehouse.count).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(warehouses);
    });

    it('should filter by emirate', async () => {
      // Arrange
      const filters = { emirate: 'Dubai' };
      mockPrismaService.warehouse.findMany.mockResolvedValue([mockWarehouse]);
      mockPrismaService.warehouse.count.mockResolvedValue(1);

      // Act
      await service.findAll(filters);

      // Assert
      expect(mockPrismaService.warehouse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            emirate: 'Dubai',
          }),
        }),
      );
    });

    it('should filter by status', async () => {
      // Arrange
      const filters = { status: 'active' };
      mockPrismaService.warehouse.findMany.mockResolvedValue([mockWarehouse]);
      mockPrismaService.warehouse.count.mockResolvedValue(1);

      // Act
      await service.findAll(filters);

      // Assert
      expect(mockPrismaService.warehouse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
          }),
        }),
      );
    });

    it('should handle geo search with latitude and longitude', async () => {
      // Arrange
      const filters = {
        latitude: 25.2048,
        longitude: 55.2708,
        radius: 5000,
      };
      mockPrismaService.$queryRaw.mockResolvedValue([mockWarehouse]);
      mockPrismaService.warehouse.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(filters);

      // Assert
      expect(mockPrismaService.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return warehouse by id', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      mockPrismaService.warehouse.findUnique.mockResolvedValue(mockWarehouse);

      // Act
      const result = await service.findOne(warehouseId);

      // Assert
      expect(mockPrismaService.warehouse.findUnique).toHaveBeenCalledWith({
        where: { id: warehouseId },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockWarehouse);
    });

    it('should throw NotFoundException if warehouse not found', async () => {
      // Arrange
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Warehouse not found',
      );
    });
  });

  describe('update', () => {
    it('should successfully update warehouse', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      const operatorId = 1;
      const updateDto = { name: 'Updated Warehouse' };
      const existingWarehouse = { ...mockWarehouse, operatorId };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        existingWarehouse,
      );
      mockPrismaService.warehouse.update.mockResolvedValue({
        ...existingWarehouse,
        ...updateDto,
      });

      // Act
      const result = await service.update(warehouseId, operatorId, updateDto);

      // Assert
      expect(mockPrismaService.warehouse.update).toHaveBeenCalledWith({
        where: { id: warehouseId },
        data: updateDto,
        include: expect.any(Object),
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'warehouse.updated',
        expect.any(Object),
      );
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw NotFoundException if warehouse not found', async () => {
      // Arrange
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent-id', 1, { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      const operatorId = 1;
      const wrongOperatorId = 2;
      const existingWarehouse = { ...mockWarehouse, operatorId };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        existingWarehouse,
      );

      // Act & Assert
      await expect(
        service.update(warehouseId, wrongOperatorId, { name: 'Test' }),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.warehouse.update).not.toHaveBeenCalled();
    });

    it('should update coordinates if address changes', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      const operatorId = 1;
      const updateDto = { address: 'New Address, Dubai' };
      const existingWarehouse = { ...mockWarehouse, operatorId };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        existingWarehouse,
      );
      mockGoogleMapsService.geocodeAddress.mockResolvedValue(mockGeocodeResult);
      mockPrismaService.warehouse.update.mockResolvedValue(existingWarehouse);
      mockPrismaService.$executeRaw.mockResolvedValue(1);

      // Act
      await service.update(warehouseId, operatorId, updateDto);

      // Assert
      expect(mockGoogleMapsService.geocodeAddress).toHaveBeenCalledWith(
        updateDto.address,
      );
      expect(mockPrismaService.$executeRaw).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete warehouse', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      const operatorId = 1;
      const existingWarehouse = { ...mockWarehouse, operatorId };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        existingWarehouse,
      );
      mockPrismaService.warehouse.update.mockResolvedValue({
        ...existingWarehouse,
        deletedAt: new Date(),
      });

      // Act
      const result = await service.remove(warehouseId, operatorId);

      // Assert
      expect(mockPrismaService.warehouse.update).toHaveBeenCalledWith({
        where: { id: warehouseId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toHaveProperty('message', 'Warehouse deleted successfully');
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      // Arrange
      const warehouseId = 'warehouse-123';
      const operatorId = 1;
      const wrongOperatorId = 2;
      const existingWarehouse = { ...mockWarehouse, operatorId };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(
        existingWarehouse,
      );

      // Act & Assert
      await expect(
        service.remove(warehouseId, wrongOperatorId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.warehouse.update).not.toHaveBeenCalled();
    });
  });
});
