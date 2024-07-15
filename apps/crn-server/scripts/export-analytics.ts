import { AnalyticsData, EntityResponses } from '@asap-hub/algolia';
import {
  AnalyticsTeamLeadershipResponse,
  documentCategories,
  FilterAnalyticsOptions,
  ListResponse,
  outputTypes,
  TeamProductivityResponse,
  timeRanges,
  UserProductivityResponse,
  UserProductivityTeam,
} from '@asap-hub/model';
import { promises as fs } from 'fs';
import { FileHandle } from 'fs/promises';

import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

export type Metric =
  | 'team-leadership'
  | 'team-productivity'
  | 'user-productivity'
  | 'team-collaboration'
  | 'user-collaboration';

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
  if (metric === 'user-productivity' || metric === 'user-collaboration') {
    for (let i = 0; i < timeRanges.length; i += 1) {
      for (let j = 0; j < documentCategories.length; j += 1) {
        await exportData(metric, file, {
          timeRange: timeRanges[i],
          documentCategory: documentCategories[j],
        });
        if (j != documentCategories.length - 1) {
          await file.write(',');
        }
      }
      if (i != timeRanges.length - 1) {
        await file.write(',');
      }
    }
  } else if (
    metric === 'team-productivity' ||
    metric === 'team-collaboration'
  ) {
    for (let i = 0; i < timeRanges.length; i += 1) {
      for (let j = 0; j < outputTypes.length; j += 1) {
        await exportData(metric, file, {
          timeRange: timeRanges[i],
          outputType: outputTypes[j],
        });
        if (j != outputTypes.length - 1) {
          await file.write(',');
        }
      }
      if (i != timeRanges.length - 1) {
        await file.write(',');
      }
    }
  } else {
    for (let i = 0; i < timeRanges.length; i += 1) {
      await exportData(metric, file, { timeRange: timeRanges[i] });
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
          outputType: filter?.outputType,
        },
      });
    } else if (metric === 'user-productivity') {
      records = await analyticsController.fetchUserProductivity({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: {
          timeRange: filter?.timeRange,
          documentCategory: filter?.documentCategory,
        },
      });
    } else if (metric === 'team-collaboration') {
      records = await analyticsController.fetchTeamCollaboration({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: {
          timeRange: filter?.timeRange,
          outputType: filter?.outputType,
        },
      });
    } else {
      records = await analyticsController.fetchUserCollaboration({
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        filter: {
          timeRange: filter?.timeRange,
          documentCategory: filter?.documentCategory,
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
              documentCategory: filter?.documentCategory,
              outputType: filter?.outputType,
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
): EntityResponses['analytics'][keyof EntityResponses['analytics']] => {
  const payload = {
    ...record,
    _tags: getRecordTags(record, type),
    objectID: `${record.id}-${type}${formatField(
      filter?.timeRange,
    )}${formatField(filter?.documentCategory)}${formatField(
      filter?.outputType,
    )}`,
    __meta: {
      type,
      range: filter?.timeRange,
      documentCategory: filter?.documentCategory,
      outputType: filter?.outputType,
    },
  };

  if ('teams' in record && 'asapOutput' in record) {
    return {
      ...payload,
      ...getUserTeamData(record.teams),
    };
  }

  return payload;
};

const getRecordTags = (record: AnalyticsData, type: Metric): string[] => {
  let tag = '';
  switch (type) {
    case 'team-leadership':
      tag = (record as AnalyticsTeamLeadershipResponse).displayName;
      return tag ? [tag] : [];
    case 'user-productivity':
      const { name, teams } = record as UserProductivityResponse;
      const teamNames = teams.map((team) => team.team);
      return name ? [name].concat(teamNames) : teamNames;
    case 'team-productivity':
      tag = (record as TeamProductivityResponse).name;
      return tag ? [tag] : [];
    default:
      return [];
  }
};

const getUserTeamData = (teams: UserProductivityTeam[]) =>
  teams.length > 1
    ? { team: 'Multiple Teams', role: 'Multiple Roles' }
    : { team: teams[0]?.team ?? 'No team', role: teams[0]?.role ?? 'No role' };

const formatField = (field: string | undefined) => (field ? '-' + field : '');
