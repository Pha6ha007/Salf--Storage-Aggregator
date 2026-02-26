# Security and Compliance Plan - MVP v1
# Self-Storage Aggregator Platform

**Document Version:** 1.0 CANONICAL  
**Date:** December 15, 2025  
**Status:** Approved for MVP Implementation  
**Document Type:** Security Contract and Policy Specification

---

## Document Purpose and Scope

### Purpose

This document defines the **security policies, compliance requirements, and control frameworks** for the Self-Storage Aggregator platform MVP v1. It serves as:

- **Security Contract**: Mandatory security controls and policies
- **Compliance Framework**: Regulatory and legal requirements
- **Control Specification**: What must be protected and how
- **Risk Management**: Threat model and mitigation strategies

**This is NOT an implementation guide.** Implementation details are examples only. Actual implementation may vary based on technical constraints and architectural decisions.

### Scope

**In Scope for MVP v1:**
- Authentication and authorization framework
- API security controls
- Data protection and PII handling
- Encryption standards
- Secrets management policy
- RBAC and access control
- Security monitoring requirements
- Incident response framework
- Basic compliance requirements (GDPR, PDPA)

**Out of Scope for MVP v1:**
- WAF (Web Application Firewall) - planned for v1.1
- IDS/IPS (Intrusion Detection/Prevention) - planned for v1.1
- Advanced anomaly detection and ML-based threat detection - post-MVP
- SOC 2 / ISO 27001 certification - long-term goal
- Bug bounty program - post-launch
- Third-party penetration testing - pre-production

**Governance Note on Regional Variability:**

Security, privacy, and compliance requirements may vary across operational regions. Such regional variations are recognized as policy-level concerns that must not be hardcoded into core business logic or domain models. Regional-specific requirements are addressed through configuration and policy layers, maintaining architectural flexibility while preserving domain integrity. This document establishes unified security governance principles applicable across all operational contexts; region-specific compliance rules and legal frameworks are maintained separately and applied through appropriate policy mechanisms.

### Dependencies

This document aligns with and depends on:
- **Functional Specification MVP v1** - Product requirements and user flows
- **Technical Architecture Document** - System architecture and components
- **API Design Blueprint MVP v1** - API endpoints and authentication flows
- **Database Specification MVP v1** - Data model and RLS policies
- **Logging Strategy & Log Taxonomy MVP v1** - Security event logging (referenced, not duplicated)
- **Error Handling & Fault Tolerance Specification** - Security error handling
- **Rate Limiting Specification** - API protection controls

---

## Table of Contents

