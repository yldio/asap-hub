#!/bin/sh
set -e

export SQUIDEX_TOKEN=$(curl -s --request POST --url $SQUIDEX_BASE_URL/identity-server/connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data grant_type=client_credentials --data client_id=$SQUIDEX_CLIENT_ID --data client_secret=$SQUIDEX_CLIENT_SECRET --data scope=squidex-api | grep 'access_token' | sed "s/.*\"access_token\": \"\([^\"]*\).*/\1/g")
echo "Downloading schema..."
yarn workspace @asap-hub/asap-server run graphql-codegen --config codegen.yml
echo "Downloaded. Cleaning up the output..."
yarn run prettier --write ./apps/asap-server/src/gql/*
echo "Done."
