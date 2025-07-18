/* istanbul ignore file */

const {
  ACTIVE_CAMPAIGN_ACCOUNT,
  ACTIVE_CAMPAIGN_TOKEN,
  ALGOLIA_API_KEY,
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX,
  API_URL,
  APP_ORIGIN,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_SHARED_SECRET,
  AWS_SES_ENDPOINT,
  CLOUDFRONT_DISTRIBUTION_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_ENV_ID,
  CONTENTFUL_HOST,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_POLLER_QUEUE_URL,
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN,
  COOKIE_PREFERENCES_TABLE_NAME,
  CRN_MEETING_MATERIALS_DRIVE,
  CURRENT_REVISION,
  DATA_BUCKET,
  EMAIL_BCC,
  EMAIL_RETURN,
  EMAIL_SENDER,
  ENVIRONMENT,
  EVENT_BRIDGE_ACCESS_KEY,
  EVENT_BRIDGE_ENDPOINT,
  EVENT_BRIDGE_SECRET,
  EVENT_BUS,
  EVENT_SOURCE,
  FILES_BUCKET,
  GOOGLE_API_CREDENTIALS_SECRET_ID,
  GOOGLE_API_TOKEN,
  GOOGLE_CALENDER_EVENT_QUEUE_URL,
  LOG_ENABLED,
  LOG_LEVEL,
  NODE_ENV,
  OPENAI_API_KEY,
  POSTMARK_SERVER_TOKEN,
  REGION,
  SENTRY_DSN,
  SES_REGION,
  QUEUE_URL,
} = process.env;

export const activeCampaignAccount = ACTIVE_CAMPAIGN_ACCOUNT || '';
export const activeCampaignToken = ACTIVE_CAMPAIGN_TOKEN || '';
export const algoliaApiKey = ALGOLIA_API_KEY || '';
export const algoliaApiKeyTtl = 36060; // in [seconds] = 10 hours + 1 min - 1 minute is to account for network delays and off-sync clocks between servers
export const algoliaAppId = ALGOLIA_APP_ID || 'LVYWOPQ0A9';
export const algoliaIndex = ALGOLIA_INDEX || 'asap-hub_dev';
export const appName = 'asap-local';
export const asapApiUrl = API_URL || 'http://localhost:3333';
export const auth0Audience = AUTH0_AUDIENCE || '';
export const auth0ClientId = AUTH0_CLIENT_ID || '';
export const auth0SharedSecret = AUTH0_SHARED_SECRET || '';
export const baseUrl = 'http://localhost:4004';
export const cloudfrontDistributionId = CLOUDFRONT_DISTRIBUTION_ID || '';
export const contentfulAccessToken =
  CONTENTFUL_ACCESS_TOKEN || 'contentful-access-token';
export const contentfulEnvId = CONTENTFUL_ENV_ID || 'contentful-environment-id';
export const contentfulHost = CONTENTFUL_HOST || 'https://cdn.contentful.com';
export const contentfulManagementAccessToken =
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN || 'contentful-management-access-token';
export const contentfulPreviewAccessToken =
  CONTENTFUL_PREVIEW_ACCESS_TOKEN || 'contentful-preview-access-token';
export const contentfulSpaceId = CONTENTFUL_SPACE_ID || 'contentful-space-id';
export const contentfulPollerQueueUrl =
  CONTENTFUL_POLLER_QUEUE_URL || 'contentful-poller-queue-url';
export const contentfulWebhookAuthenticationToken =
  CONTENTFUL_WEBHOOK_AUTHENTICATION_TOKEN ||
  'contentful-webhook-authentication-token';
export const cookiePreferencesTableName =
  COOKIE_PREFERENCES_TABLE_NAME || 'asap-hub-dev-cookie-preferences';
export const crnMeetingMaterialsDrive =
  CRN_MEETING_MATERIALS_DRIVE ||
  'https://drive.google.com/drive/u/0/folders/0AKtA9ScsuPjTUk9PVA?pli=1';
export const currentRevision = CURRENT_REVISION || 'default';
export const environment = ENVIRONMENT
  ? ENVIRONMENT.toLowerCase()
  : 'development';
export const eventBridgeAccessKey = EVENT_BRIDGE_ACCESS_KEY || '';
export const eventBridgeEndpoint = EVENT_BRIDGE_ENDPOINT;
export const eventBridgeSecret = EVENT_BRIDGE_SECRET || '';
export const eventBus = EVENT_BUS || 'asap-events-dev';

export const eventSource = EVENT_SOURCE || '';

export const filesBucket = FILES_BUCKET || 'asap-hub-dev-files';
export const dataBucket = DATA_BUCKET || 'asap-hub-dev-data-backup';

export const googleApiCredentialsSecretId =
  GOOGLE_API_CREDENTIALS_SECRET_ID || 'google-api-credentials-dev';
export const googleApiToken = GOOGLE_API_TOKEN || 'asap-google-api-token';
export const googleCalenderEventQueueUrl =
  GOOGLE_CALENDER_EVENT_QUEUE_URL || 'google-calendar-event-queue-url';
export const logEnabled = NODE_ENV === 'production' || LOG_ENABLED === 'true';
export const logLevel = LOG_LEVEL || 'info';
export const openaiApiKey = OPENAI_API_KEY || 'test-key';
export const origin = APP_ORIGIN || 'https://dev.hub.asap.science';
export const postmarkServerToken = POSTMARK_SERVER_TOKEN || 'test-token';
export const region = REGION || 'us-east-1';
export const sentryDsn = SENTRY_DSN;
export const sentryTraceSampleRate = 0.2;
export const sesEndpoint = AWS_SES_ENDPOINT;
export const sesRegion = SES_REGION || 'eu-west-1';
export const userInviteBcc = EMAIL_BCC || 'hub.invites.dev@asap.science';
export const userInviteReturn = EMAIL_RETURN || 'hub.invites.dev@asap.science';
export const userInviteSender = EMAIL_SENDER || `"ASAP Hub" <hub@asap.science>`;
export const inviteUserQueueUrl = QUEUE_URL || '';
