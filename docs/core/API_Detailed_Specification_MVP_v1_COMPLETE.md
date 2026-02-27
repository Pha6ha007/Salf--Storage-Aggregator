# API Detailed Specification (MVP v1) - COMPLETE

**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Date:** November 30, 2025  
**Status:** Production Ready  
**Document Type:** Complete Technical Specification

---

## 📋 Table of Contents

1. [Introduction](#1-introduction)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Auth API Endpoints](#3-auth-api-endpoints)
4. [Users API](#4-users-api)
5. [Operators API](#5-operators-api)
6. [Warehouses API](#6-warehouses-api)
7. [Boxes API](#7-boxes-api)
8. [Bookings API](#8-bookings-api)
9. [Reviews API](#9-reviews-api)
10. [AI Core API](#10-ai-core-api)
11. [Map & Geo API](#11-map--geo-api)
12. [Data Schemas & Validation](#12-data-schemas--validation)
13. [General API Rules](#13-general-api-rules)

**Total Endpoints:** 71+  
**Total Sections:** 13  
**Documentation Size:** ~80 KB

---

# API Detailed Specification (MVP v1)

**Project:** Self-Storage Aggregator  
**Version:** 1.0  
**Date:** November 30, 2025  
**Status:** Production Ready  
**Document Type:** Technical Specification

---

## 1. Introduction

### 1.1. Document Purpose

This document provides a **complete, detailed API specification** for the Self-Storage Aggregator MVP v1. It serves as the authoritative reference for:

- **Backend developers** implementing API endpoints
- **Frontend developers** integrating with the API
- **QA engineers** writing API tests
- **Technical integrators** connecting third-party systems
- **DevOps engineers** configuring API infrastructure

This specification expands upon the **API Design Blueprint (MVP v1)** by providing:

- ✅ Complete CRUD operations for all entities
- ✅ Detailed request/response JSON structures
- ✅ Comprehensive validation rules
- ✅ Real-world usage examples
- ✅ Error handling scenarios
- ✅ Authentication & authorization details
- ✅ Data schemas with types and constraints

---

### 1.2. Scope & Audience

**Scope:**

This document covers **all API endpoints** for the MVP v1 release, including:

| API Group | Description | Endpoints Count |
|-----------|-------------|-----------------|
| **Auth API** | Registration, login, token management | 8 |
| **Users API** | User profiles, bookings, favorites | 10 |
| **Operators API** | Operator registration, profile, documents | 7 |
| **Warehouses API** | Public catalog + operator management | 12 |
| **Boxes API** | Box listings + operator CRUD | 10 |
| **Bookings API** | Booking lifecycle management | 9 |
| **Reviews API** | Reviews and ratings | 6 |
| **AI Core API** | AI-powered recommendations and chat | 5 |
| **Map/Geo API** | Map clusters, geo search | 4 |
| **Total** | | **71 endpoints** |

**Audience:**

- **Primary:** Backend developers (Node.js/TypeScript)
- **Secondary:** Frontend developers (React), QA engineers
- **Tertiary:** Product managers, technical writers

---

### 1.3. Relationship to API Design Blueprint

This document is a **detailed implementation specification** based on:

| Source Document | Relationship |
|-----------------|--------------|
| **API Design Blueprint (MVP v1)** | High-level design, endpoint structure, business logic |
| **Technical Architecture Document** | System architecture, technology stack, infrastructure |
| **Functional Specification (MVP v1)** | Features, user stories, business requirements |

**How to use these documents together:**

1. **API Design Blueprint** → Understand overall API structure and business flows
2. **This Document** → Implement specific endpoints with exact JSON structures
3. **Technical Architecture** → Configure infrastructure, databases, services

---

### 1.4. General API Principles

#### Base URLs

```
Production:   https://api.storagecompare.ae/v1
Staging:      https://api-staging.storagecompare.ae/v1
Development:  http://localhost:3000/v1
```

#### REST Principles

| Principle | Implementation |
|-----------|----------------|
| **Resource-based URLs** | `/api/v1/warehouses`, `/api/v1/bookings` |
| **HTTP Methods** | GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update) |
| **Stateless Requests** | Each request includes all necessary context (JWT tokens) |
| **JSON Format** | All requests and responses use `application/json` |
| **Idempotency** | PUT, DELETE, GET are idempotent; POST is not |

#### URL Naming Conventions

**Correct patterns:**

```
✅ GET  /api/v1/warehouses              # Collection (plural)
✅ GET  /api/v1/warehouses/{id}         # Single resource
✅ GET  /api/v1/warehouses/{id}/boxes   # Nested resource
✅ POST /api/v1/bookings                # Create new resource
✅ PUT  /api/v1/users/me                # Update current user
```

**Incorrect patterns:**

```
❌ GET  /api/v1/warehouse               # Should be plural
❌ GET  /api/v1/getWarehouses           # No verbs in URLs
❌ POST /api/v1/warehouses/create       # No action verbs
❌ GET  /api/v1/warehouse_list          # Use plural, not _list
```

#### JSON Naming Convention

**All JSON keys use `snake_case`:**

```json
{
  "warehouse_id": 101,
  "created_at": "2025-11-30T12:00:00Z",
  "is_active": true,
  "price_per_month": 5000,
  "climate_control": true,
  "cctv_24_7": true
}
```

**Rules:**

- `snake_case` for all property names
- ISO 8601 format for dates/times: `YYYY-MM-DDTHH:mm:ssZ`
- Boolean fields prefixed: `is_*`, `has_*`, `can_*`
- Monetary values: integers in fils (AED) or minor currency units
- IDs: always integers, never strings (except booking_number, which is string)

#### Versioning Strategy

| Aspect | Implementation |
|--------|----------------|
| **Method** | URL-based versioning (`/api/v1/...`) |
| **Current Version** | v1 |
| **Backward Compatibility** | Maintained for 6 months after new version |
| **Deprecation Notice** | 3 months before removal |
| **Version Header** | Optional: `Accept: application/vnd.selfstorage.v1+json` |

---

### 1.5. Document Conventions

#### Request/Response Examples

All examples use this format:

**Request:**

```http
POST /api/v1/bookings HTTP/1.1
Host: api.storagecompare.ae
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "warehouse_id": 101,
  "box_id": 501
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1001,
    "booking_number": "BK-2025-001001"
  }
}
```

#### Field Requirements Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Required field |
| ❌ | Optional field |
| 🔒 | Read-only field (returned but not accepted in requests) |
| 🔑 | Unique field (must be unique across all records) |

#### HTTP Method Icons

| Icon | Method | Usage |
|------|--------|-------|
| 🔍 | GET | Retrieve resource(s) |
| ➕ | POST | Create new resource |
| ✏️ | PUT | Replace entire resource |
| 🔧 | PATCH | Partial update |
| 🗑️ | DELETE | Remove resource |

#### Data Type Notation

```
string           - Text value
integer          - Whole number
float            - Decimal number
boolean          - true/false
datetime         - ISO 8601 timestamp
array            - List of items
object           - Nested JSON object
enum             - Predefined set of values
```

#### Example Status Indicators

Throughout this document:

- ✅ **Implemented** - Ready for use
- 🚧 **In Progress** - Under development
- 📋 **Planned** - Future enhancement
- ⚠️ **Deprecated** - Will be removed

---

**End of Section 1: Introduction**
-e 
---

# 2. Authentication & Authorization

## 2.1. Authentication Overview

The Self-Storage Aggregator API uses **JWT (JSON Web Tokens)** for stateless authentication.

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API

    Client->>API: POST /auth/login (email, password)
    API-->>Client: 200 OK + access_token + refresh_token

    Note over Client: Use access token for requests

    Client->>API: GET /users/me (Authorization: Bearer <access_token>)
    API-->>Client: 200 OK + user data

    Note over Client: Access token expires (15 min)

    Client->>API: POST /auth/refresh (refresh_token)
    API-->>Client: 200 OK + new tokens
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Access Token** | Short-lived JWT (15 minutes) for API authentication |
| **Refresh Token** | Long-lived token (7 days) for obtaining new access tokens |
| **Bearer Authentication** | Tokens sent in `Authorization: Bearer <token>` header |
| **Stateless** | No server-side session storage (except refresh token validation) |
| **Role-Based** | Each token contains user role for authorization |

---

## 2.2. JWT Token Structure

### Access Token Payload

```json
{
  "sub": 123,
  "email": "user@example.com",
  "role": "user",
  "iat": 1701349200,
  "exp": 1701350100,
  "jti": "at_xyz789abc123"
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `sub` | integer | Subject (User ID) |
| `email` | string | User email address |
| `role` | string | User role: `guest`, `user`, `operator`, `admin` |
| `iat` | integer | Issued At (Unix timestamp) |
| `exp` | integer | Expiration Time (Unix timestamp) |
| `jti` | string | JWT ID (unique token identifier) |

### Refresh Token Payload

```json
{
  "sub": 123,
  "type": "refresh",
  "iat": 1701349200,
  "exp": 1701953200,
  "jti": "rt_abc123xyz789"
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `sub` | integer | User ID |
| `type` | string | Always `"refresh"` |
| `iat` | integer | Issued At timestamp |
| `exp` | integer | Expiration (7 days from issue) |
| `jti` | string | Unique refresh token ID |

### Token Expiry

| Token Type | Lifetime | Renewal |
|------------|----------|---------|
| **Access Token** | 15 minutes | Via refresh token endpoint |
| **Refresh Token** | 7 days | Re-login required |

---

## 2.3. Token Lifecycle & Refresh Flow

### Initial Authentication

Users authenticate by submitting credentials to the login endpoint. Upon successful authentication, the server returns both an access token and a refresh token. Clients must use the access token in the `Authorization` header for subsequent API requests.

### Token Refresh

**When access token expires:**

```http
POST /api/v1/auth/refresh HTTP/1.1
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Token Invalidation (Logout)

Clients must call the logout endpoint to invalidate their session. After logout, all tokens become invalid and cannot be used for authentication. Implementation details of token revocation are handled server-side.

---

## 2.4. Role-Based Access Control (RBAC)

### User Roles

| Role | Level | Description | Typical Use Case |
|------|-------|-------------|------------------|
| **guest** | 0 | Unauthenticated user | Browse warehouses, view prices |
| **user** | 1 | Registered user | Create bookings, write reviews |
| **operator** | 2 | Warehouse owner/manager | Manage warehouses, handle bookings |
| **admin** | 3 | System administrator | Full system access, moderation |

### Permission Matrix

| Action | guest | user | operator | admin |
|--------|-------|------|----------|-------|
| View warehouses | ✅ | ✅ | ✅ | ✅ |
| View boxes | ✅ | ✅ | ✅ | ✅ |
| Search warehouses | ✅ | ✅ | ✅ | ✅ |
| Create booking | ❌ | ✅ | ✅ | ✅ |
| View own bookings | ❌ | ✅ | ✅ | ✅ |
| Write review | ❌ | ✅ | ✅ | ✅ |
| Create warehouse | ❌ | ❌ | ✅ | ✅ |
| Manage own warehouses | ❌ | ❌ | ✅ | ✅ |
| Manage own boxes | ❌ | ❌ | ✅ | ✅ |
| Confirm bookings | ❌ | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ❌ | ✅ |
| Moderate content | ❌ | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ❌ | ✅ |

### Role Hierarchy

```
admin (level 3)
  ↓ inherits all permissions from
operator (level 2)
  ↓ inherits all permissions from
user (level 1)
  ↓ inherits all permissions from
guest (level 0)
```

**Rule:** Higher roles inherit all permissions from lower roles.

---

## 2.5. Authorization Headers

### Required Header Format

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDEzNDkyMDAsImV4cCI6MTcwMTM1MDEwMH0.signature
```

### Standard Request Headers

| Header | Required | Description | Example |
|--------|----------|-------------|---------|
| `Authorization` | Conditional | JWT bearer token (required for authenticated endpoints) | `Bearer <token>` |
| `Content-Type` | For POST/PUT | Request body format | `application/json` |
| `Accept` | Optional | Response format | `application/json` |
| `X-Request-ID` | Optional | Client-generated request ID for tracing | `req_abc123` |
| `User-Agent` | Optional | Client application identifier | `SelfstorageMobileApp/1.0` |

### Standard Response Headers

| Header | Always Present | Description |
|--------|----------------|-------------|
| `Content-Type` | ✅ | Always `application/json; charset=utf-8` |
| `X-Request-ID` | ✅ | Request identifier (echo or generated) |
| `X-RateLimit-Limit` | ✅ | Rate limit ceiling |
| `X-RateLimit-Remaining` | ✅ | Requests remaining in window |
| `X-RateLimit-Reset` | ✅ | Unix timestamp when limit resets |

---

## 2.6. Authentication Mechanism

The API uses JWT-based token authentication with access and refresh tokens. All token lifecycle operations (generation, validation, refresh, revocation, storage, and expiration handling) are implementation details defined in the Security & Compliance Plan and backend specifications. Clients must include valid tokens in request headers as specified in section 2.5. Token security guarantees, rotation strategies, and session management policies are managed server-side and are outside the scope of this API contract.

---

**End of Section 2: Authentication & Authorization**
-e 
---

# 3. Auth API Endpoints

Authentication endpoints handle user registration, login, token management, and password recovery.

---

## 3.1. Registration

### 3.1.1. Register New User

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Create a new user account.

**Authorization:** None required (public endpoint)

**Rate Limit:** 3 registrations per hour per IP

---

#### Request

**Method:** `POST`

**URL:** `/api/v1/auth/register`

**Headers:**

```http
Content-Type: application/json
X-Request-ID: req_reg_20251130_001 (optional)
```

**Request Body:**

```json
{
  "email": "ahmed.alrashid@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "name": "Ahmed Al-Rashid",
  "phone": "+971501234567",
  "role": "user",
  "agree_to_terms": true,
  "agree_to_privacy": true
}
```

**Request Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | ✅ | Email format, max 255 chars, unique | User email address |
| `password` | string | ✅ | Min 8 chars, max 128 chars, complexity rules | User password |
| `password_confirmation` | string | ✅ | Must match `password` | Password confirmation |
| `name` | string | ✅ | Min 2 chars, max 100 chars | Full name |
| `phone` | string | ✅ | E.164 format, unique | Phone number with country code |
| `role` | string | ❌ | Enum: `user`, `operator` | Account type (default: `user`) |
| `agree_to_terms` | boolean | ✅ | Must be `true` | Terms of service acceptance |
| `agree_to_privacy` | boolean | ✅ | Must be `true` | Privacy policy acceptance |

**Password Complexity Rules:**

- Minimum 8 characters
- Maximum 128 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 digit (0-9)
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

**Phone Format:**

```
Valid:   +971501234567, +97145551234
Invalid: 971501234567, 971501234567, +971 50 123 4567
```

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ahmed.alrashid@example.com",
      "name": "Ahmed Al-Rashid",
      "phone": "+971501234567",
      "role": "user",
      "is_email_verified": false,
      "is_phone_verified": false,
      "created_at": "2025-11-30T14:30:00Z",
      "updated_at": "2025-11-30T14:30:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywiZW1haWwiOiJpdmFuLnBldHJvdkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAxMzQ5MjAwLCJleHAiOjE3MDEzNTAxMDB9.signature",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMywidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MDEzNDkyMDAsImV4cCI6MTcwMTk1NDAwMH0.signature",
      "token_type": "Bearer",
      "expires_in": 900
    }
  },
  "meta": {
    "timestamp": "2025-11-30T14:30:00Z",
    "request_id": "req_reg_20251130_001"
  }
}
```

---

#### Error Responses

**400 Bad Request - Validation Error**

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": {
      "email": [
        "Invalid email address format"
      ],
      "password": [
        "Password must contain at least 8 characters",
        "Password must contain at least one uppercase letter"
      ],
      "phone": [
        "Phone number must be in E.164 format (+971501234567)"
      ]
    }
  }
}
```

**409 Conflict - Email Already Exists**

```json
{
  "success": false,
  "error": {
    "code": "email_already_exists",
    "message": "User with this email already registered",
    "details": {
      "field": "email",
      "value": "ahmed.alrashid@example.com"
    }
  }
}
```

**409 Conflict - Phone Already Exists**

```json
{
  "success": false,
  "error": {
    "code": "phone_already_exists",
    "message": "User with this phone number already registered",
    "details": {
      "field": "phone",
      "value": "+971501234567"
    }
  }
}
```

---

## 3.2. User Login

### 3.2.1. POST /api/v1/auth/login

**Description:** Authenticate user and obtain access/refresh tokens.

**Authorization:** None required (public endpoint)

**Rate Limit:** 5 attempts per 15 minutes per IP

---

#### Request

**Method:** `POST`

**URL:** `/api/v1/auth/login`

**Request Body:**

```json
{
  "email": "ahmed.alrashid@example.com",
  "password": "SecurePass123!"
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ahmed.alrashid@example.com",
      "name": "Ahmed Al-Rashid",
      "phone": "+971501234567",
      "role": "user",
      "is_email_verified": true,
      "is_phone_verified": true,
      "created_at": "2025-11-30T14:30:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  }
}
```

---

## 3.3. Token Refresh

### 3.3.1. POST /api/v1/auth/refresh

**Description:** Obtain new access token using refresh token.

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

---

## 3.4. Logout

### 3.4.1. POST /api/v1/auth/logout

**Description:** Logout user and invalidate tokens.

**Authorization:** Required (Bearer token)

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "You have successfully logged out"
  }
}
```

---

## 3.5. Password Reset

### 3.5.1. POST /api/v1/auth/password/reset-request

**Description:** Request password reset (sends email with reset link).

**Request Body:**

```json
{
  "email": "ahmed.alrashid@example.com"
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "If a user with this email exists, a password reset link has been sent",
    "email": "ahmed.alrashid@example.com"
  }
}
```

### 3.5.2. POST /api/v1/auth/password/reset-confirm

**Description:** Confirm password reset with token and set new password.

**Request Body:**

```json
{
  "token": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "password": "NewSecurePass456!",
  "password_confirmation": "NewSecurePass456!"
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Password successfully changed. You can now login with your new password."
  }
}
```

---

## 3.6. Email Verification

### 3.6.1. POST /api/v1/auth/email/verify

**Description:** Verify user email with verification token.

**Request Body:**

```json
{
  "token": "verify_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Email successfully verified",
    "user": {
      "id": 123,
      "email": "ahmed.alrashid@example.com",
      "is_email_verified": true
    }
  }
}
```

### 3.6.2. POST /api/v1/auth/email/resend

**Description:** Resend email verification link.

**Authorization:** Required (Bearer token)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Verification email sent to ahmed.alrashid@example.com",
    "email": "ahmed.alrashid@example.com"
  }
}
```

---

**End of Section 3: Auth API Endpoints**
-e 
---

# 4. Users API

User API endpoints allow authenticated users to manage their profiles, view bookings, manage favorites, and configure settings.

**Authorization Required:** All endpoints in this section require authentication with `user` role or higher.

---

## 4.1. User Profile Management

### 4.1.1. GET /api/v1/users/me

**Description:** Get current user profile information.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 100 requests per minute per user

---

#### Request

**Method:** `GET`

**URL:** `/api/v1/users/me`

**Headers:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "ahmed.alrashid@example.com",
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "role": "user",
    "avatar": "https://cdn.storagecompare.ae/avatars/123.jpg",
    "is_email_verified": true,
    "is_phone_verified": true,
    "created_at": "2025-11-30T14:30:00Z",
    "updated_at": "2025-11-30T14:30:00Z",
    "settings": {
      "language": "ru",
      "currency": "AED",
      "notifications": {
        "email": true,
        "sms": false,
        "push": true
      }
    },
    "statistics": {
      "total_bookings": 5,
      "active_bookings": 2,
      "total_reviews": 3,
      "favorites_count": 7
    }
  },
  "meta": {
    "timestamp": "2025-11-30T17:15:00Z",
    "request_id": "req_profile_001"
  }
}
```

---

### 4.1.2. PUT /api/v1/users/me

**Description:** Update current user profile.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 30 requests per hour per user

---

#### Request

**Method:** `PUT`

**URL:** `/api/v1/users/me`

**Headers:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Ahmed Al-Rashid",
  "phone": "+79991234568",
  "avatar": "https://cdn.storagecompare.ae/avatars/new-avatar.jpg"
}
```

**Request Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | ❌ | Min 2 chars, max 100 chars | Full name |
| `phone` | string | ❌ | E.164 format, unique | Phone number |
| `avatar` | string | ❌ | Valid URL or null | Avatar image URL |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "ahmed.alrashid@example.com",
    "name": "Ahmed Al-Rashid",
    "phone": "+79991234568",
    "role": "user",
    "avatar": "https://cdn.storagecompare.ae/avatars/new-avatar.jpg",
    "is_email_verified": true,
    "is_phone_verified": false,
    "updated_at": "2025-11-30T17:30:00Z"
  }
}
```

---

### 4.1.3. DELETE /api/v1/users/me

**Description:** Delete current user account (soft delete).

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 5 requests per day per user

---

#### Request

**Method:** `DELETE`

**URL:** `/api/v1/users/me`

**Headers:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "password": "SecurePass123!",
  "reason": "No longer using the service",
  "confirm": true
}
```

