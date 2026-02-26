# DOC-099 — Content Moderation & Fraud Protection Policy

**Project:** Self-Storage Aggregator  
**Document Type:** Supporting / Trust & Safety Policy  
**Status:** 🟡 Non-Canonical  
**Version:** 1.0  
**Date:** December 16, 2025  
**Scope:** MVP → v2

---

> **Document Status:** 🟡 Supporting / Trust & Safety Policy  
> **Canonical:** ❌ No  
> **Enforcement Mandatory:** ❌ No  
>
> This document defines moderation and fraud prevention principles.  
> It does NOT define technical enforcement logic or system contracts.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Content Types & Surfaces](#2-content-types--surfaces)
3. [Content Moderation Principles](#3-content-moderation-principles)
4. [Fraud & Abuse Categories](#4-fraud--abuse-categories)
5. [Moderation Approaches](#5-moderation-approaches)
6. [Fraud Detection Principles](#6-fraud-detection-principles)
7. [Enforcement Philosophy](#7-enforcement-philosophy)
8. [Transparency & Fairness](#8-transparency--fairness)
9. [Relationship to Canonical Documents](#9-relationship-to-canonical-documents)
10. [Non-Goals](#10-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document establishes the content moderation and fraud protection principles for the Self-Storage Aggregator platform. It defines:

- What constitutes acceptable content on the platform
- Categories of fraudulent or abusive behavior
- Philosophical approaches to moderation and fraud prevention
- Principles guiding enforcement decisions

This policy serves as:
- **Guidance for trust & safety operations**
- **Context for product and engineering teams** developing moderation features
- **Reference for support teams** handling user reports
- **Foundation for community standards** communicated to users and operators

## 1.2. Scope

**Applies to:**
- Warehouse listings and descriptions
- Box descriptions and inventory
- Media (photos, videos) uploaded by operators
- User reviews and ratings
- Operator profiles and business information
- User-generated content across the platform

**Phases:**
- **MVP v1:** Manual moderation, basic fraud signals
- **v1.1 → v2:** Progressive automation, enhanced detection, appeals process

**Out of Scope:**
- Private messages between users and operators (future feature)
- Payment fraud (addressed separately in payment provider integration)
- Technical API abuse (covered in Security & Compliance Plan)

## 1.3. Policy Nature & Limitations

**This is a POLICY document, not a SPECIFICATION.**

**What this document IS:**
- ✅ Defines principles and categories
- ✅ Describes moderation philosophy
- ✅ Provides conceptual guidance
- ✅ Outlines considerations for trust & safety

**What this document IS NOT:**
- ❌ Technical implementation specification
- ❌ API contract or system design
- ❌ Enforcement automation guarantee
- ❌ SLA or response time commitment
- ❌ Legal advice or compliance interpretation

**Important:** The presence of a moderation principle does not guarantee automated enforcement. Technical capabilities evolve over time. This policy informs implementation priorities but does not mandate specific technical solutions.

---

# 2. Content Types & Surfaces

## 2.1. Warehouse Listings

**Content Elements:**
- Warehouse name and title
- Location address and geographic coordinates
- Description text (overview, features, access information)
- Operating hours and contact information
- Photo gallery (exterior, interior, access points, facilities)
- Video content (optional)
- Amenities and attributes (climate control, security, parking, etc.)

**Visibility:** Public (searchable, indexable)

**Creator:** Operator

**Moderation Surface:** High priority — impacts user trust and safety

## 2.2. Box Descriptions

**Content Elements:**
- Box size designation (S, M, L, XL)
- Dimensions (length, width, height, area)
- Box number or identifier
- Floor location
- Pricing information
- Availability status
- Features specific to individual boxes

**Visibility:** Public (searchable)

**Creator:** Operator

**Moderation Surface:** Medium priority — primarily factual data

## 2.3. Images & Media

**Content Types:**
- Warehouse exterior photos
- Interior facility photos
- Box/unit photos
- Amenity photos (parking, loading areas, security systems)
- Video tours (optional)

**Visibility:** Public

**Creator:** Operator

**Moderation Surface:** High priority — visual content is highly influential

## 2.4. Reviews & Ratings

**Content Elements:**
- Star rating (1-5)
- Review title
- Review text
- Pros and cons lists (optional)
- Review photos (optional)
- Verified purchase indicator
- Operator responses to reviews

**Visibility:** Public

**Creator:** User (review), Operator (response)

**Moderation Surface:** Very high priority — critical for platform trust

## 2.5. Operator Profiles

**Content Elements:**
- Company name
- Business description
- Contact information (phone, email)
- Business registration details (INN, OGRN)
- Operator preferences and settings

**Visibility:** Semi-public (visible to users during booking, not searchable)

**Creator:** Operator

**Moderation Surface:** Medium priority — verified during onboarding

---

# 3. Content Moderation Principles

## 3.1. Allowed Content

Content that is **permitted and encouraged** on the platform:

**Warehouse Listings:**
- Accurate descriptions of storage facilities and their features
- Truthful information about location, access, and pricing
- Professional photography representing actual facilities
- Clear communication of policies, hours, and terms
- Descriptions highlighting legitimate competitive advantages
- Factual information about security measures and amenities

**Reviews:**
- Honest, substantive feedback based on actual experience
- Constructive criticism with specific details
- Positive or negative experiences communicated respectfully
- Photos documenting actual facility conditions
- References to customer service interactions
- Comparisons to other storage options

**Operator Profiles:**
- Verified business information
- Professional contact details
- Accurate company descriptions
- Legitimate business credentials

## 3.2. Restricted Content

Content that is **allowed with conditions or oversight**:

**Promotional Language:**
- Superlative claims ("best in city") are permitted if substantiated
- Marketing language is acceptable when balanced with factual information
- Promotional pricing must be clearly explained with terms

**Competitive References:**
- General comparisons to industry standards are acceptable
- Specific competitor naming should be factual and fair
- Negative competitor references should be avoided

**User-Generated Photos:**
- Review photos should represent actual facility conditions
- Photos may be flagged if quality is extremely poor or misleading
- Photos must not violate privacy of other users

**Conditional Acceptability:**
Content in this category may be reviewed case-by-case. Operators are encouraged to provide factual, balanced information. Extreme promotional language or competitive attacks may be moderated.

## 3.3. Prohibited Content

Content that is **not allowed** under any circumstances:

**False or Fraudulent Information:**
- Fake addresses or non-existent locations
- Fabricated facility features or amenities
- Misrepresentation of pricing or availability
- Stock photos presented as actual facility photos
- Fake reviews or paid testimonials
- Impersonation of other businesses

**Inappropriate or Harmful Content:**
- Hate speech, discrimination, or harassment
- Sexual or suggestive content
- Violence, threats, or illegal activity
- Spam, malware, or phishing attempts
- Personally identifiable information (PII) of individuals without consent
- Doxxing or privacy violations

**Intellectual Property Violations:**
- Copyrighted images used without authorization
- Trademark infringement
- Use of other operators' photos or content

**Platform Manipulation:**
- Review manipulation (incentivized reviews, review rings)
- Rating manipulation schemes
- Fake accounts for review submission
- Coordinated inauthentic behavior

**Dangerous or Illegal Content:**
- Offers to store illegal items or substances
- Storage of dangerous materials in non-compliant facilities
- Content promoting illegal activities
- Weapons storage offers (without proper licensing)

## 3.4. Gray Areas

**Content requiring contextual judgment:**

**Subjective vs. Factual Claims:**
- "Most convenient location" (subjective, acceptable)
- "Only warehouse in district" (factual claim, requires verification)

**Negative Reviews:**
- Critical reviews are allowed if based on actual experience
- Excessively hostile or abusive language may be moderated
- Unfounded accusations of illegal activity may be escalated

**Pricing Disputes:**
- Users claiming hidden fees or price discrepancies
- Operators defending pricing structure
- Context and evidence determine outcome

**Photo Authenticity:**
- Professional staging vs. misleading representation
- Time-of-day or season differences in appearance
- Minor digital enhancement vs. material misrepresentation

**Approach to Gray Areas:**
Gray areas are resolved through:
- Review of context and evidence
- Consideration of user reports and feedback
- Pattern analysis (isolated incident vs. repeated behavior)
- Operator explanation and clarification
- Community standards evolution over time

---

# 4. Fraud & Abuse Categories

## 4.1. Fake Listings

**Description:**
Listings representing non-existent warehouses or warehouses not controlled by the operator.

**Indicators:**
- Address does not correspond to actual storage facility
- Photos from other locations or stock imagery
- No verifiable business registration
- Unable to provide proof of facility ownership or management
- Google Maps satellite view shows different building type
- No operator response to verification requests

**Platform Impact:** Critical — undermines entire platform trust

**Detection Approach:** Verification during operator onboarding, address validation, map services integration, user reports

## 4.2. Misleading Pricing

**Description:**
Pricing information that does not match actual charges or contains hidden fees not disclosed upfront.

**Indicators:**
- Advertised price significantly lower than final booking price
- Undisclosed mandatory fees (admin fees, insurance, deposits)
- Bait-and-switch tactics (advertised boxes "unavailable," higher-priced alternatives offered)
- Inconsistent pricing between listing and booking confirmation
- Contractual terms contradicting listing information

**Platform Impact:** High — damages user trust and creates disputes

**Detection Approach:** User complaints, booking-to-payment comparison, pattern analysis, operator history review

## 4.3. Review Manipulation

**Description:**
Artificial inflation or suppression of reviews through inauthentic means.

**Indicators:**
- Rapid influx of positive reviews from new accounts
- Multiple reviews from same IP address or device
- Coordinated review timing patterns
- Reviews for bookings that never completed
- Incentivized reviews (discounts for positive reviews)
- Operators creating fake user accounts
- Competitive sabotage (fake negative reviews from competitors)

**Platform Impact:** Very High — reviews are core trust mechanism

**Detection Approach:** Booking verification, account behavior analysis, temporal patterns, IP/device analysis, user verification status

## 4.4. Identity Abuse

**Description:**
Misrepresentation of identity or business credentials.

**Indicators:**
- False business registration information
- Impersonation of legitimate storage operators
- Use of another business's name or branding
- Multiple accounts under different identities for same operator
- Stolen or fabricated business documents

**Platform Impact:** Critical — violates legal compliance and trust

**Detection Approach:** Document verification during onboarding, cross-reference with public business registries, user reports

## 4.5. Booking & Availability Manipulation

**Description:**
Fraudulent manipulation of availability or booking status.

**Indicators:**
- Consistently claiming sold-out status for low-priced boxes
- Creating bookings that are immediately cancelled to boost metrics
- Artificially inflating booking numbers
- Accepting bookings for non-existent box inventory
- Rejecting legitimate bookings without valid reason

**Platform Impact:** Medium to High — disrupts user experience and marketplace fairness

**Detection Approach:** Booking approval patterns, inventory reconciliation, user complaints, operator behavior over time

## 4.6. Content Scraping & Data Harvesting

**Description:**
Systematic extraction of platform data for competitive intelligence or resale.

**Indicators:**
- High-volume automated requests from single source
- Regular, pattern-based access to multiple listings
- Rapid sequential access across warehouse catalog
- Scraping of pricing data or operator contact information

**Platform Impact:** Medium — business risk but does not directly harm users

**Detection Approach:** Rate limiting (see API Rate Limiting Specification), behavioral analysis, honeypot techniques

## 4.7. Account Takeover & Credential Abuse

**Description:**
Unauthorized access to user or operator accounts.

**Indicators:**
- Login from unusual locations or devices
- Rapid changes to account settings after login
- Suspicious booking or modification activity
- Password reset requests from unknown sources
- Multiple failed login attempts

**Platform Impact:** Critical — compromises user data and platform integrity

**Detection Approach:** Authentication security measures (see Security & Compliance Plan), anomaly detection, user notifications

---

# 5. Moderation Approaches

## 5.1. Manual Moderation

**Description:**
Human review of content, reports, and suspicious activity.

**Scope in MVP:**
- New operator onboarding and verification
- User reports of problematic content
- Flagged reviews or listings
- High-risk account activity
- Appeals and dispute resolution

**Strengths:**
- Context-aware judgment
- Nuanced understanding of intent
- Adaptable to novel situations
- Lower false positive rate for complex cases

**Limitations:**
- Does not scale indefinitely
- Response time varies based on volume
- Requires training and consistency

**MVP v1 Reality:**
Manual moderation is the **primary** enforcement mechanism in MVP. Automation supports triage and flagging but does not replace human judgment.

## 5.2. Automated Signals (Conceptual)

**Description:**
System-generated indicators that content or behavior may require review.

**Signal Types (Conceptual):**

**Pattern Detection:**
- Repetitive text patterns (copy-paste reviews)
- Unusual timing of activity (bulk account creation, coordinated reviews)
- Statistical anomalies (sudden rating changes, booking spikes)

**Content Analysis:**
- Keyword matching for prohibited content categories
- Image similarity detection (stock photos, duplicate images)
- Sentiment analysis for extreme negativity/positivity

**Behavioral Signals:**
- Rapid account switching
- Geolocation mismatches
- Device fingerprinting anomalies

**Risk Scoring (Conceptual):**
Signals may contribute to risk scores that prioritize manual review. High-risk scores do NOT result in automatic blocking but trigger human review.

**Reference:** See DOC-105 (AI Risk Scoring & Fraud Detection) for technical details (when implemented).

**MVP v1 Reality:**
Automated signals are **limited** in MVP. Initial implementation focuses on:
- Rate limiting (see API Rate Limiting Specification)
- Basic pattern detection (e.g., multiple accounts from same IP)
- Manual flagging by support team

Advanced ML-based detection is **post-MVP**.

## 5.3. Hybrid Review (Manual + Automated)

**Description:**
Combination of automated triage and human decision-making.

**Workflow (Conceptual):**
1. Automated systems flag suspicious content or behavior
2. Flags are prioritized by risk score or severity
3. Human moderators review flagged items
4. Moderators make final enforcement decisions
5. Feedback loop improves automated detection

**Advantages:**
- Scalability through automation
- Accuracy through human judgment
- Continuous improvement

**MVP Approach:**
Hybrid review is the **target state** for v1.1+. MVP v1 begins with predominantly manual review with basic automation assist (rate limiting, simple flags).

## 5.4. User Reporting & Community Input

**Description:**
Mechanisms for users and operators to report problematic content.

**Report Categories:**
- Inaccurate or misleading information
- Inappropriate content
- Suspected fraud or fake listing
- Review manipulation
- Privacy violations
- Other concerns

**Report Handling:**
- Reports are logged and prioritized
- High-severity reports trigger immediate review
- Reporters may receive status updates (optional)
- Patterns of reports against single entity increase scrutiny

**Reporter Protection:**
Reports are treated confidentially. Reporter identity is not disclosed to reported party.

**MVP v1:**
User reporting is **enabled** via support channels (email, contact form). Dedicated in-app reporting feature is planned for v1.1+.

## 5.5. Escalation Paths

**Levels of Escalation:**

**Level 1: Automated Signal**
- System detects potential issue
- Content flagged for review
- No user-facing action

**Level 2: Initial Review**
- Support or trust & safety team reviews
- Minor violations: warning or content removal request
- Major violations: proceed to Level 3

**Level 3: Enforcement Action**
- Confirmed violation
- Content removal or account restriction
- User/operator notification
- Decision documented

**Level 4: Appeal & Resolution**
- Affected party may appeal
- Senior review or management escalation
- Final decision communicated
- Policy clarification if needed

**Escalation Triggers:**
- Severity of violation
- Repeat violations by same entity
- User impact scale (number of affected users)
- Legal or regulatory implications

---

# 6. Fraud Detection Principles

## 6.1. Rule-Based Signals

**Description:**
Detection based on explicit rules and thresholds.

**Examples (Conceptual):**
- Account creation rate exceeds X per IP per hour
- Operator submits Y listings with same photo
- Review rating changes from Z to W after operator response pattern
- Price discrepancy exceeds P% between listing and booking

**Strengths:**
- Transparent and explainable
- Predictable enforcement
- Easy to implement

**Limitations:**
- Brittle against adversarial adaptation
- False positives when legitimate behavior mimics rules
- Requires manual threshold tuning

**Use in MVP:**
Rule-based detection is **primary** fraud detection method in MVP v1. Rules are defined based on observed patterns and industry best practices.

## 6.2. Anomaly Detection (Conceptual)

**Description:**
Identification of statistical outliers or unusual patterns.

**Anomaly Types (Conceptual):**

**Time-Based Anomalies:**
- Unusual activity times (bulk operations at 3 AM)
- Sudden spikes in activity
- Temporal correlation across accounts

**Geospatial Anomalies:**
- Login from conflicting locations within short timeframe
- Warehouse location inconsistent with operator location
- Unusual geographic distribution of reviews

**Behavioral Anomalies:**
- Deviation from typical user or operator behavior
- Inconsistent interaction patterns
- Unusual feature usage

**Post-MVP:**
Anomaly detection using machine learning is **planned** for v1.1+. MVP v1 relies on simple statistical thresholds and pattern matching.

## 6.3. Operator Risk Patterns

**Risk Indicators (Conceptual):**

**Historical Behavior:**
- Prior account suspensions or warnings
- Pattern of user complaints
- High booking cancellation rate
- Frequent pricing or availability changes

**Content Quality:**
- Stock photos across multiple listings
- Minimal or generic descriptions
- Lack of verified business information
- Inconsistent facility information

**Engagement Patterns:**
- Low operator response rate to inquiries
- Delayed booking approvals
- High dispute rate with customers
- Negative review patterns

**Risk Scoring Philosophy:**
Risk scores **inform** moderation priorities but **do not** automatically block operators. High-risk operators receive increased scrutiny and faster review of reported issues.

## 6.4. User Behavior Signals

**Trustworthiness Indicators:**

**Positive Signals:**
- Email verified
- Phone verified
- Completed bookings with reviews
- Consistent account activity over time
- No complaints or disputes

**Negative Signals:**
- Unverified contact information
- New account with immediate high-value activity
- Multiple accounts from same device/IP
- Rapid, repetitive actions
- Review bombing behavior

**Use of Signals:**
Signals contribute to verification and fraud detection but do not automatically restrict legitimate users. New users are not penalized for being new but may face additional verification steps for high-risk actions (large bookings, immediate reviews).

---

# 7. Enforcement Philosophy (Conceptual)

## 7.1. Progressive Enforcement

**Principle:**
Enforcement actions escalate based on severity and recurrence.

**Enforcement Ladder (Conceptual):**

**Step 1: Education & Warning**
- First-time or minor violation
- User/operator informed of policy violation
- Content may be flagged or requested for modification
- No account penalty

**Step 2: Content Removal or Restriction**
- Repeated or moderate violations
- Content removed or listing downranked
- Operator may lose certain features temporarily
- Warning remains on account

**Step 3: Temporary Limitation**
- Serious or repeated violations
- Account features restricted (cannot create new listings, reviews blocked)
- Time-limited suspension (days to weeks)
- Review required for reinstatement

**Step 4: Account Suspension**
- Severe violations or pattern of repeated violations
- Account temporarily suspended
- Access revoked pending investigation
- Reinstatement possible if violation addressed

**Step 5: Permanent Ban**
- Extreme violations (fraud, illegal activity, severe abuse)
- Account permanently banned
- No reinstatement
- May involve legal action or reporting to authorities

**Exceptions:**
Severe violations (fraud, illegal content, safety threats) may skip progressive steps and proceed directly to suspension or ban.

## 7.2. Context & Intent Consideration

**Philosophy:**
Enforcement considers context, intent, and mitigating factors.

**Factors Evaluated:**
- Was violation intentional or accidental?
- Is there evidence of good faith?
- Has operator/user corrected the issue?
- Is there pattern of behavior or isolated incident?
- What is the impact on other users?

**Benefit of Doubt:**
When intent is unclear and harm is minimal, benefit of doubt is extended with educational warning. Repeated violations eliminate benefit of doubt.

## 7.3. Transparency in Enforcement

**Principles:**

**Notification:**
Users and operators are notified when enforcement action is taken (except when notification would compromise investigation).

**Explanation:**
Enforcement notifications include:
- What policy was violated
- What content or behavior triggered action
- What action was taken
- Next steps or appeal process (if applicable)

**Limitations on Transparency:**
Detailed detection mechanisms are not disclosed to prevent gaming the system. General policy reasoning is provided without revealing specific signals or thresholds.

## 7.4. Appeal Process (Conceptual)

**Principles:**

**Right to Appeal:**
Users and operators may appeal enforcement decisions they believe are incorrect.

**Appeal Channels:**
- Support email with "Appeal" in subject line
- Dedicated appeal form (post-MVP)
- Include case reference number and explanation

**Appeal Review:**
- Appeals reviewed by different team member than original decision
- Evidence and context re-evaluated
- Decisions documented

**Outcomes:**
- **Overturn:** Decision reversed, account/content restored
- **Uphold:** Decision stands, explanation provided
- **Modify:** Partial relief granted (e.g., reduced suspension)

**Appeal Limits:**
Repeated appeals for same issue may not be reviewed. Finality is necessary for operational efficiency.

**MVP v1 Reality:**
Appeal process is **manual** and handled via support channels. Formal appeal workflow with tracking is post-MVP feature.

---

# 8. Transparency & Fairness

## 8.1. Explainability Principles

**Goal:**
Moderation decisions should be as transparent as possible without compromising platform security.

**User-Facing Transparency:**
- Community standards and policies are publicly documented
- Enforcement actions include policy citations
- General moderation statistics are shared periodically (future)

**Operator-Facing Transparency:**
- Operators understand what content is acceptable
- Operators receive feedback on rejected listings or flagged content
- Operators have pathway to clarification and correction

**Limits to Transparency:**
- Specific detection algorithms are not disclosed
- Individual case details are confidential
- Anti-fraud mechanisms operate partially opaquely to prevent gaming

## 8.2. Bias Avoidance

**Commitment:**
Moderation decisions are made without bias based on:
- User or operator size (small vs. large operators)
- Geographic location
- Language or cultural background
- Political or religious affiliation

**Bias Mitigation Strategies:**
- Training for moderation team on impartiality
- Regular review of enforcement patterns for disparate impact
- Feedback mechanisms for reporting perceived bias
- Diverse moderation team when scale permits

**Algorithmic Fairness (Post-MVP):**
When ML models are deployed, fairness evaluation includes:
- Testing for disparate impact across protected groups
- Monitoring false positive/negative rates by segment
- Regular model auditing

## 8.3. False Positives Handling

**Philosophy:**
False positives (legitimate content flagged incorrectly) are inevitable but must be minimized and corrected quickly.

**Reduction Strategies:**
- Conservative thresholds for automated enforcement
- Human review before severe actions
- Multiple signals required for enforcement
- Regular calibration of detection systems

**Correction Mechanisms:**
- Appeal process for overturning false positives
- Rapid reinstatement when error confirmed
- Operator/user notified of correction
- System learns from false positives (post-MVP)

**User Experience Priority:**
When in doubt, platform errs on side of allowing content rather than blocking legitimate activity. Manual review is preferred over aggressive automation in ambiguous cases.

---

# 9. Relationship to Canonical Documents

This policy document **does not define technical implementation** but provides policy context for implementation choices. Below are explicit relationships to canonical and supporting documents:

## 9.1. Security & Compliance Plan (DOC-078)

**Relationship:**
- Security Plan defines **technical security controls**
- This policy defines **trust & safety principles**

**Overlap Areas:**
- **Account takeover prevention:** Security Plan (authentication), this policy (detection and response philosophy)
- **Data scraping:** Security Plan (rate limiting), this policy (content abuse category)
- **Audit logging:** Security Plan (logging infrastructure), this policy (enforcement documentation)

**Reference Sections:**
- DOC-078 §4.3: Brute-force mitigation
- DOC-078 §4.4: Bot detection
- DOC-078 §6.1: Audit requirements

## 9.2. Security Architecture (DOC-079)

**Relationship:**
- Security Architecture defines **system security layers**
- This policy defines **content and behavioral abuse categories**

**Integration:**
Content moderation operates within security architecture constraints:
- Trust boundaries define where moderation checks occur
- Defense in depth applies to fraud detection (multiple signals)
- Zero-trust principles apply to content verification (always validate)

**Reference Sections:**
- DOC-079 §2: Security principles (defense in depth, zero trust)
- DOC-079 §3: Trust boundaries

## 9.3. API Rate Limiting (DOC-017)

**Relationship:**
- Rate Limiting Specification defines **technical throttling and limits**
- This policy defines **why** rate limiting is necessary for abuse prevention

**Overlap:**
- Scraping prevention: Rate limiting (technical), this policy (abuse category)
- Bot mitigation: Rate limiting (throttle), this policy (fraud category)

**Reference Sections:**
- DOC-017 §10: Security considerations and protected endpoints

## 9.4. AI Risk Scoring & Fraud Detection (DOC-105) (When Available)

**Relationship:**
- DOC-105 will define **technical implementation** of risk scoring
- This policy defines **conceptual fraud categories** that inform risk scoring

**Future Integration:**
Risk scoring system will operationalize concepts from this policy:
- Fraud categories → Risk factors
- Risk indicators → Scoring inputs
- Enforcement philosophy → Scoring thresholds and actions

**Note:** DOC-105 is referenced as future document. This policy provides foundational concepts for that technical specification.

## 9.5. Legal Documentation (DOC-054, DOC-072)

**Relationship:**
- Legal documents define **user and operator rights**
- This policy defines **platform community standards**

**Consistency:**
- Terms of Service reference community standards defined here
- Privacy Policy addresses moderation-related data processing
- This policy implements Terms of Service provisions

**Reference Sections:**
- DOC-054: Terms of Service (content standards, prohibited conduct)
- DOC-072: Privacy Policy (data processing for trust & safety)

## 9.6. Functional Specification (DOC-001)

**Relationship:**
- Functional Specification defines **product features**
- This policy defines **acceptable use** of those features

**Covered Areas:**
- Reviews feature → Review manipulation prevention (§4.3)
- Warehouse listings → Listing accuracy principles (§3.1, §4.1)
- Operator onboarding → Identity verification (§4.4)

**Reference Sections:**
- DOC-001 Part 6: Reviews & ratings
- DOC-001 Part 8: Operator capabilities

---

# 10. Non-Goals

This document **explicitly does not** define or specify:

## 10.1. Technical Implementation

**Not Included:**
- API endpoints for moderation actions
- Database schemas for fraud detection
- Code implementations of detection algorithms
- System architecture for moderation workflows
- Service contracts or interfaces

**Reason:** Technical implementation is defined in canonical specifications (Backend Implementation Plan, API Blueprint, etc.). This policy informs implementation but does not prescribe it.

## 10.2. Enforcement SLAs

**Not Included:**
- Response time commitments for user reports
- Guaranteed review timeframes for flagged content
- Uptime requirements for moderation systems
- Performance metrics or KPIs

**Reason:** Operational capacity evolves over time. Commitments require operational planning beyond policy scope.

## 10.3. ML Model Specifications

**Not Included:**
- Model architectures or algorithms
- Training data specifications
- Precision/recall targets
- Feature engineering details
- Model deployment procedures

**Reason:** ML implementation is highly iterative and technical. This policy provides conceptual guidance; ML specifications are separate technical documents.

## 10.4. Legal Compliance Interpretation

**Not Included:**
- Legal analysis of content regulations
- DMCA takedown procedures
- Cross-jurisdiction content compliance
- Liability assessments
- Regulatory reporting requirements

**Reason:** Legal interpretation requires legal expertise. This policy aligns with legal requirements but does not interpret them.

## 10.5. Payment Fraud Prevention

**Not Included:**
- Payment card fraud detection
- Chargeback management
- PCI-DSS compliance for fraud
- Payment provider integration details

**Reason:** Payment fraud is addressed in payment integration specifications and payment provider capabilities.

## 10.6. Content Localization & Translation

**Not Included:**
- Multi-language content moderation
- Cultural context adaptation
- Translation accuracy verification

**Reason:** MVP v1 focuses on Russian-language content. Localization is post-MVP concern.

## 10.7. Automated Takedown Guarantees

**Not Included:**
- Guaranteed automated removal of prohibited content
- Real-time filtering of inappropriate content
- Pre-publication screening with guarantees

**Reason:** Moderation capabilities evolve. This policy describes aspirational approaches but does not guarantee automation timelines.

---

# Appendix A: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Technical Documentation Team | Initial policy definition (MVP → v2 scope) |

---

# Appendix B: Related Documents

**Canonical Documents (Implementation Authority):**
- DOC-001: Functional Specification MVP v1
- DOC-078: Security & Compliance Plan MVP v1
- DOC-079: Security Architecture MVP v1
- DOC-017: API Rate Limiting & Throttling Specification MVP v1

**Legal Documents:**
- DOC-054: Legal Checklist & Compliance Requirements
- DOC-072: Legal Documentation Unified Guide

**Future Technical Documents:**
- DOC-105: AI Risk Scoring & Fraud Detection (Planned)
- DOC-093: Trust & Safety Operations Runbook (Planned)

**Supporting Documents:**
- DOC-099: This document (Content Moderation & Fraud Protection Policy)

---

**End of Document**
