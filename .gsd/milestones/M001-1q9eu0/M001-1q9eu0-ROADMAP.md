# M001-1q9eu0: MVP Completion

**Vision:** Complete a partially-built UAE self-storage marketplace so the full user journey works end-to-end — search, warehouse detail, booking creation, operator confirmation, and admin moderation — ready for onboarding 5–10 UAE operators.

## Success Criteria

- User can register, search, view a warehouse detail page, select a box, and submit a booking request
- Operator can register, create a warehouse with boxes, submit for moderation, and have it appear in the catalog after approval
- Admin can approve/reject operator registrations and warehouse listings
- Booking confirmation triggers email to user + SMS/WhatsApp to operator
- Home page shows real warehouse data (no hardcoded mock data)
- All 71 API endpoints per spec respond correctly with correct shapes

## Key Risks / Unknowns

- PostGIS extensions disabled in Prisma schema — geo queries may silently fail on Railway until extensions enabled and migration updated
- Frontend/backend URL contract mismatch is systemic — wrong paths throughout the operator API layer; must fix before any integration tests pass
- Railway env vars for SendGrid/Twilio may be unconfigured — notifications will silently skip (service is fail-safe) but need confirmation

## Proof Strategy

- PostGIS disabled → retire in S01 by enabling extensions in schema and verifying `ST_DWithin` executes without error against Railway DB
- URL mismatch → retire in S01 by auditing all `frontend/src/lib/api/` files against spec, fixing paths, verifying in browser network tab
- Notifications unknown → retire in S02 by triggering a test booking event and confirming email delivery

## Verification Classes

- Contract verification: API endpoints return expected status codes and JSON shapes (Swagger + curl)
- Integration verification: full booking flow in deployed Vercel+Railway environment
- Operational verification: operator onboarding path exercised with a real test operator account
- UAT / human verification: admin approval flow requires a human to navigate the admin panel

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 5 slices delivered and verified
- `/api/v1/operators/register`, `/operators/me`, `/operators/me/statistics` respond correctly
- `/api/v1/admin/operators/pending`, `/admin/warehouses/pending` respond correctly
- Warehouse detail page renders photos, boxes, reviews, and map in deployed environment
- Booking creation form submits successfully and returns booking_number
- Operator can complete warehouse creation flow and see warehouse in their dashboard
- Home page fetches real warehouses from API
- Booking event triggers email notification (confirmed by SendGrid activity log or test inbox)
- Success criteria above are re-checked against deployed URLs, not localhost

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011
- Partially covers: R012 (launchability — onboarding path built but actual operators not yet onboarded)
- Leaves for later: R020, R021, R022 (deferred)
- Orphan risks: PostGIS extension availability on Railway is external dependency

## Slices

- [x] **S01: Backend API Gaps + Contract Fix** `risk:high` `depends:[]`
  > After this: all 71 spec endpoints exist and return correct shapes; frontend API layer calls correct paths per spec; PostGIS extension status confirmed

- [x] **S02: Admin Module + Notifications** `risk:high` `depends:[S01]`
  > After this: admin can view/approve/reject operator registrations and warehouse listings via API; booking event triggers real email delivery confirmed in SendGrid logs

- [ ] **S03: Public User Flow** `risk:high` `depends:[S01]`
  > After this: user can navigate from home page (real data) through catalog to warehouse detail, select a box, complete booking form, and receive a booking_number confirmation

- [ ] **S04: Operator Portal** `risk:medium` `depends:[S01,S02]`
  > After this: operator can register, fill profile, create a warehouse with boxes, upload a photo, submit for moderation, and manage incoming bookings via the operator dashboard

- [ ] **S05: Integration Proof** `risk:low` `depends:[S01,S02,S03,S04]`
  > After this: complete end-to-end flow exercised in deployed Vercel+Railway env with real data; admin approval path tested; all mock data eliminated

## Boundary Map

### S01 → S02

Produces:
- `POST /operators/register` — creates user with role=operator + operator record
- `GET /operators/me` — returns operator profile with company_info + statistics
- `PUT /operators/me` — updates operator profile
- `GET /operators/me/statistics` — returns warehouse/booking/revenue aggregates
- `PUT /operator/bookings/:id/reject` — new booking transition (pending → cancelled by operator)
- `POST /operator/reviews/:id/response` — adds operator_response to review
- `PUT /reviews/:id` — user updates own review
- `DELETE /reviews/:id` — user deletes own review
- `PATCH /operator/warehouses/:id/status` — status change endpoint
- `GET /boxes/:id` — public box detail
- `frontend/src/lib/api/*` — all operator API paths corrected to match spec

Consumes: nothing (builds on existing backend foundation)

### S01 → S03

Produces:
- Corrected `warehousesApi.list()` — verified URL `/warehouses` with correct query params
- Corrected `warehousesApi.getById()` — verified URL `/warehouses/:id`
- Corrected `bookingsApi.create()` — verified URL `POST /bookings`
- Corrected `authApi.*` paths

Consumes: nothing

### S01 → S04

Produces:
- `operatorsApi.register()` calling `POST /operators/register`
- `operatorsApi.getProfile()` calling `GET /operators/me`
- `operatorsApi.getStats()` calling `GET /operators/me/statistics`
- `warehousesApi.listOwn()` calling `GET /operator/warehouses`
- `warehousesApi.create()` calling `POST /operator/warehouses`
- `boxesApi.list/create/update/delete` calling `GET|POST|PUT|DELETE /operator/boxes`

Consumes: nothing

### S02 → S04

Produces:
- `GET /admin/operators/pending` — list of operators awaiting verification
- `POST /admin/operators/:id/approve` — approve operator
- `POST /admin/operators/:id/reject` — reject operator with reason
- `GET /admin/warehouses/pending` — list awaiting moderation
- `POST /admin/warehouses/:id/approve` — approve warehouse (→ active)
- `POST /admin/warehouses/:id/reject` — reject warehouse with reason
- `GET /admin/users` — user list with filters
- `PATCH /admin/users/:id/suspend` — suspend user

Consumes from S01:
- `POST /operators/register` — operators created here feed admin verification queue

### S02 → S05

Produces:
- Confirmed notification delivery path: booking.created event → NotificationListener → SendGrid/Twilio
- Railway env vars documented and verified

Consumes from S01:
- BookingCreatedEvent, BookingConfirmedEvent emitted correctly

### S03 → S05

Produces:
- `frontend/src/app/warehouse/[id]/` — complete warehouse detail page (WarehouseClient.tsx + subcomponents)
- `frontend/src/app/bookings/new/` or booking modal — complete booking creation flow
- `frontend/src/app/page.tsx` — home page wired to real API
- Booking confirmation page/state visible after successful POST /bookings

Consumes from S01:
- Corrected API paths for `/warehouses/:id`, `/warehouses/:id/boxes`, `/warehouses/:id/reviews`
- Correct `bookingsApi.create()` path

### S04 → S05

Produces:
- `frontend/src/app/operator/profile/` — operator profile page
- `frontend/src/app/operator/warehouses/[id]/edit/` — warehouse edit page
- `frontend/src/app/operator/warehouses/[id]/boxes/` — box management page
- `frontend/src/app/operator/register/` or operator registration flow
- Complete operator warehouse creation form (name, address, features, photo upload)

Consumes from S01:
- Corrected operator API paths
- `POST /operators/register` endpoint

Consumes from S02:
- Admin verification flow (operator submitted → admin approves → warehouse goes active)
