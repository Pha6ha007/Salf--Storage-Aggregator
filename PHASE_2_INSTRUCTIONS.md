# PHASE 2: Document-by-Document Intelligent Adaptation
# Complete Instructions for Claude Code

## Overview

Phase 1 handled mechanical text replacements (sed).
Phase 2 handles CONTEXTUAL changes that require understanding:
- Example data (names, addresses, phones, coordinates)
- Legal references (Russian laws → UAE laws)
- Business context (Russian market → UAE market)
- Code snippets with hardcoded Russian values
- Cultural/locale adjustments

## Pre-Phase 2 Corrections

Before starting Phase 2, apply these fixes from Phase 1 review:

```bash
# 1. Move DOC-059 from core/ to multi-region/ (misclassified)
mv docs/core/DOC-059_Multi-Country_Multi-Region_Technical_Architecture_MVP_v1_1_HARDENED.md \
   docs/multi-region/

# 2. Verify Phase 1 remaining references
grep -rn "selfstorage\.ru\|Yandex Maps\|SMSC\|Yookassa" docs/ --include="*.md" \
  | grep -v archive/ | grep -v PHASE1
```

---

## GLOBAL RULES FOR ALL DOCUMENTS

### Example Data Replacements

| Russian Example | UAE Replacement |
|----------------|-----------------|
| Иван Петров / Ivan Petrov | Ahmed Al-Rashid |
| Мария Сидорова / Maria Sidorova | Fatima Hassan |
| Анна Козлова | Sarah Johnson (expat example) |
| Дмитрий Волков | Raj Patel (expat example) |
| +7 (999) 123-45-67 | +971 50 123 4567 |
| +7 (495) 555-12-34 | +971 4 555 1234 (Dubai landline) |
| ул. Ленина, д. 15 | Building 7, Street 14, Al Quoz Industrial 3, Dubai |
| Москва, 123456 | Dubai, UAE |
| Санкт-Петербург | Abu Dhabi |
| Казань / Екатеринбург | Sharjah / Ajman |
| 55.7558° N, 37.6173° E (Moscow) | 25.2048° N, 55.2708° E (Dubai) |
| 59.9343° N, 30.3351° E (SPb) | 24.4539° N, 54.3773° E (Abu Dhabi) |
| 2 700 руб/мес | 500 AED/month |
| 5 000 руб | 900 AED |
| 15 000 руб | 2,500 AED |
| 50 000 руб | 8,000 AED |
| от 1 000 до 10 000 руб | from 150 to 1,500 AED |

### Business Hours
| Russian | UAE |
|---------|-----|
| Пн-Пт 9:00-18:00 | Sun-Thu 9:00-18:00 |
| Monday-Friday | Sunday-Thursday |
| Weekend: Sat-Sun | Weekend: Fri-Sat |

### Warehouse Examples
| Russian Example | UAE Replacement |
|----------------|-----------------|
| "Складовка на Павелецкой" | "StorageHub Al Quoz" |
| "Сити-Бокс Химки" | "SafeBox JLT" |
| "Мини-склад Текстильщики" | "SpaceVault DIP" |
| warehouse in Moscow city center | warehouse in Business Bay, Dubai |
| near Komsomolskaya metro | near Dubai Metro, Al Quoz station |
| 5 min from MKAD | 5 min from Sheikh Zayed Road |

---

## TIER 1: Core Specifications (docs/core/)

### Priority: HIGHEST — these define everything else

**For each file, check and update:**

#### Functional_Specification_MVP_v1_CORRECTED.md
- [ ] All user story examples (Russian names → international names)
- [ ] Currency in acceptance criteria (руб → AED)
- [ ] Example warehouse descriptions (Russian addresses → Dubai addresses)
- [ ] Phone number format in registration examples
- [ ] Business hours references
- [ ] Any mention of Russian market context
- [ ] "Складовка" or Russian brand names in examples

