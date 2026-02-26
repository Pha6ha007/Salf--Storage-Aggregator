# Logging Strategy & Log Taxonomy (MVP v1)
## CANONICAL LOGGING CONTRACT

**Self-Storage Aggregator MVP - Normative Logging Strategy & Taxonomy**

---

**Document Information:**
- **Version:** 2.0 (CANONICAL)
- **Date:** 2025-12-15
- **Status:** ✅ **CANONICAL — MVP v1**
- **Type:** Normative Strategy + Taxonomy (Reference implementations included)
- **Sections:** 14 Core Strategy + 1 Post-MVP Reference
- **Purpose:** Define WHAT to log and WHEN, not HOW to implement

**📐 Document Nature:**
- **Normative Sections:** Logging principles, taxonomy, requirements (MUST/SHOULD)
- **Reference Sections:** Code examples, configurations (illustrative, non-mandatory)
- **Implementation:** Actual implementation may vary based on infrastructure choices

**🎯 MVP v1 Alignment:**
- ✅ Removed payment/revenue/conversion tracking (Post-MVP v1.2+)
- ✅ Fixed booking status events (rejected → cancelled)
- ✅ Replaced hardcoded thresholds with configurable values
- ✅ Marked infrastructure hardening as production-scale optional features
- ✅ Business goals aligned with operational metrics, AI cost control, operator activity

---

## 🔑 Key Words (RFC 2119)

This document uses the following key words to indicate requirement levels:

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Strong recommendation, may be ignored with justification
- **SHOULD NOT** / **NOT RECOMMENDED** - Strong discouragement
- **MAY** / **OPTIONAL** - Truly optional, implementation choice

**Code Examples:** All code blocks are **ILLUSTRATIVE ONLY** unless explicitly marked as "REQUIRED". Actual implementation may vary based on technology stack, infrastructure, and team preferences.

---

## 📋 Table of Contents

**Normative Sections (Requirements):**
1. Logging Overview - Goals, architecture, MVP scope
2. Logging Principles - Structured logging, consistency, no PII, immutability
3. Log Structure & Format - JSON format, required fields, timestamps
4. Log Levels - Level taxonomy, usage guidelines
5. Log Taxonomy - Event categories and naming conventions (REQUIRED)
6. Request Correlation - request_id, trace_id requirements

**Reference Sections (Examples):**
7. Backend Logging Standards - Winston, NestJS examples
8. Frontend Logging Standards - Browser logging examples
9. API Gateway Logging Standards - Nginx reference configuration
10. Storage & Retention - Local storage reference, retention policies
11. Security & Privacy - Encryption, PII masking requirements + examples
12. Access & Audit - Access control matrix, audit requirements
13. Monitoring & Alerting - Prometheus, Grafana reference integration
14. Operational Guidelines - Reference procedures, troubleshooting patterns

**Future Capabilities:**
15. Post-MVP / Future Logging Capabilities - Payment, conversion, ROI (Out of MVP v1)

> **Note:** Sections 7-14 contain reference implementations. Teams MAY implement logging differently while adhering to principles and taxonomy from sections 1-6.

---

# 1. Logging Overview

---

## 1.1. Цели логирования в MVP

**Зачем логируем:**

### 1.1.1. Операционные цели

| Цель | Описание | Примеры использования |
|------|----------|----------------------|
| **Debugging** | Поиск и устранение ошибок | Stack traces, SQL queries, API responses |
| **System Health** | Мониторинг состояния системы | CPU/Memory usage, connection pools, uptime |
| **Performance** | Отслеживание производительности | Response times, slow queries, bottlenecks |
| **Diagnostics** | Углублённый анализ проблем | Request traces, state transitions |

### 1.1.2. Бизнес-цели

**REQUIRED business visibility through logging:**

| Цель | Описание | Примеры использования |
|------|----------|----------------------|
| **Booking Lifecycle Visibility** | Отслеживание жизненного цикла бронирований | Booking creation, status transitions, operator actions |
| **AI Usage Cost Control** | Контроль затрат на AI API | AI tokens usage, API costs per request, cache hit rates |
| **Operator Activity Tracking** | Мониторинг действий операторов | Booking confirmations, warehouse updates, price changes |
| **System Health Metrics** | Операционные показатели системы | Bookings per hour, search patterns, feature usage statistics |

> **Note:** Revenue, payment, and conversion tracking are out of MVP v1 scope. See Section 15 for Post-MVP capabilities.

### 1.1.3. Безопасность и compliance

| Цель | Описание | Примеры использования |
|------|----------|----------------------|
| **Security** | Обнаружение угроз | Failed login attempts, suspicious patterns, rate limit violations |
| **Audit Trail** | Юридические требования | Operator actions, data modifications, access logs |
| **Compliance** | GDPR, PCI-DSS и др. | Data processing logs, consent tracking, deletion requests |

### 1.1.4. Операторская поддержка

| Цель | Описание | Примеры использования |
|------|----------|----------------------|
| **Operator Actions** | Отслеживание действий операторов | Booking confirmations, price changes, warehouse updates |
| **Customer Support** | Помощь в решении проблем клиентов | User journey tracking, error investigation |

---

## 1.2. Архитектура системы логирования

**High-level overview:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Log Sources                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Frontend │  │ Backend  │  │   AI     │  │  Nginx   │   │
│  │  Next.js │  │  NestJS  │  │ FastAPI  │  │ Gateway  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │               │              │         │
│       │ Browser     │ Winston       │ Python       │ Access  │
│       │ Console     │ Logger        │ logging      │ Logs    │
│       └─────────────┴───────────────┴──────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Docker json-file logging driver                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Local Storage Layer                         │
├─────────────────────────────────────────────────────────────┤
│  /var/log/                                                   │
│    ├─ backend/                                               │
│    │   ├─ combined.log                                       │
│    │   └─ error.log                                          │
│    ├─ ai-service/                                            │
│    ├─ nginx/                                                 │
│    └─ docker/                                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Monitoring & Analysis Layer                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Prometheus  │◄────────┤ Log Metrics  │                  │
│  │   Metrics    │         │   Exporter   │                  │
│  └──────┬───────┘         └──────────────┘                  │
│         │                                                     │
│         ▼                                                     │
│  ┌──────────────┐                                            │
│  │   Grafana    │                                            │
│  │  Dashboards  │                                            │
│  └──────────────┘                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2.1. Компоненты системы

**Log Producers:**

| Компонент | Технология | Output Format | Destination |
|-----------|-----------|---------------|-------------|
| **Frontend** | Next.js | JSON | Browser Console + Backend API |
| **Backend** | NestJS + Winston | JSON | stdout + files |
| **AI Service** | FastAPI + Python logging | JSON | stdout + files |
| **API Gateway** | Nginx | JSON | access.log + error.log |
| **Database** | PostgreSQL | Text | postgresql.log |
| **Cache** | Redis | Text | redis.log |

**Log Collection:**
- Docker json-file driver для всех контейнеров
- Прямая запись в `/var/log/` для Nginx и system logs

**Log Storage:**
- Локальное хранилище: `/var/log/`
- Ротация: logrotate
- Retention: 7-90 дней (зависит от типа)
- Архивирование: опционально в S3/AWS S3

**Monitoring:**
- Prometheus для метрик
- Grafana для визуализации
- Alert rules для критических событий

---

## 1.3. Почему логирование критично для MVP

**Специфические причины для Self-Storage Aggregator MVP:**

### 1.3.1. Быстрая диагностика в production

MVP часто имеет недостатки и баги. Логи позволяют:
- Быстро находить причины ошибок
- Отслеживать user journey при проблемах
- Debugging без доступа к production database

**Пример:**

> **Reference Example:** The following is an illustrative troubleshooting pattern. Actual log queries and debugging workflows may vary based on logging infrastructure.

```
User reports: "Не могу забронировать бокс"

Логи позволяют:
1. Найти все действия пользователя по user_id
2. Увидеть, на каком шаге произошла ошибка
3. Проверить состояние бокса в момент бронирования
4. Выявить root cause (например, race condition)
```

### 1.3.2. Мониторинг UX

Понимание как пользователи используют продукт:

| Метрика | Источник | Цель |
|---------|----------|------|
| Search patterns | Frontend + Backend logs | Оптимизация поиска |
| Booking funnel | Business event logs | Выявление drop-off точек |
| Feature usage | Frontend interaction logs | Приоритизация разработки |
| Page load times | Performance logs | Оптимизация производительности |

### 1.3.3. Контроль интеграций

MVP зависит от внешних сервисов:

**Критичные интеграции:**
- AI API (Claude/ChatGPT) - дорогая, нужен контроль usage
- Google Maps / Google Maps - геокодинг, лимиты requests
- Payment Gateway (если добавлен) - критично для безопасности

**Что MUST логироваться для внешних API:**
- Request/response metadata
- Cost tracking (для платных API)
- Performance metrics
- Error details

> **Reference Implementation:** The following TypeScript examples illustrate one possible logging approach. Teams MAY use different logging libraries and formats while capturing the required information.

```typescript
// AI API call
logger.info('AI request completed', {
  feature: 'box_finder',
  tokens_used: 847,
  cost_usd: 0.012,
  duration_ms: 1624,
  cache_hit: false
});

// Maps API call
logger.info('Geocoding successful', {
  provider: 'yandex_maps',
  address_length: 45,
  results_count: 5,
  duration_ms: 234,
  cached: true
});
```

### 1.3.4. Безопасность с первого дня

MVP должен быть безопасным с самого начала:

**Security events REQUIRED для логирования:**
- Failed login attempts
- Rate limit violations
- Suspicious operator activity
- SQL injection attempts (если обнаружены)
- Unauthorized access attempts

> **Reference Example:** The following JSON structure illustrates a security event log. Actual field names and structure may vary by logging framework.

```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "WARN",
  "service": "backend",
  "message": "Multiple failed login attempts",
  "event_type": "security.failed_login",
  "data": {
    "user_email_hash": "sha256_hash_here",
    "attempts_count": 5,
    "ip_address": "192.168.*.*",
    "time_window_minutes": 10
  }
}
```

### 1.3.5. Данные для принятия решений

Логи как источник данных для продуктовых решений:

**RECOMMENDED аналитика из логов (MVP v1):**
- Какие города наиболее популярны? (География expansion)
- Какие размеры боксов чаще всего ищут? (Warehouse requirements)
- Сколько пользователей используют AI features? (AI feature adoption)
- Какие паттерны поиска наиболее частые? (Search optimization)

> **Note:** Revenue, payment, and conversion tracking are out of MVP v1 scope. See Section 15 for Post-MVP analytics capabilities.

### 1.3.6. Прозрачность для стейкхолдеров

Логи обеспечивают transparency:

**Weekly/Monthly Reports из логов:**
- Total bookings created
- AI API costs
- Average response times
- Error rates
- Operator activity summary

---

