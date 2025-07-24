import { NotFoundError } from '@asap-hub/errors';
import ManuscriptVersionController from '../../src/controllers/manuscript-version.controller';
import { ManuscriptVersionDataProvider } from '../../src/data-providers/types';
import {
  getManuscriptVersionDataObject,
  getManuscriptVersionsListResponse,
} from '../fixtures/manuscript-versions.fixtures';
import { manuscriptVersionDataProviderMock as manuscriptVersionDataProviderContentfulMock } from '../mocks/manuscript-version.data-provider.mock';

describe('Manuscript Version controller', () => {
  const manuscriptVersionDataProviderMock: jest.Mocked<ManuscriptVersionDataProvider> =
    manuscriptVersionDataProviderContentfulMock;

  const manuscriptVersionController = new ManuscriptVersionController(
    manuscriptVersionDataProviderMock,
  );

  describe('Fetch-by-ID method', () => {
    test('Should throw when version is not found', async () => {
      manuscriptVersionDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        manuscriptVersionController.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the latest related manuscript version when it finds it', async () => {
      const versionObject = getManuscriptVersionDataObject();
      manuscriptVersionDataProviderMock.fetchById.mockResolvedValueOnce(
        versionObject,
      );
      const result =
        await manuscriptVersionController.fetchById('manuscript-id');

      expect(result).toEqual(versionObject.latestManuscriptVersion);
    });
  });

  describe('Fetch', () => {
    test('Should return the manuscript versions', async () => {
      const manuscriptResponse = getManuscriptVersionsListResponse().items[0]!;
      manuscriptVersionDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [manuscriptResponse],
      });
      const result = await manuscriptVersionController.fetch({});

      expect(result).toEqual({ items: [manuscriptResponse], total: 1 });
    });

    test('Should return empty list when there are no manuscript versions', async () => {
      manuscriptVersionDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await manuscriptVersionController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });
});
