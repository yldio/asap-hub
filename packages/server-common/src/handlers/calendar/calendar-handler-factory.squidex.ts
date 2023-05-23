import { CalendarDataProvider, CalendarEvent, gp2 } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import 'source-map-support/register';

import { Alerts, Logger } from '../../utils';
import { validateBody } from '../../validation/calendar-handler.squidex.validation';
import { CalendarPayload } from '../event-bus';
import {
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from './subscribe-handler';

export const calendarCreatedSquidexHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
  ) =>
  async (
    event: EventBridgeEvent<CalendarEvent, CalendarPayload>,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const { type: eventType, payload } = validateBody(event.detail as never);

    logger.info(
      `Received a '${eventType}' event for the calendar ${payload.id}`,
    );

    logger.debug(`Event payload: ${JSON.stringify(payload)}`);
    if (eventType === 'CalendarsUpdated') {
      if (
        !payload.dataOld ||
        !payload.dataOld.googleCalendarId ||
        payload.dataOld.googleCalendarId.iv === payload.data.googleCalendarId.iv
      ) {
        return 'OK';
      }

      const result = await calendarDataProvider.fetchById(payload.id);

      if (!result) {
        logger.error('Failed to retrieve calendar by ID.');

        return 'OK';
      }

      const { version } = result;

      if (version > (payload.version as number)) {
        logger.warn(
          `version received (${payload.version}) is older than current version: ${version}`,
        );
        return 'OK';
      }

      if (payload.dataOld.resourceId) {
        try {
          await unsubscribe(payload.dataOld.resourceId?.iv, payload.id);

          await calendarDataProvider.update(payload.id, {
            resourceId: null,
          });
        } catch (error) {
          logger.error(error, 'Error during unsubscribing from the calendar');
          alerts.error(error);
        }
      }
    }

    if (payload.data.googleCalendarId.iv === '') {
      return 'OK';
    }

    if (['CalendarsCreated', 'CalendarsUpdated'].includes(eventType)) {
      try {
        const { resourceId, expiration } = await subscribe(
          payload.data.googleCalendarId.iv,
          payload.id,
        );

        await calendarDataProvider.update(payload.id, {
          resourceId,
          expirationDate: expiration,
        });
      } catch (error) {
        logger.error(error, 'Error subscribing to the calendar');
        alerts.error(error);

        throw error;
      }

      return 'OK';
    }

    return 'OK';
  };
