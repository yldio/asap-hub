const { env } = require('process');
const config = {
  ...env,
  APP_NAME: 'GP2 Hub',
  PUBLIC_URL: env.AUTH_FRONTEND_GP2_BASE_URL || '',
};

module.exports = config;
