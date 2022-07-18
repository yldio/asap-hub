export const appName = process.env.SQUIDEX_APP_NAME || 'asap-local';
export const auth0Audience = process.env.AUTH0_AUDIENCE || '';
export const auth0ClientId = process.env.AUTH0_CLIENT_ID || '';
export const baseUrl = process.env.SQUIDEX_BASE_URL || 'http://localhost:4004';
export const clientId = process.env.SQUIDEX_CLIENT_ID || '';
export const clientSecret = process.env.SQUIDEX_CLIENT_SECRET || '';
export const logEnabled =
  process.env.NODE_ENV === 'production' || process.env.LOG_ENABLED === 'true';
export const logLevel = process.env.LOG_LEVEL || 'info';
export const origin = process.env.APP_ORIGIN || 'https://1433.hub.asap.science';
export const auth0SharedSecret = process.env.AUTH0_SHARED_SECRET || '';
