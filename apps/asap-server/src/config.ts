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
  CURRENT_REVISION,
  SENTRY_DSN,
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_RESEARCH_OUTPUT_INDEX,
  SES_REGION,
  EVENT_BUS,
  EVENT_SOURCE,
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
export const currentRevision = CURRENT_REVISION || 'default';
export const sentryDsn = SENTRY_DSN;
export const algoliaAppId = ALGOLIA_APP_ID || 'LVYWOPQ0A9';
export const algoliaSearchApiKey = ALGOLIA_SEARCH_API_KEY || '';
export const algoliaResearchOutputIndex =
  ALGOLIA_RESEARCH_OUTPUT_INDEX || 'asap-hub_research_outputs_dev';
export const algoliaApiKeyTtl = 36060;
export const sesRegion = SES_REGION || 'eu-west-1';
export const sesSender = `"ASAP Hub" <hub@asap.science>`;
export const eventBus = EVENT_BUS || 'asap-events-dev';
export const eventSource = EVENT_SOURCE || '';
