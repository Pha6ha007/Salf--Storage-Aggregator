# Data Retention Policy (MVP v1)

**Document ID:** DOC-036  
**Version:** 1.0  
**Status:** 🟢 GREEN (Canonical)  
**Last Updated:** December 16, 2025  
**Owner:** Security & Compliance Team  

---

## Document Control

| Role | Reviewer | Date | Status |
|------|----------|------|--------|
| Security Lead | [Name] | [Date] | [Pending/Approved] |
| Backend Lead | [Name] | [Date] | [Pending/Approved] |
| Legal/DPO | [Name] | [Date] | [Pending/Approved] |
| Product Owner | [Name] | [Date] | [Pending/Approved] |

---

## 1. Purpose & Scope

### 1.1. Purpose

This Data Retention Policy establishes the technical framework for determining:
- What categories of data the platform collects and stores
- How long each category is retained
- Under what conditions data is deleted or anonymized
- How retention practices align with security, privacy, and compliance requirements

This policy serves as the authoritative reference for retention governance across the Self-Storage Aggregator platform.

### 1.2. Scope

**This policy covers:**
- All personally identifiable information collected from users and operators
- All business transaction data generated through the platform
- All derived data from analytics, logging, and system operations
- All AI-generated content and request logs
- All audit trails and security logs
- Temporary data such as session tokens and verification codes

**This policy explicitly does NOT cover:**
- Implementation mechanics of retention automation
- Database schema definitions or table structures
- Storage infrastructure or cloud provider configurations
- Data recovery or disaster recovery procedures
- Encryption methods or security controls
- Specific tooling or technology choices

### 1.3. Audience

This document is intended for:
- Security and compliance teams reviewing governance practices
- Backend engineers understanding data lifecycle requirements
- Product managers planning feature development involving data collection
- Legal and data protection officers conducting compliance audits
- External auditors evaluating platform data practices

---

## 2. Data Classification

### 2.1. User Account Data

**Category:** Account registration and profile information

**Includes:**
- User credentials and authentication tokens
- Personal contact information (email, phone)
- Profile details (name, preferences)
- Role and permission assignments
- Account status and activity timestamps

**Primary Purpose:** Enable user authentication and platform access

**Sensitivity:** HIGH - Contains directly identifiable information

---

### 2.2. Operator Data

**Category:** Business partner registration and operational data

**Includes:**
- Operator credentials and authentication tokens
- Company information and business contact details
- Operator preferences and configuration settings
- Warehouse ownership relationships
- Payment and invoicing details (when implemented)

**Primary Purpose:** Enable business partner operations and warehouse management

**Sensitivity:** HIGH - Contains business and personally identifiable information

---

### 2.3. Booking & Transaction Data

**Category:** Core business transactions and reservations

**Includes:**
- Booking requests and confirmations
- Storage box selections and pricing snapshots
- Duration and date information
- Contact details provided during booking
- Status history and state transitions
- Cancellation records with reasons and timestamps
- Customer notes and special requests

**Primary Purpose:** Execute and track storage reservations

**Sensitivity:** HIGH - Contains transaction history and personal preferences

---

### 2.4. Reviews & User-Generated Content

**Category:** Public feedback and ratings

**Includes:**
- Warehouse ratings and review text
- Review timestamps and approval status
- User-warehouse associations (anonymized at display)

**Primary Purpose:** Provide transparent feedback for warehouse selection

**Sensitivity:** MEDIUM - Publicly visible but associated with user identity in storage

---

### 2.5. Favorites & Preferences

**Category:** User behavior and saved items

**Includes:**
- Saved warehouse listings
- Preference settings
- Notification preferences

**Primary Purpose:** Personalize user experience

**Sensitivity:** MEDIUM - Indicates user interest but not transactional

---

### 2.6. CRM & Lead Data

**Category:** Sales pipeline and customer relationship management

**Includes:**
- Lead contact information and inquiry details
- Lead status history and progression
- Contact messages and communication logs
- Activity tracking and scheduled follow-ups
- Lead source and attribution information

**Primary Purpose:** Manage sales opportunities and customer relationships

