import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import logger from '../../utils/logger';
import Event, { EventController } from '../../controllers/events';
import { EventEvent, EventPayload } from '../event-bus';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexEventHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<EventEvent, EventPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const crnEvent = await eventController.fetchById(event.detail.payload.id);

      logger.debug(`Fetched event ${crnEvent.id}`);

      await algoliaClient.save({
        data: crnEvent,
        type: 'event',
      });

      logger.debug(`Saved event  ${crnEvent.id}`);
    } catch (e) {
      if (isBoom(e) && e.output.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }

      logger.error(e, 'Error while saving event to Algolia');
      throw e;
    }
  };

export const handler = indexEventHandler(
  new Event(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type EventIndexEventBridgeEvent = EventBridgeEvent<
  EventEvent,
  EventController
>;
