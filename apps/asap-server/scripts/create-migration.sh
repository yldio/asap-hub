#!/usr/bin/env bash

input=$1
currentDirectory=$(dirname $0)

if [ -z "$input" ]; then
    echo "Missing argument - migration name"
    exit
fi

timestamp=$(date +%s| cut -b1-13)
migration="$timestamp-$input"

echo "Generating migration $migration..."

cp $currentDirectory/migration.template $currentDirectory/../src/migrations/$migration.ts

echo "Done"
