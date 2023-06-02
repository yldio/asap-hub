import 'source-map-support/register';

import { Handler } from 'aws-lambda/handler';
import { EventBridgeHandler } from '@asap-hub/server-common';
import {
  WorkingGroupDeliverable,
  DeliverableStatus,
  WorkingGroupEvent,
} from '@asap-hub/model';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { WorkingGroupPayload } from '../event-bus';
import { WorkingGroupDataProvider } from '../../data-providers/types';
import { getWorkingGroupDataProvider } from '../../dependencies/working-groups.dependencies';

type DeliverableStatusMapping = {
  [S in DeliverableStatus]?: DeliverableStatus;
};

export const workingGroupUpdateHandler =
  (
    dataProvider: WorkingGroupDataProvider,
  ): EventBridgeHandler<WorkingGroupEvent, WorkingGroupPayload> =>
  async (event) => {
    const workingGroupId = event.detail.resourceId;
    logger.info(
      `Received ${event['detail-type']} event for working group with id ${event.detail.resourceId}`,
    );

    const workingGroup = await dataProvider.fetchById(workingGroupId);

    if (!workingGroup) {
      throw new Error(`Working group ${workingGroupId} could not be found.`);
    }

    const mapping: DeliverableStatusMapping = workingGroup.complete
      ? {
          Pending: 'Not Started',
          'In Progress': 'Incomplete',
        }
      : {
          'Not Started': 'Pending',
          Incomplete: 'In Progress',
        };

    const deliverables = workingGroup.deliverables.map(
      (deliverable: WorkingGroupDeliverable): WorkingGroupDeliverable => ({
        ...deliverable,
        status: mapping[deliverable.status] || deliverable.status,
      }),
    );
    const changed = deliverables.some(
      (deliverable, i) =>
        deliverable.status !== workingGroup.deliverables[i]?.status,
    );

    if (changed) {
      logger.info(
        `Updating deliverable statuses for working group with id ${workingGroupId}`,
      );
      await dataProvider.update(workingGroupId, { deliverables });
    } else {
      logger.info(
        `No deliverable statuses to update for working group with id ${workingGroupId}`,
      );
    }
  };

export const handler: Handler = sentryWrapper(
  workingGroupUpdateHandler(getWorkingGroupDataProvider()),
);
