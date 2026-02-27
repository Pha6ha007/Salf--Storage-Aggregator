# Analytics, Metrics & Tracking Specification

## MVP v1.1 | Self-Storage Aggregator Platform

---

**Document Version:** 1.1  
**Date:** December 2025  
**Status:** GREEN — Final Approved for Implementation  
**Author:** Product & Engineering Team  
**Related Documents:** 
- DOC-002: Technical Architecture Document
- DOC-086: Monitoring & Observability Plan
- DOC-071: Security & Compliance Plan
- DOC-036: Data Retention & Privacy Policy
- DOC-003: A/B Testing & Experimentation Framework

---

## Document Scope & Architecture Alignment

### Purpose
This document specifies the analytics, metrics, and tracking infrastructure for the Self-Storage Aggregator Platform MVP v1. It defines:
- Product, business, and AI metrics to measure platform success
- Frontend and backend event tracking schemas
- Data storage and retention strategies
- A/B testing framework integration
- Dashboard and reporting requirements

### Architecture Context
This specification is subordinate to and aligned with:

**Primary Architecture Documents:**
- **DOC-002: Technical Architecture Document** — Defines the overall system architecture, service boundaries, and data flow patterns. All analytics components must align with the layered architecture (Frontend → API Gateway → Backend Services → Data Layer) and respect service responsibilities defined in DOC-002.
- **DOC-086: Monitoring & Observability Plan** — Defines system-level monitoring, logging, and alerting infrastructure. This analytics specification complements DOC-086 by focusing on product and business metrics, while DOC-086 focuses on operational health and system performance.

**Supporting Documents:**
- **DOC-071: Security & Compliance Plan** — Governs data privacy, PII handling, and compliance requirements (GDPR, CCPA). All analytics events must respect privacy constraints and data anonymization rules defined in DOC-071.
- **DOC-036: Data Retention & Privacy Policy** — Defines retention periods for analytics data, user consent management, and data deletion procedures. Analytics storage strategies in Section 4 must comply with retention policies in DOC-036.
- **DOC-003: A/B Testing & Experimentation Framework** — Provides the complete architecture for experimentation, including variant assignment, statistical testing, and experiment lifecycle management. Section 7 of this document focuses only on the analytics and tracking aspects of A/B testing.

### Scope Boundaries

**In Scope (MVP v1):**
- Product, business, and AI metrics definitions
- Frontend event tracking via Google Analytics 4 (GA4)
- Backend event tracking via PostgreSQL `analytics_events` table
- Basic dashboards using GA4, Grafana, and Metabase
- Event naming conventions and data schemas
- MVP-level data storage (GA4 + PostgreSQL)

**Out of Scope (Post-MVP):**
- Advanced OLAP analytics (ClickHouse)
- Data lake architecture (BigQuery)
- Real-time streaming analytics (Kafka)
- Advanced machine learning on analytics data
- Custom attribution modeling
- Cross-device tracking beyond GA4 capabilities

### Key Principles
1. **Privacy First:** All analytics must respect user privacy and comply with DOC-071 and DOC-036
2. **Consistency:** Event naming and schemas must be consistent across frontend and backend
3. **Actionability:** Metrics must be actionable and tied to business or product decisions
4. **Simplicity:** MVP focuses on essential metrics and avoids over-instrumentation
5. **Scalability:** Architecture designed to scale to post-MVP OLAP solutions (ClickHouse, BigQuery)

---

## Table of Contents