**Sensitivity:** HIGH - Contains prospect information and sales intelligence

---

### 2.7. Analytics & Event Data

**Category:** User behavior tracking and platform metrics

**Includes:**
- Page views and navigation patterns
- Search queries and filter selections
- Feature interaction events
- Session identifiers and correlation IDs
- Performance metrics and error rates

**Primary Purpose:** Understand user behavior and optimize platform performance

**Sensitivity:** MEDIUM - Pseudonymized behavioral data, limited identifiability

---

### 2.8. AI-Generated & AI Request Data

**Category:** Artificial intelligence feature usage

**Includes:**
- Box size recommendation requests and responses
- User input descriptions for AI features
- Model performance metrics (tokens, latency)
- Request outcomes (success, error, timeout)
- Provider and model identifiers (internal only)

**Primary Purpose:** Deliver AI-powered features and monitor AI service quality

**Sensitivity:** MEDIUM - Contains user input text but limited personal context

---

### 2.9. Logs & Audit Data

**Category:** System operations and security monitoring

**Includes:**
- Application logs recording system events
- Security logs tracking authentication and authorization
- Audit logs documenting administrative actions
- Error and exception logs
- Performance and debugging logs

**Primary Purpose:** Enable troubleshooting, security monitoring, and compliance auditing

**Sensitivity:** VARIES - Application logs (LOW to MEDIUM), Security/Audit logs (HIGH)

---

### 2.10. Temporary & Session Data

**Category:** Short-lived operational data

**Includes:**
- Access tokens and refresh tokens
- Email verification codes
- Password reset tokens
- Session identifiers
- Rate limiting counters

**Primary Purpose:** Enable secure authentication flows and temporary operations

**Sensitivity:** HIGH - Enables account access if compromised

---

### 2.11. Media & File Data

**Category:** Uploaded images and documents

**Includes:**
- Warehouse photos and videos
- User-uploaded profile images
- Operator business documentation (when implemented)
- File metadata (size, type, upload timestamp)

**Primary Purpose:** Enhance warehouse listings and user profiles

**Sensitivity:** LOW to MEDIUM - Typically public content but ownership tracked

---

## 3. Retention Principles

### 3.1. Purpose Limitation

Data is retained only as long as necessary to fulfill the specific purposes for which it was collected. Once the original purpose no longer applies, retention transitions to either:
- Continued storage for legitimate operational or legal reasons
- Anonymization to remove identifiability while preserving analytical value
- Permanent deletion when no justification remains

### 3.2. Data Minimization

The platform collects and retains only the minimum data required for each defined purpose. Features requiring new data collection undergo review to ensure necessity and proportionality.

### 3.3. Retention by Category

Different data categories have different retention requirements based on:
- **Business necessity:** Transaction records require longer retention than session data
- **Legal obligations:** Financial and contractual records may require multi-year retention
- **User expectations:** Users expect booking history but not indefinite tracking
- **Security requirements:** Audit logs require sufficient retention for investigation

### 3.4. Separation of Active vs Archived Data

The retention framework distinguishes between:

**Active data:**
- Readily accessible for normal business operations
- Subject to frequent read and write operations
- Maintained with full fidelity and complete relationships

**Post-activity data:**
- Retained after primary business purpose concludes
- May be subject to anonymization or aggregation
- Maintained for analytical, historical, or compliance purposes

This separation enables efficient data management and supports privacy-by-design principles.

### 3.5. Deletion Irreversibility

Once data deletion is executed according to this policy, it is permanent and irreversible. Users and operators are informed of deletion consequences before confirming deletion requests.

---

## 4. Retention Periods (High-Level)

### 4.1. User Account Data

**Active Period:** While account remains active and user continues platform access

**Post-Deletion Retention:** 30 days after account deletion request

**Anonymization Trigger:** Not applicable - hard deletion after grace period

**Deletion Trigger:** 
- User submits account deletion request (30-day grace period)
- Automatic deletion after grace period if no active commitments exist
- Deletion blocked if user has active bookings in pending, confirmed, or active state

