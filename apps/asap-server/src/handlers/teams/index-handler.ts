import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { ListResearchOutputResponse } from '@asap-hub/model';
import { TeamsEventType } from '../webhooks/webhook-teams';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import logger from '../../utils/logger';

export const indexHandlerFactory =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: SearchClient,
  ): ((
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ) => Promise<void>) =>
  async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const outputsIds = event.detail.payload.data?.outputs.iv;

    logger.info(`Fetching Research-Outputs ${outputsIds}`);

    const researchOutputs = await researchOutputController.fetch({
      take: outputsIds.length,
      skip: 0,
      filter: [
        outputsIds
          .map((outputId) => `contains(id, '${outputId}')`)
          .join(' or '),
      ],
    });

    logger.info(
      `Fetched Research-Outputs ${researchOutputs.items.length} of ${outputsIds.length}`,
    );

    await indexResearchOutputs(researchOutputs, algoliaClient);
  };

const indexResearchOutputs = async (
  researchOutputs: ListResearchOutputResponse,
  algoliaClient: SearchClient,
) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  await algoliaIndex.saveObjects(
    (researchOutputs?.items ?? []).map((researchOutput) => ({
      ...researchOutput,
      objectID: researchOutput.id,
    })),
  );

  logger.info(`Saved Research-Outputs ${researchOutputs}`);
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
