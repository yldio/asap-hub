import { NotFoundError } from '@asap-hub/errors';
import Tutorials from '../../src/controllers/tutorial.controller';
import { TutorialDataProvider } from '../../src/data-providers/types';
import {
  getTutorialsDataObject,
  getListTutorialsDataObject,
  getTutorialResponse,
  getListTutorialsResponse,
} from '../fixtures/tutorials.fixtures';

import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Team Controller', () => {
  const tutorialDataProviderMock = getDataProviderMock();
  const tutorialsController = new Tutorials(tutorialDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no tutorial exists', async () => {
      tutorialDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await tutorialsController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should fetch tutorials', async () => {
      tutorialDataProviderMock.fetch.mockResolvedValue(
        getListTutorialsDataObject(),
      );

      const result = await tutorialsController.fetch({});

      expect(result).toMatchObject(getListTutorialsResponse());
    });

    test('Should call the data provider with correct parameters', async () => {
      tutorialDataProviderMock.fetch.mockResolvedValueOnce(
        getListTutorialsDataObject(),
      );

      const parameters: Parameters<typeof tutorialsController.fetch>[0] = {
        search: 'some-search',
        skip: 13,
        take: 9,
      };

      await tutorialsController.fetch(parameters);

      const expectedParameters: Parameters<TutorialDataProvider['fetch']>[0] = {
        skip: 13,
        take: 9,
        search: 'some-search',
      };
      expect(tutorialDataProviderMock.fetch).toBeCalledWith(expectedParameters);
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when tutorial is not found', async () => {
      tutorialDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(tutorialsController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the tutorial when it finds it', async () => {
      tutorialDataProviderMock.fetchById.mockResolvedValueOnce(
        getTutorialsDataObject(),
      );
      const result = await tutorialsController.fetchById('tutorial-id');

      expect(result).toEqual(getTutorialResponse());
    });
  });
});
