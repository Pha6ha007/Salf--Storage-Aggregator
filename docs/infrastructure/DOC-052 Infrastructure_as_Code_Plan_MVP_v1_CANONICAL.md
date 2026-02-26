# Infrastructure as Code (IaC) Plan
## Self-Storage Aggregator MVP v1

**Document ID:** DOC-052  
**Version:** 2.0 (Canonical)  
**Date:** December 17, 2025  
**Status:** Canonical — MVP v1  
**Project:** Self-Storage Aggregator MVP

---

## Document Role & Scope

### Purpose

This document defines the **principles, boundaries, and requirements** for managing infrastructure as code in the Self-Storage Aggregator MVP v1. It establishes **WHAT** must be managed as code and **WHY**, not **HOW** to implement it.

### What This Document IS

- ✅ Infrastructure as Code **policy and architecture principles**
- ✅ Requirements for repeatability, versioning, and auditability
- ✅ Boundaries between infrastructure code and runtime configuration
- ✅ Governance model for infrastructure changes
- ✅ Integration points with other canonical documents

### What This Document IS NOT

- ❌ **NOT** an execution guide or deployment runbook (see DOC-039)
- ❌ **NOT** a step-by-step tutorial or how-to guide
- ❌ **NOT** prescriptive about specific tools or cloud providers
- ❌ **NOT** a CI/CD pipeline specification (see DOC-041)
- ❌ **NOT** containing executable code (Terraform/Ansible/YAML/bash)

### Scope Limitations

- **MVP v1 only** — Advanced patterns deferred to post-MVP
- **Single-region deployment** — Multi-region out of scope
- **Simple state management** — Advanced state topologies out of scope
- **Manual approval gates** — Fully automated promotion out of scope

### Canonical Dependencies

This document **MUST** align with:
- **DOC-039:** Deployment & Rollback Runbook (execution details)
- **DOC-041:** DevOps Infrastructure Plan (environment topology, CI/CD)
- **DOC-048:** Security & Compliance Plan (secrets handling, encryption)
- **DOC-020:** Audit Logging Specification (infrastructure event logging)
- **DOC-002/DOC-086:** Technical Architecture (service boundaries, components)

