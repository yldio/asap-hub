import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { gp2 } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
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
import { OutputPayload } from '../event-bus';
export const indexResearchOutputHandler =
  (
    outputController: OutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<gp2.OutputEvent, OutputPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const reindexResearchOutput = async (id: string) => {
      try {
        const output = await outputController.fetchById(id);
        logger.debug(`Fetched research-output ${output.id}`);

        await algoliaClient.save({
          data: output,
          type: 'output',
        });

        logger.debug(`Saved research-output ${output.id}`);

        return output;
      } catch (e) {
        logger.error(e, `Error while reindexing research output ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          logger.error(`Research output ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexResearchOutput(event.detail.resourceId);
    } catch (e) {
      logger.error(
        e,
        `Error while reindexing research output ${event.detail.resourceId} and its related research outputs`,
      );
      if (isBoom(e) && e.output.statusCode === 404) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const outputDataProvider = new OutputContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const externalAuthorDataProvider = new ExternalUserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexResearchOutputHandler(
    new OutputController(outputDataProvider, externalAuthorDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
