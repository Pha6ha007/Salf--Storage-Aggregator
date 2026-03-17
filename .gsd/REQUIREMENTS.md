# Requirements

## Active

### R001 — Backend API contract alignment
- Class: core-capability
- Status: active
- Description: All API endpoints match API_Detailed_Specification_MVP_v1_COMPLETE.md exactly — paths, methods, request/response shapes
- Why it matters: Frontend and backend must agree on contracts or nothing works
- Source: user
- Primary owning slice: M001-1q9eu0/S01
- Supporting slices: M001-1q9eu0/S02
- Validation: mapped
- Notes: Critical mismatch: frontend uses `/operators/me/warehouses`, backend exposes `/operator/warehouses`. Must resolve before any integration works.

### R002 — Operators module (register + profile + stats)
- Class: core-capability
- Status: active
- Description: POST /operators/register, GET /operators/me, PUT /operators/me, GET /operators/me/statistics — all per API spec section 5
- Why it matters: Operators cannot onboard or manage their profile without these endpoints
- Source: user
- Primary owning slice: M001-1q9eu0/S01
- Supporting slices: none
- Validation: mapped
- Notes: Module directory exists but contains only DTOs folder — no service, controller, or module file

### R003 — Admin moderation module
- Class: core-capability
- Status: active
- Description: Admin endpoints for operator verification queue, warehouse moderation (approve/reject), user management — per DOC-101
- Why it matters: Operators cannot go live without admin approval; warehouses cannot appear in catalog without moderation
- Source: user
- Primary owning slice: M001-1q9eu0/S02
- Supporting slices: none
- Validation: mapped
- Notes: Entirely absent from backend. Admin role exists in schema and guards but zero admin endpoints exist.

### R004 — Missing backend endpoints
- Class: core-capability
- Status: active
- Description: booking reject (PUT /operator/bookings/:id/reject), review edit/delete, operator review response, warehouse status change, public GET /boxes/:id
- Why it matters: Operators need reject (not just cancel), users need review management
- Source: user
- Primary owning slice: M001-1q9eu0/S01
- Supporting slices: none
- Validation: mapped
- Notes: All defined in spec, none implemented

### R005 — Warehouse detail page
- Class: primary-user-loop
- Status: active
- Description: Public warehouse detail page with photos gallery, box list with prices, reviews, map location, and booking initiation
- Why it matters: Core conversion page — user goes here before booking
- Source: user
- Primary owning slice: M001-1q9eu0/S03
- Supporting slices: none
- Validation: mapped
- Notes: WarehouseClient.tsx is absent. page.tsx exists but is empty/shell.

### R006 — Booking creation flow
- Class: primary-user-loop
- Status: active
- Description: User can select a box on warehouse detail, pick dates, fill contact info, submit booking request, and receive confirmation
- Why it matters: This is the core monetization event — without it, the marketplace does nothing
- Source: user
- Primary owning slice: M001-1q9eu0/S03
- Supporting slices: M001-1q9eu0/S01
- Validation: mapped
- Notes: No booking creation form anywhere in frontend. Users can list/cancel bookings but cannot create one.

### R007 — Operator warehouse + box management UI
- Class: primary-user-loop
- Status: active
- Description: Operator can create/edit warehouses (form with all fields including photos), create/edit/delete boxes with pricing, view box inventory
- Why it matters: Operators need to list their inventory for users to find and book
- Source: user
- Primary owning slice: M001-1q9eu0/S04
- Supporting slices: M001-1q9eu0/S01
- Validation: mapped
- Notes: Warehouse list and new-warehouse pages exist but call wrong API paths. Box management UI entirely absent.

### R008 — Operator profile + onboarding flow
- Class: primary-user-loop
- Status: active
- Description: Operator registration flow, profile page, company info management
- Why it matters: Operators need a way to register and manage their business identity
- Source: user
- Primary owning slice: M001-1q9eu0/S04
- Supporting slices: M001-1q9eu0/S01
- Validation: mapped
- Notes: No operator-specific registration page or profile page exists in frontend

### R009 — Home page with real data
- Class: primary-user-loop
- Status: active
- Description: Home page fetches featured/recent warehouses from API; search initiates catalog with params
- Why it matters: Landing page is hardcoded mock data — anyone visiting sees fake warehouses
- Source: user
- Primary owning slice: M001-1q9eu0/S03
- Supporting slices: M001-1q9eu0/S01
- Validation: mapped
- Notes: All 6 warehouse cards on home page are hardcoded with placeholder images

