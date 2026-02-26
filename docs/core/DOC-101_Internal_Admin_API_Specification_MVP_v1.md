# Internal Admin API Specification (MVP v1)

**Document ID:** DOC-101  
**Version:** MVP v1 - CANONICAL  
**Status:** 🟢 GREEN - Production Ready  
**Date:** 2025-12-16  
**Author:** Technical Documentation Engine  

---

## Document Control

**Purpose:**  
Define the complete specification for Internal Admin API endpoints used by admin panel, operational teams, moderation, and support personnel.

**Scope:**  
MVP v1 - Admin-only endpoints for platform management, moderation, and operations.

**Canonical Sources:**
- `api_design_blueprint_mvp_v1_CANONICAL.md` - API conventions, error format
- `Technical_Architecture_Document_MVP_v1_CANONICAL.md` - System architecture
- `full_database_specification_mvp_v1_CANONICAL.md` - Data model
- `Security_Architecture_MVP_v1_CANONICAL.md` - Security model, RBAC
- `security_and_compliance_plan_mvp_v1.md` - Security implementation
- `Error_Handling_Fault_Tolerance_Specification_MVP_v1_CANONICAL.md` - Error handling
- `Logging_Strategy_CANONICAL_Contract_v2.md` - Audit logging
- `API_Rate_Limiting_Throttling_Specification_MVP_v1_CANONICAL.md` - Rate limits
- `CRM_Lead_Management_System_MVP_v1_CANONICAL.md` - CRM domain

**Related Documents:**
- `User_Operator_Documentation_MVP_v1.md` - User/operator capabilities
- `Monitoring_and_Observability_Plan_MVP_v1_CANONICAL.md` - Monitoring
- `Data_retention_policy_mvp_v1.md` - Data retention

**Relationship to Public API:**
- Admin API is completely separate from public API
- Admin endpoints require elevated authentication
- Admin API has different rate limits (higher thresholds)
- Admin endpoints follow same error format conventions

---

# 1. Introduction

## 1.1. Purpose & Scope

**What This Document Defines:**
- All internal admin endpoints (`/api/v1/admin/*`)
- Admin authentication and authorization
- Admin role-based access control (RBAC)
- Admin-specific business logic and operations
- Audit requirements for admin actions

**What This Document Does NOT Define:**
- Public API endpoints (see `api_design_blueprint_mvp_v1_CANONICAL.md`)
- Operator API endpoints (see `api_design_blueprint_mvp_v1_CANONICAL.md` Section 6)
- Frontend implementation (see `Frontend_Architecture_Specification_v1_5_FINAL.md`)
- Backend implementation details (see `backend_implementation_plan_mvp_v1_CANONICAL.md`)

## 1.2. Admin API Principles

**1. Elevated Access:**
- Admin endpoints require `admin` role or higher
- No guest or user access to any admin endpoint
- All admin actions are audited

**2. Read-Heavy Operations:**
- Most admin endpoints are read-only (GET)
- Write operations (POST, PUT, DELETE) are restricted to specific roles
- Bulk operations are discouraged in MVP v1

**3. Comprehensive Audit Trail:**
- Every admin action logged with: who, what, when, why
- Logs are immutable and retained per compliance requirements
- Critical actions trigger alerts

**4. Fail-Safe Defaults:**
- Default is deny access
- Explicit permission grants required
- No cascade deletions in admin operations

## 1.3. API Base Path

**Admin Endpoints:**
```
Base URL: https://api.storagecompare.ae/api/v1/admin
All admin endpoints prefixed with /api/v1/admin
```

**Example:**
```
GET /api/v1/admin/users
GET /api/v1/admin/operators/pending
POST /api/v1/admin/warehouses/{id}/moderate
```

---

# 2. Admin Roles & Access Model

## 2.1. Admin Role Hierarchy

**Source:** `Security_Architecture_MVP_v1_CANONICAL.md` Section 5, `security_and_compliance_plan_mvp_v1.md` Section 2

### Admin (Primary Role)

**Role Code:** `admin`

**Description:**  
Full platform administrator with complete access to all admin functions.

**Capabilities:**
- User management (view, suspend, restore)
- Operator management (approve, reject, suspend)
- Warehouse moderation (approve, reject, disable)
- Content moderation (reviews, fraud detection)
- CRM access (view all leads, assign leads)
- System configuration (read/write)
- Audit log access (full read)
- Payment/transaction viewing (read-only)

**Restrictions:**
- Cannot directly modify user passwords (users must use reset flow)
- Cannot bypass rate limits without audit
- Cannot modify immutable audit logs
- Cannot hard delete data (soft delete only)

### Moderator (Sub-Role - Future)

**Status:** 🔴 NOT IN MVP v1 - For reference only

**Description:**  
Focused on content moderation without full admin access.

**Planned Capabilities (v1.1+):**
- Content moderation (reviews, listings)
- Fraud flag management
- Report reviewing
- User suspension recommendations

**No Access To:**
- User/operator account management
- System configuration
- Payment data
- Audit logs

### Support (Sub-Role - Future)

**Status:** 🔴 NOT IN MVP v1 - For reference only

**Description:**  
Customer support staff with limited read access.

**Planned Capabilities (v1.1+):**
- User account lookup (read-only)
- Booking status viewing
- CRM lead viewing
- Basic analytics

**No Access To:**
- User/operator modifications
- Content moderation actions
- System configuration
- Full audit logs

### Read-Only Auditor (Sub-Role - Future)

**Status:** 🔴 NOT IN MVP v1 - For reference only

**Description:**  
Compliance/audit personnel with read-only access.

**Planned Capabilities (v2+):**
- Full audit log access (read-only)
- User data export (for compliance)
- Analytics access
- Report generation

**No Access To:**
- Any write operations
- User/operator modifications
- System configuration

## 2.2. Admin Roles Matrix (MVP v1)

| Action | Admin | Moderator | Support | Read-Only |
|--------|-------|-----------|---------|-----------|
| **User Management** |
| View users | ✅ | 🔴 | 🔴 | 🔴 |
| Suspend user | ✅ | 🔴 | 🔴 | ❌ |
| Restore user | ✅ | 🔴 | 🔴 | ❌ |
| View user details | ✅ | 🔴 | 🔴 | 🔴 |
| **Operator Management** |
| View operators | ✅ | 🔴 | 🔴 | 🔴 |
| Approve operator | ✅ | 🔴 | ❌ | ❌ |
| Reject operator | ✅ | 🔴 | ❌ | ❌ |
| Suspend operator | ✅ | 🔴 | ❌ | ❌ |
| Review documents | ✅ | 🔴 | 🔴 | 🔴 |
| **Warehouse Management** |
| View warehouses | ✅ | 🔴 | 🔴 | 🔴 |
| Moderate warehouse | ✅ | 🔴 | ❌ | ❌ |
| Force disable | ✅ | 🔴 | ❌ | ❌ |
| Edit metadata | ✅ | 🔴 | ❌ | ❌ |
| **Booking Management** |
| View bookings | ✅ | 🔴 | 🔴 | 🔴 |
| Cancel booking | ✅ | 🔴 | ❌ | ❌ |
| View history | ✅ | 🔴 | 🔴 | 🔴 |
| **Payment/Transactions** |
| View transactions | ✅ | ❌ | 🔴 | 🔴 |
| View refunds | ✅ | ❌ | 🔴 | 🔴 |
| Reconciliation view | ✅ | ❌ | ❌ | 🔴 |
| **Content Moderation** |
| View reviews | ✅ | 🔴 | 🔴 | 🔴 |
| Hide/show review | ✅ | 🔴 | ❌ | ❌ |
| Flag as fraud | ✅ | 🔴 | ❌ | ❌ |
| **CRM** |
| View leads | ✅ | 🔴 | 🔴 | 🔴 |
| Assign leads | ✅ | 🔴 | ❌ | ❌ |
| View activities | ✅ | 🔴 | 🔴 | 🔴 |
| **Audit & Logs** |
| View audit logs | ✅ | ❌ | ❌ | 🔴 |
| Export logs | ✅ | ❌ | ❌ | 🔴 |

**Legend:**
- ✅ = Full access in MVP v1
- 🔴 = Planned for future (v1.1+), not in MVP v1
- ❌ = No access

## 2.3. Access Control Implementation

**Source:** `security_and_compliance_plan_mvp_v1.md` Section 2, `backend_implementation_plan_mvp_v1_CANONICAL.md` Section 3.3

**Guard Pattern:**
```
Request → Authentication → JWT Validation → Role Check → Endpoint Handler
```

**NestJS Guard (Reference):**
```typescript
// Admin endpoints protected by:
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async adminEndpoint() {
  // Implementation
}
```

**Database-Level Protection:**
- Admin queries do NOT use row-level security (can access all data)
- Audit logs are immutable (INSERT-only table)
- Soft delete enforced for user/operator data

---

# 3. Authentication & Security

## 3.1. Admin Authentication

**Source:** `api_design_blueprint_mvp_v1_CANONICAL.md` Section 2.3, `Security_Architecture_MVP_v1_CANONICAL.md` Section 7.1

### Authentication Mechanism

**Admin Login:**
- Admin accounts are created manually (no self-registration)
- Admin users authenticate via standard JWT flow
- Same endpoints as public API: `POST /auth/login`
- JWT payload includes `role: admin`

