# Operator Experience (OX) — Deep Specification (MVP v1)
# Главное оглавление и структура документа

**Document ID**: DOC-063  
**Платформа**: Self-Storage Aggregator  
**Версия документа**: MVP v1 (Hardened)  
**Дата создания**: 10 декабря 2025  
**Дата обновления**: 17 декабря 2025  
**Язык**: Русский  
**Автор**: Claude (Anthropic)  

---

## Document Role & Scope

### Classification
- **Type**: Supporting / UX Deep Specification
- **Status**: NOT Canonical (Supporting Document)
- **Scope**: MVP v1 Only
- **Purpose**: Describes UX, behavior, and operational scenarios for Operator-side interface

### Important Clarifications

⚠️ **This document is NOT a source of truth for**:
- API contracts and endpoints (see DOC-101 — Internal/Admin API Specification)
- System architecture (see Technical Architecture Document)
- AI model specifications (see DOC-092/DOC-105 — AI Scoring & Risk Framework)
- Database schema (see Database Specification)
- Multi-country/region implementation (see DOC-059 — Multi-Country Architecture)

✅ **This document DOES provide**:
- User experience flows and screen descriptions
- Operator interaction patterns and behaviors
- UI/UX requirements and design principles
- Illustrative examples of features (subject to implementation)
- Supporting context for development teams

### Relationship to Canonical Documents

This specification supports and aligns with:
- **DOC-090** — User Stories & Acceptance Criteria (Primary Source)
- **DOC-101** — Internal / Admin API Specification (API Authority)
- **DOC-092 / DOC-105** — AI Scoring & Risk Framework (AI Authority)
- **DOC-059** — Multi-Country & Multi-Region Architecture (Localization Authority)
- **Domain Glossary / Data Dictionary** (Terminology Authority)

### Treatment of Advanced Features

**AI Capabilities**: All AI-related features described herein are:
- Subject to platform capabilities at implementation time
- May be implemented gradually across MVP releases
- Dependent on underlying AI service availability
- Optional enhancements, not core requirements

**Post-MVP Features**: Sections marked "post-MVP" or "future" are:
- Illustrative examples only
- Not commitments for MVP v1 scope
- Subject to roadmap prioritization
- Included for context and planning purposes

**API References**: All API endpoint examples are:
- Reference implementations only
- Must be validated against DOC-101 before implementation
- Subject to change based on architectural decisions
- Not to be considered final contracts

### Multi-Region Considerations

**All examples in this document** (cities, currencies, date formats, addresses, phone numbers) **are illustrative only** and may vary by region. Actual implementation must follow DOC-059 multi-country/region specifications.

**UI examples and formats shown are for Russian market only** and will be adapted for other markets during localization.

### Terminology Alignment

**Key terms used in this document**:
- **Заявка (Lead/Inquiry)**: Initial customer request, not yet confirmed
- **Бронирование (Confirmed Reservation)**: Operator-confirmed booking

These terms are aligned with DOC-090 (User Stories) and domain glossary. Where terminology conflicts exist, DOC-090 takes precedence.

---

## О документе

Данный документ представляет собой **детальную UX-спецификацию Operator Experience (OX)** для платформы-агрегатора складов самостоятельного хранения (self-storage).

Документ описывает предполагаемый пользовательский опыт оператора на платформе:
- Регистрация и онбординг
- Добавление и управление складами
- Управление боксами и ценами
- Обработка заявок от клиентов
- AI-инструменты для оптимизации работы (where supported by platform capabilities)
- Общие требования к поддерживающему API (reference only)
- Безопасность и производительность
- Планы развития (post-MVP, illustrative)

---

## Структура документа

Документ разделён на **4 части** для удобства работы:

### **Part 1**: Разделы 1-3 (Foundation)
- Введение и архитектура OX
- Навигация и дизайн-принципы
- Онбординг оператора

