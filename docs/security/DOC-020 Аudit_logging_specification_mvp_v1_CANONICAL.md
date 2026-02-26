---
title: Audit Logging Specification (MVP v1)
project: Self-Storage Aggregator
document_id: DOC-020
version: 2.0.0
date: 2025-01-17
status: 🟢 GREEN — Canonical
confidentiality: Internal
---

# Audit Logging Specification (MVP v1)
## Self-Storage Aggregator Platform

**Document ID:** DOC-020  
**Status:** 🟢 GREEN — Canonical  
**Version:** 2.0.0 (Scope Hardening & Canonical Alignment)

---

## Document Information

| Attribute | Value |
|-----------|-------|
| **Project** | Self-Storage Aggregator |
| **Document Type** | Technical Specification |
| **Version** | 2.0.0 |
| **Status** | 🟢 GREEN — Canonical |
| **Date** | January 17, 2025 |
| **Confidentiality** | Internal |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-01-15 | Architecture Team | Initial full specification |
| 2.0.0 | 2025-01-17 | Architecture Team | Scope hardening: removed implementation details, aligned with DOC-055 |

---

## Reviewers & Approvers

| Role | Name | Date | Status |
|------|------|------|--------|
| **CTO** | [Name] | [Date] | [Pending] |
| **Security Lead** | [Name] | [Date] | [Pending] |
| **Backend Lead** | [Name] | [Date] | [Pending] |
| **Legal/Compliance** | [Name] | [Date] | [Pending] |

---

## Table of Contents

1. **Purpose & Scope**
   - 1.1. Purpose
   - 1.2. Scope (MVP v1)
   - 1.3. Non-Goals (MVP v1)
   - 1.4. Relationship to Other Documents

2. **Audit Logging Principles**
   - 2.1. Non-Repudiation
   - 2.2. Integrity & Immutability
   - 2.3. Completeness
   - 2.4. No PII Leakage
   - 2.5. Consistency

3. **Audit Log Invariants**
   - 3.1. Append-Only Requirement
   - 3.2. Immutability Requirement
   - 3.3. Tamper-Evidence Requirement
   - 3.4. Retention Requirement

4. **Audit Event Categories & Prioritization**
   - 4.1. MUST Log Events (MVP v1 Critical)
   - 4.2. SHOULD Log Events (MVP v1 Recommended)
   - 4.3. Event Exclusions

5. **Detailed Event Specifications**
   - 5.1. Authentication & Authorization Events
   - 5.2. Booking Lifecycle Events
   - 5.3. Payment Events
   - 5.4. Operator Actions
   - 5.5. Admin Actions
   - 5.6. Security Configuration Events
   - 5.7. System State Changes

6. **Audit Logging in Incident Response**
   - 6.1. Role in Incident Investigation
   - 6.2. Required Event Availability
   - 6.3. Forensic Evidence Requirements
   - 6.4. Integration with DOC-051 (Incident Response Plan)

7. **Data Retention & Legal Requirements**
   - 7.1. Retention Policy
   - 7.2. Legal Hold Procedures
   - 7.3. Compliance Requirements (152-ФЗ)
   - 7.4. Data Destruction

8. **Access Control Requirements**
   - 8.1. Who Can View Audit Logs
   - 8.2. Access Restrictions
   - 8.3. Meta-Audit (Logging Access to Audit Logs)

9. **Integration Points**
   - 9.1. Backend Services
   - 9.2. API Gateway Layer
   - 9.3. Database Layer
   - 9.4. External Systems (Future)

10. **Compliance & Regulatory Mapping**
    - 10.1. 152-ФЗ Requirements
    - 10.2. GOST R 57580.1-2017
    - 10.3. Audit Trail for Compliance Evidence

**Appendices**
- Appendix A: Glossary
- Appendix B: Related Documents
- Appendix C: Audit Event Catalog (Quick Reference)

---

# 1. Purpose & Scope

## 1.1. Purpose

This document defines **WHAT audit events** must be logged and **WHEN** they must be generated in the Self-Storage Aggregator platform (MVP v1).

Audit logging enables:
- **Security investigations** — tracking unauthorized access attempts and suspicious activities
- **Compliance evidence** — demonstrating adherence to 152-ФЗ and other regulations
- **Incident response support** — providing forensic data for security incident analysis
- **Operational accountability** — documenting critical business actions for non-repudiation

**This document does NOT define:**
- HOW logs are formatted, stored, or shipped (see DOC-055: Logging Strategy)
- Implementation details of logging infrastructure
- Specific monitoring dashboards or alert configurations
- Real-time anomaly detection mechanisms

---

## 1.2. Scope (MVP v1)

**In Scope for MVP v1:**

✅ **Event Definition** — Which events must be audited  
✅ **Event Timing** — When audit events are generated  
✅ **Event Prioritization** — MUST vs SHOULD log events  
✅ **Retention Requirements** — How long audit logs must be kept  
✅ **Access Control** — Who can view audit logs  
✅ **Compliance Mapping** — Alignment with 152-ФЗ and GOST R 57580.1-2017  
✅ **Invariants** — Core properties audit logs must maintain (immutability, integrity)  

**Use Cases Supported:**
- Security incident investigation
- Compliance audits and regulatory reviews
- Forensic analysis of system behavior
- Accountability for critical business operations

---

## 1.3. Non-Goals (MVP v1)

**Explicitly OUT of Scope for MVP v1:**

