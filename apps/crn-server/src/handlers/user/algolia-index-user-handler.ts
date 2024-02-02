import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { toUserListItem, UserEvent } from '@asap-hub/model';
import { EventBridgeHandler, UserPayload } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getAssetDataProvider,
  getUserDataProvider,
  getResearchTagsDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
export const indexUserHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<UserEvent, UserPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const user = await userController.fetchById(event.detail.resourceId);

      logger.debug(`Fetched user ${user.id}`);

      if (user.onboarded && user.role !== 'Hidden') {
        await algoliaClient.save({
          data: toUserListItem(user),
          type: 'user',
        });

        logger.debug(`User saved ${user.id}`);
      } else {
        await algoliaClient.remove(event.detail.resourceId);

        logger.debug(`User removed ${user.id}`);
      }
    } catch (e) {
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        await algoliaClient.remove(event.detail.resourceId);

        logger.debug(`User removed ${event.detail.resourceId}`);
        return;
      }

      logger.error(e, 'Error saving user to Algolia');
      throw e;
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexUserHandler(
    new UserController(
      getUserDataProvider(),
      getAssetDataProvider(),
      getResearchTagsDataProvider(),
    ),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  UserEvent,
  UserPayload
>;