### **Part 2**: Разделы 4-5 (Core Operations)
- Управление складами
- Управление боксами

### **Part 3**: Разделы 6-7 (Business Logic)
- Управление ценами (Pricing UX)
- Управление заявками (Booking Management)

### **Part 4**: Разделы 8-13 (Advanced & Technical)
- AI Tools (subject to implementation)
- Ошибки и UI состояния
- Backend API Requirements (reference only)
- Security
- Performance
- Future Recommendations (post-MVP, illustrative)

---

## Полное оглавление

### РАЗДЕЛ 1: Введение и архитектура

**1.1. Кто такой оператор**
- Определение
- Роли: Owner, Manager, Staff
- Бизнес-цели оператора

**1.2. Бизнес-цели оператора на платформе**
- Привлечение клиентов
- Оптимизация заполненности
- Автоматизация процессов
- Принятие решений на основе данных

**1.3. Scope MVP v1: что входит, что не входит**
- Включено в MVP
- Не включено в MVP (post-MVP features, illustrative)

**1.4. Архитектура OX**
- Структура кабинета
- Основные разделы
- Дашборд
- Заявки
- Склады
- Аналитика
- Настройки
- AI Tools (where supported)

**1.5. Дизайн-принципы OX**
- Ясность и понятность
- Минимизация ручных действий
- Автоматизация рутины (subject to implementation)
- Прозрачность ценообразования

**1.6. Навигация**
- Sidebar меню
- Breadcrumbs
- Quick actions
- Глобальный поиск
- URL структура
- Responsive behavior

---

### РАЗДЕЛ 2: Дашборд оператора

**2.1. Обзор дашборда**
- Целевое назначение
- Основные блоки

**2.2. Summary Cards**
- Новые заявки
- Активные бронирования
- Свободные боксы
- Выручка за месяц

**2.3. Графики и визуализация**
- График заявок
- Конверсия

**2.4. AI-рекомендации на дашборде**
- Ценовые рекомендации (optional, subject to implementation)
- Предупреждения (optional)
- Возможности оптимизации (optional)

**2.5. Quick Actions**
- Быстрые действия с дашборда

---

### РАЗДЕЛ 3: Онбординг оператора

**3.1. Регистрация**
- Форма регистрации
- Поля и валидация
- Edge cases

**3.2. Верификация контактов**
- Email verification
- SMS verification
- Обработка ошибок

**3.3. Завершение профиля**
- Опциональные поля
- Использование данных

**3.4. Модерация аккаунта**
- MVP подход
- Альтернативный подход
- Критерии одобрения

**3.5. Добавление первого склада**
- 5-шаговый визард
- Шаг 1: Основная информация
- Шаг 2: Адрес и локация
- Шаг 3: Фотографии
- Шаг 4: Удобства
- Шаг 5: Проверка и отправка
- Автосохранение
- Действия после отправки

---

### РАЗДЕЛ 4: Управление складами

**4.1. Список складов**
- URL и назначение
- Табличный вид
- Карточный вид
- Фильтры и сортировка
- Действия над складом
- Индикаторы статусов

**4.2. Добавление нового склада**
- Пошаговый визард
- Одностраничная форма
- Автосохранение

**4.3. Редактирование склада**
- Логика доступа по статусам
- Виды изменений (минорные/мажорные)
- Форма редактирования
- История изменений

**4.4. Фотографии и галереи**
- Требования к фото
- UI загрузки
- Функции (загрузка, сортировка, редактирование, удаление)
- Поддержка видео (optional, post-MVP)

**4.5. Атрибуты и услуги склада**
- Список удобств (MVP)
- UI управления атрибутами
- Режим работы
- Кастомные атрибуты (post-MVP, illustrative)

**4.6. Логические состояния**
- Диаграмма переходов
- 4.6.1. Черновик (Draft)
- 4.6.2. На модерации (Pending Moderation)
- 4.6.3. Опубликован/Активен (Published/Active)
- 4.6.4. Скрыт (Hidden)
- 4.6.5. Отклонён (Rejected)

