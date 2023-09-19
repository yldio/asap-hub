import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import { ProjectContentfulDataProvider } from '../../data-providers/project.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { UserPayload } from '../event-bus';

export const indexProjectUserHandler =
  (
    projectController: ProjectController,
    algoliaClient: AlgoliaClient<'gp2'>,
  ): ((
    event: EventBridgeEvent<gp2Model.UserEvent, UserPayload>,
  ) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<gp2Model.ProjectResponse>
    > =>
      projectController.fetch({
        skip,
        take,
        filter: { userId: event.detail.resourceId },
      });

    const processingFunction = async (
      foundProjects: ListResponse<gp2Model.ProjectResponse>,
    ) => {
      logger.debug(
        `Found ${foundProjects.total} projects. Processing ${foundProjects.items.length} projects.`,
      );

      try {
        const projects = foundProjects.items.map((data) => ({
          data,
          type: 'project' as const,
        }));
        logger.debug(`trying to save: ${JSON.stringify(projects, null, 2)}`);
        await algoliaClient.saveMany(projects);
      } catch (err) {
        logger.error('Error occurred during saveMany');
        if (err instanceof Error) {
          logger.error(`The error message: ${err.message}`);
        }
        throw err;
      }

      logger.info(`Updated ${foundProjects.items.length} events.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const projectDataProvider = new ProjectContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexProjectUserHandler(
    new ProjectController(projectDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
