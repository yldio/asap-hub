import { EventBridgeEvent } from 'aws-lambda';
import { ListResponse, UserResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
  BatchRequest,
} from '@asap-hub/algolia';
import Users, { UserController } from '../../controllers/users';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../webhooks/webhook-teams';
import { loopOverCustomCollection } from '../../utils/migrations';
import logger from '../../utils/logger';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexTeamsUsersHandler =
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

    try {
      const fetchFunction = (
        skip: number,
      ): Promise<ListResponse<UserResponse>> =>
        userController.fetchByRelationship('teams', event.detail.payload.id, {
          skip,
        });

      const processingFunction = async (
        foundUsers: ListResponse<UserResponse>,
      ) => {
        logger.info(
          `Found ${foundUsers.total} users. Processing ${foundUsers.items.length} users.`,
        );

        const algoliaResponse = await algoliaClient.batch(
          foundUsers.items.map(
            (user): BatchRequest => ({
              action: 'updateObject',
              body: user,
            }),
          ),
        );

        logger.info(
          `Updated ${foundUsers.total} users with algolia response: ${algoliaResponse}`,
        );
      };

      await loopOverCustomCollection(fetchFunction, processingFunction);
    } catch (error) {
      if (error?.output?.statusCode === 404) {
        return;
      }

      throw error;
    }
  };

export const handler = indexTeamsUsersHandler(
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamsEventType,
  SquidexWebhookTeamPayload
>;
