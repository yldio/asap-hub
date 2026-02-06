import {
  AlgoliaClient,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import {
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
  ListOSChampionOpensearchResponse,
  OSChampionOpensearchResponse,
  SortLeadershipAndMembership,
  SortOSChampion,
} from '@asap-hub/model';
import { MetricOption } from '@asap-hub/react-components';
import { OpensearchClient } from '../utils/opensearch/client';
import { OpensearchSort } from '../utils/opensearch/types';

export type AnalyticsSearchOptions = {
  metric?: MetricOption;
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
};

export type AnalyticsSearchOptionsWithSort = AnalyticsSearchOptions & {
  sort?: SortLeadershipAndMembership;
};

export const getAnalyticsLeadership = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<AnalyticsTeamLeadershipResponse>,
  { tags, currentPage, pageSize, sort }: AnalyticsSearchOptionsWithSort,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {
  if (client instanceof OpensearchClient) {
    let opensearchSort: OpensearchSort[] | undefined;
    if (sort) {
      if (sort === 'team_asc' || sort === 'team_desc') {
        opensearchSort = [
          {
            'displayName.keyword': {
              order: sort === 'team_asc' ? 'asc' : 'desc',
            },
          },
        ];
      } else {
        const fieldMap: Record<string, string> = {
          wg_current_leadership: 'workingGroupLeadershipRoleCount',
          wg_previous_leadership: 'workingGroupPreviousLeadershipRoleCount',
          wg_current_membership: 'workingGroupMemberCount',
          wg_previous_membership: 'workingGroupPreviousMemberCount',
          ig_current_leadership: 'interestGroupLeadershipRoleCount',
          ig_previous_leadership: 'interestGroupPreviousLeadershipRoleCount',
          ig_current_membership: 'interestGroupMemberCount',
          ig_previous_membership: 'interestGroupPreviousMemberCount',
        };
        const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
        const baseSort = sort.replace(/_(asc|desc)$/, '');
        const field = fieldMap[baseSort];
        if (field) {
          opensearchSort = [
            {
              [field]: {
                order: direction,
              },
            },
          ];
        }
      }
    }

    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange: 'all',
      searchScope: 'flat',
      sort: opensearchSort,
    });
  }
  const result = await client.search(['team-leadership'], '', {
    tagFilters: [tags],
    filters: undefined,
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

export const getAnalyticsOSChampion = async (
  opensearchClient: OpensearchClient<OSChampionOpensearchResponse>,
  {
    tags,
    currentPage,
    pageSize,
    timeRange,
  }: AnalyticsSearchOptionsWithFiltering<SortOSChampion>,
): Promise<ListOSChampionOpensearchResponse | undefined> =>
  opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'extended',
  });
