# DOC-037: Data Warehouse & BI Planning (MVP → v2)

**Document ID:** DOC-037  
**Title:** Data Warehouse & Business Intelligence Planning  
**Type:** Supporting / Data & Analytics Planning Specification  
**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Date:** December 18, 2025  
**Status:** 🟡 SUPPORTING - Planning Only (Non-Canonical)

---

## Document Control

### Purpose

This document provides **conceptual planning guidance** for the evolution of analytics infrastructure from MVP v1's operational databases toward a dedicated analytical layer in v2 and beyond. It is **NOT** an implementation guide, technology selection document, or data warehouse design specification.

### Scope

**In Scope:**
- Analytical use cases and data needs (conceptual)
- When and why a data warehouse becomes relevant
- Evolution triggers and decision points
- Data domain organization (high-level)
- Planning considerations for BI and reporting
- Governance philosophy

**Explicitly Out of Scope:**
- ❌ Technology or vendor selection (no BigQuery, Redshift, Snowflake, etc.)
- ❌ Data warehouse schema design (no star/snowflake models)
- ❌ ETL/ELT pipeline implementation
- ❌ SQL queries, data transformation logic, or DAGs
- ❌ Orchestration tooling or scheduling
- ❌ SLA/freshness guarantees
- ❌ Specific BI tool recommendations
- ❌ Duplication of metrics or monitoring specifications

### Target Audience

- Product leadership evaluating analytics roadmap
- Engineering leadership planning architectural evolution
- Data/analytics team planning future capabilities
- Business stakeholders understanding analytics maturity path

### Related Documents

