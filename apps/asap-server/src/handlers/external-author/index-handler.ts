import { EventBridgeEvent } from 'aws-lambda';
import { SquidexGraphql } from '@asap-hub/squidex';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import logger from '../../utils/logger';
import ExternalAuthors, {
  ExternalAuthorsController,
} from '../../controllers/external-authors';
import {
  ExternalAuthorEventType,
  SquidexWebhookExternalAuthorPayload,
} from '../webhooks/webhook-external-author';
import { EventBridgeHandler } from '../../utils/types';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';

export const indexExternalAuthorHandler =
  (
    externalauthorController: ExternalAuthorsController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<
    ExternalAuthorEventType,
    SquidexWebhookExternalAuthorPayload
  > =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const externalauthor = await externalauthorController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched external author ${externalauthor.displayName}`);

      await algoliaClient.save({
        data: {
          ...externalauthor,
          id: event.detail.payload.id,
        },
        type: 'external-author',
      });

      logger.debug(`Saved external author  ${externalauthor.displayName}`);
    } catch (e) {
      if (e?.output?.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }

      logger.error(e, 'Error saving external author to Algolia');
      throw e;
    }
  };

export const handler = indexExternalAuthorHandler(
  new ExternalAuthors(new SquidexGraphql()),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type ExternalAuthorIndexEventBridgeEvent = EventBridgeEvent<
  ExternalAuthorEventType,
  ExternalAuthorsController
>;
