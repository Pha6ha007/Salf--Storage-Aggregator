# Backend Implementation Plan (MVP v1) — Self-Storage Aggregator

**Document Version:** 2.1 (CANONICAL)  
**Date:** December 17, 2025  
**Status:** 🟢 GREEN — CANONICAL  
**Project:** Self-Storage Aggregator MVP v1

---

## Document Classification

| Field | Value |
|-------|-------|
| **Type** | Implementation Plan — Canonical Specification |
| **Scope** | Backend implementation guidance for MVP v1 only |
| **Audience** | Backend developers, Tech leads, DevOps |
| **Canonical Status** | 🟢 GREEN — Ready for implementation |

---

## ⚠️ MVP Scope Enforcement (CRITICAL)

**This section is MANDATORY. All developers must read before implementation.**

### ❌ OUT OF MVP v1 — MUST NOT BE IMPLEMENTED

The following features are **explicitly excluded** from MVP v1 and **MUST NOT** be implemented:

| Feature | Status | Notes |
|---------|--------|-------|
| AI Price Analyzer | ❌ OUT OF SCOPE | Post-MVP (v1.2+) |
| AI Description Generator | ❌ OUT OF SCOPE | Post-MVP (v1.2+) |
| AI Chat Assistant | ❌ OUT OF SCOPE | Post-MVP (v2+) |
| Telegram Notifications | ❌ OUT OF SCOPE | Post-MVP (v1.1+) |
| Analytics Endpoints | ❌ OUT OF SCOPE | Post-MVP (v2+) |
| Advanced Operator Analytics | ❌ OUT OF SCOPE | Post-MVP (v2+) |
| Payment Integration | ❌ OUT OF SCOPE | Post-MVP (v1.1+) |
| Dynamic Pricing | ❌ OUT OF SCOPE | Post-MVP (v2+) |
| Discounts & Promo Codes | ❌ OUT OF SCOPE | Post-MVP (v1.2+) |
| Multi-Booking (batch) | ❌ OUT OF SCOPE | Post-MVP (v1.2+) |
| Real-Time Notifications (WebSocket) | ❌ OUT OF SCOPE | Post-MVP (v2+) |
| Warehouse Comparison | ❌ OUT OF SCOPE | Post-MVP (v1.1+) |

### ✅ IN MVP v1 — MUST BE IMPLEMENTED

| Feature | Status | API Reference |
|---------|--------|---------------|
| Authentication (Cookie-based JWT) | ✅ MVP | API Blueprint §2 |
| User Management | ✅ MVP | API Blueprint §5.3 |
| Operator Management | ✅ MVP | API Blueprint §6 |
| Warehouse CRUD & Search | ✅ MVP | API Blueprint §5.1 |
| Box Inventory Management | ✅ MVP | API Blueprint §5.2, §6.2 |
| Booking CRUD & Status Flow | ✅ MVP | API Blueprint §5.4, §6.3 |
| Favorites | ✅ MVP | API Blueprint §5.3.3 |
| Reviews | ✅ MVP | API Blueprint §5.5 |
| CRM Lead Management | ✅ MVP | API Blueprint §7 |
| AI Box Size Recommendation | ✅ MVP (Limited) | API Blueprint §8 |
| Email Notifications | ✅ MVP | Internal module |
| SMS Notifications | ✅ MVP | Internal module |

### AI Scope in MVP v1

**IMPORTANT:** AI functionality in MVP v1 is strictly limited to:

- **AI Box Size Recommendation** — `POST /ai/box-recommendation`
  - Assistive only (non-decision-making)
  - User receives recommendation, makes final choice
  - Graceful fallback if AI unavailable

**NOT in MVP v1 AI scope:**
- Price analysis
- Description generation
- Chat/conversational AI
- Any other AI endpoints

---

## Canonical Dependencies & No-Drift Rule

### Source of Truth Documents

This Backend Implementation Plan **MUST** align with and **MUST NOT** contradict:

