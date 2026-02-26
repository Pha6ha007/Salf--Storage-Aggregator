# Backend Implementation Plan (MVP v1) — Self-Storage Aggregator

**Version:** 2.0 (Canonical Alignment Update)  
**Date:** December 15, 2025  
**Status:** Implementation Guide (Non-Canonical)  
**Project:** Self-Storage Aggregator MVP

---

# Document Positioning

## ⚠️ CRITICAL: Nature of This Document

**This document is an implementation guide, NOT a source of truth.**

Canonical behavior, requirements, and specifications are **exclusively** defined by:

1. **Functional Specification (MVP v1)** — Product requirements, user flows, business rules
2. **Technical Architecture Document** — System architecture, components, data flows
3. **API Design Blueprint (MVP v1)** — Endpoints, request/response schemas, error codes
4. **Database Specification (MVP v1)** — Tables, columns, relationships, constraints
5. **Security & Compliance Plan (MVP v1)** — Authentication, authorization, data protection
6. **API Rate Limiting & Throttling Specification (MVP v1)** — Rate limits, throttling rules
7. **Error Handling & Fault Tolerance Specification (MVP v1)** — Error codes, retry logic
8. **Logging Strategy & Log Taxonomy (MVP v1)** — Log levels, log formats, log categories
9. **Unified Glossary & Data Dictionary (MVP v1)** — Terminology, naming conventions

**In case of any conflict between this document and canonical documents, the canonical documents take absolute precedence.**

### Purpose of This Document

This guide provides:
- **Recommended** implementation approaches for backend development
- **Suggested** code organization and file structure
- **Example** technology choices and integration patterns
- **Practical** guidance for developers building the system

This guide does NOT:
- Define product requirements (see Functional Specification)
- Specify API contracts (see API Design Blueprint)
- Define data models (see Database Specification)
- Set security policies (see Security & Compliance Plan)

### How to Use This Document

1. **Always start with canonical documents** when implementing features
2. **Use this guide** for practical implementation patterns and code examples
3. **Adapt recommendations** to your team's preferences and constraints
4. **Propose changes** to canonical documents if you identify conflicts or gaps

---

# 1. Backend Code Architecture

## 1.1. Folder Structure

The backend project is recommended to be built on **NestJS 10** with modular architecture. Below is a suggested folder structure:

> **Note:** This structure is a recommendation. Teams may adapt it based on their preferences while maintaining consistency with canonical specifications.

