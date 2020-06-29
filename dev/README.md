# Development environment

`yarn start:backend` starts:

- localstack with AWS SES
- a local instance of squidex
- a mongoDB instance for squidex
- a setup container that creates and sets up the squidex app & data

To verify the email on AWS SES you can run the following script:
`./ses-verify-email.sh`

**Node:** Set `NODE_ENV=production` to use AWS SES live environment.

### Running Squidex in production

When running in production, you'll have to set this variables:

- `CMS_CLIENT_ID`
- `CMS_CLIENT_SECRET`
- `CMS_APP_NAME`
- `CMS_BASE_URL`
