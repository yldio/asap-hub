import {
  documentCategories,
  outputTypes,
  PerformanceMetrics,
  TeamOutputDocumentType,
  teamOutputDocumentTypes,
  timeRanges,
} from '@asap-hub/model';
import type { SearchIndex } from 'algoliasearch';
import {
  deletePreviousObjects,
  getAllHits,
  getPerformanceMetrics,
  Hit,
} from '../process-performance';

type UserProductivityHit = Hit & {
  asapOutput: number;
  asapPublicOutput: number;
  ratio: string;
};

type TeamProductivityHit = Hit & {
  [documentType in TeamOutputDocumentType]: number;
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
          filters: `__meta.range:"${range}" AND __meta.documentCategory:"${documentCategory}" AND __meta.type:"${type}"`,
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
              ratio: getPerformanceMetrics(
                userProductivityHits.map((hit) => parseFloat(hit.ratio)),
                false,
              ),
            };
          }

          return {
            ...metrics,
            [field]: getPerformanceMetrics(
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
    outputTypes.forEach(async (outputType) => {
      const getPaginatedHits = (page: number) =>
        index.search<TeamProductivityHit>('', {
          filters: `__meta.range:"${range}" AND __meta.outputType:"${outputType}" AND __meta.type:"${type}"`,
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
          [documentType]: getPerformanceMetrics(
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
            outputType,
          },
        },
        { autoGenerateObjectIDIfNotExist: true },
      );
    });
  });
};
