# PHASE 2.5 OPTIMIZED: Rewrite vs Translate Decision

## Analysis

After checking all 124 files with Cyrillic, they fall into 4 categories:

---

## CATEGORY 1: DELETE (duplicates — don't waste time translating)

These files exist in TWO copies. Delete the non-canonical version immediately.

| Delete (archive) | Keep | Reason |
|-------------------|------|--------|
| `Booking_Flow_Technical_Specification.md` (501KB) | `DOC-023_Booking_Flow_Technical_Specification.md` (366KB) | DOC-023 is canonical |
| `backend_implementation_plan_mvp_v1_CANONICAL.md` (55KB) | `DOC-022_Backend_implementation_plan_mvp_v1_CANONICAL.md` (34KB) | DOC-022 is canonical |
| `backend_implementation_plan_mvp_v1_CANONICAL__1_.md` (35KB) | ↑ same | Duplicate |
| `CRM_Lead_Management_System_MVP_v1_CANONICAL__1_.md` (32KB) | `CRM_Lead_Management_System_MVP_v1_CANONICAL_.md` (26KB) | Keep cleaner name |
| `API_Detailed_Specification__MVP_v1__-_COMPLETE.md` (92KB) | `API_Detailed_Specification_MVP_v1_COMPLETE.md` (83KB) | Keep clean filename |
| `Technical_Architecture_Document_MVP_v1_REVISED.md` (50KB) | `Technical_Architecture_Document_MVP_v1_CANONICAL.md` (49KB) | CANONICAL wins |
| `security_and_compliance_plan_mvp_v1.md` (104KB) | `DOC-078_Security_and_Compliance_Plan_MVP_v1_CANONICAL_REVISED.md` (57KB) | DOC-078 is canonical |
| `SLO_SLA_SLI_Definitions_MVP_v1.md` (39KB) | `DOC-083_SLO_SLA_SLI_Definitions_MVP_v1.md` (38KB) | DOC-083 is canonical |
| `support_maintenance_playbook_v1_1.md` (33KB) | `DOC-084_Support_maintenance_playbook_v1_1.md` (33KB) | DOC-084 is canonical |
| `team_engineering_process_guidelines_mvp_v1_1.md` (30KB) | `DOC-085_Team_engineering_process_guidelines_mvp_v1_1.md` (29KB) | DOC-085 is canonical |
| `User_Operator_Documentation_MVP_v1.md` (29KB) | `DOC-087_User_Operator_Documentation_MVP_v1.md` (29KB) | DOC-087 is canonical |
| `release_management_versioning_strategy_v1_1.md` (29KB) | `DOC-074_Release_management_versioning_strategy_v1_1.md` (29KB) | DOC-074 is canonical |
| `Backup_and_Restore_Operational_Playbook_v1_1.md` (38KB) | `DOC-103_Backup_and_Restore_Operational_Playbook_v1_1.md` (38KB) | DOC-103 is canonical |

**Savings: ~13 files deleted → ~13,000 Cyrillic lines eliminated instantly**

```bash
mkdir -p docs/archive/phase25_duplicates
mv "Booking_Flow_Technical_Specification.md" docs/archive/phase25_duplicates/
mv "backend_implementation_plan_mvp_v1_CANONICAL.md" docs/archive/phase25_duplicates/
mv "backend_implementation_plan_mvp_v1_CANONICAL__1_.md" docs/archive/phase25_duplicates/
mv "CRM_Lead_Management_System_MVP_v1_CANONICAL__1_.md" docs/archive/phase25_duplicates/
mv "API_Detailed_Specification__MVP_v1__-_COMPLETE.md" docs/archive/phase25_duplicates/
mv "Technical_Architecture_Document_MVP_v1_REVISED.md" docs/archive/phase25_duplicates/
mv "security_and_compliance_plan_mvp_v1.md" docs/archive/phase25_duplicates/
mv "SLO_SLA_SLI_Definitions_MVP_v1.md" docs/archive/phase25_duplicates/
mv "support_maintenance_playbook_v1_1.md" docs/archive/phase25_duplicates/
mv "team_engineering_process_guidelines_mvp_v1_1.md" docs/archive/phase25_duplicates/
mv "User_Operator_Documentation_MVP_v1.md" docs/archive/phase25_duplicates/
mv "release_management_versioning_strategy_v1_1.md" docs/archive/phase25_duplicates/
mv "Backup_and_Restore_Operational_Playbook_v1_1.md" docs/archive/phase25_duplicates/
```

---

## CATEGORY 2: REWRITE from scratch (40%+ Russian, faster to regenerate)

