import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import {
  RestUser,
  SquidexGraphql,
  SquidexRest,
  getAccessTokenFactory,
} from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
  clientId,
  clientSecret,
} from '../../config';
import Users, { UserController } from '../../controllers/users';
import UserDataProvider from '../../data-providers/users.data-provider';
import AssetDataProvider from '../../data-providers/assets.data-provider';
import logger from '../../utils/logger';
import { EventBridgeHandler } from '../../utils/types';
import { UserEvent, UserPayload } from '../event-bus';

export const indexUserHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const user = await userController.fetchById(event.detail.payload.id);

      logger.debug(`Fetched user ${user.id}`);

      if (user.onboarded && user.role !== 'Hidden') {
        await algoliaClient.save({
          data: user,
          type: 'user',
        });

        logger.debug(`User saved ${user.id}`);
      } else {
        await algoliaClient.remove(event.detail.payload.id);

        logger.debug(`User removed ${user.id}`);
      }
    } catch (e) {
      if (isBoom(e) && e.output.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);

        logger.debug(`User removed ${event.detail.payload.id}`);
        return;
      }

      logger.error(e, 'Error saving user to Algolia');
      throw e;
    }
  };

const getAuthToken = getAccessTokenFactory({ clientId, clientSecret, baseUrl });
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetDataProvider(userRestClient);

export const handler = indexUserHandler(
  new Users(userDataProvider, assetDataProvider),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  UserEvent,
  UserPayload
>;
