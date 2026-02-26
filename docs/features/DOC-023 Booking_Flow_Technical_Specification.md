# Booking Flow — Supporting Technical Specification (Reference Document)
## MVP Self-Storage Aggregator

---

**Версия документа:** 1.0  
**Дата:** 11 декабря 2025  
**Статус:** Final  
**Авторы:** Technical Team  

---

> ⚠️ **Document Status: Supporting / Non-Canonical**
>
> This document is a supporting reference that describes the booking flow
> from a business and user interaction perspective.
>
> It does NOT define canonical:
> - booking states
> - API contracts
> - data models
> - architectural decisions
>
> Canonical sources of truth:
> - DOC-001 — MVP Requirements Specification
> - DOC-002 — High-Level Technical Architecture
> - DOC-015 — API Design Blueprint
> - DOC-016 — API Detailed Specification
> - DOC-050 — Full Database Specification
>
> In case of conflicts, canonical documents always take precedence.

---

## 📋 Table of Contents

### PART 1: Introduction & Architecture (Sections 1-2)
1. **Введение**
   - 1.1. Цель документа
   - 1.2. Участники процесса
   - 1.3. Заявка vs бронирование
   - 1.4. Ограничения MVP vs v2

2. **Архитектура**
   - 2.1. Компоненты системы
   - 2.2. Sequence diagram создания заявки
   - 2.3. Хранилище данных (DB, Redis, S3)
   - 2.4. Ключевые метрики и SLA

### PART 2: User Experience & Business Logic (Sections 3-4)
3. **UX и пользовательские сценарии**
   - 3.1. Полный booking flow (7 шагов)
   - 3.2. UI states и loading
   - 3.3. Edge cases (6 сценариев)
   - 3.4. Wireframes (Desktop/Mobile/Tablet)

4. **Бизнес-логика создания заявки**
   - 4.1. Required fields
   - 4.2. Rate limiting
   - 4.3. Availability checks
   - 4.4. Validation rules
   - 4.5. Booking creation
   - 4.6. Operator assignment
   - 4.7. Reservation logic (MVP vs v2)

### PART 3: Status Management & API Part 1 (Sections 5-6.5)
5. **Статусы заявки**
   - 5.1. Список статусов (10 штук)
   - 5.2. Схема переходов (state machine)
   - 5.3. Тайминги и авто-переходы
   - 5.4. Логи изменений

6. **API Specification (Part 1)**
   - 6.1. POST /api/v1/bookings
   - 6.2. GET /api/v1/bookings/{id}
   - 6.3. GET /api/v1/user/bookings
   - 6.4. PATCH /api/v1/bookings/{id}
   - 6.5. GET /api/v1/operator/bookings

### PART 4: API Completion & Integrations (Sections 6.6-8)
6. **API Specification (Part 2)**
   - 6.6. POST /api/v1/bookings/{id}/confirm
   - 6.7. POST /api/v1/bookings/{id}/reject
   - 6.8. POST /api/v1/bookings/{id}/cancel
   - 6.9. Ошибки Booking API (9 типов)
   - 6.10. Роли доступа

7. **Интеграция с операторским рабочим местом**
   - 7.1. Как оператор видит заявки
   - 7.2. Сортировка по Lead Score
   - 7.3. Комментарии
   - 7.4. Напоминания
   - 7.5. История взаимодействий

8. **Логика уведомлений**
   - 8.1. Какие уведомления отправляются пользователю
   - 8.2. Уведомления оператору
   - 8.3. Форматы сообщений
   - 8.4. Каналы доставки
   - 8.5. Retry-политика

### PART 5: AI Integration & System Reliability (Sections 9-11)
9. **Интеграция AI**
   - 9.1. AI Box Recommendation
   - 9.2. AI Lead Scoring для приоритизации заявок
   - 9.3. AI Price Suggestion
   - 9.4. AI Fraud Detection (v2)

10. **Ошибки, нештатные ситуации и обработка edge cases**
    - 10.1. Бокс внезапно недоступен
    - 10.2. Ошибки сервера
    - 10.3. Проблемы с SMS/email
    - 10.4. Спам-заявки
    - 10.5. Обход rate-limits

11. **Monitoring & Logging**
    - 11.1. Какие метрики мы собираем
    - 11.2. Какие логи должны сохраняться
    - 11.3. Correlation ID для цепочек запросов
    - 11.4. Alerting
    - 11.5. Dashboards

### PART 6: Data, Performance, Compliance & Roadmap (Sections 12-16)
12. **Правила валидации данных**
    - 12.1. Форматы телефонов
    - 12.2. Размеры строк
    - 12.3. Неверные идентификаторы
    - 12.4. Антибот-проверки
    - 12.5. Required fields

13. **Модель данных**
    - 13.1. Таблица bookings
    - 13.2. Связи с пользователем
    - 13.3. Связи с боксом и складом
    - 13.4. Индексация
    - 13.5. Таблица booking_status_history
    - 13.6. Таблица booking_comments

14. **Performance требования**
    - 14.1. Booking API latency
    - 14.2. Массовые запросы оператора
    - 14.3. Кэширование справочников
    - 14.4. Database optimization
    - 14.5. Load testing scenarios

15. **Compliance, юридические требования**
    - 15.1. Согласие на обработку данных
    - 15.2. Логирование персональных данных
    - 15.3. Условия использования
    - 15.4. Договор аренды (v2)
    - 15.5. Data subject rights

16. **Ограничения MVP и Roadmap**
    - 16.1. Что делаем в MVP
    - 16.2. Что добавляем в v1.1
    - 16.3. Что появится в v2+
    - 16.4. Known limitations MVP
    - 16.5. Technical debt

---

## 📊 Document Statistics

| Metric | Value |
|--------|-------|
| Total Sections | 16 |
| Subsections | ~350 |
| Total Characters | ~120,000 |
| Code Examples | 150+ |
| SQL Schemas | 10+ |
| API Endpoints | 10 |
| JSON Examples | 50+ |
| Diagrams | 5 |
| Tables | 100+ |

---

## 🎯 Quick Navigation

**For Product Managers:**
- Sections 1, 3, 16 — Scope & Roadmap
- Section 2.4 — Key Metrics
- Section 15 — Compliance

**For Backend Developers:**
- Sections 4, 6, 13 — Core Implementation
- Sections 9, 10 — Advanced Features
- Section 14 — Performance

**For Frontend Developers:**
- Section 3 — UX Scenarios
- Section 6 — API Contracts
- Section 12 — Validation Rules

**For DevOps Engineers:**
- Section 2 — Architecture
- Section 11 — Monitoring
- Section 14 — Performance Requirements

**For QA Engineers:**
- Section 3.3 — Edge Cases
- Section 10 — Error Scenarios
- Section 14.5 — Load Testing

---

## 🚀 Technology Stack

**Backend:**
- Python/FastAPI or Node.js/Express
- PostgreSQL (с индексами, триггерами, constraints)
- Redis (кэширование, rate limiting, queues)
- Celery/RabbitMQ (async tasks)

**External Services:**
- SendGrid / Mailgun (Email)
- Twilio + WhatsApp Business API (SMS)
- OpenAI GPT-4 (AI recommendations)
- Firebase (Push notifications - v2)

**Infrastructure:**
- Docker / Kubernetes
- Nginx (Load balancer)
- CloudFlare (CDN)
- AWS S3 (File storage)

**Monitoring:**
- Prometheus (Metrics)
- Grafana (Dashboards)
- ELK Stack (Logs)
- Sentry (Error tracking)

---

# Booking Flow — Deep Technical Specification (MVP → v2)

**Document Version:** 1.0  
**Date:** December 11, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** In Development

---

## 1. Введение

### 1.1. Цель Booking Flow

**Booking Flow** — это ключевой бизнес-процесс агрегатора самостоятельных складов, который обеспечивает преобразование интереса пользователя в коммерческую сделку.

**Основные цели процесса:**

1. **Для пользователей:**
   - Простое и понятное оформление заявки на аренду бокса
   - Прозрачный расчет стоимости
   - Быстрая обратная связь от оператора
   - Отслеживание статуса заявки в реальном времени

2. **Для операторов:**
   - Централизованное управление всеми заявками
   - Приоритизация лидов по качеству (Lead Score)
   - Эффективная коммуникация с клиентами
   - Автоматизация рутинных операций

3. **Для бизнеса:**
   - Максимизация конверсии из просмотра в бронирование
   - Минимизация времени обработки заявки
   - Сбор аналитики для улучшения сервиса
   - Масштабируемость процесса

**Метрики успеха:**

| Метрика | MVP Target | v2 Target |
|---------|------------|-----------|
| Conversion Rate (просмотр → заявка) | 8-12% | 15-20% |
| Time to First Contact | < 2 часа | < 30 минут |
| Booking Completion Rate | 40-50% | 60-70% |
| Operator Response SLA | < 24 часа | < 1 час |

---

### 1.2. Кто участвует в процессе (user, operator, system)

Процесс бронирования включает три основные роли:

#### 1.2.1. User (Пользователь / Клиент)

**Описание:**  
Физическое лицо, которое ищет складское пространство для хранения вещей.

**Типы пользователей:**
- **Авторизованный пользователь** — зарегистрирован в системе, имеет профиль
- **Неавторизованный пользователь** — просматривает каталог, оставляет заявку без регистрации

**Действия в процессе:**
1. Просмотр каталога складов и боксов
2. Использование AI-помощника для подбора размера
3. Заполнение формы бронирования
4. Отправка заявки
5. Получение уведомлений об изменении статуса
6. Просмотр истории заявок в личном кабинете
7. Отмена заявки (до подтверждения оператором)

**Права доступа:**
- Создание заявок (unlimited для авторизованных, rate-limited для анонимных)
- Просмотр своих заявок
- Отмена своих заявок (со статусом `new`, `in_progress`)
- Добавление комментариев к своим заявкам

---

#### 1.2.2. Operator (Оператор склада)

**Описание:**  
Представитель компании-владельца склада, который обрабатывает заявки и взаимодействует с клиентами.

**Обязанности:**
1. Просмотр входящих заявок на свои склады
2. Контакт с клиентами (звонок, email, мессенджер)
3. Подтверждение или отклонение заявок
4. Управление доступностью боксов
5. Отслеживание активных бронирований
6. Обновление информации о складе

**Действия в процессе:**
1. Получение уведомления о новой заявке
2. Просмотр деталей заявки и Lead Score
3. Контакт с клиентом
4. Смена статуса заявки (`in_progress`, `contacted`)
5. Подтверждение бронирования (`approved`)
6. Или отклонение с указанием причины (`rejected`)
7. Добавление внутренних комментариев

**Права доступа:**
- Просмотр всех заявок на свои склады
- Изменение статуса заявок
- Добавление комментариев (внутренних и публичных)
- Просмотр контактных данных клиентов
- Генерация договоров и счетов (v2)

---

#### 1.2.3. System (Автоматизированная система)

**Описание:**  
Совокупность backend-сервисов и AI-модулей, которые автоматизируют процесс.

**Автоматические действия:**
1. **При создании заявки:**
   - Валидация данных
   - Проверка доступности бокса
   - Расчет стоимости с учетом скидок
   - Генерация booking_id и booking_number
   - Назначение оператору (auto-assignment)
   - Отправка уведомлений

2. **В процессе обработки:**
   - Расчет Lead Score
   - Отправка напоминаний операторам
   - Мониторинг SLA (time to respond)
   - Авто-переход статусов по таймерам

3. **При завершении:**
   - Авто-перевод в `expired` (если не обработана 48 часов)
   - Сбор метрик и аналитики
   - Архивация данных

**Интеграции:**
- Notification Service (Email/SMS/Push)
- AI Services (Box Recommendation, Lead Scoring)
- Payment Gateway (v2)
- CRM (operator dashboard)
- Analytics (tracking & metrics)

---

### 1.3. Отличие "заявка" от "бронирования"

Важно различать два понятия, которые часто используются как синонимы, но имеют разный бизнес-смысл:

#### 1.3.1. Заявка (Booking Request)

**Определение:**  
Намерение пользователя арендовать бокс, выраженное через заполнение формы. Это **лид**, который требует обработки оператором.

**Характеристики:**
- Создается пользователем в 1 клик
- Не гарантирует резервацию бокса
- Требует подтверждения оператором
- Может быть отклонена (бокс занят, неподходящие условия, недостаточно данных)
- Имеет lifecycle: `new` → `in_progress` → `contacted` → `approved/rejected/cancelled/expired`

**Статусы заявки:**
- `new` — только что создана, оператор еще не видел
- `in_progress` — оператор взял в работу
- `contacted` — оператор связался с клиентом
- `approved` — оператор одобрил → превращается в бронирование
- `rejected` — отклонена оператором
- `cancelled` — отменена пользователем
- `expired` — истекла по таймауту

**Пример:**  
Пользователь заполнил форму на сайте: "Хочу бокс 5м² с 15 декабря на 6 месяцев". Это **заявка**, которая ожидает обработки.

---

#### 1.3.2. Бронирование (Confirmed Booking / Reservation)

**Определение:**  
Подтвержденная аренда бокса после одобрения оператором и (в v2) оплаты пользователем. Это **коммерческая сделка**.

**Характеристики:**
- Создается только после `approved` статуса заявки
- Резервирует бокс (бокс становится недоступным для других)
- Имеет договор, счет, реквизиты
- Включает финансовые обязательства
- Имеет свой lifecycle: `payment_pending` → `active` → `completed`

**Статусы бронирования (v2):**
- `payment_pending` — ожидает оплаты от клиента
- `active` — активная аренда, клиент пользуется боксом
- `completed` — аренда завершена
- `terminated` — досрочно прекращена

**Пример:**  
Оператор связался с клиентом, подтвердил условия, клиент оплатил залог — теперь это **бронирование**.

---

#### 1.3.3. Сравнительная таблица

| Параметр | Заявка (Request) | Бронирование (Booking) |
|----------|------------------|------------------------|
| **Создает** | User | System (после approved) |
| **Требует подтверждения** | Да (оператором) | Нет |
| **Резервирует бокс** | Нет (MVP) / Soft (v2) | Да (Hard) |
| **Финансовые обязательства** | Нет | Да |
| **Может быть отклонена** | Да | Нет (только terminated) |
| **Срок жизни** | 24-48 часов | Весь период аренды |
| **Основной статус** | `new`, `in_progress`, `contacted` | `active`, `completed` |

---

#### 1.3.4. Жизненный цикл: от заявки к бронированию

```
User Action          Operator Action       System Action
     │                     │                      │
     ├─ Fill Form ─────────┤                      │
     │                     │                      │
     └─ Submit ────────────┼──────────────────────┤
                           │                      │
                           │              Creates ЗАЯВКА
                           │              Status: new
                           │                      │
                           ├─ Reviews ────────────┤
                           │                      │
                           ├─ Contacts ───────────┤
                           │                      │
                           │              Status: contacted
                           │                      │
                           ├─ Approves ───────────┤
                           │                      │
                           │              Status: approved
                           │              Creates БРОНИРОВАНИЕ
                           │              Status: payment_pending (v2)
                           │                      │
     ├─ Pays ──────────────┤                      │
     │                     │                      │
     │                     │              Status: active
     │                     │              Box reserved
```

**В MVP:**  
Термины "заявка" и "бронирование" часто используются взаимозаменяемо, т.к. нет онлайн-оплаты. Но технически:
- `status: new/in_progress/contacted` = **заявка**
- `status: approved` = **подтвержденное бронирование**

**В v2:**  
Чёткое разделение: `bookings` таблица хранит и заявки и бронирования, различая их по статусу.

---

### 1.4. Разница MVP → v2

Процесс бронирования эволюционирует от простой системы заявок (MVP) до полнофункциональной платформы онлайн-бронирования (v2).

#### 1.4.1. MVP (Minimum Viable Product)

**Концепция:**  
Простой lead-generation инструмент с ручной обработкой.

**Ключевые особенности:**

| Функция | MVP Implementation |
|---------|-------------------|
| **Создание заявки** | ✅ Форма с базовыми полями (имя, телефон, даты) |
| **Резервация бокса** | ❌ Soft reservation (не блокирует бокс) |
| **Оплата** | ❌ Офлайн (банковский перевод, наличные на складе) |
| **Подтверждение** | ✅ Вручную оператором (24-48 часов) |
| **Уведомления** | ✅ Email + SMS (базовые шаблоны) |
| **AI-функции** | ✅ Box Recommendation, Lead Scoring (базовые) |
| **Аналитика** | ✅ Базовая (conversion rate, response time) |
| **Мобильное приложение** | ❌ Только responsive web |

**Ограничения MVP:**
1. Нет гарантии доступности бокса (другой пользователь может оформить заявку на тот же бокс)
2. Длительное время подтверждения (зависит от оператора)
3. Нет автоматизации (все вручную)
4. Риск потери лида из-за медленного ответа

**Преимущества MVP:**
- Быстрый запуск (2-3 месяца разработки)
- Низкая сложность интеграций (нет payment gateway)
- Гибкость (оператор может договориться с клиентом индивидуально)
- Минимальные правовые требования

---

#### 1.4.2. v2 (Full-Featured Platform)

**Концепция:**  
Полностью автоматизированная платформа с instant booking и онлайн-оплатой.

**Ключевые особенности:**

| Функция | v2 Implementation |
|---------|-------------------|
| **Создание заявки** | ✅ Расширенная форма + AI-помощник |
| **Резервация бокса** | ✅ Hard reservation с таймером (15 минут) |
| **Оплата** | ✅ Онлайн (Stripe, Tinkoff, карты) |
| **Подтверждение** | ✅ Instant booking (без участия оператора) |
| **Уведомления** | ✅ Multi-channel (Email, SMS, Push, Telegram) |
| **AI-функции** | ✅ Advanced (Fraud Detection, Dynamic Pricing) |
| **Аналитика** | ✅ Advanced (predictive, funnel analysis) |
| **Мобильное приложение** | ✅ Native iOS/Android |

**Новые возможности v2:**

1. **Hard Reservation:**
   - При создании заявки бокс блокируется на 15 минут
   - Таймер обратного отсчета для пользователя
   - Автоматическое освобождение бокса при неоплате

2. **Instant Booking:**
   - Если склад настроил instant booking, заявка автоматически переходит в `approved`
   - Пользователь сразу получает договор и реквизиты
   - Без ожидания оператора

3. **Online Payment:**
   - Интеграция с payment gateway
   - Оплата картой / электронными деньгами
   - Автоматическое подтверждение после оплаты
   - Instant receipt generation

4. **AI Fraud Detection:**
   - Анализ поведения пользователя
   - Проверка телефонов и email на blacklist
   - Риск-скоринг каждой заявки
   - Автоматическая блокировка подозрительных

5. **Dynamic Pricing:**
   - AI предлагает оптимальную цену
   - Скидки в зависимости от заполненности склада
   - Сезонные коэффициенты
   - Персональные предложения

---

#### 1.4.3. Migration Path (MVP → v2)

**Поэтапная эволюция:**

**Phase 1: MVP (Месяцы 1-3)**
- Базовая форма бронирования
- Email/SMS уведомления
- Operator dashboard
- Базовая аналитика

**Phase 1.1: Improvements (Месяцы 4-6)**
- Hard reservation с таймером
- Advanced lead scoring
- Bulk operations для операторов
- Enhanced notifications

**Phase 2: v2 Launch (Месяцы 7-12)**
- Online payment integration
- Instant booking для избранных складов
- Mobile apps
- AI fraud detection
- Dynamic pricing

**Phase 3: v2+ (Год 2)**
- Multi-language support
- International expansion
- Loyalty program
- Advanced AI features

---

#### 1.4.4. Backward Compatibility

**Важно:**  
При переходе на v2 старые MVP-заявки должны продолжать работать.

**Стратегия:**
1. Поле `booking_type` в таблице: `'manual'` (MVP) или `'instant'` (v2)
2. Старые заявки обрабатываются по-прежнему вручную
3. Новые склады могут выбрать режим (manual/instant)
4. Постепенный переход (по желанию оператора)

---

### 1.5. Ключевые термины и определения

| Термин | Определение |
|--------|-------------|
| **Booking Request** | Заявка на аренду бокса, созданная пользователем |
| **Confirmed Booking** | Подтвержденное бронирование после одобрения оператором |
| **Soft Reservation** | Не блокирует бокс, несколько пользователей могут подать заявку на один бокс |
| **Hard Reservation** | Блокирует бокс на время (15 мин), другие не могут подать заявку |
| **Lead Score** | Оценка качества лида (0-100), рассчитывается AI |
| **SLA** | Service Level Agreement — гарантированное время ответа оператора |
| **Auto-Assignment** | Автоматическое назначение заявки оператору |
| **Status Transition** | Переход заявки из одного статуса в другой |
| **Instant Booking** | Автоматическое подтверждение без участия оператора (v2) |
| **Payment Pending** | Статус ожидания оплаты после одобрения (v2) |

---

### 1.6. Границы документа

**Этот документ описывает:**
✅ Процесс создания заявки на бронирование  
✅ Lifecycle заявки от создания до завершения  
✅ API для работы с booking requests  
✅ Интеграцию с operator dashboard  
✅ UI/UX flow для пользователей  
✅ Бизнес-логику и валидацию  
✅ AI-интеграции  
✅ Notifications и alerts  

**Этот документ НЕ описывает:**
❌ Процесс регистрации пользователей (см. Auth Specification)  
❌ Управление складами и боксами оператором (см. Warehouse Management Spec)  
❌ Платежную систему в деталях (см. Payment Gateway Integration)  
❌ CRM-функции (см. Operator CRM Specification)  
❌ Систему отзывов (см. Reviews & Rating System Spec)  
❌ Аналитику и BI (см. Analytics & Reporting Spec)  

---

## 2. Общая архитектура потока бронирования

### 2.1. Компоненты, участвующие в процессе

Процесс бронирования — это оркестрация нескольких микросервисов и модулей.

#### 2.1.1. Frontend (Web/Mobile)

**Описание:**  
Пользовательский интерфейс, через который пользователь взаимодействует с системой.

**Технологии (рекомендуемые):**
- Web: React / Next.js
- Mobile: React Native (v2) или responsive web (MVP)
- State Management: Redux / Zustand
- API Client: Axios / Fetch

**Ответственность:**
1. Отображение каталога складов и боксов
2. Рендеринг формы бронирования
3. Валидация на стороне клиента
4. Вызов API для создания заявки
5. Отображение статусов и уведомлений
6. Управление пользовательской сессией

**Endpoints используемые:**
- `GET /api/v1/warehouses` — список складов
- `GET /api/v1/warehouses/{id}/boxes` — боксы склада
- `POST /api/v1/bookings` — создание заявки
- `GET /api/v1/user/bookings` — мои заявки
- `POST /api/v1/bookings/{id}/cancel` — отмена заявки

**Состояния формы бронирования:**

```javascript
{
  step: 'selecting' | 'filling' | 'confirming' | 'submitting' | 'success' | 'error',
  formData: {
    warehouse_id: number,
    box_id: number,
    start_date: string,
    duration_months: number,
    user_name: string,
    user_phone: string,
    user_email: string,
    user_comment: string,
    contact_preferences: {
      preferred_contact_method: string,
      preferred_time: string
    }
  },
  validationErrors: {},
  isSubmitting: boolean,
  submitError: string | null
}
```

---

#### 2.1.2. Backend Booking Service

**Описание:**  
Core сервис, управляющий всей логикой бронирования.

**Технологии (рекомендуемые):**
- Language: Python (FastAPI) / Node.js (Express/NestJS)
- Database: PostgreSQL
- Cache: Redis
- Queue: RabbitMQ / Redis Queue

**Ответственность:**
1. Обработка API запросов на создание/чтение/обновление заявок
2. Валидация бизнес-правил
3. Расчет стоимости
4. Управление статусами заявок
5. Auto-assignment заявок операторам
6. Генерация booking_id и booking_number
7. Координация с другими сервисами

**Основные endpoints:**
- `POST /api/v1/bookings` — создание
- `GET /api/v1/bookings/{id}` — получение
- `PATCH /api/v1/bookings/{id}` — обновление
- `GET /api/v1/user/bookings` — список для пользователя
- `GET /api/v1/operator/bookings` — список для оператора

**Database Schema (основные таблицы):**

```sql
-- Основная таблица заявок
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    warehouse_id INTEGER REFERENCES warehouses(id) NOT NULL,
    box_id INTEGER REFERENCES boxes(id) NOT NULL,
    
    -- Даты
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INTEGER NOT NULL,
    
    -- Статус
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    
    -- Контактная информация
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_email VARCHAR(100),
    user_comment TEXT,
    
    -- Стоимость
    monthly_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2),
    discount_percent DECIMAL(5,2),
    
    -- Оператор
    assigned_operator_id INTEGER REFERENCES users(id),
    lead_score INTEGER,
    
    -- Метаданные
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    
    -- Индексы для быстрого поиска
    INDEX idx_user_id (user_id),
    INDEX idx_warehouse_id (warehouse_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

---

#### 2.1.3. Warehouse Service

**Описание:**  
Сервис управления данными о складах.

**Ответственность:**
1. Предоставление информации о складах
2. Управление атрибутами складов (адрес, часы работы, удобства)
3. Проверка активности склада
4. Расчет расстояния до пользователя

**Endpoints используемые Booking Service:**
- `GET /api/v1/warehouses/{id}` — получение данных склада
- `GET /api/v1/warehouses/{id}/availability` — проверка, принимает ли склад заявки

**Data Contract:**

```json
{
  "id": 101,
  "name": "СкладОК Выхино",
  "address": "Москва, Рязанский проспект, 75к2",
  "coordinates": {
    "lat": 55.709617,
    "lng": 37.815673
  },
  "is_active": true,
  "accepts_bookings": true,
  "instant_booking_enabled": false,
  "operator_id": 456
}
```

---

#### 2.1.4. Box Service

**Описание:**  
Сервис управления боксами (инвентарем).

**Ответственность:**
1. Предоставление информации о боксах
2. Проверка доступности бокса
3. Управление резервациями (soft/hard)
4. Обновление статуса бокса

**Endpoints используемые Booking Service:**
- `GET /api/v1/boxes/{id}` — получение данных бокса
- `POST /api/v1/boxes/{id}/check-availability` — проверка доступности
- `POST /api/v1/boxes/{id}/reserve` — резервация (v2)
- `POST /api/v1/boxes/{id}/release` — освобождение (v2)

**Проверка доступности:**

```json
// Request
POST /api/v1/boxes/501/check-availability
{
  "start_date": "2025-12-15",
  "end_date": "2026-06-15"
}

// Response
{
  "available": true,
  "conflicts": [],
  "next_available_date": null
}

// Или если занят:
{
  "available": false,
  "conflicts": [
    {
      "booking_id": 789,
      "start_date": "2025-12-01",
      "end_date": "2026-03-01"
    }
  ],
  "next_available_date": "2026-03-02"
}
```

---

#### 2.1.5. Notifications Service

**Описание:**  
Сервис отправки уведомлений пользователям и операторам.

**Технологии:**
- Email: SendGrid / Mailgun / AWS SES
- SMS: Twilio + WhatsApp Business API.ru
- Push: Firebase Cloud Messaging
- Queue: RabbitMQ для async processing

**Ответственность:**
1. Отправка email уведомлений
2. Отправка SMS
3. Push notifications (v2)
4. Retry при неудаче
5. Логирование всех отправок
6. Template management

**Типы уведомлений:**

| Event | Recipient | Channels | Priority |
|-------|-----------|----------|----------|
| Booking Created | User | Email, SMS | High |
| Booking Confirmed | User | Email, SMS | High |
| Booking Rejected | User | Email, SMS | High |
| Status Changed | User | Email | Medium |
| New Booking | Operator | Email, Push | High |
| Reminder to Contact | Operator | Email, Push | Medium |
| SLA Warning | Operator | Email, Push | Critical |

**API Contract:**

```json
// Request
POST /api/v1/notifications/send
{
  "type": "booking_created",
  "recipient": {
    "user_id": 123,
    "email": "user@example.com",
    "phone": "+971501234567"
  },
  "channels": ["email", "sms"],
  "data": {
    "booking_number": "BK-20251211-1001",
    "warehouse_name": "СкладОК Выхино",
    "box_size": "5m²"
  },
  "priority": "high"
}

// Response
{
  "notification_id": "notif_abc123",
  "status": "queued",
  "estimated_delivery": "2025-12-11T15:05:00Z"
}
```

---

#### 2.1.6. Operator Dashboard

**Описание:**  
Веб-интерфейс для операторов складов.

**Ответственность:**
1. Отображение списка заявок
2. Фильтрация и сортировка
3. Просмотр деталей заявки
4. Изменение статуса
5. Добавление комментариев
6. Управление складами и боксами

**Основные экраны:**
- Dashboard с метриками
- Список заявок (pending, in_progress, etc.)
- Детальная карточка заявки
- История взаимодействий с клиентом

**API взаимодействие:**
- `GET /api/v1/operator/bookings` — список заявок
- `GET /api/v1/operator/bookings/{id}` — детали
- `PATCH /api/v1/operator/bookings/{id}` — обновление
- `POST /api/v1/operator/bookings/{id}/comment` — комментарий

---

#### 2.1.7. AI Services

**Описание:**  
Набор AI-модулей для улучшения процесса бронирования.

**Модули:**

**A. AI Box Recommendation**
- Анализирует описание вещей пользователя
- Рекомендует оптимальный размер бокса
- Endpoint: `POST /api/v1/ai/recommend-box`

**B. AI Lead Scoring**
- Рассчитывает вероятность конверсии заявки
- Оценка 0-100
- Endpoint: `POST /api/v1/ai/score-lead`

**C. AI Price Suggestion (v2)**
- Анализирует рыночные цены
- Предлагает оптимальную цену оператору
- Endpoint: `GET /api/v1/ai/suggest-price`

**D. AI Fraud Detection (v2)**
- Проверяет подозрительные паттерны
- Risk score 0-100
- Endpoint: `POST /api/v1/ai/check-fraud`

**Integration Pattern:**

```
Booking Service → AI Service (async via queue)
                      ↓
                   Result stored in booking metadata
                      ↓
                   Used for prioritization / decision
```

---

#### 2.1.8. Payment Service (v2)

**Описание:**  
Интеграция с платежными шлюзами для онлайн-оплаты.

**Providers:**
- Stripe
- Tinkoff Acquiring
- Stripe (для международных платежей)

**Ответственность:**
1. Создание платежной сессии
2. Redirect пользователя на страницу оплаты
3. Обработка webhook от платежной системы
4. Обновление статуса бронирования
5. Генерация чеков (54-ФЗ)

**Flow (v2):**

```
1. User confirms booking
2. Booking Service → Payment Service: create payment
3. Payment Service → Stripe: init payment
4. User redirected to payment page
5. User pays
6. Stripe → Payment Service: webhook (payment success)
7. Payment Service → Booking Service: update status to 'active'
8. Booking Service → User: send confirmation
```

---

### 2.2. Sequence diagram потока бронирования

#### 2.2.1. Диаграмма полного потока (mermaid)

```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant B as Booking Service
    participant W as Warehouse Service
    participant BX as Box Service
    participant AI as AI Services
    participant N as Notification Service
    participant OP as Operator Dashboard
    participant DB as Database

    %% Step 1: User selects box
    U->>W: GET /warehouses
    W-->>U: List of warehouses
    U->>W: GET /warehouses/101
    W-->>U: Warehouse details
    U->>BX: GET /warehouses/101/boxes
    BX-->>U: Available boxes

    %% Step 2: User fills booking form
    Note over U: User selects box 501<br/>and fills form

    %% Step 3: Submit booking request
    U->>B: POST /bookings<br/>{warehouse: 101, box: 501, ...}
    
    %% Validation & checks
    B->>B: Validate input data
    B->>W: GET /warehouses/101
    W-->>B: Warehouse info
    B->>BX: POST /boxes/501/check-availability
    BX-->>B: {available: true}
    
    %% Price calculation
    B->>B: Calculate price<br/>Apply discounts
    
    %% Generate IDs
    B->>B: Generate booking_number
    
    %% Save to DB
    B->>DB: INSERT booking
    DB-->>B: booking_id: 1001
    
    %% Auto-assign operator
    B->>B: Auto-assign to operator
    
    %% AI Lead Scoring (async)
    B->>AI: Score lead (async)
    AI-->>B: {lead_score: 75}
    B->>DB: UPDATE lead_score
    
    %% Send notifications
    B->>N: Send notification to user
    B->>N: Send notification to operator
    
    %% Response to user
    B-->>U: 201 Created<br/>{booking_id, booking_number, ...}
    
    %% Notifications delivery
    par Parallel notifications
        N->>U: Email: "Заявка создана"
        N->>U: SMS: "Заявка #BK-20251211-1001"
        N->>OP: Push: "Новая заявка на складе"
        N->>OP: Email: "Новая заявка от Ahmed Al-Rashid"
    end
    
    %% User sees success
    U->>U: Show success screen
    
    Note over U,OP: === Operator Processing ===
    
    %% Operator reviews booking
    OP->>B: GET /operator/bookings
    B-->>OP: List of bookings (sorted by lead_score)
    
    OP->>B: GET /bookings/1001
    B-->>OP: Full booking details
    
    %% Operator contacts user
    Note over OP: Operator calls user<br/>+971501234567
    
    OP->>B: PATCH /bookings/1001<br/>{status: "contacted"}
    B->>DB: UPDATE status
    DB-->>B: OK
    B->>N: Send notification to user
    N->>U: Email: "Оператор связался с вами"
    B-->>OP: OK
    
    %% Operator confirms booking
    Note over OP: Terms agreed,<br/>user is ready
    
    OP->>B: POST /bookings/1001/confirm
    B->>DB: UPDATE status='approved'
    B->>BX: Reserve box 501
    BX-->>B: Reserved
    B->>N: Send confirmation to user
    N->>U: Email: "Бронирование подтверждено"
    N->>U: SMS: "Договор и реквизиты в ЛК"
    B-->>OP: OK
    
    Note over U,DB: === Booking Confirmed ===
```

---

#### 2.2.2. Описание ключевых этапов

**Этап 1: Выбор бокса (User Journey)**

1. Пользователь просматривает каталог складов
2. Выбирает склад по местоположению/цене
3. Просматривает доступные боксы на складе
4. Может использовать AI-подбор (описать вещи → получить рекомендацию)
5. Выбирает бокс

**Технические действия:**
- `GET /warehouses` с фильтрами (район, цена, удобства)
- `GET /warehouses/{id}/boxes` для конкретного склада
- `POST /ai/recommend-box` для AI-помощи (опционально)

---

**Этап 2: Заполнение формы бронирования**

**Обязательные поля:**
- Имя
- Телефон
- Дата начала аренды
- Длительность (месяцев)

**Опциональные поля:**
- Email
- Комментарий
- Предпочтительный способ связи
- Предпочтительное время звонка

**Client-side валидация:**
- Телефон: российский формат +7XXXXXXXXXX
- Email: стандартный RFC
- Дата: не раньше сегодня, не позже чем через 90 дней
- Длительность: от 1 до 24 месяцев

---

**Этап 3: Отправка заявки**

**Frontend действия:**
```javascript
// 1. Set loading state
setIsSubmitting(true);

// 2. Call API
const response = await fetch('/api/v1/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // если авторизован
  },
  body: JSON.stringify(formData)
});

// 3. Handle response
if (response.ok) {
  const data = await response.json();
  // Show success screen with booking_number
  showSuccess(data.booking.booking_number);
} else {
  // Handle errors
  const error = await response.json();
  showError(error.message);
}
```

---

**Этап 4: Backend Processing**

**Backend действия (в порядке выполнения):**

```python
# 1. Validate input
validate_booking_input(request_data)

# 2. Check warehouse exists and active
warehouse = get_warehouse(warehouse_id)
if not warehouse.is_active:
    raise ValidationError("Склад не активен")

# 3. Check box exists and available
box = get_box(box_id)
availability = check_box_availability(
    box_id, 
    start_date, 
    end_date
)
if not availability.available:
    raise ConflictError("Бокс недоступен на выбранные даты")

# 4. Calculate price
price = calculate_booking_price(
    box=box,
    duration_months=duration_months,
    start_date=start_date
)

# 5. Apply discounts
discount = get_applicable_discount(box, duration_months)
final_price = apply_discount(price, discount)

# 6. Generate booking identifiers
booking_number = generate_booking_number()  # BK-20251211-1001

