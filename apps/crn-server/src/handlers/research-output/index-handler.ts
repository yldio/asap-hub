import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import {
  getGraphQLClient as getContentfulGraphQLClient,
  getRestClient as getContentfulRestClient,
} from '@asap-hub/contentful';
import { EventBridgeHandler } from '@asap-hub/server-common';
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
  contentfulAccessToken,
  contentfulEnvId,
  contentfulManagementAccessToken,
  contentfulSpaceId,
  isContentfulEnabledV2,
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
import { ExternalAuthorContentfulDataProvider } from '../../data-providers/contentful/external-authors.data-provider';

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

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const getContentfulRestClientFactory = () =>
  /* istanbul ignore next */
  getContentfulRestClient({
    space: contentfulSpaceId,
    accessToken: contentfulManagementAccessToken,
    environment: contentfulEnvId,
  });
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
const externalAuthorDataProvider = isContentfulEnabledV2
  ? new ExternalAuthorContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    )
  : new ExternalAuthorSquidexDataProvider(
      externalAuthorRestClient,
      squidexGraphqlClient,
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
