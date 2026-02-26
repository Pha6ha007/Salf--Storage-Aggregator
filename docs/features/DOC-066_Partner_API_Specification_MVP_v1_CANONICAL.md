# Partner API Specification (MVP v1)

**Document ID:** DOC-066  
**Version:** 1.0 CANONICAL  
**Status:** 🟢 Canonical — Partner-Facing API Contract  
**Date:** December 17, 2025  
**Phase:** MVP v1

---

## Document Role & Scope

### Document Status

**This is a Partner API Specification** — defining the external, partner-facing subset of the Self-Storage Aggregator platform's capabilities.

**Critical Understanding:**

| Aspect | This Document (DOC-066) | Internal API (DOC-101) |
|--------|-------------------------|------------------------|
| **Audience** | External partners, integrators | Platform internal services, admin operations |
| **Authority** | Subset of internal capabilities | **Source of truth** for ALL API functionality |
| **Scope** | Read-only catalog access, lead submission | Full CRUD, moderation, AI configuration, system admin |
| **Access Control** | API keys, limited scopes | JWT-based, full role hierarchy |
| **Purpose** | Enable partner integrations | Platform operations |

**Relationship to Internal API:**
- DOC-101 (Internal / Admin API Specification) is the **authoritative source of truth**
- This document (DOC-066) defines **what is exposed** to partners
- Where conflicts exist, DOC-101 takes precedence
- Partner API is a **curated, restricted exposure** of internal capabilities

### MVP v1 Limitations

**Platform Capabilities:**
- Partner API supports **MVP v1 use cases only**
- Advanced features (webhooks, bulk operations, real-time updates) are **out of scope**
- API capabilities are subject to platform technical availability
- Features may be applied progressively based on platform maturity

