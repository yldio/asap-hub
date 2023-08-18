import { AlgoliaClient } from '@asap-hub/algolia';
import { gp2 as gp2Model, ListResponse } from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import ProjectController from '../../controllers/project.controller';
import logger from '../../utils/logger';
import { UserPayload } from '../event-bus';

export const indexUserEventsHandler =
  (
    projectController: ProjectController,
    algoliaClient: AlgoliaClient<'gp2'>,
  ): ((
    event: EventBridgeEvent<gp2Model.UserEvent, UserPayload>,
  ) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<gp2Model.ProjectResponse>
    > =>
      projectController.fetch({
        skip,
        take,
        filter: { userId: event.detail.resourceId },
      });

    const processingFunction = async (
      foundProjects: ListResponse<gp2Model.ProjectResponse>,
    ) => {
      logger.info(
        `Found ${foundProjects.total} events. Processing ${foundProjects.items.length} projects.`,
      );

      await algoliaClient.saveMany(
        foundProjects.items.map((data) => ({
          data,
          type: 'project',
        })),
      );

      logger.info(`Updated ${foundProjects.items.length} events.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

// const eventDataProvider = getEventDataProvider();
// /* istanbul ignore next */
// export const handler = sentryWrapper(
//   indexUserEventsHandler(
//     new Events(eventDataProvider),
//     algoliaSearchClientFactory({
//       algoliaApiKey,
//       algoliaAppId,
//       algoliaIndex,
//     }),
//   ),
// );
