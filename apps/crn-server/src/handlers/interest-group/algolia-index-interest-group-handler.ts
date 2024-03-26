import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { InterestGroupEvent, InterestGroupResponse } from '@asap-hub/model';
import {
  EventBridgeHandler,
  InterestGroupPayload,
} from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import InterestGroupController from '../../controllers/interest-group.controller';
import { getInterestGroupDataProvider } from '../../dependencies/interest-groups.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';
import { getUserDataProvider } from '../../dependencies/users.dependencies';

/* istanbul ignore next */
export const indexInterestGroupHandler =
  (
    interestGroupController: InterestGroupController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<InterestGroupEvent, InterestGroupPayload> =>
  async (event) => {
    const eventType = event['detail-type'] as Extract<
      InterestGroupEvent,
      'InterestGroupsPublished' | 'InterestGroupsUnpublished'
    >;
    const interestGroupId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      InterestGroupsPublished: async () => {
        try {
          const interestGroup =
            await interestGroupController.fetchById(interestGroupId);

          logger.debug(`Fetched interestGroup ${interestGroupId}`);

          if (interestGroup) {
            await algoliaClient.save({
              data: addTagsFunction(interestGroup) as InterestGroupResponse,
              type: 'interest-group',
            });

            logger.debug(`InterestGroup saved ${interestGroupId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(interestGroupId);

            logger.debug(`InterestGroup removed ${interestGroupId}`);
            return;
          }

          logger.error(e, 'Error saving interestGroup to Algolia');
          throw e;
        }
      },
      InterestGroupsUnpublished: async () => {
        await algoliaClient.remove(interestGroupId);

        logger.debug(`InterestGroup removed ${interestGroupId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexInterestGroupHandler(
    new InterestGroupController(
      getInterestGroupDataProvider(),
      getUserDataProvider(),
    ),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type InterestGroupIndexEventBridgeEvent = EventBridgeEvent<
  InterestGroupEvent,
  InterestGroupPayload
>;
