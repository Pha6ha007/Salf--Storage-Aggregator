# DOC-081 — SEO Strategy (MVP v1) — CANONICAL

**Document Status:** 🟢 Canonical (GREEN)  
**Version:** 1.0  
**Last Updated:** 2025-12-16  
**Owner:** Frontend / Backend Teams  
**Scope:** MVP v1 Only

---

## Document Control

| Property | Value |
|----------|-------|
| **Supersedes** | None (Initial version) |
| **Depends On** | DOC-046 (Frontend Architecture), DOC-015 (API Blueprint), DOC-050 (Database Spec), DOC-001 (Functional Spec) |
| **Related Docs** | DOC-057 (Monitoring), DOC-078 (Security), DOC-070 (Monetization) |
| **Review Cycle** | Quarterly |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [SEO Principles (MVP)](#2-seo-principles-mvp)
3. [Indexable Page Types](#3-indexable-page-types)
4. [URL Structure & Routing](#4-url-structure--routing)
5. [Meta & Structured Data](#5-meta--structured-data)
6. [Content Rules (MVP)](#6-content-rules-mvp)
7. [Technical SEO (Baseline)](#7-technical-seo-baseline)
8. [Performance & SEO](#8-performance--seo)
9. [International & Regional SEO (MVP-Light)](#9-international--regional-seo-mvp-light)
10. [Relationship to Canonical Documents](#10-relationship-to-canonical-documents)
11. [Non-Goals](#11-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document defines the **mandatory SEO requirements** for the Self-Storage Aggregator MVP v1 platform. It serves as the single source of truth for:

- Frontend developers implementing meta tags, structured data, and rendering strategies
- Backend developers providing SEO-friendly content and APIs
- QA engineers validating SEO implementation
- DevOps engineers configuring servers for SEO compliance

This document specifies **what must be present** for organic indexation and discoverability. It is NOT a growth strategy, traffic optimization plan, or marketing playbook.

## 1.2. MVP Scope

**What This Document Covers:**

- Technical SEO baseline (crawlability, indexability, meta tags)
- URL structure and routing rules
- Page types that must be indexable
- Minimum content requirements
- Structured data implementation
- Performance considerations (principle-level)

**What This Document Does NOT Cover:**

- Traffic growth targets or KPIs
- Link building or backlink strategies
- A/B testing or SEO experiments
- Content marketing or blog strategies
- Advanced SEO features (post-MVP)

## 1.3. Non-Goals

This document explicitly does NOT:

- Promise traffic volumes or conversion rates
- Describe SEO v2 features or growth hacks
- Define ML/AI-powered ranking strategies
- Overlap with DOC-082 (if it exists as a growth/experiment document)
- Include marketing-oriented content optimization

---

# 2. SEO Principles (MVP)

The MVP v1 SEO strategy is built on four foundational principles:

## 2.1. Crawlability

**Definition:** Search engine crawlers can discover and access all public pages.

**Requirements:**

- All public pages must be accessible via HTML links (no JavaScript-only navigation)
- robots.txt must not block critical content
- Internal linking structure must provide clear paths to all pages
- No orphaned pages (pages without any incoming links)
- Server response times must be reasonable (see DOC-057 for monitoring)

## 2.2. Indexability

**Definition:** Pages intended for search engines can be indexed without technical barriers.

**Requirements:**

- Pages must return HTTP 200 status codes for valid content
- Pages must not have `noindex` directives unless explicitly required
- Canonical URLs must be properly specified to avoid duplicate content
- Content must be server-rendered (SSR) or statically generated (ISR) where SEO matters
- Pages must have unique, descriptive titles and meta descriptions

## 2.3. Predictable URLs

**Definition:** URL structure is clean, semantic, and follows consistent patterns.

**Requirements:**

- URLs must be human-readable and descriptive
- URL patterns must match entity types (warehouses, boxes, locations)
- No session IDs, tracking parameters, or dynamic query strings in canonical URLs
- Consistent use of hyphens for word separation
- No trailing slashes inconsistency (enforce one convention)

## 2.4. Performance-First

**Definition:** Page load performance supports SEO goals without compromising user experience.

**Requirements:**

- Initial HTML must load quickly (support for Core Web Vitals targets)
- Critical content must be server-rendered (not client-side only)
- Images must be optimized and properly sized
- JavaScript must not block critical rendering path
- CDN usage for static assets (aligned with Technical Architecture)

---

# 3. Indexable Page Types

The following page types MUST be indexable and SEO-optimized:

## 3.1. Homepage

**URL Pattern:** `/`

**Purpose:** Primary entry point, brand discovery, high-level search functionality

**SEO Requirements:**

- Server-Side Rendered (SSR)
- Unique title and meta description
- H1 tag describing the service
- Internal links to key sections (catalog, city pages if present)
- Schema.org Organization markup

**Content Requirements:**

- Clear value proposition
- Search/filter interface
- Featured warehouses (if applicable)
- Trust signals (reviews count, warehouse count)

## 3.2. City Pages

**URL Pattern:** `/city/{city-slug}` (e.g., `/city/moscow`)

**Purpose:** Local SEO landing pages for geographic search queries

**SEO Requirements:**

- SSR or ISR (Incremental Static Regeneration)
- City-specific title: "Аренда бокса для хранения в {City}"
- City-specific meta description
- H1 with city name
- Canonical URL properly set
- Breadcrumb markup (if navigation hierarchy exists)

**Content Requirements:**

- List of warehouses in the city
- City-specific content (minimum 100 words if operator-generated)
- Link to catalog with city filter pre-applied

**MVP Limitation:** City pages may be limited to top 10 cities in MVP. Additional cities are post-MVP.

## 3.3. Warehouse Pages

**URL Pattern:** `/warehouse/{warehouse-slug}` (e.g., `/warehouse/skladok-vykhino`)

**Purpose:** Detailed warehouse information, primary conversion pages

**SEO Requirements:**

- ISR (Incremental Static Regeneration) per DOC-046
- Unique title: "{Warehouse Name} - Аренда бокса в {Location}"
- Unique meta description with key attributes (price, location, features)
- H1 = warehouse name
- H2 sections for details (boxes, reviews, location)
- Canonical URL
- Product schema (if applicable)
- Organization schema for operator (if applicable)
- Aggregate rating schema (if reviews exist)

**Content Requirements:**

- Warehouse description (from database)
- Available boxes with sizes and prices
- Photos (at least 1, optimized)
- Reviews section
- Location map
- Operator contact information

## 3.4. Box Type Pages (Conditional)

**URL Pattern:** `/boxes/{size-slug}` (e.g., `/boxes/m-box`)

**Purpose:** Landing pages for box size queries (e.g., "аренда бокса M")

**SEO Requirements:**

- SSR or ISR
- Size-specific title: "Аренда бокса размера {Size} - от {Min Price} AED /мес"
- Size-specific meta description
- H1 with size information
- Canonical URL

**Content Requirements:**

- List of warehouses offering this box size
- Size dimensions and typical use cases (if content available)
- Price range across platform

**MVP Limitation:** Box type pages are OPTIONAL in MVP. If not implemented, this section is deferred to post-MVP.

## 3.5. Static SEO Pages

**URL Pattern:** `/about`, `/how-it-works`, `/faq`, `/contacts`

**Purpose:** Informational pages, trust signals, legal compliance

**SEO Requirements:**

- SSR
- Unique titles and meta descriptions
- Proper H1 tags
- Canonical URLs
- Internal linking to main conversion pages

**Content Requirements:**

- Static content provided by operators or system
- FAQ schema markup for FAQ page (if applicable)

---

# 4. URL Structure & Routing

## 4.1. Canonical URL Rules

All URLs must follow these rules:

| Rule | Example | Notes |
|------|---------|-------|
| **Lowercase** | `/warehouse/skladok-vykhino` | NOT `/Warehouse/SkladOK-Vykhino` |
| **Hyphens for spaces** | `/city/saint-petersburg` | NOT `/city/saint_petersburg` or `/city/saint%20petersburg` |
| **No trailing slashes** | `/warehouse/test` | NOT `/warehouse/test/` (or enforce consistency) |
| **Slug generation** | `name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')` | Consistent slug generation |

## 4.2. Slug Generation Rules

**Entity Slug Fields:**

Per the database specification (DOC-050), the following entities may have slug fields:

- `warehouses.slug` (if present in schema)
- City slugs (generated from city names)

**Slug Generation Algorithm (Reference Implementation):**

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove special chars, keep letters/numbers
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/-+/g, '-')               // Collapse multiple hyphens
    .substring(0, 100);                // Limit length
}
```

**Conflict Resolution:**

If a slug collision occurs (two warehouses with the same name), append a numeric suffix:

- First: `/warehouse/skladok`
- Second: `/warehouse/skladok-2`

## 4.3. Pagination Handling

**Pagination URL Pattern:**

```
/warehouses?page=2
/city/moscow?page=3
```

**SEO Requirements:**

- Paginated pages must have `rel="prev"` and `rel="next"` link tags
- Page 1 should be canonical (no `?page=1` parameter)
- All pages must be indexable (no `noindex` on pagination)

**Example:**

```html
<!-- On page 2 of catalog -->
<link rel="canonical" href="https://storagecompare.ae/warehouses?page=2" />
<link rel="prev" href="https://storagecompare.ae/warehouses" />
<link rel="next" href="https://storagecompare.ae/warehouses?page=3" />
```

## 4.4. Filter URLs (No-Index Rules)

**Filter URL Pattern:**

```
/warehouses?size=M&price_min=3000&price_max=6000&climate_control=true
```

**SEO Handling:**

- Filter pages with query parameters MUST have `noindex` meta tag
- Filter pages MUST have a canonical URL pointing to the base catalog page
- Exception: Pre-defined filter combinations (e.g., city filters) MAY be indexable if they have unique content

**Example:**

```html
<!-- Filtered catalog page -->
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="https://storagecompare.ae/warehouses" />
```

---

# 5. Meta & Structured Data

## 5.1. Title Tag Rules

**Requirements:**

- Every page must have a unique `<title>` tag
- Title length: 50-60 characters (aim for ~55)
- Format: `{Primary Keyword} | {Brand Name}`
- Include key differentiators (location, price, feature)

**Examples:**

```html
<!-- Homepage -->
<title>Аренда боксов для хранения вещей | SelfStorage.ru</title>

<!-- City page -->
<title>Аренда бокса в Москве от 2000AED  | SelfStorage.ru</title>

<!-- Warehouse page -->
<title>СкладОК Выхино - аренда бокса от 3000AED  | SelfStorage.ru</title>
```

**Title Generation Logic (Reference):**

```typescript
interface PageTitleParams {
  pageType: 'home' | 'city' | 'warehouse' | 'catalog';
  entityName?: string; // warehouse name, city name
  minPrice?: number;
  brandName: string;
}

function generateTitle(params: PageTitleParams): string {
  const { pageType, entityName, minPrice, brandName } = params;
  
  switch (pageType) {
    case 'home':
      return `Аренда боксов для хранения вещей | ${brandName}`;
    case 'city':
      const priceStr = minPrice ? ` от ${minPrice}AED ` : '';
      return `Аренда бокса в ${entityName}${priceStr} | ${brandName}`;
    case 'warehouse':
      const priceStr2 = minPrice ? ` от ${minPrice}AED ` : '';
      return `${entityName} - аренда бокса${priceStr2} | ${brandName}`;
    case 'catalog':
      return `Каталог складов и боксов | ${brandName}`;
    default:
      return brandName;
  }
}
```

## 5.2. Meta Description Rules

**Requirements:**

- Every page must have a unique meta description
- Length: 150-160 characters (aim for ~155)
- Include call-to-action or value proposition
- Include location and price (if applicable)

**Examples:**

```html
<!-- Homepage -->
<meta name="description" content="Найдите бокс для хранения вещей рядом с вами. Более 100 складов в Москве и МО. Онлайн-бронирование, доступные цены." />

<!-- City page -->
<meta name="description" content="Аренда боксов в Москве: 50+ складов, от 2000AED /мес. Круглосуточный доступ, охрана, климат-контроль. Бронируйте онлайн." />

<!-- Warehouse page -->
<meta name="description" content="СкладОК Выхино: боксы от 3 до 20 м², цены от 3000AED /мес. Круглосуточный доступ, видеонаблюдение, климат-контроль. Забронируйте сейчас!" />
```

## 5.3. H1 / H2 Policy

**H1 Rules:**

- Every page must have exactly ONE H1 tag
- H1 must be unique per page
- H1 must be descriptive and include primary keyword
- H1 must be server-rendered (not client-side only)

**H1 Examples:**

```html
<!-- Homepage -->
<h1>Аренда боксов для хранения вещей</h1>

<!-- City page -->
<h1>Аренда боксов в Москве</h1>

<!-- Warehouse page -->
<h1>СкладОК Выхино</h1>
```

**H2 Rules:**

- Use H2 tags for major sections on the page
- Maintain logical hierarchy (H1 → H2 → H3)
- H2 tags should be descriptive of the section content

**H2 Examples (Warehouse Page):**

```html
<h2>Доступные боксы</h2>
<h2>Отзывы клиентов</h2>
<h2>Расположение</h2>
<h2>Дополнительные услуги</h2>
```

## 5.4. Schema.org Structured Data

### 5.4.1. Organization Schema (Homepage)

**Requirement:** Homepage must include Organization schema.

**Example:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SelfStorage.ru",
  "url": "https://storagecompare.ae",
  "logo": "https://cdn.storagecompare.ae/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-495-000-00-00",
    "contactType": "Customer Service",
    "availableLanguage": ["Russian"]
  },
  "sameAs": [
    "https://vk.com/selfstorage_ru",
    "https://t.me/selfstorage_ru"
  ]
}
```

### 5.4.2. LocalBusiness Schema (Warehouse Pages)

**Requirement:** Warehouse pages should include LocalBusiness schema (or Product schema if more appropriate).

**Example:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "СкладОК Выхино",
  "description": "Современный складской комплекс с климат-контролем",
  "image": "https://cdn.storagecompare.ae/warehouses/101/main.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Ташкентская, 23",
    "addressLocality": "Dubai",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 55.714521,
    "longitude": 37.816830
  },
  "priceRange": "3000AED  - 15000AED ",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 127
  }
}
```

### 5.4.3. AggregateRating Schema (Warehouse Pages with Reviews)

**Requirement:** Warehouse pages with reviews must include AggregateRating schema (can be embedded in LocalBusiness schema).

### 5.4.4. FAQ Schema (FAQ Page)

**Requirement:** If an FAQ page exists, it should include FAQ schema.

**Example:**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько стоит аренда бокса?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Стоимость аренды бокса зависит от размера и расположения склада. Цены начинаются от 2000AED  в месяц за бокс размером 1-2 м²."
      }
    }
  ]
}
```

---

# 6. Content Rules (MVP)

## 6.1. Minimum Content Requirements

**Homepage:**

- Minimum 100 words of unique text (excluding navigation, footer)
- Clear description of service
- At least 3 internal links to key sections

**City Pages:**

- Minimum 50 words of city-specific content (if operator-generated content is enabled)
- List of warehouses in the city (dynamic from database)

**Warehouse Pages:**

- Warehouse description: Minimum 50 words (from `warehouses.description`)
- At least 1 photo
- Box availability information
- Location information

**Static Pages (About, FAQ, etc.):**

- Minimum 200 words per page
- Clear headings structure

## 6.2. Duplication Rules

**Principle:** Avoid duplicate content that could confuse search engines.

**Rules:**

- Each page must have unique title and meta description
- Warehouse descriptions should be unique per warehouse (not copied from templates)
- If multiple pages have similar content, use canonical tags to indicate the preferred version
- Product listings (boxes) can appear on multiple pages (catalog, warehouse page) without duplication penalty if properly structured

## 6.3. Operator-Generated Content Constraints

**MVP Limitation:** In MVP v1, operator-generated content is limited to:

- Warehouse descriptions
- Warehouse photos
- Box descriptions (if provided)

**Moderation Implications:**

- Operator-provided descriptions must be reviewed before publication (status workflow per DOC-050: `draft` → `published`)
- Content must not contain spam, external links, or promotional language beyond service description
- Moderation rules are defined in operator onboarding flow (not in this document)

---

# 7. Technical SEO (Baseline)

## 7.1. robots.txt

**Location:** `/robots.txt` (served from public root)

**Requirements:**

- Must allow crawling of all public pages
- Must disallow crawling of admin, operator dashboard, user profile pages
- Must disallow API endpoints (`/api/*`)
- Should reference sitemap location

**Example robots.txt:**

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /operator/
Disallow: /profile/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /*?*  # Disallow URLs with query parameters (except whitelisted)

# Allow specific query patterns if needed
Allow: /*?page=

Sitemap: https://storagecompare.ae/sitemap.xml
```

## 7.2. sitemap.xml

**Location:** `/sitemap.xml` (served from public root)

**Requirements:**

- Must list all indexable pages
- Must be updated automatically when content changes
- Must include `<lastmod>` timestamp for each URL
- Must respect 50,000 URL limit per sitemap file
- If more than 50,000 URLs, use sitemap index file

**Sitemap Structure:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://storagecompare.ae/</loc>
    <lastmod>2025-12-16</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://storagecompare.ae/city/moscow</loc>
    <lastmod>2025-12-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://storagecompare.ae/warehouse/skladok-vykhino</loc>
    <lastmod>2025-12-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

**Sitemap Generation:**

- Sitemaps should be generated automatically by backend or frontend build process
- Generation should occur on content updates (warehouse published, new city added)
- Sitemaps should be cached and regenerated periodically (e.g., daily)

## 7.3. Noindex Rules

**Pages that MUST have noindex:**

- User profile pages (`/profile/*`)
- Operator dashboard pages (`/operator/*`)
- Admin pages (`/admin/*`)
- Login/register pages (`/login`, `/register`)
- Filtered catalog pages with query parameters (see Section 4.4)
- Draft warehouse pages (status = 'draft')

**Implementation:**

```html
<meta name="robots" content="noindex, nofollow" />
```

## 7.4. Redirects

**Redirect Types:**

| Scenario | Redirect Type | Example |
|----------|---------------|---------|
| Warehouse deleted | 301 Permanent | `/warehouse/old-slug` → `/warehouses` (catalog) |
| Warehouse slug changed | 301 Permanent | `/warehouse/old-slug` → `/warehouse/new-slug` |
| HTTP to HTTPS | 301 Permanent | `http://storagecompare.ae` → `https://storagecompare.ae` |
| Trailing slash normalization | 301 Permanent | `/warehouses/` → `/warehouses` |
| Temporary downtime | 503 Service Unavailable | (with Retry-After header) |

**Redirect Implementation:**

- Redirects should be implemented at the Nginx level where possible (per DOC-046)
- Application-level redirects (Next.js) for dynamic content (warehouse slug changes)
- Maintain redirect chain tracking to avoid redirect loops

## 7.5. HTTP Status Handling

**Status Codes for SEO:**

| Status | Scenario | SEO Impact |
|--------|----------|------------|
| **200 OK** | Valid page | Indexable |
| **301 Moved Permanently** | Content permanently moved | Transfers ranking signals |
| **302 Found** | Temporary redirect | Does not transfer ranking signals |
| **404 Not Found** | Page does not exist | Removes from index (if persistent) |
| **410 Gone** | Page intentionally removed | Faster removal from index |
| **500 Internal Server Error** | Server error | Temporary; retried by crawler |
| **503 Service Unavailable** | Maintenance mode | Temporary; retried by crawler |

**404 Page Requirements:**

- Must have user-friendly message
- Must include internal links to homepage, catalog
- Should suggest alternative pages (similar warehouses, popular cities)
- Must NOT return 200 status (must be genuine 404)

---

# 8. Performance & SEO

## 8.1. Core Web Vitals (Conceptual)

**Principle:** Page performance impacts SEO rankings (Google Core Web Vitals).

**Metrics (Reference):**

- **LCP (Largest Contentful Paint):** < 2.5s (good)
- **FID (First Input Delay):** < 100ms (good)
- **CLS (Cumulative Layout Shift):** < 0.1 (good)

**MVP Approach:**

- Monitor Core Web Vitals via DOC-057 (Monitoring Plan)
- Aim for "good" thresholds but do not block launch on performance alone
- Post-MVP: Optimize based on real user data

**Implementation:**

- Use Next.js Image component for automatic image optimization (per DOC-046)
- Implement lazy loading for below-the-fold images
- Minimize JavaScript bundle size
- Use CDN for static assets (Cloudflare per DOC-046)

## 8.2. Lazy Loading (Principle-Level)

**Requirement:** Images and non-critical content should be lazy-loaded to improve initial page load.

**Implementation Principle:**

- Use `loading="lazy"` attribute on images below the fold
- Critical images (hero images, main warehouse photo) should NOT be lazy-loaded
- Lazy loading should not prevent content from being indexed (ensure server-rendered content is present)

**Example:**

```html
<!-- Critical image (above fold) -->
<img src="/hero.jpg" alt="Hero image" loading="eager" />

<!-- Non-critical image (below fold) -->
<img src="/warehouse-photo.jpg" alt="Warehouse photo" loading="lazy" />
```

## 8.3. SSR / Hydration Assumptions

**Reference:** DOC-046 (Frontend Architecture Specification)

**SEO Requirements:**

- Public pages (home, catalog, warehouse details) MUST be server-rendered (SSR) or statically generated (ISR)
- Content critical for SEO (titles, headings, main text, links) must be present in initial HTML (not client-side rendered)
- Hydration should not cause significant layout shifts (impacts CLS)

**Next.js Rendering Strategy (per DOC-046):**

- **Homepage:** SSR
- **City Pages:** SSR or ISR (if city list is static, pre-generate)
- **Warehouse Pages:** ISR (Incremental Static Regeneration) with revalidation
- **Catalog Pages:** SSR (dynamic based on filters)
- **User Dashboard:** CSR (Client-Side Rendering, not SEO-critical)

---

# 9. International & Regional SEO (MVP-Light)

## 9.1. Language Handling

**MVP Limitation:** MVP v1 supports Russian language ONLY.

**HTML Lang Attribute:**

```html
<html lang="ru">
```

**Future Consideration:** Multi-language support (English, other CIS languages) is post-MVP.

## 9.2. Region-Based Pages

**City Pages:** As defined in Section 3.2, city pages provide regional targeting.

**Geo-Targeting:**

- Use `hreflang` tags if multi-language support is added (post-MVP)
- City pages should target local search queries (e.g., "аренда бокса в Москве")

## 9.3. What is NOT Supported in MVP

**Explicitly Out of Scope for MVP v1:**

- Multi-language support (`hreflang` tags)
- International domains (`.com`, `.uk`, etc.)
- Currency conversion for international users
- Region-specific content beyond city pages
- Geo-IP based redirects

---

# 10. Relationship to Canonical Documents

This document aligns with and depends on the following canonical documents:

## 10.1. DOC-046 — Frontend Architecture Specification

**Relationship:** This document defines WHAT SEO requirements exist. DOC-046 defines HOW to implement them technically.

**Integration Points:**

- Rendering strategy (SSR, ISR, CSR) for different page types
- Next.js configuration for meta tags and structured data
- Image optimization using Next.js Image component
- Routing and URL generation

**Alignment:**

- All page types in Section 3 match the pages defined in DOC-046
- Rendering strategies (SSR/ISR) reference DOC-046 decisions

## 10.2. DOC-049 — Frontend SEO Strategy (Legacy)

**Relationship:** If DOC-049 exists, this document (DOC-081) supersedes it as the canonical SEO strategy.

**Migration:**

- Any conflicting guidance in DOC-049 is overridden by DOC-081
- DOC-049 may be deprecated or archived

## 10.3. DOC-070 — Monetization Strategy

**Relationship:** SEO strategy does NOT conflict with monetization.

**Integration:**

- Premium operator listings (if implemented) must still follow SEO best practices
- Paid ads or sponsored content must be marked appropriately (not covered in this document)
- SEO pages must not be blocked by paywalls

## 10.4. DOC-078 — Security & Compliance Plan

**Relationship:** SEO implementation must respect security and privacy requirements.

**Integration:**

- robots.txt must block admin/operator pages (security)
- User-generated content (reviews) must not expose PII in structured data
- Meta tags must not include sensitive information

## 10.5. DOC-015 — API Design Blueprint

**Relationship:** Backend APIs provide data for SEO-optimized pages.

**Integration:**

- Warehouse data (`GET /api/v1/warehouses/{id}`) populates warehouse pages
- City data populates city pages
- API responses must include all fields needed for meta tags and structured data

## 10.6. DOC-050 — Database Specification

**Relationship:** Database schema provides the content for SEO pages.

**Integration:**

- `warehouses` table provides warehouse details
- `warehouses.slug` field (if present) provides URL slugs
- `warehouses.description` provides content for meta descriptions
- `reviews` table provides aggregate rating data for structured data

## 10.7. DOC-001 — Functional Specification

**Relationship:** SEO strategy supports the business requirements defined in the functional spec.

**Integration:**

- Page types in Section 3 match the user flows in DOC-001
- Content requirements align with the platform's value proposition

---

# 11. Non-Goals

This document explicitly does NOT address:

## 11.1. Not Traffic Growth

- No traffic volume targets (e.g., "10,000 visits/month")
- No conversion rate targets
- No user acquisition KPIs

## 11.2. Not SEO Experiments

- No A/B testing of meta tags or content
- No ranking factor experiments
- No "growth hacks" or black-hat SEO techniques

## 11.3. Not Backlink Strategy

- No link building campaigns
- No outreach to other websites
- No directory submissions or external SEO

## 11.4. Not AI Content Generation

- This document does not define AI-generated content for SEO pages
- Operator-provided content is the primary source (Section 6.3)
- AI content generation is post-MVP (if considered)

## 11.5. Not Comprehensive Content Strategy

- No editorial calendar
- No blog post guidelines
- No content marketing playbook

## 11.6. Not Advanced SEO Features

**Post-MVP Features (Deferred):**

- Dynamic rendering for JavaScript-heavy pages
- Advanced schema types (Event, Offer, etc.)
- Video schema markup
- Breadcrumb list schema (unless simple implementation)
- Mobile-first indexing optimizations beyond responsive design
- Progressive Web App (PWA) SEO considerations

---

# 12. Implementation Checklist

## 12.1. Frontend Team Checklist

- [ ] Implement SSR/ISR per DOC-046 for public pages
- [ ] Add meta tags (title, description) for all page types
- [ ] Generate unique titles and descriptions per Section 5.1 and 5.2
- [ ] Implement H1/H2 hierarchy per Section 5.3
- [ ] Add schema.org structured data per Section 5.4
- [ ] Generate slugs per Section 4.2
- [ ] Implement canonical URL tags
- [ ] Add `rel="prev"` and `rel="next"` for pagination
- [ ] Add `noindex` to filtered pages and private pages
- [ ] Generate sitemap.xml per Section 7.2
- [ ] Create robots.txt per Section 7.1
- [ ] Implement 404 page per Section 7.5
- [ ] Optimize images using Next.js Image component
- [ ] Implement lazy loading for below-the-fold images

## 12.2. Backend Team Checklist

- [ ] Ensure all public API endpoints return data needed for meta tags
- [ ] Implement slug generation and storage in database
- [ ] Provide aggregate rating data for warehouse pages
- [ ] Ensure warehouse descriptions are unique and non-empty
- [ ] Implement redirect logic for slug changes (301 redirects)
- [ ] Return correct HTTP status codes (200, 404, 500, etc.)
- [ ] Support sitemap.xml generation (or provide data to frontend)

## 12.3. DevOps Team Checklist

- [ ] Configure Nginx to serve robots.txt and sitemap.xml
- [ ] Implement HTTP to HTTPS redirects (301)
- [ ] Configure CDN (Cloudflare) for static assets per DOC-046
- [ ] Ensure server response times are within acceptable limits (monitored via DOC-057)
- [ ] Configure 404 and 500 error pages

## 12.4. QA Team Checklist

- [ ] Verify meta tags are unique for each page type
- [ ] Verify H1 tags are unique and present on all pages
- [ ] Verify structured data validates using Google's Structured Data Testing Tool
- [ ] Verify canonical URLs are correctly set
- [ ] Verify robots.txt blocks private pages
- [ ] Verify sitemap.xml includes all public pages
- [ ] Verify 404 pages return correct status code
- [ ] Verify page load performance meets Core Web Vitals targets (advisory)

---

# 13. Monitoring and Validation

## 13.1. SEO Health Metrics

The following metrics should be monitored (via DOC-057):

- **Crawl Errors:** Track 404, 500 errors in Google Search Console
- **Index Coverage:** Track number of indexed pages vs. submitted pages in sitemap
- **Core Web Vitals:** Track LCP, FID, CLS for public pages
- **Structured Data Errors:** Track schema.org validation errors in Google Search Console

## 13.2. Tools for Validation

- **Google Search Console:** Primary tool for crawl errors, index coverage, structured data
- **Lighthouse:** Automated testing for Core Web Vitals and SEO basics
- **Screaming Frog / Sitebulb:** Crawl the site to validate meta tags, canonical URLs, sitemaps

## 13.3. Post-Launch Validation

After MVP launch, the following validations should be performed:

1. Submit sitemap.xml to Google Search Console
2. Verify homepage, city pages, and warehouse pages are indexed
3. Monitor for crawl errors and fix within 48 hours
4. Validate structured data using Google Rich Results Test
5. Monitor Core Web Vitals and address major issues in post-MVP sprints

---

# 14. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Technical Documentation Engine | Initial CANONICAL version |

---

**END OF DOCUMENT**
