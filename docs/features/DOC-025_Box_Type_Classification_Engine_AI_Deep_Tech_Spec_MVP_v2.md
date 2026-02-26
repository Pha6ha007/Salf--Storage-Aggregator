# DOC-025 — Box Type Classification Engine (AI) — Deep Technical Specification (MVP → v2)

**Document ID:** DOC-025  
**Title:** Box Type Classification Engine (AI) — Deep Technical Specification (MVP → v2)  
**Type:** Supporting / Non-Canonical / Deep Technical Specification  
**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Date:** December 18, 2025  
**Status:** 🟡 SUPPORTING (Non-Authoritative)

---

## Document Classification

| Field | Value |
|-------|-------|
| **Type** | Supporting / Non-Canonical |
| **Authority Level** | Advisory Only |
| **Scope** | Box type classification assistance (MVP v1 → v2) |
| **Audience** | Product, Engineering, AI/ML teams |
| **Canonical Status** | 🟡 NON-CANONICAL — Does NOT define requirements |

---

## ⚠️ CRITICAL: Document Role & Scope

### What This Document IS

This document is a **supporting specification** that:

- Describes **optional** approaches for classifying box types
- Provides **conceptual guidance** on AI-assisted classification
- Suggests **non-binding** patterns for human-reviewable classification
- Documents **advisory mechanisms** that do NOT make decisions
- Explores **future possibilities** for post-MVP classification improvements

### What This Document IS NOT

**This document explicitly IS NOT:**

❌ A source of truth for any feature or requirement  
❌ An authoritative specification for classification logic  
❌ A decision-making system specification  
❌ A ranking, scoring, or optimization engine  
❌ A pricing, availability, or booking control mechanism  
❌ An enforcement or validation system  
❌ A replacement for human judgment  
❌ A production implementation guide  

### Authority & Conflicts

**In case of ANY conflict between this document and canonical documents:**

1. **Functional Specification MVP v1** — Takes absolute precedence
2. **Technical Architecture Document** — Takes absolute precedence
3. **API Design Blueprint MVP v1** — Takes absolute precedence
4. **Full Database Specification MVP v1** — Takes absolute precedence
5. **All other canonical documents** — Take absolute precedence

This document provides **context and possibilities only**. It does NOT define:
- Product requirements
- API contracts
- Database schema
- Business logic
- System behavior

---

## Table of Contents

