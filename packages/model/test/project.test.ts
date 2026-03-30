import {
  isProjectType,
  projectTypes,
  isProjectLead,
  Project,
} from '../src/project';

const baseProject = {
  id: 'proj-1',
  title: 'Test Project',
  status: 'Active' as const,
  statusRank: 1,
  startDate: '2025-01-01',
  endDate: '2026-01-01',
  tags: [],
};

describe('Project Model', () => {
  describe('isProjectLead', () => {
    it('returns true for a Discovery Project PM', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-1', role: 'Project Manager' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(true);
    });

    it('returns true for a Discovery Project Lead PI', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-1', role: 'Lead PI (Core Leadership)' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(true);
    });

    it('returns true for a Discovery Project Co-PI', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-1', role: 'Co-PI (Core Leadership)' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(true);
    });

    it('returns true for a Discovery Project Data Manager', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-1', role: 'Data Manager' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(true);
    });

    it('returns false for a non-lead team role on a Discovery Project', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-1', role: 'Key Personnel' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(false);
    });

    it('returns false when user is not on the project team', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
        teamId: 'team-1',
      };
      const userTeams = [{ id: 'team-other', role: 'Project Manager' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(false);
    });

    it('returns true for Trainee Project Lead', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Trainee Project',
        members: [
          {
            id: 'user-1',
            displayName: 'Test User',
            role: 'Trainee Project - Lead',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(true);
    });

    it('returns false for Trainee Project Mentor', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Trainee Project',
        members: [
          {
            id: 'user-1',
            displayName: 'Test User',
            role: 'Trainee Project - Mentor',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(false);
    });

    it('returns false for Trainee Project when user is not a member', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Trainee Project',
        members: [
          {
            id: 'other-user',
            displayName: 'Other User',
            role: 'Trainee Project - Lead',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(false);
    });

    it('returns true for user-based Resource Project PM in members', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Resource',
        isTeamBased: false,
        members: [
          {
            id: 'user-1',
            displayName: 'Test User',
            role: 'Project Manager',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(true);
    });

    it('returns false for user-based Resource Project with non-lead role', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Resource',
        isTeamBased: false,
        members: [
          {
            id: 'user-1',
            displayName: 'Test User',
            role: 'Key Personnel',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(false);
    });

    it('returns false for user-based Resource Project when user has no role', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Resource',
        isTeamBased: false,
        members: [
          {
            id: 'user-1',
            displayName: 'Test User',
          },
        ],
      };
      expect(isProjectLead('user-1', [], project)).toBe(false);
    });

    it('returns true for team-based Resource Project with lead team role', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Resource Project',
        resourceType: 'Resource',
        isTeamBased: true,
        teamId: 'team-1',
        teamName: 'Team A',
      };
      const userTeams = [{ id: 'team-1', role: 'Project Manager' }];
      expect(isProjectLead('user-1', userTeams, project)).toBe(true);
    });

    it('returns false for a Discovery Project without a teamId', () => {
      const project: Project = {
        ...baseProject,
        projectType: 'Discovery Project',
        researchTheme: 'theme',
        teamName: 'Team A',
      };
      expect(isProjectLead('user-1', [], project)).toBe(false);
    });
  });

  describe('isProjectType', () => {
    it.each(projectTypes)(
      'should return true for valid project type "%s"',
      (projectType) => {
        expect(isProjectType(projectType)).toBe(true);
      },
    );

    it('should return false for invalid string', () => {
      expect(isProjectType('Invalid Project')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isProjectType(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isProjectType(null)).toBe(false);
    });

    it('should return false for number', () => {
      expect(isProjectType(123)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isProjectType('')).toBe(false);
    });
  });
});
