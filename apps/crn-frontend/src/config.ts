export const GTM_CONTAINER_ID = import.meta.env.VITE_APP_CRN_GTM_CONTAINER_ID;
export const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3333';
export const ALGOLIA_APP_ID =
  import.meta.env.VITE_APP_CRN_ALGOLIA_APP_ID || 'LVYWOPQ0A9';
export const ALGOLIA_INDEX =
  import.meta.env.VITE_APP_CRN_ALGOLIA_INDEX || 'asap-hub_dev';
export const ANALYTICS_ALGOLIA_INDEX =
  import.meta.env.VITE_APP_CRN_ANALYTICS_ALGOLIA_INDEX ||
  'asap-hub-analytics_dev';
export const SENTRY_DSN = import.meta.env.VITE_APP_CRN_SENTRY_DSN;
export const ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || 'local';
export const RELEASE = import.meta.env.VITE_APP_RELEASE;
export const AUTH0_AUDIENCE = import.meta.env.VITE_APP_CRN_AUTH0_AUDIENCE || '';
export const AUTH0_CLIENT_ID =
  import.meta.env.VITE_APP_CRN_AUTH0_CLIENT_ID || '';
export const AUTH0_DOMAIN = import.meta.env.VITE_APP_CRN_AUTH0_DOMAIN || '';
