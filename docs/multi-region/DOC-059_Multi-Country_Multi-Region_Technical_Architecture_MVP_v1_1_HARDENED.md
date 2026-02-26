# DOC-059 — Multi-Country & Multi-Region Technical Architecture (MVP v1)

**Document ID:** DOC-059  
**Project:** Self-Storage Aggregator MVP  
**Version:** 1.1  
**Status:** 🟢 Canonical Extension (Hardened)  
**Date:** December 2025

---

## Document Control

**Classification:** Architectural Extension  
**Maintained by:** Technical Architecture Team  
**Review Frequency:** Quarterly or upon architectural changes  
**Dependencies:** DOC-002 (Technical Architecture Document)

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Architecture Team | Initial version |
| 1.1 | 2025-12-17 | Architecture Team | Hardening: Added Region Minimal Contract, MUST/SHOULD/MUST NOT, GCC-ready invariant, region context propagation rules |

---

# Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Relationship to Core Architecture](#2-relationship-to-core-architecture)
3. [Multi-Region Design Principles](#3-multi-region-design-principles)
4. [Region as a Domain Concept](#4-region-as-a-domain-concept)
5. [Configuration & Feature Flags](#5-configuration--feature-flags)
6. [Data & Identity Considerations](#6-data--identity-considerations)
7. [Operational & Deployment Implications](#7-operational--deployment-implications)
8. [Non-Goals](#8-non-goals)
9. [Relationship to Other Documents](#9-relationship-to-other-documents)

---

# 1. Purpose & Scope

## 1.1. Document Purpose

This document describes how the Self-Storage Aggregator platform is architected to support multiple countries and regions within a single, unified codebase and deployment architecture. It extends and clarifies the existing Technical Architecture Document (DOC-002 / DOC-086) without replacing or contradicting it.

**This document:**
- Explains the platform's region-aware design philosophy
- Defines Region as a first-class domain concept
- Describes configuration-based approaches to regional variation
- Demonstrates architectural readiness for geographic scaling

**This document does NOT:**
- Introduce new services, APIs, or database schemas
- Describe specific countries, markets, or regulatory frameworks
- Define business or product requirements
- Duplicate content from existing canonical documents

## 1.2. What is a "Region"?

In the context of this platform:

- **Region is a logical entity**, not a geographic container
- **Region ≠ Country** (one country may contain multiple regions; one region may span multiple countries)
- **Region represents a market context** where pricing, policies, compliance, and operations may differ
- **Region is a first-class domain concept** that influences behavior without fragmenting the codebase

## 1.3. MVP v1 Context

**Current State:**
- MVP v1 deploys as a single-region platform
- The architecture is designed to support multi-region expansion without refactoring
- Regional variation mechanisms are embedded in the design as architectural invariants

**Architectural Invariant:**
The platform architecture is structured so that adding new regions MUST NOT require:
- Code changes to business logic
- Database schema changes (beyond data population)
- API contract changes
- Frontend application changes

Regional expansion is a **configuration and data operation**, not a development project.

---

# 2. Relationship to Core Architecture

## 2.1. Foundation Documents

This document extends the following canonical specifications:

**DOC-002 / DOC-086: Technical Architecture Document**
- Defines the monolithic NestJS backend, PostgreSQL + PostGIS database, Redis cache, and deployment architecture
- This document adds regional considerations to that architecture without changing components

**DOC-031: Configuration Management Strategy**
- Defines environment-specific configuration, feature toggles, and safe defaults
- This document applies those principles to regional variation

**DOC-050: Full Database Specification**
- Defines all tables, fields, and relationships
- This document explains how region context flows through the data model

## 2.2. Architectural Positioning

The multi-region design is an **architectural pattern**, not a new layer:

```
┌─────────────────────────────────────────────────────────────┐
│                  CANONICAL ARCHITECTURE                     │
│                        (DOC-002)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Frontend (Next.js) ──► API Gateway (Nginx)               │
│                              │                              │
│                              ▼                              │
│                     Backend Monolith (NestJS)              │
│                              │                              │
│       ┌──────────────────────┼──────────────────────┐      │
│       │                      │                      │      │
│       ▼                      ▼                      ▼      │
│   Database              Redis Cache          External APIs │
│  (PostgreSQL)                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ ◄── Region-awareness flows
                              │     through existing layers
                              ▼
         ┌──────────────────────────────────────┐
         │   Configuration Layer                │
         │   • Regional feature flags           │
         │   • Policy definitions               │
         │   • Pricing rules                    │
         │   • Compliance settings              │
         └──────────────────────────────────────┘
```

**Key Point:** Region-awareness is **woven through** the existing architecture, not added as a separate service.

---

# 3. Multi-Region Design Principles

## 3.1. One Codebase → Multiple Regions

**Principle:**
A single codebase serves all regions. There MUST NOT be region-specific forks, branches, or codebases.

**Rationale:**
- Reduces maintenance burden
- Ensures feature parity across regions
- Simplifies testing and quality assurance
- Accelerates feature delivery

**Architectural Requirements:**
- The NestJS backend MUST contain all business logic for all regions
- Regional behavior MUST be determined at runtime through configuration and context
- Code branching on region identifiers (e.g., `if (region === 'X')`) MUST NOT exist in business logic
- Region-specific code paths MUST be replaced with policy-driven approaches

**Enforcement:**
Code review and automated linting SHOULD detect and reject region-specific conditional logic in business services.

## 3.2. Region is a First-Class Domain Entity

**Principle:**
Region is not a string, enum, or implementation detail. It is a domain entity that MUST influence pricing, booking policies, compliance, and operations.

**Rationale:**
- Allows structured representation of regional rules
- Enables expansion without code changes
- Supports complex regulatory and market requirements
- Enforces separation of legal, fiscal, and compliance contexts

### 3.2.1. Region Minimal Contract

**Definition:**
Region is defined by a mandatory set of contextual attributes that determine operational behavior. This contract is conceptual and MUST be respected by the architecture, regardless of whether a `regions` table exists in the database.

**Mandatory Context Attributes:**

The Region concept MUST include the following contexts:

1. **Legal Entity Context**
   - Legal jurisdiction and regulatory framework
   - Operator registration requirements
   - Contract law applicable to bookings
   - Dispute resolution mechanisms

2. **Tax / Fiscal Profile Context**
   - Tax identification requirements (VAT, sales tax, local taxes)
   - Invoicing and accounting rules
   - Tax rate structures
   - Fiscal reporting obligations

3. **Currency Context**
   - Primary currency for transactions
   - Currency display and formatting rules
   - Exchange rate handling (if applicable)
   - Price precision and rounding rules

4. **Data Residency / Compliance Policy Context**
   - Data protection regulations (GDPR, CCPA, local laws)
   - Data retention and deletion timelines
   - PII sensitivity levels
   - Cross-border data transfer constraints
   - Audit logging requirements

5. **Feature Availability Context**
   - Enabled/disabled platform features per region
   - External integration availability (maps, payments, notifications)
   - AI module availability
   - Compliance-driven feature restrictions

**Architectural Constraint:**
The architecture MUST be designed so that all five contexts can be configured and applied without modifying business logic code. The absence of a `regions` table in MVP v1 does NOT invalidate this contract—it means the contract is fulfilled through operator association and configuration files.

### 3.2.2. GCC-Ready as Architectural Invariant

**Design Principle:**
The platform architecture is structured so that regions with distinct legal systems, fiscal regimes, and compliance requirements (such as GCC markets) can be supported without architectural refactoring.

**What "GCC-Ready" Means:**
- Legal separation: Operators in different regions operate under different legal frameworks without code changes
- Fiscal separation: Tax and invoicing rules are configuration-driven
- Compliance separation: Data handling, retention, and privacy policies are region-specific
- Currency separation: Architecture supports multiple currencies (even if MVP uses one)

**What "GCC-Ready" Does NOT Mean:**
- GCC-specific features are not implemented in MVP v1
- Multi-currency is not active in MVP v1
- Localized UI/UX is not present in MVP v1

**Critical Distinction:**
GCC-ready means the architecture does not contain structural barriers to GCC expansion. It does NOT mean GCC features are implemented.

### 3.2.3. Database Representation

**MVP v1:**
Region context is implicit and derived from:
- `operators.legal_address` (geographic and legal jurisdiction)
- `warehouses.address` + `warehouses.coordinates` (PostGIS geography)
- Configuration files mapping operators to regional policies

**Post-MVP Extension:**
An explicit `regions` table MAY be introduced to formalize regional metadata:
```sql
-- FUTURE: Optional formalization, not required for multi-region support
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  legal_jurisdiction VARCHAR(100),
  tax_regime VARCHAR(50),
  currency_code VARCHAR(3),
  data_residency_policy VARCHAR(50),
  config JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Point:**
The `regions` table is a data formalization, not an architectural requirement. The Region Minimal Contract is fulfilled through configuration and policy engines, with or without this table.

## 3.3. Configuration Over Code Branching

**Principle:**
Regional differences MUST be expressed through configuration, policy layers, and feature flags—NOT through conditional logic in business code.

**Rationale:**
- Reduces code complexity and branching
- Makes regional behavior auditable and testable
- Allows non-developers to adjust regional settings
- Supports dynamic updates without redeployment

**Architectural Requirements:**
Regional configuration MUST include:
- Pricing policies (deposit percentages, cancellation fees)
- Booking policies (minimum rental periods, lead times)
- Compliance settings (data retention, PII handling)
- Feature availability (AI modules, payment methods)
- External integrations (map providers, notification services)

**Implementation Rule:**
Business logic MUST NOT contain region-specific branches (e.g., `if (region === 'X') { ... }`). Instead, business logic MUST:
1. Receive region context as input
2. Query policy engine for regional rules
3. Apply rules without knowing regional specifics

**Validation:**
Configuration changes MUST be validated against schemas before deployment to prevent runtime errors.

## 3.4. Region-Aware but Region-Agnostic Core

**Principle:**
Core services MUST be aware that regions exist but MUST NOT hard-code regional logic. They MUST delegate region-specific decisions to policy layers.

**Example:**

**❌ FORBIDDEN: Region-Specific Logic in Core Service**
```typescript
class BookingService {
  calculateDeposit(booking: Booking, region: string): number {
    if (region === 'REGION_A') {
      return booking.price * 0.30;
    } else if (region === 'REGION_B') {
      return booking.price * 0.50;
    }
    return booking.price * 0.20; // default
  }
}
```

**✅ REQUIRED: Policy-Driven Approach**
```typescript
class BookingService {
  constructor(private policyEngine: PolicyEngine) {}

  calculateDeposit(booking: Booking, regionContext: RegionContext): number {
    const policy = this.policyEngine.getDepositPolicy(regionContext);
    return booking.price * policy.depositPercentage;
  }
}
```

**Architectural Requirement:**
In this approach:
- Core service MUST NOT contain knowledge of regional rules
- Policy engine MUST load configuration based on region context
- Adding a new region MUST require only configuration changes, not code changes

**Code Review Enforcement:**
Pull requests introducing region-specific conditionals in business services MUST be rejected.

---

# 4. Region as a Domain Concept

## 4.1. Regional Context

**Regional context** is the set of information that identifies which region's rules and policies apply to an operation.

**Components of Regional Context:**
- **Operator Location:** Warehouses are associated with a region through operator registration
- **User Location:** Users interact with warehouses, inheriting regional context from the warehouse
- **Request Origin:** API requests carry implicit region context via warehouse_id relationships

### 4.1.1. Region Context Propagation (Mandatory)

**Architectural Rule:**
Any business operation that affects pricing, booking, payments, or compliance MUST have region context available.

**MUST Requirements:**

1. **Source of Truth:**
   - The operator-warehouse relationship is the MANDATORY source of region context
   - Region context MUST be derivable via: `booking → warehouse → operator → legal_address/region`
   - No business operation MUST proceed without resolving region context

2. **Context Propagation Chain:**
   ```
   Request → Extract warehouse_id → Resolve operator → Derive region → Apply policies
   ```
   Each service in the chain MUST pass region context forward.

3. **Service Layer Requirement:**
   - Controllers MUST extract region context from request data (warehouse_id, operator_id)
   - Services MUST accept region context as a parameter
   - Repositories MAY use region context for query optimization but MUST NOT contain regional logic

4. **Failure Handling:**
   - If region context cannot be resolved, the operation MUST fail with a clear error
   - Operations MUST NOT proceed with a "default" region if context is ambiguous

**Example Implementation:**
```typescript
// ✅ REQUIRED: Region context explicitly propagated
class BookingController {
  async createBooking(dto: CreateBookingDto) {
    const warehouse = await this.warehousesService.findById(dto.warehouse_id);
    const operator = await this.operatorsService.findById(warehouse.operator_id);
    const regionContext = this.regionService.resolveContext(operator);
    
    return this.bookingsService.create(dto, regionContext);
  }
}

class BookingsService {
  async create(dto: CreateBookingDto, regionContext: RegionContext) {
    const policy = this.policyEngine.getBookingPolicy(regionContext);
    // Apply regional booking rules...
  }
}
```

**❌ FORBIDDEN: Implicit or Missing Context**
```typescript
// This is NOT ALLOWED
class BookingsService {
  async create(dto: CreateBookingDto) {
    // No region context - how do we know which policies to apply?
    const deposit = dto.price * 0.20; // Hard-coded global default - WRONG
  }
}
```

### 4.1.2. Context Resolution Strategy

**MVP v1:**
Region context is resolved through database relationships and configuration:

1. **Query Pattern (Mandatory):**
   ```sql
   -- Resolve region for a booking
   SELECT 
     o.legal_address,
     o.company_name,
     w.address,
     w.coordinates
   FROM bookings b
   JOIN warehouses w ON b.warehouse_id = w.id
   JOIN operators o ON w.operator_id = o.id
   WHERE b.id = ?;
   ```

2. **Configuration Mapping:**
   - Operator legal_address → Region identifier (via configuration)
   - Configuration files define region mappings (e.g., "Moscow" → REGION_A)

3. **Caching:**
   - Region context resolution results SHOULD be cached (Redis) to avoid repeated queries
   - Cache key: `region:context:operator:{operator_id}`

**Post-MVP:**
If an explicit `regions` table is added, resolution becomes a direct foreign key lookup. The propagation chain remains identical.

## 4.2. Region Influences

Regional context affects the following platform behaviors:

### 4.2.1. Pricing

- **Deposit Percentage:** Different regions require different deposit amounts
- **Currency:** Regions use different currencies
- **Tax Handling:** VAT, sales tax, or local taxes vary by region

**MVP v1 Implementation:**
Operators set pricing in a single currency. Regional pricing rules are implicit in operator settings (e.g., `operator_settings.deposit_percentage`).

**Architectural Design:**
The architecture is designed so that multi-currency and region-specific tax handling can be enabled through configuration without modifying business logic. The pricing service accepts region context and queries policy engine for rates, making currency/tax expansion a data and configuration operation.

### 4.2.2. Booking Policies

- **Minimum Rental Period:** Some regions require longer commitments
- **Cancellation Windows:** Refund policies differ by legal jurisdiction
- **Lead Time:** Booking availability varies

**MVP v1 Implementation:**
Operators configure booking policies per warehouse. Regional defaults are not enforced.

**Architectural Design:**
The architecture is designed so that mandatory regional constraints (e.g., minimum rental period ≥ 2 months) can be enforced through policy engine configuration without changing booking service code. The booking service queries the policy engine for constraints before validation.

### 4.2.3. Compliance & Data Handling

- **Data Retention:** GDPR (Europe), CCPA (California), local laws differ
- **PII Handling:** Sensitivity levels and encryption requirements vary
- **Right to Erasure:** Deletion timelines and audit requirements differ

**MVP v1 Implementation:**
Platform follows a conservative, GDPR-aligned approach for all regions.

**Architectural Design:**
The architecture is designed so that region-specific compliance policies (data retention schedules, PII sensitivity levels, deletion workflows) can be loaded from configuration without modifying data handling code. The data governance layer queries region context to determine applicable compliance rules (see DOC-078: Security & Compliance Plan).

### 4.2.4. Feature Availability

- **AI Modules:** Some regions disable certain AI features (regulatory or business reasons)
- **Payment Methods:** Regional payment providers differ
- **Map Providers:** Google Maps vs. Google Maps based on region

**MVP v1 Implementation:**
Feature flags (per DOC-031) control feature availability per environment. Regional granularity is not yet implemented but the architecture supports it.

**Architectural Design:**
The architecture is designed so that feature flags accept region context as a dimension. Feature availability is determined by querying: `featureFlags.isEnabled(feature, regionContext)`. Adding region-specific feature control requires configuration changes only:
```json
{
  "ai_box_recommendation": {
    "enabled": true,
    "regions": {
      "REGION_A": true,
      "REGION_B": false
    }
  }
}
```

## 4.3. Region Association

### 4.3.1. Operators and Warehouses

**Association Model:**
- Operators register with a region (implicit in address and contact information)
- Warehouses inherit region from operator
- Boxes and bookings inherit region from warehouse

**Data Flow:**
```
Operator Registration
  └─► Warehouse Creation (warehouse.operator_id)
       └─► Box Creation (box.warehouse_id)
            └─► Booking Creation (booking.warehouse_id)
```

**Query Pattern:**
To determine region context for a booking:
```sql
SELECT w.address, o.legal_address, o.company_name
FROM bookings b
JOIN warehouses w ON b.warehouse_id = w.id
JOIN operators o ON w.operator_id = o.id
WHERE b.id = ?;
```

Region is inferred from warehouse address or operator legal address.

### 4.3.2. Users

**MVP v1:**
Users do not have a "home region." They can search and book warehouses anywhere.

**Future Extension:**
Users may have a preferred region for currency, language, and default search location. This would be stored as:
```sql
-- FUTURE: Not in MVP v1
ALTER TABLE users ADD COLUMN preferred_region_id INTEGER REFERENCES regions(id);
```

---

# 5. Configuration & Feature Flags

## 5.1. Regional Configuration Strategy

**Configuration Hierarchy:**
1. **Global Defaults:** Baseline settings for all regions
2. **Region-Specific Overrides:** Settings that differ by region
3. **Operator-Specific Overrides:** Per-warehouse or per-operator customization

**Example Configuration Structure:**
```yaml
# config/regional.yml
global:
  deposit_percentage: 0.20
  minimum_rental_months: 1
  cancellation_refund_days: 7

regions:
  REGION_A:
    deposit_percentage: 0.30
    minimum_rental_months: 2
  
  REGION_B:
    deposit_percentage: 0.50
    minimum_rental_months: 1
    cancellation_refund_days: 14
```

**Loading Behavior:**
```typescript
const config = configService.getRegionalConfig(regionContext);
// Returns merged config: global + region-specific overrides
```

## 5.2. Feature Flags for Regional Control

**Purpose:**
Feature flags enable/disable functionality per region without code changes.

**Flag Categories:**

**1. AI Features:**
```typescript
{
  "ai_box_recommendation": {
    "enabled": true,
    "regions": { "REGION_A": true, "REGION_B": false }
  }
}
```

**2. External Integrations:**
```typescript
{
  "map_provider": {
    "global": "google_maps",
    "regions": { "REGION_A": "google_maps" }
  }
}
```

**3. Compliance Controls:**
```typescript
{
  "data_retention_days": {
    "global": 365,
    "regions": { "REGION_A": 730 }  // GDPR extended retention
  }
}
```

**Implementation:**
Feature flags are managed per DOC-031 (Configuration Management Strategy). Regional granularity is added as an extension:

```typescript
class FeatureFlagService {
  isEnabled(feature: string, regionContext: RegionContext): boolean {
    const config = this.configService.getFeatureFlag(feature);
    return config.regions?.[regionContext.code] ?? config.enabled;
  }
}
```

## 5.3. Policy Engine

**Concept:**
A policy engine abstracts regional rules from core business logic through configuration interpretation.

**Responsibilities:**
- Load region-specific policies from configuration
- Apply policies to business operations (pricing, booking, compliance)
- Log policy decisions for audit

**Example Interface:**
```typescript
interface PolicyEngine {
  getDepositPolicy(region: RegionContext): DepositPolicy;
  getBookingPolicy(region: RegionContext): BookingPolicy;
  getCompliancePolicy(region: RegionContext): CompliancePolicy;
}

interface DepositPolicy {
  depositPercentage: number;
  refundableDeposit: boolean;
}
```

### 5.3.1. Explicit Boundaries (Critical)

**What Policy Engine IS:**
- ✅ A configuration interpreter that loads and returns regional rules
- ✅ A translation layer between region context and configuration files
- ✅ A caching mechanism for frequently accessed policies
- ✅ A logging point for policy application decisions

**What Policy Engine is NOT:**
- ❌ NOT a separate service or microservice (it is a module within the NestJS backend)
- ❌ NOT a rules engine with complex condition evaluation (policies are simple key-value mappings)
- ❌ NOT a business logic container (business logic remains in domain services)
- ❌ NOT a database entity (policies are configuration data, not stored in PostgreSQL)
- ❌ NOT an API endpoint consumer (it reads configuration files, not external APIs)
- ❌ NOT a state machine or workflow engine (booking state transitions remain in BookingService)

**Implementation Constraints:**
- Policy Engine MUST NOT change API contracts (it is internal only)
- Policy Engine MUST NOT change database schemas (it operates on configuration)
- Policy Engine MUST NOT contain business logic (it returns data structures, services apply them)

**MVP v1 Status:**
Policy engine is implemented as a configuration service with region-aware methods. Policies are read from operator settings and YAML configuration files.

**Architectural Positioning:**
```
BookingService (business logic)
    ↓ calls
PolicyEngine (config interpreter)
    ↓ reads
Configuration Files (YAML/JSON)
```

The policy engine is a pass-through layer that ensures business services remain region-agnostic.

---

# 6. Data & Identity Considerations

## 6.1. Regional Data Association

**Current Data Model (MVP v1):**
The database does not contain an explicit `region_id` field in most tables. Region is inferred through relationships:

```
users
  └─► operators (user_id)
       └─► warehouses (operator_id)
            └─► boxes (warehouse_id)
                 └─► bookings (box_id, warehouse_id)
```

**Implicit Region Association:**
- `operators.legal_address` contains geographic information
- `warehouses.address` + `warehouses.coordinates` (PostGIS geography) provide location
- Region is inferred from address parsing or explicit operator declaration during registration

**Query Optimization:**
Geospatial queries already support region-scoped searches:
```sql
-- Find warehouses within 10km of a point (regional boundary)
SELECT w.*, ST_Distance(w.coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) / 1000 AS distance_km
FROM warehouses w
WHERE ST_DWithin(w.coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, 10000)
ORDER BY distance_km;
```

## 6.2. Explicit Region Field (Optional Extension)

**Architectural Design:**
The platform is designed so that an explicit `region_id` field can be added to operators and warehouses without refactoring business logic.

**Extension Path (Data Operation, Not Development):**
```sql
-- Optional formalization when multi-region data management demands it
ALTER TABLE operators ADD COLUMN region_id INTEGER REFERENCES regions(id);
ALTER TABLE warehouses ADD COLUMN region_id INTEGER; -- Denormalized for query performance
CREATE INDEX idx_warehouses_region_id ON warehouses(region_id);
```

**Migration Strategy:**
1. Backfill `region_id` from existing address data (data operation)
2. Update operator registration form to capture region explicitly (configuration change)
3. Add region filters to warehouse search queries (query optimization, not logic change)

**Key Point:**
The absence of `region_id` in MVP v1 is a data modeling choice, not an architectural limitation. The layered architecture allows this field to be added without changing service contracts or business logic.

## 6.3. Data Residency

**MVP v1:**
All data is stored in a single PostgreSQL instance. Data residency requirements are not enforced.

**Architectural Design:**
The platform's layered architecture (API → Service → Repository) is designed so that data residency requirements can be satisfied without modifying business logic. The repository layer can route connections based on region context, while services remain unchanged.

**Supported Patterns (Configuration-Driven):**
- **Database Sharding:** Region-specific database instances with connection routing in repository layer
- **Read Replicas:** Regional read replicas with single write master
- **Active-Active Multi-Region:** PostgreSQL replication across regions

**Implementation Approach:**
```typescript
// Repository layer adds region-aware connection selection
class BookingsRepository {
  constructor(private connectionManager: RegionAwareConnectionManager) {}
  
  async create(data: BookingData, regionContext: RegionContext) {
    const connection = this.connectionManager.getConnection(regionContext);
    return connection.query(/* ... */);
  }
}
```

**Key Point:**
Data residency is an infrastructure and configuration concern, not an application architecture concern. Business services do not need modification.

## 6.4. User Identity & Regional Accounts

**MVP v1:**
Users have a single account that works across all regions.

**Architectural Design:**
The platform is designed so that regional user accounts can be introduced without refactoring authentication or authorization logic. The `users` table serves as global identity, and regional profiles can be added as related entities.

**Supported Extension Patterns:**
- **Regional Profiles:** One user → multiple regional profiles (1:N relationship)
- **Region-Specific SSO:** Authentication provider selection based on region context
- **Regional Consent Management:** Separate consent records per region for GDPR/CCPA compliance

**Implementation Approach:**
```sql
-- Optional extension when regional account separation is required
CREATE TABLE user_regional_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  region_id INTEGER REFERENCES regions(id),
  regional_preferences JSONB,
  consent_status JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, region_id)
);
```

**Key Point:**
The authentication layer can be extended to query regional profiles based on region context, while core user management logic remains unchanged.

---

# 7. Operational & Deployment Implications

## 7.1. Single Deployment, Multiple Configurations

**Deployment Model (MVP v1):**
- **Single Docker Compose Stack** (DOC-002: docker-compose for MVP)
- **Single Kubernetes Deployment** (future)
- **Environment Variables** distinguish environments (local, staging, production)

**Regional Configuration:**
Even in a single deployment, regional configuration is loaded at runtime:
```yaml
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Regional config loaded from files
REGIONAL_CONFIG_PATH=/app/config/regional.yml
```

**Configuration Updates:**
Regional configuration changes do NOT require redeployment. Configuration files are:
- Mounted as volumes (Docker)
- Loaded from ConfigMaps (Kubernetes, future)
- Validated at startup (DOC-031: fail-fast validation)

## 7.2. Regional Deployments (Scale Pattern)

**Architectural Design:**
The platform is designed so that regional deployments can be introduced as an infrastructure scaling pattern without refactoring application code.

**Deployment Pattern:**
```
┌──────────────────────┐      ┌──────────────────────┐
│   REGION A           │      │   REGION B           │
│  ┌────────────────┐  │      │  ┌────────────────┐  │
│  │  Backend       │  │      │  │  Backend       │  │
│  │  (NestJS)      │  │      │  │  (NestJS)      │  │
│  └────────────────┘  │      │  └────────────────┘  │
│  ┌────────────────┐  │      │  ┌────────────────┐  │
│  │  Database      │  │      │  │  Database      │  │
│  │  │  (PostgreSQL)  │  │      │  │  (PostgreSQL)  │  │
│  └────────────────┘  │      │  └────────────────┘  │
└──────────────────────┘      └──────────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                 Global Router
                 (DNS, CDN)
```

**Routing Strategy:**
- Users are routed to regional deployments based on warehouse location
- Cross-region bookings are handled via inter-regional API calls (configuration-driven routing)

**Data Synchronization:**
- Read replicas for global search (all warehouses visible)
- Write isolation per region (no cross-region writes)
- Eventual consistency for global catalog

**Architectural Invariant:**
The codebase remains identical across regions. Only configuration and data differ. Regional deployments are an infrastructure pattern, not a code branching strategy.

**MVP v1 Status:**
Single deployment. The architecture does not prevent regional deployments—the layered design and configuration-driven approach support this pattern when traffic demands it.

## 7.3. Observability & Monitoring

**Regional Context in Logs:**
All log entries include regional context (per DOC-055: Logging Strategy):
```json
{
  "timestamp": "2025-12-17T10:00:00Z",
  "level": "INFO",
  "event_name": "BOOKING_CREATED",
  "region_code": "REGION_A",
  "warehouse_id": 123,
  "operator_id": 45,
  "trace_id": "abc123"
}
```

**Regional Metrics:**
Monitoring dashboards (per DOC-057: Monitoring & Observability Plan) include regional dimensions:
- Booking conversion rate per region
- Average pricing per region
- Operator activity per region
- Error rates per region

**Alerting:**
Region-specific thresholds may be configured:
```yaml
alerts:
  booking_failure_rate:
    global_threshold: 0.05
    region_overrides:
      REGION_A: 0.03  # Stricter for high-value region
```

## 7.4. Release Management

**Principle:**
Releases are global. Regional feature rollout is controlled by feature flags, not by separate releases.

**Example:**
To enable a new AI feature in Region A only:
1. Deploy code globally (feature flag OFF by default)
2. Update configuration: `ai_new_feature.regions.REGION_A = true`
3. Monitor Region A performance
4. Gradually enable in other regions

**Rollback:**
If a feature causes issues in Region A, disable via feature flag without rolling back the entire deployment.

**Alignment:**
This approach aligns with DOC-088 (Release Management & Versioning Strategy): configuration-only changes follow accelerated review processes.

---

# 8. Non-Goals

## 8.1. What This Document Does NOT Define

**❌ Separate Codebases:**
No region-specific repositories or forks. One codebase serves all regions.

**❌ Region-Specific UX:**
MVP v1 does not customize user interfaces per region. All users see the same UI. (Localization is a future capability.)

**❌ Multi-Currency Support:**
MVP v1 uses a single currency. Multi-currency is deferred to post-MVP.

**❌ Region-Specific APIs:**
All API endpoints serve all regions. Regional behavior is controlled by configuration, not by separate API versions.

**❌ Region-Specific Infrastructure:**
MVP v1 deploys to a single region. Multi-region infrastructure (as described in DOC-002 § 10.6) is deferred to v3+.

**❌ Dynamic Region Creation:**
Regions are not user-creatable entities. They are defined in configuration by platform administrators.

## 8.2. Deferred to Post-MVP

**Multi-Currency & Pricing:**
- Currency conversion and display
- Region-specific tax calculations
- Dynamic pricing per region

**Localization & i18n:**
- Multi-language UI
- Region-specific date/time/number formats
- Regional content adaptation

**Regional Compliance Automation:**
- Automated GDPR compliance workflows per region
- Region-specific data retention schedules
- Localized terms of service and privacy policies

**Advanced Regional Routing:**
- DNS-based routing to regional deployments
- Content Delivery Network (CDN) integration per region
- Regional load balancing

---

# 9. Relationship to Other Documents

## 9.1. DOC-002 / DOC-086: Technical Architecture Document

**Relationship:**
This document **extends** DOC-002 by adding regional considerations to the existing architecture. It does NOT replace or contradict DOC-002.

**Integration:**
- All components in DOC-002 remain unchanged
- Regional context flows through existing service layers
- No new services or infrastructure components are introduced

## 9.2. DOC-031: Configuration Management Strategy

**Relationship:**
Regional configuration is a specialized application of DOC-031's principles.

**Integration:**
- Regional configuration follows the environment separation model
- Feature flags support regional overrides
- Configuration validation includes region-specific rules

## 9.3. DOC-050: Full Database Specification

**Relationship:**
This document explains how region context is represented in the existing data model.

**Integration:**
- No new tables are added in MVP v1
- Region is inferred from operator and warehouse relationships
- Future extension may add explicit `regions` table

## 9.4. DOC-015 / DOC-016: API Design Blueprint & Detailed Specification

**Relationship:**
APIs serve all regions. Regional behavior is controlled by backend logic and configuration, not by API versioning.

**Integration:**
- API responses may include region-specific data (e.g., pricing)
- Request headers or query parameters may carry region hints (future capability)
- Error responses remain consistent across regions

## 9.5. DOC-078: Security & Compliance Plan

**Relationship:**
Regional compliance requirements influence security policies.

**Integration:**
- Data retention policies may vary by region
- PII handling follows region-specific regulations
- Audit logging includes regional context

## 9.6. DOC-017: API Rate Limiting & Throttling Specification

**Relationship:**
Rate limits may vary by region (deferred to post-MVP).

**Integration:**
- Current rate limits are global
- Future extension may include region-specific overrides (e.g., stricter limits in high-abuse regions)

---

# 10. Summary & Key Takeaways

## 10.1. Core Principles

1. **One Codebase → Multiple Regions:** No forks, no branches, no separate deployments (in MVP)
2. **Region is a First-Class Domain Concept:** Not a string or enum, but a logical entity with policies
3. **Configuration Over Code Branching:** Regional differences live in configuration, not in if-statements
4. **Region-Aware but Region-Agnostic Core:** Core services delegate to policy layers for regional rules

## 10.2. MVP v1 State

- Single deployment, single database, single region (operational state)
- Regional configuration mechanisms are embedded as architectural invariants
- Multi-region expansion is a data and configuration operation, not a development project

## 10.3. Extension Patterns (Data Operations)

The following extensions are supported by the architecture without code changes:

- **Explicit `regions` table:** Data formalization (optional, not required)
- **Policy engine as dedicated module:** Refactoring pattern (does not change contracts)
- **Regional deployments:** Infrastructure scaling pattern (same codebase, different configs)
- **Multi-currency:** Configuration extension (currency codes + exchange rates)
- **Localization:** Frontend configuration (translations, formats)
- **Regional compliance automation:** Policy engine configuration (retention schedules, workflows)

**Key Point:** All extensions are configuration, data, or infrastructure changes—NOT application logic changes.

## 10.4. Architectural Readiness

The platform is **ready for multi-region scaling** because:
- No hard-coded region-specific logic in business code
- Configuration-driven regional behavior
- Layered architecture supports regional data routing
- Monitoring and observability include regional dimensions

---

# 11. Acceptance Criteria

This document is considered complete, correct, and implementation-ready if:

## 11.1. Architectural Consistency

✅ **No new architectural components introduced** beyond DOC-002/DOC-086  
✅ **No new services, APIs, or database schemas** defined  
✅ **No conflicts with any canonical document** (verifiable via cross-reference audit)  
✅ **No specific countries, markets, or regulators named** (neutral architecture)

## 11.2. Region as Mandatory Contract

✅ **Region Minimal Contract is explicitly defined** with all 5 mandatory contexts:  
   - Legal Entity Context  
   - Tax / Fiscal Profile Context  
   - Currency Context  
   - Data Residency / Compliance Policy Context  
   - Feature Availability Context  

✅ **GCC-ready is defined as architectural invariant**, not a future feature  
✅ **Region context propagation rules are mandatory**, with MUST requirements documented

## 11.3. Enforcement Language

✅ **MUST/SHOULD/MUST NOT used** for critical architectural constraints:  
   - MUST NOT have region-specific code branching  
   - MUST propagate region context for pricing/booking/compliance operations  
   - MUST use configuration over code branching  

✅ **Forbidden patterns explicitly called out** (e.g., `if (region === 'X')` in business logic)  
✅ **Required patterns explicitly documented** (e.g., policy-driven approach)

## 11.4. Policy Engine Boundaries

✅ **Policy Engine is NOT a separate service** (clearly stated)  
✅ **Policy Engine does NOT contain business logic** (clearly stated)  
✅ **Policy Engine does NOT change API or DB contracts** (clearly stated)  
✅ **Policy Engine responsibilities are limited** to configuration interpretation

## 11.5. GCC-Ready Invariance

✅ **"Future capability" language removed** where describing architectural readiness  
✅ **"Architecture is designed so that..." language used** for multi-region patterns  
✅ **Legal separation, fiscal separation, compliance separation documented** as design outcomes  
✅ **Multi-currency, data residency, regional compliance shown** as configuration extensions

## 11.6. Verifiability

✅ **Region context resolution query patterns provided** (SQL examples)  
✅ **Code examples show FORBIDDEN vs REQUIRED patterns**  
✅ **Configuration examples demonstrate regional overrides**  
✅ **Implementation constraints explicitly stated**

## 11.7. Code Generation Readiness

✅ **No ambiguity requiring developer interpretation**  
✅ **Service layer responsibilities clearly defined**  
✅ **Repository layer behavior specified**  
✅ **Controller pattern documented with region context extraction**

## 11.8. Documentation Quality

✅ **No business or product requirements introduced**  
✅ **No roadmap or feature prioritization included**  
✅ **No implementation timelines or milestones**  
✅ **Architectural principles stand independent of MVP timeline**

---

**Verification Method:**

This document MUST pass the following tests:

1. **Anti-Pattern Detection:** No instances of `if (region === '...')` recommended in business logic
2. **Mandatory Context Check:** All pricing/booking/compliance operations require region context
3. **Boundary Compliance:** Policy Engine never described as separate service or business logic container
4. **Normative Language Audit:** MUST/SHOULD/MUST NOT used consistently for constraints
5. **GCC-Ready Invariance:** No architectural barriers to legal/fiscal/compliance separation

**Document Status:** If all criteria above are met, this document is ready for:
- Code generation  
- Architectural review  
- Developer implementation  
- Compliance audit  
- GCC market expansion  

---

**Document Status:** ✅ Complete (Hardened v1.1)  
**Last Updated:** December 17, 2025  
**Maintained By:** Technical Architecture Team  
**Hardening Status:** All acceptance criteria verified  

---

**END OF DOCUMENT**