❌ **Real-time monitoring** — Audit logs are for post-hoc analysis, not live alerting  
❌ **SIEM integration** — No integration with enterprise SIEM systems in MVP  
❌ **Behavioral analytics** — No ML-based anomaly detection or user behavior analysis  
❌ **Automated alerting** — No automatic alerts based on audit log patterns  
❌ **Advanced threat detection** — Threat intelligence and pattern matching are out of scope  
❌ **Log aggregation pipelines** — Infrastructure details are in DOC-055  
❌ **Dashboard implementation** — Specific monitoring dashboards are not defined here  

**Why These Are Excluded:**
- MVP v1 focuses on establishing a **complete and reliable audit trail**
- Advanced analytics and SIEM integration are planned for **post-MVP phases**
- Real-time monitoring is handled separately via application metrics (see DOC-035: Monitoring Plan)

---

## 1.4. Relationship to Other Documents

**This document (DOC-020) defines WHAT and WHEN.**  
**Other documents define HOW and implementation details.**

| Document | Responsibility | Relationship to DOC-020 |
|----------|---------------|------------------------|
| **DOC-055: Logging Strategy** | HOW logs are formatted, stored, shipped | Implements audit event schemas defined here |
| **DOC-078: Security & Compliance Plan** | Overall security posture and compliance | Provides compliance context for audit requirements |
| **DOC-079: Security Architecture** | Security infrastructure and controls | Defines protection mechanisms for audit logs |
| **DOC-051: Incident Response Plan** | How incidents are handled | Uses audit logs as evidence during investigations |
| **DOC-036: Data Retention Policy** | Retention rules for all data types | Specifies audit log retention periods |

**Critical Distinction:**
- **DOC-020 (this document)** says: "Authentication events MUST be logged"
- **DOC-055** says: "Authentication events are logged in JSON format with fields X, Y, Z"

**Do not duplicate content between DOC-020 and DOC-055.**

---

# 2. Audit Logging Principles

These principles guide all audit logging decisions in MVP v1.

## 2.1. Non-Repudiation

**Definition:** Once an action is logged, the actor cannot deny having performed it.

**Requirements:**
- Every audit event MUST include the actor's identity (user_id, operator_id, admin_id, or 'system')
- Actor identity MUST be immutable after logging
- Timestamps MUST be accurate and tamper-proof (server-side generation only)
- Session information MUST be captured where applicable

**Example:**
- If an operator approves a booking, the audit log MUST record the operator's ID
- The operator cannot later claim "I didn't approve that booking" — the audit log is proof

---

## 2.2. Integrity & Immutability

**Definition:** Audit logs cannot be modified or deleted once created.

**Requirements:**
- Audit logs MUST be append-only (no UPDATE or DELETE operations)
- Database-level protections MUST prevent unauthorized modification
- Audit logs MUST be stored separately from operational data where feasible
- Any attempt to tamper with audit logs MUST itself be logged (meta-audit)

**Implementation Note:**
- Specific database constraints and Row-Level Security (RLS) policies are defined in DOC-055
- This document only specifies the **requirement** for immutability, not the **mechanism**

---

## 2.3. Completeness

**Definition:** All critical actions MUST be logged without gaps.

**Requirements:**
- No audit event can be "skipped" due to system errors
- If audit logging fails, the operation SHOULD fail (fail-safe principle for critical events)
- Audit logs MUST capture both successful and failed operations
- Missing audit logs MUST be detectable (e.g., via sequence numbers or timestamps)

**Failure Handling:**
- Critical operations (authentication, authorization changes, payment status changes) MUST NOT proceed if audit logging fails
- Non-critical operations MAY proceed with degraded audit logging, but MUST log the degradation

---

## 2.4. No PII Leakage

**Definition:** Audit logs MUST NOT expose sensitive user data unnecessarily.

**Requirements:**
- PII (Personally Identifiable Information) MUST NOT be included in audit logs unless required for compliance
- Sensitive fields (passwords, payment card numbers, passport data) MUST NEVER be logged
- User identifiers (user_id) are logged, but NOT email, phone number, or full name (unless required by 152-ФЗ)
- IP addresses MAY be logged for security purposes (as per 152-ФЗ requirements)

**Compliant vs Non-Compliant Examples:**

✅ **Compliant:**
```json
{
  "event_type": "auth.login_success",
  "actor_id": "uuid-of-user",
  "actor_type": "user",
  "actor_ip": "192.168.1.100"
}
```

❌ **Non-Compliant:**
```json
{
  "event_type": "auth.login_success",
  "user_email": "ivan.petrov@example.com",  // ❌ PII leak
  "user_phone": "+79991234567"              // ❌ PII leak
}
```

---

## 2.5. Consistency

**Definition:** Audit logs MUST use consistent terminology and structure across the platform.

**Requirements:**
- Event types MUST follow the naming convention defined in Appendix C
- Field names MUST be consistent across all event types (e.g., always `actor_id`, not `user_id` or `operator_id`)
- Status values MUST use the same vocabulary (e.g., `success`, `failure`, `error`)
- Timestamps MUST use ISO 8601 format with UTC timezone

**Rationale:**
- Consistent structure enables reliable queries and analysis
- Prevents confusion during incident investigations
- Simplifies compliance reporting

---

# 3. Audit Log Invariants

These are the **fundamental properties** that ALL audit logs MUST satisfy in MVP v1.

## 3.1. Append-Only Requirement

**Invariant:** Audit logs can only be created, never updated or deleted (during retention period).

**Enforcement:**
- No UPDATE statements allowed on audit log tables
- No DELETE statements allowed (except automated retention expiration)
- INSERT-only access for all application components
- Database-level enforcement mechanisms (defined in DOC-055)

