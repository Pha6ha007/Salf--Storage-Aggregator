# CLAUDE.md — Master Instructions for Self-Storage Aggregator
# Version: 2.0

## PROJECT CONTEXT

You are working on a Self-Storage Aggregator platform.
The documentation was originally written for Russia market.
Your tasks (in order):
1. Organize the project structure and sort documents
2. Adapt all documentation for UAE market
3. Build the platform

There are 100+ markdown documents in the `docs/` folder (flat, unsorted).
You CANNOT load them all at once. Work in batches.

---

## STRATEGY: 4-PHASE APPROACH

### PHASE 0: Project Structure & Document Sorting ← START HERE
Scan all files in `docs/`, classify them, create folder structure, move files.

### PHASE 1: Automated Global Replace (sed/grep)
Mechanical text replacements that don't require understanding context.

### PHASE 2: Document-by-Document Intelligent Adaptation
Read each document, understand context, make smart changes.

### PHASE 3: Cross-Reference Validation
Verify consistency across all documents after changes.

---

## PHASE 0: PROJECT STRUCTURE & DOCUMENT SORTING

### Step 0.1: Create the folder structure

```bash
# Create project directories
mkdir -p docs/core
mkdir -p docs/security
mkdir -p docs/features
mkdir -p docs/frontend
mkdir -p docs/infrastructure
mkdir -p docs/legal
mkdir -p docs/multi-region
mkdir -p docs/operations
mkdir -p docs/data
mkdir -p guides
mkdir -p agents
mkdir -p scripts
mkdir -p src/backend
mkdir -p src/frontend
mkdir -p infrastructure
```

### Step 0.2: Classify and move documents

Scan every file in `docs/` (root level). For each file, read the first
50 lines (title, purpose, scope) and classify it into the correct tier/folder.

**Classification rules:**

#### → `docs/core/` (Tier 1 — Canonical Source of Truth)
Move here if filename or content contains:
- `Functional_Specification` or `functional_spec`
- `Technical_Architecture` or `tech_arch`
- `api_design_blueprint` or `API_Design`
- `full_database_specification` or `database_spec`
- `backend_implementation_plan`
- `unified_data_dictionary` or `unified_glossary` → move to `docs/data/`

#### → `docs/security/` (Tier 2 — Security & Non-Functional)
Move here if filename or content contains:
- `Security` and (`Compliance` or `Plan` or `Architecture`)
- `Rate_Limiting` or `Throttling`
- `Error_Handling` or `Fault_Tolerance`
- `Logging_Strategy` or `Log_Taxonomy`

#### → `docs/features/` (Tier 3 — Feature Specifications)
Move here if filename or content contains:
- `AI_Core` or `AI_Design`
- `Booking_Flow` or `Booking` (but NOT `Backup`)
- `CRM` or `Lead_Management`
- `Payment` or `Billing`
- `Warehouse_Quality_Score`
- `Partner_API`
- `DOC-066`
- `DOC-092`
- `DOC-097`
- `DOC-106` (Trust & Safety)
- `Analytics` or `Metrics_Tracking`
- `Caching_Strategy` or `CDN`
- `DOC-100`
- `Data_Governance` or `Data_Quality`

#### → `docs/frontend/` (Tier 4 — Frontend & UX)
Move here if filename or content contains:
- `Frontend_Architecture` or `Frontend_Specification`
- `Frontend_Performance` or `Frontend_Optimization`
- `Frontend_SEO` or `SEO_Strategy`
- `Design_System`
- `DOC-048`
- `DOC-049`
- `Operator_Experience` or `OX_Deep`
- `DOC-063`

#### → `docs/infrastructure/` (Tier 5 — Operations & Infrastructure)
Move here if filename or content contains:
- `Disaster_Recovery` or `Backup_Plan` (infrastructure backup, NOT booking)
- `Infrastructure_as_Code` or `IaC`
- `Monitoring` and `Observability`
- `Configuration_Management`
- `Distributed_tracing` or `Tracing`
- `SLO` or `SLA` or `SLI`
- `DOC-042`
- `DOC-043`
- `DOC-052`

#### → `docs/legal/` (Tier 6 — Business & Legal)
Move here if filename or content contains:
- `Legal_Documentation` or `Legal_Checklist`
- `Operator_Agreement`
- `Trust_Safety` or `Trust_and_Safety`
- `DOC-054`
- `DOC-060`
- `DOC-106`
- `Data_retention_policy`

#### → `docs/multi-region/` (Tier 7 — Scaling & Multi-Region)
Move here if filename or content contains:
- `Multi_Country` or `Multi_Region` or `Multi-Country` or `Multi-Region`
- `DOC-058`
- `DOC-059`
- `Feature_Roadmap` or `Release_Phases`
- `DOC-045`

