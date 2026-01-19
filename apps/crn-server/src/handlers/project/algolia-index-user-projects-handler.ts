import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import { ListProjectResponse, UserEvent } from '@asap-hub/model';
import {
  createProcessingFunction,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
  UserPayload,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import { getProjectDataProvider } from '../../dependencies/projects.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';

export const indexUserProjectsHandler = (
  projectController: ProjectController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((event: EventBridgeEvent<UserEvent, UserPayload>) => Promise<void>) => {
  const processingFunction = createProcessingFunction<Payload, 'project'>(
    algoliaClient,
    'project',
    logger,
    () => true,
    addTagsFunction<Payload>,
  );

  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const userId = event.detail.resourceId;

    try {
      const fetchFunction = ({
        skip,
        take,
      }: LoopOverCustomCollectionFetchOptions): Promise<ListProjectResponse> =>
        projectController.fetchByUserId(userId, {
          skip,
          take,
        });

      await loopOverCustomCollection(fetchFunction, processingFunction, 8);
    } catch (error) {
      logger.error(
        error,
        `Error indexing projects for user id ${userId}`,
        event,
      );
      throw error;
    }
  };
};

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexUserProjectsHandler(
    new ProjectController(getProjectDataProvider()),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
