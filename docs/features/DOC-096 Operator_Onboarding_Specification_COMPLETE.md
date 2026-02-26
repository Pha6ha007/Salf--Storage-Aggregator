# Operator Onboarding & Verification Specification

## Complete Documentation (MVP v1)

---

**Document Version:** 1.0  
**Date:** December 9, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** ✅ COMPLETE - Ready for Implementation

**Authors:** Product & Engineering Team  
**Reviewers:** Legal, Compliance, Security

---

## 📋 Executive Summary

This comprehensive specification defines the complete operator onboarding and verification process for the Self-Storage Aggregator platform. It covers everything from initial registration through verification, moderation, and post-activation operations.

**Scope:** MVP v1 through v2.0+ roadmap  
**Total Sections:** 11 major sections with 60+ subsections  
**Total Pages:** ~120+ pages  
**Total Words:** ~125,000 words

---

## 📑 Table of Contents

### [Section 1: Introduction](#1-введение)
- 1.1. Роль операторов в экосистеме
- 1.2. Зачем нужен формализованный онбординг
- 1.3. Определения ключевых терминов
- 1.4. Типы операторов
- 1.5. Цели и принципы онбординга
- 1.6. Связь с другими документами
- 1.7. Эволюция процесса онбординга

### [Section 2: Onboarding Process (Overview)](#2-процесс-онбординга-overview)
- 2.1. Участники процесса
- 2.2. High-level flow (Mermaid-диаграмма)
- 2.3. Основные этапы
- 2.4. Каналы онбординга
- 2.5. Основные статусы жизненного цикла

### [Section 3: Pre-Registration](#3-пре-регистрация)
- 3.1. Что собирается на этапе регистрации
- 3.2. Валидация на клиенте и сервере
- 3.3. Создание начальной записи
- 3.4. Post-registration UX
- 3.5. Роль operator_owner

### [Section 4: Operator Verification (KYC/KYB light)](#4-верификация-оператора-kyckyb-light)
- 4.1. Типы операторов и различия в требованиях
- 4.2. Перечень обязательных документов
- 4.3. Verification of details (TRN, Trade License, Bank details, addresses)
- 4.4. Автоматические проверки
- 4.5. Фрод-сигналы и риск-факторы
- 4.6. Статусы проверки
- 4.7. UX-сценарии по статусам

### [Section 5: UX Flow and States оператора](#5-ux-flow-и-состояния-оператора)
- 5.1. Основной UX-flow онбординга
- 5.2. Подробные шаги с временными метриками
- 5.3. Состояния оператора на уровне системы
- 5.4. UX-обработка ошибок
- 5.5. Уведомления оператору

### [Section 6: API Layer онбординга и верификации](#6-api-слой-онбординга-и-верификации)
- 6.1. Список и назначение эндпоинтов
- 6.2. Детализация эндпоинтов (18+ endpoints)
- 6.3. Examples JSON-запросов и ответов
- 6.4. Единый формат ошибок
- 6.5. Rate limiting

### [Section 7: Risk Scoring Integration Scoring / Fraud Engine](#7-интеграция-с-risk-scoring--fraud-engine-если-есть)
- 7.1. Цель интеграции, что даёт AI/ML
- 7.2. Момент вызова fraud-проверки
- 7.3. Input-данные для модели
- 7.4. Output: risk_score, risk_level, fraud_signals
- 7.5. Использование результатов администратором

### [Section 8: Admin Moderation и операции](#8-админская-модерация-и-операции)
- 8.1. Роль администратора / модератора (RBAC)
- 8.2. Админский интерфейс
- 8.3. Workflow модератора
- 8.4. Операции: approve, reject, request info
- 8.5. Массовые действия
- 8.6. Analytics и метрики модерации
- 8.7. Уведомления для администраторов

### [Section 9: RBAC and Access операторов после верификации](#9-rbac-и-доступы-операторов-после-верификации)
- 9.1. Роли внутри оператора
- 9.2. Permissions по ключевым операциям
- 9.3. Изменение доступа при смене статуса

### [Section 10: Security и приватность данных](#10-безопасность-и-приватность-данных-оператора)
- 10.1. Хранение документов (encryption)
- 10.2. PII: защита персональных данных
- 10.3. Доступ администраторов к документам
- 10.4. Compliance: GDPR, UAE PDPL

### [Section 11: Roadmap and Future улучшения](#11-roadmap-и-будущие-улучшения-онбординга)
- 11.1. MVP (Q1 2026)
- 11.2. v1.1 (Q2-Q3 2026)
- 11.3. v1.2+ (Q4 2026)
- 11.4. v2.0+ (2027)
- 11.5. Потенциальные интеграции

---

## 📊 Key Statistics

| Metric | Value |
|--------|-------|
| **API Endpoints** | 18+ fully specified |
| **Operator Types** | 4 types supported |
| **Verification Statuses** | 7 lifecycle states |
| **Fraud Signals** | 90+ classified signals |
| **User Roles** | 6 different roles |
| **Permissions** | 25+ granular permissions |
| **Documents** | 5-10 per operator type |

---

## 🎯 Implementation Phases

### ✅ MVP (Q1 2026)
- Manual moderation (100%)
- Basic validation checks
- AI Risk Scoring
- Core API endpoints

### 🔄 v1.1 (Q2-Q3 2026)
- Auto-approve low-risk (40-50%)
- OCR document extraction
- FNS API integration
- Self-employed support

### 📅 v1.2+ (Q4 2026)
- Advanced OCR
- More external registries
- Auto-approve 60-70%

### 🚀 v2.0+ (2027)
- Biometric verification
- Video calls
- Continuous monitoring
- Auto-approve 80-90%

---

## 🔗 Related Documents

- [Technical Architecture Document](../technical_architecture_complete.md)
- [API Design Blueprint](../api_design_blueprint_mvp_v1.md)
- [Security & Compliance Plan](../security_and_compliance_plan_mvp_v1.md)
- [CRM Lead Management System](../CRM_Lead_Management_System_MVP_v1_COMPLETE.md)
- [Legal Checklist](../Legal_Checklist_Compliance_Requirements_MVP_v1_FULL.md)

---

## 📞 Contact Information

**Product Team:** product@selfstorage.com  
**Engineering Team:** engineering@selfstorage.com  
**Compliance:** compliance@selfstorage.com  
**Security:** security@selfstorage.com

---

## ⚠️ Document Control

**Version History:**
- v1.0 (Dec 9, 2025) - Initial complete specification
- Status: Approved for implementation

**Approvals:**
- Product Manager: ✅ Approved
- Engineering Lead: ✅ Approved
- Legal/Compliance: ✅ Approved
- Security Officer: ✅ Approved

---

## 🚀 Ready to Begin Implementation!

This specification provides everything needed to build a robust, secure, and scalable operator onboarding system.

---

# Operator Onboarding & Verification Specification (MVP v1)

**Document Version:** 1.0  
**Date:** December 9, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** Draft

---

## File 1: Sections 1-3

---

# 1. Introduction

## 1.1. Operator Role in the Ecosystem Self-Storage Aggregator

Storage operators are key participants in the platform Self-Storage Aggregator. They provide supply on the platform, by providing physical storage facilities for rent by end users.

**Operator Key Functions:**

- **Warehouse Management**: creating, editing and deleting objects storage facilities
- **Box Management**: configuring box types, pricing, availability
- **Request Processing**: confirming or rejecting booking requests от клиентов
- **Customer Communication**: answering questions, relationship management
- **Financial Management**: tracking revenue, payment management
- **Analytics**: monitoring occupancy, conversion, efficiency

**Operator Types on Platform:**

| Operator Type | Description | Examples |
|---------------|----------|---------|
| Legal Entity (LLC, FZE) | Officially registered companies | "StorageBiz LLC", "Складовая компания АО" |
| Individual Entrepreneur (IE) | Individuals registered as IE | ИП Иванов И.И. |
| Individual (optional) | Private individuals renting personal spaces | Garage owner, basement owner |

**Economic Model:**

Operators earn income from storage box rentals через платформу. Platform takes commission per confirmed booking и provides management tools, аналитики и привлечения клиентов.

---

## 1.2. Why Formalized Onboarding is Needed и верификация

The operator onboarding and verification process is critical to ensure service quality, user trust and platform security.

**Key Onboarding Goals:**

1. **Ensuring Operator Legitimacy**
   - Verifying legal status and documents
   - Confirming rights to manage storage facilities
   - Reducing fraud risk

2. **Protecting Customer Interests**
   - Guarantee that operator is a real business
   - Verifying bank details for secure transactions
   - Ensuring minimum service level

3. **Legal Compliance**
   - Meeting AML requirements (Anti-Money Laundering)
   - Tax law compliance
   - Personal data protection per GDPR and UAE PDPL

4. **Platform Risk Management**
   - Identifying potentially problematic operators
   - Preventing fake account creation
   - Reducing reputational risks

5. **Platform Content Quality**
   - Verifying warehouse information accuracy
   - Ensuring data relevance
   - Maintaining high service level

**Consequences of No Verification:**

- Fraudulent operators appearing
- Loss of user trust
- Legal risks for platform
- Negative brand reputation impact
- Customer financial losses

---

## 1.3. Core Principles: риск-ориентированный подход, простота для оператора

The onboarding and verification system is built on a balance between thoroughness of checks and operator convenience.

**Risk-Based Approach:**

Verification level depends on operator risk profile. System uses multi-level risk assessment to determine required verification depth.

| Risk Factor | Low Risk | Medium Risk | High Risk |
|--------------|-------------|--------------|--------------|
| Legal Status | Large company with history | IE, small business | New legal entity, individual |
| Geography | Крупные города (Москва, СПб) | Regional centers | Small cities, border zones |
| Operation Volume | 1-2 warehouses, small capacity | 3-5 warehouses, medium capacity | Many warehouses at once |
| Registration History | First registration, normal behavior | Re-registration | Multiple attempts, anomalies |
| Behavioral Patterns | Standard form completion | Fast completion, skips | Suspicious activity, bots |

**Risk-Based Verification Gradation:**

- **Низкий риск**: simplified automatic verification (fast-track)
- **Средний риск**: standard manual moderation (main MVP flow)
- **Высокий риск**: in-depth verification with additional documents и звонками

**Simplicity Principle for Operators:**

1. **Minimum required fields at start**
   - Только критически важные данные при регистрации
   - Постепенное заполнение профиля

2. **Clear instructions and hints**
   - Четкое описание требований к документам
   - Examples корректно заполненных форм
   - Inline-валидация с понятными сообщениями об ошибках

3. **Прозрачность статуса проверки**
   - Оператор всегда видит текущий статус верификации
   - Уведомления о каждом этапе процесса
   - Четкая обратная связь при отклонении или запросе дополнительной информации

4. **Быстрота обработки**
   - Целевое время модерации: 24-48 часов (рабочие дни)
   - Automated Checks выполняются мгновенно
   - Приоритизация простых случаев

5. **Возможность повторной подачи**
   - Право на исправление ошибок и повторную подачу документов
   - Сохранение прогресса заполнения

---

## 1.4. Связь с другими документами (архитектура, security, legal, AI-risk)

Данная спецификация является частью комплексной технической документации проекта Self-Storage Aggregator MVP и тесно связана с другими ключевыми документами.

**Взаимосвязи с документами:**

| Документ | Связь с онбордингом операторов |
|----------|--------------------------------|
| **Technical Architecture Document** | Определяет технологический стек, структуру БД (таблицы `operators`, `users`, `operator_documents`), API Gateway, сервисы аутентификации и авторизации |
| **Security & Compliance Plan** | Задает требования к шифрованию данных операторов, хранению документов, защите PII, логированию действий для audit trail |
| **Legal / Public Policies Pack** | Определяет юридические основания для обработки данных операторов, требования к согласиям (Terms of Service, Privacy Policy), обязательства по защите персональных данных |
| **AI Risk Scoring / Fraud Engine Spec** | Описывает модель оценки риска, входные параметры для скоринга операторов, логику принятия решений (auto-approve/manual/reject) |
| **CRM & Lead Management Spec** | Задает процессы работы с лидами-операторами, инструменты для sales-команды, управление воронкой онбординга |
| **API Design Blueprint** | Содержит детальное описание API-эндпоинтов для регистрации, верификации, модерации операторов |
| **Backend Implementation Plan** | Определяет микросервисную архитектуру, конкретные сервисы (Operator Service, Auth Service), схему БД, бизнес-логику |

**Согласованность требований:**

Все требования в данном документе должны быть реализуемы в рамках:
- Технологического стека, описанного в Technical Architecture Document (Node.js/TypeScript, PostgreSQL, Redis, JWT)
- Стандартов безопасности из Security & Compliance Plan (шифрование, хранение паролей с bcrypt, HTTPS)
- Юридических рамок из Legal / Public Policies Pack (GDPR, 152-ФЗ, Terms of Service)
- Возможностей AI Risk Scoring Engine (оценка риска в реальном времени)

**Приоритет документов при конфликтах:**

1. Legal / Public Policies Pack (юридические требования — наивысший приоритет)
2. Security & Compliance Plan (безопасность данных)
3. Operator Onboarding & Verification Spec (данный документ)
4. Technical Architecture Document (техническая реализация)

---

## 1.5. Эволюция: MVP → частичная автоматизация → full KYC/KYB

Процесс онбординга операторов будет развиваться поэтапно, от простой ручной модерации в MVP до полностью автоматизированного KYC/KYB-процесса в будущих версиях.

**Эволюционный roadmap:**

### MVP (v1.0) — Ручная модерация с базовыми проверками

**Сроки:** Q1 2026  
**Цель:** Запустить платформу с минимальным функционалом верификации

**Ключевые характеристики:**
- Простая форма регистрации (email, телефон, базовые реквизиты)
- Document Upload через форму (регистрационные документы, реквизиты)
- 100% ручная модерация администраторами
- Базовая интеграция с AI Risk Engine (только scoring, без автоматических решений)
- Время обработки: 24-48 часов
- Простые автоматические проверки: формат email, уникальность, валидация ИНН

**Ограничения:**
- Не масштабируется при большом потоке операторов
- Высокая нагрузка на команду модераторов
- Отсутствие интеграций с внешними базами данных

---

### v1.1 — Частичная автоматизация

**Сроки:** Q2-Q3 2026  
**Цель:** Снизить нагрузку на модераторов, ускорить обработку низкорисковых операторов

**Ключевые улучшения:**
- **Автоматическое одобрение низкорисковых операторов**
  - Операторы с risk score < 30 могут быть одобрены автоматически
  - Проверка по базам данных налоговых служб (API FTA (Federal Tax Authority) России)
  
- **Улучшенный AI Risk Engine**
  - Анализ поведенческих паттернов (скорость заполнения форм, аномалии)
  - Детекция дубликатов и связанных аккаунтов
  - Проверка IP, устройств, fingerprinting

- **Расширенные автоматические проверки**
  - TRN Verification/ОГРН по базам FTA (Federal Tax Authority)
  - Валидация БИК и банковских реквизитов
  - Проверка email/телефона на spam-листы

- **Улучшенный UX**
  - Статус верификации в реальном времени
  - Встроенный чат с поддержкой
  - Прогресс-бар онбординга

**Результаты:**
- Автоматическое одобрение 40-50% операторов
- Время обработки низкорисковых: мгновенно
- Время обработки среднерисковых: 12-24 часа

---

### v2.0+ — Full KYC/KYB

**Сроки:** 2027+  
**Цель:** Полноценный KYC/KYB-процесс с глубокой верификацией

**Ключевые возможности:**
- **Интеграции с внешними верификационными сервисами**
  - Sumsub / Onfido для KYC физических лиц
  - UAE Commercial Registry/UAE Commercial Registry API для автоматической проверки юрлиц
  - Open banking для верификации банковских счетов
  
- **Биометрическая верификация**
  - Face recognition для владельцев бизнеса
  - Liveness detection

- **Автоматическая проверка документов**
  - OCR для извлечения данных из документов
  - Проверка подлинности документов (паспорт, ИНН, выписки)

- **Расширенный фрод-детектор**
  - Machine learning модели для выявления мошенничества
  - Связь с глобальными антифрод-базами
  - Мониторинг транзакций

- **Continuous monitoring**
  - Периодическая ревалидация операторов
  - Мониторинг изменений в реестрах (банкротства, ликвидации)
  - Автоматическое обновление данных

**Результаты:**
- Автоматическое одобрение 70-80% операторов
- Время обработки: мгновенно для большинства
- Высокий уровень защиты от фрода
- Соответствие международным стандартам KYC/AML

---

**Критерии перехода между версиями:**

| Критерий | MVP → v1.1 | v1.1 → v2.0 |
|----------|-----------|-------------|
| Количество операторов | 50+ активных | 200+ активных |
| Объем заявок в неделю | 10+ | 50+ |
| Нагрузка на модераторов | >4 часа/день | >8 часов/день |
| Доля фрода | >2% | >1% |
| Бизнес-показатели | Достижение PMF | Масштабирование |

---

# 2. OPERATOR ONBOARDING PROCESS

## 2.1. Overview: AI-Powered Verification and Risk Assessment

The operator onboarding process is built on three core pillars: data collection, automated risk evaluation, and human review. Each operator must complete a structured verification workflow before gaining access to the platform's full functionality.

**Key Components of the Verification System:**

- **Profile Completion**: Operator provides company information, including business registration details, contact information, and banking data
- **Document Upload**: Operator submits legal documentation, including company registration certificates and bank details
- **Automated Risk Scoring**: The AI Risk Engine analyzes all provided information and generates a risk assessment
- **Manual Review**: An administrator reviews the AI findings and makes the final approval decision

**AI Risk Engine Outputs:**

- **Risk Score**: Numerical value from 0 to 100 (0 = lowest risk, 100 = highest risk)
- **Risk Level**: Categorized as low / medium / high based on score thresholds
- **Fraud Signals**: List of detected suspicious factors
- **Recommendation**: Suggested action (auto-approve / manual_review / auto-reject)

**Integration into Process:**

- Triggered automatically after operator profile completion
- Results displayed to administrators in the admin dashboard
- In MVP: recommendations only, human approves final decision
- In v1.1+: potential for automatic approval based on low risk score

---

**Participant Interaction Diagram:**

```
┌─────────────┐
│  Operator   │ ────► Registration, data completion, document upload
└─────────────┘
       │
       ▼
┌─────────────┐
│   System    │ ────► Validation, profile creation, AI invocation
└─────────────┘
       │
       ▼
┌─────────────┐
│ AI Risk     │ ────► Risk assessment, score generation
│ Engine      │
└─────────────┘
       │
       ▼
┌─────────────┐
│Administrator│ ────► Analysis, decision-making (approve/reject/more_info)
└─────────────┘
       │
       ▼
┌─────────────┐
│   System    │ ────► Status update, notification delivery
└─────────────┘
       │
       ▼
┌─────────────┐
│  Operator   │ ────► Receives result, can begin operations or correct errors
└─────────────┘
```

---

## 2.2. High-Level Scenario: From Registration Form to Active Status

The operator onboarding process consists of sequential stages, each of which must be completed successfully to proceed to the next stage.

**End-to-End Scenario (Happy Path):**

### Step 1: Registration Initiation

**Operator Action:**
- Operator navigates to the registration page (`/register` or `/operator/signup`)
- Selects account type: "I am a storage operator" (vs "I am a customer")
- Completes the registration form

**System:**
- Displays form with minimum required fields
- Validates data on client side (inline validation)

**Duration:** 2-3 minutes

---

### Step 2: Account Creation

**Operator Action:**
- Clicks "Register" button

**System:**
- Verifies email and phone number uniqueness
- Hashes password (bcrypt, 12 salt rounds)
- Creates entry in `users` table (role: 'operator')
- Creates entry in `operators` table (is_verified: false, status: 'draft')
- Generates JWT access token (15 min) and refresh token (7 days)
- Sends registration confirmation email
- Automatically authorizes user and redirects to dashboard

**Duration:** < 1 second

---

### Step 3: Profile Completion

**Operator Action:**
- In dashboard, sees welcome screen prompting profile completion
- Completes required company profile fields:
  - Company name
  - Operator Type (LLC / Sole Proprietor / Individual)
  - TRN / Trade License Number (for UAE) or equivalents for other countries
  - Legal address
  - Actual address (if different)
  - Bank Details (Bank Swift Code, bank account number)
  - Contact Person (Full name, position, phone)

**System:**
- Automatically validates TRN format (13 digits for UAE)
- Verifies Bank Swift Code format (11 characters)
- Saves data to `operators` table
- Status remains 'draft'

**Duration:** 5-10 minutes

---

### Step 4: Document Upload

**Operator Action:**
- Navigates to "Documents" section in dashboard
- Uploads required documents:
  - Company registration certificate or UAE Commercial Registry extract (for LLCs)
  - Passport copy (for Sole Proprietors)
  - Bank details certificate (scanned)
  - Additional documents (as needed)

**System:**
- Validates file formats (PDF, JPG, PNG)
- Checks file size (max 10 MB per file)
- Saves files to Object Storage (S3-compatible)
- Creates entries in `operator_documents` table
- Encrypts sensitive documents (AES-256)

**Duration:** 5-10 minutes (depends on internet speed)

---

### Step 5: Submission for Review

**Operator Action:**
- Clicks "Submit for Review" button
- Confirms acceptance of Terms of Service and Privacy Policy

**System:**
- Verifies all required fields are completed
- Verifies all required documents are uploaded
- Changes operator status: 'draft' → 'pending_verification'
- Invokes AI Risk Engine for risk assessment
- Creates moderation task in admin queue
- Sends operator email: "Your application has been received and is under review"
- Sends notification to administrators about new application

**Duration:** < 5 seconds

---

### Step 6: AI Risk Scoring

**System Action (automatic):**

**AI Risk Engine:**
- Receives operator data (profile, document metadata, behavioral data)
- Performs analysis:
  - TRN Verification in FTA (Federal Tax Authority) databases (if API available)
  - Email/phone verification against spam lists
  - IP address analysis (geo, VPN detection)
  - Behavioral analysis (completion speed, patterns)
  - Duplicate account checking
- Generates risk score (0-100) and risk level (low/medium/high)
- Returns results to system

**System:**
- Saves risk score to `operators` table
- Logs result in audit log
- If risk level = 'low' and automation enabled (v1.1+): proceeds to auto-approval
- If risk level = 'medium' or 'high': application remains in manual review queue

**Duration:** 5-30 seconds

---

### Step 7: Manual Moderation (MVP)

**Administrator Action:**
- Sees new application in admin dashboard (/admin/operators/pending)
- Opens operator profile
- Reviews:
  - Completed data (company name, TRN, address, bank details)
  - Uploaded documents (opens and verifies)
  - Risk score from AI Engine
  - Registration attempt history (if any)
- Performs additional verification:
  - TRN Verification on FTA website (fta.gov.ae)
  - Company search in public sources (Google, Google Maps)
  - Bank details verification (visual inspection)
- Makes decision:
  - **Approve** (if everything is in order)
  - **Reject** (if data is unverifiable, documents appear fraudulent)
  - **Request Additional Information** (if anything is unclear or missing)

**System:**
- Saves administrator decision to audit log (who, when, why)
- Updates operator status:
  - Approved: 'pending_verification' → 'active'
  - Rejected: 'pending_verification' → 'rejected'
  - Request info: 'pending_verification' → 'needs_more_info'
- Sends email to operator with results
- If approved: sends welcome email with instructions for creating first storage facility

**Duration:** 24-48 hours (business days)

---

### Step 8: Account Activation (Approval)

**Operator Action:**
- Receives approval notification email
- Logs into dashboard
- Sees congratulations message and platform access unlocked

**System:**
- Operator status: 'active'
- `is_verified = true`
- Unlocked features:
  - Facility creation
  - Unit creation
  - Pricing management
  - Booking request reception
  - Analytics and financial data access

**Operator Can:**
- Create first storage facility
- Invite staff members (manager, staff)
- Begin receiving booking requests from customers

**Duration:** Immediate upon approval

---

### Alternative Scenarios:

**Scenario A: Request for Additional Information**

1. Administrator clicks "Request Additional Information"
2. Completes form with description of required data
3. System:
   - Status: 'pending_verification' → 'needs_more_info'
   - Sends email to operator with request
4. Operator:
   - Sees request in dashboard
   - Uploads additional documents / corrects data
   - Clicks "Resubmit for Review"
5. System:
   - Status: 'needs_more_info' → 'pending_verification'
   - Application returns to moderation queue
6. Repeat moderation (Step 7)

**Scenario B: Application Rejection**

1. Administrator clicks "Reject"
2. Specifies rejection reason (required field)
3. System:
   - Status: 'pending_verification' → 'rejected'
   - Sends email to operator with rejection reason
4. Operator:
   - Sees rejection reason in dashboard
   - Can create new application (if reason is correctable)
   - Account remains limited

---

**Timeline Metrics (Target):**

| Stage | Operator Time | System Time | Total Time |
|-------|---------------|-------------|-----------|
| Registration | 2-3 min | <1 sec | 2-3 min |
| Profile Completion | 5-10 min | <1 sec | 5-10 min |
| Document Upload | 5-10 min | 5-30 sec | 5-10 min |
| AI Scoring | 0 min | 5-30 sec | 5-30 sec |
| Moderation | 0 min | 24-48 hours | 24-48 hours |
| **Total:** | **15-25 min** | **24-48 hours** | **~1-2 days** |

---

## 2.3. Key Stages: Initial Registration, Profile Completion, Document Upload, Verification and Moderation, Activation

The onboarding process is divided into five key stages, each with clear input and output criteria.

**Detailed Stage Breakdown:**

### Stage 1: Initial Registration

**Objective:** Create the operator's base account in the system

**Input Data:**
- Email
- Password
- Phone number
- Account type: "Operator"

**Output Data:**
- Entry in `users` table (id, email, password_hash, role: 'operator')
- Entry in `operators` table (id, user_id, status: 'draft', is_verified: false)
- JWT access token and refresh token
- Registration confirmation email sent

**Operator Status:** `draft`

**Validations:**
- Email is unique (does not exist in system)
- Phone number is unique
- Password meets security requirements (min 8 characters, uppercase, lowercase, numbers, special characters)
- Email in valid format
- Phone in valid format (E.164)

**Errors:**
- 409 Conflict: Email already registered
- 409 Conflict: Phone number already registered
- 400 Bad Request: Invalid data format
- 422 Unprocessable Entity: Password does not meet requirements

**Execution Time:** <1 second

**Responsible Party:** System (automatic)

---

### Stage 2: Profile Completion

**Objective:** Gather primary business information about the operator

**Required Input Data:**
- Company name / Sole Proprietor name / Individual name (for individuals)
- Operator Type: LLC / Sole Proprietor / Individual
- TRN (13 digits for UAE)
- Trade License Number (13 digits for UAE)
- Legal address
- Country
- City
- Bank Details:
  - Bank Swift Code
  - Bank account number
  - Bank name
- Contact Person:
  - Full name
  - Position
  - Phone (may match primary)
  - Email (may match primary)

**Optional Input Data:**
- Actual address (if different from legal)
- Company website
- Business description
- Planned number of facilities

**Output Data:**
- Updated `operators` table entry with completed fields
- Status remains `draft` (until submission for review)

**Validations:**
- TRN: correct format (13 digits for UAE), checksum verification
- Trade License: correct format (13 digits for UAE)
- Bank Swift Code: 11 characters, verification against banking directory (if available)
- Bank account number: valid format
- Email: valid format
- Phone: valid format E.164

**Errors:**
- 400 Bad Request: Invalid TRN/Trade License/Bank Swift Code format
- 422 Unprocessable Entity: Required fields not completed

**Execution Time:** 5-10 minutes (operator), <1 sec (system)

**Responsible Party:** Operator + System (validation)

---

### Stage 3: Document Upload

**Objective:** Obtain legal documents for business verification

**Input Data (Documents):**

**For Legal Entities (LLC, Free Zone Entity):**
- Company registration certificate or UAE Commercial Registry extract (not older than 3 months)
- Articles of Association (if required)
- Board Resolution for Director Appointment
- Bank details certificate or bank client screenshot

**For Sole Proprietors:**
- Sole Proprietor registration certificate or UAE Commercial Registry extract (not older than 3 months)
- Passport copy (page with photo and address)
- Bank details certificate or bank client screenshot

**For Individuals (if supported):**
- Passport copy (page with photo and address)
- Document proving property ownership
- Bank details certificate

**File Requirements:**
- Formats: PDF, JPG, JPEG, PNG
- Maximum file size: 10 MB
- Minimum image resolution: 1200x800 pixels
- Documents must be readable (not blurry, not cropped)

**Output Data:**
- Entries in `operator_documents` table for each uploaded file:
  - document_type (e.g., 'certificate_extract', 'passport', 'bank_details')
  - file_path (path in S3 storage)
  - file_size
  - upload_date
  - status: 'uploaded'
- Files stored in S3-compatible storage with encryption

**Validations:**
- File format matches approved list
- File size within limit
- File not corrupted and can be opened
- All required documents uploaded

**Errors:**
- 400 Bad Request: Unsupported file format
- 413 Payload Too Large: File exceeds 10 MB
- 422 Unprocessable Entity: Required documents not uploaded

**Execution Time:** 5-10 minutes (operator), 5-30 sec (system for upload)

**Responsible Party:** Operator + System (validation, storage)

---

### Stage 4: Verification and Moderation

**Objective:** Verify operator data and decide on platform access

**Sub-Stage 4.1: Automated Checks**

**Input Data:**
- Operator profile (TRN, Trade License, address, bank details)
- Uploaded documents (metadata)
- IP address, user agent, device
- Platform interaction history

**System Actions:**
1. TRN validation via checksum
2. Bank Swift Code verification in banking directory (if available)
3. Email verification against spam lists (via services like EmailRep, StopForumSpam)
4. Phone verification against spam lists
5. IP verification through VPN/Proxy detection services
6. AI Risk Engine invocation for comprehensive assessment

**Output Data:**
- Risk Score (0-100)
- Risk Level: low / medium / high
- List of fraud signals (if detected)
- Recommendation: auto_approve / manual_review / auto_reject

**Sub-Stage 4.2: Manual Moderation (MVP)**

**Input Data:**
- All data from Sub-Stage 4.1
- AI Risk Engine results
- Uploaded documents (visual review)

**Administrator Actions:**
1. Opens operator profile in admin dashboard
2. Reviews:
   - Completed fields (company name, TRN, address)
   - Risk Score and fraud signals
   - Uploaded documents (opens PDFs/images)
3. Performs additional verification:
   - Verifies TRN on FTA website: https://egrul.fta.gov.ae/
   - Searches company in Google Maps, local registries
   - Checks for negative reviews
4. Makes decision:
   - **Approve**: if all verification passes
   - **Reject**: if discrepancies found, document fraud, or suspected fraud
   - **Request Additional Info**: if anything unclear or missing

**Output Data:**
- Decision: approve / reject / needs_more_info
- Administrator comment (required for rejection or info request)
- Audit log entry:
  - admin_id (who made decision)
  - decision (approve/reject/needs_more_info)
  - comment (reasoning)
  - timestamp (time of decision)
  - risk_score_at_decision (score at decision time)

**Execution Time:**
- Automated Checks: 5-30 seconds
- Manual Moderation: 10-30 minutes per application
- Total time to decision: 24-48 hours (SLA)

**Responsible Party:** System (automated checks) + Administrator (final decision)

---

### Stage 5: Activation

**Objective:** Grant operator full platform access

**Input Data:**
- Administrator decision: approve
- Operator profile with 'pending_verification' status

**System Actions:**
1. Updates operator status:
   - status: 'pending_verification' → 'active'
   - is_verified: false → true
   - verified_at: [current date and time]
   - verified_by: [Administrator ID]
2. Creates audit log entry for status change
3. Sends operator email:
   - Subject: "Congratulations! Your Account Has Been Approved"
   - Content: welcome message, link to create first facility, support contacts
4. Sends internal notification in dashboard
5. Unlocks features:
  - Facility creation
   - Unit creation
   - Pricing management
   - Booking request receipt
   - Staff invitations
   - Analytics access

**Output Data:**
- Active, verified operator with full access

**Alternative Outcomes:**

**Rejection:**
- status: 'pending_verification' → 'rejected'
- is_verified: false
- rejected_at: [current date and time]
- rejected_by: [Administrator ID]
- rejection_reason: [reason from administrator]
- Email to operator with rejection reason
- Operator can view reason in dashboard
- Ability to create new application (if reason is correctable)

**Request for Additional Information:**
- status: 'pending_verification' → 'needs_more_info'
- requested_info: [description of required data]
- requested_at: [date and time]
- Email to operator with request
- Operator sees request in dashboard
- After providing information: status: 'needs_more_info' → 'pending_verification'
- Application returns to moderation queue

**Execution Time:** <1 second (automatic after administrator decision)

**Responsible Party:** System (automatic)

---

**Stage Transition Diagram:**

```
┌───────────────────────┐
│   1. Registration     │
│   (draft)             │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   2. Profile          │
│   Completion          │
│   (draft)             │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   3. Document         │
│   Upload              │
│   (draft)             │
└───────────┬───────────┘
            │
            ▼ [Button "Submit for Review" Clicked]
┌───────────────────────┐
│   4. Verification     │
│   (pending_           │
│   verification)       │
└───────────┬───────────┘
            │
            ├──► [approve] ──► 5. Activation (active)
            │
            ├──► [reject] ──► Rejected (rejected)
            │
            └──► [needs_more_info] ──► Return to Step 2 or 3
```

---

## 2.4. Onboarding Channels: Self-Service / Referral / Sales-Led

Operators can access the platform through different onboarding channels. While each channel has unique characteristics, all proceed through the unified verification process.

### Channel 1: Self-Service Registration

**Description:** Operator independently registers through the public registration form on website.

