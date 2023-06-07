/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_SHARED_SECRET,
  CLOUDFRONT_DISTRIBUTION_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_ENV_ID,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  CONTENTFUL_HOST,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN,
  CURRENT_REVISION,
  EMAIL_BCC,
  EMAIL_RETURN,
  EMAIL_SENDER,
  ENVIRONMENT,
  EVENT_BUS,
  EVENT_SOURCE,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  GOOGLE_API_TOKEN,
  GP2_API_URL,
  GP2_CONTENTFUL_ENABLED,
  LOG_ENABLED,
  LOG_LEVEL,
  NODE_ENV,
  REGION,
  SENTRY_DSN,
  SES_REGION,
  SQUIDEX_APP_NAME,
  SQUIDEX_BASE_URL,
  SQUIDEX_CLIENT_ID,
  SQUIDEX_CLIENT_SECRET,
  SQUIDEX_SHARED_SECRET,
} = process.env;

export const appName = SQUIDEX_APP_NAME || 'asap-local';
export const asapApiUrl = GP2_API_URL || 'http://localhost:3333';
export const auth0Audience =
  process.env.GP2_AUTH0_AUDIENCE || AUTH0_AUDIENCE || '';
export const auth0ClientId = AUTH0_CLIENT_ID || '';
export const auth0SharedSecret = AUTH0_SHARED_SECRET || '';
export const baseUrl = SQUIDEX_BASE_URL || 'http://localhost:4004';
export const clientId = SQUIDEX_CLIENT_ID || '';
export const clientSecret = SQUIDEX_CLIENT_SECRET || '';
export const cloudfrontDistributionId = CLOUDFRONT_DISTRIBUTION_ID || '';
export const contentfulAccessToken =
  CONTENTFUL_ACCESS_TOKEN || 'contentful-access-token';
export const contentfulPreviewAccessToken =
  CONTENTFUL_PREVIEW_ACCESS_TOKEN || 'contentful-access-token-preview';
export const contentfulEnvId = CONTENTFUL_ENV_ID || 'Development';
export const contentfulHost = CONTENTFUL_HOST || 'https://cdn.contentful.com';
export const contentfulManagementAccessToken =
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN || 'contentful-management-access-token';
export const contentfulSpaceId = CONTENTFUL_SPACE_ID || 'contentful-space-id';
export const contentfulWebhookAuthenticationToken =
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN ||
  'contentful-webhook-authentication-token';
export const currentRevision = CURRENT_REVISION || 'default';
export const environment = ENVIRONMENT
  ? ENVIRONMENT.toLowerCase()
  : 'development';
export const eventBus = EVENT_BUS || 'asap-events-dev';
export const eventSource = EVENT_SOURCE || '';
export const googleApiCredentialsSecretId =
  GOOGLE_API_CREDENTIALS_SECRET_ID || 'google-api-credentials-dev';
export const googleApiToken = GOOGLE_API_TOKEN || 'asap-google-api-token';
export const googleApiUrl = 'https://www.googleapis.com/';
export const isContentfulEnabled = GP2_CONTENTFUL_ENABLED === 'true' || false;
export const logEnabled = NODE_ENV === 'production' || LOG_ENABLED === 'true';
export const logLevel = LOG_LEVEL || 'info';
export const origin = APP_ORIGIN || 'https://dev.gp2.asap.science';
export const region = REGION || 'us-east-1';
export const sentryDsn = SENTRY_DSN;
export const sentryTraceSampleRate = 1.0;
export const sesRegion = SES_REGION || 'eu-west-1';
export const squidexSharedSecret =
  SQUIDEX_SHARED_SECRET || 'squidex_shared_secret';
export const userInviteBcc = EMAIL_BCC || 'gp2.invites.dev@asap.science';
export const userInviteReturn = EMAIL_RETURN || 'gp2.invites.dev@asap.science';
export const userInviteSender = EMAIL_SENDER || `"GP2 Hub" <gp2@asap.science>`;
