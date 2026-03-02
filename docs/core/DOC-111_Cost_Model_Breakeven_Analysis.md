# DOC-111: Cost Model & Breakeven Analysis
# StorageCompare.ae — Финансовая модель

**Document ID:** DOC-111
**Version:** 1.0
**Status:** 🟢 Ready
**Location:** `docs/core/DOC-111_Cost_Model_Breakeven_Analysis.md`
**Related:** DOC-070 (Monetization Strategy), DOC-033 (Cost Optimization)

---

# 1. Обзор всех расходов

## 1.1. Фиксированные расходы (есть всегда, независимо от трафика)

| Сервис | Назначение | Месяц (USD) | Месяц (AED) | Примечание |
|--------|-----------|-------------|-------------|------------|
| **AWS EC2 / App Hosting** | Backend (NestJS) + Frontend (Next.js) | $40-80 | 147-294 | t3.medium или Railway/Render |
| **PostgreSQL (RDS)** | База данных + PostGIS + pgvector | $30-60 | 110-220 | db.t3.medium, 20GB SSD |
| **Redis (ElastiCache)** | Кэш + сессии + rate limiting | $15-25 | 55-92 | cache.t3.micro |
| **AWS S3** | Хранение фото складов, документов | $5-15 | 18-55 | ~50GB в первый год |
| **Cloudflare** | CDN + SSL + DDoS защита | $0-20 | 0-74 | Free tier достаточен для MVP |
| **Domain** | storagecompare.ae | $15/year | 55/year | ≈ $1.25/month |
| **Monitoring** | Grafana Cloud / Sentry | $0-30 | 0-110 | Free tiers для MVP |
| **CI/CD** | GitHub Actions | $0 | 0 | Free для private repo |
| **SSL Certificates** | Let's Encrypt | $0 | 0 | Бесплатно |
| **n8n** | Workflow automation | $0-20 | 0-74 | Self-hosted или cloud |
| **ИТОГО ФИКС** | | **$106-265** | **~390-975** | |

**Реалистичный MVP бюджет: ~$150/month (550 AED)** при минимальной конфигурации.

---

## 1.2. Переменные расходы (растут с трафиком)

### API-сервисы

| Сервис | Использование | Цена за единицу | 1K users/mo | 5K users/mo | 10K users/mo |
|--------|--------------|-----------------|-------------|-------------|--------------|
| **Claude API (AI Chat)** | Chat сессии: ~6 msg × ~500 tok | ~$0.015/session | $15 | $75 | $150 |
| **Claude API (Box Finder)** | Рекомендации размера | ~$0.01/request | $5 | $25 | $50 |
| **SendGrid (Email)** | Регистрация, бронирование, уведомления | Free: 100/day | $0 | $0 | $15 |
| **Twilio SMS** | OTP, подтверждения | $0.05/sms | $15 | $75 | $150 |
| **Twilio WhatsApp** | AI Bot сообщения | $0.005-0.05/msg | $10 | $50 | $100 |
| **Google Maps API** | Геокодинг, карты | $5/1K requests | $5 | $15 | $25 |
| **OpenAI Embeddings** | RAG векторы (если используем) | $0.0001/1K tok | $2 | $5 | $10 |
| **ИТОГО ПЕРЕМЕННЫЕ** | | | **~$52** | **~$245** | **~$500** |

### Формула переменных расходов

```
Variable Cost/month ≈ $0.05 × MAU (Monthly Active Users)
```

Т.е. ~5 центов на одного активного пользователя в месяц.

---

## 1.3. Общие расходы по сценариям

| Сценарий | MAU | Фикс | Переменные | ИТОГО/мес | ИТОГО/год |
|----------|-----|------|------------|-----------|-----------|
| **MVP Launch** | 300 | $150 | $15 | **$165** | **$1,980** |
| **Early Traction** | 1,000 | $150 | $52 | **$202** | **$2,424** |
| **Growing** | 5,000 | $200 | $245 | **$445** | **$5,340** |
| **Scale** | 10,000 | $300 | $500 | **$800** | **$9,600** |
| **Mature** | 30,000 | $500 | $1,500 | **$2,000** | **$24,000** |

