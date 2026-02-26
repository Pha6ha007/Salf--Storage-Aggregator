# Functional Specification MVP v1 — Corrected Version

**Self-Storage Aggregator Platform**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Version** | 1.1 (Corrected) |
| **Date** | December 15, 2025 |
| **Project** | Self-Storage Aggregator MVP v1 |
| **Status** | Complete — Aligned with Canonical Documents |
| **Authors** | Product & Development Team |
| **Last Updated** | 2025-12-15 |
| **Based On** | Functional_Specification_MVP_v1_Complete.md |
| **Changes Applied** | ASK #FS-001 Corrections |

---

## Changelog from Previous Version

| Change ID | Section | Description |
|-----------|---------|-------------|
| FIX-001 | Booking Statuses | Removed `rejected` status; replaced with `cancelled` + `cancellation_reason` |
| FIX-002 | Feature Tables | Removed payments/billing from MVP v1; moved to Out of Scope |
| FIX-003 | Operator Roles | Removed sub-roles (Owner/Manager/Staff); single `operator` role in MVP |
| FIX-004 | AI Features | Clarified MVP v1 scope: only Box Finder; others marked as v1.1+ |
| FIX-005 | Analytics | Removed revenue analytics; basic metrics only in MVP v1 |
| FIX-006 | API Endpoints | Changed `/reject` → `/cancel` for booking operations |
| FIX-007 | State Machine | Updated booking state transitions to canonical model |

---

## Executive Summary

This document provides the **corrected** functional specification for the **Self-Storage Aggregator MVP v1** — a platform connecting users seeking storage solutions with warehouse operators.

**Important:** This document is aligned with the following canonical sources:
- `full_database_specification_mvp_v1.md` (Database)
- `api_design_blueprint_mvp_v1.md` (API)
- `Technical_Architecture_Document_FULL.md` (Architecture)
- `security_and_compliance_plan_mvp_v1.md` (Security/RBAC)

### Platform Capabilities

**For Users (Storage Seekers):**
- Search and compare self-storage warehouses
- View detailed warehouse information, pricing, and availability
- Use AI Box Finder for size recommendations
- Book storage boxes online
- Manage bookings through a personal dashboard

**For Warehouse Operators:**
- List and manage warehouses and boxes
- Receive and process booking requests (confirm or cancel)
- View basic occupancy metrics
- Communicate with customers

---

## Scope Legend

