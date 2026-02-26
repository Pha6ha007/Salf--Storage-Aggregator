#!/bin/bash
# Phase 1: Automated Region Migration (Russia → UAE)
# Usage: Run from project root
# Excludes: docs/archive/ folder

DOCS_DIR="${1:-docs}"
echo "=== Phase 1: Automated Region Migration ==="
echo "Processing: $DOCS_DIR"
echo "Excluding: $DOCS_DIR/archive/"
echo ""

# Counter for modified files
MODIFIED_COUNT=0

# Find all markdown files excluding archive folder
FILES=$(find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -type f)

for file in $FILES; do
  # Create backup flag
  CHANGES_MADE=0

  # Apply all replacements with sed -i
  # Note: macOS sed requires empty string after -i for in-place editing
  sed -i '' \
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
    "$file" 2>/dev/null && MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
done

echo "Files processed: $(echo "$FILES" | wc -l | tr -d ' ')"
echo "Files modified: $MODIFIED_COUNT"
echo ""

echo "=== Validation ==="
echo "Remaining Russian references:"
echo ""

# Check for remaining problematic patterns
echo "Domain references:"
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -exec grep -l "selfstorage\.ru" {} \; 2>/dev/null | wc -l | xargs echo "  selfstorage.ru:"

echo "Map provider references:"
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -exec grep -l "Yandex Maps" {} \; 2>/dev/null | wc -l | xargs echo "  Yandex Maps:"

echo "SMS provider references:"
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -exec grep -l "SMSC" {} \; 2>/dev/null | wc -l | xargs echo "  SMSC:"

echo "Payment provider references:"
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -exec grep -l "Yookassa\|ЮKassa" {} \; 2>/dev/null | wc -l | xargs echo "  Yookassa:"

echo "Currency references:"
find "$DOCS_DIR" -name "*.md" -not -path "*/archive/*" -exec grep -l "₽\| RUB" {} \; 2>/dev/null | wc -l | xargs echo "  RUB/₽:"

echo ""
echo "=== Done ==="
