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
import { ExternalAuthorContentfulDataProvider } from '../../data-providers/contentful/external-authors.data-provider';
import { ExternalAuthorSquidexDataProvider } from '../../data-providers/external-authors.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../data-providers/research-outputs.data-provider';
import { ResearchTagSquidexDataProvider } from '../../data-providers/research-tags.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamEvent, TeamPayload } from '../event-bus';

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

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

/* istanbul ignore next */
const getContentfulRestClientFactory = () =>
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
/* istanbul ignore next */
const selectedAlgoliaIndex = isContentfulEnabledV2
  ? algoliaIndex
  : `${algoliaIndex}-contentful`;

export const handler = sentryWrapper(
  indexResearchOutputByTeamHandler(
    new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex: selectedAlgoliaIndex,
    }),
  ),
);
