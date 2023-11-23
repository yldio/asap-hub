import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { ResearchOutputEvent, toAlgoliaResearchOutput } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import ResearchOutputController from '../../controllers/research-output.controller';
import { getExternalAuthorDataProvider } from '../../dependencies/external-authors.dependencies';
import { getResearchOutputDataProvider } from '../../dependencies/research-outputs.dependencies';
import { getResearchTagDataProvider } from '../../dependencies/research-tags.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ResearchOutputPayload } from '../event-bus';

export const indexResearchOutputHandler =
  (
    researchOutputController: ResearchOutputController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<ResearchOutputEvent, ResearchOutputPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const reindexResearchOutput = async (id: string) => {
      try {
        const researchOutput = await researchOutputController.fetchById(id);
        logger.debug(`Fetched research-output ${researchOutput.id}`);

        if (!researchOutput.published) {
          await algoliaClient.remove(id);
          logger.debug(`Removed research-output ${researchOutput.id}`);
          return researchOutput;
        }

        await algoliaClient.save({
          data: toAlgoliaResearchOutput(researchOutput),
          type: 'research-output',
        });

        logger.debug(`Saved research-output ${researchOutput.id}`);

        return researchOutput;
      } catch (e) {
        logger.error(e, `Error while reindexing research output ${id}`);
        if (
          (isBoom(e) && e.output.statusCode === 404) ||
          e instanceof NotFoundError
        ) {
          logger.error(`Research output ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      const researchOutput = await reindexResearchOutput(
        event.detail.resourceId,
      );

      for (const relatedResearchOutput of researchOutput.relatedResearch) {
        await reindexResearchOutput(relatedResearchOutput.id);
      }
    } catch (e) {
      logger.error(
        e,
        `Error while reindexing research output ${event.detail.resourceId} and its related research outputs`,
      );
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        return;
      }
      throw e;
    }
  };

const researchOutputDataProvider = getResearchOutputDataProvider();
const researchTagDataProvider = getResearchTagDataProvider();
const externalAuthorDataProvider = getExternalAuthorDataProvider();

export const handler = sentryWrapper(
  indexResearchOutputHandler(
    new ResearchOutputController(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    ),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
