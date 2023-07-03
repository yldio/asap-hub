import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { ResearchOutputEvent } from '@asap-hub/model';
import {
  RestExternalAuthor,
  RestResearchOutput,
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
import ResearchOutputController from '../../controllers/research-output.controller';
import { ExternalAuthorSquidexDataProvider } from '../../data-providers/external-authors.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../../data-providers/research-tags.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { ResearchOutputPayload } from '../event-bus';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const indexResearchOutputHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ResearchOutputEvent, ResearchOutputPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const reindexResearchOutput = async (id: string) => {
      try {
        const researchOutput = await researchOutputController.fetchById(id);
        logger.debug(`Fetched research-output ${researchOutput.id}`);

        await algoliaClient.save({
          data: researchOutput,
          type: 'research-output',
        });

        logger.debug(`Saved research-output ${researchOutput.id}`);

        return researchOutput;
      } catch (e) {
        logger.error(e, `Error while reindexing research output ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          logger.error(`Research output ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      const researchOutput = await reindexResearchOutput(
        event.detail.payload.id,
      );

      for (const relatedResearchOutput of researchOutput.relatedResearch) {
        await reindexResearchOutput(relatedResearchOutput.id);
      }
    } catch (e) {
      logger.error(
        e,
        `Error while reindexing research output ${event.detail.payload.id} and its related research outputs`,
      );
      if (isBoom(e) && e.output.statusCode === 404) {
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
  indexResearchOutputHandler(
    new ResearchOutputController(
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