**Not Supported in MVP v1:**
- Real-time availability updates
- Webhook subscriptions for events
- Bulk catalog synchronization
- Advanced search ranking or AI-powered recommendations via Partner API
- White-label or co-branded experiences
- Custom SLA commitments

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [API Conventions & Standards](#3-api-conventions--standards)
4. [Catalog API — Warehouse & Box Listings](#4-catalog-api--warehouse--box-listings)
5. [Leads API — Booking Inquiry Submission](#5-leads-api--booking-inquiry-submission)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting & Fair Usage](#7-rate-limiting--fair-usage)
8. [Security & Compliance](#8-security--compliance)
9. [Versioning & Deprecation](#9-versioning--deprecation)
10. [Out of Scope — Post-MVP](#10-out-of-scope--post-mvp)
11. [References & Dependencies](#11-references--dependencies)

---

# 1. Introduction

## 1.1. Purpose

This document specifies the **Partner API** for the Self-Storage Aggregator platform (MVP v1). The Partner API enables external partners to:

- Access warehouse and box catalog data (read-only)
- Submit booking inquiries (leads) on behalf of end users
- Integrate platform inventory into their own systems or applications

**Target Audience:**
- Aggregation partners (comparison sites, marketplaces)
- Integration partners (property management systems, CRMs)
- Affiliate partners (referral programs)

## 1.2. What This API Is NOT

**This API does NOT provide:**
- ❌ Admin or moderation capabilities
- ❌ Direct booking confirmation (only lead submission)
- ❌ Operator-facing warehouse management
- ❌ Platform configuration or feature flags
- ❌ User account management (beyond lead contact information)
- ❌ Payment processing or financial transactions
- ❌ Real-time inventory updates or webhooks (MVP limitation)

For internal platform operations, refer to **DOC-101 (Internal / Admin API Specification)**.

## 1.3. MVP v1 Scope Boundaries

**Included in MVP v1:**
- Public catalog read access (warehouses, boxes, cities)
- Basic search and filtering
- Lead (booking inquiry) submission
- Partner-level analytics (aggregate only, via separate reporting)

**Explicitly NOT in MVP v1:**
- Webhooks or event subscriptions
- Real-time availability sync
- Bulk catalog export
- Custom search ranking
- White-label configurations

---

# 2. Authentication & Authorization

## 2.1. Authentication Method

**API Key-Based Authentication:**

Partners authenticate using **API keys** issued by the platform. Each API key is scoped to specific permissions and rate limits.

**Header Format:**
```http
X-API-Key: pk_live_abc123def456ghi789
```

**Environments:**
- **Sandbox / Test:** `pk_test_*` — For development and testing
- **Production:** `pk_live_*` — For production integrations

**Security Requirements:**
- API keys **MUST** be transmitted over HTTPS only
- Keys **MUST NOT** be exposed in client-side code or public repositories
- Keys **SHOULD** be rotated periodically (quarterly recommended)

## 2.2. API Key Scopes

Partners are assigned specific **scopes** that define permitted operations:

| Scope | Description | MVP v1 Status |
|-------|-------------|---------------|
| `catalog:read` | Read warehouse and box catalog | ✅ Supported |
| `leads:write` | Submit booking inquiries (leads) | ✅ Supported |
| `analytics:read` | Access aggregate partner analytics | ⚠️ Limited (future) |
| `webhooks:manage` | Configure webhook subscriptions | ❌ Not in MVP v1 |

**Scope Enforcement:**
- Requests outside assigned scopes return `403 Forbidden`
- Scope assignment is managed by platform administrators
- Scope changes require platform support intervention

## 2.3. Partner Types

Partners are classified into tiers based on integration requirements and access levels:

| Tier | Description | Rate Limits | Scopes |
|------|-------------|-------------|--------|
| **Basic** | Simple catalog access | 100 req/min | `catalog:read` |
| **Standard** | Catalog + lead submission | 300 req/min | `catalog:read`, `leads:write` |
| **Advanced** | Higher volume integrations | 1000 req/min | All MVP scopes |

**Note:** Rate limits are **subject to platform configuration** and may vary by region or partner agreement.

---

# 3. API Conventions & Standards

## 3.1. Base URL

**Production:** `https://api.storagecompare.ae/partner/v1`  
**Sandbox:** `https://api-sandbox.storagecompare.ae/partner/v1`

**All endpoints** in this document are relative to the base URL.

## 3.2. Request Format

**HTTP Methods:**
- `GET` — Retrieve resources (catalog data)
- `POST` — Create resources (submit leads)

**Content Type:**
- **Request:** `application/json`
- **Response:** `application/json`

**Required Headers:**
```http
X-API-Key: pk_live_abc123def456ghi789
Content-Type: application/json
Accept: application/json
```

## 3.3. Response Format

**Success Response Structure:**
```json
{
  "success": true,
  "data": { /* resource or collection */ },
  "pagination": { /* if applicable */ },
  "meta": {
    "timestamp": "2025-12-17T14:30:00Z",
    "request_id": "req_partner_abc123"
  }
}
```

**Collection Response (with pagination):**
```json
{
  "success": true,
  "data": [ /* array of resources */ ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 147,
    "total_pages": 8,
    "has_next": true,
    "has_previous": false
  },
  "meta": {
    "timestamp": "2025-12-17T14:30:00Z",
    "request_id": "req_partner_abc123"
  }
}
```

## 3.4. Pagination

**Query Parameters:**
- `page` (integer, default: 1) — Page number
- `per_page` (integer, default: 20, max: 100) — Items per page

**Example:**
```http
GET /partner/v1/warehouses?page=2&per_page=50
```

## 3.5. Filtering & Sorting

**Common Filter Parameters:**
- `city` (string) — Filter by city name or ID
- `min_price` (integer) — Minimum monthly price
- `max_price` (integer) — Maximum monthly price
- `size` (enum: S, M, L, XL) — Box size category
- `available_only` (boolean, default: true) — Show only available boxes

**Sorting:**
- `sort` (string) — Field to sort by (e.g., `price`, `rating`)
- `order` (enum: `asc`, `desc`, default: `asc`) — Sort direction

**Example:**
```http
GET /partner/v1/warehouses?city=Moscow&min_price=3000&sort=price&order=asc
```

## 3.6. Data Formats

**Dates & Times:**
- ISO 8601 format with timezone: `2025-12-17T14:30:00Z`
- All timestamps in UTC unless otherwise specified

**Currency:**
- Prices represented as integers in minor currency units (e.g., kopecks, cents)
- Currency code provided in response metadata or regional context
- Example: `5000` = 5000 kopecks = 50.00 AED

**Coordinates:**
- Latitude/Longitude as decimal numbers
- Format: `{"lat": 55.751244, "lon": 37.618423}`

---

# 4. Catalog API — Warehouse & Box Listings

## 4.1. List Warehouses

**Endpoint:** `GET /partner/v1/warehouses`

**Description:**  
Retrieve a paginated list of warehouses matching filter criteria.

**Authorization:** Requires scope `catalog:read`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `city` | string | - | City name or ID filter |
| `lat` | float | - | Latitude for geo search |
| `lon` | float | - | Longitude for geo search |
| `radius` | integer | - | Search radius in meters (requires lat/lon) |
| `min_price` | integer | 0 | Minimum monthly price filter |
| `max_price` | integer | - | Maximum monthly price filter |
| `features` | string[] | - | Required features (e.g., `climate_control`, `cctv_24_7`) |
| `sort` | string | `distance` | Sort field (`distance`, `price`, `rating`) |
| `order` | string | `asc` | Sort order (`asc`, `desc`) |

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "SkladOK Vykhino",
      "slug": "skladok-vykhino",
      "description": "Modern climate-controlled storage facility...",
      "address": {
        "full_address": "Moscow, Vykhino-Zhulebino district, ul. Tashkentskaya, 23",
        "city": "Moscow",
        "district": "Vykhino-Zhulebino"
      },
      "coordinates": {
        "lat": 55.714521,
        "lon": 37.816830
      },
      "price_from": 3000,
      "rating": 4.8,
      "review_count": 127,
      "features": ["climate_control", "cctv_24_7", "access_24_7", "parking"],
      "photos": [
        {
          "url": "https://cdn.storagecompare.ae/warehouses/101/main.jpg",
          "is_primary": true
        }
      ],
      "distance": 2350,
      "box_count": 42,
      "available_box_count": 18
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 47,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false
  },
  "meta": {
    "timestamp": "2025-12-17T14:30:00Z",
    "request_id": "req_partner_wh_list_001"
  }
}
```

**Notes:**
- **Distance-based sorting** requires `lat` and `lon` parameters
- **Rating** reflects aggregate customer reviews (subject to moderation)
- **Features** list is platform-defined; not extensible by partners
- **Price data** reflects pricing as configured by operators; subject to change

---

## 4.2. Get Warehouse Details

**Endpoint:** `GET /partner/v1/warehouses/{id}`

**Description:**  
Retrieve detailed information about a specific warehouse.

**Authorization:** Requires scope `catalog:read`

**Path Parameters:**
- `id` (integer) — Warehouse ID

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "name": "SkladOK Vykhino",
    "slug": "skladok-vykhino",
    "description": "Modern climate-controlled storage facility with 24/7 access...",
    "address": {
      "full_address": "Moscow, Vykhino-Zhulebino district, ul. Tashkentskaya, 23",
      "city": "Moscow",
      "district": "Vykhino-Zhulebino",
      "postal_code": "109472"
    },
    "coordinates": {
      "lat": 55.714521,
      "lon": 37.816830
    },
    "contact": {
      "phone": "+7 (495) 123-45-67",
      "email": "info@skladok-vykhino.ru",
      "website": "https://skladok-vykhino.ru"
    },
    "working_hours": {
      "monday": "00:00-23:59",
      "tuesday": "00:00-23:59",
      "wednesday": "00:00-23:59",
      "thursday": "00:00-23:59",
      "friday": "00:00-23:59",
      "saturday": "00:00-23:59",
      "sunday": "00:00-23:59",
      "is_24_7": true
    },
    "features": ["climate_control", "cctv_24_7", "access_24_7", "parking", "security_guard"],
    "rating": 4.8,
    "review_count": 127,
    "price_from": 3000,
    "photos": [
      {
        "id": 1001,
        "url": "https://cdn.storagecompare.ae/warehouses/101/main.jpg",
        "is_primary": true
      },
      {
        "id": 1002,
        "url": "https://cdn.storagecompare.ae/warehouses/101/entrance.jpg",
        "is_primary": false
      }
    ],
    "operator": {
      "id": 201,
      "company_name": "SkladOK LLC",
      "phone": "+7 (495) 123-45-67"
    },
    "box_count": 42,
    "available_box_count": 18,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-12-10T15:20:00Z"
  },
  "meta": {
    "timestamp": "2025-12-17T14:35:00Z",
    "request_id": "req_partner_wh_detail_001"
  }
}
```

**Notes:**
- **Operator details** are limited to contact information; full operator profiles not exposed
- **Box availability** reflects current platform data; not guaranteed real-time
- **Pricing** is operator-managed; platform provides aggregated view only

---

## 4.3. List Boxes for Warehouse

**Endpoint:** `GET /partner/v1/warehouses/{warehouse_id}/boxes`

**Description:**  
Retrieve available boxes for a specific warehouse.

**Authorization:** Requires scope `catalog:read`

**Path Parameters:**
- `warehouse_id` (integer) — Warehouse ID

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | enum | - | Filter by size: `S`, `M`, `L`, `XL` |
| `min_price` | integer | 0 | Minimum monthly price |
| `max_price` | integer | - | Maximum monthly price |
| `available_only` | boolean | true | Show only available boxes |
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max: 100) |

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 501,
      "warehouse_id": 101,
      "size": "M",
      "dimensions": {
        "width": 200,
        "length": 200,
        "height": 250,
        "unit": "cm"
      },
      "area": 4.0,
      "volume": 10.0,
      "price_per_month": 5000,
      "currency": "RUB",
      "number": "M-205",
      "floor": 2,
      "total_quantity": 5,
      "available_quantity": 3,
      "features": ["climate_control", "cctv"]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 18,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  },
  "meta": {
    "timestamp": "2025-12-17T14:40:00Z",
    "request_id": "req_partner_boxes_001"
  }
}
```

**Notes:**
- **Size categories** (S, M, L, XL) are platform-defined mappings of dimension ranges
- **Availability** reflects current platform data; **not guaranteed real-time**
- **Pricing** is operator-set; may vary based on duration or platform promotions

---

## 4.4. Search Warehouses (Universal Search)

**Endpoint:** `GET /partner/v1/search`

**Description:**  
Universal search endpoint combining text, geo, and filter-based queries.

**Authorization:** Requires scope `catalog:read`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | - | Search query (city, district, address) |
| `lat` | float | - | Latitude for geo search |
| `lon` | float | - | Longitude for geo search |
| `radius` | integer | 5000 | Search radius in meters (requires lat/lon) |
| `min_price` | integer | 0 | Minimum monthly price |
| `max_price` | integer | - | Maximum monthly price |
| `size` | enum | - | Box size filter: `S`, `M`, `L`, `XL` |
| `features` | string[] | - | Required features |
| `sort` | string | `relevance` | Sort field |
| `order` | string | `desc` | Sort order |
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max: 100) |

**Response Format:**  
Same as `GET /partner/v1/warehouses` (see §4.1).

**Notes:**
- **Relevance sorting** uses platform-defined ranking algorithm (not customizable by partners)
- **Text search** matches against warehouse name, address, city, district
- **Geo search** prioritizes proximity when `lat`/`lon` provided

---

## 4.5. List Cities

**Endpoint:** `GET /partner/v1/cities`

**Description:**  
Retrieve a list of cities where warehouses are available.

**Authorization:** Requires scope `catalog:read`

**Query Parameters:**
- `page` (integer, default: 1) — Page number
- `per_page` (integer, default: 50, max: 100) — Items per page

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Moscow",
      "slug": "moscow",
      "warehouse_count": 47,
      "coordinates": {
        "lat": 55.755826,
        "lon": 37.617300
      }
    },
    {
      "id": 2,
      "name": "Saint Petersburg",
      "slug": "saint-petersburg",
      "warehouse_count": 23,
      "coordinates": {
        "lat": 59.93863,
        "lon": 30.31413
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 12,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  },
  "meta": {
    "timestamp": "2025-12-17T14:45:00Z",
    "request_id": "req_partner_cities_001"
  }
}
```

**Notes:**
- **City data** reflects platform configuration and active warehouse presence
- **Coordinates** represent city center approximations
- **Warehouse count** includes only active, published warehouses

---

# 5. Leads API — Booking Inquiry Submission

## 5.1. Create Lead

**Endpoint:** `POST /partner/v1/leads`

**Description:**  
Submit a booking inquiry (lead) on behalf of an end user. This creates a lead in the platform system for operator follow-up.

**Authorization:** Requires scope `leads:write`

**Important:**
- This endpoint **does NOT create a confirmed booking**
- It creates a **lead** (inquiry) that requires operator confirmation
- Operators review and confirm/reject leads via internal platform tools
- Partners receive lead confirmation status via future webhook system (not in MVP v1)

**Request Body:**
```json
{
  "warehouse_id": 101,
  "box_id": 501,
  "customer": {
    "name": "Ivan Petrov",
    "email": "ivan.petrov@example.com",
    "phone": "+79991234567"
  },
  "preferred_move_in_date": "2025-12-20",
  "duration_months": 3,
  "message": "Looking for climate-controlled storage for household items",
  "partner_reference_id": "partner_lead_abc123",
  "source": {
    "utm_source": "partner_site",
    "utm_medium": "referral",
    "utm_campaign": "december_promo"
  }
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `warehouse_id` | integer | ✅ | Target warehouse ID |
| `box_id` | integer | ❌ | Specific box ID (optional; operator may suggest alternatives) |
| `customer.name` | string | ✅ | Customer full name (min 2 chars) |
| `customer.email` | string | ✅ | Valid email address |
| `customer.phone` | string | ✅ | Phone number (E.164 format recommended) |
| `preferred_move_in_date` | string | ❌ | ISO date (YYYY-MM-DD) |
| `duration_months` | integer | ❌ | Intended rental duration (informational) |
| `message` | string | ❌ | Additional customer message (max 1000 chars) |
| `partner_reference_id` | string | ❌ | Partner's internal tracking ID (max 255 chars) |
| `source.utm_source` | string | ❌ | UTM source for analytics |
| `source.utm_medium` | string | ❌ | UTM medium for analytics |
| `source.utm_campaign` | string | ❌ | UTM campaign for analytics |

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": 10001,
    "lead_number": "LEAD-2025-10001",
    "status": "new",
    "warehouse_id": 101,
    "box_id": 501,
    "customer": {
      "name": "Ivan Petrov",
      "email": "ivan.petrov@example.com",
      "phone": "+79991234567"
    },
    "preferred_move_in_date": "2025-12-20",
    "duration_months": 3,
    "message": "Looking for climate-controlled storage for household items",
    "partner_reference_id": "partner_lead_abc123",
    "created_at": "2025-12-17T14:50:00Z"
  },
  "meta": {
    "timestamp": "2025-12-17T14:50:00Z",
    "request_id": "req_partner_lead_create_001"
  }
}
```

**Lead Status Values:**
- `new` — Lead created, pending operator review
- `contacted` — Operator has contacted customer
- `converted` — Lead converted to confirmed booking (operator action)
- `lost` — Lead not converted (operator marked as lost)

**Notes:**
- **Lead confirmation** is operator-driven; partners cannot directly confirm bookings via API in MVP v1
- **Customer contact** is handled by operators; platform facilitates lead routing only
- **Duplicate detection** is applied; duplicate leads within 24 hours may be rejected
- **Validation** enforces required fields and format constraints; invalid requests return `400 Bad Request`

---

## 5.2. Get Lead Status

**Endpoint:** `GET /partner/v1/leads/{id}`

**Description:**  
Retrieve the current status of a previously submitted lead.

**Authorization:** Requires scope `leads:write`

**Path Parameters:**
- `id` (integer) — Lead ID (returned from POST /leads)

**Query Parameters:**
- `partner_reference_id` (string, optional) — Retrieve by partner's tracking ID instead of platform ID

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": 10001,
    "lead_number": "LEAD-2025-10001",
    "status": "contacted",
    "warehouse_id": 101,
    "box_id": 501,
    "customer": {
      "name": "Ivan Petrov",
      "email": "i***@example.com",
      "phone": "+7999***4567"
    },
    "preferred_move_in_date": "2025-12-20",
    "duration_months": 3,
    "partner_reference_id": "partner_lead_abc123",
    "created_at": "2025-12-17T14:50:00Z",
    "updated_at": "2025-12-17T16:20:00Z"
  },
  "meta": {
    "timestamp": "2025-12-17T17:00:00Z",
    "request_id": "req_partner_lead_status_001"
  }
}
```

**Notes:**
- **Customer PII** is partially masked in responses for security/compliance
- **Status updates** reflect operator actions; delays expected based on operator availability
- **No real-time guarantees** for status updates in MVP v1

---

# 6. Error Handling

## 6.1. Error Response Format

**All errors follow a canonical structure:**
```json
{
  "success": false,
  "error": {
    "code": "invalid_api_key",
    "message": "API key is invalid or expired",
    "details": {
      "field": "X-API-Key",
      "reason": "key_not_found"
    }
  },
  "meta": {
    "timestamp": "2025-12-17T15:00:00Z",
    "request_id": "req_partner_error_001"
  }
}
```

## 6.2. HTTP Status Codes

| Status Code | Meaning | When It Occurs |
|-------------|---------|----------------|
| `200 OK` | Success | Successful GET request |
| `201 Created` | Resource created | Successful POST request |
| `400 Bad Request` | Invalid input | Validation failure, malformed JSON |
| `401 Unauthorized` | Authentication failure | Missing or invalid API key |
| `403 Forbidden` | Authorization failure | Insufficient scopes, access denied |
| `404 Not Found` | Resource not found | Invalid warehouse/box/lead ID |
| `429 Too Many Requests` | Rate limit exceeded | Exceeded partner rate limits |
| `500 Internal Server Error` | Server error | Platform internal error |
| `503 Service Unavailable` | Service degradation | Planned maintenance or system overload |

## 6.3. Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `invalid_api_key` | 401 | API key missing, invalid, or expired |
| `insufficient_scope` | 403 | Required scope not granted to API key |
| `rate_limit_exceeded` | 429 | Rate limit threshold reached |
| `resource_not_found` | 404 | Warehouse, box, or lead ID does not exist |
| `validation_error` | 400 | Request body fails validation |
| `duplicate_lead` | 409 | Lead already exists for this customer/warehouse |
| `box_unavailable` | 409 | Requested box no longer available |
| `service_unavailable` | 503 | Platform undergoing maintenance |

## 6.4. Error Handling Best Practices

**Retry Logic:**
- **Retry** on `500`, `503` with exponential backoff
- **Do NOT retry** on `400`, `401`, `403`, `404`, `409` (client errors)
- **Retry with caution** on `429` after respecting `Retry-After` header

**Idempotency:**
- **POST /leads** requests SHOULD include `partner_reference_id` to enable idempotent retry
- Platform deduplicates leads based on `partner_reference_id` within a 24-hour window

---

# 7. Rate Limiting & Fair Usage

## 7.1. Rate Limit Tiers

**Rate limits vary by partner tier:**

| Tier | Requests per Minute | Requests per Day |
|------|---------------------|------------------|
| **Basic** | 100 | 10,000 |
| **Standard** | 300 | 50,000 |
| **Advanced** | 1,000 | 200,000 |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1702826460
```