#### Technical_Architecture_Document_MVP_v1_CANONICAL.md
- [ ] Hosting section: verify Hetzner → AWS ME (me-south-1)
- [ ] CDN: verify Cloudflare config for Middle East
- [ ] API examples: verify all URLs use storagecompare.ae
- [ ] Notification channels: add WhatsApp Business API alongside SMS
- [ ] n8n workflows: verify no Russian-specific integrations
- [ ] Code snippets: check for hardcoded Russian values
- [ ] **Fix remaining Yandex Maps references in code examples**

#### api_design_blueprint_mvp_v1_CANONICAL.md (or API_Detailed_Specification)
- [ ] All request/response examples: Russian data → UAE data
- [ ] Phone validation regex: +7 pattern → +971 pattern
- [ ] Address format in DTOs: add emirate field
- [ ] Currency field examples: RUB → AED
- [ ] Coordinates in geo-search examples: Moscow → Dubai
- [ ] Search radius examples: Moscow distances → Dubai distances
- [ ] Error message examples: any Russian text → English

#### full_database_specification_mvp_v1_CANONICAL.md
- [ ] Default values for currency fields → AED
- [ ] Phone column comments: +7 format → +971 format
- [ ] Address field descriptions: Russian format → UAE format
- [ ] geo_cache seed data: Moscow/SPb coords → Dubai/Abu Dhabi coords
- [ ] Example INSERT statements: Russian data → UAE data
- [ ] CHECK constraints on phone format if any

#### DOC-022 Backend_implementation_plan_mvp_v1_CANONICAL.md
- [ ] **Fix remaining selfstorage.ru in code examples**
- [ ] **Fix remaining Yandex Maps references**
- [ ] **Fix remaining SMSC references**
- [ ] **Fix remaining Yookassa references**
- [ ] Integration module code: update import paths
- [ ] Config examples: update env var values
- [ ] Maps integration code: Google Maps SDK setup
- [ ] Notification service: add WhatsApp channel

#### High_Level_Technical_Architecture_MVP_v1.md
- [ ] Architecture diagram labels (if any Russian text)
- [ ] Region/hosting references
- [ ] Integration list

#### MVP_Requirements_Specification_Full_TZ_v1.1_GREEN.md
- [ ] Market context sections
- [ ] User persona descriptions
- [ ] Pricing examples
- [ ] Geographic scope statements

#### DOC-101_Internal_Admin_API_Specification_MVP_v1.md
- [ ] Admin examples (user data, operator data)
- [ ] Currency in admin reports

---

## TIER 2: Security & Non-Functional (docs/security/)

#### DOC-078_Security_and_Compliance_Plan_MVP_v1_CANONICAL_REVISED.md
- [ ] **CRITICAL: Replace ALL Russian law references:**
  - 152-ФЗ (Personal Data) → UAE PDPL (Federal Decree-Law No. 45/2021)
  - Russian Civil Code → UAE Civil Transactions Law (No. 5/1985)
  - Роскомнадзор → TDRA (Telecommunications & Digital Government Regulatory Authority)
  - Russian data localization requirements → UAE data residency
- [ ] Data residency: "data must stay in Russia" → "data must stay in UAE/GCC"
- [ ] Encryption standards: verify alignment with UAE requirements
- [ ] Cookie consent: update for UAE context
- [ ] Age verification: Russian rules → UAE rules

#### Security_Architecture_MVP_v1_CANONICAL.md
- [ ] Same legal references as above
- [ ] Certificate authorities
- [ ] Regional compliance notes

#### DOC-020 Audit_logging_specification
- [ ] Timestamp format: verify UTC is used (not Moscow time)
- [ ] Retention periods: align with UAE PDPL

#### DOC-102 Service-to-Service Auth
- [ ] Cloud provider references (AWS ME region)

#### Error_Handling_Fault_Tolerance_Specification
- [ ] Error message examples (any Russian text → English)
- [ ] External service fallback order (Yandex → Google)

#### API_Rate_Limiting_Throttling_Specification
- [ ] IP geolocation examples (Russian IPs → UAE IPs)
- [ ] Rate limit examples per region

#### Logging_Strategy_CANONICAL
- [ ] Log format examples (any Russian data)
- [ ] Log retention: align with UAE PDPL

