# DOC-048 — Frontend Performance Optimization Plan (MVP v1)

**Document ID:** DOC-048  
**Version:** 1.0  
**Date:** December 17, 2025  
**Status:** Active — Supporting / Technical Plan  
**Project:** Self-Storage Aggregator MVP v1

---

## Document Role & Scope

### Purpose

This document establishes **frontend performance goals and optimization priorities** for the MVP v1 release of the Self-Storage Aggregator platform. It provides strategic guidance on performance considerations, not implementation details.

### What This Document IS

- **Performance strategy** for frontend development
- **Goal-setting framework** for MVP v1
- **Conceptual guidance** on optimization categories
- **Reference to** canonical technical specifications
- **Budget-aware** and incremental improvement approach

### What This Document IS NOT

- ❌ **Not a frontend architecture specification** (see Frontend Architecture Specification v1.5)
- ❌ **Not a DevOps or infrastructure plan** (see DOC-041 DevOps Infrastructure Plan, DOC-039 Deployment Runbook)
- ❌ **Not a CDN configuration guide** (see DOC-100 Caching Strategy & CDN Specification)
- ❌ **Not a monitoring implementation** (see Monitoring & Observability Plan MVP v1)
- ❌ **Not an SEO specification** (see SEO Strategy)
- ❌ **Not implementation code or configuration files**

### MVP v1 Scope Constraint

All performance optimization recommendations in this document:
- Are **scoped to MVP v1 capabilities and constraints**
- Focus on **essential performance goals** without over-engineering
- Prioritize **user experience on mobile devices** (mobile-first strategy)
- Accept **reasonable trade-offs** between performance and development velocity
- Defer **advanced optimizations** to post-MVP phases

---

## 1. Performance Philosophy for MVP v1

### 1.1. Core Principles

**Mobile-First Performance**  
The majority of self-storage seekers access the platform via mobile devices. Performance optimization must prioritize mobile experiences, including:
- Lower-powered devices (mid-range Android phones)
- Variable network conditions (3G/4G)
- Smaller viewport sizes

**Budget-Aware Optimization**  
MVP v1 operates with limited infrastructure and engineering resources. Performance improvements must be:
- **Incremental** — achievable within MVP constraints
- **High-impact** — focus on largest user-perceived improvements
- **Low-cost** — avoid expensive infrastructure or complex tooling

**Progressive Enhancement**  
Core functionality must work on all devices, with performance enhancements applied progressively:
- **Baseline:** Functional on slow connections and older devices
- **Enhanced:** Optimized experience on modern devices and fast networks
- **Graceful degradation:** Fallbacks when optimizations are unavailable

**Measure, Then Optimize**  
Performance optimization decisions are informed by actual measurement:
- Establish baseline metrics before optimization
- Focus on metrics that correlate with user experience
- Avoid premature optimization

### 1.2. Performance vs. Other Priorities

**In MVP v1, performance is balanced against:**

| Priority | Trade-Off Approach |
|----------|-------------------|
| **Feature Velocity** | Acceptable to defer non-critical optimizations if features deliver immediate business value |
| **Development Complexity** | Prefer simple, maintainable solutions over complex performance micro-optimizations |
| **Infrastructure Cost** | Use cost-effective CDN and caching without overprovisioning |
| **SEO Requirements** | Performance improvements that also improve SEO are prioritized (e.g., SSR, LCP) |
| **Accessibility** | Never compromise accessibility for performance gains |

---

## 2. Performance Goals (MVP v1)

### 2.1. Core Web Vitals Targets

The following targets are **aspirational goals for MVP v1**, not contractual SLAs. They guide optimization priorities but are subject to budget and scope constraints.

**Reference:** Metrics collection and reporting are defined in **Monitoring & Observability Plan MVP v1 § 2.7 (Frontend Web Vitals)**.

| Metric | Target (Mobile) | Target (Desktop) | Business Impact |
|--------|-----------------|------------------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 2.0s | User-perceived page load speed; correlates with bounce rate |
| **INP** (Interaction to Next Paint) | < 200ms | < 200ms | Responsiveness to user input (replaces FID in 2024) |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.1 | Visual stability; prevents accidental clicks |
| **TTFB** (Time to First Byte) | < 600ms | < 400ms | Server response time; primarily a backend concern |

**Note:** These are **75th percentile (P75) targets** as recommended by Google. Not all users will achieve these values, especially on very slow networks.

### 2.2. Page Load Time Expectations

