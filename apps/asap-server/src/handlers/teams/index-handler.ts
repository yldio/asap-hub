import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { TeamsEventType } from '../webhooks/webhook-teams';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';

export const indexHandlerFactory = (
  researchOutputController: ResearchOutputController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
) => Promise<void>) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  return async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const outputsIds = event.detail.payload.data?.outputs.iv;

    logger.info(`Fetching Research-Outputs ${outputsIds}`);

    const researchOutputs = await researchOutputController.fetch({
      take: outputsIds.length,
      skip: 0,
      filter: outputsIds
        .map((outputId) => `contains(id, ${outputId})`)
        .join(' or ,')
        .split(','),
    });

    await algoliaIndex.saveObjects(
      (researchOutputs?.items ?? []).map((researchOutput) => ({
        ...researchOutput,
        objectID: researchOutput.id,
      })),
    );

    logger.info(`Saved Research-Outputs ${researchOutputs}`);
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

export const handler = indexHandlerFactory(
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