1. [Security Objectives and Success Criteria](#1-security-objectives-and-success-criteria)
2. [Access Control and RBAC](#2-access-control-and-rbac)
3. [API Security Requirements](#3-api-security-requirements)
4. [Data Protection and PII](#4-data-protection-and-pii)
5. [Encryption Standards](#5-encryption-standards)
6. [Secrets Management](#6-secrets-management)
7. [Secure Development Lifecycle](#7-secure-development-lifecycle)
8. [Compliance Requirements](#8-compliance-requirements)
9. [Security Monitoring](#9-security-monitoring)
10. [Incident Response Framework](#10-incident-response-framework)

**Appendices:**
- A. Stakeholder Responsibility Matrix
- B. Escalation Procedures
- C. Release Security Checklist

---

# 1. Security Objectives and Success Criteria

## 1.1. Core Security Objectives

The platform must achieve the following security objectives:

| Objective | Definition | MVP v1 Success Criteria |
|-----------|-----------|------------------------|
| **Confidentiality** | Protection of user and operator PII and business data | Zero PII leaks, encryption of sensitive data at rest and in transit |
| **Integrity** | Prevention of unauthorized data modification | Full audit trail, prevention of SQL injection and data tampering |
| **Availability** | Platform reliability and resilience | 99% uptime target, DDoS protection via CDN |
| **Authentication** | Reliable user identification | JWT-based authentication for all protected endpoints |
| **Authorization** | Role-based access control | RBAC enforcement, operator data isolation |
| **Accountability** | Action tracking and auditability | All critical operations logged with 1-year retention |

## 1.2. Quantifiable Success Criteria

The MVP v1 security implementation is considered successful when:

- ✅ **Zero critical vulnerabilities** in production environment
- ✅ **100% of API endpoints** protected by authentication (except public endpoints)
- ✅ **100% of passwords and tokens** encrypted using industry-standard algorithms
- ✅ **Automated security scanning** integrated in CI/CD pipeline
- ✅ **Incident response procedures** documented and team trained before launch
- ✅ **Zero unauthorized operator data access** (operator isolation verified)
- ✅ **Rate limiting** active on all public and authenticated endpoints

## 1.3. Threat Model

### Primary Threats (MVP v1)

| Threat | Risk Level | Mitigation Strategy |
|--------|-----------|---------------------|
| **Unauthorized Data Access** | CRITICAL | RBAC, operator scoping, JWT authentication, RLS policies |
| **SQL Injection** | CRITICAL | ORM with parameterized queries, input validation |
| **Brute Force Authentication** | HIGH | Rate limiting on login, account lockout, strong password policy |
| **DDoS Attacks** | HIGH | CDN protection (Cloudflare), rate limiting |
| **XSS (Cross-Site Scripting)** | HIGH | CSP headers, input sanitization, React built-in protection |
| **CSRF (Cross-Site Request Forgery)** | MEDIUM | SameSite cookies, CSRF tokens |
| **Credential Stuffing** | MEDIUM | Rate limiting, login attempt monitoring |
| **API Abuse** | MEDIUM | Rate limiting per role, AI request throttling |

### Out-of-Scope Threats (Post-MVP)

- Advanced persistent threats (APT)
- Zero-day exploits
- Physical security breaches
- Social engineering attacks (beyond basic awareness)
- Supply chain attacks (advanced detection)

## 1.4. Security Architecture Boundaries

### Component Security Matrix

| Component | Technology | Security Controls |
|-----------|-----------|------------------|
| **Frontend (Web)** | Next.js 14, React 18 | HTTPS only, CSP headers, XSS protection, input sanitization |
| **Backend API** | NestJS 10, Node.js 20 | JWT authentication, input validation, rate limiting, CORS |
| **Database** | PostgreSQL 15 + PostGIS | Encryption at rest, RLS policies, parameterized queries only |
| **AI Service** | FastAPI, Claude API | Request rate limiting, API key isolation, input validation |
| **Infrastructure** | Docker, nginx, Cloudflare | TLS 1.2+, firewall rules, DDoS protection, secret rotation |
| **CI/CD** | GitHub Actions | Secret scanning, dependency checks, SAST, container scanning |

### Security Perimeter

**Trusted Zone:**
- Backend API (authenticated requests)
- Database (encrypted connections)
- Internal service-to-service communication

**DMZ (Demilitarized Zone):**
- CDN (Cloudflare)
- Public API endpoints (search, listings)
- Static assets

**Untrusted Zone:**
- All client browsers
- Third-party integrations (future)
- Public internet traffic

---

# 2. Access Control and RBAC

## 2.1. Role-Based Access Control (RBAC) Framework

### Role Hierarchy

The platform implements a four-tier role hierarchy with strict least-privilege enforcement:

| Role | Description | Authentication Required | Primary Use Cases |
|------|-------------|------------------------|------------------|
| **Guest** | Anonymous user | No | Browse warehouses, view public listings, use search/filters |
| **User** | Registered customer | Yes (email + password) | Create bookings, write reviews, manage favorites |
| **Operator** | Warehouse manager | Yes + approval required | Manage own warehouses, boxes, and associated bookings |
| **Admin** | Platform administrator | Yes (created manually) | Full system access, moderation, user management |

### Role Transitions

```
Guest ──register──> User
User ──apply + approval──> Operator
Admin (manually created by existing Admin)
```

### Role Constraints

**Policy:** Operators must be explicitly approved by an Admin before gaining access to management functions.

**Policy:** Admin accounts can only be created by existing Admins (no self-service registration).

**Policy:** Role changes (except Guest → User) require audit logging.

## 2.2. Permission Matrix

### Resource Access Control

| Resource | Action | Guest | User | Operator | Admin |
|----------|--------|-------|------|----------|-------|
| **Warehouses** | List/Search/View | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ❌ | ✅ (own only) | ✅ (any) |
| | Update | ❌ | ❌ | ✅ (own only) | ✅ (any) |
| | Delete | ❌ | ❌ | ✅ (own only) | ✅ (any) |
| **Boxes** | View | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ❌ | ✅ (own warehouses) | ✅ (any) |
| | Update | ❌ | ❌ | ✅ (own warehouses) | ✅ (any) |
| | Delete | ❌ | ❌ | ✅ (own warehouses) | ✅ (any) |
| **Bookings** | Create | ❌ | ✅ | ✅ | ✅ |
| | View Own | ❌ | ✅ | ✅ | ✅ |
| | Approve/Reject | ❌ | ❌ | ✅ (own warehouses) | ✅ (any) |
| | Cancel | ❌ | ✅ (own) | ✅ (own warehouse) | ✅ (any) |
| **Reviews** | View | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ✅ | ✅ | ✅ |
| | Moderate/Delete | ❌ | ❌ | ❌ | ✅ |
| **AI Features** | Box Finder | Limited quota | Higher quota | Higher quota | Unlimited |

**Note:** Actual quota values are configurable via environment/SRE configuration (see Rate Limiting Specification).

## 2.3. Operator Data Isolation (Critical Security Control)

### Isolation Policy

**CRITICAL REQUIREMENT:** Operators MUST have access ONLY to data belonging to their own warehouses.

**Scope of Isolation:**
- Warehouses owned by the operator
- Boxes belonging to operator's warehouses
- Bookings for operator's boxes
- Reviews for operator's warehouses
- Leads assigned to operator's warehouses

**Enforcement Layers:**

#### Layer 1: Database (Row-Level Security)

**Policy:** PostgreSQL Row-Level Security (RLS) policies MUST be enabled on all operator-scoped tables.

**Reference Implementation (example):**

```sql
-- Example RLS policy for warehouses table
-- Note: This is illustrative. Actual implementation may vary based on DB schema.

CREATE POLICY operator_isolation_policy ON warehouses
    FOR ALL
    TO selfstorage_api
    USING (
        operator_id = current_setting('app.current_operator_id')::INTEGER
        OR current_setting('app.user_role') = 'admin'
    );

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

**Requirements:**
- RLS must be enabled on: `warehouses`, `boxes`, `bookings`, `leads`
- Session variables must be set before queries: `app.current_operator_id`, `app.user_role`
- Admin role bypasses RLS policies

#### Layer 2: Backend Guards

**Policy:** Backend API MUST validate operator ownership before allowing resource access.

**Reference Implementation (example - illustrative code):**

```typescript
// Reference implementation for operator scoping guard
// Note: This is an example. Actual implementation may vary.

@Injectable()
export class OperatorScopingGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Admins bypass isolation
    if (user.role === 'admin') return true;
    
    // Verify operator role
    if (user.role !== 'operator') {
      throw new ForbiddenException('Operator role required');
    }
    
    // Verify operator approval status
    const operator = await this.operatorsService.findByUserId(user.id);
    if (!operator || operator.status !== 'approved') {
      throw new ForbiddenException('Operator account not approved');
    }
    
    // Attach operator ID to request context
    request.operatorId = operator.id;
    
    // Verify resource ownership
    const resourceId = request.params.id;
    if (resourceId) {
      const hasAccess = await this.verifyResourceAccess(resourceId, operator.id);
      if (!hasAccess) {
        throw new ForbiddenException('Resource not owned by operator');
      }
    }
    
    return true;
  }
}
```

**Requirements:**
- Guard MUST be applied to all operator-scoped endpoints
- Ownership verification MUST happen before any data operations
- Failed ownership checks MUST log security events (see Logging Strategy)

#### Layer 3: Service Layer

**Policy:** Service methods MUST always filter by operator ID when retrieving data.

**Reference Implementation (example - illustrative code):**

```typescript
// Reference implementation for operator-scoped service
// Note: This is an example. Actual implementation may vary.

@Injectable()
export class WarehousesService {
  
  async findByOperator(operatorId: number): Promise<Warehouse[]> {
    // Always scope queries by operator ID
    return this.warehousesRepository.find({
      where: { operator_id: operatorId },
    });
  }

  async create(dto: CreateWarehouseDto, operatorId: number): Promise<Warehouse> {
    // Always inject operator ID
    return this.warehousesRepository.save({
      ...dto,
      operator_id: operatorId,
    });
  }

  async update(id: number, dto: UpdateWarehouseDto, operatorId: number): Promise<Warehouse> {
    // Verify ownership before update
    const warehouse = await this.warehousesRepository.findOne({
      where: { id, operator_id: operatorId },
    });
    
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found or access denied');
    }
    
    return this.warehousesRepository.save({ ...warehouse, ...dto });
  }
}
```

**Requirements:**
- Service methods MUST NOT allow operator ID to be passed from client
- Operator ID MUST be extracted from authenticated session
- All queries MUST include operator ID filter (except admin operations)

### Isolation Verification

**Testing Requirements:**
- Unit tests MUST verify operator ID filtering
- Integration tests MUST verify cross-operator access is blocked
- Security tests MUST attempt unauthorized access to other operators' data

**Monitoring Requirements:**
- Log all failed authorization attempts (see Logging Strategy)
- Alert on unusual patterns of authorization failures
- Track operator isolation policy effectiveness metrics

---

# 3. API Security Requirements

## 3.1. Authentication Framework

### JWT-Based Authentication

**Policy:** All protected API endpoints MUST require valid JWT tokens.

**Token Types:**

| Token Type | Purpose | Validity Period | Storage |
|-----------|---------|----------------|---------|
| **Access Token** | API authentication | Configurable (e.g., 15-60 minutes) | Memory (frontend) |
| **Refresh Token** | Token renewal | Configurable (e.g., 7-30 days) | HTTP-only cookie |

**Note:** Actual TTL values are configurable via environment variables and should be determined by security/UX balance.

### Password Security Policy

**Requirements:**

- **Hashing Algorithm:** bcrypt or Argon2
- **Salt Rounds:** Configurable (minimum 10, recommended 12+)
- **Password Complexity:** Configurable policy with minimum requirements:
  - Minimum length (e.g., 8-12 characters)
  - Character diversity (uppercase, lowercase, digits, special characters)
  - Common password blacklist (e.g., "password123")

**Reference Implementation (example - illustrative code):**

```typescript
// Reference password policy configuration
// Note: Actual values are configurable via environment.

export const PASSWORD_POLICY = {
  hashing: {
    algorithm: 'bcrypt', // or 'argon2'
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  },
  complexity: {
    minLength: process.env.PASSWORD_MIN_LENGTH || 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigits: true,
    requireSpecialChars: true,
  },
  restrictions: {
    maxAttempts: process.env.LOGIN_MAX_ATTEMPTS || 5,
    lockoutDuration: process.env.LOGIN_LOCKOUT_DURATION || '15m',
  },
};
```

### Token Management

**Policy:** Tokens MUST be invalidated on logout or security events.

**Requirements:**
- Implement token blacklist or short-lived tokens with refresh rotation
- Revoke all tokens on password change
- Revoke all tokens on suspicious activity detection
- Store refresh tokens securely (HTTP-only, SameSite cookies)

## 3.2. Input Validation and Sanitization

### Validation Policy

**Policy:** ALL user inputs MUST be validated before processing.

**Requirements:**

- **Whitelist Approach:** Accept only known-good patterns
- **Type Validation:** Enforce strict type checking
- **Length Limits:** Enforce maximum lengths for all string inputs
- **Format Validation:** Validate email, phone, URL, postal code formats
- **Range Validation:** Validate numeric ranges (e.g., price > 0)

**Reference Implementation (example - illustrative code):**

```typescript
// Reference input validation using class-validator
// Note: This is illustrative. Actual implementation may vary.

export class CreateWarehouseDto {
  @IsString()
  @Length(3, 200)
  @Matches(/^[a-zA-Z0-9\s\-.,]+$/)
  name: string;

  @IsString()
  @Length(10, 1000)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(10000)
  pricePerMonth: number;

  @IsEnum(WarehouseType)
  type: WarehouseType;
}
```

**Validation Library Recommendation:** class-validator (NestJS), joi, or zod.

### SQL Injection Prevention

**Policy:** Raw SQL queries are FORBIDDEN unless absolutely necessary and reviewed.

**Requirements:**
- Use ORM (TypeORM) with parameterized queries for all database operations
- If raw queries are necessary, use parameterized/prepared statements
- Never concatenate user input into SQL strings
- Enable query logging in development for audit

### XSS Prevention

**Policy:** User-generated content MUST be sanitized before display.

**Frontend Requirements:**
- React's built-in XSS protection (automatic escaping)
- Content Security Policy (CSP) headers
- Sanitize HTML if rich text is supported (use DOMPurify)

**Backend Requirements:**
- Validate and sanitize on input
- Encode outputs appropriately for context (HTML, URL, JavaScript)

## 3.3. Rate Limiting and Throttling

**Policy:** All API endpoints MUST have rate limiting to prevent abuse.

**Detailed Specification:** See `API_Rate_Limiting_Throttling_Specification_MVP_v1_COMPLETE.md`

**Summary Requirements:**

| Endpoint Type | Rate Limit (configurable) | Enforcement Level |
|--------------|--------------------------|------------------|
| **Public/Anonymous** | Lower quota (e.g., 100 req/min) | IP-based |
| **Authenticated Users** | Higher quota (e.g., 300 req/min) | User-based |
| **Login Attempts** | Strict limit (e.g., 5 per 15 min) | IP + user combination |
| **AI Requests** | Tiered by role | User + endpoint-specific |

**Note:** Specific values are configurable and should be tuned based on production traffic patterns.

## 3.4. CORS Policy

**Policy:** Cross-Origin Resource Sharing (CORS) MUST be configured restrictively.

**Requirements:**

```typescript
// Reference CORS configuration
// Note: Actual domains are environment-specific.

const CORS_CONFIG = {
  origin: process.env.ALLOWED_ORIGINS.split(','), // e.g., ['https://selfstorage.com']
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};
```

**Requirements:**
- Whitelist specific origin(s), not wildcard
- Enable credentials only for trusted origins
- Restrict HTTP methods to those actually used
- Set appropriate preflight cache duration

## 3.5. Security Headers

**Policy:** All API responses MUST include appropriate security headers.

**Required Headers:**

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Content-Security-Policy` | Restrictive policy | Prevent XSS |
| `X-XSS-Protection` | `1; mode=block` | Browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |

**Note:** CSP policy should be tailored to actual resource sources and updated as needed.

---

# 4. Data Protection and PII

## 4.1. PII Classification

### Sensitive Data Categories

| Data Type | Classification | Protection Level | Examples |
|-----------|---------------|-----------------|----------|
| **Authentication Credentials** | CRITICAL | Encrypted (bcrypt/Argon2) | Passwords, API keys |
| **Payment Information** | CRITICAL | Not stored (use payment gateway tokens) | Credit cards, bank details |
| **Personal Identifiers** | HIGH | Encrypted at rest, access-logged | Full name, phone, email |
| **Location Data** | HIGH | Encrypted at rest, operator-isolated | Warehouse addresses |
| **Usage Data** | MEDIUM | Standard protection | Search history, browsing patterns |
| **Public Profile Data** | LOW | Standard protection | Public warehouse listings |

### PII in Database

**Policy:** PII MUST be identified and protected according to classification level.

**Tables Containing PII:**

- `users` - email, phone, full_name, hashed_password
- `operators` - business name, contact info, company registration
- `warehouses` - address (business location)
- `bookings` - customer contact information
- `leads` - customer PII, contact details

**Protection Requirements:**
- Passwords: MUST be hashed (never store plaintext)
- Email/Phone: MAY be stored plaintext for operational purposes but access MUST be logged
- Payment Info: MUST NOT be stored (use tokenization via payment gateway)

## 4.2. Data Encryption

### Encryption at Rest

**Policy:** Sensitive data MUST be encrypted at rest.

**Database Encryption:**
- Enable PostgreSQL encryption at rest (filesystem-level or database-level)
- Encrypt backups
- Secure key storage (see Secrets Management)

**Filesystem Encryption:**
- Enable Docker volume encryption for persistent data
- Encrypt log files containing sensitive information

### Encryption in Transit

**Policy:** ALL data in transit MUST be encrypted using TLS.

**Requirements:**

| Connection Type | Minimum TLS Version | Certificate Requirements |
|----------------|---------------------|------------------------|
| **Client ↔ CDN** | TLS 1.2 | Valid SSL certificate (Let's Encrypt or commercial) |
| **CDN ↔ Backend** | TLS 1.2 | Origin SSL certificate |
| **Backend ↔ Database** | TLS 1.2 | Self-signed acceptable (internal) |
| **Backend ↔ AI Service** | TLS 1.2 | Verify Claude API certificates |

**Certificate Management:**
- Automate certificate renewal (e.g., via Let's Encrypt)
- Monitor certificate expiration (alert 30 days before expiry)
- Maintain certificate inventory

## 4.3. Data Retention and Deletion

### Retention Policy

| Data Type | Retention Period | Justification |
|-----------|-----------------|---------------|
| **User Accounts** | Active + 1 year after last login | GDPR compliance |
| **Bookings** | 3 years | Business/legal requirements |
| **Audit Logs** | 1 year | Security compliance |
| **Security Logs** | 1 year | Incident investigation |
| **Application Logs** | 90 days | Operational troubleshooting |

### Right to Deletion (GDPR Article 17)

**Policy:** Users MUST be able to request account and data deletion.

**Requirements:**
- Implement "Delete My Account" functionality
- Cascade delete or anonymize related data
- Retain only legally required data (e.g., completed transactions for tax purposes)
- Respond to deletion requests within 30 days

**Anonymization vs Deletion:**
- **Delete:** Remove PII completely
- **Anonymize:** Replace PII with pseudonymous IDs (for analytics, if necessary)

**Exceptions:**
- Legal hold: Do not delete data under investigation or litigation
- Contractual obligations: Retain transaction records per legal requirements

## 4.4. Data Access Logging

**Policy:** All access to PII MUST be logged for audit purposes.

**Requirements:**
- Log who accessed PII, when, and for what purpose
- Include: user ID, timestamp, resource type, action, IP address
- Store logs securely with restricted access
- Retain access logs for 1 year

**Reference:** See `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md` for detailed logging specifications.

---

# 5. Encryption Standards

## 5.1. Cryptographic Algorithms

### Approved Algorithms

| Use Case | Algorithm | Key Size | Notes |
|----------|-----------|----------|-------|
| **Password Hashing** | bcrypt or Argon2 | N/A (adaptive cost) | Prefer Argon2 for new implementations |
| **Symmetric Encryption** | AES | 256-bit | For data at rest |
| **Asymmetric Encryption** | RSA | 2048-bit minimum, 4096-bit preferred | For key exchange, if needed |
| **Hashing (non-password)** | SHA-256 or SHA-3 | N/A | For integrity checks |
| **TLS Protocol** | TLS 1.2 or 1.3 | N/A | Disable TLS 1.0, 1.1 |

### Deprecated/Forbidden Algorithms

❌ **Never Use:**
- MD5 (except for non-security purposes like ETags)
- SHA-1 (compromised)
- DES, 3DES (insecure)
- RC4 (compromised)
- Plaintext storage of passwords

## 5.2. Key Management

**Policy:** Encryption keys MUST be managed securely and rotated regularly.

**Requirements:**
- Keys MUST NOT be hardcoded in source code
- Keys MUST be stored in secure key management system (e.g., Docker Secrets, AWS KMS, HashiCorp Vault)
- Keys MUST be rotated periodically (configurable schedule, e.g., every 90 days)
- Key access MUST be logged and restricted to authorized services only

**Key Rotation Strategy:**
- Support multiple active keys simultaneously (old + new)
- Gradual migration from old to new key
- Secure deletion of old keys after migration

---

# 6. Secrets Management

## 6.1. Secret Types

### Platform Secrets

| Secret Type | Examples | Storage Method | Rotation Frequency |
|------------|----------|---------------|-------------------|
| **Database Credentials** | PostgreSQL password | Environment variables / Secrets manager | Configurable (e.g., 90 days) |
| **API Keys** | Claude API key, payment gateway keys | Environment variables / Secrets manager | On suspicion of compromise |
| **JWT Signing Keys** | JWT secret | Environment variables / Secrets manager | Configurable (e.g., 90 days) |
| **Service Credentials** | Docker registry, CDN API keys | CI/CD secrets | On suspicion of compromise |
| **TLS Private Keys** | SSL certificate private keys | Filesystem (encrypted), Secrets manager | Annually or on compromise |

## 6.2. Secret Storage Policy

**Policy:** Secrets MUST NEVER be committed to version control or logged in plaintext.

**Requirements:**

### Development Environment
- Use `.env` files (excluded via `.gitignore`)
- Provide `.env.example` with dummy values
- Document all required secrets in README

### Staging/Production Environment
- Use Docker Secrets, Kubernetes Secrets, or cloud-native secret managers (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)
- Mount secrets as files or environment variables at runtime
- Restrict access to secrets based on service account roles

### CI/CD Environment
- Store secrets in GitHub Actions Secrets or equivalent
- Never print secrets in logs
- Rotate CI/CD secrets periodically

## 6.3. Secret Rotation

**Policy:** All secrets MUST support rotation without service downtime.

**Requirements:**
- Implement graceful key rotation (support multiple valid keys simultaneously)
- Automate rotation where possible (e.g., database password rotation script)
- Alert when manual rotation is due
- Document rotation procedures

## 6.4. Secret Leakage Prevention

**Policy:** Prevent accidental secret exposure in logs, errors, and version control.

**Requirements:**

### CI/CD Integration
- Use Gitleaks or TruffleHog for pre-commit secret scanning
- Fail builds if secrets are detected in commits
- Integrate secret scanning in GitHub Actions

**Reference Implementation (example - illustrative workflow):**

```yaml
# Reference CI/CD secret scanning workflow
# Note: Actual implementation may vary based on CI/CD platform.

name: Secret Scan

on: [push, pull_request]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Logging Protection
- Sanitize logs to remove secrets (see Logging Strategy)
- Mask secrets in error messages
- Never log full JWT tokens (log last 4 characters only)

---

# 7. Secure Development Lifecycle (SDLC)

## 7.1. Security in Development

### Code Review Requirements

**Policy:** All code changes MUST undergo security-focused code review.

**Security Review Checklist:**
- [ ] Input validation present and comprehensive
- [ ] Authentication/authorization checks in place
- [ ] No hardcoded secrets or credentials
- [ ] Proper error handling without information disclosure
- [ ] Logging of security-relevant events
- [ ] No introduction of known vulnerable dependencies

### Secure Coding Standards

**Requirements:**
- Follow OWASP Top 10 prevention guidelines
- Use linting tools with security rules (e.g., ESLint with security plugins)
- Adopt framework-specific security best practices (NestJS, Next.js security guides)

## 7.2. Automated Security Testing (CI/CD)

### Pipeline Security Gates

**Policy:** CI/CD pipeline MUST include automated security checks that MUST pass before deployment.

**Required Checks:**

| Check Type | Tool Recommendation | Failure Threshold | Frequency |
|-----------|-------------------|-------------------|-----------|
| **Dependency Scanning** | npm audit, Snyk, Dependabot | High/Critical vulnerabilities | Every commit |
| **Static Analysis (SAST)** | ESLint security rules, SonarQube | Critical issues | Every commit |
| **Secret Scanning** | Gitleaks, TruffleHog | Any secrets found | Every commit |
| **Container Scanning** | Trivy, Clair | High/Critical vulnerabilities | On image build |
| **License Compliance** | license-checker | Incompatible licenses | Weekly |

**Reference Implementation (example - illustrative workflow):**

```yaml
# Reference CI/CD security pipeline
# Note: Actual implementation may vary.

name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Dependency Check
        run: npm audit --audit-level=high
      
      - name: Secret Scan
        uses: gitleaks/gitleaks-action@v2
      
      - name: SAST
        run: npm run lint:security
      
      - name: Container Scan
        run: trivy image --severity HIGH,CRITICAL my-app:latest
```

### Dynamic Testing

**Post-MVP / Optional:**
- Dynamic Application Security Testing (DAST)
- Penetration testing before production launch
- Ongoing security regression testing

## 7.3. Dependency Management

**Policy:** All dependencies MUST be regularly audited and updated.

**Requirements:**
- Run `npm audit` or `yarn audit` regularly (automated in CI/CD)
- Enable Dependabot or Renovate for automated dependency updates
- Review and merge security patches within SLA:
  - Critical: 24 hours
  - High: 1 week
  - Medium: 1 month
  - Low: Next release cycle

**Dependency Approval:**
- Evaluate new dependencies for security posture before adoption
- Prefer well-maintained, reputable packages
- Avoid packages with known vulnerabilities or unmaintained status

---

# 8. Compliance Requirements

## 8.1. GDPR (General Data Protection Regulation)

### Applicability

**Policy:** The platform MUST comply with GDPR when processing data of EU residents.

### Key GDPR Requirements

| Article | Requirement | Implementation |
|---------|-------------|----------------|
| **Article 5** | Data minimization | Collect only necessary PII |
| **Article 6** | Lawful basis | User consent (terms acceptance) |
| **Article 7** | Consent | Clear opt-in for marketing |
| **Article 13** | Transparency | Privacy policy, data usage disclosure |
| **Article 15** | Right of access | User can request their data |
| **Article 17** | Right to erasure | Account deletion functionality |
| **Article 25** | Privacy by design | Security built into architecture |
| **Article 32** | Security measures | Encryption, access control, audit logs |
| **Article 33** | Breach notification | Notify authorities within 72 hours |

### Data Subject Rights

**Requirements:**

1. **Right to Access (Article 15):**
   - Implement API endpoint or portal for users to download their data
   - Format: JSON or CSV
   - Response time: 30 days maximum

2. **Right to Deletion (Article 17):**
   - Implement account deletion functionality
   - Cascade delete or anonymize dependent records
   - Retain only legally required data

3. **Right to Data Portability (Article 20):**
   - Export user data in machine-readable format (JSON)

4. **Right to Rectification (Article 16):**
   - Allow users to update their profile information

## 8.2. PDPA (Personal Data Protection Act - Singapore)

### Applicability

**Policy:** The platform MUST comply with PDPA when processing data of Singapore residents.

### Key PDPA Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Consent** | Obtain user consent for data collection |
| **Purpose Limitation** | Use data only for stated purposes |
| **Notification** | Inform users of data collection purposes |
| **Access & Correction** | Allow users to access and correct data |
| **Accuracy** | Ensure data accuracy |
| **Protection** | Implement security measures |
| **Retention Limitation** | Delete data when no longer needed |
| **Transfer Limitation** | Ensure data protection in cross-border transfers |

### Breach Notification

**Policy:** Notify Singapore PDPC within 72 hours of discovering a notifiable data breach.

**Notifiable Breach Criteria:**
- Significant harm or impact on affected individuals
- Unauthorized access to, collection, use, disclosure, copying, modification, or disposal of personal data

## 8.3. Privacy Policy Requirements

**Policy:** A comprehensive privacy policy MUST be published and kept up-to-date.

**Required Content:**
- Data collected (types and purposes)
- Legal basis for processing
- Data retention periods
- Third-party data sharing (if any)
- User rights (access, deletion, portability, rectification)
- Contact information for data protection inquiries
- Cookie policy (if applicable)
- Changes to policy notification process

**Policy Location:**
- Accessible from all pages (footer link)
- URL: `/privacy-policy`
- Last updated date prominently displayed

## 8.4. Terms of Service

**Policy:** Clear Terms of Service MUST define legal obligations and limitations.

**Required Sections:**
- User responsibilities
- Operator responsibilities
- Prohibited uses
- Intellectual property rights
- Limitation of liability
- Dispute resolution
- Governing law and jurisdiction

---

# 9. Security Monitoring

## 9.1. Monitoring Framework

### Monitoring Objectives

The platform MUST monitor for:

- **Authentication anomalies** (failed logins, unusual patterns)
- **Authorization violations** (unauthorized access attempts)
- **API abuse** (rate limit violations, suspicious traffic patterns)
- **Data access anomalies** (unusual PII access)
- **Infrastructure issues** (service outages, resource exhaustion)
- **Security incidents** (detected attacks, vulnerability exploitation)

### Monitoring Architecture

**Policy:** Security monitoring MUST be integrated into the overall observability stack.

**Components:**
- **Application Logs:** Structured logs with security events (see Logging Strategy)
- **Metrics:** Time-series data on security-relevant metrics (e.g., failed login rate)
- **Alerts:** Real-time notifications for critical security events
- **Dashboards:** Visual representation of security posture

**Reference:** See `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md` for detailed logging specifications.

## 9.2. Security Event Logging

### Critical Security Events (MUST Log)

**Policy:** The following security events MUST be logged for audit and incident response.

| Event Type | Log Level | Required Fields | Retention |
|-----------|-----------|----------------|-----------|
| **Authentication Events** | | | |
| Login success | INFO | user_id, ip_address, timestamp, user_agent | 1 year |
| Login failure | WARN | username, ip_address, timestamp, failure_reason | 1 year |
| Account lockout | ERROR | user_id, ip_address, timestamp, lockout_reason | 1 year |
| Password change | INFO | user_id, timestamp, ip_address | 1 year |
| Logout | INFO | user_id, session_id, timestamp | 90 days |
| **Authorization Events** | | | |
| Authorization success | DEBUG | user_id, resource, action, timestamp | 90 days |
| Authorization failure | WARN | user_id, resource, action, timestamp, reason | 1 year |
| Role change | INFO | admin_id, target_user_id, old_role, new_role, timestamp | 1 year |
| **Data Access Events** | | | |
| PII access | INFO | user_id, data_type, record_id, timestamp, purpose | 1 year |
| Bulk data export | INFO | user_id, export_type, record_count, timestamp | 1 year |
| **Security Events** | | | |
| Rate limit exceeded | WARN | user_id/ip, endpoint, timestamp, limit_type | 90 days |
| CSRF token mismatch | ERROR | session_id, ip_address, timestamp | 1 year |
| SQL injection attempt (detected) | CRITICAL | ip_address, endpoint, payload, timestamp | 1 year |
| Suspicious activity detected | ERROR | user_id/ip, activity_type, details, timestamp | 1 year |
| **Administrative Actions** | | | |
| Operator approval/rejection | INFO | admin_id, operator_id, action, timestamp | 1 year |
| User account creation (admin) | INFO | admin_id, new_user_id, role, timestamp | 1 year |
| Configuration change | INFO | admin_id, config_key, old_value, new_value, timestamp | 1 year |

**Format:** See Logging Strategy for JSON schema and structured logging requirements.

**Integration:** Security logs MUST be ingested into centralized logging system for analysis and alerting.

## 9.3. Alerting Rules

### Alert Severity Levels

| Severity | Response Time | Escalation |
|----------|--------------|------------|
| **CRITICAL** | Immediate (< 15 minutes) | On-call engineer + Security Lead |
| **HIGH** | < 1 hour | Security Team + DevOps |
| **MEDIUM** | < 4 hours | Create ticket |
| **LOW** | Next business day | Backlog |

### Critical Alerts (MVP v1 Scope)

**Policy:** The following conditions MUST trigger immediate alerts.

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| **Multiple Failed Logins** | > threshold failed logins from same IP or user in time window (configurable) | HIGH | Investigate, consider IP block |
| **Admin Account Compromise (Suspected)** | Admin login from new location/device + suspicious activity | CRITICAL | Lock account, notify security team |
| **Operator Data Isolation Breach** | Operator accessed data not owned by them | CRITICAL | Lock account, investigate immediately |
| **Rate Limit Exceeded (Persistent)** | User/IP exceeds rate limit repeatedly | MEDIUM | Block or throttle further |
| **Database Connection Failure** | Backend cannot connect to database | CRITICAL | Page on-call, check infrastructure |
| **Unusual Data Export Volume** | Large data export by single user (> threshold) | HIGH | Investigate for data exfiltration |
| **SSL Certificate Expiring** | < 30 days until expiry | HIGH | Renew certificate |
| **High Error Rate** | API error rate > threshold | HIGH | Investigate, check for attack |

**Note:** Specific threshold values (e.g., number of failed logins, time windows) are configurable via environment/SRE configuration.

**Reference Implementation (example - illustrative alerting logic):**

```typescript
// Reference alerting logic for failed login detection
// Note: This is illustrative. Actual implementation may vary.

@Injectable()
export class SecurityMonitoringService {
  
  async checkFailedLoginAttempts(username: string, ipAddress: string): Promise<void> {
    const threshold = parseInt(process.env.FAILED_LOGIN_THRESHOLD || '5');
    const timeWindow = parseInt(process.env.FAILED_LOGIN_WINDOW_MINUTES || '15');
    
    const recentAttempts = await this.getFailedAttemptsInWindow(
      username, 
      ipAddress, 
      timeWindow
    );
    
    if (recentAttempts >= threshold) {
      await this.triggerAlert({
        severity: 'HIGH',
        type: 'MULTIPLE_FAILED_LOGINS',
        metadata: { username, ipAddress, attempts: recentAttempts },
      });
      
      await this.lockAccount(username);
    }
  }
}
```

### Post-MVP / Advanced Security Monitoring

**Out of Scope for MVP v1 (Post-MVP features):**

- **Anomaly Detection:** Machine learning-based detection of unusual patterns
- **Behavioral Analytics:** User behavior profiling and deviation detection
- **Threat Intelligence Integration:** Integration with external threat feeds
- **Automated Incident Response:** Self-healing and automated mitigation
- **Advanced SIEM:** Sophisticated security information and event management
- **MTTR/MTTD Dashboards:** Mean Time To Resolve/Detect metrics visualization

---

# 10. Incident Response Framework

## 10.1. Incident Classification

### Incident Severity Matrix

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|--------------|
| **CRITICAL** | Immediate threat to data, users, or platform availability | Data breach confirmed, SQL injection successful, admin account compromised, DDoS causing outage | < 15 minutes |
| **HIGH** | Significant security concern requiring urgent attention | Multiple unauthorized access attempts, suspected data breach, vulnerability actively exploited | < 1 hour |
| **MEDIUM** | Security issue requiring investigation but not immediately threatening | Brute force attempts, unusual traffic patterns, non-critical vulnerability | < 4 hours |
| **LOW** | Minor security concern or informational | Single failed login, low-severity vulnerability detected | Next business day |

### Incident Types

| Type | Definition | Potential Impact |
|------|-----------|-----------------|
| **Unauthorized Access** | Access to system or data without authorization | Data breach, system compromise |
| **Data Breach** | Confirmed unauthorized access to PII | Legal liability, reputation damage, user trust loss |
| **DDoS Attack** | Distributed denial of service disrupting availability | Service outage, revenue loss |
| **SQL Injection** | Successful SQL injection attack | Data breach, data corruption |
| **Account Compromise** | User or operator account taken over | Unauthorized actions, data access |
| **Malware** | Malicious code detected in system | System compromise, data theft |
| **Insider Threat** | Malicious action by authorized user | Data breach, sabotage |

## 10.2. Incident Response Process

### Response Phases

**1. Detection and Analysis**
- Identify security event
- Classify severity and type
- Determine scope and impact
- Assign incident ID and owner

**2. Containment**
- Stop ongoing attack or breach
- Isolate affected systems
- Prevent further damage
- Document containment actions

**3. Eradication**
- Remove threat from system
- Patch vulnerabilities
- Close security gaps
- Verify threat elimination

**4. Recovery**
- Restore systems to normal operation
- Verify system integrity
- Monitor for recurrence
- Communicate with stakeholders

**5. Post-Incident Activities**
- Conduct Root Cause Analysis (RCA)
- Document lessons learned
- Implement preventive measures
- Update incident response procedures

### Incident Response Roles

| Role | Responsibilities |
|------|-----------------|
| **Incident Commander** | Overall incident coordination, decision authority |
| **Security Lead** | Technical security analysis, forensics |
| **DevOps/SRE** | Infrastructure containment, system recovery |
| **Backend Lead** | Application-layer investigation and fixes |
| **Legal** | Legal implications, regulatory notification |
| **Communications** | Internal and external communications |

## 10.3. Containment Actions

### Immediate Containment Procedures

**Policy:** Predefined containment actions MUST be available for common incident types.

**Reference Implementation (example - illustrative containment logic):**

```typescript
// Reference incident containment service
// Note: This is illustrative. Actual implementation may vary.

@Injectable()
export class IncidentContainmentService {
  
  async executeContainment(incident: SecurityIncident): Promise<void> {
    switch (incident.type) {
      case 'UNAUTHORIZED_ACCESS':
        await this.revokeUserSessions(incident.metadata?.userId);
        await this.requirePasswordReset(incident.metadata?.userId);
        break;
      
      case 'BRUTE_FORCE_ATTACK':
        await this.blockIPAddress(incident.metadata?.ipAddress);
        await this.enableStrictRateLimit(incident.metadata?.userId);
        break;
      
      case 'ADMIN_ACCOUNT_COMPROMISED':
        await this.revokeAllAdminSessions();
        await this.disableCompromisedAccount(incident.metadata?.userId);
        await this.requirePasswordResetForAllAdmins();
        break;
      
      case 'SQL_INJECTION_SUCCESSFUL':
        await this.enableDatabaseReadOnlyMode();
        await this.blockSuspiciousIPs(incident.metadata?.sourceIPs);
        break;
      
      case 'DDOS_ATTACK':
        await this.enableDDoSMitigation();
        await this.enableCloudflareUnderAttackMode();
        break;
      
      case 'DATA_BREACH_CONFIRMED':
        await this.disableDataExports();
        await this.notifyAffectedUsers(incident.metadata?.affectedUserIds);
        break;
    }
  }
}
```

**Requirements:**
- Containment actions MUST be documented and tested
- Containment MUST prioritize stopping ongoing damage
- All containment actions MUST be logged with timestamp and actor

## 10.4. Escalation Matrix

### Escalation Procedures

**Reference escalation matrix (example):**

```typescript
// Reference escalation configuration
// Note: Actual escalation contacts and timing are environment-specific.

export const ESCALATION_MATRIX = {
  CRITICAL: {
    initial: {
      team: ['on-call-engineer', 'security-lead'],
      response_time: 'Configurable (e.g., < 15 min)',
    },
    level_1: {
      trigger: 'Immediately',
      team: ['cto', 'devops-lead', 'backend-lead'],
      notify: ['email', 'sms', 'slack'],
    },
    level_2: {
      trigger: 'Configurable (e.g., if not contained in 30 min)',
      team: ['ceo', 'legal'],
      notify: ['email', 'sms', 'phone'],
    },
    level_3: {
      trigger: 'If data breach confirmed',
      team: ['board', 'external-counsel', 'pr-team'],
      external: ['data-protection-authority', 'law-enforcement'],
    },
  },
  HIGH: {
    initial: {
      team: ['security-team', 'backend-team'],
      response_time: 'Configurable (e.g., < 1 hour)',
    },
    level_1: {
      trigger: 'Immediately',
      team: ['security-lead', 'devops-lead'],
      notify: ['email', 'slack'],
    },
    level_2: {
      trigger: 'Configurable (e.g., if not resolved in 2 hours)',
      team: ['cto'],
      notify: ['email', 'sms'],
    },
  },
};
```

**Note:** Specific escalation timing and contacts are configurable based on organization structure.

## 10.5. Root Cause Analysis (RCA)

### RCA Process

**Policy:** A Root Cause Analysis MUST be conducted for all HIGH and CRITICAL incidents.

**RCA Template:**

```markdown
# Root Cause Analysis: [Incident Type]

**Incident ID:** [ID]
**Date:** [Date]
**Prepared By:** Security Team

## Executive Summary
**What Happened:** [Brief description]
**Impact:** [Affected users/systems]
**Root Cause:** [Core issue]
**Resolution:** [How resolved]

## Timeline
- **[Timestamp]**: [Event]
- ...

## 5 Whys Analysis
1. **Why did this happen?** [Answer]
2. **Why?** [Answer]
3. **Why?** [Answer]
4. **Why?** [Answer]
5. **Root Cause:** [Core systemic issue]

## Contributing Factors
**Technical:** [List]
**Process:** [List]
**Human:** [List]

## Impact Analysis
- Users Affected: [Number]
- Data Exposed: [Types]
- Services Disrupted: [Services]
- Financial Impact: [Estimate, if applicable]

## What Went Well
- [Point]

## What Could Be Improved
- [Point]

## Action Items
| # | Task | Owner | Priority | Deadline | Status |
|---|------|-------|----------|----------|--------|
| 1 | [Task] | [Owner] | High | [Date] | Open |

## Prevention Measures
**Immediate (0-7 days):** [Measures]
**Short-term (1-3 months):** [Measures]
**Long-term (3-12 months):** [Measures]
```

### RCA Review

**Policy:** RCA documents MUST be reviewed by security team and relevant stakeholders.

**Requirements:**
- RCA completed within 7 days of incident resolution
- Action items assigned and tracked
- RCA findings shared with engineering team
- Updates to security procedures based on lessons learned

## 10.6. Breach Notification

### Regulatory Notification Requirements

| Regulation | Authority Notification Deadline | User Notification Deadline |
|------------|-------------------------------|---------------------------|
| **GDPR** | 72 hours from discovery | Without undue delay (if high risk) |
| **PDPA** | 72 hours from discovery (notifiable breaches) | If likely to cause significant harm |

### Breach Notification Process

**Policy:** In the event of a data breach, the platform MUST comply with regulatory notification requirements.

**Reference Implementation (example - illustrative notification service):**

```typescript
// Reference breach notification service
// Note: This is illustrative. Actual implementation may vary.

@Injectable()
export class BreachNotificationService {
  
  async notifyAffectedUsers(userIds: number[], incident: SecurityIncident): Promise<void> {
    for (const userId of userIds) {
      await this.emailService.send(userId, {
        subject: 'Important Security Notice',
        template: 'security-incident',
        data: {
          incident_type: incident.type,
          description: this.getUserFriendlyDescription(incident),
          actions_taken: incident.containment_actions,
          user_actions: [
            'We recommend changing your password',
            'Review your account activity',
            'Contact us if you notice suspicious activity',
          ],
          contact_email: 'security@selfstorage.com',
        },
      });
    }
  }

  async notifyDataProtectionAuthority(incident: SecurityIncident): Promise<void> {
    const report = {
      organization: 'Self-Storage Aggregator Platform',
      incident_type: incident.type,
      detected_at: incident.detected_at,
      affected_users: incident.metadata?.affected_users_count,
      data_types: incident.metadata?.exposed_data_types,
      containment_actions: incident.containment_actions,
      preventive_measures: incident.preventive_measures,
    };

    // Forward to Legal team for authority notification
    await this.emailService.sendToLegal({
      subject: `[URGENT] Data Breach Report - ${incident.type}`,
      body: `72-hour deadline for authority notification.\n\nReport:\n${JSON.stringify(report, null, 2)}`,
    });
  }
}
```

**Requirements:**
- Breach assessment completed within 24 hours of detection
- Authority notification submitted within 72 hours (GDPR, PDPA)
- User notification without undue delay if high risk
- Notification content includes: incident type, data exposed, actions taken, user recommendations

---

# Appendices

## Appendix A: Stakeholder Responsibility Matrix

| Role | Security Responsibilities |
|------|-------------------------|
| **Product Owner** | Define security requirements, prioritize security features, approve security policies |
| **CTO / Security Lead** | Overall security strategy, incident response leadership, compliance oversight |
| **Backend Developer** | Implement authentication/authorization, secure API endpoints, input validation, secure coding practices |
| **Frontend Developer** | XSS/CSRF prevention, secure form handling, client-side validation, secure state management |
| **DevOps / SRE** | Infrastructure security, secrets management, CI/CD security, monitoring and alerting, backup and recovery |
| **QA Engineer** | Security testing, vulnerability validation, regression testing for security controls |
| **Legal / Compliance** | Regulatory compliance, privacy policy, terms of service, breach notification, data protection authority liaison |

## Appendix B: Escalation Contact Information

**Note:** Actual contact details are organization-specific and should be maintained separately in a secure, accessible location.

| Role | Contact Method | Availability |
|------|---------------|--------------|
| **On-Call Engineer** | Email: oncall@selfstorage.com, Slack: @oncall | 24/7 |
| **Security Lead** | Email: security-lead@selfstorage.com, Phone: [TBD] | 24/7 for critical |
| **DevOps Lead** | Email: devops-lead@selfstorage.com, Slack: @devops-lead | Business hours + on-call |
| **CTO** | Email: cto@selfstorage.com, Phone: [TBD] | As needed |
| **Legal** | Email: legal@selfstorage.com | Business hours |

**External Contacts:**

| Organization | Purpose | Contact |
|--------------|---------|---------|
| **Data Protection Authority** | Breach notification | [Region-specific, TBD] |
| **Let's Encrypt** | SSL certificates | https://letsencrypt.org |
| **Cloudflare Support** | CDN/DDoS issues | https://cloudflare.com/support |

## Appendix C: Release Security Checklist

### Pre-Release Security Verification

**Policy:** ALL items on this checklist MUST be completed and verified before production deployment.

- [ ] **Dependency Security**
  - [ ] `npm audit` passed with no HIGH/CRITICAL vulnerabilities
  - [ ] Snyk scan passed
  - [ ] All dependencies up-to-date or exceptions documented
  
- [ ] **Code Security**
  - [ ] ESLint security rules passed
  - [ ] No hardcoded secrets (Gitleaks scan passed)
  - [ ] Code review completed with security focus
  
- [ ] **Authentication & Authorization**
  - [ ] All protected endpoints require valid JWT
  - [ ] RBAC permissions verified for all endpoints
  - [ ] Operator data isolation tested and verified
  - [ ] Password policy enforced
  
- [ ] **API Security**
  - [ ] Rate limiting configured and tested
  - [ ] CORS policy configured correctly
  - [ ] Input validation on all endpoints
  - [ ] Security headers configured
  
- [ ] **Infrastructure Security**
  - [ ] SSL certificates valid and auto-renewal configured
  - [ ] TLS 1.2+ enforced
  - [ ] Secrets stored securely (no plaintext in configs)
  - [ ] Database RLS policies enabled
  - [ ] Firewall rules configured
  
- [ ] **Monitoring & Alerting**
  - [ ] Security event logging verified (see Logging Strategy)
  - [ ] Critical alerts configured and tested
  - [ ] Incident response team notified and ready
  
- [ ] **Compliance**
  - [ ] Privacy policy published and accessible
  - [ ] Terms of service published
  - [ ] Data retention policies configured
  - [ ] Breach notification procedures documented
  
- [ ] **Backup & Recovery**
  - [ ] Database backups configured and tested
  - [ ] Backup encryption verified
  - [ ] Disaster recovery plan documented

---

# Post-MVP / Advanced Security Capabilities

**Note:** The following capabilities are OUT OF SCOPE for MVP v1 and are planned for future iterations.

## Advanced Anomaly Detection (Post-MVP)

- **Machine Learning-Based Threat Detection:** Use ML models to identify unusual patterns in user behavior, API usage, and data access
- **Behavioral Analytics:** Profile normal user behavior and alert on deviations
- **Advanced Statistical Analysis:** Statistical models for fraud detection and abuse prevention
- **Predictive Security:** Anticipate potential security issues before they occur

## Advanced Incident Response (Post-MVP)

- **Automated Response:** Self-healing systems that automatically respond to common threats
- **AI-Assisted Forensics:** Use AI to accelerate incident investigation and root cause analysis
- **Real-Time Threat Intelligence:** Integration with external threat intelligence feeds
- **Advanced SIEM:** Sophisticated security information and event management platform

## Security Metrics and Dashboards (Post-MVP)

- **MTTR/MTTD Dashboards:** Mean Time To Resolve and Mean Time To Detect visualizations
- **Security Posture Dashboard:** Real-time view of security health
- **Threat Landscape Visualization:** Visual representation of active threats
- **Compliance Dashboard:** Automated compliance status reporting

## Advanced Compliance (Post-MVP)

- **SOC 2 Type II Certification:** Industry-standard security audit
- **ISO 27001 Certification:** International information security standard
- **Bug Bounty Program:** Incentivize external security researchers
- **Regular Penetration Testing:** Ongoing third-party security assessments

---

**END OF DOCUMENT**

**Document Version:** 1.0 CANONICAL  
**Date:** December 15, 2025  
**Status:** Approved for MVP Implementation  

**Change Log:**
- v1.0 CANONICAL: Aligned with canonical MVP v1 format, separated policy from implementation, made thresholds configurable, marked post-MVP features, de-duplicated logging details

**Next Review:** Before MVP v1.1 planning
