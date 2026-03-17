# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001-1q9eu0 | arch | Auth mechanism | Cookie-based JWT (httpOnly, secure, sameSite=lax) — NOT Bearer tokens | Security best practice for web; SSR compatibility; spec canonical requirement | No |
| D002 | M001-1q9eu0 | api | Operator API prefix split | `/operators/` for profile/registration (section 5), `/operator/` for warehouse/box/booking management (section 6–9) | This is the canonical spec split — two prefixes are intentional, not a bug. Backend already uses `/operator/` correctly for warehouses. Frontend must align to match. | No |
| D003 | M001-1q9eu0 | api | API versioning | URL prefix `/api/v1` | Configured in main.ts as global prefix; all endpoints are under `/api/v1/` | Yes — if version 2 is added |
| D004 | M001-1q9eu0 | convention | Error response format | `{ statusCode, error, message, details, timestamp, path }` | Canonical spec requirement from Error_Handling_Fault_Tolerance_Specification | No |
| D005 | M001-1q9eu0 | arch | Payment processing | No payments in MVP (offline billing only) | Spec decision; Paddle integration deferred to post-MVP | Yes — when payments are added |
| D006 | M001-1q9eu0 | arch | AI features scope | Box Finder only (POST /ai/box-recommendation). No chat, price analytics, or description gen. | Spec decision. Chat module exists in code but is not exposed in MVP. | Yes — post-MVP |
| D007 | M001-1q9eu0 | data | Booking state machine | pending → confirmed → completed; pending/confirmed → cancelled; pending → expired (24h auto) | Canonical spec. BookingsService already implements this. No other transitions are valid. | No |
| D008 | M001-1q9eu0 | arch | Deployment targets | Frontend: Vercel. Backend: Railway. DB: Railway PostgreSQL. Cache: Redis (Railway). | Already deployed. Local dev uses docker-compose. | Yes — if AWS migration happens |
| D009 | M001-1q9eu0 | convention | RBAC roles | guest, user, operator, admin — four roles. UserRole enum in Prisma schema. | Canonical spec. Guards already use these roles. | No |
| D010 | M001-1q9eu0 | arch | Monolith only | Single NestJS monolith — no microservices in MVP | Spec decision. ChatModule exists as a module within the monolith, not a separate service. | Yes — v2 architecture decision |