These files are essentially Russian documents. Translating line-by-line 
would take hours and produce awkward "translationese". 
Faster and better to REGENERATE in clean English using core specs as source.

| File | Size | % Russian | Why rewrite |
|------|------|-----------|------------|
| **DOC-096_Operator_Onboarding_Specification** | 513KB, 11,514 lines | 46% | Massive. Russian section headers, Russian prose. 125K words. Regenerate from Functional Spec + API spec. Keep same structure, write in English. |
| **DOC-070_Pricing_Monetization_Strategy** | 219KB, 5,246 lines | 58% | Business strategy doc. Still has ₽ pricing. Rewrite with UAE pricing (AED), UAE market data from DOC-107. |
| **DOC-060_Operator_Agreement** | 73KB, 799 lines | 55% | Legal agreement. Russian law references throughout. Must be rewritten for UAE jurisdiction anyway (like DOC-094 was). |
| **DOC-045_Feature_Roadmap_Release_Phases** | 58KB, 1,429 lines | 52% | Roadmap with Russian section headers and descriptions. Rewrite with UAE-first roadmap. |
| **Architecture_review_checklist** | 90KB, 2,543 lines | 41% | Checklist document. Regenerate clean English version — checklists are easy to regenerate. |
| **Admin_Panel_UX_Specification** | 89KB, 1,974 lines | 33% | UI spec with Russian labels. Rewrite all UI strings in English. |

**How to rewrite:**

For each file, give Claude Code this instruction:
```
Read [FILENAME]. This file is 40-58% Russian text.
DO NOT translate line by line — instead:
1. Read the ENTIRE document to understand its structure and content
2. Create a NEW version in clean English that covers the same topics
3. Keep the same section structure / headings
4. Replace all Russian examples with UAE examples
5. Replace all Russian legal refs with UAE legal refs
6. Replace all prices with AED
7. Keep all technical details (API endpoints, state machines, data models) exact
8. The new document should read as if it was originally written in English
9. Save as the SAME filename (overwrite)
```

**Time estimate: 2-3 hours total (vs 5+ hours translating)**

---

## CATEGORY 3: TRANSLATE (< 30% Russian, structured, mostly English)

These files are primarily English with Russian text scattered in 
JSON examples, table cells, error messages. Line-by-line translation works fine.

### Core Specs (MUST translate carefully — canonical source of truth)
| File | Cyrillic lines | What needs translation |
|------|---------------|----------------------|
| Functional_Specification_MVP_v1_CORRECTED.md | 103 | Table cells, example data |
| Technical_Architecture_Document_MVP_v1_CANONICAL.md | 142 | Config examples, descriptions |
| API_Detailed_Specification_MVP_v1_COMPLETE.md | 305 | JSON examples, error messages |
| api_design_blueprint_mvp_v1_CANONICAL.md | 183 | JSON examples, descriptions |
| full_database_specification_mvp_v1_CANONICAL.md | 144 | Comments, example data |
| DOC-022_Backend_implementation_plan_mvp_v1_CANONICAL.md | 210 | Code comments, config |
| DOC-101_Internal_Admin_API_Specification_MVP_v1.md | 296 | JSON examples |

### Feature & Infra Specs (translate scattered Russian)
| File | Cyrillic lines | What needs translation |
|------|---------------|----------------------|
| Frontend_Architecture_Specification_v1_5_FINAL.md | 2000 | Component labels, comments — borderline rewrite |
| DOC-023_Booking_Flow_Technical_Specification.md | 2580 | JSON examples, flow descriptions — borderline rewrite |
| Data_Governance_DQ_Specification_COMPLETE.md | 1468 | Field descriptions, rules |
| Operator_Dashboard_Deep_Specification_v1_0_FINAL.md | 1261 | UI labels, descriptions |
| frontend_implementation_plan_mvp_v1_AUDITED.md | 906 | Task descriptions, comments |
| Analytics_Metrics_Tracking_Specification_MVP_v1_1.md | 754 | Metric descriptions, examples |
| Logging_Strategy_CANONICAL_Contract_v2.md | 605 | Log format examples |
| incident_response_plan_mvp_v1_FULL.md | 682 | Runbook steps |
| DOC-039_Deployment_Runbook_MVP_v1_1_REVISED.md | 619 | Steps, commands |
| DOC-067_Performance_Load_Testing_Plan_MVP_v1_COMPLETE.md | 512 | Test scenarios |
| DOC-007_AI_Chat_Assistant_MVP_v1_HARDENED.md | 393 | Prompt examples |
| Legal_Documentation_Unified_Guide_MVP_v1.md | 387 | Legal terms |
| DOC-063_Operator_Experience_OX_Deep_Specification.md | 385 | UI labels |

