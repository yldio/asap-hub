import { SearchIndex } from 'algoliasearch';

import { timeRanges } from '@asap-hub/model';

import {
  deletePreviousObjects,
  getAllHits,
  getPerformanceMetrics,
  Hit,
} from '../process-performance';

type EngagementHit = Hit & {
  eventCount: number;
  totalSpeakerCount: number;
  uniqueAllRolesCount: number;
  uniqueKeyPersonnelCount: number;
};

export const processEngagementPerformance = async (index: SearchIndex) => {
  const type = 'engagement' as const;

  await deletePreviousObjects(index, type);

  timeRanges.forEach(async (range) => {
    const getPaginatedHits = (page: number) =>
      index.search<EngagementHit>('', {
        filters: `__meta.range:"${range}" AND __meta.type:"${type}"`,
        attributesToRetrieve: [
          'eventCount',
          'totalSpeakerCount',
          'uniqueAllRolesCount',
          'uniqueKeyPersonnelCount',
        ],
        page,
        hitsPerPage: 50,
      });

    const hits = await getAllHits<EngagementHit>(getPaginatedHits);

    await index.saveObject(
      {
        events: getPerformanceMetrics(hits.map((hit) => hit.eventCount)),
        totalSpeakers: getPerformanceMetrics(
          hits.map((hit) => hit.totalSpeakerCount),
        ),
        uniqueAllRoles: getPerformanceMetrics(
          hits.map((hit) => hit.uniqueAllRolesCount),
        ),
        uniqueKeyPersonnel: getPerformanceMetrics(
          hits.map((hit) => hit.uniqueKeyPersonnelCount),
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
