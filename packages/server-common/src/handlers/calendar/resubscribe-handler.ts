import { CalendarDataProvider, gp2 } from '@asap-hub/model';
import { DateTime } from 'luxon';
import { Logger, ScheduledHandlerAsync } from '../../utils';
import {
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from './subscribe-handler';

const defaultGetCalendarId = (id: string): string => id;

export const resubscribeCalendarsHandlerFactory =
  (
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    unsubscribe: UnsubscribeFromEventChanges,
    subscribe: SubscribeToEventChanges,
    logger: Logger,
    getCalendarIdFunction?: (id: string) => string,
  ): ScheduledHandlerAsync =>
  async () => {
    const now = DateTime.local();
    const { items: calendars } = await calendarDataProvider.fetch({
      maxExpiration: now.plus({ days: 1 }).toMillis(),
    });
    const getCalendarId = getCalendarIdFunction || defaultGetCalendarId;

    const calendarIds = calendars.map((calendar) => calendar.id);
    logger.info(
      { calendarIds },
      `Received the following calendars to resubscribe`,
    );

    await Promise.allSettled(
      calendars.map(async (calendar) => {
        if (calendar.resourceId) {
          try {
            await unsubscribe(calendar.resourceId, getCalendarId(calendar.id));
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
            getCalendarId(calendar.id),
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
