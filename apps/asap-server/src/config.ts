/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  GLOBAL_TOKEN,
  SQUIDEX_SHARED_SECRET,
  LIGHTSTEP_TOKEN,
  ENVIRONMENT,
  REGION,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  ASAP_API_URL,
  GOOGLE_API_TOKEN,
  LOG_LEVEL,
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
export const googleApiUrl = 'https://www.googleapis.com/';
export const region = REGION || 'us-east-1';
export const googleApiCredentialsSecretId =
  GOOGLE_API_CREDENTIALS_SECRET_ID || 'google-api-credentials-dev';
export const googleApiToken = GOOGLE_API_TOKEN || 'asap-google-api-token';
export const asapApiUrl = ASAP_API_URL || 'http://localhost:3333';
export const logLevel = LOG_LEVEL || 'info';
