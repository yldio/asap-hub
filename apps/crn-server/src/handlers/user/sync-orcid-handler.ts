import { EventBridgeHandler } from '@asap-hub/server-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../config';
import Users, { UserController } from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { UserEvent, UserPayload } from '../event-bus';

export const syncOrcidUserHandler =
  (users: UserController): EventBridgeHandler<UserEvent, UserPayload> =>
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

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
export const handler = syncOrcidUserHandler(
  new Users(userDataProvider, assetDataProvider),
);