| Document | Authority | What It Defines |
|----------|-----------|-----------------|
| **API Design Blueprint (CANONICAL)** | PRIMARY | All API endpoints, contracts, DTOs |
| **Database Specification (CANONICAL)** | PRIMARY | All database tables, schemas, constraints |
| **Functional Specification (CORRECTED)** | HIGH | Product requirements, user flows |
| **Security & Compliance Plan** | HIGH | Security parameters, PII handling |
| **Error Handling Specification (CANONICAL)** | HIGH | Error formats, retry logic |
| **Logging Strategy (CANONICAL)** | MEDIUM | Log structure, retention |
| **Rate Limiting Specification (CANONICAL)** | MEDIUM | Rate limit values, throttling |
| **Monitoring & Observability Plan (CANONICAL)** | MEDIUM | Metrics, health checks |

### No-Drift Rule

**CRITICAL CONSTRAINTS:**

1. **API Contracts** — Backend MUST NOT introduce new endpoints not defined in API Design Blueprint
2. **Database Schema** — Backend MUST NOT create tables/columns not defined in Database Specification
3. **Security Parameters** — Backend MUST defer to Security & Compliance Plan for all security values (TTL, hashing rounds, token lifetimes)
4. **Rate Limits** — Backend MUST defer to Rate Limiting Specification for all limit values
5. **Error Formats** — Backend MUST use canonical error format from Error Handling Specification
6. **Logging** — Backend MUST follow Logging Strategy for log structure and content

**If backend requires a new endpoint or schema change:**
1. First update the relevant canonical document (API Blueprint or DB Spec)
2. Get approval from Tech Lead
3. Then implement in backend

---

## Table of Contents

