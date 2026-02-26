# Service-to-Service Authentication & Secrets Management Specification
# MVP v1 - CANONICAL

**Document ID:** DOC-102  
**Version:** 1.0  
**Status:** 🟢 GREEN - Canonical Source of Truth  
**Last Updated:** December 16, 2025  
**Project:** Self-Storage Aggregator MVP v1

---

## Document Information

| Field | Value |
|-------|-------|
| **Purpose** | Define canonical service authentication and secrets management for internal services |
| **Scope** | Service-to-service authentication within monolithic backend, external service integration, secrets lifecycle |
| **Target Audience** | Backend developers, DevOps/SRE, Security engineers, CI/CD pipeline maintainers |
| **Dependencies** | DOC-078 (Security & Compliance Plan), DOC-079 (Security Architecture), DOC-055 (Logging Strategy), DOC-017 (API Rate Limiting) |
| **Canonical Status** | All service authentication and secrets management MUST follow this specification |
| **Codegen-Ready** | ✅ YES (HIGH) - Auth middleware, policies, CI/CD injection, runtime validation |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Service Identity Model](#2-service-identity-model)
3. [Authentication Mechanisms (MVP)](#3-authentication-mechanisms-mvp)
4. [Secrets Management Strategy](#4-secrets-management-strategy)
5. [Secrets Lifecycle & Rotation](#5-secrets-lifecycle--rotation)
6. [CI/CD & Runtime Integration](#6-cicd--runtime-integration)
7. [Access Control & Scoping](#7-access-control--scoping)
8. [Audit Logging & Monitoring](#8-audit-logging--monitoring)
9. [Failure Modes & Recovery](#9-failure-modes--recovery)
10. [Relationship to Canonical Documents](#10-relationship-to-canonical-documents)
11. [Non-Goals](#11-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document defines the **canonical authentication model for service-to-service communication** and the **secrets management strategy** for the Self-Storage Aggregator platform MVP v1. It establishes:

- How internal services and components authenticate to each other
- How secrets are stored, accessed, rotated, and revoked
- Security boundaries between user authentication and service authentication
- Runtime and CI/CD integration patterns
- Audit and monitoring requirements

This specification is production-ready, supports security audit, and enables implementation without additional clarification.

## 1.2. Scope

**In Scope:**
- Service identity model for internal components
- Service-to-service authentication mechanisms
- External service credential management (AI, maps, notifications, storage)
- Secrets storage, encryption, and access control
- Secrets rotation and revocation procedures
- CI/CD secrets injection patterns
- Audit logging for authentication and secrets access
- Failure modes and degraded operation

**Out of Scope:**
- User authentication (defined in DOC-078, DOC-079)
- Public API authentication (defined in API Blueprint)
- Infrastructure authentication (cloud provider IAM)
- Database authentication (covered in deployment specs)
- Zero-trust networking architecture (future: v2+)

## 1.3. Explicit Separation from User Authentication

**CRITICAL DISTINCTION:**

This document describes **service-to-service authentication**, which is:
- Completely independent from user JWT authentication
- Uses different token types, lifecycles, and validation mechanisms
- Operates at the infrastructure/service layer, not the application/user layer
- Never exposed to end users or frontend applications

**User Authentication (NOT covered here):**
- User login with email/password → User JWT (httpOnly cookie)
- User JWT validation for API requests
- User session management
- User authorization (RBAC: user, operator, admin)

**Service Authentication (covered here):**
- Internal module-to-module calls within backend monolith
- Backend-to-external-service calls (AI, maps, notifications)
- Background job authentication
- Health check and monitoring system access

## 1.4. High-Level Threat Model

**Threats Addressed:**
1. **Compromised Service Credentials** - Rotation and revocation limit exposure window
2. **Lateral Movement** - Service scopes prevent compromised component from accessing all resources
3. **Secrets Leakage** - Secrets never in code, logs, or version control
4. **Credential Theft** - Short-lived tokens, encrypted storage, audit trails
5. **Insider Threats** - Least privilege access, comprehensive audit logging

**Security Properties:**
- **Confidentiality** - Secrets encrypted at rest and in transit
- **Integrity** - Token validation prevents tampering
- **Availability** - Graceful degradation when auth systems fail
- **Auditability** - Complete trail of authentication events and secrets access
- **Non-repudiation** - All operations attributed to specific service identity

---

# 2. Service Identity Model

## 2.1. Service Identity Concept

In MVP v1, the platform uses a **monolithic architecture** (single NestJS backend). However, service identity concepts still apply for:

1. **Internal Modules** - Distinct logical components within the monolith
2. **Background Jobs** - Asynchronous task processors
3. **External Integrations** - AI, Maps, Email, SMS, Storage services
4. **Monitoring Systems** - Health checks, metrics collection, log aggregation
5. **Administrative Tools** - Database migrations, maintenance scripts

**Service Identity Definition:**

A service identity is a logical component with:
- Unique identifier (service name)
- Defined scope of access (which resources it can access)
- Independent credentials (tokens, API keys)
- Audit trail of all actions

## 2.2. Service Naming Convention

**Format:** `svc-<component>-<environment>`

**Examples:**

| Service Identity | Description | Environment |
|-----------------|-------------|-------------|
| `svc-api-prod` | Main API backend | Production |
| `svc-api-staging` | Main API backend | Staging |
| `svc-api-dev` | Main API backend | Development |
| `svc-worker-prod` | Background job processor | Production |
| `svc-worker-staging` | Background job processor | Staging |
| `svc-ai-client-prod` | AI service integration | Production |
| `svc-maps-client-prod` | Maps service integration | Production |
| `svc-notification-prod` | Notification sender | Production |
| `svc-health-monitor-prod` | Health check system | Production |
| `svc-metrics-collector-prod` | Metrics aggregation | Production |
| `svc-migration-runner-prod` | Database migration tool | Production |

**Naming Rules:**
- Prefix: Always `svc-`
- Component: Lowercase, hyphen-separated (e.g., `api`, `worker`, `ai-client`)
- Environment suffix: `-dev`, `-staging`, `-prod`
- No special characters except hyphens
- Maximum 50 characters total

## 2.3. Environment Isolation

Service identities are **strictly isolated by environment**:

- **Production** (`-prod`) - Live production credentials, full audit
- **Staging** (`-staging`) - Separate credentials, mirrors production security
- **Development** (`-dev`) - Local development, relaxed but still secure

**Environment Rules:**
1. Credentials NEVER shared between environments
2. Production secrets NEVER used in staging or development
3. Each environment has independent secrets rotation schedules
4. Cross-environment access is forbidden

## 2.4. Principle of Identity Immutability

**Service identities are immutable:**

- A service identity's name does not change
- Credentials can rotate, but identity remains constant
- If a service's role changes significantly, create a new identity
- Old identities are deprecated and revoked, not renamed

**Example:**
- If `svc-notification-prod` needs expanded permissions, either:
  - Update its scope definition (if scope creep is intentional)
  - Create `svc-notification-v2-prod` with new scope (if architectural change)

---

# 3. Authentication Mechanisms (MVP)

## 3.1. Overview

MVP v1 uses **two authentication mechanisms** based on context:

1. **Service JWT** - For internal service-to-service calls
2. **API Keys** - For external service integrations (AI, maps, notifications)

**Mutual TLS (mTLS)** is considered **optional** for MVP v1 and recommended only for:
- High-security internal admin tools
- Cross-network service calls (if multi-region in future)

## 3.2. Service JWT Authentication

### 3.2.1. Purpose

Service JWTs authenticate internal components and background jobs when making requests to internal APIs or shared resources.

**Use Cases:**
- Background job calls to API endpoints
- Internal admin API access
- Health check system authentication
- Metrics collection service authentication

### 3.2.2. JWT Structure

**Service JWT Payload:**

```json
{
  "sub": "svc-worker-prod",
  "type": "service",
  "scopes": [
    "bookings:read",
    "bookings:write",
    "notifications:send"
  ],
  "iss": "auth.storagecompare.ae",
  "aud": "api.storagecompare.ae",
  "iat": 1702300800,
  "exp": 1702387200,
  "jti": "svc_jwt_abc123xyz789"
}
```

**Field Definitions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | string | ✅ | Service identity name (e.g., `svc-worker-prod`) |
| `type` | string | ✅ | Always `"service"` to distinguish from user JWTs |
| `scopes` | array | ✅ | List of authorized scopes (see § 7.2) |
| `iss` | string | ✅ | Token issuer (internal auth service) |
| `aud` | string | ✅ | Token audience (API endpoint) |
| `iat` | integer | ✅ | Issued at timestamp |
| `exp` | integer | ✅ | Expiration timestamp |
| `jti` | string | ✅ | Unique token ID for revocation tracking |

### 3.2.3. Token Lifecycle

**Token Validity:**
- **Development:** 24 hours
- **Staging:** 12 hours
- **Production:** 6 hours

**Rationale:**
- Shorter than user tokens (15 minutes) is impractical for services
- Long enough to avoid constant rotation overhead
- Short enough to limit blast radius of compromise

**Token Renewal:**
- Services automatically request new tokens 1 hour before expiration
- No refresh tokens - services authenticate with long-lived service credentials
- Failed renewal triggers alert and retry with exponential backoff

### 3.2.4. Signing Keys

**Algorithm:** HS256 (HMAC with SHA-256)

**Key Management:**
- Service JWT signing key stored in secrets manager
- Separate from user JWT signing key
- Environment-specific keys (dev, staging, prod)
- Key rotation every 90 days (see § 5)

**Key Naming:**
- `JWT_SERVICE_SECRET` (primary)
- `JWT_SERVICE_SECRET_NEW` (during rotation)
- `JWT_SERVICE_SECRET_OLD` (grace period after rotation)

### 3.2.5. Validation Rules

All service JWTs MUST be validated:

1. **Signature Verification** - Token signed by trusted key
2. **Expiration Check** - Token not expired (`exp` > current time)
3. **Type Validation** - `type` field is `"service"`
4. **Issuer Validation** - `iss` matches expected issuer
5. **Audience Validation** - `aud` matches current service
6. **Scope Verification** - Requested operation is in token's `scopes`
7. **Revocation Check** - Token `jti` not in revocation list (Redis)

**Validation Failure Response:**
- HTTP 401 Unauthorized
- Log authentication attempt with failure reason
- Increment failed authentication metric (Prometheus)

## 3.3. API Key Authentication (External Services)

### 3.3.1. Purpose

API keys authenticate the platform to **external third-party services**:

- **AI Service** - Anthropic Claude API
- **Maps Service** - Google Maps, Google Maps
- **Email Service** - SendGrid
- **SMS Service** - Twilio, Twilio
- **Object Storage** - S3-compatible storage (AWS S3, MinIO)

### 3.3.2. API Key Types

**Long-Lived API Keys:**
- Issued by external service providers
- No expiration (until manually rotated)
- Stored in secrets manager
- Used for all requests to that service

**Service-Specific Patterns:**

| Service | Auth Method | Key Format | Rotation Frequency |
|---------|-------------|-----------|-------------------|
| Claude API | Bearer token | `sk-ant-api...` | 90 days |
| Google Maps | API key | UUID-like | 180 days |
| Google Maps | API key | Alphanumeric | 180 days |
| SendGrid | Bearer token | `SG.xxx.yyy` | 90 days |
| Twilio | Basic auth | SID + Auth Token | 90 days |
| S3 Storage | Access Key/Secret | AWS-style | 90 days |

### 3.3.3. API Key Storage

**Never Store API Keys:**
- ❌ In source code
- ❌ In git repositories (even private)
- ❌ In configuration files in version control
- ❌ In frontend code or build artifacts
- ❌ In logs or error messages

**Always Store API Keys:**
- ✅ In secrets manager (Doppler, AWS Secrets Manager, or HashiCorp Vault)
- ✅ Encrypted at rest
- ✅ Access-controlled by service identity
- ✅ Audited on every access

### 3.3.4. API Key Usage Pattern

**Runtime Access:**

```typescript
// ❌ WRONG - Hardcoded key
const apiKey = 'sk-ant-api-abc123xyz789';

// ✅ CORRECT - Retrieved from secrets manager
const apiKey = await secretsManager.get('ANTHROPIC_API_KEY');
```

**Request Pattern:**

```typescript
// AI service client
async callClaudeAPI(prompt: string): Promise<string> {
  const apiKey = await this.secretsManager.get('ANTHROPIC_API_KEY');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ prompt }),
  });
  
  // Never log the API key
  this.logger.log({
    event: 'ai_api_call',
    status: response.status,
    // DO NOT include apiKey here
  });
  
  return response.json();
}
```

## 3.4. Mutual TLS (mTLS) - Optional

### 3.4.1. When to Use mTLS

mTLS is **OPTIONAL in MVP v1**. Consider mTLS for:

- Internal admin API access (database management, migration tools)
- Cross-network service calls (if multi-region/multi-VPC in future)
- Extremely high-security operations (user data export, PII access)

### 3.4.2. mTLS Certificate Management

**If mTLS is implemented:**

**Certificate Authority (CA):**
- Internal CA for service certificates
- Self-signed CA acceptable for MVP (production should use proper CA)

**Certificate Lifecycle:**
- Validity: 90 days
- Auto-renewal at 60 days
- Revocation via CRL or OCSP

**Trust Boundaries:**
- Service certificates only trusted within same environment
- Staging certificates not trusted in production

### 3.4.3. Implementation Guidance

**NestJS mTLS Example:**

```typescript
// main.ts - Optional mTLS configuration
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // mTLS configuration (optional)
  if (process.env.MTLS_ENABLED === 'true') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.TLS_KEY_PATH),
      cert: fs.readFileSync(process.env.TLS_CERT_PATH),
      ca: fs.readFileSync(process.env.TLS_CA_PATH),
      requestCert: true,
      rejectUnauthorized: true,
    };
    
    await app.listen(3000, '0.0.0.0', () => {
      console.log('Server running with mTLS');
    });
  } else {
    await app.listen(3000);
  }
}
```

**Note:** mTLS adds operational complexity. Only implement if security requirements demand it.

---

# 4. Secrets Management Strategy

## 4.1. Secret Classification

**What is a Secret?**

A secret is any credential, key, or sensitive value that:
- Grants access to a system, service, or resource
- If exposed, could compromise security
- Should never be public or logged

**Secret Types:**

| Secret Type | Examples | Storage | Rotation Frequency |
|-------------|----------|---------|-------------------|
| **Service Credentials** | JWT signing keys | Secrets manager | 90 days |
| **Database Credentials** | PostgreSQL passwords, Redis passwords | Secrets manager | 90 days |
| **API Keys** | Claude API key, Maps API key, SendGrid key | Secrets manager | 90-180 days |
| **Encryption Keys** | Data encryption keys (AES-256) | Secrets manager | 180 days |
| **TLS Certificates** | SSL/TLS private keys | Secrets manager | 90 days |
| **Session Secrets** | Cookie signing keys | Secrets manager | 30 days |

## 4.2. Secrets Storage

### 4.2.1. Storage Options

**MVP v1 Recommended Approach:**

**Option 1: Environment Variables + Encrypted Storage (Development/Staging)**
- Secrets stored in `.env` file (gitignored)
- File encrypted at rest (e.g., using LUKS, FileVault)
- Simple for small teams, low operational overhead

**Option 2: Doppler (Recommended for Production)**
- SaaS secrets manager with good developer experience
- Supports environment-specific secrets
- Built-in rotation support
- Audit logging included
- Cost-effective for MVP (<$10/month)

**Option 3: AWS Secrets Manager (Cloud Deployments)**
- Fully managed by AWS
- Automatic rotation support
- IAM-based access control
- Costs ~$0.40/secret/month + API calls

**Option 4: HashiCorp Vault (Advanced - Post-MVP)**
- Self-hosted or cloud (HCP Vault)
- Enterprise-grade secret management
- Dynamic secrets, PKI, encryption-as-a-service
- Higher operational overhead

**MVP v1 Selection:**
- **Development:** `.env` files (encrypted locally)
- **Staging/Production:** Doppler or AWS Secrets Manager

### 4.2.2. Encryption at Rest

**All secrets MUST be encrypted at rest:**

- **Application-Level:** Secrets manager handles encryption (AES-256-GCM)
- **Infrastructure-Level:** Underlying storage encrypted (AWS EBS encryption, disk encryption)
- **Transport-Level:** All secrets fetched over TLS 1.3

**Key Management:**
- Encryption keys managed by secrets provider (Doppler, AWS KMS)
- No custom key management in MVP v1 (reduces complexity)

### 4.2.3. Encryption in Transit

**All secrets MUST be encrypted in transit:**

- Secrets fetched from secrets manager over HTTPS/TLS 1.3
- Environment variables injected via secure channels (SSH, CI/CD)
- No plaintext secrets in HTTP, logs, or unencrypted channels

## 4.3. Access Control

### 4.3.1. Access Control Model

**Principle of Least Privilege:**

Each service identity has access ONLY to secrets it requires.

**Access Matrix:**

| Service Identity | Allowed Secrets |
|-----------------|----------------|
| `svc-api-prod` | `DB_PASSWORD`, `REDIS_PASSWORD`, `JWT_SERVICE_SECRET`, `ANTHROPIC_API_KEY`, `YANDEX_MAPS_KEY`, `SENDGRID_API_KEY`, `COOKIE_SECRET` |
| `svc-worker-prod` | `DB_PASSWORD`, `REDIS_PASSWORD`, `ANTHROPIC_API_KEY`, `SENDGRID_API_KEY`, `TWILIO_AUTH_TOKEN` |
| `svc-ai-client-prod` | `ANTHROPIC_API_KEY` only |
| `svc-maps-client-prod` | `YANDEX_MAPS_KEY`, `GOOGLE_MAPS_KEY` |
| `svc-notification-prod` | `SENDGRID_API_KEY`, `TWILIO_AUTH_TOKEN` |
| `svc-health-monitor-prod` | `HEALTH_CHECK_TOKEN` (read-only) |
| `svc-metrics-collector-prod` | `METRICS_TOKEN` (read-only) |

### 4.3.2. Access Enforcement

**Doppler Example:**

```bash
# Each service identity has its own Doppler service token
# Service token grants access only to specific secrets

# svc-api-prod
doppler run --token=dp.st.prod_api_token_xyz -- npm start

# svc-worker-prod (different token, different secrets)
doppler run --token=dp.st.prod_worker_token_abc -- node worker.js
```

**AWS Secrets Manager Example:**

```typescript
// IAM policy for svc-api-prod (attached to EC2 role or ECS task role)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/db_password-*",
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/jwt_service_secret-*",
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/anthropic_api_key-*"
      ]
    }
  ]
}

// svc-worker-prod has a different policy with different resources
```

### 4.3.3. Human Access Control

**Developers:**
- No direct access to production secrets
- Can access development and staging secrets
- Production access only via break-glass procedure (see § 9.3)

**DevOps/SRE:**
- Read access to production secrets (audit logged)
- Write access via secrets rotation procedure
- All access requires MFA (if using AWS or Vault)

**CI/CD Pipelines:**
- Service-specific tokens with minimal scope
- Tokens rotated every 90 days
- Separate tokens per environment

## 4.4. Environment Separation

**Secrets are strictly separated by environment:**

| Environment | Secrets Prefix | Access Control |
|-------------|---------------|----------------|
| **Development** | `dev/` | Developers (read/write) |
| **Staging** | `staging/` | Developers (read), DevOps (read/write) |
| **Production** | `prod/` | DevOps (read), On-call (break-glass write) |

**Example Secret Names:**
- `dev/db_password`
- `staging/db_password`
- `prod/db_password`

Each environment's secrets are completely independent.

---

# 5. Secrets Lifecycle & Rotation

## 5.1. Initial Provisioning

### 5.1.1. New Secret Creation

**Process:**

1. **Generate Secret** - Use cryptographically secure random generator
2. **Store in Secrets Manager** - Upload to appropriate environment
3. **Grant Access** - Add to service identity's allowed secrets list
4. **Document** - Record secret name, purpose, rotation schedule
5. **Audit** - Log creation event

**Secret Generation Standards:**

| Secret Type | Length | Character Set | Example |
|-------------|--------|---------------|---------|
| **JWT Signing Key** | 64 bytes (base64) | Random bytes | `openssl rand -base64 64` |
| **Database Password** | 32 characters | `[A-Za-z0-9!@#$%^&*]` | `pwgen -s 32 1` |
| **API Token** | 48 bytes (hex) | Hex characters | `openssl rand -hex 48` |
| **Cookie Secret** | 32 bytes (base64) | Random bytes | `openssl rand -base64 32` |

### 5.1.2. Secret Distribution

**Development/Staging:**
- Developers pull secrets via secrets manager CLI
- Example: `doppler secrets download --project=staging --config=api > .env`

**Production:**
- Secrets injected at runtime via CI/CD or orchestration
- No manual distribution

## 5.2. Rotation Cadence

**Standard Rotation Schedule:**

| Secret Type | Rotation Frequency | Reason |
|-------------|-------------------|--------|
| **JWT Service Secret** | 90 days | Balance security and operational overhead |
| **Database Passwords** | 90 days | Standard practice for critical credentials |
| **API Keys (External)** | 90-180 days | Varies by provider, some don't support rotation |
| **Cookie Secret** | 30 days | Higher rotation due to user-facing |
| **Encryption Keys** | 180 days | Rarely rotated due to re-encryption cost |
| **TLS Certificates** | 90 days | Standard certificate validity period |

**Rotation Trigger Events:**
- Scheduled (calendar-based)
- Suspected compromise (immediate)
- Employee departure (immediate for high-privilege secrets)
- Security audit recommendation

## 5.3. Rotation Procedure

### 5.3.1. Zero-Downtime Rotation Strategy

**Multi-Key Strategy:**

Service JWTs and symmetric keys support **simultaneous valid keys** during rotation:

1. **Generate New Key** - Create `JWT_SERVICE_SECRET_NEW`
2. **Deploy New Key** - Add to secrets manager, grant access
3. **Update Issuers** - Services start signing with new key
4. **Grace Period** - Both old and new keys valid for validation
5. **Monitor** - Ensure no errors from old key usage
6. **Remove Old Key** - After grace period (typically 24 hours), revoke old key

**Timeline Example:**

```
Day 0: Generate JWT_SERVICE_SECRET_NEW
Day 0: Deploy new key to all services (read-only)
Day 1: Update token issuer to sign with new key
Day 1-2: Grace period (both keys valid for validation)
Day 2: Remove JWT_SERVICE_SECRET_OLD
Day 2: Promote JWT_SERVICE_SECRET_NEW → JWT_SERVICE_SECRET
```

### 5.3.2. Rotation Implementation Example

**NestJS Service JWT Rotation:**

```typescript
// auth/service-jwt.strategy.ts
@Injectable()
export class ServiceJwtStrategy extends PassportStrategy(Strategy, 'service-jwt') {
  constructor(
    private readonly secretsManager: SecretsManagerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        // Try multiple keys during rotation grace period
        const keys = [
          await this.secretsManager.get('JWT_SERVICE_SECRET'),
          await this.secretsManager.get('JWT_SERVICE_SECRET_NEW'),
          await this.secretsManager.get('JWT_SERVICE_SECRET_OLD'),
        ].filter(Boolean);
        
        done(null, keys);
      },
    });
  }

  async validate(payload: any) {
    // Validate service JWT claims
    if (payload.type !== 'service') {
      throw new UnauthorizedException('Invalid token type');
    }
    
    // Check revocation list
    const isRevoked = await this.checkRevocation(payload.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }
    
    return {
      serviceId: payload.sub,
      scopes: payload.scopes,
    };
  }
  
  private async checkRevocation(jti: string): Promise<boolean> {
    // Check Redis for revoked token IDs
    const revoked = await this.redis.get(`revoked:${jti}`);
    return revoked !== null;
  }
}
```

### 5.3.3. API Key Rotation (External Services)

**Process:**

1. **Request New Key** - Create new key in external service dashboard
2. **Store New Key** - Add `<SERVICE>_API_KEY_NEW` to secrets manager
3. **Update Application** - Deploy code that tries new key, falls back to old
4. **Test Thoroughly** - Ensure new key works in staging
5. **Deploy to Production** - Release with new key
6. **Monitor** - Watch for errors, latency, rate limit issues
7. **Revoke Old Key** - After 24-48 hours, delete old key from external service

**Example (Claude API Key Rotation):**

```typescript
// integrations/ai/claude-client.service.ts
@Injectable()
export class ClaudeClientService {
  async callClaudeAPI(prompt: string): Promise<string> {
    // Try new key first, fall back to old key
    const apiKeys = [
      await this.secretsManager.get('ANTHROPIC_API_KEY_NEW'),
      await this.secretsManager.get('ANTHROPIC_API_KEY'),
    ].filter(Boolean);
    
    for (const apiKey of apiKeys) {
      try {
        const response = await this.makeRequest(apiKey, prompt);
        
        // Log which key was used
        this.logger.log({
          event: 'ai_api_call',
          key_version: apiKey === apiKeys[0] ? 'new' : 'current',
          status: 'success',
        });
        
        return response;
      } catch (error) {
        if (error.status === 401) {
          // Key invalid, try next
          this.logger.warn({
            event: 'ai_api_key_invalid',
            key_version: apiKey === apiKeys[0] ? 'new' : 'current',
          });
          continue;
        }
        throw error;
      }
    }
    
    throw new Error('All API keys failed');
  }
}
```

## 5.4. Emergency Revocation

### 5.4.1. Revocation Triggers

**Immediate revocation required when:**
- Secret leaked to public repository
- Secret exposed in logs or error messages
- Compromised employee account with secret access
- Security incident affecting secrets storage
- External service reports unauthorized API usage

### 5.4.2. Revocation Procedure

**Fast Revocation Process:**

1. **Identify Scope** - Determine which secrets are compromised
2. **Generate New Secrets** - Create replacement secrets immediately
3. **Update Secrets Manager** - Add new secrets with `_EMERGENCY` suffix
4. **Emergency Deployment** - Deploy new secrets to all affected services
5. **Revoke Old Secrets** - Remove old secrets from secrets manager
6. **External Revocation** - For API keys, revoke in external service immediately
7. **Incident Report** - Document what happened, how detected, lessons learned

**Timeline Target:**
- **Detection → New secrets generated:** < 15 minutes
- **New secrets deployed:** < 30 minutes
- **Old secrets revoked:** < 60 minutes

### 5.4.3. Service JWT Revocation

**Token Revocation List (Redis):**

```typescript
// auth/token-revocation.service.ts
@Injectable()
export class TokenRevocationService {
  async revokeToken(jti: string, expiresAt: Date): Promise<void> {
    const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    
    // Store revoked token ID in Redis with TTL
    await this.redis.setex(`revoked:${jti}`, ttl, '1');
    
    // Log revocation
    this.logger.warn({
      event: 'service_token_revoked',
      jti,
      expires_in_seconds: ttl,
    });
  }
  
  async revokeAllServiceTokens(serviceId: string): Promise<void> {
    // Emergency: revoke all tokens for a service
    await this.redis.set(`revoked:service:${serviceId}`, '1', 'EX', 86400);
    
    this.logger.error({
      event: 'all_service_tokens_revoked',
      service_id: serviceId,
      reason: 'emergency_revocation',
    });
  }
  
  async isRevoked(jti: string, serviceId: string): Promise<boolean> {
    // Check specific token revocation
    const tokenRevoked = await this.redis.get(`revoked:${jti}`);
    if (tokenRevoked) return true;
    
    // Check service-wide revocation
    const serviceRevoked = await this.redis.get(`revoked:service:${serviceId}`);
    return serviceRevoked !== null;
  }
}
```

## 5.5. Handling Compromised Secrets

**Response Plan:**

1. **Immediate Actions** (< 1 hour):
   - Revoke compromised secret
   - Generate and deploy new secret
   - Block external access if API key was leaked
   - Alert security team and stakeholders

2. **Investigation** (< 24 hours):
   - Determine how secret was exposed
   - Check audit logs for unauthorized access
   - Assess blast radius (what was accessed with the secret)
   - Document timeline of compromise

3. **Remediation** (< 1 week):
   - Fix root cause (e.g., remove secrets from logs)
   - Review and update secrets management practices
   - Rotate related secrets as precaution
   - Update documentation and training materials

4. **Post-Incident Review** (< 2 weeks):
   - Write incident report
   - Identify process improvements
   - Implement preventive measures
   - Share lessons learned with team

---

# 6. CI/CD & Runtime Integration

## 6.1. Build-Time vs Runtime Secrets

**Critical Distinction:**

- **Build-Time Secrets** - Should NOT exist. Builds should be secret-agnostic.
- **Runtime Secrets** - Injected when application starts, not baked into artifacts.

**Anti-Pattern (❌ WRONG):**

```dockerfile
# ❌ DON'T DO THIS - Secret baked into image
FROM node:20
COPY . /app
ENV DATABASE_PASSWORD=super_secret_password
RUN npm install
CMD ["npm", "start"]
```

**Correct Pattern (✅ RIGHT):**

```dockerfile
# ✅ CORRECT - No secrets in image
FROM node:20
COPY . /app
RUN npm install
# Secrets injected at runtime via environment variables or secrets manager
CMD ["npm", "start"]
```

## 6.2. CI/CD Secrets Injection

### 6.2.1. GitHub Actions Example

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Image
        run: |
          docker build -t selfstorage-api:${{ github.sha }} .
          # No secrets in build process
      
      - name: Push to Registry
        env:
          REGISTRY_TOKEN: ${{ secrets.REGISTRY_TOKEN }}
        run: |
          echo "$REGISTRY_TOKEN" | docker login -u _json_key --password-stdin
          docker push selfstorage-api:${{ github.sha }}
      
      - name: Deploy to Production
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_PROD_TOKEN }}
        run: |
          # Deploy with Doppler injecting secrets at runtime
          doppler run --token="$DOPPLER_TOKEN" -- \
            kubectl set image deployment/api api=selfstorage-api:${{ github.sha }}
```

### 6.2.2. Docker Compose Example (Local Development)

```yaml
# docker-compose.yml
version: '3.9'

services:
  api:
    image: selfstorage-api:latest
    environment:
      # Development: Secrets loaded from .env file
      - NODE_ENV=development
      # DO NOT put actual secrets here, use .env file
    env_file:
      - .env  # gitignored, contains secrets
    ports:
      - "3000:3000"
  
  worker:
    image: selfstorage-worker:latest
    env_file:
      - .env
    depends_on:
      - api
```

```bash
# .env (gitignored)
DATABASE_URL=postgresql://user:password@localhost:5432/selfstorage
REDIS_URL=redis://localhost:6379
JWT_SERVICE_SECRET=dev_jwt_secret_not_for_production
ANTHROPIC_API_KEY=sk-ant-api-dev-key
```

### 6.2.3. Kubernetes Secrets Integration

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: selfstorage-api:latest
        env:
          - name: DATABASE_PASSWORD
            valueFrom:
              secretKeyRef:
                name: db-credentials
                key: password
          - name: JWT_SERVICE_SECRET
            valueFrom:
              secretKeyRef:
                name: jwt-secrets
                key: service-secret
        # Alternative: Mount secrets as files
        volumeMounts:
          - name: secrets-volume
            mountPath: /etc/secrets
            readOnly: true
      volumes:
        - name: secrets-volume
          secret:
            secretName: api-secrets
```

```yaml
# k8s/secrets.yaml (not in version control)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  password: <base64-encoded-password>
---
apiVersion: v1
kind: Secret
metadata:
  name: jwt-secrets
type: Opaque
stringData:
  service-secret: <base64-encoded-jwt-secret>
```

## 6.3. Runtime Secrets Access

### 6.3.1. Secrets Manager Client

```typescript
// common/secrets/secrets-manager.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretsManagerService implements OnModuleInit {
  private cachedSecrets: Map<string, string> = new Map();
  private secretsProvider: 'doppler' | 'aws' | 'env';

  constructor(private readonly configService: ConfigService) {
    this.secretsProvider = this.configService.get('SECRETS_PROVIDER', 'env');
  }

  async onModuleInit() {
    // Prefetch critical secrets at startup
    await this.prefetchSecrets();
  }

  async get(secretName: string): Promise<string> {
    // Check cache first
    if (this.cachedSecrets.has(secretName)) {
      return this.cachedSecrets.get(secretName);
    }

    // Fetch from secrets provider
    let secretValue: string;

    switch (this.secretsProvider) {
      case 'doppler':
        secretValue = await this.fetchFromDoppler(secretName);
        break;
      case 'aws':
        secretValue = await this.fetchFromAWSSecretsManager(secretName);
        break;
      case 'env':
        secretValue = process.env[secretName];
        break;
      default:
        throw new Error(`Unknown secrets provider: ${this.secretsProvider}`);
    }

    if (!secretValue) {
      throw new Error(`Secret not found: ${secretName}`);
    }

    // Cache secret (with TTL for production)
    this.cachedSecrets.set(secretName, secretValue);
    return secretValue;
  }

  private async prefetchSecrets(): Promise<void> {
    // Prefetch all secrets at startup to fail fast if misconfigured
    const requiredSecrets = [
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SERVICE_SECRET',
      'ANTHROPIC_API_KEY',
    ];

    for (const secret of requiredSecrets) {
      await this.get(secret);
    }
  }

  private async fetchFromDoppler(secretName: string): Promise<string> {
    // Doppler CLI injects secrets as env vars
    return process.env[secretName];
  }

  private async fetchFromAWSSecretsManager(secretName: string): Promise<string> {
    const AWS = require('aws-sdk');
    const secretsManager = new AWS.SecretsManager({
      region: process.env.AWS_REGION || 'us-east-1',
    });

    const result = await secretsManager.getSecretValue({
      SecretId: secretName,
    }).promise();

    return result.SecretString;
  }
}
```

### 6.3.2. Principle of Least Privilege at Runtime

**Each service component gets ONLY the secrets it needs:**

```typescript
// integrations/ai/ai.module.ts
@Module({
  providers: [
    {
      provide: 'AI_API_KEY',
      useFactory: async (secretsManager: SecretsManagerService) => {
        // AI module only needs AI API key
        return await secretsManager.get('ANTHROPIC_API_KEY');
      },
      inject: [SecretsManagerService],
    },
    ClaudeClientService,
  ],
})
export class AiModule {}

// integrations/maps/maps.module.ts
@Module({
  providers: [
    {
      provide: 'MAPS_API_KEY',
      useFactory: async (secretsManager: SecretsManagerService) => {
        // Maps module only needs maps API key
        return await secretsManager.get('YANDEX_MAPS_KEY');
      },
      inject: [SecretsManagerService],
    },
    MapsClientService,
  ],
})
export class MapsModule {}
```

## 6.4. No Secrets in Code or Images

**Code Review Checklist:**

- [ ] No hardcoded passwords, API keys, or tokens
- [ ] No secrets in configuration files committed to git
- [ ] No secrets in Dockerfile or docker-compose.yml (except `.env` file which is gitignored)
- [ ] No secrets logged to console or files
- [ ] No secrets in error messages or stack traces
- [ ] All secrets retrieved from secrets manager at runtime

**Pre-commit Hook:**

```bash
#!/bin/bash
# .husky/pre-commit

# Scan for potential secrets in staged files
gitleaks protect --staged --verbose

# Check for common secret patterns
PATTERNS=(
  "password\s*=\s*['\"][^'\"]+['\"]"
  "api_key\s*=\s*['\"][^'\"]+['\"]"
  "secret\s*=\s*['\"][^'\"]+['\"]"
  "sk-ant-api"
  "SG\.[a-zA-Z0-9_-]+"
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached --diff-filter=ACM | grep -iE "$pattern"; then
    echo "❌ Potential secret detected in staged files!"
    echo "Pattern: $pattern"
    exit 1
  fi
done

exit 0
```

---

# 7. Access Control & Scoping

## 7.1. Service Scopes Definition

**Scopes** define what operations a service is authorized to perform.

### 7.1.1. Scope Naming Convention

**Format:** `<resource>:<action>`

**Examples:**
- `bookings:read` - Read booking data
- `bookings:write` - Create or update bookings
- `users:read` - Read user data
- `warehouses:write` - Create or update warehouses
- `notifications:send` - Send notifications
- `ai:query` - Call AI service
- `admin:all` - Administrative access (use sparingly)

### 7.1.2. Canonical Scope List (MVP v1)

| Scope | Description | Typical Users |
|-------|-------------|---------------|
| `bookings:read` | View booking data | API, Worker, Reporting |
| `bookings:write` | Create/update bookings | API, Worker |
| `users:read` | View user profiles | API, Worker, CRM |
| `users:write` | Update user data | API (own profile updates) |
| `warehouses:read` | View warehouse data | API, Worker, AI Client |
| `warehouses:write` | Create/update warehouses | API (operators only) |
| `boxes:read` | View box availability | API, AI Client |
| `boxes:write` | Update box data | API (operators only) |
| `ai:query` | Call AI service | AI Client |
| `maps:geocode` | Call geocoding APIs | Maps Client |
| `notifications:send` | Send email/SMS | Notification Service, Worker |
| `crm:read` | View CRM leads | API, Worker |
| `crm:write` | Update CRM leads | API, Worker |
| `health:check` | Health check access | Health Monitor |
| `metrics:collect` | Collect metrics | Metrics Collector |
| `admin:all` | Full administrative access | Migration Runner (use sparingly) |

## 7.2. Service Authentication Matrix

**Complete Service-to-Service Access Control:**

| Service Identity | Auth Method | Scopes | Notes |
|-----------------|-------------|--------|-------|
| `svc-api-prod` | Service JWT | `bookings:*`, `users:*`, `warehouses:*`, `boxes:*`, `crm:*`, `notifications:send` | Main API handles all user-facing operations |
| `svc-worker-prod` | Service JWT | `bookings:read`, `bookings:write`, `notifications:send`, `crm:write` | Background jobs: expiry checks, notifications, lead scoring |
| `svc-ai-client-prod` | API Key | `ai:query` | Calls Anthropic Claude API for box recommendations |
| `svc-maps-client-prod` | API Key | `maps:geocode` | Calls Google Maps API for geocoding |
| `svc-notification-prod` | API Key | `notifications:send` | Calls SendGrid, Twilio for email/SMS |
| `svc-storage-client-prod` | API Key | `storage:write`, `storage:read` | Uploads/downloads files to S3 |
| `svc-health-monitor-prod` | Service JWT | `health:check` | Health check system (Prometheus) |
| `svc-metrics-collector-prod` | Service JWT | `metrics:collect` | Metrics collection (Prometheus) |
| `svc-log-aggregator-prod` | Service JWT | `logs:read` | Log aggregation (Loki) |
| `svc-migration-runner-prod` | Service JWT | `admin:all` | Database migrations (use with extreme caution) |
| `svc-backup-runner-prod` | Service JWT | `admin:all` | Backup operations |
| `svc-reporting-prod` | Service JWT | `bookings:read`, `users:read`, `warehouses:read`, `crm:read` | Generates reports (read-only) |

## 7.3. Allowed Call Graph

**Principle:** Services can only call services they have scopes for.

**Permitted Interactions:**

```
┌─────────────┐
│  svc-api    │ ──> svc-ai-client (ai:query)
│             │ ──> svc-maps-client (maps:geocode)
│             │ ──> svc-notification (notifications:send)
│             │ ──> Database (direct)
└─────────────┘

┌─────────────┐
│ svc-worker  │ ──> svc-notification (notifications:send)
│             │ ──> Database (direct)
└─────────────┘

┌─────────────┐
│ svc-ai-     │ ──> Anthropic Claude API (external)
│  client     │
└─────────────┘

┌─────────────┐
│ svc-maps-   │ ──> Google Maps API (external)
│  client     │ ──> Google Maps API (external)
└─────────────┘

┌─────────────┐
│ svc-health- │ ──> svc-api (/health endpoint)
│  monitor    │ ──> Database (health check)
└─────────────┘
```

**Forbidden Interactions:**
- `svc-health-monitor` ❌ Cannot write to database
- `svc-reporting` ❌ Cannot send notifications
- `svc-ai-client` ❌ Cannot access database directly

## 7.4. Deny-by-Default Policy

**Default: DENY all access**

- Services have NO access unless explicitly granted
- New scopes require explicit authorization
- Scope creep is NOT allowed without architecture review
- Audits check for overly permissive scopes

**Enforcement:**

```typescript
// guards/service-scope.guard.ts
@Injectable()
export class ServiceScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredScope = this.getRequiredScope(context);
    
    const serviceAuth = request.user; // From Service JWT validation
    if (serviceAuth.type !== 'service') {
      return false; // Not a service authentication
    }
    
    // Check if service has required scope
    if (!serviceAuth.scopes.includes(requiredScope)) {
      this.logger.warn({
        event: 'service_scope_denied',
        service_id: serviceAuth.serviceId,
        required_scope: requiredScope,
        service_scopes: serviceAuth.scopes,
      });
      return false;
    }
    
    return true;
  }
  
  private getRequiredScope(context: ExecutionContext): string {
    // Extract required scope from route metadata
    const handler = context.getHandler();
    return Reflect.getMetadata('scope', handler) || 'default:read';
  }
}

// Usage in controller
@Post('bookings')
@UseGuards(ServiceScopeGuard)
@SetMetadata('scope', 'bookings:write')
async createBooking(@Body() dto: CreateBookingDto) {
  // Only services with 'bookings:write' scope can call this
}
```

---

# 8. Audit Logging & Monitoring

## 8.1. Authentication Events to Log

**All authentication attempts MUST be logged:**

### 8.1.1. Service JWT Authentication Logs

**Successful Authentication:**

```json
{
  "timestamp": "2025-12-16T10:30:00.123Z",
  "level": "INFO",
  "event": "service_auth_success",
  "service_id": "svc-worker-prod",
  "scopes": ["bookings:read", "bookings:write", "notifications:send"],
  "token_jti": "svc_jwt_abc123xyz789",
  "request_id": "req_worker_001",
  "ip_address": "10.0.1.50",
  "user_agent": "node-fetch/2.6.7"
}
```

**Failed Authentication:**

```json
{
  "timestamp": "2025-12-16T10:30:05.456Z",
  "level": "WARN",
  "event": "service_auth_failed",
  "service_id": "svc-unknown-service",
  "failure_reason": "invalid_signature",
  "request_id": "req_unknown_001",
  "ip_address": "10.0.1.99",
  "user_agent": "curl/7.68.0"
}
```

**Token Validation Failure:**

```json
{
  "timestamp": "2025-12-16T10:31:00.789Z",
  "level": "WARN",
  "event": "service_token_invalid",
  "service_id": "svc-api-prod",
  "failure_reason": "token_expired",
  "token_jti": "svc_jwt_old123",
  "expires_at": "2025-12-16T09:00:00Z",
  "request_id": "req_api_002"
}
```

### 8.1.2. Secrets Access Logs

**Secret Retrieved:**

```json
{
  "timestamp": "2025-12-16T10:32:00.123Z",
  "level": "INFO",
  "event": "secret_accessed",
  "service_id": "svc-api-prod",
  "secret_name": "ANTHROPIC_API_KEY",
  "access_method": "secrets_manager",
  "request_id": "req_api_003"
}
```

**Secret Access Denied:**

```json
{
  "timestamp": "2025-12-16T10:32:05.456Z",
  "level": "WARN",
  "event": "secret_access_denied",
  "service_id": "svc-health-monitor-prod",
  "secret_name": "DB_PASSWORD",
  "denial_reason": "insufficient_permissions",
  "request_id": "req_health_001"
}
```

**Secret Rotation:**

```json
{
  "timestamp": "2025-12-16T10:33:00.789Z",
  "level": "INFO",
  "event": "secret_rotated",
  "secret_name": "JWT_SERVICE_SECRET",
  "rotation_type": "scheduled",
  "rotated_by": "devops-automation",
  "old_version": "v42",
  "new_version": "v43"
}
```

### 8.1.3. Scope Validation Logs

**Scope Check Passed:**

```json
{
  "timestamp": "2025-12-16T10:34:00.123Z",
  "level": "INFO",
  "event": "service_scope_granted",
  "service_id": "svc-worker-prod",
  "required_scope": "bookings:write",
  "service_scopes": ["bookings:read", "bookings:write", "notifications:send"],
  "request_id": "req_worker_002",
  "endpoint": "POST /internal/bookings/expire"
}
```

**Scope Check Failed:**

```json
{
  "timestamp": "2025-12-16T10:34:05.456Z",
  "level": "WARN",
  "event": "service_scope_denied",
  "service_id": "svc-reporting-prod",
  "required_scope": "bookings:write",
  "service_scopes": ["bookings:read", "users:read"],
  "request_id": "req_reporting_001",
  "endpoint": "POST /internal/bookings"
}
```

## 8.2. Log Structure Alignment

**MUST follow Logging Strategy (DOC-055) conventions:**

- JSON structured logs
- Include `trace_id`, `request_id` for correlation
- Use standard event names (UPPER_SNAKE_CASE or lowercase_snake_case per DOC-055)
- Mask sensitive data (no plaintext secrets in logs)
- Include timestamp in ISO 8601 format

**Reference:** See **Logging_Strategy_CANONICAL_Contract_v2.md** for complete logging taxonomy.

## 8.3. Monitoring Metrics

### 8.3.1. Authentication Metrics (Prometheus)

**Service Authentication Success Rate:**

```
service_auth_attempts_total{service_id, result}
service_auth_duration_seconds{service_id}
```

**Example Prometheus Query:**

```promql
# Service authentication success rate (last 5 minutes)
rate(service_auth_attempts_total{result="success"}[5m])
/ 
rate(service_auth_attempts_total[5m])

# Alert: Service authentication failure rate > 5%
alert: HighServiceAuthFailureRate
expr: |
  rate(service_auth_attempts_total{result="failure"}[5m])
  /
  rate(service_auth_attempts_total[5m])
  > 0.05
for: 5m
labels:
  severity: warning
annotations:
  summary: "High service auth failure rate for {{ $labels.service_id }}"
```

### 8.3.2. Secrets Access Metrics

**Secrets Access Counter:**

```
secrets_accessed_total{service_id, secret_name, result}
```

**Secrets Rotation Status:**

```
secrets_last_rotation_timestamp{secret_name}
secrets_days_since_rotation{secret_name}
```

**Alert: Secret Overdue for Rotation:**

```promql
alert: SecretRotationOverdue
expr: secrets_days_since_rotation{secret_name} > 100
for: 1h
labels:
  severity: warning
annotations:
  summary: "Secret {{ $labels.secret_name }} overdue for rotation"
  description: "Last rotated {{ $value }} days ago"
```

### 8.3.3. Token Revocation Metrics

**Revoked Token Checks:**

```
token_revocation_checks_total{result}
token_revocations_total{service_id, reason}
```

## 8.4. Correlation IDs

**All service-to-service calls MUST propagate correlation IDs:**

- `trace_id` - Distributed tracing ID (spans multiple services)
- `request_id` - Single request identifier

**Implementation:**

```typescript
// middleware/correlation-id.middleware.ts
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Extract or generate trace_id
    let traceId = req.headers['x-trace-id'] as string;
    if (!traceId) {
      traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Generate request_id
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Attach to request object
    req['traceId'] = traceId;
    req['requestId'] = requestId;
    
    // Propagate to downstream services
    res.setHeader('X-Trace-ID', traceId);
    
    next();
  }
}

// Propagate to downstream service calls
async callDownstreamService(url: string, traceId: string, requestId: string) {
  return fetch(url, {
    headers: {
      'X-Trace-ID': traceId,
      'X-Request-ID': requestId,
      'Authorization': `Bearer ${await this.getServiceToken()}`,
    },
  });
}
```

**Reference:** See **Logging_Strategy_CANONICAL_Contract_v2.md § 3** for correlation ID standards.

---

# 9. Failure Modes & Recovery

## 9.1. Authentication Failure Scenarios

### 9.1.1. Expired Service Token

**Scenario:** Service JWT has expired but service hasn't refreshed yet.

**Detection:**
- JWT validation fails with "token expired" error
- Log event: `service_token_invalid` (reason: `token_expired`)

**Recovery:**
1. Service automatically requests new token
2. Retry original request with new token
3. If renewal fails, fall back to degraded mode (see § 9.4)

**Implementation:**

```typescript
// auth/service-auth.interceptor.ts
@Injectable()
export class ServiceAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse> {
    return next.handle(req).pipe(
      catchError(async (error) => {
        if (error.status === 401 && error.error?.code === 'TOKEN_EXPIRED') {
          // Token expired, renew and retry
          const newToken = await this.renewServiceToken();
          const retryReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${newToken}`),
          });
          return next.handle(retryReq).toPromise();
        }
        throw error;
      }),
    );
  }
  
  private async renewServiceToken(): Promise<string> {
    // Request new service JWT
    const serviceId = process.env.SERVICE_ID;
    const serviceSecret = await this.secretsManager.get('SERVICE_SECRET');
    
    const response = await fetch('https://auth.storagecompare.ae/service-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: serviceId, service_secret: serviceSecret }),
    });
    
    const { token } = await response.json();
    return token;
  }
}
```

### 9.1.2. Revoked Service Token

**Scenario:** Service token was revoked (e.g., security incident, key rotation).

**Detection:**
- Token revocation check fails
- Log event: `service_token_revoked`

**Recovery:**
1. Request new service token immediately
2. Alert on-call engineer if revocation was unexpected
3. Investigate why token was revoked

**No automatic retry** - Requires human intervention to ensure security incident is resolved.

### 9.1.3. Incorrect Service Credentials

**Scenario:** Service secret is wrong (misconfiguration, rotation error).

**Detection:**
- Service JWT generation fails with "invalid credentials"
- Log event: `service_auth_failed` (reason: `invalid_credentials`)

**Recovery:**
1. Alert DevOps immediately (Slack, PagerDuty)
2. Check secrets manager for correct value
3. Manually update service credentials
4. Restart affected services

**Prevention:**
- Test credentials in staging before production deployment
- Validate credentials during application startup

### 9.1.4. Secrets Manager Unavailable

**Scenario:** Secrets manager (Doppler, AWS Secrets Manager) is unreachable.

**Detection:**
- Secrets manager API timeout or connection error
- Log event: `secrets_manager_unavailable`

**Recovery:**
1. Retry with exponential backoff (3 attempts)
2. If all retries fail, fall back to cached secrets (if available)
3. Alert DevOps if secrets manager is down > 5 minutes
4. Degrade gracefully (see § 9.4)

**Circuit Breaker:**

```typescript
// common/secrets/secrets-manager.service.ts
private circuitBreaker = {
  failureCount: 0,
  state: 'closed', // 'closed' | 'open' | 'half-open'
  lastFailureTime: null,
  threshold: 5,
  timeout: 60000, // 60 seconds
};

