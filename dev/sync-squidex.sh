#!/bin/sh

set -x

sq config add asap-hub $SQUIDEX_CLIENT_ID $SQUIDEX_CLIENT_SECRET -u $SQUIDEX_BASE_URL
sq apps create asap-hub
sq sync in /dev/squidex
