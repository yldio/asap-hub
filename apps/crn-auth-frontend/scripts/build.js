const { resolve } = require('path');
const { env } = require('process');
const { build } = require('@asap-hub/auth-frontend-scripts');

build(resolve(__dirname, '../build'), {
  ...env,
  PUBLIC_URL:
    env.AUTH_FRONTEND_BASE_URL || 'https://dev.hub.asap.science/.auth/',
});