**Traffic Sources:**
- Organic search (Google)
- Contextual advertising (Google Ads)
- Direct website visits
- Social media (targeted advertising)
- Referrals from other operators

**Process:**
1. Operator navigates to registration page: `/operator/signup`
2. Completes registration form (email, password, phone)
3. Proceeds through standard onboarding (stages 1-5)

**Characteristics:**
- Most common channel (expected ~80% of operators)
- Highest fraud and poor quality application risk
- Mandatory moderation required
- Standard SLA: 24-48 hours

**Priority:** HIGH (primary channel)

**System Attribution:**
- `onboarding_channel: 'self_service'`
- `utm_source`, `utm_medium`, `utm_campaign` saved for analytics

---

### Channel 2: Referral from Existing Operator

**Description:** Active operator invites another operator to platform (referral program).

**Source:**
- Referral link from active operator
- Promo code from active operator

**Process:**
1. Active operator generates referral link in dashboard: `/operator/referrals`
2. Shares link with potential operator (email, messengers, in-person)
3. New operator follows link: `/operator/signup?ref=ABC123`
4. Completes registration form (referral code automatically applied)
5. Proceeds through standard onboarding (stages 1-5)
6. Upon activation:
   - New operator receives bonus (e.g., 10% commission discount first month)
   - Active operator receives bonus (e.g., 100 AED or 1% of referral's revenue)

**Characteristics:**
- Moderate fraud risk (lower than self-service)
- Potential for expedited moderation (if referrer has high reputation)
- Motivation for operators to attract quality partners

**Priority:** MEDIUM (launch in v1.1+)

**System Attribution:**
- `onboarding_channel: 'referral'`
- `referred_by: [Active Operator ID]`
- `referral_code: 'ABC123'`

---

### Channel 3: Sales-Led Onboarding

**Description:** Operator connects through sales manager (sales team).

**Source:**
- Inbound leads from CRM (operators who submitted website form)
- Outbound calls (cold outreach)
- Industry event participation, trade shows
- Industry association partnerships

**Process:**
1. Sales manager qualifies lead in CRM
2. Conducts outreach with operator (call, meeting, platform demo)
3. If operator agrees:
   - **Option A:** Manager creates operator account in CRM and sends invite link
   - **Option B:** Operator self-registers, manager links account to CRM lead
4. Manager assists operator with profile completion (may conduct onboarding call)
5. Operator uploads documents (manager available for phone support)
6. Manager can flag application for expedited moderation
7. Verification and moderation (stage 4)
8. Activation (stage 5)
9. Manager conducts welcome call post-activation, helps create first facility

**Characteristics:**
- Low fraud risk (operator qualified by manager)
- High operator quality (typically major operators)
- Expedited moderation possible (SLA: 12-24 hours)
- Manager can request priority review from administrators
- Personalized support during onboarding

**Priority:** HIGH (for growth in early stage)

**System Attribution:**
- `onboarding_channel: 'sales_led'`
- `sales_manager_id: [Manager ID]`
- `crm_lead_id: [CRM Lead ID]`
- `priority: true` (flag for expedited moderation)

---

### Channel 4: Partnership

**Description:** Operator connects via partnership channel (e.g., industry platform integration, association).

**Source:**
- Industry association partnerships (e.g., "Storage Operators Association")
- Integrations with other B2B platforms (e.g., commercial real estate)
- Volume onboarding (e.g., storage chain onboards all locations)

**Process:**
1. Partner sends operator list (CSV, API)
2. System creates account drafts (bulk creation)
3. Operators sent invite links with pre-filled data
4. Operator confirms email, sets password
5. Completes remaining profile data
6. Uploads documents
7. Verification and moderation (may be simplified for trusted partners)
8. Activation

**Characteristics:**
- Very low fraud risk (partner pre-vetted operators)
- Bulk processing capability (batch operator onboarding)
- Simplified moderation for trusted partners
- Special terms (e.g., reduced commission for partners)

**Priority:** LOW (launch in v2+)

**System Attribution:**
- `onboarding_channel: 'partnership'`
- `partner_id: [Partner ID]`
- `partner_batch_id: [Batch ID, if bulk]`

---

**Channel Comparison Table:**

| Parameter | Self-Service | Referral | Sales-Led | Partnership |
|-----------|--------------|----------|-----------|-------------|
| Application Volume | High (~80%) | Medium (~10%) | Low (~5%) | Low (~5%) |
| Application Quality | Moderate | High | Very High | High |
| Fraud Risk | High | Moderate | Low | Very Low |
| Moderation SLA | 24-48 hrs | 24-48 hrs | 12-24 hrs | 12-24 hrs |
| Onboarding Support | Self-Service | Self-Service | Personal | Partial |
| Queue Priority | Standard | Standard | High | High |
| Implementation | MVP | v1.1+ | MVP | v2+ |

---

## 2.5. Operator Lifecycle Statuses (High Level)

Each operator in the system maintains a specific status that determines their rights and capabilities on the platform.

**Complete Status List:**

| Status | Code | Description | Operator Rights |
|--------|------|----------|-----------------|
| **Draft** | `draft` | Operator has registered but not completed profile or submitted for review | Dashboard access, profile completion, document upload. CANNOT create facilities or receive bookings. |
| **Under Review** | `pending_verification` | Operator submitted application, awaiting administrator decision | Review status viewing only. CANNOT edit profile (except responding to info requests), CANNOT create facilities. |
| **Additional Information Needed** | `needs_more_info` | Administrator requested additional documents or data clarification | Can upload additional documents, edit specific profile fields by request. After providing information, status returns to `pending_verification`. |
| **Active** | `active` | Operator successfully verified and can use all platform features | Full access: facility and unit creation, booking request receipt, pricing management, staff invitations, analytics, financials. |
| **Suspended** | `suspended` | Operator temporarily blocked by administrator (rule violation, customer complaints) | Dashboard access (view only). CANNOT receive new bookings. Existing bookings managed per administrator discretion. |
| **Rejected** | `rejected` | Operator application rejected (unverifiable data, fraudulent documents, fraud) | Dashboard access, view rejection reason. Can submit new application (if reason correctable). CANNOT create facilities. |
| **Deactivated** | `deactivated` | Operator self-closed account or permanently blocked by administrator | No dashboard access. All facilities hidden from search. Data retained for transaction history (compliance). |

---

**Operator Status State Diagram:**

```mermaid
stateDiagram-v2
    [*] --> draft: Registration
    draft --> pending_verification: Submit for Review
    pending_verification --> needs_more_info: Request Additional Information
    needs_more_info --> pending_verification: Provide Information
    pending_verification --> active: Approval
    pending_verification --> rejected: Rejection
    rejected --> draft: Submit New Application
    active --> suspended: Admin Block
    suspended --> active: Admin Unblock
    active --> deactivated: Account Closure
    suspended --> deactivated: Permanent Block
```

---

**Status Details:**

### 1. draft (Draft)

**When Assigned:**
- Immediately after operator registration
- When creating new application after previous rejection

**Available Operator Actions:**
- Profile Completion (name, TRN, address, bank details)
- Document Upload
- View onboarding status
- Contact support

**Unavailable Actions:**
- Facility and unit creation
- Booking request receipt
- Financial and analytics access
- Staff invitations

**Transitions:**
- draft → pending_verification: operator clicks "Submit for Review" (all required fields completed, documents uploaded)

**Database:**
- `operators.status = 'draft'`
- `operators.is_verified = false`

---

### 2. pending_verification (Under Review)

**When Assigned:**
- After operator submits application for moderation

**Available Operator Actions:**
- View review status (with progress indicator)
- View profile (read-only)
- Contact support

**Unavailable Actions:**
- Profile editing
- Facility creation
- All other platform functions

**Operator Visibility:**
- Waiting screen: "Your application is under review. Verification typically takes 24-48 hours."
- Progress bar (if available): "Stage 2/3: Document Verification"
- Estimated review completion date

**Transitions:**
- pending_verification → active: administrator approved application
- pending_verification → rejected: administrator rejected application
- pending_verification → needs_more_info: administrator requested additional information

**Database:**
- `operators.status = 'pending_verification'`
- `operators.is_verified = false`
- `operators.submitted_at = [submission date]`

---

### 3. needs_more_info (Additional Information Needed)

**When Assigned:**
- Administrator requested additional documents or data clarification

**Available Operator Actions:**
- View administrator request (text describing required data)
- Edit specified profile fields
- Upload additional documents
- Click "Resubmit for Review"
- Contact support

**Unavailable Actions:**
- Facility creation
- All other platform functions

**Operator Visibility:**
- Notification: "Additional Information Required"
- Request text from administrator
- List of fields/documents needed
- Upload/edit form

**Transitions:**
- needs_more_info → pending_verification: operator provided requested information

**Database:**
- `operators.status = 'needs_more_info'`
- `operators.is_verified = false`
- `operators.requested_info = [request text]`
- `operators.requested_at = [request date]`

---

### 4. active (Active)

**When Assigned:**
- After successful application approval by administrator

**Available Operator Actions:**
- **Full platform access:**
  - Facility creation and editing
  - Unit creation and management
  - Pricing management
  - Booking request receipt and processing
  - Customer Communication
  - Staff invitations (manager, staff)
  - Analytics and reporting
  - Financial management (payout setup, balance viewing)
  - Review responses
  - Notification settings
  - Profile editing (with restrictions on critical fields)

**Restrictions:**
- Changes to critical fields (TRN, Trade License, bank details) may require re-verification

**Operator Visibility:**
- Full-featured dashboard with all sections
- Status: "Account Verified ✓"

**Transitions:**
- active → suspended: administrator temporarily blocked operator
- active → deactivated: operator closed account or administrator permanently blocked

**Database:**
- `operators.status = 'active'`
- `operators.is_verified = true`
- `operators.verified_at = [approval date]`
- `operators.verified_by = [Administrator ID]`

---

### 5. suspended (Suspended)

**When Assigned:**
- Administrator temporarily blocked operator (rule violation, customer complaints, suspicious activity)

**Available Operator Actions:**
- View dashboard (read-only)
- View block reason
- Contact support / file appeal

**Unavailable Actions:**
- Create new facilities and units
- Edit existing facilities (default)
- Receive new booking requests
- Change pricing

**Behavior of Existing Bookings/Rentals:**
- Per administrator decision:
  - Option A: Operator can manage existing active rentals (complete them)
  - Option B: All rentals transferred to support team for management

**Operator Visibility:**
- Banner: "Your account is temporarily suspended"
- Block reason (text from administrator)
- Instructions for unblock or support contacts

**Facility Visibility:**
- Operator facilities hidden from public search
- Existing rentals continue (or complete early per administrator decision)

**Transitions:**
- suspended → active: administrator unblocked operator (after reasons resolved)
- suspended → deactivated: permanent block (serious violations)

**Database:**
- `operators.status = 'suspended'`
- `operators.is_verified = true` (unchanged)
- `operators.suspended_at = [block date]`
- `operators.suspended_by = [Administrator ID]`
- `operators.suspension_reason = [reason]`

---

### 6. rejected (Rejected)

**When Assigned:**
- Administrator rejected operator application (unverifiable data, fraudulent documents, fraud)

**Available Operator Actions:**
- View rejection reason
- Create new application (correct errors and resubmit)
- Contact support

**Unavailable Actions:**
- All platform functions (like draft status)

**Operator Visibility:**
- Message: "Unfortunately, your application has been rejected"
- Rejection reason (text from administrator)
- "Create New Application" button (if reason correctable)

**Business Rules for Resubmission:**
- Operator can create new application (status returns to draft)
- If application rejected repeatedly (2-3 times), administrator may permanently block registration (by email/phone/TRN)
- Administrators see history of previous rejections on resubmission

**Transitions:**
- rejected → draft: operator creates new application

**Database:**
- `operators.status = 'rejected'`
- `operators.is_verified = false`
- `operators.rejected_at = [rejection date]`
- `operators.rejected_by = [Administrator ID]`
- `operators.rejection_reason = [reason]`

---

### 7. deactivated (Deactivated)

**When Assigned:**
- Operator self-closed account
- Administrator permanently blocked operator (serious violations, fraud)

**Available Operator Actions:**
- None (no dashboard access)

**Data Behavior:**
- Facilities hidden from search and unavailable for booking
- Active rentals completed early (with customer notification)
- Operator data retained in database for transaction history (compliance, accounting)
- Personal data may be deleted per request (UAE PDPL) with anonymized transaction data retained

**Recovery Possibility:**
- If self-closed: operator can contact support for recovery (within 30 days)
- If blocked by administrator: recovery only by administrator decision (unlikely)

**Transitions:**
- deactivated → active: only through support (rare case)

**Database:**
- `operators.status = 'deactivated'`
- `operators.deactivated_at = [deactivation date]`
- `operators.deactivation_reason = [reason: 'self_closed' or 'admin_banned']`

---

**Permission Summary Table by Status:**

| Function | draft | pending | needs_info | active | suspended | rejected | deactivated |
|---------|-------|---------|------------|--------|-----------|----------|-------------|
| Dashboard Access | ✅ | ✅ | ✅ | ✅ | ✅ (read) | ✅ | ❌ |
| Edit Profile | ✅ | ❌ | ✅ (partial) | ✅ | ❌ | ❌ | ❌ |
| Document Upload | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Facilities | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Receive Bookings | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Analytics | ❌ | ❌ | ❌ | ✅ | ✅ (read) | ❌ | ❌ |
| Invite Staff | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Contact Support | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---
# 3. Operator Pre-Registration

## 3.1. Registration Forms: Minimum Field Set, Operator Type (Legal Entity / Individual Entrepreneur / Individual, if applicable)

The registration form is the first point of contact between an operator and the platform. It should be as simple as possible to lower the barrier to entry, while collecting sufficient information for initial identification.

**Form Design Principles:**
- Minimal number of fields (5-7 mandatory)
- Clear hints (placeholders, tooltips)
- Inline validation with understandable error messages
- Responsiveness (mobile-first approach)
- Fast loading and response time

---

### Registration Form (Fields)

**URL:** `/operator/signup`  
**Method:** POST  
**Endpoint:** `/api/v1/auth/register`

**Mandatory Fields:**

| No. | Field | Type | Validation | Example | Hint |
|---|------|-----|-----------|--------|-----------|
| 1 | Email | text (email) | Email format, uniqueness | `ahmed@selfstorage.ae` | "Will be used for login" |
| 2 | Phone | text (tel) | E.164 format, uniqueness | `+971-4-XXX-XXXX` | "For booking notifications" |
| 3 | Password | password | Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character | `SecurePass123!` | "Minimum 8 characters" |
| 4 | Password Confirmation | password | Must match "Password" field | `SecurePass123!` | "Repeat your password" |
| 5 | Operator Type | select (dropdown) | Mandatory selection | "Legal Entity (LLC, FZE)" | "Select your business type" |

**Optional Fields (may be added later):**

| No. | Field | Type | Purpose |
|---|------|-----|------------|
| 6 | Company Name / Full Name | text | For personalization (can be filled later) |
| 7 | City | text (autocomplete) | For analytics and personalization |
| 8 | Referral Code | text | For referral program (v1.1+) |

**Additional Elements:**

- **Checkbox:** "I agree to [Terms of Service] and [Privacy Policy]" (mandatory)
- **Checkbox:** "I want to receive platform news and updates" (optional)
- **Button:** "Register"
- **Link:** "Already have an account? Sign In"

---

### Operator Types (Dropdown "Operator Type")

**Options:**

| Value | Label | Description |
|----------|-------|-------------|
| `legal_entity` | Legal Entity (LLC, FZE) | For companies registered as LLC, FZE, FZCO |
| `individual_entrepreneur` | Individual Entrepreneur (IE) | For individuals registered as Independent Entrepreneurs |
| `self_employed` | Self-Employed | For self-employed individuals |
| `individual` | Individual | For private individuals (optional, may be disabled in MVP) |

**Notes:**
- Operator Type determines which documents will be required in subsequent stages
- In MVP, it is recommended to limit to the first two types (Legal Entity and Individual Entrepreneur) to simplify verification
- Support for self-employed and individuals can be added in v1.1+

---

### UX Registration Form (Mockup)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│        🏢 Operator Registration Portal             │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Email *                                      │ │
│  │ ahmed@selfstorage.ae                         │ │
│  │ 📧 Will be used for login                    │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Phone *                                      │ │
│  │ +971-4-___-____                              │ │
│  │ 📱 For booking notifications                 │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Password *                                   │ │
│  │ ••••••••••••                                 │ │
│  │ 🔒 Minimum 8 characters, letters and digits  │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Confirm Password *                           │ │
│  │ ••••••••••••                                 │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Your Business Type *              ▼          │ │
│  │ Legal Entity (LLC, FZE)                      │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ☐ I agree to Terms of Service and              │
│     Privacy Policy                               │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │         Register                             │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│            Already have an account? Sign In       │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### Field Validation (Client-Side and Server-Side)

**1. Email:**

**Client-Side Validation (JavaScript):**
- Email format (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- Length: 5-100 characters

**Server-Side Validation (Backend):**
- Uniqueness (check in `users` table)
- Email format
- Check for disposable emails (temp-mail, guerrillamail, etc.) — optional

**Error Messages:**
- "Enter a valid email address"
- "A user with this email is already registered"
- "Temporary email addresses are not supported"

---

**2. Phone:**

**Client-Side Validation:**
- Format: E.164 (international format)
- Input mask for convenience: `+971-4-___-____` (for UAE)
- Length: 11-15 characters

**Server-Side Validation:**
- Uniqueness (check in `users` table)
- E.164 format
- Validate number validity (using libphonenumber library)

**Error Messages:**
- "Enter a valid phone number"
- "A user with this phone number is already registered"

---

**3. Password:**

**Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 digit (0-9)
- At least 1 special character (!@#$%^&*)

**Client-Side Validation:**
- Check compliance with all requirements
- Password strength indicator (weak/medium/strong)

**Server-Side Validation:**
- Re-verify all requirements
- Check against common passwords (optional, using zxcvbn library)

**Error Messages:**
- "Password must contain at least 8 characters"
- "Password must contain uppercase and lowercase letters, digits, and special characters"
- "Password is too weak. Try a more complex one."

---

**4. Password Confirmation:**

**Validation:**
- Exact match with "Password" field

**Error Messages:**
- "Passwords do not match"

---

**5. Operator Type:**

**Validation:**
- Mandatory selection (cannot be empty)
- Allowed values: `legal_entity`, `individual_entrepreneur`, `self_employed`, `individual`

**Error Messages:**
- "Select your business type"

---

**6. Terms Consent (Checkbox):**

**Validation:**
- Must be checked (mandatory consent)

**Error Messages:**
- "You must agree to the Terms of Service and Privacy Policy"

---

## 3.2. Required Registration Data (Contacts, Legal Data, Country, Currency, etc.)

During registration, a minimal set of data is collected. More detailed information is requested in the next stage — "Profile Completion."

**Data Collected During Registration:**

| Category | Fields | Mandatory | Purpose |
|-----------|------|------------|------------|
| **Authentication** | Email, Password | ✅ Mandatory | For system login |
| **Contacts** | Phone | ✅ Mandatory | For notifications and verification |
| **Business Type** | Operator Type | ✅ Mandatory | Determines document requirements |
| **Agreements** | Terms of Service, Privacy Policy | ✅ Mandatory | Legal protection |

**Data NOT Collected During Registration (filled later):**
- Company Name
- TRN, Trade License Number
- Legal Address
- Bank Details
- Documents

**Rationale for Minimalism:**
- Lower barrier to entry (operator can register in 2 minutes)
- Reduce abandonment rate
- Allow registration and platform exploration before providing full data
- Follow "progressive disclosure" principle in UX

---

**Data Automatically Collected by System (implicitly):**

| Data | Source | Purpose |
|--------|----------|------------|
| IP Address | HTTP request | Geolocation analysis, fraud detection |
| User Agent | HTTP header | Device and browser identification |
| Referrer | HTTP header | Attribution (where operator came from) |
| UTM Tags | Query parameters | Marketing analytics |
| Registration Timestamp | System time | Audit, analytics |
| Device Fingerprint | JavaScript | Fraud detection (optional, v1.1+) |

**Storage:**
- Data saved in `users` and `operators` tables
- Metadata (IP, User Agent) saved in `audit_log` table
- UTM tags saved in separate `operator_attribution` table

---

**International Support (for Future Expansion):**

In MVP, the platform focuses on the UAE market, but architecture should support expansion to other countries.

**Fields for International Support (added to profile, not during registration):**

| Field | Purpose | Example (UAE) | Example (Other Countries) |
|------|------------|-----------------|------------------------|
| Country | Determines jurisdiction, currency, document requirements | UAE | Saudi Arabia, Kuwait |
| Currency | For pricing and settlements | AED (United Arab Emirates Dirham) | SAR, KWD, USD |
| Language | For interface localization | English | Arabic, French |
| Phone Format | For number validation | +971-4-XXX-XXXX | Different formats |
| Tax Identifier | Equivalent to TRN | TRN (10 digits) | CR, VAT ID, Tax ID |

**In MVP:**
- Country: Default "UAE" (can be selected from dropdown)
- Currency: Default "AED" (can be selected from dropdown)
- Language: Default "English"

---

## 3.3. Primary Validation: Email Format, Phone, Basic Checks

Primary validation is performed at two levels: client-side (JavaScript in browser) and server-side (Backend API).

**Validation Goals:**
- Prevent incorrect data from entering the database
- Improve UX (instant feedback)
- Prevent abuse (spam, bots)

---

### Client-Side Validation (Frontend)

**Technologies:**
- JavaScript (native HTML5 Validation API + custom logic)
- React Hook Form / Formik (for React applications)

**Real-Time Validation (inline):**

**1. Email:**
```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Enter a valid email";
  if (email.length < 5 || email.length > 100) return "Email must be between 5 and 100 characters";
  return null; // Valid
}
```

**Trigger:** onChange or onBlur  
**Indication:** Red border + error message below field

---

**2. Phone:**
```javascript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

function validatePhone(phone) {
  if (!phone) return "Phone is required";
  try {
    const phoneNumber = parsePhoneNumber(phone, 'AE');
    if (!isValidPhoneNumber(phone, 'AE')) return "Enter a valid phone number";
    return null; // Valid
  } catch (error) {
    return "Enter a valid phone number";
  }
}
```

**Trigger:** onChange (with input mask)  
**Indication:** Red border + error message

---

**3. Password:**
```javascript
function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must contain at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a digit";
  if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character (!@#$%^&*)";
  return null; // Valid
}
```

**Additionally:** Password strength indicator (progress bar: weak/medium/strong)

---

**4. Password Confirmation:**
```javascript
function validatePasswordConfirm(password, passwordConfirm) {
  if (!passwordConfirm) return "Please confirm your password";
  if (password !== passwordConfirm) return "Passwords do not match";
  return null; // Valid
}
```

---

**5. Terms Consent:**
```javascript
function validateConsent(isChecked) {
  if (!isChecked) return "You must agree to the Terms of Service";
  return null; // Valid
}
```

---

### Server-Side Validation (Backend)

**Technologies:**
- Node.js + Express / Fastify
- Libraries: `validator.js`, `libphonenumber-js`, `bcrypt`

**Endpoint:** `POST /api/v1/auth/register`

**Validation Order:**

1. **Data Format Validation**
2. **Uniqueness Check (email, phone)**
3. **Suspicious Data Check (spam lists, disposable emails)**
4. **Rate Limiting (abuse prevention)**

---

**1. Email:**

```typescript
import validator from 'validator';

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) return { valid: false, error: "Email is required" };
  if (!validator.isEmail(email)) return { valid: false, error: "Invalid email format" };
  if (email.length < 5 || email.length > 100) return { valid: false, error: "Email must be between 5 and 100 characters" };
  
  // Check for disposable emails (optional)
  const tempEmailDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com'];
  const domain = email.split('@')[1];
  if (tempEmailDomains.includes(domain)) {
    return { valid: false, error: "Temporary email addresses are not supported" };
  }
  
  return { valid: true };
}

// Uniqueness check
async function isEmailUnique(email: string): Promise<boolean> {
  const existingUser = await db.users.findOne({ where: { email } });
  return !existingUser;
}
```

**HTTP Response on Error:**
```json
{
  "success": false,
  "error": {
    "code": "email_already_exists",
    "message": "A user with this email is already registered",
    "details": {
      "email": "ahmed@selfstorage.ae"
    }
  }
}
```

---

**2. Phone:**

```typescript
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: false, error: "Phone is required" };
  try {
    const phoneNumber = parsePhoneNumber(phone, 'AE');
    if (!phoneNumber.isValid()) return { valid: false, error: "Invalid phone number" };
    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid phone number" };
  }
}

// Uniqueness check
async function isPhoneUnique(phone: string): Promise<boolean> {
  const normalized = parsePhoneNumber(phone, 'AE').format('E.164');
  const existingUser = await db.users.findOne({ where: { phone: normalized } });
  return !existingUser;
}
```

---

**3. Password:**

```typescript
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) return { valid: false, error: "Password is required" };
  if (password.length < 8) return { valid: false, error: "Password must contain at least 8 characters" };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain an uppercase letter" };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Password must contain a lowercase letter" };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain a digit" };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, error: "Password must contain a special character" };
  return { valid: true };
}

// Password hashing
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
```

---

**Rate Limiting:**

Protection against multiple registration attempts (spam and bot prevention):

```typescript
// Express middleware
import rateLimit from 'express-rate-limit';

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Maximum 3 registrations from one IP per hour
  message: {
    success: false,
    error: {
      code: "rate_limit_exceeded",
      message: "Registration limit exceeded. Please try again in 1 hour.",
      details: {
        limit: 3,
        window: "1 hour",
        retry_after: 3600
      }
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Application
app.post('/api/v1/auth/register', registrationLimiter, registerController);
```

---

## 3.4. Creating Operator Profile Draft in System

After successful data validation, the system creates a draft operator profile in the database.

**Profile Creation Process:**

1. **Create Record in `users` Table**
2. **Create Record in `operators` Table**
3. **Generate JWT Tokens**
4. **Send Welcome Email**
5. **Log Action**

---

### 1. Create Record in `users` Table

**Table:** `users`

**Fields Created:**

```typescript
interface User {
  id: number; // Auto-increment primary key
  email: string; // Unique
  phone: string; // Unique, E.164 format
  password_hash: string; // Bcrypt hash
  role: 'operator'; // Fixed value for operators
  is_email_verified: boolean; // false by default
  is_phone_verified: boolean; // false by default
  created_at: Date; // Timestamp
  updated_at: Date; // Timestamp
  last_login_at: Date | null; // Null initially
}
```

**SQL Query (example):**

```sql
INSERT INTO users (email, phone, password_hash, role, is_email_verified, is_phone_verified, created_at, updated_at)
VALUES (
  'ahmed@selfstorage.ae',
  '+971412345678',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVIhJ1GvGm6',
  'operator',
  false,
  false,
  NOW(),
  NOW()
);
```

---

### 2. Create Record in `operators` Table

**Table:** `operators`

**Fields Created:**

```typescript
interface Operator {
  id: number; // Auto-increment primary key
  user_id: number; // Foreign key to users.id
  operator_type: 'legal_entity' | 'individual_entrepreneur' | 'self_employed' | 'individual';
  company_name: string | null; // Null initially, filled later
  trn: string | null; // Null initially (Tax Registration Number)
  trade_license_number: string | null; // Null initially
  legal_address: string | null; // Null initially
  bank_swift_code: string | null; // Null initially
  bank_account: string | null; // Null initially
  status: 'draft'; // Initial status
  is_verified: boolean; // false
  risk_score: number | null; // Null until AI scoring
  risk_level: string | null; // Null until AI scoring
  onboarding_channel: 'self_service' | 'referral' | 'sales_led' | 'partnership';
  referred_by: number | null; // Null or ID of referring operator
  sales_manager_id: number | null; // Null or ID of sales manager
  submitted_at: Date | null; // Null until submitted for review
  verified_at: Date | null; // Null until verified
  verified_by: number | null; // Null until verified (admin ID)
  created_at: Date;
  updated_at: Date;
}
```

**SQL Query (example):**

```sql
INSERT INTO operators (
  user_id,
  operator_type,
  status,
  is_verified,
  onboarding_channel,
  created_at,
  updated_at
)
VALUES (
  123, -- user_id (from previous INSERT)
  'legal_entity',
  'draft',
  false,
  'self_service',
  NOW(),
  NOW()
);
```

---

### 3. Generate JWT Tokens

**Access Token (short lifespan):**

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  email: string;
  role: 'operator';
  operatorId: number;
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m', // 15 minutes
    issuer: 'selfstorage-aggregator',
    audience: 'api',
  });
}
```

**Refresh Token (long lifespan):**

```typescript
function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // 7 days
    issuer: 'selfstorage-aggregator',
    audience: 'api',
  });
}
```

**Refresh Token Storage:**

Refresh token is stored in database (table `refresh_tokens`) in hashed form:

```sql
INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at)
VALUES (
  123,
  '$2b$12$...' -- Hashed refresh token
  '2026-01-16 00:00:00', -- 7 days from now
  NOW()
);
```

---

### 4. Send Welcome Email

**Event:** `operator_registered`

**Email Template:** "Welcome to the Platform!"

**Content:**

```
Subject: Welcome to StorageBiz!

Hello, Ahmed!

Thank you for registering with StorageBiz.

You have registered as a storage operator. To start receiving customer requests, you need to:

1. Complete your company profile
2. Upload required documents
3. Wait for verification (usually 24-48 hours)

👉 Go to Dashboard: https://selfstorage.ae/operator/dashboard

If you have any questions, our support team is ready to help: support@selfstorage.ae

Best regards,
StorageBiz Team
```

**Technologies:**
- SendGrid / Mailgun / AWS SES
- Templating: Handlebars, Pug

---

### 5. Log Action (Audit Log)

Every action in the onboarding process is logged for audit trail:

**Table:** `audit_log`

```sql
INSERT INTO audit_log (
  entity_type,
  entity_id,
  action,
  actor_type,
  actor_id,
  ip_address,
  user_agent,
  metadata,
  created_at
)
VALUES (
  'operator',
  456, -- operator_id
  'operator_registered',
  'system',
  NULL,
  '93.184.216.34',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  '{"email": "ahmed@selfstorage.ae", "operator_type": "legal_entity", "channel": "self_service"}',
  NOW()
);
```

---

### HTTP Response (Successful Registration)

**Status:** `201 Created`

**Body:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ahmed@selfstorage.ae",
      "phone": "+971412345678",
      "role": "operator",
      "created_at": "2025-12-09T10:30:00Z"
    },
    "operator": {
      "id": 456,
      "user_id": 123,
      "operator_type": "legal_entity",
      "status": "draft",
      "is_verified": false,
      "onboarding_progress": 10
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 900
    },
    "next_steps": {
      "step": "fill_profile",
      "description": "Complete your company profile",
      "url": "/operator/profile/edit"
    }
  },
  "message": "Registration successful! Check your email for verification."
}
```

---

## 3.5. Creating First Account: operator_owner (Primary Representative)

Upon operator registration, an account with role `operator_owner` is automatically created — this is the primary company representative who has full rights to manage the operator.

**Role Concept:**

The system implements a multi-level role structure:

1. **user.role** (user level): Defines general user type (`operator`, `customer`, `admin`)
2. **operator_users.role** (operator level): Defines specific role within operator (`owner`, `manager`, `staff`)

**Table:** `operator_users` (many-to-many linking table)

```typescript
interface OperatorUser {
  id: number;
  operator_id: number; // FK to operators.id
  user_id: number; // FK to users.id
  role: 'owner' | 'manager' | 'staff';
  permissions: string[]; // JSON array of permissions
  invited_by: number | null; // FK to users.id (who invited this user)
  invited_at: Date | null;
  is_active: boolean; // true
  created_at: Date;
  updated_at: Date;
}
```

---

### Creating operator_owner Record

**During Operator Registration:**

```sql
INSERT INTO operator_users (
  operator_id,
  user_id,
  role,
  permissions,
  invited_by,
  invited_at,
  is_active,
  created_at,
  updated_at
)
VALUES (
  456, -- operator_id
  123, -- user_id (the registering user)
  'owner',
  '["*"]', -- Full rights (all permissions)
  NULL, -- Not invited, created own account
  NULL,
  true,
  NOW(),
  NOW()
);
```

---

### operator_owner Permissions

**operator_owner** has full management rights over the operator:

| Action | operator_owner | operator_manager | operator_staff |
|--------|----------------|------------------|----------------|
| View dashboard | ✅ | ✅ | ✅ |
| Edit operator profile | ✅ | ❌ | ❌ |
| Modify critical fields (TRN, bank details) | ✅ | ❌ | ❌ |
| Create/edit storage facilities | ✅ | ✅ | ❌ |
| Create/edit storage boxes | ✅ | ✅ | ❌ |
| Manage pricing | ✅ | ✅ | ❌ |
| Process booking requests | ✅ | ✅ | ✅ (confirmation only) |
| View finances | ✅ | ✅ | ❌ |
| Invite staff | ✅ | ❌ | ❌ |
| Remove staff | ✅ | ❌ | ❌ |
| Change staff roles | ✅ | ❌ | ❌ |
| Delete operator | ✅ | ❌ | ❌ |

---

### Inviting Additional Users (Future)

After `operator_owner` verification, additional users can be invited:

**Process:**

1. Owner goes to "Team" section (`/operator/team`)
2. Clicks "Invite Staff Member"
3. Fills form:
   - Staff member's email
   - Role: Manager or Staff
   - Optional message
4. System sends invite link to email
5. Staff member follows link, registers, sets password
6. Link automatically created in `operator_users` table with corresponding role

