# Full Database Specification for Self-Storage Aggregator MVP v1 — CANONICAL

**Status:** 🟢 GREEN - CANONICAL - Ready for Implementation

**Document Version:** 2.1 - CANONICAL  
**Date:** December 15, 2025  
**Last Updated:** December 15, 2025

---

## Document Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-10 | Initial database specification draft |
| 2.0 | 2025-12-15 | **CANONICAL VERSION** - Strict alignment with all CORE documents:<br>- Removed non-MVP tables (prices, attributes, services)<br>- Fixed booking statuses (5 canonical states only)<br>- Added cancellation semantics (cancelled_by, cancel_reason)<br>- Fixed CRM lead statuses to match CRM Spec<br>- Added API Mapping section<br>- Created Post-MVP / Future section<br>- Standardized soft delete<br>- Aligned logging with Logging Strategy |
| 2.1 | 2025-12-15 | **CRM STATUS FIX** - Corrected CRM lead statuses:<br>- Removed `booked` and `rejected` statuses (booking is separate domain)<br>- Changed status set to: `new`, `contacted`, `in_progress`, `closed`<br>- Moved `spam` from status to `is_spam BOOLEAN` field<br>- Updated state machine to reflect lead processing only (no conversion)<br>- Ensured booking domain separation |

---

# IMPORTANT: CANONICAL STATUS

This document is **CANONICAL** and strictly aligned with:

✅ **Functional_Specification_MVP_v1_Complete.md** — Source of truth for business requirements  
✅ **Technical_Architecture_Document_MVP_v1_CANONICAL.md** — Source of truth for architecture  
✅ **api_design_blueprint_mvp_v1_CANONICAL.md** — Source of truth for API contracts  
✅ **CRM_Lead_Management_System_MVP_v1_COMPLETE.md** — Source of truth for CRM domain  
✅ **backend_implementation_plan_mvp_v1_complete.md** — Source of truth for backend structure  
✅ **Security_and_Compliance_Plan_MVP_v1.md** — Source of truth for security  
✅ **API_Rate_Limiting_Throttling_Specification_MVP_v1_COMPLETE.md** — Source of truth for rate limits  
✅ **Error_Handling_Fault_Tolerance_Specification_MVP_v1_COMPLETE.md** — Source of truth for error handling  
✅ **Logging_Strategy_COMPLETE_ALL_SECTIONS.md** — Source of truth for logging  
✅ **unified_data_dictionary_mvp_v1.csv** — Source of truth for naming

**Any conflicting information in this document has been corrected to match the above sources.**

---

# 1. Overview

## 1.1. Purpose and Scope

### Document Purpose

This document provides the **complete and canonical database schema** for the Self-Storage Aggregator MVP v1 platform. It serves as the single source of truth for:

- Database engineers implementing the PostgreSQL schema
- Backend developers working with the data layer
- Frontend developers understanding data contracts
- QA engineers validating data integrity
- DevOps engineers setting up database infrastructure

### Scope: MVP v1 ONLY

**CRITICAL**: This specification describes **ONLY the tables required for MVP v1**. 

**Tables included:**
- ✅ Core user management (users, operators, operator_settings, refresh_tokens)
- ✅ Warehouse & inventory (warehouses, boxes, media)
- ✅ Bookings & reviews (bookings, reviews, favorites)
- ✅ CRM (crm_leads, crm_contacts, crm_activities, crm_activity_types, crm_status_history)
- ✅ Supporting systems (ai_requests_log, events_log, geo_cache)

**Tables NOT included in MVP v1:**
- ❌ prices (pricing history) — Fixed pricing only in MVP
- ❌ attributes, warehouse_attributes — Future feature
- ❌ services, warehouse_services — Future feature
- ❌ Any analytics/reporting tables — Future feature

See **Section 11: Post-MVP / Future Data Model** for excluded tables.

### Target Database

**PostgreSQL 15+** with **PostGIS** extension for geospatial queries.

---

## 1.2. Relationship to Other Documents

This Database Specification is derived from and must remain consistent with:

| Document | Relationship |
|----------|--------------|
| **API Blueprint (CANONICAL)** | All tables support the API endpoints. Field names and types match API request/response DTOs. |
| **Technical Architecture (CANONICAL)** | Database layer supports the architecture's service boundaries and data flows. |
| **Functional Specification** | Tables implement the business requirements and workflows. |
| **Backend Implementation Plan** | Database structure aligns with repository patterns and business logic. |
| **CRM Spec (CANONICAL)** | CRM tables match the CRM status machine and workflows exactly. |
| **Unified Data Dictionary** | All entity and field names follow the data dictionary. |

**Conflict Resolution Priority:**
1. Functional Specification (business requirements)
2. API Blueprint CANONICAL (public contracts)
3. Technical Architecture CANONICAL (system design)
4. Unified Data Dictionary (naming)

---

## 1.3. Database Architecture Overview

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **RDBMS** | PostgreSQL 15+ | Primary data store |
| **Geospatial** | PostGIS extension | Warehouse location queries |
| **Caching** | Redis | API response caching, session storage |
| **Search** | PostgreSQL Full-Text | Basic search (pg_trgm extension) |
| **Migrations** | Prisma / TypeORM | Schema version control |

### Data Domains

The database is organized into six logical domains:

1. **User Management** — Authentication, authorization, operator profiles
2. **Warehouse & Inventory** — Storage facilities and available boxes
3. **Bookings** — Rental requests and reservations
4. **Reviews & Favorites** — User feedback and preferences
5. **CRM** — Lead management and sales tracking
6. **System & Logging** — AI logs, events, geo cache

---

## 1.4. Key Architectural Decisions

### ID Strategy: SERIAL (Integer)

**Decision:** Use `SERIAL PRIMARY KEY` (auto-incrementing integers) for all tables.

**Rationale:**
- Simplicity for MVP development
- Better performance (4 bytes vs 16 bytes for UUID)
- Easier debugging and manual queries
- Sufficient for MVP scale
- Compatible with all ORMs

**Future Migration Path:** Can migrate to UUID in post-MVP if distributed systems require it.

### Soft Delete Strategy

**Decision:** Implement soft delete for critical business tables.

**Tables with soft delete:**
- users
- operators
- warehouses
- boxes
- bookings (optional but recommended)

**Implementation:** `deleted_at TIMESTAMP NULL` field. When `deleted_at IS NOT NULL`, record is considered deleted.

**Rationale:**
- Data recovery capability
- Audit trail preservation
- GDPR compliance (right to be forgotten via anonymization + soft delete)
- Historical analytics

### Timestamp Strategy

**Decision:** Use `TIMESTAMP WITHOUT TIME ZONE` with UTC convention.

**Rationale:**
- Simpler than TIMESTAMPTZ for MVP
- Application layer converts to user timezones
- Consistent with most cloud platforms
- All times stored in UTC

**Fields:**
- `created_at` — Never modified after INSERT
- `updated_at` — Auto-updated via trigger on every UPDATE
- `deleted_at` — Set once on soft delete

### Normalization Level

**Decision:** 3NF (Third Normal Form) with selective denormalization.

**Normalized:**
- User, operator, warehouse, box relationships
- CRM lead tracking and activities
- Booking state transitions

**Denormalized for Performance:**
- `warehouses.rating`, `warehouses.review_count` — Cached from reviews
- `boxes.is_available` — Computed from bookings but cached
- Price stored in both `boxes.price_monthly` AND `bookings.price_total` — Immutable snapshot

---

# 2. Complete Table Specifications (MVP v1)

## 2.1. Naming Conventions

### Tables
- **Format:** `snake_case`, plural
- **Examples:** `users`, `warehouses`, `crm_leads`

