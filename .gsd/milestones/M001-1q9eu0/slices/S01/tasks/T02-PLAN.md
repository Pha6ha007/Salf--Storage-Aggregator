# T02: Missing Backend Endpoints

**Slice:** S01
**Milestone:** M001-1q9eu0

## Goal

Add the ~6 missing endpoints to existing controllers: booking reject, review update/delete, warehouse status change, public box detail, and user/favorites aliases so frontend spec-based paths work.

## Must-Haves

### Truths
- `PUT /api/v1/operator/bookings/:id/reject` transitions a pending booking to cancelled (cancelledBy=operator), returns updated booking
- `PUT /api/v1/operator/bookings/:id/reject` on a confirmed booking returns 400 (cannot reject confirmed)
- `PUT /api/v1/reviews/:id` with valid JWT cookie updates own review rating/comment, returns updated review
- `PUT /api/v1/reviews/:id` with another user's JWT returns 403
- `DELETE /api/v1/reviews/:id` with valid JWT deletes own review, returns 200
- `PATCH /api/v1/operator/warehouses/:id/status` changes warehouse status (e.g. draft→pending_moderation), returns updated warehouse
- `GET /api/v1/boxes/:id` (public, no auth) returns box detail including warehouse_id and all fields
- `GET /api/v1/users/me/bookings` returns same response as existing `GET /api/v1/bookings` for authenticated user
- `GET /api/v1/users/me/favorites` returns same response as existing `GET /api/v1/favorites`
- `POST /api/v1/users/me/favorites` (warehouse_id in body) works
- `DELETE /api/v1/users/me/favorites/:warehouse_id` works

### Artifacts
- `src/backend/src/modules/bookings/bookings.controller.ts` — `PUT /operator/bookings/:id/reject` endpoint added to OperatorBookingsController
- `src/backend/src/modules/bookings/bookings.service.ts` — `reject(id, operatorId, reason?)` method added
- `src/backend/src/modules/reviews/reviews.controller.ts` — `PUT /reviews/:id` and `DELETE /reviews/:id` added
- `src/backend/src/modules/reviews/reviews.service.ts` — `updateReview(userId, reviewId, dto)` and `deleteReview(userId, reviewId)` methods
- `src/backend/src/modules/warehouses/warehouses.controller.ts` — `PATCH /operator/warehouses/:id/status` added to OperatorWarehousesController
- `src/backend/src/modules/warehouses/warehouses.service.ts` — `changeStatus(id, operatorId, status)` method
- `src/backend/src/modules/boxes/boxes.controller.ts` — public `GET /boxes/:id` added with `@Public()`
- `src/backend/src/modules/users/users.controller.ts` — `/me/bookings` and `/me/favorites` aliases added

### Key Links
- Booking reject uses `BookingCancelledBy.operator` enum value and emits `BookingCancelledEvent`
- Review update/delete checks `review.userId === userId` before allowing modification
- Warehouse status change validates allowed transitions (not blocked→anything by operator)
- Users `/me/bookings` delegates to `BookingsService.findByUser(userId)` via injected service
- Users `/me/favorites` delegates to `FavoritesService` methods via injected service

## Steps

1. Read `bookings.service.ts` fully — find the `cancel` method to understand how to implement `reject` (same pattern: pending only, emit event)
2. Add `reject(id, operatorId, reason?)` to BookingsService: only pending bookings can be rejected, set cancelledBy=operator, emit BookingCancelledEvent
3. Add `PUT /operator/bookings/:id/reject` to OperatorBookingsController with operator lookup pattern
4. Read `reviews.service.ts` fully — understand existing review create pattern
5. Add `updateReview(userId, reviewId, dto)` to ReviewsService: check ownership, update rating+comment, re-calculate warehouse average rating
6. Add `deleteReview(userId, reviewId)` to ReviewsService: check ownership, set isVisible=false (soft hide, not hard delete)
7. Add `PUT /reviews/:id` and `DELETE /reviews/:id` to ReviewsController
8. Add `changeStatus(id, operatorId, status)` to WarehousesService: validate allowed transitions per RBAC (operator can: draft→pending_moderation, active→inactive, inactive→active; cannot set active directly or blocked)
9. Add `PATCH /operator/warehouses/:id/status` to OperatorWarehousesController
10. Add public `GET /boxes/:id` to a new `@Controller('boxes')` section in BoxesController with `@Public()`
11. Inject BookingsService and FavoritesService into UsersModule/UsersController; add `/me/bookings` and `/me/favorites` delegating routes
12. Run `npx nest build` — verify zero TypeScript errors

## Context

- Booking cancel pattern: `src/backend/src/modules/bookings/bookings.service.ts` — reject is same as cancel but only allows pending, always sets cancelledBy=operator
- Review ownership check: `review.userId !== userId` → throw ForbiddenException
- Warehouse status allowed transitions for operator: draft↔pending_moderation, active↔inactive. Admin can set blocked/active.
- For users /me aliases: inject the respective services into UsersModule imports array and UsersController constructor
- CLAUDE.md rule 11: emit events for every state change — reject must emit BookingCancelledEvent