**Limitations:**
- Staff can only be invited after verification (status = 'active')
- One email cannot be linked to multiple operators simultaneously (in MVP)
- Maximum staff members: 10 (MVP limit, can be increased)

---

## 3.6. UX Flow: What Operator Sees After Registration (Screen, Hints, Status)

After successful registration, operator is automatically authenticated and redirected to dashboard.

**URL After Registration:** `/operator/dashboard` or `/operator/onboarding`

---

### Onboarding Screen (Welcome Screen)

**Option 1: Full-Screen Onboarding (recommended for MVP)**

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]                              [Ahmed A.] [Sign Out]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│           🎉 Welcome, Ahmed!                               │
│                                                            │
│     You have successfully registered with StorageBiz.       │
│     To start receiving customer requests, complete:         │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ✅ Step 1: Registration                         │    │
│   │     You are here!                                │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Step 2: Complete Your Company Profile       │    │
│   │     Company name, TRN, address, bank details     │    │
│   │     ⏱ ~5-10 minutes                             │    │
│   │     ┌──────────────────────────────┐            │    │
│   │     │ Complete Profile             │            │    │
│   │     └──────────────────────────────┘            │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Step 3: Upload Documents                    │    │
│   │     Registration documents, bank details         │    │
│   │     ⏱ ~5 minutes                                 │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Step 4: Verification                        │    │
│   │     Usually takes 24-48 hours                    │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Step 5: Complete! Create Your First Facility│    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│                                                            │
│              [Skip and Explore Platform]                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Option 2: Dashboard with Onboarding Banner**

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Facilities  Requests  [Ahmed] [Sign Out]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ⚠️ Complete verification to start operations        │ │
│  │                                                      │ │
│  │  📋 Complete Your Profile (0%)                      │ │
│  │  📄 Upload Documents (0/3)                          │ │
│  │                                                      │ │
│  │  [Continue Onboarding]                              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐        │
│  │  My Facilities      │  │  Customer Requests  │        │
│  │                     │  │                     │        │
│  │  You have no        │  │  Unavailable until  │        │
│  │  facilities yet     │  │  verification       │        │
│  │                     │  │                     │        │
│  │  [Create Facility]  │  │                     │        │
│  │  (unavailable)      │  │                     │        │
│  └─────────────────────┘  └─────────────────────┘        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### Onboarding Progress (Progress Bar)

**Progress indicator** displayed on all pages until verification completion:

```
┌────────────────────────────────────────────────────────────┐
│  Onboarding Progress: 10%                                   │
│  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  Step 1/5: Registration ✅                                  │
│  Step 2/5: Complete Your Profile →                          │
└────────────────────────────────────────────────────────────┘
```

**Progress Calculation:**

| Step | Weight | Description |
|-----|-----|----------|
| Registration | 10% | Automatic after registration |
| Profile Completion | 30% | When all mandatory fields filled |
| Document Upload | 30% | When all mandatory documents uploaded |
| Submit for Review | 10% | When "Submit for Review" button clicked |
| Verification | 20% | After admin approval |

---

### Tips and Help

**1. Floating Tooltips:**

On hover over "?" icon next to fields:

```
TRN [?]
  ↓
  "TRN is the Tax Registration Number issued by UAE authorities.
   For Legal Entities: 10 digits.
   For Individual Entrepreneurs: 9 digits."
```

---

**2. Contextual Help (Help Center):**

"Need Help?" link in bottom right corner → opens support chat or FAQ

---

**3. Instructional Email:**

Immediately after registration, operator receives email with step-by-step instructions

---

### Onboarding Status

**Status indicator** always visible in dashboard:

```
┌────────────────────────────────────────────────────────────┐
│  Status: Complete Your Profile              🔴 Not Verified│
└────────────────────────────────────────────────────────────┘
```

**Possible Statuses (for operator):**

| Status | Indicator | Description |
|--------|-----------|----------|
| Complete Your Profile | 🔴 Not Verified | Profile incomplete or partially filled |
| Upload Documents | 🔴 Not Verified | Profile complete, but documents missing |
| Under Review | 🟡 Under Review | Application submitted, awaiting review |
| Additional Info Required | 🟠 Action Required | Admin requested additional data |
| Verified | 🟢 Active | Verification complete, ready to operate |
| Rejected | 🔴 Rejected | Application rejected, see reason |

---

### Notifications

**In-App Notifications:**

```
┌────────────────────────────────────────────────────────────┐
│  🔔 Notifications (1)                                       │
│                                                            │
│  • Welcome to StorageBiz! Complete your profile to start   │
│    operations.                                             │
│    2 minutes ago                                           │
└────────────────────────────────────────────────────────────┘
```

**Email Notifications:**

- Upon registration: "Welcome!"
- Reminder after 24 hours: "Don't forget to complete registration"
- Reminder after 7 days: "Your profile is still incomplete"

---
# 4. Operator Verification (KYC/KYB Light)

## 4.1. Operator Types and Verification Requirements Differences (Legal Entity, Individual Entrepreneur, etc.)

Verification requirements vary depending on the operator type, which relates to different levels of legal formalization and associated risks.

**Operator Types and Characteristics:**

| Operator Type | Code | Legal Status | Risk Level | Document Requirements |
|---|---|---|---|---|
| Legal Entity (LLC, FZE) | `legal_entity` | Fully registered company | Low | Complete corporate document package |
| Individual Entrepreneur (IE) | `individual_entrepreneur` | Individual with business licensing | Medium | IE documents + passport |
| Self-Employed (Professional License) | `self_employed` | Individual with professional trading license | High | Passport + professional license certificate |
| Individual Person | `individual` | Regular individual without registration | Very High | Passport + property documents |

---

### 1. Legal Entity (LLC, FZE, FZCO)

**Characteristics:**
- Officially registered company in UAE Commercial Registry
- Has TRN (9 digits) and Trade License Number
- Bank account
- Registered office address
- General Manager or authorized representative

**Risk Level: Low**
- Company verifiable in public registries
- Official accounting and financial reporting
- Legal liability structure

**Required Documents:**

| No. | Document | Mandatory | Format | Currency |
|---|---|---|---|---|
| 1 | Certificate of Registration or Extract from UAE Commercial Registry | ✅ Required | PDF, JPG, PNG | Not older than 3 months |
| 2 | Company Charter | ⚠️ On Request | PDF | Current version |
| 3 | Board Resolution on Appointment of General Manager | ⚠️ On Request | PDF, JPG | Current |
| 4 | Bank Account Details Certificate or bank portal screenshot | ✅ Required | PDF, JPG, PNG | Current |
| 5 | Copy of General Manager's passport (photo and address pages) | ⚠️ On Request | JPG, PNG | Valid |

**Required Information:**

| Field | Description | Example |
|---|---|---|
| Company Name | Full legal name with entity type | StorageBiz LLC |
| TRN | 9 digits | 123456789 |
| Trade License Number | License identification | 12345/2023 |
| Chamber of Commerce Registration | Registration number | CC123456 |
| Registered Office Address | Full registration address | Office 510, Building B, Al Quoz 1, Dubai |
| Operational Address | If different from registered | Building C, Industrial Area, Sharjah |
| Bank SWIFT Code | 11 characters | NRAEATXW |
| Bank Account Number | IBAN format | AE070331234567890123456 |
| Bank Name | Full name | Emirates NBD |

**Automated Checks:**
- TRN verification via checksum validation
- Trade License verification via checksum validation
- Bank SWIFT code verification in international banking directory
- Company search in UAE Commercial Registry via FTA API (Federal Tax Authority) if available
- Company status verification (active / suspended / cancelled)

**Verification Time:** 24-48 hours (standard)

---

### 2. Individual Entrepreneur (IE)

**Characteristics:**
- Individual registered in UAE Commercial Registry
- Has TRN (9 digits) and Trade License Number
- Bank account
- Conducts business activities in their own name

**Risk Level: Medium**
- Less formalized structure than legal entities
- Fewer corporate verification checks
- Personal owner liability

**Required Documents:**

| No. | Document | Mandatory | Format | Currency |
|---|---|---|---|---|
| 1 | Certificate of Registration or Extract from UAE Commercial Registry | ✅ Required | PDF, JPG, PNG | Not older than 3 months |
| 2 | Copy of IE passport (photo and address pages) | ✅ Required | JPG, PNG | Valid |
| 3 | Bank Account Details Certificate or bank portal screenshot | ✅ Required | PDF, JPG, PNG | Current |
| 4 | TRN certificate or document | ⚠️ On Request | PDF, JPG, PNG | Current |

**Required Information:**

| Field | Description | Example |
|---|---|---|
| Full Name | Complete name | Ahmed Khalid Al Mansouri |
| TRN | 9 digits | 123456789 |
| Trade License Number | License identification | 54321/2023 |
| Registration Address | Address from registration document | Al Qusais, Dubai |
| Operational Address | If different | Deira, Dubai |
| Bank SWIFT Code | 11 characters | NRAEATXW |
| Bank Account Number | IBAN format | AE070331234567890123456 |
| Bank Name | Full name | First Abu Dhabi Bank |

**Automated Checks:**
- TRN verification via checksum validation (9 digits)
- Trade License verification via checksum validation
- Bank SWIFT code verification in international banking directory
- IE search in UAE Commercial Registry via FTA API if available
- Passport validity verification

**Special Verification Features:**
- Owner identity verification required (passport)
- Name consistency verification across documents
- Address verification (must match registration)

**Verification Time:** 24-48 hours (standard)

---

### 3. Self-Employed (Professional License Holder)

**Characteristics:**
- Individual under professional trading license scheme
- Not registered as traditional IE
- Uses professional trading license for business operations
- Annual revenue limit applies per license category

**Risk Level: High**
- Minimal legal formalization
- No registration in UAE Commercial Registry
- Easy to start and terminate

**Required Documents:**

| No. | Document | Mandatory | Format | Currency |
|---|---|---|---|---|
| 1 | Copy of passport (photo and address pages) | ✅ Required | JPG, PNG | Valid |
| 2 | Professional Trading License certificate | ✅ Required | PDF, JPG, PNG | Current status |
| 3 | Screenshot from license portal showing active status | ✅ Required | JPG, PNG | Current |
| 4 | Property document confirming right to premises (if operating from personal property) | ✅ Required | PDF, JPG, PNG | Valid |

**Required Information:**

| Field | Description | Example |
|---|---|---|
| Full Name | Complete name | Fatima Al Mazrouei |
| TRN | 9 digits (if applicable) | 123456789 |
| License Number | Professional license number | PL2025-12345 |
| Registration Address | Address from license | Jumeirah, Dubai |
| Bank Transfer Method | Card for receiving payments | 1234 56** **** 7890 (masked) |

**Automated Checks:**
- TRN verification via checksum validation
- Passport validity verification
- Professional license status verification via regulatory authority
- License database cross-reference

**Special Verification Features:**
- Thorough manual document review required
- License authenticity verification
- Property rights verification (if operating from personal property)
- Possible request for additional documents

**Verification Time:** 48-72 hours (detailed review)

**MVP Limitations:**
- Self-employed support may be disabled in MVP
- Launch in v1.1+ after establishing processes for legal entities and IEs

---

### 4. Individual Person (without registration)

**Characteristics:**
- Regular individual without IE or professional license
- Operates from personal property (garage, storage unit, part of residence)
- Income must be declared as rental income

**Risk Level: Very High**
- Absence of official business registration
- Tax compliance concerns
- Complexity with contracts and payments

**Required Documents:**

| No. | Document | Mandatory | Format | Currency |
|---|---|---|---|---|
| 1 | Copy of passport (photo and address pages) | ✅ Required | JPG, PNG | Valid |
| 2 | Property ownership or lease document | ✅ Required | PDF, JPG, PNG | Valid |
| 3 | Consent to Personal Data Processing | ✅ Required | PDF (signed) | — |
| 4 | Bank transfer details for payments | ✅ Required | Account details | Active |

**Required Information:**

| Field | Description | Example |
|---|---|---|
| Full Name | Complete name | Khalid Mohammed Al Nuaimi |
| TRN | 9 digits (optional) | 123456789 |
| Property Address | Storage unit address | Villa 45, Mirdif, Dubai |
| Bank Transfer Method | Card for receiving payments | 1234 56** **** 7890 |

**Automated Checks:**
- Passport validity verification
- Address verification from property documents

**Special Verification Features:**
- Maximum manual document review
- Mandatory identity confirmation call
- Property rights documentation review
- Tax compliance risk assessment

**Verification Time:** 72+ hours (maximum review depth)

**MVP Limitations:**
- **NOT supported in MVP**
- Launch in v2+ after legal and tax model refinement
- Requires legal consultation on compliance risks

---

**Comparative Requirements Table:**

| Parameter | Legal Entity | IE | Self-Employed | Individual |
|---|---|---|---|---|
| Registry Extract | ✅ UAE Commercial Registry | ✅ UAE Commercial Registry | ❌ | ❌ |
| Passport | ⚠️ Manager's | ✅ | ✅ | ✅ |
| Bank Details | ✅ Account | ✅ Account | ⚠️ Card | ⚠️ Card |
| Property Rights Document | ❌ | ❌ | ✅ | ✅ |
| Review Level | Standard | Standard | Detailed | Maximum |
| MVP Support | ✅ | ✅ | ❌ (v1.1+) | ❌ (v2+) |
| Verification Time | 24-48h | 24-48h | 48-72h | 72+h |

---

## 4.2. List of Required Documents (Registration, Bank, and Others)

The complete document list depends on operator type. Documents must be current, legible, and substantiate claimed information.

**General Document Requirements:**

| Requirement | Details |
|---|---|
| File Formats | PDF, JPG, JPEG, PNG |
| Maximum File Size | 10 MB |
| Minimum Image Resolution | 1200x800 px |
| Quality | Documents must be clear, not blurred, not cropped |
| Color | Color or black & white (acceptable) |
| Currency | Extracts from registries — not older than 3 months |
| Language | English or Arabic. Non-Arabic/English documents require certified translation. |

---

### Documents for Legal Entities (LLC, FZE)

**Required Documents:**

| No. | Document | Must Show | Comment |
|---|---|---|---|
| 1 | **Extract from UAE Commercial Registry** | Full company name, TRN, Trade License, Chamber registration, registered address, registration date, status (active), Manager name | Not older than 3 months. Obtain from tnt.ae |
| 2 | **Bank Account Details Certificate** | Bank SWIFT code, bank account number, bank name, company name | Bank statement or bank portal screenshot |

**Documents on Request (may be needed during review):**

| No. | Document | Must Show | When Required |
|---|---|---|---|
| 3 | **Company Charter** | Full text of current version | If doubts about manager authority |
| 4 | **Board Resolution on Manager Appointment** | Manager name, appointment date, signature, seal | If manager recently appointed or registry not updated |
| 5 | **Copy of General Manager's Passport** | Photo page, full name, date of birth, address | For additional identity verification if high risk |
| 6 | **Certificate of Company Registration (older format)** | Series and number, issuance date | If company registered before 2017 and no electronic extract available |

---

### Documents for Individual Entrepreneurs (IE)

**Required Documents:**

| No. | Document | Must Show | Comment |
|---|---|---|---|
| 1 | **Extract from UAE Commercial Registry** | Full name, TRN, Trade License Number, registration address, registration date, status (active) | Not older than 3 months. Obtain from tnt.ae |
| 2 | **Copy of IE Passport** | Photo page: full name, date of birth, series and number, date of issue, issuing authority. Address page: registration address | Both pages required |
| 3 | **Bank Account Details Certificate** | Bank SWIFT code, bank account number, bank name, IE name | Bank statement or bank portal screenshot |

**Documents on Request:**

| No. | Document | Must Show | When Required |
|---|---|---|---|
| 4 | **TRN Certificate** | TRN, full name, date of issuance | If TRN not shown in UAE Commercial Registry extract |

---

### Documents for Self-Employed (Professional License Holders)

**Required Documents:**

| No. | Document | Must Show | Comment |
|---|---|---|---|
| 1 | **Professional License Certificate** | Full name, TRN, issuance date, current status (active) | From licensing authority |
| 2 | **License Portal Screenshot** | Home screen confirming active self-employed status | Screenshot date must be current |
| 3 | **Copy of Passport** | Photo page and address page | Both pages required |
| 4 | **Property Rights Document** | Ownership certificate or lease agreement (if operating from third-party property) | Confirms right to sub-let property |

---

### Documents for Individuals (Not Supported in MVP)

**Required Documents (for future implementation):**

| No. | Document | Must Show | Comment |
|---|---|---|---|
| 1 | **Copy of Passport** | Photo page and address page | Both pages required |
| 2 | **Property Ownership Document** | Ownership certificate or lease agreement | Confirms property rights |
| 3 | **Consent to Personal Data Processing** | Signed consent | Legal protection for platform |

---

**Document Upload Process:**

**Step 1: Operator accesses "Documents" section**

URL: `/operator/documents`

**Step 2: Views list of required documents**

```
┌────────────────────────────────────────────────────────────┐
│  Document Upload                                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Upload the necessary documents for verification:          │
│                                                            │
│  ☐ 1. Extract from UAE Commercial Registry                │
│     [Choose File]  📄                                     │
│     Format: PDF, JPG, PNG (max 10 MB)                    │
│     Not older than 3 months                              │
│                                                            │
│  ☐ 2. Bank Account Details Certificate                    │
│     [Choose File]  📄                                     │
│     Format: PDF, JPG, PNG (max 10 MB)                    │
│     Bank statement or portal screenshot                  │
│                                                            │
│  ─────────────────────────────────────────────            │
│                                                            │
│  Additional Documents (on request):                       │
│                                                            │
│  ☐ 3. Company Charter                                     │
│     [Choose File]  📄                                     │
│     (Optional, may be requested)                         │
│                                                            │
│  ─────────────────────────────────────────────            │
│                                                            │
│  Progress: 0/2 required documents uploaded               │
│                                                            │
│  [Submit for Review] (unavailable)                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Step 3: Uploads files**

- Click "Choose File" → file picker opens
- Operator selects file from computer
- System checks format and size
- If valid: file uploads to server (S3 storage)
- If invalid: error message displays

**Step 4: After all required documents uploaded**

"Submit for Review" button becomes active

---

## 4.3. Verification of Details: Registered Address, TRN/Registration Number/Other Identifiers, Bank Details

Operator verification is critical. It includes automated and manual checks to confirm data accuracy.

---

### 1. TRN Verification (Taxpayer Registration Number)

**What is TRN:**
- Unique taxpayer identifier in UAE
- 9 digits for all individuals and companies

**Automated Checks:**

**1.1. Format Validation:**

```typescript
function validateTRN(trn: string): { valid: boolean; error?: string } {
  // Check length
  if (trn.length !== 9) {
    return { valid: false, error: "TRN must contain 9 digits" };
  }
  
  // Check all characters are digits
  if (!/^\d+$/.test(trn)) {
    return { valid: false, error: "TRN must contain only digits" };
  }
  
  return { valid: true };
}
```

**1.2. Checksum Validation:**

TRN contains check digits for error protection.

```typescript
function validateTRNChecksum(trn: string): boolean {
  if (trn.length !== 9) {
    return false;
  }
  
  // UAE TRN checksum algorithm
  const weights = [2, 1, 4, 3, 5, 9, 8, 6, 7];
  let sum = 0;
  
  for (let i = 0; i < 8; i++) {
    sum += parseInt(trn[i]) * weights[i];
  }
  
  const checksum = (sum % 11) % 10;
  return checksum === parseInt(trn[8]);
}
```

**1.3. FTA (Federal Tax Authority) Database Check (if API available):**

```typescript
async function checkTRNInFTA(trn: string, operatorType: 'legal_entity' | 'individual_entrepreneur'): Promise<{
  exists: boolean;
  companyName?: string;
  status?: 'active' | 'suspended' | 'cancelled';
  registrationDate?: Date;
}> {
  try {
    // Call FTA API (example: via fta.gov.ae or similar)
    const response = await fetch(`https://api.fta.gov.ae/check-trn?trn=${trn}`);
    const data = await response.json();
    
    return {
      exists: data.found,
      companyName: data.name,
      status: data.status,
      registrationDate: new Date(data.registration_date)
    };
  } catch (error) {
    // If API unavailable, skip check
    console.error('FTA API unavailable:', error);
    return { exists: true }; // Assume exists
  }
}
```

**Manual Review (by Administrator):**

Administrator verifies TRN on FTA website: https://fta.gov.ae/

1. Enters TRN in search
2. Checks:
   - Company name matches declared
   - Status: "Active" (not suspended, not cancelled)
   - Registered address matches declared
   - Manager name matches (for legal entities)
   - Registration date (older companies = lower risk)

**Risk Factors:**
- ❌ Company suspended or cancelled
- ❌ Company undergoing restructuring
- ⚠️ Company registered less than 3 months ago (elevated risk)
- ⚠️ Shared office registration address (suggests shell company)
- ⚠️ Manager appears in >10 company registrations

---

### 2. Trade License Number Verification

**What is Trade License Number:**
- Registration identifier for business license
- 6-8 digits with department code

**Automated Checks:**

**2.1. Format Validation:**

```typescript
function validateTradeLicense(license: string, type: 'legal_entity' | 'individual_entrepreneur'): { valid: boolean; error?: string } {
  // Check format (typically 6-8 characters)
  if (!/^\d{6,8}$/.test(license)) {
    return { valid: false, error: "Trade License must contain 6-8 digits" };
  }
  
  return { valid: true };
}
```

**2.2. Checksum Validation:**

```typescript
function validateTradeLicenseChecksum(license: string): boolean {
  if (license.length < 6 || license.length > 8) {
    return false;
  }
  
  // UAE Trade License validation
  const weights = [1, 3, 7, 1, 3, 7];
  let sum = 0;
  
  for (let i = 0; i < Math.min(6, license.length - 1); i++) {
    sum += parseInt(license[i]) * weights[i];
  }
  
  const checksum = (sum % 11) % 10;
  return checksum === parseInt(license[license.length - 1]);
}
```

---

### 3. Registered Address Verification

**Automated Checks:**

**3.1. Address Format Validation:**

```typescript
function validateAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.length < 10) {
    return { valid: false, error: "Address too short" };
  }
  
  // Check for required elements
  const hasEmirate = /(Dubai|Abu Dhabi|Sharjah|Ajman|Ras Al Khaimah|Fujairah|Umm Al Quwain)/.test(address);
  const hasStreet = /(Street|Road|Avenue|Lane|Crescent)/.test(address);
  
  if (!hasEmirate) {
    return { valid: false, error: "Address must contain an Emirate name" };
  }
  
  return { valid: true };
}
```

**Manual Review (by Administrator):**

1. Compares address in profile with address in registry extract
2. Verifies address on maps (Google Maps):
   - Does address exist?
   - Is there a building at this address?
   - What type of building (commercial, residential, industrial)?
3. Checks for "shared address" (address where >100 companies registered)

**Risk Factors:**
- ❌ Address does not exist (not found on maps)
- ⚠️ Shared address registration (>100 companies)
- ⚠️ Address inconsistent with declared business type

---

### 4. Bank Details Verification

**Required Details:**
- Bank SWIFT Code — 11 characters
- Bank Account Number (IBAN) — AE + 21 digits
- Bank Name

**Automated Checks:**

**4.1. SWIFT Code Validation:**

```typescript
async function validateSWIFTCode(swiftCode: string): Promise<{ valid: boolean; bankName?: string; error?: string }> {
  // Format check
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{3}$/.test(swiftCode)) {
    return { valid: false, error: "SWIFT Code must be 11 alphanumeric characters" };
  }
  
  // Verify in international bank directory
  try {
    const bankData = await fetchBankBySWIFT(swiftCode);
    if (bankData) {
      return { valid: true, bankName: bankData.name };
    } else {
      return { valid: false, error: "SWIFT Code not found in banking directory" };
    }
  } catch (error) {
    return { valid: true }; // Skip if service unavailable
  }
}

async function fetchBankBySWIFT(swiftCode: string): Promise<{ name: string; iban_prefix: string } | null> {
  try {
    const response = await fetch(`https://api.swift.com/bank/${swiftCode}`);
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name,
        iban_prefix: data.iban_prefix
      };
    }
  } catch (error) {
    return null;
  }
  return null;
}
```

**4.2. Bank Account (IBAN) Validation:**

```typescript
function validateIBAN(iban: string): { valid: boolean; error?: string } {
  // UAE IBAN format: AE + 21 digits
  if (!/^AE\d{21}$/.test(iban)) {
    return { valid: false, error: "IBAN must be in format AE + 21 digits" };
  }
  
  return { valid: true };
}
```

**4.3. SWIFT Code and IBAN Matching:**

```typescript
function validateSWIFTIBANPair(iban: string, swiftCode: string): boolean {
  // Check if bank SWIFT matches IBAN prefix
  // This is a simplified check; full validation requires bank directory
  
  const ibanBankCode = iban.substring(4, 9);
  const swiftBankCode = swiftCode.substring(0, 4);
  
  // In reality, detailed mapping is needed
  return swiftCode.length === 11 && iban.length === 23;
}
```

**Manual Review (by Administrator):**

1. Reviews bank account certificate or screenshot
2. Verifies:
   - SWIFT Code matches declared
   - IBAN matches declared
   - Bank name matches SWIFT directory
   - Account holder matches company/IE name
3. Checks certificate date (must be current)

**Risk Factors:**
- ❌ SWIFT Code not found in directory (bank liquidated)
- ❌ Account holder does not match operator
- ⚠️ Account opened less than 1 month ago (elevated risk)
- ⚠️ Bank on "grey list" (banks with poor reputation)

---

## 4.4. Automated Checks: Simple Rules, External APIs, AI Anomaly Detection

Automated checks eliminate obviously invalid applications and reduce administrator workload.

---

### 1. Rules-Based Checks

**1.1. Data Format Validation:**

| Field | Rule | Automated Check |
|---|---|---|
| Email | Email format, uniqueness | ✅ |
| Phone | E.164 format, uniqueness | ✅ |
| TRN | 9 digits, checksum validation | ✅ |
| Trade License | 6-8 digits, checksum validation | ✅ |
| SWIFT Code | 11 characters, directory check | ✅ (if API available) |
| Bank Account | IBAN format, SWIFT matching | ✅ |
| Passport (if required) | Photo ID format | ✅ |

**1.2. Duplicate Check:**

```typescript
async function checkDuplicateOperator(data: {
  trn?: string;
  email: string;
  phone: string;
  tradeLicense?: string;
}): Promise<{
  isDuplicate: boolean;
  existingOperatorId?: number;
  duplicateFields: string[];
}> {
  const duplicateFields: string[] = [];
  let existingOperatorId: number | null = null;
  
  // Check by TRN
  if (data.trn) {
    const operatorByTRN = await db.operators.findOne({ where: { trn: data.trn } });
    if (operatorByTRN) {
      duplicateFields.push('trn');
      existingOperatorId = operatorByTRN.id;
    }
  }
  
  // Check by Trade License
  if (data.tradeLicense) {
    const operatorByLicense = await db.operators.findOne({ where: { trade_license: data.tradeLicense } });
    if (operatorByLicense) {
      duplicateFields.push('trade_license');
      existingOperatorId = operatorByLicense.id;
    }
  }
  
  // Check by email
  const userByEmail = await db.users.findOne({ where: { email: data.email } });
  if (userByEmail) {
    duplicateFields.push('email');
  }
  
  // Check by phone
  const userByPhone = await db.users.findOne({ where: { phone: data.phone } });
  if (userByPhone) {
    duplicateFields.push('phone');
  }
  
  return {
    isDuplicate: duplicateFields.length > 0,
    existingOperatorId: existingOperatorId || undefined,
    duplicateFields
  };
}
```

**Action on Duplicate Detection:**
- TRN/Trade License already exists → automatic application rejection (fraud)
- Email/phone already exists → message "User already registered"

---

**1.3. Blacklist Check:**

```typescript
async function checkBlacklist(data: {
  trn?: string;
  email: string;
  phone: string;
  ip: string;
}): Promise<{
  isBlacklisted: boolean;
  reason?: string;
}> {
  // Check TRN in blacklist
  if (data.trn) {
    const blacklistedTRN = await db.blacklist.findOne({ 
      where: { type: 'trn', value: data.trn } 
    });
    if (blacklistedTRN) {
      return { isBlacklisted: true, reason: 'TRN on blacklist' };
    }
  }
  
  // Check email in blacklist
  const blacklistedEmail = await db.blacklist.findOne({ 
    where: { type: 'email', value: data.email } 
  });
  if (blacklistedEmail) {
    return { isBlacklisted: true, reason: 'Email on blacklist' };
  }
  
  // Check IP in blacklist
  const blacklistedIP = await db.blacklist.findOne({ 
    where: { type: 'ip', value: data.ip } 
  });
  if (blacklistedIP) {
    return { isBlacklisted: true, reason: 'IP address on blacklist' };
  }
  
  return { isBlacklisted: false };
}
```

**Reasons for Blacklisting:**
- Previous application rejected for fraud
- Multiple registration attempts with different data
- Customer complaints of fraud
- Manual addition by administrator

---

### 2. Integration with External Directories and APIs

**2.1. FTA (Federal Tax Authority) API:**

**Purpose:** Verify existence and status of legal entities and IEs

**Endpoint:** `https://fta.gov.ae/api` (or similar)

---

### 3. AI Module for Anomaly Detection

**Purpose:** Identify suspicious behavioral patterns and data using machine learning.

**Input Data for AI:**

| Category | Parameters |
|---|---|
| Operator Profile | TRN, Trade License, company name, registered address, company registration date, operator type |
| Contact Details | Email, phone, IP address |
| Bank Details | SWIFT Code, bank account, bank name |
| Behavioral Data | Form fill time, typing speed, field fill order |
| Technical Data | User Agent, screen resolution, OS, browser, device fingerprint |
| Historical Data | Previous registration attempts from this IP/device, history of rejected applications |

**Risk Score Calculation:**

```
Risk Score = Base Score (0) + Σ(Fraud Signal Weights)
Risk Score = min(100, calculated score)

Risk Level:
- 0-30: low
- 31-70: medium
- 71-100: high
```

---

## 4.5. Fraud Signals and Risk Factors

Fraud signals are indicators of potential fraud that help identify problematic operators.

**Fraud Signal Classification:**

### 1. Legal/Corporate Fraud Signals

| Signal | Description | Risk Level | Action |
|---|---|---|---|
| **New Company** | Company registered <3 months ago | ⚠️ Medium | Review flag |
| **Shared Address** | Registration address "shared" (>100 companies) | ❌ High | Rejection or detailed review |
| **Shared Director** | Director appears in >10 company registrations | ⚠️ Medium | Review flag |
| **Company Suspended** | Company suspended or undergoing suspension | ❌ Critical | Automatic rejection |
| **Company Cancelled** | Company cancelled or undergoing cancellation | ❌ Critical | Automatic rejection |
| **Data Mismatch** | Profile data doesn't match registry extract | ❌ High | Rejection |

---

## 4.6. Verification Statuses

During verification, operators pass through several statuses reflecting the current state of document and data review.

**Verification Statuses:**

| Status | Code | Description | Transitions |
|---|---|---|---|
| **Not Submitted** | `not_submitted` | Operator has not submitted application (draft) | → in_review |
| **Under Review** | `in_review` | Application submitted, awaiting moderation | → verified, rejected, needs_more_info |
| **Verified** | `verified` | Review successful, operator active | — (final status) |
| **Rejected** | `rejected` | Review unsuccessful, application rejected | → not_submitted (new application) |
| **More Info Needed** | `needs_more_info` | Administrator requested additional data | → in_review |

---

## 4.7. UX Scenarios: What Operator Sees at Each Status

Each verification status shows a corresponding screen in the operator dashboard.

---

### Status: verified (Verified)

**URL:** `/operator/dashboard`

**Screen (immediately after approval):**

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]   Dashboard  Warehouses  Requests   [Ahmed] [Sign Out]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│           🎉 Congratulations! Your account is verified    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  Your application has been approved. You can now     │ │
│  │  use all features of StoragePro platform.           │ │
│  │                                                      │ │
│  │  Next Steps:                                         │ │
│  │                                                      │ │
│  │  1️⃣ Create your first warehouse                      │ │
│  │     ┌──────────────────────────────────┐            │ │
│  │     │ Create Warehouse                │            │ │
│  │     └──────────────────────────────────┘            │ │
│  │                                                      │ │
│  │  2️⃣ Add storage units and set pricing                │ │
│  │                                                      │ │
│  │  3️⃣ Start receiving customer requests               │ │
│  │                                                      │ │
│  │  📚 [Warehouse Creation Guide]                      │ │
│  │  💬 [Contact Support]                               │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---
# 5. UX Flow and Operator States

## 5.1. Основной UX-flow онбординга (mermaid-диаграмма)

Процесс онбординга оператора представляет собой последовательность шагов, каждый из которых критичен для успешной активации аккаунта.

**Полный UX-flow:**

```mermaid
flowchart TD
    A[Оператор попадает на landing page] --> B{Выбор действия}
    B -->|Регистрация| C[Заполнение формы регистрации]
    B -->|Уже есть аккаунт| Z[Вход в систему]
    
    C --> D[Валидация формы]
    D -->|Ошибка| C
    D -->|Успешно| E[Создание аккаунта в БД]
    
    E --> F[Автоматическая авторизация]
    F --> G[Приветственный экран]
    
    G --> H[Profile Completion компании]
    H --> I[Валидация данных профиля]
    I -->|Ошибка| H
    I -->|Успешно| J[Сохранение профиля]
    
    J --> K[Document Upload]
    K --> L{Все документы загружены?}
    L -->|Нет| K
    L -->|Да| M[Проверка документов]
    
    M -->|Невалидные документы| K
    M -->|Валидные документы| N[Кнопка "Отправить на проверку" активна]
    
    N --> O[Клик "Отправить на проверку"]
    O --> P[Статус: pending_verification]
    
    P --> Q[Автоматические проверки]
    Q --> R[AI Risk Scoring]
    R --> S[Заявка в очередь модерации]
    
    S --> T{Решение администратора}
    T -->|Одобрить| U[Статус: active, verified]
    T -->|Отклонить| V[Статус: rejected]
    T -->|Запросить инфо| W[Статус: needs_more_info]
    
    W --> X[Оператор предоставляет доп.информацию]
    X --> P
    
    U --> Y[Оператор может создавать склады]
    V --> AA[Оператор может создать новую заявку]
    AA --> H
    
    Y --> AB[End: Активный верифицированный оператор]
```

