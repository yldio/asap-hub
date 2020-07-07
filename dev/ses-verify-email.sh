#!/bin/bash
set -eo pipefail

EMAIL_ADDRESS=no-reply@hub.asap.science

# Wait for the SES service to be available before executing any post-run scripts
while ! nc -z localhost 4566; do
    echo "Waiting for SES to launch on port 4566..."
    sleep 2
done

echo 'Running AWS verify identity command. See: https://github.com/localstack/localstack/issues/339'
aws ses verify-email-identity --email-address ${EMAIL_ADDRESS} --region us-east-1 --endpoint-url=http://localhost:4566
echo "Verified ${EMAIL_ADDRESS}"
