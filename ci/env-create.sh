#!/usr/bin/env sh

CURPATH=`dirname "$0"`

STAGE=${CI_COMMIT_REF_SLUG:-"development"}
HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}

APP_HOSTNAME=$HOSTNAME
API_HOSTNAME="api.$HOSTNAME"

if [ $STAGE != "master" ]; then
    API_HOSTNAME="api-${STAGE}.${APP_HOSTNAME}"
    APP_HOSTNAME="${STAGE}.${APP_HOSTNAME}"
fi

echo "APP_HOSTNAME=${APP_HOSTNAME}"
echo "API_HOSTNAME=${API_HOSTNAME}"
