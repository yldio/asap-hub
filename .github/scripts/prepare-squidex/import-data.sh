#!/usr/bin/env sh

# Set this envvar to true in GitLab if you want to print the sq sync logs on success for debugging
PRINT_SYNC_LOGS_ON_SUCCESS="${PRINT_SYNC_LOGS_ON_SUCCESS:-false}"
# SEt this envvar to true in GitLab if you want the squidex app to be recreated on every commit
RECREATE_APP_ON_EVERY_PR="${RECREATE_APP_ON_EVERY_PR:-false}"

# Render whitespace properly
IFS=

echo 'Importing data...'

if [ "$RECREATE_APP_ON_EVERY_PR" = true ] || [ "$FIRST_RUN" = true ]; then
    # create-app.py configures sq to new app
    export SQ_SYNC_OUTPUT="$(sq sync in backup)"
    if echo "$SQ_SYNC_OUTPUT" | grep -q -i -E 'warn|error|fail|exception'; then
        echo "Data import failure - sq sync in backup failed:"
        echo $SQ_SYNC_OUTPUT
        unset SQ_SYNC_OUTPUT
        unset IFS
        exit 1
    fi
else
    echo 'Skipping app creation and data import'
fi

# Print successful sq sync output if option enabled above
if [ "$PRINT_SYNC_LOGS_ON_SUCCESS" = true ]; then
    echo "---------------------------------------------"
    echo "sq sync in backup successful output:"
    echo $SQ_SYNC_OUTPUT
    echo "---------------------------------------------"
fi

# Cleanup
unset SQ_SYNC_OUTPUT
unset IFS

echo 'Import successful'