---

# 2. Модель доходов

## 2.1. Источники дохода (из DOC-070)

### Источник 1: Комиссия с бронирований (PRIMARY — MVP)

```
Commission Rate: 12% от стоимости бронирования
Средний чек бронирования: 400 AED/month × 3 months = 1,200 AED
Комиссия с одного бронирования: 1,200 × 12% = 144 AED (~$39)
```

### Источник 2: Подписка операторов (SECONDARY — v1.5+)

```
Basic:    Бесплатно
Standard: 2,990 AED/month ($815)
Pro:      4,990 AED/month ($1,360) — v2.0
```

### Источник 3: Promoted Listings (v2.0+)

```
Featured placement: 500-1,500 AED/month per warehouse
Estimated uptake: 10-20% of operators
```

---

## 2.2. Conversion Funnel

```
Website Visitors (MAU)
    ↓ 100%
Search / Browse
    ↓ 30% view warehouse details
Warehouse Detail Page
    ↓ 10% start booking flow
Booking Started
    ↓ 50% complete booking
Booking Submitted (pending)
    ↓ 70% confirmed by operator
Booking Confirmed (billable)
    ↓ 12% commission = Revenue
```

**Key Metrics:**

| Metric | Rate | Formula |
|--------|------|---------|
| Visit → Booking | 1.5% | 30% × 10% × 50% |
| Booking → Confirmed | 70% | Operator confirmation rate |
| **Visit → Confirmed Booking** | **~1.05%** | End-to-end conversion |

---

## 2.3. Revenue по сценариям

| Сценарий | MAU | Confirmed Bookings/mo | Avg Booking (AED) | Commission 12% | Revenue/mo (AED) | Revenue/mo (USD) |
|----------|-----|----------------------|-------------------|----------------|------------------|------------------|
| **MVP Launch** | 300 | 3 | 1,200 | 144 | 432 | $118 |
| **Early Traction** | 1,000 | 10-11 | 1,200 | 144 | 1,440-1,584 | $392-431 |
| **Growing** | 5,000 | 52-53 | 1,200 | 144 | 7,488-7,632 | $2,038-2,078 |
| **Scale** | 10,000 | 105 | 1,200 | 144 | 15,120 | $4,115 |
| **Mature** | 30,000 | 315 | 1,200 | 144 | 45,360 | $12,343 |

**С подпиской операторов (v1.5+):**

| Сценарий | Операторов | Standard (10%) | Sub Revenue/mo (AED) | + Commission | TOTAL/mo (AED) |
|----------|-----------|----------------|---------------------|-------------|----------------|
| **Early** | 20 | 2 | 5,980 | 1,440 | **7,420** ($2,020) |
| **Growing** | 50 | 5 | 14,950 | 7,488 | **22,438** ($6,108) |
| **Scale** | 100 | 10 | 29,900 | 15,120 | **45,020** ($12,250) |
| **Mature** | 200 | 20 | 59,800 | 45,360 | **105,160** ($28,624) |

---

# 3. Unit Economics

## 3.1. Cost per Booking

```
Total Monthly Cost / Confirmed Bookings = Cost per Booking

MVP:     $165 / 3 bookings   = $55/booking  ← УБЫТОК (нормально для MVP)
1K MAU:  $202 / 10 bookings  = $20/booking  ← Близко к breakeven
5K MAU:  $445 / 52 bookings  = $8.6/booking ← ПРИБЫЛЬНО
10K MAU: $800 / 105 bookings = $7.6/booking ← ПРИБЫЛЬНО
```

**Revenue per Booking: $39 (144 AED)**

## 3.2. Contribution Margin

