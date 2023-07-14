import {
  EntryFieldTypes,
  getCDAClient,
  pollContentfulDeliveryApi,
} from '@asap-hub/contentful';
import { CalendarDataProvider, CalendarEvent, gp2 } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import 'source-map-support/register';

import { Alerts, Logger } from '../../utils';
import { validateBody } from '../../validation/calendar-handler.contentful.validation';
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

const defaultGetCalendarId = (id: string): string => id;

export const calendarCreatedContentfulHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
    contentfulDeliveryApiConfig: ContentfulDeliveryApiConfig,
    getCalendarSubscriptionIdFunction?: (id: string) => string,
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

    logger.debug('validated');
    logger.debug({ fields, sys, calendarId });
    const webhookEventVersion = sys.revision;
    const webhookEventGoogleCalendarId = fields.googleCalendarId['en-US'];
    const getCalendarSubscriptionId =
      getCalendarSubscriptionIdFunction || defaultGetCalendarId;

    logger.info(
      `Received a '${eventType}' event for the calendar ${calendarId}`,
    );

    logger.debug(`Event payload: ${JSON.stringify(fields)}`);

    if (eventType !== 'CalendarsPublished') {
      logger.debug(`eventType was ${eventType}. Finished processing`);
      return 'OK';
    }

    const cdaClient = getCDAClient(contentfulDeliveryApiConfig);

    logger.debug('getting calendar entry');
    const fetchCalendarById = () =>
      cdaClient.getEntry<CalendarSkeleton>(calendarId);

    logger.debug('got calendar entry');

    let cmsCalendar;
    try {
      cmsCalendar = await pollContentfulDeliveryApi<CalendarSkeleton>(
        fetchCalendarById,
        webhookEventVersion,
      );
    } catch {
      logger.error('Failed to retrieve calendar by ID.');
      return 'OK';
    }

    const googleApiMetadata = cmsCalendar?.fields?.googleApiMetadata;
    logger.debug(
      `got cmsCalendar with googleApiMetadata: ${JSON.stringify(
        googleApiMetadata,
        null,
        2,
      )}`,
    );

    if (
      googleApiMetadata?.associatedGoogleCalendarId !==
        webhookEventGoogleCalendarId &&
      googleApiMetadata?.resourceId
    ) {
      logger.debug(
        `invalid calendar unsubscribe. webhookEventGoogleCalendarId: ${webhookEventGoogleCalendarId}`,
      );

      try {
        logger.debug('tries to unsubscribe');
        await unsubscribe(
          googleApiMetadata.resourceId as string,
          getCalendarSubscriptionId(calendarId),
        );
        logger.debug(`unsubscribed from calendar: ${calendarId}`);

        await calendarDataProvider.update(calendarId, {
          resourceId: null,
        });
        logger.debug('updated resourceId with null');
      } catch (error) {
        logger.error(error, 'Error during unsubscribing from the calendar');
        alerts.error(error);
      }
    }

    if (webhookEventGoogleCalendarId === '') {
      logger.debug('webhookEventGoogleCalendarId is empty string. Finishing.');
      return 'OK';
    }

    if (
      (!!webhookEventGoogleCalendarId &&
        !googleApiMetadata &&
        webhookEventVersion === 1) ||
      googleApiMetadata?.associatedGoogleCalendarId !==
        webhookEventGoogleCalendarId
    ) {
      try {
        const subscriptionId = getCalendarSubscriptionId(calendarId);
        logger.debug(
          `about to subscribe to webhookEventGoogleCalendarId: ${webhookEventGoogleCalendarId} subscriptionId: ${subscriptionId}`,
        );
        const { resourceId, expiration } = await subscribe(
          webhookEventGoogleCalendarId,
          subscriptionId,
        );

        logger.debug(
          `updating calendar: resourceId: ${resourceId} expirationDate: ${expiration}`,
        );
        await calendarDataProvider.update(calendarId, {
          resourceId,
          expirationDate: expiration,
        });
        logger.debug('updated calendar');
      } catch (error) {
        logger.error(error, 'Error subscribing to the calendar');
        alerts.error(error);

        throw error;
      }
    } else {
      logger.debug('catch all from final check.');
      logger.debug(
        `webhookEventGoogleCalendarId: ${webhookEventGoogleCalendarId}`,
        `googleApiMetadata: ${googleApiMetadata}`,
        `webhookEventVersion: ${webhookEventVersion}`,
        `webhookEventGoogleCalendarId: ${webhookEventGoogleCalendarId}`,
        `associatedGoogleCalendarId: ${googleApiMetadata?.associatedGoogleCalendarId}`,
      );
    }

    return 'OK';
  };