# 7. Create booking record
booking = Booking.create(
    booking_number=booking_number,
    user_id=current_user.id if authenticated else None,
    warehouse_id=warehouse_id,
    box_id=box_id,
    start_date=start_date,
    end_date=calculate_end_date(start_date, duration_months),
    duration_months=duration_months,
    status='new',
    user_name=user_name,
    user_phone=normalize_phone(user_phone),
    user_email=user_email,
    user_comment=user_comment,
    monthly_price=price.monthly,
    total_price=final_price.total,
    deposit=price.deposit,
    discount_percent=discount.percent
)

# 8. Auto-assign to operator
operator = assign_operator(warehouse)
booking.assigned_operator_id = operator.id
booking.save()

# 9. Queue AI lead scoring (async)
queue_task('ai_score_lead', booking_id=booking.id)

# 10. Send notifications (async)
queue_task('send_notification', 
    type='booking_created',
    user_id=booking.user_id,
    booking_id=booking.id
)
queue_task('send_notification',
    type='new_booking_for_operator',
    operator_id=operator.id,
    booking_id=booking.id
)

# 11. Return response
return {
    "success": True,
    "data": {
        "booking": booking.to_dict(),
        "next_steps": [
            "Оператор рассмотрит вашу заявку в течение 24 часов",
            "Вы получите уведомление на email и в личный кабинет"
        ]
    }
}
```

---

**Этап 5: Notifications**

**User notifications:**
1. **Email**: Детальное письмо с подтверждением заявки
2. **SMS**: Короткое сообщение с номером заявки

**Operator notifications:**
1. **Email**: Уведомление о новой заявке с деталями
2. **Push**: Если оператор в мобильном приложении (v2)

---

**Этап 6: Operator Processing**

**Operator workflow:**

1. **Получает уведомление**
   - Email или Push
   - Видит приоритет (Lead Score)

2. **Открывает заявку в dashboard**
   - `GET /operator/bookings?status=new`
   - Заявки отсортированы по lead_score (высокие первыми)

3. **Просматривает детали**
   - `GET /bookings/{id}`
   - Видит: контакты, комментарий, даты, цену

4. **Связывается с клиентом**
   - Звонит по телефону
   - Обсуждает условия

5. **Обновляет статус**
   - `PATCH /bookings/{id}` → status: "contacted"
   - Клиент получает уведомление

6. **Подтверждает или отклоняет**
   - Если договорились: `POST /bookings/{id}/confirm`
   - Если не подходит: `POST /bookings/{id}/reject` с причиной

---

**Этап 7: Confirmation**

**При подтверждении:**

```python
def confirm_booking(booking_id, operator_id):
    booking = get_booking(booking_id)
    
    # Verify operator owns this warehouse
    if booking.warehouse.operator_id != operator_id:
        raise PermissionError()
    
    # Update status
    booking.status = 'approved'
    booking.save()
    
    # Reserve box (v2: hard reservation)
    reserve_box(booking.box_id, booking.start_date, booking.end_date)
    
    # Generate documents (v2)
    contract = generate_contract(booking)
    invoice = generate_invoice(booking)
    
    # Send confirmation to user
    send_notification(
        type='booking_confirmed',
        user_id=booking.user_id,
        data={
            'booking_number': booking.booking_number,
            'contract_url': contract.url,
            'invoice_url': invoice.url
        }
    )
    
    return booking
