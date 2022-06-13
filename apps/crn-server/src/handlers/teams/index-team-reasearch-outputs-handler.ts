import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import {
  RestExternalAuthor,
  RestResearchOutput,
  RestTeam,
  SquidexGraphql,
  SquidexRest,
  getAccessTokenFactory,
} from '@asap-hub/squidex';
import { TeamEvent, TeamPayload } from '../event-bus';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
  clientId,
  clientSecret,
} from '../../config';

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

const getAuthToken = getAccessTokenFactory({ clientId, clientSecret, baseUrl });
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
  getAuthToken,
  'research-outputs',
  { appName, baseUrl },
);
const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
  appName,
  baseUrl,
});
const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
  getAuthToken,
  'external-authors',
  { appName, baseUrl },
);

export const handler = indexResearchOutputByTeamHandler(
  new ResearchOutputs(
    squidexGraphqlClient,
    researchOutputRestClient,
    teamRestClient,
    externalAuthorRestClient,
  ),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);