## 7.2. Rate Limit Enforcement

**Exceeded Limits:**
- `429 Too Many Requests` response
- `Retry-After` header indicates seconds until reset
- Repeated violations may result in temporary API key suspension

**Best Practices:**
- **Cache catalog data** locally; refresh periodically (hourly recommended)
- **Batch requests** where possible to minimize API calls
- **Respect rate limit headers**; implement client-side throttling

## 7.3. Fair Usage Policy

**Partners agree to:**
- Use API only for legitimate integration purposes
- Not resell API access to third parties without written agreement
- Not scrape or reverse-engineer platform data
- Not abuse API for competitive intelligence gathering
- Report vulnerabilities or bugs responsibly

**Violations may result in:**
- API key revocation
- Account suspension
- Legal action for egregious abuse

---

# 8. Security & Compliance

## 8.1. Data Protection

**PII Handling:**
- Customer PII (email, phone) transmitted via Partner API is subject to platform data protection policies
- Partners **MUST** comply with applicable data protection regulations (GDPR, local laws)
- Platform applies PII masking in certain response contexts (see §5.2)

**Data Retention:**
- Lead data retained per platform retention policy (refer to internal compliance documentation)
- Partners should not store sensitive customer PII beyond operational necessity

## 8.2. Audit Logging

**All Partner API requests are logged** for:
- Security monitoring
- Compliance auditing
- Usage analytics
- Troubleshooting

