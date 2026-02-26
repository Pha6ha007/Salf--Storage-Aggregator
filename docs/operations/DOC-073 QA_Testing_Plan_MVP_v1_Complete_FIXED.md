# QA & Testing Plan (MVP v1)
# Self-Storage Aggregator

**Document Version:** 1.1  
**Created:** 06 December 2025  
**Last Updated:** 16 December 2025  
**Status:** Ready for Implementation  
**Format:** Markdown

---

## Table of Contents

### 1. [Testing Strategy](#1-testing-strategy)
- 1.1. Testing Objectives
- 1.2. Testing Levels
- 1.3. Priorities and Scope
- 1.4. Tools

### 2. [Test Coverage Map](#2-test-coverage-map)
- 2.1. Functional Modules (coverage table)
- 2.2. Area Breakdown

### 3. [Test Cases](#3-test-cases)
- 3.1. Test Case Format
- 3.2. Auth Test Cases
- 3.3. Warehouses Test Cases
- 3.4. Bookings Test Cases
- 3.5. User Cabinet Test Cases
- 3.6. Operator Cabinet Test Cases
- 3.7. AI Test Cases
- 3.8. API Test Cases

### 4. [End-to-End Scenarios](#4-end-to-end-scenarios)
- 4.1. Core E2E Scenarios

### 5. [Tools](#5-tools)
- 5.1. E2E Tests (Cypress)
- 5.2. API Tests (Postman/Newman)
- 5.3. Unit/Integration (Jest)
- 5.4. Mocks (MSW)

### 6. [Release Checklist](#6-release-checklist)
- 6.1. Pre-Production Checklist
- 6.2. Smoke Tests
- 6.3. Regression Tests
- 6.4. Security Checks
- 6.5. Performance Tests
- 6.6. Go-Live Checklist

### 7. [Appendices](#7-appendices)
- 7.1. Test Data Requirements
- 7.2. Test Environment Configuration
- 7.3. Bug Priority Matrix
- 7.4. CI/CD Integration
- 7.5. Best Practices
- 7.6. Useful Resources

---

# 1. Testing Strategy

## 1.1. Testing Objectives

The testing strategy for MVP v1 Self-Storage Aggregator ensures product quality and stability before production launch.

### Core Objectives

1. **Minimize Critical Production Bugs**
   - Ensure no blocking errors at MVP launch
   - Prevent user data and booking data loss
   - Guarantee payment process stability

2. **Verify Core User Flows**
   - Warehouse search (by location, filters, map)
   - Catalog and warehouse card viewing
   - Box selection and booking creation
   - User registration and authentication
   - User and operator cabinets
   - AI module interactions

3. **Verify Correct API and AI Module Operation**
   - Validate all API endpoints per specification
   - Correct JSON request/response structure
   - Error and edge case handling
   - AI integration stability (Claude API)
   - Fallback mechanisms for external service unavailability

4. **Ensure Security and Performance**
   - Protection against major vulnerabilities (OWASP Top 10)
   - RBAC (Role-Based Access Control) compliance
   - Acceptable response time (< 2 sec for main operations)
   - Correct operation under base load (up to 100 concurrent users)

### MVP Success Criteria

| Criterion | Target Value | Priority |
|----------|--------------|----------|
| Critical flow e2e test coverage | 100% | Critical |
| API endpoint integration test coverage | 95%+ | High |
| Business logic unit test coverage | 70%+ | Medium |
| Main page response time | < 2 sec | High |
| Smoke test success rate | 100% | Critical |
| Critical production bugs | 0 | Critical |

---

## 1.2. Testing Levels

Testing for MVP is organized at multiple levels following the testing pyramid.

### 1.2.1. Unit Tests

**Purpose:** Test individual functions, methods, components in isolation.

**What is tested:**
- Business logic (price calculation, data validation, filtering)
- Utility functions (date formatting, string processing)
- React components (rendering, props, state)
- Service classes (without external dependencies)
- Pure functions

**Tools:** Jest, React Testing Library  
**Target Coverage:** 70%+ for business logic

---

### 1.2.2. Integration Tests

**Purpose:** Test interaction between modules, services, components.

**What is tested:**
- API endpoints (request → controller → service → repository → DB)
- Frontend component interaction with API
- Database operations (queries, transactions)
- Integration with external services (Maps API, AI API)
- Middleware (authentication, validation, logging)

**Tools:** Jest, Supertest, Testcontainers  
**Target Coverage:** 95%+ for critical API endpoints

---

### 1.2.3. End-to-End (E2E) Tests

**Purpose:** Test complete user scenarios from start to finish.

**What is tested:**
- Complete user journeys (from site entry to action completion)
- Interaction of all system components (frontend, API, DB, external services)
- UI interactions (clicks, data entry, navigation)
- Cross-browser compatibility (Chrome, Firefox, Safari)

**Tools:** Cypress / Playwright  
**Target Coverage:** 100% of critical user flows

---

### 1.2.4. Smoke Tests

**Purpose:** Quick check of basic system functionality after deployment.

**What is tested:**
- Main page availability
- API operability (health check endpoints)
- Authentication (login/logout)
- Critical flows (search, view warehouse, start booking)

**Execution Time:** < 5 minutes

---

### 1.2.5. Regression Tests

**Purpose:** Verify that new changes haven't broken existing functionality.

**When run:**
- After each major change (feature branch merge)
- Before each staging/production release
- After critical bug fixes

**Execution Time:** 20-30 minutes (full suite)

---

## 1.3. Priorities and Scope

### Priority 1: CRITICAL (mandatory coverage)

**Areas:**

1. **Authorization and Security**
   - Registration (email, password, phone validation)
   - Login (correct/incorrect credentials)
   - Session management (cookie-based authentication)
   - RBAC (role-based access)
   - Protection against SQL Injection, XSS

