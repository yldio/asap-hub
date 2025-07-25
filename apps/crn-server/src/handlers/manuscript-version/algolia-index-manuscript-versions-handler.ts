import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { ManuscriptVersionEvent } from '@asap-hub/model';
import {
  EventBridgeHandler,
  ManuscriptVersionPayload,
} from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ManuscriptVersionController from '../../controllers/manuscript-version.controller';
import { getManuscriptVersionsDataProvider } from '../../dependencies/manuscript-versions.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
export const indexManuscriptVersionHandler =
  (
    manuscriptVersionController: ManuscriptVersionController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<ManuscriptVersionEvent, ManuscriptVersionPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const manuscriptVersionId = event.detail.resourceId;

    try {
      const manuscriptVersionResponse =
        await manuscriptVersionController.fetchById(manuscriptVersionId);
      logger.debug(
        `Fetched details for manuscript version ${manuscriptVersionId}`,
      );

      if (manuscriptVersionResponse) {
        await algoliaClient.remove(manuscriptVersionResponse.id);

        if (manuscriptVersionResponse.versionId) {
          await algoliaClient.save({
            data: manuscriptVersionResponse,
            type: 'manuscript-version',
          });
        }
      }
    } catch (e) {
      logger.error(
        e,
        `Error while reindexing manuscript version ${manuscriptVersionId}.`,
      );
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        logger.error(`Manuscript Version ${manuscriptVersionId} not found`);
        await algoliaClient.remove(manuscriptVersionId);
      }
      throw e;
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexManuscriptVersionHandler(
    new ManuscriptVersionController(getManuscriptVersionsDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);
