# **API RATE LIMITING & THROTTLING SPECIFICATION**
# **MVP v1 - Self-Storage Aggregator Platform**

---

## **Document Information**

| Field | Value |
|-------|-------|
| **Version** | 1.1.0-CANONICAL-HARDENED |
| **Date** | December 15, 2025 |
| **Status** | Final - Canonical MVP v1 Contract |
| **Author** | Technical Architecture Team |
| **Project** | Self-Storage Aggregator MVP |
| **Confidentiality** | Internal |

---

## **Executive Summary**

This document defines the rate limiting and throttling strategy for the Self-Storage Aggregator MVP platform. The specification provides a **policy-driven framework** for protecting system resources, ensuring fair access, and mitigating abuse.

**Key Design Principles:**
- ✅ **Configurable thresholds**: All limits are environment-defined and adjustable
- ✅ **Policy-driven behavior**: System behavior determined by configuration, not hardcoded logic
- ✅ **Multi-layered defense**: Cloudflare → Nginx → NestJS → Redis
- ✅ **Fail-safe design**: System remains available even if rate limiting fails
- ✅ **Defense in depth**: Multiple independent protection layers
- ✅ **Role-based access control**: Progressive limits based on authentication level

**Architecture Coverage:**
- Multi-layer rate limiting (CDN, gateway, application)
- Role-based throttling (Guest, User, Operator, Admin)
- Endpoint-specific protections
- Spike detection and mitigation
- Error handling and retry policies
- Monitoring and operational procedures

---

## **Table of Contents**

### **1. Rate Limiting Overview**
- 1.1. Goals and objectives
- 1.2. Rate limiting principles for MVP
- 1.3. Threats that rate limiting prevents
- 1.4. Architecture components

### **2. Global Limits Framework**
- 2.1. Global request thresholds
- 2.2. Capacity planning considerations
- 2.3. Burst handling policies
- 2.4. Algorithm selection guidelines
- 2.5. Retry-After behavior

### **3. Role-Based Limits Framework**
- 3.1. Guest limits (IP-based)
- 3.2. User limits (authenticated)
- 3.3. Operator limits (warehouse owners)
- 3.4. Admin limits (system administrators)
- 3.5. Comparative matrix

### **4. IP-Based & Identifier Limits**
- 4.1. IP-based rate limiting
- 4.2. Anti-bot policy framework
- 4.3. Bulk request restrictions
- 4.4. Operator-specific limits (operator_id)

