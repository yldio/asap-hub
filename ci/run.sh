#!/usr/bin/env sh

set -euo pipefail

CURPATH=`dirname "$0"`
STAGE=${SLS_STAGE:-production}


cd $CURPATH

terraform init
if [ -z `terraform workspace list | grep $STAGE` ]; then
    terraform workspace new $STAGE
fi

terraform workspace select $STAGE
terraform plan

cd -
