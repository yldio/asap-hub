import {
  AlertsSentry,
  calendarCreatedContentfulHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import 'source-map-support/register';
import {
  asapApiUrl,
  contentfulEnvId,
  contentfulSpaceId,
  contentfulAccessToken,
  googleApiCredentialsSecretId,
  googleApiToken,
  googleApiUrl,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { getCalendarSubscriptionId } from '../../utils/get-calendar-subscription-id';

/* istanbul ignore next */
const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

/* istanbul ignore next */
export const webhookHandler = calendarCreatedContentfulHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentialsAWS, logger, {
    asapApiUrl,
    googleApiToken,
    googleApiUrl,
  }),
  unsubscribeFromEventChangesFactory(getJWTCredentialsAWS, logger, {
    googleApiUrl,
  }),
  getCalendarDataProvider(),
  new AlertsSentry(Sentry.captureException.bind(Sentry)),
  logger,
  {
    environment: contentfulEnvId,
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
  },
  getCalendarSubscriptionId,
);

export const handler = sentryWrapper(webhookHandler);
