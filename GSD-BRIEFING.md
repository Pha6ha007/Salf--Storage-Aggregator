# GSD-BRIEFING.md — StorageCompare MVP v1
# Этот файл — входная точка для GSD. Положить в корень репозитория.
# GSD прочитает его при `/gsd` и использует как PROJECT + REQUIREMENTS + ROADMAP.

---

## 1. Проект

**Название:** StorageCompare  
**Домен:** storagecompare.ae  
**Тип:** Self-Storage Aggregator Marketplace  
**Рынок:** UAE (Dubai, Abu Dhabi, Sharjah)  
**Статус:** Pre-development (полная документация готова, код — нет)

**Суть:** Маркетплейс, соединяющий пользователей, которые ищут складские боксы для хранения вещей, с операторами складов. Пользователь ищет по карте, фильтрует, бронирует бокс. Оператор управляет складами, боксами и заявками. AI рекомендует размер бокса по описанию вещей. CRM для обработки лидов.

---

## 2. Технический стек (каноническая спецификация)

| Слой | Технология | Версия | Заметки |
|------|-----------|--------|---------|
| Runtime | Node.js | 20 LTS | |
| Backend Framework | NestJS | 10 | Монолит, модульная структура |
| ORM | Prisma | 5 | Schema-first, миграции |
| Database | PostgreSQL + PostGIS | 15+ | Геопространственные запросы |
| Vector DB | pgvector extension | | Для будущего RAG (подготовить инфру, не активировать) |
| Cache | Redis | 7+ | Sessions, rate limiting, geo cache |
| Auth | Cookie-based JWT (httpOnly) | | НЕ Bearer tokens |
| Validation | class-validator + class-transformer | | DTOs |
| API Docs | Swagger/OpenAPI | | @nestjs/swagger, авто-генерация |
| File Storage | AWS S3 (me-south-1) | | Фото складов |
| Email | SendGrid | | Транзакционные email |
| SMS | Twilio + WhatsApp Business API | | Уведомления |
| Maps | Google Maps API | | Geocoding + отображение |
| AI | Anthropic Claude API | claude-sonnet-4 | Только Box Finder в MVP |
| Events | @nestjs/event-emitter | | Event bus для AI data pipeline |
| Frontend | Next.js 14 (App Router) | | SSR public, CSR auth |
| CSS | Tailwind CSS 3 | | Mobile-first |
| UI Components | shadcn/ui | | Radix-based |
| State | React Query + Zustand | | Server + client state |
| CI/CD | GitHub Actions | | Test → Build → Deploy |
| Hosting | AWS me-south-1 (Bahrain) | | Low latency для UAE/GCC |
| CDN | Cloudflare | | DDoS + static assets |
| Container | Docker + docker-compose | 24+ | Dev + staging + prod |
| Reverse Proxy | Nginx | 1.25+ | SSL, rate limiting |
| Automation | n8n | Latest | Workflow automation |

---

## 3. Каноническая документация (ОБЯЗАТЕЛЬНО читать)

GSD ДОЛЖЕН ссылаться на эти документы при реализации каждого модуля. Приоритет — чем выше в списке, тем важнее:

```
1. Functional_Specification_MVP_v1_CORRECTED.md         → Бизнес-правила, user flows
2. Technical_Architecture_Document_MVP_v1_CANONICAL.md   → Архитектура, компоненты
3. API_Detailed_Specification_MVP_v1_COMPLETE.md         → Все API endpoints, контракты
4. full_database_specification_mvp_v1_CANONICAL.md       → Таблицы, поля, связи
5. DOC-022_Backend_implementation_plan_mvp_v1_CANONICAL.md → Модули, структура, спринты
6. security_and_compliance_plan_mvp_v1_CANONICAL_Dec15.md → JWT, RBAC, PII
7. DESIGN_SYSTEM.md                                       → UI/UX, цвета, шрифты, компоненты
8. DOC-109_AI_Readiness_Infrastructure_Specification.md   → Event Bus, логирование, RAG
```

**Правило No-Drift:** Бэкенд НЕ МОЖЕТ создавать endpoints, таблицы или поля, не определённые в канонических документах. Если нужно — сначала обновить спецификацию, потом код.

---