#### DOC-093 Warehouse Safety Scoring
- [ ] Safety standards references (Russian GOST → UAE Civil Defence standards)

---

## TIER 3: Feature Specifications (docs/features/)

### High Priority (8 files with remaining Russian refs)

#### DOC-023 Booking_Flow_Technical_Specification.md
- [ ] **Fix 12 remaining selfstorage.ru occurrences**
- [ ] **Fix remaining SMSC references**
- [ ] Booking confirmation message examples (Russian → English)
- [ ] Price calculation examples (RUB → AED)
- [ ] Working hours in booking rules (Mon-Fri → Sun-Thu)

#### DOC-096 Operator_Onboarding_Specification_COMPLETE.md
- [ ] **Fix remaining Yookassa references**
- [ ] Russian business registration → UAE trade license
- [ ] ИНН/ОГРН → UAE Trade License Number / TRN
- [ ] Russian bank details → UAE bank details (IBAN format)
- [ ] Verification documents: Russian passport → Emirates ID / Passport
- [ ] Company registration: Russian LLC (ООО) → UAE LLC / Free Zone company

#### DOC-070 Pricing_Monetization_Strategy
- [ ] **Fix remaining Yookassa references**
- [ ] Russian market pricing → UAE market pricing
- [ ] Commission examples in AED
- [ ] Payment method list: add Apple Pay, Samsung Pay

### All other features/ files:
- [ ] Check each for example data, prices, phone numbers
- [ ] AI features: verify prompt examples are in English
- [ ] Search/ranking: verify geo examples use Dubai coordinates
- [ ] CRM: lead examples with UAE customer data
- [ ] Payment: Stripe integration (not Yookassa)
- [ ] Analytics: metric examples with UAE-scale numbers (MAU 5000 → appropriate)

---

## TIER 4: Frontend & UX (docs/frontend/)

#### Frontend_Architecture_Specification_v1.5_FINAL.md
- [ ] Remove Yandex Maps SDK references, use Google Maps JavaScript API
- [ ] i18n config: primary locale = en-AE
- [ ] Font stack: add Arabic-compatible fonts (Noto Sans Arabic, etc.)
- [ ] RTL preparation: add dir="ltr" default, CSS logical properties note
- [ ] Meta tags examples: update for UAE market

#### DOC-049_Frontend_SEO_Strategy_MVP_v1.md & DOC-081/082 SEO
- [ ] **Remove ALL Yandex SEO references** (Yandex Webmaster, Yandex Metrica)
- [ ] Replace with Google Search Console, Google Analytics 4
- [ ] hreflang tags: ru → en-AE
- [ ] Schema.org examples: Russian address → UAE address
- [ ] Local SEO: Google Business Profile (not Yandex Business)
- [ ] Keywords: Russian search terms → English storage terms

#### DOC-089 User_Personas_and_User_Journeys
- [ ] **Replace ALL Russian personas with UAE-relevant personas:**
  - Expat relocating (most common in UAE)
  - SME/e-commerce seller
  - Family downsizing apartment
  - Student storing during summer
  - Event company needing temporary storage

#### DOC-091 UX_Flow_Diagrams_Wireframes
- [ ] UI text examples in English
- [ ] Address input fields: adapt for UAE format

#### DOC-026 Branding_Visual_Identity
- [ ] Color associations: verify for Middle East context
- [ ] Typography: Arabic-compatible considerations
- [ ] Logo: note domain change (storagecompare.ae)

#### All other frontend/ files:
- [ ] Verify all UI copy examples are in English
- [ ] Mobile number input: +971 format
- [ ] Date format: DD/MM/YYYY (standard in UAE)
- [ ] Currency display: AED XXX (not XXX AED)

---

## TIER 5: Infrastructure (docs/infrastructure/)

#### DOC-041 DevOps_Infrastructure_Plan
- [ ] **Fix remaining Yandex Maps references** (in deployment configs)
- [ ] Cloud region: me-south-1 (AWS) or uaenorth (Azure)
- [ ] Domain registrar: .ae domain considerations
- [ ] SSL certificates: verify for .ae domain

