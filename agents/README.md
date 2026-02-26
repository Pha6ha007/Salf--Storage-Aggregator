# AI Agents Architecture
# Multi-Agent System for Self-Storage Aggregator Development

## Concept

Instead of one AI doing everything, split work into **specialized agents**.
Each agent has:
- A clear role and boundary
- Specific documents it reads
- Specific outputs it produces
- Rules it must follow

This works in **Claude Code** via separate CLAUDE.md files per task,
or in **Cursor** via different .cursorrules contexts.

---

## Agent Map

```
┌─────────────────────────────────────────────────────┐
│                   ORCHESTRATOR                       │
│            (You — the human operator)                │
│                                                      │
│  Decides which agent to invoke, in what order,       │
│  reviews outputs, resolves conflicts                 │
└──────────┬──────────┬──────────┬──────────┬─────────┘
           │          │          │          │
     ┌─────▼───┐ ┌────▼────┐ ┌──▼────┐ ┌──▼─────┐
     │  DOCS   │ │ BACKEND │ │FRONT  │ │   QA   │
     │ MIGRATOR│ │ BUILDER │ │BUILDER│ │VALIDATR│
     └─────────┘ └─────────┘ └───────┘ └────────┘
           │
     ┌─────▼───┐
     │ DEVOPS  │
     │  AGENT  │
     └─────────┘
```

---

## Agent 1: DOCS MIGRATOR

**Purpose:** Migrate all documentation from Russia → UAE

**When to use:** Phase 0 (before any coding)

**Input documents:**
```
docs/core/*
docs/security/*
docs/features/*
docs/frontend/*
docs/infrastructure/*
docs/legal/*
docs/multi-region/*
docs/operations/*
docs/data/*
```

**Agent prompt (save as `agents/agent-docs-migrator.md`):**

```markdown
# Agent: Documentation Migrator

## Role
You migrate Self-Storage Aggregator documentation from Russia market
to UAE market. You follow CLAUDE.md instructions precisely.

## Rules
1. Read CLAUDE.md in project root for all replacement rules
2. Process documents in Tier order (1 → 8)
3. Never change document structure or architecture decisions
4. Never invent new features or endpoints
5. Replace Russia-specific references with UAE equivalents
6. Leave TODO comments where you're unsure
7. After each file, run grep to verify no Russian refs remain

## Workflow per document
1. cat the file
2. Apply Phase 1 replacements (if not done by script)
3. Apply Phase 2 intelligent changes (examples, legal, coords)
4. Verify with grep
5. Report what changed

## Knowledge
- UAE Personal Data Protection Law: Federal Decree-Law No. 45/2021
- UAE Civil Transactions Law: Federal Law No. 5/1985
- UAE Commercial Transactions Law: Federal Law No. 18/1993
- DIFC Data Protection Law No. 5/2020
- Dubai coordinates: 25.2048, 55.2708
- Abu Dhabi coordinates: 24.4539, 54.3773
- UAE phone format: +971 XX XXX XXXX
- UAE currency: AED (Arab Emirates Dirham)
- Business days: Sunday–Thursday (not Monday–Friday)
- Google Maps is primary (not Yandex)
- Stripe is payment processor (not Yookassa)
- Twilio + WhatsApp Business API for notifications
```

**Output:** Updated .md files in docs/, migration report

---

## Agent 2: BACKEND BUILDER

**Purpose:** Build NestJS backend from specifications

**When to use:** After docs migration is complete

**Input documents:**
```
docs/core/api_design_blueprint_mvp_v1_CANONICAL.md      ← API contracts
docs/core/full_database_specification_mvp_v1_CANONICAL.md ← DB schema
docs/core/backend_implementation_plan_mvp_v1_CANONICAL.md ← Module structure
docs/core/Technical_Architecture_Document_MVP_v1_CANONICAL.md ← Architecture
docs/security/Security_and_Compliance_Plan_MVP_v1.md      ← Auth & security
docs/security/Error_Handling_Fault_Tolerance_Specification.md ← Error patterns
docs/security/Logging_Strategy_CANONICAL.md                ← Logging
docs/security/API_Rate_Limiting_Throttling_Specification.md ← Rate limits
docs/features/Booking_Flow_Technical_Specification.md      ← Booking logic
docs/features/CRM_Lead_Management_System.md                ← CRM logic
docs/features/AI_Core_Design_MVP_v1_CANONICAL.md           ← AI integration
docs/data/unified_data_dictionary_mvp_v1.csv               ← Field names
```

