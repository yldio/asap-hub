import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import { ListProjectResponse, ProjectMembershipEvent } from '@asap-hub/model';
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
import { addTagsFunction } from '../helper';

type ProjectMembershipPayload = {
  resourceId: string;
};

export const indexProjectMembershipHandler = (
  projectController: ProjectController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((
  event: EventBridgeEvent<ProjectMembershipEvent, ProjectMembershipPayload>,
) => Promise<void>) => {
  const processingFunction = createProcessingFunction<Payload, 'project'>(
    algoliaClient,
    'project',
    logger,
    () => true,
    addTagsFunction<Payload>,
  );

  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const membershipId = event.detail.resourceId;

    try {
      const fetchFunction = ({
        skip,
        take,
      }: LoopOverCustomCollectionFetchOptions): Promise<ListProjectResponse> =>
        projectController.fetch({
          filter: { projectMembershipId: membershipId },
          skip,
          take,
        });

      await loopOverCustomCollection(fetchFunction, processingFunction, 8);
    } catch (error) {
      logger.error(
        error,
        `Error indexing projects for membership id ${membershipId}`,
        event,
      );
      throw error;
    }
  };
};

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexProjectMembershipHandler(
    new ProjectController(getProjectDataProvider()),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
