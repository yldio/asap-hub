import { EventBridgeEvent } from 'aws-lambda';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../webhooks/webhook-teams';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { algoliaIndex } from '../../config';
import logger from '../../utils/logger';

export const indexResearchOutputByTeamHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): ((
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ) => Promise<void>) =>
  async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
    const outputsIds = Array.from(
      new Set(
        (event.detail.payload.data.outputs.iv ?? []).concat(
          event.detail.payload.dataOld?.outputs.iv ?? [],
        ),
      ),
    );

    logger.info(`Found ${outputsIds.length} research-output(s)`);

    if (outputsIds.length > 0) {
      const teamOutputsResults = await Promise.allSettled(
        outputsIds.map(async (id) => {
          logger.debug(`Found research-output with id ${id}`);

          const researchOutput = await researchOutputController.fetchById(id);

          logger.debug(`Fetched ${JSON.stringify(researchOutput.id)}`);

          await algoliaClient.save(researchOutput);

          logger.debug(`Saved research-output with id ${id}`);
        }),
      );
      logger.info(JSON.stringify(teamOutputsResults));
    }
  };

export const handler = indexResearchOutputByTeamHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliaSearchClientFactory(algoliaIndex),
);