```
backend/
│
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── config/                    # Application configuration
│   │   ├── database.config.ts     # Database settings (Prisma/TypeORM)
│   │   ├── jwt.config.ts          # JWT settings
│   │   ├── redis.config.ts        # Redis settings
│   │   ├── ai.config.ts           # AI service settings
│   │   ├── maps.config.ts         # Maps settings (Yandex/Google)
│   │   └── app.config.ts          # General settings (port, CORS, etc.)
│   │
│   ├── common/                    # Shared components
│   │   ├── decorators/            # Custom decorators
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/                # Guards (AuthGuard, RolesGuard)
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/          # Interceptors (Logging, Transform)
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/               # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   ├── pipes/                 # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   ├── middlewares/           # Middlewares
│   │   │   ├── logger.middleware.ts
│   │   │   └── request-id.middleware.ts
│   │   └── utils/                 # Utilities
│   │       ├── slug.util.ts
│   │       ├── pagination.util.ts
│   │       └── date.util.ts
│   │
│   ├── modules/                   # Business modules
│   │   │
│   │   ├── auth/                  # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── signup.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   │
│   │   ├── users/                 # Users
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── user-response.dto.ts
│   │   │
│   │   ├── operators/             # Operators
│   │   │   ├── operators.module.ts
│   │   │   ├── operators.controller.ts
│   │   │   ├── operators.service.ts
│   │   │   ├── operators.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── operator.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-operator.dto.ts
│   │   │       ├── update-operator.dto.ts
│   │   │       └── operator-response.dto.ts
│   │   │
│   │   ├── warehouses/            # Warehouses
│   │   │   ├── warehouses.module.ts
│   │   │   ├── warehouses.controller.ts
│   │   │   ├── warehouses.service.ts
│   │   │   ├── warehouses.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── warehouse.entity.ts
│   │   │   │   ├── warehouse-attribute.entity.ts
│   │   │   │   └── warehouse-media.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-warehouse.dto.ts
│   │   │       ├── update-warehouse.dto.ts
│   │   │       ├── warehouse-search.dto.ts
│   │   │       └── warehouse-response.dto.ts
│   │   │
│   │   ├── boxes/                 # Boxes
│   │   │   ├── boxes.module.ts
│   │   │   ├── boxes.controller.ts
│   │   │   ├── boxes.service.ts
│   │   │   ├── boxes.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── box.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-box.dto.ts
│   │   │       ├── update-box.dto.ts
│   │   │       └── box-response.dto.ts
│   │   │
│   │   ├── bookings/              # Bookings
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.service.ts
│   │   │   ├── bookings.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── booking.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-booking.dto.ts
│   │   │       ├── update-booking.dto.ts
│   │   │       └── booking-response.dto.ts
│   │   │
│   │   ├── reviews/               # Reviews
│   │   │   ├── reviews.module.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── reviews.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── review.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-review.dto.ts
│   │   │       └── review-response.dto.ts
│   │   │
│   │   ├── favorites/             # Favorites
│   │   │   ├── favorites.module.ts
│   │   │   ├── favorites.controller.ts
│   │   │   ├── favorites.service.ts
│   │   │   └── favorites.repository.ts
│   │   │
│   │   └── files/                 # File uploads
│   │       ├── files.module.ts
│   │       ├── files.controller.ts
│   │       ├── files.service.ts
│   │       └── dto/
│   │           └── file-upload.dto.ts
│   │
│   ├── integrations/              # External service integrations
│   │   │
│   │   ├── ai/                    # AI service (Claude API)
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.client.ts
│   │   │   ├── features/
│   │   │   │   ├── box-finder.service.ts
│   │   │   │   ├── price-analyzer.service.ts
│   │   │   │   ├── description-generator.service.ts
│   │   │   │   └── chat.service.ts
│   │   │   └── dto/
│   │   │       ├── box-finder.dto.ts
│   │   │       └── ai-response.dto.ts
│   │   │
│   │   ├── maps/                  # Maps (Yandex/Google)
│   │   │   ├── maps.module.ts
│   │   │   ├── maps.service.ts
│   │   │   ├── yandex-maps.client.ts
│   │   │   ├── google-maps.client.ts
│   │   │   └── dto/
│   │   │       ├── geocode.dto.ts
│   │   │       └── cluster.dto.ts
│   │   │
│   │   ├── notifications/         # Notifications
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── sms.service.ts
│   │   │   ├── telegram.service.ts
│   │   │   └── dto/
│   │   │       ├── send-email.dto.ts
│   │   │       └── send-sms.dto.ts
│   │   │
│   │   └── storage/               # File storage (S3)
│   │       ├── storage.module.ts
│   │       ├── storage.service.ts
│   │       └── s3.client.ts
│   │
│   ├── database/                  # Database layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # Prisma schema
│   │   │   ├── migrations/        # Migrations
│   │   │   └── seeds/             # Seed data
│   │   └── prisma.service.ts      # Prisma client
│   │
│   ├── jobs/                      # Background tasks (Bull)
│   │   ├── jobs.module.ts
│   │   ├── email-queue.processor.ts
│   │   ├── ai-queue.processor.ts
│   │   └── cleanup.processor.ts
│   │
│   └── health/                    # Health checks
│       ├── health.module.ts
│       └── health.controller.ts
│
├── test/                          # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── prisma/
│   └── schema.prisma
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

### Purpose of Main Directories

| Directory | Purpose |
|---------|-----------|
| **`config/`** | Centralized application configuration (DB, JWT, Redis, API keys). Uses `@nestjs/config` for environment variable loading. |
| **`common/`** | Reusable components: decorators (`@CurrentUser()`), guards (`JwtAuthGuard`, `RolesGuard`), interceptors (logging, response transformation), pipes (validation), middleware (request ID, logging). |
| **`modules/`** | Business modules of the application. Each module contains: controller (HTTP endpoints), service (business logic), repository (database operations), entities (data models), dto (input/output validation). |
| **`integrations/`** | External service integrations: AI (Claude API), maps (Yandex/Google), notifications (email/SMS/Telegram), file storage (S3). Isolated from business logic. |
| **`database/`** | Database layer: Prisma schema, migrations, seed data, PrismaService (wrapper over Prisma Client with logging and error handling). |
| **`jobs/`** | Background tasks (Bull + Redis): email sending, AI request processing, temporary data cleanup, report generation. |
| **`health/`** | Health check endpoints (`/health`, `/health/db`, `/health/redis`) for monitoring and orchestration (Kubernetes readiness/liveness probes). |

---

## 1.2. Design Patterns

> **Reference:** See **Technical Architecture Document — Section "Architectural Patterns"** for canonical architectural decisions.

### Architectural Layers

The backend follows a **layered architecture** with clear separation of concerns:

```
┌──────────────────────────────┐
│  1. Controller Layer         │  ← HTTP routing, request validation, response formatting
│     (Presentation)           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  2. Service Layer            │  ← Business logic, orchestration, transactions
│     (Business Logic)         │
└────────┬──────────────┬──────┘
         │              │
         ▼              ▼
