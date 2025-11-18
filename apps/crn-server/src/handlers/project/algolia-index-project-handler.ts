import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { ProjectEvent, ProjectResponse } from '@asap-hub/model';
import { EventBridgeHandler, ProjectPayload } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import { getProjectDataProvider } from '../../dependencies/projects.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';

/* istanbul ignore next */
export const indexProjectHandler =
  (
    projectController: ProjectController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<ProjectEvent, ProjectPayload> =>
  async (event) => {
    const eventType = event['detail-type'] as Extract<
      ProjectEvent,
      'ProjectsPublished' | 'ProjectsUnpublished'
    >;
    const projectId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      ProjectsPublished: async () => {
        try {
          const project = await projectController.fetchById(projectId);

          logger.debug(`Fetched project ${projectId}`);

          if (project) {
            await algoliaClient.save({
              data: addTagsFunction(project) as ProjectResponse,
              type: 'project',
            });

            logger.debug(`Project saved ${projectId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(projectId);

            logger.debug(`Project removed ${projectId}`);
            return;
          }

          logger.error(e, 'Error saving project to Algolia');
          throw e;
        }
      },
      ProjectsUnpublished: async () => {
        await algoliaClient.remove(projectId);

        logger.debug(`Project removed ${projectId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexProjectHandler(
    new ProjectController(getProjectDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type ProjectIndexEventBridgeEvent = EventBridgeEvent<
  ProjectEvent,
  ProjectPayload
>;
