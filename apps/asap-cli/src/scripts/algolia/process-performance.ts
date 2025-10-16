import { AnalyticType } from '@asap-hub/algolia';
import algoliasearch from 'algoliasearch';
import type { SearchIndex } from 'algoliasearch';
import { SearchResponse } from '@algolia/client-search';
import {
  processTeamProductivityPerformance,
  processUserProductivityPerformance,
} from './performance/productivity';
import {
  processTeamCollaborationPerformance,
  processUserCollaborationPerformance,
} from './performance/collaboration';
import { processEngagementPerformance } from './performance/engagement';

// Re-export shared utilities for backward compatibility
export {
  getMedian,
  getQuartiles,
  getPerformanceMetrics,
} from '../shared/performance-utils';

export type Hit = {
  objectID: string;
};

export type ProcessPerformance = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  metric: 'all' | AnalyticType;
};

export const getAllHits = async <T>(
  getPaginatedHits: (page: number) => Promise<SearchResponse<T>>,
): Promise<T[]> => {
  let page = 0;
  let totalPages = 0;
  let allHits: T[] = [];

  /* eslint-disable no-await-in-loop */
  do {
    const result = await getPaginatedHits(page);
    allHits = allHits.concat(result.hits);
    if (totalPages === 0) {
      totalPages = result.nbPages;
    }
    page += 1;
  } while (page < totalPages);
  /* eslint-enable no-await-in-loop */

  return allHits;
};

export const deletePreviousObjects = async (
  index: SearchIndex,
  type: AnalyticType,
) => {
  const previous = await index.search('', {
    filters: `__meta.type:"${type}-performance"`,
  });
  const objectIDs = previous.hits.map(({ objectID }) => objectID);
  await index.deleteObjects(objectIDs);
};
/* istanbul ignore next */
export const processPerformance = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  metric,
}: ProcessPerformance): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const index = client.initIndex(indexName);

  if (metric === 'all' || metric === 'user-productivity') {
    await processUserProductivityPerformance(index);
  }

  if (metric === 'all' || metric === 'team-productivity') {
    await processTeamProductivityPerformance(index);
  }

  if (metric === 'all' || metric === 'team-collaboration') {
    await processTeamCollaborationPerformance(index);
  }

  if (metric === 'all' || metric === 'user-collaboration') {
    await processUserCollaborationPerformance(index);
  }

  if (metric === 'all' || metric === 'engagement') {
    await processEngagementPerformance(index);
  }
};
