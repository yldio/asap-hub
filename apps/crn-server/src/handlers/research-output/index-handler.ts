import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventBridgeHandler } from '@asap-hub/server-common';
import {
  RestExternalAuthor,
  RestResearchOutput,
  RestTeam,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';
import { ExternalAuthorSquidexDataProvider } from '../../data-providers/external-authors.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../../data-providers/research-tags.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { ResearchOutputEvent, ResearchOutputPayload } from '../event-bus';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const indexResearchOutputHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ResearchOutputEvent, ResearchOutputPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const researchOutput = await researchOutputController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched research-output ${researchOutput.id}`);

      await algoliaClient.save({
        data: researchOutput,
        type: 'research-output',
      });

      logger.debug(`Saved research-output ${researchOutput.id}`);
    } catch (e) {
      if (isBoom(e) && e.output.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }
      throw e;
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
const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
  appName,
  baseUrl,
});
const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
  getAuthToken,
  'external-authors',
  { appName, baseUrl },
);
const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
  squidexGraphqlClient,
  researchOutputRestClient,
  teamRestClient,
);
const researchTagDataProvider = new ResearchTagSquidexDataProvider(
  squidexGraphqlClient,
);
const externalAuthorDataProvider = new ExternalAuthorSquidexDataProvider(
  externalAuthorRestClient,
);

export const handler = sentryWrapper(
  indexResearchOutputHandler(
    new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