async get(secretName: string): Promise<string> {
  // Check circuit breaker
  if (this.circuitBreaker.state === 'open') {
    const timeSinceFailure = Date.now() - this.circuitBreaker.lastFailureTime;
    if (timeSinceFailure < this.circuitBreaker.timeout) {
      // Circuit still open, use cached value
      return this.getCachedSecret(secretName);
    } else {
      // Try half-open
      this.circuitBreaker.state = 'half-open';
    }
  }
  
  try {
    const secret = await this.fetchSecret(secretName);
    
    // Success, reset circuit breaker
    if (this.circuitBreaker.state === 'half-open') {
      this.circuitBreaker.state = 'closed';
      this.circuitBreaker.failureCount = 0;
    }
    
    return secret;
  } catch (error) {
    // Failure, increment counter
    this.circuitBreaker.failureCount++;
    
    if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
      // Open circuit
      this.circuitBreaker.state = 'open';
      this.circuitBreaker.lastFailureTime = Date.now();
      
      this.logger.error({
        event: 'secrets_manager_circuit_open',
        failure_count: this.circuitBreaker.failureCount,
      });
    }
    
    // Fall back to cache
    return this.getCachedSecret(secretName);
  }
}
```

## 9.2. External Service Credential Failures

### 9.2.1. Invalid API Key (External Service)

**Scenario:** External service (Claude, Maps, SendGrid) rejects API key.

**Detection:**
- External API returns 401 Unauthorized
- Log event: `external_api_auth_failed`

**Recovery:**
1. Check if API key was recently rotated
2. If rotation in progress, retry with fallback key
3. If both keys fail, alert DevOps immediately
4. Pause operations requiring that service until resolved

### 9.2.2. API Rate Limit Exceeded

**Scenario:** External service rate limit exceeded (e.g., Claude API).

**Detection:**
- External API returns 429 Too Many Requests
- Log event: `external_api_rate_limited`

**Recovery:**
1. Respect `Retry-After` header
2. Queue requests and retry after backoff period
3. Alert if rate limit consistently hit (may need higher tier)

**Reference:** See **API_Rate_Limiting_Throttling_Specification_MVP_v1_CANONICAL.md** for platform rate limiting strategy.

## 9.3. Break-Glass Emergency Access

**Scenario:** Critical incident requires immediate production access despite normal restrictions.

**Break-Glass Procedure:**

1. **Trigger Break-Glass:**
   - On-call engineer activates break-glass via runbook
   - Requires manual approval (via Slack approval bot or similar)

2. **Emergency Credentials:**
   - Generate temporary high-privilege service token (validity: 1 hour)
   - Token has `admin:all` scope
   - Token logged to immutable audit log

3. **Perform Emergency Actions:**
   - Resolve incident (e.g., rotate compromised secrets, revert bad deployment)
   - All actions logged with break-glass session ID

4. **Post-Incident:**
   - Emergency token automatically revoked after 1 hour
   - Break-glass session logged to security audit log
   - Incident report required within 24 hours

**Implementation:**

```typescript
// admin/break-glass.service.ts
@Injectable()
export class BreakGlassService {
  async activateBreakGlass(
    requesterId: string,
    reason: string,
    approvalToken: string,
  ): Promise<string> {
    // Validate approval
    const approval = await this.validateApproval(approvalToken);
    if (!approval.approved) {
      throw new UnauthorizedException('Break-glass not approved');
    }
    
    // Generate emergency token
    const emergencyToken = this.jwtService.sign({
      sub: `break-glass-${requesterId}`,
      type: 'service',
      scopes: ['admin:all'],
      break_glass_session: `bg_${Date.now()}`,
    }, {
      expiresIn: '1h',
    });
    
    // Log to immutable audit log
    await this.auditLog.logBreakGlass({
      requester_id: requesterId,
      reason,
      approval_token: approvalToken,
      emergency_token_jti: emergencyToken.jti,
      timestamp: new Date(),
    });
    
    // Alert security team
    await this.alertService.sendCritical({
      message: `Break-glass activated by ${requesterId}`,
      reason,
      session_id: `bg_${Date.now()}`,
    });
    
    return emergencyToken;
  }
}
```

## 9.4. Degraded Mode Operation

**Scenario:** Critical authentication or secrets infrastructure fails, but platform must stay operational.

**Degraded Mode Behaviors:**

1. **Cached Secrets:**
   - Use last known good secrets from in-memory cache
   - Log warning that secrets are stale
   - Continue operating for up to 6 hours (service token TTL)

2. **Reduced Functionality:**
   - Disable non-critical features (e.g., AI recommendations)
   - Continue core operations (booking creation, user login)
   - Display degraded mode banner to users (if applicable)

3. **Elevated Monitoring:**
   - Increase logging verbosity
   - Send alerts every 15 minutes until resolved
   - Track which operations are failing

**Recovery:**
- Once secrets manager or auth service is back, reload secrets
- Transition out of degraded mode automatically
- Log recovery event

---

# 10. Relationship to Canonical Documents

## 10.1. Security & Compliance Plan (DOC-078)

**Cross-References:**

- **§ 3 - API Security:** Service authentication complements user authentication defined in DOC-078
- **§ 6 - Secrets Management:** Detailed implementation of secrets lifecycle outlined in DOC-078
- **§ 10 - Incident Response:** Break-glass procedure aligns with incident response plan

**Alignment:**
- Service authentication is independent from user authentication
- Both follow same security principles (encryption, audit, least privilege)
- Incident response includes both user-facing and service-facing compromises

## 10.2. Security Architecture (DOC-079)

**Cross-References:**

- **§ 3 - Trust Boundaries:** Service-to-service boundary defined as distinct from user-to-platform boundary
- **§ 4 - Security Layers:** Service authentication operates at infrastructure layer
- **§ 5 - Authentication & Authorization:** Service auth model complements user auth model

**Alignment:**
- Service authentication enforces trust boundaries between internal components
- Secrets management protects service credentials with same rigor as user credentials

## 10.3. API Rate Limiting (DOC-017)

**Cross-References:**

- **§ 3 - Rate Limit Tiers:** Service identities not subject to user rate limits
- **§ 9 - Monitoring:** Service authentication failures logged separately from rate limit events

**Note:** Internal service-to-service calls are **exempt from rate limiting** (no limit on internal API calls). Rate limits apply only to public-facing endpoints.

## 10.4. Logging Strategy (DOC-055)

**Cross-References:**

- **§ 3 - Correlation IDs:** Service authentication events include `trace_id` and `request_id`
- **§ 4 - Log Taxonomy:** Service auth events use canonical event names
- **§ 5 - PII Masking:** Secrets never logged (consistent with PII masking rules)

**Alignment:**
- All service authentication logs follow structured JSON format from DOC-055
- Service events logged alongside user events but distinguished by `actor_type=service`

## 10.5. Monitoring & Observability (DOC-057)

**Cross-References:**

- **§ 2 - Metrics Collection:** Service authentication metrics exposed via Prometheus
- **§ 7 - Health Checks:** Health check system uses service authentication

**Alignment:**
- Service authentication success/failure rates monitored in real-time
- Metrics collector authenticates as service (`svc-metrics-collector-prod`)

---

# 11. Non-Goals

**This specification explicitly does NOT cover:**

## 11.1. User Authentication

- ❌ User login with email/password
- ❌ User JWT generation and validation
- ❌ User session management
- ❌ Password reset flows
- ❌ Email verification
- ❌ User RBAC (user, operator, admin roles)

**Reason:** User authentication is covered in:
- DOC-078 (Security & Compliance Plan)
- DOC-079 (Security Architecture)
- API Blueprint § 2 (Authentication & Authorization)

## 11.2. Public API Authentication

- ❌ Frontend-to-backend authentication
- ❌ Mobile app authentication
- ❌ OAuth 2.0 for third-party integrations (future)
- ❌ API key issuance for external developers (future)

**Reason:** Public API auth is covered in API Blueprint and is fundamentally different from service-to-service auth.

## 11.3. Zero-Trust Architecture (v2+)

- ❌ Network segmentation with zero trust
- ❌ Service mesh (Istio, Linkerd)
- ❌ Advanced mTLS with SPIFFE/SPIRE
- ❌ Identity-aware proxies

**Reason:** MVP v1 uses monolithic architecture. Zero-trust is a post-MVP enhancement when transitioning to microservices.

## 11.4. Advanced Secrets Features (v2+)

- ❌ Dynamic secrets (database credentials generated on-demand)
- ❌ Secrets versioning with rollback
- ❌ Secrets encryption as a service
- ❌ PKI for service certificates
- ❌ Hardware security modules (HSMs)

**Reason:** These are advanced features for v2+. MVP v1 focuses on solid fundamentals.

## 11.5. Multi-Region/Multi-Cloud (v3+)

- ❌ Cross-region service authentication
- ❌ Multi-cloud secrets replication
- ❌ Global service mesh
- ❌ Federation of service identities

**Reason:** MVP v1 is single-region, single-cloud. Multi-region is v3+ architecture.

---

# Appendices

## Appendix A: Service Token Generation Script

```bash
#!/bin/bash
# scripts/generate-service-token.sh

