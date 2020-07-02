#!/usr/bin/env sh

CURPATH=`dirname "$0"`

STAGE=${CI_COMMIT_REF_SLUG:-"master"}
HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}

APP_ORIGIN=$HOSTNAME
API_ORIGIN="api.$HOSTNAME"

if [ $STAGE != "master" ]; then
    API_ORIGIN="api-${STAGE}.${APP_ORIGIN}"
    APP_ORIGIN="${STAGE}.${APP_ORIGIN}"
fi

echo "APP_ORIGIN=${APP_ORIGIN}"
echo "API_ORIGIN=${API_ORIGIN}"
