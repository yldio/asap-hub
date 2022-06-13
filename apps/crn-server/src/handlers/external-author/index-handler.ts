import { EventBridgeEvent } from 'aws-lambda';
import { getAccessTokenFactory, SquidexGraphql } from '@asap-hub/squidex';
import { isBoom } from '@hapi/boom';
import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import logger from '../../utils/logger';
import ExternalAuthors, {
  ExternalAuthorsController,
} from '../../controllers/external-authors';
import { ExternalAuthorEvent, ExternalAuthorPayload } from '../event-bus';
import { EventBridgeHandler } from '../../utils/types';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
  clientId,
  clientSecret,
} from '../../config';

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
const getAuthToken = getAccessTokenFactory({ clientId, clientSecret, baseUrl });
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
