# DOC-090: User Stories + Acceptance Criteria + API Spec Mapping

**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Date:** December 16, 2025  
**Status:** 🟢 GREEN - Canonical Specification  
**Document Type:** Requirements Traceability & Test Contract

---

## Document Information

| Field | Value |
|-------|-------|
| **Purpose** | Link user stories → acceptance criteria → API contracts |
| **Scope** | MVP v1 only |
| **Target Audience** | Backend developers, Frontend developers, QA engineers, Test automation |
| **Usage** | Implementation baseline, test generation, contract validation |
| **Canonical Status** | 🟢 GREEN - Source of truth for feature implementation |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Story → API Mapping Principles](#2-story--api-mapping-principles)
3. [Core Domains](#3-core-domains)
   - [3.1 Authentication & Roles](#31-domain-authentication--roles)
   - [3.2 Search & Discovery](#32-domain-search--discovery)
   - [3.3 Warehouse & Boxes](#33-domain-warehouse--boxes)
   - [3.4 Booking Management](#34-domain-booking-management)
   - [3.5 User Account](#35-domain-user-account)
   - [3.6 Operator Account](#36-domain-operator-account)
   - [3.7 Reviews & Favorites](#37-domain-reviews--favorites)
   - [3.8 AI Features](#38-domain-ai-features)
   - [3.9 CRM Lead Management](#39-domain-crm-lead-management)
4. [Cross-Cutting Stories](#4-cross-cutting-stories)
5. [Negative & Edge Case Stories](#5-negative--edge-case-stories)
6. [Traceability Matrix](#6-traceability-matrix)
7. [Relationship to Canonical Documents](#7-relationship-to-canonical-documents)
8. [Non-Goals](#8-non-goals)

---

# 1. Introduction

## 1.1. Purpose

This document provides the **canonical mapping** between:

- **User Stories** (what users need to accomplish)
- **Acceptance Criteria** (how we verify it works)
- **API Contracts** (technical implementation)

**Why this document exists:**

- ✅ Eliminates ambiguity between requirements and implementation
- ✅ Serves as test specification for automation
- ✅ Enables contract testing and code generation
- ✅ Provides single source of truth for MVP features

## 1.2. How to Use This Document

**For Backend Developers:**
- Each story maps to specific endpoints
- Acceptance criteria define expected behavior
- Error codes specify failure handling

**For Frontend Developers:**
- Stories describe user flows
- API mappings show which endpoints to call
- Error mappings define UI error handling

**For QA Engineers:**
- Acceptance criteria are test scenarios
- Each criterion must be testable automatically
- Error scenarios define negative test cases

**For Product Owners:**
- Stories define MVP scope
- Acceptance criteria define "done"
- Out-of-scope items are explicitly listed

## 1.3. Key Principle: Testability

**Critical Rule:** If a story cannot be verified by an automated test, it is insufficiently specified.

Every acceptance criterion follows the pattern:
```
GIVEN [precondition]
WHEN [action]
THEN [expected result]
```

---

# 2. Story → API Mapping Principles

## 2.1. Story Ownership

**Format:** Each story has a unique ID: `{DOMAIN}-{NUMBER}`

**Examples:**
- `AUTH-01` — User registration
- `SEARCH-02` — Filter warehouses by location
- `BOOKING-05` — Cancel booking

## 2.2. API Responsibility

**Each story maps to:**
- One or more API endpoints
- Specific HTTP methods
- Required authentication roles
- Expected responses

**Mapping Structure:**
```
Story → Endpoint(s) → Request/Response → Errors
```

## 2.3. Error Ownership

**Every story includes:**
- Happy path scenarios
- Error scenarios (4xx, 5xx)
- Edge cases (boundary conditions)

## 2.4. Auth & Role Assumptions

**Authentication Context:**
- 🔓 **guest** — No authentication required
- 🔐 **user** — Requires authenticated session (role: user)
- 🏢 **operator** — Requires operator privileges
- 👑 **admin** — Requires admin privileges

**Cookie-Based Auth:** Frontend does NOT handle tokens. Browser automatically sends httpOnly cookies.

---

# 3. Core Domains

---

## 3.1. Domain: Authentication & Roles

### Story AUTH-01: User Registration

**As a** new visitor  
**I want to** create an account  
**So that** I can book storage and manage my reservations

**Priority:** HIGH  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid registration | No existing account with email | User submits valid email, password, name, phone | Account created, user logged in, auth cookies set |
| AC-02 | Email validation | User enters invalid email format | Form submitted | 400 error, validation message displayed |
| AC-03 | Duplicate email | User enters already registered email | Form submitted | 409 error, "Email already exists" message |
| AC-04 | Weak password | Password < 8 chars or missing requirements | Form submitted | 400 error, password requirements shown |
| AC-05 | Missing required fields | Name or email is empty | Form submitted | 400 error, field-specific messages |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/register` | POST | 🔓 guest | Create new user account |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Ahmed Al-Rashid",
  "phone": "+971501234567"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Al-Rashid",
      "role": "user"
    }
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z",
    "request_id": "req_register123"
  }
}
```

**Response Headers:**
```http
Set-Cookie: auth_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
Set-Cookie: refresh_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid email format, weak password, missing fields | "Validation failed" |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered | "Email already exists" |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many registration attempts | "Too many requests, try again later" |

---

### Story AUTH-02: User Login

**As a** registered user  
**I want to** log in to my account  
**So that** I can access my bookings and personal data

**Priority:** HIGH  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid login | User has valid credentials | Correct email and password submitted | User logged in, auth cookies set, redirected to dashboard |
| AC-02 | Invalid credentials | User enters wrong password | Form submitted | 401 error, "Invalid credentials" message |
| AC-03 | Non-existent user | Email not registered | Form submitted | 401 error, "Invalid credentials" message (same as wrong password for security) |
| AC-04 | Empty fields | Email or password is empty | Form submitted | 400 error, field-specific messages |
| AC-05 | Rate limiting | 5+ failed login attempts in 5 minutes | 6th attempt | 429 error, "Too many attempts" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | 🔓 guest | Authenticate user |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Al-Rashid",
      "role": "user"
    }
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z",
    "request_id": "req_login123"
  }
}
```

**Response Headers:**
```http
Set-Cookie: auth_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
Set-Cookie: refresh_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password | "Invalid email or password" |
| `VALIDATION_ERROR` | 400 | Missing fields | "Validation failed" |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many login attempts | "Too many attempts, try again in 5 minutes" |

---

### Story AUTH-03: Token Refresh

**As a** logged-in user  
**I want** my session to be automatically refreshed  
**So that** I don't have to log in repeatedly

**Priority:** HIGH  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid refresh | User has valid refresh token | Access token expires, refresh endpoint called | New access token issued, session continues |
| AC-02 | Expired refresh token | Refresh token expired | Refresh endpoint called | 401 error, user must log in again |
| AC-03 | Invalid refresh token | Refresh token is invalid/tampered | Refresh endpoint called | 401 error, user must log in again |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/refresh` | POST | 🔓 guest (but requires refresh cookie) | Issue new access token |

**Request:** No body (uses refresh_token cookie)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Al-Rashid",
      "role": "user"
    }
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

**Response Headers:**
```http
Set-Cookie: auth_token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_TOKEN` | 401 | Refresh token invalid or expired | "Invalid or expired refresh token" |

---

### Story AUTH-04: User Logout

**As a** logged-in user  
**I want to** log out of my account  
**So that** my session is terminated securely

**Priority:** MEDIUM  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Successful logout | User is logged in | User clicks logout | Auth cookies cleared, session terminated, redirected to home |
| AC-02 | Already logged out | User is not logged in | Logout endpoint called | No error, success response |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/logout` | POST | 🔐 user (or any authenticated role) | Terminate session |

**Request:** No body

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

**Response Headers:**
```http
Set-Cookie: auth_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
Set-Cookie: refresh_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| No errors expected | - | Logout is idempotent | - |

---

## 3.2. Domain: Search & Discovery

### Story SEARCH-01: Search Warehouses by Location

**As a** user (guest or authenticated)  
**I want to** search for warehouses near a specific location  
**So that** I can find storage options close to me

**Priority:** HIGH  
**Epic:** Search & Discovery  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Search by coordinates | User provides lat/lng coordinates | Search submitted | Warehouses within default radius returned, sorted by distance |
| AC-02 | Search by address | User enters address (autocomplete) | Address resolved to coordinates, search submitted | Warehouses near address returned |
| AC-03 | No results | No warehouses in specified area | Search submitted | Empty results array, "No warehouses found" message |
| AC-04 | Pagination | More than 12 results | User requests page 2 | Results 13-24 returned with pagination metadata |
| AC-05 | Default location | No location specified | Search without location | All warehouses returned (or default city center) |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/warehouses` | GET | 🔓 guest | Search warehouses with filters |

**Query Parameters:**
```
?lat=55.751244
&lng=37.618423
&radius=10000
&page=1
&per_page=12
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "StorageHub Al Quoz",
      "address": "Al Quoz Industrial Area 3, Dubai",
      "latitude": 55.7123,
      "longitude": 37.8234,
      "distance_km": 2.5,
      "rating": 4.8,
      "min_price_monthly": 3500,
      "available_boxes": 12
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 47,
    "total_pages": 4,
    "has_next": true,
    "has_previous": false
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z",
    "request_id": "req_search123"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid coordinates, negative radius | "Invalid search parameters" |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many search requests | "Too many requests" |

---

### Story SEARCH-02: Filter Warehouses by Criteria

**As a** user  
**I want to** filter warehouses by price, size, and amenities  
**So that** I can find storage that meets my specific needs

**Priority:** HIGH  
**Epic:** Search & Discovery  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Filter by price range | User sets min/max price | Filter applied | Only warehouses with boxes in price range returned |
| AC-02 | Filter by box size | User selects size (S, M, L, XL) | Filter applied | Only warehouses with available boxes of selected size returned |
| AC-03 | Filter by amenities | User selects "24/7 access", "climate control" | Filter applied | Only warehouses with selected amenities returned |
| AC-04 | Multiple filters | User applies price, size, and amenities filters | All filters applied | Results match ALL criteria (AND logic) |
| AC-05 | Sort results | User selects sort order (price, distance, rating) | Sort applied | Results re-ordered by selected criterion |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/warehouses` | GET | 🔓 guest | Search with filters and sorting |

**Query Parameters:**
```
?lat=55.751244
&lng=37.618423
&min_price=3000
&max_price=8000
&size=M,L
&amenities=24_7_access,climate_control
&sort_by=price
&sort_order=asc
```

**Success Response:** Same as SEARCH-01

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid price range, unknown size, invalid amenity | "Invalid filter parameters" |

---

### Story SEARCH-03: View Warehouse Details

**As a** user  
**I want to** view detailed information about a warehouse  
**So that** I can make an informed booking decision

**Priority:** HIGH  
**Epic:** Search & Discovery  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | View valid warehouse | Warehouse exists | User navigates to warehouse page | Full details displayed: photos, description, location, boxes, reviews |
| AC-02 | View non-existent warehouse | Warehouse ID does not exist | User navigates to invalid ID | 404 error, "Warehouse not found" |
| AC-03 | View deleted warehouse | Warehouse is soft-deleted | User navigates to deleted warehouse | 404 error (soft-deleted warehouses are hidden) |
| AC-04 | View boxes | Warehouse has multiple boxes | Details page loaded | All available boxes shown with sizes, prices, availability |
| AC-05 | View reviews | Warehouse has reviews | Details page loaded | Reviews displayed with ratings, comments, dates |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/warehouses/{id}` | GET | 🔓 guest | Get detailed warehouse information |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "StorageHub Al Quoz",
    "description": "Modern storage complex...",
    "address": "Al Quoz Industrial Area 3, Dubai",
    "latitude": 55.7123,
    "longitude": 37.8234,
    "rating": 4.8,
    "review_count": 42,
    "amenities": ["24_7_access", "climate_control", "security"],
    "services": ["packing_materials", "parking"],
    "photos": [
      {"url": "https://cdn.../photo1.jpg", "is_main": true},
      {"url": "https://cdn.../photo2.jpg", "is_main": false}
    ],
    "boxes": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "size": "M",
        "dimensions": "2x2x2.5m",
        "price_monthly": 4500,
        "is_available": true
      }
    ],
    "operator": {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "company_name": "StorageOK LLC",
      "phone": "+971501234567"
    }
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `NOT_FOUND` | 404 | Warehouse ID does not exist or is deleted | "Warehouse not found" |

---

### Story SEARCH-04: View Warehouses on Map

**As a** user  
**I want to** see warehouses displayed on an interactive map  
**So that** I can visually understand their locations

**Priority:** HIGH  
**Epic:** Search & Discovery  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Load map | User navigates to map view | Page loads | Google Map displayed centered on Moscow with warehouse markers |
| AC-02 | Cluster markers | Many warehouses in small area, zoomed out | Map loaded | Markers grouped into clusters showing count |
| AC-03 | Click marker | Single warehouse marker visible | User clicks marker | Popup shows warehouse name, rating, min price, "View Details" link |
| AC-04 | Navigate to details | Popup displayed | User clicks "View Details" | Redirected to warehouse details page |
| AC-05 | Filter on map | User applies filters (price, size, etc.) | Filters applied | Map updates to show only matching warehouses |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/warehouses/map` | GET | 🔓 guest | Get warehouse data optimized for map display |

**Query Parameters:**
```
?bounds=55.7,37.5,55.8,37.7  # viewport bounds
&zoom=12
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "warehouses": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "StorageHub Al Quoz",
        "latitude": 55.7123,
        "longitude": 37.8234,
        "min_price_monthly": 3500,
        "rating": 4.8
      }
    ],
    "clusters": [
      {
        "latitude": 55.75,
        "longitude": 37.62,
        "count": 5
      }
    ]
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid bounds format | "Invalid map bounds" |

---

## 3.3. Domain: Warehouse & Boxes

### Story WAREHOUSE-01: Create Warehouse (Operator)

**As an** operator  
**I want to** add a new warehouse to the platform  
**So that** users can discover and book my storage

**Priority:** HIGH  
**Epic:** Warehouse Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid warehouse creation | Operator is authenticated | Complete warehouse details submitted | Warehouse created, visible in operator dashboard, pending admin approval |
| AC-02 | Missing required fields | Operator omits name or address | Form submitted | 400 error, field-specific validation messages |
| AC-03 | Invalid coordinates | Latitude/longitude out of range | Form submitted | 400 error, "Invalid coordinates" |
| AC-04 | Unauthorized access | User (not operator) attempts to create | Request sent | 403 error, "Insufficient permissions" |
| AC-05 | Upload photos | Operator uploads up to 10 photos | Photos submitted | Photos uploaded to CDN, URLs stored with warehouse |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operator/warehouses` | POST | 🏢 operator | Create new warehouse |

**Request Body:**
```json
{
  "name": "StorageHub Al Quoz",
  "description": "Modern storage complex with 24/7 access",
  "address": "Al Quoz Industrial Area 3, Dubai",
  "latitude": 55.7123,
  "longitude": 37.8234,
  "amenities": ["24_7_access", "climate_control", "security"],
  "services": ["packing_materials", "parking"],
  "photos": [
    {"url": "https://cdn.../photo1.jpg", "is_main": true},
    {"url": "https://cdn.../photo2.jpg", "is_main": false}
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "StorageHub Al Quoz",
    "operator_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "is_active": false,
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "message": "Warehouse created successfully. Awaiting admin approval.",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Missing fields, invalid coordinates | "Validation failed" |
| `FORBIDDEN` | 403 | User role is not operator | "Insufficient permissions" |
| `UNAUTHORIZED` | 401 | Not authenticated | "Authentication required" |

---

### Story WAREHOUSE-02: Manage Boxes (Operator)

**As an** operator  
**I want to** add and manage boxes within my warehouse  
**So that** users can book specific storage units

**Priority:** HIGH  
**Epic:** Warehouse Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Add box | Operator owns warehouse | Box details submitted (size, price, quantity) | Box created, visible in warehouse details |
| AC-02 | Update box price | Box exists | Operator changes price | Price updated, new bookings use new price |
| AC-03 | Deactivate box | Box exists, no active bookings | Operator sets is_available=false | Box hidden from search, existing bookings unaffected |
| AC-04 | Cannot delete box with booking | Box has active booking | Operator attempts to delete | 409 error, "Cannot delete box with active bookings" |
| AC-05 | Unauthorized access | Operator attempts to manage another operator's box | Request sent | 403 error, "Not authorized to manage this box" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operator/warehouses/{id}/boxes` | POST | 🏢 operator | Add boxes to warehouse |
| `/operator/boxes/{id}` | PATCH | 🏢 operator | Update box details |
| `/operator/boxes/{id}` | DELETE | 🏢 operator | Deactivate box |

**Request Body (Create Box):**
```json
{
  "size": "M",
  "dimensions": "2x2x2.5m",
  "price_monthly": 4500,
  "total_quantity": 10,
  "available_quantity": 10
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
    "size": "M",
    "price_monthly": 4500,
    "is_available": true,
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid size, negative price | "Validation failed" |
| `FORBIDDEN` | 403 | Not owner of warehouse | "Insufficient permissions" |
| `CONFLICT` | 409 | Attempting to delete box with active booking | "Cannot delete box with active bookings" |

---

## 3.4. Domain: Booking Management

### Story BOOKING-01: Create Booking (User)

**As a** user  
**I want to** book a storage box  
**So that** I can reserve storage space for my belongings

**Priority:** HIGH  
**Epic:** Booking Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid booking | User authenticated, box available | User submits booking (box_id, start_date, months) | Booking created with status=pending, operator notified |
| AC-02 | Box unavailable | Box is already booked | User attempts booking | 409 error, "Box not available" |
| AC-03 | Invalid date | Start date is in the past | Form submitted | 422 error, "Start date must be today or future" |
| AC-04 | Invalid duration | Months < 1 or > 12 | Form submitted | 400 error, "Duration must be 1-12 months" |
| AC-05 | Price calculation | User selects 3 months, box costs 4500/month | Booking created | price_total = 13500 (4500 * 3) |
| AC-06 | Unauthorized access | User not authenticated | Booking attempted | 401 error, "Authentication required" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/bookings` | POST | 🔐 user | Create new booking request |

**Request Body:**
```json
{
  "box_id": "770e8400-e29b-41d4-a716-446655440002",
  "start_date": "2025-12-20",
  "months": 3
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "booking_number": "BK-2025-001234",
    "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "box_id": "770e8400-e29b-41d4-a716-446655440002",
    "status": "pending",
    "start_date": "2025-12-20",
    "duration_months": 3,
    "price_total": 13500,
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "message": "Booking created. Awaiting operator confirmation.",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `BOX_NOT_AVAILABLE` | 409 | Box already booked | "Box is not available" |
| `INVALID_DATE_RANGE` | 422 | Start date in past | "Start date must be today or future" |
| `VALIDATION_ERROR` | 400 | Missing fields, invalid duration | "Validation failed" |
| `UNAUTHORIZED` | 401 | Not authenticated | "Authentication required" |

---

### Story BOOKING-02: Confirm Booking (Operator)

**As an** operator  
**I want to** confirm pending booking requests  
**So that** I can approve storage reservations

**Priority:** HIGH  
**Epic:** Booking Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Confirm pending booking | Booking exists with status=pending | Operator confirms | Status changes to confirmed, user notified |
| AC-02 | Cannot confirm non-pending | Booking status is not pending | Operator attempts confirm | 422 error, "Only pending bookings can be confirmed" |
| AC-03 | Unauthorized access | Operator does not own the warehouse | Operator attempts confirm | 403 error, "Not authorized" |
| AC-04 | Booking not found | Booking ID does not exist | Operator attempts confirm | 404 error, "Booking not found" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operator/bookings/{id}/confirm` | PATCH | 🏢 operator | Confirm booking |

**Request Body:** None (or optional notes)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "status": "confirmed",
    "confirmed_at": "2025-12-16T15:00:00Z"
  },
  "meta": {
    "message": "Booking confirmed successfully",
    "timestamp": "2025-12-16T15:00:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_STATUS_TRANSITION` | 422 | Booking not pending | "Only pending bookings can be confirmed" |
| `FORBIDDEN` | 403 | Not owner of warehouse | "Insufficient permissions" |
| `NOT_FOUND` | 404 | Booking does not exist | "Booking not found" |

---

### Story BOOKING-03: Cancel Booking

**As a** user or operator  
**I want to** cancel a booking  
**So that** I can terminate the reservation

**Priority:** HIGH  
**Epic:** Booking Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | User cancels own booking | User owns booking, status=pending or confirmed | User cancels | Status=cancelled, cancelled_by=user, box becomes available |
| AC-02 | Operator cancels booking | Operator owns warehouse, booking exists | Operator cancels with reason | Status=cancelled, cancelled_by=operator, cancel_reason set, user notified |
| AC-03 | Cannot cancel completed | Booking status=completed | Cancel attempted | 422 error, "Cannot cancel completed booking" |
| AC-04 | Cannot cancel already cancelled | Booking status=cancelled | Cancel attempted | 422 error, "Booking already cancelled" |
| AC-05 | Unauthorized cancel | User A attempts to cancel User B's booking | Cancel attempted | 403 error, "Not authorized" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/bookings/{id}/cancel` | PATCH | 🔐 user | Cancel own booking |
| `/operator/bookings/{id}/cancel` | PATCH | 🏢 operator | Cancel booking (with reason) |

**Request Body (Operator):**
```json
{
  "cancel_reason": "Warehouse maintenance required"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "status": "cancelled",
    "cancelled_by": "operator",
    "cancel_reason": "Warehouse maintenance required",
    "cancelled_at": "2025-12-16T15:30:00Z"
  },
  "meta": {
    "message": "Booking cancelled successfully",
    "timestamp": "2025-12-16T15:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_STATUS_TRANSITION` | 422 | Booking completed or already cancelled | "Cannot cancel this booking" |
| `FORBIDDEN` | 403 | Not authorized to cancel | "Insufficient permissions" |
| `NOT_FOUND` | 404 | Booking does not exist | "Booking not found" |

---

### Story BOOKING-04: View Booking History

**As a** user  
**I want to** view my booking history  
**So that** I can track past and current reservations

**Priority:** MEDIUM  
**Epic:** Booking Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | View all bookings | User has multiple bookings | User navigates to booking history | All bookings displayed with status, dates, warehouse details |
| AC-02 | Filter by status | User has bookings in different statuses | User filters by "active" | Only confirmed/active bookings shown |
| AC-03 | Empty history | User has no bookings | User navigates to booking history | Empty state message displayed |
| AC-04 | Pagination | User has 50+ bookings | User navigates pages | Results paginated, 10 per page |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/bookings` | GET | 🔐 user | Get user's booking list |

**Query Parameters:**
```
?status=pending,confirmed
&page=1
&per_page=10
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440008",
      "booking_number": "BK-2025-001234",
      "status": "confirmed",
      "start_date": "2025-12-20",
      "duration_months": 3,
      "price_total": 13500,
      "warehouse": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "StorageHub Al Quoz",
        "address": "Al Quoz Industrial Area 3, Dubai"
      },
      "box": {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "size": "M",
        "dimensions": "2x2x2.5m"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 5,
    "total_pages": 1
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `UNAUTHORIZED` | 401 | Not authenticated | "Authentication required" |

---

## 3.5. Domain: User Account

### Story USER-01: View Profile

**As a** user  
**I want to** view and edit my profile  
**So that** I can keep my information up to date

**Priority:** MEDIUM  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | View profile | User authenticated | User navigates to profile | Profile data displayed (name, email, phone) |
| AC-02 | Update name | User changes name | Form submitted | Name updated, success message shown |
| AC-03 | Update phone | User changes phone | Form submitted | Phone updated, success message shown |
| AC-04 | Cannot change email | User attempts to change email | Update attempted | Email field is read-only (or change requires re-verification) |
| AC-05 | Invalid phone format | User enters invalid phone | Form submitted | 400 error, "Invalid phone format" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/me` | GET | 🔐 user | Get current user profile |
| `/users/me` | PATCH | 🔐 user | Update profile |

**Request Body (Update):**
```json
{
  "name": "Ahmed Hassan Al-Mansoori",
  "phone": "+79991234568"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "email": "user@example.com",
    "name": "Ahmed Hassan Al-Mansoori",
    "phone": "+79991234568",
    "role": "user",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid phone format | "Validation failed" |
| `UNAUTHORIZED` | 401 | Not authenticated | "Authentication required" |

---

### Story USER-02: Change Password

**As a** user  
**I want to** change my password  
**So that** I can maintain account security

**Priority:** MEDIUM  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid password change | User authenticated | User submits old + new password | Password updated, success message, user remains logged in |
| AC-02 | Wrong current password | User enters incorrect old password | Form submitted | 401 error, "Current password is incorrect" |
| AC-03 | Weak new password | New password does not meet requirements | Form submitted | 400 error, password requirements shown |
| AC-04 | Same as current | New password same as current | Form submitted | 400 error, "New password must be different" |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/me/password` | PUT | 🔐 user | Change password |

**Request Body:**
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewSecurePass456!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_CREDENTIALS` | 401 | Current password incorrect | "Current password is incorrect" |
| `VALIDATION_ERROR` | 400 | Weak password, same as current | "Validation failed" |

---

### Story USER-03: Delete Account

**As a** user  
**I want to** delete my account  
**So that** I can exercise my right to be forgotten

**Priority:** LOW  
**Epic:** User Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Delete account | User authenticated, no active bookings | User confirms deletion | Account soft-deleted, user logged out, data anonymized |
| AC-02 | Cannot delete with active bookings | User has confirmed or active booking | Deletion attempted | 409 error, "Cancel active bookings first" |
| AC-03 | Confirmation required | User initiates deletion | First request sent | Warning message, requires second confirmation |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/me` | DELETE | 🔐 user | Soft-delete account |

**Request Body:**
```json
{
  "confirmation": "DELETE"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Account deleted successfully"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `CONFLICT` | 409 | User has active bookings | "Cannot delete account with active bookings" |
| `VALIDATION_ERROR` | 400 | Confirmation not provided | "Confirmation required" |

---

## 3.6. Domain: Operator Account

### Story OPERATOR-01: Register as Operator

**As a** user  
**I want to** register as an operator  
**So that** I can list my warehouses on the platform

**Priority:** HIGH  
**Epic:** Operator Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid operator registration | User authenticated, not yet operator | User submits company details | Operator profile created, role changes to operator, pending verification |
| AC-02 | Already operator | User already has operator role | Registration attempted | 409 error, "User is already an operator" |
| AC-03 | Missing required fields | Company name or tax ID omitted | Form submitted | 400 error, field-specific messages |
| AC-04 | Verification pending | Operator registered but not verified | Operator attempts actions | Some features restricted until verification |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operators/register` | POST | 🔐 user | Register as operator |

**Request Body:**
```json
{
  "company_name": "StorageOK LLC",
  "tax_id": "7707123456",
  "legal_address": "Business Bay, Office 1234, Dubai",
  "billing_email": "billing@skladok.ru",
  "support_phone": "+971501234567",
  "support_email": "support@skladok.ru"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cc0e8400-e29b-41d4-a716-446655440007",
    "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "company_name": "StorageOK LLC",
    "is_verified": false,
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "message": "Operator registration successful. Awaiting verification.",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `ALREADY_OPERATOR` | 409 | User already has operator role | "User is already an operator" |
| `VALIDATION_ERROR` | 400 | Missing fields, invalid tax ID | "Validation failed" |

---

### Story OPERATOR-02: View Operator Dashboard

**As an** operator  
**I want to** view my dashboard with key metrics  
**So that** I can monitor my business performance

**Priority:** HIGH  
**Epic:** Operator Management  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | View dashboard | Operator authenticated | Dashboard page loaded | Displays: total bookings, active bookings, occupancy rate, recent activity |
| AC-02 | No warehouses | Operator has no warehouses | Dashboard loaded | Empty state with "Add your first warehouse" CTA |
| AC-03 | Metrics calculation | Operator has 10 boxes, 7 occupied | Dashboard loaded | Occupancy rate = 70% |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operator/dashboard` | GET | 🏢 operator | Get dashboard metrics |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_warehouses": 3,
    "total_boxes": 50,
    "occupied_boxes": 35,
    "occupancy_rate": 70.0,
    "total_bookings": 120,
    "pending_bookings": 5,
    "active_bookings": 35,
    "revenue_current_month": 157500,
    "recent_activity": [
      {
        "type": "new_booking",
        "booking_id": "dd0e8400-e29b-41d4-a716-446655440008",
        "warehouse_name": "StorageHub Al Quoz",
        "timestamp": "2025-12-16T14:00:00Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `FORBIDDEN` | 403 | User role is not operator | "Operator access required" |

---

## 3.7. Domain: Reviews & Favorites

### Story REVIEW-01: Write Review

**As a** user  
**I want to** write a review for a warehouse  
**So that** I can share my experience with other users

**Priority:** MEDIUM  
**Epic:** Reviews & Ratings  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid review | User has completed booking at warehouse | User submits rating + comment | Review created, marked as verified, warehouse rating updated |
| AC-02 | No booking | User has never booked this warehouse | Review attempted | Review created but verified=false (or 403 error if strict) |
| AC-03 | Already reviewed | User already reviewed this warehouse | Second review attempted | 409 error, "You have already reviewed this warehouse" |
| AC-04 | Invalid rating | Rating < 1 or > 5 | Form submitted | 400 error, "Rating must be 1-5" |
| AC-05 | Empty comment allowed | User submits rating without comment | Form submitted | Review created with null comment |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/warehouses/{id}/reviews` | POST | 🔐 user | Create review |

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent storage facility, everything is clean and convenient!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ee0e8400-e29b-41d4-a716-446655440009",
    "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "comment": "Excellent storage facility, everything is clean and convenient!",
    "verified": true,
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `DUPLICATE_REVIEW` | 409 | User already reviewed this warehouse | "You have already reviewed this warehouse" |
| `VALIDATION_ERROR` | 400 | Invalid rating (not 1-5) | "Rating must be between 1 and 5" |

---

### Story FAVORITE-01: Add to Favorites

**As a** user  
**I want to** save warehouses to my favorites  
**So that** I can quickly find them later

**Priority:** LOW  
**Epic:** User Experience  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Add favorite | User authenticated, warehouse not in favorites | User clicks "Add to Favorites" | Warehouse added to favorites, heart icon filled |
| AC-02 | Already favorited | Warehouse already in favorites | User attempts to add again | 409 error or idempotent success |
| AC-03 | Remove favorite | Warehouse in favorites | User clicks "Remove from Favorites" | Warehouse removed, heart icon unfilled |
| AC-04 | View favorites list | User has multiple favorites | User navigates to favorites page | All favorited warehouses displayed |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/me/favorites` | POST | 🔐 user | Add warehouse to favorites |
| `/users/me/favorites/{warehouseId}` | DELETE | 🔐 user | Remove from favorites |
| `/users/me/favorites` | GET | 🔐 user | Get user's favorites list |

**Request Body (Add):**
```json
{
  "warehouse_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ff0e8400-e29b-41d4-a716-446655440010",
    "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `DUPLICATE_FAVORITE` | 409 | Warehouse already in favorites | "Warehouse already in favorites" (or idempotent success) |
| `NOT_FOUND` | 404 | Warehouse does not exist | "Warehouse not found" |

---

## 3.8. Domain: AI Features

### Story AI-01: AI Box Size Recommendation

**As a** user  
**I want to** get AI-powered box size recommendations  
**So that** I can choose the right storage size for my items

**Priority:** HIGH  
**Epic:** AI Features  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid recommendation | User describes items (e.g., "sofa, 10 boxes, bicycle") | AI request submitted | Recommended box sizes returned (e.g., "L" or "XL"), explanation provided |
| AC-02 | Unclear input | User provides vague description ("various items") | AI request submitted | AI asks clarifying questions or returns multiple size options |
| AC-03 | AI unavailable | OpenAI API is down | Request submitted | Fallback to rule-based recommendation, warning shown |
| AC-04 | Request logging | Any AI request made | Request processed | Request/response logged to ai_requests_log table |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/ai/box-size-recommendation` | POST | 🔓 guest (or 🔐 user) | Get AI box size recommendation |

**Request Body:**
```json
{
  "items_description": "sofa, 10 boxes of books, bicycle, winter clothes"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommended_sizes": ["L", "XL"],
    "explanation": "For the sofa and bicycle, you'll need a spacious box. We recommend size L (8-10 sq.m) or XL (12+ sq.m) depending on the sofa size.",
    "estimated_space_m2": 10,
    "confidence": "high"
  },
  "meta": {
    "ai_provider": "openai",
    "model": "gpt-4-turbo",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

**Fallback Response (AI Unavailable):**
```json
{
  "success": true,
  "data": {
    "recommended_sizes": ["M", "L"],
    "explanation": "Based on typical furniture dimensions, we recommend a box size M or L.",
    "confidence": "low",
    "fallback": true
  },
  "meta": {
    "ai_provider": "rule_based",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Empty description | "Items description is required" |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many AI requests | "Too many requests" |

---

## 3.9. Domain: CRM Lead Management

### Story CRM-01: Capture Lead (Public Form)

**As a** visitor  
**I want to** submit a contact request  
**So that** an operator can reach out to me

**Priority:** HIGH  
**Epic:** CRM  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Valid lead submission | User fills contact form | Form submitted | Lead created with status=new, assigned to warehouse operator, confirmation shown |
| AC-02 | Missing required fields | Name, phone, or email omitted | Form submitted | 400 error, field-specific messages |
| AC-03 | Invalid email | Email format incorrect | Form submitted | 400 error, "Invalid email format" |
| AC-04 | Spam detection | Honeypot field filled or rapid submissions | Form submitted | Lead marked as spam or rejected |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/leads` | POST | 🔓 guest | Create lead from public form |

**Request Body:**
```json
{
  "name": "Fatima Al-Zaabi",
  "phone": "+971501234567",
  "email": "maria@example.com",
  "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
  "preferred_box_size": "M",
  "message": "I want to rent a box for 6 months"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "gg0e8400-e29b-41d4-a716-446655440011",
    "name": "Fatima Al-Zaabi",
    "status": "new",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-12-16T14:30:00Z"
  },
  "meta": {
    "message": "Your request has been submitted. We will contact you shortly.",
    "timestamp": "2025-12-16T14:30:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `VALIDATION_ERROR` | 400 | Missing fields, invalid email/phone | "Validation failed" |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many submissions from same IP | "Too many requests" |

---

### Story CRM-02: Manage Leads (Operator)

**As an** operator  
**I want to** view and manage my leads  
**So that** I can follow up with potential customers

**Priority:** HIGH  
**Epic:** CRM  
**Scope:** MVP v1

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | View leads list | Operator has assigned leads | Operator navigates to CRM | All leads displayed with status, name, contact info, timestamp |
| AC-02 | Filter by status | Operator has leads in different statuses | Filter applied (e.g., "new") | Only leads with selected status shown |
| AC-03 | Update lead status | Lead exists with status=new | Operator changes to "contacted" | Status updated, status_history entry created |
| AC-04 | Add activity note | Lead exists | Operator adds note "Called, agreed on meeting" | Activity created, visible in lead timeline |
| AC-05 | Mark as spam | Spam lead submitted | Operator marks as spam | is_spam=true, lead hidden from default views |

#### API Mapping

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/operator/leads` | GET | 🏢 operator | Get operator's leads list |
| `/operator/leads/{id}/status` | PATCH | 🏢 operator | Update lead status |
| `/operator/leads/{id}/activities` | POST | 🏢 operator | Add activity note |

**Request Body (Update Status):**
```json
{
  "status": "contacted"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "gg0e8400-e29b-41d4-a716-446655440011",
    "status": "contacted",
    "updated_at": "2025-12-16T15:00:00Z"
  },
  "meta": {
    "timestamp": "2025-12-16T15:00:00Z"
  }
}
```

#### Error Scenarios

| Error Code | HTTP Status | When | Message |
|------------|-------------|------|---------|
| `INVALID_STATUS_TRANSITION` | 422 | Invalid status value or transition | "Invalid status transition" |
| `FORBIDDEN` | 403 | Operator does not own this lead | "Insufficient permissions" |
| `NOT_FOUND` | 404 | Lead does not exist | "Lead not found" |

---

# 4. Cross-Cutting Stories

## Story CROSS-01: Pagination

**As a** developer  
**I want** consistent pagination across all list endpoints  
**So that** large datasets are handled efficiently

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Default pagination | No page/per_page specified | List endpoint called | Returns first 12 results with pagination metadata |
| AC-02 | Custom page size | per_page=20 specified | List endpoint called | Returns 20 results per page |
| AC-03 | Out of range page | page=999 requested, only 5 pages exist | List endpoint called | Returns empty array, pagination shows total_pages=5 |
| AC-04 | Pagination metadata | Any paginated request | Response returned | Includes: page, per_page, total, total_pages, has_next, has_previous |

**Applies To:**
- `/warehouses`
- `/bookings`
- `/operator/bookings`
- `/operator/leads`
- `/warehouses/{id}/reviews`

**Standard Pagination Response:**
```json
{
  "pagination": {
    "page": 2,
    "per_page": 12,
    "total": 47,
    "total_pages": 4,
    "has_next": true,
    "has_previous": true
  }
}
```

---

## Story CROSS-02: Filtering

**As a** user  
**I want** to apply multiple filters simultaneously  
**So that** I can narrow down search results

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Multiple filters | User applies price, size, amenities filters | All filters sent in query params | Results match ALL criteria (AND logic) |
| AC-02 | Invalid filter values | Unknown amenity or size | Request sent | 400 error, "Invalid filter value" |
| AC-03 | Empty results | Filters too restrictive, no matches | Request sent | Empty array returned, no error |

**Applies To:** `/warehouses` (search)

---

## Story CROSS-03: Sorting

**As a** user  
**I want** to sort results by different criteria  
**So that** I can find the most relevant options first

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Sort by price | sort_by=price, sort_order=asc | Request sent | Results ordered by price ascending |
| AC-02 | Sort by distance | sort_by=distance (when location provided) | Request sent | Results ordered by distance from user location |
| AC-03 | Sort by rating | sort_by=rating, sort_order=desc | Request sent | Results ordered by rating descending |
| AC-04 | Default sort | No sort specified | Request sent | Default order (e.g., relevance or distance) |

**Applies To:** `/warehouses`, `/operator/bookings`

---

## Story CROSS-04: Authorization

**As a** system  
**I want** to enforce role-based access control  
**So that** users can only access authorized resources

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Guest access | User not authenticated | Public endpoint accessed | Success, no auth required |
| AC-02 | User auth required | User not authenticated | User-only endpoint accessed | 401 error, "Authentication required" |
| AC-03 | Operator access | User role, not operator | Operator endpoint accessed | 403 error, "Insufficient permissions" |
| AC-04 | Resource ownership | User A attempts to access User B's booking | GET /bookings/{B's booking} | 403 error, "Not authorized to view this resource" |

**Error Matrix:**

| Condition | HTTP Status | Error Code |
|-----------|-------------|------------|
| Not authenticated | 401 | `UNAUTHORIZED` |
| Wrong role | 403 | `FORBIDDEN` |
| Not resource owner | 403 | `FORBIDDEN` |

---

## Story CROSS-05: Rate Limiting

**As a** platform  
**I want** to rate limit API requests  
**So that** I prevent abuse and ensure fair usage

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Within limit | User makes 50 requests in 1 minute | Requests sent | All succeed, X-RateLimit headers included |
| AC-02 | Limit exceeded | User makes 101 requests in 1 minute (limit=100) | 101st request sent | 429 error, "Rate limit exceeded", Retry-After header included |
| AC-03 | Limit reset | User hit rate limit, waits 1 minute | New request sent after reset | Request succeeds |

**Rate Limits:**
- Guest (by IP): 100 requests/minute
- User: 300 requests/minute
- Operator: 500 requests/minute

**Response Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1734363000
```

---

# 5. Negative & Edge Case Stories

## Story EDGE-01: Box Unavailable (Race Condition)

**As a** system  
**I want** to handle concurrent booking attempts gracefully  
**So that** double-booking is prevented

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Concurrent bookings | Two users attempt to book same box simultaneously | Both requests sent at same time | One succeeds (201), other fails (409 "Box not available") |
| AC-02 | Booking during view | User views box as "available", another user books it | User attempts booking | 409 error, "Box is no longer available" |

**Technical Implementation:** Database-level transaction with row locking on `boxes` table.

---

## Story EDGE-02: Stale Data

**As a** user  
**I want** to see accurate real-time availability  
**So that** I don't waste time on unavailable boxes

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Availability updated | Box becomes unavailable | User refreshes warehouse details | Box shown as unavailable |
| AC-02 | Cache invalidation | Warehouse/box updated | Operator saves changes | Cache invalidated, users see updated data within 60 seconds |

**Caching Strategy:** Cache warehouse details for 60 seconds, invalidate on updates.

---

## Story EDGE-03: Partial Failures

**As a** system  
**I want** to handle external service failures gracefully  
**So that** core functionality remains available

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | AI unavailable | OpenAI API is down | User requests AI recommendation | Fallback to rule-based recommendation, warning shown |
| AC-02 | Email service down | SMTP server unavailable | Booking confirmation email fails | Booking still created, email queued for retry |
| AC-03 | Map service timeout | Google Maps API timeout | Map page loaded | Error message shown, list view still accessible |

**Graceful Degradation:** Core booking flow never depends on external services.

---

## Story EDGE-04: Invalid State Transitions

**As a** system  
**I want** to validate state transitions  
**So that** business rules are enforced

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Cannot confirm cancelled | Booking status=cancelled | Operator attempts to confirm | 422 error, "Cannot confirm cancelled booking" |
| AC-02 | Cannot cancel completed | Booking status=completed | User attempts to cancel | 422 error, "Cannot cancel completed booking" |

**Valid Booking Transitions:**
```
pending → confirmed → completed
pending → cancelled
confirmed → cancelled
(no other transitions allowed)
```

**Valid CRM Lead Transitions:**
```
new → contacted → in_progress → closed
(any status) → is_spam=true
```

---

## Story EDGE-05: Large Result Sets

**As a** system  
**I want** to handle large result sets efficiently  
**So that** performance remains acceptable

#### Acceptance Criteria

| ID | Scenario | Given | When | Then |
|----|----------|-------|------|------|
| AC-01 | Limit max per_page | User requests per_page=1000 | Request sent | per_page clamped to max=100 |
| AC-02 | Deep pagination | User requests page=500 | Request sent | Results returned (if pages exist), but performance warning logged |

**Limits:**
- Max per_page: 100
- Max recommended page depth: 100 pages (suggest filtering instead)

---

# 6. Traceability Matrix

Complete mapping of all stories to API endpoints and database entities.

| Story ID | Domain | API Endpoint(s) | Method | Auth | DB Entities | Status |
|----------|--------|-----------------|--------|------|-------------|--------|
| AUTH-01 | Authentication | `/auth/register` | POST | 🔓 | users | ✅ MVP |
| AUTH-02 | Authentication | `/auth/login` | POST | 🔓 | users | ✅ MVP |
| AUTH-03 | Authentication | `/auth/refresh` | POST | 🔓 | users | ✅ MVP |
| AUTH-04 | Authentication | `/auth/logout` | POST | 🔐 | users | ✅ MVP |
| SEARCH-01 | Search | `/warehouses` | GET | 🔓 | warehouses, boxes | ✅ MVP |
| SEARCH-02 | Search | `/warehouses` | GET | 🔓 | warehouses, boxes | ✅ MVP |
| SEARCH-03 | Search | `/warehouses/{id}` | GET | 🔓 | warehouses, boxes, reviews, operators | ✅ MVP |
| SEARCH-04 | Search | `/warehouses/map` | GET | 🔓 | warehouses | ✅ MVP |
| WAREHOUSE-01 | Warehouse | `/operator/warehouses` | POST | 🏢 | warehouses, operators | ✅ MVP |
| WAREHOUSE-02 | Warehouse | `/operator/warehouses/{id}/boxes`, `/operator/boxes/{id}` | POST, PATCH, DELETE | 🏢 | boxes, warehouses | ✅ MVP |
| BOOKING-01 | Booking | `/bookings` | POST | 🔐 | bookings, boxes, users | ✅ MVP |
| BOOKING-02 | Booking | `/operator/bookings/{id}/confirm` | PATCH | 🏢 | bookings | ✅ MVP |
| BOOKING-03 | Booking | `/bookings/{id}/cancel`, `/operator/bookings/{id}/cancel` | PATCH | 🔐/🏢 | bookings, boxes | ✅ MVP |
| BOOKING-04 | Booking | `/bookings` | GET | 🔐 | bookings, warehouses, boxes | ✅ MVP |
| USER-01 | User Account | `/users/me` | GET, PATCH | 🔐 | users | ✅ MVP |
| USER-02 | User Account | `/users/me/password` | PUT | 🔐 | users | ✅ MVP |
| USER-03 | User Account | `/users/me` | DELETE | 🔐 | users, bookings | ✅ MVP |
| OPERATOR-01 | Operator | `/operators/register` | POST | 🔐 | operators, users | ✅ MVP |
| OPERATOR-02 | Operator | `/operator/dashboard` | GET | 🏢 | warehouses, boxes, bookings | ✅ MVP |
| REVIEW-01 | Reviews | `/warehouses/{id}/reviews` | POST | 🔐 | reviews, users, warehouses | ✅ MVP |
| FAVORITE-01 | Favorites | `/users/me/favorites`, `/users/me/favorites/{id}` | GET, POST, DELETE | 🔐 | favorites, users, warehouses | ✅ MVP |
| AI-01 | AI | `/ai/box-size-recommendation` | POST | 🔓 | ai_requests_log | ✅ MVP |
| CRM-01 | CRM | `/leads` | POST | 🔓 | crm_leads, warehouses | ✅ MVP |
| CRM-02 | CRM | `/operator/leads`, `/operator/leads/{id}/status`, `/operator/leads/{id}/activities` | GET, PATCH, POST | 🏢 | crm_leads, crm_activities, crm_status_history | ✅ MVP |
| CROSS-01 | Cross-Cutting | All list endpoints | GET | Varies | N/A | ✅ MVP |
| CROSS-02 | Cross-Cutting | `/warehouses` | GET | 🔓 | warehouses, boxes | ✅ MVP |
| CROSS-03 | Cross-Cutting | `/warehouses`, `/operator/bookings` | GET | Varies | warehouses, bookings | ✅ MVP |
| CROSS-04 | Cross-Cutting | All endpoints | ALL | Varies | N/A | ✅ MVP |
| CROSS-05 | Cross-Cutting | All endpoints | ALL | Varies | N/A | ✅ MVP |
| EDGE-01 | Edge Cases | `/bookings` | POST | 🔐 | bookings, boxes | ✅ MVP |
| EDGE-02 | Edge Cases | `/warehouses/{id}` | GET | 🔓 | warehouses, boxes | ✅ MVP |
| EDGE-03 | Edge Cases | `/ai/*`, email, maps | POST, GET | Varies | N/A | ✅ MVP |
| EDGE-04 | Edge Cases | `/bookings/{id}/confirm`, `/bookings/{id}/cancel` | PATCH | 🔐/🏢 | bookings | ✅ MVP |
| EDGE-05 | Edge Cases | All list endpoints | GET | Varies | N/A | ✅ MVP |

**Total Stories:** 30  
**MVP v1 Stories:** 30 (100%)  
**Post-MVP Stories:** 0

---

# 7. Relationship to Canonical Documents

This document is derived from and must remain consistent with:

| Document | ID | Relationship |
|----------|----|--------------| 
| **Functional Specification MVP v1** | DOC-001 | Source of user stories and business requirements |
| **API Design Blueprint MVP v1** | DOC-015 | Source of API endpoints, methods, and contracts |
| **API Detailed Specification MVP v1** | DOC-016 | Source of detailed request/response formats |
| **Database Specification MVP v1** | DOC-050 | Source of entity definitions and relationships |
| **Security & Compliance Plan MVP v1** | DOC-078 | Source of authentication, authorization, and role definitions |
| **Error Handling & Fault Tolerance Specification MVP v1** | DOC-035 | Source of error codes and handling strategies |
| **Technical Architecture Document** | DOC-002/086 | Source of system architecture and component interactions |
| **Frontend Architecture Specification** | DOC-046 | Source of UI flows and component requirements |

**Conflict Resolution:** If this document contradicts any canonical document, the canonical document takes precedence. This document should be updated to align.

---

# 8. Non-Goals

This document explicitly DOES NOT include:

❌ **UI Design Specifications**
- This document describes *what* users can do, not *how* the UI looks
- UI design is in Frontend Architecture Specification

❌ **API Implementation Details**
- This document maps stories to endpoints, not implementation code
- Implementation is in Backend Implementation Plan

❌ **Database Schema Definitions**
- This document references entities, not table structures
- Schema is in Database Specification

❌ **v1.1+ Features**
- Warehouse comparison
- Advanced analytics
- AI price analysis
- AI description generation
- Payment integration
- Discounts & promo codes

❌ **Infrastructure & DevOps**
- Deployment strategies
- CI/CD pipelines
- Monitoring setup
- These are in separate operational documents

---

## Document Maintenance

**Update Triggers:**
- When a new user story is added to Functional Specification
- When an API endpoint is added/modified in API Design Blueprint
- When acceptance criteria are refined based on implementation feedback
- When database entities are added/modified

**Review Frequency:** Before each sprint/iteration

**Version Control:** Track changes in git with commit messages referencing story IDs

---

**END OF DOCUMENT**

---

## Document Metadata

**Created:** December 16, 2025  
**Last Updated:** December 16, 2025  
**Version:** 1.0  
**Status:** 🟢 GREEN - Canonical  
**Total Stories:** 30  
**Total Pages:** ~45  
**Total Acceptance Criteria:** 100+  
**Estimated Test Cases:** 150+

**Document Owner:** Product & Development Team  
**Reviewers:** Backend Lead, Frontend Lead, QA Lead  
**Approval Status:** ✅ Approved for Implementation