**Rationale:** Grace period enables account recovery while respecting deletion rights

---

### 4.2. Operator Data

**Active Period:** While operator account remains active and manages warehouses

**Post-Deletion Retention:** 30 days after account deletion request

**Anonymization Trigger:** Not applicable - hard deletion after grace period

**Deletion Trigger:**
- Operator submits account deletion request (30-day grace period)
- Automatic deletion after grace period if no active warehouses or bookings
- Deletion blocked if operator has active warehouses or pending bookings

**Rationale:** Extended grace period protects business continuity and customer commitments

---

### 4.3. Booking & Transaction Data

**Active Period:** From booking creation through completion or cancellation plus 90 days

**Post-Activity Retention:**
- Completed bookings: 3 years after completion
- Cancelled bookings: 1 year after cancellation

**Anonymization Trigger:**
- Completed bookings: After 3-year retention period
- Cancelled bookings: After 1-year retention period

**Deletion Trigger:** Never fully deleted; retained indefinitely in anonymized form for business analytics

**Anonymization Scope:**
- Contact name replaced with placeholder
- Contact email replaced with system placeholder
- Contact phone replaced with placeholder
- Personal notes removed
- Booking ID, warehouse ID, box ID, dates, pricing preserved for analytics

**Rationale:** Balance user privacy with business need for long-term transaction analytics

---

### 4.4. Reviews & User-Generated Content

**Active Period:** While warehouse listing remains active

**Post-Activity Retention:** Indefinite (reviews remain public permanently)

**Anonymization Trigger:** At time of publication (reviews display anonymized user identity)

**Deletion Trigger:**
- User deletion does not remove reviews
- Reviews may be removed for policy violations only
- Warehouse deletion archives associated reviews

**Rationale:** Reviews provide lasting value to platform users; anonymization at publication protects privacy

---

### 4.5. Favorites & Preferences

**Active Period:** While user account remains active

**Post-Deletion Retention:** None - deleted immediately with account

**Anonymization Trigger:** Not applicable

**Deletion Trigger:** Account deletion

**Rationale:** Preferences have no value beyond active account lifecycle

---

### 4.6. CRM & Lead Data

**Active Period:** While lead remains in active sales pipeline

**Post-Conversion Retention:**
- Leads that convert to bookings: Retained as long as associated booking exists
- Rejected leads: 6 months after rejection
- Spam leads: 30 days after spam classification

**Anonymization Trigger:** After retention period expires

**Deletion Trigger:** Leads never fully deleted; retained in anonymized form for conversion analytics

**Rationale:** Sales intelligence value balanced with contact privacy after reasonable follow-up window

---

### 4.7. Analytics & Event Data

**Active Period:** 90 days for detailed event logs

**Post-Activity Retention:** Aggregated metrics retained indefinitely

**Anonymization Trigger:** Immediate (events collected without direct identifiers)

**Deletion Trigger:** Detailed event logs deleted after 90 days; aggregated metrics retained permanently

**Rationale:** Recent events enable debugging; long-term aggregates inform product decisions

---

### 4.8. AI-Generated & AI Request Data

**Active Period:** 90 days for detailed request logs

**Post-Activity Retention:** Performance metrics retained indefinitely in aggregated form

**Anonymization Trigger:** Request logs contain no direct PII; user IDs subject to standard user retention

**Deletion Trigger:** Detailed request/response logs deleted after 90 days

**Rationale:** Recent logs enable AI model evaluation; aggregates inform feature development

---

### 4.9. Logs & Audit Data

**Security & Audit Logs:**
- **Retention Period:** 1 year
- **Purpose:** Security investigations, compliance audits
- **Deletion Trigger:** Automatic after 1 year unless legal hold applies

**Application Logs:**
- **Retention Period:** 90 days
- **Purpose:** Debugging and operational troubleshooting
- **Deletion Trigger:** Automatic after 90 days

**Rationale:** Security logs require sufficient history for incident response; application logs address immediate operational needs

---

### 4.10. Temporary & Session Data

**Access Tokens:**
- **Retention Period:** 15 minutes
- **Deletion Trigger:** Automatic expiration

