# DOC-053: Lead Scoring AI Engine — Deep Tech Specification (MVP → v2)

**Document ID:** DOC-053  
**Title:** Lead Scoring AI Engine — Deep Tech Specification  
**Type:** Supporting / Non-Canonical / AI & Decision Support  
**Project:** Self-Storage Aggregator  
**Version:** 1.1  
**Date:** December 18, 2025  
**Status:** 🟡 Supporting / Advisory / Non-Canonical

---

> **DOCUMENT STATUS:** 🟡 Supporting / Advisory  
> **Canonical:** ❌ No  
> **Binding:** ❌ No  
> **Execution Mandatory:** ❌ No  
> **Scope:** Conceptual / Post-MVP (v2+)  
>
> This document describes a **conceptual approach** to AI-assisted lead scoring  
> for **future consideration** (post-MVP). It is **advisory only** and does **NOT**:
> - Specify mandatory implementation
> - Guarantee conversion improvements
> - Automate decision-making
> - Replace human judgment
> - Define CRM workflows
>
> Lead scoring, if implemented, would be **probabilistic**, **advisory**, and  
> **subject to human oversight**. This document exists to frame expectations  
> and prevent misuse, not to promise outcomes.

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Lead Scoring Philosophy](#2-lead-scoring-philosophy)
3. [MVP v1 Baseline (No AI Scoring)](#3-mvp-v1-baseline-no-ai-scoring)
4. [Lead Signals (Conceptual)](#4-lead-signals-conceptual)
5. [Scoring Use Cases (Advisory)](#5-scoring-use-cases-advisory)
6. [Uncertainty, Bias & Fairness](#6-uncertainty-bias--fairness)
7. [What the Engine Does NOT Do](#7-what-the-engine-does-not-do)
8. [Relation to Other Documents](#8-relation-to-other-documents)
9. [Non-Goals & Explicit Exclusions](#9-non-goals--explicit-exclusions)
10. [Risks & Misuse Scenarios](#10-risks--misuse-scenarios)
11. [Appendix: Conceptual Signal Categories](#11-appendix-conceptual-signal-categories)

---

## 1. Document Role & Scope

### 1.1. Document Purpose

This document articulates a **conceptual framework** for AI-assisted lead scoring in the Self-Storage Aggregator platform. It exists to:

1. **Frame expectations:** Clarify what lead scoring can and cannot do
2. **Prevent misuse:** Establish boundaries to prevent over-reliance on scores
3. **Guide future exploration:** Provide structure for post-MVP experimentation
4. **Protect the business:** Document risks and non-goals explicitly

This is **NOT** an implementation specification. It does not define algorithms, models, or deployment strategies. It is a **philosophical and conceptual** document that establishes principles for responsible exploration of lead scoring capabilities.

### 1.2. Supporting Document Classification

This document is **supporting** and **non-canonical**:

- **Non-Canonical:** Does not define mandatory platform behavior
- **Non-Binding:** Does not commit to feature development or outcomes
- **Advisory:** Provides guidance for future consideration
- **Defensive:** Explicitly documents what will NOT be built

**Contrast with Canonical Documents:**
- Canonical documents (CRM spec, API spec, database spec) define **required** behavior
- This document defines **optional, future, exploratory** concepts
- If there is any conflict, canonical documents take precedence

### 1.3. Scope Boundaries

**In Scope:**
- Conceptual description of lead signals
- Philosophical approach to scoring
- Uncertainty acknowledgment
- Bias awareness
- Human-in-the-loop principles
- Use case framing (advisory only)

**Explicitly Out of Scope:**
- CRM workflow automation
- Specific algorithms or models
- MLOps pipelines or retraining strategies
- Integration with CRM state machines
- Pricing or availability decisions
- Revenue optimization strategies
- Conversion guarantees or predictions

### 1.4. MVP v1 → v2 Trajectory

**MVP v1 (Current):**
- No AI lead scoring
- Deterministic, manual lead processing
- Simple status tracking: `new`, `contacted`, `in_progress`, `closed`
- Operators prioritize leads manually
- No automated lead qualification

**Post-MVP (v2+, Conceptual):**
- Optional AI-assisted scoring for **internal visibility**
- Scores as **indicators**, not decisions
- Human operators remain in control
- Explainability prioritized over accuracy
- Conservative, defensive implementation

**Timeline:** Not specified. Implementation contingent on business need, team capacity, and proven value in controlled experiments.

---

## 2. Lead Scoring Philosophy

### 2.1. Core Principles

#### 2.1.1. Scores Are Indicators, Not Decisions

Lead scores, if implemented, would be **probabilistic indicators** of potential lead quality. They are:

- **Informational:** Help operators prioritize attention
- **Advisory:** Suggest where to focus, not what to do
- **Contextual:** One input among many
- **Fallible:** Subject to error and uncertainty

Scores **do not**:
- Automatically accept or reject leads
- Trigger automated workflows
- Determine pricing or availability
- Replace human judgment

#### 2.1.2. Uncertainty by Default

All lead scores, if generated, would be accompanied by:

- **Confidence intervals:** Acknowledge uncertainty
- **Caveat explanations:** Highlight limitations
- **Contextual factors:** Identify what the score does not consider
- **Recency indicators:** Show data freshness

**No score is ever presented as certain.** Operators are explicitly informed that scores are estimates subject to error.

#### 2.1.3. No Automation of Actions

The lead scoring engine, if built, would **never** trigger automated actions:

- ❌ No automatic status changes
- ❌ No automatic lead rejection
- ❌ No automatic priority assignment
- ❌ No automatic notification suppression
- ❌ No automatic workflow routing

**All actions remain operator-initiated and operator-controlled.**

#### 2.1.4. Explainability Over Accuracy

If faced with a trade-off between:
- A more accurate but opaque model
- A less accurate but explainable model

The platform prioritizes **explainability**.

**Rationale:**
- Operators must understand why a score was assigned
- Auditability and fairness require transparency
- Trust in the system depends on comprehensibility
- Legal and regulatory risk is reduced with explainability

### 2.2. Human-in-the-Loop Imperative

The platform philosophy is **human-augmented**, not human-replaced:

**Operators are empowered, not sidelined:**
- Operators see scores and explanations
- Operators decide how to use (or ignore) scores
- Operators provide feedback to improve scores
- Operators retain full control over lead outcomes

**Feedback loops are manual:**
- Operators can flag incorrect scores
- Operators can provide context the AI missed
- Feedback is reviewed by humans before influencing future scoring

**Guardrails:**
- No score is presented without explanation
- Operators can always override score-based suggestions
- Platform tracks score usage and operator decisions separately

### 2.3. Quality Over Coverage

The engine, if built, would prioritize:

**High-confidence subset over comprehensive coverage:**
- It is better to score 60% of leads with high confidence than 100% with low confidence
- Leads without confident scores receive neutral treatment
- Uncertainty is communicated clearly

**Graceful degradation:**
- If the scoring engine is unavailable, platform functionality is unaffected
- Operators revert to manual prioritization without disruption
- No critical workflows depend on scoring availability

---

## 3. MVP v1 Baseline (No AI Scoring)

### 3.1. Current Lead Management

**As of MVP v1**, lead management is entirely **deterministic and manual**:

**Lead States (from CRM spec):**
- `new` — Lead just created, not yet contacted
- `contacted` — Operator has made initial contact
- `in_progress` — Operator is actively working the lead
- `closed` — Lead is finished (booked, declined, lost, spam, etc.)

**Manual Prioritization:**
- Operators view leads in chronological order (newest first)
- Operators apply personal judgment to prioritize
- No algorithmic ranking or scoring
- No AI assistance

**Spam Detection:**
- Boolean flag `is_spam` set manually by operator
- Simple heuristics (e.g., duplicate phone numbers) may assist
- No AI-based spam prediction

**Activity Logging:**
- Operators manually log activities: calls, notes, emails
- No AI-generated insights or suggestions

### 3.2. Why No AI Scoring in MVP v1

**Strategic decision to defer AI scoring:**

1. **Simplicity:** MVP focuses on core CRM functionality
2. **Data sparsity:** Insufficient historical data to train reliable models
3. **Operator learning curve:** Operators need time to learn the platform first
4. **Risk avoidance:** Premature AI could introduce bias or distrust
5. **Resource constraints:** Limited engineering capacity in MVP

**MVP v1 success does not depend on AI scoring.** The platform is functional and valuable without it.

### 3.3. Data Foundations for Future Scoring

MVP v1 **does** establish data foundations that could support future scoring:

**Lead data captured:**
- CRM lead records containing contact information, inquiry preferences, source attribution, and lifecycle timestamps as defined in canonical CRM and data model specifications
- Status information and status transition history for tracking lead progression

**Activity data captured:**
- CRM activity records documenting operator interactions, communication attempts, and engagement patterns as defined in canonical CRM specifications
- Timestamps and contextual notes associated with each activity

**Booking outcome data:**
- Booking records that may link to lead records when conversions occur, enabling outcome analysis
- Optional cross-references between closed leads and resulting bookings

**This data, over time, could be analyzed to identify patterns.** However, MVP v1 does not perform such analysis.

---

## 4. Lead Signals (Conceptual)

This section describes **conceptual signal categories** that might inform lead scoring, **if scoring were implemented**. These are **illustrative**, not prescriptive.

### 4.1. Signal Philosophy

**Signals are observations, not rules:**
- Signals suggest probable quality or intent
- No single signal is determinative
- Signals must be interpreted in context
- Signals can be wrong

**Signals are not discriminatory:**
- Signals must not include protected class attributes (race, religion, etc.)
- Signals must be business-relevant
- Signals must be explainable and defensible

### 4.2. Inquiry Completeness Signals

**Conceptual rationale:** Leads with more complete information may indicate higher intent.

**Potential signals:**
- Presence of name (vs. anonymous/fake)
- Presence of valid phone number
- Presence of email address
- Specification of preferred box size
- Specification of desired warehouse

**Interpretation challenges:**
- Some legitimate customers prefer privacy
- Incomplete information does not mean low intent
- Cultural differences in information-sharing norms

**Conclusion:** Completeness signals are **weak** and must be used cautiously.

### 4.3. User Intent Signals

**Conceptual rationale:** Certain behaviors may suggest higher purchase intent.

**Potential signals:**
- Repeat visits to warehouse detail pages
- Multiple warehouse comparisons
- Time spent on pricing information
- Favorites/saved warehouses
- Contact form submission context (e.g., from detail page vs. homepage)

**Interpretation challenges:**
- Intent can change rapidly
- Browsing behavior does not guarantee conversion
- Some users research extensively before deciding

**Conclusion:** Intent signals provide **context** but do not predict outcomes reliably.

### 4.4. Location Relevance Signals

**Conceptual rationale:** Leads for warehouses near the user's location may have higher conversion probability.

**Potential signals:**
- Distance between user location and warehouse
- User is in the same city as warehouse
- User has searched for warehouses in specific area

**Interpretation challenges:**
- Users may need storage far from home (e.g., near vacation property)
- Business users may book storage in different cities
- Location data may be imprecise or missing

**Conclusion:** Location signals are **suggestive** but not definitive.

### 4.5. Historical Interaction Patterns

**Conceptual rationale:** Users with past positive interactions may be more likely to convert.

**Potential signals:**
- User is a repeat customer (has prior bookings)
- User has completed bookings without issues
- User has left positive reviews
- User responds promptly to operator outreach

**Interpretation challenges:**
- New users have no history (cold start problem)
- Past behavior does not guarantee future behavior
- Changes in user circumstances affect likelihood

**Conclusion:** Historical signals are **valuable for known users** but create disparate treatment of new vs. returning users.

### 4.6. What Signals Are NOT

**Not included in scoring (if ever built):**

❌ **User demographics:** No age, gender, ethnicity, religion, nationality  
❌ **Protected class attributes:** No legally protected characteristics  
❌ **Personal financial information:** No credit scores, income, net worth  
❌ **Social media activity:** No external profile scraping  
❌ **IP reputation:** No blanket assumptions based on IP geolocation  
❌ **Device type:** No discrimination based on device quality  
❌ **Language proficiency:** No penalty for non-native speakers  
❌ **Response speed:** No assumption that slow responses mean low quality  

**Fairness commitment:** Scoring logic, if built, would be regularly audited for disparate impact and bias.

---

## 5. Scoring Use Cases (Advisory)

This section describes **how scores might be used**, if they were generated. All uses are **advisory** and **optional**.

### 5.1. Internal Prioritization (Operator View)

**Use case:** Operators see leads with contextual indicators to help prioritize their time.

**Conceptual approach:**

The system may present scoring insights in a non-prescriptive, informational manner alongside lead records. Each lead would display:
- Basic lead information (contact details, creation time)
- Optional quality indicator (e.g., high/medium/unknown confidence)
- Brief explanatory context for the indicator (e.g., "based on inquiry completeness and engagement signals")

**Guiding principles:**
- Indicators are **suggestive**, not prescriptive — they inform, not direct
- Explanations accompany every indicator to maintain transparency
- Operators retain full control over sorting, filtering, and prioritization
- All leads remain visible regardless of score; no leads are hidden or suppressed
- Operators can ignore indicators entirely without system penalty

**Operator control:**
- Operators decide which leads to contact first based on their judgment
- Indicators serve as one input among many considerations
- Lead visibility and accessibility are independent of scoring

### 5.2. Workflow Support (No Automation)

**Use case:** Scores provide context to assist operator decision-making, without automating decisions.

**Conceptual approach:**

The system may present contextual suggestions alongside lead records to assist operator workflow planning. For instance, a lead assessed as having strong intent signals might be accompanied by a non-binding suggestion to consider prioritized follow-up. These suggestions would always be:
- Explicitly labeled as optional and advisory
- Accompanied by operator action controls (e.g., accept, dismiss, ignore)
- Logged for feedback purposes without affecting lead treatment
- Presented without triggering any automated state changes or actions

**Important constraints:**
- Suggestions are **optional** — operators are never required to follow them
- Operators can **override** any suggestion without consequence
- System **logs** whether suggestions were followed (for feedback and learning only)
- No **automatic actions** are triggered by scores or suggestions under any circumstances

### 5.3. Operator Visibility (Aggregate Insights)

**Use case:** Operators see aggregate patterns to inform their approach, without affecting individual lead treatment.

**Conceptual approach:**

The system may provide aggregate summaries showing distribution patterns across scored and unscored leads. These summaries would present:
- Total lead volumes over a defined period
- Distribution of confidence levels (high/medium/unknown) across the lead population
- Overall conversion outcomes for all leads, regardless of scoring
- Explicit disclaimers that scores are advisory and conversion depends on multiple factors including operator skill, warehouse quality, market conditions, and customer circumstances

**Use of aggregate insights:**
- Operators understand **patterns and distributions**, not predictions of individual outcomes
- No individual leads are treated differently based on aggregate statistics
- Insights **inform** operator strategy development without prescribing specific actions
- Aggregate data serves as context for operators to calibrate their own judgment

### 5.4. Feedback Loop (Human-Curated)

**Use case:** Operators provide feedback on score accuracy to improve future scoring.

**Conceptual approach:**

The system may provide mechanisms for operators to submit feedback on scoring accuracy after lead outcomes are determined. Feedback collection would allow operators to:
- Indicate whether a score accurately reflected the lead's eventual outcome
- Provide contextual explanation for scoring inaccuracies (e.g., external factors the system could not observe)
- Add freeform notes describing circumstances that affected the outcome

**Use of feedback:**
- Feedback is **reviewed by humans** before any system modifications
- Feedback **may** inform future model adjustments through manual analysis and deliberate updates
- Operators are **not required** to provide feedback; it remains optional
- Feedback does **not** retroactively change treatment of individual leads or affect their final status

---

## 6. Uncertainty, Bias & Fairness

### 6.1. Probabilistic Outputs

All lead scores, if generated, are **probabilistic estimates**, not certainties:

**Uncertainty quantification:**
- Scores would be presented with explicit confidence intervals or uncertainty ranges
- Low-confidence scores would be flagged explicitly to prevent overreliance
- Operators would be informed when available data is insufficient for reliable scoring

**Conceptual presentation approach:**

Scores would be accompanied by clear explanations describing:
- What the score is based on (e.g., number and type of signals considered)
- The confidence interval or uncertainty range associated with the score
- Recommended interpretation (e.g., treat as neutral until more information available)
- Explicit disclaimers clarifying what the score does NOT mean (not a guarantee, not a rejection, not affecting pricing or availability)

### 6.2. Bias Awareness

**Acknowledged bias risks:**

1. **Historical bias:** If past data reflects discriminatory patterns, scoring may perpetuate them
2. **Selection bias:** Scored leads may differ systematically from unscored leads
3. **Feedback loop bias:** If operators prioritize high-scoring leads, those leads get more attention, creating self-fulfilling prophecies
4. **Cold start bias:** New users have no history, disadvantaging them relative to returning users

**Mitigation strategies:**

**Regular audits:**
- Analyze score distributions across user segments
- Check for disparate impact by geography, device, language, etc.
- Review conversion rates for scored vs. unscored leads

**Fairness constraints:**
- Explicitly exclude protected class attributes
- Monitor for proxy discrimination (e.g., ZIP code as proxy for race)
- Ensure new users receive fair treatment despite lack of history

**Operator training:**
- Educate operators on bias risks
- Encourage operators to question scores
- Create culture where scores are tools, not rules

### 6.3. No Exclusion Decisions

**Fundamental principle:** Lead scoring, if implemented, **never** results in lead exclusion:

- ❌ No leads are **hidden** from operator view
- ❌ No leads are **automatically rejected**
- ❌ No leads are **deprioritized** to the point of being ignored
- ❌ No users are **blocked** from creating leads

**Visibility guarantee:**
- **All leads** are visible to operators
- **All leads** receive operator attention (eventually)
- Scoring may suggest **prioritization**, but not **exclusion**

**Recourse:**
- Users do not see their scores (to prevent gaming)
- Users can contact support if they believe they were unfairly treated
- Operators can flag unfair scoring to improve the system

---

## 7. What the Engine Does NOT Do

This section is **critical** for preventing misuse and managing expectations.

### 7.1. No Auto-Reject

The lead scoring engine **never** automatically rejects, closes, or hides leads.

**What this means:**
- Every lead created is **visible** to operators
- Every lead has the **opportunity** to convert
- No lead is **excluded** based on score alone

**Why this matters:**
- Protects against false negatives (high-quality leads incorrectly scored low)
- Ensures fairness for all users
- Maintains human judgment in critical decisions

### 7.2. No Pricing Impact

The lead scoring engine **does not** influence pricing:

- ❌ Scores do **not** affect box prices shown to users
- ❌ Scores do **not** trigger dynamic pricing adjustments
- ❌ Scores do **not** restrict access to promotions or discounts

**Why this matters:**
- Prevents discriminatory pricing
- Maintains transparency in pricing logic
- Avoids regulatory risk related to differential pricing

### 7.3. No Availability Impact

The lead scoring engine **does not** affect box availability:

- ❌ Scores do **not** determine who can book a box
- ❌ Scores do **not** prioritize one user's booking over another's
- ❌ Scores do **not** create artificial scarcity

**Why this matters:**
- First-come, first-served fairness
- Prevents gaming or favoritism
- Ensures equal opportunity for all users

### 7.4. No User Segmentation Enforcement

The lead scoring engine **does not** enforce user segmentation:

- ❌ Scores do **not** assign users to tiers or categories
- ❌ Scores do **not** determine user privileges
- ❌ Scores do **not** affect user experience beyond operator workflow hints

**Why this matters:**
- Prevents creating classes of users
- Avoids discriminatory treatment
- Maintains platform neutrality

### 7.5. No Revenue Optimization

The lead scoring engine is **not** a revenue optimization tool:

- ❌ It does **not** predict lifetime value
- ❌ It does **not** recommend upsells or cross-sells
- ❌ It does **not** prioritize high-value customers over low-value customers

**Why this matters:**
- Prevents profit-driven discrimination
- Focuses on service quality, not revenue extraction
- Aligns with platform values of fairness

### 7.6. No Automated Marketing

The lead scoring engine **does not** trigger marketing actions:

- ❌ No automated emails based on scores
- ❌ No retargeting campaigns based on scores
- ❌ No promotional offers conditioned on scores

**Why this matters:**
- Avoids user annoyance
- Prevents unintended discrimination
- Respects user privacy and preferences

### 7.7. No CRM State Machine Changes

The lead scoring engine **does not** change CRM lead statuses:

- ❌ Scores do **not** move leads from `new` to `contacted`
- ❌ Scores do **not** close leads
- ❌ Scores do **not** mark leads as spam

**Why this matters:**
- Operators control lead lifecycle
- Prevents unintended consequences
- Maintains accountability

---

## 8. Relation to Other Documents

This document does **not** operate in isolation. It references and defers to other specifications:

### 8.1. DOC-CRM-001: CRM Lead Management System (CANONICAL)

**Relationship:**
- CRM spec defines lead statuses, workflows, and operator interfaces
- This document describes **optional** AI assistance within those workflows
- If conflict, **CRM spec takes precedence**

**Key alignment:**
- Lead statuses remain: `new`, `contacted`, `in_progress`, `closed`
- Operators manually update statuses
- No AI-triggered status changes

**Data sources:**
- Lead scoring, if built, would consume data from CRM lead and activity records as defined in canonical specifications
- Lead scoring would **not** modify CRM data directly; it would operate as a read-only consumer
- Scores would be stored separately in dedicated scoring data structures, if implemented

### 8.2. DOC-092: Warehouse Quality Score Algorithm (Supporting)

**Relationship:**
- Both documents describe **conceptual** scoring approaches
- Both emphasize **advisory** nature and **uncertainty**
- Both prioritize **explainability** over accuracy
- Both acknowledge **bias risks**

**Distinction:**
- DOC-092 scores **warehouses** (facilities)
- DOC-053 scores **leads** (customer inquiries)
- Different input signals, different use cases

**Shared philosophy:**
- Scores are indicators, not decisions
- Human-in-the-loop is mandatory
- Fairness and transparency are paramount

### 8.3. DOC-024: AI Box Size Recommendation (CANONICAL, MVP Scope)

**Relationship:**
- Both involve AI assistance
- Box size recommendation is **user-facing** and **in MVP v1**
- Lead scoring is **operator-facing** and **post-MVP only**

**Distinction:**
- Box recommendation helps **users** choose sizes
- Lead scoring helps **operators** prioritize attention
- Box recommendation is **required** for good UX
- Lead scoring is **optional** for operator efficiency

**Data overlap:**
- Box recommendation may use `preferred_box_size` from lead
- Lead scoring may consider whether user specified `preferred_box_size`
- No direct interaction between the two systems

### 8.4. DOC-011: Pricing Recommendation Engine (Future/Supporting)

**Relationship:**
- Both are **advisory** AI modules
- Both are **operator-facing**
- Both are **post-MVP**

**Distinction:**
- Pricing engine recommends **box prices**
- Lead scoring assesses **lead quality**
- No direct interaction (lead scoring does not influence pricing)

**Boundary:**
- Lead scores do **not** affect pricing recommendations
- Pricing recommendations do **not** affect lead scores
- Two separate, independent advisory systems

### 8.5. DOC-038: Demand Forecasting (Future/Supporting)

**Relationship:**
- Both analyze patterns in user behavior
- Both are **post-MVP**
- Both are **probabilistic**

**Distinction:**
- Demand forecasting predicts **future aggregate demand** (how many boxes needed)
- Lead scoring assesses **individual lead quality** (which leads to prioritize)
- Different time horizons, different granularity

**Potential synergy:**
- Demand forecasting may inform context for lead scoring (e.g., "demand is high this week")
- Lead scoring does **not** affect demand forecasting models

### 8.6. DOC-106: Trust & Safety Framework (Supporting)

**Relationship:**
- Trust & Safety Framework defines governance principles
- Lead scoring must operate within those principles

**Key constraints:**
- Lead scoring must **not** create discriminatory outcomes
- Lead scoring must be **explainable** and **auditable**
- Lead scoring must have **human oversight**
- Lead scoring decisions subject to **appeal**

**Alignment:**
- No automated exclusion (aligns with fairness)
- No hidden criteria (aligns with transparency)
- Human-in-the-loop (aligns with accountability)

---

## 9. Non-Goals & Explicit Exclusions

### 9.1. Not a CRM System

This document does **not** define CRM capabilities:

- ❌ Not defining lead capture workflows
- ❌ Not defining status state machines
- ❌ Not defining operator dashboards
- ❌ Not defining activity logging

**Refer to DOC-CRM-001 for CRM functionality.**

### 9.2. Not a Sales Automation Tool

This document does **not** enable sales automation:

- ❌ No automated follow-up sequences
- ❌ No automated email campaigns
- ❌ No automated lead assignment
- ❌ No automated escalations

**Manual operator actions remain the only way to progress leads.**

### 9.3. Not a Revenue Optimization Engine

This document does **not** aim to maximize revenue:

- ❌ No lifetime value predictions
- ❌ No upsell recommendations
- ❌ No customer segmentation for pricing
- ❌ No dynamic pricing based on user profiles

**Revenue optimization is not the purpose of lead scoring.**

### 9.4. Not a Marketing Attribution System

This document does **not** perform marketing attribution:

- ❌ No attribution of conversions to marketing channels
- ❌ No measurement of campaign effectiveness
- ❌ No ROI calculation for marketing spend

**Lead source tracking (e.g., 'website' vs. 'repeat_customer') exists in CRM, but attribution analysis is separate.**

### 9.5. Not a Predictive Analytics Platform

This document does **not** provide general-purpose predictive analytics:

- ❌ No churn prediction
- ❌ No demand forecasting (see DOC-038)
- ❌ No market trend analysis
- ❌ No competitor analysis

**Lead scoring is narrow: assess individual lead quality only.**

### 9.6. Not a Data Science Playground

This document does **not** enable open-ended data science experimentation:

- ❌ No arbitrary model training
- ❌ No uncontrolled algorithm deployment
- ❌ No "let's see what happens" A/B tests on users

**Any scoring implementation must follow strict governance, auditing, and approval processes.**

---

## 10. Risks & Misuse Scenarios

This section explicitly documents risks to prevent them.

### 10.1. Over-Reliance on Scores

**Risk:**
Operators trust scores too much and ignore their own judgment or contextual information.

**Manifestation:**
- High-scoring leads get all attention; low-scoring leads are neglected
- Operators stop thinking critically about leads
- Scores become self-fulfilling prophecies

**Mitigation:**
- Continuous operator training on score limitations
- Regular audits of conversion rates across score levels
- Encourage operators to document when they override scores
- Celebrate cases where operators correctly judged a low-scoring lead as high-value

### 10.2. Feedback Loops

**Risk:**
Prioritizing high-scoring leads causes them to convert more often, which reinforces the scoring model, creating a feedback loop that entrenches initial biases.

**Manifestation:**
- High-scoring leads get faster responses, increasing conversion
- Low-scoring leads get delayed responses, decreasing conversion
- Model learns that high scores predict conversion (but only because of prioritization)

**Mitigation:**
- Randomized experiments: treat some leads uniformly regardless of score
- Monitor response time distributions across score levels
- Explicitly model and adjust for operator prioritization effects
- Regularly retrain models with causal inference techniques

### 10.3. Bias Amplification

**Risk:**
Scoring inadvertently amplifies biases present in historical data or operator behavior.

**Manifestation:**
- Certain user segments consistently receive low scores
- Scores correlate with protected class attributes (even if not directly used)
- Disparate impact emerges over time

**Mitigation:**
- Regular bias audits (quarterly or more frequently)
- Fairness metrics: analyze score distributions across user segments
- External audit by third-party fairness experts
- Immediate suspension of scoring if disparate impact detected
- Prohibition of proxy variables that correlate with protected classes

### 10.4. Regulatory Exposure

**Risk:**
Lead scoring could violate laws related to discrimination, consumer protection, or data privacy.

**Manifestation:**
- Regulatory inquiry into scoring practices
- User complaints about unfair treatment
- Legal action alleging discrimination

**Mitigation:**
- Legal review before implementing scoring
- Compliance with applicable data protection and privacy regulations
- Right to explanation: users can request why they received certain treatment
- Documentation of scoring logic for regulatory inspection
- Clear policies on data retention and deletion

### 10.5. Gaming and Manipulation

**Risk:**
If users learn how scoring works, they may manipulate their behavior to achieve high scores.

**Manifestation:**
- Users provide false information to match high-scoring patterns
- Users create multiple accounts to appear as repeat customers
- Fraud increases as bad actors learn to mimic high-quality leads

**Mitigation:**
- Do not disclose scoring logic to users
- Do not show scores to users
- Regularly update scoring logic to prevent gaming
- Monitor for anomalous patterns that suggest manipulation
- Human review of suspicious high-scoring leads

### 10.6. Misalignment with Business Goals

**Risk:**
Scoring optimizes for the wrong outcomes (e.g., lead volume instead of conversion quality).

**Manifestation:**
- Operators prioritize leads that score high but don't actually convert
- Platform focuses on metrics that don't align with revenue or user satisfaction
- Scoring becomes a goal in itself, rather than a tool

**Mitigation:**
- Clearly define success metrics before implementing scoring
- Regularly review whether scoring aligns with business goals
- Be willing to disable or modify scoring if it's not helping
- Avoid vanity metrics (e.g., "average lead score increasing") in favor of business outcomes (e.g., "conversion rate improving")

### 10.7. Technical Failures

**Risk:**
Scoring system fails (bugs, downtime, model drift) and causes operational disruption.

**Manifestation:**
- Scores become inaccurate or nonsensical
- Scoring API is unavailable
- Operators rely on scoring and are disrupted by failure

**Mitigation:**
- Graceful degradation: platform fully functional without scoring
- Monitoring and alerting for scoring system health
- Clear fallback procedures for operators
- Regular testing of failure scenarios
- Avoid hard dependencies on scoring in critical workflows

---

## 11. Appendix: Conceptual Signal Categories

This appendix provides additional detail on signal categories for reference only. These are **not** implementation requirements.

### 11.1. Completeness Signals (Weak)

| Signal | Rationale | Limitations |
|--------|-----------|-------------|
| Name provided | May indicate legitimacy | Many legitimate users prefer pseudonyms |
| Phone number valid | Enables operator contact | Burner numbers or VoIP can be legitimate |
| Email provided | Additional contact channel | Disposable emails can be legitimate |
| Box size specified | Shows user has thought about needs | User may be unsure or exploring options |
| Warehouse specified | Indicates specific intent | User may be comparing multiple warehouses |

**Aggregate interpretation:** A lead with all fields filled may suggest higher intent, but absence of fields does not indicate low intent. Many legitimate users prefer minimal information sharing initially.

### 11.2. Intent Signals (Contextual)

| Signal | Rationale | Limitations |
|--------|-----------|-------------|
| Multiple warehouse views | User is actively shopping | May be window-shopping without intent to book |
| Time spent on pricing | User is evaluating cost | May be researching for someone else |
| Added to favorites | User is interested | User may favorite many warehouses and book none |
| Contact form from detail page | User interested in specific warehouse | May be asking general questions, not booking |
| Specified start date | User has timeline | Timeline may change |

**Aggregate interpretation:** Higher engagement suggests higher intent, but engagement does not guarantee conversion. Some users research extensively and never book; others book impulsively.

### 11.3. Location Signals (Suggestive)

| Signal | Rationale | Limitations |
|--------|-----------|-------------|
| User location matches warehouse city | Proximity increases likelihood | User may need storage elsewhere |
| User searched for warehouses in area | Targeted interest | User may be exploring, not committing |
| Distance < 5km | Very convenient | Convenience is one factor among many |

**Aggregate interpretation:** Proximity is a convenience factor, but users have diverse needs. Do not assume that distant leads are low-quality.

### 11.4. Historical Signals (Valuable but Limited)

| Signal | Rationale | Limitations |
|--------|-----------|-------------|
| Repeat customer | Past satisfaction | Circumstances may have changed |
| Past booking completed without issues | Reliable user | Past behavior does not guarantee future behavior |
| Positive reviews left | Engaged user | Small sample size |
| Prompt responses to operator | Serious intent | Responsiveness can vary by context |

**Aggregate interpretation:** Historical signals are valuable for known users but create disparate treatment of new users. Ensure new users receive fair treatment.

### 11.5. Timing Signals (Weak)

| Signal | Rationale | Limitations |
|--------|-----------|-------------|
| Lead created during business hours | May be more serious | Many legitimate leads created after hours |
| Lead created on weekday vs. weekend | Work-related storage vs. personal | Weak correlation |
| Time to first operator contact | N/A — this is operator behavior, not lead quality | Should not be used as signal |

**Aggregate interpretation:** Timing signals are very weak and should not be weighted heavily, if at all.

---

## Conclusion

This document establishes a **cautious, defensive, advisory** framework for considering lead scoring in the Self-Storage Aggregator platform. It emphasizes:

- **No automation** of decisions
- **No guarantees** of outcomes
- **Human-in-the-loop** at all times
- **Transparency** and **explainability**
- **Fairness** and **bias awareness**
- **Uncertainty** acknowledgment

**Lead scoring, if ever implemented, would be:**
- A tool, not a rule
- An indicator, not a decision
- A suggestion, not a command
- Probabilistic, not deterministic
- Auditable, not opaque
- Optional, not mandatory

**This document exists to:**
- Prevent misuse of lead scoring
- Manage expectations about what AI can do
- Protect the business from over-promising
- Establish clear boundaries for responsible exploration

**If you read this document and thought:**
- "This will definitely improve conversion rates" — ❌ Wrong takeaway
- "We can automate lead processing" — ❌ Wrong takeaway
- "AI will replace operators" — ❌ Wrong takeaway
- "Lead scoring is a nice-to-have tool for operators, if done carefully" — ✅ Correct takeaway

---

**Document Status:** 🟡 Supporting / Advisory / Non-Canonical  
**Last Updated:** December 18, 2025  
**Version:** 1.1  
**Maintained By:** AI & Decision Support Documentation Team  

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-18 | Documentation Engine | Initial cautious specification |
| 1.1 | 2025-12-18 | Documentation Engine | Audit hardening: replaced UI mockups with textual descriptions; abstracted table/field references; neutralized regulation mentions |

**End of Document**
