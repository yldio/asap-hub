import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventResponse, ListResponse } from '@asap-hub/model';
import { EventController } from '@asap-hub/server-common';
import { RestEvent, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import Events from '../../controllers/events';
import { EventSquidexDataProvider } from '../../data-providers/event.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalAuthorEvent, ExternalAuthorPayload } from '../event-bus';

export const indexExternalAuthorEventsHandler =
  (
    eventController: EventController,
    algoliaClient: AlgoliaSearchClient,
  ): ((
    event: EventBridgeEvent<ExternalAuthorEvent, ExternalAuthorPayload>,
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
        filter: { externalAuthorId: event.detail.payload.id },
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

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
  appName,
  baseUrl,
});

const eventDataProvider = new EventSquidexDataProvider(
  eventRestClient,
  squidexGraphqlClient,
);
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