**Logged Data:**
- API key ID (not full key)
- Request path and method
- Request timestamp
- Response status code
- Client IP address
- Request ID

**Audit logs are retained** per platform security policy (minimum 90 days).

**Reference:** DOC-020 (Audit Logging Specification)

## 8.3. IP Whitelisting (Optional)

**Partners may request IP whitelisting** for enhanced security:
- Restricts API key usage to specified IP addresses
- Configured per partner agreement
- Not enabled by default; requires support request

## 8.4. Security Contact

**Report security vulnerabilities:**  
Email: security@storagecompare.ae  
PGP Key: Available upon request

**Do NOT disclose vulnerabilities publicly** before coordinated disclosure process.

---

# 9. Versioning & Deprecation

## 9.1. API Versioning Strategy

**Version in URL:**  
`/partner/v1` — Current version (MVP v1)

**Versioning Approach:**
- **Major version** (v1, v2) indicates breaking changes
- **Minor changes** (field additions, new optional parameters) do NOT require version bump
- Partners are notified of breaking changes **90 days in advance**

## 9.2. Backward Compatibility

**Platform guarantees:**
- Existing fields will not be removed within a major version
- Optional fields may be added; partners should ignore unknown fields
- Endpoint paths will not change within a major version

## 9.3. Deprecation Policy

