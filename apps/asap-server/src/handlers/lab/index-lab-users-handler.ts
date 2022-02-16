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
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
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

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<UserResponse>
    > =>
      userController.fetch({
        filter: {
          labId: [event.detail.payload.id],
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

      await algoliaClient.batch(
        foundUsers.items.map(
          (user): BatchRequest => ({
            action: 'updateObject',
            body: user,
          }),
        ),
      );

      logger.info(`Updated ${foundUsers.total} users.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
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
  algoliaSearchClientFactory({
    algoliaApiKey,
    algoliaAppId,
    algoliaIndex,
  }),
);