**Token Structure:**
```json
{
  "sub": "admin-user-uuid",
  "email": "admin@storagecompare.ae",
  "role": "admin",
  "iat": 1701349200,
  "exp": 1701350100
}
```

**Token Expiry:**
- Access token: 15 minutes (same as users)
- Refresh token: 7 days (same as users)
- Admin tokens follow same security requirements

### Authorization Header

**Required for All Admin Endpoints:**
```http
Authorization: Bearer <admin-jwt-token>
```

**Validation:**
1. Token signature verified
2. Token not expired
3. `role` claim = `admin`
4. User account status = `active` (not suspended)

## 3.2. Security Requirements

**Source:** `Security_Architecture_MVP_v1_CANONICAL.md` Section 4, `API_Rate_Limiting_Throttling_Specification_MVP_v1_CANONICAL.md` Section 3.4

### Rate Limiting

**Admin Limits:**
- Higher limits than regular users/operators
- Configurable per-endpoint
- No unlimited access (protect against compromised accounts)

**Example Configuration (Reference Only):**
```typescript
// Actual values are environment-defined
const adminLimits = {
  general: '1000 requests per hour',  // Example
  bulk_operations: '100 requests per hour',  // Example
  export: '10 requests per hour'  // Example
};
```

**See:** `API_Rate_Limiting_Throttling_Specification_MVP_v1_CANONICAL.md` Section 3.4 for complete rate limit specification.

### IP Whitelisting (Optional)

**Production Environment:**
- May restrict admin access to specific IP ranges
- Configured at infrastructure level (not API level)
- Bypasses require explicit approval and audit

### Multi-Factor Authentication (Future)

**Status:** 🔴 NOT IN MVP v1

**Planned for v1.1+:**
- MFA required for admin login
- TOTP-based (Google Authenticator, Authy)
- Emergency backup codes

## 3.3. Audit Requirements

**Source:** `Logging_Strategy_CANONICAL_Contract_v2.md` Section 3, `security_and_compliance_plan_mvp_v1.md` Section 6.1

### Mandatory Audit Logging

**Every admin action must log:**
```json
{
  "level": "INFO",
  "timestamp": "2025-12-16T10:30:00.123Z",
  "request_id": "req_admin_abc123",
  "user_id": "admin-user-uuid",
  "user_email": "admin@storagecompare.ae",
  "role": "admin",
  "event": "admin_action_user_suspended",
  "action": "SUSPEND_USER",
  "resource_type": "user",
  "resource_id": "target-user-uuid",
  "details": {
    "reason": "policy violation",
    "previous_status": "active",
    "new_status": "suspended"
  },
  "ip_address": "203.0.113.42",
  "user_agent": "Mozilla/5.0...",
  "duration_ms": 124
}
```

**Critical Fields:**
- `user_id` - Admin who performed action
- `event` - Structured event name
- `action` - Admin action performed
- `resource_type` - Entity affected
- `resource_id` - ID of affected entity
- `details` - Action-specific metadata
- `ip_address` - Source IP
- `timestamp` - ISO 8601 format

### Audit Log Storage

**Requirements:**
- Audit logs stored in separate table/system
- Immutable (INSERT-only, no UPDATE/DELETE)
- Retained for minimum 1 year (configurable)
- Accessible only to admins and auditors

**Alerting:**
- Critical actions trigger real-time alerts
- Examples: user suspension, operator rejection, warehouse disable
- Alerts sent to admin Slack channel and/or email

**See:** `Logging_Strategy_CANONICAL_Contract_v2.md` for complete logging specification.

---

# 4. Admin Domains (MVP v1)

## 4.1. Users Management

**Purpose:**  
Admins can view, search, and manage user accounts.

### 4.1.1. List Users

**Endpoint:** `GET /api/v1/admin/users`

**Description:** Retrieve paginated list of users with filters.

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number (1-indexed) |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `search` | string | ❌ | - | Search by name, email, phone |
| `role` | string | ❌ | - | Filter by role: `user`, `operator`, `admin` |
| `status` | string | ❌ | - | Filter by status: `active`, `suspended`, `deleted` |
| `created_after` | datetime | ❌ | - | ISO 8601 format |
| `created_before` | datetime | ❌ | - | ISO 8601 format |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `email`, `name` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Al-Rashid",
      "phone": "+971501234567",
      "role": "user",
      "status": "active",
      "email_verified": true,
      "created_at": "2025-11-15T10:00:00Z",
      "updated_at": "2025-12-01T14:00:00Z",
      "last_login_at": "2025-12-15T09:30:00Z",
      "bookings_count": 3,
      "reviews_count": 2
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1247,
    "total_pages": 63
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | User ID |
| `email` | string | User email |
| `name` | string | Full name |
| `phone` | string | Phone number (may be null) |
| `role` | enum | `user`, `operator`, `admin` |
| `status` | enum | `active`, `suspended`, `deleted` |
| `email_verified` | boolean | Email verification status |
| `created_at` | datetime | Registration timestamp |
| `updated_at` | datetime | Last update timestamp |
| `last_login_at` | datetime | Last login timestamp (may be null) |
| `bookings_count` | integer | Total bookings count |
| `reviews_count` | integer | Total reviews count |

**Error Responses:**

| Code | HTTP Status | Scenario |
|------|-------------|----------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User role is not `admin` |
| `INVALID_PARAMETER` | 400 | Invalid query parameter value |

### 4.1.2. Get User Details

**Endpoint:** `GET /api/v1/admin/users/{id}`

**Description:** Retrieve detailed information for a specific user.

