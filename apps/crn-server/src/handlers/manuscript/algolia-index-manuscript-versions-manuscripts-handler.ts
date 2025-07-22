import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { ManuscriptEvent } from '@asap-hub/model';
import { EventBridgeHandler, ManuscriptPayload } from '@asap-hub/server-common';
import { Boom, isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ManuscriptVersionController from '../../controllers/manuscript-version.controller';
import { getManuscriptVersionsDataProvider } from '../../dependencies/manuscript-versions.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
export const indexManuscriptVersionsManuscriptHandler =
  (
    manuscriptVersionController: ManuscriptVersionController,
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
          const { items } = await manuscriptVersionController.fetch({
            filter: {
              sys: {
                id: manuscriptId,
              },
            },
          });
          const manuscriptVersion = items[0];

          logger.debug(`Fetched latest version for manuscript ${manuscriptId}`);

          if (manuscriptVersion) {
            await algoliaClient.save({
              data: manuscriptVersion,
              type: 'manuscript-version',
            });

            logger.debug(`Manuscript saved ${manuscriptId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            logger.debug(
              `Attempting to reindex versions for manuscript ${manuscriptId}`,
            );
            return;
          }

          logger.error(e, 'Error updating manuscript versions in Algolia');
          throw e;
        }
      },
      ManuscriptsUnpublished: async () => {
        const relatedVersionRecords = await algoliaClient.search(
          ['manuscript-version'],
          'manuscriptId',
        );
        for (const record of relatedVersionRecords.hits) {
          await algoliaClient.remove(record.id);
          logger.debug(`Manuscript version removed ${record.id}`);
        }
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexManuscriptVersionsManuscriptHandler(
    new ManuscriptVersionController(getManuscriptVersionsDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);
