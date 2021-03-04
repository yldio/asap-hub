import { DateTime, Duration } from 'luxon';
import Calendars, { CalendarController } from '../../controllers/calendars';
import {
  UnsubscribeFromEventChanges,
  SubscribeToEventChanges,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '../webhooks/webhook-calendar-created';
import getJWTCredentials from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import { ScheduledHandlerAsync } from '../../utils/types';

export const resubscribeCalendarsHandlerFactory = (
  calendarController: CalendarController,
  unsubscribe: UnsubscribeFromEventChanges,
  subscribe: SubscribeToEventChanges,
): ScheduledHandlerAsync => async () => {
  const now = DateTime.local();
  const duration24h = Duration.fromObject({ day: 1 });
  const calendars = await calendarController.fetchRaw({
    maxExpiration: now.plus(duration24h).toMillis(),
    take: 100,
    skip: 0,
  });

  const calendarIds = calendars.map((calendar) => calendar.id);
  logger(`Received the following calendars to resubscribe: %o`, calendarIds);

  await Promise.allSettled(
    calendars.map(async (calendar) => {
      if (calendar.resourceId) {
        try {
          await unsubscribe(calendar.resourceId, calendar.id);
          calendarController.update(calendar.id, {
            resourceId: null,
          });
        } catch (error) {
          logger('Error during unsubscribing from the calendar: %o', error);
        }
      }

      try {
        const { expiration, resourceId } = await subscribe(
          calendar.googleCalendarId,
          calendar.id,
        );

        await calendarController.update(calendar.id, {
          resourceId,
          expirationDate: expiration,
        });
        logger(`Successfully resubscribed the calendar '${calendar.id}`);
      } catch (error) {
        logger('Error during subscribing to the calendar: %o', error);
      }
    }),
  );
};

export const handler = resubscribeCalendarsHandlerFactory(
  new Calendars(),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
  subscribeToEventChangesFactory(getJWTCredentials),
);
