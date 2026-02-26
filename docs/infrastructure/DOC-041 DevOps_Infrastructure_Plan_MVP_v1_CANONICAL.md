# DevOps Infrastructure Plan (MVP v1) — CANONICAL

**Document ID:** DOC-041  
**Self-Storage Aggregator**  
**Version:** 2.0 (Canonical)  
**Date:** December 17, 2024  
**Status:** 🟢 GREEN — Canonical

---

## Document Role & Scope

### Purpose

This document defines the **target state** of the DevOps infrastructure architecture for the Self-Storage Aggregator MVP v1. It describes:

- Environment strategy and configuration requirements
- CI/CD pipeline architecture and stage definitions
- Infrastructure components and their relationships
- Monitoring, logging, and security architecture
- Backup and disaster recovery strategy

### What This Document IS

✅ **Architectural DevOps Plan** — Describes the target infrastructure state  
✅ **Infrastructure Requirements** — Defines what components are needed  
✅ **Integration Blueprint** — Shows how components interact  
✅ **Configuration Strategy** — Specifies configuration patterns and principles

### What This Document IS NOT

❌ **NOT an Operational Runbook** — Does not provide deployment procedures  
❌ **NOT a Deployment Guide** — Does not contain step-by-step instructions  
❌ **NOT an Incident Response Manual** — Does not define operational procedures  
❌ **NOT a Scaling Implementation** — Does not describe post-MVP execution details

### Scope: MVP v1 ONLY

This document is strictly scoped to **MVP v1 requirements**:

- Single-region deployment
- Docker Compose based orchestration
- Vertical scaling within single-server architecture
- Core monitoring and logging capabilities
- Basic high availability patterns

**Out of Scope (Post-MVP):**
- Kubernetes orchestration
- Multi-region deployment
- Horizontal auto-scaling implementation
- Database sharding
- Active-active configurations
- Advanced cost optimization

### Canonical Boundaries

| Responsibility | Owner Document |
|---|---|
| **Deployment procedures** | DOC-039: Deployment Runbook |
| **Backup/Restore execution** | DOC-042/DOC-043: Backup & DR Playbooks |
| **Incident response procedures** | DOC-051: Incident Response Plan |
| **Scaling implementation (post-MVP)** | DOC-058/DOC-059: Scaling & Multi-Region Specs |
| **Security playbooks** | DOC-006: Security Architecture |
| **API design** | DOC-003: API Design Blueprint |
| **Database schema** | DOC-004: Database Specification |

This document **references** but does **not replace** these documents.

---

## Table of Contents

1. Environment Strategy
2. CI/CD Pipeline Architecture
3. Infrastructure Architecture
4. Monitoring & Observability
5. Secrets & Security
6. Storage & Backup Strategy
7. MVP Deployment Architecture
8. Post-MVP Considerations
9. Integration Points
10. Document Maintenance

---

## 1. Environment Strategy

### 1.1. Environment Taxonomy

The system MUST support four distinct environments:

| Environment | Purpose | Deployment Source | Characteristics |
|---|---|---|---|
| **Local** | Developer workstations | Local codebase | Full stack, hot-reload, debug mode |
| **Development** | Team integration | `develop` branch | Auto-deploy, debug logs, data resets allowed |
| **Staging** | Pre-production validation | `staging` branch | Production-like, no auto-deploy, persistent data |
| **Production** | Live customer service | `main` branch | Manual deploy, strict change control, full observability |

### 1.2. Environment Requirements

#### 1.2.1. Local Development Environment

**Purpose:** Enable developers to run full application stack on local machines.

**Required Components:**
- PostgreSQL 15+ with PostGIS 3.4+ extension
- Redis 7+
- NestJS Backend (Node.js 20+)
- Next.js Frontend (Node.js 20+)
- FastAPI AI Service (Python 3.11+)

**Configuration Strategy:**
- Container-based orchestration (Docker Compose)
- Hot-reload enabled for all services
- Local environment variables via `.env.local`
- Health checks on all dependencies
- Volume mounting for code changes
- Debug logging enabled

