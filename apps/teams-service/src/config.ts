/* istanbul ignore file */

const {
  GLOBAL_TOKEN,
  APP_ORIGIN,
  NODE_ENV,
  CMS_BASE_URL,
  CMS_APP_NAME,
  CMS_CLIENT_ID,
  CMS_CLIENT_SECRET,
} = process.env;

export const globalToken = GLOBAL_TOKEN || 'change_me_when_we_have_admins';
export const origin = APP_ORIGIN || 'http://localhost:3000';
export const cms = {
  clientId: CMS_CLIENT_ID || '5eec9b8133e8330001a8aae9',
  clientSecret:
    CMS_CLIENT_SECRET || 'iwsrcubobxxxrnropuj5k0xe4gjxip42tflvx5pv1a8x',
  appName: CMS_APP_NAME || 'asap-local',
  baseUrl:
    NODE_ENV !== 'production'
      ? CMS_BASE_URL || 'http://localhost:4004'
      : CMS_BASE_URL || 'https://cloud.squidex.io',
};
export const sesEndpoint =
  NODE_ENV !== 'production' ? 'http://localhost:4566' : undefined;