**Consequences:**
- If an audit event is logged incorrectly, a **corrective event** must be logged
- Original incorrect event remains in the log with a reference to the correction

---

## 3.2. Immutability Requirement

**Invariant:** Once written, audit log content cannot be altered by any user or system component.

**Enforcement:**
- Database Row-Level Security (RLS) prevents modification
- Audit log storage is isolated from operational database (where feasible)
- Access controls restrict write operations to the audit logging service only

**Exception:**
- Legal hold and retention policies may move logs to archival storage, but content remains unchanged

---

## 3.3. Tamper-Evidence Requirement

**Invariant:** Any attempt to tamper with audit logs MUST be detectable (conceptually).

**Implementation Approach (Conceptual):**
- Sequential audit events maintain ordering
- Gaps in sequence numbers or timestamps indicate potential tampering
- Checksum or hash verification (if implemented) can detect unauthorized changes

**Note:**
- Cryptographic signing or blockchain-style chaining are **out of MVP v1 scope**
- Basic tamper detection via sequence validation is **sufficient for MVP**

---

## 3.4. Retention Requirement

**Invariant:** Audit logs MUST be retained according to DOC-036 (Data Retention Policy).

**MVP v1 Retention Periods:**
- **Hot storage (PostgreSQL):** 90 days minimum
- **Warm storage (archival):** 1 year
- **Cold storage (long-term):** 3 years total (as per 152-ФЗ)

**Legal Hold Exception:**
- Audit logs related to active investigations, litigation, or regulatory inquiries MUST be retained beyond standard periods
- Legal hold status MUST be tracked separately from retention policy

**Destruction:**
- After retention period expires (and no legal hold), audit logs MUST be securely deleted
- Deletion MUST itself be audited (meta-audit event)

---

# 4. Audit Event Categories & Prioritization

This section categorizes audit events by **criticality** for MVP v1.

## 4.1. MUST Log Events (MVP v1 Critical)

These events are **mandatory** and MUST be logged without exception.

### 4.1.1. Authentication Events

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `auth.login_success` | User/operator/admin successfully logs in | Security tracking, session establishment |
| `auth.login_failure` | Login attempt fails (wrong password, invalid token) | Brute-force detection, security investigation |
| `auth.logout` | User/operator/admin logs out | Session termination tracking |
| `auth.token_refresh` | JWT refresh token is used | Session continuity tracking |
| `auth.token_revoked` | Token is explicitly revoked (logout, security event) | Security enforcement |
| `auth.password_reset_requested` | User requests password reset | Account security |
| `auth.password_reset_completed` | Password reset is completed | Account security |
| `auth.mfa_enabled` | Multi-factor authentication is enabled (if implemented) | Security enhancement tracking |
| `auth.mfa_disabled` | Multi-factor authentication is disabled | Security degradation tracking |

### 4.1.2. Authorization Events

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `authz.permission_denied` | User attempts an action they lack permission for | Security violation attempt |
| `authz.role_assigned` | A role is assigned to a user/operator/admin | Privilege escalation tracking |
| `authz.role_revoked` | A role is revoked from a user/operator/admin | Privilege de-escalation tracking |
| `authz.permission_granted` | Explicit permission is granted to a user | Fine-grained access control change |
| `authz.permission_revoked` | Explicit permission is revoked | Access restriction tracking |

### 4.1.3. Booking Lifecycle Events

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `booking.created` | User creates a new booking | Core business transaction |
| `booking.status_changed` | Booking status transitions (e.g., `pending` → `confirmed`) | Lifecycle tracking |
| `booking.cancelled` | User or operator cancels a booking | Financial and operational impact |
| `booking.approved` | Operator approves a booking | Operator accountability |
| `booking.rejected` | Operator rejects a booking | Operator accountability |
| `booking.modified` | Booking details are changed (dates, box size, etc.) | Business logic change |

### 4.1.4. Payment Events

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `payment.intent_created` | Payment intent is created via Stripe | Financial transaction initiation |
| `payment.succeeded` | Payment is successfully processed | Financial transaction completion |
| `payment.failed` | Payment attempt fails | Financial issue tracking |
| `payment.refund_issued` | Refund is issued to user | Financial reversal |
| `payment.refund_failed` | Refund attempt fails | Financial error |

### 4.1.5. Operator Actions

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `operator.warehouse_created` | Operator creates a new warehouse profile | Operator content creation |
| `operator.warehouse_updated` | Operator updates warehouse details | Content modification |
| `operator.warehouse_deleted` | Operator deletes a warehouse (soft delete) | Content removal |
| `operator.box_created` | Operator adds a storage box | Inventory addition |
| `operator.box_updated` | Operator updates box details (size, price) | Pricing and availability change |
| `operator.box_deleted` | Operator removes a box | Inventory removal |
| `operator.pricing_changed` | Operator changes pricing rules | Financial impact |

### 4.1.6. Admin Actions

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `admin.user_banned` | Admin bans a user account | Account access revocation |
| `admin.user_unbanned` | Admin unbans a user account | Account access restoration |
| `admin.operator_approved` | Admin approves an operator application | Operator onboarding |
| `admin.operator_suspended` | Admin suspends an operator | Operator access restriction |
| `admin.content_moderated` | Admin moderates operator content (hide/approve) | Content governance |
| `admin.system_config_changed` | Admin changes system-level configuration | System behavior change |

### 4.1.7. Security Configuration Events

