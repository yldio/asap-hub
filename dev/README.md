# Development environment

`yarn start:squidex` starts:

- a local instance of squidex
- a mongoDB instance for squidex

Local Squidex is available at http://localhost:4004

> **Dont use Google Chrome**. Since don't use https locally Chrome will fail the auth flow

**Email**: admin@squidex.io
**Password**: SuperS3cure?

You don't need to configure the app to run against the local environment.
It's configured to do so by default.

### Running Squidex in production

When running in production, you'll have to set this variables:

- `SQUIDEX_CLIENT_ID`
- `SQUIDEX_CLIENT_SECRET`
- `SQUIDEX_APP_NAME`
- `SQUIDEX_BASE_URL`