| Page Type | Target (Mobile 3G) | Target (Mobile 4G) | Notes |
|-----------|-------------------|-------------------|-------|
| **Home Page** | < 4s | < 2.5s | First landing page; critical for first impression |
| **Catalog / Search** | < 5s | < 3s | May include map rendering; heavier than home |
| **Warehouse Detail** | < 4s | < 2.5s | ISR-cached; should be fast |
| **Authenticated Pages** | < 5s | < 3s | Includes user-specific data; harder to cache |

**Measurement Context:**
- Based on synthetic testing from major Russian cities (Moscow, St. Petersburg)
- Assumes average mobile device (not low-end)
- Includes time to interactive (TTI)

### 2.3. Bundle Size Goals

| Asset Type | Target Size | Measurement |
|------------|-------------|-------------|
| **Initial JavaScript** | < 200 KB (gzipped) | First-load bundle before code splitting |
| **Initial CSS** | < 50 KB (gzipped) | Critical CSS for above-the-fold content |
| **Total Page Weight** | < 1.5 MB | Including images, fonts, scripts |

**Rationale:** These targets balance rich functionality (maps, AI features) with reasonable load times on slower networks.

---

## 3. Optimization Categories (Conceptual)

This section outlines **categories of performance optimization** without specifying implementation details. Detailed implementations are governed by the **Frontend Architecture Specification v1.5**.

### 3.1. Bundle Size & Code Loading

**Goal:** Minimize the amount of JavaScript and CSS that must be downloaded and parsed before the page becomes interactive.

**Conceptual Strategies:**

**Code Splitting**
- Separate vendor libraries from application code
- Split by route (page-level code splitting)
- Split by feature (lazy-load non-critical features)
- Example: Map library loads only on catalog/map pages

**Tree Shaking**
- Remove unused code from dependencies
- Next.js handles this automatically; developers should be mindful of import patterns

**Dependency Management**
- Audit dependencies for size impact
- Prefer lightweight alternatives where functionality is equivalent
- Example: date-fns over moment.js

**Deferred Loading**
- Load non-critical scripts after page interactive
- Examples: analytics, chat widgets, third-party tracking

**Implementation Reference:** Frontend Architecture Specification § Code Organization

### 3.2. Rendering & Hydration Strategy

**Goal:** Deliver visible, interactive content to users as quickly as possible while balancing server costs and complexity.

**Conceptual Strategies:**

**Server-Side Rendering (SSR)**
- Used for public SEO-critical pages (home, catalog, warehouse details)
- Provides immediate visual feedback; improves LCP
- Reference: Technical Architecture Document § 2.3.1 (Frontend Layer)

**Incremental Static Regeneration (ISR)**
- Used for warehouse detail pages (semi-static content)
- Balances freshness with performance
- Revalidation strategy: 10 minutes (per Caching Strategy DOC-100)

**Client-Side Rendering (CSR)**
- Used for authenticated user dashboards (operator, user profile)
- Acceptable for pages where SEO is not a concern

**Hydration Optimization**
- Minimize time between "page looks ready" and "page is interactive"
- Progressive hydration may be considered post-MVP

**Implementation Reference:** Frontend Architecture Specification § Rendering Patterns

### 3.3. Images & Media Handling

**Goal:** Deliver optimized images that load quickly without sacrificing visual quality.

**Conceptual Strategies:**

**Next.js Image Component**
- Automatic optimization, resizing, and format conversion (WebP with fallbacks)
- Lazy loading for below-the-fold images
- Reference: Technical Architecture Document § 2.3.1 (Key Features)

**Responsive Images**
- Serve appropriately-sized images based on viewport
- Different sizes for mobile vs. desktop

**Image Formats**
- Prefer modern formats (WebP, AVIF) with fallbacks
- JPEG for photographs, PNG for graphics with transparency

**Lazy Loading**
- Images below the fold load only when user scrolls
- Improves initial page load time

**CDN Distribution**
- Images served via CDN for geographic distribution
- Reference: DOC-100 Caching Strategy § 3.1.3 (Images)

**Implementation Reference:** Frontend Architecture Specification § Media Handling

### 3.4. Frontend Caching Strategy

**Goal:** Reduce redundant network requests by caching static assets and API responses.

**Conceptual Strategies:**

**Static Asset Caching**
- Long cache lifetimes (1 year) for content-hashed assets (JS, CSS, fonts)
- Reference: DOC-100 § 3.1 (Static Assets)

**Page-Level Caching**
- SSR/ISR pages cached at CDN layer
- TTL varies by page type (1 hour for home, 5 minutes for catalog)
- Reference: DOC-100 § 3.2 (Public SEO Pages)

