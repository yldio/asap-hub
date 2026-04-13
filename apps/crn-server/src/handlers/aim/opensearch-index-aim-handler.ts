import {
  AimEvent,
  ProjectEvent,
  ProjectMembershipEvent,
  SupplementGrantEvent,
} from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import type { AimsMilestonesDataProvider } from '../../data-providers/types';
import { getAimsMilestonesDataProvider } from '../../dependencies/aims-milestones.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  reindexAimById,
  deleteAimById,
  deleteMilestonesByAimId,
  reindexByProjectId,
  deleteByProjectId,
} from '../opensearch/aims-milestones-reindex';

type OpensearchAimEvent =
  | AimEvent
  | ProjectEvent
  | ProjectMembershipEvent
  | SupplementGrantEvent;

export const indexAimOpensearchHandler =
  (
    provider: AimsMilestonesDataProvider,
  ): EventBridgeHandler<OpensearchAimEvent, { resourceId: string }> =>
  async (event) => {
    const eventType = event['detail-type'];
    const { resourceId } = event.detail;
    logger.debug(`Event ${eventType} for resource ${resourceId}`);

    if (eventType === 'AimsPublished' || eventType === 'AimsUnpublished') {
      if (eventType === 'AimsPublished') {
        await reindexAimById(provider, resourceId);
      } else {
        await deleteAimById(resourceId);
        await deleteMilestonesByAimId(provider, resourceId);
      }
      return;
    }

    if (
      eventType === 'ProjectsPublished' ||
      eventType === 'ProjectsUnpublished'
    ) {
      if (eventType === 'ProjectsPublished') {
        await reindexByProjectId(provider, resourceId);
      } else {
        await deleteByProjectId(provider, resourceId);
      }
      return;
    }

    if (
      eventType === 'ProjectMembershipPublished' ||
      eventType === 'ProjectMembershipUnpublished'
    ) {
      const projectId = await provider.fetchProjectIdByMembershipId(resourceId);
      if (projectId) {
        await reindexByProjectId(provider, projectId);
      }
      return;
    }

    if (
      eventType === 'SupplementGrantPublished' ||
      eventType === 'SupplementGrantUnpublished'
    ) {
      const projectId =
        await provider.fetchProjectIdBySupplementGrantId(resourceId);
      if (projectId) {
        await reindexByProjectId(provider, projectId);
      }
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexAimOpensearchHandler(getAimsMilestonesDataProvider()),
);