2. **Booking (core business logic)**
   - Booking request creation
   - Box availability validation
   - Price calculation (with discounts, deposit)
   - Status processing (pending → confirmed → active)
   - User and operator notifications

3. **Search and Filters**
   - Location search (city, district, address)
   - Attribute filtering (price, size, amenities)
   - Result sorting
   - Pagination

4. **Critical API Endpoints**
   - POST /api/v1/auth/login
   - POST /api/v1/auth/register
   - GET /api/v1/warehouses
   - GET /api/v1/warehouses/:id
   - POST /api/v1/bookings
   - GET /api/v1/users/me

**Volume:** Unit 80%+, Integration 100%, E2E 100%, Security mandatory

---

### Priority 2: HIGH

**Areas:**
- Warehouse catalog
- Map (loading, clustering, interaction)
- User cabinet
- Operator cabinet

**Volume:** Unit 70%+, Integration 90%+, E2E main scenarios

---

### Priority 3: MEDIUM

**Areas:**
- AI modules (Box Finder, Chat Assistant)
- Additional functionality (Favorites, Reviews)
- Notifications (Email, SMS, Telegram)

**Volume:** Unit 60%+, Integration 70%+, E2E selective

---

### Priority 4: LOW (for MVP)

**Areas:**
- UI decorations (animations, hover effects)
- Analytics and metrics
- Admin panel (minimal for MVP)

**Volume:** Unit 30-40%, Integration selective, E2E not mandatory

---

## 1.4. Tools

### Tool Summary Table

| Tool | Purpose | Priority | When to Run |
|------|---------|----------|-------------|
| **Jest** | Unit + Integration tests | Critical | With each commit |
| **Cypress** | E2E tests | Critical | Before merge to main, before release |
| **Postman/Newman** | API tests | High | Daily (CI/CD), before release |
| **MSW** | Frontend mocks | High | In frontend unit/integration tests |
| **k6/Artillery** | Load testing | Medium | Before production release |
| **OWASP ZAP** | Security testing | High | Before production release |

---

# 2. Test Coverage Map

## 2.1. Functional Modules (coverage table)

| Module | Unit | Integration | E2E | API | Smoke | Priority |
|--------|------|-------------|-----|-----|-------|----------|
| **Authorization** | ✅ | ✅ | ✅ | ✅ | ✅ | **Critical** |
| Registration (signup) | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| Token refresh | ✅ | ✅ | ⚠️ | ✅ | ✅ | Critical |
| Logout | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | High |
| **Warehouse Catalog** | ✅ | ✅ | ✅ | ✅ | ✅ | **High** |
| Location search | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| Pagination | ✅ | ✅ | ✅ | ✅ | ⚠️ | High |
| Sorting | ✅ | ✅ | ✅ | ✅ | ⚠️ | High |
| **Filters** | ✅ | ✅ | ✅ | ✅ | ⚠️ | **High** |
| Price filter | ✅ | ✅ | ✅ | ✅ | ⚠️ | Critical |
| Size filter | ✅ | ✅ | ✅ | ✅ | ⚠️ | High |
| Attribute filter | ✅ | ✅ | ✅ | ✅ | ❌ | High |
| **Map** | ⚠️ | ✅ | ✅ | ✅ | ✅ | **High** |
| Point loading | ⚠️ | ✅ | ✅ | ✅ | ✅ | Critical |
| Clustering | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | High |
| **Warehouse Card** | ⚠️ | ✅ | ✅ | ✅ | ✅ | **High** |
| Box list | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| **Booking** | ✅ | ✅ | ✅ | ✅ | ✅ | **Critical** |
| Request creation | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| Form validation | ✅ | ✅ | ✅ | ✅ | ⚠️ | Critical |
| Price calculation | ✅ | ✅ | ✅ | ✅ | ⚠️ | Critical |
| Availability check | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| **User Cabinet** | ⚠️ | ✅ | ✅ | ✅ | ✅ | **High** |
| Profile view | ✅ | ✅ | ✅ | ✅ | ✅ | High |
| Booking list | ✅ | ✅ | ✅ | ✅ | ✅ | High |
| Favorites | ✅ | ✅ | ✅ | ✅ | ⚠️ | Medium |
| Reviews | ✅ | ✅ | ✅ | ✅ | ⚠️ | Medium |
| **Operator Cabinet** | ⚠️ | ✅ | ✅ | ✅ | ✅ | **High** |
| Warehouse management | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| Booking management | ✅ | ✅ | ✅ | ✅ | ✅ | Critical |
| CRM leads | ✅ | ✅ | ✅ | ✅ | ⚠️ | High |
| **AI (MVP)** | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | **Medium** |
| Box size recommendation | ✅ | ✅ | ✅ | ✅ | ⚠️ | Medium |

**Legend:**
- ✅ = Full coverage
- ⚠️ = Partial coverage
- ❌ = Not covered

---

## 2.2. Area Breakdown

### Authentication & Security (Critical)

**Functional Coverage:**
- User registration with validation
- Login with cookie-based session
- Automatic token refresh via cookies
- Logout with cookie clearing
- Role-based access control (RBAC)
- Session expiry handling
- CSRF protection validation

**Security Coverage:**
- SQL Injection protection
- XSS protection
- Cookie security (HttpOnly, Secure, SameSite)
- Rate limiting
- Password strength validation

---

### Warehouse Search & Filters (Critical)

**Functional Coverage:**
- Text search by location
- Map-based search
- Price range filtering
- Size filtering
- Amenity filtering
- Result sorting
- Pagination

**Edge Cases:**
- Empty results
- Invalid coordinates
- Extreme filter values
- Large result sets

---

### Booking Flow (Critical)

