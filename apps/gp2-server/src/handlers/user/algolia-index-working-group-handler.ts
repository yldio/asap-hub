import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';
import { createProcessingFunction } from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import UserController from '../../controllers/user.controller';
import WorkingGroupController from '../../controllers/working-group.controller';
import { AssetContentfulDataProvider } from '../../data-providers/asset.data-provider';
import { UserContentfulDataProvider } from '../../data-providers/user.data-provider';
import { WorkingGroupContentfulDataProvider } from '../../data-providers/working-group.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { WorkingGroupPayload } from '../event-bus';

export const indexUserWorkingGroupHandler = (
  workingGroupController: WorkingGroupController,
  userController: UserController,
  algoliaClient: AlgoliaClient<'gp2'>,
): ((
  event: EventBridgeEvent<gp2Model.WorkingGroupEvent, WorkingGroupPayload>,
) => Promise<void>) => {
  const processingFunction = createProcessingFunction(
    algoliaClient,
    'user',
    logger,
  );
  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const workingGroupId = event.detail.resourceId;
    const { members: currentMembers } =
      await workingGroupController.fetchById(workingGroupId);
    const currentUserIds = currentMembers.map(({ userId }) => userId);

    const searchUsers = async (page = 0) => {
      const users = await algoliaClient.search(['user'], workingGroupId, {
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
};

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
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
  indexUserWorkingGroupHandler(
    new WorkingGroupController(workingGroupDataProvider),
    new UserController(userDataProvider, assetDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
