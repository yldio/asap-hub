import type {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import {
  DISCOVERY_THEME_FILTER_PREFIX,
  RESOURCE_TYPE_FILTER_PREFIX,
  isDiscoveryProject,
  isResourceProject,
  isTraineeProject,
  toDiscoveryProjectDetail,
  toDiscoveryThemeFilters,
  toProjectDetail,
  toResourceProjectDetail,
  toResourceTypeFilters,
  toStatusFilters,
  toTraineeProjectDetail,
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

  describe('detail transformers', () => {
    it('creates discovery project detail with funded team info', () => {
      const detail = toDiscoveryProjectDetail(baseDiscovery);
      expect(detail.fundedTeam?.name).toEqual('Discovery Team');
      expect(detail.researchTheme).toEqual('Theme One');
      expect(detail.milestones).toEqual([]);
    });

    it('creates team-based resource project detail', () => {
      const detail = toResourceProjectDetail(baseResource);
      expect(detail.fundedTeam?.name).toEqual('Resource Team');
      expect(detail.members).toEqual([]);
    });

    it('creates individual resource project detail', () => {
      const resourceIndividual = {
        ...baseResource,
        isTeamBased: false,
        members: [
          {
            id: 'member-1',
            displayName: 'Pat Scientist',
            role: 'Contributor',
          },
        ],
      };

      const detail = toResourceProjectDetail(resourceIndividual);
      expect(detail.fundedTeam).toBeUndefined();
      expect(detail.members).toHaveLength(1);
      expect(detail.members?.[0]?.href).toEqual(
        network({}).users({}).user({ userId: 'member-1' }).$,
      );
    });

    it('creates trainee project detail with trainer and members', () => {
      const detail = toTraineeProjectDetail(baseTrainee);
      expect(detail.trainer.displayName).toEqual('Taylor Trainer');
      expect(detail.members).toHaveLength(1);
      expect(detail.trainer.href).toEqual(
        network({}).users({}).user({ userId: 'trainer-1' }).$,
      );
      expect(detail.members?.[0]?.href).toEqual(
        network({}).users({}).user({ userId: 'trainee-member' }).$,
      );
    });

    it('maps project detail based on projectType', () => {
      expect(toProjectDetail(baseDiscovery).projectType).toEqual('Discovery');
      expect(toProjectDetail(baseResource).projectType).toEqual('Resource');
      expect(toProjectDetail(baseTrainee).projectType).toEqual('Trainee');
    });
  });

  describe('filter helpers', () => {
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
