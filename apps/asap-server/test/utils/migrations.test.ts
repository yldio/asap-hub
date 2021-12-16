import {
  RestUser,
  Results,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import { applyToAllItemsInCollection } from '../../src/utils/migrations';
import { restUserMock } from '../fixtures/users.fixtures';

const mockFetch: jest.MockedFunction<SquidexRestClient<RestUser>['fetch']> =
  jest.fn();
const mockConstructor = jest.fn();

jest.mock('@asap-hub/squidex', () => ({
  ...jest.requireActual('@asap-hub/squidex'),
  SquidexRest: class SquidexRest {
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
        expect.any(SquidexRest),
      );
    });

    test('Should invoke the given processing function with the results from each iteration', async () => {
      const mockFetchFirstResult: Results<RestUser> = {
        items: Array(10).fill(restUserMock),
        total: 11,
      };
      const mockFetchSecondResult: Results<RestUser> = {
        items: Array(1).fill(restUserMock),
        total: 11,
      };

      // resolve twice
      mockFetch.mockResolvedValueOnce(mockFetchFirstResult);
      mockFetch.mockResolvedValueOnce(mockFetchSecondResult);

      const processingFunction = jest.fn();

      await applyToAllItemsInCollection('user', processingFunction);

      expect(processingFunction).toBeCalledTimes(11);
      expect(processingFunction).toBeCalledWith(
        restUserMock,
        expect.any(SquidexRest),
      );
    });
  });
});
