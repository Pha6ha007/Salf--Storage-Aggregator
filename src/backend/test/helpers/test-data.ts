/**
 * Test data fixtures for unit and E2E tests
 */

import { UserRole, BookingStatus, BoxStatus, WarehouseStatus, LeadStatus } from '@prisma/client';

// User fixtures
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  password: '$2b$10$MockedHashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+971501234567',
  role: UserRole.user,
  isEmailVerified: true,
  isPhoneVerified: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockOperatorUser = {
  ...mockUser,
  id: 'operator-123',
  email: 'operator@example.com',
  role: UserRole.operator,
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-123',
  email: 'admin@example.com',
  role: UserRole.admin,
};

// Operator fixtures
export const mockOperator = {
  id: 'op-123',
  userId: 'operator-123',
  businessName: 'Test Storage Co',
  tradeLicenseNumber: 'TRD-12345',
  isVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Warehouse fixtures
export const mockWarehouse = {
  id: 'warehouse-123',
  operatorId: 'op-123',
  name: 'Test Warehouse',
  description: 'A test warehouse for unit tests',
  address: '123 Test Street',
  emirate: 'Dubai',
  district: 'JLT',
  latitude: 25.2048,
  longitude: 55.2708,
  status: WarehouseStatus.active,
  totalBoxes: 100,
  availableBoxes: 50,
  averageRating: 4.5,
  totalReviews: 10,
  features: ['24/7 Access', 'Climate Control', 'CCTV'],
  operatingHours: {
    monday: { open: '08:00', close: '20:00' },
    tuesday: { open: '08:00', close: '20:00' },
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Box fixtures
export const mockBox = {
  id: 'box-123',
  warehouseId: 'warehouse-123',
  name: 'Small Box 1',
  description: 'Perfect for documents and small items',
  size: 'Small',
  width: 1.5,
  height: 1.5,
  depth: 1.5,
  pricePerMonth: 150,
  status: BoxStatus.available,
  features: ['Climate Control', 'Security Lock'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Booking fixtures
export const mockBooking = {
  id: 'booking-123',
  userId: 'user-123',
  boxId: 'box-123',
  warehouseId: 'warehouse-123',
  status: BookingStatus.confirmed,
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-03-01'),
  monthlyPrice: 150,
  totalPrice: 150,
  notes: 'Test booking',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

// Review fixtures
export const mockReview = {
  id: 'review-123',
  userId: 'user-123',
  warehouseId: 'warehouse-123',
  bookingId: 'booking-123',
  rating: 5,
  comment: 'Excellent service!',
  createdAt: new Date('2024-02-15'),
  updatedAt: new Date('2024-02-15'),
};

// CRM Lead fixtures
export const mockLead = {
  id: 'lead-123',
  operatorId: 'op-123',
  name: 'Potential Customer',
  email: 'lead@example.com',
  phone: '+971501234567',
  status: LeadStatus.new,
  source: 'Website',
  notes: 'Interested in medium-sized storage',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Auth DTOs
export const mockRegisterDto = {
  email: 'newuser@example.com',
  password: 'Password123!',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+971507654321',
};

export const mockLoginDto = {
  email: 'test@example.com',
  password: 'Password123!',
};

// Warehouse DTOs
export const mockCreateWarehouseDto = {
  name: 'New Warehouse',
  description: 'A brand new warehouse',
  address: '456 New Street',
  emirate: 'Abu Dhabi',
  district: 'Marina',
  latitude: 24.4539,
  longitude: 54.3773,
  features: ['24/7 Access', 'Parking'],
  operatingHours: {
    monday: { open: '08:00', close: '18:00' },
  },
};

// Box DTOs
export const mockCreateBoxDto = {
  name: 'Medium Box 1',
  description: 'Suitable for furniture',
  size: 'Medium',
  width: 2.5,
  height: 2.5,
  depth: 2.5,
  pricePerMonth: 300,
  features: ['Climate Control'],
};

// Booking DTOs
export const mockCreateBookingDto = {
  boxId: 'box-123',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-04-01'),
  notes: 'I need storage for my furniture',
};

/**
 * Create a mock user with custom properties
 */
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});

/**
 * Create a mock warehouse with custom properties
 */
export const createMockWarehouse = (overrides = {}) => ({
  ...mockWarehouse,
  ...overrides,
});

/**
 * Create a mock booking with custom properties
 */
export const createMockBooking = (overrides = {}) => ({
  ...mockBooking,
  ...overrides,
});
