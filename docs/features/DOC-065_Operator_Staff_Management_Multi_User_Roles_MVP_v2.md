# DOC-065: Operator Staff Management & Multi-User Roles (MVP → v2)

**Document Type:** Supporting / Non-Canonical  
**Status:** Governance Guidance  
**Scope:** MVP v1 → v2 Evolution  
**Category:** Access & Role Governance  
**Project:** Self-Storage Aggregator  
**Last Updated:** 2025-12-18  

---

## 1. Document Role & Scope

### 1.1. Purpose

This document provides governance-level guidance on how the platform approaches multi-user access for operator accounts. It establishes principles for access management without prescribing a full Identity and Access Management (IAM) system.

**This document is NOT:**
- An IAM or RBAC implementation specification
- An HR management system design
- A compliance enforcement mechanism
- A detailed permission matrix
- A technical architecture document

**This document IS:**
- A principle-based governance framework
- A conceptual model for access responsibility
- A roadmap distinguishing MVP v1 simplicity from v2 capabilities
- Guidance for understanding access boundaries and accountability

### 1.2. Scope Boundaries

**In Scope:**
- Philosophy of access ownership and responsibility
- Conceptual role categories (high-level)
- Evolution from single-user to multi-user access patterns
- Security and accountability considerations
- Relationship to authentication and authorization systems

**Out of Scope:**
- Permission matrices and granular access controls
- HR processes (hiring, termination, payroll)
- Legal liability frameworks for individual staff members
- Enterprise SSO, LDAP, or SCIM integration requirements
- Detailed implementation specifications

### 1.3. Relation to Canonical Documents

This document operates as **supporting guidance** and must not contradict:

| Canonical Document | Relationship |
|-------------------|--------------|
| **Security_Architecture_MVP_v1_CANONICAL.md** | Aligns with identity and access model philosophy |
| **Security_and_Compliance_Plan_MVP_v1.md** | Respects established RBAC roles and authorization model |
| **API_Design_Blueprint_MVP_v1_CANONICAL.md** | Honors current role structure (guest/user/operator/admin) |
| **Technical_Architecture_Document_MVP_v1_CANONICAL.md** | Consistent with authentication and authorization implementation |

If conflicts arise between this document and canonical sources, **canonical documents take precedence**.

---

## 2. Access Management Philosophy

### 2.1. Core Principles

The platform's approach to operator access management is guided by the following principles:

#### Principle 1: Least Privilege
**Definition:** Users should have the minimum access necessary to perform their responsibilities.

**Application:** In MVP v1, operators have unified access to their own resources. Future multi-user scenarios should grant access based on actual need, not organizational hierarchy or convenience.

#### Principle 2: Explicit Responsibility
**Definition:** Access implies responsibility. Those with access are accountable for actions taken under their credentials.

**Application:** Every action in the system is traceable to a specific authenticated user. Shared credentials undermine accountability and are discouraged.

#### Principle 3: Simplicity Over Completeness
**Definition:** Access models should be as simple as possible while meeting operational needs.

**Application:** The platform prioritizes operational clarity over theoretical completeness. Complex role hierarchies and permission matrices are deferred until clear business value is demonstrated.

#### Principle 4: Auditability
**Definition:** All access-related actions and changes must be traceable and reviewable.

**Application:** Audit logs capture who did what, when, and from where. Access grant/revoke events are logged for security and operational review.

### 2.2. Ownership Model

**Operator Account as Access Boundary:**

In the canonical model:
- Each operator entity has a distinct `operator_id`
- Data (warehouses, boxes, bookings, leads) is scoped to `operator_id`
- Row-Level Security (RLS) enforces data isolation at the database layer
- Backend guards verify ownership before allowing operations

**Access Hierarchy (Conceptual):**
```
Platform Administrator (admin role)
    ↓ [governs platform integrity]
Operator Account (operator role, tied to operator_id)
    ↓ [owns business data]
Individual Users within Operator Context (future v2 concept)
    ↓ [act on behalf of operator]
```