**Request Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `password` | string | ✅ | Current user password | Password confirmation |
| `reason` | string | ❌ | Max 500 chars | Deletion reason (optional) |
| `confirm` | boolean | ✅ | Must be `true` | Deletion confirmation |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Your account has been successfully deleted",
    "deleted_at": "2025-11-30T18:00:00Z"
  }
}
```

---

## 4.2. User Settings

### 4.2.1. GET /api/v1/users/me/settings

**Description:** Get user preferences and settings.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 100 requests per minute per user

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "language": "ru",
    "currency": "AED",
    "timezone": "Asia/Dubai",
    "notifications": {
      "email": {
        "booking_confirmed": true,
        "booking_reminder": true,
        "price_alerts": false,
        "marketing": false
      },
      "sms": {
        "booking_confirmed": false,
        "booking_reminder": true
      },
      "push": {
        "booking_confirmed": true,
        "booking_reminder": true,
        "price_alerts": true
      }
    },
    "privacy": {
      "show_phone_to_operators": true,
      "allow_reviews_on_profile": true
    },
    "ui": {
      "theme": "auto",
      "map_style": "default",
      "default_view": "map"
    }
  }
}
```

---

### 4.2.2. PUT /api/v1/users/me/settings

**Description:** Update user preferences and settings.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 30 requests per hour per user

