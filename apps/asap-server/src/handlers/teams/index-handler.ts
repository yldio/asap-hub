import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { TeamsEventType } from '../webhooks/webhook-teams';
import Team, { TeamController } from '../../controllers/teams';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';

export const indexHandlerFactory = (
  teamController: TeamController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
) => Promise<void>) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  return async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const team = await teamController.fetchById(event.detail.payload.id);

    logger.info(`Fetched team with id ${team.id}`);

    if (team.outputs.length > 0) {
      await algoliaIndex.saveObjects(
        team.outputs.map((researchOutput) => ({
          ...researchOutput,
          objectID: researchOutput.id,
        })),
      );
      logger.info(`Saved outputs of team with id ${team.id}`);
    }
  };
};

export type SquidexWebhookTeamPayload = {
  type: 'TeamsCreated' | 'TeamsUpdated';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Created';
    id: string;
  };
};

export const handler = indexHandlerFactory(
  new Team(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
