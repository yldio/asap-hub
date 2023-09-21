import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import EventController from '../../controllers/event.controller';
import { EventContentfulDataProvider } from '../../data-providers/event.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { EventPayload } from '../event-bus';

export const meetingLinkUpdateHandler =
  (
    eventController: EventController,
    log: Logger,
  ): EventBridgeHandler<gp2Model.EventEvent, EventPayload> =>
  async (event) => {
    const eventId = event.detail.resourceId;
    log.info(`Event ${event['detail-type']}: ${eventId}`);

    const getCalendarEvent = async () => {
      try {
        const calendarEvent = await eventController.fetchById(eventId);
        log.info(`Fetched calendar event ${calendarEvent.id}`);

        return calendarEvent;
      } catch (e) {
        log.error(`Event ${eventId} could not be found.`);
        throw e;
      }
    };

    const calendarEvent = await getCalendarEvent();

    if (calendarEvent.googleId && calendarEvent.copyMeetingLink) {
      const commonGoogleId = getCommonGoogleId(calendarEvent.googleId);

      const seriesEventsListResponse = await eventController.fetch({
        filter: {
          googleId: commonGoogleId,
        },
      });

      const seriesEvents = seriesEventsListResponse.items.filter(
        (e) => e.id !== eventId,
      );
      log.info(`Found ${seriesEvents.length} series events`);

      for (const seriesEvent of seriesEvents) {
        log.info(
          `Updating event ${seriesEvent.id} with meeting link ${calendarEvent.meetingLink}`,
        );

        try {
          await eventController.update(seriesEvent.id, {
            meetingLink: calendarEvent.meetingLink,
            copyMeetingLink: false,
          });
        } catch (e) {
          log.error(`Error updating event ${seriesEvent.id}: ${e}`);
        }
      }
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const eventDataProvider = new EventContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
export const handler = sentryWrapper(
  meetingLinkUpdateHandler(new EventController(eventDataProvider), logger),
);

export const getCommonGoogleId = (googleId: string) => {
  const parts = googleId.split('_');
  return parts[0];
};
