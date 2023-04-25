import { UserEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { SquidexWebhookPayload, User } from '@asap-hub/squidex';
import Users, { UserController } from '../../controllers/users';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';

export const syncOrcidUserHandler =
  (
    users: UserController,
  ): EventBridgeHandler<UserEvent, SquidexWebhookPayload<User, UserEvent>> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const { payload, type: eventType } = event.detail;
    const { id } = payload;

    const newOrcid = payload.data.orcid?.iv;

    if (eventType === 'UsersCreated') {
      if (newOrcid) {
        await users.syncOrcidProfile(id, undefined);
      }
    }

    if (eventType === 'UsersUpdated') {
      if (newOrcid && newOrcid !== payload.dataOld?.orcid?.iv) {
        await users.syncOrcidProfile(id, undefined);
      }
    }
  };

export const handler = sentryWrapper(
  syncOrcidUserHandler(
    new Users(getUserDataProvider(), getAssetDataProvider()),
  ),
);