**BORDERLINE: Frontend Architecture (2000 lines) and DOC-023 Booking (2580 lines)**
These have 19-21% Russian. Could go either way. 
Recommendation: TRY translate first. If too messy → rewrite.

---

## CATEGORY 4: QUICK PASS (< 100 Cyrillic lines, ~55 files)

Just find-and-replace Russian strings. Most are:
- Error message strings in code examples
- Russian table cell values
- Scattered metadata (Автор, Версия)

Claude Code can batch these: "Find all Cyrillic in these 10 files and translate to English."

**Time: 1-1.5 hours total**

---

## RECOMMENDED EXECUTION ORDER

| Step | Action | Files | Est. Time | Cyrillic eliminated |
|------|--------|-------|-----------|-------------------|
| **0** | Delete duplicates | 13 | 5 min | ~13,000 lines |
| **1** | Rewrite DOC-096 (Onboarding) | 1 | 40 min | 5,361 lines |
| **2** | Rewrite DOC-070 (Pricing) | 1 | 30 min | 3,061 lines |
| **3** | Translate Core Specs (Batch B) | 7 | 30 min | ~1,400 lines |
| **4** | Rewrite DOC-060 (Agreement) | 1 | 20 min | 442 lines |
| **5** | Rewrite DOC-045 (Roadmap) | 1 | 20 min | 754 lines |
| **6** | Rewrite Architecture Checklist | 1 | 15 min | 1,049 lines |
| **7** | Rewrite Admin Panel UX | 1 | 20 min | 662 lines |
| **8** | Translate medium files | 13 | 1.5 hours | ~8,000 lines |
| **9** | Quick pass light files | 55 | 1 hour | ~3,000 lines |
| **10** | Final verification | — | 15 min | — |
| | **TOTAL** | **~95** | **~5 hours** | **~35,000 lines** |

---

## COMMANDS FOR CLAUDE CODE

### Step 0: Delete duplicates
```
Read PHASE_2_5_OPTIMIZED.md. Execute the duplicate cleanup in Category 1. 
Move all listed duplicates to docs/archive/phase25_duplicates/.
Commit: "Phase 2.5 Step 0: archive 13 duplicate files"
```

### Steps 1-2: Rewrite heavy files
```
Read DOC-096_Operator_Onboarding_Specification_COMPLETE.md completely.
This file is 46% Russian. DO NOT translate line-by-line.
Instead, rewrite the ENTIRE document in clean English:
- Keep the same 11-section structure
- Keep all technical details (API endpoints, state machines, validation rules)
- Replace Russian examples with UAE examples (per PHASE_2_5 translation rules)
- Replace ИНН/ОГРН with TRN/Trade License
- Replace Russian legal with UAE legal
- All UI strings in English
- The document should read as if originally written in English
Save as same filename.
Commit: "Phase 2.5 Step 1: rewrite DOC-096 Onboarding in English"
```

(Repeat for DOC-070, DOC-060, DOC-045, Architecture Checklist, Admin Panel)

### Step 3: Translate core specs
```
Translate all remaining Cyrillic text in these core specification files:
- Functional_Specification_MVP_v1_CORRECTED.md
- Technical_Architecture_Document_MVP_v1_CANONICAL.md  
- API_Detailed_Specification_MVP_v1_COMPLETE.md
- api_design_blueprint_mvp_v1_CANONICAL.md
- full_database_specification_mvp_v1_CANONICAL.md
- DOC-022_Backend_implementation_plan_mvp_v1_CANONICAL.md
- DOC-101_Internal_Admin_API_Specification_MVP_v1.md

For each file: find every line with Cyrillic characters and translate 
the Russian text to English. Keep all code, JSON, markdown structure intact.
Commit: "Phase 2.5 Step 3: translate core specs to English"
```

### Steps 8-9: Batch remaining files
```
List all remaining files with Cyrillic text (excluding archive/ and DOC-108).
For each file, find all lines with Russian text and translate to English.
Process in batches of 10 files. Commit after each batch.
```

### Step 10: Final verification
```
grep -rl "[а-яА-ЯёЁ]" docs/ --include="*.md" | grep -v archive/ | grep -v DOC-108
# Should return 0 files (or only DOC-108 Kazakhstan)
```

---

## COMPLETION CRITERIA

✅ Zero Cyrillic in all docs (except archive/ and DOC-108)
✅ All JSON examples have English strings
✅ All section headers in English  
✅ All UI labels in English
✅ All error messages in English
✅ All example data uses UAE names/addresses/phones
✅ 13 duplicate files archived
✅ INDEX.md updated
