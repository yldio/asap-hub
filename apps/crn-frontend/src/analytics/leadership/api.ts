import { AlgoliaClient } from '@asap-hub/algolia';
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
    headers: { authorization },
    body: JSON.stringify(generateSearchQuery(currentPage, pageSize)),
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to search os-champion index. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }

  // const result = {
  //   hits: {
  //     total: {
  //       value: 2,
  //     },
  //     hits: [
  //            {
  //       "_index": "os-champion-1755238472842",
  //       "_id": "1btdrJgBwkQuzNMVnyaz",
  //       "_score": 1,
  //       "_source": {
  //         "teamId": "463705c4-e70b-470c-918d-b0ceb84a3415",
  //         "teamName": "Alessi",
  //         "isTeamInactive": false,
  //         "teamAwardsCount": 2,
  //         "users": [
  //           {
  //             "id": "5af7563f-a34c-43c1-b26d-493b86e2e340",
  //             "name": "Devin Snyder",
  //             "awardsCount": 1
  //           },
  //           {
  //             "id": "91008c16-49f2-4ac5-8b52-03299948c59f",
  //             "name": "Diana Guimarães",
  //             "awardsCount": 1
  //           }
  //         ]
  //       }
  //     },
  //     {
  //       "_index": "os-champion-1755238472842",
  //       "_id": "2btdrJgBwkQuzNMVnyaz",
  //       "_score": 1,
  //       "_source": {
  //         "teamId": "2piYltWBLzE5P2n4femVV4",
  //         "teamName": "Banteng",
  //         "isTeamInactive": false,
  //         "teamAwardsCount": 0,
  //         "users": []
  //       }
  //     }
  //   ]
  //   }
  // }

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