---

## 5.2. Подробные шаги: регистрация, заполнение профиля, загрузка документов, ожидание проверки, результат (approve / reject / запрос доп.данных)

Детальное описание каждого шага UX-flow с экранами, действиями и переходами.

---

### Шаг 1: Регистрация

**Цель:** Создать базовый аккаунт оператора в системе

**Точка входа:**
- Landing page → "Стать оператором"
- Главная страница → "Для операторов"
- Прямой переход: `/operator/signup`

**Экран регистрации:**

```
┌────────────────────────────────────────────────────────────┐
│              🏢 Регистрация для операторов                 │
│                                                            │
│  Начните принимать заявки от клиентов уже сегодня         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Email *                                              │ │
│  │ ivan@skladbiz.ru                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Телефон *                                            │ │
│  │ +7 (___) ___-__-__                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Пароль *                                             │ │
│  │ ••••••••••••                                         │ │
│  │ 🔒 Минимум 8 символов                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Подтвердите пароль *                                 │ │
│  │ ••••••••••••                                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Тип вашего бизнеса *                      ▼          │ │
│  │ Legal Entity (LLC, FZE)                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ☑ Я согласен с Условиями использования и                 │
│     Политикой конфиденциальности                          │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Зарегистрироваться                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│               Уже есть аккаунт? Войти                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
1. Заполняет все поля
2. Отмечает чекбокс согласия с условиями
3. Нажимает "Зарегистрироваться"

**Валидация:**
- Email: формат, уникальность
- Телефон: формат E.164, уникальность
- Пароль: минимум 8 символов, сложность
- Подтверждение пароля: совпадение
- Тип бизнеса: обязательный выбор
- Согласие: обязательная отметка

**Результат:**
- ✅ Успешно: аккаунт создан, оператор автоматически авторизован, редирект на приветственный экран
- ❌ Ошибка: показывается сообщение об ошибке под соответствующим полем

**Время:** 2-3 минуты

---

### Шаг 2: Приветственный экран

**Цель:** Ориентировать оператора, показать следующие шаги

**Экран:**

```
┌────────────────────────────────────────────────────────────┐
│              🎉 Добро пожаловать, Иван!                    │
│                                                            │
│     Вы успешно зарегистрировались на платформе СкладОК.    │
│     Чтобы начать получать заявки от клиентов, выполните:  │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ✅ Шаг 1: Регистрация                           │    │
│   │     Готово!                                      │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Шаг 2: Заполните профиль компании           │    │
│   │     Название, ИНН, адрес, реквизиты              │    │
│   │     ⏱ ~5-10 минут                                 │    │
│   │     ┌──────────────────────────────┐              │    │
│   │     │ Заполнить профиль           │              │    │
│   │     └──────────────────────────────┘              │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Шаг 3: Загрузите документы                  │    │
│   │     ⏱ ~5 минут                                    │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  ⏺  Шаг 4: Проверка (24-48 часов)               │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│                                                            │
│              [Пропустить и изучить платформу]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
- Нажимает "Заполнить профиль" → переход к Шагу 3
- Нажимает "Пропустить" → переход в dashboard (может вернуться к заполнению позже)

**Время:** 10-30 секунд

---

### Шаг 3: Profile Completion компании

**Цель:** Собрать основную информацию о бизнесе оператора

**URL:** `/operator/profile/edit`

**Экран (пример для юрлица):**

```
┌────────────────────────────────────────────────────────────┐
│  [Логотип]   Профиль компании                  [Иван]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Шаг 2 из 4: Заполните профиль компании                   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                                            │
│  📋 Общая информация                                       │
│                                                            │
│  Название компании *                                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ StorageBiz LLC                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ИНН * [?]                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 7701234567                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│  ✅ ИНН корректен                                          │
│                                                            │
│  ОГРН * [?]                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 1027700000000                                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  КПП * [?]                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 770101001                                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────                 │
│                                                            │
│  📍 Адреса                                                 │
│                                                            │
│  Юридический адрес *                                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 123456, Dubai, Al Quoz, д. 1, офис 10        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ☐ Фактический адрес совпадает с юридическим               │
│                                                            │
│  Фактический адрес                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 123456, Dubai, ул. Пушкина, д. 2                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────                 │
│                                                            │
│  💰 Bank Details                                   │
│                                                            │
│  БИК банка * [?]                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 044525225                                            │ │
│  └──────────────────────────────────────────────────────┘ │
│  ✅ Банк: ПАО "Сбербанк России"                            │
│                                                            │
│  Расчетный счет * [?]                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 40702810400000001234                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Корреспондентский счет (автозаполнение) *                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 30101810400000000225                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────                 │
│                                                            │
│  👤 Контактное лицо                                        │
│                                                            │
│  ФИО *                                                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Иванов Иван Иванович                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Должность *                                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Генеральный директор                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Телефон *                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ +7 (495) 123-45-67                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────                 │
│                                                            │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │ Сохранить черновик │    │ Продолжить →       │         │
│  └────────────────────┘    └────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Особенности UX:**

1. **Inline-валидация:**
   - ИНН проверяется сразу при вводе (формат, контрольная сумма)
   - При валидном ИНН показывается ✅ "ИНН корректен"
   - При вводе БИК автоматически подтягивается название банка и корр.счет

2. **Подсказки (tooltips):**
   - Иконка [?] рядом с полем → при наведении показывается подсказка
   - Пример: "ИНН [?]" → "Индивидуальный номер налогоплательщика. Для юрлиц: 10 цифр."

3. **Автозаполнение:**
   - Если оператор вводит БИК, система автоматически подтягивает корр.счет из справочника БИК

4. **Сохранение черновика:**
   - Оператор может сохранить незаконченный профиль и вернуться позже

**Действия пользователя:**
- Заполняет все обязательные поля
- Нажимает "Продолжить" → переход к Шагу 4

**Валидация:**
- Все обязательные поля заполнены
- ИНН, ОГРН, БИК в корректном формате
- Расчетный счет соответствует БИК

**Время:** 5-10 минут

---

### Шаг 4: Document Upload

**Цель:** Получить юридические документы для верификации

**URL:** `/operator/documents`

**Экран:**

```
┌────────────────────────────────────────────────────────────┐
│  [Логотип]   Document Upload                  [Иван]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Шаг 3 из 4: Загрузите документы                          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░   │
│                                                            │
│  📄 Обязательные документы                                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  1. Выписка из UAE Commercial Registry                          ☐      │ │
│  │                                                      │ │
│  │  [Выбрать файл]  📎                                  │ │
│  │                                                      │ │
│  │  Формат: PDF, JPG, PNG (макс 10 МБ)                 │ │
│  │  Не старше 3 месяцев                                │ │
│  │  📚 [Как получить выписку?]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  2. Справка о банковских реквизитах           ☐      │ │
│  │                                                      │ │
│  │  [Выбрать файл]  📎                                  │ │
│  │                                                      │ │
│  │  Формат: PDF, JPG, PNG (макс 10 МБ)                 │ │
│  │  Скан из банка или скриншот из банк-клиента         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────                 │
│                                                            │
│  📄 Дополнительные документы (по запросу)                  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  3. Company Charter                            ☐      │ │
│  │                                                      │ │
│  │  [Выбрать файл]  📎                                  │ │
│  │                                                      │ │
│  │  (Опционально, может потребоваться при проверке)    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ─────────────────────────────────────────────             │
│                                                            │
│  Прогресс: 0/2 обязательных документов загружено           │
│                                                            │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │ Назад              │    │ Отправить на       │         │
│  │                    │    │ проверку           │ (блок)  │
│  └────────────────────┘    └────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Процесс загрузки файла:**

1. Оператор нажимает "Выбрать файл"
2. Открывается file picker
3. Оператор выбирает файл
4. Система проверяет:
   - Формат файла (PDF, JPG, PNG)
   - Размер файла (<10 МБ)
5. Если валидно:
   - Файл загружается на сервер
   - Показывается прогресс-бар загрузки
   - После загрузки: ✅ "Файл загружен: egrul_2025.pdf (2.3 МБ)"
   - Чекбокс ☐ меняется на ✅
   - Прогресс обновляется: "1/2 обязательных документов загружено"
6. Если невалидно:
   - Показывается ошибка: "Формат файла не поддерживается" или "Файл превышает 10 МБ"

**После загрузки всех обязательных документов:**

```
┌────────────────────────────────────────────────────────────┐
│  ...                                                       │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  1. Выписка из UAE Commercial Registry                          ✅      │ │
│  │                                                      │ │
│  │  ✅ egrul_2025.pdf (2.3 МБ)                          │ │
│  │  [Удалить]                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  2. Справка о банковских реквизитах           ✅      │ │
│  │                                                      │ │
│  │  ✅ bank_details.jpg (1.8 МБ)                        │ │
│  │  [Удалить]                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Прогресс: 2/2 обязательных документов загружено ✅        │
│                                                            │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │ Назад              │    │ Отправить на       │         │
│  │                    │    │ проверку           │ (актив) │
│  └────────────────────┘    └────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
- Загружает все обязательные документы
- Нажимает "Отправить на проверку" → переход к Шагу 5

**Время:** 5-10 минут (зависит от скорости интернета)

---

### Шаг 5: Подтверждение отправки

**Цель:** Убедиться, что оператор готов отправить заявку

**Модальное окно:**

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│           Отправить заявку на проверку?                    │
│                                                            │
│  После отправки вы не сможете редактировать профиль        │
│  и документы до завершения проверки.                       │
│                                                            │
│  Обычно проверка занимает 24-48 часов (рабочие дни).       │
│  Мы отправим вам уведомление по email, когда проверка      │
│  будет завершена.                                          │
│                                                            │
│  ☑ Я подтверждаю, что все данные корректны                 │
│                                                            │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │ Отмена             │    │ Отправить          │         │
│  └────────────────────┘    └────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Действия пользователя:**
- Отмечает чекбокс подтверждения
- Нажимает "Отправить" → заявка отправляется, переход к Шагу 6

**Системные действия:**
- Статус оператора: `draft` → `pending_verification`
- Статус верификации: `not_submitted` → `in_review`
- `submitted_at = NOW()`
- Вызов автоматических проверок (ИНН, БИК, AI Risk Engine)
- Создание задачи в очереди модерации
- Отправка email оператору: "Ваша заявка принята"
- Отправка уведомления администраторам

---

### Шаг 6: Ожидание проверки

**Цель:** Информировать оператора о статусе проверки

**URL:** `/operator/dashboard`

**Экран:**

```
┌────────────────────────────────────────────────────────────┐
│  [Логотип]   Dashboard                         [Иван]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│           🔍 Ваша заявка на рассмотрении                   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  Мы проверяем ваши документы и данные.              │ │
│  │  Обычно проверка занимает 24-48 часов.              │ │
│  │                                                      │ │
│  │  Статус: На проверке                                │ │
│  │  Дата подачи: 9 декабря 2025, 15:30                 │ │
│  │  Ожидаемая дата: 11 декабря 2025                    │ │
│  │                                                      │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░    │ │
│  │  Этап 2/3: Проверка документов                      │ │
│  │                                                      │ │
│  │  Вы получите email, когда проверка будет завершена. │ │
│  │                                                      │ │
│  │  [Связаться с поддержкой]                           │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Что происходит в фоне:**
- Automated Checks (ИНН, ОГРН, БИК)
- AI Risk Scoring
- Заявка попадает в очередь администратора
- Администратор просматривает профиль и документы
- Администратор принимает решение

**Время:** 24-48 часов

---

### Шаг 7: Результат проверки

**Вариант A: Одобрение**

**Email:**

```
Тема: Поздравляем! Ваш аккаунт одобрен

Привет, Иван!

Отличные новости! Ваша заявка на платформе СкладОК одобрена.

Теперь вы можете:
✅ Создавать склады и боксы
✅ Получать заявки от клиентов
✅ Управлять ценами и аналитикой

👉 Перейти в личный кабинет: https://selfstorage.com/operator/dashboard

Следующие шаги:
1. Создайте первый склад
2. Добавьте боксы и настройте цены
3. Начните принимать заявки!

С уважением,
Команда СкладОК
```

**Экран в личном кабинете:**

```
┌────────────────────────────────────────────────────────────┐
│           🎉 Поздравляем! Ваш аккаунт верифицирован        │
│                                                            │
│  Ваша заявка одобрена. Теперь вы можете пользоваться      │
│  всеми функциями платформы.                                │
│                                                            │
│  ┌────────────────────────────────┐                        │
│  │ Создать первый склад          │                        │
│  └────────────────────────────────┘                        │
│                                                            │
│  📚 [Инструкция по созданию склада]                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Вариант B: Запрос дополнительной информации**

**Email:**

```
Тема: Требуется дополнительная информация

Привет, Иван!

Для завершения проверки вашей заявки нам нужна дополнительная информация:

📝 Запрос от администратора:
"Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев. Загруженная выписка датирована апрелем 2025 года."

👉 Предоставить информацию: https://selfstorage.com/operator/dashboard

После предоставления информации мы продолжим проверку.

С уважением,
Команда СкладОК
```

**Экран в личном кабинете:** (см. раздел 4.7)

---

**Вариант C: Отклонение**

**Email:**

```
Тема: Ваша заявка отклонена

Привет, Иван!

К сожалению, мы не можем одобрить вашу заявку.

Причина отклонения:
"Компания с указанным ИНН не найдена в базе UAE Commercial Registry. Проверьте корректность ИНН и повторите попытку."

Если вы считаете, что произошла ошибка, свяжитесь с нашей поддержкой: support@selfstorage.com

С уважением,
Команда СкладОК
```

**Экран в личном кабинете:** (см. раздел 4.7)

---

## 5.3. Состояния оператора на уровне системы: draft, pending_verification, active, suspended, rejected

Подробное описание состояний оператора см. в разделе 2.5 (Основные статусы жизненного цикла оператора).

**Краткое резюме:**

| Статус | Description | Доступные функции |
|--------|----------|------------------|
| `draft` | Оператор зарегистрирован, но не отправил заявку | Profile Completion, загрузка документов |
| `pending_verification` | Заявка under review | Только просмотр статуса |
| `needs_more_info` | Требуется доп.информация | Загрузка доп.документов, редактирование |
| `active` | Верифицирован и active | Полный доступ ко всем функциям |
| `suspended` | Временно blocked | Только просмотр (read-only) |
| `rejected` | Заявка отклонена | Просмотр причины, создание новой заявки |
| `deactivated` | Аккаунт закрыт | Нет доступа |

---

## 5.4. UX-обработка ошибок (некорректные данные, отсутствие документов и т.п.)

Правильная обработка ошибок критична для UX. Оператор должен всегда понимать, что пошло не так и как это исправить.

**Принципы обработки ошибок:**

1. **Конкретность**: сообщение об ошибке должно четко объяснять проблему
2. **Локализация**: ошибка показывается рядом с проблемным полем
3. **Конструктивность**: предлагается способ исправления
4. **Дружелюбность**: тон сообщений дружелюбный, не обвиняющий

---

### Типы ошибок и их обработка

**1. Ошибки валидации формы (при регистрации / заполнении профиля)**

**Пример: некорректный email**

```
┌──────────────────────────────────────────────────────┐
│ Email *                                              │
│ ivan@skladbiz                                        │
└──────────────────────────────────────────────────────┘
❌ Введите корректный email
```

**Пример: ИНН с ошибкой**

```
┌──────────────────────────────────────────────────────┐
│ ИНН *                                                │
│ 77012345                                             │
└──────────────────────────────────────────────────────┘
❌ ИНН должен содержать 10 или 12 цифр
```

**Пример: пароли не совпадают**

```
┌──────────────────────────────────────────────────────┐
│ Подтвердите пароль *                                 │
│ ••••••••                                             │
└──────────────────────────────────────────────────────┘
❌ Пароли не совпадают
```

---

**2. Ошибки при загрузке файлов**

**Пример: неподдерживаемый формат**

```
┌──────────────────────────────────────────────────────┐
│  1. Выписка из UAE Commercial Registry                          ☐      │
│                                                      │
│  [Выбрать файл]  📎                                  │
│                                                      │
│  ❌ Ошибка: Неподдерживаемый формат файла            │
│     Файл "document.docx" не может быть загружен.    │
│     Поддерживаемые форматы: PDF, JPG, PNG           │
└──────────────────────────────────────────────────────┘
```

**Пример: файл слишком большой**

```
┌──────────────────────────────────────────────────────┐
│  1. Выписка из UAE Commercial Registry                          ☐      │
│                                                      │
│  [Выбрать файл]  📎                                  │
│                                                      │
│  ❌ Ошибка: Файл превышает 10 МБ                     │
│     Размер файла "egrul.pdf": 12.5 МБ               │
│     Максимальный размер: 10 МБ                      │
│     Попробуйте сжать файл или загрузить другой.    │
└──────────────────────────────────────────────────────┘
```

**Пример: ошибка загрузки на сервер**

```
┌──────────────────────────────────────────────────────┐
│  1. Выписка из UAE Commercial Registry                          ☐      │
│                                                      │
│  ❌ Ошибка загрузки файла                            │
│     Не удалось загрузить файл на сервер.            │
│     Проверьте интернет-соединение и попробуйте снова.│
│                                                      │
│  [Попробовать снова]                                │
└──────────────────────────────────────────────────────┘
```

---

**3. Ошибки при отправке на проверку**

**Пример: не все обязательные поля заполнены**

```
┌────────────────────────────────────────────────────────────┐
│  ❌ Невозможно отправить заявку                            │
│                                                            │
│  Для отправки заявки необходимо:                           │
│  • Заполнить все обязательные поля профиля                 │
│  • Загрузить все обязательные документы (2/2)              │
│                                                            │
│  Не заполнены поля:                                        │
│  • Юридический адрес                                       │
│  • БИК банка                                               │
│                                                            │
│  ┌────────────────────────────────┐                        │
│  │ Вернуться к заполнению        │                        │
│  └────────────────────────────────┘                        │
└────────────────────────────────────────────────────────────┘
```

---

**4. Системные ошибки**

**Пример: потеря соединения с сервером**

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│              ⚠️ Ошибка соединения с сервером                │
│                                                            │
│  Не удалось связаться с сервером. Проверьте интернет-      │
│  соединение и попробуйте снова.                            │
│                                                            │
│  Если проблема сохраняется, свяжитесь с поддержкой:        │
│  support@selfstorage.com                                   │
│                                                            │
│  ┌────────────────────────────────┐                        │
│  │ Попробовать снова             │                        │
│  └────────────────────────────────┘                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**5. Ошибки API (HTTP-коды)**

| HTTP-код | Тип ошибки | Сообщение пользователю |
|----------|-----------|------------------------|
| 400 Bad Request | Некорректные данные | "Проверьте правильность заполнения полей" |
| 401 Unauthorized | Не авторизован | "Сессия истекла. Пожалуйста, войдите снова" |
| 403 Forbidden | Нет прав доступа | "У вас нет прав на выполнение этого действия" |
| 404 Not Found | Ресурс не найден | "Запрашиваемая страница не найдена" |
| 409 Conflict | Конфликт (например, дубликат) | "Пользователь с таким email уже зарегистрирован" |
| 422 Unprocessable Entity | Ошибка валидации | "Данные не прошли валидацию. Проверьте правильность заполнения" |
| 429 Too Many Requests | Превышен лимит запросов | "Превышен лимит попыток. Попробуйте через 1 час" |
| 500 Internal Server Error | Ошибка сервера | "Внутренняя ошибка сервера. Мы уже работаем над её устранением" |

---

**6. Обработка ошибок в коде (Frontend)**

```typescript
async function handleSubmit() {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/v1/operators/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Обработка специфических ошибок
      if (response.status === 422) {
        // Ошибки валидации
        setFieldErrors(errorData.error.details.fields);
      } else if (response.status === 409) {
        // Конфликт (дубликат)
        setError(errorData.error.message);
      } else if (response.status === 429) {
        // Rate limit
        setError(`Превышен лимит попыток. Попробуйте через ${errorData.error.details.retry_after / 60} минут`);
      } else {
        // Общая ошибка
        setError('Произошла ошибка. Попробуйте позже.');
      }
      
      return;
    }
    
    const data = await response.json();
    // Успех
    router.push('/operator/dashboard');
    
  } catch (error) {
    // Ошибка сети или другая непредвиденная ошибка
    setError('Не удалось связаться с сервером. Проверьте интернет-соединение.');
    console.error('Submission error:', error);
  } finally {
    setLoading(false);
  }
}
```

---

## 5.5. Уведомления оператору (email/SMS/внутренние уведомления) по ключевым событиям

Уведомления держат оператора в курсе статуса его заявки и важных событий.

**Каналы уведомлений:**
- **Email** (основной канал)
- **Внутренние уведомления** в личном кабинете
- **SMS** (опционально, для критических событий)
- **Push-уведомления** (в будущем, для мобильного приложения)

---

### Ключевые события и уведомления

**1. Регистрация оператора**

**Email:**

Тема: `Добро пожаловать на СкладОК!`

```
Привет, Иван!

Спасибо за регистрацию на платформе СкладОК.

Вы зарегистрировались как оператор склада. Чтобы начать принимать заявки от клиентов, необходимо:

1. Заполнить профиль компании
2. Загрузить необходимые документы
3. Дождаться проверки (обычно 24-48 часов)

👉 Перейти в личный кабинет: https://selfstorage.com/operator/dashboard

Если у вас возникнут вопросы, наша команда поддержки всегда готова помочь: support@selfstorage.com

С уважением,
Команда СкладОК
```

**Внутреннее уведомление:**

```
🎉 Добро пожаловать на СкладОК!
Завершите регистрацию, чтобы начать получать заявки от клиентов.
[Заполнить профиль]
```

---

**2. Заявка отправлена на проверку**

**Email:**

Тема: `Ваша заявка принята на проверку`

```
Привет, Иван!

Ваша заявка на верификацию успешно отправлена.

Статус: На проверке
Дата подачи: 9 декабря 2025, 15:30
Ожидаемая дата завершения: 11 декабря 2025

Обычно проверка занимает 24-48 часов (рабочие дни).
Мы отправим вам уведомление, как только проверка будет завершена.

👉 Отслеживать статус: https://selfstorage.com/operator/dashboard

С уважением,
Команда СкладОК
```

**Внутреннее уведомление:**

```
🔍 Ваша заявка на рассмотрении
Ожидайте результат проверки в течение 24-48 часов.
```

---

**3. Запрос дополнительной информации**

**Email:**

Тема: `Требуется дополнительная информация`

```
Привет, Иван!

Для завершения проверки вашей заявки нам нужна дополнительная информация.

📝 Запрос от администратора:
"Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев. Загруженная выписка датирована апрелем 2025 года."

👉 Предоставить информацию: https://selfstorage.com/operator/dashboard

После предоставления информации мы продолжим проверку.

Если у вас возникнут вопросы, свяжитесь с нами: support@selfstorage.com

С уважением,
Команда СкладОК
```

**Внутреннее уведомление:**

```
⚠️ Требуется дополнительная информация
Администратор запросил дополнительные документы.
[Посмотреть запрос]
```

**SMS (опционально):**

```
СкладОК: Требуется дополнительная информация для завершения проверки. Подробнее: https://selfstorage.com/operator/dashboard
```

---

**4. Заявка одобрена**

**Email:**

Тема: `🎉 Поздравляем! Ваш аккаунт одобрен`

```
Привет, Иван!

Отличные новости! Ваша заявка на платформе СкладОК одобрена.

Теперь вы можете:
✅ Создавать склады и боксы
✅ Получать заявки от клиентов
✅ Управлять ценами и аналитикой

👉 Перейти в личный кабинет: https://selfstorage.com/operator/dashboard

Следующие шаги:
1. Создайте первый склад
2. Добавьте боксы и настройте цены
3. Начните принимать заявки!

📚 Инструкция по созданию склада: https://selfstorage.com/help/create-warehouse

Если у вас возникнут вопросы, мы всегда рады помочь: support@selfstorage.com

С уважением,
Команда СкладОК
```

**Внутреннее уведомление:**

```
🎉 Ваш аккаунт верифицирован!
Теперь вы можете создавать склады и получать заявки.
[Создать первый склад]
```

**SMS (опционально):**

```
СкладОК: Поздравляем! Ваш аккаунт одобрен. Начните работу: https://selfstorage.com/operator/dashboard
```

---

**5. Заявка отклонена**

**Email:**

Тема: `Ваша заявка отклонена`

```
Привет, Иван!

К сожалению, мы не можем одобрить вашу заявку.

Причина отклонения:
"Компания с указанным ИНН не найдена в базе UAE Commercial Registry. Проверьте корректность ИНН и повторите попытку."

Дата отклонения: 10 декабря 2025, 16:00

Что делать дальше:
• Проверьте правильность введенных данных
• Если данные корректны, свяжитесь с поддержкой: support@selfstorage.com
• Если ошибка была с вашей стороны, вы можете создать новую заявку с правильными данными

👉 Посмотреть детали: https://selfstorage.com/operator/dashboard

С уважением,
Команда СкладОК
```

**Внутреннее уведомление:**

```
❌ Ваша заявка отклонена
Причина: Компания не найдена в UAE Commercial Registry.
[Посмотреть детали] [Создать новую заявку]
```

---

**6. Напоминание о незавершенной регистрации**

**Email (через 24 часа после регистрации, если профиль не заполнен):**

Тема: `Не забудьте завершить регистрацию`

```
Привет, Иван!

Мы заметили, что вы начали регистрацию на СкладОК, но не завершили её.

Чтобы начать получать заявки от клиентов, осталось:
• Заполнить профиль компании
• Загрузить необходимые документы
• Отправить заявку на проверку

👉 Продолжить регистрацию: https://selfstorage.com/operator/dashboard

Если у вас возникли вопросы, мы готовы помочь: support@selfstorage.com

С уважением,
Команда СкладОК
```

---

**7. Напоминание о предоставлении доп.информации**

**Email (через 3 дня после запроса, если информация не предоставлена):**

Тема: `Напоминание: требуется дополнительная информация`

```
Привет, Иван!

Мы ждем от вас дополнительную информацию для завершения проверки.

Запрос от администратора:
"Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев."

Дата запроса: 10 декабря 2025

👉 Предоставить информацию: https://selfstorage.com/operator/dashboard

Если у вас возникли вопросы или проблемы с предоставлением информации, свяжитесь с нами: support@selfstorage.com

С уважением,
Команда СкладОК
```

---

**8. Автоматическое отклонение (через 30 дней без ответа)**

**Email:**

Тема: `Ваша заявка автоматически отклонена`

```
Привет, Иван!

К сожалению, ваша заявка была автоматически отклонена, так как мы не получили запрошенную информацию в течение 30 дней.

Если вы все еще заинтересованы в работе с нами, вы можете создать новую заявку.

👉 Создать новую заявку: https://selfstorage.com/operator/signup

С уважением,
Команда СкладОК
```

---

**Таблица уведомлений:**

| Событие | Email | Внутреннее | SMS | Push |
|---------|-------|-----------|-----|------|
| Регистрация | ✅ | ✅ | ❌ | ❌ |
| Заявка отправлена | ✅ | ✅ | ❌ | ❌ |
| Запрос доп.инфо | ✅ | ✅ | ⚠️ Опционально | ❌ |
| Заявка одобрена | ✅ | ✅ | ⚠️ Опционально | ❌ |
| Заявка отклонена | ✅ | ✅ | ❌ | ❌ |
| Напоминание о незавершенной регистрации (24ч) | ✅ | ✅ | ❌ | ❌ |
| Напоминание о доп.инфо (3 дня) | ✅ | ✅ | ❌ | ❌ |
| Напоминание о доп.инфо (7 дней) | ✅ | ✅ | ❌ | ❌ |
| Автоматическое отклонение (30 дней) | ✅ | ✅ | ❌ | ❌ |

---

**Настройки уведомлений:**

Оператор может управлять настройками уведомлений в личном кабинете:

```
┌────────────────────────────────────────────────────────────┐
│  Настройки уведомлений                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📧 Email-уведомления                                      │
│  ☑ Получать уведомления о статусе проверки                │
│  ☑ Получать напоминания                                    │
│  ☑ Получать новостную рассылку                             │
│                                                            │
│  📱 SMS-уведомления (опционально)                          │
│  ☐ Получать SMS при одобрении заявки                       │
│  ☐ Получать SMS при запросе доп.информации                 │
│                                                            │
│  🔔 Внутренние уведомления                                 │
│  ☑ Показывать уведомления в личном кабинете                │
│                                                            │
│  ┌────────────────────────────────┐                        │
│  │ Сохранить                     │                        │
│  └────────────────────────────────┘                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Конец Файла 2 (Разделы 4-5 полностью)**
# Operator Onboarding & Verification Specification (MVP v1)

**Document Version:** 1.0  
**Date:** December 9, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** Draft

---

## Файл 3: Раздел 6

---

# 6. Onboarding and Verification API Layer

## 6.1. Список и назначение эндпоинтов (минимум)

API-слой обеспечивает взаимодействие между фронтендом (веб-интерфейс оператора) и бэкендом (бизнес-логика, БД) в процессе онбординга и верификации.

**Базовый URL:** `https://api.selfstorage.com/api/v1`

**Аутентификация:** JWT Bearer Token (кроме регистрации и логина)

---

### Группа 1: Регистрация и аутентификация

| № | Эндпоинт | Метод | Description | Авторизация |
|---|----------|-------|----------|-------------|
| 1.1 | `/auth/register` | POST | Регистрация нового оператора | Нет |
| 1.2 | `/auth/login` | POST | Вход в систему | Нет |
| 1.3 | `/auth/refresh` | POST | Обновление access token | Refresh token |
| 1.4 | `/auth/logout` | POST | Выход из системы | JWT |

---

### Группа 2: Профиль оператора

| № | Эндпоинт | Метод | Description | Авторизация |
|---|----------|-------|----------|-------------|
| 2.1 | `/operators/me` | GET | Получить профиль текущего оператора | JWT (operator) |
| 2.2 | `/operators/me` | PUT | Обновить профиль оператора | JWT (operator) |
| 2.3 | `/operators/me/status` | GET | Получить статус верификации | JWT (operator) |

---

### Группа 3: Документы

| № | Эндпоинт | Метод | Description | Авторизация |
|---|----------|-------|----------|-------------|
| 3.1 | `/operators/me/documents` | GET | Получить список загруженных документов | JWT (operator) |
| 3.2 | `/operators/me/documents` | POST | Загрузить документ | JWT (operator) |
| 3.3 | `/operators/me/documents/{id}` | DELETE | Удалить документ | JWT (operator) |
| 3.4 | `/operators/me/documents/{id}/download` | GET | Скачать документ | JWT (operator) |

---

### Группа 4: Верификация

| № | Эндпоинт | Метод | Description | Авторизация |
|---|----------|-------|----------|-------------|
| 4.1 | `/operators/me/submit` | POST | Отправить заявку на проверку | JWT (operator) |
| 4.2 | `/operators/me/verification` | GET | Получить информацию о верификации | JWT (operator) |

---

### Группа 5: Админские операции

| № | Эндпоинт | Метод | Description | Авторизация |
|---|----------|-------|----------|-------------|
| 5.1 | `/admin/operators` | GET | Получить список операторов (с фильтрами) | JWT (admin) |
| 5.2 | `/admin/operators/{id}` | GET | Получить детали оператора | JWT (admin) |
| 5.3 | `/admin/operators/{id}/approve` | POST | Одобрить заявку оператора | JWT (admin) |
| 5.4 | `/admin/operators/{id}/reject` | POST | Отклонить заявку оператора | JWT (admin) |
| 5.5 | `/admin/operators/{id}/request-info` | POST | Запросить дополнительную информацию | JWT (admin) |
| 5.6 | `/admin/operators/{id}/documents/{docId}` | GET | Просмотреть документ оператора | JWT (admin) |
| 5.7 | `/admin/operators/{id}/audit-log` | GET | Получить audit log оператора | JWT (admin) |

---

## 6.2. Детализация эндпоинтов: HTTP-метод, путь, auth-требования (JWT, роль), поля request-body, валидация, структура response, возможные ошибки (400/401/403/404/409/422)

---

### 1.1. POST /auth/register — Регистрация оператора

**Description:** Создание нового аккаунта оператора.

**Авторизация:** Нет

**Request Body:**

```json
{
  "email": "ivan@skladbiz.ru",
  "phone": "+74951234567",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "operator_type": "legal_entity",
  "terms_accepted": true
}
```

**Валидация:**

| Поле | Тип | Обязательно | Правила |
|------|-----|-------------|---------|
| email | string | ✅ | Email формат, уникальность |
| phone | string | ✅ | E.164 формат, уникальность |
| password | string | ✅ | Мин 8 символов, сложность |
| password_confirmation | string | ✅ | Совпадает с password |
| operator_type | enum | ✅ | `legal_entity`, `individual_entrepreneur`, `self_employed`, `individual` |
| terms_accepted | boolean | ✅ | Должно быть true |

