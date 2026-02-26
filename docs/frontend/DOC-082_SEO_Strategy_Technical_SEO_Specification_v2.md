# DOC-082 — SEO Strategy & Technical SEO Specification (v2)

**Self-Storage Aggregator Platform**

**Document Version:** 1.0  
**Date:** December 16, 2025  
**Status:** 🟡 Supporting / Non-Canonical  
**Phase:** v2+ (Post-MVP)  
**Author:** Platform Team  
**Reviewed by:** Growth Lead, Engineering Lead

---

## Document Classification & Purpose

> **Document Status:** 🟡 Supporting / Non-Canonical  
> **Phase:** v2+ (Post-MVP)  
>
> This document extends the MVP SEO baseline and describes optional technical SEO and growth-oriented practices for future iterations. This document is NOT mandatory for MVP implementation and serves as a reference for post-MVP development.

**Type:** Supporting Specification — Extension of MVP SEO Strategy  
**Status:** Non-Canonical (not binding for MVP)  
**Audience:** Growth Engineers, SEO Specialists, Frontend Team, Product Managers

### What This Document Defines

This document describes **advanced SEO capabilities and strategies** for post-MVP phases:

- Scalable organic discovery strategies
- Advanced indexing patterns for dynamic content
- Technical SEO optimizations for performance and crawlability
- Multi-region and international SEO considerations
- SEO experimentation frameworks
- Trade-offs and risk management

### What This Document Does NOT Define

This document does **NOT**:

- Override or replace MVP SEO requirements (see DOC-046 § 9)
- Define mandatory implementation requirements
- Guarantee specific traffic or conversion outcomes
- Specify content marketing or editorial strategies
- Define link-building or off-page SEO tactics
- Mandate architectural changes to core systems

### Relationship to MVP SEO

**MVP SEO Baseline (DOC-046 § 9)** establishes:
- Server-Side Rendering (SSR) for public pages
- Basic metadata (title, description, Open Graph)
- Schema.org structured data for warehouses
- Sitemap and robots.txt generation
- Canonical URL management

**This Document (DOC-082)** extends the baseline with:
- Advanced indexing strategies for scale
- Performance optimization for SEO signals
- International expansion patterns
- Experimentation frameworks
- Risk mitigation strategies

