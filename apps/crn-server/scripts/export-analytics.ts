import { AnalyticsData } from '@asap-hub/algolia';
import { ListResponse, TimeRangeOption, timeRanges } from '@asap-hub/model';
import { promises as fs } from 'fs';
import { FileHandle } from 'fs/promises';

import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

export type Metric =
  | 'team-leadership'
  | 'team-productivity'
  | 'user-productivity';

export const exportAnalyticsData = async (
  metric: Metric,
  filename?: string,
): Promise<void> => {
  const file = await fs.open(filename || `${metric}.json`, 'w');

  await file.write('[\n');
  metric === 'team-leadership'
    ? await exportData(metric, file)
    : await exportDataForRange(metric, file);

  await file.write(']');
};

const exportDataForRange = async (
  metric: Metric,
  file: FileHandle,
): Promise<void> => {
  for (let i = 0; i < timeRanges.length; i += 1) {
    await exportData(metric, file, timeRanges[i]);
    if (i != timeRanges.length - 1) {
      await file.write(',');
    }
  }
};

const exportData = async (
  metric: Metric,
  file: FileHandle,
  range?: TimeRangeOption,
): Promise<void> => {
  const analyticsController = new AnalyticsController(
    getAnalyticsDataProvider(),
  );

  let recordCount = 0;
  let total = 0;
  let records: ListResponse<AnalyticsData> | null = null;
  let page = 1;
  do {
    if (metric === 'team-leadership') {
      records = await analyticsController.fetchTeamLeadership({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });
    } else if (metric === 'team-productivity') {
      records = await analyticsController.fetchTeamProductivity({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: range,
      });
    } else {
      records = await analyticsController.fetchUserProductivity({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: range,
      });
    }

    if (records) {
      total = records.total;

      if (page != 1) {
        await file.write(',\n');
      }

      await file.write(
        JSON.stringify(
          records.items.map((record) =>
            transformRecords(record, metric, range),
          ),
          null,
          2,
        ).slice(1, -1),
      );

      page++;
      recordCount += records.items.length;
    }
  } while (total > recordCount);
  console.log(`Finished exporting ${recordCount} records`);
};

const transformRecords = (
  record: AnalyticsData,
  type: Metric,
  range?: TimeRangeOption,
) => ({
  ...record,
  objectID: `${record.id}-${type}-${range}`,
  __meta: {
    type,
    range,
  },
});
