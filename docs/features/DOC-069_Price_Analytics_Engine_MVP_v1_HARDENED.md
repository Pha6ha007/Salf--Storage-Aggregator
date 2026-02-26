# DOC-069: Price Analytics Engine — Deep Specification (MVP v1)

**Self-Storage Aggregator Platform**

---

## Document Status

> **Document Status:** 🟡 Supporting / Analytics Deep Specification  
> **Canonical:** ❌ No  
> **Production Mandatory:** ❌ No  
> **Phase:** MVP v1 (Analytics Only)  
> **Last Updated:** December 17, 2025
>
> **CRITICAL:** This document describes analytical capabilities for price insights  
> and market positioning. This is NOT an automated pricing engine, NOT a revenue  
> optimization system, and does NOT make pricing decisions. All outputs are  
> advisory only and require human review.

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-069 |
| **Title** | Price Analytics Engine — Deep Specification (MVP v1) |
| **Version** | 1.0 (Hardened) |
| **Status** | Supporting / Non-Canonical |
| **Audience** | Backend Engineers, Analytics Team, Product Team |
| **Related Documents** | DOC-092 (Quality Score), DOC-105 (Risk/Fraud), DOC-063 (OX), DOC-059 (Multi-Region) |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Purpose & Context](#2-purpose--context)
3. [Analytical Capabilities](#3-analytical-capabilities)
4. [Data Sources & Inputs](#4-data-sources--inputs)
5. [Calculation Methods](#5-calculation-methods)
6. [Output Formats](#6-output-formats)
7. [Integration Points](#7-integration-points)
8. [Multi-Country Considerations](#8-multi-country-considerations)
9. [Limitations & Constraints](#9-limitations--constraints)
10. [Out of Scope for MVP v1](#10-out-of-scope-for-mvp-v1)
11. [Relationship to Canonical Documents](#11-relationship-to-canonical-documents)
12. [Non-Goals](#12-non-goals)

---

# 1. Document Role & Scope

## 1.1. Document Classification

**Type:** Supporting / Analytics Deep Specification  
**Canonical Status:** ❌ NO (This is a supporting document)  
**Implementation Priority:** Optional Enhancement (MVP v1)  
**Decision Authority:** This document provides analytical frameworks; it does NOT define product requirements or API contracts

## 1.2. What This Document IS

This document describes **analytical heuristics and statistical methods** for:

- Historical price analysis and trend detection
- Market positioning assessment (relative to comparable warehouses)
- Descriptive pricing insights for operators
- Internal dashboard metrics and reporting
- Supporting data for operator decision-making

**Key Principle:** This is a **decision-support system**, not a decision-making system.

## 1.3. What This Document is NOT

This document explicitly does NOT describe:

- ❌ **Automated Price Changes**: No system component automatically adjusts prices
- ❌ **AI-Driven Pricing**: No machine learning models optimize prices
- ❌ **Revenue Optimization**: No predictive revenue forecasting
- ❌ **Dynamic Surge Pricing**: No real-time price adjustments based on demand
- ❌ **Per-User Personalization**: No individualized pricing
- ❌ **Source of Truth for Billing**: Pricing data lives in canonical database schema
- ❌ **Mandatory Feature**: Platform functions fully without price analytics

## 1.4. Terminology Constraints

Throughout this document:

- ✅ **ALLOWED:** "analytical heuristics", "rule-based scoring", "statistical indicators", "comparative analysis", "descriptive insights"
- ❌ **FORBIDDEN:** "AI-driven", "smart pricing", "automatic optimization", "predictive models", "revenue maximization"

---

# 2. Purpose & Context

## 2.1. Business Context

Operators need visibility into market pricing to make informed decisions. The Price Analytics Engine provides **comparative context** and **descriptive statistics** to support these decisions.

**Use Cases:**
- Operator reviews their pricing relative to similar warehouses in their area
- Operator identifies whether they are priced significantly above/below market average
- Internal analytics team generates market reports
- Platform dashboards show pricing distribution trends

**Non-Use Cases:**
- System does NOT suggest specific price changes
- System does NOT enforce pricing strategies
- System does NOT optimize for revenue or occupancy

## 2.2. MVP v1 Scope Boundaries

**In Scope (MVP v1):**
- Historical price data aggregation
- Basic statistical comparisons (mean, median, percentiles)
- Market position calculation (relative ranking)
- Operator-facing insights dashboard
- Internal analytics queries

**Out of Scope (MVP v1):**
- Real-time competitor price tracking
- Automated repricing
- ML-based demand forecasting
- A/B pricing experiments
- Demand elasticity modeling
- Seasonal trend prediction

## 2.3. Relationship to AI Core

**Reference:** DOC-009 (AI Core Design MVP v1)

The AI Core document defines:
- **§4.2 Pricing Intelligence** module (conceptual, optional)

**Important Distinctions:**

| Aspect | AI Core (DOC-009) | Price Analytics Engine (DOC-069) |
|--------|-------------------|----------------------------------|
| **Nature** | Conceptual AI module design | Statistical analysis engine |
| **Implementation** | May invoke external AI APIs | Uses SQL aggregations and rules |
| **Scope** | Advisory market insights | Descriptive pricing statistics |
| **Decisions** | Provides recommendations | Provides raw data |
| **Authority** | DOC-009 is CANONICAL | DOC-069 is SUPPORTING |

**Alignment:** If AI-based pricing insights are implemented per DOC-009 §4.2, they would:
1. Consume data from the Price Analytics Engine
2. Add interpretive layer on top of statistical outputs
3. Remain advisory only (no automatic price changes)

---

# 3. Analytical Capabilities

## 3.1. Historical Price Analysis

### 3.1.1. Price History Tracking

**Data Source:** `boxes` table, `events_log` table (price change events)

**Capabilities:**
- Track price changes over time for individual boxes
- Aggregate pricing trends at warehouse level
- Calculate average price duration (time between changes)
- Identify pricing volatility (frequency of changes)

**Output:**
- Time-series data of price changes
- Simple statistics (min, max, average price over period)
- Duration metrics (days since last price change)

**Limitations:**
- No predictive forecasting
- No cause-effect analysis
- No external market data correlation

### 3.1.2. Price Trend Detection

**Method:** Rule-based heuristics (NOT machine learning)

**Simple Trend Indicators:**
- Upward trend: Price increased X% over last Y months
- Downward trend: Price decreased X% over last Y months
- Stable: Price unchanged or <5% variance over period
- Volatile: >3 price changes in last 30 days

**Thresholds (Configurable):**
```yaml
trend_thresholds:
  significant_change_percent: 10  # 10% change is "significant"
  analysis_window_days: 90         # Analyze last 90 days
  volatility_threshold: 3          # >3 changes = volatile
```

**Important:** These are descriptive labels, not prescriptive recommendations.

## 3.2. Market Position Assessment

### 3.2.1. Comparable Warehouse Identification

**Method:** Rule-based filtering

**Comparability Criteria:**
1. **Geographic Proximity:** Within N kilometers (configurable per region)
2. **Size Category:** Same box size category (small/medium/large)
3. **Feature Similarity:** Similar amenity count (±2 features)
4. **Active Status:** Only active, non-archived warehouses

**SQL Example:**
```sql
SELECT w2.id, w2.name, b2.price
FROM warehouses w2
JOIN boxes b2 ON w2.id = b2.warehouse_id
WHERE 
  ST_DWithin(w2.coordinates, $current_warehouse_coords, $radius_meters)
  AND b2.size_category = $target_size_category
  AND b2.archived_at IS NULL
  AND w2.status = 'published'
```

**Limitations:**
- Does NOT account for brand reputation
- Does NOT account for occupancy rates
- Does NOT account for seasonal factors
- Does NOT account for operator cost structures

### 3.2.2. Statistical Comparisons

**Calculations (for comparable set):**

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **Market Average** | `SUM(price) / COUNT(*)` | Mean price in comparison set |
| **Market Median** | `PERCENTILE_CONT(0.5)` | Middle price (robust to outliers) |
| **Percentile Rank** | Position in sorted set | "You're in top X% of prices" |
| **Price Spread** | `MAX - MIN` | Range of market prices |
| **Standard Deviation** | `STDDEV(price)` | Price variance indicator |

**Example Output:**
```json
{
  "current_price": 5000,
  "market_average": 4800,
  "market_median": 4700,
  "percentile": 55,
  "comparison_set_size": 23,
  "price_spread": {
    "min": 3500,
    "max": 7200
  }
}
```

**Human-Readable Label (Rule-Based):**
- `percentile < 30` → "Below Market Average"
- `percentile 30-70` → "Market Average"
- `percentile > 70` → "Above Market Average"

**Important:** These labels are descriptive, NOT prescriptive.

## 3.3. Anomaly Detection

**Method:** Simple statistical outlier detection (NOT ML)

**Outlier Definition:**
- Price > `Q3 + 1.5 * IQR` (unusually high)
- Price < `Q1 - 1.5 * IQR` (unusually low)

Where:
- `Q1` = 25th percentile
- `Q3` = 75th percentile
- `IQR` = Interquartile Range (`Q3 - Q1`)

**Purpose:**
- Flag prices that are statistical outliers
- Help operators review potentially erroneous prices
- Highlight extreme market positioning

**Non-Purpose:**
- Does NOT imply price is "wrong"
- Does NOT suggest correction
- Does NOT enforce pricing policies

---

# 4. Data Sources & Inputs

## 4.1. Primary Data Sources

**Source:** Canonical Database Schema (DOC-004)

| Table | Fields Used | Purpose |
|-------|-------------|---------|
| **warehouses** | `id`, `coordinates`, `status`, `operator_id` | Warehouse identification and filtering |
| **boxes** | `id`, `warehouse_id`, `size_category`, `price`, `archived_at` | Current pricing data |
| **events_log** | `event_name='box.price_changed'`, `payload`, `created_at` | Historical price changes |
| **operators** | `id`, `legal_address` | Region resolution (via DOC-059) |

**Important:** Price Analytics Engine does NOT create new tables or modify existing schemas.

## 4.2. Derived Metrics

**Source:** Aggregations of primary data

**Examples:**
- Average price per box size category
- Warehouse-level average price
- Price change frequency
- Days since last price change

**Storage:** Computed on-demand or cached in Redis (NOT stored in PostgreSQL)

## 4.3. External Data (Out of Scope for MVP v1)

**NOT Included in MVP:**
- Competitor price scraping
- Real-time market data feeds
- Economic indicators (inflation, interest rates)
- Occupancy rate correlations
- Customer demographic data

---

# 5. Calculation Methods

## 5.1. Market Average Calculation

**Algorithm:** Simple arithmetic mean

**Pseudocode:**
```python
def calculate_market_average(comparable_boxes: List[Box]) -> float:
    """
    Calculate simple arithmetic mean of comparable box prices.
    
    Rule-Based Heuristic (NO ML):
    - Filter out outliers beyond 3 standard deviations (optional)
    - Return mean of remaining prices
    """
    if len(comparable_boxes) < 3:
        return None  # Insufficient data
    
    prices = [box.price for box in comparable_boxes]
    
    # Optional outlier filtering
    mean = sum(prices) / len(prices)
    std_dev = calculate_std_dev(prices)
    filtered_prices = [p for p in prices if abs(p - mean) <= 3 * std_dev]
    
    return sum(filtered_prices) / len(filtered_prices)
```

**Confidence Indicators:**
- High confidence: `n >= 20` comparable boxes
- Medium confidence: `10 <= n < 20`
- Low confidence: `3 <= n < 10`
- Insufficient data: `n < 3`

## 5.2. Percentile Ranking

**Algorithm:** Standard percentile calculation

**Pseudocode:**
```python
def calculate_percentile_rank(current_price: float, comparable_prices: List[float]) -> int:
    """
    Calculate percentile rank (0-100).
    
    Statistical Method (NO ML):
    - Sort all prices (including current)
    - Find position of current price
    - Return percentile
    """
    sorted_prices = sorted(comparable_prices + [current_price])
    position = sorted_prices.index(current_price)
    percentile = int((position / len(sorted_prices)) * 100)
    return percentile
```

## 5.3. Trend Calculation

**Algorithm:** Simple linear comparison

**Pseudocode:**
```python
def calculate_simple_trend(price_history: List[PriceChange], window_days: int = 90) -> str:
    """
    Determine simple price trend over time window.
    
    Rule-Based Logic (NO ML):
    - Compare first price in window to last price
    - Apply threshold rules
    """
    recent_changes = filter_by_date_range(price_history, days=window_days)
    
    if len(recent_changes) < 2:
        return "insufficient_data"
    
    first_price = recent_changes[0].price
    last_price = recent_changes[-1].price
    change_percent = ((last_price - first_price) / first_price) * 100
    
    if change_percent > 10:
        return "upward"
    elif change_percent < -10:
        return "downward"
    else:
        return "stable"
```

---

# 6. Output Formats

## 6.1. Operator Dashboard Insights

**Display Location:** Operator dashboard (DOC-063 §6 — Pricing UX)

**Example Output:**
```json
{
  "warehouse_id": 101,
  "box_id": 501,
  "analysis_date": "2025-12-17T10:00:00Z",
  "current_price": 5000,
  "market_position": {
    "label": "Above Market Average",
    "percentile": 65,
    "confidence": "high"
  },
  "market_statistics": {
    "average": 4600,
    "median": 4500,
    "comparison_set_size": 27,
    "min": 3200,
    "max": 7500
  },
  "trend": {
    "direction": "stable",
    "analysis_window_days": 90,
    "changes_count": 1
  },
  "anomaly_flag": false
}
```

**Important:** All values are descriptive. NO "suggested_price" or "recommended_action" fields.

## 6.2. Internal Analytics Queries

**Purpose:** Platform analytics team generates reports

**Example Queries:**
- Price distribution by city
- Average price by box size category
- Price volatility by operator
- Market segmentation analysis

**Output:** CSV exports, SQL query results, BI tool visualizations

**Not Included:**
- Predictive models
- Revenue forecasting
- Operator performance scoring
- Automated alerts/recommendations

## 6.3. API Response Format (Optional)

**Note:** API endpoints for price analytics are OPTIONAL in MVP v1 and NOT defined in DOC-003 (API Design Blueprint).

**If Implemented:**
```http
GET /api/v1/operator/analytics/pricing?warehouse_id={id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pricing_analysis": { /* same structure as § 6.1 */ }
  },
  "meta": {
    "timestamp": "2025-12-17T10:00:00Z"
  }
}
```

**Rate Limiting:** 20 requests per hour per operator (per DOC-007 Rate Limiting Spec)

---

# 7. Integration Points

## 7.1. Integration with Canonical Systems

### 7.1.1. Database Schema (DOC-004)

**Relationship:** Read-only consumer

- Price Analytics Engine queries existing tables
- Does NOT create new tables or columns
- Does NOT modify pricing data
- Respects database constraints and indexes

### 7.1.2. API Blueprint (DOC-003)

**Relationship:** Optional extension

- MVP v1 API does NOT include price analytics endpoints
- If added post-MVP, requires DOC-003 update
- Must follow canonical API patterns (error handling, auth, rate limits)

### 7.1.3. Operator Experience (DOC-063)

**Relationship:** Provides data for UX

**Reference:** DOC-063 §6 — Pricing UX

**Integration:**
- Price Analytics Engine supplies data for operator dashboard
- Operator sees market position insights
- Operator makes pricing decisions based on insights
- System does NOT suggest specific prices

**Important:** DOC-063 marks pricing insights as "optional, subject to implementation."

### 7.1.4. AI Core (DOC-009)

**Relationship:** May provide input data

**Reference:** DOC-009 §4.2 — Pricing Intelligence (Conceptual)

**Potential Integration:**
- If AI Pricing Intelligence is implemented (post-MVP), it MAY:
  - Consume statistical outputs from Price Analytics Engine
  - Add interpretive layer using LLM
  - Generate natural language explanations
  - Remain advisory only (no automatic actions)

**Guardrails:**
- AI outputs must be clearly labeled as "AI-generated"
- Must include confidence indicators
- Must allow operator override
- Must gracefully degrade if AI unavailable

## 7.2. Separation from Quality Score (DOC-092)

**Critical Distinction:**

| Aspect | Price Analytics (DOC-069) | Quality Score (DOC-092) |
|--------|---------------------------|-------------------------|
| **Purpose** | Pricing market position | Warehouse trustworthiness |
| **Inputs** | Price data only | Multi-signal composite |
| **Outputs** | Price comparisons | Quality score (0-100) |
| **Scope** | MVP v1 (optional) | Post-MVP (v2) |
| **Decision Type** | Pricing decisions | Trust/ranking decisions |

**NO Overlap:**
- Price Analytics does NOT influence quality scores
- Quality scores do NOT affect price analytics
- These are separate analytical domains

**Reference:** DOC-092 §3 — Quality Signal Categories (does NOT include pricing signals)

## 7.3. Separation from Risk Scoring (DOC-105)

**Critical Distinction:**

| Aspect | Price Analytics (DOC-069) | Risk Scoring (DOC-105) |
|--------|---------------------------|------------------------|
| **Purpose** | Market pricing insights | Fraud/risk detection |
| **Triggers** | Operator-initiated queries | Real-time event analysis |
| **Consequences** | Informational only | May flag for review |
| **Scope** | Pricing domain | Security domain |

**NO Overlap:**
- Unusual pricing does NOT trigger risk flags
- Risk scores do NOT affect price analytics
- Separate analytical pipelines

---

# 8. Multi-Country Considerations

**Reference:** DOC-059 — Multi-Country & Multi-Region Technical Architecture

## 8.1. Currency Agnostic Design

**Principle:** Price Analytics Engine works with numeric values, NOT currencies.

**Implementation:**
- All calculations use raw numeric values
- Currency symbol/formatting handled by frontend
- No hardcoded currency conversions
- No assumptions about decimal places

**Example (WRONG):**
```python
# ❌ DO NOT DO THIS
if price > 5000:  # Assumes AED
    return "expensive"
```

**Example (CORRECT):**
```python
# ✅ Currency-agnostic comparison
if price > market_median * 1.5:
    return "above_market_threshold"
```

## 8.2. Regional Configuration

**Approach:** Configuration over code

**Configuration Example:**
```yaml
region_config:
  REGION_A:
    currency: "RUB"
    proximity_radius_km: 10
    comparison_min_size: 5
  REGION_B:
    currency: "USD"
    proximity_radius_km: 15
    comparison_min_size: 3
```

**Usage:**
- Load region config based on operator location
- Apply region-specific thresholds
- Do NOT branch on region name in business logic

**Reference:** DOC-059 §3.3 — Configuration Over Code Branching

## 8.3. No Hardcoded Taxes or Policies

**Forbidden:**
```python
# ❌ DO NOT hardcode regional rules
if region == "REGION_A":
    vat_rate = 0.20
    deposit_percent = 0.30
```

**Correct:**
```python
# ✅ Load from policy engine
policy = policy_engine.get_region_policy(region_context)
vat_rate = policy.vat_rate
deposit_percent = policy.deposit_percent
```

**Reference:** DOC-059 §5.2 — Policy Engine

---

# 9. Limitations & Constraints

## 9.1. Data Quality Limitations

**Known Issues:**
1. **Sparse Data:** New warehouses lack price history
2. **Outliers:** Extreme prices distort averages
3. **Inactive Boxes:** Archived boxes skew historical data
4. **Seasonal Effects:** Not accounted for in simple trends

**Mitigation:**
- Confidence indicators warn about insufficient data
- Outlier filtering optional (configurable)
- Filter out archived boxes
- Future: Seasonal adjustment models (post-MVP)

## 9.2. Comparison Limitations

**What Comparisons DO NOT Account For:**
- Brand/reputation differences
- Operational cost structures
- Occupancy rates
- Customer demographics
- Seasonal demand patterns
- Marketing effectiveness

**Implication:** Market position is based on price alone, not value.

## 9.3. Performance Constraints

**Query Performance:**
- Market position calculation requires scanning comparable warehouses
- May be slow for dense urban areas (100+ warehouses in radius)

**Optimization:**
- Cache comparison sets (TTL: 1 hour)
- Pre-compute aggregates for common queries
- Use spatial indexes (PostGIS) for proximity filtering

**Monitoring:** Track query execution time, set alerts for >2s queries

## 9.4. No Real-Time Updates

**Important:** Price Analytics Engine is NOT real-time.

**Update Frequency:**
- Aggregates refreshed hourly (configurable)
- Operator dashboard data cached for 30 minutes
- Price change events processed asynchronously

**Implication:** Operator may see stale market data (up to 1 hour old).

---

# 10. Out of Scope for MVP v1

## 10.1. Explicitly Excluded Features

**The following are NOT implemented in MVP v1 and are forbidden from implementation:**

| Feature | Reason | Earliest Version |
|---------|--------|------------------|
| **Automated Repricing** | Violates advisory-only principle | v2+ (requires product spec) |
| **ML-Based Forecasting** | Requires training data and infrastructure | v2+ |
| **Real-Time Competitor Tracking** | Requires web scraping / external data | v2+ |
| **A/B Pricing Experiments** | Requires experimentation framework | v1.2+ |
| **Demand Elasticity Modeling** | Requires occupancy data correlation | v2+ |
| **Revenue Optimization** | Predictive, not descriptive | v2+ |
| **Dynamic Surge Pricing** | Real-time demand-based adjustments | Never (product decision) |
| **Per-User Personalization** | Individualized pricing | Never (ethical/legal concerns) |
| **Automatic Discounts** | Requires discount engine | v1.1+ |
| **Price Recommendations with "Suggest" Button** | Too prescriptive | v2+ (requires UX research) |

## 10.2. Future Enhancements (Conceptual)

**Potential v2 Features (NOT commitments):**
- Seasonal trend analysis
- Correlation with occupancy rates
- Multi-factor pricing models
- Advanced anomaly detection (ML-based)
- Predictive demand forecasting

**Requirements Before Implementation:**
1. Update this document with detailed specifications
2. Update DOC-003 (API Blueprint) with new endpoints
3. Product team approval
4. Security/privacy review
5. A/B testing plan

---

# 11. Relationship to Canonical Documents

## 11.1. Functional Specification (DOC-001)

**Relationship:**
- DOC-001 defines product requirements; DOC-069 describes analytical implementation
- DOC-001 does NOT mandate price analytics in MVP v1
- Price analytics is an optional enhancement supporting operator experience

**Conflict Resolution:**
- If DOC-001 explicitly excludes a feature, DOC-069 must comply
- DOC-001 is higher authority

## 11.2. Technical Architecture (DOC-002)

**Relationship:**
- Price Analytics Engine is a backend module within NestJS monolith
- Not a separate microservice
- Follows same architectural patterns (controllers → services → repositories)

**Compliance:**
- Uses existing database connections
- Follows error handling patterns (DOC-006)
- Follows logging patterns (DOC-008)

## 11.3. API Design Blueprint (DOC-003)

**Relationship:**
- DOC-003 is canonical for all API endpoints
- Price analytics endpoints NOT defined in MVP v1 API
- If added, must be specified in DOC-003 first

**Important:** Do NOT implement price analytics API endpoints without updating DOC-003.

## 11.4. Database Specification (DOC-004)

**Relationship:**
- Price Analytics Engine is read-only consumer
- Does NOT create new tables or columns
- Uses existing schema: `warehouses`, `boxes`, `events_log`

**Compliance:**
- Respects database constraints
- Uses spatial indexes (PostGIS) for proximity queries
- Does NOT modify pricing data

## 11.5. Security & Compliance (DOC-036/DOC-078)

**Relationship:**
- Price analytics respects data protection regulations
- Does NOT expose competitor-specific data to operators
- Aggregated data only (no individual warehouse identification without permission)

**Compliance:**
- GDPR: Anonymized comparisons
- Anti-competitive: No price-fixing facilitation
- Transparency: Operators informed of comparison methodology

## 11.6. AI Core Design (DOC-009)

**Relationship:**
- DOC-009 §4.2 defines conceptual Pricing Intelligence module
- DOC-069 describes statistical foundation
- If AI layer added, it consumes DOC-069 outputs

**Hierarchy:**
- DOC-009 is CANONICAL (architectural intent)
- DOC-069 is SUPPORTING (implementation detail)

## 11.7. Operator Experience (DOC-063)

**Relationship:**
- DOC-063 §6 references pricing UX features
- DOC-069 provides backend data for those features
- DOC-063 marks features as "optional, subject to implementation"

**Integration:**
- Operator dashboard displays price analytics
- Operator makes decisions based on insights
- System does NOT auto-adjust prices

## 11.8. Warehouse Quality Score (DOC-092)

**Relationship:**
- DOC-092 is separate analytical domain (quality/trust)
- DOC-069 is pricing domain
- NO overlap in signals or scoring

**Critical Separation:**
- Price does NOT affect quality score
- Quality score does NOT affect price analytics
- Independent analytical pipelines

## 11.9. Multi-Region Architecture (DOC-059)

**Relationship:**
- DOC-069 complies with multi-region principles
- Currency-agnostic calculations
- Configuration-driven regional behavior
- No hardcoded regional logic

**Compliance:**
- §3.3 Configuration Over Code: ✅ Compliant
- §4 Region as Domain Concept: ✅ Compliant
- §5.2 Policy Engine: ✅ Respects policies

---

# 12. Non-Goals

## 12.1. What This Document Does NOT Define

1. **API Contracts:**
   - No endpoints defined (see DOC-003 for canonical APIs)
   - No request/response schemas mandated

2. **UI/UX Specifications:**
   - No dashboard mockups (see DOC-063 for operator UX)
   - No wireframes or interaction flows

3. **Infrastructure:**
   - No deployment specifications
   - No caching strategies (implementation detail)
   - No database indexes (DBA responsibility)

4. **Business Rules:**
   - No pricing strategies enforced
   - No revenue targets
   - No operator performance metrics

5. **Legal/Compliance:**
   - No anti-competitive determinations
   - No price-fixing liability assessments
   - No regulatory guidance

6. **Machine Learning:**
   - No ML model architectures
   - No training procedures
   - No feature engineering specifications

## 12.2. Explicitly NOT Implemented

**Never in Platform:**
- Collusion facilitation (illegal)
- Synchronized pricing across operators
- Enforced pricing floors/ceilings
- Revenue-sharing models

**Post-MVP Only (Requires Product Decision):**
- Automatic price updates
- Predictive revenue forecasting
- Demand-based dynamic pricing
- Real-time competitor monitoring

---

# 13. Open Questions

**Issues Requiring Resolution Before Full Implementation:**

## 13.1. Data Readiness

**Questions:**
- What is the current price data distribution?
- How many warehouses per city on average?
- What is typical comparison set size?
- How frequently do operators change prices?

**Next Steps:**
- Data audit of production database
- Analyze price change frequency
- Determine if sufficient data exists for meaningful comparisons

## 13.2. Operator Acceptance

**Questions:**
- Do operators want price analytics?
- How do operators currently research pricing?
- What level of detail is useful vs. overwhelming?
- Should insights be push (dashboard) or pull (on-demand)?

**Next Steps:**
- User research with operators
- Prototype dashboard mockups
- A/B test analytics visibility

## 13.3. Competitive Concerns

**Questions:**
- Does showing market averages facilitate price-fixing?
- Should comparisons be anonymized?
- What level of aggregation is safe?
- Are there regional legal differences?

**Next Steps:**
- Legal review of feature
- Define minimum comparison set size (e.g., >5 warehouses)
- Consult competition law experts per region

## 13.4. Performance Viability

**Questions:**
- Can proximity queries scale to 100+ warehouses?
- What is acceptable query latency?
- Should aggregates be pre-computed?
- What is caching strategy?

**Next Steps:**
- Performance testing with realistic data volumes
- Profile SQL query execution plans
- Design caching architecture

---

# Appendix A: Example Calculations

## A.1. Simple Market Average

**Scenario:** Operator wants to see market position for 10m² box priced at 5000 AED.

**Step 1: Identify Comparable Boxes**
```sql
SELECT b.id, b.price
FROM boxes b
JOIN warehouses w ON b.warehouse_id = w.id
WHERE 
  b.size_category = 'medium'  -- 10m²
  AND ST_DWithin(w.coordinates, ST_Point(37.6173, 55.7558), 10000)  -- 10km radius
  AND b.archived_at IS NULL
  AND w.status = 'published';
```

**Result:** 27 comparable boxes

**Step 2: Calculate Statistics**
```python
prices = [4200, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, ...]  # 27 prices

market_average = sum(prices) / len(prices)  # 4850 AED
market_median = sorted(prices)[13]           # 4800 AED (middle value)
percentile = (sorted(prices).index(5000) / 27) * 100  # 48th percentile
```

**Step 3: Generate Insight**
```json
{
  "current_price": 5000,
  "market_position": "Market Average",
  "percentile": 48,
  "market_average": 4850,
  "market_median": 4800,
  "comparison_set_size": 27
}
```

## A.2. Trend Detection

**Scenario:** Operator changed price 3 times in last 90 days.

**Price History:**
- Day 0: 5000 AED
- Day 30: 4800 AED
- Day 60: 4700 AED
- Day 90: 4700 AED (current)

**Calculation:**
```python
first_price = 5000
last_price = 4700
change_percent = ((4700 - 5000) / 5000) * 100  # -6%

if change_percent < -10:
    trend = "downward"
elif change_percent > 10:
    trend = "upward"
else:
    trend = "stable"  # -6% is within ±10% threshold
```

**Result:** Trend = "stable" (change not significant enough for "downward" label)

---

# Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Comparable Warehouse** | Warehouse matching filtering criteria (proximity, size, features) |
| **Market Average** | Arithmetic mean of prices in comparison set |
| **Market Median** | Middle value of prices in comparison set (robust to outliers) |
| **Percentile Rank** | Position in sorted comparison set (0-100) |
| **Price Spread** | Difference between highest and lowest price in comparison set |
| **Trend** | Directional label for price changes over time (upward/downward/stable) |
| **Volatility** | Frequency of price changes (high = many changes, low = stable) |
| **Outlier** | Price outside 1.5 * IQR from quartile boundaries |
| **Confidence** | Data sufficiency indicator (high/medium/low/insufficient) |
| **Comparison Set** | Collection of comparable boxes used for analysis |
| **Advisory Output** | Information for human decision-making (not automatic action) |

---

# Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Technical Documentation Team | Initial hardened specification: Removed auto-pricing language, clarified MVP scope, aligned with canonical docs, added explicit non-goals |

---

**END OF DOCUMENT**
