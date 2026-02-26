# DOC-013: AI-Based Anomaly Detection for Prices & Demand

**Self-Storage Aggregator Platform**

---

## Document Status

> **Document Status:** 🟡 Supporting / Deep Technical Specification  
> **Canonical:** ❌ No  
> **Production Mandatory:** ❌ No  
> **Phase:** MVP v1 → v2 Evolution  
> **Last Updated:** December 17, 2025
>
> **CRITICAL:** This document describes **detection and signaling capabilities only**.  
> Anomaly detection does NOT trigger automated pricing changes, enforcement actions,  
> or modifications to platform behavior. All detected anomalies require human review  
> and explicit operator action.

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-013 |
| **Title** | AI-Based Anomaly Detection for Prices & Demand (MVP → v2) |
| **Version** | 1.0 |
| **Status** | Supporting / Non-Canonical |
| **Audience** | Data Science, Product Management, Engineering, Operations |
| **Related Documents** | DOC-009 (AI Core Design), DOC-092 (Warehouse Quality Score), DOC-057 (Monitoring & Observability), DOC-106 (Trust & Safety), DOC-016 (API Detailed Spec) |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [What This Document Is NOT](#2-what-this-document-is-not)
3. [Anomaly Detection Concept](#3-anomaly-detection-concept)
4. [MVP v1 Capabilities (Strictly Limited)](#4-mvp-v1-capabilities-strictly-limited)
5. [Post-MVP (v2) Capabilities (Non-Binding)](#5-post-mvp-v2-capabilities-non-binding)
6. [Signal Handling & Human Review](#6-signal-handling--human-review)
7. [Relation to Other Documents](#7-relation-to-other-documents)
8. [Non-Goals & Explicit Exclusions](#8-non-goals--explicit-exclusions)
9. [Risks & Safeguards](#9-risks--safeguards)
10. [Open Questions](#10-open-questions)

---

# 1. Document Role & Scope

## 1.1. Purpose

This document describes the **conceptual approach** to detecting anomalous patterns in pricing and demand data within the Self-Storage Aggregator platform. Anomaly detection serves as an **analytical support tool** that generates signals for human review, not as an automated decision-making system.

The primary goal is to help platform operators and data analysts identify potentially significant changes in market conditions, pricing behavior, or demand patterns that warrant investigation.

## 1.2. Scope

**What This Document Covers:**

- Conceptual framework for identifying anomalous pricing and demand patterns
- Types of anomalies that may be relevant for platform monitoring
- MVP v1 detection capabilities (rule-based, static thresholds)
- Post-MVP v2 evolution possibilities (adaptive, ML-based)
- Human review workflows and signal interpretation
- Integration points with monitoring and alerting systems

**What This Document Does NOT Cover:**

- Automated pricing adjustments or recommendations
- Real-time enforcement of pricing policies
- Autonomous AI decision-making
- Specific ML algorithms or model architectures
- Database schema changes or API contracts
- UI/UX specifications for dashboards
- Mandatory performance thresholds or SLAs

## 1.3. Architectural Position

Anomaly detection functions as an **observability enhancement** within the platform monitoring layer. It augments existing monitoring capabilities (as defined in DOC-057: Monitoring & Observability Plan) with market-aware intelligence.

**Key Characteristics:**

- **Advisory Only:** Anomaly detection generates insights, not actions
- **Human-Controlled:** All responses to detected anomalies require human decision-making
- **Non-Critical Path:** Platform operations do not depend on anomaly detection
- **Optional Feature:** Anomaly detection can be disabled without affecting core functionality

---

# 2. What This Document Is NOT

## 2.1. NOT an Auto-Pricing System

**This document does NOT describe:**

- Automated price adjustments based on detected anomalies
- Dynamic pricing engines that respond to market signals
- AI-driven price optimization algorithms
- Systems that modify operator-set prices without explicit approval

**Clarification:**  
Price recommendations (when provided by the platform) remain the responsibility of separate systems (see DOC-016 § 10.2 for AI Price Analytics). Anomaly detection may inform those systems by providing market context, but it does not directly generate pricing recommendations.

## 2.2. NOT a Demand Forecasting Engine

**This document does NOT describe:**

- Predictive models for future demand
- Booking probability estimation
- Occupancy rate forecasting
- Seasonal trend prediction

**Clarification:**  
Anomaly detection identifies deviations from expected patterns in historical data. It does not predict future behavior. Forecasting capabilities, if developed, would be separate features requiring independent product specification and validation.

## 2.3. NOT an Enforcement Mechanism

**This document does NOT describe:**

- Automatic suspension of warehouse listings due to pricing anomalies
- Enforcement of "fair pricing" policies
- Penalties or restrictions triggered by detected anomalies
- Automated compliance checks

**Clarification:**  
Trust & Safety enforcement (as governed by DOC-106) and pricing policy enforcement (if any) are independent processes. Anomaly detection may surface information relevant to these processes, but it does not initiate enforcement actions.

## 2.4. NOT a Real-Time Control System

**This document does NOT describe:**

- Sub-second anomaly detection and alerting
- Real-time circuit breakers or kill switches
- Live price validation at booking time
- Immediate blocking of suspicious activity

**Clarification:**  
Anomaly detection operates on aggregated historical data with analysis frequencies measured in hours or days, not milliseconds. It is an analytical tool for business intelligence, not a real-time operational control system.

---

# 3. Anomaly Detection Concept

## 3.1. What Is an Anomaly?

An **anomaly** is an observation that deviates significantly from expected behavior based on historical patterns and contextual norms. In the context of self-storage pricing and demand:

**Price Anomalies:**

- Sudden large changes in listed prices (e.g., 50%+ increase/decrease within 24 hours)
- Prices significantly divergent from local market averages
- Unusual price volatility (frequent price changes)
- Price-size relationships that deviate from typical patterns

**Demand Anomalies:**

- Unexpected spikes or drops in lead volume for a warehouse
- Sudden changes in booking conversion rates
- Unusual patterns in search-to-lead ratios
- Geographic demand shifts (e.g., one neighborhood sees surge while others decline)

**Relationship Anomalies:**

- Price changes that don't correlate with expected demand responses
- High prices coinciding with high booking rates (potential market opportunity)
- Low prices with low conversion (potential quality or trust signal)

## 3.2. Baseline vs. Deviation

**Baseline Concept:**

A baseline represents "normal" or "expected" behavior against which anomalies are measured. Baselines can be:

- **Historical Averages:** Mean prices over the past 30/60/90 days
- **Peer Comparisons:** Median prices for similar warehouses in the same area
- **Seasonal Norms:** Expected patterns adjusted for time of year
- **Market Context:** Regional averages accounting for local economic conditions

**Deviation Measurement:**

Deviations are measured as distances from the baseline. Common approaches include:

- **Percentage Change:** (Current - Baseline) / Baseline × 100
- **Standard Deviations:** How many σ from the mean
- **Percentile Ranks:** Position relative to historical distribution

**Note:** Specific formulas and thresholds are intentionally not prescribed in this document. They are subject to empirical calibration and operational tuning.

## 3.3. Interpretation Limits

**Anomalies Are Signals, Not Conclusions:**

- An anomaly indicates something **may** warrant investigation
- An anomaly does **not** prove anything is wrong
- Context is essential for interpretation
- False positives are expected and acceptable

**Common Reasons for Anomalies (Non-Problematic):**

- Intentional pricing strategy changes by operators
- Seasonal market shifts (e.g., summer moving season)
- Local events driving temporary demand (e.g., university semester start)
- Legitimate competitive responses
- Changes in warehouse features or availability

**Potential Concerns (Requiring Investigation):**

- Data entry errors (e.g., misplaced decimal point)
- System bugs affecting price calculations
- Fraudulent behavior or manipulation attempts
- Operator confusion about platform policies
- Market coordination issues (if multiple operators behave identically)

---

# 4. MVP v1 Capabilities (Strictly Limited)

## 4.1. MVP Philosophy

MVP v1 anomaly detection is **deliberately simple, conservative, and human-intensive**. The goal is to learn from operational experience before investing in sophisticated detection capabilities.

**Core Principles:**

- **Manual Review Dominant:** Humans inspect all flagged anomalies
- **Batch Processing:** Analysis runs periodically (e.g., daily), not real-time
- **Static Thresholds:** Fixed rules, not adaptive algorithms
- **High Tolerance:** Few false positives preferred over many true positives
- **Opt-In Alerting:** Operators choose whether to receive anomaly notifications

## 4.2. MVP v1 Detection Methods

### 4.2.1. Rule-Based Thresholds

**Simple threshold rules applied to aggregated data:**

**Example Rules (Conceptual, Not Binding):**

- **Large Price Change:** Flag if any warehouse price changes by >50% in a single day
- **Price Outlier:** Flag if warehouse price is >2x or <0.5x the regional median for similar box sizes
- **Repeated Changes:** Flag if the same warehouse changes prices >5 times in 7 days
- **Zero Demand:** Flag if a warehouse receives <1 lead per month while similar warehouses receive >10

**Implementation Notes:**

- Thresholds are configuration parameters, not hard-coded
- Rules apply only to warehouses with sufficient historical data (e.g., >30 days of history)
- Newly listed warehouses are excluded from anomaly flagging (cold-start grace period)

### 4.2.2. Static Baselines

**Baselines are calculated using simple historical aggregations:**

- **7-day rolling average** for short-term comparisons
- **30-day rolling average** for medium-term trends
- **Regional median** for peer comparisons (calculated weekly)

**Limitations:**

- No seasonal adjustment
- No trend awareness (cannot distinguish growth from anomaly)
- No cross-metric correlation (price and demand analyzed independently)

### 4.2.3. Batch Analysis Schedule

**Detection Frequency:**

- **Daily batch:** Runs overnight, analyzes previous day's data
- **Weekly summary:** Aggregates weekly patterns, identifies multi-day trends
- **Monthly report:** High-level market overview for business stakeholders

**No Real-Time Detection:**

MVP v1 does **not** include real-time anomaly detection. Analysis always lags operational data by at least 12-24 hours.

## 4.3. MVP v1 Alert Mechanisms

### 4.3.1. Internal Admin Dashboard

**Platform administrators** see a summary dashboard with:

- List of flagged warehouses and detected anomaly types
- Links to detailed data views (price history charts, demand timelines)
- Manual review workflow: Mark as "Reviewed", "Action Needed", or "False Positive"

**UI Details:** Not specified in this document. Refer to internal admin UX specifications when developed.

### 4.3.2. Optional Operator Notifications

**Warehouse operators** may optionally receive notifications if anomalies are detected for their listings:

- Email summary sent weekly (not per-anomaly)
- Content: "We noticed unusual pricing activity for [warehouse name]. This may indicate a data entry error or market change. Please review."
- Operators can opt out of these notifications in their settings
- Notifications are **informational only** and do not require action

**Rationale:**  
Operators benefit from being alerted to potential errors (e.g., accidentally setting price to 50,000 instead of 5,000), but must not feel pressured or policed.

### 4.3.3. Platform Monitoring Integration

**Anomaly detection results feed into observability systems (per DOC-057):**

- Aggregate metrics logged (e.g., "24 price anomalies detected today")
- Spike in anomaly counts may trigger engineering alerts (potential system bug)
- Anomaly data included in weekly operational reports

**No Critical Alerts:**

Anomaly detection does **not** generate critical or high-priority alerts. It contributes to situational awareness, not incident response.

## 4.4. MVP v1 Non-Features

**The following are explicitly NOT included in MVP v1:**

- ❌ Machine learning models
- ❌ Adaptive thresholds
- ❌ Cross-warehouse pattern detection
- ❌ Seasonal decomposition
- ❌ Causal inference (why did anomaly occur?)
- ❌ Predictive scoring (likelihood of future anomaly)
- ❌ Automated remediation suggestions
- ❌ Real-time monitoring or alerting
- ❌ API endpoints for anomaly data
- ❌ External system integrations

---

# 5. Post-MVP (v2) Capabilities (Non-Binding)

## 5.1. Evolution Philosophy

As the platform accumulates data and operational experience, anomaly detection may evolve toward more sophisticated methods. This evolution is **exploratory and non-binding**. No commitments are made regarding timeline, scope, or implementation.

**Guiding Principles for v2:**

- Human-in-the-loop remains mandatory
- False positive rate must remain acceptable to operators
- Explainability is non-negotiable (no black-box models)
- Performance improvements must be validated through experimentation

## 5.2. Potential v2 Enhancements

### 5.2.1. ML-Based Detection

**Conceptual Approaches:**

- **Supervised Learning:** Train models on labeled historical anomalies (requires building labeled dataset)
- **Unsupervised Learning:** Clustering or outlier detection algorithms (e.g., Isolation Forest, DBSCAN)
- **Time Series Models:** ARIMA, Prophet, or LSTM for trend-aware anomaly detection

**Benefits:**

- Better adaptation to seasonal patterns
- Reduced false positives through learned context
- Detection of subtle, multi-dimensional anomalies

**Challenges:**

- Requires significant labeled data for supervised approaches
- Model drift management and retraining workflows
- Explainability requirements limit model complexity

### 5.2.2. Adaptive Baselines

**Conceptual Approaches:**

- **Rolling Quantiles:** Baselines adjust as market conditions change
- **Segmented Baselines:** Different baselines for different warehouse types or regions
- **Trend-Aware Baselines:** Distinguish growth from anomaly (e.g., growing market vs. price spike)

**Benefits:**

- Reduced false positives from legitimate market evolution
- More accurate detection in diverse market conditions

**Challenges:**

- Complexity of maintaining multiple baseline definitions
- Risk of "normalizing" gradual problematic behavior

### 5.2.3. Cross-Warehouse Pattern Detection

**Conceptual Approaches:**

- **Correlation Analysis:** Detect coordinated behavior across multiple warehouses
- **Geographic Clustering:** Identify regional anomalies (all warehouses in area show same pattern)
- **Operator-Level Aggregation:** Detect patterns in operator portfolio behavior

**Benefits:**

- Detection of potential market manipulation or collusion
- Identification of systemic issues (e.g., API bugs affecting all operators)

**Challenges:**

- Privacy and fairness concerns (operators may coordinate legitimately)
- Complexity of distinguishing legitimate market dynamics from problematic behavior

### 5.2.4. Contextual Enrichment

**Conceptual Approaches:**

- **External Data Integration:** Incorporate local events, economic indicators, competitor data
- **Platform Activity Context:** Correlate anomalies with platform changes (e.g., new features, marketing campaigns)
- **Warehouse Metadata:** Use facility attributes (climate control, size distribution) to refine baselines

**Benefits:**

- Reduced false positives from expected external factors
- More nuanced interpretation of anomalies

**Challenges:**

- Data acquisition and integration complexity
- Maintaining data quality and freshness

### 5.2.5. Faster Detection Frequency

**Conceptual Approaches:**

- **Hourly Batches:** Reduce detection lag from 24 hours to 1 hour
- **Streaming Analysis:** Process pricing updates as they occur (still not real-time enforcement)

**Benefits:**

- Earlier awareness of significant anomalies
- Reduced window for potential issues

**Challenges:**

- Increased computational cost
- Risk of alert fatigue if frequency increases false positives

**Important:** Even in v2, faster detection does **not** imply automated intervention. Human review remains mandatory.

## 5.3. V2 Non-Commitments

**The following remain explicitly out of scope even in v2:**

- ❌ Automated pricing corrections
- ❌ Autonomous enforcement actions
- ❌ Real-time booking blocking based on anomalies
- ❌ Mandatory operator compliance with anomaly-based recommendations
- ❌ Anomaly-based dynamic pricing engines
- ❌ Fully autonomous AI decision-making

---

# 6. Signal Handling & Human Review

## 6.1. Review Workflow (Conceptual)

**Step 1: Detection**

- Anomaly detection system runs (daily in MVP v1)
- Flagged anomalies stored in system database
- Aggregate metrics logged for monitoring

**Step 2: Triage**

- Platform administrator reviews flagged anomalies
- Categorizes each as:
  - **False Positive:** Expected behavior, no action needed
  - **Data Error:** Requires correction (e.g., typo in price field)
  - **Operator Notification:** Operator should review but no platform action
  - **Investigation Required:** Potential policy violation or system issue
  - **Genuine Market Signal:** Notable but acceptable market behavior

**Step 3: Action (If Any)**

- **Data Error:** Administrator or support team contacts operator to correct
- **Investigation Required:** Escalate to Trust & Safety or Engineering as appropriate
- **Operator Notification:** Send informational email if operator has opted in
- **False Positive / Market Signal:** Log for future model improvement, no action

**Step 4: Documentation**

- All reviews logged for audit and learning
- Patterns in false positives inform threshold tuning
- Significant anomalies summarized in operational reports

## 6.2. Human Interpretation Guidance

**Questions to Ask When Reviewing Anomalies:**

1. **Is this expected?**
   - Seasonal pattern (e.g., summer demand surge)
   - Known market event (e.g., local festival, construction)
   - Intentional operator strategy

2. **Is this a data issue?**
   - Typo or data entry error
   - System bug or API integration issue
   - Sync lag from external source

3. **Is this concerning?**
   - Potential fraud or manipulation
   - Operator confusion about platform policies
   - Competitive pressure leading to race-to-bottom pricing

4. **What's the impact?**
   - Does this affect user experience?
   - Does this create trust or safety concerns?
   - Is this a one-time event or pattern?

5. **What action, if any, is appropriate?**
   - Fix data error
   - Contact operator for clarification
   - Escalate to Trust & Safety
   - Monitor for continuation
   - No action, log for reference

## 6.3. Operator Communication Principles

**When Contacting Operators About Anomalies:**

- **Be Informational, Not Accusatory:** Frame as "we noticed" not "you violated"
- **Assume Good Intent:** Most anomalies are mistakes, not malice
- **Provide Context:** Show the data that triggered the alert
- **Offer Assistance:** "If this was unintended, we can help correct it"
- **Respect Autonomy:** Operators are free to price as they choose within platform policies

**Tone Example:**

> "Hi [Operator Name], we noticed the price for your [box type] at [warehouse name] changed from [old price] to [new price] on [date]. This represents a [X%] change, which is larger than typical market adjustments. If this was intentional, no action is needed. If this was a data entry error, we're happy to help correct it. Please let us know if you have any questions."

## 6.4. Escalation Criteria

**When to Escalate Beyond Standard Review:**

- **Repeated Anomalies:** Same warehouse or operator flagged multiple times
- **Extreme Deviations:** Changes that are statistically implausible without error
- **Coordinated Behavior:** Multiple operators exhibit identical unusual patterns
- **Trust Signals:** Anomaly coincides with other trust/safety concerns (e.g., poor reviews, customer complaints)
- **Platform Impact:** Anomaly affects significant number of users or bookings

**Escalation Paths:**

- **Trust & Safety Team:** Potential policy violations or fraud
- **Engineering Team:** Suspected system bugs or data integrity issues
- **Product Team:** Market dynamics requiring product response
- **Legal/Compliance:** Potential regulatory concerns

**Reference:** DOC-106 (Trust & Safety Framework) for governance principles.

## 6.5. Feedback Loop

**Learning from Reviews:**

- **False Positive Tracking:** Which anomalies are most often false alarms?
- **Threshold Tuning:** Adjust rules to reduce noise without missing real issues
- **Pattern Recognition:** Identify common root causes of anomalies
- **Operator Education:** If many anomalies stem from confusion, improve onboarding/documentation

**Continuous Improvement:**

- Quarterly review of anomaly detection performance
- Metrics: False positive rate, time-to-review, action-taken rate
- Operator feedback on notifications (are they helpful or annoying?)
- Adjustment of detection rules and review processes

---

# 7. Relation to Other Documents

## 7.1. DOC-009: AI Core Design (CANONICAL)

**Relationship:**  
Anomaly detection is one potential use case within the broader AI Core framework. DOC-009 establishes that AI modules are **advisory and non-authoritative**.

**Alignment:**

- Anomaly detection adheres to the principle that AI provides insights, not decisions
- No AI module (including anomaly detection) has authority to modify platform state
- Human-in-the-loop philosophy from DOC-009 applies fully here

**Distinction:**  
DOC-009 covers all AI capabilities (chat assistant, content generation, price analytics). This document focuses narrowly on anomaly detection.

## 7.2. DOC-092: Warehouse Quality Score Algorithm (SUPPORTING)

**Relationship:**  
Warehouse quality scoring (if implemented) may use anomaly detection as one signal. Conversely, anomaly detection may reference quality scores when interpreting anomalies.

**Potential Integration (Post-MVP):**

- Persistent anomalies could negatively impact quality scores (conceptual, not committed)
- Low-quality warehouses might be monitored more closely for anomalies
- Anomaly detection findings could feed into quality score explainability

**Important Distinction:**

- DOC-092 describes a **scoring mechanism** (assigning quality values)
- DOC-013 describes a **detection mechanism** (identifying unusual patterns)
- Both are advisory; neither enforces actions

## 7.3. DOC-057: Monitoring & Observability Plan (CANONICAL)

**Relationship:**  
Anomaly detection extends platform observability by adding market-aware intelligence to operational monitoring.

**Integration Points:**

- Anomaly detection metrics logged through same infrastructure as system health metrics
- Dashboards (per DOC-057 § 4) may include anomaly detection panels
- Alert channels (per DOC-057 § 5) may distribute anomaly summaries
- Anomaly detection itself is monitored (detection latency, flagging rate)

**Distinction:**

- DOC-057 focuses on **system health** (API latency, error rates, DB performance)
- DOC-013 focuses on **market behavior** (pricing patterns, demand shifts)
- Both contribute to holistic platform observability

## 7.4. DOC-106: Trust & Safety Framework (SUPPORTING)

**Relationship:**  
Anomaly detection may surface signals relevant to trust and safety concerns, but does not implement trust/safety enforcement.

**Alignment:**

- Human-in-the-loop principle from DOC-106 applies to anomaly interpretation
- Fairness and transparency principles guide how anomalies are communicated to operators
- Escalation paths defined in § 6.4 align with DOC-106 governance

**Distinction:**

- DOC-106 defines **governance principles** for trust and safety
- DOC-013 defines a **detection tool** that may support trust/safety decisions
- Anomaly detection is an input to trust/safety processes, not the process itself

## 7.5. DOC-016: API Detailed Specification (CANONICAL)

**Relationship:**  
DOC-016 § 10.2 defines the AI Price Analytics endpoint, which provides pricing recommendations. Anomaly detection is conceptually separate.

**Distinction:**

- **Price Analytics (DOC-016):** Provides recommendations for what price to set
- **Anomaly Detection (DOC-013):** Identifies when current prices are unusual
- Price Analytics uses market data to suggest optimal prices; anomaly detection uses market data to flag deviations

**Potential Future Integration (Non-Binding):**

- Price Analytics could incorporate anomaly context ("market volatility high, recommendation confidence lower")
- Anomaly detection could trigger re-calculation of price recommendations
- Both remain independent features with separate purposes

## 7.6. Functional Specification & Architecture

**Alignment:**

- Anomaly detection does not introduce new core product features
- No changes to booking flows, search ranking, or user experience
- Platform architecture remains unchanged (no new services or databases required)
- Anomaly detection runs as a batch analysis module within existing backend infrastructure

**Non-Impact:**

- Database schema (DOC-050) does not require changes for MVP v1 anomaly detection
- API contracts (DOC-015) are not affected
- Frontend UX is not directly impacted (admin dashboard only)

---

# 8. Non-Goals & Explicit Exclusions

## 8.1. What Anomaly Detection Does NOT Do

**1. Automated Pricing Adjustments**

- Anomaly detection **does not** change prices set by operators
- It **does not** recommend specific price values
- It **does not** enforce pricing policies

**2. Automated Enforcement Actions**

- Anomaly detection **does not** suspend warehouse listings
- It **does not** disable operator accounts
- It **does not** restrict platform functionality

**3. Real-Time Decision Making**

- Anomaly detection **does not** operate in the booking request path
- It **does not** block transactions based on detected anomalies
- It **does not** provide real-time validation at the API level

**4. Demand Forecasting**

- Anomaly detection **does not** predict future demand
- It **does not** calculate booking probabilities
- It **does not** recommend inventory management strategies

**5. Autonomous AI**

- Anomaly detection **does not** make decisions without human oversight
- It **does not** learn from unlabeled data without validation
- It **does not** adapt its behavior automatically based on outcomes

## 8.2. Features Explicitly Deferred

**Post-MVP v2 (Possible but Not Committed):**

- Machine learning-based detection algorithms
- Adaptive thresholds that evolve with market conditions
- Cross-warehouse pattern analysis
- Integration with external market data sources
- Real-time (sub-hour) detection frequency

**Post-v2 (Future Exploration):**

- Causal inference (identifying why anomalies occur)
- Predictive anomaly scoring (likelihood of future anomalies)
- Multi-modal detection (combining price, demand, review, and operational signals)
- Operator benchmarking reports (comparative anomaly rates)

**Permanently Out of Scope:**

- Automated pricing enforcement
- Mandatory operator compliance with anomaly findings
- Anomaly-based dynamic pricing engines
- Fully autonomous AI decision-making

---

# 9. Risks & Safeguards

## 9.1. Risk: False Positives

**Description:**  
Legitimate market behavior flagged as anomalous, causing unnecessary operator concern or admin workload.

**Mitigation:**

- Conservative thresholds in MVP v1 (prefer false negatives over false positives)
- Human review required before any operator communication
- Operators can opt out of anomaly notifications
- Feedback loop to tune thresholds based on false positive rate

**Acceptable Level:**  
Target: <30% false positive rate in MVP v1, improving to <10% in v2.

## 9.2. Risk: False Negatives

**Description:**  
Genuine issues (data errors, problematic behavior) missed by detection system.

**Mitigation:**

- Multiple independent detection methods (threshold rules, peer comparisons, volatility measures)
- Operators can report suspected issues manually
- System bugs or data quality problems often surface through other channels (customer complaints, booking failures)

**Acceptance:**  
False negatives are less concerning than false positives in an advisory system. Missing an anomaly delays awareness but does not cause direct harm.

## 9.3. Risk: Misinterpretation

**Description:**  
Reviewers or operators misunderstand anomaly signals, leading to inappropriate actions.

**Mitigation:**

- Clear documentation and training for admin reviewers
- Operator communications emphasize informational nature ("we noticed" not "you must")
- Anomaly explanations include context (baseline, magnitude of deviation, frequency)
- Escalation path for ambiguous cases

## 9.4. Risk: Operator Overreaction

**Description:**  
Operators feel pressured to change prices in response to anomaly notifications, even when their strategy is intentional and legitimate.

**Mitigation:**

- Notifications explicitly state "no action required if intentional"
- Opt-out capability for operator notifications
- Communication tone emphasizes operator autonomy
- No penalty or consequence for anomalies themselves

## 9.5. Risk: Market Distortion

**Description:**  
Widespread awareness of anomaly detection causes operators to avoid legitimate pricing strategies for fear of triggering alerts.

**Mitigation:**

- Anomaly detection is not publicized to operators as a "policing" tool
- Notifications position platform as helpful assistant, not regulator
- No enforcement tied to anomaly flags
- Operators retain full pricing autonomy within platform policies

## 9.6. Risk: Data Privacy / Competitive Intelligence

**Description:**  
Anomaly detection reveals competitive insights that should remain confidential.

**Mitigation:**

- Peer comparisons use aggregated regional medians, not individual competitors
- Operator-facing reports show only their own data and aggregate benchmarks
- Admin reviewers bound by confidentiality policies
- No public anomaly data or leaderboards

## 9.7. Risk: Technical Failures

**Description:**  
Bugs in detection logic, data pipeline failures, or threshold misconfiguration lead to incorrect anomaly flags.

**Mitigation:**

- Anomaly detection itself is monitored (detection rate, processing time)
- Manual review catches obvious detection errors
- Anomaly detection is non-critical; failures do not impact core platform
- Gradual rollout with validation before full deployment

## 9.8. Safeguard: Audit Trail

**Implementation:**

- All anomaly detections logged with timestamp, warehouse, type, magnitude
- All human reviews logged with reviewer ID, decision, timestamp
- All operator communications logged
- Audit trail available for compliance, debugging, and improvement

**Purpose:**

- Accountability for human decisions
- Learning from review patterns
- Evidence for dispute resolution
- Compliance with data governance requirements

## 9.9. Safeguard: Kill Switch

**Implementation:**

- Anomaly detection can be disabled via feature flag without deployment
- Operator notifications can be paused independently
- Detection rules can be adjusted without code changes

**Use Cases:**

- High false positive rate requires immediate threshold adjustment
- Operator feedback indicates notifications are causing confusion
- Technical issue requires investigation
- Strategic decision to pause feature

---

# 10. Open Questions

## 10.1. MVP v1 Open Questions

**Q1: What specific threshold values should be used for MVP v1 rules?**

- Requires empirical calibration using historical platform data
- Depends on acceptable false positive rate and admin review capacity
- Should be validated through pilot testing before full rollout

**Q2: How should anomaly detection handle multi-operator warehouses?**

- If one operator changes price at a warehouse where multiple operators list boxes, how is this handled?
- Does each operator's listings get flagged independently?

**Q3: What is the optimal detection frequency for MVP v1?**

- Daily batch seems reasonable but should be validated against operational needs
- Should weekly or monthly aggregations be included in MVP v1?

**Q4: Should operators receive anomaly notifications by default, or should they opt-in?**

- User research needed to determine operator preferences
- Risk of alert fatigue vs. benefit of error detection

**Q5: What metrics define success for anomaly detection in MVP v1?**

- Time saved in data quality checks?
- Number of data errors caught?
- Operator satisfaction with notifications?

## 10.2. V2 Evolution Questions

**Q1: What labeled data is required to train supervised ML models?**

- Need historical anomalies with human-assigned labels (false positive, data error, concerning, etc.)
- How many examples are sufficient for initial model training?

**Q2: How should seasonal adjustment be implemented?**

- Simple seasonal decomposition (e.g., weekly/yearly patterns)?
- More sophisticated time series models?

**Q3: What external data sources would provide value?**

- Local economic indicators?
- Competitor pricing (if legally obtainable)?
- Weather, events, construction data?

**Q4: How should anomaly detection scale to multi-country/multi-region platform?**

- Should baselines be region-specific?
- How to handle currency and market structure differences?

**Q5: What is the path to "graduating" from supporting to production feature?**

- What criteria must be met before anomaly detection becomes a committed platform capability?
- What SLAs or SLOs would apply?

---

# Appendix A: Example Anomaly Scenarios

**Scenario 1: Data Entry Error**

- **Observation:** Warehouse price changes from 5,000 AED to 50,000 AED
- **Detection:** Flagged by "Large Price Change" rule (>50% increase)
- **Interpretation:** Likely typo (misplaced zero)
- **Action:** Contact operator to verify and correct

**Scenario 2: Seasonal Surge**

- **Observation:** Demand spikes 3x for warehouses near universities in September
- **Detection:** Flagged by "Demand Spike" rule
- **Interpretation:** Expected seasonal pattern (back-to-school)
- **Action:** Mark as false positive, adjust seasonal baseline for next year

**Scenario 3: Competitive Response**

- **Observation:** Warehouse lowers price by 30% after new competitor opens nearby
- **Detection:** Flagged by "Large Price Change" rule
- **Interpretation:** Legitimate competitive strategy
- **Action:** No action, log as market signal

**Scenario 4: Potential Manipulation**

- **Observation:** Three warehouses in the same area raise prices by exactly 40% on the same day
- **Detection:** Flagged by cross-warehouse pattern analysis (v2 only)
- **Interpretation:** Possible collusion or common external factor (e.g., all use same pricing consultant)
- **Action:** Investigate; may escalate to Trust & Safety

**Scenario 5: System Bug**

- **Observation:** Multiple warehouses show price = 0 for several hours
- **Detection:** Flagged by "Price Outlier" rule
- **Interpretation:** API bug or database issue
- **Action:** Escalate to Engineering, fix immediately, notify affected operators

---

# Appendix B: Relationship to Industry Practices

## B.1. E-Commerce Precedents

Many e-commerce platforms use anomaly detection for:

- Fraud detection (unusual purchase patterns)
- Inventory errors (impossible stock levels)
- Pricing errors (accidental $0.99 instead of $99.99)

**Lessons Learned:**

- High false positive rate is common and acceptable if caught early
- Automated corrections are risky without sophisticated models
- Human review remains standard practice even at large scale

## B.2. Financial Markets

Financial markets use anomaly detection for:

- Market manipulation detection
- Unusual trading patterns
- Flash crash prevention

**Differences from Self-Storage:**

- Financial markets have real-time requirements; self-storage does not
- Financial markets have clear regulatory requirements; self-storage pricing is largely unregulated
- Financial trading is much higher frequency than rental pricing changes

**Applicable Principles:**

- Human review for ambiguous cases
- Multi-signal detection approaches
- Transparency in detection methods

## B.3. Hotel and Vacation Rental Platforms

Similar platforms face similar challenges:

- Price volatility from dynamic pricing strategies
- Seasonal demand patterns
- Potential manipulation concerns

**Common Practices:**

- Peer benchmarking to identify outliers
- Data quality checks (e.g., preventing $0 listings)
- Operator education about platform norms

**Unanswered Questions:**

- Do leading platforms use ML-based detection?
- How do they balance operator autonomy with quality control?
- What enforcement actions (if any) follow from detected anomalies?

---

# Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Anomaly** | An observation that deviates significantly from expected patterns based on historical data and contextual norms. |
| **Baseline** | The expected or "normal" value against which deviations are measured (e.g., historical average, peer median). |
| **Deviation** | The difference between an observed value and its baseline, often expressed as percentage change or standard deviations. |
| **False Positive** | An anomaly flag for behavior that is actually normal or acceptable (no action required). |
| **False Negative** | Failure to detect an anomaly that exists (missed detection). |
| **Threshold** | The criterion for flagging an anomaly (e.g., ">50% price change" or ">2 standard deviations"). |
| **Signal** | A detected anomaly that may warrant human review. |
| **Advisory** | Providing information or recommendations without authority to enforce actions. |
| **Human-in-the-Loop** | Approach requiring human judgment and decision-making, with AI providing support but not autonomy. |
| **Batch Processing** | Analysis that runs periodically (e.g., daily) on accumulated data, as opposed to real-time processing. |

---

# Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Technical Documentation Team | Initial supporting specification for anomaly detection concept, MVP v1 → v2 evolution path |

---

**END OF DOCUMENT**
