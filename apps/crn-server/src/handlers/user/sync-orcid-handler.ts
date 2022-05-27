import { SquidexGraphql } from '@asap-hub/squidex';
import Users, { UserController } from '../../controllers/users';
import createUserDataProvider from '../../data-providers/users';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
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

const squidexGraphqlClient = new SquidexGraphql();
const userDataProvider = createUserDataProvider(squidexGraphqlClient);
export const handler = syncOrcidUserHandler(new Users(userDataProvider));
