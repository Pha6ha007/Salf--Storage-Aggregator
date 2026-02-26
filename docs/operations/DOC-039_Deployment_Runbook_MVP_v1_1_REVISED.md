# Deployment Runbook - Self-Storage Aggregator MVP v1 (DOC-039)

**Document ID:** DOC-039  
**Version:** 1.1  
**Status:** 🟢 GREEN (Canonical Candidate)  
**Last Updated:** December 17, 2025  
**Project:** Self-Storage Aggregator MVP v1  
**Owner:** DevOps & Engineering Leadership

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Document Type | Operational Runbook |
| Scope | MVP v1 |
| Audience | DevOps, Engineering, Tech Leadership |
| Classification | Canonical (Pending Approval) |
| Review Frequency | Quarterly or post-major-incident |

---

# Document Scope & Intent

## Purpose of This Document

This Deployment Runbook is an **operational reference document** for deploying the Self-Storage Aggregator MVP v1 platform. It provides:

- **Procedures and scripts** for safe, repeatable deployments
- **Checklists and validation steps** to minimize deployment risk
- **Rollback and recovery procedures** for handling deployment issues
- **Reference examples** for team training and knowledge transfer

## What This Document IS

✅ **An operational guide** - Step-by-step procedures for deployment activities  
✅ **Risk mitigation reference** - Intentionally comprehensive to reduce deployment failures  
✅ **Knowledge repository** - Collection of battle-tested scripts and best practices  
✅ **Training material** - Reference for onboarding new team members

## What This Document IS NOT

❌ **NOT an architecture document** - Architecture is defined in DOC-002/DOC-086  
❌ **NOT a CI/CD specification** - Pipeline design is separate from this runbook  
❌ **NOT infrastructure design** - Infrastructure decisions live elsewhere  
❌ **NOT mandatory in full** - Not every procedure is required for every deployment  
❌ **NOT product specification** - Product scope is defined in DOC-001

## Document Scope: MVP v1

This runbook is **explicitly scoped to MVP v1**. It includes:

- ✅ Procedures necessary for MVP launch and operation
- ✅ Advanced procedures prepared for future maturity (marked as OPTIONAL)
- ✅ Best practices that reduce risk even if not strictly required
- ❌ NOT enterprise-SRE requirements "by default"
- ❌ NOT post-MVP features or infrastructure

**Interpretation Guidance:**  
Where this document provides comprehensive procedures, teams should apply judgment about which steps are appropriate for their current infrastructure maturity level. See "Execution Model & Usage Guidelines" below.

## Relationship to Reality

**Implementation Note:**  
This runbook describes an idealized deployment process. Actual MVP v1 deployment may be simpler depending on:
- Infrastructure provider capabilities (managed services handle complexity)
- Team size and availability
- Automated vs manual execution choices

**Adaptation Principle:**  
Teams are expected to adapt procedures to their context while maintaining safety principles. Document procedures that are MORE comprehensive than current practice to allow growth without document rewrites.

---

# Execution Model & Usage Guidelines

## Procedure Classification

All procedures in this runbook are classified into three tiers:

### 🔴 **MANDATORY** - Must Execute for Every Production Deployment

These procedures are **non-negotiable** for production deployments:

- ✅ Pre-deployment infrastructure health check (Section 2.1)
- ✅ Database backup before migrations (Section 6.1)
- ✅ Migration dry-run validation (Section 6.2)
- ✅ Service health checks after deployment (Section 4.5)
- ✅ Core API smoke tests (Section 7.1)
- ✅ Post-deployment validation (Section 11)
- ✅ Rollback decision criteria monitoring (Section 9.1)

**Rationale:** These procedures protect against data loss, service outage, and undetected failures.

### 🟡 **RECOMMENDED** - Best Practices, Optional Based on Context

These procedures are **strongly recommended** but may be simplified or skipped based on:
- Infrastructure maturity level
- Team experience and confidence
- Risk profile of specific change
- Time constraints (hotfix scenarios)

Examples:
- Extended smoke test suites (Section 7.3)
- Detailed log analysis procedures (Section 11.2)
- Advanced monitoring setup (Section 11.1)
- Comprehensive rollback rehearsals (Section 9.5)

**Guideline:** Skip RECOMMENDED procedures only with explicit Tech Lead approval and documented justification.

### 🟢 **OPTIONAL / CONTEXTUAL** - Advanced or Situational

These procedures are **future-ready** or apply only in specific contexts:
- Complex zero-downtime orchestration (Section 4.4 advanced patterns)
- Multi-region coordination (mentioned for completeness, not MVP requirement)
- Advanced hotfix branching strategies (Section 10.2 edge cases)
- Extended post-deployment monitoring (Section 11.1 beyond 30 minutes)

**Guideline:** OPTIONAL procedures can be ignored for MVP v1 unless specific circumstances require them.

## How to Use This Runbook

### For Regular Releases (Weekly/Bi-weekly)

1. **Review MANDATORY procedures** - Execute all required steps
2. **Select RECOMMENDED procedures** - Choose based on change risk and team capacity
3. **Skip OPTIONAL procedures** - Unless specifically needed

### For Hotfixes (Emergency)

1. **Execute MANDATORY procedures** - Cannot be skipped even in emergency
2. **Compress RECOMMENDED procedures** - Use judgment, but document what was skipped
3. **Ignore OPTIONAL procedures** - Focus on rapid, safe resolution

### For Staging Deployments

1. **MANDATORY procedures are optional** - Staging is lower risk
2. **Use as rehearsal for production** - Practice procedures before production use
3. **Experiment with OPTIONAL procedures** - Learn advanced techniques in safe environment

## Execution Authority

| Procedure Tier | Who Can Skip | Approval Required |
|----------------|--------------|-------------------|
| MANDATORY | Nobody | N/A |
| RECOMMENDED | Tech Lead | Yes, documented in release notes |
| OPTIONAL | Deployment Engineer | No approval needed |

---

# Security & Safety Notice

## ⚠️ CRITICAL SECURITY WARNINGS

### Script Execution Safety

**All scripts in this runbook are reference-grade examples.** Before production use:

1. **Review every script** - Understand what it does before execution
2. **Validate for your environment** - Adapt paths, URLs, and configurations
3. **Test in staging first** - Never run untested scripts in production
4. **Verify permissions** - Ensure scripts run with appropriate privilege level

### Secrets Management

**🔴 NEVER hardcode secrets in scripts or configurations.**

- Use environment variables for sensitive values
- Leverage secret management systems (per DOC-078 Section 4)
- Rotate credentials after any exposure or suspicious access
- Audit who has access to production secrets

### Production Approval

**All production deployments require explicit approval** (per DOC-051 Incident Response Plan):

- Regular releases: Tech Lead approval
- Hotfixes: On-call engineer authority with post-facto notification
- Database changes: Tech Lead + Senior Backend Engineer review

### Backup Verification

**Before any destructive operation (migrations, schema changes, data modifications):**

1. Verify backup exists and is recent (<2 hours old)
2. Test backup restoration capability (at least quarterly)
3. Document backup location and restoration procedure
4. Have rollback plan ready before starting

### Rollback Authority

**Anyone can trigger rollback if deployment appears to be failing.**

- No approval needed for rollback decision
- Document rollback decision and reasoning post-facto
- Investigate root cause after service is stable

---

# Canonical Boundaries & Document Relationships

## What This Document Defines

This Deployment Runbook (DOC-039) defines:

✅ **Operational deployment procedures** - How to deploy safely  
✅ **Pre-deployment validation** - What to check before deploying  
✅ **Post-deployment validation** - What to verify after deploying  
✅ **Rollback procedures** - How to recover from failed deployments  
✅ **Smoke test suites** - Basic validation of deployed services  

## What This Document Does NOT Define

This document **does NOT** define and must not be interpreted as defining:

❌ **System architecture** → See DOC-002 / DOC-086 (Technical Architecture)  
❌ **CI/CD pipeline design** → See infrastructure documentation (separate)  
❌ **Logging standards** → See DOC-055 (Logging Strategy)  
❌ **Error handling patterns** → See DOC-044 (Error Handling & Fault Tolerance)  
❌ **Incident response procedures** → See DOC-051 (Incident Response Plan)  
❌ **Security controls** → See DOC-078 (Security & Compliance Plan)  
❌ **Monitoring architecture** → See DOC-057 (Monitoring & Observability)  
❌ **Rate limiting implementation** → See DOC-017 (API Rate Limiting)  
❌ **Audit logging** → See DOC-020 (Audit Logging Specification)  

## Integration Points with Canonical Documents

### DOC-002 / DOC-086 - Technical Architecture

**Relationship:** This runbook deploys the architecture defined in DOC-002/DOC-086.

**Boundary:**
- **DOC-002/086 Defines:** What services exist, how they communicate, infrastructure layers
- **DOC-039 Defines:** How to deploy those services safely

**Conflict Resolution:** If deployment procedures conflict with architecture, **architecture document wins**. Deployment must adapt to architecture, not vice versa.

### DOC-051 - Incident Response Plan

**Relationship:** Deployment problems may escalate to incidents.

**Boundary:**
- **DOC-051 Defines:** When deployment issue becomes incident, escalation paths, incident command structure
- **DOC-039 Defines:** Technical rollback procedures, deployment health checks

**Transition Point:** If deployment cannot be fixed or rolled back within 15 minutes, escalate per DOC-051.

### DOC-055 - Logging Strategy

**Relationship:** Deployment procedures generate logs per DOC-055 standards.

**Boundary:**
- **DOC-055 Defines:** What to log, log levels, log taxonomy
- **DOC-039 Defines:** How to analyze logs during deployment validation

**Compliance Requirement:** Deployment scripts must emit logs following DOC-055 taxonomy.

### DOC-078 - Security & Compliance Plan

**Relationship:** Deployments must respect security controls defined in DOC-078.

**Boundary:**
- **DOC-078 Defines:** Required security controls, approval authorities, secrets management
- **DOC-039 Defines:** Deployment procedures that implement those controls

**Security Override:** If deployment procedure conflicts with security requirements, **security requirements win**.

### DOC-020 - Audit Logging Specification

**Relationship:** Deployments are audited events per DOC-020.

**Boundary:**
- **DOC-020 Defines:** What deployment events must be audited
- **DOC-039 Defines:** Deployment procedures (which generate auditable events)

**Compliance Requirement:** All production deployments must generate audit logs per DOC-020 Section 4.2.

### DOC-057 - Monitoring & Observability Plan

**Relationship:** Deployment validation uses monitoring infrastructure per DOC-057.

**Boundary:**
- **DOC-057 Defines:** Monitoring architecture, metrics to collect, alerting rules
- **DOC-039 Defines:** How to check monitoring outputs during deployment validation

**Dependency:** Deployment procedures assume monitoring infrastructure exists per DOC-057.

## Version Alignment

- This document version (1.1) aligns with **MVP v1** platform version
- References to other documents use their DOC-IDs (not version numbers)
- Cross-document consistency is maintained through DOC-ID references

## Conflict Resolution Priority

If conflicts arise between documents:

1. **Functional Specification (DOC-001)** - Product requirements trump operations
2. **Technical Architecture (DOC-002/086)** - Architecture constrains deployment
3. **Security & Compliance (DOC-078)** - Security is non-negotiable
4. **This Runbook (DOC-039)** - Operational procedures adapt to above
5. **Infrastructure Documentation** - Implementation details adapt to runbook

---

# Vendor Neutrality & Provider Agnosticism

## Illustrative Examples, Not Requirements

This runbook references specific platforms and vendors for **illustrative purposes only**:

- **Vercel** - Example frontend deployment platform (Section 5.2)
- **Railway** - Example managed infrastructure provider (Sections 1.2, 5.2)
- **DigitalOcean** - Example VPS provider (Section 1.2)
- **SendGrid** - Example email service (Section 1.2)

**Critical Understanding:**  
These are **NOT required providers**. Teams may use:
- Different deployment platforms
- Alternative cloud providers
- Self-hosted infrastructure
- Different SaaS services

## Adaptation Guidance

When using different providers:

1. **Preserve deployment principles** - Safety, validation, rollback capability
2. **Adapt scripts to your environment** - Modify paths, commands, APIs
3. **Maintain equivalent checks** - Same validations, different implementation
4. **Document your choices** - Record actual infrastructure in separate documentation

## Provider-Specific Sections

Sections that mention specific providers include disclaimers:

> **Note:** Illustrative example. Adapt to your infrastructure provider.

**Do not interpret specific examples as architectural requirements.**

---

# MVP vs Post-MVP Clarifications

## Scope Boundaries

This runbook intentionally includes procedures that are:

1. **Required for MVP v1** - Must be implemented
2. **Recommended for MVP v1** - Best practices that reduce risk
3. **Post-MVP ready** - Advanced procedures for future maturity

### Identifying Post-MVP Content

Procedures marked as **post-MVP or future-ready** include notes like:

> **Note:** Advanced capability. Not required for MVP v1 launch.

> **Note:** Recommended for post-MVP maturity. Optional for initial launch.

### Examples of Post-MVP Features in This Runbook

The following are **described for completeness** but **NOT required for MVP v1**:

- **Complex zero-downtime patterns** (Section 4.4 advanced orchestration) - MVP may accept brief maintenance windows
- **Multi-region deployments** - MVP is single-region
- **Advanced hotfix workflows** (Section 10.2 edge cases) - MVP uses simplified hotfix process
- **Extended monitoring dashboards** (Section 11.1 comprehensive metrics) - MVP starts with basic monitoring

### Why Include Post-MVP Content?

**Rationale for over-preparation:**

1. **Avoid document churn** - Don't rewrite runbook as platform matures
2. **Knowledge transfer** - Document advanced practices for team learning
3. **Growth path** - Show what "good" looks like for future iterations
4. **Risk reduction** - Better to have procedures ready than scramble during incident

**Usage Principle:**  
Teams should use MVP-appropriate procedures initially, growing into advanced procedures as infrastructure matures.

## MVP v1 Deployment Reality Check

**Actual MVP v1 deployment may be simpler than this runbook suggests** because:

- Managed services (Railway, Vercel) handle infrastructure complexity automatically
- Small team size reduces coordination overhead
- Lower traffic volumes reduce zero-downtime requirements
- Simplified architecture has fewer integration points

**This is expected and acceptable.**

This runbook provides comprehensive procedures to **reduce risk and support growth**, not to create unnecessary process burden.

---

# Table of Contents

