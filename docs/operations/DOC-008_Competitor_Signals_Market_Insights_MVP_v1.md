# Competitor Signals & Market Insights (MVP v1)

**Document ID:** DOC-008  
**Project:** Self-Storage Aggregator  
**Status:** 🟡 Supporting / Non-Canonical  
**Target Version:** MVP v1  
**Last Updated:** December 17, 2025  
**Owner:** Product & Engineering

---

## Document Classification

| Attribute | Value |
|-----------|-------|
| **Document Type** | Supporting / Analytical Specification |
| **Scope** | MVP v1 |
| **Purpose** | Define minimal, safe competitor signal concepts for analytical reference |
| **Audience** | Product Managers, Engineering Leadership, Analysts |
| **Maturity** | Conceptual / Analytical |
| **Implementation Status** | Reference only — no automated system |

---

## ⚠️ CRITICAL SCOPE STATEMENT

**THIS DOCUMENT IS NOT:**
- ❌ An AI intelligence platform
- ❌ A web scraping or data collection system
- ❌ A pricing engine or automation system
- ❌ A real-time analytics system
- ❌ A competitive surveillance system
- ❌ A separate service or subsystem

**THIS DOCUMENT IS:**
- ✅ An analytical reference describing what competitor signals MAY mean
- ✅ A conceptual framework for understanding market context
- ✅ A guide for manual, human-driven market analysis
- ✅ A supporting document that does NOT change product scope

**KEY PRINCIPLE:**
> **Signals ≠ Decisions**  
> **Signals ≠ Automation**  
> **Signals ≠ Pricing**  
> Competitor signals are analytical context only, not triggers for automated actions.

---

# 1. Document Role & Scope

## 1.1. Purpose

This document describes the **concept of competitor signals** within the Self-Storage Aggregator platform for MVP v1. It serves as an analytical reference to help stakeholders understand:

1. What types of market context MAY be considered during manual analysis
2. What sources of market information are permissible and safe
3. How market signals relate to (but do not control) platform decisions
4. What limitations and safeguards apply to competitor information

This document does NOT:
- Design a system for collecting competitor data
- Specify automation based on competitor signals
- Define pricing algorithms influenced by market data
- Create requirements for real-time market monitoring

## 1.2. Scope

**In Scope:**
- Conceptual definition of competitor signals
- Permissible signal sources for MVP v1
- Relationship between signals and platform decisions
- Integration with existing AI and analytics (where signals may be referenced)
- Risks and safeguards

**Out of Scope:**
- Web scraping or automated data collection
- Real-time competitor monitoring systems
- AI/ML models for competitive intelligence
- Automated pricing or ranking adjustments
- Third-party data ingestion pipelines
- Dedicated infrastructure or services

## 1.3. Target Audience

- **Product Managers:** Understand market context available for strategic decisions
- **Engineering Leadership:** Understand boundaries of what will NOT be built
- **Data Analysts:** Understand what market data may be available for manual analysis
- **Investors & Stakeholders:** Understand realistic, safe approach to market awareness

---

# 2. What This Document Is NOT

To prevent misunderstanding and scope creep, this section explicitly states what this specification does NOT represent.

## 2.1. NOT an AI Intelligence Platform

This document does NOT describe:
- An autonomous AI system that analyzes competitor behavior
- Machine learning models trained on competitor data
- Predictive analytics for market trends
- Neural networks for competitive positioning
- AI-powered competitor monitoring

**Why:** MVP v1 AI capabilities are defined in DOC-007 (AI Core Design). AI modules are advisory, domain-specific, and do NOT include competitive intelligence engines.

## 2.2. NOT a Scraping or Data Collection System

This document does NOT describe:
- Web crawlers or scrapers targeting competitor websites
- Automated data extraction from public sources
- APIs for ingesting third-party market data
- Real-time data pipelines
- Scheduled jobs for competitor data updates

**Why:** MVP v1 does not include automated external data collection. All competitor context is manual, static, or derived from internal platform data.

## 2.3. NOT a Pricing Engine

This document does NOT describe:
- Algorithms that automatically adjust prices based on competitor data
- Dynamic pricing systems
- Price optimization models
- Real-time price matching
- Automated pricing recommendations

**Why:** Pricing in MVP v1 is operator-controlled. AI modules (DOC-007 § 4.2) provide directional insights but do NOT set prices. Competitor signals do NOT trigger price changes.

