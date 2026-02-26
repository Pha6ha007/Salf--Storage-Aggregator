# Legal Checklist & Compliance Requirements (MVP v1)
**Self-Storage Aggregator Platform**

**Document ID:** DOC-054  
**Version:** 1.0 CANONICAL  
**Status:** Canonical — MVP v1 Only  
**Date:** December 2025  
**Scope:** Legal requirements checklist (WHAT), not implementation (HOW)

---

## Document Metadata

| Parameter | Value |
|-----------|-------|
| **Project** | Self-Storage Aggregator MVP v1 |
| **Type** | Legal & Compliance Checklist |
| **Target Audience** | Legal Team, DPO, Product Management, Engineering Leadership |
| **Priority** | MUST for MVP v1 Launch |
| **Dependencies** | DOC-020 (Audit Logging), Security & Compliance Plan, DevOps Plan |

---

## Document Role & Scope

### Purpose
This document defines the **legal and compliance requirements** that MUST be satisfied for the Self-Storage Aggregator platform MVP v1 to launch and operate lawfully.

### What This Document IS
- **Legal requirements checklist** — WHAT obligations must be met
- **Compliance boundaries** — WHAT data protection rules apply
- **Mandatory deliverables** — WHAT documents and processes are required
- **Regulatory constraints** — WHAT legal frameworks govern the platform

### What This Document IS NOT
- **Technical implementation guide** — HOW requirements are enforced is defined in technical specifications
- **API/database specification** — Technical implementation details are in DOC-020, Security Plan, DevOps Plan
- **Automation procedures** — Operational HOW-TOs are in separate operational documents
- **Multi-region strategy** — International expansion is covered in DOC-059

### Canonical Boundaries
**Technical implementation of legal requirements is defined in:**
- **DOC-020** — Audit Logging Specification (log retention, masking mechanics, rotation)
- **Security & Compliance Plan** — Encryption, TLS, access control, security measures
- **DevOps Infrastructure Plan** — Storage systems, backup procedures, infrastructure security
- **DOC-039** — Deployment Runbook (operational procedures)

**This document defines the legal "MUST," those documents define the technical "HOW."**

---

## Initial Jurisdiction & Scope

| Parameter | Value |
|-----------|-------|
| **Primary Jurisdiction** | Russian Federation |
| **Applicable Law** | Federal Law No. 152-FZ (Personal Data) |
| **Geographic Scope** | MVP v1 operates in Russia only |
| **Future Expansion** | Multi-country architecture defined in DOC-059; legal extensions handled separately |

**Note:** This document does NOT define multi-country compliance logic. Regional expansion requires separate legal assessment and documentation updates.

---

## Table of Contents