**Required Role:** `admin`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "role": "user",
    "status": "active",
    "email_verified": true,
    "created_at": "2025-11-15T10:00:00Z",
    "updated_at": "2025-12-01T14:00:00Z",
    "last_login_at": "2025-12-15T09:30:00Z",
    "bookings": {
      "total": 3,
      "pending": 0,
      "confirmed": 1,
      "completed": 2,
      "cancelled": 0
    },
    "reviews": {
      "total": 2,
      "average_rating": 4.5
    },
    "favorites_count": 5,
    "flags": {
      "is_suspended": false,
      "is_verified": true,
      "has_warnings": false
    },
    "notes": [],
    "audit_log_summary": {
      "last_action": "LOGIN",
      "last_action_at": "2025-12-15T09:30:00Z"
    }
  }
}
```

**Additional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `bookings` | object | Booking statistics by status |
| `reviews` | object | Review statistics |
| `favorites_count` | integer | Number of favorite warehouses |
| `flags` | object | User status flags |
| `notes` | array | Admin notes (future) |
| `audit_log_summary` | object | Recent audit activity |

**Error Responses:**

| Code | HTTP Status | Scenario |
|------|-------------|----------|
| `USER_NOT_FOUND` | 404 | User ID not found |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User role is not `admin` |

### 4.1.3. Suspend User

**Endpoint:** `POST /api/v1/admin/users/{id}/suspend`

**Description:** Suspend a user account (prevents login and actions).

**Required Role:** `admin`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

**Request Body:**

```json
{
  "reason": "Suspected fraudulent activity",
  "internal_notes": "Multiple failed payment attempts detected"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | ✅ | Suspension reason (user-visible) |
| `internal_notes` | string | ❌ | Admin notes (internal only) |

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "suspended",
    "suspended_at": "2025-12-16T10:30:00Z",
    "suspended_by": "admin-user-uuid",
    "reason": "Suspected fraudulent activity"
  }
}
```

**Business Logic:**
1. User status changed to `suspended`
2. All active sessions invalidated (JWT refresh tokens deleted)
3. User cannot login until restored
4. Existing bookings remain active (not auto-cancelled)
5. Audit log entry created: `ADMIN_USER_SUSPENDED`
6. User receives email notification (optional in MVP)

**Error Responses:**

| Code | HTTP Status | Scenario |
|------|-------------|----------|
| `USER_NOT_FOUND` | 404 | User ID not found |
| `USER_ALREADY_SUSPENDED` | 422 | User already suspended |
| `CANNOT_SUSPEND_ADMIN` | 422 | Cannot suspend admin users |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User role is not `admin` |

### 4.1.4. Restore User

**Endpoint:** `POST /api/v1/admin/users/{id}/restore`

**Description:** Restore a suspended user account.

**Required Role:** `admin`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | User ID |

**Request Body:**

```json
{
  "reason": "Issue resolved after investigation",
  "internal_notes": "Verified payment issue was bank error"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "restored_at": "2025-12-16T11:00:00Z",
    "restored_by": "admin-user-uuid",
    "reason": "Issue resolved after investigation"
  }
}
```

**Business Logic:**
1. User status changed to `active`
2. User can login again (new JWT required)
3. Audit log entry created: `ADMIN_USER_RESTORED`
4. User receives email notification (optional in MVP)

**Error Responses:**

| Code | HTTP Status | Scenario |
|------|-------------|----------|
| `USER_NOT_FOUND` | 404 | User ID not found |
| `USER_NOT_SUSPENDED` | 422 | User is not suspended |

### 4.1.5. Add User Flag/Note (Future)

**Status:** 🔴 NOT IN MVP v1

**Planned for v1.1+:**
- Add admin notes to user account
- Flag user for review
- Track warning history

---

## 4.2. Operators Management

**Purpose:**  
Admins can review, approve, reject, and manage operator accounts.

**Source:** `User_Operator_Documentation_MVP_v1.md` Section 4.1, `full_database_specification_mvp_v1_CANONICAL.md` Section 2.3

### 4.2.1. List Operators

**Endpoint:** `GET /api/v1/admin/operators`

**Description:** Retrieve paginated list of operators with filters.

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `search` | string | ❌ | - | Search by name, email, company |
| `status` | string | ❌ | - | Filter: `pending`, `approved`, `rejected`, `suspended` |
| `verification_status` | string | ❌ | - | Filter: `pending_verification`, `verified`, `verification_failed` |
| `created_after` | datetime | ❌ | - | ISO 8601 format |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `company_name` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "operator@example.com",
      "name": "Ahmed Al-Mansouri",
      "phone": "+971501234567",
      "company_name": "ООО СкладОК",
      "company_inn": "7701234567",
      "status": "approved",
      "verification_status": "verified",
      "created_at": "2025-11-01T10:00:00Z",
      "approved_at": "2025-11-02T14:30:00Z",
      "approved_by": "admin-uuid",
      "warehouses_count": 2,
      "active_bookings_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 87,
    "total_pages": 5
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Operator ID |
| `user_id` | UUID | Associated user account ID |
| `email` | string | Operator email |
| `name` | string | Contact person name |
| `phone` | string | Contact phone |
| `company_name` | string | Legal company name |
| `company_inn` | string | Tax identification number (INN) |
| `status` | enum | `pending`, `approved`, `rejected`, `suspended` |
| `verification_status` | enum | `pending_verification`, `verified`, `verification_failed` |
| `created_at` | datetime | Registration timestamp |
| `approved_at` | datetime | Approval timestamp (null if not approved) |
| `approved_by` | UUID | Admin who approved (null if not approved) |
| `warehouses_count` | integer | Number of warehouses |
| `active_bookings_count` | integer | Number of active bookings |

### 4.2.2. Get Operator Details

**Endpoint:** `GET /api/v1/admin/operators/{id}`

**Description:** Retrieve detailed operator information including documents.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "operator@example.com",
    "name": "Ahmed Al-Mansouri",
    "phone": "+971501234567",
    "company_name": "ООО СкладОК",
    "company_inn": "7701234567",
    "company_legal_form": "ООО",
    "company_registration_number": "1234567890123",
    "bank_account": {
      "account_number": "40702810100000012345",
      "bank_name": "Сбербанк",
      "bik": "044525225",
      "correspondent_account": "30101810400000000225"
    },
    "status": "approved",
    "verification_status": "verified",
    "documents": [
      {
        "id": "doc-uuid-1",
        "type": "inn_certificate",
        "filename": "inn_certificate.pdf",
        "url": "https://cdn.storagecompare.ae/docs/inn_certificate.pdf",
        "uploaded_at": "2025-11-01T10:30:00Z",
        "verified": true
      },
      {
        "id": "doc-uuid-2",
        "type": "registration_certificate",
        "filename": "ogrn.pdf",
        "url": "https://cdn.storagecompare.ae/docs/ogrn.pdf",
        "uploaded_at": "2025-11-01T10:32:00Z",
        "verified": true
      }
    ],
    "created_at": "2025-11-01T10:00:00Z",
    "approved_at": "2025-11-02T14:30:00Z",
    "approved_by": "admin-uuid",
    "warehouses": [
      {
        "id": "wh-uuid-1",
        "name": "СкладОК Выхино",
        "status": "published",
        "boxes_count": 50
      }
    ],
    "verification_history": [
      {
        "action": "APPROVED",
        "performed_by": "admin-uuid",
        "performed_at": "2025-11-02T14:30:00Z",
        "reason": "All documents verified"
      }
    ]
  }
}
```

**Additional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `company_legal_form` | string | Legal form (ООО, ИП, АО, etc.) |
| `company_registration_number` | string | OGRN/OGRNIP |
| `bank_account` | object | Bank account details |
| `documents` | array | Uploaded verification documents |
| `warehouses` | array | Operator's warehouses |
| `verification_history` | array | Approval/rejection history |

### 4.2.3. Approve Operator

**Endpoint:** `POST /api/v1/admin/operators/{id}/approve`

**Description:** Approve operator account after document verification.

**Required Role:** `admin`

**Request Body:**

```json
{
  "notes": "All documents verified. Company registration confirmed."
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "approved",
    "verification_status": "verified",
    "approved_at": "2025-12-16T10:30:00Z",
    "approved_by": "admin-uuid"
  }
}
```

**Business Logic:**
1. Operator status changed to `approved`
2. Operator can now create warehouses
3. User account remains `active`
4. Audit log entry created: `ADMIN_OPERATOR_APPROVED`
5. Operator receives email notification

**Error Responses:**

| Code | HTTP Status | Scenario |
|------|-------------|----------|
| `OPERATOR_NOT_FOUND` | 404 | Operator ID not found |
| `OPERATOR_ALREADY_APPROVED` | 422 | Operator already approved |
| `DOCUMENTS_NOT_UPLOADED` | 422 | Required documents missing |

### 4.2.4. Reject Operator

**Endpoint:** `POST /api/v1/admin/operators/{id}/reject`

**Description:** Reject operator application.

**Required Role:** `admin`

**Request Body:**

```json
{
  "reason": "Invalid INN certificate. Document appears altered.",
  "internal_notes": "Suspected fraud - escalate to security team"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "rejected",
    "verification_status": "verification_failed",
    "rejected_at": "2025-12-16T10:30:00Z",
    "rejected_by": "admin-uuid",
    "reason": "Invalid INN certificate. Document appears altered."
  }
}
```

**Business Logic:**
1. Operator status changed to `rejected`
2. Operator cannot create warehouses
3. User account remains `active` (can re-apply with correct documents)
4. Audit log entry created: `ADMIN_OPERATOR_REJECTED`
5. Operator receives email with rejection reason

### 4.2.5. Suspend Operator

**Endpoint:** `POST /api/v1/admin/operators/{id}/suspend`

**Description:** Suspend operator account (prevents warehouse management).

**Required Role:** `admin`

**Request Body:**

```json
{
  "reason": "Multiple complaints about warehouse conditions",
  "internal_notes": "Investigation in progress - temp suspension"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "suspended",
    "suspended_at": "2025-12-16T10:30:00Z",
    "suspended_by": "admin-uuid"
  }
}
```

**Business Logic:**
1. Operator status changed to `suspended`
2. Operator cannot edit warehouses or manage bookings
3. Existing warehouses remain published (not auto-hidden)
4. Existing bookings remain active
5. Audit log entry created: `ADMIN_OPERATOR_SUSPENDED`

### 4.2.6. Review Operator Documents

**Endpoint:** `GET /api/v1/admin/operators/{id}/documents`

**Description:** View and download operator verification documents.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "doc-uuid-1",
      "type": "inn_certificate",
      "filename": "inn_certificate.pdf",
      "url": "https://cdn.storagecompare.ae/docs/inn_certificate.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 245678,
      "uploaded_at": "2025-11-01T10:30:00Z",
      "verified": true,
      "verified_by": "admin-uuid",
      "verified_at": "2025-11-02T14:25:00Z"
    }
  ]
}
```

**Document Types:**

| Type | Description | Required |
|------|-------------|----------|
| `inn_certificate` | Tax ID certificate | ✅ |
| `registration_certificate` | Company registration (OGRN) | ✅ |
| `charter` | Company charter/statute | ✅ |
| `bank_details` | Bank account confirmation | ❌ |
| `id_document` | Director ID document | ❌ |

---

## 4.3. Warehouses & Boxes Management

**Purpose:**  
Admins can view, moderate, and manage warehouses and boxes.

### 4.3.1. List Warehouses

**Endpoint:** `GET /api/v1/admin/warehouses`

**Description:** Retrieve paginated list of all warehouses with filters.

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `search` | string | ❌ | - | Search by name, address |
| `status` | string | ❌ | - | Filter: `draft`, `published`, `archived`, `disabled` |
| `operator_id` | UUID | ❌ | - | Filter by operator |
| `city` | string | ❌ | - | Filter by city |
| `has_issues` | boolean | ❌ | - | Filter warehouses with flags/issues |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `name`, `rating` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "operator_id": "660e8400-e29b-41d4-a716-446655440001",
      "operator_name": "ООО СкладОК",
      "name": "СкладОК Выхино",
      "address": "Dubai, ул. Ферганская, 10",
      "status": "published",
      "rating": 4.7,
      "reviews_count": 45,
      "boxes_count": 50,
      "boxes_available": 12,
      "created_at": "2025-10-15T10:00:00Z",
      "published_at": "2025-10-16T14:00:00Z",
      "flags": {
        "has_complaints": false,
        "requires_moderation": false,
        "is_featured": false
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 234,
    "total_pages": 12
  }
}
```

### 4.3.2. Get Warehouse Details

**Endpoint:** `GET /api/v1/admin/warehouses/{id}`