## 2.4. NOT Real-Time Analytics

This document does NOT describe:
- Live monitoring of competitor activity
- Real-time dashboards of market conditions
- Streaming data processing
- Immediate alerts based on competitor actions
- Continuous data refresh

**Why:** MVP v1 focuses on core platform functionality. Real-time competitive analytics require infrastructure, resources, and processes beyond MVP scope.

## 2.5. NOT Competitive Surveillance

This document does NOT describe:
- Monitoring individual competitor actions
- Tracking specific operators' behavior
- Identifying competitor weaknesses for exploitation
- Covert data collection
- Ethically questionable practices

**Why:** Platform operates transparently and ethically. Trust & Safety principles (DOC-106) apply to all platform activities, including market analysis.

---

# 3. Concept of Competitor Signals

## 3.1. Definition

A **competitor signal** is a piece of market context that MAY inform understanding of the self-storage landscape. It is:

- **Informational:** Provides context, not commands
- **Static or Slow-Changing:** Not real-time
- **Manually Sourced or Platform-Derived:** Not automatically collected
- **Advisory:** Does not trigger automated actions
- **Aggregated or Anonymized:** Respects privacy and confidentiality

## 3.2. Examples of Signals (Conceptual)

The following are examples of what might constitute competitor signals. **This is NOT a specification for collecting these signals.**

### 3.2.1. Price Range Indicators

**What It Means:**
General understanding of typical price ranges for storage in a given area and size category.

**Example Sources:**
- Manually compiled market research
- Historical platform data from past operators
- Publicly visible pricing (observed manually, not scraped)
- User-reported expectations from onboarding

**What It Is NOT:**
- Real-time competitor pricing
- Specific prices from identifiable competitors
- Automated price tracking

### 3.2.2. Availability Indicators

**What It Means:**
General sense of whether storage is scarce or abundant in a market.

**Example Sources:**
- Internal platform metrics (listings, bookings)
- Operator-reported capacity
- User search patterns (demand signals)
- Manual market observation

**What It Is NOT:**
- Live competitor inventory levels
- Automated vacancy tracking
- Real-time supply/demand calculations

### 3.2.3. Location Density

**What It Means:**
Understanding of how many storage facilities exist in a geographic area.

**Example Sources:**
- Platform's own warehouse count
- Publicly available business directories (manual lookup)
- Geographic market summaries

**What It Is NOT:**
- Competitor mapping systems
- Real-time facility tracking
- Automated density calculations

### 3.2.4. Feature Comparison

**What It Means:**
General awareness of common features offered in a market (e.g., climate control prevalence).

**Example Sources:**
- Platform listing data (internal)
- Operator-provided information
- Manual observation during operator onboarding

**What It Is NOT:**
- Automated feature benchmarking
- Competitor feature scraping
- Real-time feature tracking

### 3.2.5. Market Saturation Indicators

**What It Means:**
High-level sense of whether a market is oversupplied or undersupplied.

**Example Sources:**
- Ratio of listings to bookings (internal)
- Operator feedback during onboarding
- Macroeconomic market reports (public, manually reviewed)

**What It Is NOT:**
- Predictive market saturation models
- Real-time saturation tracking
- Automated market scoring

## 3.3. Signal Characteristics

All competitor signals share these characteristics:

| Characteristic | Description |
|----------------|-------------|
| **Manual or Static** | Signals are not continuously updated. They reflect point-in-time or historical context. |
| **Aggregated** | Individual competitor identities are not tracked. Signals reflect market-level trends. |
| **Permissive Sources Only** | Only legal, ethical, and low-risk sources are used. No scraping or unauthorized access. |
| **Advisory Not Prescriptive** | Signals inform human judgment. They do not trigger automated decisions. |
| **Low Precision** | Signals are directional and contextual, not precise measurements. |

---

# 4. MVP-Allowed Signal Categories

This section describes categories of competitor signals that MAY be used in MVP v1, subject to strict limitations.

## 4.1. Internally Derived Signals

**Definition:**  
Signals generated from the platform's own operational data.

**Examples:**
- Historical pricing trends from platform listings
- Booking demand patterns by region and size
- Operator-reported capacity and occupancy
- User search and filtering behavior