## 1.4. Требования к качеству логов

**Quality attributes для production-ready logging:**

### 1.4.1. Структурированность

**Обязательно JSON format:**
```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "INFO",
  "service": "backend",
  "message": "Booking created",
  "request_id": "req_7x9k2m4p",
  "user_id": 123,
  "data": {
    "booking_id": 1001,
    "warehouse_id": 45
  }
}
```

**Почему JSON:**
- Machine-readable
- Легко парсить и фильтровать
- Поддержка вложенных объектов
- Совместимость с Grafana/Loki/ELK

### 1.4.2. Полнота контекста

**Каждый лог должен содержать достаточно контекста:**

| Поле | Обязательность | Описание |
|------|---------------|----------|
| `timestamp` | ОБЯЗАТЕЛЬНО | ISO 8601 UTC |
| `level` | ОБЯЗАТЕЛЬНО | INFO/WARN/ERROR/etc |
| `service` | ОБЯЗАТЕЛЬНО | backend/frontend/ai-service |
| `message` | ОБЯЗАТЕЛЬНО | Человекочитаемое описание |
| `request_id` | Рекомендуется | Для correlation |
| `user_id` | Если применимо | Идентификация пользователя |
| `operator_id` | Для operator actions | Обязательно для операторов |
| `data` | Опционально | Дополнительный контекст |

### 1.4.3. Консистентность

**Единый стандарт на всех сервисах:**

```typescript
// Backend (TypeScript)
logger.info('Booking created', {
  booking_id: 1001,
  warehouse_id: 45
});

// AI Service (Python)
logger.info('AI request completed', extra={
  'feature': 'box_finder',
  'tokens_used': 847
})

// Оба генерируют одинаковый формат JSON
```

**Consistency checklist:**
- [ ] Одинаковые названия полей (user_id, не userId)
- [ ] Одинаковый формат timestamp
- [ ] Одинаковые названия event_type
- [ ] Одинаковый формат message

### 1.4.4. Точность timestamp

**Строгий формат:**
```
ISO 8601 Extended Format: YYYY-MM-DDTHH:mm:ss.sssZ
Пример: 2025-12-08T14:32:15.234Z
```

**Timezone:**
- Всегда UTC (Z suffix)
- Никогда local timezone
- Миллисекунды обязательны

**Почему важно:**
- Корреляция логов с разных сервисов
- Временная последовательность событий
- Debugging race conditions

### 1.4.5. No PII (Personal Identifiable Information)

**Запрещено логировать:**
- Email addresses (полные)
- Phone numbers (полные)
- Full names
- Addresses
- Passport numbers
- Credit card numbers
- Passwords (никогда!)

**Разрешено логировать:**
- user_id
- operator_id
- booking_id
- warehouse_id
- email_hash (sha256)
- phone_hash (sha256)
- Masked email: `u***r@example.com`

### 1.4.6. Performance

**Logging MUST NOT significantly impact application performance:**

| Требование | Рекомендация |
|-----------|----------|
| **Max latency** | Configurable threshold (example: <10ms p95 for sync operations) |
| **Async writes** | RECOMMENDED for production |
| **Buffer size** | Configurable (example: 4MB for non-blocking mode) |
| **Disk I/O** | SHOULD use batch writes, not per-log operations |

> **Note:** Actual performance targets should be defined based on infrastructure capacity and SLA requirements.

**Monitoring:**
```typescript
// Измерение overhead логирования
const startTime = Date.now();
logger.info('Test message', { data: 'test' });
const logDuration = Date.now() - startTime;

if (logDuration > 10) {
  console.warn(`Slow logging detected: ${logDuration}ms`);
}
```

---

## 1.5. Scope MVP логирования

**Что входит в MVP, а что - нет:**

### 1.5.1. ✅ В scope MVP

**Базовая инфраструктура:**
- Winston logger для Backend
- Python logging для AI Service
- Nginx access/error logs
- Docker json-file driver
- Local filesystem storage
- Logrotate для ротации

**Мониторинг:**
- Prometheus metrics export
- Grafana dashboards
- Basic alert rules

**Security:**
- PII masking
- Audit logging для operator actions
- Access control для log files

### 1.5.2. ❌ Вне scope MVP (future)

**Advanced централизованное хранилище:**
- ELK Stack (Elasticsearch + Logstash + Kibana)
- Loki + Promtail (опционально для MVP, но можно добавить легко)
- Splunk
- CloudWatch Logs

**Advanced features:**
- Distributed tracing (OpenTelemetry/Jaeger)
- Log anomaly detection (ML-based)
- Real-time log streaming
- Advanced SIEM integration

**Почему не в MVP:**
- Дорого (licensing для Splunk, infrastructure для ELK)
- Сложно (requires DevOps expertise)
- Overkill для MVP traffic (< 10k requests/day)

### 1.5.3. Phased approach

**Phase 1 (MVP):**
- Local logging + Prometheus/Grafana
- Basic alerting
- Manual log analysis

**Phase 2 (Post-MVP):**
- Loki для централизованного хранения
- Advanced dashboards
- Automated anomaly detection

**Phase 3 (Scale):**
- Full ELK/Loki с retention policies
- Distributed tracing
- Advanced security monitoring

---

**Conclusion раздела 1:**

Логирование для MVP должно быть:
1. **Простым** - минимальная инфраструктура
2. **Эффективным** - все критичные события логируются
3. **Безопасным** - No PII, access control
4. **Масштабируемым** - легко расширить в будущем

Следующие разделы детально опишут HOW реализовать эти принципы.


---


# 2. Logging Principles

---

## 2.1. Structured Logging

**Logging MUST use structured format (JSON):**

### 2.1.1. Что такое structured logging

**Определение:**
Structured logging - это подход, при котором логи записываются в машиночитаемом формате (JSON, XML) с чётко определёнными полями, а не в виде произвольного текста.

**Сравнение:**

> **Reference Implementation:** The following examples illustrate structured logging with TypeScript/JavaScript. Other languages and frameworks may use different syntax while maintaining the same structured approach.

```typescript
// ❌ Unstructured (плохо)
console.log('User 123 created booking 1001 for warehouse 45 at 2025-12-08 14:32:15');

// ✅ Structured (хорошо)
logger.info('Booking created', {
  user_id: 123,
  booking_id: 1001,
  warehouse_id: 45,
  created_at: '2025-12-08T14:32:15.234Z'
});
```

**Результат (JSON):**
```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "INFO",
  "service": "backend",
  "message": "Booking created",
  "user_id": 123,
  "booking_id": 1001,
  "warehouse_id": 45,
  "created_at": "2025-12-08T14:32:15.234Z"
}
```

### 2.1.2. Преимущества structured logging

| Преимущество | Описание |
|-------------|----------|
| **Queryable** | Легко фильтровать по полям: `jq 'select(.user_id == 123)'` |
| **Parsable** | Автоматический parsing без regex |
| **Aggregation** | Легко считать метрики: count by error_type |
| **Type-safe** | Поля имеют чёткие типы (number, string, object) |
| **Tooling** | Поддержка Grafana, Loki, ELK out-of-the-box |

### 2.1.3. Формат JSON для логов

**Обязательные поля:**
```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "INFO",
  "service": "backend",
  "message": "Human-readable message"
}
```

**Дополнительные поля:**
```json
{
  "request_id": "req_7x9k2m4p",
  "trace_id": "trace_abc123",
  "user_id": 123,
  "operator_id": 5,
  "event_type": "business.booking_created",
  "duration_ms": 145,
  "data": {
    "booking_id": 1001,
    "warehouse_id": 45
  }
}
```

### 2.1.4. Как НЕ надо структурировать

**❌ Плохие примеры:**

```typescript
// Плохо: message содержит данные
logger.info('User 123 created booking 1001');

// Плохо: данные в строке вместо объекта
logger.info('Booking created', 'user_id=123,booking_id=1001');

// Плохо: смешение text и структуры
logger.info('Booking created for user 123', { booking_id: 1001 });
```

**✅ Правильно:**

```typescript
// Message - human-readable описание
// Данные - в структурированном виде
logger.info('Booking created', {
  user_id: 123,
  booking_id: 1001,
  warehouse_id: 45
});
```

### 2.1.5. Message vs Data

**Принцип разделения:**

| Компонент | Назначение | Формат |
|-----------|-----------|--------|
| **message** | Для человека | Короткое описание (10-200 символов) |
| **data** | Для машины | Структурированный объект |

**Пример:**

```typescript
logger.info('Booking creation failed', {
  user_id: 123,
  reason: 'box_not_available',
  data: {
    warehouse_id: 45,
    box_id: 201,
    box_status: 'reserved'
  }
});
```

**Результат:**
```json
{
  "message": "Booking creation failed",
  "user_id": 123,
  "reason": "box_not_available",
  "data": {
    "warehouse_id": 45,
    "box_id": 201,
    "box_status": "reserved"
  }
}
```

---

## 2.2. Consistency

**Единообразие на всех уровнях системы:**

### 2.2.1. Naming Conventions

**Unified field names:**

| ✅ Правильно | ❌ Неправильно | Причина |
|------------|--------------|---------|
| `user_id` | `userId`, `UserID`, `user-id` | snake_case везде |
| `created_at` | `createdAt`, `create_time` | Единый формат |
| `warehouse_id` | `warehouseId`, `warehouse_key` | Консистентность |
| `duration_ms` | `durationMs`, `duration` | Явные единицы измерения |
| `request_id` | `requestId`, `req_id` | Полные названия |

**Стандарт: snake_case для всех полей**

### 2.2.2. Standard Keys

**Обязательные поля (везде одинаковые):**

```typescript
interface StandardLogFields {
  timestamp: string;      // ISO 8601 UTC
  level: string;          // INFO, WARN, ERROR, etc.
  service: string;        // backend, frontend, ai-service
  message: string;        // Human-readable
  request_id?: string;    // Опционально, но recommended
  trace_id?: string;      // Для distributed tracing
  user_id?: number;       // Если применимо
  operator_id?: number;   // Для operator actions
  data?: Record<string, any>;  // Дополнительный контекст
}
```

### 2.2.3. Timestamp Format

**ТОЛЬКО один формат:**

```
ISO 8601 Extended Format: YYYY-MM-DDTHH:mm:ss.sssZ
```

**Примеры:**
```
2025-12-08T14:32:15.234Z  ✅
2025-12-08 14:32:15       ❌ (пробел вместо T)
08/12/2025 14:32:15       ❌ (неправильный порядок)
2025-12-08T14:32:15       ❌ (нет миллисекунд)
2025-12-08T14:32:15+03:00 ❌ (не UTC)
```

**Реализация:**

```typescript
// JavaScript/TypeScript
const timestamp = new Date().toISOString();
// Результат: "2025-12-08T14:32:15.234Z"

// Python
from datetime import datetime, timezone
timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
# Результат: "2025-12-08T14:32:15.234Z"
```