**Functional Coverage:**
- Box selection
- Date/duration selection
- Price calculation
- Deposit calculation
- Contact info collection
- Booking submission
- Confirmation flow

**Edge Cases:**
- Box unavailability
- Concurrent booking attempts
- Invalid date ranges
- Price changes during booking

---

### User Cabinets (High)

**User Cabinet:**
- Profile management
- Active bookings
- Booking history
- Favorites management
- Review submission

**Operator Cabinet:**
- Warehouse CRUD
- Box inventory
- Booking approval/rejection
- Lead management
- Basic analytics

---

# 3. Test Cases

## 3.1. Test Case Format

Each test case follows this structure:

```
TC-XXX: [Test Case Title]
Priority: Critical | High | Medium | Low
Type: Functional | Security | Performance | Integration
Preconditions: [Required setup]
Steps: [Numbered steps]
Expected Result: [What should happen]
```

---

## 3.2. Auth Test Cases

### TC-AUTH-001: User Registration (Happy Path)
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User not registered
- All services operational

**Steps:**
1. Navigate to `/register`
2. Fill form:
   - Email: `newuser@test.com`
   - Password: `SecurePass123!`
   - Name: `Test User`
   - Phone: `+79991234567`
3. Submit form

**Expected Result:**
- HTTP 201 Created
- Response contains user data (no tokens in body)
- `Set-Cookie` headers present with `auth_token` and `refresh_token`
- Cookies have `HttpOnly`, `Secure`, `SameSite=Strict` attributes
- User redirected to dashboard
- User session active

---

### TC-AUTH-002: Login with Valid Credentials
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User exists: `user@test.com` / `TestUser123!`
- User not logged in

**Steps:**
1. Navigate to `/login`
2. Enter email: `user@test.com`
3. Enter password: `TestUser123!`
4. Click "Login"

**Expected Result:**
- HTTP 200 OK
- Response contains user data
- `Set-Cookie` headers present with authentication cookies
- No tokens in response body
- Redirect to dashboard
- User can access protected routes

---

### TC-AUTH-003: Login with Invalid Credentials
**Priority:** Critical  
**Type:** Functional, Security

**Preconditions:**
- User exists: `user@test.com`

**Steps:**
1. Navigate to `/login`
2. Enter email: `user@test.com`
3. Enter password: `WrongPassword123!`
4. Click "Login"

**Expected Result:**
- HTTP 401 Unauthorized
- Error message: "Invalid email or password"
- No cookies set
- User remains on login page
- Failed attempt logged

---

### TC-AUTH-004: Session Persistence
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User logged in
- Authentication cookies set

**Steps:**
1. Refresh page
2. Navigate to different page
3. Close and reopen browser (within session)

**Expected Result:**
- User remains authenticated
- No re-login required
- Browser automatically sends cookies with requests
- Protected content accessible

---

### TC-AUTH-005: Automatic Token Refresh
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User logged in
- Access token near expiry

**Steps:**
1. Make API request that receives 401
2. Frontend automatically calls `/auth/refresh`
3. Browser sends `refresh_token` cookie
4. Retry original request

**Expected Result:**
- Refresh endpoint returns 200 OK
- New `auth_token` and `refresh_token` cookies set
- Original request succeeds
- Process transparent to user

---

### TC-AUTH-006: Logout
**Priority:** High  
**Type:** Functional

**Preconditions:**
- User logged in

**Steps:**
1. Click "Logout" button
2. Confirm logout (if required)

**Expected Result:**
- HTTP 204 No Content
- `Set-Cookie` headers clear cookies (`Max-Age=0`)
- Session invalidated server-side
- Redirect to login page
- Protected routes inaccessible

---

### TC-AUTH-007: Expired Session Handling
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User logged in
- Both tokens expired

**Steps:**
1. Wait for token expiration
2. Attempt to access protected route

**Expected Result:**
- Automatic redirect to login
- Clear session message
- Previous location saved for post-login redirect

---

### TC-AUTH-008: Cookie Security Attributes
**Priority:** Critical  
**Type:** Security

**Preconditions:**
- None

**Steps:**
1. Complete login
2. Inspect response headers
3. Verify cookie attributes

**Expected Result:**
- `HttpOnly` flag present (JavaScript cannot access)
- `Secure` flag present (HTTPS only)
- `SameSite=Strict` (CSRF protection)
- `Path=/` (available site-wide)
- Appropriate `Max-Age` values

---

### TC-AUTH-009: CSRF Protection
**Priority:** Critical  
**Type:** Security

**Preconditions:**
- User logged in

**Steps:**
1. Attempt cross-origin request with cookies
2. Verify `SameSite=Strict` enforcement

**Expected Result:**
- Cross-origin requests blocked
- Cookies not sent to different origin
- CSRF attack prevented

---

### TC-AUTH-010: Role-Based Access Control
**Priority:** Critical  
**Type:** Security

**Preconditions:**
- User logged in with role `user`

**Steps:**
1. Attempt to access `/operator/warehouses`
2. Attempt to access `/admin/users`

**Expected Result:**
- HTTP 403 Forbidden
- Access denied message
- User redirected or shown error

---

## 3.3. Warehouses Test Cases

### TC-WAR-001: Search Warehouses by Location
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Test warehouses exist in database

**Steps:**
1. Navigate to home page
2. Enter location: "Москва, Выхино"
3. Click "Search"

**Expected Result:**
- GET /api/v1/warehouses?location=...
- HTTP 200 OK
- List of warehouses near location
- Map shows warehouse markers
- Results paginated

---

### TC-WAR-002: Filter by Price Range
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Search results displayed

**Steps:**
1. Set price range: 3000-7000 RUB
2. Apply filter

**Expected Result:**
- Results filtered to price range
- URL updated with filter params
- Result count updated
- No warehouses outside range

