# Testing Guide

Comprehensive testing documentation for StorageCompare.ae platform.

## 📋 Overview

The project uses different testing frameworks for backend and frontend:

- **Backend**: Jest + Supertest (NestJS standard)
- **Frontend**: Vitest + React Testing Library
- **E2E**: Jest with Supertest
- **Coverage**: Both have configured thresholds (70% for backend, 60% for frontend)

## 🧪 Backend Testing

### Test Structure

```
src/backend/
├── src/
│   └── modules/
│       ├── auth/
│       │   ├── auth.service.ts
│       │   └── auth.service.spec.ts       # Unit tests
│       ├── warehouses/
│       │   ├── warehouses.service.ts
│       │   └── warehouses.service.spec.ts
│       └── bookings/
│           ├── bookings.service.ts
│           └── bookings.service.spec.ts
└── test/
    ├── setup.ts                           # Global setup for unit tests
    ├── setup-e2e.ts                       # Global setup for E2E tests
    ├── jest-e2e.json                      # E2E Jest config
    ├── helpers/
    │   ├── mock-prisma.ts                 # Prisma mocks
    │   ├── mock-services.ts               # External service mocks
    │   └── test-data.ts                   # Test fixtures
    ├── auth.e2e-spec.ts                   # Auth E2E tests
    └── warehouses.e2e-spec.ts             # Warehouses E2E tests
```

### Running Backend Tests

```bash
cd src/backend

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- auth.service.spec.ts

# Debug tests
npm run test:debug
```

### Writing Unit Tests

**Example: Service Unit Test**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockUser, mockRegisterDto } from '../../../test/helpers/test-data';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue(mockUser);

    const result = await service.register(mockRegisterDto);

    expect(result).toHaveProperty('user');
    expect(mockPrismaService.user.create).toHaveBeenCalled();
  });
});
```

### Writing E2E Tests

**Example: API E2E Test**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
      });
  });
});
```

### Test Utilities

**Mock Prisma Service**

```typescript
import { mockPrismaService } from '../../../test/helpers/mock-prisma';

// Use in tests
const module: TestingModule = await Test.createTestingModule({
  providers: [
    YourService,
    { provide: PrismaService, useValue: mockPrismaService },
  ],
}).compile();
```

**Test Data Fixtures**

```typescript
import {
  mockUser,
  mockWarehouse,
  mockBooking,
  createMockUser,
} from '../../../test/helpers/test-data';

// Use fixtures
mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

// Create custom mock
const customUser = createMockUser({ email: 'custom@example.com' });
```

### Coverage Thresholds

Backend coverage thresholds (configured in `jest.config.js`):

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## 🎨 Frontend Testing

### Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── button.test.tsx         # Component tests
│   │   ├── SearchBar.tsx
│   │   └── SearchBar.test.tsx
│   └── test/
│       ├── setup.ts                    # Global test setup
│       └── utils.tsx                   # Test utilities
└── vitest.config.ts                    # Vitest configuration
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- button.test.tsx
```

### Writing Component Tests

**Example: Button Component Test**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**Example: Testing with React Query**

```typescript
import { renderWithProviders, mockWarehouse } from '@/test/utils';
import { WarehouseCard } from './WarehouseCard';

describe('WarehouseCard', () => {
  it('renders warehouse information', () => {
    renderWithProviders(<WarehouseCard warehouse={mockWarehouse} />);

    expect(screen.getByText(mockWarehouse.name)).toBeInTheDocument();
    expect(screen.getByText(mockWarehouse.address)).toBeInTheDocument();
  });
});
```

### Test Utilities

**Custom Render with Providers**

```typescript
import { renderWithProviders } from '@/test/utils';

// Wraps component with QueryClientProvider
const { getByText } = renderWithProviders(<YourComponent />);
```

**Mock Data**

```typescript
import { mockWarehouse, mockUser, mockBooking } from '@/test/utils';

