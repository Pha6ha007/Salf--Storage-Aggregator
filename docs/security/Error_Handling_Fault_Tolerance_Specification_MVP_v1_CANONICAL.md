# Error Handling & Fault Tolerance Specification (MVP v1) - CANONICAL

**Project**: Self-Storage Aggregator  
**Version**: 1.0 - CANONICAL  
**Date**: December 15, 2025  
**Status**: Final - Aligned with CORE Specifications

---

## Document Status

**âœ… CANONICAL** - This document is strictly aligned with:
- `api_design_blueprint_mvp_v1_CANONICAL.md` (SOURCE OF TRUTH for error format)
- `Technical_Architecture_Document_MVP_v1_CANONICAL.md`
- `full_database_specification_mvp_v1_CANONICAL.md`
- `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md`

---

# SECTION 1: ERROR HANDLING OVERVIEW

## 1.1. Goals

The Error Handling & Fault Tolerance specification for the Self-Storage Aggregator MVP v1 establishes a comprehensive framework for managing errors across the entire application stack. The primary goals are:

**Reliability Goals:**
- Ensure the system remains operational during partial failures
- Prevent cascading failures across dependent services
- Maintain data consistency even when errors occur
- Provide predictable system behavior under error conditions

**Operational Goals:**
- Enable rapid identification and diagnosis of production issues
- Provide clear error context for debugging and troubleshooting
- Support automated recovery where possible
- Minimize Mean Time To Recovery (MTTR) for incidents

**User Experience Goals:**
- Return meaningful, actionable error messages to end users
- Maintain API contract consistency across all error scenarios
- Prevent exposure of sensitive internal system details
- Provide graceful degradation when full functionality is unavailable

**Development Goals:**
- Establish consistent error handling patterns across all services
- Enable developers to quickly understand and fix errors
- Provide clear correlation between logs, metrics, and errors
- Support iterative improvement of system resilience

## 1.2. Scope

This specification covers error handling for the following MVP v1 components:

**In Scope:**
- **Frontend (Next.js):** Client-side error boundaries, API error handling, user-facing error messages
- **API Gateway (Nginx):** Request routing errors, rate limiting, timeout handling
- **Backend Services (NestJS):** Business logic errors, validation, service exceptions
- **Database (PostgreSQL + PostGIS):** Connection errors, query timeouts, constraint violations, deadlocks
- **Cache (Redis):** Connection failures, eviction handling, cache miss scenarios
- **AI Service (Python FastAPI):** AI provider errors (Box Size Recommendation ONLY in MVP), timeout handling, response validation
- **External APIs:** Google Maps, Google Maps fallback, email/SMS providers
- **Automation (n8n):** Workflow failures, webhook errors

**Out of Scope (Future Versions):**
- Payment gateway error handling (Stripe, Stripe) - **NOT IN MVP**
- Billing/subscription error handling - **NOT IN MVP**
- Message queue error handling (RabbitMQ, Kafka) - not present in MVP
- Distributed tracing with external systems (Jaeger, Zipkin) - logging only in MVP
- Advanced circuit breakers with external libraries (Hystrix, resilience4j) - manual implementation in MVP
- Multi-region failover - single region deployment in MVP
- Real-time alerting platforms (PagerDuty, Opsgenie) - basic Slack/email alerts only

## 1.3. Error Handling Principles

The error handling strategy adheres to the following core principles:

### Principle 1: Fail Fast, Recover Gracefully

**Fail Fast:**
- Validate inputs at system boundaries (API endpoints, database queries)
- Reject invalid requests immediately with clear error messages
- Do not attempt to process requests that will inevitably fail
- Prevent resource wastage on doomed operations

**Recover Gracefully:**
- Implement automatic retry for transient failures (5xx errors, network issues)
- Provide fallback responses when primary systems are unavailable
- Maintain partial functionality during component failures
- Log all recovery attempts for operational visibility

### Principle 2: Never Expose Internal Details

**Protected Information:**
- Stack traces must never reach external clients
- Database schema details, table names, column names
- Internal IP addresses, server hostnames
- API keys, tokens, credentials
- Internal service names and architecture details

**Safe Externalization:**
- Generic error messages for 5xx errors: "Внутренняя ошибка сервера. Мы уже работаем над решением"
- Specific error codes for debugging: `error_code`, `http_status`
- Business-level error details only: "Бокс уже забронирован", "Неверный формат email"

### Principle 3: Correlation is Mandatory

Every error must be traceable across the entire request lifecycle:
- **request_id:** Unique identifier for each API request (included in logs, not in client response by default)
- **trace_id:** Identifier for distributed request flows (Backend → Database → External APIs)
- **span_id:** Identifier for individual operation within a trace
- **timestamp:** ISO 8601 format for temporal correlation
- **context:** User ID, warehouse ID, booking ID where applicable

> **Note:** As per API Blueprint, `request_id` and `timestamp` are NOT included in the canonical error response envelope sent to clients. They are logged server-side for correlation.

### Principle 4: Observability Over Silence

**Comprehensive Logging:**
- All errors must be logged with appropriate severity (ERROR, WARN)
- Include full context: input parameters, system state, error details
- Never suppress errors silently
- Log both error occurrence and recovery attempts

**Metrics Collection:**
- Track error rates by endpoint, service, error type
- Monitor error spikes and anomalies
- Calculate error percentages against total requests
- Set SLO-based thresholds for alerting

### Principle 5: Idempotency by Design

All state-changing operations must be idempotent:
- **Booking Creation:** Use `booking_id` or `booking_number` as idempotency key
- **Status Updates:** Check current state before applying transitions
- **Email/SMS:** Track sent notifications to prevent duplicates

> **Note:** Payment-related idempotency is NOT in MVP v1 scope.

Idempotency prevents duplicate operations during retry scenarios.

### Principle 6: Graceful Degradation Over Total Failure

When a component fails, the system should continue operating with reduced functionality:
- **AI Service Down:** Return search results without AI recommendations
- **Redis Cache Unavailable:** Query database directly (slower but functional)
- **External Maps API Failed:** Use fallback provider or cached map data
- **Email Service Down:** Queue notifications for later delivery

Critical path operations (search, booking submission) must remain functional even when auxiliary systems fail.

## 1.4. Global Error Handling Architecture

The error handling architecture spans all layers of the Self-Storage Aggregator MVP v1:

```
[User/Client]
    â†"
[API Gateway/Nginx] â†' Rate Limit, Routing, Timeouts
    â†"
[NestJS Backend] â†' Validation, Business Logic
    â†"
[Service Layer] â†' Domain Logic, Orchestration
    â†"
[Data Layer: PostgreSQL + Redis] â†' Persistence, Caching
[External: AI, Maps, Email/SMS] â†' External Services
    â†"
[Error Handler] â†' Map to Canonical Format
    â†"
[Logger: Winston/Pino] â†' Structured Logging
[Metrics: Prometheus] â†' Error Metrics
[Alerts: Slack/Email] â†' Operational Alerts
```

### Layer-by-Layer Error Handling

**1. API Gateway Layer (Nginx):**
- **Responsibility:** Request routing, rate limiting, SSL termination
- **Error Types:** 429 Rate Limit Exceeded, 502 Bad Gateway, 504 Gateway Timeout
- **Handling:** Return standard HTTP error responses, log to access logs
- **Failover:** If backend is down, return 503 Service Unavailable

**2. Backend API Layer (NestJS):**
- **Responsibility:** Input validation, business logic orchestration, error aggregation
- **Error Types:** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity
- **Handling:** Catch all exceptions via global exception filter, map to canonical error response format
- **Correlation:** Generate request_id in middleware, attach to all logs (not client responses)

**3. Service Layer (Business Logic):**
- **Responsibility:** Execute business operations, coordinate database and external service calls
- **Error Types:** Domain errors (BoxNotAvailable, BookingConflict), service errors (DatabaseQueryFailed, CacheUnavailable)
- **Handling:** Throw typed exceptions, implement retry logic for transient failures
- **Resilience:** Circuit breaker for external APIs, fallback for non-critical services

**4. Data Layer (PostgreSQL + Redis):**
- **Responsibility:** Data persistence, query execution, caching
- **Error Types:** Connection timeout, deadlock, unique constraint violation, query timeout
- **Handling:** Automatic reconnection for transient errors, transaction rollback on failure
- **Monitoring:** Track query latency, connection pool saturation, cache hit rates

**5. External Services Layer:**
- **Responsibility:** AI recommendations (Box Size Finder ONLY), geolocation, email/SMS delivery
- **Error Types:** HTTP 429 (rate limit), 500 (service error), timeout, invalid response
- **Handling:** Retry with exponential backoff, circuit breaker after threshold, fallback responses
- **Isolation:** External failures must not block critical user flows

**6. Observability Layer:**
- **Responsibility:** Logging, metrics collection, alerting
- **Components:** Winston/Pino for structured logging, Prometheus for metrics, custom alerting
- **Correlation:** All logs include request_id, trace_id, user_id, warehouse_id
- **Alerting:** Trigger on error rate thresholds, response time degradation, availability drops

### Error Flow Example

**Scenario:** User submits a booking request for a box that was just booked by another user.

```
1. User → Gateway: POST /api/v1/bookings
2. Gateway → Backend: Forward request (generates request_id internally)
3. Backend → Backend: Validate input (DTO validation)
4. Backend → Service: createBooking(data)
5. Service → DB: BEGIN TRANSACTION
6. Service → DB: SELECT box WHERE id=5 FOR UPDATE
7. DB → Service: Box data (available_quantity=0)
8. Service: Check availability → FAIL (BoxNotAvailableException)
9. Service → DB: ROLLBACK
10. Service → Logger: ERROR - Box not available (request_id in logs)
11. Service → Backend: Throw BoxNotAvailableException
12. Backend → Filter: Catch exception via GlobalExceptionFilter
13. Filter → Logger: WARN - Business error (error_code: BOX_NOT_AVAILABLE)
14. Filter → Backend: Map to canonical error format
15. Backend → Gateway: HTTP 409 + Canonical Error JSON
16. Gateway → User: HTTP 409 + Error Response
```

**Key Characteristics:**
1. request_id flows through entire call chain (internal only)
2. Error logged at both service and API layers
3. Transaction rolled back to maintain consistency
4. User receives business-friendly error message (Russian)
5. No internal details exposed (table names, query structure)
6. Canonical error format used: `{error_code, http_status, message, details}`

---

# SECTION 2: ERROR TYPES & CATEGORIES

## 2.1. Business Errors

Business errors occur when a request violates domain rules or business constraints, even though the request is technically valid.

### Characteristics