```
Contribution Margin = Revenue per Booking - Variable Cost per Booking

Variable cost per booking ≈ $3-5 (API calls for that user journey)
Revenue per booking = $39

Contribution Margin = $39 - $4 = $35 (89.7%)
```

**Contribution Margin ~90%** — это отличный показатель для маркетплейса.

## 3.3. Breakeven (только комиссия)

```
Fixed Costs / Contribution Margin per Booking = Breakeven Bookings

$150 / $35 = 4.3 ≈ 5 bookings/month

5 подтверждённых бронирований в месяц = операционный breakeven
```

**При конверсии 1.05% это ≈ 500 MAU** для breakeven на комиссии.

## 3.4. Breakeven (комиссия + подписка)

Если хотя бы 2 оператора на Standard:

```
Fixed Revenue: 2 × 2,990 = 5,980 AED ($1,628) — покрывает все фикс. расходы
Commission: всё что сверху = чистая прибыль

Breakeven: 0 bookings нужно (подписки покрывают расходы)
```

---

# 4. Финансовые проекции по месяцам

## 4.1. Year 1 — Пессимистичный (только комиссия)

| Месяц | MAU | Bookings | Revenue (AED) | Costs (AED) | Profit (AED) | Cumulative (AED) |
|-------|-----|----------|---------------|-------------|-------------|-------------------|
| 1 | 100 | 1 | 144 | 606 | -462 | -462 |
| 2 | 200 | 2 | 288 | 606 | -318 | -780 |
| 3 | 400 | 4 | 576 | 625 | -49 | -829 |
| 4 | 700 | 7 | 1,008 | 650 | 358 | -471 |
| 5 | 1,000 | 10 | 1,440 | 742 | 698 | 227 |
| 6 | 1,500 | 16 | 2,304 | 797 | 1,507 | 1,734 |
| 7 | 2,000 | 21 | 3,024 | 852 | 2,172 | 3,906 |
| 8 | 2,500 | 26 | 3,744 | 907 | 2,837 | 6,743 |
| 9 | 3,000 | 32 | 4,608 | 963 | 3,645 | 10,388 |
| 10 | 3,500 | 37 | 5,328 | 1,018 | 4,310 | 14,698 |
| 11 | 4,000 | 42 | 6,048 | 1,073 | 4,975 | 19,673 |
| 12 | 5,000 | 52 | 7,488 | 1,184 | 6,304 | **25,977** |

**Итого Year 1 (пессимистичный): +25,977 AED (~$7,070) прибыль**
**Breakeven: месяц 5** (при условии роста MAU)

## 4.2. Year 1 — Оптимистичный (комиссия + подписки с м.6)

| Месяц | MAU | Bookings | Subscribers | Revenue (AED) | Costs (AED) | Profit (AED) |
|-------|-----|----------|-------------|---------------|-------------|-------------|
| 1-3 | 100-400 | 1-4 | 0 | 144-576 | 606-625 | -462 to -49 |
| 4-6 | 700-1,500 | 7-16 | 0-2 | 1,008-8,284 | 650-797 | 358-7,487 |
| 7-9 | 2,000-3,000 | 21-32 | 3-5 | 12,014-19,558 | 852-963 | 11,162-18,595 |
| 10-12 | 3,500-5,000 | 37-52 | 6-8 | 23,258-31,408 | 1,018-1,184 | 22,240-30,224 |

**Итого Year 1 (оптимистичный): ~120,000 AED (~$32,650) прибыль**

---

# 5. Customer Acquisition Cost (CAC)

## 5.1. Маркетинговые каналы и бюджеты (оценка)

| Канал | Бюджет/мес (AED) | Leads/мес | Cost per Lead | Conv. to Booking | CAC |
|-------|------------------|-----------|---------------|------------------|-----|
| **Google Ads** | 3,000 | 150 | 20 | 5% | 400 AED |
| **SEO (organic)** | 1,500 (контент) | 300 | 5 | 3% | 167 AED |
| **Social Media** | 2,000 | 100 | 20 | 3% | 667 AED |
| **WhatsApp Bot (organic)** | 0* | 50 | 0 | 8% | 0 AED |
| **Referral** | 500 (бонусы) | 30 | 17 | 10% | 167 AED |
| **Средневзвешенный** | | | | | **~250 AED** |