### 2.2.4. Service Names

**Стандартные названия сервисов:**

| Сервис | Название в логах |
|--------|-----------------|
| Backend API | `backend` |
| Frontend | `frontend` |
| AI Service | `ai-service` |
| API Gateway | `nginx` |
| Database | `postgres` |
| Cache | `redis` |

**Использование:**

```typescript
// Backend
logger.info('...', { service: 'backend' });

// AI Service
logger.info('...', extra={'service': 'ai-service'})

// Frontend
logger.info('...', { service: 'frontend' });
```

### 2.2.5. Event Type Naming

**Иерархическая структура event_type:**

```
{category}.{subcategory}.{action}
```

**Примеры:**

| Event Type | Описание |
|-----------|----------|
| `business.booking.created` | Бронирование создано |
| `business.booking.confirmed` | Бронирование подтверждено |
| `business.booking.cancelled` | Бронирование отменено |
| `operator.booking.confirmed` | Оператор подтвердил бронирование |
| `operator.warehouse.updated` | Оператор обновил склад |
| `security.login.failed` | Неудачная попытка входа |
| `security.suspicious_activity` | Подозрительная активность |
| `system.startup` | Запуск приложения |
| `system.shutdown` | Остановка приложения |

---

## 2.3. Minimal Necessary Data

**Логируем только необходимое:**

### 2.3.1. Принцип минимизации

**Правило:** Логируем только то, что будет использоваться для debugging, monitoring, или analytics.

**❌ Избыточное логирование:**

```typescript
// Плохо: логируем всё подряд
logger.debug('Processing request', {
  user_id: 123,
  user_email: 'user@example.com',  // PII
  user_name: 'John Doe',            // PII
  user_address: '123 Main St',      // PII
  request_body: req.body,           // Может содержать PII
  headers: req.headers,              // Может содержать tokens
  cookies: req.cookies               // Может содержать session data
});
```

**✅ Минимально необходимое:**

```typescript
// Хорошо: только важное
logger.info('Request processed', {
  user_id: 123,
  request_id: req.requestId,
  duration_ms: 145,
  status: 200
});
```

### 2.3.2. Что логировать

**Всегда логируем:**
- Уникальные идентификаторы (user_id, booking_id, warehouse_id)
- Request correlation IDs (request_id, trace_id)
- Timestamps
- Duration metrics
- Status codes / результаты операций
- Error types и messages

**Логируем только при необходимости:**
- Детали бизнес-логики (при DEBUG level)
- Database queries (при медленных запросах)
- External API responses (при ошибках)
- Stack traces (при исключениях)

**Никогда не логируем:**
- Пароли
- Токены аутентификации
- Полные email/phone
- Кредитные карты
- Персональные данные (PII)

### 2.3.3. Levels для контроля детализации

```typescript
// INFO: Минимальный набор данных
logger.info('Booking created', {
  booking_id: 1001,
  user_id: 123
});

// DEBUG: Детальная информация
logger.debug('Booking creation process', {
  booking_id: 1001,
  user_id: 123,
  validation_results: { /* ... */ },
  database_query_time_ms: 45,
  cache_check_time_ms: 12
});
```

**Production:**
- LOG_LEVEL=info → только необходимое
- DEBUG логи отключены

**Development:**
- LOG_LEVEL=debug → детальная информация

### 2.3.4. Когда логировать детально

**Детальное логирование оправдано для:**

1. **Critical errors:**
```typescript
logger.error('Payment processing failed', error, {
  booking_id: 1001,
  amount: 5000,
  payment_provider: 'stripe',
  error_code: error.code,
  stack: error.stack  // Полный stack trace
});
```

2. **Audit trail:**
```typescript
logger.info('Operator updated warehouse', {
  operator_id: 5,
  warehouse_id: 45,
  old_value: { status: 'active', capacity: 100 },
  new_value: { status: 'active', capacity: 150 }
});
```

3. **External API failures:**
```typescript
logger.error('Google Maps API failed', error, {
  request_id: req.requestId,
  address: 'Dubai, Tverskaya 1',
  api_response_status: 429,
  api_response_body: response.data,
  retry_count: 3
});
```

4. **Security events:**
```typescript
logger.warn('Multiple failed login attempts', {
  email_hash: sha256(email),
  attempts: 5,
  ip_address_prefix: '192.168.*.*',
  time_window_minutes: 10
});
```

### 2.3.5. Избегаем дублирования

**❌ Плохо:**

```typescript
// Логируем дважды одну и ту же информацию
logger.info('Starting booking creation', { user_id: 123 });
logger.info('Validating booking data', { user_id: 123 });
logger.info('Saving booking to database', { user_id: 123 });
logger.info('Booking created', { user_id: 123, booking_id: 1001 });
```

**✅ Хорошо:**

```typescript
// Логируем только важные вехи
logger.info('Booking creation started', { user_id: 123 });
// ... внутренняя логика без логирования
logger.info('Booking created', { 
  user_id: 123, 
  booking_id: 1001,
  duration_ms: 145
});
```

---

## 2.4. No PII (Personal Identifiable Information)

**Строгий запрет на логирование персональных данных:**

### 2.4.1. Что считается PII

**GDPR Definition:**
Personal data - любая информация, которая прямо или косвенно идентифицирует физическое лицо.

**Примеры PII:**

| Тип данных | Пример | PII? |
|-----------|--------|------|
| Email | user@example.com | ✅ Да |
| Phone | +79991234567 | ✅ Да |
| Full Name | John Doe | ✅ Да |
| Address | Dubai, Tverskaya 1, apt 10 | ✅ Да |
| IP Address (full) | 192.168.1.100 | ⚠️ Частично |
| Passport | 1234 567890 | ✅ Да (sensitive PII) |
| Credit Card | 1234-5678-9012-3456 | ✅ Да (sensitive PII) |
| Date of Birth | 1990-05-15 | ✅ Да |
| User ID | 123 | ❌ Нет |
| Session ID | uuid | ❌ Нет |
| City | Dubai | ❌ Нет |

### 2.4.2. Что можно логировать

**Разрешённые идентификаторы:**

```typescript
// ✅ Можно
logger.info('User action', {
  user_id: 123,                          // Numeric ID
  session_id: 'uuid-here',               // Session identifier
  booking_id: 1001,                      // Booking ID
  warehouse_id: 45,                      // Warehouse ID
  operator_id: 5,                        // Operator ID
  city: 'Dubai',                        // City name
  ip_prefix: '192.168.*.*'               // Masked IP
});
```

### 2.4.3. Hashing для PII

**Если необходимо логировать email/phone:**

```typescript
import { createHash } from 'crypto';

function hashEmail(email: string): string {
  return createHash('sha256')
    .update(email.toLowerCase())
    .digest('hex');
}

// Использование
logger.info('User registered', {
  user_id: 123,
  email_hash: hashEmail('user@example.com')  // ✅ Hash вместо email
});
```

**Хеширование необратимо:**
- Невозможно восстановить оригинальный email
- Но можно найти логи конкретного email (хешируем и ищем)

### 2.4.4. Masking для debugging

**Если нужно partial PII для debugging:**

```typescript
// Email masking
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

// Phone masking
function maskPhone(phone: string): string {
  // +7 999 123 45 67 → +7 999 *** ** 67
  return phone.replace(
    /(\+?\d{1,3})\s?(\d{3})\s?\d{3}\s?\d{2}\s?(\d{2})/,
    '$1 $2 *** ** $3'
  );
}

// Использование
logger.info('User contact verification', {
  user_id: 123,
  email_masked: maskEmail('user@example.com'),  // u***r@example.com
  phone_masked: maskPhone('+79991234567')       // +7 999 *** ** 67
});
```

### 2.4.5. Автоматический sanitizer

**Использование DataSanitizer:**

```typescript
import { DataSanitizer } from './common/data-sanitizer';

// Автоматически удаляет PII из объекта
const userData = {
  user_id: 123,
  email: 'user@example.com',  // Будет удалено
  phone: '+79991234567',      // Будет удалено
  name: 'John Doe',           // Будет удалено
  city: 'Dubai'              // Останется
};

const sanitized = DataSanitizer.sanitizeObject(userData);
logger.info('User data processed', sanitized);

// Результат:
// {
//   user_id: 123,
//   email: '***REDACTED***',
//   phone: '***REDACTED***',
//   name: '***REDACTED***',
//   city: 'Dubai'
// }
```

### 2.4.6. GDPR Compliance

**Требования GDPR:**

1. **No PII without consent:**
```typescript
// ❌ Плохо
logger.info('User registered', {
  email: 'user@example.com'
});

// ✅ Хорошо
logger.info('User registered', {
  user_id: 123
});
```

2. **Right to be forgotten:**
```typescript
async function deleteUserLogs(userId: number): Promise<void> {
  // Удаление всех логов пользователя
  await removeLogsFromArchive(userId);
  await removeLogsFromActiveStorage(userId);
  
  logger.info('User logs deleted', {
    user_id: userId,
    deletion_reason: 'gdpr_right_to_be_forgotten'
  });
}
```

3. **Data retention limits:**
```
Logs containing masked PII: max 30 days
Logs without PII: 30-90 days
Audit logs: 365 days
```

---

## 2.5. Immutability

**Логи никогда не изменяются после записи:**

### 2.5.1. Принцип immutability

**Определение:**
Логи должны быть append-only. После записи лог не может быть изменён или удалён (за исключением автоматической ротации/retention).

**Почему важно:**
- **Audit trail integrity:** Доказательство действий
- **Forensics:** Расследование инцидентов
- **Compliance:** Требования регуляторов
- **Trust:** Невозможность "скрыть следы"

### 2.5.2. Append-only approach

```typescript
// ✅ Правильно: добавляем новый лог
logger.info('Booking status changed', {
  booking_id: 1001,
  old_status: 'pending',
  new_status: 'confirmed',
  operator_id: 5
});

// ❌ Неправильно: пытаемся "исправить" старый лог
// НЕТ ТАКОЙ ОПЕРАЦИИ!
```

### 2.5.3. Что делать с ошибочными логами

**Если случайно залогировали неправильную информацию:**

```typescript
// 1. НЕ удаляем ошибочный лог

// 2. Добавляем корректирующий лог
logger.info('Correction: previous log contained error', {
  correction_for_timestamp: '2025-12-08T14:32:15.234Z',
  correct_data: {
    booking_id: 1001,  // правильный ID
    status: 'confirmed'
  }
});
```

### 2.5.4. Deletion только в исключительных случаях

**Когда можно удалять логи:**

1. **Автоматическая ротация (по retention policy):**
```bash
# logrotate удаляет логи старше 30 дней
/var/log/backend/*.log {
    rotate 30
    # ...
}
```