```

---

#### 2.2.3. Точки интеграции

**External Services:**

| Service | Purpose | Provider | Criticality |
|---------|---------|----------|-------------|
| Email | Уведомления | SendGrid / Mailgun | High |
| SMS | Уведомления | Twilio + WhatsApp Business API | High |
| Maps | Геолокация, отображение | Google Maps / Google Maps | Medium |
| Payment | Онлайн-оплата (v2) | Stripe / Tinkoff | Critical (v2) |
| AI/ML | Scoring, recommendations | OpenAI / Custom ML | Medium |
| Analytics | Метрики, tracking | Google Analytics / Mixpanel | Low |

**Internal Services:**

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Auth Service | `/api/v1/auth/*` | Аутентификация |
| User Service | `/api/v1/users/*` | Управление пользователями |
| Warehouse Service | `/api/v1/warehouses/*` | Данные о складах |
| Box Service | `/api/v1/boxes/*` | Данные о боксах |
| Notification Service | `/api/v1/notifications/*` | Отправка уведомлений |
| AI Service | `/api/v1/ai/*` | AI-функции |
| Payment Service | `/api/v1/payments/*` | Платежи (v2) |

---

### 2.3. Где хранятся данные бронирования

#### 2.3.1. Primary storage (PostgreSQL)

**Основная база данных для всех транзакционных данных.**

**Таблицы:**

1. **bookings** — основная таблица заявок
   - Все данные о заявке
   - Связи с user, warehouse, box
   - Текущий статус

2. **booking_status_history** — история изменений статусов
   - Audit trail
   - Кто, когда, почему изменил статус

3. **booking_comments** — комментарии к заявкам
   - От операторов
   - От системы (авто-события)

4. **booking_documents** — документы (v2)
   - Contracts
   - Invoices
   - Receipts

**Retention Policy:**
- Active bookings: хранятся вечно
- Expired/cancelled: архивируются через 1 год
- Completed: архивируются через 2 года

---

#### 2.3.2. Cache layer (Redis)

**Используется для:**

1. **Session storage**
   - User sessions
   - Operator sessions

2. **Temporary reservation locks** (v2)
   - Key: `box:reservation:{box_id}`
   - TTL: 15 минут
   - Value: `{user_id, booking_id, expires_at}`

3. **Rate limiting counters**
   - Key: `rate_limit:booking:{phone}`
   - TTL: 1 час
   - Value: количество заявок

4. **Cached reference data**
   - Списки складов (TTL: 5 минут)
   - Доступные боксы (TTL: 1 минута)

**Example:**

```python
# Check if box is soft-reserved (v2)
reservation = redis.get(f"box:reservation:{box_id}")
if reservation:
    data = json.loads(reservation)
    if data['expires_at'] > now():
        raise ConflictError("Бокс временно зарезервирован")

# Create soft reservation
redis.setex(
    f"box:reservation:{box_id}",
    900,  # 15 minutes
    json.dumps({
        'user_id': user_id,
        'booking_id': booking_id,
        'expires_at': now() + timedelta(minutes=15)
    })
)
```

---

#### 2.3.3. Document storage (S3 / Cloud Storage)

**Используется для:**

1. **Generated documents** (v2)
   - Contracts (PDF)
   - Invoices (PDF)
   - Receipts (PDF)

2. **User uploads** (v2+)
   - ID scans
   - Inventory photos

**Structure:**

```
s3://selfstorage-docs/
  ├── bookings/
  │   ├── 2025/
  │   │   ├── 12/
  │   │   │   ├── BK-20251211-1001/
  │   │   │   │   ├── contract.pdf
  │   │   │   │   ├── invoice.pdf
  │   │   │   │   └── receipt.pdf
```

**Access:**
- Pre-signed URLs (expires in 24 hours)
- Only accessible by booking owner or operator

---

### 2.4. Идентификаторы и связь сущностей

#### 2.4.1. Формат booking_id

**Primary Key:**
- Тип: `SERIAL` (auto-increment integer)
- Используется внутри системы
- Не показывается пользователю напрямую

**Пример:** `1001`, `1002`, `1003`

---

#### 2.4.2. Booking number generation

**Booking Number** — человекочитаемый идентификатор для пользователя.

**Формат:**
```
BK-YYYYMMDD-XXXX
```

Где:
- `BK` — префикс (Booking)
- `YYYYMMDD` — дата создания
- `XXXX` — порядковый номер за день (с ведущими нулями)

**Примеры:**
- `BK-20251211-0001` — первая заявка 11 декабря 2025
- `BK-20251211-0042` — 42-я заявка 11 декабря 2025
- `BK-20251225-0001` — первая заявка 25 декабря 2025

**Генерация:**

```python
def generate_booking_number():
    today = date.today().strftime('%Y%m%d')
    
    # Get count of bookings today
    count = Booking.query.filter(
        func.date(Booking.created_at) == date.today()
    ).count()
    
    # Increment and format
    number = count + 1
    
    return f"BK-{today}-{number:04d}"
```

**Уникальность:**
- Уникальный constraint в БД
- Если collision (маловероятно) — retry с инкрементом

---

#### 2.4.3. Связь с user_id, warehouse_id, box_id

**Entity Relationship:**

```
users (1) ←─── (M) bookings (M) ───→ (1) warehouses
                    ↓
                   (M)
                    ↓
                   (1)
                  boxes
```

**Foreign Keys:**

```sql
ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL;  -- Keep booking even if user deletes account

ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_warehouse
FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
ON DELETE RESTRICT;  -- Prevent warehouse deletion if has bookings

ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_box
FOREIGN KEY (box_id) REFERENCES boxes(id)
ON DELETE RESTRICT;  -- Prevent box deletion if has bookings
```

**Relationship Details:**

| FK | Cardinality | ON DELETE | Meaning |
|----|-------------|-----------|---------|
| `user_id` | M:1 | SET NULL | User can have many bookings; booking can exist without user (anonymous) |
| `warehouse_id` | M:1 | RESTRICT | Many bookings per warehouse; cannot delete warehouse with bookings |
| `box_id` | M:1 | RESTRICT | Many bookings per box (historical); cannot delete box with bookings |
| `assigned_operator_id` | M:1 | SET NULL | Many bookings per operator; booking survives if operator removed |

---

**End of Sections 1-2**

---
# Booking Flow — Deep Technical Specification (MVP → v2)

## PART 2: UX & Business Logic

---

## 3. UX и пользовательские сценарии

### 3.1. Сценарий: выбор бокса и отправка заявки

#### 3.1.1. Шаг 1: Просмотр каталога складов

**Точка входа:**
- Главная страница → кнопка "Найти склад"
- Прямая ссылка на каталог `/warehouses`
- Поиск через карту

**UI элементы:**

```
┌─────────────────────────────────────────────────────────────┐
│  [Логотип]    Каталог    Карта    О нас    [Войти]          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🏠 Найдите идеальный склад для хранения                    │
│                                                              │
│  [📍 Dubai ▼]  [💰 Любая цена ▼]  [📦 Размер бокса ▼]    │
│                                                              │
│  ☑️ Климат-контроль   ☑️ Круглосуточный доступ             │
│  ☑️ Видеонаблюдение   ☐ Первый этаж                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  💡 AI-помощник: "Опишите, что хотите хранить"      │    │
│  │  [Мебель из 2-комнатной квартиры_____________]  [🔍]│    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Найдено складов: 47                                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                        │
│  │   [Фото склада] │  СкладОК Выхино              ⭐ 4.8   │
│  │                 │  📍 Рязанский пр-т, 75к2              │
│  │                 │  🚇 м. Выхино (5 мин пешком)          │
│  └─────────────────┘  💰 от 3 200 ₽/мес                    │
│                       📦 Боксы: 2-15 м²                     │
│                       ✅ 12 свободных боксов                │
│                       [Подробнее →]                         │
├─────────────────────────────────────────────────────────────┤
│  ... (еще карточки складов)                                 │
└─────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
1. Вводит город/район или использует геолокацию
2. Применяет фильтры (цена, размер, удобства)
3. Может использовать AI-помощник для подбора размера
4. Просматривает карточки складов
5. Кликает "Подробнее" на интересном складе

**API вызовы:**
```javascript
// Загрузка складов с фильтрами
GET /api/v1/warehouses?
  city=moscow&
  district=vao&
  min_price=2000&
  max_price=5000&
  features=climate_control,24h_access&
  sort=price_asc
```

---

#### 3.1.2. Шаг 2: Выбор склада

**URL:** `/warehouses/{id}`

**UI элементы:**

```
┌─────────────────────────────────────────────────────────────┐
│  [← Назад к каталогу]                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  СкладОК Выхино         ⭐ 4.8 (124) │
│  │                  │                                        │
│  │   [Фото галерея] │  📍 Dubai, Рязанский пр-т, 75к2     │
│  │   [  6 фото   ]  │  🚇 м. Выхино (5 мин), Рязанский пр-т│
│  │                  │  🕐 Доступ 24/7                       │
│  └──────────────────┘  ☎️ +7 (495) 123-45-67              │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  📦 ДОСТУПНЫЕ БОКСЫ                                         │
│                                                              │
│  Всего: 45 боксов  |  Свободно: 12  |  Размеры: 2-15 м²   │
│                                                              │
│  [🎯 AI-подбор размера]  💬 "Что хотите хранить?"          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Фильтры боксов:                                     │    │
│  │ ▸ Размер:  [2-5]──────[●]─────[15] м²              │    │
│  │ ▸ Этаж:    [ ] Любой  [✓] Первый                   │    │
│  │ ▸ Цена:    [●]────────────[5000] ₽/мес             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────┐                 │
│  │  БОКС S (2 м²)          3 200 ₽/мес  │                 │
│  │  ┌─────────┐                          │                 │
│  │  │ 2×1×2.5м│  Что поместится:          │                 │
│  │  └─────────┘  • 5-10 коробок          │                 │
│  │              • Личные вещи             │                 │
│  │              • Сезонные товары         │                 │
│  │  📍 Этаж: 1  |  ✅ Свободен           │                 │
│  │              [Забронировать →]         │                 │
│  └────────────────────────────────────────┘                 │
│                                                              │
│  ┌────────────────────────────────────────┐                 │
│  │  БОКС M (5 м²)          4 500 ₽/мес  │  🏆 AI рекомендует│
│  │  ┌─────────┐                          │                 │
│  │  │2.5×2×2.5│  Что поместится:          │                 │
│  │  └─────────┘  • Мебель из 1-комн.     │                 │
│  │              • 20-30 коробок           │                 │
│  │              • Бытовая техника         │                 │
│  │  📍 Этаж: 1  |  ✅ Свободен (2 шт)    │                 │
│  │              [Забронировать →]         │                 │
│  └────────────────────────────────────────┘                 │
│                                                              │
│  ... (еще боксы)                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
1. Просматривает информацию о складе (фото, адрес, отзывы)
2. Смотрит доступные боксы
3. Может использовать AI-подбор (описывает вещи → получает рекомендацию размера)
4. Применяет фильтры по размеру/этажу/цене
5. Выбирает подходящий бокс
6. Кликает "Забронировать"

**API вызовы:**
```javascript
// Детали склада
GET /api/v1/warehouses/101

// Боксы склада
GET /api/v1/warehouses/101/boxes?
  status=available&
  min_size=2&
  max_size=10&
  floor=1

// AI-подбор (опционально)
POST /api/v1/ai/recommend-box
{
  "warehouse_id": 101,
  "items_description": "Мебель из 2-комнатной квартиры: диван, кровать, шкаф"
}
// Response: {recommended_size: "7-10 m²", box_ids: [501, 502]}
```

---

#### 3.1.3. Шаг 3: Просмотр доступных боксов

(Уже описано в 3.1.2 — боксы показываются на странице склада)

**Дополнительные возможности:**

**Сравнение боксов:**
```
┌────────────────────────────────────────────────────────────┐
│  Сравнить выбранные боксы: [S] [M] [L]     [Сравнить →]   │
└────────────────────────────────────────────────────────────┘
```

**Виртуальный тур (v2):**
```
┌────────────────────────────────────────────────────────────┐
│  🎥 [Смотреть виртуальный тур бокса]                       │
└────────────────────────────────────────────────────────────┘
```

---

#### 3.1.4. Шаг 4: Выбор бокса

**Действие:** Пользователь кликает "Забронировать" на карточке бокса.

**Переход:** `/booking/new?box_id=501` или модальное окно.

**Предварительная проверка (MVP):**
```javascript
// Frontend check before showing form
const checkAvailability = async (boxId) => {
  const response = await fetch(`/api/v1/boxes/${boxId}`);
  const box = await response.json();
  
  if (box.status !== 'available') {
    showError('Извините, этот бокс уже занят. Выберите другой.');
    return false;
  }
  
  return true;
};
```

**v2: Soft reservation**
```javascript
// Create 15-minute reservation
POST /api/v1/boxes/501/reserve
{
  "duration_minutes": 15
}

// Response
{
  "reserved": true,
  "expires_at": "2025-12-11T15:45:00Z",
  "reservation_token": "res_abc123"
}

// Show countdown timer on form
startCountdown(expiresAt);
```

---

#### 3.1.5. Шаг 5: Заполнение формы бронирования

**URL:** `/booking/new?box_id=501` или модальное окно

**UI элементы (Desktop):**

```
┌──────────────────────────────────────────────────────────────┐
│  Оформление бронирования                          [✕ Закрыть]│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ВАШЕ БРОНИРОВАНИЕ                     │
│  │   [Фото бокса]  │                                         │
│  │                 │  СкладОК Выхино                         │
│  └─────────────────┘  Бокс M (5 м²)                          │
│                       4 500 ₽/мес                            │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  📋 КОНТАКТНАЯ ИНФОРМАЦИЯ                                    │
│                                                               │
│  Имя *                                                        │
│  [Ahmed Al-Rashid___________________________________]            │
│                                                               │
│  Телефон *                                                    │
│  [+971 50 123 4567____________________________]            │
│  💡 Оператор свяжется с вами для подтверждения              │
│                                                               │
│  Email (необязательно)                                        │
│  [ivan@example.com______________________________]            │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  📅 ДАТЫ АРЕНДЫ                                              │
│                                                               │
│  Дата начала аренды *                                         │
│  [15.12.2025 ▼]  📅                                          │
│                                                               │
│  Планируемый срок *                                           │
│  [● 3 месяца  ○ 6 месяцев  ○ 12 месяцев  ○ Свой срок]      │
│  [6] месяцев  ← (если выбрано "Свой срок")                   │
│                                                               │
│  Дата окончания: 15.06.2026                                  │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  💬 ДОПОЛНИТЕЛЬНО                                            │
│                                                               │
│  Комментарий к заявке (необязательно)                         │
│  [Хочу хранить мебель на время ремонта.________]            │
│  [_____________________________________________]            │
│  0/500 символов                                              │
│                                                               │
│  Предпочтительный способ связи:                               │
│  [● Телефон  ○ Email  ○ Telegram]                           │
│                                                               │
│  Удобное время для звонка:                                    │
│  [● Утро (9-12)  ○ День (12-18)  ○ Вечер (18-21)  ○ Любое] │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  💰 РАСЧЁТ СТОИМОСТИ                                         │
│                                                               │
│  Цена за месяц:                     4 500 ₽                  │
│  Срок аренды:                       × 6 месяцев              │
│  ─────────────────────────────────────────────               │
│  Стоимость аренды:                 27 000 ₽                  │
│  Скидка (за 6+ месяцев):           - 2 700 ₽ (10%)          │
│  Залог (возвратный):              + 4 500 ₽                  │
│  ─────────────────────────────────────────────               │
│  ИТОГО к оплате:                   28 800 ₽                  │
│                                                               │
│  💡 Залог возвращается при освобождении бокса                │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  ☑️ Я согласен с [условиями использования] и                │
│     [политикой конфиденциальности]                            │
│                                                               │
│  [        Отправить заявку        ]                          │
│                                                               │
│  🔒 Ваши данные защищены и не передаются третьим лицам       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Поля формы:**

| Поле | Тип | Обязательно | Валидация | Подсказка |
|------|-----|-------------|-----------|-----------|
| `user_name` | text | ✅ | 2-100 символов | "Ahmed Al-Rashid" |
| `user_phone` | tel | ✅ | +7XXXXXXXXXX | "+971 50 123 4567" |
| `user_email` | email | ❌ | RFC 5322 | "ivan@example.com" |
| `start_date` | date | ✅ | >= today, <= today+90 | Дата начала аренды |
| `duration_months` | number | ✅ | 1-24 | Количество месяцев |
| `user_comment` | textarea | ❌ | 0-500 символов | Дополнительная информация |
| `preferred_contact_method` | radio | ❌ | phone/email/telegram | По умолчанию: phone |
| `preferred_time` | radio | ❌ | morning/afternoon/evening/anytime | По умолчанию: anytime |
| `terms_accepted` | checkbox | ✅ | true | Согласие с условиями |

**Автозаполнение для авторизованных:**
```javascript
if (user.isAuthenticated) {
  formData = {
    user_name: user.full_name,
    user_phone: user.phone,
    user_email: user.email,
    // ... пользователь может изменить
  };
}
```

---

#### 3.1.6. Шаг 6: Подтверждение и отправка заявки

**Клик на "Отправить заявку":**

**Frontend validation:**
```javascript
const validateForm = (data) => {
  const errors = {};
  
  // Name
  if (!data.user_name || data.user_name.length < 2) {
    errors.user_name = 'Введите ваше имя (минимум 2 символа)';
  }
  
  // Phone
  const phoneRegex = /^\+7\d{10}$/;
  if (!phoneRegex.test(data.user_phone.replace(/\D/g, ''))) {
    errors.user_phone = 'Введите корректный номер телефона';
  }
  
  // Email (если указан)
  if (data.user_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.user_email)) {
      errors.user_email = 'Введите корректный email';
    }
  }
  
  // Start date
  const startDate = new Date(data.start_date);
  const today = new Date();
  if (startDate < today) {
    errors.start_date = 'Дата не может быть в прошлом';
  }
  
  // Duration
  if (data.duration_months < 1 || data.duration_months > 24) {
    errors.duration_months = 'Срок аренды: от 1 до 24 месяцев';
  }
  
  // Terms
  if (!data.terms_accepted) {
    errors.terms_accepted = 'Необходимо согласие с условиями';
  }
  
  return errors;
};
```

**Если есть ошибки → показать под полями:**
```
Телефон *
[+7 999 123 456_________________________________]
❌ Введите корректный номер телефона
```

**Если всё ОК → отправка:**

```javascript
const submitBooking = async (formData) => {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.isAuthenticated ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({
        warehouse_id: selectedWarehouse.id,
        box_id: selectedBox.id,
        start_date: formData.start_date,
        duration_months: formData.duration_months,
        user_name: formData.user_name,
        user_phone: normalizePhone(formData.user_phone),
        user_email: formData.user_email,
        user_comment: formData.user_comment,
        contact_preferences: {
          preferred_contact_method: formData.preferred_contact_method,
          preferred_time: formData.preferred_time
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      showSuccessScreen(data.booking);
    } else {
      const error = await response.json();
      showError(error.error.message);
    }
  } catch (err) {
    showError('Ошибка соединения. Попробуйте ещё раз.');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Loading state во время отправки:**
```
[  ⏳ Отправка заявки...  ]
```

---

#### 3.1.7. Шаг 7: Получение подтверждения

**Success screen:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                        ✅ ЗАЯВКА ОТПРАВЛЕНА!                 │
│                                                               │
│  Ваша заявка успешно создана и отправлена оператору         │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  📋 ДЕТАЛИ ЗАЯВКИ                                            │
│                                                               │
│  Номер заявки:     BK-20251211-0042                          │
│  Склад:            СкладОК Выхино                            │
│  Бокс:             M (5 м²)                                  │
│  Дата начала:      15.12.2025                                │
│  Срок:             6 месяцев                                 │
│  Стоимость:        28 800 ₽                                  │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  📨 ЧТО ДАЛЬШЕ?                                              │
│                                                               │
│  1️⃣ Оператор склада рассмотрит вашу заявку                  │
│     в течение 24 часов                                        │
│                                                               │
│  2️⃣ Вы получите уведомление на email и SMS                   │
│     о статусе вашей заявки                                    │
│                                                               │
│  3️⃣ После подтверждения вам будут отправлены                │
│     реквизиты для оплаты и договор аренды                    │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  💬 СВЯЗЬ С ОПЕРАТОРОМ                                       │
│                                                               │
│  Склад: СкладОК Выхино                                       │
│  Телефон: +7 (495) 123-45-67                                 │
│  Email: vykhino@skladok.ru                                   │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│  [Вернуться на главную]  [Мои заявки]  [Найти другой склад] │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Email уведомление (отправляется автоматически):**

```
От: noreply@selfstorage-aggregator.ru
Кому: ivan@example.com
Тема: Заявка #BK-20251211-0042 создана

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Здравствуйте, Иван!

Ваша заявка на аренду бокса успешно создана.

📋 ДЕТАЛИ ЗАЯВКИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Номер заявки:     BK-20251211-0042
Склад:            СкладОК Выхино
Адрес:            Dubai, Рязанский пр-т, 75к2
Бокс:             M (5 м²)
Дата начала:      15.12.2025
Срок аренды:      6 месяцев
Итого к оплате:   28 800 ₽

📨 ЧТО ДАЛЬШЕ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Оператор склада рассмотрит вашу заявку в течение 24 часов и свяжется 
с вами по телефону +971 50 123 4567.

Вы можете отслеживать статус заявки в личном кабинете:
https://selfstorage-aggregator.ru/bookings/BK-20251211-0042

💬 КОНТАКТЫ СКЛАДА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Телефон: +7 (495) 123-45-67
Email: vykhino@skladok.ru

С уважением,
Команда Агрегатора складов
```

**SMS уведомление:**

```
Заявка #BK-20251211-0042 создана. СкладОК Выхино, бокс M (5м²). 
Оператор свяжется с вами в течение 24 часов. 
Статус: https://selfstorage-aggregator.ru/b/BK-20251211-0042
```

---

### 3.2. UI-состояния

#### 3.2.1. Loading (загрузка данных)

**Когда отображается:**
- Загрузка каталога складов
- Загрузка боксов
- Отправка формы бронирования
- Загрузка деталей заявки

**UI:**

```
┌──────────────────────────────────────────┐
│                                           │
│              ⏳ Загрузка...              │
│                                           │
│        ┌─────────────────────┐            │
│        │  [Spinner animation]│            │
│        └─────────────────────┘            │
│                                           │
│    Пожалуйста, подождите несколько       │
│              секунд                       │
│                                           │
└──────────────────────────────────────────┘
```

**Skeleton screen (лучший UX):**

```
┌──────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │
│                                           │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │
└──────────────────────────────────────────┘
```

---

#### 3.2.2. Validation error (ошибки валидации)

**Inline errors (под каждым полем):**

```
Телефон *
[+7 999 123 456_________________________________]
❌ Введите корректный номер телефона (10 цифр после +7)
```

**Summary errors (сверху формы):**

```
┌──────────────────────────────────────────┐
│  ❌ Пожалуйста, исправьте ошибки:        │
│  • Введите корректный номер телефона      │
│  • Выберите дату начала аренды            │
│  • Примите условия использования          │
└──────────────────────────────────────────┘
```

**Стиль:**
- Красная рамка вокруг поля с ошибкой
- Красный текст ошибки под полем
- Иконка ❌ или ⚠️

---

#### 3.2.3. Server error (серверные ошибки)

**Типы ошибок:**

**A. Box unavailable (409 Conflict):**

```
┌──────────────────────────────────────────────────────────┐
│  ⚠️ БОКС УЖЕ ЗАНЯТ                                       │
│                                                           │
│  К сожалению, этот бокс был забронирован другим          │
│  пользователем пока вы заполняли форму.                  │
│                                                           │
│  Мы рекомендуем вам следующие альтернативные боксы:      │
│                                                           │
│  • Бокс M на 1 этаже — 4 500 ₽/мес  [Выбрать]          │
│  • Бокс L на 2 этаже — 6 200 ₽/мес  [Выбрать]          │
│                                                           │
│  [Вернуться к выбору боксов]                             │
└──────────────────────────────────────────────────────────┘
```

**B. Rate limit exceeded (429):**

```
┌──────────────────────────────────────────────────────────┐
│  ⚠️ СЛИШКОМ МНОГО ЗАЯВОК                                 │
│                                                           │
│  Вы отправили несколько заявок за короткое время.        │
│  Пожалуйста, подождите 15 минут перед созданием          │
│  следующей заявки.                                        │
│                                                           │
│  Ваши предыдущие заявки:                                  │
│  • BK-20251211-0041 — СкладОК Выхино (ожидает ответа)   │
│                                                           │
│  [Перейти к моим заявкам]                                │
└──────────────────────────────────────────────────────────┘
```

**C. Internal server error (500):**

```
┌──────────────────────────────────────────────────────────┐
│  ❌ ОШИБКА СЕРВЕРА                                       │
│                                                           │
│  Извините, произошла ошибка на сервере.                  │
│  Пожалуйста, попробуйте снова через несколько минут.     │
│                                                           │
│  Если проблема повторится, свяжитесь с нами:             │
│  📧 support@selfstorage-aggregator.ru                    │
│  📞 8 (800) 555-35-35                                    │
│                                                           │
│  Код ошибки: ERR_20251211_154523                         │
│                                                           │
│  [Попробовать снова]  [На главную]                       │
└──────────────────────────────────────────────────────────┘
```

---

#### 3.2.4. Success (успешное создание)

(Уже описано в 3.1.7)

**Дополнительно:**

**Confetti animation (v2):**
```javascript
if (bookingCreated) {
  triggerConfettiAnimation();
}
```

**Social sharing (v2):**
```
[📱 Поделиться с другом]  →  WhatsApp / Telegram / VK
```

---

#### 3.2.5. Empty state (нет доступных боксов)

**На странице склада:**

```
┌──────────────────────────────────────────────────────────┐
│  📦 ДОСТУПНЫЕ БОКСЫ                                      │
│                                                           │
│  😔 К сожалению, все боксы на этом складе заняты.       │
│                                                           │
│  💡 ЧТО МОЖНО СДЕЛАТЬ?                                   │
│                                                           │
│  1️⃣ Оставьте заявку, и мы сообщим, когда освободится     │
│     подходящий бокс:                                      │
│                                                           │
│     Email: [ivan@example.com________________]            │
│     Размер: [M (5 м²) ▼]                                 │
│     [Уведомить меня]                                      │
│                                                           │
│  2️⃣ Посмотрите похожие склады рядом:                     │
│                                                           │
│     ┌────────────────────────────────────┐               │
│     │ СкладБокс Текстильщики   📍 2.1 км│               │
│     │ ✅ 8 свободных боксов   от 3800₽  │               │
│     │ [Посмотреть →]                     │               │
│     └────────────────────────────────────┘               │
│                                                           │
│  [Найти другие склады]                                   │
└──────────────────────────────────────────────────────────┘
```

---

### 3.3. Edge cases

#### 3.3.1. Отсутствуют боксы на складе

**Сценарий:** У склада вообще нет боксов (не заполнен инвентарь).

**Поведение:**
1. На карточке склада показывать: "⚠️ Инвентарь уточняется"
2. Кнопка "Подробнее" ведет на страницу склада
3. На странице склада:

```
📦 БОКСЫ
⚠️ Оператор склада ещё не добавил информацию о боксах.

Вы можете:
• Позвонить на склад: +7 (495) 123-45-67
• Отправить запрос оператору: [Отправить запрос]
```

**API behavior:**
```javascript
GET /api/v1/warehouses/101/boxes
→ 200 OK
{
  "boxes": [],
  "total": 0,
  "warehouse_onboarding_completed": false
}
```

---

#### 3.3.2. Бокс стал недоступным во время оформления

**Сценарий:** Пользователь начал заполнять форму, но другой пользователь успел забронировать бокс раньше.

**MVP (без soft reservation):**

**Detection:**
```python
# В момент отправки заявки
box = get_box(box_id)
if box.status != 'available':
    raise ConflictError(
        code='box_unavailable',
        message='Этот бокс уже забронирован',
        suggested_boxes=[...alternative boxes...]
    )
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "box_unavailable",
    "message": "К сожалению, этот бокс был забронирован другим пользователем",
    "suggested_alternatives": [
      {
        "box_id": 502,
        "size": "M (5 m²)",
        "price": 4500,
        "floor": 2
      },
      {
        "box_id": 503,
        "size": "L (7 m²)",
        "price": 5500,
        "floor": 1
      }
    ]
  }
}
```

**UI:**
- Показать модальное окно с предложением альтернатив
- Пользователь может выбрать другой бокс без переввода всей формы

---

**v2 (с soft reservation):**

**Prevention:**
```python
# При открытии формы бронирования
reservation = reserve_box_temporarily(
    box_id=box_id,
    user_id=user_id,
    duration_minutes=15
)

# Показать таймер на форме
show_countdown_timer(expires_at=reservation.expires_at)
```

**UI countdown:**
```
⏱️ Бокс зарезервирован за вами на: 14:32
[███████████░░░░░░░░] 75%
```

**Если время истекло:**
```
⚠️ ВРЕМЯ РЕЗЕРВАЦИИ ИСТЕКЛО

К сожалению, время резервации бокса истекло.
Бокс снова доступен для бронирования.

[Зарезервировать снова]  [Выбрать другой бокс]
```

---

#### 3.3.3. Обязательные поля не заполнены

**Frontend prevention:**
```javascript
// Disable submit button until required fields filled
const isFormValid = () => {
  return (
    formData.user_name?.length >= 2 &&
    isValidPhone(formData.user_phone) &&
    formData.start_date &&
    formData.duration_months &&
    formData.terms_accepted
  );
};

<button 
  disabled={!isFormValid() || isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
</button>
```

**Backend validation:**
```python
def validate_booking_data(data):
    errors = {}
    
    if not data.get('user_name') or len(data['user_name']) < 2:
        errors['user_name'] = 'Имя обязательно (минимум 2 символа)'
    
    if not is_valid_phone(data.get('user_phone')):
        errors['user_phone'] = 'Введите корректный номер телефона'
    
    # ... other validations
    
    if errors:
        raise ValidationError(errors)
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибки валидации данных",
    "details": {
      "user_name": "Имя обязательно (минимум 2 символа)",
      "start_date": "Дата начала аренды обязательна"
    }
  }
}
```

---

#### 3.3.4. Дублирование заявки (повторная отправка)

**Сценарий:** Пользователь дважды кликает "Отправить" или обновляет страницу.

**Frontend prevention:**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return; // Prevent double-submit
  
  setIsSubmitting(true);
  try {
    await submitBooking();
  } finally {
    setIsSubmitting(false);
  }
};
```

**Backend prevention (idempotency):**
```python
# Generate idempotency key on frontend
idempotency_key = f"{user_id}:{box_id}:{timestamp}"

# Check if request already processed
existing = find_booking_by_idempotency_key(idempotency_key)
if existing:
    return existing  # Return existing booking instead of creating new

# Create booking with idempotency_key
booking = create_booking(..., idempotency_key=idempotency_key)
```

**Rate limiting (per phone number):**
```python
# Max 3 bookings per hour from same phone
rate_limit_key = f"booking:phone:{phone}"
count = redis.incr(rate_limit_key)
if count == 1:
    redis.expire(rate_limit_key, 3600)  # 1 hour

if count > 3:
    raise RateLimitError("Слишком много заявок. Попробуйте через час.")
```

---

#### 3.3.5. Сессия истекла во время заполнения

**Сценарий:** Пользователь долго заполнял форму, JWT token истёк.

**Detection:**
```javascript
// При отправке получаем 401 Unauthorized
if (response.status === 401) {
  // Save form data to localStorage
  localStorage.setItem('booking_draft', JSON.stringify(formData));
  
  // Redirect to login
  router.push('/login?return=/booking/new');
}
```

**После логина:**
```javascript
// Restore form data
const draft = localStorage.getItem('booking_draft');
if (draft) {
  setFormData(JSON.parse(draft));
  localStorage.removeItem('booking_draft');
  
  showNotification('Продолжите оформление заявки');
}
```

---

#### 3.3.6. Изменение цены в процессе бронирования

**Сценарий:** Оператор изменил цену на бокс пока пользователь заполнял форму.

**MVP solution:**
```python
# Расчет цены в момент создания заявки (не полагаемся на frontend)
current_price = get_current_box_price(box_id)

if current_price != submitted_price:
    # Log discrepancy but proceed with current price
    logger.warning(
        f"Price mismatch: submitted={submitted_price}, "
        f"current={current_price}"
    )

booking.monthly_price = current_price
booking.total_price = calculate_total(current_price, duration)
```

**v2 solution (price lock):**
```python
# При открытии формы зафиксировать цену на 15 минут
price_lock = {
    'box_id': box_id,
    'price': current_price,
    'expires_at': now() + timedelta(minutes=15)
}
redis.setex(f"price_lock:{box_id}:{user_id}", 900, json.dumps(price_lock))

# При создании заявки использовать locked price
locked_price = get_locked_price(box_id, user_id)
if locked_price:
    use_price = locked_price
else:
    use_price = current_price
```

---

### 3.4. Текстовые wireframes формы бронирования

#### 3.4.1. Desktop layout (1200px+)

```
┌────────────────────────────────────────────────────────────────────────┐
│  Header: [Logo] Каталог | Карта | О нас                     [Войти]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌──────────────────────────────────┐│
│  │ LEFT COLUMN (400px)         │  │ RIGHT COLUMN (flex)              ││
│  │                             │  │                                  ││
│  │ ┌─────────────────────────┐ │  │ КОНТАКТНАЯ ИНФОРМАЦИЯ           ││
│  │ │   [Photo of box]        │ │  │                                  ││
│  │ │                         │ │  │ Имя *                            ││
│  │ └─────────────────────────┘ │  │ [________________]               ││
│  │                             │  │                                  ││
│  │ ВАШЕ БРОНИРОВАНИЕ          │  │ Телефон *                        ││
│  │                             │  │ [+971 50 123 4567]            ││
│  │ СкладОК Выхино             │  │                                  ││
│  │ 📍 Рязанский пр-т, 75к2    │  │ Email                            ││
│  │                             │  │ [________________]               ││
│  │ Бокс M (5 м²)              │  │                                  ││
│  │ 💰 4 500 ₽/мес             │  │ ────────────────────────────────││
│  │                             │  │                                  ││
│  │ ──────────────────────────  │  │ ДАТЫ АРЕНДЫ                     ││
│  │                             │  │                                  ││
│  │ РАСЧЁТ СТОИМОСТИ           │  │ Дата начала *                    ││
│  │                             │  │ [15.12.2025 ▼] 📅              ││
│  │ Цена:          4 500 ₽     │  │                                  ││
│  │ Срок:          × 6 мес     │  │ Срок *                           ││
│  │ ─────────────────────      │  │ ● 3 мес ○ 6 мес ○ 12 мес        ││
│  │ Аренда:       27 000 ₽     │  │                                  ││
│  │ Скидка:      - 2 700 ₽     │  │ Окончание: 15.06.2026           ││
│  │ Залог:       + 4 500 ₽     │  │                                  ││
│  │ ─────────────────────      │  │ ────────────────────────────────││
│  │ ИТОГО:        28 800 ₽     │  │                                  ││
│  │                             │  │ ДОПОЛНИТЕЛЬНО                    ││
│  │                             │  │                                  ││
│  └─────────────────────────────┘  │ Комментарий                      ││
│                                    │ [_________________]              ││
│                                    │ [_________________]              ││
│                                    │                                  ││
│                                    │ Способ связи:                    ││
│                                    │ ● Телефон ○ Email ○ Telegram    ││
│                                    │                                  ││
│                                    │ Время звонка:                    ││
│                                    │ ● Утро ○ День ○ Вечер ○ Любое  ││
│                                    │                                  ││
│                                    │ ────────────────────────────────││
│                                    │                                  ││
│                                    │ ☑️ Согласен с [условиями]       ││
│                                    │                                  ││
│                                    │ [  Отправить заявку  ]          ││
│                                    │                                  ││
│                                    └──────────────────────────────────┘│
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

#### 3.4.2. Mobile layout (320-768px)

```
┌──────────────────────────────────────┐
│ [☰] Бронирование              [✕]   │
├──────────────────────────────────────┤
│                                       │
│ ┌─────────────────────────────────┐  │
│ │     [Photo of box]              │  │
│ └─────────────────────────────────┘  │
│                                       │
│ СкладОК Выхино                       │
│ Бокс M (5 м²)                        │
│ 💰 4 500 ₽/мес                       │
│                                       │
│ ═══════════════════════════════════  │
│                                       │
│ 📋 КОНТАКТЫ                          │
│                                       │
│ Имя *                                 │
│ [Ahmed Al-Rashid____________]            │
│                                       │
│ Телефон *                             │
│ [+971 50 123 4567_____]            │
│                                       │
│ Email                                 │
│ [ivan@example.com_______]            │
│                                       │
│ ═══════════════════════════════════  │
│                                       │
│ 📅 ДАТЫ                              │
│                                       │
│ Начало *                              │
│ [15.12.2025 ▼] 📅                   │
│                                       │
│ Срок *                                │
│ ● 3 мес  ○ 6 мес                     │
│ ○ 12 мес ○ Другой                    │
│                                       │
│ Окончание: 15.06.2026                │
│                                       │
│ ═══════════════════════════════════  │
│                                       │
│ 💬 КОММЕНТАРИЙ                       │
│ [___________________]                │
│ [___________________]                │
│                                       │
│ ═══════════════════════════════════  │
│                                       │
│ 💰 СТОИМОСТЬ                         │
│                                       │
│ Аренда (6 мес):     27 000 ₽        │
│ Скидка:            - 2 700 ₽        │
│ Залог:             + 4 500 ₽        │
│ ─────────────────────────────        │
│ ИТОГО:              28 800 ₽        │
│                                       │
│ ═══════════════════════════════════  │
│                                       │
│ ☑️ Согласен с условиями              │
│                                       │
│ [    Отправить заявку    ]           │
│                                       │
│ 🔒 Данные защищены                   │
│                                       │
└──────────────────────────────────────┘
```

---

#### 3.4.3. Tablet layout (768-1024px)

Промежуточный вариант между desktop и mobile:
- Левая колонка становится уже (300px)
- Правая колонка растягивается
- Все элементы остаются видимыми без скролла

---

## 4. Business Logic — правила работы процесса бронирования

### 4.1. Какие поля обязательны

#### 4.1.1. Обязательные поля (required fields)

**Для всех пользователей (MVP):**

| Поле | Тип | Валидация | Почему обязательно |
|------|-----|-----------|-------------------|
| `user_name` | string | 2-100 chars | Идентификация клиента |
| `user_phone` | string | +7XXXXXXXXXX | Контакт для оператора |
| `warehouse_id` | integer | Exists in DB | Определение склада |
| `box_id` | integer | Belongs to warehouse | Определение бокса |
| `start_date` | date | >= today, <= today+90 | Начало аренды |
| `duration_months` | integer | 1-24 | Расчет стоимости и окончания |
| `terms_accepted` | boolean | true | Юридическое согласие |

**SQL constraint:**
```sql
ALTER TABLE bookings
ADD CONSTRAINT chk_required_fields CHECK (
    user_name IS NOT NULL AND LENGTH(user_name) >= 2 AND
    user_phone IS NOT NULL AND
    warehouse_id IS NOT NULL AND
    box_id IS NOT NULL AND
    start_date IS NOT NULL AND
    duration_months IS NOT NULL AND duration_months BETWEEN 1 AND 24
);
```

---

#### 4.1.2. Опциональные поля (optional fields)

| Поле | Тип | Назначение |
|------|-----|-----------|
| `user_email` | string | Дополнительный канал связи, email-уведомления |
| `user_comment` | text | Пожелания/вопросы клиента к оператору |
| `preferred_contact_method` | enum | phone/email/telegram (default: phone) |
| `preferred_time` | enum | morning/afternoon/evening/anytime (default: anytime) |

---

#### 4.1.3. Поля для авторизованных пользователей

**Если пользователь вошел в систему (JWT token):**

```python
if user.is_authenticated:
    booking.user_id = user.id
    
    # Auto-fill from profile
    if not request_data.get('user_name'):
        booking.user_name = user.full_name
    if not request_data.get('user_phone'):
        booking.user_phone = user.phone
    if not request_data.get('user_email'):
        booking.user_email = user.email
```

**Преимущества:**
- Заявки связаны с аккаунтом
- История бронирований в ЛК
- Быстрое повторное бронирование

---

#### 4.1.4. Поля для неавторизованных пользователей

**Если пользователь не вошел:**

```python
booking.user_id = None  # Anonymous booking
booking.user_name = request_data['user_name']  # Required
booking.user_phone = request_data['user_phone']  # Required
booking.user_email = request_data.get('user_email')  # Optional
```

**Ограничения:**
- Не видят заявку в ЛК (только по ссылке в email/SMS)
- Rate limiting по номеру телефона строже
- Могут быть запрошены дополнительные данные

---

### 4.2. Лимит на количество заявок с одного номера

#### 4.2.1. Rate limiting по номеру телефона

**Цель:** Предотвратить спам и злоупотребления.

**Лимиты (MVP):**

| Период | Лимит | Действие при превышении |
|--------|-------|------------------------|
| 1 час | 3 заявки | Блокировка на 1 час |
| 24 часа | 10 заявок | Блокировка на 24 часа |
| 7 дней | 20 заявок | Ручная проверка required |

**Implementation:**

```python
def check_rate_limit(phone: str):
    # Normalize phone
    normalized = normalize_phone(phone)  # +971501234567
    
    # Check 1 hour limit
    key_hour = f"rate_limit:phone:hour:{normalized}"
    count_hour = redis.incr(key_hour)
    if count_hour == 1:
        redis.expire(key_hour, 3600)
    
    if count_hour > 3:
        raise RateLimitError(
            "Превышен лимит заявок. Попробуйте через час.",
            retry_after=redis.ttl(key_hour)
        )
    
    # Check 24 hour limit
    key_day = f"rate_limit:phone:day:{normalized}"
    count_day = redis.incr(key_day)
    if count_day == 1:
        redis.expire(key_day, 86400)
    
    if count_day > 10:
        raise RateLimitError(
            "Превышен дневной лимит заявок.",
            retry_after=redis.ttl(key_day)
        )
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Превышен лимит заявок. Попробуйте через час.",
    "retry_after": 3421  // seconds
  }
}
```

---

#### 4.2.2. Rate limiting по IP-адресу

**Для неавторизованных пользователей:**

| Период | Лимит | Действие |
|--------|-------|----------|
| 1 час | 5 заявок | Показать CAPTCHA |
| 24 часа | 15 заявок | Блокировка IP |

**Implementation:**

```python
def check_ip_rate_limit(ip_address: str):
    key = f"rate_limit:ip:{ip_address}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, 3600)
    
    if count > 5:
        # Require CAPTCHA
        return {'require_captcha': True}
    
    if count > 15:
        raise RateLimitError("Too many requests from this IP")
```

---

#### 4.2.3. Rate limiting по user_id

**Для авторизованных пользователей (более мягкие лимиты):**

| Период | Лимит |
|--------|-------|
| 1 час | 5 заявок |
| 24 часа | 20 заявок |

---

#### 4.2.4. Временные окна ограничений

**Sliding window algorithm:**

```python
def check_sliding_window_rate_limit(key: str, limit: int, window: int):
    now = time.time()
    window_start = now - window
    
    # Remove old requests
    redis.zremrangebyscore(key, 0, window_start)
    
    # Count requests in window
    count = redis.zcard(key)
    
    if count >= limit:
        raise RateLimitError(f"Rate limit exceeded: {limit} per {window}s")
    
    # Add current request
    redis.zadd(key, {str(uuid.uuid4()): now})
    redis.expire(key, window)
```

---

### 4.3. Проверка доступности бокса

#### 4.3.1. Алгоритм проверки в реальном времени

**MVP (Simple status check):**

```python
def check_box_availability(box_id: int, start_date: date, end_date: date):
    box = Box.query.get(box_id)
    
    if not box:
        raise NotFoundError("Box not found")
    
    # Check basic availability
    if box.status != 'available':
        return {
            'available': False,
            'reason': 'box_occupied',
            'message': 'Бокс занят'
        }
    
    # Check for overlapping bookings
    overlapping = Booking.query.filter(
        Booking.box_id == box_id,
        Booking.status.in_(['approved', 'active']),
        or_(
            and_(
                Booking.start_date <= start_date,
                Booking.end_date >= start_date
            ),
            and_(
                Booking.start_date <= end_date,
                Booking.end_date >= end_date
            ),
            and_(
                Booking.start_date >= start_date,
                Booking.end_date <= end_date
            )
        )
    ).first()
    
    if overlapping:
        return {
            'available': False,
            'reason': 'date_conflict',
            'message': 'Бокс занят на выбранные даты',
            'conflict': {
                'booking_id': overlapping.id,
                'start_date': overlapping.start_date,
                'end_date': overlapping.end_date
            }
        }
    
    return {
        'available': True,
        'message': 'Бокс доступен'
    }
```

---

#### 4.3.2. Race condition handling

**Проблема:** Два пользователя одновременно бронируют один бокс.

**Solution 1: Database transaction isolation**

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

def create_booking_with_lock(session: Session, booking_data):
    # Start transaction with serializable isolation
    with session.begin():
        # Lock box row for update
        box = session.execute(
            select(Box)
            .where(Box.id == booking_data['box_id'])
            .with_for_update()  # SELECT ... FOR UPDATE
        ).scalar_one()
        
        # Check availability within locked transaction
        if box.status != 'available':
            raise ConflictError("Box no longer available")
        
        # Create booking
        booking = Booking(**booking_data)
        session.add(booking)
        
        # Update box status (optional in MVP)
        # box.status = 'reserved'
        
        session.commit()
        
        return booking
```

---

#### 4.3.3. Optimistic locking

**v2 approach:**

```python
class Box(Base):
    __tablename__ = 'boxes'
    
    id = Column(Integer, primary_key=True)
    version = Column(Integer, default=0, nullable=False)  # Version field
    status = Column(String)

def update_box_with_optimistic_lock(box_id, new_status):
    box = Box.query.get(box_id)
    old_version = box.version
    
    # Update with version check
    updated = Box.query.filter(
        Box.id == box_id,
        Box.version == old_version
    ).update({
        'status': new_status,
        'version': old_version + 1
    })
    
    if updated == 0:
        raise ConcurrencyError("Box was modified by another transaction")
```

---

### 4.4. Проверка валидности данных

#### 4.4.1. Валидация телефона

**Format:** Russian phone number (+7XXXXXXXXXX)

```python
import re

def validate_phone(phone: str) -> bool:
    # Remove all non-digits
    digits = re.sub(r'\D', '', phone)
    
    # Check format: 7 + 10 digits or 8 + 10 digits
    if digits.startswith('7') and len(digits) == 11:
        return True
    if digits.startswith('8') and len(digits) == 11:
        return True
    
    return False

def normalize_phone(phone: str) -> str:
    digits = re.sub(r'\D', '', phone)
    
    # Convert 8XXXXXXXXXX to 7XXXXXXXXXX
    if digits.startswith('8'):
        digits = '7' + digits[1:]
    
    return f"+{digits}"

# Example
normalize_phone("+971 50 123 4567")  # → "+971501234567"
normalize_phone("8 999 123 45 67")      # → "+971501234567"
```

---

#### 4.4.2. Валидация email

```python
import re

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
```

---

#### 4.4.3. Валидация дат

```python
from datetime import date, timedelta

def validate_start_date(start_date: date) -> tuple[bool, str]:
    today = date.today()
    max_future = today + timedelta(days=90)
    
    if start_date < today:
        return False, "Дата начала не может быть в прошлом"
    
    if start_date > max_future:
        return False, "Дата начала не может быть позже 90 дней от сегодня"
    
    return True, ""
```

---

#### 4.4.4. Валидация длительности аренды

```python
def validate_duration(duration_months: int) -> tuple[bool, str]:
    if duration_months < 1:
        return False, "Минимальный срок аренды: 1 месяц"
    
    if duration_months > 24:
        return False, "Максимальный срок аренды: 24 месяца"
    
    return True, ""
```

---

#### 4.4.5. Валидация текстовых полей

```python
def validate_text_field(value: str, field_name: str, min_len: int, max_len: int):
    if not value or len(value.strip()) < min_len:
        raise ValidationError(f"{field_name}: минимум {min_len} символов")
    
    if len(value) > max_len:
        raise ValidationError(f"{field_name}: максимум {max_len} символов")
    
    # Check for suspicious patterns (SQL injection, XSS)
    dangerous_patterns = ['<script', 'javascript:', 'onerror=', 'DROP TABLE']
    for pattern in dangerous_patterns:
        if pattern.lower() in value.lower():
            raise ValidationError(f"{field_name}: недопустимое содержимое")
```

---

### 4.5. Создание заявки

(Процесс описан в разделе 2.2.2, здесь — дополнительные детали)

#### 4.5.1. Генерация booking_id

**Auto-increment primary key:**
```sql
CREATE SEQUENCE bookings_id_seq;

CREATE TABLE bookings (
    id INTEGER PRIMARY KEY DEFAULT nextval('bookings_id_seq'),
    ...
);
```

---

#### 4.5.2. Генерация booking_number

(Уже описано в 2.4.2, повторю кратко)

**Format:** `BK-YYYYMMDD-XXXX`

```python
def generate_booking_number():
    today_str = date.today().strftime('%Y%m%d')
    
    # Thread-safe counter increment
    with db.session.begin_nested():
        count = db.session.execute(
            text("""
                SELECT COUNT(*) 
                FROM bookings 
                WHERE DATE(created_at) = :today
            """),
            {'today': date.today()}
        ).scalar()
        
        number = count + 1
        
    return f"BK-{today_str}-{number:04d}"
```

---

#### 4.5.3. Расчет стоимости

```python
def calculate_booking_price(box, duration_months, start_date):
    # Base monthly price
    monthly_price = box.price_per_month
    
    # Apply duration discount
    discount_percent = get_duration_discount(duration_months)
    discounted_price = monthly_price * (1 - discount_percent / 100)
    
    # Calculate total
    total_price = discounted_price * duration_months
    
    # Calculate deposit (usually 1 month)
    deposit = monthly_price
    
    # Grand total
    grand_total = total_price + deposit
    
    return {
        'monthly_price': monthly_price,
        'discount_percent': discount_percent,
        'discounted_monthly_price': discounted_price,
        'total_price': total_price,
        'deposit': deposit,
        'grand_total': grand_total
    }
```

---

#### 4.5.4. Применение скидок

```python
def get_duration_discount(duration_months):
    # Discount tiers
    if duration_months >= 12:
        return 15  # 15% for 12+ months
    elif duration_months >= 6:
        return 10  # 10% for 6-11 months
    elif duration_months >= 3:
        return 5   # 5% for 3-5 months
    else:
        return 0   # No discount for 1-2 months
```

---

#### 4.5.5. Создание записи в БД

```python
def create_booking(data):
    booking = Booking(
        booking_number=generate_booking_number(),
        user_id=data.get('user_id'),
        warehouse_id=data['warehouse_id'],
        box_id=data['box_id'],
        start_date=data['start_date'],
        end_date=calculate_end_date(data['start_date'], data['duration_months']),
        duration_months=data['duration_months'],
        status='new',
        user_name=data['user_name'],
        user_phone=normalize_phone(data['user_phone']),
        user_email=data.get('user_email'),
        user_comment=data.get('user_comment'),
        monthly_price=data['pricing']['monthly_price'],
        total_price=data['pricing']['total_price'],
        deposit=data['pricing']['deposit'],
        discount_percent=data['pricing']['discount_percent'],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(hours=48)  # Auto-expire in 48h
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return booking
```

---

### 4.6. Привязка заявки к оператору

#### 4.6.1. Автоматическое назначение (round-robin)

**Простейший алгоритм:**

```python
def assign_operator_round_robin(warehouse_id):
    # Get all active operators for this warehouse
    operators = User.query.filter(
        User.role == 'operator',
        User.warehouse_id == warehouse_id,
        User.is_active == True
    ).all()
    
    if not operators:
        return None  # No operators available
    
    # Find operator with least assignments today
    operator_loads = []
    for op in operators:
        count = Booking.query.filter(
            Booking.assigned_operator_id == op.id,
            func.date(Booking.created_at) == date.today()
        ).count()
        operator_loads.append((op, count))
    
    # Sort by load (ascending)
    operator_loads.sort(key=lambda x: x[1])
    
    # Assign to operator with least load
    return operator_loads[0][0]
```

---

#### 4.6.2. Назначение по lead score

**v2: Приоритетные заявки высококвалифицированным операторам**

```python
def assign_operator_by_score(warehouse_id, lead_score):
    # High-value leads go to senior operators
    if lead_score >= 80:
        operator = get_senior_operator(warehouse_id)
    else:
        operator = assign_operator_round_robin(warehouse_id)
    
    return operator
```

---

#### 4.6.3. Назначение по загруженности оператора

```python
def get_operator_availability(operator_id):
    # Count active bookings
    active_count = Booking.query.filter(
        Booking.assigned_operator_id == operator_id,
        Booking.status.in_(['new', 'in_progress', 'contacted'])
    ).count()
    
    # Operator capacity
    MAX_ACTIVE_BOOKINGS = 20
    
    return {
        'available': active_count < MAX_ACTIVE_BOOKINGS,
        'active_bookings': active_count,
        'capacity': MAX_ACTIVE_BOOKINGS
    }
```

---

#### 4.6.4. Ручное переназначение

```python
# API endpoint for admin/manager
@app.route('/api/v1/bookings/<int:id>/reassign', methods=['POST'])
@require_role('admin', 'manager')
def reassign_booking(id):
    booking = Booking.query.get_or_404(id)
    new_operator_id = request.json['operator_id']
    
    # Validate new operator
    operator = User.query.get(new_operator_id)
    if not operator or operator.role != 'operator':
        return error_response('Invalid operator')
    
    # Reassign
    old_operator_id = booking.assigned_operator_id
    booking.assigned_operator_id = new_operator_id
    booking.save()
    
    # Log reassignment
    log_booking_event(
        booking_id=id,
        event='reassigned',
        actor=current_user.id,
        details=f"From operator {old_operator_id} to {new_operator_id}"
    )
    
    # Notify new operator
    send_notification(
        user_id=new_operator_id,
        type='booking_assigned',
        booking_id=id
    )
    
    return success_response(booking)
```

---

### 4.7. Резервирование бокса (MVP vs v2)

#### 4.7.1. MVP: Soft reservation (мягкая резервация)

**Концепция:** Бокс НЕ блокируется при создании заявки.

**Плюсы:**
- Простая реализация
- Несколько пользователей могут подать заявку на один бокс
- Оператор выбирает лучшего клиента

**Минусы:**
- Конфликты (несколько заявок на один бокс)
- Пользователь может получить отказ после ожидания

**Implementation:**
```python
# При создании заявки статус бокса НЕ меняется
booking = create_booking(data)
# box.status остается 'available'

# Operator вручную подтверждает одну из заявок
# Остальные автоматически отклоняются
```

---

#### 4.7.2. v2: Hard reservation с таймером

**Концепция:** Бокс блокируется на 15 минут при открытии формы.

**Плюсы:**
- Гарантированная доступность
- Нет конфликтов
- Лучший UX (countdown timer)

**Минусы:**
- Сложнее реализация
- Блокировка может мешать другим (если пользователь передумал)

**Implementation:**

```python
# When user clicks "Book this box"
POST /api/v1/boxes/501/reserve
{
  "user_id": 123,  # or session_id if anonymous
  "duration_minutes": 15
}

# Response
{
  "reserved": True,
  "reservation_id": "res_abc123",
  "expires_at": "2025-12-11T15:45:00Z",
  "box_id": 501
}

# Store in Redis
redis.setex(
    f"box:reservation:{box_id}",
    900,  # 15 minutes
    json.dumps({
        'user_id': user_id,
        'reservation_id': reservation_id,
        'expires_at': expires_at
    })
)

# Frontend: Show countdown timer
<CountdownTimer expiresAt={expiresAt} onExpire={handleExpire} />

# Auto-release after 15 minutes (background job or TTL)
@celery.task
def release_expired_reservations():
    # Redis TTL handles this automatically
    pass

# При создании заявки проверить reservation
def create_booking(data):
    reservation = redis.get(f"box:reservation:{data['box_id']}")
    
    if not reservation:
        raise ConflictError("Reservation expired or invalid")
    
    res_data = json.loads(reservation)
    if res_data['user_id'] != data['user_id']:
        raise ConflictError("Box reserved by another user")
    
    # Create booking
    booking = Booking.create(...)
    
    # Release reservation
    redis.delete(f"box:reservation:{data['box_id']}")
    
    return booking
```

---

#### 4.7.3. v2: Conflict resolution

**Если возник конфликт (редкий случай в v2):**

```python
def handle_booking_conflict(booking_id):
    booking = Booking.query.get(booking_id)
    
    # Find alternative boxes
    alternatives = find_similar_boxes(
        warehouse_id=booking.warehouse_id,
        size_range=(booking.box.size * 0.8, booking.box.size * 1.2),
        price_range=(booking.monthly_price * 0.9, booking.monthly_price * 1.1)
    )
    
    # Notify user with alternatives
    send_notification(
        user_id=booking.user_id,
        type='booking_conflict',
        alternatives=alternatives
    )
    
    # Auto-reject conflicting booking
    booking.status = 'rejected'
    booking.rejection_reason = 'Box no longer available'
    booking.save()
```

---

**End of Sections 3-4**

---
# Booking Flow — Deep Technical Specification (MVP → v2)

## PART 3: Statuses & API Specification

---

## 5. Статусы заявки

### 5.1. Список статусов

Заявка проходит через несколько статусов в течение своего жизненного цикла.

#### 5.1.1. new (новая заявка)

**Описание:**  
Заявка только что создана пользователем, оператор ещё не начал обработку.

**Характеристики:**
- Начальный статус при создании
- Заявка видна в очереди оператора
- Пользователь видит статус "Ожидает обработки"
- Автоматический переход в `expired` через 48 часов (если не обработана)

**Действия доступные:**
- Operator: Взять в работу → `in_progress`
- User: Отменить → `cancelled`
- System: Auto-expire → `expired` (через 48ч)

**Уведомления:**
- User: Email + SMS о создании заявки
- Operator: Email + Push о новой заявке

---

#### 5.1.2. in_progress (в обработке)

**Описание:**  
Оператор взял заявку в работу, но ещё не связался с клиентом.

**Характеристики:**
- Оператор просмотрел детали
- Начат процесс обработки
- Ещё не было контакта с клиентом
- Автоматический переход в `expired` через 72 часа

**Действия доступные:**
- Operator: Отметить контакт → `contacted`
- Operator: Подтвердить → `approved`
- Operator: Отклонить → `rejected`
- User: Отменить → `cancelled`
- System: Auto-expire → `expired` (через 72ч)

**Уведомления:**
- User: "Ваша заявка в обработке"
- Operator: Напоминание через 4 часа, если нет прогресса

---

#### 5.1.3. contacted (клиент контактирован)

**Описание:**  
Оператор связался с клиентом, идёт обсуждение условий.

**Характеристики:**
- Был телефонный звонок / email / мессенджер контакт
- Обсуждаются детали аренды
- Ожидается решение клиента
- Автоматический переход в `expired` через 72 часа

**Действия доступные:**
- Operator: Подтвердить → `approved`
- Operator: Отклонить → `rejected`
- User: Отменить → `cancelled`
- System: Auto-expire → `expired` (через 72ч от контакта)

**Уведомления:**
- User: "Оператор связался с вами"
- Operator: Напоминание через 24 часа

---

#### 5.1.4. approved (одобрена)

**Описание:**  
Оператор одобрил заявку, бронирование подтверждено.

**Характеристики:**
- Условия аренды согласованы
- Бокс зарезервирован для клиента
- Отправлены реквизиты для оплаты (MVP)
- Терминальный статус в MVP
- В v2: переход в `payment_pending`

**Действия доступные (MVP):**
- Operator: Отметить оплату (вручную, вне системы)
- User: Просмотр договора и реквизитов

**Действия доступные (v2):**
- System: Ожидание оплаты → `payment_pending`
- После оплаты → `active`

**Уведомления:**
- User: Email + SMS с подтверждением и реквизитами
- Operator: Уведомление об успешном подтверждении

---

#### 5.1.5. rejected (отклонена)

**Описание:**  
Оператор отклонил заявку (бокс недоступен, не подходят условия, подозрительная заявка).

**Характеристики:**
- Терминальный статус
- Обязательно указание причины отклонения
- Бокс освобождается для других заявок
- Нельзя изменить статус обратно

**Причины отклонения:**
- `box_unavailable` — Бокс уже занят
- `dates_unavailable` — Не подходят даты
- `customer_unreachable` — Не удалось связаться
- `customer_declined` — Клиент отказался
- `suspicious_activity` — Подозрительная активность
- `other` — Другая причина (указать текстом)

**Действия доступные:**
- Нет (терминальный статус)

**Уведомления:**
- User: Email + SMS с причиной отклонения и предложением альтернатив

---

#### 5.1.6. cancelled (отменена клиентом)

**Описание:**  
Пользователь самостоятельно отменил заявку.

**Характеристики:**
- Терминальный статус
- Может отменить только до статуса `approved`
- После `approved` отмена требует связи с оператором
- Причина отмены опциональна

**Действия доступные:**
- Нет (терминальный статус)

**Уведомления:**
- Operator: Уведомление об отмене
- User: Подтверждение отмены

---

#### 5.1.7. expired (истекла)

**Описание:**  
Заявка автоматически истекла по таймауту без обработки.

**Характеристики:**
- Терминальный статус
- Автоматический переход системой
- Оператор не обработал вовремя
- Собирается в метрики (SLA breach)

**Таймауты:**
- `new` → `expired`: 48 часов
- `in_progress` → `expired`: 72 часа
- `contacted` → `expired`: 72 часа от последнего контакта

**Действия доступные:**
- Нет (терминальный статус)
- Можно создать новую заявку

**Уведомления:**
- User: "Заявка истекла, создайте новую"
- Operator: Alert об истечении (для метрик)

---

#### 5.1.8. payment_pending (ожидание оплаты) — v2

**Описание:**  
Бронирование одобрено, ожидается онлайн-оплата от клиента.

**Характеристики:**
- Только в v2 (с онлайн-платежами)
- Создана платежная сессия
- Отправлена ссылка на оплату
- Таймаут: 24 часа
- После оплаты → `active`
- После таймаута → `expired`

**Действия доступные:**
- User: Оплатить (redirect to payment gateway)
- System: Check payment status (webhook)
- System: Auto-expire if not paid (24h)

**Уведомления:**
- User: Ссылка на оплату + напоминания
- Operator: Уведомление о начале оплаты

---

#### 5.1.9. active (активная аренда) — v2

**Описание:**  
Оплата получена, аренда активна, клиент пользуется боксом.

**Характеристики:**
- Только в v2
- Оплата подтверждена
- Договор подписан
- Аренда началась
- До даты окончания → `completed`

**Действия доступные:**
- User: Продлить аренду
- Operator: Досрочно завершить (с возвратом)
- System: Auto-complete при окончании срока

**Уведомления:**
- User: Подтверждение начала аренды
- User: Напоминание за 7 дней до окончания
- Operator: Уведомление об активации

---

#### 5.1.10. completed (завершена) — v2

**Описание:**  
Срок аренды истёк, бокс освобождён, залог возвращён.

**Характеристики:**
- Терминальный статус
- Только в v2
- Срок аренды закончился
- Бокс освобождён
- Залог возвращён (если применимо)

**Действия доступные:**
- User: Оставить отзыв
- User: Создать новую заявку

**Уведомления:**
- User: Благодарность + запрос отзыва
- Operator: Уведомление о завершении

---

### 5.2. Схема переходов (state machine diagram)

#### 5.2.1. Диаграмма переходов состояний (mermaid)

```mermaid
stateDiagram-v2
    [*] --> new: User creates booking
    
    new --> in_progress: Operator takes booking
    new --> cancelled: User cancels
    new --> expired: Timeout (48h)
    
    in_progress --> contacted: Operator contacts customer
    in_progress --> approved: Operator confirms
    in_progress --> rejected: Operator rejects
    in_progress --> cancelled: User cancels
    in_progress --> expired: Timeout (72h)
    
    contacted --> approved: Operator confirms
    contacted --> rejected: Operator rejects
    contacted --> cancelled: User cancels
    contacted --> expired: Timeout (72h)
    
    approved --> payment_pending: v2: Create payment
    approved --> active: v2: Payment confirmed
    approved --> [*]: MVP: Terminal (manual payment offline)
    
    payment_pending --> active: Payment successful
    payment_pending --> expired: Payment timeout (24h)
    
    active --> completed: Rental period ends
    active --> terminated: Early termination
    
    rejected --> [*]: Terminal
    cancelled --> [*]: Terminal
    expired --> [*]: Terminal
    completed --> [*]: Terminal
    terminated --> [*]: Terminal
    
    note right of new
        Initial status
        Auto-expires in 48h
    end note
    
    note right of approved
        MVP: Terminal
        v2: Transitions to payment
    end note
    
    note right of active
        v2 only
        Active rental period
    end note
```

---

#### 5.2.2. Допустимые переходы

**Status Transition Matrix:**

| От / К | new | in_progress | contacted | approved | rejected | cancelled | expired | payment_pending | active | completed |
|--------|-----|-------------|-----------|----------|----------|-----------|---------|-----------------|--------|-----------|
| **new** | - | ✅ Operator | - | - | - | ✅ User | ✅ System | - | - | - |
| **in_progress** | ❌ | - | ✅ Operator | ✅ Operator | ✅ Operator | ✅ User | ✅ System | - | - | - |
| **contacted** | ❌ | ❌ | - | ✅ Operator | ✅ Operator | ✅ User | ✅ System | - | - | - |
| **approved** | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ✅ System (v2) | ✅ System (v2) | - |
| **rejected** | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ | ❌ |
| **cancelled** | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ |
| **expired** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ |
| **payment_pending** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ System | - | ✅ System | - |
| **active** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ✅ System |
| **completed** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - |

**Legend:**
- ✅ — Допустимый переход
- ❌ — Недопустимый переход
- Operator — Только оператор может выполнить
- User — Только пользователь может выполнить
- System — Только система может выполнить (автоматически)

---

#### 5.2.3. Недопустимые переходы

**Примеры запрещённых переходов:**

```python
# Cannot reopen rejected booking
rejected → in_progress  # ❌ FORBIDDEN

# Cannot cancel approved booking directly (requires operator)
approved → cancelled    # ❌ FORBIDDEN (must contact operator)

# Cannot go back from terminal statuses
expired → new          # ❌ FORBIDDEN
completed → active     # ❌ FORBIDDEN

# Cannot skip required steps
new → approved         # ❌ FORBIDDEN (must go through in_progress)
```

**Enforcement:**

```python
class BookingStateMachine:
    TRANSITIONS = {
        'new': ['in_progress', 'cancelled', 'expired'],
        'in_progress': ['contacted', 'approved', 'rejected', 'cancelled', 'expired'],
        'contacted': ['approved', 'rejected', 'cancelled', 'expired'],
        'approved': ['payment_pending', 'active'],  # v2
        'rejected': [],  # Terminal
        'cancelled': [],  # Terminal
        'expired': [],  # Terminal
        'payment_pending': ['active', 'expired'],
        'active': ['completed', 'terminated'],
        'completed': []  # Terminal
    }
    
    def can_transition(self, from_status: str, to_status: str) -> bool:
        return to_status in self.TRANSITIONS.get(from_status, [])
    
    def transition(self, booking: Booking, new_status: str, actor: User):
        if not self.can_transition(booking.status, new_status):
            raise InvalidTransitionError(
                f"Cannot transition from {booking.status} to {new_status}"
            )
        
        # Check actor permissions
        if not self.has_permission(actor, booking, new_status):
            raise PermissionError(
                f"{actor.role} cannot transition booking to {new_status}"
            )
        
        # Perform transition
        old_status = booking.status
        booking.status = new_status
        booking.updated_at = datetime.utcnow()
        booking.save()
        
        # Log transition
        log_status_change(
            booking_id=booking.id,
            from_status=old_status,
            to_status=new_status,
            actor=actor.id,
            timestamp=datetime.utcnow()
        )
        
        # Trigger side effects (notifications, etc.)
        self.on_status_change(booking, old_status, new_status)
```

---

#### 5.2.4. Роли и права на переходы

| Переход | User | Operator | System | Admin |
|---------|------|----------|--------|-------|
| new → in_progress | ❌ | ✅ | ❌ | ✅ |
| new → cancelled | ✅ (own) | ❌ | ❌ | ✅ |
| new → expired | ❌ | ❌ | ✅ | ❌ |
| in_progress → contacted | ❌ | ✅ | ❌ | ✅ |
| in_progress → approved | ❌ | ✅ | ❌ | ✅ |
| in_progress → rejected | ❌ | ✅ | ❌ | ✅ |
| in_progress → cancelled | ✅ (own) | ❌ | ❌ | ✅ |
| contacted → approved | ❌ | ✅ | ❌ | ✅ |
| contacted → rejected | ❌ | ✅ | ❌ | ✅ |
| approved → payment_pending | ❌ | ❌ | ✅ | ✅ |
| payment_pending → active | ❌ | ❌ | ✅ | ✅ |
| active → completed | ❌ | ❌ | ✅ | ✅ |

---

### 5.3. Тайминги и авто-переходы

#### 5.3.1. Автоматический переход new → expired (24-48 часов)

**Логика:**

```python
# Cron job runs every hour
@celery.beat.schedule(crontab(minute=0))
def expire_unprocessed_bookings():
    cutoff_time = datetime.utcnow() - timedelta(hours=48)
    
    bookings_to_expire = Booking.query.filter(
        Booking.status == 'new',
        Booking.created_at < cutoff_time
    ).all()
    
    for booking in bookings_to_expire:
        booking.status = 'expired'
        booking.updated_at = datetime.utcnow()
        booking.save()
        
        # Log
        log_status_change(
            booking_id=booking.id,
            from_status='new',
            to_status='expired',
            actor='system',
            reason='Auto-expired after 48 hours'
        )
        
        # Notify user
        send_notification(
            user_id=booking.user_id,
            type='booking_expired',
            booking_id=booking.id
        )
        
        # Notify operator (for metrics)
        send_notification(
            user_id=booking.assigned_operator_id,
            type='booking_expired_sla_breach',
            booking_id=booking.id
        )
```

**Configurable timeout:**

```python
# Settings
BOOKING_EXPIRY_TIMEOUTS = {
    'new': timedelta(hours=48),
    'in_progress': timedelta(hours=72),
    'contacted': timedelta(hours=72),
    'payment_pending': timedelta(hours=24)  # v2
}
```

---

#### 5.3.2. Автоматический переход contacted → expired (72 часа)

**Логика:**  
Аналогично `new → expired`, но таймаут 72 часа от последнего изменения статуса.

```python
@celery.beat.schedule(crontab(minute=30))
def expire_contacted_bookings():
    cutoff_time = datetime.utcnow() - timedelta(hours=72)
    
    bookings = Booking.query.filter(
        Booking.status == 'contacted',
        Booking.updated_at < cutoff_time
    ).all()
    
    for booking in bookings:
        expire_booking(booking, reason='No progress after 72 hours')
```

---

#### 5.3.3. Напоминания операторам

**Escalation ladder:**

| Время с момента создания | Действие | Recipient |
|--------------------------|----------|-----------|
| 4 часа | Email reminder | Assigned operator |
| 12 часов | Push notification | Assigned operator |
| 24 часа | Email + Push | Assigned operator + Manager |
| 36 часов | Critical alert | Manager |
| 48 часов | Auto-expire + SLA breach report | Admin |

**Implementation:**

```python
@celery.beat.schedule(crontab(minute='*/15'))  # Every 15 minutes
def send_operator_reminders():
    now = datetime.utcnow()
    
    # 4-hour reminder
    four_hours_ago = now - timedelta(hours=4)
    bookings_4h = Booking.query.filter(
        Booking.status.in_(['new', 'in_progress']),
        Booking.created_at <= four_hours_ago,
        Booking.created_at > four_hours_ago - timedelta(minutes=15),
        ~Booking.reminders.any(reminder_type='4h_reminder')
    ).all()
    
    for booking in bookings_4h:
        send_notification(
            user_id=booking.assigned_operator_id,
            type='booking_reminder_4h',
            booking_id=booking.id,
            priority='medium'
        )
        
        # Mark reminder sent
        BookingReminder.create(
            booking_id=booking.id,
            reminder_type='4h_reminder',
            sent_at=now
        )
    
    # 24-hour critical reminder
    # ... similar logic