#### → `docs/operations/` (Tier 8 — Supporting & Operational)
Move here if filename or content contains:
- `Backup_and_Restore` and `Playbook`
- `support_maintenance`
- `release_management` or `versioning`
- `team_engineering` or `process_guidelines`
- `User_Operator_Documentation`

#### → `docs/data/` (Data & Glossary)
Move here if filename or content contains:
- `data_dictionary` or `glossary`
- `.csv` files

#### → `docs/unsorted/` (Catch-all)
If a document doesn't clearly fit any category above, move it here
and add a line to `docs/unsorted/NEEDS_REVIEW.md` with the filename
and a one-line description of what it contains.

### Step 0.3: Classification script

Run this to auto-classify. Claude Code should execute this logic:

```bash
#!/bin/bash
# Classify documents in docs/ into subfolders
# Usage: Run from project root

DOCS="docs"
MOVED=0
UNSORTED=0

mkdir -p "$DOCS"/{core,security,features,frontend,infrastructure,legal,multi-region,operations,data,unsorted}

for file in "$DOCS"/*.md "$DOCS"/*.csv; do
  [ -f "$file" ] || continue
  
  filename=$(basename "$file")
  target=""
  
  # Core (Tier 1)
  if echo "$filename" | grep -qiE "Functional_Specification|Technical_Architecture|api_design_blueprint|API_Detailed_Specification|full_database|backend_implementation"; then
    target="core"
  
  # Data
  elif echo "$filename" | grep -qiE "data_dictionary|glossary|\.csv$"; then
    target="data"
  
  # Security (Tier 2)
  elif echo "$filename" | grep -qiE "Security|Rate_Limiting|Throttling|Error_Handling|Fault_Tolerance|Logging_Strategy|Log_Taxonomy"; then
    target="security"
  
  # Features (Tier 3)
  elif echo "$filename" | grep -qiE "AI_Core|Booking_Flow|CRM|Lead_Management|Payment|Billing|Warehouse_Quality|Partner_API|Analytics|Metrics|Caching|CDN|Data_Governance|Trust_Safety|DOC-09[27]|DOC-100|DOC-106|DOC-066"; then
    target="features"
  
  # Frontend (Tier 4)
  elif echo "$filename" | grep -qiE "Frontend|Design_System|SEO_Strategy|Operator_Experience|DOC-04[89]|DOC-063"; then
    target="frontend"
  
  # Infrastructure (Tier 5)
  elif echo "$filename" | grep -qiE "Disaster_Recovery|Infrastructure_as_Code|Monitoring|Observability|Configuration_Management|Distributed_tracing|SLO_SLA|DOC-04[23]|DOC-052"; then
    target="infrastructure"
  
  # Legal (Tier 6)
  elif echo "$filename" | grep -qiE "Legal|Operator_Agreement|Data_retention|DOC-054|DOC-060"; then
    target="legal"
  
  # Multi-region (Tier 7)
  elif echo "$filename" | grep -qiE "Multi.Country|Multi.Region|Feature_Roadmap|Release_Phases|DOC-05[89]|DOC-045"; then
    target="multi-region"
  
  # Operations (Tier 8)
  elif echo "$filename" | grep -qiE "Backup_and_Restore|support_maintenance|release_management|versioning|team_engineering|process_guidelines|User_Operator_Documentation"; then
    target="operations"
  
  # Unsorted
  else
    target="unsorted"
    UNSORTED=$((UNSORTED + 1))
    echo "- $filename" >> "$DOCS/unsorted/NEEDS_REVIEW.md"
  fi
  
  if [ -n "$target" ]; then
    mv "$file" "$DOCS/$target/"
    echo "  $filename → $target/"
    MOVED=$((MOVED + 1))
  fi
done

echo ""
echo "=== Done ==="
echo "Moved: $MOVED files"
echo "Unsorted: $UNSORTED files (review docs/unsorted/NEEDS_REVIEW.md)"
echo ""

# Report
echo "=== Files per folder ==="
for dir in core security features frontend infrastructure legal multi-region operations data unsorted; do
  count=$(ls -1 "$DOCS/$dir/"*.md "$DOCS/$dir/"*.csv 2>/dev/null | wc -l)
  echo "  $dir/: $count files"
done
```

### Step 0.4: Generate document index

After sorting, create a master index:

```bash
# Claude Code should generate this file:
# docs/INDEX.md
```

The INDEX.md should contain:
- Full list of all documents grouped by folder
- For each document: filename, one-line purpose, tier number
- Count of documents per tier
- List of unsorted files needing review

### Step 0.5: Verify cross-references

After moving files, check that document cross-references still make sense:
```bash
# Find all DOC-XXX references across all files
grep -roh "DOC-[0-9]\{3\}" docs/ | sort | uniq -c | sort -rn > docs/CROSS_REFERENCES.txt
```

