# Search Ranking Algorithm v2 (Advanced)

**Document ID:** DOC-076  
**Project:** Self-Storage Aggregator MVP  
**Version:** 1.0  
**Date:** December 16, 2025

---

> **Document Status:** 🟡 Supporting / Advanced v2 Specification  
> **Canonical:** ❌ No  
> **Production Mandatory:** ❌ No  
>
> This document describes advanced and experimental ranking approaches.  
> It does NOT define canonical behavior, production SLAs, or mandatory implementations.  
> All concepts herein are for research, experimentation, and future iterations.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Advanced Ranking Paradigms](#2-advanced-ranking-paradigms)
3. [Extended Signal Categories](#3-extended-signal-categories)
4. [Dynamic Weighting Concepts](#4-dynamic-weighting-concepts)
5. [Explainability & Transparency](#5-explainability--transparency)
6. [Experimentation Model](#6-experimentation-model)
7. [Failure Modes & Safeguards](#7-failure-modes--safeguards)
8. [Relationship to Canonical Documents](#8-relationship-to-canonical-documents)
9. [Non-Goals](#9-non-goals)
10. [Open Questions & Research Directions](#10-open-questions--research-directions)

---

## 1. Introduction

### 1.1. Purpose & Scope

This document describes **advanced search ranking paradigms** for the Self-Storage Aggregator platform. These approaches extend beyond basic scoring to include contextual, behavioral, and market-aware ranking strategies.

**Key Points:**

- **Not Canonical**: This document does not define production behavior or mandatory features
- **Experimental**: All concepts are subject to validation, A/B testing, and potential abandonment
- **Optional**: Platform functions fully without any of these approaches
- **Research-Oriented**: Designed to inform data science, ML, and growth experimentation

### 1.2. Why v2 Advanced Exists

The platform requires a **reference baseline** for search ranking (defined elsewhere or to be defined). This document explores:

- **Beyond Static Scoring**: Moving from fixed formulas to adaptive, context-aware ranking
- **User Intent Understanding**: Recognizing different search motivations and personalizing results
- **Market Dynamics**: Incorporating supply/demand signals into ranking
- **Trust & Safety**: Surfacing high-quality, low-risk operators preferentially
- **Experimentation Framework**: Enabling hypothesis-driven ranking improvements

### 1.3. Difference vs DOC-075 (Reference)

**Assumed DOC-075 Content** (or reference baseline):

- Basic relevance scoring (distance, price match, availability)
- Simple feature matching (climate control, 24/7 access)
- Static weighting of factors

**DOC-076 Extensions:**

- Multi-dimensional scoring (user context, market signals, trust)
- Dynamic weight adjustment based on session behavior
- Learning-to-rank approaches
- Explainability layers for transparency
- Failure mode awareness and mitigation

**Critical Distinction**: DOC-075 (if it exists) is canonical and defines production behavior. DOC-076 is exploratory and does NOT override or replace canonical ranking.

---

## 2. Advanced Ranking Paradigms

This section describes conceptual approaches to ranking, without implementation specifics.

### 2.1. Learning-to-Rank (LTR)

**Concept**: Use machine learning models to learn optimal ranking from historical user behavior.

**High-Level Approach:**

- **Training Data**: Search queries, result lists, user clicks, bookings
- **Features**: All available signals (distance, price, rating, user context, market signals)
- **Model Output**: Predicted relevance score or probability of user engagement
- **Model Types**: Pointwise, pairwise, or listwise ranking models

**Advantages:**

- Automatically discovers complex signal interactions
- Adapts to changing user preferences over time
- Can incorporate thousands of features

**Challenges:**

- Requires significant training data
- Cold-start problem for new warehouses
- Model interpretability and trust
- Computational cost

**When to Consider:**

- After accumulating sufficient search/booking data (thousands of queries)
- When basic ranking shows clear limitations
- When team has ML/DS expertise

### 2.2. Contextual Ranking

**Concept**: Adjust ranking based on user context beyond query text.

**Context Dimensions:**

- **Temporal**: Time of day, day of week, season
- **Geographic**: User location precision, local market characteristics
- **Behavioral**: Recent search history, booking patterns
- **Device**: Mobile vs desktop, screen size
- **Session**: First-time visitor vs returning user

**Example Scenarios:**

- **Mobile user on-the-go**: Prioritize proximity and immediate availability
- **Desktop user browsing**: Emphasize detailed information and comparisons
- **Returning user**: Surface previously viewed warehouses
- **Peak demand period**: Adjust for current availability pressure

**Implementation Considerations:**

- Context signals must be available at query time
- Privacy-preserving context capture
- Graceful degradation when context unavailable

### 2.3. Session-Aware Ranking

**Concept**: Adjust ranking dynamically within a user session based on observed behavior.

**Behavioral Signals:**

- **Negative Signals**: Skipped results, quick backs, no clicks
- **Positive Signals**: Detailed views, time on page, favoriting
- **Interaction Patterns**: Repeated filtering, sorting changes

**Adaptive Strategies:**

- **Negative Feedback Loop**: Demote similar warehouses to skipped results
- **Positive Feedback Loop**: Promote warehouses similar to engaged results
- **Query Refinement**: Infer implicit preferences from behavior
- **Diversity Injection**: Present alternatives when user shows uncertainty

**Scope Limitations:**

- Session-level only (no cross-session personalization in v2)
- Privacy-first approach (no persistent user profiling)
- Transparent behavior (users can reset preferences)

### 2.4. Intent-Based Ranking

**Concept**: Recognize different search intents and rank accordingly.

**Intent Categories (Hypothetical):**

1. **Urgent Need**: "Moving next week, need storage now"
   - Prioritize availability, quick booking, proximity
   
2. **Budget-Conscious**: "Cheapest storage in Moscow"
   - Prioritize price, value for size
   
3. **Quality-Seeking**: "Best-rated secure storage"
   - Prioritize rating, reviews, security features
   
4. **Browsing/Research**: Broad exploration without filters
   - Prioritize diversity, showcase range of options
   
5. **Specific Requirements**: Detailed filters (climate, insurance, access)
   - Strict matching, no compromise on must-haves

**Intent Detection:**

- Query text analysis (keywords, structure)
- Filter usage patterns
- Session behavior (speed, depth)
- Previous searches (if available)

**Ranking Adjustments:**

- Each intent has different signal weights
- Some intents may suppress certain results entirely
- Intent confidence affects adjustment magnitude

---

## 3. Extended Signal Categories

Beyond basic relevance factors, advanced ranking considers richer signal sets.

### 3.1. User Context Signals

**Device Context:**

- Mobile vs desktop (impacts layout, information density)
- Browser capabilities (map rendering, image loading)
- Network speed (affects result richness)

**Temporal Context:**

- Time of day (business hours vs evening browsing)
- Day of week (weekend vs weekday urgency)
- Seasonality (summer moves, holiday storage)

**Behavioral Context:**

- Search history (within session or anonymized aggregates)
- Booking history (if authenticated user)
- Interaction depth (casual browse vs deep research)

**Geographic Intent:**

- Precision of location query (address vs city)
- Distance from search center (1km vs 10km)
- Local market density (many options vs few)

**Privacy Note**: All behavioral signals are anonymized, session-scoped, or aggregated. No persistent user tracking without explicit consent.

### 3.2. Market Signals

**Demand Indicators:**

- Search volume for area/size (relative to inventory)
- Booking velocity (how quickly boxes are reserved)
- Availability trends (increasing scarcity)

**Supply Indicators:**

- New warehouse listings (market expansion)
- Box inventory changes (capacity fluctuations)
- Operator responsiveness (reply speed, approval rate)

**Competitive Dynamics:**

- Price positioning relative to local market
- Feature differentiation (unique offerings)
- Market saturation (many similar vs unique warehouse)

**Seasonality:**

- Demand cycles (moving season, student housing)
- Local events (festivals, relocations)
- Weather patterns (climate-controlled demand)

**Usage:**

- Boost high-demand, low-supply options (urgency signal)
- Promote newly listed warehouses (freshness)
- Adjust for market saturation (diversity)

### 3.3. Trust & Risk Signals

**Operator Quality:**

- Response rate to inquiries and bookings
- Confirmation speed (hours to approve)
- Cancellation rate (operator-initiated)
- Profile completeness (photos, descriptions)

**User Trust Indicators:**

- Review volume and recency
- Rating distribution (consistency vs volatility)
- Review authenticity (verified bookings)
- Complaint history (resolved vs unresolved)

**Risk Factors:**

- Abnormal booking patterns (potential fraud)
- Sudden price changes (bait-and-switch risk)
- Inconsistent information (address vs coordinates)
- Disputed bookings or payment issues

**Safety Considerations:**

- Security features (CCTV, access control)
- Insurance availability
- Fire safety compliance (when available)

**Application:**

- Demote high-risk operators
- Boost verified, high-trust warehouses
- Require trust thresholds for top ranking positions
- Transparent risk indicators to users

---

## 4. Dynamic Weighting Concepts

Advanced ranking moves beyond static formulas to adaptive weight adjustment.

### 4.1. Adaptive Weights

**Concept**: Adjust signal importance based on context and outcomes.

**Adaptation Triggers:**

- **User Behavior**: If users consistently click lower-ranked results, adjust weights
- **Conversion Rates**: If high-ranked results don't convert, weights may be suboptimal
- **Market Shifts**: If demand patterns change, rebalance supply/demand signals
- **A/B Test Results**: Data-driven weight tuning

**Weight Categories:**

- **Core Signals**: Distance, price, rating (baseline weight)
- **Contextual Modifiers**: User context, market signals (adaptive weight)
- **Trust Boosters**: Safety, verification (threshold-based)

**Constraints:**

- Core signals never go to zero (maintain baseline logic)
- Adaptive changes are gradual (avoid sudden ranking shifts)
- Weights are interpretable (no black-box opaqueness)

### 4.2. Decay Functions

**Concept**: Signal strength decreases with age, distance, or uncertainty.

**Distance Decay:**

- Warehouses close to search center get full relevance
- Relevance decreases smoothly with distance
- Decay rate depends on search intent (urgent vs flexible)

**Recency Decay:**

- Recent reviews weigh more than old reviews
- Recent booking activity indicates current quality
- Stale information (old photos, outdated prices) decays

**Confidence Decay:**

- Low-confidence signals (inferred context) contribute less
- High-confidence signals (explicit filters) dominate
- Uncertainty in data reduces signal weight

**Mathematical Approach** (conceptual):

- Exponential decay: `score * e^(-lambda * distance)`
- Linear decay: `score * max(0, 1 - distance/threshold)`
- Sigmoid decay: `score / (1 + e^(k*(distance - midpoint)))`

**Note**: Actual functions are configurable and validated experimentally.

### 4.3. Confidence-Based Weighting

**Concept**: Signals with low confidence contribute proportionally less.

**Confidence Sources:**

- **Data Quality**: Complete vs incomplete information
- **Data Freshness**: Recent vs stale updates
- **User Certainty**: Explicit filters vs inferred intent
- **Model Uncertainty**: High variance predictions

**Weighting Strategy:**

```
effective_score = base_score * confidence_factor
where confidence_factor in [0, 1]
```

**Examples:**

- Old listing with no recent reviews: `confidence = 0.5` (reduce weight)
- Inferred user intent: `confidence = 0.7` (moderate weight)
- Explicit filter match: `confidence = 1.0` (full weight)

**Transparency**: Low-confidence results can be flagged to users ("Limited information available").

---

## 5. Explainability & Transparency

Advanced ranking must remain interpretable to maintain user trust.

### 5.1. Explanation Layers

**User-Facing Explanations:**

- **Why This Result**: Brief reason for ranking position
  - "Top-rated in your area"
  - "Best price for size M"
  - "Recently added"
- **Alternative Sorting**: "See results by price" or "See results by distance"
- **Filter Suggestions**: "Show only climate-controlled" based on inferred preferences

**Operator-Facing Explanations:**

- **Ranking Factors**: What impacts their warehouse position
- **Improvement Tips**: Actionable steps to improve ranking
- **Market Context**: Where they stand relative to competitors

**Internal Explanations:**

- **Debugging Tools**: Score breakdown by signal
- **Audit Trails**: Why a specific result was ranked where
- **Anomaly Detection**: Flag unusual ranking outcomes

### 5.2. Internal vs External Explanations

**Internal Explanations** (for team/debugging):

- Full signal breakdown with weights
- Confidence scores for each signal
- Model predictions and intermediate scores
- Historical ranking changes

**External Explanations** (for users/operators):

- Simplified, human-readable reasons
- No exposure of proprietary algorithms
- Focused on actionable insights
- Privacy-preserving (no user profiling details)

**Balance**: Provide enough transparency to build trust, not so much that gaming becomes trivial.

### 5.3. Regulatory Considerations

**Transparency Requirements:**

- If ranking involves automated decision-making with significant impact, regulations may require explanation (e.g., GDPR Article 22)
- Commercial impact on operators (visibility affects bookings) may require fairness standards
- User rights to understand why certain results are shown

**Compliance Strategies:**

- Document ranking logic clearly
- Provide explanation mechanisms
- Allow operators to contest ranking decisions
- Maintain audit logs for accountability

**Note**: This document does not define compliance requirements. See **DOC-078** (Security & Compliance Plan) for regulatory obligations.

---

## 6. Experimentation Model

Advanced ranking requires rigorous experimentation to validate hypotheses.

### 6.1. Hypothesis-Driven Ranking

**Experimentation Philosophy:**

- **Hypothesis First**: Start with specific claims about user behavior
- **Measurable Outcomes**: Define success metrics before testing
- **Controlled Experiments**: A/B tests with proper statistical rigor
- **Iterative Learning**: Fail fast, learn, adapt

**Example Hypotheses:**

1. "Boosting newly listed warehouses by 10% increases click-through rate without harming conversion"
2. "Demoting warehouses with >48h confirmation time increases user satisfaction"
3. "Personalizing ranking based on session behavior improves booking rate by 5%"

**Validation Metrics:**

- **Primary**: Booking conversion rate
- **Secondary**: Click-through rate, time on page, session depth
- **Guard Rails**: Operator fairness, user satisfaction scores

### 6.2. Isolation of Experiments

**Principles:**

- **Traffic Splitting**: Randomly assign users to control vs treatment groups
- **Stable Assignment**: User sees consistent ranking throughout session
- **Minimal Cross-Contamination**: Experiments don't interfere with each other
- **Clear Success Criteria**: Predefined thresholds for go/no-go decisions

**Experimentation Layers:**

- **Layer 1**: Baseline ranking (current production)
- **Layer 2**: Minor tweaks (weight adjustments)
- **Layer 3**: Major changes (new signals, paradigms)

**Rollout Strategy:**

- Start with small traffic percentage (1-5%)
- Monitor for negative impacts (drop in bookings, user complaints)
- Gradual increase if positive results
- Full rollout or abandon based on data

**Reference**: See **DOC-003** (A/B Testing Framework) for experimentation infrastructure and methodology.

### 6.3. Rollback Safety

**Experimentation Safeguards:**

- **Kill Switch**: Instant revert to baseline ranking
- **Monitoring Dashboards**: Real-time experiment health metrics
- **Automated Alerts**: Trip if key metrics degrade beyond threshold
- **Manual Review**: Human-in-the-loop for go/no-go decisions

**Rollback Triggers:**

- Significant drop in booking conversion (>X%)
- Increase in user complaints or negative feedback
- Operator reports of fairness issues
- System performance degradation (latency, errors)

**Experiment Lifecycle:**

1. **Design**: Define hypothesis, metrics, success criteria
2. **Implement**: Build experimental ranking variant
3. **Test**: Deploy to small user segment
4. **Monitor**: Track metrics, watch for anomalies
5. **Decide**: Roll forward, iterate, or abandon
6. **Document**: Record learnings for future reference

---

## 7. Failure Modes & Safeguards

Advanced ranking introduces new failure modes that must be anticipated and mitigated.

### 7.1. Bias Amplification

**Risk**: Machine learning models can amplify existing biases in training data.

**Examples:**

- Popular warehouses get more visibility → more bookings → more popularity (rich get richer)
- New warehouses with no reviews systematically underranked (cold-start problem)
- Geographic bias if certain areas have more data

**Mitigation Strategies:**

- **Diversity Injection**: Force some ranking slots for underrepresented results
- **Cold-Start Boosting**: Give new warehouses temporary visibility boost
- **Fairness Constraints**: Ensure minimum exposure for all qualifying warehouses
- **Regular Audits**: Monitor ranking distribution for bias

### 7.2. Feedback Loops

**Risk**: Ranking affects user behavior, which affects ranking (circular dependency).

**Positive Feedback Loop** (reinforcing):

- High-ranked warehouse → more clicks → higher engagement score → even higher rank
- Can lead to winner-takes-all outcomes

**Negative Feedback Loop** (destabilizing):

- Low-ranked warehouse → few clicks → lower engagement score → even lower rank
- Can cause quality warehouses to disappear from view

**Mitigation Strategies:**

- **Exploration**: Periodically surface lower-ranked results to gather fresh signals
- **Signal Caps**: Limit how much historical engagement can dominate
- **Time Windows**: Use recent behavior more than old behavior
- **A/B Testing**: Validate that feedback loops don't harm overall outcomes

### 7.3. Cold-Start Problem

**Risk**: New warehouses and new users lack historical data for ranking.

**Cold-Start Scenarios:**

- **New Warehouse**: No bookings, reviews, or engagement data
- **New User**: No search history or preferences
- **New Market**: No local competition data or demand signals

**Mitigation Strategies:**

- **Content-Based Fallback**: Rank new warehouses based on features and location
- **Default Priors**: Assign reasonable default scores until data accumulates
- **Exploration Budget**: Reserve ranking slots for new entries
- **Accelerated Learning**: Prioritize data collection for new entities

### 7.4. Gaming & Manipulation

**Risk**: Operators may attempt to manipulate ranking signals.

**Attack Vectors:**

- **Fake Reviews**: Create fraudulent positive reviews
- **Price Gaming**: List low prices, increase after initial rank boost
- **Keyword Stuffing**: Fill descriptions with search terms
- **Click Fraud**: Artificially inflate engagement metrics

**Detection & Mitigation:**

- **Anomaly Detection**: Flag unusual patterns (sudden review spike)
- **Verification Requirements**: Limit signals to verified sources
- **Rate Limits**: Constrain how quickly signals can change
- **Trust Scores**: Incorporate operator trust into ranking
- **Manual Review**: Human audits for suspicious activity

### 7.5. Performance Degradation

**Risk**: Complex ranking slows search response times.

**Performance Concerns:**

- **Signal Collection**: Gathering many signals per result
- **Model Inference**: Real-time ML predictions
- **Personalization**: Per-user computation
- **Database Load**: Complex queries for signals

**Mitigation Strategies:**

- **Caching**: Cache expensive computations (market signals, model scores)
- **Precomputation**: Batch-calculate stable signals offline
- **Sampling**: Rank only top candidates, not entire corpus
- **Tiered Ranking**: Fast first-stage filter, expensive re-ranking on small set
- **Monitoring**: Track latency, rollback if unacceptable

---

## 8. Relationship to Canonical Documents

This document extends and complements canonical specifications without overriding them.

### 8.1. DOC-001: Functional Specification MVP v1

**Relationship**: Functional Specification defines user stories and acceptance criteria for search. This document explores advanced ranking that enhances, but does not replace, baseline search functionality.

**Integration**: Advanced ranking serves user stories around discovery and relevance. If advanced ranking fails or is disabled, users still access full search functionality.

### 8.2. DOC-002: Technical Architecture Document

**Relationship**: Technical Architecture defines system components and data flows. Advanced ranking operates within the backend API layer (search service).

**Integration**: Ranking logic is modular and replaceable. System architecture supports both baseline and advanced ranking without structural changes.

### 8.3. DOC-003: A/B Testing Framework (Assumed)

**Relationship**: This document requires rigorous experimentation, which depends on an A/B testing framework.

**Integration**: All advanced ranking changes must be validated through controlled experiments before production rollout.

### 8.4. DOC-009: AI Core Design

**Relationship**: AI Core Design defines AI modules (Box Recommendation, Pricing Intelligence). Advanced ranking may leverage AI capabilities for intent detection or predictive scoring.

**Integration**: If AI Core is unavailable, advanced ranking degrades gracefully to non-AI methods. AI is advisory, not authoritative.

### 8.5. DOC-014: Analytics & Metrics Tracking (Assumed)

**Relationship**: Advanced ranking requires rich behavioral analytics to function effectively.

**Integration**: Ranking relies on analytics data (searches, clicks, bookings) for training and adaptation. Analytics must be privacy-preserving and compliant.

**Reference**: See analytics tracking events in Functional Specification Appendix B.

### 8.6. DOC-015: API Design Blueprint

**Relationship**: API Design defines search endpoints (`GET /warehouses`). Advanced ranking does not change API contracts, only internal scoring logic.

**Integration**: Ranking is transparent to API clients. Response format remains consistent.

### 8.7. DOC-036 / DOC-078: Security & Compliance Plan

**Relationship**: Security Plan defines data protection and privacy requirements. Advanced ranking must comply with all privacy and security policies.

**Integration**: 

- User context signals must be anonymized and session-scoped
- Behavioral data must follow retention policies
- Compliance with GDPR, data minimization principles
- No persistent user tracking without consent

### 8.8. DOC-050: Database Specification

**Relationship**: Database Specification defines data models for warehouses, reviews, bookings. Advanced ranking reads from these tables.

**Integration**: Ranking does NOT modify canonical data. All signal derivation is read-only. Any new tables for ranking signals are isolated.

### 8.9. DOC-055: Logging Strategy

**Relationship**: Logging Strategy defines event logging and log taxonomy. Advanced ranking must emit logs for monitoring and debugging.

**Integration**: Log ranking decisions, signal scores, experiment assignments. Use structured logging for observability.

### 8.10. DOC-057: Monitoring & Observability Plan

**Relationship**: Monitoring Plan defines metrics and dashboards. Advanced ranking must be observable.

**Integration**: Expose metrics for ranking latency, signal distribution, experiment outcomes. Alert on performance degradation or anomalies.

### 8.11. DOC-075: Search Ranking (Reference/Baseline)

**Relationship**: DOC-075 (if it exists) defines the canonical, production-mandatory baseline ranking logic. DOC-076 is strictly supplementary.

**Integration**: 

- DOC-075 is the source of truth for production
- DOC-076 explores extensions and alternatives
- If DOC-076 ranking is deployed, it must be clearly marked as experimental
- DOC-075 is the fallback if DOC-076 fails

---

## 9. Non-Goals

This document explicitly does NOT cover:

### 9.1. Production-Mandatory Behavior

**Not Defined Here:**

- Mandatory ranking formulas or algorithms
- Production SLAs or performance guarantees
- Required implementation timelines
- Budget or resource allocations

**Clarification**: This document describes possibilities, not requirements. Platform functions fully without implementing any of these approaches.

### 9.2. Implementation Specifics

**Not Defined Here:**

- Code structure or class hierarchy
- Database schemas for ranking signals
- Specific ML frameworks or libraries
- Infrastructure components (servers, containers)

**Clarification**: This is a design and research document, not an implementation guide.

### 9.3. API Contracts

**Not Defined Here:**

- Changes to search API request/response formats
- New endpoints for ranking control
- Operator-facing ranking APIs

**Clarification**: Advanced ranking is internal to the search service. API contracts remain stable.

### 9.4. Concrete Metrics & Thresholds

**Not Defined Here:**

- Specific signal weights (e.g., "distance weight = 0.4")
- Performance targets (e.g., "ranking latency < 50ms")
- A/B test success thresholds (e.g., "5% conversion lift")

**Clarification**: All numerical parameters are environment-specific and validated experimentally. This document provides conceptual framework only.

### 9.5. UX or UI Design

**Not Defined Here:**

- How ranking explanations are displayed to users
- Filter UI design or interaction patterns
- Sort controls or display modes

**Clarification**: This document focuses on ranking logic. UX/UI is the domain of frontend and product design.

### 9.6. Business Strategy

**Not Defined Here:**

- Revenue optimization through ranking
- Paid placement or promoted listings
- Operator bidding or auction mechanisms

**Clarification**: This document is technology-focused. Business model decisions are out of scope.

---

## 10. Open Questions & Research Directions

This section identifies areas requiring further investigation, validation, or clarification.

### 10.1. Data Maturity Requirements

**Question**: How much data is needed before advanced ranking is viable?

**Considerations:**

- Minimum search volume for meaningful signals (thousands? millions?)
- Minimum booking history for conversion modeling
- Cold-start data requirements (new warehouses, new markets)
- Data quality vs quantity trade-offs

**Research Needed:**

- Analyze current data volume and quality
- Simulate ranking with varying data densities
- Identify data gaps that block advanced ranking

### 10.2. Model Selection & Validation

**Question**: Which ML models (if any) are appropriate for this problem?

**Options:**

- Gradient-boosted trees (XGBoost, LightGBM)
- Neural networks (deep ranking models)
- Linear models (logistic regression, ranking SVMs)
- Hybrid approaches (ensemble models)

**Research Needed:**

- Benchmark models on historical data
- Compare complexity vs performance trade-offs
- Assess interpretability requirements
- Evaluate production inference cost

### 10.3. Signal Engineering

**Question**: Which signals actually improve ranking outcomes?

**Hypothesis Testing:**

- Does user device context (mobile vs desktop) impact ranking effectiveness?
- Do market signals (demand spikes) improve booking conversion?
- Does trust scoring reduce user complaints?
- How much does recency weighting help vs hurt?

**Research Needed:**

- Feature importance analysis on historical data
- Ablation studies (remove signals, measure impact)
- Cross-validation to avoid overfitting

### 10.4. Explainability Standards

**Question**: How transparent should ranking be to users and operators?

**Trade-offs:**

- More transparency → better trust, but easier to game
- Less transparency → harder to game, but less trust
- Regulatory requirements vary by jurisdiction

**Research Needed:**

- User research on explanation preferences
- Operator feedback on ranking fairness
- Legal review of transparency obligations
- Competitor analysis (what do others disclose?)

### 10.5. Performance Constraints

**Question**: What latency is acceptable for ranking?

**Constraints:**

- User expectation: Search results in <1 second (total)
- Ranking budget: <100ms for scoring (estimate)
- Trade-off: Speed vs accuracy

**Research Needed:**

- Measure current search latency breakdown
- Benchmark ranking algorithm speeds
- Identify optimization opportunities (caching, precomputation)

### 10.6. Ethical & Fairness Considerations

**Question**: What fairness standards should ranking uphold?

**Concerns:**

- Should all warehouses get minimum exposure, regardless of quality?
- How to balance user experience vs operator fairness?
- Is boosting new entrants fair to established operators?
- How to handle edge cases (very low quality warehouses)?

**Research Needed:**

- Define fairness metrics for ranking (exposure equity, outcome parity)
- Stakeholder consultation (users, operators, platform)
- Competitive analysis (industry standards)

### 10.7. Market-Specific Adaptations

**Question**: Should ranking differ by geographic market?

**Considerations:**

- Moscow vs St. Petersburg: Different supply/demand dynamics
- Urban vs suburban: Different distance sensitivity
- High-density vs low-density: Different competition levels

**Research Needed:**

- Market segmentation analysis
- Regional user behavior studies
- Cost-benefit of market-specific tuning

### 10.8. Long-Term Learning

**Question**: Should ranking improve continuously over time?

**Approaches:**

- **Online Learning**: Model updates with every search/booking
- **Batch Learning**: Periodic re-training (daily, weekly)
- **No Learning**: Static model, manual updates only

**Trade-offs:**

- Online learning: Fast adaptation, but risk of drift and instability
- Batch learning: Stable, but slow to react
- No learning: Simple, but manual and slow

**Research Needed:**

- Assess data volume for online learning viability
- Evaluate model stability with online updates
- Monitor for concept drift (user preferences change over time)

---

## Document Metadata

**Approved By:**

- Data Science Lead
- Product Owner
- Technical Architecture Lead

**Review Cycle:** As needed for experimentation priorities

**Change Control:** This document may be updated freely as research progresses. Changes do not require Architecture Review Board approval since this is non-canonical.

**Implementation Authority:** No team is obligated to implement any concept in this document. All implementations require separate planning, prioritization, and approval.

---

**END OF DOCUMENT**
