import type {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';

import {
  discoveryProjectToCSV,
  isDiscoveryProject,
  isResourceProject,
  isTraineeProject,
  resourceProjectToCSV,
  toDiscoveryThemeFilters,
  toResourceTypeFilters,
  toStatusFilters,
  traineeProjectToCSV,
} from '../utils';

describe('project utils', () => {
  const baseDiscovery: DiscoveryProject = {
    id: 'discovery-1',
    title: 'Discovery Project',
    status: 'Active',
    statusRank: 1,
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    duration: '5 mos',
    tags: ['Tag A'],
    projectType: 'Discovery Project',
    researchTheme: 'Theme One',
    teamName: 'Discovery Team',
    teamId: 'team-1',
    inactiveSinceDate: undefined,
  };

  const baseResource: ResourceProject = {
    id: 'resource-1',
    title: 'Resource Project',
    status: 'Completed',
    statusRank: 2,
    startDate: '2023-01-01',
    endDate: '2023-07-01',
    duration: '6 mos',
    tags: [],
    projectType: 'Resource Project',
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
    statusRank: 1,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    duration: '1 yr',
    tags: [],
    projectType: 'Trainee Project',
    members: [
      {
        id: 'trainee-member',
        displayName: 'Dana Trainee',
        role: 'Trainee',
      },
      {
        id: 'trainer-1',
        displayName: 'Taylor Trainer',
        role: 'Trainee Project - Mentor',
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

  describe('toCSV mappers', () => {
    it('maps discovery project fields to CSV format', () => {
      expect(discoveryProjectToCSV(baseDiscovery)).toEqual({
        'Project Title': 'Discovery Project',
        'Original Grant': undefined,
        'Supplement Grant': undefined,
        'Project Type': 'Discovery Project',
        'Project Status': 'Active',
        'Research Theme': 'Theme One',
        'Funded Team Name': 'Discovery Team',
        'Project Start Date': '2024-01-01',
        'Project End Date': '2024-06-01',
        Tags: 'Tag A',
      });
    });

    describe('resourceProjectToCSV', () => {
      it('maps resource project fields to CSV format', () => {
        expect(resourceProjectToCSV(baseResource)).toEqual({
          'Project Title': 'Resource Project',
          'Original Grant': undefined,
          'Supplement Grant': undefined,
          'Project Type': 'Resource Project',
          'Project Status': 'Completed',
          'Resource Type': 'Dataset',
          'Funded Team Name': 'Resource Team',
          'Project Start Date': '2023-01-01',
          'Project End Date': '2023-07-01',
          'Project Members': '',
          Tags: '',
        });
      });
      it('populates project members and not funded team name when project is not team-based', () => {
        const project = {
          ...baseResource,
          isTeamBased: false,
          members: [
            {
              id: 'resource-member-1',
              firstName: 'Pat',
              lastName: 'Scientist',
              displayName: 'Pat Scientist',
            },
            {
              id: 'resource-member-2',
              firstName: 'Alex',
              lastName: 'Researcher',
              displayName: 'Alex Researcher',
            },
          ],
        } as ResourceProject;

        expect(resourceProjectToCSV(project)).toEqual(
          expect.objectContaining({
            'Project Members': 'Pat Scientist,Alex Researcher',
            'Funded Team Name': '',
          }),
        );
      });

      it('leaves project members empty and populates funded team name when project is team-based', () => {
        expect(resourceProjectToCSV(baseResource)).toEqual(
          expect.objectContaining({
            'Project Members': '',
            'Funded Team Name': 'Resource Team',
          }),
        );
      });
    });

    it('maps trainee project fields to CSV format', () => {
      expect(traineeProjectToCSV(baseTrainee)).toEqual({
        'Project Title': 'Trainee Project',
        'Original Grant': undefined,
        'Supplement Grant': undefined,
        'Project Type': 'Trainee Project',
        'Project Status': 'Active',
        'Project Members': 'Dana Trainee,Taylor Trainer',
        'Project Start Date': '2024-02-01',
        'Project End Date': '2025-02-01',
        Tags: '',
      });
    });
  });
});
