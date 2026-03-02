import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  mockBooking,
  mockUser,
  mockBox,
  mockCreateBookingDto,
} from '../../../test/helpers/test-data';
import { BookingStatus, BoxStatus } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    box: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a booking', async () => {
      // Arrange
      const userId = mockUser.id;
      const createDto = mockCreateBookingDto;
      const availableBox = { ...mockBox, status: BoxStatus.available };

      mockPrismaService.box.findUnique.mockResolvedValue(availableBox);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          box: mockPrismaService.box,
          booking: mockPrismaService.booking,
        });
      });
      mockPrismaService.booking.create.mockResolvedValue(mockBooking);
      mockPrismaService.box.update.mockResolvedValue({
        ...availableBox,
        status: BoxStatus.reserved,
      });

      // Act
      const result = await service.create(userId, createDto);

      // Assert
      expect(mockPrismaService.box.findUnique).toHaveBeenCalledWith({
        where: { id: createDto.boxId },
        include: expect.any(Object),
      });
      expect(mockPrismaService.booking.create).toHaveBeenCalled();
      expect(mockPrismaService.box.update).toHaveBeenCalledWith({
        where: { id: createDto.boxId },
        data: { status: BoxStatus.reserved },
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.created',
        expect.any(Object),
      );
      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException if box not found', async () => {
      // Arrange
      mockPrismaService.box.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.create(mockUser.id, mockCreateBookingDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create(mockUser.id, mockCreateBookingDto),
      ).rejects.toThrow('Box not found');
    });

    it('should throw BadRequestException if box is not available', async () => {
      // Arrange
      const occupiedBox = { ...mockBox, status: BoxStatus.occupied };
      mockPrismaService.box.findUnique.mockResolvedValue(occupiedBox);

      // Act & Assert
      await expect(
        service.create(mockUser.id, mockCreateBookingDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(mockUser.id, mockCreateBookingDto),
      ).rejects.toThrow('Box is not available');
    });

    it('should validate booking dates', async () => {
      // Arrange
      const invalidDto = {
        ...mockCreateBookingDto,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-02-01'), // End before start
      };
      const availableBox = { ...mockBox, status: BoxStatus.available };
      mockPrismaService.box.findUnique.mockResolvedValue(availableBox);

      // Act & Assert
      await expect(service.create(mockUser.id, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return user bookings with pagination', async () => {
      // Arrange
      const userId = mockUser.id;
      const bookings = [mockBooking];
      mockPrismaService.booking.findMany.mockResolvedValue(bookings);
      mockPrismaService.booking.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(userId, { page: 1, limit: 10 });

      // Assert
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(bookings);
    });

    it('should filter by booking status', async () => {
      // Arrange
      const userId = mockUser.id;
      const status = BookingStatus.confirmed;
      mockPrismaService.booking.findMany.mockResolvedValue([mockBooking]);
      mockPrismaService.booking.count.mockResolvedValue(1);

      // Act
      await service.findAll(userId, { status });

      // Assert
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            status,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return booking by id', async () => {
      // Arrange
      const bookingId = mockBooking.id;
      const userId = mockUser.id;
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      // Act
      const result = await service.findOne(bookingId, userId);

      // Assert
      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException if booking not found', async () => {
      // Arrange
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findOne('non-existent-id', mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      // Arrange
      const booking = { ...mockBooking, userId: 'other-user-id' };
      mockPrismaService.booking.findUnique.mockResolvedValue(booking);

      // Act & Assert
      await expect(
        service.findOne(mockBooking.id, mockUser.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('confirm', () => {
    it('should confirm pending booking', async () => {
      // Arrange
      const bookingId = mockBooking.id;
      const operatorId = 'op-123';
      const pendingBooking = {
        ...mockBooking,
        status: BookingStatus.pending,
        box: { ...mockBox, warehouse: { operatorId } },
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(pendingBooking);
      mockPrismaService.booking.update.mockResolvedValue({
        ...pendingBooking,
        status: BookingStatus.confirmed,
      });

      // Act
      const result = await service.confirm(bookingId, operatorId);

      // Assert
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { status: BookingStatus.confirmed },
        include: expect.any(Object),
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.confirmed',
        expect.any(Object),
      );
      expect(result.status).toBe(BookingStatus.confirmed);
    });

    it('should throw BadRequestException if booking is not pending', async () => {
      // Arrange
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.confirmed,
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(confirmedBooking);

      // Act & Assert
      await expect(
        service.confirm(mockBooking.id, 'op-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if operator does not own warehouse', async () => {
      // Arrange
      const pendingBooking = {
        ...mockBooking,
        status: BookingStatus.pending,
        box: { ...mockBox, warehouse: { operatorId: 'different-op' } },
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(pendingBooking);

      // Act & Assert
      await expect(
        service.confirm(mockBooking.id, 'wrong-op-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancel', () => {
    it('should cancel non-completed booking', async () => {
      // Arrange
      const bookingId = mockBooking.id;
      const userId = mockUser.id;
      const activeBooking = {
        ...mockBooking,
        userId,
        status: BookingStatus.confirmed,
        box: mockBox,
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(activeBooking);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          booking: mockPrismaService.booking,
          box: mockPrismaService.box,
        });
      });
      mockPrismaService.booking.update.mockResolvedValue({
        ...activeBooking,
        status: BookingStatus.cancelled,
      });
      mockPrismaService.box.update.mockResolvedValue({
        ...mockBox,
        status: BoxStatus.available,
      });

      // Act
      const result = await service.cancel(bookingId, userId);

      // Assert
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { status: BookingStatus.cancelled },
        include: expect.any(Object),
      });
      expect(mockPrismaService.box.update).toHaveBeenCalledWith({
        where: { id: mockBox.id },
        data: { status: BoxStatus.available },
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.cancelled',
        expect.any(Object),
      );
    });

    it('should throw BadRequestException if booking is completed', async () => {
      // Arrange
      const completedBooking = {
        ...mockBooking,
        status: BookingStatus.completed,
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(completedBooking);

      // Act & Assert
      await expect(
        service.cancel(mockBooking.id, mockUser.id),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      // Arrange
      const booking = {
        ...mockBooking,
        userId: 'other-user-id',
        status: BookingStatus.confirmed,
      };
      mockPrismaService.booking.findUnique.mockResolvedValue(booking);

      // Act & Assert
      await expect(
        service.cancel(mockBooking.id, mockUser.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
