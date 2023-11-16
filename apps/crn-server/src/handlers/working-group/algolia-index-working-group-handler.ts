import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { WorkingGroupEvent, WorkingGroupResponse } from '@asap-hub/model';
import {
  EventBridgeHandler,
  WorkingGroupPayload,
} from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import WorkingGroupController from '../../controllers/working-group.controller';
import { getWorkingGroupDataProvider } from '../../dependencies/working-groups.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { addTagsFunction } from '../helper';

/* istanbul ignore next */
export const indexWorkingGroupHandler =
  (
    workingGroupController: WorkingGroupController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<WorkingGroupEvent, WorkingGroupPayload> =>
  async (event) => {
    const eventType = event['detail-type'] as Extract<
      WorkingGroupEvent,
      'WorkingGroupsPublished' | 'WorkingGroupsUnpublished'
    >;
    const workingGroupId = event.detail.resourceId;
    logger.debug(`Event ${eventType}`);

    const eventHandlers = {
      WorkingGroupsPublished: async () => {
        try {
          const workingGroup = await workingGroupController.fetchById(
            workingGroupId,
          );

          logger.debug(`Fetched workingGroup ${workingGroupId}`);

          if (workingGroup) {
            await algoliaClient.save({
              data: addTagsFunction(workingGroup) as WorkingGroupResponse,
              type: 'working-group',
            });

            logger.debug(`WorkingGroup saved ${workingGroupId}`);
          }
        } catch (e) {
          if (
            (isBoom(e) && (e as Boom).output.statusCode === 404) ||
            e instanceof NotFoundError
          ) {
            await algoliaClient.remove(workingGroupId);

            logger.debug(`WorkingGroup removed ${workingGroupId}`);
            return;
          }

          logger.error(e, 'Error saving workingGroup to Algolia');
          throw e;
        }
      },
      WorkingGroupsUnpublished: async () => {
        await algoliaClient.remove(workingGroupId);

        logger.debug(`WorkingGroup removed ${workingGroupId}`);
      },
    };

    await eventHandlers[eventType]();
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexWorkingGroupHandler(
    new WorkingGroupController(getWorkingGroupDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type WorkingGroupIndexEventBridgeEvent = EventBridgeEvent<
  WorkingGroupEvent,
  WorkingGroupPayload
>;
