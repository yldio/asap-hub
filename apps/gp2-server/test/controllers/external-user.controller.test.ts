import { FetchOptions } from '@asap-hub/model';
import ExternalUsers from '../../src/controllers/external-user.controller';
import {
  getExternalUserDataObject,
  getExternalUserResponse,
} from '../fixtures/external-users.fixtures';
import { externalUserDataProviderMock } from '../mocks/external-user-data-provider.mock';

describe('External Users controller', () => {
  const userController = new ExternalUsers(externalUserDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      externalUserDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getExternalUserDataObject()],
      });
      const result = await userController.fetch({});

      const expectedUser = getExternalUserResponse();
      expect(result).toEqual({ items: [expectedUser], total: 1 });
    });

    test('Should return empty list when there are no users', async () => {
      externalUserDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data-provider with correct parameters', async () => {
      externalUserDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });

      const params: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };
      await userController.fetch(params);

      expect(externalUserDataProviderMock.fetch).toHaveBeenCalledWith(params);
    });
  });
});
