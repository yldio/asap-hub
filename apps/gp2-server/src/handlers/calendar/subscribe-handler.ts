import {
  AlertsSentry,
  calendarCreatedHandlerFactory,
  getJWTCredentialsFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import { RestCalendar, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import * as Sentry from '@sentry/serverless';
import 'source-map-support/register';
import {
  appName,
  asapApiUrl,
  baseUrl,
  googleApiCredentialsSecretId,
  googleApiToken,
  googleApiUrl,
  region,
} from '../../config';
import { CalendarSquidexDataProvider } from '../../data-providers/calendar.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const calendarRestClient = new SquidexRest<RestCalendar>(
  getAuthToken,
  'calendars',
  { appName, baseUrl },
);
const calendarDataProvider = new CalendarSquidexDataProvider(
  calendarRestClient,
  squidexGraphqlClient,
);
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
  calendarDataProvider,
  new AlertsSentry(Sentry.captureException.bind(Sentry)),
  logger,
);

export const handler = sentryWrapper(webhookHandler);
