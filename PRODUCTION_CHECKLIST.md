# Production Readiness Checklist

Complete checklist before deploying to production.

## ✅ Security

### Код и архитектура
- [x] Все секреты в переменных окружения (не в коде)
- [x] JWT_SECRET обязателен — приложение не стартует без него
- [x] bcrypt(10) для хешей паролей
- [x] CORS: строгий allowlist, никаких wildcard `*.vercel.app`
- [x] Rate limiting на всех эндпоинтах (глобально + per-route)
- [x] Input validation на всех эндпоинтах (class-validator, whitelist)
- [x] SQL injection защита (Prisma параметризованные запросы)
- [x] Cookies: httpOnly, secure, sameSite:strict (production)
- [x] Refresh token scoped path `/api/v1/auth/refresh`
- [x] passwordHash никогда не возвращается клиенту (Prisma select{})
- [x] Trust proxy настроен для Railway (только 1 hop)

### HTTP заголовки (Helmet)
- [x] Content-Security-Policy (`default-src 'self'`)
- [x] Strict-Transport-Security (HSTS, 1 год, preload)
- [x] X-Frame-Options: DENY (защита от clickjacking)
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] X-Powered-By: скрыт (не раскрывает Express)

### Swagger / API документация
- [x] Swagger отключён в production (`NODE_ENV=production`)
- [x] В development доступен только на localhost

### Эндпоинты
- [x] `/health/seed` закрыт за `@Roles(admin)` — не публичный
- [x] Пароли не возвращаются в ответах API
- [x] 500-ошибки: в production не содержат stack trace и query params

### CI/CD — автоматическое сканирование
- [x] CodeQL (статический анализ кода на injection, XSS, path traversal)
- [x] TruffleHog (поиск утечек API ключей в git history)
- [x] npm audit production deps (блокирует на high/critical)
- [x] Pattern scan (regex поиск хардкод секретов)
- [x] Dependabot (еженедельные PR с обновлениями зависимостей)
- [x] Security gate: все checks должны пройти перед merge

### Мониторинг
- [x] Sentry интегрирован (instrument.ts + SentryModule)
- [x] Sentry scrubbing: auth_token, password, cookies не отправляются
- [ ] **TODO**: Добавить SENTRY_DSN в Railway переменные
- [ ] **TODO**: Настроить Sentry алерты (email / Slack)

### GitHub Security Settings (ручная настройка)
- [ ] **TODO**: Включить Secret scanning в Settings → Security
- [ ] **TODO**: Включить Push protection (блокирует коммит с ключами)
- [ ] **TODO**: Включить Dependabot alerts
- [ ] **TODO**: Включить CodeQL в Settings → Code security

### Пост-деплой
- [ ] **TODO**: Сменить пароль admin после первого деплоя
- [ ] **TODO**: Проверить security headers: `curl -I https://api.storagecompare.ae/api/v1/health`
- [ ] **TODO**: Убедиться что `/api/v1/docs` возвращает 404 в production
- [ ] **TODO**: Настроить ротацию API ключей (раз в 90 дней)

## ✅ Backend (Railway)

- [x] Procfile configured for migrations + start
- [x] package.json has correct scripts (build, start:prod, postinstall)
- [x] Node version specified in engines
- [x] Health check endpoint available (/api/v1/health)
- [x] Database migrations automated
- [x] Prisma Client generation in postinstall
- [x] Environment variables documented (.env.production.example)
- [x] CORS includes all required origins
- [x] PORT reads from process.env.PORT (Railway dynamic port)
- [x] Listen on 0.0.0.0 for Railway networking
- [x] Production seeder script created
- [x] Error handling returns generic messages (no stack traces)
- [ ] **TODO**: Configure log aggregation (Datadog/Sentry)
- [ ] **TODO**: Set up monitoring alerts

## ✅ Frontend (Vercel)

