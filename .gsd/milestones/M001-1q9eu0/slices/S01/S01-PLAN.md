# S01: Backend API Gaps + Contract Fix

**Goal:** Every endpoint in the spec exists and responds correctly; every frontend API call hits the right backend path.

**Demo:** `curl https://api-storagecompare.up.railway.app/api/v1/operators/me` returns 401 (endpoint exists). `curl .../api/v1/operator/bookings/1/reject` returns 401. Frontend catalog page loads without 404s in network tab.

## Must-Haves

- `POST /operators/register` creates user + operator record, returns 201
- `GET /operators/me` returns operator profile (401 if unauthenticated)
- `PUT /operators/me` updates operator profile fields
- `GET /operators/me/statistics` returns warehouse/booking aggregate counts
- `PUT /operator/bookings/:id/reject` transitions booking pending → cancelled
- `PUT /reviews/:id` updates own review (forbidden if not owner)
- `DELETE /reviews/:id` soft-deletes review (forbidden if not owner)
- `POST /operator/reviews/:id/response` already exists in controller — verify it works end-to-end
- `PATCH /operator/warehouses/:id/status` changes warehouse status (draft→active, active→inactive)
- `GET /boxes/:id` public endpoint returns box detail
- `GET /users/me/bookings` alias works (returns same as current `/bookings` for authenticated user)
- `GET /users/me/favorites`, `POST /users/me/favorites`, `DELETE /users/me/favorites/:id` aliases work
- All frontend `lib/api/` files call paths that exist on the backend

## Tasks

- [x] **T01: Operators Module (Backend)**
  Build `src/backend/src/modules/operators/` — service, controller, module. Implements: POST /operators/register, GET /operators/me, PUT /operators/me, GET /operators/me/statistics. Register in app.module.ts.

- [x] **T02: Missing Backend Endpoints**
  Add to existing controllers: PUT /operator/bookings/:id/reject (BookingsController), PUT /reviews/:id + DELETE /reviews/:id (ReviewsController), PATCH /operator/warehouses/:id/status (WarehousesController), GET /boxes/:id public (BoxesController). Add /users/me/bookings and /users/me/favorites aliases to UsersController.

- [x] **T03: Frontend API Layer Alignment**
  Audit and fix all files in `frontend/src/lib/api/` and `frontend/src/types/` to match the correct backend paths. Fix: auth endpoints (forgot-password/reset-password paths), bookings (POST create endpoint, cancel method), operator-bookings (all paths), warehouses operator paths.

## Files Likely Touched

**Backend:**
- `src/backend/src/modules/operators/operators.module.ts` (new)
- `src/backend/src/modules/operators/operators.controller.ts` (new)
- `src/backend/src/modules/operators/operators.service.ts` (new)
- `src/backend/src/modules/operators/dto/` (new DTOs)
- `src/backend/src/modules/bookings/bookings.controller.ts` (add reject)
- `src/backend/src/modules/bookings/bookings.service.ts` (add reject method)
- `src/backend/src/modules/reviews/reviews.controller.ts` (add PUT/DELETE)
- `src/backend/src/modules/reviews/reviews.service.ts` (add update/delete)
- `src/backend/src/modules/warehouses/warehouses.controller.ts` (add status endpoint)
- `src/backend/src/modules/warehouses/warehouses.service.ts` (add status change)
- `src/backend/src/modules/boxes/boxes.controller.ts` (add public GET /boxes/:id)
- `src/backend/src/modules/users/users.controller.ts` (add /me/bookings and /me/favorites aliases)
- `src/backend/src/app.module.ts` (import OperatorsModule)

**Frontend:**
- `frontend/src/lib/api/auth.ts`
- `frontend/src/lib/api/bookings.ts`
- `frontend/src/lib/api/operator-bookings.ts`
- `frontend/src/lib/api/warehouses.ts`
- `frontend/src/lib/api/operators.ts`
- `frontend/src/types/booking.ts`
- `frontend/src/types/operator.ts`