┌────────────────┐  ┌─────────────────┐
│  3. Repository │  │  4. Integration │  ← External services (AI, Maps, etc.)
│     Layer      │  │     Layer       │
│  (Data Access) │  │  (External APIs)│
└────────┬───────┘  └─────────────────┘
         │
         ▼
┌────────────────┐
│  5. Database   │  ← PostgreSQL + PostGIS
└────────────────┘
```

**Layer Responsibilities:**

- **Controller Layer:** Request routing, input validation (DTOs), authentication/authorization guards, response transformation
- **Service Layer:** Business logic implementation, transaction management, service orchestration, error handling
- **Repository Layer:** Database queries, data mapping, query optimization
- **Integration Layer:** External API clients, circuit breakers, retry logic, result caching
- **Database Layer:** Schema definition, migrations, connection pooling

> **Implementation Note:** This layering is a recommended pattern. See **API Design Blueprint** for required endpoints and **Database Specification** for required data structures.

### Repository Pattern

**Recommended implementation:** Abstract database operations behind repository interfaces.

```typescript
// Example repository pattern
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
}

// Implementation with Prisma
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ... other methods
}
```

**Benefits:**
- Easy to test with mocks
- Ability to switch ORM without changing business logic
- Clear separation between data access and business logic

### Service Pattern

**Recommended approach:** Services encapsulate business logic and orchestrate repositories and integrations.

```typescript
// Example service pattern
@Injectable()
export class BookingsService {
  constructor(
    private bookingsRepo: BookingsRepository,
    private boxesRepo: BoxesRepository,
    private notificationsService: NotificationsService,
    private paymentsService: PaymentsService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto): Promise<Booking> {
    // 1. Check box availability
    const box = await this.boxesRepo.findAvailableById(dto.boxId);
    if (!box) throw new NotFoundException('Box not available');

    // 2. Create booking
    const booking = await this.bookingsRepo.create({
      userId,
      boxId: dto.boxId,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    // 3. Send notification
    await this.notificationsService.sendBookingConfirmation(booking);

    return booking;
  }
}
```

### Dependency Injection

**Recommended:** Use NestJS's built-in DI container for all service dependencies.

```typescript
// Module registration
@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingsRepository,
    // Services are automatically injected
  ],
  exports: [BookingsService], // Export if needed in other modules
})
export class BookingsModule {}
```

---

## 1.3. Entity Naming and DTOs

> **⚠️ CRITICAL:** All entity names, field names, and enums **MUST** match exactly with:
> - **Database Specification (MVP v1)** — Table and column names
> - **API Design Blueprint (MVP v1)** — Request/response DTOs
> - **Unified Glossary & Data Dictionary** — Terminology and naming conventions

### Entity Structure Example

```typescript
// src/modules/users/entities/user.entity.ts
export class User {
  id: string;                    // UUID
  email: string;
  password_hash: string;         // Note: field names match DB spec
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;                // Enum from DB spec
  status: UserStatus;            // Enum from DB spec
  created_at: Date;
  updated_at: Date;
}
```

### DTO Example

> **Reference:** All DTOs should implement validation according to **API Design Blueprint — Request Schemas**

```typescript
// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;
}
```

### Response DTO Example

```typescript
// src/modules/users/dto/user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;

  // Exclude sensitive fields like password_hash
  static fromEntity(user: User): UserResponseDto {
    const { password_hash, ...userData } = user;
    return userData;
  }
}
```

---

# 2. Database Integration

> **⚠️ CRITICAL:** Database schema, tables, columns, and relationships are defined in **Database Specification (MVP v1)**. This section provides implementation guidance only.

## 2.1. Prisma Setup (Recommended ORM)

### Why Prisma?

Prisma is a recommended ORM for this project because:
- Type-safe database queries
- Automatic migration generation
- Excellent TypeScript integration
- Built-in connection pooling
- Query performance optimization

> **Note:** Teams may use alternative ORMs (TypeORM, MikroORM) if preferred, but should maintain consistency with the canonical database schema.

### Prisma Schema Example

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ⚠️ Schema below is an example. 
// Refer to Database Specification (MVP v1) for canonical schema.

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String
  phone         String?
  first_name    String?
  last_name     String?
  role          UserRole @default(USER)
  status        UserStatus @default(ACTIVE)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  bookings      Booking[]
  reviews       Review[]
  favorites     Favorite[]

  @@map("users")
}

enum UserRole {
  USER
  OPERATOR
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}
```

