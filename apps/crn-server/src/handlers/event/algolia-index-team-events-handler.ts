import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import {
  EventController,
  EventResponse,
  ListResponse,
  TeamEvent,
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
import { TeamPayload } from '../event-bus';
import { addTagsToEvents } from './helper';

export const indexTeamEventsHandler = (
  eventController: EventController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((event: EventBridgeEvent<TeamEvent, TeamPayload>) => Promise<void>) => {
  const processingFunction = createProcessingFunction<Payload, 'event'>(
    algoliaClient,
    'event',
    logger,
    eventFilter,
    addTagsToEvents<Payload>,
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
        filter: {
          teamId: event.detail.resourceId,
        },
      });

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };
};

const eventDataProvider = getEventDataProvider();
/* istanbul ignore next */
export const handler = sentryWrapper(
  indexTeamEventsHandler(
    new Events(eventDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
