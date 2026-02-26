# DOC-071: Privacy & Data Protection Policy — Technical Version (MVP v1)

**Document ID:** DOC-071  
**Version:** 1.0  
**Status:** Technical Policy — MVP v1 Only  
**Date:** December 2025  
**Target Audience:** Engineering, DevOps, Backend/Frontend Developers, Security Team

---

## Document Metadata

| Parameter | Value |
|-----------|-------|
| **Project** | Self-Storage Aggregator MVP v1 |
| **Type** | Technical Privacy & Data Protection Policy |
| **Scope** | MVP v1 Only |
| **Priority** | MUST for MVP v1 Implementation |
| **Dependencies** | DOC-004 (Database Spec), DOC-078 (Security & Compliance), DOC-036 (Data Retention), DOC-059 (Multi-Region Architecture) |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Data Classification](#2-data-classification)
3. [Data Handling Principles](#3-data-handling-principles)
4. [Storage, Retention & Deletion](#4-storage-retention--deletion)
5. [Access Control & Roles](#5-access-control--roles)
6. [Multi-Country & Regional Variability](#6-multi-country--regional-variability)
7. [Technical Security Controls](#7-technical-security-controls)
8. [Integration Points](#8-integration-points)
9. [Out of Scope (Post-MVP)](#9-out-of-scope-post-mvp)
10. [Relationship to Other Documents](#10-relationship-to-other-documents)

---

# 1. Document Role & Scope

## 1.1. Purpose

This document defines the **technical privacy and data protection policy** for the Self-Storage Aggregator platform MVP v1. It describes **HOW the system handles data** from an engineering perspective.

## 1.2. What This Document IS

✅ **Technical privacy policy** — Engineering-facing implementation principles  
✅ **Data handling guidance** — How developers must treat different data categories  
✅ **Architecture constraints** — Privacy-by-design requirements embedded in the system  
✅ **MVP v1 scoped** — Limited to capabilities and constraints of the initial release  

## 1.3. What This Document IS NOT

❌ **NOT a public privacy notice** — This is not customer-facing documentation  
❌ **NOT a legal policy** — Does not interpret GDPR, PDPL, CCPA, or other regulations  
❌ **NOT a compliance guarantee** — Does not promise automatic regulatory compliance  
❌ **NOT a multi-jurisdiction compliance guide** — Regional legal requirements handled separately  
❌ **NOT a substitute for legal counsel** — Legal interpretation required for regulatory questions  

## 1.4. Relationship to Public Privacy Policy

The platform's **public Privacy Policy** is a separate legal document aimed at users and operators. This technical policy provides the **engineering implementation layer** that supports Privacy Policy commitments.

**Alignment Requirement:**  
Changes to this technical policy that affect data handling practices **MUST trigger** a review of the public Privacy Policy for consistency.

## 1.5. Target Audience

- **Backend Engineers** — Implementing data access, storage, and processing logic
- **Frontend Engineers** — Handling user data in client applications
- **DevOps/SRE** — Configuring infrastructure, backups, and data retention automation
- **Security Team** — Auditing compliance with technical privacy controls
- **Product Managers** — Understanding technical constraints for feature planning

---

# 2. Data Classification

## 2.1. Overview

Data is classified based on **sensitivity** and **identifiability** to determine appropriate technical controls. Classifications derive from the canonical **Database Specification (DOC-004)** and align with **Security & Compliance Plan (DOC-078)**.

## 2.2. Data Categories

### 2.2.1. Account & Identity Data

**Description:** Core user and operator account information  

**Includes:**
- User email, password hash, name, phone
- Operator email, name, phone, company name
- User role (`user`, `operator`, `admin`)
- Email verification tokens, password reset tokens
- Last login timestamps

**Sensitivity:** **HIGH**  
**Identifiability:** **Direct PII**  

**Storage Location:**
- `users` table
- `operators` table

**Technical Controls:**
- Encryption at rest (database-level)
- Encryption in transit (TLS 1.2+)
- Password hashing (bcrypt, cost factor 10)
- Access control via RBAC
- Audit logging for all access

**Retention:** See Section 4.2 and DOC-036 (Data Retention Policy)

---

### 2.2.2. Contact Data (Booking & Lead Context)

**Description:** Contact information collected in booking and CRM contexts  

**Includes:**
- Booking contact name, email, phone (from `bookings` table)
- CRM lead name, email, phone (from `crm_leads` table)
- CRM contact messages (from `crm_contacts` table)

**Sensitivity:** **HIGH**  
**Identifiability:** **Direct PII**  

**Storage Location:**
- `bookings` table: `contact_name`, `contact_email`, `contact_phone`
- `crm_leads` table: `name`, `email`, `phone`
- `crm_contacts` table: `message`

**Technical Controls:**
- Encryption at rest and in transit
- Access limited to:
  - Booking owner (user)
  - Associated warehouse operator
  - Platform administrators
- Masking in logs (PII redaction)
- Subject to anonymization per data retention policy

**Retention:** See Section 4.3 and DOC-036 (Data Retention Policy)

---

### 2.2.3. Listing & Warehouse Data

**Description:** Storage facility information and inventory  

**Includes:**
- Warehouse name, address, location (latitude/longitude), description
- Box size, price, availability
- Warehouse operator association

**Sensitivity:** **LOW to MEDIUM**  
**Identifiability:** **Business data** (not direct PII, but may be associated with operator identity)

**Storage Location:**
- `warehouses` table
- `boxes` table

**Technical Controls:**
- Standard database access controls
- Operator access limited to own warehouses
- Public data (address, description) subject to moderation

**Retention:** Active while warehouse is published; retained 30 days after deletion (soft delete period)

---

### 2.2.4. Booking & Transaction Data

**Description:** Rental transactions and booking state  

**Includes:**
- Booking ID, user ID, box ID, warehouse reference
- Booking status, start date, duration, total price
- Deposit amount, payment status

**Sensitivity:** **MEDIUM to HIGH**  
**Identifiability:** **Transactional data** (links users to bookings, contains pricing)

**Storage Location:**
- `bookings` table

**Technical Controls:**
- Access limited to:
  - Booking owner (user)
  - Associated warehouse operator
  - Platform administrators
- Encrypted in transit and at rest
- Immutable pricing snapshot (price stored at booking time)

**Retention:**
- Completed bookings: 3 years post-completion (anonymized after retention period)
- Cancelled bookings: 1 year post-cancellation (anonymized after retention period)

**Anonymization Scope:** Contact details removed; transactional metadata (dates, amounts, IDs) preserved for analytics

---

### 2.2.5. User-Generated Content

**Description:** Reviews, ratings, and preferences  

**Includes:**
- Reviews: rating (1-5), comment text
- Favorites: user-warehouse associations

**Sensitivity:** **LOW to MEDIUM**  
**Identifiability:** **Public content** (reviews) or **user preferences** (favorites)

**Storage Location:**
- `reviews` table
- `favorites` table

**Technical Controls:**
- **Reviews:** Published anonymously (user identity not exposed publicly)
- **Favorites:** Private to user; not shared publicly
- Moderation for policy violations

**Retention:**
- Reviews: Indefinite (remain public permanently, anonymized at publication)
- Favorites: Deleted immediately upon account deletion

---

### 2.2.6. Operational & System Logs

**Description:** Application logs, security logs, AI request logs, event logs  

**Includes:**
- Application logs (errors, warnings, info)
- Security audit logs (authentication attempts, access events)
- AI request/response logs (`ai_requests_log` table)
- Event logs (`events_log` table)

**Sensitivity:** **MEDIUM**  
**Identifiability:** **Mixed** (may contain user IDs, request metadata; PII MUST be masked)

**Storage Location:**
- Log aggregation system (e.g., CloudWatch, ELK)
- `ai_requests_log` table (90-day retention)
- `events_log` table (90-day retention)

**Technical Controls:**
- **PII masking mandatory** (see DOC-009: Logging Strategy)
- Email, phone, passwords **NEVER logged**
- User IDs logged for correlation (subject to user retention policy)
- Access restricted to DevOps, SRE, Security teams

**Retention:**
- Application logs: 90 days
- Security audit logs: 1 year
- AI request logs: 90 days (detailed); aggregated metrics indefinite
- Event logs: 90 days

---

### 2.2.7. Media & File Data

**Description:** User and operator uploaded images and files  

**Includes:**
- Warehouse photos
- User profile images
- File metadata (size, mime type, path)

**Sensitivity:** **LOW to MEDIUM**  
**Identifiability:** **Typically public** (warehouse photos) or **user-associated** (profile images)

**Storage Location:**
- Object storage (S3 or equivalent)
- `files` table (metadata only)

**Technical Controls:**
- Access control based on association (user profile, warehouse listing)
- Public URLs for published content (warehouses)
- Moderation for inappropriate content

**Retention:**
- Warehouse media: Deleted 30 days after warehouse deletion
- User profile media: Deleted immediately upon account deletion

---

### 2.2.8. Temporary & Session Data

**Description:** Transient authentication and session data  

**Includes:**
- JWT access tokens (short-lived)
- Refresh tokens (7-day validity)
- Email verification codes (24-hour validity)
- Password reset tokens (1-hour validity)

**Sensitivity:** **CRITICAL**  
**Identifiability:** **Authentication credentials**

**Storage Location:**
- `refresh_tokens` table
- In-memory cache (Redis)
- User record (for verification/reset tokens)

**Technical Controls:**
- **NEVER logged**
- Automatic expiration enforced
- Revocation on logout
- Hashed before storage (refresh tokens)

**Retention:**
- Access tokens: 15 minutes (automatic expiration)
- Refresh tokens: 7 days (automatic expiration or manual revocation)
- Email verification codes: 24 hours (automatic expiration)
- Password reset tokens: 1 hour (automatic expiration)

---

## 2.3. Data NOT Collected

**MVP v1 explicitly does NOT collect:**
- ❌ Biometric data
- ❌ Health information
- ❌ Political opinions or affiliations
- ❌ Religious beliefs
- ❌ Payment card details (PANs, CVVs) — handled by payment processors only
- ❌ Social Security Numbers or government IDs
- ❌ Children's data (users under 18 prohibited)

---

# 3. Data Handling Principles

## 3.1. Privacy-by-Design

**Principle:**  
Privacy considerations are embedded in system architecture, not added as an afterthought.

**Implementation:**
- **Data minimization:** Collect only data required for defined purposes
- **Purpose limitation:** Use data only for purposes disclosed at collection
- **Access control:** Enforce least-privilege access to sensitive data
- **Encryption:** Protect data at rest and in transit
- **Auditability:** Log access to sensitive data for compliance audits
- **Retention limits:** Automatically delete or anonymize data per retention policy

---

## 3.2. Data Minimization

**Principle:**  
Collect and retain only the minimum data necessary for each feature.

**Examples:**
- Bookings collect contact information **only** (no browsing history, IP addresses)
- CRM leads collect name, phone, email **only** (no social profiles, employment history)
- Reviews do not store reviewer identity (anonymized at publication)
- Favorites store warehouse IDs **only** (no timestamps of individual views)

**Developer Requirement:**  
New features that require additional data collection **MUST** undergo privacy impact review before implementation.

---

## 3.3. Purpose Limitation

**Principle:**  
Data collected for one purpose MUST NOT be repurposed without explicit user consent (where required by law).

**Examples:**
- Booking contact information used **only** for booking fulfillment (not marketing)
- CRM leads used **only** for sales follow-up (not shared with third parties)
- Email addresses used **only** for authentication and platform communications (not sold)

**Developer Requirement:**  
Database queries MUST be scoped to the business function being performed (no broad data extraction for unrelated purposes).

---

## 3.4. Least Privilege Access

**Principle:**  
Users, operators, and administrators access only the data necessary for their role.

**Implementation:**
- **Users** access their own bookings, reviews, and favorites
- **Operators** access bookings for their warehouses only
- **Administrators** access all data (subject to audit logging)
- **Service accounts** access only tables and fields required for their function

**Developer Requirement:**  
All database queries and API endpoints **MUST** enforce role-based access control (RBAC). See Section 5 for details.

---

## 3.5. Encryption as Default

**Principle:**  
Sensitive data is encrypted at rest and in transit.

**Implementation:**
- **In transit:** TLS 1.2+ for all client-server and server-server communication
- **At rest:** Database encryption for all PII fields (see Section 7.1)
- **Password storage:** bcrypt hashing (never plaintext, never reversible encryption)
- **Tokens:** JWTs signed with strong secrets; refresh tokens hashed before storage

**Developer Requirement:**  
Sensitive data MUST NEVER be transmitted or stored in plaintext. Passwords MUST NEVER be reversible.

---

## 3.6. Audit Logging

**Principle:**  
Access to sensitive data is logged for security and compliance purposes.

**Scope:**
- User authentication events (login, logout, password reset)
- Access to PII fields (read operations on `users`, `bookings`, `crm_leads`)
- Account deletions (soft delete, hard delete, anonymization)
- Administrative actions (role changes, manual data modifications)

**Implementation:**  
See **DOC-009 (Logging Strategy)** and **DOC-020 (Audit Logging Specification)** for detailed requirements.

**Retention:**  
Audit logs retained for **1 year** per security policy.

---

# 4. Storage, Retention & Deletion

## 4.1. Storage Architecture

**Primary Storage:**
- **Database:** PostgreSQL 15+ with encryption at rest
- **Object Storage:** S3-compatible storage for media (warehouse photos, profile images)
- **Cache:** Redis for session data (short-lived, not persisted)

**Backup Storage:**
- Encrypted database backups (daily snapshots)
- Backup retention: Aligned with data retention policy
- See **DOC-042 (Disaster Recovery & Backup Plan)** for details

---

## 4.2. Retention Periods (High-Level)

**Retention is configuration-driven and enforced automatically.**

| Data Category | Active Period | Post-Activity Retention | Final State |
|---------------|---------------|-------------------------|-------------|
| **User Account** | While active | 30 days (soft delete grace) | Hard delete |
| **Operator Account** | While active | 30 days (soft delete grace) | Hard delete |
| **Booking (Completed)** | During booking | 3 years post-completion | Anonymized |
| **Booking (Cancelled)** | During booking | 1 year post-cancellation | Anonymized |
| **CRM Leads (Converted)** | Active pipeline | Retained with booking | Anonymized with booking |
| **CRM Leads (Rejected)** | Active pipeline | 6 months post-rejection | Anonymized |
| **Reviews** | Published | Indefinite (anonymized) | Permanent (anonymized) |
| **Favorites** | While account active | Deleted with account | Hard delete |
| **Application Logs** | Active | 90 days | Hard delete |
| **Security Audit Logs** | Active | 1 year | Hard delete |
| **AI Request Logs** | Active | 90 days (detailed) | Hard delete; aggregates indefinite |
| **Event Logs** | Active | 90 days | Hard delete |
| **Media (Warehouse)** | While warehouse active | 30 days post-deletion | Hard delete |
| **Media (User Profile)** | While account active | Deleted with account | Hard delete |
| **Access Tokens** | Active session | 15 minutes (expiration) | Automatic purge |
| **Refresh Tokens** | Active session | 7 days (expiration) | Automatic purge |

**Detailed Retention Specifications:**  
See **DOC-036 (Data Retention Policy)** for complete retention rules, triggers, and edge cases.

---

## 4.3. Deletion vs Anonymization

### 4.3.1. Hard Delete

**Definition:** Permanent and irreversible removal of data from all systems (production, backups, logs).

**Applied To:**
- User and operator accounts (after 30-day grace period)
- Favorites and preferences
- Temporary tokens and session data
- Logs after retention period

**Implementation:**
- `DELETE` statements in database
- Cascade deletion of dependent records (where appropriate)
- Backup purging aligned with retention policy

---

### 4.3.2. Soft Delete

**Definition:** Logical deletion with recovery window; data remains in database with `deleted_at` timestamp.

**Applied To:**
- User accounts (30-day grace period)
- Operator accounts (30-day grace period)
- Warehouses (30-day grace period for operators)

**Implementation:**
- `deleted_at` timestamp set on record
- Application queries filter out soft-deleted records (`WHERE deleted_at IS NULL`)
- Restoration possible during grace period via support or self-service

**Automatic Hard Delete:**  
Soft-deleted records are **automatically hard deleted** after grace period expires (cron job or scheduled task).

---

### 4.3.3. Irreversible Anonymization

**Definition:** Transformation of data to remove identifiability while preserving analytical value. **Functionally equivalent to deletion for privacy purposes.**

**Applied To:**
- Booking contact details (after retention period)
- CRM lead contact details (after retention period)
- Transaction records for analytics

**Anonymization Scope:**
| Original Field | Anonymized Value |
|----------------|------------------|
| `contact_name` | `"[anonymized]"` |
| `contact_email` | `"anonymized@system.local"` |
| `contact_phone` | `"[redacted]"` |
| Personal notes/comments | `""` (empty) |
| **Preserved:** | Booking ID, dates, pricing, warehouse ID, box ID |

**Implementation:**
- `UPDATE` statements replace PII with placeholders
- Once anonymized, data **CANNOT be re-identified or restored**
- Anonymization is logged for audit purposes

---

## 4.4. Deletion Handling (MVP v1)

### 4.4.1. User-Triggered Deletion

**Supported in MVP v1:**
- ✅ User requests account deletion via UI ("Delete Account" in user profile)
- ✅ 30-day grace period initiated (soft delete)
- ✅ User can restore account within grace period (via support or self-service if implemented)
- ✅ Automatic hard delete after 30 days

**NOT Supported in MVP v1:**
- ❌ Real-time deletion (always has grace period)
- ❌ Self-service restoration UI (restoration via support only)
- ❌ Automated DSAR (Data Subject Access Request) workflows
- ❌ User-initiated data export via UI (manual process via support)

### 4.4.2. Automated Deletion

**Supported in MVP v1:**
- ✅ Automatic hard deletion of soft-deleted records after grace period
- ✅ Automatic expiration of tokens (access, refresh, verification)
- ✅ Automatic log rotation and deletion per retention policy
- ✅ Automatic anonymization of bookings/leads after retention period

**Implementation:**
- Scheduled jobs (cron or equivalent) run daily to enforce retention
- Deletion operations logged for compliance audit

### 4.4.3. Deletion Blocking

**Active Commitments:**  
Account deletion is **blocked** if user or operator has active business obligations:
- **Users:** Cannot delete account if active bookings exist (`status IN ('pending', 'confirmed')`)
- **Operators:** Cannot delete account if active warehouses or bookings exist

**User Notification:**  
Deletion request is rejected with clear explanation and list of blocking commitments.

**Workaround:**  
User must cancel bookings or complete transactions before deletion can proceed.

---

## 4.5. Backup & Restore Considerations

**Backup Systems Respect Retention Policy:**
- Backups do **NOT** extend retention periods beyond what is defined in DOC-036
- Data deleted or anonymized in production **MUST** also be purged from backups
- Restore operations **CANNOT** recover data that has been hard deleted per retention policy

**Legal Hold Exception:**  
If data is under legal hold (litigation, regulatory inquiry), retention policy is **suspended** until hold is released. See **DOC-036 § 8.3** for details.

---

# 5. Access Control & Roles

## 5.1. Role-Based Access Control (RBAC)

**Roles Defined:**

| Role | Description | Data Access Scope |
|------|-------------|-------------------|
| **`user`** | Platform customer | Own account, own bookings, own reviews, own favorites |
| **`operator`** | Warehouse owner/manager | Own account, own warehouses, bookings for own warehouses, CRM leads for own warehouses |
| **`admin`** | Platform administrator | All data (subject to audit logging) |

**Authorization Enforcement:**
- All API endpoints enforce role-based access via NestJS Guards (`@Roles()` decorator)
- Database queries include role-based filters (`WHERE user_id = :current_user`)
- Unauthorized access attempts logged as security events

---

## 5.2. Internal Access (Admin & Ops)

**Administrator Access:**
- **Scope:** Full read/write access to all platform data
- **Constraints:** All access is audit logged
- **Use Cases:**
  - Customer support (resolving disputes, assisting users)
  - Platform moderation (review moderation, fraud detection)
  - System maintenance (data cleanup, troubleshooting)

**Operator Access:**
- **Scope:** Limited to their own warehouses and associated bookings/leads
- **Isolation:** Operators **CANNOT** access other operators' data
- **Enforcement:** Database queries filter by `operator_id`

**DevOps/SRE Access:**
- **Scope:** Infrastructure access (database, servers, logs)
- **Constraints:** Direct database access **SHOULD** be avoided; use admin APIs
- **Audit:** All production database access logged

---

## 5.3. Partner API Access (Scoped)

**Partner API Access Control:**
- **Scope:** Partners access only CRM leads assigned to them via Partner API
- **Authentication:** API key-based authentication
- **Authorization:** Scoped to partner's assigned leads only
- **Audit:** All Partner API requests logged

**Reference:** **DOC-066 (Partner API Specification)** for detailed access rules.

---

## 5.4. Third-Party Service Access

**External Services with Data Access:**
- **Payment processors:** Stripe/PayPal (no PAN/CVV stored on platform; tokenization only)
- **Email service:** Transactional emails (email addresses transmitted; subject to DPA)
- **Geocoding API:** Address data transmitted for location resolution (cached locally)
- **Cloud infrastructure:** AWS/GCP (database and object storage)

**Data Protection Measures:**
- **Data Processing Agreements (DPAs)** executed with all processors
- **Encryption in transit** (TLS) for all external communication
- **Minimal data transmission** (only data required for service function)
- **Audit logging** for third-party API calls

**Reference:** **DOC-078 § 8 (Security & Compliance Plan)** for third-party security assessment.

---

# 6. Multi-Country & Regional Variability

## 6.1. Region-Aware Architecture

**Design Principle:**  
The platform is designed to operate across multiple countries and regions **without code changes**. Regional variations are handled via **configuration**, not hard-coded logic.

**Architectural Foundation:**  
See **DOC-059 (Multi-Country/Multi-Region Technical Architecture)** for full specification.

---

## 6.2. Regional Data Handling Rules

**MVP v1 Baseline:**  
- **Single region deployment** (initial launch)
- **Jurisdiction-agnostic baseline policy** (this document)
- **Regional compliance handled via addenda** (not embedded in code)

**Regional Variation Mechanisms:**

| Variation Type | Implementation |
|----------------|----------------|
| **Data retention periods** | Configuration per region (e.g., `retention_policy_id` linked to region) |
| **Consent requirements** | Feature flags per region (e.g., `cookie_consent_required`) |
| **Data residency** | Infrastructure-level (deploy to region-specific data centers) |
| **User rights workflows** | Configuration-driven (GDPR vs CCPA vs PDPL workflows) |

**No Hard-Coded Country Logic:**  
Code MUST NOT contain region-specific branching (e.g., `if (country === 'US')`). Regional behavior is determined by configuration lookup.

---

## 6.3. Data Residency (Conceptual)

**MVP v1:**  
Single-region deployment; data residency implicitly satisfied by deployment location.

**Post-MVP (Conceptual):**  
- **Regional deployments:** Separate database instances per region (Level 2/3 architecture)
- **Cross-border data transfers:** Minimized; user data stays in region of origin
- **Legal mechanisms:** Standard Contractual Clauses (SCCs), DPAs for cross-border transfers

**Reference:** **DOC-058 (Multi-Country Scaling Specification)** for multi-region deployment levels.

---

## 6.4. Compliance Context Per Region

**Region Minimal Contract (from DOC-059):**

Each region defines:
1. **Legal Entity Context:** Jurisdiction, operator registration requirements
2. **Tax/Fiscal Context:** Tax rates, invoicing rules
3. **Currency Context:** Primary currency, formatting rules
4. **Data Residency/Compliance Context:** Data protection regulations, retention periods
5. **Feature Availability Context:** Enabled/disabled features per region

**Implementation in MVP v1:**  
- Region context is **inferred** (no explicit `regions` table)
- Baseline policy applies to all regions
- Region-specific overrides handled via configuration

**Post-MVP:**  
- Explicit `regions` table for formalized regional policies
- Configuration per region stored in database or config management system

---

# 7. Technical Security Controls

## 7.1. Encryption

### 7.1.1. Encryption in Transit

**Requirement:** All data transmitted over networks MUST be encrypted.

**Implementation:**
- **TLS 1.2+** for all client-server communication (HTTPS)
- **TLS 1.2+** for all server-server communication (backend to database, backend to external APIs)
- **Strict Transport Security (HSTS)** enabled on all domains
- **Certificate management:** Automated via Let's Encrypt or cloud provider

**Developer Requirement:**  
All HTTP connections MUST redirect to HTTPS. No plaintext HTTP allowed in production.

---

### 7.1.2. Encryption at Rest

**Requirement:** Sensitive data stored on disk MUST be encrypted.

**Implementation:**
- **Database encryption:** PostgreSQL Transparent Data Encryption (TDE) or cloud-managed encryption (AWS RDS encryption)
- **Backup encryption:** All database backups encrypted
- **Object storage encryption:** S3 server-side encryption (SSE) for media files
- **Log encryption:** CloudWatch Logs encryption or equivalent

**Scope:**  
All PII fields (email, phone, name, contact details) stored in encrypted tables.

**Key Management:**  
Encryption keys managed via AWS KMS, GCP KMS, or equivalent cloud key management service.

---

### 7.1.3. Password Hashing

**Requirement:** Passwords MUST NEVER be stored in plaintext or reversible encryption.

**Implementation:**
- **Algorithm:** bcrypt
- **Cost factor:** 10 (minimum)
- **Hash format:** `$2b$10$...` (60 characters)

**Storage:**  
`users.password_hash` field stores bcrypt hash only.

**Developer Requirement:**  
Use established bcrypt library (e.g., `bcryptjs` in Node.js). Do NOT implement custom hashing.

---

## 7.2. Authentication & Session Management

**JWT-Based Authentication:**
- **Access tokens:** Short-lived (15 minutes), signed with strong secret
- **Refresh tokens:** Longer-lived (7 days), stored in database, rotated on use
- **Token payload:** `user_id`, `role`, `iat`, `exp` (no sensitive data in JWT)

**Session Security:**
- **Token revocation:** Logout deletes refresh token from database
- **Automatic expiration:** Expired tokens rejected by backend
- **Single sign-on:** Old refresh tokens invalidated on new login

**Reference:** **DOC-078 § 4.2 (Security & Compliance Plan)** for detailed authentication implementation.

---

## 7.3. Input Validation & Sanitization

**Requirement:** All user inputs MUST be validated and sanitized to prevent injection attacks.

**Implementation:**
- **DTO validation:** NestJS `class-validator` for all API request DTOs
- **SQL injection prevention:** Prisma ORM with parameterized queries (no raw SQL with user input)
- **XSS prevention:** Input sanitization and output encoding
- **CSRF protection:** SameSite cookies for session management

**Developer Requirement:**  
Never concatenate user input into SQL queries or HTML templates.

---

## 7.4. Rate Limiting & DDoS Protection

**Requirement:** Protect platform from abuse and denial-of-service attacks.

**Implementation:**
- **API rate limiting:** Per DOC-017 (Rate Limiting Specification)
  - IP-based limits for public endpoints
  - User-based limits for authenticated endpoints
- **DDoS protection:** Cloudflare or AWS WAF
- **Brute-force protection:** Exponential backoff for failed login attempts

**Response:**  
429 status code with `Retry-After` header when rate limit exceeded.

---

# 8. Integration Points

## 8.1. Alignment with Core Specifications

This technical privacy policy is the **governance layer** above the following technical implementations:

| Document | Relationship |
|----------|--------------|
| **DOC-004: Database Specification** | Defines all tables, fields, and PII classification |
| **DOC-078: Security & Compliance Plan** | Implements encryption, authentication, PII masking |
| **DOC-036: Data Retention Policy** | Defines retention periods and deletion rules |
| **DOC-042: Disaster Recovery & Backup Plan** | Implements backup encryption and retention alignment |
| **DOC-009: Logging Strategy** | Defines PII masking in logs and audit logging |
| **DOC-020: Audit Logging Specification** | Implements audit logging for compliance |
| **DOC-059: Multi-Region Architecture** | Implements region-aware data handling |

---

## 8.2. Relationship to Legal Documents

**Public Privacy Policy (User-Facing):**
- Technical policy supports Privacy Policy commitments
- Changes to data handling practices **MUST trigger** Privacy Policy review

**Data Processing Agreements (DPAs):**
- DPAs with third-party processors (email, payments, geocoding)
- DPAs with warehouse operators (when operators process booking data)
- Technical controls in this policy satisfy DPA requirements

**Reference:** **DOC-054 (Legal Checklist & Compliance Requirements)** for legal context.

---

## 8.3. Developer Responsibilities

**When Implementing New Features:**

1. **Data Minimization Review:** Collect only necessary data
2. **PII Classification:** Identify if new fields contain PII
3. **Access Control:** Enforce RBAC for new endpoints/queries
4. **Encryption:** Ensure sensitive data encrypted at rest and in transit
5. **Retention Policy:** Define retention period for new data
6. **Audit Logging:** Log access to new sensitive data
7. **Privacy Impact Assessment:** For features with significant privacy implications

**Checklist:**
- [ ] New data fields classified (PII vs non-PII)
- [ ] Access control implemented (role checks)
- [ ] Encryption applied (if PII)
- [ ] Retention period defined
- [ ] PII masking in logs verified
- [ ] Audit logging enabled (if sensitive data)

---

# 9. Out of Scope (Post-MVP)

The following capabilities are **NOT implemented in MVP v1** and are deferred to future releases:

## 9.1. Automated User Rights Workflows

❌ **NOT in MVP v1:**
- Self-service data export (GDPR Art. 15 "Right to Access")
- Self-service data portability (GDPR Art. 20)
- Self-service rectification (GDPR Art. 16)
- Self-service restriction of processing (GDPR Art. 18)

**MVP v1 Approach:**  
User rights requests handled **manually** via support team. Users email support, support team fulfills request using admin tools.

**Post-MVP:**  
Automated UI flows for data export, rectification, and deletion.

---

## 9.2. Consent Management Platform

❌ **NOT in MVP v1:**
- Granular consent management (opt-in/opt-out per processing purpose)
- Consent versioning and history tracking
- Automated consent withdrawal workflows
- Cookie consent preference center (beyond basic cookie banner)

**MVP v1 Approach:**  
- Basic cookie consent banner (essential vs non-essential cookies)
- Marketing consent collected via checkboxes (no advanced consent management)

**Post-MVP:**  
- Dedicated consent management system
- Per-purpose consent tracking (e.g., analytics, marketing, third-party integrations)

---

## 9.3. Per-Country Regulatory Automation

❌ **NOT in MVP v1:**
- Automated GDPR compliance workflows (data portability format, automated breach notification)
- Automated CCPA compliance (Do Not Sell my Data flows)
- Automated PDPL compliance (Saudi Arabia-specific workflows)
- Region-specific data retention schedules (automated per-region purging)

**MVP v1 Approach:**  
Baseline retention policy applies globally. Regional adjustments handled via configuration or manual processes.

**Post-MVP:**  
- Configuration-driven per-region retention
- Automated regulatory reporting
- Region-specific user rights workflows

---

## 9.4. Real-Time Deletion Propagation

❌ **NOT in MVP v1:**
- Real-time deletion (always has 30-day grace period)
- Immediate deletion from backups (backup purging aligned with lifecycle)
- Immediate deletion from external systems (email provider, analytics)

**MVP v1 Approach:**  
- Soft delete with grace period
- Hard delete after 30 days
- External systems updated asynchronously

**Post-MVP:**  
- Configurable deletion (instant vs grace period)
- Real-time propagation to external systems

---

## 9.5. Advanced Privacy Features

❌ **NOT in MVP v1:**
- Differential privacy for analytics
- Homomorphic encryption
- Zero-knowledge proofs
- Privacy-preserving machine learning
- Blockchain-based audit trails

**MVP v1 Approach:**  
Standard encryption, access control, and audit logging.

**Post-MVP:**  
Advanced privacy-enhancing technologies as platform scales and regulations evolve.

---

# 10. Relationship to Other Documents

## 10.1. Canonical Document Dependencies

This policy aligns with and depends on the following **canonical specifications**:

### 10.1.1. DOC-004: Full Database Specification (CANONICAL)

**Relationship:** Source of truth for all data entities, fields, and PII classification.

**Integration:**
- All data categories in Section 2 map directly to database tables in DOC-004
- PII fields identified in DOC-004 § 10.1 are treated as HIGH sensitivity in this policy
- Soft delete strategy (via `deleted_at` field) defined in DOC-004 § 1.4

**Consistency Check:**
- All PII fields referenced in this policy exist in DOC-004
- No new PII fields introduced without DOC-004 update

---

### 10.1.2. DOC-078: Security & Compliance Plan (CANONICAL)

**Relationship:** Technical implementation of security controls described in this policy.

**Integration:**
- Encryption algorithms, key management → DOC-078 § 4.1
- Authentication & authorization implementation → DOC-078 § 4.2
- PII masking utilities (TypeScript code) → DOC-078 § 4.4
- Data retention automation (TypeScript code) → DOC-078 § 4.5
- Account deletion process (TypeScript code) → DOC-078 § 4.6
- Breach response procedures → DOC-078 § 10

**Consistency Check:**
- Security controls in this policy match implementation in DOC-078
- No security requirements in this policy lack implementation in DOC-078

---

### 10.1.3. DOC-036: Data Retention Policy (CANONICAL)

**Relationship:** Detailed retention rules for all data categories.

**Integration:**
- High-level retention periods in this policy (Section 4.2) reference DOC-036
- Deletion triggers, anonymization scope → DOC-036 § 4 (Retention Periods by Category)
- Legal hold procedures → DOC-036 § 8.3
- User rights (deletion, export) → DOC-036 § 6

**Consistency Check:**
- Retention periods in this policy align with DOC-036
- No conflicting retention rules between documents

---

### 10.1.4. DOC-042: Disaster Recovery & Backup Plan (CANONICAL)

**Relationship:** Backup encryption, retention, and restore procedures.

**Integration:**
- Backup encryption → DOC-042 § 3 (Backup Strategy)
- Backup retention alignment with data retention → DOC-042 § 5.2
- Legal hold considerations → DOC-042 § 5.4
- Restore procedures respect retention policy → DOC-042 § 6.1

**Consistency Check:**
- Backup systems respect retention policy (no extended retention via backups)
- Encrypted backups for all PII data

---

### 10.1.5. DOC-009: Logging Strategy (CANONICAL)

**Relationship:** PII masking in logs, audit logging requirements.

**Integration:**
- What to log (events, errors, audit) → DOC-009 § 3
- What NOT to log (PII restrictions) → DOC-009 § 4
- PII masking implementation → DOC-009 § 4.3
- Log retention periods → DOC-009 § 6

**Consistency Check:**
- PII fields in this policy are masked in logs per DOC-009
- Audit logging scope aligns between documents

---

### 10.1.6. DOC-059: Multi-Country/Multi-Region Architecture (CANONICAL)

**Relationship:** Regional data handling, configuration-driven regional behavior.

**Integration:**
- Region-aware architecture principles → DOC-059 § 3
- Region as first-class domain entity → DOC-059 § 3.2
- Configuration over code branching → DOC-059 § 5
- Regional compliance context → DOC-059 § 3.2.1 (Region Minimal Contract)

**Consistency Check:**
- No hard-coded country-specific logic in code
- Regional variations handled via configuration (as described in Section 6.2)

---

## 10.2. Non-Canonical Supporting Documents

### 10.2.1. DOC-054: Legal Checklist & Compliance Requirements (Non-Canonical)

**Relationship:** Legal context and compliance obligations.

**Integration:**
- This technical policy implements legal requirements defined in DOC-054
- Legal Checklist provides the "MUST" (legal requirement); this policy provides the "HOW" (technical implementation)

**Example:**
- **Legal Checklist:** "Data MUST be encrypted (REQUIRED BY LAW)"
- **This Policy:** "TLS 1.2+ for all connections, bcrypt for passwords, AES-256 for database encryption"

---

### 10.2.2. DOC-066: Partner API Specification (Non-Canonical)

**Relationship:** Partner access control, data scope for external integrations.

**Integration:**
- Partner API access limited to assigned CRM leads → DOC-066 § 4
- PII handling in Partner API responses → DOC-066 § 5.2
- Audit logging for Partner API requests → DOC-066 § 8.2

**Consistency Check:**
- Partner API access rules align with RBAC in this policy (Section 5.3)

---

## 10.3. Conflict Resolution

**Priority Order (if conflicts arise):**

1. **Functional Specification (DOC-001)** — Business requirements
2. **Database Specification (DOC-004)** — Data model and PII classification
3. **Security & Compliance Plan (DOC-078)** — Technical security controls
4. **Data Retention Policy (DOC-036)** — Retention and deletion rules
5. **This Policy (DOC-071)** — Privacy governance layer
6. **Other Canonical Specs** — Alphabetically

**Resolution Process:**
If this policy conflicts with a higher-priority document, **the higher-priority document takes precedence**. This policy must be updated to align.

---

# Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Engineering Team | Initial version for MVP v1 |

---

**END OF DOCUMENT**