> **Reference:** See **Database Specification (MVP v1) — Section "Schema Definition"** for the complete canonical schema.

### PrismaService Wrapper

**Recommended:** Create a wrapper service for Prisma Client with logging and error handling.

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## 2.2. Migration Strategy

> **Reference:** Migration policies are defined in **Database Specification — Section "Migration Strategy"**

### Recommended Migration Workflow

1. **Development:** Create migrations using Prisma CLI
   ```bash
   npx prisma migrate dev --name add_warehouse_attributes
   ```

2. **Staging:** Apply migrations with validation
   ```bash
   npx prisma migrate deploy
   ```

3. **Production:** Use CI/CD pipeline with rollback capability
   ```bash
   # In production deployment script
   npx prisma migrate deploy
   ```

### Migration Best Practices

- **Always test migrations** on a copy of production data before deploying
- **Use transactions** for multi-step schema changes
- **Keep migrations small** and focused on one change
- **Version control** all migration files
- **Document breaking changes** in migration commit messages

---

# 3. Authentication & Authorization

> **⚠️ CRITICAL:** Authentication and authorization requirements are defined in **Security & Compliance Plan (MVP v1)**. This section provides implementation guidance only.

## 3.1. JWT Authentication (Recommended)

### JWT Strategy

**Recommended implementation** based on Security Specification:

```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Payload structure should match Security Plan specifications
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### Token Configuration

> **Reference:** Token expiration times are specified in **Security & Compliance Plan — Section "JWT Configuration"**

**Example configuration (adjust based on Security Plan):**

```typescript
// src/config/jwt.config.ts
export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: '15m',  // Example value - check Security Plan
    refreshTokenExpiry: '7d',  // Example value - check Security Plan
  },
});
```

## 3.2. Role-Based Access Control (RBAC)

> **Reference:** Roles and permissions are defined in **Security & Compliance Plan — Section "Authorization Model"**

### RolesGuard Implementation

```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Usage Example

