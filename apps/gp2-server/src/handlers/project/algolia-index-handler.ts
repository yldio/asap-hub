import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import { ProjectContentfulDataProvider } from '../../data-providers/project.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { getTagsNames } from '../../utils/tag-names';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ProjectPayload } from '../event-bus';

export const indexProjectHandler =
  (
    projectController: ProjectController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.ProjectEvent, ProjectPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexProject = async (id: string) => {
      try {
        const project = await projectController.fetchById(id);
        log.debug(`Fetched project ${project.id}`);

        const data = {
          ...project,
          _tags: getTagsNames(project.tags),
        };

        await algoliaClient.save({
          data,
          type: 'project',
        });

        log.debug(`Saved project ${project.id}`);

        return project;
      } catch (e) {
        log.error(e, `Error while reindexing project ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          log.error(`Project ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexProject(event.detail.resourceId);
    } catch (e) {
      log.error(e, `Error while reindexing project ${event.detail.resourceId}`);
      if (isBoom(e) && e.output.statusCode === 404) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const projectDataProvider = new ProjectContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexProjectHandler(
    new ProjectController(projectDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
