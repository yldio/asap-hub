import {
  AlertsSentry,
  calendarCreatedHandlerFactory as calendarCreatedSquidexHandlerFactory,
  calendarCreatedContentfulHandlerFactory,
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
  isContentfulEnabledV2,
  region,
} from '../../config';
import { getCalendarDataProvider } from '../../dependencies/calendars.dependencies';
import { getContentfulRestClientFactory } from '../../dependencies/clients.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
const getJWTCredentialsAWS = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const calendarCreatedHandlerFactory = isContentfulEnabledV2
  ? calendarCreatedContentfulHandlerFactory
  : calendarCreatedSquidexHandlerFactory;

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
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(webhookHandler);