**Description:** Retrieve complete warehouse details including metadata.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "operator_id": "660e8400-e29b-41d4-a716-446655440001",
    "operator": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Ahmed Al-Mansouri",
      "company_name": "ООО СкладОК",
      "email": "operator@example.com",
      "phone": "+971501234567",
      "status": "approved"
    },
    "name": "СкладОК Выхино",
    "description": "Современный склад с климат-контролем...",
    "address": "Dubai, ул. Ферганская, 10",
    "latitude": 55.6992,
    "longitude": 37.8089,
    "status": "published",
    "rating": 4.7,
    "reviews_count": 45,
    "boxes": {
      "total": 50,
      "available": 12,
      "reserved": 5,
      "occupied": 33
    },
    "attributes": ["24_7_access", "video_surveillance", "climate_control"],
    "services": ["packing_materials", "delivery"],
    "photos": [
      {
        "id": "photo-uuid-1",
        "url": "https://cdn.storagecompare.ae/warehouses/photo1.jpg",
        "is_primary": true
      }
    ],
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-12-10T15:00:00Z",
    "published_at": "2025-10-16T14:00:00Z",
    "flags": {
      "has_complaints": false,
      "requires_moderation": false,
      "is_featured": false,
      "is_verified": true
    },
    "moderation_history": [
      {
        "action": "PUBLISHED",
        "performed_by": "admin-uuid",
        "performed_at": "2025-10-16T14:00:00Z",
        "notes": "Initial verification complete"
      }
    ]
  }
}
```

### 4.3.3. Moderate Warehouse

**Endpoint:** `PATCH /api/v1/admin/warehouses/{id}/moderate`

**Description:** Approve or reject warehouse for publishing.

**Required Role:** `admin`

**Request Body:**

```json
{
  "action": "approve",
  "notes": "Warehouse meets quality standards"
}
```

**Request Fields:**

| Field | Type | Required | Values | Description |
|-------|------|----------|--------|-------------|
| `action` | enum | ✅ | `approve`, `reject` | Moderation decision |
| `notes` | string | ❌ | - | Admin notes |
| `reason` | string | Conditional | - | Required if action = `reject` |

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "published",
    "moderated_at": "2025-12-16T10:30:00Z",
    "moderated_by": "admin-uuid"
  }
}
```

**Business Logic:**

**If action = `approve`:**
1. Warehouse status changed to `published` (if was `draft`)
2. Warehouse visible in public search
3. Audit log: `ADMIN_WAREHOUSE_APPROVED`
4. Operator notified

**If action = `reject`:**
1. Warehouse status changed to `archived`
2. Warehouse not visible in public search
3. Operator receives rejection reason
4. Audit log: `ADMIN_WAREHOUSE_REJECTED`

### 4.3.4. Force Disable Warehouse

**Endpoint:** `POST /api/v1/admin/warehouses/{id}/disable`

**Description:** Immediately disable warehouse (emergency action).

**Required Role:** `admin`

**Request Body:**

```json
{
  "reason": "Health and safety violation reported",
  "notify_operator": true,
  "disable_bookings": true
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "disabled",
    "disabled_at": "2025-12-16T10:30:00Z",
    "disabled_by": "admin-uuid"
  }
}
```

**Business Logic:**
1. Warehouse status changed to `disabled`
2. Warehouse hidden from public search immediately
3. Existing bookings:
   - If `disable_bookings = false`: Remain active
   - If `disable_bookings = true`: Cancelled with refunds (future)
4. Operator receives urgent notification
5. Audit log: `ADMIN_WAREHOUSE_DISABLED` (critical alert)

### 4.3.5. Update Warehouse Metadata

**Endpoint:** `PATCH /api/v1/admin/warehouses/{id}`

**Description:** Admin can edit warehouse metadata (emergency fixes).

**Required Role:** `admin`

**Request Body:**

```json
{
  "name": "Corrected Name",
  "description": "Updated description",
  "admin_notes": "Corrected typo in name at operator request"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Corrected Name",
    "description": "Updated description",
    "updated_at": "2025-12-16T10:30:00Z",
    "updated_by": "admin-uuid"
  }
}
```

**Business Logic:**
- Admin can edit any warehouse field
- Operator is notified of changes
- Audit log: `ADMIN_WAREHOUSE_UPDATED`
- Use sparingly (operators should manage own content)

### 4.3.6. View Warehouse Boxes

**Endpoint:** `GET /api/v1/admin/warehouses/{id}/boxes`

**Description:** View all boxes for a warehouse.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "box-uuid-1",
      "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
      "size": "M",
      "number": "M-101",
      "price_per_month": 5000,
      "total_quantity": 10,
      "available_quantity": 3,
      "reserved_quantity": 2,
      "occupied_quantity": 5,
      "is_available": true,
      "status": "active"
    }
  ],
  "summary": {
    "total_boxes": 50,
    "available": 12,
    "reserved": 8,
    "occupied": 30
  }
}
```

---

## 4.4. Bookings Management

**Purpose:**  
Admins can view, search, and manage bookings (including cancellations).

### 4.4.1. List Bookings

**Endpoint:** `GET /api/v1/admin/bookings`

**Description:** Retrieve paginated list of all bookings with filters.

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `status` | string | ❌ | - | Filter: `pending`, `confirmed`, `cancelled`, `completed`, `expired` |
| `user_id` | UUID | ❌ | - | Filter by user |
| `operator_id` | UUID | ❌ | - | Filter by operator |
| `warehouse_id` | UUID | ❌ | - | Filter by warehouse |
| `created_after` | datetime | ❌ | - | ISO 8601 format |
| `created_before` | datetime | ❌ | - | ISO 8601 format |
| `has_issues` | boolean | ❌ | - | Filter bookings flagged for review |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `start_date` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440008",
      "reference_number": "BK-2025-00123",
      "user": {
        "id": "user-uuid",
        "name": "Ahmed Al-Rashid",
        "email": "ivan@example.com"
      },
      "operator": {
        "id": "operator-uuid",
        "name": "ООО СкладОК"
      },
      "warehouse": {
        "id": "warehouse-uuid",
        "name": "СкладОК Выхино"
      },
      "box": {
        "id": "box-uuid",
        "size": "M",
        "number": "M-101"
      },
      "status": "confirmed",
      "start_date": "2025-12-20",
      "end_date": "2026-03-20",
      "duration_months": 3,
      "price_total": 15000,
      "created_at": "2025-12-15T14:00:00Z",
      "confirmed_at": "2025-12-15T15:00:00Z",
      "flags": {
        "has_dispute": false,
        "requires_review": false
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1543,
    "total_pages": 78
  }
}
```

### 4.4.2. Get Booking Details

**Endpoint:** `GET /api/v1/admin/bookings/{id}`