// Use in tests
render(<WarehouseCard warehouse={mockWarehouse} />);
```

### Coverage Thresholds

Frontend coverage thresholds (configured in `vitest.config.ts`):

```typescript
coverage: {
  thresholds: {
    lines: 60,
    functions: 60,
    branches: 60,
    statements: 60,
  },
}
```

## 🎯 Testing Best Practices

### General Guidelines

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state or private methods
   - Test the public API of your modules

2. **Follow AAA Pattern**
   ```typescript
   it('should do something', () => {
     // Arrange: Set up test data and mocks
     const mockData = { ... };
     mockService.someMethod.mockResolvedValue(mockData);

     // Act: Perform the action
     const result = await service.doSomething();

     // Assert: Verify the outcome
     expect(result).toEqual(expected);
   });
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should throw UnauthorizedException when password is invalid')
   it('should return 404 when warehouse not found')

   // Bad
   it('test1')
   it('works correctly')
   ```

4. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Boundary conditions
   - Error scenarios

5. **Keep Tests Independent**
   - Each test should run in isolation
   - Use `beforeEach` to reset state
   - Don't depend on test execution order

### Backend-Specific Best Practices

1. **Mock External Dependencies**
   ```typescript
   // Mock Prisma, Redis, External APIs
   { provide: PrismaService, useValue: mockPrismaService }
   { provide: RedisService, useValue: mockRedisService }
   ```

2. **Test Service Layer Thoroughly**
   - Business logic validation
   - Error handling
   - Event emission
   - Transaction management

3. **E2E Tests Should**
   - Test complete user flows
   - Use real database (test database)
   - Clean up after tests
   - Test authentication/authorization

### Frontend-Specific Best Practices

1. **Query by Accessibility**
   ```typescript
   // Good - accessible
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email address/i)

   // Avoid - implementation details
   container.querySelector('.submit-button')
   ```

2. **Simulate User Interactions**
   ```typescript
   const user = userEvent.setup();
   await user.click(screen.getByRole('button'));
   await user.type(screen.getByRole('textbox'), 'Hello');
   ```

3. **Mock Next.js Features**
   - Router navigation
   - Image components
   - Environment variables

4. **Test Loading States**
   ```typescript
   it('shows loading spinner while fetching', () => {
     render(<Component />);
     expect(screen.getByText(/loading/i)).toBeInTheDocument();
   });
   ```

## 📊 Coverage Reports

### Generating Coverage Reports

**Backend:**
```bash
cd src/backend
npm run test:cov

# Open HTML report
open coverage/lcov-report/index.html
```

**Frontend:**
```bash
cd frontend
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Badges

Add coverage badges to README.md:

```markdown
[![Backend Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](coverage/)
[![Frontend Coverage](https://img.shields.io/badge/coverage-75%25-brightgreen.svg)](coverage/)
```

## 🐛 Debugging Tests

### Backend Tests

```bash
# Run in debug mode
npm run test:debug

# Then attach debugger in VS Code or Chrome DevTools
# Navigate to chrome://inspect
```

**VS Code Debug Configuration:**

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Frontend Tests

```bash
# Run tests with UI for visual debugging
npm run test:ui
```

## 🔄 CI/CD Integration

Tests run automatically in GitHub Actions:

- **Backend CI**: Runs on push/PR to `src/backend/**`
- **Frontend CI**: Runs on push/PR to `frontend/**`

See [CI-CD.md](CI-CD.md) for details.

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Next.js Testing](https://nextjs.org/docs/testing)

## 🆘 Troubleshooting

### Common Issues

**Issue: Tests timeout**
```typescript
// Increase timeout
jest.setTimeout(10000);

// Or in test
it('should do something', async () => {
  // ...
}, 30000); // 30 second timeout
```

**Issue: Module not found**
```bash
# Clear Jest cache
npm test -- --clearCache
```

**Issue: Prisma Client not generated**
```bash
cd src/backend
npx prisma generate
```

**Issue: Port already in use (E2E tests)**
```bash
# Kill process using port
lsof -ti:3001 | xargs kill -9
```

---

**Last Updated**: 2026-03-02
**Version**: 1.0.0
