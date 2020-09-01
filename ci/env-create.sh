#!/usr/bin/env sh

CURPATH=`dirname "$0"`

SLS_STAGE=${SLS_STAGE:-"dev"}
HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}

APP_HOSTNAME=$HOSTNAME
API_HOSTNAME="api.$HOSTNAME"

if [ $SLS_STAGE != "production" ]; then
    API_HOSTNAME="api-${SLS_STAGE}.${APP_HOSTNAME}"
    APP_HOSTNAME="${SLS_STAGE}.${APP_HOSTNAME}"
fi

echo "APP_HOSTNAME=${APP_HOSTNAME}"
echo "API_HOSTNAME=${API_HOSTNAME}"