- **HTTP Status:** 409 Conflict or 422 Unprocessable Entity
- **Cause:** Domain-level constraint violation
- **User Impact:** User must take corrective action (select different box, adjust dates)
- **Retry:** Generally not helpful without changing request parameters
- **Logging Level:** WARN (expected business scenario) or INFO
- **Retryable:** âŒ **NO** - 4xx errors are never retryable

### Common Business Errors in MVP

| Error Code | HTTP Status | Description | User Action | Example Scenario |
|------------|-------------|-------------|-------------|------------------|
| `BOX_NOT_AVAILABLE` | 409 | Requested box is already booked or reserved | Select another box | User attempts to book Box #5, but it was just reserved |
| `BOOKING_CONFLICT` | 409 | Booking dates overlap with existing reservation | Adjust dates | Same box booked for Dec 1-15, user tries Dec 10-20 |
| `WAREHOUSE_INACTIVE` | 422 | Warehouse is not accepting bookings | Select another warehouse | Operator has paused bookings for maintenance |
| `INVALID_DATE_RANGE` | 422 | Start date is after end date, or duration < 1 month | Fix date selection | User selects end_date before start_date |
| `MINIMUM_DURATION_NOT_MET` | 422 | Rental period is less than warehouse minimum | Extend duration | Warehouse requires 1 month minimum, user selects 2 weeks |
| `OPERATOR_NOT_VERIFIED` | 403 | Operator account not yet approved | Wait for approval | New operator tries to publish warehouse before verification |
| `EMAIL_ALREADY_EXISTS` | 409 | Duplicate email on registration | Use different email | User attempts to register with existing email |

### Error Response Example (Canonical Format)

```json
{
  "error_code": "BOX_NOT_AVAILABLE",
  "http_status": 409,
  "message": "К сожалению, выбранный бокс уже забронирован",
  "details": {
    "box_id": "770e8400-e29b-41d4-a716-446655440002",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440001",
    "suggested_alternatives": [
      "770e8400-e29b-41d4-a716-446655440007",
      "770e8400-e29b-41d4-a716-446655440008"
    ]
  }
}
```

### Handling Strategy

```typescript
class BookingService {
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const box = await this.boxRepository.findById(data.box_id);
    
    if (box.available_quantity === 0) {
      // Business error - throw domain exception
      throw new BoxNotAvailableException({
        box_id: data.box_id,
        warehouse_id: box.warehouse_id,
        suggested_alternatives: await this.findAlternativeBoxes(box)
      });
    }
    
    // Continue with booking creation...
  }
}
```

## 2.2. Validation Errors

Validation errors occur when input data does not conform to expected formats, types, or constraints.

### Characteristics

- **HTTP Status:** 400 Bad Request
- **Cause:** Malformed request, missing required fields, type mismatches
- **User Impact:** User must fix input and resubmit
- **Retry:** Not helpful without correcting input
- **Logging Level:** INFO or DEBUG (client error, not system issue)
- **Retryable:** âŒ **NO** - 4xx errors are never retryable

### Validation Error Categories

**1. Schema Validation:**
- Missing required fields (`email`, `name`, `phone`)
- Type mismatches (`price_per_month` is string instead of number)
- Invalid enum values (`size` is "XXL" when only S/M/L/XL are valid)

**2. Format Validation:**
- Invalid email format: `user@invalid`
- Invalid phone format: `123` (too short)
- Invalid date format: `2025-13-45` (invalid month/day)
- Invalid UUID format for identifiers

**3. Range Validation:**
- Price is negative: `price_per_month: -500`
- Duration exceeds maximum: `duration_months: 100`
- String length violations: `name` is 300 characters when max is 255

**4. Business Constraint Validation:**
- Start date is in the past
- End date is before start date
- Box dimensions are physically impossible (e.g., 0 width)

### Common Validation Errors

| Error Code | HTTP Status | Description | Example |
|------------|-------------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Generic validation failure | Multiple fields invalid |
| `MISSING_REQUIRED_FIELD` | 400 | Required field not provided | `email` is null |
| `INVALID_FORMAT` | 400 | Field does not match expected format | `phone: "abc"` |
| `INVALID_TYPE` | 400 | Field type mismatch | `price_per_month: "expensive"` |
| `VALUE_OUT_OF_RANGE` | 400 | Value exceeds allowed range | `duration_months: -5` |
| `INVALID_ENUM_VALUE` | 400 | Enum field has disallowed value | `size: "XXXL"` |

### Error Response Example (Canonical Format)

```json
{
  "error_code": "VALIDATION_ERROR",
  "http_status": 400,
  "message": "Ошибка валидации одного или нескольких полей",
  "details": [
    {
      "field": "email",
      "error": "Неверный формат email",
      "value": "invalid-email"
    },
    {
      "field": "price_per_month",
      "error": "Цена должна быть положительным числом",
      "value": -100
    }
  ]
}
```

### NestJS Validation Implementation

```typescript
// dto/create-booking.dto.ts
import { IsUUID, IsDateString, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  box_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @Min(1)
  @Max(60)
  duration_months: number;
}

// Global validation pipe (main.ts)
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Map to canonical error format
      const details = errors.map(error => ({
        field: error.property,
        error: Object.values(error.constraints || {})[0],
        value: error.value
      }));
      
      return new BadRequestException({
        error_code: 'VALIDATION_ERROR',
        http_status: 400,
        message: 'Ошибка валидации одного или нескольких полей',
        details
      });
    }
  })
);
```

## 2.3. Infrastructure Errors

Infrastructure errors occur due to system-level failures unrelated to business logic.

### Characteristics

- **HTTP Status:** 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable
- **Cause:** Database failure, cache unavailability, disk/memory exhaustion
- **User Impact:** Temporary inability to complete operation
- **Retry:** Often helpful after brief delay (transient failures)
- **Logging Level:** ERROR (system malfunction)
- **Retryable:** âœ… **YES** - 5xx errors are retryable with backoff

### Common Infrastructure Errors

| Error Code | HTTP Status | Description | Example |
|------------|-------------|-------------|---------|
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled exception, logic error | Null pointer, unexpected state |
| `DATABASE_ERROR` | 500 | Database connection/query failure | Connection timeout, deadlock |
| `CACHE_UNAVAILABLE` | 500 | Redis connection failure | Cache server down |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service failure | Maps API down |
| `AI_SERVICE_UNAVAILABLE` | 502 | AI API timeout/error | AI provider unreachable |
| `SERVICE_UNAVAILABLE` | 503 | Temporary outage, maintenance | Planned downtime |
| `REQUEST_TIMEOUT` | 504 | Request took too long | Slow query, external API delay |

### Error Response Example (Canonical Format)

```json
{
  "error_code": "DATABASE_ERROR",
  "http_status": 500,
  "message": "Ошибка базы данных. Попробуйте позже"
}
```

> **Security Note:** Never include stack traces, SQL queries, or internal details in 5xx error responses sent to clients.

### Internal Logging (Full Details)

```json
{
  "level": "ERROR",
  "timestamp": "2025-12-15T14:50:00.123Z",
  "request_id": "req_abc123",
  "error_type": "DatabaseConnectionError",
  "message": "Connection timeout after configured threshold",
  "stack": "DatabaseConnectionError: Connection timeout\n    at ...",
  "context": {
    "service": "booking-service",
    "method": "createBooking",
    "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "input": {
      "box_id": "770e8400-e29b-41d4-a716-446655440002",
      "start_date": "2025-12-20"
    }
  }
}
```

## 2.4. Network Errors

Network errors occur due to connectivity issues between system components.

### Characteristics

- **HTTP Status:** 502 Bad Gateway, 504 Gateway Timeout
- **Cause:** DNS failure, connection refused, network timeout
- **User Impact:** Temporary service unavailability
- **Retry:** Highly recommended with exponential backoff
- **Logging Level:** ERROR
- **Retryable:** âœ… **YES** - Network errors are transient and retryable

### Common Network Errors

| Error Code | HTTP Status | Description | Example |
|------------|-------------|-------------|---------|
| `EXTERNAL_SERVICE_TIMEOUT` | 504 | External API did not respond in time | Maps API timeout |
| `CONNECTION_REFUSED` | 502 | Unable to connect to service | Service port closed |
| `DNS_RESOLUTION_FAILED` | 502 | Unable to resolve hostname | Invalid domain |
| `SSL_CERTIFICATE_ERROR` | 502 | SSL/TLS handshake failed | Expired certificate |

### Error Response Example (Canonical Format)

```json
{
  "error_code": "EXTERNAL_SERVICE_TIMEOUT",
  "http_status": 504,
  "message": "Превышено время ожидания ответа от внешнего сервиса"
}
```

## 2.5. External API Errors

Errors returned by third-party APIs (Maps, Email/SMS, AI providers).

### Characteristics

- **HTTP Status:** 502 Bad Gateway (mapping external errors)
- **Cause:** Rate limit, authentication failure, service outage
- **User Impact:** Feature degradation or temporary unavailability
- **Retry:** Depends on error type (rate limits → wait, 5xx → retry)
- **Logging Level:** ERROR or WARN
- **Retryable:** Conditional (5xx → YES, 4xx → NO)

### Common External API Errors

| External Service | Error Code | HTTP Status | Description |
|-----------------|------------|-------------|-------------|
| Google Maps | `MAPS_API_RATE_LIMIT` | 502 | Rate limit exceeded |
| Google Maps | `MAPS_API_ERROR` | 502 | Generic Maps API failure |
| AI Service | `AI_SERVICE_UNAVAILABLE` | 502 | AI provider down or timeout |
| Email/SMS | `NOTIFICATION_DELIVERY_FAILED` | 502 | Email/SMS send failure |

### Fallback Strategy

```typescript
class MapsService {
  async geocode(address: string): Promise<Coordinates> {
    try {
      // Try Google Maps (primary)
      return await this.yandexMapsClient.geocode(address);
    } catch (error) {
      this.logger.warn('Google Maps failed, trying Google Maps', { error });
      
      try {
        // Fallback to Google Maps
        return await this.googleMapsClient.geocode(address);
      } catch (fallbackError) {
        this.logger.error('All geocoding providers failed', { fallbackError });
        throw new MapsAPIException();
      }
    }
  }
}
```

### Error Response Example (Canonical Format)

```json
{
  "error_code": "AI_SERVICE_UNAVAILABLE",
  "http_status": 502,
  "message": "AI-рекомендации временно недоступны. Попробуйте позже",
  "details": {
    "fallback_available": false
  }
}
```

---

# SECTION 3: API ERROR STANDARDS

## 3.1. Canonical Error Response Format

> **SOURCE OF TRUTH:** `api_design_blueprint_mvp_v1_CANONICAL.md`

All API error responses follow this **canonical format**:

