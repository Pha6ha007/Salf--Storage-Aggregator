---
id: T01-T03
parent: S01
milestone: M001-1q9eu0
provides:
  - OperatorsModule (register/profile/stats) — POST /operators/register, GET/PUT /operators/me, GET /operators/me/statistics
  - BookingsService.reject() + PUT /operator/bookings/:id/reject (pending→cancelled by operator)
  - ReviewsService.updateReview() + deleteReview() + PUT/DELETE /reviews/:id
  - WarehousesService.changeStatus() + PATCH /operator/warehouses/:id/status
  - PublicBoxesController GET /boxes/:id
  - UsersController /users/me/bookings and /users/me/favorites aliases
  - Frontend API layer corrected: auth, bookings, operator-bookings, warehouses, operators
  - main.ts NestExpressApplication (trust proxy fix)
requires: []
affects: [S02, S03, S04, S05]
key_files:
  - src/backend/src/modules/operators/operators.service.ts
  - src/backend/src/modules/operators/operators.controller.ts
  - src/backend/src/modules/operators/operators.module.ts
  - src/backend/src/modules/bookings/bookings.service.ts
  - src/backend/src/modules/bookings/bookings.controller.ts
  - src/backend/src/modules/reviews/reviews.service.ts
  - src/backend/src/modules/reviews/reviews.controller.ts
  - src/backend/src/modules/warehouses/warehouses.service.ts
  - src/backend/src/modules/warehouses/warehouses.controller.ts
  - src/backend/src/modules/boxes/boxes.controller.ts
  - src/backend/src/modules/users/users.controller.ts
  - src/backend/src/modules/users/users.module.ts
  - frontend/src/lib/api/auth.ts
  - frontend/src/lib/api/bookings.ts
  - frontend/src/lib/api/operator-bookings.ts
  - frontend/src/lib/api/warehouses.ts
  - frontend/src/lib/api/operators.ts
  - frontend/src/types/booking.ts
key_decisions:
  - "Operator register creates both User (role=operator) and Operator record in $transaction; issues JWT cookies immediately"
  - "Reject is a separate method from cancel for clarity — same result but pending-only constraint and always cancelledBy=operator"
  - "Review delete uses isVisible=false (soft hide) not hard delete, to preserve rating history"
  - "Warehouse status allowed operator transitions: draft↔pending_moderation, active↔inactive; admin can set any"
  - "UsersController now injects BookingsService + FavoritesService for /me aliases; BookingsModule and FavoritesModule exported correctly"
  - "Frontend API: /operator/ prefix for warehouse/box/booking management, /operators/ prefix for profile/registration"
patterns_established:
  - "Operator lookup pattern: prisma.operator.findUnique({ where: { userId } }) — reused throughout operator controllers"
  - "Aggregate statistics via Promise.all([groupBy, aggregate, ...]) — reusable for operator dashboard"
drill_down_paths:
  - .gsd/milestones/M001-1q9eu0/slices/S01/tasks/T01-PLAN.md
  - .gsd/milestones/M001-1q9eu0/slices/S01/tasks/T02-PLAN.md
  - .gsd/milestones/M001-1q9eu0/slices/S01/tasks/T03-PLAN.md
duration: 45min
verification_result: pass
completed_at: 2026-03-17T10:15:00Z
---

# T01–T03: Operators Module + Missing Endpoints + Frontend API Alignment

**Operators module, 6 missing backend endpoints, and all frontend API paths corrected to match spec.**

## What Happened

Built the operators module from scratch (service + controller + module + 3 DTOs). Register endpoint creates User (role=operator) + Operator record in a `$transaction`, then issues JWT cookies identically to auth login — operator is immediately authenticated. Statistics aggregate via `Promise.all` groupBy queries on warehouses/boxes/bookings.

Added 6 missing backend endpoints: booking reject (pending-only, operator-initiated cancel), review update/delete with rating recalculation, warehouse status change with allowed-transition map, public GET /boxes/:id, and /users/me/bookings + /users/me/favorites aliases (UsersController now injects BookingsService + FavoritesService).

Frontend API layer audited and corrected throughout: auth (forgot-password/reset-password paths), bookings (list path, cancel method from PATCH→POST, added create()), operator-bookings (all paths from `/operators/me/bookings/*` → `/operator/bookings/*`, methods corrected), warehouses (operator paths from `/operators/me/warehouses` → `/operator/warehouses`), operators (stats from `/me/stats` → `/me/statistics`, updateProfile from PATCH→PUT).

Also fixed: `app.set('trust proxy', 1)` pre-existing TS error (NestExpressApplication typing), `isEmailVerified` typo in seed script, duplicate AiModule in app.module.ts.

## Deviations

- T01/T02/T03 executed as one task for efficiency (all were interdependent on backend module structure)
- `IsTrue` from class-validator doesn't exist — used `@Equals(true)` instead

## Files Created/Modified

**Created:**
- `src/backend/src/modules/operators/operators.service.ts` — register, getProfile, updateProfile, getStatistics
- `src/backend/src/modules/operators/operators.controller.ts` — 4 endpoints with correct guards
- `src/backend/src/modules/operators/operators.module.ts`
- `src/backend/src/modules/operators/dto/register-operator.dto.ts`
- `src/backend/src/modules/operators/dto/update-operator.dto.ts`
- `src/backend/src/modules/operators/dto/operator-response.dto.ts`

**Modified:**
- `src/backend/src/app.module.ts` — added OperatorsModule, removed duplicate AiModule
- `src/backend/src/main.ts` — NestExpressApplication for trust proxy
- `src/backend/src/modules/bookings/bookings.service.ts` — added reject()
- `src/backend/src/modules/bookings/bookings.controller.ts` — added PUT :id/reject
- `src/backend/src/modules/reviews/reviews.service.ts` — added updateReview(), deleteReview()
- `src/backend/src/modules/reviews/reviews.controller.ts` — added PUT/DELETE /reviews/:id
- `src/backend/src/modules/warehouses/warehouses.service.ts` — added changeStatus()
- `src/backend/src/modules/warehouses/warehouses.controller.ts` — added PATCH :id/status
- `src/backend/src/modules/boxes/boxes.controller.ts` — added PublicBoxesController
- `src/backend/src/modules/boxes/boxes.module.ts` — registered PublicBoxesController
- `src/backend/src/modules/users/users.controller.ts` — /me/bookings and /me/favorites aliases
- `src/backend/src/modules/users/users.module.ts` — imports BookingsModule, FavoritesModule
- `frontend/src/lib/api/auth.ts` — fixed forgot/reset paths
- `frontend/src/lib/api/bookings.ts` — rewrote with create(), corrected paths/methods
- `frontend/src/lib/api/operator-bookings.ts` — rewrote with correct paths/methods
- `frontend/src/lib/api/warehouses.ts` — rewrote with correct operator paths
- `frontend/src/lib/api/operators.ts` — corrected stats path and PUT method
- `frontend/src/types/booking.ts` — added CreateBookingDto