**Response: 201 Created**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ivan@skladbiz.ru",
      "phone": "+74951234567",
      "role": "operator",
      "created_at": "2025-12-09T15:30:00Z"
    },
    "operator": {
      "id": 456,
      "user_id": 123,
      "operator_type": "legal_entity",
      "status": "draft",
      "is_verified": false,
      "onboarding_progress": 10
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  },
  "message": "Регистрация успешна. Проверьте email для подтверждения."
}
```

**Возможные ошибки:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибка валидации данных",
    "details": {
      "fields": [
        {
          "field": "email",
          "message": "Некорректный формат email"
        }
      ]
    }
  }
}
```

**409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "email_already_exists",
    "message": "Пользователь с таким email уже зарегистрирован",
    "details": {
      "email": "ivan@skladbiz.ru"
    }
  }
}
```

**422 Unprocessable Entity:**
```json
{
  "success": false,
  "error": {
    "code": "weak_password",
    "message": "Пароль не соответствует требованиям безопасности",
    "details": {
      "requirements": [
        "Минимум 8 символов",
        "Минимум 1 заглавная буква",
        "Минимум 1 строчная буква",
        "Минимум 1 цифра",
        "Минимум 1 спецсимвол"
      ]
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
    "message": "Превышен лимит регистраций. Попробуйте через 1 час.",
    "details": {
      "limit": 3,
      "window": "1 hour",
      "retry_after": 3600
    }
  }
}
```

---

### 1.2. POST /auth/login — Вход в систему

**Description:** Аутентификация пользователя.

**Авторизация:** Нет

**Request Body:**

```json
{
  "email": "ivan@skladbiz.ru",
  "password": "SecurePass123!"
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ivan@skladbiz.ru",
      "role": "operator"
    },
    "operator": {
      "id": 456,
      "status": "draft",
      "is_verified": false
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900
    }
  }
}
```

**Возможные ошибки:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "invalid_credentials",
    "message": "Неверный email или пароль"
  }
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Слишком много попыток входа. Попробуйте через 15 минут.",
    "details": {
      "retry_after": 900
    }
  }
}
```

---

### 2.1. GET /operators/me — Получить профиль оператора

**Description:** Получение полной информации о профиле текущего оператора.

**Авторизация:** JWT (роль: operator)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "user_id": 123,
    "operator_type": "legal_entity",
    "status": "draft",
    "is_verified": false,
    "verification_status": "not_submitted",
    "onboarding_progress": 40,
    
    "company_info": {
      "company_name": "ООО \"СкладБизнес\"",
      "inn": "7701234567",
      "ogrn": "1027700000000",
      "kpp": "770101001",
      "legal_address": "123456, Dubai, Al Quoz, д. 1, офис 10",
      "actual_address": "123456, Dubai, ул. Пушкина, д. 2"
    },
    
    "bank_details": {
      "bik": "044525225",
      "account_number": "40702810400000001234",
      "correspondent_account": "30101810400000000225",
      "bank_name": "ПАО \"Сбербанк России\""
    },
    
    "contact_person": {
      "full_name": "Иванов Иван Иванович",
      "position": "Генеральный директор",
      "phone": "+74951234567",
      "email": "ivan@skladbiz.ru"
    },
    
    "risk_assessment": {
      "risk_score": null,
      "risk_level": null,
      "fraud_signals": []
    },
    
    "timestamps": {
      "created_at": "2025-12-09T15:30:00Z",
      "updated_at": "2025-12-09T16:00:00Z",
      "submitted_at": null,
      "verified_at": null
    }
  }
}
```

**Возможные ошибки:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "message": "Требуется авторизация"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "forbidden",
    "message": "Недостаточно прав для выполнения операции"
  }
}
```

---

### 2.2. PUT /operators/me — Обновить профиль оператора

**Description:** Обновление данных профиля оператора.

**Авторизация:** JWT (роль: operator)

**Ограничение:** Доступно только в статусах `draft` и `needs_more_info`.

**Request Body:**

```json
{
  "company_info": {
    "company_name": "ООО \"СкладБизнес\"",
    "inn": "7701234567",
    "ogrn": "1027700000000",
    "kpp": "770101001",
    "legal_address": "123456, Dubai, Al Quoz, д. 1, офис 10",
    "actual_address": "123456, Dubai, ул. Пушкина, д. 2"
  },
  "bank_details": {
    "bik": "044525225",
    "account_number": "40702810400000001234",
    "correspondent_account": "30101810400000000225",
    "bank_name": "ПАО \"Сбербанк России\""
  },
  "contact_person": {
    "full_name": "Иванов Иван Иванович",
    "position": "Генеральный директор",
    "phone": "+74951234567",
    "email": "ivan@skladbiz.ru"
  }
}
```

**Валидация:**

| Поле | Тип | Обязательно | Правила |
|------|-----|-------------|---------|
| company_name | string | ✅ | 2-255 символов |
| inn | string | ✅ | 10 или 12 цифр, контрольная сумма |
| ogrn | string | ✅ | 13 или 15 цифр, контрольная сумма |
| kpp | string | ✅ (для юрлиц) | 9 цифр |
| legal_address | string | ✅ | 10-500 символов |
| bik | string | ✅ | 9 цифр, существует в справочнике |
| account_number | string | ✅ | 20 цифр |
| full_name | string | ✅ | 5-100 символов |
| phone | string | ✅ | E.164 формат |

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "onboarding_progress": 70,
    "updated_at": "2025-12-09T16:30:00Z",
    "message": "Профиль успешно обновлен"
  }
}
```

**Возможные ошибки:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибка валидации данных",
    "details": {
      "fields": [
        {
          "field": "inn",
          "message": "Некорректная контрольная сумма ИНН"
        }
      ]
    }
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "cannot_edit_profile",
    "message": "Невозможно редактировать профиль в статусе 'pending_verification'",
    "details": {
      "current_status": "pending_verification"
    }
  }
}
```

---

### 2.3. GET /operators/me/status — Получить статус верификации

**Description:** Получение текущего статуса верификации и прогресса онбординга.

**Авторизация:** JWT (роль: operator)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "status": "pending_verification",
    "verification_status": "in_review",
    "is_verified": false,
    "onboarding_progress": 80,
    "submitted_at": "2025-12-09T17:00:00Z",
    "estimated_completion": "2025-12-11T17:00:00Z",
    
    "next_steps": [
      {
        "step": "wait_for_review",
        "title": "Ожидание проверки",
        "description": "Ваша заявка на рассмотрении. Обычно проверка занимает 24-48 часов.",
        "is_completed": false
      }
    ],
    
    "checks": {
      "profile_completed": true,
      "documents_uploaded": true,
      "submitted": true,
      "verified": false
    }
  }
}
```

---

### 3.1. GET /operators/me/documents — Список документов

**Description:** Получение списка загруженных документов оператора.

**Авторизация:** JWT (роль: operator)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": 1,
        "document_type": "egrul_extract",
        "document_name": "Выписка из UAE Commercial Registry",
        "file_name": "egrul_2025.pdf",
        "file_size": 2457600,
        "file_type": "application/pdf",
        "status": "uploaded",
        "uploaded_at": "2025-12-09T16:45:00Z"
      },
      {
        "id": 2,
        "document_type": "bank_details",
        "document_name": "Справка о банковских реквизитах",
        "file_name": "bank_details.jpg",
        "file_size": 1887436,
        "file_type": "image/jpeg",
        "status": "uploaded",
        "uploaded_at": "2025-12-09T16:50:00Z"
      }
    ],
    "required_documents": [
      {
        "type": "egrul_extract",
        "name": "Выписка из UAE Commercial Registry",
        "is_uploaded": true,
        "is_required": true
      },
      {
        "type": "bank_details",
        "name": "Справка о банковских реквизитах",
        "is_uploaded": true,
        "is_required": true
      },
      {
        "type": "charter",
        "name": "Company Charter",
        "is_uploaded": false,
        "is_required": false
      }
    ],
    "completion_percentage": 100
  }
}
```

---

### 3.2. POST /operators/me/documents — Загрузить документ

**Description:** Загрузка нового документа.

**Авторизация:** JWT (роль: operator)

**Content-Type:** `multipart/form-data`

**Request Body:**

```
file: [binary data]
document_type: "egrul_extract"
```

**Параметры:**

| Параметр | Тип | Обязательно | Description |
|----------|-----|-------------|----------|
| file | file | ✅ | Файл документа |
| document_type | string | ✅ | Тип документа: `egrul_extract`, `bank_details`, `charter`, `passport`, etc. |

**Валидация:**
- Формат файла: PDF, JPG, JPEG, PNG
- Максимальный размер: 10 МБ
- Файл не должен быть поврежден

**Response: 201 Created**

```json
{
  "success": true,
  "data": {
    "document": {
      "id": 3,
      "document_type": "egrul_extract",
      "file_name": "egrul_2025.pdf",
      "file_size": 2457600,
      "status": "uploaded",
      "uploaded_at": "2025-12-09T17:00:00Z"
    }
  },
  "message": "Документ успешно загружен"
}
```

**Возможные ошибки:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "invalid_file_format",
    "message": "Неподдерживаемый формат файла",
    "details": {
      "allowed_formats": ["PDF", "JPG", "JPEG", "PNG"],
      "provided_format": "DOCX"
    }
  }
}
```

**413 Payload Too Large:**
```json
{
  "success": false,
  "error": {
    "code": "file_too_large",
    "message": "Файл превышает максимальный размер",
    "details": {
      "max_size": 10485760,
      "file_size": 12582912
    }
  }
}
```

---

### 3.3. DELETE /operators/me/documents/{id} — Удалить документ

**Description:** Удаление загруженного документа.

**Авторизация:** JWT (роль: operator)

**Ограничение:** Доступно только в статусах `draft` и `needs_more_info`.

**Response: 200 OK**

```json
{
  "success": true,
  "message": "Документ успешно удален"
}
```

**Возможные ошибки:**

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "document_not_found",
    "message": "Документ не найден"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "cannot_delete_document",
    "message": "Невозможно удалить документ в статусе 'pending_verification'"
  }
}
```

---

### 4.1. POST /operators/me/submit — Отправить заявку на проверку

**Description:** Отправка заявки на модерацию.

**Авторизация:** JWT (роль: operator)

**Предусловия:**
- Все обязательные поля профиля заполнены
- Все обязательные документы загружены
- Статус оператора: `draft`

**Request Body:**

```json
{
  "terms_confirmed": true
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "pending_verification",
      "verification_status": "in_review",
      "submitted_at": "2025-12-09T17:30:00Z",
      "estimated_completion": "2025-12-11T17:30:00Z"
    },
    "risk_assessment": {
      "risk_score": 35,
      "risk_level": "medium",
      "fraud_signals": []
    }
  },
  "message": "Заявка успешно отправлена на проверку"
}
```

**Возможные ошибки:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "incomplete_profile",
    "message": "Профиль заполнен не полностью",
    "details": {
      "missing_fields": [
        "legal_address",
        "bik"
      ],
      "missing_documents": [
        "egrul_extract"
      ]
    }
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "invalid_status",
    "message": "Невозможно отправить заявку в текущем статусе",
    "details": {
      "current_status": "pending_verification"
    }
  }
}
```

---

### 4.2. GET /operators/me/verification — Информация о верификации

**Description:** Получение детальной информации о процессе верификации.

**Авторизация:** JWT (роль: operator)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "verification_status": "in_review",
    "submitted_at": "2025-12-09T17:30:00Z",
    "estimated_completion": "2025-12-11T17:30:00Z",
    
    "risk_assessment": {
      "risk_score": 35,
      "risk_level": "medium",
      "fraud_signals": [],
      "assessed_at": "2025-12-09T17:30:15Z"
    },
    
    "admin_actions": [
      {
        "action": "submitted_for_review",
        "performed_at": "2025-12-09T17:30:00Z",
        "comment": null
      }
    ],
    
    "requested_info": null,
    "rejection_reason": null
  }
}
```

---

### 5.1. GET /admin/operators — Список операторов

**Description:** Получение списка операторов с фильтрацией и пагинацией.

**Авторизация:** JWT (роль: admin)

**Query Parameters:**

| Параметр | Тип | Description | По умолчанию |
|----------|-----|----------|--------------|
| status | string | Фильтр по статусу: `draft`, `pending_verification`, `active`, etc. | Все |
| verification_status | string | Фильтр по статусу верификации | Все |
| operator_type | string | Фильтр по типу оператора | Все |
| risk_level | string | Фильтр по уровню риска: `low`, `medium`, `high` | Все |
| search | string | Поиск по названию, ИНН, email | - |
| page | integer | Номер страницы | 1 |
| per_page | integer | Количество на странице (макс 100) | 20 |
| sort_by | string | Сортировка: `created_at`, `submitted_at`, `risk_score` | created_at |
| sort_order | string | Порядок: `asc`, `desc` | desc |

**Пример запроса:**
```
GET /admin/operators?status=pending_verification&risk_level=medium&page=1&per_page=20
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operators": [
      {
        "id": 456,
        "company_name": "ООО \"СкладБизнес\"",
        "inn": "7701234567",
        "operator_type": "legal_entity",
        "status": "pending_verification",
        "verification_status": "in_review",
        "risk_score": 35,
        "risk_level": "medium",
        "submitted_at": "2025-12-09T17:30:00Z",
        "contact_person": {
          "full_name": "Иванов Иван Иванович",
          "email": "ivan@skladbiz.ru",
          "phone": "+74951234567"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 45,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    },
    "filters_applied": {
      "status": "pending_verification",
      "risk_level": "medium"
    }
  }
}
```

---

### 5.2. GET /admin/operators/{id} — Детали оператора

**Description:** Получение полной информации об операторе для модерации.

**Авторизация:** JWT (роль: admin)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "user_id": 123,
      "operator_type": "legal_entity",
      "status": "pending_verification",
      "verification_status": "in_review",
      "is_verified": false,
      
      "company_info": {
        "company_name": "ООО \"СкладБизнес\"",
        "inn": "7701234567",
        "ogrn": "1027700000000",
        "kpp": "770101001",
        "legal_address": "123456, Dubai, Al Quoz, д. 1, офис 10",
        "actual_address": "123456, Dubai, ул. Пушкина, д. 2"
      },
      
      "bank_details": {
        "bik": "044525225",
        "account_number": "40702810400000001234",
        "correspondent_account": "30101810400000000225",
        "bank_name": "ПАО \"Сбербанк России\""
      },
      
      "contact_person": {
        "full_name": "Иванов Иван Иванович",
        "position": "Генеральный директор",
        "phone": "+74951234567",
        "email": "ivan@skladbiz.ru"
      },
      
      "documents": [
        {
          "id": 1,
          "document_type": "egrul_extract",
          "file_name": "egrul_2025.pdf",
          "file_size": 2457600,
          "uploaded_at": "2025-12-09T16:45:00Z",
          "download_url": "/admin/operators/456/documents/1"
        },
        {
          "id": 2,
          "document_type": "bank_details",
          "file_name": "bank_details.jpg",
          "file_size": 1887436,
          "uploaded_at": "2025-12-09T16:50:00Z",
          "download_url": "/admin/operators/456/documents/2"
        }
      ],
      
      "risk_assessment": {
        "risk_score": 35,
        "risk_level": "medium",
        "fraud_signals": [],
        "recommendation": "manual_review",
        "assessed_at": "2025-12-09T17:30:15Z"
      },
      
      "automatic_checks": {
        "inn_valid": true,
        "ogrn_valid": true,
        "bik_valid": true,
        "email_reputation": "high",
        "phone_valid": true,
        "ip_check": {
          "country": "RU",
          "is_vpn": false,
          "is_proxy": false
        }
      },
      
      "onboarding_channel": "self_service",
      "submitted_at": "2025-12-09T17:30:00Z",
      "created_at": "2025-12-09T15:30:00Z",
      "updated_at": "2025-12-09T17:30:00Z"
    }
  }
}
```

---

### 5.3. POST /admin/operators/{id}/approve — Одобрить заявку

**Description:** Одобрение заявки оператора.

**Авторизация:** JWT (роль: admin)

**Request Body:**

```json
{
  "comment": "Все документы в порядке. Одобрено."
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "active",
      "verification_status": "verified",
      "is_verified": true,
      "verified_at": "2025-12-10T10:00:00Z",
      "verified_by": 789
    }
  },
  "message": "Заявка оператора успешно одобрена"
}
```

---

### 5.4. POST /admin/operators/{id}/reject — Отклонить заявку

**Description:** Отклонение заявки оператора.

**Авторизация:** JWT (роль: admin)

**Request Body:**

```json
{
  "reason": "Компания с указанным ИНН не найдена в базе UAE Commercial Registry. Проверьте корректность ИНН."
}
```

**Валидация:**
- `reason` — обязательное поле, минимум 10 символов

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "rejected",
      "verification_status": "rejected",
      "rejected_at": "2025-12-10T10:00:00Z",
      "rejected_by": 789,
      "rejection_reason": "Компания с указанным ИНН не найдена в базе UAE Commercial Registry. Проверьте корректность ИНН."
    }
  },
  "message": "Заявка оператора отклонена"
}
```

---

### 5.5. POST /admin/operators/{id}/request-info — Запросить доп. информацию

**Description:** Запрос дополнительной информации у оператора.

**Авторизация:** JWT (роль: admin)

**Request Body:**

```json
{
  "requested_info": "Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев. Загруженная выписка датирована апрелем 2025 года."
}
```

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "needs_more_info",
      "verification_status": "needs_more_info",
      "requested_info": "Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев. Загруженная выписка датирована апрелем 2025 года.",
      "requested_at": "2025-12-10T10:00:00Z",
      "requested_by": 789
    }
  },
  "message": "Запрос на дополнительную информацию отправлен оператору"
}
```

---

### 5.7. GET /admin/operators/{id}/audit-log — Audit Log

**Description:** Получение истории действий по оператору.

**Авторизация:** JWT (роль: admin)

**Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "audit_log": [
      {
        "id": 1,
        "action": "operator_registered",
        "actor_type": "system",
        "actor_id": null,
        "timestamp": "2025-12-09T15:30:00Z",
        "details": {
          "email": "ivan@skladbiz.ru",
          "operator_type": "legal_entity"
        }
      },
      {
        "id": 2,
        "action": "profile_updated",
        "actor_type": "operator",
        "actor_id": 456,
        "timestamp": "2025-12-09T16:30:00Z",
        "details": {
          "fields_updated": ["company_name", "inn", "legal_address"]
        }
      },
      {
        "id": 3,
        "action": "document_uploaded",
        "actor_type": "operator",
        "actor_id": 456,
        "timestamp": "2025-12-09T16:45:00Z",
        "details": {
          "document_type": "egrul_extract",
          "file_name": "egrul_2025.pdf"
        }
      },
      {
        "id": 4,
        "action": "submitted_for_review",
        "actor_type": "operator",
        "actor_id": 456,
        "timestamp": "2025-12-09T17:30:00Z",
        "details": {
          "risk_score": 35,
          "risk_level": "medium"
        }
      },
      {
        "id": 5,
        "action": "operator_approved",
        "actor_type": "admin",
        "actor_id": 789,
        "timestamp": "2025-12-10T10:00:00Z",
        "details": {
          "comment": "Все документы в порядке. Одобрено."
        }
      }
    ]
  }
}
```

---

## 6.3. Examples JSON-запросов и ответов для ключевых сценариев

### Сценарий 1: Регистрация оператора

**Запрос:**
```http
POST /api/v1/auth/register HTTP/1.1
Host: api.selfstorage.com
Content-Type: application/json

{
  "email": "ivan@skladbiz.ru",
  "phone": "+74951234567",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "operator_type": "legal_entity",
  "terms_accepted": true
}
```

**Ответ (успех):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "ivan@skladbiz.ru",
      "role": "operator"
    },
    "operator": {
      "id": 456,
      "status": "draft",
      "is_verified": false
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Сценарий 2: Обновление профиля

**Запрос:**
```http
PUT /api/v1/operators/me HTTP/1.1
Host: api.selfstorage.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "company_info": {
    "company_name": "ООО \"СкладБизнес\"",
    "inn": "7701234567",
    "ogrn": "1027700000000",
    "kpp": "770101001",
    "legal_address": "123456, Dubai, Al Quoz, д. 1, офис 10"
  },
  "bank_details": {
    "bik": "044525225",
    "account_number": "40702810400000001234"
  },
  "contact_person": {
    "full_name": "Иванов Иван Иванович",
    "position": "Генеральный директор",
    "phone": "+74951234567"
  }
}
```

**Ответ (успех):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": 456,
    "onboarding_progress": 70,
    "updated_at": "2025-12-09T16:30:00Z"
  },
  "message": "Профиль успешно обновлен"
}
```

---

### Сценарий 3: Загрузка документа

**Запрос:**
```http
POST /api/v1/operators/me/documents HTTP/1.1
Host: api.selfstorage.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="document_type"

egrul_extract
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="egrul_2025.pdf"
Content-Type: application/pdf

[binary data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Ответ (успех):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "document": {
      "id": 1,
      "document_type": "egrul_extract",
      "file_name": "egrul_2025.pdf",
      "file_size": 2457600,
      "uploaded_at": "2025-12-09T16:45:00Z"
    }
  },
  "message": "Документ успешно загружен"
}
```

---

### Сценарий 4: Отправка на проверку

**Запрос:**
```http
POST /api/v1/operators/me/submit HTTP/1.1
Host: api.selfstorage.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "terms_confirmed": true
}
```

**Ответ (успех):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "pending_verification",
      "submitted_at": "2025-12-09T17:30:00Z"
    },
    "risk_assessment": {
      "risk_score": 35,
      "risk_level": "medium"
    }
  },
  "message": "Заявка успешно отправлена на проверку"
}
```

---

### Сценарий 5: Одобрение администратором

**Запрос:**
```http
POST /api/v1/admin/operators/456/approve HTTP/1.1
Host: api.selfstorage.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "comment": "Все документы в порядке. Одобрено."
}
```

**Ответ (успех):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "operator": {
      "id": 456,
      "status": "active",
      "verification_status": "verified",
      "is_verified": true,
      "verified_at": "2025-12-10T10:00:00Z"
    }
  },
  "message": "Заявка оператора успешно одобрена"
}
```

---

## 6.4. Единый формат ошибок (связь с Error Handling Spec)

Все API-ошибки возвращаются в едином формате для упрощения обработки на клиенте.

**Структура ответа с ошибкой:**

```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Человекочитаемое сообщение об ошибке",
    "details": {
      // Дополнительная информация (опционально)
    }
  }
}
```

---

### Стандартные HTTP-коды ошибок

| HTTP-код | Название | Использование |
|----------|---------|---------------|
| 400 | Bad Request | Некорректный запрос (общие ошибки) |
| 401 | Unauthorized | Требуется аутентификация или токен невалиден |
| 403 | Forbidden | Недостаточно прав для выполнения операции |
| 404 | Not Found | Ресурс не найден |
| 409 | Conflict | Конфликт (например, email уже существует) |
| 422 | Unprocessable Entity | Ошибки валидации |
| 429 | Too Many Requests | Превышен лимит запросов (rate limiting) |
| 500 | Internal Server Error | Внутренняя ошибка сервера |
| 503 | Service Unavailable | Сервис временно недоступен |

---

### Examples ошибок

**400 Bad Request — Общая ошибка запроса:**
```json
{
  "success": false,
  "error": {
    "code": "bad_request",
    "message": "Некорректный запрос"
  }
}
```

**401 Unauthorized — Не авторизован:**
```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "message": "Требуется авторизация"
  }
}
```

**401 Unauthorized — Невалидный токен:**
```json
{
  "success": false,
  "error": {
    "code": "invalid_token",
    "message": "Токен авторизации невалиден или истек"
  }
}
```

**403 Forbidden — Недостаточно прав:**
```json
{
  "success": false,
  "error": {
    "code": "forbidden",
    "message": "Недостаточно прав для выполнения операции"
  }
}
```

**404 Not Found — Ресурс не найден:**
```json
{
  "success": false,
  "error": {
    "code": "not_found",
    "message": "Запрашиваемый ресурс не найден"
  }
}
```

**409 Conflict — Email уже существует:**
```json
{
  "success": false,
  "error": {
    "code": "email_already_exists",
    "message": "Пользователь с таким email уже зарегистрирован",
    "details": {
      "email": "ivan@skladbiz.ru"
    }
  }
}
```

**422 Unprocessable Entity — Ошибки валидации:**
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибка валидации данных",
    "details": {
      "fields": [
        {
          "field": "inn",
          "message": "ИНН должен содержать 10 или 12 цифр",
          "value": "77012345"
        },
        {
          "field": "email",
          "message": "Некорректный формат email",
          "value": "invalid-email"
        }
      ]
    }
  }
}
```

**429 Too Many Requests — Rate limit:**
```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Превышен лимит запросов. Попробуйте позже.",
    "details": {
      "limit": 100,
      "window": "1 hour",
      "retry_after": 3600
    }
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "internal_server_error",
    "message": "Внутренняя ошибка сервера. Мы уже работаем над её устранением.",
    "details": {
      "request_id": "req_abc123xyz"
    }
  }
}
```

---

### Коды ошибок (Error Codes)

**Аутентификация и авторизация:**
- `unauthorized` — Требуется авторизация
- `invalid_token` — Невалидный токен
- `token_expired` — Токен истек
- `forbidden` — Недостаточно прав
- `invalid_credentials` — Неверный email или пароль

**Валидация:**
- `validation_error` — Ошибка валидации (с деталями по полям)
- `missing_field` — Отсутствует обязательное поле
- `invalid_format` — Некорректный формат данных

**Конфликты:**
- `email_already_exists` — Email уже зарегистрирован
- `phone_already_exists` — Телефон уже зарегистрирован
- `inn_already_exists` — ИНН уже зарегистрирован

**Бизнес-логика:**
- `incomplete_profile` — Профиль заполнен не полностью
- `invalid_status` — Операция невозможна в текущем статусе
- `cannot_edit_profile` — Невозможно редактировать профиль
- `cannot_delete_document` — Невозможно удалить документ

**Файлы:**
- `invalid_file_format` — Неподдерживаемый формат файла
- `file_too_large` — Файл превышает максимальный размер
- `file_corrupted` — Файл поврежден

**Rate Limiting:**
- `rate_limit_exceeded` — Превышен лимит запросов

**Системные:**
- `internal_server_error` — Внутренняя ошибка сервера
- `service_unavailable` — Сервис временно недоступен
- `not_found` — Ресурс не найден

---

## 6.5. Ограничения rate limiting для онбординговых операций (чтобы избежать злоупотреблений)

Rate limiting защищает API от злоупотреблений, DDoS-атак и ботов.

**Принципы rate limiting:**
- Лимиты устанавливаются на уровне IP-адреса и/или пользователя
- Используется алгоритм "sliding window" или "token bucket"
- Лимиты более строгие для анонимных пользователей
- Лимиты менее строгие для авторизованных операторов

---

### Rate Limits по эндпоинтам

| Эндпоинт | Лимит (анонимный) | Лимит (авторизован) | Окно времени |
|----------|-------------------|---------------------|--------------|
| `POST /auth/register` | 3 запроса | N/A | 1 час |
| `POST /auth/login` | 5 попыток | N/A | 15 минут |
| `POST /auth/refresh` | N/A | 10 запросов | 1 час |
| `PUT /operators/me` | N/A | 20 запросов | 1 час |
| `POST /operators/me/documents` | N/A | 10 запросов | 1 час |
| `POST /operators/me/submit` | N/A | 3 запроса | 1 день |
| `GET /operators/*` | N/A | 100 запросов | 1 час |
| `POST /admin/*` | N/A | 200 запросов | 1 час |

---

### Заголовки rate limiting

API возвращает заголовки с информацией о лимитах:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1670598000
```

| Заголовок | Description |
|-----------|----------|
| `X-RateLimit-Limit` | Максимальное количество запросов в окне |
| `X-RateLimit-Remaining` | Оставшееся количество запросов |
| `X-RateLimit-Reset` | Unix timestamp, когда лимит будет сброшен |

---

### Ответ при превышении лимита

**HTTP 429 Too Many Requests:**

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1670598000
Retry-After: 3600
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Превышен лимит регистраций. Попробуйте через 1 час.",
    "details": {
      "limit": 3,
      "window": "1 hour",
      "retry_after": 3600
    }
  }
}
```

**Заголовок `Retry-After`:**
- Указывает, через сколько секунд можно повторить запрос

---

### Обработка rate limiting на клиенте

**JavaScript пример:**

```typescript
async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Проверка rate limit
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const data = await response.json();
      
      throw new RateLimitError(
        data.error.message,
        parseInt(retryAfter || '3600')
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error(`Rate limit exceeded. Retry after ${error.retryAfter} seconds`);
      // Можно показать пользователю таймер или сообщение
    }
    throw error;
  }
}
```

---

### Исключения из rate limiting

**Whitelist IP-адресов:**
- Офисные IP платформы
- IP sales-команды
- Доверенные партнеры

**Повышенные лимиты:**
- Операторы с историей (не новые)
- Операторы, пришедшие через sales (канал: `sales_led`)

---

### Мониторинг и алерты

**Логирование:**
- Все случаи превышения rate limit логируются
- Анализ паттернов для выявления ботов

**Алерты:**
- Если один IP превышает лимит >10 раз/день → блокировка IP
- Если множественные IP с одного диапазона → подозрение на DDoS

---

**Конец Файла 3 (Раздел 6 полностью)**

# Operator Onboarding & Verification Specification (MVP v1)

**Document Version:** 1.0  
**Date:** December 9, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** Draft

---

## Файл 4: Разделы 7-8

---

# 7. Risk Scoring / Fraud Engine Integration / Fraud Engine (если есть)

## 7.1. Цель интеграции, что даёт AI/ML

AI-модуль для оценки рисков (Risk Scoring / Fraud Engine) помогает автоматически выявлять подозрительных операторов и снижать нагрузку на администраторов.

**Цели интеграции:**

1. **Автоматическая оценка риска**
   - Мгновенный расчет risk score (0-100) при подаче заявки
   - Классификация по уровням риска: low / medium / high
   - Рекомендация: auto-approve / manual review / auto-reject

2. **Детекция фрода**
   - Выявление поддельных документов
   - Обнаружение подозрительных паттернов поведения
   - Идентификация ботов и автоматизированных регистраций

3. **Снижение нагрузки на модерацию**
   - MVP: 100% ручная модерация
   - v1.1+: 40-50% auto-approve для low-risk операторов
   - v2.0+: 70-80% auto-approve

4. **Повышение качества операторов**
   - Отсеивание мошенников на раннем этапе
   - Снижение количества проблемных операторов на платформе
   - Защита клиентов от недобросовестных операторов

5. **Continuous learning**
   - Модель обучается на исторических данных
   - Улучшение точности с каждым новым кейсом
   - Адаптация к новым видам фрода

---

**Что дает AI/ML:**

| Преимущество | Description | Метрика |
|--------------|----------|---------|
| **Скорость** | Оценка риска за <1 секунду | Мгновенно |
| **Масштабируемость** | Обработка тысяч заявок без увеличения команды | Неограничено |
| **Консистентность** | Одинаковый подход ко всем заявкам | 100% |
| **24/7 работа** | Круглосуточная оценка без выходных | 24/7 |
| **Точность** | Высокая точность детекции фрода | 85-95% |
| **Адаптивность** | Обучение на новых данных | Постоянно |

---

## 7.2. Момент вызова fraud-проверки (после submit, триггеры)

AI Risk Engine вызывается автоматически в ключевых точках онбординга.

**Основные триггеры:**

### 1. Сразу после отправки заявки (POST /operators/me/submit)

**Когда:** Оператор нажимает "Отправить на проверку"

**Что происходит:**

```mermaid
sequenceDiagram
    participant O as Operator
    participant API as API Server
    participant VAL as Validation Service
    participant RISK as Risk Engine
    participant QUEUE as Moderation Queue
    participant DB as Database
    participant NOTIF as Notification Service

    O->>API: POST /operators/me/submit
    API->>VAL: Validate completeness
    VAL-->>API: ✅ Complete
    
    API->>RISK: Calculate risk score
    Note over RISK: - Analyze profile data<br/>- Check documents<br/>- Behavioral analysis<br/>- Historical checks
    RISK-->>API: Risk Score: 35 (medium)
    
    API->>DB: Update operator<br/>status: pending_verification<br/>risk_score: 35
    
    API->>QUEUE: Add to moderation queue<br/>Priority: medium
    
    API->>NOTIF: Send notification to operator
    API-->>O: 200 OK + Risk Score
```

**Детали вызова:**

```typescript
// После успешной валидации в POST /operators/me/submit
async function submitForVerification(operatorId: number) {
  // 1. Собираем данные для Risk Engine
  const operatorData = await getOperatorFullData(operatorId);
  
  // 2. Вызываем Risk Engine
  const riskAssessment = await calculateRiskScore({
    operator_id: operatorId,
    operator_type: operatorData.operator_type,
    company_info: operatorData.company_info,
    bank_details: operatorData.bank_details,
    documents: operatorData.documents,
    behavioral_data: operatorData.behavioral_data,
    technical_data: operatorData.technical_data,
    historical_data: operatorData.historical_data
  });
  
  // 3. Сохраняем результат
  await db.operators.update(operatorId, {
    status: 'pending_verification',
    verification_status: 'in_review',
    risk_score: riskAssessment.risk_score,
    risk_level: riskAssessment.risk_level,
    fraud_signals: riskAssessment.fraud_signals,
    submitted_at: new Date()
  });
  
  // 4. Добавляем в очередь модерации
  await moderationQueue.add({
    operator_id: operatorId,
    priority: getPriorityFromRiskLevel(riskAssessment.risk_level),
    risk_assessment: riskAssessment
  });
  
  // 5. Логируем
  await auditLog.create({
    action: 'submitted_for_review',
    operator_id: operatorId,
    risk_score: riskAssessment.risk_score,
    fraud_signals: riskAssessment.fraud_signals
  });
  
  return riskAssessment;
}
```