**Refresh Tokens:**
- **Retention Period:** 7 days
- **Deletion Trigger:** Automatic expiration or manual logout

**Email Verification Codes:**
- **Retention Period:** 24 hours
- **Deletion Trigger:** Automatic expiration or successful verification

**Password Reset Tokens:**
- **Retention Period:** 1 hour
- **Deletion Trigger:** Automatic expiration or successful password reset

**Rationale:** Minimize exposure window for security-sensitive temporary credentials

---

### 4.11. Media & File Data

**Active Period:** While associated warehouse or profile remains active

**Post-Activity Retention:**
- Warehouse deletion: Media retained 30 days then deleted
- User profile deletion: Media deleted immediately

**Anonymization Trigger:** Not applicable (media is not anonymizable)

**Deletion Trigger:** Associated entity deletion plus grace period (where applicable)

**Rationale:** Media supports active content presentation; no analytical value after source deletion

---

## 5. Deletion & Anonymization Rules

### 5.1. Hard Delete vs Soft Delete

**Soft Delete:**
Applied to critical business entities where immediate permanent deletion would create operational risk:
- User accounts (30-day recovery window)
- Operator accounts (30-day recovery window)
- Warehouses (30-day recovery window for owner)

Soft delete sets a deletion timestamp but preserves data integrity. Restoration is possible during grace period.

**Hard Delete:**
Applied after grace periods or to data with no recovery requirements:
- All data after applicable grace periods expire
- Session tokens and temporary codes (immediate)
- Logs after retention period (immediate)

Hard delete permanently removes data and all references. This operation is irreversible.

---

### 5.2. Irreversible Anonymization

Anonymization transforms data to remove identifiability while preserving analytical utility. This process:
- Replaces personal identifiers with system placeholders
- Removes free-text fields that could contain identifying information
- Preserves transactional and categorical data for analytics

Once anonymized, data cannot be re-identified or restored. Anonymization is applied when:
- Retention period for identifiable data expires
- Data transitions from active business use to historical analytics
- Sufficient time has passed that re-identification risk is eliminated

Anonymization is functionally equivalent to deletion for privacy purposes but maintains business value.

---

### 5.3. Cascading Deletion (Conceptual)

When a primary entity is deleted, related data follows retention rules based on dependency type:

**Immediate Cascade:**
- Favorites when user is deleted
- Operator settings when operator is deleted
- Verification tokens when used or expired

**Delayed Cascade:**
- User data deleted 30 days after account deletion request
- Booking contact details anonymized per booking retention schedule
- CRM leads associated with deleted operators anonymized per lead retention

**Preservation:**
- Reviews persist even when reviewer account is deleted
- Warehouse data preserved during operator grace period
- Transaction records preserved per booking retention rules

Dependencies are managed to prevent orphaned data while respecting category-specific retention requirements.

---

### 5.4. Retention During Active Obligations

Deletion requests are deferred when active business obligations exist:

**Users:**
- Account deletion blocked if active bookings exist
- User must cancel or complete bookings before deletion proceeds
- User notified of blocking reason with list of active commitments

**Operators:**
- Account deletion blocked if active warehouses or bookings exist
- Operator must transfer warehouses or complete pending bookings
- Extended notice period for business continuity

This ensures contractual obligations are fulfilled before data removal.

---

## 6. User & Operator Rights (Technical View)

### 6.1. Account Deletion Requests

Users and operators may request account deletion at any time. The platform:
- Validates that no active commitments block deletion
- Initiates 30-day grace period with clear notification of deletion date
- Allows cancellation of deletion request during grace period
- Executes hard deletion automatically after grace period
- Provides confirmation of completed deletion

Grace period enables recovery from accidental deletion while ensuring responsive deletion for intentional requests.

---

### 6.2. Data Export

Users and operators may request export of their personal data. The platform provides:
- Complete account information (credentials excluded)
- Full booking history with transaction details
- Review history (if applicable)
- Favorite warehouses (if applicable)
- CRM lead information (for operators)