#### DOC-067 Performance_Load_Testing_Plan
- [ ] **Fix remaining Yandex references** (in test scenarios)
- [ ] Load test origin: Middle East region
- [ ] Latency targets: from Dubai, not Moscow

#### DOC-033 Cost_Optimization_Plan
- [ ] Cloud pricing: ME region pricing (slightly higher than EU)
- [ ] Currency in cost estimates: AED or USD

#### DOC-027 Capacity_Planning
- [ ] MAU projections: contextualize for UAE market size
- [ ] Peak traffic patterns: UAE-specific (not Russian holidays)

#### All other infrastructure/ files:
- [ ] Verify cloud region references
- [ ] Verify time zone in cron jobs (Asia/Dubai)

---

## TIER 6: Legal & Compliance (docs/legal/) — HEAVIEST REWRITE

#### DOC-094_Legal_Operational_Model_Russia_MVP_v1.md
- [ ] **FULL REWRITE OR REPLACE**
- [ ] Option A: Rewrite as DOC-094_Legal_Operational_Model_UAE_MVP_v1.md
- [ ] Option B: Archive and create new document
- [ ] Content should cover:
  - UAE company formation (mainland vs free zone)
  - Trade license requirements
  - VAT registration (5% VAT in UAE)
  - Employment law basics (if hiring locally)
  - Data protection (PDPL)
  - Consumer protection
  - E-commerce regulations
  - Payment processing regulations

#### DOC-054 Legal_Checklist_Compliance_Requirements
- [ ] Replace every Russian law reference with UAE equivalent:

| Russian Law | UAE Equivalent |
|-------------|---------------|
| ФЗ-152 (Personal Data) | Federal Decree-Law No. 45/2021 (PDPL) |
| ГК РФ (Civil Code) | Federal Law No. 5/1985 (Civil Transactions) |
| ЗоЗПП (Consumer Protection) | Federal Law No. 15/2020 (Consumer Protection) |
| ФЗ-54 (Cash Registers) | N/A — UAE does not require online cash registers |
| НК РФ (Tax Code) | Federal Decree-Law No. 47/2022 (Corporate Tax), VAT Law |
| ФЗ-149 (Information) | Federal Decree-Law No. 34/2021 (Cybercrime) |
| ФЗ-38 (Advertising) | Federal Law No. 15/2023 (Media Regulation) |

#### DOC-060 Operator_Agreement
- [ ] Replace Russian legal structure with UAE:
  - ООО → LLC (Limited Liability Company) or Free Zone Entity
  - ИНН → Tax Registration Number (TRN)
  - ОГРН → Trade License Number
  - Russian courts → UAE courts (or DIFC courts for free zone)
  - Arbitration: Russian Arbitration → DIAC (Dubai International Arbitration Centre)
  - Governing law: Russian law → UAE Federal Law
  - Force majeure: add sandstorms, extreme heat (UAE-specific)
- [ ] Payment terms in AED
- [ ] Insurance requirements per UAE standards

#### DOC-071 Privacy_Data_Protection_Policy
- [ ] 152-ФЗ → UAE PDPL
- [ ] Data subject rights: align with PDPL requirements
- [ ] Data transfer: within UAE/GCC (not within Russia)
- [ ] DPO requirements per PDPL
- [ ] Consent mechanisms per UAE law

#### Data_retention_policy_mvp_v1.md
- [ ] Retention periods: align with UAE PDPL and commercial law
- [ ] Data deletion: verify alignment with UAE requirements

#### Legal_Documentation_Unified_Guide
- [ ] Update all cross-references to reflect UAE legal framework
- [ ] Update document hierarchy for UAE context

---

## TIER 7: Multi-Region (docs/multi-region/)

#### DOC-058 Multi_Country_Scaling
- [ ] Make UAE the PRIMARY/DEFAULT region
- [ ] Russia becomes a SECONDARY/FUTURE region example
- [ ] Add GCC expansion roadmap: UAE → KSA → Qatar → Bahrain
- [ ] Update region config examples with UAE defaults

