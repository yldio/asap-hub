/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  GLOBAL_TOKEN,
  ENVIRONMENT,
  SQUIDEX_APP_NAME,
  SQUIDEX_BASE_URL,
  SQUIDEX_CLIENT_ID,
  SQUIDEX_CLIENT_SECRET,
  SQUIDEX_SHARED_SECRET,
} = process.env;

export const globalToken = GLOBAL_TOKEN || 'change_me_when_we_have_admins';
export const origin = APP_ORIGIN || 'http://localhost:3000';
export const cms = {
  clientId: SQUIDEX_CLIENT_ID || '5eec9b8133e8330001a8aae9',
  clientSecret:
    SQUIDEX_CLIENT_SECRET || 'iwsrcubobxxxrnropuj5k0xe4gjxip42tflvx5pv1a8x',
  appName: SQUIDEX_APP_NAME || 'asap-local',
  baseUrl: SQUIDEX_BASE_URL || 'http://localhost:4004',
};
export const sesEndpoint = AWS_SES_ENDPOINT;
export const environment = (ENVIRONMENT || 'development').toLowerCase();
export const auth0SharedSecret = AUTH0_SHARED_SECRET || 'auth0_shared_secret';
export const squidexSharedSecret =
  SQUIDEX_SHARED_SECRET || 'squidex_shared_secret';
