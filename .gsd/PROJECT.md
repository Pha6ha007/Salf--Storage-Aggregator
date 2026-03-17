# StorageCompare — Self-Storage Aggregator (UAE)

## What This Is

UAE marketplace connecting people who need storage with warehouse operators. Users search facilities on a map, filter by price/size/features, view photos, and book storage boxes. Operators manage warehouses, boxes, and bookings via a dashboard. AI Box Finder (Claude API) recommends box size based on what the user describes storing. CRM lets operators track leads.

Deployed: frontend on Vercel (https://storagecompare.vercel.app), backend API on Railway (https://api-storagecompare.up.railway.app).

## Core Value

User can find a warehouse, pick a box, and submit a booking request end-to-end. Operator receives and confirms it.

## Current State

**Backend (src/backend/):** ~65% complete. All foundation infrastructure built — Auth (cookie JWT), Warehouses (PostGIS geo search), Boxes, Bookings (full state machine), Reviews, Favorites, CRM, AI Box Finder, Media/S3, Notifications (SendGrid+Twilio), Event Bus (ActivityLog, SearchLog), RAG infrastructure. Missing: Operators module (register/profile/stats endpoints), Admin module (moderation, verification), ~10 API endpoints per spec, booking reject endpoint, review CRUD.

**Frontend (frontend/):** ~50% complete. Auth pages (login/register/forgot/reset), auth provider, catalog page, operator dashboard/warehouses/bookings pages, user bookings/favorites/profile pages, chat widget. Missing: warehouse detail page (WarehouseClient.tsx absent), booking creation flow, operator profile/onboarding, box management UI, booking detail page, review submission form. Home page uses hardcoded mock data.

**Critical API contract mismatch:** Frontend calls `/operators/me/warehouses` and `/operators/warehouses` — backend exposes `/operator/warehouses` (no 's' on operator). All operator/box API calls will 404 until aligned.

## Architecture / Key Patterns

- NestJS 10 monolith, Prisma 5 + PostgreSQL 15/PostGIS + Redis 7
- Cookie-based JWT (httpOnly) — never Bearer tokens
- Next.js 14 App Router, Tailwind CSS + shadcn/ui, React Query + Zustand
- 4 RBAC roles: guest, user, operator, admin
- Booking state machine: pending → confirmed → completed / cancelled / expired (auto-expire 24h)
- Event bus (@nestjs/event-emitter) for all state changes → ActivityLog + SearchLog
- No online payments in MVP (offline billing only)
- Deployed: Vercel (frontend) + Railway (backend)
- API prefix: `/api/v1`

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract.

## Milestone Sequence

- [ ] M001-1q9eu0: MVP Completion — bring backend and frontend to a fully functional state, all flows working end-to-end, ready for operator onboarding