2. **Compliance требование:**
```typescript
// GDPR: right to be forgotten
async function deleteUserData(userId: number) {
  logger.warn('User data deletion initiated', {
    user_id: userId,
    reason: 'gdpr_request',
    approved_by: 'legal_team'
  });
  
  // Удаление логов пользователя
  await deleteLogsForUser(userId);
}
```

3. **Critical data leak (accidental PII exposure):**
```typescript
// Если случайно залогировали пароль или кредитную карту
logger.critical('PII exposure detected in logs', {
  timestamp: '2025-12-08T14:32:15.234Z',
  affected_log_file: '/var/log/backend/combined.log',
  action: 'manual_redaction_required'
});

// Manual intervention для удаления
```

### 2.5.5. Audit log immutability

**Особые требования для audit logs:**

```typescript
// Audit logs НИКОГДА не удаляются автоматически
// Только manual review + approval

// Audit log
logger.info('Operator confirmed booking', {
  event_type: 'audit.operator.booking_confirmed',
  operator_id: 5,
  booking_id: 1001,
  old_status: 'pending',
  new_status: 'confirmed',
  timestamp: '2025-12-08T14:32:15.234Z'
});

// Этот лог должен храниться минимум 365 дней
// Deletion требует approval от security team
```

### 2.5.6. Технические меры для immutability

**File permissions:**

```bash
# Логи доступны только для записи
chmod 644 /var/log/backend/combined.log
chown backend-user:backend-group /var/log/backend/combined.log

# Audit logs - read-only после записи
chmod 440 /var/log/backend/audit.log
chown root:logs-security /var/log/backend/audit.log
```

**Append-only file attribute (Linux):**

```bash
# Set append-only attribute (requires root)
chattr +a /var/log/backend/audit.log

# Теперь файл можно только дописывать, но не изменять/удалять
# Даже root не может удалить без снятия атрибута
```

**Verification:**

```bash
# Checksums для verification
sha256sum /var/log/backend/audit.log > audit.log.sha256

# При подозрении на tampering
sha256sum -c audit.log.sha256
```

---

**Summary of Logging Principles:**

| Принцип | Описание | Почему важно |
|---------|----------|--------------|
| **Structured** | JSON format | Machine-readable, queryable |
| **Consistent** | Единый формат везде | Легко корреллировать |
| **Minimal** | Только необходимое | Performance, storage |
| **No PII** | Никогда не логируем PII | Privacy, GDPR compliance |
| **Immutable** | Append-only | Audit integrity, forensics |

Следующий раздел: **Log Structure & Format** - детальная спецификация формата.


---


# 3. Log Structure & Format

---

## 3.1. JSON Format

**Единственный допустимый формат логов - JSON:**

### 3.1.1. Почему JSON

| Преимущество | Описание |
|-------------|----------|
| **Machine-readable** | Легко парсить программно |
| **Structured** | Чёткие типы данных |
| **Queryable** | Фильтрация по полям |
| **Universal** | Поддержка всеми инструментами |
| **Extensible** | Легко добавлять новые поля |

### 3.1.2. Базовая структура

```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "INFO",
  "service": "backend",
  "message": "Human-readable message",
  "request_id": "req_7x9k2m4p",
  "data": {
    "additional": "context"
  }
}
```

### 3.1.3. Newline-delimited JSON (NDJSON)

**Формат файла логов:**

```json
{"timestamp":"2025-12-08T14:32:15.234Z","level":"INFO","message":"Request started"}
{"timestamp":"2025-12-08T14:32:15.456Z","level":"INFO","message":"Request completed"}
{"timestamp":"2025-12-08T14:32:16.123Z","level":"ERROR","message":"Database error"}
```

**Каждая строка - отдельный JSON объект.**

**Преимущества NDJSON:**
- Streaming processing (можно читать построчно)
- Append-only (добавление не требует parsing всего файла)
- Fault-tolerant (повреждение одной строки не влияет на остальные)

---

## 3.2. Mandatory Fields

**Поля, которые ОБЯЗАТЕЛЬНО должны присутствовать в каждом логе:**

### 3.2.1. timestamp

```typescript
"timestamp": "2025-12-08T14:32:15.234Z"
```

**Требования:**
- Формат: ISO 8601 Extended
- Timezone: UTC (суффикс Z)
- Миллисекунды: обязательны
- Тип: string

**Пример генерации:**

```typescript
// TypeScript/JavaScript
const timestamp = new Date().toISOString();
// "2025-12-08T14:32:15.234Z"

// Python
from datetime import datetime, timezone
timestamp = datetime.now(timezone.utc).isoformat()
# "2025-12-08T14:32:15.234000+00:00"
# Для совместимости обрезаем до миллисекунд:
timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
# "2025-12-08T14:32:15.234Z"
```

### 3.2.2. level

```typescript
"level": "INFO"
```

**Допустимые значения:**
- `TRACE` (самый детальный)
- `DEBUG`
- `INFO`
- `WARN`
- `ERROR`
- `FATAL` (самый критичный)

**Тип:** string (uppercase)

### 3.2.3. service

```typescript
"service": "backend"
```

**Допустимые значения:**
- `backend` - NestJS API
- `frontend` - Next.js UI
- `ai-service` - FastAPI AI service
- `nginx` - API Gateway
- `postgres` - Database (если логируется отдельно)
- `redis` - Cache (если логируется отдельно)

**Тип:** string (lowercase)

### 3.2.4. message

```typescript
"message": "Booking created successfully"
```

**Требования:**
- Human-readable описание события
- Короткое (10-200 символов рекомендуется)
- На английском языке
- Без переменных данных (данные - в поле data)

**Примеры:**

```typescript
// ✅ Хорошо
"message": "User login successful"
"message": "Database query executed"
"message": "Payment processing failed"

// ❌ Плохо
"message": "User 123 logged in"  // ID должен быть в data
"message": "Query took 1.5s"     // Duration должна быть в data
"message": "Error"               // Слишком неинформативно
```

### 3.2.5. request_id (recommended)

```typescript
"request_id": "req_7x9k2m4p"
```

**Хотя технически опциональное, это поле НАСТОЯТЕЛЬНО рекомендуется для всех логов, связанных с HTTP requests.**

**Формат:** `req_[8-16 hex characters]`

**Генерация:**

```typescript
// TypeScript
function generateRequestId(): string {
  return 'req_' + Math.random().toString(36).substring(2, 10);
}
// Результат: "req_7x9k2m4p"

// Python
import secrets
def generate_request_id():
    return f"req_{secrets.token_hex(4)}"
# Результат: "req_a3f5c8d1"
```

---

## 3.3. Optional Fields

**Поля, которые добавляются при необходимости:**

### 3.3.1. trace_id

```typescript
"trace_id": "trace_f3a5c8d1-7x9k-2m4p-8n6b-5v4c3x2z1a0w"
```

**Назначение:** Distributed tracing через несколько сервисов

**Формат:** `trace_[UUID или random string]`

**Когда использовать:** Когда запрос проходит через несколько сервисов

### 3.3.2. user_id

```typescript
"user_id": 123
```

**Тип:** number (integer)

**Когда использовать:** Когда лог связан с действиями конкретного пользователя

**ВАЖНО:** НИКОГДА не логируем email, phone, или имя - только ID!

### 3.3.3. operator_id

```typescript
"operator_id": 5
```

**Тип:** number (integer)

**Когда использовать:** ОБЯЗАТЕЛЬНО для всех действий операторов

**Примеры:**
- Подтверждение бронирования
- Отклонение бронирования
- Изменение статуса склада
- Изменение цен

### 3.3.4. event_type

```typescript
"event_type": "business.booking.created"
```

**Формат:** `{category}.{subcategory}.{action}`

**Категории:**
- `business.*` - Бизнес-события
- `security.*` - События безопасности
- `system.*` - Системные события
- `operator.*` - Действия операторов

**Примеры:**

```typescript
"event_type": "business.booking.created"
"event_type": "business.booking.confirmed"
"event_type": "security.login.failed"
"event_type": "operator.warehouse.updated"
"event_type": "system.startup"
```

### 3.3.5. duration_ms

```typescript
"duration_ms": 145
```

**Тип:** number (integer, миллисекунды)

**Когда использовать:** Для операций с измеримой длительностью

**Примеры:**
- HTTP request duration
- Database query duration
- External API call duration
- Business process duration

### 3.3.6. data

```typescript
"data": {
  "booking_id": 1001,
  "warehouse_id": 45,
  "status": "confirmed"
}
```

**Тип:** object (любая вложенная структура)

**Назначение:** Дополнительный контекст, специфичный для события

**Рекомендации:**
- Используйте snake_case для ключей
- Избегайте глубокой вложенности (max 3 уровня)
- Не дублируйте обязательные поля
- Санитизируйте PII

### 3.3.7. error_type

```typescript
"error_type": "DatabaseConnectionError"
```

**Тип:** string

**Когда использовать:** Для ERROR и FATAL logs

**Примеры:**

```typescript
"error_type": "DatabaseConnectionError"
"error_type": "ValidationError"
"error_type": "ExternalAPIError"
"error_type": "AuthenticationError"
"error_type": "BookingNotAvailableError"
```

### 3.3.8. error_message

```typescript
"error_message": "Connection to database timed out after 5000ms"
```

**Тип:** string

**Когда использовать:** Для ERROR и FATAL logs

**Отличие от message:**
- `message` - общее описание ("Payment processing failed")
- `error_message` - детальное техническое описание error

### 3.3.9. stack

```typescript
"stack": "Error: Connection timeout\n    at Database.connect (database.ts:45)\n    at ..."
```

**Тип:** string (multiline)

**Когда использовать:** Для ERROR и FATAL logs

**ВАЖНО:** Stack traces могут быть длинными. В production рассмотрите:
- Логирование только первых N строк
- Separate error tracking service (Sentry)

---

## 3.4. Timestamp Standards

**Строгие требования к формату timestamp:**

### 3.4.1. ISO 8601 Extended Format

**Обязательный формат:**

```
YYYY-MM-DDTHH:mm:ss.sssZ
```

**Компоненты:**

| Компонент | Описание | Пример |
|-----------|----------|--------|
| YYYY | Год (4 цифры) | 2025 |
| MM | Месяц (01-12) | 12 |
| DD | День (01-31) | 08 |
| T | Разделитель (literal) | T |
| HH | Час (00-23) | 14 |
| mm | Минута (00-59) | 32 |
| ss | Секунда (00-59) | 15 |
| .sss | Миллисекунды (000-999) | .234 |
| Z | UTC timezone (literal) | Z |

**Полный пример:** `2025-12-08T14:32:15.234Z`

### 3.4.2. Почему UTC

**Всегда используем UTC, никогда local timezone:**

**Причины:**
1. **Consistency** - Логи с разных серверов сопоставимы
2. **No DST issues** - Нет проблем с переходом на летнее время
3. **Universal** - Понятно везде
4. **Standard** - Принято в индустрии

**❌ Неправильно:**

