import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import { TeamEvent, TeamPayload } from '../event-bus';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexResearchOutputByTeamHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
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

          await algoliaClient.save({
            data: researchOutput,
            type: 'research-output',
          });

          logger.debug(`Saved research-output with id ${id}`);
        }),
      );
      logger.info(JSON.stringify(teamOutputsResults));
    }
  };

export const handler = indexResearchOutputByTeamHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);
