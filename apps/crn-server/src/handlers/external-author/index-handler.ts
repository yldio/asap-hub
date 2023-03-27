import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventBridgeHandler } from '@asap-hub/server-common';
import {
  RestExternalAuthor,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from '../../data-providers/external-authors.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalAuthorEvent, ExternalAuthorPayload } from '../event-bus';

export const indexExternalAuthorHandler =
  (
    externalAuthorDataProvider: ExternalAuthorDataProvider,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ExternalAuthorEvent, ExternalAuthorPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    try {
      const externalAuthor = await externalAuthorDataProvider.fetchById(
        event.detail.payload.id,
      );

      if (!externalAuthor) {
        await algoliaClient.remove(event.detail.payload.id);
        return;
      }

      logger.debug(`Fetched external author ${externalAuthor.displayName}`);

      await algoliaClient.save({
        data: externalAuthor,
        type: 'external-author',
      });

      logger.debug(`Saved external author  ${externalAuthor.displayName}`);
    } catch (e) {
      logger.error(e, 'Error saving external author to Algolia');
      throw e;
    }
  };

const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
  getAuthToken,
  'external-authors',
  {
    appName,
    baseUrl,
  },
);
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexExternalAuthorHandler(
    new ExternalAuthorSquidexDataProvider(
      externalAuthorRestClient,
      squidexGraphqlClient,
    ),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type ExternalAuthorIndexEventBridgeEvent = EventBridgeEvent<
  ExternalAuthorEvent,
  ExternalAuthorDataProvider
>;
