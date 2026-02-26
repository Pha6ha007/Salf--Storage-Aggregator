# Operator Billing & Settlement System — Deep Tech Specification (MVP → v2)

**Project:** Self-Storage Aggregator  
**Document ID:** DOC-061  
**Version:** 1.1 (Scope-Lightened)  
**Date:** December 18, 2025  
**Phase:** MVP v1 → Post-MVP Conceptual Exploration  
**Status:** 🟡 SUPPORTING / NON-CANONICAL / CONCEPTUAL

---

> **Document Status:** 🟡 SUPPORTING / NON-CANONICAL  
> **Type:** Conceptual Exploration Only  
> **Binding Nature:** Non-Binding  
> **Purpose:** Exploratory thinking about possible billing evolution
>
> **CRITICAL DISCLAIMERS:**
> - This document does NOT establish legal obligations or guarantees
> - This document does NOT define accounting procedures or tax treatment
> - This document does NOT commit to specific payout timelines or amounts
> - This document does NOT select or integrate specific financial service providers
> - This document describes CONCEPTUAL possibilities, not requirements or implementation plans

---

## Document Metadata

| Parameter | Value |
|-----------|-------|
| **Project** | Self-Storage Aggregator |
| **Type** | Supporting / Conceptual Financial Exploration |
| **Target Audience** | Product leadership, System architects, Financial operations planning |
| **Canonical Status** | NON-CANONICAL |
| **Implementation Status** | CONCEPTUAL — Not for implementation |
| **Dependencies** | DOC-097 (Payment Architecture — CANONICAL), DOC-070 (Monetization Strategy), Legal documents |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Billing & Settlement Philosophy](#2-billing--settlement-philosophy)
3. [MVP v1 Baseline State](#3-mvp-v1-baseline-state)
4. [Core Billing Concepts (Conceptual)](#4-core-billing-concepts-conceptual)
5. [High-Level Settlement Flow (Conceptual)](#5-high-level-settlement-flow-conceptual)
6. [Reconciliation & Dispute Handling](#6-reconciliation--dispute-handling)
7. [Automation Boundaries](#7-automation-boundaries)
8. [Relation to Other Documents](#8-relation-to-other-documents)
9. [Non-Goals & Explicit Exclusions](#9-non-goals--explicit-exclusions)
10. [Risks & Misuse Scenarios](#10-risks--misuse-scenarios)

---

# 1. Document Role & Scope

## 1.1. Purpose

This document explores how the Self-Storage Aggregator platform **might** evolve its operator billing and settlement processes from the simple manual approach in MVP v1 toward more structured processes in future phases.

**Core Question:**  
*"What are possible directions for evolving the platform's financial relationship with operators, without making binding commitments or designing specific implementations?"*

## 1.2. Document Nature & Limitations

**This Document IS:**
- Conceptual exploration of billing evolution possibilities
- Accounting-aware without implementing accounting systems
- Non-binding discussion of potential future directions
- Identification of boundaries and considerations

**This Document IS NOT:**
- Legal contract or operator payment terms
- Accounting system design (no ledgers, journals, GL entries)
- Tax specification or calculation system
- Provider selection or integration specification
- Implementation guide with code or API specifications
- Compliance guarantee or regulatory framework

**Intended Use:**  
Product planning discussions, architectural exploration, understanding boundaries.

**NOT Intended For:**  
Operator communications, financial reporting procedures, tax/accounting guidance, immediate implementation.

## 1.3. Scope Boundaries

**In Scope:**
- Conceptual billing event types
- High-level settlement concepts
- Automation vs. manual decision boundaries
- Data boundary considerations

**Out of Scope:**
- Commission percentages or fee structures (see DOC-070)
- Legal contracts or payment terms
- Tax calculation or reporting
- Accounting procedures
- Bank/PSP selection
- Real-time settlement guarantees

## 1.4. Relationship to Canonical Documents

This document is **SUPPORTING** and **subordinate** to:
- **DOC-097 (Payment Architecture — CANONICAL):** Where overlap exists, DOC-097 takes precedence
- **DOC-070 (Monetization Strategy):** Pricing and business model decisions
- **Legal & Compliance Documents:** DOC-054 defines compliance requirements

**Conflict Resolution:** Canonical specifications are authoritative. This document should align with canonical sources.

---

# 2. Billing & Settlement Philosophy

## 2.1. Core Principles

### 2.1.1. Correctness Over Speed
Accuracy of financial calculations is more important than real-time processing. Batch processing and human review are acceptable approaches.

### 2.1.2. Traceability
Every financial transaction must be traceable to source events. Audit trails capture who did what and when.

### 2.1.3. Auditability
Financial operations must support external audit and regulatory review. Financial state should be reconstructable from event history.

### 2.1.4. No Silent Automation
Financial processes should include human oversight checkpoints. Automated calculations may be useful, but execution typically requires approval.

### 2.1.5. Conservative Assumptions
When in doubt, favor the operator's interest or delay processing until clarity exists. Unknown states trigger manual review.

## 2.2. Common Design Patterns

**Event Sourcing:**  
Financial state could be derived from immutable event streams for complete audit trails.

**Idempotency:**  
Financial operations could be designed to produce the same result if executed multiple times, enabling safe retry.

**Compensating Transactions:**  
Errors could be corrected by creating new transactions rather than modifying history.

---

# 3. MVP v1 Baseline State

## 3.1. Current Financial Model

**MVP v1 operates with offline payments and manual settlement:**

### Payment Model
- Users and operators handle payments directly (offline)
- Platform does NOT process online payments
- Platform tracks `payment_status` for operational visibility only

### Settlement Model
- Platform does NOT calculate commissions automatically
- Platform does NOT generate operator invoices
- Platform does NOT execute payouts to operators
- All financial settlements are handled **manually outside the platform**

### Data Structures (MVP v1)

```typescript
// Booking entity tracks payment status but not actual payments
interface Booking {
  deposit: number;
  price_total: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'refunded';
  payment_received_at?: Date;
}
```

**Reality:** No payment transactions, commission tracking, settlement records, or invoice generation. Financial operations occur entirely outside the platform.

## 3.2. Potential Evolution Drivers

Future evolution beyond MVP v1 may be driven by:
- Scalability needs (manual reconciliation doesn't scale)
- Transparency desires (operators want visibility into earnings)
- Automation opportunities (reducing manual errors and overhead)
- Trust building (transparent billing)
- Compliance needs (formalized audit trails)

---

# 4. Core Billing Concepts (Conceptual)

## 4.1. Billable Events

A **billable event** could be any platform activity that may result in charges or settlements.

**Types:**
- **Transaction-Based:** Booking payments, extensions, cancellations (variable amount, tied to booking)
- **Time-Based:** Subscription fees, periodic charges (fixed amount, time-driven)
- **Manual:** Adjustments, credits, penalties (human-initiated, exceptional)

## 4.2. Settlement Concepts

### 4.2.1. Settlement Models

**Possible Approaches:**

**Gross Settlement:**  
Platform collects payment, then transfers operator share.

**Net Settlement:**  
Operator receives payment, remits commission to platform.

**MVP v1 State:** Neither implemented (offline payments)

### 4.2.2. Settlement Periods

**Possible Patterns:**
- Daily, weekly, bi-weekly, or monthly aggregation
- Trade-off between operational complexity and operator cash flow
- Longer periods = simpler operations but delayed payment

### 4.2.3. Minimum Thresholds

Settlements below a minimum amount could be carried forward to reduce transaction costs, though this may delay payment for low-volume operators.

## 4.3. Adjustments & Corrections

**Types:**
- Credits to operator (refunds, corrections, waivers)
- Debits to operator (chargebacks, penalties)

**Key Principle:** Never silently adjust balances. Always notify with justification.

## 4.4. Commission Models (Conceptual)

**Possible Models:**
- Percentage-based (e.g., 15% of booking)
- Fixed-fee (e.g., $5 per booking)
- Hybrid (fixed + percentage)
- Subscription + transaction

**Note:** Actual model selection is defined in DOC-070 Monetization Strategy.

---

# 5. High-Level Settlement Flow (Conceptual)

## 5.1. Conceptual Flow Stages

A possible settlement flow could progress through:

```
[Event Capture] → [Aggregation] → [Review] → [Execution] → [Reconciliation]
```

### Event Capture
Record billable events as they occur with timestamp, amounts, and source references.

### Aggregation
Accumulate events within a settlement period and calculate operator balances.

### Review
Human or automated verification before execution. Anomaly detection flags unusual patterns.

### Execution
Transfer funds or update balances. Methods could range from manual bank transfers to semi-automated or automated processes.

### Reconciliation
Verify settlement matches intended amount. Identify and resolve discrepancies.

## 5.2. Event Recording Considerations

**Data Captured Might Include:**
- Event type, timestamp, operator reference
- Gross amount, commission amount, currency
- Settlement status, audit trail

**Validation:**  
Events should reference valid entities and have reasonable amounts.

## 5.3. Review Stage Options

**Automated Checks Could Include:**
- Balance reasonableness verification
- Duplicate detection
- Reconciliation with external reports

**Manual Review Might:**
- Spot-check samples
- Review flagged anomalies
- Verify high-value transactions
- Approve or reject settlements

## 5.4. Execution Approaches

**Possible Evolution:**

**Manual (Early Phases):**  
Finance team manually initiates transfers and records payments.

**Semi-Automated (Later):**  
Platform generates instructions, finance team reviews and approves batch execution.

**Automated (Advanced):**  
Platform executes approved settlements with strong guardrails and monitoring.

**Note:** Progression is exploratory, not committed. Each approach has trade-offs.

---

# 6. Reconciliation & Dispute Handling

## 6.1. Reconciliation Types

**Internal:** Ensure platform's internal records are consistent (balances sum correctly, no double-counting).

**External:** Match platform records with external sources (payment providers, bank transfers).

## 6.2. Mismatch Detection

**System Could Monitor For:**
- Discrepancies between platform and external records
- Incorrect calculations
- Missing transactions

**Operator-Reported Issues:**
- Settlement not received
- Incorrect amount
- Missing bookings

**Response:** Acknowledge, investigate using audit trail, determine root cause, provide explanation, issue correction if needed.

## 6.3. Dispute Workflow

**Possible Process:**
1. Operator formally disputes settlement or event
2. Create dispute record, freeze affected settlement if not executed
3. Investigate using audit trail
4. Determine resolution (operator correct, platform correct, ambiguous, split)
5. Document decision, create adjustment if needed
6. Notify operator, close dispute

**Principle:** Disputes resolved with transparency and fairness.

## 6.4. Correction Approach

**Forward Corrections:**  
Never modify historical records. Apply corrections as new adjustment transactions in the next period.

**Benefits:** Preserves audit trail, makes corrections visible.

---

# 7. Automation Boundaries

## 7.1. Possible Automation Candidates

**Could Be Automated (With Safeguards):**
- Recording billable events
- Calculating commissions
- Generating draft settlement statements
- Detecting anomalies
- Sending notifications (after approval)

**Rationale:** Deterministic, reversible, verifiable operations.

## 7.2. Should Remain Manual

**Human Judgment Required:**
- Approving settlement execution
- Resolving disputes
- Approving adjustments
- Handling exceptional situations
- Making ambiguous decisions

**Rationale:** These require context, judgment, and accountability.

## 7.3. Review Triggers

**System Should Escalate To Human When:**
- Settlement amount exceeds threshold
- Balance changed significantly from previous period
- Anomaly detected
- Operator has active dispute
- First settlement for new operator
- Unusual patterns detected

**Principle:** Better to over-escalate than under-escalate financial issues.

---

# 8. Relation to Other Documents

## 8.1. DOC-097: Payment & Billing Integration Architecture (CANONICAL)

DOC-097 is canonical and defines payment processing. DOC-061 (this document) is supporting and describes operator billing concepts. Where overlap exists, DOC-097 takes precedence.

## 8.2. DOC-070: Monetization Strategy

DOC-070 defines business model and pricing decisions. DOC-061 describes operational concepts, not pricing decisions.

## 8.3. DOC-054: Legal Checklist & Compliance

DOC-054 defines legal requirements. DOC-061 operates within legal boundaries but does not define them.

## 8.4. DOC-001: Functional Specification

DOC-001 defines MVP v1 scope (offline payments, manual settlement). DOC-061 describes post-MVP possibilities.

## 8.5. Database & Backend Specifications

MVP v1 has no settlement or billing tables. DOC-061 explores what might be added in future phases, not what exists now.

---

# 9. Non-Goals & Explicit Exclusions

## 9.1. This Document Does NOT

### Legal & Contractual
- ❌ Establish legal obligations or operator payment terms
- ❌ Define guaranteed payout schedules
- ❌ Specify commission rates or structures
- ❌ Create SLAs for settlement processing

### Financial Systems
- ❌ Design accounting system (chart of accounts, GL, journals)
- ❌ Handle tax obligations (calculation, withholding, reporting)
- ❌ Generate financial statements (P&L, balance sheet)
- ❌ Ensure GAAP or IFRS compliance

### Provider Selection
- ❌ Select banks, PSPs, or payout providers
- ❌ Choose accounting software
- ❌ Integrate specific financial services

### Implementation
- ❌ Provide API endpoint definitions
- ❌ Define database schemas
- ❌ Include code examples
- ❌ Guarantee accuracy or timeliness

## 9.2. Out of Scope for MVP v1

The following are explicitly OUT OF SCOPE for MVP v1:
- Automated commission calculation
- Settlement statement generation
- Reconciliation dashboard
- Payout execution
- Dispute workflow
- Financial reporting for operators

**MVP v1 Reality:** All operator billing and settlement is manual, outside the platform.

---

# 10. Risks & Misuse Scenarios

## 10.1. Implementation Risks

**Over-Automation Risk:**  
Implementing too much too quickly without testing. Mitigation: Start manual, add guardrails, retain overrides.

**Under-Testing Risk:**  
Insufficient testing of financial logic. Mitigation: Extensive testing, parallel processing during transitions.

**Complexity Creep:**  
Too many special cases. Mitigation: Keep rules simple, document exceptions, regular simplification.

## 10.2. Operational Risks

**Data Inconsistency:**  
Records become inconsistent. Mitigation: Single source of truth, automated consistency checks.

**Human Error:**  
Manual operations introduce errors. Mitigation: Clear workflows, double-entry for high-value, audit trails.

**Timing Issues:**  
Processing delays. Mitigation: Set realistic expectations, communicate proactively.

## 10.3. Financial Risks

**Dispute Escalation:**  
Disputes escalate to legal action. Mitigation: Transparent practices, fair resolution, document everything.

**Regulatory Exposure:**  
Billing practices violate regulations. Mitigation: Legal consultation, compliance audits, proper documentation.

**Fraud:**  
System manipulation. Mitigation: Access controls, audit logging, anomaly detection, separation of duties.

## 10.4. Document Misuse Scenarios

**Treating as Legal Contract:**  
Using this for operator agreements. **Wrong:** This is conceptual planning, not legal instrument. **Correct:** Legal team drafts contracts.

**Treating as Accounting System:**  
Using for financial reporting or taxes. **Wrong:** This describes operational concepts, not accounting. **Correct:** Integrate with proper accounting software.

**Treating as Implementation Spec:**  
Directly implementing from this document. **Wrong:** This is conceptual, not implementation-ready. **Correct:** Create canonical specifications first.

**Making Commitments:**  
Telling operators "we will pay within 7 days." **Wrong:** This document makes no commitments. **Correct:** Establish terms in contracts, use this for planning only.

---

# Appendix A: Illustrative Data Structures

> **⚠️ CRITICAL DISCLAIMER:**  
> The structures below are **ILLUSTRATIVE EXAMPLES ONLY** for conceptual discussion.  
> They are **NOT schemas, NOT implementation guidance, NOT requirements**.  
> Actual implementation would require proper canonical database specifications.  
> Do NOT use these for implementation without creating proper canonical specs first.

## A.1. Billable Event (Illustrative Example Only)

```typescript
// ILLUSTRATIVE ONLY - NOT FOR IMPLEMENTATION
interface BillableEvent {
  event_id: string;
  event_type: 'booking_payment' | 'refund' | 'adjustment' | 'subscription';
  operator_id: string;
  gross_amount: number;
  commission_amount: number;
  currency: string;
  event_timestamp: Date;
  settlement_status: 'pending' | 'included' | 'settled';
}
```

## A.2. Settlement Period (Illustrative Example Only)

```typescript
// ILLUSTRATIVE ONLY - NOT FOR IMPLEMENTATION
interface SettlementPeriod {
  period_id: string;
  period_start: Date;
  period_end: Date;
  status: 'draft' | 'approved' | 'executed' | 'reconciled';
  total_operators: number;
  total_commission: number;
}
```

## A.3. Operator Settlement (Illustrative Example Only)

```typescript
// ILLUSTRATIVE ONLY - NOT FOR IMPLEMENTATION
interface OperatorSettlement {
  settlement_id: string;
  operator_id: string;
  opening_balance: number;
  closing_balance: number;
  settlement_amount: number;
  settlement_status: 'pending' | 'executed' | 'failed';
}
```

---

# Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Billable Event** | Platform activity that may result in charges or settlements |
| **Settlement Period** | Time interval for aggregating events before settlement |
| **Commission** | Fee charged by platform on operator transactions |
| **Adjustment** | Manual correction to billing or settlement amounts |
| **Reconciliation** | Verifying financial records match expected state |
| **Dispute** | Formal operator challenge to settlement |
| **Payout** | Transfer of funds from platform to operator |
| **Traceability** | Ability to link transactions to source events |
| **Auditability** | Property enabling external audit |
| **Idempotency** | Duplicate operations produce same result |

---

# Appendix C: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-18 | Technical Documentation Engine | Initial conceptual specification |
| 1.1 | 2025-12-18 | Technical Documentation Engine | Scope-lightened version: reduced volume ~30%, softened automation language, moved data structures to appendix with strong disclaimers |

---

# Appendix D: Document Status Summary

> **Status:** 🟡 SUPPORTING / NON-CANONICAL / CONCEPTUAL  
> **Type:** Conceptual Exploration Only  
> **Phase:** Post-MVP Exploratory Thinking
>
> This document is **CONCEPTUAL EXPLORATION** of how billing **might** evolve.  
> It is **NOT binding, NOT a contract, NOT an accounting system, NOT an implementation spec**.
>
> **Appropriate Use:**  
> - ✅ Internal planning discussions  
> - ✅ Understanding possible future directions  
> - ✅ Identifying boundaries and considerations  
>
> **Inappropriate Use:**  
> - ❌ Making commitments to operators  
> - ❌ Implementing directly without canonical specs  
> - ❌ Legal, tax, or compliance purposes  
> - ❌ Creating expectations about timelines or features

---

**END OF DOCUMENT**

**This document explores possibilities, not requirements.**  
**All future implementation requires proper canonical specifications.**
