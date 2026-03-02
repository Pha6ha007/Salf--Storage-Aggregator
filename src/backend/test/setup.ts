// Global test setup for unit tests
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/storagecompare_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Increase timeout for all tests
jest.setTimeout(10000);

// Mock console to reduce noise during tests
global.console = {
  ...console,
  // Keep error and warn for debugging
  error: jest.fn(),
  warn: jest.fn(),
  // Suppress log, debug, info
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};

// Global test utilities
global.sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