```json
{
  "error_code": "BOX_NOT_AVAILABLE",
  "http_status": 409,
  "message": "К сожалению, выбранный бокс уже забронирован",
  "details": {
    "box_id": "770e8400-e29b-41d4-a716-446655440002",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440001",
    "suggested_alternatives": [
      "770e8400-e29b-41d4-a716-446655440007"
    ]
  }
}
```

### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error_code` | string | âœ… | Machine-readable error identifier (UPPER_SNAKE_CASE) |
| `http_status` | integer | âœ… | HTTP status code (must match response status) |
| `message` | string | âœ… | User-safe error message (localized, Russian for MVP) |
| `details` | object | âŒ | Additional context (structure varies by error type) |

### Rules

1. **`error_code` must be UPPER_SNAKE_CASE**
   - âœ… Correct: `BOX_NOT_AVAILABLE`, `INVALID_DATE_RANGE`
   - âŒ Wrong: `boxNotAvailable`, `box_not_available`

2. **`http_status` must match the HTTP response status**
   - If HTTP response is 409, `http_status: 409`

3. **`message` must be user-friendly (Russian for MVP)**
   - No technical jargon, stack traces, or internal details
   - Polite and professional tone
   - Actionable when possible

4. **`details` is optional**
   - Include only information useful for error resolution
   - Do not expose sensitive data (passwords, tokens)
   - Structure varies by error type

### What's NOT in the Canonical Format

âŒ **REMOVED FROM CANONICAL FORMAT:**
- `success: false` (redundant, error implied by HTTP status)
- Nested `error` object (flat structure preferred)
- `request_id` (logged server-side, not exposed to clients)
- `timestamp` (logged server-side, not exposed to clients)
- `path` (logged server-side, not exposed to clients)

> **Rationale:** The canonical format is minimal and focused on client-actionable information. Internal correlation IDs (`request_id`, `timestamp`) are logged server-side for debugging but not exposed in the API response.

## 3.2. Error Code Naming Conventions

All error codes follow **UPPER_SNAKE_CASE** naming:

```typescript
// âœ… CORRECT
"BOX_NOT_AVAILABLE"
"INVALID_CREDENTIALS"
"RATE_LIMIT_EXCEEDED"
"DATABASE_ERROR"

// âŒ WRONG
"box_not_available"   // lowercase
"BoxNotAvailable"     // PascalCase
"boxNotAvailable"     // camelCase
```

**Structure:**
- Use clear, descriptive names
- Be specific but not overly granular
- Namespace by domain when applicable

**Examples by Category:**

| Category | Example Codes |
|----------|---------------|
| Authentication | `TOKEN_EXPIRED`, `INVALID_CREDENTIALS`, `TOKEN_MISSING` |
| Authorization | `INSUFFICIENT_PERMISSIONS`, `OPERATOR_NOT_VERIFIED` |
| Resources | `WAREHOUSE_NOT_FOUND`, `BOX_NOT_FOUND`, `BOOKING_NOT_FOUND` |
| Business Logic | `BOX_NOT_AVAILABLE`, `BOOKING_CONFLICT`, `INVALID_DATE_RANGE` |
| Infrastructure | `DATABASE_ERROR`, `CACHE_UNAVAILABLE`, `SERVICE_UNAVAILABLE` |
| External APIs | `AI_SERVICE_UNAVAILABLE`, `MAPS_API_ERROR` |
| Rate Limiting | `RATE_LIMIT_EXCEEDED` |

## 3.3. HTTP Status Code Mapping

### Complete Status Code Reference

| Status Code | Name | When to Use | Example Error Code | Retryable |
|-------------|------|-------------|-------------------|-----------|
| **400** | Bad Request | Validation failure, malformed request | `VALIDATION_ERROR`, `INVALID_FORMAT` | âŒ NO |
| **401** | Unauthorized | Missing or invalid authentication | `TOKEN_EXPIRED`, `INVALID_CREDENTIALS` | âŒ NO |
| **403** | Forbidden | Authenticated but lacks permissions | `INSUFFICIENT_PERMISSIONS` | âŒ NO |
| **404** | Not Found | Resource does not exist | `WAREHOUSE_NOT_FOUND`, `BOOKING_NOT_FOUND` | âŒ NO |
| **409** | Conflict | Resource conflict, business rule violation | `BOX_NOT_AVAILABLE`, `EMAIL_ALREADY_EXISTS` | âŒ NO |
| **422** | Unprocessable Entity | Valid syntax but semantic error | `INVALID_DATE_RANGE`, `MINIMUM_DURATION_NOT_MET` | âŒ NO |
| **429** | Too Many Requests | Rate limit exceeded | `RATE_LIMIT_EXCEEDED` | âœ… YES (after delay) |
| **500** | Internal Server Error | Unhandled exception, logic error | `INTERNAL_SERVER_ERROR`, `DATABASE_ERROR` | âœ… YES |
| **502** | Bad Gateway | External service failure | `EXTERNAL_SERVICE_ERROR`, `AI_SERVICE_UNAVAILABLE` | âœ… YES |
| **503** | Service Unavailable | Temporary outage, maintenance | `SERVICE_UNAVAILABLE` | âœ… YES |
| **504** | Gateway Timeout | Request timeout | `REQUEST_TIMEOUT`, `EXTERNAL_SERVICE_TIMEOUT` | âœ… YES |

### Retry Decision Logic (Canonical)

```typescript
function isRetryable(httpStatus: number): boolean {
  // 4xx errors - Client errors, never retry
  if (httpStatus >= 400 && httpStatus < 500) {
    // Exception: 429 Rate Limit - retry after delay
    return httpStatus === 429;
  }
  
  // 5xx errors - Server errors, always retryable
  if (httpStatus >= 500 && httpStatus < 600) {
    return true;
  }
  
  return false;
}
```

### Status Code Selection Logic

```typescript
function getHTTPStatus(error: AppError): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof AuthenticationError) return 401;
  if (error instanceof AuthorizationError) return 403;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof BusinessLogicError) return 422;
  if (error instanceof RateLimitError) return 429;
  if (error instanceof ExternalServiceError) return 502;
  if (error instanceof ServiceUnavailableError) return 503;
  if (error instanceof TimeoutError) return 504;
  
  return 500; // Default for unexpected errors
}
```

## 3.4. MVP v1 Error Codes (Complete List)

### Authentication & Authorization Errors (4xx)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `TOKEN_MISSING` | 401 | Токен авторизации отсутствует | No Authorization header | âŒ NO |
| `TOKEN_INVALID` | 401 | Недействительный токен авторизации | Malformed or tampered JWT | âŒ NO |
| `TOKEN_EXPIRED` | 401 | Ваша сессия истекла. Войдите снова | JWT expired | âŒ NO |
| `INVALID_CREDENTIALS` | 401 | Неверный email или пароль | Login failure | âŒ NO |
| `INSUFFICIENT_PERMISSIONS` | 403 | У вас нет прав для выполнения этого действия | User lacks permission | âŒ NO |
| `OPERATOR_NOT_VERIFIED` | 403 | Ваш аккаунт оператора ожидает проверки | New operator not approved | âŒ NO |
| `RESOURCE_OWNERSHIP` | 403 | Доступ только для владельца ресурса | User doesn't own resource | âŒ NO |

### Resource Errors (404)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `WAREHOUSE_NOT_FOUND` | 404 | Склад не найден | Warehouse ID doesn't exist | âŒ NO |
| `BOX_NOT_FOUND` | 404 | Бокс не найден | Box ID doesn't exist | âŒ NO |
| `BOOKING_NOT_FOUND` | 404 | Бронирование не найдено | Booking ID doesn't exist | âŒ NO |
| `USER_NOT_FOUND` | 404 | Пользователь не найден | User ID doesn't exist | âŒ NO |
| `REVIEW_NOT_FOUND` | 404 | Отзыв не найден | Review ID doesn't exist | âŒ NO |
| `LEAD_NOT_FOUND` | 404 | Лид не найден | CRM Lead ID doesn't exist | âŒ NO |

### Business Logic Errors (409, 422)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `BOX_NOT_AVAILABLE` | 409 | Выбранный бокс уже забронирован | Box reserved by another user | âŒ NO |
| `EMAIL_ALREADY_EXISTS` | 409 | Email уже зарегистрирован | Duplicate email on registration | âŒ NO |
| `BOOKING_CONFLICT` | 409 | Даты пересекаются с существующим бронированием | Date overlap | âŒ NO |
| `INVALID_DATE_RANGE` | 422 | Дата окончания должна быть после даты начала | end_date < start_date | âŒ NO |
| `START_DATE_IN_PAST` | 422 | Дата начала не может быть в прошлом | start_date < today | âŒ NO |
| `MINIMUM_DURATION_NOT_MET` | 422 | Минимальный срок аренды: 1 месяц | duration < 1 month | âŒ NO |
| `WAREHOUSE_INACTIVE` | 422 | Склад временно не принимает бронирования | Warehouse disabled | âŒ NO |
| `CANNOT_CANCEL_BOOKING` | 422 | Невозможно отменить бронирование в статусе '{status}' | Invalid status transition | âŒ NO |
| `CANNOT_MODIFY_BOOKING` | 422 | Невозможно изменить бронирование в статусе '{status}' | Invalid status | âŒ NO |

### Validation Errors (400)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `VALIDATION_ERROR` | 400 | Ошибка валидации одного или нескольких полей | Multiple validation failures | âŒ NO |
| `MISSING_REQUIRED_FIELD` | 400 | Обязательное поле отсутствует | Required field not provided | âŒ NO |
| `INVALID_FORMAT` | 400 | Неверный формат данных | Invalid email, phone, etc. | âŒ NO |
| `INVALID_TYPE` | 400 | Неверный тип данных | Type mismatch | âŒ NO |
| `VALUE_OUT_OF_RANGE` | 400 | Значение вне допустимого диапазона | Range violation | âŒ NO |
| `INVALID_ENUM_VALUE` | 400 | Недопустимое значение перечисления | Invalid enum value | âŒ NO |