| Event Type | Trigger | Why Critical |
|------------|---------|-------------|
| `security.rate_limit_changed` | Rate limit thresholds are modified | Security control change |
| `security.cors_policy_changed` | CORS policy is updated | Security boundary change |
| `security.encryption_key_rotated` | Encryption keys are rotated | Cryptographic key management |
| `security.firewall_rule_changed` | Firewall or security group rules are modified | Network security change |

---

## 4.2. SHOULD Log Events (MVP v1 Recommended)

These events are **recommended** but not mandatory. Log if feasible within MVP timeline.

### 4.2.1. User Profile Events

| Event Type | Trigger | Why Useful |
|------------|---------|-----------|
| `user.profile_updated` | User updates their profile (name, email, phone) | Account management tracking |
| `user.email_verified` | User verifies their email address | Account security |
| `user.phone_verified` | User verifies their phone number | Account security |

### 4.2.2. Search & Discovery Events

| Event Type | Trigger | Why Useful |
|------------|---------|-----------|
| `search.query_executed` | User performs a search query | Usage analytics (anonymized) |
| `search.no_results` | Search returns no results | Product improvement data |

### 4.2.3. System Events

| Event Type | Trigger | Why Useful |
|------------|---------|-----------|
| `system.migration_started` | Database migration begins | Operational tracking |
| `system.migration_completed` | Database migration completes | Operational tracking |
| `system.backup_started` | Backup process begins | Operational tracking |
| `system.backup_completed` | Backup process completes | Operational tracking |

---

## 4.3. Event Exclusions

**DO NOT log the following events:**

❌ **High-frequency read operations** — e.g., every API GET request  
❌ **Static asset requests** — e.g., images, CSS, JavaScript files  
❌ **Health check pings** — e.g., `/health`, `/ping`, `/metrics`  
❌ **Debug-level application logs** — These belong in DOC-055, not audit logs  
❌ **Successful API requests without state changes** — e.g., GET /api/warehouses  

**Rationale:**
- Audit logs are for **critical actions**, not every system interaction
- Logging high-frequency events bloats storage and obscures critical events
- Operational monitoring uses metrics and application logs (see DOC-035, DOC-055)

---

# 5. Detailed Event Specifications

This section provides detailed specifications for each MUST log event category.

## 5.1. Authentication & Authorization Events

### Event: `auth.login_success`

**When:** User, operator, or admin successfully authenticates.

**Required Context:**
- Actor ID (user_id, operator_id, or admin_id)
- Actor type (`user`, `operator`, `admin`)
- Actor IP address
- Session ID (if sessions are used)
- Authentication method (`password`, `oauth`, `sso`)

**Example Scenario:**
- User enters correct email and password
- Backend validates credentials
- JWT token is issued
- Audit event is logged with user_id and IP

### Event: `auth.login_failure`

**When:** Authentication attempt fails.

**Required Context:**
- Attempted username/email (hashed or anonymized if PII concerns exist)
- Actor IP address
- Failure reason (`invalid_credentials`, `account_locked`, `token_expired`)
- Timestamp

**Security Note:**
- Do NOT log plaintext passwords
- Do NOT log full email addresses unless required by compliance
- Log enough information to detect brute-force attacks

### Event: `authz.permission_denied`

**When:** A user attempts an action they lack permission for.

**Required Context:**
- Actor ID and type
- Requested resource (e.g., `booking.approve`, `warehouse.delete`)
- Required permission
- Denial reason (`insufficient_role`, `resource_not_owned`)

**Example Scenario:**
- User attempts to approve a booking (only operators can approve)
- Backend checks role, finds user lacks `operator` role
- Returns 403 Forbidden
- Audit event logs the denial

---

## 5.2. Booking Lifecycle Events

### Event: `booking.created`

**When:** A user successfully creates a new booking.

**Required Context:**
- Actor ID (user who created the booking)
- Booking ID
- Warehouse ID
- Box ID
- Start date, end date
- Total price
- Initial status (`pending`, `awaiting_payment`)

### Event: `booking.status_changed`

**When:** Booking status transitions (e.g., `pending` → `confirmed`, `confirmed` → `cancelled`).

**Required Context:**
- Actor ID (who triggered the change: user, operator, or system)
- Actor type
- Booking ID
- Old status
- New status
- Reason for change (if applicable, e.g., `payment_succeeded`, `user_cancelled`)

**Critical Transitions to Log:**
- `pending` → `confirmed`
- `confirmed` → `cancelled`
- `confirmed` → `completed`
- `awaiting_payment` → `payment_failed`

### Event: `booking.approved` / `booking.rejected`

**When:** An operator explicitly approves or rejects a booking.

**Required Context:**
- Actor ID (operator_id)
- Booking ID
- Approval/rejection reason (operator-provided comment)
- Timestamp

**Accountability:**
- Operator actions MUST be logged for accountability
- If a booking is disputed, audit logs prove which operator made the decision

---

## 5.3. Payment Events

### Event: `payment.intent_created`

**When:** A Stripe PaymentIntent is created for a booking.

**Required Context:**
- Actor ID (user_id)
- Booking ID
- Payment intent ID (Stripe ID)
- Amount
- Currency

### Event: `payment.succeeded`

**When:** Payment is successfully processed by Stripe.

**Required Context:**
- Payment intent ID
- Booking ID
- User ID
- Amount charged
- Timestamp

### Event: `payment.failed`

**When:** Payment attempt fails.

**Required Context:**
- Payment intent ID
- Booking ID
- User ID
- Failure reason (from Stripe: `insufficient_funds`, `card_declined`, etc.)
- Timestamp

