#!/bin/bash
OWNER=yldio
REPO=asap-hub

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"
echo $1 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $1 provided"

WORKFLOW_ID=$1

# delete runs (you'll have to run this multiple times if there's many because of pagination)
gh api -X GET /repos/$OWNER/$REPO/actions/workflows/$WORKFLOW_ID/runs | jq '.workflow_runs[] | .id' | xargs -n1 -I % gh api --silent -X DELETE /repos/$OWNER/$REPO/actions/runs/%
