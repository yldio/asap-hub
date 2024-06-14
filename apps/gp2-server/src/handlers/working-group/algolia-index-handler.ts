import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { NotFoundError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { EventBridgeHandler, Logger } from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import WorkingGroupController from '../../controllers/working-group.controller';
import { WorkingGroupContentfulDataProvider } from '../../data-providers/working-group.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { getTagsNames } from '../../utils/tag-names';
import { WorkingGroupPayload } from '../event-bus';

export const indexWorkingGroupHandler =
  (
    workingGroupController: WorkingGroupController,
    algoliaClient: AlgoliaClient<'gp2'>,
    log: Logger,
  ): EventBridgeHandler<gp2Model.WorkingGroupEvent, WorkingGroupPayload> =>
  async (event) => {
    log.debug(`Event ${event['detail-type']}`);

    const reindexWorkingGroup = async (id: string) => {
      try {
        const workingGroup = await workingGroupController.fetchById(id);
        log.debug(`Fetched workingGroup ${workingGroup.id}`);

        const data = {
          ...workingGroup,
          _tags: getTagsNames(workingGroup.tags),
        };

        await algoliaClient.save({
          data,
          type: 'working-group',
        });

        log.debug(`Saved workingGroup ${workingGroup.id}`);

        return workingGroup;
      } catch (e) {
        log.error(e, `Error while reindexing workingGroup ${id}`);
        if (
          (isBoom(e) && e.output.statusCode === 404) ||
          e instanceof NotFoundError
        ) {
          log.error(`WorkingGroup ${id} not found`);
          await algoliaClient.remove(id);
        }
        throw e;
      }
    };

    try {
      await reindexWorkingGroup(event.detail.resourceId);
    } catch (e) {
      log.error(
        e,
        `Error while reindexing workingGroup ${event.detail.resourceId}`,
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

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  indexWorkingGroupHandler(
    new WorkingGroupController(workingGroupDataProvider),
    algoliaSearchClientFactory({
      algoliaApiKey,
      algoliaAppId,
      algoliaIndex,
    }),
    logger,
  ),
);
