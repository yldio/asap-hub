import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { ExternalUserPayload } from '../event-bus';
import ExternalUserController from '../../controllers/external-user.controller';
import { ExternalUserContentfulDataProvider } from '../../data-providers/external-user.data-provider';

export const indexExternalUserHandler =
  (
    externalUserController: ExternalUserController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.ExternalUserEvent, ExternalUserPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexExternalUser = async (id: string) => {
      try {
        const externalUser = await externalUserController.fetchById(id);
        log.debug(`Fetched external user ${externalUser.id}`);

        await algoliaClient.save({
          data: externalUser,
          type: 'external-user',
        });

        log.debug(`Saved external user ${externalUser.id}`);
      } catch (e) {
        log.error(e, `Error while reindexing external user ${id}`);
        if (isBoom(e) && e.output.statusCode === 404) {
          log.error(`external user ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexExternalUser(event.detail.resourceId);
    } catch (e) {
      log.error(
        e,
        `Error while reindexing external user ${event.detail.resourceId}`,
      );
      if (isBoom(e) && e.output.statusCode === 404) {
        return;
      }
      throw e;
    }
  };

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const externalUserDataProvider = new ExternalUserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexExternalUserHandler(
    new ExternalUserController(externalUserDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
