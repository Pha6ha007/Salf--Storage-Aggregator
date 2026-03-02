# CLAUDE.md — Self-Storage Aggregator: Development Phase
# Version: 3.1 (Development + AI Readiness)

## PROJECT OVERVIEW

Self-Storage Aggregator platform for UAE market (storagecompare.ae).
Connects users seeking storage with warehouse operators.
MVP v1 — monolithic architecture, single deployment.

---

## TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | Node.js 20 LTS | |
| **Framework** | NestJS 10 | Monolith, modular structure |
| **ORM** | Prisma 5 | Schema-first, migrations |
| **Database** | PostgreSQL 15 + PostGIS | Geospatial queries |
| **Vector DB** | pgvector extension | For future RAG/embeddings |
| **Cache** | Redis 7 | Sessions, rate limiting, geo cache |
| **Auth** | Cookie-based JWT (httpOnly) | NOT Bearer tokens |
| **Validation** | class-validator + class-transformer | DTOs |
| **API Docs** | Swagger/OpenAPI via @nestjs/swagger | Auto-generated |
| **File Storage** | AWS S3 (me-south-1) | Warehouse photos |
| **Email** | SendGrid | Transactional emails |
| **SMS** | Twilio + WhatsApp Business API | Notifications |
| **Maps** | Google Maps API | Geocoding, display |
| **Payments** | Paddle | Merchant of Record, handles VAT |
| **AI** | Anthropic Claude API | Box-finder only in MVP |
| **Events** | @nestjs/event-emitter | Internal event bus for AI data pipeline |
| **Frontend** | Next.js 14 (App Router) | SSR for public, CSR for auth |
| **CSS** | Tailwind CSS 3 | Mobile-first |
| **State** | React Query + Zustand | Server + client state |
| **CI/CD** | GitHub Actions | |
| **Hosting** | AWS me-south-1 (Bahrain) | Low latency for UAE/GCC |
| **CDN** | Cloudflare | |

---

## CANONICAL SPECIFICATION DOCUMENTS

When building any module, ALWAYS reference these docs (priority order):

```
1. docs/core/Functional_Specification_MVP_v1_CORRECTED.md         → Business rules
2. docs/core/Technical_Architecture_Document_MVP_v1_CANONICAL.md   → Architecture
3. docs/core/api_design_blueprint_mvp_v1_CANONICAL.md              → API contracts
4. docs/core/full_database_specification_mvp_v1_CANONICAL.md       → DB schema
5. docs/core/DOC-022_Backend_implementation_plan_mvp_v1_CANONICAL.md → Module structure
6. docs/security/Error_Handling_Fault_Tolerance_Specification.md    → Error patterns
7. docs/security/Logging_Strategy_CANONICAL_Contract_v2.md          → Logging
8. docs/security/API_Rate_Limiting_Throttling_Specification.md      → Rate limits
9. DOC-109_AI_Readiness_Infrastructure_Specification.md             → Event Bus, Activity/Search Logging, RAG
```

If any conflict between docs → higher number wins (Functional Spec > all).

---

## DESIGN SYSTEM

Frontend design reference documents:

```
DESIGN_SYSTEM.md                     → Base design system (colors, typography, components)
DESIGN_SYSTEM_ENHANCEMENTS.md        → Visual enhancements (animations, glassmorphism, shadows, transitions)
```

