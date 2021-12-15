import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import {
  ResearchOutputEventType,
  ResearchOutputWebhookPayload,
} from '../webhooks/webhook-research-output';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';
import { InstrumentedSquidexGraphql } from '../../utils/instrumented-client';

export const indexResearchOutputHandler = (
  researchOutputController: ResearchOutputController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<
    ResearchOutputEventType,
    ResearchOutputWebhookPayload
  >,
) => Promise<void>) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  return async (
    event: EventBridgeEvent<
      ResearchOutputEventType,
      ResearchOutputWebhookPayload
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
        await algoliaIndex.deleteObject(event.detail.payload.id);
        return;
      }
      throw e;
    }
  };
};

export const handler = indexResearchOutputHandler(
  new ResearchOutputs(new InstrumentedSquidexGraphql()),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
