# DOC-075 — Search Ranking Algorithm — Supporting / Reference Specification (v2)

**Document ID:** DOC-075  
**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Document Status:** 📘 Supporting / Reference (Non-Canonical)  
**Scope:** Post-MVP / v2 (Reference Only)  
**Date:** December 2025

> ⚠️ **Document Status: Supporting / Non-Canonical**
>
> This document describes search ranking logic and scoring approaches
> for analytical and reference purposes.
>
> It does NOT define canonical:
> - ranking algorithms
> - scoring weights or thresholds
> - production metrics or SLAs
> - architectural or data contracts
>
> Canonical sources of truth include:
> - DOC-014 — Analytics, Metrics & Tracking Specification
> - DOC-003 — A/B Testing Framework
> - DOC-009 — AI Core Design
> - DOC-002 — High-Level Technical Architecture
>
> In case of conflicts, canonical documents always take precedence.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Ranking Objectives](#2-ranking-objectives)
3. [Ranking Signals (Core)](#3-ranking-signals-core)
4. [Signal Normalization](#4-signal-normalization)
5. [Ranking Formula (High-Level)](#5-ranking-formula-high-level)
6. [Anti-Gaming & Fairness](#6-anti-gaming--fairness)
7. [A/B Testing Integration](#7-ab-testing-integration)
8. [MVP Compatibility](#8-mvp-compatibility)
9. [Dependencies & Related Documents](#9-dependencies--related-documents)
10. [Risks & Open Questions](#10-risks--open-questions)
11. [Relationship to Canonical Documentation](#11-relationship-to-canonical-documentation)

---

## 1. Introduction

### 1.1. Purpose

This document defines the **algorithmic specification** for warehouse ranking in search results on the Self-Storage Aggregator platform. It establishes the principles, signals, and decision-making logic that determines how warehouses are ordered when presented to users in search and catalog views.

This specification serves as:
- **Engineering Reference** — Backend teams implementing ranking systems
- **Data Science Blueprint** — AI/ML teams evolving and optimizing the algorithm
- **Product Strategy Document** — Product and Growth teams conducting A/B tests and conversion optimization

**This document is NOT:**
- User interface design
- API endpoint specification
- SQL query implementation
- Front-end sorting controls
- Payment or booking logic

### 1.2. Scope (v2 Only)

**In Scope:**
- Ranking signal definition and categorization
- Signal weighting and combination methodology
- Fairness and anti-manipulation mechanisms
- Quality indicators and their influence on ranking
- Behavioral signal integration (CTR, conversion rates)
- Cold-start handling for new warehouses
- Explainability requirements

**Out of Scope:**
- MVP implementation (see § 8)
- Real-time machine learning model training
- Personalized ranking based on user history
- Dynamic pricing optimization
- Multi-language search considerations
- Image-based quality assessment
- Automated fraud detection systems

### 1.3. Non-Goals

This document **does NOT:**
- Implement or describe UI components
- Define database queries or indexes
- Specify API request/response formats
- Mandate specific programming languages or frameworks
- Define monitoring dashboards or alerts
- Describe payment processing or booking workflows
- Override canonical entity definitions from core documents

**Canonical Entities Reference:**
All entity names, fields, and relationships (warehouse, box, booking, review) are defined in:
- `full_database_specification_mvp_v1_CANONICAL.md`
- `api_design_blueprint_mvp_v1_CANONICAL.md`
- `Functional_Specification_MVP_v1_CORRECTED.md`

---

## 2. Ranking Objectives

The ranking algorithm serves multiple business and user experience goals, balanced through weighted scoring:

### 2.1. Relevance

**Definition:** Match between user search intent and warehouse characteristics.

**Measurement Principles:**
- Geographic proximity to user location
- Availability of requested box sizes
- Alignment with selected filters (price range, features, attributes)
- Temporal relevance (available during user's requested dates)

**Success Criteria:**
- Users find suitable warehouses within top 5 results
- Filter application reduces result set meaningfully
- Geographic searches prioritize nearby options

### 2.2. Conversion Optimization

**Definition:** Rank warehouses that are most likely to result in confirmed bookings.

**Measurement Principles:**
- Historical booking success rate (confirmed bookings / total booking requests)
- Click-through rate (warehouse detail views / search impressions)
- Booking abandonment rate (inverse indicator)
- Time-to-booking velocity

**Success Criteria:**
- Increase in booking conversion rate compared to baseline
- Reduction in search-to-booking funnel drop-off
- Higher engagement with top-ranked results

### 2.3. Operator Fairness

**Definition:** Ensure fair distribution of visibility across all warehouse operators, preventing monopolization.

**Measurement Principles:**
- No single operator dominates top positions consistently
- New operators receive baseline visibility (cold-start support)
- Quality operators receive rewards without creating insurmountable advantages
- Small operators compete effectively against large chains

**Success Criteria:**
- Gini coefficient of impression distribution below target threshold
- New warehouses receive minimum viable impressions
- No operator receives >30% of all impressions in any market segment

### 2.4. Result Stability

**Definition:** Prevent excessive volatility in search result ordering to maintain user trust.

**Measurement Principles:**
- Minimal rank fluctuations for identical searches within short time windows
- Predictable rank changes based on measurable quality improvements
- Consistent treatment of similar warehouses

**Success Criteria:**
- Top 10 results remain stable for repeated searches within 24 hours
- Rank changes correlate with tangible warehouse improvements
- Users develop trust in search result ordering

### 2.5. Manipulation Resistance

**Definition:** Prevent operators from artificially inflating rankings through gaming tactics.

**Measurement Principles:**
- Detection of suspicious pricing patterns (price dumping)
- Identification of review manipulation attempts
- Recognition of availability manipulation (false scarcity)
- Monitoring of attribute inflation (claiming features not actually provided)

**Success Criteria:**
- Zero tolerance for confirmed manipulation with ranking penalties
- Automated detection of anomalous behavioral patterns
- Operator education about prohibited practices

---

## 3. Ranking Signals (Core)

Ranking signals are grouped into five categories, each contributing to the final warehouse score.

### 3.1. Location Signals

Location signals measure geographic relevance between the user's search context and the warehouse position.

#### 3.1.1. Distance to User

**Definition:** Physical distance between user's search center point and warehouse location.

**Data Source:**
- User-provided latitude/longitude (from geolocation or address input)
- Warehouse coordinates (from `warehouses.latitude`, `warehouses.longitude`)

**Normalization:**
- Linear decay: Score decreases proportionally with distance
- Distance bands: 0-2km (1.0), 2-5km (0.8), 5-10km (0.6), 10-20km (0.4), >20km (0.2)
- Configurable radius_km parameter allows user-defined search boundaries

**Handling Edge Cases:**
- No user location provided → Distance signal weight = 0, other signals compensate
- Warehouse outside search radius → Excluded from results entirely
- Multiple warehouses at identical location → Tie-breaking via other signals

#### 3.1.2. Geo-Relevance Score

**Definition:** Quality of geographic context beyond raw distance (metro accessibility, neighborhood popularity).

**Data Source:**
- Warehouse address metadata (district, metro_station from `warehouses` table)
- Regional popularity metrics (derived from booking density in area)

**Calculation:**
- Metro proximity bonus (+0.1 if metro_station present)
- High-demand area bonus (+0.15 if warehouse in district with >100 bookings/month)

**Future Enhancement (v2.1+):**
- Transit time estimates via mapping API integration
- Neighborhood safety ratings

#### 3.1.3. Service Area Match

**Definition:** Alignment between warehouse's declared service area and user's location.

**Data Source:**
- Operator-defined service radius (not implemented in MVP, planned for v2)
- Delivery service coverage zones (future feature)

**Calculation:**
- Score = 1.0 if user within declared service area
- Score = 0.5 if user within extended service area (1.5x radius)
- Score = 0.0 if user outside all service areas

**MVP Note:** Not applicable until service area feature is implemented.

---

### 3.2. Price Signals

Price signals balance affordability with quality, preventing race-to-bottom pricing while rewarding competitive offers.

#### 3.2.1. Minimum Box Price

**Definition:** Lowest-priced box available at the warehouse.

**Data Source:**
- `MIN(boxes.price_monthly)` for boxes with `available_quantity > 0`

**Normalization:**
- Inverted log scale: Lower prices receive higher scores, but diminishing returns
- Score = 1.0 - log10(price / median_price_in_market)
- Prevents extreme price dumping from dominating results

**Constraints:**
- Prices below 50% of market median trigger anti-gaming review
- Prices above 200% of market median receive penalty (possible outlier or luxury segment)

#### 3.2.2. Price vs. Market Median

**Definition:** Warehouse's pricing competitiveness relative to similar warehouses in the same geographic market.

**Data Source:**
- Median price of boxes with same size (`boxes.size`) in same city
- Calculated daily from active warehouse data

**Calculation:**
```
competitiveness_score = 1.0 - abs(warehouse_price - market_median) / market_median
```
- Warehouses priced within ±10% of median score highest (0.9-1.0)
- Significant deviations (>50%) receive lower scores

#### 3.2.3. Price Consistency (Anti-Dump)

**Definition:** Stability of pricing over time, detecting and penalizing artificial price manipulation.

**Data Source:**
- Historical price data from `boxes` table (updated_at timestamps)
- Price change frequency and magnitude over trailing 30 days

**Detection Logic:**
- **Dump Pattern:** Price drops >30% followed by rapid increase within 14 days
- **Penalty Application:** Warehouse ranking multiplier reduced by 0.5 for 30 days
- **Recovery:** Penalty removed if pricing stabilizes for 30+ days

**Threshold Values (Configurable):**
- Price volatility threshold: ±20% per month (normal adjustments allowed)
- Dump detection threshold: -30% drop + recovery within 14 days
- Penalty duration: 30 days

---

### 3.3. Availability Signals

Availability signals ensure users see warehouses with actual inventory, prioritizing operators who maintain current data.

#### 3.3.1. Box Availability Ratio

**Definition:** Percentage of total box inventory currently available for booking.

**Data Source:**
- `SUM(boxes.available_quantity) / SUM(boxes.total_quantity)` per warehouse

**Calculation:**
```
availability_score = available_quantity / total_quantity
```
- 80-100% availability: Score = 1.0
- 50-79% availability: Score = 0.8
- 20-49% availability: Score = 0.5
- <20% availability: Score = 0.2

**Rationale:**
- Warehouses with higher availability are more likely to fulfill booking requests
- Prevents user frustration from unavailable inventory after clicking

#### 3.3.2. Booking Success Rate

**Definition:** Proportion of booking requests (status = 'pending') that transition to 'confirmed' state.

**Data Source:**
- `bookings` table: `COUNT(status = 'confirmed') / COUNT(status IN ('confirmed', 'cancelled', 'expired'))`
- Trailing 90-day window

**Calculation:**
```
success_rate = confirmed_bookings / total_booking_attempts
```
- >90% success rate: Score = 1.0
- 70-89% success rate: Score = 0.8
- 50-69% success rate: Score = 0.5
- <50% success rate: Score = 0.2 (indicates operational issues)

**Cold-Start Handling:**
- Warehouses with <10 total bookings receive neutral score (0.7)
- Prevents penalizing new operators

#### 3.3.3. Availability Freshness

**Definition:** Recency of last update to box availability data.

**Data Source:**
- `boxes.updated_at` timestamp
- Current timestamp

**Calculation:**
```
freshness_score = 1.0 if updated within 7 days
                = 0.7 if updated 7-30 days ago
                = 0.3 if updated 30-90 days ago
                = 0.0 if updated >90 days ago
```

**Rationale:**
- Stale data likely indicates inaccurate availability
- Encourages operators to maintain current inventory information
- Users avoid contacting warehouses with outdated listings

---

### 3.4. Quality Signals

Quality signals assess the overall standard of warehouse operations, facilities, and listing presentation.

#### 3.4.1. Warehouse Quality Score

**Definition:** Composite metric reflecting operational excellence and user satisfaction.

**Data Source:**
- Average review rating (`AVG(reviews.rating)`)
- Review count (`COUNT(reviews)`)
- SLA adherence metrics (future: response time, cancellation rate)

**Calculation:**
```
quality_score = (average_rating / 5.0) * review_weight + sla_component
```

**Review Weight:**
- 1-5 reviews: weight = 0.3
- 6-20 reviews: weight = 0.6
- 21-50 reviews: weight = 0.8
- 51+ reviews: weight = 1.0

**Review Count Impact:**
- Warehouses with 0 reviews receive neutral score (0.5)
- Score confidence increases with review volume

**SLA Component (Future v2.1):**
- Response time to booking requests (<2 hours target)
- Operator cancellation rate (<5% target)

#### 3.4.2. Photo Quality Score (Reference)

**Definition:** Assessment of listing photo completeness and quality.

**Data Source:**
- `warehouse_media` table: count of photos, presence of main photo

**Calculation (Simplified for v2):**
```
photo_score = 0.0 if no photos
            = 0.5 if 1-2 photos
            = 0.8 if 3-5 photos
            = 1.0 if 6+ photos
```

**Future Enhancement (v2.2+):**
- AI-based image quality assessment (sharpness, lighting, composition)
- Interior vs. exterior photo balance
- Photo recency (prefer recent images)

#### 3.4.3. Listing Completeness

**Definition:** Percentage of optional warehouse fields populated with meaningful data.

**Data Source:**
- Required fields: name, address, coordinates, description (baseline)
- Optional fields: working_hours, attributes, services, photos, operator contact

**Calculation:**
```
completeness_score = populated_optional_fields / total_optional_fields
```

**Field Weights:**
- Description >50 characters: +0.2
- Working hours defined: +0.15
- 3+ attributes selected: +0.2
- Main photo present: +0.25
- 3+ additional photos: +0.2

**Score Range:** 0.0 (only required fields) to 1.0 (all optional fields populated)

#### 3.4.4. SLA Adherence (Planned v2.1)

**Definition:** Operator's compliance with platform service level agreements.

**Metrics:**
- Booking confirmation response time (target: <2 hours)
- Operator-initiated cancellation rate (target: <5%)
- Booking completion rate (target: >95%)
- Customer complaint resolution time (target: <48 hours)

**Data Source:**
- `bookings` table: confirmed_at, cancelled_at, cancelled_by timestamps
- Future: `support_tickets` table

**Calculation (Planned):**
```
sla_score = weighted_average([
  response_time_score * 0.4,
  cancellation_rate_score * 0.3,
  completion_rate_score * 0.2,
  resolution_time_score * 0.1
])
```

**MVP Note:** SLA tracking infrastructure not implemented in MVP.

---

### 3.5. Behavioral Signals

Behavioral signals leverage user interaction data to identify high-performing warehouses based on actual user engagement.

#### 3.5.1. Click-Through Rate (CTR)

**Definition:** Percentage of search result impressions that result in warehouse detail page views.

**Data Source:**
- Event logs: `WAREHOUSE_IMPRESSION` events from search results
- Event logs: `WAREHOUSE_DETAIL_VIEWED` events
- Time window: Trailing 30 days

**Calculation:**
```
CTR = COUNT(WAREHOUSE_DETAIL_VIEWED) / COUNT(WAREHOUSE_IMPRESSION)
```

**Normalization:**
- CTR benchmarked against position-adjusted expectations
- Position 1 CTR: ~20-30% (expected baseline)
- Position 5 CTR: ~8-12% (expected baseline)
- Position 10+ CTR: ~2-5% (expected baseline)

**Score Calculation:**
```
ctr_score = actual_CTR / expected_CTR_for_position
```
- Score > 1.0 indicates outperformance (cap at 1.5)
- Score < 0.5 indicates underperformance (floor at 0.3)

**Cold-Start Handling:**
- Warehouses with <100 impressions receive neutral score (1.0)

#### 3.5.2. Booking Conversion Rate

**Definition:** Percentage of warehouse detail page views that result in booking creation.

**Data Source:**
- Event logs: `WAREHOUSE_DETAIL_VIEWED` events
- Event logs: `BOOKING_CREATED` events with matching `warehouse_id`
- Time window: Trailing 60 days

**Calculation:**
```
conversion_rate = COUNT(BOOKING_CREATED) / COUNT(WAREHOUSE_DETAIL_VIEWED)
```

**Typical Benchmarks:**
- High-converting warehouse: >10% conversion
- Average warehouse: 3-7% conversion
- Low-converting warehouse: <2% conversion

**Score Calculation:**
```
conversion_score = min(actual_conversion / 0.10, 1.5)
```
- Warehouses with >10% conversion score 1.5 (excellent)
- Warehouses with 5% conversion score 0.75 (average)

**Attribution Window:**
- Booking must occur within 7 days of warehouse detail view
- Multiple views within 7 days count as single funnel

#### 3.5.3. Bounce Rate

**Definition:** Percentage of warehouse detail page views where user immediately returns to search results without interaction.

**Data Source:**
- Event logs: `WAREHOUSE_DETAIL_VIEWED` events
- Event logs: `SEARCH_RESULTS_VIEWED` events (return to search)
- Session data: time spent on detail page <10 seconds

**Calculation:**
```
bounce_rate = COUNT(immediate_exits) / COUNT(detail_views)
```

**Score Calculation (Inverted):**
```
bounce_score = 1.0 - min(bounce_rate, 0.8)
```
- Low bounce rate (20%): Score = 0.8 (positive signal)
- High bounce rate (80%+): Score = 0.2 (negative signal)

**Immediate Exit Definition:**
- User returns to search results within 10 seconds
- No scroll or interaction events recorded
- No booking creation attempt

#### 3.5.4. Dwell Time

**Definition:** Average time users spend viewing warehouse detail pages.

**Data Source:**
- Session analytics: `page_view_duration` for warehouse detail pages
- Time window: Trailing 30 days

**Calculation:**
```
average_dwell_time = MEAN(page_view_duration)
```

**Score Calculation:**
```
dwell_score = min(average_dwell_time / 120 seconds, 1.0)
```
- 120+ seconds (2 minutes): Score = 1.0 (high engagement)
- 60 seconds: Score = 0.5 (moderate engagement)
- <30 seconds: Score = 0.25 (low engagement)

**Rationale:**
- Longer dwell time indicates user interest and detailed evaluation
- Correlates with booking likelihood
- Reflects listing quality and information richness

---

## 4. Signal Normalization

All ranking signals are normalized to a common scale [0.0, 1.0] to enable weighted combination.

### 4.1. Normalization Strategy

**Min-Max Normalization:**
```
normalized_value = (raw_value - min_value) / (max_value - min_value)
```

Applied to:
- Distance (inverse: closer = higher score)
- Price (inverse: lower = higher score, with floor)
- Availability ratios
- Quality scores

**Z-Score Normalization:**
```
normalized_value = (raw_value - mean) / standard_deviation
```

Applied to:
- Behavioral signals (CTR, conversion, dwell time)
- Prevents extreme outliers from dominating

**Logarithmic Scaling:**
Applied to:
- Review counts (diminishing returns after 50 reviews)
- Impression counts (prevent popularity bias)

### 4.2. Score Ranges

**Signal Categories and Ranges:**

| Signal Category | Minimum Score | Neutral Score | Maximum Score |
|-----------------|---------------|---------------|---------------|
| Location        | 0.0           | 0.5           | 1.0           |
| Price           | 0.0           | 0.7           | 1.0           |
| Availability    | 0.0           | 0.5           | 1.0           |
| Quality         | 0.0           | 0.5           | 1.0           |
| Behavioral      | 0.3           | 1.0           | 1.5           |

**Rationale:**
- Behavioral signals allow super-linear rewards (1.5 cap) for exceptional performance
- Most signals use 0.5 as neutral (cold-start default)
- Floor values prevent complete exclusion due to single poor signal

### 4.3. Outlier Handling

**Statistical Outliers:**
- Values beyond 3 standard deviations from mean are capped at 3σ
- Prevents single extreme data points from distorting rankings

**Manual Overrides:**
- Platform administrators can flag specific warehouses for manual review
- Confirmed manipulation results in temporary ranking suppression

**Cold-Start Protection:**
- New warehouses (<30 days old) receive neutral scores (0.5-0.7) for behavioral signals
- Prevents penalization due to insufficient data

---

## 5. Ranking Formula (High-Level)

The final ranking score is a weighted linear combination of normalized signals.

### 5.1. Weighted Scoring Model

**Base Formula:**
```
warehouse_score = 
  (location_score * w_location) +
  (price_score * w_price) +
  (availability_score * w_availability) +
  (quality_score * w_quality) +
  (behavioral_score * w_behavioral) +
  diversity_bonus
```

**Default Weight Distribution (v2.0):**

| Signal Group | Weight | Rationale |
|--------------|--------|-----------|
| Location     | 0.30   | Primary user concern: proximity |
| Price        | 0.15   | Important but not sole decision factor |
| Availability | 0.20   | Critical for booking success |
| Quality      | 0.20   | Long-term user satisfaction driver |
| Behavioral   | 0.15   | Reflects actual user preferences |

**Total Weight:** 1.0 (100%)

**Diversity Bonus:**
- Small bonus (+0.05) applied to results 6-15 to promote operator diversity
- Prevents single operator from monopolizing all top positions

### 5.2. Component Score Calculations

**Location Score (Composite):**
```
location_score = 
  distance_score * 0.7 +
  geo_relevance_score * 0.2 +
  service_area_match_score * 0.1
```

**Price Score (Composite):**
```
price_score = 
  min_price_score * 0.5 +
  market_competitiveness_score * 0.3 +
  price_consistency_score * 0.2
```

**Availability Score (Composite):**
```
availability_score = 
  box_availability_ratio * 0.4 +
  booking_success_rate * 0.4 +
  freshness_score * 0.2
```

**Quality Score (Composite):**
```
quality_score = 
  review_rating_score * 0.4 +
  photo_quality_score * 0.2 +
  listing_completeness_score * 0.2 +
  sla_adherence_score * 0.2
```

**Behavioral Score (Composite):**
```
behavioral_score = 
  ctr_score * 0.3 +
  conversion_rate_score * 0.4 +
  (1.0 - bounce_rate_score) * 0.15 +
  dwell_time_score * 0.15
```

### 5.3. Explainability Requirements

**User-Facing Explainability:**
- Top 3 ranking factors displayed on warehouse card (e.g., "Highly Rated", "Great Location", "Affordable")
- Users cannot see raw scores but understand why warehouse appears in results

**Operator-Facing Explainability:**
- Warehouse dashboard shows breakdown of ranking components
- Actionable insights: "Improve listing completeness to boost ranking"
- Transparency builds trust and encourages quality improvements

**Admin/Data Science Explainability:**
- Full signal breakdown logged for each search query
- A/B test cohorts track weight adjustments
- Feature importance analysis informs future algorithm changes

### 5.4. Deterministic Output

**Consistency Guarantee:**
- Identical search parameters produce identical rankings within cache TTL (5 minutes)
- Rankings update only when:
  - Warehouse data changes (price, availability, attributes)
  - Behavioral data aggregation runs (hourly batch job)
  - Weight configuration updates (manual admin action)

**Tie-Breaking Rules:**
When warehouses have identical scores:
1. Higher quality_score wins
2. Higher review_count wins
3. Lower warehouse_id wins (deterministic fallback)

---

## 6. Anti-Gaming & Fairness

### 6.1. Spam Protection

**Detection Mechanisms:**

**Fake Review Detection:**
- Review velocity monitoring: >5 reviews per day from single warehouse triggers review
- Duplicate content detection: Similar text across multiple reviews flagged
- Burst pattern detection: Unusual review spikes investigated

**Penalty Actions:**
- Suspected fake reviews: Excluded from rating calculation
- Confirmed manipulation: Warehouse ranking multiplier reduced by 0.5 for 90 days
- Repeat offenders: Account suspension

**Attribute Inflation Prevention:**
- Attributes must be verified before contributing to ranking
- User complaints about false claims trigger attribute audit
- Confirmed false claims: Attribute removed + ranking penalty

### 6.2. Operator Dominance Limits

**Market Share Cap:**
- No single operator receives >30% of impressions in any market segment (city + box size combination)
- After cap reached, additional warehouses from same operator receive ranking penalty

**Diversity Enforcement:**
- Search results 1-10 must include minimum 3 different operators (when possible)
- Diversity bonus applied to positions 6-15 to promote smaller operators

**Chain Fairness:**
- Large chains (5+ warehouses) do not receive algorithmic advantage
- Each warehouse evaluated independently
- Network effects limited to quality signals (accumulated reviews)

### 6.3. Cold-Start Handling

**New Warehouse Protection:**
- Warehouses <30 days old receive baseline ranking boost (+0.1 multiplier)
- Minimum guaranteed impressions: 50 impressions/week for first 4 weeks
- Neutral scores (0.5-0.7) for behavioral signals with insufficient data

**Graduation Criteria:**
- After 10 confirmed bookings OR 100 impressions, cold-start boost removed
- Warehouse competes on equal footing based on actual performance

**Quality Threshold:**
- Cold-start boost removed immediately if:
  - Average rating drops below 3.5 stars (after 5+ reviews)
  - Booking success rate <40% (after 10+ attempts)
  - Multiple user complaints filed

### 6.4. Diversity Constraints

**Geographic Diversity:**
- Search results avoid clustering (no more than 3 warehouses within 500m in top 10)
- Promotes exploration of different neighborhoods

**Operator Diversity:**
- Minimum 3 different operators in top 10 results (when available)
- Prevents single operator monopoly perception

**Price Diversity:**
- Results include mix of budget, mid-range, and premium options
- Ensures accessibility for all user segments

---

## 7. A/B Testing Integration

### 7.1. Integration with A/B Testing Framework

**Reference Document:** DOC-003 — A/B Testing Framework (if exists, otherwise to be created)

**Experiment Scopes:**

**Weight Adjustment Experiments:**
- Test different signal weight distributions
- Example: Location weight 0.35 vs. 0.25 (control vs. variant)
- Measure impact on booking conversion rate

**Signal On/Off Experiments:**
- Evaluate individual signal contribution
- Example: Behavioral signals enabled vs. disabled
- Determine feature importance

**Algorithm Version Experiments:**
- Compare v2.0 ranking vs. v2.1 ranking
- Gradual rollout (10% → 50% → 100%)
- Rollback capability if metrics degrade

### 7.2. Experiment Design Principles

**Traffic Allocation:**
- Minimum 5,000 users per cohort for statistical significance
- Random assignment at user level (consistent experience per user)
- Duration: 2-4 weeks minimum for seasonal effects

**Guardrail Metrics:**
Experiments must not degrade:
- Overall booking conversion rate by >5%
- User satisfaction score (CSAT) below 4.0/5.0
- Operator impression fairness (Gini coefficient increase)

**Success Metrics:**
Primary: Booking conversion rate (target: +3-5% improvement)
Secondary: 
- Click-through rate from search to detail view
- Average position of booked warehouses
- User engagement (pages per session)

### 7.3. Metrics for Evaluation

**North Star Metric:**
- **Booking Conversion Rate:** (Confirmed Bookings / Search Sessions) * 100

**Supporting Metrics:**

| Metric | Definition | Target Direction |
|--------|------------|------------------|
| CTR | Detail Views / Search Impressions | Increase |
| Bounce Rate | Immediate Exits / Detail Views | Decrease |
| Search Refinement Rate | Searches after initial search / Total searches | Decrease |
| Average Position of Booking | Mean rank of warehouses that receive bookings | Decrease (closer to 1) |
| Operator Satisfaction | Operator NPS survey score | Increase |

**Logging Integration:**
- All ranking decisions logged with experiment cohort identifier
- Event logs: `RANKING_DECISION` with full signal breakdown
- Enables post-hoc analysis and debugging

---

## 8. MVP Compatibility

### 8.1. What is NOT Used in MVP

**MVP v1 Ranking Logic:**
The MVP uses **simple sorting** without algorithmic ranking:

**Available Sort Options:**
1. **Default:** Rating descending (`warehouses.rating DESC`)
2. **Price:** Minimum box price ascending (`MIN(boxes.price_monthly) ASC`)
3. **Distance:** Geographic distance ascending (calculated at query time)

**No Behavioral Signals:**
- No CTR tracking
- No conversion rate analysis
- No dwell time measurement

**No Quality Scoring:**
- No composite quality score
- No listing completeness assessment
- No SLA adherence tracking

**No Anti-Gaming:**
- No price dump detection
- No fake review filtering (basic moderation only)
- No diversity enforcement

### 8.2. MVP Fallback Sorting Logic

**Current MVP Implementation:**
```sql
-- Example SQL for MVP "rating" sort (simplified)
SELECT w.*, MIN(b.price_monthly) as min_price
FROM warehouses w
LEFT JOIN boxes b ON b.warehouse_id = w.id AND b.available_quantity > 0
WHERE w.status = 'published'
  AND ST_Distance_Sphere(
    POINT(w.longitude, w.latitude),
    POINT(:user_lon, :user_lat)
  ) <= :radius_meters
GROUP BY w.id
ORDER BY w.rating DESC, w.review_count DESC
LIMIT 12 OFFSET :offset;
```

**MVP Limitations Addressed in v2:**
- **No relevance scoring:** All warehouses within radius treated equally
- **No operator fairness:** Popular operators dominate results
- **No cold-start support:** New warehouses rank poorly due to zero reviews
- **No conversion optimization:** High-converting warehouses not prioritized

### 8.3. Migration Path from MVP to v2

**Phase 1: Data Collection (Weeks 1-4)**
- Implement event logging for behavioral signals
- Collect baseline CTR, conversion, bounce rate data
- No ranking changes, observation only

**Phase 2: Shadow Mode (Weeks 5-8)**
- Run v2 ranking algorithm in parallel with MVP sorting
- Compare results, measure signal availability
- No user-facing changes

**Phase 3: A/B Test (Weeks 9-12)**
- Roll out v2 ranking to 10% of traffic
- Monitor guardrail metrics closely
- Iterate on weights based on early data

**Phase 4: Full Rollout (Week 13+)**
- Gradual expansion to 100% traffic
- Continuous monitoring and optimization
- Deprecate MVP simple sorting

---

## 9. Dependencies & Related Documents

### 9.1. Core Platform Documents

**Functional Specification (DOC-001):**
- User stories defining search and discovery flows
- Acceptance criteria for warehouse catalog browsing
- Filter and sort requirements

**Technical Architecture (DOC-002):**
- Backend service structure (warehouses module, bookings module)
- Database schema alignment (`warehouses`, `boxes`, `bookings`, `reviews` tables)

**API Design Blueprint (DOC-015):**
- `/api/v1/warehouses` search endpoint specification
- Query parameters: `sort`, `order`, `filters`
- Response format: `data[]`, `pagination`, `meta`

**Database Specification (DOC-004):**
- Entity definitions: warehouse, box, booking, review
- Field types, constraints, indexes
- Geographic queries (PostGIS functions)

### 9.2. Analytics & Experimentation

**Analytics Metrics Tracking (DOC-014):**
- Event taxonomy: `WAREHOUSE_IMPRESSION`, `WAREHOUSE_DETAIL_VIEWED`, `BOOKING_CREATED`
- Metric definitions: CTR, conversion rate, bounce rate
- Data pipeline from event logs to analytics database

**A/B Testing Framework (DOC-003):**
- Experiment design methodology
- Traffic allocation strategies
- Statistical significance calculations
- Rollback procedures

**Monitoring & Observability (DOC-057):**
- Ranking algorithm performance metrics
- Latency monitoring (search response time)
- Error rate tracking for ranking calculation failures

### 9.3. AI & Machine Learning

**AI Core Design (DOC-009):**
- Box Size Recommendation (MVP feature)
- Future: Personalized ranking via ML models
- AI-powered quality assessment (photo quality, description quality)

**Data Warehouse Specification (DOC-037 - Future):**
- OLAP database for historical analytics
- Aggregated behavioral signal storage
- Training data pipelines for ML models

### 9.4. Operational Documents

**SLO/SLA/SLI Definitions (DOC-083):**
- Search result latency targets: p95 < 500ms
- Ranking consistency SLI: 95% of repeated searches produce identical top 5
- Availability SLO: Search service uptime 99.5%

**Security & Compliance (DOC-036):**
- User location data privacy (GDPR compliance)
- Behavioral data anonymization requirements
- Operator data access controls

---

## 10. Risks & Open Questions

### 10.1. Bias Risks

**Geographic Bias:**
- Risk: Urban areas receive disproportionate signals due to higher user density
- Mitigation: Normalize behavioral signals by market size (users per km²)

**Popularity Bias:**
- Risk: Established warehouses accumulate advantages (more reviews → higher ranking → more bookings → more reviews)
- Mitigation: Cold-start boost, diversity constraints, review count logarithmic scaling

**Price Anchoring Bias:**
- Risk: Users may anchor to first few results, ignoring better lower-ranked options
- Mitigation: Price diversity constraints, explicit "budget" and "premium" result sections (future UX)

### 10.2. Data Sparsity

**New Market Launch:**
- Question: How does algorithm perform in markets with <10 warehouses?
- Proposed Solution: Relaxed diversity constraints, increased cold-start boost duration

**Low Booking Volume:**
- Question: How to calculate conversion rates in low-traffic periods (off-season)?
- Proposed Solution: Seasonal baseline adjustments, longer trailing windows (90 days vs. 30 days)

**Behavioral Signal Gaps:**
- Question: What if users disable analytics tracking (GDPR, privacy tools)?
- Proposed Solution: Graceful degradation, increase weight on static signals (quality, price, location)

### 10.3. Operator Complaints

**Perceived Unfairness:**
- Risk: Operators may claim algorithm favors competitors unfairly
- Mitigation: Transparent operator dashboard with ranking factor breakdown
- Education: Help documentation explaining how to improve ranking

**Gaming Attempts:**
- Risk: Operators try to manipulate signals (fake reviews, price dumping)
- Mitigation: Automated anomaly detection, manual review queue, clear policy enforcement

**Appeal Process:**
- Question: How do operators dispute ranking penalties?
- Proposed Solution: Formal appeal process, data-driven review by platform team, 5-business-day SLA

### 10.4. Explainability Challenges

**Black Box Perception:**
- Risk: Users and operators don't trust algorithm due to perceived opacity
- Mitigation: Simple user-facing explanations ("Near you", "Highly rated"), detailed operator insights

**Debugging Complexity:**
- Risk: Engineering team struggles to debug ranking issues due to many interacting signals
- Mitigation: Comprehensive logging, ranking "explain" API endpoint for testing, signal contribution visualization

**Regulatory Compliance:**
- Risk: EU/GDPR requirements for algorithmic transparency
- Mitigation: Clear disclosure in terms of service, user rights to understand ranking logic, data access provisions

### 10.5. Performance & Scalability

**Real-Time Signal Calculation:**
- Question: Can behavioral signals be calculated at query time or require pre-aggregation?
- Proposed Solution: Hourly batch jobs pre-aggregate signals, stored in cache (Redis), 5-minute TTL

**Search Latency:**
- Question: Does complex ranking increase search response time beyond acceptable limits (>500ms)?
- Proposed Solution: Pre-compute warehouse scores every 15 minutes, simple score lookup at query time

**Database Load:**
- Question: Do ranking queries cause excessive database load?
- Proposed Solution: Dedicated read replica for ranking calculations, indexed materialized views

---

## 11. Relationship to Canonical Documentation

This document is intended to support understanding and experimentation around search ranking strategies.

It must be used in conjunction with canonical platform documentation and should not be treated as a source of truth for implementation or governance decisions.

**Purpose of This Document:**
- Provide reference for ranking signal design discussions
- Support product and growth teams in A/B testing strategy
- Document analytical approaches for data science exploration
- Enable informed conversations about ranking trade-offs

**What This Document Is NOT:**
- NOT a binding implementation contract
- NOT a source of production configuration values
- NOT an architectural specification with enforcement requirements
- NOT a substitute for canonical API, database, or analytics documentation

**Decision Authority:**
- Ranking algorithm changes require approval from Product, Engineering, and Data Science leads
- Production weight configurations are managed separately from this document
- Canonical platform behavior is defined by the documents listed in the disclaimer above

---

## Document Metadata

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Platform Team | Initial v2 specification |

**Approved By:**
- Product Owner
- Engineering Lead
- Data Science Lead

**Review Cycle:** Quarterly or upon major algorithm version changes

**Change Control:** All modifications require Architecture Review Board approval to ensure alignment with platform-wide principles.

---

**END OF DOCUMENT**
