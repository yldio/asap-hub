import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import ResearchOutputs, { UserController } from '../../controllers/users';
import { LabEventType } from '../webhooks/webhook-lab';
import { algoliaIndex } from '../../config';
import logger from '../../utils/logger';

export const indexResearchOutputHandler =
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
      const foundUsers = await userController.fetch({
        search: `labs/id eq "${event.id}"`,
      });

      if (foundUsers?.total > 0) {
        for (const user of foundUsers.items) {
          await algoliaClient.save(user);

          logger.debug(`Saved user ${user.id}`);
        }
      }
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        return;
      }

      throw e;
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

export const handler = indexResearchOutputHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliaSearchClientFactory(algoliaIndex),
);
