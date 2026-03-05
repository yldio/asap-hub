import type {
  DiscoveryProjectDetail,
  ResourceProjectDetail,
  TraineeProjectDetail,
} from '@asap-hub/model';
import {
  discoveryConfig,
  resourceConfig,
  traineeConfig,
} from '../projectDetailConfig';

const baseProject = {
  id: 'project-1',
  title: 'Test Project',
  status: 'Active' as const,
  statusRank: 1,
  startDate: '2024-01-01',
  endDate: '2025-01-01',
  tags: [],
  contactEmail: 'jane@example.com',
};

describe('discoveryConfig', () => {
  const discoveryProject: DiscoveryProjectDetail = {
    ...baseProject,
    projectType: 'Discovery Project',
    researchTheme: 'Theme',
    teamName: 'Team A',
    fundedTeam: {
      id: 'team-1',
      displayName: 'Team A',
      teamType: 'CRN',
    },
    collaborators: [
      { id: 'user-1', displayName: 'Jane Doe', email: 'jane@example.com' },
      { id: 'user-2', displayName: 'John Smith', email: 'john@example.com' },
    ],
  };

  it('has projectType "Discovery Project"', () => {
    expect(discoveryConfig.projectType).toBe('Discovery Project');
  });

  it('has projectTypeKey "discovery"', () => {
    expect(discoveryConfig.projectTypeKey).toBe('discovery');
  });

  it('getIsTeamBased returns true', () => {
    expect(discoveryConfig.getIsTeamBased(discoveryProject)).toBe(true);
  });

  it('getContactName returns collaborator displayName matching contactEmail', () => {
    expect(discoveryConfig.getContactName(discoveryProject)).toBe('Jane Doe');
  });

  it('getContactName returns undefined when no collaborator matches contactEmail', () => {
    expect(
      discoveryConfig.getContactName({
        ...discoveryProject,
        contactEmail: 'unknown@example.com',
      }),
    ).toBeUndefined();
  });

  it('getContactName returns undefined for non-discovery project type', () => {
    const resourceProject = {
      ...baseProject,
      projectType: 'Resource Project' as const,
      resourceType: 'Resource',
      isTeamBased: true,
    };
    expect(
      discoveryConfig.getContactName(resourceProject as ResourceProjectDetail),
    ).toBeUndefined();
  });
});

describe('resourceConfig', () => {
  const resourceProject: ResourceProjectDetail = {
    ...baseProject,
    projectType: 'Resource Project',
    resourceType: 'Resource',
    isTeamBased: true,
    members: [
      { id: 'user-1', displayName: 'Jane Member', email: 'jane@example.com' },
    ],
    collaborators: [
      {
        id: 'user-2',
        displayName: 'Jane Collaborator',
        email: 'jane@example.com',
      },
    ],
  };

  it('has projectType "Resource Project"', () => {
    expect(resourceConfig.projectType).toBe('Resource Project');
  });

  it('has projectTypeKey "resource"', () => {
    expect(resourceConfig.projectTypeKey).toBe('resource');
  });

  it('getIsTeamBased returns isTeamBased from project', () => {
    expect(resourceConfig.getIsTeamBased(resourceProject)).toBe(true);
    expect(
      resourceConfig.getIsTeamBased({ ...resourceProject, isTeamBased: false }),
    ).toBe(false);
  });

  it('getIsTeamBased returns true for non-resource project type', () => {
    const discoveryProject = {
      ...baseProject,
      projectType: 'Discovery Project' as const,
      researchTheme: 'Theme',
      teamName: 'Team A',
      fundedTeam: { id: 'team-1', displayName: 'Team A', teamType: 'CRN' },
    };
    expect(
      resourceConfig.getIsTeamBased(
        discoveryProject as unknown as DiscoveryProjectDetail,
      ),
    ).toBe(true);
  });

  it('getContactName returns member displayName matching contactEmail', () => {
    expect(resourceConfig.getContactName(resourceProject)).toBe('Jane Member');
  });

  it('getContactName falls back to collaborator when no member matches', () => {
    expect(
      resourceConfig.getContactName({
        ...resourceProject,
        members: [],
      }),
    ).toBe('Jane Collaborator');
  });

  it('getContactName returns undefined when no match found', () => {
    expect(
      resourceConfig.getContactName({
        ...resourceProject,
        contactEmail: 'unknown@example.com',
      }),
    ).toBeUndefined();
  });

  it('getContactName returns undefined for non-resource project type', () => {
    const discoveryProject = {
      ...baseProject,
      projectType: 'Discovery Project' as const,
      researchTheme: 'Theme',
      teamName: 'Team A',
      fundedTeam: { id: 'team-1', displayName: 'Team A', teamType: 'CRN' },
    };
    expect(
      resourceConfig.getContactName(
        discoveryProject as unknown as DiscoveryProjectDetail,
      ),
    ).toBeUndefined();
  });
});

describe('traineeConfig', () => {
  const traineeProject: TraineeProjectDetail = {
    ...baseProject,
    projectType: 'Trainee Project',
    members: [
      { id: 'user-1', displayName: 'Jane Trainee', email: 'jane@example.com' },
    ],
  };

  it('has projectType "Trainee Project"', () => {
    expect(traineeConfig.projectType).toBe('Trainee Project');
  });

  it('has projectTypeKey "trainee"', () => {
    expect(traineeConfig.projectTypeKey).toBe('trainee');
  });

  it('getIsTeamBased returns false', () => {
    expect(traineeConfig.getIsTeamBased(traineeProject)).toBe(false);
  });

  it('getContactName returns member displayName matching contactEmail', () => {
    expect(traineeConfig.getContactName(traineeProject)).toBe('Jane Trainee');
  });

  it('getContactName returns undefined when no member matches contactEmail', () => {
    expect(
      traineeConfig.getContactName({
        ...traineeProject,
        contactEmail: 'unknown@example.com',
      }),
    ).toBeUndefined();
  });

  it('getContactName returns undefined for non-trainee project type', () => {
    const discoveryProject = {
      ...baseProject,
      projectType: 'Discovery Project' as const,
      researchTheme: 'Theme',
      teamName: 'Team A',
      fundedTeam: { id: 'team-1', displayName: 'Team A', teamType: 'CRN' },
    };
    expect(
      traineeConfig.getContactName(
        discoveryProject as unknown as DiscoveryProjectDetail,
      ),
    ).toBeUndefined();
  });
});