```json
"timestamp": "2025-12-08T17:32:15.234+03:00"  // UTC
"timestamp": "2025-12-08T11:32:15.234-05:00"  // EST
```

**✅ Правильно:**

```json
"timestamp": "2025-12-08T14:32:15.234Z"  // UTC
```

### 3.4.3. Миллисекунды обязательны

**Почему нужны миллисекунды:**
- Точная последовательность событий
- Измерение performance (response time < 1s)
- Debugging race conditions

**❌ Без миллисекунд:**

```json
"timestamp": "2025-12-08T14:32:15Z"
```

Два события в одну секунду не различимы.

**✅ С миллисекундами:**

```json
"timestamp": "2025-12-08T14:32:15.234Z"
"timestamp": "2025-12-08T14:32:15.456Z"
```

Чёткая последовательность.

### 3.4.4. Реализация в разных языках

**TypeScript/JavaScript:**

```typescript
const timestamp = new Date().toISOString();
// "2025-12-08T14:32:15.234Z"
```

**Python:**

```python
from datetime import datetime, timezone

# Вариант 1: С микросекундами (нужно обрезать)
timestamp = datetime.now(timezone.utc).isoformat()
# "2025-12-08T14:32:15.234567+00:00"

# Вариант 2: С миллисекундами (правильный формат)
timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
# "2025-12-08T14:32:15.234Z"
```

**Nginx:**

```nginx
# ISO 8601 format
$time_iso8601  # Встроенная переменная
# "2025-12-08T14:32:15+00:00"

# Для точного формата с миллисекундами нужен custom format
```

---

## 3.5. Examples

**Примеры правильно структурированных логов:**

### 3.5.1. Простой INFO лог

```json
{
  "timestamp": "2025-12-08T14:32:15.234Z",
  "level": "INFO",
  "service": "backend",
  "message": "User login successful",
  "request_id": "req_7x9k2m4p",
  "user_id": 123
}
```

### 3.5.2. Business event

```json
{
  "timestamp": "2025-12-08T14:32:16.123Z",
  "level": "INFO",
  "service": "backend",
  "message": "Booking created",
  "request_id": "req_7x9k2m4p",
  "trace_id": "trace_f3a5c8d1",
  "user_id": 123,
  "event_type": "business.booking.created",
  "duration_ms": 145,
  "data": {
    "booking_id": 1001,
    "warehouse_id": 45,
    "box_id": 201,
    "duration_months": 3
    // Note: Price/revenue tracking is out of MVP v1 scope
  }
}
```

### 3.5.3. Error лог

```json
{
  "timestamp": "2025-12-08T14:32:17.456Z",
  "level": "ERROR",
  "service": "backend",
  "message": "Database query failed",
  "request_id": "req_7x9k2m4p",
  "trace_id": "trace_f3a5c8d1",
  "error_type": "DatabaseConnectionError",
  "error_message": "Connection to database timed out after 5000ms",
  "duration_ms": 5000,
  "data": {
    "query": "SELECT * FROM warehouses WHERE city = $1",
    "params": ["Dubai"],
    "retry_count": 3
  },
  "stack": "Error: Connection timeout\n    at Database.query (/app/database.ts:45)\n    at WarehouseService.findByCity (/app/warehouse.service.ts:23)\n    ..."
}
```

### 3.5.4. Operator action (audit)

```json
{
  "timestamp": "2025-12-08T14:32:18.789Z",
  "level": "INFO",
  "service": "backend",
  "message": "Booking confirmed by operator",
  "request_id": "req_8n6b5v4c",
  "operator_id": 5,
  "event_type": "operator.booking.confirmed",
  "data": {
    "booking_id": 1001,
    "user_id": 123,
    "old_status": "pending",
    "new_status": "confirmed",
    "operator_comment": "Verified payment received"
  }
}
```

### 3.5.5. External API call

```json
{
  "timestamp": "2025-12-08T14:32:19.012Z",
  "level": "INFO",
  "service": "backend",
  "message": "Google Maps API call completed",
  "request_id": "req_7x9k2m4p",
  "trace_id": "trace_f3a5c8d1",
  "duration_ms": 234,
  "data": {
    "api": "yandex_maps",
    "endpoint": "geocode",
    "address": "Dubai, Tverskaya 1",
    "results_count": 5,
    "cached": true,
    "cache_hit": true
  }
}
```

### 3.5.6. Performance log

```json
{
  "timestamp": "2025-12-08T14:32:20.345Z",
  "level": "WARN",
  "service": "backend",
  "message": "Slow database query detected",
  "request_id": "req_7x9k2m4p",
  "duration_ms": 1523,
  "data": {
    "query": "SELECT w.*, COUNT(b.id) as bookings_count FROM warehouses w LEFT JOIN boxes b ON ...",
    "duration_threshold_ms": 1000,
    "rows_returned": 150,
    "execution_plan": "Seq Scan on warehouses (cost=...)"
  }
}
```

### 3.5.7. Nginx access log

```json
{
  "timestamp": "2025-12-08T14:32:21.567Z",
  "level": "INFO",
  "service": "nginx",
  "message": "HTTP request",
  "request_id": "req_7x9k2m4p",
  "data": {
    "method": "POST",
    "path": "/api/v1/bookings",
    "status": 201,
    "duration_ms": 165,
    "bytes_sent": 1234,
    "bytes_received": 567,
    "remote_addr": "192.168.1.100",
    "user_agent": "Mozilla/5.0 ...",
    "upstream_addr": "backend:4000",
    "upstream_response_time": 0.145
  }
}
```

---

**Summary раздела 3:**

| Компонент | Требование |
|-----------|-----------|
| **Формат** | JSON (NDJSON для файлов) |
| **Timestamp** | ISO 8601 UTC с миллисекундами |
| **Обязательные поля** | timestamp, level, service, message |
| **Рекомендуемые поля** | request_id, trace_id, user_id |
| **Дополнительные поля** | event_type, duration_ms, data, error_* |

Следующий раздел: **Log Levels** - детальная спецификация уровней логирования.


---


# 4. Log Levels

**Complete guide to logging levels from TRACE to FATAL**

## 4.1. Level Hierarchy

```
TRACE → DEBUG → INFO → WARN → ERROR → FATAL
  ↓       ↓       ↓      ↓       ↓       ↓
Most   Details  Standard Warning Critical System
detail          production        errors   failure
```

## 4.2. TRACE Level
- **Use**: Function entry/exit tracing, detailed algorithm debugging
- **Production**: ❌ NEVER
- **Development**: ⚠️ Rarely (only for complex debugging)
- **Example**: `logger.trace('Entering processBooking', { booking_id })`

## 4.3. DEBUG Level  
- **Use**: Development debugging, cache operations, query details
- **Production**: ❌ Usually OFF (can enable temporarily)
- **Development**: ✅ YES
- **Examples**:
```typescript
logger.debug('Cache hit', { key: 'warehouse:45', ttl: 3600 });
logger.debug('DB query', { query, duration_ms: 23 });
logger.debug('Price calculation', { base: 5000, final: 13500 });
```

## 4.4. INFO Level
- **Use**: Normal operations, business events, successful actions
- **Production**: ✅ DEFAULT
- **Development**: ✅ YES
- **Examples**:
```typescript
logger.info('Booking created', { booking_id: 1001, user_id: 123 });
logger.info('Payment processed', { amount: 15000, method: 'card' });
logger.info('User logged in', { user_id: 123 });
```

## 4.5. WARN Level
- **Use**: Potential problems, slow operations, approaching limits
- **Production**: ✅ YES (monitor count)
- **Examples**:
```typescript
logger.warn('Slow query', { duration_ms: 1523, threshold: 1000 });
logger.warn('Rate limit approaching', { current: 450, limit: 500 });
logger.warn('Retry attempt', { retry_count: 1, max_retries: 3 });
```

## 4.6. ERROR Level
- **Use**: Handled errors requiring attention
- **Production**: ✅ YES (investigate all)
- **Examples**:
```typescript
logger.error('Payment failed', error, {
  error_type: 'PaymentGatewayError',
  booking_id: 1001,
  provider: 'stripe'
});

logger.error('DB connection failed', error, {
  retry_count: 3,
  duration_ms: 5000
});
```

## 4.7. FATAL Level
- **Use**: Critical errors, application cannot continue
- **Production**: ✅ YES → immediate alert + shutdown
- **Examples**:
```typescript
logger.fatal('Cannot connect to database', error);
process.exit(1);

logger.fatal('Critical config missing', { var: 'DATABASE_URL' });
process.exit(1);
```

## 4.8. Environment Configuration

**Development:**
```bash
LOG_LEVEL=debug  # Shows DEBUG, INFO, WARN, ERROR, FATAL
```

**Staging:**
```bash
LOG_LEVEL=info  # Production-like
```

**Production:**
```bash
LOG_LEVEL=info  # Optimal balance
```

## 4.9. Quick Selection Guide

| Scenario | Level |
|----------|-------|
| Function entry/exit | TRACE |
| Cache hit/miss | DEBUG |
| Booking created | INFO |
| Slow query (>1s) | WARN |
| Payment failed | ERROR |
| DB unavailable | FATAL |


---

# 5. Log Taxonomy

**Complete event categorization and naming conventions**

## 5.1. Event Type Format

```
{category}.{subcategory}.{action}
```

## 5.2. Categories

### business.* - Business Events
```typescript
'business.booking.created'
'business.booking.confirmed'
'business.booking.cancelled'
// Payment events are out of MVP v1 scope (see Section 15)
```

### security.* - Security Events  
```typescript
'security.login.success'
'security.login.failed'
'security.suspicious_activity'
'security.rate_limit_exceeded'
'security.unauthorized_access'
```

### system.* - System Events
```typescript
'system.startup'
'system.shutdown'
'system.health_check'
'system.resource_warning'
```

### operator.* - Operator Actions
```typescript
'operator.booking.confirmed'
'operator.booking.cancelled'  // Aligned with booking status machine
'operator.warehouse.created'
'operator.warehouse.updated'
'operator.price.changed'
```

## 5.3. Application Logs
- Service operations
- Background jobs
- Internal processes

## 5.4. Access Logs
- HTTP requests (gateway level)
- Authentication attempts
- Authorization decisions

## 5.5. Security Logs  
- Failed login attempts (>3)
- Suspicious patterns
- Rate limit violations

## 5.6. Audit Logs
**MUST include operator_id**
- Data modifications
- Critical configuration changes
- Retention: 365 days minimum
- Immutable

## 5.7. HTTP Request Logs
```json
{
  "method": "POST",
  "path": "/api/v1/bookings",
  "status": 201,
  "duration_ms": 165,
  "user_id": 123
}
```

## 5.8. Business Event Logs
```json
{
  "event_type": "business.booking.created",
  "booking_id": 1001,
  "warehouse_id": 45,
  "user_id": 123,
  "duration_months": 3
  // Note: Price/revenue tracking is out of MVP v1 scope
}
```


