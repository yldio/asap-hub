#!/bin/sh
set -e

TOKEN=$(curl -s --request POST --url $SQUIDEX_BASE_URL/identity-server/connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data grant_type=client_credentials --data client_id=$SQUIDEX_CLIENT_ID --data client_secret=$SQUIDEX_CLIENT_SECRET --data scope=squidex-api | grep 'access_token' | sed -r 's/^[^:]*:(.*)$/\1/' | tr -d '"')
echo "Downloading schema..."
yarn workspace @asap-hub/asap-server run apollo service:download --header "Authorization: Bearer $TOKEN" --endpoint "https://cloud.squidex.io/api/content/$SQUIDEX_APP_NAME/graphql" ../../packages/squidex/graphql-schema/schema.json
echo "Downloaded. Cleaning up the output..."
yarn run prettier --write ./packages/squidex/graphql-schema/schema.json
echo "Done."
