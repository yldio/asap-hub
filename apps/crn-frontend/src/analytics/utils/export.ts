import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  LimitedTimeRangeOption,
  ListResponse,
  MeetingRepAttendanceResponse,
  MetricExportKeys,
  metricsSheetName,
  OSChampionOpensearchResponse,
  PreliminaryDataSharingDataObject,
  PreprintComplianceResponse,
  PublicationComplianceResponse,
  TimeRangeOption,
} from '@asap-hub/model';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { OpensearchMetricsFacade } from '../../hooks/opensearch';
import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
} from '../collaboration/api';
import {
  preliminaryDataSharingToCSV,
  teamCollaborationAcrossTeamToCSV,
  teamCollaborationWithinTeamToCSV,
  userCollaborationToCSV,
} from '../collaboration/export';
import { getEngagement, getEngagementPerformance } from '../engagement/api';
import {
  engagementToCSV,
  meetingRepAttendanceToCSV,
} from '../engagement/export';
import { getAnalyticsLeadership } from '../leadership/api';
import { leadershipToCSV, osChampionToCSV } from '../leadership/export';
import {
  preprintComplianceToCSV,
  publicationComplianceToCSV,
} from '../open-science/export';
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

const PAGE_SIZE = 200;

export const getAllData = async <T>(
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Promise<
    ListResponse<T> | undefined
  >,
  transform: (result: T) => Record<string, unknown> | Record<string, unknown>[],
) => {
  let allData: unknown[] = [];
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: PAGE_SIZE,
    });
    if (data) {
      const nbPages = data.total / PAGE_SIZE;
      allData = allData.concat(...data.items.map(transform));
      currentPage += 1;
      morePages = currentPage <= nbPages;
    } else {
      morePages = false;
    }
  }

  return allData;
};

export const downloadAnalyticsXLSX =
  ({
    algoliaClient,
    opensearchMetrics,
    opensearchMetricsFlag,
  }: {
    algoliaClient: AlgoliaClient<'analytics'>;
    opensearchMetrics: OpensearchMetricsFacade;
    opensearchMetricsFlag: boolean;
  }) =>
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
      transform: (
        performance: T,
      ) => (result: V) => Record<string, unknown> | Record<string, unknown>[],
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
            opensearchMetricsFlag
              ? opensearchMetrics.getUserProductivityPerformance({
                  timeRange,
                  documentCategory: 'all',
                })
              : getUserProductivityPerformance(algoliaClient, {
                  timeRange,
                  documentCategory: 'all',
                }),
          (paginationParams) =>
            opensearchMetricsFlag
              ? opensearchMetrics.getUserProductivity({
                  timeRange,
                  documentCategory,
                  sort,
                  tags,
                  ...paginationParams,
                })
              : getUserProductivity(algoliaClient, {
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
            opensearchMetricsFlag
              ? opensearchMetrics.getTeamProductivityPerformance({
                  timeRange,
                  outputType: 'all',
                })
              : getTeamProductivityPerformance(algoliaClient, {
                  timeRange,
                  outputType: 'all',
                }),
          (paginationParams) =>
            opensearchMetricsFlag
              ? opensearchMetrics.getTeamProductivity({
                  timeRange,
                  outputType: 'all',
                  sort,
                  tags,
                  ...paginationParams,
                })
              : getTeamProductivity(algoliaClient, {
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
            getUserCollaborationPerformance(algoliaClient, {
              timeRange,
              documentCategory: 'all',
            }),
          (paginationParams) =>
            getUserCollaboration(algoliaClient, {
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
            getUserCollaborationPerformance(algoliaClient, {
              timeRange,
              documentCategory: 'all',
            }),
          (paginationParams) =>
            getUserCollaboration(algoliaClient, {
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
            getTeamCollaborationPerformance(algoliaClient, {
              timeRange,
              outputType: 'all',
            }),
          (paginationParams) =>
            getTeamCollaboration(algoliaClient, {
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
            getTeamCollaborationPerformance(algoliaClient, {
              timeRange,
              outputType: 'all',
            }),
          (paginationParams) =>
            getTeamCollaboration(algoliaClient, {
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
            getAnalyticsLeadership(algoliaClient, {
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
            getAnalyticsLeadership(algoliaClient, {
              tags,
              ...paginationParams,
            }),
          () => leadershipToCSV('interest-group'),
        ),
      engagement: () =>
        processMetric(
          'engagement',
          () =>
            getEngagementPerformance(algoliaClient, {
              timeRange,
            }),
          (paginationParams) =>
            getEngagement(algoliaClient, {
              tags: [],
              timeRange,
              ...paginationParams,
            }),
          (performance) => engagementToCSV(performance),
        ),
      'publication-compliance': () =>
        processMetric<
          PublicationComplianceResponse,
          PublicationComplianceResponse
        >(
          'publication-compliance',
          async () => undefined,
          (paginationParams) =>
            opensearchMetrics.getPublicationCompliance({
              timeRange,
              tags,
              ...paginationParams,
              sort: 'team_asc',
            }),
          () => publicationComplianceToCSV,
        ),
      'preprint-compliance': () =>
        processMetric<PreprintComplianceResponse, PreprintComplianceResponse>(
          'preprint-compliance',
          async () => undefined,
          (paginationParams) =>
            opensearchMetrics.getPreprintCompliance({
              tags,
              timeRange,
              ...paginationParams,
              sort: 'team_asc',
            }),
          () => preprintComplianceToCSV,
        ),
      'preliminary-data-sharing': () =>
        processMetric<
          PreliminaryDataSharingDataObject,
          PreliminaryDataSharingDataObject
        >(
          'preliminary-data-sharing',
          async () => undefined,
          (paginationParams) =>
            opensearchMetrics.getPreliminaryDataSharing({
              tags,
              timeRange: timeRange as LimitedTimeRangeOption,
              ...paginationParams,
            }),
          () => preliminaryDataSharingToCSV,
        ),
      attendance: () =>
        processMetric<
          MeetingRepAttendanceResponse,
          MeetingRepAttendanceResponse
        >(
          'attendance',
          async () => undefined,
          (paginationParams) =>
            opensearchMetrics.getMeetingRepAttendance({
              tags,
              timeRange: timeRange as LimitedTimeRangeOption,
              ...paginationParams,
              sort: 'team_asc',
            }),
          () => meetingRepAttendanceToCSV,
        ),
      'os-champion': () =>
        processMetric<
          OSChampionOpensearchResponse,
          OSChampionOpensearchResponse
        >(
          'os-champion',
          async () => undefined,
          (paginationParams) =>
            opensearchMetrics.getAnalyticsOSChampion({
              tags,
              timeRange,
              ...paginationParams,
              sort: 'team_asc',
            }),
          () => osChampionToCSV,
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

export const getPerformanceRanking = (
  percentage: number | null,
  isLimitedData: boolean,
) => {
  if (isLimitedData || percentage === null) {
    return 'Limited Data';
  }
  if (percentage >= 90) {
    return 'Outstanding';
  }
  if (percentage >= 80) {
    return 'Adequate';
  }
  return 'Needs Improvement';
};

export const formatPercentage = (percentage: number | null) =>
  percentage === null ? 'N/A' : `${percentage}%`;
