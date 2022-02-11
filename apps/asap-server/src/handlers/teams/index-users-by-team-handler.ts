import { EventBridgeEvent } from 'aws-lambda';
import { UserResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
  BatchRequest,
} from '@asap-hub/algolia';
import Users, { UserController } from '../../controllers/users';
import Teams, { TeamController } from '../../controllers/teams';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../webhooks/webhook-teams';
import logger from '../../utils/logger';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexTeamsUsersHandler =
  (
    teamController: TeamController,
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
      const team = await teamController.fetchById(event.detail.payload.id);

      logger.info(`Found ${team?.members?.length || 0} team members.`);

      const usersPromise = await Promise.allSettled(
        team?.members?.map(({ id }) => userController.fetchById(id)) ?? [],
      );
      const fullfiledUsersPromises = usersPromise.filter(
        ({ status }) => status === 'fulfilled',
      ) as { value: UserResponse }[];
      const batchRequests = fullfiledUsersPromises.map(
        ({ value }): BatchRequest => ({
          action: 'updateObject',
          body: value,
        }),
      );

      logger.info(`Fetched ${batchRequests.length} users.`);

      const algoliaResponse = await algoliaClient.batch(batchRequests);

      logger.info(
        `Updated ${batchRequests.length} users with algolia response: ${algoliaResponse}`,
      );
    } catch (error) {
      if (error?.output?.statusCode === 404) {
        return;
      }

      throw error;
    }
  };

export const handler = indexTeamsUsersHandler(
  new Teams(new SquidexGraphql()),
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamsEventType,
  SquidexWebhookTeamPayload
>;
