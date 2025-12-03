import {
  AlgoliaClient,
  AnalyticsSearchOptions,
  AnalyticsSearchOptionsWithFiltering,
  ENGAGEMENT_PERFORMANCE,
  getPerformanceForMetric,
} from '@asap-hub/algolia';

import {
  EngagementPerformance,
  ListEngagementAlgoliaResponse,
  ListMeetingRepAttendanceResponse,
  MeetingRepAttendanceResponse,
  SortMeetingRepAttendance,
  TimeRangeOption,
  LimitedTimeRangeOption,
} from '@asap-hub/model';
import { OpensearchClient } from '../utils/opensearch';

export type EngagementListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
> & {
  timeRange: TimeRangeOption;
};

export type MeetingRepAttendanceOptions = Omit<
  AnalyticsSearchOptionsWithFiltering<SortMeetingRepAttendance>,
  'timeRange'
> & {
  timeRange: LimitedTimeRangeOption;
};

export const getEngagement = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: EngagementListOptions,
): Promise<ListEngagementAlgoliaResponse> => {
  const { currentPage, pageSize, tags, timeRange } = options;
  const result = await algoliaClient.search(['engagement'], '', {
    filters: `(__meta.range:"${timeRange || 'all'}")`,
    tagFilters: [tags],
    page: currentPage ?? undefined,
    hitsPerPage: pageSize ?? undefined,
  });
  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};

export const getEngagementPerformance =
  getPerformanceForMetric<EngagementPerformance>(ENGAGEMENT_PERFORMANCE);

export const getMeetingRepAttendance = async (
  opensearchClient: OpensearchClient<MeetingRepAttendanceResponse>,
  { tags, currentPage, pageSize, timeRange }: MeetingRepAttendanceOptions,
): Promise<ListMeetingRepAttendanceResponse | undefined> =>
  opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'teams',
  });