**Permissibility:**
- ✅ Fully permissible (platform owns this data)
- ✅ No legal or ethical concerns
- ✅ No external dependencies

**Limitations:**
- Only reflects platform participants (not full market)
- May have selection bias
- Limited in early MVP due to small data volume

**Use Cases:**
- Understanding typical price ranges on platform
- Identifying underserved markets (low listing density)
- Informing operator guidance on pricing norms

## 4.2. Operator-Provided Signals

**Definition:**  
Market context voluntarily shared by operators during onboarding or operation.

**Examples:**
- Operator's self-reported market position
- Operator's description of local competition
- Operator's pricing rationale
- Operator's assessment of demand

**Permissibility:**
- ✅ Fully permissible (voluntarily provided)
- ✅ Builds operator trust through transparency
- ✅ No legal or ethical concerns

**Limitations:**
- Subjective and potentially biased
- Not independently verified
- May be incomplete

**Use Cases:**
- Understanding operator's market context
- Providing contextually relevant support
- Identifying operator concerns about competition

## 4.3. User-Reported Expectations

**Definition:**  
Market context inferred from user behavior and stated expectations.

**Examples:**
- Price ranges users expect (from search filters)
- Features users prioritize (from filtering behavior)
- Locations users search (demand geography)
- User comments about pricing expectations

**Permissibility:**
- ✅ Fully permissible (behavioral data)
- ✅ Aggregated and anonymized
- ✅ No privacy concerns if properly handled

**Limitations:**
- Reflects perceptions, not reality
- May be influenced by platform's listing availability
- Requires sufficient user volume

**Use Cases:**
- Understanding user price sensitivity
- Identifying unmet demand (frequent searches with no bookings)
- Calibrating platform content to user expectations

## 4.4. Static Public Information

**Definition:**  
Publicly available, static information manually reviewed.

**Examples:**
- Self-storage industry reports (manual review)
- Public business directories (manual lookup)
- Government statistics on storage demand
- Industry association publications

**Permissibility:**
- ✅ Permissible if:
  - Publicly available
  - Legally accessed
  - Manually reviewed (not scraped)
  - Used for general market context

**Limitations:**
- Requires manual effort
- Quickly becomes outdated
- May not reflect platform-specific dynamics

**Use Cases:**
- Understanding macroeconomic trends
- Benchmarking platform against industry norms
- Providing context for strategic planning

## 4.5. Partner-Provided Datasets

**Definition:**  
Market data shared through formal partnerships or data-sharing agreements.

**Examples:**
- Industry association data
- Market research firm reports
- Government open data initiatives
- Data shared by strategic partners

**Permissibility:**
- ✅ Permissible if:
  - Formal agreement in place
  - Legal terms respected
  - Data usage rights clear
  - Privacy/confidentiality maintained

**Limitations:**
- Requires business development effort
- May have licensing costs
- Updates depend on partner schedules

**Use Cases:**
- High-quality market benchmarking
- Regional market analysis
- Strategic planning support

---

# 5. How Signals May Be Used (and How NOT)

This section clarifies the boundary between permissible analytical use and prohibited automated use.

## 5.1. Permissible Uses

### 5.1.1. Manual Analytical Context

**Description:**  
Signals provide background information for human analysts making strategic decisions.

**Examples:**
- Analyst reviews market trends when planning expansion
- Product manager considers demand patterns when prioritizing features
- Operator support uses market context to guide onboarding

**Key Principle:**  
Human judgment remains central. Signals inform, not replace, decision-making.

### 5.1.2. Educational Content

**Description:**  
Signals help create educational materials for operators and users.

**Examples:**
- Operator guides mention typical market price ranges
- User help content explains how pricing varies by region
- Onboarding content provides market context

**Key Principle:**  
Information empowers participants without prescribing actions.

### 5.1.3. Strategic Planning

**Description:**  
Signals inform long-term platform strategy and roadmap.

**Examples:**
- Identifying underserved geographic markets
- Understanding feature priorities based on demand
- Planning marketing focus areas

**Key Principle:**  
Strategic decisions are slow-moving and human-driven.

### 5.1.4. Operator Guidance (Advisory)

**Description:**  
When operators ask for market context, signals may inform non-binding guidance.

**Examples:**
- "Most similar warehouses in your area are priced between X and Y"
- "Climate control is commonly offered in this region"
- "Demand appears higher on weekends in your market"

