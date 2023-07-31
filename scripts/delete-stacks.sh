#!/bin/bash

echo "Deleting stack for PR $PR"

re='^[0-9]+$'
if ! [[ $PR =~ $re ]] ; then
   echo "error: PR is not a number" >&2; exit 1
fi

echo "Removing buckets for GP2 Stack..."
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://gp2-hub-$PR-messages-static --recursive
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://gp2-hub-$PR-gp2-frontend --recursive
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://gp2-hub-$PR-gp2-auth-frontend --recursive

GP2_SLS_BUCKET=$(aws-vault exec $AWS_VAULT_PROFILE -- aws cloudformation describe-stack-resource --stack-name=gp2-hub-$PR --logical-resource-id=ServerlessDeploymentBucket | jq .StackResourceDetail.PhysicalResourceId -r)
if [ -z "$GP2_SLS_BUCKET" ]
then
    echo "No Serverless bucket found"
else
    echo "Removing Serverless bucket '$GP2_SLS_BUCKET'"
    aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://$GP2_SLS_BUCKET --recursive
fi
echo "Deleting stack 'gp2-hub-$PR'"
aws-vault exec $AWS_VAULT_PROFILE -- aws cloudformation delete-stack --stack-name=gp2-hub-$PR --region=us-east-1
echo "Deleted"

echo "Removing buckets for CRN Stack..."
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://asap-hub-$PR-messages-static --recursive
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://asap-hub-$PR-frontend --recursive
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://asap-hub-$PR-auth-frontend --recursive
aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://asap-hub-$PR-storybook --recursive

CRN_SLS_BUCKET=$(aws-vault exec $AWS_VAULT_PROFILE -- aws cloudformation describe-stack-resource --stack-name=asap-hub-$PR --logical-resource-id=ServerlessDeploymentBucket | jq .StackResourceDetail.PhysicalResourceId -r)
if [ -z "$CRN_SLS_BUCKET" ]
then
    echo "No Serverless bucket found"
else
    echo "Removing Serverless bucket '$CRN_SLS_BUCKET'"
    aws-vault exec $AWS_VAULT_PROFILE -- aws s3 rm s3://$CRN_SLS_BUCKET --recursive
fi
echo "Deleting stack 'asap-hub-$PR'"
aws-vault exec $AWS_VAULT_PROFILE -- aws cloudformation delete-stack --stack-name=asap-hub-$PR --region=us-east-1
echo "Deleted"