---

#### Request

**Request Body:**

```json
{
  "language": "en",
  "currency": "USD",
  "notifications": {
    "email": {
      "marketing": true
    },
    "push": {
      "price_alerts": true
    }
  },
  "ui": {
    "theme": "dark"
  }
}
```

---

## 4.3. User Bookings

### 4.3.1. GET /api/v1/users/me/bookings

**Description:** Get list of user's bookings.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 100 requests per minute per user

---

#### Request

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | ❌ | all | Filter by status: `pending`, `confirmed`, `active`, `completed`, `cancelled`, `rejected`, `all` |
| `sort` | string | ❌ | `created_at` | Sort field: `created_at`, `start_date`, `end_date` |
| `order` | string | ❌ | `desc` | Sort order: `asc`, `desc` |
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 12 | Items per page (max: 100) |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "booking_number": "BK-2025-001001",
      "status": "active",
      "warehouse": {
        "id": 101,
        "name": "StorageHub Al Quoz",
        "address": {
          "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
          "city": "Dubai"
        },
        "photo": "https://cdn.storagecompare.ae/warehouses/101/main.jpg"
      },
      "box": {
        "id": 501,
        "size": "M",
        "dimensions": {
          "width": 200,
          "length": 200,
          "height": 250
        },
        "number": "M-205"
      },
      "start_date": "2025-12-01",
      "end_date": "2026-02-28",
      "duration_months": 3,
      "price_per_month": 5000,
      "total_price": 15000,
      "payment_status": "paid",
      "created_at": "2025-11-25T10:00:00Z",
      "updated_at": "2025-11-25T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 5,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

---

### 4.3.2. GET /api/v1/users/me/bookings/{id}

**Description:** Get detailed information about a specific booking.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 100 requests per minute per user

---

#### Request

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | ✅ | Booking ID |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1001,
    "booking_number": "BK-2025-001001",
    "status": "active",
    "warehouse": {
      "id": 101,
      "name": "StorageHub Al Quoz",
      "description": "Modern storage facility with climate control",
      "address": {
        "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
        "city": "Dubai",
        "district": "Al Quoz Industrial Area 3",
        "metro_station": "Al Quoz"
      },
      "coordinates": {
        "lat": 55.714521,
        "lon": 37.816830
      },
      "phone": "+97145551234",
      "email": "vyhino@skladok.ru",
      "photos": [
        "https://cdn.storagecompare.ae/warehouses/101/main.jpg"
      ]
    },
    "box": {
      "id": 501,
      "size": "M",
      "dimensions": {
        "width": 200,
        "length": 200,
        "height": 250
      },
      "area": 4.0,
      "volume": 10.0,
      "number": "M-205",
      "floor": 2,
      "description": "Medium-sized box with climate control"
    },
    "start_date": "2025-12-01",
    "end_date": "2026-02-28",
    "duration_months": 3,
    "price_per_month": 5000,
    "total_price": 15000,
    "payment_status": "paid",
    "payment_method": "card",
    "payment_date": "2025-11-25T14:00:00Z",
    "notes": "Storage of winter items",
    "created_at": "2025-11-25T10:00:00Z",
    "updated_at": "2025-11-25T14:00:00Z",
    "confirmed_at": "2025-11-25T11:30:00Z",
    "status_history": [
      {
        "status": "pending",
        "timestamp": "2025-11-25T10:00:00Z",
        "comment": "Request created"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-11-25T11:30:00Z",
        "comment": "Confirmed by operator"
      },
      {
        "status": "active",
        "timestamp": "2025-12-01T09:00:00Z",
        "comment": "Booking activated"
      }
    ]
  }
}
```

---

## 4.4. User Favorites

### 4.4.1. GET /api/v1/users/me/favorites

**Description:** Get list of user's favorite warehouses.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 100 requests per minute per user

---

#### Request

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 12 | Items per page (max: 100) |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "warehouse_id": 101,
      "warehouse": {
        "id": 101,
        "name": "StorageHub Al Quoz",
        "description": "Modern storage facility with climate control",
        "address": {
          "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
          "city": "Dubai",
          "district": "Al Quoz Industrial Area 3"
        },
        "coordinates": {
          "lat": 55.714521,
          "lon": 37.816830
        },
        "rating": 4.8,
        "review_count": 127,
        "price_from": 3000,
        "photo": "https://cdn.storagecompare.ae/warehouses/101/main.jpg",
        "attributes": ["climate_control", "cctv_24_7", "access_24_7"]
      },
      "added_at": "2025-11-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 7,
    "total_pages": 1
  }
}
```