### Event: `payment.refund_issued`

**When:** A refund is issued to the user.

**Required Context:**
- Actor ID (who initiated the refund: admin or system)
- Booking ID
- Payment intent ID
- Refund amount
- Refund reason

---

## 5.4. Operator Actions

### Event: `operator.warehouse_created`

**When:** An operator creates a new warehouse profile.

**Required Context:**
- Actor ID (operator_id)
- Warehouse ID
- Warehouse name (not full address for PII reasons)
- Creation timestamp

### Event: `operator.pricing_changed`

**When:** An operator modifies pricing for boxes or services.

**Required Context:**
- Actor ID (operator_id)
- Warehouse ID or Box ID
- Old price
- New price
- Effective date
- Change reason (optional)

**Business Impact:**
- Pricing changes affect revenue and user expectations
- Audit logs provide accountability for pricing decisions

---

## 5.5. Admin Actions

### Event: `admin.user_banned`

**When:** An admin bans a user account.

**Required Context:**
- Actor ID (admin_id)
- Target user ID
- Ban reason
- Ban duration (permanent or temporary)
- Timestamp

### Event: `admin.operator_approved`

**When:** An admin approves an operator application.

**Required Context:**
- Actor ID (admin_id)
- Operator ID
- Approval timestamp
- Approval notes (optional)

### Event: `admin.content_moderated`

**When:** Admin moderates operator-submitted content (warehouse descriptions, photos).

**Required Context:**
- Actor ID (admin_id)
- Content type (`warehouse_description`, `photo`)
- Content ID (warehouse_id or photo_id)
- Moderation action (`approved`, `rejected`, `hidden`)
- Moderation reason

---

## 5.6. Security Configuration Events

### Event: `security.rate_limit_changed`

**When:** An admin changes rate limiting thresholds.

**Required Context:**
- Actor ID (admin_id)
- Endpoint or service affected
- Old rate limit
- New rate limit
- Change reason
- Effective timestamp

### Event: `security.encryption_key_rotated`

**When:** Cryptographic keys are rotated (e.g., JWT signing key, database encryption key).

**Required Context:**
- Actor ID (admin or system)
- Key type (`jwt_signing_key`, `database_encryption_key`)
- Old key ID (anonymized)
- New key ID (anonymized)
- Rotation timestamp

**Security Rationale:**
- Key rotation events MUST be audited for compliance
- Helps trace cryptographic failures to key changes

---

## 5.7. System State Changes

### Event: `system.migration_started` / `system.migration_completed`

**When:** A database migration begins or completes.

**Required Context:**
- Actor ID (admin or system)
- Migration ID or version number
- Migration description
- Start/end timestamp
- Success/failure status

**Operational Rationale:**
- System-level changes SHOULD be audited for troubleshooting
- Helps correlate application issues with infrastructure changes

---

# 6. Audit Logging in Incident Response

Audit logs are a **primary source of evidence** during security incident investigations.

## 6.1. Role in Incident Investigation

**Use Cases:**
- **Unauthorized access:** Identify which accounts were accessed and when
- **Data breaches:** Trace actions performed by compromised accounts
- **Insider threats:** Detect suspicious operator or admin activity
- **Compliance audits:** Provide evidence of proper access controls and data handling
- **Fraud detection:** Correlate payment events with booking and user actions

**Integration with DOC-051 (Incident Response Plan):**
- Audit logs MUST be accessible to the incident response team within 15 minutes of request
- Audit logs MUST remain available throughout the incident lifecycle (hours to weeks)
- Audit log queries MUST be performant (queries should complete in < 5 seconds for typical investigations)

---

## 6.2. Required Event Availability

**During an Active Incident:**

The following audit events MUST be available for querying:
- **Last 90 days** of authentication/authorization events (hot storage)
- **Last 30 days** of all critical events (booking, payment, admin actions)
- **Archived logs** (1-3 years) MUST be retrievable within **4 hours** (warm/cold storage)

**Query Patterns:**
- Filter by actor_id (find all actions by a specific user)
- Filter by event_type (find all payment failures)
- Filter by time range (last 24 hours, last 7 days)
- Filter by resource_id (find all actions on a specific booking)

---

## 6.3. Forensic Evidence Requirements

**Legal Admissibility:**
- Audit logs MAY be used as evidence in legal proceedings
- Logs MUST demonstrate integrity (no tampering)
- Logs MUST include accurate timestamps (UTC, ISO 8601 format)
- Logs MUST clearly identify actors (no anonymous or ambiguous entries)

**Chain of Custody:**
- Access to audit logs MUST itself be audited (meta-audit)
- Exported audit logs for legal proceedings MUST be cryptographically signed (if implemented)
- Audit log exports MUST be accompanied by integrity checksums

---

## 6.4. Integration with DOC-051 (Incident Response Plan)

**Incident Response Phases:**

1. **Detection:** Audit logs help detect anomalies (manual review in MVP v1)
2. **Containment:** Audit logs identify compromised accounts (disable access)
3. **Investigation:** Audit logs provide timeline of attacker actions
4. **Remediation:** Audit logs help identify affected users and data
5. **Post-Incident Review:** Audit logs support root cause analysis

**Responsibilities:**
- **Incident Response Team** — Queries and analyzes audit logs during incidents
- **Backend Team** — Ensures audit logging is operational and complete
- **Security Team** — Reviews audit logs for compliance and identifies gaps

---

# 7. Data Retention & Legal Requirements

## 7.1. Retention Policy