**4.7. Edge cases**
- Некорректные координаты
- Дубли складов
- Удаление с активными бронями
- Изменение адреса с активными заявками
- Массовое редактирование (post-MVP)

---

### РАЗДЕЛ 5: Управление боксами

**5.1. Добавление боксов**
- URL и точки входа
- UI страницы
- Форма добавления
- Валидация

**5.2. Групповое добавление**
- UI
- Логика создания
- Ограничения

**5.3. Редактирование**
- Одного бокса
- Массовое редактирование (optional)

**5.4. Управление ценами**
- Индивидуальная цена
- Скидки за длительность (optional, subject to implementation)
- Расчёт итоговой цены
- История изменения цен

**5.5. Управление доступностью**
- Статусы боксов
- Переходы между статусами
- UI управления
- Автоматическая смена (post-MVP)
- Массовое изменение (optional)

**5.6. Взаимодействие с рекомендациями AI**
- AI Price Recommendation Engine (optional, subject to implementation)
- AI Box Size Recommendation (optional, subject to implementation)
- Польза для оператора

**5.7. Логические состояния**
- 5.7.1. Доступен (Available)
- 5.7.2. Недоступен (Unavailable)
- 5.7.3. Архив (Archived) - post-MVP

---

### РАЗДЕЛ 6: Управление ценами (Pricing UX)

**6.1. Просмотр текущей цены**
- На странице боксов
- В карточке бокса

**6.2. История цен**
- Зачем нужна
- UI истории
- График и таблица
- Влияние на заявки

**6.3. AI Price Recommendation**
- Как работает (subject to implementation)
- UI рекомендаций
- Частота обновления

**6.4. Объяснение цен (Explainability)**
- Принцип прозрачности
- Три уровня объяснения
- Детальный анализ

**6.5. Влияние цены на позиции в каталоге**
- Алгоритм ранжирования (reference, subject to change)
- UI показа влияния

**6.6. Edge cases**
- Слишком низкая цена
- Слишком высокая цена

---

### РАЗДЕЛ 7: Управление заявками

**7.1. Просмотр всех заявок**
- URL и назначение
- UI страницы
- Элементы таблицы
- Цветовая кодировка

**7.2. Статусы**
- Диаграмма переходов
- 7.2.1. Новая (New)
- 7.2.2. Подтверждена (Confirmed)
- 7.2.3. Отклонена (Rejected)

**7.3. Просмотр деталей заявки**
- Детальная страница
- Блоки информации
- AI-анализ (optional, subject to implementation)

**7.4. Коммуникация с пользователем**
- Телефон
- Email
- Внутренние заметки

**7.5. Автоматические уведомления**
- Триггеры
- Настройки уведомлений

**7.6. Edge cases**
- Отмена заявки клиентом
- Дубль заявок
- Задержка доставки уведомлений

---

### РАЗДЕЛ 8: AI Tools

**Note**: All AI tools are optional and subject to platform capabilities at implementation time.

**8.1. Обзор AI-инструментов**
- Список инструментов в MVP (where supported)

**8.2. Price Analytics Engine**
- Ссылка на раздел 6.3-6.4 (optional, subject to implementation)

**8.3. Operator Knowledge Assistant**
- Концепция (optional, post-MVP consideration)
- UI страницы
- Типы вопросов
- База знаний

**8.4. AI Card Generator**
- Назначение (optional, subject to implementation)
- UI генерации
- Логика работы

**8.5. Request Quality Analyzer**
- Назначение (optional, subject to implementation)
- Критерии оценки
- Примеры анализа

**8.6. Explainability**
- Принцип (where AI features are implemented)
- Уровни объяснения

---

### РАЗДЕЛ 9: Ошибки, сообщения, UI состояния

