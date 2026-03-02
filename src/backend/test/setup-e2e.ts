// Global test setup for E2E tests
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-e2e-tests';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/storagecompare_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Increase timeout for E2E tests (they may be slower)
jest.setTimeout(30000);

// Mock external services in E2E tests
process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
process.env.TWILIO_ACCOUNT_SID = 'test-twilio-sid';
process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.AWS_ACCESS_KEY_ID = 'test-aws-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-aws-secret';

// Mock console to reduce noise during E2E tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};
