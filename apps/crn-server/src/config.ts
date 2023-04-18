/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  SQUIDEX_SHARED_SECRET,
  ENVIRONMENT,
  REGION,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  IS_CONTENTFUL_ENABLED,
  IS_CONTENTFUL_ENABLED_V2,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_ENV_ID,
  CONTENTFUL_HOST,
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN,
  CRN_API_URL,
  CRN_MEETING_MATERIALS_DRIVE,
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
  SQUIDEX_CLIENT_ID,
  SQUIDEX_CLIENT_SECRET,
  SQUIDEX_BASE_URL,
  SQUIDEX_APP_NAME,
  EVENT_BRIDGE_ENDPOINT,
  EVENT_BRIDGE_ACCESS_KEY,
  EVENT_BRIDGE_SECRET,
} = process.env;

export const origin = APP_ORIGIN || 'https://dev.hub.asap.science';
export const sesEndpoint = AWS_SES_ENDPOINT;
export const environment = ENVIRONMENT
  ? ENVIRONMENT.toLowerCase()
  : 'development';
export const auth0Audience = AUTH0_AUDIENCE || '';
export const auth0SharedSecret = AUTH0_SHARED_SECRET || '';
export const auth0ClientId = AUTH0_CLIENT_ID || '';
export const squidexSharedSecret =
  SQUIDEX_SHARED_SECRET || 'squidex_shared_secret';
export const googleApiUrl = 'https://www.googleapis.com/';
export const region = REGION || 'us-east-1';
export const googleApiCredentialsSecretId =
  GOOGLE_API_CREDENTIALS_SECRET_ID || 'google-api-credentials-dev';
export const googleApiToken = GOOGLE_API_TOKEN || 'asap-google-api-token';
export const asapApiUrl = CRN_API_URL || 'http://localhost:3333';
export const logLevel = LOG_LEVEL || 'info';
export const logEnabled = NODE_ENV === 'production' || LOG_ENABLED === 'true';
export const currentRevision = CURRENT_REVISION || 'default';
export const sentryDsn = SENTRY_DSN;
export const algoliaAppId = ALGOLIA_APP_ID || 'LVYWOPQ0A9';
export const algoliaApiKey = ALGOLIA_API_KEY || '';
export const algoliaIndex = ALGOLIA_INDEX || 'asap-hub_dev';
export const algoliaApiKeyTtl = 36060; // in [seconds] = 10 hours + 1 min - 1 minute is to account for network delays and off-sync clocks between servers
export const sesRegion = SES_REGION || 'eu-west-1';
export const userInviteSender = EMAIL_SENDER || `"ASAP Hub" <hub@asap.science>`;
export const userInviteBcc = EMAIL_BCC || 'hub.invites.dev@asap.science';
export const userInviteReturn = EMAIL_RETURN || 'hub.invites.dev@asap.science';
export const eventBus = EVENT_BUS || 'asap-events-dev';
export const eventSource = EVENT_SOURCE || '';
export const eventBridgeEndpoint = EVENT_BRIDGE_ENDPOINT;
export const eventBridgeAccessKey = EVENT_BRIDGE_ACCESS_KEY;
export const eventBridgeSecret = EVENT_BRIDGE_SECRET;
export const cloudfrontDistributionId = CLOUDFRONT_DISTRIBUTION_ID || '';
export const baseUrl = SQUIDEX_BASE_URL || 'http://localhost:4004';
export const clientId = SQUIDEX_CLIENT_ID || 'squidex-client-id';
export const clientSecret = SQUIDEX_CLIENT_SECRET || 'squidex-client-secret';
export const appName = SQUIDEX_APP_NAME || 'asap-local';
export const sentryTraceSampleRate = 0.2;
export const contentfulSpaceId = CONTENTFUL_SPACE_ID || 'contentful-space-id';
export const contentfulAccessToken =
  CONTENTFUL_ACCESS_TOKEN || 'contentful-access-token';
export const contentfulManagementAccessToken =
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN || 'contentful-management-access-token';
export const contentfulEnvId = CONTENTFUL_ENV_ID || 'contentful-environment-id';
export const contentfulHost = CONTENTFUL_HOST || 'https://cdn.contentful.com';
export const contentfulWebhookAuthenticationToken =
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN ||
  'contentful-webhook-authentication-token';
export const isContentfulEnabled = IS_CONTENTFUL_ENABLED === 'true' || false;
export const isContentfulEnabledV2 =
  IS_CONTENTFUL_ENABLED_V2 === 'true' || false;
export const crnMeetingMaterialsDrive =
  CRN_MEETING_MATERIALS_DRIVE ||
  'https://drive.google.com/drive/u/0/folders/0AKtA9ScsuPjTUk9PVA?pli=1';