```

---

### 5.4. Логи изменений

#### 5.4.1. Структура лога изменений статуса

**Таблица: booking_status_history**

```sql
CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id),  -- NULL if system
    changed_by_type VARCHAR(20) NOT NULL,  -- 'user', 'operator', 'system', 'admin'
    reason TEXT,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_booking_id (booking_id),
    INDEX idx_created_at (created_at)
);
```

---

#### 5.4.2. Кто изменил, когда, почему

**Запись в лог:**

```python
def log_status_change(
    booking_id: int,
    from_status: str,
    to_status: str,
    actor: Union[int, str],
    actor_type: str,
    reason: str = None,
    note: str = None
):
    history = BookingStatusHistory(
        booking_id=booking_id,
        from_status=from_status,
        to_status=to_status,
        changed_by=actor if isinstance(actor, int) else None,
        changed_by_type=actor_type,  # 'user', 'operator', 'system', 'admin'
        reason=reason,
        note=note,
        created_at=datetime.utcnow()
    )
    
    db.session.add(history)
    db.session.commit()
```

**Пример записи:**

```json
{
  "id": 1234,
  "booking_id": 1001,
  "from_status": "new",
  "to_status": "in_progress",
  "changed_by": 456,
  "changed_by_type": "operator",
  "reason": null,
  "note": "Оператор взял заявку в работу",
  "created_at": "2025-12-11T10:15:00Z"
}
```

---

#### 5.4.3. История комментариев

**Таблица: booking_comments**

```sql
CREATE TABLE booking_comments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    comment_type VARCHAR(20) NOT NULL,  -- 'internal', 'public', 'system'
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_booking_id (booking_id),
    INDEX idx_created_at (created_at)
);
```

**Типы комментариев:**
- `internal` — Внутренний комментарий оператора (не видят пользователи)
- `public` — Публичный комментарий (виден пользователю)
- `system` — Автоматический комментарий системы

**API для комментариев:**

```python
# Add internal comment (operator only)
POST /api/v1/operator/bookings/{id}/comment
{
  "comment": "Клиент попросил перезвонить после 18:00",
  "comment_type": "internal"
}

# Add public comment (visible to user)
POST /api/v1/operator/bookings/{id}/comment
{
  "comment": "Спасибо за обращение! Мы свяжемся с вами в течение часа.",
  "comment_type": "public"
}
```

---

## 6. API Specification (полный блок)

### 6.1. POST /api/v1/bookings — создание заявки

#### 6.1.1. Request Headers

```
POST /api/v1/bookings
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (optional)
X-Request-ID: req_abc123 (optional, for idempotency)
```

---

#### 6.1.2. Request Body Schema

```json
{
  "warehouse_id": "integer, required",
  "box_id": "integer, required",
  "start_date": "string (ISO date), required",
  "duration_months": "integer, required",
  "user_name": "string, required",
  "user_phone": "string, required",
  "user_email": "string, optional",
  "user_comment": "string, optional",
  "contact_preferences": {
    "preferred_contact_method": "string (enum), optional",
    "preferred_time": "string (enum), optional"
  },
  "terms_accepted": "boolean, required"
}
```

**Field Specifications:**

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| `warehouse_id` | integer | ✅ | Must exist in DB | - |
| `box_id` | integer | ✅ | Must belong to warehouse & be available | - |
| `start_date` | string | ✅ | ISO 8601 date, >= today, <= today+90 | - |
| `duration_months` | integer | ✅ | 1-24 | - |
| `user_name` | string | ✅ | 2-100 chars | - |
| `user_phone` | string | ✅ | +7XXXXXXXXXX | - |
| `user_email` | string | ❌ | Valid email format | null |
| `user_comment` | string | ❌ | 0-500 chars | null |
| `contact_preferences.preferred_contact_method` | enum | ❌ | phone/email/telegram | phone |
| `contact_preferences.preferred_time` | enum | ❌ | morning/afternoon/evening/anytime | anytime |
| `terms_accepted` | boolean | ✅ | Must be true | - |

---

#### 6.1.3. Request JSON Example

```json
{
  "warehouse_id": 101,
  "box_id": 501,
  "start_date": "2025-12-15",
  "duration_months": 6,
  "user_name": "Ahmed Al-Rashid",
  "user_phone": "+971501234567",
  "user_email": "ivan@example.com",
  "user_comment": "Хочу хранить мебель на время ремонта. Есть ли возможность доставки?",
  "contact_preferences": {
    "preferred_contact_method": "phone",
    "preferred_time": "morning"
  },
  "terms_accepted": true
}
```

---

#### 6.1.4. Response 201 Created

**Success response structure:**

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "booking_number": "BK-20251211-0042",
      "user_id": 123,
      "warehouse": {
        "id": 101,
        "name": "СкладОК Выхино",
        "address": "Москва, Рязанский пр-т, 75к2"
      },
      "box": {
        "id": 501,
        "size": "M",
        "dimensions": "2.5×2×2.5",
        "area_sqm": 5
      },
      "dates": {
        "start_date": "2025-12-15",
        "end_date": "2026-06-15",
        "duration_months": 6
      },
      "pricing": {
        "monthly_price": 4500,
        "discount_percent": 10,
        "discounted_monthly_price": 4050,
        "total_rental": 24300,
        "deposit": 4500,
        "grand_total": 28800,
        "currency": "RUB"
      },
      "status": "new",
      "contact_info": {
        "name": "Ahmed Al-Rashid",
        "phone": "+971501234567",
        "email": "ivan@example.com"
      },
      "user_comment": "Хочу хранить мебель на время ремонта. Есть ли возможность доставки?",
      "contact_preferences": {
        "preferred_contact_method": "phone",
        "preferred_time": "morning"
      },
      "operator": {
        "assigned": true,
        "operator_id": 456,
        "operator_name": "Мария Смирнова"
      },
      "timestamps": {
        "created_at": "2025-12-11T14:30:00Z",
        "updated_at": "2025-12-11T14:30:00Z",
        "expires_at": "2025-12-13T14:30:00Z"
      }
    },
    "next_steps": [
      "Оператор рассмотрит вашу заявку в течение 24 часов",
      "Вы получите уведомление на email и SMS",
      "После подтверждения вам будут отправлены реквизиты для оплаты"
    ],
    "links": {
      "self": "/api/v1/bookings/1001",
      "warehouse": "/api/v1/warehouses/101",
      "box": "/api/v1/boxes/501",
      "user_bookings": "/api/v1/user/bookings"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T14:30:00Z",
    "request_id": "req_abc123",
    "version": "1.0"
  }
}
```

---

#### 6.1.5. Response Schema

**Root level:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for 2xx responses |
| `data` | object | Response payload |
| `meta` | object | Metadata about request |

**data.booking:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Internal booking ID |
| `booking_number` | string | Human-readable booking number |
| `user_id` | integer | User ID (null if anonymous) |
| `warehouse` | object | Warehouse details |
| `box` | object | Box details |
| `dates` | object | Rental dates |
| `pricing` | object | Price breakdown |
| `status` | string | Current status |
| `contact_info` | object | Contact information |
| `user_comment` | string | User's comment |
| `contact_preferences` | object | Contact preferences |
| `operator` | object | Assigned operator info |
| `timestamps` | object | Created/updated/expires timestamps |

---

#### 6.1.6. Response JSON Example

(Already shown in 6.1.4)

---

#### 6.1.7. Business Logic Steps

**Backend processing flow:**

```python
@app.route('/api/v1/bookings', methods=['POST'])
@rate_limit(limit=3, per=3600)  # 3 per hour
def create_booking():
    data = request.get_json()
    
    # 1. Validate input data
    validator = BookingValidator(data)
    if not validator.is_valid():
        return error_response(validator.errors, 400)
    
    # 2. Check authentication (optional)
    user = get_current_user()  # From JWT token
    
    # 3. Check rate limiting
    check_rate_limit(data['user_phone'])
    
    # 4. Verify warehouse exists and active
    warehouse = Warehouse.query.get(data['warehouse_id'])
    if not warehouse or not warehouse.is_active:
        return error_response('Warehouse not found or inactive', 404)
    
    # 5. Verify box exists and belongs to warehouse
    box = Box.query.get(data['box_id'])
    if not box or box.warehouse_id != warehouse.id:
        return error_response('Box not found or does not belong to warehouse', 404)
    
    # 6. Check box availability
    availability = check_box_availability(
        box_id=box.id,
        start_date=data['start_date'],
        end_date=calculate_end_date(data['start_date'], data['duration_months'])
    )
    if not availability['available']:
        return error_response({
            'code': 'box_unavailable',
            'message': 'Box is not available for selected dates',
            'suggested_alternatives': find_alternative_boxes(box)
        }, 409)
    
    # 7. Calculate pricing
    pricing = calculate_booking_price(
        box=box,
        duration_months=data['duration_months'],
        start_date=data['start_date']
    )
    
    # 8. Generate booking identifiers
    booking_number = generate_booking_number()
    
    # 9. Auto-assign operator
    operator = assign_operator(warehouse)
    
    # 10. Create booking
    booking = Booking.create(
        booking_number=booking_number,
        user_id=user.id if user else None,
        warehouse_id=warehouse.id,
        box_id=box.id,
        start_date=data['start_date'],
        end_date=calculate_end_date(data['start_date'], data['duration_months']),
        duration_months=data['duration_months'],
        status='new',
        user_name=data['user_name'],
        user_phone=normalize_phone(data['user_phone']),
        user_email=data.get('user_email'),
        user_comment=data.get('user_comment'),
        monthly_price=pricing['monthly_price'],
        total_price=pricing['total_price'],
        deposit=pricing['deposit'],
        discount_percent=pricing['discount_percent'],
        assigned_operator_id=operator.id if operator else None,
        expires_at=datetime.utcnow() + timedelta(hours=48)
    )
    
    # 11. Queue async tasks
    queue_task('ai_score_lead', booking_id=booking.id)
    queue_task('send_notification', type='booking_created', booking_id=booking.id)
    queue_task('send_notification', type='new_booking_for_operator', operator_id=operator.id, booking_id=booking.id)
    
    # 12. Return response
    return jsonify({
        'success': True,
        'data': {
            'booking': booking.to_dict(include_relations=True),
            'next_steps': get_next_steps(),
            'links': get_booking_links(booking)
        },
        'meta': {
            'timestamp': datetime.utcnow().isoformat(),
            'request_id': request.headers.get('X-Request-ID'),
            'version': '1.0'
        }
    }), 201
```

---

#### 6.1.8. Error Responses

**400 Bad Request - Validation Errors:**

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибки валидации данных",
    "details": {
      "user_phone": "Введите корректный номер телефона",
      "start_date": "Дата начала должна быть не раньше сегодня",
      "duration_months": "Срок аренды должен быть от 1 до 24 месяцев"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T14:30:00Z",
    "request_id": "req_abc123"
  }
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "message": "Требуется авторизация",
    "details": {
      "reason": "Invalid or expired token"
    }
  }
}
```

**404 Not Found - Warehouse/Box:**

```json
{
  "success": false,
  "error": {
    "code": "resource_not_found",
    "message": "Склад или бокс не найден",
    "details": {
      "warehouse_id": 101,
      "box_id": 501
    }
  }
}
```

**409 Conflict - Box Unavailable:**

```json
{
  "success": false,
  "error": {
    "code": "box_unavailable",
    "message": "Бокс недоступен на выбранные даты",
    "details": {
      "box_id": 501,
      "requested_dates": {
        "start": "2025-12-15",
        "end": "2026-06-15"
      },
      "conflict": {
        "booking_id": 999,
        "occupied_until": "2026-01-15"
      },
      "suggested_alternatives": [
        {
          "box_id": 502,
          "size": "M",
          "price": 4500,
          "available": true
        },
        {
          "box_id": 503,
          "size": "L",
          "price": 5500,
          "available": true
        }
      ]
    }
  }
}
```

**422 Unprocessable Entity:**

```json
{
  "success": false,
  "error": {
    "code": "unprocessable_entity",
    "message": "Невозможно обработать запрос",
    "details": {
      "reason": "Selected warehouse does not accept online bookings"
    }
  }
}
```

**429 Too Many Requests:**

```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Превышен лимит заявок",
    "details": {
      "limit": 3,
      "period": "1 hour",
      "retry_after": 3421
    }
  },
  "meta": {
    "timestamp": "2025-12-11T14:30:00Z",
    "request_id": "req_abc123"
  }
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": {
    "code": "internal_server_error",
    "message": "Внутренняя ошибка сервера",
    "details": {
      "error_id": "ERR_20251211_143000",
      "support_email": "support@storagecompare.ae"
    }
  }
}
```

---

### 6.2. GET /api/v1/bookings/{id} — получение заявки

#### 6.2.1. Request Parameters

```
GET /api/v1/bookings/{id}
Authorization: Bearer <token> (required)
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | ✅ | Booking ID |

---

#### 6.2.2. Response 200 OK

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "booking_number": "BK-20251211-0042",
      "user_id": 123,
      "warehouse": {
        "id": 101,
        "name": "СкладОК Выхино",
        "address": "Москва, Рязанский пр-т, 75к2",
        "phone": "+7 (495) 123-45-67",
        "email": "vykhino@skladok.ru"
      },
      "box": {
        "id": 501,
        "size": "M",
        "dimensions": "2.5×2×2.5",
        "area_sqm": 5,
        "floor": 1,
        "features": ["climate_control", "24h_access"]
      },
      "dates": {
        "start_date": "2025-12-15",
        "end_date": "2026-06-15",
        "duration_months": 6,
        "days_until_start": 4,
        "days_remaining": null
      },
      "pricing": {
        "monthly_price": 4500,
        "discount_percent": 10,
        "discounted_monthly_price": 4050,
        "total_rental": 24300,
        "deposit": 4500,
        "grand_total": 28800,
        "currency": "RUB"
      },
      "status": "in_progress",
      "contact_info": {
        "name": "Ahmed Al-Rashid",
        "phone": "+971501234567",
        "email": "ivan@example.com"
      },
      "user_comment": "Хочу хранить мебель на время ремонта",
      "operator": {
        "assigned": true,
        "operator_id": 456,
        "operator_name": "Мария Смирнова",
        "operator_phone": "+7 (495) 123-45-68"
      },
      "lead_score": 75,
      "status_history": [
        {
          "status": "new",
          "timestamp": "2025-12-11T14:30:00Z",
          "actor": "system",
          "note": "Заявка создана"
        },
        {
          "status": "in_progress",
          "timestamp": "2025-12-11T15:00:00Z",
          "actor": "operator",
          "actor_name": "Мария Смирнова",
          "note": "Взято в работу"
        }
      ],
      "timestamps": {
        "created_at": "2025-12-11T14:30:00Z",
        "updated_at": "2025-12-11T15:00:00Z",
        "expires_at": "2025-12-13T14:30:00Z"
      },
      "actions_available": {
        "can_cancel": true,
        "can_contact_operator": true,
        "can_edit": false
      }
    }
  },
  "meta": {
    "timestamp": "2025-12-11T15:30:00Z",
    "request_id": "req_def456"
  }
}
```

---

#### 6.2.3. Response Schema

(Similar to POST /bookings response, with additional fields: `status_history`, `actions_available`)

---

#### 6.2.4. Authorization Rules

**Access control:**

```python
def can_view_booking(user, booking):
    # Owner can view
    if booking.user_id == user.id:
        return True
    
    # Assigned operator can view
    if user.role == 'operator' and booking.assigned_operator_id == user.id:
        return True
    
    # Any operator from same warehouse can view
    if user.role == 'operator' and booking.warehouse.operator_id == user.id:
        return True
    
    # Admin can view all
    if user.role == 'admin':
        return True
    
    return False
```

---

#### 6.2.5. Error Responses

**403 Forbidden:**

```json
{
  "success": false,
  "error": {
    "code": "forbidden",
    "message": "У вас нет доступа к этому бронированию",
    "details": {
      "booking_id": 1001
    }
  }
}
```

**404 Not Found:**

```json
{
  "success": false,
  "error": {
    "code": "booking_not_found",
    "message": "Бронирование с ID 1001 не найдено",
    "details": {
      "booking_id": 1001
    }
  }
}
```

---

### 6.3. GET /api/v1/user/bookings — заявки пользователя

#### 6.3.1. Query Parameters

```
GET /api/v1/user/bookings?status=new&page=1&per_page=20&sort=created_at_desc
Authorization: Bearer <token> (required)
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | ❌ | all | Filter by status (new/in_progress/contacted/approved/rejected/cancelled/expired) |
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 20 | Items per page (max 100) |
| `sort` | string | ❌ | created_at_desc | Sort order (created_at_asc/created_at_desc/updated_at_desc) |

---

#### 6.3.2. Pagination

**Standard pagination structure:**

```json
{
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 3,
    "total_items": 47,
    "has_next": true,
    "has_prev": false
  }
}
```

---

#### 6.3.3. Filtering

**Filter examples:**

```bash
# All bookings
GET /api/v1/user/bookings

# Only pending bookings
GET /api/v1/user/bookings?status=new,in_progress,contacted

# Only approved
GET /api/v1/user/bookings?status=approved

# Only rejected/cancelled/expired
GET /api/v1/user/bookings?status=rejected,cancelled,expired
```

---

#### 6.3.4. Sorting

**Available sort options:**

| Sort Value | Description |
|------------|-------------|
| `created_at_desc` | Newest first (default) |
| `created_at_asc` | Oldest first |
| `updated_at_desc` | Recently updated first |
| `status` | By status (alphabetical) |

---

#### 6.3.5. Response Schema

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1001,
        "booking_number": "BK-20251211-0042",
        "warehouse_name": "СкладОК Выхино",
        "box_size": "M (5 м²)",
        "start_date": "2025-12-15",
        "duration_months": 6,
        "total_price": 28800,
        "status": "in_progress",
        "status_display": "В обработке",
        "created_at": "2025-12-11T14:30:00Z",
        "updated_at": "2025-12-11T15:00:00Z"
      },
      {
        "id": 998,
        "booking_number": "BK-20251210-0031",
        "warehouse_name": "СкладБокс Текстильщики",
        "box_size": "S (2 м²)",
        "start_date": "2025-12-12",
        "duration_months": 3,
        "total_price": 9600,
        "status": "approved",
        "status_display": "Подтверждено",
        "created_at": "2025-12-10T10:20:00Z",
        "updated_at": "2025-12-10T12:30:00Z"
      }
    ],
    "summary": {
      "total_bookings": 47,
      "by_status": {
        "new": 2,
        "in_progress": 1,
        "contacted": 0,
        "approved": 3,
        "rejected": 15,
        "cancelled": 10,
        "expired": 16
      }
    }
  },
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 3,
    "total_items": 47,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2025-12-11T16:00:00Z",
    "request_id": "req_ghi789"
  }
}
```

---

### 6.4. PATCH /api/v1/bookings/{id} — обновление статуса (оператор)

#### 6.4.1. Request Body Schema

```json
{
  "status": "string, required",
  "reason": "string, optional (required for rejection)",
  "note": "string, optional",
  "operator_comment": "string, optional"
}
```

---

#### 6.4.2. Allowed Status Transitions

**Operator can transition:**

```python
OPERATOR_ALLOWED_TRANSITIONS = {
    'new': ['in_progress', 'rejected'],
    'in_progress': ['contacted', 'approved', 'rejected'],
    'contacted': ['approved', 'rejected']
}
```

**Request examples:**

```json
// Take booking to work
{
  "status": "in_progress",
  "note": "Взял в работу"
}

// Mark as contacted
{
  "status": "contacted",
  "note": "Связался с клиентом по телефону"
}

// Approve booking
{
  "status": "approved",
  "note": "Все условия согласованы, бокс зарезервирован"
}

// Reject booking
{
  "status": "rejected",
  "reason": "box_unavailable",
  "note": "Бокс уже занят на эти даты",
  "operator_comment": "Предложил альтернативный бокс L на 2 этаже"
}
```

---

#### 6.4.3. Response Schema

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "status": "approved",
      "updated_at": "2025-12-11T16:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T16:30:00Z",
    "request_id": "req_jkl012"
  }
}
```

---

#### 6.4.4. Authorization (operator only)

```python
@app.route('/api/v1/bookings/<int:id>', methods=['PATCH'])
@require_role('operator', 'admin')
def update_booking_status(id):
    booking = Booking.query.get_or_404(id)
    
    # Verify operator owns this warehouse
    if current_user.role == 'operator':
        if booking.assigned_operator_id != current_user.id:
            # Check if operator is from same warehouse
            if booking.warehouse.operator_id != current_user.id:
                return error_response('You do not have access to this booking', 403)
    
    # ... process update
```

---

### 6.5. GET /api/v1/operator/bookings — список заявок оператора

#### 6.5.1. Query Parameters

```
GET /api/v1/operator/bookings?status=new&warehouse_id=101&sort=lead_score_desc
Authorization: Bearer <token> (required, operator role)
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | ❌ | all | Filter by status |
| `warehouse_id` | integer | ❌ | all | Filter by warehouse |
| `date_from` | string | ❌ | - | Filter by created_at >= date |
| `date_to` | string | ❌ | - | Filter by created_at <= date |
| `sort` | string | ❌ | lead_score_desc | Sort order |
| `page` | integer | ❌ | 1 | Page number |
| `per_page` | integer | ❌ | 50 | Items per page |

---

#### 6.5.2. Filtering by Status

```bash
# New bookings only
GET /api/v1/operator/bookings?status=new

# Pending bookings (new + in_progress + contacted)
GET /api/v1/operator/bookings?status=new,in_progress,contacted

# Completed bookings
GET /api/v1/operator/bookings?status=approved,rejected,cancelled,expired
```

---

#### 6.5.3. Filtering by Warehouse

```bash
# All warehouses for this operator
GET /api/v1/operator/bookings

# Specific warehouse
GET /api/v1/operator/bookings?warehouse_id=101
```

---

#### 6.5.4. Filtering by Date Range

```bash
# Today's bookings
GET /api/v1/operator/bookings?date_from=2025-12-11&date_to=2025-12-11

# Last 7 days
GET /api/v1/operator/bookings?date_from=2025-12-04&date_to=2025-12-11

# This month
GET /api/v1/operator/bookings?date_from=2025-12-01&date_to=2025-12-31
```

---

#### 6.5.5. Lead Score Ordering

**Default sort: High score first**

```bash
# High priority leads first (default)
GET /api/v1/operator/bookings?sort=lead_score_desc

# Oldest first
GET /api/v1/operator/bookings?sort=created_at_asc

# Recently updated
GET /api/v1/operator/bookings?sort=updated_at_desc
```

---

#### 6.5.6. Response Schema

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1001,
        "booking_number": "BK-20251211-0042",
        "status": "new",
        "lead_score": 85,
        "priority": "high",
        "customer": {
          "name": "Ahmed Al-Rashid",
          "phone": "+971501234567",
          "email": "ivan@example.com"
        },
        "warehouse": {
          "id": 101,
          "name": "СкладОК Выхино"
        },
        "box": {
          "id": 501,
          "size": "M (5 м²)"
        },
        "dates": {
          "start_date": "2025-12-15",
          "duration_months": 6
        },
        "pricing": {
          "total": 28800,
          "currency": "RUB"
        },
        "created_at": "2025-12-11T14:30:00Z",
        "time_since_created": "2 hours ago",
        "is_read": false
      }
    ],
    "summary": {
      "total": 47,
      "unread": 12,
      "by_status": {
        "new": 8,
        "in_progress": 3,
        "contacted": 1
      },
      "by_priority": {
        "high": 5,
        "medium": 4,
        "low": 3
      }
    }
  },
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_pages": 1,
    "total_items": 12
  },
  "meta": {
    "timestamp": "2025-12-11T16:30:00Z"
  }
}
```

---

**End of Sections 5 and 6.1-6.5**

---
# Booking Flow — Deep Technical Specification (MVP → v2)

## PART 4: API Completion & Integrations

---

## 6. API Specification (продолжение)

### 6.6. POST /api/v1/bookings/{id}/confirm — подтверждение заявки

**Описание:**  
Оператор подтверждает заявку, переводя её в статус `approved`.

**Endpoint:**
```
POST /api/v1/bookings/{id}/confirm
Authorization: Bearer <token> (required, operator role)
```

---

#### 6.6.1. Request Body

```json
{
  "note": "Все условия согласованы с клиентом",
  "operator_comment": "Клиент готов приехать 15 декабря в 10:00",
  "send_notification": true
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `note` | string | ❌ | Публичная заметка (видна клиенту) |
| `operator_comment` | string | ❌ | Внутренний комментарий (только операторы) |
| `send_notification` | boolean | ❌ | Отправить уведомление клиенту (default: true) |

---

#### 6.6.2. Business Logic

```python
@app.route('/api/v1/bookings/<int:id>/confirm', methods=['POST'])
@require_role('operator', 'admin')
def confirm_booking(id):
    booking = Booking.query.get_or_404(id)
    data = request.get_json()
    
    # 1. Verify operator has access
    verify_operator_access(current_user, booking)
    
    # 2. Check current status allows confirmation
    if booking.status not in ['in_progress', 'contacted']:
        return error_response(
            f"Cannot confirm booking with status '{booking.status}'",
            400
        )
    
    # 3. Double-check box availability
    availability = check_box_availability(
        booking.box_id,
        booking.start_date,
        booking.end_date
    )
    if not availability['available']:
        return error_response({
            'code': 'box_no_longer_available',
            'message': 'Бокс больше недоступен',
            'conflict': availability['conflict']
        }, 409)
    
    # 4. Update booking status
    old_status = booking.status
    booking.status = 'approved'
    booking.updated_at = datetime.utcnow()
    booking.approved_at = datetime.utcnow()
    booking.approved_by = current_user.id
    
    # 5. Reserve box (v2: hard reservation)
    if settings.HARD_RESERVATION_ENABLED:
        reserve_box(booking.box_id, booking.start_date, booking.end_date)
    
    # 6. Add status change to history
    log_status_change(
        booking_id=booking.id,
        from_status=old_status,
        to_status='approved',
        actor=current_user.id,
        actor_type='operator',
        note=data.get('note')
    )
    
    # 7. Add operator comment if provided
    if data.get('operator_comment'):
        add_booking_comment(
            booking_id=booking.id,
            user_id=current_user.id,
            comment=data['operator_comment'],
            comment_type='internal'
        )
    
    # 8. Generate documents (v2)
    if settings.GENERATE_DOCUMENTS:
        contract = generate_contract(booking)
        invoice = generate_invoice(booking)
        booking.contract_url = contract.url
        booking.invoice_url = invoice.url
    
    booking.save()
    
    # 9. Send notifications
    if data.get('send_notification', True):
        queue_task('send_notification', {
            'type': 'booking_confirmed',
            'user_id': booking.user_id,
            'booking_id': booking.id,
            'data': {
                'booking_number': booking.booking_number,
                'warehouse_name': booking.warehouse.name,
                'contract_url': booking.contract_url,
                'invoice_url': booking.invoice_url
            }
        })
    
    # 10. Return response
    return jsonify({
        'success': True,
        'data': {
            'booking': booking.to_dict(include_full=True),
            'message': 'Бронирование подтверждено'
        }
    }), 200
```

---

#### 6.6.3. Response Schema

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "booking_number": "BK-20251211-0042",
      "status": "approved",
      "approved_at": "2025-12-11T16:45:00Z",
      "approved_by": {
        "id": 456,
        "name": "Мария Смирнова"
      },
      "contract_url": "https://cdn.storagecompare.ae/contracts/BK-20251211-0042.pdf",
      "invoice_url": "https://cdn.storagecompare.ae/invoices/BK-20251211-0042.pdf",
      "updated_at": "2025-12-11T16:45:00Z"
    },
    "message": "Бронирование подтверждено"
  },
  "meta": {
    "timestamp": "2025-12-11T16:45:00Z",
    "request_id": "req_mno345"
  }
}
```

---

### 6.7. POST /api/v1/bookings/{id}/reject — отклонение заявки

**Описание:**  
Оператор отклоняет заявку с обязательным указанием причины.

**Endpoint:**
```
POST /api/v1/bookings/{id}/reject
Authorization: Bearer <token> (required, operator role)
```

---

#### 6.7.1. Request Body (reason required)

```json
{
  "reason": "box_unavailable",
  "reason_text": "Бокс уже забронирован на эти даты другим клиентом",
  "operator_comment": "Предложил альтернативный бокс L на 2 этаже - клиент отказался",
  "suggested_alternatives": [502, 503],
  "send_notification": true
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | enum | ✅ | Код причины отклонения |
| `reason_text` | string | ✅ | Текстовое описание причины |
| `operator_comment` | string | ❌ | Внутренний комментарий |
| `suggested_alternatives` | array | ❌ | ID альтернативных боксов |
| `send_notification` | boolean | ❌ | Отправить уведомление (default: true) |

**Reason codes:**

| Code | Description |
|------|-------------|
| `box_unavailable` | Бокс уже занят |
| `dates_unavailable` | Не подходят даты |
| `customer_unreachable` | Не удалось связаться с клиентом |
| `customer_declined` | Клиент отказался от аренды |
| `price_disagreement` | Не договорились о цене |
| `suspicious_activity` | Подозрительная заявка |
| `incomplete_info` | Недостаточно информации |
| `other` | Другая причина |

---

#### 6.7.2. Business Logic

```python
@app.route('/api/v1/bookings/<int:id>/reject', methods=['POST'])
@require_role('operator', 'admin')
def reject_booking(id):
    booking = Booking.query.get_or_404(id)
    data = request.get_json()
    
    # 1. Verify operator access
    verify_operator_access(current_user, booking)
    
    # 2. Validate reason provided
    if not data.get('reason') or not data.get('reason_text'):
        return error_response(
            'Reason and reason_text are required',
            400
        )
    
    # 3. Check current status allows rejection
    if booking.status not in ['new', 'in_progress', 'contacted']:
        return error_response(
            f"Cannot reject booking with status '{booking.status}'",
            400
        )
    
    # 4. Update booking status
    old_status = booking.status
    booking.status = 'rejected'
    booking.rejection_reason = data['reason']
    booking.rejection_reason_text = data['reason_text']
    booking.rejected_at = datetime.utcnow()
    booking.rejected_by = current_user.id
    booking.updated_at = datetime.utcnow()
    
    # 5. Log status change
    log_status_change(
        booking_id=booking.id,
        from_status=old_status,
        to_status='rejected',
        actor=current_user.id,
        actor_type='operator',
        reason=data['reason'],
        note=data['reason_text']
    )
    
    # 6. Add operator comment
    if data.get('operator_comment'):
        add_booking_comment(
            booking_id=booking.id,
            user_id=current_user.id,
            comment=data['operator_comment'],
            comment_type='internal'
        )
    
    # 7. Find suggested alternatives if not provided
    suggested_alternatives = data.get('suggested_alternatives', [])
    if not suggested_alternatives and data['reason'] in ['box_unavailable', 'dates_unavailable']:
        alternatives = find_alternative_boxes(
            warehouse_id=booking.warehouse_id,
            size_range=(booking.box.area_sqm * 0.8, booking.box.area_sqm * 1.2),
            start_date=booking.start_date,
            end_date=booking.end_date
        )
        suggested_alternatives = [box.id for box in alternatives[:3]]
    
    booking.save()
    
    # 8. Send notification to user
    if data.get('send_notification', True):
        alternatives_data = []
        if suggested_alternatives:
            alternatives_data = [
                Box.query.get(box_id).to_dict()
                for box_id in suggested_alternatives
            ]
        
        queue_task('send_notification', {
            'type': 'booking_rejected',
            'user_id': booking.user_id,
            'booking_id': booking.id,
            'data': {
                'booking_number': booking.booking_number,
                'reason': data['reason_text'],
                'alternatives': alternatives_data
            }
        })
    
    # 9. Return response
    return jsonify({
        'success': True,
        'data': {
            'booking': booking.to_dict(),
            'message': 'Заявка отклонена'
        }
    }), 200
```

---

#### 6.7.3. Response Schema

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "booking_number": "BK-20251211-0042",
      "status": "rejected",
      "rejection_reason": "box_unavailable",
      "rejection_reason_text": "Бокс уже забронирован на эти даты",
      "rejected_at": "2025-12-11T17:00:00Z",
      "rejected_by": {
        "id": 456,
        "name": "Мария Смирнова"
      }
    },
    "message": "Заявка отклонена"
  },
  "meta": {
    "timestamp": "2025-12-11T17:00:00Z"
  }
}
```

---

### 6.8. POST /api/v1/bookings/{id}/cancel — отмена заявки пользователем

**Описание:**  
Пользователь отменяет свою заявку (до подтверждения оператором).

**Endpoint:**
```
POST /api/v1/bookings/{id}/cancel
Authorization: Bearer <token> (required, user role)
```

---

#### 6.8.1. Request Body

```json
{
  "cancellation_reason": "changed_my_mind",
  "cancellation_note": "Решил использовать другой склад ближе к дому"
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cancellation_reason` | enum | ❌ | Код причины отмены |
| `cancellation_note` | string | ❌ | Текстовое пояснение |

**Cancellation reason codes:**

| Code | Description |
|------|-------------|
| `changed_my_mind` | Передумал |
| `found_alternative` | Нашёл другой вариант |
| `too_expensive` | Слишком дорого |
| `dates_changed` | Изменились планы по датам |
| `no_longer_needed` | Больше не нужно |
| `other` | Другая причина |

---

#### 6.8.2. Cancellation Rules

