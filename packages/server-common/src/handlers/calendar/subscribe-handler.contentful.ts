import { Environment } from '@asap-hub/contentful';
import { CalendarDataProvider, CalendarEvent, gp2 } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import 'source-map-support/register';
import { Alerts, Logger } from '../../utils';
import { validateBody } from '../../validation/subscribe-handler.contentful.validation';
import { CalendarContentfulPayload } from '../event-bus';
import {
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from './subscribe-handler';

export const calendarCreatedContentfulHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
    getContentfulRestClientFactory: () => Promise<Environment>,
  ) =>
  async (
    event: EventBridgeEvent<CalendarEvent, CalendarContentfulPayload>,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const eventType = event['detail-type'];
    const {
      fields,
      sys,
      resourceId: eventId,
    } = validateBody(event.detail as never);

    logger.info(`Received a '${eventType}' event for the calendar ${eventId}`);

    logger.debug(`Event payload: ${JSON.stringify(fields)}`);

    if (eventType === 'CalendarsPublished') {
      // sys.revision > 1 means is an update not a create event
      if (sys.revision > 1) {
        const environment = await getContentfulRestClientFactory();

        const entry = await environment.getEntry(eventId);
        const snapshots = await entry.getSnapshots();

        if (snapshots.items.length > 1) {
          const lastButOne = snapshots.items[1]?.snapshot.fields;

          if (
            !lastButOne ||
            !lastButOne.googleCalendarId['en-US'] ||
            lastButOne.googleCalendarId['en-US'] ===
              fields.googleCalendarId['en-US']
          ) {
            return 'OK';
          }

          const result = await calendarDataProvider.fetchById(eventId);

          if (!result) {
            logger.error('Failed to retrieve calendar by ID.');

            return 'OK';
          }

          const { version } = result;

          if (version > sys.revision) {
            logger.warn(
              `version received (${sys.revision}) is older than current version: ${version}`,
            );
            return 'OK';
          }

          if (lastButOne.resourceId) {
            try {
              await unsubscribe(lastButOne.resourceId['en-US'], eventId);

              await calendarDataProvider.update(eventId, {
                resourceId: null,
              });
            } catch (error) {
              logger.error(
                error,
                'Error during unsubscribing from the calendar',
              );
              alerts.error(error);
            }
          }
        }
      }

      if (fields.googleCalendarId['en-US'] === '') {
        return 'OK';
      }

      try {
        const { resourceId, expiration } = await subscribe(
          fields.googleCalendarId['en-US'],
          eventId,
        );

        await calendarDataProvider.update(eventId, {
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
