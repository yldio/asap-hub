import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { ListResponse, UserResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import Users, { UserController } from '../../controllers/users';
import createUserDataProvider from '../../data-providers/users';
import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { TeamEvent, TeamPayload } from '../event-bus';

export const indexTeamUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): ((event: EventBridgeEvent<TeamEvent, TeamPayload>) => Promise<void>) =>
  async (event: EventBridgeEvent<TeamEvent, TeamPayload>): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<UserResponse>
    > =>
      userController.fetch({
        filter: {
          teamId: [event.detail.payload.id],
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

const squidexGraphqlClient = new SquidexGraphql();
const userDataProvider = createUserDataProvider(squidexGraphqlClient);
export const handler = indexTeamUsersHandler(
  new Users(userDataProvider),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamEvent,
  TeamPayload
>;
