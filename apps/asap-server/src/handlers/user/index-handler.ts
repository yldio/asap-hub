import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import logger from '../../utils/logger';
import Users, { UserController } from '../../controllers/users';
import { UserEventType } from '../webhooks/webhook-user';
import { EventBridgeHandler } from '../../utils/types';

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

      await algoliaClient.save(user);

      logger.debug(`Saved user ${user.id}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }

      logger.error(e, 'Error saving user to Algolia');
      throw e;
    }
  };

export type SquidexWebhookUserPayload = {
  type:
    | 'UsersPublished'
    | 'UsersCreated'
    | 'UsersUpdated'
    | 'UsersUnpublished'
    | 'UsersDeleted';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted' | 'Created';
    id: string;
  };
};

export const handler = indexUserHandler(
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory(),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  'UserPublished' | 'UserCreated' | 'UserUpdated' | 'UserDeleted',
  SquidexWebhookUserPayload
>;