**Deprecation Process:**
1. **Announcement** — 90 days before deprecation (email, developer portal)
2. **Deprecation Warning** — Response header `X-API-Deprecated: true` added
3. **Sunset Date** — Endpoint disabled after 90-day notice period

**Migration Support:**
- Documentation updated with migration guide
- Sandbox environment available for testing v2 (when released)

---

# 10. Out of Scope — Post-MVP

## 10.1. Features NOT in MVP v1

**The following capabilities are NOT supported in Partner API MVP v1:**

### Webhooks & Event Subscriptions
- **Description:** Real-time push notifications for lead status changes, booking updates
- **Status:** Planned for v1.1+
- **Rationale:** Requires additional infrastructure for webhook delivery and retry logic

### Bulk Catalog Sync
- **Description:** Bulk export or sync endpoints for entire warehouse catalog
- **Status:** Planned for v1.1+
- **Rationale:** Encourages caching; bulk endpoints require additional optimization

### Advanced Search Ranking
- **Description:** Custom search ranking algorithms or AI-powered recommendations
- **Status:** Planned for v2+
- **Rationale:** Platform search ranking is proprietary; partners use provided relevance scores

### White-Label / Co-Branding
- **Description:** Custom branding or white-label API responses
- **Status:** Not planned for standard Partner API
- **Rationale:** Requires custom partner agreements; out of scope for public API