**Key Insight:**  
The operator account represents a **business entity**, not necessarily a single human user. The platform must balance this conceptual difference while maintaining security and traceability.

---

## 3. MVP v1 Baseline

### 3.1. Current State (As Defined in Canonical Documents)

**Role Structure (MVP v1):**

| Role | Level | Scope | Authentication Model |
|------|-------|-------|---------------------|
| `guest` | 0 | Public read access | None (unauthenticated) |
| `user` | 1 | Personal bookings, reviews | JWT-based session |
| `operator` | 2 | Own warehouses, boxes, bookings | JWT-based session |
| `admin` | 3 | Full platform access | JWT-based session |

**Reference:** `API_Design_Blueprint_MVP_v1_CANONICAL.md` § 2.4, `Security_Architecture_MVP_v1_CANONICAL.md` § 5.2

**Operator Account Model (MVP v1):**
- One operator account = one authenticated user session
- Operator credentials authenticate to a single `user_id` with `role='operator'`
- The authenticated user's session is linked to one `operator_id` via `operators` table
- All operator actions are performed under a single user identity

**Access Control (MVP v1):**
- **Authentication:** JWT tokens identify `user_id` and `role`
- **Authorization:** Backend guards verify `operator_id` ownership before data access
- **Data Isolation:** Row-Level Security policies restrict queries to `operator_id` scope
- **Audit:** All actions logged with `user_id`, `operator_id`, `request_id`, `timestamp`

### 3.2. MVP v1 Limitations

**Single-User Access Pattern:**
- Operator accounts are designed for single-user or limited shared access
- No distinction between "owner", "manager", and "staff" within an operator account
- Shared credentials (if used) compromise auditability and accountability

**No Role Differentiation within Operator:**
- All users authenticating as an operator have identical permissions for that operator's data
- Cannot restrict one staff member to "view only" while allowing another to "edit"
- Cannot delegate specific tasks (e.g., "respond to bookings only") without full access

**Security Implications:**
- Shared credentials create security and accountability risks
- Departing staff members require password rotation for entire operator account
- No granular audit trail distinguishing individual staff actions

### 3.3. Why This Simplicity is Acceptable for MVP v1

**Business Context:**
- Early-stage operators are typically owner-operated or have very small teams
- Complex access control adds development cost and operator friction
- Operators can manage access informally through trust and communication

**Technical Context:**
- Core platform functions (search, booking, CRM) are prioritized over team management
- Incremental complexity can be added post-MVP based on real operator demand
- Authentication and authorization infrastructure supports future expansion

**Pragmatic Trade-off:**
MVP v1 optimizes for:
- **Speed to market** over feature completeness
- **Operator onboarding simplicity** over enterprise-grade access control
- **Core functionality stability** over secondary features

---

## 4. Conceptual Roles (High-Level)

### 4.1. Purpose of Conceptual Roles

This section describes **conceptual role categories** that may emerge in v2 or beyond. These are **NOT** implemented in MVP v1 and should **NOT** be treated as fixed specifications.

**Why Define Concepts Now:**
- Establish a shared vocabulary for future discussions
- Align stakeholder expectations around multi-user access evolution
- Guide architectural decisions to avoid painting ourselves into corners

**Important Caveat:**  
Actual implementation may differ significantly based on operator feedback, technical constraints, and product priorities. These are illustrative examples, not commitments.

### 4.2. Example Conceptual Role Categories

#### Owner / Administrator
**Typical Responsibilities:**
- Full control over operator account settings
- Authority to invite or remove other users
- Ability to manage billing and legal information
- Access to all warehouses, bookings, and CRM data
- Responsibility for operator account compliance

**Access Characteristics:**
- Unrestricted within operator scope
- Can delegate or revoke access for others
- Cannot access other operators' data (unless platform admin)

