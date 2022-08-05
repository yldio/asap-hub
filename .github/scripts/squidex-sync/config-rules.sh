# Uses dir passed as argument or default one
rulesPath=${1:-"packages/squidex/schema/crn/rules"}

# Replace PLACEHOLDERS with variable available on the CI
find $rulesPath \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's/SQUIDEX_SHARED_SECRET/'"$SQUIDEX_SHARED_SECRET"'/' @file

find $rulesPath \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's#CRN_API_URL#'"$CRN_API_URL"'#' @file

find $rulesPath \
  -type f \( -name "*.json" -not -name "__rule.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's#GP2_API_URL#'"$GP2_API_URL"'#' @file
