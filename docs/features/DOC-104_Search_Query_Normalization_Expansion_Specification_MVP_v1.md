# DOC-104 — Search Query Normalization & Expansion Specification

**Document ID:** DOC-104  
**Version:** 1.0  
**Status:** Supporting / Search Processing Specification  
**Phase:** MVP → v2  
**Last Updated:** 2025-12-16

---

> **Document Status:** 🟡 Supporting / Search Processing Specification  
> **Canonical:** ❌ No  
> **Execution Mandatory:** ❌ No  
>
> This document describes conceptual approaches to search query normalization and expansion and does **NOT** define mandatory execution logic.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Role of Query Processing in Search](#2-role-of-query-processing-in-search)
3. [Query Normalization Techniques](#3-query-normalization-techniques-conceptual)
4. [Query Expansion Approaches](#4-query-expansion-approaches-conceptual)
5. [Constraints & Safety Rules](#5-constraints--safety-rules)
6. [Interaction with Filters & Facets](#6-interaction-with-filters--facets)
7. [Experimentation & Evaluation](#7-experimentation--evaluation)
8. [Failure Modes & Risks](#8-failure-modes--risks)
9. [Relationship to Canonical Documents](#9-relationship-to-canonical-documents)
10. [Non-Goals](#10-non-goals)

---

## 1. Introduction

### 1.1. Purpose

This document provides a conceptual reference for understanding how search queries may be processed, interpreted, and expanded within the Self-Storage Aggregator platform. It describes potential approaches to improving search relevance through query manipulation techniques.

The document serves as:

- A reference for search and AI development teams
- Context for UX designers working on search experiences
- A foundation for future A/B testing and search quality initiatives
- Background reading for analytics and product teams

### 1.2. Scope

**MVP Phase:**
- Conceptual understanding of query processing possibilities
- Guidance for implementation decisions (not requirements)
- Reference material for search quality discussions

**v2 and Beyond:**
- May inform advanced search feature development
- Basis for search relevance optimization work
- Input for experimentation frameworks

### 1.3. Relationship to Search Stack

Query processing exists as a conceptual layer that may operate between user input and the search execution engine. This document does not prescribe where or how this processing occurs—it describes *what kinds* of processing exist in search systems generally.

The primary search flow in the Self-Storage Aggregator platform:

```
User Input → [Query Processing] → API Request → Database Query → Results
```

Current MVP implementation relies on:
- Direct parameter passing to API endpoints (see `api_design_blueprint_mvp_v1_CANONICAL.md`)
- PostgreSQL/PostGIS for geospatial queries (see `full_database_specification_mvp_v1_CANONICAL.md`)
- Redis caching for search results (see `DOC-100_Caching_Strategy_CDN_Specification_MVP_v1.md`)

Query normalization and expansion, as described here, would operate logically before the structured API request is formed or as part of API-level preprocessing.

---

## 2. Role of Query Processing in Search

### 2.1. Query Processing vs. Ranking

These are distinct concepts in search architecture:

| Aspect | Query Processing | Ranking |
|--------|------------------|---------|
| **When** | Before search execution | After search execution |
| **Purpose** | Transform user intent into searchable form | Order results by relevance |
| **Input** | Raw user query / filters | Candidate result set |
| **Output** | Normalized query / expanded terms | Ordered results |
| **Document** | This document (DOC-104) | DOC-075, DOC-076 |

Query processing determines *what* to search for; ranking determines *how* to order what was found.

### 2.2. Position in the Search Pipeline

Conceptually, query processing may occur at multiple points:

**Frontend Layer:**
- Autocomplete normalization
- Input sanitization
- Client-side validation

**API Layer:**
- Parameter normalization
- Query interpretation
- Expansion logic

**Database Layer:**
- Full-text search preprocessing
- Geospatial query preparation

The current MVP architecture processes queries primarily at the API and database layers, with structured filter parameters rather than free-text search.

### 2.3. Interaction with Filters and Facets

The platform currently supports structured filtering (as defined in `api_design_blueprint_mvp_v1_CANONICAL.md`):

- Location-based filters (lat/lon/radius)
- Price range filters (price_min/price_max)
- Size category filters (S, M, L, XL)
- Feature filters (climate_control, cctv, access_24_7)

Query normalization applies primarily to free-text inputs (location search, AI box finder descriptions) rather than structured filter selections.

---

## 3. Query Normalization Techniques (Conceptual)

Query normalization transforms raw user input into a consistent, searchable form. The following techniques represent standard approaches in search systems.

### 3.1. Text Normalization

**Lowercasing:**
Converts input to lowercase for case-insensitive matching.

- User types: "Москва" or "МОСКВА" or "москва"
- Normalized form: consistent lowercase representation

**Trimming:**
Removes leading and trailing whitespace.

- User types: "  склад  "
- Normalized form: "склад"

**Diacritics Handling:**
Standardizes accented characters (less relevant for Russian/Cyrillic).

**Punctuation Cleanup:**
Removes or standardizes punctuation that does not carry semantic meaning.

- User types: "склад...рядом!!!"
- Normalized form: "склад рядом"

### 3.2. Language Handling

**Language Detection:**
Identifies the language of user input to apply appropriate processing rules.

- Russian: apply Russian-specific normalization
- English: apply English-specific normalization
- Mixed: handle gracefully

**Transliteration:**
Converts between writing systems when appropriate.

- "Moskva" ↔ "Москва"
- "Vyhino" ↔ "Выхино"

This is particularly relevant for:
- Metro station names
- District names
- Address components

**Locale-Specific Normalization:**
Applies regional conventions for formatting.

- Date formats
- Number formats
- Address structure patterns

### 3.3. Tokenization & Stemming

**Word Splitting:**
Breaks input into individual tokens for processing.

- "складское помещение рядом" → ["складское", "помещение", "рядом"]

**Stemming / Lemmatization:**
Reduces words to their base or dictionary form.

- "складские" → "склад" (stem)
- "бегущий" → "бежать" (lemma)

This allows matching across word forms:
- User searches for "боксы" (plural)
- Matches documents containing "бокс" (singular)

**Note:** Stemming for Russian language requires specialized algorithms (e.g., Snowball Russian stemmer). Implementation complexity is significant.

---

## 4. Query Expansion Approaches (Conceptual)

Query expansion adds related terms to the user's query to improve recall (finding more relevant results).

### 4.1. Synonyms & Equivalents

**Domain-Specific Synonyms:**
Storage industry terms that mean the same thing.

| User Term | Equivalent Terms |
|-----------|------------------|
| бокс | ячейка, контейнер, склад |
| склад | хранилище, складское помещение |
| self-storage | селф-сторидж, индивидуальное хранение |

**Size-Related Synonyms:**
Different ways users describe storage needs.

| User Expression | Potential Interpretation |
|-----------------|--------------------------|
| маленький | S, 1-3 м² |
| средний | M, 3-6 м² |
| большой | L, 6-12 м² |
| очень большой | XL, 12+ м² |

**Item-Based Interpretation:**
For the AI Box Finder feature, understanding what items typically require.

- "диван" → typically requires M or larger
- "велосипед" → typically requires S or M
- "мебель из квартиры" → typically requires L or XL

### 4.2. Semantic Expansion

**Intent Inference:**
Understanding what the user is trying to accomplish.

| User Query | Possible Intent |
|------------|-----------------|
| "переезд" | temporary storage during move |
| "сезонные вещи" | long-term storage for seasonal items |
| "документы" | secure, climate-controlled storage |

**Embedding-Based Expansion:**
Using semantic similarity models to find related concepts.

- Input: "старая мебель"
- Related: "антиквариат", "хрупкие вещи", "крупногабаритные предметы"

**Note:** This is an advanced technique requiring ML infrastructure. Reference only for future consideration.

### 4.3. Geo & Context Expansion

**City to Region Expansion:**
When searching by city, consider nearby administrative areas.

- User searches: "Москва"
- May include: Московская область (configurable)

**District Adjacency:**
When no results in specified district, consider neighboring districts.

- User searches: "Выхино"
- Nearby: "Жулебино", "Рязанский проспект"

**Metro Station Context:**
Expand metro station searches to nearby areas.

- User searches near "метро Выхино"
- Include warehouses within walking distance

**Fallback Geo-Expansion:**
Progressive widening when results are sparse.

- Initial search: 5 km radius → few results
- Expanded: 10 km radius → more results
- UI indicates expansion occurred

---

## 5. Constraints & Safety Rules

Query normalization and expansion must be applied carefully to avoid degrading search quality.

### 5.1. Avoiding Over-Expansion

Excessive expansion can lead to irrelevant results. Constraints should include:

- **Expansion limits:** Maximum number of synonyms added
- **Relevance thresholds:** Only add highly related terms
- **Boosting original terms:** User's exact words should rank higher

### 5.2. Preventing Irrelevant Matches

Certain expansions may lead to misleading results:

- **Domain restriction:** Only use storage-related synonyms
- **Context awareness:** Consider filter context before expanding
- **Negative signals:** Recognize when NOT to expand

### 5.3. Respecting Explicit Filters

User-specified filters should take precedence over inferred expansions:

| User Action | System Behavior |
|-------------|-----------------|
| Selects "S" size filter | Do not expand to larger sizes |
| Sets max price | Do not show more expensive options |
| Specifies exact location | Limit geo-expansion radius |

### 5.4. Query Explosion Limits

Prevent combinatorial explosion in query processing:

- Limit total expanded terms
- Limit synonym depth (no synonyms of synonyms)
- Timeout processing for complex queries

---

## 6. Interaction with Filters & Facets

### 6.1. Precedence Rules

When query processing conflicts with structured filters:

1. **Explicit filters** always take precedence
2. **Inferred context** may inform suggestions but not override
3. **Expansion** respects filter boundaries

### 6.2. Conflict Resolution

Examples of filter/expansion conflicts:

| Scenario | Resolution |
|----------|------------|
| Query suggests "large" but size filter is "S" | Honor the filter |
| Location text implies one area, geo-filter specifies another | Honor geo-filter |
| Price terms in query conflict with price filter | Honor price filter |

### 6.3. Free-Text vs. Structured Filters

The platform supports both input modes:

**Free-Text Input:**
- Location search box (autocomplete)
- AI Box Finder description field
- Subject to normalization and expansion

**Structured Filters:**
- Price range sliders
- Size category checkboxes
- Feature toggles
- Passed directly to API without modification

**Reference:** See `DOC-077` (when created) for detailed filter behavior specification.

---

## 7. Experimentation & Evaluation

### 7.1. A/B Testing Strategies

Query processing changes should be evaluated through controlled experiments:

**Testing Approaches:**
- Percentage-based traffic splitting
- Geographic segmentation
- User cohort testing

**Experiment Types:**
- Normalization variants
- Expansion strategy comparisons
- Threshold tuning

### 7.2. Offline Relevance Evaluation

Before A/B testing, evaluate changes offline:

- Curated query sets with expected results
- Human relevance judgments
- Automated relevance metrics

### 7.3. Metrics (Qualitative Guidance)

Relevant metrics for search quality (without specific targets):

**Engagement Metrics:**
- Search refinement rate (indicates initial results quality)
- Click-through on search results
- Search abandonment rate

**Outcome Metrics:**
- Searches leading to warehouse views
- Searches leading to booking requests
- Zero-result rate

**Reference:** See `Analytics_Metrics_Tracking_Specification_MVP_v1_1.md` for event tracking implementation.

---

## 8. Failure Modes & Risks

### 8.1. Query Drift

**Risk:** Expansion adds terms that shift results away from user intent.

**Example:**
- User searches: "маленький склад для документов"
- Over-expansion adds: general storage terms
- Results: large warehouses for furniture (irrelevant)

**Mitigation:** Conservative expansion with relevance checks.

### 8.2. Ambiguity

**Risk:** Query terms with multiple meanings lead to mixed results.

**Example:**
- User searches: "бокс"
- Could mean: storage box, boxing gym, vehicle box
- Results: mixed or incorrect

**Mitigation:** Domain context enforcement.

### 8.3. Language Bias

**Risk:** Processing favors one language or dialect.

**Example:**
- Russian stemmer works well
- Transliterated English terms not handled
- Non-standard spellings rejected

**Mitigation:** Graceful fallback, support for common variants.

### 8.4. False Positives

**Risk:** Expansion matches terms that look similar but have different meanings.

**Example:**
- Stemming reduces "бокс" and "боксёр" to same root
- Boxing-related content appears in storage search

**Mitigation:** Domain-specific term handling.

---

## 9. Relationship to Canonical Documents

### 9.1. Functional Specification

**Document:** `Functional_Specification_MVP_v1_CORRECTED.md`

**Relationship:**
- Defines user stories for search and discovery
- Specifies filter options and search behavior
- DOC-104 describes query processing concepts that may support these features

### 9.2. API Design Blueprint

**Document:** `api_design_blueprint_mvp_v1_CANONICAL.md`

**Relationship:**
- Defines search endpoint parameters (`GET /api/v1/warehouses`)
- DOC-104 describes preprocessing that occurs before API parameters are formed

### 9.3. Database Specification

**Document:** `full_database_specification_mvp_v1_CANONICAL.md`

**Relationship:**
- Defines how search queries are executed (PostGIS, indexes)
- DOC-104 describes query transformation before database execution

### 9.4. Related Supporting Documents

| Document | Relationship |
|----------|--------------|
| DOC-075 — Search Ranking Algorithm (Supporting) | Ranking operates after query processing |
| DOC-076 — Search Ranking Algorithm v2 (Advanced) | Advanced ranking considerations |
| DOC-077 — Search UX & Filters Behaviour | Filter interaction with query processing |
| DOC-014 — Analytics & Metrics | Search quality measurement |
| DOC-088 — User Experience (Renters) | End-user search experience |

---

## 10. Non-Goals

This document explicitly does **NOT** define:

### 10.1. Ranking Algorithm

Query processing is about *what* to search for.
Ranking is about *how to order* results.

**See instead:** DOC-075, DOC-076

### 10.2. API Specification

This document does not define:
- Endpoint signatures
- Request/response formats
- HTTP methods or status codes

**See instead:** `api_design_blueprint_mvp_v1_CANONICAL.md`

### 10.3. UI/UX Logic

This document does not define:
- Search input component behavior
- Autocomplete UI patterns
- Filter widget interactions

**See instead:** DOC-077, `Frontend_Architecture_Specification_v1_5_FINAL.md`

### 10.4. Enforcement Rules

This document does not mandate:
- Required preprocessing steps
- Mandatory expansion logic
- Performance requirements

All approaches described are conceptual and advisory.

### 10.5. Specific Parameters

This document does not specify:
- Numeric weights or coefficients
- Threshold values
- Scoring formulas

---

## Document Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Search Lead | | | |
| Product Owner | | | |
| Tech Lead | | | |

---

**Codegen-ready:** ❌ NO

This document serves as context and reference for search and AI teams. It does not define implementation contracts.

---

**End of Document**
