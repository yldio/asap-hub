import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { TeamResponse } from '@asap-hub/model';
import { TeamsEventType } from '../webhooks/webhook-teams';
import Team, { TeamController } from '../../controllers/teams';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import logger from '../../utils/logger';

export const indexHandlerFactory =
  (
    teamController: TeamController,
    algoliaClient: SearchClient,
  ): ((
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ) => Promise<void>) =>
  async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const team = await teamController.fetchById(event.detail.payload.id);

    logger.info(`Fetched team with id ${team.id}`);

    await indexResearchOutputs(team, algoliaClient);
  };

const indexResearchOutputs = async (
  teamResponse: TeamResponse,
  algoliaClient: SearchClient,
) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  logger.info(`Indexing outputs of team with id ${teamResponse.id}`);

  await algoliaIndex.saveObjects(
    teamResponse.outputs.map((researchOutput) => ({
      ...researchOutput,
      objectID: researchOutput.id,
    })),
  );

  logger.info(`Saved outputs of team with id ${teamResponse.id}`);
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
