import { MilestoneEvent } from '@asap-hub/model';
import { EventBridgeHandler, MilestonePayload } from '@asap-hub/server-common';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { exportMetricToOpensearch } from '../../../scripts/opensearch/sync-opensearch-analytics';

export const indexMilestoneOpensearchHandler =
  (): EventBridgeHandler<MilestoneEvent, MilestonePayload> => async (event) => {
    const eventType = event['detail-type'];
    logger.debug(
      `Event ${eventType} - triggering full aims & milestones reindex`,
    );

    await Promise.all([
      exportMetricToOpensearch('project-aims'),
      exportMetricToOpensearch('project-milestones'),
    ]);

    logger.debug('Successfully reindexed project-aims and project-milestones');
  };

/* istanbul ignore next */
export const handler = sentryWrapper(indexMilestoneOpensearchHandler());
