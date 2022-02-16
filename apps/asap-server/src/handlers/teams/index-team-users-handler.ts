import { EventBridgeEvent } from 'aws-lambda';
import { ListResponse, UserResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import Users, { UserController } from '../../controllers/users';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../webhooks/webhook-teams';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import logger from '../../utils/logger';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexTeamUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): ((
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ) => Promise<void>) =>
  async (
    event: EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>,
  ): Promise<void> => {
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

      await algoliaClient.saveMany(foundUsers.items);

      logger.info(`Updated ${foundUsers.total} users.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

export const handler = indexTeamUsersHandler(
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamsEventType,
  SquidexWebhookTeamPayload
>;