| Label | Meaning |
|-------|---------|
| **MVP v1** | Included in current release |
| **v1.1+** | Post-MVP, planned for future |
| **OUT OF SCOPE** | Not planned, explicitly excluded |

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Key Features Summary](#key-features-summary)
3. [User Roles](#user-roles)
4. [Part 1: Home Page](#part-1-home-page)
5. [Part 2: Catalog Page](#part-2-catalog-page)
6. [Part 3: Warehouse Details](#part-3-warehouse-details)
7. [Part 4: Map View](#part-4-map-view)
8. [Part 5: Booking Flow](#part-5-booking-flow)
9. [Part 6: Operator Dashboard](#part-6-operator-dashboard)
10. [Canonical Data Models](#canonical-data-models)
11. [Out of Scope (v1.1+)](#out-of-scope-v11)

---

## Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **State Management:** Redux Toolkit / React Context
- **Routing:** React Router v6
- **UI Library:** Tailwind CSS + shadcn/ui
- **Maps:** Google Maps API (primary), Google Maps (fallback)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios with interceptors

### Backend (API)
- **Framework:** NestJS (Node.js) / FastAPI (Python)
- **Database:** PostgreSQL 14+ with PostGIS
- **ORM:** TypeORM / Prisma
- **Authentication:** JWT tokens (access: 15min, refresh: 7 days)
- **File Storage:** S3-compatible (Yandex Object Storage)
- **Search:** PostgreSQL full-text search

### AI Integration (MVP v1)
- **Provider:** OpenAI GPT-4 Turbo
- **Use Cases:** Box Finder (size recommendations based on items description)
- **Fallback:** Rule-based recommendations when AI unavailable

### Infrastructure
- **Hosting:** Cloud VPS or managed services
- **CDN:** Cloudflare / Yandex CDN
- **Monitoring:** Error tracking and performance monitoring

---

## Key Features Summary

### For Users (Storage Seekers)

| Feature | Priority | Scope | Description |
|---------|----------|-------|-------------|
| Search warehouses | HIGH | **MVP v1** | Location-based search with autocomplete |
| Filter & sort | HIGH | **MVP v1** | Multi-criteria filtering (size, price, amenities) |
| Map view | HIGH | **MVP v1** | Interactive map with clustering |
| AI Box Finder | HIGH | **MVP v1** | AI recommends box size based on items description |
| Warehouse details | HIGH | **MVP v1** | Full info: photos, prices, reviews, location |
| Booking flow | HIGH | **MVP v1** | Complete booking process with price calculation |
| User dashboard | MEDIUM | **MVP v1** | View bookings, favorites, profile |
| Reviews | MEDIUM | **MVP v1** | Read and write warehouse reviews |
| Favorites | LOW | **MVP v1** | Save warehouses for later |
| ~~Comparison~~ | - | **v1.1+** | Compare warehouses side-by-side |

### For Operators (Warehouse Owners)

| Feature | Priority | Scope | Description |
|---------|----------|-------|-------------|
| Dashboard | HIGH | **MVP v1** | Metrics overview: bookings count, occupancy rate |
| Warehouse CRUD | HIGH | **MVP v1** | Add, edit, manage warehouses |
| Box management | HIGH | **MVP v1** | Add, edit, price boxes |
| Booking requests | HIGH | **MVP v1** | View, confirm, or cancel requests |
| Active bookings | HIGH | **MVP v1** | View current tenants and booking status |
| ~~Pricing control with AI~~ | - | **v1.1+** | AI price suggestions |
| ~~Analytics dashboard~~ | - | **v1.1+** | Views, conversions, revenue trends |
| ~~Review responses~~ | - | **v1.1+** | Respond to customer reviews |
| ~~Team management~~ | - | **v1.1+** | Invite team members with roles |
| ~~Payments management~~ | - | **v1.1+** | Online payments, billing |

### AI-Powered Features

| Feature | Scope | Description |
|---------|-------|-------------|
| Box Finder | **MVP v1** | User describes items → AI recommends box size |
| ~~Price Analysis~~ | **v1.1+** | Compare warehouse prices to market average |
| ~~Description Generator~~ | **v1.1+** | Auto-generate warehouse descriptions |
| ~~Smart Search (Embeddings)~~ | **v1.1+** | Semantic search for warehouses |

---

## User Roles

**Source:** `security_and_compliance_plan_mvp_v1.md` Section 2

### Canonical Roles (MVP v1)

| Role | Code | Description |
|------|------|-------------|
| Guest | `guest` | Unauthenticated user; public access only |
| User | `user` | Registered user; can book, review, manage profile |
| Operator | `operator` | Warehouse owner; manages warehouses, boxes, bookings |
| Admin | `admin` | System administrator; full access |

> **⚠️ CORRECTED:** Sub-roles (Owner/Manager/Staff) are **NOT** in MVP v1. The `operator` role is unified with full warehouse management permissions.

### 1. Guest User

**Role Code:** `guest`

**Access:** Public pages only

**Capabilities:**
- Search and browse warehouses
- View warehouse details
- Use AI Box Finder
- View catalog and map
- Cannot book (must register/login)

**API Endpoints Available:**
- `GET /api/v1/warehouses` — List warehouses
- `GET /api/v1/warehouses/{id}` — Warehouse details
- `GET /api/v1/warehouses/{id}/boxes` — Available boxes
- `POST /api/v1/ai/box-finder` — AI recommendations

---

### 2. Registered User

**Role Code:** `user`

**Access:** All public pages + authenticated features

**Capabilities:**
- All guest capabilities
- Create booking requests
- View and cancel own bookings
- Write reviews (after completed booking)
- Manage favorites
- Edit profile

**API Endpoints Available:**
- All guest endpoints
- `POST /api/v1/bookings` — Create booking
- `GET /api/v1/users/me/bookings` — My bookings
- `POST /api/v1/bookings/{id}/cancel` — Cancel booking
- `POST /api/v1/reviews` — Write review
- `GET /api/v1/users/me/favorites` — My favorites
- `GET /api/v1/users/me` — My profile

---

### 3. Operator

**Role Code:** `operator`

**Access:** Operator dashboard + all user capabilities

**Capabilities:**
- All user capabilities
- Add/edit/manage warehouses
- Add/edit/manage boxes
- View and process booking requests
- Confirm or cancel booking requests
- View active bookings
- View basic occupancy metrics

**API Endpoints Available:**
- All user endpoints
- `GET /api/v1/operator/warehouses` — My warehouses
- `POST /api/v1/operator/warehouses` — Create warehouse
- `PUT /api/v1/operator/warehouses/{id}` — Update warehouse
- `GET /api/v1/operator/bookings` — Booking requests
- `PUT /api/v1/operator/bookings/{id}/confirm` — Confirm booking
- `PUT /api/v1/operator/bookings/{id}/cancel` — Cancel booking (with reason)

> **⚠️ CORRECTED:** Endpoint changed from `/reject` to `/cancel` with `cancellation_reason` field.

---

### 4. Administrator

**Role Code:** `admin`

**Access:** Full system access

**Capabilities:**
- All operator capabilities
- Moderate content
- Manage users and operators
- View system logs
- Configure platform settings

---

## Part 1: Home Page

### Overview

The home page is the main entry point for users to discover self-storage options.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/warehouses` | GET | No | List warehouses |
| `/api/v1/warehouses/featured` | GET | No | Featured warehouses |
| `/api/v1/ai/box-finder` | POST | No | AI box recommendations |
| `/api/v1/search/autocomplete` | GET | No | Location autocomplete |

**Main Entities:**
- Warehouse (listing preview)
- Box (size options)
- AI Recommendation

---

### User Stories

#### US-HOME-001: Search Warehouses by Location

**As a** guest user  
**I want to** search for warehouses by entering a location  
**So that** I can find storage options near my desired area

**Epic:** Search & Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Location search | User on home page | Types "Москва, Выхино" in search | Autocomplete shows matching locations |
| Search submission | Location selected | Clicks "Найти" button | Redirects to catalog with location filter |
| Empty search | User on home page | Clicks search without input | Shows validation message |

---

#### US-HOME-002: AI Box Finder

**As a** guest user  
**I want to** describe my items and get a box size recommendation  
**So that** I can find the right storage size without guessing

**Epic:** AI Features  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| AI recommendation | User on home page | Enters "Диван, кровать, 10 коробок" | AI returns recommended size (e.g., "M - 5м²") with reasoning |
| AI unavailable | AI service down | User submits query | Fallback shows rule-based recommendation |
| Empty query | User clicks "Подобрать" | Query field is empty | Shows validation message |

**API Mapping:**

```
POST /api/v1/ai/box-finder

Request:
{
  "query": "Диван, кровать, 10 коробок",
  "budget": 5000
}

Response (200 OK):
{
  "success": true,
  "data": {
    "recommended_size": "M",
    "recommended_area_m2": 5,
    "confidence": 0.85,
    "reasoning": "Для дивана (~2м³), кровати (~1.5м³) и 10 коробок (~1м³) рекомендуем бокс 5м² с высотой 2.5м",
    "alternatives": [
      {"size": "S", "area_m2": 3, "note": "Если разобрать мебель"},
      {"size": "L", "area_m2": 8, "note": "С запасом для дополнительных вещей"}
    ]
  }
}

Response (fallback when AI unavailable):
{
  "success": true,
  "data": {
    "recommended_size": "M",
    "recommended_area_m2": 5,
    "confidence": 0.6,
    "reasoning": "Рекомендация основана на среднем размере и бюджете (AI-сервис временно недоступен)",
    "is_fallback": true
  }
}
```

---

#### US-HOME-003: View Featured Warehouses

**As a** guest user  
**I want to** see featured/popular warehouses on the home page  
**So that** I can quickly explore top-rated options

**Epic:** Search & Discovery  
**Priority:** MEDIUM  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Featured list | User on home page | Page loads | Shows up to 6 featured warehouses |
| Warehouse card | Featured section visible | Views warehouse card | Shows: name, rating, min price, location, photo |
| Click warehouse | Featured section visible | Clicks warehouse card | Navigates to warehouse details page |

---

## Part 2: Catalog Page

### Overview

The catalog page displays a filterable, sortable list of warehouses.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/warehouses` | GET | No | List with filters |
| `/api/v1/warehouses/filters` | GET | No | Available filter options |

**Main Entities:**
- Warehouse (list item)
- Filter options
- Pagination

---

### User Stories

#### US-CATALOG-001: Filter Warehouses

**As a** guest user  
**I want to** filter warehouses by various criteria  
**So that** I can narrow down options to my needs

**Epic:** Search & Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Price filter | Catalog page loaded | Sets price range 2000-5000 AED  | Shows only warehouses with boxes in range |
| Size filter | Catalog page loaded | Selects "M (3-6 м²)" | Shows warehouses with M-sized boxes available |
| Feature filter | Catalog page loaded | Checks "Круглосуточный доступ" | Shows only 24/7 access warehouses |
| Combined filters | Multiple filters set | Applies filters | Shows intersection of all criteria |
| Clear filters | Filters applied | Clicks "Сбросить" | Removes all filters, shows full list |

**API Mapping:**

```
GET /api/v1/warehouses?price_min=2000&price_max=5000&size=M&features=24_7_access&page=1&per_page=12

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "СкладОК Выхино",
      "slug": "skladok-vyhino",
      "address": "Москва, ул. Ферганская, 10",
      "rating": 4.7,
      "review_count": 45,
      "min_price": 2500,
      "available_boxes": 12,
      "features": ["24_7_access", "video_surveillance", "climate_control"],
      "main_image": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 47,
    "total_pages": 4,
    "has_next": true,
    "has_previous": false
  }
}
```

---

#### US-CATALOG-002: Sort Warehouses

**As a** guest user  
**I want to** sort warehouses by different criteria  
**So that** I can find the best options first

**Epic:** Search & Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Sort by price | Catalog page loaded | Selects "Цена (по возрастанию)" | List sorted by min_price ascending |
| Sort by rating | Catalog page loaded | Selects "Рейтинг" | List sorted by rating descending |
| Sort by distance | Location set | Selects "Расстояние" | List sorted by distance from location |
| Default sort | Page loads | No sort selected | Default: by rating descending |

---

## Part 3: Warehouse Details

### Overview

The warehouse details page shows complete information about a specific warehouse.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/warehouses/{id}` | GET | No | Full warehouse details |
| `/api/v1/warehouses/{id}/boxes` | GET | No | Available boxes |
| `/api/v1/warehouses/{id}/reviews` | GET | No | Reviews list |
| `/api/v1/favorites` | POST | Yes | Add to favorites |

**Main Entities:**
- Warehouse (full details)
- Box (available options)
- Review
- Media (photos)

---

### User Stories

#### US-DETAILS-001: View Warehouse Information

**As a** guest user  
**I want to** see complete warehouse information  
**So that** I can make an informed decision

**Epic:** Warehouse Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Page load | Valid warehouse ID | User navigates to /warehouse/101 | Shows all warehouse details |
| Photos gallery | Warehouse has photos | Views photo section | Shows gallery with main photo + thumbnails |
| Location map | Warehouse has coordinates | Views location section | Shows map marker at warehouse location |
| Working hours | Warehouse has schedule | Views hours section | Shows formatted working hours by day |
| Not found | Invalid warehouse ID | User navigates to /warehouse/999 | Shows 404 error page |

---

#### US-DETAILS-002: View Available Boxes

**As a** guest user  
**I want to** see all available box sizes and prices  
**So that** I can choose the right storage option

**Epic:** Warehouse Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Box list | Warehouse page loaded | Views boxes section | Shows all box types with sizes and prices |
| Availability | Boxes displayed | Views box card | Shows available quantity (e.g., "3 свободно") |
| Select box | Box available | Clicks "Выбрать" | Navigates to booking flow with box pre-selected |
| No availability | Box quantity = 0 | Views box card | Shows "Нет в наличии", button disabled |

**API Mapping:**

```
GET /api/v1/warehouses/101/boxes

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 501,
      "name": "Бокс S",
      "size_code": "S",
      "dimensions": {
        "length": 2.0,
        "width": 1.5,
        "height": 2.5
      },
      "area_m2": 3,
      "volume_m3": 7.5,
      "price_per_month": 2500,
      "available_quantity": 5,
      "total_quantity": 10,
      "features": ["Первый этаж", "Отдельный вход"]
    }
  ]
}
```

---

#### US-DETAILS-003: Read Reviews

**As a** guest user  
**I want to** read reviews from other customers  
**So that** I can understand the quality of service

**Epic:** Trust & Safety  
**Priority:** MEDIUM  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Reviews list | Warehouse has reviews | Views reviews section | Shows reviews sorted by date (newest first) |
| Rating display | Review displayed | Views review | Shows rating (1-5 stars), date, author name |
| Pagination | More than 10 reviews | Scrolls to bottom | Shows "Загрузить ещё" button |
| No reviews | Warehouse has 0 reviews | Views reviews section | Shows "Пока нет отзывов" message |

---

## Part 4: Map View

### Overview

The map view provides a geographic visualization of warehouses.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/warehouses/map` | GET | No | Warehouses for map (with clustering data) |

**Main Entities:**
- Warehouse (map marker data)
- Cluster (grouped markers)

---

### User Stories

#### US-MAP-001: View Warehouses on Map

**As a** guest user  
**I want to** see warehouses displayed on an interactive map  
**So that** I can understand their locations visually

**Epic:** Search & Discovery  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Map load | User navigates to map | Page loads | Shows Yandex Map centered on Moscow |
| Markers | Warehouses exist | Map loaded | Shows markers for warehouses |
| Clustering | Zoomed out | Many markers in area | Groups markers into clusters with count |
| Marker click | Marker visible | Clicks marker | Shows popup with warehouse preview |
| Navigate | Popup shown | Clicks "Подробнее" | Navigates to warehouse details |

---

## Part 5: Booking Flow

### Overview

The booking flow allows users to reserve a storage box.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/bookings` | POST | Yes (user) | Create booking |
| `/api/v1/users/me/bookings` | GET | Yes (user) | My bookings |
| `/api/v1/bookings/{id}` | GET | Yes (user) | Booking details |
| `/api/v1/bookings/{id}/cancel` | POST | Yes (user) | Cancel booking |

**Main Entities:**
- Booking
- Box (selected)
- User (authenticated)

---

### Canonical Booking Statuses

**Source:** `full_database_specification_mvp_v1.md` — Table `bookings`, field `status`

> **⚠️ CORRECTED:** Removed `rejected` status. Operator rejection is now `cancelled` with `cancellation_reason = "operator_declined"`.

| Status | Code | Description | User Actions | Operator Actions |
|--------|------|-------------|--------------|------------------|
| Pending | `pending` | Awaiting operator confirmation | Can cancel | Can confirm or cancel |
| Confirmed | `confirmed` | Operator confirmed, awaiting start date | Can cancel | Can cancel |
| Active | `active` | Rental period started | View only | View only |
| Completed | `completed` | Rental period ended | Write review | View only |
| Cancelled | `cancelled` | Booking cancelled by user/operator/system | View only | View only |
| Expired | `expired` | Auto-expired (no response within 48h) | Can rebook | View only |

### Booking Status Transitions (State Machine)

```
[NEW BOOKING]
      │
      ▼
  ┌────────┐
  │pending │◄──────────────────────────┐
  └───┬────┘                           │
      │                                │
      ├──────► confirmed ──► active ──► completed
      │            │
      │            ▼
      │        cancelled (by user or operator)
      │
      ├──────► cancelled (by user before confirmation)
      │
      └──────► expired (auto after 48h no response)
```

**Transition Rules:**

| From | To | Trigger | Actor |
|------|----|---------|-------|
| - | `pending` | Booking created | User |
| `pending` | `confirmed` | Operator confirms | Operator |
| `pending` | `cancelled` | User cancels | User |
| `pending` | `cancelled` | Operator declines | Operator |
| `pending` | `expired` | 48h timeout | System |
| `confirmed` | `active` | Start date reached | System |
| `confirmed` | `cancelled` | User/Operator cancels | User/Operator |
| `active` | `completed` | End date reached | System |

---

### User Stories

#### US-BOOKING-001: Create Booking Request

**As a** registered user  
**I want to** create a booking request for a storage box  
**So that** I can reserve storage space

**Epic:** Booking  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Start booking | Box selected | Clicks "Забронировать" | Shows booking form |
| Select dates | Booking form open | Selects start date + duration | Calculates end date and total price |
| Enter contact | Form open | Enters name, phone, email | Fields validated |
| Submit | Form completed | Clicks "Отправить заявку" | Creates booking with status = `pending` |
| Not authenticated | Guest user | Clicks "Забронировать" | Redirects to login/register |

**API Mapping:**

```
POST /api/v1/bookings

Request:
{
  "box_id": 501,
  "start_date": "2025-02-01",
  "duration_months": 3,
  "contact_name": "Иван Петров",
  "contact_phone": "+79161234567",
  "contact_email": "ivan@example.com",
  "notes": "Планирую привезти вещи в выходные"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1001,
    "booking_number": "BK-20251215-1001",
    "status": "pending",
    "box": {
      "id": 501,
      "name": "Бокс S",
      "warehouse_name": "СкладОК Выхино"
    },
    "start_date": "2025-02-01",
    "end_date": "2025-05-01",
    "duration_months": 3,
    "price_per_month": 2500,
    "total_price": 7500,
    "deposit": 2500,
    "created_at": "2025-12-15T14:30:00Z"
  }
}
```

---

#### US-BOOKING-002: View My Bookings

**As a** registered user  
**I want to** see all my bookings  
**So that** I can track their status

**Epic:** User Dashboard  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| View all | User has bookings | Opens "Мои бронирования" | Shows list of all bookings |
| Filter by status | Bookings displayed | Selects status filter | Shows only bookings with selected status |
| View details | Booking in list | Clicks booking row | Shows full booking details |
| Empty state | User has no bookings | Opens "Мои бронирования" | Shows "У вас пока нет бронирований" |

---

#### US-BOOKING-003: Cancel Booking

**As a** registered user  
**I want to** cancel my pending or confirmed booking  
**So that** I can change my plans if needed

**Epic:** Booking  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Cancel pending | Booking status = `pending` | Clicks "Отменить" | Status → `cancelled`, reason saved |
| Cancel confirmed | Booking status = `confirmed` | Clicks "Отменить" | Status → `cancelled`, reason saved |
| Cannot cancel active | Booking status = `active` | Views booking | "Отменить" button not shown |
| Confirmation dialog | Any cancelable booking | Clicks "Отменить" | Shows confirmation dialog with reason input |

**API Mapping:**

```
POST /api/v1/bookings/1001/cancel

Request:
{
  "reason": "Изменились планы"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1001,
    "booking_number": "BK-20251215-1001",
    "status": "cancelled",
    "cancelled_at": "2025-12-15T15:00:00Z",
    "cancellation_reason": "Изменились планы",
    "cancelled_by": "user"
  }
}
```

---

## Part 6: Operator Dashboard

### Overview

The operator dashboard allows warehouse owners to manage their properties and bookings.

**API Endpoints Used:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/operator/warehouses` | GET | Yes (operator) | My warehouses |
| `/api/v1/operator/warehouses` | POST | Yes (operator) | Create warehouse |
| `/api/v1/operator/warehouses/{id}` | PUT | Yes (operator) | Update warehouse |
| `/api/v1/operator/bookings` | GET | Yes (operator) | Booking requests |
| `/api/v1/operator/bookings/{id}/confirm` | PUT | Yes (operator) | Confirm booking |
| `/api/v1/operator/bookings/{id}/cancel` | PUT | Yes (operator) | Cancel booking |
| `/api/v1/operator/stats` | GET | Yes (operator) | Basic statistics |

**Main Entities:**
- Warehouse (full CRUD)
- Box (management)
- Booking (processing)

---

### Dashboard Metrics (MVP v1)

> **⚠️ CORRECTED:** Revenue metrics moved to v1.1+. MVP v1 includes only basic counts.

| Metric | Description | Scope |
|--------|-------------|-------|
| New requests | Count of bookings with status = `pending` | **MVP v1** |
| Active bookings | Count of bookings with status = `active` | **MVP v1** |
| Occupancy rate | (Rented boxes / Total boxes) × 100% | **MVP v1** |
| Total warehouses | Count of operator's warehouses | **MVP v1** |
| ~~Revenue this month~~ | Sum of booking payments | **v1.1+** |
| ~~Revenue trend~~ | Month-over-month comparison | **v1.1+** |

---

### User Stories

#### US-OPERATOR-001: View Dashboard Overview

**As an** operator  
**I want to** see an overview of my warehouses and bookings  
**So that** I can quickly understand my business status

**Epic:** Operator Dashboard  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Load dashboard | Operator logged in | Opens dashboard | Shows summary cards: new requests, active bookings, occupancy |
| New requests badge | Pending bookings exist | Views dashboard | Shows count badge on "Заявки" card |
| Empty state | Operator has no warehouses | Opens dashboard | Shows "Добавьте первый склад" prompt |

**API Mapping:**

```
GET /api/v1/operator/stats

Response (200 OK):
{
  "success": true,
  "data": {
    "pending_bookings": 5,
    "active_bookings": 23,
    "total_warehouses": 3,
    "total_boxes": 45,
    "rented_boxes": 28,
    "occupancy_rate": 62.2
  }
}
```

---

#### US-OPERATOR-002: Manage Booking Requests

**As an** operator  
**I want to** view and process booking requests  
**So that** I can confirm or decline customer reservations

**Epic:** Booking Management  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| View requests | Pending bookings exist | Opens "Заявки" | Shows list of pending booking requests |
| View details | Request in list | Clicks request row | Shows full booking details + customer contact |
| Confirm request | Request pending | Clicks "Подтвердить" | Status → `confirmed`, customer notified |
| Decline request | Request pending | Clicks "Отклонить" + enters reason | Status → `cancelled`, reason saved, customer notified |

> **⚠️ CORRECTED:** "Отклонить" (Decline) action now uses `cancel` endpoint with `cancelled_by: "operator"` instead of a separate `reject` endpoint.

**API Mapping — Confirm:**

```
PUT /api/v1/operator/bookings/1001/confirm

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1001,
    "status": "confirmed",
    "confirmed_at": "2025-12-15T16:00:00Z"
  }
}
```

**API Mapping — Cancel (Decline):**

```
PUT /api/v1/operator/bookings/1001/cancel

Request:
{
  "reason": "Бокс уже забронирован другим клиентом"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1001,
    "status": "cancelled",
    "cancelled_at": "2025-12-15T16:00:00Z",
    "cancellation_reason": "Бокс уже забронирован другим клиентом",
    "cancelled_by": "operator"
  }
}
```

---

#### US-OPERATOR-003: Manage Warehouses

**As an** operator  
**I want to** add and edit my warehouses  
**So that** I can keep information up to date

**Epic:** Warehouse Management  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Add warehouse | Dashboard open | Clicks "Добавить склад" | Opens warehouse creation form |
| Fill details | Creation form open | Fills name, address, contacts | Fields validated |
| Upload photos | Form open | Uploads photos | Shows photo previews |
| Save warehouse | Form completed | Clicks "Сохранить" | Creates warehouse with status = `draft` |
| Edit warehouse | Warehouse exists | Clicks "Редактировать" | Opens edit form with current data |
| Publish | Warehouse in draft | Clicks "Опубликовать" | Status → `published`, visible in catalog |

---

#### US-OPERATOR-004: Manage Boxes

**As an** operator  
**I want to** add and manage boxes in my warehouses  
**So that** I can offer storage options to customers

**Epic:** Warehouse Management  
**Priority:** HIGH  
**Scope:** MVP v1

**Acceptance Criteria:**

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Add box | Warehouse selected | Clicks "Добавить бокс" | Opens box creation form |
| Set dimensions | Form open | Enters length, width, height | Auto-calculates area and volume |
| Set price | Form open | Enters price per month | Price validated (> 0) |
| Set quantity | Form open | Enters available quantity | Quantity validated (≥ 0) |
| Save box | Form completed | Clicks "Сохранить" | Creates box, appears in warehouse |

---

## Canonical Data Models

### Booking Model

**Source:** `full_database_specification_mvp_v1.md` — Table `bookings`

```typescript
interface Booking {
  id: number;
  booking_number: string;          // "BK-20251215-1001"
  user_id: number;
  warehouse_id: number;
  box_id: number;
  
  // Dates
  start_date: Date;
  end_date: Date;
  duration_months: number;
  actual_end_date?: Date;
  
  // Pricing
  base_price_per_month: number;
  discount_percentage?: number;
  monthly_price: number;
  total_price: number;
  deposit: number;
  
  // Status (CANONICAL - 6 values)
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired';
  
  // Contact
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  notes?: string;
  special_requests?: string;
  
  // Cancellation tracking (CORRECTED)
  cancellation_reason?: string;
  cancelled_by?: 'user' | 'operator' | 'system';
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  confirmed_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
}
```

### Warehouse Model

**Source:** `full_database_specification_mvp_v1.md` — Table `warehouses`

```typescript
interface Warehouse {
  id: number;
  operator_id: number;
  name: string;
  slug: string;
  description?: string;
  
  // Address
  full_address: string;
  city: string;
  district?: string;
  metro_station?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact
  contact_phone: string;
  contact_email?: string;
  
  // Schedule
  working_hours: {
    [day: string]: string;  // "mon": "08:00-20:00"
  };
  access_type: 'self_service' | 'managed' | '24/7';
  
  // Rating
  rating: number;           // 0.00 - 5.00
  review_count: number;
  
  // Status (CANONICAL - 4 values)
  status: 'draft' | 'published' | 'suspended' | 'closed';
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}
```

### Box Model

**Source:** `full_database_specification_mvp_v1.md` — Table `boxes`

```typescript
interface Box {
  id: number;
  warehouse_id: number;
  name: string;
  size_code: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  
  // Dimensions
  size_length: number;
  size_width: number;
  size_height: number;
  total_area: number;       // Calculated: length × width
  total_volume: number;     // Calculated: length × width × height
  
  // Pricing
  price_per_month: number;
  
  // Inventory
  total_quantity: number;
  available_quantity: number;
  
  // Status (CANONICAL - 3 values)
  status: 'active' | 'inactive' | 'maintenance';
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}
```

---

## Out of Scope (v1.1+)

The following features are explicitly **NOT** included in MVP v1:

### Payment & Billing (v1.1+)

| Feature | Description | Planned |
|---------|-------------|---------|
| Online payments | Payment gateway integration | v1.1 |
| Payment tracking | Mark payments as received | v1.1 |
| Invoicing | Generate invoices | v1.1 |
| Revenue reports | Financial analytics | v1.1 |
| Refunds | Process refunds | v1.1 |

> **Note:** MVP v1 handles payments offline. Booking creates a request; payment is settled directly between user and operator.

### Advanced Analytics (v1.1+)

| Feature | Description | Planned |
|---------|-------------|---------|
| Revenue dashboard | Monthly/yearly revenue charts | v1.1 |
| Conversion tracking | View → booking conversion rates | v1.1 |
| User behavior analytics | Heatmaps, session recordings | v2.0 |
| Predictive analytics | Demand forecasting | v2.0 |

### Advanced AI Features (v1.1+)

| Feature | Description | Planned |
|---------|-------------|---------|
| AI Price Analysis | Market price comparison | v1.1 |
| Description Generator | Auto-generate warehouse descriptions | v1.1 |
| Smart Search (Embeddings) | Semantic search | v2.0 |
| Chatbot Assistant | Conversational AI | v2.0 |

### Team Management (v1.1+)

| Feature | Description | Planned |
|---------|-------------|---------|
| Sub-roles | Owner/Manager/Staff roles | v1.1 |
| Team invitations | Invite team members | v1.1 |
| Permission management | Granular permissions | v1.1 |
| Activity logs | Team member activity | v1.1 |

### Other v1.1+ Features

| Feature | Description | Planned |
|---------|-------------|---------|
| Warehouse comparison | Compare up to 3 warehouses | v1.1 |
| Review responses | Operator responds to reviews | v1.1 |
| Bulk operations | Update multiple boxes at once | v1.1 |
| Notifications (SMS) | SMS notifications | v1.1 |
| Mobile app | iOS/Android native apps | v2.0 |

---

## Appendix A: API Error Codes

**Source:** `api_design_blueprint_mvp_v1.md`

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `validation_error` | 400 | Request validation failed |
| `unauthorized` | 401 | Missing or invalid token |
| `forbidden` | 403 | Insufficient permissions |
| `not_found` | 404 | Resource not found |
| `warehouse_not_found` | 404 | Warehouse ID doesn't exist |
| `box_not_found` | 404 | Box ID doesn't exist |
| `booking_not_found` | 404 | Booking ID doesn't exist |
| `box_not_available` | 409 | Box is already booked |
| `cannot_cancel_booking` | 400 | Booking cannot be cancelled (wrong status) |
| `rate_limit_exceeded` | 429 | Too many requests |
| `internal_error` | 500 | Unexpected server error |

---

## Appendix B: Event Tracking

**Source:** `Logging_Strategy_COMPLETE_ALL_SECTIONS.md`

### MVP v1 Events

| Event | Description | Properties |
|-------|-------------|------------|
| `page_view` | Page viewed | page, user_id, session_id |
| `search` | Search performed | query, filters, results_count |
| `warehouse_view` | Warehouse details viewed | warehouse_id |
| `box_select` | Box selected for booking | box_id, warehouse_id |
| `booking_create` | Booking created | booking_id, box_id |
| `booking_confirm` | Booking confirmed (by operator) | booking_id |
| `booking_cancel` | Booking cancelled | booking_id, cancelled_by, reason |
| `review_submit` | Review submitted | warehouse_id, rating |
| `favorite_add` | Warehouse added to favorites | warehouse_id |

---

## Document Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| QA Lead | | | |

---

**End of Document**

*This document supersedes `Functional_Specification_MVP_v1_Complete.md` and incorporates all corrections from ASK #FS-001.*
