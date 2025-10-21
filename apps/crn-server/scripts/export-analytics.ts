import { AnalyticsData, EntityResponses } from '@asap-hub/algolia';
import {
  AnalyticsTeamLeadershipResponse,
  documentCategories,
  EngagementResponse,
  FilterAnalyticsOptions,
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

import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

export const exportAnalyticsData = async (
  metric: Metric,
  filename?: string,
): Promise<void> => {
  console.log(`Starting export for metric: ${metric}`);
  const file = await fs.open(filename || `${metric}.json`, 'w');

  try {
    await file.write('[\n');

    const allData = await fetchAllDataWithFilters(metric);

    const jsonData = allData
      .map((item) => JSON.stringify(item, null, 2))
      .join(',\n');

    await file.write(jsonData);
    await file.write('\n]');

    console.log(
      `Finished exporting ${allData.length} records for metric: ${metric}`,
    );
  } finally {
    await file.close();
  }
};

const getFilterCombinations = (metric: Metric): FilterAnalyticsOptions[] => {
  switch (metric) {
    case 'team-leadership':
      return [{}];

    case 'user-productivity':
    case 'user-collaboration':
      return timeRanges.flatMap((timeRange) =>
        documentCategories.map((documentCategory) => ({
          timeRange,
          documentCategory,
        })),
      );

    case 'team-productivity':
    case 'team-collaboration':
      return timeRanges.flatMap((timeRange) =>
        outputTypes.map((outputType) => ({
          timeRange,
          outputType,
        })),
      );

    case 'engagement':
    default:
      return timeRanges.map((timeRange) => ({ timeRange }));
  }
};

const fetchAllDataWithFilters = async (
  metric: Metric,
): Promise<
  EntityResponses['analytics'][keyof EntityResponses['analytics']][]
> => {
  const filterCombinations = getFilterCombinations(metric);

  const results = await Promise.all(
    filterCombinations.map((filter) => fetchAllData(metric, filter)),
  );

  return results.flat();
};

const fetchAllData = async (
  metric: Metric,
  filter?: FilterAnalyticsOptions,
): Promise<
  EntityResponses['analytics'][keyof EntityResponses['analytics']][]
> => {
  const analyticsController = new AnalyticsController(
    getAnalyticsDataProvider(),
  );

  const allRecords: EntityResponses['analytics'][keyof EntityResponses['analytics']][] =
    [];
  let page = 1;
  let total = 0;

  const fetchRecords = async (currentPage: number) => {
    const options = {
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
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

  const firstPage = await fetchRecords(page);
  if (!firstPage) return allRecords;

  total = firstPage.total;
  allRecords.push(
    ...firstPage.items.map((record) =>
      transformRecords(record, metric, {
        timeRange: filter?.timeRange,
        documentCategory: filter?.documentCategory,
        outputType: filter?.outputType,
      }),
    ),
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (totalPages > 1) {
    const remainingPages = Array.from(
      { length: totalPages - 1 },
      (_, i) => i + 2,
    );

    const BATCH_SIZE = 5;
    for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
      const batch = remainingPages.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((pageNum) => fetchRecords(pageNum)),
      );

      results.forEach((result) => {
        if (result) {
          allRecords.push(
            ...result.items.map((record) =>
              transformRecords(record, metric, {
                timeRange: filter?.timeRange,
                documentCategory: filter?.documentCategory,
                outputType: filter?.outputType,
              }),
            ),
          );
        }
      });
    }
  }

  return allRecords;
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
