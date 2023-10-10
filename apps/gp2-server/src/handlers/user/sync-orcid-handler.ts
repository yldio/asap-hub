import { EventBridgeHandler } from '@asap-hub/server-common';
import UserController from '../../controllers/user.controller';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/user.dependency';
import { UserPayload } from '../event-bus';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';

export const syncOrcidUserHandler =
  (users: UserController): EventBridgeHandler<'UsersPublished', UserPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const { resourceId } = event.detail;

    const userResponse = await users.fetchById(resourceId);

    // skip if orcid is missing or orcidLastSyncDate is given
    if (!userResponse.orcid || userResponse.orcidLastSyncDate) {
      logger.debug(
        `Skipping sync for user ${resourceId} because orcid is missing or it has already been synced`,
      );
      return;
    }
    await users.syncOrcidProfile(resourceId, undefined);
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();

export const handler = sentryWrapper(
  syncOrcidUserHandler(
    new UserController(
      getUserDataProvider(contentfulGraphQLClient),
      getAssetDataProvider(),
    ),
  ),
);