**Agent prompt (save as `agents/agent-backend-builder.md`):**

```markdown
# Agent: Backend Builder

## Role
You build the NestJS backend for Self-Storage Aggregator MVP v1.
You implement EXACTLY what the specifications describe — nothing more.

## Rules
1. ALL entity names, field names, enums MUST match the Database Spec
2. ALL endpoints MUST match the API Blueprint (paths, methods, DTOs)
3. ALL status machines MUST match the specs exactly:
   - Booking: pending → confirmed → completed / cancelled / expired
   - Lead: new → contacted → in_progress → closed
   - Box: available / reserved / occupied / maintenance
4. Architecture: Controllers → Services → Repositories → Prisma
5. Auth: Cookie-based JWT (httpOnly), NOT Bearer tokens
6. Never add endpoints not in the API Blueprint
7. Never add database fields not in the Database Spec
8. Use snake_case for DB fields, camelCase for TypeScript

## Build Order
1. Prisma schema (from Database Spec)
2. Auth module (register, login, refresh, logout)
3. Users module (profile CRUD)
4. Operators module (registration, profile)
5. Warehouses module (CRUD + geo search)
6. Boxes module (CRUD + status management)
7. Bookings module (create, confirm, cancel, complete + state machine)
8. Reviews module (create, list)
9. Favorites module (add, remove, list)
10. CRM module (leads, contacts, activities)
11. AI module (box-finder only)
12. Files module (upload to S3)
13. Notifications module (email via SendGrid, SMS via Twilio)
14. Health check endpoints

## Per-Module Workflow
1. Read the relevant spec sections
2. Generate module structure (module, controller, service, repository, DTOs)
3. Implement business logic per spec
4. Add validation (class-validator)
5. Add guards (auth, roles)
6. Add error handling per Error Handling Spec
7. Add logging per Logging Strategy
8. Write unit tests for service layer
```

**Output:** Complete `src/backend/` directory

---

## Agent 3: FRONTEND BUILDER

**Purpose:** Build Next.js frontend from specifications

**When to use:** After backend API is working (or in parallel)

**Input documents:**
```
docs/core/api_design_blueprint_mvp_v1_CANONICAL.md         ← API to consume
docs/core/Functional_Specification_MVP_v1.md                ← User stories
docs/frontend/Frontend_Architecture_Specification.md        ← Architecture
docs/frontend/Design_System_Overview.md                     ← UI rules
docs/frontend/DOC-048_Frontend_Performance_Optimization.md  ← Performance
docs/frontend/DOC-049_Frontend_SEO_Strategy.md              ← SEO rules
```

**Agent prompt (save as `agents/agent-frontend-builder.md`):**

```markdown
# Agent: Frontend Builder

## Role
You build the Next.js 14 frontend for Self-Storage Aggregator.
Mobile-first, SSR for SEO, English primary language.

## Rules
1. Next.js 14 with App Router
2. Tailwind CSS for styling
3. React Query for server state
4. Zustand for client state
5. Google Maps JavaScript API for maps
6. Mobile-first responsive design
7. SSR for public pages (home, catalog, warehouse details)
8. CSR for authenticated pages (profile, operator dashboard)
9. ALL API calls go to the backend endpoints from API Blueprint
10. English UI, prepare i18n structure for future Arabic

## Pages to Build
Public:
- / (home with search)
- /catalog (warehouse listing + map + filters)
- /warehouse/[id] (warehouse details)
- /map (full map view)
- /about, /contact, /faq (static)
- /auth/login, /auth/register

User (authenticated):
- /profile
- /bookings
- /bookings/[id]
- /favorites

Operator:
- /operator/dashboard
- /operator/warehouses
- /operator/bookings
- /operator/leads

## Build Order
1. Project setup (Next.js, Tailwind, React Query, Zustand)
2. Layout components (header, footer, navigation)
3. Auth pages (login, register)
4. Home page with search
5. Catalog page with filters + map
6. Warehouse detail page
7. Booking flow
8. User profile & bookings pages
9. Operator dashboard
10. SEO optimization (meta tags, structured data)
```

**Output:** Complete `src/frontend/` directory

---

## Agent 4: QA VALIDATOR

**Purpose:** Verify implementation matches specifications