- [x] vercel.json configured
- [x] next.config.mjs production-ready
- [x] Environment variables use NEXT_PUBLIC_* correctly
- [x] No hardcoded localhost URLs
- [x] API client uses process.env.NEXT_PUBLIC_API_URL
- [x] Security headers configured in vercel.json
- [x] Image domains whitelisted
- [x] output: 'standalone' for optimal builds
- [x] .env.production.example documented
- [ ] **TODO**: Test all user flows in preview deployment
- [ ] **TODO**: Run Lighthouse audit (target: 90+ Performance)

## ✅ Database

- [x] PostgreSQL with PostGIS extension
- [x] pgvector extension for RAG ready
- [x] uuid-ossp extension enabled
- [x] All migrations tested locally
- [x] Migration rollback strategy documented
- [x] Indexes on frequently queried columns
- [x] Soft delete implemented (deletedAt)
- [ ] **TODO**: Set up automated backups on Railway
- [ ] **TODO**: Test database restore procedure
- [ ] **TODO**: Monitor query performance

## ✅ Redis

- [x] Redis configured for sessions
- [x] Redis URL from Railway environment
- [x] Graceful fallback if Redis unavailable
- [ ] **TODO**: Configure Redis persistence on Railway
- [ ] **TODO**: Monitor Redis memory usage

## ✅ External Services

### Required for MVP
- [ ] **Google Maps API**
  - [ ] Get production API key
  - [ ] Set HTTP Referrer restrictions
  - [ ] Enable Geocoding API
  - [ ] Enable Maps JavaScript API
  - [ ] Test on production domain

- [ ] **Anthropic Claude API**
  - [ ] Get production API key
  - [ ] Test box-finder in production
  - [ ] Monitor usage/costs

### Optional (can enable later)
- [ ] **AWS S3** (media uploads)
  - [ ] Create production bucket
  - [ ] Configure CORS for Vercel domain
  - [ ] Set up IAM user with minimal permissions
  - [ ] Test file upload flow

- [ ] **SendGrid** (emails)
  - [ ] Verify sender domain (storagecompare.ae)
  - [ ] Create email templates
  - [ ] Test transactional emails

- [ ] **Twilio** (SMS/WhatsApp)
  - [ ] Get production credentials
  - [ ] Verify phone numbers
  - [ ] Test WhatsApp business API

- [ ] **Paddle** (payments)
  - [ ] Switch from sandbox to production
  - [ ] Configure webhooks
  - [ ] Test payment flow

## ✅ Testing

- [x] Unit tests written for core services
- [x] E2E tests for authentication flow
- [x] E2E tests for warehouse CRUD
- [x] Component tests for UI elements
- [x] Test coverage >60% (frontend), >70% (backend)
- [ ] **TODO**: Run full test suite before deployment
- [ ] **TODO**: Test in production-like environment
- [ ] **TODO**: Load testing with realistic traffic

## ✅ Performance

- [ ] **Frontend**
  - [ ] Lighthouse score >90 Performance
  - [ ] Images optimized and lazy loaded
  - [ ] Code splitting implemented
  - [ ] Static pages pre-rendered where possible
  - [ ] CDN configured (Vercel handles this)

- [ ] **Backend**
  - [ ] Database queries optimized with indexes
  - [ ] N+1 queries eliminated
  - [ ] Response caching where appropriate
  - [ ] Rate limiting prevents abuse
  - [ ] API response times <500ms

## ✅ Monitoring & Logging

- [x] Structured logging in backend
- [x] Error logging with context (method, path, statusCode, userId, responseTime)
- [x] Request/response logging middleware
- [x] Health check endpoint (`/api/v1/health` — public, `/api/v1/health/detailed` — admin only)
- [x] Sentry error monitoring integrated (`src/instrument.ts`)
- [x] Sentry captures all 500-errors with request context and userId
- [x] Sensitive fields scrubbed before sending to Sentry (cookies, passwords)
- [ ] **TODO**: Add `SENTRY_DSN` to Railway environment variables
- [ ] **TODO**: Set up Sentry alert rules (email/Slack on new errors)
- [ ] **TODO**: Set up uptime monitoring (UptimeRobot or Better Uptime)
- [ ] **TODO**: Configure log retention policy on Railway