1. [Legal Documents Required](#1-legal-documents-required)
2. [Personal Data Requirements](#2-personal-data-requirements)
3. [Data Retention Policy](#3-data-retention-policy)
4. [Cookie Consent Requirements](#4-cookie-consent-requirements)
5. [PII Classification](#5-pii-classification)
6. [Logging Requirements](#6-logging-requirements)
7. [Legal Document Governance](#7-legal-document-governance)
8. [Non-Goals (MVP v1)](#8-non-goals-mvp-v1)
9. [MVP Compliance Checklist](#9-mvp-compliance-checklist)

---

## 1. Legal Documents Required

### 1.1. Mandatory Public Documents

The platform MUST publish and maintain the following legal documents:

| Document | Purpose | Acceptance Method | Language |
|----------|---------|------------------|----------|
| **Terms of Service (ToS)** | Defines platform usage rules, rights, obligations | Explicit checkbox during registration | Russian (required) |
| **Privacy Policy** | Describes personal data processing practices | Reference during registration | Russian (required) |
| **Cookie Policy** | Explains cookie usage and tracking | Cookie banner on first visit | Russian (required) |
| **Data Processing Agreement (DPA)** | Contract for storage operators as data processors | Signed during operator onboarding | Russian (required) |

### 1.2. Terms of Service — Required Sections

**MUST include:**
- Platform role definition (aggregator, not party to rental contracts)
- User rights and obligations
- Operator rights and obligations
- Booking process and cancellation rules
- Content moderation policy
- Limitation of liability
- Intellectual property
- Dispute resolution
- Governing law (Russian Federation)
- Amendment procedures

### 1.3. Privacy Policy — Required Sections

**MUST include:**
- Data controller identity and contact information (including DPO email)
- Categories of personal data collected
- Purposes and legal basis for processing
- Data retention periods
- Third-party recipients (storage operators, service providers)
- User rights (access, rectification, deletion, portability, objection)
- Security measures (general description only)
- Data breach notification procedures
- Children's data policy (platform prohibits users under 18)

### 1.4. Cookie Policy — Required Sections

**MUST include:**
- Definition of cookies
- Categories: Essential, Functional, Analytics, Marketing
- List of specific cookies used (see Section 4)
- Legal basis for each category
- User control mechanisms
- Consequences of declining non-essential cookies

### 1.5. Data Processing Agreement (DPA) — Required Terms

**MUST define:**
- Parties: Platform (Data Controller), Operator (Data Processor)
- Scope: Personal data transmitted during booking process
- Permitted purposes: Contract fulfillment, communication, documentation
- Prohibited purposes: Marketing without consent, third-party sharing, retention > 3 years
- Operator obligations under 152-FZ
- Data deletion requirements
- Liability and indemnification
- Audit rights

---

## 2. Personal Data Requirements

### 2.1. Data Collection Boundaries

**Platform MUST collect ONLY the following personal data:**

| Data Category | Required/Optional | Legal Basis | Collected When |
|---------------|------------------|-------------|----------------|
| Email | Required | Contract | Registration |
| Phone | Required | Contract | Registration |
| Name | Optional | Contract | Registration |
| Password (hashed) | Required | Contract | Registration |
| IP address | Automatic | Legitimate interest | Every request |
| User-Agent | Automatic | Legitimate interest | Every request |
| Geolocation | Optional | Consent | If user enables |
| Booking history | Automatic | Contract | When booking |
| AI conversation | Automatic | Contract | When using AI |
| Cookies | Varies | Consent (non-essential) | Browser interaction |

### 2.2. Legal Bases for Processing

| Purpose | Legal Basis | Notes |
|---------|-------------|-------|
| User identification | Contract performance | Essential for service |
| Booking fulfillment | Contract performance | Required for rental |
| Security and fraud prevention | Legitimate interest | Platform security |
| Analytics (anonymous) | Legitimate interest | Service improvement |
| Marketing cookies | Explicit consent | Optional, user control |
| Geolocation services | Explicit consent | Optional feature |

### 2.3. User Rights — MUST Support

The platform MUST enable users to exercise the following rights:

- **Right of Access** — User can request copy of their data (15-day response time)
- **Right of Rectification** — User can update their data through personal cabinet
- **Right to Erasure** — User can request account deletion (see Section 3)
- **Right to Data Portability** — User can export data in machine-readable format (JSON/CSV)
- **Right to Object** — User can withdraw consent for optional processing
- **Right to Restrict Processing** — User can limit certain data uses

### 2.4. Prohibited Data Processing

The platform MUST NOT:
- Collect data from users under 18 years old
- Process special categories of data (health, biometric, political views, etc.) without explicit legal basis
- Share personal data with marketers or data brokers
- Transfer data outside permitted jurisdictions without proper safeguards
- Use personal data for purposes not disclosed in Privacy Policy
- Retain personal data beyond stated retention periods

### 2.5. Storage Operator Obligations

When transmitting personal data to storage operators, the platform MUST:
- Execute DPA before first data transfer
- Transmit ONLY booking-related data (name, email, phone, rental dates, comments)
- NOT transmit passwords, search history, IP addresses, or other users' data
- Ensure operator commits to 152-FZ compliance
- Obtain operator agreement to data retention limits (max 3 years)
- Verify operator will not use data for marketing without explicit user consent

---

## 3. Data Retention Policy

### 3.1. Retention Periods — MUST Comply

| Data Type | Retention Period | Justification |
|-----------|-----------------|---------------|
| Active user account | Duration of account activity | Contract performance |
| Deleted user account (soft delete) | 30 days (grace period) | User may restore account |
| Deleted user account (anonymized) | After 30 days | Data minimization |
| Booking history | 3 years from booking date | Legal/tax obligations |
| Application logs | 3-6 months (per DOC-020) | Technical troubleshooting |
| Audit logs | 3 years | Compliance/legal requirements |
| Anonymized AI queries | 1 year | Service improvement |

**Note:** Technical implementation of retention and deletion is defined in DOC-020 (Audit Logging Specification).

### 3.2. Account Deletion Requirements

**User Account Deletion MUST:**
- Provide "Delete Account" function in user personal cabinet
- Show warning about consequences (loss of booking history, favorites, etc.)
- Enter 30-day grace period (soft delete)
- During grace period: Account hidden, user can restore via support
- After 30 days: Permanent deletion and anonymization
- Retain anonymized booking IDs for operators' records (no linkage to user identity)

**Operator Account Deletion MUST:**
- Allow operator-initiated deletion request
- Require 14-day notice period
- Unpublish all listings immediately
- Cancel pending bookings (notify affected users)
- After notice period: Permanent deletion
- Retain anonymized transaction records for platform accounting (3 years)

### 3.3. Data Subject to Deletion

**MUST delete permanently:**
- Full name
- Email address
- Phone number
- Password hash
- IP addresses
- Session data
- User-Agent strings
- Personal communication history

**MUST retain (anonymized):**
- Booking statistics (e.g., "booking_123 occurred on date X" — no user linkage)
- Aggregate analytics
- Financial records (for accounting/tax purposes)

---

## 4. Cookie Consent Requirements

### 4.1. Cookie Categories & Legal Requirements

| Category | Consent Required? | Can Block Platform Functionality? | Examples |
|----------|------------------|----------------------------------|----------|
| **Essential** | No | Yes | session_id, auth_token, csrf_token |
| **Functional** | No | No | map_view_preference, filter_settings |
| **Analytics** | Yes | No | Yandex.Metrika, Google Analytics |
| **Marketing** | Yes | No | Retargeting pixels, ad tracking |

### 4.2. Cookie Banner Requirements

The platform MUST:
- Display cookie banner on user's first visit
- Clearly explain cookie purposes
- Provide separate opt-in for Analytics and Marketing cookies
- Allow users to accept all, reject non-essential, or customize
- Not block access to core functionality if user rejects non-essential cookies
- Store user's choice for 1 year
- Allow users to change preferences at any time via personal cabinet

### 4.3. Cookie Banner Content — MUST Include

- Brief explanation of cookies
- Link to full Cookie Policy
- List of cookie categories
- Granular controls for Analytics and Marketing
- "Accept All," "Reject All," and "Customize" buttons

### 4.4. Behavior on Rejection

**If user rejects Analytics/Marketing cookies:**
- Essential and Functional cookies remain active
- No analytics scripts loaded
- No marketing pixels fired
- Core platform functionality remains fully operational
- User can change mind later via settings

---

## 5. PII Classification

### 5.1. PII Sensitivity Levels

The platform MUST classify personal data by sensitivity to apply appropriate protection measures:

| Level | Data Types | Protection Requirements | Access Control |
|-------|-----------|------------------------|----------------|
| **CRITICAL** | Password (hashed), Payment details | Never logged, encrypted at rest, TLS in transit | Minimal access, audit all access |
| **HIGH** | Full name, Email, Phone, Address | Masked in logs, encrypted at rest, TLS in transit | Role-based access, audit access |
| **MEDIUM** | User-Agent, Session IDs, Booking preferences | Logged (sanitized), encrypted in transit | Standard access controls |
| **LOW** | Anonymous analytics IDs, Aggregated statistics | Can be logged, standard security | Wide access for analytics |

**Note:** Technical implementation of these protection measures is defined in Security & Compliance Plan and DOC-020.

### 5.2. Data Minimization Principle

The platform MUST:
- Collect ONLY data necessary for stated purposes
- Not request optional data unless user benefit is clear
- Regularly review collected data categories for necessity
- Delete or anonymize data when purpose is fulfilled

---

## 6. Logging Requirements

### 6.1. Prohibited Logging — NEVER LOG

The platform MUST NEVER log the following data in any log category:

- **Passwords** (plaintext or hashed)
- **Payment card numbers** (full PAN)
- **CVV/CVC codes**
- **Full authentication tokens** (JWT, API keys) — only first 10 characters permitted
- **Sensitive personal data** without explicit legal basis

### 6.2. Restricted Logging — MASK REQUIRED

The following data MAY be logged ONLY if masked:

| Data Type | Masking Rule | Example |
|-----------|-------------|---------|
| Email | Mask username, keep domain hint | `us***@example.com` |
| Phone | Mask middle digits | `+7900***45-67` |
| IP address | Mask last octet (application logs) | `192.168.1.***` |
| User ID | Can log full ID | `user_id: 12345` |

**Note:** Masking implementation is defined in DOC-020 (Audit Logging Specification).

### 6.3. Logging Retention — MUST Comply

| Log Category | Retention | Legal Justification |
|--------------|----------|---------------------|
| Application logs | 3 months | Technical troubleshooting |
| Access logs | 6 months | Security monitoring |
| Authentication logs | 6 months | Security monitoring |
| Security incident logs | 1 year | Incident investigation |
| Audit logs (legal/financial) | 3 years | Legal/tax compliance |

**Note:** Automated retention enforcement is defined in DOC-020 and DevOps Infrastructure Plan.

### 6.4. Log Access Control — MUST Enforce

| Role | Log Access | Purpose |
|------|-----------|---------|
| Developer | Application logs (read-only, last 7 days) | Debugging |
| DevOps | All logs (full access) | Operations |
| Security Team | Security + Audit logs | Incident response |
| DPO | Audit + Access logs | Compliance monitoring |
| Support | Application logs (last 7 days, read-only) | User support |

**Note:** RBAC implementation is defined in Security & Compliance Plan and DevOps Infrastructure Plan.

---

## 7. Legal Document Governance

### 7.1. Document Ownership & Responsibility

| Role | Responsibility |
|------|---------------|
| **Legal Team** | Draft creation, legal review, final approval |
| **DPO (Data Protection Officer)** | Privacy Policy and DPA approval, compliance oversight |
| **Product Manager** | Business requirements input, user impact assessment |
| **CTO / Engineering Leadership** | Technical feasibility review, implementation oversight |
| **Marketing** | User communication and notification |

**Contacts (MVP v1 MUST define):**
- Legal: legal@[company].com
- DPO: dpo@[company].com

### 7.2. Version Control Requirements

The platform MUST:
- Use semantic versioning for legal documents: MAJOR.MINOR.PATCH
- Maintain version history (git-based or equivalent)
- Clearly display current version number and effective date on public pages
- Provide changelog accessible to users

**Version Change Types:**

| Change Type | Version Bump | User Notification | Consent Required? |
|-------------|-------------|------------------|------------------|
| **Major** (rights/obligations change) | MAJOR (2.0.0) | 30 days advance notice via email + in-app | Yes (re-acceptance) |
| **Minor** (new sections, clarifications) | MINOR (1.1.0) | 7 days notice via email + in-app | No (optional review) |
| **Patch** (typo fixes, formatting) | PATCH (1.0.1) | Optional (changelog only) | No |

### 7.3. Document Update Triggers

**Planned Review:**
- Terms of Service: Every 6 months
- Privacy Policy: Every 6 months
- Cookie Policy: Annually
- DPA: Annually

**Unplanned Review (MUST occur immediately upon):**
- Change in applicable law (e.g., new data protection regulation)
- New product feature affecting data processing
- Data breach or security incident
- Material user complaints
- Merger or acquisition

### 7.4. User Notification Requirements

**For MAJOR changes:**
- Email notification to all active users
- In-app banner 30 days before effective date
- Modal requiring re-acceptance on next login after effective date
- SMS notification for critical changes (optional but recommended)

**For MINOR changes:**
- Email notification
- In-app banner 7 days before
- No re-acceptance required

**For PATCH changes:**
- Changelog update only
- Optional email digest

---

## 8. Non-Goals (MVP v1)

The following are explicitly OUT OF SCOPE for MVP v1:

### 8.1. Out of MVP v1 Scope

- **Automated legal enforcement systems** — No API for legal document acceptance tracking
- **Dynamic jurisdiction switching** — Single jurisdiction only (Russia)
- **Real-time compliance monitoring** — Manual compliance checks only
- **Legal analytics dashboard** — No automated compliance metrics
- **Advanced consent orchestration** — Basic cookie banner only
- **Multi-language legal documents** — Russian only
- **Granular cookie category controls** — Accept all / Reject all for non-essential
- **Automated data subject request handling** — Manual process via support
- **Advanced anonymization techniques** — Basic anonymization only
- **Legal document API** — No programmatic access to legal texts

### 8.2. Future Considerations (Post-MVP)

The following MAY be considered for future versions but are not committed:

- Multi-language support (English, other CIS languages)
- Automated compliance monitoring and alerting
- Self-service data subject request portal
- GDPR compliance for EU operations
- Enhanced cookie consent management
- Legal document version API
- Automated anonymization and data masking pipelines

---

## 9. MVP Compliance Checklist

### 9.1. Pre-Launch Requirements (MUST)

**Legal Documents:**
- [ ] Terms of Service — Draft approved by Legal
- [ ] Privacy Policy — Draft approved by Legal and DPO
- [ ] Cookie Policy — Draft approved by DPO
- [ ] DPA template — Draft approved by Legal and DPO
- [ ] All documents published on platform website
- [ ] Version numbers and effective dates clearly displayed

**Technical Requirements (Summary — see canonical docs for details):**
- [ ] Cookie banner implemented and functional
- [ ] User registration requires ToS acceptance (checkbox)
- [ ] Password hashing implemented (bcrypt or equivalent)
- [ ] TLS 1.3 enabled for all connections
- [ ] PII masking in logs implemented (see DOC-020)
- [ ] User account deletion function available
- [ ] Data export function available (JSON/CSV)

**Organizational Requirements:**
- [ ] DPO appointed and contact published
- [ ] Legal document storage established (GitHub/Notion/CMS)
- [ ] Incident response plan for data breaches defined
- [ ] Support team trained on data subject rights requests

### 9.2. Post-Launch Ongoing Requirements (MUST)

**Periodic Reviews:**
- [ ] Terms of Service reviewed every 6 months
- [ ] Privacy Policy reviewed every 6 months
- [ ] Cookie Policy reviewed annually
- [ ] DPA reviewed annually

**Monitoring:**
- [ ] Track legal document versions in system
- [ ] Monitor changes in 152-FZ and related regulations
- [ ] Review user complaints related to data processing
- [ ] Audit log retention compliance (see DOC-020)

**User Rights:**
- [ ] Respond to data subject access requests within 15 days
- [ ] Process account deletion requests within 30 days
- [ ] Maintain support channel for data protection inquiries (dpo@[company].com)

---

## 10. Status & Next Steps

### Document Status
**Status:** Canonical — MVP v1  
**Scope:** Intentionally limited to legal requirements checklist  
**Technical Implementation:** Defined in separate canonical documents (DOC-020, Security Plan, DevOps Plan)

### Dependencies
This document references but does NOT duplicate:
- **DOC-020** — Audit Logging Specification (log masking, retention automation)
- **Security & Compliance Plan** — Encryption, TLS, access control implementation
- **DevOps Infrastructure Plan** — Storage, backup, rotation mechanisms
- **DOC-059** — Multi-Country & Multi-Region Architecture (future expansion)

### Maintenance
- **Review Frequency:** Every 6 months or upon regulatory change
- **Owner:** Legal Team + DPO
- **Approval:** Legal Team (lead), DPO (co-approver), CTO (reviewer)

---

## 11. Appendix: Reference Contacts

| Function | Email | Responsibility |
|----------|-------|----------------|
| Legal Team | legal@[company].com | Legal document creation and review |
| DPO | dpo@[company].com | Data protection compliance oversight |
| Support | support@[company].com | User inquiries and data subject requests |

---

## 12. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 CANONICAL | December 2025 | Legal & Compliance Team | Initial canonical version with scope reduction |

---

**END OF DOCUMENT**

**Next Review:** June 2026 (or upon regulatory change)
