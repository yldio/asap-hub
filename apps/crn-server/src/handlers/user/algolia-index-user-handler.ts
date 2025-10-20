import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import {
  toUserListItem,
  UserEvent,
  TeamMembershipEvent,
} from '@asap-hub/model';
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

type TeamMembershipPayload = {
  resourceId: string;
  fields: {
    team: {
      'en-US': {
        sys: {
          id: string;
        };
      };
    };
  };
};

/* istanbul ignore next */
export const indexUserHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<
    UserEvent | TeamMembershipEvent,
    UserPayload | TeamMembershipPayload
  > =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      let user;
      let userId: string;

      if (event['detail-type'].startsWith('TeamMembership')) {
        // For TeamMembership events, get the user via teamMembershipId filter
        const membershipPayload = event.detail as TeamMembershipPayload;
        const userList = await userController.fetch({
          filter: { teamMembershipId: membershipPayload.resourceId },
          take: 1,
          skip: 0,
        });

        if (userList.items.length === 0 || !userList.items[0]) {
          throw new NotFoundError(
            undefined,
            `user with teamMembershipId ${membershipPayload.resourceId} not found`,
          );
        }

        const userListItem = userList.items[0];
        userId = userListItem.id;
        logger.debug(
          `Fetched user ${userId} from teamMembership ${membershipPayload.resourceId}`,
        );

        // Convert UserListItemDataObject to UserResponse by fetching full user details
        user = await userController.fetchById(userId);
      } else {
        // For User events, use the resourceId directly
        user = await userController.fetchById(event.detail.resourceId);
        userId = user.id;
        logger.debug(`Fetched user ${userId}`);
      }

      if (user.onboarded && user.role !== 'Hidden') {
        await algoliaClient.save({
          data: toUserListItem(user),
          type: 'user',
        });

        logger.debug(`User saved ${userId}`);
      } else {
        await algoliaClient.remove(userId);

        logger.debug(`User removed ${userId}`);
      }
    } catch (e) {
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        // For TeamMembership events, we can't remove by membership ID, so we skip removal
        if (!event['detail-type'].startsWith('TeamMembership')) {
          await algoliaClient.remove(event.detail.resourceId);
          logger.debug(`User removed ${event.detail.resourceId}`);
        }
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
  UserEvent | TeamMembershipEvent,
  UserPayload | TeamMembershipPayload
>;