**API Response Caching**
- Client-side caching via React Query (stale-while-revalidate pattern)
- Warehouse search results cached briefly (5 minutes)
- Reference: Technical Architecture Document § 8.3 (Caching Strategy)

**Browser Caching**
- Cache-Control headers set appropriately for each resource type
- Reference: DOC-100 (Complete caching specification)

**Implementation Reference:** DOC-100 Caching Strategy & CDN Specification

### 3.5. Third-Party Script Control

**Goal:** Minimize the performance impact of external scripts (analytics, maps, tracking).

**Conceptual Strategies:**

**Deferred Loading**
- Load analytics and non-critical scripts after page interactive
- Use `defer` or `async` attributes appropriately

**Conditional Loading**
- Load map scripts only on pages that need maps (catalog, map view)
- Load chat widgets only when user initiates chat

**Third-Party Budget**
- Limit number and size of third-party scripts
- Audit scripts regularly for necessity

**Fallback Handling**
- Core functionality must work if third-party scripts fail or are blocked
- Example: Map fallback (Google Maps primary, Google Maps fallback)

**Implementation Reference:** Frontend Architecture Specification § Third-Party Integrations

### 3.6. Network & API Request Optimization

**Goal:** Minimize network latency and bandwidth usage when communicating with backend.

**Conceptual Strategies:**

**Request Batching**
- Combine multiple API calls where practical
- Example: Fetch warehouse details + boxes + availability in single request (if API supports)

**Optimistic UI Updates**
- Show immediate feedback to user actions before backend confirmation
- Improves perceived responsiveness
- Reference: Technical Architecture Document § 2.3.1 (Key Features)

**Request Deduplication**
- Avoid making identical API requests simultaneously
- React Query handles this automatically for data fetching

**Pagination & Infinite Scroll**
- Load data incrementally rather than all at once
- Example: Warehouse catalog loads 20 results at a time

**Compression**
- Gzip/Brotli compression for API responses (handled by Nginx)
- Reference: Technical Architecture Document § 2.3.2 (API Gateway)

**Implementation Reference:** Frontend Architecture Specification § Data Fetching

### 3.7. Error Handling & Fallback Performance

**Goal:** Ensure graceful degradation when performance optimizations fail or are unavailable.

**Conceptual Strategies:**

**Error Boundaries**
- Catch JavaScript errors without crashing entire page
- Show user-friendly fallback UI
- Reference: Technical Architecture Document § 2.3.1 (Key Features)

**Timeout Handling**
- Set reasonable timeouts for API requests (5-10 seconds)
- Show loading states and allow user to retry

**Offline Support**
- Basic offline detection (show user-friendly message)
- Retry queues for failed requests (post-MVP consideration)

**Progressive Enhancement**
- Core content accessible even if JavaScript fails to load
- SSR ensures basic page structure is always available

**Implementation Reference:** Error Handling & Fault Tolerance Specification MVP v1

---

## 4. Monitoring & Measurement

### 4.1. Metrics Collection

**Core Web Vitals are collected via Next.js built-in reporting:**

```typescript
// frontend/lib/webVitals.ts (conceptual reference only)
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send metrics to backend endpoint for aggregation
  // Implementation per Monitoring & Observability Plan
}
```

**Reference:** Monitoring & Observability Plan MVP v1 § 2.7 (Frontend Web Vitals)

### 4.2. Performance Budgets (Aspirational)

Performance budgets are **recommended guidelines**, not hard limits in MVP v1:

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **JavaScript Bundle** | < 200 KB (gzipped) | Initial load |
| **CSS Bundle** | < 50 KB (gzipped) | Critical CSS |
| **Largest Image** | < 100 KB | Optimized WebP |
| **Total Page Weight** | < 1.5 MB | First load |
| **Third-Party Scripts** | < 50 KB | Combined size |

**Enforcement:** Not automatically enforced in MVP v1. Monitored manually during development.

### 4.3. Monitoring Tools

**Synthetic Monitoring (Development & Staging):**
- Lighthouse CI (manual runs)
- PageSpeed Insights (manual audits)
- Browser DevTools (developer profiling)

**Real User Monitoring (Production):**
- Core Web Vitals reported from Next.js
- Aggregated in monitoring system (per Observability Plan)

**Reference:** Monitoring & Observability Plan MVP v1 § 2.7

---

## 5. Integration with Canonical Documents

### 5.1. Technical Architecture Document

**Relationship:** This document provides **strategic goals** that align with the **technical implementation** defined in the Technical Architecture Document.

