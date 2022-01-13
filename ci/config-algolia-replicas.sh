# Uses dir passed as argument or default one
backupPath=${1:-"./ci"}

# Replace PLACEHOLDERS with variable available on the CI
find $backupPath \
  -type f \( -name "algolia-schema.json" \) \
  -print0 | xargs -t -0 -I @file \
  sed -i 's/ALGOLIA_RESEARCH_OUTPUT_INDEX_REPLICA/'"$ALGOLIA_RESEARCH_OUTPUT_INDEX_REPLICA"'/' @file

