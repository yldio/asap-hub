import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
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
import { ExternalUserPayload } from '../event-bus';

export const indexOutputExternalUserHandler =
  (
    outputController: OutputController,
    algoliaClient: AlgoliaClient<'gp2'>,
  ): ((
    event: EventBridgeEvent<gp2Model.ExternalUserEvent, ExternalUserPayload>,
  ) => Promise<void>) =>
  async (event) => {
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
        filter: { externalAuthorId: event.detail.resourceId },
      });

    const processingFunction = async (
      foundOutputs: ListResponse<gp2Model.OutputResponse>,
    ) => {
      logger.info(
        `Found ${foundOutputs.total} outputs. Processing ${foundOutputs.items.length} outputs.`,
      );

      try {
        const outputs = foundOutputs.items.map((data) => ({
          data,
          type: 'output' as const,
        }));
        logger.debug(`trying to save: ${JSON.stringify(outputs, null, 2)}`);
        await algoliaClient.saveMany(outputs);
      } catch (err) {
        logger.error('Error occurred during saveMany');
        if (err instanceof Error) {
          logger.error(`The error message: ${err.message}`);
        }
        throw err;
      }

      logger.info(`Updated ${foundOutputs.items.length} outputs.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
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
  indexOutputExternalUserHandler(
    new OutputController(outputDataProvider, externalUserDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