**Description:** Retrieve complete booking details including history.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "reference_number": "BK-2025-00123",
    "user": {
      "id": "user-uuid",
      "name": "Ahmed Al-Rashid",
      "email": "ivan@example.com",
      "phone": "+971501234567"
    },
    "operator": {
      "id": "operator-uuid",
      "name": "ООО СкладОК",
      "contact_email": "operator@example.com"
    },
    "warehouse": {
      "id": "warehouse-uuid",
      "name": "СкладОК Выхино",
      "address": "Dubai, ул. Ферганская, 10"
    },
    "box": {
      "id": "box-uuid",
      "size": "M",
      "number": "M-101",
      "dimensions": "3x2x2.5м"
    },
    "status": "confirmed",
    "payment_status": "paid",
    "start_date": "2025-12-20",
    "end_date": "2026-03-20",
    "duration_months": 3,
    "base_price_per_month": 5000,
    "discount_percentage": 0,
    "monthly_price": 5000,
    "price_total": 15000,
    "deposit": 5000,
    "contact_name": "Ahmed Al-Rashid",
    "contact_phone": "+971501234567",
    "contact_email": "ivan@example.com",
    "notes": "Нужна помощь с погрузкой",
    "special_requests": null,
    "created_at": "2025-12-15T14:00:00Z",
    "confirmed_at": "2025-12-15T15:00:00Z",
    "payment_received_at": "2025-12-15T15:10:00Z",
    "flags": {
      "has_dispute": false,
      "requires_review": false,
      "payment_verified": true
    },
    "history": [
      {
        "status": "pending",
        "timestamp": "2025-12-15T14:00:00Z",
        "actor": "user"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-12-15T15:00:00Z",
        "actor": "operator",
        "notes": "Confirmed by operator"
      }
    ]
  }
}
```

### 4.4.3. Cancel Booking (Admin)

**Endpoint:** `POST /api/v1/admin/bookings/{id}/cancel`

**Description:** Admin can cancel booking on behalf of user or operator.

**Required Role:** `admin`

**Request Body:**

```json
{
  "reason": "User requested emergency cancellation via support",
  "cancel_reason_code": "user_request",
  "refund_amount": 15000,
  "internal_notes": "Full refund approved by support manager"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | ✅ | Cancellation reason (visible to user/operator) |
| `cancel_reason_code` | enum | ✅ | `user_request`, `operator_request`, `admin_decision`, `policy_violation`, `emergency` |
| `refund_amount` | integer | ❌ | Refund amount in kopecks (0 = no refund) |
| `internal_notes` | string | ❌ | Admin-only notes |

**Response: 200 OK**

```json
{
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "status": "cancelled",
    "cancelled_at": "2025-12-16T10:30:00Z",
    "cancelled_by": "system",
    "cancel_reason": "User requested emergency cancellation via support",
    "cancel_reason_code": "user_request",
    "refund_amount": 15000
  }
}
```

**Business Logic:**
1. Booking status changed to `cancelled`
2. Box becomes available again
3. If refund_amount > 0: Refund processed (future MVP)
4. User and operator notified
5. Audit log: `ADMIN_BOOKING_CANCELLED`

### 4.4.4. Flag Booking for Review

**Endpoint:** `POST /api/v1/admin/bookings/{id}/flag`

**Description:** Flag booking for manual review (dispute, fraud, etc.).

**Required Role:** `admin`

**Request Body:**

```json
{
  "flag_type": "dispute",
  "description": "User reports damaged items",
  "internal_notes": "Escalate to operations team"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "flags": {
      "has_dispute": true,
      "requires_review": true,
      "flagged_at": "2025-12-16T10:30:00Z",
      "flagged_by": "admin-uuid"
    }
  }
}
```

**Flag Types:**

| Type | Description |
|------|-------------|
| `dispute` | User/operator dispute |
| `fraud_suspected` | Suspected fraudulent activity |
| `payment_issue` | Payment verification needed |
| `quality_issue` | Warehouse quality complaint |
| `other` | Other issues |

---

## 4.5. Payments (Read-Only)

**Purpose:**  
Admins can view payment and transaction data for reconciliation and support.

**Note:** Payment processing integration is out of scope for MVP v1. This section defines read-only access for when payment data exists.

### 4.5.1. List Transactions

**Endpoint:** `GET /api/v1/admin/payments/transactions`

**Description:** Retrieve paginated list of payment transactions.

**Required Role:** `admin`

**Status:** 🔴 Payment integration not in MVP v1 - Endpoint specification for future reference

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `booking_id` | UUID | ❌ | - | Filter by booking |
| `user_id` | UUID | ❌ | - | Filter by user |
| `status` | string | ❌ | - | Filter: `pending`, `completed`, `failed`, `refunded` |
| `date_from` | date | ❌ | - | ISO date format |
| `date_to` | date | ❌ | - | ISO date format |
| `min_amount` | integer | ❌ | - | Min amount in kopecks |
| `max_amount` | integer | ❌ | - | Max amount in kopecks |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "txn-uuid-1",
      "booking_id": "booking-uuid",
      "user_id": "user-uuid",
      "amount": 15000,
      "currency": "AED",
      "payment_method": "bank_card",
      "status": "completed",
      "provider": "stripe",
      "provider_transaction_id": "2be4f0e9-000f-5000-8000-15a123456789",
      "created_at": "2025-12-15T15:00:00Z",
      "completed_at": "2025-12-15T15:00:15Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 4567,
    "total_pages": 229
  },
  "summary": {
    "total_amount": 68505000,
    "completed_count": 4320,
    "pending_count": 45,
    "failed_count": 187,
    "refunded_count": 15
  }
}
```

### 4.5.2. Get Transaction Details

**Endpoint:** `GET /api/v1/admin/payments/transactions/{id}`

**Description:** Retrieve detailed transaction information.

**Required Role:** `admin`

**Status:** 🔴 Payment integration not in MVP v1

**Response: 200 OK**

```json
{
  "data": {
    "id": "txn-uuid-1",
    "booking": {
      "id": "booking-uuid",
      "reference_number": "BK-2025-00123",
      "user_name": "Ahmed Al-Rashid"
    },
    "user_id": "user-uuid",
    "amount": 15000,
    "currency": "AED",
    "payment_method": "bank_card",
    "card_last4": "4242",
    "status": "completed",
    "provider": "stripe",
    "provider_transaction_id": "2be4f0e9-000f-5000-8000-15a123456789",
    "created_at": "2025-12-15T15:00:00Z",
    "completed_at": "2025-12-15T15:00:15Z",
    "metadata": {
      "ip_address": "203.0.113.42",
      "user_agent": "Mozilla/5.0..."
    }
  }
}
```

### 4.5.3. Refund Status Lookup

**Endpoint:** `GET /api/v1/admin/payments/refunds`

**Description:** View refund requests and status.

**Required Role:** `admin`

**Status:** 🔴 Payment integration not in MVP v1

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "refund-uuid-1",
      "transaction_id": "txn-uuid-1",
      "booking_id": "booking-uuid",
      "amount": 15000,
      "status": "pending",
      "requested_at": "2025-12-16T10:00:00Z",
      "requested_by": "admin-uuid",
      "reason": "Booking cancelled by admin"
    }
  ]
}
```

### 4.5.4. Reconciliation Report

**Endpoint:** `GET /api/v1/admin/payments/reconciliation`

**Description:** Generate reconciliation report for accounting.

**Required Role:** `admin`

**Status:** 🔴 NOT IN MVP v1 - Future feature

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | date | ✅ | Start date (ISO format) |
| `date_to` | date | ✅ | End date (ISO format) |
| `format` | enum | ❌ | `json`, `csv`, `xlsx` (default: `json`) |

---

## 4.6. Content Moderation

**Purpose:**  
Admins can moderate user-generated content (reviews) and detect fraud.

### 4.6.1. List Reviews

**Endpoint:** `GET /api/v1/admin/reviews`

**Description:** Retrieve paginated list of all reviews with moderation filters.

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `warehouse_id` | UUID | ❌ | - | Filter by warehouse |
| `user_id` | UUID | ❌ | - | Filter by user |
| `rating` | integer | ❌ | - | Filter by rating (1-5) |
| `is_visible` | boolean | ❌ | - | Filter by visibility |
| `verified` | boolean | ❌ | - | Filter verified reviews only |
| `flagged_only` | boolean | ❌ | false | Show only flagged reviews |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `rating` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "review-uuid-1",
      "user": {
        "id": "user-uuid",
        "name": "Ahmed A.",
        "email": "ivan@example.com"
      },
      "warehouse": {
        "id": "warehouse-uuid",
        "name": "СкладОК Выхино",
        "operator_name": "ООО СкладОК"
      },
      "booking_id": "booking-uuid",
      "rating": 5,
      "comment": "Отличный склад, всё понравилось!",
      "verified": true,
      "is_visible": true,
      "created_at": "2025-12-10T14:00:00Z",
      "flags": {
        "is_flagged": false,
        "flag_reason": null
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1234,
    "total_pages": 62
  }
}
```

### 4.6.2. Get Review Details

**Endpoint:** `GET /api/v1/admin/reviews/{id}`

**Description:** Retrieve detailed review information.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": {
    "id": "review-uuid-1",
    "user": {
      "id": "user-uuid",
      "name": "Ahmed Al-Rashid",
      "email": "ivan@example.com",
      "total_reviews": 3
    },
    "warehouse": {
      "id": "warehouse-uuid",
      "name": "СкладОК Выхино",
      "operator_name": "ООО СкладОК"
    },
    "booking": {
      "id": "booking-uuid",
      "reference_number": "BK-2025-00100",
      "duration_months": 3,
      "completed_at": "2025-12-05T10:00:00Z"
    },
    "rating": 5,
    "comment": "Отличный склад, всё понравилось! Чисто, безопасно, удобный доступ.",
    "verified": true,
    "is_visible": true,
    "operator_response": null,
    "responded_at": null,
    "created_at": "2025-12-10T14:00:00Z",
    "updated_at": "2025-12-10T14:00:00Z",
    "flags": {
      "is_flagged": false,
      "flag_reason": null,
      "flagged_by": null,
      "flagged_at": null
    },
    "moderation_history": []
  }
}
```

### 4.6.3. Hide/Show Review

**Endpoint:** `PATCH /api/v1/admin/reviews/{id}/visibility`

**Description:** Toggle review visibility (hide spam/inappropriate content).

**Required Role:** `admin`

**Request Body:**

```json
{
  "is_visible": false,
  "reason": "Spam content detected - unrelated promotional text",
  "internal_notes": "User has multiple similar spam reviews"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "review-uuid-1",
    "is_visible": false,
    "hidden_at": "2025-12-16T10:30:00Z",
    "hidden_by": "admin-uuid",
    "reason": "Spam content detected - unrelated promotional text"
  }
}
```

**Business Logic:**
1. Review `is_visible` flag updated
2. Warehouse rating recalculated (hidden reviews excluded)
3. User notified if review hidden
4. Audit log: `ADMIN_REVIEW_HIDDEN` or `ADMIN_REVIEW_RESTORED`

### 4.6.4. Flag Review for Review

**Endpoint:** `POST /api/v1/admin/reviews/{id}/flag`

**Description:** Flag review for manual investigation.

**Required Role:** `admin`

**Request Body:**

```json
{
  "flag_type": "spam",
  "description": "Contains promotional links",
  "internal_notes": "Check other reviews from this user"
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "review-uuid-1",
    "flags": {
      "is_flagged": true,
      "flag_type": "spam",
      "flagged_at": "2025-12-16T10:30:00Z",
      "flagged_by": "admin-uuid"
    }
  }
}
```

**Flag Types:**

| Type | Description |
|------|-------------|
| `spam` | Spam or promotional content |
| `inappropriate` | Offensive or inappropriate language |
| `fake` | Suspected fake review |
| `misleading` | Misleading or false information |
| `duplicate` | Duplicate review from same user |

