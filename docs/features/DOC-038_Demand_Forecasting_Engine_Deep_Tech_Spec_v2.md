# DOC-038: Demand Forecasting Engine — Deep Tech Specification (MVP → v2)

**Self-Storage Aggregator Platform**

---

## Document Status

> **Document Status:** 🟡 Supporting / Non-Canonical  
> **Canonical:** ❌ No  
> **Production Mandatory:** ❌ No  
> **Phase:** Post-MVP / v2 Exploratory  
> **Last Updated:** December 18, 2025
>
> **CRITICAL NOTICE:**  
> This document is **CONCEPTUAL ONLY** and describes potential future approaches to demand forecasting.  
> It does NOT:
> - Define production requirements
> - Guarantee implementation
> - Establish accuracy targets or SLAs
> - Create business obligations
> - Influence MVP v1 architecture or features
>
> Forecasts, if implemented, would be **ADVISORY SIGNALS** only — not sources of truth.

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-038 |
| **Title** | Demand Forecasting Engine — Deep Tech Specification (v2) |
| **Version** | 1.0 |
| **Type** | Supporting / AI & Analytics Exploratory |
| **Status** | Non-Canonical |
| **Audience** | Product Leadership, Data Science, Engineering Leadership, Business Strategy |
| **Dependencies** | DOC-007 (AI Core Design), DOC-014 (Analytics), DOC-037 (Data Warehouse), DOC-092 (Quality Score) |
| **Scope** | Post-MVP v2 — Conceptual Exploration |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Demand Forecasting Philosophy](#2-demand-forecasting-philosophy)
3. [MVP v1 Baseline — No Forecasting](#3-mvp-v1-baseline--no-forecasting)
4. [Demand Signals (Conceptual Framework)](#4-demand-signals-conceptual-framework)
5. [Forecasting Use Cases (Advisory Only)](#5-forecasting-use-cases-advisory-only)
6. [Uncertainty & Confidence](#6-uncertainty--confidence)
7. [What the Engine Does NOT Do](#7-what-the-engine-does-not-do)
8. [Relation to Other AI & Analytics Documents](#8-relation-to-other-ai--analytics-documents)
9. [Non-Goals & Explicit Exclusions](#9-non-goals--explicit-exclusions)
10. [Risks & Misuse Scenarios](#10-risks--misuse-scenarios)
11. [Open Questions & Future Considerations](#11-open-questions--future-considerations)

---

# 1. Document Role & Scope

## 1.1. Purpose

This document explores **conceptual approaches** to demand forecasting for the Self-Storage Aggregator platform. It serves as a strategic reference for understanding:

- How demand signals might be interpreted in future platform versions
- The inherent limitations and uncertainties in predicting storage demand
- Why forecasting must remain advisory rather than authoritative
- Potential use cases that do NOT involve automated decision-making

**This document answers:** "How might the platform think about demand forecasting in v2, while maintaining appropriate skepticism and avoiding over-reliance on predictions?"

## 1.2. Document Type: Supporting / Non-Canonical

**This document is NOT:**
- ❌ A technical specification for production systems
- ❌ A machine learning architecture or model design
- ❌ An API specification for forecast endpoints
- ❌ A commitment to implement forecasting features
- ❌ A source of truth for business decisions

**This document IS:**
- ✅ A conceptual framework for thinking about demand
- ✅ An exploration of forecasting limitations and risks
- ✅ A reference for future product discussions
- ✅ A boundary-setting document to prevent over-optimization

**Canonical Authority:** This document defers to all CORE DOCUMENTS and must not contradict:
- DOC-001 (Functional Specification) — defines MVP scope
- DOC-007 (AI Core Design) — establishes AI principles
- DOC-037 (Data Warehouse & BI Planning) — defines data infrastructure
- All other canonical specifications

## 1.3. Scope: Post-MVP v2 Only

**MVP v1 Status:**
- ❌ Demand forecasting is **NOT IMPLEMENTED** in MVP v1
- ❌ No forecast-based features exist
- ❌ No ML models or training pipelines
- ❌ No forecast APIs or endpoints

**Post-MVP Consideration (v2+):**
- 🔵 Exploratory research into demand patterns
- 🔵 Advisory insights for internal planning only
- 🔵 Probabilistic signals, not deterministic outputs
- 🔵 Human interpretation required for all forecasts

**Timeline:** No implementation commitment. Forecasting capabilities would only be considered after:
1. Sufficient historical data accumulation (12+ months)
2. Demonstrated business need for demand insights
3. Clear understanding of forecast uncertainty
4. Explicit product specification for advisory use cases

## 1.4. Relationship to Business Operations

**Critical Principle:** Demand forecasting, if implemented, would **NEVER** directly control:
- ❌ Warehouse pricing
- ❌ Box availability
- ❌ Search ranking
- ❌ Booking confirmations
- ❌ Operator notifications
- ❌ User recommendations (beyond AI Box Finder)

**Permissible Uses (Advisory Only):**
- ✅ Internal capacity planning discussions
- ✅ Operator insights (optional, contextual)
- ✅ Platform team strategic analysis
- ✅ Trend exploration for product roadmap
- ✅ Data quality assessment

---

# 2. Demand Forecasting Philosophy

## 2.1. Core Principle: Forecasts Are Signals, Not Truth

**Fundamental Assumption:**  
All demand forecasts are **probabilistic estimates with inherent uncertainty**. They reflect patterns in historical data but cannot predict future behavior with certainty.

**Implications:**
- Forecasts must always include uncertainty bounds (confidence intervals)
- No forecast should be presented as definitive
- Decision-makers must understand forecast limitations
- Forecast errors are expected and normal

**Example Statement:**  
❌ "Demand will increase 15% next quarter"  
✅ "Based on past patterns, demand might increase 10-20% (65% confidence), but external factors could produce very different outcomes"

## 2.2. Uncertainty Is Default

**Principle of Epistemic Humility:**  
The platform acknowledges what it **cannot know**:
- Future macroeconomic conditions
- Competitor behavior changes
- Regulatory shifts affecting storage demand
- User preference evolution
- External shocks (weather, housing market changes, etc.)

**Design Implication:**  
Any forecasting system must:
1. Express uncertainty explicitly in outputs
2. Degrade gracefully when confidence is low
3. Default to "unknown" rather than low-confidence predictions
4. Avoid over-fitting to recent data

## 2.3. Human Interpretation Required

**No Automation of Decisions:**  
Forecasts are tools for human judgment, not autonomous decision-makers.

**Workflow:**
1. System generates forecast with uncertainty bounds
2. Human reviewers examine forecast + underlying data
3. Human applies domain knowledge and external context
4. Human makes decision (or chooses not to act)
5. System logs decision and forecast for retrospective analysis

**Prohibited:**
- Automatic price adjustments based on forecasts
- Automatic availability changes based on demand predictions
- Automatic operator notifications triggered by forecast thresholds

## 2.4. Separation of Concerns

**Principle:**  
Demand forecasting is **independent** from operational systems.

**Architecture Implication:**
- Forecasting runs in isolated analytical environment
- No direct write access to operational databases
- Read-only access to historical data snapshots
- Results stored separately from transactional systems
- Forecasts consumed via explicit human-initiated queries

**Goal:** Prevent forecast errors from cascading into operational failures.

---

# 3. MVP v1 Baseline — No Forecasting

## 3.1. What MVP Does (Historical Data Only)

**Data Collection:**
MVP v1 collects operational data for business operations:

- **Search Events:** User searches by location, size preferences, price filters
- **Booking Requests:** Start date, duration, box size, warehouse ID
- **Booking Outcomes:** Confirmed, cancelled (by user/operator), completed
- **User Behavior:** Page views, favorites, time-on-site (analytics)
- **Warehouse Metrics:** Occupancy rates, available inventory

**Purpose in MVP:** Operational functionality only — not analytics or forecasting.

**Storage:** Events logged to `events_log` table, bookings in `bookings` table per DOC-004 (Database Specification).

## 3.2. Analytics Scope in MVP

**MVP Analytics (Descriptive Only):**

Per DOC-014 (Analytics & Metrics), MVP provides:
- Basic booking counts
- Occupancy rate calculations
- Review summaries
- User counts

**Explicitly OUT of MVP:**
- ❌ Trend analysis
- ❌ Predictive metrics
- ❌ Demand pattern recognition
- ❌ Forecasting dashboards
- ❌ Seasonality detection

**Rationale:** MVP focuses on core functionality. Advanced analytics deferred to v2.

## 3.3. Post-MVP Prerequisites

**Before considering forecasting, platform must:**

1. **Sufficient Data Volume:**
   - Minimum 12 months of operational history
   - At least 1,000 completed bookings
   - Geographic diversity (multiple cities/regions)

2. **Data Quality:**
   - Clean booking lifecycle data
   - Accurate timestamps and status transitions
   - Minimal data integrity issues

3. **Analytical Infrastructure:**
   - Data warehouse operational (DOC-037)
   - ETL pipelines mature and tested
   - Historical data snapshots archived

4. **Business Clarity:**
   - Clear product use cases for demand insights
   - Defined stakeholders for forecast consumers
   - Risk acceptance for forecast errors

**Current Status:** None of these prerequisites met in MVP v1.

---

# 4. Demand Signals (Conceptual Framework)

## 4.1. What Are Demand Signals?

**Definition:**  
Demand signals are **observable indicators** that might correlate with future storage demand patterns. They are NOT predictors; they are data points that could inform probabilistic models.

**Important:** Identifying signals does NOT imply causation or guarantee predictive power.

## 4.2. Potential Signal Categories

### 4.2.1. Search Volume Signals

**Concept:**  
Search activity might indicate latent demand before bookings occur.

**Possible Indicators:**
- Search query frequency by location
- Box size preferences in searches
- Price range filters applied
- Date range patterns (near-term vs. future planning)

**Limitations:**
- Searches may not convert to bookings
- Search volume influenced by marketing campaigns
- Bot traffic or competitor research distorts signals
- Seasonal search spikes may not reflect actual demand

**Data Source:** `events_log` table (search events), if tracked.

### 4.2.2. Booking Attempt Signals

**Concept:**  
Booking requests (successful or failed) indicate active demand.

**Possible Indicators:**
- Booking submission frequency
- Requested start dates (demand timing)
- Requested durations (short-term vs. long-term)
- Box sizes most frequently requested
- Geographic demand concentration

**Limitations:**
- Bookings cancelled by operators != actual demand
- User-cancelled bookings may indicate price sensitivity, not demand disappearance
- Unfulfilled requests (unavailable boxes) indicate supply constraints, not demand patterns

**Data Source:** `bookings` table, booking state transitions (DOC-004).

### 4.2.3. Seasonal Patterns (Hypothetical)

**Concept:**  
Storage demand may exhibit seasonal variation.

**Possible Patterns:**
- Moving seasons (spring/summer in residential markets)
- End-of-year business needs
- Holiday storage peaks
- Academic year patterns (student storage)

**Critical Caveat:**  
Seasonality is **location-dependent** and may not generalize:
- Moscow patterns ≠ regional city patterns
- Business vs. residential storage have different cycles
- New market = no historical seasonal data

**Analysis Requirement:** Minimum 2-3 years of data to detect reliable seasonal patterns.

### 4.2.4. Geographic Demand Shifts

**Concept:**  
Demand may vary by location due to economic, demographic, or infrastructure changes.

**Possible Indicators:**
- New warehouse openings in area (supply response to demand)
- Booking density by neighborhood
- Price elasticity differences by region

**Limitations:**
- Supply changes (new warehouses) confound demand signals
- Migration patterns and neighborhood development are external factors
- Platform market share varies by region (incomplete demand picture)

### 4.2.5. External Economic Indicators (Not Platform Data)

**Concept:**  
Macroeconomic conditions may influence storage demand.

**Possible Indicators (Hypothetical):**
- Housing market activity (moves → storage needs)
- Commercial real estate trends (business storage)
- Disposable income changes
- Unemployment rates

**Critical Issue:**  
Platform does NOT collect economic data. Incorporating external indicators would require:
- Third-party data sources
- Attribution challenges (correlation ≠ causation)
- Regional granularity matching

**Status:** Out of scope for MVP and likely v2. Future consideration only.

## 4.3. Signal Reliability Assessment

**Question:** How reliable are these signals?

**Answer:** Unknown until tested with historical data.

**Approach (If Forecasting Pursued):**
1. Retrospective analysis: Do past signals correlate with subsequent bookings?
2. Segmentation: Do signals behave differently by region, box size, user type?
3. Stability testing: Do signal patterns change over time?
4. Noise filtering: Can spurious signals be identified and excluded?

**Expectation:** Many signals may have low predictive power. This is normal.

---

# 5. Forecasting Use Cases (Advisory Only)

## 5.1. Internal Capacity Planning

**Use Case:**  
Platform team explores demand trends to inform strategic discussions about market expansion or warehouse onboarding priorities.

**Example Scenario:**
- Data analysis suggests increasing search volume in Yekaterinburg
- Product team considers prioritizing operator recruitment in that region
- Decision remains human-driven; forecast is one input among many

**Forecast Output (Conceptual):**
- "Search activity in Yekaterinburg increased 25% quarter-over-quarter"
- "Confidence: Medium (based on 6 months of data)"
- "Recommendation: Monitor for 2 more quarters before strategic commitment"

**Critical:** This is **descriptive** (what happened) + **exploratory** (what might happen), not prescriptive.

## 5.2. Operator Insights (Optional, Contextual)

**Use Case:**  
Operators receive advisory insights about demand patterns in their area to inform their own business planning.

**Example Scenario:**
- Operator dashboard shows: "Search interest for XL boxes in your area increased 15% this month"
- Operator considers adding more XL inventory
- Decision entirely at operator's discretion

**Design Principles:**
- ✅ Present historical trends (descriptive)
- ✅ Suggest pattern (e.g., "seasonal peak observed in similar markets")
- ✅ Emphasize uncertainty ("this pattern may not repeat")
- ❌ Never command ("you should add 5 XL boxes")
- ❌ Never imply guaranteed outcomes ("this will increase your bookings")

**Risk Mitigation:**
- Clearly label insights as "informational only"
- Provide confidence bounds and data sources
- Allow operators to disable forecast features
- Monitor for operator dissatisfaction with forecast accuracy

## 5.3. Trend Exploration for Product Roadmap

**Use Case:**  
Product team examines demand signals to identify potential feature opportunities.

**Example Scenario:**
- Analysis shows frequent searches for "climate-controlled storage"
- Product team considers prioritizing climate control filters in search UI
- Decision informed by demand signal + user research + competitive analysis

**Forecast Role:** One signal among many; not deterministic.

## 5.4. Data Quality Assessment

**Use Case:**  
Anomalous demand forecasts reveal data quality issues.

**Example Scenario:**
- Forecast shows sudden demand spike in small city
- Investigation reveals: data logging error caused duplicate search events
- Issue fixed; data quality improved

**Value:** Forecasting failures can be diagnostic tools.

## 5.5. What Forecasting Does NOT Support

**Prohibited Use Cases:**

❌ **Automatic Pricing Adjustments:**  
Forecast predicts high demand → system raises prices automatically.  
**Why Prohibited:** Bypasses operator autonomy; creates liability for price gouging.

❌ **Inventory Hiding:**  
Forecast predicts low demand → system hides boxes from search.  
**Why Prohibited:** Manipulates availability; denies users access to legitimate inventory.

❌ **Search Ranking Manipulation:**  
Forecast influences which warehouses appear first.  
**Why Prohibited:** Conflicts with DOC-075/076 (Search Ranking); undermines user trust.

❌ **Booking Auto-Rejection:**  
Forecast predicts booking will be cancelled → system rejects preemptively.  
**Why Prohibited:** Discriminatory; violates user rights.

❌ **Operator Performance Penalties:**  
Forecast predicts low demand in operator's area → operator ranked lower.  
**Why Prohibited:** Punishes operators for external factors beyond their control.

---

# 6. Uncertainty & Confidence

## 6.1. Probabilistic Outputs Only

**Principle:**  
All forecasts must express uncertainty quantitatively.

**Required Elements:**
1. **Point Estimate:** Best guess (e.g., "15% demand increase")
2. **Confidence Interval:** Range of likely outcomes (e.g., "5-25% increase, 70% confidence")
3. **Data Basis:** What historical data informed the forecast (e.g., "based on 9 months of booking data")
4. **Limitations Statement:** Known blind spots (e.g., "excludes external economic shocks")

**Example Output (Conceptual):**
```
Forecast: Q1 2026 Demand in Moscow
- Point Estimate: 1,200 bookings
- 50% Confidence Interval: 1,000 - 1,400 bookings
- 80% Confidence Interval: 850 - 1,600 bookings
- Basis: Historical booking data Jan 2025 - Dec 2025
- Limitations: Does not account for competitor openings, macroeconomic changes, or marketing campaign effects
- Accuracy Note: Past forecast accuracy in this region: ±20% MAE
```

## 6.2. Wide Confidence Ranges Are Expected

**Reality Check:**  
Storage demand is influenced by many external factors beyond platform visibility. Narrow confidence intervals are unlikely and suspicious if claimed.

**Acceptable Range Examples:**
- 50% confidence interval: ±15-25% of point estimate
- 80% confidence interval: ±30-50% of point estimate
- 95% confidence interval: ±50-100% of point estimate

**Implication:** Forecasts are useful for detecting large trends (2x demand increase) but unreliable for precise planning (exact booking counts).

## 6.3. Forecast Accuracy Tracking

**If Forecasting Implemented:**  
Platform must track forecast performance retrospectively.

**Metrics (Conceptual):**
- **Mean Absolute Error (MAE):** Average magnitude of forecast errors
- **Mean Absolute Percentage Error (MAPE):** Error as % of actual value
- **Coverage:** What % of actual outcomes fell within forecast confidence intervals
- **Bias Detection:** Systematic over-prediction or under-prediction

**Transparency:**  
Forecast accuracy metrics must be shared with forecast consumers to calibrate trust.

**Expectation:** Forecast accuracy will be **moderate at best**. This is acceptable for advisory use cases.

## 6.4. Confidence Degradation

**Principle:**  
Forecast confidence decreases with:
- Time horizon (near-term forecasts > long-term)
- Data sparsity (new markets < established markets)
- External volatility (stable periods < crisis periods)

**Design Implication:**  
Forecasting system should detect low-confidence scenarios and **refuse to forecast** rather than output unreliable predictions.

**Example:**
- User: "What will demand be in Vladivostok next year?"
- System: "Insufficient historical data (only 3 months). Cannot generate reliable forecast. Check back after 12 months of operations."

---

# 7. What the Engine Does NOT Do

## 7.1. No Direct Business Actions

**Explicit Prohibitions:**

### 7.1.1. Pricing
❌ The forecast engine does NOT set, suggest, or modify warehouse prices.  
❌ It does NOT influence operator pricing decisions automatically.  
**Rationale:** Pricing is operator prerogative (DOC-011 Pricing Recommendation Engine is separate and also advisory).

### 7.1.2. Availability
❌ The forecast engine does NOT control which boxes are marked available.  
❌ It does NOT hide inventory based on demand predictions.  
**Rationale:** Inventory management is operator responsibility; hiding boxes denies user access.

### 7.1.3. Search Ranking
❌ The forecast engine does NOT influence search result ordering.  
❌ It is NOT an input to DOC-075/076 (Search Ranking Specification).  
**Rationale:** Search ranking is a separate canonical system; mixing forecast uncertainty into ranking degrades user experience.

### 7.1.4. Booking Confirmations
❌ The forecast engine does NOT approve or reject bookings.  
❌ It does NOT recommend rejecting bookings based on demand predictions.  
**Rationale:** Booking decisions are operator-human interactions; automated rejection is ethically problematic.

### 7.1.5. Operator Notifications
❌ The forecast engine does NOT trigger automated alerts or notifications to operators.  
❌ Operators can opt-in to view demand insights, but are never required to.  
**Rationale:** Avoid notification fatigue and preserve operator autonomy.

## 7.2. No Guaranteed Accuracy

**Explicit Statements:**

❌ The platform does NOT guarantee forecast accuracy.  
❌ Forecasts are **estimates** with inherent error.  
❌ Users, operators, and platform teams accept that forecasts may be wrong.  
❌ No SLAs or success metrics tied to forecast precision.

**Legal Implication:**  
Any forecast display must include disclaimer: "This forecast is an estimate based on historical data and may not reflect actual future demand. Use for informational purposes only."

## 7.3. No Real-Time Forecasting

**Scope Limitation:**

❌ Forecasts are NOT updated in real-time as new data arrives.  
❌ Forecast generation is a batch process (e.g., weekly or monthly updates).  
**Rationale:**  
- Real-time forecasting creates false urgency
- Frequent updates encourage over-reliance on forecasts
- Reduces system complexity and cost

**Design Implication:**  
Forecast timestamps must be displayed: "Forecast generated on December 1, 2025 using data through November 30, 2025."

## 7.4. No Individual User Predictions

**Privacy Boundary:**

❌ The forecast engine does NOT predict individual user behavior.  
❌ It does NOT profile users or target users based on demand predictions.  
**Rationale:**  
- Privacy protection (DOC-078 Security & Compliance)
- Avoid discriminatory targeting
- Focus on aggregate market-level patterns only

**Data Usage:**  
Forecasting uses anonymized, aggregated data only. No personally identifiable information.

## 7.5. No Optimization Engine

**Clarification:**

The Demand Forecasting Engine is NOT:
- ❌ A planning automation tool
- ❌ An optimization solver
- ❌ A recommendation engine (separate from AI Box Finder)
- ❌ A decision-making system

**It IS:**
- ✅ A signal detection tool
- ✅ An exploratory analytics module
- ✅ A trend visualization aid (if UI built)

---

# 8. Relation to Other AI & Analytics Documents

## 8.1. DOC-007: AI Core Design (CANONICAL)

**Relationship:**  
Demand forecasting aligns with AI Core principles:

- **Advisory Role:** DOC-007 establishes AI as advisory, not authoritative. Demand forecasting follows this principle strictly.
- **Graceful Degradation:** DOC-007 requires AI failures not to block workflows. Forecasting is optional; its absence does not impair platform operations.
- **Data Minimization:** DOC-007 limits AI data access. Forecasting uses aggregated historical data, not real-time operational data.
- **Non-Determinism Awareness:** DOC-007 acknowledges AI variability. Forecasting explicitly communicates uncertainty.

**Distinction:**  
DOC-007 covers MVP v1 AI features (Box Finder, Chat Assistant). Demand forecasting is post-MVP and non-canonical.

## 8.2. DOC-011: Pricing Recommendation Engine (Conceptual)

**Relationship:**  
Both are **advisory AI modules** but serve different purposes.

**Pricing Recommendation Engine (DOC-011):**
- Suggests optimal pricing for operators
- Uses competitive market data and warehouse features
- Direct operator-facing tool

**Demand Forecasting Engine (DOC-038):**
- Estimates future booking volumes
- Uses historical platform data
- Primarily internal/strategic tool; optionally operator-facing

**Integration Possibility (Future):**  
Pricing engine *might* consider demand forecasts as one input (e.g., "high forecasted demand → suggest premium pricing"). However:
- Both remain advisory
- Operator retains full control
- Cross-integration requires separate specification

**Status:** No integration planned in v2. Each module operates independently.

## 8.3. DOC-024: Box Size Recommendation (Conceptual)

**Relationship:**  
Both use AI but address different user needs.

**Box Size Recommendation (DOC-024):**
- Helps users select appropriate box size
- Operates at booking time, real-time
- User-facing feature in MVP v1

**Demand Forecasting Engine (DOC-038):**
- Analyzes aggregate market demand
- Operates in batch mode, periodic updates
- Internal/strategic tool in v2

**No Overlap:** These modules do not interact.

## 8.4. DOC-037: Data Warehouse & BI Planning (Supporting)

**Relationship:**  
Data warehouse is **prerequisite infrastructure** for demand forecasting.

**Dependencies:**
- Forecasting requires historical data snapshots (DOC-037 defines ETL pipelines)
- Analytical queries must not impact operational database (DOC-037 establishes separation)
- Forecast results may be stored in data warehouse for retrospective analysis

**Alignment:**  
Both documents assume **post-MVP** timeline and emphasize analytical separation from operational systems.

**Status:** DOC-037 must be implemented before DOC-038 becomes feasible.

## 8.5. DOC-092: Warehouse Quality Score Algorithm (Supporting)

**Relationship:**  
Both are **post-MVP analytical modules** exploring derived insights.

**Quality Score (DOC-092):**
- Assesses warehouse reliability and trustworthiness
- Uses operational metrics (bookings, reviews, response times)
- Supports trust and discovery features

**Demand Forecasting (DOC-038):**
- Estimates future booking volumes
- Uses search and booking patterns
- Supports strategic planning

**Possible Interaction (Hypothetical):**
- High-quality warehouses might correlate with stable demand
- Low-quality warehouses might experience demand volatility
- Demand forecasts could segment by quality tiers

**Status:** No integration planned. Both are exploratory.

## 8.6. DOC-014: Analytics & Metrics Tracking (Supporting)

**Relationship:**  
Analytics infrastructure provides **input data** for forecasting.

**Analytics Metrics (DOC-014):**
- Tracks descriptive metrics (bookings, occupancy, searches)
- Provides dashboards for operators and admin
- MVP v1 scope

**Demand Forecasting (DOC-038):**
- Consumes historical metrics as input
- Generates predictive estimates (post-MVP)
- Extends analytics from descriptive → exploratory

**Alignment:** Forecasting is natural evolution of analytics capabilities, but timeline remains post-MVP.

---

# 9. Non-Goals & Explicit Exclusions

## 9.1. Not a Prediction Service

**Exclusion:**  
This document does NOT design a production prediction API or service.

**Rationale:**  
Forecasting is exploratory. If product value is demonstrated, a separate canonical API specification (e.g., DOC-XXX: Demand Forecast API) would be required.

**What's Missing:**
- Endpoint definitions
- Request/response schemas
- Authentication requirements
- Rate limits
- SLAs

**Status:** Out of scope. No API commitment.

## 9.2. Not a Planning Authority

**Exclusion:**  
Forecasts are NOT authoritative inputs to operational planning.

**Prohibited:**
- ❌ Warehouse onboarding decisions MUST consider forecasts
- ❌ Operator inventory management MUST align with forecasts
- ❌ Platform capacity planning MUST use forecast-driven targets

**Permissible:**
- ✅ Forecasts MAY inform discussions as one data point
- ✅ Teams MAY explore forecasts to generate hypotheses
- ✅ Strategic reviews MAY reference demand trends

**Principle:** Forecasts are inputs, not requirements.

## 9.3. Not an Optimization Engine

**Exclusion:**  
This document does NOT design algorithms to optimize inventory, pricing, or resource allocation based on forecasts.

**Rationale:**  
Optimization requires:
- Clear business objectives (maximize revenue, occupancy, etc.)
- Validated forecasting accuracy
- Ethical review of automated decision impacts
- Legal and compliance clearance

**Status:** Optimization is post-v2, if ever pursued. Separate specification required.

## 9.4. Not Real-Time

**Exclusion:**  
No real-time forecasting, streaming analytics, or live demand dashboards.

**Rationale:**
- Real-time adds complexity without proportional value
- Storage demand changes slowly (not minute-by-minute)
- Batch processing sufficient for advisory use cases

**Scope:** Weekly or monthly forecast updates, if implemented.

## 9.5. Not an ML Production System

**Exclusion:**  
This document does NOT specify:
- Machine learning models or algorithms
- Training pipelines or retraining schedules
- Feature engineering processes
- Model evaluation frameworks
- MLOps infrastructure
- A/B testing strategies

**Rationale:**  
These are implementation details requiring separate technical specifications if forecasting proceeds.

**Status:** Out of scope. Conceptual exploration only.

## 9.6. Not a Revenue Driver

**Exclusion:**  
Forecasting is NOT positioned as a monetization feature.

**Prohibited:**
- ❌ Charge operators for access to demand forecasts
- ❌ Gate forecast insights behind premium tiers
- ❌ Use forecasts as competitive leverage over operators

**Permissible:**
- ✅ Provide forecast insights free to all operators (if implemented)
- ✅ Use demand analysis internally for strategic decisions

**Principle:** Forecasting serves platform strategy and operator enablement, not direct revenue.

---

# 10. Risks & Misuse Scenarios

## 10.1. Over-Trusting Forecasts

**Risk:**  
Decision-makers treat forecasts as certainties rather than probabilistic estimates.

**Manifestations:**
- "The forecast says demand will increase 20%, so we should aggressively recruit warehouses."
- "Forecast predicted low demand, so I won't invest in inventory expansion."
- "We missed targets because the forecast was wrong."

**Mitigation Strategies:**
1. **Explicit Uncertainty Communication:**  
   Always display confidence intervals, not just point estimates.

2. **Forecast Accuracy Transparency:**  
   Show historical forecast error rates alongside new forecasts.

3. **Decision Logging:**  
   Track which decisions were influenced by forecasts for retrospective review.

4. **Training:**  
   Educate internal teams and operators on interpreting probabilistic forecasts.

5. **Guardrails:**  
   Prohibit forecast-dependent automation (e.g., no auto-pricing based on forecasts).

## 10.2. Feedback Loops

**Risk:**  
Platform actions based on forecasts alter user behavior, making forecasts self-fulfilling or self-defeating.

**Example Scenario:**
1. Forecast predicts high demand in Region A
2. Platform prioritizes Region A in marketing campaigns
3. Demand increases in Region A due to marketing (not organic growth)
4. Forecast appears accurate, but causality is reversed

**Consequences:**
- Forecasts lose predictive value (measuring platform actions, not market demand)
- Resource allocation decisions based on distorted signals
- Other regions under-served due to misallocated effort

**Mitigation Strategies:**
1. **Distinguish Organic vs. Influenced Demand:**  
   Track marketing spend, platform feature launches, and external campaigns separately from demand forecasts.

2. **Counterfactual Analysis:**  
   "What would demand have been without our intervention?" (difficult but necessary).

3. **Avoid Forecast-Driven Marketing:**  
   Do NOT automatically increase marketing in high-forecasted-demand regions.

4. **Transparency:**  
   Acknowledge feedback loops in forecast documentation.

## 10.3. Biased Historical Data

**Risk:**  
Forecasts inherit biases present in historical data.

**Example Biases:**
- **Selection Bias:** Early adopters in Moscow ≠ future users in regional cities
- **Survivorship Bias:** Only successful warehouses remain in data; failed warehouses excluded
- **Temporal Bias:** Recent platform changes (new features, pricing) make old data less relevant

**Manifestations:**
- Forecasts overestimate demand in new regions (extrapolating Moscow growth)
- Forecasts ignore warehouse quality variation (assumes all warehouses perform like successful ones)
- Forecasts fail to adapt to platform evolution (using 2-year-old data to predict next quarter)

**Mitigation Strategies:**
1. **Segmentation:**  
   Separate forecasts by region, warehouse tier, user type to avoid over-generalization.

2. **Recency Weighting:**  
   Give more weight to recent data; downweight data from pre-feature-launch eras.

3. **Bias Testing:**  
   Analyze forecast errors by segment to detect systemic biases.

4. **Diverse Data Sources:**  
   Incorporate external data (e.g., regional economic indicators) to reduce platform-centric bias (future consideration).

## 10.4. Misinterpretation by Operators

**Risk:**  
Operators misunderstand forecast limitations and make poor business decisions.

**Example Scenario:**
- Operator sees "Demand forecast: +30% next quarter (wide confidence interval)"
- Operator interprets as guarantee and invests heavily in expansion
- Actual demand increases only 5%
- Operator faces financial strain, blames platform

**Consequences:**
- Operator dissatisfaction
- Legal liability claims (if forecasts framed as advice)
- Reputation damage to platform

**Mitigation Strategies:**
1. **Clear Disclaimers:**  
   All forecast displays include: "This is an estimate. Platform does not guarantee accuracy. Use at your own risk."

2. **Operator Education:**  
   Provide documentation on interpreting forecasts, understanding confidence intervals, and making risk-aware decisions.

3. **Opt-In Only:**  
   Operators must explicitly enable forecast insights (not default-on).

4. **Conservative Framing:**  
   Err on side of caution: "Demand may increase" > "Demand will increase"

5. **Feedback Mechanism:**  
   Allow operators to report when forecasts were misleading to improve future communication.

## 10.5. Data Sparsity in New Markets

**Risk:**  
Forecasts in newly launched regions are unreliable due to insufficient historical data.

**Manifestations:**
- High variance in forecasts (estimates fluctuate wildly with each new data point)
- Overconfidence in patterns that are statistical noise
- Inability to distinguish genuine trends from random variation

**Mitigation Strategies:**
1. **Minimum Data Thresholds:**  
   Do NOT generate forecasts for regions with <6 months of data and <100 bookings.

2. **Cold-Start Indicators:**  
   Label forecasts as "Low Confidence — New Market" when data is sparse.

3. **Transfer Learning (Advanced):**  
   Use patterns from similar markets to inform new market forecasts, but acknowledge uncertainty.

4. **Graceful Refusal:**  
   System states: "Insufficient data for reliable forecast. Check back in 6 months."

## 10.6. External Shocks and Black Swans

**Risk:**  
Unforeseen events (economic crises, pandemics, regulatory changes) render forecasts obsolete.

**Examples:**
- COVID-19 pandemic drastically altered storage demand patterns
- New competitor opens 20 warehouses in Moscow, flooding supply
- Housing market crash reduces relocation-driven storage needs

**Reality:**  
Forecasting models cannot predict black swan events. This is a fundamental limitation.

**Mitigation Strategies:**
1. **Acknowledge Blindness:**  
   Forecast documentation states: "This forecast does not account for unforeseeable events."

2. **Monitoring:**  
   Track forecast error rates; spike in errors may indicate external shock.

3. **Rapid Deprecation:**  
   If platform detects significant deviation from forecasts, suspend forecast generation until data patterns stabilize.

4. **Scenario Planning (Human-Driven):**  
   Forecasts provide baseline scenario; humans add "what-if" scenarios for risk management.

---

# 11. Open Questions & Future Considerations

## 11.1. Data Readiness

**Unresolved Questions:**

1. **Volume Sufficiency:**  
   How many bookings/searches are needed per region to generate reliable forecasts?  
   **Next Step:** Data audit after 12 months of MVP operation.

2. **Data Quality:**  
   Are current event logs complete and accurate?  
   **Next Step:** Data validation and cleaning protocols (DOC-037 dependency).

3. **Seasonal Baseline:**  
   Does demand exhibit clear seasonal patterns?  
   **Next Step:** Analyze year-over-year data (requires 2+ years of operations).

## 11.2. Regional Differences

**Unresolved Questions:**

1. **Normalization:**  
   Should forecasts be region-specific or platform-wide?  
   **Trade-off:** Region-specific = more accurate but requires more data per region.

2. **Cross-Region Learning:**  
   Can patterns in Moscow inform forecasts in smaller cities?  
   **Risk:** Over-generalization may mislead.

3. **Market Maturity:**  
   How do demand patterns differ between mature (established) and emerging markets?  
   **Next Step:** Segmentation analysis post-launch.

## 11.3. Forecast Granularity

**Unresolved Questions:**

1. **Temporal Resolution:**  
   Forecast weekly, monthly, or quarterly demand?  
   **Trade-off:** Shorter intervals = higher noise; longer intervals = less actionable.

2. **Geographic Resolution:**  
   Forecast by city, district, or individual warehouse?  
   **Trade-off:** Finer resolution = more useful but requires more data.

3. **Segment Resolution:**  
   Separate forecasts by box size, booking duration, user type?  
   **Trade-off:** Segmentation improves accuracy but increases complexity.

**Recommendation:** Start with coarse-grained forecasts (city-level, monthly) and refine only if demonstrated value.

## 11.4. Model Selection (Deferred)

**Unresolved Questions:**

1. **Statistical vs. ML:**  
   Use traditional time series models (ARIMA, exponential smoothing) or machine learning (LSTM, gradient boosting)?  
   **Decision Criteria:** Data volume, forecast horizon, interpretability requirements.

2. **Ensemble Approaches:**  
   Combine multiple models for robustness?  
   **Trade-off:** Improved accuracy vs. increased complexity.

3. **Interpretability:**  
   Can model outputs be explained to non-technical users?  
   **Priority:** High — operators need to understand "why" behind forecasts.

**Status:** Model selection is implementation detail, out of scope for this document.

## 11.5. Product-Market Fit

**Unresolved Questions:**

1. **User Need:**  
   Do operators actually want demand forecasts, or is this a solution looking for a problem?  
   **Next Step:** User research and operator interviews post-MVP.

2. **Actionability:**  
   If forecasts are provided, can operators act on them meaningfully?  
   **Risk:** Forecasts become "nice to know" without changing behavior.

3. **Willingness to Accept Uncertainty:**  
   Are operators comfortable with probabilistic forecasts, or do they expect certainties?  
   **Education Gap:** May require significant operator training.

**Recommendation:** Validate product need BEFORE investing in forecasting development.

## 11.6. Ethical and Legal Considerations

**Unresolved Questions:**

1. **Discrimination Risk:**  
   Could demand forecasts inadvertently disadvantage certain regions or warehouse types?  
   **Example:** Lower forecasts in low-income areas → less platform investment → self-fulfilling prophecy.

2. **Liability:**  
   If operator makes business decision based on platform forecast and loses money, is platform liable?  
   **Legal Review Required:** Terms of Service must include forecast disclaimers.

3. **Transparency:**  
   How much forecast methodology must be disclosed to operators and users?  
   **Balance:** Transparency builds trust; excessive detail may confuse.

**Status:** Legal review mandatory before any forecast feature launch.

## 11.7. Integration with Other Systems

**Unresolved Questions:**

1. **Search Ranking:**  
   Should demand forecasts influence DOC-075/076 (Search Ranking)?  
   **Current Stance:** No. Search ranking is canonical and should remain independent.  
   **Future Consideration:** If product value demonstrated, requires separate specification and risk analysis.

2. **Pricing Recommendations:**  
   Should demand forecasts feed into DOC-011 (Pricing Engine)?  
   **Current Stance:** Possible future integration, but each remains advisory.  
   **Requirement:** Separate integration specification + ethical review.

3. **Warehouse Onboarding:**  
   Should platform prioritize recruiting operators in high-forecasted-demand regions?  
   **Risk:** Creates feedback loop (see § 10.2).  
   **Approach:** Use forecasts as exploratory signal, not deterministic input.

**Recommendation:** Keep forecasting isolated initially. Consider integration only after 12+ months of operational experience.

---

# 12. Document Summary & Acceptance Criteria

## 12.1. Core Messages

**This document establishes:**

1. ✅ Demand forecasting is **NOT** in MVP v1
2. ✅ Forecasting, if pursued in v2, is **advisory** and **probabilistic**
3. ✅ Forecasts are **signals**, not truth
4. ✅ Uncertainty and limitations are **explicit** and **expected**
5. ✅ No automated actions based on forecasts
6. ✅ Human interpretation **required** for all forecast use
7. ✅ Forecasting does NOT influence pricing, availability, ranking, or bookings
8. ✅ Operator autonomy is **preserved**
9. ✅ Forecast errors are **normal** and **acceptable**
10. ✅ This is a **conceptual exploration**, not a production specification

## 12.2. Acceptance Criteria

**This document is successful if:**

✅ **Prevents Over-Expectation:**  
Stakeholders understand forecasting is post-MVP and non-binding.

✅ **Emphasizes Uncertainty:**  
All references to forecasts include probabilistic language and limitations.

✅ **Preserves Advisory Role:**  
No reader interprets forecasts as authoritative or automated.

✅ **Aligns with AI Principles:**  
Consistent with DOC-007 (AI Core Design) advisory philosophy.

✅ **Does Not Create Requirements:**  
No one treats this document as a production roadmap or feature commitment.

✅ **Identifies Risks:**  
Decision-makers understand potential misuse scenarios and mitigation strategies.

✅ **Supports Informed Decisions:**  
Provides conceptual framework for future product discussions if demand forecasting is considered.

## 12.3. Review and Approval

**Required Reviewers:**
- Product Leadership (confirms alignment with strategy)
- Data Science Lead (validates conceptual soundness)
- Engineering Leadership (confirms no production commitments implied)
- Legal/Compliance (confirms disclaimer adequacy)

**Review Cycle:**  
Annual or upon significant platform changes affecting data availability.

**Change Control:**  
Any modifications to forecasting philosophy or scope require:
1. Product Owner approval
2. Legal review (if liability implications)
3. Engineering architecture review (if integration with canonical systems)

---

# 13. Appendix: Terminology

## 13.1. Key Terms

**Demand Signal:**  
Observable data point (search, booking, review) that may correlate with future demand patterns. Not a prediction.

**Forecast:**  
Probabilistic estimate of future demand based on historical patterns. Includes uncertainty bounds.

**Confidence Interval:**  
Range within which actual outcome is likely to fall, with stated probability (e.g., 70% confidence).

**Advisory:**  
Providing information or recommendations without authority to enforce actions.

**Exploratory:**  
Investigation of patterns without commitment to act on findings.

**Non-Canonical:**  
Not a source of truth; supporting documentation only; does not create obligations.

**Point Estimate:**  
Single best-guess value (e.g., "1,200 bookings"), without uncertainty range. MUST be accompanied by confidence interval.

## 13.2. Acronyms

**MAE:** Mean Absolute Error — average magnitude of forecast errors  
**MAPE:** Mean Absolute Percentage Error — forecast error as percentage of actual  
**ETL:** Extract, Transform, Load — data pipeline process  
**ML:** Machine Learning  
**MVP:** Minimum Viable Product  
**v2:** Version 2 (post-MVP)  
**SLA:** Service Level Agreement (not applicable to forecasting)

---

# 14. Document Metadata

**Approved By:**  
- Product Owner: [Pending]
- Data Science Lead: [Pending]
- Engineering Leadership: [Pending]
- Legal/Compliance: [Pending]

**Review Cycle:**  
Annual or upon material platform changes

**Change History:**

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-12-18 | 1.0 | Documentation Team | Initial draft — conceptual demand forecasting exploration |

**Related Documents:**
- DOC-001: Functional Specification (MVP v1)
- DOC-007: AI Core Design (CANONICAL)
- DOC-011: Pricing Recommendation Engine (Conceptual)
- DOC-014: Analytics & Metrics Tracking
- DOC-024: Box Size Recommendation
- DOC-037: Data Warehouse & BI Planning
- DOC-092: Warehouse Quality Score Algorithm

---

**END OF DOCUMENT DOC-038**

**Demand Forecasting Engine — Deep Tech Specification (MVP → v2)**  
**Status:** Supporting / Non-Canonical / Conceptual Exploration  
**Phase:** Post-MVP v2  
**Last Updated:** December 18, 2025