**Key Principle:**  
Guidance is advisory only. Operators retain full control and responsibility.

**Alignment:**  
This aligns with AI Core Design (DOC-007 § 4.2 - Pricing Intelligence) where AI provides "directional insights" and "suggested considerations" but does NOT set prices.

## 5.2. Prohibited Uses

### 5.2.1. Automated Pricing Adjustments

**Description:**  
Using signals to automatically change operator prices without human approval.

**Why Prohibited:**
- Violates operator autonomy
- Creates legal/ethical concerns
- Contradicts DOC-007 (AI does not set prices)
- May violate antitrust principles

**Example of Violation:**
❌ "System detects competitor price drop and automatically lowers all prices 10%"

### 5.2.2. Automated Ranking Manipulation

**Description:**  
Using signals to automatically demote or promote listings based on competitive position.

**Why Prohibited:**
- Violates platform fairness
- Creates perverse incentives
- Contradicts Trust & Safety principles (DOC-106)
- May harm operator trust

**Example of Violation:**
❌ "System detects warehouse is priced above competitors and automatically lowers search ranking"

### 5.2.3. Competitive Surveillance

**Description:**  
Tracking individual competitor actions or identities.

**Why Prohibited:**
- Ethical concerns
- Legal risks (privacy, unfair competition)
- Violates Trust & Safety principles (DOC-106)
- Damages industry relationships

**Example of Violation:**
❌ "System monitors specific competitor's price changes daily"

### 5.2.4. Prescriptive Recommendations

**Description:**  
Using signals to tell operators what they MUST do.

**Why Prohibited:**
- Violates operator autonomy
- Creates liability for platform
- Contradicts advisory-only AI approach (DOC-007)
- May constitute anticompetitive behavior

**Example of Violation:**
❌ "You must lower your price to X to remain competitive"

**Correct Alternative:**
✅ "Based on similar warehouses, prices in your area typically range from X to Y. You may want to consider how your pricing compares."

### 5.2.5. Real-Time Decision Triggers

**Description:**  
Using signals to trigger immediate, automated platform actions.

**Why Prohibited:**
- Creates systemic risk (bad data → bad decisions at scale)
- Violates human-in-the-loop principle
- Exceeds MVP technical scope
- Creates operational complexity

**Example of Violation:**
❌ "Alert system detects market price shift and auto-notifies all operators"

---

# 6. Relation to Other Documents

This document exists within a larger canonical architecture. It does NOT contradict or extend canonical documents.

## 6.1. DOC-007: AI Core Design (MVP v1)

**Relationship:**  
Competitor signals MAY provide context to AI modules, but AI modules do NOT collect or compute competitor signals.

**Key Alignments:**
- AI Pricing Intelligence (DOC-007 § 4.2) provides "directional insights" — signals support this but don't replace operator data
- AI does NOT set prices (DOC-007 § 4.2) — signals respect this boundary
- AI is advisory, not authoritative (DOC-007 § 6.1) — signals are also advisory
- AI does NOT predict future trends (DOC-007 § 9.1) — signals are historical or static

**What This Means:**
If AI Pricing Intelligence is implemented, it MAY reference competitor signals as **one input among many**. However:
- AI does NOT scrape or collect competitor data
- AI recommendations remain advisory
- Operator data and warehouse characteristics remain primary inputs
- Signals provide market context, not prescriptive rules

## 6.2. DOC-069: Price Analytics (within DOC-007)

**Relationship:**  
Price analytics provides insights to operators. Competitor signals ≠ price analytics.

**Key Distinctions:**

| Aspect | Price Analytics (DOC-007 § 4.2) | Competitor Signals (This Doc) |
|--------|----------------------------------|-------------------------------|
| **Purpose** | Operator-facing pricing insights | Market context (internal use) |
| **Data Source** | Platform listings & characteristics | Multiple sources (conceptual) |
| **Output** | Comparative statistics, insights | Analytical reference (not user-facing) |
| **Automation** | AI-driven (where implemented) | Manual/static |
| **Decision Impact** | Advisory to operators | Advisory to platform team |

