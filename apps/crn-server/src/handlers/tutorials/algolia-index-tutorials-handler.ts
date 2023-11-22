import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { TutorialEvent, TutorialsResponse } from '@asap-hub/model';
import { EventBridgeHandler, TutorialPayload } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import TutorialController from '../../controllers/tutorial.controller';
import { getTutorialDataProvider } from '../../dependencies/tutorial.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';

/* istanbul ignore next */
export const indexTutorialHandler =
  (
    tutorialController: TutorialController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<TutorialEvent, TutorialPayload> =>
  async (event) => {
    const eventType = event['detail-type'] as Extract<
      TutorialEvent,
      'TutorialsPublished' | 'TutorialsUnpublished'
    >;
    const tutorialId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      TutorialsPublished: async () => {
        try {
          const tutorial = await tutorialController.fetchById(tutorialId);

          logger.debug(`Fetched tutorial ${tutorialId}`);

          if (tutorial) {
            await algoliaClient.save({
              data: addTagsFunction(tutorial) as TutorialsResponse,
              type: 'tutorial',
            });

            logger.debug(`Tutorial saved ${tutorialId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(tutorialId);

            logger.debug(`Tutorial removed ${tutorialId}`);
            return;
          }

          logger.error(e, 'Error saving tutorial to Algolia');
          throw e;
        }
      },
      TutorialsUnpublished: async () => {
        await algoliaClient.remove(tutorialId);

        logger.debug(`Tutorial removed ${tutorialId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexTutorialHandler(
    new TutorialController(getTutorialDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type TutorialIndexEventBridgeEvent = EventBridgeEvent<
  TutorialEvent,
  TutorialPayload
>;
