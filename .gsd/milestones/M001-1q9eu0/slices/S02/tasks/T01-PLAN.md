# T01: Admin Module (Backend)

**Slice:** S02
**Milestone:** M001-1q9eu0

## Goal

Build `src/backend/src/modules/admin/` with operator verification, warehouse moderation, and user management endpoints. All routes under `/admin/` prefix, all require admin role.

## Must-Haves

### Truths
- `GET /api/v1/admin/operators` returns paginated operator list, 403 if not admin
- `POST /api/v1/admin/operators/:id/approve` sets operator.isVerified=true, returns updated operator
- `POST /api/v1/admin/operators/:id/reject` deactivates operator user (isActive=false), returns confirmation
- `GET /api/v1/admin/warehouses?status=pending_moderation` returns warehouses awaiting review
- `POST /api/v1/admin/warehouses/:id/approve` sets warehouse.status=active
- `POST /api/v1/admin/warehouses/:id/reject` sets warehouse.status=blocked
- `GET /api/v1/admin/users` returns paginated user list with search/filter
- `POST /api/v1/admin/users/:id/suspend` sets user.isActive=false, revokes all refresh tokens
- `POST /api/v1/admin/users/:id/restore` sets user.isActive=true

### Artifacts
- `src/backend/src/modules/admin/admin.module.ts`
- `src/backend/src/modules/admin/admin.controller.ts` — all endpoints with `@Roles(UserRole.admin)`
- `src/backend/src/modules/admin/admin.service.ts` — real implementations
- `src/backend/src/app.module.ts` — AdminModule imported

### Key Links
- `admin.controller.ts` uses `@Roles(UserRole.admin)` + `@UseGuards(JwtAuthGuard, RolesGuard)` on all routes
- `admin.service.ts` → PrismaService for DB operations
- Approve operator emits event (fire-and-forget, wrapped in try/catch)
- Suspend user revokes all refresh tokens (same pattern as auth logout)

## Steps

1. Create `admin.module.ts` — imports PrismaModule
2. Create `admin.service.ts` with these methods:
   - `listOperators(page, perPage, filters)` — findMany operator with user join, filter by isVerified
   - `approveOperator(id)` — update operator.isVerified=true, operator.verifiedAt=now
   - `rejectOperator(id, reason)` — update user.isActive=false on the operator's user
   - `listWarehouses(page, perPage, status?)` — findMany warehouse with operator join
   - `approveWarehouse(id, adminNotes?)` — update warehouse.status=active
   - `rejectWarehouse(id, reason)` — update warehouse.status=blocked
   - `listUsers(page, perPage, search?, role?, status?)` — findMany user with booking/review counts
   - `suspendUser(id, reason)` — update user.isActive=false, revoke all refresh tokens
   - `restoreUser(id)` — update user.isActive=true
3. Create `admin.controller.ts` with all 9 routes
4. Register AdminModule in app.module.ts
5. Run `npx nest build` — verify zero errors

## Context

- All routes require `@Roles(UserRole.admin)` — use RolesGuard
- Refresh token revoke pattern: `prisma.refreshToken.updateMany({ where: { userId }, data: { revokedAt: new Date() } })` — same as in auth.service.ts logout
- Admin spec: `docs/core/DOC-101_Internal_Admin_API_Specification_MVP_v1.md`
- Operator approve should NOT automatically activate the warehouse — operator must separately set warehouse to pending_moderation and admin approves the warehouse
- Keep it simple: no audit log per-action required for MVP (EventLog already captures things via event bus)
