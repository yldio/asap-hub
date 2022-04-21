import { SquidexGraphql, SquidexNotFoundError } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { isBoom } from '@hapi/boom';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { ResearchOutputEvent, ResearchOutputPayload } from '../event-bus';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexResearchOutputHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ResearchOutputEvent, ResearchOutputPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await algoliaClient.save({
        data: researchOutput,
        type: 'research-output',
      });

      logger.debug(`Saved research-output ${researchOutput.id}`);
    } catch (e) {
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof SquidexNotFoundError
      ) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }
      throw e;
    }
  };

export const handler = indexResearchOutputHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliaSearchClientFactory({
    algoliaApiKey,
    algoliaAppId,
    algoliaIndex,
  }),
);
