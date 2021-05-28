/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  SQUIDEX_SHARED_SECRET,
  LIGHTSTEP_TOKEN,
  ENVIRONMENT,
  REGION,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  ASAP_API_URL,
  GOOGLE_API_TOKEN,
  LOG_LEVEL,
  LOG_ENABLED,
  NODE_ENV,
} = process.env;

export const origin = APP_ORIGIN || 'https://dev.hub.asap.science';
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
export const logEnabled = NODE_ENV === 'production' || LOG_ENABLED === 'true';
