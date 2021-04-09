#!/usr/bin/env bash

input=$1

if [ -z "$input" ]; then
    echo "Missing argument - migration name"
    exit
fi

timestamp=$(date +%s%N | cut -b1-13)
migration="$timestamp-$input"

echo "Generating migration $migration..."

cp ./scripts/migration.template ./src/migrations/$migration.ts

echo "Done"
