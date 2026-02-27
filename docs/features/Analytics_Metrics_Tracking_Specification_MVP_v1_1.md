# Analytics, Metrics & Tracking Specification

## MVP v1.1 | Self-Storage Aggregator Platform

---

**Document Version:** 1.1  
**Date:** December 2025  
**Status:** GREEN — Final Approved for Implementation  
**Author:** Product & Engineering Team  
**Related Documents:** 
- DOC-002: Technical Architecture Document
- DOC-086: Monitoring & Observability Plan
- DOC-071: Security & Compliance Plan
- DOC-036: Data Retention & Privacy Policy
- DOC-003: A/B Testing & Experimentation Framework

---

## Document Scope & Architecture Alignment

### Purpose
This document specifies the analytics, metrics, and tracking infrastructure for the Self-Storage Aggregator Platform MVP v1. It defines:
- Product, business, and AI metrics to measure platform success
- Frontend and backend event tracking schemas
- Data storage and retention strategies
- A/B testing framework integration
- Dashboard and reporting requirements

### Architecture Context
This specification is subordinate to and aligned with:

**Primary Architecture Documents:**
- **DOC-002: Technical Architecture Document** — Defines the overall system architecture, service boundaries, and data flow patterns. All analytics components must align with the layered architecture (Frontend → API Gateway → Backend Services → Data Layer) and respect service responsibilities defined in DOC-002.
- **DOC-086: Monitoring & Observability Plan** — Defines system-level monitoring, logging, and alerting infrastructure. This analytics specification complements DOC-086 by focusing on product and business metrics, while DOC-086 focuses on operational health and system performance.

**Supporting Documents:**
- **DOC-071: Security & Compliance Plan** — Governs data privacy, PII handling, and compliance requirements (GDPR, CCPA). All analytics events must respect privacy constraints and data anonymization rules defined in DOC-071.
- **DOC-036: Data Retention & Privacy Policy** — Defines retention periods for analytics data, user consent management, and data deletion procedures. Analytics storage strategies in Section 4 must comply with retention policies in DOC-036.
- **DOC-003: A/B Testing & Experimentation Framework** — Provides the complete architecture for experimentation, including variant assignment, statistical testing, and experiment lifecycle management. Section 7 of this document focuses only on the analytics and tracking aspects of A/B testing.

### Scope Boundaries

**In Scope (MVP v1):**
- Product, business, and AI metrics definitions
- Frontend event tracking via Google Analytics 4 (GA4)
- Backend event tracking via PostgreSQL `analytics_events` table
- Basic dashboards using GA4, Grafana, and Metabase
- Event naming conventions and data schemas
- MVP-level data storage (GA4 + PostgreSQL)

**Out of Scope (Post-MVP):**
- Advanced OLAP analytics (ClickHouse)
- Data lake architecture (BigQuery)
- Real-time streaming analytics (Kafka)
- Advanced machine learning on analytics data
- Custom attribution modeling
- Cross-device tracking beyond GA4 capabilities

### Key Principles
1. **Privacy First:** All analytics must respect user privacy and comply with DOC-071 and DOC-036
2. **Consistency:** Event naming and schemas must be consistent across frontend and backend
3. **Actionability:** Metrics must be actionable and tied to business or product decisions
4. **Simplicity:** MVP focuses on essential metrics and avoids over-instrumentation
5. **Scalability:** Architecture designed to scale to post-MVP OLAP solutions (ClickHouse, BigQuery)

---

## Table of Contents

