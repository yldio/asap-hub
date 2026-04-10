import {
  AimEvent,
  ProjectEvent,
  ProjectMembershipEvent,
} from '@asap-hub/model';
import { EventBridgeHandler } from '@asap-hub/server-common';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { exportMetricToOpensearch } from '../../../scripts/opensearch/sync-opensearch-analytics';

type OpensearchAimEvent = AimEvent | ProjectEvent | ProjectMembershipEvent;

export const indexAimOpensearchHandler =
  (): EventBridgeHandler<OpensearchAimEvent, { resourceId: string }> =>
  async (event) => {
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
export const handler = sentryWrapper(indexAimOpensearchHandler());
