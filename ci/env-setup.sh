#!/usr/bin/env sh

ASAP_HOSTNAME=${ASAP_HOSTNAME:-"hub.asap.science"}
    export ASAP_API_URL="https://api-${CI_EXTERNAL_PULL_REQUEST_IID}.${ASAP_HOSTNAME}"
    export ASAP_APP_URL="https://${CI_EXTERNAL_PULL_REQUEST_IID}.${ASAP_HOSTNAME}"
    export ALGOLIA_INDEX="asap-hub_research_outputs_CI-${CI_EXTERNAL_PULL_REQUEST_IID}"
