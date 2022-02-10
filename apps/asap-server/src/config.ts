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
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX,
  SES_REGION,
  EVENT_BUS,
  EVENT_SOURCE,
  EMAIL_SENDER,
  EMAIL_BCC,
  EMAIL_RETURN,
  CLOUDFRONT_DISTRIBUTION_ID,
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
export const algoliaApiKey = ALGOLIA_API_KEY || '';
export const algoliaIndex = ALGOLIA_INDEX || 'asap-hub_research_outputs_dev';
export const algoliaApiKeyTtl = 36060; // in [seconds] = 10 hours + 1 min - 1 minute is to account for network delays and off-sync clocks between servers
export const sesRegion = SES_REGION || 'eu-west-1';
export const userInviteSender = EMAIL_SENDER || `"ASAP Hub" <hub@asap.science>`;
export const userInviteBcc = EMAIL_BCC || 'hub.invites.dev@asap.science';
export const userInviteReturn = EMAIL_RETURN || 'hub.invites.dev@asap.science';
export const eventBus = EVENT_BUS || 'asap-events-dev';
export const eventSource = EVENT_SOURCE || '';
export const cloudfrontDistributionId = CLOUDFRONT_DISTRIBUTION_ID || '';
