import { NotFoundError } from '@asap-hub/errors';
import Tutorials from '../../src/controllers/tutorials';
import {
  getTutorialsDataObject,
  getTutorialResponse,
} from '../fixtures/tutorials.fixtures';

import { tutorialDataProviderMock } from '../mocks/tutorials-data-provider.mock';

describe('Team Controller', () => {
  const tutorialsController = new Tutorials(tutorialDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
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
