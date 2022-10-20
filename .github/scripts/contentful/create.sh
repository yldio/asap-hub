#!/usr/bin/env bash

if [[ "ON_BRANCH_ENV" == "False" ]]; then
  echo "No branch Environment required; not deleting environment."
  exit 0
fi

if [[ "$CONTENTFUL_ENV_ID" == "Production" ]]; then
  echo "Target is Production branch; nothing to do."
  exit 0
fi

if [[ "$CONTENTFUL_ENV_ID" == "Development" ]]; then
  echo "Target is Development branch; nothing to do."
  exit 0
fi

STATUS_CODE=$(curl --silent \
                   --request PUT \
                   --output /dev/null \
                   --write-out "%{http_code}" \
                   --header "Authorization: Bearer ${CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}" \
                   --header "Content-Type: application/vnd.contentful.management.v1+json" \
                   --header "X-Contentful-Source-Environment: ${CONTENTFUL_SOURCE_ENV}" \
                   --data-binary '{"name": "'"${CONTENTFUL_ENV_ID}"'"}' \
                   https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENV_ID})

if [[ "$STATUS_CODE" == "201" ]]; then
  echo "Successfully created Environment ${CONTENTFUL_ENV_ID}."
  exit 0
else
  echo "Failed to create Environment ${CONTENTFUL_ENV_ID}."
  echo "Status code was ${STATUS_CODE}."
  exit 1
fi