**Правила отмены:**

```python
def can_cancel_booking(user, booking):
    # Must be owner
    if booking.user_id != user.id:
        return False, "Not your booking"
    
    # Can only cancel before approval
    if booking.status not in ['new', 'in_progress', 'contacted']:
        return False, f"Cannot cancel booking with status '{booking.status}'"
    
    # Cannot cancel if already approved
    if booking.status == 'approved':
        return False, "Booking is already approved. Contact operator to cancel."
    
    return True, None
```

**Implementation:**

```python
@app.route('/api/v1/bookings/<int:id>/cancel', methods=['POST'])
@require_auth
def cancel_booking(id):
    booking = Booking.query.get_or_404(id)
    data = request.get_json()
    
    # 1. Verify ownership
    if booking.user_id != current_user.id:
        return error_response('Not authorized to cancel this booking', 403)
    
    # 2. Check cancellation rules
    can_cancel, reason = can_cancel_booking(current_user, booking)
    if not can_cancel:
        return error_response(reason, 400)
    
    # 3. Update status
    old_status = booking.status
    booking.status = 'cancelled'
    booking.cancellation_reason = data.get('cancellation_reason')
    booking.cancellation_note = data.get('cancellation_note')
    booking.cancelled_at = datetime.utcnow()
    booking.cancelled_by = current_user.id
    booking.updated_at = datetime.utcnow()
    
    # 4. Log status change
    log_status_change(
        booking_id=booking.id,
        from_status=old_status,
        to_status='cancelled',
        actor=current_user.id,
        actor_type='user',
        reason=data.get('cancellation_reason'),
        note=data.get('cancellation_note')
    )
    
    # 5. Release box reservation (v2)
    if settings.HARD_RESERVATION_ENABLED:
        release_box_reservation(booking.box_id)
    
    booking.save()
    
    # 6. Notify operator
    queue_task('send_notification', {
        'type': 'booking_cancelled_by_user',
        'user_id': booking.assigned_operator_id,
        'booking_id': booking.id
    })
    
    # 7. Send confirmation to user
    queue_task('send_notification', {
        'type': 'booking_cancellation_confirmed',
        'user_id': current_user.id,
        'booking_id': booking.id
    })
    
    return jsonify({
        'success': True,
        'data': {
            'booking': booking.to_dict(),
            'message': 'Заявка отменена'
        }
    }), 200
```

---

#### 6.8.3. Response Schema

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1001,
      "booking_number": "BK-20251211-0042",
      "status": "cancelled",
      "cancellation_reason": "found_alternative",
      "cancellation_note": "Нашёл склад ближе к дому",
      "cancelled_at": "2025-12-11T17:15:00Z"
    },
    "message": "Заявка отменена"
  },
  "meta": {
    "timestamp": "2025-12-11T17:15:00Z"
  }
}
```

---

### 6.9. Ошибки Booking API

Comprehensive error handling для всех booking endpoints.

#### 6.9.1. 400 Bad Request (validation errors)

**Причины:**
- Некорректные данные в запросе
- Не заполнены обязательные поля
- Невалидные форматы (email, телефон, дата)
- Бизнес-правила нарушены

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибки валидации данных",
    "details": {
      "user_phone": "Некорректный формат телефона",
      "start_date": "Дата должна быть в будущем",
      "duration_months": "Значение должно быть от 1 до 24"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T17:20:00Z",
    "request_id": "req_pqr678"
  }
}
```

---

#### 6.9.2. 401 Unauthorized

**Причины:**
- Отсутствует токен авторизации
- Невалидный токен
- Истёкший токен

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "message": "Требуется авторизация",
    "details": {
      "reason": "Invalid or expired token"
    }
  }
}
```

---

#### 6.9.3. 403 Forbidden

**Причины:**
- Нет прав доступа к ресурсу
- Попытка изменить чужую заявку
- Недостаточно прав для операции

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "forbidden",
    "message": "У вас нет доступа к этой заявке",
    "details": {
      "booking_id": 1001,
      "required_role": "operator"
    }
  }
}
```

---

#### 6.9.4. 404 Not Found

**Причины:**
- Заявка не найдена
- Склад не найден
- Бокс не найден

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "resource_not_found",
    "message": "Бронирование не найдено",
    "details": {
      "booking_id": 9999,
      "resource_type": "booking"
    }
  }
}
```

---

#### 6.9.5. 409 Conflict (box unavailable)

**Причины:**
- Бокс уже занят на выбранные даты
- Конфликт резервации
- Race condition

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "box_unavailable",
    "message": "Бокс недоступен на выбранные даты",
    "details": {
      "box_id": 501,
      "requested_dates": {
        "start": "2025-12-15",
        "end": "2026-06-15"
      },
      "conflict": {
        "booking_id": 998,
        "occupied_from": "2025-12-01",
        "occupied_until": "2026-01-15"
      },
      "next_available_date": "2026-01-16",
      "suggested_alternatives": [
        {
          "box_id": 502,
          "size": "M (5 m²)",
          "price": 4500,
          "floor": 2,
          "available": true
        },
        {
          "box_id": 503,
          "size": "L (7 m²)",
          "price": 5500,
          "floor": 1,
          "available": true
        }
      ]
    }
  }
}
```

---

#### 6.9.6. 422 Unprocessable Entity

**Причины:**
- Бизнес-логика не позволяет выполнить операцию
- Невозможный переход статуса
- Недопустимая операция для текущего состояния

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "unprocessable_entity",
    "message": "Невозможно выполнить операцию",
    "details": {
      "reason": "Cannot approve booking that is already rejected",
      "current_status": "rejected",
      "attempted_action": "approve"
    }
  }
}
```

---

#### 6.9.7. 429 Too Many Requests

**Причины:**
- Превышен rate limit по телефону
- Превышен rate limit по IP
- Превышен rate limit по user_id

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Превышен лимит заявок",
    "details": {
      "limit": 3,
      "period": "1 hour",
      "retry_after": 2145,
      "retry_after_human": "35 минут 45 секунд"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T17:30:00Z"
  }
}
```

---

#### 6.9.8. 500 Internal Server Error

**Причины:**
- Ошибка базы данных
- Ошибка внешнего сервиса
- Непредвиденная ошибка

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "internal_server_error",
    "message": "Внутренняя ошибка сервера",
    "details": {
      "error_id": "ERR_20251211_173045",
      "support_email": "support@storagecompare.ae",
      "support_phone": "+7 (800) 555-35-35"
    }
  },
  "meta": {
    "timestamp": "2025-12-11T17:30:45Z",
    "request_id": "req_stu901"
  }
}
```

**Логирование:**

```python
@app.errorhandler(500)
def handle_internal_error(error):
    error_id = generate_error_id()
    
    # Log full error with stack trace
    logger.error(f"Internal error {error_id}", exc_info=True, extra={
        'error_id': error_id,
        'request_id': request.headers.get('X-Request-ID'),
        'user_id': getattr(current_user, 'id', None),
        'endpoint': request.endpoint,
        'method': request.method,
        'url': request.url
    })
    
    # Return sanitized error to user
    return jsonify({
        'success': False,
        'error': {
            'code': 'internal_server_error',
            'message': 'Произошла внутренняя ошибка. Мы уже работаем над её исправлением.',
            'details': {
                'error_id': error_id,
                'support_email': settings.SUPPORT_EMAIL
            }
        }
    }), 500
```

---

#### 6.9.9. 503 Service Unavailable

**Причины:**
- Сервис временно недоступен
- Maintenance mode
- Overload protection

**Пример:**

```json
{
  "success": false,
  "error": {
    "code": "service_unavailable",
    "message": "Сервис временно недоступен",
    "details": {
      "reason": "maintenance",
      "estimated_recovery": "2025-12-11T18:00:00Z",
      "retry_after": 1800
    }
  }
}
```

---

### 6.10. Роли доступа

Детальное описание прав доступа для каждой роли.

#### 6.10.1. User role permissions

**Базовые права пользователя:**

| Действие | Разрешено | Условия |
|----------|-----------|---------|
| Создать заявку | ✅ | Rate limit: 3/час |
| Просмотреть свою заявку | ✅ | Только свои |
| Просмотреть список своих заявок | ✅ | Только свои |
| Отменить свою заявку | ✅ | До статуса `approved` |
| Изменить статус заявки | ❌ | - |
| Просмотреть чужую заявку | ❌ | - |
| Удалить заявку | ❌ | - |

**Code implementation:**

```python
class UserPermissions:
    @staticmethod
    def can_view_booking(user, booking):
        return booking.user_id == user.id
    
    @staticmethod
    def can_cancel_booking(user, booking):
        return (
            booking.user_id == user.id and
            booking.status in ['new', 'in_progress', 'contacted']
        )
    
    @staticmethod
    def can_create_booking(user):
        # Check rate limit
        recent_bookings = Booking.query.filter(
            Booking.user_id == user.id,
            Booking.created_at >= datetime.utcnow() - timedelta(hours=1)
        ).count()
        
        return recent_bookings < 3
```

---

#### 6.10.2. Operator role permissions

**Права оператора:**

| Действие | Разрешено | Условия |
|----------|-----------|---------|
| Просмотреть заявки на своих складах | ✅ | Только свои склады |
| Изменить статус заявки | ✅ | Только свои склады |
| Подтвердить заявку | ✅ | Только свои склады |
| Отклонить заявку | ✅ | Только свои склады |
| Добавить комментарий | ✅ | Публичный и внутренний |
| Просмотреть заявки других складов | ❌ | - |
| Удалить заявку | ❌ | - |
| Изменить данные заявки | ❌ | - |

**Code implementation:**

```python
class OperatorPermissions:
    @staticmethod
    def can_manage_booking(operator, booking):
        # Operator must be assigned or own warehouse
        if booking.assigned_operator_id == operator.id:
            return True
        
        if booking.warehouse.operator_id == operator.id:
            return True
        
        return False
    
    @staticmethod
    def can_change_status(operator, booking, new_status):
        if not OperatorPermissions.can_manage_booking(operator, booking):
            return False
        
        # Check valid transition
        state_machine = BookingStateMachine()
        return state_machine.can_transition(booking.status, new_status)
```

---

#### 6.10.3. Admin role permissions

**Права администратора (полный доступ):**

| Действие | Разрешено | Условия |
|----------|-----------|---------|
| Просмотреть любую заявку | ✅ | Без ограничений |
| Изменить любую заявку | ✅ | Без ограничений |
| Удалить заявку | ✅ | Soft delete |
| Переназначить заявку | ✅ | Любому оператору |
| Изменить любой статус | ✅ | Игнорируя правила |
| Просмотреть всю статистику | ✅ | - |
| Экспортировать данные | ✅ | - |

**Code implementation:**

```python
class AdminPermissions:
    @staticmethod
    def can_do_anything(admin):
        return admin.role == 'admin'