### Columns
- **Format:** `snake_case`, singular
- **Examples:** `user_id`, `created_at`, `price_monthly`

### Indexes
- **Format:** `idx_{table}_{column(s)}`
- **Examples:** `idx_users_email`, `idx_bookings_warehouse_status`

### Constraints
- **Primary Key:** `{table}_pkey` (auto-generated)
- **Foreign Key:** `fk_{table}_{referenced_table}`
- **Check:** `chk_{table}_{column}`
- **Unique:** `uq_{table}_{column}`

---

## 2.2. Table: `users`

### Purpose

Central table for all platform users: customers, operators, and administrators.

### Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT chk_users_role CHECK (role IN ('user', 'operator', 'admin')),
  CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token) 
  WHERE email_verification_token IS NOT NULL;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'All platform users: customers, operators, administrators';
COMMENT ON COLUMN users.role IS 'user=customer, operator=warehouse owner, admin=platform admin';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hash (cost factor 10)';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique user identifier |
| email | VARCHAR(255) | NO | UNIQUE | Login email (unique across platform) |
| password_hash | VARCHAR(255) | NO | | bcrypt hash of password |
| name | VARCHAR(255) | NO | | User's full name |
| phone | VARCHAR(20) | YES | | Phone number (format: +7XXXXXXXXXX) |
| role | VARCHAR(20) | NO | CHECK | user \| operator \| admin |
| email_verified | BOOLEAN | NO | DEFAULT FALSE | Email confirmation status |
| email_verification_token | VARCHAR(255) | YES | | Token for email verification |
| password_reset_token | VARCHAR(255) | YES | | Token for password reset |
| password_reset_expires | TIMESTAMP | YES | | Expiry time for reset token |
| last_login_at | TIMESTAMP | YES | | Last successful login timestamp |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Registration timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last profile update timestamp |
| deleted_at | TIMESTAMP | YES | | Soft delete timestamp |

### Relationships

- **Outgoing FK:**
  - users.id → operators.user_id (1:1)
  - users.id → bookings.user_id (1:N)
  - users.id → reviews.user_id (1:N)
  - users.id → favorites.user_id (1:N)
  - users.id → refresh_tokens.user_id (1:N)
  - users.id → crm_leads.user_id (1:N, optional)

---

## 2.3. Table: `operators`

### Purpose

Stores operator (warehouse owner) profiles. One user can have one operator profile.

### Schema

```sql
CREATE TABLE operators (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50),
  legal_address TEXT,
  billing_email VARCHAR(255),
  support_phone VARCHAR(20),
  support_email VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verification_documents JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_operators_user_id ON operators(user_id);
CREATE INDEX idx_operators_is_verified ON operators(is_verified);
CREATE INDEX idx_operators_created_at ON operators(created_at DESC);

CREATE TRIGGER update_operators_updated_at
  BEFORE UPDATE ON operators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE operators IS 'Warehouse operators (owners) - extends users table';
COMMENT ON COLUMN operators.is_verified IS 'Admin-approved operator status';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique operator identifier |
| user_id | INTEGER | NO | FK, UNIQUE | Reference to users table (1:1) |
| company_name | VARCHAR(255) | NO | | Legal company name |
| tax_id | VARCHAR(50) | YES | | Tax identification number (INN, OGRN) |
| legal_address | TEXT | YES | | Legal registration address |
| billing_email | VARCHAR(255) | YES | | Email for invoices |
| support_phone | VARCHAR(20) | YES | | Customer support phone |
| support_email | VARCHAR(255) | YES | | Customer support email |
| is_verified | BOOLEAN | NO | DEFAULT FALSE | Admin verification status |
| verified_at | TIMESTAMP | YES | | Timestamp of admin approval |
| verification_documents | JSONB | YES | | IDs, licenses, certificates (metadata) |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Operator registration timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |
| deleted_at | TIMESTAMP | YES | | Soft delete timestamp |

### Relationships

- **Incoming FK:**
  - operators.user_id ← users.id (1:1)
- **Outgoing FK:**
  - operators.id → warehouses.operator_id (1:N)
  - operators.id → operator_settings.operator_id (1:1)

---

## 2.4. Table: `operator_settings`

### Purpose

Stores operator-specific business settings (deposit percentage, cancellation policy, etc.).

### Schema

```sql
CREATE TABLE operator_settings (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER UNIQUE NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  deposit_percentage INTEGER DEFAULT 50,
  cancellation_policy TEXT,
  auto_confirm_bookings BOOLEAN DEFAULT FALSE,
  booking_lead_time_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_deposit_percentage CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100)
);

CREATE INDEX idx_operator_settings_operator_id ON operator_settings(operator_id);

CREATE TRIGGER update_operator_settings_updated_at
  BEFORE UPDATE ON operator_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE operator_settings IS 'Business settings per operator';
COMMENT ON COLUMN operator_settings.deposit_percentage IS 'Required deposit as % of total price (default 50%)';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique settings identifier |
| operator_id | INTEGER | NO | FK, UNIQUE | Reference to operators (1:1) |
| deposit_percentage | INTEGER | NO | CHECK, DEFAULT 50 | Required deposit % (0-100) |
| cancellation_policy | TEXT | YES | | Operator's cancellation terms |
| auto_confirm_bookings | BOOLEAN | NO | DEFAULT FALSE | Auto-confirm without operator action |
| booking_lead_time_hours | INTEGER | NO | DEFAULT 24 | Min hours before booking start |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Settings creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last settings update timestamp |

---

## 2.5. Table: `refresh_tokens`

### Purpose

Stores JWT refresh tokens for session management.

### Schema

