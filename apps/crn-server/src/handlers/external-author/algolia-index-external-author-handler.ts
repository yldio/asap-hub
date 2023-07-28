import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { ExternalAuthorEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ExternalAuthorController from '../../controllers/external-author.controller';
import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalAuthorPayload } from '../event-bus';

export const indexExternalAuthorHandler =
  (
    externalAuthorController: ExternalAuthorController,
    algoliaClient: AlgoliaSearchClient,
  ): EventBridgeHandler<ExternalAuthorEvent, ExternalAuthorPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const getExternalAuthor = async () => {
      try {
        const externalAuthor = await externalAuthorController.fetchById(
          event.detail.resourceId,
        );

        logger.debug(`Fetched external author ${externalAuthor.displayName}`);
        return externalAuthor;
      } catch {
        await algoliaClient.remove(event.detail.resourceId);
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
    new ExternalAuthorController(getExternalAuthorDataProvider()),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);

export type ExternalAuthorIndexEventBridgeEvent = EventBridgeEvent<
  ExternalAuthorEvent,
  ExternalAuthorController
>;
