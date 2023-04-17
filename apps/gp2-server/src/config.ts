/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_CLIENT_ID,
  AUTH0_SHARED_SECRET,
  GP2_API_URL,
  GP2_CONTENTFUL_ENABLED,
  GP2_CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENV_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_HOST,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  ENVIRONMENT,
  REGION,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  EVENT_BUS,
  EVENT_SOURCE,
  GOOGLE_API_TOKEN,
  LOG_LEVEL,
  LOG_ENABLED,
  NODE_ENV,
  CURRENT_REVISION,
  SENTRY_DSN,
  SES_REGION,
  EMAIL_SENDER,
  EMAIL_BCC,
  EMAIL_RETURN,
  SQUIDEX_APP_NAME,
  SQUIDEX_BASE_URL,
  SQUIDEX_CLIENT_ID,
  SQUIDEX_CLIENT_SECRET,
  SQUIDEX_SHARED_SECRET,
  AUTH0_AUDIENCE,
  CLOUDFRONT_DISTRIBUTION_ID,
} = process.env;

export const cloudfrontDistributionId = CLOUDFRONT_DISTRIBUTION_ID || '';
export const appName = SQUIDEX_APP_NAME || 'asap-local';
export const asapApiUrl = GP2_API_URL || 'http://localhost:3333';
export const googleApiUrl = 'https://www.googleapis.com/';
export const region = REGION || 'us-east-1';
export const googleApiCredentialsSecretId =
  GOOGLE_API_CREDENTIALS_SECRET_ID || 'google-api-credentials-dev';
export const googleApiToken = GOOGLE_API_TOKEN || 'asap-google-api-token';
export const auth0ClientId = AUTH0_CLIENT_ID || '';
export const auth0Audience =
  process.env.GP2_AUTH0_AUDIENCE || AUTH0_AUDIENCE || '';
export const baseUrl = SQUIDEX_BASE_URL || 'http://localhost:4004';
export const clientId = SQUIDEX_CLIENT_ID || '';
export const clientSecret = SQUIDEX_CLIENT_SECRET || '';
export const currentRevision = CURRENT_REVISION || 'default';
export const environment = ENVIRONMENT
  ? ENVIRONMENT.toLowerCase()
  : 'development';
export const eventBus = EVENT_BUS || 'asap-events-dev';
export const eventSource = EVENT_SOURCE || '';
export const logEnabled = NODE_ENV === 'production' || LOG_ENABLED === 'true';
export const logLevel = LOG_LEVEL || 'info';
export const origin = APP_ORIGIN || 'https://dev.gp2.asap.science';
export const auth0SharedSecret = AUTH0_SHARED_SECRET || '';
export const sentryDsn = SENTRY_DSN;
export const sesRegion = SES_REGION || 'eu-west-1';
export const squidexSharedSecret =
  SQUIDEX_SHARED_SECRET || 'squidex_shared_secret';
export const userInviteSender = EMAIL_SENDER || `"GP2 Hub" <gp2@asap.science>`;
export const userInviteBcc = EMAIL_BCC || 'gp2.invites.dev@asap.science';
export const userInviteReturn = EMAIL_RETURN || 'gp2.invites.dev@asap.science';
export const sentryTraceSampleRate = 1.0;
export const isContentfulEnabled = GP2_CONTENTFUL_ENABLED === 'true' || false;
export const contentfulAccessToken =
  CONTENTFUL_ACCESS_TOKEN || 'contentful-access-token';
export const contentfulManagementAccessToken =
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN || 'contentful-management-access-token';
export const contentfulEnvId = CONTENTFUL_ENV_ID || 'Development';
export const contentfulHost = CONTENTFUL_HOST || 'https://cdn.contentful.com';
export const contentfulSpaceId =
  GP2_CONTENTFUL_SPACE_ID || 'contentful-space-id';
