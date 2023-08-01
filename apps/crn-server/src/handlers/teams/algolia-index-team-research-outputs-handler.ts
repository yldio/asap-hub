import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import {
  ListResponse,
  ResearchOutputResponse,
  TeamEvent,
} from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ResearchOutputController from '../../controllers/research-output.controller';

import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';
import { getResearchOutputDataProvider } from '../../dependencies/research-outputs.dependencies';
import { getResearchTagDataProvider } from '../../dependencies/research-tags.dependencies';

import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';

export const indexResearchOutputByTeamHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaSearchClient<'crn'>,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
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

    const processingFunction = async (
      foundOutputs: ListResponse<ResearchOutputResponse>,
    ) => {
      logger.info(
        `Found ${foundOutputs.total} research outputs. Processing ${foundOutputs.items.length} research outputs.`,
      );

      await algoliaClient.saveMany(
        foundOutputs.items.map((data) => ({
          data,
          type: 'research-output',
        })),
      );

      logger.info(`Updated ${foundOutputs.total} research outputs.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
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
