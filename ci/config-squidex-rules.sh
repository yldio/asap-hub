find dev/squidex/rules -type f \( -name "*.json" -not -name "__rule.json" \) -print0 | xargs -t -0 -I @file \
  sed -i '/sharedSecret/c\    \"sharedSecret\" : \"'$SQUIDEX_SHARED_SECRET'\",' @file

find dev/squidex/rules -type f \( -name "*.json" -not -name "__rule.json" \) -print0 | xargs -t -0 -I @file \
  sed -i -E 's#https?\:\/\/(www\.)?[[:alpha:]|.]+#ASAP_API_URL#' @file
