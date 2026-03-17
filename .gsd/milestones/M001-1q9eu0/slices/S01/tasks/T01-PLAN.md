# T01: Operators Module (Backend)

**Slice:** S01
**Milestone:** M001-1q9eu0

## Goal

Build the operators module from scratch: `POST /operators/register`, `GET /operators/me`, `PUT /operators/me`, `GET /operators/me/statistics`. Register it in app.module.ts.

## Must-Haves

### Truths
- `POST /api/v1/operators/register` with valid body returns 201, creates a User with role=operator AND an Operator record linked to that user
- `POST /api/v1/operators/register` with duplicate email returns 409
- `GET /api/v1/operators/me` without auth returns 401
- `GET /api/v1/operators/me` with valid operator JWT cookie returns 200 with operator profile including company_info and statistics
- `PUT /api/v1/operators/me` with valid body updates operator profile fields
- `GET /api/v1/operators/me/statistics` returns aggregate counts: total_warehouses, active_warehouses, total_boxes, occupied_boxes, total_bookings, active_bookings

### Artifacts
- `src/backend/src/modules/operators/operators.module.ts` — NestJS module exporting OperatorsService
- `src/backend/src/modules/operators/operators.controller.ts` — 4 endpoints, all with correct auth guards and Swagger decorators
- `src/backend/src/modules/operators/operators.service.ts` — real implementation, no stubs
- `src/backend/src/modules/operators/dto/register-operator.dto.ts` — validates all required fields per spec section 5.1.1
- `src/backend/src/modules/operators/dto/update-operator.dto.ts` — partial update DTO
- `src/backend/src/modules/operators/dto/operator-response.dto.ts` — response shape

### Key Links
- `operators.controller.ts` → `operators.service.ts` via OperatorsService injection
- `operators.service.ts` → `PrismaService` for DB operations
- `operators.service.ts` → `AuthService` or directly to bcrypt for register (creates User + Operator in transaction)
- `app.module.ts` imports `OperatorsModule`
- `operators.controller.ts` uses `JwtAuthGuard`, `RolesGuard`, `@Roles(UserRole.operator, UserRole.admin)` on protected routes
- Register endpoint is `@Public()` with rate limit 3/day

## Steps

1. Read `src/backend/src/modules/auth/auth.service.ts` to understand user creation pattern (bcrypt, prisma.user.create)
2. Read `src/backend/src/modules/warehouses/warehouses.service.ts` to understand operator lookup pattern (`prisma.operator.findUnique({ where: { userId } })`)
3. Create `operators.module.ts` with imports: PrismaModule, JwtModule (or AuthModule), EventEmitterModule
4. Create `register-operator.dto.ts`: email, password, password_confirmation (must match), name, phone, company_name, trade_license_number (optional), agree_to_terms (must be true)
5. Create `update-operator.dto.ts`: PartialType of relevant operator fields
6. Create `operator-response.dto.ts`: id, email, name, phone, role, company_name, is_verified, created_at + statistics block
7. Create `operators.service.ts`:
   - `register(dto)`: check email uniqueness, hash password, create User (role=operator) + Operator in $transaction, emit user.registered event, return operator profile
   - `getProfile(userId)`: findUnique operator where userId, join user fields, compute statistics from aggregated queries
   - `updateProfile(userId, dto)`: update operator record + user name/phone if provided
   - `getStatistics(userId)`: aggregate count queries for warehouses, boxes, bookings
8. Create `operators.controller.ts` with 4 routes matching spec exactly
9. Register OperatorsModule in `app.module.ts`
10. Run `npx nest build` in src/backend — verify no TypeScript errors

## Context

- Spec: `docs/core/API_Detailed_Specification_MVP_v1_COMPLETE.md` sections 5.1–5.4
- Auth pattern: `src/backend/src/modules/auth/auth.service.ts` (bcrypt + prisma.user.create)
- Operator lookup: `src/backend/src/modules/warehouses/warehouses.controller.ts` (prisma.operator.findUnique where userId)
- CLAUDE.md: "Per-Module Pattern" — module/controller/service/dto structure
- Error format: `{ statusCode, error, message, details, timestamp, path }` — use NestJS built-in exceptions
- The register endpoint creates BOTH a User record (with role=operator) AND an Operator record linked by userId. It does NOT go through the auth register endpoint.
- Statistics query: count warehouses by operatorId, count boxes via warehouse join, count bookings via warehouse join
- After register, set auth cookies same way as AuthController.setTokenCookies — operators must be immediately logged in