---

### TC-WAR-003: View Warehouse Details
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Warehouse exists: ID 101

**Steps:**
1. Click warehouse card
2. View details page

**Expected Result:**
- GET /api/v1/warehouses/101
- HTTP 200 OK
- Full warehouse information displayed
- Available boxes listed
- Photos gallery shown
- Reviews visible

---

### TC-WAR-004: Empty Search Results
**Priority:** High  
**Type:** Edge Case

**Preconditions:**
- None

**Steps:**
1. Search for: "Nonexistent Location XYZ"

**Expected Result:**
- HTTP 200 OK
- Empty result set
- Friendly "No results" message
- Suggestion to broaden search

---

## 3.4. Bookings Test Cases

### TC-BOOK-001: Create Booking (Happy Path)
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User logged in
- Box available: ID 501

**Steps:**
1. Navigate to warehouse detail
2. Select box 501
3. Choose dates: 2025-01-01 to 2025-02-01
4. Fill contact info
5. Submit booking

**Expected Result:**
- POST /api/v1/bookings
- HTTP 201 Created
- Booking created with status `pending`
- Booking number generated
- User redirected to booking confirmation
- Email sent to user
- Notification sent to operator

---

### TC-BOOK-002: Booking Unavailable Box
**Priority:** Critical  
**Type:** Edge Case

**Preconditions:**
- User logged in
- Box fully booked: ID 503

**Steps:**
1. Attempt to book box 503
2. Submit booking

**Expected Result:**
- HTTP 409 Conflict
- Error: "Box not available"
- No booking created
- User shown alternative boxes

---

### TC-BOOK-003: Price Calculation Validation
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User selects box with known price

**Steps:**
1. Select box: 5000 RUB/month
2. Select duration: 3 months
3. View price breakdown

**Expected Result:**
- Monthly: 5000 RUB
- Total: 15000 RUB
- Deposit: 5000 RUB (1 month)
- Grand Total: 20000 RUB
- Calculations correct

---

### TC-BOOK-004: Concurrent Booking Attempt
**Priority:** High  
**Type:** Edge Case

**Preconditions:**
- Two users attempt to book last available box simultaneously

**Steps:**
1. User A starts booking
2. User B starts booking
3. User A completes booking
4. User B attempts to complete

**Expected Result:**
- User A: Booking successful
- User B: HTTP 409 Conflict
- Only one booking created
- User B notified of unavailability

---

## 3.5. User Cabinet Test Cases

### TC-USER-001: View Profile
**Priority:** High  
**Type:** Functional

**Preconditions:**
- User logged in

**Steps:**
1. Navigate to `/profile`
2. View profile information

**Expected Result:**
- GET /api/v1/users/me
- HTTP 200 OK
- Profile data displayed
- Edit button available
- Session validated via cookies

---

### TC-USER-002: Update Profile
**Priority:** High  
**Type:** Functional

**Preconditions:**
- User logged in

**Steps:**
1. Navigate to `/profile`
2. Click "Edit"
3. Update name to "New Name"
4. Save changes

**Expected Result:**
- PATCH /api/v1/users/me
- HTTP 200 OK
- Profile updated
- Success message shown
- Changes persisted

---

### TC-USER-003: View Booking History
**Priority:** High  
**Type:** Functional

**Preconditions:**
- User has bookings

**Steps:**
1. Navigate to `/bookings`
2. View list of bookings

**Expected Result:**
- GET /api/v1/bookings/my
- HTTP 200 OK
- All user bookings listed
- Status badges shown
- Sort/filter options available

---

## 3.6. Operator Cabinet Test Cases

### TC-OPR-001: Approve Booking
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Operator logged in
- Pending booking exists

**Steps:**
1. Navigate to operator dashboard
2. View pending bookings
3. Select booking
4. Click "Approve"

**Expected Result:**
- PATCH /api/v1/operator/bookings/{id}
- HTTP 200 OK
- Status changed to `confirmed`
- User notified via email
- Booking visible in confirmed list

---

### TC-OPR-002: Reject Booking
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Operator logged in
- Pending booking exists

**Steps:**
1. View pending booking
2. Enter rejection reason
3. Click "Reject"

**Expected Result:**
- Status changed to `rejected`
- User notified with reason
- Box availability restored

---

### TC-OPR-003: Create Warehouse
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Operator logged in

**Steps:**
1. Navigate to `/operator/warehouses/new`
2. Fill warehouse form
3. Add boxes
4. Submit

**Expected Result:**
- POST /api/v1/operator/warehouses
- HTTP 201 Created
- Warehouse created
- Associated with operator
- Visible in public catalog

---

### TC-OPR-004: Manage CRM Leads
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Operator logged in
- Leads exist

**Steps:**
1. Navigate to `/crm/leads`
2. View lead list
3. Update lead status
4. Add activity note

**Expected Result:**
- Leads displayed
- Status update successful
- Activity logged
- Lead workflow tracked

---

## 3.7. AI Test Cases

### TC-AI-001: Box Size Recommendation
**Priority:** Medium  
**Type:** Functional

**Preconditions:**
- AI service available

**Steps:**
1. Navigate to box finder
2. Answer questions:
   - Item type: "furniture"
   - Quantity: "1-bedroom apartment"
   - Duration: "3 months"
3. Get recommendation

**Expected Result:**
- POST /api/v1/ai/box-finder
- HTTP 200 OK
- Recommended box sizes
- Reasoning provided
- Alternative options shown

---

### TC-AI-002: AI Service Unavailable
**Priority:** High  
**Type:** Edge Case

**Preconditions:**
- AI service down/rate limited

**Steps:**
1. Request box recommendation
2. AI service fails

**Expected Result:**
- Graceful fallback
- Static recommendation shown
- Error logged
- User experience not broken