| Document | Relationship |
|----------|--------------|
| **Analytics_Metrics_Tracking_Specification_MVP_v1_1.md** | Defines current metrics and event tracking; DWH planning builds on these foundations |
| **Monitoring_and_Observability_Plan_MVP_v1_CANONICAL.md** | Operational monitoring (system health); DWH planning addresses business analytics |
| **full_database_specification_mvp_v1_CANONICAL.md** | Current operational data model; source for future analytical layer |
| **Data_retention_policy_mvp_v1.md** | Data lifecycle and retention policies; informs DWH data governance |
| **Technical_Architecture_Document_MVP_v1_CANONICAL.md** | System architecture; DWH evolution must respect service boundaries |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Analytics Philosophy](#2-analytics-philosophy)
3. [MVP v1 Analytics Baseline](#3-mvp-v1-analytics-baseline)
4. [Analytical Use Cases (Conceptual)](#4-analytical-use-cases-conceptual)
5. [Data Domains (High-Level)](#5-data-domains-high-level)
6. [Evolution to v2 (Planning)](#6-evolution-to-v2-planning)
7. [BI & Reporting Considerations](#7-bi--reporting-considerations)
8. [Data Governance & Quality (High-Level)](#8-data-governance--quality-high-level)
9. [Relation to Other Documents](#9-relation-to-other-documents)
10. [Non-Goals & Explicit Exclusions](#10-non-goals--explicit-exclusions)
11. [Risks & Trade-offs](#11-risks--trade-offs)

---

## 1. Document Role & Scope

### 1.1. What This Document Is

This is a **planning and decision-support document** that helps stakeholders understand:
- When analytics needs outgrow operational databases
- What analytical capabilities might be needed in future phases
- How to think about separating transactional and analytical workloads
- What questions to ask before committing to analytical infrastructure

### 1.2. What This Document Is Not

This document is **NOT**:
- A data warehouse design specification
- A technology evaluation or selection guide
- An implementation roadmap with timelines
- A replacement for metrics or monitoring documentation
- A commitment to specific analytical tools or approaches

### 1.3. Document Status

**Status:** SUPPORTING / NON-CANONICAL

This document provides planning context but does NOT define product requirements or technical architecture. Decisions about analytical infrastructure should be based on demonstrated business need, not premature optimization.

---

## 2. Analytics Philosophy

### 2.1. Core Principles

**Principle 1: Operational First**
- The primary database serves transactional workloads (bookings, user actions, operator workflows)
- Analytics should not compromise operational performance
- Separation of concerns emerges from real need, not anticipation

**Principle 2: Analytics Follow Real Needs**
- Build analytical capabilities in response to specific business questions
- Avoid creating infrastructure before questions exist
- Prefer simple solutions (direct database queries, basic aggregations) until they fail

**Principle 3: Avoid Premature Data Platforms**
- Data warehouses, lakes, and complex ETL pipelines have real costs (engineering, maintenance, operational)
- Many early-stage platforms over-invest in analytics infrastructure
- Wait until operational data patterns cause demonstrable problems

**Principle 4: Simplicity and Clarity**
- Analytics should make decision-making easier, not harder
- Complex analytics infrastructure can obscure simple truths
- Start with clear questions, not with technology

### 2.2. When NOT to Build a Data Warehouse

A dedicated analytical layer is **NOT** needed when:
- Business questions can be answered with direct operational database queries
- Query volumes don't impact transactional performance
- Data volumes remain manageable (< 1 million rows per major table)
- Reporting needs are satisfied by existing dashboards (GA4, Grafana, Metabase)
- Team lacks dedicated data engineering capacity
- Business processes are still evolving rapidly

### 2.3. Evolution Mindset

Analytics infrastructure should evolve in phases:
1. **Phase 0 (Pre-MVP):** No analytics, manual data inspection
2. **Phase 1 (MVP v1 - Current):** Event tracking, basic metrics, operational database queries
3. **Phase 2 (v2 trigger point):** Analytical needs outgrow operational database
4. **Phase 3 (v2+):** Dedicated analytical layer with specialized tools

We are currently in **Phase 1**. This document helps plan for potential **Phase 3** transition.

---

## 3. MVP v1 Analytics Baseline

### 3.1. Current State (MVP v1)

**Operational Data Storage:**
- PostgreSQL 15+ as primary transactional database
- All data stored in operational tables (users, warehouses, bookings, reviews, leads, etc.)
- Real-time consistency for transactional operations
- Optimized for writes and point lookups

**Event Tracking:**
- Frontend events captured via Google Analytics 4 (GA4)
- Backend business events logged to `events_log` table in PostgreSQL
- AI usage tracked in `ai_requests_log` table
- Basic event schema with correlation IDs for tracing

**Current Analytics Capabilities:**
- GA4 dashboards for user behavior (page views, sessions, basic conversion funnel)
- Grafana dashboards for operational metrics (request rates, error rates, latency)
- Direct PostgreSQL queries for ad-hoc business questions
- Basic operator metrics (occupancy, booking counts) computed on-demand

**Limitations Accepted in MVP v1:**
- No historical trend analysis beyond GA4's retention (default 2 months free tier)
- No complex cross-domain analytics (e.g., "revenue by warehouse region over time")
- No pre-aggregated metrics or materialized views
- Analytical queries run against operational database (acceptable at MVP scale)
- Manual data exports for deeper analysis

### 3.2. What Works Well

MVP v1's approach is appropriate because:
- Data volumes are small (thousands of warehouses, tens of thousands of bookings)
- Query load is manageable
- Business questions are still evolving
- Team can manually investigate edge cases
- Focus is on product development, not analytics infrastructure

### 3.3. Current Data Access Patterns

**Who accesses data:**
- Product team: GA4 dashboards, occasional SQL queries
- Engineering team: Grafana for system health, logs for debugging
- Operators: Simple dashboards showing their bookings and leads
- Business stakeholders: Exported reports, manual analysis

**Query patterns:**
- Mostly real-time or near-real-time (operational dashboards)
- Some historical queries (month-over-month comparisons)
- Ad-hoc investigations (SQL queries by engineers)

---

## 4. Analytical Use Cases (Conceptual)

This section describes the **types** of analytical questions that might justify a dedicated analytical layer in v2. These are illustrative, not exhaustive or committed.

### 4.1. Business Performance Analysis

**Use Case Category:** Understanding overall platform health and growth

**Example Questions:**
- How has booking volume trended month-over-month across different regions?
- What is the average booking value and how has it changed over time?
- Which warehouse features correlate with higher conversion rates?
- How does seasonality affect booking patterns?

**Why Current Approach Might Fail:**
- Long-running analytical queries (scanning millions of rows) compete with transactional workloads
- Requires joining multiple large tables (bookings, warehouses, users, reviews)
- Need for historical data beyond operational database's efficient query range

**What Changes (Conceptually):**
- Analytical queries run against a separate database optimized for reads and aggregations
- Data is pre-processed into analytical-friendly structures
- Historical snapshots preserved even as operational data changes

### 4.2. Search and Discovery Analytics

**Use Case Category:** Optimizing how users find warehouses

**Example Questions:**
- What search filters are most commonly used?
- Do users who apply multiple filters have higher booking rates?
- Which searches result in no results (opportunity for supply)?
- How effective is the AI Box Finder feature?

**Why Current Approach Might Fail:**
- Search events generate high volumes of data
- Analyzing search patterns requires complex aggregations
- Need to correlate searches with downstream actions (views, bookings)

**What Changes (Conceptually):**
- Search event data stored in analytics-optimized format
- Pre-computed aggregations for common search patterns
- Ability to run exploratory queries without impacting search performance

### 4.3. Operator Performance and Marketplace Health

**Use Case Category:** Ensuring fair and efficient marketplace

**Example Questions:**
- How quickly do operators respond to booking requests?
- What percentage of warehouses are fully occupied?
- Which warehouses consistently receive high ratings?
- Are there operators with unusually high cancellation rates?

**Why Current Approach Might Fail:**
- Requires complex time-series analysis of booking statuses
- Need to compute aggregate statistics across many operators
- Historical trend analysis (e.g., "response time deteriorating over 3 months")

**What Changes (Conceptually):**
- Operator-level metrics pre-aggregated and tracked over time
- Ability to identify outliers and patterns without live database queries
- Historical snapshots for trend analysis

### 4.4. User Behavior and Retention

**Use Case Category:** Understanding user engagement and churn

**Example Questions:**
- What percentage of users return within 7 days? 30 days?
- How many sessions does an average user have before booking?
- Which features are most engaging for repeat users?
- What characterizes users who abandon bookings?

**Why Current Approach Might Fail:**
- Cohort analysis requires scanning large historical event datasets
- Sessionization and user journey reconstruction is computationally expensive
- GA4 has data export limitations and retention constraints

**What Changes (Conceptually):**
- User behavior events stored long-term in analytical format
- Pre-computed cohort and retention metrics
- Ability to build complex user segments and analyze their behavior

### 4.5. Content Quality and Moderation

**Use Case Category:** Ensuring high-quality warehouse listings and reviews

**Example Questions:**
- Which warehouses have incomplete information?
- Are there patterns in review sentiment by warehouse features?
- How does photo quality correlate with booking conversion?
- Which operators need support improving their listings?

**Why Current Approach Might Fail:**
- Requires analysis of unstructured content (text, images)
- May involve ML scoring or classification
- Need for batch processing of content quality metrics

**What Changes (Conceptually):**
- Content quality scores computed periodically in analytical layer
- Ability to run quality audits without impacting operational systems
- Historical tracking of content improvements

---

## 5. Data Domains (High-Level)

This section describes the **logical groupings** of data that might be organized in an analytical layer. This is NOT a schema design—it's a conceptual framework for thinking about analytical data.

### 5.1. User Domain

**Conceptual Scope:**
- User registrations and profiles
- Authentication events
- User preferences and settings
- Account lifecycle (creation, verification, deactivation)

**Analytical Questions:**
- User acquisition trends
- User activation and onboarding effectiveness
- Demographic patterns (if collected with consent)

**Considerations:**
- High privacy sensitivity—must respect GDPR, anonymization rules
- Personal identifiable information (PII) handling requirements
- Separation of analytical user identifiers from operational user IDs

### 5.2. Operator Domain

**Conceptual Scope:**
- Operator registrations and business profiles
- Warehouse ownership relationships
- Operator activity and responsiveness
- Operator performance metrics

**Analytical Questions:**
- Operator acquisition and retention
- Operator engagement with platform
- Operator performance benchmarking
- Operator support needs identification

**Considerations:**
- Business-sensitive information
- Operator privacy and competitive concerns
- Aggregate metrics vs. individual operator tracking

### 5.3. Warehouse and Inventory Domain

**Conceptual Scope:**
- Warehouse listings and attributes
- Box inventory and pricing
- Warehouse features and amenities
- Geographic distribution

**Analytical Questions:**
- Supply analysis (where are warehouses located?)
- Pricing trends and competitiveness
- Inventory utilization (how full are warehouses?)
- Feature adoption (which amenities are common?)

**Considerations:**
- Historical changes to warehouse data (price changes, feature additions)
- Slowly changing dimensions (warehouse attributes evolve over time)
- Geospatial analysis requirements

### 5.4. Booking and Transaction Domain

**Conceptual Scope:**
- Booking requests and lifecycle
- Booking state transitions
- Booking cancellations and reasons
- Booking duration and value

**Analytical Questions:**
- Booking volume and growth trends
- Conversion rate analysis
- Cancellation patterns and reasons
- Average booking value and duration

**Considerations:**
- Time-series analysis of booking states
- Need for historical snapshots (booking state at point in time)
- Correlation with other domains (which warehouse features drive bookings?)

### 5.5. Review and Feedback Domain

**Conceptual Scope:**
- Warehouse reviews and ratings
- Review text and sentiment
- Review moderation decisions
- Aggregated rating calculations

**Analytical Questions:**
- Review volume trends
- Rating distributions and patterns
- Sentiment analysis over time
- Impact of reviews on booking conversion

**Considerations:**
- Text analysis and NLP requirements
- Review authenticity and quality
- Anonymization for analytical purposes

### 5.6. Lead and CRM Domain

**Conceptual Scope:**
- Contact form submissions
- Lead processing activities
- Lead status transitions
- Lead outcomes (converted to booking, closed, spam)

**Analytical Questions:**
- Lead volume and sources
- Lead conversion rates
- Operator responsiveness to leads
- Lead quality and spam detection effectiveness

**Considerations:**
- Sales pipeline analytics
- Lead attribution and source tracking
- Operator-specific CRM effectiveness

### 5.7. Content and Media Domain

**Conceptual Scope:**
- Warehouse photos and videos
- Media upload events
- Media quality and completeness
- AI-generated content (if applicable)

**Analytical Questions:**
- Content completeness by warehouse
- Media quality impact on conversion
- Photo upload patterns
- AI feature usage and effectiveness

**Considerations:**
- Media metadata analysis (not storing actual media files in analytical layer)
- Quality scoring and classification
- User-generated vs. operator-uploaded content

---

## 6. Evolution to v2 (Planning)

### 6.1. When Does a Data Warehouse Become Relevant?

A dedicated analytical layer becomes worth considering when **several** of these indicators appear:

**Scale Indicators:**
- Operational database exceeds 10 million rows in key tables (bookings, events)
- Analytical queries start impacting transactional response times
- Need for historical data exceeds operational database's efficient query range (> 1 year)

**Complexity Indicators:**
- Business questions require joining 5+ tables across multiple domains
- Need for complex aggregations (cohort analysis, multi-dimensional rollups)
- Reporting needs exceed capabilities of current tools (GA4, Grafana, direct SQL)

**Organizational Indicators:**
- Multiple stakeholders (product, ops, business) need self-service analytics
- Dedicated data/analytics role or team hired
- Regular requests for "historical trend" or "what changed over time" questions

**Frequency Indicators:**
- Analytical queries run multiple times per day
- Need for scheduled/automated reporting
- Real-time operational dashboards insufficient—need deeper historical analysis

**Data Quality Indicators:**
- Operational data changes (updates, deletes) complicate historical analysis
- Need for "point-in-time" snapshots (e.g., "what was warehouse capacity on date X?")
- Data consistency issues when querying across evolving schemas

### 6.2. What Problems Does a DWH Solve?

A data warehouse addresses specific challenges:

**Problem 1: Performance Isolation**
- Analytical queries no longer compete with transactional operations
- Optimized for read-heavy, aggregation-focused workloads
- Different indexing, partitioning, and storage strategies

**Problem 2: Historical Preservation**
- Captures snapshots of data at different points in time
- Preserves data even after operational deletions or updates
- Enables trend analysis and longitudinal studies

**Problem 3: Data Integration**
- Combines data from multiple sources (operational DB, GA4, external APIs)
- Consistent analytical schemas across heterogeneous sources
- Single source of truth for reporting

**Problem 4: Analytical Optimization**
- Pre-computed aggregations and materialized views
- Denormalized structures optimized for common analytical queries
- Batch processing workflows for complex transformations

**Problem 5: Governance and Access Control**
- Separate access controls for analytical vs. operational data
- Ability to anonymize or mask sensitive data for analytics
- Centralized data catalog and documentation

### 6.3. What Changes Conceptually in v2?

**Architectural Change:**
- **MVP v1:** Single PostgreSQL database for all workloads
- **v2:** Operational database + separate analytical database/warehouse

**Data Flow Change:**
- **MVP v1:** Direct queries against operational tables
- **v2:** Periodic data movement (sync, replication, ETL) from operational to analytical

**Query Pattern Change:**
- **MVP v1:** Mix of transactional and analytical queries on same database
- **v2:** Transactional queries on operational DB, analytical queries on DWH

**Reporting Change:**
- **MVP v1:** Dashboards query operational database or GA4 directly
- **v2:** Dashboards query data warehouse for historical/aggregated data

**Team Change:**
- **MVP v1:** Engineers run SQL queries for analytics
- **v2:** Data/analytics team owns analytical layer, self-service tools for stakeholders

### 6.4. Evolution Decision Framework

**Decision Point 1: Do Nothing (Stay in MVP v1)**
- Appropriate when current analytics meet business needs
- Operational database performance is acceptable
- Team capacity focused on product development, not infrastructure

**Decision Point 2: Optimize Existing (Before DWH)**
- Add read replicas for analytical queries (performance isolation without architecture change)
- Implement caching layers for common aggregations
- Optimize slow queries with better indexes or materialized views
- Extend GA4 retention or upgrade to paid tier

**Decision Point 3: Minimal Analytical Layer (v2 Entry Point)**
- Introduce lightweight analytical database (e.g., read replica with analytical optimizations)
- Implement basic ETL (nightly batch jobs moving operational data to analytical tables)
- Keep tooling simple (continue using Grafana, Metabase, or similar)

**Decision Point 4: Full DWH Platform (v2+ Maturity)**
- Dedicated data warehouse with OLAP capabilities
- Comprehensive ETL/ELT pipelines
- Advanced BI tools, self-service analytics
- Data engineering team managing analytical infrastructure

---

## 7. BI & Reporting Considerations

### 7.1. Internal vs. External Reporting

**Internal Reporting (Platform Operations):**
- System health and performance metrics → already covered by Monitoring & Observability Plan
- Business KPIs (bookings, revenue, growth) → potential DWH use case
- Operational dashboards for product/engineering → may stay on operational DB
- Ad-hoc analysis for decision-making → DWH becomes valuable at scale

**External Reporting (Operator Dashboards):**
- Operator-facing metrics (occupancy, booking status, lead activity)
- Real-time or near-real-time updates preferred
- Likely remains on operational database (simpler, lower latency)
- DWH may power historical trend reports for operators

**Consideration:**
Not all reporting requires a data warehouse. Operational dashboards often perform better querying live data. DWH is most valuable for historical analysis and complex aggregations.

### 7.2. Ad-Hoc vs. Scheduled Reporting

**Ad-Hoc Reporting:**
- Exploratory analysis, answering new questions
- Requires flexible query capabilities
- DWH enables this without impacting operational systems

**Scheduled Reporting:**
- Regular reports (daily, weekly, monthly)
- Pre-defined metrics and dashboards
- Can be optimized with materialized views or pre-aggregations

**Consideration:**
Balance self-service (ad-hoc) with governed (scheduled) reporting. Too much flexibility can lead to inconsistent metrics. Too much rigidity limits insights.

### 7.3. Access Control (Conceptual)

**Who Should Access Analytical Data:**
- Product team: Full access to usage metrics, conversion funnels
- Business operations: Access to booking and operator performance metrics
- Engineering: Technical metrics (already via Grafana)
- Operators: Scoped to their own warehouse/booking data (through application, not direct DB access)

**Privacy and Compliance:**
- Analytical layer must respect same privacy controls as operational database
- PII must be anonymized or pseudonymized for broad analytical access
- Audit logs for who accessed what data

**Consideration:**
Separate analytical layer allows implementing different access controls than operational database. Useful for granting broader analytical access without risking operational data integrity.

### 7.4. Freshness vs. Consistency Trade-offs

**Real-Time Analytics (Operational Database):**
- Up-to-the-second accuracy
- Reflects current operational state
- May impact performance if query load is high

**Near-Real-Time Analytics (DWH with frequent sync):**
- Delays measured in minutes to hours
- Sufficient for most business questions
- Balances freshness with performance isolation

**Batch Analytics (DWH with daily sync):**
- Data updated once per day (e.g., nightly ETL)
- Sufficient for trend analysis and historical reporting
- Simplest to implement and maintain

**Consideration:**
Not all analytics need real-time data. Many business questions (month-over-month growth, conversion trends) are answered with daily-updated data. Resist premature optimization for real-time analytics.

---

## 8. Data Governance & Quality (High-Level)

### 8.1. Data Ownership

**Operational Data:**
- Owned by service/domain teams (user service, booking service, etc.)
- Defined by operational database schemas and API contracts

**Analytical Data:**
- Owned by data/analytics team (when it exists)
- Derived from operational data through transformation pipelines

**Consideration:**
Clear ownership prevents conflicts. Operational teams should not be blocked by analytics needs, and analytics teams should not break operational systems.

### 8.2. Consistency and Data Quality

**Challenge:**
Analytical layer is a derived view. Inconsistencies can arise from:
- Data transformation errors
- Sync delays
- Schema evolution in operational database

**Approach (Conceptual):**
- Validate data quality at ingestion (row counts, null checks, constraint validation)
- Monitor for anomalies (sudden spikes or drops in key metrics)
- Maintain lineage: trace analytical data back to operational sources
- Implement data quality tests as part of ETL pipelines

**Consideration:**
Data quality is easier to maintain when transformation logic is simple. Avoid overly complex ETL that obscures data provenance.

### 8.3. Traceability and Lineage

**Why It Matters:**
When analytics show unexpected results, need to understand:
- Which operational tables contributed to analytical data?
- When was data last refreshed?
- What transformations were applied?

**Approach (Conceptual):**
- Document data flows and transformation logic
- Tag analytical tables with source and refresh metadata
- Implement monitoring for ETL pipeline health

**Consideration:**
Data lineage is critical for troubleshooting and trust. If stakeholders don't trust analytical data, they won't use it.

### 8.4. Privacy and Anonymization

**Principle:**
Analytical layer should minimize PII exposure:
- Use pseudonymized user IDs instead of real user IDs
- Remove or hash sensitive fields (email, phone, address)
- Aggregate data where possible (cohorts instead of individuals)

**Approach (Conceptual):**
- Apply anonymization during ETL (before data enters analytical layer)
- Implement role-based access for fields that must remain identifiable
- Regular audits of what data exists in analytical layer

**Consideration:**
Anonymization is easier to apply at analytical layer entry point than retroactively. Plan for privacy from the start.

---

## 9. Relation to Other Documents

### 9.1. Analytics & Metrics Specification

**Document:** `Analytics_Metrics_Tracking_Specification_MVP_v1_1.md`

**Relationship:**
- Defines **what** metrics are tracked and **how** events are captured
- This document (DOC-037) addresses **where** analytical workloads run and **when** to separate them from operational systems
- No conflict: metrics spec defines data collection, DWH planning defines data processing and storage strategy

**Integration:**
- Events and metrics defined in Analytics spec are source data for potential DWH
- DWH planning does not change event schemas or metric definitions
- DWH enables deeper analysis of metrics defined in Analytics spec

### 9.2. Monitoring & Observability

**Document:** `Monitoring_and_Observability_Plan_MVP_v1_CANONICAL.md`

**Relationship:**
- Focuses on **operational health** (system performance, errors, latency)
- This document focuses on **business analytics** (conversion, retention, revenue)
- Different concerns, complementary approaches

**Integration:**
- Monitoring metrics (request rates, error rates) may be included in analytical layer for correlation with business metrics
- DWH does not replace operational monitoring
- Both use time-series data but serve different purposes

### 9.3. Database Specification

**Document:** `full_database_specification_mvp_v1_CANONICAL.md`

**Relationship:**
- Defines operational database schema (single source of truth for MVP v1)
- This document plans for potential **separate analytical database** in v2
- Operational DB remains authoritative; analytical layer is derived

**Integration:**
- Analytical layer in v2 would source data from operational database tables
- Schema evolution in operational DB requires corresponding ETL updates
- DWH planning does not change operational database design

### 9.4. Data Retention Policy

**Document:** `Data_retention_policy_mvp_v1.md`

**Relationship:**
- Defines retention periods for operational data (compliance, privacy)
- This document addresses analytical data retention (often longer than operational for trend analysis)

**Integration:**
- Analytical layer may retain historical snapshots after operational data is deleted
- Must respect privacy constraints (e.g., GDPR right to deletion applies to analytical data too)
- Retention policies in analytical layer must be documented and enforced

### 9.5. Technical Architecture

**Document:** `Technical_Architecture_Document_MVP_v1_CANONICAL.md`

**Relationship:**
- Defines overall system architecture (services, data flow, infrastructure)
- This document plans for potential architectural evolution (adding analytical layer)

**Integration:**
- Any DWH implementation must align with architecture principles (service boundaries, security, scalability)
- DWH is not a replacement for operational architecture—it's an addition
- Data flow from operational to analytical must respect service boundaries

---

## 10. Non-Goals & Explicit Exclusions

### 10.1. Not an Implementation Guide

This document **does not**:
- Select specific technologies (no "use BigQuery" or "use Snowflake")
- Design data warehouse schemas (no star schemas, fact tables, dimensions)
- Specify ETL tools or workflows (no Airflow, dbt, Fivetran recommendations)
- Provide SQL queries or transformation logic

**Why:** Implementation details depend on future scale, budget, team skills, and specific business needs. Premature technology selection often leads to over-engineering.

### 10.2. Not a Data Modeling Guide

This document **does not**:
- Define entity-relationship diagrams for analytical layer
- Specify column names, data types, or constraints
- Design aggregation tables or materialized views

**Why:** Data modeling for analytics should be driven by actual queries, not abstract schemas.

### 10.3. Not a Real-Time Analytics Commitment

This document **does not**:
- Promise real-time streaming analytics
- Require complex event processing or stream processing frameworks
- Assume sub-second data freshness for analytical queries

**Why:** Most business questions are answered with daily or hourly data updates. Real-time analytics is expensive and rarely necessary.

### 10.4. Not a Replacement for Operational Monitoring

This document **does not**:
- Replace Prometheus/Grafana monitoring (system health remains separate)
- Duplicate logging and tracing infrastructure
- Re-define metrics already covered in Monitoring & Observability Plan

**Why:** Operational monitoring and business analytics serve different purposes and should remain separate.

---

## 11. Risks & Trade-offs

### 11.1. Risk: Overbuilding Analytics Too Early

**Description:**
Investing in data warehouse infrastructure before business needs justify it.

**Consequences:**
- Engineering effort diverted from product development
- Maintenance burden for under-utilized infrastructure
- Complexity without corresponding value

**Mitigation:**
- Wait for clear pain points (performance degradation, recurring complex queries)
- Start with minimal solutions (read replicas, optimized indexes)
- Require business justification before committing to DWH

### 11.2. Risk: Stale Data in Analytical Layer

**Description:**
Analytical layer falls out of sync with operational data.

**Consequences:**
- Stakeholders see outdated metrics
- Decisions based on incorrect data
- Loss of trust in analytics

**Mitigation:**
- Clear documentation of data freshness expectations
- Monitoring for ETL pipeline health
- Alerting when data staleness exceeds thresholds

### 11.3. Risk: Data Governance Overhead

**Description:**
Managing access controls, privacy, and data quality across multiple systems.

**Consequences:**
- Increased complexity in compliance (GDPR, data retention)
- Risk of PII leakage in analytical layer
- Effort spent on governance instead of analysis

**Mitigation:**
- Automate privacy controls (anonymization in ETL)
- Centralized data catalog and documentation
- Regular audits of analytical data contents

### 11.4. Risk: Misuse of Metrics

**Description:**
Metrics in analytical layer used to judge individuals or teams inappropriately.

**Consequences:**
- Gaming of metrics ("teaching to the test")
- Loss of trust between teams and management
- Focus on measured metrics at expense of unmeasured outcomes

**Mitigation:**
- Clear communication about metric purpose and limitations
- Use metrics for insight, not punishment
- Balance quantitative metrics with qualitative assessment

### 11.5. Trade-off: Flexibility vs. Governance

**Description:**
Self-service analytics (flexible) vs. governed metrics (consistent).

**Considerations:**
- Self-service empowers stakeholders but risks inconsistent definitions
- Governed metrics ensure consistency but may be slow to evolve
- Balance: core metrics governed, exploration queries flexible

**Approach:**
- Define canonical metrics (conversion rate, retention, etc.) with clear ownership
- Allow ad-hoc queries but label as "exploratory" vs. "official"

### 11.6. Trade-off: Freshness vs. Cost

**Description:**
More frequent data updates = higher infrastructure and complexity costs.

**Considerations:**
- Real-time analytics requires streaming infrastructure (expensive)
- Hourly updates require more complex ETL scheduling
- Daily batch updates are simplest and cheapest

**Approach:**
- Default to daily updates unless business need for higher frequency is demonstrated
- Use operational database for real-time dashboards
- Reserve analytical layer for historical and aggregated analysis

---

## 12. Conclusion

### 12.1. Summary

This document provides **planning context** for the evolution of analytics infrastructure from MVP v1's operational databases to a potential dedicated analytical layer in v2 and beyond.

**Key Takeaways:**
1. MVP v1's approach (operational database for analytics) is appropriate for current scale
2. A data warehouse becomes relevant when specific pain points emerge (performance, complexity, scale)
3. Evolution should be driven by demonstrated business need, not anticipation
4. Implementation details (technology, schema, ETL) should be deferred until decision point
5. Analytics infrastructure should support decision-making, not become an end in itself

### 12.2. Decision Framework Summary

**Stay in MVP v1 when:**
- Current analytics capabilities meet business needs
- Operational database performance is acceptable
- Team is focused on product development

**Consider v2 Transition when:**
- Analytical queries impact transactional performance
- Business questions require complex historical analysis
- Multiple stakeholders need self-service analytics
- Dedicated data/analytics role or team exists

**Implementation Approach (if/when v2 is triggered):**
- Start minimal (read replica, basic ETL)
- Iterate based on usage patterns
- Optimize for common queries, not edge cases
- Maintain simplicity and clarity

### 12.3. Next Steps (When Relevant)

**This document does not trigger action.** It provides context for future planning.

If/when the decision is made to invest in analytical infrastructure:
1. Document specific business questions driving the need
2. Evaluate technology options based on current scale and team skills
3. Design minimal viable analytical layer (not full DWH)
4. Implement incrementally, validate value at each step
5. Iterate and expand based on usage patterns

### 12.4. Document Maintenance

**Review Triggers:**
- Operational database performance degradation due to analytical queries
- Stakeholder feedback that current analytics are insufficient
- Hiring of dedicated data/analytics roles
- Business requests for complex historical reporting

**This document should be reviewed annually or when considering analytics infrastructure investments.**

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Data Warehouse (DWH)** | A database optimized for analytical queries, typically storing historical and aggregated data derived from operational systems |
| **Operational Database** | The primary transactional database serving the application (PostgreSQL in MVP v1) |
| **Analytical Workload** | Queries focused on aggregation, historical trends, and business intelligence (vs. transactional CRUD operations) |
| **ETL** | Extract, Transform, Load—process of moving data from source systems (operational DB) to analytical systems (DWH) |
| **OLAP** | Online Analytical Processing—database technology optimized for analytical queries (vs. OLTP for transactional queries) |
| **Materialized View** | Pre-computed query result stored as a table, used to speed up common analytical queries |
| **Data Domain** | Logical grouping of related data (e.g., users, bookings, warehouses) |
| **Data Lineage** | Documentation of data flow from source to destination, including transformations applied |
| **Slowly Changing Dimension** | Data that changes infrequently (e.g., warehouse attributes) and requires historical tracking |

---

## Document Status

**Status:** 🟡 SUPPORTING - Planning Only (Non-Canonical)

**Alignment:**
- ✅ Consistent with Analytics_Metrics_Tracking_Specification (defines events, not DWH)
- ✅ Complements Monitoring & Observability Plan (different concerns)
- ✅ Respects Data Retention Policy (privacy and compliance)
- ✅ Aligned with Technical Architecture (future evolution, not current state)
- ✅ No technology selection (vendor-neutral)
- ✅ No schema design (conceptual only)
- ✅ No scope creep (planning, not implementation)

**What This Document Provides:**
- ✅ Context for when and why DWH becomes relevant
- ✅ Analytical use case descriptions (conceptual)
- ✅ Data domain organization (high-level)
- ✅ Evolution decision framework
- ✅ Governance and quality considerations (conceptual)

**What This Document Does NOT Provide:**
- ❌ Technology recommendations
- ❌ Implementation roadmap
- ❌ Data warehouse schema design
- ❌ ETL/ELT specifications
- ❌ BI tool selection
- ❌ Real-time analytics guarantees

---

**Last Updated:** December 18, 2025  
**Version:** 1.0  
**Document Owner:** Technical Documentation Engine  
**Review Status:** Planning Document - Not for Implementation  
**Next Review:** When considering analytics infrastructure investments  

---

**END OF DOCUMENT**
