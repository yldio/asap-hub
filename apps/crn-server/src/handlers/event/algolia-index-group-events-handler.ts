import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import {
  EventController,
  EventResponse,
  InterestGroupEvent,
  ListResponse,
} from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Events from '../../controllers/event.controller';
import { getEventDataProvider } from '../../dependencies/events.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { InterestGroupPayload } from '../event-bus';

export const indexGroupEventsHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): ((
    event: EventBridgeEvent<InterestGroupEvent, InterestGroupPayload>,
  ) => Promise<void>) =>
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
        filter: { interestGroupId: event.detail.resourceId },
      });

    const processingFunction = async (
      foundEvents: ListResponse<EventResponse>,
    ) => {
      logger.info(
        `Found ${foundEvents.total} events. Processing ${foundEvents.items.length} events.`,
      );

      await algoliaClient.saveMany(
        foundEvents.items
          .filter((e) => !e.hidden)
          .map((data) => ({
            data,
            type: 'event',
          })),
      );

      logger.info(`Updated ${foundEvents.items.length} events.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

const eventDataProvider = getEventDataProvider();
/* istanbul ignore next */
export const handler = sentryWrapper(
  indexGroupEventsHandler(
    new Events(eventDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
