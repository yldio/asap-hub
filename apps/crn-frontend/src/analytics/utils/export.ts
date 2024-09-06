import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListResponse,
  MetricExportKeys,
  metricsSheetName,
  TimeRangeOption,
} from '@asap-hub/model';
import { Stringifier } from 'csv-stringify/browser/esm';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
} from '../collaboration/api';
import {
  teamCollaborationAcrossTeamToCSV,
  teamCollaborationWithinTeamToCSV,
  userCollaborationToCSV,
} from '../collaboration/export';
import { getEngagement } from '../engagement/api';
import { engagementToCSV } from '../engagement/export';
import { getAnalyticsLeadership } from '../leadership/api';
import { leadershipToCSV } from '../leadership/export';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../productivity/api';
import {
  teamProductivityToCSV,
  userProductivityToCSV,
} from '../productivity/export';

export const getAllData = async <T>(
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Promise<
    ListResponse<T> | undefined
  >,
  transform: (result: T) => Record<string, unknown>,
) => {
  let allData: unknown[] = [];
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: 50,
    });
    if (data) {
      const nbPages = data.total / 50;
      allData = allData.concat(data.items.map(transform));
      currentPage += 1;
      morePages = currentPage <= nbPages;
    } else {
      morePages = false;
    }
  }

  return allData;
};

export const downloadAnalyticsXLSX =
  (client: AlgoliaClient<'analytics'>) =>
  async (timeRange: TimeRangeOption, metrics: Set<MetricExportKeys>) => {
    const workbook = XLSX.utils.book_new();

    const documentCategory = 'all';
    const outputType = 'all';
    const sort = 'team_asc';
    const tags: string[] = [];

    const processMetric = async <T, V>(
      metricKey: MetricExportKeys,
      fetchPerformance: () => Promise<T | undefined>,
      fetchAllData: (
        paginationParams: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
      ) => Promise<ListResponse<V> | undefined>,
      transform: (performance: T) => (result: V) => Record<string, unknown>,
    ) => {
      const performance = await fetchPerformance();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = await getAllData(fetchAllData, transform(performance!));
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        metricsSheetName[metricKey],
      );
    };

    const metricHandlers: Record<MetricExportKeys, () => Promise<void>> = {
      'user-productivity': () =>
        processMetric(
          'user-productivity',
          () =>
            getUserProductivityPerformance(client, {
              timeRange,
              documentCategory: 'all',
            }),
          (paginationParams) =>
            getUserProductivity(client, {
              timeRange,
              documentCategory,
              sort,
              tags,
              ...paginationParams,
            }),
          userProductivityToCSV,
        ),
      'team-productivity': () =>
        processMetric(
          'team-productivity',
          () =>
            getTeamProductivityPerformance(client, {
              timeRange,
              outputType: 'all',
            }),
          (paginationParams) =>
            getTeamProductivity(client, {
              timeRange,
              outputType: 'all',
              sort: 'team_asc',
              tags: [],
              ...paginationParams,
            }),
          teamProductivityToCSV,
        ),
      'user-collaboration-within': () =>
        processMetric(
          'user-collaboration-within',
          () =>
            getUserCollaborationPerformance(client, {
              timeRange,
              documentCategory: 'all',
            }),
          (paginationParams) =>
            getUserCollaboration(client, {
              timeRange,
              documentCategory,
              sort,
              tags,
              ...paginationParams,
            }),
          (performance) =>
            userCollaborationToCSV(
              'within-team',
              performance,
              documentCategory,
            ),
        ),
      'user-collaboration-across': () =>
        processMetric(
          'user-collaboration-across',
          () =>
            getUserCollaborationPerformance(client, {
              timeRange,
              documentCategory: 'all',
            }),
          (paginationParams) =>
            getUserCollaboration(client, {
              timeRange,
              documentCategory,
              sort,
              tags,
              ...paginationParams,
            }),
          (performance) =>
            userCollaborationToCSV(
              'across-teams',
              performance,
              documentCategory,
            ),
        ),
      'team-collaboration-within': () =>
        processMetric(
          'team-collaboration-within',
          () =>
            getTeamCollaborationPerformance(client, {
              timeRange,
              outputType: 'all',
            }),
          (paginationParams) =>
            getTeamCollaboration(client, {
              timeRange,
              outputType,
              sort,
              tags,
              ...paginationParams,
            }),
          (performance) =>
            teamCollaborationWithinTeamToCSV(performance, outputType),
        ),
      'team-collaboration-across': () =>
        processMetric(
          'team-collaboration-across',
          () =>
            getTeamCollaborationPerformance(client, {
              timeRange,
              outputType: 'all',
            }),
          (paginationParams) =>
            getTeamCollaboration(client, {
              timeRange,
              outputType,
              sort,
              tags,
              ...paginationParams,
            }),
          (performance) =>
            teamCollaborationAcrossTeamToCSV(performance, outputType),
        ),
      'wg-leadership': () =>
        processMetric(
          'wg-leadership',
          async () => undefined,
          (paginationParams) =>
            getAnalyticsLeadership(client, {
              tags,
              ...paginationParams,
            }),
          () => leadershipToCSV('working-group'),
        ),
      'ig-leadership': () =>
        processMetric(
          'ig-leadership',
          async () => undefined,
          (paginationParams) =>
            getAnalyticsLeadership(client, {
              tags,
              ...paginationParams,
            }),
          () => leadershipToCSV('interest-group'),
        ),
      engagement: () =>
        processMetric(
          'engagement',
          async () => undefined,
          (paginationParams) =>
            getEngagement(client, { tags: [], timeRange, ...paginationParams }),
          () => engagementToCSV,
        ),
    };

    for (const metric of metrics) {
      // eslint-disable-next-line no-await-in-loop
      await metricHandlers[metric]();
    }

    XLSX.writeFile(
      workbook,
      `crn-analytics-${timeRange}-${format(new Date(), 'MMddyy')}.xlsx`,
    );
  };

export const algoliaResultsToStream = async <T>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListResponse<T> | undefined>
  >,
  transform: (result: T) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: 10,
    });
    if (data) {
      const nbPages = data.total / 10;
      data.items.map(transform).forEach((row) => csvStream.write(row));
      currentPage += 1;
      morePages = currentPage <= nbPages;
    } else {
      morePages = false;
    }
  }
  csvStream.end();
};
