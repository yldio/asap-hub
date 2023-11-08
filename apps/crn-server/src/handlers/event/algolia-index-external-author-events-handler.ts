import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import {
  EventController,
  EventResponse,
  ExternalAuthorEvent,
  ListResponse,
} from '@asap-hub/model';
import {
  createProcessingFunction,
  eventFilter,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Events from '../../controllers/event.controller';
import { getEventDataProvider } from '../../dependencies/events.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalAuthorPayload } from '../event-bus';
import { addTagsToEvents } from './helper';

export const indexExternalAuthorEventsHandler = (
  eventController: EventController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((
  event: EventBridgeEvent<ExternalAuthorEvent, ExternalAuthorPayload>,
) => Promise<void>) => {
  const processingFunction = createProcessingFunction(
    algoliaClient,
    'event',
    logger,
    eventFilter,
    addTagsToEvents,
  );
  return async (event) => {
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
        filter: { externalAuthorId: event.detail.resourceId },
      });

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };
};
const eventDataProvider = getEventDataProvider();

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexExternalAuthorEventsHandler(
    new Events(eventDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
