# Uses dir passed as argument or default one
backupPath=${1:-"packages/squidex/schema/rules"}

# Replace PLACEHOLDERS with variable available on the CI
find $backupPath \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's/SQUIDEX_SHARED_SECRET/'"$SQUIDEX_SHARED_SECRET"'/' @file

# Replace PLACEHOLDERS with variable available on the CI
find $backupPath \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's#CRN_API_URL#'"$CRN_API_URL"'#' @file
