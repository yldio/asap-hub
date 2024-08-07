#!/bin/bash -e

if [[ "$APP" == "gp2" ]]
then
  CONTENTFUL_SPACE_ID=${CONTENTFUL_SPACE_ID:-$GP2_CONTENTFUL_SPACE_ID}
  CONTENTFUL_ENV_ID=${CONTENTFUL_ENV_ID:-$GP2_CONTENTFUL_ENV_ID}
  CONTENTFUL_ACCESS_TOKEN=${CONTENTFUL_ACCESS_TOKEN:-$GP2_CONTENTFUL_ACCESS_TOKEN}
else
  CONTENTFUL_SPACE_ID=${CONTENTFUL_SPACE_ID:-$CRN_CONTENTFUL_SPACE_ID}
  CONTENTFUL_ENV_ID=${CONTENTFUL_ENV_ID:-$CRN_CONTENTFUL_ENV_ID}
  CONTENTFUL_ACCESS_TOKEN=${CONTENTFUL_ACCESS_TOKEN:-$CRN_CONTENTFUL_ACCESS_TOKEN}
  APP="crn"
fi


APP=$APP CONTENTFUL_SPACE_ID=$CONTENTFUL_SPACE_ID CONTENTFUL_ENV_ID=$CONTENTFUL_ENV_ID CONTENTFUL_ACCESS_TOKEN=$CONTENTFUL_ACCESS_TOKEN yarn workspace @asap-hub/contentful schema:update:$APP

