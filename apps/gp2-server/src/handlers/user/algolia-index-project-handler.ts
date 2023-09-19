import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ProjectController from '../../controllers/project.controller';
import UserController from '../../controllers/user.controller';
import { AssetContentfulDataProvider } from '../../data-providers/asset.data-provider';
import { ProjectContentfulDataProvider } from '../../data-providers/project.data-provider';
import { UserContentfulDataProvider } from '../../data-providers/user.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ProjectPayload } from '../event-bus';

export const indexUserProjectHandler =
  (
    projectController: ProjectController,
    userController: UserController,
    algoliaClient: AlgoliaClient<'gp2'>,
  ): ((
    event: EventBridgeEvent<gp2Model.ProjectEvent, ProjectPayload>,
  ) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);
    const processingFunction = async (
      foundUsers: ListResponse<gp2Model.UserResponse>,
    ) => {
      logger.info(
        `Found ${foundUsers.total} users. Processing ${foundUsers.items.length} users.`,
      );

      try {
        const users = foundUsers.items.map((data) => ({
          data,
          type: 'user' as const,
        }));
        logger.debug(`trying to save: ${JSON.stringify(users, null, 2)}`);
        await algoliaClient.saveMany(users);
      } catch (err) {
        logger.error('Error occurred during saveMany');
        if (err instanceof Error) {
          logger.error(`The error message: ${err.message}`);
        }
        throw err;
      }

      logger.info(`Updated ${foundUsers.items.length} events.`);
    };

    const projectId = event.detail.resourceId;
    const { members: currentMembers } = await projectController.fetchById(
      projectId,
    );
    const currentUserIds = currentMembers.map(({ userId }) => userId);

    const searchUsers = async (page = 0) => {
      const users = await algoliaClient.search(['user'], projectId, {
        page,
        hitsPerPage: 10,
      });
      return {
        userIds: users.hits.map(({ id }) => id),
        nbPages: users.nbPages,
      };
    };

    const { userIds: previousUserIds, nbPages } = await searchUsers();
    for (let page = 1; page < nbPages; page += 1) {
      const { userIds } = await searchUsers(page);
      previousUserIds.concat(userIds);
    }
    const mergedUserIds = [...new Set([...currentUserIds, ...previousUserIds])];

    const take = 10;
    for (let i = 0; i < mergedUserIds.length; i += take) {
      const userIds = mergedUserIds.slice(i, i + take);
      const users = await userController.fetch({
        take,
        filter: { userIds },
      });
      await processingFunction(users);
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const projectDataProvider = new ProjectContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const assetDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexUserProjectHandler(
    new ProjectController(projectDataProvider),
    new UserController(userDataProvider, assetDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
