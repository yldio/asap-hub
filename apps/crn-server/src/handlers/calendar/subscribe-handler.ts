import {
  AlertsSentry,
  calendarCreatedHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import 'source-map-support/register';
import {
  asapApiUrl,
  googleApiCredentialsSecretId,
  googleApiToken,
  googleApiUrl,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
const webhookHandler = calendarCreatedHandlerFactory(
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
);

export const handler = sentryWrapper(webhookHandler);
