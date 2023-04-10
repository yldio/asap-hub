import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  CalendarDataProvider,
  CalendarEvent,
  gp2,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import 'source-map-support/register';
import { Alerts, Logger } from '../../utils';
import { validateBody } from '../../validation/subscribe-handler.contentful.validation';
import {
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from './subscribe-handler';

export const calendarCreatedHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
  ) =>
  async (
    event: EventBridgeEvent<
      CalendarEvent,
      WebhookDetail<ContentfulWebhookPayload<'calendars'>>
    >,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const {
      fields,
      resourceId: calendarId,
      sys: { revision },
    } = validateBody(event.detail as never);

    const eventType = event['detail-type'];

    logger.info(
      `Received a '${eventType}' event for the calendar ${calendarId}`,
    );

    logger.debug(`Event payload: ${JSON.stringify(event.detail)}`);

    const result = await calendarDataProvider.fetchById(calendarId);

    if (!result) {
      logger.error('Failed to retrieve calendar by ID.');

      return 'OK';
    }

    const { version } = result;

    if (version > revision) {
      logger.warn(
        `version received (${revision}) is older than current version: ${version}`,
      );
      return 'OK';
    }

    if (
      result.resourceId &&
      fields.resourceId &&
      fields.resourceId['en-US'] &&
      result.resourceId !== fields.resourceId['en-US']
    ) {
      try {
        await unsubscribe(result.resourceId, calendarId);

        await calendarDataProvider.update(calendarId, {
          resourceId: null,
        });
      } catch (error) {
        logger.error(error, 'Error during unsubscribing from the calendar');
        alerts.error(error);
      }
    }

    if (fields.googleCalendarId['en-US'] === '') {
      return 'OK';
    }

    if (['CalendarsCreated', 'CalendarsUpdated'].includes(eventType)) {
      try {
        const { resourceId, expiration } = await subscribe(
          fields.googleCalendarId['en-US'],
          calendarId,
        );

        await calendarDataProvider.update(calendarId, {
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
