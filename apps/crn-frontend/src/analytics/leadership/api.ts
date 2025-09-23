import {
  AlgoliaClient,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import {
  ListAnalyticsTeamLeadershipResponse,
  ListOSChampionOpensearchResponse,
  OSChampionOpensearchResponse,
  SortOSChampion,
} from '@asap-hub/model';
import { MetricOption } from '@asap-hub/react-components';
import { OpensearchClient } from '../utils/opensearch';

export type AnalyticsSearchOptions = {
  metric?: MetricOption;
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
};

export const getAnalyticsLeadership = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  { tags, currentPage, pageSize }: AnalyticsSearchOptions,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {
  const result = await algoliaClient.search(['team-leadership'], '', {
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
  opensearchClient.search(tags, currentPage, pageSize, timeRange);