### R010 — End-to-end booking flow verified
- Class: continuity
- Status: active
- Description: Complete path works: register → search → warehouse detail → select box → book → operator confirms → user sees confirmed status
- Why it matters: This is the product working — everything else supports this
- Source: user
- Primary owning slice: M001-1q9eu0/S05
- Supporting slices: M001-1q9eu0/S01, M001-1q9eu0/S02, M001-1q9eu0/S03, M001-1q9eu0/S04
- Validation: mapped
- Notes: Integration proof slice

### R011 — Notifications working end-to-end
- Class: continuity
- Status: active
- Description: Booking events trigger emails (booking created → operator, booking confirmed → user email+SMS)
- Why it matters: Operators and users must be notified of booking changes
- Source: user
- Primary owning slice: M001-1q9eu0/S02
- Supporting slices: none
- Validation: mapped
- Notes: NotificationService and listener exist but need env vars and testing

### R012 — Operator ready for onboarding
- Class: launchability
- Status: active
- Description: 5–10 UAE operators (Dubai/Abu Dhabi) can register, submit docs, be verified by admin, create warehouses, and have them go live
- Why it matters: The stated launch goal
- Source: user
- Primary owning slice: M001-1q9eu0/S05
- Supporting slices: M001-1q9eu0/S02, M001-1q9eu0/S04
- Validation: unmapped
- Notes: Depends on admin verification flow + operator portal being complete

## Deferred

### R020 — Review submission UI
- Class: primary-user-loop
- Status: deferred
- Description: Post-booking review form accessible from completed booking detail
- Why it matters: Social proof, quality signal
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Backend review POST endpoint exists. Deferred to keep MVP scope tight — operators can launch without reviews.

### R021 — Booking detail page
- Class: continuity
- Status: deferred
- Description: /bookings/[id] page with full booking details, cancel button, warehouse info
- Why it matters: Users need to view individual booking details
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Bookings list exists. Detail page is missing but not blocking launch.

### R022 — n8n automation workflows
- Class: operability
- Status: deferred
- Description: n8n workflows for booking reminders, review requests, expiry notifications
- Why it matters: Automation for operator communications
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Nice to have, not required for MVP launch

## Out of Scope

### R030 — Online payments
- Class: anti-feature
- Status: out-of-scope
- Description: No Paddle/Stripe integration, offline billing only
- Why it matters: Prevents scope creep into payment flows
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Explicitly excluded per spec

### R031 — AI features beyond Box Finder
- Class: anti-feature
- Status: out-of-scope
- Description: No price analytics AI, no description generator, no AI chat assistant
- Why it matters: Keeps AI scope minimal
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Chat module exists in code but is not part of MVP

### R032 — Microservices
- Class: anti-feature
- Status: out-of-scope
- Description: Monolith only in MVP
- Why it matters: Architecture boundary
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: n/a

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | active | M001-1q9eu0/S01 | S02 | mapped |
| R002 | core-capability | active | M001-1q9eu0/S01 | none | mapped |
| R003 | core-capability | active | M001-1q9eu0/S02 | none | mapped |
| R004 | core-capability | active | M001-1q9eu0/S01 | none | mapped |
| R005 | primary-user-loop | active | M001-1q9eu0/S03 | none | mapped |
| R006 | primary-user-loop | active | M001-1q9eu0/S03 | S01 | mapped |
| R007 | primary-user-loop | active | M001-1q9eu0/S04 | S01 | mapped |
| R008 | primary-user-loop | active | M001-1q9eu0/S04 | S01 | mapped |
| R009 | primary-user-loop | active | M001-1q9eu0/S03 | S01 | mapped |
| R010 | continuity | active | M001-1q9eu0/S05 | S01,S02,S03,S04 | mapped |
| R011 | continuity | active | M001-1q9eu0/S02 | none | mapped |
| R012 | launchability | active | M001-1q9eu0/S05 | S02,S04 | unmapped |
| R020 | primary-user-loop | deferred | none | none | unmapped |
| R021 | continuity | deferred | none | none | unmapped |
| R022 | operability | deferred | none | none | unmapped |
| R030 | anti-feature | out-of-scope | none | none | n/a |
| R031 | anti-feature | out-of-scope | none | none | n/a |
| R032 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 12
- Mapped to slices: 12
- Validated: 0
- Unmapped active requirements: 0