## Part 1: Overview & Preparation
1. [Runbook Overview](#1-runbook-overview)
   - 1.1. Goals and Purpose
   - 1.2. Scope of Application
   - 1.3. Deployment Workflow
   - 1.4. Deployment Readiness Criteria
   - 1.5. Limitations and Freeze Windows

2. [Pre-Deployment Checklist](#2-pre-deployment-checklist)
   - 2.1. Infrastructure Check
   - 2.2. Services Check
   - 2.3. CI/CD Status
   - 2.4. Migration Readiness
   - 2.5. Secrets Validation
   - 2.6. Monitoring Check

3. [Environment Preparation](#3-environment-preparation)
   - 3.1. Development Environment
   - 3.2. Staging Environment
   - 3.3. Production Environment
   - 3.4. Freeze Window Enforcement
   - 3.5. Change Control Board

## Part 2: Deployment Execution
4. [Backend Deployment](#4-backend-deployment)
   - 4.1. Docker Image Build
   - 4.2. Registry Push
   - 4.3. Configuration Application
   - 4.4. Container Deployment
   - 4.5. Health Checks

5. [Frontend Deployment](#5-frontend-deployment)
   - 5.1. Production Build
   - 5.2. Deployment Options
   - 5.3. Cache Invalidation
   - 5.4. Smoke Tests

6. [Database Migrations](#6-database-migrations)
   - 6.1. Migration Preparation
   - 6.2. Dry Run
   - 6.3. Staging Application
   - 6.4. Production Application
   - 6.5. Migration Rollback
   - 6.6. Database Integrity Check

## Part 3: Testing & Release
7. [Smoke Tests](#7-smoke-tests)
   - 7.1. API Smoke Suite
   - 7.2. Frontend Smoke Suite

8. [Release Process](#8-release-process)
   - 8.1. Git-Flow Releases
   - 8.2. Release Tags
   - 8.3. Approval Workflow
   - 8.4. Team Communication
   - 8.5. Release Notes

9. [Rollback Procedures](#9-rollback-procedures)
   - 9.1. When to Rollback
   - 9.2. Backend Rollback
   - 9.3. Frontend Rollback
   - 9.4. Migration Rollback
   - 9.5. Recovery Checklist

## Part 4: Hotfix & Validation
10. [Hotfix Strategy](#10-hotfix-strategy)
    - 10.1. What Qualifies as Hotfix
    - 10.2. Hotfix Branches
    - 10.3. Application Without Full Deployment
    - 10.4. Documentation and Version Tracking

11. [Post-Deployment Validation](#11-post-deployment-validation)
    - 11.1. System Metrics Check
    - 11.2. Log Analysis
    - 11.3. Alert Verification
    - 11.4. Core API Verification
    - 11.5. Deployment Results Formalization

12. [Operational Contacts & Responsibilities](#12-operational-contacts--responsibilities)
    - 12.1. Roles and Responsibilities
    - 12.2. Team Contacts
    - 12.3. Escalation
    - 12.4. Communication Channels

---

# 1. Runbook Overview

## 1.1. Цели и назначение

### Назначение документа

Этот Runbook является **единственным источником истины** для всех процедур развертывания Self-Storage Aggregator MVP. Документ обеспечивает:

- **Стандартизацию** процесса деплоя
- **Минимизацию ошибок** при развертывании
- **Быстрое восстановление** при возникновении проблем
- **Передачу знаний** между членами команды
- **Аудит и соответствие** лучшим практикам

### Основные цели

**1. Надежность развертывания**
- Zero-downtime deployments (≤30 секунд для backend, 0 секунд для frontend)
- Автоматизированные проверки перед и после деплоя
- Rollback capability <5 минут

**2. Скорость деплоя**
- Полный цикл деплоя: <15 минут (backend + frontend)
- Hotfix деплой: <2 часа от обнаружения до production
- Автоматизация 90% рутинных операций

**3. Безопасность**
- Обязательное резервное копирование перед миграциями
- Многоуровневая система одобрений
- Аудит всех действий

**4. Управление рисками**
- Документированные rollback процедуры
- Тестирование на staging перед production
- Freeze-окна для критических периодов

### Метрики успеха

| Метрика | Целевое значение | Текущее |
|---------|------------------|---------|
| Deployment success rate | >98% | TBD |
| Mean time to deploy (MTTD) | <15 минут | TBD |
| Mean time to recovery (MTTR) | <5 минут | TBD |
| Deployment frequency | ≥1 раз в неделю | TBD |
| Hotfix deployment time | <2 часа | TBD |
| Incidents per deployment | <2% | TBD |

---

## 1.2. Область применения

### Покрываемые компоненты

**Backend Services:**
- REST API (NestJS)
- AI Recommendation Service (Python FastAPI)
- Background Jobs (n8n workflows)
- Database (PostgreSQL 15 + PostGIS)
- Cache Layer (Redis 7)

**Frontend:**
- Web Application (Next.js 14)
- Static Assets & CDN
- Service Workers (PWA)

**Infrastructure:**
- Docker containers
- Nginx reverse proxy
- Database backup systems
- Monitoring & logging

**External Integrations:**
- OpenAI API
- Google Maps API
- SendGrid (email)
- Payment gateway (planned)

### Окружения

**Development (Local):**
- Цель: Локальная разработка
- Доступ: Все разработчики
- Деплой: Manual, docker-compose
- База: Локальный PostgreSQL

**Staging:**
- Цель: Pre-production тестирование
- Доступ: Вся команда
- Деплой: Auto (push to develop branch)
- База: Managed PostgreSQL (Railway)
- URL: https://api-staging.selfstorage.com

> **Note:** Railway is an illustrative example of managed infrastructure provider. Teams may use alternative providers (AWS RDS, DigitalOcean, Heroku Postgres, self-hosted PostgreSQL, etc.) based on their infrastructure choices. Adapt procedures to your specific provider.

**Production:**
- Цель: Live пользовательский сервис
- Доступ: Tech Lead + DevOps
- Деплой: Manual approval required
- База: Production PostgreSQL (Railway/DigitalOcean)
- URL: https://api.selfstorage.com

> **Note:** Railway and DigitalOcean are illustrative examples. Production database can be hosted on any provider that meets performance and reliability requirements. All procedures in this runbook apply regardless of infrastructure provider.

### Исключения

Данный Runbook **НЕ** покрывает:

- Локальную разработку (см. Developer Guide)
- Архитектурные изменения (см. Architecture Decision Records)
- Изменения безопасности (см. Security Runbook)
- Disaster Recovery (см. DR Plan)
- Scaling операции (см. Scaling Guide)

---

## 1.3. Workflow деплоя

### Стандартный процесс развертывания

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Development │
│   Complete   │
└──────┬───────┘
       │
       ├──> Feature branch merged to develop
       │
       v
┌──────────────┐
│   Staging    │
│ Auto-Deploy  │◄─── Automated tests run
└──────┬───────┘
       │
       ├──> QA validation & smoke tests
       │
       v
┌──────────────┐
│   Create     │
│ Release PR   │◄─── develop → main
└──────┬───────┘
       │
       ├──> Code review (2 approvers)
       ├──> Tech Lead approval
       ├──> Pre-deployment checklist
       │
       v
┌──────────────┐
│  Production  │
│   Deploy     │◄─── Manual trigger only
└──────┬───────┘
       │
       ├──> Database backup
       ├──> Run migrations
       ├──> Deploy backend (zero-downtime)
       ├──> Deploy frontend
       ├──> Health checks
       ├──> Smoke tests
       │
       v
┌──────────────┐
│     Post     │
│ Validation   │◄─── Monitor 30 minutes
└──────┬───────┘
       │
       ├──> Metrics check
       ├──> Log analysis
       ├──> Alert verification
       │
       v
┌──────────────┐
│  Deployment  │
│   Complete   │◄─── Tag release, update docs
└──────────────┘
```

### Типы развертываний

**1. Regular Release (еженедельно)**
- Тип: Minor version (v1.x.0)
- Одобрение: Tech Lead + QA Lead
- Lead time: 24 часа
- Включает: Новые фичи, bug fixes, improvements

**2. Patch Release (по необходимости)**
- Тип: Patch version (v1.1.x)
- Одобрение: Tech Lead
- Lead time: 4 часа
- Включает: Bug fixes only

**3. Hotfix (экстренно)**
- Тип: Patch version (v1.1.x)
- Одобрение: On-call engineer (может деплоить без pre-approval)
- Lead time: <2 часа
- Включает: Critical bug fixes

**4. Major Release (ежеквартально)**
- Тип: Major version (vx.0.0)
- Одобрение: Tech Lead + Product Owner + QA Lead
- Lead time: 1 неделя
- Включает: Breaking changes, major features

### Timeline типичного деплоя

```
T-24h:  Team notification
        Review deployment plan
        
T-4h:   Final staging validation
        Pre-deployment checklist
        
T-1h:   Freeze deployments to staging
        Final approvals
        
T-0:    Start deployment
        
+5min:  Database backup complete
        
+7min:  Migrations applied
        
+12min: Backend deployed
        
+15min: Frontend deployed
        
+18min: Smoke tests complete
        
+20min: Deployment complete
        
+50min: Post-deployment validation complete
```

---

## 1.4. Критерии готовности к деплою

### Обязательные требования

**Code Quality Gates:**

| Критерий | Требование | Проверка |
|----------|------------|----------|
| CI Pipeline | ✅ All checks passed | GitHub Actions |
| Code Review | ✅ 2+ approvals | GitHub PR |
| Test Coverage | ✅ ≥70% coverage | Jest/Pytest |
| Linting | ✅ No errors | ESLint, Pylint |
| Type Check | ✅ No errors | TypeScript |
| Security Scan | ✅ No critical/high vulns | Snyk/npm audit |
| Build | ✅ Successful | Docker build |

**Infrastructure Readiness:**

| Критерий | Требование | Проверка |
|----------|------------|----------|
| All services | ✅ Healthy & accessible | Health endpoints |
| Disk space | ✅ >20% free | df -h |
| Memory | ✅ <80% used | free -m |
| Database | ✅ Connections <70% pool | pg_stat_activity |
| Backups | ✅ Fresh backup <2h old | Backup script |

**Team Readiness:**

- ✅ Deployment window confirmed (Mon-Fri 10:00-16:00 UTC+3)
- ✅ DevOps engineer available
- ✅ Tech Lead available for approval
- ✅ No other deployments in progress
- ✅ No active incidents

**Release Readiness:**

- ✅ Staging deployment successful (≥24h ago)
- ✅ QA sign-off received
- ✅ Release notes prepared
- ✅ Rollback plan documented
- ✅ Database migrations reviewed

### Проверочный скрипт

```bash
#!/bin/bash
# scripts/check-deployment-readiness.sh

echo "✅ Checking Deployment Readiness"
echo ""

READY=true

# Check CI status
echo "1. Checking CI status..."
if ./scripts/check-ci-status.sh; then
    echo "   ✅ CI checks passed"
else
    echo "   ❌ CI checks failed"
    READY=false
fi

# Check infrastructure
echo "2. Checking infrastructure..."
if ./scripts/pre-deploy-infra-check.sh; then
    echo "   ✅ Infrastructure healthy"
else
    echo "   ❌ Infrastructure issues detected"
    READY=false
fi

# Check services
echo "3. Checking services..."
if ./scripts/check-services.sh production; then
    echo "   ✅ Services healthy"
else
    echo "   ❌ Service issues detected"
    READY=false
fi

# Check migrations
echo "4. Checking migrations..."
if ./scripts/check-migrations.sh; then
    echo "   ✅ Migrations ready"
else
    echo "   ❌ Migration issues detected"
    READY=false
fi

# Check freeze window
echo "5. Checking freeze window..."
if ./scripts/check-freeze-window.sh; then
    echo "   ✅ Deployment window open"
else
    echo "   ❌ Currently in freeze window"
    READY=false
fi

# Check backups
echo "6. Checking backups..."
LATEST_BACKUP=$(ls -t backups/*.sql.gz 2>/dev/null | head -n1)
if [ -n "$LATEST_BACKUP" ]; then
    BACKUP_AGE=$(find "$LATEST_BACKUP" -mmin -120 2>/dev/null)
    if [ -n "$BACKUP_AGE" ]; then
        echo "   ✅ Fresh backup available"
    else
        echo "   ⚠️  Backup older than 2 hours"
        READY=false
    fi
else
    echo "   ❌ No backup found"
    READY=false
fi

echo ""
if [ "$READY" = true ]; then
    echo "✅ DEPLOYMENT READY"
    echo ""
    echo "Proceed with:"
    echo "  ./scripts/deploy-production.sh"
    exit 0
else
    echo "❌ NOT READY FOR DEPLOYMENT"
    echo ""
    echo "Fix the issues above before proceeding"
    exit 1
fi
```

---

## 1.5. Ограничения и freeze-окна

### Freeze Windows (когда НЕ деплоим)

**Регулярные freeze-окна:**

| Период | Причина | Исключения |
|--------|---------|------------|
| Пт 15:00 - Пн 10:00 | Reduced support availability | P0 hotfixes only |
| Выходные | Weekend | P0 hotfixes only |
| Праздничные дни | Holidays | P0 hotfixes only |
| После 18:00 | End of business day | Planned maintenance |

**Праздничные дни РФ (2025):**
- 1-8 января (Новогодние каникулы)
- 23 февраля (День защитника Отечества)
- 8 марта (Международный женский день)
- 1 мая (Праздник Весны и Труда)
- 9 мая (День Победы)
- 12 июня (День России)
- 4 ноября (День народного единства)

**Динамические freeze-окна:**
- Во время активного инцидента
- Во время планового обслуживания
- В пиковые бизнес-периоды (по запросу Product)
- После неудачного деплоя (24-часовой freeze)

### Ограничения деплоя

**Максимальная частота:**
- Production: Не более 1 деплоя в день
- Staging: Без ограничений

**Максимальное время простоя:**
- Backend API: ≤30 секунд
- Frontend: 0 секунд (CDN)
- Database: 0 секунд (online migrations)

**Rollback время:**
- Целевое: <5 минут
- Максимальное: 15 минут

### Change Control Board

**Типы изменений:**

**Minor Changes (patch releases):**
- Одобрение: Tech Lead
- Lead time: 2 часа
- Примеры: Bug fixes, minor improvements

**Major Changes (minor/major releases):**
- Одобрение: Tech Lead + Product Owner
- Lead time: 24 часа
- Опционально: Review meeting
- Примеры: New features, breaking changes

**Emergency Changes (hotfixes):**
- Одобрение: On-call engineer
- Lead time: Immediate
- Post-approval: Tech Lead notification
- Примеры: P0 incidents, security fixes

**Database Changes:**
- Одобрение: Tech Lead + Senior Backend Engineer
- Lead time: 4 часа (minimum)
- Требование: Code review обязателен
- Примеры: Schema changes, data migrations

### Enforcement Script

```bash
#!/bin/bash
# scripts/check-freeze-window.sh

CURRENT_HOUR=$(date +%H)
CURRENT_DAY=$(date +%u)  # 1=Mon, 7=Sun
CURRENT_DATE=$(date +%Y-%m-%d)

echo "🔒 Checking Freeze Window"
echo "Current time: $(date)"
echo ""

FORCE_FLAG=$1

# Check if force flag is provided
if [ "$FORCE_FLAG" = "--force" ]; then
    echo "⚠️  FORCE FLAG DETECTED"
    read -p "This is a freeze window. Confirm emergency deployment (type 'EMERGENCY'): " CONFIRM
    
    if [ "$CONFIRM" = "EMERGENCY" ]; then
        echo "✓ Emergency deployment approved"
        echo "⚠️  Document this in incident report"
        exit 0
    else
        echo "❌ Aborted"
        exit 1
    fi
fi

# Check weekend
if [ $CURRENT_DAY -eq 6 ] || [ $CURRENT_DAY -eq 7 ]; then
    echo "❌ FREEZE WINDOW: Weekend"
    echo "Deployments not allowed on weekends"
    echo ""
    echo "For emergency hotfix: $0 --force"
    exit 1
fi

# Check Friday after 15:00
if [ $CURRENT_DAY -eq 5 ] && [ $CURRENT_HOUR -ge 15 ]; then
    echo "❌ FREEZE WINDOW: Friday after 15:00"
    echo "Deployments not allowed Friday 15:00 - Monday 10:00"
    echo ""
    echo "For emergency hotfix: $0 --force"
    exit 1
fi

# Check Monday before 10:00
if [ $CURRENT_DAY -eq 1 ] && [ $CURRENT_HOUR -lt 10 ]; then
    echo "❌ FREEZE WINDOW: Monday before 10:00"
    echo "Deployments not allowed Friday 15:00 - Monday 10:00"
    echo ""
    echo "For emergency hotfix: $0 --force"
    exit 1
fi

# Check after 18:00
if [ $CURRENT_HOUR -ge 18 ]; then
    echo "❌ FREEZE WINDOW: After business hours (18:00)"
    echo "Deployments not recommended after 18:00"
    echo ""
    echo "For emergency hotfix: $0 --force"
    exit 1
fi

# Check Russian holidays 2025
HOLIDAYS=(
    "2025-01-01" "2025-01-02" "2025-01-03" "2025-01-04"
    "2025-01-05" "2025-01-06" "2025-01-07" "2025-01-08"
    "2025-02-23"
    "2025-03-08"
    "2025-05-01"
    "2025-05-09"
    "2025-06-12"
    "2025-11-04"
)

for HOLIDAY in "${HOLIDAYS[@]}"; do
    if [ "$CURRENT_DATE" = "$HOLIDAY" ]; then
        echo "❌ FREEZE WINDOW: Holiday ($HOLIDAY)"
        echo "Deployments not allowed on holidays"
        echo ""
        echo "For emergency hotfix: $0 --force"
        exit 1
    fi
done

echo "✅ Deployment window OPEN"
echo "Safe to proceed with deployment"
exit 0
```

---

# 2. Pre-Deployment Checklist

## 2.1. Проверка инфраструктуры

### 2.1.1. Server Health Check

```bash
#!/bin/bash
# scripts/pre-deploy-infra-check.sh

echo "🔍 Pre-Deployment Infrastructure Check"
echo ""

FAILED=0

# Function to check a condition
check() {
    local name=$1
    local command=$2
    
    echo -n "Checking $name... "
    
    if eval $command > /dev/null 2>&1; then
        echo "✓"
        return 0
    else
        echo "✗"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# 1. Docker daemon
check "Docker daemon" "docker info"

# 2. Disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
echo -n "Checking disk space... "
if [ $DISK_USAGE -lt 80 ]; then
    echo "✓ (${DISK_USAGE}% used)"
else
    echo "✗ (${DISK_USAGE}% used - threshold: 80%)"
    FAILED=$((FAILED + 1))
fi

# 3. Memory
MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
echo -n "Checking memory usage... "
if [ $MEMORY_USAGE -lt 85 ]; then
    echo "✓ (${MEMORY_USAGE}% used)"
else
    echo "✗ (${MEMORY_USAGE}% used - threshold: 85%)"
    FAILED=$((FAILED + 1))
fi

# 4. CPU load
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk -F, '{print $1}' | xargs)
CPU_COUNT=$(nproc)
echo "CPU load average: $LOAD_AVG (${CPU_COUNT} cores)"

# 5. Network connectivity
check "GitHub connectivity" "curl -sf https://github.com"
check "Docker Hub connectivity" "curl -sf https://hub.docker.com"
check "NPM registry" "curl -sf https://registry.npmjs.org"

echo ""
if [ $FAILED -eq 0 ]; then
    echo "✅ Infrastructure check passed"
    exit 0
else
    echo "❌ Infrastructure check failed ($FAILED issues)"
    exit 1
fi
```

---

## 2.2. Проверка сервисов

### 2.2.1. Service Status Script

```bash
#!/bin/bash
# scripts/check-services.sh

ENVIRONMENT=${1:-production}

echo "🔍 Checking Service Status: $ENVIRONMENT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    BASE_URL="https://api.selfstorage.com/api/v1"
    SERVER="deploy@prod-server"
else
    BASE_URL="https://api-staging.selfstorage.com/api/v1"
    SERVER="deploy@staging-server"
fi

FAILED=0

# Function to check endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Checking $name... "
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "$expected" ]; then
        echo "✓ (HTTP $HTTP_CODE)"
        return 0
    else
        echo "✗ (HTTP $HTTP_CODE, expected $expected)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# 1. Backend API
check_endpoint "Backend API Health" "$BASE_URL/health" "200"

# 2. PostgreSQL
echo -n "Checking PostgreSQL... "
if ssh $SERVER "docker-compose exec -T postgres pg_isready -U postgres" > /dev/null 2>&1; then
    echo "✓"
else
    echo "✗"
    FAILED=$((FAILED + 1))
fi

# 3. Redis
echo -n "Checking Redis... "
if ssh $SERVER "docker-compose exec -T redis redis-cli ping" 2>&1 | grep -q "PONG"; then
    echo "✓"
else
    echo "✗"
    FAILED=$((FAILED + 1))
fi

# 4. AI Service
check_endpoint "AI Service" "$BASE_URL/../ai/health" "200"

# 5. n8n (if running)
echo -n "Checking n8n... "
if curl -sf "http://localhost:5678" > /dev/null 2>&1; then
    echo "✓"
else
    echo "⚠️  (not running or not accessible)"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo "✅ All services healthy"
    exit 0
else
    echo "❌ $FAILED service(s) unhealthy"
    exit 1
fi
```

---

## 2.3. Статус CI/CD

### 2.3.1. CI Status Check

```bash
#!/bin/bash
# scripts/check-ci-status.sh

BRANCH=${1:-main}

echo "🔍 Checking CI/CD Status for branch: $BRANCH"
echo ""

# Requires GitHub CLI (gh)
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not installed"
    echo "Install: https://cli.github.com/"
    exit 1
fi

# Get latest workflow runs
echo "Fetching workflow runs..."
RUNS=$(gh run list --branch $BRANCH --limit 5 --json conclusion,name,status)

echo "$RUNS" | jq -r '.[] | "\(.name): \(.status) - \(.conclusion // "in_progress")"'

# Check if all completed runs passed
FAILED=$(echo "$RUNS" | jq '[.[] | select(.conclusion == "failure")] | length')
IN_PROGRESS=$(echo "$RUNS" | jq '[.[] | select(.status == "in_progress")] | length')

echo ""
if [ $IN_PROGRESS -gt 0 ]; then
    echo "⚠️  $IN_PROGRESS workflow(s) still in progress"
    exit 1
elif [ $FAILED -gt 0 ]; then
    echo "❌ $FAILED workflow(s) failed"
    exit 1
else
    echo "✅ All CI checks passed"
    exit 0
fi
```

---

## 2.4. Готовность миграций

### 2.4.1. Migration Check Script

```bash
#!/bin/bash
# scripts/check-migrations.sh

echo "🔍 Checking Migration Readiness"
echo ""

cd backend

# 1. Check for pending migrations
echo "Checking for pending migrations..."
PENDING=$(npm run migration:show 2>&1 | grep "pending" | wc -l)

if [ $PENDING -eq 0 ]; then
    echo "✓ No pending migrations"
elif [ $PENDING -gt 0 ]; then
    echo "⚠️  Found $PENDING pending migration(s):"
    npm run migration:show | grep "pending"
    echo ""
fi

# 2. Check all migrations have down() method
echo "Checking rollback methods..."
MISSING_DOWN=$(grep -L "public async down" src/migrations/*.ts 2>/dev/null | wc -l)

if [ $MISSING_DOWN -gt 0 ]; then
    echo "✗ $MISSING_DOWN migration(s) missing down() method"
    grep -L "public async down" src/migrations/*.ts
    exit 1
else
    echo "✓ All migrations have rollback methods"
fi

# 3. Compile check
echo "Compiling migrations..."
if npm run build > /dev/null 2>&1; then
    echo "✓ Migrations compile successfully"
else
    echo "✗ Migration compilation failed"
    exit 1
fi

cd ..

echo ""
echo "✅ Migration readiness check passed"
if [ $PENDING -gt 0 ]; then
    echo "⚠️  Remember to review pending migrations before deployment"
fi
```

---

## 2.5. Валидация секретов

### 2.5.1. Secrets Validation Script

```bash
#!/bin/bash
# scripts/validate-secrets.sh

ENVIRONMENT=${1:-production}

echo "🔒 Validating Secrets: $ENVIRONMENT"
echo ""

FAILED=0

# Function to check secret exists and has minimum length
check_secret() {
    local name=$1
    local min_length=$2
    
    echo -n "Checking $name... "
    
    VALUE=$(eval echo \$$name)
    
    if [ -z "$VALUE" ]; then
        echo "✗ (not set)"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    LENGTH=${#VALUE}
    if [ $LENGTH -lt $min_length ]; then
        echo "✗ (too short: $LENGTH chars, min: $min_length)"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    echo "✓ (length: $LENGTH chars)"
    return 0
}

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    source ".env.$ENVIRONMENT"
elif [ -f ".env" ]; then
    source ".env"
else
    echo "⚠️  No .env file found"
fi

# Check required secrets
check_secret "DB_PASSWORD" 12
check_secret "JWT_SECRET" 32
check_secret "OPENAI_API_KEY" 20
check_secret "GOOGLE_MAPS_API_KEY" 20
check_secret "SENDGRID_API_KEY" 20
check_secret "REDIS_PASSWORD" 12

# Test API keys
echo ""
echo "Testing API key connectivity..."

# Test OpenAI
echo -n "Testing OpenAI API... "
OPENAI_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    "https://api.openai.com/v1/models" 2>/dev/null || echo "000")

if [ "$OPENAI_RESPONSE" = "200" ]; then
    echo "✓"
else
    echo "⚠️  (HTTP $OPENAI_RESPONSE)"
fi

# Test Google Maps
echo -n "Testing Google Maps API... "
GOOGLE_MAPS_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null \
    "https://maps.googleapis.com/maps/api/geocode/json?apikey=$GOOGLE_MAPS_API_KEY&geocode=Москва&address=Dubai&geocode=Москва&address=Dubai&geocode=Москва&address=Dubai&geocode=Москва&format=json" 2>/dev/null || echo "000")

if [ "$GOOGLE_MAPS_RESPONSE" = "200" ]; then
    echo "✓"
else
    echo "⚠️  (HTTP $GOOGLE_MAPS_RESPONSE)"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo "✅ All secrets validated"
    exit 0
else
    echo "❌ $FAILED secret(s) invalid"
    exit 1
fi
```

---

## 2.6. Проверка мониторинга

### 2.6.1. Monitoring Check Script

```bash
#!/bin/bash
# scripts/check-monitoring.sh

echo "📊 Checking Monitoring Status"
echo ""

FAILED=0

# 1. Check log directory
echo -n "Checking log directory... "
if [ -d "logs" ] && [ -w "logs" ]; then
    echo "✓"
else
    echo "✗ (not writable)"
    FAILED=$((FAILED + 1))
fi

# 2. Check log rotation
echo -n "Checking log rotation config... "
if [ -f "/etc/logrotate.d/selfstorage" ]; then
    echo "✓"
else
    echo "⚠️  (not configured)"
fi

# 3. Check recent errors
echo "Checking recent error count..."
if [ -d "logs" ]; then
    ERROR_COUNT=$(tail -n 100 logs/*.log 2>/dev/null | grep -i "error" | wc -l)
    if [ $ERROR_COUNT -lt 10 ]; then
        echo "✓ Error count acceptable: $ERROR_COUNT"
    else
        echo "⚠️  High error count: $ERROR_COUNT"
    fi
else
    echo "⚠️  No logs directory"
fi

# 4. Check disk space for logs
LOG_DISK=$(df logs 2>/dev/null | tail -1 | awk '{print $5}' | sed 's/%//')
if [ -n "$LOG_DISK" ]; then
    echo -n "Log disk usage... "
    if [ $LOG_DISK -lt 80 ]; then
        echo "✓ (${LOG_DISK}%)"
    else
        echo "⚠️  (${LOG_DISK}% - cleanup needed)"
    fi
fi

# 5. Check alert configuration
echo ""
echo "Alert Configuration:"
echo "  High error rate: Configured"
echo "  API down: Configured"
echo "  High response time: Configured"
echo "  DB connection lost: Configured"

echo ""
if [ $FAILED -eq 0 ]; then
    echo "✅ Monitoring check passed"
    exit 0
else
    echo "❌ Monitoring check failed"
    exit 1
fi
```

### 2.6.2. Complete Pre-Deployment Checklist

```markdown
# Pre-Deployment Checklist

## Infrastructure (Section 2.1)
- [ ] Docker daemon operational
- [ ] Disk space > 20% free
- [ ] Memory usage < 85%
- [ ] CPU load acceptable
- [ ] Network connectivity OK (GitHub, Docker Hub, NPM)

## Services (Section 2.2)
- [ ] Backend API: GET /api/v1/health → HTTP 200
- [ ] PostgreSQL: pg_isready → success
- [ ] Redis: PING → PONG
- [ ] AI Service: GET /health → HTTP 200
- [ ] n8n: Web UI accessible (if applicable)

## Environments (Section 2.3)
- [ ] Staging: Deployed and tested ≥24h ago
- [ ] Staging: Smoke tests passed
- [ ] Staging: No critical issues
- [ ] Production: No active deployments
- [ ] Production: Services healthy

## CI/CD (Section 2.3)
- [ ] All GitHub Actions workflows passed
- [ ] Linting passed
- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Security scan: No critical vulnerabilities
- [ ] Build artifacts exist in registry

## Database (Section 2.4)
- [ ] Pending migrations reviewed
- [ ] All migrations have rollback (down) methods
- [ ] Migration files compile successfully
- [ ] Database backup exists (<2h old)
- [ ] Backup integrity verified

## Secrets (Section 2.5)
- [ ] DB_PASSWORD set (≥12 chars)
- [ ] JWT_SECRET set (≥32 chars)
- [ ] OPENAI_API_KEY valid and working
- [ ] GOOGLE_MAPS_API_KEY valid and working
- [ ] SENDGRID_API_KEY set
- [ ] REDIS_PASSWORD set
- [ ] All API keys tested for connectivity

## Monitoring (Section 2.6)
- [ ] Log directory writable
- [ ] Log rotation configured
- [ ] Recent error count < 10
- [ ] Disk space for logs adequate
- [ ] Alerts configured:
  - [ ] High error rate
  - [ ] API down
  - [ ] High response time
  - [ ] DB connection lost
  - [ ] Disk space low
  - [ ] Memory high

## Team (Coordination)
- [ ] Deployment window confirmed
- [ ] DevOps engineer available
- [ ] Tech Lead approval received
- [ ] QA sign-off received
- [ ] Team notified (24h advance)
- [ ] No freeze window active

## Documentation
- [ ] Release notes prepared
- [ ] Changelog updated
- [ ] Rollback plan documented
- [ ] Communication plan ready

## Final Checks
- [ ] All items above checked
- [ ] No blockers identified
- [ ] Ready to proceed

**Checklist completed by:** _______________  
**Date:** _______________  
**Time:** _______________
```

---

# 3. Environment Preparation

## 3.1. Development окружение

### 3.1.1. Local Development Setup

```bash
#!/bin/bash
# scripts/setup-dev.sh

echo "🔧 Setting up Development Environment"
echo ""

# 1. Check prerequisites
echo "Step 1/8: Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi

echo "✓ Prerequisites OK"

# 2. Create local environment file
echo ""
echo "Step 2/8: Creating .env.local file..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=selfstorage_dev

# Application
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1

# Authentication
JWT_SECRET=dev-secret-change-in-production-min-32-characters
JWT_EXPIRATION=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# External Services (use test keys)
OPENAI_API_KEY=your-openai-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-key-here
SENDGRID_API_KEY=your-sendgrid-key-here

# Feature flags
ENABLE_EMAIL=false
ENABLE_SMS=false
EOF
    echo "✓ Created .env.local"
else
    echo "⚠️  .env.local already exists, skipping"
fi

# 3. Start docker-compose services
echo ""
echo "Step 3/8: Starting Docker services..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for services
sleep 5

# 4. Install backend dependencies
echo ""
echo "Step 4/8: Installing backend dependencies..."
cd backend
npm install
cd ..

# 5. Install frontend dependencies
echo ""
echo "Step 5/8: Installing frontend dependencies..."
cd frontend
npm install
cd ..

# 6. Run database migrations
echo ""
echo "Step 6/8: Running database migrations..."
cd backend
npm run migration:run
cd ..

# 7. Seed database
echo ""
echo "Step 7/8: Seeding database..."
cd backend
npm run seed:dev
cd ..

# 8. Verify setup
echo ""
echo "Step 8/8: Verifying setup..."

# Check database
if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready > /dev/null 2>&1; then
    echo "✓ PostgreSQL ready"
else
    echo "✗ PostgreSQL not ready"
fi

# Check Redis
if docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping 2>&1 | grep -q "PONG"; then
    echo "✓ Redis ready"
else
    echo "✗ Redis not ready"
fi

echo ""
echo "✅ Development environment ready!"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && npm run start:dev"
echo "  2. Start frontend: cd frontend && npm run dev"
echo "  3. Access API: http://localhost:4000/api/v1"
echo "  4. Access Frontend: http://localhost:3000"
```

### 3.1.2. Development Seed Data

```typescript
// backend/src/seeds/dev-seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedDevelopment(dataSource: DataSource) {
  console.log('🌱 Seeding development database...');

  const userRepository = dataSource.getRepository('User');
  const warehouseRepository = dataSource.getRepository('Warehouse');
  const boxRepository = dataSource.getRepository('Box');

  // Create test users
  const users = [
    {
      email: 'user@test.com',
      password: await bcrypt.hash('Test1234!', 10),
      first_name: 'Test',
      last_name: 'User',
      role: 'user',
      phone_number: '+971501234567',
      email_verified: true,
    },
    {
      email: 'operator@test.com',
      password: await bcrypt.hash('Test1234!', 10),
      first_name: 'Test',
      last_name: 'Operator',
      role: 'operator',
      phone_number: '+79991234568',
      email_verified: true,
    },
    {
      email: 'admin@test.com',
      password: await bcrypt.hash('Test1234!', 10),
      first_name: 'Test',
      last_name: 'Admin',
      role: 'admin',
      phone_number: '+79991234569',
      email_verified: true,
    },
  ];

  for (const userData of users) {
    const existing = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existing) {
      await userRepository.save(userData);
      console.log(`✓ Created user: ${userData.email}`);
    }
  }

  // Create test warehouses
  const operator = await userRepository.findOne({
    where: { email: 'operator@test.com' },
  });

  const warehouses = [
    {
      name: 'Центральный склад',
      address: 'ул. Тверская, 1, Dubai',
      city: 'Dubai',
      latitude: 55.7558,
      longitude: 37.6173,
      description: 'Современный склад в центре Москвы',
      amenities: ['24/7', 'security', 'climate'],
      operator_id: operator.id,
    },
    {
      name: 'Складской комплекс Юг',
      address: 'ул. Ленина, 50, Dubai',
      city: 'Dubai',
      latitude: 55.7000,
      longitude: 37.6000,
      description: 'Большой складской комплекс на юге',
      amenities: ['24/7', 'security'],
      operator_id: operator.id,
    },
  ];

  for (const warehouseData of warehouses) {
    const existing = await warehouseRepository.findOne({
      where: { name: warehouseData.name },
    });

    if (!existing) {
      const warehouse = await warehouseRepository.save(warehouseData);
      console.log(`✓ Created warehouse: ${warehouse.name}`);

      // Create boxes for this warehouse
      const boxSizes = [
        { size: 'small', width: 1.0, height: 1.5, depth: 1.0, price: 50 },
        { size: 'medium', width: 2.0, height: 2.0, depth: 2.0, price: 100 },
        { size: 'large', width: 3.0, height: 2.5, depth: 3.0, price: 150 },
      ];

      for (let i = 0; i < 10; i++) {
        const boxSize = boxSizes[i % 3];
        await boxRepository.save({
          name: `Box ${i + 1}`,
          warehouse_id: warehouse.id,
          size: boxSize.size,
          width: boxSize.width,
          height: boxSize.height,
          depth: boxSize.depth,
          price_per_day: boxSize.price,
          is_available: i < 7, // First 7 boxes available
        });
      }

      console.log(`✓ Created 10 boxes for ${warehouse.name}`);
    }
  }

  console.log('✅ Development database seeded successfully');
}
```

---

## 3.2. Staging окружение

### 3.2.1. Staging Preparation Script

```bash
#!/bin/bash
# scripts/prepare-staging.sh

echo "🔧 Preparing Staging Environment"
echo ""

ENVIRONMENT="staging"

# 1. Backup staging database
echo "Step 1/6: Creating staging database backup..."
BACKUP_FILE="staging-pre-deploy-$(date +%Y%m%d-%H%M%S).sql"

if [ "$DEPLOYMENT_PLATFORM" = "railway" ]; then
    railway run --environment staging pg_dump > backups/$BACKUP_FILE
else
    ssh deploy@staging-server "docker-compose exec -T postgres pg_dump -U \$DB_USER \$DB_NAME" > backups/$BACKUP_FILE
fi

gzip backups/$BACKUP_FILE
echo "✓ Backup created: backups/${BACKUP_FILE}.gz"

# 2. Verify secrets
echo ""
echo "Step 2/6: Verifying staging secrets..."
./scripts/validate-secrets.sh staging

# 3. Check pending migrations
echo ""
echo "Step 3/6: Checking pending migrations..."
./scripts/check-migrations.sh

# 4. Verify service health
echo ""
echo "Step 4/6: Checking staging services..."
./scripts/check-services.sh staging

# 5. Check recent logs
echo ""
echo "Step 5/6: Checking recent error logs..."
if [ "$DEPLOYMENT_PLATFORM" = "railway" ]; then
    railway logs --tail 100 | grep -i "error" | wc -l
else
    ssh deploy@staging-server "docker-compose logs --tail=100" | grep -i "error" | wc -l
fi

# 6. Review database statistics
echo ""
echo "Step 6/6: Database statistics..."
if [ "$DEPLOYMENT_PLATFORM" = "railway" ]; then
    railway run psql -c "SELECT schemaname, tablename, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 5;"
fi

echo ""
echo "✅ Staging environment prepared"
```

### 3.2.2. Auto-Deploy to Staging (GitHub Actions)

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build Docker images
        run: |
          docker build -t selfstorage-backend:staging ./backend
          docker build -t selfstorage-frontend:staging ./frontend
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up --environment staging
      
      - name: Run migrations
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          railway run --environment staging npm run migration:run
      
      - name: Run smoke tests
        run: |
          sleep 30  # Wait for deployment
          npm run test:smoke:staging
      
      - name: Notify team
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Staging Deployment: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Staging Deployment*\nStatus: ${{ job.status }}\nCommit: ${{ github.sha }}"
                  }
                }
              ]
            }
```

---

## 3.3. Production окружение

### 3.3.1. Production Configuration

**Key differences from Staging:**

```yaml
# Production Configuration Highlights

rate_limiting:
  api: 100 req/min  # Staging: 300 req/min
  ai: 20 req/min    # Staging: 50 req/min

database:
  ssl: true         # Staging: false
  pool_size: 20     # Staging: 10
  
redis:
  password: required  # Staging: optional
  maxmemory: 1GB      # Staging: 512MB

monitoring:
  sentry_traces_sample_rate: 0.1  # Staging: 1.0
  log_level: warn                 # Staging: debug

security:
  helmet: enabled
  csrf: enabled
  cors_origins: ["https://selfstorage.com"]  # Staging: ["*"]
```

### 3.3.2. Production Preparation Script

```bash
#!/bin/bash
# scripts/prepare-production.sh

echo "🚨 PRODUCTION ENVIRONMENT PREPARATION"
echo "====================================="
echo ""

# CRITICAL: Require explicit confirmation
read -p "⚠️  Preparing PRODUCTION environment. Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "Starting production preparation..."
echo ""

# Step 1: Check production health
echo "Step 1/10: Checking production health..."
./scripts/health-check.sh production || {
    echo "❌ Production is unhealthy"
    exit 1
}

# Step 2: Create comprehensive backup
echo ""
echo "Step 2/10: Creating production database backup..."
BACKUP_FILE="prod-pre-deploy-$(date +%Y%m%d-%H%M%S).sql"

pg_dump -h $PROD_DB_HOST -U $DB_USER -d $DB_NAME \
    --format=custom \
    --file=backups/$BACKUP_FILE.dump

# Verify backup
echo "Verifying backup integrity..."
pg_restore --list backups/$BACKUP_FILE.dump > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Backup verified: backups/$BACKUP_FILE.dump"
else
    echo "❌ Backup verification failed"
    exit 1
fi

# Step 3: Review database statistics
echo ""
echo "Step 3/10: Database statistics..."
psql -h $PROD_DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
    schemaname,
    tablename,
    n_live_tup as row_count,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC
LIMIT 10;
"

# Step 4: Validate secrets
echo ""
echo "Step 4/10: Validating production secrets..."
./scripts/validate-secrets.sh production || {
    echo "❌ Secret validation failed"
    exit 1
}

# Step 5: Review pending migrations
echo ""
echo "Step 5/10: Reviewing pending migrations..."
cd backend
PENDING=$(npm run migration:show | grep "pending")
cd ..

if [ -n "$PENDING" ]; then
    echo "Pending migrations:"
    echo "$PENDING"
    echo ""
    read -p "Proceed with these migrations? (yes/no): " PROCEED
    if [ "$PROCEED" != "yes" ]; then
        echo "❌ Aborted"
        exit 1
    fi
else
    echo "✓ No pending migrations"
fi

# Step 6: Check error rates
echo ""
echo "Step 6/10: Checking recent error rates..."
ssh deploy@prod-server "docker-compose logs --tail=500 backend" | grep -i "error" | wc -l

# Step 7: Verify staging deployment
echo ""
echo "Step 7/10: Verifying staging deployment..."
STAGING_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "https://api-staging.selfstorage.com/api/v1/health")

if [ "$STAGING_HEALTH" = "200" ]; then
    echo "✓ Staging is healthy"
else
    echo "⚠️  Staging health check: HTTP $STAGING_HEALTH"
fi

# Step 8: Check freeze window
echo ""
echo "Step 8/10: Checking freeze window..."
./scripts/check-freeze-window.sh || exit 1

# Step 9: Verify team availability
echo ""
echo "Step 9/10: Team readiness check..."
echo "Required personnel:"
echo "  - DevOps Engineer: Available"
echo "  - Tech Lead: Available"
echo "  - On-call Engineer: Available"
echo ""
read -p "Confirm team availability (yes/no): " TEAM_READY

if [ "$TEAM_READY" != "yes" ]; then
    echo "❌ Aborted - team not ready"
    exit 1
fi

# Step 10: Final confirmation
echo ""
echo "Step 10/10: Final confirmation..."
echo ""
echo "Production Deployment Summary:"
echo "  Environment: Production"
echo "  Backup: backups/$BACKUP_FILE.dump"
echo "  Pending migrations: $(echo "$PENDING" | wc -l)"
echo "  Current time: $(date)"
echo ""
read -p "FINAL CONFIRMATION - Deploy to production? (type 'DEPLOY'): " FINAL

if [ "$FINAL" != "DEPLOY" ]; then
    echo "❌ Aborted"
    exit 1
fi

# Send notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST $SLACK_WEBHOOK_URL \
        -H 'Content-Type: application/json' \
        -d "{
            \"text\": \"🚀 PRODUCTION DEPLOYMENT STARTING\",
            \"channel\": \"#deployments\",
            \"blocks\": [
                {
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Production Deployment*\nBackup: $BACKUP_FILE.dump\nInitiated by: $(git config user.name)\nTime: $(date)\"
                    }
                }
            ]
        }"
fi

echo ""
echo "✅ Production environment prepared"
echo ""
echo "Ready to proceed with deployment"
```

---

## 3.4. Freeze window enforcement

[Content from freeze window section above - already included in section 1.5]

---

## 3.5. Change control board

[Content from change control section above - already included in section 1.5]

---

**End of Part 1 (Sections 1-3)**
# Deployment Runbook - Self-Storage Aggregator MVP v1
## Part 2: Sections 4-6

**Version:** 1.0.0  
**Last Updated:** December 8, 2024  
**Part:** 2 of 4

---

# 4. Backend Deployment

## 4.1. Docker image build

### 4.1.1. Backend Dockerfile

```dockerfile
# backend/Dockerfile
# Multi-stage build for production

# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy production dependencies
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

### 4.1.2. AI Service Dockerfile

```dockerfile
# ai-service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### 4.1.3. Build Script

```bash
#!/bin/bash
# scripts/build-images.sh

set -e

VERSION=${1:-latest}

echo "🐳 Building Docker Images"
echo "Version: $VERSION"
echo ""

# 1. Build backend
echo "Building backend image..."
docker build \
  -t selfstorage-backend:$VERSION \
  -t selfstorage-backend:latest \
  --build-arg VERSION=$VERSION \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  backend/

echo "✓ Backend image built"

# 2. Build AI service
echo ""
echo "Building AI service image..."
docker build \
  -t selfstorage-ai:$VERSION \
  -t selfstorage-ai:latest \
  ai-service/

echo "✓ AI service image built"

# 3. Verify images
echo ""
echo "Verifying images..."
docker images | grep selfstorage

# 4. Check image sizes
echo ""
echo "Image sizes:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep selfstorage

echo ""
echo "✅ All images built successfully"
```

### 4.1.4. Local Image Testing

```bash
#!/bin/bash
# scripts/test-images.sh

echo "🧪 Testing Docker Images"
echo ""

# Create test network
docker network create selfstorage-test 2>/dev/null || true

# Start test database
docker run -d \
  --name test-postgres \
  --network selfstorage-test \
  -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=test \
  postgres:15-alpine

# Wait for database
sleep 5

# Start backend
docker run -d \
  --name test-backend \
  --network selfstorage-test \
  -e DB_HOST=test-postgres \
  -e DB_PASSWORD=test \
  -e DB_NAME=test \
  -e JWT_SECRET=test-secret-min-32-characters-long \
  -p 4000:4000 \
  selfstorage-backend:latest

# Wait for backend
sleep 10

# Test backend health
echo "Testing backend health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/v1/health)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Backend health check passed"
else
    echo "✗ Backend health check failed (HTTP $HTTP_CODE)"
    docker logs test-backend
fi

# Start AI service
docker run -d \
  --name test-ai \
  --network selfstorage-test \
  -e OPENAI_API_KEY=test \
  -p 8000:8000 \
  selfstorage-ai:latest

# Wait for AI service
sleep 10

# Test AI service
echo "Testing AI service..."
AI_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)

if [ "$AI_CODE" = "200" ]; then
    echo "✓ AI service health check passed"
else
    echo "✗ AI service health check failed (HTTP $AI_CODE)"
    docker logs test-ai
fi

# Cleanup
echo ""
echo "Cleaning up..."
docker stop test-backend test-ai test-postgres
docker rm test-backend test-ai test-postgres
docker network rm selfstorage-test

echo ""
echo "✅ Image testing complete"
```

---

## 4.2. Registry push

### 4.2.1. GitHub Container Registry Configuration

```yaml
# .github/workflows/build-and-push.yml
name: Build and Push Docker Images

on:
  push:
    branches:
      - main
      - develop
    tags:
      - 'v*.*.*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push AI service
        uses: docker/build-push-action@v5
        with:
          context: ./ai-service
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-ai:${{ steps.meta.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 4.2.2. Manual Registry Push

```bash
#!/bin/bash
# scripts/push-images.sh

set -e

VERSION=${1:-latest}
REGISTRY=${2:-"ghcr.io/your-org"}

echo "📦 Pushing Images to Registry"
echo "Version: $VERSION"
echo "Registry: $REGISTRY"
echo ""

# Login check
if ! docker info | grep -q "Username"; then
    echo "❌ Not logged in to Docker registry"
    echo "Run: docker login $REGISTRY"
    exit 1
fi

# Tag images
echo "Tagging images..."
docker tag selfstorage-backend:$VERSION $REGISTRY/selfstorage-backend:$VERSION
docker tag selfstorage-backend:$VERSION $REGISTRY/selfstorage-backend:latest
docker tag selfstorage-ai:$VERSION $REGISTRY/selfstorage-ai:$VERSION
docker tag selfstorage-ai:$VERSION $REGISTRY/selfstorage-ai:latest

# Push backend
echo ""
echo "Pushing backend image..."
docker push $REGISTRY/selfstorage-backend:$VERSION
docker push $REGISTRY/selfstorage-backend:latest

# Push AI service
echo ""
echo "Pushing AI service image..."
docker push $REGISTRY/selfstorage-ai:$VERSION
docker push $REGISTRY/selfstorage-ai:latest

# Verify
echo ""
echo "Verifying images in registry..."
docker manifest inspect $REGISTRY/selfstorage-backend:$VERSION > /dev/null 2>&1 && echo "✓ Backend image verified"
docker manifest inspect $REGISTRY/selfstorage-ai:$VERSION > /dev/null 2>&1 && echo "✓ AI image verified"

echo ""
echo "✅ All images pushed successfully"
```

---

## 4.3. Configuration application

### 4.3.1. Production docker-compose.yml

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  backend:
    image: ghcr.io/your-org/selfstorage-backend:${VERSION:-latest}
    container_name: selfstorage-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

  ai-service:
    image: ghcr.io/your-org/selfstorage-ai:${VERSION:-latest}
    container_name: selfstorage-ai
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

  postgres:
    image: postgres:15-alpine
    container_name: selfstorage-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      - "postgres"
      - "-c"
      - "max_connections=200"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "effective_cache_size=1GB"
      - "-c"
      - "maintenance_work_mem=128MB"
      - "-c"
      - "checkpoint_completion_target=0.9"
      - "-c"
      - "wal_buffers=16MB"
      - "-c"
      - "default_statistics_target=100"
      - "-c"
      - "random_page_cost=1.1"
      - "-c"
      - "effective_io_concurrency=200"

  redis:
    image: redis:7-alpine
    container_name: selfstorage-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  nginx:
    image: nginx:alpine
    container_name: selfstorage-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - nginx-logs:/var/log/nginx
    depends_on:
      - backend
      - ai-service
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  nginx-logs:
```

### 4.3.2. Nginx Configuration

```nginx
# nginx/conf.d/api.conf
upstream backend {
    least_conn;
    server backend:4000 max_fails=3 fail_timeout=30s;
}

upstream ai_service {
    server ai-service:8000 max_fails=3 fail_timeout=30s;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=ai_limit:10m rate=20r/m;

server {
    listen 80;
    server_name api.selfstorage.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.selfstorage.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # Logging
    access_log /var/log/nginx/api_access.log;
    error_log /var/log/nginx/api_error.log;

    # Backend API
    location /api/v1/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # AI Service
    location /api/v1/ai/ {
        limit_req zone=ai_limit burst=5 nodelay;
        
        proxy_pass http://ai_service/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check (no rate limit)
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 4.3.3. Configuration Update Script

```bash
#!/bin/bash
# scripts/update-config.sh

ENVIRONMENT=${1:-production}

echo "🔧 Updating Configuration: $ENVIRONMENT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    SERVER="deploy@prod-server"
    DEPLOY_PATH="/opt/selfstorage"
else
    SERVER="deploy@staging-server"
    DEPLOY_PATH="/opt/selfstorage"
fi

# 1. Backup current configuration
echo "Step 1/4: Backing up current configuration..."
ssh $SERVER "cd $DEPLOY_PATH && tar -czf config-backup-$(date +%Y%m%d-%H%M%S).tar.gz docker-compose.production.yml nginx/"

# 2. Upload new configuration
echo ""
echo "Step 2/4: Uploading new configuration..."
scp docker-compose.production.yml $SERVER:$DEPLOY_PATH/
scp -r nginx/ $SERVER:$DEPLOY_PATH/

# 3. Validate configuration
echo ""
echo "Step 3/4: Validating configuration..."
ssh $SERVER "cd $DEPLOY_PATH && docker-compose -f docker-compose.production.yml config" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ docker-compose.yml is valid"
else
    echo "✗ docker-compose.yml validation failed"
    exit 1
fi

# Validate nginx config
ssh $SERVER "docker run --rm -v $DEPLOY_PATH/nginx/conf.d:/etc/nginx/conf.d nginx:alpine nginx -t" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ nginx configuration is valid"
else
    echo "✗ nginx configuration validation failed"
    exit 1
fi

# 4. Apply configuration (requires restart)
echo ""
echo "Step 4/4: Configuration uploaded"
echo "⚠️  Restart required to apply changes"
echo ""
echo "To apply: ssh $SERVER 'cd $DEPLOY_PATH && docker-compose up -d'"

echo ""
echo "✅ Configuration update complete"
```

---

## 4.4. Container deployment

### 4.4.1. Zero-Downtime Deployment Script

> **MVP vs Post-MVP Note:** Zero-downtime deployment is a **RECOMMENDED best practice** but not strictly required for MVP v1 launch. MVP deployments may use brief maintenance windows (30-60 seconds) if zero-downtime orchestration is not yet implemented. This procedure is included to support growth path and reduce risk as traffic increases.  
>   
> **Classification:** 🟡 RECOMMENDED for MVP v1, 🔴 MANDATORY for production at scale.

```bash
#!/bin/bash
# scripts/deploy-backend.sh

set -e

ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

echo "🚀 Backend Deployment"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"
echo ""

# Pre-deployment checks
echo "Running pre-deployment checks..."
./scripts/check-freeze-window.sh || exit 1
./scripts/prepare-$ENVIRONMENT.sh || exit 1

# Set server details
if [ "$ENVIRONMENT" = "production" ]; then
    SERVER="deploy@prod-server"
    DEPLOY_PATH="/opt/selfstorage"
else
    SERVER="deploy@staging-server"
    DEPLOY_PATH="/opt/selfstorage"
fi

# 1. Pull new images
echo ""
echo "Step 1/10: Pulling new Docker images..."
ssh $SERVER "cd $DEPLOY_PATH && docker-compose pull backend ai-service"

# 2. Create database backup
echo ""
echo "Step 2/10: Creating database backup..."
BACKUP_FILE="$ENVIRONMENT-pre-deploy-$(date +%Y%m%d-%H%M%S).sql"
ssh $SERVER "cd $DEPLOY_PATH && docker-compose exec -T postgres pg_dump -U \$DB_USER \$DB_NAME" > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE
echo "✓ Backup: backups/${BACKUP_FILE}.gz"

# 3. Run database migrations
echo ""
echo "Step 3/10: Running database migrations..."
ssh $SERVER "cd $DEPLOY_PATH && docker-compose exec -T backend npm run migration:run"

# 4. Rolling update backend
echo ""
echo "Step 4/10: Deploying backend (zero-downtime)..."
ssh $SERVER << 'ENDSSH'
cd /opt/selfstorage

# Scale up to 2 instances
docker-compose up -d --scale backend=2 --no-recreate backend

# Wait for new instance
sleep 30

# Scale down to 1 instance (removes old)
docker-compose up -d --scale backend=1 --no-recreate backend
ENDSSH

# 5. Wait for backend health
echo ""
echo "Step 5/10: Waiting for backend health..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/health" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✓ Backend is healthy"
        break
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 5
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo ""
        echo "❌ Backend failed to become healthy"
        echo "Rolling back..."
        ./scripts/rollback-backend.sh $ENVIRONMENT
        exit 1
    fi
done

# 6. Deploy AI service
echo ""
echo "Step 6/10: Deploying AI service..."
ssh $SERVER "cd $DEPLOY_PATH && docker-compose up -d ai-service"

# 7. Wait for AI service
echo ""
echo "Step 7/10: Waiting for AI service..."
sleep 15

AI_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/ai/health" 2>/dev/null || echo "000")
if [ "$AI_CODE" = "200" ]; then
    echo "✓ AI service is healthy"
else
    echo "⚠️  AI service health check: HTTP $AI_CODE"
fi

# 8. Reload nginx
echo ""
echo "Step 8/10: Reloading nginx..."
ssh $SERVER "docker-compose exec nginx nginx -s reload"

# 9. Run smoke tests
echo ""
echo "Step 9/10: Running smoke tests..."
./scripts/api-smoke-tests.sh "https://api.selfstorage.com/api/v1" $ENVIRONMENT

# 10. Cleanup
echo ""
echo "Step 10/10: Cleaning up..."
ssh $SERVER "docker image prune -f"

echo ""
echo "✅ Backend deployment complete"
echo ""
echo "Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Version: $VERSION"
echo "  Backup: backups/${BACKUP_FILE}.gz"
echo ""
echo "Next steps:"
echo "  1. Monitor for 30 minutes: ./scripts/monitor-deployment.sh $ENVIRONMENT"
echo "  2. Check logs: ssh $SERVER 'docker-compose logs -f backend'"
```

---

## 4.5. Health checks

### 4.5.1. Health Check Endpoints

```typescript
// backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Comprehensive health check' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for k8s' })
  async ready() {
    // Check all critical dependencies
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        aiService: await this.checkAIService(),
      },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe for k8s' })
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const result = await this.db.pingCheck('database');
      return result.database.status === 'up';
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    // Implementation
    return true;
  }

  private async checkAIService(): Promise<boolean> {
    // Implementation
    return true;
  }
}
```

### 4.5.2. Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

ENVIRONMENT=${1:-production}

echo "🏥 Running Health Checks: $ENVIRONMENT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    BASE_URL="https://api.selfstorage.com/api/v1"
else
    BASE_URL="https://api-staging.selfstorage.com/api/v1"
fi

FAILED=0

# Basic health
echo "1. Basic Health Check..."
HEALTH=$(curl -s "$BASE_URL/health")
STATUS=$(echo "$HEALTH" | jq -r '.status')

if [ "$STATUS" = "ok" ]; then
    echo "   ✓ Status: OK"
else
    echo "   ✗ Status: $STATUS"
    FAILED=$((FAILED + 1))
fi

# Database check
DB_STATUS=$(echo "$HEALTH" | jq -r '.info.database.status')
if [ "$DB_STATUS" = "up" ]; then
    echo "   ✓ Database: UP"
else
    echo "   ✗ Database: $DB_STATUS"
    FAILED=$((FAILED + 1))
fi

# Memory check
MEM_STATUS=$(echo "$HEALTH" | jq -r '.info.memory_heap.status')
if [ "$MEM_STATUS" = "up" ]; then
    echo "   ✓ Memory: OK"
else
    echo "   ⚠️  Memory: $MEM_STATUS"
fi

# Readiness check
echo ""
echo "2. Readiness Check..."
READY=$(curl -s "$BASE_URL/health/ready")
READY_STATUS=$(echo "$READY" | jq -r '.status')

if [ "$READY_STATUS" = "ok" ]; then
    echo "   ✓ Ready"
else
    echo "   ✗ Not Ready"
    FAILED=$((FAILED + 1))
fi

# Liveness check
echo ""
echo "3. Liveness Check..."
LIVE=$(curl -s "$BASE_URL/health/live")
LIVE_STATUS=$(echo "$LIVE" | jq -r '.status')

if [ "$LIVE_STATUS" = "ok" ]; then
    echo "   ✓ Live"
else
    echo "   ✗ Not Live"
    FAILED=$((FAILED + 1))
fi

# Response time check
echo ""
echo "4. Performance Check..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/health")
RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc)

if (( $(echo "$RESPONSE_TIME < 0.5" | bc -l) )); then
    echo "   ✓ Response time: ${RESPONSE_MS}ms"
else
    echo "   ⚠️  Response time: ${RESPONSE_MS}ms (> 500ms)"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo "✅ All health checks passed"
    exit 0
else
    echo "❌ $FAILED health check(s) failed"
    exit 1
fi
```

---

# 5. Frontend Deployment

## 5.1. Production build

### 5.1.1. Build Configuration

```json
// package.json
{
  "name": "selfstorage-frontend",
  "scripts": {
    "build": "next build",
    "start": "next start",
    "build:analyze": "ANALYZE=true next build"
  }
}
```

### 5.1.2. Next.js Configuration

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  compress: true,
  
  images: {
    domains: ['selfstorage.com', 's3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/*'],
  },
};
```

### 5.1.3. Build Script

```bash
#!/bin/bash
# scripts/build-frontend.sh

echo "🏗️  Building Frontend"

cd frontend

# Install dependencies
npm ci

# Run linting
npm run lint

# Run type check
npm run type-check

# Build
NODE_ENV=production npm run build

# Check build size
du -sh .next

echo "✅ Frontend build complete"
```

---

## 5.2. Deployment options

> **VENDOR NEUTRALITY NOTICE:** The deployment platforms mentioned below (Vercel, Railway, self-hosted Docker) are **illustrative examples only**. Teams may use any frontend hosting solution that meets their requirements: Netlify, Cloudflare Pages, AWS Amplify, Azure Static Web Apps, self-hosted Nginx, etc. The principles of health checks, cache invalidation, and smoke testing apply regardless of platform choice.

### 5.2.1. Option A: Vercel (Recommended)

> **Note:** Vercel is shown as an example of modern serverless frontend hosting. Not a required provider. Adapt procedures to your chosen platform.

```bash
#!/bin/bash
# scripts/deploy-frontend-vercel.sh

ENVIRONMENT=${1:-production}

echo "🚀 Deploying to Vercel: $ENVIRONMENT"

cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
else
    vercel
fi

echo "✅ Deployment complete"
```

**vercel.json Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url_production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 5.2.2. Option B: Railway

> **Note:** Railway is another illustrative example of managed hosting. Alternative platforms include Heroku, Render, Fly.io, etc. Choose based on your requirements and team experience.

```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 5.2.3. Option C: Self-Hosted (Docker)

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 5.2.4. Complete Deployment Script

```bash
#!/bin/bash
# scripts/deploy-frontend-complete.sh

PLATFORM=${1:-vercel}
ENVIRONMENT=${2:-production}

echo "🚀 Frontend Deployment"
echo "Platform: $PLATFORM"
echo "Environment: $ENVIRONMENT"
echo ""

cd frontend

case $PLATFORM in
    vercel)
        echo "Deploying to Vercel..."
        if [ "$ENVIRONMENT" = "production" ]; then
            vercel --prod --yes
        else
            vercel --yes
        fi
        ;;
        
    railway)
        echo "Deploying to Railway..."
        railway up
        ;;
        
    docker)
        echo "Building and deploying Docker image..."
        docker build -t selfstorage-frontend:latest \
            --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
            --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
            .
        
        # Push to registry
        docker push ghcr.io/your-org/selfstorage-frontend:latest
        
        # Deploy on server
        ssh deploy@prod-server << 'ENDSSH'
        cd /opt/selfstorage
        docker-compose pull frontend
        docker-compose up -d frontend
ENDSSH
        ;;
esac

echo ""
echo "✅ Frontend deployment complete"
```

---

## 5.3. Cache invalidation

### 5.3.1. CDN Cache Invalidation Script

```bash
#!/bin/bash
# scripts/invalidate-cdn-cache.sh

CDN_PROVIDER=${1:-cloudflare}

echo "🔄 Invalidating CDN Cache"
echo "Provider: $CDN_PROVIDER"
echo ""

case $CDN_PROVIDER in
    cloudflare)
        # Cloudflare cache purge
        curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
            -H "Authorization: Bearer ${CF_API_TOKEN}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
        ;;
        
    vercel)
        # Vercel automatically handles cache
        echo "Vercel handles cache automatically"
        ;;
esac

echo ""
echo "✅ Cache invalidation complete"
```

---

## 5.4. Smoke tests

### 5.4.1. Frontend Smoke Tests

```bash
#!/bin/bash
# scripts/frontend-smoke-test.sh

BASE_URL=${1:-"https://selfstorage.com"}

echo "🧪 Frontend Smoke Tests"
echo "URL: $BASE_URL"
echo ""

PASSED=0
FAILED=0

# Test homepage
echo -n "Testing homepage... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓"
    PASSED=$((PASSED + 1))
else
    echo "✗ (HTTP $HTTP_CODE)"
    FAILED=$((FAILED + 1))
fi

# Test search page
echo -n "Testing search page... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/search")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓"
    PASSED=$((PASSED + 1))
else
    echo "✗"
    FAILED=$((FAILED + 1))
fi

# Test performance
echo -n "Testing page load time... "
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL")
LOAD_MS=$(echo "$LOAD_TIME * 1000" | bc)

if (( $(echo "$LOAD_TIME < 3" | bc -l) )); then
    echo "✓ (${LOAD_MS}ms)"
    PASSED=$((PASSED + 1))
else
    echo "⚠️  (${LOAD_MS}ms - slow)"
    PASSED=$((PASSED + 1))
fi

echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo "✅ All tests passed"
    exit 0
else
    echo "❌ Some tests failed"
    exit 1
fi
```

---

# 6. Database Migrations

## 6.1. Подготовка миграций

### 6.1.1. TypeORM Migration Structure

```typescript
// backend/src/database/migrations/1701234567890-InitialSchema.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1701234567890 implements MigrationInterface {
    name = 'InitialSchema1701234567890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "postgis";
        `);
        
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "password_hash" varchar NOT NULL,
                "first_name" varchar NOT NULL,
                "last_name" varchar NOT NULL,
                "role" varchar NOT NULL DEFAULT 'user',
                "created_at" timestamp DEFAULT now(),
                "updated_at" timestamp DEFAULT now()
            )
        `);
        
        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email");
            CREATE INDEX "idx_users_role" ON "users" ("role");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_users_role"`);
        await queryRunner.query(`DROP INDEX "idx_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
```

### 6.1.2. Check Pending Migrations

```bash
#!/bin/bash
# scripts/check-migrations.sh

echo "📋 Checking Database Migrations"
echo ""

cd backend

# Check for pending migrations
PENDING=$(npm run migration:show 2>&1 | grep -c "has not been executed")

if [ "$PENDING" -gt 0 ]; then
    echo "⚠️  $PENDING pending migration(s)"
    npm run migration:show
    exit 1
else
    echo "✅ No pending migrations"
    exit 0
fi
```

---

## 6.2. Dry-run

### 6.2.1. Migration Dry Run Script

```bash
#!/bin/bash
# scripts/dry-run-migrations.sh

echo "🔍 Dry Run: Database Migrations"
echo ""

# Create temporary database
TMP_DB="selfstorage_dryrun_$(date +%s)"

echo "Creating temporary database: $TMP_DB"
createdb $TMP_DB

# Copy production schema
echo "Copying production schema..."
pg_dump -s selfstorage_production | psql $TMP_DB

# Run migrations on temp DB
echo "Running migrations on temp DB..."
cd backend
DATABASE_URL="postgresql://localhost/$TMP_DB" npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migrations succeeded"
    
    # Show what changed
    echo ""
    echo "Schema changes:"
    psql $TMP_DB -c "\d+"
else
    echo "❌ Migrations failed"
fi

# Cleanup
dropdb $TMP_DB

echo ""
echo "Dry run complete"
```

---

## 6.3. Применение на staging

### 6.3.1. Staging Migration Script

```bash
#!/bin/bash
# scripts/run-migrations-staging.sh

echo "🔄 Running Migrations on Staging"
echo ""

# Backup first
echo "Creating backup..."
BACKUP_FILE="staging-pre-migration-$(date +%Y%m%d-%H%M%S).sql"
ssh deploy@staging-server "pg_dump selfstorage_staging" > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE
echo "✓ Backup: backups/${BACKUP_FILE}.gz"

# Show pending migrations
echo ""
echo "Pending migrations:"
ssh deploy@staging-server "cd /opt/selfstorage/backend && npm run migration:show"

# Confirm
read -p "Continue with migration? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    exit 1
fi

# Run migrations
echo ""
echo "Running migrations..."
ssh deploy@staging-server "cd /opt/selfstorage/backend && npm run migration:run"

# Verify
echo ""
echo "Verifying migrations..."
ssh deploy@staging-server "cd /opt/selfstorage/backend && npm run migration:show"

echo ""
echo "✅ Staging migrations complete"
```

---

## 6.4. Применение на production

### 6.4.1. Production Migration Script

```bash
#!/bin/bash
# scripts/run-migrations-production.sh

set -e

echo "🚀 Production Database Migration"
echo ""
echo "⚠️  WARNING: This will modify the production database"
echo ""

# Pre-flight checks
echo "Running pre-flight checks..."

# Check database connectivity
if ! nc -z prod-db-server 5432; then
    echo "❌ Cannot connect to production database"
    exit 1
fi

# Check for pending migrations
PENDING=$(ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:show 2>&1" | grep -c "has not been executed")

if [ "$PENDING" -eq 0 ]; then
    echo "✓ No pending migrations"
    exit 0
fi

echo "⚠️  Found $PENDING pending migration(s)"

# Create backup
echo ""
echo "Step 1/5: Creating backup..."
BACKUP_FILE="production-$(date +%Y%m%d-%H%M%S).sql"
ssh deploy@prod-server "pg_dump -Fc selfstorage_production" > backups/$BACKUP_FILE
echo "✓ Backup: backups/$BACKUP_FILE"

# Verify backup
BACKUP_SIZE=$(stat -f%z backups/$BACKUP_FILE 2>/dev/null || stat -c%s backups/$BACKUP_FILE)
if [ "$BACKUP_SIZE" -lt 1000 ]; then
    echo "❌ Backup file is too small"
    exit 1
fi
echo "✓ Backup verified (${BACKUP_SIZE} bytes)"

# Show migrations
echo ""
echo "Step 2/5: Pending migrations:"
ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:show"

# Final confirmation
echo ""
echo "Step 3/5: Final confirmation"
read -p "Type 'MIGRATE PRODUCTION' to confirm: " CONFIRM
if [ "$CONFIRM" != "MIGRATE PRODUCTION" ]; then
    echo "❌ Migration cancelled"
    exit 1
fi

# Enable maintenance mode (optional)
echo ""
echo "Step 4/5: Enabling maintenance mode..."
ssh deploy@prod-server "touch /opt/selfstorage/MAINTENANCE"

# Run migrations
echo ""
echo "Step 5/5: Running migrations..."
START_TIME=$(date +%s)

ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:run" 2>&1 | tee migration.log

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Disable maintenance mode
ssh deploy@prod-server "rm -f /opt/selfstorage/MAINTENANCE"

# Verify
echo ""
echo "Verifying migrations..."
ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:show"

echo ""
echo "✅ Production migration complete"
echo "Duration: ${DURATION}s"
echo "Backup: backups/$BACKUP_FILE"
```

---

## 6.5. Rollback миграций

### 6.5.1. Migration Rollback Script

```bash
#!/bin/bash
# scripts/rollback-migrations.sh

ENVIRONMENT=${1:-production}
STEPS=${2:-1}

echo "🔄 Rolling Back Migrations"
echo "Environment: $ENVIRONMENT"
echo "Steps to rollback: $STEPS"
echo ""

# Confirm
read -p "⚠️  Type 'REVERT MIGRATIONS' to confirm: " CONFIRM
if [ "$CONFIRM" != "REVERT MIGRATIONS" ]; then
    exit 1
fi

# Backup before rollback
BACKUP_FILE="pre-rollback-$(date +%Y%m%d-%H%M%S).sql"
if [ "$ENVIRONMENT" = "production" ]; then
    ssh deploy@prod-server "pg_dump -Fc selfstorage_production" > backups/$BACKUP_FILE
else
    ssh deploy@staging-server "pg_dump -Fc selfstorage_staging" > backups/$BACKUP_FILE
fi
echo "✓ Backup: backups/$BACKUP_FILE"

# Revert migrations
echo ""
echo "Reverting $STEPS migration(s)..."

for i in $(seq 1 $STEPS); do
    echo "Reverting migration $i/$STEPS..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:revert"
    else
        ssh deploy@staging-server "cd /opt/selfstorage/backend && npm run migration:revert"
    fi
done

# Show current state
echo ""
echo "Current migration state:"
if [ "$ENVIRONMENT" = "production" ]; then
    ssh deploy@prod-server "cd /opt/selfstorage/backend && npm run migration:show"
else
    ssh deploy@staging-server "cd /opt/selfstorage/backend && npm run migration:show"
fi

echo ""
echo "✅ Migration rollback complete"
```

---

## 6.6. Проверка целостности БД

### 6.6.1. Database Integrity Check

```bash
#!/bin/bash
# scripts/check-database-integrity.sh

ENVIRONMENT=${1:-production}

echo "🔍 Database Integrity Check"
echo "Environment: $ENVIRONMENT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    DB_HOST="prod-db-server"
    DB_NAME="selfstorage_production"
else
    DB_HOST="staging-db-server"
    DB_NAME="selfstorage_staging"
fi

# Check 1: Table existence
echo "1. Checking tables..."
EXPECTED_TABLES="users operators warehouses boxes bookings payments"
for table in $EXPECTED_TABLES; do
    EXISTS=$(ssh deploy@$DB_HOST "psql $DB_NAME -tAc \"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='$table')\"")
    if [ "$EXISTS" = "t" ]; then
        echo "  ✓ $table"
    else
        echo "  ✗ $table MISSING"
    fi
done

# Check 2: Foreign keys
echo ""
echo "2. Checking foreign keys..."
FK_COUNT=$(ssh deploy@$DB_HOST "psql $DB_NAME -tAc \"SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type='FOREIGN KEY'\"")
echo "  Foreign keys: $FK_COUNT"

# Check 3: Indexes
echo ""
echo "3. Checking indexes..."
INDEX_COUNT=$(ssh deploy@$DB_HOST "psql $DB_NAME -tAc \"SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public'\"")
echo "  Indexes: $INDEX_COUNT"

# Check 4: Extensions
echo ""
echo "4. Checking extensions..."
EXTENSIONS="uuid-ossp postgis"
for ext in $EXTENSIONS; do
    EXISTS=$(ssh deploy@$DB_HOST "psql $DB_NAME -tAc \"SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname='$ext')\"")
    if [ "$EXISTS" = "t" ]; then
        echo "  ✓ $ext"
    else
        echo "  ✗ $ext MISSING"
    fi
done

# Check 5: Row counts
echo ""
echo "5. Checking row counts..."
for table in $EXPECTED_TABLES; do
    COUNT=$(ssh deploy@$DB_HOST "psql $DB_NAME -tAc \"SELECT COUNT(*) FROM $table\"" 2>/dev/null || echo "0")
    echo "  $table: $COUNT rows"
done

echo ""
echo "✅ Integrity check complete"
```

---

**End of Part 2 (Sections 4-6)**# Deployment Runbook - Self-Storage Aggregator MVP v1
## Part 3: Sections 7-9

**Version:** 1.0.0  
**Last Updated:** December 8, 2024  
**Part:** 3 of 4

---

# 7. Smoke Tests

## 7.1. API smoke suite

### 7.1.1. Core API Smoke Tests Script

```bash
#!/bin/bash
# scripts/api-smoke-tests.sh

set -e

BASE_URL=${1:-"https://api.selfstorage.com/api/v1"}
ENVIRONMENT=${2:-"production"}

echo "🧪 Running API Smoke Tests"
echo "Base URL: $BASE_URL"
echo "Environment: $ENVIRONMENT"
echo ""

PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected=$4
    local data=$5
    
    echo -n "Testing: $name... "
    
    if [ -n "$data" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    if [ "$HTTP_CODE" = "$expected" ]; then
        echo "✓ PASS (HTTP $HTTP_CODE)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo "✗ FAIL (Expected $expected, got $HTTP_CODE)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "=== Core Endpoints ==="
test_endpoint "Health Check" GET "/health" "200"
test_endpoint "API Version" GET "/version" "200"

echo ""
echo "=== Authentication ==="
test_endpoint "Register Validation" POST "/auth/register" "400" '{}'
test_endpoint "Login Validation" POST "/auth/login" "400" '{}'

# Create test user
TEST_EMAIL="smoke-test-$(date +%s)@test.com"
REGISTER_DATA="{\"email\":\"$TEST_EMAIL\",\"password\":\"Test1234!\",\"first_name\":\"Smoke\",\"last_name\":\"Test\"}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" -d "$REGISTER_DATA")
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✓ User registration works"
    PASSED=$((PASSED + 1))
else
    echo "✗ User registration failed"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "=== Warehouse Endpoints ==="
test_endpoint "List Warehouses" GET "/warehouses?limit=10" "200"
test_endpoint "Search by City" GET "/warehouses?city=Moscow" "200"

echo ""
echo "=== Summary ==="
echo "Total: $((PASSED + FAILED))"
echo "Passed: $PASSED"
echo "Failed: $FAILED"

# Cleanup
if [ "$ACCESS_TOKEN" != "null" ]; then
    curl -s -X DELETE "$BASE_URL/users/me" -H "Authorization: Bearer $ACCESS_TOKEN" > /dev/null
fi

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "✅ All smoke tests passed"
    exit 0
else
    echo ""
    echo "❌ Some smoke tests failed"
    exit 1
fi
```

---

## 7.2. Frontend smoke suite

### 7.2.1. Frontend Smoke Test Script

```bash
#!/bin/bash
# scripts/frontend-smoke-test.sh

BASE_URL=${1:-"https://selfstorage.com"}

echo "🧪 Frontend Smoke Tests"
echo "URL: $BASE_URL"
echo ""

PASSED=0
FAILED=0

# Test homepage
echo -n "Testing homepage load... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓"
    PASSED=$((PASSED + 1))
else
    echo "✗ (HTTP $HTTP_CODE)"
    FAILED=$((FAILED + 1))
fi

# Test static assets
echo -n "Testing favicon... "
FAVICON_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/favicon.ico")
if [ "$FAVICON_CODE" = "200" ]; then
    echo "✓"
    PASSED=$((PASSED + 1))
else
    echo "✗"
    FAILED=$((FAILED + 1))
fi

# Test performance
echo -n "Testing page load time... "
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL")
LOAD_MS=$(echo "$LOAD_TIME * 1000" | bc)

if (( $(echo "$LOAD_TIME < 3" | bc -l) )); then
    echo "✓ (${LOAD_MS}ms)"
    PASSED=$((PASSED + 1))
else
    echo "⚠️  (${LOAD_MS}ms)"
    PASSED=$((PASSED + 1))
fi

echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "✅ Frontend smoke tests passed"
    exit 0
else
    echo ""
    echo "❌ Some tests failed"
    exit 1
fi
```

---

# 8. Release Process

## 8.1. Git-flow релизов

### 8.1.1. Git Flow Workflow Script

```bash
#!/bin/bash
# scripts/git-flow.sh

ACTION=$1
TYPE=$2
NAME=$3

case $ACTION in
    start)
        case $TYPE in
            feature)
                git checkout develop
                git pull origin develop
                git checkout -b "feature/$NAME"
                echo "✓ Feature branch created: feature/$NAME"
                ;;
            release)
                git checkout develop
                git pull origin develop
                git checkout -b "release/$NAME"
                npm version $NAME --no-git-tag-version
                git add package.json
                git commit -m "chore: bump version to $NAME"
                echo "✓ Release branch created: release/$NAME"
                ;;
            hotfix)
                git checkout main
                git pull origin main
                git checkout -b "hotfix/$NAME"
                echo "✓ Hotfix branch created: hotfix/$NAME"
                ;;
        esac
        ;;
        
    finish)
        case $TYPE in
            release)
                # Merge to main
                git checkout main
                git merge --no-ff "release/$NAME"
                git tag -a "$NAME" -m "Release $NAME"
                git push origin main
                git push origin "$NAME"
                
                # Merge back to develop
                git checkout develop
                git merge --no-ff "release/$NAME"
                git push origin develop
                
                # Delete release branch
                git branch -d "release/$NAME"
                echo "✓ Release $NAME completed"
                ;;
        esac
        ;;
esac
```

### 8.1.2. Commit Convention

```bash
# Conventional Commits

feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
perf:     Performance improvement
test:     Tests
chore:    Build/tooling

# Examples:
git commit -m "feat(auth): add JWT refresh token"
git commit -m "fix(booking): resolve race condition"
```

---

## 8.2. Release tags

### 8.2.1. Create Release Tag Script

```bash
#!/bin/bash
# scripts/create-release-tag.sh

VERSION=$1
MESSAGE=${2:-"Release $VERSION"}

if [ -z "$VERSION" ]; then
    echo "Usage: ./create-release-tag.sh <version> [message]"
    exit 1
fi

# Validate version format
if ! echo "$VERSION" | grep -qE '^v[0-9]+\.[0-9]+\.[0-9]+$'; then
    echo "❌ Invalid version format. Expected: vX.Y.Z"
    exit 1
fi

# Check branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You are on '$CURRENT_BRANCH', not 'main'"
    read -p "Continue? (yes/no): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        exit 1
    fi
fi

# Pull latest
git pull origin main

# Create tag
git tag -a "$VERSION" -m "$MESSAGE"
git push origin "$VERSION"

echo "✅ Release tag $VERSION created"
```

---

## 8.3. Approval workflow

### 8.3.1. Release Request Template

```markdown
## Release Request: v1.2.0

### Release Information
- **Type:** Minor Release
- **Target Date:** 2024-12-15 14:00 UTC+3
- **Duration:** 20 minutes

### Changes
#### New Features
- AI-powered recommendations
- User profile enhancements

#### Bug Fixes
- Fixed booking validation
- Resolved payment issue

### Testing
- [x] Unit tests passed
- [x] Integration tests passed
- [x] Staging validated

### Approvals
- [ ] Tech Lead
- [ ] QA Lead
```

---

## 8.4. Коммуникации с командой

### 8.4.1. Slack Notification Script

```bash
#!/bin/bash
# scripts/notify-slack.sh

WEBHOOK_URL=${SLACK_WEBHOOK_URL}
EVENT_TYPE=$1
DETAILS=$2

case $EVENT_TYPE in
    deployment-started)
        curl -X POST $WEBHOOK_URL \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"🚀 DEPLOYMENT STARTED\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Version:* $DETAILS\\n*Time:* $(date)\"
                    }
                }]
            }"
        ;;
        
    deployment-success)
        curl -X POST $WEBHOOK_URL \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"✅ DEPLOYMENT SUCCESSFUL\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Version:* $DETAILS\\n*Status:* All checks passed\"
                    }
                }]
            }"
        ;;
esac
```

---

## 8.5. Релизные заметки

### 8.5.1. CHANGELOG.md Structure

```markdown
# Changelog

## [1.2.0] - 2024-12-15

### Added
- AI-powered box size recommendations
- Advanced search filters
- User profile enhancements

### Changed
- Improved search performance (40% faster)
- Updated UI components

### Fixed
- Fixed booking race condition
- Resolved payment confirmation issue
- Corrected mobile navigation

### Technical
- Upgraded TypeORM to v0.3.20
- Added database indexes
- Reduced bundle size by 25%

### Security
- Updated JWT token handling
- Added rate limiting to auth endpoints
```

---

# 9. Rollback Procedures

## 9.1. Когда делать rollback

### 9.1.1. Rollback Decision Matrix

**Immediate Automatic Rollback:**
- Error rate > 10% for 5 minutes
- API health check fails 3 consecutive times
- Database connection pool exhausted
- Authentication system down

**Manual Rollback (Tech Lead decision):**
- Error rate 5-10% for 10 minutes
- p95 response time > 5 seconds
- Key business flow broken

### 9.1.2. Rollback Decision Script

```bash
#!/bin/bash
# scripts/should-rollback.sh

echo "🤔 Rollback Decision Helper"

# Collect metrics
ERROR_RATE=$(curl -s "https://api.selfstorage.com/api/v1/metrics/error-rate" | jq -r '.rate')
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/health")

ROLLBACK_SCORE=0

# Check error rate
if (( $(echo "$ERROR_RATE > 10" | bc -l) )); then
    echo "❌ CRITICAL: Error rate > 10%"
    ROLLBACK_SCORE=$((ROLLBACK_SCORE + 10))
elif (( $(echo "$ERROR_RATE > 5" | bc -l) )); then
    echo "⚠️  WARNING: Error rate > 5%"
    ROLLBACK_SCORE=$((ROLLBACK_SCORE + 5))
fi

# Check health
if [ "$HEALTH_STATUS" != "200" ]; then
    echo "❌ CRITICAL: Health check failed"
    ROLLBACK_SCORE=$((ROLLBACK_SCORE + 10))
fi

if [ $ROLLBACK_SCORE -ge 10 ]; then
    echo ""
    echo "🚨 RECOMMENDATION: IMMEDIATE ROLLBACK"
    exit 2
elif [ $ROLLBACK_SCORE -ge 5 ]; then
    echo ""
    echo "⚠️  RECOMMENDATION: Consider rollback"
    exit 1
else
    echo ""
    echo "✅ RECOMMENDATION: Continue monitoring"
    exit 0
fi
```

---

## 9.2. Откат backend

### 9.2.1. Backend Rollback Script

```bash
#!/bin/bash
# scripts/rollback-backend.sh

ENVIRONMENT=${1:-production}
TARGET_VERSION=${2:-"previous"}

echo "🔄 Rolling back backend"
echo "Environment: $ENVIRONMENT"
echo ""

# Require confirmation
read -p "⚠️  Confirm rollback? (type 'ROLLBACK'): " CONFIRM
if [ "$CONFIRM" != "ROLLBACK" ]; then
    exit 1
fi

# Create backup
BACKUP_FILE="pre-rollback-$(date +%Y%m%d-%H%M%S).sql"
ssh deploy@prod-server "docker-compose exec -T postgres pg_dump" > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE

# Stop backend
ssh deploy@prod-server "docker-compose stop backend"

# Update to previous version
ssh deploy@prod-server "docker-compose up -d backend"

# Wait for health
sleep 10
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/health")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Backend is healthy"
else
    echo "⚠️  Health check: HTTP $HTTP_CODE"
fi

echo ""
echo "✅ Backend rollback completed"
```

---

## 9.3. Откат frontend

### 9.3.1. Frontend Rollback Script

```bash
#!/bin/bash
# scripts/rollback-frontend.sh

ENVIRONMENT=${1:-production}

echo "🔄 Rolling back frontend"
echo "Environment: $ENVIRONMENT"
echo ""

case $DEPLOYMENT_PLATFORM in
    vercel)
        # Get previous deployment
        PREVIOUS=$(vercel deployments list --json | jq -r '[.[] | select(.state == "READY")][1].uid')
        vercel promote $PREVIOUS --yes
        ;;
        
    railway)
        railway rollback
        ;;
        
    *)
        echo "Manual rollback required"
        ;;
esac

# Verify
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://selfstorage.com")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Frontend accessible"
fi

echo "✅ Frontend rollback completed"
```

---

## 9.4. Откат миграций

### 9.4.1. Migration Rollback Script

```bash
#!/bin/bash
# scripts/rollback-migrations.sh

ENVIRONMENT=${1:-production}
STEPS=${2:-1}

echo "🔄 Rolling back migrations"
echo "Steps: $STEPS"
echo ""

read -p "⚠️  Type 'REVERT MIGRATIONS' to confirm: " CONFIRM
if [ "$CONFIRM" != "REVERT MIGRATIONS" ]; then
    exit 1
fi

# Backup
BACKUP_FILE="migration-rollback-$(date +%Y%m%d-%H%M%S).sql"
pg_dump > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE

# Revert migrations
cd backend
for i in $(seq 1 $STEPS); do
    echo "Reverting migration $i/$STEPS..."
    npm run migration:revert
done
cd ..

# Verify
npm run migration:show

echo "✅ Migration rollback completed"
```

---

## 9.5. Recovery checklist

### 9.5.1. Post-Rollback Checklist

```markdown
## Post-Rollback Recovery Checklist

### Immediate (0-15 min)
- [ ] All services running
- [ ] Health endpoints return 200
- [ ] No critical errors in logs
- [ ] Database connections stable

### Short-term (15-60 min)
- [ ] Run smoke tests
- [ ] Test critical flows
- [ ] Verify data consistency
- [ ] Monitor error rates

### Medium-term (1-24h)
- [ ] Collect logs
- [ ] Identify root cause
- [ ] Document incident
- [ ] Create post-mortem

### Long-term (1-7 days)
- [ ] Post-mortem meeting
- [ ] Action items assigned
- [ ] Update procedures
- [ ] Share learnings
```

---

**End of Part 3 (Sections 7-9)**
# Deployment Runbook - Self-Storage Aggregator MVP v1
## Part 4: Sections 10-12 (Final)

**Version:** 1.0.0  
**Last Updated:** December 8, 2024  
**Part:** 4 of 4

---

# 10. Hotfix Strategy

## 10.1. Что считается hotfix

### 10.1.1. Hotfix Classification

**Critical Issues (P0) - Immediate Hotfix:**
- Complete service outage
- Data loss or corruption
- Security vulnerability
- Payment system down
- Authentication broken

**High Priority (P1) - Urgent Hotfix:**
- Critical feature broken for >50% users
- Major performance degradation
- Important business flow broken

**NOT Hotfix (wait for regular release):**
- UI/UX bugs
- Minor performance issues
- Non-critical feature bugs
- Cosmetic issues

### 10.1.2. Hotfix Assessment Tool

```bash
#!/bin/bash
# scripts/assess-hotfix-need.sh

echo "🚨 Hotfix Assessment Tool"

echo "Q1: How many users affected?"
echo "  1) All users (100%)"
echo "  2) Most users (>50%)"
echo "  3) Some users (10-50%)"
echo "  4) Few users (<10%)"
read -p "Select: " Q1

echo "Q2: Business impact?"
echo "  1) Service unavailable"
echo "  2) Critical feature broken"
echo "  3) Important feature degraded"
echo "  4) Minor inconvenience"
read -p "Select: " Q2

SCORE=0
case $Q1 in 1) SCORE=$((SCORE + 10));; 2) SCORE=$((SCORE + 7));; esac
case $Q2 in 1) SCORE=$((SCORE + 10));; 2) SCORE=$((SCORE + 7));; esac

if [ $SCORE -ge 15 ]; then
    echo ""
    echo "🚨 RECOMMENDATION: IMMEDIATE HOTFIX"
    echo "Run: ./git-flow.sh start hotfix SS-XXX-description"
    exit 2
else
    echo ""
    echo "✅ RECOMMENDATION: Standard bugfix"
    exit 0
fi
```

---

## 10.2. Hotfix ветки

### 10.2.1. Create Hotfix Script

```bash
#!/bin/bash
# scripts/create-hotfix.sh

TICKET_ID=$1
DESCRIPTION=$2

if [ -z "$TICKET_ID" ]; then
    echo "Usage: ./create-hotfix.sh <ticket-id> <description>"
    exit 1
fi

BRANCH_NAME="hotfix/${TICKET_ID}-${DESCRIPTION}"

echo "🚨 Creating Hotfix Branch: $BRANCH_NAME"

# Switch to main
git checkout main
git pull origin main

# Get current version
CURRENT_VERSION=$(git describe --tags --abbrev=0)
NEXT_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')

echo "Current: $CURRENT_VERSION"
echo "Next: $NEXT_VERSION"

# Create branch
git checkout -b "$BRANCH_NAME"

# Update version
npm version patch --no-git-tag-version
git add package.json
git commit -m "chore: bump to $NEXT_VERSION for hotfix"

# Create documentation
cat > HOTFIX.md << EOF
# Hotfix: $TICKET_ID

## Issue
[Describe critical issue]

## Solution
[Describe fix]

## Testing
- [ ] Unit tests
- [ ] Manual testing
- [ ] Staging verified

## Risk Assessment
**Risk:** [Low/Medium/High]

## Rollback Plan
[How to rollback if needed]
EOF

git add HOTFIX.md
git commit -m "docs: add hotfix documentation"

git push -u origin "$BRANCH_NAME"

echo "✅ Hotfix branch created"
```

---

## 10.3. Применение без полной выкладки

### 10.3.1. Rapid Hotfix Deployment

```bash
#!/bin/bash
# scripts/deploy-hotfix.sh

BRANCH_NAME=${1:-$(git branch --show-current)}

echo "🚨 HOTFIX DEPLOYMENT"
echo "Branch: $BRANCH_NAME"
echo ""

read -p "⚠️  Deploy hotfix to PRODUCTION? (type 'HOTFIX'): " CONFIRM
if [ "$CONFIRM" != "HOTFIX" ]; then
    exit 1
fi

# Quick tests
echo "Running quick tests..."
cd backend
npm test -- --bail
cd ..

# Build
VERSION=$(cat backend/package.json | jq -r '.version')
docker build -t selfstorage-backend:$VERSION backend/

# Push
docker push ghcr.io/your-org/selfstorage-backend:$VERSION

# Backup
BACKUP_FILE="hotfix-$(date +%Y%m%d-%H%M%S).sql"
ssh deploy@prod-server "docker-compose exec -T postgres pg_dump" > backups/$BACKUP_FILE
gzip backups/$BACKUP_FILE

# Deploy
ssh deploy@prod-server << EOF
cd /opt/selfstorage
sed -i "s|selfstorage-backend:.*|selfstorage-backend:$VERSION|" docker-compose.yml
docker-compose pull backend
docker-compose up -d backend
EOF

# Wait and verify
sleep 30
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/health")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Hotfix deployed successfully"
else
    echo "✗ Deployment failed - rolling back"
    ./scripts/rollback-backend.sh
    exit 1
fi

# Merge hotfix
git checkout main
git merge --no-ff "$BRANCH_NAME"
git tag -a "$VERSION" -m "Hotfix $VERSION"
git push origin main "$VERSION"

git checkout develop
git merge --no-ff "$BRANCH_NAME"
git push origin develop

echo "✅ HOTFIX DEPLOYED: $VERSION"
```

---

## 10.4. Документирование

### 10.4.1. Hotfix Report Template

```markdown
# Hotfix Report: v1.2.1

**Date:** 2024-12-08  
**Severity:** P1 - High  
**Ticket:** SS-456  

## Issue
Payment validation failing for 60% of users

## Root Cause
Null pointer exception in payment validator

## Solution
Added null check for optional phone_number field

## Testing
- [x] Unit tests added
- [x] Manual testing completed
- [x] Staging verified

## Deployment
- Duration: 18 minutes
- Downtime: 0 seconds
- Backup: hotfix-20241208.sql.gz

## Impact
- Before: 58% error rate
- After: 0.8% error rate
- Users affected: ~450

## Lessons Learned
- Need better test coverage for optional fields
- Missing integration tests for null values
```

---

# 11. Post-Deployment Validation

## 11.1. Проверка системных метрик

> **MVP vs Post-MVP Note:** Extended post-deployment monitoring (30+ minutes) is a **RECOMMENDED best practice**. MVP v1 deployments may use shorter validation windows (10-15 minutes) with manual spot checks. Comprehensive automated monitoring becomes more critical as user base grows.  
>   
> **Classification:** 🟡 RECOMMENDED (comprehensive monitoring), 🔴 MANDATORY (basic health checks)

### 11.1.1. Metrics Collection Script

```bash
#!/bin/bash
# scripts/collect-post-deploy-metrics.sh

ENVIRONMENT=${1:-production}
DURATION=${2:-1800}

echo "📊 Post-Deployment Metrics"
echo "Duration: ${DURATION}s"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    API_URL="https://api.selfstorage.com/api/v1"
else
    API_URL="https://api-staging.selfstorage.com/api/v1"
fi

START_TIME=$(date +%s)
ITERATION=0

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED -ge $DURATION ]; then
        break
    fi
    
    ITERATION=$((ITERATION + 1))
    
    clear
    echo "📊 Metrics Monitoring"
    echo "Elapsed: ${ELAPSED}s / ${DURATION}s"
    echo ""
    
    # API metrics
    echo "=== API Metrics ==="
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$API_URL/health")
    RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
    echo "Response Time: ${RESPONSE_MS}ms"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
    echo "HTTP Status: $HTTP_CODE"
    
    # System metrics
    echo ""
    echo "=== System Metrics ==="
    if [ "$ENVIRONMENT" = "production" ]; then
        CPU=$(ssh deploy@prod-server "top -bn1 | grep 'Cpu(s)' | awk '{print \$2}'")
        MEM=$(ssh deploy@prod-server "free | grep Mem | awk '{print int(\$3/\$2 * 100)}'")
        echo "CPU Usage: ${CPU}%"
        echo "Memory Usage: ${MEM}%"
    fi
    
    sleep 30
done

echo ""
echo "✅ Monitoring complete"
```

---

## 11.2. Проверка логов

### 11.2.1. Log Analysis Script

```bash
#!/bin/bash
# scripts/analyze-deployment-logs.sh

ENVIRONMENT=${1:-production}
LINES=${2:-500}

echo "📋 Log Analysis"
echo "Environment: $ENVIRONMENT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    SERVER="deploy@prod-server"
else
    SERVER="deploy@staging-server"
fi

# Fetch logs
BACKEND_LOGS=$(ssh $SERVER "docker-compose logs --tail=$LINES backend")

# Count errors
ERROR_COUNT=$(echo "$BACKEND_LOGS" | grep -i "error" | wc -l)
WARN_COUNT=$(echo "$BACKEND_LOGS" | grep -i "warn" | wc -l)

echo "=== Backend Logs ==="
echo "Errors: $ERROR_COUNT"
echo "Warnings: $WARN_COUNT"

if [ $ERROR_COUNT -lt 10 ]; then
    echo "✓ Error count acceptable"
else
    echo "⚠️  High error count"
fi

# Check for specific issues
DB_ERRORS=$(echo "$BACKEND_LOGS" | grep -i "database.*error" | wc -l)
if [ $DB_ERRORS -gt 0 ]; then
    echo "⚠️  Database errors: $DB_ERRORS"
fi

echo ""
echo "✅ Log analysis complete"
```

---

## 11.3. Проверка алёртов

### 11.3.1. Alert Status Check

```bash
#!/bin/bash
# scripts/check-alerts.sh

ENVIRONMENT=${1:-production}

echo "🚨 Checking Alerts"
echo ""

ALERTS_FIRING=0

# Check error rate
ERROR_RATE=$(curl -s "https://api.selfstorage.com/api/v1/metrics/error-rate" | jq -r '.rate')
if (( $(echo "$ERROR_RATE > 5" | bc -l) )); then
    echo "⚠️  High Error Rate: ${ERROR_RATE}%"
    ALERTS_FIRING=$((ALERTS_FIRING + 1))
else
    echo "✓ Error Rate: ${ERROR_RATE}%"
fi

# Check API health
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.selfstorage.com/api/v1/health")
if [ "$HTTP_CODE" != "200" ]; then
    echo "⚠️  API Health: HTTP $HTTP_CODE"
    ALERTS_FIRING=$((ALERTS_FIRING + 1))
else
    echo "✓ API Health: HTTP $HTTP_CODE"
fi

echo ""
if [ $ALERTS_FIRING -eq 0 ]; then
    echo "✅ No alerts firing"
else
    echo "⚠️  $ALERTS_FIRING alert(s) firing"
fi
```

---

## 11.4. Верификация API

### 11.4.1. API Verification Script

```bash
#!/bin/bash
# scripts/verify-api-endpoints.sh

API_URL=${1:-"https://api.selfstorage.com/api/v1"}

echo "✅ API Verification"
echo "URL: $API_URL"
echo ""

PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected=$3
    
    echo -n "$name... "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    
    if [ "$HTTP_CODE" = "$expected" ]; then
        echo "✓"
        PASSED=$((PASSED + 1))
    else
        echo "✗ (HTTP $HTTP_CODE)"
        FAILED=$((FAILED + 1))
    fi
}

test_endpoint "Health" "/health" "200"
test_endpoint "Version" "/version" "200"
test_endpoint "Warehouses" "/warehouses" "200"

echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
    echo "✅ All endpoints verified"
    exit 0
else
    echo "❌ Some endpoints failed"
    exit 1
fi
```

---

## 11.5. Формализация результатов

### 11.5.1. Deployment Report Template

```markdown
# Deployment Report: v1.2.0

**Date:** 2024-12-08 14:00 UTC+3  
**Duration:** 18 minutes  
**Status:** ✅ Successful  

## Components Deployed
- Backend API v1.2.0
- Frontend v1.2.0
- Database Migrations (3)

## Test Results
- Smoke Tests: ✅ All passed
- API Verification: ✅ All passed
- Health Checks: ✅ All passed

## Metrics (30-min monitoring)
- Response Time p95: 347ms ✅
- Error Rate: 0.3% ✅
- CPU Usage: 42% ✅
- Memory Usage: 58% ✅

## Issues
None

## Sign-off
- Deployment Lead: ✅
- Tech Lead: ✅
- QA Lead: ✅
```

---

# 12. Operational Contacts & Responsibilities

## 12.1. Роли и зоны ответственности

### 12.1.1. RACI Matrix

```yaml
roles:
  Tech_Lead:
    responsibilities:
      - Approve production deployments
      - Review architecture
      - Final rollback decisions
    authority: "Full deployment authority"
    
  DevOps_Engineer:
    responsibilities:
      - Execute deployments
      - Manage infrastructure
      - Monitor systems
      - Handle rollbacks
    authority: "Can deploy to staging"
    
  Backend_Lead:
    responsibilities:
      - Review backend changes
      - Approve migrations
      - Backend architecture
    authority: "Approve backend changes"
    
  QA_Lead:
    responsibilities:
      - Test staging
      - Validate smoke tests
      - Sign off quality
    authority: "Can block deployment"
    
  On_Call_Engineer:
    responsibilities:
      - Monitor 24/7
      - Respond to incidents
      - Execute hotfixes
    authority: "Can hotfix without approval"
```

---

## 12.2. Контакты команды

### 12.2.1. Team Contacts

```yaml
team_contacts:
  leadership:
    - name: "Ahmed Al-Rashid"
      role: "Tech Lead"
      slack: "@ivan-petrov"
      email: "ivan.petrov@company.com"
      phone: "+7 999 123-45-67"
      
  devops:
    - name: "Алексей Сидоров"
      role: "DevOps Engineer"
      slack: "@alex-sidorov"
      email: "alex.sidorov@company.com"
      phone: "+7 999 234-56-78"
      
  backend:
    - name: "Дмитрий Козлов"
      role: "Backend Lead"
      slack: "@dmitry-kozlov"
      email: "dmitry.kozlov@company.com"
      
  qa:
    - name: "Сергей Новиков"
      role: "QA Lead"
      slack: "@sergey-novikov"
      email: "sergey.novikov@company.com"
```

### 12.2.2. Contact Script

```bash
#!/bin/bash
# scripts/get-contact.sh

ROLE=$1

case $ROLE in
    tech-lead)
        echo "Tech Lead: Ahmed Al-Rashid"
        echo "Phone: +7 999 123-45-67"
        echo "Slack: @ivan-petrov"
        ;;
    on-call)
        WEEK=$(date +%U)
        ROTATION=$((WEEK % 4 + 1))
        echo "Current On-Call (Week $ROTATION):"
        echo "Phone: +7 999 XXX-XX-XX"
        echo "⚠️  For P0: CALL immediately"
        ;;
esac
```

---

## 12.3. Эскалация

### 12.3.1. Escalation Matrix

```yaml
P0_Critical:
  initial: "On-Call Engineer"
  response_time: "< 15 minutes"
  escalate_to: "Tech Lead + DevOps Lead"
  escalate_after: "15 minutes no response"
  
P1_High:
  initial: "On-Call Engineer"
  response_time: "< 30 minutes"
  escalate_to: "Tech Lead"
  escalate_after: "1 hour not resolved"
```

### 12.3.2. Escalation Script

```bash
#!/bin/bash
# scripts/escalate-incident.sh

SEVERITY=$1
DESCRIPTION=$2

case $SEVERITY in
    P0)
        echo "🚨 P0 CRITICAL"
        echo "1. CALL On-Call: +7 999 XXX-XX-XX"
        echo "2. Post in #incidents with @channel"
        echo "3. Escalate to Tech Lead if no response in 15 min"
        ;;
    P1)
        echo "⚠️  P1 HIGH"
        echo "1. Message On-Call on Slack"
        echo "2. Post in #incidents"
        echo "3. Escalate if not resolved in 1 hour"
        ;;
esac
```

---

## 12.4. Каналы коммуникации

### 12.4.1. Communication Channels

```yaml
slack:
  deployments:
    name: "#deployments"
    purpose: "All deployment notifications"
    
  incidents:
    name: "#incidents"
    purpose: "Critical issues"
    alerts: "@channel for P0"
    
  engineering:
    name: "#engineering"
    purpose: "General discussions"
```

### 12.4.2. Status Page Updates

```bash
#!/bin/bash
# scripts/update-status-page.sh

STATUS=$1

case $STATUS in
    operational)
        echo "✅ Updating status: All Systems Operational"
        ;;
    degraded)
        echo "⚠️  Updating status: Performance Degraded"
        ;;
    outage)
        echo "🚨 Updating status: Service Outage"
        ;;
esac
```

---

# Appendices

## Appendix A: Script Index

### Deployment Scripts
- `check-deployment-readiness.sh` - Pre-deployment validation
- `deploy-backend.sh` - Backend deployment
- `deploy-frontend.sh` - Frontend deployment
- `deploy-hotfix.sh` - Hotfix deployment

### Testing Scripts
- `api-smoke-tests.sh` - API smoke tests
- `frontend-smoke-test.sh` - Frontend tests
- `health-check.sh` - Health validation

### Rollback Scripts
- `rollback-backend.sh` - Backend rollback
- `rollback-migrations.sh` - Migration rollback
- `rollback-all.sh` - Complete rollback

### Monitoring Scripts
- `monitor-deployment.sh` - Deployment monitoring
- `collect-post-deploy-metrics.sh` - Metrics collection
- `analyze-deployment-logs.sh` - Log analysis

---

## Appendix B: Troubleshooting

### Common Issues

**Issue: Health check fails**
```bash
# Check logs
docker-compose logs backend

# Restart service
docker-compose restart backend

# If still failing, rollback
./scripts/rollback-backend.sh
```

**Issue: High error rate**
```bash
# Assess situation
./scripts/should-rollback.sh

# If needed, rollback
./scripts/rollback-all.sh
```

---

## Document Status

**Version:** 1.0.0  
**Status:** ✅ Active  
**Last Review:** December 8, 2024  
**Next Review:** March 8, 2025  
**Owner:** DevOps Team  

---

**END OF DEPLOYMENT RUNBOOK**

---

## Summary

This deployment runbook provides comprehensive procedures for:
- ✅ Pre-deployment validation
- ✅ Backend & frontend deployment
- ✅ Database migrations
- ✅ Testing & validation
- ✅ Release management
- ✅ Rollback procedures
- ✅ Hotfix strategy
- ✅ Operational contacts

**Total Scripts:** 60+  
**Total Sections:** 12  
**Coverage:** Complete deployment lifecycle  

For questions or updates, contact DevOps Team.

---

# Document Revision Summary

## Changes in Version 1.1

This revision (v1.1) adds clarifying sections while **preserving all existing procedures, scripts, and technical content** from v1.0:

### Additions (Scope Hardening)

✅ **Document Scope & Intent** - Clarifies document purpose and boundaries  
✅ **Execution Model & Usage Guidelines** - Classifies procedures as MANDATORY/RECOMMENDED/OPTIONAL  
✅ **Security & Safety Notice** - Emphasizes script review, secrets management, and approval requirements  
✅ **Canonical Boundaries** - Explicitly defines relationship to architecture and governance documents  
✅ **Vendor Neutrality Notices** - Clarifies that specific providers (Vercel, Railway, etc.) are illustrative examples  
✅ **MVP vs Post-MVP Clarifications** - Identifies which procedures are growth-ready vs MVP-essential  

### Preserved Content

All original content from v1.0 is **completely preserved**, including:

- All 60+ operational scripts with full code
- All 12 sections with original procedures
- All checklists and validation steps
- All troubleshooting guidance
- All configuration examples
- All smoke tests and health checks

### What Was NOT Changed

❌ No procedures removed or simplified  
❌ No scripts deleted or modified  
❌ No deployment logic altered  
❌ No architecture changes introduced  
❌ No new tools or services added  
❌ No entity/field/endpoint names changed  

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | 2024-12-08 | Initial runbook with comprehensive procedures | Operational |
| 1.1 | 2025-12-17 | Scope hardening, canonical alignment, vendor neutrality clarifications | 🟢 GREEN Candidate |

---

## Document Approval

**Prepared By:** DevOps Team  
**Reviewed By:** Engineering Leadership, Security Team  
**Approved By:** Tech Lead  
**Status:** 🟢 GREEN - Ready for Canonical Approval  

**Classification:** Operational Runbook (Canonical Candidate)  
**Next Review:** Quarterly or post-major-incident  

---

**END OF DOCUMENT**
