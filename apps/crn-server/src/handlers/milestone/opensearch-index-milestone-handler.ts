import { MilestoneEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import type { AimsMilestonesDataProvider } from '../../data-providers/types';
import { getAimsMilestonesDataProvider } from '../../dependencies/aims-milestones.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  reindexMilestoneById,
  reindexAimsByMilestoneId,
  deleteMilestoneById,
} from '../opensearch/aims-milestones-reindex';

export const indexMilestoneOpensearchHandler =
  (
    provider: AimsMilestonesDataProvider,
  ): EventBridgeHandler<MilestoneEvent, { resourceId: string }> =>
  async (event) => {
    const eventType = event['detail-type'];
    const milestoneId = event.detail.resourceId;
    logger.debug(`Event ${eventType} for milestone ${milestoneId}`);

    if (eventType === 'MilestonesPublished') {
      await reindexMilestoneById(provider, milestoneId);
      await reindexAimsByMilestoneId(provider, milestoneId);
    } else {
      // Aim refresh is deferred to the scheduled full reindex: the milestone
      // is already gone from Contentful so we can't resolve its linked aims.
      await deleteMilestoneById(milestoneId);
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexMilestoneOpensearchHandler(getAimsMilestonesDataProvider()),
);