---

### 4.4.2. POST /api/v1/users/me/favorites

**Description:** Add warehouse to favorites.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 60 requests per minute per user

---

#### Request

**Request Body:**

```json
{
  "warehouse_id": 103
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `warehouse_id` | integer | ✅ | Warehouse ID to add to favorites |

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "warehouse_id": 103,
    "added_at": "2025-11-30T19:20:00Z"
  }
}
```

---

#### Error Responses

**404 Not Found - Warehouse Not Found**

```json
{
  "success": false,
  "error": {
    "code": "warehouse_not_found",
    "message": "Warehouse not found",
    "details": {
      "warehouse_id": 9999
    }
  }
}
```

**409 Conflict - Already in Favorites**

```json
{
  "success": false,
  "error": {
    "code": "already_in_favorites",
    "message": "Warehouse already added to favorites",
    "details": {
      "warehouse_id": 103
    }
  }
}
```

---

### 4.4.3. DELETE /api/v1/users/me/favorites/{warehouse_id}

**Description:** Remove warehouse from favorites.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 60 requests per minute per user

---

#### Request

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `warehouse_id` | integer | ✅ | Warehouse ID to remove from favorites |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Warehouse removed from favorites",
    "warehouse_id": 103
  }
}
```

---

**End of Section 4: Users API**
-e 
---

# 5. Operators API

Operator API endpoints allow warehouse operators to register, manage their profiles, upload documents, and view statistics.

**Authorization Required:** All endpoints in this section require authentication with `operator` role or higher.

---

## 5.1. Operator Registration & Onboarding

### 5.1.1. POST /api/v1/operators/register

**Description:** Register as a warehouse operator (initial registration).

**Authorization:** None required (public endpoint)

**Rate Limit:** 3 registrations per day per IP

---

#### Request

**Method:** `POST`

**URL:** `/api/v1/operators/register`

**Request Body:**

```json
{
  "email": "operator@skladok.ru",
  "password": "SecureOperator123!",
  "password_confirmation": "SecureOperator123!",
  "name": "Raj Patel",
  "phone": "+97145551234",
  "company_name": "StorageOK LLC",
  "inn": "7704123456",
  "agree_to_terms": true,
  "agree_to_privacy": true
}
```

**Request Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | ✅ | Email format, unique | Operator email |
| `password` | string | ✅ | Min 8 chars, complexity rules | Password |
| `password_confirmation` | string | ✅ | Must match password | Password confirmation |
| `name` | string | ✅ | Min 2 chars, max 100 chars | Full name of contact person |
| `phone` | string | ✅ | E.164 format, unique | Contact phone number |
| `company_name` | string | ✅ | Min 2 chars, max 200 chars | Legal company name |
| `inn` | string | ✅ | 10 or 12 digits, valid checksum | Tax identification number (TRN) |
| `agree_to_terms` | boolean | ✅ | Must be `true` | Terms acceptance |
| `agree_to_privacy` | boolean | ✅ | Must be `true` | Privacy policy acceptance |

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "email": "operator@skladok.ru",
      "name": "Raj Patel",
      "phone": "+97145551234",
      "role": "operator",
      "company_name": "StorageOK LLC",
      "inn": "7704123456",
      "onboarding_status": "pending",
      "account_status": "pending_verification",
      "is_email_verified": false,
      "is_phone_verified": false,
      "created_at": "2025-11-30T20:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  },
  "meta": {
    "timestamp": "2025-11-30T20:00:00Z",
    "request_id": "req_op_reg_001",
    "next_steps": [
      "Confirm email",
      "Complete operator profile",
      "Upload company documents",
      "Wait for verification"
    ]
  }
}
```

---

### 5.1.2. POST /api/v1/operators/onboarding

**Description:** Complete operator onboarding (submit additional information and documents).

**Authorization:** Required (operator role, onboarding_status != "completed")

**Rate Limit:** 10 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "company_info": {
    "legal_form": "ooo",
    "registration_date": "2020-05-15",
    "kpp": "770401001",
    "ogrn": "1234567890123",
    "legal_address": "Dubai, Building 12, Office 5, Business Bay",
    "actual_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
    "director_name": "Mohammed Al-Maktoum",
    "website": "https://skladok.ru"
  },
  "bank_details": {
    "bank_name": "Emirates NBD",
    "bik": "044525225",
    "account_number": "40702810400000012345",
    "correspondent_account": "30101810400000000225"
  },
  "contact_person": {
    "name": "Raj Patel",
    "position": "Development Director",
    "email": "s.ivanov@skladok.ru",
    "phone": "+97145551234"
  },
  "documents": [
    {
      "type": "inn_certificate",
      "url": "https://cdn.storagecompare.ae/uploads/docs/inn_7704123456.pdf"
    },
    {
      "type": "ogrn_certificate",
      "url": "https://cdn.storagecompare.ae/uploads/docs/ogrn_1234567890123.pdf"
    },
    {
      "type": "charter",
      "url": "https://cdn.storagecompare.ae/uploads/docs/charter_skladok.pdf"
    }
  ]
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator_id": 456,
    "onboarding_status": "completed",
    "account_status": "pending_verification",
    "verification_eta": "2-3 business days",
    "submitted_at": "2025-11-30T20:30:00Z"
  },
  "meta": {
    "timestamp": "2025-11-30T20:30:00Z",
    "request_id": "req_onboarding_001",
    "message": "Thank you! Your application has been submitted for review. We will contact you within 2-3 business days."
  }
}
```

---

## 5.2. Operator Profile

### 5.2.1. GET /api/v1/operators/me

**Description:** Get current operator profile.

**Authorization:** Required (operator, admin)

**Rate Limit:** 100 requests per minute per operator

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "email": "operator@skladok.ru",
    "name": "Raj Patel",
    "phone": "+97145551234",
    "role": "operator",
    "avatar": "https://cdn.storagecompare.ae/avatars/456.jpg",
    "is_email_verified": true,
    "is_phone_verified": true,
    "onboarding_status": "completed",
    "account_status": "active",
    "company_info": {
      "company_name": "StorageOK LLC",
      "inn": "7704123456",
      "kpp": "770401001",
      "ogrn": "1234567890123",
      "legal_form": "ooo",
      "registration_date": "2020-05-15",
      "legal_address": "Dubai, Building 12, Office 5, Business Bay",
      "actual_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
      "director_name": "Mohammed Al-Maktoum",
      "website": "https://skladok.ru"
    },
    "bank_details": {
      "bank_name": "Emirates NBD",
      "bik": "044525225",
      "account_number": "40702810400000012345",
      "correspondent_account": "30101810400000000225"
    },
    "statistics": {
      "total_warehouses": 3,
      "active_warehouses": 3,
      "total_boxes": 150,
      "occupied_boxes": 87,
      "total_bookings": 245,
      "active_bookings": 87,
      "total_revenue": 4350000,
      "average_rating": 4.7
    },
    "created_at": "2025-11-30T20:00:00Z",
    "updated_at": "2025-11-30T20:30:00Z"
  }
}
```

---

### 5.2.2. PUT /api/v1/operators/me

**Description:** Update operator profile.

**Authorization:** Required (operator, admin)

**Rate Limit:** 30 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "name": "Raj Patel",
  "phone": "+74951234568",
  "avatar": "https://cdn.storagecompare.ae/avatars/new-456.jpg",
  "company_info": {
    "website": "https://new-skladok.ru",
    "actual_address": "Dubai, Sheikh Zayed Road, 25"
  },
  "contact_person": {
    "email": "new.email@skladok.ru",
    "phone": "+74951234569"
  }
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "name": "Raj Patel",
    "phone": "+74951234568",
    "is_phone_verified": false,
    "company_info": {
      "website": "https://new-skladok.ru",
      "actual_address": "Dubai, Sheikh Zayed Road, 25"
    },
    "updated_at": "2025-11-30T21:15:00Z"
  },
  "meta": {
    "timestamp": "2025-11-30T21:15:00Z",
    "warnings": [
      "Phone number changed. Re-verification required."
    ]
  }
}
```

---

## 5.3. Operator Documents

### 5.3.1. POST /api/v1/operators/me/documents

**Description:** Upload additional document.

**Authorization:** Required (operator, admin)

**Rate Limit:** 20 uploads per hour per operator

---

#### Request

**Request Body:**

```json
{
  "type": "insurance_policy",
  "title": "Insurance Policy 2025",
  "url": "https://cdn.storagecompare.ae/uploads/docs/insurance_2025.pdf",
  "expires_at": "2025-12-31"
}
```

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "id": 789,
    "type": "insurance_policy",
    "title": "Insurance Policy 2025",
    "url": "https://cdn.storagecompare.ae/uploads/docs/insurance_2025.pdf",
    "status": "pending_review",
    "expires_at": "2025-12-31",
    "uploaded_at": "2025-11-30T21:30:00Z"
  }
}
```

---

