import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
  createProcessingFunction,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import OutputController from '../../controllers/output.controller';
import { ExternalUserContentfulDataProvider } from '../../data-providers/external-user.data-provider';
import { OutputContentfulDataProvider } from '../../data-providers/output.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { EventPayload } from '../event-bus';

export const indexOutputEventHandler = (
  outputController: OutputController,
  algoliaClient: AlgoliaClient<'gp2'>,
): ((
  event: EventBridgeEvent<gp2Model.EventEvent, EventPayload>,
) => Promise<void>) => {
  const processingFunction = createProcessingFunction(
    algoliaClient,
    'output',
    logger,
  );
  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<gp2Model.OutputResponse>
    > =>
      outputController.fetch({
        skip,
        take,
        filter: { eventId: event.detail.resourceId },
      });

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };
};

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const outputDataProvider = new OutputContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const externalUserDataProvider = new ExternalUserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexOutputEventHandler(
    new OutputController(outputDataProvider, externalUserDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
