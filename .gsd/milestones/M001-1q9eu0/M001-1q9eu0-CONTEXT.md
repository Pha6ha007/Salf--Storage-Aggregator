# M001-1q9eu0: MVP Completion

**Gathered:** 2026-03-17
**Status:** Ready for planning

## Project Description

Self-Storage Aggregator marketplace for UAE (storagecompare.ae). Backend and frontend partially built and deployed. Goal is to complete the MVP to a fully functional state — all flows working end-to-end — then hand off to 5–10 UAE operators for onboarding.

## Why This Milestone

~60% of the code exists but the critical user flows are broken or missing. The booking creation path doesn't exist on frontend. The operators API module is missing on backend. Frontend and backend use different URL schemes for operator endpoints. Without completing this milestone, the product cannot be demo'd to operators or users.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit the home page and see real warehouses fetched from the database
- Search the catalog by emirate, filter by price/size/features, toggle map/list view
- Click a warehouse, see its photos, box sizes with prices, reviews, and location on map
- Select a box, pick dates, fill contact info, and submit a booking request
- Log in, view their bookings list, and cancel a pending booking
- Register as an operator, create a warehouse with boxes, and have it submitted for moderation
- Receive an email when a booking is created (to operator) and confirmed (to user)
- As an operator: view incoming booking requests and confirm or reject them
- As an admin: approve operator registrations and approve warehouses for the catalog

### Entry point / environment

- Entry point: https://storagecompare.vercel.app (frontend), https://api-storagecompare.up.railway.app (backend API)
- Environment: Production-deployed (Vercel + Railway), local dev via docker-compose
- Live dependencies: PostgreSQL + PostGIS, Redis, Google Maps API, SendGrid, Twilio, Anthropic API, AWS S3

## Completion Class

- Contract complete means: all API endpoints per spec respond correctly with correct shapes
- Integration complete means: full booking flow works end-to-end in deployed environment
- Operational complete means: operator can register, get verified by admin, create warehouse, go live in catalog

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A new user can register, find a warehouse, and successfully submit a booking request in deployed env
- An operator can register, create a warehouse with 2 boxes, get approved by admin, and have warehouse appear in catalog
- Booking confirmation triggers email to user and SMS/WhatsApp to operator
- Admin can see pending operator verification queue and approve/reject

## Risks and Unknowns

- PostGIS extensions commented out in Prisma schema ("temporarily disabled") — geo search may not work on Railway until extensions enabled
- Frontend/backend URL scheme mismatch is pervasive — systematic audit required
- Railway PostgreSQL may not have PostGIS available depending on plan tier
- Notification env vars (SENDGRID_API_KEY, TWILIO_*) may not be configured on Railway

## Existing Codebase / Prior Art

- `src/backend/src/` — NestJS monolith with all modules
- `src/backend/src/prisma/schema.prisma` — canonical DB schema, extensions disabled
- `frontend/src/` — Next.js 14 App Router with shadcn/ui
- `frontend/src/lib/api/` — API client layer (many wrong paths)
- `docs/core/API_Detailed_Specification_MVP_v1_COMPLETE.md` — authoritative API contract (71 endpoints)
- `docs/core/DOC-101_Internal_Admin_API_Specification_MVP_v1.md` — admin API spec
- `CLAUDE.md` — canonical code standards, auth patterns, error format

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions.

## Relevant Requirements

- R001 — backend API contract alignment (S01)
- R002 — operators module (S01)
- R003 — admin moderation module (S02)
- R004 — missing backend endpoints (S01)
- R005 — warehouse detail page (S03)
- R006 — booking creation flow (S03)
- R007 — operator warehouse + box management UI (S04)
- R008 — operator onboarding flow (S04)
- R009 — home page with real data (S03)
- R010 — end-to-end flow verified (S05)
- R011 — notifications end-to-end (S02)
- R012 — operator onboarding ready (S05)

## Scope

### In Scope

- Operators module: POST /operators/register, GET/PUT /operators/me, GET /operators/me/statistics
- Admin module: operator verification queue, warehouse moderation, user management (per DOC-101)
- Missing backend endpoints: booking reject, review edit/delete, operator review response, warehouse status change, GET /boxes/:id
- API URL alignment: fix all frontend calls to match backend routes per spec (two prefixes: `/operators/` for profile, `/operator/` for warehouse/box/booking management)
- Warehouse detail page: photos gallery, box list with prices, reviews, map, booking button
- Booking creation flow: box select → dates → contact info → submit → confirmation
- Home page: replace hardcoded mock data with real API calls
- Operator warehouse form: complete create/edit with all fields, photo upload
- Operator box management: CRUD interface for boxes
- Operator profile page: view/edit company info
- Notifications: verify env vars, test booking event → email/SMS pipeline

### Out of Scope / Non-Goals

- Online payments (Paddle)
- AI features beyond Box Finder (chat module already exists but is not MVP)
- n8n automation workflows
- Review submission UI (deferred)
- Booking detail page (deferred)
- Multi-language support

## Technical Constraints

- Auth is httpOnly cookies — never Bearer tokens
- All new API endpoints must follow canonical error format: { statusCode, error, message, details, timestamp, path }
- Spec uses two operator prefixes deliberately: `/operators/` (profile/registration) and `/operator/` (warehouse/box/booking management)
- Prisma schema changes require migration — must not break existing Railway deployment
- Frontend uses Next.js 14 App Router — no Pages Router patterns
- Frontend API base URL is process.env.NEXT_PUBLIC_API_URL (currently http://localhost:3001/api/v1 default)

## Integration Points

- Google Maps API — geocoding on warehouse create/update, map display
- Anthropic Claude API — Box Finder endpoint
- AWS S3 (me-south-1) — warehouse photo upload
- SendGrid — transactional email notifications
- Twilio — SMS + WhatsApp notifications
- Railway PostgreSQL — primary database
- Redis — session cache, rate limiting

## Open Questions

- Are PostGIS and pgvector extensions available on the Railway PostgreSQL instance? — Check S01
- Are SENDGRID_API_KEY and TWILIO credentials configured in Railway? — Verify before S02
- Operator registration: separate flow or role toggle on existing register page? — Lean toward role selector on register, finalize in S04 planning
