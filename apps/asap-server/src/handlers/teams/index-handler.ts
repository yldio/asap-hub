import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { TeamsEventType } from '../webhooks/webhook-teams';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';

export const indexResearchOutputByTeamHandler = (
  researchOutputController: ResearchOutputController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
) => Promise<void>) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  return async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const outputsIds = Array.from(
      new Set(
        event.detail.payload.data.outputs.iv.concat(
          event.detail.payload.dataOld?.outputs.iv ?? [],
        ),
      ),
    );

    if (outputsIds.length > 0) {
      await Promise.all(
        outputsIds.map(async (id) => {
          logger.info(`Fetch research-output with id ${id}`);
          const researchOutput = await researchOutputController.fetchById(id);

          logger.info(
            `Fetched research-output ${JSON.stringify(researchOutput)}`,
          );

          await algoliaIndex.saveObject({
            ...researchOutput,
            objectID: researchOutput.id,
          });

          logger.info(`Saved research-output with id ${id}`);
        }),
      );
    }
  };
};

export type SquidexWebhookTeamPayload = {
  type: 'TeamsCreated' | 'TeamsUpdated';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Created';
    id: string;
    data: {
      outputs: { iv: string[] };
    };
    dataOld?: {
      outputs: { iv: string[] };
    };
  };
};

export const handler = indexResearchOutputByTeamHandler(
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
