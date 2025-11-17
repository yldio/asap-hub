import type {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';

import {
  isDiscoveryProject,
  isResourceProject,
  isTraineeProject,
  toDiscoveryThemeFilters,
  toResourceTypeFilters,
  toStatusFilters,
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
    status: 'Complete',
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
    describe('toStatusFilters', () => {
      it('returns empty array when filters are undefined', () => {
        expect(toStatusFilters(undefined)).toEqual([]);
      });

      it('returns empty array when filters is empty Set', () => {
        expect(toStatusFilters(new Set())).toEqual([]);
      });

      it('extracts status filters by checking against known statuses', () => {
        const filters = new Set([
          'Active',
          'Closed',
          'UnknownStatus',
          'Parkinson',
        ]);

        expect(toStatusFilters(filters)).toEqual(['Active', 'Closed']);
      });
    });

    describe('toDiscoveryThemeFilters', () => {
      it('returns empty array when filters are undefined', () => {
        expect(toDiscoveryThemeFilters(undefined, [])).toEqual([]);
      });

      it('returns empty array when filters is empty Set', () => {
        expect(toDiscoveryThemeFilters(new Set(), [])).toEqual([]);
      });

      it('extracts theme filters and excludes status filters', () => {
        const filters = new Set(['Parkinson', 'Active', 'Unknown Theme']);
        const availableThemes = [
          { id: 'theme-1', name: 'Parkinson' },
          { id: 'theme-2', name: 'Alzheimer' },
        ];

        expect(toDiscoveryThemeFilters(filters, availableThemes)).toEqual([
          'Parkinson',
        ]);
      });

      it('returns empty array when no themes match', () => {
        const filters = new Set(['Unknown Theme', 'Another Theme']);
        const availableThemes = [
          { id: 'theme-1', name: 'Parkinson' },
          { id: 'theme-2', name: 'Alzheimer' },
        ];

        expect(toDiscoveryThemeFilters(filters, availableThemes)).toEqual([]);
      });

      it('returns empty array when available themes is empty', () => {
        const filters = new Set(['Parkinson', 'Alzheimer']);
        const availableThemes: Array<{ id: string; name: string }> = [];

        expect(toDiscoveryThemeFilters(filters, availableThemes)).toEqual([]);
      });
    });

    describe('toResourceTypeFilters', () => {
      it('returns empty array when filters are undefined', () => {
        expect(toResourceTypeFilters(undefined, [])).toEqual([]);
      });

      it('returns empty array when filters is empty Set', () => {
        expect(toResourceTypeFilters(new Set(), [])).toEqual([]);
      });

      it('extracts type filters and excludes status filters', () => {
        const filters = new Set([
          'Dataset',
          'Portal',
          'Active',
          'Unknown Type',
        ]);
        const availableTypes = [
          { id: 'type-1', name: 'Dataset' },
          { id: 'type-2', name: 'Portal' },
          { id: 'type-3', name: 'Database' },
        ];

        expect(toResourceTypeFilters(filters, availableTypes)).toEqual([
          'Dataset',
          'Portal',
        ]);
      });

      it('returns empty array when no types match', () => {
        const filters = new Set(['Unknown Type']);
        const availableTypes = [
          { id: 'type-1', name: 'Dataset' },
          { id: 'type-2', name: 'Portal' },
        ];

        expect(toResourceTypeFilters(filters, availableTypes)).toEqual([]);
      });

      it('returns empty array when available types is empty', () => {
        const filters = new Set(['Dataset', 'Portal']);
        const availableTypes: Array<{ id: string; name: string }> = [];

        expect(toResourceTypeFilters(filters, availableTypes)).toEqual([]);
      });
    });
  });
});
