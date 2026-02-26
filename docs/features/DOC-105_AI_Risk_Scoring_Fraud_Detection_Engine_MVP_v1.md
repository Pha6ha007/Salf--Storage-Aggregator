# AI Risk Scoring & Fraud Detection Engine

**Document ID:** DOC-105  
**Version:** 1.0  
**Status:** 🟡 Supporting / AI Risk & Fraud Detection Specification  
**Canonical:** ❌ No  
**Execution Mandatory:** ❌ No  
**Project:** Self-Storage Aggregator  
**Maintained by:** Trust & Safety / AI Team  
**Last Updated:** December 16, 2025

---

> **Document Status:** 🟡 Supporting / AI Risk & Fraud Detection Specification  
> **Canonical:** ❌ No  
> **Execution Mandatory:** ❌ No  
>
> This document describes conceptual approaches to risk scoring and fraud detection and **does NOT define mandatory enforcement logic**. All thresholds, algorithms, and enforcement decisions are subject to operational determination and human oversight.

---

## Document Control

| Attribute | Value |
|-----------|-------|
| Document Type | Conceptual Framework |
| Scope | MVP → v2 |
| Audience | Trust & Safety, AI Team, Data Science, Product, Security, Compliance |
| Execution Status | Reference Only — Not Implementation Specification |
| Review Cycle | Quarterly or as needed |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Role of Risk Scoring](#2-role-of-risk-scoring)
3. [Risk Subjects](#3-risk-subjects)
4. [Fraud & Risk Signal Categories](#4-fraud--risk-signal-categories)
5. [Scoring Concepts](#5-scoring-concepts)
6. [AI vs Rule-Based Signals](#6-ai-vs-rule-based-signals)
7. [Integration with Operations](#7-integration-with-operations)
8. [Explainability & Fairness](#8-explainability--fairness)
9. [Experimentation & Evolution](#9-experimentation--evolution)
10. [Failure Modes & Risks](#10-failure-modes--risks)
11. [Relationship to Canonical Documents](#11-relationship-to-canonical-documents)
12. [Non-Goals](#12-non-goals)

---

## 1. Introduction

### 1.1. Purpose

This document establishes a conceptual framework for understanding risk and detecting fraud on the Self-Storage Aggregator platform. It describes approaches to:

- Identifying and scoring risk signals across platform entities
- Understanding behavioral and transactional patterns that may indicate fraud
- Supporting moderation and support workflows with risk intelligence
- Building trust through transparency and fairness

**This document answers the question:** *"How do we understand risk?"*  
**This document does NOT answer:** *"How do we automatically penalize?"*

### 1.2. Scope

**MVP Phase:**
- Conceptual risk signal identification
- Manual review augmentation
- Foundation for future automation

**v1.1 → v2:**
- Enhanced signal aggregation
- Expanded AI-assisted detection
- Refined confidence modeling

### 1.3. Relationship to Trust & Safety

Risk scoring and fraud detection are components of the broader Trust & Safety ecosystem. They provide intelligence to support human decision-making but do not replace human judgment or policy enforcement.

The platform's trust approach balances:
- Protecting legitimate users and operators from fraudulent actors
- Minimizing friction for good-faith participants
- Maintaining transparency about platform decision-making
- Ensuring fairness and avoiding systemic bias

Risk intelligence informs — but does not dictate — trust and safety outcomes.

---

## 2. Role of Risk Scoring

### 2.1. Decision Support, Not Decision Making

Risk scores serve as **decision support signals** for human reviewers and operational teams. They provide context and prioritization guidance but do not trigger automatic enforcement actions.

**What risk scores enable:**
- Prioritizing review queues by potential impact
- Surfacing patterns that warrant human attention
- Providing context for support and moderation decisions
- Identifying trends for policy refinement

**What risk scores do NOT enable:**
- Automatic account suspension or termination
- Automatic content removal without review
- Automatic transaction blocking
- Automatic service degradation

### 2.2. Prioritization & Escalation

Risk scoring helps operational teams focus limited attention on highest-impact situations. Higher-risk signals surface entities for earlier or more thorough review.

**Prioritization principles:**
- Higher-risk signals receive faster human review
- Lower-risk signals may receive lighter-touch review
- Borderline cases receive additional scrutiny before action
- No signals bypass human oversight for consequential actions

### 2.3. Separation from Enforcement

Enforcement decisions are policy decisions, not technical decisions. Risk scoring provides inputs to policy enforcement but does not define enforcement outcomes.

**Separation ensures:**
- Policy owners control enforcement thresholds
- Risk models can evolve without changing policy
- Enforcement decisions remain auditable and explainable
- Human accountability for consequential actions is preserved

---

## 3. Risk Subjects

Risk signals are generated for different entity types across the platform. Each entity type has distinct risk characteristics and signal patterns.

### 3.1. Users (Renters)

Platform users who search for and book storage spaces.

**Risk considerations:**
- Account authenticity and identity signals
- Booking behavior patterns
- Payment reliability indicators (conceptual, future)
- Interaction patterns with operators
- Review and rating behavior

**Legitimate variations to account for:**
- New users with limited history
- Users with seasonal or irregular storage needs
- Users migrating from other platforms
- Users with multiple legitimate storage requirements

### 3.2. Operators

Business partners who list and manage storage facilities.

**Risk considerations:**
- Business verification signals
- Listing quality and accuracy patterns
- Response and fulfillment behavior
- Customer feedback patterns
- Pricing behavior relative to market

**Legitimate variations to account for:**
- New operators building reputation
- Operators with specialized or niche offerings
- Operators in markets with limited comparable data
- Seasonal business pattern variations

### 3.3. Listings (Warehouses)

Storage facilities listed on the platform.

**Risk considerations:**
- Content accuracy and consistency
- Media authenticity signals
- Availability accuracy
- Pricing reasonableness
- Description-to-reality alignment

**Legitimate variations to account for:**
- Unique or specialized storage facilities
- Facilities in non-standard locations
- Premium or budget offerings outside typical range
- Facilities with unusual feature combinations

### 3.4. Bookings

Individual storage reservations.

**Risk considerations:**
- Timing and frequency patterns
- Duration and size selection patterns
- Contact information consistency
- Modification and cancellation patterns
- Source and referral signals

**Legitimate variations to account for:**
- Urgent storage needs with short lead time
- Long-term corporate storage arrangements
- Seasonal demand patterns
- Multi-location business needs

### 3.5. Payments (Conceptual — Future)

Financial transactions associated with bookings.

**Risk considerations (conceptual):**
- Payment method signals
- Transaction timing patterns
- Refund and dispute patterns
- Value patterns relative to listing

**Note:** Payment integration is not in MVP scope. These signals are documented for future reference only.

---

## 4. Fraud & Risk Signal Categories

Signals are grouped into categories based on their source and nature. No single signal is deterministic; signals are considered in combination and context.

### 4.1. Behavioral Signals

Patterns derived from entity actions and interactions over time.

**Abnormal Booking Patterns:**
- Unusual booking frequency relative to entity history
- Clustering of bookings with specific characteristics
- Systematic exploration of platform boundaries

**Velocity Anomalies:**
- Rapid creation of multiple entities
- Sudden changes in activity volume
- Bursts of activity outside typical patterns

**Device & IP Patterns (Conceptual):**
- Device fingerprint inconsistencies
- Geographic anomalies in access patterns
- Session characteristics outside typical range

**Interpretation considerations:**
- Legitimate users may exhibit anomalous patterns under certain circumstances
- Patterns should be evaluated in context, not in isolation
- Velocity signals are indicators for review, not proof of fraud

### 4.2. Content & Listing Signals

Patterns derived from content quality and authenticity analysis.

**Suspicious Descriptions:**
- Language patterns associated with known fraudulent content
- Inconsistencies between description and other listing attributes
- Templated or generic content patterns

**Duplicated Content:**
- Exact or near-duplicate descriptions across listings
- Shared media across unrelated listings
- Content reuse patterns

**Misleading Attributes:**
- Feature claims inconsistent with listing type or location
- Pricing anomalies relative to stated features
- Availability patterns inconsistent with stated capacity

**Reference:** Content quality and moderation policy details are defined in platform content moderation policy documentation.

### 4.3. Transactional Signals

Patterns derived from booking and interaction records.

**Booking/Payment Inconsistencies:**
- Contact information variations across bookings
- Booking patterns inconsistent with stated purpose
- Modification patterns suggesting testing behavior

**Refund Abuse (Conceptual):**
- Elevated refund rates relative to baseline
- Refund timing patterns
- Refund justification patterns

**Dispute Correlations:**
- Dispute rates by entity
- Dispute outcome patterns
- Dispute timing relative to booking lifecycle

**Reference:** Booking flow and transaction handling are defined in the Booking Flow Technical Specification.

### 4.4. Network & Relational Signals

Patterns derived from relationships between entities.

**Shared Identifiers:**
- Common contact information across entities
- Shared session or device signals
- Correlated registration timing

**Linked Accounts:**
- Explicit or implicit account relationships
- Cross-account behavioral correlations
- Coordinated activity patterns

**Operator-User Overlaps:**
- Self-dealing indicators
- Review manipulation signals
- Artificial transaction patterns

**Interpretation considerations:**
- Shared identifiers may have legitimate explanations (families, businesses)
- Correlation is not causation
- Network signals require contextual evaluation

---

## 5. Scoring Concepts

This section describes conceptual approaches to aggregating signals into risk assessments. No specific algorithms, formulas, or threshold values are defined.

### 5.1. Aggregation Approaches

Risk assessment considers multiple signals in combination rather than relying on any single indicator.

**Aggregation principles:**
- Multiple weak signals may combine to warrant attention
- Strong signals in one category may be offset by positive signals in others
- Context affects signal interpretation
- Aggregation methods may vary by entity type and use case

**What aggregation does NOT mean:**
- Mechanical summation of signal values
- Fixed weighting across all contexts
- Deterministic outcomes from signal combinations

### 5.2. Confidence & Uncertainty

Risk assessments include acknowledgment of uncertainty. Not all signals are equally reliable or informative.

**Confidence considerations:**
- Signal freshness and relevance
- Signal source reliability
- Signal interpretation ambiguity
- Entity history and context availability

**Uncertainty handling:**
- Lower-confidence assessments receive more human scrutiny
- Borderline cases default to less restrictive treatment
- Uncertainty is communicated, not hidden

### 5.3. Decay & Recency

Risk signals decay over time. Past behavior is less predictive than recent behavior.

**Decay principles:**
- Recent signals weight more heavily than historical signals
- Positive behavior over time reduces risk assessment
- Old signals eventually become uninformative
- Decay rates may vary by signal type and severity

### 5.4. Cold-Start Handling

New entities lack behavioral history, creating assessment challenges.

**Cold-start approaches:**
- Conservative default treatment (neither high-trust nor low-trust)
- Accelerated signal gathering during early activity
- Graduated trust building through positive behavior
- External verification where available and appropriate

**Cold-start does NOT mean:**
- Treating new entities as high-risk by default
- Blocking or restricting new entities without cause
- Requiring extensive verification before any platform use

---

## 6. AI vs Rule-Based Signals

The platform uses a combination of rule-based and AI-assisted approaches to signal generation. Each approach has strengths and appropriate applications.

### 6.1. Where Rules Apply

Rule-based signals are appropriate when:
- The signal definition is clear and unambiguous
- The signal is based on objective, measurable criteria
- Consistency across cases is more important than nuance
- The signal is well-understood and stable

**Example rule-based signal types:**
- Velocity thresholds (actions per time period)
- Explicit content pattern matching
- Structural data validation
- Known-bad identifier matching

### 6.2. Where AI Helps

AI-assisted signals are appropriate when:
- Pattern recognition across complex data is required
- Signals involve natural language or unstructured content
- Novel patterns may emerge that rules cannot anticipate
- Context-dependent interpretation improves accuracy

**Example AI-assisted signal types:**
- Content quality and authenticity assessment
- Behavioral anomaly detection
- Semantic similarity analysis
- Multi-factor pattern recognition

**Reference:** AI system design principles and constraints are defined in DOC-AI Core Design (AI_Core_Design_MVP_v1_CANONICAL.md).

### 6.3. Hybrid Model

The platform combines rule-based and AI-assisted signals within a unified assessment framework.

**Hybrid principles:**
- Rules provide baseline detection with known reliability
- AI extends detection to patterns rules cannot capture
- Both signal types feed the same assessment process
- Neither type triggers automatic enforcement

### 6.4. Fallback Logic

When AI signals are unavailable (due to service issues, cold-start, or limitations), the system falls back to rule-based signals and human review.

**Fallback ensures:**
- Platform continues functioning without AI availability
- Risk assessment does not fail silently
- Human review remains available for all cases
- Degraded capability is preferable to no capability

**Reference:** Graceful degradation principles are defined in AI Core Design documentation.

---

## 7. Integration with Operations

Risk scoring integrates with platform operations to support human decision-making.

### 7.1. Moderation Workflows

Risk signals inform content moderation queues and priorities.

**Integration approach:**
- Higher-risk content surfaces for earlier review
- Risk context is available to moderators during review
- Moderator decisions inform signal refinement over time
- Moderation outcomes are tracked for quality assessment

**Reference:** Moderation workflows and authority are defined in platform content moderation policy and Internal Admin API Specification (DOC-101).

### 7.2. Support Escalation

Risk context is available to support teams handling user and operator inquiries.

**Integration approach:**
- Support agents see relevant risk context for cases
- Elevated risk may trigger specialist routing
- Risk signals inform investigation depth
- Support outcomes contribute to risk model feedback

### 7.3. Audit Trails

All risk assessments and their use in operational decisions are logged for audit purposes.

**Audit trail includes:**
- Risk signals generated and their sources
- Risk assessment provided to operational systems
- Human decisions made with risk context
- Timing and responsible parties

**Reference:** Audit logging requirements are defined in Security & Compliance Plan (DOC-078) and Logging Strategy documentation.

---

## 8. Explainability & Fairness

Risk scoring systems must be explainable and fair. These are not just technical requirements but ethical obligations.

### 8.1. Human-in-the-Loop

Consequential decisions affecting users or operators require human review and approval. Risk scores inform but do not replace human judgment.

**Human-in-the-loop requirements:**
- Account restrictions require human approval
- Content removal requires human review (except for clearly illegal content)
- Payment holds require human authorization (future)
- Appeals are always available

### 8.2. Explainable Signals

When users or operators are affected by risk-related decisions, the platform provides meaningful explanation.

**Explainability principles:**
- Affected parties understand why action was taken
- Explanations are in plain language, not technical jargon
- Explanations identify what can be done to address concerns
- Explanations do not reveal gaming opportunities

**What explainability does NOT mean:**
- Disclosing specific algorithms or thresholds
- Revealing all signals used in assessment
- Providing detailed technical documentation to affected parties

### 8.3. Bias Awareness

Risk scoring systems can inadvertently encode or amplify bias. The platform actively works to identify and mitigate bias.

**Bias awareness practices:**
- Regular review of signal distribution across entity segments
- Monitoring for disparate impact on protected characteristics
- Challenge testing of signal assumptions
- Feedback incorporation from affected parties

**Bias mitigation does NOT mean:**
- Ignoring legitimate risk signals
- Equal treatment regardless of behavior
- Quotas or targets for any entity category

### 8.4. False Positives Handling

Risk systems generate false positives. The platform has processes to identify and correct false positives efficiently.

**False positive handling:**
- Appeals process for affected parties
- Expedited review for credible false positive claims
- Model feedback when false positives are confirmed
- Affected party notification and remedy when appropriate

---

## 9. Experimentation & Evolution

Risk scoring approaches evolve over time as the platform learns and as fraud patterns change.

### 9.1. A/B Testing

New signals and scoring approaches are tested before broad deployment.

**A/B testing principles:**
- New approaches are tested against established baselines
- Tests measure both detection effectiveness and false positive rates
- Tests are designed to minimize harm to test subjects
- Tests run long enough to achieve statistical confidence

**Reference:** Experimentation framework and governance are defined in platform engineering process guidelines and release management strategy.

### 9.2. Offline Evaluation

Before live deployment, signals are evaluated using historical data.

**Offline evaluation approach:**
- Backtesting on known fraud cases
- False positive analysis on known good entities
- Edge case review
- Bias assessment on historical segments

### 9.3. Gradual Rollout

New signals and scoring changes are deployed gradually with monitoring.

**Gradual rollout approach:**
- Small initial exposure with intensive monitoring
- Expansion based on observed performance
- Rollback capability maintained
- Stakeholder communication throughout

### 9.4. Rollback Philosophy

If new approaches cause harm, the platform rolls back quickly.

**Rollback principles:**
- Rollback is always preferable to continued harm
- Rollback decisions are made by authorized parties
- Rollback does not require full understanding of cause
- Post-rollback analysis informs future attempts

---

## 10. Failure Modes & Risks

Risk scoring systems can fail in various ways. This section acknowledges potential failure modes.

### 10.1. Bias Amplification

Risk models may amplify existing biases in training data or signal definitions.

**Mitigation approaches:**
- Regular bias audits
- Diverse signal sources
- Human oversight for consequential decisions
- Feedback channels for affected parties

### 10.2. Gaming

Sophisticated actors may learn to evade risk signals.

**Mitigation approaches:**
- Multiple signal sources and types
- Behavioral signals that are harder to fake
- Continuous signal evolution
- Not disclosing specific detection criteria

### 10.3. Data Sparsity

Limited data makes risk assessment less reliable.

**Mitigation approaches:**
- Conservative treatment for low-data cases
- Signal confidence acknowledgment
- Graduated trust building
- External data sources where appropriate

### 10.4. Over-Blocking

Aggressive risk thresholds may block legitimate users and operators.

**Mitigation approaches:**
- False positive monitoring
- Appeal process availability
- Graduated response (warning before restriction)
- Human review for consequential actions

### 10.5. Under-Detection

Conservative approaches may miss actual fraud.

**Mitigation approaches:**
- Continuous monitoring of known fraud outcomes
- Signal refinement based on missed cases
- Balance between precision and recall
- Multiple detection layers

---

## 11. Relationship to Canonical Documents

This document references and aligns with the following canonical specifications:

### 11.1. DOC-099 — Content Moderation & Fraud Protection Policy

Defines platform policies for content moderation and fraud response. This document provides risk intelligence; DOC-099 defines enforcement policy.

### 11.2. DOC-092 — Warehouse Quality Score

Defines quality scoring for warehouse listings. Risk scoring is distinct from quality scoring but may share some signals.

### 11.3. DOC-093 — Warehouse Safety & Security Scoring

Defines safety and security attributes for warehouses. Risk scoring focuses on fraud risk, not physical safety attributes.

### 11.4. DOC-098 — Data Governance & Data Quality (Data_Governance_DQ_Specification_COMPLETE.md)

Defines data quality standards. Risk scoring depends on quality data and contributes to data governance through signal generation.

### 11.5. DOC-078 — Security & Compliance Plan (security_and_compliance_plan_mvp_v1.md)

Defines security controls and compliance requirements. Risk scoring operates within security architecture and generates audit-relevant data.

### 11.6. DOC-001 — MVP Requirements (Functional_Specification_MVP_v1_CORRECTED.md)

Defines platform functional scope. Risk scoring supports MVP functionality without adding new user-facing features.

### 11.7. AI Core Design (AI_Core_Design_MVP_v1_CANONICAL.md)

Defines AI system architecture and principles. AI-assisted risk signals follow AI Core design patterns and constraints.

### 11.8. Internal Admin API (DOC-101)

Defines administrative interfaces. Risk signals may be exposed through admin interfaces for operational use.

---

## 12. Non-Goals

This document explicitly does NOT define:

### 12.1. Enforcement Logic

This document does not define what actions are taken based on risk scores. Enforcement is a policy decision, not a technical specification.

### 12.2. API Specification

This document does not define APIs for risk scoring. API definitions, if needed, would be documented separately following API design standards.

### 12.3. Service Level Agreements

This document does not define SLAs for risk scoring services. SLAs are operational commitments defined elsewhere.

### 12.4. Legal Advice

This document does not provide legal interpretation or advice. Legal requirements are addressed in platform legal documentation.

### 12.5. ML Implementation

This document does not specify machine learning models, training procedures, or technical implementations. Implementation details are engineering decisions.

### 12.6. Numeric Thresholds

This document does not define specific numeric thresholds, weights, or cutoff values. These are operational parameters subject to tuning.

### 12.7. Automatic Blocking

This document does not authorize or describe automatic blocking, suspension, or restriction of users or operators without human review.

---

## Appendix A: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Trust & Safety | Initial conceptual framework |

---

## Appendix B: Review Schedule

This document should be reviewed:
- Quarterly as part of Trust & Safety planning
- After significant fraud incidents
- When platform scope expands significantly
- When new signal sources become available

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| Risk Score | A computed assessment of potential fraud or policy violation risk |
| Signal | An indicator or pattern that may suggest elevated risk |
| False Positive | A legitimate entity or action incorrectly flagged as risky |
| Cold-Start | The period when an entity has limited behavioral history |
| Decay | The reduction in signal weight over time |
| Human-in-the-Loop | Requirement for human review before consequential actions |
| Gaming | Deliberate attempts to evade risk detection |

---

*End of Document*