```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP,
  
  CONSTRAINT chk_expires_future CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(user_id, expires_at) 
  WHERE revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP;

COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for session management';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique token identifier |
| user_id | INTEGER | NO | FK | Reference to users table |
| token | VARCHAR(500) | NO | UNIQUE | JWT refresh token string |
| expires_at | TIMESTAMP | NO | CHECK | Token expiration timestamp |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Token creation timestamp |
| revoked_at | TIMESTAMP | YES | | Token revocation timestamp |

---

## 2.6. Table: `warehouses`

### Purpose

Storage facilities managed by operators. Contains location, description, and metadata.

### Schema

```sql
CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER NOT NULL REFERENCES operators(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  coordinates GEOGRAPHY(POINT, 4326),
  working_hours JSONB,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_warehouses_operator_id ON warehouses(operator_id);
CREATE INDEX idx_warehouses_is_active ON warehouses(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_warehouses_rating ON warehouses(rating DESC);
CREATE INDEX idx_warehouses_coordinates ON warehouses USING GIST(coordinates);
CREATE INDEX idx_warehouses_active ON warehouses(id) WHERE deleted_at IS NULL;

CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON warehouses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update coordinates from lat/lng
CREATE OR REPLACE FUNCTION update_warehouse_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.coordinates = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_warehouse_coordinates
  BEFORE INSERT OR UPDATE OF latitude, longitude ON warehouses
  FOR EACH ROW
  EXECUTE FUNCTION update_warehouse_coordinates();

COMMENT ON TABLE warehouses IS 'Storage facilities managed by operators';
COMMENT ON COLUMN warehouses.coordinates IS 'PostGIS geography point for geospatial queries';
COMMENT ON COLUMN warehouses.rating IS 'Cached average rating from reviews (denormalized)';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique warehouse identifier |
| operator_id | INTEGER | NO | FK | Reference to operators table |
| name | VARCHAR(255) | NO | | Warehouse name |
| description | TEXT | YES | | Detailed description |
| address | TEXT | NO | | Full street address |
| latitude | DOUBLE PRECISION | NO | CHECK (-90 to 90) | Latitude coordinate |
| longitude | DOUBLE PRECISION | NO | CHECK (-180 to 180) | Longitude coordinate |
| coordinates | GEOGRAPHY | YES | AUTO | PostGIS point (auto-computed) |
| working_hours | JSONB | YES | | Operating hours JSON |
| rating | DECIMAL(3,2) | NO | DEFAULT 0.00 | Cached average rating (0-5) |
| review_count | INTEGER | NO | DEFAULT 0 | Cached review count |
| is_active | BOOLEAN | NO | DEFAULT TRUE | Warehouse operational status |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Warehouse creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |
| deleted_at | TIMESTAMP | YES | | Soft delete timestamp |

### Relationships

- **Incoming FK:**
  - warehouses.operator_id ← operators.id (N:1)
- **Outgoing FK:**
  - warehouses.id → boxes.warehouse_id (1:N)
  - warehouses.id → media.warehouse_id (1:N)
  - warehouses.id → bookings.warehouse_id (1:N)
  - warehouses.id → reviews.warehouse_id (1:N)
  - warehouses.id → favorites.warehouse_id (1:N)
  - warehouses.id → crm_leads.warehouse_id (1:N)

---

## 2.7. Table: `boxes`

### Purpose

Individual storage units within warehouses. Each box has a size, price, and availability status.

### Schema

```sql
CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  size VARCHAR(5) NOT NULL,
  price_monthly INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  total_quantity INTEGER NOT NULL DEFAULT 1,
  available_quantity INTEGER NOT NULL DEFAULT 1,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  occupied_quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  dimensions VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT chk_size CHECK (size IN ('S', 'M', 'L', 'XL')),
  CONSTRAINT chk_price_monthly CHECK (price_monthly > 0),
  CONSTRAINT chk_quantities CHECK (
    total_quantity = available_quantity + reserved_quantity + occupied_quantity
  )
);

CREATE INDEX idx_boxes_warehouse_id ON boxes(warehouse_id);
CREATE INDEX idx_boxes_size ON boxes(size);
CREATE INDEX idx_boxes_is_available ON boxes(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_boxes_warehouse_size ON boxes(warehouse_id, size);
CREATE INDEX idx_boxes_active ON boxes(id) WHERE deleted_at IS NULL;

CREATE TRIGGER update_boxes_updated_at
  BEFORE UPDATE ON boxes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE boxes IS 'Storage units within warehouses';
COMMENT ON COLUMN boxes.size IS 'S=1-3m², M=3-6m², L=6-12m², XL=12+m²';
COMMENT ON COLUMN boxes.is_available IS 'Simplified availability flag (computed from quantities)';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique box identifier |
| warehouse_id | INTEGER | NO | FK | Reference to warehouses table |
| size | VARCHAR(5) | NO | CHECK | S \| M \| L \| XL |
| price_monthly | INTEGER | NO | CHECK (> 0) | Monthly rental price in cents |
| is_available | BOOLEAN | NO | DEFAULT TRUE | Quick availability flag |
| total_quantity | INTEGER | NO | DEFAULT 1 | Total boxes of this size/price |
| available_quantity | INTEGER | NO | DEFAULT 1 | Currently free boxes |
| reserved_quantity | INTEGER | NO | DEFAULT 0 | Pending bookings |
| occupied_quantity | INTEGER | NO | DEFAULT 0 | Active rentals |
| description | TEXT | YES | | Box-specific description |
| dimensions | VARCHAR(50) | YES | | Physical dimensions (e.g. "2x3m") |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Box creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |
| deleted_at | TIMESTAMP | YES | | Soft delete timestamp |

### Business Rules

**Quantity Invariant:**
```
total_quantity = available_quantity + reserved_quantity + occupied_quantity
```

**Availability:**
- `is_available = TRUE` when `available_quantity > 0`
- `is_available = FALSE` when `available_quantity = 0`

---

## 2.8. Table: `bookings`

### Purpose

Customer booking requests for storage boxes. Tracks the complete booking lifecycle.

### Schema

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Relations
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  box_id INTEGER NOT NULL REFERENCES boxes(id) ON DELETE RESTRICT,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_months INTEGER NOT NULL,
  actual_end_date DATE,
  
  -- Pricing (snapshot from booking time)
  base_price_per_month INTEGER NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  monthly_price INTEGER NOT NULL,
  price_total INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  
  -- Cancellation Semantics (CANONICAL)
  cancelled_by VARCHAR(20),
  cancel_reason TEXT,
  
  -- Contact Info
  contact_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  
  -- Notes
  notes TEXT,
  special_requests TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  payment_received_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  -- Constraints (CANONICAL)
  CONSTRAINT chk_bookings_status CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed', 'expired')
  ),
  CONSTRAINT chk_bookings_payment_status CHECK (
    payment_status IN ('pending', 'partial', 'paid', 'overdue', 'refunded')
  ),
  CONSTRAINT chk_bookings_cancelled_by CHECK (
    cancelled_by IS NULL OR cancelled_by IN ('user', 'operator', 'system')
  ),
  CONSTRAINT chk_bookings_dates CHECK (end_date > start_date),
  CONSTRAINT chk_bookings_duration CHECK (duration_months > 0),
  CONSTRAINT chk_bookings_cancelled_semantics CHECK (
    (status = 'cancelled' AND cancelled_by IS NOT NULL) OR
    (status != 'cancelled' AND cancelled_by IS NULL)
  )
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_warehouse_id ON bookings(warehouse_id);
CREATE INDEX idx_bookings_box_id ON bookings(box_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_warehouse_status_created ON bookings(warehouse_id, status, created_at DESC);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE bookings IS 'Customer booking requests - canonical status machine';
COMMENT ON COLUMN bookings.status IS 'CANONICAL: pending | confirmed | cancelled | completed | expired';
COMMENT ON COLUMN bookings.cancelled_by IS 'CANONICAL: user | operator | system (required when status=cancelled)';
COMMENT ON COLUMN bookings.cancel_reason IS 'Free-text cancellation reason';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique booking identifier |
| booking_number | VARCHAR(50) | NO | UNIQUE | Human-readable booking ref (e.g. BK-2025-00001) |
| user_id | INTEGER | NO | FK | Reference to users table |
| warehouse_id | INTEGER | NO | FK | Reference to warehouses table |
| box_id | INTEGER | NO | FK | Reference to boxes table |
| start_date | DATE | NO | CHECK | Rental start date |
| end_date | DATE | NO | CHECK (> start_date) | Rental end date (planned) |
| duration_months | INTEGER | NO | CHECK (> 0) | Rental duration in months |
| actual_end_date | DATE | YES | | Actual end date (if different) |
| base_price_per_month | INTEGER | NO | | Base price snapshot |
| discount_percentage | DECIMAL(5,2) | NO | DEFAULT 0.00 | Applied discount % |
| monthly_price | INTEGER | NO | | Final monthly price after discount |
| price_total | INTEGER | NO | | Total rental cost |
| deposit | INTEGER | NO | | Required deposit amount |
| **status** | VARCHAR(20) | NO | **CHECK** | **pending \| confirmed \| cancelled \| completed \| expired** |
| payment_status | VARCHAR(20) | NO | CHECK | pending \| partial \| paid \| overdue \| refunded |
| **cancelled_by** | VARCHAR(20) | YES | **CHECK** | **user \| operator \| system** (required if cancelled) |
| **cancel_reason** | TEXT | YES | | Cancellation explanation |
| contact_name | VARCHAR(255) | NO | | Contact person name |
| contact_phone | VARCHAR(20) | NO | | Contact phone |
| contact_email | VARCHAR(255) | NO | | Contact email |
| notes | TEXT | YES | | Customer notes |
| special_requests | TEXT | YES | | Special requirements |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Booking creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |
| confirmed_at | TIMESTAMP | YES | | Operator confirmation timestamp |
| payment_received_at | TIMESTAMP | YES | | Payment receipt timestamp |
| started_at | TIMESTAMP | YES | | Rental start timestamp |
| completed_at | TIMESTAMP | YES | | Rental completion timestamp |
| cancelled_at | TIMESTAMP | YES | | Cancellation timestamp |
| deleted_at | TIMESTAMP | YES | | Soft delete timestamp |

### CANONICAL Booking Status Machine

**Source:** api_design_blueprint_mvp_v1_CANONICAL.md

```
pending → confirmed → cancelled
                   ↘ completed
                   ↘ expired
```

**Allowed Statuses (ONLY):**
1. **pending** — User created booking, awaiting operator confirmation
2. **confirmed** — Operator confirmed booking
3. **cancelled** — Booking cancelled (by user, operator, or system)
4. **completed** — Rental period ended successfully
5. **expired** — Booking expired (not confirmed within 24h)

**Cancellation Semantics:**
- When `status = 'cancelled'`, `cancelled_by` MUST be set
- `cancelled_by` values: `user` | `operator` | `system`
- `cancel_reason` is optional TEXT field

**Status Transitions:**
- `pending` → `confirmed` (operator action)
- `pending` → `cancelled` (user, operator, or system action)
- `pending` → `expired` (system timeout after 24h)
- `confirmed` → `cancelled` (user or operator action)
- `confirmed` → `completed` (rental period ends)

---

## 2.9. Table: `reviews`

### Purpose

User reviews for warehouses. One review per user per warehouse.

### Schema

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  verified BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  operator_response TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT uq_user_warehouse UNIQUE (user_id, warehouse_id)
);

CREATE INDEX idx_reviews_warehouse_id ON reviews(warehouse_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_verified ON reviews(verified) WHERE verified = TRUE;
CREATE INDEX idx_reviews_visible ON reviews(is_visible) WHERE is_visible = TRUE;
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE reviews IS 'User reviews for warehouses (one per user per warehouse)';
COMMENT ON COLUMN reviews.verified IS 'TRUE if user has completed booking at this warehouse';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique review identifier |
| user_id | INTEGER | NO | FK | Reference to users table |
| warehouse_id | INTEGER | NO | FK | Reference to warehouses table |
| booking_id | INTEGER | YES | FK | Reference to bookings (if verified) |
| rating | INTEGER | NO | CHECK (1-5) | Star rating (1-5) |
| comment | TEXT | YES | | Review text |
| verified | BOOLEAN | NO | DEFAULT FALSE | Verified purchase flag |
| is_visible | BOOLEAN | NO | DEFAULT TRUE | Admin moderation flag |
| operator_response | TEXT | YES | | Operator's reply to review |
| responded_at | TIMESTAMP | YES | | Operator response timestamp |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Review creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |

### Business Rules

- **One review per user per warehouse:** Enforced by `UNIQUE (user_id, warehouse_id)`
- **Verified reviews:** `verified = TRUE` if user completed a booking at this warehouse
- **Moderation:** Admin can set `is_visible = FALSE` to hide spam/inappropriate reviews

---

## 2.10. Table: `favorites`

### Purpose

User's favorite (bookmarked) warehouses for quick access.

### Schema

```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT uq_user_warehouse_favorite UNIQUE (user_id, warehouse_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_warehouse_id ON favorites(warehouse_id);

COMMENT ON TABLE favorites IS 'User favorite warehouses';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique favorite identifier |
| user_id | INTEGER | NO | FK | Reference to users table |
| warehouse_id | INTEGER | NO | FK | Reference to warehouses table |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Favorite added timestamp |

---

## 2.11. Table: `media`

### Purpose

Photos and videos of warehouses for marketing and presentation.

### Schema

```sql
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_file_type CHECK (file_type IN ('image', 'video'))
);

CREATE INDEX idx_media_warehouse_id ON media(warehouse_id);
CREATE INDEX idx_media_is_primary ON media(is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_media_warehouse_display_order ON media(warehouse_id, display_order);

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE media IS 'Warehouse photos and videos';
COMMENT ON COLUMN media.is_primary IS 'Main photo displayed in cards and lists';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique media file identifier |
| warehouse_id | INTEGER | NO | FK | Reference to warehouses table |
| file_url | VARCHAR(500) | NO | | CDN/S3 URL of the file |
| file_type | VARCHAR(20) | NO | CHECK | image \| video |
| mime_type | VARCHAR(50) | NO | | MIME type (e.g. image/jpeg) |
| file_size | INTEGER | YES | | File size in bytes |
| width | INTEGER | YES | | Image width in pixels |
| height | INTEGER | YES | | Image height in pixels |
| display_order | INTEGER | NO | DEFAULT 0 | Sort order (lower = first) |
| is_primary | BOOLEAN | NO | DEFAULT FALSE | Main warehouse photo flag |
| caption | VARCHAR(255) | YES | | Photo description/caption |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Upload timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |

---

## 2.12. CRM Tables

### Table: `crm_leads`

### Purpose

Lead management for potential customers (from contact forms, chat, phone calls).

### Schema

```sql
CREATE TABLE crm_leads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  is_spam BOOLEAN DEFAULT FALSE,
  warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE SET NULL,
  preferred_box_size VARCHAR(5),
  source VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_crm_leads_status CHECK (
    status IN ('new', 'contacted', 'in_progress', 'closed')
  ),
  CONSTRAINT chk_crm_leads_box_size CHECK (
    preferred_box_size IS NULL OR preferred_box_size IN ('S', 'M', 'L', 'XL')
  )
);

CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_leads_warehouse_id ON crm_leads(warehouse_id);
CREATE INDEX idx_crm_leads_created_at ON crm_leads(created_at DESC);
CREATE INDEX idx_crm_leads_user_id ON crm_leads(user_id);
CREATE INDEX idx_crm_leads_is_spam ON crm_leads(is_spam) WHERE is_spam = FALSE;

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crm_leads IS 'CRM leads from contact forms, chat, calls';
COMMENT ON COLUMN crm_leads.status IS 'CANONICAL: new | contacted | in_progress | closed (lead processing only, no booking status)';
COMMENT ON COLUMN crm_leads.is_spam IS 'Flag for spam/fake leads (separate from status)';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique lead identifier |
| user_id | INTEGER | YES | FK | Reference to users (if registered) |
| name | VARCHAR(255) | NO | | Lead's full name |
| phone | VARCHAR(20) | NO | | Contact phone number |
| email | VARCHAR(255) | YES | | Contact email (optional) |
| **status** | VARCHAR(20) | NO | **CHECK** | **new \| contacted \| in_progress \| closed** |
| **is_spam** | BOOLEAN | NO | DEFAULT FALSE | Spam/fake lead flag |
| warehouse_id | INTEGER | YES | FK | Interested warehouse |
| preferred_box_size | VARCHAR(5) | YES | CHECK | S \| M \| L \| XL |
| source | VARCHAR(50) | YES | | Lead source (web_form, chat, phone) |
| notes | TEXT | YES | | Internal notes |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Lead creation timestamp |
| updated_at | TIMESTAMP | NO | AUTO | Last update timestamp |

### CANONICAL CRM Lead Status Machine

**Source:** CRM_Lead_Management_System_MVP_v1_CANONICAL.md (after TASK #CRM-002) & api_design_blueprint_mvp_v1_CANONICAL.md

**IMPORTANT: CRM tracks lead processing ONLY, not booking conversion.**

```
new → contacted → in_progress → closed
```

**Allowed Statuses (ONLY):**
1. **new** — Initial lead state (just captured)
2. **contacted** — Operator made first contact with lead
3. **in_progress** — Lead is being actively processed
4. **closed** — Lead processing completed (outcome recorded separately)

**Spam Handling:**
- Spam is NOT a status
- Use `is_spam = TRUE` to mark spam/fake leads
- Spam leads can be filtered out of normal workflows

**Booking Domain Separation:**
- CRM tracks lead processing workflow ONLY
- Booking creation is a separate domain with its own status machine
- When a lead results in a booking, that booking has its own lifecycle (pending → confirmed → etc.)
- Optional: `crm_leads` MAY have a nullable `booking_id` reference for tracking, but this does NOT drive status
- The lead status remains in CRM workflow states, independent of booking status

**State Transitions:**
- `new` → `contacted` (operator makes first contact)
- `contacted` → `in_progress` (lead requires follow-up)
- `in_progress` → `closed` (lead processing complete)
- Any state → `closed` (lead can be closed from any state)

**Closed Reason (Optional Enhancement):**
- When closing a lead, operator may record reason in `notes` field
- Examples: "converted to booking", "not interested", "unreachable", "wrong contact info"
- This is freeform text, not a status

---

### Table: `crm_contacts`

### Purpose

Communication history for each lead (messages, calls, emails).

### Schema

```sql
CREATE TABLE crm_contacts (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  contact_type VARCHAR(20) NOT NULL,
  message TEXT,
  initiated_by VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_contact_type CHECK (
    contact_type IN ('call', 'email', 'sms', 'chat', 'form_submission')
  ),
  CONSTRAINT chk_initiated_by CHECK (
    initiated_by IS NULL OR initiated_by IN ('user', 'operator')
  )
);

CREATE INDEX idx_crm_contacts_lead_id ON crm_contacts(lead_id);
CREATE INDEX idx_crm_contacts_created_at ON crm_contacts(created_at DESC);

COMMENT ON TABLE crm_contacts IS 'Communication history for CRM leads';
```

---

### Table: `crm_activities`

### Purpose

Planned follow-up activities (calls, meetings, tasks).

### Schema

```sql
CREATE TABLE crm_activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  activity_type_id INTEGER REFERENCES crm_activity_types(id),
  due_date TIMESTAMP,
  note TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX idx_crm_activities_due_date ON crm_activities(due_date);
CREATE INDEX idx_crm_activities_completed ON crm_activities(completed) WHERE completed = FALSE;

CREATE TRIGGER update_crm_activities_updated_at
  BEFORE UPDATE ON crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE crm_activities IS 'Planned follow-up activities for leads';
```

---

### Table: `crm_activity_types`

### Purpose

Reference table for activity types (call, meeting, email, etc.).

### Schema

```sql
CREATE TABLE crm_activity_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crm_activity_types (name, description, icon) VALUES
  ('call', 'Phone call', 'phone'),
  ('email', 'Email communication', 'mail'),
  ('meeting', 'In-person meeting', 'users'),
  ('follow_up', 'General follow-up', 'clock');

COMMENT ON TABLE crm_activity_types IS 'Reference table for activity types';
```

---

### Table: `crm_status_history`

### Purpose

Audit trail for CRM lead status changes.

### Schema

```sql
CREATE TABLE crm_status_history (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT
);

CREATE INDEX idx_crm_status_history_lead_id ON crm_status_history(lead_id);
CREATE INDEX idx_crm_status_history_changed_at ON crm_status_history(changed_at DESC);

COMMENT ON TABLE crm_status_history IS 'Audit trail for lead status changes';
```

---

## 2.13. System & Logging Tables

### Table: `ai_requests_log`

### Purpose

Logs all AI API requests for monitoring, debugging, and cost tracking.

### Schema

```sql
CREATE TABLE ai_requests_log (
  id SERIAL PRIMARY KEY,
  request_type VARCHAR(50) NOT NULL,
  provider_key VARCHAR(50) NOT NULL DEFAULT 'llm_primary',
  model_id VARCHAR(50),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  input_text TEXT,
  output_text TEXT,
  tokens_used INTEGER,
  latency_ms INTEGER,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_ai_status CHECK (status IN ('success', 'error', 'timeout'))
);

CREATE INDEX idx_ai_requests_log_request_type ON ai_requests_log(request_type);
CREATE INDEX idx_ai_requests_log_status ON ai_requests_log(status);
CREATE INDEX idx_ai_requests_log_created_at ON ai_requests_log(created_at DESC);
CREATE INDEX idx_ai_requests_log_user_id ON ai_requests_log(user_id);

COMMENT ON TABLE ai_requests_log IS 'AI API request logs (aligned with Logging Strategy)';
COMMENT ON COLUMN ai_requests_log.provider_key IS 'Internal provider identifier (not public)';
COMMENT ON COLUMN ai_requests_log.request_type IS 'box_size_recommendation (MVP), price_analysis (future), etc.';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique log entry identifier |
| request_type | VARCHAR(50) | NO | | Type of AI request (e.g. box_size_recommendation) |
| provider_key | VARCHAR(50) | NO | DEFAULT 'llm_primary' | Internal provider identifier |
| model_id | VARCHAR(50) | YES | | Internal model identifier |
| user_id | INTEGER | YES | FK | Reference to users (if authenticated) |
| input_text | TEXT | YES | | User input (items description) |
| output_text | TEXT | YES | | AI response |
| tokens_used | INTEGER | YES | | Token consumption (if available) |
| latency_ms | INTEGER | YES | | Request latency in milliseconds |
| status | VARCHAR(20) | NO | CHECK | success \| error \| timeout |
| error_message | TEXT | YES | | Error details if failed |
| metadata | JSONB | YES | | Additional request metadata |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Request timestamp |

**Alignment with Logging Strategy:**
- Logs all AI requests for monitoring
- No provider-specific details exposed
- Includes performance metrics (latency, tokens)
- Status tracking for reliability metrics

---

### Table: `events_log`

### Purpose

General application event log for auditing and debugging.

### Schema

```sql
CREATE TABLE events_log (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  request_id VARCHAR(100),
  payload JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_log_event_name ON events_log(event_name);
CREATE INDEX idx_events_log_actor_id ON events_log(actor_id);
CREATE INDEX idx_events_log_entity_type_id ON events_log(entity_type, entity_id);
CREATE INDEX idx_events_log_created_at ON events_log(created_at DESC);
CREATE INDEX idx_events_log_request_id ON events_log(request_id) WHERE request_id IS NOT NULL;

COMMENT ON TABLE events_log IS 'Application event log (aligned with Logging Strategy)';
COMMENT ON COLUMN events_log.event_name IS 'Event name in UPPER_SNAKE_CASE (e.g. USER_REGISTERED, BOOKING_CREATED)';
COMMENT ON COLUMN events_log.request_id IS 'HTTP request ID for correlation';
```

### Field Specifications (Aligned with Logging Strategy)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | SERIAL | NO | Unique log entry identifier |
| **event_name** | VARCHAR(100) | NO | Event name (UPPER_SNAKE_CASE per Logging Spec) |
| **actor_id** | INTEGER | YES | User who triggered the event |
| **entity_type** | VARCHAR(50) | YES | Entity type (user, booking, warehouse, etc.) |
| **entity_id** | INTEGER | YES | Entity identifier |
| **request_id** | VARCHAR(100) | YES | HTTP request ID for correlation |
| payload | JSONB | YES | Additional event data |
| created_at | TIMESTAMP | NO | Event timestamp |

**Common Event Names (Examples):**
- USER_REGISTERED
- USER_LOGGED_IN
- BOOKING_CREATED
- BOOKING_CONFIRMED
- BOOKING_CANCELLED
- WAREHOUSE_CREATED
- REVIEW_SUBMITTED
- LEAD_CREATED
- LEAD_STATUS_CHANGED

**Alignment with Logging Strategy:**
- Required fields per Logging_Strategy_COMPLETE_ALL_SECTIONS.md
- Includes actor_id, entity_type, entity_id, request_id
- Event names follow UPPER_SNAKE_CASE convention
- Supports distributed tracing via request_id

---

### Table: `geo_cache`

### Purpose

Cache geocoding results to avoid redundant API calls to geocoding services.

### Schema

```sql
CREATE TABLE geo_cache (
  id SERIAL PRIMARY KEY,
  address_query TEXT UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  normalized_address TEXT,
  provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  CONSTRAINT chk_geo_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT chk_geo_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX idx_geo_cache_address_query ON geo_cache(address_query);
CREATE INDEX idx_geo_cache_expires_at ON geo_cache(expires_at);

COMMENT ON TABLE geo_cache IS 'Geocoding API response cache';
```

### Field Specifications

| Field | Type | Nullable | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | SERIAL | NO | PK | Unique cache entry identifier |
| address_query | TEXT | NO | UNIQUE | Input address string |
| latitude | DOUBLE PRECISION | NO | CHECK (-90 to 90) | Geocoded latitude |
| longitude | DOUBLE PRECISION | NO | CHECK (-180 to 180) | Geocoded longitude |
| normalized_address | TEXT | YES | | Standardized address from provider |
| provider | VARCHAR(50) | YES | | Geocoding provider used |
| created_at | TIMESTAMP | NO | DEFAULT NOW() | Cache entry creation timestamp |
| expires_at | TIMESTAMP | YES | | Cache expiration timestamp |

---

# 3. API to Database Mapping

This section maps API endpoints to database operations, ensuring alignment between **api_design_blueprint_mvp_v1_CANONICAL.md** and this database specification.

## 3.1. Authentication Endpoints

| API Endpoint | HTTP Method | Primary Tables | Notes |
|--------------|-------------|----------------|-------|
| `/auth/register` | POST | users | Creates new user with role='user' |
| `/auth/login` | POST | users, refresh_tokens | Validates credentials, creates refresh token |
| `/auth/refresh` | POST | refresh_tokens | Rotates refresh token |
| `/auth/logout` | POST | refresh_tokens | Revokes refresh token |
| `/auth/verify-email` | POST | users | Updates email_verified = TRUE |

## 3.2. User Endpoints

| API Endpoint | HTTP Method | Primary Tables | Query Pattern |
|--------------|-------------|----------------|---------------|
| `/users/me` | GET | users, operators (optional) | SELECT users LEFT JOIN operators |
| `/users/me` | PATCH | users | UPDATE users WHERE id = {current_user} |
| `/users/favorites` | GET | favorites, warehouses | SELECT favorites JOIN warehouses |
| `/users/favorites/{id}` | POST | favorites | INSERT INTO favorites |
| `/users/favorites/{id}` | DELETE | favorites | DELETE FROM favorites |

## 3.3. Warehouse Endpoints

| API Endpoint | HTTP Method | Primary Tables | Query Pattern |
|--------------|-------------|----------------|---------------|
| `/warehouses` | GET | warehouses, boxes, media | SELECT warehouses with geospatial filter |
| `/warehouses/{id}` | GET | warehouses, boxes, reviews, media, operators | SELECT warehouse with all related data |
| `/warehouses/{id}/reviews` | GET | reviews, users | SELECT reviews WHERE warehouse_id = {id} |

## 3.4. Booking Endpoints

| API Endpoint | HTTP Method | Primary Tables | Transaction Pattern |
|--------------|-------------|----------------|---------------------|
| `/bookings` | POST | bookings, boxes, warehouses | BEGIN → SELECT box FOR UPDATE → INSERT booking → UPDATE box quantities → COMMIT |
| `/bookings` | GET | bookings, warehouses, boxes | SELECT bookings WHERE user_id = {current_user} |
| `/bookings/{id}` | GET | bookings, warehouses, boxes, operators | SELECT booking with all related data |
| `/bookings/{id}` | DELETE | bookings, boxes | BEGIN → UPDATE bookings SET status='cancelled', cancelled_by='user' → UPDATE box quantities → COMMIT |

**Critical: Cancellation Semantics**

When cancelling a booking via `DELETE /bookings/{id}`:
1. Set `status = 'cancelled'`
2. Set `cancelled_by = 'user'` (or 'operator', 'system' depending on actor)
3. Set `cancel_reason` (from request body)
4. Set `cancelled_at = CURRENT_TIMESTAMP`
5. Update box availability

## 3.5. Operator Endpoints

| API Endpoint | HTTP Method | Primary Tables | Query Pattern |
|--------------|-------------|----------------|---------------|
| `/operator/warehouses` | POST | warehouses | INSERT INTO warehouses WHERE operator_id = {current_operator} |
| `/operator/warehouses/{id}` | PUT | warehouses | UPDATE warehouses WHERE id = {id} AND operator_id = {current_operator} |
| `/operator/bookings` | GET | bookings | SELECT bookings WHERE warehouse.operator_id = {current_operator} |
| `/operator/bookings/{id}/confirm` | POST | bookings | UPDATE bookings SET status='confirmed', confirmed_at=NOW() |
| `/operator/bookings/{id}/reject` | POST | bookings | UPDATE bookings SET status='cancelled', cancelled_by='operator', cancel_reason=? |

## 3.6. CRM Endpoints

| API Endpoint | HTTP Method | Primary Tables | Query Pattern |
|--------------|-------------|----------------|---------------|
| `/crm/leads` | POST | crm_leads, crm_contacts, crm_activities | INSERT INTO crm_leads (status='new') |
| `/crm/leads` | GET | crm_leads, warehouses | SELECT crm_leads WHERE operator_id IN (...) |
| `/crm/leads/{id}/status` | PATCH | crm_leads, crm_status_history | BEGIN → UPDATE crm_leads → INSERT crm_status_history → COMMIT |
| `/crm/leads/{id}/activities` | GET | crm_activities, crm_activity_types | SELECT crm_activities WHERE lead_id = {id} |

**Critical: CRM Status Machine**

When updating lead status via `PATCH /crm/leads/{id}/status`:
1. Validate transition is allowed per CRM Spec (lead processing workflow only)
2. Update `crm_leads.status` to one of: `new`, `contacted`, `in_progress`, `closed`
3. Insert audit record in `crm_status_history`

**Important:** CRM status reflects lead processing only, not booking conversion. If a lead results in a booking, that booking has its own separate status lifecycle in the `bookings` table.

## 3.7. AI Endpoints

| API Endpoint | HTTP Method | Primary Tables | Query Pattern |
|--------------|-------------|----------------|---------------|
| `/ai/box-size-recommendation` | POST | ai_requests_log, boxes | INSERT INTO ai_requests_log → Call AI API → Return recommendations |

---

# 4. Indexes & Performance

## 4.1. Index Strategy

### Primary Keys (Automatic)
All tables have `id SERIAL PRIMARY KEY` with automatic index.

### Foreign Keys (Explicit)
All foreign key columns have explicit indexes for join performance:
```sql
CREATE INDEX idx_{table}_{fk_column} ON {table}({fk_column});
```

### Frequently Filtered Columns
- `status` fields (bookings, crm_leads, etc.)
- `role` (users)
- `is_active` (warehouses)
- `is_available` (boxes)
- `deleted_at` (for soft delete queries)

### Composite Indexes for Common Queries
- `idx_bookings_warehouse_status_created` — Operator dashboard queries
- `idx_boxes_warehouse_size` — Box availability queries
- `idx_media_warehouse_display_order` — Gallery sorting

### Geospatial Indexes
- `idx_warehouses_coordinates` — GIST index for PostGIS geospatial queries

### Partial Indexes
- `WHERE deleted_at IS NULL` — Active records only
- `WHERE is_available = TRUE` — Available boxes only
- `WHERE is_verified = TRUE` — Verified operators/reviews only

## 4.2. Query Optimization Patterns

### Warehouse Search with Geospatial Filter

```sql
-- Find warehouses within 10km radius
SELECT w.*, 
       ST_Distance(w.coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) / 1000 AS distance_km
FROM warehouses w
WHERE w.deleted_at IS NULL
  AND w.is_active = TRUE
  AND ST_DWithin(w.coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, 10000)
ORDER BY distance_km
LIMIT 20;
```

### Booking Creation with Row Locking

```sql
BEGIN;

-- Lock the box row to prevent double-booking
SELECT * FROM boxes 
WHERE id = ? 
  AND available_quantity > 0 
FOR UPDATE;

-- Create booking
INSERT INTO bookings (user_id, box_id, warehouse_id, ...) VALUES (...);

-- Update box availability
UPDATE boxes 
SET available_quantity = available_quantity - 1,
    reserved_quantity = reserved_quantity + 1,
    is_available = (available_quantity - 1 > 0)
WHERE id = ?;

COMMIT;
```

### CRM Lead Status Transition with Audit

```sql
BEGIN;

-- Update lead status
UPDATE crm_leads 
SET status = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Insert audit record
INSERT INTO crm_status_history (lead_id, old_status, new_status, changed_by_user_id, reason)
VALUES (?, ?, ?, ?, ?);

COMMIT;
```

---

# 5. Data Integrity & Constraints

## 5.1. Referential Integrity

### ON DELETE Behaviors

| Relationship | ON DELETE | Rationale |
|--------------|-----------|-----------|
| users → operators | CASCADE | Deleting user should delete operator profile |
| users → bookings | RESTRICT | Cannot delete user with active bookings |
| operators → warehouses | RESTRICT | Cannot delete operator with active warehouses |
| warehouses → boxes | CASCADE | Deleting warehouse deletes its boxes |
| warehouses → media | CASCADE | Deleting warehouse deletes its media |
| warehouses → bookings | RESTRICT | Cannot delete warehouse with active bookings |
| boxes → bookings | RESTRICT | Cannot delete box with active bookings |
| crm_leads → crm_activities | CASCADE | Deleting lead deletes its activities |

### CHECK Constraints

**Enums (CRITICAL — Must Match Canonical Specs):**

```sql
-- Bookings (CANONICAL)
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'expired'))
CHECK (cancelled_by IN ('user', 'operator', 'system'))

-- CRM Leads (CANONICAL)
CHECK (status IN ('new', 'contacted', 'in_progress', 'closed'))

-- Users
CHECK (role IN ('user', 'operator', 'admin'))

-- Boxes
CHECK (size IN ('S', 'M', 'L', 'XL'))

-- Reviews
CHECK (rating >= 1 AND rating <= 5)
```

**Value Ranges:**
```sql
-- Geospatial
CHECK (latitude >= -90 AND latitude <= 90)
CHECK (longitude >= -180 AND longitude <= 180)

-- Positive Values
CHECK (price_monthly > 0)
CHECK (duration_months > 0)
CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100)
```

**Date Logic:**
```sql
CHECK (end_date > start_date)
CHECK (expires_at > created_at)
```

**Conditional Logic:**
```sql
-- Cancelled bookings must have cancelled_by
CHECK (
  (status = 'cancelled' AND cancelled_by IS NOT NULL) OR
  (status != 'cancelled' AND cancelled_by IS NULL)
)

-- Box quantity invariant
CHECK (total_quantity = available_quantity + reserved_quantity + occupied_quantity)
```

## 5.2. UNIQUE Constraints

| Table | Constraint | Purpose |
|-------|------------|---------|
| users | UNIQUE (email) | One account per email |
| bookings | UNIQUE (booking_number) | Unique booking reference |
| reviews | UNIQUE (user_id, warehouse_id) | One review per user per warehouse |
| favorites | UNIQUE (user_id, warehouse_id) | One favorite per user per warehouse |
| operators | UNIQUE (user_id) | One operator profile per user |

---

# 6. Soft Delete Implementation

## 6.1. Tables with Soft Delete

The following tables implement soft delete via `deleted_at TIMESTAMP NULL`:

- users
- operators
- warehouses
- boxes
- bookings (optional but recommended)

## 6.2. Soft Delete Patterns

### Marking as Deleted

```sql
UPDATE users 
SET deleted_at = CURRENT_TIMESTAMP 
WHERE id = ?;
```

### Filtering Active Records

```sql
SELECT * FROM users 
WHERE deleted_at IS NULL;
```

### Restoring Deleted Records

```sql
UPDATE users 
SET deleted_at = NULL 
WHERE id = ?;
```

### Hard Delete (Permanent Removal)

```sql
-- Only for GDPR compliance or data retention policies
DELETE FROM users 
WHERE deleted_at IS NOT NULL 
  AND deleted_at < (CURRENT_TIMESTAMP - INTERVAL '30 days');
```

## 6.3. Partial Indexes for Performance

```sql
-- Index only active records
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_warehouses_active ON warehouses(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_boxes_active ON boxes(id) WHERE deleted_at IS NULL;
```

---

# 7. Triggers & Auto-Updates

## 7.1. updated_at Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Applied to Tables:**
- users
- operators
- operator_settings
- warehouses
- boxes
- bookings
- reviews
- media
- crm_leads
- crm_activities

**Usage:**
```sql
CREATE TRIGGER update_{table}_updated_at
  BEFORE UPDATE ON {table}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 7.2. Warehouse Coordinates Auto-Update

```sql
CREATE OR REPLACE FUNCTION update_warehouse_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.coordinates = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_warehouse_coordinates
  BEFORE INSERT OR UPDATE OF latitude, longitude ON warehouses
  FOR EACH ROW
  EXECUTE FUNCTION update_warehouse_coordinates();
```

## 7.3. Review Rating Denormalization (Future)

**Note:** In MVP, rating updates can be done via application code. Consider trigger-based denormalization in post-MVP for better performance.

---

# 8. Database Initialization

## 8.1. Extensions

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For full-text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- If migrating to UUIDs
```

## 8.2. Trigger Function Creation

```sql
-- Must be created before any table-specific triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_warehouse_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  NEW.coordinates = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 8.3. Seed Data

### CRM Activity Types

```sql
INSERT INTO crm_activity_types (name, description, icon) VALUES
  ('call', 'Phone call', 'phone'),
  ('email', 'Email communication', 'mail'),
  ('meeting', 'In-person meeting', 'users'),
  ('follow_up', 'General follow-up', 'clock')
ON CONFLICT (name) DO NOTHING;
```

### Admin User (Development/Staging Only)

```sql
-- DO NOT use in production
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES
  ('admin@selfstorage.local', '$2b$10$...', 'System Admin', 'admin', TRUE);
```

---

# 9. Migration Strategy

## 9.1. Migration Tools

**Recommended:** Prisma Migrate or TypeORM migrations

**Migration File Structure:**
```
migrations/
├── 001_init_users_operators.sql
├── 002_create_warehouses_boxes.sql
├── 003_create_bookings.sql
├── 004_create_crm_tables.sql
├── 005_create_logging_tables.sql
└── 006_create_indexes.sql
```

## 9.2. Migration Order

1. **Extensions** — Enable PostGIS, pg_trgm
2. **Trigger Functions** — Create reusable trigger functions
3. **Core Tables** — users, operators, operator_settings
4. **Warehouse Tables** — warehouses, boxes, media
5. **Booking Tables** — bookings, reviews, favorites
6. **CRM Tables** — crm_leads, crm_contacts, crm_activities, etc.
7. **Logging Tables** — ai_requests_log, events_log, geo_cache
8. **Indexes** — Create all performance indexes
9. **Triggers** — Apply triggers to tables
10. **Seed Data** — Insert reference data (crm_activity_types)

## 9.3. Rollback Strategy

Each migration must have a corresponding rollback script:
```
migrations/
├── 001_init_users_operators.sql
├── 001_init_users_operators_rollback.sql
└── ...
```

---

# 10. Security & Compliance

## 10.1. PII Fields (Personal Identifiable Information)

The following fields contain PII and must be handled according to **Security_and_Compliance_Plan_MVP_v1.md**:

**users table:**
- email
- name
- phone
- password_hash (hashed, but still sensitive)

**bookings table:**
- contact_name
- contact_phone
- contact_email

**crm_leads table:**
- name
- phone
- email

**Compliance Requirements:**
- Encryption at rest (database-level)
- Encryption in transit (TLS)
- Access control (role-based permissions)
- Audit logging for PII access
- GDPR right to erasure (soft delete + anonymization)

## 10.2. Password Storage

**Algorithm:** bcrypt with cost factor 10

**Storage:**
- users.password_hash stores bcrypt hash only
- Original passwords are NEVER stored
- Hash format: `$2b$10$...` (60 characters)

## 10.3. Token Storage

**Refresh Tokens:**
- Stored in `refresh_tokens` table
- Hashed before storage (optional but recommended)
- Expiration enforced at database level
- Revoked tokens marked with `revoked_at`

**Email Verification / Password Reset Tokens:**
- Stored in `users` table
- One-time use (cleared after use)
- Time-limited via `password_reset_expires`

---

# 11. Post-MVP / Future Data Model

This section documents tables and features that are **NOT part of MVP v1** but may be implemented in future versions.

## 11.1. Pricing History (v1.1+)

**Table: `prices` — EXCLUDED FROM MVP**

**Purpose:** Track price changes over time, enable dynamic pricing.

**Status:** 🔴 NOT IN MVP — Fixed pricing only in MVP

**Future Schema:**
```sql
CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  box_id INTEGER NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  price_per_month INTEGER NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_price CHECK (price_per_month > 0),
  CONSTRAINT chk_valid_dates CHECK (valid_until IS NULL OR valid_until > valid_from)
);
```

**Migration Path:**
- MVP uses `boxes.price_monthly` directly
- Post-MVP: Copy current prices to `prices` table
- Add price history tracking
- Implement time-based pricing queries

---

## 11.2. Attributes System (v1.1+)

**Tables: `attributes`, `warehouse_attributes` — EXCLUDED FROM MVP**

**Purpose:** Flexible attribute system (security, climate control, 24/7 access, etc.)

**Status:** 🔴 NOT IN MVP — Hardcoded attributes in MVP

**Future Schema:**
```sql
CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouse_attributes (
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (warehouse_id, attribute_id)
);
```

**Migration Path:**
- MVP: Attributes hardcoded in application code
- Post-MVP: Migrate to database-driven attribute system
- Backfill existing warehouses with standard attributes

---

## 11.3. Services System (v1.1+)

**Tables: `services`, `warehouse_services` — EXCLUDED FROM MVP**

**Purpose:** Additional services (delivery, packing, insurance, etc.)

**Status:** 🔴 NOT IN MVP — No services in MVP

**Future Schema:**
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  default_price INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouse_services (
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (warehouse_id, service_id),
  CONSTRAINT chk_price CHECK (price IS NULL OR price >= 0)
);
```

**Migration Path:**
- MVP: No additional services
- Post-MVP: Add services infrastructure
- Enable per-warehouse service pricing

---

## 11.4. Payments & Invoices (v1.2+)

**Tables: `payments`, `invoices` — EXCLUDED FROM MVP**

**Purpose:** Payment processing, invoice generation, refunds

**Status:** 🔴 NOT IN MVP — Manual payment tracking only

**Future Schema:**
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'RUB',
  payment_method VARCHAR(50),
  status VARCHAR(20) NOT NULL,
  provider_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_payment_status CHECK (
    status IN ('pending', 'completed', 'failed', 'refunded')
  )
);
```

---

## 11.5. Analytics & Reporting (v2+)

**Tables: `analytics_events`, `operator_metrics` — EXCLUDED FROM MVP**

**Purpose:** Business intelligence, operator dashboards, platform metrics

**Status:** 🔴 NOT IN MVP

**Future Implementation:**
- Separate analytics database
- ETL pipeline from operational DB
- Pre-aggregated metrics tables

---

## 11.6. Notifications (v1.1+)

**Table: `notifications` — EXCLUDED FROM MVP**

**Purpose:** In-app notification system

**Status:** 🔴 NOT IN MVP — Email-only in MVP

**Future Schema:**
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 12. Conclusion

## 12.1. Document Status

**Status:** 🟢 GREEN - CANONICAL - Ready for Implementation

**Alignment Verified:**
- ✅ Functional Specification MVP v1
- ✅ Technical Architecture CANONICAL
- ✅ API Blueprint CANONICAL
- ✅ Backend Implementation Plan
- ✅ CRM Spec CANONICAL
- ✅ Security & Compliance Plan
- ✅ API Rate Limiting Spec
- ✅ Error Handling Spec
- ✅ Logging Strategy
- ✅ Unified Data Dictionary

**Critical Fixes Applied:**
1. ✅ Removed non-MVP tables (prices, attributes, services)
2. ✅ Fixed booking statuses (5 canonical states)
3. ✅ Added cancellation semantics (cancelled_by, cancel_reason)
4. ✅ Fixed CRM lead statuses (6 canonical states)
5. ✅ Added comprehensive API mapping
6. ✅ Aligned logging tables with Logging Strategy
7. ✅ Standardized soft delete
8. ✅ Created Post-MVP section for future features

## 12.2. Implementation Checklist

- [ ] Create PostgreSQL database (PostgreSQL 15+)
- [ ] Enable PostGIS extension
- [ ] Enable pg_trgm extension
- [ ] Create trigger functions
- [ ] Execute migrations in order
- [ ] Create all indexes
- [ ] Apply all triggers
- [ ] Insert seed data (crm_activity_types)
- [ ] Set up backup strategy
- [ ] Configure connection pooling
- [ ] Set up monitoring
- [ ] Load test critical queries
- [ ] Verify all constraints
- [ ] Test soft delete behavior
- [ ] Verify referential integrity

## 12.3. Next Steps

1. **Backend Team:** Implement Prisma/TypeORM schema from this specification
2. **DevOps Team:** Set up PostgreSQL with PostGIS in all environments
3. **QA Team:** Write integration tests for database layer
4. **Security Team:** Review PII handling and encryption
5. **Documentation Team:** Update API docs with database field mappings

---

**Document Version:** 2.0 - CANONICAL  
**Last Updated:** December 15, 2025  
**Maintained By:** Database Architecture Team  
**Ready for Implementation:** ✅ Yes

---

**END OF DOCUMENT**
