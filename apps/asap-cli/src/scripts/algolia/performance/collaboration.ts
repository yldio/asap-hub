import { SearchIndex } from 'algoliasearch';
import {
  timeRanges,
  TeamOutputDocumentType,
  PerformanceMetrics,
  outputTypes,
  documentCategories,
} from '@asap-hub/model';

import {
  deletePreviousObjects,
  getAllHits,
  getBellCurveMetrics,
  Hit,
} from '../process-performance';

type DocumentMetric = {
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Resource': number;
  Protocol: number;
};

type TeamCollaborationHit = Hit & {
  outputsCoProducedAcross: {
    byDocumentType: DocumentMetric;
  };
  outputsCoProducedWithin: DocumentMetric;
};

type UserTeam = {
  outputsCoAuthoredAcrossTeams: number;
  outputsCoAuthoredWithinTeam: number;
};
type UserCollaborationHit = Hit & {
  teams: UserTeam[];
};

export const processUserCollaborationPerformance = async (
  index: SearchIndex,
) => {
  const type = 'user-collaboration' as const;

  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    documentCategories.forEach(async (documentCategory) => {
      const getPaginatedHits = (page: number) =>
        index.search<UserCollaborationHit>('', {
          filters: `__meta.range:"${range}" AND __meta.documentCategory:"${documentCategory}" AND __meta.type:"${type}"`,
          attributesToRetrieve: ['teams'],
          page,
          hitsPerPage: 50,
        });

      const hits = await getAllHits<UserCollaborationHit>(getPaginatedHits);
      const flatHits = hits.reduce(
        (items: UserTeam[], item) => [...items, ...item.teams],
        [],
      );

      await index.saveObject(
        {
          withinTeam: getBellCurveMetrics(
            flatHits.map((hit) => hit.outputsCoAuthoredWithinTeam),
          ),
          acrossTeam: getBellCurveMetrics(
            flatHits.map((hit) => hit.outputsCoAuthoredAcrossTeams),
          ),
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

export const processTeamCollaborationPerformance = async (
  index: SearchIndex,
) => {
  const type = 'team-collaboration' as const;

  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    outputTypes.forEach(async (outputType) => {
      const getPaginatedHits = (page: number) =>
        index.search<TeamCollaborationHit>('', {
          filters: `__meta.range:"${range}" AND __meta.outputType:"${outputType}" AND __meta.type:"${type}"`,
          attributesToRetrieve: [
            'outputsCoProducedAcross',
            'outputsCoProducedWithin',
          ],
          page,
          hitsPerPage: 50,
        });

      const hits = await getAllHits<TeamCollaborationHit>(getPaginatedHits);

      const fields = [
        { name: 'Article', documentType: 'article' },
        { name: 'Bioinformatics', documentType: 'bioinformatics' },
        { name: 'Dataset', documentType: 'dataset' },
        { name: 'Lab Resource', documentType: 'labResource' },
        { name: 'Protocol', documentType: 'protocol' },
      ];

      const teamPerformanceByDocumentType = (rawMetrics: DocumentMetric[]) =>
        fields.reduce(
          (metrics, { name, documentType }) => ({
            ...metrics,
            [documentType]: getBellCurveMetrics(
              rawMetrics.map((item) => item[name as TeamOutputDocumentType]),
            ),
          }),
          {} as Record<string, PerformanceMetrics>,
        );

      await index.saveObject(
        {
          withinTeam: teamPerformanceByDocumentType(
            hits.map((hit) => hit.outputsCoProducedWithin),
          ),
          acrossTeam: teamPerformanceByDocumentType(
            hits.map((hit) => hit.outputsCoProducedAcross.byDocumentType),
          ),
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