**Key Dependencies:**
- Next.js 14 SSR/ISR rendering strategy (§ 2.3.1)
- CDN and caching architecture (§ 8.3)
- Performance targets (§ 8.1)

**Integration:** Performance goals in this document must be achievable within the technical architecture constraints (single backend instance, modest infrastructure).

### 5.2. Frontend Architecture Specification v1.5

**Relationship:** This document defines **what to optimize and why**. Frontend Architecture Specification defines **how to implement** optimizations.

**Division of Responsibility:**
- **DOC-048 (this document):** Performance goals, optimization categories, conceptual strategies
- **Frontend Architecture Specification:** Code organization, build configuration, specific libraries

**Integration:** All optimization strategies in this document are implemented per the Frontend Architecture Specification.

### 5.3. DOC-100 Caching Strategy & CDN Specification

**Relationship:** Caching is a **primary performance optimization**. DOC-100 provides detailed caching rules.

**Integration:**
- Frontend caching goals (§ 3.4 of this document) are implemented per DOC-100
- Cache headers, TTLs, and invalidation strategies are defined in DOC-100
- This document provides only conceptual rationale; defer to DOC-100 for specifics

### 5.4. Monitoring & Observability Plan

**Relationship:** Performance **measurement and tracking** are defined in the Observability Plan.

**Integration:**
- Core Web Vitals collection (Observability Plan § 2.7)
- Performance metrics storage and alerting (Observability Plan § 4)
- This document defines **what to measure**; Observability Plan defines **how to collect and report**

### 5.5. SEO Strategy

**Relationship:** Many performance optimizations (SSR, LCP, mobile-first) directly support SEO goals.

**Integration:**
- SSR for SEO-critical pages (both performance and SEO benefit)
- LCP optimization improves Google ranking signals
- Mobile-first approach aligns with mobile-first indexing

---

## 6. Out of Scope for MVP v1

The following performance optimizations are **explicitly out of scope** for MVP v1 and deferred to future versions:

### 6.1. Advanced Edge Rendering

**Not in MVP v1:**
- Edge functions (Cloudflare Workers, Vercel Edge Functions)
- Edge-side rendering (ESR) or Edge-side Includes (ESI)
- Geographically-distributed Next.js instances

**Rationale:** Adds infrastructure complexity and cost without proportional benefit at MVP scale (< 1,000 MAU).

**Future Consideration:** v2 with multi-region deployment.

### 6.2. Real User Monitoring (RUM) with Advanced Features

**Not in MVP v1:**
- Session replay
- User journey tracking
- Heatmaps and click tracking
- Detailed performance profiling per user

**Rationale:** MVP focuses on aggregate Core Web Vitals. Detailed RUM adds complexity and cost.

**Future Consideration:** v1.1 with analytics expansion.

### 6.3. Automatic Performance Budget Enforcement

**Not in MVP v1:**
- CI/CD performance budgets (bundle size limits)
- Lighthouse CI thresholds that block deployment
- Automatic alerts on bundle size growth

**Rationale:** Manual monitoring is sufficient for MVP team size. Automation requires CI/CD investment.

**Future Consideration:** v1.1 with mature CI/CD pipeline.

### 6.4. Advanced Image Optimization

**Not in MVP v1:**
- AVIF format support (WebP is sufficient)
- Custom image CDN (beyond Cloudflare)
- Art direction (different images for different viewports)
- Client hints (Accept-CH headers)

**Rationale:** Next.js Image component with WebP provides 80% of benefit with 20% of complexity.

**Future Consideration:** v2 if image delivery becomes bottleneck.

### 6.5. Service Worker & Offline Support

**Not in MVP v1:**
- Service worker for offline caching
- Background sync for failed requests
- Push notifications
- Progressive Web App (PWA) manifest

**Rationale:** Self-storage search requires online connectivity (maps, real-time availability). Offline support provides limited value.

**Future Consideration:** v2 if user research indicates demand.

### 6.6. Per-Route Performance Tuning

**Not in MVP v1:**
- Separate performance budgets per route
- Route-specific code splitting strategies
- Granular performance monitoring per page

**Rationale:** MVP applies uniform optimization strategies. Per-route tuning requires more sophisticated tooling.

**Future Consideration:** v1.1 after identifying high-traffic routes.

### 6.7. Advanced A/B Performance Testing

**Not in MVP v1:**
- Performance-based A/B tests (e.g., testing different rendering strategies)
- Performance impact analysis of new features
- Experimentation framework for optimization

