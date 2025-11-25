import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { ListProjectResponse, ProjectMembershipEvent } from '@asap-hub/model';
import {
  createProcessingFunction,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
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

const isNotFoundError = (e: unknown): e is Error =>
  (isBoom(e) && e.output.statusCode === 404) || e instanceof NotFoundError;

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
      if (isNotFoundError(error)) {
        logger.warn(
          {
            membershipId,
            detailType: event['detail-type'],
            originalError: (error as Error).message,
          },
          'ProjectMembership event received but no associated projects found',
        );
        return;
      }
      logger.error(error, 'Error indexing projects for membership');
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