#### DOC-059 Multi-Region_Technical_Architecture
- [ ] Same: UAE as default region
- [ ] Update infrastructure examples for ME region

#### DOC-045 Feature_Roadmap
- [ ] Reorder roadmap: UAE launch first
- [ ] Phase 1: UAE (Dubai) → Phase 2: UAE (all emirates) → Phase 3: GCC
- [ ] Russia as future/optional phase

#### DOC-095 Expansion Strategy
- [ ] UAE as launch market
- [ ] GCC as primary expansion path
- [ ] Update market size data with UAE figures

---

## TIER 8: Operations (docs/operations/)

#### DOC-008 Competitor_Signals_Market_Insights
- [ ] Update with UAE competitor landscape:
  - The Box, GetSpace, SpaceHub, Local Self Storage, Ruby Self Storage
  - Morespace, Delight Self Storage, ESelf Storage
  - ServiceMarket (aggregator competitor)
- [ ] Market size: $602.5M (2024) → $859.2M (2030)

#### DOC-107 Competitive_Analysis_UAE (ALREADY UAE — verify only)
- [ ] Verify content is current and complete
- [ ] No changes needed if already UAE-focused

#### DOC-108 Competitive_Analysis_Kazakhstan
- [ ] Keep as-is (future market reference)

#### DOC-030 Competitive_Analysis_Market_Landscape
- [ ] If Russia-focused → update context or note it's historical
- [ ] Add reference to DOC-107 (UAE) as current primary

#### DOC-032 Content_Guidelines_for_Operators
- [ ] Language: English primary
- [ ] Examples: UAE warehouse descriptions
- [ ] Photo requirements: climate control visible (important in UAE heat)

#### DOC-087 User_Operator_Documentation
- [ ] All user-facing text in English
- [ ] UAE-specific FAQs
- [ ] WhatsApp as support channel

#### All other operations/ files:
- [ ] Verify timezone in runbooks (Asia/Dubai)
- [ ] Verify currency in any financial examples
- [ ] Verify contact information examples

---

## TIER DATA: docs/data/

#### unified_data_dictionary_mvp_v1.csv
- [ ] Check all field descriptions for Russian references
- [ ] Phone format description: +971
- [ ] Currency references: AED
- [ ] Address field descriptions: UAE format

---

## EXECUTION STRATEGY FOR CLAUDE CODE

Process ONE TIER at a time. For each tier:

```bash
# 1. List files in tier
ls docs/core/

# 2. For each file, read and apply changes
cat docs/core/Functional_Specification_MVP_v1_CORRECTED.md | head -200
# ... make changes ...

# 3. Verify no Russian refs remain in that file
grep -n "Russia\|Россия\|Moscow\|Москва\|Yandex\|SMSC\|Yookassa\|selfstorage\.ru\|+7 \|руб\|RUB\|₽\|152-ФЗ\|Роскомнадзор\|ГК РФ\|ИНН\|ОГРН\|ООО" docs/core/Functional_Specification_MVP_v1_CORRECTED.md

# 4. Commit tier
git add docs/core/
git commit -m "Phase 2, Tier 1: core specs — contextual UAE adaptation"
```

Repeat for each tier. Commit after each tier.

---

## PHASE 2 COMPLETION CRITERIA

Phase 2 is complete when:

```bash
# 1. Zero remaining Russian references (except archive/ and multi-region future sections)
grep -rn "selfstorage\.ru\|Yandex\|SMSC\|Yookassa\|152-ФЗ\|Роскомнадзор" docs/ \
  --include="*.md" | grep -v archive/ | grep -v "Future\|future\|OUT OF SCOPE" | wc -l
# Should be 0

# 2. UAE references exist throughout
grep -rn "storagecompare\.ae\|Google Maps\|Stripe\|AED\|PDPL\|Dubai\|+971" docs/ \
  --include="*.md" | wc -l
# Should be > 100

# 3. All tiers committed
git log --oneline | head -10
# Should show 8+ Phase 2 commits (one per tier)
```

After Phase 2: update docs/INDEX.md with final status.