**Rationale:** MVP focuses on establishing baseline performance. A/B testing requires experimentation infrastructure.

**Future Consideration:** v2 with mature product analytics.

---

## 7. Responsibilities & Ownership

### 7.1. Development Team

**Frontend Developers:**
- Implement optimizations per Frontend Architecture Specification
- Monitor bundle sizes during development
- Profile performance locally before merging
- Write performance-conscious code (avoid unnecessary re-renders, optimize loops)

**Backend Developers:**
- Optimize API response times (target < 100ms per query)
- Implement efficient database queries
- Support caching strategies (cache headers, ETags)

### 7.2. DevOps / Infrastructure

**Responsibilities:**
- Configure CDN caching rules per DOC-100
- Ensure Cloudflare or equivalent CDN is properly configured
- Monitor infrastructure performance (TTFB, network latency)

### 7.3. Product / QA

**Responsibilities:**
- Verify performance goals are met during QA cycles
- Test on representative devices (mid-range Android, older iPhones)
- Report performance regressions

---

## 8. Success Criteria

MVP v1 frontend performance is considered **successful** if:

1. **Core Web Vitals meet targets for 75% of mobile users** (LCP < 2.5s, INP < 200ms, CLS < 0.1)
2. **Home page loads in < 4 seconds on mobile 3G** (synthetic test from Moscow/St. Petersburg)
3. **No critical JavaScript errors** that break core functionality (search, booking)
4. **Bundle sizes remain under budget** (< 200 KB gzipped initial JS)
5. **User complaints about slowness are minimal** (< 5% of support tickets)

**Measurement Period:** 30 days after MVP v1 production launch

**Review Cadence:** Performance metrics reviewed weekly during MVP; monthly post-launch.

---

## 9. Continuous Improvement

### 9.1. Performance Review Cycle

**Weekly (During Active Development):**
- Review Lighthouse scores on staging
- Check bundle size trends
- Address performance regressions

**Monthly (Post-Launch):**
- Analyze Core Web Vitals from production
- Identify performance bottlenecks via user data
- Prioritize optimization opportunities for next iteration

### 9.2. Optimization Backlog

Performance optimizations **not implemented in MVP v1** are tracked in the product backlog for future sprints.

**Prioritization Criteria:**
1. **User Impact:** Does it improve metrics that correlate with user satisfaction?
2. **Effort:** Can it be implemented with reasonable engineering effort?
3. **Risk:** Does it introduce complexity or potential bugs?
4. **Cost:** Does it require additional infrastructure or services?

---

## 10. Appendix: Key Terms

| Term | Definition |
|------|------------|
| **LCP** (Largest Contentful Paint) | Time until largest visible element loads (< 2.5s target) |
| **INP** (Interaction to Next Paint) | Time between user interaction and visual response (< 200ms target) |
| **CLS** (Cumulative Layout Shift) | Visual stability metric (< 0.1 target) |
| **TTFB** (Time to First Byte) | Server response time (< 600ms mobile target) |
| **FCP** (First Contentful Paint) | Time until first content appears |
| **TTI** (Time to Interactive) | Time until page is fully interactive |
| **SSR** (Server-Side Rendering) | Page HTML generated on server |
| **ISR** (Incremental Static Regeneration) | Static pages regenerated on-demand with caching |
| **CSR** (Client-Side Rendering) | Page rendered in browser via JavaScript |
| **Code Splitting** | Dividing JavaScript into smaller chunks loaded on-demand |
| **Tree Shaking** | Removing unused code from final bundle |
| **Lazy Loading** | Deferring load of non-critical resources |
| **Above-the-Fold** | Content visible without scrolling |
| **Below-the-Fold** | Content only visible after scrolling |
| **Hydration** | Attaching JavaScript event handlers to server-rendered HTML |

---

## 11. References

- **Technical Architecture Document (MVP v1 Canonical)** — System architecture and performance targets
- **Frontend Architecture Specification v1.5 FINAL** — Implementation details for frontend
- **DOC-100 Caching Strategy & CDN Specification** — Detailed caching rules
- **Monitoring & Observability Plan MVP v1** — Metrics collection and reporting
- **Error Handling & Fault Tolerance Specification MVP v1** — Error handling patterns
- **SEO Strategy** — SEO requirements aligned with performance

---

**Document Status:** Active  
**Maintenance:** Frontend Team Lead  
**Next Review:** March 2026 (or after 1 month post-launch)  
**Contact:** frontend-performance@platform.example

---

**END OF DOCUMENT**
