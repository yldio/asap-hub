# Replace PLACEHOLDERS with variable available on the CI
find packages/squidex/schema/rules \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's/SQUIDEX_SHARED_SECRET/'"$SQUIDEX_SHARED_SECRET"'/' @file

# Replace PLACEHOLDERS with variable available on the CI
find packages/squidex/schema/rules \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's/ASAP_API_URL/'"$ASAP_API_URL"'/' @file
