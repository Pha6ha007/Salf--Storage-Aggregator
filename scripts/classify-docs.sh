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
