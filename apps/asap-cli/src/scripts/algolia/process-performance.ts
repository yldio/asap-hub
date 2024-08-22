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

const isEven = (number: number) => number % 2 === 0;

export const getMedian = (numbers: number[]): number => {
  const midValue = Math.floor(numbers.length / 2);
  if (isEven(numbers.length)) {
    return (numbers[midValue - 1] + numbers[midValue]) / 2;
  }
  return numbers[midValue];
};

export const getQuartiles = (
  numbers: number[],
): { min: number; q1: number; q3: number; max: number } => {
  const n = numbers.length;
  if (n < 4) return { min: 0, q1: 0, q3: 0, max: 0 };

  const sortedData = numbers.sort((a, b) => a - b);
  const middleIndex = Math.floor(n / 2);
  const q1 = getMedian(sortedData.slice(0, middleIndex));
  const q3 = isEven(n)
    ? getMedian(sortedData.slice(middleIndex))
    : getMedian(sortedData.slice(middleIndex + 1));
  return { min: sortedData[0], q1, q3, max: sortedData[n - 1] };
};

export const getPerformanceMetrics = (
  data: number[],
  isInteger: boolean = true,
): PerformanceMetrics => {
  const { min, q1, q3, max } = getQuartiles(data);
  const firstQuartile = isInteger ? q1 : parseFloat(q1.toFixed(2));
  const thirdQuartile = isInteger ? q3 : parseFloat(q3.toFixed(2));
  const factor = isInteger ? 1 : 0.01;

  if (min === max) {
    return {
      belowAverageMin: -1,
      belowAverageMax: -1,
      averageMin: min,
      averageMax: max,
      aboveAverageMin: -1,
      aboveAverageMax: -1,
    };
  }

  if (
    isInteger &&
    (!Number.isInteger(firstQuartile) || !Number.isInteger(thirdQuartile))
  ) {
    const belowAverageMax = Math.floor(firstQuartile);
    const averageMin = belowAverageMax + factor;
    const aboveAverageMin = Math.ceil(thirdQuartile);
    return {
      belowAverageMin: min,
      belowAverageMax,
      averageMin,
      averageMax: Math.max(averageMin, aboveAverageMin - 1),
      aboveAverageMin,
      aboveAverageMax: max,
    };
  }

  const belowAverageMin = min;
  const belowAverageMax = Math.max(min, firstQuartile - factor);
  const averageMin = belowAverageMax + factor;
  const averageMax = Math.max(averageMin, thirdQuartile - factor);
  let aboveAverageMin = Math.min(averageMax + factor, max);
  let aboveAverageMax = max;

  if (averageMin == aboveAverageMax) {
    aboveAverageMin = -1;
    aboveAverageMax = -1;
  }
  return {
    belowAverageMin,
    belowAverageMax,
    averageMin,
    averageMax,
    aboveAverageMin,
    aboveAverageMax,
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
};