### 5.3.2. GET /api/v1/operators/me/documents

**Description:** Get list of uploaded documents.

**Authorization:** Required (operator, admin)

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "type": "insurance_policy",
      "title": "Insurance Policy 2025",
      "url": "https://cdn.storagecompare.ae/uploads/docs/insurance_2025.pdf",
      "status": "approved",
      "expires_at": "2025-12-31",
      "uploaded_at": "2025-11-30T21:30:00Z",
      "reviewed_at": "2025-12-01T10:00:00Z",
      "reviewed_by": "admin_user_12"
    }
  ]
}
```

---

### 5.3.3. DELETE /api/v1/operators/me/documents/{id}

**Description:** Delete uploaded document.

**Authorization:** Required (operator, admin)

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Document deleted",
    "document_id": 789
  }
}
```

---

## 5.4. Operator Statistics

### 5.4.1. GET /api/v1/operators/me/statistics

**Description:** Get operator performance statistics.

**Authorization:** Required (operator, admin)

**Rate Limit:** 100 requests per minute per operator

---

#### Request

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `month` | Time period: `week`, `month`, `quarter`, `year`, `all` |
| `start_date` | string | - | Start date (ISO format) for custom range |
| `end_date` | string | - | End date (ISO format) for custom range |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "period": {
      "type": "month",
      "start": "2025-11-01",
      "end": "2025-11-30"
    },
    "warehouses": {
      "total": 3,
      "active": 3,
      "inactive": 0
    },
    "boxes": {
      "total": 150,
      "occupied": 87,
      "available": 63,
      "occupancy_rate": 58.0
    },
    "bookings": {
      "total": 245,
      "pending": 5,
      "confirmed": 12,
      "active": 87,
      "completed": 135,
      "cancelled": 6,
      "rejection_rate": 2.4
    },
    "revenue": {
      "total": 4350000,
      "currency": "AED",
      "by_month": [
        {
          "month": "2025-11",
          "amount": 435000
        }
      ]
    },
    "reviews": {
      "total": 127,
      "average_rating": 4.7,
      "rating_distribution": {
        "5": 89,
        "4": 28,
        "3": 7,
        "2": 2,
        "1": 1
      }
    },
    "response_time": {
      "average_minutes": 45,
      "median_minutes": 30
    }
  }
}
```

---

**End of Section 5: Operators API**
-e 
---

# 6. Warehouses API

Warehouses API provides endpoints for public warehouse browsing (catalog, search, filters) and operator warehouse management (CRUD operations).

---

## 6.1. Public Warehouse Endpoints

### 6.1.1. GET /api/v1/warehouses

**Description:** Search and filter warehouses (public catalog).

**Authorization:** None required (public endpoint)

**Rate Limit:** 100 requests per minute per IP (anonymous), 300 per minute (authenticated)

---

#### Request

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `location` | string | ❌ | - | City, district, or address |
| `lat` | float | ❌ | - | Latitude for geo search |
| `lon` | float | ❌ | - | Longitude for geo search |
| `radius` | integer | ❌ | 5000 | Search radius in meters (max: 50000) |
| `price_min` | integer | ❌ | 0 | Minimum price per month (AED) |
| `price_max` | integer | ❌ | - | Maximum price per month (AED) |
| `size` | string | ❌ | - | Box sizes (comma-separated): `S,M,L,XL` |
| `climate_control` | boolean | ❌ | - | Has climate control |
| `cctv` | boolean | ❌ | - | Has CCTV |
| `access_24_7` | boolean | ❌ | - | 24/7 access |
| `sort` | string | ❌ | `rating` | Sort: `price`, `rating`, `distance` |
| `order` | string | ❌ | `desc` | Order: `asc`, `desc` |
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 12 | Items per page (max: 100) |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "StorageHub Al Quoz",
      "description": "Modern storage facility with climate control",
      "address": {
        "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
        "city": "Dubai",
        "district": "Al Quoz Industrial Area 3",
        "metro_station": "Al Quoz"
      },
      "coordinates": {
        "lat": 55.714521,
        "lon": 37.816830
      },
      "rating": 4.8,
      "review_count": 127,
      "price_from": 3000,
      "photos": [
        {
          "url": "https://cdn.storagecompare.ae/warehouses/101/main.jpg",
          "is_main": true
        }
      ],
      "attributes": ["climate_control", "cctv_24_7", "access_24_7"],
      "available_sizes": ["S", "M", "L", "XL"],
      "total_boxes": 50,
      "available_boxes": 23
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 47,
    "total_pages": 4
  }
}
```

---

### 6.1.2. GET /api/v1/warehouses/{id}

**Description:** Get detailed information about a specific warehouse.

**Authorization:** None required (public endpoint)

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 101,
    "name": "StorageHub Al Quoz",
    "description": "Modern storage facility",
    "long_description": "Full description...",
    "address": {
      "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
      "city": "Dubai"
    },
    "coordinates": {
      "lat": 55.714521,
      "lon": 37.816830
    },
    "contacts": {
      "phone": "+97145551234",
      "email": "vyhino@skladok.ru"
    },
    "rating": 4.8,
    "review_count": 127,
    "price_from": 3000,
    "photos": [],
    "attributes": [],
    "boxes_summary": {
      "total": 50,
      "available": 23,
      "by_size": {
        "S": { "total": 15, "available": 8, "price_from": 3000 },
        "M": { "total": 20, "available": 10, "price_from": 5000 }
      }
    }
  }
}
```

---

## 6.2. Operator Warehouse Management

### 6.2.1. GET /api/v1/operator/warehouses

**Description:** Get list of operator's warehouses.

**Authorization:** Required (operator, admin)

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "StorageHub Al Quoz",
      "status": "active",
      "total_boxes": 50,
      "available_boxes": 23,
      "occupancy_rate": 54.0,
      "monthly_revenue": 135000
    }
  ],
  "summary": {
    "total_warehouses": 3,
    "active_warehouses": 2,
    "total_monthly_revenue": 260000
  }
}
```

---

### 6.2.2. POST /api/v1/operator/warehouses

**Description:** Create new warehouse.

**Authorization:** Required (operator, admin)

**Rate Limit:** 10 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "name": "StorageHub Dubai Hills",
  "description": "Modern storage facility",
  "address": {
    "full_address": "Dubai, Al Wasl Road, 15",
    "city": "Dubai"
  },
  "coordinates": {
    "lat": 55.745123,
    "lon": 37.864532
  },
  "contacts": {
    "phone": "+74951234568",
    "email": "novokosino@skladok.ru"
  },
  "attributes": ["climate_control", "cctv_24_7"],
  "status": "draft"
}
```

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "id": 104,
    "name": "StorageHub Dubai Hills",
    "status": "draft",
    "created_at": "2025-11-30T23:30:00Z"
  },
  "meta": {
    "message": "Warehouse created in draft mode. Add photos and boxes for activation."
  }
}
```

---

### 6.2.3. GET /api/v1/operator/warehouses/{id}

**Description:** Get detailed warehouse information (operator view).

**Authorization:** Required (operator, admin)

---

### 6.2.4. PUT /api/v1/operator/warehouses/{id}

**Description:** Update warehouse information.

**Authorization:** Required (operator, admin)

---

### 6.2.5. DELETE /api/v1/operator/warehouses/{id}

**Description:** Delete warehouse (soft delete).

**Authorization:** Required (operator, admin)

---

### 6.2.6. PATCH /api/v1/operator/warehouses/{id}/status

**Description:** Change warehouse status (draft → active, active → inactive).

**Authorization:** Required (operator, admin)

---

## 6.3. Warehouse Photos

### 6.3.1. POST /api/v1/operator/warehouses/{id}/photos

**Description:** Upload warehouse photo.

**Authorization:** Required (operator, admin)

---

### 6.3.2. DELETE /api/v1/operator/warehouses/{id}/photos/{photo_id}

**Description:** Delete warehouse photo.

---

### 6.3.3. PUT /api/v1/operator/warehouses/{id}/photos/order

**Description:** Reorder warehouse photos.

---

**End of Section 6: Warehouses API**
-e 
---

# 7. Boxes API

Boxes API provides endpoints for public box browsing and operator box management (CRUD operations).

---

## 7.1. Public Box Endpoints

### 7.1.1. GET /api/v1/warehouses/{warehouse_id}/boxes

**Description:** Get list of boxes for a specific warehouse.

**Authorization:** None required

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | string | - | Filter by size: `S`, `M`, `L`, `XL` |
| `price_min` | integer | 0 | Minimum price |
| `price_max` | integer | - | Maximum price |
| `available_only` | boolean | true | Show only available |
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page |