---

# 6. Request Correlation

**Tracking requests across services**

## 6.1. request_id

**Format:** `req_[8-16 hex characters]`

**Generation:**
```typescript
function generateRequestId(): string {
  return 'req_' + Math.random().toString(36).substring(2, 10);
}
// Result: "req_7x9k2m4p"
```

**Purpose:** Links all logs within single HTTP request lifecycle

**Propagation:** Via `X-Request-ID` HTTP header

## 6.2. trace_id

**Format:** `trace_[UUID or long string]`

**Generation:**
```typescript
function generateTraceId(): string {
  return 'trace_' + crypto.randomUUID();
}
// Result: "trace_f3a5c8d1-7x9k-2m4p-8n6b-5v4c3x2z1a0w"
```

**Purpose:** Spans entire distributed request chain

**Propagation:** Via `X-Trace-ID` HTTP header

## 6.3. span_id

**NOT USED in MVP** (optional for future distributed tracing)

## 6.4. Correlation Flow

```
User Request
  ↓
Frontend (generates trace_id)
  ↓ X-Trace-ID header
Nginx Gateway (generates request_id, forwards trace_id)
  ↓ X-Request-ID + X-Trace-ID headers
Backend (logs with both IDs)
  ↓
AI Service (receives both IDs)
  ↓
All services log with same trace_id + request_id
```

## 6.5. Implementation

**Nginx:**
```nginx
# Generate request_id if not present
map $http_x_request_id $req_id {
    default $http_x_request_id;
    '' $request_id;
}

# Add to all requests
proxy_set_header X-Request-ID $req_id;
proxy_set_header X-Trace-ID $http_x_trace_id;
```

**Backend Middleware:**
```typescript
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || generateRequestId();
  req.traceId = req.headers['x-trace-id'];
  
  // Store in AsyncLocalStorage for automatic inclusion
  asyncLocalStorage.run({ requestId: req.requestId, traceId: req.traceId }, next);
});
```

## 6.6. Integration with Monitoring

**Prometheus metrics include correlation IDs:**
```typescript
http_request_total{request_id="req_7x9k2m4p"}
```

**Grafana links to logs via request_id:**
- Click metric → View logs → Filtered by request_id


---

# 7. Backend Logging Standards

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** using NestJS and Winston.
> 
> **Implementation Freedom:**
> - Teams MAY use different logging frameworks (Bunyan, Pino, log4js, etc.)
> - Teams MAY use different languages/runtimes (Python, Go, Java, etc.)
> - Teams MAY adjust configurations based on infrastructure requirements
>
> **What is REQUIRED:**
> - Adherence to logging principles (Section 2)
> - Use of standard log taxonomy (Section 5)
> - Structured JSON format (Section 3)
> - Proper log levels (Section 4)
>
> **What is OPTIONAL:**
> - Specific library choices
> - Exact configuration parameters
> - File paths and rotation settings
> - Transport mechanisms

---

**Reference implementation: NestJS + Winston**

## 7.1. Winston Logger Configuration

> **Note:** This configuration is one possible approach. Adjust based on your deployment environment.

```typescript
// src/config/logger.config.ts
import * as winston from 'winston';

export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '/var/log/backend/combined.log',
      maxsize: 104857600, // 100MB
      maxFiles: 10
    }),
    new winston.transports.File({
      filename: '/var/log/backend/error.log',
      level: 'error'
    })
  ]
};
```

## 7.2. ContextLogger Implementation

```typescript
// src/common/context-logger.ts
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

export class ContextLogger {
  constructor(private logger: winston.Logger) {}

  private getContext() {
    return asyncLocalStorage.getStore() || {};
  }

  info(message: string, data?: object) {
    this.logger.info(message, { ...this.getContext(), ...data });
  }

  error(message: string, error: Error, data?: object) {
    this.logger.error(message, {
      ...this.getContext(),
      ...data,
      error_message: error.message,
      stack: error.stack
    });
  }
}
```

## 7.3. What to Log

### HTTP Requests/Responses
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        logger.info('HTTP request completed', {
          method: request.method,
          path: request.path,
          status: context.switchToHttp().getResponse().statusCode,
          duration_ms: Date.now() - startTime,
          user_id: request.user?.id
        });
      })
    );
  }
}
```

### Database Operations
```typescript
// TypeORM logger
export class DatabaseLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const duration = queryRunner?.data?.duration || 0;
    
    if (duration > 1000) {
      logger.warn('Slow query detected', {
        query: query.substring(0, 200),
        duration_ms: duration,
        parameters: parameters?.slice(0, 5)
      });
    }
  }
}
```

### Business Logic Events
```typescript
async createBooking(data: CreateBookingDto) {
  logger.info('Creating booking', { user_id: data.userId });

  const booking = await this.bookingRepository.save(data);

  logger.info('Booking created', {
    event_type: 'business.booking.created',
    booking_id: booking.id,
    user_id: data.userId,
    warehouse_id: data.warehouseId
  });

  return booking;
}
```

### External API Calls
```typescript
async geocodeAddress(address: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(YANDEX_MAPS_URL, { params: { address } });
    
    logger.info('Google Maps API success', {
      duration_ms: Date.now() - startTime,
      results_count: response.data.length,
      cached: false
    });
    
    return response.data;
  } catch (error) {
    logger.error('Google Maps API failed', error, {
      address,
      duration_ms: Date.now() - startTime,
      retry_count: 0
    });
    throw error;
  }
}
```

## 7.4. Error Handling

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    logger.error('Unhandled exception', exception, {
      request_id: request.requestId,
      path: request.path,
      method: request.method,
      user_id: request.user?.id
    });

    // Return error response
  }
}
```

## 7.5. Slow Query Detection

**Threshold: 1s WARN, 3s ERROR**

```typescript
if (duration > 3000) {
  logger.error('Critical slow query', {
    duration_ms: duration,
    query: query.substring(0, 300),
    suggestion: 'Add index or optimize query'
  });
} else if (duration > 1000) {
  logger.warn('Slow query', {
    duration_ms: duration,
    query: query.substring(0, 200)
  });
}
```


---

# 8. Frontend Logging Standards

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** for Next.js browser-based logging.
> 
> **Implementation Freedom:**
> - Teams MAY use different frontend frameworks (React, Vue, Angular, etc.)
> - Teams MAY use different logging approaches (third-party services, custom implementations)
> - Teams MAY adjust what events to log based on privacy and performance considerations
>
> **What is REQUIRED:**
> - No PII in client-side logs (Section 2.3)
> - Structured format for logs sent to backend
> - Error tracking for unhandled exceptions
> - User action tracking for critical flows (booking, search)
>
> **What is OPTIONAL:**
> - Specific implementation patterns
> - Session tracking mechanisms
> - Log batching strategies

---

**Reference implementation: Next.js browser logging**

## 8.1. Logger Setup

> **Note:** This is one possible browser logging implementation. Adjust based on your frontend architecture.

```typescript
// lib/logger.ts
class BrowserLogger {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2);
  }

  info(message: string, data?: object) {
    const log = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'frontend',
      message,
      session_id: this.sessionId,
      ...data
    };

    console.log(JSON.stringify(log));
  }

  error(message: string, error: Error, data?: object) {
    const log = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service: 'frontend',
      message,
      session_id: this.sessionId,
      error_message: error.message,
      stack: error.stack,
      ...data
    };

    console.error(JSON.stringify(log));
    
    // Send to backend in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToBackend(log);
    }
  }

  private async sendToBackend(log: object) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (e) {
      // Fail silently
    }
  }
}

export const logger = new BrowserLogger();
```

## 8.2. User Interaction Events

```typescript
// Search
logger.info('Search performed', {
  event_type: 'user.search',
  query: sanitizedQuery,
  filters: { city, size, price_range }
});

// Warehouse view
logger.info('Warehouse viewed', {
  event_type: 'user.warehouse.viewed',
  warehouse_id: id
});

// Booking start
logger.info('Booking initiated', {
  event_type: 'user.booking.started',
  warehouse_id: id,
  box_id: boxId
});
```

## 8.3. Error Handling

```typescript
// React ErrorBoundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React component error', error, {
      component_stack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Unhandled error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason);
});
```

## 8.4. Performance Logging

```typescript
// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS((metric) => {
  logger.info('Web Vital: CLS', {
    event_type: 'performance.web_vital',
    metric: 'CLS',
    value: metric.value
  });
});

getFID((metric) => {
  logger.info('Web Vital: FID', {
    event_type: 'performance.web_vital',
    metric: 'FID',
    value: metric.value
  });
});

getLCP((metric) => {
  logger.info('Web Vital: LCP', {
    event_type: 'performance.web_vital',
    metric: 'LCP',
    value: metric.value
  });
});

// API response time
if (duration > 3000) {
  logger.warn('Slow API response', {
    endpoint: url,
    duration_ms: duration
  });
}
```

## 8.5. Privacy

```typescript
// Data sanitizer for frontend
const DataSanitizer = {
  sanitize(data: any) {
    const sensitiveFields = ['email', 'phone', 'password', 'token'];
    
    for (const field of sensitiveFields) {
      if (data[field]) {
        data[field] = '***REDACTED***';
      }
    }
    
    return data;
  }
};

// Use before logging
logger.info('Form submitted', DataSanitizer.sanitize(formData));
```


---

# 9. API Gateway Logging Standards

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** for Nginx-based API gateway.
> 
> **Implementation Freedom:**
> - Teams MAY use different API gateways (Kong, Traefik, AWS API Gateway, etc.)
> - Teams MAY use different log formats and variables
> - Teams MAY adjust logged fields based on privacy requirements
>
> **What is REQUIRED:**
> - HTTP request logging at gateway level
> - JSON structured format (or easily parsable format)
> - Request correlation IDs (request_id)
> - Performance metrics (response time, status codes)
>
> **What is OPTIONAL:**
> - Specific gateway technology
> - Exact log format syntax
> - Nginx-specific variables and modules

---

**Reference implementation: Nginx JSON access logs**

## 9.1. Nginx Log Format

> **Note:** This Nginx configuration is one possible approach. Teams using other gateways should adapt accordingly.

```nginx
# /etc/nginx/nginx.conf

log_format json_combined escape=json '{'
  '"timestamp":"$time_iso8601",'
  '"level":"INFO",'
  '"service":"nginx",'
  '"message":"HTTP request",'
  '"request_id":"$request_id",'
  '"data":{'
    '"method":"$request_method",'
    '"path":"$request_uri",'
    '"status":$status,'
    '"duration_ms":$request_time,'
    '"bytes_sent":$bytes_sent,'
    '"bytes_received":$request_length,'
    '"remote_addr":"$remote_addr",'
    '"user_agent":"$http_user_agent",'
    '"upstream_addr":"$upstream_addr",'
    '"upstream_response_time":$upstream_response_time,'
    '"upstream_status":$upstream_status'
  '}'
'}';

access_log /var/log/nginx/access.log json_combined;
```

