import type {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';

import {
  DISCOVERY_THEME_FILTER_PREFIX,
  RESOURCE_TYPE_FILTER_PREFIX,
  isDiscoveryProject,
  isResourceProject,
  isTraineeProject,
  toDiscoveryThemeFilters,
  toResourceTypeFilters,
  toStatusFilters,
  PROJECT_STATUS_FILTER_PREFIX,
} from '../utils';

describe('project utils', () => {
  const baseDiscovery: DiscoveryProject = {
    id: 'discovery-1',
    title: 'Discovery Project',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    duration: '5 mos',
    tags: ['Tag A'],
    projectType: 'Discovery',
    researchTheme: 'Theme One',
    teamName: 'Discovery Team',
    teamId: 'team-1',
    inactiveSinceDate: undefined,
  };

  const baseResource: ResourceProject = {
    id: 'resource-1',
    title: 'Resource Project',
    status: 'Completed',
    startDate: '2023-01-01',
    endDate: '2023-07-01',
    duration: '6 mos',
    tags: [],
    projectType: 'Resource',
    resourceType: 'Dataset',
    isTeamBased: true,
    teamName: 'Resource Team',
    teamId: 'team-1',
    googleDriveLink: undefined,
    members: [],
  };

  const baseTrainee: TraineeProject = {
    id: 'trainee-1',
    title: 'Trainee Project',
    status: 'Active',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    duration: '1 yr',
    tags: [],
    projectType: 'Trainee',
    trainer: {
      id: 'trainer-1',
      displayName: 'Taylor Trainer',
    },
    members: [
      {
        id: 'trainee-member',
        displayName: 'Dana Trainee',
      },
    ],
  };

  describe('type guards', () => {
    it('identifies project variants', () => {
      expect(isDiscoveryProject(baseDiscovery)).toBe(true);
      expect(isResourceProject(baseResource)).toBe(true);
      expect(isTraineeProject(baseTrainee)).toBe(true);
    });
  });

  describe('filter helpers', () => {
    it('returns empty arrays when filters are undefined', () => {
      expect(toStatusFilters(undefined)).toEqual([]);
      expect(toDiscoveryThemeFilters(undefined)).toEqual([]);
      expect(toResourceTypeFilters(undefined)).toEqual([]);
    });

    it('converts prefixed status filters', () => {
      const filters = new Set([
        `${PROJECT_STATUS_FILTER_PREFIX}Active`,
        `${PROJECT_STATUS_FILTER_PREFIX}Closed`,
        'other:value',
      ]);

      expect(toStatusFilters(filters)).toEqual(['Active', 'Closed']);
    });

    it('extracts discovery theme filters', () => {
      const filters = new Set([
        `${DISCOVERY_THEME_FILTER_PREFIX}Parkinson`,
        'status:Active',
      ]);

      expect(toDiscoveryThemeFilters(filters)).toEqual(['Parkinson']);
    });

    it('extracts resource type filters', () => {
      const filters = new Set([
        `${RESOURCE_TYPE_FILTER_PREFIX}Dataset`,
        `${RESOURCE_TYPE_FILTER_PREFIX}Portal`,
      ]);

      expect(toResourceTypeFilters(filters)).toEqual(['Dataset', 'Portal']);
    });
  });
});
