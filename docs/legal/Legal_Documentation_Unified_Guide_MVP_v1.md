# Legal Documentation Unified Guide (MVP v1)

**Self-Storage Aggregator Platform — Comprehensive Legal & Compliance Documentation Guide**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Title** | Legal Documentation Unified Guide |
| **Version** | 1.0 |
| **Date Created** | December 15, 2025 |
| **Project** | Self-Storage Aggregator MVP |
| **Status** | Active Reference Guide |
| **Authors** | Technical Architecture Team + Legal Team |
| **Target Audience** | All Teams (Development, Legal, Product, Compliance, DevOps) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Document Hierarchy & Positioning](#2-document-hierarchy--positioning)
3. [What Changed in Legal Checklist v1.1](#3-what-changed-in-legal-checklist-v11)
4. [Cross-Reference Matrix](#4-cross-reference-matrix)
5. [Role-Based Quick Reference](#5-role-based-quick-reference)
6. [Migration Guide](#6-migration-guide)
7. [Compliance Workflow](#7-compliance-workflow)
8. [FAQ](#8-faq)

---

# 1. Executive Summary

## 1.1. Purpose of This Document

This unified guide provides a **single source of reference** for understanding:
- How legal and technical compliance documentation is structured in the project
- Where to find authoritative information for different requirements
- How different roles should use the documentation
- How to maintain consistency across documents

## 1.2. Key Changes in Legal Documentation

**Date:** December 15, 2025  
**Affected Document:** Legal Checklist & Compliance Requirements MVP v1

### What Changed:

1. **Document Positioning** — Legal Checklist is now clearly defined as **non-normative guidance**, not a technical specification
2. **Technical Requirements Moved** — All technical implementation details now reference canonical specifications
3. **Code Isolated** — All code examples moved to Reference Appendix and marked as illustrative
4. **Language Adjusted** — Normative language (MUST/SHALL) replaced with legal framing (REQUIRED BY LAW, RECOMMENDED)
5. **De-duplicated** — Detailed technical specifications replaced with references to authoritative sources

### Why This Matters:

- **Prevents Conflicts:** No more competing requirements between legal and technical docs
- **Single Source of Truth:** Each requirement has ONE authoritative location
- **Clearer Roles:** Legal provides compliance context, technical specs provide implementation
- **Easier Maintenance:** Changes happen in one place, references stay valid

## 1.3. Document Ecosystem Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FUNCTIONAL SPECIFICATION                  │
│                   (Product Requirements)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │                                             │
        ▼                                             ▼
┌───────────────────┐                    ┌──────────────────────┐
│  TECHNICAL SPECS  │                    │   LEGAL CHECKLIST    │
│   (CANONICAL)     │◄───────────────────│   (NON-NORMATIVE)    │
└───────────────────┘     references     └──────────────────────┘
        │                                             │
        ├─ API Design Blueprint                      │
        ├─ Database Specification                    │
        ├─ Technical Architecture                    │
        ├─ Security & Compliance Plan ◄──────────────┤
        ├─ Logging Strategy           ◄──────────────┤
        ├─ Error Handling Spec        ◄──────────────┤
        └─ Backend Implementation                    │
                                                      │
                                    Provides legal context,
                                    references technical specs
```

---

# 2. Document Hierarchy & Positioning

## 2.1. Canonical Technical Specifications (SOURCE OF TRUTH)

These documents define **mandatory technical requirements** and implementation details:

### **Tier 1: Core Product & Architecture**

| Document | Role | Audience | When to Use |
|----------|------|----------|-------------|
| **Functional Specification MVP v1** | Defines WHAT the system does | Product, All Teams | Product requirements, feature scope |
| **Technical Architecture Document CANONICAL** | Defines system structure, components, patterns | Backend, DevOps, All Devs | Architecture decisions, service boundaries |

### **Tier 2: Technical Implementation Specs**

| Document | Role | Audience | When to Use |
|----------|------|----------|-------------|
| **API Design Blueprint CANONICAL** | Defines all API endpoints, contracts, errors | Backend, Frontend | API implementation, integration |
| **Full Database Specification CANONICAL** | Defines schema, tables, constraints, PII fields | Backend, DevOps | Database design, migrations |
| **Backend Implementation Plan CANONICAL** | Defines service layer, modules, patterns | Backend | Code structure, implementation |
| **Security & Compliance Plan MVP v1** | Defines technical security controls | Backend, DevOps, Security | Security implementation, PII handling |
| **Logging Strategy & Log Taxonomy MVP v1** | Defines what/how to log, retention | Backend, DevOps | Logging implementation |
| **Error Handling & Fault Tolerance Spec CANONICAL** | Defines error patterns, retry logic | Backend | Error handling code |
| **API Rate Limiting & Throttling Spec CANONICAL** | Defines rate limits, throttling | Backend, DevOps | Rate limiting implementation |

### **Tier 3: Supporting Specs**

| Document | Role | Audience | When to Use |
|----------|------|----------|-------------|
| **Unified Data Dictionary** | Defines entities, fields, enums | All Teams | Naming conventions, field definitions |
| **CRM Specification CANONICAL** | Defines CRM module (if separate) | Backend, Product | CRM feature implementation |

## 2.2. Non-Canonical Guidance Documents

These documents provide **context, interpretation, and guidance** but do NOT define technical requirements:

| Document | Role | Audience | When to Use |
|----------|------|----------|-------------|
| **Legal Checklist & Compliance Requirements v1.1** | Provides legal interpretation, compliance guidance, public legal documents | Legal, DPO, Product, Compliance | Legal compliance questions, policy updates |
| **This Unified Guide** | Navigation, cross-references, role-based guidance | All Teams | Finding the right document, understanding structure |

## 2.3. Conflict Resolution Rules

**When documents conflict, priority is:**

1. **Functional Specification** (product requirements)
2. **Technical Architecture** (system design)
3. **API Design Blueprint** (API contracts)
4. **Database Specification** (data model)
5. **Other Canonical Specs** (alphabetically)
6. **Legal Checklist** (legal guidance only)

**Example:**
- If Legal Checklist says "MUST delete after 30 days"
- But Security & Compliance Plan says "recommended: 30 days, configurable"
- **Security & Compliance Plan wins** (canonical spec)
- Legal Checklist should be updated to reference Security & Compliance Plan

---

# 3. What Changed in Legal Checklist v1.1

## 3.1. Document Role Redefinition

### **Before (v1.0):**
```markdown
# Legal Checklist & Compliance Requirements (MVP v1)
**Complete Documentation**

[Immediately starts with requirements]
```

### **After (v1.1):**
```markdown
## ⚠️ CRITICAL: Document Role & Positioning

**This document is an internal Legal & Compliance Checklist. 
It is NOT a canonical technical specification.**

**Canonical requirements for technical implementation are defined in:**
- Security & Compliance Plan MVP v1
- Logging Strategy & Log Taxonomy MVP v1
[... full list]

**This document does NOT:**
- Override or contradict canonical technical specifications
- Define technical implementation details
[...]
```

**Impact:** Crystal clear that Legal Checklist is guidance, not implementation spec.

## 3.2. Language Changes (MUST → Legal Framing)

### **Category 1: Technical Requirements**

| Before | After | Reasoning |
|--------|-------|-----------|
| "MUST encrypt passwords with bcrypt" | "Encryption SHOULD use bcrypt (REQUIRED BY LAW for sensitive data)" | Technical detail → references Security Plan |
| "MUST mask email in logs" | "Masking SHOULD be implemented according to Logging Strategy" | Implementation → reference canonical spec |
| "MUST delete after 30 days" | "Grace period (recommended: 30 days)" | Specific number → flexible recommendation |

### **Category 2: Legal Obligations**

| Before | After | Reasoning |
|--------|-------|-----------|
| "Must notify within 72 hours" | "within legally mandated timeframe (GDPR: 72 hours)" | Kept legal requirement, added context |
| "Must obtain consent" | "REQUIRED BY LAW to obtain consent" | Clear legal obligation |
| "Must provide access within 30 days" | "as required by applicable law (recommended: 30 days)" | Legal requirement with flexibility |

### **Category 3: Process Requirements**

| Before | After | Reasoning |
|--------|-------|-----------|
| "Operators MUST respond within 24h" | "within timeframe defined by business policy" | Internal policy, not legal |
| "MUST review every 6 months" | "as required by applicable law (recommended: semi-annually)" | Best practice, not mandate |
| "SHALL implement RBAC" | "RECOMMENDED to implement RBAC" | Technical recommendation |

**Total Changes:** ~100+ instances

## 3.3. Code Relocation

### **Before (v1.0):**

Code was embedded throughout the document:

```markdown
## 6.4. Retention Period

**Implementation:**
```typescript
@Cron('0 3 * * *')
async executeRetentionPolicies() {
  await this.deleteExpiredRefreshTokens();
  // ... 50 lines of code
}
```
```

### **After (v1.1):**

Code moved to Appendix with clear warnings:

```markdown
## 6.3. Rules for Log Storage

**LOG RETENTION PERIODS DEFINED IN:**
- **Logging Strategy & Log Taxonomy MVP v1 § 6** — Retention Policy
- **Security & Compliance Plan MVP v1 § 4.5**

**Overview (see Logging Strategy for full details):**
- Application logs: Recommended 90 days
- Security logs: Recommended 1 year
[summary only]

---

# Appendix: Reference Implementations

**⚠️ IMPORTANT: All code in this Appendix is ILLUSTRATIVE.**
**For technical implementation use:**
- Security & Compliance Plan MVP v1
- Logging Strategy & Log Taxonomy MVP v1
```

**Code Blocks Moved:**
- Cookie consent JS → Appendix A.1
- Account deletion TypeScript → Appendix A.2
- GitHub Action YAML → Appendix A.3
- Masking utilities → Referenced in Security Plan
- Retention automation → Referenced in Security Plan

## 3.4. De-duplication Examples

### **Example 1: Logging Requirements**

**Before (v1.0):** 150+ lines of detailed logging requirements, code examples, patterns

**After (v1.1):**
```markdown
## 6. Requirements for Logs Containing Personal Data

**ALL LOGGING REQUIREMENTS DEFINED IN:**
- **Logging Strategy & Log Taxonomy MVP v1**
- **Security & Compliance Plan MVP v1 § 4.4**

## 6.1. What is Forbidden to Log (CRITICAL)

**TECHNICAL IMPLEMENTATION in Security & Compliance Plan § 4.4**

**Never log:**
- Passwords (even hashed)
- Access tokens
- Payment card numbers
[summary list only]
```

**Reduction:** 150 lines → 30 lines + references

### **Example 2: Data Retention**

**Before (v1.0):** Full retention table with automation code, cron jobs, database queries

**After (v1.1):**
```markdown
## 3.1. Data Retention Periods

**ALL RETENTION PERIODS DEFINED IN:**
- **Security & Compliance Plan MVP v1 § 4.5**

**Overview (see Security & Compliance Plan for full table and automation):**

| Data Type | Retention | Action After |
|-----------|-----------|--------------|
| Active users | Indefinite | - |
| Deleted users | Recommended: 30 days | Hard delete |
[summary table only]
```

**Reduction:** 200 lines (including code) → 40 lines + references

### **Example 3: PII Masking**

**Before (v1.0):** Complete TypeScript masking utilities with regex patterns

**After (v1.1):**
```markdown
## 6.2. What Can Be Logged Partially (masked)

**TECHNICAL MASKING IMPLEMENTATION DEFINED IN:**
- **Security & Compliance Plan MVP v1 § 4.4**

**Masking patterns overview (see Security & Compliance Plan for code):**
- Email: john.doe@example.com → j***e@e*****e.com
- Phone: +971501234567 → +7999***4567
[examples only, no implementation]
```

**Reduction:** 80 lines of code → 15 lines + reference

## 3.5. New Metadata Section

**Added at end of document:**

```markdown
# Document Metadata & Status

## Document Classification
**Type:** Internal Legal & Compliance Checklist  
**Status:** Non-Normative (for compliance guidance only)  
**Audience:** Legal Team, DPO, Product Managers, Compliance Officers  
**Change Policy:** Updated upon legal, regulatory, or product changes

## Relationship to Technical Specifications
[clear statement of what document does/doesn't do]

## Maintenance
**Maintained by:** Legal Team + DPO  
**Review Frequency:** As required by applicable law (recommended: Semi-annually)  
**Next Scheduled Review:** June 2026  

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-09 | Initial version | Legal Team |
| 1.1 | 2025-12-15 | Refactored: positioning, de-duplication | Legal Team |
```

---

# 4. Cross-Reference Matrix

## 4.1. Requirements by Topic → Where to Find

### **Authentication & Authorization**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Password hashing | Legal Checklist § 1.2.6 | Security & Compliance Plan § 4.1 |
| Token expiration | Legal Checklist § 3.1 | Security & Compliance Plan § 4.2 |
| RBAC | Legal Checklist (references) | Backend Implementation Plan § 3 |
| API authentication | Legal Checklist (references) | API Design Blueprint § 6 |

### **Personal Data (PII)**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| What is PII | Legal Checklist § 5.1 | Database Specification § 10.1 |
| PII classification | Legal Checklist § 5.2 | Security & Compliance Plan § 4.3 |
| PII in logs | Legal Checklist § 6.1 | Logging Strategy § 4 |
| PII masking | Legal Checklist § 6.2 | Security & Compliance Plan § 4.4 |
| PII encryption | Legal Checklist (overview) | Security & Compliance Plan § 4.1 |

### **Data Retention & Deletion**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Retention periods | Legal Checklist § 3.1 | Security & Compliance Plan § 4.5 |
| User account deletion | Legal Checklist § 3.2 | Security & Compliance Plan § 4.6 |
| Operator account deletion | Legal Checklist § 3.3 | Security & Compliance Plan § 4.6 |
| Log retention | Legal Checklist § 6.3 | Logging Strategy § 6 |
| Backup retention | Legal Checklist § 3.5 | Security & Compliance Plan § 4.5 |
| Automation | Legal Checklist (references) | Security & Compliance Plan § 4.5 (code) |

### **Logging**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| What to log | Legal Checklist § 6 | Logging Strategy § 2-3 |
| What NOT to log | Legal Checklist § 6.1 | Logging Strategy § 4 |
| Log masking | Legal Checklist § 6.2 | Security & Compliance Plan § 4.4 |
| Log retention | Legal Checklist § 6.3 | Logging Strategy § 6 |
| Log structure | Legal Checklist (references) | Logging Strategy § 5 |
| Audit logs | Legal Checklist (references) | Logging Strategy § 3 |

### **Cookies & Consent**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Cookie categories | Legal Checklist § 4.2 | Frontend implementation (TBD) |
| Cookie banner | Legal Checklist § 4.2 | Legal Checklist Appendix A.1 (reference) |
| Consent logging | Legal Checklist § 2.3.5 | Logging Strategy § 4.3 |
| Consent storage | Legal Checklist § 2.3 | Database Specification (consent_logs table) |

### **User Rights (GDPR)**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Right to access | Legal Checklist § 2.4.1 | API Design Blueprint (export endpoint) |
| Right to erasure | Legal Checklist § 2.4.3 | Security & Compliance Plan § 4.6 |
| Right to rectification | Legal Checklist § 2.4.2 | API Design Blueprint (update endpoints) |
| Right to portability | Legal Checklist § 2.4.5 | Legal Checklist Appendix A.5 (reference) |
| Data export format | Legal Checklist § 2.4.5 | API Design Blueprint |

### **Error Handling**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Error format | Legal Checklist (references) | API Design Blueprint § 8 |
| Error codes | Legal Checklist (references) | Error Handling Spec § 2-4 |
| PII in errors | Legal Checklist § 6.1 | Error Handling Spec § 11 |
| Rate limit errors | Legal Checklist (references) | API Rate Limiting Spec § 8 |

### **Security**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Encryption at rest | Legal Checklist § 1.2.6 | Security & Compliance Plan § 4.1 |
| Encryption in transit | Legal Checklist § 1.2.6 | Security & Compliance Plan § 4.1 |
| Breach notification | Legal Checklist § 2.5.1 | Security & Compliance Plan § 7 |
| Security monitoring | Legal Checklist (references) | Technical Architecture § 5.5 |
| Access control | Legal Checklist (references) | Security & Compliance Plan § 4.2 |

### **Third-Party Integrations**

| Requirement | Legal Context | Technical Implementation |
|-------------|---------------|-------------------------|
| Data Processing Agreement (DPA) | Legal Checklist § 1.4 | Legal Checklist (template) |
| Third-party processors | Legal Checklist § 1.2.4 | Security & Compliance Plan § 8 |
| API integrations | Legal Checklist (references) | Technical Architecture § 4 |

## 4.2. By Document → What It Covers

### **Legal Checklist & Compliance Requirements v1.1**

**Covers:**
- ✅ Public legal documents (Terms, Privacy Policy, Cookie Policy, DPA)
- ✅ Personal data categories and legal classification
- ✅ Legal bases for processing (GDPR Art. 6, UAE PDPL (Federal Decree-Law No. 45/2021))
- ✅ User rights under GDPR/UAE PDPL (Federal Decree-Law No. 45/2021)
- ✅ Compliance obligations (DPO, breach notification, etc.)
- ✅ Legal framing for retention periods
- ✅ Cookie consent requirements (legal)
- ✅ Process for updating legal documents
- ✅ Compliance checklist for MVP launch

**Does NOT Cover:**
- ❌ Technical implementation of any feature
- ❌ Code examples (moved to Appendix as reference only)
- ❌ Specific retention automation (see Security Plan)
- ❌ Specific masking implementation (see Security Plan)
- ❌ API endpoints or error codes (see API Blueprint)
- ❌ Database schema (see Database Specification)

**Use When:**
- Writing/updating Terms of Service or Privacy Policy
- Responding to user rights requests (GDPR)
- Planning compliance processes
- Consulting with DPO or legal counsel
- Understanding legal context for features

**Don't Use When:**
- Implementing logging, security, or data retention (use canonical specs)
- Designing APIs or database schema
- Writing production code

---

### **Security & Compliance Plan MVP v1**

**Covers:**
- ✅ Technical security controls (encryption, hashing, TLS)
- ✅ Authentication & authorization implementation
- ✅ PII classification and technical handling
- ✅ Masking utilities (TypeScript code)
- ✅ Data retention automation (TypeScript code)
- ✅ Account deletion process (TypeScript code)
- ✅ Breach response procedures
- ✅ Third-party security assessment

**Use When:**
- Implementing security features
- Handling PII in code
- Setting up encryption
- Automating data retention
- Implementing account deletion

---

### **Logging Strategy & Log Taxonomy MVP v1**

**Covers:**
- ✅ What to log (events, errors, audit)
- ✅ What NOT to log (PII restrictions)
- ✅ Log structure and format
- ✅ Log levels and categorization
- ✅ Log retention periods (by type)
- ✅ PII masking in logs
- ✅ Correlation IDs and tracing

**Use When:**
- Adding logging to any service
- Defining log retention policies
- Setting up log aggregation
- Debugging with logs
- Auditing system behavior

---

### **API Design Blueprint CANONICAL**

**Covers:**
- ✅ All API endpoints (paths, methods, params)
- ✅ Request/response DTOs
- ✅ Authentication requirements per endpoint
- ✅ Error response format (canonical)
- ✅ Rate limiting rules
- ✅ Validation rules
- ✅ API versioning

**Use When:**
- Implementing any API endpoint
- Integrating frontend with backend
- Defining error responses
- Setting up API rate limiting
- Writing API tests

---

### **Database Specification CANONICAL**

**Covers:**
- ✅ All tables, columns, types, constraints
- ✅ Relationships (foreign keys)
- ✅ Indexes for performance
- ✅ PII field identification
- ✅ Soft delete strategy
- ✅ Migration order

**Use When:**
- Creating database migrations
- Querying database
- Understanding data model
- Identifying PII fields
- Planning schema changes

---

### **Error Handling & Fault Tolerance Spec CANONICAL**

**Covers:**
- ✅ Error handling patterns (try-catch, exceptions)
- ✅ Error codes and taxonomy
- ✅ Retry logic (when and how)
- ✅ Circuit breaker pattern
- ✅ Fallback strategies
- ✅ Error logging requirements
- ✅ PII in error messages (forbidden)

**Use When:**
- Implementing error handling in services
- Defining custom exceptions
- Setting up retry logic
- Implementing circuit breakers
- Writing error logs

---

# 5. Role-Based Quick Reference

## 5.1. For Backend Developers

### **Primary Documents:**

1. **API Design Blueprint** — API contracts, endpoints, DTOs
2. **Backend Implementation Plan** — Service architecture, layering
3. **Database Specification** — Schema, queries, migrations
4. **Security & Compliance Plan** — PII handling, encryption, authentication
5. **Logging Strategy** — What/how to log
6. **Error Handling Spec** — Error patterns, retry logic

### **When to Reference Legal Checklist:**
- ❌ **Never for implementation** — always use canonical specs
- ✅ **Only for context** — understanding why certain requirements exist

### **Quick Checklist for New Code:**

```
Before writing code:
☐ Check API Blueprint for endpoint specification
☐ Check Database Spec for schema requirements
☐ Check Security Plan for PII handling requirements
☐ Check Logging Strategy for what to log
☐ Check Error Handling Spec for error patterns

When handling PII:
☐ Use masking utilities from Security Plan § 4.4
☐ Never log full PII (see Logging Strategy § 4)
☐ Use encryption where required (see Security Plan § 4.1)

When logging:
☐ Follow format from Logging Strategy § 5
☐ Use correlation IDs (trace_id)
☐ Mask PII (use MaskingUtils from Security Plan)
☐ Use appropriate log level

When handling errors:
☐ Use canonical error format (API Blueprint § 8)
☐ Never expose internal details to client
☐ Log errors with full context (server-side only)
☐ Use appropriate HTTP status codes
```

### **Code Snippets You Can Use:**

**All code snippets are in:**
- Security & Compliance Plan § 4.4 (masking)
- Security & Compliance Plan § 4.5 (retention automation)
- Security & Compliance Plan § 4.6 (account deletion)
- Logging Strategy (log format)
- Error Handling Spec (error patterns)

**DO NOT use code from Legal Checklist Appendix** — it's illustrative only.

---

## 5.2. For Frontend Developers

### **Primary Documents:**

1. **API Design Blueprint** — API endpoints, request/response format
2. **Functional Specification** — Product requirements, user flows
3. **Error Handling Spec** — How to handle API errors

### **When to Reference Legal Checklist:**
- ✅ Cookie banner requirements (§ 4.2)
- ✅ Consent UI requirements (§ 2.3)
- ✅ User rights features (export data, delete account)
- ❌ Not for technical implementation details

### **Quick Checklist for New Features:**

```
Before implementing UI:
☐ Check Functional Spec for product requirements
☐ Check API Blueprint for available endpoints
☐ Check Legal Checklist for compliance UI requirements

When handling user data:
☐ Use API endpoints from API Blueprint
☐ Display errors using format from Error Handling Spec
☐ Never store PII in browser storage without encryption

For cookie banner:
☐ Reference Legal Checklist § 4.2 for requirements
☐ Use reference implementation from Legal Checklist Appendix A.1
☐ Send consent to backend API (see API Blueprint)

For user rights:
☐ Export data: use /api/v1/users/me/export
☐ Delete account: use /api/v1/users/me/delete
☐ Update profile: use /api/v1/users/me
```

---

## 5.3. For Product Managers

### **Primary Documents:**

1. **Functional Specification** — Product scope, features, user flows
2. **Legal Checklist** — Compliance requirements, legal context
3. **API Design Blueprint** — Understanding technical feasibility

### **When to Reference Legal Checklist:**
- ✅ Planning new features (compliance impact)
- ✅ Writing PRDs (compliance requirements)
- ✅ User stories involving PII
- ✅ Understanding user rights features
- ✅ Planning marketing/analytics features

### **Quick Checklist for New Features:**

```
Before adding to roadmap:
☐ Check Functional Spec for MVP scope
☐ Check Legal Checklist for compliance impact
☐ Does feature process PII? → Consult Legal Checklist § 5
☐ Does feature require new cookies? → Check Legal Checklist § 4
☐ Does feature change data retention? → Check Legal Checklist § 3

When writing PRD:
☐ Include compliance requirements from Legal Checklist
☐ Reference relevant sections of canonical specs
☐ Flag any potential legal/compliance concerns
☐ Include acceptance criteria for compliance

For features involving PII:
☐ What PII is collected? (Legal Checklist § 5.1)
☐ What is legal basis? (Legal Checklist § 2.2)
☐ Do we need explicit consent? (Legal Checklist § 2.3)
☐ How long do we keep it? (Legal Checklist § 3.1)
☐ How do we delete it? (Legal Checklist § 3.2)

For third-party integrations:
☐ Is DPA needed? (Legal Checklist § 1.4)
☐ Privacy Policy update needed? (Legal Checklist § 1.2)
☐ Cookie Policy update needed? (Legal Checklist § 1.3)
```

---

## 5.4. For Legal Team / DPO

### **Primary Documents:**

1. **Legal Checklist** — Legal requirements, compliance processes, public documents
2. **Security & Compliance Plan** — Technical implementation of compliance
3. **Functional Specification** — Understanding product features

### **When to Reference Technical Specs:**
- ✅ Verifying technical compliance implementation
- ✅ Updating Privacy Policy (what data is collected/processed)
- ✅ Responding to regulator inquiries
- ✅ Conducting compliance audits

### **Quick Reference:**

```
For GDPR/UAE PDPL (Federal Decree-Law No. 45/2021) compliance:
☐ PII categories: Legal Checklist § 5.1 + Database Spec § 10.1
☐ Legal bases: Legal Checklist § 2.2
☐ User rights: Legal Checklist § 2.4
☐ Retention periods: Legal Checklist § 3.1 + Security Plan § 4.5
☐ Consent management: Legal Checklist § 2.3
☐ Breach notification: Legal Checklist § 2.5.1 + Security Plan § 7

For public legal documents:
☐ Terms of Service: Legal Checklist § 1.1
☐ Privacy Policy: Legal Checklist § 1.2
☐ Cookie Policy: Legal Checklist § 1.3
☐ DPA (for operators): Legal Checklist § 1.4

For technical verification:
☐ Is PII masked in logs? → Check Logging Strategy § 4
☐ Is data encrypted? → Check Security Plan § 4.1
☐ Is retention automated? → Check Security Plan § 4.5
☐ Is deletion implemented? → Check Security Plan § 4.6

For document updates:
☐ Process: Legal Checklist § 7
☐ Versioning: Legal Checklist § 7.3
☐ User notification: Legal Checklist § 7.5
```

---

## 5.5. For DevOps / SRE

### **Primary Documents:**

1. **Technical Architecture** — Infrastructure, deployment
2. **Security & Compliance Plan** — Security configuration, encryption
3. **Logging Strategy** — Log aggregation, retention
4. **Database Specification** — Database setup, backups

### **When to Reference Legal Checklist:**
- ✅ Understanding retention requirements
- ✅ Configuring log rotation
- ✅ Planning backup strategies
- ❌ Not for implementation details (use canonical specs)

### **Quick Checklist:**

```
For infrastructure setup:
☐ TLS 1.2+ required (Security Plan § 4.1)
☐ Encryption at rest (Security Plan § 4.1)
☐ Network security (Technical Architecture § 5)
☐ Access control (Security Plan § 4.2)

For logging setup:
☐ Log aggregation: Logging Strategy § 7
☐ Log retention: Logging Strategy § 6
☐ PII masking: Security Plan § 4.4 (server-side)
☐ Log rotation: Logging Strategy § 6

For backups:
☐ Retention: Security Plan § 4.5
☐ Encryption: Security Plan § 4.1
☐ DR strategy: Technical Architecture

For monitoring:
☐ Security alerts: Security Plan § 7
☐ Error rates: Error Handling Spec § 12
☐ Performance: Technical Architecture § 5.5
```

---

## 5.6. For QA / Testing

### **Primary Documents:**

1. **Functional Specification** — Product requirements, test cases
2. **API Design Blueprint** — API contracts, expected responses
3. **Error Handling Spec** — Error scenarios, edge cases

### **When to Reference Legal Checklist:**
- ✅ Testing compliance features (consent, export data, delete account)
- ✅ Verifying PII handling
- ✅ Testing cookie banner

### **Quick Checklist:**

```
For compliance testing:
☐ Cookie banner works: Legal Checklist § 4.2
☐ Consent is recorded: check consent_logs table
☐ Export data works: API Blueprint (export endpoint)
☐ Delete account works: Security Plan § 4.6
☐ PII is masked in logs: Logging Strategy § 4

For API testing:
☐ All endpoints match API Blueprint
☐ Error format matches API Blueprint § 8
☐ Rate limiting works: API Rate Limiting Spec
☐ Authentication works: Security Plan § 4.2

For data testing:
☐ PII fields match Database Spec § 10.1
☐ Soft delete works: Database Spec § 10.2
☐ Constraints work: Database Spec (per table)
```

---

# 6. Migration Guide

## 6.1. For Teams Using Legal Checklist v1.0

### **What You Need to Do:**

#### **1. Update Your References (CRITICAL)**

If your code or documentation references Legal Checklist for technical requirements:

**❌ STOP doing this:**
```typescript
// BAD: Referencing Legal Checklist for implementation
// As per Legal Checklist § 6.1, mask email in logs
logger.info(`User registered: ${maskEmail(email)}`);
```

**✅ START doing this:**
```typescript
// GOOD: Reference canonical spec
// As per Logging Strategy § 4, mask PII in logs
// Implementation from Security & Compliance Plan § 4.4
logger.info(`User registered: ${MaskingUtils.maskEmail(email)}`);
```

#### **2. Find Correct Source of Truth**

Use this mapping to update your references:

| If you were referencing Legal Checklist for: | Update to reference: |
|----------------------------------------------|---------------------|
| Logging requirements | Logging Strategy § 4 |
| Masking implementation | Security & Compliance Plan § 4.4 |
| Retention periods | Security & Compliance Plan § 4.5 |
| Account deletion | Security & Compliance Plan § 4.6 |
| Error format | API Design Blueprint § 8 |
| PII fields | Database Specification § 10.1 |
| API endpoints | API Design Blueprint |

#### **3. Update Internal Documentation**

**Documents to check:**
- Code comments
- README files
- Wiki pages
- Confluence pages
- Runbooks
- Architecture Decision Records (ADRs)

**Search for:** "Legal Checklist", "Legal_Checklist_Compliance_Requirements"

**Replace with:** Appropriate canonical spec

#### **4. Update Tests**

If your tests reference Legal Checklist:

```typescript
// BEFORE
describe('As per Legal Checklist § 6.1', () => {
  it('should mask email in logs', () => {
    // test
  });
});

// AFTER
describe('As per Logging Strategy § 4', () => {
  it('should mask PII in logs', () => {
    // test
  });
});
```

## 6.2. Transition Timeline

### **Phase 1: Immediate (Week 1)**
- ✅ Read this Unified Guide
- ✅ Update any active PRs referencing Legal Checklist
- ✅ Update README files in repositories
- ✅ Communicate to team

### **Phase 2: Short-term (Weeks 2-4)**
- ⏳ Audit all code comments
- ⏳ Update internal wiki/Confluence
- ⏳ Update test descriptions
- ⏳ Update CI/CD configurations

### **Phase 3: Ongoing**
- 🔄 Use this Unified Guide for navigation
- 🔄 Reference canonical specs in new code
- 🔄 Update Legal Checklist only for legal content

## 6.3. Common Migration Questions

### **Q: Should I delete Legal Checklist v1.0?**
**A:** No. Legal Checklist v1.1 is still valuable for:
- Legal compliance context
- Public legal documents (Terms, Privacy, etc.)
- Understanding why certain requirements exist
- DPO and legal team reference

Just don't use it for technical implementation.

### **Q: Which version should I use going forward?**
**A:** Legal Checklist v1.1 (refactored version)

### **Q: What if I find conflicts between documents?**
**A:** Use conflict resolution rules (Section 2.3 of this guide). Canonical technical specs always win over Legal Checklist.

### **Q: Can I still use code examples from Legal Checklist Appendix?**
**A:** Code in Appendix is **illustrative only**. For production code, use:
- Security & Compliance Plan (for security/PII code)
- Logging Strategy (for logging code)
- Backend Implementation Plan (for architecture patterns)

### **Q: Who maintains Legal Checklist now?**
**A:** Legal Team + DPO (for legal content only). Technical content is maintained in canonical specs by respective owners.

---

# 7. Compliance Workflow

## 7.1. Adding a New Feature — Compliance Checklist

### **Step 1: Initial Assessment (Product Manager)**

```
Feature: [Feature Name]
PM: [Name]
Date: [Date]

Compliance Quick Check:
☐ Does this feature collect/process PII?
  → If YES: What PII? (see Legal Checklist § 5.1)
  
☐ Does this feature require new cookies?
  → If YES: What type? (see Legal Checklist § 4.2)
  
☐ Does this feature involve third-party services?
  → If YES: Do we need DPA? (see Legal Checklist § 1.4)
  
☐ Does this feature change data retention?
  → If YES: What retention period? (see Security Plan § 4.5)
  
☐ Does this feature require explicit consent?
  → If YES: What consent? (see Legal Checklist § 2.3)

If ANY "YES" → Proceed to Step 2
If ALL "NO" → Proceed with normal development
```

### **Step 2: Legal Review (DPO + Legal Team)**

```
Feature: [Feature Name]
Reviewer: [DPO/Legal]
Date: [Date]

Legal Assessment:
☐ Legal basis for processing: [Consent / Contract / Legitimate Interest]
☐ Privacy Policy update needed: [YES / NO]
☐ Terms of Service update needed: [YES / NO]
☐ Cookie Policy update needed: [YES / NO]
☐ DPA needed with third party: [YES / NO]
☐ Special consent flow needed: [YES / NO]

Risks Identified:
- [List any compliance risks]

Recommendations:
- [List recommendations]

Approval: [APPROVED / CHANGES NEEDED / DENIED]
```

### **Step 3: Technical Design (Tech Lead + Backend)**

```
Feature: [Feature Name]
Tech Lead: [Name]
Date: [Date]

Technical Compliance Design:
☐ PII handling:
  - Fields: [list PII fields]
  - Classification: [HIGH / MEDIUM / LOW]
  - Storage: [Database Spec table]
  - Encryption: [YES / NO, where]
  
☐ Logging:
  - What to log: [events]
  - PII masking: [YES, using MaskingUtils]
  - Retention: [period, see Logging Strategy]
  
☐ API design:
  - Endpoints: [list]
  - Authentication: [required]
  - Rate limiting: [limits]
  
☐ Data retention:
  - Retention period: [period]
  - Deletion: [manual / automated]
  - Automation: [cron / event-based]

Implementation References:
- Security & Compliance Plan: [sections]
- Logging Strategy: [sections]
- API Blueprint: [sections]
- Database Spec: [sections]
```

### **Step 4: Implementation (Developers)**

```
Feature: [Feature Name]
Developer: [Name]
Date: [Date]

Implementation Checklist:
☐ API endpoints match API Blueprint
☐ Database schema matches Database Spec
☐ PII handling follows Security Plan § 4.3
☐ Logging follows Logging Strategy
☐ Error handling follows Error Handling Spec
☐ Masking uses MaskingUtils from Security Plan
☐ Tests cover compliance requirements
☐ Code reviewed by Tech Lead

Code References:
- [link to PR]
- [link to implementation]
```

### **Step 5: Testing (QA)**

```
Feature: [Feature Name]
QA: [Name]
Date: [Date]

Compliance Testing:
☐ PII is masked in logs (check log files)
☐ Data is encrypted (if required)
☐ Consent is recorded (check consent_logs table)
☐ Export data works (if feature involves PII)
☐ Delete account still works (if feature involves PII)
☐ Cookie banner updated (if new cookies)
☐ Privacy Policy reflects feature (if PII)

Test Results:
- [PASS / FAIL]
- [Issues found]
```

### **Step 6: Pre-Launch (Legal + PM)**

```
Feature: [Feature Name]
Date: [Date]

Final Compliance Check:
☐ Privacy Policy updated and published
☐ Terms of Service updated (if needed)
☐ Cookie Policy updated (if needed)
☐ Users notified (if MAJOR change)
☐ DPA signed (if third-party)
☐ Consent flows tested
☐ All compliance tests PASS

Approval to Launch: [APPROVED / HOLD]
```

## 7.2. Regular Compliance Audits

### **Quarterly Audit Checklist**

```
Quarter: [Q1/Q2/Q3/Q4] [Year]
Auditor: [DPO]
Date: [Date]

Documentation Review:
☐ Privacy Policy current (last updated: [date])
☐ Terms of Service current (last updated: [date])
☐ Cookie Policy current (last updated: [date])
☐ All DPAs signed and current
☐ Legal Checklist reviewed (last review: [date])

Technical Review:
☐ PII masking working (check logs)
☐ Encryption in place (at rest and in transit)
☐ Data retention automation running (check cron logs)
☐ Account deletion working (test user deletion)
☐ Consent logging working (check consent_logs table)
☐ Cookie banner working (test in browser)

Process Review:
☐ Breach response plan current
☐ DPO contact info current
☐ User rights requests handled timely (avg response: [days])
☐ Legal document versioning working
☐ Team trained on compliance

Issues Found:
- [List issues]

Action Items:
- [List action items]

Next Audit: [Date]
```

---

# 8. FAQ

## 8.1. General Questions

### **Q: What's the difference between Legal Checklist and Security & Compliance Plan?**

**A:**
- **Legal Checklist:** Legal interpretation, compliance context, public legal documents. **Non-normative.**
- **Security & Compliance Plan:** Technical implementation of security and compliance. **Canonical specification.**

**Example:**
- Legal Checklist: "Data SHOULD be encrypted (REQUIRED BY LAW)"
- Security Plan: "Use bcrypt for passwords, AES-256 for database encryption, TLS 1.2+ for transit"

### **Q: Which document should I read first?**

**A:** Depends on your role:
- **Developer:** Technical Architecture → API Blueprint → Backend Plan
- **Product Manager:** Functional Specification → Legal Checklist
- **Legal/DPO:** Legal Checklist → Security Plan (for verification)
- **DevOps:** Technical Architecture → Security Plan → Logging Strategy

### **Q: Can canonical specs reference Legal Checklist?**

**A:** Yes, but only for **legal context**, not for technical requirements.

**Example:**
```markdown
## 4.3. PII Classification

**Legal Context:** See Legal Checklist § 5.2 for legal classification framework.

**Technical Implementation:**
- HIGH sensitivity PII: email, phone → encrypt at rest, mask in logs
- MEDIUM sensitivity PII: name, address → mask in logs
[... technical details]
```

## 8.2. Legal & Compliance Questions

### **Q: Do I need to update Privacy Policy for every new feature?**

**A:** Only if the feature:
- Collects new types of PII
- Processes PII for new purposes
- Involves new third-party services
- Changes retention periods

See Legal Checklist § 7.6 for triggers.

### **Q: How do I know if I need explicit consent?**

**A:** You need explicit consent if:
- Using non-essential cookies (analytics, marketing)
- Processing PII beyond contract execution
- Sharing PII with third parties (beyond DPA)
- Using geolocation
- Marketing communications

See Legal Checklist § 2.3 for details.

### **Q: What's the difference between GDPR and UAE PDPL (Federal Decree-Law No. 45/2021)?**

**A:** For MVP purposes, we comply with both. Key differences:
- GDPR: 72-hour breach notification, €20M fines
- UAE PDPL (Federal Decree-Law No. 45/2021): TDRA (Telecommunications Роскомнадзор Digital Government Regulatory Authority) registration required

Legal Checklist addresses both. Security Plan implements technical requirements.

### **Q: How long do we keep user data?**

**A:** See:
- Legal Checklist § 3.1 for legal context
- Security & Compliance Plan § 4.5 for technical retention periods

Default: Active users indefinitely, deleted users 30 days, completed bookings 3 years.

## 8.3. Technical Implementation Questions

### **Q: Where's the code for PII masking?**

**A:** Security & Compliance Plan § 4.4

```typescript
import { MaskingUtils } from '@/common/utils/masking.utils';

const maskedEmail = MaskingUtils.maskEmail(email);
const maskedPhone = MaskingUtils.maskPhone(phone);
```

### **Q: How do I log without exposing PII?**

**A:** Use logger from Logging Strategy § 5:

```typescript
// ❌ BAD
logger.info(`User ${email} registered`);

// ✅ GOOD
logger.info('User registered', { user_id: user.id });
```

See Logging Strategy § 4 for complete PII rules.

### **Q: What error format should I use?**

**A:** Use canonical format from API Blueprint § 8:

```json
{
  "error_code": "box_not_available",
  "message": "К сожалению, бокс только что забронирован",
  "details": {
    "box_id": 123
  }
}
```

**DO NOT** use format from Legal Checklist (it may have legacy format).

### **Q: Where do I find database schema?**

**A:** Database Specification CANONICAL

All tables, columns, types, constraints, indexes are defined there.

### **Q: Can I use code from Legal Checklist Appendix?**

**A:** Code in Legal Checklist Appendix is **ILLUSTRATIVE ONLY**.

For production code, use:
- Security & Compliance Plan (security, PII, retention)
- Logging Strategy (logging)
- Error Handling Spec (errors)
- Backend Implementation Plan (architecture)

## 8.4. Process Questions

### **Q: How do I update Legal Checklist?**

**A:** See Legal Checklist § 7

Process:
1. Legal Team creates draft
2. DPO reviews (if PII-related)
3. CTO reviews (if technical references)
4. CEO approves (if MAJOR)
5. Publish and notify users

### **Q: How often should we review legal documents?**

**A:** Recommended:
- Terms of Service: Every 6 months
- Privacy Policy: Every 6 months
- Cookie Policy: Annually
- DPA: Annually

See Legal Checklist § 7.6 for details.

### **Q: What if I find a conflict between documents?**

**A:** Use conflict resolution (Section 2.3 of this guide):
1. Functional Specification (product)
2. Technical Architecture (system design)
3. API Blueprint (API contracts)
4. Database Specification (data model)
5. Other canonical specs
6. Legal Checklist (guidance)

Report conflict to Tech Lead + Legal for resolution.

## 8.5. Migration Questions

### **Q: I have code referencing Legal Checklist v1.0, what do I do?**

**A:** See Migration Guide (Section 6.1)

**Quick answer:**
1. Identify what you're referencing (logging? retention? masking?)
2. Find correct canonical spec (see cross-reference matrix)
3. Update your code/comments to reference canonical spec
4. Test that behavior hasn't changed

### **Q: Is Legal Checklist v1.0 deprecated?**

**A:** No. v1.0 is superseded by v1.1, but the document itself is still active.

v1.1 has:
- Proper positioning (non-normative)
- References to canonical specs
- Code in Appendix (illustrative)

Use v1.1 going forward.

### **Q: What if I already implemented something based on Legal Checklist v1.0?**

**A:** Your implementation is probably fine (requirements haven't changed, just organization).

**Verify:**
1. Check that your implementation matches canonical spec
2. If different, canonical spec wins
3. Update code comments to reference canonical spec

---

# 9. Summary & Key Takeaways

## 9.1. The Three Golden Rules

### **Rule 1: One Requirement, One Source**
Every technical requirement has exactly ONE authoritative location (canonical spec). Legal Checklist provides context, not implementation.

### **Rule 2: References, Not Duplication**
Documents should reference each other, not duplicate content. If you find duplication, one document should defer to the other.

### **Rule 3: Legal Context vs. Technical Implementation**
Legal Checklist = WHY (legal obligations, compliance context)  
Canonical Specs = HOW (technical implementation)

## 9.2. Quick Navigation

**Need to know...**

| What | Where |
|------|-------|
| What the system does | Functional Specification |
| How the system is structured | Technical Architecture |
| API contracts | API Design Blueprint |
| Database schema | Database Specification |
| How to handle PII | Security & Compliance Plan |
| What to log | Logging Strategy |
| How to handle errors | Error Handling Spec |
| Legal compliance | Legal Checklist |
| Where to find things | This Unified Guide |

## 9.3. Who Maintains What

| Document | Owner | Frequency |
|----------|-------|-----------|
| Functional Specification | Product Team | Per release |
| Technical Architecture | Tech Lead / Architect | Per major version |
| API Blueprint | Backend Lead | Per API change |
| Database Specification | Backend Lead | Per schema change |
| Security & Compliance Plan | Security Team + Backend | Quarterly |
| Logging Strategy | DevOps + Backend | Quarterly |
| Error Handling Spec | Backend Lead | As needed |
| Legal Checklist | Legal + DPO | Semi-annually |
| Unified Guide | Tech Lead + Legal | Semi-annually |

## 9.4. Getting Help

| Question Type | Contact |
|--------------|---------|
| Product requirements | Product Manager |
| Technical architecture | Tech Lead / Architect |
| API design | Backend Lead |
| Security / PII handling | Security Team |
| Legal compliance | DPO / Legal Team |
| DevOps / Infrastructure | DevOps Lead |
| "Where do I find...?" | This Unified Guide or Tech Lead |

---

## 10. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-15 | Initial unified guide | Technical Architecture Team + Legal Team |

---

## 11. Contacts

**Technical Questions:** tech-lead@platform.com  
**Legal Questions:** legal@platform.com  
**DPO / Privacy:** dpo@platform.com  
**Product Questions:** product@platform.com  
**DevOps Questions:** devops@platform.com

---

**END OF UNIFIED GUIDE**

---

**Document Status:** Active Reference Guide  
**Maintenance:** Quarterly review by Tech Lead + Legal  
**Next Review:** March 2026