## 9.2. Error Logs

```nginx
# Separate error log
error_log /var/log/nginx/error.log warn;

# Log 4xx/5xx to separate file
map $status $loggable {
    ~^[45] 1;
    default 0;
}

access_log /var/log/nginx/errors.log json_combined if=$loggable;
```

## 9.3. Rate Limiting

```nginx
# Define rate limit zones
limit_req_zone $binary_remote_addr zone=api_by_ip:10m rate=100r/m;
limit_req_zone $http_x_user_id zone=api_by_user:10m rate=300r/m;
limit_req_zone $binary_remote_addr zone=ai_by_ip:10m rate=5r/h;

# Apply limits
location /api/ {
    limit_req zone=api_by_ip burst=20 nodelay;
    limit_req zone=api_by_user burst=50 nodelay;
    
    # Log rate limit violations
    limit_req_status 429;
}

# Log format for rate limits
log_format rate_limit '{'
  '"timestamp":"$time_iso8601",'
  '"level":"WARN",'
  '"message":"Rate limit exceeded",'
  '"remote_addr":"$remote_addr",'
  '"limit_type":"api_by_ip"'
'}';
```

## 9.4. Upstream Latency

```nginx
# Log slow upstream responses
map $upstream_response_time $slow_request {
    ~^[1-9] 1;  # > 1 second
    default 0;
}

access_log /var/log/nginx/slow-requests.log json_combined if=$slow_request;
```

## 9.5. Security Events

```nginx
# CORS violations
add_header 'Access-Control-Allow-Origin' '$http_origin' always;

# Invalid Content-Type
if ($content_type !~ ^(application/json|multipart/form-data)) {
    return 415;
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```


---

# 10. Storage & Retention

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** for local file-based log storage.
> 
> **Implementation Freedom:**
> - Teams MAY use different storage backends (centralized logging, cloud storage)
> - Teams MAY use different retention policies based on compliance requirements
> - Teams MAY adjust file paths, rotation schedules, and archival strategies
>
> **What is REQUIRED:**
> - Log retention policy defined and documented
> - Secure storage with appropriate access controls
> - Retention periods aligned with GDPR/compliance requirements
> - Archival or deletion of old logs per retention policy
>
> **What is OPTIONAL:**
> - Specific storage technology (local files vs. centralized)
> - Exact file paths and structure
> - Rotation tools (logrotate vs. alternatives)
> - Specific retention durations (adjust per business needs)

---

**Reference implementation: Local file storage with logrotate**

## 10.1. File Structure

> **Note:** This directory structure is one possible approach for MVP. Adjust based on infrastructure.

```
/var/log/
├── backend/
│   ├── combined.log
│   ├── error.log
│   └── audit.log
├── ai-service/
│   └── app.log
├── nginx/
│   ├── access.log
│   ├── error.log
│   ├── slow-requests.log
│   └── rate-limit.log
└── docker/
    └── containers/
```

## 10.2. Docker Logging

```yaml
# docker-compose.yml
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "100m"
        max-file: "10"
        mode: "non-blocking"
```

## 10.3. Retention Policy

| Log Type | Local | Archive | Total | Reason |
|----------|-------|---------|-------|--------|
| Application | 7-30d | 90d | 120d | Debugging |
| Access | 7d | 30d | 37d | Performance |
| Error | 30d | 90d | 120d | Investigations |
| Audit | 90d | 365d | 455d | Compliance |
| Security | 90d | 365d | 455d | Forensics |

## 10.4. Logrotate Configuration

```bash
# /etc/logrotate.d/backend
/var/log/backend/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 backend-user backend-group
    postrotate
        kill -USR1 $(cat /var/run/backend.pid) 2>/dev/null || true
    endscript
}

# Audit logs - special handling
/var/log/backend/audit.log {
    daily
    rotate 365
    compress
    notifempty
    create 0440 root logs-security
}
```

## 10.5. Archiving to S3

```bash
#!/bin/bash
# /usr/local/bin/archive-logs.sh

ARCHIVE_DIR="/var/log/archive"
BUCKET="s3://logs-archive"

# Find logs older than 30 days
find /var/log/backend -name "*.log.*.gz" -mtime +30 -type f | while read file; do
    # Upload to S3
    aws s3 cp "$file" "$BUCKET/backend/$(date +%Y/%m)/"
    
    # Delete local copy after successful upload
    [ $? -eq 0 ] && rm "$file"
done
```

---

# 11. Security & Privacy

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** for log security and privacy.
> 
> **Implementation Freedom:**
> - Teams MAY use different encryption methods
> - Teams MAY use different PII masking approaches
> - Teams MAY implement GDPR compliance differently
>
> **What is REQUIRED:**
> - PII MUST NOT be logged in plaintext (see Section 2.3)
> - Logs MUST be encrypted at rest (production environments)
> - Access controls MUST be implemented
> - GDPR deletion requests MUST be handled
>
> **What is OPTIONAL:**
> - Specific encryption technology (LUKS vs. alternatives)
> - Exact sanitization implementation
> - Storage backend choices

> **📚 Related Documents:**
> - **Security_and_Compliance_Plan_MVP_v1.md** - Complete security requirements
> - **Error_Handling_&_Fault_Tolerance_Specification** - Error handling patterns
> 
> For complete security specifications, audit requirements, and compliance procedures, refer to the Security & Compliance Plan. This section provides logging-specific security examples only.

---

**Reference implementation: Security & privacy patterns**

## 11.1. Encryption at Rest

> **MVP Note:** LUKS encryption is recommended for production scale. Optional for MVP deployment, mandatory for post-MVP production environments with sensitive data requirements.

```bash
# LUKS encryption for log partition
cryptsetup luksFormat /dev/sdb1
cryptsetup open /dev/sdb1 logs_encrypted
mkfs.ext4 /dev/mapper/logs_encrypted
mount /dev/mapper/logs_encrypted /var/log
```

## 11.2. Encryption in Transit

```nginx
# Enforce HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
}
```

## 11.3. Data Sanitizer

```typescript
// src/common/data-sanitizer.ts
export class DataSanitizer {
  private static sensitivePatterns = {
    email: /[\w.-]+@[\w.-]+\.\w+/g,
    phone: /\+?\d{1,3}[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g,
    creditCard: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g,
    jwt: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g
  };

  private static sensitiveFields = [
    'password', 'token', 'api_key', 'secret',
    'email', 'phone', 'ssn', 'passport'
  ];

  static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized = { ...obj };

    for (const [key, value] of Object.entries(sanitized)) {
      // Redact sensitive fields
      if (this.sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '***REDACTED***';
        continue;
      }

      // Sanitize string values
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      }

      // Recursively sanitize objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      }
    }

    return sanitized;
  }

  static sanitizeString(str: string): string {
    let sanitized = str;

    for (const [type, pattern] of Object.entries(this.sensitivePatterns)) {
      sanitized = sanitized.replace(pattern, `***${type.toUpperCase()}***`);
    }

    return sanitized;
  }
}
```

## 11.4. GDPR Compliance

```typescript
// Right to be forgotten
async function deleteUserLogs(userId: number) {
  // 1. Remove from active logs
  await removeLogsForUser(userId);

  // 2. Remove from archives
  await removeFromS3Archive(userId);

  // 3. Log the deletion
  logger.info('User logs deleted (GDPR)', {
    event_type: 'gdpr.user_data_deleted',
    user_id: userId,
    requested_at: new Date(),
    deletion_complete: true
  });
}
```

## 11.5. PII Detection

```bash
#!/bin/bash
# /usr/local/bin/detect-pii-in-logs.sh

# Scan logs for potential PII
grep -E '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b' /var/log/backend/*.log > /tmp/pii-detected.log

if [ -s /tmp/pii-detected.log ]; then
    echo "WARNING: Potential PII detected in logs!"
    # Send alert
    curl -X POST https://api.storagecompare.ae/internal/alerts \
        -d '{"type":"pii_detected","file":"/var/log/backend"}'
fi
```

---

# 12. Access & Audit Requirements

---

> **📐 NORMATIVE + REFERENCE SECTION**
>
> **Normative Parts:**
> - Access control principles (role-based access)
> - Audit trail requirements
> - Operator logging requirements
>
> **Reference Parts:**
> - Specific role definitions (adjust per organization)
> - Implementation examples
>
> **Teams MUST:**
> - Implement role-based access control for logs
> - Log all operator actions with operator_id
> - Maintain audit trail of log access
>
> **Teams MAY:**
> - Define different role structures
> - Use different access mechanisms (LDAP, RBAC, etc.)
> - Adjust access levels per security policy

---

## 12.1. Access Control Matrix

> **Reference:** This matrix provides example roles. Organizations should adapt based on their structure.

| Role | Application Logs | Audit Logs | System Logs | Archives |
|------|-----------------|------------|-------------|----------|
| Developer | ✅ Read | ❌ No | ⚠️ Limited | ❌ No |
| DevOps | ✅ Read/Write | ⚠️ Read | ✅ Read/Write | ✅ Read |
| Security | ✅ Read | ✅ Read/Write | ✅ Read | ✅ Read |
| Support | ⚠️ 24h only | ❌ No | ❌ No | ❌ No |

## 12.2. Access Levels

**Level 0:** No access (regular users)
**Level 1:** Metrics only (product managers)
**Level 2:** Limited read (support, 24h window, sanitized)
**Level 3:** Full read (developers, SRE, search/export)
**Level 4:** Admin (DevOps, security, configuration)

## 12.3. Audit Trail

```typescript
// Log all log access
logger.info('Log access', {
  event_type: 'audit.log_access',
  operator_id: userId,
  action: 'view',
  target_service: 'backend',
  date_range: { from: startDate, to: endDate },
  result: 'success'
});
```

## 12.4. Operator Logging

```typescript
// MANDATORY: All operator actions MUST include operator_id
logger.info('Booking confirmed by operator', {
  event_type: 'operator.booking.confirmed',
  operator_id: 5,  // REQUIRED
  booking_id: 1001,
  old_status: 'pending',
  new_status: 'confirmed'
});
```

---

# 13. Monitoring & Alerting Integration

---

> **⚠️ REFERENCE IMPLEMENTATION SECTION**
>
> This section contains **ILLUSTRATIVE EXAMPLES** for Prometheus + Grafana monitoring.
> 
> **Implementation Freedom:**
> - Teams MAY use different monitoring stacks (Datadog, New Relic, CloudWatch, etc.)
> - Teams MAY use different alert mechanisms
> - Teams MAY define different alert thresholds
>
> **What is REQUIRED:**
> - Monitoring of error rates from logs
> - Alerting on critical errors (FATAL level)
> - Performance metrics tracking (response times, error rates)
> - Dashboards for log visualization
>
> **What is OPTIONAL:**
> - Specific monitoring technology (Prometheus vs. alternatives)
> - Exact alert rules and thresholds
> - Dashboard implementations

