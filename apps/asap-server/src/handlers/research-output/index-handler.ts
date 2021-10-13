import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
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
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  return async (
    event: EventBridgeEvent<
      ResearchOutputEventType,
      SquidexWebhookResearchOutputPayload
    >,
  ): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    if (
      ['ResearchOutputCreated', 'ResearchOutputUpdated'].includes(
        event['detail-type'],
      )
    ) {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await algoliaIndex.saveObject({
        ...researchOutput,
        objectID: researchOutput.id,
      });

      logger.debug(`Saved research-output ${researchOutput.id}`);
    }

    if (
      ['ResearchOutputUnpublished', 'ResearchOutputDeleted'].includes(
        event['detail-type'],
      )
    ) {
      await algoliaIndex.deleteObject(event.detail.payload.id);
      logger.debug(`Deleted research-output ${event.detail.payload.id}`);
    }
  };
};

export type SquidexWebhookResearchOutputPayload = {
  type:
    | 'ResearchOutputsCreated'
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
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
