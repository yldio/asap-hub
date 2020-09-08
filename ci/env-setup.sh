#!/usr/bin/env sh

HOSTNAME=${BASE_HOSTNAME:-"hub.asap.science"}
if [ ! -z $CI_EXTERNAL_PULL_REQUEST_IID ]; then
    export ASAP_API_URL="https://api-${CI_EXTERNAL_PULL_REQUEST_IID}.${BASE_HOSTNAME}"
    export ASAP_APP_URL="https://${CI_EXTERNAL_PULL_REQUEST_IID}.${BASE_HOSTNAME}"
fi