**9.1. Типы ошибок**
- Ошибки валидации
- Ошибки API
- Ошибки бизнес-логики

**9.2. UI Loading States**
- Скелетоны
- Спиннеры
- Progress bars

**9.3. Empty States**
- Нет складов
- Нет боксов
- Нет заявок

**9.4. Success States**
- Toast-уведомления
- Модальные подтверждения

**9.5. Confirmation Dialogs**
- Для необратимых действий

---

### РАЗДЕЛ 10: Backend API Requirements

**⚠️ IMPORTANT**: This section provides reference examples only. **Final API contracts are defined in DOC-101 (Internal/Admin API Specification)**. All endpoints, request/response formats, and error codes described here must be validated against DOC-101 before implementation.

**10.1. Общие требования**
- Authentication & Authorization
- Базовый URL
- Формат ответов

**10.2. Warehouse API**
- Список складов
- Создание
- Обновление
- Удаление
- Отправка на модерацию
- Загрузка фото
- Управление фото

**10.3. Box API**
- Список боксов
- Создание
- Групповое создание
- Обновление
- Массовое обновление
- История цен

**10.4. Request/Booking API**
- Список заявок
- Детали заявки
- Подтверждение
- Отклонение
- Добавление заметки

**10.5. AI Tools API**
- Ценовые рекомендации (optional, subject to implementation)
- Knowledge Assistant (optional, post-MVP)
- Генерация описания (optional, subject to implementation)

**10.6. Analytics API**
- Дашборд (reference only)

**10.7. Auth API**
- Регистрация
- Логин
- Refresh Token

**10.8. Rate Limiting**
- Лимиты (defined in DOC-101)
- Обработка превышения

---

### РАЗДЕЛ 11: Security & Access Control

**11.1. Права доступа (RBAC)**
- Роли
- Матрица прав

**11.2. Защита от несанкционированного доступа**
- Backend проверки
- Frontend проверки

**11.3. Защита системных параметров**
- Запрещённые для изменения поля
- Backend защита

**11.4. Защита чувствительных данных**
- Контакты клиентов
- Финансовые данные

**11.5. Защита от UI-ошибок**
- Подтверждения
- Защита от двойных кликов
- Защита от потери данных

**11.6. XSS Protection**

**11.7. CSRF Protection**

**11.8. Логирование действий**

---

### РАЗДЕЛ 12: Performance & UX Optimization

**12.1. Целевые метрики производительности**

**12.2. Оптимизация загрузки страниц**
- Code Splitting
- Изображения
- Кэширование

**12.3. Оптимизация карт**

**12.4. Оптимизация списков**
- Виртуализация (optional)
- Пагинация vs Infinite Scroll

**12.5. Оптимизация форм**
- Debouncing
- Оптимистичные обновления (optional)

**12.6. Мобильная оптимизация**
- Viewport settings
- Touch targets
- Responsive breakpoints

**12.7. Мониторинг производительности**
- Frontend
- Backend

---

### РАЗДЕЛ 13: Future Recommendations (post-MVP)

**Note**: All items in this section are illustrative only and not part of MVP v1 scope. They are included for context and future planning purposes.

**13.1. Онлайн-оплата** (post-MVP)
- Интеграции
- Возможности
- UI flow

**13.2. CRM интеграция** (post-MVP)
- Системы
- Возможности

**13.3. Электронные договоры** (post-MVP)
- Функционал
- UI

**13.4. Мобильное приложение** (post-MVP)
- Платформы
- Уникальные возможности

**13.5. Умный доступ к боксам** (post-MVP)
- Интеграция с замками
- Преимущества

**13.6. Автопродление аренды** (post-MVP)
- Автоматизация

**13.7. Расширенная аналитика** (post-MVP)
- Дополнительные отчёты
- Dashboards

**13.8. Marketplace для дополнительных услуг** (post-MVP)
- Концепция
- Партнёры
- Монетизация

