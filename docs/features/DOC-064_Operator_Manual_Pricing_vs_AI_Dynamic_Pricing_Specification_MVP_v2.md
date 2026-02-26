# DOC-064: Operator Manual Pricing vs AI Dynamic Pricing Specification (MVP → v2)

**Self-Storage Aggregator Platform**

---

## Document Classification

| Field | Value |
|-------|-------|
| **Document ID** | DOC-064 |
| **Title** | Operator Manual Pricing vs AI Dynamic Pricing Specification |
| **Type** | Supporting / Pricing Governance & AI Advisory Specification |
| **Status** | Non-Canonical (Governance) |
| **Scope** | MVP v1 → v2 Transition |
| **Authority Level** | Advisory / Policy Framework |
| **Version** | 1.0 |
| **Last Updated** | December 18, 2025 |
| **Maintained By** | Product & Governance Team |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Pricing Authority Principles](#2-pricing-authority-principles)
3. [MVP v1 Pricing Baseline](#3-mvp-v1-pricing-baseline)
4. [AI Pricing Assistance (Conceptual)](#4-ai-pricing-assistance-conceptual)
5. [Manual vs AI Pricing Interaction](#5-manual-vs-ai-pricing-interaction)
6. [What AI Pricing Does NOT Do](#6-what-ai-pricing-does-not-do)
7. [Transparency & Explainability](#7-transparency--explainability)
8. [Relation to Other Documents](#8-relation-to-other-documents)
9. [Non-Goals & Explicit Exclusions](#9-non-goals--explicit-exclusions)
10. [Risks & Misuse Scenarios](#10-risks--misuse-scenarios)

---

# 1. Document Role & Scope

## 1.1. Document Purpose

This document establishes the **pricing governance framework** for the Self-Storage Aggregator platform. It defines:

- **Who** holds pricing authority (operators)
- **What** role AI plays in pricing (advisory only)
- **How** manual pricing and AI signals coexist
- **What** AI categorically does NOT do

This is a **governance-oriented**, **advisory**, and **risk-aware** specification. It does NOT:
- Define pricing algorithms or formulas
- Specify AI model architectures
- Create binding pricing strategies
- Guarantee business outcomes

## 1.2. Supporting / Non-Canonical Status

**Classification:** This document is **Supporting / Non-Canonical**.

**What This Means:**
- NOT a source of API contracts (see api_design_blueprint_mvp_v1.md)
- NOT a source of technical requirements (see Technical_Architecture_Document_FULL.md)
- NOT a source of AI implementation details (see AI_Core_Design_MVP_v1_CANONICAL.md)
- IS a governance policy document
- IS a risk management framework
- IS a principle-setting guide for product and business teams

## 1.3. Scope: MVP → v2

**MVP v1 (Current State):**
- Operators control all pricing manually
- Platform displays operator-set prices
- NO AI pricing features implemented
- Platform is a neutral intermediary

**v2 (Conceptual Future):**
- AI may provide pricing insights
- AI offers market context and suggestions
- Operators retain final pricing authority
- AI assistance is optional, not mandatory

**Out of Scope:**
- Automated dynamic pricing systems
- Revenue optimization engines
- Price-setting automation
- Competitive price enforcement

## 1.4. Intended Audience

- Product Managers (pricing strategy decisions)
- Engineering Leadership (AI feature roadmap)
- Operators (understanding platform policies)
- Legal & Compliance (regulatory risk assessment)
- Data Science (AI model development constraints)

---

# 2. Pricing Authority Principles

## 2.1. Core Principle: Operator Sovereignty

**Fundamental Rule:**
> Operators own and control the final price of every storage box on the platform. The platform does not set, enforce, or mandate prices.

**Implications:**
- Operators set prices based on their business needs
- Operators can change prices at any time (subject to booking commitments)
- Platform displays prices exactly as set by operators
- Platform does not adjust prices algorithmically

## 2.2. Platform as Neutral Intermediary

**Platform Role:**
- Facilitate discovery and booking
- Display operator-provided information accurately
- Process booking requests neutrally
- Provide optional tools and insights

**Platform Does NOT:**
- Dictate pricing strategies
- Favor certain price points in search rankings (price is one signal among many)
- Penalize operators for pricing decisions
- Guarantee occupancy or revenue outcomes

## 2.3. Transparency Over Automation

**Guiding Principle:**
> When AI provides pricing signals, operators must understand the reasoning and retain full control to accept, reject, or modify suggestions.

**Requirements:**
- AI signals are presented as **suggestions**, not directives
- Reasoning is explainable and transparent
- Operators can ignore AI signals without consequence
- Historical operator decisions inform future suggestions (when implemented)

## 2.4. No Binding Commitments

**Critical Clarification:**
AI pricing assistance, when available, does NOT create:
- Contractual obligations
- Performance guarantees
- Revenue targets
- Liability for business outcomes

AI signals are **advisory information only**.

---

# 3. MVP v1 Pricing Baseline

## 3.1. Current MVP v1 Implementation

**Pricing Model:**
- **Manual Only:** Operators set prices via operator dashboard
- **Fixed Pricing:** One price per box type (no time-based variations in MVP)
- **Direct Control:** Operators edit `boxes.price_monthly` field directly
- **No AI:** Zero AI involvement in pricing

**Data Model (Reference):**
```sql
-- From full_database_specification_mvp_v1_CANONICAL.md
CREATE TABLE boxes (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER NOT NULL,
  price_monthly INTEGER NOT NULL,  -- Operator sets directly
  -- ... other fields
);
```

**Business Rules:**
- Price changes affect new bookings immediately
- Active bookings retain original price (no retroactive changes)
- No minimum or maximum price enforced by platform
- No dynamic pricing based on demand, season, or competition

## 3.2. Operator Workflow (MVP v1)

**Setting Prices:**
1. Operator navigates to warehouse management
2. Operator selects box to price
3. Operator enters monthly rental price
4. Platform saves price to database
5. New price visible to users immediately

**Changing Prices:**
- Operators can update prices anytime
- No AI approval or recommendation required
- No waiting period or validation beyond basic sanity checks (price > 0)

## 3.3. Platform Guarantees (MVP v1)

**What Platform Guarantees:**
- ✅ Display prices exactly as operator sets them
- ✅ Process bookings at displayed price
- ✅ Enforce price stability for active bookings
- ✅ Provide price history tracking (internal)

**What Platform Does NOT Guarantee:**
- ❌ Optimal pricing
- ❌ Competitive positioning
- ❌ Occupancy rates
- ❌ Revenue maximization
- ❌ Market alignment

---

# 4. AI Pricing Assistance (Conceptual)

## 4.1. Overview of AI Advisory Role

**When AI Pricing Features Are Implemented (v2+):**
AI may provide operators with:
- Market context and comparative data
- Directional insights about pricing position
- Optional suggestions for pricing review
- Explanations of pricing-related patterns

**What AI Does:**
- Analyzes publicly available pricing data
- Identifies market position of operator's prices
- Highlights pricing outliers or anomalies
- Suggests considerations for review

**What AI Does NOT Do:**
- Set or change prices automatically
- Enforce pricing strategies
- Guarantee outcomes
- Access competitor cost structures
- Predict future market conditions with certainty

## 4.2. Conceptual AI Signals (No Formulas)

**Illustrative Example Signals:**

**Market Position Signal:**
> "Your price of 5,000 AED/month is positioned at the 65th percentile of comparable boxes in your area."

**Comparative Context Signal:**
> "Similar boxes within 2km range from 4,200 to 6,500 AED/month. Median: 4,700 AED."

**Directional Insight Signal:**
> "Prices in your category have shown stable patterns over the past 3 months."

**Note:** These are conceptual examples. Actual implementation, if pursued, would be defined separately in technical specifications.

## 4.3. Data Sources (Conceptual)

AI pricing signals, if implemented, would rely on:
- **Platform data:** Pricing of other warehouses (public)
- **Warehouse attributes:** Size, location, features
- **Historical trends:** Past pricing patterns (aggregated)
- **Booking patterns:** Occupancy and demand signals (aggregated)

**NOT Used:**
- Competitor's internal costs or margins
- Proprietary business strategies
- Non-public pricing negotiations
- Individual user behavior profiling

## 4.4. Scenario Exploration (Optional Tool)

Operators may optionally use AI to explore pricing scenarios:

**Example Use Case:**
> "What if I reduce my price to 4,500 AED/month? Show me comparative position."

**Response:**
> "At 4,500 AED/month, your box would position at the 40th percentile. This is informational only—platform cannot predict demand changes."

**Critical:** Scenario exploration provides **information**, not **predictions** or **guarantees**.

---

# 5. Manual vs AI Pricing Interaction

## 5.1. Operator Decision Flow (v2+)

**When AI Signals Are Available:**

```
1. Operator logs into dashboard
   ↓
2. Operator navigates to pricing management
   ↓
3. Platform displays current prices
   ↓
4. [OPTIONAL] Operator requests AI insights
   ↓
5. AI presents market context and suggestions
   ↓
6. Operator reviews AI signals
   ↓
7. Operator decides: Accept / Modify / Ignore
   ↓
8. Operator manually updates price (if desired)
   ↓
9. Platform saves operator-set price
   ↓
10. No AI auto-application ever occurs
```

## 5.2. AI Signal Presentation

**UI Principles (Conceptual):**
- AI signals clearly labeled as "suggestions" or "insights"
- Operator action always required to change price
- Operator can dismiss AI signals permanently or temporarily
- No dark patterns or pressure to accept suggestions

**Example UI (Illustrative):**
```
┌─────────────────────────────────────────┐
│ Current Price: 5,000 AED/month          │
│                                         │
│ [AI Insight Available] (Optional)       │
│                                         │
│ Market Position: 65th percentile        │
│ Suggestion: Consider reviewing price    │
│ Reasoning: Similar boxes average 4,700  │
│                                         │
│ [View Details] [Dismiss] [Keep Current] │
│                                         │
│ [Update Price Manually] ← Always Visible│
└─────────────────────────────────────────┘
```

## 5.3. Optional Adoption Model

**Operator Choice:**
- Operators can enable or disable AI pricing insights
- No penalty for disabling AI features
- No preferential treatment for AI users
- Platform functionality fully available without AI

**Default State:**
- AI pricing insights OFF by default (opt-in)
- Operators must explicitly activate feature
- Clear explanation of what AI does and doesn't do

## 5.4. Override Always Possible

**Absolute Rule:**
> At any time, operators can set any price they choose, regardless of AI suggestions.

**No Restrictions:**
- No minimum adherence to AI suggestions
- No warnings for deviating from AI recommendations
- No impact on search ranking or visibility
- No platform intervention

---

# 6. What AI Pricing Does NOT Do

## 6.1. No Automatic Price Updates

**Explicit Prohibition:**
AI NEVER changes prices automatically. Every price change requires operator action.

**Scenarios Explicitly Excluded:**
- ❌ Real-time dynamic pricing based on demand
- ❌ Automated price adjustments during peak periods
- ❌ Algorithmic price increases or decreases
- ❌ Competition-triggered price changes
- ❌ Event-based pricing (holidays, local events)

## 6.2. No Competitive Price Enforcement

**What Platform Does NOT Do:**
- Force operators to match competitor prices
- Penalize operators for pricing above/below market
- Implement minimum or maximum price thresholds (beyond basic sanity)
- Create pricing cartels or coordination

**Operator Freedom:**
Operators can price higher or lower than market average without platform interference.

## 6.3. No Revenue Guarantees

**AI Cannot and Does Not Guarantee:**
- Increased occupancy rates
- Higher revenue
- Faster booking conversions
- Competitive advantages
- Market share growth

**Explicit Disclaimer:**
> AI pricing signals are informational only. Platform makes no representations about business outcomes. Operators assume all business risk.

## 6.4. No Predictive Commitments

**Forecasting Limitations:**
AI does NOT provide:
- Future demand predictions with certainty
- Market trend forecasts
- Seasonal pricing optimization
- Demand elasticity calculations
- Revenue projections

**Static Analysis Only (MVP → v2):**
AI works with current and historical data, not predictive models.

## 6.5. No Access to Confidential Data

**Data Boundaries:**
AI pricing modules do NOT access:
- Competitor internal cost structures
- Proprietary operator strategies
- Non-public negotiations
- Individual customer financial information
- Payment processing details

## 6.6. No Pricing Strategy Enforcement

**Platform Neutrality:**
Platform does not:
- Promote specific pricing strategies (penetration, premium, etc.)
- Favor certain pricing approaches in search results
- Punish pricing experimentation
- Impose standardized pricing models

---

# 7. Transparency & Explainability

## 7.1. Explainability Requirement

**When AI Provides Pricing Signals:**
Operators must be able to understand:
- **What** the signal means
- **Why** AI generated this signal
- **How** AI arrived at the conclusion
- **What data** was used

**No Black Box Pricing:**
AI pricing must be explainable to non-technical operators.

## 7.2. Three Levels of Explanation

**Level 1: Summary (Always Shown)**
> "Your price is higher than 60% of similar boxes nearby."

**Level 2: Reasoning (On Request)**
> "We compared your box (10m², climate-controlled) to 8 similar boxes within 3km. Your price: 5,000 AED. Average: 4,700 AED. Median: 4,650 AED."

**Level 3: Detailed Analysis (Optional)**
> "Data sources: 8 warehouses in Moscow Southeast district. Filters: Size 8-12m², climate control present, active listings. Date range: Last 30 days. Outliers removed: 1 box priced at 12,000 AED (event storage)."

## 7.3. Driver Visibility

**AI Must Expose:**
- Geographic scope of comparison
- Time period analyzed
- Filters applied (size, features, location)
- Number of comparable boxes
- Statistical methods used (median, percentile, etc.)

**Operators Can Verify:**
- Platform provides links to comparable warehouses (if public)
- Operators can manually verify market data
- Operators can challenge AI logic if suspicious

## 7.4. Avoiding "Black Box" Perception

**Design Principles:**
- Use plain language, not technical jargon
- Provide visual aids (graphs, maps, tables)
- Allow operators to drill down into data
- Offer feedback mechanisms ("Is this helpful?")

**Trust Building:**
AI pricing earns operator trust through consistent transparency, not algorithmic complexity.

---

# 8. Relation to Other Documents

## 8.1. AI_Core_Design_MVP_v1_CANONICAL.md

**Relationship:**
DOC-064 extends and governs the pricing intelligence module described in AI_Core_Design_MVP_v1_CANONICAL.md.

**Alignment:**
- AI Core defines pricing intelligence as **advisory only** ✅
- AI Core prohibits automatic price setting ✅
- AI Core focuses on market context, not predictions ✅

**Reference Section:**
AI_Core_Design_MVP_v1_CANONICAL.md, Section 4.2: Pricing Intelligence

**Key Quote:**
> "Does not set prices, does not predict future market trends, does not enforce pricing strategies."

## 8.2. full_database_specification_mvp_v1_CANONICAL.md

**Relationship:**
Database schema supports manual pricing only (MVP v1). Future pricing history table (post-MVP) would enable AI trend analysis.

**MVP v1 Schema:**
- `boxes.price_monthly` — Operator-set price (direct control)
- No `prices` table (fixed pricing only)

**Future (v2+):**
- `prices` table may track pricing history
- Enables AI to analyze operator pricing patterns
- Still requires operator action to create new price records

## 8.3. Functional_Specification_MVP_v1_Complete.md

**Relationship:**
Functional specification excludes AI pricing from MVP v1 scope.

**Confirmed:**
> "AI-powered price optimization" listed as v1.1+ (not MVP)

**Governance Alignment:**
DOC-064 formalizes why AI pricing is post-MVP and what guardrails apply.

## 8.4. Security_and_Compliance_Plan_MVP_v1.md

**Relationship:**
Pricing data has regulatory implications (price transparency, competition law, consumer protection).

**Considerations:**
- AI pricing signals must not facilitate price fixing
- Operators remain independent pricing entities
- Platform avoids creating pricing cartels
- Transparency prevents deceptive practices

## 8.5. DOC-063: Operator Experience (OX)

**Relationship:**
Operator UX must clearly communicate pricing control and AI advisory nature.

**UX Requirements:**
- Pricing controls prominently accessible
- AI signals clearly labeled as optional
- No UI dark patterns pressuring AI adoption
- Override mechanisms always visible

---

# 9. Non-Goals & Explicit Exclusions

## 9.1. Not a Dynamic Pricing System

**Clarification:**
This document does NOT describe a dynamic pricing system where prices adjust automatically based on:
- Real-time demand
- Competitor actions
- Seasonal patterns
- Inventory levels
- User behavior

**Reason for Exclusion:**
Dynamic pricing systems create regulatory, operational, and user trust risks that are beyond MVP/v2 scope.

## 9.2. Not a Revenue Optimization Engine

**Clarification:**
This document does NOT specify a revenue optimization engine that:
- Maximizes operator revenue algorithmically
- Balances occupancy vs pricing trade-offs
- Implements surge pricing
- Forecasts future revenue

**Reason for Exclusion:**
Revenue optimization requires predictive models, experimentation infrastructure, and operator opt-in programs not in scope.

## 9.3. Not a Price-Setting Authority

**Clarification:**
Platform is NOT:
- A pricing regulator
- A price-setting authority
- A guarantor of pricing outcomes
- A pricing strategy consultant

**Platform Role:**
Platform is a neutral marketplace facilitating operator-customer connections.

## 9.4. Not a Mandatory System

**Clarification:**
AI pricing assistance is NOT:
- Required for platform participation
- Enforced on operators
- A prerequisite for good search ranking
- A platform revenue source

**Operator Choice:**
Operators can ignore AI features entirely without consequence.

---

# 10. Risks & Misuse Scenarios

## 10.1. Identified Risks

### Risk 1: Over-Trust in AI Signals

**Scenario:**
Operator blindly follows AI suggestions without critical evaluation, leading to suboptimal pricing for their specific context.

**Mitigation:**
- Emphasize AI signals are **suggestions**, not instructions
- Require operator confirmation for every price change
- Provide explainability so operators can assess quality
- Encourage operators to apply local knowledge

### Risk 2: Operator Confusion About Authority

**Scenario:**
Operator believes AI controls pricing or that ignoring AI will harm their business.

**Mitigation:**
- Clear UI labels: "Suggestion," "Insight," "Optional"
- Explicit messaging: "You are in control"
- No penalties for declining AI suggestions
- Transparent documentation

### Risk 3: Regulatory Perception Risks

**Scenario:**
Regulators perceive platform as facilitating price fixing or anti-competitive behavior through AI coordination.

**Mitigation:**
- Platform does not share individual operator pricing strategies
- AI analyzes public data only
- Operators make independent decisions
- No algorithmic price enforcement
- Legal review before AI pricing launch

### Risk 4: Unfair Pricing Concerns

**Scenario:**
AI suggestions inadvertently guide operators toward discriminatory or exploitative pricing.

**Mitigation:**
- AI uses aggregated market data, not user demographics
- No personalized pricing by customer segment
- Operators retain liability for pricing decisions
- Platform monitors for systemic pricing issues

### Risk 5: Expectation Mismatch

**Scenario:**
Operators expect guaranteed results from AI pricing and blame platform when outcomes differ.

**Mitigation:**
- Explicit disclaimers about no guarantees
- Education on AI limitations
- Transparent success metrics (if any)
- Clear liability boundaries

## 10.2. Misuse Scenarios

### Misuse 1: Price Fixing Facilitation

**Prohibited Use:**
Operators collude using AI signals to coordinate prices.

**Prevention:**
- AI does not facilitate inter-operator communication on pricing
- No shared pricing chat rooms or forums
- Platform terms prohibit collusion
- Monitoring for suspicious pricing patterns

### Misuse 2: Predatory Pricing

**Prohibited Use:**
AI signals encourage below-cost pricing to eliminate competitors.

**Prevention:**
- AI does not recommend pricing below operator-defined thresholds
- Platform does not incentivize aggressive undercutting
- Operators responsible for sustainable pricing

### Misuse 3: Algorithmic Discrimination

**Prohibited Use:**
AI pricing suggestions vary by protected user characteristics.

**Prevention:**
- AI pricing based on warehouse attributes only, not user data
- No user profiling for pricing
- Compliance with anti-discrimination laws

## 10.3. Monitoring & Governance

**Ongoing Responsibilities:**
- Platform monitors AI pricing signal quality
- Regular audits of AI recommendations
- Operator feedback collection
- Legal compliance reviews
- Adjustment of AI logic if risks emerge

**Escalation Path:**
If AI pricing creates regulatory, ethical, or business risks, platform may:
- Pause AI pricing features
- Revise algorithms
- Increase transparency
- Disable features if necessary

---

## Conclusion

DOC-064 establishes a **governance framework** that prioritizes operator control, transparency, and risk management in pricing. It ensures that any future AI pricing assistance remains **advisory, optional, and explainable**, never replacing operator judgment or guaranteeing business outcomes.

**Key Takeaways:**
1. ✅ Operators own final pricing authority
2. ✅ AI provides insights, NOT automation
3. ✅ Platform is neutral intermediary
4. ✅ Transparency and explainability required
5. ✅ No guarantees, no automatic changes
6. ✅ Regulatory and ethical risks managed

**Status:**
This document defines principles and boundaries. Technical implementation details, if pursued, must align with this governance framework and be specified in separate technical documents.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-18 | Claude (Anthropic) | Initial release |

---

## Related Documents

**Primary References:**
- AI_Core_Design_MVP_v1_CANONICAL.md (Section 4.2: Pricing Intelligence)
- full_database_specification_mvp_v1_CANONICAL.md (Boxes table, pricing fields)
- Functional_Specification_MVP_v1_Complete.md (Feature scope)
- Security_and_Compliance_Plan_MVP_v1.md (Regulatory considerations)

**Supporting References:**
- DOC-063: Operator Experience (UX implications)
- api_design_blueprint_mvp_v1.md (API contracts)
- Technical_Architecture_Document_FULL.md (System architecture)

---

**END OF DOCUMENT**