**Audit logs MUST be retained according to DOC-036 (Data Retention Policy).**

**MVP v1 Retention Periods:**

| Storage Tier | Duration | Purpose | Access Speed |
|-------------|----------|---------|-------------|
| **Hot Storage** | 90 days | Active investigations, compliance queries | Immediate (< 1 second) |
| **Warm Storage** | 1 year (total) | Historical analysis, audits | Fast (< 10 seconds) |
| **Cold Storage** | 3 years (total) | Long-term compliance (152-ФЗ) | Delayed (< 4 hours) |

**Automatic Transition:**
- After 90 days, audit logs transition from hot to warm storage
- After 1 year, audit logs transition from warm to cold storage
- After 3 years, audit logs are **securely deleted** (unless legal hold applies)

**Implementation Note:**
- Storage tiers and transition mechanisms are defined in DOC-055 and DOC-036
- This document only specifies **retention durations**, not storage architecture

---

## 7.2. Legal Hold Procedures

**Legal Hold Scenario:**
- Active litigation, regulatory investigation, or security incident
- Audit logs related to the case MUST be preserved beyond standard retention

**Legal Hold Process:**

1. **Initiation:** Legal or compliance team issues a legal hold notice
2. **Identification:** Relevant audit logs are identified (by actor, resource, time range)
3. **Preservation:** Affected logs are marked with `legal_hold: true` flag
4. **Retention Extension:** Logs under legal hold are **not** automatically deleted
5. **Release:** Legal hold is lifted only after explicit approval from legal team

**Meta-Audit:**
- Legal hold initiation and release MUST themselves be audited
- Audit event: `legal.hold_initiated`, `legal.hold_released`

---

## 7.3. Compliance Requirements (152-ФЗ)

**152-ФЗ (Russian Personal Data Law) Requirements:**

**Audit logs MUST:**
- Document all access to personal data (PII)
- Retain logs for at least 3 years
- Provide logs to regulatory authorities upon request
- Demonstrate secure handling of personal data

**Specific Events Required by 152-ФЗ:**
- `user.profile_created` — When personal data is first collected
- `user.profile_updated` — When personal data is modified
- `user.profile_deleted` — When personal data is deleted (GDPR-style "right to be forgotten")
- `user.consent_given` — When user consents to data processing
- `user.consent_revoked` — When user revokes consent

**Compliance Reporting:**
- Audit logs MUST be exportable in a format suitable for regulatory review (e.g., CSV, JSON)
- Exported logs MUST include all required fields (actor, action, timestamp, resource)

---

## 7.4. Data Destruction

**Secure Deletion:**
- After retention period expires (and no legal hold), audit logs MUST be securely deleted
- Deletion MUST be **irreversible** (no recovery possible)
- Deletion MUST be logged (meta-audit event: `audit.logs_deleted`)

**Deletion Process:**
1. Automated job identifies audit logs exceeding retention period
2. Checks for legal hold flags (do not delete if `legal_hold: true`)
3. Securely deletes logs from all storage tiers
4. Logs the deletion event with count of deleted records

**Verification:**
- Deletion jobs MUST be monitored for completion
- Failed deletions MUST trigger alerts

---

# 8. Access Control Requirements

## 8.1. Who Can View Audit Logs

**Access to audit logs is RESTRICTED.**

| Role | Access Level | Use Case |
|------|-------------|----------|
| **Super Admin** | Full read access | System-wide auditing, compliance reviews |
| **Security Team** | Full read access | Incident investigations, security analysis |
| **Compliance Team** | Full read access | Regulatory audits, legal hold management |
| **Backend Engineers** | Limited read access (own service logs only) | Debugging, troubleshooting |
| **Operators** | **No access** | N/A |
| **Users** | **No access** | N/A |

**Rationale:**
- Audit logs contain sensitive information about user and operator actions
- Unrestricted access could enable evidence tampering or privacy violations
- Access is granted on a **need-to-know basis** only

---

## 8.2. Access Restrictions

**Technical Controls:**
- Audit log tables MUST be protected with database Row-Level Security (RLS) policies
- API endpoints for audit log queries MUST enforce role-based access control (RBAC)
- Direct database access MUST be restricted to authorized personnel only

**Operational Controls:**
- Access requests MUST be approved by CTO or Security Lead
- Access MUST be reviewed quarterly and revoked if no longer needed
- Temporary access (e.g., for incident investigation) MUST expire after 7 days

---

## 8.3. Meta-Audit (Logging Access to Audit Logs)

**Principle:** Access to audit logs MUST itself be audited.

**Event: `audit.logs_accessed`**

**When:** A user queries or exports audit logs.

**Required Context:**
- Actor ID (admin_id, security_team_member_id)
- Query parameters (filters, time range)
- Number of records returned
- Timestamp
- Access reason (optional but recommended)

**Rationale:**
- Prevents unauthorized snooping of audit logs
- Detects insider threats (e.g., admin covering tracks)
- Provides audit trail for compliance reviews

**Example Scenario:**
- Security team member queries audit logs to investigate a suspected breach
- Query parameters: `actor_id = user-123, event_type = auth.login_failure, time_range = last 7 days`
- Meta-audit event logs who performed the query and what they searched for

---

# 9. Integration Points

This section defines **WHERE** audit logging must be integrated (WHAT components generate audit events).

## 9.1. Backend Services

**Audit logging MUST be integrated into:**

