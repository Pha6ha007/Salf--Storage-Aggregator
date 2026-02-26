# DOC-100: Caching Strategy & CDN Specification (MVP v1)

**Document Status:** 🟢 GREEN (Canonical)  
**Version:** 1.0  
**Last Updated:** 2025-12-16  
**Owner:** Infrastructure Team  
**Codegen-Ready:** ✅ YES

---

## Document Control

| Property | Value |
|----------|-------|
| **Project** | Self-Storage Aggregator Platform |
| **Phase** | MVP v1 |
| **Classification** | Technical Specification - Infrastructure |
| **Depends On** | DOC-016 (API), DOC-055 (Logging), DOC-057 (Monitoring), DOC-078 (Security), DOC-017 (Rate Limiting), DOC-081 (SEO) |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Context](#2-system-context)
3. [Cacheable Surfaces (MVP)](#3-cacheable-surfaces-mvp)
4. [Caching Rules & Headers](#4-caching-rules--headers)
5. [Cache Key Strategy](#5-cache-key-strategy)
6. [Invalidation Strategy](#6-invalidation-strategy)
7. [Handling Freshness-Critical Data](#7-handling-freshness-critical-data)
8. [CDN Security & Abuse Protection](#8-cdn-security--abuse-protection)
9. [Observability & Metrics](#9-observability--metrics)
10. [Rollout Plan (MVP)](#10-rollout-plan-mvp)
11. [Relationship to Canonical Documents](#11-relationship-to-canonical-documents)
12. [Non-Goals](#12-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document defines the **canonical caching strategy and CDN configuration** for the Self-Storage Aggregator platform MVP v1. It specifies:

- What content is cacheable and at which layers
- Cache duration (TTL) for each content type
- Cache key construction and normalization
- Invalidation triggers and strategies
- Security protections against cache poisoning
- Observability requirements for cache performance

**Goals:**
1. **Accelerate public catalog/map/SEO pages** - Improve user experience through faster page loads
2. **Reduce API and database load** - Lower infrastructure costs and improve scalability
3. **Maintain data freshness** - Ensure availability and pricing data remains accurate
4. **Protect security and privacy** - Prevent caching of PII and authenticated content
5. **Enable monitoring** - Provide visibility into cache performance

## 1.2. Scope (MVP v1)

**In Scope:**
- CDN layer configuration (Cloudflare or similar)
- Browser caching directives
- Redis application cache strategy
- Public API response caching
- Static asset versioning
- ISR (Incremental Static Regeneration) pages
- Cache invalidation patterns

**Out of Scope:**
- Specific CDN provider selection (implementation-agnostic where possible)
- Performance benchmarking results
- Capacity planning details
- Database query caching (covered in Technical Architecture)
- v2 advanced caching features

## 1.3. Definitions

| Term | Definition |
|------|------------|
| **CDN** | Content Delivery Network - distributed edge servers for content caching |
| **Edge Cache** | Cache at CDN edge locations (geographically distributed) |
| **Origin** | Source server (Backend API or Next.js frontend) |
| **Cache Key** | Unique identifier for cached content (URL + normalized parameters) |
| **Surrogate Key** | Group identifier for invalidating multiple cache entries |
| **TTL** | Time To Live - duration before cache entry expires |
| **Stale-While-Revalidate** | Serve stale content while fetching fresh content in background |
| **Cache Poisoning** | Attack where malicious content is injected into cache |
| **Cache Hit Ratio** | Percentage of requests served from cache vs. origin |

---

# 2. System Context

## 2.1. What We Cache

The platform caches content at three layers:

```
┌────────────────────────────────────────────────────────────┐
│                        Users/Browsers                      │
└─────────────────────────┬──────────────────────────────────┘
                          │
                ┌─────────▼──────────┐
                │   Browser Cache    │  ← Layer 1: Client-side
                └─────────┬──────────┘
                          │
                ┌─────────▼──────────┐
                │    CDN Edge        │  ← Layer 2: Edge cache
                │   (Cloudflare)     │
                └─────────┬──────────┘
                          │
        ┌─────────────────┴────────────────────┐
        │                                      │
┌───────▼────────┐                  ┌─────────▼────────┐
│  Next.js App   │                  │  Backend API     │
│  (SSR/ISR)     │                  │  (NestJS)        │
└───────┬────────┘                  └─────────┬────────┘
        │                                     │
        │           ┌─────────────────────────┘
        │           │
┌───────▼───────────▼─────┐
│    Redis Cache          │  ← Layer 3: Application cache
│  (5min - 30days)        │
└─────────────────────────┘
```

**Content Categories:**
1. **Static Assets** (JS, CSS, fonts, images)
2. **Public SEO Pages** (home, catalog, warehouse details)
3. **Public API Responses** (search results, warehouse/box data)
4. **Authenticated Content** (user profiles, bookings, operator dashboards)

## 2.2. Where We Cache

| Layer | Location | Technology | Purpose |
|-------|----------|------------|---------|
| **Browser** | User device | HTTP headers | Reduce network requests |
| **CDN Edge** | Cloudflare PoPs | Edge cache | Geographic distribution, DDoS protection |
| **Application** | Redis | In-memory KV store | API response caching, session storage |

## 2.3. What We NEVER Cache

**CRITICAL - SECURITY REQUIREMENT:**

The following content types **MUST NEVER** be cached at CDN or browser level:

1. **PII (Personally Identifiable Information)**
   - User profiles (`/api/v1/users/me`)
   - Booking details with contact info
   - Email addresses, phone numbers
   - User-specific data

2. **Authentication & Authorization**
   - JWT tokens (httpOnly cookies only)
   - Login/logout endpoints
   - Password reset flows
   - Session data

3. **Operator & Admin Areas**
   - Operator dashboards (`/operator/*`)
   - Admin panels (`/admin/*`)
   - CRM data
   - Analytics

4. **State-Changing Operations**
   - POST, PUT, PATCH, DELETE requests
   - Booking creation
   - Payment processing (future)

**Reference:** See Security & Compliance Plan (DOC-078) §4.2 for PII classification.

---

# 3. Cacheable Surfaces (MVP)

## 3.1. Static Assets

### 3.1.1. JavaScript & CSS Bundles

**Content:**
- Next.js bundled JavaScript (`/_next/static/chunks/*.js`)
- CSS stylesheets (`/_next/static/css/*.css`)
- Webpack chunks

**Versioning Strategy:**
- Next.js automatic content hashing: `main.a1b2c3d4.js`
- Immutable files (hash changes on content change)

**Cache Headers:**
```http
Cache-Control: public, max-age=31536000, immutable
```

**TTL:** 1 year (365 days)

**Reasoning:** Content-hashed filenames ensure cache safety. Old versions naturally expire as users upgrade.

### 3.1.2. Fonts & Icons

**Content:**
- Web fonts (`.woff2`, `.woff`, `.ttf`)
- Icon files (`.svg` static icons)

**Cache Headers:**
```http
Cache-Control: public, max-age=31536000, immutable
```

**TTL:** 1 year

**Reasoning:** Font files rarely change. Long TTL reduces bandwidth.

### 3.1.3. Images

**Content:**
- Warehouse photos
- UI images
- User-uploaded images (operator photos)

**Image Optimization:**
- Next.js Image component handles optimization
- Multiple sizes generated automatically
- WebP format with fallbacks
- Lazy loading for below-fold images

**Cache Headers:**
```http
Cache-Control: public, max-age=86400, stale-while-revalidate=3600
```

**TTL:** 1 day (with 1-hour stale-while-revalidate)

**Reasoning:** Warehouse photos change occasionally. Shorter TTL than code assets, but stale-while-revalidate provides smooth updates.

**CDN Configuration:**
- Strip query parameters except width/quality
- Normalize size parameters
- Cache miss: forward to Next.js Image API

---

## 3.2. Public SEO Pages

### 3.2.1. Static Marketing Pages

**Pages:**
- Home page (`/`)
- About (`/about`)
- Contact (`/contact`)
- FAQ (`/faq`)
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)

**Rendering:** Static Site Generation (SSG) or Server-Side Rendering (SSR)

**Cache Headers:**
```http
Cache-Control: public, s-maxage=3600, stale-while-revalidate=1800
```

**TTL:** 
- CDN: 1 hour
- Browser: No explicit cache (rely on CDN)

**Reasoning:** Content changes infrequently. Aggressive CDN caching with stale-while-revalidate for smooth updates.

### 3.2.2. Catalog & Search Pages

**Pages:**
- Warehouse catalog (`/catalog`)
- Map view (`/map`)

**Rendering:** Server-Side Rendering (SSR) with aggressive CDN caching

**Cache Headers:**
```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=60
```

**TTL:**
- CDN: 5 minutes
- Browser: No cache (dynamic filters)

**Reasoning:** Search results change frequently (new bookings affect availability). Short TTL with quick revalidation.

**Cache Key Considerations:**
- Include normalized query parameters in cache key
- Normalize: location, price_min, price_max, size filters
- Example: `catalog?lat=55.7558&lon=37.6173&price_max=6000&size=M,L`

### 3.2.3. Warehouse Detail Pages

**Pages:**
- Warehouse details (`/warehouse/[id]`)

**Rendering:** Incremental Static Regeneration (ISR)

**ISR Configuration:**
```typescript
// pages/warehouse/[id].tsx
export async function getStaticProps({ params }) {
  return {
    props: { warehouse },
    revalidate: 600, // 10 minutes
  };
}
```

**Cache Headers:**
```http
Cache-Control: public, s-maxage=600, stale-while-revalidate=300
```

**TTL:**
- ISR regeneration: 10 minutes
- CDN: 10 minutes
- Browser: No cache

**Reasoning:** Warehouse details (name, address, photos) change rarely, but box availability changes with bookings. ISR provides fast pages with reasonable freshness.

**Invalidation Trigger:**
- Operator updates warehouse info → Invalidate specific page
- See §6 (Invalidation Strategy)

**Reference:** See SEO Strategy (DOC-081) for canonical URL requirements.

---

## 3.3. Public API Endpoints (Read-Heavy)

### 3.3.1. Warehouse Search Results

**Endpoint:** `GET /api/v1/warehouses`

**Cacheability:** YES (with considerations)

**Cache Location:** Redis application cache

**Cache Key:**
```
cache:search:{lat}:{lon}:{radius}:{price_min}:{price_max}:{size}:{sort}:{order}:{page}:{per_page}
```

**Cache Headers (API Response):**
```http
Cache-Control: public, max-age=300
Vary: Accept-Encoding
X-Cache-Status: HIT
```

**TTL:** 5 minutes

**Reasoning:** 
- Search queries expensive (geospatial + filters)
- Results change moderately (new bookings)
- Acceptable stale window: 5 minutes
- Redis caching reduces database load

**Invalidation:**
- Time-based (5-minute expiration)
- Manual invalidation on warehouse status change

**Example Implementation:**
```typescript
// Simplified example
async searchWarehouses(filters: SearchDto): Promise<Warehouse[]> {
  const cacheKey = this.buildCacheKey(filters);
  
  // Try cache
  const cached = await this.redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - query database
  const results = await this.warehouseRepository.search(filters);
  
  // Store in cache
  await this.redis.setex(cacheKey, 300, JSON.stringify(results));
  
  return results;
}
```

### 3.3.2. Warehouse Detail

**Endpoint:** `GET /api/v1/warehouses/{id}`

**Cacheability:** YES

**Cache Location:** Redis application cache

**Cache Key:**
```
cache:warehouse:{id}
```

**Cache Headers (API Response):**
```http
Cache-Control: public, max-age=600
ETag: "a1b2c3d4e5f6"
Vary: Accept-Encoding
```

**TTL:** 10 minutes

**Reasoning:**
- Warehouse metadata (name, address, photos) rarely changes
- Box availability embedded in response changes more frequently
- Compromise: 10-minute TTL

**Conditional Requests:**
- Support `If-None-Match` with ETag
- Return `304 Not Modified` if unchanged
- Reduces bandwidth

### 3.3.3. Box Listings

**Endpoint:** `GET /api/v1/warehouses/{warehouse_id}/boxes`

**Cacheability:** YES (with short TTL)

**Cache Location:** Redis application cache

**Cache Key:**
```
cache:boxes:warehouse:{warehouse_id}:{size_filter}:{available_only}
```

**Cache Headers (API Response):**
```http
Cache-Control: public, max-age=120
Vary: Accept-Encoding
```

**TTL:** 2 minutes

**Reasoning:**
- Box availability changes with bookings
- Short TTL ensures reasonable freshness
- Still reduces load on frequent page refreshes

**Invalidation:**
- Time-based (2-minute expiration)
- Event-based: booking created/cancelled → invalidate warehouse boxes

### 3.3.4. Map Bounds Query

**Endpoint:** `GET /api/v1/warehouses/map`

**Cacheability:** YES

**Cache Location:** Redis application cache

**Cache Key:**
```
cache:map:{north}:{south}:{east}:{west}:{zoom_level}
```

**Cache Headers (API Response):**
```http
Cache-Control: public, max-age=300
Vary: Accept-Encoding
```

**TTL:** 5 minutes

**Reasoning:**
- Geospatial queries are expensive
- Map viewport changes frequently as user pans
- Cache common viewport queries

---

## 3.4. Operator / User Authenticated Areas

**CRITICAL SECURITY RULE:**

All authenticated endpoints **MUST** return:

```http
Cache-Control: private, no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

**Affected Endpoints:**
- `/api/v1/users/me` (user profile)
- `/api/v1/bookings` (user bookings)
- `/api/v1/bookings/{id}` (booking details)
- `/api/v1/operator/*` (all operator endpoints)
- `/api/v1/admin/*` (all admin endpoints)
- `/api/v1/auth/*` (authentication flows)

**Reasoning:**
- Contains PII and sensitive data
- Must not be cached by CDN or proxy
- Must not be cached in browser beyond session

**Exceptions:** NONE

**Reference:** Security & Compliance Plan (DOC-078) §4.1 (PII Protection).

---

## 3.5. API Write Operations

**All state-changing operations:**
- `POST`, `PUT`, `PATCH`, `DELETE` methods
- Booking creation
- Review submission
- Warehouse updates

**Cache Headers:**
```http
Cache-Control: no-store, no-cache, must-revalidate
```

**Reasoning:** State changes must never be cached.

---

# 4. Caching Rules & Headers

## 4.1. Cache-Control Directives

### 4.1.1. Public vs Private

| Directive | Meaning | When to Use |
|-----------|---------|-------------|
| `public` | Can be cached by CDN, proxy, browser | Public content (warehouses, catalog) |
| `private` | Only browser can cache | User-specific authenticated content |
| `no-cache` | Must revalidate before use | - |
| `no-store` | Must not be cached anywhere | PII, auth tokens, sensitive data |

### 4.1.2. TTL Directives

| Directive | Meaning | Example |
|-----------|---------|---------|
| `max-age=N` | Browser & CDN TTL (seconds) | `max-age=3600` (1 hour) |
| `s-maxage=N` | CDN TTL only (overrides max-age for shared caches) | `s-maxage=600` (10 min) |
| `immutable` | Content never changes (even on refresh) | For hashed assets |

### 4.1.3. Revalidation Directives

| Directive | Meaning | Use Case |
|-----------|---------|----------|
| `stale-while-revalidate=N` | Serve stale content while fetching fresh | `stale-while-revalidate=60` |
| `stale-if-error=N` | Serve stale on origin error | `stale-if-error=3600` |
| `must-revalidate` | Must check with origin when stale | Critical freshness |

## 4.2. Complete Cache Header Matrix

**MANDATORY REFERENCE TABLE:**

| Surface | Cache-Control | TTL | ETag | Last-Modified | Vary |
|---------|---------------|-----|------|---------------|------|
| **JS/CSS Bundles** | `public, max-age=31536000, immutable` | 1 year | ❌ | ❌ | ❌ |
| **Fonts** | `public, max-age=31536000, immutable` | 1 year | ❌ | ❌ | ❌ |
| **Images** | `public, max-age=86400, stale-while-revalidate=3600` | 1 day | ✅ | ✅ | `Accept-Encoding` |
| **Home Page** | `public, s-maxage=3600, stale-while-revalidate=1800` | 1 hour | ✅ | ❌ | `Accept-Encoding` |
| **Catalog Page** | `public, s-maxage=300, stale-while-revalidate=60` | 5 min | ✅ | ❌ | `Accept-Encoding` |
| **Warehouse Detail (ISR)** | `public, s-maxage=600, stale-while-revalidate=300` | 10 min | ✅ | ✅ | `Accept-Encoding` |
| **API: Search** | `public, max-age=300` | 5 min | ❌ | ❌ | `Accept-Encoding` |
| **API: Warehouse Detail** | `public, max-age=600` | 10 min | ✅ | ❌ | `Accept-Encoding` |
| **API: Boxes** | `public, max-age=120` | 2 min | ❌ | ❌ | `Accept-Encoding` |
| **API: Authenticated** | `private, no-store, no-cache, must-revalidate` | 0 | ❌ | ❌ | ❌ |
| **API: Write Ops** | `no-store, no-cache, must-revalidate` | 0 | ❌ | ❌ | ❌ |

**Notes:**
- `s-maxage` applies to CDN/shared caches only
- `max-age` applies to browser & CDN
- `Vary: Accept-Encoding` ensures correct compression handling
- ETags enable conditional requests (`If-None-Match`)

## 4.3. Example HTTP Response Headers

### Example 1: SEO Page (Catalog)

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: public, s-maxage=300, stale-while-revalidate=60
Vary: Accept-Encoding
ETag: "a1b2c3d4e5f6"
X-Request-ID: req_abc123
X-Cache-Status: HIT
Date: Tue, 16 Dec 2025 10:00:00 GMT
Age: 45

<!DOCTYPE html>
<html>...</html>
```

### Example 2: API Search Response

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300
Vary: Accept-Encoding
X-Request-ID: req_xyz789
X-Cache-Status: MISS
Date: Tue, 16 Dec 2025 10:00:00 GMT

{
  "success": true,
  "data": [...]
}
```

### Example 3: Authenticated User Profile (NO CACHE)

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: private, no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict
X-Request-ID: req_user123

{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    ...
  }
}
```

---

# 5. Cache Key Strategy

## 5.1. Cache Key Components

A cache key uniquely identifies cached content. Components:

1. **Base path** - URL path or endpoint
2. **Query parameters** - Normalized and sorted
3. **Vary headers** - Language, device type (if applicable)
4. **Optional prefix** - Environment or version identifier

## 5.2. Query Parameter Normalization

**Problem:** Different parameter orders create duplicate cache entries.

```
/api/v1/warehouses?size=M&price_max=5000&lat=55.7558
/api/v1/warehouses?lat=55.7558&price_max=5000&size=M
```

These are identical queries but generate different cache keys if not normalized.

**Solution: Alphabetical Sorting**

```typescript
function buildCacheKey(path: string, params: Record<string, any>): string {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `cache:${path}?${sortedParams}`;
}

// Result:
// cache:/api/v1/warehouses?lat=55.7558&price_max=5000&size=M
```

## 5.3. Parameter Allowlisting

**Security Protection:** Only allow known parameters in cache key.

**Allowed Parameters (Warehouse Search):**
- `latitude`, `longitude`, `radius_km`
- `size`, `price_min`, `price_max`, `rating_min`
- `sort`, `order`, `page`, `per_page`

**Forbidden Parameters:**
- `debug`, `admin`, `token`, etc.
- Any parameter not in API specification

**Implementation:**
```typescript
const ALLOWED_PARAMS = [
  'latitude', 'longitude', 'radius_km',
  'size', 'price_min', 'price_max', 'rating_min',
  'sort', 'order', 'page', 'per_page'
];

function filterParams(params: Record<string, any>): Record<string, any> {
  return Object.keys(params)
    .filter(key => ALLOWED_PARAMS.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
}
```

## 5.4. Vary Header Usage

**Purpose:** Ensure correct cache entry based on request headers.

**Common Vary Headers:**

```http
Vary: Accept-Encoding
```

**Reasoning:** Gzipped and non-gzipped responses must be cached separately.

**Future Considerations (Post-MVP):**
- `Vary: Accept-Language` - For multi-language support
- `Vary: User-Agent` - For device-specific responses (rare)

**Warning:** Excessive Vary headers cause cache fragmentation. Use sparingly.

## 5.5. Preventing Cache Key Explosion

**Problem:** Too many unique cache keys exhaust cache memory.

**Mitigation Strategies:**

1. **Limit combinatorial parameters**
   - Example: Support only 4 box sizes (S, M, L, XL)
   - Don't allow arbitrary size values

2. **Round numeric parameters**
   - Example: Round `price_max` to nearest 500
   - `price_max=5432` → `5500`

3. **Cap pagination**
   - Example: Max 100 items per page
   - Reject `per_page > 100`

4. **Geolocation quantization**
   - Round lat/lon to 3 decimal places (~100m precision)
   - `lat=55.755821` → `55.756`

**Example Quantization:**
```typescript
function quantizeLocation(lat: number, lon: number): [number, number] {
  return [
    Math.round(lat * 1000) / 1000,
    Math.round(lon * 1000) / 1000
  ];
}

function quantizePrice(price: number): number {
  return Math.ceil(price / 500) * 500;
}
```

**Monitoring:**
- Track unique cache key count
- Alert if growth exceeds threshold (e.g., >10,000 keys)

---

# 6. Invalidation Strategy

## 6.1. Time-Based Expiration (TTL)

**Primary Mechanism:** All cache entries have TTL.

**TTL Values (Reference):**

| Content Type | TTL | Reasoning |
|--------------|-----|-----------|
| Static assets (hashed) | 1 year | Immutable |
| Images | 1 day | Occasional updates |
| SEO pages (home, about) | 1 hour | Rare updates |
| Catalog/search | 5 minutes | Moderate change rate |
| Warehouse details | 10 minutes | Balance freshness & load |
| Box availability | 2 minutes | Frequent updates (bookings) |

**Implementation:**
```typescript
await redis.setex(cacheKey, ttl, JSON.stringify(data));
```

## 6.2. Event-Based Invalidation

**Trigger Events:**

| Event | Invalidate |
|-------|-----------|
| **Warehouse created** | Search results cache |
| **Warehouse updated** | Warehouse detail cache, ISR page |
| **Warehouse deleted** | Search results cache, warehouse detail cache |
| **Box availability changed** | Box listing cache, warehouse detail cache |
| **Booking created** | Box listing cache (specific warehouse) |
| **Booking cancelled** | Box listing cache (specific warehouse) |
| **Review submitted** | Warehouse detail cache, ISR page |
| **Price updated** | Warehouse detail cache, search results |

**Example Implementation:**
```typescript
// When warehouse is updated
async updateWarehouse(id: string, data: UpdateDto): Promise<Warehouse> {
  const warehouse = await this.repository.update(id, data);
  
  // Invalidate caches
  await this.invalidateWarehouseCache(id);
  await this.invalidateSearchCache(); // All search results
  await this.revalidateISRPage(`/warehouse/${id}`); // Next.js ISR
  
  return warehouse;
}

private async invalidateWarehouseCache(id: string): Promise<void> {
  await this.redis.del(`cache:warehouse:${id}`);
  await this.redis.del(`cache:boxes:warehouse:${id}:*`); // Pattern delete
}
```

## 6.3. Surrogate Keys (CDN Invalidation)

**Concept:** Group-based invalidation using tags.

**Surrogate Key Examples:**
- `warehouse:101` - All cache entries for warehouse 101
- `search` - All search result pages
- `catalog` - Catalog pages

**HTTP Header:**
```http
Surrogate-Key: warehouse:101 search catalog
```

**Invalidation (via CDN API):**
```typescript
await cdnClient.purge({
  surrogateKeys: ['warehouse:101']
});
```

**Benefits:**
- Invalidate multiple related entries at once
- More efficient than individual URL purging

**CDN Support:**
- Cloudflare: `Cache-Tag` header
- Fastly: `Surrogate-Key` header
- AWS CloudFront: Tag-based invalidation

## 6.4. Safe Degradation with Stale Content

**Principle:** Serving slightly stale content is better than slow/failed requests.

**stale-while-revalidate:**
```http
Cache-Control: public, max-age=600, stale-while-revalidate=300
```

**Behavior:**
1. Content fresh for 10 minutes (max-age=600)
2. After 10 minutes: serve stale content immediately
3. Trigger background revalidation
4. Stale content acceptable for additional 5 minutes (stale-while-revalidate=300)
5. After 15 minutes total: must fetch fresh

**stale-if-error:**
```http
Cache-Control: public, max-age=600, stale-if-error=3600
```

**Behavior:**
- If origin returns error (5xx), serve stale content up to 1 hour old
- Prevents cascading failures

---

# 7. Handling Freshness-Critical Data

## 7.1. Identification of Critical Data

**Freshness-Critical:** Data where stale content causes business problems.

**Critical Data in MVP:**

1. **Box Availability**
   - **Problem:** Two users booking same box simultaneously
   - **Mitigation:** 2-minute TTL, event-based invalidation
   - **Acceptable Stale Window:** 2 minutes

2. **Warehouse Status (Active/Inactive)**
   - **Problem:** Showing inactive warehouse in catalog
   - **Mitigation:** 5-minute TTL, immediate invalidation on status change
   - **Acceptable Stale Window:** 5 minutes

3. **Pricing**
   - **Problem:** User sees old price, tries to book
   - **Mitigation:** 10-minute TTL, immediate invalidation on price change
   - **Acceptable Stale Window:** 10 minutes

**Non-Critical Data:**
- Warehouse photos (changes rare, no business impact)
- Reviews (new review taking 10 minutes to appear is acceptable)
- Warehouse description (changes rare)

## 7.2. Booking Flow & Cache Consistency

**Scenario:** User creates booking for box 101.

**Steps:**

1. User views warehouse detail page (cached, shows available_quantity=3)
2. User clicks "Book Now"
3. **Backend creates booking:**
   ```typescript
   async createBooking(data: BookingDto): Promise<Booking> {
     // 1. Begin transaction
     await this.db.$transaction(async (tx) => {
       // 2. Lock box row (SELECT FOR UPDATE)
       const box = await tx.box.findUnique({
         where: { id: data.box_id },
         lock: 'UPDATE'
       });
       
       // 3. Check availability (authoritative source)
       if (box.available_quantity < 1) {
         throw new BoxNotAvailableError();
       }
       
       // 4. Create booking
       const booking = await tx.booking.create({ data });
       
       // 5. Update box quantities
       await tx.box.update({
         where: { id: data.box_id },
         data: {
           available_quantity: { decrement: 1 },
           reserved_quantity: { increment: 1 }
         }
       });
       
       return booking;
     });
     
     // 6. Invalidate cache AFTER transaction commits
     await this.invalidateBoxCache(data.box_id);
     await this.invalidateWarehouseCache(data.warehouse_id);
     
     return booking;
   }
   ```

4. **Cache invalidation** ensures next request sees updated availability

**Race Condition Prevention:**
- Database-level locking (`SELECT FOR UPDATE`)
- Transaction ensures atomicity
- Cache invalidation happens AFTER commit

**Acceptable Stale Window:**
- Cached availability may be stale for up to 2 minutes
- Database is authoritative source during booking creation
- Cache invalidation triggers immediate refresh

## 7.3. Stale Content Tolerance Matrix

| Data Type | Max Stale Age | Business Impact if Stale | Mitigation |
|-----------|---------------|--------------------------|------------|
| **Box Availability** | 2 minutes | HIGH - Double booking risk | Short TTL, event invalidation, DB locking |
| **Pricing** | 10 minutes | MEDIUM - User confusion | Event invalidation on price change |
| **Warehouse Status** | 5 minutes | MEDIUM - Inactive shown | Event invalidation on status change |
| **Warehouse Description** | 1 hour | LOW - Content staleness | ISR revalidation |
| **Reviews** | 10 minutes | LOW - Delayed visibility | Time-based expiration |
| **Photos** | 1 day | MINIMAL - Aesthetic only | Long TTL acceptable |

---

# 8. CDN Security & Abuse Protection

## 8.1. Cache Poisoning Prevention

**Attack Vector:** Attacker injects malicious parameters to poison cache.

**Example Attack:**
```
GET /api/v1/warehouses?lat=55.7558&<script>alert('XSS')</script>
```

If this response is cached with malicious script, all users receive poisoned content.

**Mitigation Strategies:**

### 8.1.1. Query Parameter Allowlisting

**Implementation:**
```typescript
const ALLOWED_PARAMS = ['lat', 'lon', 'size', 'price_min', 'price_max'];

function sanitizeParams(params: any): Record<string, any> {
  return Object.keys(params)
    .filter(key => ALLOWED_PARAMS.includes(key))
    .reduce((acc, key) => {
      acc[key] = sanitizeValue(params[key]);
      return acc;
    }, {});
}

function sanitizeValue(value: any): any {
  // Type validation & sanitization
  if (typeof value === 'string') {
    return value.replace(/[<>'"]/g, ''); // Remove script-dangerous chars
  }
  return value;
}
```

### 8.1.2. Header Sanitization

**Dangerous Headers:**
- `X-Original-URL`
- `X-Rewrite-URL`
- Custom headers not in spec

**CDN Configuration:**
```nginx
# Nginx config - strip dangerous headers
proxy_set_header X-Original-URL "";
proxy_set_header X-Rewrite-URL "";
```

### 8.1.3. Cache Key Normalization

**Prevent cache fragmentation attacks:**

```typescript
// Normalize cache key
function normalizeCacheKey(url: string): string {
  const parsed = new URL(url);
  
  // Sort parameters
  const params = Array.from(parsed.searchParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  
  return `${parsed.pathname}?${params}`;
}
```

## 8.2. Rate Limiting Integration

**Problem:** Cached responses bypass API rate limiting.

**Solution:** Rate limiting at CDN edge (before cache).

**Implementation Order:**
1. **CDN edge:** Rate limit by IP (100 req/min for guests)
2. **CDN cache:** Serve cached response if available
3. **Origin:** Rate limit by user_id (authenticated users)

**Reference:** See API Rate Limiting Spec (DOC-017) for limits.

**Cache Behavior on Rate Limit:**
- Rate-limited requests return `429 Too Many Requests`
- `429` responses **MUST NOT** be cached
- Cache-Control: `no-store`

```http
HTTP/1.1 429 Too Many Requests
Cache-Control: no-store
Retry-After: 60
```

## 8.3. WAF Integration

**Web Application Firewall** at CDN edge.

**Rules:**
1. **SQL Injection Protection** - Block patterns in query strings
2. **XSS Protection** - Block script tags in parameters
3. **Directory Traversal** - Block `../` patterns
4. **Bot Protection** - Challenge suspicious traffic

**Cloudflare Example:**
- Enable "OWASP Core Rule Set"
- Block known bad User-Agents
- Challenge requests with high threat score

**Cache Interaction:**
- WAF blocks malicious requests before cache lookup
- Prevents cache poisoning at source

---

# 9. Observability & Metrics

## 9.1. Cache Hit Ratio Metrics

**Prometheus Metrics:**

```typescript
// Cache hit counter
const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_layer', 'content_type']
});

// Cache miss counter
const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_layer', 'content_type']
});

// Cache hit ratio (calculated)
const cacheHitRatio = new Gauge({
  name: 'cache_hit_ratio',
  help: 'Cache hit ratio percentage',
  labelNames: ['cache_layer', 'content_type']
});
```

**Labels:**
- `cache_layer`: `cdn`, `redis`, `browser`
- `content_type`: `static_asset`, `api_response`, `page`

**Target Metrics:**
- Static assets: >95% hit ratio
- API responses: >70% hit ratio
- SEO pages: >80% hit ratio

## 9.2. Origin Latency vs Cached

**Metrics:**

```typescript
// Origin response time
const originLatency = new Histogram({
  name: 'origin_response_seconds',
  help: 'Origin response time',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

// Cached response time
const cacheLatency = new Histogram({
  name: 'cache_response_seconds',
  help: 'Cache response time',
  labelNames: ['cache_layer'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.3]
});
```

**Goal:** Cache should be 10-100x faster than origin.

## 9.3. Cache Errors & 4xx/5xx Rates

**Metrics:**

```typescript
// Cache errors
const cacheErrors = new Counter({
  name: 'cache_errors_total',
  help: 'Cache operation errors',
  labelNames: ['operation', 'cache_layer']
});

// HTTP status by layer
const httpResponses = new Counter({
  name: 'http_responses_total',
  help: 'HTTP responses',
  labelNames: ['status', 'cache_layer']
});
```

**Alerting:**
- Cache error rate > 1% → WARNING
- 5xx rate from cache > 0.1% → CRITICAL (stale-if-error should prevent this)

## 9.4. CDN Logs & Correlation IDs

**Log Structure:**

```json
{
  "timestamp": "2025-12-16T10:00:00.000Z",
  "level": "info",
  "event": "cache_hit",
  "trace_id": "req_abc123",
  "cache_layer": "cdn",
  "request": {
    "method": "GET",
    "path": "/api/v1/warehouses",
    "query": "lat=55.7558&lon=37.6173",
    "ip": "203.0.113.42"
  },
  "cache_status": "HIT",
  "cache_age_seconds": 45,
  "response_time_ms": 12
}
```

**Correlation ID Propagation:**
- Frontend generates `X-Request-ID`
- CDN forwards to origin
- Origin includes in logs
- Enables end-to-end request tracing

**Reference:** See Logging Strategy (DOC-055) for log taxonomy.

## 9.5. Grafana Dashboards

**Dashboard: CDN & Caching Performance**

**Panels:**

1. **Cache Hit Ratio Over Time**
   - Query: `sum(rate(cache_hits_total[5m])) / (sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m])))`
   - Target: >80%

2. **Cache Hit Ratio by Layer**
   - Breakdown: CDN, Redis, Browser
   - Identify weak caching layers

3. **Origin Load Reduction**
   - Query: `sum(rate(cache_hits_total[5m]))`
   - Shows requests NOT hitting origin

4. **Cache Response Time (P95)**
   - Query: `histogram_quantile(0.95, cache_response_seconds_bucket)`
   - Target: <50ms (Redis), <100ms (CDN)

5. **Invalidation Events**
   - Query: `sum(rate(cache_invalidations_total[5m]))`
   - Monitor invalidation frequency

**Reference:** See Monitoring & Observability Plan (DOC-057).

---

# 10. Rollout Plan (MVP)

## 10.1. Phased Enablement

**Phase 1: Static Assets (Week 1)**
- Enable long TTL for JS/CSS/fonts
- Enable image caching with 1-day TTL
- Monitor cache hit ratio
- **Success Criteria:** >95% hit ratio for static assets

**Phase 2: SEO Pages (Week 2)**
- Enable ISR for warehouse details
- Enable CDN caching for home/catalog pages
- Monitor page load times
- **Success Criteria:** P95 page load <1s (from <2s baseline)

**Phase 3: API Response Caching (Week 3)**
- Enable Redis caching for search results (5-min TTL)
- Enable Redis caching for warehouse details (10-min TTL)
- Monitor API latency reduction
- **Success Criteria:** >70% cache hit ratio for API

**Phase 4: Advanced Invalidation (Week 4)**
- Implement event-based invalidation
- Add surrogate keys for group invalidation
- Monitor invalidation effectiveness
- **Success Criteria:** Stale content rate <1%

## 10.2. Safe Defaults

**Conservative Start:**
- TTLs 50% shorter initially
- `stale-while-revalidate` disabled initially
- No surrogate key invalidation until Phase 4

**Example Initial Headers:**
```http
Cache-Control: public, s-maxage=300
```

**After validation:**
```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=60
```

## 10.3. Rollback Triggers

**Automatic Rollback Conditions:**

1. **Cache hit ratio drops below 50%**
   - Action: Investigate cache key issues
   - Rollback: Temporarily disable caching

2. **Origin load increases (not decreases)**
   - Symptom: Cache not reducing load
   - Action: Check TTLs and invalidation frequency

3. **Stale content rate > 5%**
   - Symptom: Users seeing outdated data
   - Action: Reduce TTLs or improve invalidation

4. **Security incident (cache poisoning)**
   - Action: Immediate cache purge
   - Rollback: Disable caching until fixed

**Manual Rollback Process:**
```bash
# Purge all CDN cache
curl -X POST https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -d '{"purge_everything": true}'

# Disable Redis caching (feature flag)
redis-cli SET feature:cache_enabled false
```

## 10.4. Monitoring During Rollout

**Key Metrics to Watch:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Cache hit ratio | >80% | <60% |
| Origin load reduction | >50% | <30% |
| P95 API latency | <100ms | >300ms |
| Stale content rate | <1% | >5% |
| Cache error rate | <0.1% | >1% |

**Dashboards:**
- Real-time cache hit ratio
- Origin request rate (should decrease)
- Error rates by cache layer

---

# 11. Relationship to Canonical Documents

## 11.1. API Design Blueprint (DOC-016)

**Integration Points:**
- All cacheable endpoints defined in API spec
- HTTP methods (GET cacheable, POST not cacheable)
- Query parameters used in cache keys
- Response structure (pagination, metadata)

**Example Reference:**
```
GET /api/v1/warehouses
→ Cacheable: YES (5-minute TTL)
→ Cache key includes: lat, lon, radius, price filters
→ Response structure: { success, data[], pagination, meta }
```

## 11.2. Security & Compliance Plan (DOC-078)

**Integration Points:**
- PII must not be cached (§4.1)
- Cookie-based auth means no Authorization header in cache key
- CORS configuration affects Vary headers
- Rate limiting interacts with caching

**Critical Rules:**
- Authenticated endpoints: `Cache-Control: private, no-store`
- PII-containing responses: Never cached
- JWT tokens: Never cached (httpOnly cookies)

## 11.3. Rate Limiting Specification (DOC-017)

**Integration Points:**
- Rate limiting occurs before cache lookup
- Cached responses reduce rate limit consumption
- 429 responses must not be cached
- Different limits for guest/user/operator

**Cache Impact on Rate Limits:**
- Cache HIT → Does NOT count against rate limit
- Cache MISS → Counts against rate limit
- High cache hit ratio → Fewer rate limit violations

## 11.4. Logging Strategy (DOC-055)

**Integration Points:**
- Cache events logged with correlation IDs
- Cache hit/miss logged at INFO level
- Cache errors logged at ERROR level
- Invalidation events logged at INFO level

**Log Examples:**
```json
{
  "event": "cache_hit",
  "trace_id": "req_abc123",
  "cache_layer": "redis",
  "cache_key": "cache:warehouse:101"
}
```

## 11.5. Monitoring & Observability (DOC-057)

**Integration Points:**
- Cache metrics in Prometheus
- Grafana dashboards for cache performance
- Alerts on cache error rates
- Tracing includes cache layer information

**Metrics Alignment:**
- Cache latency → part of overall API latency (P95/P99)
- Origin load reduction → system capacity metrics

## 11.6. SEO Strategy (DOC-081)

**Integration Points:**
- ISR for warehouse detail pages
- Canonical URLs in cached responses
- Sitemap generation (cached 1 hour)
- Robots.txt (cached 1 day)

**Critical:**
- SEO pages must be crawlable (no authentication)
- Cache-Control must allow CDN caching
- Canonical URLs prevent duplicate content issues

**Reference:** Warehouse detail pages use ISR with 10-minute revalidation.

---

# 12. Non-Goals

**The following are explicitly OUT OF SCOPE for MVP v1:**

## 12.1. NOT in MVP

- ❌ **Multi-region CDN orchestration** - Single CDN provider (e.g., Cloudflare)
- ❌ **Advanced cache warming** - No proactive cache population
- ❌ **Predictive invalidation** - No ML-based cache strategies
- ❌ **Edge computing / Workers** - No code execution at CDN edge
- ❌ **Custom CDN logic** - Minimal custom rules
- ❌ **GraphQL caching** - REST API only in MVP
- ❌ **Real-time invalidation** - Event-based sufficient
- ❌ **A/B testing at cache layer** - No variant caching
- ❌ **Personalized caching** - All public content is uniform
- ❌ **Performance benchmarking SLA** - No contractual performance guarantees

## 12.2. Vendor-Specific Features

This specification is **vendor-agnostic** where possible:
- CDN provider not mandated (Cloudflare recommended)
- Generic HTTP caching standards used
- Redis implementation-independent

**Vendor Selection:** Implementation decision, not architectural requirement.

## 12.3. Post-MVP Optimizations

**Future v2 Features (not in MVP):**
- Edge Side Includes (ESI) for fragment caching
- Adaptive TTLs based on traffic patterns
- Cache sharding for very high traffic
- Smart purging based on dependency graphs
- Advanced bot detection at cache layer

---

# Appendices

## Appendix A: Cache Matrix (Complete Reference)

| Surface | Path/Endpoint | Method | Cache Layer | Cache-Control | TTL | Vary | ETag | Notes |
|---------|--------------|--------|-------------|---------------|-----|------|------|-------|
| **Static Assets** |
| JS bundles | `/_next/static/chunks/*.js` | GET | Browser, CDN | `public, max-age=31536000, immutable` | 1 year | - | ❌ | Content-hashed |
| CSS bundles | `/_next/static/css/*.css` | GET | Browser, CDN | `public, max-age=31536000, immutable` | 1 year | - | ❌ | Content-hashed |
| Fonts | `/fonts/*.woff2` | GET | Browser, CDN | `public, max-age=31536000, immutable` | 1 year | - | ❌ | - |
| Images | `/images/*`, CDN | GET | Browser, CDN | `public, max-age=86400, stale-while-revalidate=3600` | 1 day | `Accept-Encoding` | ✅ | Next.js Image API |
| **SEO Pages** |
| Home | `/` | GET | CDN | `public, s-maxage=3600, stale-while-revalidate=1800` | 1 hour | `Accept-Encoding` | ✅ | SSR/SSG |
| Catalog | `/catalog` | GET | CDN | `public, s-maxage=300, stale-while-revalidate=60` | 5 min | `Accept-Encoding` | ✅ | SSR |
| Map | `/map` | GET | CDN | `public, s-maxage=300, stale-while-revalidate=60` | 5 min | `Accept-Encoding` | ✅ | SSR |
| Warehouse Detail | `/warehouse/[id]` | GET | CDN | `public, s-maxage=600, stale-while-revalidate=300` | 10 min | `Accept-Encoding` | ✅ | ISR |
| About/FAQ | `/about`, `/faq` | GET | CDN | `public, s-maxage=3600, stale-while-revalidate=1800` | 1 hour | `Accept-Encoding` | ❌ | SSG |
| **Public API** |
| Search | `GET /api/v1/warehouses` | GET | Redis | `public, max-age=300` | 5 min | `Accept-Encoding` | ❌ | Query params in key |
| Warehouse Detail | `GET /api/v1/warehouses/{id}` | GET | Redis | `public, max-age=600` | 10 min | `Accept-Encoding` | ✅ | - |
| Boxes | `GET /api/v1/warehouses/{wh}/boxes` | GET | Redis | `public, max-age=120` | 2 min | `Accept-Encoding` | ❌ | Short TTL |
| Reviews | `GET /api/v1/warehouses/{id}/reviews` | GET | Redis | `public, max-age=600` | 10 min | `Accept-Encoding` | ❌ | - |
| **Authenticated** |
| User Profile | `GET /api/v1/users/me` | GET | None | `private, no-store, no-cache` | 0 | - | ❌ | PII |
| User Bookings | `GET /api/v1/bookings` | GET | None | `private, no-store, no-cache` | 0 | - | ❌ | PII |
| Booking Detail | `GET /api/v1/bookings/{id}` | GET | None | `private, no-store, no-cache` | 0 | - | ❌ | PII |
| **Operator** |
| Operator Dashboard | `GET /api/v1/operator/*` | GET | None | `private, no-store, no-cache` | 0 | - | ❌ | Sensitive |
| CRM Data | `GET /api/v1/operator/leads` | GET | None | `private, no-store, no-cache` | 0 | - | ❌ | Sensitive |
| **Write Operations** |
| Any | `POST/PUT/PATCH/DELETE` | Any | None | `no-store, no-cache` | 0 | - | ❌ | State-changing |

---

## Appendix B: Example HTTP Response Headers

### B.1. Static Asset (Hashed JS Bundle)

```http
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=utf-8
Content-Length: 123456
Cache-Control: public, max-age=31536000, immutable
ETag: "a1b2c3d4e5f6g7h8"
X-Content-Type-Options: nosniff
Age: 3600
X-Cache: HIT
Date: Tue, 16 Dec 2025 10:00:00 GMT

(function(){...})();
```

### B.2. Warehouse Search API (Cache MISS)

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300
Vary: Accept-Encoding
X-Request-ID: req_search_abc123
X-Cache-Status: MISS
X-Cache-TTL: 300
Date: Tue, 16 Dec 2025 10:00:00 GMT

{
  "success": true,
  "data": [...],
  "pagination": {...},
  "meta": {
    "request_id": "req_search_abc123",
    "timestamp": "2025-12-16T10:00:00Z"
  }
}
```

### B.3. Warehouse Search API (Cache HIT)

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300
Vary: Accept-Encoding
X-Request-ID: req_search_xyz789
X-Cache-Status: HIT
X-Cache-Age: 120
Age: 120
Date: Tue, 16 Dec 2025 10:00:00 GMT

{
  "success": true,
  "data": [...],
  "pagination": {...},
  "meta": {
    "request_id": "req_search_abc123",
    "timestamp": "2025-12-16T09:58:00Z"
  }
}
```

**Note:** Original request_id preserved in meta, showing cached response.

---

## Appendix C: Redis Cache Implementation Examples

### C.1. Search Results Caching

```typescript
// services/warehouse-cache.service.ts
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SearchWarehousesDto } from './dto/search-warehouses.dto';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseCacheService {
  constructor(private readonly redis: Redis) {}

  private buildSearchCacheKey(filters: SearchWarehousesDto): string {
    // Normalize and sort parameters
    const params = {
      lat: filters.latitude?.toFixed(3), // Quantize location
      lon: filters.longitude?.toFixed(3),
      radius: filters.radius_km || 10,
      size: filters.size?.sort().join(','),
      price_min: filters.price_min || 0,
      price_max: filters.price_max || 999999,
      sort: filters.sort || 'distance',
      order: filters.order || 'asc',
      page: filters.page || 1,
      per_page: filters.per_page || 12
    };

    const keyParts = Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    return `cache:search:${keyParts}`;
  }

  async getCachedSearch(
    filters: SearchWarehousesDto
  ): Promise<Warehouse[] | null> {
    const key = this.buildSearchCacheKey(filters);
    const cached = await this.redis.get(key);
    
    if (cached) {
      this.metricsService.incrementCacheHit('search');
      return JSON.parse(cached);
    }
    
    this.metricsService.incrementCacheMiss('search');
    return null;
  }

  async setCachedSearch(
    filters: SearchWarehousesDto,
    results: Warehouse[],
    ttl: number = 300 // 5 minutes
  ): Promise<void> {
    const key = this.buildSearchCacheKey(filters);
    await this.redis.setex(key, ttl, JSON.stringify(results));
  }

  async invalidateSearchCache(): Promise<void> {
    // Pattern-based deletion
    const pattern = 'cache:search:*';
    const stream = this.redis.scanStream({ match: pattern });
    
    for await (const keys of stream) {
      if (keys.length) {
        await this.redis.del(...keys);
      }
    }
    
    this.logger.log('Search cache invalidated');
  }
}
```

### C.2. Warehouse Detail Caching with ETag

```typescript
// controllers/warehouses.controller.ts
import { Controller, Get, Param, Headers, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/v1/warehouses')
export class WarehousesController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly cacheService: WarehouseCacheService
  ) {}

  @Get(':id')
  async getWarehouse(
    @Param('id') id: string,
    @Headers('if-none-match') ifNoneMatch: string,
    @Res() res: Response
  ) {
    // Try cache first
    const cached = await this.cacheService.getCachedWarehouse(id);
    
    if (cached) {
      const etag = this.generateETag(cached);
      
      // Check If-None-Match
      if (ifNoneMatch === etag) {
        return res.status(304).send(); // Not Modified
      }
      
      return res
        .set({
          'Cache-Control': 'public, max-age=600',
          'ETag': etag,
          'X-Cache-Status': 'HIT'
        })
        .json({
          success: true,
          data: cached
        });
    }
    
    // Cache miss - fetch from DB
    const warehouse = await this.warehouseService.findById(id);
    
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    
    // Cache result
    await this.cacheService.setCachedWarehouse(id, warehouse, 600);
    
    const etag = this.generateETag(warehouse);
    
    return res
      .set({
        'Cache-Control': 'public, max-age=600',
        'ETag': etag,
        'X-Cache-Status': 'MISS'
      })
      .json({
        success: true,
        data: warehouse
      });
  }

  private generateETag(data: any): string {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    return `"${hash}"`;
  }
}
```

---

## Appendix D: CDN Configuration Examples

### D.1. Cloudflare Page Rules

```yaml
# Cloudflare Page Rules Configuration
page_rules:
  - pattern: "storagecompare.ae/_next/static/*"
    settings:
      cache_level: "cache_everything"
      edge_cache_ttl: 31536000
      browser_cache_ttl: 31536000
      
  - pattern: "storagecompare.ae/images/*"
    settings:
      cache_level: "cache_everything"
      edge_cache_ttl: 86400
      browser_cache_ttl: 86400
      
  - pattern: "storagecompare.ae/api/*"
    settings:
      cache_level: "bypass"
      # API caching handled by Redis, not CDN
      
  - pattern: "storagecompare.ae/operator/*"
    settings:
      cache_level: "bypass"
      security_level: "high"
      
  - pattern: "storagecompare.ae/*"
    settings:
      cache_level: "standard"
      # Default for pages
```

### D.2. Nginx CDN Origin Configuration

```nginx
# nginx.conf - Origin server configuration

http {
    # Cache key normalization
    map $request_uri $normalized_uri {
        ~^(?P<path>[^?]*)\?(?P<args>.*)$ $path?$args;
        default $request_uri;
    }

    # Cache zone definition
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

    server {
        listen 443 ssl http2;
        server_name api.storagecompare.ae;

        # Static assets
        location /_next/static/ {
            proxy_pass http://frontend:3000;
            proxy_cache off; # Let CDN handle
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        # API endpoints
        location /api/v1/warehouses {
            proxy_pass http://backend:4000;
            
            # Don't cache at Nginx (Redis handles)
            proxy_cache off;
            
            # Pass headers
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            
            # Allow origin to set Cache-Control
            proxy_hide_header Cache-Control;
            add_header Cache-Control $upstream_http_cache_control;
        }

        # Authenticated endpoints - never cache
        location ~ ^/api/v1/(users|bookings|operator|admin) {
            proxy_pass http://backend:4000;
            proxy_cache off;
            add_header Cache-Control "private, no-store, no-cache" always;
        }
    }
}
```

---

## Appendix E: Monitoring Query Examples

### E.1. Prometheus Queries

**Cache Hit Ratio (Overall):**
```promql
sum(rate(cache_hits_total[5m])) 
/ 
(sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m])))
```

**Cache Hit Ratio by Layer:**
```promql
sum(rate(cache_hits_total[5m])) by (cache_layer)
/ 
(sum(rate(cache_hits_total[5m])) by (cache_layer) + sum(rate(cache_misses_total[5m])) by (cache_layer))
```

**Origin Load Reduction:**
```promql
sum(rate(cache_hits_total{cache_layer="cdn"}[5m]))
```

**Cache Response Time (P95):**
```promql
histogram_quantile(0.95, 
  sum(rate(cache_response_seconds_bucket[5m])) by (le, cache_layer)
)
```

**Invalidation Rate:**
```promql
sum(rate(cache_invalidations_total[5m])) by (reason)
```

### E.2. Alert Rules

```yaml
# prometheus/alerts/cache.yml
groups:
  - name: caching
    interval: 30s
    rules:
      - alert: LowCacheHitRatio
        expr: |
          sum(rate(cache_hits_total[5m])) 
          / 
          (sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m])))
          < 0.6
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit ratio below 60%"
          description: "Cache hit ratio is {{ $value | humanizePercentage }}"
          
      - alert: HighCacheErrorRate
        expr: |
          sum(rate(cache_errors_total[5m])) 
          / 
          sum(rate(cache_operations_total[5m]))
          > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Cache error rate above 1%"
          description: "Cache errors: {{ $value | humanizePercentage }}"
          
      - alert: RedisConnectionFailure
        expr: redis_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis connection down"
          description: "Application cache unavailable"
```

---

## Appendix F: Glossary

| Term | Definition |
|------|------------|
| **Browser Cache** | Cache stored in user's web browser |
| **CDN** | Content Delivery Network - distributed caching infrastructure |
| **Edge Location** | CDN server geographically close to user |
| **Origin** | Source server (backend API or frontend) |
| **Cache Hit** | Request served from cache without contacting origin |
| **Cache Miss** | Request forwarded to origin (cache doesn't have entry) |
| **TTL** | Time To Live - duration before cache entry expires |
| **ETag** | Entity Tag - identifier for specific version of resource |
| **Conditional Request** | Request using `If-None-Match` or `If-Modified-Since` |
| **Surrogate Key** | Tag for group invalidation of related cache entries |
| **Stale Content** | Cache entry past its TTL but still serveable |
| **Cache Poisoning** | Attack injecting malicious content into cache |
| **Cache Key** | Unique identifier for cached content |
| **Cache Invalidation** | Removing or updating cache entries |
| **ISR** | Incremental Static Regeneration (Next.js feature) |
| **SSR** | Server-Side Rendering |
| **SSG** | Static Site Generation |

---

**END OF DOCUMENT**

---

**Document Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **Author** | Infrastructure Team | 2025-12-16 | - |
| **Reviewer** | Backend Team Lead | - | - |
| **Reviewer** | Security Team | - | - |
| **Approver** | Technical Architect | - | - |

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Infrastructure Team | Initial canonical version |

---

**Document Status: 🟢 GREEN (Canonical)**