```typescript
// src/modules/operators/operators.controller.ts
@Controller('operators')
export class OperatorsController {
  @Post()
  @Roles(UserRole.ADMIN) // Only admins can create operators
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() dto: CreateOperatorDto) {
    // Implementation
  }
}
```

---

# 4. External Integrations

> **⚠️ IMPORTANT:** Integration requirements and specifications are defined in **Technical Architecture Document — Section "External Services"**

## 4.1. AI Integration (Claude API)

### Recommended Implementation Pattern

```typescript
// src/integrations/ai/ai.client.ts
import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIClient {
  private client: Anthropic;

  constructor(private configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get('ANTHROPIC_API_KEY'),
    });
  }

  async sendMessage(prompt: string, options?: any): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: options?.maxTokens || 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text;
  }
}
```

### Box Finder Feature Example

```typescript
// src/integrations/ai/features/box-finder.service.ts
import { Injectable } from '@nestjs/common';
import { AIClient } from '../ai.client';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class BoxFinderService {
  constructor(
    private aiClient: AIClient,
    private cacheService: CacheService,
  ) {}

  async findBox(query: string): Promise<BoxFinderResult> {
    // Check cache first (recommended: 24 hour TTL)
    const cacheKey = `box-finder:${query}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Call AI service
    const prompt = this.buildPrompt(query);
    const response = await this.aiClient.sendMessage(prompt);

    // Parse and cache result
    const result = this.parseResponse(response);
    await this.cacheService.set(cacheKey, result, 86400); // 24h TTL (configurable)

    return result;
  }

  private buildPrompt(query: string): string {
    // Build prompt based on AI Integration specification
    return `User is looking for storage with: ${query}. 
            Suggest appropriate box sizes and features.`;
  }

  private parseResponse(response: string): BoxFinderResult {
    // Parse AI response into structured format
    // Implementation details depend on prompt engineering
  }
}
```

### Circuit Breaker Pattern (Recommended)

```typescript
// Example circuit breaker for external services
import { CircuitBreaker } from '@nestjs/common';

@Injectable()
export class ResilientAIService {
  private circuitBreaker = new CircuitBreaker({
    failureThreshold: 5,      // Configurable
    successThreshold: 2,      // Configurable
    timeout: 30000,           // 30 seconds (configurable)
  });

  async callAI(prompt: string): Promise<string> {
    return this.circuitBreaker.execute(() => 
      this.aiClient.sendMessage(prompt)
    );
  }
}
```

## 4.2. Maps Integration (Yandex/Google)

> **Reference:** Maps integration requirements are in **Technical Architecture Document — Section "Maps Service"**

### Recommended Abstraction Layer

```typescript
// src/integrations/maps/maps.service.ts
import { Injectable } from '@nestjs/common';
import { YandexMapsClient } from './yandex-maps.client';
import { GoogleMapsClient } from './google-maps.client';

@Injectable()
export class MapsService {
  constructor(
    private yandexMaps: YandexMapsClient,
    private googleMaps: GoogleMapsClient,
  ) {}

  async geocode(address: string): Promise<Coordinates> {
    try {
      // Primary: Yandex Maps (recommended for Russian market)
      return await this.yandexMaps.geocode(address);
    } catch (error) {
      // Fallback: Google Maps
      console.warn('Yandex Maps failed, falling back to Google Maps');
      return await this.googleMaps.geocode(address);
    }
  }

  async calculateDistance(from: Coordinates, to: Coordinates): Promise<number> {
    // Use PostGIS for distance calculation (recommended)
    // or fallback to external API
  }
}
```

---

# 5. Caching Strategy

> **Reference:** Caching requirements are in **Technical Architecture Document — Section "Caching Layer"**

## 5.1. Redis Setup (Recommended)

### Redis Module Configuration

```typescript
// src/config/redis.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
}));
```

### Cache Service Implementation

```typescript
// src/integrations/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