**Style Guide:** "Neighbor meets Bayut" — clean, trustworthy, mobile-first
- Primary color: Trust Blue (#1A56DB)
- Accent color: UAE Gold (#F59E0B)
- Typography: Inter font family
- Mobile-first responsive design
- Tailwind CSS with custom theme

---

## DATABASE SCHEMA (MVP v1)

### Tables (18 MVP + 2 RAG + 1 Analytics)

```
Users & Auth:
  users                    — All platform users (renters + operators)
  operators                — Operator profiles (extends users)
  operator_settings        — Operator preferences
  refresh_tokens           — JWT refresh tokens

Warehouses & Inventory:
  warehouses               — Storage facilities
  boxes                    — Individual storage units within warehouses
  media                    — Photos/images for warehouses

Bookings & Reviews:
  bookings                 — Storage reservations
  reviews                  — User reviews for warehouses
  favorites                — User favorite warehouses

CRM:
  crm_leads                — Potential customer leads
  crm_contacts             — Contact information
  crm_activities           — CRM activity log
  crm_activity_types       — Activity type definitions
  crm_status_history       — Lead status change history

System:
  ai_requests_log          — AI API call logging
  events_log               — System events audit trail (AI training data)
  geo_cache                — Geocoding results cache

RAG (AI-ready, empty in MVP):
  knowledge_chunks         — Vector embeddings for RAG search
  ai_conversations         — AI chat history

Analytics (AI training data):
  search_logs              — Search queries, clicks, conversions
```

### Key Enums (EXACT — do not change)

```
user_role:         'user' | 'operator' | 'admin'
booking_status:    'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired'
box_status:        'available' | 'reserved' | 'occupied' | 'maintenance'
lead_status:       'new' | 'contacted' | 'in_progress' | 'closed'
warehouse_status:  'draft' | 'pending_moderation' | 'active' | 'inactive' | 'blocked'
```

### RAG Preparation (Future — create tables but leave empty)

```sql
-- Enable pgvector extension (run once)
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base for AI Chat (post-MVP, but schema ready)
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50) NOT NULL,        -- 'warehouse', 'faq', 'policy', 'guide'
  source_id UUID,                          -- Reference to source entity
  content TEXT NOT NULL,                   -- Text chunk
  embedding vector(1536),                  -- OpenAI/Claude embedding
  metadata JSONB DEFAULT '{}',             -- Flexible metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX idx_knowledge_chunks_embedding ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- AI conversation history (for RAG context)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,               -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  model VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
```

---

## BUILD ORDER

### Phase 1: Foundation (Week 1-2)

```
Step 1: Project Setup
  - NestJS project init (nest new)
  - Prisma setup + PostgreSQL connection
  - PostGIS + pgvector extensions
  - Docker Compose (PostgreSQL + Redis + app)
  - Environment config (.env)
  - Base folder structure

Step 2: Prisma Schema
  - All 17 MVP tables from Database Spec
  - RAG tables (knowledge_chunks, ai_conversations)
  - Enums exactly as specified
  - Relations, indexes, constraints
  - Initial migration

Step 3: Auth Module
  - POST /auth/register
  - POST /auth/login
  - POST /auth/logout
  - POST /auth/refresh
  - POST /auth/forgot-password
  - POST /auth/reset-password
  - Cookie-based JWT (httpOnly, secure, sameSite)
  - Guards: JwtAuthGuard, RolesGuard
  - Middleware: cookie-parser
```

### Phase 2: Core CRUD (Week 3-4)

```
Step 4: Users Module
  - GET /users/me
  - PATCH /users/me
  - Password change

Step 5: Warehouses Module
  - GET /warehouses (list + search + geo + filters)
  - GET /warehouses/:id
  - POST /operator/warehouses (create)
  - PATCH /operator/warehouses/:id (update)
  - DELETE /operator/warehouses/:id (soft delete)
  - Geo search with PostGIS (ST_DWithin)
  - Google Maps geocoding integration

Step 6: Boxes Module
  - GET /warehouses/:id/boxes
  - POST /operator/warehouses/:id/boxes
  - PATCH /operator/boxes/:id
  - DELETE /operator/boxes/:id
  - Status management (available ↔ reserved ↔ occupied ↔ maintenance)
```

### Phase 3: Booking Flow (Week 5-6)

```
Step 7: Bookings Module
  - POST /bookings (create → pending)
  - GET /bookings (user's bookings)
  - GET /bookings/:id
  - POST /operator/bookings/:id/confirm (pending → confirmed)
  - POST /operator/bookings/:id/complete (confirmed → completed)
  - POST /bookings/:id/cancel (→ cancelled)
  - Auto-expire cron (pending → expired after 24h)
  - State machine enforcement:
    pending → confirmed → completed
    pending → cancelled
    pending → expired
    confirmed → cancelled

Step 8: Reviews Module
  - POST /warehouses/:id/reviews (after completed booking only)
  - GET /warehouses/:id/reviews
  - One review per booking

Step 9: Favorites Module
  - POST /favorites/:warehouseId
  - DELETE /favorites/:warehouseId
  - GET /favorites
```

### Phase 4: CRM + AI + Event Infrastructure (Week 7-8)

```
Step 10: CRM Module
  - CRUD for leads, contacts, activities
  - Status machine: new → contacted → in_progress → closed
  - Activity logging

Step 11: AI Box Finder
  - POST /ai/box-recommendation
  - Input: items description (text)
  - Output: recommended box size + reasoning
  - Claude API integration
  - Graceful fallback if AI unavailable
  - Request logging to ai_requests_log

Step 12: Event Bus + Activity Logging (DOC-109)
  - Install @nestjs/event-emitter
  - Create event classes (booking, warehouse, box, user, review, crm)
  - Add event emits to ALL existing services:
    * BookingsService → booking.created/confirmed/cancelled/completed/expired
    * WarehousesService → warehouse.created/updated/status_changed
    * BoxesService → box.created/price_changed
    * ReviewsService → review.created
    * CrmService → lead.created/status_changed
    * AuthService → user.registered/login
  - Create ActivityLogService → writes events_log
  - Create ActivityLogListener → listens to all events, logs to DB
  - Add search_logs table to Prisma schema
  - Create SearchLogService → logs search queries + clicks + conversions
  - Add search logging to WarehousesController (search endpoint)
  - Add click tracking endpoint: POST /search-log/:id/click

Step 13: RAG Infrastructure (prepare, don't activate)
  - Embedding service (utility class)
  - Knowledge chunk CRUD (internal, no API)
  - Vector similarity search function
  - RagIndexListener → auto-index on warehouse.created/updated, review.created
  - Batch reindex command (admin)
  - NOT exposed via API in MVP — only infrastructure ready
```

### Phase 5: Supporting (Week 9-10)

```
Step 14: Media/Files Module
  - POST /operator/warehouses/:id/media (upload to S3)
  - DELETE /operator/media/:id
  - Image validation (size, format)
  - S3 presigned URLs

Step 15: Notifications Module
  - Email via SendGrid
  - SMS via Twilio
  - WhatsApp via Twilio Business API
  - Notification templates
  - NotificationListener → listens to Event Bus:
    * booking.created → email to operator
    * booking.confirmed → email + SMS to user
    * booking.cancelled → email to both
    * booking.expired → email to user

Step 16: Health + Admin
  - GET /health
  - Rate limiting (per IP, per user)
  - Request logging middleware
  - Swagger docs generation
```

### Phase 6: Frontend (Week 11-14)

```
Step 17: Next.js Setup
  - Project init (App Router)
  - Tailwind config
  - React Query provider
  - Auth context (cookie-based)
  - Layout (header, footer, nav)
  - Google Maps setup

Step 18: Public Pages
  - / (home + search)
  - /catalog (listing + map + filters)
  - /warehouse/[id] (detail page)
  - /about, /contact, /faq

Step 19: Auth Pages
  - /auth/login
  - /auth/register
  - /auth/forgot-password

Step 20: User Pages
  - /profile
  - /bookings + /bookings/[id]
  - /favorites

Step 21: Operator Pages
  - /operator/dashboard
  - /operator/warehouses + CRUD
  - /operator/bookings
```

---

## CODE STANDARDS

### File Structure (NestJS)

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/          # Custom decorators (@CurrentUser, @Roles)
│   ├── events/              # Domain event classes (booking, warehouse, etc.)
│   ├── filters/             # Exception filters
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   ├── interceptors/        # Logging, Transform
│   ├── listeners/           # Cross-cutting listeners (activity-log)
│   ├── middleware/           # Cookie parser, Rate limit
│   ├── pipes/               # Validation pipe config
│   ├── services/            # Shared services (activity-log, search-log)
│   └── utils/               # Helpers
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── s3.config.ts
│   ├── redis.config.ts
│   └── google-maps.config.ts
├── prisma/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── schema.prisma
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── reset-password.dto.ts
│   ├── users/
│   ├── operators/
│   ├── warehouses/
│   ├── boxes/
│   ├── bookings/
│   ├── reviews/
│   ├── favorites/
│   ├── crm/
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.controller.ts       # Box finder endpoint
│   │   ├── ai.service.ts          # Claude API integration
│   │   ├── embedding.service.ts   # RAG: embedding generation
│   │   ├── knowledge.service.ts   # RAG: chunk management
│   │   ├── listeners/
│   │   │   └── rag-index.listener.ts  # Auto-index on warehouse changes
│   │   └── dto/
│   ├── media/
│   ├── notifications/
│   └── health/
└── shared/
    ├── google-maps/
    │   └── google-maps.service.ts
    ├── redis/
    │   └── redis.service.ts
    └── s3/
        └── s3.service.ts
```

### Per-Module Pattern

Every module follows this exact pattern:

```
module-name/
├── module-name.module.ts        # NestJS module definition
├── module-name.controller.ts    # HTTP endpoints (thin)
├── module-name.service.ts       # Business logic (thick)
├── module-name.repository.ts    # Prisma queries (optional, for complex queries)
└── dto/
    ├── create-module-name.dto.ts
    ├── update-module-name.dto.ts
    └── module-name-response.dto.ts
```

### Naming Conventions

```
Files:           kebab-case (auth.controller.ts)
Classes:         PascalCase (AuthController)
Methods:         camelCase (createBooking)
DB columns:      snake_case (created_at)
API paths:       kebab-case (/box-recommendation)
DTOs:            PascalCase (CreateBookingDto)
Env vars:        UPPER_SNAKE (DATABASE_URL)
```

### Auth Pattern (Cookie-Based)

```typescript
// Login response — sets httpOnly cookie, NOT in response body
res.cookie('auth_token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 min
  path: '/',
});

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth/refresh',
});

