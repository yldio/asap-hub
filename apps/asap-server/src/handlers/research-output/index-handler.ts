import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { ResearchOutputEventType } from '../webhooks/webhook-research-output';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexResearchOutputHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  > =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await algoliaClient.save(researchOutput);

      logger.debug(`Saved research-output ${researchOutput.id}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }
      throw e;
    }
  };

export type SquidexWebhookResearchOutputPayload = {
  type:
    | 'ResearchOutputsPublished'
    | 'ResearchOutputsUpdated'
    | 'ResearchOutputsUnpublished'
    | 'ResearchOutputsDeleted';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted';
    id: string;
  };
};

export const handler = indexResearchOutputHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliaSearchClientFactory({
    algoliaApiKey,
    algoliaAppId,
    algoliaIndex,
  }),
);
