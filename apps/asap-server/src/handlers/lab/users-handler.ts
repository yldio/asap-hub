import { EventBridgeEvent } from 'aws-lambda';
import { ListResponse, UserResponse } from '@asap-hub/model';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
  BatchRequest,
} from '@asap-hub/algolia';
import Users, { UserController } from '../../controllers/users';
import { LabEventType } from '../webhooks/webhook-lab';
import { algoliaIndex } from '../../config';
import { loopOverCustomCollection } from '../../utils/migrations';
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
      const fetchFunction = (
        skip: number,
      ): Promise<ListResponse<UserResponse>> =>
        userController.fetchByRelationship('labs', event.detail.payload.id, {
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
