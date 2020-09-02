#!/usr/bin/env sh

CURPATH=`dirname "$0"`

ENV=${CI_EXTERNAL_PULL_REQUEST_IID:-${SLS_STAGE:-"dev"}}
HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}

APP_HOSTNAME=$HOSTNAME
API_HOSTNAME="api.$HOSTNAME"

if [ $ENV != "production" ]; then
    API_HOSTNAME="api-${ENV}.${APP_HOSTNAME}"
    APP_HOSTNAME="${ENV}.${APP_HOSTNAME}"
fi

echo "APP_HOSTNAME=${APP_HOSTNAME}"
echo "API_HOSTNAME=${API_HOSTNAME}"