1. [Platform Metrics](#1-platform-metrics)
   - 1.1. [Product Metrics](#11-product-metrics)
   - 1.2. [Business Metrics](#12-business-metrics)
   - 1.3. [AI Metrics](#13-ai-metrics)
2. [Frontend Events (Frontend Tracking)](#2-frontend-events-frontend-tracking)
   - 2.1. [Navigation Events](#21-navigation-events)
   - 2.2. [Search Events](#22-search-events)
   - 2.3. [Booking Events](#23-booking-events)
   - 2.4. [User Actions](#24-user-actions)
   - 2.5. [Frontend Event Data Schema](#25-frontend-event-data-schema)
3. [Backend Events](#3-backend-events)
   - 3.1. [Business Events](#31-business-events)
   - 3.2. [System Events](#32-system-events)
   - 3.3. [AI Events](#33-ai-events)
   - 3.4. [Backend Event Data Schema](#34-backend-event-data-schema)
4. [Analytics Storage](#4-analytics-storage)
   - 4.1. [Data Sources](#41-data-sources)
   - 4.2. [MVP Storage](#42-mvp-storage)
   - 4.3. [Backup Storage](#43-backup-storage)
   - 4.4. [Data Flow Architecture](#44-data-flow-architecture)
5. [Naming Conventions](#5-naming-conventions)
   - 5.1. [Naming Format](#51-naming-format)
   - 5.2. [Event Categories](#52-event-categories)
   - 5.3. [Complete Event Registry](#53-complete-event-registry)
   - 5.4. [Anti-patterns](#54-anti-patterns)
6. [Event Data Schemas](#6-event-data-schemas)
   - 6.1. [Base Event Structure](#61-base-event-structure)
   - 6.2. [Required and Optional Fields](#62-required-and-optional-fields)
   - 6.3. [Event Examples by Category](#63-event-examples-by-category)
   - 6.4. [Event Validation](#64-event-validation)
7. [A/B Testing Framework](#7-ab-testing-framework)
   - 7.1. [System Architecture](#71-system-architecture)
   - 7.2. [User Segmentation](#72-user-segmentation)
   - 7.3. [Feature Flags](#73-feature-flags)
   - 7.4. [Measured Metrics](#74-measured-metrics)
   - 7.5. [Statistical Significance](#75-statistical-significance)
8. [Dashboard Requirements](#8-dashboard-requirements)
   - 8.1. [Product Manager Dashboards](#81-product-manager-dashboards)
   - 8.2. [Operator Dashboards](#82-operator-dashboards)
   - 8.3. [Technical Dashboards](#83-technical-dashboards)
   - 8.4. [Tools and Platforms](#84-tools-and-platforms)
- [Appendices](#appendices)
   - A. [Complete Event Registry](#appendix-a-complete-event-registry)
   - B. [GA4 Mapping](#appendix-b-ga4-mapping)
   - C. [Integration Checklist](#appendix-c-integration-checklist)

---

## 1. Platform Metrics

This section describes key metrics for evaluating platform performance: product metrics, business metrics, and AI metrics.

### 1.1. Product Metrics

Product metrics reflect user engagement and the effectiveness of key platform usage scenarios.

#### 1.1.1. User Activity (DAU / MAU)

| Metric | Description | Formula | Target Value (MVP) |
|---------|----------|---------|------------------------|
| **DAU** | Unique users per day | `COUNT(DISTINCT user_id) WHERE date = today` | > 100 |
| **MAU** | Unique users per month | `COUNT(DISTINCT user_id) WHERE date >= today - 30` | > 1,000 |
| **DAU/MAU Ratio** | Platform stickiness | `DAU / MAU * 100%` | > 10% |
| **WAU** | Unique users per week | `COUNT(DISTINCT user_id) WHERE date >= today - 7` | > 300 |

**DAU/MAU Segmentation:**

```
DAU_by_role:
  - users (seekers): COUNT(DISTINCT user_id WHERE role = 'user')
  - operators: COUNT(DISTINCT user_id WHERE role = 'operator')
  - admins: COUNT(DISTINCT user_id WHERE role = 'admin')
```

#### 1.1.2. Conversion Funnel

Main platform conversion funnel:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSION FUNNEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │   Search     │  100%  ─────────────────────────────────────  │
│  │  (page_view) │                                               │
│  └──────┬───────┘                                               │
│         │ 60% ▼                                                 │
│  ┌──────────────┐                                               │
│  │  Warehouse   │  60%  ──────────────────────────────────────  │
│  │    View      │                                               │
│  └──────┬───────┘                                               │
│         │ 40% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Box View   │  24%  ──────────────────────────────────────  │
│  │              │                                               │
│  └──────┬───────┘                                               │
│         │ 25% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Booking    │  6%   ──────────────────────────────────────  │
│  │   Request    │                                               │
│  └──────┬───────┘                                               │
│         │ 70% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Booking    │  4.2%  ─────────────────────────────────────  │
│  │  Confirmed   │                                               │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Stage | Event | Target Conversion (MVP) |
|------|---------|-------------------------|
| Search → Warehouse View | `search_result_click` | 60% |
| Warehouse View → Box View | `box_open` | 40% |
| Box View → Booking Start | `booking_start` | 25% |
| Booking Start → Booking Submit | `booking_submit` | 70% |
| Booking Submit → Confirmed | `booking_confirmed` (backend) | 80% |
| **Overall: Search → Confirmed** | — | **3-5%** |

#### 1.1.3. Retention Metrics

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **D1 Retention** | Returned next day | `Users(day N+1) / Users(day N) * 100%` | > 20% |
| **D7 Retention** | Returned after one week | `Users(day N+7) / Users(day N) * 100%` | > 10% |
| **D30 Retention** | Returned after one month | `Users(day N+30) / Users(day N) * 100%` | > 5% |

**Retention by Cohorts:**

```sql
-- SQL example for calculating retention cohorts
SELECT 
  DATE_TRUNC('week', first_visit_date) AS cohort_week,
  COUNT(DISTINCT CASE WHEN days_since_first = 0 THEN user_id END) AS d0,
  COUNT(DISTINCT CASE WHEN days_since_first = 1 THEN user_id END) AS d1,
  COUNT(DISTINCT CASE WHEN days_since_first = 7 THEN user_id END) AS d7,
  COUNT(DISTINCT CASE WHEN days_since_first = 30 THEN user_id END) AS d30
FROM user_activity_cohorts
GROUP BY cohort_week
ORDER BY cohort_week DESC;
```

#### 1.1.4. Operator Activation Rate

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Registration → First Warehouse** | Operator added first warehouse | `Operators(≥1 warehouse) / Registered Operators` | > 70% |
| **First Warehouse → First Box** | Operator added first box | `Operators(≥1 box) / Operators(≥1 warehouse)` | > 90% |
| **First Box → First Request** | Received first request | `Operators(≥1 request) / Operators(≥1 box)` | > 50% |
| **Time to First Warehouse** | Median time to adding warehouse | `MEDIAN(time_to_first_warehouse)` | < 24 hours |
| **Time to First Request** | Median time to first request | `MEDIAN(time_to_first_request)` | < 7 days |

#### 1.1.5. Behavioral Metrics

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Pages per Session** | Average pages per session | `SUM(page_views) / COUNT(DISTINCT session_id)` | > 3 |
| **Session Duration** | Average session duration | `AVG(session_end - session_start)` | > 3 minutes |
| **Bounce Rate** | Percentage of single-page sessions | `Sessions(page_count = 1) / Total Sessions * 100%` | < 40% |
| **Time on Page (Warehouse)** | Time on warehouse page | `AVG(time_on_page) WHERE page_type = 'warehouse'` | > 2 minutes |
| **Search Depth** | Number of search results before click | `AVG(results_viewed_before_click)` | < 10 |

---

### 1.2. Business Metrics

Business metrics measure the commercial effectiveness of the platform.

#### 1.2.1. Booking Metrics

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Total Bookings** | Total number of bookings | `COUNT(bookings)` | > 50/month (MVP) |
| **Confirmed Bookings** | Confirmed bookings | `COUNT(bookings WHERE status = 'confirmed')` | > 40/month (MVP) |
| **Booking Confirmation Rate** | Confirmation percentage | `Confirmed / Total * 100%` | > 70% |
| **Cancelled Bookings** | Cancelled bookings | `COUNT(bookings WHERE status = 'cancelled')` | < 10% |
| **Average Booking Value (ABV)** | Average booking cost | `SUM(booking_amount) / COUNT(bookings)` | > $100 |
| **Booking Lead Time** | Average time to move-in | `AVG(move_in_date - booking_created_at)` | 7-14 days |

#### 1.2.2. Revenue Metrics

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Gross Booking Value (GBV)** | Total booking value | `SUM(booking_amount)` | > $10K/month |
| **Net Revenue** | Platform revenue (commission) | `SUM(platform_fee)` | > $1K/month |
| **Take Rate** | Commission percentage | `Net Revenue / GBV * 100%` | 10-15% |
| **ARPU (User)** | Average revenue per user | `Net Revenue / Active Users` | > $10 |
| **ARPU (Operator)** | Average revenue per operator | `Net Revenue / Active Operators` | > $100 |

#### 1.2.3. Operator Metrics

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Active Operators** | Operators with active warehouses | `COUNT(DISTINCT operator_id WHERE warehouses > 0)` | > 20 (MVP) |
| **Warehouses per Operator** | Average warehouse count | `AVG(warehouses_count)` | > 1.5 |
| **Boxes per Warehouse** | Average box count | `AVG(boxes_count)` | > 20 |
| **Occupancy Rate** | Box occupancy | `Booked Boxes / Total Boxes * 100%` | > 30% (MVP) |
| **Warehouse Fill Rate** | Warehouse fill percentage | `AVG(occupancy_rate) GROUP BY warehouse` | > 50% (target) |
| **Operator Response Time** | Average response time to request | `AVG(response_time)` | < 24 hours |
| **Operator Acceptance Rate** | Percentage of accepted requests | `Accepted / Total Requests * 100%` | > 80% |

#### 1.2.4. Supply & Demand

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Total Supply (Boxes)** | Total number of boxes | `COUNT(boxes WHERE status = 'available')` | > 500 (MVP) |
| **Available Supply** | Available boxes | `COUNT(boxes WHERE status = 'available' AND NOT booked)` | > 300 |
| **Search Demand** | Number of searches | `COUNT(search_events)` | > 1,000/month |
| **Supply Coverage** | Percentage of searches with results | `Searches with results / Total Searches * 100%` | > 90% |
| **Unmet Demand** | Searches without results | `COUNT(search_no_results)` | < 10% |

---

### 1.3. AI Metrics

AI metrics measure the effectiveness of AI components of the platform (AI Search, Recommendations, Claude integration).

#### 1.3.1. AI Search Performance

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **AI Search Usage** | Percentage of searches with AI | `AI Searches / Total Searches * 100%` | > 30% |
| **AI Search CTR** | Clicks on AI results | `Clicks on AI results / AI Search impressions * 100%` | > 15% |
| **AI Search Conversion** | Conversion to booking | `Bookings from AI Search / AI Searches * 100%` | > 5% |
| **AI vs Non-AI CTR Lift** | CTR increase vs regular search | `(AI CTR - Non-AI CTR) / Non-AI CTR * 100%` | > +20% |
| **AI Search Latency** | Average AI response time | `AVG(ai_response_time)` | < 2 seconds |
| **AI Fallback Rate** | Percentage of AI errors → fallback | `AI Fallbacks / AI Requests * 100%` | < 5% |

#### 1.3.2. Recommendation Quality

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **Recommendation Impressions** | Recommendation impressions | `COUNT(recommendation_shown)` | > 1,000/day |
| **Recommendation CTR** | Clicks on recommendations | `Clicks / Impressions * 100%` | > 10% |
| **Recommendation Conversion** | Conversion to booking | `Bookings from recommendations / Recommendation clicks * 100%` | > 8% |
| **Personalization Uplift** | Increase vs non-personalized | `(Personalized CTR - Random CTR) / Random CTR * 100%` | > +30% |

#### 1.3.3. AI System Health

| Metric | Description | Formula | Target Value |
|---------|----------|---------|------------------|
| **AI Request Volume** | Number of AI requests | `COUNT(ai_requests)` | Monitoring |
| **AI Success Rate** | Percentage of successful responses | `Successful AI requests / Total requests * 100%` | > 95% |
| **AI Error Rate** | Percentage of errors | `Failed AI requests / Total requests * 100%` | < 5% |
| **AI Response Time (p50)** | Median response time | `PERCENTILE(ai_response_time, 50)` | < 1 second |
| **AI Response Time (p95)** | 95th percentile | `PERCENTILE(ai_response_time, 95)` | < 3 seconds |
| **AI Cost per Request** | Average request cost | `Total AI cost / Total requests` | < $0.01 |
| **AI Token Usage** | Average token count | `AVG(tokens_used)` | Monitoring |

---

## 2. Frontend Events (Frontend Tracking)

The frontend tracks user actions through **Google Analytics 4 (GA4)** using `gtag.js`.

### 2.1. Navigation Events

Navigation events track user movements across the platform.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **page_view** | View any page | HIGH | `page_view` |
| **page_exit** | Page exit (beforeunload) | LOW | Custom event |
| **search_open** | Open search page | HIGH | `view_search_results` |
| **map_open** | Open map | MEDIUM | Custom event |
| **warehouse_open** | Open warehouse page | HIGH | `view_item` |
| **box_open** | Open box page | HIGH | `view_item` |

**Example: page_view**

```javascript
gtag('event', 'page_view', {
  page_location: window.location.href,
  page_title: document.title,
  page_path: window.location.pathname,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Example: warehouse_open**

```javascript
gtag('event', 'view_item', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    item_category2: warehouse.city,
    price: warehouse.min_price,
    quantity: 1
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.2. Search Events

Search events track interactions with search and filters.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **search_apply_filters** | Apply filters | HIGH | `search` |
| **search_reset_filters** | Reset filters | MEDIUM | Custom event |
| **search_result_click** | Click on search result | HIGH | `select_item` |
| **search_sort_change** | Change sorting | MEDIUM | Custom event |
| **search_pagination** | Navigate to next page | LOW | Custom event |
| **search_no_results** | Search returned no results | MEDIUM | `search_no_results` |

**Example: search_apply_filters**

```javascript
gtag('event', 'search', {
  search_term: searchQuery,
  filters: {
    city: selectedCity,
    box_size: selectedSize,
    price_range: [minPrice, maxPrice],
    amenities: selectedAmenities
  },
  results_count: resultsCount,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Example: search_result_click**

```javascript
gtag('event', 'select_item', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    item_list_name: 'Search Results',
    index: clickPosition
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.3. Booking Events

Booking events track the entire path from booking initiation to final request submission.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **booking_start** | Click "Book Now" | HIGH | `begin_checkout` |
| **booking_step_complete** | Complete form step | MEDIUM | `checkout_progress` |
| **booking_submit** | Submit booking request | HIGH | `purchase` |
| **booking_success** | Successful submission (frontend confirmation) | HIGH | Custom event |
| **booking_error** | Submission error | HIGH | Custom event |
| **booking_abandon** | Abandon form without completion | MEDIUM | `abandon_checkout` |

**Example: booking_start**

```javascript
gtag('event', 'begin_checkout', {
  items: [{
    item_id: box.id,
    item_name: `Box ${box.size}`,
    item_category: 'storage_box',
    item_category2: warehouse.name,
    price: box.price_per_month,
    quantity: 1
  }],
  value: box.price_per_month,
  currency: 'USD',
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Example: booking_submit**

```javascript
gtag('event', 'purchase', {
  transaction_id: bookingId,
  value: totalAmount,
  currency: 'USD',
  items: [{
    item_id: box.id,
    item_name: `Box ${box.size}`,
    item_category: 'storage_box',
    price: box.price_per_month,
    quantity: 1
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Example: booking_error**

```javascript
gtag('event', 'booking_error', {
  error_message: error.message,
  error_code: error.code,
  booking_step: currentStep,
  box_id: box.id,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.4. User Actions

Events related to authentication and personal user actions.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **auth_login** | Login to system | HIGH | `login` |
| **auth_signup** | Register new user | HIGH | `sign_up` |
| **auth_logout** | Logout from system | MEDIUM | Custom event |
| **auth_password_reset** | Password reset request | MEDIUM | Custom event |
| **user_favorite_add** | Add to favorites | MEDIUM | `add_to_wishlist` |
| **user_favorite_remove** | Remove from favorites | LOW | `remove_from_wishlist` |
| **user_share_click** | Click "Share" button | LOW | `share` |

**Example: auth_login**

```javascript
gtag('event', 'login', {
  method: 'email', // or 'google', 'facebook'
  user_id: user.id,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Example: user_favorite_add**

```javascript
gtag('event', 'add_to_wishlist', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    price: warehouse.min_price
  }],
  user_id: currentUser.id,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.5. Frontend Event Data Schema

#### 2.5.1. Base Structure

All frontend events contain the following base structure:

```typescript
interface FrontendEvent {
  // Identifiers
  event_name: string;          // Event name (e.g., "page_view")
  timestamp: string;           // ISO 8601 timestamp
  session_id: string;          // Session UUID
  user_id?: string;            // User UUID (if authenticated)

  // Page context
  page_location: string;       // Full URL
  page_path: string;           // Path (without domain)
  page_title: string;          // Page title
  referrer?: string;           // Referrer source

  // Device and browser
  user_agent: string;          // User agent
  device_category: string;     // "desktop" | "mobile" | "tablet"
  browser: string;             // Browser name
  os: string;                  // Operating system
  screen_resolution: string;   // "1920x1080"
  viewport_size: string;       // "1440x900"

  // Geolocation (from IP, if available)
  country?: string;
  region?: string;
  city?: string;

  // Additional parameters (event-specific)
  [key: string]: any;
}
```

#### 2.5.2. Required Fields

| Field | Required | Notes |
|------|----------------|------------|
| `event_name` | **Required** | Event name from registry |
| `timestamp` | **Required** | ISO 8601 format |
| `session_id` | **Required** | Session UUID |
| `user_id` | Optional | Only for authenticated users |
| `page_location` | **Required** | Full URL |
| `page_path` | **Required** | Page path |
| `device_category` | **Required** | desktop/mobile/tablet |

---

## 3. Backend Events

Backend events are tracked through the internal logging system and stored in the PostgreSQL `analytics_events` table.

**Compliance & Privacy Note:**  
All backend event logging must comply with **DOC-071: Security & Compliance Plan** regarding PII handling, data anonymization, and user consent. Events must respect the retention policies defined in **DOC-036: Data Retention & Privacy Policy**.

### 3.1. Business Events

Business events reflect key user and operator actions related to bookings, warehouses, and reviews.

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **booking_created** | Create new booking | PG + CH | HIGH |
| **booking_status_changed** | Change booking status | PG + CH | HIGH |
| **booking_cancelled** | Cancel booking | PG + CH | HIGH |
| **booking_completed** | Complete booking | PG + CH | MEDIUM |
| **warehouse_created** | Add new warehouse | PG | MEDIUM |
| **warehouse_updated** | Update warehouse information | PG | LOW |
| **warehouse_published** | Publish warehouse | PG + CH | HIGH |
| **box_price_changed** | Change box price | PG + CH | MEDIUM |
| **review_submitted** | New review | PG | MEDIUM |

**Example: booking_created**

```json
{
  "event_name": "booking_created",
  "event_category": "business",
  "timestamp": "2025-12-16T10:30:00Z",
  "user_id": "usr_abc123",
  "session_id": "sess_xyz789",
  "data": {
    "booking_id": "bkg_123456",
    "box_id": "box_789",
    "warehouse_id": "wh_456",
    "operator_id": "op_123",
    "move_in_date": "2025-12-20",
    "duration_months": 3,
    "amount": 150.00,
    "currency": "USD",
    "status": "pending_confirmation"
  }
}
```

**Example: booking_status_changed**

```json
{
  "event_name": "booking_status_changed",
  "event_category": "business",
  "timestamp": "2025-12-16T11:00:00Z",
  "user_id": "usr_abc123",
  "operator_id": "op_123",
  "data": {
    "booking_id": "bkg_123456",
    "old_status": "pending_confirmation",
    "new_status": "confirmed",
    "changed_by": "operator",
    "notes": "Confirmed by operator"
  }
}
```

---

### 3.2. System Events

System events track the technical operation of the platform: API requests, errors, rate limiting, performance.

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **api_request** | Any API request | CH | LOW |
| **api_error_4xx** | Client error (400-499) | CH | MEDIUM |
| **api_error_5xx** | Server error (500-599) | CH | HIGH |
| **rate_limit_exceeded** | Rate limit exceeded | CH | HIGH |
| **db_query_slow** | Slow DB query (>1s) | Logs | HIGH |

**Example: api_request**

```json
{
  "event_name": "api_request",
  "event_category": "system",
  "timestamp": "2025-12-16T10:30:00Z",
  "data": {
    "method": "POST",
    "endpoint": "/api/v1/bookings",
    "status_code": 201,
    "response_time_ms": 342,
    "user_id": "usr_abc123",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "request_id": "req_xyz789"
  }
}
```

**Example: api_error_5xx**

```json
{
  "event_name": "api_error_5xx",
  "event_category": "system",
  "timestamp": "2025-12-16T10:35:00Z",
  "data": {
    "method": "GET",
    "endpoint": "/api/v1/warehouses/{id}",
    "status_code": 500,
    "error_message": "Database connection timeout",
    "error_code": "DB_TIMEOUT",
    "request_id": "req_abc456",
    "user_id": "usr_abc123",
    "stack_trace": "..."
  }
}
```

---

### 3.3. AI Events

AI events track interactions with AI components of the platform (AI Search, Claude API, Recommendations).

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **ai_request_sent** | Send AI request | CH | MEDIUM |
| **ai_response_received** | Successful AI response | CH | MEDIUM |
| **ai_response_failed** | AI request error | CH | HIGH |
| **ai_fallback_used** | Fallback used (non-AI) | CH | MEDIUM |

**Example: ai_request_sent**

```json
{
  "event_name": "ai_request_sent",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:00Z",
  "data": {
    "ai_provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "request_type": "search",
    "user_query": "looking for climate controlled storage near downtown",
    "user_id": "usr_abc123",
    "session_id": "sess_xyz789",
    "request_id": "ai_req_123"
  }
}
```

**Example: ai_response_received**

```json
{
  "event_name": "ai_response_received",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:02Z",
  "data": {
    "request_id": "ai_req_123",
    "response_time_ms": 1842,
    "tokens_used": 450,
    "results_count": 5,
    "cost_usd": 0.008,
    "success": true
  }
}
```

---

### 3.4. Backend Event Data Schema

#### 3.4.1. analytics_events Table

Backend events are saved to the `analytics_events` table in PostgreSQL.

```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,  -- 'business', 'system', 'ai'
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Identifiers
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    request_id VARCHAR(100),

    -- Event data (JSONB for flexibility)
    data JSONB NOT NULL,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Indexes
    INDEX idx_event_name (event_name),
    INDEX idx_event_category (event_category),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_data_gin (data USING GIN)
);
```

**Data Retention:**  
Analytics events must be retained according to **DOC-036: Data Retention & Privacy Policy**. MVP retention period: 13 months in PostgreSQL, with potential archival to S3 for longer-term storage.

#### 3.4.2. Required Fields

| Field | Type | Required | Notes |
|------|-----|----------------|------------|
| `event_name` | VARCHAR(100) | **Required** | Event name from registry |
| `event_category` | VARCHAR(50) | **Required** | business / system / ai |
| `timestamp` | TIMESTAMPTZ | **Required** | Event time |
| `data` | JSONB | **Required** | Payload |
| `user_id` | UUID | Optional | If applicable |
| `session_id` | VARCHAR(100) | Optional | If available |

#### 3.4.3. Event Recording Example

```javascript
// Backend service (TypeScript/Node.js)
import { analyticsService } from './services/analytics';

analyticsService.trackEvent({
  event_name: 'booking_created',
  event_category: 'business',
  timestamp: new Date().toISOString(),
  user_id: userId,
  session_id: sessionId,
  data: {
    booking_id: booking.id,
    box_id: booking.box_id,
    warehouse_id: booking.warehouse_id,
    operator_id: booking.operator_id,
    move_in_date: booking.move_in_date,
    duration_months: booking.duration_months,
    amount: booking.total_amount,
    currency: 'USD',
    status: booking.status
  }
});
```

---

## 4. Analytics Storage

### 4.1. Data Sources

The platform collects analytics data from three main sources:

| Source | Data Type | Tool | Application |
|----------|------------|------------|------------|
| **Frontend Events** | User actions | Google Analytics 4 | Product analytics, conversions |
| **Backend Events** | Business events, system metrics | PostgreSQL `analytics_events` | Business metrics, operational data |
| **System Logs** | Technical logs, errors | Grafana Loki | System monitoring, debugging |

---

### 4.2. MVP Storage

**MVP v1 Storage Strategy:**

For MVP, a simplified storage architecture without complex OLAP solutions is used.

#### 4.2.1. Google Analytics 4 (GA4) — MVP Solution

**Purpose:** Frontend event storage and analysis
**Retention:** 14 months (free tier)
**Advantages:**
- Free up to 10M events/month
- Ready-made dashboards and reports
- Integration with Google Ads, Search Console
- Automatic user journey processing
- Real-time reporting

**Used for MVP v1:**
- ✅ Product analytics (DAU/MAU, retention, funnels)
- ✅ Behavioral metrics (bounce rate, session duration)
- ✅ Conversion funnel (search → booking)
- ✅ A/B testing (experiment tracking)

**Limitations (addressed post-MVP):**
- ❌ Limited report customization
- ❌ No access to raw data (only aggregated)
- ❌ Not suitable for real-time operational analytics

---

#### 4.2.2. PostgreSQL analytics_events — MVP Solution

**Purpose:** Backend event storage
**Retention:** 13 months (with S3 archival)
**Table:** `analytics_events` (see section 3.4.1)

**Used for MVP v1:**
- ✅ Business events (bookings, warehouses, reviews)
- ✅ Operator metrics (activation, response time)
- ✅ AI events (requests, responses, costs)
- ✅ System events (API errors, slow queries)
- ✅ Custom SQL queries for BI reports

**MVP Advantages:**
- Simple integration (already using PostgreSQL)
- Flexibility (JSONB for any data)
- SQL access for data analysts
- Transactional consistency with main DB

**Limitations (addressed post-MVP):**
- ❌ Not optimized for OLAP queries (aggregations, time-series)
- ❌ Performance degradation with large volumes (>1M events)
- ❌ Limited scalability

---

### 4.3. Backup Storage

#### 4.3.1. S3 Backup (MVP)

**Purpose:** Long-term backend event archival

```
Process:
1. Weekly export analytics_events → S3 (Parquet format)
2. Storage in S3 cold storage (Glacier) — up to 7 years
3. Delete from PostgreSQL data older than 13 months
```

**S3 Structure:**

```
s3://platform-analytics/
  ├── year=2025/
  │   ├── month=12/
  │   │   ├── week=50/
  │   │   │   └── analytics_events_2025_12_w50.parquet
  │   │   └── week=51/
  │   └── month=11/
  └── year=2024/
```

**Cost Estimation (MVP):**
- 100K events/month × 1KB/event = ~100MB/month
- S3 Standard: $0.023/GB = ~$0.03/month
- Glacier: $0.004/GB = ~$0.005/month (archive)

---

### 4.4. Data Flow Architecture

#### 4.4.1. MVP v1 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ANALYTICS DATA FLOW — MVP v1                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Frontend   │                                                           │
│  │  (React App) │                                                           │
│  └───────┬──────┘                                                           │
│          │                                                                  │
│          │ gtag.js                                                          │
│          ▼                                                                  │
│  ┌──────────────┐                                                           │
│  │  Google GA4  │  ◀───────────────────────────────────────────────────    │
│  │   (Cloud)    │         14 months retention                               │
│  └──────────────┘                                                           │
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Backend    │                                                           │
│  │  (FastAPI)   │                                                           │
│  └───────┬──────┘                                                           │
│          │                                                                  │
│          │ Event Service                                                    │
│          ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  PostgreSQL: analytics_events                                │          │
│  │  - Business events                                            │          │
│  │  - System events                                              │          │
│  │  - AI events                                                  │          │
│  │  Retention: 13 months                                         │          │
│  └───────────────────┬──────────────────────────────────────────┘          │
│                      │                                                      │
│                      │ Weekly export                                        │
│                      ▼                                                      │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  S3 Backup (Parquet)                                         │          │
│  │  - Long-term archive (7 years)                                │          │
│  │  - Glacier storage for cost efficiency                        │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐                                  │
│  │  Metabase    │───────▶│ PostgreSQL   │                                  │
│  │    (BI)      │        │ (analytics)  │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key MVP v1 Principles:**
- ✅ Simple architecture: GA4 + PostgreSQL only
- ✅ No real-time streaming (not needed for MVP)
- ✅ S3 backup for compliance and long-term retention
- ✅ Metabase for custom BI reports

---

#### 4.4.2. Post-MVP Data Flow (Future)

**Not included in MVP v1 — for reference only:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ANALYTICS DATA FLOW — POST-MVP                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Frontend   │───────▶ GA4 ────────▶ BigQuery ──────▶ Looker            │
│  └──────────────┘                                                           │
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Backend    │───────▶ Kafka ──────┐                                    │
│  └──────────────┘                     │                                    │
│                                        ▼                                    │
│                              ┌────────────────┐                             │
│                              │  ClickHouse    │──────▶ Grafana              │
│                              │   (OLAP)       │                             │
│                              └────────────────┘                             │
│                                        │                                    │
│                                        ▼                                    │
│                              ┌────────────────┐                             │
│                              │   BigQuery     │──────▶ Looker               │
│                              │  (Data Lake)   │                             │
│                              └────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Post-MVP Enhancements (not in MVP v1):**
- ❌ Apache Kafka for real-time event streaming
- ❌ ClickHouse for high-performance OLAP analytics
- ❌ BigQuery as centralized data lake
- ❌ Looker/Tableau for advanced BI
- ❌ Real-time dashboards with sub-second latency
- ❌ Advanced ML pipelines on raw analytics data

---

## 5. Naming Conventions

### 5.1. Naming Format

All events follow a unified naming standard:

**Format:** `category_object_action`

| Part | Description | Examples |
|-------|----------|---------|
| **category** | Event category | search, booking, user, auth, warehouse, ai |
| **object** | Action object | result, start, submit, request, response |
| **action** | Action | click, open, apply, change, created, failed |

**Examples:**
- ✅ `search_result_click`
- ✅ `booking_start`
- ✅ `user_favorite_add`
- ✅ `ai_response_failed`
- ❌ `clickSearchResult` (incorrect format)
- ❌ `user_adds_favorite` (verb instead of noun + action)

---

### 5.2. Event Categories

| Category | Prefix | Application | Examples |
|-----------|---------|------------|---------|
| **Navigation** | `page_`, `map_`, `warehouse_`, `box_` | Platform navigation | `page_view`, `warehouse_open` |
| **Search** | `search_` | Search and filters | `search_apply_filters`, `search_result_click` |
| **Booking** | `booking_` | Booking process | `booking_start`, `booking_submit` |
| **Auth** | `auth_` | Authentication | `auth_login`, `auth_signup` |
| **User** | `user_` | User actions | `user_favorite_add`, `user_share_click` |
| **AI** | `ai_` | AI integrations | `ai_request_sent`, `ai_response_received` |
| **System** | `api_`, `db_`, `rate_` | System events | `api_error_5xx`, `db_query_slow` |

---

### 5.3. Complete Event Registry

See **Appendix A** for a complete list of all frontend and backend events.

---

### 5.4. Anti-patterns

**Avoid the following anti-patterns:**

| Anti-pattern | Why It's Bad | Correct Variant |
|-------------|--------------|---------------------|
| `clickSearchResult` | camelCase instead of snake_case | `search_result_click` |
| `user_clicks_favorite` | Present tense verb | `user_favorite_click` |
| `searchApplyFilters` | camelCase | `search_apply_filters` |
| `user_added_to_favorites` | Too verbose | `user_favorite_add` |
| `error` | Too generic | `api_error_5xx` |
| `page` | Doesn't specify action | `page_view` |

---

## 6. Event Data Schemas

### 6.1. Base Event Structure

All events (frontend and backend) contain a common set of fields:

```typescript
interface BaseEvent {
  // Required fields
  event_name: string;          // Event name
  timestamp: string;           // ISO 8601 timestamp

  // Identifiers
  session_id: string;          // Session UUID
  user_id?: string;            // User UUID (optional)

  // Context
  [key: string]: any;          // Additional data
}
```

---

### 6.2. Required and Optional Fields

#### 6.2.1. Frontend Events

| Field | Required | Type | Notes |
|------|----------------|-----|------------|
| `event_name` | **Required** | string | Name from registry |
| `timestamp` | **Required** | string (ISO 8601) | Event time |
| `session_id` | **Required** | string (UUID) | Session ID |
| `user_id` | Optional | string (UUID) | Only for authenticated users |
| `page_location` | **Required** | string (URL) | Full URL |
| `page_path` | **Required** | string | Page path |
| `device_category` | **Required** | enum | desktop / mobile / tablet |

#### 6.2.2. Backend Events

| Field | Required | Type | Notes |
|------|----------------|-----|------------|
| `event_name` | **Required** | string | Name from registry |
| `event_category` | **Required** | string | business / system / ai |
| `timestamp` | **Required** | timestamptz | Event time |
| `data` | **Required** | JSONB | Payload |
| `user_id` | Optional | UUID | If applicable |
| `session_id` | Optional | string | If available |

---

### 6.3. Event Examples by Category

#### 6.3.1. Navigation Event

```json
{
  "event_name": "warehouse_open",
  "timestamp": "2025-12-16T10:30:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "page_location": "https://platform.com/warehouses/wh_456",
  "page_path": "/warehouses/wh_456",
  "page_title": "Downtown Storage — Main St",
  "device_category": "desktop",
  "warehouse_id": "wh_456",
  "warehouse_name": "Downtown Storage",
  "city": "San Francisco"
}
```

#### 6.3.2. Search Event

```json
{
  "event_name": "search_apply_filters",
  "timestamp": "2025-12-16T10:25:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "search_query": "climate controlled storage",
  "filters": {
    "city": "San Francisco",
    "box_size": "5x5",
    "price_range": [50, 150],
    "amenities": ["climate_control", "24_7_access"]
  },
  "results_count": 12,
  "page_location": "https://platform.com/search",
  "device_category": "mobile"
}
```

#### 6.3.3. Booking Event (Frontend)

```json
{
  "event_name": "booking_submit",
  "timestamp": "2025-12-16T10:40:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "transaction_id": "bkg_123456",
  "value": 450.00,
  "currency": "USD",
  "items": [{
    "item_id": "box_789",
    "item_name": "Box 5x10",
    "item_category": "storage_box",
    "price": 150.00,
    "quantity": 1
  }],
  "booking_step": "payment_info",
  "page_location": "https://platform.com/booking/new"
}
```

#### 6.3.4. Business Event (Backend)

```json
{
  "id": "evt_abc123",
  "event_name": "booking_status_changed",
  "event_category": "business",
  "timestamp": "2025-12-16T11:00:00Z",
  "user_id": "usr_xyz789",
  "operator_id": "op_123",
  "data": {
    "booking_id": "bkg_123456",
    "old_status": "pending_confirmation",
    "new_status": "confirmed",
    "changed_by": "operator",
    "change_reason": "Confirmed availability",
    "operator_response_time_minutes": 15
  },
  "created_at": "2025-12-16T11:00:00Z"
}
```

#### 6.3.5. AI Event (Backend)

```json
{
  "id": "evt_xyz789",
  "event_name": "ai_response_received",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:02Z",
  "user_id": "usr_xyz789",
  "session_id": "sess_abc123",
  "data": {
    "request_id": "ai_req_123",
    "ai_provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "request_type": "search",
    "response_time_ms": 1842,
    "tokens_used": 450,
    "tokens_input": 200,
    "tokens_output": 250,
    "results_count": 5,
    "cost_usd": 0.008,
    "success": true
  },
  "created_at": "2025-12-16T10:30:02Z"
}
```

---

### 6.4. Event Validation

#### 6.4.1. Frontend Validation

```typescript
// Frontend validation (TypeScript)
class EventValidator {
  static validate(event: FrontendEvent): boolean {
    // Required fields
    if (!event.event_name || !event.timestamp || !event.session_id) {
      console.error('Missing required fields:', event);
      return false;
    }

    // Timestamp format check
    if (!this.isValidISO8601(event.timestamp)) {
      console.error('Invalid timestamp format:', event.timestamp);
      return false;
    }

    // Session ID check
    if (!this.isValidUUID(event.session_id)) {
      console.error('Invalid session_id:', event.session_id);
      return false;
    }

    return true;
  }

  private static isValidISO8601(timestamp: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(timestamp);
  }

  private static isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
  }
}
```

#### 6.4.2. Backend Validation

```python
# Backend validation (Python)
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

class BackendEvent(BaseModel):
    event_name: str = Field(..., min_length=3, max_length=100)
    event_category: str = Field(..., regex='^(business|system|ai)$')
    timestamp: datetime
    user_id: Optional[uuid.UUID] = None
    session_id: Optional[str] = None
    data: Dict[str, Any]

    @validator('event_name')
    def validate_event_name(cls, v):
        # Format check: category_object_action
        parts = v.split('_')
        if len(parts) < 2:
            raise ValueError('Event name must follow format: category_object_action')
        return v

    @validator('data')
    def validate_data_not_empty(cls, v):
        if not v:
            raise ValueError('Data field cannot be empty')
        return v
```

---

## 7. A/B Testing Framework

**Note:** This section describes the analytics and tracking aspects of the A/B testing framework. For the complete architecture, including variant assignment, feature flagging, statistical testing, and experiment lifecycle management, refer to **DOC-003: A/B Testing & Experimentation Framework**.

This section focuses specifically on:
- How A/B test events are tracked
- How experiment data is logged
- How metrics are measured for experiments
- Integration with analytics infrastructure

For details on experiment design, randomization algorithms, sample size calculations, and experimentation best practices, see **DOC-003**.

---

### 7.1. System Architecture

A/B testing on the platform is implemented through:
1. **Feature Flags** — experiment variant management
2. **Event Tracking** — tracking user actions in experiments
3. **Metrics Calculation** — calculating metrics by groups (control vs. treatment)
4. **Statistical Analysis** — determining result significance

**Note:** The complete feature flag architecture, including flag service, configuration management, and rollout strategies, is described in **DOC-003: A/B Testing & Experimentation Framework**. This section covers only the analytics integration.

```
┌───────────────────────────────────────────────────────────────┐
│               A/B TESTING ARCHITECTURE                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                                             │
│  │   Frontend   │                                             │
│  └───────┬──────┘                                             │
│          │                                                    │
│          │ 1. Request variant                                 │
│          ▼                                                    │
│  ┌──────────────────┐                                         │
│  │  Feature Flag    │ ◀────── LaunchDarkly / PostHog          │
│  │    Service       │                                         │
│  └───────┬──────────┘                                         │
│          │                                                    │
│          │ 2. Return variant (A/B)                            │
│          ▼                                                    │
│  ┌──────────────┐                                             │
│  │   Render UI  │                                             │
│  │  (Variant A  │                                             │
│  │   or B)      │                                             │
│  └───────┬──────┘                                             │
│          │                                                    │
│          │ 3. Track events with variant_id                    │
│          ▼                                                    │
│  ┌──────────────────┐                                         │
│  │  GA4 + Backend   │                                         │
│  │  Analytics       │                                         │
│  └──────────────────┘                                         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### 7.2. User Segmentation

**User Assignment:**
For complete details on user segmentation algorithms, hash-based assignment, and traffic allocation strategies, refer to **DOC-003: A/B Testing & Experimentation Framework**.

Users are assigned to experiment variants on their first visit:

```typescript
// Simplified example — full algorithm in DOC-003
interface ExperimentVariant {
  experiment_id: string;        // "exp_search_ai_v1"
  variant_id: string;           // "control" | "treatment_a" | "treatment_b"
  assigned_at: string;          // ISO 8601 timestamp
}

// Example: User assigned to experiment
const userVariant: ExperimentVariant = {
  experiment_id: 'exp_search_ai_v1',
  variant_id: 'treatment_a',
  assigned_at: '2025-12-16T10:00:00Z'
};
```

**Tracking variant assignment:**

```javascript
// Frontend: Track variant assignment
gtag('event', 'experiment_assigned', {
  experiment_id: 'exp_search_ai_v1',
  variant_id: 'treatment_a',
  user_id: currentUser.id,
  session_id: sessionId
});
```

---

### 7.3. Feature Flags

**Feature Flag Architecture:**  
For complete details on feature flag service implementation, configuration management, flag types (boolean, multivariate, rollout), and targeting rules, refer to **DOC-003: A/B Testing & Experimentation Framework**.

Feature flag examples:

| Flag Key | Variants | Description |
|----------|----------|-------------|
| `search_ai_enabled` | true / false | Enable AI search |
| `booking_flow_v2` | control / variant_a / variant_b | New booking flow |
| `price_display_format` | default / with_discount / with_monthly | Price display format |

**Example: Checking feature flag**

```typescript
// Frontend
const variant = featureFlags.getVariant('booking_flow_v2', userId);

if (variant === 'variant_a') {
  // Render new booking flow A
} else if (variant === 'variant_b') {
  // Render new booking flow B
} else {
  // Render control (current) flow
}

// Track which variant was shown
gtag('event', 'experiment_view', {
  experiment_id: 'exp_booking_flow_v2',
  variant_id: variant,
  user_id: userId
});
```

---

### 7.4. Measured Metrics

**Statistical Testing & Sample Size:**
For complete details on statistical significance testing, sample size calculations, minimum detectable effects (MDE), and power analysis, refer to **DOC-003: A/B Testing & Experimentation Framework**.

For each A/B test, **Primary** and **Secondary** metrics are defined:

#### 7.4.1. Primary Metrics

| Metric | Description | Formula | Example Experiment |
|---------|----------|---------|---------------------|
| **Conversion Rate** | Percentage of conversions to target action | `Conversions / Total Users * 100%` | Search → Booking |
| **Click-Through Rate (CTR)** | Click percentage | `Clicks / Impressions * 100%` | AI Search Results |
| **Average Session Duration** | Average session duration | `AVG(session_duration)` | New Homepage Design |
| **Booking Value** | Average booking cost | `AVG(booking_amount)` | Price Display Format |

#### 7.4.2. Secondary Metrics

| Metric | Description | Formula | Application |
|---------|----------|---------|------------|
| **Bounce Rate** | Bounce percentage | `Bounces / Total Sessions * 100%` | Traffic quality check |
| **Page Views per Session** | View depth | `Total Page Views / Total Sessions` | Engagement |
| **Time to First Booking** | Time to first booking | `AVG(first_booking_time - signup_time)` | Onboarding effectiveness |
| **Operator Response Time** | Operator response time | `AVG(operator_response_time)` | Operator UX |

---

### 7.5. Statistical Significance

**Complete Statistical Methods:**
For detailed information on statistical testing methods, confidence intervals, multiple testing corrections (Bonferroni, FDR), and sequential testing, refer to **DOC-003: A/B Testing & Experimentation Framework**.

**Experiment evaluation criteria:**

| Parameter | Value | Notes |
|----------|----------|------------|
| **Minimum Sample Size** | 1,000 users per variant | For reliable results |
| **Confidence Level** | 95% | Standard confidence level |
| **Statistical Power** | 80% | Probability of detecting effect |
| **Minimum Detectable Effect (MDE)** | 5% relative change | Minimum significant effect |
| **Test Duration** | 1-2 weeks | Minimum 1 business cycle |

**Example: Statistical Significance Calculation**

```python
# Simplified example — full implementation in DOC-003
from scipy import stats

# Control group
control_conversions = 450
control_total = 10000
control_rate = control_conversions / control_total  # 4.5%

# Treatment group
treatment_conversions = 520
treatment_total = 10000
treatment_rate = treatment_conversions / treatment_total  # 5.2%

# Z-test for proportions
z_stat, p_value = stats.proportions_ztest(
    [control_conversions, treatment_conversions],
    [control_total, treatment_total]
)

if p_value < 0.05:
    print(f"Significant difference: treatment {treatment_rate:.2%} vs control {control_rate:.2%}")
    print(f"Relative lift: {(treatment_rate - control_rate) / control_rate * 100:.1f}%")
else:
    print("No significant difference detected")
```

---

## 8. Dashboard Requirements

### 8.1. Product Manager Dashboards

#### 8.1.1. Product Overview Dashboard

**Purpose:** General product health overview
**Tool:** Google Analytics 4
**Refresh Rate:** Real-time

**Widgets:**

| Widget | Metric | Visualization |
|--------|---------|---------------|
| **Daily Active Users (DAU)** | `COUNT(DISTINCT user_id)` | Line chart (7 days) |
| **Conversion Funnel** | Search → Booking → Confirmed | Funnel chart |
| **Top Pages** | Page views, bounce rate | Table |
| **Traffic Sources** | Organic, Direct, Referral | Pie chart |
| **User Retention** | D1, D7, D30 retention | Cohort table |

**Example Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT OVERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DAU: 342 (+12%)          MAU: 4,521 (+8%)    DAU/MAU: 7.6%   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Conversion Funnel                                       │  │
│  │  Search:      1,234  (100%)  ──────────────────          │  │
│  │  Warehouse:     740  (60%)   ────────────                │  │
│  │  Box View:      296  (24%)   ──────                      │  │
│  │  Booking:        74  (6%)    ──                          │  │
│  │  Confirmed:      52  (4.2%)  ─                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Top Pages                                               │  │
│  │  /search         2,341 views    35% bounce               │  │
│  │  /warehouses/wh_ 1,823 views    22% bounce               │  │
│  │  /booking/new      452 views    18% bounce               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 8.1.2. Search Performance Dashboard

**Purpose:** Search effectiveness analysis
**Tool:** GA4 + Metabase (PostgreSQL)
**Refresh Rate:** Hourly

**Metrics:**

| Metric | Description | Visualization |
|---------|----------|---------------|
| **Search Volume** | Number of searches | Time series |
| **Search → Click CTR** | Percentage of clicks on results | Line chart |
| **Search → Booking** | Conversion to booking | Funnel |
| **Zero Results Rate** | Percentage of searches without results | Gauge |
| **AI Search Usage** | Percentage of AI searches | Pie chart |
| **Top Search Queries** | Popular queries | Table |

---

#### 8.1.3. Booking Funnel Dashboard

**Purpose:** Booking process analysis
**Tool:** Metabase (PostgreSQL)
**Refresh Rate:** Hourly

**Metrics:**

| Metric | Description | SQL Query |
|---------|----------|-----------|
| **Booking Started** | `COUNT(booking_start)` | `SELECT COUNT(*) FROM analytics_events WHERE event_name = 'booking_start'` |
| **Booking Submitted** | `COUNT(booking_submit)` | `SELECT COUNT(*) FROM analytics_events WHERE event_name = 'booking_submit'` |
| **Booking Confirmed** | `COUNT(booking_confirmed)` | `SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'` |
| **Drop-off Rate by Step** | `(Step N - Step N+1) / Step N` | Calculated |
| **Average Time per Step** | `AVG(step_duration)` | From session data |

---

### 8.2. Operator Dashboards

#### 8.2.1. Operator Dashboard (In-App)

**Purpose:** Metrics for warehouse owners
**Tool:** Frontend (React) + Backend API
**Refresh Rate:** Real-time

**Widgets:**

| Widget | Metric | API Endpoint |
|--------|---------|--------------|
| **New Requests Today** | `COUNT(bookings WHERE status = 'pending')` | `GET /api/v1/operators/{id}/stats` |
| **Confirmed Bookings** | `COUNT(bookings WHERE status = 'confirmed')` | Same |
| **Occupancy Rate** | `Booked Boxes / Total Boxes * 100%` | Same |
| **Average Response Time** | `AVG(response_time)` | Same |
| **Revenue This Month** | `SUM(booking_amount)` | Same |

**Example Operator Dashboard:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPERATOR DASHBOARD                           │
│                    Downtown Storage — Main St                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Requests: 5        Confirmed: 12       Occupancy: 68%    │
│  Avg Response: 2h       Revenue MTD: $3,450                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pending Requests                                        │  │
│  │  1. Jane Doe    - 5x10 box   - 2 hours ago              │  │
│  │  2. John Smith  - 10x10 box  - 4 hours ago              │  │
│  │  3. Alice Brown - 5x5 box    - 6 hours ago              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Occupancy Trend (Last 7 days)                          │  │
│  │  [Line chart showing 62% → 68%]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.3. Technical Dashboards

#### 8.3.1. System Health Dashboard

**Purpose:** Platform technical health monitoring
**Tool:** Grafana
**Refresh Rate:** Real-time (30s)
**Related Document:** See **DOC-086: Monitoring & Observability Plan** for complete system monitoring architecture

**Metrics:**

| Metric | Description | Data Source |
|---------|----------|-------------|
| **API Response Time (p50, p95, p99)** | API Latency | Prometheus |
| **Error Rate (4xx, 5xx)** | Error percentage | ClickHouse |
| **Request Rate** | Requests per second | Prometheus |
| **Database Query Time** | Average query time | PostgreSQL |
| **CPU / Memory Usage** | Resource utilization | Node Exporter |
| **Active Connections** | Active connections | PostgreSQL |

---

#### 8.3.2. AI Core Dashboard

**Purpose:** AI component monitoring
**Tool:** Grafana
**Refresh Rate:** Real-time (1m)

**Metrics:**

| Metric | Description | Data Source |
|---------|----------|-------------|
| **AI Request Volume** | Requests per hour | ClickHouse |
| **AI Success Rate** | `Successful / Total * 100%` | ClickHouse |
| **AI Response Time (p50, p95)** | Latency | ClickHouse |
| **AI Cost per Day** | Total API cost | Aggregated |
| **Fallback Rate** | `Fallbacks / Total * 100%` | ClickHouse |
| **Token Usage** | Input + Output tokens | ClickHouse |

---

### 8.4. Tools and Platforms

#### 8.4.1. Used Tools (MVP)

| Purpose | Tool | Justification |
|------------|------------|-------------|
| **Product Analytics** | GA4 | Free, Google integration |
| **System Monitoring** | Grafana | Open-source, flexible dashboards |
| **Log Analysis** | Grafana Loki | Grafana integration |
| **Alerting** | Grafana + PagerDuty | Alerting rules + escalation |
| **BI / Reporting** | Metabase | Open-source, SQL-based |
| **Error Tracking** | Sentry | Real-time error tracking |

#### 8.4.2. Integrations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD INTEGRATIONS — MVP v1                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │    GA4       │  ◀─────────────────────────────────────────────          │
│  │  (Product)   │         14 months retention                               │
│  └──────────────┘         Frontend events only                              │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐                                  │
│  │  PostgreSQL  │───────▶│  Metabase    │                                  │
│  │ (analytics_  │        │    (BI)      │                                  │
│  │   events)    │        │              │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │  PostgreSQL  │───────▶│   Grafana    │───────▶│  PagerDuty   │          │
│  │   (System    │        │ (Dashboards) │        │  (Alerts)    │          │
│  │   Metrics)   │        │              │        │              │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│         ▲                       ▲                                           │
│         │                       │                                           │
│  ┌──────┴───────┐        ┌──────┴───────┐                                  │
│  │ Application  │        │    Loki      │                                  │
│  │    Logs      │───────▶│   (Logs)     │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Post-MVP Integrations (Not in MVP v1):**
- ❌ BigQuery (data lake)
- ❌ Looker (advanced BI)
- ❌ ClickHouse (OLAP analytics)

---

#### 8.4.3. Dashboard Access

| Role | Dashboards | Access |
|------|----------|--------|
| **Product Manager** | Product Overview, Search, Booking Funnel | View |
| **Operator** | Operator Dashboard (in-app) | View own data |
| **Developer** | System Health, AI Core | View + Alert config |
| **DevOps** | All technical dashboards | Full access |
| **Admin** | All dashboards | Full access |

---

## Appendices

### Appendix A: Complete Event Registry

#### Frontend Events (Complete List)

| # | Event Name | Category | Priority | Description |
|---|------------|----------|----------|-------------|
| 1 | `page_view` | Navigation | HIGH | Page view |
| 2 | `page_exit` | Navigation | LOW | Page exit |
| 3 | `search_open` | Navigation | HIGH | Open search |
| 4 | `map_open` | Navigation | MEDIUM | Open map |
| 5 | `warehouse_open` | Navigation | HIGH | View warehouse |
| 6 | `box_open` | Navigation | HIGH | View box |
| 7 | `search_apply_filters` | Search | HIGH | Apply filters |
| 8 | `search_reset_filters` | Search | MEDIUM | Reset filters |
| 9 | `search_result_click` | Search | HIGH | Click on result |
| 10 | `search_sort_change` | Search | MEDIUM | Change sorting |
| 11 | `search_pagination` | Search | LOW | Pagination |
| 12 | `search_no_results` | Search | MEDIUM | Empty results |
| 13 | `map_marker_click` | Map | MEDIUM | Click on marker |
| 14 | `map_cluster_click` | Map | LOW | Click on cluster |
| 15 | `map_zoom` | Map | LOW | Change zoom |
| 16 | `booking_start` | Booking | HIGH | Start booking |
| 17 | `booking_step_complete` | Booking | MEDIUM | Complete step |
| 18 | `booking_submit` | Booking | HIGH | Submit request |
| 19 | `booking_success` | Booking | HIGH | Successful submission |
| 20 | `booking_error` | Booking | HIGH | Error |
| 21 | `booking_abandon` | Booking | MEDIUM | Abandon form |
| 22 | `auth_login` | Auth | HIGH | Login |
| 23 | `auth_signup` | Auth | HIGH | Signup |
| 24 | `auth_logout` | Auth | MEDIUM | Logout |
| 25 | `auth_password_reset` | Auth | MEDIUM | Password reset |
| 26 | `user_favorite_add` | User | MEDIUM | Add to favorites |
| 27 | `user_favorite_remove` | User | LOW | Remove from favorites |
| 28 | `user_share_click` | User | LOW | Share |

#### Backend Events (Complete List)

| # | Event Name | Category | Storage | Description |
|---|------------|----------|---------|-------------|
| 1 | `booking_created` | Business | PG + CH | Create booking |
| 2 | `booking_status_changed` | Business | PG + CH | Status change |
| 3 | `booking_cancelled` | Business | PG + CH | Cancellation |
| 4 | `booking_completed` | Business | PG + CH | Completion |
| 5 | `warehouse_created` | Business | PG | Add warehouse |
| 6 | `warehouse_updated` | Business | PG | Update warehouse |
| 7 | `warehouse_published` | Business | PG + CH | Publication |
| 8 | `box_price_changed` | Business | PG + CH | Price change |
| 9 | `review_submitted` | Business | PG | New review |
| 10 | `api_request` | System | CH | API request |
| 11 | `api_error_4xx` | System | CH | 4xx error |
| 12 | `api_error_5xx` | System | CH | 5xx error |
| 13 | `rate_limit_exceeded` | System | CH | Rate limit |
| 14 | `db_query_slow` | System | Logs | Slow query |
| 15 | `ai_request_sent` | AI | CH | AI request |
| 16 | `ai_response_received` | AI | CH | AI response |
| 17 | `ai_response_failed` | AI | CH | AI error |
| 18 | `ai_fallback_used` | AI | Fallback |

**Note:** Events marked "PG + CH" indicate storage in both PostgreSQL (MVP v1) and ClickHouse (Post-MVP). For MVP v1, only PostgreSQL storage is implemented.

---

### Appendix B: GA4 Mapping

| Our Event | GA4 Event | GA4 Parameters |
|-----------|-----------|----------------|
| `page_view` | `page_view` | page_location, page_title |
| `search_apply_filters` | `search` | search_term, filters_count |
| `warehouse_open` | `view_item` | item_id, item_name, item_category |
| `booking_start` | `begin_checkout` | value, currency, items |
| `booking_submit` | `purchase` | transaction_id, value, items |
| `auth_signup` | `sign_up` | method |
| `auth_login` | `login` | method |

---

### Appendix C: Integration Checklist

#### Frontend Integration Checklist

- [ ] GA4 tag installed (gtag.js)
- [ ] Custom dimensions configured
- [ ] Analytics Service implemented
- [ ] All navigation events added
- [ ] All search events added
- [ ] All booking events added
- [ ] All auth events added
- [ ] Error tracking configured
- [ ] Testing completed in GA4 DebugView
- [ ] Conversions configured in GA4

#### Backend Integration Checklist

- [ ] analytics_events table created
- [ ] Event Service implemented
- [ ] All business events added
- [ ] All system events added
- [ ] All AI events added
- [ ] Structured logging configured (see DOC-086)
- [ ] Retention policy configured per DOC-036
- [ ] S3 backup configured
- [ ] DOC-071 compliance implemented (PII handling)
- [ ] Load testing completed

#### Dashboard Checklist

- [ ] GA4 dashboard configured
- [ ] Grafana system health dashboard created (see DOC-086)
- [ ] Grafana AI dashboard created
- [ ] Alerting rules configured (see DOC-086)
- [ ] Metabase configured for BI
- [ ] All metrics documented

#### Post-MVP Enhancements (Not in MVP v1)

- [ ] ClickHouse export configured
- [ ] BigQuery data lake configured
- [ ] Real-time streaming implemented (Kafka)
- [ ] Looker/Tableau BI layer created

---

**— End of Document —**

*Version: 1.1 | December 2025 | Self-Storage Aggregator MVP*  
*Status: GREEN — Final Approved for Implementation*

**Document History:**
- v1.0 (Initial Release) — December 2025
- v1.1 (GREEN Status) — December 2025 — Added architecture alignment section, clarified MVP vs. Post-MVP storage, added compliance references, linked A/B testing to DOC-003
