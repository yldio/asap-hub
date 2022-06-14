import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventResponse, ListResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Events, { EventController } from '../../controllers/events';
import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { GroupEvent, GroupPayload } from '../event-bus';

export const indexGroupEventsHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaSearchClient,
  ): ((event: EventBridgeEvent<GroupEvent, GroupPayload>) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<EventResponse>
    > =>
      eventController.fetch({
        skip,
        take,
        filter: { groupId: event.detail.payload.id },
      });

    const processingFunction = async (
      foundEvents: ListResponse<EventResponse>,
    ) => {
      logger.info(
        `Found ${foundEvents.total} events. Processing ${foundEvents.items.length} events.`,
      );

      await algoliaClient.saveMany(
        foundEvents.items.map((data) => ({
          data,
          type: 'event',
        })),
      );

      logger.info(`Updated ${foundEvents.items.length} events.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

const squidexGraphqlClient = new SquidexGraphql();
export const handler = indexGroupEventsHandler(
  new Events(squidexGraphqlClient),
  algoliaSearchClientFactory({
    algoliaApiKey,
    algoliaAppId,
    algoliaIndex,
  }),
);
