# Deploy Checklist — M001 MVP

## 1. Railway Auto-Deploy
Railway should trigger on push to `main`. Check the Railway dashboard for build status.

Build command in Railway should be: `npm run build` (which runs `prisma generate && nest build`)
Start command: `npm run deploy` (which runs `prisma migrate deploy && node dist/main.js`)

## 2. Required Environment Variables on Railway

Verify these are set in Railway → Backend service → Variables:

### Required (app won't start without these)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<strong random string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1
APP_URL=https://your-backend.railway.app
```

### Needed for warehouse creation (has graceful fallback)
```
GOOGLE_MAPS_API_KEY=<key>
```

### Needed for email notifications (graceful fallback — just won't send)
```
SENDGRID_API_KEY=<key>
SENDGRID_FROM=noreply@storagecompare.ae
```

### Needed for SMS (graceful fallback)
```
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=+971...
```

### Needed for file uploads (graceful fallback)
```
AWS_REGION=me-south-1
AWS_S3_BUCKET=storagecompare-media
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
```

### Needed for AI Box Finder
```
ANTHROPIC_API_KEY=<key>
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

## 3. Verify Health Endpoint
```bash
curl https://your-backend.railway.app/api/v1/health
# Expected: { "status": "ok", "timestamp": "...", "uptime": ... }
```

## 4. Create First Admin User
After deploy, run this on the Railway database (via Railway shell or psql):
```sql
-- Find your user (after registering via /auth/register)
UPDATE users SET role = 'admin' WHERE email = 'your@email.ae';
```

Or use the Railway shell:
```bash
npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.update({ where: { email: 'your@email.ae' }, data: { role: 'admin' } }).then(console.log);
"
```

## 5. Smoke Test Sequence
1. `GET /api/v1/health` → 200 ok
2. `POST /api/v1/auth/register` with user data → 201, cookie set
3. `GET /api/v1/users/me` with cookie → 200 user object
4. `POST /api/v1/operators/register` with operator data → 201, cookies set
5. `GET /api/v1/operators/me` → 200 operator profile
6. (As admin) `GET /api/v1/admin/operators?verified=false` → pending operators list
7. (As admin) `POST /api/v1/admin/operators/:id/approve` → operator verified
8. (As operator) `POST /api/v1/operator/warehouses` → warehouse created in draft
9. `GET /api/v1/warehouses` → public catalog (may be empty if no active warehouses)

## 6. Frontend (Vercel / whatever hosts it)
Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

Then deploy / redeploy.

## 7. End-to-End Operator Onboarding Test
1. Register as operator → `POST /operators/register`
2. Admin approves → `POST /admin/operators/:id/approve`
3. Operator creates warehouse → warehouse status = `draft`
4. Operator submits for review → `PATCH /operator/warehouses/:id/status` with `{ status: "pending_moderation" }`
5. Admin approves warehouse → `POST /admin/warehouses/:id/approve` → status = `active`
6. User sees warehouse in catalog → `GET /warehouses?status=active`
7. User creates booking → `POST /bookings`
8. Operator confirms booking → `POST /operator/bookings/:id/confirm`
9. Email sent to user (if SendGrid configured)
