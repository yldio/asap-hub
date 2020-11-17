/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  GLOBAL_TOKEN,
  SQUIDEX_SHARED_SECRET,
  LIGHTSTEP_TOKEN,
  ENVIRONMENT,
} = process.env;

export const globalToken = GLOBAL_TOKEN || 'change_me_when_we_have_admins';
export const origin = APP_ORIGIN || 'http://localhost:3000';
export const sesEndpoint = AWS_SES_ENDPOINT;
export const lightstepToken = LIGHTSTEP_TOKEN;
export const environment = ENVIRONMENT
  ? ENVIRONMENT.toLowerCase()
  : 'development';
export const auth0SharedSecret = AUTH0_SHARED_SECRET || 'auth0_shared_secret';
export const squidexSharedSecret =
  SQUIDEX_SHARED_SECRET || 'squidex_shared_secret';
