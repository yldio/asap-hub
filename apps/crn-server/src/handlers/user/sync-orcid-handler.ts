import { DateTime } from 'luxon';
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

    // skip if orcidLastSyncDate is less than 24 hours ago
    if (
      !userResponse.orcid ||
      (userResponse.orcidLastSyncDate &&
        DateTime.fromISO(userResponse.orcidLastSyncDate) >
          DateTime.now().minus({ hours: 24 }))
    ) {
      logger.debug(
        `Skipping sync for user ${resourceId} as orcidLastSyncDate is less than 24 hours ago`,
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
