#!/bin/bash
# list workflows
gh api -X GET /repos/{owner}/{repo}/actions/workflows | jq '.workflows[] | .name,.id,.path'
