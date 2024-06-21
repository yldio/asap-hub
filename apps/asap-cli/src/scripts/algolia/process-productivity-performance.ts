import { SearchResponse } from '@algolia/client-search';
import {
  documentCategories,
  PerformanceMetrics,
  TeamOutputDocumentType,
  teamOutputDocumentTypes,
  timeRanges,
} from '@asap-hub/model';
import type { SearchIndex } from 'algoliasearch';
import algoliasearch from 'algoliasearch';

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

type Hit = {
  objectID: string;
};

type UserProductivityHit = Hit & {
  asapOutput: number;
  asapPublicOutput: number;
  ratio: string;
};

type TeamProductivityHit = Hit & {
  [documentType in TeamOutputDocumentType]: number;
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
  type: 'user-productivity' | 'team-productivity',
) => {
  const previous = await index.search('', {
    filters: `__meta.type:"${type}-performance"`,
  });
  const objectIDs = previous.hits.map(({ objectID }) => objectID);
  await index.deleteObjects(objectIDs);
};

export const processUserProductivityPerformance = async (
  index: SearchIndex,
) => {
  const type = 'user-productivity' as const;
  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    documentCategories.forEach(async (documentCategory) => {
      const getPaginatedHits = (page: number) =>
        index.search<UserProductivityHit>('', {
          filters: `__meta.range:"${range}" AND (__meta.documentCategory:"${documentCategory}") AND (__meta.type:"${type}")`,
          attributesToRetrieve: ['asapOutput', 'asapPublicOutput', 'ratio'],
          page,
          hitsPerPage: 50,
        });

      const userProductivityHits =
        await getAllHits<UserProductivityHit>(getPaginatedHits);

      const fields = ['asapOutput', 'asapPublicOutput', 'ratio'];

      const userPerformance = fields.reduce(
        (metrics, field) => {
          if (field === 'ratio') {
            return {
              ...metrics,
              ratio: getBellCurveMetrics(
                userProductivityHits.map((hit) => parseFloat(hit.ratio)),
                false,
              ),
            };
          }

          return {
            ...metrics,
            [field]: getBellCurveMetrics(
              userProductivityHits.map(
                (hit) => hit[field as 'asapOutput' | 'asapPublicOutput'],
              ),
            ),
          };
        },
        {} as Record<string, PerformanceMetrics>,
      );

      await index.saveObject(
        {
          ...userPerformance,
          __meta: {
            range,
            type: `${type}-performance`,
            documentCategory,
          },
        },
        { autoGenerateObjectIDIfNotExist: true },
      );
    });
  });
};

export const processTeamProductivityPerformance = async (
  index: SearchIndex,
) => {
  const type = 'team-productivity' as const;

  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    const getPaginatedHits = (page: number) =>
      index.search<TeamProductivityHit>('', {
        filters: `__meta.range:"${range}" AND (__meta.type:"${type}")`,
        attributesToRetrieve: teamOutputDocumentTypes,
        page,
        hitsPerPage: 50,
      });

    const teamProductivityHits =
      await getAllHits<TeamProductivityHit>(getPaginatedHits);

    const fields = [
      { name: 'Article', documentType: 'article' },
      { name: 'Bioinformatics', documentType: 'bioinformatics' },
      { name: 'Dataset', documentType: 'dataset' },
      { name: 'Lab Resource', documentType: 'labResource' },
      { name: 'Protocol', documentType: 'protocol' },
    ];

    const teamPerformanceByDocumentType = fields.reduce(
      (metrics, { name, documentType }) => ({
        ...metrics,
        [documentType]: getBellCurveMetrics(
          teamProductivityHits.map(
            (hit) => hit[name as TeamOutputDocumentType],
          ),
        ),
      }),
      {} as Record<string, PerformanceMetrics>,
    );

    await index.saveObject(
      {
        ...teamPerformanceByDocumentType,
        __meta: {
          range,
          type: `${type}-performance`,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
};

export type ProcessProductivityPerformance = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
  metric: 'all' | 'user-productivity' | 'team-productivity';
};

/* istanbul ignore next */
export const processProductivityPerformance = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
  metric,
}: ProcessProductivityPerformance): Promise<void> => {
  const client = algoliasearch(algoliaAppId, algoliaCiApiKey);
  const index = client.initIndex(indexName);

  if (metric === 'all' || metric === 'user-productivity') {
    await processUserProductivityPerformance(index);
  }

  if (metric === 'all' || metric === 'team-productivity') {
    await processTeamProductivityPerformance(index);
  }
};