## ✅ Documentation

- [x] README.md with project overview and security section
- [x] DEPLOYMENT.md with deployment steps
- [x] DOCKER.md for local development
- [x] CI-CD.md for GitHub Actions
- [x] TESTING.md for test suite
- [x] SECURITY_SETUP.md — security tools activation guide
- [x] API documentation via Swagger (development only)
- [x] Environment variables documented (.env.example, .env.production.example)
- [ ] **TODO**: Create operator user guide
- [ ] **TODO**: Create API usage examples

## ✅ Legal & Compliance

- [ ] **TODO**: Privacy Policy page
- [ ] **TODO**: Terms of Service page
- [ ] **TODO**: Cookie Consent (if EU users)
- [ ] **TODO**: GDPR compliance (if EU users)
- [ ] **TODO**: Data retention policy
- [ ] **TODO**: Backup & disaster recovery plan

## ✅ DNS & Domain

- [ ] **Custom Domain Setup**
  - [ ] Purchase storagecompare.ae domain
  - [ ] Configure DNS for Vercel (www, @)
  - [ ] Configure DNS for Railway (api)
  - [ ] SSL certificates (auto via Vercel/Railway)
  - [ ] Test all domain variations
  - [ ] Set up email forwarding (optional)

## ✅ Post-Deployment

### Immediate (Day 1)
- [ ] Monitor logs for errors
- [ ] Test all critical user flows
- [ ] Verify health checks passing
- [ ] Test authentication
- [ ] Create admin user
- [ ] Change admin password
- [ ] Test warehouse creation
- [ ] Test booking flow
- [ ] Test email notifications
- [ ] Test WhatsApp bot (if configured)

### Week 1
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Review database performance
- [ ] Check cache hit rates
- [ ] Monitor costs (Railway, Vercel, APIs)
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries

### Month 1
- [ ] Review security audit
- [ ] Analyze user behavior
- [ ] Optimize conversion funnel
- [ ] Plan feature priorities
- [ ] Set up backup schedule
- [ ] Test disaster recovery
- [ ] Review and update docs

## ✅ Rollback Plan

- [x] Documented in DEPLOYMENT.md
- [x] Vercel: Instant rollback via dashboard
- [x] Railway: Redeploy previous version
- [ ] **TODO**: Database backup before risky migrations
- [ ] **TODO**: Test rollback procedure in staging

## 🎯 Deployment Priority

### Phase 1: Core Infrastructure (Week 1)
1. ✅ Prepare backend for Railway
2. ✅ Prepare frontend for Vercel
3. ✅ Create deployment documentation
4. ⏳ Deploy backend to Railway
5. ⏳ Deploy frontend to Vercel
6. ⏳ Test basic functionality

### Phase 2: External Services (Week 2)
1. ⏳ Configure Google Maps API
2. ⏳ Configure Anthropic Claude API
3. ⏳ Set up AWS S3 (optional)
4. ⏳ Configure SendGrid (optional)
5. ⏳ Test all integrations

### Phase 3: Custom Domain (Week 3)
1. ⏳ Purchase domain
2. ⏳ Configure DNS
3. ⏳ Set up SSL
4. ⏳ Update environment variables
5. ⏳ Test production URLs

### Phase 4: Monitoring & Optimization (Week 4)
1. ⏳ Set up error tracking
2. ⏳ Configure uptime monitoring
3. ⏳ Performance optimization
4. ⏳ Load testing
5. ⏳ Security audit

## 📝 Notes

- This checklist should be reviewed before EVERY production deployment
- Update checklist as new requirements emerge
- Mark items complete only after thorough testing
- Keep this document in version control

---

**Last Updated**: 2026-03-02
**Next Review**: Before first production deployment
