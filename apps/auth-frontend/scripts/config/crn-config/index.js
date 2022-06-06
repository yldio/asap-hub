const { env } = require('process');
const config = {
  ...env,
  APP_NAME: 'ASAP Hub',
  PUBLIC_URL: env.AUTH_FRONTEND_BASE_URL || '',
};

module.exports = config;
