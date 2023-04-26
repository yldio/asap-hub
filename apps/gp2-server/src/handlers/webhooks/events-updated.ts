/* istanbul ignore file */
import {
  getJWTCredentialsFactory,
  syncCalendarFactory,
  syncEventFactory,
  webhookEventUpdatedHandlerFactory,
} from '@asap-hub/server-common';
import {
  InputCalendar,
  RestCalendar,
  RestEvent,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { Handler } from 'aws-lambda';
import {
  appName,
  baseUrl,
  googleApiCredentialsSecretId,
  googleApiToken,
  region,
} from '../../config';
import Events from '../../controllers/event.controller';
import { CalendarSquidexDataProvider } from '../../data-providers/calendar.data-provider';
import { EventSquidexDataProvider } from '../../data-providers/event.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
  appName,
  baseUrl,
});
const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
  getAuthToken,
  'calendars',
  { appName, baseUrl },
);
const calendarDataProvider = new CalendarSquidexDataProvider(
  calendarRestClient,
  squidexGraphqlClient,
);
const eventDataProvider = new EventSquidexDataProvider(
  eventRestClient,
  squidexGraphqlClient,
);
const eventController = new Events(eventDataProvider);
const syncCalendar = syncCalendarFactory(
  syncEventFactory(eventController, logger),
  getJWTCredentials,
  logger,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedHandlerFactory(
    calendarDataProvider,
    syncCalendar,
    logger,
    { googleApiToken },
  ),
);
