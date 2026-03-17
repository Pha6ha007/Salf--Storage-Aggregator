# S01: Backend API Gaps + Contract Fix — UAT

**For human verification when convenient. Agent does not wait for results.**

## Setup

1. Backend running: https://api-storagecompare.up.railway.app
2. Swagger docs: https://api-storagecompare.up.railway.app/api/v1/docs

## Test 1: Operators module exists

```bash
curl -X POST https://api-storagecompare.up.railway.app/api/v1/operators/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test-op@test.ae","password":"Test1234!","password_confirmation":"Test1234!","name":"Test Operator","phone":"+971501234567","company_name":"Test Storage LLC","agree_to_terms":true,"agree_to_privacy":true}'
```
Expected: 201 response with operator object. Set-Cookie headers present.

## Test 2: Operator profile (without auth returns 401)

```bash
curl https://api-storagecompare.up.railway.app/api/v1/operators/me
```
Expected: 401 Unauthorized

## Test 3: Booking reject endpoint exists

```bash
curl -X PUT https://api-storagecompare.up.railway.app/api/v1/operator/bookings/999/reject
```
Expected: 401 Unauthorized (endpoint exists, just not authorized)

## Test 4: Public box detail endpoint exists

```bash
curl https://api-storagecompare.up.railway.app/api/v1/boxes/1
```
Expected: 200 with box data or 404 (not 405 Method Not Allowed)

## Test 5: Review endpoints exist

```bash
curl -X PUT https://api-storagecompare.up.railway.app/api/v1/reviews/1
```
Expected: 401 Unauthorized (not 404)

## Test 6: Warehouse status endpoint exists

```bash
curl -X PATCH https://api-storagecompare.up.railway.app/api/v1/operator/warehouses/1/status
```
Expected: 401 Unauthorized (not 404)

## Test 7: Frontend catalog loads without 404s

1. Open https://storagecompare.vercel.app/catalog
2. Open browser DevTools → Network tab
3. Verify no 404 errors on API calls