1. [Document Role & Scope](#-critical-document-role--scope)
2. [What This Document Is NOT](#what-this-document-is-not-explicit)
3. [Box Type Classification Concept](#box-type-classification-concept)
4. [MVP v1 Capabilities (Strictly Limited)](#mvp-v1-capabilities-strictly-limited)
5. [Post-MVP (v2) Capabilities (Non-Binding)](#post-mvp-v2-capabilities-non-binding)
6. [Human Review & Override](#human-review--override)
7. [Relation to Other Documents](#relation-to-other-documents)
8. [Non-Goals (Explicit)](#non-goals-explicit)
9. [Risks & Limitations](#risks--limitations)

---

## What This Document Is NOT (Explicit)

This section explicitly clarifies what box type classification **DOES NOT DO** to prevent scope creep and misinterpretation.

### NOT a Ranking Engine

Box type classification:
- Does NOT influence search result ordering
- Does NOT affect warehouse or box visibility
- Does NOT provide numeric scores for sorting
- Does NOT participate in relevance algorithms
- Does NOT boost or demote listings

**Authority for ranking:** Search & Discovery specifications (when created)

### NOT a Pricing Tool

Box type classification:
- Does NOT set or suggest prices
- Does NOT calculate price recommendations
- Does NOT influence dynamic pricing
- Does NOT affect discount eligibility
- Does NOT participate in revenue optimization

**Authority for pricing:** Pricing specifications (when created), API Design Blueprint

### NOT a Decision System

Box type classification:
- Does NOT make automated decisions
- Does NOT enforce business rules
- Does NOT validate operator inputs
- Does NOT prevent user actions
- Does NOT gate any workflows

**Authority for decisions:** Functional Specification, Business Logic specifications

### NOT an Enforcement Mechanism

Box type classification:
- Does NOT require operators to accept suggestions
- Does NOT block incorrect classifications
- Does NOT enforce data quality rules
- Does NOT mandate specific box types
- Does NOT prevent manual classification

**Authority for enforcement:** Functional Specification, Data Validation specifications

### NOT an Availability or Booking System

Box type classification:
- Does NOT check box availability
- Does NOT reserve or allocate boxes
- Does NOT affect booking eligibility
- Does NOT influence booking confirmations
- Does NOT participate in inventory management

**Authority for bookings:** API Design Blueprint § 5.4, Database Specification (bookings table)

### NOT a Source of Truth

Box type classification:
- Does NOT define canonical box types
- Does NOT maintain the box type taxonomy
- Does NOT override operator-provided data
- Does NOT serve as the authoritative classification source
- Does NOT replace database records

**Authority for box types:** Database Specification, API Design Blueprint (box size enum: S, M, L, XL)

---

## Box Type Classification Concept

### What is Box Type Classification?

Box type classification is an **optional, advisory mechanism** that can:

1. **Assist operators** in categorizing storage boxes based on characteristics
2. **Suggest classifications** that operators may choose to accept or reject
3. **Provide explanations** for suggested classifications in human-readable language
4. **Surface patterns** in box descriptions that might indicate specific types

### Current Box Size Categories (Canonical)

According to the **Database Specification** and **API Design Blueprint**, boxes are categorized by size:

```
size ENUM('S', 'M', 'L', 'XL')
```

| Size | Typical Area Range | Notes |
|------|-------------------|-------|
| **S** | 1-2 m² | Small boxes for minimal storage |
| **M** | 3-5 m² | Medium boxes for standard needs |
| **L** | 6-10 m² | Large boxes for furniture/bulk items |
| **XL** | 12+ m² | Extra-large boxes for extensive storage |

**Source:** API Design Blueprint § 12.4, Database Specification (boxes table)

### What Box Type Classification Could Consider

Classification suggestions (when implemented) might consider:

**Operator-Provided Data:**
- Box size code (S, M, L, XL) — **already canonical**
- Physical dimensions (length, width, height)
- Area and volume calculations
- Free-text description field
- Amenities or features listed

**Conceptual Characteristics:**
- Indoor vs. outdoor access
- Climate control availability
- Vehicle storage suitability
- Ground floor vs. upper floors
- Drive-up accessibility

### Role of AI vs. Heuristics

Classification assistance could use:

1. **Rule-Based Heuristics (Simpler)**
   - Pattern matching on description keywords
   - Dimension-based categorization logic
   - Fixed threshold decision trees
   - Deterministic, explainable, low-cost

2. **AI-Assisted Suggestions (More Advanced)**
   - Natural language understanding of descriptions
   - Pattern recognition across multiple attributes
   - Learning from operator corrections over time
   - Probabilistic, requires more infrastructure

**In MVP v1:** Only rule-based heuristics, if anything at all  
**In post-MVP v2:** Potential for AI assistance as supplementary tool

### Probabilistic Nature

Any classification suggestion is inherently **probabilistic and uncertain**:

- Suggestions are educated guesses, not facts
- Confidence should be expressed qualitatively (low/medium/high)
- Operators must have final say
- No suggestion should be treated as ground truth
- System should acknowledge limitations openly

---

## MVP v1 Capabilities (Strictly Limited)

### Scope Statement

**In MVP v1, box type classification is EXTREMELY LIMITED or ABSENT.**

The platform focuses on:
- Operators manually entering box sizes (S, M, L, XL)
- Operators providing descriptions and dimensions
- No automated classification assistance in MVP v1

### What IS in MVP v1

#### Manual Classification by Operators

Operators classify boxes manually using:

1. **Size Selection:** Choose from S, M, L, XL via UI
2. **Dimension Entry:** Manually enter length, width, height
3. **Description Field:** Free-text description of box characteristics
4. **Feature Flags:** Optional checkboxes for amenities (conceptual)

**Source:** API Design Blueprint § 7.2.2 (POST /api/v1/operator/boxes)

#### No AI Suggestions in MVP v1

**MVP v1 explicitly DOES NOT include:**
- ❌ AI-powered classification suggestions
- ❌ Automatic type inference from descriptions
- ❌ Confidence scoring
- ❌ Multi-label classification
- ❌ Pattern recognition

The existing **Box Size Recommendation** feature (§ 8.1 of API Blueprint) recommends sizes to **users** based on items they want to store. It does NOT classify operator boxes.

### Optional Rule-Based Hints (If Implemented)

If basic assistance is implemented in MVP v1, it would be **extremely simple**:

**Example Conceptual Logic:**
```
IF dimensions suggest area > 12 m²
  → HINT: "This might be an XL box"
  → Operator can ignore hint completely

IF description contains "climate"
  → HINT: "Consider marking climate-controlled"
  → Purely informational, no action taken
```

**Characteristics of MVP v1 Hints (if any):**
- Displayed in UI as non-intrusive tooltips
- Never pre-fill or auto-select values
- Never prevent operator from choosing differently
- Never logged as "AI suggestions"
- Never affect downstream operations

### MVP v1 Data Flow (Manual Only)

```
Operator creates box
    ↓
Operator manually selects size (S/M/L/XL)
    ↓
Operator enters dimensions
    ↓
Operator writes description
    ↓
System validates required fields
    ↓
Box saved to database (boxes table)
    ↓
NO classification assistance involved
```

### Why So Limited in MVP v1?

**Reasons for minimal scope:**

1. **Focus on Core Functionality:** MVP prioritizes search, booking, CRM
2. **Human Expertise Suffices:** Operators know their boxes best
3. **Avoid Premature Optimization:** Classification complexity not yet needed
4. **Resource Constraints:** MVP timeline doesn't allow ML infrastructure
5. **User Validation First:** Prove core value before adding assistance

---

## Post-MVP (v2) Capabilities (Non-Binding)

### ⚠️ IMPORTANT: Future Exploration Only

**Nothing in this section is committed, planned, or guaranteed.**

This section explores **possible future capabilities** if the platform decides to invest in classification assistance post-MVP. These are **conceptual ideas**, not specifications.

### Richer AI Models (Conceptual)

**Potential AI improvements:**

1. **Better Language Understanding**
   - Process operator descriptions more effectively
   - Understand domain-specific terminology
   - Handle multi-language descriptions

2. **Multi-Attribute Analysis**
   - Consider dimensions, location, amenities together
   - Recognize patterns across multiple fields
   - Suggest classifications with reasoning

3. **Learning from Corrections**
   - Track when operators override suggestions
   - Improve future suggestions based on feedback
   - Adapt to operator preferences over time

**Still Advisory Only:** Even advanced AI remains non-authoritative

### Multi-Label Suggestions (Conceptual)

Instead of single type, suggest multiple possibilities:

```
Suggested Classifications (in descending confidence):
1. Standard Storage (high confidence)
2. Climate-Controlled (medium confidence)
3. Vehicle Storage (low confidence)

Operator chooses ONE or NONE or defines their own
```

### Qualitative Confidence Levels (Conceptual)

Express suggestion confidence qualitatively:

- **High Confidence:** Strong pattern match, clear indicators
- **Medium Confidence:** Some indicators present, some ambiguity
- **Low Confidence:** Weak signals, substantial uncertainty

**Never use numeric scores (e.g., 0.85) as decision factors.**

### Contextual Suggestions (Conceptual)

Consider broader context:

- Warehouse location characteristics
- Regional terminology patterns
- Operator's historical classification patterns
- Similar boxes at same warehouse

### Interactive Clarification (Conceptual)

If input is ambiguous:

```
System: "I notice the description mentions 'vehicle'. 
         Is this box suitable for car/motorcycle storage?"
         
Operator: [Provides clarification]

System: [Updates suggestion based on response]
```

### Post-MVP Data Flow (If Implemented)

```
Operator starts creating box
    ↓
System shows optional "Get Classification Suggestion" button
    ↓
Operator clicks (optional)
    ↓
System analyzes description + dimensions
    ↓
System displays suggestions with qualitative confidence
    ↓
Operator reviews suggestions
    ↓
Operator accepts, modifies, or ignores suggestions
    ↓
Operator makes final classification decision
    ↓
System records operator's choice (not suggestion)
    ↓
Optional: Log suggestion for improvement
```

### What Post-MVP Still Does NOT Do

**Even in v2, classification NEVER:**
- Enforces specific types
- Makes final decisions
- Affects ranking or pricing
- Validates operator choices
- Blocks manual classification
- Serves as source of truth

---

## Human Review & Override

### Operator Control (Always)

**At ALL times, operators must have complete control:**

1. **Classification is Manual:** Operators choose box types themselves
2. **Suggestions are Optional:** Operators can ignore all suggestions
3. **Override Without Restriction:** No validation blocks operator choices
4. **No Auto-Tagging:** System never applies tags without explicit approval
5. **Full Edit Rights:** Operators can change classifications anytime

### Admin Correction (If Needed)

Admins can:
- Review operator classifications for consistency
- Provide feedback to operators (non-blocking)
- Update classifications if operators request help
- Analyze classification patterns for platform insights

**Admins CANNOT:**
- Force specific classifications
- Prevent operator from using certain types
- Automatically correct operator choices

### Auditability

If classification suggestions are used:

**What should be logged:**
- Operator received a suggestion (yes/no)
- Suggestion was shown (what it was)
- Operator's final choice (what they selected)
- Match or mismatch between suggestion and choice

**Logs used for:**
- Improving suggestion quality
- Identifying confusing cases
- Training and educational purposes

**Logs NOT used for:**
- Penalizing operators who ignore suggestions
- Enforcement of classification rules
- Ranking or scoring operators

### Trust & Transparency

**Platform should communicate clearly:**

> "Classification suggestions are optional tools to help you categorize boxes. You always have final say. Suggestions may not be perfect, and we learn from your expertise when you make corrections."

**Operators should know:**
- Suggestions are probabilistic, not authoritative
- Their knowledge of their facilities is most important
- Ignoring suggestions has no negative consequences

---

## Relation to Other Documents

### Integration with Canonical Specifications

| Document | Relationship | Clarification |
|----------|-------------|---------------|
| **Database Specification** | Classification does NOT add tables | Uses existing `boxes.size`, `boxes.description` fields |
| **API Design Blueprint** | Classification does NOT add endpoints | Suggestions (if any) happen in operator UI, not API |
| **Backend Implementation Plan** | Classification is NOT a service | Optional UI-level hints only in MVP v1 |
| **Functional Specification** | Classification does NOT define features | Operators manage boxes per existing requirements |
| **Security & Compliance** | No PII in classification | Only box attributes considered, never user data |

### Related Supporting Documents

| Document | Connection |
|----------|------------|
| **DOC-024 — Box Size Recommendation** | Recommends sizes to **users** (not classify operator boxes) |
| **DOC-007 — AI Chat Assistant** | Conversational help, does NOT classify boxes |
| **Search & UX Specifications** | Search uses canonical size field, NOT classification |
| **Trust & Safety Framework** | Classification does NOT affect trust/safety scoring |

### Canonical Box Type Definition

**The ONLY authoritative box type definition is:**

```sql
-- From Database Specification
boxes.size ENUM('S', 'M', 'L', 'XL')
```

**This enum is defined in:**
- Database Specification § boxes table
- API Design Blueprint § 12.4 (Box Schema)

**Classification assistance (if any) maps to these four types ONLY.**

### No New API Contracts

Classification assistance:
- Does NOT introduce new API endpoints
- Does NOT modify existing endpoint contracts
- Does NOT change request/response schemas
- Does NOT add new error codes

**UI-level suggestions (if implemented) happen client-side or via internal operator endpoints NOT exposed in public API.**

---

## Non-Goals (Explicit)

This section lists what box type classification **explicitly does NOT attempt to do**.

### Auto-Classification Without Review

❌ System will NOT automatically classify boxes without operator review  
❌ System will NOT apply classifications in batch without human approval  
❌ System will NOT change existing classifications automatically  

### Ranking or Visibility Influence

❌ Classification does NOT affect search ranking  
❌ Classification does NOT boost certain box types  
❌ Classification does NOT hide or demote listings  

### Personalization Engine

❌ Classification does NOT personalize results per user  
❌ Classification does NOT track user preferences  
❌ Classification does NOT learn from user behavior  

### Optimization Logic

❌ Classification does NOT optimize for business metrics  
❌ Classification does NOT maximize conversion rates  
❌ Classification does NOT influence pricing strategy  

### Quality Enforcement

❌ Classification does NOT validate box descriptions  
❌ Classification does NOT require minimum data quality  
❌ Classification does NOT block submissions with low confidence  

### Multi-Region or Multi-Language (MVP)

❌ MVP classification (if any) is single-language only  
❌ MVP does NOT handle region-specific taxonomies  
❌ MVP does NOT localize suggestions  

### Real-Time Updates

❌ Classification does NOT update dynamically as boxes change  
❌ Classification does NOT re-classify automatically  
❌ Classification does NOT monitor for drift  

### Advanced Analytics

❌ Classification does NOT provide operator dashboards  
❌ Classification does NOT generate classification reports  
❌ Classification does NOT track classification trends  

---

## Risks & Limitations

### Misclassification Risk

**Risk:** Suggestions may be incorrect or misleading

**Mitigations:**
- Always show suggestions as non-authoritative
- Use qualitative confidence indicators
- Allow operators to override without friction
- Log mismatches to improve over time
- Never penalize operators for ignoring suggestions

### Ambiguous Input Risk

**Risk:** Box descriptions may be vague, incomplete, or contradictory

**Mitigations:**
- Acknowledge low confidence openly
- Prompt operators for clarification (if interactive)
- Provide fallback to manual classification always
- Document ambiguous cases for future improvement

### Operator Trust Risk

**Risk:** Operators may distrust or ignore suggestions if they're frequently wrong

**Mitigations:**
- Set conservative thresholds for showing suggestions
- Only suggest when confidence is reasonable
- Communicate probabilistic nature clearly
- Learn from operator corrections to improve

### MVP Accuracy Limits

**Risk:** MVP classification (if any) will be simplistic and error-prone

**Expectations:**
- MVP suggestions (if any) are basic heuristics only
- High error rate expected in MVP
- Operators should not rely on MVP suggestions heavily
- Post-MVP improvements may significantly increase accuracy

### System Complexity Risk

**Risk:** Adding classification infrastructure increases system complexity

**Mitigations in MVP:**
- Keep MVP classification absent or trivially simple
- Avoid ML infrastructure in MVP v1
- Use rule-based hints only if anything at all
- Defer complex classification to post-MVP

### Terminology Consistency Risk

**Risk:** Classification terminology may not align with regional or operator-specific terms

**Mitigations:**
- Use platform-standard box size enum (S/M/L/XL)
- Allow operators to use their own descriptions
- Suggestions map to standard categories only
- Acknowledge terminology may vary by region

### Over-Reliance Risk

**Risk:** Operators might over-rely on suggestions and stop reviewing carefully

**Mitigations:**
- Clearly communicate suggestions are NOT authoritative
- Require explicit operator confirmation for all classifications
- Regularly remind operators of their control and responsibility
- Monitor for patterns of uncritical acceptance (post-MVP)

### Data Quality Risk

**Risk:** Poor input data (missing descriptions, wrong dimensions) leads to poor suggestions

**Mitigations:**
- Suggestions should request clarification when data is insufficient
- Low-confidence suggestions should prompt operators to improve input
- Never force operators to accept suggestions based on bad data
- Track data quality issues separately from classification quality

---

## Appendix: Conceptual Examples (Non-Normative)

### Example 1: Simple Rule-Based Hint (MVP v1 Possibility)

**Scenario:** Operator enters dimensions for a new box

```
Input:
- Length: 300 cm
- Width: 400 cm
- Height: 250 cm
- Calculated Area: 12 m²

System (optional hint in UI):
"💡 Tip: Based on the area (12 m²), this might fit the XL category."

Operator:
- Sees hint
- Chooses XL, L, or any other size
- Hint has zero enforcement effect
```

### Example 2: Description-Based Suggestion (Post-MVP Concept)

**Scenario:** Operator writes a description

```
Input:
- Size: (not yet selected)
- Description: "Ground floor unit with drive-up access, suitable for storing a car or motorcycle. Climate-controlled."

System (if AI suggestions enabled):
"Suggested Classifications:
 • Vehicle Storage (medium confidence)
   Reasoning: Mentions 'car', 'motorcycle', 'drive-up access'
 
 • Climate-Controlled (high confidence)
   Reasoning: Explicitly mentions 'climate-controlled'
   
Accept suggestions or classify manually?"

Operator:
- Reviews suggestions
- Accepts, modifies, or ignores
- Makes final decision
```

### Example 3: Ambiguous Input (Post-MVP Concept)

**Scenario:** Vague description

```
Input:
- Size: M
- Description: "Standard box, second floor"

System (low confidence):
"Classification Suggestion: Standard Storage (low confidence)
 
The description is quite general. Would you like to add more details about special features, access type, or intended use?"

Operator:
- Decides whether to provide more detail
- Classifies box as they see fit regardless of suggestion
```

### Example 4: Operator Override (Always Allowed)

**Scenario:** Operator disagrees with suggestion

```
System suggests:
"Climate-Controlled Storage (high confidence)"

Operator:
- Knows the unit does NOT have climate control
- Description was auto-filled incorrectly
- Chooses "Standard Storage" instead
- System accepts operator's choice without question
- Logs mismatch for future improvement (no penalty)
```

---

## Document Versioning

| Version | Date | Changes |
|---------|------|---------|
| **1.0** | 2025-12-18 | Initial creation as supporting, non-authoritative specification |

---

## Related Canonical Documents

### Primary Authority Documents

- **Functional Specification MVP v1** — Product requirements and feature scope
- **Technical Architecture Document CANONICAL** — System architecture and components
- **API Design Blueprint MVP v1 CANONICAL** — API contracts and data schemas
- **Full Database Specification MVP v1 CANONICAL** — Database schema and constraints
- **Unified Glossary & Data Dictionary MVP v1** — Terminology and naming conventions

### Supporting Documents

- **Backend Implementation Plan MVP v1 CANONICAL** — Service layer and modules
- **Security & Compliance Plan MVP v1** — Security controls and PII handling
- **User/Operator Documentation MVP v1** — Feature descriptions and workflows
- **AI Core Design MVP v1 CANONICAL** — AI features framework (Box Size Recommendation only in MVP)

### Other Related Supporting Documents

- **DOC-024 — Box Size Recommendation Engine** — Recommends sizes to users, not operator classification
- **DOC-007 — AI Chat Assistant** — Conversational assistance, not box classification

---

## Contacts & Feedback

**Document Owner:** Product & Engineering Team  
**Technical Questions:** Engineering Lead  
**Product Questions:** Product Manager  
**Feedback:** This is a supporting document; feedback on canonical specs is more valuable

---

## ⚠️ FINAL REMINDER: Advisory Nature of This Document

**This document describes optional, non-authoritative, advisory mechanisms only.**

**Box type classification (if implemented):**
- ✅ Assists operators with suggestions
- ✅ Provides explanations and reasoning
- ✅ Allows complete human override
- ✅ Remains subordinate to operator judgment
- ✅ Does NOT affect core platform operations

**Box type classification does NOT:**
- ❌ Make decisions
- ❌ Enforce classifications
- ❌ Affect ranking, pricing, or availability
- ❌ Serve as source of truth
- ❌ Replace human expertise

**In case of conflict with canonical documents, canonical documents win. Always.**

---

**End of Document DOC-025**
