import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliasearch,
  SearchClient,
  ResearchOutputSearchIndex,
} from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { ResearchOutputEventType } from '../webhooks/webhook-research-output';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';

export const indexResearchOutputHandler = (
  researchOutputController: ResearchOutputController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  >,
) => Promise<void>) => {
  const searchIndex = new ResearchOutputSearchIndex(
    algoliaClient.initIndex(algoliaResearchOutputIndex),
  );

  return async (
    event: EventBridgeEvent<
      ResearchOutputEventType,
      SquidexWebhookResearchOutputPayload
    >,
  ): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await searchIndex.save(researchOutput);

      logger.debug(`Saved research-output ${researchOutput.id}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        await searchIndex.remove(event.detail.payload.id);
        return;
      }
      throw e;
    }
  };
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
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