## 5.2. Caching Patterns

### Cache-Aside Pattern (Recommended)

```typescript
@Injectable()
export class WarehousesService {
  async findById(id: string): Promise<Warehouse> {
    const cacheKey = `warehouse:${id}`;
    
    // Try cache first
    let warehouse = await this.cache.get<Warehouse>(cacheKey);
    
    if (!warehouse) {
      // Cache miss - fetch from DB
      warehouse = await this.warehousesRepo.findById(id);
      
      if (warehouse) {
        // Store in cache (TTL configurable via environment)
        await this.cache.set(cacheKey, warehouse, 3600); // 1 hour example
      }
    }
    
    return warehouse;
  }
}
```

### Cache Invalidation Strategy

```typescript
@Injectable()
export class WarehousesService {
  async update(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
    // Update database
    const warehouse = await this.warehousesRepo.update(id, dto);
    
    // Invalidate related caches
    await this.cache.del(`warehouse:${id}`);
    await this.cache.invalidatePattern(`warehouse-list:*`);
    await this.cache.invalidatePattern(`warehouse-search:*`);
    
    return warehouse;
  }
}
```

### Recommended Cache TTL Values

> **Note:** These are example values. Actual TTL should be configured based on:
> - Data freshness requirements
> - Update frequency
> - Memory constraints

| Data Type | Recommended TTL | Notes |
|-----------|-----------------|-------|
| Warehouse details | 1-4 hours | Configurable via `CACHE_WAREHOUSE_TTL` |
| Box availability | 5-15 minutes | Configurable via `CACHE_BOX_TTL` |
| Search results | 10-30 minutes | Configurable via `CACHE_SEARCH_TTL` |
| AI responses | 24 hours | Configurable via `CACHE_AI_TTL` |
| User sessions | 7 days | Configurable via `SESSION_TTL` |

---

# 6. Error Handling & Observability

> **⚠️ CRITICAL:** Error codes, error handling strategies, and logging requirements are defined in:
> - **Error Handling & Fault Tolerance Specification (MVP v1)**
> - **Logging Strategy & Log Taxonomy (MVP v1)**

## 6.1. Exception Filters

### Global Exception Filter (Recommended)

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    // Log error (following Logging Strategy specification)
    console.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Return error response (following Error Handling specification)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}
```

## 6.2. Logging Strategy

> **Reference:** Logging levels, formats, and categories are defined in **Logging Strategy & Log Taxonomy (MVP v1)**

### Recommended Logging Implementation

```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        // Log format should follow Logging Strategy specification
        console.log({
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode: response.statusCode,
          responseTime: `${delay}ms`,
          userId: request.user?.id,
        });
      }),
    );
  }
}
```

## 6.3. Health Checks

> **Reference:** Health check requirements are in **Technical Architecture Document — Section "Monitoring"**

### Recommended Health Check Implementation

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
```

## 6.4. Retry Logic

### Recommended Retry Implementation

```typescript
// Utility function for retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options = {
    maxAttempts: 3,        // Configurable
    initialDelay: 1000,    // Configurable
    maxDelay: 10000,       // Configurable
    backoffFactor: 2,      // Configurable
  },
): Promise<T> {
  let attempt = 0;
  let delay = options.initialDelay;

  while (attempt < options.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      if (attempt >= options.maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * options.backoffFactor, options.maxDelay);
    }
  }
}

// Usage example
async sendEmail(dto: SendEmailDto): Promise<void> {
  await retryWithBackoff(
    () => this.emailProvider.send(dto),
    { 
      maxAttempts: 3,           // Can be configured via env
      initialDelay: 1000, 
      maxDelay: 5000, 
      backoffFactor: 2 
    }
  );
}
```

---

# 7. Performance & Scalability Guidelines

> **Reference:** Performance requirements are in **Technical Architecture Document — Section "Non-Functional Requirements"**

## 7.1. Response Time Targets