---

## 3.8. API Test Cases

### TC-API-001: Health Check
**Priority:** Critical  
**Type:** Smoke

**Preconditions:**
- API deployed

**Steps:**
1. GET /api/v1/health

**Expected Result:**
- HTTP 200 OK
- Response: `{"status": "ok"}`
- Response time < 500ms

---

### TC-API-002: Rate Limiting
**Priority:** High  
**Type:** Security

**Preconditions:**
- Rate limits configured

**Steps:**
1. Make 101 requests to /api/v1/warehouses
2. Within 1 minute

**Expected Result:**
- First 100 requests: HTTP 200
- 101st request: HTTP 429 Too Many Requests
- `Retry-After` header present
- Rate limit logged

---

### TC-API-003: Invalid JSON
**Priority:** High  
**Type:** Edge Case

**Preconditions:**
- None

**Steps:**
1. POST /api/v1/bookings
2. Send malformed JSON

**Expected Result:**
- HTTP 400 Bad Request
- Error: "Invalid JSON"
- Request logged

---

### TC-API-004: Missing Required Fields
**Priority:** High  
**Type:** Validation

**Preconditions:**
- None

**Steps:**
1. POST /api/v1/bookings
2. Omit required field: `box_id`

**Expected Result:**
- HTTP 400 Bad Request
- Validation error message
- Field name in error details

---

### TC-API-005: Unauthorized Access
**Priority:** Critical  
**Type:** Security

**Preconditions:**
- User not logged in (no cookies)

**Steps:**
1. GET /api/v1/users/me
2. No authentication cookies sent

**Expected Result:**
- HTTP 401 Unauthorized
- Error message: "Authentication required"
- No user data returned

---

### TC-API-006: Forbidden Access
**Priority:** Critical  
**Type:** Security

**Preconditions:**
- User logged in with role `user`

**Steps:**
1. GET /api/v1/operator/warehouses
2. Valid session but wrong role

**Expected Result:**
- HTTP 403 Forbidden
- Error: "Insufficient permissions"
- Access denied

---

### TC-API-007: Resource Not Found
**Priority:** High  
**Type:** Edge Case

**Preconditions:**
- None

**Steps:**
1. GET /api/v1/warehouses/99999

**Expected Result:**
- HTTP 404 Not Found
- Error: "Warehouse not found"
- Suggestion to search

---

### TC-API-008: CORS Policy
**Priority:** High  
**Type:** Security

**Preconditions:**
- Request from allowed origin

**Steps:**
1. Make OPTIONS preflight request
2. Make actual request

**Expected Result:**
- OPTIONS returns CORS headers
- Actual request succeeds
- `Access-Control-Allow-Origin` correct
- `Access-Control-Allow-Credentials: true`

---

# 4. End-to-End Scenarios

## 4.1. Core E2E Scenarios

### E2E-001: Complete User Journey - First Booking

**Scenario:** New user searches, finds warehouse, and creates booking

**Steps:**
1. User visits homepage
2. Enters location "Москва, Центр"
3. Views search results
4. Applies filters (price: 5000-8000, climate control)
5. Clicks warehouse card
6. Views warehouse details
7. Selects box (size M)
8. Clicks "Book now"
9. Redirected to register (not logged in)
10. Completes registration
11. Automatically returns to booking flow
12. Fills booking form
13. Reviews price calculation
14. Confirms booking
15. Receives confirmation email
16. Views booking in cabinet

**Expected Outcome:**
- Seamless flow without errors
- All data persists across redirect
- Booking created successfully
- All notifications sent
- User can view booking

**Duration:** ~5 minutes

---

### E2E-002: Operator Booking Management

**Scenario:** Operator approves user booking

**Steps:**
1. User creates booking (E2E-001)
2. Operator logs in
3. Navigates to operator dashboard
4. Views pending bookings
5. Selects user's booking
6. Reviews booking details
7. Approves booking
8. Confirms approval
9. User receives confirmation email
10. User views updated status in cabinet

**Expected Outcome:**
- Booking status changes correctly
- Notifications sent to both parties
- Real-time status update
- Booking visible in correct sections

**Duration:** ~3 minutes

---

### E2E-003: Search and Favorite

**Scenario:** User searches, adds favorites, returns later

**Steps:**
1. User logs in
2. Searches for warehouses
3. Adds 3 warehouses to favorites
4. Logs out
5. Logs back in
6. Views favorites
7. Removes one favorite
8. Proceeds to book from favorites

**Expected Outcome:**
- Favorites persist across sessions
- Add/remove actions work correctly
- Quick booking from favorites
- Session management works

**Duration:** ~4 minutes

---

### E2E-004: Complete Operator Workflow

**Scenario:** Operator manages warehouse and bookings

**Steps:**
1. Operator logs in
2. Creates new warehouse
3. Adds box inventory
4. Warehouse published
5. User books box
6. Operator receives notification
7. Operator approves booking
8. User starts using box
9. Operator views analytics
10. Operator updates box availability

**Expected Outcome:**
- Complete lifecycle works
- All state transitions correct
- Notifications triggered appropriately
- Data consistency maintained

**Duration:** ~7 minutes

---

# 5. Tools

## 5.1. E2E Tests (Cypress)

### Installation

```bash
npm install --save-dev cypress @testing-library/cypress
```

### Configuration

```javascript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    env: {
      apiUrl: 'http://localhost:4000/api/v1'
    }
  }
});
```

### Example Test