**Execution details** (Terraform modules, Ansible playbooks, CI/CD workflows) are maintained **separately** in implementation repositories and runbooks.

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [IaC Boundaries & Scope](#2-iac-boundaries--scope)
3. [Infrastructure Versioning & Immutability](#3-infrastructure-versioning--immutability)
4. [State Management Requirements](#4-state-management-requirements)
5. [Secrets Management Principles](#5-secrets-management-principles)
6. [Environment Separation](#6-environment-separation)
7. [Change Management & Review](#7-change-management--review)
8. [Disaster Recovery & Rollback](#8-disaster-recovery--rollback)
9. [Observability & Auditability](#9-observability--auditability)
10. [Out of Scope for MVP v1](#10-out-of-scope-for-mvp-v1)

---

## 1. Core Principles

### 1.1. Infrastructure as Code Mandate

**Principle:** All infrastructure components MUST be defined, provisioned, and modified through version-controlled code.

**Requirements:**
- Infrastructure definitions MUST be stored in version control (e.g., Git)
- Manual changes to production infrastructure are PROHIBITED except for emergency recovery
- All infrastructure changes MUST be peer-reviewed before application
- Infrastructure code MUST be treated with the same rigor as application code

**Rationale:** Ensures repeatability, auditability, and disaster recovery capability.

### 1.2. Declarative Over Imperative

**Principle:** Infrastructure MUST be described in declarative formats stating desired end-state, not step-by-step procedures.

**Requirements:**
- Infrastructure definitions MUST declare "what exists" rather than "how to create"
- Tools MUST support idempotency (applying the same definition multiple times produces the same result)
- State drift MUST be detectable and correctable

**Rationale:** Reduces complexity, improves reliability, enables automated reconciliation.

### 1.3. Separation of Concerns

**Principle:** Infrastructure provisioning, configuration management, and application deployment MUST be clearly separated.

**Boundaries:**

| Concern | Responsibility | Examples |
|---------|---------------|----------|
| **Infrastructure Provisioning** | Create/destroy cloud resources | VMs, networks, DNS, storage buckets |
| **Configuration Management** | Install/configure software on servers | Package installation, service configuration |
| **Application Deployment** | Deploy application code and assets | Container images, static files, database migrations |

**Requirements:**
- Each layer MUST have distinct tooling and workflows
- Dependencies between layers MUST be explicit and documented
- Changes at one layer MUST NOT require changes at other layers unless necessary

### 1.4. Vendor Neutrality (Where Feasible)

**Principle:** IaC implementations SHOULD minimize vendor lock-in where architecturally appropriate.

**Requirements:**
- Infrastructure definitions SHOULD use abstraction layers (modules, roles) where practical
- Critical business logic MUST NOT be embedded in vendor-specific features
- Provider-specific implementations SHOULD be documented as "illustrative examples"

**Note:** MVP v1 prioritizes time-to-market over perfect vendor neutrality. Provider-specific features MAY be used when they provide significant value or cost savings.

### 1.5. Security by Default

**Principle:** Infrastructure code MUST enforce secure defaults and MUST NOT contain secrets.

**Requirements:**
- Infrastructure code MUST NOT contain passwords, API keys, or credentials
- Default configurations MUST follow principle of least privilege
- Security controls (encryption, access restrictions) MUST be enabled by default
- Secrets MUST be managed through dedicated secret management systems

---

## 2. IaC Boundaries & Scope

### 2.1. What MUST Be Managed as Code

**Mandatory IaC Coverage for MVP v1:**

| Resource Type | Examples | Requirement |
|--------------|----------|-------------|
| **Compute Resources** | Virtual machines, container hosts | MUST |
| **Network Infrastructure** | VPCs, subnets, firewalls, load balancers | MUST |
| **Storage** | Object storage buckets, block storage volumes | MUST |
| **DNS Records** | Public DNS zones and records | MUST |
| **Security Groups** | Firewall rules, access control lists | MUST |
| **Service Configurations** | Database settings, cache configurations | MUST |
| **Monitoring Alerts** | Alert rules, notification channels | SHOULD |
| **Backup Policies** | Retention rules, backup schedules | SHOULD |

**Rationale:** Ensures complete disaster recovery capability and audit trail.

### 2.2. What MUST NOT Be in IaC Code

**Prohibited Content:**

| Content Type | Why Prohibited | Where It Belongs |
|-------------|----------------|------------------|
| **Credentials** | Security risk, audit compliance | Secret management system |
| **API Keys** | Security risk, rotation required | Secret management system |
| **Encryption Keys** | Security risk, key management required | Dedicated key management service |
| **User Data** | Privacy, compliance | Application database |
| **Application Logs** | Volume, retention | Logging infrastructure |
| **Temporary State** | Not infrastructure definition | Runtime state files |

**Requirements:**
- Code repositories MUST enforce pre-commit hooks to prevent secret commits
- Secret detection tools MUST scan all commits
- Any detected secrets MUST trigger immediate rotation

### 2.3. Configuration vs. Secrets

**Safe to Store in IaC:**
- Resource names, sizes, and instance types
- Network CIDR blocks and port numbers
- Boolean feature flags
- Public domain names
- Region/availability zone identifiers
- Resource tags and metadata

**MUST Use Secret Management:**
- Database passwords and connection strings with credentials
- API tokens and OAuth secrets
- SSH private keys
- JWT signing keys
- Third-party service credentials
- Webhook URLs containing authentication tokens

---

## 3. Infrastructure Versioning & Immutability

### 3.1. Version Control Requirements

**Mandatory Practices:**
- All infrastructure code MUST be stored in Git or equivalent version control
- Infrastructure repositories MUST have branch protection on main/production branches
- Commits MUST include descriptive messages following conventional commit format
- Each environment MUST correspond to a specific code version or branch

**Prohibited Practices:**
- Direct modification of production infrastructure without corresponding code change
- Manual updates to infrastructure without version control record
- Bypassing code review process for infrastructure changes

### 3.2. Immutable Infrastructure Pattern

**Principle:** Where feasible, infrastructure components SHOULD be replaced rather than modified in place.

**Requirements:**
- Server images SHOULD be built once and promoted through environments
- Application deployments SHOULD create new instances rather than updating existing ones
- Configuration changes SHOULD trigger replacement of resources when safe

**Exceptions for MVP v1:**
- Database schema migrations MAY update existing database instances
- Storage volumes MAY be updated in place to avoid data migration complexity
- Cost constraints MAY necessitate in-place updates for large resources

**Rationale:** Reduces configuration drift, improves rollback reliability.

### 3.3. Change Tracking

**Requirements:**
- Every infrastructure change MUST be associated with a version control commit
- Infrastructure version MUST be recorded in deployment metadata
- Infrastructure changes MUST be logged to audit system (per DOC-020)

---

## 4. State Management Requirements

### 4.1. State Storage Principles

**Principle:** Infrastructure state MUST be stored remotely, encrypted, and access-controlled.

**Requirements:**
- State files MUST be stored in remote backend (object storage or equivalent)
- State files MUST be encrypted at rest
- State files MUST be encrypted in transit
- State access MUST be restricted via IAM/RBAC policies
- State files MUST support concurrent access with locking mechanism

**Prohibited:**
- Local state files in production use
- Unencrypted state storage
- Shared state files via file sharing (Dropbox, network drives)
- State files committed to version control

### 4.2. State Isolation

**Requirements:**
- Each environment (dev, staging, prod) MUST have separate state storage
- State isolation MUST prevent cross-environment impact from errors
- State paths or keys MUST clearly identify environment

**Example Structure (Illustrative):**
```
state-storage/
├── dev/
├── staging/
└── prod/
```

### 4.3. State Locking

**Requirements:**
- State locking MUST prevent concurrent modifications
- Lock failures MUST prevent infrastructure changes from proceeding
- Lock timeout MUST be configurable
- Lock status MUST be observable for debugging

### 4.4. State Backup & Recovery

**Requirements:**
- State files MUST be backed up automatically before each change
- Backups MUST be retained according to data retention policy (per DOC-048)
- State recovery procedure MUST be documented (in DOC-039)
- State backup integrity MUST be verified periodically

**Retention Policy for MVP v1:**
- Daily backups retained for 30 days
- Weekly backups retained for 90 days
- Pre-deployment snapshots retained for 1 year

---

## 5. Secrets Management Principles

### 5.1. Secret Lifecycle

**Principle:** All secrets MUST be managed through a dedicated secret management system with encryption, access control, and audit logging.

**Requirements:**
- Secrets MUST be stored in a centralized secret management system
- Secrets MUST be encrypted at rest and in transit
- Secret access MUST be authenticated and authorized
- Secret access MUST be logged for audit (per DOC-020)
- Secrets MUST support rotation without infrastructure redeployment

### 5.2. Secret Injection

**Requirements:**
- Secrets MUST be injected at runtime, not stored in code or images
- Secret injection MUST occur as late as possible (runtime vs. build time)
- Secrets MUST NOT appear in logs, error messages, or debug output
- Secret environment variables MUST be cleared after process termination

### 5.3. Secret Rotation

**Requirements:**
- All secrets MUST have defined rotation schedules
- High-risk secrets (API keys, DB passwords) MUST be rotatable without downtime
- Rotation procedures MUST be documented (in DOC-039)
- Rotation MUST be tested regularly in non-production environments

**Recommended Rotation Frequencies:**
- Database credentials: Quarterly or on staff changes
- API tokens: Monthly or on suspicious activity
- TLS certificates: Automated via certificate authority
- Service account keys: Quarterly

---

## 6. Environment Separation

### 6.1. Environment Definitions

**Required Environments for MVP v1:**

| Environment | Purpose | Data Sensitivity | Change Frequency |
|------------|---------|------------------|------------------|
| **Development** | Feature development, experimentation | Low (synthetic data) | High (multiple times daily) |
| **Staging** | Pre-production testing, QA validation | Medium (sanitized production data) | Medium (daily) |
| **Production** | Live customer-facing services | High (real customer data) | Low (weekly or less) |

### 6.2. Environment Isolation

**Requirements:**
- Environments MUST be logically or physically isolated
- Production environment MUST have strictest access controls
- Development environment MUST NOT have access to production data
- Staging environment SHOULD mirror production architecture
- Cross-environment dependencies are PROHIBITED

**Access Control Levels:**
- **Development:** All developers read/write
- **Staging:** Senior developers and QA read/write
- **Production:** DevOps engineers only, all changes reviewed

### 6.3. Environment Parity

**Principle:** Staging SHOULD closely resemble production to catch environment-specific issues.

**Requirements:**
- Staging SHOULD use same infrastructure patterns as production
- Staging MAY use smaller instance sizes for cost optimization
- Staging SHOULD use same software versions as production
- Differences between staging and production MUST be documented

**Acceptable Differences:**
- Resource sizes (smaller in staging)
- Replica counts (fewer in staging)
- Backup frequencies (less frequent in staging)
- Cost optimization features (may be disabled in staging)

---

## 7. Change Management & Review

### 7.1. Review Process

**Requirements:**
- All infrastructure changes MUST undergo peer review
- Production changes MUST be reviewed by at least one senior engineer
- Review MUST verify: security, cost impact, rollback plan
- Automated validation checks MUST pass before review
- Review approvals MUST be recorded in version control system

### 7.2. Validation Gates

**Pre-Merge Validations (Automated):**
- Syntax validation (linting)
- Security scanning (no secrets, known vulnerabilities)
- Format checking (code style consistency)
- Plan generation (predicted changes)
- Cost estimation (if available)

**Pre-Deployment Validations:**
- All automated checks passed
- Peer review approved
- Rollback plan documented
- Deployment window scheduled (if production)

### 7.3. Emergency Changes

**Requirements:**
- Emergency changes MAY bypass normal review process
- Emergency changes MUST be followed by post-incident review
- Emergency changes MUST be documented with incident number
- Emergency bypass MUST be logged and audited

**Emergency Criteria:**
- Active production outage
- Active security incident
- Imminent data loss risk

---

## 8. Disaster Recovery & Rollback

### 8.1. Rollback Capability

**Principle:** Every infrastructure change MUST be reversible.

**Requirements:**
- Rollback procedure MUST be documented before production deployment
- State backups MUST be available for rollback
- Rollback time MUST be estimated and documented
- Destructive changes MUST have explicit confirmation and backup

**Rollback Mechanisms:**
1. **State Restore:** Restore previous state file (fastest)
2. **Code Revert:** Revert to previous code version and re-apply
3. **Manual Recovery:** Execute documented manual steps (last resort)

### 8.2. Backup Strategy

**Requirements:**
- State files MUST be backed up before every apply operation
- Backups MUST be stored separately from primary state storage
- Backup restoration MUST be tested quarterly
- Backup integrity MUST be verified automatically

### 8.3. Disaster Recovery

**Requirements:**
- Complete infrastructure MUST be rebuildable from code and backups
- Recovery Time Objective (RTO) MUST be defined per environment
- Recovery Point Objective (RPO) MUST be defined per environment
- Disaster recovery procedure MUST be tested annually

**MVP v1 Recovery Targets:**
- Development: RTO 4 hours, RPO 24 hours
- Staging: RTO 2 hours, RPO 12 hours
- Production: RTO 1 hour, RPO 1 hour

---

## 9. Observability & Auditability

### 9.1. Infrastructure Event Logging

**Requirements:**
- All infrastructure changes MUST be logged (per DOC-020)
- Logs MUST include: timestamp, user, change description, outcome
- Failed changes MUST be logged with error details
- Logs MUST be retained per audit policy (per DOC-048)

**Required Log Events:**
- Infrastructure plan generation
- Infrastructure apply operations
- Infrastructure destroy operations
- State file access (read/write)
- Secret access from infrastructure code

### 9.2. Change Tracking

**Requirements:**
- Infrastructure version deployed MUST be recorded in deployment metadata
- Change history MUST be queryable by environment, resource, or time range
- Infrastructure drift MUST be detectable and reported

### 9.3. Cost Tracking

**Requirements:**
- Infrastructure costs MUST be tracked by environment
- Cost trends MUST be monitored and reported
- Unexpected cost increases MUST trigger alerts
- Resource tagging MUST enable cost attribution

---

## 10. Out of Scope for MVP v1

### 10.1. Advanced IaC Patterns (Post-MVP)

The following are explicitly **OUT OF SCOPE** for MVP v1:

**Multi-Region Infrastructure:**
- Cross-region state management
- Multi-region failover automation
- Global traffic routing
- Cross-region data replication

**Advanced Deployment Patterns:**
- Blue-green infrastructure deployment
- Canary infrastructure rollouts
- Dynamic environment creation/destruction
- Infrastructure A/B testing

**Advanced State Management:**
- State file sharding across multiple backends
- Automated state migration between providers
- State composition and aggregation
- Cross-environment state references

**Advanced Cost Optimization:**
- Automated resource rightsizing
- Scheduled infrastructure shutdown (dev/staging)
- Spot instance orchestration
- Reserved instance optimization

**Advanced Security:**
- Infrastructure policy as code (OPA, Sentinel)
- Automated compliance scanning in CI/CD
- Dynamic secret generation per deployment
- Zero-trust network infrastructure

### 10.2. Tool-Specific Features

MVP v1 intentionally avoids deep investment in tool-specific features that may create vendor lock-in. The following are deferred:

- Advanced provider-specific modules
- Custom provider development
- Tool-specific testing frameworks beyond basic validation
- Tool-specific UI/dashboard integrations

### 10.3. Rationale for Deferrals

These capabilities provide value but increase complexity beyond MVP v1 requirements:
- **Time to market:** MVP focuses on core functionality
- **Team maturity:** Advanced patterns require operational experience
- **Cost optimization:** Advanced features may not provide ROI at MVP scale
- **Maintenance burden:** Simpler infrastructure is easier to maintain

---

## Conclusion

This Infrastructure as Code Plan establishes the foundational principles and requirements for managing the Self-Storage Aggregator MVP v1 infrastructure as code.

### Key Invariants

✅ **All infrastructure MUST be code:** No manual production changes  
✅ **All changes MUST be versioned:** Git as source of truth  
✅ **All changes MUST be reviewed:** Peer review mandatory  
✅ **State MUST be remote and encrypted:** No local state  
✅ **Secrets MUST be external:** No secrets in code  
✅ **Environments MUST be isolated:** No cross-environment access  
✅ **Changes MUST be reversible:** Rollback always possible  
✅ **Changes MUST be audited:** Complete change log  

### Implementation References

For execution details, refer to:
- **DOC-039:** Deployment & Rollback Runbook (how to deploy)
- **DOC-041:** DevOps Infrastructure Plan (CI/CD pipelines, topology)
- **DOC-048:** Security & Compliance Plan (encryption, access control)
- **DOC-020:** Audit Logging Specification (logging requirements)

### Maintenance

This document defines IaC principles and requirements. Tool choices, specific implementations, and runbook procedures are maintained separately to allow updates without changing foundational policy.

---

**Document Version:** 2.0 (Canonical)  
**Last Updated:** December 17, 2025  
**Status:** Canonical — MVP v1  
**Scope:** Intentionally limited to MVP v1 requirements  
**Execution Details:** Maintained separately in implementation repositories

---

**End of Document**
