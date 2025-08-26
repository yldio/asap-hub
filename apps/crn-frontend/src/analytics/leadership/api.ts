import { AlgoliaClient } from '@asap-hub/algolia';
import { createSentryHeaders } from '@asap-hub/frontend-utils';
import {
  ListAnalyticsTeamLeadershipResponse,
  ListOSChampionResponse,
  OSChampionDataObject,
} from '@asap-hub/model';
import { MetricOption } from '@asap-hub/react-components';
import { API_BASE_URL } from '../../config';
import { generateSearchQuery, OpenSearchHit } from '../utils/api';

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
  authorization: string,
  { currentPage, pageSize }: AnalyticsSearchOptions,
): Promise<ListOSChampionResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/opensearch/search/os-champion`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(generateSearchQuery(currentPage, pageSize)),
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to search os-champion index. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  const result = await resp.json();
  const items = result.hits?.hits?.map(
    (osChampion: OpenSearchHit<OSChampionDataObject>) => {
      const { teamId, teamName, teamAwardsCount, isTeamInactive, users } =
        // eslint-disable-next-line no-underscore-dangle
        osChampion._source;

      return {
        teamId,
        teamName,
        teamAwardsCount,
        isTeamInactive,
        users,
      };
    },
  );

  return {
    items,
    total: result.hits?.total?.value || 0,
  };
};