---

### 2. При загрузке документов (опционально, в v1.1+)

**Когда:** Оператор загружает новый документ

**Что происходит:**
- Документ анализируется на подлинность
- Проверяется качество изображения
- OCR для извлечения данных и сверки с профилем

**Пример (v1.1+):**

```typescript
async function uploadDocument(operatorId: number, file: File, documentType: string) {
  // 1. Загрузка файла
  const uploadedFile = await s3.upload(file);
  
  // 2. Анализ документа (опционально в v1.1+)
  const documentAnalysis = await riskEngine.analyzeDocument({
    file_url: uploadedFile.url,
    document_type: documentType,
    operator_id: operatorId
  });
  
  // 3. Сохранение
  await db.documents.create({
    operator_id: operatorId,
    document_type: documentType,
    file_url: uploadedFile.url,
    file_size: file.size,
    analysis: documentAnalysis,
    fraud_signals: documentAnalysis.fraud_signals || []
  });
  
  return documentAnalysis;
}
```

---

### 3. При обновлении критических данных (например, изменение ИНН)

**Когда:** Оператор меняет ИНН, ОГРН, или другие критические поля

**Что происходит:**
- Заново вызывается Risk Engine
- Пересчитывается risk score
- Если существенное изменение → статус меняется на `re_verification_required`

---

### 4. Периодическая ре-верификация (в v2.0+)

**Когда:** Раз в 6-12 месяцев для активных операторов

**Что происходит:**
- Проверка актуальности данных
- Проверка в черных списках
- Анализ поведения за период
- При подозрениях → запрос обновленных документов

---

## 7.3. Input-данные для модели: профиль, документы, поведенческие метрики, IP, device fingerprint и т.д.

Risk Engine анализирует множество данных из разных источников для максимально точной оценки.

**Категории входных данных:**

### 1. Профильные данные (Company/Business Info)

```typescript
interface ProfileData {
  // Operator Type
  operator_type: 'legal_entity' | 'individual_entrepreneur' | 'self_employed' | 'individual';
  
  // Для юрлиц/ИП
  company_name?: string;
  inn: string;
  ogrn?: string;
  kpp?: string;
  legal_address: string;
  actual_address?: string;
  registration_date?: Date; // Извлекается из ОГРН
  
  // Банковские данные
  bik: string;
  account_number: string;
  bank_name: string;
  
  // Контактное лицо
  contact_person: {
    full_name: string;
    position: string;
    phone: string;
    email: string;
  };
}
```

**Что анализируется:**
- Возраст компании (из ОГРН или даты регистрации)
- Соответствие данных в профиле и документах
- Массовый адрес регистрации
- Подозрительное название компании
- Банк из "серого списка"

---

### 2. Документы (Documents Data)

```typescript
interface DocumentData {
  documents: Array<{
    document_type: string;
    file_name: string;
    file_size: number;
    file_type: string;
    uploaded_at: Date;
    
    // Метаданные файла
    metadata?: {
      creation_date?: Date;
      modification_date?: Date;
      author?: string;
      software?: string;
    };
    
    // Результаты анализа (v1.1+)
    analysis?: {
      is_edited: boolean;
      quality_score: number; // 0-100
      text_extracted?: string;
      faces_detected?: number;
    };
  }>;
}
```

**Что анализируется:**
- Качество документов (размытость, обрезанность)
- Следы редактирования
- Метаданные файлов (дата создания, программа)
- Соответствие типа документа заявленному типу оператора
- Наличие всех обязательных документов

---

### 3. Поведенческие данные (Behavioral Data)

```typescript
interface BehavioralData {
  // Заполнение формы
  registration_duration: number; // Секунды от начала до отправки
  form_fill_time: number; // Время активного заполнения
  typing_speed: number; // Символов в секунду
  copy_paste_count: number; // Количество полей, заполненных через copy-paste
  corrections_count: number; // Количество исправлений
  field_fill_pattern: string; // Порядок заполнения полей
  
  // Паузы и таймауты
  longest_pause: number; // Самая длинная пауза в секундах
  total_pauses: number; // Количество пауз >30 секунд
  
  // Навигация
  page_views: number; // Количество просмотров страниц
  back_button_clicks: number; // Клики "назад"
  help_views: number; // Просмотры справки/подсказок
  
  // Документы
  documents_upload_time: number; // Время загрузки всех документов
  documents_retries: number; // Количество попыток загрузки
}
```

**Что анализируется:**
- Слишком быстрое заполнение (<30 сек) → возможен бот
- Все поля через copy-paste → подготовленные данные
- Роботизированная скорость ввода → бот
- Нет исправлений/опечаток → подозрительно

---

### 4. Технические данные (Technical Data)

```typescript
interface TechnicalData {
  // IP и геолокация
  ip_address: string;
  ip_country: string;
  ip_city?: string;
  is_vpn: boolean;
  is_proxy: boolean;
  is_tor: boolean;
  ip_risk_score: number; // 0-100 от сервиса проверки IP
  
  // Устройство
  user_agent: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  browser_version: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  
  // Fingerprinting
  device_fingerprint: string; // Уникальный ID устройства
  canvas_fingerprint?: string;
  webgl_fingerprint?: string;
  
  // Технические флаги
  javascript_enabled: boolean;
  cookies_enabled: boolean;
  do_not_track: boolean;
  incognito_mode: boolean; // Определяется эвристически
  headless_browser: boolean; // Автоматизация
}
```

**Что анализируется:**
- VPN/Proxy/Tor → повышенный риск
- Несовпадение IP-страны с заявленной → флаг
- Headless browser → вероятен бот
- Device fingerprint дубликат → множественные аккаунты
- Подозрительный User Agent → автоматизация

---

### 5. Исторические данные (Historical Data)

```typescript
interface HistoricalData {
  // Попытки регистрации
  previous_registrations_from_ip: number;
  previous_registrations_from_device: number;
  previous_registrations_from_email_domain: number;
  
  // Отклоненные заявки
  rejected_operators_with_same_inn: number;
  rejected_operators_from_same_ip: number;
  
  // Черные списки
  email_in_blacklist: boolean;
  phone_in_blacklist: boolean;
  inn_in_blacklist: boolean;
  ip_in_blacklist: boolean;
  
  // Временные паттерны
  registration_hour: number; // 0-23
  registration_day_of_week: number; // 0-6 (0=Воскресенье)
  time_since_last_registration_from_ip: number; // Минуты
}
```

**Что анализируется:**
- Множественные регистрации с одного IP/устройства → фрод
- ИНН/Email в черном списке → автоматический отказ
- Регистрация в нетипичное время (3-5 ночи) → подозрительно
- Множественные попытки с одного IP → бот или фрод-ферма

---

### 6. Внешние проверки (External Checks)

```typescript
interface ExternalChecks {
  // FTA (Federal Tax Authority)
  inn_valid: boolean;
  inn_exists_in_fns: boolean;
  company_status: 'active' | 'liquidated' | 'bankruptcy' | 'unknown';
  company_age_days: number;
  
  // БИК
  bik_valid: boolean;
  bik_exists: boolean;
  bank_name_matches: boolean;
  bank_status: 'active' | 'closed';
  
  // Email
  email_deliverable: boolean;
  email_reputation: 'high' | 'medium' | 'low';
  is_disposable_email: boolean;
  
  // Телефон
  phone_valid: boolean;
  phone_type: 'mobile' | 'fixed-line' | 'voip';
  phone_carrier?: string;
  
  // Адрес
  address_exists: boolean;
  is_mass_address: boolean;
  mass_address_count?: number; // Количество компаний на этом адресе
}
```

**Что анализируется:**
- ИНН не найден в FTA (Federal Tax Authority) → фрод
- Компания ликвидирована → отказ
- Компания <3 месяцев → повышенный риск
- Disposable email → фрод
- VoIP телефон → подозрительно
- Массовый адрес (>100 компаний) → высокий риск

---

## 7.4. Output: risk_score, risk_level, fraud_signals, recommendation

Risk Engine возвращает структурированный результат оценки.

**Структура ответа:**

```typescript
interface RiskAssessmentOutput {
  // Основные метрики
  risk_score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  
  // Обнаруженные сигналы фрода
  fraud_signals: string[]; // ['new_company', 'vpn_detected', ...]
  
  // Рекомендация
  recommendation: 'auto_approve' | 'manual_review' | 'auto_reject';
  confidence: number; // 0-1, уверенность модели
  
  // Детали по категориям
  category_scores: {
    profile: number; // 0-100
    documents: number; // 0-100
    behavior: number; // 0-100
    technical: number; // 0-100
    historical: number; // 0-100
  };
  
  // Объяснение (для администратора)
  explanation: string;
  
  // Метаданные
  model_version: string;
  assessed_at: Date;
  processing_time_ms: number;
}
```

---

### 1. Risk Score (0-100)

**Формула (упрощенная):**

```
Risk Score = Σ(Fraud Signal Weight)

Где:
- Каждый fraud signal имеет вес (0-100)
- Risk Score = min(100, сумма всех весов)
```

**Пример расчета:**

```typescript
const fraudSignals = [
  { signal: 'new_company', weight: 15 },
  { signal: 'vpn_detected', weight: 10 },
  { signal: 'fast_fill', weight: 20 }
];

const riskScore = Math.min(100, fraudSignals.reduce((sum, s) => sum + s.weight, 0));
// riskScore = 45
```

**Интерпретация:**

| Risk Score | Значение |
|------------|----------|
| 0-30 | Low Risk (безопасный оператор) |
| 31-70 | Medium Risk (требуется проверка) |
| 71-100 | High Risk (вероятный фрод) |

---

### 2. Risk Level (categorical)

```typescript
function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore <= 30) return 'low';
  if (riskScore <= 70) return 'medium';
  if (riskScore <= 90) return 'high';
  return 'critical';
}
```

**Использование:**

| Risk Level | Цвет | Description | Действие |
|------------|------|----------|----------|
| `low` | 🟢 Зеленый | Безопасный оператор | Auto-approve (v1.1+) |
| `medium` | 🟡 Желтый | Требуется проверка | Manual review |
| `high` | 🟠 Оранжевый | Подозрительный | Manual review (углубленная) |
| `critical` | 🔴 Красный | Критический риск | Auto-reject (опционально) |

---

### 3. Fraud Signals (массив строк)

Список обнаруженных подозрительных факторов.

**Examples fraud signals:**

```json
{
  "fraud_signals": [
    "new_company",
    "vpn_detected",
    "fast_fill",
    "mass_address",
    "duplicate_device"
  ]
}
```

**Категории сигналов:**

| Категория | Examples сигналов |
|-----------|------------------|
| Юридические | `new_company`, `mass_address`, `liquidated`, `bankruptcy` |
| Поведенческие | `fast_fill`, `bot_behavior`, `no_corrections`, `copy_paste_all` |
| Технические | `vpn_detected`, `tor_detected`, `headless_browser`, `duplicate_device` |
| Контактные | `temp_email`, `voip_phone`, `email_blacklisted`, `phone_blacklisted` |
| Документные | `document_edited`, `low_quality_docs`, `missing_required_docs` |
| Исторические | `multiple_accounts`, `previous_rejection`, `inn_blacklisted` |

**Полный список см. в разделе 4.5.**

---

### 4. Recommendation (действие)

```typescript
type Recommendation = 'auto_approve' | 'manual_review' | 'auto_reject';
```

**Логика определения:**

```typescript
function getRecommendation(riskScore: number, riskLevel: string, fraudSignals: string[]): Recommendation {
  // Критические сигналы → auto-reject
  const criticalSignals = ['liquidated', 'bankruptcy', 'email_blacklisted', 'inn_blacklisted'];
  const hasCriticalSignal = fraudSignals.some(s => criticalSignals.includes(s));
  
  if (hasCriticalSignal || riskLevel === 'critical') {
    return 'auto_reject'; // (опционально, в v1.1+)
  }
  
  // Низкий риск → auto-approve
  if (riskScore < 30 && riskLevel === 'low') {
    return 'auto_approve'; // (в v1.1+)
  }
  
  // Всё остальное → ручная проверка
  return 'manual_review';
}
```

**В MVP:**
- `auto_approve` и `auto_reject` **отключены**
- Все заявки идут на `manual_review`
- Recommendation используется только для информирования администратора

**В v1.1+:**
- `auto_approve` для low-risk (40-50% заявок)
- `manual_review` для medium/high-risk
- `auto_reject` для critical (опционально)

---

### 5. Confidence (уверенность модели)

```typescript
confidence: number; // 0-1
```

**Что это:**
- Насколько модель уверена в своей оценке
- 0.0 = совсем не уверена
- 1.0 = полностью уверена

**Использование:**
- Если confidence < 0.5 → обязательная ручная проверка
- Если confidence > 0.9 → можно доверять рекомендации

---

### 6. Category Scores (баллы по категориям)

```json
{
  "category_scores": {
    "profile": 25,      // Данные профиля
    "documents": 10,    // Документы
    "behavior": 30,     // Поведение
    "technical": 15,    // Технические данные
    "historical": 5     // Исторические данные
  }
}
```

**Помогает администратору понять:**
- Какая категория внесла наибольший вклад в risk score
- На что обратить внимание при проверке

---

### 7. Explanation (объяснение для администратора)

```json
{
  "explanation": "Средний уровень риска. Компания зарегистрирована менее 3 месяцев назад, обнаружено использование VPN, форма заполнена подозрительно быстро (45 секунд). Рекомендуется ручная проверка документов."
}
```

**Генерируется автоматически на основе fraud signals.**

---

### Пример полного ответа:

```json
{
  "risk_score": 45,
  "risk_level": "medium",
  "fraud_signals": [
    "new_company",
    "vpn_detected",
    "fast_fill"
  ],
  "recommendation": "manual_review",
  "confidence": 0.78,
  
  "category_scores": {
    "profile": 15,
    "documents": 5,
    "behavior": 20,
    "technical": 10,
    "historical": 0
  },
  
  "explanation": "Средний уровень риска. Компания зарегистрирована менее 3 месяцев назад (15 баллов), обнаружено использование VPN (10 баллов), форма заполнена подозрительно быстро - 45 секунд (20 баллов). Рекомендуется ручная проверка документов и звонок оператору для подтверждения намерений.",
  
  "model_version": "1.0.2",
  "assessed_at": "2025-12-09T17:30:15Z",
  "processing_time_ms": 234
}
```

---

## 7.5. Как результаты скоринга используются администратором при принятии решения

Risk Engine предоставляет администратору ценную информацию для принятия взвешенного решения.

**Интеграция в админский интерфейс:**

### 1. В списке операторов на модерации

```
┌────────────────────────────────────────────────────────────────┐
│  Операторы under review                    [Фильтры ▼]          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ID   Компания           Risk  Сигналы    Дата подачи  Действия│
│  ─────────────────────────────────────────────────────────────│
│  456  StorageBiz LLC   🟡 45  3 сигнала  09.12 17:30  [→]   │
│       ИНН: 7701234567                                          │
│                                                                │
│  457  ИП Петров А.Б.      🟢 25  0 сигналов 09.12 18:00  [→]   │
│       ИНН: 770123456789                                        │
│                                                                │
│  458  TestCompany LLC  🔴 85  8 сигналов 09.12 18:15  [→]   │
│       ИНН: 7701234000                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Сортировка по приоритету:**
1. Critical (🔴) → сначала
2. High (🟠)
3. Medium (🟡)
4. Low (🟢) → в конце

---

### 2. На странице детального просмотра оператора

```
┌────────────────────────────────────────────────────────────────┐
│  Оператор #456: StorageBiz LLC                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🟡 Risk Score: 45 / 100 (Medium)                              │
│  Рекомендация: Ручная проверка                                 │
│  Уверенность модели: 78%                                       │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ⚠️ Обнаружено 3 фрод-сигнала:                                 │
│                                                                │
│  1. Новая компания (+15 баллов)                                │
│     Компания зарегистрирована 2 месяца назад (ОГРН: 15.10.2025)│
│                                                                │
│  2. VPN обнаружен (+10 баллов)                                 │
│     IP: 185.220.101.45 (NordVPN, Нидерланды)                   │
│     Заявленная страна: Россия                                  │
│                                                                │
│  3. Быстрое заполнение формы (+20 баллов)                      │
│     Форма заполнена за 45 секунд (норма: 5-10 минут)           │
│     Подозрение на автоматизацию или подготовленные данные      │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  Баллы по категориям:                                          │
│  Профиль:    ▓▓▓░░░░░░░ 15/100                                │
│  Документы:  ▓░░░░░░░░░  5/100                                │
│  Поведение:  ▓▓▓▓░░░░░░ 20/100                                │
│  Технические:▓▓░░░░░░░░ 10/100                                │
│  История:    ░░░░░░░░░░  0/100                                │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  💡 Рекомендации:                                              │
│  • Проверить документы на подлинность                          │
│  • Позвонить оператору для подтверждения намерений             │
│  • Уточнить причину использования VPN                          │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  Профиль компании     Документы     История действий           │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Одобрить    │  │  Отклонить   │  │  Запросить   │        │
│  │              │  │              │  │  доп.инфо    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 3. Как администратор использует информацию

**Сценарий 1: Low Risk (🟢 0-30)**

```
Risk Score: 25
Fraud Signals: 0
Recommendation: Auto-approve (v1.1+)
```

**Действие администратора:**
- **Быстрая проверка** (1-2 минуты)
- Просмотр профиля и документов
- Если всё в порядке → **Одобрить**

**В v1.1+:**
- Автоматическое одобрение без участия администратора

---

**Сценарий 2: Medium Risk (🟡 31-70)**

```
Risk Score: 45
Fraud Signals: 3 (new_company, vpn_detected, fast_fill)
Recommendation: Manual review
```

**Действие администратора:**
- **Стандартная проверка** (5-10 минут)
- Тщательная проверка документов
- Проверка данных в UAE Commercial Registry
- **Звонок оператору** для подтверждения
- Уточнение причин использования VPN
- Решение: Одобрить / Запросить доп.инфо / Отклонить

---

**Сценарий 3: High Risk (🟠 71-90)**

```
Risk Score: 82
Fraud Signals: 6 (new_company, mass_address, vpn_detected, bot_behavior, duplicate_device, document_edited)
Recommendation: Manual review (углубленная)
```

**Действие администратора:**
- **Углубленная проверка** (15-30 минут)
- Детальная проверка всех документов
- Проверка адреса на картах
- Проверка устройства (device fingerprint)
- **Обязательный звонок** оператору
- Возможно: запрос дополнительных документов
- Вероятное решение: Отклонить или Запросить доп.инфо

---

**Сценарий 4: Critical Risk (🔴 91-100)**

```
Risk Score: 95
Fraud Signals: 10+ (liquidated, email_blacklisted, document_edited, bot_behavior, ...)
Recommendation: Auto-reject
```

**Действие администратора:**
- **Быстрый отказ** (1-2 минуты)
- Проверка критических сигналов
- Добавление в черный список
- Решение: **Отклонить**

**В v1.1+:**
- Возможно автоматическое отклонение

---

### 4. Статистика для администраторов

**Dashboard для модерации:**

```
┌────────────────────────────────────────────────────────────────┐
│  Статистика модерации                         Сегодня          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Заявок under review: 24                                        │
│                                                                │
│  По уровням риска:                                             │
│  🟢 Low:      8 заявок (33%)                                   │
│  🟡 Medium:  12 заявок (50%)                                   │
│  🟠 High:     3 заявки (13%)                                   │
│  🔴 Critical: 1 заявка  (4%)                                   │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  Обработано сегодня: 45 заявок                                 │
│  • Одобрено:       32 (71%)                                    │
│  • Отклонено:       8 (18%)                                    │
│  • Запрошено инфо:  5 (11%)                                    │
│                                                                │
│  Среднее время обработки: 8 минут                              │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  Топ-3 фрод-сигнала:                                           │
│  1. new_company         (18 заявок)                            │
│  2. vpn_detected        (12 заявок)                            │
│  3. fast_fill           (9 заявок)                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 5. Обучение модели на основе решений администратора

**Feedback Loop:**

```mermaid
graph LR
    A[Оператор подает заявку] --> B[Risk Engine оценивает]
    B --> C[Администратор проверяет]
    C --> D{Решение}
    D -->|Одобрить| E[Одобрено]
    D -->|Отклонить| F[Отклонено]
    D -->|Запросить инфо| G[Доп.инфо]
    
    E --> H[Feedback: True Negative]
    F --> I[Feedback: True Positive]
    
    H --> J[Обучение модели]
    I --> J
    
    J --> K[Улучшенная модель]
    K --> B
```

**Как это работает:**

1. Администратор принимает решение (одобрить/отклонить)
2. Решение сохраняется вместе с risk score и fraud signals
3. Раз в месяц модель переобучается на новых данных
4. Точность модели повышается

**Метрики для оценки модели:**
- **Precision:** Сколько из "high risk" действительно были фродом
- **Recall:** Сколько фродов модель поймала
- **F1-Score:** Общая эффективность
- **False Positive Rate:** Сколько хороших операторов rejected по ошибке

---

# 8. Admin Moderation and Operations

## 8.1. Роль администратора / модератора (RBAC)

Система модерации основана на ролевой модели доступа (RBAC — Role-Based Access Control).

**Роли в системе:**

| Роль | Права | Назначение |
|------|-------|-----------|
| `super_admin` | Полный доступ ко всем функциям | Владелец платформы |
| `admin` | Модерация, настройки, аналитика | Главный администратор |
| `moderator` | Модерация операторов, просмотр | Модератор |
| `viewer` | Только просмотр (read-only) | Наблюдатель, аналитик |
| `operator` | Управление своими складами | Оператор склада |
| `customer` | Поиск и бронирование | Клиент платформы |

---

### Детальные права `moderator` (роль для модерации операторов)

**Может:**
- ✅ Просматривать список операторов на модерации
- ✅ Просматривать детали оператора (профиль, документы)
- ✅ Одобрять заявки операторов
- ✅ Отклонять заявки операторов
- ✅ Запрашивать дополнительную информацию
- ✅ Просматривать Risk Score и fraud signals
- ✅ Скачивать документы операторов
- ✅ Просматривать audit log операторов
- ✅ Добавлять комментарии к заявкам
- ✅ Фильтровать и сортировать заявки

**Не может:**
- ❌ Удалять операторов
- ❌ Изменять настройки платформы
- ❌ Создавать других администраторов
- ❌ Редактировать профиль оператора напрямую
- ❌ Блокировать/разблокировать операторов (suspend/activate)

---

### Права `admin` (расширенные)

**Всё, что может `moderator`, плюс:**
- ✅ Блокировать/разблокировать операторов (suspend/activate)
- ✅ Удалять операторов (мягкое удаление)
- ✅ Редактировать профиль оператора
- ✅ Управлять черным списком (добавлять ИНН, email, IP)
- ✅ Просматривать аналитику и отчеты
- ✅ Настраивать параметры модерации
- ✅ Создавать модераторов

---

### Права `super_admin`

**Полный доступ:**
- ✅ Всё, что может `admin`
- ✅ Управление пользователями (создание, удаление, изменение ролей)
- ✅ Доступ к системным настройкам
- ✅ Управление биллингом
- ✅ Доступ к логам и мониторингу

---

## 8.2. Админский интерфейс: очередь заявок, фильтры (по risk_level, operator_type, date), поиск

Админский интерфейс предоставляет инструменты для эффективной модерации большого количества заявок.

**URL:** `/admin/operators/moderation`

**Главный экран:**

```
┌────────────────────────────────────────────────────────────────┐
│  [Логотип] Dashboard  Операторы  Склады  Пользователи  [Admin]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📋 Модерация операторов                                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Фильтры:                                                │ │
│  │                                                          │ │
│  │  Статус верификации:  [in_review ▼]                     │ │
│  │  Уровень риска:       [Все ▼]                           │ │
│  │  Operator Type:       [Все ▼]                           │ │
│  │  Дата подачи:         [Любая ▼]                         │ │
│  │                                                          │ │
│  │  Поиск: [___________________________]  🔍               │ │
│  │         (название, ИНН, email, телефон)                 │ │
│  │                                                          │ │
│  │  [Применить фильтры]  [Сбросить]                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  На модерации: 24 заявки                                       │
│  Сортировка: [По приоритету ▼]                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ID    Компания          Risk  Тип      Дата    Действия │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 458   TestComp LLC    🔴 85  Юрлицо  09.12   [→]      │ │
│  │       ИНН: 7701234000                 18:15             │ │
│  │       8 фрод-сигналов                                   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 459   ИП Сидоров И.П.   🟠 72  ИП      09.12   [→]      │ │
│  │       ИНН: 770123456789               18:45             │ │
│  │       5 фрод-сигналов                                   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 456   StorageBiz LLC 🟡 45  Юрлицо  09.12   [→]      │ │
│  │       ИНН: 7701234567                 17:30             │ │
│  │       3 фрод-сигнала                                    │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 460   MyStorage LLC    🟡 38  Юрлицо  09.12   [→]      │ │
│  │       ИНН: 7701234568                 19:00             │ │
│  │       2 фрод-сигнала                                    │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 457   ИП Петров А.Б.    🟢 25  ИП      09.12   [→]      │ │
│  │       ИНН: 770123456788               18:00             │ │
│  │       0 фрод-сигналов                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ← 1 2 3 ... 5 →                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Фильтры

**1. Статус верификации:**
- `in_review` (under review)
- `needs_more_info` (запрошена инфо)
- Все остальные статусы

**2. Уровень риска:**
- Все
- 🔴 Critical (91-100)
- 🟠 High (71-90)
- 🟡 Medium (31-70)
- 🟢 Low (0-30)

**3. Operator Type:**
- Все
- Юридическое лицо (`legal_entity`)
- ИП (`individual_entrepreneur`)
- Самозанятый (`self_employed`)
- Физлицо (`individual`)

**4. Дата подачи:**
- Любая
- Сегодня
- Вчера
- Последние 3 дня
- Последняя неделя
- Последний месяц
- Пользовательский диапазон

**5. Сортировка:**
- По приоритету (risk level, затем дата)
- По дате подачи (новые → старые)
- По дате подачи (старые → новые)
- По risk score (высокий → низкий)
- По названию компании (A-Z)

---

### Поиск

**Поисковые поля:**
- Название компании
- ИНН
- ОГРН
- Email
- Телефон
- ID оператора

**Пример:**

```
Поиск: [СкладБизнес]  🔍

Результаты: 1 заявка
┌──────────────────────────────────────────────────────────┐
│ 456   StorageBiz LLC 🟡 45  Юрлицо  09.12   [→]      │
│       ИНН: 7701234567                 17:30             │
└──────────────────────────────────────────────────────────┘
```

---

## 8.3. Workflow модератора: открыть карточку оператора → просмотреть профиль, документы, risk score → решение (approve / reject / request info)

**Типичный workflow модератора:**

### Шаг 1: Выбор заявки из очереди

Модератор открывает очередь модерации и выбирает заявку для проверки.

**Приоритеты:**
1. 🔴 Critical → проверяются первыми
2. 🟠 High
3. 🟡 Medium
4. 🟢 Low → проверяются последними

---

### Шаг 2: Открытие карточки оператора

**URL:** `/admin/operators/{id}/review`

**Экран карточки оператора:**

```
┌────────────────────────────────────────────────────────────────┐
│  ← Назад к списку                                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📋 Проверка оператора #456                                    │
│                                                                │
│  StorageBiz LLC                                             │
│  ИНН: 7701234567                                               │
│  Дата подачи: 09.12.2025, 17:30                                │
│                                                                │
│  🟡 Risk Score: 45 / 100 (Medium)                              │
│  Рекомендация: Ручная проверка                                 │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  [Профиль компании] [Документы] [Risk Assessment] [История]   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Шаг 3: Просмотр вкладки "Профиль компании"

```
┌────────────────────────────────────────────────────────────────┐
│  [Профиль компании] Документы  Risk Assessment  История        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📋 Общая информация                                           │
│                                                                │
│  Название компании:   StorageBiz LLC                        │
│  Operator Type:       Юридическое лицо                         │
│  ИНН:                 7701234567  ✅ Валиден                    │
│  ОГРН:                1027700000000  ✅ Валиден                 │
│  КПП:                 770101001                                │
│  Дата регистрации:    15.10.2025 (54 дня назад) ⚠️             │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  📍 Адреса                                                     │
│                                                                │
│  Юридический адрес:   123456, Dubai, Al Quoz, д. 1     │
│                       [Проверить на карте]                     │
│                                                                │
│  Фактический адрес:   123456, Dubai, ул. Пушкина, д. 2    │
│                       [Проверить на карте]                     │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  💰 Bank Details                                       │
│                                                                │
│  БИК:                 044525225  ✅ Найден в справочнике        │
│  Банк:                ПАО "Сбербанк России"                    │
│  Расчетный счет:      40702810400000001234  ✅ Валиден         │
│  Корр. счет:          30101810400000000225                     │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  👤 Контактное лицо                                            │
│                                                                │
│  ФИО:                 Иванов Иван Иванович                     │
│  Должность:           Генеральный директор                     │
│  Телефон:             +7 (495) 123-45-67  ✅ Валиден           │
│  Email:               ivan@skladbiz.ru  ✅ Валиден             │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  🔍 Внешние проверки                                           │
│                                                                │
│  UAE Commercial Registry:               ✅ Найдена, статус: Действующая          │
│  БИК справочник:      ✅ Банк active                          │
│  Email reputation:    ✅ Высокая                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Модератор проверяет:**
- ✅ Все данные корректны
- ⚠️ Компания новая (54 дня) — это один из fraud signals

---

### Шаг 4: Просмотр вкладки "Документы"

```
┌────────────────────────────────────────────────────────────────┐
│  Профиль компании  [Документы]  Risk Assessment  История       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📄 Загруженные документы                                      │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  1. Выписка из UAE Commercial Registry                             ✅      │ │
│  │                                                          │ │
│  │  Файл: egrul_2025.pdf                                    │ │
│  │  Размер: 2.4 МБ                                          │ │
│  │  Загружен: 09.12.2025, 16:45                             │ │
│  │                                                          │ │
│  │  [Просмотреть] [Скачать]                                 │ │
│  │                                                          │ │
│  │  Качество: ✅ Хорошее (98/100)                            │ │
│  │  Редактирование: ❌ Не обнаружено                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  2. Справка о банковских реквизитах              ✅      │ │
│  │                                                          │ │
│  │  Файл: bank_details.jpg                                  │ │
│  │  Размер: 1.8 МБ                                          │ │
│  │  Загружен: 09.12.2025, 16:50                             │ │
│  │                                                          │ │
│  │  [Просмотреть] [Скачать]                                 │ │
│  │                                                          │ │
│  │  Качество: ✅ Хорошее (95/100)                            │ │
│  │  Редактирование: ❌ Не обнаружено                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ✅ Все обязательные документы загружены                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Модератор проверяет:**
- Документы читаемые
- Нет признаков редактирования
- Данные в документах совпадают с профилем

**Действия:**
- Клик на "Просмотреть" → открывается документ в новой вкладке
- Клик на "Скачать" → скачивание документа

---

### Шаг 5: Просмотр вкладки "Risk Assessment"

```
┌────────────────────────────────────────────────────────────────┐
│  Профиль компании  Документы  [Risk Assessment]  История       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🛡️ Оценка риска                                               │
│                                                                │
│  Risk Score: 🟡 45 / 100 (Medium)                              │
│  Рекомендация: Ручная проверка                                 │
│  Уверенность модели: 78%                                       │
│  Дата оценки: 09.12.2025, 17:30:15                             │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ⚠️ Обнаружено 3 фрод-сигнала:                                 │
│                                                                │
│  1. Новая компания (+15 баллов)                                │
│     Компания зарегистрирована 54 дня назад (15.10.2025)        │
│     Риск: Молодые компании часто используются для фрода        │
│                                                                │
│  2. VPN обнаружен (+10 баллов)                                 │
│     IP: 185.220.101.45 (NordVPN, Нидерланды)                   │
│     Заявленная страна: Россия                                  │
│     Риск: Скрытие реального местоположения                     │
│                                                                │
│  3. Быстрое заполнение формы (+20 баллов)                      │
│     Форма заполнена за 45 секунд (норма: 5-10 минут)           │
│     Подозрение на автоматизацию или подготовленные данные      │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  📊 Баллы по категориям:                                       │
│                                                                │
│  Профиль компании:   ▓▓▓░░░░░░░ 15/100                        │
│  Документы:          ▓░░░░░░░░░  5/100                        │
│  Поведение:          ▓▓▓▓░░░░░░ 20/100                        │
│  Технические данные: ▓▓░░░░░░░░ 10/100                        │
│  История:            ░░░░░░░░░░  0/100                        │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  💡 Рекомендации для модератора:                               │
│                                                                │
│  • Проверить документы на подлинность                          │
│  • Позвонить оператору для подтверждения намерений             │
│  • Уточнить причину использования VPN                          │
│  • Спросить, как быстро удалось подготовить все данные         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Модератор анализирует:**
- Risk score средний (45) — нужна проверка
- 3 сигнала, но не критичные
- Новая компания — это нормально, многие стартапы
- VPN — может быть объяснимо (удаленная работа, безопасность)
- Быстрое заполнение — подозрительно, но возможно у оператора были готовы данные

**Решение модератора:**
- Позвонить оператору для уточнения

---

### Шаг 6: Просмотр вкладки "История"

