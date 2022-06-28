import {
  AlgoliaSearchClient,
  algoliaSearchClientFactory,
} from '@asap-hub/algolia';
import { ListResponse, UserResponse } from '@asap-hub/model';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndex,
  appName,
  baseUrl,
} from '../../config';
import Users, { UserController } from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import {
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '../../utils/loop-over-custom-colection';
import { LabEvent, LabPayload } from '../event-bus';

export const indexLabUsersHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaSearchClient,
  ): ((event: EventBridgeEvent<LabEvent, LabPayload>) => Promise<void>) =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<
      ListResponse<UserResponse>
    > =>
      userController.fetch({
        filter: {
          labId: [event.detail.payload.id],
        },
        skip,
        take,
      });

    const processingFunction = async (
      foundUsers: ListResponse<UserResponse>,
    ) => {
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

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userSquidexRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userSquidexRestClient,
);
const assetDataProvider = new AssetSquidexDataProvider(userSquidexRestClient);
export const handler = indexLabUsersHandler(
  new Users(userDataProvider, assetDataProvider),
  algoliaSearchClientFactory({
    algoliaApiKey,
    algoliaAppId,
    algoliaIndex,
  }),
);