#### Manager / Supervisor
**Typical Responsibilities:**
- Oversee day-to-day operations for assigned warehouses
- Approve or decline booking requests
- View operational metrics and reports
- Manage CRM leads and customer communications
- Update warehouse and box information

**Access Characteristics:**
- Full operational access, but may not change account-level settings
- May be scoped to specific warehouses (not all operator properties)
- Cannot invite/remove users or change billing

#### Staff / Operator
**Typical Responsibilities:**
- Execute routine tasks (confirm bookings, update availability, respond to inquiries)
- View assigned bookings and leads
- Basic operational data entry

**Access Characteristics:**
- Restricted to specific functions and data views
- Cannot modify critical settings (pricing, warehouse status)
- May have read-only access to certain data

### 4.3. Access Scope Dimensions (Conceptual)

Future role design may consider multiple dimensions of access restriction:

**Functional Scope:**
- Which operations can be performed (read, create, update, delete)
- Which modules are accessible (warehouses, bookings, CRM, analytics)

**Data Scope:**
- Which warehouses are visible/manageable
- Which bookings or leads are accessible
- Which customers' data can be viewed

**Temporal Scope:**
- Access valid during specific time windows
- Temporary access grants for seasonal staff

**Contextual Scope:**
- Access granted based on conditions (e.g., booking status, approval workflows)

**Note:** These dimensions are exploratory concepts. Actual implementation depends on operational requirements and technical feasibility.

---

## 5. Multi-User Access Evolution (v2)

### 5.1. When Multi-User Access Becomes Relevant

**Triggers for Multi-User Need:**
- Operators managing multiple warehouses with distinct on-site staff
- Growing operators hiring dedicated booking coordinators or customer service staff
- Operators needing to delegate specific tasks without sharing full credentials
- Regulatory or audit requirements demanding individual accountability
- Security incidents demonstrating risks of shared credentials

**Not Triggers:**
- Small operators with 1-2 people (existing model sufficient)
- Operators who informally coordinate via external communication tools
- Scenarios where temporary access (e.g., consulting support) is managed out-of-band

### 5.2. Staged Evolution Approach

**Stage 1 (MVP v1): Single-User Model**
- Current implementation
- Operator account = one authenticated user
- Simple, fast, minimal friction

**Stage 2 (v2 Initial): Basic Multi-User**
- Allow multiple users to authenticate under one operator account
- Users maintain individual `user_id` for audit purposes
- All users have identical operator-level permissions (no role differentiation yet)
- Improved accountability through individual audit logs

**Stage 3 (v2 Advanced): Role-Based Differentiation**
- Introduce conceptual roles (owner, manager, staff) with distinct permissions
- Scope access by warehouse or functional area
- Support delegation and access revocation workflows

**Stage 4 (v2+): Contextual and Temporal Access**
- Conditional access based on workflows or approvals
- Time-limited access grants
- Integration with external identity providers (optional)

**Key Principle:**  
Each stage adds complexity only when clear operator demand and operational value are demonstrated.

### 5.3. Design Constraints for Future Expansion

**Database Model:**
- Current schema supports multiple `users` records linked to same `operator_id`
- Future: introduce `operator_users` or `operator_staff` junction table
- Future: add `operator_role` or `permissions` field for differentiation

**Authentication:**
- JWT tokens continue to identify `user_id` and `role`
- Backend resolves `user_id` → `operator_id` → permissions dynamically
- No breaking changes to existing authentication flow

**Authorization:**
- Guards extend to check user-specific permissions within operator context
- Row-Level Security remains foundational (operator-level isolation)
- Additional application-level checks for intra-operator restrictions

**Audit Logging:**
- All logs already capture `user_id` and `operator_id` separately
- Multi-user access improves audit granularity without schema changes