**These extensions are optional and should be prioritized based on business needs post-MVP.**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Advanced SEO Objectives](#2-advanced-seo-objectives)
3. [Advanced Indexing Strategies](#3-advanced-indexing-strategies)
4. [Technical SEO Enhancements](#4-technical-seo-enhancements)
5. [International & Multi-Region SEO](#5-international--multi-region-seo)
6. [SEO & Search Quality Signals](#6-seo--search-quality-signals)
7. [SEO Experimentation](#7-seo-experimentation)
8. [Risks & Trade-offs](#8-risks--trade-offs)
9. [Relationship to Canonical Documents](#9-relationship-to-canonical-documents)
10. [Non-Goals](#10-non-goals)

---

## 1. Introduction

### 1.1. Purpose

This document outlines advanced technical SEO strategies for the Self-Storage Aggregator platform that extend beyond the MVP baseline. These strategies support scalable organic growth, regional expansion, and long-tail discovery while maintaining technical excellence and user experience quality.

### 1.2. Scope

**Post-MVP SEO Focus Areas:**

- **Scalability:** Handling thousands of indexable warehouse pages and location-based variations
- **Discoverability:** Long-tail keyword coverage and faceted navigation indexing
- **Performance:** Core Web Vitals optimization as a ranking signal
- **Internationalization:** Multi-region expansion with proper hreflang implementation
- **Quality Signals:** User behavior feedback loops and trust indicators

**Out of Scope:**

- Content marketing and editorial calendar planning
- Link acquisition and backlink strategy
- Social media integration
- Paid search (SEM) or advertising strategies
- Conversion rate optimization (CRO) beyond SEO impact

### 1.3. Difference vs MVP SEO

| Aspect | MVP SEO (DOC-046 § 9) | Advanced SEO (DOC-082) |
|--------|----------------------|------------------------|
| **Pages Indexed** | Core pages only (home, search, warehouse details) | Scaled indexing (location variants, faceted search) |
| **Rendering** | SSR for all public pages | Strategic SSR/SSG/ISR mix |
| **Metadata** | Basic title, description, OG | Extended schema, review aggregation, FAQ schema |
| **Performance** | Standard optimization | CWV-focused optimization |
| **Internationalization** | Single region (Russian) | Multi-region with hreflang |
| **Internal Linking** | Basic navigation | Strategic hub-spoke patterns |
| **Experimentation** | None | Controlled SEO A/B testing |

---

## 2. Advanced SEO Objectives

### 2.1. Scalable Organic Growth

**Goal:** Enable discovery through long-tail search queries without creating unsustainable page counts.

**Strategy:**
- Generate location-specific landing pages only for high-intent geographies
- Use faceted navigation strategically to balance crawl budget and indexability
- Implement hub-spoke internal linking for topic clustering

**Non-Goal:** This is not about maximizing page count. Quality and relevance take precedence over quantity.

### 2.2. Regional Expansion Support

**Goal:** Enable seamless expansion to new markets and regions.

**Strategy:**
- Establish URL structure that supports multi-region content
- Implement hreflang for language/region targeting
- Design content architecture to avoid duplication across regions

### 2.3. Long-Tail Coverage

**Goal:** Capture searches for specific storage needs (e.g., "climate controlled storage near metro station").

**Strategy:**
- Index filtered search results strategically
- Generate content for high-intent filter combinations
- Avoid thin content by setting quality thresholds

### 2.4. Crawl Budget Optimization

**Goal:** Ensure search engines efficiently crawl high-value pages.

**Strategy:**
- Implement intelligent pagination
- Use robots meta tags to control indexation of low-value pages
- Monitor crawl stats and adjust indexability policies

---

## 3. Advanced Indexing Strategies

### 3.1. Dynamic Indexable Pages

**Challenge:** Balance between discoverability (indexing many variations) and quality (avoiding thin content).

#### 3.1.1. Location-Based Landing Pages

**Pattern:** Generate landing pages for specific locations where demand justifies content.

**URL Structure:**
```
/storage/{city}                  # City-level pages
/storage/{city}/{district}       # District-level pages
/storage/{city}/near-{metro}     # Metro station pages
```

**Indexability Criteria:**
- Minimum of 3 active warehouses in the location
- Sufficient search volume to justify the page
- Unique content beyond dynamic warehouse list

**Implementation Consideration:**
- Pre-generate high-demand locations (SSG)
- Generate on-demand for valid but lower-traffic locations (ISR)
- 404 for locations with insufficient inventory

**Example (Conceptual):**
```typescript
// app/storage/[city]/page.tsx (conceptual pattern)
export async function generateStaticParams() {
  // Only generate for top N cities with sufficient inventory
  const topCities = await getTopCitiesWithMinWarehouses(minWarehouses: 3);
  return topCities.map(city => ({ city: city.slug }));
}

export const dynamicParams = true; // Allow ISR for other valid cities
```

### 3.2. Faceted Navigation Handling

**Challenge:** Search result pages with filters (e.g., `/search?city=Moscow&price_max=5000`) can create infinite URL combinations.

#### 3.2.1. Indexable Filter Combinations

**Strategy:** Selectively index high-value filter combinations while preventing over-indexation.

**Indexability Matrix:**

| Filter Combination | Indexable? | Canonical Behavior |
|-------------------|------------|-------------------|
| City only | ✅ Yes | Self-canonical |
| City + Price range | ✅ Yes | Self-canonical |
| City + Price + Size | ⚠️ Conditional | Canonical to city + price if low volume |
| City + Multiple filters | ❌ No | Canonical to city page |
| Pagination beyond page 5 | ❌ No | noindex, canonical to page 1 |

**Implementation Pattern:**

```typescript
// Conceptual pattern for controlling indexability
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const filters = parseFilters(searchParams);
  const isIndexable = determineIndexability(filters);
  
  if (!isIndexable) {
    return {
      robots: { index: false, follow: true },
      alternates: { canonical: getCanonicalUrl(filters) }
    };
  }
  
  // Generate unique metadata for indexable combination
  return {
    title: generateFilteredTitle(filters),
    description: generateFilteredDescription(filters),
    alternates: { canonical: getCurrentUrl() }
  };
}

function determineIndexability(filters: SearchFilters): boolean {
  const filterCount = Object.keys(filters).length;
  
  // Only index if:
  // - Single filter (location)
  // - Two filters (location + one attribute)
  // - High search volume detected
  return filterCount <= 2 || hasHighSearchVolume(filters);
}
```

### 3.3. Pagination & Infinite Scroll

**Challenge:** Paginated search results create duplicate content signals and crawl budget issues.

**Strategy:**

**Option 1: Pagination with rel="prev/next" (Traditional)**
```html
<link rel="prev" href="/search?city=Moscow&page=1" />
<link rel="next" href="/search?city=Moscow&page=3" />
```

**Option 2: View-All Canonical (Recommended for thin pagination)**
```html
<!-- On page 2, 3, 4, etc. -->
<link rel="canonical" href="/search?city=Moscow" />
```

**Option 3: Self-Canonical with noindex after threshold**
```typescript
// Pages 1-3: index with self-canonical
// Pages 4+: noindex with canonical to page 1
const isIndexable = pageNumber <= 3;
```

**Recommendation for MVP+:**
- Index pages 1-3 with self-canonical
- Set noindex on pages 4+ with canonical to page 1
- Monitor user behavior to adjust threshold

### 3.4. Internal Linking Strategies

**Goal:** Create semantic relationships between content to improve crawlability and topical authority.

#### 3.4.1. Hub-Spoke Pattern

**Hub Pages:** Broad topics (e.g., "Storage in Moscow")  
**Spoke Pages:** Specific variations (e.g., "Climate-Controlled Storage in Moscow City Center")

**Implementation:**
- Hub pages link to all relevant spokes
- Spoke pages link back to hub and to related spokes
- Breadcrumb navigation reinforces hierarchy

**Example Structure:**
```
Storage in Moscow (Hub)
├── Storage in Moscow City Center (Spoke)
├── Storage near Kremlin Metro (Spoke)
├── Climate-Controlled Storage in Moscow (Spoke)
└── Business Storage in Moscow (Spoke)
```

#### 3.4.2. Related Warehouses

**Pattern:** On each warehouse detail page, show related warehouses based on:
- Same city/district
- Similar pricing
- Similar amenities

**SEO Benefit:** Creates internal link graph that helps search engines discover related content and understand topical relationships.

---

## 4. Technical SEO Enhancements

### 4.1. Rendering & Delivery

#### 4.1.1. SSR vs SSG vs ISR Decision Matrix

**MVP uses SSR for all public pages.** Post-MVP can optimize rendering strategy per page type.

| Page Type | MVP Rendering | v2+ Recommendation | Rationale |
|-----------|--------------|-------------------|-----------|
| Homepage | SSR | **SSG with ISR** | Mostly static, infrequent changes |
| Search results | SSR | **SSR** | Dynamic filters, personalization |
| Warehouse detail | SSR | **ISR** | Semi-static, periodic updates |
| Location pages | SSR | **SSG with ISR** | Static structure, occasional inventory changes |
| Static pages | SSG | **SSG** | No change needed |

**ISR (Incremental Static Regeneration) Pattern:**

```typescript
// app/warehouses/[id]/page.tsx (conceptual)
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Pre-generate top N warehouses
  const topWarehouses = await getTopWarehouses(limit: 100);
  return topWarehouses.map(w => ({ id: w.id.toString() }));
}

export const dynamicParams = true; // Generate others on-demand
```

**Benefits:**
- Faster page loads (pre-rendered)
- Lower server load
- Better Core Web Vitals scores

**Trade-offs:**
- Stale data risk (mitigated by revalidation)
- Build time increases for pre-generated pages

#### 4.1.2. Hydration Strategies

**Challenge:** JavaScript hydration can delay interactivity, impacting user experience and SEO signals.

**Strategies:**

**Progressive Hydration:**
- Hydrate above-the-fold content first
- Defer below-the-fold interactive components

**Partial Hydration:**
- Only hydrate interactive islands (e.g., booking form, map)
- Leave static content as static HTML

**Selective Hydration:**
- Use React Server Components (RSC) to reduce client-side JS
- Send only interactive components to client

**Implementation Note:** These patterns require careful architectural consideration and are post-MVP optimizations.

### 4.2. Performance for SEO

#### 4.2.1. Core Web Vitals Considerations

**Context:** Google uses Core Web Vitals as ranking signals. Optimizing for CWV improves both SEO and user experience.

**Key Metrics:**

| Metric | Target | SEO Impact | Optimization Priority |
|--------|--------|------------|---------------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | High | Critical |
| **FID** (First Input Delay) | < 100ms | Medium | High |
| **CLS** (Cumulative Layout Shift) | < 0.1 | High | Critical |
| **INP** (Interaction to Next Paint) | < 200ms | Medium | Medium |

**Advanced Optimization Techniques:**

**LCP Optimization:**
- Preload hero images with `<link rel="preload">`
- Use responsive images with `srcset`
- Implement image CDN with automatic format optimization (WebP, AVIF)
- Minimize render-blocking resources

```html
<!-- Preload LCP image (conceptual) -->
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high" />
```

**CLS Optimization:**
- Reserve space for dynamic content (skeleton screens)
- Specify dimensions for images and embeds
- Avoid inserting content above existing content
- Use CSS containment for dynamic sections

**FID/INP Optimization:**
- Code-split non-critical JavaScript
- Defer third-party scripts
- Use web workers for heavy computations
- Optimize event handlers

#### 4.2.2. Preloading & Prefetching

**Preload:** Fetch critical resources early
```html
<link rel="preload" href="/critical.css" as="style" />
<link rel="preload" href="/hero.jpg" as="image" />
```

**Prefetch:** Hint at likely next navigation
```html
<link rel="prefetch" href="/warehouses/123" />
```

**Next.js Link Prefetching:**
```typescript
// Automatic prefetching on link hover
<Link href="/warehouses/123" prefetch={true}>
  View Warehouse
</Link>
```

**Strategic Prefetching:**
- Prefetch related warehouse pages on warehouse detail view
- Prefetch next pagination page on scroll approach
- Prefetch filtered search results on filter hover

### 4.3. Structured Data (Advanced)

#### 4.3.1. Extended Schema Usage

**MVP implements:** Basic `SelfStorage` schema

**v2+ can extend with:**

**Review Schema:**
```json
{
  "@type": "SelfStorage",
  "name": "Warehouse Name",
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Ivan P." },
      "datePublished": "2025-12-01",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5
      },
      "reviewBody": "Great storage facility!"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 127
  }
}
```

**FAQ Schema (for storage guides):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What size storage unit do I need?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The size you need depends on..."
      }
    }
  ]
}
```

**Service Area Schema:**
```json
{
  "@type": "SelfStorage",
  "areaServed": [
    { "@type": "City", "name": "Moscow" },
    { "@type": "City", "name": "Saint Petersburg" }
  ]
}
```

**Implementation Note:** Only add schemas where genuine value exists. Do not fabricate content to game schema signals.

---

## 5. International & Multi-Region SEO

### 5.1. Hreflang Strategies

**Context:** When expanding to multiple regions or languages, hreflang signals help search engines serve the correct version to users.

#### 5.1.1. Implementation Patterns

**Scenario 1: Same language, different regions (e.g., Russia, Belarus, Kazakhstan)**

```html
<link rel="alternate" hreflang="en-AE" href="https://storagecompare.ae/" />
<link rel="alternate" hreflang="ru-BY" href="https://selfstorage.by/" />
<link rel="alternate" hreflang="ru-KZ" href="https://selfstorage.kz/" />
<link rel="alternate" hreflang="x-default" href="https://selfstorage.com/" />
```

**Scenario 2: Multiple languages, single region**

```html
<link rel="alternate" hreflang="ru" href="https://storagecompare.ae/" />
<link rel="alternate" hreflang="en" href="https://storagecompare.ae/en/" />
<link rel="alternate" hreflang="x-default" href="https://storagecompare.ae/" />
```

#### 5.1.2. URL Structure Options

**Option 1: ccTLD (Country Code Top-Level Domain)**
```
https://storagecompare.ae    # Russia
https://selfstorage.by    # Belarus
https://selfstorage.kz    # Kazakhstan
```

**Pros:** Strongest geo-targeting signal  
**Cons:** Requires separate domains, SSL certificates, potential brand dilution

**Option 2: Subdomain**
```
https://ru.selfstorage.com
https://by.selfstorage.com
https://kz.selfstorage.com
```

**Pros:** Clear separation, easier to manage  
**Cons:** Weaker geo-targeting than ccTLD

**Option 3: Subdirectory (Recommended for MVP+)**
```
https://selfstorage.com/ru/
https://selfstorage.com/by/
https://selfstorage.com/kz/
```

**Pros:** Single domain, consolidated authority, easier deployment  
**Cons:** Weaker geo-targeting signal than ccTLD

**Recommendation:** Start with subdirectory approach for MVP+ expansion, migrate to ccTLD if regional presence justifies investment.

### 5.2. Region-Specific URLs

**Pattern:** Ensure each region has unique URLs for warehouse pages to avoid duplication.

```
# Russia
https://selfstorage.com/ru/warehouses/123

# Belarus  
https://selfstorage.com/by/warehouses/456
```

**Critical:** Even if warehouse IDs overlap, prepend with region to create unique URLs.

### 5.3. Content Duplication Risks

**Challenge:** Multi-region expansion can create near-duplicate content.

**Mitigation Strategies:**

1. **Unique Local Content:**
   - Include region-specific regulations (e.g., "Storage regulations in Moscow vs Minsk")
   - Local payment methods
   - Region-specific contact information

2. **Canonical Management:**
   - Do NOT canonical cross-region (e.g., BY → RU)
   - Each region should self-canonical

3. **Hreflang Signals:**
   - Properly implemented hreflang tells search engines these are regional variants, not duplicates

### 5.4. Rollout Sequencing

**Phase 1: Establish Primary Market (MVP)**
- Focus: Russia (en-AE)
- Goal: Achieve product-market fit, establish SEO baseline

**Phase 2: Adjacent Markets (v2)**
- Focus: Belarus (ru-BY), Kazakhstan (ru-KZ)
- Goal: Test multi-region infrastructure, validate hreflang implementation

**Phase 3: Language Expansion (v3+)**
- Focus: English version for international users
- Goal: Capture expat and business traveler demand

---

## 6. SEO & Search Quality Signals

### 6.1. Interaction with Ranking Algorithms

**Context:** Modern search ranking considers user engagement signals, not just on-page factors.

**Key Signals (Conceptual):**
- **Click-Through Rate (CTR):** Percentage of searchers who click your result
- **Dwell Time:** Time spent on page before returning to search results
- **Bounce Rate:** Percentage of single-page sessions
- **Pogo-Sticking:** Repeated back-and-forth between search results and pages (negative signal)

**Non-Goal:** This document does not recommend manipulating these signals artificially.

### 6.2. User Behavior Feedback Loops

**Pattern:** Use analytics to identify pages with poor engagement, improve content and UX, monitor for SEO impact.

**Process:**

1. **Identify Underperforming Pages:**
   - High impressions, low CTR (bad title/description)
   - High bounce rate (content mismatch or poor UX)
   - Low dwell time (content not valuable)

2. **Hypothesize Improvements:**
   - Rewrite titles to match search intent
   - Add more comprehensive content
   - Improve page load speed

3. **Implement Changes:**
   - A/B test title changes (where possible)
   - Deploy UX improvements
   - Monitor analytics

4. **Measure Impact:**
   - Track CTR changes
   - Monitor bounce rate trends
   - Observe ranking changes over weeks

**Integration Point:** Reference DOC-014 (Analytics & Metrics Tracking) for implementation details.

### 6.3. Trust & Quality Indicators

**Goal:** Establish platform as authoritative source for storage information.

**Strategies:**

1. **E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness):**
   - Display operator credentials and verification status
   - Show genuine user reviews with verification indicators
   - Publish educational content about storage best practices
   - Maintain transparent contact information

2. **Technical Trust Signals:**
   - HTTPS everywhere (SSL/TLS)
   - Valid SSL certificate
   - Privacy policy and terms of service
   - Contact information in footer
   - Business registration information

3. **Content Quality:**
   - Original warehouse descriptions (not scraped)
   - High-quality photos (minimum resolution standards)
   - Accurate, up-to-date pricing
   - Clear booking process

**Integration Point:** Reference DOC-078 (Security & Compliance) for trust signal implementation.

---

## 7. SEO Experimentation

### 7.1. SEO A/B Testing Boundaries

**Challenge:** SEO changes are slow to show impact and difficult to attribute.

**Safe Experimentation Patterns:**

**✅ Can Test:**
- Title and meta description variations (split by URL group)
- Internal linking structure changes
- Content length/depth variations
- Schema markup additions

**⚠️ Test with Caution:**
- URL structure changes (use redirects)
- Canonical tag changes
- Rendering strategy changes (SSR → SSG)

**❌ Avoid Testing:**
- Cloaking (showing different content to search engines)
- Hidden text or links
- Keyword stuffing variations
- Doorway page strategies

### 7.2. Safe Experimentation Principles

**Principle 1: Segment by URL Groups**

Test changes on a subset of similar pages, not site-wide.

**Example:**
- **Control Group:** 50% of warehouse detail pages (IDs ending in 0-4)
- **Treatment Group:** 50% of warehouse detail pages (IDs ending in 5-9)

**Principle 2: Long-Term Measurement**

SEO changes take weeks to months to show impact. Plan for:
- Minimum 4-week test duration
- Minimum 8-week observation window for full effect
- Statistical significance testing with large sample sizes

**Principle 3: Rollback Plan**

Always have a rollback strategy:
- Monitor for negative impacts (traffic drops, ranking losses)
- Prepare to revert changes quickly
- Document all changes for future reference

### 7.3. Rollback Strategy

**Trigger Conditions:**
- Organic traffic drop > 10% lasting > 2 weeks
- Ranking losses for key terms > 5 positions
- Crawl errors or indexation drops
- Core Web Vitals degradation

**Rollback Process:**
1. Revert code changes immediately
2. Request re-crawl via Search Console
3. Monitor recovery over 1-2 weeks
4. Document learnings for future tests

**Integration Point:** Reference DOC-003 (Experimentation Framework) if applicable to SEO tests.

---

## 8. Risks & Trade-offs

### 8.1. Over-Indexation

**Risk:** Creating too many low-quality pages can dilute authority and waste crawl budget.

**Symptoms:**
- Low average dwell time across indexed pages
- High bounce rate on location/filter pages
- Declining rankings for core pages

**Mitigation:**
- Set strict quality thresholds (minimum warehouses per page)
- Monitor indexation via Search Console
- Use strategic noindex when pages don't meet quality bar

### 8.2. Crawl Budget Waste

**Risk:** Search engines have limited time to crawl each site. Wasteful crawling of low-value pages reduces crawling of high-value pages.

**Mitigation:**
- Block low-value URLs in robots.txt (e.g., `/api/*`, `/dashboard/*`)
- Use noindex, follow for pagination past thresholds
- Monitor crawl stats in Search Console
- Implement efficient sitemap (only high-value URLs)

### 8.3. SEO-Driven UX Degradation

**Risk:** Optimizing solely for search engines can harm user experience.

**Anti-Patterns to Avoid:**
- Keyword-stuffed titles that don't read naturally
- Excessive internal linking that clutters pages
- Content created for SEO without user value
- Slow-loading pages due to excessive schema markup

**Principle:** User experience and SEO are aligned. Good UX leads to good engagement signals, which improve SEO.

### 8.4. Compliance Risks

**Risk:** Advanced SEO tactics can inadvertently violate search engine guidelines or data privacy regulations.

**Examples:**
- Scraped content from competitors (copyright violation)
- Misleading titles or descriptions (guideline violation)
- User-generated content without moderation (legal risk)
- Tracking scripts that violate GDPR (compliance risk)

**Mitigation:**
- Review all content for originality
- Moderate user reviews before publishing
- Ensure compliance with DOC-078 (Security & Compliance)
- Avoid black-hat SEO tactics

---

## 9. Relationship to Canonical Documents

This document extends and references the following canonical documents:

### 9.1. DOC-046 — Frontend Architecture Specification (CANONICAL)

**Relationship:** This document extends the MVP SEO baseline defined in DOC-046 § 9.

**MVP Baseline Includes:**
- Server-Side Rendering (SSR) for public pages
- Basic metadata generation (title, description, Open Graph)
- Schema.org structured data for warehouses
- Sitemap and robots.txt generation
- Canonical URL management

**DOC-082 Extends With:**
- Advanced rendering strategies (SSR, SSG, ISR mix)
- Scaled indexing for location-based pages
- Faceted navigation handling
- Performance optimization for SEO signals
- Multi-region SEO patterns

**Priority:** DOC-046 requirements MUST be met before implementing DOC-082 extensions.

### 9.2. DOC-075 / DOC-076 — Search Ranking & Quality Signals (SUPPORTING)

**Status:** DOC-075 and DOC-076 may or may not exist as supporting documents for internal search ranking.

**If These Documents Exist:**
- DOC-082 focuses on organic search (Google)
- DOC-075/076 focus on internal platform search
- Both should align on quality signals where applicable

**If These Documents Do Not Exist:**
- Consider creating them to align internal and external search quality

### 9.3. DOC-014 — Analytics & Metrics Tracking (CANONICAL)

**Relationship:** SEO performance tracking should integrate with platform analytics.

**Required Integration:**
- Track organic traffic sources (referrer: google.com)
- Measure conversion rates from organic traffic
- Monitor Core Web Vitals via analytics
- Track engagement metrics (bounce rate, dwell time)

**Implementation:** SEO-specific metrics should flow into the analytics system defined in DOC-014.

### 9.4. DOC-078 — Security & Compliance Plan (CANONICAL)

**Relationship:** SEO practices must comply with security and privacy requirements.

**Compliance Areas:**
- User reviews: moderation before publishing
- User-generated content: GDPR compliance for display
- Tracking scripts: consent management for analytics
- External links: security considerations for outbound links

**Priority:** Security and compliance requirements in DOC-078 override any SEO optimizations that might conflict.

### 9.5. DOC-003 — Experimentation Framework (if applicable)

**Relationship:** SEO A/B tests should follow platform experimentation standards.

**Integration:**
- Use platform experimentation infrastructure for SEO tests
- Follow statistical rigor for test design
- Document test hypotheses and results
- Share learnings across teams

---

## 10. Non-Goals

This document explicitly does **NOT** cover:

### 10.1. Not MVP SEO

**Rationale:** MVP SEO is fully defined in DOC-046 § 9. This document only extends post-MVP.

**Impact:** DOC-082 strategies are optional enhancements, not MVP requirements.

### 10.2. Not Growth Guarantees

**Rationale:** SEO outcomes depend on competition, algorithm changes, and execution quality.

**Impact:** This document describes strategies, not promised results. No traffic or ranking guarantees are implied.

### 10.3. Not Content Production

**Rationale:** SEO strategy is separate from content creation workflows.

**Impact:** Content marketing, editorial calendars, and content production processes are out of scope.

### 10.4. Not Backlink Strategy

**Rationale:** Link building is an operational activity, not an architectural specification.

**Impact:** Off-page SEO tactics (outreach, partnerships, PR) are not defined here.

### 10.5. Not Mandatory Implementation

**Rationale:** These are growth-oriented enhancements, not system requirements.

**Impact:** Teams can selectively implement based on business priorities. No section of this document is mandatory.

---

## 11. Implementation Prioritization

When implementing DOC-082 strategies post-MVP, prioritize as follows:

### 11.1. High Priority (Immediate Post-MVP)

1. **Core Web Vitals Optimization**
   - Directly impacts rankings and user experience
   - Low-hanging fruit with measurable impact
   - Reference § 4.2.1

2. **Strategic ISR for Warehouse Pages**
   - Improves performance and reduces server load
   - Maintains SEO benefits of SSR
   - Reference § 4.1.1

3. **Faceted Navigation Indexability Controls**
   - Prevents over-indexation and duplicate content
   - Critical for search scalability
   - Reference § 3.2

### 11.2. Medium Priority (v2 Planning)

1. **Location-Based Landing Pages**
   - Enables long-tail discovery
   - Requires content strategy and quality thresholds
   - Reference § 3.1.1

2. **Extended Schema Markup**
   - Enhances search appearance (review stars, FAQ)
   - Low technical effort, moderate SEO impact
   - Reference § 4.3.1

3. **Internal Linking Optimization**
   - Improves crawlability and topical authority
   - Can be implemented incrementally
   - Reference § 3.4

### 11.3. Lower Priority (v3+)

1. **Multi-Region Expansion**
   - Only relevant when expanding geographically
   - Significant planning and infrastructure work
   - Reference § 5

2. **SEO Experimentation Framework**
   - Valuable for optimization but not core
   - Requires long timelines and statistical rigor
   - Reference § 7

---

## 12. Conclusion

This document provides a roadmap for advanced SEO capabilities beyond the MVP baseline. These strategies support scalable organic growth, regional expansion, and long-tail discovery while maintaining technical excellence and user experience quality.

**Key Principles:**

1. **Quality Over Quantity:** Index only pages that provide user value
2. **Performance Matters:** Core Web Vitals directly impact rankings
3. **Experimentation Required:** SEO is iterative; test and learn
4. **User-First:** SEO optimizations should enhance, not degrade, user experience
5. **Compliance Always:** Security and privacy requirements override SEO tactics

**Next Steps:**

1. Validate MVP SEO implementation per DOC-046 § 9
2. Prioritize post-MVP enhancements based on business needs
3. Establish analytics baseline for measuring SEO impact
4. Plan rollout of high-priority enhancements (Core Web Vitals, ISR)
5. Define internal success metrics (not traffic guarantees)

---

**Document Status:** Ready for Review  
**Review Required:** Growth Lead, Engineering Lead, Product Manager  
**Dependencies:** DOC-046 (Frontend Architecture), DOC-014 (Analytics), DOC-078 (Security)

---

**END OF DOCUMENT**
