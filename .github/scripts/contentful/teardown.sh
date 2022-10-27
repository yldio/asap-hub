#!/usr/bin/env bash

if [[ "$ON_BRANCH_ENV" == "false" ]]; then
  echo "Branch does not have its own Contentful environment; nothing to do."
  exit 0
fi

if [[ "$CONTENTFUL_ENV_ID" == "Production" ]]; then
  echo "Target is Production branch; not deleting."
  exit 0
fi

if [[ "$CONTENTFUL_ENV_ID" == "Development" ]]; then
  echo "Target is Development branch; not deleting."
  exit 0
fi

STATUS_CODE=$(curl --silent \
                   --request DELETE \
                   --output /dev/null \
                   --write-out "%{http_code}" \
                   --header "Authorization: Bearer ${CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}" \
                   https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENV_ID})

if [[ "$STATUS_CODE" == "204" ]]; then
  echo "Successfully requested deletion of Environment ${CONTENTFUL_ENV_ID}."
  exit 0
else
  echo "Failed to request deletion of Environment ${CONTENTFUL_ENV_ID}."
  echo "Status code was ${STATUS_CODE}."
  exit 1
fi