> **Note:** These are example target values. Actual SLA targets should be defined based on business requirements and infrastructure capabilities.

| Metric | Example MVP Target | Example Production Target |
|---------|---------------------|---------------------------|
| **Uptime** | 99.0% (~7.3 hours downtime/month) | 99.5% (~3.6 hours) |
| **P50 Response Time** | < 200ms | < 150ms |
| **P95 Response Time** | < 500ms | < 300ms |
| **P99 Response Time** | < 1s | < 500ms |
| **MTTR** (Mean Time To Recovery) | < 2 hours | < 1 hour |

### Critical Incident Response

**Definition:** API unavailable or > 50% of requests return 5xx errors

**Example reaction times:**
- **MVP:** Within 2 hours
- **Production:** Within 30 minutes

> **Note:** These are examples only. Actual incident response procedures should be defined in operational runbooks.

---

# 8. Implementation Summary

## Recommended Technology Stack

### Core Technologies

| Component | Recommended Choice | Rationale |
|-----------|-------------------|-----------|
| **Framework** | NestJS 10 + TypeScript 5 | Modular architecture, DI, rich ecosystem, production-ready |
| **Database** | PostgreSQL 15 + PostGIS 3.3 | ACID transactions, geospatial queries, full-text search |
| **Cache & Queues** | Redis 7 | High-performance caching, background job processing |
| **ORM** | Prisma | Type-safe queries, excellent TypeScript integration |

### External Services

| Service | Recommended Provider | Purpose |
|---------|---------------------|---------|
| **AI** | Anthropic Claude API (claude-sonnet-4) | Box Finder, Price Analyzer, Description Generator |
| **Maps** | Yandex Maps API (primary) + Google Maps (fallback) | Geocoding, clustering, radius search |
| **Storage** | S3-compatible service | Image and file storage |
| **Email** | SendGrid / AWS SES | Transactional emails |
| **SMS** | Twilio | SMS notifications |

> **Note:** These are recommended choices based on common industry practices. Teams may substitute with alternatives while maintaining API compatibility.

## Architectural Layers Summary

```
┌─────────────────────────────────────────────┐
│          HTTP Request (Client)              │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  CONTROLLER LAYER                           │
│  - Routes, Guards, Validation               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  SERVICE LAYER                              │
│  - Business logic, Orchestration            │
└───────────┬─────────────────┬───────────────┘
            │                 │
    ┌───────▼────────┐  ┌────▼─────────────┐
    │  REPOSITORY    │  │  INTEGRATIONS    │
    │  - DB queries  │  │  - AI, Maps, etc │
    └───────┬────────┘  └────┬─────────────┘
            │                │
    ┌───────▼────────┐  ┌────▼─────────────┐
    │  PostgreSQL    │  │  External APIs   │
    │  + PostGIS     │  │  (Claude, Yandex)│
    └────────────────┘  └──────────────────┘
```

## Strengths of This Approach for MVP

### 1. Rapid Development
- NestJS provides ready-to-use architecture (Guards, Pipes, Interceptors)
- Prisma ORM enables fast development without writing SQL
- TypeScript reduces runtime errors

### 2. Scalability
- Horizontal scaling of backend (stateless design)
- Read replicas for PostgreSQL
- Redis for caching and offloading database
- Easy to add CDN for static assets

### 3. Developer Experience
- Modular structure makes code easy to find
- TypeScript autocomplete and type safety
- Swagger documentation out of the box
- Hot reload in development mode

### 4. Cost-Effective

**Example estimated monthly costs for MVP (1000 MAU):**
- **Hosting:** ~$100-150/month (Railway/Render/Hetzner)
- **AI:** ~$15/month (100 requests/day)
- **Maps API:** ~$20/month (5000 geocoding requests)
- **Notifications:** ~$30/month (SendGrid + Twilio)
- **Total:** ~$200/month for 1000 MAU

> **Disclaimer:** These are example estimates. Actual costs depend on usage patterns, service providers, and configuration choices.

