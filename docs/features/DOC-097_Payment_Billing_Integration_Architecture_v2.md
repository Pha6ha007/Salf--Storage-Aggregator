# Payment & Billing Integration Architecture (v2)

**Project:** Self-Storage Aggregator  
**Document ID:** DOC-097  
**Version:** 2.0  
**Date:** December 17, 2025  
**Phase:** v2 / Post-MVP  
**Status:** 🟢 GREEN / Canonical / Codegen-ready / GCC-ready

---

> **Document Status:** 🟢 GREEN / Canonical / Codegen-ready / GCC-ready  
> **Canonical:** ✅ Yes  
> **Phase:** v2 / Post-MVP  
>
> This document establishes the canonical architectural foundation for payment and billing  
> integration with strict region-driven provider selection. The architecture explicitly avoids  
> hard-coded payment provider dependencies and supports multi-region deployment including GCC markets.  
> All payment provider selection and activation logic is resolved via region-level configuration.

---

## Document Information

| Field | Value |
|-------|-------|
| **Purpose** | Define conceptual architecture for payment and billing system integration |
| **Scope** | Architectural patterns, integration strategies, and design principles for v2+ |
| **Target Audience** | System architects, Product leadership, Payment operations, Security team |
| **Dependencies** | DOC-070 (Monetization Strategy), DOC-061 (Billing System), DOC-078 (Security), DOC-001 (MVP Requirements) |
| **Implementation Status** | NOT IMPLEMENTED - Conceptual planning document |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Payment & Billing Landscape](#2-payment--billing-landscape)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Core Payment Flows (Conceptual)](#4-core-payment-flows-conceptual)
5. [Billing & Invoicing Concepts](#5-billing--invoicing-concepts)
6. [Security & Compliance Considerations](#6-security--compliance-considerations)
7. [Error Handling & Failure Modes](#7-error-handling--failure-modes)
8. [Multi-Country Considerations](#8-multi-country-considerations)
9. [Evolution & Roadmap](#9-evolution--roadmap)
10. [Relationship to Canonical Documents](#10-relationship-to-canonical-documents)
11. [Non-Goals](#11-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document establishes the architectural foundation for integrating payment processing and billing systems into the Self-Storage Aggregator platform. It addresses the question: **"How might we structure payment and billing capabilities to support the platform's business model?"**

The architecture described here is conceptual and forward-looking, designed to inform future implementation decisions rather than prescribe specific solutions.

## 1.2. Scope

**This document covers:**

- Architectural patterns for payment provider integration
- Conceptual flows for booking payments, refunds, and settlements
- Billing system integration points and responsibilities
- Security and compliance architectural considerations
- Failure mode analysis and error handling strategies
- Multi-currency and multi-region architectural implications

**Phase:** v2 / Post-MVP (Payment processing is explicitly OUT OF SCOPE for MVP v1)

## 1.3. Current State (MVP v1)

**MVP v1 Payment Model:**
- Payments are handled **offline** between users and operators
- Booking entity tracks `payment_status` for operational visibility
- No online payment processing or gateway integration
- No automated billing or invoicing

**MVP v1 Data Model Support:**
```typescript
// From: full_database_specification_mvp_v1_CANONICAL.md
interface Booking {
  deposit: number;
  price_total: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'refunded';
  payment_received_at?: Date;
}

interface OperatorSettings {
  deposit_percentage: number; // 0-100, default 50%
}
```

This architecture document describes how these foundational elements may evolve into a full payment processing system in future phases.

## 1.4. Non-Goals

**This document does NOT:**

- Define specific payment provider selection (Stripe vs Stripe vs others)
- Specify pricing rules, commission percentages, or fee structures
- Design user interface or user experience for payment flows
- Define legal contracts or terms of service
- Calculate tax treatment or accounting procedures
- Replace or override DOC-061 (Billing System Spec) or DOC-070 (Monetization Strategy)
- Provide implementation-ready API contracts (these belong in API specifications)

## 1.5. Design Principles

**Region-Driven Payment Provider Selection:**

Payment provider selection MUST be region-driven. The core platform MUST NOT reference or depend on specific payment providers directly. All payment provider selection and activation logic MUST be resolved via region-level configuration.

A region may have an active payment provider, multiple providers, or no online payment capabilities. The absence of online payment processing is a valid operational state managed through configuration, not code-level constraints.

---

# 2. Payment & Billing Landscape

## 2.1. Payment Provider Categories

The platform may integrate with multiple provider types, each serving distinct use cases:

### 2.1.1. Card Payment Processors

**Capabilities:**
- Credit and debit card processing
- Strong Customer Authentication (SCA) / 3D Secure 2
- Tokenization for recurring payments
- Dispute and chargeback management
- PCI DSS Level 1 compliant infrastructure

**Integration Pattern:**  
Direct API integration with hosted payment fields or redirect flows for card capture.

### 2.1.2. Digital Wallets & Alternative Methods

**Capabilities:**
- Apple Pay, Google Pay, Samsung Pay
- Local payment methods (SBP in Russia, iDEAL in Netherlands, etc.)
- Buy Now Pay Later (BNPL) services
- Cryptocurrency (future consideration)

**Integration Pattern:**  
Provider-specific SDKs or unified payment gateway abstraction.

### 2.1.3. Bank Transfer Systems

**Capabilities:**
- Direct bank transfers (ACH, SEPA, wire transfers)
- Virtual account numbers for payment tracking
- Settlement delays (2-5 business days typical)
- Lower transaction costs than cards

**Integration Pattern:**  
Asynchronous webhook-based flow with payment reconciliation.

## 2.2. Billing System Categories

### 2.2.1. Transaction-Based Billing

**Model:**  
Platform charges commission on each completed transaction (booking payment).

**Characteristics:**
- Real-time revenue recognition
- Simple operator understanding
- Direct correlation to platform value

### 2.2.2. Subscription-Based Billing

**Model:**  
Operators pay periodic fees for platform access and features.

**Characteristics:**
- Predictable recurring revenue
- Feature tier differentiation
- Independent of transaction volume

### 2.2.3. Hybrid Models

**Model:**  
Combination of base subscription + transaction fees or revenue share.

**Characteristics:**
- Balanced risk and reward
- Scales with operator success
- More complex billing logic

> **Note:** DOC-070 (Monetization Strategy) defines which model(s) the platform adopts.  
> This document describes architectural support for any of these models.

## 2.3. Escrow & Agent Models (Conceptual)

### 2.3.1. Platform as Payment Agent

**Flow:**
1. User pays platform
2. Platform holds funds temporarily
3. Platform transfers to operator after service delivery or agreed timeline

**Implications:**
- Platform must be licensed as payment agent in applicable jurisdictions
- Requires escrow account structure
- Higher regulatory compliance burden
- Better user protection and dispute resolution

### 2.3.2. Direct Operator Payments

**Flow:**
1. User pays operator directly
2. Platform facilitates connection only
3. Operator remits commission to platform separately

**Implications:**
- Lower regulatory burden for platform
- Operator manages payment processing relationship
- Platform depends on operator compliance for revenue collection
- Potentially simpler for multi-country expansion

> **Decision Point:** Choice between these models is a business and legal decision,  
> not a pure technical one. Architecture must support either model.

---

# 3. High-Level Architecture

## 3.1. Architectural Components

### 3.1.1. Payment Orchestration Layer

**Responsibility:**  
Coordinates payment operations across multiple providers, manages provider failover, and maintains unified payment state.

**Key Capabilities:**
- Multi-provider abstraction
- Provider health monitoring and circuit breakers
- Payment intent management
- Idempotency guarantees
- Event sourcing for audit trail

**Integration Points:**
- Booking Service (initiates payments)
- Notification Service (payment status updates)
- Billing Service (commission calculation)

### 3.1.2. Provider Adapter Layer

**Responsibility:**  
Translates platform-agnostic payment operations into provider-specific API calls.

**Key Capabilities:**
- Provider-specific authentication and credential management
- Request/response transformation
- Webhook signature verification
- Error code normalization
- Rate limit management

**Design Pattern:**  
Strategy pattern with pluggable provider implementations.

### 3.1.3. Payment State Machine

**Responsibility:**  
Maintains authoritative state of payment lifecycle across distributed operations.

**States (Conceptual):**
- `initiated` → Payment intent created
- `processing` → Provider processing payment
- `requires_action` → User action needed (3DS, etc.)
- `succeeded` → Payment confirmed
- `failed` → Terminal failure
- `cancelled` → User or system cancelled
- `refunded` → Full or partial refund applied

**Transitions:**  
State transitions driven by provider webhooks, timeouts, and manual operations.

### 3.1.4. Webhook Reception & Processing

**Responsibility:**  
Securely receives and processes asynchronous provider notifications.

**Key Capabilities:**
- Signature verification (prevents spoofing)
- Deduplication (handle retries idempotently)
- Ordered processing (maintain event ordering where critical)
- Dead letter queue (handle processing failures)

**Architecture Pattern:**  
Event-driven processing with message queue buffering.

### 3.1.5. Reconciliation Engine

**Responsibility:**  
Ensures platform payment records match provider transaction logs.

**Key Capabilities:**
- Automated daily reconciliation
- Discrepancy detection and alerting
- Manual reconciliation workflow support
- Settlement report processing

**Schedule:**  
Batch job execution with configurable frequency.

## 3.2. External Provider Integration

### 3.2.1. Synchronous Operations

**Use Cases:**
- Create payment intent
- Capture authorized payment
- Initiate refund
- Retrieve payment status

**Pattern:**  
Request-response HTTP API calls with timeout and retry logic.

**Timeout Strategy:**
- Short timeouts (5-10 seconds) for read operations
- Longer timeouts (30-60 seconds) for write operations
- Exponential backoff for retries on 5xx errors

### 3.2.2. Asynchronous Operations

**Use Cases:**
- Payment completion notification
- Refund confirmation
- Dispute/chargeback notification
- Settlement payout notification

**Pattern:**  
Provider-initiated webhook POST to platform endpoints.

**Security:**
- HTTPS-only webhook URLs
- Provider signature verification (HMAC-SHA256 or equivalent)
- IP allowlisting where provider supports
- Replay attack prevention (timestamp validation)

## 3.3. Data Flow Architecture

### 3.3.1. Booking Payment Flow (Conceptual)

```
User → Frontend
    ↓
Booking API → Payment Orchestrator → Provider Adapter → Payment Provider
    ↑                                                           ↓
    ←←←←←←←←←←←←←←← Webhook Receiver ←←←←←←←←←←←←←←←←←←←←←←←←←←←←
    ↓
Booking State Updated → Notification Sent
```

### 3.3.2. Settlement Flow (Conceptual)

```
Payment Provider → Webhook Receiver → Billing Service
                                           ↓
                                    Calculate Commission
                                           ↓
                                    Operator Settlement Record
                                           ↓
                                    Payout Initiation (future)
```

### 3.3.3. Refund Flow (Conceptual)

```
Operator → Dashboard → Booking API → Payment Orchestrator
                                           ↓
                                    Provider Adapter → Provider
                                           ↑
Booking Updated ←← Webhook Receiver ←←←←←←←
      ↓
User Notified
```

---

# 4. Core Payment Flows (Conceptual)

## 4.1. Booking Payment Flow

### 4.1.1. Payment Intent Creation

**Trigger:** User completes booking form and initiates payment.

**Steps:**
1. Booking service calculates total amount (price + deposit)
2. Payment orchestrator creates provider-agnostic payment intent
3. Provider adapter calls payment provider API
4. Provider returns payment intent ID and client secret
5. Frontend receives client secret for payment method capture

**State:** Booking remains in `pending` status until payment succeeds.

### 4.1.2. Payment Method Capture

**Trigger:** User enters payment details in provider-hosted UI or payment sheet.

**Steps:**
1. Frontend submits payment method to provider (client-side, PCI-free)
2. Provider performs fraud checks and card validation
3. Provider may require 3D Secure authentication
4. Provider responds with payment status (success, requires_action, failed)

**State Transitions:**
- Success → Booking becomes `confirmed`, payment_status = `paid`
- Requires action → User redirected for 3DS, booking remains `pending`
- Failure → Booking remains `pending`, user prompted to retry

### 4.1.3. Payment Confirmation (Webhook)

**Trigger:** Payment provider sends webhook notification.

**Steps:**
1. Webhook receiver validates signature and deduplicates
2. Payment state machine updates to `succeeded`
3. Booking service updates booking status to `confirmed`
4. Notification service sends confirmation email/SMS to user
5. Notification service sends new booking alert to operator
6. Billing service records commission obligation

**Idempotency:** Duplicate webhooks do not cause duplicate booking confirmations.

## 4.2. Partial Payment & Deposit Handling

### 4.2.1. Deposit-Only Payment (Optional Model)

**Scenario:** User pays deposit upfront, remainder due later.

**Flow:**
1. Booking created with `payment_status = 'partial'`
2. Initial payment for deposit amount
3. Booking becomes `confirmed` upon deposit payment
4. Remainder payment scheduled before booking start date
5. Booking cannot start if remainder unpaid

**State Management:**
- Track multiple payment records per booking
- Associate each payment with specific purpose (deposit, remainder, extension)

### 4.2.2. Full Payment Upfront (Default Model)

**Scenario:** User pays full amount at booking.

**Flow:**
1. Single payment for `price_total`
2. Booking becomes `confirmed` and `payment_status = 'paid'` atomically
3. Simpler state management, preferred for MVP

## 4.3. Refund Processing

### 4.3.1. Operator-Initiated Refund

**Trigger:** Operator cancels booking and approves refund.

**Steps:**
1. Operator marks booking as `cancelled` with reason
2. Operator dashboard shows refund eligibility and amount
3. Operator initiates refund request
4. Payment orchestrator validates refund rules (time limits, amount limits)
5. Provider adapter calls refund API
6. Provider processes refund (immediate or delayed depending on provider)
7. Webhook confirms refund completion
8. User notified of refund processing

**Refund Amount Calculation:**
- May be full or partial based on cancellation policy
- Policy defined in `operator_settings.cancellation_policy`
- Platform does not enforce specific policies (operator decision)

### 4.3.2. User-Initiated Refund Request

**Trigger:** User requests booking cancellation.

**Steps:**
1. User cancels booking through frontend
2. Cancellation policy evaluated automatically
3. If refund eligible, refund amount calculated
4. Refund request sent to operator for approval
5. Operator approves/rejects via dashboard
6. If approved, same flow as operator-initiated refund

**Automatic vs Manual Approval:**
- Operator setting: `auto_approve_refunds` (boolean)
- Automatic approval possible for early cancellations
- Manual approval required for late cancellations or disputes

### 4.3.3. Partial Refund Scenarios

**Use Cases:**
- Early termination of booking (refund unused months)
- Service issue compensation
- Goodwill gesture

**Implementation:**
- Refund API accepts amount parameter
- Amount must not exceed original payment
- Multiple partial refunds possible (up to total amount)

## 4.4. Dispute & Chargeback Handling

### 4.4.1. Dispute Notification

**Trigger:** User initiates chargeback with their bank.

**Steps:**
1. Provider sends webhook: `payment.dispute.created`
2. Platform marks payment as `disputed`
3. Platform collects evidence from operator (booking details, communication, T&Cs)
4. Evidence submitted to provider
5. Provider forwards to user's bank
6. Bank rules on dispute

**Outcomes:**
- **Won:** Payment restored, dispute fee may apply
- **Lost:** Payment reversed, dispute fee deducted
- **Partially won:** Partial amount retained

### 4.4.2. Automated Evidence Collection

**Strategy:**
- Capture booking confirmation email timestamp
- Store operator-user communication logs
- Link booking to warehouse address and box details
- Attach signed terms and conditions
- Provide access logs if physical access recorded

**Submission Deadline:**  
Disputes typically have 7-15 day response window. Automated submission reduces risk of missed deadlines.

## 4.5. Settlement to Operators

### 4.5.1. Settlement Calculation

**Trigger:** Booking payment successfully captured.

**Components:**
- Gross payment amount
- Platform commission (percentage or fixed fee)
- Payment provider fees (if passed through)
- Net amount owed to operator

**Formula (Conceptual):**
```
Net to Operator = Gross Payment - Platform Commission - Provider Fees
```

**Timing:**
- Calculate immediately upon payment capture
- Record as `operator_settlement` entry
- Actual payout may occur on scheduled cycle (weekly, monthly)

### 4.5.2. Payout Execution (Future)

**Models:**

**Manual Payout (MVP approach):**
- Operator invoices platform for accumulated settlements
- Platform processes bank transfer manually

**Automated Payout (v2+):**
- Platform initiates payouts via provider payout API
- Scheduled batch processing (weekly/bi-weekly/monthly)
- Operator configures bank account details
- Minimum payout threshold to reduce transaction costs

### 4.5.3. Settlement Reconciliation

**Process:**
- Daily batch job reconciles settlements against actual payouts
- Identifies discrepancies (missed settlements, incorrect amounts)
- Generates operator settlement statements
- Supports audit trail for financial reporting

---

# 5. Billing & Invoicing Concepts

## 5.1. Operator Billing Cycles

### 5.1.1. Billing Period Definition

**Concept:**  
Operators are billed for platform usage on a recurring schedule.

**Common Patterns:**
- **Monthly:** Bill on calendar month basis (1st to last day)
- **Anniversary:** Bill on operator signup anniversary
- **Rolling:** Bill on fixed date regardless of signup

**Implementation Consideration:**  
Prorated billing for mid-cycle signups or cancellations.

### 5.1.2. Billing Triggers

**Trigger Types:**

**Time-Based:**
- End of billing period reached
- Scheduled batch job generates invoices

**Event-Based:**
- Transaction threshold reached (e.g., 100 bookings processed)
- Usage limit exceeded

**Manual:**
- Administrator generates ad-hoc invoice
- Adjustment invoice for corrections

## 5.2. Platform Commission Flow

### 5.2.1. Commission Calculation

**Input Data:**
- Booking payment amount
- Operator tier or commission rate
- Promotional discounts or waivers

**Calculation:**
```
Commission = Booking Total × Commission Rate × (1 - Discount Factor)
```

**Timing:**
- Calculate upon payment capture (real-time)
- Do not calculate for pending/unpaid bookings

### 5.2.2. Commission Aggregation

**Process:**
1. Each booking payment records individual commission amount
2. Billing service aggregates commissions by operator and period
3. Invoice generation pulls aggregated amounts
4. Invoice line items provide booking-level detail

**Reporting:**
- Operator sees commission deductions on settlement statement
- Platform sees commission revenue by operator, period, region

## 5.3. Invoice Generation (Conceptual)

### 5.3.1. Invoice Content

**Required Fields:**
- Invoice number (unique, sequential)
- Operator details (name, tax ID, address)
- Platform details (issuer)
- Billing period
- Line items (individual charges)
- Subtotal, taxes, total
- Payment terms and due date
- Payment instructions

**Line Item Types:**
- Subscription fees
- Transaction commissions
- Add-on services (featured listings, priority support, etc.)
- Credits or adjustments

### 5.3.2. Invoice Delivery

**Channels:**
- Email (PDF attachment)
- Operator dashboard (download link)
- API endpoint (for operator accounting system integration)

**Notification:**
- Invoice ready notification
- Payment reminder (if unpaid after X days)
- Overdue notice (if unpaid after due date)

### 5.3.3. Payment Collection

**Methods:**

**Manual:**
- Operator initiates bank transfer
- Platform marks invoice as paid manually

**Automated:**
- Stored payment method (card on file)
- Direct debit authorization
- Automatic charge on due date

**Failure Handling:**
- Retry failed payments (up to N attempts)
- Notify operator of failed payment
- Suspend account if payment overdue beyond grace period

## 5.4. Tax Handling (Out of Scope for Architecture)

**Complexity:**
- Multi-jurisdiction VAT/GST
- Reverse charge mechanisms
- Tax exemptions and certificates
- Reporting requirements

**Recommendation:**  
Integrate with specialized tax calculation service (Avalara, TaxJar, etc.) or consult tax professionals.

**Architecture Implication:**  
Invoice generation must support tax line items even if calculations are external.

---

# 6. Security & Compliance Considerations

## 6.1. PCI DSS Compliance (Conceptual)

### 6.1.1. Scope Reduction Strategy

**Principle:**  
Platform should **never** handle raw card data (PAN, CVV, expiry).

**Implementation Patterns:**

**Hosted Payment Fields:**
- Provider-hosted iframes capture card data directly
- Platform receives only tokenized reference
- Platform remains out of PCI scope

**Payment Sheet / SDK:**
- Provider SDK handles card capture on device
- Encrypted card data sent directly to provider
- Platform receives payment confirmation only

**Redirect Flow:**
- User redirected to provider-hosted payment page
- User enters card details on provider domain
- User redirected back to platform with payment result

**Benefit:** SAQ-A compliance (simplest PCI self-assessment).

### 6.1.2. Token Management

**Token Types:**

**Single-Use Tokens:**
- Valid for one transaction only
- Used for one-time payments
- Automatically expire after use

**Multi-Use Tokens:**
- Valid for recurring charges
- Stored for subscription or extension payments
- Require PCI compliance considerations even for tokens

**Token Storage:**
- Store provider payment method ID (token reference)
- Do not store card numbers or CVV
- Encrypt token references at rest
- Restrict access to payment service only

## 6.2. Authentication & Authorization

### 6.2.1. Payment Initiation

**Rule:** Only authenticated user who owns booking can initiate payment.

**Verification:**
- JWT token validates user identity
- Booking ownership check: `booking.user_id === authenticated_user_id`
- Payment amount matches booking price (prevent amount tampering)

### 6.2.2. Refund Authorization

**Rule:** Only operator who owns warehouse OR platform admin can initiate refunds.

**Verification:**
- Operator token: `warehouse.operator_id === authenticated_operator_id`
- Admin token: Role-based access control (RBAC) grants refund permission
- Audit log records who initiated refund

### 6.2.3. Webhook Authentication

**Rule:** Only legitimate provider webhooks are processed.

**Verification:**
- Provider signature header (e.g., `Stripe-Signature`)
- HMAC-SHA256 with shared secret
- Timestamp validation (prevent replay attacks)
- IP allowlist (if provider publishes webhook IPs)

## 6.3. Secrets Management

### 6.3.1. API Keys & Credentials

**Storage:**
- Environment variables (for simple deployments)
- Secret management service (HashiCorp Vault, AWS Secrets Manager)
- Never commit to version control
- Rotate regularly (quarterly or upon suspected compromise)

**Access:**
- Only payment service has access to payment provider credentials
- Other services cannot directly call payment APIs

### 6.3.2. Webhook Secrets

**Management:**
- Separate secret per provider
- Rotatable without downtime (transition period with both old and new secrets valid)
- Documented rotation procedure

## 6.4. Fraud Detection & Prevention

### 6.4.1. Provider-Native Fraud Tools

**Reliance on Provider:**
- Modern payment providers have ML-based fraud detection
- Radar (Stripe), Risk Evaluation (Stripe), etc.
- Configure risk tolerance levels (block suspicious, challenge, allow)

**Platform Role:**
- Review flagged transactions
- Provide additional context to provider (user behavior, booking history)

### 6.4.2. Platform-Level Signals

**Indicators:**
- Multiple failed payment attempts (card testing)
- High-value bookings from new accounts
- Rapid successive bookings
- Mismatched billing and delivery addresses (if applicable)
- Velocity checks (X bookings per user per day)

**Action:**
- Flag for manual review
- Require additional verification (email, phone, ID upload)
- Block transaction and require contact with support

> **Reference:** DOC-105 (Fraud Detection Strategy, if exists) for detailed rules.

## 6.5. Data Protection & Privacy

### 6.5.1. Payment Data Retention

**PCI Requirement:**  
Do not store card data. Tokens may be stored if properly secured.

**Transaction Records:**
- Store: Transaction ID, amount, currency, timestamp, status
- Do not store: PAN, CVV, full track data
- Retention: Per DOC-DATA-RETENTION policy

### 6.5.2. User Rights (GDPR/PDPA)

**Right to Access:**
- User can export payment history
- Excludes provider-internal details (e.g., fraud scores)

**Right to Deletion:**
- Anonymize user in transaction records (keep amounts and dates for accounting)
- Delete tokenized payment methods
- Retain transaction IDs for reconciliation and audit (legal requirement)

---

# 7. Error Handling & Failure Modes

## 7.1. Provider Downtime

### 7.1.1. Detection

**Monitoring:**
- Health check endpoint calls at regular intervals
- Timeout thresholds (e.g., 5 seconds for health check)
- Status page subscriptions (provider incident notifications)

**Metrics:**
- Success rate (% of API calls succeeding)
- Latency percentiles (p50, p95, p99)
- Error rate by error type

### 7.1.2. Mitigation

**Circuit Breaker Pattern:**
- Open circuit after N consecutive failures
- Reject new payment attempts with clear error message
- Retry health checks at increasing intervals
- Close circuit when provider recovers

**Fallback Strategy:**
- Display provider outage notice to users
- Queue payment intents for retry when provider recovers (if acceptable)
- Multi-provider setup: Failover to secondary provider (complex, may not be viable for MVP)

**User Communication:**
- Clear error message: "Payment system temporarily unavailable. Please try again in a few minutes."
- Avoid technical jargon
- Offer alternative: "Contact support for manual payment processing."

## 7.2. Webhook Loss or Delay

### 7.2.1. Problem

**Scenario:**  
Provider sends webhook, but platform does not receive it (network issue, downtime, firewall block, etc.).

**Impact:**
- Payment succeeded but booking remains `pending`
- User paid but receives no confirmation
- Operator not notified of new booking

### 7.2.2. Detection

**Polling Mechanism:**
- Scheduled job polls provider API for payment status
- Compare provider status with platform status
- Identify stale payments (status mismatch)

**Frequency:**
- Every 15 minutes for payments in `processing` state
- Stop polling after payment reaches terminal state (`succeeded`, `failed`, `cancelled`)

### 7.2.3. Reconciliation

**Automatic Reconciliation:**
- Polling job updates payment state based on provider response
- Trigger booking confirmation flow if payment succeeded
- Send delayed notifications

**Manual Reconciliation:**
- Operator reports unpaid but confirmed booking
- Support checks provider dashboard
- Manually update payment status if needed

## 7.3. Duplicate Payments

### 7.3.1. Cause

**Scenarios:**
- User clicks "Pay" button multiple times
- Network retry causes duplicate request
- Browser back button and re-submit
- Webhook delivered multiple times

### 7.3.2. Prevention

**Idempotency Keys:**
- Client generates unique key per payment intent
- Provider API call includes idempotency key
- Provider returns cached response for duplicate key
- Prevents duplicate charges

**Implementation:**
```
Idempotency Key = booking_id + "_payment_" + attempt_id
```

**Booking-Level Constraint:**
- Database constraint: One payment per booking in `processing` state
- Attempting second payment for same booking returns existing payment intent

### 7.3.3. Detection & Resolution

**Duplicate Charge Detection:**
- User reports double charge
- Query provider transactions by user identifier
- Identify duplicate transactions with same booking reference

**Resolution:**
- Immediately refund duplicate payment
- Notify user of duplicate and refund
- Root cause analysis to prevent recurrence

## 7.4. Payment-Booking State Inconsistency

### 7.4.1. Problem

**Scenario:**  
Payment succeeds at provider, but booking update fails (database error, service crash, etc.).

**Result:**
- Provider shows payment succeeded
- Booking remains `pending` in platform
- User charged but booking not confirmed

### 7.4.2. Prevention

**Transactional Outbox Pattern:**
1. Webhook handler writes event to `payment_events` table
2. Transaction commits
3. Background job processes event and updates booking
4. If booking update fails, event remains in queue for retry

**Idempotent Webhook Processing:**
- Webhook handler processes each event exactly once
- Duplicate webhook reprocessing is safe (no double-confirmation)

### 7.4.3. Recovery

**Reconciliation Job:**
- Identify bookings in `pending` with associated payment in `succeeded` state
- Automatically transition booking to `confirmed`
- Send delayed confirmation notifications
- Alert operations team for review

## 7.5. Refund Failures

### 7.5.1. Causes

- Original payment method expired or closed
- Insufficient funds in platform merchant account
- Provider API error or downtime
- Regulatory restriction (cannot refund to certain countries)

### 7.5.2. Handling

**Automatic Retry:**
- Retry refund API call with exponential backoff
- Maximum retry attempts (e.g., 3 attempts over 24 hours)

**Manual Intervention:**
- If automatic retry exhausted, flag for manual review
- Support team processes refund via alternative method (bank transfer)
- Update refund status manually after confirmation

**User Communication:**
- Notify user of refund delay
- Provide expected resolution timeline
- Offer alternative refund method if applicable

---

# 8. Multi-Country Considerations

## 8.1. Currency Handling

### 8.1.1. Multi-Currency Support

**Requirement:**  
Platform operates in multiple countries with different currencies.

**Architecture Implications:**

**Storage:**
- All monetary amounts stored with currency code (ISO 4217)
- Database columns: `amount INTEGER, currency VARCHAR(3)`
- Example: `price_total: 5000, currency: "RUB"`

**Display:**
- Format amounts per locale (currency symbol, decimal separator)
- JavaScript: `Intl.NumberFormat` API
- Backend: Use locale-aware formatting libraries

**Provider Configuration:**
- Payment provider account must support target currency
- Some providers require separate accounts per currency
- Settlement currency may differ from charge currency

### 8.1.2. Exchange Rate Management

**When Needed:**
- Platform commission calculated in base currency (e.g., USD)
- Operator pays in local currency
- Conversion required for financial reporting

**Strategy:**
- Use provider's exchange rate (if available)
- Integrate with exchange rate API (e.g., exchangerate-api.io, Open Exchange Rates)
- Lock-in rate at transaction time (store historical rates)

## 8.2. Local Payment Providers

### 8.2.1. Regional Provider Preferences

**Russia:**
- Stripe (formerly Yandex.Kassa)
- Sberbank Online
- SBP (Fast Payment System)

**Europe:**
- Stripe (global reach)
- Adyen (strong European presence)
- iDEAL (Netherlands), SOFORT (Germany), Bancontact (Belgium)

**Asia:**
- Razorpay (India)
- Omise (Thailand, Japan, Singapore)
- PayPal (global, high fees)

**Architecture Requirement:**  
Provider adapter layer must support multiple providers simultaneously. User's country determines which providers are offered.

### 8.2.2. Provider Selection Logic

**Factors:**
- User's country (geolocation or billing address)
- Currency
- Payment method preference (card vs bank transfer vs wallet)
- Provider availability and health

**Fallback:**
- Primary provider for region
- Secondary global provider (e.g., Stripe) if primary fails

## 8.3. Regulatory Differences

### 8.3.1. Payment Services Regulation

**European Union:**
- PSD2 (Payment Services Directive 2)
- Strong Customer Authentication (SCA) required
- Open banking support

**Russia:**
- Federal Law No. 161-FZ (payment system regulation)
- Data localization requirements for payment data
- Mandatory use of Russian payment system (Mir) for government employees

**Implications:**
- Legal review required for each target country
- Compliance burden varies significantly
- May dictate provider selection

### 8.3.2. Consumer Protection Laws

**Chargeback Rights:**
- EU: Chargeback possible up to 120 days
- US: 60-120 days depending on card network
- Russia: 30 days for online purchases

**Architecture Impact:**
- Booking cancellation policies must align with chargeback windows
- Evidence collection timeframe varies by jurisdiction

---

# 9. Evolution & Roadmap

## 9.1. MVP v1 State (Current)

**Payment Model:**
- Offline payments only
- No payment gateway integration
- Manual payment tracking via `payment_status` field

**Capabilities:**
- Booking creation with pricing calculation
- Payment status tracking (pending, paid, overdue, refunded)
- Deposit percentage configuration per operator

**Limitations:**
- No online payment processing
- No automated invoicing
- No refund automation
- Manual settlement reconciliation

## 9.2. v1.1 — Payment Gateway Integration (Planned)

**Scope:**
- Single payment provider integration (likely Stripe for Russian market)
- Card payments only
- Booking payment flow (initiate, capture, confirm)
- Basic webhook handling (payment success, payment failure)
- Basic refund support (operator-initiated, manual approval)

**Goals:**
- Enable online payment for bookings
- Reduce operator payment collection friction
- Improve user experience with instant booking confirmation

**Out of Scope:**
- Multiple provider support
- Automated billing/invoicing
- Subscription payments
- Dispute management automation

## 9.3. v1.2 — Billing & Settlement Automation

**Scope:**
- Automated commission calculation on each payment
- Operator settlement statement generation
- Invoice generation for operators (if subscription model adopted)
- Settlement reconciliation dashboard

**Goals:**
- Reduce manual accounting overhead
- Provide transparency to operators on earnings
- Enable accurate financial reporting

**Out of Scope:**
- Automated payouts to operators (still manual bank transfers)
- Multi-currency settlement
- Tax calculation automation

## 9.4. v2.0 — Advanced Payment Features

**Scope:**
- Multi-provider support with automatic failover
- Alternative payment methods (wallets, bank transfers, BNPL)
- Automated payout to operators via provider payout API
- Dispute and chargeback workflow automation
- Subscription billing for operator plans
- Multi-currency settlement with exchange rate management

**Goals:**
- Maximize payment success rate
- Reduce operational overhead for settlements
- Support international expansion with local payment methods

**Challenges:**
- Increased complexity in provider management
- Higher testing and QA burden
- Regulatory compliance across jurisdictions

## 9.5. Future Considerations (v3+)

**Potential Features:**
- Escrow service (platform holds funds until service delivery)
- Split payments (commission automatically deducted at payment time)
- Dynamic pricing integration (real-time price adjustments)
- Cryptocurrency payment support (experimental)
- Buy Now Pay Later (BNPL) for large bookings
- Installment payment plans

**Strategic Questions:**
- What level of financial services responsibility should platform assume?
- Does platform need payment institution license?
- How to balance feature richness vs regulatory complexity?

---

# 10. Relationship to Canonical Documents

This document is a **Supporting / Non-Canonical** architectural reference. It does NOT override or replace the following canonical documents:

## 10.1. Functional Specification (DOC-001)

**Reference:** `Functional_Specification_MVP_v1_CORRECTED.md`

**Relationship:**
- Functional spec defines **WHAT** payment features exist in MVP v1
- This document describes **HOW** payment systems may be architected in future
- MVP v1 explicitly states: "Payments handled offline" — this document respects that boundary

**Consistency Check:**
- This document references MVP v1 offline payment model
- Future payment features clearly marked as v1.1+ / v2+

## 10.2. API Design Blueprint (DOC-003)

**Reference:** `api_design_blueprint_mvp_v1_CANONICAL.md`

**Relationship:**
- API Blueprint defines current endpoints and data structures
- This document does NOT define new endpoints (those belong in API specs)
- Payment status enums referenced here match API Blueprint definitions

**Consistency Check:**
- `payment_status` values: `pending`, `partial`, `paid`, `overdue`, `refunded`
- Booking status values: `pending`, `confirmed`, `cancelled`, `completed`, `expired`

## 10.3. Database Specification (DOC-004)

**Reference:** `full_database_specification_mvp_v1_CANONICAL.md`

**Relationship:**
- Database spec defines current schema for `bookings` table
- This document references existing fields: `deposit`, `price_total`, `payment_status`
- Future payment-specific tables (e.g., `payment_transactions`, `refunds`) not defined in MVP

**Consistency Check:**
- All referenced fields exist in canonical database schema
- No new tables introduced in this document

## 10.4. Security & Compliance Plan (DOC-078)

**Reference:** `Security_and_Compliance_Plan_MVP_v1.md`

**Relationship:**
- Security plan defines implementation-level security controls
- This document references security principles (PCI DSS scope reduction, tokenization)
- Compliance requirements (GDPR, PDPA) mentioned in context of payment data

**Consistency Check:**
- PCI DSS scoping strategy aligns with platform security goals
- Payment data retention aligns with data retention policy

## 10.5. Monetization Strategy (DOC-070)

**Reference:** `DOC-070_Monetization_Strategy` (if exists)

**Relationship:**
- Monetization strategy defines business model (commission rates, subscription tiers, pricing)
- This document provides architectural support for any monetization model
- No specific commission percentages or pricing mentioned here

**Consistency Check:**
- Architecture supports transaction-based, subscription-based, or hybrid billing
- Deferring to monetization strategy for specific business rules

## 10.6. Billing System Specification (DOC-061)

**Reference:** `DOC-061_Billing_System_Spec` (if exists)

**Relationship:**
- Billing spec defines operational billing flows and rules
- This document provides architectural foundation for billing integration
- Billing spec takes precedence for business logic details

**Consistency Check:**
- Operator settlement concepts aligned with billing requirements
- Invoice generation architecture supports billing workflows

## 10.7. Multi-Country Expansion Strategy (DOC-095)

**Reference:** `DOC-095_Multi_Country_Expansion` (if exists)

**Relationship:**
- Expansion strategy defines target countries and rollout plan
- This document describes architectural considerations for multi-country payments
- Currency, provider, and regulatory sections support expansion planning

**Consistency Check:**
- Multi-currency architecture supports expansion roadmap
- Local provider support aligns with target markets

## 10.8. Error Handling Specification (DOC-009)

**Reference:** `Error_Handling_Fault_Tolerance_Specification_MVP_v1_CANONICAL.md`

**Relationship:**
- Error handling spec defines error codes and retry logic
- This document references payment-specific failure modes
- Appendix A of Error Handling Spec includes future payment error codes (v1.1+)

**Consistency Check:**
- Payment provider downtime handling aligns with circuit breaker patterns
- Webhook retry logic consistent with fault tolerance principles

---

# 11. Non-Goals

This document **explicitly does NOT**:

## 11.1. Define API Contracts

**What This Means:**
- No endpoint paths (e.g., `POST /api/v1/payments`)
- No request/response schemas
- No HTTP status codes or error codes
- No rate limits or throttling rules

**Where This Belongs:**  
API Design Blueprint (DOC-003) and API Detailed Specification (DOC-023)

## 11.2. Specify Business Rules

**What This Means:**
- No commission percentages or fee amounts
- No refund eligibility rules or time windows
- No minimum booking amounts or deposit requirements
- No specific cancellation policies

**Where This Belongs:**  
Monetization Strategy (DOC-070), Functional Specification (DOC-001)

## 11.3. Design User Interface

**What This Means:**
- No mockups or wireframes
- No UX flows or user journeys
- No frontend component design
- No accessibility requirements

**Where This Belongs:**  
Frontend Architecture Specification (DOC-025), Design System (DOC-028)

## 11.4. Provide Legal Guidance

**What This Means:**
- No interpretation of payment regulations
- No advice on licensing requirements
- No drafting of terms and conditions
- No tax treatment guidance

**Where This Belongs:**  
Legal review and consultation with licensed attorneys

## 11.5. Select Specific Providers

**What This Means:**
- No recommendation of Stripe vs Stripe vs others
- No provider comparison or benchmarking
- No contract negotiation guidance
- No pricing comparison of provider fees

**Where This Belongs:**  
Vendor selection process involving product, finance, and legal stakeholders

## 11.6. Define Implementation Timeline

**What This Means:**
- No sprint planning or story points
- No resource allocation or team assignments
- No release dates or milestones
- No dependency management

**Where This Belongs:**  
Project management artifacts (roadmap, sprint plans, Gantt charts)

## 11.7. Replace Billing System Spec

**What This Means:**
- This document describes architecture for billing integration
- Billing System Spec (DOC-061) defines operational billing processes
- If conflict exists, DOC-061 takes precedence

**Relationship:**  
Architectural foundation for billing, not operational billing specification

---

# Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Payment Provider** | Third-party service that processes payments (e.g., Stripe, Stripe) |
| **Payment Gateway** | API-based interface to payment provider |
| **Payment Intent** | Provider-side object representing a payment attempt |
| **Tokenization** | Replacing sensitive card data with non-sensitive token reference |
| **PCI DSS** | Payment Card Industry Data Security Standard |
| **3D Secure (3DS)** | Authentication protocol for card payments (e.g., SMS code) |
| **Chargeback** | User disputes payment with their bank, reversing transaction |
| **Settlement** | Transfer of funds from platform to operator (or vice versa) |
| **Reconciliation** | Process of matching platform records with provider transaction logs |
| **Webhook** | HTTP callback from provider to platform for asynchronous notifications |
| **Idempotency** | Property ensuring duplicate requests produce same result |
| **Circuit Breaker** | Pattern for handling external service failures gracefully |
| **Escrow** | Funds held by third party until conditions met |

---

# Appendix B: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Architecture Team | Initial document creation |
| 2.0 | 2025-12-17 | Architecture Team | Added Design Principles section (1.5) establishing canonical region-driven payment provider selection architecture; Updated document status to Canonical/Codegen-ready/GCC-ready |

---

# Appendix C: Document Status Summary

> **Status:** 🟢 GREEN / Canonical / Codegen-ready / GCC-ready  
> **This Document is Canonical**
>
> This document establishes the canonical architectural foundation for payment and billing  
> system integration. The architecture is built on the principle of region-driven payment  
> provider selection, ensuring the platform has no hard-coded dependencies on specific  
> payment systems and can support diverse payment models across multiple markets including GCC.
>
> **Key Architectural Principles:**  
> - Payment provider selection MUST be region-driven  
> - Core platform MUST NOT depend on specific payment providers  
> - Provider selection and activation resolved via region-level configuration  
> - Regions may have active providers, multiple providers, or no online payments  
> - Absence of online payments is a valid configuration state  
>
> **For Implementation:**  
> - This document defines the canonical payment architecture for v2+  
> - Refer to Functional Specification (DOC-001) for MVP v1 scope  
> - Refer to API Design Blueprint (DOC-003) for endpoint definitions  
> - Refer to Database Specification (DOC-004) for schema details  
> - Refer to Security Plan (DOC-078) for security implementation  
>
> **For Multi-Region Deployment:**  
> - Architecture explicitly supports GCC and other international markets  
> - No code changes required to add new regions with different payment providers  
> - Payment provider activation is configuration-driven, not code-driven

---

**END OF DOCUMENT**
