/* eslint-disable no-console, no-await-in-loop, no-underscore-dangle */
import {
  PerformanceMetrics,
  timeRanges,
  documentCategories,
} from '@asap-hub/model';
import { getClient, indexOpensearchData } from '@asap-hub/server-common';
import { getPerformanceMetrics } from '../shared/performance-utils';
import { userProductivityPerformanceMapping } from './mappings';

interface UserProductivityDocument {
  asapOutput: number;
  asapPublicOutput: number;
  ratio: number;
  timeRange: string;
  documentCategory: string;
}

interface UserProductivityHit {
  _source?: {
    asapOutput?: number;
    asapPublicOutput?: number;
    ratio?: number;
    timeRange?: string;
    documentCategory?: string;
  };
}

interface UserProductivityPerformanceDocument {
  asapOutput: PerformanceMetrics;
  asapPublicOutput: PerformanceMetrics;
  ratio: PerformanceMetrics;
  timeRange: string;
  documentCategory: string;
}

export interface ProcessPerformanceOptions {
  awsRegion: string;
  environment: string;
  opensearchUsername: string;
  opensearchPassword: string;
  metric: 'all' | 'user-productivity';
}

const SCROLL_TIMEOUT = '5m';
const PAGE_SIZE = 5000;
const INDEX_NAME = 'user-productivity';

/**
 * Maps a search hit to a UserProductivityDocument
 */
const mapHitToDocument = (
  hit: UserProductivityHit,
): UserProductivityDocument => ({
  asapOutput: hit._source?.asapOutput ?? 0,
  asapPublicOutput: hit._source?.asapPublicOutput ?? 0,
  ratio: hit._source?.ratio ?? 0,
  timeRange: hit._source?.timeRange ?? '',
  documentCategory: hit._source?.documentCategory ?? '',
});

/**
 * Safely clears the scroll context
 */
const clearScroll = async (
  client: Awaited<ReturnType<typeof getClient>>,
  scrollId: string,
): Promise<void> => {
  try {
    await client.clearScroll({ scroll_id: scrollId });
  } catch (error) {
    console.warn('Failed to clear scroll context', { error, scrollId });
  }
};

/**
 * Retrieves all documents for a given time range and document category using scroll API
 */
const getAllDocuments = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserProductivityDocument[]> => {
  const documents: UserProductivityDocument[] = [];

  try {
    // Initial search with scroll
    let response = await client.search({
      index: INDEX_NAME,
      scroll: SCROLL_TIMEOUT,
      body: {
        query: {
          bool: {
            must: [{ term: { timeRange } }, { term: { documentCategory } }],
          },
        },
        size: PAGE_SIZE,
      },
    });

    let scrollId = response.body._scroll_id;
    let hits = response.body.hits?.hits || [];

    // Process first batch
    documents.push(...hits.map(mapHitToDocument));

    // Continue scrolling while there are more results
    while (hits.length > 0) {
      response = await client.scroll({
        scroll_id: scrollId,
        scroll: SCROLL_TIMEOUT,
      });

      scrollId = response.body._scroll_id;
      hits = response.body.hits?.hits || [];

      if (hits.length > 0) {
        documents.push(...hits.map(mapHitToDocument));
      }
    }

    await clearScroll(client, scrollId ?? '');

    return documents;
  } catch (error) {
    console.error('Failed to retrieve documents', {
      error,
      timeRange,
      documentCategory,
    });
    throw error;
  }
};

/**
 * Processes performance metrics for a single time range and document category combination
 */
const processMetricsForCombination = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserProductivityPerformanceDocument> => {
  console.info(
    `Processing performance metrics for ${timeRange}/${documentCategory}`,
  );

  const documents = await getAllDocuments(client, timeRange, documentCategory);

  const asapOutputMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.asapOutput),
    true,
  );

  const asapPublicOutputMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.asapPublicOutput),
    true,
  );

  const ratioMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.ratio),
    false,
  );

  console.info(
    `Processed performance metrics for ${timeRange}/${documentCategory} (${documents.length} users)`,
  );

  return {
    asapOutput: asapOutputMetrics,
    asapPublicOutput: asapPublicOutputMetrics,
    ratio: ratioMetrics,
    timeRange,
    documentCategory,
  };
};

/**
 * Processes user productivity performance metrics for all time ranges and document categories
 */
export const processUserProductivityPerformance = async (
  client: Awaited<ReturnType<typeof getClient>>,
): Promise<UserProductivityPerformanceDocument[]> => {
  // Create all combinations
  const combinations = timeRanges.flatMap((timeRange) =>
    documentCategories.map((documentCategory) => ({
      timeRange,
      documentCategory,
    })),
  );

  // Process all combinations concurrently
  const results = await Promise.allSettled(
    combinations.map(({ timeRange, documentCategory }) =>
      processMetricsForCombination(client, timeRange, documentCategory),
    ),
  );

  // Filter out failures and log them
  const performanceDocuments: UserProductivityPerformanceDocument[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      performanceDocuments.push(result.value);
    } else {
      const { timeRange, documentCategory } = combinations[index];
      console.error(
        `Failed to process user productivity performance metrics for ${timeRange}/${documentCategory}`,
        { error: result.reason },
      );
    }
  });

  return performanceDocuments;
};

/**
 * Main entry point for processing user productivity performance
 */
export const processPerformance = async ({
  awsRegion,
  environment,
  opensearchUsername,
  opensearchPassword,
  metric,
}: ProcessPerformanceOptions): Promise<void> => {
  if (metric !== 'all' && metric !== 'user-productivity') {
    return;
  }

  try {
    console.info('Processing user-productivity-performance...');

    await indexOpensearchData<UserProductivityPerformanceDocument>({
      awsRegion,
      stage: environment,
      opensearchUsername,
      opensearchPassword,
      indexAlias: 'user-productivity-performance',
      getData: async () => {
        const client = await getClient(
          awsRegion,
          environment,
          opensearchUsername,
          opensearchPassword,
        );

        const documents = await processUserProductivityPerformance(client);

        return {
          documents,
          mapping: userProductivityPerformanceMapping,
        };
      },
    });

    console.info('Successfully indexed user-productivity-performance data');
  } catch (error) {
    console.error('Failed to process user-productivity-performance', { error });
    throw error;
  }
};