## Limitations and Risks for MVP

### 1. Single PostgreSQL Instance
- **Risk:** Single point of failure
- **Mitigation:** Automatic backups, fast recovery procedures
- **Future:** Primary-Replica setup in V2

### 2. No Horizontal Scaling Out of the Box
- **Risk:** May have issues with load > 100 RPS
- **Mitigation:** Caching reduces load by 60-70%
- **Future:** Load balancer + multiple backend instances in V2

### 3. Synchronous AI Calls
- **Risk:** Slow responses under heavy AI load
- **Mitigation:** Cache AI responses, 30-second timeout
- **Future:** Async processing through queue in V2

### 4. Manual Operator Approval
- **Risk:** Bottleneck as operator count grows
- **Mitigation:** Automatic approval + manual review
- **Future:** Automated verification (INN check, documents) in V2

---

## Scaling Path (Future Phases)

### Phase 1: MVP (0-1K MAU)
```
1 Frontend + 1 Backend (2 instances) + 1 DB + 1 Redis
Example Cost: ~$150/month
```

### Phase 2: Growth (1K-10K MAU)
```
Frontend (auto-scale) + Backend (3-5 instances) + DB (Primary + Replica) + Redis Cluster
Example Cost: ~$500/month
Changes:
- Load balancer for backend
- Read replicas for database
- Redis Cluster (master-slave)
- CDN for static assets
```

### Phase 3: Scale (10K+ MAU)
```
CDN Edge Network + Backend (8+ instances, Kubernetes) + DB Sharding + Redis Cluster + Elasticsearch
Example Cost: ~$2,000/month
Changes:
- Kubernetes orchestration
- Database sharding by city
- Elasticsearch for search
- Microservices (AI Service, Booking Service)
- Message queue (RabbitMQ/Kafka)
```

---

## Next Steps

**Recommended implementation sequence:**

1. Setup development environment (Sprint 0)
2. Implement Sprint 1 (Auth + Core modules)
3. Implement Sprint 2 (Bookings + Reviews)
4. Implement Sprint 3 (AI + Maps + Polish)
5. Deploy to staging environment
6. Load testing and optimization
7. Production launch

**Expected timeline:** MVP ready for launch after **6 weeks** of development with a team of 2-3 backend developers.

> **Note:** This timeline is an estimate based on typical project complexity. Actual timeline may vary based on team experience, requirements changes, and technical challenges.

---

# Document Status & Governance

## Document Classification

**Type:** Implementation Guide (Non-Canonical)  
**Audience:** Backend Engineers  
**Authority Level:** Advisory / Recommended Practices

## Change Management

This document provides implementation recommendations and may be updated flexibly to reflect:
- Team preferences and coding standards
- Technology updates and best practices
- Lessons learned during development
- Performance optimization discoveries

Changes to this document do NOT require updates to canonical specifications unless they identify conflicts or gaps in those specifications.

## Relationship to Canonical Documents

This guide is **subordinate** to all canonical specifications. In case of any conflict:

1. **Stop implementation**
2. **Verify against canonical document** (Architecture, API, Database, Security, etc.)
3. **If conflict confirmed:** Follow canonical document, propose update to this guide
4. **If canonical document is ambiguous:** Request clarification, then update both documents

## Feedback and Improvements

Developers using this guide are encouraged to:
- Report unclear or incorrect recommendations
- Suggest alternative approaches based on experience
- Contribute code examples and patterns
- Identify conflicts with canonical specifications

---

**End of Document**

**Version:** 2.0 (Canonical Alignment Update)  
**Date:** December 15, 2025  
**Status:** Implementation Guide (Non-Canonical)  
**Author:** Technical Documentation Team  
**Reviewers:** Backend Team Lead, Technical Architect

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | December 1, 2025 | Initial draft | Backend Team Lead |
| 2.0 | December 15, 2025 | Canonical alignment update: repositioned as Implementation Guide, removed normative language, added references to canonical docs | Technical Documentation Team |
