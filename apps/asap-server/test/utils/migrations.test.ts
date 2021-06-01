import { RestUser, Results, Squidex } from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../../src/utils/migrations';
import { restUserMock } from '../fixtures/users.fixtures';

const mockFetch: jest.MockedFunction<Squidex<RestUser>['fetch']> = jest.fn();
const mockConstructor = jest.fn();

jest.mock('@asap-hub/squidex', () => ({
  ...jest.requireActual('@asap-hub/squidex'),
  Squidex: class Squidex {
    constructor(collection: string) {
      mockConstructor(collection);
    }
    fetch = mockFetch;
  },
}));

describe('Migration utils', () => {
  describe('applyToAllItemsInCollection helper method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Should invoke the client as expected', async () => {
      const mockFetchResult: Results<RestUser> = {
        items: [],
        total: 0,
      };

      mockFetch.mockResolvedValueOnce(mockFetchResult);

      await applyToAllItemsInCollection('user', jest.fn());

      expect(mockConstructor).toBeCalledWith('user');
    });

    test('Should invoke the given processing function for every item in the result', async () => {
      const mockFetchResult: Results<RestUser> = {
        items: [restUserMock, restUserMock],
        total: 2,
      };

      mockFetch.mockResolvedValueOnce(mockFetchResult);

      const processingFunction = jest.fn();

      await applyToAllItemsInCollection('user', processingFunction);

      expect(processingFunction).toBeCalledTimes(2);
      expect(processingFunction).toBeCalledWith(
        restUserMock,
        expect.any(Squidex),
      );
    });

    test('Should invoke the given processing function with the results from each iteration', async () => {
      const mockFetchResult: Results<RestUser> = {
        items: [restUserMock],
        total: 11,
      };

      // resolve twice
      mockFetch.mockResolvedValueOnce(mockFetchResult);
      mockFetch.mockResolvedValueOnce(mockFetchResult);

      const processingFunction = jest.fn();

      await applyToAllItemsInCollection('user', processingFunction);

      expect(processingFunction).toBeCalledTimes(2);
      expect(processingFunction).toBeCalledWith(
        restUserMock,
        expect.any(Squidex),
      );
    });
  });
});
