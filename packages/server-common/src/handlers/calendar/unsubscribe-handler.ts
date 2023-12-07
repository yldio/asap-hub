import { CalendarDataProvider, gp2 } from '@asap-hub/model';
import { DateTime } from 'luxon';
import { Logger, ScheduledHandlerAsync } from '../../utils';
import { UnsubscribeFromEventChanges } from './subscribe-handler';

const defaultGetCalendarId = (id: string): string => id;

export const unsubscribeCalendarsHandlerFactory =
  (
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    unsubscribe: UnsubscribeFromEventChanges,
    logger: Logger,
    getCalendarId: (id: string) => string = defaultGetCalendarId,
  ): ScheduledHandlerAsync =>
  async () => {
    const now = DateTime.local();
    const { items: calendars } = await calendarDataProvider.fetch({
      maxExpiration: now.plus({ days: 1 }).toMillis(),
    });

    const calendarIds = calendars.map((calendar) => calendar.id);
    logger.info(
      { calendarIds },
      `Received the following calendars to unsubscribe`,
    );

    await Promise.allSettled(
      calendars.map(async (calendar) => {
        if (calendar.resourceId) {
          try {
            await unsubscribe(
              calendar.resourceId,
              calendar.channelId || getCalendarId(calendar.id),
            );
            await calendarDataProvider.update(calendar.id, {
              resourceId: null,
              channelId: null,
              syncToken: null,
              expirationDate: null,
            });
          } catch (error) {
            logger.error(
              error,
              `Error during unsubscribing from the calendar with resourceId ${calendar.resourceId} and CMS id ${calendar.id}`,
            );
          }
        }
      }),
    );
  };