### Step 0.6: Move guides and agents into place

```bash
# If these files are in docs/, move them to proper locations
mv docs/WORKFLOW_GUIDE.md guides/ 2>/dev/null
mv docs/PROJECT_STRUCTURE.md guides/ 2>/dev/null
mv docs/AGENTS_ARCHITECTURE.md agents/README.md 2>/dev/null
```

---

## PHASE 0 VERIFICATION

Before proceeding to Phase 1, verify:

```bash
# 1. No files remain in docs/ root (all sorted)
ls docs/*.md docs/*.csv 2>/dev/null | wc -l
# Should return 0

# 2. All folders have files
for dir in core security features frontend infrastructure legal multi-region operations data; do
  echo "$dir: $(ls docs/$dir/*.md docs/$dir/*.csv 2>/dev/null | wc -l) files"
done

# 3. Core folder has exactly 5-7 canonical docs
ls docs/core/

# 4. INDEX.md exists
cat docs/INDEX.md | head -20
```

Only after Phase 0 is verified, proceed to Phase 1.

---

## PHASE 1: GLOBAL REPLACEMENTS

(Run AFTER Phase 0 is complete and committed)

### 1.1 Domain & URL Replacements

| Find | Replace With |
|------|-------------|
| `selfstorage.ru` | `storagecompare.ae` |
| `api.selfstorage.ru` | `api.storagecompare.ae` |
| `api-staging.selfstorage.ru` | `api-staging.storagecompare.ae` |
| `cdn.selfstorage.ru` | `cdn.storagecompare.ae` |

### 1.2 Map Provider Replacements

| Find | Replace With |
|------|-------------|
| `Yandex Maps API (primary) + Google Maps (fallback)` | `Google Maps API (primary)` |
| `Yandex Maps API (primary)` | `Google Maps API (primary)` |
| `Yandex Maps` (standalone) | `Google Maps` |
| `yandex-maps.client.ts` | `google-maps.client.ts` |
| `Yandex Geocoding` | `Google Geocoding` |

### 1.3 SMS/Notification Provider Replacements

| Find | Replace With |
|------|-------------|
| `SMSC.ru` | `Twilio` |
| `Twilio/SMSC.ru` | `Twilio + WhatsApp Business API` |
| `smsc.ru` | Remove |

### 1.4 Payment Provider Replacements

| Find | Replace With |
|------|-------------|
| `Yookassa` | `Stripe` |
| `ЮKassa` | `Stripe` |
| `yookassa` | `stripe` |

### 1.5 Currency Replacements

| Find | Replace With |
|------|-------------|
| `RUB` (as currency code) | `AED` |
| `₽` | `AED` |
| `рублей` / `руб.` | `AED` |
| `ruble` / `rubles` | `AED` / `dirhams` |

### 1.6 Locale & Region Replacements

| Find | Replace With |
|------|-------------|
| `ru-RU` | `en-AE` |
| `Russian` (as language) | `English` |
| `Russia` (as market/country) | `UAE` |
| `Россия` | `UAE` |
| `Moscow` (as example city) | `Dubai` |
| `Москва` | `Dubai` |
| `Saint Petersburg` / `Санкт-Петербург` | `Abu Dhabi` |
| `+7` (phone prefix) | `+971` |
| `timezone: Europe/Moscow` | `timezone: Asia/Dubai` |

### 1.7 Legal & Compliance Replacements

| Find | Replace With |
|------|-------------|
| `152-ФЗ` / `Federal Law 152-FZ` | `UAE Federal Decree-Law No. 45 of 2021 (PDPL)` |
| `Роскомнадзор` | `UAE TDRA` |
| `ГК РФ` / `Civil Code of Russia` | `UAE Civil Transactions Law (Federal Law No. 5/1985)` |
| `Russian Federation` | `United Arab Emirates` |

### 1.8 Hosting & Infrastructure

| Find | Replace With |
|------|-------------|
| `Hetzner` | `AWS Middle East (Bahrain)` |
| `eu-central` | `me-south-1` |

### Migration script

Save as `scripts/migrate-region.sh`:

```bash
#!/bin/bash
DOCS_DIR="${1:-docs}"
echo "=== Phase 1: Automated Region Migration ==="

find "$DOCS_DIR" -name "*.md" -exec sed -i \
  -e 's|api-staging\.selfstorage\.ru|api-staging.storagecompare.ae|g' \
  -e 's|api\.selfstorage\.ru|api.storagecompare.ae|g' \
  -e 's|cdn\.selfstorage\.ru|cdn.storagecompare.ae|g' \
  -e 's|selfstorage\.ru|storagecompare.ae|g' \
  -e 's|Yandex Maps API (primary) + Google Maps (fallback)|Google Maps API (primary)|g' \
  -e 's|Yandex Maps API (primary)|Google Maps API (primary)|g' \
  -e 's|yandex-maps\.client\.ts|google-maps.client.ts|g' \
  -e 's|Yandex Maps|Google Maps|g' \
  -e 's|Yandex Geocoding|Google Geocoding|g' \
  -e 's|Twilio/SMSC\.ru|Twilio + WhatsApp Business API|g' \
  -e 's|SMSC\.ru|Twilio|g' \
  -e 's|Yookassa|Stripe|g' \
  -e 's|ЮKassa|Stripe|g' \
  -e 's|yookassa|stripe|g' \
  -e 's|₽|AED |g' \
  -e 's| RUB| AED|g' \
  -e 's|ru-RU|en-AE|g' \
  -e 's|Europe/Moscow|Asia/Dubai|g' \
  -e 's|eu-central|me-south-1|g' \
  {} +

echo "=== Validation ==="
echo "Remaining Russian refs:"
grep -rl "selfstorage\.ru\|Yandex Maps\|SMSC\|Yookassa\|ЮKassa" "$DOCS_DIR" 2>/dev/null | wc -l
echo "=== Done ==="
```

---

## PHASE 2: INTELLIGENT DOCUMENT ADAPTATION

### Processing Order

Process documents **by folder** (which corresponds to tier):

```
1. docs/core/        ← First (highest priority)
2. docs/security/
3. docs/features/
4. docs/frontend/
5. docs/infrastructure/
6. docs/legal/       ← Heavy rewrite needed
7. docs/multi-region/
8. docs/operations/
9. docs/data/        ← Last (update CSV/glossary)
```

### Per-Document Checklist

For EACH document:

```
□ 1. Verify Phase 1 replacements applied correctly
□ 2. Replace example data:
     - Russian names → International/Arabic names
     - Russian addresses → Dubai/Abu Dhabi addresses
     - Russian phones (+7 xxx) → UAE phones (+971 xx xxx xxxx)
     - Price examples: 2700 руб → 500 AED
     - Coordinates: Moscow (55.75, 37.61) → Dubai (25.20, 55.27)
□ 3. Check API examples (URLs, request/response bodies)
□ 4. Check config examples (env vars, connection strings)
□ 5. Check legal/compliance sections
□ 6. Update "Out of Scope" sections for UAE context
□ 7. Bump version in document header: add "v2.0 (UAE)"
□ 8. Verify no orphaned Russia-specific references remain
□ 9. Update cross-references if file was renamed/moved
```

### Special Handling

**Legal docs (docs/legal/):** Replace ALL Russian law references:
- 152-FZ → UAE PDPL (Federal Decree-Law No. 45/2021)
- Russian Civil Code → UAE Civil Transactions Law (No. 5/1985)
- Russian Consumer Protection → UAE Consumer Protection Law
- Add DIFC/ADGM data protection for free zones
- Update dispute resolution to UAE courts

**SEO docs (docs/frontend/):** Replace Yandex SEO with Google-only.

**Frontend docs:** Remove Yandex Maps SDK, add Google Maps SDK.
Add RTL preparation for future Arabic support.

**Database docs:** Update phone validation, address format (Building, Street, Area, Emirate), default coordinates.

---

## PHASE 3: CROSS-REFERENCE VALIDATION

After all documents updated:

```bash
# Should return 0:
grep -r "selfstorage\.ru\|Yandex Maps\|SMSC\|Yookassa\|152-ФЗ\|Роскомнадзор\|рубл\|₽" docs/ | wc -l

# Should return results:
grep -r "storagecompare\.ae\|Google Maps\|Stripe\|AED\|PDPL\|Dubai" docs/ | wc -l

# Check cross-references still resolve:
grep -roh "DOC-[0-9]\+" docs/ | sort | uniq -c | sort -rn
```

---

## GIT WORKFLOW

```bash
# Branch per phase
git checkout -b phase-0/organize-docs    # Phase 0
git checkout -b phase-1/automated-replace # Phase 1
git checkout -b phase-2/intelligent-adapt # Phase 2
git checkout -b phase-3/validation        # Phase 3

# Commit after each tier within Phase 2
git commit -m "Phase 2, Tier 1: core specs migrated to UAE"
git commit -m "Phase 2, Tier 2: security specs migrated"
# ... etc
```

---

## NOTES FOR CLAUDE CODE

1. ALWAYS read this CLAUDE.md first before doing anything
2. Start with Phase 0 if docs/ contains unsorted files
3. Process one tier at a time, commit after each
4. Never change document structure or architecture decisions
5. Never invent new features or endpoints
6. Leave `<!-- TODO: REVIEW -->` comments where unsure
7. Preserve Russian refs in "Future" or "Multi-Region" sections as secondary examples
8. When in doubt, ask the human operator
