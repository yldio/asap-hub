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

    try {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await algoliaIndex.saveObject({
        ...researchOutput,
        objectID: researchOutput.id,
      });

      logger.debug(`Saved research-output ${researchOutput.id}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        try {
          await algoliaIndex.deleteObject(event.detail.payload.id);
        } catch (err) {
          logger.debug(JSON.stringify(err));
          logger.debug(`Deleted research-output ${event.detail.payload.id}`);
        }
      } else {
        throw e;
      }
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
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