Export format is machine-readable and includes all data associated with the requesting account. Exports are provided within reasonable timeframe consistent with regulatory requirements.

---

### 6.3. Restriction of Processing

Users may request restriction of data processing in specific circumstances:
- During dispute resolution regarding data accuracy
- When deletion request is pending but data needed for legal claims
- For legitimate interests that override standard processing

Restricted data is flagged and isolated from normal processing while maintaining storage for applicable period.

---

### 6.4. Objection to Processing

Users may object to processing based on legitimate interests. The platform:
- Evaluates objection against business necessity
- Ceases processing if no compelling legitimate grounds exist
- Documents objection and resolution for audit purposes

Objections do not apply to contractually necessary processing or legal obligations.

---

## 7. Security & Compliance Alignment

### 7.1. Alignment with Security & Compliance Plan

This retention policy is the governance layer above technical security controls defined in the Security & Compliance Plan. Technical implementation of retention includes:
- Encryption of data at rest and in transit
- Access controls limiting retention data visibility
- Secure deletion procedures preventing data recovery
- Monitoring and logging of retention operations

Refer to Security & Compliance Plan (DOC-078) for implementation specifications.

---

### 7.2. Alignment with Privacy Policy

The platform's public Privacy Policy communicates retention practices to users and operators in accessible language. This technical policy provides the detailed retention framework that underpins Privacy Policy commitments.

Changes to retention periods require Privacy Policy updates to maintain user transparency.

---

### 7.3. Alignment with Audit Logging

All retention-related operations are logged for compliance auditing:
- Account deletion requests and outcomes
- Data anonymization operations
- Manual data removal by administrators
- Retention policy violations or failures

Audit logs follow retention rules defined in Section 4.9 and support compliance verification.

Refer to Logging Strategy (DOC-009) for audit log specifications.

---

### 7.4. Regulatory Compliance Considerations

While this policy does not provide legal interpretation, retention periods are designed to balance:
- User privacy rights under applicable data protection regulations
- Business operational requirements
- Industry standard practices for transaction retention
- Reasonable expectations for security log retention

Legal counsel should review retention periods for jurisdiction-specific compliance requirements.

---

## 8. Exceptions & Legal Holds

### 8.1. Fraud Investigation

Data subject to active fraud investigation is exempt from normal retention periods. Retention is extended until:
- Investigation concludes with documented outcome
- Legal or compliance team authorizes release
- No ongoing legal proceedings require preservation

Fraud holds are applied narrowly to affected accounts and transactions.

---

### 8.2. Dispute Resolution

Data relevant to pending disputes (customer complaints, contractual disputes, regulatory inquiries) is retained until:
- Dispute is fully resolved
- All appeal periods expire
- Legal counsel confirms no further retention required

Dispute holds prevent premature deletion of evidence.

---

### 8.3. Regulatory or Legal Hold

When platform receives notice of regulatory investigation or legal proceeding, affected data is placed under legal hold:
- Normal retention periods suspended
- Deletion operations disabled for affected data
- Hold maintained until legal counsel provides release authorization
- Hold scope documented and reviewed regularly

Legal holds override all other retention rules.

---

### 8.4. Hold Implementation

Exceptions and holds are:
- Documented with clear justification and scope
- Reviewed periodically for continued necessity
- Released promptly when conditions no longer apply
- Logged in audit trail for compliance purposes

Hold mechanisms are implemented to prevent accidental deletion while minimizing retention beyond necessity.

---

## 9. Non-Goals

This policy explicitly does NOT define:

**Implementation Details:**
- Automated deletion mechanisms or scheduling
- Database queries or scripts
- Storage infrastructure configuration
- Cloud provider lifecycle rules

**Backup & Recovery:**
- Backup retention schedules
- Disaster recovery procedures
- Point-in-time recovery windows
- Backup encryption or storage

**Storage Architecture:**
- Database schema design
- Table structures or indexes
- Storage optimization techniques
- Archival storage systems

**Security Mechanisms:**
- Encryption algorithms or key management
- Access control implementation
- Secure deletion verification
- Data masking techniques

