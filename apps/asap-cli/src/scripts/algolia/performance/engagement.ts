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
  uniqueAllRolesCountPercentage: number;
  uniqueKeyPersonnelCountPercentage: number;
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
          'uniqueAllRolesCountPercentage',
          'uniqueKeyPersonnelCountPercentage',
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
          hits.map((hit) => hit.uniqueAllRolesCountPercentage),
        ),
        uniqueKeyPersonnel: getPerformanceMetrics(
          hits.map((hit) => hit.uniqueKeyPersonnelCountPercentage),
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
