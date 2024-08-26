import { PerformanceMetrics } from '@asap-hub/model';
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

type RoundingType = 'ceil' | 'floor';

const roundToTwoDecimals = (number: number, type?: RoundingType): number => {
  const factor = 100;

  if (!type) {
    return parseFloat(number.toFixed(2));
  }

  return type === 'ceil'
    ? Math.ceil(number * factor) / factor
    : Math.floor(number * factor) / factor;
};

export const getStandardDeviation = (
  numbers: number[],
  mean: number,
): number => {
  const n = numbers.length;
  if (n === 0) return 0;

  const variance =
    numbers.reduce((sum, value) => sum + (value - mean) ** 2, 0) / n;

  return Math.sqrt(variance);
};

export const getBellCurveMetrics = (
  data: number[],
  isInteger: boolean = true,
): PerformanceMetrics => {
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const stdDev = getStandardDeviation(data, mean);

  const inferiorLimit = mean - stdDev;
  const superiorLimit = mean + stdDev;

  return {
    belowAverageMin: isInteger
      ? Math.min(...data)
      : roundToTwoDecimals(Math.min(...data)),
    belowAverageMax: isInteger
      ? Math.floor(inferiorLimit)
      : roundToTwoDecimals(inferiorLimit, 'floor'),
    averageMin: isInteger
      ? Math.ceil(inferiorLimit)
      : roundToTwoDecimals(inferiorLimit, 'ceil'),
    averageMax: isInteger
      ? Math.floor(superiorLimit)
      : roundToTwoDecimals(superiorLimit, 'floor'),
    aboveAverageMin: isInteger
      ? Math.ceil(superiorLimit)
      : roundToTwoDecimals(superiorLimit, 'ceil'),
    aboveAverageMax: isInteger
      ? Math.max(...data)
      : roundToTwoDecimals(Math.max(...data)),
  };
};

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
export const processProductivityPerformance = async ({
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