### **5. Endpoint-Specific Limits**
- 5.1. Search endpoint protection (/warehouses/search)
- 5.2. Booking endpoint protection (/bookings)
- 5.3. Box listing protection (/boxes)
- 5.4. Operator endpoint security (/operators/*)
- 5.5. Endpoint limits matrix

### **6. Throttling Strategy**
- 6.1. Soft throttling
- 6.2. Hard throttling
- 6.3. Adaptive throttling
- 6.4. Gradual slowdown mechanism
- 6.5. Throttling vs rate limiting distinction

### **7. Spike Protection**
- 7.1. Spike detection framework
- 7.2. Token bucket overflow handling
- 7.3. Spike classification logic
- 7.4. Circuit breaker pattern

### **8. Error Handling & Retry Policies**
- 8.1. HTTP 429 response format (canonical error envelope)
- 8.2. HTTP headers (Retry-After, RateLimit-*)
- 8.3. Client retry recommendations
- 8.4. Client-side rate limiting
- 8.5. Integration with Error Handling Specification

### **9. Monitoring & Logging Requirements**
- 9.1. Rate limit metrics
- 9.2. Error rate monitoring
- 9.3. Rate limit event logging
- 9.4. Trace correlation
- 9.5. Alerting thresholds

### **10. Security Considerations**
- 10.1. Rate limiting as defense mechanism
- 10.2. Integration with Security & Compliance Plan
- 10.3. Protected endpoint categories
- 10.4. Token and header validation

### **11. Operational Guidelines**
- 11.1. Configuration management
- 11.2. Zero-downtime updates
- 11.3. Release procedures
- 11.4. Configuration validation
- 11.5. Risk mitigation

### **12. MVP Implementation Contract**
- 12.1. Required components (MUST)
- 12.2. Recommended features (SHOULD)
- 12.3. Optional enhancements (MAY)
- 12.4. Post-MVP features (OUT OF SCOPE)

### **13. Explicit Non-Goals (MVP v1)**
- 13.1. Explicitly excluded features
- 13.2. Future considerations

---

## **Quick Reference**

### **Default Rate Limits by Role (Example Configuration)**

> **NOTE:** All values shown are **example configurations** for reference. Actual production limits are **environment-defined** and should be determined through load testing and business requirements.

| Role | Global Limit | Concurrent | AI Requests | Critical Endpoints |
|------|-------------|------------|-------------|-------------------|
| **Guest** | Configurable | Configurable | Configurable | Policy-defined |
| **User** | Higher than Guest | Higher than Guest | Higher than Guest | Policy-defined |
| **Operator** | Higher than User | Higher than User | Higher than User | Policy-defined |
| **Admin** | Elevated | Elevated | Elevated | Bypass available* |

*Admin bypass requires full audit logging per Security & Compliance Plan

### **Architecture Stack**

```
┌─────────────────────────────────────┐
│  Cloudflare CDN                     │  DDoS Protection, Bot Detection
│  └─ Configurable IP-based limits   │  (See Security Plan §4.2)
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Nginx (Gateway)                    │  Global Rate Limits
│  └─ Policy-defined thresholds      │  Algorithm: Configurable
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  NestJS (Application)               │  Role-Based Limits
│  └─ RateLimitGuard                 │  Algorithm: Configurable
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Redis (Rate Limit Storage)         │  Sliding Windows, Counters
│  └─ Environment-sized memory       │  TTL-based cleanup
└─────────────────────────────────────┘
```

---

## **Implementation Priority**

**Phase 1: Core Rate Limiting**
- ✅ Nginx global limits
- ✅ Redis storage implementation
- ✅ NestJS RateLimitGuard
- ✅ Role-based limit framework

**Phase 2: Enhanced Protection**
- ✅ IP-based limits
- ✅ Endpoint-specific limits
- ✅ HTTP 429 error handling
- ✅ Basic monitoring

**Phase 3: Advanced Features**
- ✅ Spike detection
- ✅ Bot protection integration (see Security Plan)
- ✅ Brute-force mitigation (see Security Plan)
- ✅ Circuit breaker pattern

**Phase 4: Operations & Monitoring**
- ✅ Metrics dashboard
- ✅ Alert configuration
- ✅ Configuration reload system
- ✅ Incident response procedures

---

## **Technology Stack**

This specification is designed for MVP architecture:

**✅ Core Technologies:**
- Nginx (reverse proxy & initial rate limiting)
- Redis (rate limit state storage)
- NestJS (application-layer rate limiting)
- PostgreSQL (configuration storage)
- Cloudflare CDN (network-layer protection)

**❌ Not Used in MVP:**
- External API Gateways (Kong, AWS API Gateway)
- Redis Cluster (single Redis instance for MVP)
- Message Queues for rate limit events
- Distributed rate limiting services

---

## **Document Conventions**

**Configuration Notation:**
- All limits are **configurable** and **environment-defined**
- `configurable threshold` = value set via configuration
- `policy-driven` = behavior determined by configuration policy
- `environment-defined` = value varies by deployment environment

**Example Code:**
- All code examples are **reference implementations only**
- Production implementations may vary based on requirements
- Examples use: TypeScript (NestJS), Nginx config, Redis Lua, SQL

**Terminology:**
- **Identifier**: IP address, user_id, or operator_id
- **Window**: Configurable time period for rate limit
- **Scope**: user, ip, or global
- **Throttling**: Slowing down requests before hard limit
- **Rate Limiting**: Counting and blocking excessive requests

---

# **1. Rate Limiting Overview**

## **1.1. Goals and Objectives**

Rate limiting in the Self-Storage Aggregator MVP serves the following objectives:

**Infrastructure Protection:**
- Prevent backend overload (NestJS API)
- Protect PostgreSQL database from excessive queries
- Control load on Redis cache layer
- Protect AI Service from excessive external API calls (Claude API)

**Fair Access:**
- Distribute resources equitably among users
- Prevent monopolization by single clients
- Guarantee service availability for all user categories

**Abuse Prevention:**
- Mitigate application-layer DDoS attacks
- See **Security & Compliance Plan §4.3** for brute-force protection
- See **Security & Compliance Plan §4.4** for bot detection and scraping prevention
- Control automated bulk request patterns

**Cost Control:**
- Limit calls to external paid APIs (Google Maps, Claude API)
- Provide predictable resource consumption for capacity planning
- Minimize infrastructure costs during MVP phase

---

## **1.2. Rate Limiting Principles for MVP**

The MVP rate limiting implementation follows these core principles:

**1. Fail-Safe Design**
- System MUST remain available if rate limiting components fail
- Redis failure → requests are allowed (logged and alerted)
- Configuration errors → fallback to safe default limits
- Never block legitimate traffic due to rate limiter bugs

**2. Progressive Enforcement**
```
Guest (lowest)  →  User (medium)  →  Operator (high)  →  Admin (elevated)
```
- Limits encourage authentication and registration
- Business model alignment: incentivize guest-to-user conversion
- Progressive access based on trust level

**3. Configurable Thresholds**
- All limits are **environment-defined**
- No hardcoded numeric values in application code
- Limits adjustable without code deployment
- Support for A/B testing and gradual rollout

**4. Defense in Depth**
```
Layer 1: Cloudflare (network-level)
Layer 2: Nginx (gateway-level)
Layer 3: NestJS (application-level)
Layer 4: Business logic (domain-level)
```
- Multiple independent protection layers
- Each layer can operate independently
- Coordinated but not interdependent

**5. Observable and Auditable**
- All rate limit events are logged (see Logging Strategy)
- Metrics exposed for monitoring
- Audit trail for compliance (see Security Plan §6.1)
- Correlation with trace_id for debugging

---

## **1.3. Threats That Rate Limiting Prevents**

Rate limiting addresses the following threat vectors:

### **Application-Layer DDoS**
- **Threat**: Overwhelming API with high request volume
- **Mitigation**: Global and per-IP limits at multiple layers
- **See also**: Security & Compliance Plan §4.2 (DDoS Protection)

### **Brute-Force Attacks**
- **Threat**: Password guessing, token enumeration
- **Mitigation**: Strict limits on authentication endpoints
- **See also**: Security & Compliance Plan §4.3 (Brute-Force Mitigation)

### **Data Scraping & Bot Activity**
- **Threat**: Automated data harvesting, competitive intelligence
- **Mitigation**: IP-based limits, bot detection integration
- **See also**: Security & Compliance Plan §4.4 (Bot Detection)

### **Resource Exhaustion**
- **Threat**: Single client consuming disproportionate resources
- **Mitigation**: Per-user and per-IP limits
- **See also**: Technical Architecture Document §5.3 (Resource Management)

### **API Abuse**
- **Threat**: Malicious or negligent excessive API usage
- **Mitigation**: Role-based and endpoint-specific limits
- **See also**: API Design Blueprint (all endpoints have defined limits)

### **Cost Overruns**
- **Threat**: Uncontrolled usage of paid external services
- **Mitigation**: Strict limits on AI and geocoding endpoints
- **See also**: Backend Implementation Plan §4.7 (External Service Integration)

---

## **1.4. Architecture Components**

### **Component Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    RATE LIMITING STACK                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1] CLOUDFLARE CDN                                        │
│      • Network-layer DDoS protection                       │
│      • Bot detection and challenge                         │
│      • IP reputation filtering                             │
│      • Configurable IP-based rate limits                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [2] NGINX GATEWAY                                   │  │
│  │     • Global request rate limits                    │  │
│  │     • Algorithm: Leaky bucket or sliding window     │  │
│  │     • Burst handling (configurable)                 │  │
│  │     • IP-based tracking                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [3] NESTJS APPLICATION                              │  │
│  │     • Role-based rate limits (Guest/User/Op/Admin)  │  │
│  │     • Endpoint-specific limits                      │  │
│  │     • RateLimitGuard (custom middleware)            │  │
│  │     • Circuit breaker for Redis failures            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [4] REDIS STORAGE                                   │  │
│  │     • Sliding window counters                       │  │
│  │     • Token bucket state (if applicable)            │  │
│  │     • TTL-based automatic cleanup                   │  │
│  │     • Atomic increment operations                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Cloudflare CDN**

**Responsibilities:**
- First line of defense against network-layer attacks
- IP reputation management
- Geographic filtering (configurable)
- Bot detection and challenge/block decisions

**Rate Limiting Capabilities:**
- Configurable IP-based limits
- Global request throttling
- Automatic DDoS mitigation
- Challenge page for suspicious traffic

**Configuration:**
- Managed via Cloudflare dashboard
- Policies defined per Security & Compliance Plan
- Integration with bot detection rules

**See:** Security & Compliance Plan §4.2 (Network Security)

---

### **Nginx Gateway**

**Responsibilities:**
- Global rate limiting before application layer
- IP-based tracking and limiting
- Burst request handling
- Fast-path rejection of excessive requests

**Rate Limiting Module:**
- `ngx_http_limit_req_module` (reference implementation)
- Shared memory zone for counters
- Configurable algorithm (leaky bucket recommended for MVP)

**Example Configuration Structure:**
> **NOTE:** This is a **reference implementation**. Production configuration is environment-specific.

```nginx
# EXAMPLE ONLY - Reference Implementation
http {
    # Shared memory zone for rate limit counters
    limit_req_zone $binary_remote_addr zone=global_limit:10m rate=<CONFIGURABLE>;
    
    # Burst handling
    limit_req zone=global_limit burst=<CONFIGURABLE> nodelay;
    
    # Status code for rate limit exceeded
    limit_req_status 429;
}
```

**Key Features:**
- Operates independently of application
- Low latency (in-memory counters)
- Configurable burst allowance
- Returns HTTP 429 with Retry-After header

---

### **NestJS Application Layer**

**Responsibilities:**
- Role-based rate limiting (after authentication)
- Endpoint-specific limits
- User/Operator identifier-based tracking
- Integration with Redis for distributed state

**Implementation Pattern:**
```typescript
// EXAMPLE ONLY - Reference Implementation
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimiter: RateLimiterService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request); // user_id or IP
    const endpoint = this.getEndpoint(request);
    
    // Load limit configuration for this role + endpoint
    const limitConfig = await this.configService.getRateLimitConfig(
      request.user?.role || 'guest',
      endpoint,
    );
    
    // Check limit against Redis
    const result = await this.rateLimiter.checkLimit(identifier, limitConfig);
    
    if (!result.allowed) {
      throw new RateLimitExceededException(result.retryAfter);
    }
    
    return true;
  }
  
  private getIdentifier(request: any): string {
    // Authenticated: use user_id or operator_id
    if (request.user) {
      return `user:${request.user.id}`;
    }
    // Guest: use IP
    return `ip:${request.ip}`;
  }
}
```

**Features:**
- Configurable per-role limits
- Endpoint-specific overrides
- Circuit breaker for Redis failures
- Comprehensive logging

---

### **Redis Storage**

**Responsibilities:**
- Store rate limit counters and windows
- Provide atomic increment operations
- Automatic TTL-based cleanup
- Support for distributed rate limiting (future)

**Data Structures:**

**Sliding Window Counter:**
> **NOTE:** Implementation example only. Production may use alternative algorithms.

```redis
# EXAMPLE: Redis keys for sliding window
rate_limit:user:<user_id>:<endpoint>:<window_start> → counter (TTL: window duration)
rate_limit:ip:<ip_address>:<endpoint>:<window_start> → counter (TTL: window duration)
```

**Token Bucket State:**
```redis
# EXAMPLE: Token bucket state
token_bucket:user:<user_id> → {tokens: N, last_refill: timestamp}
```

**Operations:**
- `INCR` for counter increment
- `EXPIRE` for TTL management
- `GET` for current limit check
- Lua scripts for atomic multi-command operations

**Memory Management:**
- TTL ensures automatic cleanup
- Memory size: environment-defined
- Eviction policy: `volatile-ttl` (recommended)

**Failure Handling:**
- See §1.2 (Fail-Safe Design)
- Application continues with degraded protection
- Alerts triggered immediately

---

## **1.5. Component Interaction Flow**

```
┌─────────┐
│ Request │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ Cloudflare CDN       │  ← Check: IP reputation, bot score
│ Rate Limit: Layer 1  │     Decision: PASS / CHALLENGE / BLOCK
└────┬─────────────────┘
     │ PASS
     ▼
┌──────────────────────┐
│ Nginx Gateway        │  ← Check: Global IP-based limit
│ Rate Limit: Layer 2  │     Algorithm: Leaky bucket (configurable)
└────┬─────────────────┘     Decision: PASS / 429
     │ PASS
     ▼
┌──────────────────────┐
│ NestJS Application   │  ← Extract: user role, endpoint
│ RateLimitGuard       │     Lookup: Config for role + endpoint
└────┬─────────────────┘     Query: Redis for current count
     │
     ▼
┌──────────────────────┐
│ Redis Storage        │  ← Execute: INCR counter, check limit
│ Counter Check        │     Return: allowed=true/false, retryAfter
└────┬─────────────────┘
     │
     ├─── allowed=false ──→ HTTP 429 (Canonical Error Envelope)
     │
     └─── allowed=true ──→ Continue to business logic
                           └─→ PostgreSQL / AI Service / etc.
```

---

# **2. Global Limits Framework**

## **2.1. Global Request Thresholds**

Global rate limits apply across all endpoints and users to protect overall system capacity.

### **Purpose**
- Prevent total system overload
- Protect shared resources (database, cache, external APIs)
- Provide baseline protection independent of authentication

### **Threshold Definition**
Global limits are **environment-defined** and determined by:
- Infrastructure capacity (CPU, memory, network bandwidth)
- Database connection pool size
- External API quotas (Google Maps, Claude API)
- Target response time SLAs
- Cost considerations

### **Configuration Approach**
```typescript
// EXAMPLE: Configuration structure (reference only)
interface GlobalLimitConfig {
  // Total requests per window (all users, all endpoints)
  requests_per_window: number;        // environment-defined
  window_duration_seconds: number;     // environment-defined
  
  // Burst allowance
  burst_size: number;                  // environment-defined
  
  // Algorithm selection
  algorithm: 'leaky_bucket' | 'sliding_window' | 'token_bucket';
  
  // Enforcement layer
  enforcement_layer: 'nginx' | 'nestjs' | 'both';
}
```

### **Enforcement Points**
- **Primary**: Nginx gateway (Layer 2)
- **Secondary**: NestJS application (Layer 3) as safety net
- **Coordination**: Layers operate independently but with aligned policies

---

## **2.2. Capacity Planning Considerations**

### **Factors Affecting Global Limits**

**Infrastructure Capacity:**
- Server CPU and memory resources
- Network bandwidth availability
- PostgreSQL connection pool size (see Database Specification §7.5)
- Redis memory allocation

**Performance Requirements:**
- Target API response time (e.g., p95 < 500ms)
- Acceptable database load (e.g., < 70% max connections)
- Cache hit ratio targets

**External Dependencies:**
- Google Maps API quota and rate limits
- Claude API quota and rate limits
- Payment gateway (Stripe/Stripe) rate limits

**Cost Constraints:**
- External API costs per request
- Infrastructure scaling costs
- Budget allocation for MVP phase

### **Calculation Methodology**

> **NOTE:** The following is a **reference framework** only. Actual limits must be determined through load testing in the target environment.

**Step 1: Determine Infrastructure Capacity**
```
Max sustainable RPS = min(
  CPU capacity,
  Memory capacity,
  Network capacity,
  Database capacity,
  Cache capacity
)
```

**Step 2: Apply Safety Margin**
```
Target RPS = Max sustainable RPS × safety_factor
```
Where `safety_factor` is configurable (commonly 0.6-0.8)

**Step 3: Account for External APIs**
```
Adjusted RPS = min(
  Target RPS,
  (Google Maps quota / expected_map_requests_ratio),
  (Claude API quota / expected_ai_requests_ratio)
)
```

**Step 4: Convert to Per-Window Limit**
```
Global limit = Adjusted RPS × window_duration_seconds
```

---

## **2.3. Burst Handling Policies**

### **Burst Definition**
A burst is a short-term spike in request rate exceeding the sustained rate limit.

### **Handling Strategies**

**Option 1: Leaky Bucket with Burst Allowance**
- Sustained rate: `R` requests per window (configurable)
- Burst capacity: `B` additional requests (configurable)
- Requests exceeding `R + B` are rejected
- Burst capacity refills gradually

**Option 2: Token Bucket**
- Bucket capacity: configurable
- Refill rate: configurable
- Allows burst up to bucket capacity
- Smoother handling of variable traffic

**Option 3: Sliding Window**
- Fixed window size (configurable)
- No explicit burst handling
- Natural tolerance for short spikes within window

### **MVP Recommendation**
- **Primary**: Leaky bucket with configurable burst (simpler implementation)
- **Burst size**: environment-defined, typically 20-50% of sustained rate
- **Rationale**: Provides good balance of protection and user experience

**Example Burst Configuration:**
> **NOTE:** Reference configuration only

```nginx
# EXAMPLE ONLY
limit_req_zone $binary_remote_addr zone=global_limit:10m rate=<CONFIGURABLE>r/s;
limit_req zone=global_limit burst=<CONFIGURABLE> nodelay;
```

---

## **2.4. Algorithm Selection Guidelines**

### **Algorithm Comparison**

| Algorithm | Pros | Cons | MVP Fit |
|-----------|------|------|---------|
| **Leaky Bucket** | Simple, smooth rate | No burst flexibility | ✅ Recommended |
| **Token Bucket** | Allows bursts, flexible | More complex state | ✅ Alternative |
| **Sliding Window** | Accurate, no sharp edges | Higher memory usage | ✅ Alternative |
| **Fixed Window** | Simplest | Window boundary issues | ⚠️ Not recommended |

### **Selection Criteria**

**Choose Leaky Bucket if:**
- Simplicity is priority
- Smooth, predictable traffic shaping desired
- Minimal state management needed
- Nginx implementation required (native support)

**Choose Token Bucket if:**
- Burst tolerance important
- Variable traffic patterns expected
- Application-layer implementation (NestJS)

**Choose Sliding Window if:**
- Accurate rate measurement critical
- Memory not a constraint
- Application-layer implementation (NestJS + Redis)

### **MVP Configuration**
- **Nginx layer**: Leaky bucket (simpler, native support)
- **NestJS layer**: Sliding window (more accurate, Redis-backed)
- **Reason**: Leverage strengths of each layer

---

## **2.5. Retry-After Behavior**

### **Purpose**
Inform clients when they can retry after hitting rate limit.

### **Calculation**
```
Retry-After = max(
  time_until_window_reset,
  minimum_backoff_duration
)
```

Where:
- `time_until_window_reset`: calculated from algorithm state
- `minimum_backoff_duration`: configurable (prevents tight retry loops)

### **HTTP Header**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: <seconds>
RateLimit-Reset: <unix_timestamp>
RateLimit-Limit: <limit>
RateLimit-Remaining: 0
```

### **Client Behavior Guidance**
- Clients SHOULD respect Retry-After header
- Clients MAY use exponential backoff if Retry-After not provided
- Clients MUST NOT retry immediately after 429

**See:** §8 (Error Handling & Retry Policies) for complete specification

---

# **3. Role-Based Limits Framework**

## **3.1. Guest Limits (IP-Based)**

### **Definition**
Guests are unauthenticated users accessing the platform. Rate limits are enforced based on IP address.

### **Identification**
- **Primary identifier**: Source IP address (`X-Forwarded-For` or `X-Real-IP`)
- **Key format**: `rate_limit:ip:<ip_address>:<endpoint>`
- **Scope**: Per-IP, per-endpoint

### **Limit Categories**

**General Endpoints:**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Allow sufficient browsing while preventing abuse

**Search Endpoints:**
- Limit: configurable threshold (typically lower than general)
- Window: configurable duration
- Rationale: Protect expensive operations (geocoding, database queries)

**Authentication Endpoints:**
- Limit: configurable threshold (typically very low)
- Window: configurable duration
- Rationale: Brute-force protection (see Security Plan §4.3)

### **Example Configuration Structure**
> **NOTE:** Values shown are examples only. Production limits are environment-defined.

```typescript
// EXAMPLE: Reference configuration structure
const guestLimits = {
  general: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
  search: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
  auth: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
  ai_requests: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
};
```

### **Business Logic**
- Guest limits are intentionally more restrictive than authenticated users
- Design encourages registration to gain higher limits
- Aligns with business goal of user acquisition

---

## **3.2. User Limits (Authenticated)**

### **Definition**
Users are authenticated individuals with confirmed identity (email verification required).

### **Identification**
- **Primary identifier**: `user_id` from JWT token
- **Key format**: `rate_limit:user:<user_id>:<endpoint>`
- **Scope**: Per-user, per-endpoint

### **Limit Categories**

**General Endpoints:**
- Limit: configurable threshold (higher than Guest)
- Window: configurable duration
- Rationale: Normal user activity should not be restricted

**Search & Filtering:**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Users may perform multiple searches during decision process

**Booking Operations:**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Prevent automated booking abuse while allowing legitimate use

**AI-Powered Features:**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Control costs from external AI API (Claude)

### **Example Configuration Structure**
> **NOTE:** Values shown are examples only. Production limits are environment-defined.

```typescript
// EXAMPLE: Reference configuration structure
const userLimits = {
  general: {
    requests_per_window: '<CONFIGURABLE (higher than guest)>',
    window_duration: '<CONFIGURABLE>',
  },
  search: {
    requests_per_window: '<CONFIGURABLE (higher than guest)>',
    window_duration: '<CONFIGURABLE>',
  },
  bookings: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
  ai_requests: {
    requests_per_window: '<CONFIGURABLE (higher than guest)>',
    window_duration: '<CONFIGURABLE>',
  },
};
```

---

## **3.3. Operator Limits (Warehouse Owners)**

### **Definition**
Operators are warehouse owners managing their facilities through the platform.

### **Identification**
- **Primary identifier**: `operator_id` from JWT token
- **Secondary**: Associated `user_id`
- **Key format**: `rate_limit:operator:<operator_id>:<endpoint>`
- **Scope**: Per-operator, per-endpoint

### **Limit Categories**

**General Management:**
- Limit: configurable threshold (higher than User)
- Window: configurable duration
- Rationale: Operators need frequent access to manage inventory

**Warehouse & Box Management:**
- Limit: configurable threshold (elevated)
- Window: configurable duration
- Rationale: Bulk operations on inventory data

**Reporting & Analytics:**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Report generation can be resource-intensive

**Booking Management:**
- Limit: configurable threshold (elevated)
- Window: configurable duration
- Rationale: Operators may need to review/modify many bookings

### **Example Configuration Structure**
> **NOTE:** Values shown are examples only. Production limits are environment-defined.

```typescript
// EXAMPLE: Reference configuration structure
const operatorLimits = {
  general: {
    requests_per_window: '<CONFIGURABLE (higher than user)>',
    window_duration: '<CONFIGURABLE>',
  },
  warehouse_management: {
    requests_per_window: '<CONFIGURABLE (elevated)>',
    window_duration: '<CONFIGURABLE>',
  },
  box_management: {
    requests_per_window: '<CONFIGURABLE (elevated)>',
    window_duration: '<CONFIGURABLE>',
  },
  reporting: {
    requests_per_window: '<CONFIGURABLE>',
    window_duration: '<CONFIGURABLE>',
  },
};
```

---

## **3.4. Admin Limits (System Administrators)**

### **Definition**
Admins are system administrators with elevated privileges for platform management.

### **Identification**
- **Primary identifier**: `user_id` with `role=admin`
- **Key format**: `rate_limit:admin:<user_id>:<endpoint>`
- **Scope**: Per-admin, per-endpoint

### **Limit Philosophy**
- Admins receive **elevated limits**, not unlimited access
- Emergency bypass mechanism available with **full audit logging**
- Rationale: Protection against compromised admin accounts

### **Limit Categories**

**General Administration:**
- Limit: configurable threshold (significantly higher than Operator)
- Window: configurable duration
- Rationale: Admins may perform bulk operations

**Emergency Bypass:**
- Available: Policy-defined (requires explicit enable)
- Logging: Mandatory full audit trail (see Logging Strategy §5.3)
- Use case: Critical incidents, system recovery
- Approval: May require multi-factor confirmation

### **Example Configuration Structure**
> **NOTE:** Values shown are examples only. Production limits are environment-defined.

```typescript
// EXAMPLE: Reference configuration structure
const adminLimits = {
  general: {
    requests_per_window: '<CONFIGURABLE (highly elevated)>',
    window_duration: '<CONFIGURABLE>',
  },
  emergency_bypass: {
    enabled: '<POLICY-DEFINED>',
    requires_mfa: true,
    audit_level: 'full',  // See Logging Strategy
  },
};
```

### **Security Considerations**
- Admin bypass logged to separate audit log (immutable)
- Alerts triggered on bypass activation
- Post-incident review required
- See Security & Compliance Plan §6.1 for audit requirements

---

## **3.5. Comparative Matrix**

### **Role-Based Limits Comparison**

> **NOTE:** All values are **example reference configurations**. Actual limits are **environment-defined** and determined through capacity planning and business requirements.

| Category | Guest | User | Operator | Admin |
|----------|-------|------|----------|-------|
| **Identification** | IP address | user_id | operator_id | user_id (role=admin) |
| **General Requests** | Baseline | Higher | Elevated | Highly Elevated |
| **Search Operations** | Limited | Higher | Elevated | Highly Elevated |
| **Write Operations** | Very Limited | Standard | Elevated | Highly Elevated |
| **AI Requests** | Minimal | Standard | Higher | Highly Elevated |
| **Concurrent Requests** | Low | Medium | High | Very High |
| **Bypass Available** | No | No | No | Yes (with audit) |
| **Authentication Required** | No | Yes | Yes | Yes + MFA |

### **Progressive Limit Structure**

```
Guest < User < Operator < Admin

Where:
- Guest:    Baseline (most restrictive)
- User:     2-3× Guest limits
- Operator: 2-3× User limits
- Admin:    5-10× User limits
```

**Exact multipliers are environment-defined and configurable.**

### **Business Alignment**
- **Guest → User**: Encourages registration
- **User → Operator**: Supports business operations
- **Operator → Admin**: Allows system management
- All transitions increase trust and access

---

# **4. IP-Based & Identifier Limits**

## **4.1. IP-Based Rate Limiting**

### **Purpose**
Provide protection for unauthenticated traffic and prevent abuse from single sources.

### **Scope**
- Applied to all requests before authentication
- Supplements role-based limits (not a replacement)
- Primary defense against distributed attacks when aggregated

### **IP Extraction**
```typescript
// EXAMPLE: Reference implementation for IP extraction
function getClientIP(request: Request): string {
  // Check proxy headers (Cloudflare, Nginx)
  const forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    // Take first IP (original client)
    return forwardedFor.split(',')[0].trim();
  }
  
  // Check alternative headers
  const realIP = request.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }
  
  // Fallback to direct connection IP
  return request.socket.remoteAddress;
}
```

### **IPv4 vs IPv6 Handling**
- **IPv4**: Track per individual IP address
- **IPv6**: Policy-defined (may track per /64 subnet due to rotation)
- Configuration: Environment-specific

### **Limit Configuration**
```typescript
// EXAMPLE: Reference configuration structure
interface IPBasedLimit {
  requests_per_window: number;    // configurable
  window_duration: number;         // configurable
  subnet_mask_v6?: number;         // optional, default: /64
  whitelist: string[];             // known good IPs (monitoring services)
  blacklist: string[];             // known bad IPs (manual blocks)
}
```

---

## **4.2. Anti-Bot Policy Framework**

### **Overview**
Bot detection and mitigation is primarily handled by **Security & Compliance Plan §4.4 (Bot Detection & Mitigation)**.

Rate limiting provides **complementary protection** through:
- Pattern detection (repetitive identical requests)
- Velocity checks (requests per second analysis)
- User-Agent validation (missing or suspicious headers)

### **Rate Limiting's Role**

**Pattern Detection:**
- Identical requests repeated at fixed intervals
- Sequential enumeration of IDs or parameters
- Lack of natural variation in request timing

**Velocity Thresholds:**
- Requests per second exceeding human capabilities
- Zero delay between sequential requests
- Burst patterns inconsistent with browser behavior

**Integration Points:**
- Rate limiter MAY flag suspicious patterns to security layer
- Security layer provides bot score to rate limiter
- Combined: stricter limits applied to low bot scores

### **Policy-Driven Response**
When bot-like behavior detected:
- System MAY apply **temporary rate reduction** (configurable multiplier)
- System MAY require **challenge completion** (CAPTCHA, see Security Plan)
- System MAY escalate to **temporary IP restriction**
- All actions are **policy-defined** and **audited**

**For complete bot detection strategy, see:** Security & Compliance Plan §4.4

---

## **4.3. Bulk Request Restrictions**

### **Definition**
Bulk requests are high-volume operations that may indicate:
- Legitimate automation (admin scripts, integrations)
- Abusive scraping or data harvesting
- Performance testing without authorization

### **Detection Criteria**

**Volume-Based:**
- Requests exceeding configurable threshold within window
- Sustained high request rate (not just bursts)
- Multiple endpoints accessed in rapid succession

**Pattern-Based:**
- Sequential ID enumeration (e.g., `/boxes/1`, `/boxes/2`, ...)
- Alphabetical parameter iteration
- Systematic path traversal

### **Response Policy**

**For Authenticated Users/Operators:**
- System MAY temporarily reduce limits (configurable percentage)
- Notification sent to user (email or in-app)
- Audit log entry created (see Logging Strategy)
- Manual review triggered for repeated offenses

**For Unauthenticated (Guest/IP):**
- System MAY apply **graduated restriction**:
  1. First offense: Warning (logged, no action)
  2. Repeated: Temporary rate reduction
  3. Persistent: Temporary IP-based restriction
- Escalation is **policy-defined**

### **Legitimate Use Cases**
- Admin bulk operations: Use dedicated admin endpoints with higher limits
- API integrations: Provide API keys with separate rate limits (post-MVP)
- Data exports: Use dedicated export endpoints with queueing

---

## **4.4. Operator-Specific Limits**

### **Rationale**
Operators (warehouse owners) require different limits than regular users due to:
- Bulk inventory management operations
- Frequent status updates for boxes and bookings
- Report generation and analytics access
- Multi-warehouse management

### **Identifier Scoping**
```
Rate limit key: rate_limit:operator:<operator_id>:<endpoint>
```

### **Endpoint-Specific Overrides**

**Warehouse Management:**
```typescript
// EXAMPLE: Reference configuration
endpoints: {
  'POST /operators/warehouses': {
    limit: '<CONFIGURABLE>',
    window: '<CONFIGURABLE>',
  },
  'PATCH /operators/warehouses/:id': {
    limit: '<CONFIGURABLE>',
    window: '<CONFIGURABLE>',
  },
}
```

**Box Management:**
```typescript
// EXAMPLE: Reference configuration
endpoints: {
  'POST /operators/boxes': {
    limit: '<CONFIGURABLE (elevated for bulk)>',
    window: '<CONFIGURABLE>',
  },
  'PATCH /operators/boxes/:id': {
    limit: '<CONFIGURABLE (elevated)>',
    window: '<CONFIGURABLE>',
  },
  'DELETE /operators/boxes/:id': {
    limit: '<CONFIGURABLE>',
    window: '<CONFIGURABLE>',
  },
}
```

**Booking Management:**
```typescript
// EXAMPLE: Reference configuration
endpoints: {
  'GET /operators/bookings': {
    limit: '<CONFIGURABLE (elevated)>',
    window: '<CONFIGURABLE>',
  },
  'PATCH /operators/bookings/:id': {
    limit: '<CONFIGURABLE>',
    window: '<CONFIGURABLE>',
  },
}
```

### **Multi-Warehouse Operators**
- Operators with multiple warehouses receive **same per-operator limits**
- Limits are NOT multiplied by warehouse count
- Rationale: Prevent privilege escalation through warehouse creation
- Future: May implement per-warehouse sub-limits (post-MVP)

---

# **5. Endpoint-Specific Limits**

## **5.1. Search Endpoint Protection (/warehouses/search)**

### **Risk Profile**
- **Computational cost**: Geocoding, spatial queries, AI recommendations
- **External API usage**: Google Maps API (paid per request)
- **Database load**: Complex geospatial JOIN queries
- **Scraping risk**: High value data for competitors

### **Limit Strategy**

**For Guests (IP-based):**
- Limit: configurable threshold (lower than general endpoints)
- Window: configurable duration
- Rationale: Allow legitimate shopping while preventing scraping

**For Authenticated Users:**
- Limit: configurable threshold (higher than guests)
- Window: configurable duration
- Rationale: Support genuine multi-search shopping behavior

**For Operators:**
- Limit: configurable threshold (higher than users)
- Window: configurable duration
- Rationale: Market research and competitive analysis

### **Additional Protections**
- **Query complexity limits**: Max number of filters per request (configurable)
- **Geographic radius limits**: Max search radius (configurable km/miles)
- **Result pagination**: Enforced page size limits (configurable)

**See also:** API Design Blueprint §4.1.1 (Search Endpoint Specification)

---

## **5.2. Booking Endpoint Protection (/bookings)**

### **Risk Profile**
- **Inventory locking**: Bookings temporarily lock box availability
- **Payment initiation**: May trigger payment gateway API calls
- **Email notifications**: Sends confirmation emails (cost and reputation risk)
- **Database writes**: Transactional operations

### **Limit Strategy**

**Booking Creation (POST /bookings):**
- Limit: configurable threshold per user per time window
- Window: configurable duration (typically longer than general)
- Rationale: Prevent booking spam while allowing legitimate multi-box bookings

**Booking Modification (PATCH /bookings/:id):**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Modifications are lower risk than creation

**Booking Cancellation (DELETE /bookings/:id):**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Allow cancellations but prevent abuse patterns

### **Progressive Restriction**
If user exceeds booking creation limit:
1. **First occurrence**: Standard 429 response with retry-after
2. **Repeated pattern**: System MAY flag for manual review
3. **Persistent abuse**: System MAY apply extended rate reduction (policy-defined)

**See also:** 
- API Design Blueprint §4.2 (Booking Endpoints)
- Database Specification §3.3 (Booking Table)

---

## **5.3. Box Listing Protection (/boxes)**

### **Risk Profile**
- **Data scraping**: Box details valuable for competitive intelligence
- **High volume**: Many GET requests for browsing
- **Cache behavior**: Heavy reliance on Redis caching

### **Limit Strategy**

**GET /boxes (list):**
- Limit: configurable threshold (relatively high for browsing)
- Window: configurable duration
- Caching: Aggressive caching reduces limit impact

**GET /boxes/:id (detail):**
- Limit: configurable threshold
- Window: configurable duration
- Rationale: Users may view many box details during decision

**Operator Write Operations:**
- POST /operators/boxes: configurable elevated limit
- PATCH /operators/boxes/:id: configurable elevated limit
- DELETE /operators/boxes/:id: configurable limit
- Rationale: Operators need bulk operations capability

---

## **5.4. Operator Endpoint Security (/operators/*)**

### **Risk Profile**
- **Sensitive data access**: Operator-specific business data
- **Write operations**: Inventory and booking management
- **Financial data**: Revenue reports and analytics
- **Privilege escalation risk**: Compromised operator accounts

### **Limit Strategy**

**All /operators/* endpoints:**
- Limits: elevated relative to public endpoints (configurable)
- Authentication: Required (JWT with operator role)
- Rationale: Support business operations while detecting compromised accounts

**Specific Endpoint Categories:**

**Analytics/Reports:**
- GET /operators/reports/*: configurable limit
- Rationale: Report generation is resource-intensive
- May implement queueing for heavy reports (post-MVP)

**Bulk Operations:**
- POST /operators/boxes/bulk: configurable limit (lower than individual)
- Rationale: Single bulk request affects multiple resources

**Financial Endpoints:**
- GET /operators/revenue: configurable limit
- GET /operators/payouts: configurable limit
- Rationale: Sensitive data, audit logging required

**See also:** Security & Compliance Plan §5.4 (Operator Data Protection)

---

## **5.5. Endpoint Limits Matrix**

### **Comprehensive Endpoint Rate Limits**

> **NOTE:** All values in this table are **example configurations for reference only**. Actual production limits are **environment-defined** and must be determined through load testing and business requirements analysis.

| Endpoint Category | Guest | User | Operator | Admin | Notes |
|-------------------|-------|------|----------|-------|-------|
| **Public Browsing** |
| GET /warehouses | Standard | Higher | Elevated | Highly Elevated | Cached heavily |
| GET /boxes | Standard | Higher | Elevated | Highly Elevated | Cached heavily |
| GET /boxes/:id | Standard | Higher | Elevated | Highly Elevated | Cache per-box |
| **Search Operations** |
| POST /warehouses/search | Restricted | Standard | Higher | Elevated | Geocoding cost |
| GET /warehouses/search | Restricted | Standard | Higher | Elevated | Query complexity |
| **Authentication** |
| POST /auth/register | Very Restricted | N/A | N/A | N/A | Brute-force protection |
| POST /auth/login | Very Restricted | N/A | N/A | N/A | See Security Plan §4.3 |
| POST /auth/refresh | Restricted | Standard | Standard | Standard | Token refresh |
| **Booking Operations** |
| POST /bookings | Very Restricted | Restricted | Standard | Elevated | Inventory locking |
| GET /bookings | Restricted | Standard | Higher | Elevated | User history |
| PATCH /bookings/:id | Restricted | Standard | Higher | Elevated | Modifications |
| DELETE /bookings/:id | Restricted | Standard | Higher | Elevated | Cancellations |
| **AI Features** |
| POST /ai/chat | Minimal | Restricted | Standard | Higher | Claude API cost |
| GET /ai/recommendations | Restricted | Standard | Higher | Elevated | AI processing |
| **Operator Management** |
| POST /operators/warehouses | N/A | N/A | Standard | Elevated | Warehouse creation |
| PATCH /operators/warehouses/:id | N/A | N/A | Higher | Elevated | Updates |
| POST /operators/boxes | N/A | N/A | Elevated | Highly Elevated | Bulk inventory |
| PATCH /operators/boxes/:id | N/A | N/A | Higher | Elevated | Box updates |
| GET /operators/bookings | N/A | N/A | Elevated | Highly Elevated | Dashboard access |
| GET /operators/reports/* | N/A | N/A | Restricted | Standard | Resource-intensive |
| **Admin Operations** |
| POST /admin/users/:id/verify | N/A | N/A | N/A | Standard | User verification |
| GET /admin/audit-logs | N/A | N/A | N/A | Standard | Audit access |
| PATCH /admin/system/config | N/A | N/A | N/A | Restricted | Config changes |

**Legend:**
- **Very Restricted**: Lowest configurable limit (e.g., brute-force protection)
- **Restricted**: Low configurable limit (e.g., cost-sensitive operations)
- **Standard**: Baseline configurable limit for normal operations
- **Higher**: Elevated configurable limit
- **Highly Elevated**: Significantly elevated configurable limit
- **N/A**: Endpoint not accessible to this role

---

# **6. Throttling Strategy**

## **6.1. Soft Throttling**

### **Definition**
Soft throttling is **gradual request slowdown** before reaching hard limit. System introduces artificial delays to signal impending limit.

### **Purpose**
- Provide graceful degradation instead of abrupt blocking
- Give clients opportunity to self-regulate
- Reduce sharp user experience degradation
- Maintain system availability under load

### **Trigger Condition**
```
current_usage >= (limit × soft_threshold_percentage)
```
Where `soft_threshold_percentage` is configurable (typically 70-90%)

### **Delay Calculation**
> **NOTE:** Example calculation method. Production may use alternative algorithms.

```typescript
// EXAMPLE: Reference implementation
function calculateSoftThrottleDelay(
  currentUsage: number,
  limit: number,
  config: ThrottleConfig
): number {
  const utilizationRatio = currentUsage / limit;
  
  // No delay below soft threshold
  if (utilizationRatio < config.softThresholdRatio) {
    return 0;
  }
  
  // Graduated delay: increases as usage approaches limit
  const excessRatio = (utilizationRatio - config.softThresholdRatio) / 
                      (1 - config.softThresholdRatio);
  
  const delay = config.minDelayMs + 
                (config.maxDelayMs - config.minDelayMs) * Math.pow(excessRatio, 2);
  
  return Math.min(delay, config.maxDelayMs);
}
```

### **Configuration**
```typescript
// EXAMPLE: Reference configuration structure
interface SoftThrottleConfig {
  enabled: boolean;                     // configurable
  softThresholdRatio: number;           // configurable (0.7 - 0.9)
  minDelayMs: number;                   // configurable
  maxDelayMs: number;                   // configurable
  delayFunction: 'linear' | 'quadratic' | 'exponential'; // configurable
}
```

### **Client Communication**
- Delay is **server-side** (request processing is delayed)
- Client sees increased response time
- Optional: `X-RateLimit-Throttled: soft` header to signal throttling active

---

## **6.2. Hard Throttling**

### **Definition**
Hard throttling is **request rejection** when limit is exceeded. Client receives HTTP 429 and must wait.

### **Trigger Condition**
```
current_usage >= limit
```

### **Response**
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: <seconds>
RateLimit-Limit: <limit>
RateLimit-Remaining: 0
RateLimit-Reset: <unix_timestamp>

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after specified duration.",
    "details": {
      "limit": <limit>,
      "window": <window_seconds>,
      "retry_after": <seconds>
    },
    "trace_id": "<correlation_id>"
  }
}
```

**See §8.1 for complete error response format (canonical error envelope)**

### **Duration Calculation**
```
retry_after = time_until_window_reset + min_backoff
```
Where:
- `time_until_window_reset`: calculated from rate limit window
- `min_backoff`: configurable minimum retry delay

### **Persistent Violations**
If user repeatedly hits hard limit:
- System MAY apply **escalated restriction** (policy-defined)
- Escalation pattern: configurable (e.g., longer windows, lower limits)
- Alerts triggered for potential abuse investigation

---

## **6.3. Adaptive Throttling**

### **Definition**
Adaptive throttling **dynamically adjusts limits** based on system load and traffic patterns.

### **Trigger Conditions**

**System Load-Based:**
- CPU utilization > configurable threshold
- Memory pressure > configurable threshold
- Database connection pool > configurable percentage full
- Redis memory usage > configurable threshold

**Traffic Pattern-Based:**
- Detected spike (see §7.3)
- Unusual geographic distribution
- High error rate from upstream services

### **Adjustment Strategy**

**Load Shedding:**
When system under stress:
```
temporary_limit = base_limit × reduction_factor
```
Where `reduction_factor` is policy-defined (typically 0.5 - 0.8)

**Priority Preservation:**
- Admin and Operator limits reduced less aggressively than User/Guest
- Critical endpoints (auth, existing bookings) protected more
- New bookings may be throttled more aggressively

### **Recovery**
```typescript
// EXAMPLE: Reference implementation for gradual recovery
class AdaptiveThrottle {
  async adjustLimits(): Promise<void> {
    const systemLoad = await this.metrics.getSystemLoad();
    
    if (systemLoad.cpu < this.config.cpuThreshold && 
        systemLoad.memory < this.config.memoryThreshold) {
      // System healthy: gradually increase limits back to normal
      await this.increaseLimits(this.config.recoveryRate);
    } else {
      // System still stressed: maintain or reduce further
      await this.reduceLimits(this.config.reductionRate);
    }
  }
  
  private async increaseLimits(rate: number): Promise<void> {
    // Gradual recovery: increase by small percentage each interval
    // Never exceed base limits
  }
  
  private async reduceLimits(rate: number): Promise<void> {
    // Gradual reduction: decrease by small percentage
    // Have a minimum floor limit
  }
}
```

### **Monitoring**
- Adaptive throttling events logged (see Logging Strategy)
- Metrics exposed: current limit vs. base limit
- Alerts on sustained throttling periods

---

## **6.4. Gradual Slowdown Mechanism**

### **Purpose**
Implement **smooth transition** from normal operation → soft throttle → hard limit.

### **Implementation Stages**

**Stage 1: Normal (0-70% of limit)**
- No throttling
- Full performance
- Standard response times

**Stage 2: Warning (70-85% of limit)**
- Optional warning header: `X-RateLimit-Warning: approaching-limit`
- No performance impact
- Client awareness opportunity

**Stage 3: Soft Throttle (85-95% of limit)**
- Graduated delays introduced
- Response times increase proportionally
- Client experiences slowdown as signal

**Stage 4: Heavy Throttle (95-100% of limit)**
- Maximum delays (configurable)
- Significant slowdown
- Clear signal to client to reduce rate

**Stage 5: Hard Limit (100%+ of limit)**
- Request rejection
- HTTP 429 response
- Forced wait period

### **Percentage Thresholds**
All percentage thresholds are **configurable** and **environment-defined**. Values above are example references only.

---

## **6.5. Throttling vs Rate Limiting Distinction**

### **Definitions**

**Rate Limiting:**
- **What**: Counting requests and enforcing maximum limits
- **Action**: Allow or reject request
- **Response**: HTTP 200 (allowed) or HTTP 429 (rejected)
- **Purpose**: Hard boundary enforcement

**Throttling:**
- **What**: Slowing down request processing
- **Action**: Introduce delays or reduce throughput
- **Response**: HTTP 200 (but delayed response)
- **Purpose**: Graceful degradation

### **Combined Usage**

```
┌────────────────────────────────────────────────────────┐
│                   REQUEST FLOW                          │
├────────────────────────────────────────────────────────┤
│                                                          │
│  [1] Check Rate Limit                                   │
│      └─ Current count < limit?                          │
│          ├─ YES → Continue to [2]                       │
│          └─ NO  → Return HTTP 429 (RATE LIMIT)          │
│                                                          │
│  [2] Check Throttle Threshold                           │
│      └─ Usage < soft threshold?                         │
│          ├─ YES → Process immediately                   │
│          └─ NO  → Apply delay (THROTTLE)                │
│                                                          │
│  [3] Process Request                                    │
│      └─ Business logic execution                        │
│                                                          │
│  [4] Return Response                                    │
│      └─ HTTP 200 with RateLimit headers                 │
│                                                          │
└────────────────────────────────────────────────────────┘
```

### **Configuration Relationship**
- Rate limit defines **maximum** allowed requests
- Throttle threshold defines when **slowdown begins**
- Both are independently configurable
- Recommended: `throttle_threshold < rate_limit`

---

# **7. Spike Protection**

## **7.1. Spike Detection Framework**

### **Definition**
A spike is a sudden, significant increase in request rate that may indicate legitimate traffic surge, attack/abuse, or system malfunction.

### **Detection Criteria**

**Statistical Approach:**
```
spike_detected = current_rate > (baseline_rate × spike_multiplier)
```

Where all parameters are **environment-defined**: `current_rate` (requests per second in configurable window), `baseline_rate` (historical average), `spike_multiplier` (configurable threshold, typically 2-5x).

### **Implementation Reference**

> **NOTE:** Example detection logic. Production may use alternative algorithms.

```typescript
// EXAMPLE: Reference implementation
class SpikeDetector {
  async detectSpike(identifier: string): Promise<SpikeDetection> {
    const currentRate = await this.getCurrentRate(identifier);
    const baseline = await this.getBaseline(identifier);
    const threshold = baseline * this.config.spikeMultiplier;
    
    if (currentRate > threshold) {
      return {
        detected: true,
        currentRate,
        baseline,
        multiplier: currentRate / baseline,
        confidence: this.calculateConfidence(currentRate, baseline),
      };
    }
    
    return { detected: false };
  }
}
```

---

## **7.2. Token Bucket Overflow Handling**

### **Token Bucket Background**
Token bucket algorithm (if used) maintains:
- Bucket capacity (configurable max tokens)
- Refill rate (configurable tokens per second)
- Current token count

### **Overflow Scenario**
Overflow occurs when:
```
requests_in_burst > bucket_capacity
```

### **Handling Policy**

**Option 1: Drop Overflow Requests**
- Requests exceeding bucket capacity are rejected immediately
- HTTP 429 response
- Retry-After header provided

**Option 2: Queue Overflow Requests**
- Requests queued up to configurable queue depth
- Processing delayed until tokens available
- Queue timeout (configurable) after which request is rejected

**Option 3: Hybrid**
- Small queue (configurable size) for slight overflows
- Hard rejection for requests exceeding queue capacity
- **Recommended for MVP** (balances UX and complexity)

### **Configuration**
```typescript
// EXAMPLE: Reference configuration
interface TokenBucketConfig {
  capacity: number;              // configurable
  refillRate: number;            // configurable (tokens per second)
  overflowQueue: {
    enabled: boolean;            // configurable
    maxSize: number;             // configurable
    timeoutMs: number;           // configurable
  };
}
```

---

## **7.3. Spike Classification Logic**

### **Classification Categories**

**Legitimate Spike:** Gradual increase, distributed across endpoints, normal error rate, reasonable User-Agent/geo distribution

**Attack Spike:** Instant increase, focused endpoints, high error rate, unusual User-Agent/geo patterns

**Malfunction Spike:** From known clients, repeated identical requests, immediate retries without backoff

### **Classification Algorithm**

> **NOTE:** Reference algorithm. Production may use ML or alternative heuristics.

```typescript
// EXAMPLE: Reference classification logic
class SpikeClassifier {
  async classify(spike: DetectedSpike): Promise<SpikeClassification> {
    const signals = {
      userAgentDiversity: await this.analyzeUserAgents(spike),
      endpointDistribution: await this.analyzeEndpoints(spike),
      errorRate: await this.calculateErrorRate(spike),
      geoDistribution: await this.analyzeGeography(spike),
      requestPattern: await this.analyzePattern(spike),
    };
    
    // Scoring algorithm (configurable weights)
    return {
      type: this.getHighestScore(signals),  // legitimate / attack / malfunction
      confidence: this.calculateConfidence(signals),
      signals,
    };
  }
}
```

### **Response Policy**

All actions are **policy-driven** and **configurable**:

- **Legitimate:** MAY temporarily increase limits, monitor, alert ops (informational)
- **Attack:** MAY reduce limits, activate enhanced logging, escalate to security, consider CAPTCHA
- **Malfunction:** Contact client, provide retry guidance, may increase limits temporarily

---

## **7.4. Circuit Breaker Pattern**

### **Purpose**
Protect system from cascading failures when dependencies fail (especially Redis).

### **States**

**Closed (Normal):** All requests processed, rate limiting fully functional, errors tracked

**Open (Failure Detected):** Rate limiter bypassed (fail-safe: allow requests), Redis calls suspended, alert triggered, periodic health checks

**Half-Open (Testing Recovery):** Limited requests tested against Redis, success → Closed, failure → back to Open

### **State Transitions**

```
     [Normal Operation]
            │
            │ error_count > threshold
            ▼
        [CLOSED] ────────────────────► [OPEN]
            ▲                            │
            │                            │ timeout expires
            │                            ▼
            │                        [HALF-OPEN]
            │                            │
            │  success_count >= threshold│
            └────────────────────────────┘
                failure → back to OPEN
```

### **Configuration**
```typescript
// EXAMPLE: Reference circuit breaker configuration
interface CircuitBreakerConfig {
  errorThreshold: number;        // configurable (errors before opening)
  timeoutMs: number;             // configurable (time before half-open attempt)
  successThreshold: number;      // configurable (successes to close)
  monitoringWindowMs: number;    // configurable (error counting window)
}
```

### **Fail-Safe Behavior**
**Critical:** When circuit is OPEN, system MUST allow requests through. Rationale: Availability > perfect rate limiting. **For MVP: Allow requests** when circuit breaker open.

---

# **8. Error Handling & Retry Policies**

## **8.1. HTTP 429 Response Format**

### **Canonical Error Envelope**

Rate limit exceeded responses MUST conform to the **canonical error envelope** defined in **Error Handling & Fault Tolerance Specification**.

**Standard Format:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after specified duration.",
    "details": {
      "limit": "<configurable>",
      "window": "<configurable>",
      "window_unit": "seconds|minutes|hours",
      "retry_after": "<calculated_seconds>",
      "scope": "ip|user|endpoint|global"
    },
    "trace_id": "<correlation_id>",
    "timestamp": "<ISO8601>"
  }
}
```

### **HTTP Status Code**
```http
HTTP/1.1 429 Too Many Requests
```

### **Required Headers**
```http
Content-Type: application/json
Retry-After: <seconds>
RateLimit-Limit: <limit>
RateLimit-Remaining: <remaining>
RateLimit-Reset: <unix_timestamp>
X-Trace-ID: <correlation_id>
```

### **Error Code**
- **Code**: `RATE_LIMIT_EXCEEDED`
- **HTTP Status**: 429
- **Severity**: `warning` (client error, not server error)

**See:** Error Handling Specification §3.2 (Client Error Responses) for complete error envelope definition.

---

## **8.2. HTTP Headers Specification**

### **RateLimit-* Headers**

These headers follow the **IETF draft standard** for rate limit headers.

**RateLimit-Limit:**
```http
RateLimit-Limit: <requests>
```
- Indicates the maximum number of requests allowed in the current window
- Value is the configured limit for this client/endpoint combination

**RateLimit-Remaining:**
```http
RateLimit-Remaining: <requests>
```
- Indicates how many requests the client has remaining in current window
- Value decreases with each request
- `0` when limit reached

**RateLimit-Reset:**
```http
RateLimit-Reset: <unix_timestamp>
```
- Indicates when the rate limit window resets
- Unix timestamp (seconds since epoch)
- Client can calculate `retry_after = reset - current_time`

### **Retry-After Header**

```http
Retry-After: <seconds>
```
- **Required** in all 429 responses
- Indicates minimum time client should wait before retrying
- Value calculated from window reset time + configurable backoff
- Clients SHOULD respect this value

### **Custom Headers**

**X-RateLimit-Scope:**
```http
X-RateLimit-Scope: user|ip|endpoint|global
```
- Indicates which rate limit was triggered
- Helps clients understand the constraint

**X-RateLimit-Throttled:**
```http
X-RateLimit-Throttled: soft|hard
```
- Present only when throttling active
- `soft`: request processed but delayed
- `hard`: request rejected (429)

### **Example Complete Response**

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 45
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1702656000
X-RateLimit-Scope: user
X-Trace-ID: 550e8400-e29b-41d4-a716-446655440000

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 45 seconds.",
    "details": {
      "limit": 100,
      "window": 60,
      "window_unit": "seconds",
      "retry_after": 45,
      "scope": "user"
    },
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-15T10:00:00Z"
  }
}
```

---

## **8.3. Client Retry Recommendations**

### **Retry Strategy**

**Clients SHOULD implement:**

**1. Respect Retry-After Header**
```typescript
// EXAMPLE: Client-side retry logic (reference)
async function requestWithRetry(url: string, options: RequestOptions): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        const waitSeconds = parseInt(retryAfter, 10);
        await sleep(waitSeconds * 1000);
        return requestWithRetry(url, options); // Retry once
      }
    }
    
    return response;
  } catch (error) {
    // Handle network errors
    throw error;
  }
}
```

**2. Exponential Backoff (if Retry-After not provided)**
```typescript
// EXAMPLE: Exponential backoff (reference)
async function retryWithBackoff(
  operation: () => Promise<Response>,
  maxRetries: number = 3
): Promise<Response> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await operation();
      
      if (response.status !== 429) {
        return response;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, ...
      const waitMs = Math.pow(2, retries) * 1000;
      await sleep(waitMs);
      retries++;
    } catch (error) {
      if (retries >= maxRetries - 1) throw error;
      retries++;
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

**3. Jitter Addition**
```typescript
// EXAMPLE: Add jitter to prevent thundering herd
function addJitter(baseDelayMs: number): number {
  const jitter = Math.random() * baseDelayMs * 0.2; // ±20%
  return baseDelayMs + jitter;
}
```

### **Best Practices**

**DO:**
- Honor `Retry-After` header
- Use exponential backoff if header missing
- Add jitter to retry delays
- Limit total retry attempts (max 3-5)
- Monitor rate limit headers to predict limits
- Cache responses to reduce request frequency

**DON'T:**
- Retry immediately after 429
- Ignore `Retry-After` header
- Implement aggressive retry loops
- Retry indefinitely
- Assume limits are per-endpoint only (may be cross-endpoint)

---

## **8.4. Client-Side Rate Limiting**

### **Purpose**
Clients SHOULD implement their own rate limiting to:
- Prevent hitting server limits
- Improve user experience (predictable behavior)
- Reduce unnecessary API calls
- Minimize 429 error frequency

### **Implementation Approach**

**Token Bucket (Recommended):**
```typescript
// EXAMPLE: Client-side token bucket (reference)
class ClientRateLimiter {
  private tokens: number;
  private lastRefill: number;
  
  constructor(
    private limit: number,
    private windowMs: number
  ) {
    this.tokens = limit;
    this.lastRefill = Date.now();
  }
  
  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens < 1) {
      const waitMs = this.windowMs - (Date.now() - this.lastRefill);
      await sleep(Math.max(0, waitMs));
      this.refill();
    }
    
    this.tokens--;
  }
  
  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    
    if (timePassed >= this.windowMs) {
      this.tokens = this.limit;
      this.lastRefill = now;
    }
  }
}
```

### **Tracking Server Limits**

**Parse RateLimit Headers:**
```typescript
// EXAMPLE: Track server limits from headers
class ServerLimitTracker {
  private limits: Map<string, LimitInfo> = new Map();
  
  updateFromHeaders(endpoint: string, headers: Headers): void {
    const limit = parseInt(headers.get('RateLimit-Limit') || '0');
    const remaining = parseInt(headers.get('RateLimit-Remaining') || '0');
    const reset = parseInt(headers.get('RateLimit-Reset') || '0');
    
    this.limits.set(endpoint, { limit, remaining, reset });
  }
  
  shouldThrottle(endpoint: string): boolean {
    const info = this.limits.get(endpoint);
    if (!info) return false;
    
    // Throttle if remaining < 20% of limit
    return info.remaining < (info.limit * 0.2);
  }
}
```

### **Queuing Strategy**

**Request Queue:**
```typescript
// EXAMPLE: Client-side request queue
class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing: boolean = false;
  
  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
  
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        await this.rateLimiter.acquire(); // Rate limit between requests
      }
    }
    
    this.processing = false;
  }
}
```

---

## **8.5. Integration with Error Handling Specification**

### **Error Handling Specification Alignment**

All rate limiting errors MUST comply with:
- **Error Handling & Fault Tolerance Specification §3.2** (Client Error Responses)
- **Error Handling & Fault Tolerance Specification §4.1** (Error Envelope Format)
- **Error Handling & Fault Tolerance Specification §5** (Logging Requirements)

### **Error Code Registration**

**RATE_LIMIT_EXCEEDED:**
- **HTTP Status**: 429
- **Severity**: `warning`
- **Retry**: Yes (after Retry-After duration)
- **User Message**: "You've made too many requests. Please wait before trying again."
- **Developer Message**: "Rate limit exceeded. Current limit: {limit} per {window}. Retry after {retry_after}s."

### **Logging Integration**

Every rate limit event MUST be logged according to **Logging Strategy**:

```json
{
  "timestamp": "2025-12-15T10:00:00.000Z",
  "level": "warn",
  "event": "rate_limit_exceeded",
  "trace_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "usr_123",
  "ip_address": "203.0.113.42",
  "endpoint": "/api/v1/warehouses/search",
  "method": "POST",
  "rate_limit": {
    "scope": "user",
    "limit": 100,
    "window": 60,
    "current_usage": 101,
    "retry_after": 45
  },
  "http_status": 429
}
```

**See:** Logging Strategy §4.3 (Rate Limit Events) for complete logging requirements.

### **Metrics Integration**

Rate limiting metrics MUST be exposed:
- `rate_limit_exceeded_total` (counter, by scope/endpoint)
- `rate_limit_current_usage` (gauge, by identifier)
- `rate_limit_429_responses` (counter, by endpoint)
- `rate_limit_throttle_delays` (histogram, by scope)

**See:** Technical Architecture §5.5 (Observability) for metrics specifications.

---

# **9. Monitoring & Logging Requirements**

## **9.1. Rate Limit Metrics**

### **Core Metrics**

All rate limiting implementations MUST expose the following metrics:

```
rate_limit_usage_ratio{scope, identifier, endpoint}
  Type: Gauge | Range: 0.0-1.0 | Calculation: current_requests / limit

rate_limit_exceeded_total{scope, endpoint, http_status}
  Type: Counter | Incremented on each 429 response

rate_limit_throttle_delay_seconds{scope, endpoint}
  Type: Histogram | Measures applied throttle delays

rate_limit_circuit_breaker_state{component}
  Type: Gauge | Values: 0 (closed), 1 (open), 2 (half-open)

rate_limit_redis_operation_seconds{operation}
  Type: Histogram | Operations: incr, get, setex
```

### **Business Metrics**

```
rate_limit_blocked_conversions_total{endpoint}
  Type: Counter | Tracks potential lost conversions

rate_limit_soft_throttle_ratio{scope}
  Type: Gauge | Percentage of requests experiencing soft throttle
```

---

## **9.2. Error Rate Monitoring**

### **429 Error Rate**

**Metric:**
```
http_requests_total{status="429"}
```
- Type: Counter
- Standard HTTP metrics with 429 status

**Alerting Threshold:**
- **Warning**: 429 error rate > configurable percentage (e.g., 5%) of total requests
- **Critical**: 429 error rate > configurable percentage (e.g., 20%) of total requests
- **Duration**: Sustained for configurable period (e.g., 5 minutes)

### **Per-Endpoint Error Rate**

**Metric:**
```
rate_limit_endpoint_error_rate{endpoint}
```
- Type: Gauge
- Calculation: `429_responses / total_responses` per endpoint
- Helps identify problematic endpoints

**Alert Example:**
```yaml
# EXAMPLE: Alerting rule (Prometheus format)
- alert: HighRateLimitErrorRate
  expr: rate_limit_endpoint_error_rate{endpoint="/api/v1/bookings"} > 0.15
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High rate limit error rate on {{ $labels.endpoint }}"
    description: "{{ $value | humanizePercentage }} of requests blocked"
```

---

## **9.3. Rate Limit Event Logging**

### **Log Entry Structure**

Every rate limit event MUST be logged with the following structure:

**Rate Limit Exceeded (WARN):**
```json
{
  "timestamp": "2025-12-15T10:00:00.000Z",
  "level": "warn",
  "event": "rate_limit_exceeded",
  "trace_id": "<correlation_id>",
  "service": "rate-limiter",
  "identifier": {"type": "user|ip|operator", "value": "<identifier>"},
  "request": {
    "method": "POST",
    "endpoint": "/api/v1/warehouses/search",
    "ip_address": "203.0.113.42"
  },
  "rate_limit": {
    "scope": "user",
    "limit": 100,
    "window_seconds": 60,
    "current_usage": 101,
    "retry_after_seconds": 45
  },
  "response": {"http_status": 429, "retry_after": 45}
}
```

**Circuit Breaker State Change (ERROR):**
```json
{
  "timestamp": "2025-12-15T10:00:00.000Z",
  "level": "error",
  "event": "rate_limit_circuit_breaker_opened",
  "trace_id": "<correlation_id>",
  "service": "rate-limiter",
  "circuit_breaker": {
    "component": "redis",
    "previous_state": "closed",
    "new_state": "open",
    "error_count": 5,
    "threshold": 5
  },
  "impact": "Rate limiting temporarily disabled (fail-safe mode)"
}
```

### **Log Levels**

- **INFO**: Soft throttle applied, normal spike detected
- **WARN**: Rate limit exceeded (429), approaching limit
- **ERROR**: Circuit breaker opened, Redis failures

**See:** Logging Strategy §4.3 for complete rate limit logging taxonomy.

---

## **9.4. Trace Correlation**

### **Trace ID Propagation**

Every rate-limited request MUST have a `trace_id` that is:
- Generated if not present in request
- Propagated through all system components
- Included in logs, metrics, and error responses
- Returned to client in `X-Trace-ID` header

**Format:**
- UUID v4 (recommended)
- Consistent across all services
- Immutable per request

### **Correlation Pattern**

```
Client Request
  └─ trace_id: 550e8400-e29b-41d4-a716-446655440000
      │
      ├─ Nginx: Rate limit check [logged with trace_id]
      │
      ├─ NestJS: Rate limit check [logged with trace_id]
      │
      ├─ Redis: Counter increment [tagged with trace_id]
      │
      └─ Response: 429 [includes trace_id in header and body]
```

### **Usage**

**For Debugging:**
```bash
# Find all logs for a specific request
grep "550e8400-e29b-41d4-a716-446655440000" /var/log/app/*.log

# Query logs by trace_id (JSON logs)
jq 'select(.trace_id == "550e8400-e29b-41d4-a716-446655440000")' logs.json
```

**For Support:**
- Users can provide trace_id from error response
- Support team can trace entire request flow
- Helps identify rate limit false positives

---

## **9.5. Alerting Thresholds**

### **Critical Alerts**

**Circuit Breaker Opened:**
```yaml
# EXAMPLE: Alert configuration (reference)
alert: RateLimitCircuitBreakerOpened
condition: rate_limit_circuit_breaker_state{component="redis"} == 1
severity: critical
notification: immediate
action_required: "Investigate Redis connectivity and restore rate limiting"
```

**Mass 429 Responses:**
```yaml
alert: MassRateLimitExceeded
condition: |
  (
    sum(rate(rate_limit_exceeded_total[5m]))
    /
    sum(rate(http_requests_total[5m]))
  ) > 0.20
for: 5m
severity: critical
notification: immediate
action_required: "Potential attack or misconfigured limits"
```

### **Warning Alerts**

**High Rate Limit Utilization:**
```yaml
alert: HighRateLimitUtilization
condition: rate_limit_usage_ratio > 0.85
for: 10m
severity: warning
notification: delayed (15 min)
action_required: "Monitor for potential limit increase need"
```

**Increasing 429 Rate:**
```yaml
alert: IncreasingRateLimitErrors
condition: |
  (
    rate(rate_limit_exceeded_total[5m]) 
    > 
    rate(rate_limit_exceeded_total[5m] offset 1h) * 2
  )
for: 10m
severity: warning
notification: delayed (15 min)
action_required: "Investigate traffic pattern change"
```

### **Informational Alerts**

**Spike Detected:**
```yaml
alert: TrafficSpikeDetected
condition: spike_detected == 1
severity: info
notification: delayed (30 min)
action_required: "Monitor classification and system health"
```

**Configuration Change:**
```yaml
alert: RateLimitConfigChanged
condition: rate_limit_config_version != rate_limit_config_version offset 5m
severity: info
notification: delayed (immediate if prod)
action_required: "Verify change was intentional and monitor impact"
```

### **Alert Routing**

- **Critical**: Immediate page (PagerDuty, Opsgenie, etc.)
- **Warning**: Slack channel, email (within 15 min)
- **Info**: Daily digest, logging only

All thresholds are **environment-defined** and **configurable**.

---

# **10. Security Considerations**

## **10.1. Rate Limiting as Defense Mechanism**

### **Defense Layer Integration**

Rate limiting is **one component** of a comprehensive security strategy. It provides:

**Layer 4-7 DDoS Protection:**
- Complementary to network-layer DDoS mitigation (Cloudflare)
- Application-layer request throttling
- Resource exhaustion prevention

**Automated Attack Mitigation:**
- Slows down brute-force attempts
- Prevents rapid credential enumeration
- Limits scraping bot effectiveness

**Cost Control:**
- Prevents abuse-driven cost spikes (external APIs)
- Protects against malicious resource consumption

### **Integration with Security Plan**

Rate limiting **works in conjunction with**:
- **Security & Compliance Plan §4.2**: Network-layer DDoS protection
- **Security & Compliance Plan §4.3**: Brute-force mitigation strategies
- **Security & Compliance Plan §4.4**: Bot detection and challenge mechanisms
- **Security & Compliance Plan §5**: Data protection and encryption
- **Security & Compliance Plan §6**: Audit logging requirements

**This specification focuses on rate limiting mechanics.**  
**For comprehensive security strategy, see Security & Compliance Plan.**

---

## **10.2. Integration with Security & Compliance Plan**

### **Cross-Reference Map**

| Rate Limiting Concern | Security Plan Section | Relationship |
|-----------------------|----------------------|-------------|
| **Brute-force attacks** | §4.3 Brute-Force Mitigation | Rate limiting provides technical enforcement for brute-force policies |
| **Bot detection** | §4.4 Bot Detection | Rate limiting uses bot scores; Security Plan defines detection |
| **DDoS protection** | §4.2 DDoS Protection | Rate limiting is application-layer component of multi-layer defense |
| **API abuse** | §4.5 API Security | Rate limiting enforces usage policies defined in Security Plan |
| **Audit logging** | §6.1 Audit Requirements | Rate limit events logged per Security Plan taxonomy |
| **Data scraping** | §4.6 Data Protection | Rate limiting slows scraping; Security Plan defines detection |

### **Shared Responsibilities**

**Rate Limiting Specification (this document):**
- ✅ Defines technical throttling and limit mechanisms
- ✅ Specifies algorithms and enforcement points
- ✅ Provides operational procedures
- ✅ Defines error responses and client guidance

**Security & Compliance Plan:**
- ✅ Defines security policies and threat model
- ✅ Specifies detection algorithms (bot, brute-force)
- ✅ Provides compliance requirements (GDPR, PCI-DSS)
- ✅ Defines incident response procedures

### **De-Duplication Strategy**

To avoid duplication:
- **Rate limiting details**: This document
- **Security policies**: Security & Compliance Plan
- **Overlap (e.g., brute-force)**: This document references Security Plan
- **Integration points**: Both documents cross-reference each other

---

## **10.3. Protected Endpoint Categories**

### **Authentication Endpoints**

**Risk**: Brute-force password guessing, credential stuffing

**Rate Limiting Approach:**
- Very restrictive limits (configurable, typically lowest tier)
- IP-based tracking (before authentication)
- Exponential backoff on repeated failures
- May trigger CAPTCHA after threshold (see Security Plan §4.3)

**Example Endpoints:**
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

**See:** Security & Compliance Plan §4.3 for complete brute-force mitigation strategy.

---

### **Payment & Booking Endpoints**

**Risk**: Fraudulent bookings, payment card testing

**Rate Limiting Approach:**
- Moderate limits (configurable)
- User-based tracking (requires authentication)
- Additional security checks (see Security Plan §5.5 Payment Security)

**Example Endpoints:**
- `POST /bookings`
- `POST /payments`
- `PATCH /bookings/:id/payment`

**Integration:**
- Rate limiting prevents automated attempts
- Security Plan §5.5 defines payment validation rules
- Combined: comprehensive payment protection

---

### **Data Export & Reporting Endpoints**

**Risk**: Data exfiltration, competitive intelligence

**Rate Limiting Approach:**
- Restrictive limits (configurable)
- Operator/Admin only
- Full audit logging (see Security Plan §6.1)

**Example Endpoints:**
- `GET /operators/reports/revenue`
- `GET /admin/exports/users`
- `GET /admin/audit-logs`

**Additional Protection:**
- Requires elevated authentication
- Multi-factor authentication for sensitive exports (policy-defined)
- IP whitelisting for admin endpoints (optional, environment-defined)

---

### **Search & Public Data Endpoints**

**Risk**: Scraping, competitive data harvesting

**Rate Limiting Approach:**
- Graduated limits (Guest < User < Operator)
- Encourages authentication for higher limits
- Pattern detection for systematic enumeration

**Example Endpoints:**
- `POST /warehouses/search`
- `GET /warehouses`
- `GET /boxes`

**See:** Security & Compliance Plan §4.6 for data protection and scraping prevention policies.

---

## **10.4. Token and Header Validation**

### **Authentication Token Extraction**

Rate limiting uses authenticated identity when available:

```typescript
// EXAMPLE: Reference implementation for user identification
function getUserIdentifier(request: Request): string | null {
  // Extract JWT from Authorization header
  const authHeader = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // Validate and decode JWT
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded.user_id; // or operator_id for operators
  } catch (error) {
    // Invalid token → treat as guest
    return null;
  }
}
```

### **Header Validation**

**Required Headers for Rate Limiting:**
- `X-Forwarded-For` (IP extraction, verified by gateway)
- `Authorization` (optional, for user/operator identification)
- `User-Agent` (optional, for bot detection heuristics)

**Security Considerations:**
- `X-Forwarded-For` MUST be sanitized by Nginx (prevent spoofing)
- JWT validation MUST occur before rate limit tier determination
- User-Agent used for pattern analysis, not as primary identifier

### **Role Determination**

```typescript
// EXAMPLE: Reference implementation for role-based limit selection
function getRoleFromToken(token: DecodedJWT): Role {
  // Role hierarchy
  if (token.role === 'admin') return Role.ADMIN;
  if (token.role === 'operator') return Role.OPERATOR;
  if (token.role === 'user') return Role.USER;
  
  // Fallback
  return Role.GUEST;
}

function selectRateLimit(role: Role, endpoint: string): RateLimitConfig {
  // Load configuration for role + endpoint combination
  return configService.getRateLimitConfig(role, endpoint);
}
```

**See:** Security & Compliance Plan §3.2 (Authentication & Authorization) for JWT validation requirements.

---

# **11. Operational Guidelines**

## **11.1. Configuration Management**

### **Configuration Storage**

Rate limit configurations MUST be:
- **Externalized**: Not hardcoded in application
- **Version-controlled**: All changes tracked
- **Environment-specific**: Dev, staging, prod have different values
- **Hot-reloadable**: Changes apply without redeployment (where possible)

### **Storage Options**

**Option 1: Database (PostgreSQL)**
```sql
-- EXAMPLE: Configuration table schema
CREATE TABLE rate_limit_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL,
  endpoint_pattern VARCHAR(255) NOT NULL,
  requests_per_window INTEGER NOT NULL,
  window_duration_seconds INTEGER NOT NULL,
  algorithm VARCHAR(50) DEFAULT 'sliding_window',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(role, endpoint_pattern)
);
```

**Option 2: Configuration File (YAML)**
```yaml
# EXAMPLE: rate-limits.yaml (reference configuration)
rate_limits:
  guest:
    general:
      requests_per_window: <CONFIGURABLE>
      window_duration: <CONFIGURABLE>
    search:
      requests_per_window: <CONFIGURABLE>
      window_duration: <CONFIGURABLE>
  
  user:
    general:
      requests_per_window: <CONFIGURABLE>
      window_duration: <CONFIGURABLE>
    search:
      requests_per_window: <CONFIGURABLE>
      window_duration: <CONFIGURABLE>
```

**Option 3: Environment Variables**
```bash
# EXAMPLE: Environment variables
RATE_LIMIT_GUEST_GENERAL=<CONFIGURABLE>
RATE_LIMIT_GUEST_SEARCH=<CONFIGURABLE>
RATE_LIMIT_USER_GENERAL=<CONFIGURABLE>
```

**MVP Recommendation:**
- **Primary**: YAML file in version control
- **Override**: Environment variables for environment-specific tuning
- **Future**: Database for dynamic updates (post-MVP)

---

## **11.2. Zero-Downtime Updates**

### **Update Strategy**

**For YAML/File-Based Config:**

1. **Prepare new configuration file**
2. **Validate configuration** (see §11.4)
3. **Deploy to staging environment first**
4. **Monitor metrics for N minutes** (configurable)
5. **If stable, deploy to production with rolling update**
6. **Continue monitoring**

**For Database-Based Config:**

1. **Insert new config row** (with `is_active = false`)
2. **Validate in staging**
3. **Activate in production** (set `is_active = true`)
4. **Application picks up change on next config refresh**
5. **Monitor impact**
6. **Rollback if needed** (set `is_active = false` on new, `true` on old)

### **Hot Reload Implementation**

> **NOTE:** Example implementation for config reload

```typescript
// EXAMPLE: Configuration hot reload service
class RateLimitConfigService {
  private currentConfig: RateLimitConfig;
  private configRefreshInterval: number = 60000; // configurable
  
  async startConfigWatcher(): Promise<void> {
    setInterval(async () => {
      try {
        const newConfig = await this.loadConfig();
        
        if (this.configHasChanged(newConfig)) {
          this.logger.info('Rate limit config changed, applying update', {
            previous_version: this.currentConfig.version,
            new_version: newConfig.version,
          });
          
          this.currentConfig = newConfig;
          await this.emitConfigChangeEvent(newConfig);
        }
      } catch (error) {
        this.logger.error('Failed to reload rate limit config', { error });
        // Keep using current config
      }
    }, this.configRefreshInterval);
  }
  
  private configHasChanged(newConfig: RateLimitConfig): boolean {
    return newConfig.version !== this.currentConfig.version;
  }
}
```

### **Rollback Procedure**

**If update causes issues:**

1. **Immediate**: Revert to previous config version
2. **For file-based**: Git revert + redeploy
3. **For database**: Toggle `is_active` flags
4. **For environment vars**: Update and restart (requires brief downtime)

**Best Practice:**
- Always keep previous working config readily available
- Tag config versions in version control
- Document reason for each change

---

## **11.3. Release Procedures**

### **Pre-Release Checklist**

Before deploying rate limit changes:

- [ ] **Validate configuration** (see §11.4)
- [ ] **Review impact analysis**
  - How many users affected?
  - Which endpoints impacted?
  - Expected reduction/increase in request volume?
- [ ] **Test in staging**
  - Load test with new limits
  - Verify 429 responses correct
  - Check metrics and logs
- [ ] **Prepare rollback plan**
  - Document previous config
  - Ensure rollback tested
  - Define rollback trigger criteria
- [ ] **Schedule during low-traffic period** (if significant change)
- [ ] **Alert operations team**
- [ ] **Prepare communication** (if user-facing impact expected)

### **Deployment Process**

**Phase 1: Staging Validation (Day 1)**
- Deploy to staging environment
- Run load tests
- Verify behavior matches expectation
- Check error rates and metrics

**Phase 2: Canary Release (Day 2)**
- Deploy to 10% of production (if possible)
- Monitor for configurable period (e.g., 2 hours)
- Check for anomalies
- Proceed or rollback

**Phase 3: Full Rollout (Day 2-3)**
- Deploy to remaining 90% of production
- Monitor for 24-48 hours
- Check business metrics (conversions, signups)
- Gather feedback

**Phase 4: Post-Deployment Review (Day 3-7)**
- Analyze impact
- Document learnings
- Adjust if needed

### **Graduated Rollout Example**

```yaml
# EXAMPLE: Graduated limit increase
Day 0: Current limit = 100 req/min
Day 1: Staging test with 200 req/min
Day 2: Canary (10% traffic) → 150 req/min
Day 3: Full rollout → 150 req/min, monitor
Day 7: If stable, increase to 200 req/min
```

---

## **11.4. Configuration Validation**

### **Validation Rules**

All rate limit configurations MUST pass validation before deployment:

**Schema Validation:**
- All required fields present
- Numeric values in valid ranges (positive, non-zero)
- Enum values valid (algorithm names, roles)
- No conflicting configurations

**Business Logic Validation:**
- Role hierarchy maintained (Guest < User < Operator < Admin)
- Limits reasonable relative to system capacity
- No accidentally permissive configurations
- External API limits respected (Google Maps, Claude quotas)

**Safety Validation:**
- No limits that would impact >X% of users (configurable threshold)
- No reduction >Y% from current value (configurable threshold)
- Dangerous changes require explicit approval flag

### **Validation Implementation**

> **NOTE:** Reference validation implementation

```typescript
// EXAMPLE: Configuration validation service
class RateLimitConfigValidator {
  validate(config: RateLimitConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Schema validation
    if (!this.validateSchema(config)) {
      errors.push('Schema validation failed');
    }
    
    // Role hierarchy validation
    if (!this.validateRoleHierarchy(config)) {
      errors.push('Role hierarchy violated');
    }
    
    // Capacity validation
    const capacityCheck = this.validateCapacity(config);
    if (!capacityCheck.valid) {
      errors.push(`Capacity exceeded: ${capacityCheck.reason}`);
    }
    
    // External API limits
    if (!this.validateExternalLimits(config)) {
      errors.push('External API quotas exceeded');
    }
    
    // Danger checks
    const dangerCheck = this.checkDangerousChanges(config);
    if (dangerCheck.dangerous && !config.force_approve) {
      warnings.push('Dangerous changes detected - manual approval required');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  private validateRoleHierarchy(config: RateLimitConfig): boolean {
    // Ensure: Guest < User < Operator < Admin for all endpoints
    return (
      config.guest.general.requests_per_window <
      config.user.general.requests_per_window &&
      config.user.general.requests_per_window <
      config.operator.general.requests_per_window &&
      config.operator.general.requests_per_window <
      config.admin.general.requests_per_window
    );
  }
  
  private validateCapacity(config: RateLimitConfig): CapacityValidation {
    // Calculate total expected load from all roles
    const expectedLoad = this.calculateExpectedLoad(config);
    const systemCapacity = this.getSystemCapacity();
    
    if (expectedLoad > systemCapacity * 0.8) {
      return {
        valid: false,
        reason: `Expected load (${expectedLoad} RPS) exceeds 80% of capacity (${systemCapacity} RPS)`,
      };
    }
    
    return { valid: true };
  }
}
```

### **Validation CLI Tool**

```bash
# EXAMPLE: CLI tool for config validation
$ npm run validate-rate-limits

Validating rate limit configuration: config/rate-limits.yaml

✓ Schema validation passed
✓ Role hierarchy valid
✓ Capacity check passed
⚠ Warning: Guest search limit decreased by 40% - high impact
✗ Error: Admin general limit (2000) exceeds system capacity (1500 RPS)

Validation failed: 1 error, 1 warning
```

---

## **11.5. Risk Mitigation**

### **Known Risks**

The following risks are inherent to rate limiting systems:

**Risk 1: Redis Failure → Rate Limiting Bypassed**
- **Probability**: Medium
- **Impact**: High
- **Mitigation**:
  - Circuit breaker with fail-safe (allow requests)
  - Redis health monitoring and alerting
  - Consider Redis Sentinel/HA (post-MVP)
  - Fallback to Nginx-only rate limiting

**Risk 2: Legitimate Traffic Spike Mistaken for Attack**
- **Probability**: Low
- **Impact**: Medium (lost conversions, user frustration)
- **Mitigation**:
  - Spike classification algorithm (see §7.3)
  - Gradual limit adjustment, not instant ban
  - Business metric monitoring (conversion rates)
  - Manual override capability for ops team

**Risk 3: Overly Strict Limits Hurt Conversions**
- **Probability**: Medium
- **Impact**: High (business revenue impact)
- **Mitigation**:
  - A/B testing for limit changes
  - Monitor conversion funnel metrics
  - Gradual rollout of changes
  - Easy rollback procedure

**Risk 4: Distributed Attack from Many IPs**
- **Probability**: Medium
- **Impact**: High
- **Mitigation**:
  - Cloudflare DDoS protection (see Security Plan §4.2)
  - Global rate limits (not just per-IP)
  - Bot detection integration (see Security Plan §4.4)
  - Ability to reduce limits globally during attack

**Risk 5: Config Error Breaks All Rate Limiting**
- **Probability**: Low
- **Impact**: Critical
- **Mitigation**:
  - Mandatory config validation before deployment
  - Staged rollout (staging → canary → full)
  - Automated rollback on error spike
  - Config version control and audit trail

**Risk 6: Rate Limit State Loss During Deployment**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**:
  - Redis persistence (AOF or RDB snapshots)
  - Graceful shutdown procedures
  - Accept temporary inaccuracy during deployment
  - Short rate limit windows reduce impact

### **Incident Response Framework**

**Scenario 1: Massive 429 Error Spike**

**Symptoms:** 429 error rate > configurable threshold, user complaints, high utilization across endpoints

**Response:**
1. Determine legitimate spike vs. attack (review dashboard, IP/User-Agent distribution)
2. **If legitimate**: Temporarily increase limits (policy-defined)
3. **If attack**: Verify limits working, engage Security Plan
4. Communicate via status page, monitor health
5. Post-mortem within 24 hours

**Rollback:** Revert limit changes if issue persists

---

**Scenario 2: Redis Outage**

**Symptoms:** Rate limit checks failing, circuit breaker open, requests allowed despite limits

**Response:**
1. Verify fail-safe allowing requests
2. Check Redis logs, attempt restart/failover
3. If unrecoverable: Activate Nginx-only + Cloudflare aggressive mode
4. Monitor for abuse, review logs post-recovery
5. Plan Redis HA implementation

**Recovery:** Restore Redis, gradually transition to normal limits, validate state, post-mortem

---

**Scenario 3: Overly Strict Limits**

**Symptoms:** Conversion rate drop > threshold, legitimate user complaints, declining business metrics

**Response:**
1. **Immediate rollback** to previous config
2. Analyze impact (affected segments, endpoints, user journeys)
3. Adjust limits based on data
4. Staged rollout: 10% → 50% → 100%
5. Monitor for 48 hours, A/B test if possible

**Prevention:** Always A/B test major changes, monitor business metrics real-time

---

**Scenario 4: Distributed Attack**

**Symptoms:** Traffic spike from diverse IPs, high global rate, unusual geo distribution, low conversion

**Response:**
1. Activate Cloudflare advanced DDoS (Security Plan §4.2)
2. Reduce limits globally (policy-defined %)
3. Enable CAPTCHA on critical endpoints (Security Plan §4.4)
4. Block top attacking IPs/countries if identified
5. Increase bot detection sensitivity
6. Gradually restore after attack subsides

**Recovery:** Log review, update bot rules, consider permanent blocks, post-mortem

---

### **Escalation Path**

```
Level 1: Automated → Circuit breakers, alerts, fail-safe (immediate)
Level 2: On-Call Engineer → Assess, fix, escalate (SLA: <CONFIGURABLE> min)
Level 3: Engineering Lead → Major incidents, config changes (<CONFIGURABLE> min)
Level 4: CTO/Management → Critical business impact, legal issues (immediate)
```

All SLA times are **policy-defined** and **configurable**.

---

## **Appendix: Example Implementation Snippets**

> **IMPORTANT:** All code examples in this document are **reference implementations only**. Production implementations should be adapted to specific requirements, frameworks, and infrastructure.

### **Nginx Rate Limiting (Example)**

```nginx
# EXAMPLE ONLY - Reference Nginx configuration
http {
    # Define rate limit zone
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=<CONFIGURABLE>r/s;
    
    # Logging for rate limit events
    limit_req_log_level warn;
    limit_req_status 429;
    
    server {
        listen 80;
        server_name api.example.com;
        
        location /api/ {
            # Apply rate limit with burst
            limit_req zone=api_limit burst=<CONFIGURABLE> nodelay;
            
            # Add rate limit headers to response
            add_header X-RateLimit-Limit <CONFIGURABLE> always;
            add_header X-RateLimit-Remaining $limit_req_remaining always;
            
            proxy_pass http://nestjs_backend;
        }
    }
}
```

### **Redis Sliding Window (Example)**

```lua
-- EXAMPLE ONLY - Reference Lua script for Redis sliding window
local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local current_time = tonumber(ARGV[3])

-- Remove old entries outside window
redis.call('ZREMRANGEBYSCORE', key, 0, current_time - window)

-- Count current requests in window
local current_count = redis.call('ZCARD', key)

if current_count < limit then
    -- Add new request timestamp
    redis.call('ZADD', key, current_time, current_time)
    redis.call('EXPIRE', key, window)
    return {1, limit - current_count - 1}
else
    -- Limit exceeded
    return {0, 0}
end
```

### **NestJS Guard (Example)**

```typescript
// EXAMPLE ONLY - Reference NestJS implementation
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimiter: RateLimiterService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Determine identifier and role
    const identifier = this.getIdentifier(request);
    const role = this.getRole(request);
    const endpoint = this.getEndpoint(request);
    
    // Get configuration for this role + endpoint
    const config = await this.configService.getRateLimitConfig(role, endpoint);
    
    // Check against Redis
    const result = await this.rateLimiter.checkLimit(identifier, config);
    
    // Set response headers
    response.setHeader('RateLimit-Limit', config.limit);
    response.setHeader('RateLimit-Remaining', result.remaining);
    response.setHeader('RateLimit-Reset', result.reset);
    
    if (!result.allowed) {
      throw new RateLimitExceededException({
        limit: config.limit,
        window: config.window,
        retryAfter: result.retryAfter,
      });
    }
    
    return true;
  }
}
```

---

# **12. MVP Implementation Contract**

## **12.1. Required Components (MUST)**

The following components are **mandatory** for MVP v1 and must be implemented:

### **Core Infrastructure**
- ✅ **Nginx global rate limit**: Leaky bucket algorithm at gateway layer
- ✅ **NestJS RateLimitGuard**: Application-layer role-based enforcement
- ✅ **Redis sliding window**: Distributed rate limit state storage
- ✅ **Fail-safe behavior**: System remains available if Redis fails (allow requests + alert)

### **Rate Limit Tiers**
- ✅ **Role-based limits**: Guest, User, Operator, Admin (4 distinct tiers)
- ✅ **IP-based limiting**: For unauthenticated requests (Guest tier)
- ✅ **User-based limiting**: For authenticated requests (User/Operator tiers)

### **Error Handling**
- ✅ **HTTP 429 response**: Canonical error envelope format (aligned with Error Handling Spec)
- ✅ **Required headers**: `Retry-After`, `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
- ✅ **Retry-After calculation**: Time until window reset + minimum backoff

### **Monitoring**
- ✅ **429 counter metric**: Track rate limit rejections
- ✅ **Usage ratio metric**: Current usage / limit per identifier
- ✅ **Basic logging**: Rate limit exceeded events (WARN level, with trace_id)

### **Configuration**
- ✅ **Externalized config**: YAML or environment variables (not hardcoded)
- ✅ **Hot reload capability**: Config changes without full restart
- ✅ **Validation**: Config validator prevents invalid deployments

---

## **12.2. Recommended Features (SHOULD)**

The following features are **strongly recommended** but may be simplified or deferred if resource-constrained:

### **Enhanced Throttling**
- ⚠️ **Soft throttling**: Gradual delays before hard limit (improves UX)
- ⚠️ **Graduated response**: Warning headers at 70-85% utilization

### **Endpoint Specificity**
- ⚠️ **Endpoint-specific overrides**: Custom limits for `/auth/*`, `/bookings`, `/search`
- ⚠️ **Critical endpoint protection**: Extra-restrictive limits on auth endpoints

### **Advanced Monitoring**
- ⚠️ **Throttle delay histogram**: Measure soft throttle impact
- ⚠️ **Circuit breaker state**: Track Redis health
- ⚠️ **Conversion impact tracking**: Monitor business metrics

### **Operations**
- ⚠️ **Canary rollout**: Staged deployment of limit changes (10% → 100%)
- ⚠️ **Rollback procedure**: Documented and tested config revert process

**Decision Point:** Team should evaluate resource availability vs. UX benefit for these features.

---

## **12.3. Optional Enhancements (MAY)**

The following features are **optional** and can be added based on observed needs:

### **Adaptive Behavior**
- 🔵 **Adaptive throttling**: Dynamic limit adjustment based on system load
- 🔵 **Spike detection**: Automatic classification of traffic patterns
- 🔵 **Intelligent response**: Different handling for legitimate vs. attack spikes

### **Advanced Algorithms**
- 🔵 **Token bucket with queues**: Queue overflow requests instead of rejecting
- 🔵 **Dynamic limit increases**: Temporary limit elevation for trusted users

### **Enhanced Observability**
- 🔵 **Per-endpoint dashboards**: Detailed metrics per API route
- 🔵 **User impact analysis**: Track which users hit limits most frequently
- 🔵 **Predictive alerting**: Warn before limits are exceeded

**Decision Point:** Only implement if data shows clear need (e.g., frequent legitimate traffic spikes).

---

## **12.4. Post-MVP Features (OUT OF SCOPE)**

The following features are **explicitly deferred** to post-MVP:

### **Not in MVP v1**
- ❌ **Machine learning spike prediction**: Complex, uncertain ROI for MVP
- ❌ **Per-API-key quotas**: No API key system in MVP
- ❌ **External API gateway** (Kong, AWS API Gateway): MVP uses Nginx
- ❌ **Multi-region synchronized counters**: Single-region deployment only
- ❌ **User-facing rate limit UI**: No self-service quota management
- ❌ **Redis Cluster**: Single Redis instance sufficient for MVP
- ❌ **Distributed tracing integration** (Jaeger, Zipkin): Basic trace_id only
- ❌ **Geographic rate limiting**: No per-country limits
- ❌ **Time-of-day dynamic limits**: Static configuration only
- ❌ **Client SDK with built-in rate limiting**: Clients implement own retry logic

**Rationale:** These features add complexity without proportional value for MVP scale. Defer until proven need.

---

## **12.5. Implementation Priorities**

### **Week 1-2: Foundation**
```
Priority: CRITICAL
- Nginx global limits (baseline protection)
- Redis connection + sliding window algorithm
- NestJS RateLimitGuard skeleton
- HTTP 429 error envelope
```

### **Week 3: Role-Based Enforcement**
```
Priority: HIGH
- Guest/User/Operator/Admin tier logic
- IP vs. user_id identification
- Endpoint-specific overrides (auth, bookings)
- Basic 429 metrics
```

### **Week 4: Operational Readiness**
```
Priority: MEDIUM
- Fail-safe Redis circuit breaker
- Config validation + hot reload
- Logging integration
- Monitoring dashboard
```

### **Post-Launch: Enhancements**
```
Priority: LOW
- Soft throttling (if UX data supports)
- Spike detection (if attack patterns observed)
- Advanced metrics (if ops team requests)
```

---

# **13. Explicit Non-Goals (MVP v1)**

## **13.1. Explicitly Excluded Features**

The following are **not goals** for MVP v1 and should not be implemented:

### **Advanced Machine Learning**
- ❌ **ML-based rate prediction**: No training data, uncertain accuracy
- ❌ **Anomaly detection models**: Simple heuristics sufficient for MVP
- ❌ **Behavioral fingerprinting**: Privacy concerns, complex implementation

**Reason:** Over-engineering for MVP scale. Rule-based approach adequate.

---

### **Distributed Systems Features**
- ❌ **Multi-region rate limit synchronization**: MVP is single-region
- ❌ **Eventually consistent counters**: Strong consistency via Redis
- ❌ **Distributed consensus** (Raft, Paxos): Unnecessary complexity

**Reason:** MVP architecture is single-region. Multi-region is post-MVP.

---

### **External Service Dependencies**
- ❌ **Dedicated API gateway service** (Kong, Tyk, AWS API Gateway)
- ❌ **Commercial rate limiting SaaS** (Cloudflare Rate Limiting Pro)
- ❌ **Message queue for rate limit events** (Kafka, RabbitMQ)

**Reason:** MVP uses existing stack (Nginx, NestJS, Redis). Minimize external dependencies.

---

### **User-Facing Features**
- ❌ **Rate limit dashboard for end users**: No self-service quota UI
- ❌ **Limit increase request workflow**: Manual process via support
- ❌ **Real-time usage notifications**: Rely on HTTP headers only
- ❌ **Historical usage reports**: Not required for MVP

**Reason:** Focus on backend protection. User-facing features are post-MVP.

---

### **Advanced API Features**
- ❌ **Per-API-key quotas**: MVP doesn't have API key system
- ❌ **OAuth scopes-based limiting**: Rely on role-based limits
- ❌ **Custom quota plans**: Single set of limits per role
- ❌ **Burst credits system**: Simple burst allowance sufficient

**Reason:** MVP has basic auth (JWT). API keys and quotas are future enhancements.

---

### **Performance Optimizations**
- ❌ **In-memory rate limiting** (without Redis): Redis is required
- ❌ **Kernel-level rate limiting** (eBPF, XDP): Unnecessary for MVP scale
- ❌ **Hardware acceleration**: Software solution adequate

**Reason:** Redis performance sufficient for expected MVP traffic.

---

### **Sophisticated Bot Detection**
- ❌ **CAPTCHA integration in rate limiter**: Handled by Security Plan
- ❌ **JavaScript challenge**: Cloudflare provides this
- ❌ **Device fingerprinting**: Privacy concerns, complex

**Reason:** Bot detection is Security Plan responsibility. Rate limiter provides complementary throttling only.

---

## **13.2. Future Considerations**

Features that **might** be considered post-MVP based on evidence:

### **If Data Shows Need:**
- 🔮 **Adaptive limits per user segment**: If legitimate users consistently hit limits
- 🔮 **Geographic differentiation**: If attack patterns show regional clustering
- 🔮 **Time-of-day adjustment**: If traffic patterns vary dramatically
- 🔮 **ML-based spike classification**: If manual classification proves inadequate

### **If Scale Demands:**
- 🔮 **Redis Cluster**: If single Redis instance becomes bottleneck
- 🔮 **Multi-region synchronization**: If platform expands beyond single region
- 🔮 **Dedicated gateway service**: If Nginx limits are reached

### **If Business Model Evolves:**
- 🔮 **API key system**: If external integrations become revenue stream
- 🔮 **Custom quota plans**: If B2B customers need different limits
- 🔮 **User-facing quota UI**: If users request visibility

**Principle:** Evidence-based enhancement. Don't build until proven necessary.

---

# **TL;DR for Backend & DevOps**

## **Quick Implementation Checklist**

### **1. Where We Rate Limit**
```
Layer 1: Cloudflare   → DDoS, bot detection (external config)
Layer 2: Nginx        → Global IP-based limits (leaky bucket)
Layer 3: NestJS       → Role-based + endpoint-specific (sliding window)
Layer 4: Redis        → Shared state for distributed enforcement
```

**Key Point:** Three independent layers. Each can operate if others fail.

---

### **2. What We Rate Limit**
```
Guest:    IP-based, most restrictive
User:     user_id, moderate limits
Operator: operator_id, elevated limits  
Admin:    user_id (role=admin), highest limits + bypass option
```

**Key Point:** Progressive limits encourage authentication. `Guest < User < Operator < Admin`.

---

### **3. How We Enforce**
```typescript
// Simplified flow
1. Extract identifier (IP or user_id)
2. Load config for role + endpoint
3. Check Redis: INCR counter, compare to limit
4. If exceeded: HTTP 429 + Retry-After
5. If allowed: Continue + set RateLimit-* headers
```

**Key Point:** Redis sliding window is the source of truth. Nginx provides fast path rejection.

---

### **4. What We Return on Limit**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1702656000

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 45s.",
    "details": { "limit": 100, "window": 60 },
    "trace_id": "uuid"
  }
}
```

**Key Point:** Canonical error envelope. Always include `Retry-After` and trace_id.

---

### **5. What We Do on Failure**
```
Redis fails → Circuit breaker opens
           → Allow requests (fail-safe)
           → Log + alert CRITICAL
           → Monitor for abuse
           → Rely on Nginx layer only
```

**Key Point:** **Availability > perfect limiting**. Never reject traffic due to rate limiter bugs.

---

### **6. What We Log**
```json
{
  "level": "warn",
  "event": "rate_limit_exceeded",
  "trace_id": "uuid",
  "identifier": {"type": "user", "value": "usr_123"},
  "endpoint": "/api/v1/bookings",
  "rate_limit": {"limit": 100, "usage": 101, "retry_after": 45},
  "http_status": 429
}
```

**Key Point:** Every 429 is logged with trace_id. Logs correlate with Error Handling Spec.

---

### **7. What We Monitor**
```
Critical Alerts:
- Circuit breaker OPEN → Redis down, rate limiting disabled
- 429 rate > 20% → Possible attack or misconfigured limits

Warning Alerts:
- 429 rate > 5% → Elevated rejections, investigate patterns
- Usage ratio > 85% → Users approaching limits

Metrics:
- rate_limit_exceeded_total (counter)
- rate_limit_usage_ratio (gauge, per identifier)
- rate_limit_circuit_breaker_state (gauge)
```

**Key Point:** Monitor 429 error rate as % of total requests. Spike = attack or config problem.

---

## **Emergency Procedures**

### **Scenario: Mass 429 Errors**
```bash
1. Check dashboard: Attack or legitimate spike?
2. If legitimate: Increase limits by 50% (config hot reload)
3. If attack: Verify limits working, engage Security Plan
4. Monitor conversion metrics
5. Post-mortem within 24h
```

### **Scenario: Redis Outage**
```bash
1. Verify fail-safe active (requests allowed)
2. Alert: "Rate limiting degraded - Nginx only"
3. Restart Redis or failover
4. Monitor logs for abuse patterns
5. Restore full rate limiting gradually
```

### **Scenario: Config Error**
```bash
1. Immediate rollback to previous config
2. Investigate: Did limits hurt conversions?
3. Fix config, validate with CLI tool
4. Staged rollout: 10% → 50% → 100%
5. Document issue in changelog
```

---

## **Configuration Quick Reference**

```yaml
# Example: rate-limits.yaml
rate_limits:
  guest:
    general: {requests: CONFIGURABLE, window: CONFIGURABLE}
    auth: {requests: VERY_LOW, window: CONFIGURABLE}
  
  user:
    general: {requests: HIGHER_THAN_GUEST, window: CONFIGURABLE}
    bookings: {requests: MODERATE, window: CONFIGURABLE}
  
  operator:
    general: {requests: HIGHER_THAN_USER, window: CONFIGURABLE}
    bulk_ops: {requests: ELEVATED, window: CONFIGURABLE}
  
  admin:
    general: {requests: HIGHEST, window: CONFIGURABLE}
    bypass_enabled: true  # with full audit logging
```

**Key Point:** All numbers are environment-defined. No hardcoded limits in code.

---

## **Integration Points**

| Component | Integration | Responsibility |
|-----------|-------------|----------------|
| **Cloudflare** | Network DDoS, bot challenge | See Security Plan §4.2 |
| **Nginx** | Global IP limits, fast rejection | See Tech Architecture §3.2 |
| **NestJS** | Role-based, endpoint-specific | Backend Implementation Plan §4.3 |
| **Redis** | Sliding window state | Database Spec §7.5 (connection pool) |
| **Error Handling** | 429 canonical envelope | Error Handling Spec §3.2 |
| **Logging** | Rate limit events | Logging Strategy §4.3 |
| **Security** | Bot detection, brute-force | Security Plan §4.3, §4.4 |

---

## **Final Implementation Checklist**

**Before Production:**
- [ ] Nginx global limits configured and tested
- [ ] NestJS RateLimitGuard deployed with all 4 role tiers
- [ ] Redis sliding window script deployed and validated
- [ ] HTTP 429 error format matches canonical envelope
- [ ] Fail-safe tested (Redis shutdown → requests allowed)
- [ ] Metrics dashboard showing 429 rate, usage ratio
- [ ] Logging integrated (rate_limit_exceeded events)
- [ ] Config validation CLI tool working
- [ ] Hot reload tested (config change → no restart)
- [ ] Incident response runbook documented

**Post-Launch Monitoring:**
- [ ] 429 error rate < 5% in first week
- [ ] No legitimate users reporting false positives
- [ ] Redis memory usage stable
- [ ] Circuit breaker never opens (Redis healthy)
- [ ] Conversion funnel metrics unchanged

---

**END OF TL;DR**

---

## **Document Changelog**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.1.0-CANONICAL-HARDENED | 2025-12-15 | MVP Contract hardening: Added §12 (Implementation Contract), §13 (Non-Goals), TL;DR for engineers, condensed operational sections | Technical Architecture Team |
| 1.0.0-CANONICAL | 2025-12-15 | Canonical alignment: Configurable thresholds, policy-driven behavior, security de-duplication, example marking, error handling alignment | Technical Architecture Team |
| 1.0.0 | 2025-12-09 | Initial complete specification | Technical Architecture Team |

---

**END OF SPECIFICATION**

This document defines the complete rate limiting and throttling framework for the Self-Storage Aggregator MVP v1. All limits, thresholds, and behaviors are **configurable** and **environment-defined** to support flexible deployment and ongoing optimization.

For security-related details, see **Security & Compliance Plan**.  
For error handling integration, see **Error Handling & Fault Tolerance Specification**.  
For logging requirements, see **Logging Strategy**.  
For API endpoint definitions, see **API Design Blueprint**.  
For database schema, see **Database Specification**.