SERVICE_ID=$1
SCOPES=$2
EXPIRY_HOURS=${3:-6}

if [ -z "$SERVICE_ID" ] || [ -z "$SCOPES" ]; then
  echo "Usage: $0 <service-id> <scopes> [expiry-hours]"
  echo "Example: $0 svc-worker-prod 'bookings:read,bookings:write' 6"
  exit 1
fi

# Generate JWT payload
PAYLOAD=$(cat <<EOF
{
  "sub": "$SERVICE_ID",
  "type": "service",
  "scopes": ["${SCOPES//,/\",\"}"],
  "iss": "auth.storagecompare.ae",
  "aud": "api.storagecompare.ae",
  "iat": $(date +%s),
  "exp": $(date -d "+${EXPIRY_HOURS} hours" +%s),
  "jti": "svc_jwt_$(openssl rand -hex 16)"
}
EOF
)

# Sign JWT (requires jq and OpenSSL)
JWT_SECRET=$(doppler secrets get JWT_SERVICE_SECRET --plain)

# Use jwt CLI tool or similar to sign
# This is a simplified example
echo "$PAYLOAD" | jwt encode --secret="$JWT_SECRET"
```

## Appendix B: Secrets Rotation Checklist

**Pre-Rotation:**
- [ ] Identify secret to rotate
- [ ] Verify rotation procedure documented
- [ ] Check dependencies (which services use this secret)
- [ ] Schedule rotation window (ideally low-traffic period)
- [ ] Notify team in Slack

**During Rotation:**
- [ ] Generate new secret
- [ ] Upload new secret to secrets manager with `_NEW` suffix
- [ ] Deploy services to use new secret (fallback to old)
- [ ] Monitor for errors (5-10 minutes)
- [ ] If stable, promote new secret to primary
- [ ] Wait grace period (24 hours)

**Post-Rotation:**
- [ ] Remove old secret from secrets manager
- [ ] Revoke old API key (if external service)
- [ ] Update documentation with rotation timestamp
- [ ] Log rotation event to audit log
- [ ] Confirm no errors in monitoring

## Appendix C: Break-Glass Runbook

**When to Use Break-Glass:**
- Production database inaccessible due to credential issue
- Secrets manager completely down, cached secrets expired
- Critical security incident requiring immediate privileged access
- Emergency rollback of compromised service credentials

**Break-Glass Steps:**

1. **Activate:**
   ```bash
   # Request break-glass approval
   curl -X POST https://api.storagecompare.ae/admin/break-glass/request \
     -H "Authorization: Bearer $(vault login -field=token)" \
     -d '{"requester_id":"john.doe","reason":"Production DB credentials rotated incorrectly"}'
   
   # Approval received via Slack
   # Generate emergency token
   export EMERGENCY_TOKEN=$(curl https://api.storagecompare.ae/admin/break-glass/activate \
     -H "X-Approval-Token: bg_approval_123456")
   ```

2. **Perform Emergency Actions:**
   ```bash
   # Use emergency token with admin:all scope
   curl -X POST https://api.storagecompare.ae/admin/secrets/update \
     -H "Authorization: Bearer $EMERGENCY_TOKEN" \
     -d '{"secret_name":"DB_PASSWORD","value":"new_emergency_password"}'
   ```

3. **Document:**
   - Log all actions taken during break-glass session
   - Document what went wrong and how it was fixed

4. **Post-Incident:**
   - Emergency token auto-expires after 1 hour
   - Write incident report within 24 hours
   - Review and improve procedures to prevent recurrence

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Technical Documentation Engine | Initial canonical specification |

**Approval:**
- Security Team: [Pending]
- DevOps Team: [Pending]
- Engineering Lead: [Pending]

**Next Review Date:** 2025-03-16 (90 days from initial approval)

---

**END OF DOCUMENT**

🟢 **Status: GREEN - Canonical Source of Truth**  
✅ **Codegen-Ready: HIGH**