**Response:**

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
        "height": 250
      },
      "area": 4.0,
      "price_per_month": 5000,
      "number": "M-205",
      "total_quantity": 5,
      "available_quantity": 3
    }
  ]
}
```

---

### 7.1.2. GET /api/v1/boxes/{id}

**Description:** Get detailed box information.

---

## 7.2. Operator Box Management

### 7.2.1. GET /api/v1/operator/boxes

**Description:** Get list of operator's boxes.

**Authorization:** Required (operator, admin)

---

### 7.2.2. POST /api/v1/operator/boxes

**Description:** Create new box.

**Request:**

```json
{
  "warehouse_id": 101,
  "size": "M",
  "dimensions": {
    "width": 200,
    "length": 200,
    "height": 250
  },
  "price_per_month": 5000,
  "number": "M-205",
  "floor": 2,
  "total_quantity": 5
}
```

---

### 7.2.3. GET /api/v1/operator/boxes/{id}

**Description:** Get box details (operator view).

---

### 7.2.4. PUT /api/v1/operator/boxes/{id}

**Description:** Update box information.

---

### 7.2.5. DELETE /api/v1/operator/boxes/{id}

**Description:** Delete box (soft delete).

---

### 7.2.6. PATCH /api/v1/operator/boxes/{id}/availability

**Description:** Update box quantity.

---

**End of Section 7: Boxes API**
-e 
---

# 8. Bookings API

Bookings API handles the complete booking lifecycle.

---

## 8.1. User Booking Actions

### 8.1.1. POST /api/v1/bookings

**Description:** Create a new booking request.

**Authorization:** Required (user, operator, admin)

**Request:**

```json
{
  "warehouse_id": 101,
  "box_id": 501,
  "start_date": "2025-12-15",
  "duration_months": 3,
  "contact": {
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "email": "ahmed.alrashid@example.com"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1050,
    "booking_number": "BK-2025-001050",
    "status": "pending",
    "start_date": "2025-12-15",
    "end_date": "2026-03-14",
    "total_price": 15000
  }
}
```

---

### 8.1.2. GET /api/v1/bookings/{id}

**Description:** Get booking details.

---

### 8.1.3. PUT /api/v1/bookings/{id}/cancel

**Description:** Cancel booking.

---

## 8.2. Operator Booking Management

### 8.2.1. GET /api/v1/operator/bookings

**Description:** Get list of bookings for operator's warehouses.

**Authorization:** Required (operator, admin)

---

### 8.2.2. GET /api/v1/operator/bookings/{id}

**Description:** Get booking details (operator view).

---

### 8.2.3. PUT /api/v1/operator/bookings/{id}/confirm

**Description:** Confirm booking request.

---

### 8.2.4. PUT /api/v1/operator/bookings/{id}/reject

**Description:** Reject booking request.

---

### 8.2.5. PUT /api/v1/operator/bookings/{id}/complete

**Description:** Mark booking as completed.

---

### 8.2.6. PATCH /api/v1/operator/bookings/{id}/status

**Description:** Change booking status.

---

**End of Section 8: Bookings API**
-e 
---

# 9. Reviews API

Reviews API allows users to leave reviews and ratings for warehouses they have used, and operators to respond to reviews.

---

## 9.1. Public Reviews

### 9.1.1. GET /api/v1/warehouses/{id}/reviews

**Description:** Get list of reviews for a specific warehouse (public view).

**Authorization:** None required (public endpoint)

**Rate Limit:** 100 requests per minute per IP

---

#### Request

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rating` | integer | - | Filter by rating (1-5) |
| `sort` | string | `created_at` | Sort: `created_at`, `rating`, `helpful` |
| `order` | string | `desc` | Order: `asc`, `desc` |
| `page` | integer | 1 | Page number |
| `per_page` | integer | 10 | Items per page (max: 50) |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 2001,
      "warehouse_id": 101,
      "user": {
        "id": 123,
        "name": "Ahmed A.",
        "verified_user": true
      },
      "booking": {
        "box_size": "M",
        "rental_duration_months": 3
      },
      "rating": 5,
      "title": "Excellent warehouse, loved everything!",
      "text": "Stored items for 3 months. Everything in perfect condition...",
      "pros": ["24/7 Access", "Climate Control"],
      "cons": ["Slightly expensive"],
      "helpful_count": 12,
      "is_verified": true,
      "operator_response": {
        "text": "Thanks for the review!",
        "created_at": "2025-11-25T15:00:00Z"
      },
      "created_at": "2025-11-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 127,
    "total_pages": 13
  },
  "summary": {
    "total_reviews": 127,
    "average_rating": 4.8,
    "rating_distribution": {
      "5": 89,
      "4": 28,
      "3": 7,
      "2": 2,
      "1": 1
    }
  }
}
```

---

## 9.2. User Review Actions

### 9.2.1. POST /api/v1/warehouses/{id}/reviews

**Description:** Create a new review for a warehouse (requires completed booking).

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 5 reviews per day per user

---

#### Request

**Request Body:**

```json
{
  "booking_id": 1001,
  "rating": 5,
  "title": "Excellent warehouse!",
  "text": "Stored items for 3 months. Everything in perfect condition...",
  "pros": ["24/7 Access", "Climate Control"],
  "cons": ["Slightly expensive"],
  "photos": [
    "https://cdn.storagecompare.ae/uploads/review-photo-1.jpg"
  ]
}
```

**Request Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `booking_id` | integer | ✅ | Must be completed booking | Booking ID |
| `rating` | integer | ✅ | 1-5 | Overall rating |
| `title` | string | ✅ | Min 5, max 200 chars | Review title |
| `text` | string | ✅ | Min 50, max 5000 chars | Review text |
| `pros` | array | ❌ | Max 10 items | List of pros |
| `cons` | array | ❌ | Max 10 items | List of cons |
| `photos` | array | ❌ | Max 5 photos | Review photos |

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "id": 2003,
    "warehouse_id": 101,
    "rating": 5,
    "title": "Excellent warehouse!",
    "is_verified": true,
    "status": "published",
    "created_at": "2025-12-01T16:00:00Z"
  }
}
```

---

#### Error Responses

**400 Bad Request - Booking Not Completed**

```json
{
  "success": false,
  "error": {
    "code": "booking_not_completed",
    "message": "Reviews can only be left after booking completion"
  }
}
```

**409 Conflict - Review Already Exists**

```json
{
  "success": false,
  "error": {
    "code": "review_already_exists",
    "message": "You have already left a review for this booking"
  }
}
```

---

### 9.2.2. PUT /api/v1/reviews/{id}

**Description:** Update user's own review.

**Authorization:** Required (user, operator, admin)

**Rate Limit:** 10 requests per hour per user

---

#### Request

**Request Body:**

```json
{
  "rating": 5,
  "title": "Updated title",
  "text": "Updated review text...",
  "pros": ["Excellent climate control"],
  "cons": []
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 2001,
    "rating": 5,
    "title": "Updated title",
    "updated_at": "2025-12-01T16:30:00Z",
    "is_edited": true
  }
}
```

---

### 9.2.3. DELETE /api/v1/reviews/{id}

**Description:** Delete user's own review.

**Authorization:** Required (user, operator, admin)

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "message": "Review successfully deleted",
    "review_id": 2001
  }
}
```

---

## 9.3. Operator Review Responses

### 9.3.1. POST /api/v1/operator/reviews/{id}/response

**Description:** Add or update operator's response to a review.

**Authorization:** Required (operator, admin)

**Rate Limit:** 30 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "text": "Thank you for the detailed review! Glad you liked everything."
}
```

---

#### Response

**Success: 201 Created**

```json
{
  "success": true,
  "data": {
    "review_id": 2001,
    "response": {
      "text": "Thank you for the detailed review!",
      "created_at": "2025-12-01T17:30:00Z",
      "responder": {
        "name": "Sergey I.",
        "position": "Manager"
      }
    }
  }
}
```

---

**End of Section 9: Reviews API**
-e 
---

# 10. AI Core API

AI Core API provides AI-powered features including box recommendations, price analytics, description generation, and chat assistant.

**Note:** All AI endpoints have extended timeout (60 seconds) due to AI processing time.

---

## 10.1. AI Box Recommendation

### 10.1.1. POST /api/v1/ai/box-recommendation

**Description:** Get AI-powered box size recommendation based on user's storage needs.

**Authorization:** Optional (better results with authentication)

**Rate Limit:** 
- Anonymous: 5 requests per hour per IP
- Authenticated users: 20 requests per hour

---

#### Request

**Request Body:**

```json
{
  "items": [
    "Two-seater sofa",
    "2m wardrobe",
    "10 boxes with items"
  ],
  "apartment_size": "1-room",
  "storage_purpose": "renovation",
  "duration_months": 3,
  "location": {
    "city": "Dubai",
    "district": "Al Quoz"
  },
  "budget": {
    "max_monthly": 8000
  }
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "recommended_size": "M",
    "confidence": 0.87,
    "reasoning": {
      "summary": "We recommend size M box with 4-5 m² area",
      "estimated_space_needed": {
        "area_m2": 4.2,
        "volume_m3": 10.5
      }
    },
    "recommendations": [
      {
        "warehouse_id": 101,
        "warehouse_name": "StorageHub Al Quoz",
        "box_size": "M",
        "price_per_month": 5000,
        "match_score": 0.95
      }
    ],
    "packing_tips": [
      "Disassemble furniture to save space"
    ]
  }
}
```

---

## 10.2. AI Price Analytics

