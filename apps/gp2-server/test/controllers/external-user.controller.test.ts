import { NotFoundError } from '@asap-hub/errors';
import { FetchOptions } from '@asap-hub/model';
import ExternalUsers from '../../src/controllers/external-user.controller';
import {
  getExternalUserDataObject,
  getExternalUserResponse,
} from '../fixtures/external-users.fixtures';
import { externalUserDataProviderMock } from '../mocks/external-user.data-provider.mock';

describe('External Users controller', () => {
  const externalUserController = new ExternalUsers(
    externalUserDataProviderMock,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      externalUserDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getExternalUserDataObject()],
      });
      const result = await externalUserController.fetch({});

      const expectedUser = getExternalUserResponse();
      expect(result).toEqual({ items: [expectedUser], total: 1 });
    });

    test('Should return empty list when there are no users', async () => {
      externalUserDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await externalUserController.fetch({});

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
      await externalUserController.fetch(params);

      expect(externalUserDataProviderMock.fetch).toHaveBeenCalledWith(params);
    });
  });

  describe('FetchById', () => {
    beforeEach(jest.resetAllMocks);

    test('Should throw when external user is not found', async () => {
      externalUserDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        externalUserController.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the external user when it finds it', async () => {
      const externalUser = getExternalUserDataObject();
      externalUserDataProviderMock.fetchById.mockResolvedValue(
        getExternalUserDataObject(),
      );
      const result = await externalUserController.fetchById(externalUser.id);

      expect(result).toEqual(getExternalUserResponse());
    });
  });
});