*WhatsApp Bot — переменные расходы уже учтены в API costs.

## 5.2. LTV/CAC Ratio

```
Average Customer LTV:
  Avg booking duration: 4 months
  Avg monthly rent: 400 AED
  Commission: 12%
  LTV = 400 × 4 × 0.12 = 192 AED per customer

  Repeat bookings (30% return within year): +58 AED
  Total LTV ≈ 250 AED (~$68)

CAC: ~250 AED
LTV/CAC = 250/250 = 1.0x  ← СЛАБО для MVP, нужно улучшать

Target: LTV/CAC ≥ 3x
```

## 5.3. Как улучшить LTV/CAC

| Рычаг | Действие | Эффект |
|-------|---------|--------|
| **↑ LTV** | Увеличить avg. duration (upsell на 6+ мес) | +50% LTV |
| **↑ LTV** | Добавить подписку операторов (indirect) | Revenue не зависит от CAC |
| **↑ LTV** | Cross-sell (страховка, мувинг) | +20% LTV |
| **↓ CAC** | Фокус на SEO (organic) | CAC → 100 AED |
| **↓ CAC** | WhatsApp Bot (viral growth) | CAC → 50 AED |
| **↓ CAC** | Referral программа | CAC → 80 AED |

**Реалистичный LTV/CAC через 6 мес: 2.5-3.5x** (при фокусе на organic + WhatsApp).

---

# 6. Operator Economics (ROI для оператора)

Оператор должен видеть, что платформа окупается. Это ключевое для удержания.

## 6.1. ROI калькулятор для оператора

```
Оператор: 50 боксов, средняя цена 400 AED/month

Без платформы:
  Occupancy: 60% (30 боксов)
  Revenue: 30 × 400 = 12,000 AED/month

С платформой:
  Occupancy: 75% (+15% от платформы)
  Additional boxes: 7-8
  Additional revenue: 8 × 400 = 3,200 AED/month
  Commission (12%): 3,200 × 0.12 = 384 AED/month

  NET GAIN = 3,200 - 384 = 2,816 AED/month
  ROI = 2,816 / 384 = 733%
```

**Ключевой messaging:** "За каждые 384 AED комиссии вы получаете 3,200 AED дополнительного дохода."

## 6.2. Operator Subscription ROI (Standard tier)

```
Standard subscription: 2,990 AED/month
Value: Priority ranking + analytics + AI features

Operator needs just 3 extra bookings/month to cover subscription:
  3 bookings × 400 AED × 3 months = 3,600 AED
  Net ROI: 3,600 - 2,990 = 610 AED (+20%)

With analytics and AI pricing: typically +5-10% occupancy
  50 boxes × 5% × 400 = 1,000 AED/month additional
  Total additional: 3,600 + 1,000 = 4,600 AED
  Net ROI: 4,600 - 2,990 = 1,610 AED (+54%)
```

---

# 7. Sensitivity Analysis

## 7.1. Что если конверсия ниже?

| Conversion Rate | MAU needed for Breakeven | Monthly Bookings |
|----------------|--------------------------|------------------|
| 0.5% (poor) | 1,000 | 5 |
| 1.05% (expected) | 500 | 5 |
| 2.0% (good) | 250 | 5 |

Breakeven по бронированиям = 5 в месяц — стабильно при любой конверсии.

## 7.2. Что если средний чек ниже?

| Avg Booking (AED) | Commission | Breakeven Bookings/mo |
|--------------------|------------|-----------------------|
| 600 (small box, 1 mo) | 72 AED | 8 |
| 1,200 (medium, 3 mo) | 144 AED | 5 |
| 2,400 (large, 6 mo) | 288 AED | 3 |

