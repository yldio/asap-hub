import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ExternalAuthors, {
  ExternalAuthorsController,
} from '../../controllers/external-authors';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalAuthorEvent, ExternalAuthorPayload } from '../event-bus';
import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';

export const indexExternalAuthorHandler =
  (
    externalAuthorController: ExternalAuthorsController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ExternalAuthorEvent, ExternalAuthorPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const getExternalAuthor = async () => {
      try {
        const externalAuthor = await externalAuthorController.fetchById(
          event.detail.payload.id,
        );

        logger.debug(`Fetched external author ${externalAuthor.displayName}`);
        return externalAuthor;
      } catch {
        await algoliaClient.remove(event.detail.payload.id);
        return null;
      }
    };

    const externalAuthor = await getExternalAuthor();

    if (externalAuthor) {
      try {
        await algoliaClient.save({
          data: externalAuthor,
          type: 'external-author',
        });

        logger.debug(`Saved external author  ${externalAuthor.displayName}`);
      } catch (e) {
        logger.error(e, 'Error saving external author to Algolia');
        throw e;
      }
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexExternalAuthorHandler(
    new ExternalAuthors(getExternalAuthorDataProvider()),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);

export type ExternalAuthorIndexEventBridgeEvent = EventBridgeEvent<
  ExternalAuthorEvent,
  ExternalAuthorsController
>;
