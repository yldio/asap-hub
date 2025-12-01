import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import { ListProjectResponse, TeamEvent } from '@asap-hub/model';
import {
  createProcessingFunction,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import { getProjectDataProvider } from '../../dependencies/projects.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';
import { addTagsFunction } from '../helper';

export const indexTeamProjectsHandler = (
  projectController: ProjectController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((event: EventBridgeEvent<TeamEvent, TeamPayload>) => Promise<void>) => {
  const processingFunction = createProcessingFunction<Payload, 'project'>(
    algoliaClient,
    'project',
    logger,
    () => true,
    addTagsFunction<Payload>,
  );

  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const teamId = event.detail.resourceId;

    try {
      const fetchFunction = ({
        skip,
        take,
      }: LoopOverCustomCollectionFetchOptions): Promise<ListProjectResponse> =>
        projectController.fetchByTeamId(teamId, { skip, take });

      await loopOverCustomCollection(fetchFunction, processingFunction, 8);
    } catch (error) {
      logger.error(
        error,
        `Error indexing projects for team id ${teamId}`,
        event,
      );
      throw error;
    }
  };
};

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexTeamProjectsHandler(
    new ProjectController(getProjectDataProvider()),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
