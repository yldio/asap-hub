import { NotFoundError } from '@asap-hub/errors';
import ProjectController from '../../src/controllers/project.controller';
import { projectDataProviderMock } from '../mocks/project.data-provider.mock';
import {
  getExpectedProjectList,
  getExpectedDiscoveryProject,
  getProjectMilestonesResponse,
} from '../fixtures/projects.fixtures';
import type {
  ProjectTool,
  ProjectType,
  ProjectStatus,
  MilestoneCreateRequest,
} from '@asap-hub/model';

describe('Project Controller', () => {
  const controller = new ProjectController(projectDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetch', () => {
    it('returns the list provided by the data provider', async () => {
      const expectedList = {
        total: 4,
        items: getExpectedProjectList(),
      };
      projectDataProviderMock.fetch.mockResolvedValueOnce(expectedList);

      const result = await controller.fetch();

      expect(result).toEqual(expectedList);
      expect(projectDataProviderMock.fetch).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        search: undefined,
        filter: undefined,
      });
    });

    it('passes through the provided options', async () => {
      projectDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getExpectedDiscoveryProject()],
      });

      const options = {
        take: 5,
        skip: 15,
        search: 'olfactory',
        filter: {
          projectType: ['Discovery Project'] as ProjectType[],
          status: ['Active'] as ProjectStatus[],
        },
      };

      await controller.fetch(options);

      expect(projectDataProviderMock.fetch).toHaveBeenCalledWith(options);
    });
  });

  describe('fetchById', () => {
    it('returns the project when found', async () => {
      const project = getExpectedDiscoveryProject();
      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);

      const result = await controller.fetchById(project.id);

      expect(result).toEqual(project);
    });

    it('throws NotFoundError when the project does not exist', async () => {
      projectDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(controller.fetchById('missing-id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('fetchByTeamId', () => {
    it('returns the list provided by the data provider', async () => {
      const expectedList = {
        total: 2,
        items: [getExpectedDiscoveryProject()],
      };
      projectDataProviderMock.fetchByTeamId.mockResolvedValueOnce(expectedList);

      const result = await controller.fetchByTeamId('team-1', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual(expectedList);
      expect(projectDataProviderMock.fetchByTeamId).toHaveBeenCalledWith(
        'team-1',
        { take: 10, skip: 0 },
      );
    });

    it('passes through pagination options correctly', async () => {
      projectDataProviderMock.fetchByTeamId.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await controller.fetchByTeamId('team-1', { take: 5, skip: 15 });

      expect(projectDataProviderMock.fetchByTeamId).toHaveBeenCalledWith(
        'team-1',
        { take: 5, skip: 15 },
      );
    });
  });

  describe('fetchByUserId', () => {
    it('returns the list provided by the data provider', async () => {
      const expectedList = {
        total: 2,
        items: [getExpectedDiscoveryProject()],
      };
      projectDataProviderMock.fetchByUserId.mockResolvedValueOnce(expectedList);

      const result = await controller.fetchByUserId('user-1', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual(expectedList);
      expect(projectDataProviderMock.fetchByUserId).toHaveBeenCalledWith(
        'user-1',
        { take: 10, skip: 0 },
      );
    });

    it('passes through pagination options correctly', async () => {
      projectDataProviderMock.fetchByUserId.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await controller.fetchByUserId('user-1', { take: 5, skip: 15 });

      expect(projectDataProviderMock.fetchByUserId).toHaveBeenCalledWith(
        'user-1',
        { take: 5, skip: 15 },
      );
    });
  });

  describe('update', () => {
    const tools: ProjectTool[] = [
      { name: 'Slack', url: 'https://slack.com', description: 'Team chat' },
    ];

    it('calls the data provider update with tools and returns the updated project', async () => {
      const project = getExpectedDiscoveryProject();
      projectDataProviderMock.update.mockResolvedValueOnce(undefined);
      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);

      const result = await controller.update(project.id, tools);

      expect(projectDataProviderMock.update).toHaveBeenCalledWith(project.id, {
        tools,
      });
      expect(projectDataProviderMock.fetchById).toHaveBeenCalledWith(
        project.id,
      );
      expect(result).toEqual(project);
    });

    it('throws NotFoundError when the project does not exist after update', async () => {
      projectDataProviderMock.update.mockResolvedValueOnce(undefined);
      projectDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(controller.update('missing-id', tools)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('fetchProjectMilestones', () => {
    it('returns the project milestones', async () => {
      const projectMilestones = getProjectMilestonesResponse();
      projectDataProviderMock.fetchProjectMilestones.mockResolvedValueOnce(
        projectMilestones,
      );

      const result = await controller.fetchProjectMilestones('project-1', {
        grantType: 'original',
      });

      expect(result).toEqual(projectMilestones);
    });
  });

  describe('createMilestone', () => {
    const milestoneData: MilestoneCreateRequest = {
      description: 'Milestone 1',
      status: 'In Progress',
      aimIds: ['aim-id-1'],
      grantType: 'original',
    };

    it('creates a milestone when project has no supplement grant and grantType is original', async () => {
      const project = {
        ...getExpectedDiscoveryProject(),
        supplementGrant: undefined,
      };

      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);
      projectDataProviderMock.createMilestone.mockResolvedValueOnce(
        'milestone-1',
      );

      const result = await controller.createMilestone(
        project.id,
        milestoneData,
      );

      expect(projectDataProviderMock.fetchById).toHaveBeenCalledWith(
        project.id,
      );
      expect(projectDataProviderMock.createMilestone).toHaveBeenCalledWith(
        milestoneData,
      );
      expect(result).toBe('milestone-1');
    });

    it('creates a milestone when project has supplement grant and grantType is supplement', async () => {
      const project = {
        ...getExpectedDiscoveryProject(),
        supplementGrant: { id: 'supp-1' },
      };

      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);
      projectDataProviderMock.createMilestone.mockResolvedValueOnce(
        'milestone-2',
      );

      const result = await controller.createMilestone(project.id, {
        ...milestoneData,
        grantType: 'supplement',
      });

      expect(projectDataProviderMock.createMilestone).toHaveBeenCalledWith({
        ...milestoneData,
        grantType: 'supplement',
      });
      expect(result).toBe('milestone-2');
    });

    it('throws NotFoundError when project does not exist', async () => {
      projectDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        controller.createMilestone('missing-id', milestoneData),
      ).rejects.toThrow(NotFoundError);
    });

    it('throws badRequest when supplement grant exists but grantType selected is original', async () => {
      const project = {
        ...getExpectedDiscoveryProject(),
        supplementGrant: { id: 'supp-1' },
      };

      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);

      await expect(
        controller.createMilestone(project.id, milestoneData),
      ).rejects.toThrow(
        'Cannot create milestones for Original grant when a Supplement grant exists',
      );

      expect(projectDataProviderMock.createMilestone).not.toHaveBeenCalled();
    });

    it('throws badRequest when no supplement grant exists but grantType selected is supplement', async () => {
      const project = {
        ...getExpectedDiscoveryProject(),
        supplementGrant: undefined,
      };

      projectDataProviderMock.fetchById.mockResolvedValueOnce(project);

      await expect(
        controller.createMilestone(project.id, {
          ...milestoneData,
          grantType: 'supplement',
        }),
      ).rejects.toThrow(
        'Cannot create milestones for Supplement grant when no Supplement grant exists',
      );

      expect(projectDataProviderMock.createMilestone).not.toHaveBeenCalled();
    });
  });
});
