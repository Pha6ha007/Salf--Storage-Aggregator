# S02: Admin Module + Notifications

**Goal:** Admin can approve/reject operators and warehouses; booking events trigger real email delivery.

**Demo:** `GET /api/v1/admin/operators/pending` returns list of unverified operators. Booking created event sends email to operator inbox (verified via SendGrid activity log or test email).

## Must-Haves

- `GET /admin/operators` — list operators with filters (role=admin required)
- `POST /admin/operators/:id/approve` — sets operator.isVerified=true
- `POST /admin/operators/:id/reject` — marks operator as rejected (deactivates account)
- `GET /admin/warehouses` with `?status=pending_moderation` filter — lists warehouses awaiting review
- `POST /admin/warehouses/:id/approve` — sets warehouse.status=active
- `POST /admin/warehouses/:id/reject` — sets warehouse.status=blocked with reason
- `GET /admin/users` — list users (already partially exists via UsersController; move to admin prefix)
- `POST /admin/users/:id/suspend` — sets user.isActive=false
- `POST /admin/users/:id/restore` — sets user.isActive=true
- All admin endpoints return 403 if user role is not admin
- Notification pipeline confirmed: booking created → operator email delivered (verified by log or SendGrid dashboard)

## Tasks

- [ ] **T01: Admin Module (Backend)**
  Build `src/backend/src/modules/admin/` — controller for operator verification, warehouse moderation, user management. All routes under `/admin/` prefix, all require admin role.

- [ ] **T02: Notifications Pipeline Verification + Railway Env**
  Verify SENDGRID_API_KEY and TWILIO_* are set on Railway. Write a test endpoint or script to trigger a booking.created event and confirm email delivery. Document which env vars are missing.

## Files Likely Touched

**Backend:**
- `src/backend/src/modules/admin/admin.module.ts` (new)
- `src/backend/src/modules/admin/admin.controller.ts` (new)
- `src/backend/src/modules/admin/admin.service.ts` (new)
- `src/backend/src/app.module.ts` (add AdminModule)
