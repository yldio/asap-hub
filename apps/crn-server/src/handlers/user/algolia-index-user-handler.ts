import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import {
  toUserListItem,
  UserEvent,
  TeamMembershipEvent,
  UserResponse,
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
        sys: { id: string };
      };
    };
  };
};

type IndexUserEvent = UserEvent | TeamMembershipEvent;
type IndexUserPayload = UserPayload | TeamMembershipPayload;

const isTeamMembershipEvent = (type: string): type is TeamMembershipEvent =>
  type.startsWith('TeamMembership');

const isNotFoundError = (e: unknown): boolean =>
  (isBoom(e) && e.output.statusCode === 404) || e instanceof NotFoundError;

const shouldIndexUser = (
  user: Pick<UserResponse, 'onboarded' | 'role'>,
): boolean => Boolean(user.onboarded) && user.role !== 'Hidden';

async function fetchUserFromTeamMembership(
  userController: UserController,
  membershipId: string,
): Promise<UserResponse> {
  const userList = await userController.fetch({
    filter: { teamMembershipId: membershipId },
    take: 1,
    skip: 0,
  });

  const first = userList.items[0];
  if (!first) {
    throw new NotFoundError(
      undefined,
      `user with teamMembershipId ${membershipId} not found`,
    );
  }

  logger.debug(
    { membershipId, userId: first.id, detailType: 'TeamMembership' },
    'Resolved user from TeamMembership',
  );

  return userController.fetchById(first.id);
}

async function fetchUserFromEvent(
  userController: UserController,
  detailType: string,
  payload: IndexUserPayload | TeamMembershipPayload,
): Promise<UserResponse> {
  if (isTeamMembershipEvent(detailType)) {
    return fetchUserFromTeamMembership(userController, payload.resourceId);
  }

  const user = await userController.fetchById(payload.resourceId);
  logger.debug({ userId: user.id, detailType }, 'Fetched user by resourceId');
  return user;
}

async function syncUserToAlgolia(
  algolia: AlgoliaClient<'crn'>,
  user: UserResponse,
): Promise<void> {
  if (shouldIndexUser(user)) {
    await algolia.save({ data: toUserListItem(user), type: 'user' });
    logger.debug({ userId: user.id }, 'User indexed');
  } else {
    await algolia.remove(user.id);
    logger.debug({ userId: user.id }, 'User removed (not indexable)');
  }
}

async function handleNotFoundError(
  algolia: AlgoliaClient<'crn'>,
  detailType: string,
  resourceId: string,
): Promise<void> {
  if (isTeamMembershipEvent(detailType)) {
    throw new NotFoundError(
      undefined,
      'Cannot handle TeamMembership event for missing user',
    );
  }
  await algolia.remove(resourceId);
  logger.debug(
    { userId: resourceId, detailType },
    'User removed (not found on fetchById)',
  );
}

/* istanbul ignore next */
export const indexUserHandler = (
  userController: UserController,
  algoliaClient: AlgoliaClient<'crn'>,
): EventBridgeHandler<IndexUserEvent, IndexUserPayload> => {
  return async (event) => {
    const detailType = event['detail-type'];
    logger.debug({ detailType }, 'Received event');

    try {
      const user = await fetchUserFromEvent(
        userController,
        detailType,
        event.detail,
      );
      await syncUserToAlgolia(algoliaClient, user);
    } catch (error) {
      if (isNotFoundError(error)) {
        await handleNotFoundError(
          algoliaClient,
          detailType,
          (event.detail as { resourceId: string }).resourceId,
        );
        return;
      }
      logger.error(error, 'Error saving user to Algolia');
      throw error;
    }
  };
};

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
