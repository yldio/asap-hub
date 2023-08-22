import { NotFoundError } from '@asap-hub/errors';
import Projects from '../../src/controllers/project.controller';
import {
  getListProjectDataObject,
  getListProjectsResponse,
  getProjectDataObject,
  getProjectResponse,
} from '../fixtures/project.fixtures';
import { projectDataProviderMock } from '../mocks/project.data-provider.mock';

describe('Project controller', () => {
  const projectController = new Projects(projectDataProviderMock);

  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test('Should return the project', async () => {
      projectDataProviderMock.fetch.mockResolvedValue(
        getListProjectDataObject(),
      );
      const result = await projectController.fetch({}, '11');

      expect(result).toEqual(getListProjectsResponse());
    });

    test('Should return empty list when there are no projects', async () => {
      projectDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await projectController.fetch({}, '11');

      expect(result).toEqual({ items: [], total: 0 });
    });
    describe('resources', () => {
      const member = {
        userId: '7',
        firstName: 'Peter',
        lastName: 'Parker',
        role: 'Contributor' as const,
      };

      test('Should remove the resource if the user is not a member of the project', async () => {
        const list = getListProjectDataObject();

        const nonMemberProject = {
          ...getProjectDataObject(),
          members: [member],
        };
        const listWithNonMemberProject = {
          total: 2,
          items: [...list.items, nonMemberProject],
        };
        projectDataProviderMock.fetch.mockResolvedValue(
          listWithNonMemberProject,
        );
        const result = await projectController.fetch({}, '11');

        const expectedItems = getListProjectsResponse().items;
        const { resources: _, ...expectedProject } = getProjectResponse();

        expect(result.items).toStrictEqual([
          ...expectedItems,
          {
            ...expectedProject,
            members: [member],
          },
        ]);
      });
      test('Should remove the resources if the user is not specified', async () => {
        const nonMemberProject = {
          ...getProjectDataObject(),
          members: [member],
        };
        const listWithNonMemberProject = {
          total: 1,
          items: [nonMemberProject],
        };
        projectDataProviderMock.fetch.mockResolvedValue(
          listWithNonMemberProject,
        );
        const result = await projectController.fetch({});

        const { resources: _, ...expectedProject } = getProjectResponse();

        expect(result.items).toStrictEqual([
          {
            ...expectedProject,
            members: [member],
          },
        ]);
      });
    });
  });
  describe('FetchById', () => {
    beforeEach(jest.resetAllMocks);

    test('Should throw when project is not found', async () => {
      projectDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        projectController.fetchById('not-found', '11'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the project when it finds it', async () => {
      projectDataProviderMock.fetchById.mockResolvedValue(
        getProjectDataObject(),
      );
      const result = await projectController.fetchById('project-id', '11');

      expect(result).toEqual(getProjectResponse());
    });
    test('Should not set the opportunitiesAvailable in _tags if there is no opportunity link', async () => {
      const { opportunitiesLink: _, ...projectDataObject } =
        getProjectDataObject();
      projectDataProviderMock.fetchById.mockResolvedValue(projectDataObject);
      const result = await projectController.fetchById('project-id', '11');

      const { opportunitiesLink: __, ...expected } = getProjectResponse();
      expect(result).toEqual({
        ...expected,
        _tags: [],
      });
    });

    describe('resources', () => {
      const member = {
        userId: '7',
        firstName: 'Peter',
        lastName: 'Parker',
        role: 'Contributor' as const,
      };
      test('Should not return the resource when the user is not part of the project', async () => {
        projectDataProviderMock.fetchById.mockResolvedValue({
          ...getProjectDataObject(),
          members: [member],
        });
        const result = await projectController.fetchById('project-id', '11');

        const { resources: _, ...expectedProject } = getProjectResponse();
        expect(result).toStrictEqual({
          ...expectedProject,
          members: [member],
        });
      });
      test('Should not return the resource when the user is not specified', async () => {
        projectDataProviderMock.fetchById.mockResolvedValue({
          ...getProjectDataObject(),
          members: [member],
        });
        const result = await projectController.fetchById('project-id');

        const { resources: _, ...expectedProject } = getProjectResponse();
        expect(result).toStrictEqual({
          ...expectedProject,
          members: [member],
        });
      });
    });
  });
  describe('update', () => {
    beforeEach(jest.resetAllMocks);

    test('Should return the newly updated project', async () => {
      const resource = { type: 'Note' as const, title: 'a title to update' };
      const mockResponse = getProjectDataObject();
      projectDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await projectController.update(
        '7',
        {
          resources: [resource],
        },
        '11',
      );

      expect(result).toEqual(getProjectResponse());
      expect(projectDataProviderMock.update).toHaveBeenCalledWith('7', {
        resources: [resource],
      });
    });
  });
});
