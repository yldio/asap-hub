import { SearchIndex } from 'algoliasearch';
import {
  timeRanges,
  TeamOutputDocumentType,
  PerformanceMetrics,
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

export const processTeamCollaborationPerformance = async (
  index: SearchIndex,
) => {
  const type = 'team-collaboration' as const;

  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    const getPaginatedHits = (page: number) =>
      index.search<TeamCollaborationHit>('', {
        filters: `__meta.range:"${range}" AND (__meta.type:"${type}")`,
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
        accrossTeam: teamPerformanceByDocumentType(
          hits.map((hit) => hit.outputsCoProducedAcross.byDocumentType),
        ),
        __meta: {
          range,
          type: `${type}-performance`,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
};
