/* istanbul ignore file */

const {
  APP_ORIGIN,
  AUTH0_CLIENT_ID,
  AUTH0_SHARED_SECRET,
  ENVIRONMENT,
  EVENT_BUS,
  EVENT_SOURCE,
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
} = process.env;

export const appName = SQUIDEX_APP_NAME || 'asap-local';
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
