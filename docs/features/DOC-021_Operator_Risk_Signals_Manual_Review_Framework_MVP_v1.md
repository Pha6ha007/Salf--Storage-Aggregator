# Operator Risk Signals & Manual Review Framework (MVP v1)

**Document ID:** DOC-021  
**Version:** 1.0  
**Status:** 🟡 Supporting / Non-Canonical  
**Last Updated:** December 18, 2025  
**Project:** Self-Storage Aggregator Platform  
**Owner:** Trust & Safety / Operations Team  

---

## Document Control

| Role | Reviewer | Date | Status |
|------|----------|------|--------|
| Operations Lead | [Name] | [Date] | [Pending/Approved] |
| Backend Lead | [Name] | [Date] | [Pending/Approved] |
| Trust & Safety Lead | [Name] | [Date] | [Pending/Approved] |
| Product Owner | [Name] | [Date] | [Pending/Approved] |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Core Principles](#2-core-principles)
3. [Operator Risk Signals (MVP)](#3-operator-risk-signals-mvp)
4. [Signal Collection & Logging](#4-signal-collection--logging)
5. [Manual Review Workflow](#5-manual-review-workflow)
6. [Notifications & Visibility](#6-notifications--visibility)
7. [Relation to Other Documents](#7-relation-to-other-documents)
8. [Non-Goals (Explicit)](#8-non-goals-explicit)
9. [Risks & Limitations](#9-risks--limitations)

---

## 1. Document Role & Scope

### 1.1. Document Classification

**Type:** Supporting / Non-Canonical

This document provides operational guidance for identifying and reviewing potential operator risk indicators. It does NOT define mandatory system behavior, automated enforcement, or binding technical contracts.

**Canonical Authority:**  
For binding requirements, refer to:
- Functional Specification (MVP v1)
- Technical Architecture Document
- API Design Blueprint
- Database Specification
- Security & Compliance Plan

### 1.2. Purpose

This document establishes the **MVP v1 framework** for:

1. **Identifying risk signals** that may indicate operator issues requiring attention
2. **Logging signals** for audit trail and administrative review
3. **Presenting signals** to administrators for manual evaluation
4. **Supporting human decision-making** without automating enforcement

**Critical Constraint:**  
This framework is **indicator-based, not decision-based**. The platform identifies patterns that MAY warrant attention but DOES NOT automatically take enforcement action.

### 1.3. Scope Boundaries

**In Scope:**
- Detection of operator activity patterns that MAY indicate issues
- Event-based logging of risk indicators
- Administrative visibility into signal patterns
- Manual review workflow concepts
- Integration with existing audit and logging infrastructure

**Explicitly Out of Scope:**
- Automated operator blocking or suspension
- Auto-approval or auto-rejection of operator actions
- Financial enforcement (withholding payments, adjusting commissions)
- AI/ML-based risk scoring or prediction models
- Real-time automated restrictions
- Country-specific regulatory verification
- KYC/AML compliance automation
- Creation of new core services or APIs
- Operator credit scoring or financial evaluation

### 1.4. MVP Philosophy

**Human-in-the-Loop Mandatory:**  
All decisions affecting operator status, access, or business operations MUST be made by authorized administrators. The system provides information; humans make judgments.

**Conservative by Default:**  
When in doubt, the system logs signals for review but takes no action. False positives are expected and acceptable.

**No Automated Sanctions:**  
The platform does not automatically:
- Change operator account status
- Block operator access
- Withhold payments
- Cancel bookings
- Modify operator data

### 1.5. Audience

This document is intended for:
- Operations and Trust & Safety teams configuring review workflows
- Backend engineers implementing signal detection logic
- Platform administrators conducting manual reviews
- Product managers planning operator experience features
- Security and compliance teams evaluating risk management approach

---

## 2. Core Principles

### 2.1. Signals Are Not Decisions

**Fundamental Distinction:**  
The platform detects **indicators** (signals) that MAY suggest issues requiring attention. These indicators are NOT:
- Verdicts of wrongdoing
- Proof of policy violations
- Automated judgments
- Binding determinations

**Example:**  
A signal indicating "high cancellation ratio" means the system has detected a pattern. It does NOT mean:
- The operator is violating policy
- The operator should be restricted
- The cancellations are illegitimate
- Action must be taken

Administrators evaluate context, investigate if necessary, and decide whether any response is warranted.

### 2.2. Platform Does Not Judge Legality

**Scope Limitation:**  
The platform is NOT a regulatory body, legal authority, or arbiter of business legitimacy. The platform:
- Detects operational patterns
- Logs events for review
- Enables human investigation

The platform does NOT:
- Determine if operators are legally compliant
- Verify regulatory standing
- Assess business license validity
- Make legal determinations

**Operator Verification:**  
The existing operator onboarding and verification process (as defined in Functional Specification and User/Operator Documentation) remains the authority for operator approval. Risk signals do not override or replace the verification workflow.

### 2.3. Admin is Final Authority

**Decision Ownership:**  
All enforcement decisions rest with authorized platform administrators. The system provides:
- Visibility into signals
- Context for evaluation
- Audit trail of patterns

Administrators decide:
- Whether to investigate
- What additional information to request
- Whether action is warranted
- What action (if any) to take

**No Algorithmic Authority:**  
No formula, threshold, or automated logic has decision-making power. Human judgment is required.

### 2.4. Signals May Be Noisy

**Imperfection Expected:**  
Risk signals are heuristics, not precision instruments. The framework acknowledges:

**False Positives:**  
Legitimate operators may trigger signals due to business context, seasonal patterns, or unusual circumstances that are entirely acceptable.

**Incomplete Context:**  
Signals lack full business context. What appears suspicious may have reasonable explanations that only emerge through investigation.

**Evolving Patterns:**  
Early-stage operators, operators serving niche markets, or operators during unusual events may exhibit patterns that trigger signals despite operating appropriately.

**Administrative Response:**  
Administrators are expected to evaluate signals with appropriate skepticism, seek context, and avoid hasty conclusions.

### 2.5. Transparency with Limits

**Internal Transparency:**  
All signals, evaluations, and administrative decisions are logged for audit and review. Operations teams have full visibility into signal generation and resolution.

**Operator Communication:**  
Operators are NOT routinely informed of signal generation. Communication occurs only when:
- Administrator determines investigation is warranted
- Clarification or additional information is needed
- Action is being considered or taken

**Neutral Framing:**  
If operators are contacted regarding signals, communication is framed neutrally as a request for information or clarification, NOT as an accusation or allegation.

### 2.6. No Real-Time Enforcement

**Detection vs. Enforcement Separation:**  
Signal detection may occur in near-real-time (as events are logged), but enforcement is NEVER real-time. Administrative review introduces deliberate delay, ensuring:
- Time for investigation
- Opportunity for operator explanation
- Context evaluation
- Measured decision-making

**Minimum Review Period:**  
No administrative action affecting operator standing occurs without adequate review time. What constitutes "adequate" is determined by administrators based on signal severity and context.

---

## 3. Operator Risk Signals (MVP)

### 3.1. Signal Categories Overview

The following categories represent **indicator types** the platform MAY detect. These are observational patterns, not enforcement triggers.

**Important Reminders:**
- Detection of any signal does NOT automatically trigger action
- Signals are informational only
- Administrators evaluate relevance and context
- Not all signals warrant investigation

### 3.2. Profile Completeness Signals

**Signal Type:** Incomplete or Inconsistent Operator Profile

**Detection Criteria (Examples):**
- Operator profile fields contain placeholder or obviously invalid data
- Contact information cannot be verified through standard communication
- Company information appears inconsistent with submitted documents
- Repeated changes to core profile fields (company name, INN, contact person) in short time periods

**Rationale:**  
Incomplete profiles may indicate hasty registration or attempts to obscure identity. However, they may also indicate:
- Technical issues during onboarding
- Legitimate business restructuring
- Administrative errors
- Misunderstanding of platform requirements

**Review Focus:**  
If flagged, administrators may request clarification or updated documentation.

### 3.3. Data Modification Signals

**Signal Type:** Frequent or Suspicious Profile Changes

**Detection Criteria (Examples):**
- Multiple changes to bank account details within short time period
- Repeated modifications to company legal information after verification
- Changes to contact information immediately after complaints or disputes
- Pattern of warehouse data updates that appear coordinated with booking patterns

**Rationale:**  
Frequent changes may indicate:
- Legitimate business evolution or corrections
- Response to operational issues
- Administrative coordination (e.g., updating warehouses for seasonal closures)
- Potentially suspicious attempts to evade detection or accountability

**Review Focus:**  
Administrators may investigate whether changes align with legitimate business activity or suggest irregular behavior.

### 3.4. Booking Cancellation Signals

**Signal Type:** Abnormal Booking Cancellation Ratios

**Detection Criteria (Examples):**
- Operator cancellation rate significantly exceeds platform average
- Pattern of cancellations immediately after booking confirmation
- High proportion of cancellations with vague or absent reasons
- Cancellation patterns correlated with specific user segments or box types

**Rationale:**  
High cancellation rates may indicate:
- Inventory management issues
- Overbooking practices
- Legitimate fluctuations in availability
- User expectation mismatches
- Potentially suspicious selective acceptance patterns

**Review Focus:**  
Administrators evaluate whether cancellation patterns suggest operational issues, policy misunderstandings, or potentially discriminatory practices.

**Important Context:**  
Some cancellation is normal and expected. Signals focus on patterns that are statistically anomalous relative to platform norms.

### 3.5. User Complaint Signals

**Signal Type:** Elevated User Complaint Volume

**Detection Criteria (Examples):**
- Multiple user complaints about the same operator or warehouse
- Complaints mentioning similar issues (e.g., misleading listings, access problems)
- Complaints escalated through support channels
- Pattern of complaints despite low booking volume

**Rationale:**  
User complaints may indicate:
- Legitimate service quality issues requiring operator attention
- Misunderstandings about warehouse features or policies
- User expectations not aligned with listing descriptions
- Potentially serious issues with operator conduct

**Review Focus:**  
Administrators evaluate complaint patterns, severity, and operator responsiveness to determine if intervention or guidance is appropriate.

### 3.6. Listing Quality Signals

**Signal Type:** Listing Data Quality Issues

**Detection Criteria (Examples):**
- Photos appear to be stock images or do not match warehouse location
- Warehouse descriptions contain copied or template text from other operators
- Address information conflicts with geolocation data
- Features/amenities listed do not align with warehouse type or location
- Pricing appears significantly misaligned with market (suspiciously low or high)

**Rationale:**  
Listing quality issues may indicate:
- Hasty or careless listing creation
- Misunderstanding of platform requirements
- Potentially fraudulent or misleading listings

**Review Focus:**  
Administrators may request updated photos, address verification, or clarification of amenities.

### 3.7. Activity Pattern Signals

**Signal Type:** Unusual Activity Patterns

**Detection Criteria (Examples):**
- Login activity from multiple IP addresses or geographic regions in implausible timeframes
- API usage patterns inconsistent with normal operator behavior
- Bulk operations (e.g., multiple warehouse updates) at unusual times
- Account activity during periods of declared vacation or warehouse closure

**Rationale:**  
Unusual patterns may indicate:
- Account compromise or unauthorized access
- Use of automation or third-party tools
- Legitimate multi-location business operations
- Administrative staff working across locations

**Review Focus:**  
Administrators may verify account security and legitimate access patterns.

### 3.8. Communication Responsiveness Signals

**Signal Type:** Poor Communication or Non-Responsiveness

**Detection Criteria (Examples):**
- Operator fails to respond to booking requests within reasonable timeframes
- Operator does not reply to user inquiries or platform communications
- Pattern of ignored or delayed responses despite active account status
- Operator communications are unprofessional or problematic

**Rationale:**  
Non-responsiveness may indicate:
- Operator overwhelmed with volume
- Technical issues with notifications
- Business closure or abandonment
- Deliberate neglect or disengagement

**Review Focus:**  
Administrators may contact operator to verify operational status and address communication issues.

### 3.9. Financial Transaction Signals

**Signal Type:** Unusual Financial Patterns (Post-MVP)

**Note:** In MVP v1, payment processing is limited or external. This signal category is included for future reference but may not be actively detected in MVP.

**Detection Criteria (Examples - Future):**
- Unusually high refund rates
- Disputes or chargebacks exceeding platform norms
- Financial activity inconsistent with booking volume
- Patterns suggesting financial irregularities

**Rationale:**  
Financial issues may indicate problems with operator practices, user satisfaction, or potentially fraudulent activity.

**Review Focus:**  
Administrators would evaluate financial patterns in context of business operations (future capability).

### 3.10. Review and Rating Signals

**Signal Type:** Suspicious Review Patterns

**Detection Criteria (Examples):**
- All reviews for operator are uniformly positive (suspiciously consistent ratings)
- Review timing patterns suggest coordination (e.g., multiple 5-star reviews in short window)
- Review text contains repetitive or template language
- Operator rating significantly diverges from booking/complaint patterns

**Rationale:**  
Review patterns may indicate:
- Genuine excellent or poor service
- Review manipulation or coordination
- Small sample size creating statistical noise
- Seasonal or operational factors

**Review Focus:**  
Administrators evaluate review authenticity and consistency with other operator signals.

### 3.11. Signal Generation Rules

**No Thresholds Defined:**  
This document does NOT define numeric thresholds, formulas, or specific trigger conditions. These are implementation details determined by operations and engineering teams based on platform scale and observed baseline patterns.

**No Scoring:**  
Signals are discrete indicators, not scored or weighted. The platform does not calculate "risk scores" or aggregate signals into numerical ratings.

**No Automated Combination:**  
The platform does not automatically combine multiple signals into compound determinations. Each signal is evaluated independently by administrators who may consider multiple signals in context.

---

## 4. Signal Collection & Logging

### 4.1. Event-Based Detection

**Trigger Points:**  
Signals are generated based on events occurring within the platform:
- Operator profile updates
- Booking status changes
- User complaints submitted
- Review creation
- API requests and actions
- Administrative actions

**Passive Detection:**  
Signal detection is passive. The system observes events that already occur and evaluates whether they match signal criteria. No additional intrusive monitoring or data collection is introduced.

### 4.2. Signal Logging Structure

**Log Entry Components:**

All signal logs MUST capture:

1. **Signal Identification**
   - Signal type (e.g., "profile_modification_signal")
   - Signal category (e.g., "data_modification")
   - Timestamp of signal generation

2. **Operator Context**
   - Operator ID
   - Operator account status at time of signal
   - Warehouse ID(s) if relevant

3. **Event Context**
   - Triggering event (e.g., "warehouse_update", "booking_cancelled")
   - Event timestamp
   - Relevant event metadata (IDs, status changes, etc.)

4. **Signal Details**
   - Detection criteria met (e.g., "cancellation ratio exceeded threshold")
   - Relevant metrics or counts
   - Contextual data supporting signal generation

5. **Administrative Metadata**
   - Review status (e.g., "unreviewed", "in_review", "resolved")
   - Assigned reviewer (if any)
   - Resolution timestamp (if reviewed)
   - Resolution outcome (if reviewed)

**Example Signal Log (Conceptual):**

```json
{
  "signal_id": "sig_abc123",
  "signal_type": "abnormal_cancellation_ratio",
  "signal_category": "booking_patterns",
  "generated_at": "2025-12-18T14:23:00Z",
  "operator_id": 456,
  "operator_status": "active",
  "warehouse_ids": [101, 102],
  "triggering_event": {
    "event_type": "booking_cancelled",
    "event_id": "booking_xyz789",
    "event_timestamp": "2025-12-18T14:20:00Z"
  },
  "signal_details": {
    "operator_cancellation_rate": 0.45,
    "platform_average_rate": 0.12,
    "cancellations_last_30_days": 18,
    "bookings_last_30_days": 40
  },
  "review_status": "unreviewed",
  "assigned_reviewer": null,
  "reviewed_at": null,
  "resolution_outcome": null
}
```

### 4.3. Storage and Retention

**Storage Location:**  
Signal logs are stored in the `events_log` table (as defined in Database Specification) using the JSONB payload field for signal details.

**Retention Period:**  
Signal logs follow the retention policy defined in **Data Retention Policy (DOC-036)** for audit and compliance logs. Retention period supports:
- Administrative review over reasonable timeframes
- Audit trail for enforcement actions
- Pattern analysis for operations improvement
- Compliance with data governance requirements

**Access Control:**  
Signal logs are accessible only to:
- Authorized administrators with trust & safety responsibilities
- Operations personnel conducting reviews
- Audit and compliance teams
- Engineering for troubleshooting (with appropriate access controls)

### 4.4. Immutability

**Audit Trail Integrity:**  
Signal logs are immutable. Once generated, log entries are NOT modified or deleted (except per data retention policy expiration).

**Administrative Actions Logged Separately:**  
Administrative reviews, decisions, and actions are logged as separate entries, NOT by modifying original signal logs. This preserves complete audit trail of:
- Original signal generation
- Administrative review process
- Decision rationale
- Actions taken (if any)

### 4.5. Integration with Logging Infrastructure

**Alignment with Logging Strategy:**  
Signal logging follows the principles and standards defined in **Logging Strategy & Log Taxonomy (DOC-055)**:

- **Log Level:** INFO (signal generated)
- **Log Structure:** Structured JSON logs
- **Correlation IDs:** Link signals to triggering events
- **PII Handling:** Minimize PII in signal logs; reference operator ID rather than including full profile
- **Aggregation:** Signals flow into centralized logging infrastructure

**No Separate Signal Storage System:**  
Signals use existing platform logging and event infrastructure. No new databases or specialized systems are introduced for MVP.

---

## 5. Manual Review Workflow

### 5.1. Review Queue Concept

**Signal Aggregation:**  
Administrators access signals through an administrative interface (console, dashboard, or reporting tool) that presents:
- Unreviewed signals
- Signals grouped by operator
- Signals grouped by type or category
- Signals prioritized by relevance or recency

**Implementation Flexibility:**  
This document does NOT specify the exact UI, tool, or interface for accessing signals. Implementation may range from:
- Database queries and reports
- Simple admin dashboard views
- Dedicated review queue interface
- Integration with existing admin panels

**Queue Management:**  
Administrators may:
- Mark signals as "in review"
- Assign signals to specific reviewers
- Mark signals as "resolved" with outcome
- Add notes or comments to signals

### 5.2. Review Process Steps

**Step 1: Signal Identification**  
Administrator identifies signal requiring attention (either proactively or through queue prioritization).

**Step 2: Context Gathering**  
Administrator reviews:
- Signal details and triggering events
- Operator profile and history
- Related signals (if any) for same operator
- User complaints or feedback (if relevant)
- Booking and cancellation history
- Warehouse listings and data

**Step 3: Evaluation**  
Administrator evaluates whether signal indicates:
- No issue (false positive, normal business activity)
- Minor issue requiring guidance or clarification
- Moderate issue requiring follow-up or monitoring
- Serious issue requiring investigation or action

**Step 4: Decision**  
Based on evaluation, administrator decides on outcome (see Section 5.3).

**Step 5: Documentation**  
Administrator documents:
- Review findings
- Decision rationale
- Actions taken (if any)
- Follow-up required (if any)

**Step 6: Signal Resolution**  
Signal is marked as resolved with outcome recorded in logs.

### 5.3. Possible Review Outcomes

**Outcome: No Action Required**  
- Signal determined to be false positive
- Pattern is within acceptable norms
- Context explains signal (seasonal, business-specific, etc.)
- No further follow-up needed

**Outcome: Request Clarification**  
- Administrator contacts operator (via email or phone) requesting additional information
- Operator is asked to explain pattern or provide documentation
- Communication is neutral and professional
- Operator response informs next steps

**Outcome: Provide Guidance**  
- Administrator identifies operational issue (e.g., listing quality, responsiveness)
- Guidance or training provided to operator
- Operator is given opportunity to improve
- Follow-up monitoring may be noted

**Outcome: Monitor for Further Signals**  
- Signal noted but no immediate action
- Operator is flagged for increased attention if similar signals recur
- No operator communication unless additional signals appear

**Outcome: Escalate for Investigation**  
- Signal suggests potentially serious issue (fraud, discrimination, safety)
- Matter escalated to senior operations, trust & safety, or legal review
- More thorough investigation initiated
- Formal enforcement may be considered (manual decision by authorized personnel)

**Outcome: Manual Restriction (External to System)**  
- In rare cases, administrator determines operator should be restricted
- **Critical:** The platform system does NOT execute restriction automatically
- Administrator manually updates operator status through admin controls
- Action is logged and documented with rationale
- Operator is notified (per platform policies and legal requirements)

### 5.4. Enforcement Actions Are Manual

**No System-Initiated Enforcement:**  
The signal detection and review system does NOT have the capability to:
- Change operator account status
- Block operator access
- Modify operator permissions
- Cancel bookings
- Withhold payments

**Admin-Initiated Only:**  
If enforcement action is warranted, authorized administrators use existing platform admin capabilities (defined in operator management systems and admin APIs) to manually:
- Change operator status to "suspended" (if such status exists)
- Contact operator with policy violation notice
- Request additional verification or documentation
- Work with legal/compliance teams on serious violations

**Separation of Concerns:**  
Signal detection, review workflow, and enforcement actions are conceptually separate. This document defines signal detection and review. Enforcement policies and procedures are governed by other documents (Trust & Safety Framework, Operator Agreements, etc.).

### 5.5. Appeal and Reconsideration

**Operator Right to Explanation:**  
If administrative action is taken based on signal review, operators have the right to:
- Understand what signals triggered review
- Provide additional context or explanation
- Request reconsideration of decisions

**Appeal Process:**  
Specific appeal procedures are defined in:
- **Trust & Safety Framework (DOC-106)** — Appeals and fairness principles
- **Operator Agreement (DOC-060)** — Contractual appeal rights

**Review Reversal:**  
Administrators may reverse or modify decisions if new information emerges or if initial evaluation was incorrect.

---

## 6. Notifications & Visibility

### 6.1. Internal Administrator Notifications

**Purpose:**  
Administrators receive notifications when signals are generated to enable timely review.

**Notification Channels:**  
- Email alerts (for high-priority signals)
- Dashboard indicators (signal counts in admin interface)
- Daily or weekly summary reports
- Slack or internal communication tool notifications (optional)

**Notification Content:**  
Notifications inform administrators that signals require review but do NOT include full operator details (to avoid accidental PII exposure). Administrators access full details through secure admin interfaces.

**Prioritization:**  
Notification rules may prioritize certain signal types (e.g., multiple complaints, account security signals) for immediate attention.

### 6.2. No Automatic Operator Notifications

**Default Behavior:**  
Operators are NOT automatically notified when signals are generated.

**Rationale:**
- Signals are informational and may be false positives
- Notifying operators of every signal creates unnecessary alarm
- Many signals resolve without operator involvement
- Premature notification may compromise investigations in rare serious cases

### 6.3. Operator Communication (When Appropriate)

**Threshold for Communication:**  
Operators are contacted only when administrator determines communication is necessary:
- To request clarification or additional information
- To provide guidance on platform usage
- To notify operator of policy violation or required action

**Communication Tone:**  
All operator communication is:
- **Neutral:** Avoids accusatory or judgmental language
- **Specific:** Clearly explains what information is requested or what issue is identified
- **Professional:** Maintains respectful tone regardless of issue severity
- **Actionable:** Provides clear next steps or expectations

**Example Phrasing (Acceptable):**
> "We've noticed some unusual activity on your account and would like to verify a few details. Could you please provide updated documentation for [specific item]?"

**Example Phrasing (Unacceptable):**
> "Our system has flagged your account for suspicious behavior. You are under investigation."

### 6.4. Transparency Limits

**What Operators May Learn:**  
If operators inquire about account status or reviews, administrators may share:
- General platform policies and expectations
- Specific issues identified (if review has concluded)
- Required actions or improvements

**What Operators Are NOT Told:**
- Existence or details of specific signal detection algorithms
- Thresholds or criteria for signal generation
- Other operators' patterns or platform-wide statistics (unless public)
- Internal review processes or decision-making criteria

**Rationale:**  
Transparency supports fairness and operator improvement while protecting system integrity and preventing gaming.

---

## 7. Relation to Other Documents

This framework integrates with and supports other platform specifications. It does NOT replace or override canonical requirements.

### 7.1. Trust & Safety Framework (DOC-106)

**Relationship:**  
This framework implements aspects of the detection and response philosophy defined in the Trust & Safety Framework.

**Key Alignment:**
- Human-in-the-loop requirement (DOC-106 § 5)
- Graduated response principles (DOC-106 § 4.3)
- Fairness and transparency commitments (DOC-106 § 6)
- Documentation and audit requirements (DOC-106 § 9)

**Boundary:**  
Trust & Safety Framework defines governance principles. This document defines operational signal detection.

### 7.2. Operator Onboarding (DOC-063, User/Operator Documentation)

**Relationship:**  
Operator onboarding establishes initial verification and approval. Risk signals provide ongoing monitoring after operators are approved.

**Key Alignment:**
- Operator statuses (pending_verification, active, suspended) defined in onboarding specs
- Document verification processes remain authoritative for initial approval
- Risk signals do NOT override or replace verification requirements

**Boundary:**  
Onboarding addresses initial approval. Risk signals address ongoing operational behavior.

### 7.3. Logging Strategy & Log Taxonomy (DOC-055)

**Relationship:**  
Signal logging follows the structure, standards, and retention policies defined in the Logging Strategy.

**Key Alignment:**
- Structured JSON logging format
- Log levels and correlation IDs
- PII minimization in logs
- Centralized log aggregation
- Retention per DOC-055 § 6

**Boundary:**  
Logging Strategy defines how to log. This document defines what signals to log.

### 7.4. Security & Compliance Plan (DOC-078)

**Relationship:**  
Risk signals support security monitoring and incident response defined in Security & Compliance Plan.

**Key Alignment:**
- Audit trail requirements (DOC-078 § 7)
- Access control to signal data (DOC-078 § 4.2)
- Integration with incident response (DOC-078 § 10)
- Data retention compliance (DOC-078 § 4.5)

**Boundary:**  
Security Plan defines security controls. This document defines operational risk indicators.

### 7.5. Monitoring & Observability Plan (DOC-057)

**Relationship:**  
Signal detection integrates with platform monitoring and alerting infrastructure.

**Key Alignment:**
- Observability of signal generation rates
- Alerting on signal processing failures
- Monitoring of review queue health
- Integration with operational dashboards

**Boundary:**  
Monitoring Plan addresses system health. This document addresses operator behavior indicators.

### 7.6. API Design Blueprint (DOC-015)

**Relationship:**  
Admin APIs for signal review and operator management are defined in API specifications, not this document.

**Key Alignment:**
- Admin endpoints for operator status management
- Rate limiting for admin actions (DOC-017)
- Authentication and authorization for admin operations

**Boundary:**  
API Blueprint defines technical contracts. This document defines conceptual review workflow.

### 7.7. Data Retention Policy (DOC-036)

**Relationship:**  
Signal logs follow retention rules defined in Data Retention Policy.

**Key Alignment:**
- Audit log retention periods (DOC-036 § 4.9)
- Deletion of expired logs per policy
- Anonymization where applicable

**Boundary:**  
Data Retention Policy defines retention rules. This document defines signal logging purpose.

### 7.8. Admin Panel Specification (Future)

**Relationship:**  
When admin panel or admin tools are formally specified, they will implement the review workflow described here.

**Integration Points:**
- Signal queue interface
- Operator profile views with signal history
- Review workflow UI
- Documentation and resolution tools

**Note:**  
Admin tooling specifications are post-MVP. This document describes conceptual workflow independent of specific UI implementation.

---

## 8. Non-Goals (Explicit)

This section explicitly identifies what this framework **does NOT** do to prevent scope creep and misunderstanding.

### 8.1. Not a Risk Scoring System

**What This Is NOT:**  
This framework is NOT an automated risk scoring, credit rating, or operator evaluation system.

**Specifically NOT Included:**
- Numeric risk scores or ratings for operators
- Algorithmic determination of "trustworthiness"
- Automated operator ranking or classification
- Predictive models forecasting operator behavior
- Comparative operator evaluations

**Why:**  
Scoring implies precision and objectivity that are inappropriate for MVP. Human evaluation with context is required.

### 8.2. Not an AI/ML Decision Engine

**What This Is NOT:**  
This framework does NOT employ artificial intelligence, machine learning, or predictive analytics to make decisions about operators.

**Specifically NOT Included:**
- Machine learning models classifying operators
- Neural networks predicting fraud or risk
- AI-driven enforcement recommendations
- Automated pattern recognition beyond simple rule-based detection
- Training data sets or model accuracy metrics

**Why:**  
AI/ML introduces complexity, bias risk, and regulatory concerns inappropriate for MVP. Rule-based detection with human review is sufficient.

### 8.3. Not a Billing or Settlement Control System

**What This Is NOT:**  
This framework does NOT manage, control, or influence operator financial flows.

**Specifically NOT Included:**
- Withholding operator payments based on signals
- Adjusting commission rates or fees
- Freezing operator accounts or funds
- Modifying settlement schedules
- Financial penalty assessment

**Why:**  
Financial enforcement requires legal, contractual, and regulatory frameworks beyond scope of signal detection. Payment disputes are handled through separate mechanisms.

### 8.4. Not a Regulatory Verification System

**What This Is NOT:**  
This framework does NOT perform KYC (Know Your Customer), AML (Anti-Money Laundering), or regulatory compliance verification.

**Specifically NOT Included:**
- Government database checks
- Sanctions list screening
- Business license validation
- Tax compliance verification
- Industry-specific regulatory checks (e.g., storage facility licensing)

**Why:**  
Regulatory verification is handled during operator onboarding and by compliance teams, not through operational risk signals.

### 8.5. Not a Fraud Prosecution Tool

**What This Is NOT:**  
This framework does NOT investigate, prove, or prosecute fraud or criminal activity.

**Specifically NOT Included:**
- Evidence collection for legal proceedings
- Law enforcement coordination
- Fraud determination or accusations
- Legal liability assessment

**Why:**  
Fraud investigation and legal action require specialized expertise, legal process, and authority beyond platform operations. Signals may inform escalation to appropriate authorities but are not forensic tools.

### 8.6. Not a Real-Time Blocking Mechanism

**What This Is NOT:**  
This framework does NOT provide instant or automatic blocking of operator actions.

**Specifically NOT Included:**
- Real-time operator access restriction
- Instant suspension upon signal detection
- Automated booking cancellation
- Immediate listing removal
- Live operator lockout

**Why:**  
Real-time enforcement removes human judgment and creates risk of erroneous impacts on legitimate operators. Review and deliberation are required.

### 8.7. Not an Operator Performance Management System

**What This Is NOT:**  
This framework does NOT provide operator coaching, training, or performance improvement management.

**Specifically NOT Included:**
- Operator performance dashboards (for operators)
- Gamification or incentives
- Training modules or certification
- Performance improvement plans

**Why:**  
Operator success and quality management are separate product and operations initiatives. Risk signals address potential issues, not performance optimization.

---

## 9. Risks & Limitations

### 9.1. False Positives

**Risk:**  
Legitimate operators may trigger signals due to:
- Unusual but valid business circumstances
- Statistical noise or small sample sizes
- Platform-specific operational patterns
- Misalignment between signal criteria and actual policy violations

**Impact:**  
- Unnecessary administrative workload
- Potential operator frustration if contacted unnecessarily
- Risk of unfair treatment if false positives are not properly evaluated

**Mitigation:**
- Administrators trained to evaluate context and seek explanations
- Review process includes skepticism of signals
- Operators given opportunity to explain patterns
- Continuous refinement of signal criteria based on false positive rate

### 9.2. Delayed Response

**Risk:**  
Manual review introduces delay between signal generation and administrative response. This means:
- Issues may continue during review period
- Users may experience problems before operator is contacted
- Urgent safety or fraud issues may not be addressed immediately

**Impact:**  
- Platform may not prevent harm in real-time
- Reactive rather than proactive risk management
- User complaints may accumulate before action

**Mitigation:**
- High-priority signals (e.g., safety concerns) receive expedited review
- Severe issues escalate to incident response procedures (DOC-078 § 10)
- Manual review is deliberate trade-off for fairness over speed

**Acceptance:**  
For MVP, delayed response is acceptable. The platform prioritizes fairness and avoids automated errors over instant enforcement.

### 9.3. Manual Workload

**Risk:**  
Signal-based review creates ongoing operational burden:
- Administrators must review signals regularly
- Non-trivial time investment per signal evaluation
- Workload scales with operator count and activity
- Risk of review backlog if resources are insufficient

**Impact:**  
- Operational costs
- Potential for missed signals if volume overwhelms capacity
- Administrator burnout if workload is excessive

**Mitigation:**
- Prioritization of signals by severity or likelihood
- Automation of administrative workflow (e.g., queue management)
- Staffing aligned with expected signal volume
- Periodic review of signal generation rules to reduce noise

**Planning:**  
Operations teams monitor review queue health and adjust staffing or signal criteria as needed.

### 9.4. Limited MVP Coverage

**Risk:**  
MVP signal detection is limited in scope and sophistication:
- Only detects predefined signal types
- May miss subtle or novel patterns
- Lacks historical context or trend analysis
- No cross-operator or platform-wide pattern detection

**Impact:**  
- Not all operator issues will be detected
- Sophisticated bad actors may evade detection
- Limited learning from platform-wide trends

**Acceptance:**  
MVP is intentionally limited. Coverage expands in future versions based on operational learning and observed needs.

### 9.5. Bias and Fairness Risks

**Risk:**  
Signal detection and human review may introduce bias:
- Signal criteria may disproportionately affect certain operator types (e.g., small operators, new operators)
- Administrator bias may influence review outcomes
- Lack of transparency may create perception of unfairness

**Impact:**  
- Potential disparate impact on operator segments
- Legal or reputational risk if bias is perceived or proven
- Erosion of operator trust in platform

**Mitigation:**
- Signal criteria reviewed for potential bias
- Administrator training on fair evaluation
- Documentation of decision rationale for audit
- Periodic review of outcomes by segment (size, location, tenure)
- Operator appeal mechanisms (per Trust & Safety Framework)

**Commitment:**  
Platform commits to evaluating fairness of signal framework and outcomes on ongoing basis.

### 9.6. Incomplete Context

**Risk:**  
Signals lack full business context that only operators possess. Administrators may:
- Misinterpret patterns due to missing information
- Make incorrect assumptions
- Fail to understand legitimate operational reasons

**Impact:**  
- Risk of unfair operator treatment
- Administrative time wasted on non-issues
- Operator frustration with platform understanding

**Mitigation:**
- Administrators proactively seek operator input
- Communication emphasizes information gathering, not accusations
- Operators given opportunity to provide context
- Review process includes benefit of doubt for operators

### 9.7. Evolution and Adaptation

**Risk:**  
Bad actors may learn signal criteria over time and adapt behavior to evade detection.

**Impact:**  
- Decreasing effectiveness of signals over time
- Arms race between detection and evasion
- Need for continuous signal evolution

**Mitigation:**
- Signal criteria are not publicly documented in detail
- Periodic review and update of signal definitions
- Learning from resolved cases informs improvements
- New signal types added as patterns emerge

**Acceptance:**  
Detection evasion is inevitable. Platform accepts need for ongoing adaptation.

### 9.8. System Complexity

**Risk:**  
Signal detection, logging, and review workflow add system complexity:
- Additional code and infrastructure
- Potential for bugs or system failures
- Maintenance burden
- Integration points with multiple systems

**Impact:**  
- Development and operational costs
- Risk of signal system malfunction
- Potential for unintended consequences

**Mitigation:**
- Clear separation of signal detection from enforcement
- Comprehensive testing of signal logic
- Monitoring of signal system health
- Graceful degradation if signal system fails (no operator impact)

---

## 10. Future Evolution (Post-MVP)

This section outlines potential future enhancements beyond MVP scope. These are NOT commitments and are NOT part of MVP v1.

### 10.1. Enhanced Signal Types

**Potential Additions:**
- Cross-operator pattern detection (e.g., coordinated networks)
- Temporal trend analysis (deteriorating performance over time)
- User sentiment analysis from reviews and feedback
- Integration with external data sources (public records, business databases)

### 10.2. Workflow Automation

**Potential Enhancements:**
- Automated signal prioritization based on severity
- Workflow routing to specialized review teams
- Integration with case management systems
- Automated operator communication for low-risk signals

### 10.3. Analytics and Reporting

**Potential Capabilities:**
- Platform-wide signal trends and patterns
- Operator segment analysis
- Effectiveness metrics for signal types
- Administrator performance dashboards

### 10.4. Advanced Detection

**Potential Techniques:**
- Statistical anomaly detection
- Machine learning pattern recognition (with human oversight)
- Predictive modeling (with appropriate governance)
- Real-time streaming analytics

**Critical Constraint:**  
Even with advanced detection, human-in-the-loop decision-making remains mandatory for enforcement actions.

---

## 11. Governance & Maintenance

### 11.1. Document Ownership

**Primary Owner:** Trust & Safety / Operations Team

**Review Cadence:**
- Quarterly review of signal types and effectiveness
- Annual comprehensive document review
- Ad-hoc updates as operational needs evolve

**Approval Authority:**
- Operations Lead (operational changes)
- Product Owner (scope changes)
- Security & Compliance teams (regulatory implications)

### 11.2. Signal Criteria Updates

**Process for Adding/Modifying Signals:**
1. Operational need identified (e.g., new pattern observed, policy change)
2. Proposed signal criteria documented
3. Review for bias, fairness, and effectiveness
4. Implementation and testing
5. Documentation update
6. Monitoring of new signal performance

**Approval Required:**  
Operations Lead approval for new signal types. Engineering Lead approval for changes affecting system architecture.

### 11.3. Audit and Compliance

**Regular Audits:**  
Signal framework and outcomes reviewed by:
- Internal compliance team (quarterly)
- Security team (annually)
- External auditors (as required)

**Audit Focus:**
- Fairness and bias assessment
- Effectiveness of signal detection
- Administrator adherence to review process
- Audit trail completeness
- Operator appeal patterns

### 11.4. Feedback Loop

**Learning from Operations:**  
Framework evolves based on:
- Administrator feedback on signal quality
- False positive/negative rates
- Operator feedback and appeals
- Incident learnings
- Platform growth and scale

**Continuous Improvement:**  
Operations team maintains ongoing evaluation of framework effectiveness and proposes improvements.

---

## 12. Conclusion

### 12.1. Framework Summary

This Operator Risk Signals & Manual Review Framework establishes the MVP v1 approach to detecting and evaluating operator risk indicators while maintaining strict human oversight and fairness.

**Key Characteristics:**
- **Indicator-based:** Detects signals, not verdicts
- **Manual review:** Humans make all decisions
- **Conservative:** Prefers caution over automation
- **Auditable:** Comprehensive logging and documentation
- **Fair:** Context evaluation and operator communication

### 12.2. Relationship to Trust & Safety

This framework is ONE component of the broader Trust & Safety strategy (DOC-106). It addresses:
- Detection of operator issues
- Administrative visibility
- Review workflow

It does NOT address:
- User safety mechanisms
- Content moderation
- Payment fraud
- Platform security

These are covered by other specifications and initiatives.

### 12.3. Success Criteria

This framework is successful if:
- Legitimate operators are NOT inappropriately impacted
- Actual issues are identified for administrator attention
- Review process is efficient and fair
- Audit trail supports compliance and learning
- Operator trust in platform is maintained

**Not Success:**  
- High detection rates (may indicate false positives)
- Automated enforcement (explicitly prohibited)
- Zero operator complaints (unrealistic)

### 12.4. Commitment to Fairness

The platform commits to:
- Evaluating signals with appropriate skepticism
- Seeking operator input and context
- Providing clear communication when issues arise
- Maintaining appeal mechanisms
- Continuously evaluating fairness of outcomes

---

**Document End**

**Revision History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-18 | Initial document creation | Trust & Safety Team |

---

**Related Documents:**
- DOC-106: Trust & Safety Framework
- DOC-063: Operator Experience Specification
- DOC-055: Logging Strategy & Log Taxonomy
- DOC-078: Security & Compliance Plan
- DOC-036: Data Retention Policy
- DOC-057: Monitoring & Observability Plan