### Infrastructure Errors (5xx)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `INTERNAL_SERVER_ERROR` | 500 | Внутренняя ошибка сервера. Мы уже работаем над решением | Unhandled exception | âœ… YES |
| `DATABASE_ERROR` | 500 | Ошибка базы данных. Попробуйте позже | DB connection/query failure | âœ… YES |
| `CACHE_UNAVAILABLE` | 500 | Сервис кеширования временно недоступен | Redis connection failure | âœ… YES |
| `EXTERNAL_SERVICE_ERROR` | 502 | Внешний сервис временно недоступен | External API failure | âœ… YES |
| `AI_SERVICE_UNAVAILABLE` | 502 | AI-рекомендации временно недоступны. Попробуйте позже | AI API timeout/error | âœ… YES |
| `MAPS_API_ERROR` | 502 | Сервис геолокации временно недоступен | Maps API failure | âœ… YES |
| `NOTIFICATION_DELIVERY_FAILED` | 502 | Не удалось отправить уведомление | Email/SMS send failure | âœ… YES |
| `SERVICE_UNAVAILABLE` | 503 | Сервис временно недоступен. Попробуйте через несколько минут | Maintenance mode | âœ… YES |
| `REQUEST_TIMEOUT` | 504 | Превышено время ожидания. Попробуйте снова | Request took too long | âœ… YES |
| `EXTERNAL_SERVICE_TIMEOUT` | 504 | Превышено время ожидания ответа от внешнего сервиса | External API timeout | âœ… YES |

### Rate Limiting Errors (429)

| Error Code | HTTP Status | Message (Russian) | Scenario | Retryable |
|------------|-------------|-------------------|----------|-----------|
| `RATE_LIMIT_EXCEEDED` | 429 | Превышен лимит запросов. Попробуйте через {retry_after} секунд | Too many requests | âœ… YES (after delay) |

### Error Response Examples (Canonical Format)

**Authentication Error:**
```json
{
  "error_code": "TOKEN_EXPIRED",
  "http_status": 401,
  "message": "Ваша сессия истекла. Войдите снова"
}
```

**Business Logic Error:**
```json
{
  "error_code": "BOX_NOT_AVAILABLE",
  "http_status": 409,
  "message": "К сожалению, выбранный бокс уже забронирован",
  "details": {
    "box_id": "770e8400-e29b-41d4-a716-446655440002",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440001",
    "suggested_alternatives": [
      "770e8400-e29b-41d4-a716-446655440007",
      "770e8400-e29b-41d4-a716-446655440008"
    ]
  }
}
```

**Validation Error:**
```json
{
  "error_code": "VALIDATION_ERROR",
  "http_status": 400,
  "message": "Ошибка валидации одного или нескольких полей",
  "details": [
    {
      "field": "email",
      "error": "Неверный формат email",
      "value": "invalid-email"
    },
    {
      "field": "start_date",
      "error": "Дата начала не может быть в прошлом",
      "value": "2025-01-01"
    }
  ]
}
```

**Infrastructure Error:**
```json
{
  "error_code": "DATABASE_ERROR",
  "http_status": 500,
  "message": "Ошибка базы данных. Попробуйте позже"
}
```

**Rate Limit Error:**
```json
{
  "error_code": "RATE_LIMIT_EXCEEDED",
  "http_status": 429,
  "message": "Превышен лимит запросов. Попробуйте через 45 секунд",
  "details": {
    "limit": 100,
    "window_seconds": 60,
    "retry_after": 45
  }
}
```

---

# SECTION 4: BACKEND ERROR PROCESSING

## 4.1. Global Exception Filter

All exceptions are caught by a global exception filter and mapped to the canonical error response format.

```typescript
// filters/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Generate request_id for internal logging (not exposed to client)
    const requestId = request.headers['x-request-id'] as string || this.generateRequestId();
    
    // Determine HTTP status and error response
    const { status, errorResponse } = this.buildCanonicalErrorResponse(
      exception,
      request.path
    );
    
    // Log error with full context (server-side only)
    this.logError(exception, request, requestId, status);
    
    // Send canonical error response to client
    response.status(status).json(errorResponse);
  }

  private buildCanonicalErrorResponse(
    exception: any,
    path: string
  ): { status: number; errorResponse: any } {
    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // If exception already has canonical format, use it
      if (this.isCanonicalFormat(exceptionResponse)) {
        return {
          status,
          errorResponse: exceptionResponse
        };
      }
      
      // Map to canonical format
      return {
        status,
        errorResponse: {
          error_code: this.getErrorCodeFromStatus(status),
          http_status: status,
          message: typeof exceptionResponse === 'string' 
            ? exceptionResponse 
            : exceptionResponse['message'] || 'An error occurred'
        }
      };
    }
    
    // Handle unexpected errors (500)
    return {
      status: 500,
      errorResponse: {
        error_code: 'INTERNAL_SERVER_ERROR',
        http_status: 500,
        message: 'Внутренняя ошибка сервера. Мы уже работаем над решением'
      }
    };
  }

  private isCanonicalFormat(response: any): boolean {
    return (
      typeof response === 'object' &&
      'error_code' in response &&
      'http_status' in response &&
      'message' in response
    );
  }

  private getErrorCodeFromStatus(status: number): string {
    const statusMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT'
    };
    
    return statusMap[status] || 'INTERNAL_SERVER_ERROR';
  }

  private logError(
    exception: any,
    request: Request,
    requestId: string,
    status: number
  ): void {
    const logLevel = status >= 500 ? 'ERROR' : 'WARN';
    
    const logPayload = {
      level: logLevel,
      request_id: requestId,
      method: request.method,
      path: request.url,
      status,
      user_id: request['user']?.id,
      error_type: exception.constructor.name,
      error_message: exception.message,
      stack: status >= 500 ? exception.stack : undefined
    };
    
    if (logLevel === 'ERROR') {
      this.logger.error(JSON.stringify(logPayload));
    } else {
      this.logger.warn(JSON.stringify(logPayload));
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
```

### Registration in main.ts

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  await app.listen(3000);
}
bootstrap();
```

## 4.2. Custom Domain Exceptions

Create typed exceptions for business logic errors.

```typescript
// exceptions/box-not-available.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BoxNotAvailableException extends HttpException {
  constructor(details?: any) {
    super(
      {
        error_code: 'BOX_NOT_AVAILABLE',
        http_status: 409,
        message: 'К сожалению, выбранный бокс уже забронирован',
        details
      },
      HttpStatus.CONFLICT
    );
  }
}

// exceptions/invalid-date-range.exception.ts
export class InvalidDateRangeException extends HttpException {
  constructor(details?: any) {
    super(
      {
        error_code: 'INVALID_DATE_RANGE',
        http_status: 422,
        message: 'Дата окончания должна быть после даты начала',
        details
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}
```

### Usage in Service Layer

```typescript
// services/booking.service.ts
import { Injectable } from '@nestjs/common';
import { BoxNotAvailableException } from '../exceptions/box-not-available.exception';

@Injectable()
export class BookingService {
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const box = await this.boxRepository.findById(dto.box_id);
    
    if (!box || box.available_quantity === 0) {
      throw new BoxNotAvailableException({
        box_id: dto.box_id,
        warehouse_id: box?.warehouse_id,
        suggested_alternatives: await this.findAlternativeBoxes(box)
      });
    }
    
    // Continue with booking creation...
  }
}
```

## 4.3. Validation Error Handling

NestJS validation with canonical error format.

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const details = errors.map(error => ({
        field: error.property,
        error: Object.values(error.constraints || {})[0],
        value: error.value
      }));
      
      return new HttpException(
        {
          error_code: 'VALIDATION_ERROR',
          http_status: 400,
          message: 'Ошибка валидации одного или нескольких полей',
          details
        },
        HttpStatus.BAD_REQUEST
      );
    }
  })
);
```

## 4.4. Service-Level Error Handling

```typescript
// services/warehouse.service.ts
@Injectable()
export class WarehouseService {
  constructor(
    private readonly warehouseRepo: WarehouseRepository,
    private readonly logger: Logger
  ) {}

  async getWarehouse(id: string): Promise<Warehouse> {
    try {
      const warehouse = await this.warehouseRepo.findById(id);
      
      if (!warehouse) {
        throw new HttpException(
          {
            error_code: 'WAREHOUSE_NOT_FOUND',
            http_status: 404,
            message: 'Склад не найден',
            details: { warehouse_id: id }
          },
          HttpStatus.NOT_FOUND
        );
      }
      
      return warehouse;
    } catch (error) {
      // If it's already an HttpException, re-throw
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log unexpected errors
      this.logger.error('Unexpected error in getWarehouse', {
        error,
        warehouse_id: id
      });
      
      // Throw generic 500 error
      throw new HttpException(
        {
          error_code: 'INTERNAL_SERVER_ERROR',
          http_status: 500,
          message: 'Внутренняя ошибка сервера. Мы уже работаем над решением'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

---

# SECTION 5: DATABASE ERROR HANDLING

## 5.1. Connection Pool Management

PostgreSQL connection pool configuration and error handling.

```typescript
// database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      
      // Connection pool configuration
      extra: {
        // Connection pool size managed by infrastructure team
        // Refer to SRE configuration for production values
        connectionTimeoutMillis: 5000,  // Conceptual - actual value in SRE config
        idleTimeoutMillis: 30000,       // Conceptual - actual value in SRE config
        max: 20                          // Conceptual - actual value in SRE config
      },
      
      // Automatic reconnection on connection loss
      autoReconnect: true,
      
      // Connection retry strategy
      retryAttempts: 3,
      retryDelay: 3000,
      
      // Logging
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
```

### Connection Error Handling

```typescript
// services/database-health.service.ts
@Injectable()
export class DatabaseHealthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private logger: Logger
  ) {}

