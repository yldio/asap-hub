#!/usr/bin/env sh

set -euo pipefail

CURPATH=`dirname "$0"`
STAGE=${SLS_STAGE:-production}

cd $CURPATH

terraform init
if [ `terraform workspace list | grep -ac "${STAGE}" || true` -eq 0 ]; then
    terraform workspace new "$STAGE";
fi

terraform workspace select $STAGE
terraform apply -auto-approve

AWS_ACM_CERTIFICATE_ARN=`terraform output aws_acm_certificate_arn`

cd -
echo "AWS_ACM_CERTIFICATE_ARN=$AWS_ACM_CERTIFICATE_ARN" > .env
