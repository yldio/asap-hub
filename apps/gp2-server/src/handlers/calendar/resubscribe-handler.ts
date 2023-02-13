import {
  getJWTCredentialsFactory,
  resubscribeCalendarsHandlerFactory,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '@asap-hub/server-common';
import { RestCalendar, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
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
const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});
export const handler = sentryWrapper(
  resubscribeCalendarsHandlerFactory(
    calendarDataProvider,
    unsubscribeFromEventChangesFactory(getJWTCredentials, logger, {
      googleApiUrl,
    }),
    subscribeToEventChangesFactory(getJWTCredentials, logger, {
      asapApiUrl,
      googleApiToken,
      googleApiUrl,
    }),
    logger,
  ),
);