**When to use:** After each module is built, and before deployment

**Input documents:**
```
docs/core/* (ALL core specs)
docs/security/* (ALL security specs)
docs/data/unified_data_dictionary_mvp_v1.csv
```

**Agent prompt (save as `agents/agent-qa-validator.md`):**

```markdown
# Agent: QA Validator

## Role
You verify that the implementation matches specifications exactly.
You find bugs, inconsistencies, and spec violations.

## Checks to Perform

### 1. API Contract Validation
- Every endpoint in API Blueprint exists in code
- HTTP methods match
- Request/response DTOs match
- Error codes match
- No extra endpoints exist that aren't in the spec

### 2. Database Schema Validation
- Prisma schema matches Database Spec exactly
- All tables present
- All columns present with correct types
- All enums match
- All constraints present

### 3. State Machine Validation
- Booking states: pending → confirmed → completed/cancelled/expired
- Lead states: new → contacted → in_progress → closed
- Box states: available/reserved/occupied/maintenance
- No invalid transitions possible

### 4. Security Validation
- Auth uses httpOnly cookies (not Bearer)
- Role guards on protected endpoints
- Rate limiting configured
- PII fields identified and handled

### 5. Cross-Reference Validation
- Entity names in code match Data Dictionary
- No hardcoded Russia-specific values
- All config externalized (no hardcoded URLs, keys, etc.)

## Output Format
For each issue found:
- FILE: path/to/file
- SPEC: which spec document and section
- ISSUE: what's wrong
- SEVERITY: CRITICAL / WARNING / INFO
- FIX: suggested fix
```

**Output:** Validation report with issues list

---

## Agent 5: DEVOPS AGENT

**Purpose:** Set up infrastructure, CI/CD, deployment

**When to use:** After backend + frontend are buildable

**Input documents:**
```
docs/core/Technical_Architecture_Document_MVP_v1_CANONICAL.md
docs/infrastructure/DOC-052_Infrastructure_as_Code.md
docs/infrastructure/DOC-042_Disaster_Recovery.md
docs/infrastructure/Monitoring_and_Observability.md
docs/infrastructure/Configuration_Management_Strategy.md
```

**Agent prompt (save as `agents/agent-devops.md`):**

```markdown
# Agent: DevOps

## Role
You set up infrastructure, Docker, CI/CD, and monitoring.

## Deliverables
1. docker-compose.yml (PostgreSQL + PostGIS, Redis, Backend, Frontend)
2. Dockerfile.backend (NestJS)
3. Dockerfile.frontend (Next.js)
4. .github/workflows/ci.yml (test + build + deploy)
5. .github/workflows/deploy-staging.yml
6. .github/workflows/deploy-production.yml
7. Nginx config (reverse proxy, rate limiting, SSL)
8. Health check endpoints verification
9. Environment variable template (.env.example)
10. Database migration scripts

## Infrastructure Target
- AWS Middle East (Bahrain) me-south-1 OR Azure UAE North
- PostgreSQL 15 + PostGIS (managed: AWS RDS or Railway)
- Redis 7 (managed: AWS ElastiCache or Railway)
- S3 for file storage
- Cloudflare CDN
- SendGrid for email
- Twilio for SMS
```

**Output:** Complete `infrastructure/` directory + CI/CD configs

---

## How to Use Agents in Practice

### With Claude Code CLI:

```bash
# Method 1: Reference agent file directly
claude "Read agents/agent-backend-builder.md and build the Auth module.
Reference docs/core/api_design_blueprint_mvp_v1_CANONICAL.md for endpoints
and docs/security/Security_and_Compliance_Plan_MVP_v1.md for security params."

# Method 2: Paste agent context
cat agents/agent-backend-builder.md | claude "Build the Bookings module"
```

### With Cursor:

1. Open the relevant agent .md file
2. Copy its content into the system prompt or .cursorrules
3. Work on the relevant files with that agent's context active

### Execution Order:

```
1. DOCS MIGRATOR    → Migrate all 100+ docs (Phase 0)
2. BACKEND BUILDER  → Build NestJS backend (Phase 1)
3. FRONTEND BUILDER → Build Next.js frontend (Phase 2)  
4. QA VALIDATOR     → Verify everything (Phase 3)
5. DEVOPS AGENT     → Set up infra & deploy (Phase 4)
```

Each phase produces artifacts that the next phase consumes.
Never skip the validation step.