**13.9. Публикация на внешних платформах** (post-MVP)
- Интеграции
- Преимущества

**13.10. AI-автоматизация ответов** (post-MVP)
- Концепция
- Примеры
- Польза

**13.11. Программа лояльности** (post-MVP)
- Идеи

**13.12. Социальные функции** (post-MVP)
- Отзывы и рейтинги
- Сообщество

---

## Ключевые технические характеристики

### Технологический стек (рекомендации):

**Note**: These are recommendations only and may be adjusted based on project decisions.

**Frontend**:
- React 18+ / Next.js 14+
- TypeScript
- React Query / TanStack Query
- Tailwind CSS
- React Hook Form + Zod

**Backend**:
- Node.js (Express / Fastify) или Python (FastAPI)
- PostgreSQL (основная БД)
- Redis (кэширование)
- S3-совместимое хранилище (фото)

**AI/ML** (where applicable):
- OpenAI API / Anthropic Claude API (subject to implementation)
- Python (scikit-learn, pandas)

**Инфраструктура**:
- Docker + Kubernetes
- CDN (Cloudflare / AWS CloudFront)
- Monitoring (Grafana + Prometheus)

---

## Метрики успеха MVP

### Для операторов:
- **Время добавления первого склада**: <15 минут (target)
- **Конверсия регистрация → первый склад**: >60% (target)
- **Среднее время обработки заявки**: <5 минут (target)
- **Satisfaction score (NPS)**: >40 (target)

### Для платформы:
- **Время модерации склада**: <24 часа (target)
- **Uptime API**: >99.5% (target)
- **P95 API response time**: <500ms (target)
- **Mobile-friendly**: 100% функциональность на мобильных (target)

**Note**: All metrics are targets and subject to adjustment based on platform capabilities and business priorities.

---

## Контакты и поддержка

**Техническая поддержка**: support@platform.com  
**Документация**: https://docs.platform.com  
**Slack**: #operator-support  

**Note**: Contact information is illustrative and will be updated with actual values.

---

## Версионирование документа

| Версия | Дата | Изменения |
|--------|------|-----------|
| **v1.0** | 10.12.2025 | Первая полная версия (MVP scope) |
| **v1.1 (Hardened)** | 17.12.2025 | Scope hardening: Added Document Role & Scope, clarified AI/API/post-MVP status, multi-region disclaimers, terminology alignment |

---

## Связанные канонические документы

### Primary Authority Documents:
- **DOC-090** — User Stories & Acceptance Criteria (Feature Authority)
- **DOC-101** — Internal / Admin API Specification (API Authority)
- **DOC-092 / DOC-105** — AI Scoring & Risk Framework (AI Authority)
- **DOC-059** — Multi-Country & Multi-Region Architecture (Localization Authority)
- **Domain Glossary / Data Dictionary** (Terminology Authority)

### Supporting Documents:
- Project Brief Self Storage Aggregator
- Functional Specification MVP v1 Complete
- Technical Specification MVP Self Storage
- Technical Architecture Document FULL
- API Design Blueprint MVP v1
- Wireframes UX Structure
- Backend Implementation Plan
- Competitive Analysis Market Landscape
- CRM Lead Management System
- Legal Checklist Compliance Requirements
- Security and Compliance Plan
- Public Policies Pack

### Файлы спецификации OX (DOC-063):
- **Part 1**: Разделы 1-3 (Foundation)
- **Part 2**: Разделы 4-5 (Core Operations)
- **Part 3**: Разделы 6-7 (Business Logic)
- **Part 4**: Разделы 8-13 (Advanced & Technical)

---

**Конец главного оглавления**

Для работы с полным документом откройте соответствующие Part-файлы.

**⚠️ ВАЖНО**: Данный документ является **поддерживающей UX-спецификацией**, а не каноническим источником истины. Все технические решения должны согласовываться с соответствующими каноническими документами (DOC-090, DOC-101, DOC-092, DOC-059).
