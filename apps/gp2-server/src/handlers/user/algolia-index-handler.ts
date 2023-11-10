import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import UserController from '../../controllers/user.controller';
import { AssetContentfulDataProvider } from '../../data-providers/asset.data-provider';
import { UserContentfulDataProvider } from '../../data-providers/user.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { getTagsNames } from '../../utils/tag-names';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { UserPayload } from '../event-bus';

export const indexUserHandler =
  (
    userController: UserController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.UserEvent, UserPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexUser = async (id: string) => {
      try {
        const user = await userController.fetchById(id);
        log.debug(`Fetched user ${user.id}`);

        if (user.onboarded && user.role !== 'Hidden') {
          const data = {
            ...user,
            _tags: getTagsNames(user.tags),
          };

          await algoliaClient.save({
            data,
            type: 'user',
          });

          log.debug(`Saved user ${user.id}`);
        } else {
          await algoliaClient.remove(event.detail.resourceId);

          logger.debug(`User removed ${user.id}`);
        }
      } catch (e) {
        log.error(e, `Error while reindexing user ${id}`);
        if (
          (isBoom(e) && e.output.statusCode === 404) ||
          e instanceof NotFoundError
        ) {
          log.error(`user ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexUser(event.detail.resourceId);
    } catch (e) {
      log.error(e, `Error while reindexing user ${event.detail.resourceId}`);
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const assetDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexUserHandler(
    new UserController(userDataProvider, assetDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
