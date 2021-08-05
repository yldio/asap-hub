#!/usr/bin/env sh

# create-app.py configures sq to new app
if sq sync in backup | grep -q -E 'warn|error|fail'; then
    echo "Data import failure: sq sync in backup failed"
    exit 1
fi

# apply schema changes on top of dev backup
if sq sync in packages/squidex/schema -t schemas --delete | grep -q -E 'warn|error|fail'; then
    echo "Data import failure: sq sync in packages/squidex/schema -t schemas --delete failed"
    exit 1
fi 