import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import logger from '../../utils/logger';
import Users, { UserController } from '../../controllers/users';
import {
  UserEventType,
  SquidexWebhookUserPayload,
} from '../webhooks/webhook-user';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexUserHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<UserEventType, SquidexWebhookUserPayload> =>
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
      if (e?.output?.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);

        logger.debug(`User removed ${event.detail.payload.id}`);
        return;
      }

      logger.error(e, 'Error saving user to Algolia');
      throw e;
    }
  };

export const handler = indexUserHandler(
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  'UserPublished' | 'UserCreated' | 'UserUpdated' | 'UserDeleted',
  SquidexWebhookUserPayload
>;
