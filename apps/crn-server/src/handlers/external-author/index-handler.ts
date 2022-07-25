import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { SquidexGraphql } from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import ExternalAuthors, {
  ExternalAuthorsController,
} from '../../controllers/external-authors';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { ExternalAuthorEvent, ExternalAuthorPayload } from '../event-bus';

export const indexExternalAuthorHandler =
  (
    externalAuthorController: ExternalAuthorsController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ExternalAuthorEvent, ExternalAuthorPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const externalAuthor = await externalAuthorController.fetchById(
        event.detail.payload.id,
      );

      logger.debug(`Fetched external author ${externalAuthor.displayName}`);

      await algoliaClient.save({
        data: externalAuthor,
        type: 'external-author',
      });

      logger.debug(`Saved external author  ${externalAuthor.displayName}`);
    } catch (e) {
      if (isBoom(e) && e.output.statusCode === 404) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }

      logger.error(e, 'Error saving external author to Algolia');
      throw e;
    }
  };
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});

export const handler = indexExternalAuthorHandler(
  new ExternalAuthors(squidexGraphqlClient),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

export type ExternalAuthorIndexEventBridgeEvent = EventBridgeEvent<
  ExternalAuthorEvent,
  ExternalAuthorsController
>;
