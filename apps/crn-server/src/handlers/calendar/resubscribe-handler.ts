import { CalendarRawDataObject, FetchCalendarError } from '@asap-hub/model';
import { ScheduledHandlerAsync } from '@asap-hub/server-common';
import { RestCalendar, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { DateTime } from 'luxon';
import { appName, baseUrl } from '../../config';
import CalendarSquidexDataProvider, {
  CalendarDataProvider,
} from '../../data-providers/calendars.data-provider';
import { getAuthToken } from '../../utils/auth';
import getJWTCredentials from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  SubscribeToEventChanges,
  subscribeToEventChangesFactory,
  UnsubscribeFromEventChanges,
  unsubscribeFromEventChangesFactory,
} from './subscribe-handler';

export const resubscribeCalendarsHandlerFactory =
  (
    calendarDataProvider: CalendarDataProvider,
    unsubscribe: UnsubscribeFromEventChanges,
    subscribe: SubscribeToEventChanges,
  ): ScheduledHandlerAsync =>
  async () => {
    const now = DateTime.local();
    const calendarsResult = await calendarDataProvider.fetch({
      maxExpiration: now.plus({ days: 1 }).toMillis(),
      take: 100,
      skip: 0,
    });

    if (
      typeof calendarsResult === 'number' &&
      calendarsResult in FetchCalendarError
    ) {
      logger.error('Error retrieving calendars to resubscribe.');

      return;
    }

    const calendars = calendarsResult as CalendarRawDataObject[];

    const calendarIds = calendars.map((calendar) => calendar.id);
    logger.info(
      { calendarIds },
      `Received the following calendars to resubscribe`,
    );

    await Promise.allSettled(
      calendars.map(async (calendar) => {
        if (calendar.resourceId) {
          try {
            await unsubscribe(calendar.resourceId, calendar.id);
            await calendarDataProvider.update(calendar.id, {
              resourceId: null,
            });
          } catch (error) {
            logger.error(error, 'Error during unsubscribing from the calendar');
          }
        }

        try {
          const { expiration, resourceId } = await subscribe(
            calendar.googleCalendarId,
            calendar.id,
          );

          await calendarDataProvider.update(calendar.id, {
            resourceId,
            expirationDate: expiration,
          });
          logger.info(`Successfully resubscribed the calendar '${calendar.id}`);
        } catch (error) {
          logger.error(error, 'Error during subscribing to the calendar');
        }
      }),
    );
  };
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

export const handler = sentryWrapper(
  resubscribeCalendarsHandlerFactory(
    calendarDataProvider,
    unsubscribeFromEventChangesFactory(getJWTCredentials),
    subscribeToEventChangesFactory(getJWTCredentials),
  ),
);