### 4.6.5. Fraud Detection Dashboard

**Endpoint:** `GET /api/v1/admin/fraud/dashboard`

**Description:** View fraud detection metrics and flagged entities.

**Required Role:** `admin`

**Status:** 🔴 Basic fraud detection only in MVP v1 - Advanced ML in v2

**Response: 200 OK**

```json
{
  "data": {
    "summary": {
      "users_flagged": 12,
      "reviews_flagged": 45,
      "bookings_flagged": 3,
      "operators_under_review": 2
    },
    "recent_flags": [
      {
        "entity_type": "review",
        "entity_id": "review-uuid",
        "flag_type": "spam",
        "confidence": 0.85,
        "flagged_at": "2025-12-16T09:00:00Z"
      }
    ]
  }
}
```

---

## 4.7. CRM Lead Management (Admin View)

**Purpose:**  
Admins can view all CRM leads across all operators for support and oversight.

**Source:** `CRM_Lead_Management_System_MVP_v1_CANONICAL.md`

### 4.7.1. List All Leads

**Endpoint:** `GET /api/v1/admin/crm/leads`

**Description:** Retrieve paginated list of all leads (admin view).

**Required Role:** `admin`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max: 100) |
| `status` | string | ❌ | - | Filter: `new`, `contacted`, `in_progress`, `closed` |
| `warehouse_id` | UUID | ❌ | - | Filter by warehouse |
| `operator_id` | UUID | ❌ | - | Filter by operator |
| `is_spam` | boolean | ❌ | false | Include spam leads |
| `created_after` | datetime | ❌ | - | ISO 8601 format |
| `sort` | string | ❌ | `created_at` | Sort by: `created_at`, `updated_at` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "110e8400-e29b-41d4-a716-446655440011",
      "name": "Ahmed Al-Rashid",
      "phone": "+971501234567",
      "email": "ivan@example.com",
      "warehouse": {
        "id": "warehouse-uuid",
        "name": "СкладОК Выхино"
      },
      "operator": {
        "id": "operator-uuid",
        "name": "ООО СкладОК"
      },
      "preferred_box_size": "M",
      "status": "contacted",
      "is_spam": false,
      "source": "website",
      "created_at": "2025-12-15T14:30:00Z",
      "updated_at": "2025-12-15T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 3456,
    "total_pages": 173
  }
}
```

### 4.7.2. Get Lead Details (Admin)

**Endpoint:** `GET /api/v1/admin/crm/leads/{id}`

**Description:** Retrieve complete lead details including activities.

**Required Role:** `admin`

**Response: 200 OK**

```json
{
  "data": {
    "id": "110e8400-e29b-41d4-a716-446655440011",
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "email": "ivan@example.com",
    "warehouse": {
      "id": "warehouse-uuid",
      "name": "СкладОК Выхино",
      "address": "Dubai, ул. Ферганская, 10"
    },
    "operator": {
      "id": "operator-uuid",
      "name": "ООО СкладОК",
      "contact_email": "operator@example.com"
    },
    "preferred_box_size": "M",
    "status": "contacted",
    "closed_reason": null,
    "related_booking_id": null,
    "is_spam": false,
    "source": "website",
    "notes": "Customer called, interested in M box for 3 months",
    "created_at": "2025-12-15T14:30:00Z",
    "updated_at": "2025-12-15T16:00:00Z",
    "activities": [
      {
        "id": "activity-uuid-1",
        "activity_type": "form_submission",
        "notes": "Lead created from contact form",
        "created_by": "system",
        "created_at": "2025-12-15T14:30:00Z"
      },
      {
        "id": "activity-uuid-2",
        "activity_type": "call",
        "notes": "Called customer, interested in M box",
        "created_by": "operator-uuid",
        "created_at": "2025-12-15T16:00:00Z"
      }
    ],
    "status_history": [
      {
        "old_status": null,
        "new_status": "new",
        "changed_at": "2025-12-15T14:30:00Z"
      },
      {
        "old_status": "new",
        "new_status": "contacted",
        "changed_by": "operator-uuid",
        "changed_at": "2025-12-15T16:00:00Z"
      }
    ]
  }
}
```

### 4.7.3. Reassign Lead to Operator

**Endpoint:** `PATCH /api/v1/admin/crm/leads/{id}/assign`

**Description:** Admin can reassign lead to different operator/warehouse.

**Required Role:** `admin`

**Status:** 🔴 NOT IN MVP v1 - Leads auto-assigned by warehouse, manual reassignment in v1.1

---

# 5. Endpoint Specification Format

## 5.1. Standard Request Format

All admin endpoints follow the same conventions as public API:

**Source:** `api_design_blueprint_mvp_v1_CANONICAL.md` Section 2

### Required Headers

```http
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
Accept: application/json
X-Request-ID: req_admin_abc123 (optional, generated if not provided)
```

### Common Query Parameters

All list endpoints support:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `sort` | string | varies | Sort field |
| `order` | string | `desc` | Sort order: `asc`, `desc` |

## 5.2. Standard Response Format

**Success Response:**
```json
{
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

**Error Response:**
```json
{
  "error_code": "USER_NOT_FOUND",
  "http_status": 404,
  "message": "Пользователь не найден",
  "details": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Source:** `Error_Handling_Fault_Tolerance_Specification_MVP_v1_CANONICAL.md` Section 2

---

# 6. Pagination, Filtering & Sorting

## 6.1. Pagination Standards

**Source:** `api_design_blueprint_mvp_v1_CANONICAL.md` Section 2.8

### Pagination Parameters

| Parameter | Type | Default | Min | Max | Description |
|-----------|------|---------|-----|-----|-------------|
| `page` | integer | 1 | 1 | - | Current page number |
| `per_page` | integer | 20 | 1 | 100 | Items per page |

### Pagination Response

```json
{
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1247,
    "total_pages": 63,
    "has_next": true,
    "has_previous": false
  }
}
```

**Pagination Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Current page number |
| `per_page` | integer | Items per page |
| `total` | integer | Total items across all pages |
| `total_pages` | integer | Total number of pages |
| `has_next` | boolean | Whether next page exists |
| `has_previous` | boolean | Whether previous page exists |

## 6.2. Filtering Standards

### Common Filter Parameters

**Text Search:**
```
GET /api/v1/admin/users?search=ivan
```
- Searches across relevant fields (name, email, etc.)
- Case-insensitive
- Supports partial matching

**Status Filters:**
```
GET /api/v1/admin/operators?status=pending
```
- Exact match on status field
- Multiple values: `status=pending,approved` (comma-separated)

**Date Range Filters:**
```
GET /api/v1/admin/bookings?created_after=2025-12-01&created_before=2025-12-31
```
- ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
- Inclusive ranges

**ID Filters:**
```
GET /api/v1/admin/bookings?user_id=550e8400-e29b-41d4-a716-446655440000
```
- Exact UUID match
- Foreign key filtering

**Boolean Filters:**
```
GET /api/v1/admin/reviews?is_visible=true
```
- Values: `true`, `false`

## 6.3. Sorting Standards

### Sort Parameters

```
GET /api/v1/admin/users?sort=created_at&order=desc
```

**Common Sort Fields:**
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `name` - Alphabetical by name
- `email` - Alphabetical by email
- `status` - By status (enum order)

**Sort Order:**
- `asc` - Ascending (A-Z, 0-9, oldest first)
- `desc` - Descending (Z-A, 9-0, newest first)

**Default Sort:**
- Most list endpoints default to `sort=created_at&order=desc` (newest first)

---

# 7. Audit & Compliance Requirements

## 7.1. Audit Logging Specification

**Source:** `Logging_Strategy_CANONICAL_Contract_v2.md` Section 3, `security_and_compliance_plan_mvp_v1.md` Section 6.1

### Mandatory Audit Events

**All Admin Actions Must Generate Audit Logs:**

| Event Category | Event Name | Log Level | Alert |
|----------------|------------|-----------|-------|
| **User Management** |
| User suspended | `ADMIN_USER_SUSPENDED` | INFO | ❌ |
| User restored | `ADMIN_USER_RESTORED` | INFO | ❌ |
| User details viewed | `ADMIN_USER_VIEWED` | DEBUG | ❌ |
| **Operator Management** |
| Operator approved | `ADMIN_OPERATOR_APPROVED` | INFO | ❌ |
| Operator rejected | `ADMIN_OPERATOR_REJECTED` | INFO | ❌ |
| Operator suspended | `ADMIN_OPERATOR_SUSPENDED` | INFO | ✅ |
| Documents viewed | `ADMIN_DOCUMENTS_VIEWED` | DEBUG | ❌ |
| **Warehouse Management** |
| Warehouse approved | `ADMIN_WAREHOUSE_APPROVED` | INFO | ❌ |
| Warehouse rejected | `ADMIN_WAREHOUSE_REJECTED` | INFO | ❌ |
| Warehouse disabled | `ADMIN_WAREHOUSE_DISABLED` | WARN | ✅ |
| Metadata updated | `ADMIN_WAREHOUSE_UPDATED` | INFO | ❌ |
| **Booking Management** |
| Booking cancelled | `ADMIN_BOOKING_CANCELLED` | INFO | ❌ |
| Booking flagged | `ADMIN_BOOKING_FLAGGED` | INFO | ❌ |
| **Content Moderation** |
| Review hidden | `ADMIN_REVIEW_HIDDEN` | INFO | ❌ |
| Review restored | `ADMIN_REVIEW_RESTORED` | INFO | ❌ |
| Review flagged | `ADMIN_REVIEW_FLAGGED` | INFO | ❌ |
| **Payment/Transactions** |
| Transaction viewed | `ADMIN_TRANSACTION_VIEWED` | DEBUG | ❌ |
| Refund initiated | `ADMIN_REFUND_INITIATED` | INFO | ✅ |

### Audit Log Structure

```json
{
  "level": "INFO",
  "timestamp": "2025-12-16T10:30:00.123Z",
  "request_id": "req_admin_abc123",
  "admin_user_id": "admin-uuid",
  "admin_email": "admin@storagecompare.ae",
  "admin_role": "admin",
  "event": "ADMIN_USER_SUSPENDED",
  "action": "SUSPEND_USER",
  "resource_type": "user",
  "resource_id": "target-user-uuid",
  "resource_email": "user@example.com",
  "details": {
    "reason": "policy violation",
    "previous_status": "active",
    "new_status": "suspended",
    "internal_notes": "multiple fraud flags"
  },
  "ip_address": "203.0.113.42",
  "user_agent": "Mozilla/5.0...",
  "duration_ms": 124
}
```

### Audit Log Retention

**Source:** `Data_retention_policy_mvp_v1.md` Section 4.9

**Retention Period:**
- Admin audit logs: **Minimum 1 year** (recommended: 2 years)
- Critical actions (suspensions, deletions): **3 years**
- Payment-related logs: **7 years** (legal requirement)

**Storage:**
- Immutable append-only table
- No UPDATE or DELETE operations allowed
- Separate from application logs
- Backed up independently

**Access Control:**
- Read access: `admin` role only
- Export access: `admin` role with additional approval
- No programmatic deletion
- Manual deletion requires CTO approval and documented justification

## 7.2. Compliance Requirements

### GDPR Compliance

**Admin Access to Personal Data:**
- All PII access logged (user email, phone, name)
- Access must be justified (support ticket, investigation)
- Users have right to audit who accessed their data

**Data Minimization:**
- Admin endpoints return only necessary fields
- Sensitive fields masked in list views
- Full details require explicit detail endpoint call

**Right to Be Forgotten:**
- Admins can initiate user deletion (soft delete)
- 30-day grace period before hard delete
- Audit logs preserved even after user deletion

### Security Compliance

**Source:** `Security_Architecture_MVP_v1_CANONICAL.md` Section 7

**Access Control:**
- JWT-based authentication required
- Role verification on every request
- Session timeout: 15 minutes (access token)
- No persistent admin sessions

**Audit Requirements:**
- All write operations audited
- Read operations on sensitive data audited
- Failed access attempts logged and alerted

**Incident Response:**
- Unauthorized access attempts trigger alerts
- Suspicious patterns (bulk operations) flagged
- Admin account compromise procedure documented

---

# 8. Error Handling

## 8.1. Admin-Specific Error Codes

**Source:** `Error_Handling_Fault_Tolerance_Specification_MVP_v1_CANONICAL.md`

### Authentication & Authorization Errors

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `UNAUTHORIZED` | 401 | Требуется аутентификация | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Доступ запрещён | User role is not `admin` |
| `TOKEN_EXPIRED` | 401 | Токен истёк | JWT expired |
| `INVALID_TOKEN` | 401 | Неверный токен | JWT signature invalid |
| `ADMIN_ACCESS_REQUIRED` | 403 | Требуются права администратора | Endpoint requires admin role |

### Resource Not Found Errors

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `USER_NOT_FOUND` | 404 | Пользователь не найден | User ID not found |
| `OPERATOR_NOT_FOUND` | 404 | Оператор не найден | Operator ID not found |
| `WAREHOUSE_NOT_FOUND` | 404 | Склад не найден | Warehouse ID not found |
| `BOOKING_NOT_FOUND` | 404 | Бронирование не найдено | Booking ID not found |
| `REVIEW_NOT_FOUND` | 404 | Отзыв не найден | Review ID not found |

### Validation Errors

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `INVALID_PARAMETER` | 400 | Неверный параметр | Query parameter validation failed |
| `MISSING_REQUIRED_FIELD` | 400 | Отсутствует обязательное поле | Required field missing in request body |
| `INVALID_STATUS_TRANSITION` | 422 | Недопустимый переход статуса | Status transition not allowed |
| `INVALID_DATE_RANGE` | 400 | Неверный диапазон дат | date_from > date_to |

### Business Logic Errors

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `USER_ALREADY_SUSPENDED` | 422 | Пользователь уже заблокирован | User already suspended |
| `USER_NOT_SUSPENDED` | 422 | Пользователь не заблокирован | Cannot restore non-suspended user |
| `OPERATOR_ALREADY_APPROVED` | 422 | Оператор уже одобрен | Operator already approved |
| `CANNOT_SUSPEND_ADMIN` | 422 | Невозможно заблокировать администратора | Cannot suspend admin users |
| `DOCUMENTS_NOT_UPLOADED` | 422 | Документы не загружены | Required documents missing |
| `CANNOT_DELETE_ACTIVE_WAREHOUSE` | 422 | Невозможно удалить активный склад | Warehouse has active bookings |

### Rate Limiting Errors

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `RATE_LIMIT_EXCEEDED` | 429 | Превышен лимит запросов | Admin rate limit exceeded |
| `BULK_OPERATION_LIMIT` | 429 | Превышен лимит массовых операций | Too many bulk operations |

## 8.2. Error Response Format

**Standard Error Response:**

```json
{
  "error_code": "USER_NOT_FOUND",
  "http_status": 404,
  "message": "Пользователь не найден",
  "details": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "requested_at": "2025-12-16T10:30:00Z"
  }
}
```

**Error Response Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error_code` | string | ✅ | Machine-readable error code |
| `http_status` | integer | ✅ | HTTP status code |
| `message` | string | ✅ | Human-readable error message (English) |
| `details` | object | ❌ | Additional error context |