```javascript
// cypress/e2e/auth/login.cy.ts
describe('Authentication', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('user@test.com');
    cy.get('[data-testid="password-input"]').type('TestUser123!');
    cy.get('[data-testid="login-button"]').click();
    
    // Verify cookies set
    cy.getCookie('auth_token').should('exist');
    cy.getCookie('refresh_token').should('exist');
    
    // Verify redirect
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

---

## 5.2. API Tests (Postman/Newman)

### Collection Structure

```
Self-Storage API Tests/
├── Auth/
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   └── Logout
├── Warehouses/
│   ├── List Warehouses
│   ├── Get Warehouse
│   └── Search
├── Bookings/
│   ├── Create Booking
│   ├── List My Bookings
│   └── Get Booking
└── Operator/
    ├── Create Warehouse
    └── Approve Booking
```

### Example Test Script

```javascript
// Postman test for login
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.user).to.be.an('object');
    pm.expect(jsonData.data.user.email).to.exist;
});

pm.test("Cookies are set", function () {
    pm.expect(pm.cookies.has('auth_token')).to.be.true;
    pm.expect(pm.cookies.has('refresh_token')).to.be.true;
});

pm.test("Cookies have security attributes", function () {
    const authCookie = pm.cookies.get('auth_token');
    pm.expect(authCookie).to.include('HttpOnly');
    pm.expect(authCookie).to.include('Secure');
    pm.expect(authCookie).to.include('SameSite=Strict');
});
```

---

## 5.3. Unit/Integration (Jest)

### Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Example Unit Test

```typescript
// src/services/price-calculator.spec.ts
describe('PriceCalculator', () => {
  let calculator: PriceCalculator;

  beforeEach(() => {
    calculator = new PriceCalculator();
  });

  describe('calculateMonthlyTotal', () => {
    it('should calculate correct total for 3 months', () => {
      const result = calculator.calculate({
        monthlyPrice: 5000,
        duration: 3
      });

      expect(result.monthlyPrice).toBe(5000);
      expect(result.totalPrice).toBe(15000);
      expect(result.deposit).toBe(5000);
      expect(result.grandTotal).toBe(20000);
    });

    it('should handle zero duration', () => {
      expect(() => {
        calculator.calculate({
          monthlyPrice: 5000,
          duration: 0
        });
      }).toThrow('Duration must be positive');
    });
  });
});
```

### Example Integration Test

```typescript
// src/modules/auth/auth.controller.spec.ts
describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should login and set cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@test.com',
          password: 'TestUser123!'
        })
        .expect(200);

      // Check response body
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('user@test.com');

      // Check cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.includes('auth_token'))).toBe(true);
      expect(cookies.some(c => c.includes('refresh_token'))).toBe(true);
      expect(cookies.some(c => c.includes('HttpOnly'))).toBe(true);
      expect(cookies.some(c => c.includes('Secure'))).toBe(true);
      expect(cookies.some(c => c.includes('SameSite=Strict'))).toBe(true);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@test.com',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body.error_code).toBe('INVALID_CREDENTIALS');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
  });
});
```

---

## 5.4. Mocks (MSW)

### Setup

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/v1/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'user@test.com' && password === 'TestUser123!') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: '123',
            email: 'user@test.com',
            name: 'Test User',
            role: 'user'
          }
        }
      }, {
        headers: {
          'Set-Cookie': [
            'auth_token=mock_token; HttpOnly; Secure; SameSite=Strict',
            'refresh_token=mock_refresh; HttpOnly; Secure; SameSite=Strict'
          ].join(', ')
        }
      });
    }

    return HttpResponse.json({
      error_code: 'INVALID_CREDENTIALS',
      http_status: 401,
      message: 'Invalid credentials'
    }, { status: 401 });
  }),

  // Warehouses endpoint
  http.get('/api/v1/warehouses', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 101,
          name: 'СкладОК Выхино',
          city: 'Москва',
          price_from: 2500
        }
      ],
      pagination: {
        page: 1,
        per_page: 12,
        total: 1
      }
    });
  })
];
```

### Usage in Tests

```typescript
// src/components/Login.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from './Login';

describe('Login Component', () => {
  it('should login successfully with mocked API', async () => {
    render(<Login />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      'user@test.com'
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      'TestUser123!'
    );
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });
});
```

---

# 6. Release Checklist

## 6.1. Pre-Production Checklist

### Code Quality

- [ ] All unit tests passing (coverage > 70%)
- [ ] All integration tests passing (coverage > 95% for critical paths)
- [ ] All E2E tests passing (100% critical flows)
- [ ] No failing tests in CI/CD
- [ ] Code review completed
- [ ] No critical or high severity linter warnings
- [ ] Technical debt documented

### Functionality

- [ ] All MVP features implemented
- [ ] All critical bugs resolved
- [ ] All high priority bugs resolved
- [ ] Acceptance criteria met for all user stories
- [ ] Feature flags configured correctly
- [ ] Error messages user-friendly

### Security

- [ ] Security scan completed (OWASP ZAP)
- [ ] No high/critical vulnerabilities
- [ ] Cookie security verified (HttpOnly, Secure, SameSite)
- [ ] CSRF protection tested
- [ ] Rate limiting verified
- [ ] Authentication flow secure
- [ ] RBAC enforcement tested
- [ ] SQL injection tests passed
- [ ] XSS protection verified
- [ ] Secrets not in code/logs

### Performance

- [ ] Load testing completed (100 concurrent users)
- [ ] Response times acceptable (< 2s for main pages)
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets
- [ ] Image optimization verified

### Infrastructure

- [ ] Production environment provisioned
- [ ] Database backups configured
- [ ] SSL certificates valid
- [ ] DNS configured correctly
- [ ] Monitoring tools set up
- [ ] Logging configured
- [ ] Error tracking enabled (Sentry/similar)
- [ ] Alerting rules configured

### Documentation

- [ ] API documentation complete
- [ ] Deployment runbook updated
- [ ] Troubleshooting guide available
- [ ] Release notes prepared
- [ ] Known issues documented

---

## 6.2. Smoke Tests

