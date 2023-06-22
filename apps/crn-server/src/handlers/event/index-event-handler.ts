import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventController, EventEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Event from '../../controllers/events.controller';
import { getEventDataProvider } from '../../dependencies/events.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { EventPayload } from '../event-bus';

export const indexEventHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<EventEvent, EventPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const crnEvent = await eventController.fetchById(event.detail.resourceId);

      logger.debug(`Fetched event ${crnEvent.id}`);

      await algoliaClient.save({
        data: crnEvent,
        type: 'event',
      });

      logger.debug(`Saved event  ${crnEvent.id}`);
    } catch (e) {
      if (isBoom(e) && e.output.statusCode === 404) {
        await algoliaClient.remove(event.detail.resourceId);
        return;
      }

      logger.error(e, 'Error while saving event to Algolia');
      throw e;
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexEventHandler(
    new Event(getEventDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type EventIndexEventBridgeEvent = EventBridgeEvent<
  EventEvent,
  EventController
>;
