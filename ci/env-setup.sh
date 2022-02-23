#!/usr/bin/env sh

ASAP_HOSTNAME=${ASAP_HOSTNAME:-"hub.asap.science"}
if [ ! -z $CI_EXTERNAL_PULL_REQUEST_IID ]; then
    export ASAP_API_URL="https://api-${CI_EXTERNAL_PULL_REQUEST_IID}.${ASAP_HOSTNAME}"
    export ASAP_APP_URL="https://${CI_EXTERNAL_PULL_REQUEST_IID}.${ASAP_HOSTNAME}"
    export ALGOLIA_INDEX="asap-hub_CI-${CI_EXTERNAL_PULL_REQUEST_IID}"
fi
