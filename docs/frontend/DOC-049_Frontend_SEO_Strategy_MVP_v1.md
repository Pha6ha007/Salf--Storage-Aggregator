# DOC-049: Frontend SEO Strategy (MVP v1)

**Document Status:** 🟢 GREEN (Supporting / Technical Strategy)  
**Version:** 1.0  
**Last Updated:** 2025-12-17  
**Owner:** Frontend Team  
**Classification:** Technical Strategy - Frontend SEO Requirements

---

## Document Control

| Property | Value |
|----------|-------|
| **Project** | Self-Storage Aggregator Platform |
| **Phase** | MVP v1 |
| **Document Type** | Technical Strategy - Supporting |
| **Extends** | DOC-081 (SEO Strategy) |
| **Depends On** | Frontend Architecture Specification, DOC-048 (Performance), DOC-100 (Caching), Technical Architecture |
| **Codegen-Ready** | ⚠️ PARTIAL (Principles only, not implementation) |

---

## Table of Contents

1. [Document Role & Scope](#1-document-role--scope)
2. [Frontend SEO Goals (MVP v1)](#2-frontend-seo-goals-mvp-v1)
3. [Rendering Strategy & SEO](#3-rendering-strategy--seo)
4. [URL Structure & Routing](#4-url-structure--routing)
5. [Metadata Management](#5-metadata-management)
6. [Indexation Control](#6-indexation-control)
7. [Internal Linking](#7-internal-linking)
8. [Images & Media SEO](#8-images--media-seo)
9. [Error Pages & SEO Fallbacks](#9-error-pages--seo-fallbacks)
10. [Performance & SEO Alignment](#10-performance--seo-alignment)
11. [Integration with Canonical Documents](#11-integration-with-canonical-documents)
12. [Out of Scope for MVP v1](#12-out-of-scope-for-mvp-v1)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Acceptance Criteria](#14-acceptance-criteria)

---

# 1. Document Role & Scope

## 1.1. Purpose

This document translates the **high-level SEO strategy (DOC-081)** into **frontend-specific technical requirements and constraints** for the Self-Storage Aggregator MVP v1.

**This document:**
- ✅ Defines frontend SEO requirements and principles
- ✅ Specifies technical constraints for crawlability and indexability
- ✅ Establishes SEO-safe rendering and routing patterns
- ✅ Provides frontend team with actionable SEO guidelines

**This document does NOT:**
- ❌ Define overall SEO strategy (see DOC-081)
- ❌ Specify content strategy or keyword research
- ❌ Provide implementation code or templates
- ❌ Make traffic or ranking guarantees
- ❌ Cover backend SEO logic (sitemaps generation, structured data APIs)

## 1.2. Relationship to DOC-081

**DOC-081 (SEO Strategy)** defines:
- Business SEO objectives
- Target keywords and content strategy
- Off-page SEO principles
- Overall crawl budget management

**DOC-049 (This Document)** defines:
- How frontend implements SEO requirements
- Rendering patterns for crawlability
- Technical constraints for indexability
- Frontend-specific SEO best practices

**Hierarchy:** DOC-081 is authoritative for SEO strategy. This document operationalizes those requirements at the frontend layer.

## 1.3. Scope (MVP v1 Only)

**In Scope:**
- Frontend rendering strategy (SSR/SSG/ISR) principles
- URL routing structure requirements
- Metadata management approach (titles, descriptions)
- Indexation control mechanisms (robots, noindex)
- Internal linking patterns
- Image optimization for SEO
- Error page handling for crawlers
- Performance constraints affecting SEO

**Out of Scope:**
- Content creation workflows
- Link building strategies
- Social media integration
- Post-MVP SEO automation
- Advanced schema markup implementation
- International SEO (i18n)
- A/B testing for SEO

---

# 2. Frontend SEO Goals (MVP v1)

## 2.1. Core Principles

The frontend must enable search engines to:

1. **Crawl** - Access and discover all public pages efficiently
2. **Index** - Understand page content and purpose accurately
3. **Rank** - Present pages in search results with correct metadata

These principles are implemented through technical decisions, not marketing tactics.

## 2.2. Non-Goals

This strategy does NOT aim to:
- Guarantee specific search rankings
- Drive specific traffic volumes
- Optimize conversion rates (separate concern)
- Implement growth hacks or viral features

## 2.3. Success Indicators (Technical)

Frontend SEO implementation is successful when:
- ✅ All public pages are crawlable (no JavaScript-only content)
- ✅ Pages have unique, descriptive titles and meta descriptions
- ✅ URLs follow clean, semantic structure
- ✅ Core Web Vitals meet acceptable thresholds
- ✅ Images have appropriate alt text and optimization
- ✅ Internal navigation is crawler-accessible

---

# 3. Rendering Strategy & SEO

## 3.1. Rendering Approach (High-Level)

**Per Technical Architecture Document:**
- Next.js 14 framework with React 18
- Hybrid rendering strategy (SSR + SSG + ISR + CSR)

**SEO Rendering Requirements:**

### 3.1.1. Server-Side Rendering (SSR)

**Use For:**
- Catalog/search pages with dynamic filters
- Map view with location-based results
- Pages requiring fresh data on each request

**SEO Rationale:**
- Ensures crawlers receive fully-rendered HTML
- Handles dynamic content (prices, availability) server-side
- Reduces Time to First Byte (TTFB) impact on SEO

**Reference:** Technical Architecture Document § 2.3.1

### 3.1.2. Static Site Generation (SSG)

**Use For:**
- Marketing pages (home, about, contact, FAQ)
- Legal pages (privacy, terms)
- Content that rarely changes

**SEO Rationale:**
- Fastest page load times
- Pre-rendered HTML ensures crawlability
- Minimal server load

### 3.1.3. Incremental Static Regeneration (ISR)

**Use For:**
- Warehouse detail pages
- High-traffic pages requiring periodic updates

**SEO Rationale:**
- Balances freshness and performance
- Serves cached HTML to crawlers
- Updates content without full rebuilds

**Reference:** DOC-100 (Caching Strategy) § 3.2.3 - ISR configuration with 10-minute revalidation

### 3.1.4. Client-Side Rendering (CSR)

**Use For:**
- Authenticated user flows
- Interactive components after initial render
- Non-SEO-critical dynamic content

**SEO Rationale:**
- Acceptable for pages that should NOT be indexed
- Reduces server load for non-public content
- Enables rich interactivity post-hydration

## 3.2. Hydration Strategy

**Requirement:** Progressive hydration to avoid layout shifts affecting Cumulative Layout Shift (CLS).

**Constraints:**
- Critical above-the-fold content must render server-side
- JavaScript-dependent interactions hydrate after initial paint
- No content "flash" or re-rendering visible to crawlers

**Reference:** DOC-048 (Frontend Performance) for Core Web Vitals alignment

## 3.3. Mobile-First Rendering

**Requirement:** Mobile-first indexing compliance.

**Implementation Principle:**
- Responsive design (not separate mobile URLs)
- Identical content across viewport sizes
- No mobile-only hidden content that affects desktop

---

# 4. URL Structure & Routing

## 4.1. URL Design Principles

**Requirements:**
- Clean, semantic URLs (no query parameters for primary navigation)
- Human-readable path segments
- Consistent structure across page types

**Examples:**
```
✅ /catalog
✅ /warehouse/101
✅ /catalog?location=moscow&size=M  (filters acceptable)
❌ /page?id=101  (non-semantic)
❌ /w/101  (cryptic abbreviation)
```

## 4.2. Canonical URL Management

**Requirement:** Each page has ONE canonical URL.

**Frontend Responsibility:**
- Serve `<link rel="canonical">` tag in `<head>`
- Match canonical URL to current page URL (unless explicit duplication)
- No trailing slashes inconsistency

**Example:**
```html
<!-- Warehouse detail page -->
<link rel="canonical" href="https://platform.example/warehouse/101" />
```

**Reference:** DOC-081 for canonical URL strategy

## 4.3. Routing Constraints

**Requirements:**
- No hash-based routing for SEO-critical pages (use path-based routing)
- No URL fragments for primary content (`#section` acceptable for anchors)
- Consistent URL casing (prefer lowercase)

**Client-Side Navigation:**
- Use Next.js `<Link>` component (preserves SEO with `<a>` tags)
- Shallow routing acceptable for filters (preserves URL updates)

---

# 5. Metadata Management

## 5.1. Page Titles

**Requirements:**
- Unique title per page
- 50-60 characters optimal length
- Include primary keyword naturally
- Format: `[Page Title] | [Site Name]`

**Frontend Responsibility:**
- Set via Next.js `<Head>` or `metadata` export
- Dynamic titles for warehouse/catalog pages

**Examples:**
```html
<title>Warehouses in Dubai — box rental from 2000AED /month | SelfStorage</title>
<title>Warehouse "StorageHub" — Business Bay, 23 | SelfStorage</title>
```

## 5.2. Meta Descriptions

**Requirements:**
- Unique description per page
- 150-160 characters optimal length
- Actionable, descriptive text
- Include relevant keywords naturally

**Frontend Responsibility:**
- Set `<meta name="description">` in `<head>`
- Dynamic descriptions for warehouse/catalog pages

**Examples:**
```html
<meta name="description" content="Storage box rental in Dubai. Over 50 warehouses with climate control and 24/7 access. Prices from 2000AED /month." />
```

## 5.3. Open Graph & Social Metadata

**Requirements:**
- Set basic Open Graph tags for link previews
- Include `og:title`, `og:description`, `og:image`, `og:url`

**Scope (MVP v1):**
- Essential tags only (no extended Twitter Cards)
- Warehouse detail pages have specific images

**Example:**
```html
<meta property="og:title" content="Warehouse StorageHub — Business Bay, 23" />
<meta property="og:description" content="Secure storage with climate control and 24/7 access." />
<meta property="og:image" content="https://cdn.example/warehouse-101.jpg" />
<meta property="og:url" content="https://platform.example/warehouse/101" />
```

---

# 6. Indexation Control

## 6.1. Robots Meta Tag

**Requirements:**
- Public pages: no robots meta tag (allow indexing by default)
- Authenticated pages: `<meta name="robots" content="noindex, nofollow">`
- Search result pages with empty results: `<meta name="robots" content="noindex, follow">`

**Frontend Responsibility:**
- Dynamically set robots meta tag based on page type and authentication state

**Examples:**
```html
<!-- Public warehouse page -->
(no robots meta tag)

<!-- User profile page -->
<meta name="robots" content="noindex, nofollow" />

<!-- Catalog with no results -->
<meta name="robots" content="noindex, follow" />
```

## 6.2. Pagination Handling

**Requirements:**
- Paginated catalog pages use query parameters: `/catalog?page=2`
- No `rel="prev"` or `rel="next"` (deprecated by Google)
- Each page has unique title/description mentioning page number

**Example:**
```html
<!-- Page 2 of catalog -->
<title>Warehouses in Dubai — page 2 | SelfStorage</title>
```

## 6.3. Filter Pages

**Requirements:**
- Filter URLs use query parameters: `/catalog?location=moscow&size=M`
- Canonical URL points to base `/catalog` if no filters applied
- Filtered pages may be indexed if they provide unique value

**Frontend Responsibility:**
- Set canonical URL appropriately based on filter state

---

# 7. Internal Linking

## 7.1. Crawler-Accessible Navigation

**Requirements:**
- Main navigation rendered as `<nav>` with `<a>` tags
- Breadcrumbs present on warehouse detail pages
- Related warehouses linked from detail pages

**Constraints:**
- No JavaScript-only navigation (must work with JS disabled for crawlers)
- All links use `<a href="...">` (not `<div onclick="...">`)

## 7.2. Breadcrumbs

**Requirements:**
- Present on warehouse detail pages
- Structured as: Home > Catalog > [Warehouse Name]

**Example:**
```html
<nav aria-label="breadcrumb">
  <a href="/">Home</a> >
  <a href="/catalog">Catalog</a> >
  <span>Warehouse "StorageHub"</span>
</nav>
```

## 7.3. Structured Linking Patterns

**Requirements:**
- Footer contains links to legal pages, contact, about
- Catalog links to warehouse detail pages
- Warehouse detail pages link back to catalog

**No Link Manipulation:**
- No excessive keyword anchor text stuffing
- Natural, user-focused link text

---

# 8. Images & Media SEO

## 8.1. Image Optimization

**Requirements:**
- Use Next.js Image component for automatic optimization
- Responsive images with appropriate sizes
- Modern formats (WebP with fallback)

**Reference:** DOC-100 (Caching Strategy) § 3.1 for image caching headers

## 8.2. Alt Text

**Requirements:**
- All images have descriptive `alt` attributes
- Alt text describes image content naturally (no keyword stuffing)
- Decorative images use `alt=""` (empty alt)

**Examples:**
```html
<img src="/warehouse-101.jpg" alt="Interior view of StorageHub warehouse with climate control" />
<img src="/decorative-line.svg" alt="" />
```

## 8.3. Lazy Loading

**Requirements:**
- Below-the-fold images use native lazy loading (`loading="lazy"`)
- Above-the-fold images load eagerly
- No negative impact on Largest Contentful Paint (LCP)

**Reference:** DOC-048 (Frontend Performance) for LCP optimization

---

# 9. Error Pages & SEO Fallbacks

## 9.1. 404 Not Found Pages

**Requirements:**
- Custom 404 page with helpful navigation
- Correct HTTP 404 status code (not 200)
- Links to home, catalog, search

**SEO Rationale:**
- Crawlers understand page does not exist
- Users redirected to functional pages

## 9.2. 500 Server Error Pages

**Requirements:**
- Custom 500 page with minimal branding
- Correct HTTP 500 status code
- No extensive crawlable content

## 9.3. Soft 404 Prevention

**Constraint:**
- Empty catalog results do NOT return 404 status
- Returns 200 OK with "No results found" message
- Sets `<meta name="robots" content="noindex, follow">`

---

# 10. Performance & SEO Alignment

## 10.1. Core Web Vitals

**Requirements:**
- Align with DOC-048 (Frontend Performance Optimization)
- Meet acceptable thresholds for SEO ranking signals

**Key Metrics:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Frontend Responsibility:**
- Optimize critical rendering path
- Minimize layout shifts (reserved space for images)
- Prioritize above-the-fold content

**Reference:** Monitoring & Observability Plan (DOC-057) § 2.7 for Web Vitals tracking

## 10.2. JavaScript Bundle Size

**Requirements:**
- Code splitting per page
- Lazy load non-critical JavaScript
- No blocking third-party scripts in `<head>`

**SEO Rationale:**
- Faster Time to Interactive (TTI) improves rankings
- Reduces mobile crawl budget impact

## 10.3. Caching & SEO

**Requirements:**
- CDN caching for static assets (per DOC-100)
- ISR for warehouse detail pages (10-minute revalidation)
- No aggressive caching that serves stale content to crawlers

**Reference:** DOC-100 (Caching Strategy) § 3.2 for SEO page caching rules

---

# 11. Integration with Canonical Documents

## 11.1. DOC-081 (SEO Strategy)

**Relationship:**
- DOC-081 defines WHAT to achieve (business SEO goals)
- DOC-049 defines HOW frontend implements it (technical requirements)

**Integration Points:**
- Canonical URL strategy follows DOC-081
- Indexation priorities align with DOC-081 target pages

## 11.2. Frontend Architecture Specification

**Relationship:**
- Frontend Architecture defines implementation details
- DOC-049 defines SEO constraints on those implementations

**Integration Points:**
- Rendering strategy (SSR/SSG/ISR) must support SEO requirements
- Component architecture enables metadata management

## 11.3. DOC-048 (Frontend Performance Optimization)

**Relationship:**
- Performance directly impacts SEO rankings (Core Web Vitals)
- DOC-049 references performance constraints

**Integration Points:**
- LCP, FID, CLS thresholds align between documents
- Image optimization serves both performance and SEO

## 11.4. DOC-100 (Caching Strategy & CDN)

**Relationship:**
- Caching affects content freshness for crawlers
- DOC-049 defines SEO requirements for caching policies

**Integration Points:**
- ISR revalidation intervals balance freshness and performance
- CDN headers allow crawler caching

## 11.5. Technical Architecture (DOC-002)

**Relationship:**
- System architecture defines frontend capabilities
- DOC-049 ensures SEO compatibility with architecture

**Integration Points:**
- Next.js framework supports required rendering strategies
- CDN layer (Cloudflare) provides SEO-friendly caching

---

# 12. Out of Scope for MVP v1

The following are explicitly **NOT included** in MVP v1:

## 12.1. Post-MVP SEO Features

- ❌ **Programmatic SEO at scale** - Auto-generated landing pages for all locations
- ❌ **Dynamic schema markup generation** - Automated structured data for rich snippets
- ❌ **International SEO (i18n)** - Multi-language support, hreflang tags
- ❌ **Advanced crawl budget optimization** - Log file analysis, selective crawling
- ❌ **A/B testing for SEO** - Title/description variant testing
- ❌ **Real-time indexation monitoring** - Live crawl rate tracking
- ❌ **AMP pages** - Accelerated Mobile Pages implementation
- ❌ **Progressive Web App (PWA) SEO** - Service workers, manifest optimization

## 12.2. Content Strategy

- ❌ **Keyword research tooling** - Integrated keyword analysis
- ❌ **Content calendar automation** - Scheduled content updates
- ❌ **User-generated content moderation** - Automated spam detection for reviews

## 12.3. Advanced Technical SEO

- ❌ **JavaScript SEO testing** - Automated JS rendering validation
- ❌ **Structured data testing** - Schema.org validation pipeline
- ❌ **Mobile-usability automation** - Continuous mobile UX testing

---

# 13. Non-Functional Requirements

## 13.1. Crawlability

**Requirement:** 100% of public pages must be crawler-accessible.

**Constraints:**
- No JavaScript-only critical content
- No authentication walls for public pages
- No broken internal links

## 13.2. Indexability

**Requirement:** All SEO-targeted pages must be indexable by default.

**Constraints:**
- No unintended `noindex` tags
- No orphan pages (unreachable from navigation)

## 13.3. Consistency

**Requirement:** SEO metadata must be consistent across page types.

**Constraints:**
- Titles follow consistent format
- Descriptions are unique and descriptive
- Canonical URLs point to correct locations

## 13.4. Observability

**Requirement:** SEO-critical metrics must be observable.

**Integration:**
- Core Web Vitals tracked per DOC-057 (Monitoring)
- Crawl errors logged per Logging Strategy

---

# 14. Acceptance Criteria

## 14.1. Technical Acceptance

Frontend SEO implementation is acceptable if:

✅ **Crawlability:**
- All public pages render fully server-side (SSR/SSG/ISR)
- No critical content requires JavaScript to display
- All internal links use `<a href="...">` tags

✅ **Metadata:**
- Every public page has unique title (50-60 chars)
- Every public page has unique meta description (150-160 chars)
- Canonical URLs present and correct

✅ **Performance:**
- Core Web Vitals meet acceptable thresholds (per DOC-048)
- LCP < 2.5s for catalog and warehouse detail pages
- CLS < 0.1 on all pages

✅ **Indexation:**
- Public pages have no `noindex` tags
- Authenticated pages have `noindex, nofollow`
- Error pages return correct HTTP status codes

✅ **Images:**
- All content images have descriptive alt text
- Images use Next.js Image component for optimization

✅ **URLs:**
- Clean, semantic URL structure
- No hash-based routing for SEO pages

## 14.2. Validation Methods

**Manual Testing:**
- View Page Source on key pages (ensure server-rendered HTML)
- Test with JavaScript disabled (verify content visibility)
- Check metadata uniqueness across sample pages

**Automated Testing:**
- Lighthouse SEO audits (score > 90)
- Core Web Vitals monitoring (DOC-057)
- Broken link detection (CI/CD pipeline)

**Crawler Testing:**
- Google Search Console verification (post-launch)
- Crawl simulator testing (e.g., Screaming Frog)

---

# Appendices

## Appendix A: SEO Quick Reference

**Rendering Strategy:**
- SSG: Static marketing pages
- SSR: Dynamic catalog/search
- ISR: Warehouse detail pages
- CSR: Authenticated flows

**Metadata Checklist:**
- [ ] Unique title (50-60 chars)
- [ ] Unique meta description (150-160 chars)
- [ ] Canonical URL present
- [ ] Open Graph tags (title, description, image, URL)

**Indexation Control:**
- Public pages: no robots meta tag
- Authenticated pages: `noindex, nofollow`
- Empty results: `noindex, follow`

**Performance Targets:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

---

## Appendix B: Key Terms

| Term | Definition |
|------|------------|
| **SSR** | Server-Side Rendering - HTML generated per request |
| **SSG** | Static Site Generation - Pre-built HTML at build time |
| **ISR** | Incremental Static Regeneration - Periodic HTML updates |
| **CSR** | Client-Side Rendering - HTML generated in browser |
| **Canonical URL** | Preferred URL for a page with duplicate content |
| **Crawlability** | Ability of search engines to access page content |
| **Indexability** | Ability of search engines to add page to search index |
| **Core Web Vitals** | Google's user experience metrics (LCP, FID, CLS) |
| **Hydration** | Process of attaching JavaScript to server-rendered HTML |

---

## Appendix C: Related Documents

| Document ID | Title | Relationship |
|-------------|-------|--------------|
| **DOC-081** | SEO Strategy (MVP v1) | High-level SEO strategy (parent document) |
| **DOC-048** | Frontend Performance Optimization | Performance constraints for SEO |
| **DOC-100** | Caching Strategy & CDN | Caching policies affecting crawlers |
| **DOC-002** | Technical Architecture | System capabilities enabling SEO |
| **DOC-057** | Monitoring & Observability | Web Vitals tracking |

---

**Document Status:** 🟢 GREEN (Supporting / Technical Strategy)  
**Maintenance:** Frontend Team  
**Next Review:** March 2026  
**Contact:** frontend-lead@platform.example

---

**END OF DOCUMENT**
