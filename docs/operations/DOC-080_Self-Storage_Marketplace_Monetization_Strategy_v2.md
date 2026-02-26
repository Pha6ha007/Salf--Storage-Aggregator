# DOC-080 — Self-Storage Marketplace Monetization Strategy (v2)

**Self-Storage Aggregator Platform**

---

> **Document Status:** 🟡 Supporting / Strategy Specification  
> **Canonical:** ❌ No  
> **MVP Scope:** ❌ Out of scope  
>
> This document describes potential monetization models and strategies for future iterations of the marketplace.  
> **Nothing in this document constitutes a commitment, guarantee, or binding obligation.**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Version** | 2.0 |
| **Date** | December 16, 2025 |
| **Project** | Self-Storage Aggregator Post-MVP / v2 |
| **Document Type** | Strategy / Business Model Exploration |
| **Status** | Draft â€" For Discussion Only |
| **Authors** | Business Strategy & Product Team |
| **Target Audience** | Founders, Product Managers, Growth, Finance, Partnerships |
| **Phase** | Post-MVP / v2 Planning |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Monetization Principles](#2-monetization-principles)
3. [Primary Monetization Models](#3-primary-monetization-models)
4. [Secondary & Optional Models](#4-secondary--optional-models)
5. [Experimentation Strategy](#5-experimentation-strategy)
6. [Risks & Constraints](#6-risks--constraints)
7. [Relationship to Canonical Documents](#7-relationship-to-canonical-documents)
8. [Non-Goals](#8-non-goals)
9. [Open Questions](#9-open-questions)

---

## 1. Introduction

### 1.1. Purpose

This document explores potential monetization strategies for the Self-Storage Aggregator marketplace beyond the MVP v1 launch. It serves as:

- **Strategic reference** for business model discussions
- **Framework** for experimentation and hypothesis testing
- **Context** for product and growth teams evaluating revenue options
- **Alignment tool** for understanding trade-offs between monetization approaches

**What this document IS:**
- A collection of potential monetization models
- A framework for thinking about revenue generation
- A starting point for experiments and tests
- A living document subject to change

**What this document IS NOT:**
- A commitment to implement any specific model
- A guarantee of revenue or profitability
- A technical specification or implementation plan
- A contract or binding agreement

### 1.2. Scope: Post-MVP / v2

**Explicit Timing:**
- MVP v1 launches with **no monetization** — platform focuses on user acquisition, operator onboarding, and product-market fit
- v2 (earliest Q2 2026) is the **earliest** phase where monetization experiments may begin
- All monetization features require explicit product decisions and may be delayed or canceled

**Why Not MVP v1:**
- Focus on building trust and adoption first
- Need operational data to validate pricing hypotheses
- Regulatory and compliance complexity requires careful planning
- Payment infrastructure and billing systems require significant engineering effort

### 1.3. Non-Goals

This document explicitly **does not**:

- ❌ Define specific commission percentages or subscription prices
- ❌ Specify billing implementation, payment processing, or invoicing systems
- ❌ Describe API endpoints, database schema, or frontend UI
- ❌ Create legal contracts, operator agreements, or terms of service
- ❌ Guarantee revenue targets, profitability timelines, or financial projections
- ❌ Mandate any particular monetization model as "the chosen one"
- ❌ Change or override MVP v1 requirements or canonical specifications

---

## 2. Monetization Principles

All potential monetization approaches must align with core platform values and strategic objectives.

### 2.1. Fairness

**Definition:** Monetization should not create unfair advantages or disadvantages for operators or users.

**Implications:**
- Operators of different sizes should have access to platform benefits
- Users should not experience degraded experiences based on operator participation in paid features
- Pricing should reflect actual value delivered, not arbitrary extraction
- Free and paid tiers (if any) should have clear value propositions

**Anti-Patterns to Avoid:**
- Penalizing operators who don't pay (e.g., hiding their listings)
- Creating artificial scarcity to drive upgrades
- Opaque pricing that varies unpredictably
- "Pay-to-win" dynamics where money replaces quality

### 2.2. Transparency

**Definition:** All monetization mechanisms must be clearly communicated and predictable.

**Implications:**
- Operators understand exactly what they pay for and when
- Users understand if/how monetization affects their experience
- Pricing structures are documented and accessible
- Changes to pricing or models are communicated with advance notice

**Anti-Patterns to Avoid:**
- Hidden fees or surprise charges
- Retroactive price changes without warning
- Unclear value propositions for paid features
- Complex pricing tiers that confuse rather than clarify

### 2.3. Operator Trust

**Definition:** Monetization must not erode operator trust in the platform.

**Implications:**
- Operators feel they receive value for money spent
- Platform is seen as partner, not adversary
- Monetization aligns with operator success (not just platform revenue)
- Operators have control over participation in monetization programs

**Anti-Patterns to Avoid:**
- Forced upgrades or "freemium traps"
- Deceptive marketing of paid features
- Changing rules mid-game without operator input
- Prioritizing short-term revenue over long-term relationships

### 2.4. Long-Term Value

**Definition:** Monetization strategies prioritize sustainable platform growth over short-term extraction.

**Implications:**
- Focus on expanding the pie (more bookings, more operators) rather than just taking larger slices
- Invest revenue back into platform improvements
- Balance operator costs with user benefits
- Avoid monetization that drives operators or users away

**Anti-Patterns to Avoid:**
- Aggressive monetization that kills the marketplace
- Over-reliance on single revenue stream
- Ignoring competitive dynamics in pricing
- Sacrificing user experience for revenue

### 2.5. Experimentation-First

**Definition:** All monetization approaches should be testable, measurable, and reversible.

**Implications:**
- Start with small-scale experiments before broad rollout
- Gather data on operator adoption and user impact
- Be willing to kill models that don't work
- Iterate based on feedback and metrics

**Anti-Patterns to Avoid:**
- Committing to monetization model before validation
- Ignoring negative feedback because revenue is flowing
- Making monetization changes irreversible
- Treating all markets/regions the same without testing

---

## 3. Primary Monetization Models

These are the most commonly discussed models for marketplace monetization. Each has trade-offs and requires validation.

### 3.1. Commission per Booking

**Concept:**  
Platform charges operators a percentage of each confirmed booking's total rental value.

#### When Applicable

- After payment infrastructure is built (v1.1+)
- When transaction volume justifies processing overhead
- In markets where commission models are standard
- When platform demonstrates clear value (lead quality, conversion, etc.)

#### How It Works (Conceptual)

- Operator receives booking confirmation from user
- User pays operator directly (or through platform if payment processing added)
- Platform calculates commission based on booking value
- Commission invoiced or deducted automatically
- Operator remits commission to platform

#### Value Proposition for Operators

- **Pay only for results:** Commission charged only on successful bookings, not leads or impressions
- **Lower upfront cost:** No subscription or fixed fees (in pure commission model)
- **Scalable:** Operators with fewer bookings pay less; high-volume operators pay more but also earn more
- **Risk-aligned:** Platform shares risk if it fails to deliver quality leads

#### Value Proposition for Platform

- **Revenue scales with volume:** More bookings = more revenue
- **Aligns incentives:** Platform motivated to drive quality bookings
- **Simple pricing:** Easy to communicate and understand
- **Industry standard:** Familiar model in marketplace contexts

#### Trade-Offs & Challenges

**Pros:**
- Directly ties platform revenue to value delivered
- No fixed costs for operators
- Encourages platform to optimize conversion
- Flexible for operators of all sizes

**Cons:**
- Requires payment processing infrastructure
- Complex accounting and reconciliation
- Potential disputes over booking attribution
- May discourage operators from using platform if margins are tight
- Commission percentage must balance platform viability with operator profitability

#### Risks

- **Operator churn:** High commissions may push operators to direct bookings
- **Revenue volatility:** Highly dependent on booking volume
- **Competitive pressure:** If competitors offer lower commissions, operators may leave
- **Attribution challenges:** Difficult to prove platform caused booking if user contacts operator directly
- **Regulatory:** Commission structures may face scrutiny in some jurisdictions

#### Unknowns Requiring Validation

- What commission percentage balances platform revenue with operator acceptance?
- How do operators respond to commission vs. subscription models?
- What is the typical conversion rate from lead to booking?
- How many operators attempt to circumvent platform to avoid commissions?
- Does commission model work for all warehouse types (small vs. large, budget vs. premium)?

---

### 3.2. Subscription for Operators

**Concept:**  
Operators pay recurring monthly or annual fee for access to platform features, regardless of booking volume.

#### Tier Structure (Conceptual)

**Free Tier (Basic):**
- Limited warehouse listings (e.g., 1-2 warehouses)
- Standard search visibility
- Basic dashboard metrics
- Email support

**Paid Tier(s) (Growth / Pro / Enterprise):**
- Unlimited warehouse listings
- Enhanced search visibility (non-preferential placement)
- Advanced analytics and reporting
- Priority support
- Access to promotional tools (if developed)
- API access (if developed)

#### Value Proposition for Operators

- **Predictable costs:** Fixed monthly fee, easy to budget
- **No transaction fees:** Keep 100% of booking revenue (in pure subscription model)
- **Access to tools:** Pay for features, not just lead flow
- **Scalable tiers:** Operators choose tier matching their business size

#### Value Proposition for Platform

- **Predictable revenue:** Subscription revenue is more stable than commission
- **Decouples from volume:** Revenue not dependent on booking fluctuations
- **Simpler accounting:** No need to track individual transactions
- **Focus on retention:** Incentivizes building long-term value, not just transaction volume

#### Trade-Offs & Challenges

**Pros:**
- Predictable cash flow for platform and operators
- No payment processing complexity (operators handle payments directly)
- Simpler attribution (operators pay for access, not results)
- Easier to scale (no per-transaction overhead)

**Cons:**
- May be barrier to entry for small operators
- Requires demonstrating value before operators commit
- Fixed costs may feel unfair if operator doesn't get bookings
- Difficult to price without knowing operator willingness-to-pay
- Less alignment between platform success and operator success

#### Risks

- **Low adoption:** Operators unwilling to pay fixed fee without proven ROI
- **Churn risk:** Operators cancel if value not demonstrated monthly
- **Pricing pressure:** Competitors may offer lower subscriptions
- **Feature bloat:** Pressure to keep adding features to justify subscriptions
- **Market segmentation:** Single price may not work across different operator sizes/regions

#### Unknowns Requiring Validation

- What subscription price is acceptable to operators?
- What features are valuable enough to justify monthly payment?
- How many operators would choose free vs. paid tiers?
- What is typical churn rate in subscription model?
- Does subscription model work better in some regions or market segments?

---

### 3.3. Featured Listings / Promotional Placements

**Concept:**  
Operators pay for enhanced visibility or promotional placement in search results and listings.

#### Mechanisms (Examples)

- **Sponsored search results:** Top 1-3 positions in search marked as "sponsored"
- **Homepage features:** Warehouse highlighted on homepage carousel
- **Category boosting:** Priority placement in specific geographic or size categories
- **Badge/label:** "Featured Operator" or "Premium Listing" badge

#### Value Proposition for Operators

- **Increased visibility:** More users see their warehouses
- **Competitive edge:** Stand out from competitors in crowded markets
- **Performance-based:** Operators can test and measure ROI of promotional spend
- **Control:** Operators choose when and how much to spend on promotion

#### Value Proposition for Platform

- **Additional revenue stream:** Supplements or replaces commission/subscription
- **Low friction:** Operators can try promotion without committing to subscription
- **Flexible pricing:** Can adjust based on demand (auction-based or fixed price)
- **User experience neutral:** Can be implemented without degrading free listings

#### Trade-Offs & Challenges

**Pros:**
- Simple to implement (no payment processing needed initially)
- Clear ROI measurement for operators
- Users still have access to all listings (just ordering changes)
- Operators control spending and can start/stop easily

**Cons:**
- May feel like "pay-to-win" if overused
- Risk of degrading organic search quality
- Users may distrust "sponsored" results
- Requires careful balance to avoid alienating non-paying operators
- Potential regulatory scrutiny (advertising disclosure requirements)

#### Fairness Constraints

To maintain trust and avoid abuse:

- **Disclosure:** Clearly label sponsored/promoted listings
- **Quality threshold:** Only allow promotion of high-quality, verified warehouses
- **Limit density:** Cap percentage of sponsored results (e.g., max 20% of search page)
- **Organic fallback:** Ensure free listings still get reasonable visibility
- **No exclusion:** Promotion enhances visibility but doesn't hide competitors

#### Risks

- **User trust erosion:** Users may view platform as "bought and paid for" if overused
- **Operator resentment:** Non-paying operators may feel unfairly disadvantaged
- **Regulatory compliance:** Advertising laws may require specific disclosures
- **Gaming behavior:** Operators may bid up placements, creating unsustainable costs

#### Unknowns Requiring Validation

- How much visibility lift does featured placement actually provide?
- What price are operators willing to pay for promotion?
- How do users perceive sponsored listings?
- What percentage of promoted listings is acceptable before user experience degrades?
- Does promotion work better as fixed price or auction model?

---

## 4. Secondary & Optional Models

These models may complement primary monetization or serve niche use cases. They are lower priority and require more validation.

### 4.1. Lead-Based Pricing

**Concept:**  
Platform charges operators per qualified lead (user inquiry or booking request), regardless of conversion.

**When Applicable:**
- If commission or subscription models don't gain traction
- In markets where lead generation pricing is standard
- For operators who want more predictable costs than commission

**Value Proposition:**
- Operators pay only for leads, not for platform access
- Platform incentivized to deliver quality leads
- Simpler than commission (no need to track conversions)

**Challenges:**
- Requires defining "qualified lead" (attribution complexity)
- May incentivize platform to prioritize quantity over quality
- Operators may dispute lead quality
- Difficult to price without knowing conversion rates

**Status:** Low priority, requires market validation.

---

### 4.2. Data & Insights Access

**Concept:**  
Platform sells aggregated market data, demand analytics, or competitive insights to operators or third parties.

**Potential Products:**
- Market reports (demand trends by region, size, price)
- Competitive analysis (how operator pricing compares to market)
- Demand forecasting (predicted high-demand periods)
- Customer insights (anonymized booking patterns)

**Value Proposition:**
- Operators gain strategic business intelligence
- Platform monetizes data without affecting user experience
- Third parties (investors, researchers) may pay for market insights

**Challenges:**
- Requires significant data volume to be meaningful
- Privacy and compliance constraints (GDPR, data sharing agreements)
- Risk of creating information asymmetry between paying and non-paying operators
- Complex to price and package

**Status:** Future exploration, likely v3+.

---

### 4.3. Premium Analytics Dashboard

**Concept:**  
Operators pay for advanced analytics beyond basic MVP metrics (occupancy, booking counts).

**Potential Features:**
- Revenue forecasting and trends
- Customer demographics and behavior analysis
- Booking channel attribution (organic search, paid ads, direct)
- Pricing optimization recommendations
- Competitive benchmarking

**Value Proposition:**
- Operators make data-driven business decisions
- Goes beyond basic metrics to actionable insights
- Could be part of paid subscription tier or separate add-on

**Challenges:**
- Requires building analytics infrastructure (out of MVP scope)
- Operators may not value analytics enough to pay separately
- May be better bundled with subscription tier

**Status:** Possible add-on to subscription model in v2.

---

### 4.4. AI-Powered Tools (Future)

**Concept:**  
Charge operators for AI-powered features beyond basic MVP offerings.

**Potential Tools:**
- AI-generated warehouse descriptions (SEO-optimized, multi-language)
- Dynamic pricing recommendations based on demand
- Automated response suggestions for customer inquiries
- Predictive demand modeling

**Value Proposition:**
- Operators save time and improve listing quality
- AI features differentiate platform from competitors
- Could be premium add-ons or part of higher subscription tiers

**Challenges:**
- AI features are out of MVP scope (except Box Finder)
- Requires significant development effort
- Uncertain operator willingness to pay for AI tools
- Quality and reliability concerns

**Status:** v2+ exploration, not prioritized for initial monetization.

---

## 5. Experimentation Strategy

All monetization approaches should be hypothesis-driven, tested incrementally, and validated before broad rollout.

### 5.1. Hypothesis-Driven Rollout

**Approach:**  
Treat each monetization model as an experiment with clear hypotheses, success metrics, and decision criteria.

**Example Hypothesis (Commission Model):**
- **Hypothesis:** Operators will accept a 10% commission if it drives quality bookings and the platform provides transparent attribution.
- **Success Metrics:** 
  - At least 50% of operators opt-in to commission model
  - Average operator LTV exceeds CAC by 3x
  - Operator churn rate stays below 10% annually
  - User booking conversion rate maintained or improved
- **Decision Criteria:** If metrics met after 6 months, expand; if not, adjust pricing or pivot to subscription.

**Example Hypothesis (Subscription Model):**
- **Hypothesis:** Operators are willing to pay $99/month for premium features (unlimited warehouses, analytics, priority support).
- **Success Metrics:**
  - At least 20% of active operators upgrade to paid tier within 3 months
  - Paid tier operators have 50% higher engagement than free tier
  - Operator satisfaction scores remain above 4.0/5.0
- **Decision Criteria:** If adoption rate below 10%, reduce price or improve feature set; if above 30%, consider higher tier.

### 5.2. Regional / Segmented Testing

**Approach:**  
Test monetization in limited geographic regions or operator segments before global rollout.

**Testing Dimensions:**

**Geography:**
- Start with single city or region (e.g., Moscow, St. Petersburg)
- Test different pricing in different regions
- Adapt to local market norms and competitive dynamics

**Operator Size:**
- Test different models with small vs. large operators
- Small operators may prefer subscription; large may prefer commission
- Enterprise operators may need custom pricing

**Operator Maturity:**
- Test with new operators vs. established operators
- Early adopters may accept different terms than later entrants

**Benefits:**
- Limits risk of alienating entire operator base
- Allows learning and iteration before scaling
- Can customize approach based on segment needs

**Risks:**
- Operators in different regions may compare and demand uniform pricing
- Complexity of managing multiple pricing structures
- Potential perception of unfairness

---

### 5.3. Opt-In Models & Rollback Safety

**Principle:** All initial monetization experiments should be **opt-in**, not mandatory.

**Implementation:**

**Phase 1: Invitation-Only**
- Invite 10-20 operators to test monetization model
- Gather qualitative feedback alongside quantitative metrics
- Iterate based on feedback before wider rollout

**Phase 2: Opt-In Launch**
- Open to all operators, but voluntary participation
- Clear value proposition communicated upfront
- Operators can try, evaluate, and opt-out without penalty

**Phase 3: Default with Opt-Out**
- Once validated and refined, may become default for new operators
- Existing operators can still opt-out if preferred
- Maintain free tier or alternative options

**Rollback Safety:**

- All monetization changes should be **reversible**
- If experiment fails or causes harm, platform can roll back quickly
- Operators should not be locked into long-term contracts during experimental phase
- Communicate clearly that pricing/models may change as platform learns

**Reference:**  
This approach aligns with **DOC-003 (A/B Testing Framework)** and experimentation principles in **DOC-031 (Configuration Management Strategy)**, which emphasize testability and safe feature toggles.

---

## 6. Risks & Constraints

All monetization strategies carry risks that must be understood and mitigated.

### 6.1. Regulatory Risks

**Challenge:**  
Marketplace commission structures, data pricing, and advertising models may face regulatory scrutiny.

**Specific Concerns:**

- **Antitrust / Competition Law:** If platform becomes dominant, commission rates or preferential placement may be challenged
- **Consumer Protection:** Sponsored listings require clear disclosure per advertising regulations
- **Data Privacy (GDPR / 152-ФЗ):** Selling aggregated data or insights must comply with data processing laws
- **Tax Compliance:** Commission or subscription revenue may trigger complex tax obligations across jurisdictions

**Mitigation:**

- Consult legal counsel before launching monetization features
- Reference **DOC-078 (Security & Compliance Plan)** and **Legal Documentation Guide** for compliance framework
- Build transparency and fairness into models from the start
- Monitor regulatory developments in marketplace and platform sectors

---

### 6.2. Operator Churn Risk

**Challenge:**  
Aggressive monetization may cause operators to leave platform, reducing marketplace liquidity.

**Drivers of Churn:**

- High commission rates perceived as unfair
- Subscription fees without demonstrated ROI
- Platform changes that reduce organic visibility (favoring paid operators)
- Better alternatives (competitors with lower fees)
- Difficulty using platform or poor support

**Mitigation:**

- Test pricing and gather feedback before broad rollout
- Maintain high-quality operator support and platform usability
- Clearly demonstrate value operators receive for payment
- Offer flexibility (pause, downgrade, cancel) to reduce friction
- Monitor churn metrics closely and act on early warning signals

**Reference:**  
Operator satisfaction tracking and churn metrics align with **DOC-088 (Analytics & Metrics Tracking Specification)** principles.

---

### 6.3. Trust Erosion

**Challenge:**  
Monetization that feels exploitative or opaque can erode trust between platform, operators, and users.

**Symptoms:**

- Operators publicly complain about fees or fairness
- Users perceive platform as "selling out" or prioritizing revenue over quality
- Negative reviews or social media backlash
- Operators encourage users to book directly to avoid fees

**Mitigation:**

- Maintain **transparency** in all monetization practices
- Communicate changes proactively and honestly
- Ensure **fairness** in how paid/promoted listings are handled
- Focus on delivering value, not just extracting revenue
- Build trust through consistent, ethical behavior over time

**Reference:**  
Align with principles in **DOC-060 (Operator Agreement)** and trust-building strategies.

---

### 6.4. Pricing Manipulation & Gaming

**Challenge:**  
Operators or users may attempt to game monetization systems to avoid fees or gain unfair advantages.

**Examples:**

- Operators encourage users to book directly after initial platform contact (to avoid commission)
- Operators create multiple free-tier accounts to exceed limits
- Bid manipulation in auction-based featured listings
- Fake activity to appear more active and gain benefits

**Mitigation:**

- Clear terms of service prohibiting circumvention
- Attribution tracking and fraud detection (requires technical implementation)
- Penalties for operators caught gaming system (warnings, suspension)
- Align incentives so gaming is not worthwhile
- Monitor for anomalous behavior patterns

**Reference:**  
Fraud detection and monitoring align with **DOC-057 (Monitoring & Observability Plan)** and **DOC-078 (Security & Compliance Plan)**.

---

### 6.5. Market Sensitivity

**Challenge:**  
Pricing that works in one market or operator segment may not work in others.

**Factors:**

- **Geography:** Different regions have different willingness-to-pay and competitive dynamics
- **Operator Size:** Small operators more price-sensitive than large chains
- **Economic Conditions:** Recession or inflation may affect pricing tolerance
- **Competitive Landscape:** If competitors offer better terms, operators switch

**Mitigation:**

- Test regionally before scaling globally
- Offer flexible pricing tiers or customizable plans
- Monitor competitive pricing and adjust as needed
- Be willing to experiment and iterate based on feedback

---

## 7. Relationship to Canonical Documents

This strategy document **does not change or override** any CORE DOCUMENTS. It describes business possibilities that, if pursued, would require updates to canonical specifications.

### 7.1. DOC-001 â€" Functional Specification MVP v1

**Current Status:**  
MVP v1 explicitly **excludes** payment processing, billing, and monetization features.

**If Monetization Implemented:**  
Functional Specification would require updates to include:
- Payment workflows (if commission or subscription model chosen)
- Operator billing dashboards
- User impact of sponsored listings (if applicable)

**Status:** No changes needed unless/until monetization decided.

---

### 7.2. DOC-003 â€" A/B Testing Framework

**Alignment:**  
This strategy emphasizes **hypothesis-driven experimentation**, directly aligned with DOC-003.

**Application:**  
All monetization experiments should:
- Define clear hypotheses and success metrics
- Use feature flags to enable/disable monetization options
- Collect data per DOC-003 experimentation guidelines
- Make data-driven decisions on scaling or pivoting

**Status:** This strategy reinforces DOC-003 principles.

---

### 7.3. DOC-070 â€" Pricing & Monetization Strategy (MVP v1)

**Relationship:**  
DOC-070 (if it exists) describes **pricing for MVP v1** (likely operator onboarding fees, if any). This document (DOC-080) describes **post-MVP revenue models**.

**Differences:**
- DOC-070: Operational pricing (if any fees charged for verification, listing creation, etc.)
- DOC-080: Strategic monetization (how platform makes money long-term)

**Status:** DOC-080 builds on DOC-070 for v2+ planning.

---

### 7.4. DOC-060 â€" Operator Agreement

**Current Status:**  
Operator Agreement in MVP v1 defines terms of service, data usage, responsibilities, but does **not** include monetization terms.

**If Monetization Implemented:**  
Operator Agreement would require updates to include:
- Commission rates and payment terms (if applicable)
- Subscription pricing and cancellation policies (if applicable)
- Terms for featured listings and promotional services (if applicable)
- Billing disputes and resolution processes

**Status:** Legal document requires revision before any monetization launch.

---

### 7.5. DOC-078 â€" Security & Compliance Plan

**Alignment:**  
Any monetization involving payments or financial data must comply with **DOC-078** security requirements.

**Implications:**

- Payment data must be encrypted per DOC-078 standards
- Billing information is classified as PII and handled accordingly
- Fraud detection aligns with security monitoring in DOC-078
- Compliance with GDPR/152-ФЗ when processing financial transactions

**Status:** DOC-078 provides security framework for monetization features.

---

### 7.6. DOC-016 â€" API Design Blueprint

**Current Status:**  
API Blueprint defines endpoints for MVP v1, which **do not include** billing, payment, or monetization APIs.

**If Monetization Implemented:**  
New API endpoints would be required, such as:
- `POST /api/v1/billing/subscriptions` (create subscription)
- `GET /api/v1/billing/invoices` (retrieve invoices)
- `PUT /api/v1/warehouses/:id/promote` (featured listing)

**Status:** API Blueprint requires new version if monetization added.

---

### 7.7. DOC-019 â€" Database Specification

**Current Status:**  
Database schema includes tables for users, warehouses, bookings, but **no billing or payment tables**.

**If Monetization Implemented:**  
New tables would be required, such as:
- `subscriptions` (operator subscriptions)
- `transactions` (commission payments, invoices)
- `promotions` (featured listing campaigns)
- `billing_history` (audit trail)

**Status:** Database Specification requires updates for monetization.

---

### 7.8. DOC-031 â€" Configuration Management Strategy

**Alignment:**  
Monetization features should use **feature flags** per DOC-031 to enable safe experimentation and rollback.

**Application:**

- Commission rates configurable per region/segment
- Subscription tiers toggled on/off for testing
- Promoted listings enabled/disabled dynamically
- Pricing changes deployed without code changes

**Status:** DOC-031 provides infrastructure for monetization experiments.

---

## 8. Non-Goals

This document explicitly **does not**:

### 8.1. Technical Implementation

❌ **Does NOT define:**
- API endpoints for billing or payments
- Database schema for subscriptions or transactions
- Frontend UI for billing dashboards
- Payment gateway integrations (Stripe, Stripe, etc.)
- Billing automation logic
- Invoicing systems

**Why:**  
Technical implementation is the responsibility of **DOC-016 (API Blueprint)**, **DOC-019 (Database Specification)**, and **DOC-046 (Frontend Architecture Specification)** if/when monetization is approved.

---

### 8.2. Legal Contracts & Terms

❌ **Does NOT define:**
- Specific commission percentages or subscription prices
- Legal language for operator agreements or terms of service
- Payment terms, late fees, or dispute resolution processes
- Refund policies or cancellation terms
- Liability or indemnification clauses

**Why:**  
Legal contracts require legal counsel and are governed by **DOC-060 (Operator Agreement)** and **Legal Documentation Guide**.

---

### 8.3. Financial Projections & Guarantees

❌ **Does NOT provide:**
- Revenue forecasts or profitability timelines
- Operator lifetime value (LTV) or customer acquisition cost (CAC) estimates
- Break-even analysis or return on investment (ROI) calculations
- Commitments to specific revenue targets
- Guarantees of operator adoption or market acceptance

**Why:**  
Financial projections require market data, testing, and validation. This document describes **potential** models, not proven outcomes.

---

### 8.4. MVP v1 Behavior

❌ **Does NOT change:**
- MVP v1 scope (no monetization in MVP)
- API endpoints in current API Blueprint
- Database schema in current Database Specification
- Frontend architecture or user experience
- Security or compliance requirements

**Why:**  
This document is **out of MVP scope** and does not override canonical CORE DOCUMENTS.

---

## 9. Open Questions

These questions require validation through market research, operator interviews, user testing, and experiments.

### 9.1. Operator Acceptance

- What monetization model do operators prefer (commission vs. subscription vs. hybrid)?
- What commission percentage or subscription price is acceptable?
- How much value do operators place on analytics, promotion, or other premium features?
- Do small operators and large chains prefer different models?

**Validation Approach:**  
Conduct operator surveys, interviews, and pilot programs before scaling.

---

### 9.2. Regional Variation

- Do monetization preferences differ by region (Moscow vs. St. Petersburg vs. other cities)?
- Are operators in different countries or markets willing to pay different amounts?
- Does local competition affect pricing tolerance?

**Validation Approach:**  
Regional testing per Section 5.2.

---

### 9.3. User Impact

- Do users care if some listings are "sponsored" or "featured"?
- Does featured placement affect user trust or booking behavior?
- Would users accept platform-facilitated payments if it enabled better dispute resolution?

**Validation Approach:**  
User surveys, A/B testing of promoted listings, qualitative interviews.

---

### 9.4. Competitive Dynamics

- What do competitors charge (if any)?
- How do operators currently acquire customers (direct marketing, aggregators, etc.)?
- What alternatives exist if operators leave platform due to monetization?

**Validation Approach:**  
Competitive analysis, operator interviews, market research.

---

### 9.5. Technical Feasibility

- How complex is payment processing integration?
- What compliance and regulatory hurdles exist for billing systems?
- Can platform build billing infrastructure in-house or should third-party solutions be used?

**Validation Approach:**  
Technical discovery, vendor evaluations, security reviews.

---

### 9.6. Long-Term Sustainability

- Is marketplace business model viable long-term with proposed monetization?
- What happens if operator adoption is lower than expected?
- Can platform maintain quality and trust while monetizing aggressively?

**Validation Approach:**  
Financial modeling, long-term cohort analysis, iterative testing.

---

## Conclusion

This document provides a framework for thinking about monetization in post-MVP iterations. It **does not commit** the platform to any specific revenue model, pricing structure, or timeline.

**Key Takeaways:**

1. **MVP v1 has no monetization** — focus is on adoption and product-market fit
2. **Experimentation-first approach** — test hypotheses before scaling
3. **Fairness, transparency, trust** — core principles guide all monetization decisions
4. **Multiple models possible** — commission, subscription, promotion, or hybrid
5. **Reversibility required** — all experiments must be safely rollback-able
6. **Alignment with values** — monetization must not erode platform integrity

**Next Steps (if/when monetization pursued):**

1. Conduct operator surveys and interviews to validate models
2. Define specific hypotheses and success metrics
3. Update **DOC-060 (Operator Agreement)** with monetization terms
4. Extend **DOC-016 (API Blueprint)** and **DOC-019 (Database Specification)** for billing features
5. Build payment infrastructure (Stripe, Stripe integration)
6. Launch regional pilot with 10-20 operators
7. Measure, learn, iterate, scale

---

**Document Status:** 🟡 Supporting / Strategy Specification  
**Version:** 2.0  
**Last Updated:** December 16, 2025  
**Next Review:** After MVP v1 launch + 3 months of operational data

**Maintained By:** Business Strategy & Product Team  
**Contact:** [product@example.com]

---

**END OF DOCUMENT**
