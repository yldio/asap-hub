import { NotFoundError } from '@asap-hub/errors';
import Projects from '../../src/controllers/project.controller';
import {
  getListProjectDataObject,
  getListProjectsResponse,
  getProjectDataObject,
  getProjectResponse,
} from '../fixtures/project.fixtures';
import { projectDataProviderMock } from '../mocks/project-data-provider.mock';

describe('Project controller', () => {
  const projectController = new Projects(projectDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the project', async () => {
      projectDataProviderMock.fetch.mockResolvedValue(
        getListProjectDataObject(),
      );
      const result = await projectController.fetch();

      expect(result).toEqual(getListProjectsResponse());
    });

    test('Should return empty list when there are no projects', async () => {
      projectDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await projectController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });
  });
  describe('FetchById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should throw when project is not found', async () => {
      projectDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(projectController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the project when it finds it', async () => {
      projectDataProviderMock.fetchById.mockResolvedValue(
        getProjectDataObject(),
      );
      const result = await projectController.fetchById('project-id');

      expect(result).toEqual(getProjectResponse());
    });
  });
});