**Data Management:**
- Local PostgreSQL with seed data
- Isolated from shared environments
- Can be reset without impact

#### 1.2.2. Development Environment

**Purpose:** Shared environment for team collaboration and integration testing.

**Infrastructure Requirements:**
- Cloud-hosted compute (illustrative examples: Railway, Render, similar PaaS)
- Managed PostgreSQL with automatic backups
- Managed Redis instance
- Subdomain: `dev.{domain}`

**Configuration Strategy:**
- Automatic deployment from `develop` branch
- Debug logging enabled
- No high-availability requirements
- Data persistence not guaranteed
- Relaxed rate limiting for testing

**Access Control:**
- Team members only
- No public exposure
- Basic authentication or IP whitelist

#### 1.2.3. Staging Environment

**Purpose:** Production-equivalent environment for final validation before release.

**Infrastructure Requirements:**
- Production-equivalent compute resources
- Managed PostgreSQL (production-like configuration)
- Managed Redis (production-like configuration)
- Subdomain: `staging.{domain}`

**Configuration Strategy:**
- Manual deployment from `staging` branch
- Production-equivalent logging (not debug)
- High-availability patterns tested
- Data persistence required
- Production-equivalent rate limiting

**Data Management:**
- Periodic refresh from production (sanitized)
- OR synthetic production-like dataset
- Persistent between deployments

#### 1.2.4. Production Environment

**Purpose:** Live customer-facing service.