**Frontend:**
- Operator dashboard may need user management UI (invite, remove, assign roles)
- Role-specific UI restrictions (hide features unavailable to current user's role)

---

## 6. Role Assignment & Changes (Conceptual)

### 6.1. Access Grant Process (Future v2 Concept)

**Who Can Grant Access:**
- Operator account "owner" or designated administrator role
- Platform administrators (for support or compliance scenarios)

**How Access is Granted (Conceptual Flow):**
1. Owner invites new user via email or platform UI
2. Invited user receives invitation link
3. User authenticates or creates account
4. Owner assigns role and scope (if role differentiation is implemented)
5. System logs access grant event
6. User gains access to operator dashboard with assigned permissions

**Prerequisites:**
- Inviting user must have authority to grant access
- Invited user must have valid email and complete authentication
- Operator account must be in "active" status (not suspended)

### 6.2. Access Revocation Process (Conceptual)

**When Access Should Be Revoked:**
- Staff member leaves the organization
- Change in responsibilities no longer requires access
- Security incident or policy violation
- Operator account closure or suspension

**How Access is Revoked:**
- Owner or administrator removes user from operator context
- User's sessions are invalidated (logout)
- Audit log records revocation event and reason (if provided)
- Revoked user cannot access operator-scoped data going forward

**Impact:**
- User retains platform account (if applicable) but loses operator affiliation
- Existing audit logs remain intact (historical accountability preserved)
- User may still have `user` role for personal bookings (if separate from operator)

### 6.3. Role Changes (Conceptual)

**Typical Scenarios:**
- Promotion from staff to manager role
- Temporary elevation for specific task
- Scope expansion (assigned additional warehouses)

**Process:**
- Owner or administrator updates role assignment
- System logs role change event
- User's next session reflects new permissions
- No re-authentication required unless policy dictates

### 6.4. Traceability Principles

**All access-related events must be auditable:**
- Who granted access (granting user's `user_id`)
- Who received access (granted user's `user_id`)
- What role/scope was assigned
- When the grant occurred (timestamp)
- Why (optional reason field for documentation)

**Audit Retention:**
- Access grant/revoke logs retained according to platform data retention policy
- Logs are immutable (cannot be deleted or edited by operators)
- Platform administrators can review access history for compliance or support

---

## 7. Security & Accountability Considerations

### 7.1. Shared vs. Individual Access Risks

**Risks of Shared Credentials (Current MVP v1 Pattern):**

| Risk | Description | Mitigation (Current) | Mitigation (Future v2) |
|------|-------------|---------------------|----------------------|
| **Lack of Accountability** | Cannot determine which individual performed an action | Operator accepts collective responsibility | Individual user audit logs |
| **Credential Leakage** | Shared password increases exposure surface | Strong password policy, rate limiting | Individual credentials, MFA option |
| **Insider Threats** | Difficult to revoke access for one person without affecting others | Full password rotation required | Revoke individual user access |
| **Compliance Issues** | May not satisfy audit or regulatory requirements for individual attribution | Accept limitation in MVP v1 | Role-based access with audit trail |

**Benefits of Individual Access (Future v2):**
- Granular audit trails showing who did what
- Ability to revoke access without disrupting other users
- Compliance with regulations requiring individual accountability
- Reduced risk of credential sharing or leakage
- Foundation for role-based restrictions and delegation

### 7.2. Audit Log Requirements

**Current State (MVP v1):**
- All operator actions logged with `user_id`, `operator_id`, `timestamp`, `action`, `context`
- Logs centralized for platform-wide visibility (admin access only)
- Operators cannot access or modify audit logs directly

**Future Multi-User Considerations (v2):**
- Audit logs distinguish between different users within same `operator_id`
- Access grant/revoke events captured separately
- Logs include role information (if role differentiation exists)
- Operators may gain read-only access to their own audit history

**Security Monitoring:**
- Unusual login patterns (geographic anomalies, failed attempts)
- Privilege escalation attempts
- Mass data exports or deletions
- Access from unexpected IP ranges or devices

### 7.3. Misuse Prevention

**Platform-Level Controls:**
- Rate limiting prevents automated abuse
- Backend authorization guards enforce operator data isolation
- Row-Level Security provides defense-in-depth at database layer
- Session expiry limits exposure of stolen tokens

**Operator-Level Controls (Current):**
- Operators responsible for securing their own credentials
- Strong password policy enforced at registration
- Password reset requires email verification

**Operator-Level Controls (Future v2):**
- Ability to review access logs and detect unauthorized actions
- Role-based restrictions limit blast radius of compromised credentials
- Immediate revocation capability for suspected compromise

### 7.4. Compliance and Regulatory Alignment

**GDPR Considerations:**
- Right of access: Users can request their own audit logs
- Right to erasure: Operator account deletion triggers data anonymization
- Data minimization: Only necessary access granted; excess permissions avoided

**Industry Standards:**
- ISO 27001: Access control policies, audit logging, least privilege
- SOC 2: Individual accountability, audit trail integrity
- PCI-DSS (if payment features added): Strict access controls, logging, revocation

**Note:**  
Compliance is not solely achieved through access control. This document addresses only the access governance dimension. See `Security_and_Compliance_Plan_MVP_v1.md` for comprehensive compliance approach.

---

## 8. Relation to Other Documents

This document intersects with and relies upon the following canonical and supporting specifications:

### 8.1. Security & Authentication

**Security_Architecture_MVP_v1_CANONICAL.md:**
- § 5: Identity & Access Model — Defines role philosophy and permission structure
- § 4.6: Business Logic Layer — Authorization guard implementation
- § 4.7: Data Access Layer — Query-level security enforcement

**Security_and_Compliance_Plan_MVP_v1.md:**
- § 2: Access Control & RBAC — Current role definitions and permission matrix
- § 2.4: Operator Data Isolation — Row-Level Security implementation
- § 3: Authentication — JWT token structure and session management

**API_Design_Blueprint_MVP_v1_CANONICAL.md:**
- § 2.4: Role-Based Access Control — API-level role enforcement
- § 2.3: Authentication Endpoints — User login and session lifecycle

### 8.2. Operator Management

**User_Operator_Documentation_MVP_v1.md:**
- § 4.1: Operator Onboarding & Verification — Registration and approval process
- § 4.2: Operator Dashboard — Current operator capabilities and limitations

**Functional_Specification_MVP_v1_CORRECTED.md:**
- User Roles section — Confirmation that team management is out of MVP v1 scope

### 8.3. Admin & Governance

**Technical_Architecture_Document_MVP_v1_CANONICAL.md:**
- § 3.1: Frontend Modules — Admin panel (future) and operator dashboard
- § 3.2.2: User Management Module — User CRUD and role management

**Monitoring_and_Observability_Plan_MVP_v1_CANONICAL.md:**
- § 2.3: Audit Logs — Structure and retention of access-related logs

### 8.4. Key Alignments

| Aspect | This Document | Canonical Source | Alignment |
|--------|--------------|------------------|-----------|
| Current operator model | Single-user, unified permissions | Security Architecture § 5.2 | ✅ Consistent |
| Multi-user access | Future v2 concept | Functional Spec (team management = v1.1+) | ✅ Consistent |
| Audit logging | Required for all access events | Logging Strategy § 3.1 | ✅ Consistent |
| Data isolation | Operator-level via RLS | Security Plan § 2.4 | ✅ Consistent |

---

## 9. Non-Goals & Explicit Exclusions

### 9.1. What This Document Does NOT Address

**Enterprise IAM Features:**
- Integration with corporate identity providers (Active Directory, Okta, Azure AD)
- Single Sign-On (SSO) across multiple applications
- SCIM provisioning and deprovisioning
- Multi-factor authentication (MFA) enforcement policies

**HR and Organizational Management:**
- Hiring and onboarding workflows
- Performance reviews or compensation structures
- Reporting hierarchies beyond access delegation
- Training and certification tracking

**Legal and Liability Frameworks:**
- Individual employment contracts
- Liability allocation between operator entity and staff
- Insurance or indemnification clauses
- Labor law compliance

**Advanced Authorization Patterns:**
- Attribute-Based Access Control (ABAC)
- Policy-as-Code frameworks (Open Policy Agent, Cedar)
- Fine-grained, per-field access restrictions
- Dynamic access control based on real-time context

**Operational Workflows:**
- Approval chains for specific business processes
- Workflow automation or BPM integration
- Escalation policies for incidents or support tickets

### 9.2. Why These are Out of Scope

**MVP v1 Priority:**
- Core platform functionality takes precedence
- Operator demand for advanced access control is unproven
- Development resources focused on user-facing features

**Incremental Approach:**
- Add complexity only when justified by real operator needs
- Validate multi-user patterns before investing in advanced features
- Avoid over-engineering for edge cases

**Operator Profile:**
- Early-stage operators are small teams, not enterprises
- Complex access control may deter onboarding
- Operators can manage informally until they scale

---

## 10. Risks & Trade-offs

### 10.1. MVP v1 Trade-offs

**Risk: Lack of Individual Accountability**
- **Description:** Shared credentials obscure which person performed specific actions
- **Likelihood:** High (if operators share credentials)
- **Impact:** Medium (audit issues, security incidents harder to investigate)
- **Mitigation:** Accept as known limitation; operators informed during onboarding
- **Future Resolution:** Individual user accounts in v2

**Risk: Credential Sharing Security**
- **Description:** Multiple people knowing one password increases compromise risk
- **Likelihood:** Medium
- **Impact:** High (if credentials leaked, all operator data at risk)
- **Mitigation:** Strong password policy, rate limiting, monitoring for unusual activity
- **Future Resolution:** Individual credentials with revocation capability

**Risk: Access Revocation Friction**
- **Description:** Departing staff require full password rotation, disrupting other users
- **Likelihood:** Medium
- **Impact:** Medium (operational disruption, security window of exposure)
- **Mitigation:** Operators advised to rotate passwords promptly
- **Future Resolution:** Granular per-user revocation

### 10.2. v2 Evolution Risks

**Risk: Over-Complexity**
- **Description:** Adding too many roles or permissions creates operator confusion
- **Likelihood:** Medium (if not carefully scoped)
- **Impact:** High (poor UX, adoption resistance, increased support burden)
- **Mitigation:** Start with minimal role set; expand based on operator feedback
- **Design Principle:** Favor simplicity and usability over theoretical completeness

**Risk: Under-Control**
- **Description:** Insufficient access restrictions fail to prevent insider threats or mistakes
- **Likelihood:** Low (if least privilege applied)
- **Impact:** Medium (data breaches, unauthorized changes)
- **Mitigation:** Default to restrictive permissions; operators explicitly grant broader access
- **Design Principle:** Fail secure, not open

**Risk: Operator Friction**
- **Description:** Multi-user management adds operational burden for small operators
- **Likelihood:** Medium
- **Impact:** Medium (operators avoid feature, continue sharing credentials)
- **Mitigation:** Make multi-user access optional; keep single-user path simple
- **Design Principle:** Provide migration path, not forced upgrade

**Risk: Incomplete Implementation**
- **Description:** Launching v2 multi-user without full audit trail or revocation UX
- **Likelihood:** Medium (scope creep or rushed release)
- **Impact:** High (security gaps, operator frustration)
- **Mitigation:** Define MVP v2 feature set clearly; don't release half-baked
- **Design Principle:** v2 must be secure and usable, not just functional

### 10.3. Balancing Act

The platform must balance:

| Dimension | MVP v1 Position | v2 Goal |
|-----------|----------------|---------|
| **Security** | Basic (shared credentials acceptable) | Strong (individual accountability) |
| **Usability** | Maximum simplicity (no access management) | Intuitive multi-user (low learning curve) |
| **Flexibility** | Minimal (one access level) | Moderate (basic role differentiation) |
| **Operator Burden** | Near-zero (no management overhead) | Low (optional, self-service) |
| **Development Cost** | Low (no feature) | Medium (thoughtful v2 design) |

**Guiding Question:**  
Does this feature make operators more successful, or does it just check a box for "enterprise-grade access control"?

If the answer is the latter, defer or descope.

---

## 11. Recommendations & Next Steps

### 11.1. Immediate Actions (MVP v1)

**For Product:**
- Document and communicate MVP v1 access limitations to operators during onboarding
- Monitor operator support requests for access-related pain points
- Gather qualitative feedback: "Do you need multiple people to access your account?"

**For Engineering:**
- Ensure audit logs capture `user_id` and `operator_id` separately (already done per canonical docs)
- Validate that JWT authentication supports future multi-user extension without breaking changes
- Confirm database schema can accommodate `operator_users` junction table in future

**For Support:**
- Develop standard guidance for operators sharing credentials (risks, best practices)
- Track incidents related to shared credential security or accountability gaps
- Document operator requests for role-based access or team features

### 11.2. Pre-v2 Research Phase

**Before committing to v2 development:**
- Conduct operator interviews: How do you currently manage team access? What's painful?
- Analyze usage patterns: How many operators have multiple people using the account?
- Survey demand: Would you pay more for team access features?
- Review competitor offerings: What's table-stakes vs. differentiation?

**Success Criteria for v2 Go-Decision:**
- At least 20% of active operators request multi-user access
- Clear use cases articulated (e.g., "I need staff to confirm bookings but not change pricing")
- Operators willing to invest time in access management (not a grudge feature)

### 11.3. v2 Design Principles (When Approved)

**Start Minimal:**
- First release: multiple users, identical permissions, individual audit logs
- No role differentiation initially—validate multi-user UX first
- Simple UI: invite by email, remove user, view access list

**Add Roles Incrementally:**
- After multi-user foundation is solid, introduce 2-3 basic roles
- Roles map to real operator organizational patterns, not theoretical constructs
- Avoid permission matrix hell—group permissions into coherent bundles

**Prioritize Self-Service:**
- Operators manage their own access without contacting support
- Clear, obvious UI for inviting and revoking users
- Instant feedback and confirmation

**Ensure Security:**
- Individual credentials, no shared passwords
- Robust audit trail with tamper-proof logging
- Revocation must be immediate and reliable

**Measure Success:**
- Adoption rate: What % of eligible operators use multi-user?
- Support burden: Does feature reduce or increase support tickets?
- Security incidents: Does individual accountability reduce breach risk?

---

## 12. Conclusion

This document establishes a **principle-based governance framework** for operator staff access management, distinguishing between the MVP v1 baseline (single-user, simple) and potential v2 evolution (multi-user, role-differentiated).

**Key Takeaways:**

1. **MVP v1 is intentionally simple** — Single-user operator accounts meet current needs with minimal complexity.

2. **Multi-user access is a v2+ concept** — Not committed, contingent on operator demand and product validation.

3. **Principles over prescriptions** — Least privilege, explicit responsibility, auditability, simplicity.

4. **Security and usability co-equal** — Multi-user features must be secure AND easy for operators to use.

5. **No enterprise IAM scope** — This is an access governance guide, not an identity provider design.

**This document serves as a north star for conversations about operator access, not a binding specification for immediate development.**

When the time comes to build v2 multi-user features, this framework provides the philosophical foundation. Until then, MVP v1's simplicity is a feature, not a limitation.

---

**Document Control:**

| Attribute | Value |
|-----------|-------|
| Document ID | DOC-065 |
| Version | 1.0 |
| Status | Draft / Governance Guidance |
| Author | Technical Documentation Engine |
| Date Created | 2025-12-18 |
| Last Reviewed | 2025-12-18 |
| Next Review | Upon v2 roadmap definition |
| Classification | Supporting / Non-Canonical |

---

**End of Document**