// Extracting token in strategy
const token = req.cookies['auth_token'];
```

### Error Response Format (Canonical)

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2026-02-27T10:00:00.000Z",
  "path": "/api/v1/auth/register"
}
```

---

## RAG INFRASTRUCTURE DETAILS

### Why prepare now?

1. pgvector extension is free — just `CREATE EXTENSION vector`
2. Schema is cheap — 2 empty tables
3. Embedding service is ~50 lines — reusable utility
4. When you add AI Chat (v2), infrastructure is ready — just add API endpoint
5. Warehouse data → embeddings pipeline trains AI on YOUR data

### Embedding Pipeline (background, non-blocking)

```typescript
// src/modules/ai/embedding.service.ts
@Injectable()
export class EmbeddingService {
  // Generate embedding for text using Claude/OpenAI
  async generateEmbedding(text: string): Promise<number[]> { ... }
  
  // Store warehouse data as knowledge chunks
  async indexWarehouse(warehouse: Warehouse): Promise<void> {
    const chunks = this.chunkWarehouseData(warehouse);
    for (const chunk of chunks) {
      const embedding = await this.generateEmbedding(chunk.content);
      await this.prisma.knowledgeChunk.create({
        data: {
          sourceType: 'warehouse',
          sourceId: warehouse.id,
          content: chunk.content,
          embedding: embedding,
          metadata: chunk.metadata,
        }
      });
    }
  }
  
  // Similarity search for RAG
  async findSimilar(query: string, limit = 5): Promise<KnowledgeChunk[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    return this.prisma.$queryRaw`
      SELECT *, embedding <=> ${queryEmbedding}::vector AS distance
      FROM knowledge_chunks
      ORDER BY distance
      LIMIT ${limit}
    `;
  }
}
```