## 8.3. Error Handling Guidelines

**For Admins:**
1. All errors logged with full context
2. 5xx errors trigger alerts
3. Retryable: 500, 502, 503, 504
4. Non-retryable: 400, 401, 403, 404, 422, 429

**For Developers:**
1. Use specific error codes
2. Include actionable details
3. Log error context (request_id, user_id, resource_id)
4. Never expose sensitive data in error responses

---

# 9. Non-Goals

## 9.1. Explicitly Out of Scope (MVP v1)

The following features are **NOT** included in Admin API MVP v1:

### Sub-Roles & Granular Permissions
- ❌ Moderator role
- ❌ Support role
- ❌ Read-only auditor role
- ❌ Custom permission sets
- ❌ Role-based field visibility

**Status:** Planned for v1.1+

### Bulk Operations
- ❌ Bulk user suspension
- ❌ Bulk operator approval
- ❌ Bulk review moderation
- ❌ Bulk data export

**Status:** Planned for v1.1+

### Advanced Analytics
- ❌ Admin dashboard with charts
- ❌ User behavior analytics
- ❌ Operator performance metrics
- ❌ Revenue reporting
- ❌ Custom reports

**Status:** Planned for v2+

### Automated Actions
- ❌ Auto-suspend users after X flags
- ❌ Auto-hide reviews matching patterns
- ❌ Auto-escalation for pending approvals
- ❌ Scheduled tasks/cron jobs UI

**Status:** Planned for v2+

### Payment Processing
- ❌ Refund initiation
- ❌ Payment method management
- ❌ Chargeback handling
- ❌ Payout management

**Status:** Payment integration not in MVP v1, admin features in v1.2+

### Advanced Content Moderation
- ❌ ML-based spam detection
- ❌ Sentiment analysis
- ❌ Image content moderation
- ❌ Profanity filtering

**Status:** Basic fraud detection in MVP, advanced ML in v2+

### Communication Tools
- ❌ In-app messaging to users
- ❌ Email template management
- ❌ Notification scheduling
- ❌ Announcement system

**Status:** Planned for v1.1+

### System Configuration UI
- ❌ Rate limit configuration
- ❌ Feature flags UI
- ❌ Environment variable management
- ❌ Database migrations UI

**Status:** Infrastructure/DevOps tools, not API scope

### Advanced Audit Features
- ❌ Audit log search/filtering UI
- ❌ Compliance report generation
- ❌ Data access reports
- ❌ GDPR request workflow

**Status:** Basic audit logging in MVP, advanced features in v2+

## 9.2. Non-Admin API Scope

This document does NOT define:

- ❌ Public API endpoints (see `api_design_blueprint_mvp_v1_CANONICAL.md`)
- ❌ Operator API endpoints (see `api_design_blueprint_mvp_v1_CANONICAL.md` Section 6)
- ❌ Frontend implementation (see `Frontend_Architecture_Specification_v1_5_FINAL.md`)
- ❌ Backend implementation (see `backend_implementation_plan_mvp_v1_CANONICAL.md`)
- ❌ Database schema (see `full_database_specification_mvp_v1_CANONICAL.md`)
- ❌ Infrastructure/deployment (see `Technical_Architecture_Document_MVP_v1_CANONICAL.md`)
- ❌ UI/UX design (see `Design_System_Overview_MVP_v1.md`)

