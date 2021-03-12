import { DateTime } from 'luxon';
import { Logger } from 'winston';
import Calendars, { CalendarController } from '../../controllers/calendars';
import {
  UnsubscribeFromEventChanges,
  SubscribeToEventChanges,
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '../webhooks/webhook-calendar-created';
import getJWTCredentials from '../../utils/aws-secret-manager';
import { loggerFactory } from '../../utils/logger';
import { ScheduledHandlerAsync } from '../../utils/types';

export const resubscribeCalendarsHandlerFactory = (
  calendarController: CalendarController,
  unsubscribe: UnsubscribeFromEventChanges,
  subscribe: SubscribeToEventChanges,
  logger: Logger,
): ScheduledHandlerAsync => async () => {
  const now = DateTime.local();
  const calendars = await calendarController.fetchRaw({
    maxExpiration: now.plus({ days: 1 }).toMillis(),
    take: 100,
    skip: 0,
  });

  const calendarIds = calendars.map((calendar) => calendar.id);
  logger.info(
    `Received the following calendars to resubscribe: %o`,
    calendarIds,
  );

  await Promise.allSettled(
    calendars.map(async (calendar) => {
      if (calendar.resourceId) {
        try {
          await unsubscribe(calendar.resourceId, calendar.id);
          calendarController.update(calendar.id, {
            resourceId: null,
          });
        } catch (error) {
          logger.error(
            'Error during unsubscribing from the calendar: %o',
            error,
          );
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
        logger.info(`Successfully resubscribed the calendar '${calendar.id}`);
      } catch (error) {
        logger.error('Error during subscribing to the calendar: %o', error);
      }
    }),
  );
};

const logger = loggerFactory();

export const handler = resubscribeCalendarsHandlerFactory(
  new Calendars(logger),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
  subscribeToEventChangesFactory(getJWTCredentials),
  logger,
);
