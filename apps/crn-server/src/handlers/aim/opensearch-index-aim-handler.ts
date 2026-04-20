import { AimEvent, ProjectEvent, SupplementGrantEvent } from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import type { AimsMilestonesDataProvider } from '../../data-providers/types';
import { getAimsMilestonesDataProvider } from '../../dependencies/aims-milestones.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  deleteAimById,
  reindexByProjectId,
  deleteByProjectId,
} from '../opensearch/aims-milestones-reindex';

type OpensearchAimEvent = AimEvent | ProjectEvent | SupplementGrantEvent;

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
        // Reindex the entire project so that milestones removed from this aim
        // also get refreshed (their aimNumbers may have changed).
        const project =
          await provider.fetchProjectWithAimsDetailByAimId(resourceId);
        if (project) {
          await reindexByProjectId(provider, project.sys.id);
        } else {
          logger.debug(
            `Aim ${resourceId}: could not resolve parent project, skipping`,
          );
        }
      } else {
        // Milestone cleanup is deferred to the scheduled full reindex: the
        // aim is already gone from Contentful so we can't resolve its
        // linked milestones to check for orphans.
        await deleteAimById(resourceId);
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
        await deleteByProjectId(resourceId);
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
      } else {
        logger.debug(
          `SupplementGrant ${resourceId}: could not resolve parent project, skipping`,
        );
      }
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexAimOpensearchHandler(getAimsMilestonesDataProvider()),
);