### 10.2.1. POST /api/v1/ai/price-analytics

**Description:** Get AI-powered pricing recommendations for operators.

**Authorization:** Required (operator, admin)

**Rate Limit:** 50 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "warehouse_id": 101,
  "box_id": 501,
  "current_price": 5000,
  "analysis_type": "competitive"
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "current_price": 5000,
    "market_position": "average",
    "competitive_analysis": {
      "market_average": 4800,
      "market_median": 4700,
      "percentile": 55
    },
    "recommendations": {
      "suggested_price": 4700,
      "min_safe_price": 4200,
      "max_optimal_price": 5200,
      "reasoning": "Reducing to 4700 AED will improve competitiveness"
    },
    "revenue_projections": {
      "current_scenario": {
        "monthly_revenue": 10000,
        "occupancy_rate": 40.0
      },
      "suggested_scenario": {
        "monthly_revenue": 14100,
        "occupancy_rate": 60.0
      }
    }
  }
}
```

---

## 10.3. AI Description Generation

### 10.3.1. POST /api/v1/ai/description

**Description:** Generate AI-powered marketing descriptions.

**Authorization:** Required (operator, admin)

**Rate Limit:** 50 requests per hour per operator

---

#### Request

**Request Body:**

```json
{
  "entity_type": "warehouse",
  "entity_id": 101,
  "description_type": "long",
  "tone": "professional",
  "include_keywords": ["climate control", "security"]
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "descriptions": {
      "short": "Modern warehouse with climate control",
      "long": "StorageHub Al Quoz — modern storage facility...",
      "meta": "StorageHub: climate-controlled box rental"
    },
    "highlights": [
      "Climate Control",
      "24/7 access"
    ]
  }
}
```

---

## 10.4. AI Chat Assistant

### 10.4.1. POST /api/v1/ai/chat

**Description:** Interactive AI chat assistant.

**Authorization:** Optional

**Rate Limit:**
- Anonymous: 5 messages per hour per IP
- Authenticated: 20 messages per hour

---

#### Request

**Request Body:**

```json
{
  "message": "What box size do I need?",
  "conversation_id": null,
  "context": {
    "location": "Dubai"
  }
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "conversation_id": "conv_abc123",
    "message": {
      "role": "assistant",
      "content": "To determine the size, please tell us what you plan to store?"
    },
    "suggestions": [
      "Furniture from a one-bedroom apartment",
      "Seasonal items"
    ]
  }
}
```

---

### 10.4.2. GET /api/v1/ai/chat/history

**Description:** Get chat conversation history.

**Authorization:** Required (user, operator, admin)

---

**End of Section 10: AI Core API**
-e 
---

# 11. Map & Geo API

Map & Geo API provides geospatial functionality including map clustering, geo-based search, and geocoding services.

---

## 11.1. Map Clusters

### 11.1.1. GET /api/v1/map/clusters

**Description:** Get clustered warehouse markers for map display (optimized for performance).

**Authorization:** None required (public endpoint)

**Rate Limit:** 200 requests per minute per IP

---

#### Request

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bounds` | string | ✅ | Map viewport bounds: `lat_min,lon_min,lat_max,lon_max` |
| `zoom` | integer | ✅ | Map zoom level (1-20) |
| `price_min` | integer | ❌ | Minimum price filter |
| `price_max` | integer | ❌ | Maximum price filter |
| `climate_control` | boolean | ❌ | Climate control filter |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "clusters": [
      {
        "id": "cluster_1",
        "type": "cluster",
        "coordinates": {
          "lat": 55.714521,
          "lon": 37.816830
        },
        "warehouse_count": 5,
        "price_range": {
          "min": 3000,
          "max": 8000
        }
      }
    ],
    "markers": [
      {
        "id": 105,
        "type": "marker",
        "warehouse_id": 105,
        "warehouse_name": "MyStorage Mirdif",
        "coordinates": {
          "lat": 55.705123,
          "lon": 37.785432
        },
        "price_from": 4000,
        "rating": 4.6
      }
    ]
  }
}
```

---

## 11.2. Geo Search

### 11.2.1. GET /api/v1/map/search

**Description:** Search warehouses by coordinates and radius (proximity search).

**Authorization:** None required (public endpoint)

**Rate Limit:** 100 requests per minute per IP

---

#### Request

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | float | ✅ | - | Latitude |
| `lon` | float | ✅ | - | Longitude |
| `radius` | integer | ❌ | 5000 | Search radius in meters (max: 50000) |
| `price_min` | integer | ❌ | - | Minimum price |
| `sort` | string | ❌ | `distance` | Sort: `distance`, `price`, `rating` |
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 12 | Items per page |

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "StorageHub Al Quoz",
      "coordinates": {
        "lat": 55.714521,
        "lon": 37.816830
      },
      "distance": 1234,
      "distance_formatted": "1.2 km",
      "travel_time": {
        "walking": 16,
        "driving": 4
      },
      "rating": 4.8,
      "price_from": 3000
    }
  ],
  "search_center": {
    "lat": 55.714521,
    "lon": 37.816830,
    "radius": 5000
  }
}
```

---

## 11.3. Geocoding

### 11.3.1. POST /api/v1/geo/geocode

**Description:** Convert address to coordinates (geocoding).

**Authorization:** Optional

**Rate Limit:** 60 requests per minute per IP

---

#### Request

**Request Body:**

```json
{
  "address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3"
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "input_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
    "coordinates": {
      "lat": 55.714521,
      "lon": 37.816830
    },
    "formatted_address": "UAE, Dubai, Sheikh Zayed Road, 23",
    "components": {
      "country": "UAE",
      "city": "Dubai",
      "street": "Sheikh Zayed Road",
      "house_number": "23"
    },
    "accuracy": "rooftop"
  }
}
```

---

### 11.3.2. POST /api/v1/geo/reverse

**Description:** Convert coordinates to address (reverse geocoding).

**Authorization:** Optional

**Rate Limit:** 60 requests per minute per IP

---

#### Request

**Request Body:**

```json
{
  "lat": 55.714521,
  "lon": 37.816830
}
```

---

#### Response

**Success: 200 OK**

```json
{
  "success": true,
  "data": {
    "coordinates": {
      "lat": 55.714521,
      "lon": 37.816830
    },
    "address": "UAE, Dubai, Sheikh Zayed Road, 23",
    "components": {
      "country": "UAE",
      "city": "Dubai",
      "street": "Sheikh Zayed Road",
      "metro_station": "Al Quoz",
      "metro_distance": 850
    }
  }
}
```

---

**End of Section 11: Map & Geo API**
-e 
---

# 12. Data Schemas & Validation (Part 1)

This section defines all data schemas, validation rules, and constraints used across the API.

---

## 12.1. User Schema

### User Object

```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "Ahmed Al-Rashid",
  "phone": "+971501234567",
  "role": "user",
  "avatar": "https://cdn.storagecompare.ae/avatars/123.jpg",
  "is_email_verified": true,
  "is_phone_verified": true,
  "created_at": "2025-11-30T14:30:00Z",
  "updated_at": "2025-11-30T14:30:00Z"
}
```

### Field Specifications

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | integer | 🔒 Read-only | Unique, auto-increment | User ID |
| `email` | string | ✅ Required | Email format, max 255, 🔑 unique | Email |
| `name` | string | ✅ Required | Min 2, max 100 chars | Full name |
| `phone` | string | ✅ Required | E.164 format, 🔑 unique | Phone |
| `role` | string | ✅ Required | Enum: user, operator, admin | Role |
| `is_email_verified` | boolean | 🔒 Read-only | Default: false | Email verified |
| `is_phone_verified` | boolean | 🔒 Read-only | Default: false | Phone verified |

### Validation Rules

**Email:**
```javascript
{
  "type": "string",
  "format": "email",
  "maxLength": 255,
  "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
}
```

**Phone:**
```javascript
{
  "type": "string",
  "pattern": "^\\+[1-9]\\d{1,14}$"  // E.164 format
}
```

**Password:**
```javascript
{
  "type": "string",
  "minLength": 8,
  "maxLength": 128,
  "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])"
}
```

---

## 12.2. Operator Schema

### Operator Object

