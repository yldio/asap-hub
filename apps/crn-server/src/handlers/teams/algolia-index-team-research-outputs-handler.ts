import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import {
  ListResponse,
  ResearchOutputResponse,
  TeamEvent,
} from '@asap-hub/model';
import {
  createProcessingFunction,
  EventBridgeHandler,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ResearchOutputController from '../../controllers/research-output.controller';

import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';
import { getResearchOutputDataProvider } from '../../dependencies/research-outputs.dependencies';
import { getResearchTagDataProvider } from '../../dependencies/research-tags.dependencies';

import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';

export const indexResearchOutputByTeamHandler = (
  researchOutputController: ResearchOutputController,
  algoliaClient: AlgoliaClient<'crn'>,
): EventBridgeHandler<TeamEvent, TeamPayload> => {
  const processingFunction = createProcessingFunction(
    algoliaClient,
    'research-output',
    logger,
  );
  return async (event) => {
    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<ResearchOutputResponse>
    > =>
      researchOutputController.fetch({
        filter: {
          teamId: event.detail.resourceId,
        },
        skip,
        take,
      });

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };
};
const researchOutputDataProvider = getResearchOutputDataProvider();
const researchTagDataProvider = getResearchTagDataProvider();
const externalAuthorDataProvider = getExternalAuthorDataProvider();

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
