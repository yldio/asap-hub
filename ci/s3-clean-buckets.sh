#!/usr/bin/env sh

# use this script if you need to clean up feature environments

aws s3 ls | awk '{print $3}' | grep '^asap-hub-[[:digit:]]' | xargs -I % aws s3 rb s3://% --force

