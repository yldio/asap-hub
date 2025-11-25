import { NotFoundError } from '@asap-hub/errors';
import ProjectController from '../../src/controllers/project.controller';
import { getDataProviderMock } from '../mocks/data-provider.mock';
import {
  getExpectedProjectList,
  getExpectedDiscoveryProject,
} from '../fixtures/projects.fixtures';
import type { ProjectType, ProjectStatus } from '@asap-hub/model';

describe('Project Controller', () => {
  const projectDataProviderMock = getDataProviderMock();
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
});
