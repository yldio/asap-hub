import {
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import { promises as fs } from 'fs';

import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

export type Metric = 'team-leadership';

export const exportAnalyticsData = async (
  metric: Metric,
  filename?: string,
): Promise<void> => {
  const analyticsController = new AnalyticsController(
    getAnalyticsDataProvider(),
  );
  const file = await fs.open(filename || `${metric}.json`, 'w');
  let recordCount = 0;
  let total: number;
  let records: ListAnalyticsTeamLeadershipResponse;
  let page = 1;

  await file.write('[\n');

  do {
    records = await analyticsController.fetchTeamLeadership({
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    });

    total = records.total;

    if (page != 1) {
      await file.write(',\n');
    }

    await file.write(
      JSON.stringify(
        records.items.map((record) => transformRecords(record, metric)),
        null,
        2,
      ).slice(1, -1),
    );

    page++;
    recordCount += records.items.length;
  } while (total > recordCount);

  await file.write(']');

  console.log(`Finished exporting ${recordCount} records`);
};

const transformRecords = (
  record: AnalyticsTeamLeadershipResponse,
  type: Metric,
) => ({
  ...record,
  objectID: record.id,
  __meta: {
    type,
  },
});