**Infrastructure Requirements:**
- See Section 7 for detailed architecture
- SSL/TLS certificates (Let's Encrypt or commercial CA)
- DDoS protection (CDN layer)
- Managed or self-hosted PostgreSQL with automated backups
- Managed or self-hosted Redis

**Configuration Strategy:**
- Manual deployment with approval gates
- Production logging and audit trails
- Full observability stack
- Production rate limiting
- Zero-downtime deployment capability

**Security Requirements:**
- All secrets via secrets management system
- Principle of least privilege
- Network isolation
- Firewall rules per security specification

### 1.3. Database Migration Strategy

**Requirements:**

1. **Version Control:** All schema changes MUST be version-controlled migrations
2. **Idempotent:** Migrations MUST be safe to run multiple times
3. **Rollback:** Each migration MUST have a corresponding down migration
4. **Testing:** Migrations MUST be tested in staging before production
5. **Backup:** Database MUST be backed up before production migrations

**Migration Workflow:**
- Develop migration in local environment
- Test in development environment
- Validate in staging environment
- Apply to production with rollback plan ready

---

## 2. CI/CD Pipeline Architecture

### 2.1. Git Workflow & Branching Strategy

**Branch Structure:**

```
main (production)
├── staging (pre-production)
└── develop (integration)
    └── feature/* (feature branches)
```

**Branch Protection Rules:**

| Branch | Protection |
|---|---|
| `main` | Required PR reviews (2+), status checks, no direct commits |
| `staging` | Required PR reviews (1+), status checks, no direct commits |
| `develop` | Required status checks, no direct commits |
| `feature/*` | None (can be pushed directly) |

**Merge Strategy:**
- Feature → Develop: Squash merge
- Develop → Staging: Merge commit
- Staging → Main: Merge commit

### 2.2. Code Quality Gates

**Linting & Formatting:**

The CI pipeline MUST enforce:

| Language | Tools | Standards |
|---|---|---|
| TypeScript/JavaScript | ESLint + Prettier | Airbnb style guide |
| Python | Black + Flake8 + MyPy | PEP 8 |
| SQL | sqlfluff | PostgreSQL dialect |

**Static Analysis:**

Required checks:
- TypeScript type checking
- Python type hints validation
- SQL syntax validation
- Dependency vulnerability scanning (npm audit, pip-audit)

### 2.3. Automated Testing Strategy

**Test Pyramid Requirements:**

```
           E2E Tests (10%)
              ↑
       Integration Tests (30%)
              ↑
         Unit Tests (60%)
```

**Testing Requirements by Environment:**

| Test Type | Local | Dev | Staging | Production |
|---|---|---|---|---|
| Unit Tests | ✅ | ✅ | ✅ | ✅ |
| Integration Tests | ✅ | ✅ | ✅ | N/A |
| E2E Tests | Manual | ✅ | ✅ | N/A |
| Smoke Tests | N/A | ✅ | ✅ | ✅ |
| Performance Tests | N/A | N/A | ✅ | N/A |

**Minimum Coverage Requirements:**
- Backend: 70% line coverage
- Frontend: 60% line coverage
- AI Service: 60% line coverage

### 2.4. CI Pipeline (Continuous Integration)

**Trigger Events:**
- Push to any branch
- Pull request opened/updated

**Pipeline Stages:**

```
1. Code Checkout
   ↓
2. Dependency Installation & Caching
   ↓
3. Linting & Formatting Checks
   ↓
4. Static Analysis
   ↓
5. Unit Tests (Parallel)
   ↓
6. Integration Tests (Sequential)
   ↓
7. Build Artifacts
   ↓
8. Security Scanning
   ↓
9. Artifact Storage
```

**Failure Handling:**
- Pipeline MUST fail fast on first error
- Clear error messages MUST be provided
- Developers MUST be notified via configured channels

### 2.5. CD Pipeline (Continuous Deployment)

**Deployment Strategy by Environment:**

| Environment | Trigger | Approval | Rollback |
|---|---|---|---|
| Development | Auto on merge to `develop` | None | Automatic |
| Staging | Manual trigger | 1 approval | Manual |
| Production | Manual trigger | 2 approvals | Manual with runbook |

**Deployment Stages:**

```
1. Pre-deployment Checks
   ├─ Health check existing services
   ├─ Verify secrets availability
   └─ Check disk space & resources
   ↓
2. Backup Creation (See DOC-042)
   ↓
3. Database Migrations (if any)
   ├─ Backup before migration
   ├─ Run migrations
   └─ Verify schema
   ↓
4. Service Deployment
   ├─ Pull container images
   ├─ Deploy with rolling strategy
   └─ Health check new instances
   ↓
5. Post-deployment Validation
   ├─ Smoke tests
   ├─ Health endpoint checks
   └─ Log aggregation verification
   ↓
6. Notification & Documentation
```

**Zero-Downtime Deployment:**

For Production, the system MUST support:
- Rolling updates (deploy new version before stopping old)
- Health checks before traffic routing
- Automatic rollback on failed health checks
- Database migrations that don't break running code

### 2.6. Smoke Tests After Deployment

**Required Smoke Tests:**

1. **Health Endpoints:** Verify all services respond to `/health`
2. **Authentication:** Verify JWT token generation and validation
3. **Database Connectivity:** Verify read/write operations
4. **Redis Connectivity:** Verify cache operations
5. **External API Connectivity:** Verify third-party service availability
6. **Critical User Flows:** Verify key workflows (e.g., search, lead creation)

**Acceptance Criteria:**
- All smoke tests MUST pass before deployment is considered successful
- Failed smoke tests MUST trigger automatic rollback (production)
- Test results MUST be logged and reported

---

## 3. Infrastructure Architecture

### 3.1. Containerization Strategy

**Container Runtime:** Docker 24+

**Image Requirements:**
- Multi-stage builds for optimized image size
- Non-root user execution
- Minimal base images (Alpine Linux where possible)
- Security scanning before deployment
- Semantic versioning tags

**Image Registry:**
- GitHub Container Registry (ghcr.io) or similar
- Access control via service accounts
- Automated image cleanup policy

### 3.2. Orchestration Strategy (MVP v1)

**MVP v1 Approach: Docker Compose**

For MVP v1, the system uses **Docker Compose** for service orchestration:

**Rationale:**
- Sufficient for single-server deployment
- Simpler operational overhead
- Adequate for projected MVP scale (0-1,000 MAU)
- Lower infrastructure costs

**Compose Configuration Requirements:**

The system MUST define:
- Service definitions for all components
- Health checks for all services
- Resource limits (CPU, memory)
- Restart policies
- Network isolation
- Volume management
- Environment-specific overrides

**Service Dependencies:**
- Backend depends on: PostgreSQL, Redis
- Frontend depends on: Backend
- AI Service depends on: PostgreSQL, Redis, Backend

**Post-MVP Consideration:**

When scaling beyond MVP threshold:
- Consider Kubernetes for horizontal scaling
- Evaluate service mesh for observability
- Implement auto-scaling policies

**Note:** Kubernetes implementation details are **out of scope** for this document. See DOC-058 for post-MVP scaling strategy.

### 3.3. Reverse Proxy Architecture

**Required Component:** Nginx (or equivalent)

**Responsibilities:**
- SSL/TLS termination
- Request routing to backend services
- Static asset serving
- Request/response compression (gzip, brotli)
- Security headers injection
- Rate limiting enforcement (see DOC-007)

**Routing Rules:**

| Path | Target | Purpose |
|---|---|---|
| `/api/v1/*` | Backend service | API endpoints |
| `/ai/*` | AI service | AI-specific endpoints |
| `/*` | Frontend service | Next.js application |
| `/health` | All services | Health checks |

**Security Headers (MUST include):**
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`
- `Referrer-Policy`

### 3.4. Load Balancing Strategy

**MVP v1 Approach:**

Single reverse proxy with multiple backend instances:

```
Internet → Nginx → Backend Instance 1
                 → Backend Instance 2
```

**Load Balancing Algorithm:**
- Round-robin for stateless requests
- Session affinity (sticky sessions) where required
- Health check-based routing

**Health Check Requirements:**
- Active health checks every 10 seconds
- Passive health checks on request failures
- Automatic removal of unhealthy instances
- Automatic re-addition when health restored

**Post-MVP:**
- Dedicated load balancer service (hardware or cloud-managed)
- Multi-region load balancing

### 3.5. SSL/TLS Management

**Requirements:**

**Certificate Acquisition:**
- Automated via Let's Encrypt (ACME protocol)
- OR manual installation of commercial certificates

**Certificate Renewal:**
- Automatic renewal 30 days before expiration
- Monitoring alert 14 days before expiration
- Zero-downtime renewal process

**TLS Configuration:**
- Minimum TLS 1.2
- Prefer TLS 1.3 where supported
- Strong cipher suites only
- HSTS enabled with 1-year max-age

**Certificate Storage:**
- Stored in secrets management system
- Backed up securely
- Access logged

---

## 4. Monitoring & Observability

### 4.1. Monitoring Architecture

**Required Stack:**

```
Application Metrics → Prometheus → Grafana
Application Logs → Loki → Grafana
Alerts → Alertmanager → Notification Channels
```

**Prometheus Configuration:**

**Scrape Targets:**
- Backend API metrics endpoint (`/metrics`)
- AI Service metrics endpoint (`/metrics`)
- PostgreSQL Exporter
- Redis Exporter
- Nginx Exporter
- Node Exporter (system metrics)

**Retention:**
- Raw metrics: 15 days
- Aggregated metrics: 90 days

**Cardinality Limits:**
- Maximum unique time series: 1M
- Maximum labels per metric: 10

### 4.2. Metrics Collection Requirements

**Application Metrics (MUST include):**

| Metric Type | Examples | Purpose |
|---|---|---|
| Request metrics | `http_requests_total`, `http_request_duration_seconds` | Performance monitoring |
| Error metrics | `http_errors_total`, `http_errors_by_status` | Error tracking |
| Business metrics | `bookings_created_total`, `leads_generated_total` | Business KPIs |
| Resource metrics | `db_connection_pool_size`, `cache_hit_rate` | Resource utilization |

**Infrastructure Metrics (MUST include):**
- CPU utilization
- Memory utilization
- Disk I/O
- Network I/O
- Disk space usage

**Database Metrics (MUST include):**
- Connection pool stats
- Query execution time
- Lock wait time
- Transaction rate
- Replication lag (if applicable)

### 4.3. Log Aggregation Strategy

**Log Collection:** Promtail → Loki

**Log Retention:**
- Application logs: 30 days
- Access logs: 60 days
- Audit logs: 365 days (see DOC-020)
- Security logs: 365 days

**Log Formats:**
- Structured JSON for all application logs
- Common Log Format for access logs
- See DOC-013 for detailed log taxonomy

**Log Labels (MUST include):**
- `environment`
- `service`
- `level`
- `trace_id` (for distributed tracing)

### 4.4. Alerting Strategy

**Alert Channels:**
- Critical: Slack + SMS + Email
- Warning: Slack + Email
- Info: Slack only

**Required Alerts (MVP v1):**

| Alert | Condition | Severity | Response Time |
|---|---|---|---|
| Service Down | Health check fails for 2 minutes | Critical | Immediate |
| High Error Rate | Error rate > 5% for 5 minutes | Critical | 15 minutes |
| Disk Space Low | Disk usage > 85% | Warning | 1 hour |
| Memory High | Memory usage > 90% for 10 minutes | Warning | 30 minutes |
| Database Slow | Query p95 > 1s for 5 minutes | Warning | 30 minutes |
| Backup Failed | Backup job failed | Critical | 1 hour |

**Alert Fatigue Prevention:**
- Alert grouping by service
- Escalation policies
- Maintenance mode support
- Auto-resolve when condition clears

### 4.5. Grafana Dashboards

**Required Dashboards:**

1. **System Overview**
   - All services health status
   - Request rate across services
   - Error rate across services
   - Resource utilization

2. **Backend API Dashboard**
   - Request rate and latency
   - Error rate by endpoint
   - Database query performance
   - Cache hit rate

3. **Frontend Dashboard**
   - Page load times
   - Core Web Vitals
   - Client-side errors
   - User sessions

4. **AI Service Dashboard**
   - AI request volume
   - Model inference time
   - Token usage
   - Error rate

5. **Infrastructure Dashboard**
   - CPU, memory, disk across all nodes
   - Network throughput
   - Container status

6. **Business Metrics Dashboard**
   - Leads created
   - Bookings made
   - Revenue metrics
   - User activity

---

## 5. Secrets & Security

### 5.1. Secrets Management Strategy

**Secrets Management System:**

The system MUST use a dedicated secrets management solution (illustrative examples: Doppler, HashiCorp Vault, AWS Secrets Manager, or equivalent).

**Requirements:**

1. **Centralized Storage:** All secrets stored in secrets management system
2. **No Hardcoded Secrets:** No secrets in code, configs, or environment files
3. **Least Privilege:** Services access only required secrets
4. **Audit Logging:** All secret access logged
5. **Encryption:** Secrets encrypted at rest and in transit

**Secret Categories:**

| Category | Examples | Rotation Frequency |
|---|---|---|
| Database credentials | PostgreSQL password | 90 days |
| API keys | OpenAI, SendGrid, Twilio | 180 days or on compromise |
| JWT secrets | JWT signing key | 180 days |
| Encryption keys | Data encryption keys | 365 days |
| Service accounts | GitHub tokens | 90 days |

### 5.2. Secrets Rotation Policy

**Automated Rotation:**
- Database credentials via secrets manager
- API tokens via provider APIs
- Service account keys via automation

**Manual Rotation:**
- External API keys (quarterly review)
- JWT secrets (scheduled maintenance window)

**Emergency Rotation:**
- Immediate rotation on suspected compromise
- See DOC-051 for incident response procedures

**Rotation Process Requirements:**
- Zero-downtime rotation support
- Dual-key support during rotation window
- Validation before old secret removal
- Rollback capability

### 5.3. API Keys Management

**Third-Party API Keys:**

The system integrates with:
- OpenAI API
- Mapping providers (Yandex Maps, Google Maps, or equivalent)
- Email provider (SendGrid or equivalent)
- SMS provider (Twilio or equivalent)

**API Key Requirements:**

1. **Environment Separation:** Different keys per environment
2. **Rate Limit Monitoring:** Track usage against quotas
3. **Cost Tracking:** Monitor API usage costs
4. **Access Restriction:** Keys restricted to known IPs where possible
5. **Backup Keys:** Secondary keys available for failover

### 5.4. Security Principles

**Alignment with DOC-006:**

All security configurations MUST comply with the Security Architecture specification (DOC-006), including:

- Authentication and authorization mechanisms
- Data encryption requirements
- Network security rules
- Input validation requirements
- OWASP Top 10 mitigations

**Infrastructure Security:**

- Principle of least privilege for all accounts
- Network segmentation between services
- Firewall rules restricting inbound traffic
- Regular security patching schedule
- Vulnerability scanning in CI/CD pipeline

---

## 6. Storage & Backup Strategy

### 6.1. Database Backup Requirements

**Backup Types:**

| Backup Type | Frequency | Retention | Purpose |
|---|---|---|---|
| Full Backup | Daily at 02:00 UTC | 30 days | Complete database restore |
| Incremental Backup | Every 6 hours | 7 days | Point-in-time recovery |
| Transaction Logs | Continuous | 7 days | Minimal data loss recovery |

**Backup Storage:**

- Primary: Object storage (illustrative: S3, Yandex Object Storage, GCS, or equivalent)
- Secondary: Long-term archive storage (illustrative: Glacier, or equivalent)

**Backup Validation:**

- Weekly automated restore test in staging
- Monthly full disaster recovery drill
- Backup integrity checks after each backup

**Point-in-Time Recovery (PITR):**

- Support recovery to any point in last 7 days
- 5-minute granularity

**Execution Details:**

Refer to DOC-042 (Backup & Restore Playbook) for:
- Backup script implementation
- Restore procedures
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)

### 6.2. Log Storage & Retention

**Log Categories:**

| Category | Retention | Storage Tier | Compliance |
|---|---|---|---|
| Application Logs | 30 days | Hot | N/A |
| Access Logs | 60 days | Warm | N/A |
| Audit Logs | 365 days | Warm | Required |
| Security Logs | 365 days | Warm | Required |

**Storage Strategy:**
- Hot tier: Fast access, higher cost (Loki)
- Warm tier: Compressed, moderate cost (Object storage)
- Cold tier: Archive, lowest cost (Long-term archive)

**Compliance:**
- Audit logs MUST be tamper-proof
- Security logs MUST be immutable
- Retention periods MUST meet regulatory requirements

### 6.3. Object Storage for Media Files

**Media Types:**
- User-uploaded documents (ID verification, etc.)
- Facility images
- System-generated reports

**Storage Requirements:**

**Durability:** 99.999999999% (11 nines)

**Availability:** 99.9%

**Access Control:**
- Pre-signed URLs for temporary access
- Bucket policies restricting public access
- Encryption at rest

**CDN Integration:**
- Public assets served via CDN
- Cache invalidation support
- Geographic distribution

**Lifecycle Policies:**
- Transition to cheaper storage tiers after 90 days
- Delete temporary files after 30 days
- Archive old documents after 2 years

---

## 7. MVP Deployment Architecture

### 7.1. Target Infrastructure (MVP v1)

**Deployment Model:** Single-region, single-server with vertical scaling capability

**Compute Requirements:**

Illustrative example (specifications):
- 4-8 vCPU cores
- 16-32 GB RAM
- 200+ GB SSD storage
- 1 Gbps network

Providers (illustrative): Hetzner, DigitalOcean, Linode, AWS EC2, GCP Compute Engine, or equivalent.

**Service Distribution:**

```
┌─────────────────────────────────────────────┐
│           Compute Instance                   │
├─────────────────────────────────────────────┤
│  Nginx (Reverse Proxy)                      │
│  ├─→ Frontend (Next.js) x1                  │
│  ├─→ Backend (NestJS) x2                    │
│  └─→ AI Service (FastAPI) x1                │
│                                             │
│  PostgreSQL (with PostGIS)                  │
│  Redis (Cache & Queue)                      │
│                                             │
│  Monitoring Stack:                          │
│  ├─ Prometheus                              │
│  ├─ Grafana                                 │
│  ├─ Loki                                    │
│  └─ Promtail                                │
└─────────────────────────────────────────────┘
```

**External Services:**

- Object Storage (for media files and backups)
- CDN (Cloudflare or equivalent)
- DNS Management
- Secrets Management
- Third-party APIs (OpenAI, Maps, Email, SMS)

### 7.2. Resource Allocation (MVP v1)

**Service Resource Limits:**

| Service | CPU Limit | Memory Limit | Instances |
|---|---|---|---|
| Frontend | 0.5 CPU | 1 GB | 1 |
| Backend | 1.0 CPU | 2 GB | 2 |
| AI Service | 1.0 CPU | 2 GB | 1 |
| PostgreSQL | 2.0 CPU | 8 GB | 1 |
| Redis | 0.5 CPU | 2 GB | 1 |
| Nginx | 0.5 CPU | 512 MB | 1 |
| Monitoring | 1.0 CPU | 2 GB | Combined |

**Storage Allocation:**

| Component | Storage | Type |
|---|---|---|
| PostgreSQL | 50 GB | SSD |
| Redis | 5 GB | RAM (persistence enabled) |
| Application Logs | 20 GB | SSD |
| Backups | Off-instance | Object Storage |
| Media Files | Off-instance | Object Storage |

### 7.3. Network Architecture

**Firewall Rules:**

| Port | Protocol | Source | Destination | Purpose |
|---|---|---|---|---|
| 443 | TCP | Internet | Nginx | HTTPS |
| 80 | TCP | Internet | Nginx | HTTP (redirect to HTTPS) |
| 22 | TCP | Admin IPs only | Instance | SSH |
| 5432 | TCP | Localhost | PostgreSQL | Database |
| 6379 | TCP | Localhost | Redis | Cache |

**Internal Communication:**
- All services communicate via Docker network
- No external exposure of internal services
- Service-to-service authentication required

### 7.4. High Availability Considerations (MVP v1)

**Current State:**
- Single-server deployment
- No automatic failover
- Manual recovery procedures

**Mitigation Strategies:**

1. **Service Redundancy:** Multiple backend instances
2. **Health Monitoring:** Automatic restart of failed services
3. **Regular Backups:** Minimize data loss window
4. **Documented Recovery:** Clear runbook procedures (DOC-039)

**Limitations (MVP v1):**
- No geographic redundancy
- Single point of failure (server)
- Manual failover required

**Post-MVP Improvements:**

When scaling beyond MVP threshold (see DOC-058):
- Multi-server deployment
- Load balancer with automatic failover
- Database replication (primary + replica)
- Geographic redundancy

### 7.5. Deployment Checklist (High-Level)

**Pre-Launch Requirements:**

| Category | Requirement | Validation |
|---|---|---|
| **Infrastructure** | Compute instance provisioned | Resource specs verified |
| | Domain configured with DNS | DNS resolution confirmed |
| | SSL certificates obtained | Certificate validity confirmed |
| | Firewall rules applied | Network access tested |
| **Application** | All migrations tested in staging | Migration logs reviewed |
| | API documentation published | Docs accessible |
| | Performance benchmarked | Metrics within acceptable range |
| | Security scan completed | No critical vulnerabilities |
| **Monitoring** | Monitoring stack deployed | All dashboards accessible |
| | Alerts configured | Test alerts sent successfully |
| | Log aggregation active | Logs flowing to Loki |
| **Secrets** | All secrets uploaded | Services can retrieve secrets |
| | Secrets validated | Services start successfully |
| **Backups** | Backup automation configured | Test backup completed |
| | Restore tested | Restore successful in staging |
| **External Services** | Third-party APIs tested | All API calls successful |
| | Email sending tested | Test email received |
| | SMS sending tested | Test SMS received |

**Detailed Procedures:**

Refer to DOC-039 (Deployment Runbook) for:
- Step-by-step deployment instructions
- Pre-deployment checklist expansion
- Deployment script execution
- Post-deployment validation
- Rollback procedures

### 7.6. Scaling Thresholds (When to Scale)

**Monitoring Thresholds:**

When these metrics are consistently exceeded, scaling is required:

| Metric | Threshold | Action |
|---|---|---|---|
| CPU Utilization | > 70% sustained | Vertical scaling (upgrade instance) |
| Memory Utilization | > 80% sustained | Vertical scaling (upgrade instance) |
| Database Connections | > 80% of pool | Increase connection pool or scale DB |
| Response Time p95 | > 2 seconds | Investigate bottlenecks, consider horizontal scaling |
| Request Rate | > 1,000 RPS | Consider load balancer + horizontal scaling |
| Database Size | > 80% of allocated | Increase storage allocation |

**Scaling Decision Point:**

When metrics consistently exceed thresholds AND:
- User growth trend indicates continued growth
- Vertical scaling limits reached
- Business justifies infrastructure investment

**Next Steps:**

Refer to DOC-058/DOC-059 for:
- Kubernetes migration strategy
- Horizontal scaling implementation
- Multi-region deployment planning
- Database sharding strategy

---

## 8. Post-MVP Considerations (Out of Scope)

The following capabilities are **explicitly out of scope** for MVP v1 and are documented for future planning only:

### 8.1. Kubernetes Migration (Post-MVP)

- Container orchestration via Kubernetes
- Auto-scaling based on metrics
- Service mesh for observability
- Advanced deployment strategies (blue-green, canary)

**Decision Point:** When exceeding 1,000+ MAU with consistent growth

### 8.2. Database Scaling (Post-MVP)

- Primary-replica replication
- Read-write splitting
- Database sharding by geography or tenant
- Connection pooling optimization

**Decision Point:** When database becomes a bottleneck

### 8.3. Multi-Region Deployment (Post-MVP)

- Active-active configurations
- Geographic load balancing
- Data residency compliance
- Cross-region replication

**Decision Point:** When expanding to multiple countries

### 8.4. Advanced Cost Optimization (Post-MVP)

- Spot instances for non-critical workloads
- Reserved instances for predictable load
- Auto-scaling policies for cost management
- Resource right-sizing automation

**Decision Point:** When infrastructure costs exceed $2,000/month

---

## 9. Integration Points

### 9.1. Dependencies

This document integrates with:

| Document | Integration Point |
|---|---|
| DOC-002: Technical Architecture | Infrastructure components, service boundaries |
| DOC-003: API Design Blueprint | API endpoints monitored, health checks |
| DOC-004: Database Specification | Database backup requirements, migration strategy |
| DOC-006: Security Architecture | Security controls, access policies |
| DOC-007: API Rate Limiting | Rate limiting enforcement at proxy layer |
| DOC-008: Error Handling | Error metrics collection, alerting |
| DOC-013: Logging Strategy | Log aggregation, retention policies |
| DOC-020: Audit Logging | Audit log retention, compliance |
| DOC-039: Deployment Runbook | Operational procedures for deployment |
| DOC-042: Backup Playbook | Backup execution procedures |
| DOC-051: Incident Response | Incident handling procedures |
| DOC-058/059: Scaling Strategy | Post-MVP scaling implementation |

### 9.2. Assumptions

1. **Network:** Reliable internet connectivity with 99.9% uptime
2. **DNS:** DNS provider with 100% SLA
3. **Third-Party APIs:** External services available per their SLAs
4. **Team Capability:** Team has DevOps expertise or access to external support
5. **Budget:** Infrastructure budget allocated per business plan
6. **Compliance:** No HIPAA, PCI-DSS, or other strict regulatory requirements (MVP v1)

---

## 10. Document Maintenance

**Review Schedule:**
- Monthly review during MVP phase
- Quarterly review post-launch
- Immediate review on architectural changes

**Change Control:**
- All changes require technical lead approval
- Breaking changes require stakeholder notification
- Version control via Git

**Related Documents:**
- This document MUST remain synchronized with DOC-002, DOC-039
- Conflicts MUST be escalated to technical leadership
- Updates MUST reference affected sections in related documents

---

**End of Document**

**Document ID:** DOC-041  
**Version:** 2.0 (Canonical)  
**Status:** 🟢 GREEN — Ready for Implementation  
**Last Updated:** December 17, 2024  
**Next Review:** January 17, 2025