```
┌────────────────────────────────────────────────────────────────┐
│  Профиль компании  Документы  Risk Assessment  [История]       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📜 История действий (Audit Log)                               │
│                                                                │
│  09.12.2025, 17:30:15                                          │
│  ⚙️  Система: Submitted for review                             │
│  Risk Score: 45, Fraud Signals: 3                              │
│                                                                │
│  09.12.2025, 16:50:00                                          │
│  📄  Оператор: Document uploaded                               │
│  Тип: bank_details, Файл: bank_details.jpg                    │
│                                                                │
│  09.12.2025, 16:45:00                                          │
│  📄  Оператор: Document uploaded                               │
│  Тип: egrul_extract, Файл: egrul_2025.pdf                     │
│                                                                │
│  09.12.2025, 16:30:00                                          │
│  ✏️  Оператор: Profile updated                                 │
│  Поля: company_name, inn, legal_address, bik, account_number  │
│                                                                │
│  09.12.2025, 15:30:00                                          │
│  👤  Система: Operator registered                              │
│  Email: ivan@skladbiz.ru, Type: legal_entity                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Модератор видит:**
- Весь путь оператора от регистрации до отправки
- Нет подозрительной активности
- Все действия последовательны

---

### Шаг 7: Принятие решения

После просмотра всех данных модератор принимает решение.

**Внизу карточки:**

```
┌────────────────────────────────────────────────────────────────┐
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  💬 Комментарий (опционально):                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Позвонил оператору. Подтвердил намерения работать с       │ │
│  │ платформой. VPN использует для безопасности. Документы в  │ │
│  │ порядке. Одобряю.                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  ✅ Одобрить │  │  ❌ Отклонить│  │  ⚠️ Запросить│        │
│  │              │  │              │  │  доп.инфо    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Шаг 7а: Одобрение

**Модератор нажимает "Одобрить"**

**Модальное окно подтверждения:**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│           Одобрить заявку оператора?                           │
│                                                                │
│  Оператор: StorageBiz LLC (ИНН: 7701234567)                │
│                                                                │
│  После одобрения оператор сможет:                              │
│  • Создавать склады и боксы                                    │
│  • Получать заявки от клиентов                                 │
│  • Управлять ценами и бронированиями                           │
│                                                                │
│  Комментарий (опционально):                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Все документы в порядке. Звонил оператору.               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────┐    ┌────────────────────┐            │
│  │ Отмена             │    │ Одобрить           │            │
│  └────────────────────┘    └────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**После подтверждения:**
- Статус оператора: `pending_verification` → `active`
- Verification status: `in_review` → `verified`
- `verified_at = NOW()`
- `verified_by = admin_id`
- Отправка email оператору: "Поздравляем! Ваш аккаунт одобрен"
- Модератор возвращается к списку заявок

---

### Шаг 7б: Отклонение

**Модератор нажимает "Отклонить"**

**Модальное окно:**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│           Отклонить заявку оператора?                          │
│                                                                │
│  Оператор: StorageBiz LLC (ИНН: 7701234567)                │
│                                                                │
│  ⚠️  Отклонение заявки — серьезное решение.                    │
│  Укажите причину отклонения для оператора.                     │
│                                                                │
│  Причина отклонения *:                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Компания с указанным ИНН не найдена в базе UAE Commercial Registry.       │ │
│  │ Проверьте корректность ИНН и повторите попытку.         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ☐ Добавить ИНН в черный список                                │
│  ☐ Добавить Email в черный список                              │
│                                                                │
│  ┌────────────────────┐    ┌────────────────────┐            │
│  │ Отмена             │    │ Отклонить          │            │
│  └────────────────────┘    └────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**После подтверждения:**
- Статус оператора: `pending_verification` → `rejected`
- Verification status: `in_review` → `rejected`
- `rejected_at = NOW()`
- `rejected_by = admin_id`
- `rejection_reason` сохраняется
- Отправка email оператору с причиной отклонения
- Если отмечено — добавление в черный список

---

### Шаг 7в: Запрос дополнительной информации

**Модератор нажимает "Запросить доп.инфо"**

**Модальное окно:**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│           Запросить дополнительную информацию                  │
│                                                                │
│  Оператор: StorageBiz LLC (ИНН: 7701234567)                │
│                                                                │
│  Укажите, какую информацию или документы нужно предоставить:   │
│                                                                │
│  Запрос *:                                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев.      │ │
│  │ Загруженная выписка датирована апрелем 2025 года.       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────┐    ┌────────────────────┐            │
│  │ Отмена             │    │ Отправить запрос   │            │
│  └────────────────────┘    └────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**После подтверждения:**
- Статус оператора: `pending_verification` → `needs_more_info`
- Verification status: `in_review` → `needs_more_info`
- `requested_info` сохраняется
- `requested_at = NOW()`
- `requested_by = admin_id`
- Отправка email оператору с запросом
- Заявка убирается из очереди до предоставления информации

---

## 8.4. Операции: approve, reject, request more info (детали API-вызовов, транзакции статусов, уведомления)

Каждая операция модератора вызывает цепочку действий в системе.

---

### Операция 1: Approve (Одобрение)

**API-вызов:**

```http
POST /api/v1/admin/operators/456/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "comment": "Все документы в порядке. Звонил оператору."
}
```

**Системные действия (транзакция):**

```typescript
async function approveOperator(operatorId: number, adminId: number, comment?: string) {
  // Начинаем транзакцию
  await db.transaction(async (trx) => {
    // 1. Обновляем статус оператора
    await trx.operators.update(operatorId, {
      status: 'active',
      verification_status: 'verified',
      is_verified: true,
      verified_at: new Date(),
      verified_by: adminId
    });
    
    // 2. Создаем запись в audit log
    await trx.audit_log.create({
      action: 'operator_approved',
      actor_type: 'admin',
      actor_id: adminId,
      target_type: 'operator',
      target_id: operatorId,
      timestamp: new Date(),
      details: {
        comment: comment,
        previous_status: 'pending_verification',
        new_status: 'active'
      }
    });
    
    // 3. Удаляем из очереди модерации
    await trx.moderation_queue.deleteWhere({ operator_id: operatorId });
    
    // 4. Активируем разрешения (RBAC)
    await trx.operator_permissions.update(operatorId, {
      can_create_warehouses: true,
      can_receive_bookings: true,
      can_manage_pricing: true
    });
  });
  
  // 5. Отправляем уведомления (вне транзакции)
  await sendApprovalNotification(operatorId);
  
  // 6. Отправляем welcome email с инструкциями
  await sendWelcomeEmail(operatorId);
  
  // 7. Обновляем статистику модератора
  await updateModeratorStats(adminId, 'approved');
  
  return { success: true, operator_id: operatorId };
}
```

**Уведомления:**

1. **Email оператору:**
```
Тема: 🎉 Поздравляем! Ваш аккаунт одобрен

Привет, Иван!

Отличные новости! Ваша заявка одобрена.

Теперь вы можете:
✅ Создавать склады и боксы
✅ Получать заявки от клиентов
✅ Управлять ценами и аналитикой

👉 Перейти в личный кабинет: https://selfstorage.com/operator/dashboard

Следующие шаги:
1. Создайте первый склад
2. Добавьте боксы и настройте цены
3. Начните принимать заявки!

С уважением,
Команда СкладОК
```

2. **Внутреннее уведомление:**
```
🎉 Ваш аккаунт верифицирован!
Теперь вы можете создавать склады и получать заявки.
[Создать первый склад]
```

3. **SMS (опционально):**
```
СкладОК: Ваш аккаунт одобрен! Начните работу: https://selfstorage.com/operator/dashboard
```

---

### Операция 2: Reject (Отклонение)

**API-вызов:**

```http
POST /api/v1/admin/operators/456/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Компания с указанным ИНН не найдена в базе UAE Commercial Registry.",
  "add_to_blacklist": {
    "inn": true,
    "email": false
  }
}
```

**Системные действия:**

```typescript
async function rejectOperator(
  operatorId: number, 
  adminId: number, 
  reason: string,
  addToBlacklist?: { inn?: boolean; email?: boolean; phone?: boolean; ip?: boolean }
) {
  await db.transaction(async (trx) => {
    // 1. Получаем данные оператора
    const operator = await trx.operators.findById(operatorId);
    
    // 2. Обновляем статус
    await trx.operators.update(operatorId, {
      status: 'rejected',
      verification_status: 'rejected',
      is_verified: false,
      rejected_at: new Date(),
      rejected_by: adminId,
      rejection_reason: reason
    });
    
    // 3. Audit log
    await trx.audit_log.create({
      action: 'operator_rejected',
      actor_type: 'admin',
      actor_id: adminId,
      target_type: 'operator',
      target_id: operatorId,
      timestamp: new Date(),
      details: {
        reason: reason,
        previous_status: 'pending_verification'
      }
    });
    
    // 4. Удаляем из очереди
    await trx.moderation_queue.deleteWhere({ operator_id: operatorId });
    
    // 5. Добавляем в черный список (если указано)
    if (addToBlacklist?.inn && operator.inn) {
      await trx.blacklist.create({
        type: 'inn',
        value: operator.inn,
        reason: reason,
        added_by: adminId,
        added_at: new Date()
      });
    }
    
    if (addToBlacklist?.email && operator.email) {
      await trx.blacklist.create({
        type: 'email',
        value: operator.email,
        reason: reason,
        added_by: adminId,
        added_at: new Date()
      });
    }
  });
  
  // 6. Уведомления
  await sendRejectionNotification(operatorId, reason);
  
  // 7. Статистика
  await updateModeratorStats(adminId, 'rejected');
  
  return { success: true };
}
```

**Уведомления:**

**Email оператору:**
```
Тема: Ваша заявка отклонена

Привет, Иван!

К сожалению, мы не можем одобрить вашу заявку.

Причина отклонения:
"Компания с указанным ИНН не найдена в базе UAE Commercial Registry. Проверьте корректность ИНН и повторите попытку."

Дата отклонения: 10.12.2025, 16:00

Что делать дальше:
• Проверьте правильность введенных данных
• Если данные корректны, свяжитесь с поддержкой
• Если ошибка была с вашей стороны, создайте новую заявку

С уважением,
Команда СкладОК
```

---

### Операция 3: Request More Info (Запрос доп. информации)

**API-вызов:**

```http
POST /api/v1/admin/operators/456/request-info
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "requested_info": "Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев."
}
```

**Системные действия:**

```typescript
async function requestMoreInfo(operatorId: number, adminId: number, requestedInfo: string) {
  await db.transaction(async (trx) => {
    // 1. Обновляем статус
    await trx.operators.update(operatorId, {
      status: 'needs_more_info',
      verification_status: 'needs_more_info',
      requested_info: requestedInfo,
      requested_at: new Date(),
      requested_by: adminId
    });
    
    // 2. Audit log
    await trx.audit_log.create({
      action: 'more_info_requested',
      actor_type: 'admin',
      actor_id: adminId,
      target_type: 'operator',
      target_id: operatorId,
      timestamp: new Date(),
      details: {
        requested_info: requestedInfo
      }
    });
    
    // 3. Удаляем из текущей очереди
    await trx.moderation_queue.deleteWhere({ operator_id: operatorId });
    
    // 4. Создаем напоминание (через 3 дня, 7 дней, 30 дней)
    await trx.scheduled_tasks.createMany([
      {
        type: 'reminder_email',
        target_id: operatorId,
        scheduled_at: addDays(new Date(), 3),
        payload: { reminder_type: 'more_info_needed' }
      },
      {
        type: 'reminder_email',
        target_id: operatorId,
        scheduled_at: addDays(new Date(), 7),
        payload: { reminder_type: 'more_info_needed' }
      },
      {
        type: 'auto_reject',
        target_id: operatorId,
        scheduled_at: addDays(new Date(), 30),
        payload: { reason: 'Информация не предоставлена в течение 30 дней' }
      }
    ]);
  });
  
  // 5. Уведомления
  await sendMoreInfoRequestNotification(operatorId, requestedInfo);
  
  // 6. Статистика
  await updateModeratorStats(adminId, 'requested_info');
  
  return { success: true };
}
```

**Уведомления:**

**Email:**
```
Тема: Требуется дополнительная информация

Привет, Иван!

Для завершения проверки нам нужна дополнительная информация.

📝 Запрос от администратора:
"Предоставьте выписку из UAE Commercial Registry не старше 3 месяцев."

👉 Предоставить информацию: https://selfstorage.com/operator/dashboard

Срок предоставления: 7 дней
После 30 дней без ответа заявка будет автоматически отклонена.

С уважением,
Команда СкладОК
```

---

## 8.5. Массовые действия (если применимо в MVP)

**В MVP:** Массовые действия **отключены** для безопасности.

**В v1.1+:** Доступны только для `super_admin`.

**Возможные массовые действия:**

| Действие | Description | Доступно |
|----------|----------|----------|
| Массовое одобрение | Одобрить несколько low-risk заявок | v1.1+ |
| Массовое отклонение | Отклонить несколько заявок с одной причиной | v2.0+ |
| Экспорт списка | Экспорт списка операторов в CSV/Excel | ✅ MVP |
| Массовое добавление в черный список | Добавить несколько ИНН/Email | v1.1+ |

**Пример (v1.1+):**

```
┌────────────────────────────────────────────────────────────────┐
│  Массовые действия                                             │
│                                                                │
│  Выбрано: 5 операторов (все low-risk)                         │
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ Одобрить все     │  │ Отменить выбор   │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 8.6. Analytics и метрики модерации (SLA, среднее время обработки заявки, top fraud signals)

Analytics помогает отслеживать эффективность модерации и выявлять проблемные области.

**Dashboard для администраторов:**

**URL:** `/admin/analytics/moderation`

```
┌────────────────────────────────────────────────────────────────┐
│  [Логотип] Dashboard  Операторы  Analytics  Настройки  [Admin]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📊 Analytics модерации                                        │
│                                                                │
│  Период: [Последние 30 дней ▼]                                 │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  Ключевые метрики                                              │
│                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │  Всего заявок   │  │  В очереди      │  │  Обработано     ││
│  │                 │  │                 │  │                 ││
│  │      450        │  │       24        │  │      426        ││
│  │                 │  │                 │  │                 ││
│  │  ↑ 12% vs пред. │  │  ↓ 5% vs пред.  │  │  ↑ 15% vs пред. ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │  Одобрено       │  │  Отклонено      │  │  Запрошена инфо ││
│  │                 │  │                 │  │                 ││
│  │      320        │  │       76        │  │       30        ││
│  │    (75%)        │  │    (18%)        │  │     (7%)        ││
│  │                 │  │                 │  │                 ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  ⏱ SLA и время обработки                                       │
│                                                                │
│  Целевой SLA: 24-48 часов                                      │
│  Фактический: 32 часа (средний)                                │
│  ✅ SLA соблюден: 89% заявок                                   │
│                                                                │
│  Среднее время обработки: 8 минут                              │
│  • Low risk:     3 минуты                                      │
│  • Medium risk:  8 минут                                       │
│  • High risk:   18 минут                                       │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  📈 Динамика заявок (последние 30 дней)                        │
│                                                                │
│  [График: линейный график с тремя линиями]                    │
│  • Подано заявок (синяя)                                       │
│  • Одобрено (зеленая)                                          │
│  • Отклонено (красная)                                         │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  🎯 Распределение по уровням риска                             │
│                                                                │
│  🟢 Low:      160 заявок (36%)  ████████                       │
│  🟡 Medium:   220 заявок (49%)  ██████████                     │
│  🟠 High:      60 заявок (13%)  ███                            │
│  🔴 Critical:  10 заявок  (2%)  █                              │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  ⚠️ Top-10 фрод-сигналов                                       │
│                                                                │
│  1. new_company            180 заявок (40%)                    │
│  2. vpn_detected           120 заявок (27%)                    │
│  3. fast_fill               90 заявок (20%)                    │
│  4. mass_address            45 заявок (10%)                    │
│  5. duplicate_device        30 заявок  (7%)                    │
│  6. temp_email              25 заявок  (6%)                    │
│  7. document_edited         20 заявок  (4%)                    │
│  8. bot_behavior            15 заявок  (3%)                    │
│  9. blacklisted_ip          10 заявок  (2%)                    │
│  10. liquidated              5 заявок  (1%)                    │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  👥 Производительность модераторов                             │
│                                                                │
│  Модератор          Обработано  Одобрено  Отклонено  Ср.время │
│  ─────────────────────────────────────────────────────────────│
│  Алексей Петров         150        120        25       7 мин  │
│  Мария Иванова          140        100        30       9 мин  │
│  Дмитрий Сидоров        136         95        36      10 мин  │
│                                                                │
│  ═══════════════════════════════════════════════════════════  │
│                                                                │
│  📊 Конверсия онбординга                                       │
│                                                                │
│  Регистраций:     500  (100%)                                  │
│  ↓ Заполнили профиль: 470  (94%)  ████████████████████        │
│  ↓ Загрузили доки:    450  (90%)  ██████████████████          │
│  ↓ Отправили заявку:  450 (100%)  ████████████████████        │
│  ↓ Одобрены:          320  (71%)  ██████████████              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Ключевые метрики

**1. SLA (Service Level Agreement)**

- **Целевой SLA:** 24-48 часов от подачи заявки до решения
- **Метрика:** % заявок, обработанных в пределах SLA

```typescript
interface SLAMetrics {
  target_sla_hours: number; // 48
  average_processing_hours: number; // 32
  sla_compliance_percentage: number; // 89%
  
  breakdown: {
    within_24h: number; // 45%
    within_48h: number; // 44%
    over_48h: number; // 11%
  };
}
```

**2. Среднее время обработки**

```typescript
interface ProcessingTime {
  overall_average_minutes: number; // 8
  
  by_risk_level: {
    low: number; // 3 minutes
    medium: number; // 8 minutes
    high: number; // 18 minutes
    critical: number; // 25 minutes
  };
  
  by_moderator: Array<{
    moderator_id: number;
    moderator_name: string;
    average_time_minutes: number;
  }>;
}
```

**3. Approval Rate (Процент одобрения)**

```
Approval Rate = (Одобрено / Всего обработано) × 100%
              = (320 / 426) × 100%
              = 75%
```

**Интерпретация:**
- **> 80%:** Возможно, слишком мягкая модерация
- **60-80%:** Нормальный уровень
- **< 60%:** Возможно, слишком строгая модерация или много фрода

**4. Rejection Rate (Процент отклонения)**

```
Rejection Rate = 18%
```

**5. Conversion Rate (Конверсия онбординга)**

```
Конверсия = (Одобрено / Зарегистрировано) × 100%
          = (320 / 500) × 100%
          = 64%
```

---

### Отчеты для экспорта

**CSV Export:**

```csv
operator_id,company_name,inn,operator_type,risk_score,risk_level,submitted_at,verified_at,status,moderator
456,ООО СкладБизнес,7701234567,legal_entity,45,medium,2025-12-09 17:30,2025-12-10 10:00,active,Алексей Петров
457,ИП Петров,770123456789,individual_entrepreneur,25,low,2025-12-09 18:00,2025-12-10 09:00,active,Мария Иванова
```

**Excel Export:**

- Дополнительно включает графики и сводные таблицы
- Pivot tables по типам операторов, уровням риска
- Динамика по датам

---

## 8.7. Notificatons для администраторов (новая заявка в очереди, критический риск)

Администраторы получают уведомления о важных событиях.

**Каналы уведомлений для администраторов:**
- Email
- Внутренние уведомления (в админке)
- Telegram Bot (опционально, v1.1+)
- Slack (опционально, v1.1+)

---

### 1. Новая заявка в очереди

**Условия:**
- Новая заявка отправлена на модерацию
- Risk level: Medium или выше

**Email администраторам:**

```
Тема: [СкладОК] Новая заявка на модерацию

Новая заявка от оператора поступила в очередь модерации.

Оператор: StorageBiz LLC
ИНН: 7701234567
Risk Score: 45 (Medium)
Fraud Signals: 3

👉 Просмотреть: https://selfstorage.com/admin/operators/456/review

---
В очереди: 24 заявки
```

**Внутреннее уведомление:**

```
🔔 Новая заявка на модерацию
StorageBiz LLC (Risk: 🟡 45)
[Просмотреть]
```

---

### 2. Критический уровень риска (🔴 Critical)

**Условия:**
- Risk Score > 90
- Критические fraud signals (liquidated, blacklisted, etc.)

**Email (срочно):**

```
Тема: [СРОЧНО] Критический риск: Новая заявка

⚠️ ВНИМАНИЕ! Обнаружена заявка с критическим уровнем риска.

Оператор: TestCompany LLC
ИНН: 7701234000
Risk Score: 95 (Critical)
Fraud Signals: 10+

Критические сигналы:
• ИНН в черном списке
• Следы редактирования документов
• Поведение бота

👉 СРОЧНО просмотреть: https://selfstorage.com/admin/operators/458/review

Рекомендация: Отклонить
```

**Telegram (v1.1+):**

```
🚨 Критический риск!
TestCompany LLC
Risk: 🔴 95
Fraud Signals: 10+
👉 Просмотреть
```

---

### 3. SLA нарушен

**Условия:**
- Заявка в очереди более 48 часов

**Email:**

```
Тема: [СкладОК] SLA нарушен: Заявка в очереди >48ч

Заявка находится в очереди более 48 часов.

Оператор: MyStorage LLC
Дата подачи: 07.12.2025, 10:00
Время в очереди: 52 часа

👉 Обработать: https://selfstorage.com/admin/operators/460/review
```

---

### 4. Очередь переполнена

**Условия:**
- В очереди > 50 заявок

**Email:**

```
Тема: [СкладОК] Очередь модерации переполнена

В очереди модерации накопилось 57 заявок.
Рекомендуется увеличить частоту проверок.

Распределение:
• Critical: 5
• High: 12
• Medium: 30
• Low: 10

👉 Перейти к модерации: https://selfstorage.com/admin/operators/moderation
```

---

### Настройки уведомлений для администраторов

```
┌────────────────────────────────────────────────────────────────┐
│  Настройки уведомлений                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📧 Email-уведомления                                          │
│  ☑ Новая заявка (medium+ risk)                                 │
│  ☑ Критический риск                                            │
│  ☑ SLA нарушен                                                 │
│  ☑ Очередь переполнена                                         │
│  ☐ Ежедневный отчет                                            │
│                                                                │
│  🔔 Внутренние уведомления                                     │
│  ☑ Показывать все уведомления                                  │
│                                                                │
│  Частота проверки:                                             │
│  ⚪ Мгновенно (real-time)                                       │
│  ⚫ Каждые 5 минут                                              │
│  ⚪ Каждый час                                                  │
│                                                                │
│  ┌────────────────────────────────┐                            │
│  │ Сохранить                     │                            │
│  └────────────────────────────────┘                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

**Конец Файла 4 (Разделы 7-8 полностью)**
# Operator Onboarding & Verification Specification (MVP v1)

**Document Version:** 1.0  
**Date:** December 9, 2025  
**Project:** Self-Storage Aggregator MVP  
**Status:** Draft

---

## Файл 5 (ФИНАЛЬНЫЙ): Разделы 9-11

---

# 9. RBAC and Operator Access Control после верификации

## 9.1. Роли внутри оператора: owner, manager, staff (если есть командная работа)

После верификации оператор получает возможность приглашать членов команды для совместной работы.

**Иерархия ролей:**

```
operator_owner (Владелец)
    ↓
operator_manager (Менеджер)
    ↓
operator_staff (Сотрудник)
```

---

### Роль: `operator_owner` (Владелец)

**Кто получает:**
- Пользователь, который зарегистрировал оператора
- Автоматически при регистрации

**Права (полный доступ):**

| Категория | Права |
|-----------|-------|
| **Профиль компании** | ✅ Просмотр<br>✅ Редактирование<br>✅ Удаление оператора |
| **Склады** | ✅ Создание<br>✅ Редактирование<br>✅ Удаление<br>✅ Публикация/снятие с публикации |
| **Боксы** | ✅ Создание<br>✅ Редактирование<br>✅ Удаление<br>✅ Управление статусами |
| **Цены** | ✅ Установка<br>✅ Изменение<br>✅ Управление скидками |
| **Заявки/Бронирования** | ✅ Просмотр<br>✅ Принятие/отклонение<br>✅ Управление статусами |
| **Финансы** | ✅ Просмотр выплат<br>✅ Просмотр транзакций<br>✅ Просмотр отчетов |
| **Команда** | ✅ Приглашение пользователей<br>✅ Изменение ролей<br>✅ Удаление пользователей |
| **Настройки** | ✅ Все настройки оператора |

**Ограничения:**
- Только один owner на оператора
- Не может быть удален (передача прав другому пользователю)

---

### Роль: `operator_manager` (Менеджер)

**Кто получает:**
- Приглашается owner'ом
- Для управления складами и заявками

**Права (расширенные, но без критических операций):**

| Категория | Права |
|-----------|-------|
| **Профиль компании** | ✅ Просмотр<br>❌ Редактирование<br>❌ Удаление |
| **Склады** | ✅ Создание<br>✅ Редактирование<br>⚠️ Удаление (только свои)<br>✅ Публикация/снятие |
| **Боксы** | ✅ Создание<br>✅ Редактирование<br>✅ Удаление<br>✅ Управление статусами |
| **Цены** | ✅ Установка<br>✅ Изменение<br>⚠️ Скидки (до 20%) |
| **Заявки/Бронирования** | ✅ Просмотр<br>✅ Принятие/отклонение<br>✅ Управление |
| **Финансы** | ✅ Просмотр выплат<br>✅ Просмотр транзакций<br>❌ Экспорт отчетов |
| **Команда** | ✅ Просмотр команды<br>❌ Приглашение<br>❌ Изменение ролей |
| **Настройки** | ⚠️ Только уведомления |

**Типичный use case:**
- Управляющий складом, который работает с заявками и управляет боксами

---

### Роль: `operator_staff` (Сотрудник)

**Кто получает:**
- Приглашается owner'ом или manager'ом
- Для обработки заявок

**Права (базовые):**

| Категория | Права |
|-----------|-------|
| **Профиль компании** | ✅ Просмотр<br>❌ Редактирование |
| **Склады** | ✅ Просмотр<br>❌ Создание/Редактирование |
| **Боксы** | ✅ Просмотр<br>❌ Редактирование |
| **Цены** | ✅ Просмотр<br>❌ Изменение |
| **Заявки/Бронирования** | ✅ Просмотр<br>✅ Принятие/отклонение<br>✅ Request Processing |
| **Финансы** | ❌ Нет доступа |
| **Команда** | ✅ Просмотр<br>❌ Управление |
| **Настройки** | ❌ Нет доступа |

**Типичный use case:**
- Оператор call-центра, который принимает и обрабатывает заявки

---

### Таблица сравнения ролей

| Функция | Owner | Manager | Staff |
|---------|-------|---------|-------|
| Просмотр профиля | ✅ | ✅ | ✅ |
| Редактирование профиля | ✅ | ❌ | ❌ |
| Создание складов | ✅ | ✅ | ❌ |
| Редактирование складов | ✅ | ✅ | ❌ |
| Удаление складов | ✅ | ⚠️ Свои | ❌ |
| Box Management | ✅ | ✅ | ❌ |
| Установка цен | ✅ | ✅ | ❌ |
| Просмотр заявок | ✅ | ✅ | ✅ |
| Request Processing | ✅ | ✅ | ✅ |
| Просмотр финансов | ✅ | ✅ | ❌ |
| Управление командой | ✅ | ❌ | ❌ |
| Изменение настроек | ✅ | ⚠️ Частично | ❌ |
| Удаление оператора | ✅ | ❌ | ❌ |

---

## 9.2. Permissions по ключевым операциям (create_warehouse, manage_bookings и т.д.)

Права доступа реализованы на уровне конкретных операций (permissions).

**Структура разрешений:**

```typescript
interface OperatorPermissions {
  // Профиль компании
  'operator:view': boolean;
  'operator:edit': boolean;
  'operator:delete': boolean;
  
  // Склады
  'warehouse:create': boolean;
  'warehouse:view': boolean;
  'warehouse:edit': boolean;
  'warehouse:delete': boolean;
  'warehouse:publish': boolean;
  
  // Боксы
  'box:create': boolean;
  'box:view': boolean;
  'box:edit': boolean;
  'box:delete': boolean;
  'box:update_status': boolean;
  
  // Цены
  'pricing:view': boolean;
  'pricing:set': boolean;
  'pricing:edit': boolean;
  'pricing:set_discount': boolean;
  
  // Заявки и бронирования
  'booking:view': boolean;
  'booking:accept': boolean;
  'booking:reject': boolean;
  'booking:cancel': boolean;
  'booking:complete': boolean;
  
  // Финансы
  'finance:view_payouts': boolean;
  'finance:view_transactions': boolean;
  'finance:export': boolean;
  
  // Команда
  'team:view': boolean;
  'team:invite': boolean;
  'team:edit_roles': boolean;
  'team:remove': boolean;
  
  // Настройки
  'settings:view': boolean;
  'settings:edit': boolean;
  
  // Analytics
  'analytics:view': boolean;
}
```

---

### Матрица разрешений по ролям

| Permission | Owner | Manager | Staff |
|------------|-------|---------|-------|
| `operator:view` | ✅ | ✅ | ✅ |
| `operator:edit` | ✅ | ❌ | ❌ |
| `operator:delete` | ✅ | ❌ | ❌ |
| `warehouse:create` | ✅ | ✅ | ❌ |
| `warehouse:view` | ✅ | ✅ | ✅ |
| `warehouse:edit` | ✅ | ✅ | ❌ |
| `warehouse:delete` | ✅ | ⚠️ | ❌ |
| `warehouse:publish` | ✅ | ✅ | ❌ |
| `box:create` | ✅ | ✅ | ❌ |
| `box:view` | ✅ | ✅ | ✅ |
| `box:edit` | ✅ | ✅ | ❌ |
| `box:delete` | ✅ | ✅ | ❌ |
| `pricing:view` | ✅ | ✅ | ✅ |
| `pricing:set` | ✅ | ✅ | ❌ |
| `pricing:edit` | ✅ | ✅ | ❌ |
| `booking:view` | ✅ | ✅ | ✅ |
| `booking:accept` | ✅ | ✅ | ✅ |
| `booking:reject` | ✅ | ✅ | ✅ |
| `finance:view_payouts` | ✅ | ✅ | ❌ |
| `finance:view_transactions` | ✅ | ✅ | ❌ |
| `finance:export` | ✅ | ❌ | ❌ |
| `team:view` | ✅ | ✅ | ✅ |
| `team:invite` | ✅ | ❌ | ❌ |
| `team:edit_roles` | ✅ | ❌ | ❌ |
| `team:remove` | ✅ | ❌ | ❌ |
| `settings:view` | ✅ | ⚠️ | ❌ |
| `settings:edit` | ✅ | ⚠️ | ❌ |
| `analytics:view` | ✅ | ✅ | ❌ |

---

### Проверка разрешений в коде (Backend)

```typescript
// Middleware для проверки разрешений
async function checkPermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const operatorId = req.params.operatorId || req.body.operator_id;
    
    // Получаем роль пользователя в этом операторе
    const operatorUser = await db.operator_users.findOne({
      where: { user_id: userId, operator_id: operatorId }
    });
    
    if (!operatorUser) {
      return res.status(403).json({
        success: false,
        error: { code: 'forbidden', message: 'У вас нет доступа к этому оператору' }
      });
    }
    
    // Получаем разрешения для роли
    const permissions = getPermissionsForRole(operatorUser.role);
    
    if (!permissions[permission]) {
      return res.status(403).json({
        success: false,
        error: { 
          code: 'insufficient_permissions', 
          message: `Требуется разрешение: ${permission}` 
        }
      });
    }
    
    next();
  };
}

// Использование в роутах
router.post('/warehouses', 
  authenticate,
  checkPermission('warehouse:create'),
  createWarehouse
);

router.delete('/warehouses/:id', 
  authenticate,
  checkPermission('warehouse:delete'),
  deleteWarehouse
);
```

---

### Проверка разрешений на Frontend

```typescript
// React Hook для проверки разрешений
function usePermission(permission: string): boolean {
  const { operator, currentUser } = useOperatorContext();
  
  // Находим роль текущего пользователя в операторе
  const operatorUser = operator.users.find(u => u.user_id === currentUser.id);
  
  if (!operatorUser) return false;
  
  const permissions = getPermissionsForRole(operatorUser.role);
  return permissions[permission] || false;
}