```json
{
  "id": 456,
  "email": "operator@skladok.ru",
  "name": "Raj Patel",
  "phone": "+97145551234",
  "role": "operator",
  "onboarding_status": "completed",
  "account_status": "active",
  "company_info": {
    "company_name": "StorageOK LLC",
    "inn": "7704123456",
    "kpp": "770401001",
    "ogrn": "1234567890123"
  }
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `company_info.inn` | string | ✅ | 10 or 12 digits, 🔑 unique | Tax ID |
| `company_info.kpp` | string | ✅ | 9 digits | Registration code |
| `company_info.ogrn` | string | ✅ | 13 or 15 digits | State reg number |
| `onboarding_status` | string | 🔒 | pending, completed | Onboarding |
| `account_status` | string | 🔒 | pending_verification, active | Status |

---

## 12.3. Warehouse Schema

### Warehouse Object

```json
{
  "id": 101,
  "name": "StorageHub Al Quoz",
  "description": "Modern storage facility",
  "address": {
    "full_address": "Dubai, Building 7, Street 14, Al Quoz Industrial 3",
    "city": "Dubai"
  },
  "coordinates": {
    "lat": 55.714521,
    "lon": 37.816830
  },
  "rating": 4.8,
  "price_from": 3000,
  "attributes": ["climate_control", "cctv_24_7"],
  "status": "active"
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | ✅ | Min 3, max 200 | Name |
| `coordinates.lat` | float | ✅ | -90 to 90 | Latitude |
| `coordinates.lon` | float | ✅ | -180 to 180 | Longitude |
| `rating` | float | 🔒 | 0-5, 1 decimal | Avg rating |
| `status` | string | 🔒 | draft, active, inactive | Status |

### Attributes Enum

```javascript
[
  "climate_control",      // Climate Control
  "cctv_24_7",           // CCTV 24/7
  "access_24_7",         // 24/7 Access
  "security_guard",      // Security guard
  "parking",             // Parking
  "elevator"             // Elevator
]
```

---

**End of Section 12 Part 1: Data Schemas**
-e 
---

# 12. Data Schemas & Validation (Part 2)

## 12.4. Box Schema

### Box Object

```json
{
  "id": 501,
  "warehouse_id": 101,
  "size": "M",
  "dimensions": {
    "width": 200,
    "length": 200,
    "height": 250
  },
  "area": 4.0,
  "volume": 10.0,
  "price_per_month": 5000,
  "number": "M-205",
  "total_quantity": 5,
  "available_quantity": 3,
  "status": "active"
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `size` | string | ✅ | Enum: S, M, L, XL | Size category |
| `dimensions.width` | integer | ✅ | Min 50, max 1000 | Width (cm) |
| `dimensions.length` | integer | ✅ | Min 50, max 1000 | Length (cm) |
| `dimensions.height` | integer | ✅ | Min 100, max 500 | Height (cm) |
| `area` | float | 🔒 | Auto-calculated | Area (m²) |
| `volume` | float | 🔒 | Auto-calculated | Volume (m³) |
| `price_per_month` | integer | ✅ | Min 1000, max 100000 | Price (AED) |
| `total_quantity` | integer | ✅ | Min 1, max 1000 | Total boxes |
| `available_quantity` | integer | 🔒 | Auto-calculated | Available |

### Calculations

**Area:**
```javascript
area = (width * length) / 10000  // m²
```

**Volume:**
```javascript
volume = (width * length * height) / 1000000  // m³
```

### Size Categories

```javascript
{
  "S": { "typical_area_range": [1, 2] },
  "M": { "typical_area_range": [3, 5] },
  "L": { "typical_area_range": [6, 10] },
  "XL": { "typical_area_range": [12, 20] }
}
```

---

## 12.5. Booking Schema

### Booking Object

```json
{
  "id": 1050,
  "booking_number": "BK-2025-001050",
  "user_id": 123,
  "warehouse_id": 101,
  "box_id": 501,
  "status": "confirmed",
  "payment_status": "pending",
  "start_date": "2025-12-15",
  "end_date": "2026-03-14",
  "duration_months": 3,
  "price_per_month": 5000,
  "total_price": 15000,
  "created_at": "2025-12-01T03:00:00Z"
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `booking_number` | string | 🔒 | Format: BK-YYYY-NNNNNN, 🔑 unique | Number |
| `status` | string | 🔒 | Enum | Booking status |
| `payment_status` | string | 🔒 | Enum | Payment status |
| `start_date` | string | ✅ | ISO date, >= today | Start date |
| `duration_months` | integer | ✅ | Min 1, max 24 | Duration |
| `total_price` | integer | 🔒 | Auto-calculated | Total price |

### Status Enums

**Booking Status:**
```javascript
{
  "pending": "Awaiting confirmation",
  "confirmed": "Confirmed",
  "active": "Active",
  "completed": "Completed",
  "cancelled": "Cancelled",
  "rejected": "Rejected",
  "expired": "Expired"
}
```

**Payment Status:**
```javascript
{
  "pending": "Awaiting payment",
  "paid": "Paid",
  "failed": "Failed",
  "refunded": "Refunded"
}
```

---

## 12.6. Review Schema

### Review Object

```json
{
  "id": 2001,
  "warehouse_id": 101,
  "user_id": 123,
  "booking_id": 1001,
  "rating": 5,
  "title": "Excellent warehouse!",
  "text": "Stored items for 3 months...",
  "pros": ["24/7 Access"],
  "cons": ["Slightly expensive"],
  "is_verified": true,
  "status": "published",
  "created_at": "2025-11-25T10:00:00Z"
}
```

### Field Specifications

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `rating` | integer | ✅ | Min 1, max 5 | Rating (stars) |
| `title` | string | ✅ | Min 5, max 200 | Title |
| `text` | string | ✅ | Min 50, max 5000 | Review text |
| `pros` | array | ❌ | Max 10 items | Pros list |
| `cons` | array | ❌ | Max 10 items | Cons list |
| `is_verified` | boolean | 🔒 | Auto-set | From verified booking |

---

## 12.7. Common Enumerations

### User Roles

```javascript
{
  "guest": { "level": 0, "description": "Unauthorized" },
  "user": { "level": 1, "description": "User" },
  "operator": { "level": 2, "description": "Operator" },
  "admin": { "level": 3, "description": "Administrator" }
}
```

---

**End of Section 12 Part 2: Data Schemas**
-e 
---

# 13. General API Rules

This section covers general API conventions, error handling, rate limiting, pagination, and other cross-cutting concerns.

---

## 13.1. HTTP Status Codes

### Standard HTTP Status Codes Used

| Code | Status | Usage |
|------|--------|-------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Validation error |
| **401** | Unauthorized | Missing/invalid authentication |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource conflict |
| **422** | Unprocessable Entity | Business logic violation |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Service temporarily unavailable |

---

## 13.2. Error Response Format

### Standard Error Structure

```json
{
  "success": false,
  "error": {
    "code": "error_code_string",
    "message": "Human-readable error message",
    "details": {
      "field_name": ["Specific error"]
    }
  },
  "meta": {
    "timestamp": "2025-12-01T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `validation_error` | 400 | Request validation failed |
| `unauthorized` | 401 | Authentication required |
| `forbidden` | 403 | Insufficient permissions |
| `not_found` | 404 | Resource not found |
| `email_already_exists` | 409 | Email already registered |
| `rate_limit_exceeded` | 429 | Rate limit exceeded |

---

## 13.3. Rate Limiting

### Rate Limit Policy

**Global Limits:**

| User Type | Requests | Window |
|-----------|----------|--------|
| Anonymous (IP) | 100 | 1 minute |
| User | 300 | 1 minute |
| Operator | 500 | 1 minute |
| Admin | 1000 | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1701350100
```

### Rate Limit Exceeded Response

**HTTP 429:**

```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retry_after": 45
    }
  }
}
```

---

## 13.4. Pagination

### Pagination Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number |
| `per_page` | integer | 12 | 100 | Items per page |

### Pagination Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total": 87,
    "total_pages": 5,
    "has_next": true,
    "has_previous": true
  }
}
```

---

## 13.5. Filtering

### Filter Parameter Format

**Operators:**

| Operator | Format | Example |
|----------|--------|---------|
| Equality | `field=value` | `city=Dubai` |
| Min | `field_min=value` | `price_min=3000` |
| Max | `field_max=value` | `price_max=10000` |
| List | `field=val1,val2` | `size=S,M,L` |
| Boolean | `field=true/false` | `climate_control=true` |

---

## 13.6. Sorting

### Sort Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | string | Varies | Sort field |
| `order` | string | `desc` | Order: `asc`, `desc` |

**Examples:**

```http
GET /warehouses?sort=price&order=asc
GET /bookings?sort=created_at&order=desc
```

---

## 13.7. Request/Response Headers

### Standard Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | For POST/PUT | `application/json` |
| `Authorization` | Conditional | `Bearer <token>` |
| `Accept` | Optional | `application/json` |

### Standard Response Headers

| Header | Always Present | Description |
|--------|----------------|-------------|
| `Content-Type` | ✅ | `application/json; charset=utf-8` |
| `X-Request-ID` | ✅ | Request identifier |
| `X-RateLimit-Limit` | ✅ | Rate limit ceiling |
| `X-RateLimit-Remaining` | ✅ | Requests remaining |

---

## 13.8. Caching Strategy

### Cache-Control Directives

**Public endpoints:**
```http
Cache-Control: public, max-age=300
```

**User-specific:**
```http
Cache-Control: private, max-age=60
```

**No caching:**
```http
Cache-Control: no-cache, no-store, must-revalidate
```

### Caching by Endpoint

| Endpoint Type | Cache-Control | Max-Age |
|---------------|---------------|---------|
| Public warehouses | `public` | 300s |
| Warehouse details | `public` | 600s |
| User profile | `private` | 60s |
| Bookings | `private, no-cache` | 0 |
| Auth | `no-store` | 0 |

---

**End of Section 13: General API Rules**