1. [Backend Code Architecture](#1-backend-code-architecture)
2. [Module Implementation Guide](#2-module-implementation-guide)
3. [Implementation Roadmap](#3-implementation-roadmap)
4. [Technology Stack](#4-technology-stack)
5. [Security Implementation](#5-security-implementation)
6. [Production Readiness](#6-production-readiness)
7. [Architectural Summary](#7-architectural-summary)
8. [Appendix: Post-MVP Notes (Non-Implementable)](#appendix-post-mvp-notes-non-implementable)

---

# 1. Backend Code Architecture

## 1.1. Project Structure

Backend is built on **NestJS 10** with modular architecture.

**Mandatory structure:**

```
backend/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root module
│   │
│   ├── config/                      # Configuration (environment-based)
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── common/                      # Shared components
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── utils/
│   │       ├── slug.util.ts
│   │       ├── pagination.util.ts
│   │       └── masking.util.ts
│   │
│   ├── modules/                     # Business modules (MVP only)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── operators/
│   │   ├── warehouses/
│   │   ├── boxes/
│   │   ├── bookings/
│   │   ├── reviews/
│   │   ├── favorites/
│   │   ├── leads/                   # CRM module
│   │   └── files/
│   │
│   ├── integrations/                # External service integrations
│   │   ├── ai/                      # AI Box Recommendation ONLY
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.service.ts
│   │   │   └── box-recommendation.service.ts
│   │   ├── maps/                    # Geocoding
│   │   │   ├── maps.module.ts
│   │   │   └── maps.service.ts
│   │   ├── notifications/           # Email + SMS only (NO Telegram in MVP)
│   │   │   ├── notifications.module.ts
│   │   │   ├── email.service.ts
│   │   │   └── sms.service.ts
│   │   └── storage/                 # S3 file storage
│   │       ├── storage.module.ts
│   │       └── storage.service.ts
│   │
│   ├── database/
│   │   └── prisma.service.ts
│   │
│   └── health/
│       └── health.controller.ts
│
├── prisma/
│   └── schema.prisma               # Must match Database Specification EXACTLY
│
└── test/
```

**Label:** Structure above is **Mandatory** for MVP v1.

## 1.2. Architecture Layers

**Mandatory pattern: Controller → Service → Repository**

```
┌─────────────────────────────────────────────┐
│          HTTP Request                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  CONTROLLER LAYER                           │
│  - Routes (per API Blueprint)               │
│  - DTO validation (class-validator)         │
│  - Guards (JwtAuthGuard, RolesGuard)        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  SERVICE LAYER                              │
│  - Business logic                           │
│  - Transaction management                   │
│  - Calls to repositories & integrations     │
└────────────────┬────────────────────────────┘
                 │
          ┌──────┴──────┐
          ▼             ▼
┌──────────────┐  ┌─────────────────┐
│ REPOSITORY   │  │ INTEGRATIONS    │
│              │  │                 │
│ - Prisma ORM │  │ - AI (limited)  │
│ - DB queries │  │ - Maps          │
│              │  │ - Notifications │
└──────────────┘  └─────────────────┘
```

## 1.3. Dependency Rules

**Mandatory dependency direction (no cycles):**

- Controllers depend on Services only
- Services depend on Repositories and Integrations
- Repositories depend on PrismaService only
- Integrations are isolated (no cross-integration dependencies)

## 1.4. Pricing Rule (CRITICAL)

**This rule is MANDATORY for all monetary value handling across the backend.**

### Rule Statement

**Monetary values MUST be represented as structured objects.**

**PROHIBITED:**
- Using primitive numeric types (`number`, `float`, `decimal`) for prices in:
  - API request/response DTOs
  - Domain models
  - Service-to-service contracts
  - Database query results exposed to business logic

**EXCEPTION:**
- Primitive numeric types MAY ONLY be used for internal calculation logic within a single service method
- After calculation, values MUST be converted back to structured price objects

### Rationale

This rule ensures:
- **VAT readiness** — Tax calculations require explicit tax behavior
- **Multi-currency support** — Essential for GCC market expansion
- **Deposit handling** — Security deposits are distinct from rental prices
- **Billing period clarity** — Monthly vs. daily vs. hourly pricing
- **Type safety** — Prevents accidental mixing of currencies or billing periods
- **Codegen compatibility** — Clear contract for frontend and API consumers

### Mandatory Price Object Structure

All prices exposed via APIs, stored in domain models, or transferred between services MUST use this structure:

```typescript
PriceDTO {
  amount          // Numeric value (e.g., 5000, stored as integer cents/kopecks)
  currency        // ISO 4217 code (e.g., "RUB", "AED")
  billing_period  // Enum: "monthly" | "daily" | "hourly"
  tax_behavior    // Enum: "inclusive" | "exclusive" | "not_applicable"
  deposit_required // Boolean: whether deposit applies to this price
}
```

**Note:** This is a **contract specification**, not a language-specific implementation.

### Scope of Application

**Rule applies to:**
- Box pricing models (`boxes` table → API responses)
- Booking pricing (`bookings` table → API responses)
- All API endpoints returning pricing information (per API Design Blueprint)
- Internal service method signatures when passing prices between services

**Rule does NOT apply to:**
- Temporary calculation variables inside a single method
- Intermediate subtotals during price computation
- Database storage (pricing columns in `boxes` and `bookings` tables remain as defined in Database Specification)

### Implementation Requirements

1. **DTOs (controllers):** All price fields in request/response DTOs MUST use `PriceDTO` structure
2. **Services:** Service methods accepting or returning prices MUST use structured price objects
3. **Validation:** Price objects MUST be validated for:
   - Valid currency code
   - Valid billing_period enum value
   - Valid tax_behavior enum value
   - Non-negative amount
4. **Documentation:** OpenAPI/Swagger schemas MUST reflect `PriceDTO` structure (per API Design Blueprint)

### Alignment with Canonical Documents

This rule is consistent with:
- **DOC-050 (Database Specification):** Database columns store individual price components (amount, currency, etc.)
- **DOC-030 (API Design Blueprint):** API responses MUST return structured price objects
- **DOC-070 (Pricing & Monetization):** Pricing strategy requires structured price representation
- **DOC-097 (Payment Architecture):** Future payment integration requires currency and tax clarity

**Label:** This pricing rule is **MANDATORY** and **CODEGEN-READY**.

---

# 2. Module Implementation Guide

## 2.1. Auth Module

**Reference:** API Design Blueprint §2 (Authentication)

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (sets httpOnly cookies) |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (clears cookies) |
| POST | `/auth/verify-email` | Verify email token |

### Implementation Notes

**Authentication model:** Cookie-based JWT (per API Blueprint §2.1)

- Tokens stored in httpOnly cookies
- Frontend does NOT handle tokens directly
- Backend sets `Set-Cookie` headers

**Security parameters:** As defined in Security & Compliance Plan §1.3

```typescript
// Example: Defer to Security & Compliance Plan for values
const authConfig = {
  // Values from Security & Compliance Plan - DO NOT hardcode here
  accessTokenTtl: config.get('JWT_ACCESS_TTL'),    // See Security Plan §1.3
  refreshTokenTtl: config.get('JWT_REFRESH_TTL'),  // See Security Plan §1.3
  passwordHashRounds: config.get('BCRYPT_ROUNDS'), // See Security Plan §1.3
};
```

**Label:** Code example above is **Example** (values from config).

---

## 2.2. Users Module

**Reference:** API Design Blueprint §5.3

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile |
| DELETE | `/users/me` | Delete account (soft delete) |

### Implementation Notes

- Soft delete sets `deleted_at` timestamp (per Database Spec)
- PII handling per Security & Compliance Plan §4

---

## 2.3. Operators Module

**Reference:** API Design Blueprint §6.1

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/operators/register` | Register as operator |
| GET | `/operators/me` | Get operator profile |
| PATCH | `/operators/me` | Update operator profile |

### Implementation Notes

- Operator registration creates both `users` and `operators` records
- Role changes from `user` to `operator`
- Operator data scoping per Security & Compliance Plan §2

---

## 2.4. Warehouses Module

**Reference:** API Design Blueprint §5.1 (Public), §6.2 (Operator)

### Endpoints (per API Blueprint)

**Public:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/warehouses` | Search warehouses |
| GET | `/warehouses/:id` | Get warehouse details |

**Operator:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/operator/warehouses` | Create warehouse |
| PATCH | `/operator/warehouses/:id` | Update warehouse |
| DELETE | `/operator/warehouses/:id` | Archive warehouse |

### Implementation Notes

- Geo search uses PostGIS (per Database Spec)
- Caching strategy per Monitoring & Observability Plan

---

## 2.5. Boxes Module

**Reference:** API Design Blueprint §5.2 (Public), §6.2 (Operator)

### Endpoints (per API Blueprint)

**Public:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/warehouses/:id/boxes` | List boxes for warehouse |

**Operator:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/operator/warehouses/:id/boxes` | Create box |
| PATCH | `/operator/boxes/:id` | Update box |
| DELETE | `/operator/boxes/:id` | Deactivate box |

### Box Status Values

Per Database Specification and API Blueprint:

```typescript
enum BoxStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}
```

**Label:** Enum above is **Mandatory** (per Database Spec).

---

## 2.6. Bookings Module

**Reference:** API Design Blueprint §5.4 (User), §6.3 (Operator)

### Endpoints (per API Blueprint)

**User:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/bookings` | Create booking |
| GET | `/bookings` | Get user's bookings |
| GET | `/bookings/:id` | Get booking details |
| PATCH | `/bookings/:id/cancel` | Cancel booking |

**Operator:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/operator/bookings` | Get operator's bookings |
| PATCH | `/operator/bookings/:id/confirm` | Confirm booking |
| PATCH | `/operator/bookings/:id/complete` | Complete booking |

### Booking Status Machine

Per API Design Blueprint §5.4:

```
pending → confirmed → completed
              ↓           
          cancelled
              ↓
          expired (via cron/scheduler)
```

**Canonical states:** `pending`, `confirmed`, `cancelled`, `completed`, `expired`

**Note:** `rejected` status is NOT in MVP (see API Blueprint).

**Label:** Status machine above is **Mandatory** (per API Blueprint).

---

## 2.7. Reviews Module

**Reference:** API Design Blueprint §5.5

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/warehouses/:id/reviews` | Create review |
| GET | `/warehouses/:id/reviews` | Get warehouse reviews |

### Implementation Notes

- User can only review warehouses they have booked
- One review per user per warehouse
- Review updates warehouse rating statistics

---

## 2.8. Favorites Module

**Reference:** API Design Blueprint §5.3.3

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/favorites` | Get user's favorites |
| POST | `/users/favorites/:warehouseId` | Add to favorites |
| DELETE | `/users/favorites/:warehouseId` | Remove from favorites |

---

## 2.9. CRM Leads Module

**Reference:** API Design Blueprint §7, CRM Lead Management System CANONICAL

### Endpoints (per API Blueprint)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/leads` | Create lead (public form) |
| GET | `/operator/leads` | Get operator's leads |
| PATCH | `/operator/leads/:id` | Update lead status |
| POST | `/operator/leads/:id/activities` | Add activity |

**Important:** No endpoint changes lead status to `booked` — this is NOT a valid lead status. Booking creation is a separate flow that does NOT automatically update lead status.

### Lead Status Machine

Per CRM Specification (CANONICAL):

```
new → contacted → in_progress → closed
Any status → is_spam = true
```

**Canonical statuses:** `new`, `contacted`, `in_progress`, `closed`

**NOT valid lead statuses:** `booked`, `rejected` — these are NOT part of the lead status machine.

### Lead Status Semantics

**`closed`** is the final state for all leads, regardless of outcome. The reason for closure is stored in the `closed_reason` field (e.g., "converted", "not_interested", "invalid_contact", "duplicate").

**Relationship with Bookings:**
- Lead MAY have an optional `related_booking_id` field
- This is a **read-only reference** for tracking purposes only
- Booking creation does NOT automatically change lead status
- Lead status and booking status are independent workflows
- Operator manually closes the lead after booking is confirmed (if applicable)

**Spam handling:**
- Any lead can be marked as spam by setting `is_spam = true`
- This is a boolean flag, NOT a status value
- Spam leads are filtered from default queries

**Label:** Status machine above is **Mandatory** (per CRM Spec CANONICAL).

---

## 2.10. AI Integration (MVP-Limited)

**Reference:** API Design Blueprint §8

### ⚠️ MVP SCOPE: AI Box Recommendation ONLY

**In MVP v1:**
- `POST /ai/box-recommendation` — Recommend box size based on items

**NOT in MVP v1:**
- ❌ `POST /ai/price-analysis` — OUT OF SCOPE
- ❌ `POST /ai/description-generator` — OUT OF SCOPE
- ❌ `POST /ai/chat` — OUT OF SCOPE

### Implementation

```typescript
// ai/box-recommendation.service.ts
@Injectable()
export class BoxRecommendationService {
  constructor(
    private readonly aiClient: AIClient,
    private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async recommend(dto: BoxRecommendationRequestDto): Promise<BoxRecommendationResponse> {
    // 1. Check cache
    const cacheKey = this.buildCacheKey(dto);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // 2. Call AI API
      const recommendation = await this.aiClient.getBoxRecommendation(dto);
      
      // 3. Cache result (TTL per config)
      await this.cacheManager.set(cacheKey, recommendation);
      
      return recommendation;
    } catch (error) {
      // 4. Graceful fallback
      this.logger.warn('AI service unavailable, returning fallback', { error: error.message });
      return this.getFallbackRecommendation(dto);
    }
  }

  private getFallbackRecommendation(dto: BoxRecommendationRequestDto): BoxRecommendationResponse {
    // Simple rule-based fallback when AI unavailable
    return {
      recommended_size: this.calculateBasicSize(dto.items),
      confidence: 0.5,
      fallback: true,
      message: 'Recommendation based on basic rules. AI temporarily unavailable.',
    };
  }
}
```

**Label:** Code above is **Example** (implementation approach).

---

## 2.11. Notifications Integration

**Reference:** Internal module (not exposed via API)

### MVP Scope

**In MVP v1:**
- ✅ Email notifications (SendGrid)
- ✅ SMS notifications (Twilio + WhatsApp Business API)

**NOT in MVP v1:**
- ❌ Telegram notifications — OUT OF SCOPE

### Events Triggering Notifications

| Event | Email | SMS |
|-------|-------|-----|
| Booking created | ✅ User + Operator | ✅ User (optional) |
| Booking confirmed | ✅ User | ✅ User |
| Booking cancelled | ✅ User + Operator | - |
| Email verification | ✅ User | - |
| Password reset | ✅ User | - |

**Label:** Notification events above are **Mandatory** for MVP.

---

## 2.12. Maps Integration

**Reference:** Internal module

### MVP Scope

- Geocoding addresses (Google Maps API)
- Reverse geocoding
- Caching geocoding results (24h TTL per config)

---

# 3. Implementation Roadmap

## 3.1. Sprint Structure (6 weeks)

| Sprint | Weeks | Focus | Deliverables |
|--------|-------|-------|--------------|
| Sprint 0 | Prep (2-3 days) | Infrastructure | Project setup, DB, Docker, CI/CD |
| Sprint 1 | 1-2 | Foundation | Auth, Users, Operators, Warehouses |
| Sprint 2 | 3-4 | Core Features | Boxes, Bookings, Reviews, Leads |
| Sprint 3 | 5-6 | Integration & Polish | AI (limited), Maps, Notifications, Testing |

## 3.2. Sprint 0: Infrastructure (2-3 days)

| Task | Hours | Owner |
|------|-------|-------|
| NestJS project initialization | 2 | Lead |
| Prisma + PostgreSQL setup | 3 | Lead |
| Docker + docker-compose | 3 | DevOps |
| Redis setup | 2 | Backend |
| CI/CD pipeline (GitHub Actions) | 4 | DevOps |
| Logging setup (per Logging Strategy) | 2 | Backend |
| Health check endpoint | 1 | Backend |
| **Total** | **~17** | |

## 3.3. Sprint 1: Foundation (Weeks 1-2)

### Week 1: Auth & Users

| Module | Tasks | Hours |
|--------|-------|-------|
| Auth | Cookie-based JWT, signup, login, refresh, logout | 25 |
| Users | Profile CRUD, password change | 15 |
| DB | Core migrations (per DB Spec) | 8 |
| Config | CORS, rate limits (per Rate Limiting Spec), validation | 6 |
| **Week 1 Total** | | **54** |

### Week 2: Operators & Warehouses

| Module | Tasks | Hours |
|--------|-------|-------|
| Operators | Registration, profile management | 18 |
| Warehouses | CRUD, search, filters | 30 |
| Media | File upload to S3 | 12 |
| **Week 2 Total** | | **60** |

## 3.4. Sprint 2: Core Features (Weeks 3-4)

### Week 3: Boxes & Bookings

| Module | Tasks | Hours |
|--------|-------|-------|
| Boxes | CRUD, status management | 24 |
| Bookings | CRUD, status flow, notifications trigger | 32 |
| **Week 3 Total** | | **56** |

### Week 4: Reviews, Favorites, Leads

| Module | Tasks | Hours |
|--------|-------|-------|
| Reviews | Create, list by warehouse | 12 |
| Favorites | Add/remove/list | 8 |
| Leads (CRM) | CRUD, status flow, activities | 24 |
| Notifications | Email + SMS integration | 16 |
| **Week 4 Total** | | **60** |

## 3.5. Sprint 3: Integration & Polish (Weeks 5-6)

### Week 5: AI & Maps

| Module | Tasks | Hours |
|--------|-------|-------|
| AI Box Recommendation | Single endpoint with fallback | 16 |
| Maps | Geocoding integration | 12 |
| Caching | Redis caching strategy | 8 |
| **Week 5 Total** | | **36** |

### Week 6: Testing & Hardening

| Task | Hours |
|------|-------|
| Unit tests (>70% coverage) | 20 |
| Integration tests (critical flows) | 16 |
| E2E tests (booking flow) | 8 |
| Security hardening (per Security Plan) | 8 |
| Performance optimization | 8 |
| Documentation finalization | 6 |
| **Week 6 Total** | **66** |

## 3.6. Summary

| Sprint | Hours | Team Size | Duration |
|--------|-------|-----------|----------|
| Sprint 0 | 17 | 1-2 dev | 2-3 days |
| Sprint 1 | 114 | 2-3 dev | 2 weeks |
| Sprint 2 | 116 | 2-3 dev | 2 weeks |
| Sprint 3 | 102 | 2-3 dev | 2 weeks |
| **Total** | **~350** | 2-3 dev | **6 weeks** |

---

# 4. Technology Stack

## 4.1. Core Stack

| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| Runtime | Node.js | 20 LTS | Long-term support |
| Framework | NestJS | 10.x | Enterprise backend framework |
| Language | TypeScript | 5.x | Strict mode enabled |
| ORM | Prisma | 5.x | Type-safe database access |
| Database | PostgreSQL | 15+ | With PostGIS extension |
| Cache | Redis | 7+ | Caching, rate limiting |
| Validation | class-validator | Latest | DTO validation |

## 4.2. External Services

| Service | Purpose | Provider |
|---------|---------|----------|
| AI | Box recommendation | Anthropic Claude API |
| Maps | Geocoding | Google Maps API |
| Email | Notifications | SendGrid |
| SMS | Notifications | Twilio + WhatsApp Business API |
| Storage | File uploads | S3-compatible (AWS S3) |

---

# 5. Security Implementation

## 5.1. Canonical Reference

**All security parameters are defined in Security & Compliance Plan (CANONICAL).**

This document does NOT duplicate security values. Backend implementation MUST:

1. Read security parameters from configuration (environment variables)
2. Defer to Security & Compliance Plan for:
   - JWT TTL values (access token, refresh token)
   - Password hashing parameters (bcrypt rounds)
   - Rate limiting values (per Role and endpoint)
   - CORS configuration
   - PII handling rules

## 5.2. Implementation Checklist

| Requirement | Reference | Implementation |
|-------------|-----------|----------------|
| Password hashing | Security Plan §1.3 | bcrypt with configured rounds |
| JWT tokens | Security Plan §1.3 | Cookie-based, httpOnly |
| Input validation | Security Plan §3 | class-validator, whitelist mode |
| Rate limiting | Rate Limiting Spec | @nestjs/throttler with Redis |
| CORS | Security Plan §3 | Configured origins per environment |
| SQL injection | Security Plan §3 | Prisma ORM (parameterized queries) |
| XSS prevention | Security Plan §3 | Input sanitization, CSP headers |
| PII masking | Security Plan §4 | MaskingUtils for logs |

## 5.3. RBAC Implementation

Roles per Security & Compliance Plan §2:

```typescript
enum UserRole {
  GUEST = 'guest',     // Unauthenticated
  USER = 'user',       // Authenticated user
  OPERATOR = 'operator', // Warehouse operator
  ADMIN = 'admin',     // System administrator
}
```

**Label:** Enum above is **Mandatory** (per Security Plan).

---

# 6. Production Readiness

## 6.1. Canonical References

Production readiness requirements are defined in:

- **Logging:** Logging Strategy & Log Taxonomy (CANONICAL)
- **Monitoring:** Monitoring & Observability Plan (CANONICAL)
- **Error Handling:** Error Handling & Fault Tolerance Specification (CANONICAL)
- **Security:** Security & Compliance Plan

## 6.2. Required Health Checks

Per Monitoring & Observability Plan:

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /health` | Overall health | `{ status: 'ok' }` |
| `GET /health/db` | Database connectivity | DB status |
| `GET /health/redis` | Redis connectivity | Redis status |

## 6.3. Logging Requirements

Per Logging Strategy (CANONICAL):

- JSON structured logs
- Correlation IDs (trace_id) on all requests
- PII masking using MaskingUtils
- Log levels: error, warn, info, debug

**Label:** This section is **Mandatory** reference to Logging Strategy.

## 6.4. Error Response Format

Per Error Handling Specification (CANONICAL):

```json
{
  "error_code": "VALIDATION_ERROR",
  "http_status": 422,
  "message": "Validation failed",
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  }
}
```

**Label:** Error format above is **Mandatory** (per Error Handling Spec).

## 6.5. Metrics

Per Monitoring & Observability Plan:

- Prometheus-compatible metrics endpoint
- HTTP request metrics (count, duration, status)
- Business metrics (bookings, leads)
- External dependency metrics (AI, Maps availability)

---

# 7. Architectural Summary

## 7.1. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Monolith | Simplicity for MVP, easy to evolve |
| Framework | NestJS | Modular, DI, enterprise-ready |
| Database | PostgreSQL + PostGIS | ACID, geo queries |
| Auth | Cookie-based JWT | Secure, no token handling in frontend |
| AI scope | Box recommendation only | MVP minimal, graceful fallback |
| Notifications | Email + SMS | No Telegram in MVP |

## 7.2. What's NOT in MVP

Per MVP Scope Enforcement (§top):

- No AI Price Analyzer
- No AI Description Generator
- No AI Chat
- No Telegram notifications
- No Analytics endpoints
- No Payment integration
- No Dynamic pricing

## 7.3. Scaling Path (Future)

**Not implemented in MVP v1, but architecture supports:**

- Horizontal scaling (stateless backend)
- Database read replicas
- Microservices extraction (if needed post-MVP)
- Additional notification channels

---

# Appendix: Post-MVP Notes (Non-Implementable)

**⚠️ WARNING: This appendix is for planning purposes ONLY. Do NOT implement any items listed here in MVP v1.**

## A.1. AI Features (v1.2+)

**Planned for post-MVP:**
- AI Price Analyzer — Market price comparison
- AI Description Generator — Automated warehouse descriptions
- AI Chat Assistant — Conversational support

**These features require:**
- Additional API endpoints (must be added to API Blueprint first)
- Additional caching strategy
- Enhanced error handling for AI failures

## A.2. Telegram Notifications (v1.1+)

**Planned for post-MVP:**
- Telegram bot integration
- Operator notification channel
- Bot commands for booking management

## A.3. Analytics (v2+)

**Planned for post-MVP:**
- Operator analytics dashboard
- Revenue reports
- Booking trends
- Occupancy rates

## A.4. Payment Integration (v1.1+)

**Planned for post-MVP:**
- Payment gateway (Stripe)
- Automated billing
- Refund handling

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-01 | Backend Team | Initial draft |
| 2.0 | 2025-12-16 | Backend Team | **CANONICAL version:** MVP scope enforcement, removed out-of-scope features, added canonical dependency rules, removed security/monitoring duplication, isolated future content to appendix |
| 2.1 | 2025-12-17 | Backend Team | **Added §1.4 Pricing Rule (CRITICAL):** Mandatory structured price object requirement, prohibits primitive numeric types for monetary values, ensures VAT/multi-currency/deposit/GCC readiness, codegen-ready specification |

---

## Document Status

**Status:** 🟢 GREEN — CANONICAL

**Alignment verified with:**
- ✅ API Design Blueprint MVP v1 (CANONICAL)
- ✅ Database Specification MVP v1 (CANONICAL)
- ✅ Functional Specification MVP v1 (CORRECTED)
- ✅ Security & Compliance Plan MVP v1
- ✅ Error Handling & Fault Tolerance Specification (CANONICAL)
- ✅ Logging Strategy & Log Taxonomy MVP v1 (CANONICAL)
- ✅ API Rate Limiting & Throttling Specification (CANONICAL)
- ✅ Monitoring & Observability Plan MVP v1 (CANONICAL)
- ✅ CRM Lead Management System MVP v1 (CANONICAL)

**Ready for implementation:** ✅ Yes

---

**END OF DOCUMENT**
