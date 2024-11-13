export const GTM_CONTAINER_ID = import.meta.env.VITE_APP_GP2_GTM_CONTAINER_ID;
export const API_BASE_URL =
  import.meta.env.VITE_APP_GP2_API_BASE_URL || 'http://localhost:4444';
export const ALGOLIA_APP_ID =
  import.meta.env.VITE_APP_GP2_ALGOLIA_APP_ID || 'R44097HEU2';
export const ALGOLIA_INDEX =
  import.meta.env.VITE_APP_GP2_ALGOLIA_INDEX || 'gp2-hub_dev';
export const SENTRY_DSN = import.meta.env.VITE_APP_GP2_SENTRY_DSN;
export const ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || 'local';
export const RELEASE = import.meta.env.VITE_APP_RELEASE;
export const AUTH0_AUDIENCE = import.meta.env.VITE_APP_GP2_AUTH0_AUDIENCE || '';
export const AUTH0_CLIENT_ID =
  import.meta.env.VITE_APP_GP2_AUTH0_CLIENT_ID || '';
export const AUTH0_DOMAIN = import.meta.env.VITE_APP_GP2_AUTH0_DOMAIN || '';
export const COOKIE_CONSENT_NAME =
  import.meta.env.VITE_APP_GP2_COOKIE_CONSENT_NAME || 'gp2-cookie-consent';
