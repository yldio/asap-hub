import { AnalyticsData, EntityResponses } from '@asap-hub/algolia';
import {
  AnalyticsTeamLeadershipResponse,
  documentCategories,
  EngagementResponse,
  FilterAnalyticsOptions,
  ListResponse,
  Metric,
  outputTypes,
  TeamCollaborationResponse,
  TeamProductivityResponse,
  timeRanges,
  UserCollaborationResponse,
  UserCollaborationTeam,
  UserProductivityResponse,
  UserProductivityTeam,
} from '@asap-hub/model';
import { promises as fs } from 'fs';
import { FileHandle } from 'fs/promises';

import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

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
  switch (metric) {
    case 'user-productivity':
    case 'user-collaboration':
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
      break;

    case 'team-productivity':
    case 'team-collaboration':
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

      break;

    case 'engagement':
    default:
      for (let i = 0; i < timeRanges.length; i += 1) {
        await exportData(metric, file, { timeRange: timeRanges[i] });
        if (i != timeRanges.length - 1) {
          await file.write(',');
        }
      }
      break;
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

  const fetchRecords = async () => {
    const options = {
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      filter: {
        timeRange: filter?.timeRange,
        documentCategory: filter?.documentCategory,
        outputType: filter?.outputType,
      },
    };

    switch (metric) {
      case 'team-leadership':
        return analyticsController.fetchTeamLeadership(options);
      case 'team-productivity':
        return analyticsController.fetchTeamProductivity(options);
      case 'user-productivity':
        return analyticsController.fetchUserProductivity(options);
      case 'team-collaboration':
        return analyticsController.fetchTeamCollaboration(options);
      case 'user-collaboration':
        return analyticsController.fetchUserCollaboration(options);
      default:
        return analyticsController.fetchEngagement(options);
    }
  };

  do {
    records = await fetchRecords();

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

  if ('teams' in record) {
    return {
      ...payload,
      ...getUserTeamData(record.teams),
    };
  }

  return payload;
};

const formatTags = (
  metricOption: 'user' | 'team',
  name: string,
  teamNames: string[],
): string[] => {
  if (metricOption === 'user')
    return name ? [name].concat(teamNames) : teamNames;
  return name ? [name] : [];
};
const getRecordTags = (record: AnalyticsData, type: Metric): string[] => {
  let teamNames = [];
  switch (type) {
    case 'team-leadership':
      return formatTags(
        'team',
        (record as AnalyticsTeamLeadershipResponse).displayName,
        [],
      );
    case 'user-productivity':
      const userProductivityResponse = record as UserProductivityResponse;
      teamNames = userProductivityResponse.teams.map((team) => team.team);
      return formatTags('user', userProductivityResponse.name, teamNames);
    case 'user-collaboration':
      const userCollaborationResponse = record as UserCollaborationResponse;
      teamNames = userCollaborationResponse.teams.map((team) => team.team);
      return formatTags('user', userCollaborationResponse.name, teamNames);
    case 'team-productivity':
      return formatTags('team', (record as TeamProductivityResponse).name, []);
    case 'team-collaboration':
      return formatTags('team', (record as TeamCollaborationResponse).name, []);
    case 'engagement':
      return formatTags('team', (record as EngagementResponse).name, []);
    default:
      return [];
  }
};

const getUserTeamData = (
  teams: UserProductivityTeam[] | UserCollaborationTeam[],
) =>
  teams.length > 1
    ? { team: 'Multiple Teams', role: 'Multiple Roles' }
    : { team: teams[0]?.team ?? 'No team', role: teams[0]?.role ?? 'No role' };

const formatField = (field: string | undefined) => (field ? '-' + field : '');
