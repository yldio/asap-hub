import {
  EntryFieldTypes,
  getCDAClient,
  pollContentfulDeliveryApi,
} from '@asap-hub/contentful';
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

type ContentfulDeliveryApiConfig = {
  space: string;
  environment: string;
  accessToken: string;
};

type CalendarSkeleton = {
  contentTypeId: 'calendars';
  fields: {
    googleApiMetadata: EntryFieldTypes.Object<{
      associatedGoogleCalendarId?: string | null;
      resourceId?: string | null;
    }>;
  };
};

export const calendarCreatedContentfulHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
    contentfulDeliveryApiConfig: ContentfulDeliveryApiConfig,
  ) =>
  async (
    event: EventBridgeEvent<CalendarEvent, CalendarContentfulPayload>,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const eventType = event['detail-type'];
    const {
      fields,
      sys,
      resourceId: calendarId,
    } = validateBody(event.detail as never);

    const webhookEventVersion = sys.revision;
    const webhookEventGoogleCalendarId = fields.googleCalendarId['en-US'];

    logger.info(
      `Received a '${eventType}' event for the calendar ${calendarId}`,
    );

    logger.debug(`Event payload: ${JSON.stringify(fields)}`);

    if (eventType !== 'CalendarsPublished') return 'OK';

    const cdaClient = getCDAClient(contentfulDeliveryApiConfig);

    const fetchCalendarById = () =>
      cdaClient.getEntry<CalendarSkeleton>(calendarId);

    const cmsCalendar = await pollContentfulDeliveryApi<CalendarSkeleton>(
      fetchCalendarById,
      webhookEventVersion,
    );

    if (!cmsCalendar) {
      logger.error('Failed to retrieve calendar by ID.');

      return 'OK';
    }

    const googleApiMetadata = cmsCalendar.fields?.googleApiMetadata;

    if (
      googleApiMetadata?.associatedGoogleCalendarId !==
        webhookEventGoogleCalendarId &&
      googleApiMetadata?.resourceId
    ) {
      try {
        await unsubscribe(googleApiMetadata.resourceId as string, calendarId);

        await calendarDataProvider.update(calendarId, {
          resourceId: null,
        });
      } catch (error) {
        logger.error(error, 'Error during unsubscribing from the calendar');
        alerts.error(error);
      }
    }

    if (webhookEventGoogleCalendarId === '') {
      return 'OK';
    }

    try {
      const { resourceId, expiration } = await subscribe(
        webhookEventGoogleCalendarId,
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
  };
