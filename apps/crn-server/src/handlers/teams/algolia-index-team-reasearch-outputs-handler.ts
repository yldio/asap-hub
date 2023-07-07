import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { TeamEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import {
  RestExternalAuthor,
  RestResearchOutput,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import ResearchOutputController from '../../controllers/research-output.controller';
import { ExternalAuthorSquidexDataProvider } from '../../data-providers/external-author.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../data-providers/research-output.data-provider';
import { ResearchTagSquidexDataProvider } from '../../data-providers/research-tag.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';

export const indexResearchOutputByTeamHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
    const outputsIds = Array.from(
      new Set(
        (event.detail.payload.data.outputs?.iv ?? []).concat(
          event.detail.payload.dataOld?.outputs?.iv ?? [],
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

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
  getAuthToken,
  'research-outputs',
  { appName, baseUrl },
);
const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
  getAuthToken,
  'external-authors',
  { appName, baseUrl },
);
const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
  squidexGraphqlClient,
  researchOutputRestClient,
);
const researchTagDataProvider = new ResearchTagSquidexDataProvider(
  squidexGraphqlClient,
);
const externalAuthorDataProvider = new ExternalAuthorSquidexDataProvider(
  externalAuthorRestClient,
  squidexGraphqlClient,
);

export const handler = sentryWrapper(
  indexResearchOutputByTeamHandler(
    new ResearchOutputController(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);
