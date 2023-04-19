import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { ListResponse, TeamEvent, UserResponse } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Users, { UserController } from '../../controllers/users';
import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';

export const indexTeamUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): ((event: EventBridgeEvent<TeamEvent, TeamPayload>) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<UserResponse>
    > =>
      userController.fetch({
        filter: {
          teamId: event.detail.payload.id,
        },
        skip,
        take,
      });

    const processingFunction = async (
      foundUsers: ListResponse<UserResponse>,
    ) => {
      logger.info(
        `Found ${foundUsers.total} users. Processing ${foundUsers.items.length} users.`,
      );

      await algoliaClient.saveMany(
        foundUsers.items
          .filter((user) => user.onboarded && user.role !== 'Hidden')
          .map((data) => ({
            data,
            type: 'user',
          })),
      );

      logger.info(`Updated ${foundUsers.total} users.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

const rawHandler = indexTeamUsersHandler(
  new Users(getUserDataProvider(), getAssetDataProvider()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

/* istanbul ignore next */
export const handler = sentryWrapper(rawHandler);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamEvent,
  TeamPayload
>;
