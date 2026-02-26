# Data Migration & ETL Plan (MVP v1)

**Document ID:** DOC-035  
**Project:** Self-Storage Aggregator  
**Version:** 1.1 (MVP-Hardened)  
**Date:** December 2024  
**Status:** Final  
**Audience:** Backend Engineers, DevOps Engineers, Database Administrators

---

## Document Role & Scope

**Document Type:** Supporting / Operational Plan  
**Phase:** MVP v1 Only  
**Migration Approach:** Manual-First, Operator-Triggered  

### Critical Constraints

This document describes a **minimal, manual-first migration approach** for MVP v1. Key characteristics:

- **No automated ETL pipelines** - all data operations are manual or operator-triggered
- **No production-grade orchestration** - no Airflow, no scheduled jobs, no continuous sync
- **Ad-hoc data operations** - migrations and data loads are one-off, manually executed
- **Best-effort guarantees** - no SLAs, no mandatory success metrics
- **Operator validation** - manual verification replaces automated test suites

### What This Document Is NOT

- ❌ NOT a production ETL system specification
- ❌ NOT a continuous data synchronization plan
- ❌ NOT a zero-downtime migration strategy
- ❌ NOT an enterprise data platform design

### What This Document IS

- ✅ Operational guidance for schema evolution
- ✅ Manual procedures for data migration
- ✅ Best practices for database changes
- ✅ Reference for team coordination

### Alignment with Other Documents

- **DOC-020 (Audit Logging)** - Migration events logged via central audit system
- **DOC-039 (Deployment Runbook)** - Migration execution follows deployment procedures
- **DOC-042 (DR & Backup)** - Backup/restore references DR plan, no duplication

---

## Table of Contents

