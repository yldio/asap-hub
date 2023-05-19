import { UserEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import Users, { UserController } from '../../controllers/users';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';
import { UserPayload } from '../event-bus';

export const syncOrcidUserHandler =
  (users: UserController): EventBridgeHandler<UserEvent, UserPayload> =>
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

export const handler = sentryWrapper(
  syncOrcidUserHandler(
    new Users(getUserDataProvider(), getAssetDataProvider()),
  ),
);