## 7.3. Что если Claude API подорожает 2x?

```
Current AI cost: ~$52/mo at 1K MAU
If 2x: ~$104/mo
Impact on total costs: +$52 (+25%)
New breakeven: 6 bookings instead of 5

Minimal impact — API costs are <30% of total.
```

---

# 8. Key Financial Metrics Dashboard

## 8.1. Метрики для отслеживания (ежемесячно)

| Метрика | Формула | Target (Month 6) | Red Flag |
|---------|---------|-------------------|----------|
| **MRR** | Monthly Recurring Revenue | >5,000 AED | <1,500 AED |
| **Gross Margin** | (Revenue - Variable Costs) / Revenue | >85% | <70% |
| **CAC** | Marketing Spend / New Customers | <300 AED | >500 AED |
| **LTV** | Avg Revenue per Customer (lifetime) | >250 AED | <150 AED |
| **LTV/CAC** | LTV / CAC | >2.5x | <1.5x |
| **Churn (operators)** | % operators leaving per month | <10% | >20% |
| **Bookings/month** | Confirmed bookings | >15 | <5 |
| **Cost per Booking** | Total Costs / Bookings | <50 AED | >100 AED |
| **ARPU** | Revenue / MAU | >3 AED | <1 AED |
| **Burn Rate** | Monthly cash outflow | <2,000 AED | >5,000 AED |

## 8.2. Unit Economics Target (Month 12)

```
┌─────────────────────────────────────────────┐
│          TARGET UNIT ECONOMICS              │
├─────────────────────────────────────────────┤
│  Revenue per Booking:     144 AED           │
│  Variable Cost per Booking: ~15 AED         │
│  Contribution Margin:      129 AED (90%)    │
│                                             │
│  Fixed Costs:              ~1,200 AED/mo    │
│  Breakeven:                10 bookings/mo   │
│  Target Bookings:          50+/mo           │
│                                             │
│  Monthly Profit Target:    5,000+ AED       │
│  Annual Revenue Target:    100,000+ AED     │
│  LTV/CAC Target:           3x+             │
└─────────────────────────────────────────────┘
```

---

# 9. Рекомендации

## 9.1. Фаза 1: Pre-Launch (месяц 0)
- Минимизировать фикс. расходы: Railway/Render вместо AWS ($20-40/mo)
- Free tiers всех API (SendGrid, Cloudflare, Sentry)
- Twilio WhatsApp Sandbox (бесплатно)
- **Target burn rate: <$100/month**

## 9.2. Фаза 2: Launch (месяцы 1-3)
- Фокус на органический трафик (SEO + WhatsApp)
- Минимальный маркетинговый бюджет (3,000 AED/mo)
- Отслеживать conversion funnel weekly
- **Target: 5 bookings/month → breakeven**

## 9.3. Фаза 3: Growth (месяцы 4-8)
- Добавить подписку операторов (Standard tier)
- Увеличить маркетинг на работающие каналы
- Мигрировать на AWS при >3K MAU
- **Target: positive cash flow, LTV/CAC >2x**

## 9.4. Фаза 4: Scale (месяцы 9-12)
- Запустить Pro tier и promoted listings
- Оптимизировать API costs (кэширование, batch)
- Расширение в Abu Dhabi, Sharjah
- **Target: 100K AED/year revenue, LTV/CAC >3x**

---

# 10. Relation to Other Documents

| Document | Relationship |
|----------|-------------|
| **DOC-070** | Monetization strategy — commission rates, subscription tiers, pricing logic |
| **DOC-080** | Extended monetization models exploration |
| **DOC-033** | Infrastructure cost optimization principles |
| **DOC-027** | Capacity planning — scales costs with growth |
| **DOC-107** | UAE competitive analysis — pricing context |
| **DOC-110** | WhatsApp Bot costs — included in API variable costs |

---

**End of DOC-111**
