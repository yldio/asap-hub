import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { LabEvent, ListUserResponse } from '@asap-hub/model';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getAssetDataProvider,
  getResearchTagsDataProvider,
  getUserDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { LabPayload } from '../event-bus';

export const indexLabUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): ((event: EventBridgeEvent<LabEvent, LabPayload>) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<ListUserResponse> =>
      userController.fetch({
        filter: {
          labId: event.detail.resourceId,
        },
        skip,
        take,
      });

    const processingFunction = async (foundUsers: ListUserResponse) => {
      logger.info(
        `Found ${foundUsers.total} users. Processing ${foundUsers.items.length} users.`,
      );

      await algoliaClient.saveMany(
        foundUsers.items
          .filter((user) => user.onboarded && user.role !== 'Hidden')
          .map((data) => ({
            data,
            type: 'user',
          })),
      );

      logger.info(`Updated ${foundUsers.total} users.`);
    };

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexLabUsersHandler(
    new UserController(
      getUserDataProvider(),
      getAssetDataProvider(),
      getResearchTagsDataProvider(),
    ),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
  ),
);
