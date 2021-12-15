import { EventBridgeEvent } from 'aws-lambda';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { UserEventType, UserWebhookPayload } from '../webhooks/webhook-user';
import {
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaUserIndex,
} from '../../config';
import logger from '../../utils/logger';
import Users, { UserController } from '../../controllers/users';

export const indexUserHandler = (
  userController: UserController,
  algoliaClient: SearchClient,
): ((
  event: EventBridgeEvent<UserEventType, UserWebhookPayload>,
) => Promise<void>) => {
  const algoliaIndex = algoliaClient.initIndex(algoliaUserIndex);

  return async (
    event: EventBridgeEvent<UserEventType, UserWebhookPayload>,
  ): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const user = await userController.fetchById(event.detail.payload.id);

      logger.debug(`Fetched user ${user.id}`);

      await algoliaIndex.saveObject({
        ...user,
        objectID: user.id,
      });

      logger.debug(`Saved user ${user.id}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        await algoliaIndex.deleteObject(event.detail.payload.id);
        return;
      }
      throw e;
    }
  };
};

export const handler = indexUserHandler(
  new Users(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
