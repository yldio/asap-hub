#!/usr/bin/env sh

# create-app.py configures sq to new app
#Replace below line with sq sync in backup 2>&1 | tee sq-sync-log.txt
echo "FAIL: example failure" | tee sq-sync-log.txt
if grep -q -i -E 'warn|error|fail|exception' sq-sync-log.txt; then
    echo "Data import failure: sq sync in backup failed"
    rm sq-sync-log.txt
    exit 1
fi

# apply schema changes on top of dev backup
sq sync in packages/squidex/schema -t schemas --delete 2>&1 | tee sq-sync-schema-log.txt
if grep -q -i -E 'warn|error|fail|exception' sq-sync-schema-log.txt; then
    echo "Data import failure: sq sync in packages/squidex/schema -t schemas --delete failed"
    rm sq-sync-schema-log.txt
    exit 1
fi 

# Delete log files
rm sq-sync-log.txt
rm sq-sync-schema-log.txt