import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
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
import { getTagsNames } from '../../utils/tag-names';
import { OutputPayload } from '../event-bus';

export const indexOutputHandler =
  (
    outputController: OutputController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.OutputEvent, OutputPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const removeOutput = async (id: string) => {
      await algoliaClient.remove(id);
      log.debug(`Removed output ${id}`);
    };

    const reindexOutput = async (id: string) => {
      try {
        const output = await outputController.fetchById(id);
        log.debug(`Fetched output ${output.id}`);

        const data = {
          ...output,
          _tags: getTagsNames(output.tags),
        };

        await algoliaClient.save({
          data,
          type: 'output',
        });

        log.debug(`Saved output ${output.id}`);
        return output;
      } catch (e) {
        log.error(e, `Error while reindexing output ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          log.error(`Output ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      if (
        event['detail-type'] === 'OutputsDeleted' ||
        event['detail-type'] === 'OutputsUnpublished'
      ) {
        await removeOutput(event.detail.resourceId);
        // update outputs that had the removed/unpublished entry as related outputs
        const relatedOutputs = await outputController.fetch({
          filter: { relatedOutputId: event.detail.resourceId },
          includeDrafts: true,
        });
        for (const relatedOutput of relatedOutputs.items) {
          await reindexOutput(relatedOutput.id);
        }
      } else {
        const output = await reindexOutput(event.detail.resourceId);
        for (const relatedOutput of output.relatedOutputs) {
          await reindexOutput(relatedOutput.id);
        }
      }
    } catch (e) {
      log.error(e, `Error while reindexing output ${event.detail.resourceId}`);
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
  indexOutputHandler(
    new OutputController(outputDataProvider, externalAuthorDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