### Real-Time Availability Updates
- **Description:** WebSocket or Server-Sent Events for live inventory changes
- **Status:** Planned for v2+
- **Rationale:** MVP focus on catalog snapshot access; real-time not operationally required

### Payment Processing via Partner API
- **Description:** Accept payments on behalf of operators via Partner API
- **Status:** Not planned (out of scope)
- **Rationale:** Payment processing is platform-internal capability; partners submit leads only

### Operator Management
- **Description:** Partner-facing operator registration or warehouse management
- **Status:** Not planned (out of scope)
- **Rationale:** Operator management is admin-only; not exposed to partners

---

# 11. References & Dependencies

## 11.1. Canonical Document Dependencies

This document aligns with and references the following canonical specifications:

| Document ID | Title | Relationship |
|-------------|-------|--------------|
| **DOC-101** | Internal / Admin API Specification | **Source of truth** for all API capabilities; Partner API is a subset |
| **DOC-015** | API Design Blueprint (MVP v1) | Base API design principles and conventions |
| **DOC-059** | Multi-Country / Multi-Region Architecture | Region-aware design; currency, pricing, compliance are region-driven |
| **DOC-097** | Payment & Billing Integration Architecture | Payment processing architecture (not exposed via Partner API in MVP) |
| **DOC-078** | Security & Compliance Plan | Authentication, authorization, PII handling, audit logging |
| **DOC-020** | Audit Logging Specification | Audit log format and retention for Partner API requests |
| **DOC-017** | API Rate Limiting & Throttling Specification | Rate limit implementation details |

