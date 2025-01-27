import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { ManuscriptEvent } from '@asap-hub/model';
import { EventBridgeHandler, ManuscriptPayload } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ManuscriptController from '../../controllers/manuscript.controller';
import { getManuscriptsDataProvider } from '../../dependencies/manuscripts.dependencies';
import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';
import { getAssetDataProvider } from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
export const indexManuscriptHandler =
  (
    manuscriptController: ManuscriptController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<ManuscriptEvent, ManuscriptPayload> =>
  async (event) => {
    const eventType = event['detail-type'] as Extract<
      ManuscriptEvent,
      'ManuscriptsPublished' | 'ManuscriptsUnpublished'
    >;
    const manuscriptId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      ManuscriptsPublished: async () => {
        try {
          const { items } = await manuscriptController.fetch({
            filter: {
              sys: {
                id: manuscriptId,
              },
            },
          });
          const manuscript = items[0];

          logger.debug(`Fetched manuscript ${manuscriptId}`);

          if (manuscript) {
            await algoliaClient.save({
              data: manuscript,
              type: 'manuscript',
            });

            logger.debug(`Manuscript saved ${manuscriptId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(manuscriptId);

            logger.debug(`Manuscript removed ${manuscriptId}`);
            return;
          }

          logger.error(e, 'Error saving manuscript to Algolia');
          throw e;
        }
      },
      ManuscriptsUnpublished: async () => {
        await algoliaClient.remove(manuscriptId);

        logger.debug(`Manuscript removed ${manuscriptId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexManuscriptHandler(
    new ManuscriptController(
      getManuscriptsDataProvider(),
      getExternalAuthorDataProvider(),
      getAssetDataProvider(),
    ),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type ManuscriptIndexEventBridgeEvent = EventBridgeEvent<
  ManuscriptEvent,
  ManuscriptPayload
>;