---

# 10. Admin Endpoint Matrix

## 10.1. Complete Endpoint List

| Domain | Endpoint | Method | Role | Description |
|--------|----------|--------|------|-------------|
| **Users** |
| Users | `/api/v1/admin/users` | GET | admin | List all users |
| Users | `/api/v1/admin/users/{id}` | GET | admin | Get user details |
| Users | `/api/v1/admin/users/{id}/suspend` | POST | admin | Suspend user |
| Users | `/api/v1/admin/users/{id}/restore` | POST | admin | Restore suspended user |
| **Operators** |
| Operators | `/api/v1/admin/operators` | GET | admin | List all operators |
| Operators | `/api/v1/admin/operators/{id}` | GET | admin | Get operator details |
| Operators | `/api/v1/admin/operators/{id}/approve` | POST | admin | Approve operator |
| Operators | `/api/v1/admin/operators/{id}/reject` | POST | admin | Reject operator |
| Operators | `/api/v1/admin/operators/{id}/suspend` | POST | admin | Suspend operator |
| Operators | `/api/v1/admin/operators/{id}/documents` | GET | admin | View operator documents |
| **Warehouses** |
| Warehouses | `/api/v1/admin/warehouses` | GET | admin | List all warehouses |
| Warehouses | `/api/v1/admin/warehouses/{id}` | GET | admin | Get warehouse details |
| Warehouses | `/api/v1/admin/warehouses/{id}/moderate` | PATCH | admin | Approve/reject warehouse |
| Warehouses | `/api/v1/admin/warehouses/{id}/disable` | POST | admin | Force disable warehouse |
| Warehouses | `/api/v1/admin/warehouses/{id}` | PATCH | admin | Update warehouse metadata |
| Warehouses | `/api/v1/admin/warehouses/{id}/boxes` | GET | admin | View warehouse boxes |
| **Bookings** |
| Bookings | `/api/v1/admin/bookings` | GET | admin | List all bookings |
| Bookings | `/api/v1/admin/bookings/{id}` | GET | admin | Get booking details |
| Bookings | `/api/v1/admin/bookings/{id}/cancel` | POST | admin | Cancel booking (admin) |
| Bookings | `/api/v1/admin/bookings/{id}/flag` | POST | admin | Flag booking for review |
| **Payments** |
| Payments | `/api/v1/admin/payments/transactions` | GET | admin | List transactions (future) |
| Payments | `/api/v1/admin/payments/transactions/{id}` | GET | admin | Get transaction details (future) |
| Payments | `/api/v1/admin/payments/refunds` | GET | admin | List refunds (future) |
| Payments | `/api/v1/admin/payments/reconciliation` | GET | admin | Reconciliation report (future) |
| **Content Moderation** |
| Reviews | `/api/v1/admin/reviews` | GET | admin | List all reviews |
| Reviews | `/api/v1/admin/reviews/{id}` | GET | admin | Get review details |
| Reviews | `/api/v1/admin/reviews/{id}/visibility` | PATCH | admin | Hide/show review |
| Reviews | `/api/v1/admin/reviews/{id}/flag` | POST | admin | Flag review |
| Fraud | `/api/v1/admin/fraud/dashboard` | GET | admin | Fraud detection dashboard |
| **CRM** |
| CRM | `/api/v1/admin/crm/leads` | GET | admin | List all leads |
| CRM | `/api/v1/admin/crm/leads/{id}` | GET | admin | Get lead details |

**Total Admin Endpoints in MVP v1:** 29 endpoints (25 implemented, 4 future)

---

# Appendix A: Admin Roles Matrix (Detailed)

## A.1. Action-Role Permission Matrix

| Action | Admin | Moderator | Support | Read-Only |
|--------|-------|-----------|---------|-----------|
| **Authentication & Access** |
| Login to admin panel | ✅ | 🔴 | 🔴 | 🔴 |
| View dashboard | ✅ | 🔴 | 🔴 | 🔴 |
| Access audit logs | ✅ | ❌ | ❌ | 🔴 |
| **User Management** |
| List users | ✅ | 🔴 | 🔴 | 🔴 |
| View user details | ✅ | 🔴 | 🔴 | 🔴 |
| Suspend user | ✅ | 🔴 | ❌ | ❌ |
| Restore user | ✅ | 🔴 | ❌ | ❌ |
| Delete user | ✅ | ❌ | ❌ | ❌ |
| Export user data | ✅ | ❌ | ❌ | 🔴 |
| **Operator Management** |
| List operators | ✅ | 🔴 | 🔴 | 🔴 |
| View operator details | ✅ | 🔴 | 🔴 | 🔴 |
| View documents | ✅ | 🔴 | 🔴 | 🔴 |
| Approve operator | ✅ | 🔴 | ❌ | ❌ |
| Reject operator | ✅ | 🔴 | ❌ | ❌ |
| Suspend operator | ✅ | 🔴 | ❌ | ❌ |
| Restore operator | ✅ | 🔴 | ❌ | ❌ |
| **Warehouse Management** |
| List warehouses | ✅ | 🔴 | 🔴 | 🔴 |
| View warehouse details | ✅ | 🔴 | 🔴 | 🔴 |
| Moderate warehouse | ✅ | 🔴 | ❌ | ❌ |
| Force disable | ✅ | 🔴 | ❌ | ❌ |
| Edit metadata | ✅ | 🔴 | ❌ | ❌ |
| View boxes | ✅ | 🔴 | 🔴 | 🔴 |
| **Booking Management** |
| List bookings | ✅ | 🔴 | 🔴 | 🔴 |
| View booking details | ✅ | 🔴 | 🔴 | 🔴 |
| Cancel booking | ✅ | 🔴 | ❌ | ❌ |
| Flag booking | ✅ | 🔴 | ❌ | ❌ |
| View history | ✅ | 🔴 | 🔴 | 🔴 |
| **Payment/Transactions** |
| List transactions | ✅ | ❌ | 🔴 | 🔴 |
| View transaction details | ✅ | ❌ | 🔴 | 🔴 |
| View refunds | ✅ | ❌ | 🔴 | 🔴 |
| Initiate refund | ✅ | ❌ | ❌ | ❌ |
| Reconciliation | ✅ | ❌ | ❌ | 🔴 |
| **Content Moderation** |
| List reviews | ✅ | 🔴 | 🔴 | 🔴 |
| View review details | ✅ | 🔴 | 🔴 | 🔴 |
| Hide review | ✅ | 🔴 | ❌ | ❌ |
| Show review | ✅ | 🔴 | ❌ | ❌ |
| Flag review | ✅ | 🔴 | ❌ | ❌ |
| View fraud dashboard | ✅ | 🔴 | 🔴 | 🔴 |
| **CRM** |
| List leads | ✅ | 🔴 | 🔴 | 🔴 |
| View lead details | ✅ | 🔴 | 🔴 | 🔴 |
| Reassign lead | ✅ | 🔴 | ❌ | ❌ |
| View activities | ✅ | 🔴 | 🔴 | 🔴 |
| **System & Config** |
| View system config | ✅ | ❌ | ❌ | 🔴 |
| Update system config | ✅ | ❌ | ❌ | ❌ |
| Manage feature flags | ✅ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ = Full access in MVP v1
- 🔴 = Planned for future (v1.1+), not in MVP v1
- ❌ = No access (now and future)

---

# Appendix B: Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Technical Documentation Engine | Initial complete specification |

---

# Appendix C: Cross-References

This document is strictly aligned with the following CORE specifications:

1. **`api_design_blueprint_mvp_v1_CANONICAL.md`** - API conventions, error format, pagination
2. **`Technical_Architecture_Document_MVP_v1_CANONICAL.md`** - System architecture, service boundaries
3. **`full_database_specification_mvp_v1_CANONICAL.md`** - Data model, tables, enums
4. **`Security_Architecture_MVP_v1_CANONICAL.md`** - Security model, RBAC
5. **`security_and_compliance_plan_mvp_v1.md`** - Security implementation, access control
6. **`Error_Handling_Fault_Tolerance_Specification_MVP_v1_CANONICAL.md`** - Error codes, error handling
7. **`Logging_Strategy_CANONICAL_Contract_v2.md`** - Audit logging, log format
8. **`API_Rate_Limiting_Throttling_Specification_MVP_v1_CANONICAL.md`** - Admin rate limits
9. **`CRM_Lead_Management_System_MVP_v1_CANONICAL.md`** - CRM domain specification
10. **`User_Operator_Documentation_MVP_v1.md`** - User/operator capabilities
11. **`Monitoring_and_Observability_Plan_MVP_v1_CANONICAL.md`** - Monitoring, alerting
12. **`Data_retention_policy_mvp_v1.md`** - Data retention, audit log retention

---

**END OF DOCUMENT**

---

**Document Status:** 🟢 GREEN - CANONICAL

**Ready for Implementation:** ✅ Yes

**Next Steps:**
1. Backend team implements admin endpoints per this specification
2. Frontend team builds admin panel UI
3. QA team creates admin endpoint test suite
4. DevOps configures admin rate limits and alerts