1. [Platform Metrics](#1-platform-metrics)
   - 1.1. [Product Metrics](#11-product-metrics)
   - 1.2. [Business Metrics](#12-business-metrics)
   - 1.3. [AI Metrics](#13-ai-metrics)
2. [Frontend Events (Frontend Tracking)](#2-frontend-events-frontend-tracking)
   - 2.1. [Navigation Events](#21-navigation-events)
   - 2.2. [Search Events](#22-search-events)
   - 2.3. [Booking Events](#23-booking-events)
   - 2.4. [User Actions](#24-user-actions)
   - 2.5. [Frontend Event Data Schema](#25-frontend-event-data-schema)
3. [Backend Events](#3-backend-events)
   - 3.1. [Business Events](#31-business-events)
   - 3.2. [System Events](#32-system-events)
   - 3.3. [AI Events](#33-ai-events)
   - 3.4. [Backend Event Data Schema](#34-backend-event-data-schema)
4. [Analytics Storage](#4-analytics-storage)
   - 4.1. [Data Sources](#41-data-sources)
   - 4.2. [MVP Storage](#42-mvp-storage)
   - 4.3. [Backup Storage](#43-backup-storage)
   - 4.4. [Data Flow Architecture](#44-data-flow-architecture)
5. [Naming Conventions](#5-naming-conventions)
   - 5.1. [Формат именования](#51-формат-именования)
   - 5.2. [Категории событий](#52-категории-событий)
   - 5.3. [Полный реестр событий](#53-полный-реестр-событий)
   - 5.4. [Антипаттерны](#54-антипаттерны)
6. [Схемы данных событий](#6-схемы-данных-событий)
   - 6.1. [Базовая структура события](#61-базовая-структура-события)
   - 6.2. [Обязательные и опциональные поля](#62-обязательные-и-опциональные-поля)
   - 6.3. [Примеры событий по категориям](#63-примеры-событий-по-категориям)
   - 6.4. [Валидация событий](#64-валидация-событий)
7. [A/B Testing Framework](#7-ab-testing-framework)
   - 7.1. [Архитектура системы](#71-архитектура-системы)
   - 7.2. [Сегментация пользователей](#72-сегментация-пользователей)
   - 7.3. [Feature Flags](#73-feature-flags)
   - 7.4. [Измеряемые метрики](#74-измеряемые-метрики)
   - 7.5. [Статистическая значимость](#75-статистическая-значимость)
8. [Dashboard Requirements](#8-dashboard-requirements)
   - 8.1. [Дашборды для продакт-менеджера](#81-дашборды-для-продакт-менеджера)
   - 8.2. [Дашборды для операторов](#82-дашборды-для-операторов)
   - 8.3. [Технические дашборды](#83-технические-дашборды)
   - 8.4. [Инструменты и платформы](#84-инструменты-и-платформы)
- [Приложения](#приложения)
   - A. [Полный реестр событий](#приложение-a-полный-реестр-событий)
   - B. [Mapping к GA4](#приложение-b-mapping-к-ga4)
   - C. [Checklist интеграции](#приложение-c-checklist-интеграции)

---

## 1. Метрики платформы

Данный раздел описывает ключевые метрики для оценки эффективности платформы: продуктовые, бизнесовые и AI-метрики.

### 1.1. Продуктовые метрики

Продуктовые метрики отражают вовлечённость пользователей и эффективность ключевых сценариев использования платформы.

#### 1.1.1. Активность пользователей (DAU / MAU)

| Метрика | Описание | Формула | Целевое значение (MVP) |
|---------|----------|---------|------------------------|
| **DAU** | Уникальные пользователи за день | `COUNT(DISTINCT user_id) WHERE date = today` | > 100 |
| **MAU** | Уникальные пользователи за месяц | `COUNT(DISTINCT user_id) WHERE date >= today - 30` | > 1,000 |
| **DAU/MAU Ratio** | Стикинес платформы | `DAU / MAU * 100%` | > 10% |
| **WAU** | Уникальные пользователи за неделю | `COUNT(DISTINCT user_id) WHERE date >= today - 7` | > 300 |

**Сегментация DAU/MAU:**

```
DAU_by_role:
  - users (seekers): COUNT(DISTINCT user_id WHERE role = 'user')
  - operators: COUNT(DISTINCT user_id WHERE role = 'operator')
  - admins: COUNT(DISTINCT user_id WHERE role = 'admin')
```

#### 1.1.2. Конверсионная воронка

Главная конверсионная воронка платформы:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSION FUNNEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │   Search     │  100%  ─────────────────────────────────────  │
│  │  (page_view) │                                               │
│  └──────┬───────┘                                               │
│         │ 60% ▼                                                 │
│  ┌──────────────┐                                               │
│  │  Warehouse   │  60%  ──────────────────────────────────────  │
│  │    View      │                                               │
│  └──────┬───────┘                                               │
│         │ 40% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Box View   │  24%  ──────────────────────────────────────  │
│  │              │                                               │
│  └──────┬───────┘                                               │
│         │ 25% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Booking    │  6%   ──────────────────────────────────────  │
│  │   Request    │                                               │
│  └──────┬───────┘                                               │
│         │ 70% ▼                                                 │
│  ┌──────────────┐                                               │
│  │   Booking    │  4.2%  ─────────────────────────────────────  │
│  │  Confirmed   │                                               │
│  └──────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Этап | Событие | Целевая конверсия (MVP) |
|------|---------|-------------------------|
| Search → Warehouse View | `search_result_click` | 60% |
| Warehouse View → Box View | `box_open` | 40% |
| Box View → Booking Start | `booking_start` | 25% |
| Booking Start → Booking Submit | `booking_submit` | 70% |
| Booking Submit → Confirmed | `booking_confirmed` (backend) | 80% |
| **Overall: Search → Confirmed** | — | **3-5%** |

#### 1.1.3. Retention-метрики

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **D1 Retention** | Вернулись на следующий день | `Users(day N+1) / Users(day N) * 100%` | > 20% |
| **D7 Retention** | Вернулись через неделю | `Users(day N+7) / Users(day N) * 100%` | > 10% |
| **D30 Retention** | Вернулись через месяц | `Users(day N+30) / Users(day N) * 100%` | > 5% |

**Retention по когортам:**

```sql
-- Пример SQL для расчёта retention когорт
SELECT 
  DATE_TRUNC('week', first_visit_date) AS cohort_week,
  COUNT(DISTINCT CASE WHEN days_since_first = 0 THEN user_id END) AS d0,
  COUNT(DISTINCT CASE WHEN days_since_first = 1 THEN user_id END) AS d1,
  COUNT(DISTINCT CASE WHEN days_since_first = 7 THEN user_id END) AS d7,
  COUNT(DISTINCT CASE WHEN days_since_first = 30 THEN user_id END) AS d30
FROM user_activity_cohorts
GROUP BY cohort_week
ORDER BY cohort_week DESC;
```

#### 1.1.4. Operator Activation Rate

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Registration → First Warehouse** | Оператор добавил первый склад | `Operators(≥1 warehouse) / Registered Operators` | > 70% |
| **First Warehouse → First Box** | Оператор добавил первый бокс | `Operators(≥1 box) / Operators(≥1 warehouse)` | > 90% |
| **First Box → First Request** | Получена первая заявка | `Operators(≥1 request) / Operators(≥1 box)` | > 50% |
| **Time to First Warehouse** | Медиана времени до добавления склада | `MEDIAN(time_to_first_warehouse)` | < 24 часа |
| **Time to First Request** | Медиана времени до первой заявки | `MEDIAN(time_to_first_request)` | < 7 дней |

#### 1.1.5. Поведенческие метрики

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Pages per Session** | Среднее количество страниц за сессию | `SUM(page_views) / COUNT(DISTINCT session_id)` | > 3 |
| **Session Duration** | Средняя длительность сессии | `AVG(session_end - session_start)` | > 3 минуты |
| **Bounce Rate** | Процент одностраничных сессий | `Sessions(page_count = 1) / Total Sessions * 100%` | < 40% |
| **Time on Page (Warehouse)** | Время на странице склада | `AVG(time_on_page) WHERE page_type = 'warehouse'` | > 2 минуты |
| **Search Depth** | Кол-во результатов поиска перед кликом | `AVG(results_viewed_before_click)` | < 10 |

---

### 1.2. Бизнес-метрики

Бизнес-метрики измеряют коммерческую эффективность платформы.

#### 1.2.1. Booking Metrics

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Total Bookings** | Общее количество бронирований | `COUNT(bookings)` | > 50/месяц (MVP) |
| **Confirmed Bookings** | Подтверждённые бронирования | `COUNT(bookings WHERE status = 'confirmed')` | > 40/месяц (MVP) |
| **Booking Confirmation Rate** | Процент подтверждения | `Confirmed / Total * 100%` | > 70% |
| **Cancelled Bookings** | Отменённые бронирования | `COUNT(bookings WHERE status = 'cancelled')` | < 10% |
| **Average Booking Value (ABV)** | Средняя стоимость брони | `SUM(booking_amount) / COUNT(bookings)` | > $100 |
| **Booking Lead Time** | Среднее время до въезда | `AVG(move_in_date - booking_created_at)` | 7-14 дней |

#### 1.2.2. Revenue Metrics

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Gross Booking Value (GBV)** | Общая стоимость бронирований | `SUM(booking_amount)` | > $10K/месяц |
| **Net Revenue** | Доход платформы (комиссия) | `SUM(platform_fee)` | > $1K/месяц |
| **Take Rate** | Процент комиссии | `Net Revenue / GBV * 100%` | 10-15% |
| **ARPU (User)** | Средний доход с пользователя | `Net Revenue / Active Users` | > $10 |
| **ARPU (Operator)** | Средний доход с оператора | `Net Revenue / Active Operators` | > $100 |

#### 1.2.3. Operator Metrics

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Active Operators** | Операторы с активными складами | `COUNT(DISTINCT operator_id WHERE warehouses > 0)` | > 20 (MVP) |
| **Warehouses per Operator** | Среднее количество складов | `AVG(warehouses_count)` | > 1.5 |
| **Boxes per Warehouse** | Среднее количество боксов | `AVG(boxes_count)` | > 20 |
| **Occupancy Rate** | Занятость боксов | `Booked Boxes / Total Boxes * 100%` | > 30% (MVP) |
| **Warehouse Fill Rate** | Процент заполненности склада | `AVG(occupancy_rate) GROUP BY warehouse` | > 50% (target) |
| **Operator Response Time** | Среднее время ответа на заявку | `AVG(response_time)` | < 24 часа |
| **Operator Acceptance Rate** | Процент принятых заявок | `Accepted / Total Requests * 100%` | > 80% |

#### 1.2.4. Supply & Demand

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Total Supply (Boxes)** | Общее количество боксов | `COUNT(boxes WHERE status = 'available')` | > 500 (MVP) |
| **Available Supply** | Доступные боксы | `COUNT(boxes WHERE status = 'available' AND NOT booked)` | > 300 |
| **Search Demand** | Количество поисков | `COUNT(search_events)` | > 1,000/месяц |
| **Supply Coverage** | Процент запросов с результатами | `Searches with results / Total Searches * 100%` | > 90% |
| **Unmet Demand** | Поиски без результатов | `COUNT(search_no_results)` | < 10% |

---

### 1.3. AI-метрики

AI-метрики измеряют эффективность AI-компонентов платформы (AI Search, Recommendations, Claude integration).

#### 1.3.1. AI Search Performance

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **AI Search Usage** | Процент поисков с AI | `AI Searches / Total Searches * 100%` | > 30% |
| **AI Search CTR** | Клики по AI-результатам | `Clicks on AI results / AI Search impressions * 100%` | > 15% |
| **AI Search Conversion** | Конверсия в бронирование | `Bookings from AI Search / AI Searches * 100%` | > 5% |
| **AI vs Non-AI CTR Lift** | Прирост CTR относительно обычного поиска | `(AI CTR - Non-AI CTR) / Non-AI CTR * 100%` | > +20% |
| **AI Search Latency** | Среднее время ответа AI | `AVG(ai_response_time)` | < 2 секунды |
| **AI Fallback Rate** | Процент ошибок AI → fallback | `AI Fallbacks / AI Requests * 100%` | < 5% |

#### 1.3.2. Recommendation Quality

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **Recommendation Impressions** | Показы рекомендаций | `COUNT(recommendation_shown)` | > 1,000/день |
| **Recommendation CTR** | Клики по рекомендациям | `Clicks / Impressions * 100%` | > 10% |
| **Recommendation Conversion** | Конверсия в бронирование | `Bookings from recommendations / Recommendation clicks * 100%` | > 8% |
| **Personalization Uplift** | Прирост относительно неперсонализированных | `(Personalized CTR - Random CTR) / Random CTR * 100%` | > +30% |

#### 1.3.3. AI System Health

| Метрика | Описание | Формула | Целевое значение |
|---------|----------|---------|------------------|
| **AI Request Volume** | Количество AI запросов | `COUNT(ai_requests)` | Мониторинг |
| **AI Success Rate** | Процент успешных ответов | `Successful AI requests / Total requests * 100%` | > 95% |
| **AI Error Rate** | Процент ошибок | `Failed AI requests / Total requests * 100%` | < 5% |
| **AI Response Time (p50)** | Медианное время ответа | `PERCENTILE(ai_response_time, 50)` | < 1 секунда |
| **AI Response Time (p95)** | 95-й перцентиль | `PERCENTILE(ai_response_time, 95)` | < 3 секунды |
| **AI Cost per Request** | Средняя стоимость запроса | `Total AI cost / Total requests` | < $0.01 |
| **AI Token Usage** | Среднее количество токенов | `AVG(tokens_used)` | Мониторинг |

---

## 2. События фронтенда (Frontend Tracking)

Фронтенд отслеживает действия пользователей через **Google Analytics 4 (GA4)** с использованием `gtag.js`.

### 2.1. Навигационные события

Навигационные события отслеживают перемещения пользователей по платформе.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **page_view** | Просмотр любой страницы | HIGH | `page_view` |
| **page_exit** | Уход со страницы (beforeunload) | LOW | Custom event |
| **search_open** | Открытие страницы поиска | HIGH | `view_search_results` |
| **map_open** | Открытие карты | MEDIUM | Custom event |
| **warehouse_open** | Открытие страницы склада | HIGH | `view_item` |
| **box_open** | Открытие страницы бокса | HIGH | `view_item` |

**Пример: page_view**

```javascript
gtag('event', 'page_view', {
  page_location: window.location.href,
  page_title: document.title,
  page_path: window.location.pathname,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Пример: warehouse_open**

```javascript
gtag('event', 'view_item', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    item_category2: warehouse.city,
    price: warehouse.min_price,
    quantity: 1
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.2. Поисковые события

Поисковые события отслеживают взаимодействие с поиском и фильтрами.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **search_apply_filters** | Применение фильтров | HIGH | `search` |
| **search_reset_filters** | Сброс фильтров | MEDIUM | Custom event |
| **search_result_click** | Клик по результату поиска | HIGH | `select_item` |
| **search_sort_change** | Изменение сортировки | MEDIUM | Custom event |
| **search_pagination** | Переход на следующую страницу | LOW | Custom event |
| **search_no_results** | Поиск не вернул результатов | MEDIUM | `search_no_results` |

**Пример: search_apply_filters**

```javascript
gtag('event', 'search', {
  search_term: searchQuery,
  filters: {
    city: selectedCity,
    box_size: selectedSize,
    price_range: [minPrice, maxPrice],
    amenities: selectedAmenities
  },
  results_count: resultsCount,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Пример: search_result_click**

```javascript
gtag('event', 'select_item', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    item_list_name: 'Search Results',
    index: clickPosition
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.3. События бронирования

События бронирования отслеживают весь путь от начала бронирования до финальной отправки заявки.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **booking_start** | Нажатие "Забронировать" | HIGH | `begin_checkout` |
| **booking_step_complete** | Завершение шага формы | MEDIUM | `checkout_progress` |
| **booking_submit** | Отправка заявки на бронирование | HIGH | `purchase` |
| **booking_success** | Успешная отправка (frontend confirmation) | HIGH | Custom event |
| **booking_error** | Ошибка при отправке | HIGH | Custom event |
| **booking_abandon** | Покидание формы без завершения | MEDIUM | `abandon_checkout` |

**Пример: booking_start**

```javascript
gtag('event', 'begin_checkout', {
  items: [{
    item_id: box.id,
    item_name: `Box ${box.size}`,
    item_category: 'storage_box',
    item_category2: warehouse.name,
    price: box.price_per_month,
    quantity: 1
  }],
  value: box.price_per_month,
  currency: 'USD',
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Пример: booking_submit**

```javascript
gtag('event', 'purchase', {
  transaction_id: bookingId,
  value: totalAmount,
  currency: 'USD',
  items: [{
    item_id: box.id,
    item_name: `Box ${box.size}`,
    item_category: 'storage_box',
    price: box.price_per_month,
    quantity: 1
  }],
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Пример: booking_error**

```javascript
gtag('event', 'booking_error', {
  error_message: error.message,
  error_code: error.code,
  booking_step: currentStep,
  box_id: box.id,
  user_id: currentUser?.id || null,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.4. Пользовательские действия

События, связанные с аутентификацией и персональными действиями пользователей.

| Event Name | Trigger | Priority | GA4 Mapping |
|------------|---------|----------|-------------|
| **auth_login** | Вход в систему | HIGH | `login` |
| **auth_signup** | Регистрация нового пользователя | HIGH | `sign_up` |
| **auth_logout** | Выход из системы | MEDIUM | Custom event |
| **auth_password_reset** | Запрос на сброс пароля | MEDIUM | Custom event |
| **user_favorite_add** | Добавление в избранное | MEDIUM | `add_to_wishlist` |
| **user_favorite_remove** | Удаление из избранного | LOW | `remove_from_wishlist` |
| **user_share_click** | Нажатие кнопки "Поделиться" | LOW | `share` |

**Пример: auth_login**

```javascript
gtag('event', 'login', {
  method: 'email', // or 'google', 'facebook'
  user_id: user.id,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

**Пример: user_favorite_add**

```javascript
gtag('event', 'add_to_wishlist', {
  items: [{
    item_id: warehouse.id,
    item_name: warehouse.name,
    item_category: 'warehouse',
    price: warehouse.min_price
  }],
  user_id: currentUser.id,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

---

### 2.5. Схема данных frontend-событий

#### 2.5.1. Базовая структура

Все frontend-события содержат следующую базовую структу:

```typescript
interface FrontendEvent {
  // Идентификаторы
  event_name: string;          // Имя события (e.g., "page_view")
  timestamp: string;           // ISO 8601 timestamp
  session_id: string;          // UUID сессии
  user_id?: string;            // UUID пользователя (если авторизован)
  
  // Контекст страницы
  page_location: string;       // Полный URL
  page_path: string;           // Путь (без домена)
  page_title: string;          // Заголовок страницы
  referrer?: string;           // Откуда пришёл
  
  // Устройство и браузер
  user_agent: string;          // User agent
  device_category: string;     // "desktop" | "mobile" | "tablet"
  browser: string;             // Название браузера
  os: string;                  // Операционная система
  screen_resolution: string;   // "1920x1080"
  viewport_size: string;       // "1440x900"
  
  // Геолокация (из IP, если доступно)
  country?: string;
  region?: string;
  city?: string;
  
  // Дополнительные параметры (специфичные для каждого события)
  [key: string]: any;
}
```

#### 2.5.2. Обязательные поля

| Поле | Обязательность | Примечание |
|------|----------------|------------|
| `event_name` | **Обязательное** | Имя события из реестра |
| `timestamp` | **Обязательное** | ISO 8601 формат |
| `session_id` | **Обязательное** | UUID сессии |
| `user_id` | Опциональное | Только для авторизованных |
| `page_location` | **Обязательное** | Полный URL |
| `page_path` | **Обязательное** | Путь страницы |
| `device_category` | **Обязательное** | desktop/mobile/tablet |

---

## 3. События backend

Backend-события отслеживаются через внутреннюю систему логирования и сохраняются в таблице `analytics_events` PostgreSQL.

**Compliance & Privacy Note:**  
All backend event logging must comply with **DOC-071: Security & Compliance Plan** regarding PII handling, data anonymization, and user consent. Events must respect the retention policies defined in **DOC-036: Data Retention & Privacy Policy**.

### 3.1. Бизнес-события

Бизнес-события отражают ключевые действия пользователей и операторов, связанные с бронированиями, складами и отзывами.

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **booking_created** | Создание нового бронирования | PG + CH | HIGH |
| **booking_status_changed** | Изменение статуса бронирования | PG + CH | HIGH |
| **booking_cancelled** | Отмена бронирования | PG + CH | HIGH |
| **booking_completed** | Завершение бронирования | PG + CH | MEDIUM |
| **warehouse_created** | Добавление нового склада | PG | MEDIUM |
| **warehouse_updated** | Обновление информации о складе | PG | LOW |
| **warehouse_published** | Публикация склада | PG + CH | HIGH |
| **box_price_changed** | Изменение цены бокса | PG + CH | MEDIUM |
| **review_submitted** | Новый отзыв | PG | MEDIUM |

**Пример: booking_created**

```json
{
  "event_name": "booking_created",
  "event_category": "business",
  "timestamp": "2025-12-16T10:30:00Z",
  "user_id": "usr_abc123",
  "session_id": "sess_xyz789",
  "data": {
    "booking_id": "bkg_123456",
    "box_id": "box_789",
    "warehouse_id": "wh_456",
    "operator_id": "op_123",
    "move_in_date": "2025-12-20",
    "duration_months": 3,
    "amount": 150.00,
    "currency": "USD",
    "status": "pending_confirmation"
  }
}
```

**Пример: booking_status_changed**

```json
{
  "event_name": "booking_status_changed",
  "event_category": "business",
  "timestamp": "2025-12-16T11:00:00Z",
  "user_id": "usr_abc123",
  "operator_id": "op_123",
  "data": {
    "booking_id": "bkg_123456",
    "old_status": "pending_confirmation",
    "new_status": "confirmed",
    "changed_by": "operator",
    "notes": "Confirmed by operator"
  }
}
```

---

### 3.2. Системные события

Системные события отслеживают техническую работу платформы: API запросы, ошибки, rate limiting, performance.

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **api_request** | Любой API запрос | CH | LOW |
| **api_error_4xx** | Ошибка клиента (400-499) | CH | MEDIUM |
| **api_error_5xx** | Ошибка сервера (500-599) | CH | HIGH |
| **rate_limit_exceeded** | Превышен rate limit | CH | HIGH |
| **db_query_slow** | Медленный DB запрос (>1s) | Logs | HIGH |

**Пример: api_request**

```json
{
  "event_name": "api_request",
  "event_category": "system",
  "timestamp": "2025-12-16T10:30:00Z",
  "data": {
    "method": "POST",
    "endpoint": "/api/v1/bookings",
    "status_code": 201,
    "response_time_ms": 342,
    "user_id": "usr_abc123",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "request_id": "req_xyz789"
  }
}
```

**Пример: api_error_5xx**

```json
{
  "event_name": "api_error_5xx",
  "event_category": "system",
  "timestamp": "2025-12-16T10:35:00Z",
  "data": {
    "method": "GET",
    "endpoint": "/api/v1/warehouses/{id}",
    "status_code": 500,
    "error_message": "Database connection timeout",
    "error_code": "DB_TIMEOUT",
    "request_id": "req_abc456",
    "user_id": "usr_abc123",
    "stack_trace": "..."
  }
}
```

---

### 3.3. AI-события

AI-события отслеживают взаимодействие с AI-компонентами платформы (AI Search, Claude API, Recommendations).

| Event Name | Trigger | Storage | Priority |
|------------|---------|---------|----------|
| **ai_request_sent** | Отправка запроса в AI | CH | MEDIUM |
| **ai_response_received** | Успешный ответ от AI | CH | MEDIUM |
| **ai_response_failed** | Ошибка AI запроса | CH | HIGH |
| **ai_fallback_used** | Использован fallback (non-AI) | CH | MEDIUM |

**Пример: ai_request_sent**

```json
{
  "event_name": "ai_request_sent",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:00Z",
  "data": {
    "ai_provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "request_type": "search",
    "user_query": "looking for climate controlled storage near downtown",
    "user_id": "usr_abc123",
    "session_id": "sess_xyz789",
    "request_id": "ai_req_123"
  }
}
```

**Pример: ai_response_received**

```json
{
  "event_name": "ai_response_received",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:02Z",
  "data": {
    "request_id": "ai_req_123",
    "response_time_ms": 1842,
    "tokens_used": 450,
    "results_count": 5,
    "cost_usd": 0.008,
    "success": true
  }
}
```

---

### 3.4. Схема данных backend-событий

#### 3.4.1. Таблица analytics_events

Backend-события сохраняются в таблицу `analytics_events` в PostgreSQL.

```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,  -- 'business', 'system', 'ai'
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Идентификаторы
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    request_id VARCHAR(100),
    
    -- Данные события (JSONB для гибкости)
    data JSONB NOT NULL,
    
    -- Метаданные
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Индексы
    INDEX idx_event_name (event_name),
    INDEX idx_event_category (event_category),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_data_gin (data USING GIN)
);
```

**Data Retention:**  
Analytics events must be retained according to **DOC-036: Data Retention & Privacy Policy**. MVP retention period: 13 months in PostgreSQL, with potential archival to S3 for longer-term storage.

#### 3.4.2. Обязательные поля

| Поле | Тип | Обязательность | Примечание |
|------|-----|----------------|------------|
| `event_name` | VARCHAR(100) | **Обязательное** | Имя события из реестра |
| `event_category` | VARCHAR(50) | **Обязательное** | business / system / ai |
| `timestamp` | TIMESTAMPTZ | **Обязательное** | Время события |
| `data` | JSONB | **Обязательное** | Полезная нагрузка |
| `user_id` | UUID | Опциональное | Если применимо |
| `session_id` | VARCHAR(100) | Опциональное | Если доступно |

#### 3.4.3. Пример записи события

```javascript
// Backend service (TypeScript/Node.js)
import { analyticsService } from './services/analytics';

analyticsService.trackEvent({
  event_name: 'booking_created',
  event_category: 'business',
  timestamp: new Date().toISOString(),
  user_id: userId,
  session_id: sessionId,
  data: {
    booking_id: booking.id,
    box_id: booking.box_id,
    warehouse_id: booking.warehouse_id,
    operator_id: booking.operator_id,
    move_in_date: booking.move_in_date,
    duration_months: booking.duration_months,
    amount: booking.total_amount,
    currency: 'USD',
    status: booking.status
  }
});
```

---

## 4. Хранение аналитики

### 4.1. Источники данных

Платформа собирает аналитические данные из трёх основных источников:

| Источник | Тип данных | Инструмент | Применение |
|----------|------------|------------|------------|
| **Frontend Events** | Пользовательские действия | Google Analytics 4 | Продуктовая аналитика, конверсии |
| **Backend Events** | Бизнес-события, системные метрики | PostgreSQL `analytics_events` | Бизнес-метрики, операционные данные |
| **System Logs** | Технические логи, errors | Grafana Loki | Системный мониторинг, debugging |

---

### 4.2. MVP-хранилище

**MVP v1 Storage Strategy:**

Для MVP используется упрощённая архитектура хранения без сложных OLAP-решений.

#### 4.2.1. Google Analytics 4 (GA4) — MVP Solution

**Назначение:** Хранение и анализ frontend-событий  
**Retention:** 14 месяцев (бесплатный tier)  
**Преимущества:**
- Бесплатно до 10M событий/месяц
- Готовые дашборды и отчёты
- Интеграция с Google Ads, Search Console
- Автоматическая обработка user journeys
- Real-time reporting

**Используется для MVP v1:**
- ✅ Продуктовая аналитика (DAU/MAU, retention, funnels)
- ✅ Поведенческие метрики (bounce rate, session duration)
- ✅ Конверсионная воронка (search → booking)
- ✅ A/B testing (experiment tracking)

**Limitations (решается post-MVP):**
- ❌ Ограниченная кастомизация отчётов
- ❌ Нет доступа к raw data (только aggregated)
- ❌ Не подходит для real-time operational analytics

---

#### 4.2.2. PostgreSQL analytics_events — MVP Solution

**Назначение:** Хранение backend-событий  
**Retention:** 13 месяцев (с архивацией в S3)  
**Table:** `analytics_events` (см. раздел 3.4.1)

**Используется для MVP v1:**
- ✅ Бизнес-события (bookings, warehouses, reviews)
- ✅ Операторские метрики (activation, response time)
- ✅ AI-события (requests, responses, costs)
- ✅ Системные события (API errors, slow queries)
- ✅ Custom SQL queries для BI отчётов

**Преимущества для MVP:**
- Простая интеграция (уже используем PostgreSQL)
- Гибкость (JSONB для любых данных)
- SQL-доступ для data analysts
- Transactional consistency с основной БД

**Limitations (решается post-MVP):**
- ❌ Не оптимизирована для OLAP queries (агрегации, time-series)
- ❌ Performance деградация при больших объёмах (>1M events)
- ❌ Ограниченная масштабируемость

---

### 4.3. Резервное хранение

#### 4.3.1. S3 Backup (MVP)

**Назначение:** Долгосрочное архивирование backend-событий

```
Process:
1. Еженедельный экспорт analytics_events → S3 (Parquet format)
2. Хранение в S3 холодного хранения (Glacier) — до 7 лет
3. Удаление из PostgreSQL данных старше 13 месяцев
```

**S3 Structure:**

```
s3://platform-analytics/
  ├── year=2025/
  │   ├── month=12/
  │   │   ├── week=50/
  │   │   │   └── analytics_events_2025_12_w50.parquet
  │   │   └── week=51/
  │   └── month=11/
  └── year=2024/
```

**Cost Estimation (MVP):**
- 100K events/month × 1KB/event = ~100MB/month
- S3 Standard: $0.023/GB = ~$0.03/month
- Glacier: $0.004/GB = ~$0.005/month (archive)

---

### 4.4. Data Flow Architecture

#### 4.4.1. MVP v1 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ANALYTICS DATA FLOW — MVP v1                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Frontend   │                                                           │
│  │  (React App) │                                                           │
│  └───────┬──────┘                                                           │
│          │                                                                  │
│          │ gtag.js                                                          │
│          ▼                                                                  │
│  ┌──────────────┐                                                           │
│  │  Google GA4  │  ◀───────────────────────────────────────────────────    │
│  │   (Cloud)    │         14 months retention                               │
│  └──────────────┘                                                           │
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Backend    │                                                           │
│  │  (FastAPI)   │                                                           │
│  └───────┬──────┘                                                           │
│          │                                                                  │
│          │ Event Service                                                    │
│          ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  PostgreSQL: analytics_events                                │          │
│  │  - Business events                                            │          │
│  │  - System events                                              │          │
│  │  - AI events                                                  │          │
│  │  Retention: 13 months                                         │          │
│  └───────────────────┬──────────────────────────────────────────┘          │
│                      │                                                      │
│                      │ Weekly export                                        │
│                      ▼                                                      │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  S3 Backup (Parquet)                                         │          │
│  │  - Long-term archive (7 years)                                │          │
│  │  - Glacier storage for cost efficiency                        │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐                                  │
│  │  Metabase    │───────▶│ PostgreSQL   │                                  │
│  │    (BI)      │        │ (analytics)  │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key MVP v1 Principles:**
- ✅ Simple architecture: GA4 + PostgreSQL only
- ✅ No real-time streaming (not needed for MVP)
- ✅ S3 backup for compliance and long-term retention
- ✅ Metabase for custom BI reports

---

#### 4.4.2. Post-MVP Data Flow (Future)

**Not included in MVP v1 — for reference only:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ANALYTICS DATA FLOW — POST-MVP                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Frontend   │───────▶ GA4 ────────▶ BigQuery ──────▶ Looker            │
│  └──────────────┘                                                           │
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   Backend    │───────▶ Kafka ──────┐                                    │
│  └──────────────┘                     │                                    │
│                                        ▼                                    │
│                              ┌────────────────┐                             │
│                              │  ClickHouse    │──────▶ Grafana              │
│                              │   (OLAP)       │                             │
│                              └────────────────┘                             │
│                                        │                                    │
│                                        ▼                                    │
│                              ┌────────────────┐                             │
│                              │   BigQuery     │──────▶ Looker               │
│                              │  (Data Lake)   │                             │
│                              └────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Post-MVP Enhancements (not in MVP v1):**
- ❌ Apache Kafka for real-time event streaming
- ❌ ClickHouse for high-performance OLAP analytics
- ❌ BigQuery as centralized data lake
- ❌ Looker/Tableau for advanced BI
- ❌ Real-time dashboards with sub-second latency
- ❌ Advanced ML pipelines on raw analytics data

---

## 5. Naming Conventions

### 5.1. Формат именования

Все события следуют единому стандарту именования:

**Формат:** `category_object_action`

| Часть | Описание | Примеры |
|-------|----------|---------|
| **category** | Категория события | search, booking, user, auth, warehouse, ai |
| **object** | Объект действия | result, start, submit, request, response |
| **action** | Действие | click, open, apply, change, created, failed |

**Примеры:**
- ✅ `search_result_click`
- ✅ `booking_start`
- ✅ `user_favorite_add`
- ✅ `ai_response_failed`
- ❌ `clickSearchResult` (неправильный формат)
- ❌ `user_adds_favorite` (глагол вместо существительного + действие)

---

### 5.2. Категории событий

| Категория | Префикс | Применение | Примеры |
|-----------|---------|------------|---------|
| **Navigation** | `page_`, `map_`, `warehouse_`, `box_` | Навигация по платформе | `page_view`, `warehouse_open` |
| **Search** | `search_` | Поиск и фильтры | `search_apply_filters`, `search_result_click` |
| **Booking** | `booking_` | Процесс бронирования | `booking_start`, `booking_submit` |
| **Auth** | `auth_` | Аутентификация | `auth_login`, `auth_signup` |
| **User** | `user_` | Пользовательские действия | `user_favorite_add`, `user_share_click` |
| **AI** | `ai_` | AI-интеграции | `ai_request_sent`, `ai_response_received` |
| **System** | `api_`, `db_`, `rate_` | Системные события | `api_error_5xx`, `db_query_slow` |

---

### 5.3. Полный реестр событий

См. **Приложение A** для полного списка всех frontend и backend событий.

---

### 5.4. Антипаттерны

**Избегайте следующих антипаттернов:**

| Антипаттерн | Почему плохо | Правильный вариант |
|-------------|--------------|---------------------|
| `clickSearchResult` | camelCase вместо snake_case | `search_result_click` |
| `user_clicks_favorite` | Глагол в настоящем времени | `user_favorite_click` |
| `searchApplyFilters` | camelCase | `search_apply_filters` |
| `user_added_to_favorites` | Слишком многословно | `user_favorite_add` |
| `error` | Слишком общее | `api_error_5xx` |
| `page` | Не уточняет действие | `page_view` |

---

## 6. Схемы данных событий

### 6.1. Базовая структура события

Все события (frontend и backend) содержат общий набор полей:

```typescript
interface BaseEvent {
  // Обязательные поля
  event_name: string;          // Имя события
  timestamp: string;           // ISO 8601 timestamp
  
  // Идентификаторы
  session_id: string;          // UUID сессии
  user_id?: string;            // UUID пользователя (опционально)
  
  // Контекст
  [key: string]: any;          // Дополнительные данные
}
```

---

### 6.2. Обязательные и опциональные поля

#### 6.2.1. Frontend Events

| Поле | Обязательность | Тип | Примечание |
|------|----------------|-----|------------|
| `event_name` | **Обязательное** | string | Имя из реестра |
| `timestamp` | **Обязательное** | string (ISO 8601) | Время события |
| `session_id` | **Обязательное** | string (UUID) | ID сессии |
| `user_id` | Опциональное | string (UUID) | Только для авторизованных |
| `page_location` | **Обязательное** | string (URL) | Полный URL |
| `page_path` | **Обязательное** | string | Путь страницы |
| `device_category` | **Обязательное** | enum | desktop / mobile / tablet |

#### 6.2.2. Backend Events

| Поле | Обязательность | Тип | Примечание |
|------|----------------|-----|------------|
| `event_name` | **Обязательное** | string | Имя из реестра |
| `event_category` | **Обязательное** | string | business / system / ai |
| `timestamp` | **Обязательное** | timestamptz | Время события |
| `data` | **Обязательное** | JSONB | Полезная нагрузка |
| `user_id` | Опциональное | UUID | Если применимо |
| `session_id` | Опциональное | string | Если доступно |

---

### 6.3. Примеры событий по категориям

#### 6.3.1. Navigation Event

```json
{
  "event_name": "warehouse_open",
  "timestamp": "2025-12-16T10:30:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "page_location": "https://platform.com/warehouses/wh_456",
  "page_path": "/warehouses/wh_456",
  "page_title": "Downtown Storage — Main St",
  "device_category": "desktop",
  "warehouse_id": "wh_456",
  "warehouse_name": "Downtown Storage",
  "city": "San Francisco"
}
```

#### 6.3.2. Search Event

```json
{
  "event_name": "search_apply_filters",
  "timestamp": "2025-12-16T10:25:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "search_query": "climate controlled storage",
  "filters": {
    "city": "San Francisco",
    "box_size": "5x5",
    "price_range": [50, 150],
    "amenities": ["climate_control", "24_7_access"]
  },
  "results_count": 12,
  "page_location": "https://platform.com/search",
  "device_category": "mobile"
}
```

#### 6.3.3. Booking Event (Frontend)

```json
{
  "event_name": "booking_submit",
  "timestamp": "2025-12-16T10:40:00Z",
  "session_id": "sess_abc123",
  "user_id": "usr_xyz789",
  "transaction_id": "bkg_123456",
  "value": 450.00,
  "currency": "USD",
  "items": [{
    "item_id": "box_789",
    "item_name": "Box 5x10",
    "item_category": "storage_box",
    "price": 150.00,
    "quantity": 1
  }],
  "booking_step": "payment_info",
  "page_location": "https://platform.com/booking/new"
}
```

#### 6.3.4. Business Event (Backend)

```json
{
  "id": "evt_abc123",
  "event_name": "booking_status_changed",
  "event_category": "business",
  "timestamp": "2025-12-16T11:00:00Z",
  "user_id": "usr_xyz789",
  "operator_id": "op_123",
  "data": {
    "booking_id": "bkg_123456",
    "old_status": "pending_confirmation",
    "new_status": "confirmed",
    "changed_by": "operator",
    "change_reason": "Confirmed availability",
    "operator_response_time_minutes": 15
  },
  "created_at": "2025-12-16T11:00:00Z"
}
```

#### 6.3.5. AI Event (Backend)

```json
{
  "id": "evt_xyz789",
  "event_name": "ai_response_received",
  "event_category": "ai",
  "timestamp": "2025-12-16T10:30:02Z",
  "user_id": "usr_xyz789",
  "session_id": "sess_abc123",
  "data": {
    "request_id": "ai_req_123",
    "ai_provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "request_type": "search",
    "response_time_ms": 1842,
    "tokens_used": 450,
    "tokens_input": 200,
    "tokens_output": 250,
    "results_count": 5,
    "cost_usd": 0.008,
    "success": true
  },
  "created_at": "2025-12-16T10:30:02Z"
}
```

---

### 6.4. Валидация событий

#### 6.4.1. Frontend Validation

```typescript
// Frontend validation (TypeScript)
class EventValidator {
  static validate(event: FrontendEvent): boolean {
    // Обязательные поля
    if (!event.event_name || !event.timestamp || !event.session_id) {
      console.error('Missing required fields:', event);
      return false;
    }
    
    // Проверка формата timestamp
    if (!this.isValidISO8601(event.timestamp)) {
      console.error('Invalid timestamp format:', event.timestamp);
      return false;
    }
    
    // Проверка session_id
    if (!this.isValidUUID(event.session_id)) {
      console.error('Invalid session_id:', event.session_id);
      return false;
    }
    
    return true;
  }
  
  private static isValidISO8601(timestamp: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(timestamp);
  }
  
  private static isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
  }
}
```

#### 6.4.2. Backend Validation

```python
# Backend validation (Python)
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, Dict, Any
import uuid

class BackendEvent(BaseModel):
    event_name: str = Field(..., min_length=3, max_length=100)
    event_category: str = Field(..., regex='^(business|system|ai)$')
    timestamp: datetime
    user_id: Optional[uuid.UUID] = None
    session_id: Optional[str] = None
    data: Dict[str, Any]
    
    @validator('event_name')
    def validate_event_name(cls, v):
        # Проверка формата: category_object_action
        parts = v.split('_')
        if len(parts) < 2:
            raise ValueError('Event name must follow format: category_object_action')
        return v
    
    @validator('data')
    def validate_data_not_empty(cls, v):
        if not v:
            raise ValueError('Data field cannot be empty')
        return v
```

---

## 7. A/B Testing Framework

**Note:** This section describes the analytics and tracking aspects of the A/B testing framework. For the complete architecture, including variant assignment, feature flagging, statistical testing, and experiment lifecycle management, refer to **DOC-003: A/B Testing & Experimentation Framework**.

This section focuses specifically on:
- How A/B test events are tracked
- How experiment data is logged
- How metrics are measured for experiments
- Integration with analytics infrastructure

For details on experiment design, randomization algorithms, sample size calculations, and experimentation best practices, see **DOC-003**.

---

### 7.1. Архитектура системы

A/B testing на платформе реализован через:
1. **Feature Flags** — управление вариантами экспериментов
2. **Event Tracking** — отслеживание действий пользователей в экспериментах
3. **Metrics Calculation** — расчёт метрик по группам (control vs. treatment)
4. **Statistical Analysis** — определение значимости результатов

**Note:** The complete feature flag architecture, including flag service, configuration management, and rollout strategies, is described in **DOC-003: A/B Testing & Experimentation Framework**. This section covers only the analytics integration.

```
┌───────────────────────────────────────────────────────────────┐
│               A/B TESTING ARCHITECTURE                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                                             │
│  │   Frontend   │                                             │
│  └───────┬──────┘                                             │
│          │                                                    │
│          │ 1. Request variant                                 │
│          ▼                                                    │
│  ┌──────────────────┐                                         │
│  │  Feature Flag    │ ◀────── LaunchDarkly / PostHog          │
│  │    Service       │                                         │
│  └───────┬──────────┘                                         │
│          │                                                    │
│          │ 2. Return variant (A/B)                            │
│          ▼                                                    │
│  ┌──────────────┐                                             │
│  │   Render UI  │                                             │
│  │  (Variant A  │                                             │
│  │   or B)      │                                             │
│  └───────┬──────┘                                             │
│          │                                                    │
│          │ 3. Track events with variant_id                    │
│          ▼                                                    │
│  ┌──────────────────┐                                         │
│  │  GA4 + Backend   │                                         │
│  │  Analytics       │                                         │
│  └──────────────────┘                                         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### 7.2. Сегментация пользователей

**User Assignment:**  
For complete details on user segmentation algorithms, hash-based assignment, and traffic allocation strategies, refer to **DOC-003: A/B Testing & Experimentation Framework**.

Пользователи распределяются по вариантам экспериментов при первом визите:

```typescript
// Simplified example — full algorithm in DOC-003
interface ExperimentVariant {
  experiment_id: string;        // "exp_search_ai_v1"
  variant_id: string;           // "control" | "treatment_a" | "treatment_b"
  assigned_at: string;          // ISO 8601 timestamp
}

// Example: User assigned to experiment
const userVariant: ExperimentVariant = {
  experiment_id: 'exp_search_ai_v1',
  variant_id: 'treatment_a',
  assigned_at: '2025-12-16T10:00:00Z'
};
```

**Tracking variant assignment:**

```javascript
// Frontend: Track variant assignment
gtag('event', 'experiment_assigned', {
  experiment_id: 'exp_search_ai_v1',
  variant_id: 'treatment_a',
  user_id: currentUser.id,
  session_id: sessionId
});
```

---

### 7.3. Feature Flags

**Feature Flag Architecture:**  
For complete details on feature flag service implementation, configuration management, flag types (boolean, multivariate, rollout), and targeting rules, refer to **DOC-003: A/B Testing & Experimentation Framework**.

Примеры feature flags:

| Flag Key | Variants | Description |
|----------|----------|-------------|
| `search_ai_enabled` | true / false | Включить AI-поиск |
| `booking_flow_v2` | control / variant_a / variant_b | Новый flow бронирования |
| `price_display_format` | default / with_discount / with_monthly | Формат отображения цен |

**Example: Checking feature flag**

```typescript
// Frontend
const variant = featureFlags.getVariant('booking_flow_v2', userId);

if (variant === 'variant_a') {
  // Render new booking flow A
} else if (variant === 'variant_b') {
  // Render new booking flow B
} else {
  // Render control (current) flow
}

// Track which variant was shown
gtag('event', 'experiment_view', {
  experiment_id: 'exp_booking_flow_v2',
  variant_id: variant,
  user_id: userId
});
```

---

### 7.4. Измеряемые метрики

**Statistical Testing & Sample Size:**  
For complete details on statistical significance testing, sample size calculations, minimum detectable effects (MDE), and power analysis, refer to **DOC-003: A/B Testing & Experimentation Framework**.

Для каждого A/B теста определяются **Primary** и **Secondary** метрики:

#### 7.4.1. Primary Metrics (Основные)

| Метрика | Описание | Формула | Пример эксперимента |
|---------|----------|---------|---------------------|
| **Conversion Rate** | Процент конверсии в целевое действие | `Conversions / Total Users * 100%` | Search → Booking |
| **Click-Through Rate (CTR)** | Процент кликов | `Clicks / Impressions * 100%` | AI Search Results |
| **Average Session Duration** | Средняя длительность сессии | `AVG(session_duration)` | New Homepage Design |
| **Booking Value** | Средняя стоимость бронирования | `AVG(booking_amount)` | Price Display Format |

#### 7.4.2. Secondary Metrics (Вторичные)

| Метрика | Описание | Формула | Применение |
|---------|----------|---------|------------|
| **Bounce Rate** | Процент отказов | `Bounces / Total Sessions * 100%` | Проверка качества трафика |
| **Page Views per Session** | Глубина просмотра | `Total Page Views / Total Sessions` | Вовлечённость |
| **Time to First Booking** | Время до первого бронирования | `AVG(first_booking_time - signup_time)` | Onboarding эффективность |
| **Operator Response Time** | Время ответа оператора | `AVG(operator_response_time)` | Operator UX |

---

### 7.5. Статистическая значимость

**Complete Statistical Methods:**  
For detailed information on statistical testing methods, confidence intervals, multiple testing corrections (Bonferroni, FDR), and sequential testing, refer to **DOC-003: A/B Testing & Experimentation Framework**.

**Критерии оценки эксперимента:**

| Параметр | Значение | Примечание |
|----------|----------|------------|
| **Minimum Sample Size** | 1,000 users per variant | Для достоверных результатов |
| **Confidence Level** | 95% | Стандартный уровень доверия |
| **Statistical Power** | 80% | Вероятность обнаружения эффекта |
| **Minimum Detectable Effect (MDE)** | 5% relative change | Минимальный значимый эффект |
| **Test Duration** | 1-2 weeks | Минимум 1 бизнес-цикл |

**Example: Statistical Significance Calculation**

```python
# Simplified example — full implementation in DOC-003
from scipy import stats

# Control group
control_conversions = 450
control_total = 10000
control_rate = control_conversions / control_total  # 4.5%

# Treatment group
treatment_conversions = 520
treatment_total = 10000
treatment_rate = treatment_conversions / treatment_total  # 5.2%

# Z-test for proportions
z_stat, p_value = stats.proportions_ztest(
    [control_conversions, treatment_conversions],
    [control_total, treatment_total]
)

if p_value < 0.05:
    print(f"Significant difference: treatment {treatment_rate:.2%} vs control {control_rate:.2%}")
    print(f"Relative lift: {(treatment_rate - control_rate) / control_rate * 100:.1f}%")
else:
    print("No significant difference detected")
```

---

## 8. Dashboard Requirements

### 8.1. Дашборды для продакт-менеджера

#### 8.1.1. Product Overview Dashboard

**Назначение:** Общий обзор здоровья продукта  
**Инструмент:** Google Analytics 4  
**Refresh Rate:** Real-time

**Widgets:**

| Widget | Метрика | Visualization |
|--------|---------|---------------|
| **Daily Active Users (DAU)** | `COUNT(DISTINCT user_id)` | Line chart (7 days) |
| **Conversion Funnel** | Search → Booking → Confirmed | Funnel chart |
| **Top Pages** | Page views, bounce rate | Table |
| **Traffic Sources** | Organic, Direct, Referral | Pie chart |
| **User Retention** | D1, D7, D30 retention | Cohort table |

**Example Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT OVERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DAU: 342 (+12%)          MAU: 4,521 (+8%)    DAU/MAU: 7.6%   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Conversion Funnel                                       │  │
│  │  Search:      1,234  (100%)  ──────────────────          │  │
│  │  Warehouse:     740  (60%)   ────────────                │  │
│  │  Box View:      296  (24%)   ──────                      │  │
│  │  Booking:        74  (6%)    ──                          │  │
│  │  Confirmed:      52  (4.2%)  ─                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Top Pages                                               │  │
│  │  /search         2,341 views    35% bounce               │  │
│  │  /warehouses/wh_ 1,823 views    22% bounce               │  │
│  │  /booking/new      452 views    18% bounce               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 8.1.2. Search Performance Dashboard

**Назначение:** Анализ эффективности поиска  
**Инструмент:** GA4 + Metabase (PostgreSQL)  
**Refresh Rate:** Hourly

**Metrics:**

| Метрика | Описание | Visualization |
|---------|----------|---------------|
| **Search Volume** | Количество поисков | Time series |
| **Search → Click CTR** | Процент кликов по результатам | Line chart |
| **Search → Booking** | Конверсия в бронирование | Funnel |
| **Zero Results Rate** | Процент поисков без результатов | Gauge |
| **AI Search Usage** | Процент AI-поисков | Pie chart |
| **Top Search Queries** | Популярные запросы | Table |

---

#### 8.1.3. Booking Funnel Dashboard

**Назначение:** Анализ процесса бронирования  
**Инструмент:** Metabase (PostgreSQL)  
**Refresh Rate:** Hourly

**Metrics:**

| Метрика | Описание | SQL Query |
|---------|----------|-----------|
| **Booking Started** | `COUNT(booking_start)` | `SELECT COUNT(*) FROM analytics_events WHERE event_name = 'booking_start'` |
| **Booking Submitted** | `COUNT(booking_submit)` | `SELECT COUNT(*) FROM analytics_events WHERE event_name = 'booking_submit'` |
| **Booking Confirmed** | `COUNT(booking_confirmed)` | `SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'` |
| **Drop-off Rate by Step** | `(Step N - Step N+1) / Step N` | Calculated |
| **Average Time per Step** | `AVG(step_duration)` | From session data |

---

### 8.2. Дашборды для операторов

#### 8.2.1. Operator Dashboard (In-App)

**Назначение:** Метрики для владельцев складов  
**Инструмент:** Frontend (React) + Backend API  
**Refresh Rate:** Real-time

**Widgets:**

| Widget | Метрика | API Endpoint |
|--------|---------|--------------|
| **New Requests Today** | `COUNT(bookings WHERE status = 'pending')` | `GET /api/v1/operators/{id}/stats` |
| **Confirmed Bookings** | `COUNT(bookings WHERE status = 'confirmed')` | Same |
| **Occupancy Rate** | `Booked Boxes / Total Boxes * 100%` | Same |
| **Average Response Time** | `AVG(response_time)` | Same |
| **Revenue This Month** | `SUM(booking_amount)` | Same |

**Example Operator Dashboard:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPERATOR DASHBOARD                           │
│                    Downtown Storage — Main St                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Requests: 5        Confirmed: 12       Occupancy: 68%    │
│  Avg Response: 2h       Revenue MTD: $3,450                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pending Requests                                        │  │
│  │  1. Jane Doe    - 5x10 box   - 2 hours ago              │  │
│  │  2. John Smith  - 10x10 box  - 4 hours ago              │  │
│  │  3. Alice Brown - 5x5 box    - 6 hours ago              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Occupancy Trend (Last 7 days)                          │  │
│  │  [Line chart showing 62% → 68%]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.3. Технические дашборды

#### 8.3.1. System Health Dashboard

**Назначение:** Мониторинг технического здоровья платформы  
**Инструмент:** Grafana  
**Refresh Rate:** Real-time (30s)  
**Related Document:** See **DOC-086: Monitoring & Observability Plan** for complete system monitoring architecture

**Metrics:**

| Метрика | Описание | Data Source |
|---------|----------|-------------|
| **API Response Time (p50, p95, p99)** | Latency API | Prometheus |
| **Error Rate (4xx, 5xx)** | Процент ошибок | ClickHouse |
| **Request Rate** | Requests per second | Prometheus |
| **Database Query Time** | Среднее время запросов | PostgreSQL |
| **CPU / Memory Usage** | Утилизация ресурсов | Node Exporter |
| **Active Connections** | Активные соединения | PostgreSQL |

---

#### 8.3.2. AI Core Dashboard

**Назначение:** Мониторинг AI-компонентов  
**Инструмент:** Grafana  
**Refresh Rate:** Real-time (1m)

**Metrics:**

| Метрика | Описание | Data Source |
|---------|----------|-------------|
| **AI Request Volume** | Requests per hour | ClickHouse |
| **AI Success Rate** | `Successful / Total * 100%` | ClickHouse |
| **AI Response Time (p50, p95)** | Latency | ClickHouse |
| **AI Cost per Day** | Total API cost | Aggregated |
| **Fallback Rate** | `Fallbacks / Total * 100%` | ClickHouse |
| **Token Usage** | Input + Output tokens | ClickHouse |

---

### 8.4. Инструменты и платформы

#### 8.4.1. Используемые инструменты (MVP)

| Назначение | Инструмент | Обоснование |
|------------|------------|-------------|
| **Product Analytics** | GA4 | Бесплатно, интеграция с Google |
| **System Monitoring** | Grafana | Open-source, гибкие дашборды |
| **Log Analysis** | Grafana Loki | Интеграция с Grafana |
| **Alerting** | Grafana + PagerDuty | Alerting rules + escalation |
| **BI / Reporting** | Metabase | Open-source, SQL-based |
| **Error Tracking** | Sentry | Real-time error tracking |

#### 8.4.2. Интеграции

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD INTEGRATIONS — MVP v1                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │    GA4       │  ◀─────────────────────────────────────────────          │
│  │  (Product)   │         14 months retention                               │
│  └──────────────┘         Frontend events only                              │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐                                  │
│  │  PostgreSQL  │───────▶│  Metabase    │                                  │
│  │ (analytics_  │        │    (BI)      │                                  │
│  │   events)    │        │              │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │  PostgreSQL  │───────▶│   Grafana    │───────▶│  PagerDuty   │          │
│  │   (System    │        │ (Dashboards) │        │  (Alerts)    │          │
│  │   Metrics)   │        │              │        │              │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│         ▲                       ▲                                           │
│         │                       │                                           │
│  ┌──────┴───────┐        ┌──────┴───────┐                                  │
│  │ Application  │        │    Loki      │                                  │
│  │    Logs      │───────▶│   (Logs)     │                                  │
│  └──────────────┘        └──────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Post-MVP Integrations (Not in MVP v1):**
- ❌ BigQuery (data lake)
- ❌ Looker (advanced BI)
- ❌ ClickHouse (OLAP analytics)

---

#### 8.4.3. Доступ к дашбордам

| Роль | Дашборды | Доступ |
|------|----------|--------|
| **Product Manager** | Product Overview, Search, Booking Funnel | View |
| **Operator** | Operator Dashboard (in-app) | View own data |
| **Developer** | System Health, AI Core | View + Alert config |
| **DevOps** | All technical dashboards | Full access |
| **Admin** | All dashboards | Full access |

---

## Приложения

### Приложение A: Полный реестр событий

#### Frontend Events (Complete List)

| # | Event Name | Category | Priority | Description |
|---|------------|----------|----------|-------------|
| 1 | `page_view` | Navigation | HIGH | Просмотр страницы |
| 2 | `page_exit` | Navigation | LOW | Уход со страницы |
| 3 | `search_open` | Navigation | HIGH | Открытие поиска |
| 4 | `map_open` | Navigation | MEDIUM | Открытие карты |
| 5 | `warehouse_open` | Navigation | HIGH | Просмотр склада |
| 6 | `box_open` | Navigation | HIGH | Просмотр бокса |
| 7 | `search_apply_filters` | Search | HIGH | Применение фильтров |
| 8 | `search_reset_filters` | Search | MEDIUM | Сброс фильтров |
| 9 | `search_result_click` | Search | HIGH | Клик по результату |
| 10 | `search_sort_change` | Search | MEDIUM | Изменение сортировки |
| 11 | `search_pagination` | Search | LOW | Пагинация |
| 12 | `search_no_results` | Search | MEDIUM | Пустые результаты |
| 13 | `map_marker_click` | Map | MEDIUM | Клик по маркеру |
| 14 | `map_cluster_click` | Map | LOW | Клик по кластеру |
| 15 | `map_zoom` | Map | LOW | Изменение zoom |
| 16 | `booking_start` | Booking | HIGH | Начало бронирования |
| 17 | `booking_step_complete` | Booking | MEDIUM | Завершение шага |
| 18 | `booking_submit` | Booking | HIGH | Отправка заявки |
| 19 | `booking_success` | Booking | HIGH | Успешная отправка |
| 20 | `booking_error` | Booking | HIGH | Ошибка |
| 21 | `booking_abandon` | Booking | MEDIUM | Покидание формы |
| 22 | `auth_login` | Auth | HIGH | Вход |
| 23 | `auth_signup` | Auth | HIGH | Регистрация |
| 24 | `auth_logout` | Auth | MEDIUM | Выход |
| 25 | `auth_password_reset` | Auth | MEDIUM | Сброс пароля |
| 26 | `user_favorite_add` | User | MEDIUM | В избранное |
| 27 | `user_favorite_remove` | User | LOW | Из избранного |
| 28 | `user_share_click` | User | LOW | Поделиться |

#### Backend Events (Complete List)

| # | Event Name | Category | Storage | Description |
|---|------------|----------|---------|-------------|
| 1 | `booking_created` | Business | PG + CH | Создание бронирования |
| 2 | `booking_status_changed` | Business | PG + CH | Смена статуса |
| 3 | `booking_cancelled` | Business | PG + CH | Отмена |
| 4 | `booking_completed` | Business | PG + CH | Завершение |
| 5 | `warehouse_created` | Business | PG | Добавление склада |
| 6 | `warehouse_updated` | Business | PG | Обновление склада |
| 7 | `warehouse_published` | Business | PG + CH | Публикация |
| 8 | `box_price_changed` | Business | PG + CH | Изменение цены |
| 9 | `review_submitted` | Business | PG | Новый отзыв |
| 10 | `api_request` | System | CH | API запрос |
| 11 | `api_error_4xx` | System | CH | Ошибка 4xx |
| 12 | `api_error_5xx` | System | CH | Ошибка 5xx |
| 13 | `rate_limit_exceeded` | System | CH | Rate limit |
| 14 | `db_query_slow` | System | Logs | Медленный запрос |
| 15 | `ai_request_sent` | AI | CH | AI запрос |
| 16 | `ai_response_received` | AI | CH | AI ответ |
| 17 | `ai_response_failed` | AI | CH | AI ошибка |
| 18 | `ai_fallback_used` | AI | Fallback |

**Note:** Events marked "PG + CH" indicate storage in both PostgreSQL (MVP v1) and ClickHouse (Post-MVP). For MVP v1, only PostgreSQL storage is implemented.

---

### Приложение B: Mapping к GA4

| Our Event | GA4 Event | GA4 Parameters |
|-----------|-----------|----------------|
| `page_view` | `page_view` | page_location, page_title |
| `search_apply_filters` | `search` | search_term, filters_count |
| `warehouse_open` | `view_item` | item_id, item_name, item_category |
| `booking_start` | `begin_checkout` | value, currency, items |
| `booking_submit` | `purchase` | transaction_id, value, items |
| `auth_signup` | `sign_up` | method |
| `auth_login` | `login` | method |

---

### Приложение C: Checklist интеграции

#### Frontend Integration Checklist

- [ ] Установлен GA4 tag (gtag.js)
- [ ] Настроены custom dimensions
- [ ] Реализован Analytics Service
- [ ] Добавлены все navigation events
- [ ] Добавлены все search events
- [ ] Добавлены все booking events
- [ ] Добавлены все auth events
- [ ] Настроен error tracking
- [ ] Проведено тестирование в GA4 DebugView
- [ ] Настроены conversions в GA4

#### Backend Integration Checklist

- [ ] Создана таблица analytics_events
- [ ] Реализован Event Service
- [ ] Добавлены все business events
- [ ] Добавлены все system events
- [ ] Добавлены все AI events
- [ ] Настроено structured logging (see DOC-086)
- [ ] Настроена retention policy согласно DOC-036
- [ ] Настроен S3 backup
- [ ] Реализован compliance с DOC-071 (PII handling)
- [ ] Проведено нагрузочное тестирование

#### Dashboard Checklist

- [ ] Настроен GA4 dashboard
- [ ] Создан Grafana system health dashboard (see DOC-086)
- [ ] Создан Grafana AI dashboard
- [ ] Настроены alerting rules (see DOC-086)
- [ ] Настроен Metabase для BI
- [ ] Документированы все метрики

#### Post-MVP Enhancements (Not in MVP v1)

- [ ] Настроен экспорт в ClickHouse
- [ ] Настроен BigQuery data lake
- [ ] Реализован real-time streaming (Kafka)
- [ ] Создан Looker/Tableau BI layer

---

**— End of Document —**

*Version: 1.1 | December 2025 | Self-Storage Aggregator MVP*  
*Status: GREEN — Final Approved for Implementation*

**Document History:**
- v1.0 (Initial Release) — December 2025
- v1.1 (GREEN Status) — December 2025 — Added architecture alignment section, clarified MVP vs. Post-MVP storage, added compliance references, linked A/B testing to DOC-003
