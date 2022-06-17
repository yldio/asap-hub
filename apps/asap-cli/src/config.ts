/* istanbul ignore file */

const { APP_ORIGIN } = process.env;

export const origin = APP_ORIGIN || 'https://hub.asap.science';
export const asapFromEmail = 'no-reply@hub.asap.science';
export const grantsFromEmail = 'grants@parkinsonsroadmap.org';
export const baseUrl = process.env.SQUIDEX_BASE_URL || 'http://localhost:4004';
export const clientId = process.env.SQUIDEX_CLIENT_ID || 'squidex-client-id';
export const clientSecret =
  process.env.SQUIDEX_CLIENT_SECRET || 'squidex-client-secret';
export const appName = process.env.SQUIDEX_APP_NAME || 'asap-local';
