import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
  BatchRequest,
} from '@asap-hub/algolia';
import Users, { UserController } from '../../controllers/users';
import { LabEventType } from '../webhooks/webhook-lab';
import { algoliaIndex } from '../../config';
import logger from '../../utils/logger';

export const indexLabUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): ((
    event: EventBridgeEvent<LabEventType, SquidexWebhookLabPayload>,
  ) => Promise<void>) =>
  async (
    event: EventBridgeEvent<LabEventType, SquidexWebhookLabPayload>,
  ): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const foundUsers = await userController.fetchByLabId(
        event.detail.payload.id,
        { take: 10, skip: 0 },
      );

      if (foundUsers?.total > 0) {
        const algoliaResponse = await algoliaClient.batch(
          foundUsers.items.map(
            (user): BatchRequest => ({
              action: 'updateObject',
              body: user,
            }),
          ),
        );

        logger.debug(
          `Updated ${foundUsers.total} users with algolia response: ${algoliaResponse}`,
        );
      }
    } catch (error) {
      if (error?.output?.statusCode === 404) {
        return;
      }

      throw error;
    }
  };

export type SquidexWebhookLabPayload = {
  type: 'LabsPublished' | 'LabsUpdated' | 'LabsUnpublished' | 'LabsDeleted';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted';
    id: string;
  };
};

export const handler = indexLabUsersHandler(
  new Users(new SquidexGraphql()),
  algoliaSearchClientFactory(algoliaIndex),
);
