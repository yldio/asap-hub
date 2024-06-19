import { AnalyticsData } from '@asap-hub/algolia';
import {
  AnalyticsTeamLeadershipResponse,
  documentTypes,
  FilterAnalyticsOptions,
  ListResponse,
  sharingStatusTypes,
  timeRanges,
} from '@asap-hub/model';
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
    : await exportDataWithFilters(metric, file);

  await file.write(']');
};

const exportDataWithFilters = async (
  metric: Metric,
  file: FileHandle,
): Promise<void> => {
  if (metric === 'user-productivity') {
    for (let i = 0; i < timeRanges.length; i += 1) {
      for (let j = 0; j < documentTypes.length; j += 1) {
        await exportData(metric, file, {
          timeRange: timeRanges[i],
          documentType: documentTypes[j],
        });
        if (j != documentTypes.length - 1) {
          await file.write(',');
        }
      }
      if (i != timeRanges.length - 1) {
        await file.write(',');
      }
    }
  }
  if (metric === 'team-productivity') {
    for (let i = 0; i < timeRanges.length; i += 1) {
      for (let j = 0; j < sharingStatusTypes.length; j += 1) {
        await exportData(metric, file, {
          timeRange: timeRanges[i],
          sharingStatus: sharingStatusTypes[j],
        });
        if (j != sharingStatusTypes.length - 1) {
          await file.write(',');
        }
      }
      if (i != timeRanges.length - 1) {
        await file.write(',');
      }
    }
  }
};

const exportData = async (
  metric: Metric,
  file: FileHandle,
  filter?: FilterAnalyticsOptions,
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
        filter: {
          timeRange: filter?.timeRange,
          documentType: filter?.documentType,
        },
      });
    } else {
      records = await analyticsController.fetchUserProductivity({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: {
          timeRange: filter?.timeRange,
          sharingStatus: filter?.sharingStatus,
        },
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
            transformRecords(record, metric, {
              timeRange: filter?.timeRange,
              documentType: filter?.documentType,
              sharingStatus: filter?.sharingStatus,
            }),
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
  filter?: FilterAnalyticsOptions,
) => ({
  ...record,
  _tags: getRecordTags(record, type),
  objectID: `${record.id}-${type}${formatField(filter?.timeRange)}${formatField(
    filter?.documentType,
  )}${formatField(filter?.sharingStatus)}`,
  __meta: {
    type,
    range: filter?.timeRange,
    documentType: filter?.documentType,
    sharingStatus: filter?.sharingStatus,
  },
});

const getRecordTags = (record: AnalyticsData, type: Metric): string[] => {
  switch (type) {
    case 'team-leadership':
      const teamName = (record as AnalyticsTeamLeadershipResponse).displayName;
      return teamName ? [teamName] : [];
    default:
      return [];
  }
};

const formatField = (field: string | undefined) => (field ? '-' + field : '');
