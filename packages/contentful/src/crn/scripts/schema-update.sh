#!/bin/bash -e

echo "Generating migration..."
contentful space generate migration -s $CONTENTFUL_SPACE_ID -e $CONTENTFUL_ENV_ID -c $1 -f $2

echo "Downloading schema..."
yarn run graphql-codegen --config codegen.yml

