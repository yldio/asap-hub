#!/usr/bin/env bash
set -e

echo "Generating queries..."
yarn workspace @asap-hub/asap-server run apollo codegen:generate --localSchemaFile=../../packages/squidex/graphql-schema/schema.json --target=typescript --tagName=gql --includes=./src/queries/* --passthroughCustomScalars
echo "Generated. Cleaning up the output..."
yarn run prettier --write ./apps/asap-server/src/queries/*
echo "Done."