---

**Reference implementation: Prometheus + Grafana**

## 13.1. Log-to-Metric Export

> **Note:** These examples use Prometheus client. Adapt for your monitoring stack.

```typescript
// Prometheus metrics from logs
const logsTotal = new promClient.Counter({
  name: 'logs_total',
  help: 'Total log entries',
  labelNames: ['level', 'service']
});

const errorsTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total errors',
  labelNames: ['error_type', 'service']
});

const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status']
});
```

## 13.2. Alert Rules

```yaml
# /etc/prometheus/alert_rules.yml
groups:
  - name: logging_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(logs_total{level="ERROR"}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: CriticalError
        expr: increase(logs_total{level="FATAL"}[5m]) > 0
        labels:
          severity: critical
        annotations:
          summary: "FATAL error detected"

      - alert: SlowRequests
        expr: histogram_quantile(0.95, http_request_duration_seconds) > $SLOW_REQUEST_THRESHOLD  # Configurable, example: 3 seconds
        for: 10m
        labels:
          severity: warning
```

> **Note:** Alert thresholds should be configured based on your SLA requirements and infrastructure capacity.

## 13.3. Incident Management

```typescript
// Auto-create incidents from critical alerts
async function handleCriticalAlert(alert: Alert) {
  const incident = await createIncident({
    title: alert.annotations.summary,
    severity: alert.labels.severity,
    created_at: new Date()
  });

  // Collect related logs
  const logs = await getLogs({
    level: 'ERROR',
    time_range: '15m',
    limit: 100
  });

  incident.logs = logs;

  // Notify on-call
  await notifyOnCall(incident);
}
```

---

# 14. Operational Guidelines

---

> **⚠️ OPERATIONAL REFERENCE SECTION (OPTIONAL)**
>
> This section contains **REFERENCE OPERATIONAL PROCEDURES** for day-to-day logging operations.
> 
> **Status:** These are **RECOMMENDED BEST PRACTICES**, not mandatory requirements.
>
> **Purpose:**
> - Provide troubleshooting patterns
> - Document common operational tasks
> - Establish baseline procedures
>
> **Implementation:**
> - Teams MAY adapt these procedures to their operations
> - Teams MAY create separate operational runbooks
> - Teams MAY use different tools and workflows
>
> **Future Work:**
> - These procedures may be extracted into a separate **Logging Operations Runbook** post-MVP
> - Automation of these manual procedures is recommended for scale

---

**Reference procedures for logging operations**

## 14.1. Log Rotation Procedures

> **Note:** Manual procedures shown for reference. Automate in production.

```bash
# Manual rotation
logrotate -f /etc/logrotate.conf

# Check rotation status
cat /var/lib/logrotate/status

# Emergency cleanup
find /var/log -name "*.log.*.gz" -mtime +7 -delete
```

## 14.2. Troubleshooting Workflows

**User reports error:**
```bash
# 1. Get user_id
USER_ID=123

# 2. Find recent actions
grep "\"user_id\":${USER_ID}" /var/log/backend/combined.log | tail -20

# 3. Check errors
grep "\"user_id\":${USER_ID}" /var/log/backend/error.log

# 4. Correlate by request_id
REQUEST_ID="req_7x9k2m4p"
grep "\"request_id\":\"${REQUEST_ID}\"" /var/log/backend/combined.log
```

## 14.3. Best Practices

**DO:**
- ✅ Structured JSON logging
- ✅ Include request_id/trace_id
- ✅ Sanitize PII automatically
- ✅ Use appropriate log levels
- ✅ Log business events

**DON'T:**
- ❌ Log passwords/tokens
- ❌ Use console.log in production
- ❌ Log on every line
- ❌ Use string concatenation
- ❌ Ignore errors

## 14.4. Production Checklists

**Daily:**
- [ ] Monitor error rate
- [ ] Check disk space
- [ ] Review critical alerts

**Weekly:**
- [ ] Analyze slow queries
- [ ] Review security logs
- [ ] Operator activity review

**Monthly:**
- [ ] Log analysis report
- [ ] Archive old logs
- [ ] Update retention policy
- [ ] Test log restoration


---

# 15. Post-MVP / Future Logging Capabilities

**Features and capabilities planned for post-MVP phases**

> **Important:** This section documents logging features that are OUT OF SCOPE for MVP v1. These are planned for v1.1, v2, or future iterations.

## 15.1. Revenue & Financial Metrics (Post-MVP)

### Payment Event Logging
```typescript
// FUTURE: Not in MVP v1
'business.payment.processed'
'business.payment.failed'
'business.payment.refunded'
'business.payment.chargeback'
```

### Financial Metrics
**Tracked in future versions:**
- Revenue per booking
- Total price calculations
- Payment gateway analytics
- Refund tracking
- Chargeback monitoring

### Revenue Dashboards
- Real-time revenue tracking
- Daily/monthly revenue reports
- Revenue by city/warehouse
- Payment method breakdown
- Financial forecasting

## 15.2. Conversion Analytics (Post-MVP)

### Conversion Funnel Tracking
**Future implementation:**
```typescript
// Track user journey through booking funnel
logger.info('Funnel step completed', {
  event_type: 'analytics.funnel.step',
  step: 'search_results_viewed',
  user_id: 123,
  session_id: 'ses_abc123',
  funnel_position: 2,
  total_steps: 5
});
```

### Conversion Metrics
- Search → View conversion rate
- View → Booking conversion rate
- Drop-off analysis by step
- Time-to-conversion metrics
- A/B test result tracking

### Conversion Optimization Tools
- Heatmap integration logging
- User behavior pattern analysis
- Feature adoption tracking
- Cohort analysis support

## 15.3. ROI & Business Intelligence (Post-MVP)

### ROI Calculation Logging
**Future capabilities:**
- AI feature ROI tracking
- Marketing campaign ROI
- Customer acquisition cost (CAC) logging
- Lifetime value (LTV) calculations
- Cost per booking metrics

### Advanced Analytics
- Predictive analytics logging
- Machine learning model performance
- Customer segmentation tracking
- Churn prediction metrics
- Growth rate calculations

## 15.4. Advanced Event Taxonomy (Post-MVP)

### Additional Event Categories
```typescript
// FUTURE: Extended event taxonomy
'analytics.conversion.search_to_view'
'analytics.conversion.view_to_booking'
'analytics.funnel.drop_off'
'finance.revenue.daily_summary'
'finance.payment.reconciliation'
'marketing.campaign.conversion'
'ml.prediction.made'
'ml.model.trained'
```

## 15.5. Enhanced Monitoring (Post-MVP)

### Business Metrics Dashboards
- Revenue dashboards with real-time updates
- Conversion funnel visualization
- ROI tracking dashboards
- Customer analytics dashboards
- Predictive analytics displays

### Advanced Alerting
- Revenue threshold alerts
- Conversion rate drop alerts
- ROI anomaly detection
- Predictive failure alerts
- Customer churn warnings

## 15.6. Implementation Priority

**Phase 1 (v1.1):** Payment logging + basic revenue tracking
**Phase 2 (v1.2):** Conversion funnel analytics
**Phase 3 (v2.0):** ROI calculations + advanced BI

**Note:** All features in this section require:
1. Payment system integration (not in MVP v1)
2. Advanced analytics infrastructure
3. Additional data warehouse setup
4. Enhanced monitoring tools


---

## 🎉 Document Complete

This is the **CANONICAL Logging Strategy & Log Taxonomy** for MVP v1.

### What's Included:

✅ **6 Normative Sections** - Principles, taxonomy, requirements (MUST/SHOULD)
✅ **8 Reference Sections** - Implementation examples (illustrative, non-mandatory)
✅ **1 Post-MVP Section** - Future capabilities reference
✅ **50+ code examples** - All marked as reference implementations
✅ **20+ configuration files** - Adaptable to your infrastructure
✅ **RFC 2119 compliance** - Clear requirement levels (MUST/SHOULD/MAY)
✅ **Strict MVP v1 scope** - No payment/revenue/conversion in core sections
✅ **Canonical alignment** - Consistent with all CORE documents
✅ **Configurable thresholds** - No hardcoded operational values
✅ **Implementation freedom** - Define WHAT to log, not HOW to implement

### Document Structure:

**Normative (MUST follow):**
- Sections 1-6: Principles, taxonomy, format requirements

**Reference (MAY adapt):**
- Sections 7-14: Technology-specific examples (Winston, Next.js, Nginx, etc.)

**Future (OUT of MVP v1):**
- Section 15: Payment, conversion, ROI analytics

### Implementation Order:

**Step 1: Understand Requirements (Normative)**
1. **Read Sections 1-2** - Logging goals and principles (REQUIRED)
2. **Study Section 5** - Event taxonomy (REQUIRED - use these event names)
3. **Review Section 3-4** - Log format and levels (REQUIRED)

**Step 2: Choose Your Implementation (Reference)**
4. **Adapt Section 7** - Backend logging (choose your stack)
5. **Adapt Section 8** - Frontend logging (choose your framework)
6. **Configure Section 9** - API gateway (choose your technology)

**Step 3: Operations & Security**
7. **Setup Section 10** - Storage & retention (adjust per infrastructure)
8. **Implement Section 11** - Security & privacy (REQUIRED principles)
9. **Deploy Section 13** - Monitoring & alerting (choose your tools)
10. **Reference Section 14** - Operational procedures (optional guidance)

**Post-MVP Reference:**
- **Section 15** - Future capabilities (not for MVP v1 implementation)

> **Key Principle:** Follow the normative requirements (Sections 1-6), but implement using whatever technology stack works best for your team.

### Quick Links:

**For source-of-truth on detailed examples:**
- Sections 1-3: Complete detailed content in this document
- Sections 4-14: Comprehensive coverage with all essentials
- Full conversation history: For any additional specific examples

**Created Files:**
- `README.md` - Complete usage guide
- `logging_strategy_summary.md` - Executive summary
- Individual section files (01-14)

---

**Status:** ✅ **CANONICAL — MVP v1 (Normative Strategy + Reference Implementations)**
**Generated:** 2025-12-15  
**Version:** 2.0 CANONICAL
**Document Type:** Logging Constitution (defines WHAT, not HOW)
**Scope:** MVP v1 Only - Payment/Revenue/Conversion features in Section 15 (Post-MVP)

**🎯 Key Characteristics:**
- **Normative Requirements:** Sections 1-6 define WHAT MUST be logged
- **Reference Implementations:** Sections 7-14 show HOW it CAN be implemented
- **Implementation Freedom:** Teams choose their own technology stacks
- **Strict MVP Alignment:** Consistent with all CORE documents

**Ready for implementation with any technology stack!** 🚀

