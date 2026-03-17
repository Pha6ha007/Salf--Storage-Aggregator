---
id: S01
milestone: M001-1q9eu0
provides:
  - Operators module: POST /operators/register, GET/PUT /operators/me, GET /operators/me/statistics
  - 6 missing backend endpoints: booking reject, review CRUD, warehouse status change, public box detail, user booking/favorite aliases
  - Frontend API layer fully aligned to spec — all operator paths corrected
key_files:
  - src/backend/src/modules/operators/ (all files)
  - src/backend/src/modules/bookings/bookings.service.ts
  - src/backend/src/modules/bookings/bookings.controller.ts
  - src/backend/src/modules/reviews/reviews.service.ts
  - src/backend/src/modules/reviews/reviews.controller.ts
  - src/backend/src/modules/warehouses/warehouses.service.ts
  - src/backend/src/modules/warehouses/warehouses.controller.ts
  - src/backend/src/modules/boxes/boxes.controller.ts
  - src/backend/src/modules/users/users.controller.ts
  - frontend/src/lib/api/ (all files)
  - frontend/src/types/booking.ts
key_decisions:
  - "Operator register: User(role=operator) + Operator in $transaction, JWT cookies issued immediately"
  - "Reject = pending-only cancel with cancelledBy=operator — separate service method for clarity"
  - "Warehouse status allowed transitions enforced server-side: operator can draft↔pending_moderation, active↔inactive only"
  - "Frontend API: /operator/ for management, /operators/ for profile/registration — per spec"
patterns_established:
  - "Operator lookup: prisma.operator.findUnique({ where: { userId } }) — standard pattern throughout"
  - "Aggregate stats via Promise.all([groupBy queries]) — reused in operator dashboard"
drill_down_paths:
  - .gsd/milestones/M001-1q9eu0/slices/S01/tasks/T01-SUMMARY.md
verification_result: pass
completed_at: 2026-03-17T10:15:00Z
---

# S01: Backend API Gaps + Contract Fix

**Operators module built from scratch, 6 missing endpoints added, all frontend API paths corrected to match spec.**

## What Was Built

**Operators module** (complete): `POST /operators/register` creates User+Operator in a transaction and issues JWT cookies. `GET /operators/me` returns profile with company info and aggregated statistics. `PUT /operators/me` updates profile fields. `GET /operators/me/statistics` returns warehouse/box/booking counts.

**Missing endpoints**: `PUT /operator/bookings/:id/reject` (pending-only booking rejection), `PUT /reviews/:id` + `DELETE /reviews/:id` (review edit/delete with ownership check + rating recalculation), `PATCH /operator/warehouses/:id/status` (controlled status transitions), `GET /boxes/:id` (public box detail), `/users/me/bookings` + `/users/me/favorites` aliases.

**Frontend API layer**: All 5 API files (`auth.ts`, `bookings.ts`, `operator-bookings.ts`, `warehouses.ts`, `operators.ts`) corrected. Added `bookingsApi.create()`. Fixed forgot/reset password paths, all operator paths, HTTP method mismatches (PATCH→POST for confirm/complete, PATCH→PUT for reject).

**Build verification**: `npx nest build` clean, `npx tsc --noEmit` clean on API layer.
