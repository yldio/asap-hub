import 'source-map-support/register';

import { Handler } from 'aws-lambda/handler';
import { EventBridgeHandler } from '@asap-hub/server-common';
import {
  RestWorkingGroup,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { WorkingGroupDeliverable, DeliverableStatus } from '@asap-hub/model';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { WorkingGroupEvent, WorkingGroupPayload } from '../event-bus';
import {
  WorkingGroupDataProvider,
  WorkingGroupSquidexDataProvider,
} from '../../data-providers/working-groups.data-provider';
import { getAuthToken } from '../../utils/auth';
import { appName, baseUrl } from '../../config';

type PartialMapping<T extends string> = { [S in T]?: T };

export const workingGroupUpdateHandler =
  (
    dataProvider: WorkingGroupDataProvider,
  ): EventBridgeHandler<WorkingGroupEvent, WorkingGroupPayload> =>
  async (event) => {
    logger.info(
      `Received ${event.detail.type} event for ${event.detail.payload.data?.title?.iv}`,
    );

    const {
      detail: {
        payload: { id },
      },
    } = event;
    const workingGroup = await dataProvider.fetchById(id);

    if (!workingGroup) {
      return;
    }

    const mapping: PartialMapping<DeliverableStatus> = workingGroup.complete
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
        `Updating deliverable statuses for working group ${event.detail.payload.data?.title?.iv}`,
      );
      await dataProvider.patch(id, { deliverables });
    } else {
      logger.info(
        `No deliverable statuses to update for working group ${event.detail.payload.data?.title?.iv}`,
      );
    }
  };

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});

const squidexRestClient = new SquidexRest<RestWorkingGroup>(
  getAuthToken,
  'working-groups',
  {
    appName,
    baseUrl,
  },
);

const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
  squidexGraphqlClient,
  squidexRestClient,
);

export const handler: Handler = sentryWrapper(
  workingGroupUpdateHandler(workingGroupDataProvider),
);
