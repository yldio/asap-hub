#!/bin/bash
OWNER=yldio
REPO=asap-hub

# list workflows
gh api -X GET /repos/$OWNER/$REPO/actions/workflows | jq '.workflows[] | .name,.id,.path'
