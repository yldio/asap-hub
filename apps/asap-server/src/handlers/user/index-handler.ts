import {
  algoliasearch,
  SearchClient,
} from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  algoliaAppId,
  algoliaIndexApiKey,
} from '../../config';
import logger from '../../utils/logger';
import { UserController } from '../../controllers/users';
import { UserEventBridgeEvent } from './invite-handler';

export const indexUserHandler = (
  userController: UserController,
  algoliaClient: SearchClient,
): ((event: UserEventBridgeEvent) => Promise<void>) => {
  // const searchIndex = new ResearchOutputSearchIndex(
  //   algoliaClient.initIndex(algoliaResearchOutputIndex),
  // );

  return async (event: UserEventBridgeEvent): Promise<void> => {
    logger.debug(`Event ${event['detail-type']}`);

    // try {
    //   const researchOutput = await userController.fetchById(
    //     event.detail.payload.id,
    //   );

    //   logger.debug(`Fetched research-output ${researchOutput.id}`);

    //   await searchIndex.save(researchOutput);

    //   logger.debug(`Saved research-output ${researchOutput.id}`);
    // } catch (e) {
    //   if (e?.output?.statusCode === 404) {
    //     await searchIndex.remove(event.detail.payload.id);
    //     return;
    //   }
    //   throw e;
    // }
  };
};

export type SquidexWebhookResearchOutputPayload = {
  type:
    | 'ResearchOutputsPublished'
    | 'ResearchOutputsUpdated'
    | 'ResearchOutputsUnpublished'
    | 'ResearchOutputsDeleted';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Published' | 'Updated' | 'Unpublished' | 'Deleted';
    id: string;
  };
};

export const handler = indexUserHandler(
  new ResearchOutputs(new SquidexGraphql()),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