```

---

#### 6.10.4. Anonymous user limitations

**Ограничения для неавторизованных пользователей:**

| Действие | Разрешено | Ограничения |
|----------|-----------|-------------|
| Создать заявку | ✅ | Rate limit: 2/час по IP |
| Просмотреть заявку | ✅ | Только по прямой ссылке из email |
| Отменить заявку | ✅ | Через ссылку в email |
| Список заявок | ❌ | Требуется авторизация |
| История заявок | ❌ | Требуется авторизация |

**Anonymous booking tracking:**

```python
# Generate secure token for anonymous booking
def generate_booking_token(booking):
    payload = {
        'booking_id': booking.id,
        'phone': booking.user_phone,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

# Email contains link like:
# https://storagecompare.ae/bookings/track?token=eyJhbGc...
```

---

## 7. Интеграция с операторским рабочим местом

### 7.1. Как оператор видит заявки

#### 7.1.1. Дашборд заявок

**Main Dashboard View:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Operator Dashboard - СкладОК Выхино                 [Мария] [⚙️] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 СЕГОДНЯШНЯЯ СТАТИСТИКА                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│
│  │ Новые: 8    │ │ В работе: 3 │ │ Ожидают: 1  │ │ Одобрено:5││
│  │ 🔴 Высокий  │ │ ⏰ 2 просроч.│ │ ⏳ 4ч назад │ │ ✅ Сегодня││
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘│
│                                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  🔔 ТРЕБУЮТ ВНИМАНИЯ (2)                                         │
│                                                                   │
│  ⚠️ BK-20251211-0039 - Ahmed Al-Rashid                              │
│     Создана 6 часов назад | Lead Score: 85 🔥                   │
│     Бокс M (5м²) | 28 800₽ | Начало: 15.12.2025                │
│     [Связаться] [Подробнее]                                      │
│                                                                   │
│  ⚠️ BK-20251211-0035 - Noura Abdullah                            │
│     Создана 8 часов назад | Lead Score: 72                      │
│     Бокс S (2м²) | 9 600₽ | Начало: 14.12.2025                 │
│     [Связаться] [Подробнее]                                      │
│                                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  📋 ВСЕ ЗАЯВКИ                                                   │
│                                                                   │
│  Фильтры: [🔴 Новые] [⏳ В работе] [ ] Связались [ ] Все        │
│  Склад: [СкладОК Выхино ▼]  Период: [Сегодня ▼]                │
│  Сортировка: [Lead Score (высокий → низкий) ▼]                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ BK-20251211-0042 | Ahmed Al-Rashid | +7(999)123-45-67       │   │
│  │ Бокс M (5м²) | 28 800₽ | Начало: 15.12.2025              │   │
│  │ 🔥 Lead Score: 85 | ⏰ 2 часа назад | 📱 Не прочитано     │   │
│  │ [📞 Позвонить] [✅ Одобрить] [❌ Отклонить] [👁️ Открыть] │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ... (больше заявок)                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Key metrics displayed:**

| Метрика | Описание | Цветовое кодирование |
|---------|----------|---------------------|
| Новые заявки | Статус `new` | 🔴 Red badge если > 5 |
| В работе | Статус `in_progress` | ⏰ Yellow если > 4ч |
| Ожидают | Статус `contacted` | ⏳ Orange если > 24ч |
| Одобрено | Статус `approved` сегодня | ✅ Green |
| Conversion rate | % одобренных от общего | 📈 Trend indicator |

---

#### 7.1.2. Фильтры и поиск

**Available filters:**

```typescript
interface BookingFilters {
  status?: string[];              // ['new', 'in_progress', 'contacted']
  warehouse_id?: number;          // Specific warehouse
  date_from?: string;             // ISO date
  date_to?: string;               // ISO date
  lead_score_min?: number;        // 0-100
  lead_score_max?: number;        // 0-100
  search?: string;                // Search in name, phone, booking_number
  is_read?: boolean;              // Unread only
  priority?: string[];            // ['high', 'medium', 'low']
}
```

**Frontend implementation:**

```javascript
const [filters, setFilters] = useState({
  status: ['new', 'in_progress', 'contacted'],
  warehouse_id: null,
  date_from: null,
  date_to: null,
  search: '',
  is_read: null
});

const fetchBookings = async () => {
  const params = new URLSearchParams();
  
  if (filters.status.length > 0) {
    params.append('status', filters.status.join(','));
  }
  if (filters.warehouse_id) {
    params.append('warehouse_id', filters.warehouse_id);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  const response = await fetch(
    `/api/v1/operator/bookings?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  setBookings(data.data.bookings);
};
```

---

#### 7.1.3. Bulk operations

**Bulk actions для операторов:**

```
┌─────────────────────────────────────────────────────────┐
│ ☑️ Выбрано: 3 заявки                                    │
│ [✅ Одобрить все] [❌ Отклонить все] [👤 Переназначить] │
└─────────────────────────────────────────────────────────┘
```

**API endpoint:**

```
POST /api/v1/operator/bookings/bulk-action
{
  "booking_ids": [1001, 1002, 1003],
  "action": "approve",
  "note": "Все условия согласованы"
}
```

**Actions available:**
- `approve` — Одобрить несколько заявок
- `reject` — Отклонить несколько заявок (с одной причиной)
- `mark_read` — Отметить как прочитанные
- `reassign` — Переназначить другому оператору

---

### 7.2. Сортировка по Lead Score

#### 7.2.1. Алгоритм расчета Lead Score

**Lead Score** — оценка качества лида от 0 до 100.

**Факторы:**

| Фактор | Вес | Логика |
|--------|-----|--------|
| Стоимость аренды | 25% | Чем выше, тем лучше |
| Длительность аренды | 20% | 6+ месяцев = высокий |
| Полнота данных | 15% | Email + комментарий = плюс |
| Время создания | 15% | Рабочие часы = выше |
| Повторный клиент | 15% | Был раньше = выше |
| AI prediction | 10% | ML-модель оценки |

**Implementation:**

```python
def calculate_lead_score(booking):
    score = 0
    
    # 1. Rental value (0-25 points)
    # Higher value = higher score
    if booking.total_price >= 30000:
        score += 25
    elif booking.total_price >= 20000:
        score += 20
    elif booking.total_price >= 10000:
        score += 15
    else:
        score += 10
    
    # 2. Duration (0-20 points)
    if booking.duration_months >= 12:
        score += 20
    elif booking.duration_months >= 6:
        score += 15
    elif booking.duration_months >= 3:
        score += 10
    else:
        score += 5
    
    # 3. Data completeness (0-15 points)
    completeness = 0
    if booking.user_email:
        completeness += 5
    if booking.user_comment and len(booking.user_comment) > 20:
        completeness += 5
    if booking.contact_preferences.get('preferred_time'):
        completeness += 5
    score += completeness
    
    # 4. Time of creation (0-15 points)
    # Business hours = higher score
    created_hour = booking.created_at.hour
    if 9 <= created_hour <= 18:
        score += 15  # Business hours
    elif 19 <= created_hour <= 21:
        score += 10  # Evening
    else:
        score += 5   # Night/early morning
    
    # 5. Returning customer (0-15 points)
    if booking.user_id:
        previous_bookings = Booking.query.filter(
            Booking.user_id == booking.user_id,
            Booking.status == 'approved',
            Booking.id != booking.id
        ).count()
        
        if previous_bookings >= 2:
            score += 15
        elif previous_bookings == 1:
            score += 10
    
    # 6. AI prediction (0-10 points)
    # Call ML model
    ai_score = predict_conversion_probability(booking)
    score += int(ai_score * 10)
    
    # Normalize to 0-100
    return min(100, max(0, score))
```

---

#### 7.2.2. Факторы, влияющие на приоритет

**Priority classification:**

```python
def get_booking_priority(lead_score):
    if lead_score >= 80:
        return 'high'    # 🔥 High priority
    elif lead_score >= 60:
        return 'medium'  # ⚡ Medium priority
    else:
        return 'low'     # 📌 Low priority
```

**Additional priority boosters:**

| Условие | Бонус |
|---------|-------|
| Клиент уже звонил | +10 points |
| Указал конкретное время заезда | +5 points |
| Запросил дополнительные услуги | +5 points |
| Большая сумма (>50k) | +10 points |
| Рекомендация от партнёра | +15 points |

---

#### 7.2.3. Визуализация приоритета

**UI indicators:**

```
🔥 High (80-100):    Красный бейдж, жирный шрифт
⚡ Medium (60-79):   Оранжевый бейдж
📌 Low (0-59):       Серый бейдж
```

**List view:**

```
┌──────────────────────────────────────────────────────┐
│ 🔥 85 | BK-20251211-0042 | Ahmed Al-Rashid             │  ← High priority
│ ⚡ 72 | BK-20251211-0041 | Ольга Смирнова          │  ← Medium
│ 📌 45 | BK-20251211-0040 | Петр Сидоров            │  ← Low
└──────────────────────────────────────────────────────┘
```

---

### 7.3. Комментарии

#### 7.3.1. Добавление комментариев оператором

**Comment types:**

| Type | Description | Visibility |
|------|-------------|------------|
| `internal` | Внутренний комментарий | Только операторы |
| `public` | Публичный комментарий | Виден клиенту |
| `system` | Системный комментарий | Все |

**API:**

```
POST /api/v1/operator/bookings/{id}/comment
{
  "comment": "Клиент попросил перезвонить завтра в 10:00",
  "comment_type": "internal"
}
```

**UI:**

```
┌────────────────────────────────────────────────────┐
│ 💬 КОММЕНТАРИИ                                     │
├────────────────────────────────────────────────────┤
│                                                     │
│ [Внутренний комментарий] [Публичный комментарий]  │
│                                                     │
│ Ваш комментарий:                                   │
│ ┌────────────────────────────────────────────┐    │
│ │ Клиент попросил перезвонить завтра в 10:00 │    │
│ │                                             │    │
│ └────────────────────────────────────────────┘    │
│ 0/500 символов                                     │
│                                                     │
│ [Добавить комментарий]                             │
│                                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│ История комментариев:                              │
│                                                     │
│ 📝 Мария Смирнова • 2 часа назад • Внутренний     │
│    "Связалась с клиентом, обсудили условия"       │
│                                                     │
│ 🤖 Система • 4 часа назад                          │
│    "Заявка взята в работу оператором"             │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

#### 7.3.2. Внутренние заметки (не видны клиенту)

**Use cases:**
- Результаты звонка
- Специальные условия, оговоренные с клиентом
- Подозрительное поведение
- Информация для других операторов

**Example:**

```json
{
  "id": 123,
  "booking_id": 1001,
  "user_id": 456,
  "comment_type": "internal",
  "comment": "Клиент просил скидку 15%, договорились на 10%. Согласился.",
  "created_at": "2025-12-11T15:30:00Z"
}
```

---

#### 7.3.3. История комментариев

**Timeline view:**

```
Timeline для заявки BK-20251211-0042:

2025-12-11 14:30 | 🤖 Система
└─ Заявка создана пользователем

2025-12-11 15:00 | 🤖 Система
└─ Заявка автоматически назначена оператору Мария Смирнова

2025-12-11 15:15 | 👤 Мария Смирнова
└─ Статус изменён: new → in_progress

2025-12-11 15:30 | 💬 Мария Смирнова (внутренний)
└─ "Позвонила клиенту, договорились на завтра"

2025-12-11 16:00 | 👤 Мария Смирнова
└─ Статус изменён: in_progress → contacted

2025-12-12 10:15 | 💬 Мария Смирнова (внутренний)
└─ "Клиент приехал, осмотрел бокс, всё устраивает"

2025-12-12 10:30 | 👤 Мария Смирнова
└─ Статус изменён: contacted → approved

2025-12-12 10:30 | 🤖 Система
└─ Отправлено уведомление клиенту о подтверждении
```

---

### 7.4. Напоминания

#### 7.4.1. Автоматические напоминания

**Reminder schedule:**

| Время | Тип | Получатель | Канал |
|-------|-----|------------|-------|
| +4 часа | Первое напоминание | Assigned operator | Email |
| +12 часов | Повторное напоминание | Assigned operator | Email + Push |
| +24 часа | Критическое напоминание | Operator + Manager | Email + Push |
| +36 часов | Эскалация | Manager | Email + SMS |
| +48 часов | Авто-истечение | Admin | Report |

**Email example (4h reminder):**

```
Subject: Напоминание: Заявка BK-20251211-0042 ожидает обработки

Здравствуйте, Мария!

Заявка BK-20251211-0042 ожидает вашего ответа уже 4 часа.

Детали заявки:
• Клиент: Ahmed Al-Rashid (+7 999 123-45-67)
• Бокс: M (5 м²)
• Сумма: 28 800 ₽
• Lead Score: 85 🔥

Пожалуйста, свяжитесь с клиентом как можно скорее.

[Открыть заявку в системе]
```

---

#### 7.4.2. Ручные напоминания

**Operator can set custom reminders:**

```
POST /api/v1/operator/bookings/{id}/reminder
{
  "remind_at": "2025-12-12T10:00:00Z",
  "note": "Позвонить клиенту после 10:00"
}
```

**UI:**

```
┌────────────────────────────────────────┐
│ ⏰ УСТАНОВИТЬ НАПОМИНАНИЕ              │
├────────────────────────────────────────┤
│                                         │
│ Когда напомнить:                       │
│ [12.12.2025] [10:00]                   │
│                                         │
│ Заметка:                               │
│ [Позвонить клиенту после 10:00______] │
│                                         │
│ [Создать напоминание]                  │
└────────────────────────────────────────┘
```

---

#### 7.4.3. Notification preferences

**Operator settings:**

```json
{
  "user_id": 456,
  "notification_preferences": {
    "new_booking": {
      "email": true,
      "push": true,
      "sms": false
    },
    "reminder_4h": {
      "email": true,
      "push": false,
      "sms": false
    },
    "reminder_24h": {
      "email": true,
      "push": true,
      "sms": false
    },
    "high_priority_lead": {
      "email": true,
      "push": true,
      "sms": true
    }
  },
  "quiet_hours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

---

### 7.5. История взаимодействий

#### 7.5.1. Timeline всех действий

**Comprehensive activity log:**

```sql
CREATE TABLE booking_activity_log (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    activity_type VARCHAR(50) NOT NULL,
    actor_id INTEGER REFERENCES users(id),
    actor_type VARCHAR(20),  -- 'user', 'operator', 'system'
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_booking_id (booking_id),
    INDEX idx_created_at (created_at),
    INDEX idx_activity_type (activity_type)
);
```

**Activity types:**

| Type | Description |
|------|-------------|
| `booking_created` | Заявка создана |
| `status_changed` | Изменён статус |
| `comment_added` | Добавлен комментарий |
| `operator_assigned` | Назначен оператор |
| `operator_reassigned` | Переназначен оператор |
| `notification_sent` | Отправлено уведомление |
| `viewed` | Заявка просмотрена |
| `phone_call` | Телефонный звонок |
| `email_sent` | Отправлен email |
| `document_generated` | Сгенерирован документ |

---

#### 7.5.2. Кто, когда, что сделал

**Activity log entry structure:**

```json
{
  "id": 1234,
  "booking_id": 1001,
  "activity_type": "phone_call",
  "actor_id": 456,
  "actor_type": "operator",
  "actor_name": "Мария Смирнова",
  "details": {
    "duration_seconds": 180,
    "outcome": "successful",
    "notes": "Клиент согласен на условия, приедет завтра"
  },
  "created_at": "2025-12-11T15:30:00Z"
}
```

---

#### 7.5.3. Экспорт истории

**Export to CSV:**

```
POST /api/v1/operator/bookings/{id}/export-history
Accept: text/csv
```

**CSV format:**

```csv
Timestamp,Activity,Actor,Details
2025-12-11 14:30:00,Заявка создана,Система,Пользователь: Ahmed Al-Rashid
2025-12-11 15:00:00,Назначен оператор,Система,Оператор: Мария Смирнова
2025-12-11 15:15:00,Статус изменён,Мария Смирнова,new → in_progress
2025-12-11 15:30:00,Телефонный звонок,Мария Смирнова,Длительность: 3 мин
2025-12-11 16:00:00,Статус изменён,Мария Смирнова,in_progress → contacted
```

---

## 8. Логика уведомлений

### 8.1. Какие уведомления отправляются пользователю

#### 8.1.1. Подтверждение создания заявки

**Trigger:** Booking created

**Channels:** Email + SMS

**Timing:** Immediately (< 30 seconds)

**Email template:**

```
Subject: Заявка #BK-20251211-0042 создана ✅

Здравствуйте, Иван!

Ваша заявка на аренду бокса успешно создана.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ДЕТАЛИ ЗАЯВКИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Номер заявки:     BK-20251211-0042
Склад:            СкладОК Выхино
Адрес:            Dubai, Рязанский пр-т, 75к2
Бокс:             M (5 м², 2.5×2×2.5)
Дата начала:      15.12.2025
Срок аренды:      6 месяцев
Итого к оплате:   28 800 ₽

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ЧТО ДАЛЬШЕ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Оператор склада рассмотрит вашу заявку
   в течение 24 часов

2️⃣ Мы свяжемся с вами по телефону
   +971 50 123 4567

3️⃣ После подтверждения вам будут отправлены
   реквизиты для оплаты

Отследить статус заявки:
https://storagecompare.ae/bookings/BK-20251211-0042

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
КОНТАКТЫ СКЛАДА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

СкладОК Выхино
Телефон: +7 (495) 123-45-67
Email: vykhino@skladok.ru

С уважением,
Команда Агрегатора складов
```

**SMS template:**

```
Заявка #BK-20251211-0042 создана. СкладОК Выхино, бокс M (5м²), 28 800₽. 
Оператор свяжется в течение 24ч. Статус: https://s.st/b/042
```

---

#### 8.1.2. Изменение статуса заявки

**Triggers:**

| Status Change | Send Notification |
|---------------|-------------------|
| new → in_progress | ✅ Yes |
| in_progress → contacted | ✅ Yes |
| contacted → approved | ✅ Yes |
| * → rejected | ✅ Yes |
| * → cancelled | ✅ Yes (confirmation) |
| * → expired | ✅ Yes |

**Template (in_progress):**

```
Subject: Ваша заявка в обработке

Здравствуйте, Иван!

Оператор склада СкладОК Выхино взял вашу заявку #BK-20251211-0042 в работу.

Мы свяжемся с вами в ближайшее время.

Статус заявки: https://storagecompare.ae/bookings/BK-20251211-0042
```

---

#### 8.1.3. Одобрение бронирования

**Trigger:** Status changed to `approved`

**Channels:** Email + SMS

**Email template:**

```
Subject: Бронирование подтверждено! 🎉

Здравствуйте, Иван!

Отличные новости! Ваше бронирование подтверждено.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ДЕТАЛИ БРОНИРОВАНИЯ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Номер:            BK-20251211-0042
Склад:            СкладОК Выхино
Бокс:             M (5 м²), 1 этаж
Дата начала:      15.12.2025
Срок:             6 месяцев
Итого:            28 800 ₽

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
СЛЕДУЮЩИЕ ШАГИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ ОПЛАТА
   Произведите оплату по реквизитам:
   
   Счёт: [Скачать счёт]
   Реквизиты: ООО "СкладОК"
   ИНН: 1234567890
   Р/с: 40702810100000000001
   
   Или оплатите онлайн:
   [Оплатить картой] (v2)

2️⃣ ДОГОВОР
   Договор аренды: [Скачать PDF]

3️⃣ ВЪЕЗД
   15.12.2025 с 09:00 до 21:00
   Адрес: Dubai, Рязанский пр-т, 75к2
   Контакт: Мария Смирнова, +7 (495) 123-45-68

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Если у вас есть вопросы, свяжитесь с нами:
☎️ +7 (495) 123-45-67
✉️ vykhino@skladok.ru

С уважением,
СкладОК Выхино
```

---

#### 8.1.4. Отклонение с причиной

**Trigger:** Status changed to `rejected`

**Email template:**

```
Subject: Заявка #BK-20251211-0042 не одобрена

Здравствуйте, Иван!

К сожалению, мы не можем подтвердить вашу заявку.

Причина: Бокс уже забронирован на выбранные даты.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
АЛЬТЕРНАТИВНЫЕ ВАРИАНТЫ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Мы подобрали для вас похожие боксы:

1. Бокс M (5 м²), 2 этаж
   Цена: 4 500 ₽/мес
   Свободен: с 15.12.2025
   [Забронировать]

2. Бокс L (7 м²), 1 этаж
   Цена: 5 500 ₽/мес
   Свободен: с 15.12.2025
   [Забронировать]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Если у вас есть вопросы, свяжитесь с нами:
☎️ +7 (495) 123-45-67
✉️ vykhino@skladok.ru

Мы всегда рады помочь!

С уважением,
СкладОК Выхино
```

---

#### 8.1.5. Напоминание об оплате (v2)

**Trigger:** Status = `payment_pending`, не оплачено 12 часов

**Email:**

```
Subject: Напоминание об оплате бронирования

Здравствуйте, Иван!

Ваше бронирование #BK-20251211-0042 ожидает оплаты.

Сумма к оплате: 28 800 ₽
Оплатить до: 12.12.2025 18:00

[Оплатить онлайн]

Если вы уже оплатили, проигнорируйте это письмо.
```

---

#### 8.1.6. Подтверждение оплаты (v2)

**Trigger:** Payment received

**Email:**

```
Subject: Оплата получена ✅

Здравствуйте, Иван!

Мы получили вашу оплату 28 800 ₽.

Чек: [Скачать чек]
Бронирование активировано: 15.12.2025

Ждём вас в складе!
```

---

### 8.2. Уведомления оператору

#### 8.2.1. Новая заявка на складе

**Trigger:** Booking created and assigned

**Channels:** Email + Push

**Email:**

```
Subject: Новая заявка #BK-20251211-0042 | Lead Score: 85 🔥

Здравствуйте, Мария!

На ваш склад СкладОК Выхино поступила новая заявка.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ДЕТАЛИ ЗАЯВКИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Номер:            BK-20251211-0042
Lead Score:       85 🔥 (Высокий приоритет)
Клиент:           Ahmed Al-Rashid
Телефон:          +971 50 123 4567
Email:            ivan@example.com

Бокс:             M (5 м²)
Дата начала:      15.12.2025
Срок:             6 месяцев
Сумма:            28 800 ₽

Комментарий:
"Хочу хранить мебель на время ремонта. 
Есть ли возможность доставки?"

Предпочтительное время звонка: Утро (9-12)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Открыть заявку в системе]

Пожалуйста, свяжитесь с клиентом как можно скорее!
```

---

#### 8.2.2. High-priority lead

**Trigger:** Lead Score >= 80

**Channels:** Email + Push + SMS (if enabled)

**SMS:**

```
🔥 Новая высокоприоритетная заявка! 
BK-0042, Ahmed Al-Rashid, 28800₽, Score: 85. 
Откройте: https://op.st/bk/042
```

---

#### 8.2.3. Истекающий дедлайн ответа

(Covered in section 7.4.1)

---

#### 8.2.4. Отмена заявки клиентом

**Trigger:** User cancels booking

**Email:**

```
Subject: Заявка отменена клиентом

Мария, добрый день!

Клиент отменил заявку #BK-20251211-0042.

Клиент: Ahmed Al-Rashid
Причина: Нашёл другой вариант

Заявка закрыта автоматически.
```

---

### 8.3. Форматы сообщений

(Templates covered above)

---

### 8.4. Каналы доставки

#### 8.4.1. Email (SendGrid/Mailgun)

**Configuration:**

```python
EMAIL_SETTINGS = {
    'provider': 'sendgrid',
    'api_key': settings.SENDGRID_API_KEY,
    'from_email': 'noreply@storagecompare.ae',
    'from_name': 'Агрегатор складов',
    'reply_to': 'support@storagecompare.ae'
}
```

---

#### 8.4.2. SMS (Twilio)

**Configuration:**

```python
SMS_SETTINGS = {
    'provider': 'twilio',
    'login': settings.TWILIO_ACCOUNT_SID,
    'password': settings.TWILIO_AUTH_TOKEN,
    'sender': 'SKLADOK'
}
```

---

#### 8.4.3. Push notifications (Firebase)

**v2 feature**

---

#### 8.4.4. In-app notifications

**Real-time via WebSocket**

---

#### 8.4.5. Telegram Bot (optional)

**v2 feature**

---

### 8.5. Retry-политика

#### 8.5.1. Количество попыток

**Retry configuration:**

```python
NOTIFICATION_RETRY_CONFIG = {
    'email': {
        'max_attempts': 3,
        'backoff_multiplier': 2,
        'initial_delay': 60  # seconds
    },
    'sms': {
        'max_attempts': 2,
        'backoff_multiplier': 3,
        'initial_delay': 30
    }
}
```

---

#### 8.5.2. Интервалы между попытками

**Exponential backoff:**

- Attempt 1: Send immediately
- Attempt 2: Wait 1 minute
- Attempt 3: Wait 2 minutes
- Attempt 4: Wait 4 minutes

---

#### 8.5.3. Exponential backoff

```python
def calculate_retry_delay(attempt, base_delay, multiplier):
    return base_delay * (multiplier ** (attempt - 1))
```

---

#### 8.5.4. Dead letter queue

**Failed notifications go to DLQ for manual review:**

```python
if attempts >= max_attempts:
    send_to_dead_letter_queue(notification)
    alert_admin(f"Notification {notification.id} failed after {attempts} attempts")
```

---

**End of Sections 6.6-6.10, 7, and 8**

---
# Booking Flow — Deep Technical Specification (MVP → v2)

## PART 5: AI Integration & System Reliability

---

## 9. Интеграция AI

### 9.1. AI Box Recommendation

**Назначение:**  
Помогает пользователю выбрать оптимальный размер бокса на основе описания вещей.

#### 9.1.1. Входные данные (описание вещей)

**User input example:**

```
"Мебель из 2-комнатной квартиры: диван 3-местный, 
двуспальная кровать, шкаф-купе 2 метра, комод, 
стол обеденный со стульями, 20-30 коробок с вещами"
```

**Structured input:**

```json
{
  "items_description": "Мебель из 2-комнатной квартиры: диван, кровать, шкаф",
  "number_of_rooms": 2,
  "has_large_furniture": true,
  "number_of_boxes": 25,
  "special_items": ["холодильник", "стиральная машина"],
  "storage_duration_months": 6
}
```

---

#### 9.1.2. Алгоритм подбора размера

**Rule-based approach (MVP):**

```python
def recommend_box_size_rule_based(description: str) -> dict:
    # Parse description
    keywords = extract_keywords(description.lower())
    
    # Calculate estimated volume
    volume = 0
    
    # Furniture items
    furniture_mapping = {
        'диван': 4,  # 4 m³
        'кровать': 3,
        'шкаф': 5,
        'комод': 2,
        'стол': 2,
        'кресло': 1.5
    }
    
    for item, vol in furniture_mapping.items():
        if item in keywords:
            count = extract_count(description, item)
            volume += vol * count
    
    # Boxes
    box_count = extract_number(description, 'коробок')
    if box_count:
        volume += box_count * 0.1  # 0.1 m³ per box
    
    # Appliances
    appliances = ['холодильник', 'стиральная', 'микроволновка']
    for appliance in appliances:
        if appliance in keywords:
            volume += 1.5
    
    # Add 20% buffer
    volume *= 1.2
    
    # Map to box sizes
    if volume <= 5:
        recommended_size = 'S'
        area_sqm = 2
    elif volume <= 10:
        recommended_size = 'M'
        area_sqm = 5
    elif volume <= 20:
        recommended_size = 'L'
        area_sqm = 10
    else:
        recommended_size = 'XL'
        area_sqm = 15
    
    return {
        'recommended_size': recommended_size,
        'recommended_area_sqm': area_sqm,
        'estimated_volume_m3': volume,
        'confidence': 0.75,
        'reasoning': f'Для {int(volume)}м³ вещей рекомендуем бокс {recommended_size}'
    }
```

**ML-based approach (v2):**

```python
import openai

async def recommend_box_size_ml(description: str, warehouse_id: int) -> dict:
    # Get available boxes at warehouse
    available_boxes = get_warehouse_boxes(warehouse_id)
    
    # Prepare prompt
    prompt = f"""
    Пользователь хочет хранить следующие вещи:
    {description}
    
    Доступные боксы:
    {json.dumps([{'id': b.id, 'size': b.size, 'area_sqm': b.area_sqm} for b in available_boxes])}
    
    Проанализируй описание и порекомендуй оптимальный размер бокса.
    Верни ответ в JSON формате:
    {{
        "recommended_box_ids": [список ID подходящих боксов],
        "estimated_volume_m3": число,
        "confidence": число от 0 до 1,
        "reasoning": "краткое объяснение"
    }}
    """
    
    response = await openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Ты эксперт по подбору размера складского бокса."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    result = json.loads(response.choices[0].message.content)
    
    # Log AI request
    log_ai_request(
        type='box_recommendation',
        input=description,
        output=result,
        model='gpt-4'
    )
    
    return result
```

---

#### 9.1.3. API контракт

**Endpoint:**
```
POST /api/v1/ai/recommend-box
Authorization: Bearer <token> (optional)
```

**Request:**

```json
{
  "items_description": "Мебель из 2-комнатной квартиры: диван, кровать, шкаф, 25 коробок",
  "warehouse_id": 101
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "recommendation": {
      "recommended_boxes": [
        {
          "box_id": 502,
          "size": "M",
          "area_sqm": 5,
          "price_per_month": 4500,
          "confidence": 0.85
        },
        {
          "box_id": 503,
          "size": "L",
          "area_sqm": 7,
          "price_per_month": 5500,
          "confidence": 0.70
        }
      ],
      "estimated_volume_m3": 8.5,
      "reasoning": "Для ваших вещей (диван, кровать, шкаф, 25 коробок) оптимальный размер бокса M (5м²). Если планируете хранить больше вещей, рассмотрите бокс L.",
      "tips": [
        "Разобранная мебель займёт меньше места",
        "Используйте вертикальное пространство - складывайте коробки",
        "Холодильник и стиральную машину лучше хранить вертикально"
      ]
    }
  },
  "meta": {
    "timestamp": "2025-12-11T18:00:00Z",
    "ai_model": "gpt-4",
    "processing_time_ms": 1250
  }
}
```

---

#### 9.1.4. Примеры запросов/ответов

**Example 1: Small apartment**

```json
// Request
{
  "items_description": "Вещи из студии: одежда в 10 коробках, зимняя резина",
  "warehouse_id": 101
}

// Response
{
  "recommended_boxes": [
    {
      "box_id": 501,
      "size": "S",
      "area_sqm": 2,
      "confidence": 0.90
    }
  ],
  "estimated_volume_m3": 1.5,
  "reasoning": "Для 10 коробок и комплекта шин подойдёт бокс S (2м²)"
}
```

**Example 2: Large household**

```json
// Request
{
  "items_description": "Полный дом: 3 спальни, гостиная, кухня, гараж. Около 100 коробок.",
  "warehouse_id": 101
}

// Response
{
  "recommended_boxes": [
    {
      "box_id": 505,
      "size": "XL",
      "area_sqm": 15,
      "confidence": 0.95
    }
  ],
  "estimated_volume_m3": 35,
  "reasoning": "Для содержимого 3-комнатного дома потребуется бокс XL (15м²) или два бокса L"
}
```

---

#### 9.1.5. Fallback при недоступности AI

**Graceful degradation:**

```python
async def get_box_recommendation(description: str, warehouse_id: int):
    try:
        # Try ML-based recommendation
        result = await recommend_box_size_ml(description, warehouse_id)
        return result
    except OpenAIError as e:
        logger.warning(f"AI service unavailable: {e}")
        # Fallback to rule-based
        result = recommend_box_size_rule_based(description)
        result['fallback_mode'] = True
        return result
    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        # Return default suggestion
        return {
            'recommended_boxes': get_most_popular_boxes(warehouse_id),
            'estimated_volume_m3': None,
            'confidence': 0.5,
            'reasoning': 'Не удалось проанализировать описание. Показываем популярные варианты.',
            'fallback_mode': True
        }
```

---

### 9.2. AI Lead Scoring для приоритизации заявок

**Назначение:**  
Оценивает вероятность конверсии заявки в подтверждённое бронирование.

#### 9.2.1. Факторы для расчета score

**Feature engineering:**

| Feature | Type | Weight | Description |
|---------|------|--------|-------------|
| `total_price` | numeric | 0.25 | Сумма аренды |
| `duration_months` | numeric | 0.20 | Длительность |
| `data_completeness` | numeric | 0.15 | Полнота заполнения |
| `time_of_day` | categorical | 0.10 | Время создания |
| `is_returning_customer` | boolean | 0.15 | Повторный клиент |
| `warehouse_rating` | numeric | 0.05 | Рейтинг склада |
| `box_popularity` | numeric | 0.05 | Популярность размера |
| `source` | categorical | 0.05 | Источник трафика |

**Additional signals:**
- Скорость заполнения формы
- Количество правок в форме
- Устройство (mobile/desktop)
- Геолокация близость к складу
- День недели / время суток
- История предыдущих заявок (если есть)

---

#### 9.2.2. ML-модель scoring

**Training data:**

```python
# Historical bookings with outcomes
training_data = pd.DataFrame({
    'booking_id': [...],
    'total_price': [...],
    'duration_months': [...],
    'data_completeness': [...],
    'time_of_day': [...],
    'is_returning': [...],
    'converted': [1, 0, 1, 1, 0, ...]  # Target variable
})
```

**Model training:**

```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# Prepare features
X = training_data.drop(['booking_id', 'converted'], axis=1)
y = training_data['converted']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred_proba = model.predict_proba(X_test)[:, 1]
auc_score = roc_auc_score(y_test, y_pred_proba)
print(f"AUC Score: {auc_score:.3f}")

# Save model
import joblib
joblib.dump(model, 'lead_scoring_model.pkl')
```

**Prediction:**

```python
def predict_lead_score(booking: Booking) -> int:
    # Load model
    model = joblib.load('lead_scoring_model.pkl')
    
    # Extract features
    features = extract_features(booking)
    
    # Predict probability
    proba = model.predict_proba([features])[0][1]
    
    # Convert to 0-100 scale
    score = int(proba * 100)
    
    return score

def extract_features(booking: Booking) -> list:
    return [
        booking.total_price,
        booking.duration_months,
        calculate_data_completeness(booking),
        encode_time_of_day(booking.created_at.hour),
        1 if booking.user_id and has_previous_bookings(booking.user_id) else 0,
        booking.warehouse.rating,
        get_box_popularity(booking.box_id),
        encode_source(booking.source)
    ]
```

---

#### 9.2.3. API контракт

**Endpoint (internal):**
```
POST /api/v1/ai/score-lead
Authorization: Bearer <token> (service account)
```

**Request:**

```json
{
  "booking_id": 1001,
  "features": {
    "total_price": 28800,
    "duration_months": 6,
    "data_completeness": 0.85,
    "time_of_day": "afternoon",
    "is_returning_customer": false,
    "warehouse_rating": 4.8,
    "box_popularity": 0.75,
    "source": "web"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "lead_score": 85,
    "probability": 0.85,
    "priority": "high",
    "confidence": 0.92,
    "factors": [
      {
        "factor": "total_price",
        "contribution": 0.25,
        "value": 28800
      },
      {
        "factor": "duration_months",
        "contribution": 0.20,
        "value": 6
      }
    ],
    "recommendations": [
      "Высокая вероятность конверсии - приоритетная обработка",
      "Клиент заполнил все данные полностью"
    ]
  }
}
```

---

#### 9.2.4. Интерпретация результатов

**Score interpretation:**

| Score Range | Priority | Action |
|-------------|----------|--------|
| 80-100 | 🔥 High | Contact within 1 hour |
| 60-79 | ⚡ Medium | Contact within 4 hours |
| 40-59 | 📌 Normal | Contact within 24 hours |
| 0-39 | 📎 Low | Contact within 48 hours |

**Priority queue logic:**

```python
def prioritize_bookings(bookings: list) -> list:
    # Calculate lead score for each
    for booking in bookings:
        if not booking.lead_score:
            booking.lead_score = predict_lead_score(booking)
            booking.save()
    
    # Sort by score (descending) and creation time (ascending)
    sorted_bookings = sorted(
        bookings,
        key=lambda b: (-b.lead_score, b.created_at)
    )
    
    return sorted_bookings
```

---

#### 9.2.5. Обновление score в реальном времени

**Triggers for re-scoring:**

- Status change
- User adds more information
- Time passes (score decay)
- Operator interaction

**Implementation:**

```python
@celery.task
def update_lead_score(booking_id: int):
    booking = Booking.query.get(booking_id)
    
    # Recalculate score
    new_score = predict_lead_score(booking)
    
    # Update if changed significantly (±5 points)
    if abs(new_score - booking.lead_score) >= 5:
        old_score = booking.lead_score
        booking.lead_score = new_score
        booking.save()
        
        # Log change
        logger.info(
            f"Lead score updated: booking={booking_id}, "
            f"old={old_score}, new={new_score}"
        )
        
        # If priority changed, notify operator
        old_priority = get_priority(old_score)
        new_priority = get_priority(new_score)
        
        if old_priority != new_priority:
            send_notification(
                user_id=booking.assigned_operator_id,
                type='priority_changed',
                booking_id=booking_id,
                old_priority=old_priority,
                new_priority=new_priority
            )
```

---

### 9.3. AI Price Suggestion (в карточке бокса)

**Назначение:**  
Рекомендует оптимальную цену для оператора на основе рыночного анализа.

#### 9.3.1. Анализ рыночных цен

**Data collection:**

```python
def collect_market_data(box: Box) -> dict:
    # Get similar boxes in area
    similar_boxes = Box.query.filter(
        Box.warehouse.has(
            and_(
                Warehouse.city == box.warehouse.city,
                Warehouse.district == box.warehouse.district
            )
        ),
        Box.area_sqm.between(box.area_sqm * 0.8, box.area_sqm * 1.2),
        Box.status == 'available'
    ).all()
    
    prices = [b.price_per_month for b in similar_boxes]
    
    return {
        'median_price': statistics.median(prices),
        'mean_price': statistics.mean(prices),
        'min_price': min(prices),
        'max_price': max(prices),
        'std_dev': statistics.stdev(prices),
        'sample_size': len(prices)
    }
```

---

#### 9.3.2. Динамическое ценообразование

**Pricing factors:**

| Factor | Influence |
|--------|-----------|
| Demand (occupancy rate) | +10% if >80% occupied |
| Seasonality | +15% in peak season (Sep-Nov) |
| Competition | -5% if many alternatives nearby |
| Box features | +10% for climate control, 1st floor |
| Duration discount | -5% per 3 months up to -15% |

**Implementation:**

```python
def calculate_dynamic_price(box: Box, duration_months: int) -> dict:
    # Base price
    base_price = box.price_per_month
    
    # Market analysis
    market = collect_market_data(box)
    
    # Adjust for market position
    if base_price < market['median_price'] * 0.9:
        # Priced low - can increase
        suggested_increase = (market['median_price'] - base_price) * 0.5
    elif base_price > market['median_price'] * 1.1:
        # Priced high - consider decrease
        suggested_increase = (market['median_price'] - base_price) * 0.3
    else:
        # Fair price
        suggested_increase = 0
    
    # Occupancy adjustment
    occupancy = calculate_warehouse_occupancy(box.warehouse_id)
    if occupancy > 0.8:
        suggested_increase += base_price * 0.1  # High demand
    elif occupancy < 0.5:
        suggested_increase -= base_price * 0.05  # Low demand
    
    # Seasonal adjustment
    if is_peak_season():
        suggested_increase += base_price * 0.1
    
    # Duration discount
    duration_discount = get_duration_discount(duration_months)
    
    suggested_price = base_price + suggested_increase
    final_price = suggested_price * (1 - duration_discount / 100)
    
    return {
        'current_price': base_price,
        'suggested_base_price': round(suggested_price, -2),  # Round to 100
        'final_price_after_discount': round(final_price, -2),
        'duration_discount_percent': duration_discount,
        'market_median': market['median_price'],
        'price_vs_market': ((suggested_price / market['median_price']) - 1) * 100,
        'confidence': calculate_confidence(market['sample_size']),
        'reasoning': generate_price_reasoning(
            current=base_price,
            suggested=suggested_price,
            market=market,
            occupancy=occupancy
        )
    }
```

---

#### 9.3.3. API контракт

**Endpoint:**
```
GET /api/v1/ai/suggest-price?box_id=501&duration_months=6
Authorization: Bearer <token> (operator role)
```

**Response:**

```json
{
  "success": true,
  "data": {
    "pricing": {
      "current_price": 4500,
      "suggested_base_price": 4800,
      "final_price_after_discount": 4320,
      "duration_discount_percent": 10,
      "market_analysis": {
        "median_price": 4700,
        "min_price": 3800,
        "max_price": 5500,
        "your_position": "slightly_below_market"
      },
      "price_vs_market": 2.1,
      "confidence": 0.85,
      "reasoning": "Ваша цена на 4% ниже рыночной. Рекомендуем повысить до 4800₽/мес. При высокой загруженности склада (85%) можно установить премиум-цену.",
      "recommendations": [
        "Увеличьте базовую цену до 4800₽",
        "Сохраните скидку 10% за 6+ месяцев",
        "Мониторьте конкурентов в радиусе 2км"
      ]
    }
  }
}
```

---

#### 9.3.4. Влияние на конверсию

**A/B testing results (simulated):**

| Pricing Strategy | Conversion Rate | Revenue per Box |
|------------------|-----------------|-----------------|
| Static pricing | 45% | 202,500₽/year |
| Manual adjustment | 52% | 234,000₽/year |
| AI dynamic pricing | 58% | 261,000₽/year |

**Impact tracking:**

```python
def track_pricing_impact(box_id: int, price_change: dict):
    log_pricing_event(
        box_id=box_id,
        old_price=price_change['old_price'],
        new_price=price_change['new_price'],
        reason='ai_suggestion',
        timestamp=datetime.utcnow()
    )
    
    # Track subsequent bookings
    # Measure: conversion rate, time to booking, revenue
```

---

### 9.4. AI Fraud Detection (v2)

**Назначение:**  
Выявление подозрительных заявок и мошеннического поведения.

#### 9.4.1. Паттерны мошеннического поведения

**Red flags:**

| Pattern | Risk Score | Description |
|---------|-----------|-------------|
| Multiple bookings same phone | +30 | Один номер, много заявок |
| Disposable email | +20 | Временный email (mailinator, etc) |
| VPN/Proxy IP | +15 | Скрытый IP-адрес |
| Form filled too fast | +10 | < 30 секунд на форму |
| Inconsistent data | +25 | Имя не совпадает с email |
| High-value first booking | +10 | Первая заявка >50k₽ |
| Suspicious keywords | +20 | Слова-маркеры в комментарии |
| Phone not registered | +15 | Номер не в базах операторов |

---

#### 9.4.2. Риск-скоринг

**Fraud score calculation:**

```python
def calculate_fraud_score(booking: Booking) -> int:
    score = 0
    
    # Check phone number
    phone_bookings = count_bookings_by_phone(booking.user_phone, days=30)
    if phone_bookings > 3:
        score += 30
    
    # Check email
    if is_disposable_email(booking.user_email):
        score += 20
    
    # Check IP address
    if is_vpn_or_proxy(booking.ip_address):
        score += 15
    
    # Check form fill time
    if booking.metadata.get('form_fill_time_seconds', 999) < 30:
        score += 10
    
    # Check data consistency
    if not validate_name_email_consistency(booking.user_name, booking.user_email):
        score += 25
    
    # Check value
    if booking.total_price > 50000 and not has_previous_bookings(booking.user_id):
        score += 10
    
    # Check for suspicious keywords
    if contains_suspicious_keywords(booking.user_comment):
        score += 20
    
    # Check phone validity
    if not is_valid_registered_phone(booking.user_phone):
        score += 15
    
    return min(100, score)

def get_fraud_risk_level(score: int) -> str:
    if score >= 70:
        return 'critical'  # Block immediately
    elif score >= 50:
        return 'high'      # Manual review required
    elif score >= 30:
        return 'medium'    # Flag for attention
    else:
        return 'low'       # Normal processing
```

---

#### 9.4.3. Автоматическая блокировка подозрительных заявок

**Action based on fraud score:**

```python
def process_fraud_check(booking: Booking):
    fraud_score = calculate_fraud_score(booking)
    risk_level = get_fraud_risk_level(fraud_score)
    
    # Store fraud score
    booking.fraud_score = fraud_score
    booking.fraud_risk_level = risk_level
    
    # Take action based on risk
    if risk_level == 'critical':
        # Auto-reject
        booking.status = 'rejected'
        booking.rejection_reason = 'fraud_detected'
        booking.rejection_reason_text = 'Заявка заблокирована системой безопасности'
        
        # Alert security team
        alert_security_team(booking, fraud_score)
        
        # No notification to user
        
    elif risk_level == 'high':
        # Require manual review
        booking.requires_manual_review = True
        booking.manual_review_reason = 'high_fraud_risk'
        
        # Notify senior operator
        send_notification(
            user_id=get_senior_operator(booking.warehouse_id),
            type='fraud_alert_high',
            booking_id=booking.id,
            fraud_score=fraud_score
        )
        
    elif risk_level == 'medium':
        # Flag but process normally
        booking.flagged_for_review = True
        add_booking_comment(
            booking_id=booking.id,
            user_id=None,  # System
            comment=f'⚠️ Fraud score: {fraud_score}/100. Требует внимания.',
            comment_type='system'
        )
    
    booking.save()
    
    # Log fraud check
    log_fraud_check(
        booking_id=booking.id,
        fraud_score=fraud_score,
        risk_level=risk_level,
        checks_performed=get_fraud_checks_performed(booking)
    )
```

---

#### 9.4.4. Ручная проверка high-risk заявок

**Manual review interface:**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ ТРЕБУЕТСЯ ПРОВЕРКА БЕЗОПАСНОСТИ                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Заявка: BK-20251211-0055                                    │
│ Fraud Score: 65/100 (HIGH RISK) 🔴                          │
│                                                              │
│ ОБНАРУЖЕННЫЕ ПРОБЛЕМЫ:                                      │
│ • ❌ Одноразовый email: temp@mailinator.com                │
│ • ❌ 4 заявки с этого номера за последние 7 дней           │
│ • ⚠️ VPN/Proxy IP-адрес                                     │
│ • ⚠️ Форма заполнена за 25 секунд                          │
│                                                              │
│ ДЕТАЛИ ЗАЯВКИ:                                              │
│ Клиент: Иван Иванов                                         │
│ Телефон: +7 (999) 000-00-00                                 │
│ Email: temp@mailinator.com                                  │
│ Сумма: 28 800 ₽                                             │
│                                                              │
│ ИСТОРИЯ ТЕЛЕФОНА:                                           │
│ • BK-20251210-0012 - rejected (box_unavailable)            │
│ • BK-20251209-0045 - cancelled by user                     │
│ • BK-20251208-0033 - rejected (suspicious_activity)        │
│                                                              │
│ РЕКОМЕНДАЦИЯ СИСТЕМЫ:                                       │
│ ⚠️ Отклонить заявку. Высокий риск мошенничества.           │
│                                                              │
│ ДЕЙСТВИЯ:                                                   │
│ [✅ Одобрить]  [❌ Отклонить]  [📞 Связаться с клиентом]   │
│ [🔍 Дополнительная проверка]                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Operator decision tracking:**

```python
def record_manual_review_decision(
    booking_id: int,
    operator_id: int,
    decision: str,  # 'approve', 'reject', 'request_more_info'
    notes: str
):
    ManualReview.create(
        booking_id=booking_id,
        operator_id=operator_id,
        fraud_score=Booking.query.get(booking_id).fraud_score,
        decision=decision,
        notes=notes,
        timestamp=datetime.utcnow()
    )
    
    # Train ML model on manual decisions
    if decision in ['approve', 'reject']:
        queue_task('retrain_fraud_model', {
            'booking_id': booking_id,
            'actual_label': 1 if decision == 'reject' else 0
        })
```

---

## 10. Ошибки, нештатные ситуации и обработка edge cases

### 10.1. Бокс внезапно недоступен

**Сценарий:**  
Оператор подтверждает заявку, но бокс уже занят другой только что подтверждённой заявкой.

#### 10.1.1. Обнаружение конфликта

**Race condition detection:**

```python
def confirm_booking_with_conflict_check(booking_id: int, operator_id: int):
    # Use database transaction with row locking
    with db.session.begin():
        # Lock booking row
        booking = db.session.query(Booking).with_for_update().get(booking_id)
        
        # Lock box row
        box = db.session.query(Box).with_for_update().get(booking.box_id)
        
        # Check for conflicting bookings created AFTER this one
        conflicting = Booking.query.filter(
            Booking.box_id == booking.box_id,
            Booking.id != booking.id,
            Booking.status == 'approved',
            Booking.approved_at > booking.created_at,
            or_(
                and_(
                    Booking.start_date <= booking.end_date,
                    Booking.end_date >= booking.start_date
                )
            )
        ).first()
        
        if conflicting:
            # Conflict detected!
            raise BoxConflictError(
                f"Box {box.id} already booked by {conflicting.id}",
                conflicting_booking=conflicting
            )
        
        # No conflict - proceed
        booking.status = 'approved'
        booking.approved_at = datetime.utcnow()
        booking.approved_by = operator_id
        
        # Mark box as occupied (v2)
        box.status = 'occupied'
        
        db.session.commit()
        
        return booking
```

---

#### 10.1.2. Уведомление пользователя

**Conflict notification:**

```
Subject: Изменение статуса заявки #BK-20251211-0042

Здравствуйте, Иван!

К сожалению, выбранный вами бокс был забронирован другим клиентом 
непосредственно перед подтверждением вашей заявки.

Мы искренне извиняемся за неудобства.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ ДЛЯ ВАС
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Мы предлагаем вам следующие альтернативы со СКИДКОЙ 15%:

1. Бокс M (5 м²), 2 этаж
   Обычная цена: 4500 ₽/мес
   Ваша цена: 3825 ₽/мес (-15%)
   [Забронировать со скидкой]

2. Бокс L (7 м²), 1 этаж  
   Обычная цена: 5500 ₽/мес
   Ваша цена: 4675 ₽/мес (-15%)
   [Забронировать со скидкой]

Скидка действует 48 часов!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

С уважением,
СкладОК Выхино
```

---

#### 10.1.3. Предложение альтернативных боксов

**Alternative finding logic:**

```python
def find_alternative_boxes(
    original_booking: Booking,
    include_discount: bool = True
) -> list:
    # Similar boxes criteria
    similar_boxes = Box.query.filter(
        Box.warehouse_id == original_booking.warehouse_id,
        Box.area_sqm.between(
            original_booking.box.area_sqm * 0.8,
            original_booking.box.area_sqm * 1.3
        ),
        Box.status == 'available'
    ).all()
    
    # Check availability for requested dates
    available = []
    for box in similar_boxes:
        if check_box_availability(
            box.id,
            original_booking.start_date,
            original_booking.end_date
        )['available']:
            # Calculate price with compensation discount
            price = box.price_per_month
            if include_discount:
                price *= 0.85  # 15% discount
            
            available.append({
                'box_id': box.id,
                'size': box.size,
                'area_sqm': box.area_sqm,
                'floor': box.floor,
                'original_price': box.price_per_month,
                'discounted_price': price,
                'discount_percent': 15 if include_discount else 0
            })
    
    # Sort by similarity to original
    available.sort(
        key=lambda x: abs(x['area_sqm'] - original_booking.box.area_sqm)
    )
    
    return available[:3]  # Top 3 alternatives
```

---

#### 10.1.4. Компенсация (скидка/бонус)

**Compensation policy:**

| Scenario | Compensation |
|----------|--------------|
| Conflict at confirmation | 15% discount on alternative |
| Conflict after payment (v2) | 20% discount + priority support |
| No alternatives available | Full refund + 500₽ bonus for next booking |

**Implementation:**

```python
def apply_conflict_compensation(booking: Booking):
    # Create compensation coupon
    coupon = Coupon.create(
        code=generate_coupon_code(),
        discount_percent=15,
        valid_until=datetime.utcnow() + timedelta(days=7),
        user_id=booking.user_id,
        reason='box_conflict_compensation',
        max_uses=1
    )
    
    # Add to user's account
    UserCoupon.create(
        user_id=booking.user_id,
        coupon_id=coupon.id
    )
    
    # Send notification with coupon
    send_notification(
        user_id=booking.user_id,
        type='conflict_compensation',
        data={
            'coupon_code': coupon.code,
            'discount_percent': 15,
            'valid_until': coupon.valid_until
        }
    )
```

---

### 10.2. Ошибки сервера

#### 10.2.1. Database connection lost

**Detection & recovery:**

```python
from sqlalchemy.exc import OperationalError
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def execute_with_retry(query_func):
    try:
        return query_func()
    except OperationalError as e:
        logger.error(f"Database connection error: {e}")
        # Recreate connection pool
        db.session.remove()
        db.engine.dispose()
        raise  # Retry via decorator

# Usage
result = execute_with_retry(lambda: Booking.query.get(booking_id))
```

---

#### 10.2.2. Service timeout

**Timeout handling:**

```python
import asyncio
from timeout_decorator import timeout

@timeout(5, timeout_exception=TimeoutError)
async def call_external_service(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            return await response.json()

# Usage
try:
    result = await call_external_service(
        'https://api.external.com/endpoint',
        payload
    )
except TimeoutError:
    logger.warning("External service timeout")
    # Use fallback
    result = use_fallback_logic()
```

---

#### 10.2.3. Third-party service unavailable

**Circuit breaker pattern:**

```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def send_sms(phone: str, message: str):
    response = sms_provider.send(phone, message)
    if not response.success:
        raise SMSProviderError()
    return response

# Usage
try:
    send_sms("+971501234567", "Your code: 1234")
except CircuitBreakerError:
    logger.error("SMS provider circuit open - too many failures")
    # Queue for retry later
    queue_sms_for_later(phone, message)
```

---

#### 10.2.4. Graceful degradation

**Feature degradation strategy:**

```python
class FeatureFlags:
    AI_RECOMMENDATIONS = True
    LEAD_SCORING = True
    FRAUD_DETECTION = True
    REAL_TIME_NOTIFICATIONS = True

def create_booking(data):
    # Core functionality - always works
    booking = Booking.create(**data)
    
    # Optional: AI recommendations
    if FeatureFlags.AI_RECOMMENDATIONS:
        try:
            score = calculate_lead_score(booking)
            booking.lead_score = score
        except Exception as e:
            logger.warning(f"Lead scoring failed: {e}")
            booking.lead_score = 50  # Default
    
    # Optional: Real-time notifications
    if FeatureFlags.REAL_TIME_NOTIFICATIONS:
        try:
            send_notification_sync(booking)
        except Exception as e:
            logger.warning(f"Notification failed: {e}")
            queue_notification_for_retry(booking)
    
    return booking
```

---

### 10.3. Проблемы с SMS/email

#### 10.3.1. Недоставленное уведомление

**Delivery tracking:**

```python
class NotificationStatus:
    PENDING = 'pending'
    SENT = 'sent'
    DELIVERED = 'delivered'
    FAILED = 'failed'
    BOUNCED = 'bounced'

def track_notification_delivery(notification_id: str, status: str, provider_response: dict):
    notification = Notification.query.get(notification_id)
    notification.status = status
    notification.provider_response = provider_response
    notification.last_attempt_at = datetime.utcnow()
    
    if status == NotificationStatus.FAILED:
        notification.failure_count += 1
        
        if notification.failure_count < 3:
            # Retry
            queue_notification_retry(notification)
        else:
            # Give up, log for manual intervention
            log_notification_failure(notification)
            alert_support_team(notification)
    
    notification.save()
```

---

#### 10.3.2. Retry mechanism

**Exponential backoff retry:**

```python
@celery.task(bind=True, max_retries=3)
def send_notification_task(self, notification_id):
    notification = Notification.query.get(notification_id)
    
    try:
        if notification.channel == 'email':
            result = email_provider.send(
                to=notification.recipient_email,
                subject=notification.subject,
                body=notification.body
            )
        elif notification.channel == 'sms':
            result = sms_provider.send(
                phone=notification.recipient_phone,
                message=notification.message
            )
        
        # Mark as sent
        notification.status = NotificationStatus.SENT
        notification.save()
        
    except (SMTPException, SMSProviderError) as e:
        # Retry with exponential backoff
        retry_delay = 60 * (2 ** self.request.retries)  # 1min, 2min, 4min
        
        logger.warning(
            f"Notification {notification_id} failed, "
            f"retrying in {retry_delay}s"
        )
        
        raise self.retry(exc=e, countdown=retry_delay)
```

---

#### 10.3.3. Alternative delivery channels

**Fallback chain:**

```python
async def send_notification_with_fallback(user_id: int, message: str):
    user = User.query.get(user_id)
    
    # Try primary channel (email)
    if user.email:
        try:
            await send_email(user.email, message)
            return {'channel': 'email', 'success': True}
        except EmailError:
            logger.warning(f"Email failed for user {user_id}")
    
    # Fallback to SMS
    if user.phone:
        try:
            await send_sms(user.phone, message)
            return {'channel': 'sms', 'success': True}
        except SMSError:
            logger.warning(f"SMS failed for user {user_id}")
    
    # Fallback to in-app notification
    try:
        create_in_app_notification(user_id, message)
        return {'channel': 'in_app', 'success': True}
    except Exception as e:
        logger.error(f"All notification channels failed for user {user_id}: {e}")
        return {'channel': None, 'success': False}
```

---

#### 10.3.4. Manual notification

**Manual intervention UI:**

```
┌──────────────────────────────────────────────────────────┐
│ 📧 НЕУДАВШИЕСЯ УВЕДОМЛЕНИЯ                               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Заявка: BK-20251211-0042                                 │
│ Клиент: Ahmed Al-Rashid (+7 999 123-45-67)                  │
│                                                           │
│ Уведомление: Подтверждение бронирования                  │
│ Статус: ❌ Не доставлено (3 попытки)                     │
│ Последняя попытка: 11.12.2025 18:45                      │
│ Ошибка: Email bounced (invalid_recipient)                │
│                                                           │
│ ДЕЙСТВИЯ:                                                 │
│ [ ] Обновить email: [__________________]  [Отправить]   │
│ [ ] Позвонить клиенту и сообщить устно                   │
│ [ ] Отправить SMS: [Отправить]                           │
│ [ ] Отметить как решённое                                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

### 10.4. Спам-заявки

#### 10.4.1. Обнаружение спама

**Spam detection signals:**

```python
def is_spam_booking(booking: Booking) -> bool:
    spam_score = 0
    
    # Check for spam keywords
    spam_keywords = [
        'test', 'spam', 'asdf', 'qwerty',
        'aaaa', 'zzzzz', 'проверка'
    ]
    if any(kw in booking.user_comment.lower() for kw in spam_keywords):
        spam_score += 30
    
    # Check for gibberish name
    if is_gibberish(booking.user_name):
        spam_score += 25
    
    # Check for repeated characters
    if has_repeated_chars(booking.user_name, threshold=3):
        spam_score += 20
    
    # Check for bot-like behavior
    if booking.metadata.get('form_fill_time_seconds', 999) < 10:
        spam_score += 30
    
    # Check for suspicious email patterns
    if is_spam_email(booking.user_email):
        spam_score += 20
    
    # Check for temporary phone numbers
    if is_voip_number(booking.user_phone):
        spam_score += 15
    
    return spam_score >= 50

def is_gibberish(text: str) -> bool:
    # Check vowel/consonant ratio
    vowels = sum(1 for c in text.lower() if c in 'aeiouаеёиоуыэюя')
    if len(text) > 0:
        vowel_ratio = vowels / len(text)
        return vowel_ratio < 0.2 or vowel_ratio > 0.8
    return False
```

---

#### 10.4.2. Rate limiting

(Already covered in section 4.2)

---

#### 10.4.3. CAPTCHA integration

**CAPTCHA requirement logic:**

```python
def requires_captcha(request) -> bool:
    ip = request.remote_addr
    
    # Check IP rate limit
    recent_requests = redis.get(f"requests:ip:{ip}")
    if recent_requests and int(recent_requests) > 5:
        return True
    
    # Check if IP is flagged
    if redis.exists(f"flagged:ip:{ip}"):
        return True
    
    # Check user agent
    if is_bot_user_agent(request.headers.get('User-Agent')):
        return True
    
    return False

# In API endpoint
@app.route('/api/v1/bookings', methods=['POST'])
def create_booking():
    if requires_captcha(request):
        captcha_token = request.json.get('captcha_token')
        if not verify_captcha(captcha_token):
            return error_response('CAPTCHA required', 400)
    
    # ... rest of booking creation
```

**CAPTCHA providers:**
- Google reCAPTCHA v3 (invisible)
- hCaptcha
- Custom image CAPTCHA (fallback)

---

#### 10.4.4. Phone verification

**SMS verification flow:**

```python
def require_phone_verification(booking: Booking) -> bool:
    # Require for high-risk bookings
    if booking.fraud_score > 50:
        return True
    
    # Require for high-value bookings
    if booking.total_price > 50000:
        return True
    
    # Require for new users
    if not booking.user_id:
        return True
    
    return False

@app.route('/api/v1/bookings', methods=['POST'])
def create_booking():
    # ... booking creation
    
    if require_phone_verification(booking):
        # Generate verification code
        code = generate_verification_code()
        
        # Store code
        redis.setex(
            f"verify:phone:{booking.user_phone}",
            300,  # 5 minutes
            code
        )
        
        # Send SMS
        send_sms(
            booking.user_phone,
            f"Ваш код подтверждения: {code}"
        )
        
        # Return pending status
        booking.status = 'pending_verification'
        booking.save()
        
        return {
            'success': True,
            'data': {
                'booking': booking.to_dict(),
                'requires_verification': True,
                'verification_sent_to': mask_phone(booking.user_phone)
            }
        }, 201

@app.route('/api/v1/bookings/{id}/verify', methods=['POST'])
def verify_booking(id):
    booking = Booking.query.get_or_404(id)
    code = request.json['code']
    
    # Check code
    stored_code = redis.get(f"verify:phone:{booking.user_phone}")
    if stored_code and stored_code == code:
        # Verified!
        booking.status = 'new'
        booking.phone_verified = True
        booking.save()
        
        # Delete code
        redis.delete(f"verify:phone:{booking.user_phone}")
        
        return {'success': True}
    else:
        return error_response('Invalid verification code', 400)
```

---

### 10.5. Обход rate-limits

#### 10.5.1. Обнаружение abuse

**Abuse detection patterns:**

```python
def detect_rate_limit_abuse(identifier: str, identifier_type: str) -> dict:
    # Get attempt history
    key = f"abuse_detection:{identifier_type}:{identifier}"
    attempts = redis.lrange(key, 0, -1)
    
    if len(attempts) < 10:
        return {'is_abuse': False}
    
    # Parse timestamps
    timestamps = [float(ts) for ts in attempts]
    
    # Check for patterns
    # 1. Burst detection (many requests in short time)
    recent = [ts for ts in timestamps if ts > time.time() - 60]
    if len(recent) > 10:
        return {
            'is_abuse': True,
            'pattern': 'burst',
            'severity': 'high'
        }
    
    # 2. Distributed attack (slightly under limit but persistent)
    hourly = [ts for ts in timestamps if ts > time.time() - 3600]
    if len(hourly) > 50:
        return {
            'is_abuse': True,
            'pattern': 'distributed',
            'severity': 'medium'
        }
    
    # 3. Rotating identifiers (same user, different IPs/phones)
    # This requires more sophisticated fingerprinting
    
    return {'is_abuse': False}
```

---

#### 10.5.2. Временная блокировка

**Progressive blocking:**

```python
def apply_progressive_block(identifier: str, abuse_level: int):
    # Block duration increases with abuse level
    block_durations = {
        1: 3600,      # 1 hour
        2: 86400,     # 24 hours
        3: 604800,    # 7 days
        4: 2592000,   # 30 days
        5: None       # Permanent
    }
    
    duration = block_durations.get(abuse_level, 3600)
    
    if duration:
        redis.setex(
            f"blocked:{identifier}",
            duration,
            json.dumps({
                'blocked_at': time.time(),
                'abuse_level': abuse_level,
                'reason': 'rate_limit_abuse'
            })
        )
    else:
        # Permanent block - store in database
        BlockedIdentifier.create(
            identifier=identifier,
            blocked_at=datetime.utcnow(),
            reason='persistent_abuse',
            is_permanent=True
        )
```

---

#### 10.5.3. IP blacklisting

**Blacklist management:**

```python
def add_to_blacklist(ip: str, reason: str, duration: int = None):
    Blacklist.create(
        ip_address=ip,
        reason=reason,
        blocked_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(seconds=duration) if duration else None
    )
    
    # Also add to Redis for fast lookup
    if duration:
        redis.setex(f"blacklist:ip:{ip}", duration, reason)
    else:
        redis.set(f"blacklist:ip:{ip}", reason)

def is_blacklisted(ip: str) -> bool:
    # Check Redis first (fast)
    if redis.exists(f"blacklist:ip:{ip}"):
        return True
    
    # Check database (permanent blocks)
    return Blacklist.query.filter(
        Blacklist.ip_address == ip,
        or_(
            Blacklist.expires_at == None,
            Blacklist.expires_at > datetime.utcnow()
        )
    ).count() > 0

# Middleware
@app.before_request
def check_blacklist():
    ip = request.remote_addr
    if is_blacklisted(ip):
        return error_response('Access denied', 403)
```

---

#### 10.5.4. Account suspension

**User account suspension:**

```python
def suspend_user_account(user_id: int, reason: str, duration: int = None):
    user = User.query.get(user_id)
    
    user.is_suspended = True
    user.suspended_at = datetime.utcnow()
    user.suspension_reason = reason
    
    if duration:
        user.suspension_expires_at = datetime.utcnow() + timedelta(seconds=duration)
    else:
        user.suspension_expires_at = None  # Permanent
    
    user.save()
    
    # Notify user
    send_notification(
        user_id=user_id,
        type='account_suspended',
        data={
            'reason': reason,
            'duration': duration,
            'appeal_email': 'appeals@storagecompare.ae'
        }
    )
    
    # Log suspension
    log_account_action(
        user_id=user_id,
        action='suspended',
        reason=reason,
        duration=duration
    )
```

---

## 11. Monitoring & Logging

### 11.1. Какие метрики мы собираем

#### 11.1.1. Conversion rate (заявка → бронирование)

**Metric definition:**

```
Conversion Rate = (Approved Bookings / Total Bookings) * 100
```

**Collection:**

```python
def calculate_conversion_rate(period: str = 'today') -> float:
    if period == 'today':
        start = datetime.utcnow().replace(hour=0, minute=0, second=0)
        end = datetime.utcnow()
    elif period == 'week':
        start = datetime.utcnow() - timedelta(days=7)
        end = datetime.utcnow()
    elif period == 'month':
        start = datetime.utcnow() - timedelta(days=30)
        end = datetime.utcnow()
    
    total = Booking.query.filter(
        Booking.created_at.between(start, end)
    ).count()
    
    approved = Booking.query.filter(
        Booking.created_at.between(start, end),
        Booking.status == 'approved'
    ).count()
    
    return (approved / total * 100) if total > 0 else 0
```

---

#### 11.1.2. Rejection rate

**By reason breakdown:**

```python
def get_rejection_metrics(period: str = 'week') -> dict:
    start = datetime.utcnow() - timedelta(days=7)
    
    rejections = Booking.query.filter(
        Booking.created_at >= start,
        Booking.status == 'rejected'
    ).all()
    
    # Group by reason
    by_reason = {}
    for booking in rejections:
        reason = booking.rejection_reason
        by_reason[reason] = by_reason.get(reason, 0) + 1
    
    total_bookings = Booking.query.filter(
        Booking.created_at >= start
    ).count()
    
    return {
        'rejection_rate': len(rejections) / total_bookings * 100 if total_bookings > 0 else 0,
        'total_rejections': len(rejections),
        'by_reason': by_reason
    }
```

---

#### 11.1.3. Speed of operator response

**Time to first contact:**

```python
def calculate_response_time_metrics() -> dict:
    # Get bookings from last 7 days
    start = datetime.utcnow() - timedelta(days=7)
    
    bookings = Booking.query.filter(
        Booking.created_at >= start,
        Booking.status.in_(['contacted', 'approved', 'rejected'])
    ).all()
    
    response_times = []
    for booking in bookings:
        # Find first status change to contacted or later
        first_contact = BookingStatusHistory.query.filter(
            BookingStatusHistory.booking_id == booking.id,
            BookingStatusHistory.to_status.in_(['contacted', 'approved'])
        ).order_by(BookingStatusHistory.created_at).first()
        
        if first_contact:
            delta = (first_contact.created_at - booking.created_at).total_seconds()
            response_times.append(delta)
    
    if not response_times:
        return {}
    
    return {
        'average_response_time_seconds': statistics.mean(response_times),
        'median_response_time_seconds': statistics.median(response_times),
        'p95_response_time_seconds': numpy.percentile(response_times, 95),
        'fastest_response_seconds': min(response_times),
        'slowest_response_seconds': max(response_times)
    }
```

---

#### 11.1.4. Error rate

**Error tracking:**

```python
def track_api_error(
    endpoint: str,
    error_type: str,
    error_code: int,
    request_id: str
):
    # Increment counter in Redis
    date_key = datetime.utcnow().strftime('%Y-%m-%d')
    hour_key = datetime.utcnow().strftime('%Y-%m-%d-%H')
    
    redis.incr(f"errors:total:{date_key}")
    redis.incr(f"errors:endpoint:{endpoint}:{date_key}")
    redis.incr(f"errors:type:{error_type}:{date_key}")
    redis.incr(f"errors:code:{error_code}:{date_key}")
    redis.incr(f"errors:hourly:{hour_key}")
    
    # Store error details
    ErrorLog.create(
        endpoint=endpoint,
        error_type=error_type,
        error_code=error_code,
        request_id=request_id,
        timestamp=datetime.utcnow()
    )

def get_error_rate(period: str = 'today') -> dict:
    if period == 'today':
        key_suffix = datetime.utcnow().strftime('%Y-%m-%d')
    
    total_errors = int(redis.get(f"errors:total:{key_suffix}") or 0)
    total_requests = int(redis.get(f"requests:total:{key_suffix}") or 1)
    
    return {
        'error_rate': (total_errors / total_requests * 100),
        'total_errors': total_errors,
        'total_requests': total_requests
    }
```

---

#### 11.1.5. Average booking value

```python
def get_booking_value_metrics() -> dict:
    bookings = Booking.query.filter(
        Booking.status == 'approved',
        Booking.created_at >= datetime.utcnow() - timedelta(days=30)
    ).all()
    
    values = [b.total_price for b in bookings]
    
    return {
        'average_booking_value': statistics.mean(values),
        'median_booking_value': statistics.median(values),
        'total_revenue': sum(values),
        'booking_count': len(values)
    }
```

---

#### 11.1.6. Time to first contact

(Covered in 11.1.3)

---

#### 11.1.7. Completion rate

```python
def get_completion_rate() -> float:
    # Bookings that made it from new to approved
    total = Booking.query.filter(
        Booking.created_at >= datetime.utcnow() - timedelta(days=30)
    ).count()
    
    completed = Booking.query.filter(
        Booking.created_at >= datetime.utcnow() - timedelta(days=30),
        Booking.status == 'approved'
    ).count()
    
    return (completed / total * 100) if total > 0 else 0
```

---

### 11.2. Какие логи должны сохраняться

#### 11.2.1. Audit log (все действия с заявкой)

**Structure:**

```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    action VARCHAR(100) NOT NULL,
    actor_id INTEGER REFERENCES users(id),
    actor_type VARCHAR(20),  -- 'user', 'operator', 'system', 'admin'
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_booking_id (booking_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
);
```

**Logged actions:**
- `booking_created`
- `status_changed`
- `field_updated`
- `comment_added`
- `operator_assigned`
- `document_generated`
- `notification_sent`

---

#### 11.2.2. Error log

**Structure:**

```sql
CREATE TABLE error_log (
    id SERIAL PRIMARY KEY,
    error_id VARCHAR(50) UNIQUE,
    endpoint VARCHAR(200),
    method VARCHAR(10),
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    request_body JSONB,
    user_id INTEGER REFERENCES users(id),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_error_type (error_type),
    INDEX idx_endpoint (endpoint)
);
```

---

#### 11.2.3. Performance log

**Request/Response timing:**

```python
import time

@app.before_request
def start_timer():
    g.start_time = time.time()

@app.after_request
def log_request(response):
    if hasattr(g, 'start_time'):
        elapsed = (time.time() - g.start_time) * 1000  # milliseconds
        
        # Log slow requests (> 1 second)
        if elapsed > 1000:
            logger.warning(
                f"Slow request: {request.method} {request.path} "
                f"took {elapsed:.0f}ms"
            )
        
        # Store in Redis for metrics
        date_hour = datetime.utcnow().strftime('%Y-%m-%d-%H')
        redis.lpush(f"perf:{request.endpoint}:{date_hour}", elapsed)
        redis.ltrim(f"perf:{request.endpoint}:{date_hour}", 0, 999)
        
    return response
```

---

#### 11.2.4. Security log

**Security events:**

```python
def log_security_event(
    event_type: str,
    severity: str,
    user_id: int = None,
    ip_address: str = None,
    details: dict = None
):
    SecurityLog.create(
        event_type=event_type,  # 'failed_login', 'suspicious_activity', etc
        severity=severity,       # 'low', 'medium', 'high', 'critical'
        user_id=user_id,
        ip_address=ip_address,
        details=details,
        timestamp=datetime.utcnow()
    )
    
    # Alert on critical events
    if severity == 'critical':
        alert_security_team(event_type, details)
```

---

#### 11.2.5. Integration log (external services)

**Third-party API calls:**

```python
def log_external_api_call(
    service: str,
    endpoint: str,
    method: str,
    request_data: dict,
    response_data: dict,
    response_time_ms: float,
    success: bool
):
    ExternalAPILog.create(
        service=service,          # 'sendgrid', 'twilio', 'openai', etc
        endpoint=endpoint,
        method=method,
        request_data=request_data,
        response_data=response_data,
        response_time_ms=response_time_ms,
        success=success,
        timestamp=datetime.utcnow()
    )
```

---

### 11.3. Correlation ID для цепочек запросов

#### 11.3.1. Генерация correlation_id

```python
import uuid

@app.before_request
def generate_correlation_id():
    # Check if client provided correlation ID
    correlation_id = request.headers.get('X-Correlation-ID')
    
    # If not, generate new one
    if not correlation_id:
        correlation_id = str(uuid.uuid4())
    
    # Store in request context
    g.correlation_id = correlation_id
    
    # Add to response headers
    @after_this_request
    def add_correlation_header(response):
        response.headers['X-Correlation-ID'] = correlation_id
        return response
```

---

#### 11.3.2. Передача через все сервисы

```python
async def call_downstream_service(url: str, data: dict):
    headers = {
        'X-Correlation-ID': g.correlation_id,
        'Content-Type': 'application/json'
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data, headers=headers) as response:
            return await response.json()
```

---

#### 11.3.3. Использование для debugging

**Log format with correlation ID:**

```python
import logging
from pythonjsonlogger import jsonlogger

logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    '%(timestamp)s %(level)s %(name)s %(correlation_id)s %(message)s'
)
logHandler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Usage
logger.info(
    "Booking created",
    extra={
        'correlation_id': g.correlation_id,
        'booking_id': booking.id,
        'user_id': booking.user_id
    }
)
```

**Tracing across services:**

```
2025-12-11T18:00:00Z INFO booking_service correlation_id=abc-123 Booking created booking_id=1001
2025-12-11T18:00:01Z INFO ai_service correlation_id=abc-123 Lead score calculated score=85
2025-12-11T18:00:02Z INFO notification_service correlation_id=abc-123 Email sent to=user@example.com
2025-12-11T18:00:03Z INFO warehouse_service correlation_id=abc-123 Operator notified operator_id=456
```

---

### 11.4. Alerting

#### 11.4.1. Critical errors alert

**Alert rules:**

```python
def check_critical_alerts():
    # 1. Error rate > 5%
    error_rate = get_error_rate('last_hour')
    if error_rate['error_rate'] > 5:
        send_alert(
            severity='critical',
            title='High Error Rate',
            message=f"Error rate is {error_rate['error_rate']:.1f}% (threshold: 5%)"
        )
    
    # 2. Response time > 2 seconds (p95)
    perf = get_performance_metrics('last_hour')
    if perf['p95'] > 2000:
        send_alert(
            severity='warning',
            title='Slow Response Time',
            message=f"P95 response time is {perf['p95']:.0f}ms (threshold: 2000ms)"
        )
    
    # 3. Database connections exhausted
    db_pool = db.engine.pool.size()
    if db_pool >= db.engine.pool.size() * 0.9:
        send_alert(
            severity='critical',
            title='Database Connection Pool Nearly Exhausted',
            message=f"Using {db_pool}/{db.engine.pool.size()} connections"
        )
```

---

#### 11.4.2. High rejection rate alert

```python
@celery.beat.schedule(crontab(minute='*/30'))  # Every 30 minutes
def check_rejection_rate():
    rate = get_rejection_metrics('last_hour')
    
    if rate['rejection_rate'] > 50:
        send_alert(
            severity='warning',
            title='High Rejection Rate',
            message=f"Rejection rate is {rate['rejection_rate']:.1f}% in last hour",
            details=rate['by_reason']
        )
```

---

#### 11.4.3. Service degradation alert

```python
def monitor_service_health():
    services = [
        {'name': 'database', 'check': check_database_health},
        {'name': 'redis', 'check': check_redis_health},
        {'name': 'email', 'check': check_email_service},
        {'name': 'sms', 'check': check_sms_service}
    ]
    
    for service in services:
        try:
            healthy = service['check']()
            if not healthy:
                send_alert(
                    severity='critical',
                    title=f"{service['name'].title()} Service Degraded",
                    message=f"{service['name']} health check failed"
                )
        except Exception as e:
            send_alert(
                severity='critical',
                title=f"{service['name'].title()} Service Down",
                message=f"{service['name']} is unreachable: {str(e)}"
            )
```

---

#### 11.4.4. Unusual activity alert

```python
def detect_unusual_activity():
    # Spike in bookings
    current_hour = Booking.query.filter(
        Booking.created_at >= datetime.utcnow() - timedelta(hours=1)
    ).count()
    
    avg_hourly = get_average_hourly_bookings()
    
    if current_hour > avg_hourly * 3:
        send_alert(
            severity='info',
            title='Unusual Booking Volume',
            message=f"Received {current_hour} bookings in last hour (avg: {avg_hourly})"
        )
    
    # Spike in fraud scores
    high_fraud = Booking.query.filter(
        Booking.created_at >= datetime.utcnow() - timedelta(hours=1),
        Booking.fraud_score >= 70
    ).count()
    
    if high_fraud > 5:
        send_alert(
            severity='warning',
            title='High Fraud Activity',
            message=f"{high_fraud} high-risk bookings in last hour"
        )
```

---

### 11.5. Dashboards

#### 11.5.1. Real-time booking dashboard

**Metrics displayed:**

- Bookings today (total, by status)
- Conversion rate (live)
- Average response time
- Active operators
- Current queue length
- Revenue today

---

#### 11.5.2. Operator performance dashboard

**Per-operator metrics:**

- Bookings handled
- Average response time
- Approval rate
- Rejection rate
- Customer satisfaction (from reviews)

---

#### 11.5.3. System health dashboard

**System metrics:**

- API response times (P50, P95, P99)
- Error rates
- Database query performance
- External service status
- Cache hit rates
- Queue lengths

---

**End of Sections 9-11**

---
# Booking Flow — Deep Technical Specification (MVP → v2)

## PART 6: Data, Performance, Compliance & Roadmap

---

## 12. Правила валидации данных

### 12.1. Форматы телефонов

#### 12.1.1. Российский формат (+7)

**Accepted formats:**

```python
VALID_PHONE_FORMATS = [
    r'^\+7\d{10}$',           # +971501234567
    r'^8\d{10}$',             # 89991234567
    r'^7\d{10}$',             # 79991234567
    r'^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$',  # +971 50 123 4567
    r'^8 \(\d{3}\) \d{3}-\d{2}-\d{2}$',    # 8 (999) 123-45-67
]

def validate_russian_phone(phone: str) -> tuple[bool, str]:
    """
    Validates Russian phone number format.
    Returns: (is_valid, error_message)
    """
    if not phone:
        return False, "Номер телефона обязателен"
    
    # Remove all non-digits
    digits_only = re.sub(r'\D', '', phone)
    
    # Check length
    if len(digits_only) != 11:
        return False, "Номер должен содержать 11 цифр"
    
    # Check prefix
    if not (digits_only.startswith('7') or digits_only.startswith('8')):
        return False, "Номер должен начинаться с 7 или 8"
    
    # Check operator code (first 3 digits after country code)
    operator_code = digits_only[1:4]
    valid_codes = ['900', '901', '902', '903', '904', '905', '906', '908', '909',
                   '910', '911', '912', '913', '914', '915', '916', '917', '918', '919',
                   '920', '921', '922', '923', '924', '925', '926', '927', '928', '929',
                   '930', '931', '932', '933', '934', '936', '937', '938', '939',
                   '950', '951', '952', '953', '954', '955', '956', '958', '960', '961',
                   '962', '963', '964', '965', '966', '967', '968', '969', '970', '971',
                   '977', '978', '980', '981', '982', '983', '984', '985', '986', '987',
                   '988', '989', '991', '992', '993', '994', '995', '996', '997', '999']
    
    if operator_code not in valid_codes:
        return False, "Неверный код оператора"
    
    return True, ""
```

---

#### 12.1.2. Международные форматы

**v2 feature - International support:**

```python
import phonenumbers
from phonenumbers import NumberParseException

def validate_international_phone(phone: str, default_region: str = 'RU') -> tuple[bool, str]:
    """
    Validates international phone numbers using phonenumbers library.
    """
    try:
        parsed = phonenumbers.parse(phone, default_region)
        
        if not phonenumbers.is_valid_number(parsed):
            return False, "Неверный номер телефона"
        
        return True, ""
    
    except NumberParseException as e:
        return False, f"Ошибка парсинга номера: {str(e)}"
```

---

#### 12.1.3. Нормализация номера

**Normalization to standard format:**

```python
def normalize_phone(phone: str) -> str:
    """
    Normalizes phone number to +7XXXXXXXXXX format.
    """
    # Remove all non-digits
    digits = re.sub(r'\D', '', phone)
    
    # Convert 8 to 7
    if digits.startswith('8') and len(digits) == 11:
        digits = '7' + digits[1:]
    
    # Add + prefix
    if not digits.startswith('+'):
        digits = '+' + digits
    
    return digits

# Examples
normalize_phone("+971 50 123 4567")  # → "+971501234567"
normalize_phone("8 999 123 45 67")      # → "+971501234567"
normalize_phone("79991234567")          # → "+971501234567"
```

---

#### 12.1.4. Проверка на валидность

**Additional checks:**

```python
def is_valid_phone_advanced(phone: str) -> dict:
    """
    Advanced phone validation with detailed feedback.
    """
    result = {
        'is_valid': False,
        'normalized': None,
        'errors': [],
        'warnings': []
    }
    
    # Basic format check
    is_valid, error = validate_russian_phone(phone)
    if not is_valid:
        result['errors'].append(error)
        return result
    
    # Normalize
    normalized = normalize_phone(phone)
    result['normalized'] = normalized
    
    # Check against blacklist
    if is_blacklisted_phone(normalized):
        result['errors'].append("Номер в черном списке")
        return result
    
    # Check if it's a known VoIP/virtual number
    if is_voip_number(normalized):
        result['warnings'].append("Виртуальный номер - может потребоваться дополнительная проверка")
    
    # Check if number is reachable (optional, expensive)
    # if settings.VERIFY_PHONE_REACHABILITY:
    #     if not is_number_reachable(normalized):
    #         result['warnings'].append("Номер может быть недоступен")
    
    result['is_valid'] = True
    return result
```

---

### 12.2. Размеры строк

#### 12.2.1. Name: 2-100 символов

**Validation:**

```python
def validate_name(name: str) -> tuple[bool, str]:
    if not name:
        return False, "Имя обязательно"
    
    # Strip whitespace
    name = name.strip()
    
    # Check length
    if len(name) < 2:
        return False, "Имя должно содержать минимум 2 символа"
    
    if len(name) > 100:
        return False, "Имя слишком длинное (максимум 100 символов)"
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    if not re.match(r'^[а-яА-ЯёЁa-zA-Z\s\-\'\.]+$', name):
        return False, "Имя содержит недопустимые символы"
    
    # Check for suspicious patterns
    if re.search(r'(.)\1{3,}', name):  # More than 3 repeated chars
        return False, "Подозрительное имя"
    
    return True, ""
```

---

#### 12.2.2. Comment: 0-500 символов

**Validation:**

```python
def validate_comment(comment: str) -> tuple[bool, str]:
    if not comment:
        return True, ""  # Optional field
    
    # Strip whitespace
    comment = comment.strip()
    
    # Check length
    if len(comment) > 500:
        return False, f"Комментарий слишком длинный ({len(comment)}/500 символов)"
    
    # Check for spam patterns
    spam_patterns = [
        r'http[s]?://',           # URLs
        r'www\.',                 # URLs
        r'\b\d{10,}\b',          # Long number sequences
        r'(.)\1{5,}',            # Many repeated characters
        r'[A-Z]{10,}',           # Long uppercase sequences
    ]
    
    for pattern in spam_patterns:
        if re.search(pattern, comment):
            return False, "Комментарий содержит подозрительный контент"
    
    # Check for profanity (basic)
    if contains_profanity(comment):
        return False, "Комментарий содержит недопустимые слова"
    
    return True, ""

def contains_profanity(text: str) -> bool:
    # Load profanity list
    profanity_words = load_profanity_list()
    text_lower = text.lower()
    
    for word in profanity_words:
        if word in text_lower:
            return True
    
    return False
```

---

#### 12.2.3. Reason: 10-1000 символов

**Validation for rejection reasons:**

```python
def validate_rejection_reason(reason_text: str) -> tuple[bool, str]:
    if not reason_text:
        return False, "Причина отклонения обязательна"
    
    # Strip whitespace
    reason_text = reason_text.strip()
    
    # Check minimum length (must be meaningful)
    if len(reason_text) < 10:
        return False, "Причина должна содержать минимум 10 символов"
    
    # Check maximum length
    if len(reason_text) > 1000:
        return False, f"Причина слишком длинная ({len(reason_text)}/1000 символов)"
    
    # Check if it's just gibberish
    words = reason_text.split()
    if len(words) < 3:
        return False, "Укажите более подробную причину"
    
    return True, ""
```

---

### 12.3. Неверные идентификаторы

#### 12.3.1. Проверка существования warehouse_id

**Validation:**

```python
def validate_warehouse_id(warehouse_id: int) -> tuple[bool, str, Warehouse]:
    """
    Validates warehouse exists and is active.
    Returns: (is_valid, error_message, warehouse_object)
    """
    if not warehouse_id:
        return False, "Не указан ID склада", None
    
    # Check type
    if not isinstance(warehouse_id, int) or warehouse_id <= 0:
        return False, "Неверный формат ID склада", None
    
    # Check existence
    warehouse = Warehouse.query.get(warehouse_id)
    if not warehouse:
        return False, f"Склад с ID {warehouse_id} не найден", None
    
    # Check if active
    if not warehouse.is_active:
        return False, "Склад неактивен", None
    
    # Check if accepting bookings
    if not warehouse.accepts_bookings:
        return False, "Склад временно не принимает заявки", None
    
    return True, "", warehouse
```

---

#### 12.3.2. Проверка существования box_id

**Validation:**

```python
def validate_box_id(box_id: int) -> tuple[bool, str, Box]:
    """
    Validates box exists and is available.
    """
    if not box_id:
        return False, "Не указан ID бокса", None
    
    if not isinstance(box_id, int) or box_id <= 0:
        return False, "Неверный формат ID бокса", None
    
    box = Box.query.get(box_id)
    if not box:
        return False, f"Бокс с ID {box_id} не найден", None
    
    if box.status != 'available':
        return False, "Бокс недоступен", None
    
    return True, "", box
```

---

#### 12.3.3. Проверка принадлежности бокса складу

**Cross-validation:**

```python
def validate_box_belongs_to_warehouse(box_id: int, warehouse_id: int) -> tuple[bool, str]:
    """
    Validates that box belongs to the specified warehouse.
    """
    box = Box.query.get(box_id)
    
    if not box:
        return False, "Бокс не найден"
    
    if box.warehouse_id != warehouse_id:
        return False, f"Бокс не принадлежит складу {warehouse_id}"
    
    return True, ""
```

---

### 12.4. Антибот-проверки

#### 12.4.1. CAPTCHA для неавторизованных

**Implementation:**

```python
from google.recaptcha import verify_recaptcha

def verify_captcha_token(token: str, expected_action: str = 'booking') -> tuple[bool, float]:
    """
    Verifies reCAPTCHA v3 token.
    Returns: (is_valid, score)
    """
    try:
        result = verify_recaptcha(
            token=token,
            secret=settings.RECAPTCHA_SECRET_KEY,
            expected_action=expected_action
        )
        
        if not result['success']:
            return False, 0.0
        
        score = result.get('score', 0.0)
        
        # Score interpretation:
        # 0.0 - 0.3: Likely bot
        # 0.3 - 0.7: Suspicious
        # 0.7 - 1.0: Likely human
        
        if score < 0.3:
            return False, score
        
        return True, score
    
    except Exception as e:
        logger.error(f"CAPTCHA verification failed: {e}")
        # Fail open - allow request but flag for review
        return True, 0.5

# In API endpoint
@app.route('/api/v1/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    
    # Require CAPTCHA for anonymous users
    if not current_user.is_authenticated:
        captcha_token = data.get('captcha_token')
        if not captcha_token:
            return error_response('CAPTCHA required', 400)
        
        is_valid, score = verify_captcha_token(captcha_token, 'booking')
        if not is_valid:
            return error_response('CAPTCHA verification failed', 400)
        
        # Store score for fraud detection
        data['captcha_score'] = score
    
    # ... rest of booking creation
```

---

#### 12.4.2. Honeypot fields

**Hidden field technique:**

```html
<!-- Frontend: Add hidden field (not visible to users) -->
<input 
    type="text" 
    name="website" 
    id="website" 
    value="" 
    style="position: absolute; left: -9999px;"
    tabindex="-1"
    autocomplete="off"
/>
```

```python
# Backend: Check if honeypot field was filled
def check_honeypot(data: dict) -> bool:
    """
    Returns True if honeypot was triggered (likely bot).
    """
    honeypot_field = data.get('website', '')
    
    # If filled, it's a bot
    if honeypot_field:
        logger.warning(f"Honeypot triggered: {honeypot_field}")
        return True
    
    return False

# In API endpoint
if check_honeypot(request.json):
    # Silently reject (don't tell the bot)
    return jsonify({'success': True, 'data': {'booking_id': 'fake_id'}}), 201
```

---

#### 12.4.3. Request timing analysis

**Form fill time tracking:**

```javascript
// Frontend: Track form timing
let formStartTime = Date.now();

function submitBookingForm() {
    const formFillTime = (Date.now() - formStartTime) / 1000; // seconds
    
    // Add to payload
    bookingData.metadata = {
        form_fill_time_seconds: formFillTime,
        form_start_timestamp: formStartTime
    };
    
    // Submit
    await fetch('/api/v1/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    });
}
```

```python
# Backend: Analyze timing
def analyze_form_timing(metadata: dict) -> dict:
    """
    Analyzes form fill timing for bot behavior.
    """
    fill_time = metadata.get('form_fill_time_seconds', 999)
    
    result = {
        'is_suspicious': False,
        'flags': []
    }
    
    # Too fast (likely bot)
    if fill_time < 10:
        result['is_suspicious'] = True
        result['flags'].append('filled_too_fast')
    
    # Suspiciously exact timing (bot)
    if fill_time % 1 == 0:  # Exact seconds
        result['flags'].append('exact_timing')
    
    # Too slow (abandoned tab, but came back)
    if fill_time > 3600:  # 1 hour
        result['flags'].append('filled_too_slow')
    
    return result
```

---

#### 12.4.4. Fingerprinting

**Browser fingerprinting:**

```javascript
// Frontend: Generate fingerprint
async function generateFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
}

// Add to booking request
bookingData.fingerprint = await generateFingerprint();
```

```python
# Backend: Track fingerprints
def check_fingerprint_abuse(fingerprint: str) -> bool:
    """
    Checks if fingerprint has been abusing the system.
    """
    # Count bookings from this fingerprint in last 24h
    count = redis.get(f"fingerprint:bookings:{fingerprint}:24h")
    
    if count and int(count) > 10:
        logger.warning(f"Fingerprint abuse detected: {fingerprint}")
        return True
    
    # Increment counter
    redis.incr(f"fingerprint:bookings:{fingerprint}:24h")
    redis.expire(f"fingerprint:bookings:{fingerprint}:24h", 86400)
    
    return False
```

---

### 12.5. Required fields

#### 12.5.1. Список обязательных полей

**Complete validation schema:**

```python
from marshmallow import Schema, fields, validate, ValidationError

class BookingCreateSchema(Schema):
    # Required fields
    warehouse_id = fields.Integer(required=True, validate=validate.Range(min=1))
    box_id = fields.Integer(required=True, validate=validate.Range(min=1))
    start_date = fields.Date(required=True)
    duration_months = fields.Integer(required=True, validate=validate.Range(min=1, max=24))
    user_name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    user_phone = fields.String(required=True)
    terms_accepted = fields.Boolean(required=True, validate=validate.Equal(True))
    
    # Optional fields
    user_email = fields.Email(required=False, allow_none=True)
    user_comment = fields.String(required=False, validate=validate.Length(max=500))
    
    # Nested optional
    contact_preferences = fields.Nested('ContactPreferencesSchema', required=False)

class ContactPreferencesSchema(Schema):
    preferred_contact_method = fields.String(
        validate=validate.OneOf(['phone', 'email', 'telegram']),
        missing='phone'
    )
    preferred_time = fields.String(
        validate=validate.OneOf(['morning', 'afternoon', 'evening', 'anytime']),
        missing='anytime'
    )

# Usage
schema = BookingCreateSchema()

try:
    validated_data = schema.load(request.json)
except ValidationError as e:
    return error_response({
        'code': 'validation_error',
        'message': 'Ошибки валидации данных',
        'details': e.messages
    }, 400)
```

---

#### 12.5.2. Conditional requirements

**Context-dependent validation:**

```python
def validate_booking_data_contextual(data: dict, user: User = None) -> dict:
    """
    Validates booking data with context-dependent rules.
    """
    errors = {}
    
    # If user is not authenticated, email is recommended
    if not user and not data.get('user_email'):
        errors['user_email'] = "Рекомендуется указать email для получения уведомлений"
    
    # If high-value booking (>50k), additional verification required
    estimated_total = estimate_booking_total(
        data.get('box_id'),
        data.get('duration_months')
    )
    
    if estimated_total > 50000:
        if not user:
            errors['authentication'] = "Для бронирований свыше 50 000₽ требуется регистрация"
        
        if not data.get('user_comment'):
            errors['user_comment'] = "Укажите цель аренды для больших бронирований"
    
    # If booking far in advance (>30 days), confirmation required
    start_date = datetime.fromisoformat(data.get('start_date'))
    if (start_date - datetime.now()).days > 30:
        if not data.get('advance_booking_confirmation'):
            errors['advance_booking_confirmation'] = "Подтвердите бронирование заранее"
    
    return errors
```

---

#### 12.5.3. Error messages

**User-friendly error messages:**

```python
ERROR_MESSAGES = {
    'warehouse_id': {
        'required': 'Выберите склад',
        'invalid': 'Выбран неверный склад',
        'not_found': 'Склад не найден',
        'inactive': 'Склад временно недоступен'
    },
    'box_id': {
        'required': 'Выберите бокс',
        'invalid': 'Выбран неверный бокс',
        'not_found': 'Бокс не найден',
        'unavailable': 'Бокс уже занят'
    },
    'start_date': {
        'required': 'Укажите дату начала аренды',
        'invalid_format': 'Неверный формат даты',
        'in_past': 'Дата не может быть в прошлом',
        'too_far': 'Нельзя забронировать более чем на 90 дней вперёд'
    },
    'duration_months': {
        'required': 'Укажите срок аренды',
        'too_short': 'Минимальный срок аренды: 1 месяц',
        'too_long': 'Максимальный срок аренды: 24 месяца'
    },
    'user_name': {
        'required': 'Введите ваше имя',
        'too_short': 'Имя должно содержать минимум 2 символа',
        'too_long': 'Имя слишком длинное',
        'invalid_chars': 'Имя содержит недопустимые символы'
    },
    'user_phone': {
        'required': 'Введите номер телефона',
        'invalid_format': 'Неверный формат телефона',
        'blacklisted': 'Номер заблокирован',
        'not_russian': 'Поддерживаются только российские номера'
    },
    'user_email': {
        'invalid_format': 'Неверный формат email',
        'disposable': 'Одноразовые email не принимаются'
    },
    'terms_accepted': {
        'required': 'Необходимо принять условия использования'
    }
}

def get_error_message(field: str, error_type: str) -> str:
    return ERROR_MESSAGES.get(field, {}).get(error_type, f"Ошибка в поле {field}")
```

---

## 13. Модель данных

### 13.1. Таблица bookings

#### 13.1.1. Структура таблицы (SQL DDL)

```sql
CREATE TABLE bookings (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Business Identifier
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Foreign Keys
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    box_id INTEGER NOT NULL REFERENCES boxes(id) ON DELETE RESTRICT,
    assigned_operator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INTEGER NOT NULL CHECK (duration_months BETWEEN 1 AND 24),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    
    -- Contact Information
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_email VARCHAR(100),
    user_comment TEXT,
    
    -- Contact Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'phone',
    preferred_time VARCHAR(20) DEFAULT 'anytime',
    
    -- Pricing
    monthly_price DECIMAL(10, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    discounted_monthly_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2),
    
    -- Scoring & Risk
    lead_score INTEGER CHECK (lead_score BETWEEN 0 AND 100),
    fraud_score INTEGER CHECK (fraud_score BETWEEN 0 AND 100),
    fraud_risk_level VARCHAR(20),
    
    -- Status Tracking
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    rejected_at TIMESTAMP,
    rejected_by INTEGER REFERENCES users(id),
    rejection_reason VARCHAR(100),
    rejection_reason_text TEXT,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER REFERENCES users(id),
    cancellation_reason VARCHAR(100),
    cancellation_note TEXT,
    
    -- Flags
    requires_manual_review BOOLEAN DEFAULT FALSE,
    manual_review_reason VARCHAR(100),
    flagged_for_review BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    source VARCHAR(50) DEFAULT 'web',
    ip_address VARCHAR(45),
    user_agent TEXT,
    fingerprint VARCHAR(100),
    captcha_score DECIMAL(3, 2),
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_dates CHECK (end_date > start_date),
    CONSTRAINT chk_status CHECK (status IN (
        'new', 'in_progress', 'contacted', 'approved', 'rejected',
        'cancelled', 'expired', 'payment_pending', 'active', 'completed'
    ))
);

-- Comments
COMMENT ON TABLE bookings IS 'Booking requests and confirmed bookings';
COMMENT ON COLUMN bookings.booking_number IS 'Human-readable booking identifier (BK-YYYYMMDD-XXXX)';
COMMENT ON COLUMN bookings.lead_score IS 'AI-calculated lead quality score (0-100)';
COMMENT ON COLUMN bookings.fraud_score IS 'Fraud risk score (0-100)';
```

---

#### 13.1.2. Описание полей

**Core Fields:**

| Field | Type | Null | Description |
|-------|------|------|-------------|
| `id` | integer | NO | Internal primary key |
| `booking_number` | varchar(50) | NO | Human-readable ID (BK-20251211-0042) |
| `user_id` | integer | YES | User ID (NULL for anonymous) |
| `warehouse_id` | integer | NO | Warehouse being booked |
| `box_id` | integer | NO | Box being booked |
| `status` | varchar(50) | NO | Current booking status |

**Date Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `start_date` | date | Rental start date |
| `end_date` | date | Rental end date |
| `duration_months` | integer | Number of months (1-24) |

**Contact Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `user_name` | varchar(100) | Customer name |
| `user_phone` | varchar(20) | Customer phone (normalized) |
| `user_email` | varchar(100) | Customer email (optional) |
| `user_comment` | text | Customer notes |

**Pricing Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `monthly_price` | decimal(10,2) | Base monthly price |
| `discount_percent` | decimal(5,2) | Discount percentage |
| `total_price` | decimal(10,2) | Total rental cost |
| `deposit` | decimal(10,2) | Security deposit |

---

#### 13.1.3. Constraints

**Check constraints:**

```sql
-- Date validation
ALTER TABLE bookings ADD CONSTRAINT chk_dates 
CHECK (end_date > start_date);

-- Duration validation
ALTER TABLE bookings ADD CONSTRAINT chk_duration 
CHECK (duration_months BETWEEN 1 AND 24);

-- Status validation
ALTER TABLE bookings ADD CONSTRAINT chk_status 
CHECK (status IN ('new', 'in_progress', 'contacted', 'approved', 
                  'rejected', 'cancelled', 'expired', 'payment_pending', 
                  'active', 'completed'));

-- Score validation
ALTER TABLE bookings ADD CONSTRAINT chk_lead_score 
CHECK (lead_score IS NULL OR (lead_score BETWEEN 0 AND 100));

ALTER TABLE bookings ADD CONSTRAINT chk_fraud_score 
CHECK (fraud_score IS NULL OR (fraud_score BETWEEN 0 AND 100));

-- Phone format validation
ALTER TABLE bookings ADD CONSTRAINT chk_phone_format 
CHECK (user_phone ~ '^\+7\d{10}$');
```

**Foreign key constraints:**

```sql
-- User relationship (soft delete - keep booking if user deleted)
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Warehouse relationship (hard - cannot delete warehouse with bookings)
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_warehouse
FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT;

-- Box relationship (hard - cannot delete box with bookings)
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_box
FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE RESTRICT;

-- Operator relationship (soft - keep booking if operator removed)
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_operator
FOREIGN KEY (assigned_operator_id) REFERENCES users(id) ON DELETE SET NULL;
```

---

#### 13.1.4. Triggers

**Auto-update timestamp:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Calculate end_date from duration:**

```sql
CREATE OR REPLACE FUNCTION calculate_end_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_date IS NOT NULL AND NEW.duration_months IS NOT NULL THEN
        NEW.end_date = NEW.start_date + (NEW.duration_months || ' months')::INTERVAL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_end_date
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
WHEN (NEW.start_date IS NOT NULL AND NEW.duration_months IS NOT NULL)
EXECUTE FUNCTION calculate_end_date();
```

**Calculate discounted price:**

```sql
CREATE OR REPLACE FUNCTION calculate_discounted_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.discount_percent IS NOT NULL AND NEW.discount_percent > 0 THEN
        NEW.discounted_monthly_price = NEW.monthly_price * (1 - NEW.discount_percent / 100);
        NEW.total_price = NEW.discounted_monthly_price * NEW.duration_months;
    ELSE
        NEW.discounted_monthly_price = NEW.monthly_price;
        NEW.total_price = NEW.monthly_price * NEW.duration_months;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_discounted_price
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
WHEN (NEW.monthly_price IS NOT NULL)
EXECUTE FUNCTION calculate_discounted_price();
```

---

### 13.2. Связи с пользователем

#### 13.2.1. Foreign key к users.id

```sql
-- Relationship diagram
users (1) ←──── (M) bookings

-- One user can have many bookings
-- A booking may or may not have a user (anonymous)
```

**Query examples:**

```sql
-- Get all bookings for a user
SELECT * FROM bookings 
WHERE user_id = 123 
ORDER BY created_at DESC;

-- Get user info for a booking
SELECT 
    b.*,
    u.full_name,
    u.email,
    u.phone
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
WHERE b.id = 1001;
```

---

#### 13.2.2. ON DELETE behavior

```sql
-- SET NULL: Keep booking even if user deleted
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_user
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL;
```

**Rationale:**  
Bookings are business-critical records. Even if a user deletes their account, we must keep booking history for:
- Financial records
- Audit trail
- Operator reference
- Legal compliance

---

#### 13.2.3. Каскадные действия

**No cascade delete:**  
We never cascade delete bookings. Instead:

```python
def delete_user_account(user_id: int):
    """
    Soft delete user, preserve bookings.
    """
    user = User.query.get(user_id)
    
    # Anonymize user data
    user.is_active = False
    user.deleted_at = datetime.utcnow()
    user.email = f"deleted_{user_id}@anonymous.local"
    user.phone = None
    
    # Keep bookings, but they'll have user_id = NULL after deletion
    # Contact info is still preserved in booking fields
    
    user.save()
```

---

### 13.3. Связи с боксом и складом

```sql
-- Relationships
warehouses (1) ←──── (M) bookings
boxes (1) ←──── (M) bookings

-- A warehouse can have many bookings
-- A box can have many bookings (over time, not simultaneously)
```

---

#### 13.3.1. Foreign key к warehouses.id

```sql
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_warehouse
FOREIGN KEY (warehouse_id) 
REFERENCES warehouses(id) 
ON DELETE RESTRICT;
```

**Rationale:**  
Cannot delete a warehouse that has bookings (active or historical).

---

#### 13.3.2. Foreign key к boxes.id

```sql
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_box
FOREIGN KEY (box_id) 
REFERENCES boxes(id) 
ON DELETE RESTRICT;
```

**Rationale:**  
Cannot delete a box that has bookings (inventory history must be preserved).

---

#### 13.3.3. Referential integrity

**Query to check integrity:**

```sql
-- Find orphaned bookings (should be none)
SELECT b.id, b.booking_number
FROM bookings b
LEFT JOIN warehouses w ON b.warehouse_id = w.id
LEFT JOIN boxes bx ON b.box_id = bx.id
WHERE w.id IS NULL OR bx.id IS NULL;

-- Find bookings with invalid box-warehouse relationship
SELECT b.id, b.booking_number
FROM bookings b
JOIN boxes bx ON b.box_id = bx.id
WHERE bx.warehouse_id != b.warehouse_id;
```

---

### 13.4. Индексация

#### 13.4.1. Primary index (id)

```sql
-- Automatically created with PRIMARY KEY
CREATE INDEX bookings_pkey ON bookings(id);
```

---

#### 13.4.2. Index на user_id

```sql
-- For: "Get all bookings for user X"
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Usage
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE user_id = 123;
```

---

#### 13.4.3. Index на warehouse_id

```sql
-- For: "Get all bookings for warehouse X"
CREATE INDEX idx_bookings_warehouse_id ON bookings(warehouse_id);
```

---

#### 13.4.4. Index на status

```sql
-- For: "Get all bookings with status X"
CREATE INDEX idx_bookings_status ON bookings(status);

-- Partial index for active statuses (more efficient)
CREATE INDEX idx_bookings_status_active ON bookings(status)
WHERE status IN ('new', 'in_progress', 'contacted');
```

---

#### 13.4.5. Index на created_at

```sql
-- For: Time-range queries, ordering
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

---

#### 13.4.6. Composite indexes

```sql
-- For operator dashboard: Filter by warehouse + status + sort by lead_score
CREATE INDEX idx_bookings_operator_dashboard 
ON bookings(warehouse_id, status, lead_score DESC, created_at DESC);

-- For user dashboard: Filter by user + status + sort by date
CREATE INDEX idx_bookings_user_dashboard 
ON bookings(user_id, status, created_at DESC);

-- For fraud analysis: High risk bookings
CREATE INDEX idx_bookings_fraud_risk 
ON bookings(fraud_score DESC, created_at DESC)
WHERE fraud_score >= 50;

-- For expired bookings cleanup
CREATE INDEX idx_bookings_expires_at 
ON bookings(expires_at)
WHERE status IN ('new', 'in_progress', 'contacted');
```

---

### 13.5. Таблица booking_status_history

#### 13.5.1. Структура таблицы

```sql
CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    changed_by_type VARCHAR(20) NOT NULL,  -- 'user', 'operator', 'system', 'admin'
    reason VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    INDEX idx_bsh_booking_id (booking_id),
    INDEX idx_bsh_created_at (created_at)
);

COMMENT ON TABLE booking_status_history IS 'Audit trail for booking status changes';
```

---

#### 13.5.2. Аудит изменений статуса

**Automatically log every status change:**

```sql
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO booking_status_history (
            booking_id,
            from_status,
            to_status,
            changed_by,
            changed_by_type,
            note
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            current_setting('app.current_user_id', true)::INTEGER,
            current_setting('app.current_user_type', true),
            'Status changed'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_status_change
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION log_status_change();
```

**Python usage:**

```python
# Set current user context for trigger
db.session.execute(
    "SELECT set_config('app.current_user_id', :user_id, false)",
    {'user_id': str(current_user.id)}
)
db.session.execute(
    "SELECT set_config('app.current_user_type', :user_type, false)",
    {'user_type': current_user.role}
)

# Update booking status
booking.status = 'approved'
booking.save()  # Trigger fires automatically
```

---

### 13.6. Таблица booking_comments

#### 13.6.1. Структура таблицы

```sql
CREATE TABLE booking_comments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    comment_type VARCHAR(20) NOT NULL,  -- 'internal', 'public', 'system'
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    INDEX idx_bc_booking_id (booking_id),
    INDEX idx_bc_created_at (created_at),
    
    CONSTRAINT chk_comment_type CHECK (comment_type IN ('internal', 'public', 'system'))
);

COMMENT ON TABLE booking_comments IS 'Comments and notes on bookings';
COMMENT ON COLUMN booking_comments.comment_type IS 'internal: only operators see; public: user sees; system: automatic';
```

---

#### 13.6.2. Внутренние vs публичные комментарии

**Query examples:**

```sql
-- Get all comments visible to user
SELECT * FROM booking_comments
WHERE booking_id = 1001
AND comment_type IN ('public', 'system')
ORDER BY created_at;

-- Get all comments visible to operator (all types)
SELECT * FROM booking_comments
WHERE booking_id = 1001
ORDER BY created_at;

-- Add internal comment
INSERT INTO booking_comments (booking_id, user_id, comment_type, comment)
VALUES (1001, 456, 'internal', 'Клиент попросил перезвонить после 18:00');
```

---

## 14. Performance требования

### 14.1. Booking API latency

#### 14.1.1. POST /bookings: < 500ms (p95)

**Target:** 95th percentile response time under 500ms

**Optimization strategies:**

```python
# 1. Use database connection pooling
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_MAX_OVERFLOW = 10

# 2. Minimize database queries
# Bad: N+1 queries
for booking in bookings:
    warehouse = booking.warehouse  # Separate query each time

# Good: Eager loading
bookings = Booking.query.options(
    joinedload(Booking.warehouse),
    joinedload(Booking.box)
).all()

# 3. Async notifications (don't block response)
queue_task('send_notification', booking_id=booking.id)

# 4. Cache frequently accessed data
@cache.memoize(timeout=300)
def get_warehouse(warehouse_id):
    return Warehouse.query.get(warehouse_id)
```

---

#### 14.1.2. GET /bookings/{id}: < 200ms (p95)

**Target:** Sub-200ms for single booking retrieval

**Optimization:**

```python
# Use SELECT specific fields instead of SELECT *
booking = db.session.query(
    Booking.id,
    Booking.booking_number,
    Booking.status,
    Booking.created_at
).filter(Booking.id == booking_id).first()

# Cache booking details
@cache.memoize(timeout=60)
def get_booking_details(booking_id):
    return Booking.query.get(booking_id).to_dict()
```

---

#### 14.1.3. GET /user/bookings: < 300ms (p95)

**Target:** List queries under 300ms

**Optimization:**

```python
# 1. Use cursor-based pagination (faster than offset)
# 2. Limit fields in response
# 3. Add proper indexes
# 4. Use database-level pagination

# Example
query = Booking.query.filter(
    Booking.user_id == user_id
).order_by(Booking.created_at.desc())

# Use limit/offset efficiently
bookings = query.limit(20).offset((page - 1) * 20).all()
```

---

### 14.2. Массовые запросы оператора

#### 14.2.1. Pagination strategy

**Cursor-based pagination (recommended for large datasets):**

```python
def get_bookings_cursor(cursor: int = None, limit: int = 20):
    query = Booking.query
    
    if cursor:
        query = query.filter(Booking.id < cursor)
    
    bookings = query.order_by(Booking.id.desc()).limit(limit).all()
    
    next_cursor = bookings[-1].id if bookings else None
    
    return {
        'bookings': bookings,
        'next_cursor': next_cursor,
        'has_more': len(bookings) == limit
    }
```

---

#### 14.2.2. Cursor-based pagination vs offset

**Performance comparison:**

| Method | Query | Performance | Use Case |
|--------|-------|-------------|----------|
| Offset | `LIMIT 20 OFFSET 10000` | ❌ Slow for large offsets | Small datasets |
| Cursor | `WHERE id < 12345 LIMIT 20` | ✅ Fast, constant time | Large datasets |

---

#### 14.2.3. Query optimization

**Best practices:**

```sql
-- Bad: Full table scan
SELECT * FROM bookings WHERE status = 'new';

-- Good: Index usage
CREATE INDEX idx_bookings_status ON bookings(status);
SELECT * FROM bookings WHERE status = 'new';

-- Better: Covering index
CREATE INDEX idx_bookings_status_covering 
ON bookings(status, created_at, id, warehouse_id);

-- Best: Partial index for active statuses only
CREATE INDEX idx_bookings_active_statuses 
ON bookings(status, created_at DESC)
WHERE status IN ('new', 'in_progress', 'contacted');
```

---

### 14.3. Кэширование справочников

#### 14.3.1. Cache strategy (Redis)

**What to cache:**

- Warehouse list (changes rarely)
- Box availability (changes frequently, short TTL)
- User session data
- Rate limit counters

**Implementation:**

```python
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(key_prefix: str, ttl: int = 300):
    """
    Decorator to cache function results in Redis.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{args}:{kwargs}"
            
            # Try to get from cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(
                cache_key,
                ttl,
                json.dumps(result)
            )
            
            return result
        return wrapper
    return decorator

# Usage
@cache_result('warehouse_list', ttl=300)
def get_warehouse_list(city: str):
    return Warehouse.query.filter_by(city=city).all()
```

---

#### 14.3.2. TTL policies

**Cache TTL by data type:**

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Warehouse list | 5 min | Changes rarely |
| Box availability | 1 min | Changes frequently |
| Booking details | 1 min | Changes during processing |
| User session | 30 min | Standard session length |
| Rate limit counters | 1 hour | Reset hourly |
| Static content | 24 hours | Rarely changes |

---

#### 14.3.3. Cache invalidation

**Strategies:**

```python
# 1. Time-based (TTL) - automatic
redis.setex('key', 300, value)  # Expires after 5 minutes

# 2. Event-based - manual
def update_warehouse(warehouse_id):
    # Update database
    warehouse.save()
    
    # Invalidate cache
    redis.delete(f"warehouse:{warehouse_id}")
    redis.delete("warehouse_list:*")  # Pattern delete

# 3. Write-through cache
def create_booking(data):
    booking = Booking.create(**data)
    
    # Update cache immediately
    redis.setex(
        f"booking:{booking.id}",
        60,
        json.dumps(booking.to_dict())
    )
    
    return booking
```

---

### 14.4. Database optimization

#### 14.4.1. Query performance

**Use EXPLAIN ANALYZE:**

```sql
EXPLAIN ANALYZE
SELECT * FROM bookings 
WHERE warehouse_id = 101 
AND status = 'new'
ORDER BY created_at DESC
LIMIT 20;
```

**Optimization checklist:**
- ✅ Proper indexes on WHERE clause columns
- ✅ Covering indexes when possible
- ✅ Avoid SELECT *
- ✅ Use LIMIT
- ✅ Avoid complex JOINs in hot paths

---

#### 14.4.2. Connection pooling

**Configuration:**

```python
# SQLAlchemy configuration
SQLALCHEMY_POOL_SIZE = 20          # Number of connections to maintain
SQLALCHEMY_MAX_OVERFLOW = 10       # Additional connections when pool full
SQLALCHEMY_POOL_TIMEOUT = 30       # Seconds to wait for connection
SQLALCHEMY_POOL_RECYCLE = 3600     # Recycle connections after 1 hour
SQLALCHEMY_POOL_PRE_PING = True    # Check connection health before use
```

---

#### 14.4.3. Read replicas

**Master-slave replication:**

```python
# Write to master
@app.route('/api/v1/bookings', methods=['POST'])
def create_booking():
    # Use master for writes
    booking = Booking.create(**data)
    db_master.session.commit()
    return booking

# Read from replica
@app.route('/api/v1/bookings', methods=['GET'])
def list_bookings():
    # Use replica for reads
    bookings = Booking.query.using_bind('replica').all()
    return bookings
```

---

### 14.5. Load testing scenarios

#### 14.5.1. Normal load (100 req/s)

**Test scenario:**

```python
from locust import HttpUser, task, between

class BookingUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def view_warehouses(self):
        self.client.get("/api/v1/warehouses")
    
    @task(2)
    def view_boxes(self):
        self.client.get("/api/v1/warehouses/101/boxes")
    
    @task(1)
    def create_booking(self):
        self.client.post("/api/v1/bookings", json={
            "warehouse_id": 101,
            "box_id": 501,
            "start_date": "2025-12-15",
            "duration_months": 6,
            "user_name": "Test User",
            "user_phone": "+971501234567"
        })
```

**Expected performance:**
- Response time (p95): < 500ms
- Error rate: < 1%
- CPU usage: < 60%
- Memory usage: < 70%

---

#### 14.5.2. Peak load (1000 req/s)

**Preparation:**
- Scale horizontally (add more app servers)
- Enable caching aggressively
- Use read replicas
- Queue non-critical tasks

**Expected performance:**
- Response time (p95): < 1000ms
- Error rate: < 3%
- Some degradation acceptable

---

#### 14.5.3. Stress testing

**Goal:** Find breaking point

```bash
# Locust command
locust -f load_test.py --host=https://api.storagecompare.ae --users=5000 --spawn-rate=100
```

**Monitor:**
- Database connection pool exhaustion
- Memory leaks
- CPU saturation
- Network bandwidth

---

## 15. Compliance, юридические требования

### 15.1. Согласие на обработку данных

#### 15.1.1. GDPR compliance

**Article 6 - Lawfulness of processing:**

- User must give explicit consent for data processing
- Consent must be freely given, specific, informed
- Must be able to withdraw consent

**Implementation:**

```html
<form id="booking-form">
    <!-- ... form fields ... -->
    
    <label>
        <input type="checkbox" name="terms_accepted" required />
        Я согласен с 
        <a href="/privacy-policy" target="_blank">политикой конфиденциальности</a>
        и даю согласие на обработку персональных данных
    </label>
    
    <label>
        <input type="checkbox" name="marketing_consent" />
        Я согласен получать маркетинговые сообщения (необязательно)
    </label>
</form>
```

```python
# Store consent
booking.consent_given = True
booking.consent_timestamp = datetime.utcnow()
booking.consent_ip = request.remote_addr
booking.marketing_consent = data.get('marketing_consent', False)
```

---

#### 15.1.2. ФЗ-152 (РФ)

**Federal Law No. 152-FZ "On Personal Data":**

**Requirements:**
1. Explicit consent for processing
2. Purpose specification
3. Data minimization
4. Security measures
5. Data localization (data must be stored in Russia)

**Consent text (Russian):**

```
Настоящим я, _______________, даю свое согласие Оператору на обработку 
моих персональных данных (ФИО, телефон, email, адрес) в целях:
- Оформления договора аренды складского помещения
- Связи со мной по вопросам аренды
- Выполнения обязательств по договору

Я проинформирован о праве отозвать согласие путём направления 
письменного заявления Оператору.
```

---

#### 15.1.3. Explicit consent checkbox

**Required UI element:**

```html
<div class="consent-block">
    <input 
        type="checkbox" 
        id="terms-accepted" 
        name="terms_accepted" 
        required 
        aria-required="true"
    />
    <label for="terms-accepted">
        <strong>Обязательно:</strong>
        Я прочитал и согласен с 
        <a href="/terms" target="_blank">условиями использования</a>,
        <a href="/privacy" target="_blank">политикой конфиденциальности</a>
        и даю согласие на обработку моих персональных данных
        в соответствии с <a href="/personal-data-policy" target="_blank">политикой обработки персональных данных</a>
    </label>
</div>
```

**Backend validation:**

```python
if not data.get('terms_accepted'):
    return error_response(
        'Необходимо принять условия использования и дать согласие на обработку данных',
        400
    )
```

---

#### 15.1.4. Privacy policy link

**Required document links:**

- `/privacy-policy` - Privacy Policy
- `/terms-of-service` - Terms of Service
- `/personal-data-policy` - Personal Data Processing Policy (РФ)
- `/cookie-policy` - Cookie Policy

**Each document must include:**
- What data we collect
- Why we collect it
- How we use it
- Who we share it with
- How to request deletion
- How to contact us

---

### 15.2. Логирование персональных данных

#### 15.2.1. Что логируется

**Logged personal data:**

| Data Type | Logged | Retention | Purpose |
|-----------|--------|-----------|---------|
| Name | ✅ | 5 years | Contract, audit |
| Phone | ✅ | 5 years | Contract, communication |
| Email | ✅ | 5 years | Contract, communication |
| IP address | ✅ | 1 year | Security, fraud |
| User agent | ✅ | 1 year | Security, fraud |
| Passwords | ❌ Never | - | - |
| Payment details | ❌ | - | Handled by payment provider |

---

#### 15.2.2. Retention policy

**Data retention periods:**

```python
RETENTION_PERIODS = {
    'active_bookings': None,  # Keep forever while active
    'completed_bookings': timedelta(days=365 * 5),  # 5 years
    'rejected_bookings': timedelta(days=365 * 2),  # 2 years
    'cancelled_bookings': timedelta(days=365 * 2),  # 2 years
    'expired_bookings': timedelta(days=365),  # 1 year
    'audit_logs': timedelta(days=365 * 7),  # 7 years (legal requirement)
    'error_logs': timedelta(days=90),  # 90 days
    'access_logs': timedelta(days=365),  # 1 year
}

@celery.beat.schedule(crontab(hour=3, minute=0))  # Run daily at 3 AM
def cleanup_old_data():
    # Delete expired bookings older than retention period
    cutoff = datetime.utcnow() - RETENTION_PERIODS['expired_bookings']
    
    Booking.query.filter(
        Booking.status == 'expired',
        Booking.updated_at < cutoff
    ).delete()
    
    db.session.commit()
```

---

#### 15.2.3. Access control

**Who can access personal data:**

| Role | Access Level | Restrictions |
|------|--------------|--------------|
| User | Own data only | Read, update own bookings |
| Operator | Assigned bookings | Read, process assigned bookings |
| Admin | All data | Full access, logged |
| System | Technical access | Automated processes only |

**Audit logging:**

```python
def log_personal_data_access(
    accessor_id: int,
    accessor_role: str,
    data_type: str,
    data_owner_id: int,
    action: str  # 'read', 'update', 'delete'
):
    PersonalDataAccessLog.create(
        accessor_id=accessor_id,
        accessor_role=accessor_role,
        data_type=data_type,
        data_owner_id=data_owner_id,
        action=action,
        timestamp=datetime.utcnow(),
        ip_address=request.remote_addr
    )
```

---

#### 15.2.4. Encryption at rest

**Database encryption:**

```python
from cryptography.fernet import Fernet

# Generate key (store securely, not in code!)
ENCRYPTION_KEY = os.environ['ENCRYPTION_KEY']
cipher = Fernet(ENCRYPTION_KEY)

# Encrypt sensitive fields
def encrypt_field(value: str) -> str:
    if not value:
        return None
    return cipher.encrypt(value.encode()).decode()

def decrypt_field(encrypted: str) -> str:
    if not encrypted:
        return None
    return cipher.decrypt(encrypted.encode()).decode()

# Use in model
class Booking(Base):
    _user_phone_encrypted = Column('user_phone', String)
    
    @property
    def user_phone(self):
        return decrypt_field(self._user_phone_encrypted)
    
    @user_phone.setter
    def user_phone(self, value):
        self._user_phone_encrypted = encrypt_field(value)
```

---

### 15.3. Условия использования

#### 15.3.1. Terms of Service acceptance

**Required at booking creation:**

```python
if not data.get('terms_accepted'):
    return error_response({
        'code': 'terms_not_accepted',
        'message': 'Необходимо принять условия использования',
        'terms_url': 'https://storagecompare.ae/terms'
    }, 400)

# Log acceptance
booking.terms_accepted = True
booking.terms_accepted_at = datetime.utcnow()
booking.terms_version = get_current_terms_version()  # Track version
```

---

#### 15.3.2. Cancellation policy

**User rights:**

- Can cancel booking before approval: FREE
- After approval, before move-in: Lose deposit
- After move-in: Subject to contract terms

**Terms text:**

```
УСЛОВИЯ ОТМЕНЫ БРОНИРОВАНИЯ

1. До подтверждения оператором
   - Отмена бесплатна
   - Без штрафов

2. После подтверждения, до въезда
   - Возврат 50% оплаты
   - Залог не возвращается

3. После въезда
   - Досрочное расторжение: уведомление за 30 дней
   - Залог возвращается при освобождении бокса
```

---

#### 15.3.3. Refund policy

```python
def calculate_refund(booking: Booking) -> dict:
    """
    Calculates refund amount based on cancellation policy.
    """
    if booking.status in ['new', 'in_progress', 'contacted']:
        # Before approval - full refund
        return {
            'refund_amount': 0,  # Nothing paid yet
            'refund_percent': 100
        }
    
    elif booking.status == 'approved' and not booking.move_in_date:
        # After approval, before move-in
        return {
            'refund_amount': booking.total_price * 0.5,
            'refund_percent': 50,
            'deposit_refunded': False
        }
    
    elif booking.move_in_date:
        # After move-in - pro-rata refund
        days_used = (datetime.now().date() - booking.move_in_date).days
        days_total = (booking.end_date - booking.start_date).days
        days_remaining = days_total - days_used
        
        refund_amount = (days_remaining / days_total) * booking.total_price
        
        return {
            'refund_amount': max(0, refund_amount),
            'refund_percent': (days_remaining / days_total) * 100,
            'deposit_refunded': True
        }
```

---

### 15.4. Договор аренды (v2)

(v2 feature - beyond MVP scope)

---

### 15.5. Data subject rights

#### 15.5.1. Right to access

**User can request all their data:**

```python
@app.route('/api/v1/user/data-export', methods=['GET'])
@require_auth
def export_user_data():
    """
    GDPR Article 15 - Right of access
    """
    user_data = {
        'profile': current_user.to_dict(),
        'bookings': [b.to_dict() for b in current_user.bookings],
        'comments': [c.to_dict() for c in current_user.comments],
        'notifications': [n.to_dict() for n in current_user.notifications],
        'consent_history': current_user.get_consent_history()
    }
    
    # Generate downloadable file
    filename = f"user_data_{current_user.id}_{datetime.now().isoformat()}.json"
    
    return send_file(
        io.BytesIO(json.dumps(user_data, indent=2).encode()),
        mimetype='application/json',
        as_attachment=True,
        download_name=filename
    )
```

---

#### 15.5.2. Right to deletion

**User can request data deletion:**

```python
@app.route('/api/v1/user/delete-account', methods=['POST'])
@require_auth
def delete_user_account():
    """
    GDPR Article 17 - Right to erasure ("right to be forgotten")
    """
    # Cannot delete if active bookings
    active_bookings = Booking.query.filter(
        Booking.user_id == current_user.id,
        Booking.status.in_(['approved', 'active', 'payment_pending'])
    ).count()
    
    if active_bookings > 0:
        return error_response(
            'Невозможно удалить аккаунт с активными бронированиями',
            400
        )
    
    # Anonymize data (soft delete)
    current_user.is_deleted = True
    current_user.deleted_at = datetime.utcnow()
    current_user.email = f"deleted_{current_user.id}@anonymous.local"
    current_user.phone = None
    current_user.full_name = "Deleted User"
    
    # Keep bookings for legal/financial records but anonymize
    Booking.query.filter(Booking.user_id == current_user.id).update({
        'user_email': None,
        'user_phone': 'deleted'
    })
    
    current_user.save()
    
    return {'success': True, 'message': 'Аккаунт удалён'}
```

---

#### 15.5.3. Right to rectification

**User can update their data:**

```python
@app.route('/api/v1/user/profile', methods=['PATCH'])
@require_auth
def update_user_profile():
    """
    GDPR Article 16 - Right to rectification
    """
    data = request.get_json()
    
    # Update allowed fields
    if 'full_name' in data:
        current_user.full_name = data['full_name']
    
    if 'email' in data:
        # Require email verification
        if not verify_email_ownership(data['email']):
            return error_response('Email verification required', 400)
        current_user.email = data['email']
    
    if 'phone' in data:
        # Require phone verification
        if not verify_phone_ownership(data['phone']):
            return error_response('Phone verification required', 400)
        current_user.phone = data['phone']
    
    current_user.save()
    
    return {'success': True, 'user': current_user.to_dict()}
```

---

#### 15.5.4. Data portability

**User can export data in machine-readable format:**

```python
@app.route('/api/v1/user/data-export', methods=['GET'])
@require_auth
def export_data_portable():
    """
    GDPR Article 20 - Right to data portability
    """
    format = request.args.get('format', 'json')  # json, csv, xml
    
    data = collect_user_data(current_user.id)
    
    if format == 'json':
        return jsonify(data)
    elif format == 'csv':
        return generate_csv(data)
    elif format == 'xml':
        return generate_xml(data)
```

---

## 16. Ограничения MVP и Roadmap

### 16.1. Что делаем в MVP

**Core functionality (Must Have):**

✅ **User Flow:**
1. Browse warehouses and boxes
2. Fill booking form
3. Submit booking request
4. Receive confirmation email/SMS
5. Track booking status
6. View booking history

✅ **Operator Flow:**
1. View incoming booking requests
2. See lead score and priority
3. Contact customer
4. Approve or reject booking
5. Add internal notes
6. Receive notifications

✅ **System Features:**
1. Basic booking API
2. Status management (7 statuses)
3. Email + SMS notifications
4. Lead scoring (basic algorithm)
5. Rate limiting
6. Basic fraud detection
7. Operator dashboard
8. User dashboard

**Technical Stack (MVP):**
- Backend: Python/FastAPI or Node.js
- Database: PostgreSQL
- Cache: Redis
- Queue: Celery/Redis Queue
- Email: SendGrid
- SMS: Twilio

---

### 16.2. Что добавляем в v1.1

**Improvements (4-6 months after MVP):**

✅ **Hard Reservation System:**
- 15-minute timer when user starts booking
- Real-time availability check
- Conflict prevention

✅ **Enhanced Notifications:**
- Automatic operator reminders (4h, 12h, 24h)
- More templates
- In-app notifications
- Telegram bot integration

✅ **Advanced Lead Scoring:**
- ML-based model (trained on historical data)
- More factors (20+ signals)
- Real-time score updates

✅ **Bulk Operations:**
- Approve multiple bookings at once
- Reassign multiple bookings
- Export to CSV/Excel

✅ **Enhanced Operator Dashboard:**
- Advanced filters
- Custom views
- Performance metrics
- Analytics

✅ **Booking Extensions:**
- User can request extension
- Operator can approve extension
- Price recalculation

---

### 16.3. Что появится в v2+

**Major Features (7-12 months):**

✅ **Online Payment Integration:**
- Stripe / Tinkoff
- Card payments
- Instant booking after payment
- Automated receipts (54-ФЗ)

✅ **Instant Booking (No Operator):**
- Warehouses can enable auto-approval
- Immediate confirmation
- Payment within 24 hours
- Automated contract generation

✅ **Dynamic Pricing:**
- AI-powered price suggestions
- Seasonal adjustments
- Demand-based pricing
- Competitor analysis

✅ **Advanced AI Features:**
- AI chatbot for customer support
- Automated fraud detection with auto-block
- Predictive maintenance alerts
- Revenue optimization

✅ **Mobile Applications:**
- Native iOS app
- Native Android app
- Push notifications
- Mobile-optimized booking flow

✅ **Multi-Language Support:**
- English interface
- Internationalization (i18n)
- Multi-currency support

✅ **Loyalty Program:**
- Points for bookings
- Referral bonuses
- Tier system (Bronze, Silver, Gold)
- Exclusive discounts

✅ **IoT Integration:**
- Smart locks on boxes
- Remote access control
- Occupancy sensors
- Climate monitoring

---

### 16.4. Known limitations MVP

**Technical Limitations:**

❌ **No online payment** - Manual payment processing  
❌ **No instant booking** - Requires operator confirmation  
❌ **Soft reservation only** - Multiple users can request same box  
❌ **Basic AI** - Rule-based, not ML  
❌ **Single language** - Russian only  
❌ **No mobile apps** - Responsive web only  
❌ **Limited analytics** - Basic metrics only  
❌ **Manual processes** - Many operator tasks are manual  

**Business Limitations:**

❌ **High operator dependency** - Every booking needs manual review  
❌ **Slow response time** - Up to 24-48 hours  
❌ **Risk of double booking** - Soft reservation only  
❌ **No recurring payments** - Monthly payments are manual  
❌ **Limited scalability** - Operator bottleneck  

---

### 16.5. Technical debt

**Planned refactoring (v1.1+):**

1. **Microservices architecture**
   - Split monolith into services
   - Notification service
   - Payment service
   - AI service

2. **Event-driven architecture**
   - Event sourcing for bookings
   - CQRS pattern
   - Kafka/RabbitMQ

3. **Performance optimization**
   - Database sharding
   - Read replicas
   - CDN for static assets
   - GraphQL API

4. **Security hardening**
   - OAuth 2.0 / OpenID Connect
   - API rate limiting per user
   - DDoS protection
   - Penetration testing

5. **DevOps improvements**
   - Kubernetes deployment
   - CI/CD pipeline
   - Blue-green deployments
   - Automated testing (>80% coverage)

---

## Relationship to Canonical Documentation

This document is derived from canonical platform specifications and is
intended to support understanding of booking-related business flows.

It must be used together with canonical documents and should not be
treated as a source of truth for implementation decisions.

---

**🎉 END OF DOCUMENT 🎉**

---

**Document Summary:**
- **16 Major Sections** ✅
- **~350 Subsections** ✅
- **Complete Technical Specification** ✅
- **MVP → v2 Roadmap** ✅
- **Production-Ready** ✅

---
