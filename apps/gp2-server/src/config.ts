export const clientId = process.env.SQUIDEX_CLIENT_ID;
export const clientSecret = process.env.SQUIDEX_CLIENT_SECRET;
export const appName = process.env.SQUIDEX_APP_NAME || 'asap-local';
export const baseUrl = process.env.SQUIDEX_BASE_URL || 'http://localhost:4004';
export const origin = process.env.APP_ORIGIN || 'https://dev.gp2.asap.science';
export const logLevel = process.env.LOG_LEVEL || 'info';
export const logEnabled =
  process.env.NODE_ENV === 'production' || process.env.LOG_ENABLED === 'true';
