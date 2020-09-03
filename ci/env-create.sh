#!/usr/bin/env sh

HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}
if [ ! -z $CI_EXTERNAL_PULL_REQUEST_IID ]; then
    ENV=${CI_EXTERNAL_PULL_REQUEST_IID}
    echo API_HOSTNAME="api-${ENV}.${HOSTNAME}"
    echo APP_HOSTNAME="${ENV}.${HOSTNAME}"
fi