**Execute immediately after deployment (< 5 minutes)**

### Critical Path Tests

```
SMOKE-001: Health Check
- GET /api/v1/health
- Expected: 200 OK
- Duration: < 1 sec

SMOKE-002: Homepage Load
- GET /
- Expected: 200 OK, content renders
- Duration: < 2 sec

SMOKE-003: Login
- POST /auth/login
- Expected: 200 OK, cookies set
- Duration: < 1 sec

SMOKE-004: Search Warehouses
- GET /api/v1/warehouses?city=Москва
- Expected: 200 OK, results returned
- Duration: < 2 sec

SMOKE-005: View Warehouse Details
- GET /api/v1/warehouses/101
- Expected: 200 OK, warehouse data
- Duration: < 1 sec

SMOKE-006: Create Booking (Authenticated)
- POST /api/v1/bookings
- Expected: 201 Created
- Duration: < 2 sec

SMOKE-007: Operator Dashboard
- GET /operator/dashboard
- Expected: 200 OK, operator data
- Duration: < 2 sec
```

**Pass Criteria:** All 7 tests pass

---

## 6.3. Regression Tests

**Execute before each release (20-30 minutes)**

### Test Suites

```
REGRESSION-SUITE-001: Authentication (15 tests)
- Registration, login, logout, session management
- Expected: 100% pass

REGRESSION-SUITE-002: Search & Filters (12 tests)
- Location search, filters, sorting, pagination
- Expected: 100% pass

REGRESSION-SUITE-003: Booking Flow (18 tests)
- Booking creation, validation, status changes
- Expected: 100% pass

REGRESSION-SUITE-004: User Cabinet (10 tests)
- Profile, bookings, favorites
- Expected: 100% pass

REGRESSION-SUITE-005: Operator Features (15 tests)
- Warehouse management, booking approval, CRM
- Expected: 100% pass

REGRESSION-SUITE-006: API Contract (20 tests)
- Request/response validation, error handling
- Expected: 100% pass
```

**Pass Criteria:** 95%+ pass rate (document failures)

---

## 6.4. Security Checks

### Pre-Deployment Security Audit

```
SEC-CHECK-001: Cookie Security
- Verify HttpOnly, Secure, SameSite attributes
- Test: Inspect Set-Cookie headers
- Expected: All flags present

SEC-CHECK-002: CSRF Protection
- Attempt cross-origin request with cookies
- Test: SameSite enforcement
- Expected: Requests blocked

SEC-CHECK-003: Authentication Bypass
- Attempt access without cookies
- Test: Protected routes
- Expected: 401 Unauthorized

SEC-CHECK-004: Authorization Bypass
- Attempt role escalation
- Test: Access operator/admin routes as user
- Expected: 403 Forbidden

SEC-CHECK-005: Rate Limiting
- Send 101 requests in 1 minute
- Test: All public endpoints
- Expected: 429 Too Many Requests

SEC-CHECK-006: SQL Injection
- Send SQL in query params
- Test: Search, filters
- Expected: Sanitized, no SQL execution

SEC-CHECK-007: XSS Protection
- Send <script> tags in input
- Test: Forms, search
- Expected: Sanitized output

SEC-CHECK-008: Sensitive Data Exposure
- Check logs and responses
- Test: No passwords, no sensitive PII
- Expected: Clean

SEC-CHECK-009: SSL/TLS
- Verify HTTPS enforcement
- Test: HTTP redirects to HTTPS
- Expected: All traffic encrypted

SEC-CHECK-010: Dependency Vulnerabilities
- Run npm audit
- Test: Check for known CVEs
- Expected: No high/critical issues
```

**Pass Criteria:** 100% pass (zero tolerance)

---

## 6.5. Performance Tests

### Load Testing Scenarios

```
PERF-001: Normal Load
- Users: 50 concurrent
- Duration: 10 minutes
- Actions: Search, view, book
- Expected: Response time < 2s, error rate < 1%

PERF-002: Peak Load
- Users: 100 concurrent
- Duration: 5 minutes
- Actions: Mixed workload
- Expected: Response time < 3s, error rate < 2%

PERF-003: Stress Test
- Users: Ramp up to 200
- Duration: 15 minutes
- Expected: Graceful degradation, no crashes

PERF-004: Soak Test
- Users: 30 concurrent
- Duration: 2 hours
- Expected: No memory leaks, stable performance
```

### Key Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| Homepage load | < 1.5s | < 3s |
| Search results | < 2s | < 4s |
| Warehouse detail | < 1.5s | < 3s |
| Booking creation | < 2s | < 4s |
| API average response | < 500ms | < 1s |
| Database query p95 | < 100ms | < 200ms |

**Pass Criteria:** All targets met, no critical breaches

---

## 6.6. Go-Live Checklist

### Timeline

| Time | Activity | Owner | Status |
|------|----------|-------|--------|
| T-48h | Final code freeze | Tech Lead | ☐ |
| T-24h | Security audit complete | Security | ☐ |
| T-24h | Performance tests pass | QA | ☐ |
| T-24h | Regression tests pass | QA | ☐ |
| T-12h | Staging deployment | DevOps | ☐ |
| T-12h | Smoke tests on staging | QA | ☐ |
| T-6h | Staging deployment | DevOps | ☐ |
| T-2h | Team on standby | All | ☐ |
| T-1h | Go/No-Go decision | PM + Tech Lead | ☐ |
| T-0 | 🎉 Production deployment | DevOps | ☐ |
| T+30m | Monitoring check | DevOps | ☐ |
| T+2h | Extended monitoring | All | ☐ |
| T+24h | Post-launch review | All | ☐ |

**Sign-off:**