// Использование в компонентах
function WarehouseActions() {
  const canEdit = usePermission('warehouse:edit');
  const canDelete = usePermission('warehouse:delete');
  
  return (
    <div>
      {canEdit && <button onClick={handleEdit}>Редактировать</button>}
      {canDelete && <button onClick={handleDelete}>Удалить</button>}
    </div>
  );
}
```

---

## 9.3. Как меняется доступ при смене статуса (active → suspended → active)

Статус оператора влияет на доступные функции.

**Статусы и их влияние на доступ:**

### 1. Status: `draft` (Черновик)

**Доступ:**
- ✅ Редактирование профиля
- ✅ Document Upload
- ❌ Создание складов
- ❌ Получение заявок
- ❌ Просмотр финансов

**UI:**
```
⚠️ Завершите верификацию для полного доступа
```

---

### 2. Status: `pending_verification` (На проверке)

**Доступ:**
- ✅ Просмотр статуса
- ❌ Редактирование профиля (blockedо)
- ❌ Все остальные функции недоступны

**UI:**
```
🔍 Ваша заявка на рассмотрении
Ожидайте завершения проверки (24-48 часов)
```

---

### 3. Status: `needs_more_info` (Требуется доп. информация)

**Доступ:**
- ✅ Просмотр запроса
- ✅ Загрузка дополнительных документов
- ✅ Редактирование указанных полей
- ❌ Остальные функции недоступны

**UI:**
```
⚠️ Требуется дополнительная информация
[Посмотреть запрос]
```

---

### 4. Status: `active` (Активен, верифицирован) ✅

**Доступ:**
- ✅ ВСЕ функции доступны согласно роли
- Создание складов
- Box Management
- Получение заявок
- Просмотр финансов
- Приглашение команды

**UI:**
```
✅ Аккаунт верифицирован
```

---

### 5. Status: `suspended` (Приостановлен)

**Причины приостановки:**
- Жалобы клиентов
- Нарушение правил платформы
- Подозрение в мошенничестве
- Технические проблемы

**Доступ:**
- ✅ Просмотр профиля (read-only)
- ✅ Просмотр складов (read-only)
- ✅ Просмотр заявок (read-only)
- ❌ Создание/редактирование чего-либо
- ❌ Получение новых заявок
- ❌ Просмотр финансов

**Дополнительно:**
- Все склады автоматически скрыты от клиентов
- Новые заявки не поступают
- Активные бронирования продолжают работать (клиенты защищены)

**UI:**
```
🚫 Ваш аккаунт приостановлен
Причина: [текст причины от администратора]
Свяжитесь с поддержкой: support@selfstorage.com
```

---

### 6. Status: `rejected` (Отклонен)

**Доступ:**
- ✅ Просмотр причины отклонения
- ✅ Создание новой заявки (если причина устранима)
- ❌ Все остальные функции

**UI:**
```
❌ Ваша заявка отклонена
Причина: [текст]
[Создать новую заявку]
```

---

### 7. Status: `deactivated` (Деактивирован)

**Причины:**
- Оператор сам закрыл аккаунт
- Администратор закрыл аккаунт

**Доступ:**
- ❌ Полная блокировка доступа
- Данные сохранены для compliance (180 дней)

**UI:**
```
🚫 Аккаунт закрыт
Для восстановления свяжитесь с поддержкой
```

---

### Таблица доступа по статусам

| Функция | draft | pending | needs_info | active | suspended | rejected | deactivated |
|---------|-------|---------|------------|--------|-----------|----------|-------------|
| Редактирование профиля | ✅ | ❌ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| Document Upload | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Создание складов | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Просмотр складов | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Получение заявок | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Request Processing | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Просмотр финансов | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Приглашение команды | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

### Переходы между статусами и изменение доступа

**Пример 1: active → suspended**

```typescript
async function suspendOperator(operatorId: number, reason: string) {
  await db.transaction(async (trx) => {
    // 1. Изменить статус
    await trx.operators.update(operatorId, {
      status: 'suspended',
      suspended_at: new Date(),
      suspension_reason: reason
    });
    
    // 2. Скрыть все склады
    await trx.warehouses.update(
      { operator_id: operatorId },
      { is_visible: false, suspension_hidden: true }
    );
    
    // 3. Остановить получение новых заявок
    await trx.operators.update(operatorId, {
      accepting_bookings: false
    });
    
    // 4. Уведомить оператора
    await sendSuspensionNotification(operatorId, reason);
  });
}
```

**Пример 2: suspended → active (восстановление)**

```typescript
async function reactivateOperator(operatorId: number) {
  await db.transaction(async (trx) => {
    // 1. Изменить статус
    await trx.operators.update(operatorId, {
      status: 'active',
      suspended_at: null,
      suspension_reason: null
    });
    
    // 2. Восстановить видимость складов
    await trx.warehouses.update(
      { operator_id: operatorId, suspension_hidden: true },
      { is_visible: true, suspension_hidden: false }
    );
    
    // 3. Восстановить получение заявок
    await trx.operators.update(operatorId, {
      accepting_bookings: true
    });
    
    // 4. Уведомить оператора
    await sendReactivationNotification(operatorId);
  });
}
```

---

# 10. Security and Data Privacy оператора

## 10.1. Хранение документов (encryption at rest / in transit, S3-storage)

Документы операторов содержат конфиденциальную информацию и требуют особой защиты.

**Архитектура хранения документов:**

```
Оператор → HTTPS → API Server → S3-Compatible Storage (Encrypted)
                                         ↓
                                   AES-256 Encryption
                                         ↓
                                   Bucket: operator-documents/
                                         ├── {operator_id}/
                                         │   ├── egrul_extract_abc123.pdf
                                         │   ├── bank_details_def456.jpg
                                         │   └── passport_ghi789.pdf
```

---

### 1. Encryption in Transit (Шифрование при передаче)

**HTTPS/TLS 1.3:**
- Все API-запросы через HTTPS
- TLS 1.3 для максимальной безопасности
- Certificate pinning для мобильных приложений (v1.1+)

**Загрузка файла:**

```typescript
// Client → Server: HTTPS POST
POST https://api.selfstorage.com/api/v1/operators/me/documents
Content-Type: multipart/form-data
Authorization: Bearer <token>

[encrypted binary data via HTTPS]
```

---

### 2. Encryption at Rest (Шифрование в хранилище)

**S3 Server-Side Encryption (SSE-S3):**
- AES-256 шифрование
- Ключи управляются автоматически S3-провайдером
- Альтернатива: SSE-KMS (AWS Key Management Service)

**Конфигурация S3:**

```typescript
const s3Config = {
  bucket: 'operator-documents',
  region: 'me-south-1-1',
  encryption: 'AES256',
  acl: 'private', // Только авторизованные пользователи
  versioning: true, // Версионирование файлов
  lifecycle: {
    // Удаление старых версий через 90 дней
    expiration_days: 90
  }
};
```

---

### 3. Структура хранения

**Path pattern:**
```
s3://operator-documents/
  ├── {operator_id}/
  │   ├── egrul_extract/
  │   │   └── {uuid}_{timestamp}.pdf
  │   ├── bank_details/
  │   │   └── {uuid}_{timestamp}.jpg
  │   ├── passport/
  │   │   └── {uuid}_{timestamp}.png
  │   └── other/
  │       └── {uuid}_{timestamp}.pdf
```

**Пример:**
```
s3://operator-documents/456/egrul_extract/a1b2c3d4-e5f6-7890-abcd-1234567890ab_1702134000.pdf
```

---

### 4. Контроль доступа (Access Control)

**IAM Policy (S3):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::operator-documents/${operator_id}/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    }
  ]
}
```

**Доступ к файлам:**

1. **Загрузка (Upload):**
   - Только владелец оператора может загружать документы
   - JWT token проверяется на сервере
   - Генерируется pre-signed URL для загрузки

2. **Скачивание (Download):**
   - Оператор: может скачивать свои документы
   - Администратор: может скачивать документы для модерации
   - Генерируется временный pre-signed URL (срок действия: 5 минут)

---

### 5. Pre-signed URLs

**Генерация URL для загрузки:**

```typescript
async function generateUploadUrl(operatorId: number, documentType: string): Promise<string> {
  const fileName = `${uuid()}_${Date.now()}.pdf`;
  const key = `${operatorId}/${documentType}/${fileName}`;
  
  const params = {
    Bucket: 'operator-documents',
    Key: key,
    Expires: 300, // 5 минут
    ContentType: 'application/pdf',
    ServerSideEncryption: 'AES256'
  };
  
  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  
  return uploadUrl;
}
```

**Использование на клиенте:**

```typescript
// 1. Запросить pre-signed URL у API
const response = await fetch('/api/v1/operators/me/documents/upload-url', {
  method: 'POST',
  body: JSON.stringify({ document_type: 'egrul_extract' })
});

const { upload_url, file_key } = await response.json();

// 2. Загрузить файл напрямую в S3
await fetch(upload_url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'application/pdf' }
});

// 3. Уведомить API о завершении загрузки
await fetch('/api/v1/operators/me/documents', {
  method: 'POST',
  body: JSON.stringify({ file_key, document_type: 'egrul_extract' })
});
```

---

### 6. Аудит доступа к документам

**Логирование всех операций:**

```typescript
interface DocumentAccessLog {
  id: number;
  operator_id: number;
  document_id: number;
  action: 'uploaded' | 'viewed' | 'downloaded' | 'deleted';
  accessed_by_user_id: number;
  accessed_by_role: 'operator' | 'admin';
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}
```

**Пример лога:**

```json
{
  "id": 12345,
  "operator_id": 456,
  "document_id": 1,
  "action": "downloaded",
  "accessed_by_user_id": 789,
  "accessed_by_role": "admin",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2025-12-10T10:00:00Z"
}
```

---

## 10.2. PII (Personally Identifiable Information): защита ИНН, паспортных данных, банковских реквизитов

PII данные требуют особой защиты согласно GDPR и 152-ФЗ.

**PII данные оператора:**

| Категория | Данные | Уровень конфиденциальности |
|-----------|--------|----------------------------|
| **Личные** | ФИО, паспортные данные | 🔴 Высокий |
| **Финансовые** | Bank Details | 🔴 Высокий |
| **Идентификаторы** | ИНН, ОГРН | 🟡 Средний |
| **Контактные** | Email, телефон | 🟢 Низкий |
| **Юридические** | Адреса | 🟢 Низкий |

---

### 1. Encryption at Database Level

**Шифрование чувствительных полей:**

```sql
CREATE TABLE operators (
  id SERIAL PRIMARY KEY,
  -- Незашифрованные (для поиска)
  company_name VARCHAR(255),
  inn VARCHAR(12) NOT NULL,
  ogrn VARCHAR(15),
  
  -- Зашифрованные поля
  bank_account_encrypted BYTEA, -- AES-256-GCM
  contact_person_name_encrypted BYTEA,
  
  -- Хэшированные для проверки уникальности
  inn_hash VARCHAR(64) UNIQUE,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Шифрование в приложении (Application-Level Encryption):**

```typescript
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Формат: iv:authTag:encrypted
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Использование
const bankAccount = '40702810400000001234';
const encrypted = encrypt(bankAccount);
// Сохранить encrypted в БД

// При получении
const decrypted = decrypt(encrypted);
// decrypted = '40702810400000001234'
```

---

### 2. Data Masking (Маскирование данных)

**В API ответах:**

```typescript
// Полные данные (только для owner/admin)
{
  "bank_account": "40702810400000001234"
}

// Маскированные данные (для staff/логов)
{
  "bank_account": "407028***********234"
}
```

**Функция маскирования:**

```typescript
function maskBankAccount(account: string): string {
  if (account.length < 8) return '***';
  const start = account.substring(0, 6);
  const end = account.substring(account.length - 3);
  const masked = '*'.repeat(account.length - 9);
  return start + masked + end;
}

function maskINN(inn: string): string {
  if (inn.length === 10) {
    return inn.substring(0, 4) + '****' + inn.substring(8);
  } else if (inn.length === 12) {
    return inn.substring(0, 6) + '****' + inn.substring(10);
  }
  return '***';
}
```

---

### 3. Access Control (Контроль доступа к PII)

**Матрица доступа к PII:**

| Данные | Operator Owner | Operator Manager | Operator Staff | Admin | Super Admin |
|--------|----------------|------------------|----------------|-------|-------------|
| ИНН (полный) | ✅ | ✅ | ⚠️ Маскирован | ✅ | ✅ |
| ОГРН | ✅ | ✅ | ⚠️ Маскирован | ✅ | ✅ |
| Банк. реквизиты | ✅ | ❌ | ❌ | ✅ | ✅ |
| Паспортные данные | ✅ | ❌ | ❌ | ✅ | ✅ |
| Email | ✅ | ✅ | ✅ | ✅ | ✅ |
| Телефон | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 4. Logging и PII

**Правило: НИКОГДА не логировать PII в plain text**

❌ **Плохо:**
```typescript
logger.info(`User ${userId} updated bank account to 40702810400000001234`);
```

✅ **Хорошо:**
```typescript
logger.info(`User ${userId} updated bank account`, {
  user_id: userId,
  field: 'bank_account',
  // PII не логируется
});
```

---

### 5. Удаление PII (Right to be Forgotten)

**GDPR Article 17:**
- Пользователь может запросить удаление своих данных

**Процесс удаления оператора:**

```typescript
async function deleteOperator(operatorId: number, reason: 'user_request' | 'admin_action') {
  await db.transaction(async (trx) => {
    // 1. Анонимизировать PII
    await trx.operators.update(operatorId, {
      company_name: `[DELETED_${operatorId}]`,
      inn: null,
      ogrn: null,
      bank_account_encrypted: null,
      contact_person_name_encrypted: null,
      legal_address: '[DELETED]',
      email: `deleted_${operatorId}@deleted.local`,
      phone: null,
      status: 'deactivated',
      deleted_at: new Date(),
      deletion_reason: reason
    });
    
    // 2. Удалить документы из S3
    await deleteS3Documents(operatorId);
    
    // 3. Сохранить минимум данных для compliance (180 дней)
    await trx.deleted_operators_archive.create({
      operator_id: operatorId,
      deletion_date: new Date(),
      retention_until: addDays(new Date(), 180),
      reason: reason
    });
    
    // 4. Audit log
    await trx.audit_log.create({
      action: 'operator_deleted',
      target_id: operatorId,
      timestamp: new Date()
    });
  });
}
```

---

## 10.3. Доступ администраторов к документам: логирование, audit trail

Все действия администраторов с документами логируются для безопасности и соответствия требованиям.

**Принципы:**
- Каждый доступ к документу логируется
- Администраторы не могут удалять логи
- Логи хранятся минимум 3 года
- Оператор может запросить audit trail своих данных

---

### Audit Log Schema

```typescript
interface DocumentAuditLog {
  id: number;
  operator_id: number;
  document_id: number;
  document_type: string;
  
  // Действие
  action: 'uploaded' | 'viewed' | 'downloaded' | 'deleted' | 'updated';
  
  // Кто совершил действие
  actor_type: 'operator' | 'admin' | 'system';
  actor_id: number;
  actor_name: string;
  actor_email: string;
  
  // Контекст
  ip_address: string;
  user_agent: string;
  session_id: string;
  
  // Детали
  details?: any; // JSON с дополнительной информацией
  
  // Метаданные
  timestamp: Date;
  request_id: string;
}
```

---

### Логирование операций

**При просмотре документа администратором:**

```typescript
async function viewDocument(documentId: number, adminId: number, req: Request) {
  const document = await db.documents.findById(documentId);
  
  // Логируем доступ
  await db.document_audit_log.create({
    operator_id: document.operator_id,
    document_id: documentId,
    document_type: document.document_type,
    action: 'viewed',
    actor_type: 'admin',
    actor_id: adminId,
    actor_name: req.user.name,
    actor_email: req.user.email,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    session_id: req.sessionID,
    timestamp: new Date(),
    request_id: req.id
  });
  
  // Генерируем pre-signed URL
  const viewUrl = await generateViewUrl(document.file_key);
  
  return viewUrl;
}
```

---

### Просмотр Audit Trail оператором

**API эндпоинт для оператора:**

```http
GET /api/v1/operators/me/audit-log
Authorization: Bearer <operator_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "audit_log": [
      {
        "id": 123,
        "action": "viewed",
        "document_type": "egrul_extract",
        "actor_type": "admin",
        "actor_name": "Алексей Петров",
        "timestamp": "2025-12-10T10:00:00Z",
        "details": "Просмотр во время модерации"
      },
      {
        "id": 124,
        "action": "downloaded",
        "document_type": "egrul_extract",
        "actor_type": "admin",
        "actor_name": "Мария Иванова",
        "timestamp": "2025-12-10T14:30:00Z",
        "details": "Скачивание для дополнительной проверки"
      }
    ]
  }
}
```

**UI для оператора:**

```
┌────────────────────────────────────────────────────────────────┐
│  История доступа к моим документам                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Дата/Время          Действие     Документ           Кто      │
│  ─────────────────────────────────────────────────────────────│
│  10.12.2025, 10:00   Просмотрен   Выписка UAE Commercial Registry   А.Петров   │
│  10.12.2025, 14:30   Скачан       Выписка UAE Commercial Registry   М.Иванова  │
│  09.12.2025, 16:45   Загружен     Выписка UAE Commercial Registry   Я (Иван)   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Алерты при подозрительной активности

**Триггеры:**
- Массовое скачивание документов (>10 за час)
- Доступ к документам вне рабочего времени (ночью)
- Доступ с нетипичного IP

**Email администраторам:**

```
Тема: [SECURITY ALERT] Подозрительная активность с документами

Обнаружена подозрительная активность:

Администратор: Иван Сидоров (admin@selfstorage.com)
Действие: Массовое скачивание документов
Количество: 25 документов за последний час
Время: 10.12.2025, 03:00 (ночь)
IP: 192.168.1.50

Логи: https://admin.selfstorage.com/security/audit-log/12345
```

---

## 10.4. Compliance: GDPR, UAE PDPL (если применимо к вашему рынку)

Платформа должна соответствовать требованиям защиты персональных данных.

**Применимые законы:**

| Закон | Регион | Применимость |
|-------|--------|--------------|
| GDPR (General Data Protection Regulation) | Европейский Союз | ✅ Да (если есть EU клиенты/операторы) |
| UAE PDPL (Personal Data Protection Law) | Россия | ✅ Да |
| CCPA (California Consumer Privacy Act) | Калифорния, США | ⚠️ Возможно (если есть US клиенты) |

---

### GDPR Compliance

**Ключевые требования:**

**1. Lawful Basis for Processing (Законное основание)**

- **Consent (Согласие):** Оператор дает явное согласие при регистрации
- **Contract (Договор):** Обработка необходима для выполнения договора
- **Legal Obligation (Законная обязанность):** Compliance с налоговым законодательством

**Реализация:**

```typescript
interface ConsentRecord {
  user_id: number;
  consent_type: 'terms_of_service' | 'privacy_policy' | 'data_processing';
  consent_given: boolean;
  consent_version: string; // Версия документа
  consent_date: Date;
  ip_address: string;
  user_agent: string;
}
```

---

**2. Right to Access (Право на доступ)**

Оператор может запросить все свои данные.

**API:**
```http
GET /api/v1/operators/me/data-export
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "export_url": "https://s3.../export_456_20251210.zip",
    "expires_at": "2025-12-11T10:00:00Z",
    "file_size": 15728640,
    "includes": [
      "profile_data",
      "documents",
      "audit_logs",
      "financial_data"
    ]
  }
}
```

---

**3. Right to Rectification (Право на исправление)**

Оператор может исправить неточные данные.

**Реализовано через:**
- API: `PUT /operators/me`
- UI: Форма редактирования профиля

---

**4. Right to Erasure (Право на забвение)**

Оператор может запросить удаление своих данных.

**API:**
```http
DELETE /api/v1/operators/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "confirmation": "DELETE MY ACCOUNT",
  "reason": "No longer using the service"
}
```

**Процесс:**
- Анонимизация PII
- Удаление документов
- Сохранение минимума для compliance (180 дней)

---

**5. Data Portability (Переносимость данных)**

Оператор может получить свои данные в машиночитаемом формате (JSON, CSV).

---

**6. Data Breach Notification (Уведомление о утечке)**

Если произошла утечка:
- Уведомить регулятора в течение 72 часов
- Уведомить затронутых операторов

---

### 152-ФЗ Compliance (Россия)

**Ключевые требования:**

**1. Согласие на обработку ПД**

```
☑ Я согласен на обработку моих персональных данных
   в соответствии с Политикой конфиденциальности
   и UAE PDPL (Personal Data Protection Law)
```

**2. Уведомление TDRAа**

Если обрабатываются ПД граждан РФ → уведомить TDRA.

**Форма уведомления:**
- Наименование оператора
- Цели обработки ПД
- Категории ПД
- Правовые основания
- Перечень действий с ПД

**Статус:** ✅ Уведомление подано (гипотетически)

---

**3. Локализация данных (если требуется)**

152-ФЗ требует хранения ПД граждан РФ на территории РФ.

**Реализация:**
- S3-совместимое хранилище в РФ дата-центре
- Например: AWS S3

---

**4. Обеспечение безопасности ПД**

- Шифрование
- Контроль доступа
- Антивирус
- Межсетевые экраны
- Аудит

---

### Privacy Policy и Terms of Service

**Политика конфиденциальности должна содержать:**

1. Какие данные собираются
2. Цели обработки
3. Правовые основания
4. Кому передаются данные (третьим лицам)
5. Как долго хранятся
6. Права пользователей (доступ, исправление, удаление)
7. Контактная информация DPO (Data Protection Officer)

**URL:** https://selfstorage.com/privacy

---

**Terms of Service должны содержать:**

1. Условия использования платформы
2. Права и обязанности операторов
3. Комиссии и выплаты
4. Ответственность сторон
5. Условия расторжения

**URL:** https://selfstorage.com/terms

---

### Data Protection Officer (DPO)

**Назначение DPO:**
- Ответственный за защиту персональных данных
- Контактное лицо для регуляторов
- Консультирует по вопросам compliance

**Контакты:**
```
Email: dpo@selfstorage.com
Телефон: +7 (495) 123-45-67
```

---

# 11. Roadmap and Future Improvements онбординга

## 11.1. MVP (Q1 2026): полностью ручная модерация, минимум автопроверок

**Текущий статус:** MVP в разработке

**Возможности MVP:**

| Функция | Статус | Детали |
|---------|--------|--------|
| Регистрация операторов | ✅ | Email, телефон, пароль, тип оператора |
| Profile Completion | ✅ | Название, ИНН, ОГРН, адреса, банк. реквизиты |
| Document Upload | ✅ | PDF, JPG, PNG (макс 10 МБ) |
| Автоматические проверки | ⚠️ Базовые | Валидация форматов (ИНН, ОГРН, БИК) |
| AI Risk Scoring | ✅ | Оценка риска, fraud signals |
| Ручная модерация | ✅ | Админская панель, очередь заявок |
| Approve/Reject/Request Info | ✅ | Три основные операции |
| Email уведомления | ✅ | Для операторов и администраторов |
| Audit log | ✅ | Логирование всех действий |
| RBAC | ✅ | Owner, Manager, Staff |

**Ограничения MVP:**

| Функция | Статус | Комментарий |
|---------|--------|-------------|
| Auto-approve | ❌ | Все заявки модерируются вручную |
| Auto-reject | ❌ | Даже critical risk требует ручного решения |
| OCR документов | ❌ | Только в v1.1+ |
| Биометрия | ❌ | Только в v2.0+ |
| Интеграция с FTA (Federal Tax Authority) API | ❌ | Ручная проверка через сайт fta.gov.ae |
| Самозанятые | ❌ | Только юрлица и ИП |
| Физлица | ❌ | Только в v2.0+ |
| Видеозвонок | ❌ | Только в v2.0+ |

**KPI для MVP:**

| Метрика | Целевое значение |
|---------|------------------|
| Время регистрации | < 10 минут |
| Время модерации | 24-48 часов (SLA) |
| Approval rate | 70-80% |
| Rejection rate | 10-20% |
| False positive rate | < 5% |

---

## 11.2. v1.1 (Q2-Q3 2026): частичная автоматизация (auto-approve low-risk до 40-50%)

**Релиз:** Июнь-Июль 2026

**Главные улучшения:**

### 1. Auto-Approve для Low-Risk операторов

**Критерии auto-approve:**
- Risk Score < 30
- 0 критических fraud signals
- Все автопроверки пройдены
- Компания существует >6 месяцев
- Confidence модели > 0.8

**Ожидаемый результат:**
- 40-50% заявок одобряются автоматически
- Снижение нагрузки на модераторов
- Ускорение онбординга до 1-2 часов для low-risk

```typescript
async function processSubmission(operatorId: number) {
  const riskAssessment = await calculateRiskScore(operatorId);
  
  // Auto-approve для low-risk
  if (
    riskAssessment.risk_score < 30 && 
    riskAssessment.risk_level === 'low' &&
    riskAssessment.confidence > 0.8 &&
    !hasCriticalSignals(riskAssessment.fraud_signals)
  ) {
    await autoApproveOperator(operatorId);
    return { auto_approved: true };
  }
  
  // Остальные → ручная модерация
  await addToModerationQueue(operatorId, riskAssessment);
  return { auto_approved: false };
}
```

---

### 2. OCR для извлечения данных из документов

**Возможности:**
- Автоматическое извлечение текста из выписок UAE Commercial Registry
- Сверка данных в профиле с данными в документах
- Выявление несоответствий

**Технологии:**
- Tesseract OCR
- Google Cloud Vision API
- AWS Textract

**Пример:**

```typescript
async function extractDataFromDocument(documentUrl: string) {
  const ocrResult = await visionAPI.detectText(documentUrl);
  
  const extractedData = {
    inn: extractINN(ocrResult.text),
    ogrn: extractOGRN(ocrResult.text),
    company_name: extractCompanyName(ocrResult.text),
    legal_address: extractAddress(ocrResult.text)
  };
  
  return extractedData;
}
```

---

### 3. Интеграция с внешними API

**FTA (Federal Tax Authority) API:**
- Автоматическая проверка ИНН/ОГРН
- Получение актуальной информации о компании
- Проверка статуса (действующая/ликвидирована)

**DaData API:**
- Валидация и стандартизация адресов
- Verifying bank details
- Определение типа организации

**Пример:**

```typescript
async function checkCompanyInFNS(inn: string): Promise<FNSCompanyInfo> {
  const response = await fetch(`https://api.fns.ru/v1/companies/${inn}`, {
    headers: { 'Authorization': `Bearer ${FNS_API_KEY}` }
  });
  
  const data = await response.json();
  
  return {
    exists: data.found,
    company_name: data.name,
    status: data.status,
    ogrn: data.ogrn,
    legal_address: data.legal_address,
    registration_date: data.registration_date
  };
}
```

---

### 4. Enhanced AI Risk Engine

**Улучшения модели:**
- Обучение на исторических данных MVP
- Добавление новых features
- Улучшение точности до 90-95%

**Новые features:**
- Social signals (наличие сайта, соцсетей)
- Business age и history
- Отзывы и рейтинги (если есть)

---

### 5. Поддержка самозанятых

**Что добавляется:**
- Форма для самозанятых
- Интеграция с "Мой налог" API (если доступно)
- Проверка статуса самозанятого

---

**KPI для v1.1:**

| Метрика | Целевое значение |
|---------|------------------|
| Auto-approve rate | 40-50% |
| Время онбординга (low-risk) | 1-2 часа |
| False positive rate | < 3% |
| Модераторов на 1000 заявок | 5 (vs 10 в MVP) |

---

## 11.3. v1.2+ (Q4 2026): расширенная интеграция с внешними реестрами, OCR документов, улучшение AI-модели

**Релиз:** Октябрь-Декабрь 2026

**Главные улучшения:**

### 1. Продвинутый OCR + Document Verification

**Возможности:**
- Проверка подлинности документов
- Детекция поддельных печатей и подписей
- Анализ метаданных PDF (дата создания, программа)
- Сравнение фото в паспорте с селфи (если требуется)

**Технологии:**
- AWS Textract
- Google Cloud Document AI
- Custom ML модели для детекции фрода

---

### 2. Интеграция с большим количеством реестров

**Планируемые интеграции:**

| Реестр | Что проверяем | Статус |
|--------|---------------|--------|
| UAE Commercial Registry/UAE Commercial Registry | Существование компании, статус | v1.1 |
| Справочник БИК ЦБ | Bank Details | v1.1 |
| FTA (Federal Tax Authority) API | Налоговые данные, задолженности | v1.1 |
| Реестр недействительных паспортов МВД | Проверка паспортов | v1.2 |
| СПАРК (Система профессионального анализа рынков) | Финансовое состояние компании | v1.2 |
| Реестр дисквалифицированных лиц | Проверка директора | v1.2 |
| Картотека арбитражных дел | Судебные дела компании | v1.2 |

---

### 3. Smart Risk Scoring

**Новые факторы риска:**
- Финансовое состояние компании
- Судебные дела (количество, сумма исков)
- Налоговые задолженности
- Дисквалифицированные лица в руководстве
- Связи с проблемными компаниями

---

### 4. Улучшенная аналитика

**Dashboard для модераторов:**
- Predictive analytics (прогноз времени обработки)
- Heatmap активности (когда больше всего заявок)
- Cohort analysis (качество операторов по каналам)

---

**KPI для v1.2:**

| Метрика | Целевое значение |
|---------|------------------|
| Auto-approve rate | 60-70% |
| False positive rate | < 2% |
| Fraud detection rate | > 95% |

---

## 11.4. v2.0+ (2027): полноценный KYC/KYB (биометрия, видеозвонки, continuous monitoring)

**Релиз:** 2027+

**Видение v2.0:**

### 1. Биометрическая верификация

**Для физлиц и ИП:**
- Селфи с паспортом
- Liveness detection (проверка, что это живой человек, а не фото)
- Сравнение лица на селфи с фото в паспорте

**Технологии:**
- Face recognition API (AWS Rekognition, Face++)
- Liveness detection SDK

---

### 2. Видеозвонок с верификацией

**Процесс:**
1. Оператор записывается на видеозвонок с модератором
2. Модератор проверяет документы в реальном времени
3. Задает вопросы для подтверждения намерений
4. Запись видеозвонка сохраняется для audit

**Для кого:**
- High-risk операторы
- Крупные операторы (много складов)
- По запросу

---

### 3. Continuous Monitoring (Непрерывный мониторинг)

**Что отслеживается:**
- Изменения в статусе компании (ликвидация, банкротство)
- Появление в черных списках
- Судебные дела
- Жалобы от клиентов

**Частота:**
- Раз в месяц: автоматическая проверка
- При триггере: немедленное уведомление

**Триггеры:**
- Компания ликвидирована → suspend оператора
- Директор дисквалифицирован → запрос объяснений
- Судебный иск >5 млн руб → флаг для проверки

---

### 4. Advanced Fraud Detection

**Machine Learning:**
- Deep learning модели для детекции фейковых документов
- Graph analysis для выявления связей между операторами
- Behavioral biometrics (уникальные паттерны поведения)

---

### 5. Поддержка физлиц

**С полной KYC:**
- Биометрия
- Проверка права на помещение
- Налоговые консультации (как декларировать доход)

---

**KPI для v2.0:**

| Метрика | Целевое значение |
|---------|------------------|
| Auto-approve rate | 80-90% |
| Fraud detection rate | > 98% |
| False positive rate | < 1% |
| Time to verification (low-risk) | < 1 час |

---

## 11.5. Потенциальные интеграции: e-signing, платежные сервисы для упрощения onboarding

### 1. Электронная подпись (e-Signing)

**Цель:** Упростить подписание договоров

**Интеграции:**

| Сервис | Регион | Возможности |
|--------|--------|-------------|
| DocuSign | Глобально | Электронная подпись, шаблоны договоров |
| Калуга Астрал | Россия | ЭЦП в соответствии с 63-ФЗ |
| Подпись.ру | Россия | Простая ЭП и усиленная ЭП |

**Use case:**
- Автоматическая генерация договора при одобрении
- Оператор подписывает онлайн через ЭЦП
- Договор вступает в силу

---

### 2. Identity Verification Services

**Интеграции:**

| Сервис | Возможности |
|--------|-------------|
| Sumsub | KYC/KYB, биометрия, проверка документов |
| Onfido | AI-powered identity verification |
| Jumio | Документы + селфи + liveness |
| СМЭВ (РФ) | Госуслуги, проверка через ЕСИА |

**Use case:**
- Оператор проходит верификацию через Sumsub
- Результат автоматически попадает в нашу систему
- Снижение нагрузки на модераторов

---

### 3. Платежные сервисы

**Instant Onboarding с привязкой карты:**

**Идея:**
- При регистрации оператор привязывает карту
- Проверяем владельца карты (3DS)
- Это дополнительная верификация личности

**Интеграции:**
- Stripe
- Stripe
- CloudPayments

---

### 4. Open Banking / PSD2 (для EU)

**Возможности:**
- Прямой доступ к банковским данным оператора (с согласия)
- Проверка баланса и транзакций
- Подтверждение владения счетом

**Use case:**
- Оператор дает разрешение на доступ к банку
- Мы автоматически получаем выписку и проверяем реквизиты
- Упрощение процесса, нет нужды загружать справку

---

### 5. Интеграция с CRM

**Для sales-led онбординга:**
- Salesforce
- HubSpot
- amoCRM

**Workflow:**
- Sales менеджер создает lead в CRM
- Lead автоматически конвертируется в оператора
- Приоритетная модерация

---

### 6. Чат-боты и AI Assistant

**Для помощи оператору:**
- Telegram Bot: проверка статуса, ответы на вопросы
- AI Chatbot на сайте: помощь с заполнением профиля
- Voice Assistant: голосовая помощь (будущее)

---

## Итоговый Roadmap Timeline

```
2026 Q1: MVP
├── Ручная модерация
├── Базовые автопроверки
└── AI Risk Scoring

2026 Q2-Q3: v1.1
├── Auto-approve (40-50%)
├── OCR документов
├── FTA (Federal Tax Authority) API интеграция
└── Поддержка самозанятых

2026 Q4: v1.2
├── Advanced OCR
├── Больше реестров
├── Smart Risk Scoring
└── Auto-approve (60-70%)

2027+: v2.0
├── Биометрия
├── Видеозвонки
├── Continuous monitoring
├── e-Signing
└── Auto-approve (80-90%)
```

---

**Конец Файла 5 (Разделы 9-11)**

---

# 🎉 КОНЕЦ СПЕЦИФИКАЦИИ 🎉

**Документ:** Operator Onboarding & Verification Specification (MVP v1)  
**Версия:** 1.0  
**Дата:** December 9, 2025  
**Статус:** ✅ COMPLETE

**Всего разделов:** 11  
**Всего файлов:** 5  
**Общий объем:** ~120+ страниц

**Содержание:**

**Файл 1** (Разделы 1-3):
- Введение и обзор
- Процесс онбординга (overview)
- Пре-регистрация

**Файл 2** (Разделы 4-5):
- Верификация оператора (KYC/KYB light)
- UX Flow и состояния

**Файл 3** (Раздел 6):
- API-слой онбординга и верификации

**Файл 4** (Разделы 7-8):
- Интеграция с Risk Scoring / Fraud Engine
- Админская модерация и операции

**Файл 5** (Разделы 9-11):
- RBAC и доступы операторов
- Безопасность и приватность данных
- Roadmap и будущие улучшения

---

**Спасибо за внимание!** 🚀
