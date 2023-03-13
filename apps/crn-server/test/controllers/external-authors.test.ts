import ExternalAuthors from '../../src/controllers/external-authors';
import { externalAuthorDataProviderMock } from '../mocks/external-author-data-provider.mock';

describe('External Authors controller', () => {
  const externalAuthorsController = new ExternalAuthors(
    externalAuthorDataProviderMock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('calls through to data provider fetch method', async () => {
      await externalAuthorsController.fetch({ take: 10, skip: 20 });
      expect(externalAuthorDataProviderMock.fetch).toHaveBeenCalledWith({
        take: 10,
        skip: 20,
      });
    });
  });

  describe('FetchById', () => {
    test('calls through to data provider fetchById method', async () => {
      externalAuthorDataProviderMock.fetchById.mockResolvedValueOnce({
        id: '123',
        displayName: 'Test Author',
      });
      const result = await externalAuthorsController.fetchById('123');
      expect(externalAuthorDataProviderMock.fetchById).toHaveBeenCalledWith(
        '123',
      );
      expect(result).toEqual({
        id: '123',
        displayName: 'Test Author',
      });
    });

    test('throws if no result is returned', async () => {
      externalAuthorDataProviderMock.fetchById.mockResolvedValueOnce(null);
      expect(externalAuthorsController.fetchById('123')).rejects.toThrow();
    });
  });
});
