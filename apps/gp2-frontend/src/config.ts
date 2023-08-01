export const GTM_CONTAINER_ID = process.env.REACT_APP_GTM_CONTAINER_ID;
export const API_BASE_URL =
  process.env.REACT_APP_GP2_API_BASE_URL || 'http://localhost:4444';
export const ALGOLIA_APP_ID =
  process.env.REACT_APP_GP2_ALGOLIA_APP_ID || 'R44097HEU2';
export const ALGOLIA_INDEX =
  process.env.REACT_APP_GP2_ALGOLIA_INDEX || 'gp2-hub_dev';
export const SENTRY_DSN = process.env.REACT_APP_GP2_SENTRY_DSN;
export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'local';
export const RELEASE = process.env.REACT_APP_RELEASE;
export const AUTH0_AUDIENCE = process.env.REACT_APP_GP2_AUTH0_AUDIENCE || '';
export const AUTH0_CLIENT_ID = process.env.REACT_APP_GP2_AUTH0_CLIENT_ID || '';
export const AUTH0_DOMAIN = process.env.REACT_APP_GP2_AUTH0_DOMAIN || '';
