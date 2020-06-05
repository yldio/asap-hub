# Development environment

`yarn start:backend` starts:

- localstack with AWS SES
- a mongodb database

To verify the email on AWS SES you can run the following script:
`./ses-verify-email.sh`

To run mongodb migrations run:
`yarn workspace @asap-hub/users-service migrate up`

**Node:** Set `NODE_ENV=production` to use AWS SES live environment.