## 4. Обязательная структура бэкенда

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/                    # database, jwt, redis, s3, google-maps, app
│   ├── common/
│   │   ├── decorators/            # @CurrentUser, @Roles, @Public
│   │   ├── events/                # Domain event classes
│   │   ├── filters/               # HttpException, PrismaException
│   │   ├── guards/                # JwtAuth, Roles, Throttle
│   │   ├── interceptors/          # Logging, Transform
│   │   ├── listeners/             # ActivityLog listener
│   │   ├── middleware/            # Cookie parser, rate limit
│   │   ├── pipes/                 # Validation
│   │   ├── services/              # ActivityLog, SearchLog
│   │   └── utils/                 # slug, pagination, masking
│   ├── modules/
│   │   ├── auth/                  # Cookie-based JWT, signup, login, refresh, logout
│   │   ├── users/                 # Profile CRUD, password change
│   │   ├── operators/             # Registration, profile, verification
│   │   ├── warehouses/            # CRUD, search с PostGIS, map endpoint
│   │   ├── boxes/                 # CRUD, status, availability tracking
│   │   ├── bookings/              # State machine: pending→confirmed→completed/cancelled/expired
│   │   ├── reviews/               # CRUD, rating calc, 1 review per user per warehouse
│   │   ├── favorites/             # Add/remove/list
│   │   ├── crm/                   # Leads, contacts, activities, status pipeline
│   │   ├── ai/                    # Box Finder + RAG infrastructure (не активировать)
│   │   ├── media/                 # S3 upload, image validation
│   │   ├── notifications/         # SendGrid + Twilio + WhatsApp
│   │   └── health/                # /health, /health/db, /health/redis
│   ├── integrations/
│   │   ├── ai/                    # Anthropic SDK wrapper
│   │   ├── maps/                  # Google Maps geocoding
│   │   ├── notifications/         # Email + SMS services
│   │   └── storage/               # S3 client
│   └── database/
│       └── prisma.service.ts
├── prisma/
│   └── schema.prisma              # MUST match Database Specification EXACTLY
├── test/
├── docker-compose.yml
└── Dockerfile
```

---

## 5. Внешние репозитории — стратегия интеграции

### 5.1. Прямые зависимости (npm install)

Эти пакеты ОБЯЗАТЕЛЬНО входят в проект:

| Пакет | npm | Где используется | Как |
|-------|-----|-----------------|-----|
| **@anthropic-ai/sdk** | `npm i @anthropic-ai/sdk` | `modules/ai/ai.service.ts` | Вызовы Claude API для Box Finder. Structured output с JSON schema для рекомендаций. |
| **prisma + @prisma/client** | `npm i prisma @prisma/client` | Весь backend | ORM для всех 20+ таблиц. Schema-first, миграции. |
| **@vis.gl/react-google-maps** | `npm i @vis.gl/react-google-maps` | Frontend: `/catalog`, `/warehouse/[id]` | Map view с кластеризацией маркеров, InfoWindows, radius search display. |
| **n8n** (Docker image) | `docker pull n8nio/n8n` | docker-compose.yml | Workflow automation: booking notifications, reminders, review requests. |
| **@nestjs/event-emitter** | `npm i @nestjs/event-emitter` | `common/events/`, все модули | Internal event bus: booking.created, warehouse.updated, review.created — для AI pipeline. |
| **@nestjs/swagger** | `npm i @nestjs/swagger swagger-ui-express` | `main.ts` | Авто-генерация API документации из DTO decorators. |
| **@nestjs/throttler** | `npm i @nestjs/throttler` | `common/guards/throttle.guard.ts` | Rate limiting per IP/user per endpoint. |
| **bull + @nestjs/bull** | `npm i bull @nestjs/bull` | `jobs/` | Фоновые задачи: expire bookings, send notifications. Redis-backed. |
| **passport + @nestjs/passport** | `npm i passport passport-jwt @nestjs/passport` | `modules/auth/` | JWT strategy для cookie-based auth. |
| **@aws-sdk/client-s3** | `npm i @aws-sdk/client-s3` | `integrations/storage/` | Upload фото складов в S3 me-south-1. Presigned URLs. |
| **@sendgrid/mail** | `npm i @sendgrid/mail` | `integrations/notifications/email.service.ts` | Транзакционные email: booking confirm, password reset. |
| **twilio** | `npm i twilio` | `integrations/notifications/sms.service.ts` | SMS + WhatsApp уведомления. |
| **@googlemaps/google-maps-services-js** | `npm i @googlemaps/google-maps-services-js` | `integrations/maps/` | Geocoding адресов, reverse geocoding. Cache результатов в Redis 30 days. |

### 5.2. Донорские репозитории (copy-paste паттернов)

Из этих репо берём конкретные паттерны и адаптируем:

#### brocoders/nestjs-boilerplate
**URL:** https://github.com/brocoders/nestjs-boilerplate  
**Что берём:**
- `src/auth/` — паттерн cookie-based JWT auth (адаптировать с Bearer на httpOnly cookie)
- `src/files/` — S3 upload service с presigned URLs
- `src/mail/` — SendGrid integration с шаблонами
- `src/config/` — environment-based config с validation
- `src/common/` — pagination util, base entity patterns
- `docker-compose.yml` — production-ready compose с PostgreSQL + Redis
- `src/i18n/` — i18n setup (для будущего мультиязычного UI)
- `.github/workflows/` — CI/CD pipeline для GitHub Actions

**Что НЕ берём:**
- TypeORM (у нас Prisma)
- Social auth (не нужен в MVP)
- Roles модуль (у нас свой RBAC: guest/user/operator/admin)

**Как адаптировать:**
1. Fork auth flow: заменить Bearer на httpOnly cookie + refresh token rotation
2. Перевести entity patterns с TypeORM на Prisma schema
3. Сохранить S3 service почти без изменений (поменять bucket naming)
4. Адаптировать mail templates под наши events (booking, password reset)

#### michu2k/nestjs-booking-system
**URL:** https://github.com/michu2k/nestjs-booking-system  
**Что берём:**
- Паттерн booking CRUD на Prisma + PostgreSQL
- Структура модуля: controller → service → Prisma queries
- Unit и e2e тест setup для booking endpoints
- Docker + PostgreSQL dev setup

**Что НЕ берём:**
- Auth0 (у нас custom JWT)
- Простой booking status (у нас state machine с 5 статусами)

**Как адаптировать:**
1. Взять скелет BookingService и расширить state machine: pending → confirmed → completed / cancelled / expired
2. Добавить auto-expire cron: pending bookings > 24h → expired
3. Добавить row-level locking для предотвращения double-booking
4. Добавить event emission на каждый переход статуса

#### masihmoloodian/GIS (NestJS + PostGIS)
**URL:** https://github.com/masihmoloodian/GIS  
**Что берём:**
- Паттерн PostGIS integration в NestJS
- Raw SQL через Prisma для ST_DWithin, ST_MakePoint, ST_SetSRID
- Docker setup с postgis/postgis:15-3.4 image

**Как адаптировать:**
1. Перенести geo-query паттерны в `modules/warehouses/warehouses.repository.ts`
2. Реализовать `findNearby(lat, lng, radiusKm)` через Prisma.$queryRaw с ST_DWithin
3. Добавить GIST индекс на coordinates column в Prisma migration
4. Кэшировать geocoding результаты в Redis (TTL 30 days)

### 5.3. Архитектурные референсы (изучить, не копировать)

| Репозиторий | Что изучить | Зачем |
|-------------|------------|-------|
| **sadmann7/skateshop** | Каталог с фильтрами на Next.js 14 + shadcn/ui | Паттерн SSR каталога: URL search params → серверный fetch → карточки. Применить к каталогу складов. |
| **adrianhajdin/event_platform** | Listing + detail page + booking flow | Паттерн marketplace flow: search → detail → form → confirmation. Близко к нашему booking flow. |
| **mickasmt/next-saas-stripe-starter** | Roles + admin panel + sidebar layout | Паттерн RBAC в Next.js: middleware route protection, role-based layout switching. Для operator/admin dashboard. |
| **ArditZubaku/reservation-booking-system** | Микросервисная архитектура бронирований | Путь эволюции: монолит → микросервисы. Изучить для v2.0 (payments + notifications services). |
| **ever-co/ever-gauzy** | Enterprise NestJS: CRM, multi-tenancy | Паттерны CRM модуля, data isolation, operator dashboard. |

### 5.4. Документация и справочники

| Ресурс | Для чего |
|--------|----------|
| **nestjs/awesome-nestjs** | Поиск любых NestJS библиотек и паттернов |
| **bytefer/awesome-shadcn-ui** | Готовые UI-компоненты для dashboard |
| **anthropics/anthropic-cookbook** | Примеры промптов и structured output для Claude |
| **docker/awesome-compose** | Production docker-compose конфигурации |
| **n8n-io/n8n-hosting** | Docker/K8s deploy конфигурации для n8n |
| **postgis/postgis** docs | SQL функции: ST_DWithin, ST_MakePoint и т.д. |

---

## 6. Milestones для GSD

GSD должен декомпозировать проект в эти milestones. Каждый milestone = shippable increment.

### M001 — Infrastructure & Foundation
**Цель:** Проект запускается локально, все сервисы работают, CI/CD настроен.

**Slices:**
1. **Project scaffolding** — NestJS init, Prisma setup, docker-compose (PostgreSQL+PostGIS+Redis+n8n), Dockerfile, .env.example
2. **Common infrastructure** — Config module, Prisma service, Redis service, health endpoints, logging, error filters, validation pipe
3. **Auth module** — Cookie-based JWT, signup, login, refresh, logout, password reset, email verification. Guards: JwtAuthGuard, RolesGuard.
4. **Users module** — Profile CRUD, password change, account deletion (soft delete)
5. **CI/CD** — GitHub Actions: lint → test → build → docker push. Staging deploy.

**Ключевые решения:**
- Cookie-based JWT (httpOnly) — НЕ Bearer tokens
- 4 роли: guest, user, operator, admin
- Prisma schema MUST match Database Specification exactly

### M002 — Core Marketplace
**Цель:** Оператор может создать склад с боксами, пользователь может искать и бронировать.

**Slices:**
1. **Operators module** — Registration, profile, verification queue (admin)
2. **Warehouses module** — CRUD, PostGIS search (ST_DWithin), Google Maps geocoding, filters (price, size, features, distance), sorting, map endpoint с кластеризацией
3. **Boxes module** — CRUD, status management (available/reserved/occupied/maintenance), size categories (S/M/L/XL), pricing
4. **Bookings module** — State machine (pending→confirmed→completed/cancelled/expired), auto-expire cron 24h, row-level locking, price calculation
5. **Reviews module** — CRUD, rating calculation (denormalized), 1 review per user per warehouse
6. **Favorites module** — Add/remove/list
7. **Media module** — S3 upload, image validation, presigned URLs

### M003 — CRM + AI + Events
**Цель:** Оператор получает CRM с лидами, AI рекомендует размер бокса, event bus собирает данные.

**Slices:**
1. **CRM/Leads module** — CRUD leads, contacts, activities. Status pipeline: new → contacted → in_progress → closed.
2. **AI Box Finder** — POST /ai/box-recommendation. Claude API integration. Structured output. Rule-based fallback. Request logging.
3. **Event Bus** — @nestjs/event-emitter. Event classes для booking, warehouse, box, user, review, CRM. ActivityLogListener.
4. **Search logging** — search_logs table, log queries + clicks + conversions
5. **RAG Infrastructure** — Embedding service, knowledge chunk CRUD, vector similarity search. НЕ активировать — только подготовить.

### M004 — Notifications + Admin
**Цель:** Уведомления работают, admin может модерировать контент.

**Slices:**
1. **Notifications module** — SendGrid email + Twilio SMS/WhatsApp. NotificationListener на Event Bus. Templates для booking events.
2. **n8n workflows** — Booking notifications, reminders (24h before), review requests (1 day after completion), booking expiration.
3. **Admin endpoints** — Operator verification queue, warehouse moderation, user management, system settings.
4. **Rate limiting** — Per IP, per user, per plan tier. Per endpoint limits из Rate Limiting Specification.

### M005 — Frontend (Public)
**Цель:** Публичный сайт: главная, каталог, детальная страница склада, карта.

**Slices:**
1. **Next.js setup** — App Router, Tailwind + shadcn/ui, React Query provider, Zustand stores, Google Maps setup, cookie auth context
2. **Layout** — Header, footer, navigation. Mobile-first. SEO meta tags.
3. **Home page** — Hero с search, popular locations, featured warehouses
4. **Catalog page** — SSR listing с фильтрами через URL params, сортировка, пагинация, карточки складов
5. **Map view** — Google Maps с маркерами, кластеризация, InfoWindows с preview
6. **Warehouse detail** — Photos gallery, info, boxes table с ценами, reviews, location on map, AI Box Finder button
7. **Static pages** — About, Contact, FAQ, Privacy Policy, Terms

### M006 — Frontend (Auth + User)
**Цель:** Авторизация, личный кабинет, бронирование.

**Slices:**
1. **Auth pages** — Login, Register, Forgot password, Reset password
2. **User dashboard** — Profile, bookings list, favorites
3. **Booking flow** — Box selection → date picker → contact info → submit → confirmation
4. **Booking management** — View booking details, cancel booking
5. **Review submission** — After completed booking

### M007 — Frontend (Operator)
**Цель:** Оператор управляет складами, боксами, заявками.

**Slices:**
1. **Operator dashboard** — Key metrics widgets (bookings, occupancy), recent activity
2. **Warehouse management** — List, create, edit warehouses. Photo upload. Status toggle.
3. **Box management** — CRUD boxes, pricing, availability
4. **Booking management** — Incoming requests, confirm/reject, active bookings
5. **CRM panel** — Leads list, status updates, notes

### M008 — Testing + Deploy
**Цель:** Код протестирован, задеплоен на staging и production.

**Slices:**
1. **Unit tests** — >70% coverage для business logic (bookings, auth, AI)
2. **Integration tests** — >95% для critical API endpoints (booking flow, auth)
3. **E2E tests** — Cypress/Playwright: search → detail → booking → confirmation
4. **Security hardening** — Pen-test checklist, CORS, CSP headers, input sanitization
5. **Staging deploy** — Docker → AWS me-south-1, Cloudflare CDN, Nginx, monitoring
6. **Production deploy** — Blue-green deployment, smoke tests, operator onboarding (5-10 UAE operators)

---

## 7. Критические правила для GSD

### Что GSD ДОЛЖЕН делать:
- Перед реализацией любого модуля — прочитать соответствующий канонический документ
- Prisma schema MUST match `full_database_specification_mvp_v1_CANONICAL.md` EXACTLY
- API endpoints MUST match `API_Detailed_Specification_MVP_v1_COMPLETE.md` EXACTLY
- Каждый booking transition — emit event через Event Bus
- Все API responses — через canonical error format из Error Handling Specification
- Logging — по Logging Strategy (structured JSON, Winston)

### Что GSD НЕ ДОЛЖЕН делать:
- НЕ создавать endpoints не из API спецификации
- НЕ добавлять таблицы/поля не из Database Specification
- НЕ использовать Bearer tokens (ТОЛЬКО httpOnly cookies)
- НЕ включать AI фичи кроме Box Finder (НЕТ price analysis, description gen, chat)
- НЕ строить микросервисы (монолит в MVP)
- НЕ добавлять online payments (MVP = offline billing)
- НЕ использовать Telegram notifications

### State Machine для Bookings (каноническая):
```
pending → confirmed → completed
pending → cancelled (user cancel OR operator reject)
pending → expired (auto after 24h)
confirmed → cancelled (user or operator)
confirmed → completed (rental period ends)
```

### Роли (RBAC):
```
guest    — поиск, просмотр, AI Box Finder
user     — + бронирование, избранное, отзывы, профиль
operator — + управление складами/боксами/заявками, CRM
admin    — + модерация, верификация операторов, настройки
```

---

## 8. GSD Preferences (рекомендация)

Файл `.gsd/preferences.md` для этого проекта:

```yaml
---
version: 1
models:
  research: claude-sonnet-4-6
  planning: claude-sonnet-4-6
  execution: claude-sonnet-4-6
  completion: claude-sonnet-4-6
token_profile: balanced
skill_discovery: suggest
auto_supervisor:
  soft_timeout_minutes: 25
  idle_timeout_minutes: 15
  hard_timeout_minutes: 40
budget_ceiling: 100.00
unique_milestone_ids: true
---
```

---

## 9. Порядок запуска GSD

```bash
# 1. Установить GSD
npm install -g gsd-pi

# 2. Перейти в корень проекта
cd storagecompare

# 3. Убедиться что GSD-BRIEFING.md, CLAUDE.md, DESIGN_SYSTEM.md в корне
# 4. Все канонические спецификации в docs/

# 5. Запустить GSD
gsd

# 6. GSD прочитает GSD-BRIEFING.md и предложит создать .gsd/ структуру
# 7. Подтвердить milestone M001, запустить:
/gsd auto

# 8. Во втором терминале можно стирить:
gsd
/gsd discuss    # обсудить архитектурные решения
/gsd status     # проверить прогресс
```

---

**Последнее обновление:** 2026-03-16  
**Версия:** 1.0  
**Автор:** Development Team