## 11.2. Multi-Region Considerations

**Region-Aware Design:**
- Partner API **inherits region-aware architecture** from DOC-059
- **Pricing, currency, compliance** are configuration-driven per region
- **No country-specific fields** in base API contracts
- **Regional variations** (payment methods, legal requirements) managed via platform configuration

**What This Means for Partners:**
- API responses **adapt to regional context** (e.g., currency, date formats)
- Partners **do NOT need separate integrations per country**
- Regional compliance (GDPR, local data protection) is platform-managed

**Reference:** DOC-059 §3 (Region as Domain Concept), §5 (Configuration Strategy)

## 11.3. Security & Compliance

**Authentication & Authorization:**
- API key-based authentication per DOC-078 §3.1
- Scope-based access control per DOC-078 §3.2
- Rate limiting per DOC-017 §4

**PII Protection:**
- Customer data handling per DOC-078 §4
- PII masking in responses per DOC-078 §4.4
- Audit logging per DOC-020 §3

**Compliance:**
- GDPR, CCPA, local regulations applicable per DOC-078 §5
- Data retention per DOC-078 §4.5
- Breach notification per DOC-078 §6

---

## Document Metadata

**Document Classification:** Canonical Partner API Contract  
**Version:** 1.0 CANONICAL  
**Status:** 🟢 Active — Approved for MVP v1  
**Maintained by:** API Team  
**Review Frequency:** Quarterly or upon architectural changes  
**Next Scheduled Review:** March 2026

### Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-17 | Initial canonical specification for MVP v1 | Platform Architecture Team |

### Related Documents

- **DOC-101:** Internal / Admin API Specification (source of truth)
- **DOC-015:** API Design Blueprint (MVP v1)
- **DOC-059:** Multi-Country / Multi-Region Architecture
- **DOC-078:** Security & Compliance Plan
- **DOC-020:** Audit Logging Specification
- **DOC-017:** API Rate Limiting & Throttling Specification

---

**Document Status:** 🟢 CANONICAL — Approved for Partner Integration  
**Maintained By:** API Team & Partner Success  
**Support Contact:** partners@storagecompare.ae  
**Developer Portal:** https://developers.storagecompare.ae

---

**END OF DOCUMENT**