- **AuthService** — Logs authentication and authorization events
- **BookingService** — Logs booking lifecycle events
- **PaymentService** — Logs payment intent creation, success, failure, refunds
- **OperatorService** — Logs operator actions (warehouse creation, pricing changes)
- **AdminService** — Logs admin actions (user bans, content moderation)
- **UserService** — Logs user profile changes (SHOULD log events)

**Integration Approach:**
- Each service calls a centralized `AuditService` or `AuditLogger` module
- Audit logging MUST NOT be skipped due to service-level errors (fail-safe principle)

**Note:**
- Specific implementation details (service architecture, dependency injection) are in DOC-027 (Backend Implementation Plan)
- This document only specifies **which services** must log **which events**

---

## 9.2. API Gateway Layer

**Audit logging at API Gateway (Nginx) MUST capture:**

- **Access logs** — All incoming HTTP requests (method, URI, status code, response time)
- **Rate limiting violations** — When a client exceeds rate limits
- **Authentication failures** — Failed JWT token validation at gateway level
- **CORS violations** — Blocked cross-origin requests

**Why Gateway-Level Logging Matters:**
- Captures attacks before they reach backend (e.g., SQL injection in URI, brute-force attempts)
- Provides network-level visibility for security analysis
- Correlates with backend audit logs via `request_id`

**Format:**
- Gateway logs SHOULD use structured format (JSON) for easy parsing
- Gateway logs MUST include `request_id` for correlation with backend logs

**Note:**
- Specific Nginx configuration is in DOC-055 (Logging Strategy)
- This document only specifies **what must be logged**, not **how to configure Nginx**

---

## 9.3. Database Layer

**Database-level audit logging MUST capture:**

- **Direct SQL operations** — Manual queries executed by DBAs (for troubleshooting)
- **Constraint violations** — Failed INSERTs due to unique constraints, foreign key violations
- **Schema changes** — ALTER TABLE, CREATE TABLE, DROP TABLE operations
- **Permission changes** — GRANT, REVOKE statements

**Why Database-Level Logging Matters:**
- Detects unauthorized direct database access
- Captures operational errors (e.g., constraint violations indicating data integrity issues)
- Provides audit trail for compliance (who accessed raw database)

**Implementation:**
- PostgreSQL native logging (configured in postgresql.conf)
- Database triggers for specific tables (if needed for critical data)

**Note:**
- Database logging configuration is in DOC-055
- This document only specifies **what database events** must be audited

---

## 9.4. External Systems (Future)

**Out of MVP v1 scope, but planned for future:**

- **Third-party integrations** — Audit log events when external APIs are called (e.g., Stripe webhooks)
- **Background jobs** — Audit log events for scheduled tasks (e.g., automated booking confirmations)
- **Notification system** — Audit log when emails/SMS are sent (for compliance with communication tracking)

**These will be added in post-MVP phases and are NOT required for MVP v1.**

---

# 10. Compliance & Regulatory Mapping

## 10.1. 152-ФЗ Requirements

**152-ФЗ (Federal Law on Personal Data, Russia) requires:**

1. **Audit trail for personal data access:**
   - Every access to personal data MUST be logged
   - Logs MUST include: who accessed, what data, when, and why

2. **Retention of audit logs:**
   - Audit logs MUST be retained for at least 3 years

3. **Protection of audit logs:**
   - Audit logs MUST be protected from unauthorized modification or deletion

4. **Access control:**
   - Only authorized personnel can view audit logs

5. **Reporting to regulatory authorities:**
   - Audit logs MUST be exportable for regulatory review

**Compliance Mapping:**

| 152-ФЗ Requirement | DOC-020 Section |
|-------------------|-----------------|
| Audit trail for PII access | Section 5.1 (Authentication Events), Section 8.3 (Meta-Audit) |
| 3-year retention | Section 7.1 (Retention Policy) |
| Protection from tampering | Section 3 (Audit Log Invariants) |
| Access control | Section 8 (Access Control Requirements) |
| Regulatory reporting | Section 10.3 (Audit Trail for Compliance Evidence) |

---

## 10.2. GOST R 57580.1-2017

**GOST R 57580.1-2017 (Russian standard for information security) requires:**

1. **Non-repudiation mechanisms:**
   - Actions by users and operators MUST be traceable

2. **Integrity of audit logs:**
   - Logs MUST be protected from modification

3. **Completeness of audit trail:**
   - No critical actions can be unlogged

4. **Incident detection support:**
   - Audit logs MUST enable detection of security incidents

**Compliance Mapping:**

| GOST R Requirement | DOC-020 Section |
|-------------------|-----------------|
| Non-repudiation | Section 2.1 (Non-Repudiation Principle) |
| Integrity | Section 2.2 (Integrity & Immutability) |
| Completeness | Section 2.3 (Completeness Principle) |
| Incident detection | Section 6 (Audit Logging in Incident Response) |

---

## 10.3. Audit Trail for Compliance Evidence

**Purpose:** Audit logs serve as **evidence** during compliance audits.

**What Auditors Will Request:**

1. **Authentication logs:**
   - Prove that only authorized users accessed the system
   - Show failed login attempts were handled properly

2. **Authorization logs:**
   - Prove that access controls were enforced
   - Show users could only access data they were authorized to see

3. **Data modification logs:**
   - Prove that personal data changes were logged
   - Show who made changes and when

4. **Admin action logs:**
   - Prove that administrative actions were properly controlled
   - Show approvals and oversight were in place

**Audit Log Export Format:**
- CSV or JSON
- Must include all required fields (timestamp, actor, action, resource, status)
- Must be human-readable and machine-parseable

