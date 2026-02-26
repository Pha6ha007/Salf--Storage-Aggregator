# User Personas & User Journeys (MVP v1)

**Self-Storage Aggregator Platform**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-089 |
| **Version** | 1.0 |
| **Status** | 🟡 Supporting / Product Discovery |
| **Date** | December 16, 2025 |
| **Project** | Self-Storage Aggregator MVP v1 |
| **Authors** | Product & UX Research Team |
| **Last Updated** | 2025-12-16 |

---

> **Document Status:** 🟡 Supporting / Product Discovery  
> **Canonical:** ❌ No  
>
> This document describes representative user personas and journeys.
> It does NOT define UI behavior, business rules, or system contracts.
>
> **Purpose:**  
> Provide context for product, design, and development teams about who uses the platform and why. This is a reference document for understanding user motivations and pain points, not a specification for implementation.
>
> **For Canonical Requirements, See:**
> - DOC-001 — Functional Specification MVP v1 (Product Requirements)
> - DOC-002 — Technical Architecture Document (System Design)
> - DOC-016 — API Detailed Specification (Technical Contracts)
> - DOC-023 — Booking Flow Technical Specification (Supporting)
> - DOC-046 — Frontend Architecture Specification (UI Structure)
> - DOC-088 — User Experience Guide (Renters)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Primary User Personas](#2-primary-user-personas)
3. [Secondary Personas](#3-secondary-personas)
4. [High-Level User Journeys](#4-high-level-user-journeys)
5. [Pain Points & Opportunities](#5-pain-points--opportunities)
6. [MVP Assumptions](#6-mvp-assumptions)
7. [Relationship to Canonical Documents](#7-relationship-to-canonical-documents)
8. [Non-Goals](#8-non-goals)

---

## 1. Introduction

### 1.1. Purpose

This document presents representative user personas and conceptual user journeys for the Self-Storage Aggregator platform MVP v1. It is designed to help the team understand:

- **Who** uses the platform
- **Why** they seek storage solutions
- **What** motivates their decisions
- **What** concerns or friction points they experience

This understanding informs design decisions, communication strategies, and feature prioritization while remaining separate from technical specifications and implementation details.

### 1.2. Scope (MVP v1)

This document focuses exclusively on personas and journeys relevant to MVP v1 capabilities:

**In Scope:**
- Individual renters seeking personal storage
- Small business owners needing commercial storage
- Warehouse operators managing small to medium facilities
- High-level conceptual journeys (discovery → evaluation → action → post-action)
- Pain points and decision drivers

**Out of Scope:**
- Large enterprise storage needs
- Corporate fleet management
- Property management companies (unless as secondary personas)
- Detailed UI flows or wireframes
- API contracts or technical specifications
- Acceptance criteria or test scenarios

### 1.3. Non-Goals

**This Document Does NOT:**

1. **Define UI Behavior**  
   We describe user motivations and goals, not specific screens, buttons, or interactions.

2. **Specify Business Rules**  
   Business logic, validation rules, and system behavior are defined in canonical documents (DOC-001, DOC-016).

3. **Create Acceptance Criteria**  
   User stories and acceptance criteria live in DOC-001 and related documents.

4. **Mandate Implementation**  
   Personas and journeys are descriptive, not prescriptive. They inform but do not dictate technical choices.

5. **Replace User Research**  
   These personas are informed estimates based on domain knowledge. Real user research may validate or refine them.

6. **Introduce New Roles or Features**  
   All roles and capabilities referenced here align with DOC-001 (Functional Specification).

---

## 2. Primary User Personas

These are the core user types that MVP v1 is designed to serve.

---

### 2.1. Persona A: Individual Renter (Personal Storage)

**Name:** Elena Sokolova  
**Age:** 32  
**Occupation:** Marketing Manager  
**Location:** Moscow, Russia  
**Tech Comfort:** High (uses apps daily)

#### Background

Elena lives in a two-bedroom apartment in Moscow. She's accumulating seasonal items, sports equipment, and belongings from her recently deceased grandmother's estate that she's not ready to sort through yet.

Her apartment lacks storage space, and she's considering renting a storage unit for 3-6 months while she decides what to keep.

#### Goals

- **Find affordable storage** near her home or workplace
- **Understand what size unit** she needs (she has never rented storage before)
- **Book quickly** without phone calls or in-person visits
- **Trust the facility** is secure and clean

#### Motivations

- Decluttering her apartment to feel more organized
- Preserving sentimental items without overwhelming her living space
- Avoiding the stress of making immediate decisions about inherited belongings

#### Fears & Concerns

- **Choosing the wrong size** and paying for unused space or needing to move everything later
- **Hidden costs** or surprise fees
- **Security issues** — theft, poor access control, or damage to items
- **Complicated booking process** that requires multiple phone calls
- **Opaque pricing** — not knowing total cost upfront

#### Decision Drivers

- **Convenience:** Can she book online without extensive back-and-forth?
- **Transparency:** Clear pricing, photos, and reviews
- **Recommendations:** AI-powered size suggestion helps her feel confident
- **Location:** Proximity to home or public transport
- **Social proof:** Reviews from other individual users

#### How MVP v1 Serves Elena

- Search by location and filter by price
- AI Box Finder recommends appropriate unit size based on her item list
- Clear photos, pricing, and user reviews build trust
- Simple online booking request reduces friction
- Personal dashboard shows booking status

---

### 2.2. Persona B: Small Business Owner (Commercial Storage)

**Name:** Dmitry Petrov  
**Age:** 41  
**Occupation:** Owner of an online retail business (home goods)  
**Location:** Saint Petersburg, Russia  
**Tech Comfort:** Moderate (uses computers for business but not tech-savvy)

#### Background

Dmitry runs a small e-commerce business selling home décor and furniture. His inventory has outgrown his garage, and he needs professional storage with good access so he can retrieve items for shipping.

He needs a space that's clean, accessible during business hours, and reasonably priced. He's also concerned about having proper insurance and access control.

#### Goals

- **Find commercial-grade storage** with flexible access
- **Secure facility** with proper insurance options
- **Accessible location** for frequent pickups and deliveries
- **Predictable monthly costs** to manage cash flow
- **Book without lengthy negotiations**

#### Motivations

- Growing his business by managing inventory more professionally
- Freeing up home space for personal use
- Improving logistics efficiency (faster order fulfillment)

#### Fears & Concerns

- **Inadequate access hours** limiting his ability to fulfill orders
- **Poor security** leading to inventory loss
- **Unreliable operator** who doesn't respond or changes terms
- **Complicated contract process** that takes days or weeks
- **Damage to inventory** from poor climate control or pests

#### Decision Drivers

- **Accessibility:** 24/7 access or extended hours
- **Security features:** Surveillance, individual locks, staff presence
- **Business amenities:** Loading dock, climate control, insurance options
- **Cost predictability:** Fixed monthly rate, no surprise fees
- **Operator reliability:** Reviews and responsiveness

#### How MVP v1 Serves Dmitry

- Filter by business-relevant attributes (24/7 access, climate control, security)
- View detailed amenities and services
- See operator responsiveness through reviews
- Create booking request online (no phone tag)
- Dashboard tracks booking status and operator response

---

### 2.3. Persona C: Small Warehouse Operator

**Name:** Irina Volkova  
**Age:** 47  
**Occupation:** Owner of a small self-storage facility  
**Location:** Kazan, Russia  
**Tech Comfort:** Low to Moderate (uses email and basic software but prefers simple tools)

#### Background

Irina owns a small warehouse with 80 storage units. She currently manages bookings via phone and a spreadsheet. She's losing potential customers because people can't find her facility online or prefer to book digitally.

She's interested in an aggregator platform to increase visibility and simplify booking management, but she's wary of complex systems or high commissions.

#### Goals

- **Increase occupancy** by reaching more customers
- **Reduce administrative burden** (fewer phone calls, easier tracking)
- **Maintain control** over pricing and booking confirmations
- **Simple tools** that don't require technical expertise

#### Motivations

- Growing revenue from unused units
- Spending less time on admin tasks (more time on facility maintenance)
- Appearing professional to modern, tech-savvy customers
- Competing with larger facilities that have online presence

#### Fears & Concerns

- **Losing control** over who rents from her
- **High platform fees** eating into margins
- **Complex software** that she can't figure out
- **Bad customers** damaging units or causing issues
- **Platform dictating prices** or terms

#### Decision Drivers

- **Ease of use:** Simple dashboard, minimal learning curve
- **Fair revenue model:** No platform taking too much commission in MVP
- **Control:** She confirms bookings; platform doesn't force acceptance
- **Support:** Help available if she has issues
- **Visibility:** Platform brings her new customers she wouldn't reach otherwise

#### How MVP v1 Serves Irina

- Simple operator dashboard with basic metrics
- She receives booking requests and can confirm or decline
- No forced automation — she maintains decision authority
- Platform increases her facility's online visibility
- Email and SMS notifications keep her informed

---

## 3. Secondary Personas

These users are also relevant but less central to MVP v1 design.

---

### 3.1. Temporary User (Relocation Scenario)

**Profile:** Person moving between cities who needs short-term storage (1-3 months) during transition.

**Key Characteristics:**
- Time-sensitive need
- Clear end date for storage
- Price sensitivity (paying rent in two places)
- May be unfamiliar with destination city

**MVP v1 Relevance:**  
Search and booking features serve this user, but the platform doesn't explicitly optimize for relocation scenarios (no moving service integration, no city-specific relocation guides).

---

### 3.2. Seasonal User (Seasonal Storage)

**Profile:** Person with recurring storage needs tied to seasons (winter sports gear, summer furniture, etc.).

**Key Characteristics:**
- Predictable annual cycle
- May want the same unit each year
- Interested in long-term relationships with operators

**MVP v1 Relevance:**  
Basic booking and review features support this user, but MVP lacks recurring booking features or seasonal discount structures.

---

### 3.3. Property Manager (Indirect User)

**Profile:** Property managers who recommend storage solutions to tenants during moves or renovations.

**Key Characteristics:**
- Not the end renter but influences decisions
- Cares about reputation and tenant satisfaction
- May want bulk recommendations or partnerships

**MVP v1 Relevance:**  
This persona is not actively targeted in MVP v1. The platform doesn't have B2B partnership features, referral programs, or bulk booking tools.

---

## 4. High-Level User Journeys

These journeys are **conceptual** and describe the broad phases users move through. They do NOT prescribe specific UI steps or mandatory workflows.

---

### 4.1. Journey 1: Individual Renter (Elena)

#### Phase 1: Discovery

**Context:** Elena realizes she needs storage and starts exploring options.

**Activities:**
- Searches online for "storage near me" or "self-storage Moscow"
- Lands on platform homepage or catalog page
- Begins exploring available facilities

**Mindset:**
- Curious but uncertain about what she needs
- Wants to understand options without commitment
- Looking for reassurance and guidance

---

#### Phase 2: Evaluation

**Context:** Elena narrows down options and assesses fit.

**Activities:**
- Filters by location, price range, and attributes (climate control, security)
- Views warehouse details: photos, amenities, reviews
- Uses AI Box Finder to determine appropriate unit size
- Compares 2-3 facilities that meet her criteria

**Mindset:**
- More informed but still cautious
- Building trust through reviews and facility transparency
- Appreciates tools that reduce uncertainty (AI recommendation)

**Potential Friction:**
- Unclear pricing or hidden fees
- Insufficient photos or facility information
- Conflicting or fake reviews

---

#### Phase 3: Action

**Context:** Elena decides to book a unit.

**Activities:**
- Registers or logs into platform
- Submits booking request for chosen unit
- Receives confirmation that request is pending operator approval

**Mindset:**
- Committed but anxious about next steps
- Wants immediate confirmation of progress
- Hopes for quick operator response

**Potential Friction:**
- Confusing booking form or unclear required information
- No immediate feedback after submission
- Uncertainty about how long approval takes

---

#### Phase 4: Post-Action

**Context:** Elena waits for operator confirmation and prepares to move items.

**Activities:**
- Checks booking status in personal dashboard
- Receives notification when operator confirms booking
- Plans move-in logistics

**Mindset:**
- Relieved once confirmed
- Wants clarity on next steps (access codes, payment, move-in procedures)
- May write review after rental period ends

**Potential Friction:**
- Slow operator response leading to anxiety
- Unclear post-booking instructions
- Difficulty reaching operator if questions arise

---

### 4.2. Journey 2: Small Business Owner (Dmitry)

#### Phase 1: Discovery

**Context:** Dmitry's inventory has outgrown his current space and he's searching for commercial storage.

**Activities:**
- Searches for "warehouse storage" or "commercial storage"
- Evaluates whether platform serves business needs (not just consumer storage)
- Looks for business-friendly filters and features

**Mindset:**
- Practical and results-oriented
- Needs business features (extended access, security, insurance)
- Less price-sensitive than individual renters but values predictability

---

#### Phase 2: Evaluation

**Context:** Dmitry assesses facilities based on business criteria.

**Activities:**
- Filters by business amenities (24/7 access, loading dock, climate control)
- Reads reviews, especially from other business users
- Contacts operator directly if platform allows (email or messaging)
- Compares cost vs. convenience trade-offs

**Mindset:**
- Focused on operational fit (access hours, location logistics)
- Wants reliable operator who understands business needs
- Willing to pay more for right features

**Potential Friction:**
- Lack of business-specific filters or information
- Unclear whether facility allows commercial use
- No way to ask pre-booking questions

---

#### Phase 3: Action

**Context:** Dmitry finds suitable facility and initiates booking.

**Activities:**
- Submits booking request with business context (frequent access, inventory storage)
- Receives confirmation of pending request
- May follow up directly with operator

**Mindset:**
- Wants quick confirmation to maintain business timeline
- Prefers professional communication
- Values operator who understands business requirements

**Potential Friction:**
- Operator unfamiliar with business storage needs
- Slow response delays business operations
- Unclear terms or restrictions on commercial use

---

#### Phase 4: Post-Action

**Context:** Dmitry confirms booking and begins using storage for inventory.

**Activities:**
- Arranges logistics (moving inventory, setting up access)
- Uses facility regularly for order fulfillment
- Evaluates operator responsiveness and facility quality

**Mindset:**
- Building ongoing relationship with operator
- May leave review highlighting business-relevant aspects
- Considers long-term rental if experience is positive

**Potential Friction:**
- Access issues disrupting business operations
- Poor facility maintenance affecting inventory
- Operator unresponsive to business needs

---

### 4.3. Journey 3: Warehouse Operator (Irina)

#### Phase 1: Discovery

**Context:** Irina hears about platform from marketing or word-of-mouth.

**Activities:**
- Investigates whether platform is legitimate and beneficial
- Reads about platform terms, fees, and requirements
- Considers whether platform will bring her new customers

**Mindset:**
- Skeptical but hopeful about increasing occupancy
- Concerned about complexity or losing control
- Wants to understand commitment before joining

---

#### Phase 2: Onboarding

**Context:** Irina decides to list her facility on platform.

**Activities:**
- Registers as operator
- Completes verification process
- Adds warehouse information (location, amenities, photos)
- Lists available units with pricing

**Mindset:**
- Wants simple process without technical barriers
- Hopes for guidance or support if stuck
- Anxious about getting details right (pricing, descriptions)

**Potential Friction:**
- Confusing registration or verification steps
- Difficulty uploading photos or entering information
- Unclear platform policies or requirements

---

#### Phase 3: Managing Bookings

**Context:** Irina receives booking requests from platform users.

**Activities:**
- Reviews booking request details (user info, requested unit, dates)
- Decides to confirm or decline based on availability and user profile
- Communicates with user if needed (via platform messaging or phone)

**Mindset:**
- Maintains control over who rents from her
- Appreciates clear information to make decisions
- Values simple tools (confirm/decline buttons, clear notifications)

**Potential Friction:**
- Insufficient information about renter
- Difficult-to-use interface
- Unclear platform expectations for response time

---

#### Phase 4: Ongoing Operations

**Context:** Irina manages multiple bookings and maintains facility.

**Activities:**
- Monitors occupancy metrics in dashboard
- Responds to inquiries or issues from renters
- Updates pricing or availability as needed

**Mindset:**
- Wants to see return on investment (higher occupancy)
- Values simple tools that save time vs. manual spreadsheets
- May provide feedback on platform features

**Potential Friction:**
- Dashboard lacks needed information
- Platform doesn't integrate with her existing tools
- Feels platform creates more work than value

---

## 5. Pain Points & Opportunities

This section identifies common friction zones and potential opportunities for improving user experience.

---

### 5.1. Trust & Information Gaps

**Pain Points:**
- **Insufficient transparency:** Users can't assess facility quality without photos, detailed descriptions, or reviews
- **Fake or biased reviews:** Users question authenticity of positive feedback
- **Unclear pricing:** Hidden fees, deposits, or variable pricing create uncertainty
- **Unverified operators:** Users worry about scams or unprofessional facilities

**MVP v1 Response:**
- Platform displays photos, amenities, and user reviews for transparency
- Review system linked to completed bookings (verified reviews)
- Clear pricing display showing monthly cost
- Operator verification process (documented in DOC-001)

**Future Opportunities:**
- Enhanced verification badges (security audits, business licenses)
- More detailed review prompts (specific attribute ratings)
- Price comparison tools or market benchmarks

---

### 5.2. Decision Uncertainty

**Pain Points:**
- **Size confusion:** Users don't know what size unit they need
- **Feature overload:** Too many options without clear guidance
- **Comparison difficulty:** Hard to evaluate multiple facilities side-by-side

**MVP v1 Response:**
- AI Box Finder recommends unit size based on item descriptions
- Filter and sort tools help narrow options
- Facility detail pages provide comprehensive information

**Future Opportunities:**
- Side-by-side facility comparison tool (planned for v1.1+)
- Enhanced AI recommendations based on user behavior patterns
- Educational content (storage guides, size calculators)

---

### 5.3. Booking Friction

**Pain Points:**
- **Phone-only booking:** Users who prefer digital transactions must call operators
- **Slow response times:** Operators don't respond quickly, leaving users uncertain
- **Complex forms:** Excessive required fields frustrate users
- **No instant confirmation:** Users expect immediate booking confirmation (like hotel booking)

**MVP v1 Response:**
- Online booking request system reduces phone dependency
- Notifications keep users informed of booking status
- Simplified booking form with only essential fields
- Clear expectation: booking is a *request*, not instant confirmation (per DOC-001)

**Future Opportunities:**
- Instant booking for verified operators (bypass confirmation step)
- Automated reminders for operators to respond quickly
- Pre-qualification tools (calendar availability integration)

---

### 5.4. Operator Efficiency

**Pain Points:**
- **Manual processes:** Operators manage bookings via phone and spreadsheets
- **Missed opportunities:** Potential customers can't find or book facility
- **Time burden:** Administrative tasks take time away from facility management
- **Technology barriers:** Complex systems frustrate less tech-savvy operators

**MVP v1 Response:**
- Simple operator dashboard for booking management
- Online visibility increases customer reach
- Email and SMS notifications streamline communication
- Minimal learning curve for basic operations

**Future Opportunities:**
- Calendar integration for availability management
- Automated booking confirmations (opt-in for operators)
- Bulk operations for managing multiple units
- Analytics and reporting for business insights

---

### 5.5. Post-Booking Experience

**Pain Points:**
- **Lack of ongoing communication:** Users and operators lose touch after booking
- **Unclear next steps:** Users don't know move-in procedures or access details
- **Issue resolution:** No clear channel for addressing problems during rental
- **Renewal confusion:** Uncertainty about extending rental or ending agreement

**MVP v1 Response:**
- Personal dashboard shows booking details and status
- Operators can communicate with users through platform
- Booking history preserved for reference

**Future Opportunities:**
- Automated move-in guides sent after booking confirmation
- In-platform messaging for ongoing issues
- Renewal prompts and reminders (v1.1+)
- Digital contracts and documentation (v2.0+)

---

## 6. MVP Assumptions

These are assumptions about users and their behavior that MVP v1 is built upon. They have not been validated through extensive user research and may change based on real-world feedback.

---

### 6.1. User Behavior Assumptions

**Assumption 1: Users Prefer Digital Booking**  
We assume most users prefer booking online over phone calls, especially for initial discovery and comparison.

**Validation Needed:**  
Usage analytics (booking creation rate, conversion funnel analysis)

---

**Assumption 2: Size Uncertainty is a Major Barrier**  
We assume users struggle to determine appropriate storage unit size and value AI-powered recommendations.

**Validation Needed:**  
AI Box Finder usage rates, user surveys, support inquiries about sizing

---

**Assumption 3: Reviews Drive Trust**  
We assume user-generated reviews significantly influence booking decisions and operator selection.

**Validation Needed:**  
Correlation between review presence/quality and booking conversion rates

---

**Assumption 4: Simple Booking Wins**  
We assume users prefer a simple booking request form over complex multi-step processes or instant booking with payment.

**Validation Needed:**  
Abandonment rates at booking form, user feedback, A/B testing (future)

---

**Assumption 5: Users Accept Pending Status**  
We assume users understand and accept that booking is a *request* requiring operator confirmation (not instant like e-commerce).

**Validation Needed:**  
Support inquiries, user feedback about booking flow, cancellation rates

---

### 6.2. Operator Behavior Assumptions

**Assumption 6: Operators Want Control**  
We assume small/medium operators prefer manual booking confirmation over automated acceptance, even if it slows the process.

**Validation Needed:**  
Operator feedback, feature requests for instant booking, response time metrics

---

**Assumption 7: Low Tech Tolerance**  
We assume many operators have limited technical expertise and value simplicity over advanced features.

**Validation Needed:**  
Operator onboarding success rates, support inquiries, dashboard usage patterns

---

**Assumption 8: Visibility Drives Adoption**  
We assume operators join the platform primarily to increase occupancy by reaching new customers online.

**Validation Needed:**  
Operator surveys, occupancy changes post-listing, operator retention rates

---

**Assumption 9: Fair Revenue Model**  
We assume operators are sensitive to platform fees or commissions and prioritize keeping most revenue.

**Validation Needed:**  
Operator feedback on pricing model, competitive analysis (Note: MVP v1 does NOT include payment processing per DOC-001, so revenue model is future consideration)

---

### 6.3. Market Assumptions

**Assumption 10: Self-Storage Market is Growing**  
We assume demand for self-storage in Russia is increasing, driven by urbanization, smaller living spaces, and e-commerce growth.

**Validation Needed:**  
Market research, booking volume trends, seasonal patterns

---

**Assumption 11: Aggregators Add Value**  
We assume users and operators benefit from an aggregator model (vs. direct operator websites or classified ads).

**Validation Needed:**  
User acquisition costs, booking conversion vs. direct channels, operator satisfaction

---

### 6.4. What is NOT Assumed (Unknowns)

**Unknown 1: Price Sensitivity**  
We don't know exact price thresholds or willingness to pay across user segments.

**Unknown 2: Optimal Booking Flow**  
We don't know if request-based booking is optimal or if users strongly prefer instant confirmation.

**Unknown 3: Feature Priorities**  
We don't know which features (beyond core search/booking) users value most (comparison tools, advanced filters, AI features).

**Unknown 4: Operator Engagement**  
We don't know how actively operators will use dashboard features or respond to booking requests.

---

## 7. Relationship to Canonical Documents

This document is **non-canonical** and serves as supporting context. For authoritative information, always refer to canonical specifications.

---

### 7.1. Canonical Dependencies

This document is informed by and must align with:

**DOC-001 — Functional Specification MVP v1:**  
Defines all features, user roles, and product requirements. Personas and journeys reference capabilities defined in DOC-001 but do not introduce new ones.

**DOC-002 — Technical Architecture Document:**  
Describes system architecture and technical design. Personas do not imply or mandate architectural decisions.

**DOC-016 — API Detailed Specification:**  
Defines API contracts and data models. User journeys reference actions (search, book, review) that trigger API calls, but do not specify API design.

**DOC-046 — Frontend Architecture Specification:**  
Describes UI structure and components. Personas inform UX priorities but do not dictate specific UI implementations.

**DOC-078 — Security & Compliance Plan:**  
Defines security measures and RBAC (role-based access control). Personas must respect the four canonical roles: guest, user, operator, admin.

---

### 7.2. Supporting Documents (Non-Canonical)

**DOC-023 — Booking Flow Technical Specification (Supporting):**  
Provides detailed booking process documentation. User journeys in this document are high-level; DOC-023 contains technical details.

**DOC-088 — User Experience Guide (Renters):**  
Describes user-facing capabilities in plain language. This document (DOC-089) complements DOC-088 by adding persona context.

---

### 7.3. How to Use This Document

**For Product Managers:**  
Use personas to guide feature prioritization, communication strategies, and roadmap decisions. When writing requirements, reference DOC-001 (Functional Specification) as source of truth.

**For Designers:**  
Use personas to inform UX decisions and empathize with user needs. Design decisions must align with DOC-046 (Frontend Architecture) and DOC-001 (product requirements).

**For Developers:**  
Use personas to understand user context when implementing features. Technical specifications in DOC-002, DOC-016, and other canonical documents take precedence over this document.

**For Marketers:**  
Use personas to craft messaging, identify target audiences, and develop content strategies. Product capabilities must match DOC-001 (no overpromising features not in MVP v1).

**For Support Teams:**  
Use personas to anticipate common user issues and tailor support responses. Actual product behavior is defined by DOC-001 and canonical documents.

---

### 7.4. Conflict Resolution

**In Case of Discrepancy:**

If this document contradicts any canonical document (DOC-001, DOC-002, DOC-016, etc.):
- **Canonical documents always take precedence**
- Report the discrepancy to the product team for resolution
- Update this document to align with canonical sources

**Example Scenario:**  
If a persona journey describes a feature not present in DOC-001 (e.g., "instant booking confirmation"), that feature is NOT part of MVP v1, and the persona description is incorrect.

---

## 8. Non-Goals

**This Document Explicitly Does NOT:**

### 8.1. Define User Interface

**NOT Included:**
- Wireframes or mockups
- Specific screen layouts
- Button labels or form fields
- Navigation structures
- Visual design elements

**Why:**  
UI design is the domain of DOC-046 (Frontend Architecture) and design documentation. Personas provide context but do not dictate interface decisions.

---

### 8.2. Specify Acceptance Criteria

**NOT Included:**
- User story formats ("As a user, I want...")
- Acceptance criteria ("Given/When/Then" scenarios)
- Test cases or QA scripts
- Feature completion checklists

**Why:**  
Acceptance criteria are defined in DOC-001 (Functional Specification) and related documents. This document provides context, not requirements.

---

### 8.3. Define API or Data Models

**NOT Included:**
- API endpoint definitions
- Request/response formats
- Database schema
- Data validation rules
- Technical contracts

**Why:**  
API design and data models are specified in DOC-016 (API Detailed Specification) and DOC-050 (Database Specification). Personas do not influence technical architecture.

---

### 8.4. Mandate Business Rules

**NOT Included:**
- Booking confirmation logic
- Status transition rules
- Pricing calculations
- Availability checks
- Notification triggers

**Why:**  
Business rules are defined in DOC-001 and canonical documents. Personas describe user goals, not system behavior.

---

### 8.5. Replace User Research

**NOT Included:**
- Validated user insights from interviews or surveys
- Quantitative data on user preferences
- Competitive analysis or market research
- Usability testing results

**Why:**  
These personas are informed estimates. Real user research (interviews, surveys, usability testing) may confirm, refine, or contradict these personas.

---

### 8.6. Provide Marketing Copy

**NOT Included:**
- Advertising messaging
- Product descriptions for marketing materials
- Value propositions or taglines
- Competitor positioning

**Why:**  
Marketing messaging is developed separately, though personas may inform it.

---

## Appendix A: Quick Reference

### A.1. Persona Summary Table

| Persona | Primary Goal | Key Fear | Decision Driver | MVP v1 Fit |
|---------|-------------|----------|-----------------|-----------|
| **Elena (Individual)** | Find affordable, convenient storage | Choosing wrong size; hidden costs | Transparency, AI recommendations, reviews | ✅ Strong fit |
| **Dmitry (Business)** | Secure commercial storage with good access | Inadequate access hours; unreliable operator | Security features, accessibility, operator reliability | ✅ Good fit (some business features limited) |
| **Irina (Operator)** | Increase occupancy via online visibility | Losing control; complex systems | Simplicity, control over bookings, fair model | ✅ Strong fit (simple dashboard, manual control) |
| **Temporary User** | Short-term storage during relocation | Price sensitivity; unfamiliarity with city | Speed, location, clear pricing | ⚠️ Moderate fit (basic features only) |
| **Seasonal User** | Recurring annual storage | Availability of same unit; price changes | Long-term operator relationship | ⚠️ Limited fit (no recurring booking) |
| **Property Manager** | Bulk recommendations for tenants | Reputation risk if bad facility | Trustworthy operators, ease of referral | ❌ Not targeted in MVP v1 |

---

### A.2. Journey Phase Summary

| Journey Phase | Elena (Individual) | Dmitry (Business) | Irina (Operator) |
|---------------|-------------------|-------------------|------------------|
| **Discovery** | Searches for storage; explores options | Evaluates business suitability | Investigates platform value |
| **Evaluation** | Filters, views details, uses AI recommendations | Assesses business features; reads reviews | Considers joining; reviews terms |
| **Action** | Registers and books online | Submits booking with business context | Registers, lists facility, adds units |
| **Post-Action** | Checks status; prepares move-in | Confirms logistics; uses facility | Manages bookings; monitors occupancy |

---

### A.3. Pain Point Categories

| Category | Example Pain Points | MVP v1 Mitigation |
|----------|---------------------|-------------------|
| **Trust & Info Gaps** | Unclear pricing, insufficient photos, fake reviews | Transparent pricing, verified reviews, photos |
| **Decision Uncertainty** | Size confusion, feature overload | AI Box Finder, filters, detailed facility info |
| **Booking Friction** | Phone-only booking, slow responses, complex forms | Online booking, notifications, simple form |
| **Operator Efficiency** | Manual processes, missed opportunities | Simple dashboard, online visibility, notifications |
| **Post-Booking** | Unclear next steps, issue resolution | Dashboard, platform messaging (basic) |

---

### A.4. MVP Assumptions Tracker

| Assumption | Category | Validation Method | Status |
|------------|----------|-------------------|--------|
| Users prefer digital booking | User Behavior | Usage analytics, conversion funnel | ⏳ To validate |
| Size uncertainty is major barrier | User Behavior | AI Box Finder usage, surveys | ⏳ To validate |
| Reviews drive trust | User Behavior | Correlation analysis | ⏳ To validate |
| Simple booking wins | User Behavior | Abandonment rates, feedback | ⏳ To validate |
| Users accept pending status | User Behavior | Support inquiries, feedback | ⏳ To validate |
| Operators want control | Operator Behavior | Operator feedback, response times | ⏳ To validate |
| Low tech tolerance | Operator Behavior | Onboarding success, support inquiries | ⏳ To validate |
| Visibility drives adoption | Operator Behavior | Occupancy changes, operator surveys | ⏳ To validate |
| Fair revenue model | Operator Behavior | Operator feedback (future, not in MVP) | ⏳ To validate |
| Self-storage market growing | Market | Market research, booking volume | ⏳ To validate |
| Aggregators add value | Market | User acquisition costs, conversion rates | ⏳ To validate |

---

## Document Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-16 | Initial document creation | Product & UX Research Team |

---

**End of Document**