| Role | Signature | Date |
|------|-----------|------|
| QA Lead | ☐ | |
| Tech Lead | ☐ | |
| DevOps | ☐ | |
| Security | ☐ | |
| PM | ☐ | |
| CTO | ☐ | |

---

# 7. Appendices

## 7.1. Test Data Requirements

### Test Users

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Guest | - | - | Unauthenticated |
| User | user@test.com | TestUser123! | Regular user |
| Operator | operator@test.com | TestOper123! | Operator with 2 warehouses |
| Admin | admin@test.com | TestAdmin123! | Administrator |

### Test Warehouses

```json
{
  "warehouses": [
    {
      "id": 101,
      "name": "СкладОК Выхино",
      "city": "Москва",
      "district": "Выхино",
      "price_from": 2500,
      "rating": 4.7,
      "climate_control": true
    },
    {
      "id": 102,
      "name": "Хранилище Центр",
      "city": "Москва",
      "district": "Центр",
      "price_from": 8000,
      "rating": 4.9
    }
  ]
}
```

### Test Boxes

| ID | Warehouse | Size | Price | Available |
|----|-----------|------|-------|-----------|
| 501 | 101 | S (2.25м²) | 2500₽ | 10/20 |
| 502 | 101 | M (6м²) | 5000₽ | 5/15 |
| 503 | 101 | L (12м²) | 8000₽ | 0/10 |
| 504 | 101 | XL (20м²) | 12000₽ | 2/5 |

---

## 7.2. Test Environment Configuration

### Environments

| Environment | URL | Database | AI |
|-------------|-----|----------|-----|
| Local | http://localhost:3000 | PostgreSQL (local) | Mock |
| CI | - | PostgreSQL (Docker) | Mock |
| Staging | https://staging.selfstorage.com | Cloud | Real |
| Production | https://selfstorage.com | Cloud | Real |

### Environment Variables (.env.test)

```bash
NODE_ENV=test
DATABASE_URL="postgresql://testuser:testpass@localhost:5432/selfstorage_test"
REDIS_HOST=localhost
AI_ENABLED=false
AI_MOCK_MODE=true
EMAIL_MOCK_MODE=true
COOKIE_DOMAIN=localhost
SESSION_SECRET="test-session-secret-min-32-chars"
```

**Note:** No `JWT_SECRET` needed - session management uses secure cookies

### Docker Compose (for tests)

```yaml
# docker-compose.test.yml
services:
  postgres-test:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: selfstorage_test
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpass
    ports:
      - "5433:5432"

  redis-test:
    image: redis:7-alpine
    ports:
      - "6380:6379"
```

---

## 7.3. Bug Priority Matrix

| Severity | SLA | Examples |
|----------|-----|----------|
| **P0 - Blocker** | < 4 hours | Cannot create booking, API down, DB corruption |
| **P1 - Critical** | < 24 hours | Incorrect price calculation, emails not sent |
| **P2 - High** | < 3 days | Filters not working, slow loading |
| **P3 - Medium** | < 1 week | Cosmetic UI bugs, minor issues |
| **P4 - Low** | Backlog | Typos, minor inconsistencies |

### Bug Report Template

```markdown
## Bug Report

**Summary:** [Brief description]

**Severity:** P0 / P1 / P2 / P3 / P4

**Environment:** Production / Staging / Local

**Steps to Reproduce:**
1. ...
2. ...

**Expected:** [What should have happened]
**Actual:** [What happened]

**Screenshots:** [If available]
**Logs:** [Relevant logs]
```

---

## 7.4. CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run migrate:test
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit --audit-level=moderate
```

---

## 7.5. Best Practices

### DO ✅

- Write tests before or with code (TDD)
- Make tests independent
- Use descriptive names (describe what, not how)
- Follow AAA (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases
- Run tests locally before commit

### DON'T ❌

- Don't make tests dependent on order
- Don't use hardcoded values
- Don't test implementation details
- Don't ignore failing tests
- Don't commit failing tests
- Don't skip tests without reason

### Test Naming Convention

```typescript
describe('[Module Name]', () => {
  describe('[Method Name]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const service = new PriceCalculator();
      
      // Act
      const result = service.calculate(5000, 3);
      
      // Assert
      expect(result.totalPrice).toBe(14250);
    });
  });
});
```

---

## 7.6. Useful Resources

### Documentation

- **Cypress:** https://docs.cypress.io
- **Jest:** https://jestjs.io/docs
- **Testing Library:** https://testing-library.com
- **MSW:** https://mswjs.io/docs
- **k6:** https://k6.io/docs

### Tools

- **Postman:** https://www.postman.com
- **Lighthouse:** Chrome DevTools
- **OWASP ZAP:** https://www.zaproxy.org
- **Snyk:** https://snyk.io

### Learning

- **Test Automation University:** https://testautomationu.applitools.com
- **JavaScript Testing Best Practices:** https://github.com/goldbergyoni/javascript-testing-best-practices

---

# Conclusion

The **QA & Testing Plan (MVP v1)** for Self-Storage Aggregator provides a complete testing strategy:

✅ **Testing Strategy** — objectives, levels, priorities, tools

✅ **Test Coverage Map** — detailed module coverage map

✅ **Test Cases** — 125+ structured test cases

✅ **E2E Scenarios** — 4 complete user journeys

✅ **Tools** — Cypress, Jest, Postman/Newman, MSW

✅ **Release Checklist** — pre-production checklist

✅ **Appendices** — test data, environments, CI/CD, best practices

---

### Next Steps:

1. **Review** document with team
2. **Setup** test environments
3. **Create** Postman collection
4. **Write** first E2E tests
5. **Configure** CI/CD pipeline
6. **Cover** with unit/integration tests
7. **Run** first testing cycle

---

**Version:** 1.1  
**Date:** 16 December 2025  
**Status:** Ready for Implementation  
**Author:** QA Team