  async checkConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database connection check failed', { error });
      return false;
    }
  }

  async handleConnectionError(error: any): Promise<void> {
    this.logger.error('Database connection error', {
      error_code: error.code,
      message: error.message
    });
    
    // Attempt reconnection
    try {
      await this.dataSource.initialize();
      this.logger.info('Database reconnection successful');
    } catch (reconnectError) {
      this.logger.error('Database reconnection failed', { reconnectError });
      throw new HttpException(
        {
          error_code: 'DATABASE_ERROR',
          http_status: 500,
          message: 'Ошибка базы данных. Попробуйте позже'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

## 5.2. Deadlock Detection & Retry

PostgreSQL deadlock handling with automatic retry.

```typescript
// database/deadlock-retry.decorator.ts
export function RetryOnDeadlock(maxRetries = 3) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: any;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          // PostgreSQL deadlock error code: 40P01
          if (error.code === '40P01' && attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 100; // Exponential backoff
            
            this.logger?.warn('Deadlock detected, retrying', {
              attempt: attempt + 1,
              maxRetries,
              delay
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
            lastError = error;
            continue;
          }
          
          throw error;
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}
```

### Usage

```typescript
// services/booking.service.ts
@Injectable()
export class BookingService {
  @RetryOnDeadlock(3)
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    return await this.dataSource.transaction(async (manager) => {
      // Lock box row to prevent concurrent bookings
      const box = await manager
        .createQueryBuilder(Box, 'box')
        .where('box.id = :id', { id: dto.box_id })
        .setLock('pessimistic_write')
        .getOne();
      
      if (!box || box.available_quantity === 0) {
        throw new BoxNotAvailableException({ box_id: dto.box_id });
      }
      
      // Decrement available quantity
      box.available_quantity -= 1;
      await manager.save(box);
      
      // Create booking
      const booking = manager.create(Booking, dto);
      return await manager.save(booking);
    });
  }
}
```

## 5.3. Query Timeout Handling

Handle slow queries gracefully.

```typescript
// database/query-timeout.interceptor.ts
@Injectable()
export class QueryTimeoutInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    
    // Query timeout threshold (managed by SRE)
    const QUERY_TIMEOUT_THRESHOLD = 5000; // Conceptual value
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        if (duration > QUERY_TIMEOUT_THRESHOLD) {
          this.logger.warn('Slow query detected', {
            path: request.url,
            method: request.method,
            duration_ms: duration
          });
        }
      }),
      catchError((error) => {
        // PostgreSQL query timeout error code: 57014
        if (error.code === '57014') {
          throw new HttpException(
            {
              error_code: 'REQUEST_TIMEOUT',
              http_status: 504,
              message: 'Превышено время ожидания. Попробуйте снова'
            },
            HttpStatus.GATEWAY_TIMEOUT
          );
        }
        
        throw error;
      })
    );
  }
}
```

## 5.4. Constraint Violation Handling

Handle database constraint violations (unique, foreign key, check constraints).

```typescript
// database/constraint-error.handler.ts
export class ConstraintErrorHandler {
  static handle(error: any): HttpException {
    // Unique constraint violation (PostgreSQL code: 23505)
    if (error.code === '23505') {
      const field = this.extractFieldFromConstraint(error.constraint);
      return new HttpException(
        {
          error_code: 'DUPLICATE_ENTRY',
          http_status: 409,
          message: `${field} уже существует`,
          details: {
            field,
            constraint: error.constraint
          }
        },
        HttpStatus.CONFLICT
      );
    }
    
    // Foreign key violation (PostgreSQL code: 23503)
    if (error.code === '23503') {
      return new HttpException(
        {
          error_code: 'INVALID_REFERENCE',
          http_status: 400,
          message: 'Ссылка на несуществующий ресурс',
          details: {
            constraint: error.constraint
          }
        },
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Not null violation (PostgreSQL code: 23502)
    if (error.code === '23502') {
      return new HttpException(
        {
          error_code: 'MISSING_REQUIRED_FIELD',
          http_status: 400,
          message: 'Обязательное поле отсутствует',
          details: {
            field: error.column
          }
        },
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Generic database error
    return new HttpException(
      {
        error_code: 'DATABASE_ERROR',
        http_status: 500,
        message: 'Ошибка базы данных. Попробуйте позже'
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
  
  private static extractFieldFromConstraint(constraint: string): string {
    // Example: "users_email_key" â†' "email"
    const match = constraint.match(/^.*_(.+)_key$/);
    return match ? match[1] : 'field';
  }
}
```

### Usage in Repository

```typescript
// repositories/user.repository.ts
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private logger: Logger
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      const user = this.repo.create(data);
      return await this.repo.save(user);
    } catch (error) {
      this.logger.error('User creation failed', { error, data });
      throw ConstraintErrorHandler.handle(error);
    }
  }
}
```

## 5.5. Transaction Rollback

Ensure data consistency with proper transaction handling.

```typescript
// services/booking.service.ts
@Injectable()
export class BookingService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private logger: Logger
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Lock box for update
      const box = await queryRunner.manager
        .createQueryBuilder(Box, 'box')
        .where('box.id = :id', { id: dto.box_id })
        .setLock('pessimistic_write')
        .getOne();
      
      if (!box || box.available_quantity === 0) {
        throw new BoxNotAvailableException({ box_id: dto.box_id });
      }
      
      // Decrement quantity
      box.available_quantity -= 1;
      await queryRunner.manager.save(box);
      
      // Create booking
      const booking = queryRunner.manager.create(Booking, dto);
      await queryRunner.manager.save(booking);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      this.logger.info('Booking created successfully', {
        booking_id: booking.id,
        box_id: dto.box_id
      });
      
      return booking;
      
    } catch (error) {
      // Rollback transaction on any error
      await queryRunner.rollbackTransaction();
      
      this.logger.error('Booking creation failed, transaction rolled back', {
        error,
        dto
      });
      
      throw error;
      
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
```

---

# SECTION 6: SERVICE RESILIENCE PATTERNS

## 6.1. Idempotency

Ensure operations can be safely retried without side effects.

### Idempotency Key Generation

```typescript
// services/idempotency.service.ts
@Injectable()
export class IdempotencyService {
  constructor(private cacheManager: Cache) {}

  async checkIdempotency(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async storeIdempotencyResult(key: string, result: any): Promise<void> {
    // Store result for idempotency window (managed by SRE)
    await this.cacheManager.set(key, result, 86400000); // Conceptual: 24h
  }
}
```

### Idempotent Booking Creation

```typescript
// services/booking.service.ts
@Injectable()
export class BookingService {
  constructor(
    private idempotencyService: IdempotencyService,
    private logger: Logger
  ) {}

  async createBooking(dto: CreateBookingDto, idempotencyKey?: string): Promise<Booking> {
    // Check for duplicate request using idempotency key
    if (idempotencyKey) {
      const cachedResult = await this.idempotencyService.checkIdempotency(idempotencyKey);
      
      if (cachedResult) {
        this.logger.info('Idempotent request detected, returning cached result', {
          idempotency_key: idempotencyKey
        });
        return cachedResult;
      }
    }
    
    // Create booking
    const booking = await this.performBookingCreation(dto);
    
    // Store result for future idempotent requests
    if (idempotencyKey) {
      await this.idempotencyService.storeIdempotencyResult(idempotencyKey, booking);
    }
    
    return booking;
  }

  private async performBookingCreation(dto: CreateBookingDto): Promise<Booking> {
    // Actual booking creation logic
    // ...
  }
}
```

### Idempotency Middleware

```typescript
// middleware/idempotency.middleware.ts
@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract idempotency key from header
    const idempotencyKey = req.headers['idempotency-key'] as string;
    
    if (idempotencyKey) {
      req['idempotencyKey'] = idempotencyKey;
    }
    
    next();
  }
}
```

## 6.2. Service Isolation

Isolate failures to prevent cascading errors.

### Circuit Breaker Pattern (Conceptual)

> **Note:** Specific timeout values, failure thresholds, and reset timings are managed by the SRE/Infrastructure team and defined in operational runbooks, not in application code.

```typescript
// resilience/circuit-breaker.service.ts
export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Circuit tripped, requests fail fast
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

@Injectable()
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  
  // Thresholds managed by SRE configuration
  private readonly FAILURE_THRESHOLD: number;
  private readonly SUCCESS_THRESHOLD: number;
  private readonly RESET_TIMEOUT: number;
  
  constructor(private config: CircuitBreakerConfig) {
    this.FAILURE_THRESHOLD = config.failureThreshold;
    this.SUCCESS_THRESHOLD = config.successThreshold;
    this.RESET_TIMEOUT = config.resetTimeout;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit should transition to HALF_OPEN
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.RESET_TIMEOUT) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new HttpException(
          {
            error_code: 'SERVICE_UNAVAILABLE',
            http_status: 503,
            message: 'Сервис временно недоступен. Попробуйте через несколько минут'
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      
      if (this.successCount >= this.SUCCESS_THRESHOLD) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
      }
    }
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.successCount = 0;
      return;
    }
    
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

## 6.3. Graceful Degradation

Maintain partial functionality when components fail.

### Degradation Levels

```typescript
// services/search.service.ts
@Injectable()
export class SearchService {
  constructor(
    private warehouseRepo: WarehouseRepository,
    private aiService: AIService,
    private cacheService: CacheService,
    private logger: Logger
  ) {}

  async search(query: SearchDto): Promise<SearchResult> {
    // Level 1: Full functionality (with AI recommendations)
    try {
      const warehouses = await this.warehouseRepo.search(query);
      const aiRecommendations = await this.aiService.getRecommendations(query);
      
      return {
        warehouses,
        ai_recommendations: aiRecommendations,
        degradation_level: 'FULL'
      };
    } catch (aiError) {
      this.logger.warn('AI service unavailable, degrading to core functionality', {
        error: aiError
      });
    }
    
    // Level 2: Core functionality (search without AI)
    try {
      const warehouses = await this.warehouseRepo.search(query);
      
      return {
        warehouses,
        ai_recommendations: null,
        degradation_level: 'CORE'
      };
    } catch (dbError) {
      this.logger.warn('Database unavailable, degrading to cache', {
        error: dbError
      });
    }
    
    // Level 3: Minimal functionality (cached results)
    try {
      const cachedWarehouses = await this.cacheService.get(`search:${query.hash()}`);
      
      if (cachedWarehouses) {
        return {
          warehouses: cachedWarehouses,
          ai_recommendations: null,
          degradation_level: 'MINIMAL'
        };
      }
    } catch (cacheError) {
      this.logger.error('All search mechanisms failed', {
        error: cacheError
      });
    }
    
    // Complete failure - return error
    throw new HttpException(
      {
        error_code: 'SERVICE_UNAVAILABLE',
        http_status: 503,
        message: 'Сервис поиска временно недоступен. Попробуйте через несколько минут'
      },
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}
```

## 6.4. Fallback Mechanisms

Provide alternative responses when primary services fail.

### AI Service Fallback

```typescript
// services/ai.service.ts
@Injectable()
export class AIService {
  constructor(
    private aiClient: AIClient,
    private circuitBreaker: CircuitBreaker,
    private logger: Logger
  ) {}

  async getBoxSizeRecommendation(query: string): Promise<BoxSizeRecommendation> {
    try {
      return await this.circuitBreaker.execute(async () => {
        return await this.aiClient.getRecommendation(query);
      });
    } catch (error) {
      this.logger.warn('AI service unavailable, using fallback recommendations', {
        error
      });
      
      return this.getFallbackRecommendation(query);
    }
  }

  private getFallbackRecommendation(query: string): BoxSizeRecommendation {
    // Simple rule-based fallback
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('большой') || queryLower.includes('много')) {
      return {
        recommended_size: 'L',
        confidence: 0.5,
        fallback: true
      };
    }
    
    if (queryLower.includes('маленький') || queryLower.includes('мало')) {
      return {
        recommended_size: 'S',
        confidence: 0.5,
        fallback: true
      };
    }
    
    // Default to medium
    return {
      recommended_size: 'M',
      confidence: 0.3,
      fallback: true
    };
  }
}
```

### Maps API Fallback

```typescript
// services/maps.service.ts
@Injectable()
export class MapsService {
  constructor(
    private yandexCircuit: CircuitBreaker,
    private googleCircuit: CircuitBreaker,
    private logger: Logger
  ) {}

  async geocode(address: string): Promise<Coordinates> {
    // Try Google Maps (primary)
    try {
      return await this.yandexCircuit.execute(async () => {
        return await this.yandexMapsClient.geocode(address);
      });
    } catch (yandexError) {
      this.logger.warn('Google Maps failed, trying Google Maps', {
        error: yandexError
      });
    }
    
    // Fallback to Google Maps
    try {
      return await this.googleCircuit.execute(async () => {
        return await this.googleMapsClient.geocode(address);
      });
    } catch (googleError) {
      this.logger.error('All geocoding providers failed', {
        error: googleError
      });
      
      throw new HttpException(
        {
          error_code: 'MAPS_API_ERROR',
          http_status: 502,
          message: 'Сервис геолокации временно недоступен'
        },
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
```

---

# SECTION 7: RETRY & BACKOFF STRATEGY

## 7.1. Retry Decision Logic (Canonical)

**CRITICAL RULE:** Retry semantics are strictly defined:

- **4xx errors:** âŒ **NEVER RETRY** (client errors, fix request first)
- **5xx errors:** âœ… **RETRYABLE** (server errors, transient failures)
- **Network errors:** âœ… **RETRYABLE** (timeouts, connection refused)
- **Exception:** 429 Rate Limit âœ… **RETRYABLE** (after delay specified in `Retry-After` header)

```typescript
function shouldRetry(error: any): boolean {
  // HTTP Status-based retry logic
  if (error.response?.status) {
    const status = error.response.status;
    
    // 4xx - Client errors, never retry (except 429)
    if (status >= 400 && status < 500) {
      return status === 429; // Only retry rate limits
    }
    
    // 5xx - Server errors, always retry
    if (status >= 500 && status < 600) {
      return true;
    }
  }
  
  // Network errors - retry
  if (error.code === 'ETIMEDOUT' || 
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND') {
    return true;
  }
  
  // Database deadlock - retry
  if (error.code === '40P01') {
    return true;
  }
  
  // Unknown error - don't retry by default
  return false;
}
```

### Non-Retryable Errors (4xx)

| HTTP Status | Error Type | Reason | Action |
|-------------|------------|--------|--------|
| 400 | Bad Request | Invalid input | Fix request data |
| 401 | Unauthorized | Auth failure | Obtain valid credentials |
| 403 | Forbidden | Insufficient permissions | Check authorization |
| 404 | Not Found | Resource doesn't exist | Verify resource ID |
| 409 | Conflict | Business rule violation | Handle conflict logic |
| 422 | Unprocessable Entity | Semantic error | Fix business logic |

### Retryable Errors (5xx, Network)

| Error Type | Reason | Retry Strategy |
|------------|--------|----------------|
| 500 Internal Server Error | Transient server issue | Exponential backoff |
| 502 Bad Gateway | Upstream service issue | Exponential backoff |
| 503 Service Unavailable | Temporary maintenance | Exponential backoff |
| 504 Gateway Timeout | Slow upstream response | Exponential backoff |
| Network timeout (ETIMEDOUT) | Temporary network issue | Exponential backoff |
| Connection refused (ECONNREFUSED) | Service temporarily down | Exponential backoff |
| Database deadlock (40P01) | Concurrent transaction conflict | Exponential backoff |

## 7.2. Exponential Backoff (Conceptual)

> **Note:** Specific backoff parameters (base delay, max delay, max retries) are managed by the SRE/Infrastructure team and defined in operational configuration, not hardcoded in application logic.

**Conceptual Formula:**
```
delay = min(base_delay * (2 ^ attempt), max_delay)
```

**Conceptual Implementation:**

```typescript
@Injectable()
export class RetryService {
  // Configuration managed by SRE
  private readonly BASE_DELAY: number;
  private readonly MAX_DELAY: number;
  private readonly MAX_RETRIES: number;
  
  constructor(private config: RetryConfig) {
    this.BASE_DELAY = config.baseDelay;
    this.MAX_DELAY = config.maxDelay;
    this.MAX_RETRIES = config.maxRetries;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt <= this.MAX_RETRIES) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        
        if (attempt > this.MAX_RETRIES || !shouldRetry(error)) {
          throw error;
        }
        
        const delay = this.calculateDelay(attempt - 1);
        
        this.logger.warn('Operation failed, retrying', {
          attempt,
          max_retries: this.MAX_RETRIES,
          delay,
          error: error.message
        });
        
        await this.sleep(delay);
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.BASE_DELAY * Math.pow(2, attempt);
    return Math.min(exponentialDelay, this.MAX_DELAY);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 7.3. Jitter

Add randomness to retry delays to prevent thundering herd problem.

**Problem:** Without jitter, all clients retry at the same time, causing traffic spikes.

**Solution:** Add random jitter to backoff delays.

```typescript
private calculateDelayWithJitter(attempt: number): number {
  const baseDelay = this.BASE_DELAY * Math.pow(2, attempt);
  const jitterFactor = 0.3; // 30% jitter range (configurable)
  const jitter = Math.random() * baseDelay * jitterFactor;
  const totalDelay = baseDelay + jitter;
  
  return Math.min(totalDelay, this.MAX_DELAY);
}
```

## 7.4. Retry Budget (Conceptual)

Limit the percentage of requests that can be retried to prevent retry storms.

**Concept:** If every failed request triggers 3 retries, a 10% failure rate becomes a 30% additional load.

**Solution:** Limit retries to a percentage of total requests.

```typescript
@Injectable()
export class RetryBudgetService {
  // Budget percentage managed by SRE
  private readonly RETRY_BUDGET_PERCENTAGE: number;
  private readonly WINDOW_SIZE_MS: number;
  
  private requestCount = 0;
  private retryCount = 0;
  private windowStart = Date.now();
  
  canRetry(): boolean {
    this.checkWindow();
    
    const retryRatio = this.requestCount > 0 
      ? this.retryCount / this.requestCount 
      : 0;
    
    return retryRatio < this.RETRY_BUDGET_PERCENTAGE;
  }
  
  recordRequest(): void {
    this.checkWindow();
    this.requestCount++;
  }
  
  recordRetry(): void {
    this.checkWindow();
    this.retryCount++;
  }
  
  private checkWindow(): void {
    const now = Date.now();
    
    if (now - this.windowStart > this.WINDOW_SIZE_MS) {
      this.requestCount = 0;
      this.retryCount = 0;
      this.windowStart = now;
    }
  }
}
```

---

# SECTION 8: CIRCUIT BREAKER DESIGN

## 8.1. Purpose & Benefits

A circuit breaker prevents cascading failures by stopping requests to a failing service and allowing it time to recover.

**Problem:** Cascading Failures
```
AI Service fails â†' All requests keep trying â†' Threads blocked â†' Backend overloaded â†' System crashes
```

**Solution:** Circuit Breaker
```
AI Service fails â†' Circuit opens â†' Requests fail fast â†' Backend remains responsive â†' AI Service recovers â†' Circuit closes
```

**Benefits:**
1. **Fail Fast:** Don't waste resources on requests that will fail
2. **Prevent Cascade:** Stop failures from spreading to dependent systems
3. **Allow Recovery:** Give failing service time to recover without load
4. **Improve UX:** Return errors quickly instead of hanging

## 8.2. Circuit States

Circuit breaker operates in three states:

```
         Success
â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"
â"‚     CLOSED     â"‚ â"€â"€(failures >= threshold)â"€â"€> OPEN
â"‚  (Normal ops)  â"‚                                â"‚
â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜                                â"‚
        â†'                                         â"‚
        â"‚                                         â"‚
    (success >= threshold)                  (resetTimeout)
        â"‚                                         â"‚
        â"‚                                         â†"
â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"                         â"Œâ"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"
â"‚   HALF-OPEN    â"‚ <â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"‚   OPEN   â"‚
â"‚ (Testing if    â"‚                         â"‚ (Failing â"‚
â"‚  service OK)   â"‚ â"€â"€(any failure)â"€â"€â"€â"€â"€â"€>  â"‚  fast)   â"‚
â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜                         â""â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"˜
```

**CLOSED (Normal Operation):**
- All requests pass through
- Failures are counted
- Opens when `failureCount >= failureThreshold`

**OPEN (Circuit Tripped):**
- All requests fail immediately without calling service
- After `resetTimeout`, transitions to HALF-OPEN
- Protects failing service from load

**HALF-OPEN (Testing Recovery):**
- Limited requests pass through to test service
- If successful: transition to CLOSED
- If fails: transition back to OPEN

## 8.3. Configuration (Conceptual)

> **Note:** Specific circuit breaker parameters (failure threshold, success threshold, timeout, reset timeout) are managed by the SRE/Infrastructure team and defined in operational configuration.

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number;    // Failures before opening circuit
  successThreshold: number;    // Successes before closing circuit
  timeout: number;             // Request timeout
  resetTimeout: number;        // Time before trying again (HALF-OPEN)
}
```

**Conceptual Threshold Selection:**

| Service Type | Failure Threshold | Reset Timeout | Reasoning |
|--------------|-------------------|---------------|-----------|
| Critical (Database) | Low | Medium | Fail fast to protect data |
| Important (External API) | Medium | Medium | Balance availability & protection |
| Optional (AI) | High | High | More tolerance for non-critical features |

> **Implementation Note:** Actual values are configured by SRE team based on service SLAs, historical performance, and operational requirements.

## 8.4. Circuit Breaker in MVP

### AI Service Circuit Breaker

```typescript
@Injectable()
export class AIService {
  private circuitBreaker: CircuitBreaker;
  
  constructor(config: CircuitBreakerConfig) {
    this.circuitBreaker = new CircuitBreaker(config);
  }
  
  async getBoxSizeRecommendation(query: string): Promise<Recommendation> {
    try {
      return await this.circuitBreaker.execute(async () => {
        return await this.aiClient.getRecommendation(query);
      });
      
    } catch (error) {
      if (error.code === 'CIRCUIT_BREAKER_OPEN') {
        // Return fallback recommendations
        return this.getFallbackRecommendation(query);
      }
      
      throw error;
    }
  }
}
```

### External Maps API Circuit Breaker

```typescript
@Injectable()
export class MapsService {
  private yandexCircuit: CircuitBreaker;
  private googleCircuit: CircuitBreaker;
  
  async geocode(address: string): Promise<Coordinates> {
    // Try Yandex first
    try {
      return await this.yandexCircuit.execute(async () => {
        return await this.yandexMapsClient.geocode(address);
      });
    } catch (error) {
      // Fallback to Google
      try {
        return await this.googleCircuit.execute(async () => {
          return await this.googleMapsClient.geocode(address);
        });
      } catch (fallbackError) {
        throw new HttpException(
          {
            error_code: 'MAPS_API_ERROR',
            http_status: 502,
            message: 'Сервис геолокации временно недоступен'
          },
          HttpStatus.BAD_GATEWAY
        );
      }
    }
  }
}
```

---

# SECTION 9: FALLBACK MECHANISMS

## 9.1. Stub Responses

Provide safe default responses when services fail.

### AI Service Fallback

```typescript
@Injectable()
export class AIService {
  async getRecommendations(query: string): Promise<Recommendation[]> {
    try {
      return await this.aiClient.getRecommendations(query);
    } catch (error) {
      this.logger.warn('AI service unavailable, using fallback', { error });
      return this.getStubRecommendations();
    }
  }

  private getStubRecommendations(): Recommendation[] {
    // Return safe default recommendations
    return [
      {
        size: 'M',
        confidence: 0.3,
        reason: 'default_fallback'
      }
    ];
  }
}
```

### Maps API Fallback

```typescript
@Injectable()
export class MapsService {
  async geocode(address: string): Promise<Coordinates> {
    try {
      return await this.primaryMapsProvider.geocode(address);
    } catch (error) {
      this.logger.warn('Primary maps provider failed, using fallback', { error });
      
      try {
        return await this.fallbackMapsProvider.geocode(address);
      } catch (fallbackError) {
        this.logger.error('All maps providers failed', { fallbackError });
        
        // Return null coordinates (client should handle gracefully)
        return null;
      }
    }
  }
}
```

## 9.2. Cached Data

Use cached responses when live data is unavailable.

```typescript
@Injectable()
export class SearchService {
  async search(query: SearchDto): Promise<SearchResult> {
    try {
      // Try live search
      return await this.performLiveSearch(query);
    } catch (error) {
      this.logger.warn('Live search failed, trying cache', { error });
      
      // Fallback to cached results
      const cachedResults = await this.cacheService.get(
        `search:${this.hashQuery(query)}`
      );
      
      if (cachedResults) {
        return {
          ...cachedResults,
          is_cached: true,
          cached_at: cachedResults.timestamp
        };
      }
      
      throw new HttpException(
        {
          error_code: 'SERVICE_UNAVAILABLE',
          http_status: 503,
          message: 'Сервис поиска временно недоступен'
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
```

## 9.3. Partial Degradation

Return partial results instead of complete failure.

```typescript
@Injectable()
export class WarehouseService {
  async getWarehouseDetails(id: string): Promise<WarehouseDetails> {
    const warehouse = await this.warehouseRepo.findById(id);
    
    if (!warehouse) {
      throw new HttpException(
        {
          error_code: 'WAREHOUSE_NOT_FOUND',
          http_status: 404,
          message: 'Склад не найден',
          details: { warehouse_id: id }
        },
        HttpStatus.NOT_FOUND
      );
    }
    
    // Try to enrich with external data
    let reviews = [];
    let aiRecommendations = null;
    
    try {
      reviews = await this.reviewService.getReviews(id);
    } catch (error) {
      this.logger.warn('Failed to fetch reviews, continuing without them', { error });
    }
    
    try {
      aiRecommendations = await this.aiService.getRecommendations(id);
    } catch (error) {
      this.logger.warn('Failed to fetch AI recommendations, continuing without them', { error });
    }
    
    return {
      warehouse,
      reviews,
      ai_recommendations: aiRecommendations,
      partial_result: reviews.length === 0 || !aiRecommendations
    };
  }
}
```

---

# SECTION 10: FAILOVER STRATEGY

## 10.1. Database Failover

> **Note:** Database failover is managed at the infrastructure level (PostgreSQL replication, connection pooling). Application should be resilient to database connection changes.

### Connection Pool Failover

```typescript
// database/database-failover.service.ts
@Injectable()
export class DatabaseFailoverService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private logger: Logger
  ) {}

  async handleConnectionFailure(error: any): Promise<void> {
    this.logger.error('Database connection failure', { error });
    
    try {
      // Attempt reconnection (handled by TypeORM)
      await this.dataSource.initialize();
      this.logger.info('Database reconnection successful');
    } catch (reconnectError) {
      this.logger.error('Database reconnection failed', { reconnectError });
      throw new HttpException(
        {
          error_code: 'DATABASE_ERROR',
          http_status: 500,
          message: 'Ошибка базы данных. Попробуйте позже'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

### Read Replica Fallback (Future)

> **Note:** Read replicas are NOT in MVP v1 scope. This pattern is documented for future reference.

```typescript
// Future implementation
@Injectable()
export class DatabaseService {
  async query<T>(sql: string): Promise<T> {
    try {
      // Try primary database
      return await this.primaryConnection.query(sql);
    } catch (error) {
      this.logger.warn('Primary database failed, trying replica', { error });
      
      // Fallback to read replica
      return await this.replicaConnection.query(sql);
    }
  }
}
```

## 10.2. API Gateway Failover

> **Note:** API Gateway failover is managed at the infrastructure level (Nginx upstream failover, health checks).

### Nginx Upstream Configuration (Reference)

```nginx
# Reference configuration (managed by infrastructure team)
upstream backend {
  server backend1.internal:3000 max_fails=3 fail_timeout=30s;
  server backend2.internal:3000 max_fails=3 fail_timeout=30s backup;
}

server {
  location /api {
    proxy_pass http://backend;
    proxy_next_upstream error timeout http_502 http_503 http_504;
  }
}
```

## 10.3. External Service Failover

Multi-provider fallback for external services.

### Maps API Failover

```typescript
@Injectable()
export class MapsService {
  private providers = [
    { name: 'yandex', client: this.yandexClient, circuit: this.yandexCircuit },
    { name: 'google', client: this.googleClient, circuit: this.googleCircuit }
  ];

  async geocode(address: string): Promise<Coordinates> {
    for (const provider of this.providers) {
      try {
        return await provider.circuit.execute(async () => {
          return await provider.client.geocode(address);
        });
      } catch (error) {
        this.logger.warn(`${provider.name} Maps failed, trying next provider`, {
          error
        });
        continue;
      }
    }
    
    // All providers failed
    throw new HttpException(
      {
        error_code: 'MAPS_API_ERROR',
        http_status: 502,
        message: 'Сервис геолокации временно недоступен'
      },
      HttpStatus.BAD_GATEWAY
    );
  }
}
```

---

# SECTION 11: ERROR LOGGING & CORRELATION

## 11.1. Structured Logging

> **Reference:** See `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md` for complete logging guidelines.

All logs use structured JSON format for easier parsing and analysis.

### Log Format

```json
{
  "level": "ERROR",
  "timestamp": "2025-12-15T14:50:00.123Z",
  "request_id": "req_abc123",
  "trace_id": "trace_456",
  "span_id": "span_789",
  "user_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "event": "booking_creation_failed",
  "message": "Failed to create booking",
  "context": {
    "box_id": "770e8400-e29b-41d4-a716-446655440002",
    "error_code": "BOX_NOT_AVAILABLE",
    "duration_ms": 234
  },
  "stack": "BoxNotAvailableException: Box already booked\n    at ..."
}
```

### Log Levels

| Level | When to Use | Examples |
|-------|-------------|----------|
| **ERROR** | System failures, exceptions | Database connection failed, external API timeout |
| **WARN** | Potential issues, degraded mode | Cache unavailable, circuit breaker open, high error rate |
| **INFO** | Significant events | User registration, booking created, service started |
| **DEBUG** | Detailed flow information | Cache hit/miss, query execution time |

### Logging Implementation

```typescript
// logger/structured-logger.service.ts
@Injectable()
export class StructuredLogger {
  log(level: string, event: string, message: string, context: any): void {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      request_id: context.requestId,
      trace_id: context.traceId,
      span_id: context.spanId,
      user_id: context.userId,
      event,
      message,
      context: context.data,
      stack: context.stack
    };
    
    console.log(JSON.stringify(logEntry));
  }
}
```

## 11.2. Request Correlation

Generate and track request IDs through the entire request lifecycle.

### Request ID Middleware

```typescript
// middleware/request-id.middleware.ts
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Check if request already has an ID (from load balancer)
    let requestId = req.headers['x-request-id'] as string;
    
    if (!requestId) {
      requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    
    // Store in request object for logging
    req['requestId'] = requestId;
    
    // Note: request_id is NOT added to response headers per canonical spec
    // It is used internally for logging only
    
    next();
  }
}
```

## 11.3. Error → Log → Alert Mapping

> **NEW SECTION:** Mapping error categories to log levels and alerts.

| Error Category | HTTP Status | Log Level | Alert | Example Error Code |
|---------------|-------------|-----------|-------|-------------------|
| Validation | 400 | WARN | No | `VALIDATION_ERROR` |
| Authentication | 401 | WARN | No | `TOKEN_EXPIRED` |
| Authorization | 403 | WARN | No | `INSUFFICIENT_PERMISSIONS` |
| Not Found | 404 | INFO | No | `WAREHOUSE_NOT_FOUND` |
| Business Conflict | 409 | WARN | No | `BOX_NOT_AVAILABLE` |
| Business Logic | 422 | WARN | No | `INVALID_DATE_RANGE` |
| Rate Limit | 429 | WARN | Yes (if sustained) | `RATE_LIMIT_EXCEEDED` |
| Internal Error | 500 | ERROR | Yes | `INTERNAL_SERVER_ERROR` |
| Database Error | 500 | ERROR | Yes | `DATABASE_ERROR` |
| External Service | 502 | ERROR | Yes | `AI_SERVICE_UNAVAILABLE` |
| Service Unavailable | 503 | ERROR | Yes | `SERVICE_UNAVAILABLE` |
| Timeout | 504 | ERROR | Yes | `REQUEST_TIMEOUT` |

### Alert Triggers

**Immediate Alerts (Critical):**
- Error rate > 5% for 5 minutes
- P95 response time > 2s for 10 minutes
- Database connection pool exhausted
- Service unavailable (503) for 2 minutes

**Deferred Alerts (High):**
- Error rate > 2% for 15 minutes
- Circuit breaker OPEN state
- High memory usage (>85%) for 5 minutes

**Monitoring Only (Medium/Low):**
- Individual 4xx errors (logged, not alerted)
- Transient 5xx errors (single occurrences)

---

# SECTION 12: MONITORING & ALERTING

## 12.1. Error Rate Metrics

Track error rates by endpoint, service, and type.

### Prometheus Metrics (Conceptual)

```typescript
// metrics/prometheus.service.ts
@Injectable()
export class PrometheusService {
  private httpRequestsTotal: Counter;
  private httpRequestDuration: Histogram;
  private httpErrorsTotal: Counter;
  
  recordRequest(method: string, endpoint: string, status: number, duration: number): void {
    this.httpRequestsTotal.inc({ method, endpoint, status: status.toString() });
    this.httpRequestDuration.observe({ method, endpoint }, duration / 1000);
    
    if (status >= 400) {
      this.httpErrorsTotal.inc({ method, endpoint, status: status.toString() });
    }
  }
}
```

## 12.2. Response Time Thresholds (Conceptual)

> **Note:** Specific response time thresholds are defined in SRE configuration based on SLAs.

| Endpoint Type | P50 | P95 | P99 | Alert Threshold |
|---------------|-----|-----|-----|-----------------|
| Search (GET) | Low | Medium | Medium-High | Configured |
| Booking (POST) | Low | Medium | High | Configured |
| Details (GET) | Very Low | Low | Medium | Configured |

> **Implementation:** Actual thresholds configured per service SLA requirements.

## 12.3. Availability SLO (Conceptual)

Service Level Objectives for system availability.

### SLO Definitions

```typescript
interface SLO {
  name: string;
  target_percentage: number;
  measurement_window_hours: number;
  error_budget: number;
}
```

**Example SLOs** (actual values defined by SRE):
- Overall API Availability: 99.9% (24h window)
- Search Endpoint Availability: 99.95% (24h window)
- Booking Success Rate: 99.5% (24h window)

## 12.4. Alert Configuration (Conceptual)

### Alert Severity Levels

| Severity | Description | Response Time | Action |
|----------|-------------|---------------|--------|
| **CRITICAL** | Complete service outage or data loss | Immediate (24/7) | Page on-call engineer |
| **HIGH** | Major feature broken, significant user impact | <1 hour | Slack alert + investigate |
| **MEDIUM** | Minor feature degraded, limited impact | <4 hours | Slack alert |
| **LOW** | Informational | <24 hours | Log only |

### Alert Rules (Examples)

| Alert | Severity | Condition | Action |
|-------|----------|-----------|--------|
| High Error Rate | CRITICAL | error_rate > 5% for 5 minutes | Page on-call engineer |
| Slow Response | HIGH | p95_response_time > threshold for 10 minutes | Slack #engineering |
| Database Pool Exhausted | CRITICAL | db_pool_available < 10% for 2 minutes | Page on-call + restart |
| Circuit Breaker Open | MEDIUM | circuit_breaker_state = OPEN | Slack #engineering |
| High Memory Usage | HIGH | memory_usage > 85% for 5 minutes | Investigate memory leak |

---

# SECTION 13: OPERATIONAL GUIDELINES

## 13.1. Production Error Handling Workflow

Step-by-step workflow for handling production errors.

**Step 1: Detection (0-5 minutes)**
- Alert received via Slack/Email
- Check monitoring dashboard
- Verify error is real (not false positive)

**Step 2: Triage (5-15 minutes)**
- Determine severity and impact
- Check affected services
- Estimate number of affected users
- Decide on escalation

**Step 3: Investigation (15-30 minutes)**
- Search logs by request_id
- Check recent deployments
- Review error patterns
- Identify root cause

**Step 4: Mitigation (30-60 minutes)**
- Apply immediate fix (if available)
- OR rollback recent deployment
- OR enable degraded mode
- Verify mitigation worked

**Step 5: Communication (ongoing)**
- Update incident channel
- Notify stakeholders
- Post status updates

**Step 6: Post-Incident (within 48 hours)**
- Write incident report
- Document lessons learned
- Create follow-up tasks

## 13.2. Triage Process

### Severity Classification

| Severity | Definition | Response Time | Examples |
|----------|------------|---------------|----------|
| **P0 (Critical)** | Complete service outage or data loss | Immediate (24/7) | Database down, security breach |
| **P1 (High)** | Major feature broken, significant user impact | <1 hour | Booking creation failing, search broken |
| **P2 (Medium)** | Minor feature degraded, limited impact | <4 hours | AI recommendations unavailable |
| **P3 (Low)** | Cosmetic issues, no user impact | <24 hours | Logging errors, minor UI glitches |

## 13.3. Root Cause Analysis (RCA)

### 5 Whys Technique

```
Problem: Database connection pool exhausted

Why? Too many concurrent connections
â†"
Why? High traffic spike during peak hours
â†"
Why? New feature launched without load testing
â†"
Why? Load testing not part of deployment checklist
â†"
Why? No formal deployment process documented

Root Cause: Missing load testing in deployment process
```

## 13.4. Post-Incident Reports

Document incidents for future reference and learning.

### Post-Incident Report Template

```markdown
# Post-Incident Report: [Incident Title]

## Executive Summary
One-paragraph summary of what happened, impact, and resolution.

## Incident Details
- **Incident ID**: INC-2025-001
- **Date**: 2025-12-15
- **Severity**: P1 (High)
- **Duration**: 45 minutes

## Root Cause
Database connection pool size was insufficient for traffic spike.

## Impact Analysis
- **Affected Users**: 500 users (5%)
- **Failed Operations**: 450 booking attempts
- **SLO Impact**: Availability dropped to 95% (target: 99.9%)

## Timeline
| Time | Event | Actor |
|------|-------|-------|
| 14:30 | Traffic increased 300% | - |
| 14:30 | Alert: High error rate | Monitoring |
| 14:32 | Incident acknowledged | On-call engineer |
| ... | ... | ... |

## Action Items
- [ ] Add alerts for connection pool utilization >80%
- [ ] Implement connection pool auto-scaling
- [ ] Review capacity planning process
```

## 13.5. Continuous Improvement

Process for learning from errors and improving the system.

### Quarterly Error Review

**1. Review Incident Data (15 min)**
- Total incidents this quarter
- Severity breakdown
- MTTR trends
- Repeat incidents

**2. Identify Patterns (20 min)**
- Common root causes
- Systemic issues
- Tool/process gaps

**3. Brainstorm Solutions (20 min)**
- Prevention strategies
- Detection improvements
- Response optimization

**4. Prioritize Actions (15 min)**
- High-impact, low-effort wins
- Long-term investments
- Assign owners

---

# APPENDIX A: POST-MVP ERROR SCENARIOS

> **IMPORTANT:** The following error scenarios are **NOT** in MVP v1 scope. They are documented for future reference only.

## A.1. Payment Processing Errors (v1.1+)

**Out of MVP v1 Scope - Future Implementation**

When payment gateway integration is added in future versions, the following error codes will be required:

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `PAYMENT_FAILED` | 502 | Ошибка обработки платежа. Попробуйте другую карту | Payment gateway rejected |
| `PAYMENT_TIMEOUT` | 504 | Превышено время ожидания оплаты | Payment gateway timeout |
| `INSUFFICIENT_FUNDS` | 422 | Недостаточно средств на карте | Card declined |
| `INVALID_CARD` | 400 | Неверные данные карты | Card validation failed |
| `PAYMENT_METHOD_NOT_SUPPORTED` | 422 | Способ оплаты не поддерживается | Unsupported payment method |

## A.2. Subscription/Billing Errors (v2+)

**Out of MVP v1 Scope - Future Implementation**

| Error Code | HTTP Status | Message | Scenario |
|------------|-------------|---------|----------|
| `SUBSCRIPTION_EXPIRED` | 403 | Подписка истекла. Продлите подписку | Subscription lapsed |
| `PLAN_LIMIT_EXCEEDED` | 429 | Превышен лимит тарифного плана | Usage limit reached |
| `BILLING_CYCLE_ENDED` | 403 | Платежный цикл завершен | End of billing period |

---

# APPENDIX B: DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-08 | Technical Team | Initial complete specification |
| 1.0 - CANONICAL | 2025-12-15 | Technical Team | **Canonicalized version:**<br/>- Changed error format to canonical (error_code, http_status, message, details)<br/>- Removed `success`, nested `error`, `request_id`, `timestamp`, `path` from client responses<br/>- Removed payment/billing/subscription errors from MVP<br/>- Fixed retry semantics (4xx = not retryable, 5xx = retryable)<br/>- Removed specific timeout/retry numbers (defer to SRE config)<br/>- Added Error → Log → Alert mapping<br/>- Aligned with `api_design_blueprint_mvp_v1_CANONICAL.md`<br/>- Aligned with `Technical_Architecture_Document_MVP_v1_CANONICAL.md`<br/>- Aligned with `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md` |

---

# APPENDIX C: CROSS-REFERENCES

This document is strictly aligned with the following CORE specifications:

1. **`api_design_blueprint_mvp_v1_CANONICAL.md`** - SOURCE OF TRUTH for error format
2. **`Technical_Architecture_Document_MVP_v1_CANONICAL.md`** - Architecture patterns
3. **`full_database_specification_mvp_v1_CANONICAL.md`** - Database error handling
4. **`Logging_Strategy_&_Log_Taxonomy_MVP_v1.md`** - Logging standards
5. **`API_Rate_Limiting_Throttling_Specification_MVP_v1_COMPLETE.md`** - Rate limiting errors
6. **`Security_and_Compliance_Plan_MVP_v1.md`** - Security error handling

**For API error codes and formats, always refer to:**
> `api_design_blueprint_mvp_v1_CANONICAL.md` - Section 8: Error Handling

**For logging and observability, always refer to:**
> `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md`

---

# CONCLUSION

This Error Handling & Fault Tolerance Specification provides a comprehensive, **canonical** framework for building a resilient Self-Storage Aggregator MVP v1. Key takeaways:

1. **Canonical Error Format:** `{error_code, http_status, message, details}` - flat structure, no `success` field, no `request_id`/`timestamp` in client responses
2. **Strict Retry Semantics:** 4xx = never retry, 5xx = always retryable with backoff
3. **Defense in Depth:** Multiple layers of error handling from API validation to circuit breakers
4. **Observability First:** Every error logged with correlation IDs for debugging (server-side)
5. **Graceful Degradation:** System continues operating with reduced functionality
6. **Learn and Improve:** Continuous improvement through RCA and error budget management
7. **MVP Scope Clarity:** Payment/billing/subscription errors are OUT of scope

**Implementation Priority:**
1. Core error handling (Sections 1-4) - canonical format, validation, business errors
2. Database resilience (Section 5) - deadlocks, timeouts, constraints
3. Service resilience (Section 6-7) - idempotency, retry logic
4. Advanced patterns (Section 8-10) - circuit breaker, fallback, failover
5. Observability (Section 11-13) - logging, monitoring, operational guidelines

---

**Document Status:** âœ… CANONICAL - Strictly Aligned with MVP v1  
**Last Updated:** December 15, 2025  
**Version:** 1.0 - CANONICAL  
**Maintained By:** Technical Architecture Team

---

**END OF DOCUMENT**
