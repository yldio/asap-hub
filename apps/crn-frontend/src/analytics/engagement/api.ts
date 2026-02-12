import {
  AlgoliaClient,
  AnalyticsPerformanceOptions,
  AnalyticsSearchOptions,
  AnalyticsSearchOptionsWithFiltering,
  ENGAGEMENT_PERFORMANCE,
  getPerformanceForMetric,
} from '@asap-hub/algolia';

import {
  EngagementPerformance,
  ListMeetingRepAttendanceResponse,
  MeetingRepAttendanceResponse,
  SortMeetingRepAttendance,
  TimeRangeOption,
  LimitedTimeRangeOption,
  SortEngagement,
  EngagementResponse,
  ListEngagementResponse,
} from '@asap-hub/model';
import { OpensearchClient } from '../utils/opensearch';
import { OpensearchSortMap } from '../utils/opensearch/types';

export type EngagementListOptions = AnalyticsSearchOptions & {
  timeRange: TimeRangeOption;
  sort: SortEngagement;
};

export type MeetingRepAttendanceOptions = Omit<
  AnalyticsSearchOptionsWithFiltering<SortMeetingRepAttendance>,
  'timeRange'
> & {
  timeRange: LimitedTimeRangeOption;
};

const presenterRepresentationOpensearchSort: OpensearchSortMap<SortEngagement> =
  {
    team_asc: [{ 'name.keyword': { order: 'asc' } }],
    team_desc: [{ 'name.keyword': { order: 'desc' } }],
    members_asc: [{ memberCount: { order: 'asc' } }],
    members_desc: [{ memberCount: { order: 'desc' } }],
    events_asc: [{ eventCount: { order: 'asc' } }],
    events_desc: [{ eventCount: { order: 'desc' } }],
    total_speakers_asc: [{ totalSpeakerCount: { order: 'asc' } }],
    total_speakers_desc: [{ totalSpeakerCount: { order: 'desc' } }],
    unique_speakers_all_roles_asc: [{ uniqueAllRolesCount: { order: 'asc' } }],
    unique_speakers_all_roles_desc: [
      { uniqueAllRolesCount: { order: 'desc' } },
    ],
    unique_speakers_all_roles_percentage_asc: [
      { uniqueAllRolesCountPercentage: { order: 'asc' } },
    ],
    unique_speakers_all_roles_percentage_desc: [
      { uniqueAllRolesCountPercentage: { order: 'desc' } },
    ],
    unique_speakers_key_personnel_asc: [
      { uniqueKeyPersonnelCount: { order: 'asc' } },
    ],
    unique_speakers_key_personnel_desc: [
      { uniqueKeyPersonnelCount: { order: 'desc' } },
    ],
    unique_speakers_key_personnel_percentage_asc: [
      { uniqueKeyPersonnelCountPercentage: { order: 'asc' } },
    ],
    unique_speakers_key_personnel_percentage_desc: [
      { uniqueKeyPersonnelCountPercentage: { order: 'desc' } },
    ],
  };

export const getEngagement = async (
  client: AlgoliaClient<'analytics'> | OpensearchClient<EngagementResponse>,
  options: EngagementListOptions,
): Promise<ListEngagementResponse> => {
  if (client instanceof OpensearchClient) {
    const { tags, currentPage, pageSize, timeRange, sort } = options;
    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange,
      searchScope: 'flat',
      sort: presenterRepresentationOpensearchSort[sort],
    });
  }
  const { currentPage, pageSize, tags, timeRange } = options;
  const result = await client.search(['engagement'], '', {
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

export const getEngagementPerformance = async (
  client: AlgoliaClient<'analytics'> | OpensearchClient<EngagementPerformance>,
  options: AnalyticsPerformanceOptions,
) => {
  if (client instanceof OpensearchClient) {
    const results = await client.search({
      searchTags: [],
      timeRange: options.timeRange,
      searchScope: 'flat',
      sort: [],
    });
    return results.items[0] as EngagementPerformance | undefined;
  }
  return getPerformanceForMetric<EngagementPerformance>(ENGAGEMENT_PERFORMANCE)(
    client,
    options,
  );
};

export const getMeetingRepAttendance = async (
  opensearchClient: OpensearchClient<MeetingRepAttendanceResponse>,
  { tags, currentPage, pageSize, timeRange }: MeetingRepAttendanceOptions,
): Promise<ListMeetingRepAttendanceResponse | undefined> =>
  opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'flat',
  });
