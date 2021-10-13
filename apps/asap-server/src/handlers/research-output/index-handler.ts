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
    const researchOutput = await researchOutputController.fetchById(
      event.detail.payload.id,
    );

    await algoliaIndex.saveObject({
      ...researchOutput,
      objectID: researchOutput.id,
    });

    logger.info(`Saved Research-Output with ID ${researchOutput.id}`);
  };
};

export type SquidexWebhookResearchOutputPayload = {
  type: 'ResearchOutputsCreated' | 'ResearchOutputsUpdated';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Created';
    id: string;
  };
};

export const handler = indexResearchOutputHandler(
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
