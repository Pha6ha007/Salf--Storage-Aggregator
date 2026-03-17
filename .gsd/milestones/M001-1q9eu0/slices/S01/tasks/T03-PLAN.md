# T03: Frontend API Layer Alignment

**Slice:** S01
**Milestone:** M001-1q9eu0

## Goal

Fix every broken API path in `frontend/src/lib/api/` so all calls match what the backend actually exposes. Also add a `bookingsApi.create()` function (missing entirely).

## Must-Haves

### Truths
- `authApi.forgotPassword()` calls `POST /auth/forgot-password` (not `/auth/password/reset-request`)
- `authApi.resetPassword()` calls `POST /auth/reset-password` (not `/auth/password/reset-confirm`)
- `bookingsApi.list()` calls `GET /bookings` (backend path) — not `/users/me/bookings` (frontend was calling spec path that doesn't exist yet; T02 adds the alias, but calling `/bookings` directly also works)
- `bookingsApi.cancel()` calls `POST /bookings/:id/cancel` (not PATCH)
- `bookingsApi.create()` function exists and calls `POST /bookings`
- `operatorBookingsApi.list()` calls `GET /operator/bookings` (not `/operators/me/bookings`)
- `operatorBookingsApi.getById()` calls `GET /operator/bookings/:id`
- `operatorBookingsApi.confirm()` calls `POST /operator/bookings/:id/confirm` (not PATCH)
- `operatorBookingsApi.reject()` calls `PUT /operator/bookings/:id/reject`
- `operatorBookingsApi.complete()` calls `POST /operator/bookings/:id/complete` (not PATCH)
- `warehousesApi.listOwn()` calls `GET /operator/warehouses`
- `warehousesApi.create()` calls `POST /operator/warehouses`
- `warehousesApi.update()` calls `PATCH /operator/warehouses/:id`
- `warehousesApi.delete()` calls `DELETE /operator/warehouses/:id`
- `boxesApi.list()` calls `GET /operator/warehouses/:warehouseId/boxes` — wait, backend uses `GET /operator/boxes` not nested. Reconcile with backend.
- `operatorsApi.getStats()` calls `GET /operators/me/statistics` (not `/me/stats`)
- `operatorsApi.updateProfile()` calls `PUT /operators/me` (not PATCH)
- No TypeScript errors from updated API files

### Artifacts
- `frontend/src/lib/api/auth.ts` — corrected forgot-password and reset-password paths
- `frontend/src/lib/api/bookings.ts` — corrected list/cancel paths, added `create()` with `POST /bookings` body shape
- `frontend/src/lib/api/operator-bookings.ts` — all paths corrected to `/operator/bookings/*`, methods corrected
- `frontend/src/lib/api/warehouses.ts` — operator warehouse paths corrected, boxes API paths corrected
- `frontend/src/lib/api/operators.ts` — stats path corrected, updateProfile method corrected
- `frontend/src/types/booking.ts` — add `CreateBookingDto` type

### Key Links
- `bookings.ts` exports `bookingsApi.create` used by (future) booking form in S03
- `operator-bookings.ts` used by `frontend/src/app/operator/bookings/page.tsx`
- `warehouses.ts` operator methods used by `frontend/src/app/operator/warehouses/page.tsx` and `new/page.tsx`
- `operators.ts` used by `frontend/src/app/operator/dashboard/page.tsx`

## Steps

1. Read `frontend/src/lib/api/auth.ts` — identify forgot-password and reset-password paths, fix both
2. Read `frontend/src/lib/api/bookings.ts` — fix list path (`/bookings` not `/users/me/bookings`), fix cancel to `POST` not `PATCH`, add `create(dto: CreateBookingDto)` function calling `POST /bookings`
3. Read `frontend/src/types/booking.ts` — add `CreateBookingDto` interface: `{ warehouse_id, box_id, start_date, duration_months, notes? }`
4. Read `frontend/src/lib/api/operator-bookings.ts` — fix all paths: list→`/operator/bookings`, getById→`/operator/bookings/:id`, confirm→`POST /operator/bookings/:id/confirm`, reject→`PUT /operator/bookings/:id/reject`, complete→`POST /operator/bookings/:id/complete`
5. Read `frontend/src/lib/api/warehouses.ts` — fix listOwn→`/operator/warehouses`, create→`POST /operator/warehouses`, update→`PATCH /operator/warehouses/:id`, delete→`DELETE /operator/warehouses/:id`; fix boxes API: `list`→`GET /operator/boxes?warehouse_id=X` (or `GET /operator/warehouses/:id/boxes`); also add missing `publish`→`PATCH /operator/warehouses/:id/status` with body `{status: 'pending_moderation'}`
6. Read `frontend/src/lib/api/operators.ts` — fix getStats→`/operators/me/statistics`, fix updateProfile→`PUT` not `PATCH`
7. Read `frontend/src/types/operator.ts` — verify `OperatorStats` interface matches what backend returns (total_warehouses, active_warehouses, total_boxes, etc.)
8. Run `cd frontend && npx tsc --noEmit` — verify zero type errors across api/ files

## Context

- Backend boxes for operator: `GET /operator/warehouses/:warehouseId/boxes` and `POST /operator/warehouses/:warehouseId/boxes` (nested under warehouse), `PATCH /operator/boxes/:id`, `DELETE /operator/boxes/:id`
- Backend booking confirm/complete use `POST` method (not PUT or PATCH) — check `bookings.controller.ts`
- Backend booking cancel uses `POST /bookings/:id/cancel` — confirmed from controller
- All operator management endpoints use `/operator/` prefix (no 's'), NOT `/operators/`
- Only `/operators/register`, `/operators/me`, `/operators/me/statistics` use the `/operators/` prefix (with 's')
- The `favoritesApi` and `usersApi` paths look correct already — `/users/me/favorites` will work after T02 adds aliases; no change needed to those files
- `NEXT_PUBLIC_API_URL` env var controls the base URL — no changes needed there
