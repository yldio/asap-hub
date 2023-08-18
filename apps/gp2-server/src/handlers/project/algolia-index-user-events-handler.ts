import { AlgoliaClient } from '@asap-hub/algolia';
import {
  EventController,
  EventResponse,
  ListResponse,
  UserEvent,
} from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
  UserPayload,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import logger from '../../utils/logger';

export const indexUserEventsHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): ((event: EventBridgeEvent<UserEvent, UserPayload>) => Promise<void>) =>
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
        filter: { userId: event.detail.resourceId },
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

// const eventDataProvider = getEventDataProvider();
// /* istanbul ignore next */
// export const handler = sentryWrapper(
//   indexUserEventsHandler(
//     new Events(eventDataProvider),
//     algoliaSearchClientFactory({
//       algoliaApiKey,
//       algoliaAppId,
//       algoliaIndex,
//     }),
//   ),
// );