1. [Migration Overview](#1-migration-overview)
2. [Data Sources & Targets](#2-data-sources--targets)
3. [Database Schema Migrations](#3-database-schema-migrations)
4. [Environment Migration Process](#4-environment-migration-process)
5. [MVP Data Operations (Manual)](#5-mvp-data-operations-manual)
6. [Data Validation & Quality Control](#6-data-validation--quality-control)
7. [Migration Execution Plan](#7-migration-execution-plan)
8. [Rollback & Recovery](#8-rollback--recovery)
9. [Testing Strategy](#9-testing-strategy)
10. [Operational Guidelines](#10-operational-guidelines)
11. [Out of Scope / Post-MVP](#11-out-of-scope--post-mvp)

---

# 1. Migration Overview

## 1.1. Goals of Data Migration for MVP

The data migration strategy for the Self-Storage Aggregator MVP focuses on establishing a simple, repeatable process for evolving the database schema and managing data throughout the application lifecycle.

### Primary Goals

**Schema Evolution Management**
- Provide version-controlled database schema changes
- Enable manual deployment of database updates across environments
- Support rollback capabilities for failed migrations
- Maintain reasonable backward compatibility

**Data Integrity Preservation**
- Preserve referential integrity across entities where practical
- Maintain data consistency during schema changes
- Minimize risk of data loss during migration operations
- Enable operator validation of data quality post-migration

**Environment Consistency**
- Keep database schemas synchronized across local, dev, staging, and production
- Enable reproducible database states for testing
- Support manual deployment procedures
- Facilitate developer onboarding with consistent local environments

**Operational Safety**
- Implement safeguards against accidental data loss
- Provide clear rollback procedures
- Enable migration testing before production deployment
- Maintain operational notes for schema changes (via DOC-020 audit logging)

### Success Criteria (Best-Effort)

The following are **aspirational targets**, not guaranteed SLAs:

| Criterion | Target (Best-Effort) | Notes |
|-----------|----------------------|-------|
| Migration Success | High success rate | Manual testing and validation required |
| Schema Consistency | Environments match | Verified through manual checks |
| Migration Duration | Reasonable time | Depends on complexity; no hard limit |
| Rollback Capability | Manual rollback available | Operator-executed, not automated |
| Data Preservation | Minimize data loss | Best-effort through backups and validation |

**Important:** These are operational goals, not contractual guarantees. MVP prioritizes simplicity over automation.

## 1.2. Scope (MVP Entities Only)

The MVP migration scope is strictly limited to the core entities defined in the Technical Architecture Document. No additional tables, services, or ETL platforms will be added beyond this specification.

### Core Entities in Scope

**User Management**
- `users` - All platform users (customers, operators, admins)
- `operators` - Extended operator information
- User authentication and authorization data

**Warehouse Management**
- `warehouses` - Storage facility information
- `boxes` - Individual storage units within warehouses
- `warehouse_attributes` - Junction table for warehouse features
- `warehouse_services` - Junction table for warehouse services
- `attributes` - Reference table for warehouse features
- `services` - Reference table for additional services

**Booking System**
- `bookings` - Rental requests and active rentals
- Booking status transitions and lifecycle management

**Review System**
- `reviews` - User reviews and ratings
- Operator responses to reviews

**Supporting Tables**
- `notifications` - In-app and external notifications
- `ai_logs` - AI feature usage tracking
- `geo_cache` - Geocoding results cache

### Explicitly Out of MVP Scope

The following are **NOT** included in MVP migrations:

- Payment processing tables (future phase)
- Advanced analytics and reporting tables
- Message/chat system tables
- Document management system
- External system integration tables
- Data warehouse structures
- Automated ETL pipelines or orchestration
- Continuous data synchronization
- Multi-region data replication

### Expected Data Volumes (First 6 Months)

| Entity | Expected Records | Growth Rate |
|--------|-----------------|-------------|
| users | 400-800 | ~130/month |
| operators | 50-100 | ~15/month |
| warehouses | 60-150 | ~20/month |
| boxes | 600-1500 | ~150/month |
| bookings | 200-400 | ~65/month |
| reviews | 50-150 | ~20/month |

These volumes are within manual management capabilities for MVP.

## 1.3. Risks and Limitations

### Technical Risks

**Schema Migration Risks**

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Failed production migration | High | Low | Manual staging testing, backup before migration |
| Data loss during migration | Critical | Very Low | Manual backups, rollback procedures |
| Downtime during migration | Medium | Medium | Execute during low-traffic windows |
| Migration script bugs | Medium | Low | Peer review, manual testing in staging |
| Schema drift between environments | Medium | Medium | Manual schema validation |

**Performance Risks**

- **Large table alterations**: Adding columns to tables with >100K rows may cause locks
  - *Mitigation*: Execute during maintenance windows, accept brief downtime
  
- **Index creation impact**: Creating indexes on large tables can block writes
  - *Mitigation*: Use `CONCURRENTLY` option for PostgreSQL indexes
  
- **PostGIS operations**: Geospatial index creation can be slow
  - *Mitigation*: Create spatial indexes separately with appropriate parameters

**Data Quality Risks**

- **Invalid data in production**: Existing data may not meet new constraints
  - *Mitigation*: Manual pre-migration data validation
  
- **Encoding issues**: Text data may contain invalid UTF-8
  - *Mitigation*: Manual data sanitization before constraints
  
- **Orphaned records**: Foreign key violations from inconsistent data
  - *Mitigation*: Manual cleanup before adding constraints

### MVP Limitations

**No Automated ETL**

For MVP, there are **NO dedicated ETL platforms or automated pipelines**:
- Initial data loading is **manual** or via **simple ad-hoc scripts**
- No automated data ingestion from external sources
- No scheduled data synchronization jobs
- No continuous integration with external systems
- Operator data entry is the primary data source

**No Advanced Infrastructure**

- **No blue-green deployments**: Migrations run directly on production database
- **No multi-region support**: Single database instance only
- **No sharding**: All data in single PostgreSQL instance
- **No read replicas**: Direct queries to primary database only
- **No zero-downtime migrations**: Brief maintenance windows acceptable

**Operational Constraints**

- Expected downtime for production migration: **Variable** (typically < 10 minutes)
- Database size limit for MVP: **10 GB**
- Concurrent users during migration: **0** (maintenance mode required)
- Backup retention: **30 days** (automated daily backups per DOC-042)

### Acceptance of Trade-offs

For MVP phase, we accept the following limitations:

- Brief maintenance windows for migrations
- Manual approval and execution required for production migrations
- No zero-downtime guarantees for structural changes
- Manual rollback procedures (not automated)
- Best-effort data validation (not comprehensive)
- Operator-driven quality control

These limitations are acceptable for MVP scale (< 1000 active users, < 150 warehouses) and will be addressed in post-MVP phases as the platform scales.

---

# 2. Data Sources & Targets

## 2.1. Data Sources (if applicable)

For the Self-Storage Aggregator MVP, the primary data sources are **user-generated** rather than external systems. This section outlines the data origin points.

### Primary Data Sources

**Operator Manual Entry**
- **Source Type**: Web application forms
- **Data Entities**: Warehouses, boxes, services, attributes
- **Validation**: Frontend + backend validation using Zod schemas
- **Format**: JSON payloads via REST API
- **Quality Control**: Required field validation, type checking, business rule validation

**User Registration**
- **Source Type**: Registration forms (users and operators)
- **Data Entities**: Users, operators
- **Authentication**: Email verification required
- **Format**: JSON via REST API
- **Security**: Password hashing with bcrypt, token-based verification

**Booking Requests**
- **Source Type**: Booking forms
- **Data Entities**: Bookings
- **Validation**: Date validation, price calculation, availability checks
- **Format**: JSON via REST API
- **Business Rules**: Automated pricing based on duration, warehouse rules

**Review Submissions**
- **Source Type**: Review forms
- **Data Entities**: Reviews
- **Validation**: Text content validation, rating validation
- **Format**: JSON via REST API
- **Moderation**: Manual review by operators if needed

### External Data Sources (MVP Limited)

**Geocoding Services**
- **Source**: Google Maps Geocoding API
- **Usage**: Address → Coordinates conversion
- **Caching**: Results stored in `geo_cache` table
- **Frequency**: On-demand, cached for 90 days
- **Format**: JSON responses converted to PostGIS geometry

**AI Services**
- **Source**: OpenAI API (GPT models)
- **Usage**: Description enhancement, customer support
- **Logging**: Tracked in `ai_logs` table
- **Format**: JSON requests/responses
- **Note**: Not a data migration source, operational logging only

### No Bulk Import in MVP

For MVP, there is **no bulk import** from:
- Partner systems (future phase)
- Legacy databases (not applicable)
- CSV/Excel files (manual data entry preferred)
- External aggregators (not in scope)

All data originates from user interactions within the platform.

## 2.2. Target Storage (PostgreSQL MVP Schema)

### Database Configuration

**Database Engine:** PostgreSQL 14+  
**Extensions Required:**
- PostGIS (for geospatial data)
- pgcrypto (for UUID generation)

**Schema Name:** public (default)  
**Character Encoding:** UTF-8  
**Timezone:** UTC (all timestamps)

### Core Tables (from Database Specification)

The target schema includes all entities defined in `full_database_specification_mvp_v1.md`:

- User management tables: `users`, `operators`
- Warehouse tables: `warehouses`, `boxes`, `warehouse_attributes`, `warehouse_services`
- Reference tables: `attributes`, `services`
- Transaction tables: `bookings`, `reviews`
- Support tables: `notifications`, `ai_logs`, `geo_cache`

**Critical:** No additional tables will be created in MVP beyond those specified in the database specification.

## 2.3. Data Types and Formats

### Standard Data Types

| Category | PostgreSQL Type | Format | Example |
|----------|----------------|--------|---------|
| IDs | UUID | UUID v4 | `550e8400-e29b-41d4-a716-446655440000` |
| Strings | VARCHAR, TEXT | UTF-8 | `"Self Storage Moscow"` |
| Numbers | INTEGER, DECIMAL | Numeric | `42`, `99.99` |
| Booleans | BOOLEAN | true/false | `true` |
| Dates | TIMESTAMP | ISO 8601 | `2024-12-17T10:30:00Z` |
| Geospatial | GEOMETRY(Point, 4326) | WGS84 | `POINT(37.6156 55.7522)` |
| JSON | JSONB | Valid JSON | `{"key": "value"}` |
| Enums | Custom ENUM types | String | `'pending'`, `'confirmed'` |

### Enum Types (from Database Specification)

All enum types are defined in the database specification and must not be modified:

- `booking_status`: pending, confirmed, checked_in, active, completed, cancelled, expired
- `user_role`: customer, operator, admin
- `notification_type`: booking_created, booking_confirmed, etc.
- `notification_channel`: email, sms, push, in_app
- `ai_feature`: description_enhancement, customer_support, review_summary

## 2.4. Input Data Quality Requirements

### Manual Validation Requirements

Since MVP relies on manual data entry, the following quality controls apply:

**Required Field Validation**
- All fields marked `NOT NULL` must have values
- Frontend forms enforce required fields
- Backend validates presence before database insertion

**Type Validation**
- Data types validated via Zod schemas
- Email addresses validated via regex
- Phone numbers validated via libphonenumber
- URLs validated via URL parsing

**Business Rule Validation**
- Prices must be positive
- Dates must be in valid ranges
- Coordinates must be within valid bounds
- Enums must match allowed values

**Character Encoding**
- All text data must be valid UTF-8
- Invalid characters rejected at API layer
- Sanitization for SQL injection prevention

### Data Quality Acceptance Criteria

For MVP, we accept:
- **Manual verification** of data correctness (no automated DQ pipelines)
- **Operator responsibility** for data accuracy
- **Best-effort** validation at entry points
- **Reactive correction** of data quality issues

Comprehensive data quality monitoring is out of scope for MVP (see Section 11).

---

# 3. Database Schema Migrations

## 3.1. Migration Tool (Prisma)

**Primary Tool:** Prisma Migrate  
**Version:** Prisma 5.x+  
**Migration Format:** SQL files with metadata  

### Why Prisma Migrate

- **Schema-first**: Driven by `prisma/schema.prisma` file
- **Version control**: Migrations stored in Git
- **Automatic generation**: SQL generated from schema changes
- **Cross-environment**: Same tool for local, dev, staging, production
- **Rollback support**: Can revert migrations manually

### Prisma Configuration

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 3.2. Versioning Rules

### Migration Naming Convention

Format: `YYYYMMDDHHMMSS_descriptive_name`

Examples:
- `20241217120000_create_users_table`
- `20241218093000_add_warehouse_coordinates`
- `20241220150000_add_booking_status_index`

### Version Control

- All migrations stored in `prisma/migrations/` directory
- Each migration is a separate folder with `migration.sql` file
- Committed to Git before deployment
- Never modify existing migrations after deployment

## 3.3. Migration Principles (MVP-Appropriate)

### Manual-First Approach

1. **Developer creates migration** locally using Prisma CLI
2. **Manual review** of generated SQL (no auto-merge)
3. **Manual testing** in local environment
4. **Peer review** via pull request
5. **Manual deployment** to each environment
6. **Manual validation** after deployment

### Backward Compatibility (Best-Effort)

- Prefer additive changes (new columns, new tables)
- Avoid destructive changes when possible
- Use nullable columns for additions
- Migrate data before adding constraints
- Document breaking changes clearly

**Note:** Zero-downtime migrations are NOT guaranteed in MVP. Brief maintenance windows are acceptable.

## 3.4. Roll-forward/Roll-back Capability

### Roll-forward (Applying Migrations)

Migrations are applied sequentially in order:

```bash
# Deploy all pending migrations
npx prisma migrate deploy
```

### Roll-back (Manual)

Prisma Migrate does not have automatic rollback. Manual rollback required:

1. Identify the migration to revert
2. Write reverse SQL manually
3. Execute reverse SQL against database
4. Update migration history manually

**Example:**

```sql
-- If migration added a column
ALTER TABLE warehouses DROP COLUMN IF EXISTS new_column;

-- If migration created a table
DROP TABLE IF EXISTS new_table CASCADE;
```

**Important:** Rollback is **manual**, **operator-triggered**, and **best-effort**. Test rollback procedures in staging before production.

## 3.5. Migration Structure Examples

### Example 1: Adding a Column

```sql
-- Add column with default value
ALTER TABLE warehouses 
ADD COLUMN verification_status VARCHAR(50) DEFAULT 'unverified';

-- Add index
CREATE INDEX idx_warehouses_verification ON warehouses(verification_status);
```

### Example 2: Creating a Table

```sql
-- Create new table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index
CREATE INDEX idx_services_name ON services(name);
```

### Example 3: Adding Foreign Key

```sql
-- First add column without constraint
ALTER TABLE bookings ADD COLUMN operator_id UUID;

-- Update existing rows if needed (manual data migration)
-- UPDATE bookings SET operator_id = ... WHERE ...;

-- Then add constraint
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_operator 
FOREIGN KEY (operator_id) REFERENCES operators(id);
```

---

# 4. Environment Migration Process

## 4.1. Local Migrations

**Developer workflow:**

```bash
# Create a new migration
npx prisma migrate dev --name add_warehouse_rating

# Prisma will:
# 1. Generate migration SQL
# 2. Apply to local database
# 3. Regenerate Prisma Client
```

**Manual verification:**
- Check migration SQL for correctness
- Test application functionality locally
- Verify data integrity after migration

## 4.2. Dev Migrations

**Deployment to dev environment:**

```bash
# Connect to dev database
export DATABASE_URL="postgresql://dev-db-connection"

# Deploy pending migrations
npx prisma migrate deploy

# Verify deployment
npx prisma migrate status
```

**Manual checks:**
- Application starts successfully
- No database errors in logs
- Basic smoke tests pass

## 4.3. Staging Migrations

**Pre-production testing:**

1. Deploy to staging environment
2. Run manual integration tests
3. Verify data integrity
4. Test rollback procedure (if applicable)
5. Document any issues

```bash
# Staging deployment
export DATABASE_URL="postgresql://staging-db-connection"
npx prisma migrate deploy

# Manual validation
npm run test:integration
npm run check:data-integrity
```

## 4.4. Production Migrations (Manual Approval)

**Production migration process:**

1. **Schedule maintenance window** (off-peak hours)
2. **Create backup** (per DOC-042 procedures)
3. **Enable maintenance mode**
4. **Deploy migration** manually
5. **Validate deployment** manually
6. **Disable maintenance mode**
7. **Monitor application** for issues

```bash
# Production migration (manual execution)
export DATABASE_URL="postgresql://prod-db-connection"

# Verify backup exists
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Deploy
npx prisma migrate deploy

# Validate
npx prisma migrate status
npm run check:data-integrity
```

**Important:** Production migrations require explicit approval from tech lead and are executed manually by DevOps.

## 4.5. Migration Execution Policy (Manual)

### Migration Execution Rules

1. **No automatic migrations** in production
2. **Manual review** required for all migrations
3. **Staging testing** mandatory before production
4. **Backup creation** mandatory before production migration
5. **Maintenance window** required for structural changes
6. **Post-deployment validation** required

### Approval Requirements

| Environment | Approval Required | Backup Required |
|-------------|-------------------|-----------------|
| Local | None | No |
| Dev | Developer | No |
| Staging | Tech Lead | Recommended |
| Production | Tech Lead + DevOps | **Mandatory** |

---

# 5. MVP Data Operations (Manual)

## 5.1. Data Operations Scope for MVP

For MVP, data operations are **limited, manual, and ad-hoc**. This section replaces traditional "ETL Pipeline" specifications with realistic MVP capabilities.

### What MVP Supports

**Manual Data Loading**
- One-off data imports via scripts
- Operator-triggered data updates
- Manual data corrections
- Ad-hoc data exports for analysis

**Not Automated, Not Scheduled**
- No cron jobs for data synchronization
- No automated data pipelines
- No incremental sync mechanisms
- No continuous integration with external systems

### Critical Limitation

> **There is NO ETL pipeline in MVP.** All data operations are manual, operator-triggered, and performed on an as-needed basis.

## 5.2. Manual Data Loading Procedures

### Ad-hoc Data Import (If Needed)

If manual data import is required (rare in MVP):

```bash
# Example: Import reference data from CSV
npm run script:import-attributes -- --file attributes.csv

# Example: Import initial warehouse data
npm run script:import-warehouses -- --file warehouses.json
```

**Process:**
1. Developer writes custom import script
2. Script validated in local environment
3. Script tested in staging with sample data
4. Script executed manually in production
5. Operator validates imported data

### Manual Data Corrections

For data corrections:

```sql
-- Example: Fix incorrect warehouse address
UPDATE warehouses 
SET address = 'Corrected Address'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Example: Update booking status
UPDATE bookings 
SET status = 'cancelled', updated_at = NOW()
WHERE id = '...' AND status = 'pending';
```

**Important:** Manual SQL updates should be:
- Peer-reviewed before execution
- Tested in staging first
- Logged in operational notes (DOC-020)
- Documented in runbook (DOC-039)

## 5.3. Data Export (Ad-hoc)

### Manual Data Exports

For analytics or reporting:

```bash
# Export all warehouses to CSV
psql $DATABASE_URL -c "COPY (SELECT * FROM warehouses) TO STDOUT WITH CSV HEADER" > warehouses.csv

# Export bookings for specific period
psql $DATABASE_URL -c "COPY (SELECT * FROM bookings WHERE created_at > '2024-01-01') TO STDOUT WITH CSV HEADER" > bookings.csv
```

**Use cases:**
- Manual analysis in spreadsheets
- Reporting to stakeholders
- Data audits
- Backup validation

## 5.4. External Data Integration (Minimal)

### Geocoding Results (Operational Only)

- **Source:** Google Maps Geocoding API
- **Method:** Real-time API calls on-demand
- **Caching:** Results cached in `geo_cache` table
- **Frequency:** On-demand (not batch)
- **No ETL:** Direct API integration, not a data pipeline

### AI Service Logging (Operational Only)

- **Source:** OpenAI API usage
- **Method:** Real-time logging after each API call
- **Storage:** `ai_logs` table
- **Purpose:** Usage tracking, not data integration
- **No ETL:** Operational logging, not a data pipeline

## 5.5. MVP Limitations (Reiterated)

**What MVP Does NOT Have:**

- ❌ Automated ETL orchestration (Airflow, Prefect, etc.)
- ❌ Scheduled data synchronization
- ❌ Incremental data updates
- ❌ Change data capture (CDC)
- ❌ Data streaming pipelines
- ❌ Bulk partner integrations
- ❌ Continuous external data ingestion
- ❌ Data warehouse loading
- ❌ Complex transformation workflows

**What MVP Has:**

- ✅ Manual data entry via web interface
- ✅ Ad-hoc scripts for one-off imports (if needed)
- ✅ Manual SQL for data corrections
- ✅ Simple data exports for analysis
- ✅ On-demand API integrations (geocoding, AI)

---

# 6. Data Validation & Quality Control

## 6.1. Validation Types (Manual)

### Entry-Point Validation

**API Layer Validation**
- Zod schema validation for all incoming requests
- Type checking, required field validation
- Business rule validation (prices, dates, etc.)
- Rejected requests return 400 Bad Request

**Frontend Validation**
- Form validation before submission
- Real-time feedback to users
- Client-side type checking
- Prevents invalid data entry

### Database-Level Validation

**Constraints**
- NOT NULL constraints for required fields
- UNIQUE constraints for unique identifiers
- CHECK constraints for value ranges
- Foreign key constraints for referential integrity

**Data Types**
- PostgreSQL enforces type correctness
- Invalid types rejected at insertion
- Type coercion for compatible types

## 6.2. Integrity Checks (Best-Effort)

### Manual Integrity Validation

After major migrations or data operations:

```sql
-- Check for orphaned bookings
SELECT COUNT(*) FROM bookings b
LEFT JOIN warehouses w ON b.warehouse_id = w.id
WHERE w.id IS NULL;

-- Check for orphaned boxes
SELECT COUNT(*) FROM boxes b
LEFT JOIN warehouses w ON b.warehouse_id = w.id
WHERE w.id IS NULL;

-- Check for invalid enum values
SELECT status, COUNT(*) FROM bookings
GROUP BY status;
```

**Process:**
- Run checks manually after migrations
- Document results in operational notes
- Fix issues via manual SQL updates if needed

## 6.3. Uniqueness Checks

### Database Constraints

Primary keys and unique indexes enforce uniqueness:

```sql
-- Unique constraints (from database specification)
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_operators_user_id ON operators(user_id);
```

### Application-Level Checks

- Email uniqueness checked before registration
- Warehouse name uniqueness within operator
- Box number uniqueness within warehouse

## 6.4. PII Data Correctness Control

### PII Fields

PII fields in the system (from database specification):
- `users.email`
- `users.phone_number`
- `users.full_name`
- `operators.company_name`
- `warehouses.address`

### PII Validation

**Format Validation:**
- Emails validated via regex and DNS lookup (optional)
- Phone numbers validated via libphonenumber
- Names validated for reasonable length and characters

**Privacy Controls:**
- PII fields logged with masking (per DOC-020)
- Access to PII limited by role-based access control
- PII retention per data retention policy

**Note:** Comprehensive PII scanning and automated compliance checks are out of scope for MVP.

## 6.5. Post-Migration Validation (Manual)

### Manual Validation Checklist

After each migration:

```markdown
# Post-Migration Validation

- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] All tables present (`\dt` in psql)
- [ ] All indexes present (`\di` in psql)
- [ ] Sample queries execute successfully
- [ ] Foreign keys intact (manual check)
- [ ] Enum values valid (manual check)
- [ ] Basic smoke tests pass
```

**Process:**
1. Execute validation checklist manually
2. Document results in operational notes
3. Escalate issues to tech lead if validation fails
4. Consider rollback if critical issues found

---

# 7. Migration Execution Plan

## 7.1. Data Preparation (If Needed)

For migrations requiring data transformation:

### Manual Data Preparation Steps

1. **Assess impact**: Identify affected records
2. **Write preparation script**: SQL or application code
3. **Test in staging**: Verify script correctness
4. **Document steps**: Add to runbook
5. **Execute in production**: During maintenance window

**Example: Adding NOT NULL constraint**

```sql
-- Step 1: Add column as nullable
ALTER TABLE warehouses ADD COLUMN verification_status VARCHAR(50);

-- Step 2: Update existing rows (manual)
UPDATE warehouses SET verification_status = 'unverified' WHERE verification_status IS NULL;

-- Step 3: Add constraint
ALTER TABLE warehouses ALTER COLUMN verification_status SET NOT NULL;
```

## 7.2. Dry-run Migration (Staging)

### Staging Validation Process

Before production deployment:

1. **Deploy to staging** using production-like data
2. **Run application** and verify functionality
3. **Execute test scenarios** manually
4. **Monitor performance** (check for slow queries)
5. **Test rollback** (if applicable)
6. **Document issues** and fix before production

**Staging checklist:**

```markdown
# Staging Migration Checklist

- [ ] Migration deployed successfully
- [ ] Application starts without errors
- [ ] User registration works
- [ ] Warehouse creation works
- [ ] Booking flow works
- [ ] Review submission works
- [ ] API responses correct
- [ ] No error logs
```

## 7.3. Migration Execution (Production)

### Production Execution Steps

```markdown
# Production Migration Procedure

## Pre-Execution
1. [ ] Schedule maintenance window (e.g., 2 AM - 3 AM UTC)
2. [ ] Notify users via email/notification
3. [ ] Create database backup (per DOC-042)
4. [ ] Verify backup integrity

## Execution
5. [ ] Enable maintenance mode (application down)
6. [ ] Connect to production database
7. [ ] Run migration: `npx prisma migrate deploy`
8. [ ] Verify migration status
9. [ ] Run integrity checks
10. [ ] Restart application
11. [ ] Disable maintenance mode

## Post-Execution
12. [ ] Verify application health
13. [ ] Monitor error logs (10-15 minutes)
14. [ ] Test critical user flows
15. [ ] Document completion in operational log (DOC-020)
```

## 7.4. Monitoring and Control (Manual)

### Post-Migration Monitoring

After migration deployment:

**Immediate Checks (First 15 minutes):**
- Application error rate (check logs)
- Database connection pool status
- Response time for critical endpoints
- User-reported issues (support channels)

**Extended Monitoring (First 24 hours):**
- Monitor error rates in application logs
- Check for unexpected database queries
- Verify data consistency via spot checks
- Monitor user feedback

**Tools:**
- Application logs (stdout/stderr)
- PostgreSQL logs
- Basic health check endpoints
- Manual user testing

**Note:** Advanced monitoring dashboards and automated alerts are out of scope for MVP.

## 7.5. Acceptance Criteria for Successful Migration (Best-Effort)

### Success Criteria

A migration is considered successful if:

- ✅ Application starts without errors
- ✅ Database schema matches expected state
- ✅ Critical user flows work (registration, booking, etc.)
- ✅ No immediate error spikes in logs
- ✅ Manual spot checks show data integrity
- ✅ Rollback not required within first hour

### Failure Criteria

A migration is considered failed if:

- ❌ Application fails to start
- ❌ Database errors on startup
- ❌ Critical user flows broken
- ❌ Data loss detected
- ❌ Severe performance degradation

**If migration fails:** Execute rollback procedure (Section 8) and investigate issues in staging.

---

# 8. Rollback & Recovery

## 8.1. How Migration Rollback Works (Manual)

### Rollback Procedure

Prisma Migrate does not provide automatic rollback. All rollbacks are **manual** and **operator-executed**.

**Rollback Steps:**

1. **Enable maintenance mode** (take application offline)
2. **Identify migration to revert** (check migration history)
3. **Write reverse SQL** (undo migration changes)
4. **Execute reverse SQL** against database
5. **Verify rollback** (check schema and data)
6. **Restart application** with previous code version
7. **Disable maintenance mode**

### Example Rollback SQL

```sql
-- Rollback: Adding a column
ALTER TABLE warehouses DROP COLUMN IF EXISTS new_column CASCADE;

-- Rollback: Creating a table
DROP TABLE IF EXISTS new_table CASCADE;

-- Rollback: Adding a foreign key
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_bookings_operator;

-- Rollback: Adding an index
DROP INDEX IF EXISTS idx_warehouses_verification;
```

### Rollback Time Expectations

- **Simple rollbacks** (drop column, drop index): < 5 minutes
- **Complex rollbacks** (drop table with data): 5-15 minutes
- **Data restoration** (from backup): 15-60 minutes (depends on database size)

**Important:** Rollback times are **estimates**, not guarantees. Test rollback procedures in staging.

## 8.2. Data Recovery from Backups

### Backup-Based Recovery

For recovery from backups, follow procedures in **DOC-042 (Disaster Recovery & Backup Plan)**.

**Summary:**
- Daily automated backups retained for 30 days
- Manual pre-migration backups created before production migrations
- Recovery time depends on database size (typically 15-60 minutes for MVP scale)

**Recovery process (reference DOC-042):**

```bash
# Restore from backup (example)
gunzip < backup_20241217_020000.sql.gz | psql $DATABASE_URL
```

**Important:** This document does NOT duplicate backup/restore procedures. See DOC-042 for full details.

## 8.3. Migration Safety Policy (Best-Effort)

### Safety Guidelines

1. **Test in staging first** - Never deploy untested migrations
2. **Create backup before migration** - Always have rollback option
3. **Execute during low-traffic windows** - Minimize user impact
4. **Have rollback SQL ready** - Prepare reverse migration in advance
5. **Monitor after deployment** - Watch for issues in first hour
6. **Document everything** - Log all migration activities

### Risk Mitigation

- **Additive changes preferred**: Less risky than deletions
- **Nullable columns first**: Add constraint later after data migration
- **Foreign keys last**: Add after data is consistent
- **Test rollback**: Verify rollback works in staging

## 8.4. Recovery Checklist

```markdown
# Migration Failure Recovery Checklist

## Immediate Actions
- [ ] Enable maintenance mode
- [ ] Stop application to prevent further issues
- [ ] Assess severity (data loss? schema corruption?)

## Decision Point
- [ ] Is rollback viable? (Yes → Continue, No → Restore from backup)

## Rollback Path
- [ ] Execute reverse SQL
- [ ] Verify schema reverted
- [ ] Verify data integrity
- [ ] Restart application (previous version)
- [ ] Test critical flows

## Backup Restoration Path (if rollback not viable)
- [ ] Follow DOC-042 backup restoration procedures
- [ ] Verify data integrity after restore
- [ ] Restart application
- [ ] Test critical flows

## Post-Recovery
- [ ] Disable maintenance mode
- [ ] Notify users of resolution
- [ ] Document incident in operational log (DOC-020)
- [ ] Post-mortem: Identify root cause
```

---

# 9. Testing Strategy

## 9.1. Testing Approach for MVP (Manual)

For MVP, testing is **manual, operator-driven, and best-effort**. No mandatory automated test suites for migrations.

### Testing Types

**Manual Testing**
- Developer tests migration locally
- Developer tests migration in dev environment
- QA/tech lead tests in staging
- DevOps validates in production (smoke tests)

**No Automated Migration Tests**
- No unit tests for migration SQL
- No integration test suites for schema changes
- No performance benchmarks
- No load testing

**Rationale:** Automated migration testing is complex and out of scope for MVP. Manual validation is sufficient for MVP scale.

## 9.2. Manual Validation Steps

### Local Validation

```bash
# Apply migration locally
npx prisma migrate dev --name my_migration

# Manual checks:
# 1. Application starts
npm run dev

# 2. Prisma Client regenerated correctly
# 3. No TypeScript errors
npm run typecheck

# 4. Basic functionality works (manual testing)
```

### Staging Validation

```bash
# Deploy to staging
npx prisma migrate deploy

# Manual checks:
# 1. Application starts
# 2. API endpoints respond
# 3. Database queries work
# 4. No errors in logs
tail -f /var/log/application.log
```

## 9.3. Smoke Tests (Manual)

### Post-Migration Smoke Tests

After production migration, manually test critical flows:

```markdown
# Smoke Test Checklist

## User Flows
- [ ] User registration
- [ ] User login
- [ ] User profile view

## Warehouse Flows
- [ ] List warehouses
- [ ] View warehouse details
- [ ] Search warehouses

## Booking Flows
- [ ] Create booking request
- [ ] View booking status
- [ ] Cancel booking

## Review Flows
- [ ] Submit review
- [ ] View reviews

## Admin Flows
- [ ] Operator dashboard loads
- [ ] Warehouse management works
```

## 9.4. Schema Validation (Manual)

### Manual Schema Checks

```sql
-- Check tables exist
\dt

-- Check columns exist
\d warehouses

-- Check indexes exist
\di

-- Check constraints exist
\d+ warehouses

-- Check foreign keys
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint
WHERE contype = 'f';
```

## 9.5. Post-Migration Data Validation (Best-Effort)

### Manual Data Checks

```sql
-- Check record counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM warehouses;
SELECT COUNT(*) FROM bookings;

-- Check for NULLs in NOT NULL columns
SELECT * FROM warehouses WHERE address IS NULL LIMIT 10;

-- Check for invalid enum values
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Check foreign key integrity
SELECT COUNT(*) FROM bookings b
LEFT JOIN warehouses w ON b.warehouse_id = w.id
WHERE w.id IS NULL;
```

**Process:**
- Run checks manually after migration
- Document results in operational notes
- Fix issues if found via manual SQL updates

---

# 10. Operational Guidelines

## 10.1. Team Migration Workflow

### Developer Responsibilities

1. **Create migration** using Prisma CLI
2. **Test locally** and verify correctness
3. **Document migration** (purpose, impact, rollback)
4. **Submit pull request** with migration files
5. **Address review feedback**

### Tech Lead Responsibilities

1. **Review migration** for correctness and safety
2. **Assess risk** (low/medium/high)
3. **Approve deployment** to dev/staging
4. **Approve production deployment** (if low risk)
5. **Coordinate with DevOps** for high-risk migrations

### DevOps Responsibilities

1. **Create pre-migration backup** (production)
2. **Execute migration** in production
3. **Monitor application** post-deployment
4. **Execute rollback** if issues arise
5. **Document deployment** in operational log (DOC-020)

### Migration Workflow Process

```
Developer → Create & Test → PR → Tech Lead Review → Approve → 
Dev Deploy → Manual Test → Staging Deploy → Manual Test → 
Schedule Prod → DevOps Execute → Monitor → Document
```

## 10.2. Review & Approvals

### Migration Review Checklist

```markdown
# Migration Review Checklist

## SQL Correctness
- [ ] Naming conventions followed
- [ ] Data types appropriate
- [ ] Constraints valid
- [ ] Indexes on foreign keys (if needed)

## Safety
- [ ] No data loss risk
- [ ] Rollback SQL documented
- [ ] Backup strategy defined

## Testing
- [ ] Tested locally
- [ ] Tested in dev
- [ ] Tested in staging (for production deployment)

## Documentation
- [ ] Migration purpose documented
- [ ] Impact assessment documented
- [ ] Rollback plan documented

## Approval
**Risk Level:** [ ] Low [ ] Medium [ ] High

**Approved by:**
- Tech Lead: _____________
- DevOps Lead: _____________ (for production)
```

### Approval Requirements

| Environment | Approval Required | Testing Required |
|-------------|-------------------|------------------|
| Local | None | Developer testing |
| Dev | Developer | Manual testing |
| Staging | Tech Lead | Manual integration testing |
| Production | Tech Lead + DevOps | Staging validation |

## 10.3. Pre-Release Checklist

```markdown
# Production Migration Checklist

## 1 Week Before
- [ ] Migration tested locally
- [ ] Migration tested in dev
- [ ] Migration tested in staging
- [ ] Code reviewed and approved

## 2-3 Days Before
- [ ] Maintenance window scheduled
- [ ] Users notified (if downtime expected)
- [ ] Rollback plan documented
- [ ] Backup strategy confirmed

## 1 Day Before
- [ ] Team availability confirmed
- [ ] Monitoring configured
- [ ] Emergency contacts identified

## 1 Hour Before
- [ ] System health verified
- [ ] Backup created (per DOC-042)
- [ ] Team on standby

## Execution
- [ ] Maintenance mode enabled
- [ ] Migration executed
- [ ] Schema validated
- [ ] Application restarted
- [ ] Maintenance mode disabled

## Post-Execution
- [ ] Health checks passed (manual)
- [ ] Smoke tests passed (manual)
- [ ] Monitoring normal (check logs)
- [ ] Team notified of completion
- [ ] Operational log updated (DOC-020)
```

## 10.4. Migration Operational Logging

### Integration with Central Audit Logging (DOC-020)

Migration events are logged using the **central audit logging system** defined in DOC-020. There is NO separate migration audit system in MVP.

### What to Log

Migration events logged via DOC-020 mechanisms:

- Migration start (timestamp, operator, environment)
- Migration completion (success/failure, duration)
- Migration failure (error message, stack trace)
- Rollback execution (timestamp, reason)
- Validation results (pass/fail, issues found)

### Logging Approach

**Operational notes format** (following DOC-020):

```json
{
  "event_type": "migration_executed",
  "timestamp": "2024-12-17T02:15:00Z",
  "environment": "production",
  "migration_name": "20241217021500_add_warehouse_rating",
  "executed_by": "devops-user@example.com",
  "status": "success",
  "duration_seconds": 45,
  "backup_created": true,
  "backup_file": "backup_20241217_020000.sql.gz"
}
```

**Important:** Follow DOC-020 for actual audit logging implementation. Do NOT create a separate `migration_audit_log` table.

### Query Migration History

Migration history available via Prisma:

```bash
# Check migration status
npx prisma migrate status

# View migration history
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;
```

---

# 11. Out of Scope / Post-MVP

The following capabilities are **explicitly out of scope** for MVP and may be considered in future phases:

## Automated ETL Pipelines

- **Automated data orchestration** (Airflow, Prefect, Dagster)
- **Scheduled data synchronization** jobs
- **Incremental data updates** from external systems
- **Change data capture** (CDC) mechanisms
- **Data streaming** (Kafka, Kinesis)

## Advanced Migration Capabilities

- **Zero-downtime migrations** (blue-green deployments, rolling deployments)
- **Automated rollback** mechanisms
- **Multi-region migrations** with data replication
- **Database sharding** and rebalancing
- **Read replica** synchronization

## External Data Integration

- **Partner system integrations** (bulk import from external warehouses)
- **Legacy system migrations** (if acquiring existing platforms)
- **Continuous data sync** with third-party systems
- **Real-time data feeds** from IoT devices or sensors

## Data Quality & Governance

- **Automated data quality** monitoring and alerting
- **Comprehensive PII scanning** and classification
- **Data lineage tracking** across systems
- **Data catalog** and metadata management
- **Automated compliance** checks (GDPR, CCPA)

## Testing & Validation

- **Automated migration testing** suites
- **Performance benchmarking** for migrations
- **Load testing** for database changes
- **Chaos engineering** for failure scenarios

## Operational Excellence

- **Migration SLAs** and guaranteed success rates
- **Zero data loss** guarantees
- **Automated recovery** procedures
- **Advanced monitoring** dashboards and alerts
- **Capacity planning** automation

---

## Document Metadata

**Document ID:** DOC-035  
**Document Version:** 1.1 (MVP-Hardened)  
**Last Updated:** December 2024  
**Authors:** Backend Engineering Team  
**Reviewers:** Tech Lead, DevOps Lead  
**Status:** Approved for MVP Implementation  

**Changes from v1.0:**
- Added "Document Role & Scope" section clarifying manual-first approach
- Replaced "ETL Pipeline Design" with "MVP Data Operations (Manual)"
- Removed separate migration audit log table (aligned with DOC-020)
- Weakened success metrics to best-effort targets
- Added "Out of Scope / Post-MVP" section
- Aligned backup/recovery references with DOC-042
- Clarified that all processes are manual and operator-triggered
- Removed enterprise-grade language and SLA/KPI commitments

---

## Quick Reference

### Essential Commands

```bash
# Local migration
npx prisma migrate dev --name migration_name

# Deploy migration (dev/staging/production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Create manual backup (reference DOC-042)
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Manual schema validation
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\d warehouses"
```

### Key Files

- `prisma/schema.prisma` - Schema definition
- `prisma/migrations/*/migration.sql` - Migration SQL files
- Rollback SQL documented in PR or runbook (DOC-039)

### Emergency Contacts

- Tech Lead: [Contact Info]
- DevOps Engineer: [Contact Info]
- Slack Channel: #engineering-alerts

### Related Documents

- **DOC-020** - Audit Logging Specification (for migration event logging)
- **DOC-039** - Deployment Runbook (for deployment procedures)
- **DOC-042** - Disaster Recovery & Backup Plan (for backup/restore procedures)
- **Full Database Specification** - Database schema reference
- **Technical Architecture** - System architecture reference

---

**End of Document**