### What gets indexed (automatically, on warehouse create/update)

```
- Warehouse name, description, features
- Location (emirate, district, landmarks)
- Box types, sizes, prices
- Operating hours, access rules
- FAQs (when added by operator)
- Review summaries
```

### RAG flow (for future AI Chat, v2)

```
User asks: "I need to store 50 boxes of documents near JLT"
    ↓
1. Generate embedding of user query
2. Search knowledge_chunks for similar content (pgvector)
3. Get top-5 relevant warehouse chunks
4. Build prompt: system + context chunks + user query
5. Send to Claude API
6. Return AI response with warehouse recommendations
    ↓
AI responds with specific warehouse suggestions from YOUR data
```

---

## ENVIRONMENT VARIABLES

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/storagecompare?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Google Maps
GOOGLE_MAPS_API_KEY=your-key

# AWS S3
AWS_REGION=me-south-1
AWS_S3_BUCKET=storagecompare-media
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# SendGrid
SENDGRID_API_KEY=your-key
SENDGRID_FROM=noreply@storagecompare.ae

# Twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+971...
TWILIO_WHATSAPP_NUMBER=whatsapp:+971...

# Paddle
PADDLE_API_KEY=your-key
PADDLE_WEBHOOK_SECRET=your-webhook-secret
PADDLE_ENVIRONMENT=sandbox
PADDLE_SELLER_ID=your-seller-id

# Anthropic (AI)
ANTHROPIC_API_KEY=your-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Domain
APP_URL=https://storagecompare.ae
API_URL=https://api.storagecompare.ae
```

---

## DOCKER COMPOSE (Development)

```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:15-3.4
    environment:
      POSTGRES_DB: storagecompare
      POSTGRES_USER: storage
      POSTGRES_PASSWORD: storage_dev_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init-extensions.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://storage:storage_dev_pass@postgres:5432/storagecompare
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  pgdata:
```

```sql
-- init-extensions.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";
```

---

## RULES FOR AI AGENTS

1. **Read the spec first.** Before writing ANY code, read the relevant section from canonical docs.
2. **Match the spec exactly.** Entity names, field names, enums, endpoints — use EXACTLY what specs say.
3. **Don't invent features.** If it's not in MVP scope, don't build it.
4. **State machines are law.** Booking: pending→confirmed→completed/cancelled/expired. No other transitions.
5. **Auth is cookies, not Bearer.** httpOnly, secure, sameSite. Frontend never sees tokens.
6. **Error format is canonical.** Always return { statusCode, error, message, details, timestamp, path }.
7. **Log everything per spec.** Use structured JSON logging, correlation IDs.
8. **Test after each module.** At minimum: service layer unit tests.
9. **RAG tables exist but are unused in MVP.** Don't expose via API, only prepare infrastructure.
10. **Commit after each module.** Clean git history.
11. **Emit events for every state change.** Every service method that changes data MUST emit an event via EventEmitter2. Emit AFTER the DB transaction succeeds. See DOC-109.
12. **Events are fire-and-forget.** Listener failures MUST NOT break the main flow. Always wrap listeners in try/catch.
13. **Log user actions to events_log.** Every significant action (search, view, book, cancel) must be logged for future AI training.
14. **Search queries go to search_logs.** Every warehouse search must log: query, filters, results, timing. Click tracking via separate endpoint.