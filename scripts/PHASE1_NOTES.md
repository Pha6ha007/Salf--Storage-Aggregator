# Phase 1: Special File Handling Notes

## Files Requiring Special Handling in Phase 2

The following files were processed by Phase 1 automation but require manual review in Phase 2:

### 1. DOC-094_Legal_Operational_Model_Russia_MVP_v1.md
**Location:** `docs/legal/`
**Action:** Will be completely rewritten for UAE in Phase 2
**Reason:** This document is Russia-specific by design and needs full UAE legal framework rewrite
**Phase 1 Status:** Basic automated replacements applied, but document will be replaced entirely

### 2. DOC-107_Competitive_Analysis_Market_Landscape_UAE_v1.md
**Location:** `docs/operations/`
**Action:** SKIP - Already UAE-specific
**Reason:** This document is already written for UAE market
**Phase 1 Status:** Should have minimal or no Russian references

### 3. DOC-108_Competitive_Analysis_Market_Landscape_Kazakhstan_v1.md
**Location:** `docs/operations/`
**Action:** KEEP AS-IS - Reference document for future expansion
**Reason:** This is intentionally Kazakhstan-focused for multi-region expansion reference
**Phase 1 Status:** Should retain Kazakhstan-specific information

---

## Migration Script Details

**Script:** `scripts/migrate-region.sh`

### Folders Processed
- ✅ docs/core/
- ✅ docs/security/
- ✅ docs/features/
- ✅ docs/frontend/
- ✅ docs/infrastructure/
- ✅ docs/legal/
- ✅ docs/multi-region/
- ✅ docs/operations/
- ✅ docs/data/
- ✅ docs/unsorted/
- ❌ docs/archive/ (EXCLUDED)

### Exclusions Applied
```bash
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -type f
```

This ensures archived document versions are protected from modification.

---

## Corrections Applied

### Pre-Phase 1 Corrections
1. ✅ Moved `DOC-059_Multi-Country_Multi-Region_Technical_Architecture` from `docs/core/` to `docs/multi-region/`
2. ✅ Verified migration script processes ALL folders including multi-region/ and operations/
3. ✅ Verified archive/ folder is excluded from processing
4. ✅ Documented special handling requirements for DOC-094, DOC-107, DOC-108

---

## Expected Results

- Files that remain with Russian references after Phase 1 are expected and will be handled in Phase 2
- Files in docs/archive/ should retain original Russian references (not processed)
- DOC-107 (UAE) should already be UAE-focused
- DOC-108 (Kazakhstan) should intentionally retain Kazakhstan references
- DOC-094 (Russia Legal) will receive basic replacements but needs full rewrite in Phase 2