**What This Means:**
- Price analytics focuses on platform data
- Competitor signals may supplement (but don't replace) platform data
- Both respect the principle: platform does NOT set prices

## 6.3. DOC-059: Multi-Region Architecture

**Relationship:**  
If competitor signals are used, they must respect regional context.

**Key Alignments:**
- Signals are region-specific (DOC-059 § 3.1) — Moscow signals don't apply to St. Petersburg
- Regional variation is configuration-driven (DOC-059 § 5) — signal interpretation may vary by region
- No hard-coded regional assumptions (DOC-059 § 4.2) — signals don't branch on region IDs

**What This Means:**
- Market context is inherently regional
- Signals must be tagged with regional context
- Cross-region comparisons must account for market differences
- Platform architecture already supports region-aware data (DOC-059)

## 6.4. DOC-106: Trust & Safety Framework

**Relationship:**  
Use of competitor signals must align with Trust & Safety principles.

**Key Alignments:**
- Content Integrity (DOC-106 § 2.2) — signals must be accurate, not misleading
- Platform Security (DOC-106 § 2.4) — signals don't create security risks
- Governance & Accountability (DOC-106 § 2.5) — signal use is transparent and explainable
- Human-in-the-Loop (DOC-106 § 4.4) — signals inform humans, not autonomous systems

**What This Means:**
- Competitor signals must be ethically sourced
- Use of signals must be transparent to affected parties
- Signals must not enable unfair competitive practices
- Platform remains accountable for how signals are used

## 6.5. DOC-078 / DOC-079: Security & Compliance

**Relationship:**  
Competitor signals must respect data protection and privacy requirements.

**Key Alignments:**
- No PII in competitor signals — signals are aggregated/anonymized
- Legal data collection only — no scraping or unauthorized access
- GDPR/152-FZ compliance — user data used for signals must have legal basis
- Data minimization — only collect signals actually needed

**What This Means:**
- Signals must not compromise user or operator privacy
- Collection methods must be legally defensible
- Storage and processing must meet security standards
- Retention must follow data retention policy (DOC-078)

## 6.6. Legal Documentation (DOC-054, DOC-071)

**Relationship:**  
Use of competitor signals must comply with legal constraints.

**Key Considerations:**
- **Antitrust/Competition Law:** Signals must not facilitate price-fixing or market manipulation
- **Unfair Competition:** Signals must not enable deceptive practices
- **IP Protection:** Signals must not infringe competitor IP or trade secrets
- **Terms of Service:** If signals use external sources, must comply with their ToS

**What This Means:**
- Legal review required before implementing any signal collection
- Transparent disclosure in privacy policy if user data informs signals
- Contractual clarity if using partner data
- Avoid practices that could be construed as anticompetitive

---

# 7. Out of Scope (Post-MVP)

The following capabilities are explicitly OUT OF SCOPE for MVP v1. They may be considered in future versions if business need justifies them.

## 7.1. Automated Data Collection

**Description:**  
Systems for automatically collecting competitor data from external sources.

**Examples:**
- Web scrapers
- API integrations with third-party data providers
- Real-time data pipelines
- Scheduled data refresh jobs

**Why Out of Scope:**
- Legal and ethical complexity
- Requires dedicated infrastructure
- High operational burden
- Not essential for MVP value proposition

**Future Consideration:**  
If needed post-MVP, would require:
- Legal review and approval
- Robust ethical framework
- Transparent disclosure to users/operators
- Significant engineering effort

## 7.2. AI Intelligence Models

**Description:**  
Machine learning models trained specifically for competitive intelligence.

**Examples:**
- Price prediction models
- Market trend forecasting
- Competitive positioning algorithms
- Sentiment analysis of competitor reviews

**Why Out of Scope:**
- MVP AI scope defined in DOC-007 (does not include this)
- Requires ML infrastructure and expertise
- Data quality/volume insufficient in MVP
- Not aligned with MVP goals

**Future Consideration:**  
Would require:
- Extension of AI Core Design (DOC-007)
- Dedicated ML resources
- Validation framework
- Transparent explainability

## 7.3. Real-Time Monitoring

**Description:**  
Systems for continuously tracking market conditions or competitor behavior.

**Examples:**
- Live competitor price dashboards
- Real-time market alerts
- Automated anomaly detection
- Continuous data refresh

**Why Out of Scope:**
- Infrastructure complexity
- Operational overhead
- Not essential for MVP
- Potential for overreaction to noise

**Future Consideration:**  
Would require:
- Streaming data infrastructure
- Alerting and notification systems
- Human response processes
- Cost/benefit validation

## 7.4. Market Prediction

**Description:**  
Systems for forecasting future market conditions or trends.

**Examples:**
- Demand forecasting
- Price trend prediction
- Market saturation modeling
- Competitive landscape projection

**Why Out of Scope:**
- Explicitly excluded from AI scope (DOC-007 § 9.1)
- Requires sophisticated modeling
- High risk of inaccuracy
- Limited actionability in MVP

**Future Consideration:**  
Only if:
- Clear business case emerges
- Sufficient historical data accumulated
- Validation methodology established
- Aligned with platform goals

## 7.5. Third-Party Data Ingestion

**Description:**  
Automated systems for ingesting data from external providers.

**Examples:**
- Market research firm APIs
- Government data feeds
- Industry association data pipelines
- Partner data integrations

**Why Out of Scope:**
- Requires business development
- Legal/contractual complexity
- Integration effort
- Ongoing maintenance burden

**Future Consideration:**  
If strategic partnerships emerge:
- Formal data-sharing agreements
- Clear usage rights and limitations
- Integration roadmap
- Value validation

## 7.6. Competitive Benchmarking Tools

**Description:**  
Operator-facing tools for comparing themselves to competitors.

**Examples:**
- "Compare my warehouse to similar facilities"
- Competitive positioning dashboards
- Market share analysis
- Performance relative to market averages

**Why Out of Scope:**
- Requires comprehensive competitor data
- UI/UX complexity
- Risk of creating adversarial dynamics
- Not essential for MVP operator value

**Future Consideration:**  
Would require:
- Careful UX design to avoid negative competition
- Robust data validation
- Clear educational framing
- Trust & Safety considerations

---

# 8. Risks & Safeguards

This section identifies risks associated with competitor signals and describes safeguards.

## 8.1. Accuracy Risks

### Risk

Competitor signals may be inaccurate, outdated, or unrepresentative.

### Impact

- Misleading insights lead to poor decisions
- Operators receive incorrect market context
- Platform credibility damaged

### Safeguards

- **Human Validation:** All signals reviewed by humans before use
- **Staleness Indicators:** Clearly mark age/recency of signals
- **Confidence Levels:** Indicate signal reliability/precision
- **Source Transparency:** Disclose where signals come from
- **No Automated Actions:** Signals don't trigger decisions without human review

## 8.2. Bias Risks

### Risk

Signals may reflect biases in data sources or collection methods.

### Impact

- Certain markets or operators disadvantaged
- Platform perpetuates market inequalities
- Legal/regulatory concerns

### Safeguards

- **Multiple Sources:** Don't rely on single signal source
- **Regular Audits:** Review signal usage for unintended bias
- **Operator Feedback:** Listen to operators about market context accuracy
- **Transparency:** Explain signal interpretation openly
- **Advisory Only:** Operators can reject/ignore signal-based guidance

## 8.3. Legal Risks

### Risk

Improper collection or use of competitor signals may violate laws.

### Impact

- Antitrust violations
- Privacy law violations
- Unfair competition claims
- Regulatory sanctions

### Safeguards

- **Legal Review:** All signal sources and uses reviewed by counsel
- **Public Sources Only:** No unauthorized access to competitor data
- **No Price-Fixing:** Signals never used to coordinate prices
- **Compliance Monitoring:** Regular legal compliance checks
- **Transparent Disclosure:** Privacy policy discloses signal usage if applicable

## 8.4. Ethical Risks

### Risk

Use of competitor signals may be perceived as unfair or predatory.

### Impact

- Damage to platform reputation
- Loss of operator trust
- Industry backlash
- User concerns about fairness

### Safeguards

- **Fairness Principles:** Align with Trust & Safety framework (DOC-106)
- **Operator Autonomy:** Never override operator control
- **Transparency:** Explain signal usage in operator communications
- **Ethical Review:** Product/leadership review for ethical implications
- **Industry Engagement:** Participate in industry discussions on best practices

## 8.5. Operational Risks

### Risk

Misuse of signals by internal teams leads to poor outcomes.

### Impact

- Platform decisions based on bad data
- Resources wasted on irrelevant signals
- Complexity without value

### Safeguards

- **Training:** Educate teams on proper signal interpretation
- **Governance:** Clear policies on signal usage
- **Feedback Loops:** Monitor whether signals actually improve decisions
- **Simplicity:** Keep signal framework minimal and focused
- **Regular Review:** Periodically assess signal utility

## 8.6. Competitive Response Risks

### Risk

Competitors discover platform's use of signals and respond adversarially.

### Impact

- Market manipulation (competitors game signals)
- Legal challenges
- Reputational damage
- Reduced signal utility

### Safeguards

- **Don't Over-Rely:** Signals are one input among many
- **Aggregation:** Individual competitors not tracked
- **Transparency:** Operate openly and ethically
- **Legal Defensibility:** Ensure all practices are legally sound
- **Adaptability:** Be prepared to adjust if signals become unreliable

---

# 9. Implementation Guidelines (If/When Used)

If the platform chooses to reference competitor signals in any capacity, the following guidelines apply.

## 9.1. Minimal Implementation Principle

**Guideline:**  
Implement only the signals that directly support MVP goals. Avoid "nice-to-have" signals.

**Rationale:**  
Complexity grows quickly. Each signal adds maintenance burden, accuracy risk, and potential misuse.

**Example:**  
If operator onboarding benefits from general price range context, implement ONLY price range signals. Don't add availability, features, or saturation signals until proven necessary.

## 9.2. Human-in-the-Loop Principle

**Guideline:**  
Every use of competitor signals must involve human judgment.

**Rationale:**  
Signals are imperfect. Humans can contextualize, question, and override signal-based insights.

**Example:**  
If providing pricing guidance to operators, format it as: "Similar warehouses typically range from X to Y. Consider how your unique features and costs inform your pricing strategy."

**Alignment:**  
Consistent with Trust & Safety human-in-the-loop principle (DOC-106 § 4.4).

## 9.3. Transparency Principle

**Guideline:**  
Disclose when competitor signals are used and what they represent.

**Rationale:**  
Transparency builds trust and allows operators to assess signal relevance.

**Example:**  
"This price range is based on similar warehouses in your city over the past 6 months on our platform."

**Alignment:**  
Consistent with AI explainability (DOC-007 § 6.3) and Trust & Safety governance (DOC-106 § 2.5).

## 9.4. Advisory-Only Principle

**Guideline:**  
Signals inform, never mandate, decisions.

**Rationale:**  
Operators retain autonomy and responsibility. Platform does not control pricing or operations.

**Example:**  
Use language like: "You may want to consider..." NOT "You should..." or "You must..."

**Alignment:**  
Consistent with AI advisory role (DOC-007 § 6.1).

## 9.5. Regular Review Principle

**Guideline:**  
Periodically review signal accuracy, utility, and ethical implications.

**Rationale:**  
Markets change, signals degrade, and unintended consequences emerge. Continuous improvement required.

**Example:**  
Quarterly review: Are price range signals still accurate? Do operators find them useful? Any ethical concerns raised?

## 9.6. Legal Compliance Principle

**Guideline:**  
All signal sources and uses must be legally reviewed and approved.

**Rationale:**  
Legal risks are significant. Expert review is non-negotiable.

**Example:**  
Before implementing any signal source, obtain written legal approval documenting permissibility.

---

# 10. Conclusion

## 10.1. Summary

This document establishes a **conceptual framework** for understanding competitor signals within the Self-Storage Aggregator platform for MVP v1.

**Key Takeaways:**

1. **Competitor Signals Are Analytical Context**  
   They inform human understanding, not automated systems.

2. **Minimal, Manual, and Safe**  
   MVP v1 relies on manually sourced, static, and ethically sound signal sources.

3. **Advisory, Not Prescriptive**  
   Signals may inform guidance but never mandate actions.

4. **No Separate System**  
   This document does NOT describe a platform, service, or infrastructure.

5. **Strict Alignment with Canon**  
   All uses of signals respect DOC-007 (AI), DOC-106 (Trust & Safety), DOC-059 (Multi-Region), and legal/compliance documents.

## 10.2. Decision Framework

Before using any competitor signal, ask:

1. **Is this legally permissible?** (Legal review required)
2. **Is this ethically sound?** (Trust & Safety alignment)
3. **Is this manually sourced or platform-derived?** (No automated collection)
4. **Is this advisory, not automated?** (Human-in-the-loop)
5. **Is this necessary for MVP goals?** (Minimal implementation)
6. **Is this transparent?** (Disclosure and explainability)

If the answer to ANY question is "no" or "uncertain," the signal should NOT be used.

## 10.3. MVP v1 Reality

In practical terms for MVP v1:

- **Most competitor context comes from internal platform data**  
  Historical listings, bookings, operator inputs, user behavior

- **External signals are minimal and manually reviewed**  
  Industry reports, public data, operator-shared insights

- **No automated systems for signal collection or application**  
  All analysis is human-driven

- **Signals support strategic decisions, not operational automation**  
  Market expansion, operator guidance, product planning

## 10.4. Future Evolution

Post-MVP, the platform MAY consider:
- More sophisticated signal sources (with legal/ethical review)
- Integration with analytics tools (for internal use)
- Enhanced operator guidance (still advisory)

However, the core principles remain:
- **Signals ≠ Automation**
- **Human judgment is central**
- **Operator autonomy is sacred**
- **Transparency and ethics are non-negotiable**

---

# Appendix A: Alignment Checklist

This checklist ensures competitor signal usage aligns with canonical documents.

| Canonical Document | Alignment Requirement | Status |
|--------------------|----------------------|--------|
| **DOC-007: AI Core Design** | Signals don't replace AI module scope; AI remains advisory | ✅ Aligned |
| **DOC-007: AI Core Design** | No autonomous decision-making; signals support human judgment | ✅ Aligned |
| **DOC-007: AI Core Design** | No predictive analytics (§ 9.1) | ✅ Aligned |
| **DOC-059: Multi-Region Architecture** | Signals respect regional context | ✅ Aligned |
| **DOC-106: Trust & Safety** | Human-in-the-loop principle respected | ✅ Aligned |
| **DOC-106: Trust & Safety** | Content integrity: signals are accurate and transparent | ✅ Aligned |
| **DOC-106: Trust & Safety** | Governance: signal usage is documented and reviewable | ✅ Aligned |
| **DOC-078/079: Security & Compliance** | No PII in signals; legal data collection only | ✅ Aligned |
| **DOC-054/071: Legal** | No antitrust, unfair competition, or IP violations | ✅ Aligned |
| **DOC-002: Technical Architecture** | No architectural changes; signals are data context only | ✅ Aligned |

---

# Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Competitor Signal** | A piece of market context that MAY inform understanding of the self-storage landscape; informational, not prescriptive. |
| **Automated Collection** | Use of software systems to continuously gather data without human intervention; PROHIBITED in MVP v1. |
| **Advisory** | Providing information or suggestions without mandating action; operator retains decision authority. |
| **Prescriptive** | Mandating specific actions; PROHIBITED for competitor signals. |
| **Static** | Data that changes infrequently and is not updated in real-time. |
| **Aggregated** | Data combined across multiple sources or entities, removing individual identifiability. |
| **Human-in-the-Loop** | Decision-making process where humans retain authority and AI/signals provide support. |
| **Market Context** | General understanding of market conditions, trends, and dynamics. |
| **Price Range Indicator** | General sense of typical pricing for storage in a given area/category. |
| **Availability Indicator** | General sense of storage scarcity or abundance in a market. |

---

# Appendix C: Related Documents

| Document ID | Title | Relationship |
|-------------|-------|--------------|
| **DOC-007** | AI Core Design (MVP v1) | Defines AI module scope; signals may support but don't extend AI capabilities |
| **DOC-059** | Multi-Region Architecture | Signals must respect regional context |
| **DOC-106** | Trust & Safety Framework | Ethical and governance principles for signal usage |
| **DOC-078** | Security & Compliance Plan | Data protection and legal compliance for signals |
| **DOC-079** | Security Architecture | Security boundaries for signal handling |
| **DOC-054** | Legal Checklist & Compliance Requirements | Legal constraints on competitor data usage |
| **DOC-071** | Legal Documentation Unified Guide | Legal context for platform operations |
| **DOC-002** | Technical Architecture (MVP v1) | Platform architecture; signals don't change it |
| **DOC-015** | API Design Blueprint | API contracts; signals are internal context, not API-exposed |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 17, 2025 | Product & Engineering | Initial specification for MVP v1 competitor signal framework |

---

**Document Status:** 🟡 SUPPORTING / NON-CANONICAL  
**Maintained By:** Product & Engineering  
**Next Review:** After MVP v1 launch, when post-MVP strategic planning begins

---

**END OF DOCUMENT**
