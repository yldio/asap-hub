import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import {
  EventBridgeHandler,
  UserEvent,
  UserPayload,
} from '@asap-hub/server-common';
import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { isBoom, Boom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import Users, { UserController } from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
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
      if (isBoom(e) && (e as Boom).output.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);

        logger.debug(`User removed ${event.detail.payload.id}`);
        return;
      }

      logger.error(e, 'Error saving user to Algolia');
      throw e;
    }
  };

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser, InputUser>(
  getAuthToken,
  'users',
  {
    appName,
    baseUrl,
  },
);
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetSquidexDataProvider(userRestClient);

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexUserHandler(
    new Users(userDataProvider, assetDataProvider),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  UserEvent,
  UserPayload
>;