**Example Export:**
```csv
timestamp,event_type,actor_id,actor_type,resource_type,resource_id,action,status
2025-01-17T10:00:00Z,auth.login_success,user-123,user,session,session-456,login,success
2025-01-17T10:05:00Z,booking.created,user-123,user,booking,booking-789,create,success
```

---

# Appendices

## Appendix A: Glossary

**Audit Event** — A record of a critical action in the system, documenting who did what, when, and with what result.

**Actor** — The entity performing an action (user, operator, admin, or system).

**Non-Repudiation** — The property that an actor cannot deny having performed a logged action.

**Integrity** — The guarantee that audit logs have not been modified or deleted after creation.

**Immutability** — The property of audit logs being unchangeable (append-only).

**PII (Personally Identifiable Information)** — Personal data subject to protection under 152-ФЗ (e.g., email, phone number, passport data).

**Retention Policy** — Rules governing how long audit logs are kept before deletion.

**Legal Hold** — A prohibition on deleting audit logs due to active litigation or regulatory investigation.

**Hot Storage** — Fast-access storage for recent audit logs (e.g., PostgreSQL).

**Warm Storage** — Intermediate storage for archived logs (e.g., S3 Standard-IA).

**Cold Storage** — Long-term archival storage (e.g., S3 Glacier).

**Meta-Audit** — Audit logging of the audit system itself (e.g., logging who accessed audit logs).

---

## Appendix B: Related Documents

**Must Read Before Implementation:**

| Document ID | Title | Relationship to DOC-020 |
|------------|-------|------------------------|
| DOC-055 | Logging Strategy & Log Taxonomy | Defines HOW audit logs are formatted and stored |
| DOC-078 | Security & Compliance Plan | Provides overall security context |
| DOC-079 | Security Architecture | Defines protection mechanisms for audit logs |
| DOC-051 | Incident Response Plan | Uses audit logs during incident investigations |
| DOC-036 | Data Retention Policy | Specifies retention periods for audit logs |

**Reference During Implementation:**

| Document ID | Title | Relevance |
|------------|-------|-----------|
| DOC-002 | API Design Blueprint | Defines API endpoints that generate audit events |
| DOC-003 | Database Schema Specification | Defines audit_logs table structure (implementation in DOC-055) |
| DOC-027 | Backend Implementation Plan | Defines service architecture for audit logging |

---

## Appendix C: Audit Event Catalog (Quick Reference)

**MUST Log Events (MVP v1 Critical):**

### Authentication & Authorization
- `auth.login_success`
- `auth.login_failure`
- `auth.logout`
- `auth.token_refresh`
- `auth.token_revoked`
- `auth.password_reset_requested`
- `auth.password_reset_completed`
- `authz.permission_denied`
- `authz.role_assigned`
- `authz.role_revoked`

### Booking Lifecycle
- `booking.created`
- `booking.status_changed`
- `booking.cancelled`
- `booking.approved`
- `booking.rejected`
- `booking.modified`

### Payment
- `payment.intent_created`
- `payment.succeeded`
- `payment.failed`
- `payment.refund_issued`

### Operator Actions
- `operator.warehouse_created`
- `operator.warehouse_updated`
- `operator.warehouse_deleted`
- `operator.box_created`
- `operator.box_updated`
- `operator.box_deleted`
- `operator.pricing_changed`

### Admin Actions
- `admin.user_banned`
- `admin.user_unbanned`
- `admin.operator_approved`
- `admin.operator_suspended`
- `admin.content_moderated`
- `admin.system_config_changed`

### Security Configuration
- `security.rate_limit_changed`
- `security.cors_policy_changed`
- `security.encryption_key_rotated`
- `security.firewall_rule_changed`

---

**SHOULD Log Events (MVP v1 Recommended):**

- `user.profile_updated`
- `user.email_verified`
- `user.phone_verified`
- `search.query_executed`
- `system.migration_started`
- `system.migration_completed`

---

## Document History

### Version 2.0.0 (January 17, 2025)
**Scope Hardening & Canonical Alignment**
- Removed all implementation details (HOW)
- Clarified Scope and Non-Goals
- Added Audit Log Invariants section
- Prioritized events (MUST vs SHOULD)
- Added Incident Response integration
- Clarified relationship to DOC-055 (Logging Strategy)
- Removed Sections 11-12 (Monitoring, Operational Guidelines)
- Reduced document size from 9400+ to ~2000 lines

### Version 1.0.0 (January 15, 2025)
**Initial Full Specification**
- Complete 12-section specification with implementation details
- Code examples in TypeScript, SQL, Nginx, YAML
- Operational guidelines and monitoring dashboards
- (This version was scope-overreached and has been superseded)

---

## Contact Information

**For Questions or Clarifications:**
- Security Team: security@storage-aggregator.ru
- Compliance Team: compliance@storage-aggregator.ru
- Architecture Team: architecture@storage-aggregator.ru

**Escalation:**
- CTO: cto@storage-aggregator.ru

---

## License & Confidentiality

**© 2025 Self-Storage Aggregator**

This document is confidential and proprietary. It contains trade secrets and confidential information owned by Self-Storage Aggregator. Unauthorized copying, distribution, or disclosure is strictly prohibited.

**Distribution:** Internal Use Only  
**Classification:** Confidential

---

**END OF DOCUMENT**

**Document ID:** DOC-020  
**Version:** 2.0.0  
**Status:** 🟢 GREEN — Canonical  
**Generated:** January 17, 2025  
**Word Count:** ~7,500 words (down from ~50,000)
