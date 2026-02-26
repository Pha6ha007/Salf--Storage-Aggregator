# DOC-094 — Legal & Operational Model for Russia (MVP v1)

**Self-Storage Aggregator Platform — Regional Legal & Operational Reference**

---

## Document Status

> **Document Status:** 🟡 Supporting / Legal & Operational Reference  
> **Canonical:** ❌ No  
> **Jurisdiction:** Russian Federation  
> **Phase:** MVP v1  
> **Last Updated:** December 16, 2025  
> **Version:** 1.0
>
> ⚠️ **IMPORTANT DISCLAIMER**
> 
> This document describes a **potential** legal and operational model for the Self-Storage Aggregator platform within the Russian Federation. It is provided for **reference and discussion purposes only**.
>
> **This document does NOT:**
> - Constitute legal advice
> - Define platform-wide legal architecture or binding policies
> - Guarantee compliance with Russian law
> - Replace consultation with qualified legal counsel
> - Override canonical technical specifications
>
> **Legal counsel should be consulted** before implementing any business operations in Russia.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Platform Role & Legal Positioning](#2-platform-role--legal-positioning)
3. [Operator Legal Model](#3-operator-legal-model)
4. [User (Renter) Legal Position](#4-user-renter-legal-position)
5. [Contractual Structure (High-Level)](#5-contractual-structure-high-level)
6. [Payments & Financial Flows (Conceptual)](#6-payments--financial-flows-conceptual)
7. [Data Protection & Privacy (Russia)](#7-data-protection--privacy-russia)
8. [Operational Constraints & Risks](#8-operational-constraints--risks)
9. [Limitations & Open Questions](#9-limitations--open-questions)
10. [Relationship to Canonical Documents](#10-relationship-to-canonical-documents)
11. [Non-Goals](#11-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document provides a **high-level conceptual overview** of how the Self-Storage Aggregator platform might operate within the legal and regulatory framework of the Russian Federation.

**Intended Use:**
- Product and business planning reference
- Input for legal risk assessment
- Basis for discussion with Russian legal counsel
- Context for operational adaptation to local requirements

**NOT Intended For:**
- Legal compliance certification
- Authoritative legal interpretation
- Substitute for professional legal advice
- Binding operational policy

## 1.2. Scope (MVP v1, Russia)

This document considers:
- Platform's potential legal role in Russia
- Operator responsibilities under Russian commercial law
- User relationship to platform and operators
- Basic contractual constructs
- Data protection considerations under Federal Law 152-ФЗ
- High-level regulatory and operational risks

**Out of Scope:**
- Tax planning or optimization strategies
- Specific legal entity structuring recommendations
- Detailed regulatory filing procedures
- Insurance requirements and products
- Dispute resolution mechanisms (beyond conceptual overview)
- International data transfer specifics

## 1.3. Regulatory Context

The Russian Federation has specific legal frameworks that may impact platform operations:

**Potentially Relevant Laws:**
- Federal Law No. 152-ФЗ "On Personal Data" (July 27, 2006)
- Civil Code of the Russian Federation (Parts I-IV)
- Law on Consumer Rights Protection (February 7, 1992)
- Digital Platform Regulation (if applicable, evolving)
- Tax Code of the Russian Federation
- Anti-Money Laundering (AML) legislation

**Note:** Regulatory landscape may evolve. This document reflects understanding as of December 2025.

---

# 2. Platform Role & Legal Positioning

## 2.1. Marketplace Role

**Conceptual Positioning:**

The platform may be characterized as an **information marketplace** or **online advertising platform** that:

- Facilitates connections between users seeking storage and operators offering storage space
- Provides technological infrastructure for search, discovery, and communication
- Does not directly provide storage services
- Does not own or operate storage facilities

**Alignment with Canonical Documents:**

As defined in User_Operator_Documentation_MVP_v1:

> "**What This Platform Is:**  
> A marketplace connecting users seeking storage with operators offering warehouse space, with basic booking request management.
>
> **What This Platform Is NOT:**  
> - A payment processor or financial service  
> - A property management system  
> - A legal contract generator"

This positioning aims to limit the platform's direct liability for storage service quality and contractual disputes between users and operators.

## 2.2. Intermediary Status

**Legal Characterization:**

The platform may function as an **information intermediary** under Russian law, potentially analogous to:
- Online classified advertising services
- Referral platforms
- Booking aggregators (without direct service provision)

**Key Characteristics:**
- Facilitates communication and information exchange
- Does not execute storage contracts on behalf of operators
- Does not guarantee storage service quality or availability
- Does not handle storage operations or access control

**Potential Legal Framework:**
Under Russian civil law, the platform relationship might be structured as:
- An advertising service agreement with operators
- A platform access agreement with users
- NOT as a commission agent or storage service provider

## 2.3. Responsibility Boundaries

**What the Platform May Be Responsible For:**
- Accuracy of platform-provided information (within reasonable limits)
- Data protection compliance for personal data it processes
- Platform uptime and technical functionality (best-effort basis)
- Verification of operator documentation (basic checks)
- Processing of user complaints and operator issues (procedural)

**What the Platform Seeks to Exclude from Direct Responsibility:**
- Physical security of stored items
- Operator's compliance with storage regulations
- Contractual disputes between users and operators
- Loss, damage, or theft of stored property
- Operator's financial solvency or business practices
- Enforcement of rental agreements

**Limitation Mechanisms:**
These boundaries would typically be established through:
- Platform Terms of Service (as per DOC-054, DOC-072)
- Clear disclaimers in user interface
- Operator Agreement provisions (DOC-060)
- Allocation of responsibilities in legal documentation

---

# 3. Operator Legal Model

## 3.1. Operator as Storage Service Provider

**Primary Responsibility:**

Under this model, **operators are the actual service providers** who:
- Own, lease, or control physical storage facilities
- Enter into rental/storage agreements directly with users
- Bear responsibility for storage service quality
- Manage facility security and access
- Handle user property and liability concerns

**Legal Status:**
Operators would typically be:
- Russian legal entities (LLC, JSC) or individual entrepreneurs (IP)
- Registered with tax authorities (INN required during onboarding)
- Subject to commercial lease law and storage contract regulations
- Potentially subject to specific industry regulations (if any)

**As Per API Specification (DOC-016):**
```
Operator Registration Requires:
- email, password, name, phone
- company_name (legal name)
- inn (tax identification number: 10 or 12 digits)
- agree_to_terms, agree_to_privacy
```

Platform conducts basic verification but does not certify compliance with all storage-related regulations.

## 3.2. Contracts with Renters

**Direct Contractual Relationship:**

When a booking is confirmed, a **direct contractual relationship** is established between:
- **Service Provider:** The operator
- **Service Consumer:** The user (renter)

**Platform's Role in This Relationship:**
- Facilitates initial contact and information exchange
- May provide booking management tools
- Is NOT a party to the storage service contract
- Does not guarantee contract enforcement

**Contract Terms:**
- Defined primarily by operator
- Subject to Russian consumer protection law
- Platform may suggest standard terms through Operator Agreement
- Platform cannot control all terms or enforce compliance

## 3.3. Responsibility for Storage Conditions

**Operator Obligations (Under Russian Law):**

Operators, as storage service providers, would generally be expected to:
- Maintain premises in reasonable condition
- Provide agreed-upon security measures
- Comply with fire safety and building codes
- Honor agreed storage terms
- Handle property with reasonable care

**Liability Allocation:**
- Loss or damage to stored property: primarily operator's responsibility
- Platform's role: limited to facilitation and referral
- Insurance: operator's decision; platform does not provide insurance

**Verification Approach:**

As per User_Operator_Documentation_MVP_v1:
> "**Verification:**  
> - Platform administrators review submitted documents  
> - Verification process varies based on document completeness  
> - Upon approval, account status changes to 'active'  
> - Operator can then create warehouses"

This is a **basic administrative review**, not a comprehensive audit of operational compliance.

---

# 4. User (Renter) Legal Position

## 4.1. Relationship with Operator

**Primary Service Relationship:**

Users seeking storage enter into a **consumer service relationship** with operators, characterized by:
- User as consumer (potentially protected under Russian consumer protection law)
- Operator as service provider
- Contract terms defined by operator (within legal limits)
- Payment arrangement between user and operator

**User Expectations:**
- Storage space as described in listing
- Access according to agreed terms
- Security and care of stored items as specified
- Dispute resolution directly with operator (primarily)

## 4.2. Relationship with Platform

**Limited Platform Obligations:**

The platform's relationship with users is characterized as:
- Provision of platform access and tools
- Information service (search, listings, reviews)
- Booking request facilitation (not booking execution)
- Best-effort verification of operator identity

**What Users Should NOT Expect from Platform:**
- Storage service quality guarantees
- Property insurance or protection
- Enforcement of operator obligations
- Resolution of all user-operator disputes

**User Rights:**
As defined in platform documentation (DOC-054, DOC-072):
- Right to accurate listing information (within reasonable limits)
- Right to data protection (see Section 7)
- Right to complain about platform issues
- Right to account deletion

## 4.3. Data Protection Expectations

**Personal Data Processing:**

When users register and use the platform, they may reasonably expect:
- Compliance with Federal Law 152-ФЗ
- Transparent data processing practices (Privacy Policy)
- Data security measures (encryption, access controls)
- Rights to access, correct, and delete personal data

**Data Sharing:**
- User contact information shared with operator upon booking confirmation
- Anonymous usage data for platform improvement
- No sale of personal data to third parties (as per typical Privacy Policy)

**See Section 7** for detailed data protection considerations.

---

# 5. Contractual Structure (High-Level)

## 5.1. Platform ↔ Operator Agreement

**Nature of Agreement:**

The relationship between platform and operator may be structured as:
- **Service Agreement** for platform access and listing publication
- **Advertising/Promotion Agreement** for visibility of warehouses
- **Commission-Based Relationship** (if platform charges fees)

**Key Terms (Conceptual):**
- Operator's obligation to provide accurate information
- Platform's right to moderate content and enforce policies
- Commission structure (if applicable, see Section 6)
- Data sharing and processing provisions
- Termination conditions
- Limitation of platform liability

**Reference Document:**
DOC-060 — Operator Agreement (should contain detailed terms)

**NOT Included in MVP v1:**
- Revenue-sharing or payment processing (as per User_Operator_Documentation_MVP_v1: "Payment processing and financial management are not available in MVP v1")

## 5.2. Operator ↔ Renter Agreement

**Structure:**

This is the **primary service contract** for storage:
- Governed by Russian civil law and consumer protection
- Terms set by operator (within legal limits)
- May be written or implied by conduct
- Covers rental period, pricing, access rights, liability

**Platform's Role:**
- Provides booking management tools
- NOT a party to this agreement
- NOT responsible for contract enforcement
- May facilitate communication about contract terms

**Standard Terms:**
Platform may **recommend** standard contract provisions through:
- Operator Agreement guidelines
- Public Policy templates (if provided)
- But operators retain autonomy over final contract terms

## 5.3. Public Policies Overview

**Platform Legal Documents:**

As referenced in DOC-054 (Legal Checklist) and DOC-072 (Public Policies Pack):

**For Users:**
- **Terms of Service:** Platform access, acceptable use, disclaimers
- **Privacy Policy:** Data collection, processing, rights
- **Cookie Policy:** Cookie usage and consent

**For Operators:**
- **Operator Agreement:** Commercial terms, obligations, liability
- **Data Processing Agreement (DPA):** If operator shares user data with platform

**Compliance Context:**
These documents are intended to comply with:
- Russian Civil Code
- Federal Law 152-ФЗ (Personal Data)
- Consumer Protection Law
- General legal best practices

**Note:** Actual legal documents should be reviewed by Russian legal counsel.

---

# 6. Payments & Financial Flows (Conceptual)

## 6.1. Who Pays Whom

**MVP v1 Limitation:**

As explicitly stated in User_Operator_Documentation_MVP_v1:

> "**Important:** Payment processing and financial management are not available in MVP v1. Operators handle payments through external arrangements."

**Conceptual Financial Flows:**

In the **absence of platform payment processing**, the likely model is:

**User → Operator (Direct Payment):**
- Users pay operators directly (cash, bank transfer, external payment systems)
- Platform is NOT involved in payment transaction
- Platform does NOT hold funds
- Operators handle all payment-related tax obligations

**Platform → Operator (Potential Future Model):**
If platform introduces commission or service fees:
- Operators may pay platform for listing/booking services
- Structure: fixed fee, percentage of bookings, or subscription
- Requires separate commercial agreement

## 6.2. Platform Commission Model

**MVP v1:** No commission model implemented.

**Potential Future Models (for reference only):**

1. **Listing Fee Model:**
   - Operators pay to publish warehouses
   - Fixed monthly/annual fee per warehouse or per operator
   - No transaction-based fees

2. **Commission on Bookings:**
   - Platform charges percentage of booking value
   - Requires platform-mediated payment processing
   - More complex implementation

3. **Hybrid Model:**
   - Combination of listing fees and booking commissions

**Tax Implications:**
Any commission model would require:
- Russian tax registration and compliance
- VAT consideration (if applicable)
- Proper invoicing and reporting

## 6.3. Escrow / Agent Considerations (Conceptual)

**NOT Applicable in MVP v1** due to lack of payment processing.

**Future Considerations:**
If platform were to handle payments, potential structures include:

**Escrow Model:**
- Platform holds funds temporarily
- Releases to operator after service confirmation
- Requires financial licensing considerations

**Agent Model:**
- Platform acts as operator's agent to collect payment
- Potential legal complexity under Russian agency law

**Direct Processing Model:**
- Platform as payment facilitator
- Partners with licensed payment processor
- Platform never holds funds

**Important:** Any payment handling would require:
- Consultation with Russian banking/financial law experts
- Potential licensing or partnership with licensed entities
- AML/KYC compliance considerations
- Tax withholding and reporting

---

# 7. Data Protection & Privacy (Russia)

## 7.1. Personal Data Handling

**Applicable Law:**
Federal Law No. 152-ФЗ "On Personal Data" (July 27, 2006)

**Key Requirements Under 152-ФЗ:**
- Consent for personal data processing (with exceptions)
- Data localization (storage in Russia for Russian citizens' data)
- Registration with Roskomnadzor (Federal Service for Supervision of Communications, Information Technology and Mass Media)
- Data security measures
- Rights to access, correction, deletion

**Platform's Personal Data Processing:**

As referenced in Security & Compliance Plan (DOC-078):

**PII Collected:**
- User: email, name, phone, potentially passport data
- Operator: email, name, phone, company name, INN, bank details

**Legal Bases (GDPR/152-ФЗ):**
- Contract performance (booking services)
- Legitimate interest (platform operation)
- Consent (marketing, analytics)

**Data Security:**
- Encryption at rest and in transit
- Access controls (RBAC)
- Password hashing (bcrypt)
- Audit logging

## 7.2. Localization Considerations

**152-ФЗ Localization Requirement:**

Russian law generally requires that personal data of Russian citizens be **stored and processed using databases located in Russia**.

**Implications for Platform:**
- Servers processing Russian user data should be located in Russia
- Or partnership with Russian hosting provider
- Cross-border data transfers subject to additional requirements

**Technical Implementation:**
- Database location considerations (as per Technical Architecture Document)
- Compliance verification
- Potential need for Russian data center infrastructure

**Note:** Legal interpretation of localization requirements has evolved. Current legal advice should be sought.

## 7.3. Consent Model (Conceptual)

**Consent Requirements:**

Under 152-ФЗ and platform design:

**Mandatory Consents (typically contract-based, not consent-based processing):**
- Account creation and management
- Booking request processing
- Communication about bookings

**Optional Consents (requiring explicit opt-in):**
- Marketing communications
- Analytics cookies
- Third-party integrations

**Implementation:**

As per API Specification (DOC-016):
```
Registration requires:
- agree_to_terms: true
- agree_to_privacy: true
```

Additional consent tracking in:
```sql
CREATE TABLE user_consents (
    user_id INTEGER,
    consent_type VARCHAR(50),
    consent_given BOOLEAN,
    consent_version VARCHAR(20),
    created_at TIMESTAMP
);
```

**Consent Management:**
- Users can withdraw consent
- Platform maintains consent logs
- Version tracking for policy updates

---

# 8. Operational Constraints & Risks

## 8.1. Regulatory Uncertainty

**Nature of Uncertainty:**

The regulatory environment for digital platforms in Russia may involve:
- Evolving interpretations of platform responsibilities
- Unclear classification of platform activities
- Changing data protection enforcement
- New legislation affecting digital marketplaces

**Potential Areas of Ambiguity:**
- Platform liability for operator misconduct
- Consumer protection applicability
- Requirement for specific licenses or registrations
- Tax treatment of platform-facilitated transactions

**Risk Mitigation:**
- Conservative interpretation of legal obligations
- Regular legal counsel consultation
- Monitoring of regulatory developments
- Flexible platform design to adapt to changes

## 8.2. Enforcement Risks

**Potential Enforcement Scenarios:**

1. **Data Protection Violations:**
   - Penalties under 152-ФЗ
   - Roskomnadzor enforcement actions
   - Range: warnings to substantial fines

2. **Consumer Protection Issues:**
   - User complaints about misleading information
   - Platform liability for operator conduct (if established)
   - Potential fines or service restrictions

3. **Tax Compliance:**
   - Unclear tax treatment of platform activities
   - Withholding tax obligations
   - VAT considerations

**Likelihood Assessment:**
- Data protection: moderate risk if non-compliant
- Consumer protection: lower risk due to intermediary positioning
- Tax: depends on business model and structure

**Mitigation Strategies:**
- Robust compliance program
- Clear terms of service and disclaimers
- Operator verification procedures
- Transparent operations
- Legal reserve for potential liabilities

## 8.3. Operator Compliance Variance

**Challenge:**

Operators are independent businesses with varying levels of:
- Legal sophistication
- Compliance awareness
- Resource availability
- Business practices

**Platform Cannot Guarantee:**
- All operators comply with storage regulations
- All operators honor contractual commitments
- All operators maintain adequate insurance
- All operators follow tax requirements

**Platform Response:**
- Basic verification during onboarding (document review)
- Terms of Service requiring operator compliance
- User review system for quality feedback
- Suspension mechanism for violations

**Liability Limitation:**
Platform aims to disclaim responsibility for operator-level compliance through:
- Clear Terms of Service provisions
- User acknowledgments
- "As-is" information disclaimers

---

# 9. Limitations & Open Questions

## 9.1. Unresolved Legal Ambiguities

**Areas Requiring Legal Clarification:**

1. **Platform Liability Scope:**
   - Extent of platform responsibility for operator misconduct
   - Applicability of "information intermediary" protections
   - Liability for erroneous or outdated listing information

2. **Licensing Requirements:**
   - Whether platform activities require specific licenses
   - Real estate broker licensing considerations
   - Financial service licensing (if handling payments in future)

3. **Tax Treatment:**
   - VAT applicability to platform services
   - Tax classification of platform fees/commissions
   - Withholding obligations (if any)

4. **Contract Enforceability:**
   - Validity of click-through agreements under Russian law
   - Enforceability of liability disclaimers
   - Consumer protection limitations on contract terms

5. **Data Localization Details:**
   - Specific hosting requirements for compliance
   - Cross-border data transfer mechanisms
   - Processing of non-Russian user data

## 9.2. Areas Requiring Legal Review

**Before Launch in Russia:**

The following should be reviewed by qualified Russian legal counsel:

- [ ] Terms of Service (Russian language version)
- [ ] Privacy Policy (152-ФЗ compliance)
- [ ] Operator Agreement (commercial terms, liability)
- [ ] Data Processing Agreement (if applicable)
- [ ] Corporate structure and tax registration
- [ ] Data localization and hosting arrangements
- [ ] Operator verification procedures (adequacy)
- [ ] Consumer protection compliance
- [ ] Advertising and marketing compliance
- [ ] Insurance requirements and options

**Recommended Legal Partners:**
- Russian law firm with digital platform experience
- Data protection specialist (152-ФЗ expert)
- Tax advisor for digital business models

## 9.3. MVP v1 Assumptions

**This document assumes:**

1. **No Payment Processing:**
   - Platform does not handle financial transactions
   - Operators and users arrange payments independently
   - Simplifies regulatory exposure

2. **Limited Verification:**
   - Basic document checks during operator onboarding
   - No comprehensive regulatory compliance audit
   - Relies on operator self-certification

3. **Intermediary Positioning:**
   - Platform as information marketplace
   - Not as storage service provider
   - Liability limitations through Terms of Service

4. **Best-Effort Services:**
   - No SLA or service guarantees to operators or users
   - Platform uptime and functionality on best-effort basis
   - No financial penalties for downtime

**If These Assumptions Change:**
- Legal model may require reevaluation
- Additional licenses or registrations may be needed
- Liability exposure may increase

---

# 10. Relationship to Canonical Documents

## 10.1. Alignment with Core Specifications

**This document is consistent with and references:**

**DOC-001 — Functional Specification MVP v1:**
- Platform scope: marketplace for storage discovery and booking
- Operator and user roles and capabilities
- Booking request workflow (not payment processing)

**DOC-002/DOC-086 — Technical Architecture Document:**
- Platform as web application (no direct storage operations)
- User, operator, admin roles
- Data flow between users and operators

**DOC-016 — API Detailed Specification:**
- Operator registration fields (company_name, INN)
- User registration and consent fields
- No payment processing endpoints in MVP v1

**DOC-054 — Legal Checklist & Compliance Requirements:**
- Public legal documents (Terms, Privacy Policy, Cookie Policy)
- Personal data categories and legal bases
- GDPR and 152-ФЗ compliance considerations
- User rights (access, rectification, erasure)

**DOC-060 — Operator Agreement:**
- Commercial terms between platform and operators
- Operator obligations and representations
- Liability allocation and disclaimers

**DOC-072 — Public Policies Pack:**
- Terms of Service content and structure
- Privacy Policy disclosures
- Cookie Policy and consent mechanisms

**DOC-078 — Security & Compliance Plan:**
- PII handling and masking
- Data encryption and access controls
- Audit logging and breach notification
- User rights implementation (data export, deletion)

## 10.2. Non-Contradiction with Technical Specifications

**This document does NOT:**
- Override technical implementation details in canonical specs
- Define new API endpoints or database schema
- Change product functionality or scope
- Introduce new features beyond MVP v1

**This document ONLY:**
- Provides legal and operational context for Russia
- Describes potential legal characterization
- Identifies risks and open questions
- Supplements (not replaces) canonical documents

---

# 11. Non-Goals

## 11.1. What This Document Does NOT Do

**Explicit Exclusions:**

1. **NOT Legal Advice:**
   - This is not a legal opinion or counsel
   - Does not replace consultation with Russian lawyers
   - Does not guarantee legal compliance

2. **NOT Global Legal Model:**
   - Specific to Russian Federation only
   - Other jurisdictions require separate analysis
   - Not applicable to GDPR (EU) or other regional laws except where noted

3. **NOT Tax Optimization:**
   - Does not provide tax planning strategies
   - Does not recommend specific tax structures
   - Tax advice must come from qualified tax advisors

4. **NOT Enforcement Policy:**
   - Does not define internal enforcement procedures
   - Does not establish disciplinary measures for operators
   - Operational enforcement guided by other documents

5. **NOT Insurance Recommendation:**
   - Does not recommend insurance products
   - Does not define insurance requirements
   - Insurance decisions rest with operators and platform management

6. **NOT Financial Service Design:**
   - Does not design payment processing workflows
   - Does not define escrow mechanisms
   - Financial features (if any) require separate specification

7. **NOT Dispute Resolution Mechanism:**
   - Does not establish arbitration procedures
   - Does not define complaint handling workflows
   - These belong in operational playbooks

## 11.2. Intended Use Limitations

**This Document Should Be Used:**
- As input for legal counsel consultation
- For product and business planning discussions
- To identify areas requiring legal research
- As context for understanding Russian market entry

**This Document Should NOT Be Used:**
- As sole basis for legal compliance
- For making final legal or tax decisions
- As substitute for professional advice
- For regulatory filing or certification

---

# Appendix A: Key Russian Legal References

## A.1. Primary Legislation

**Federal Law No. 152-ФЗ "On Personal Data" (July 27, 2006)**
- Governs personal data collection, processing, storage
- Requires consent (with exceptions)
- Mandates data localization for Russian citizens
- Establishes Roskomnadzor oversight

**Civil Code of the Russian Federation**
- Part I: General provisions, persons, legal acts
- Part II: Obligations and contracts (including storage contracts)
- Part III: Inheritance and intellectual property
- Part IV: Intellectual property rights

**Law on Consumer Rights Protection (February 7, 1992)**
- Protects consumers in service transactions
- Establishes information disclosure requirements
- Provides remedies for consumer harm

**Tax Code of the Russian Federation**
- Corporate income tax
- VAT (Value Added Tax)
- Personal income tax withholding
- Tax reporting and compliance

## A.2. Regulatory Bodies

**Roskomnadzor (Federal Service for Supervision of Communications, Information Technology and Mass Media)**
- Enforces 152-ФЗ (Personal Data Law)
- Maintains register of personal data operators
- Investigates data breaches and violations
- Issues fines and administrative penalties

**Federal Tax Service (FTS)**
- Tax registration and compliance
- VAT administration
- Corporate income tax oversight

**Rospotrebnadzor (Federal Service for Surveillance on Consumer Rights Protection and Human Wellbeing)**
- Consumer protection enforcement
- Service quality standards
- Complaint investigation

---

# Appendix B: Document Metadata & Version History

## B.1. Document Metadata

| **Field** | **Value** |
|-----------|-----------|
| **Document ID** | DOC-094 |
| **Title** | Legal & Operational Model for Russia (MVP v1) |
| **Document Type** | Supporting / Regional Reference |
| **Canonical Status** | ❌ No (Non-Normative) |
| **Jurisdiction** | Russian Federation |
| **Phase** | MVP v1 |
| **Audience** | Product Team, Legal Team, Business Development, DPO |
| **Maintained By** | Legal Team + Product Team |
| **Review Frequency** | As required by regulatory changes or business needs |
| **Next Scheduled Review** | June 2026 (or upon significant regulatory changes) |

## B.2. Version History

| **Version** | **Date** | **Changes** | **Author** |
|-------------|----------|-------------|------------|
| 1.0 | December 16, 2025 | Initial document creation | Technical Documentation Engine |

## B.3. Change Policy

**This document should be updated when:**
- Russian regulatory requirements change significantly
- Platform business model evolves (e.g., introduces payment processing)
- Legal counsel provides updated guidance
- Operational experience reveals new risks or ambiguities
- References to canonical documents require updates

**Update Process:**
1. Draft changes prepared by Product Team or Legal Team
2. Review by Russian legal counsel (if substantive changes)
3. Alignment check with canonical documents
4. Version increment and publication
5. Notification to relevant stakeholders

---

# Appendix C: Glossary of Russian Legal Terms

| **Term** | **Russian** | **Definition** |
|----------|-------------|----------------|
| Personal Data Law | 152-ФЗ | Federal Law No. 152-ФЗ "On Personal Data" |
| Tax Identification Number | ИНН (INN) | Individual taxpayer identification number (10 or 12 digits) |
| Limited Liability Company | ООО (OOO) | Obshchestvo s Ogranichennoy Otvetstvennostyu (LLC equivalent) |
| Individual Entrepreneur | ИП (IP) | Individualniy Predprinimatel (sole proprietor) |
| Joint Stock Company | АО (AO) | Aktsionernoe Obshchestvo (JSC equivalent) |
| Data Localization | Локализация данных | Requirement to store Russian citizens' data in Russia |
| Consumer Protection | Защита прав потребителей | Legal protections for service consumers |
| Roskomnadzor | Роскомнадзор | Federal Service for Supervision of Communications |
| Storage Contract | Договор хранения | Contract for storage of property (Civil Code Art. 886-908) |

---

# Appendix D: Contacts & Further Information

## D.1. Internal Contacts

**For Questions About This Document:**
- **Product Team:** product@selfstorage.com
- **Legal Team:** legal@selfstorage.com
- **Data Protection Officer (DPO):** dpo@selfstorage.com

**For Technical Implementation:**
- See canonical documents (Functional Spec, Technical Architecture, API Blueprint)
- Contact: tech-lead@selfstorage.com

## D.2. External Resources

**Russian Legal Information:**
- Consultant Plus: Legal reference system (consultant.ru)
- Garant: Legal database (garant.ru)
- Roskomnadzor: Personal data register and guidance (rkn.gov.ru)

**Industry Resources:**
- Self-storage industry associations (if any)
- Digital platform legal forums
- E-commerce compliance resources

---

**END OF DOCUMENT**

---

**⚠️ FINAL REMINDER**

This document is a **non-canonical, regional reference** for discussion and planning purposes. It does NOT constitute legal advice and does NOT override canonical technical specifications.

**Before any operations in Russia:**
1. Consult with qualified Russian legal counsel
2. Obtain specific legal opinions on platform model
3. Complete tax and regulatory registrations as advised
4. Implement data localization as required by counsel
5. Review and finalize all legal documents with lawyers

**The platform's legal and operational model in Russia should be established through formal legal advice, not solely based on this reference document.**