**Legal Interpretation:**
- Specific regulatory requirements
- Jurisdiction-specific compliance
- Legal basis for processing
- Data protection impact assessments

These topics are addressed in other canonical documents as referenced throughout this policy.

---

## 10. Relationship to Other Documents

### 10.1. Database Specification (DOC-050)

The Full Database Specification defines the technical schema and data structures. This retention policy defines WHAT data exists and HOW LONG it is retained. Database Specification defines WHERE and HOW it is stored.

Changes to retention periods may necessitate schema changes (e.g., adding timestamps for tracking).

---

### 10.2. Security & Compliance Plan (DOC-078)

Security Plan implements the technical controls and automation that execute this retention policy. Security Plan references this policy for retention period definitions. This policy references Security Plan for implementation requirements.

---

### 10.3. Logging Strategy (DOC-009)

Logging Strategy defines log structure, levels, and categories. This retention policy defines retention periods for each log category. Logging Strategy implements retention through appropriate log rotation and archival.

---

### 10.4. Privacy & Data Protection Policy (DOC-071)

Privacy Policy (technical) describes privacy-by-design implementation. This retention policy provides the data lifecycle framework that Privacy Policy relies upon. Both documents must remain aligned on retention commitments.

---

### 10.5. Analytics & Tracking Specification (DOC-014)

Analytics Specification defines what events are collected and for what analytical purposes. This retention policy defines how long analytics data is retained in identifiable vs aggregated form.

---

### 10.6. API Design Blueprint (DOC-050)

API Blueprint defines endpoints that trigger data collection (registration, bookings, reviews). This retention policy defines lifecycle of data created through API operations.

---

### 10.7. Functional Specification (DOC-001)

Functional Specification defines features that generate data. This retention policy ensures data generated by features is managed consistently with platform governance.

---

## Appendix A: Retention Summary Table

| Data Category | Active Retention | Post-Activity | Anonymization | Hard Delete |
|---------------|------------------|---------------|---------------|-------------|
| **User Accounts** | While active | 30 days | N/A | After 30 days |
| **Operator Accounts** | While active | 30 days | N/A | After 30 days |
| **Completed Bookings** | 90 days post-completion | 3 years | After 3 years | Never |
| **Cancelled Bookings** | 90 days post-cancellation | 1 year | After 1 year | Never |
| **Reviews** | While warehouse active | Indefinite | At publication | Only for violations |
| **Favorites** | While account active | None | N/A | With account |
| **Active Leads** | While in pipeline | 6 months post-rejection | After retention | Never |
| **Spam Leads** | While classified | 30 days | After 30 days | Never |
| **Analytics Events** | 90 days | Aggregated indefinitely | Immediate | After 90 days |
| **AI Request Logs** | 90 days | Aggregated indefinitely | User ID lifecycle | After 90 days |
| **Security Logs** | 1 year | None | N/A | After 1 year |
| **Audit Logs** | 1 year | None | N/A | After 1 year |
| **Application Logs** | 90 days | None | N/A | After 90 days |
| **Access Tokens** | 15 minutes | None | N/A | Auto-expire |
| **Refresh Tokens** | 7 days | None | N/A | Auto-expire |
| **Verification Codes** | 24 hours | None | N/A | Auto-expire |
| **Reset Tokens** | 1 hour | None | N/A | Auto-expire |
| **Media Files** | While entity active | 30 days (warehouses) | N/A | After grace period |

*This table provides quick reference only. Refer to Section 4 for complete retention specifications.*

---

## Appendix B: Glossary

**Active Data:** Data currently in use for operational business purposes

**Anonymization:** Irreversible transformation removing identifiability

**Grace Period:** Time window allowing recovery before permanent deletion

**Hard Delete:** Permanent and irreversible data removal

**Legal Hold:** Suspension of normal retention due to legal proceedings

**Post-Activity Retention:** Retention period after primary purpose concludes

**Soft Delete:** Reversible deletion with recovery window

**PII (Personally Identifiable Information):** Data that identifies or can identify an individual

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Security Team | Initial canonical version for MVP v1 |

---

**END OF DOCUMENT**
