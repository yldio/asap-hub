import { GenericError, NotFoundError } from '@asap-hub/errors';
import Users from '../../src/controllers/users';
import { getUserDataObject, getUserResponse } from '../fixtures/users.fixtures';

const mockUserDataProvider = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchByCode: jest.fn(),
  updateAvatar: jest.fn(),
  connectByCode: jest.fn(),
  syncOrcidProfile: jest.fn(),
};

describe('Users controller', () => {
  const usersMockGraphqlClient = new Users(mockUserDataProvider);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue({ total: 1, items: [getUserDataObject()] });
      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [getUserResponse()], total: 1 });
    });
    test('Should return empty list when there are no users', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue({ total: 0, items: [] });
      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('FetchById', () => {
    test('Should throw when user is not found', async () => {
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(null);
      await expect(
        usersMockGraphqlClient.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the user when it finds it', async () => {
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(getUserDataObject());
      const result = await usersMockGraphqlClient.fetchById('user-id');
      expect(result).toEqual(getUserResponse());
    });
    test('Should default onboarded flag to true when its null', async () => {
      const userData = getUserDataObject();
      userData.onboarded = null;
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(userData);

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result?.onboarded).toEqual(true);
    });
  });

  describe('fetchByCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const code = 'some-uuid-code';

    test('Should throw 403 when no user is found', async () => {
      mockUserDataProvider.fetchByCode = jest
        .fn()
        .mockResolvedValue({ total: 0, items: [] });

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw when it finds more than one user', async () => {
      mockUserDataProvider.fetchByCode = jest.fn().mockResolvedValue({
        total: 2,
        items: [getUserDataObject(), getUserDataObject()],
      });
      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        GenericError,
      );
    });
    test('Should return the users', async () => {
      mockUserDataProvider.fetchByCode = jest
        .fn()
        .mockResolvedValue({ total: 1, items: [getUserDataObject()] });
      const result = await usersMockGraphqlClient.fetchByCode(code);
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('update', () => {
    test('Should return the newly updated user', async () => {
      const mockResponse = getUserDataObject();
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await usersMockGraphqlClient.update('user-id', {});
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('updateAvatar', () => {
    test('should return 200 when syncs asset and updates users profile', async () => {
      mockUserDataProvider.updateAvatar = jest
        .fn()
        .mockResolvedValue(undefined);
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(getUserDataObject());

      const result = await usersMockGraphqlClient.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('connectByCode', () => {
    test('should return the user on success', async () => {
      mockUserDataProvider.connectByCode = jest
        .fn()
        .mockResolvedValue(getUserDataObject());

      const result = await usersMockGraphqlClient.connectByCode(
        'some code',
        'user-id',
      );
      expect(result).toEqual(getUserResponse());
    });
    test('throws if no user is returned', async () => {
      mockUserDataProvider.connectByCode = jest.fn().mockResolvedValue(null);

      await expect(
        usersMockGraphqlClient.connectByCode('some code', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('syncOrcidProfile', () => {
    test('should return the user on success', async () => {
      mockUserDataProvider.syncOrcidProfile = jest
        .fn()
        .mockResolvedValue(getUserDataObject());

      const result = await usersMockGraphqlClient.syncOrcidProfile('some code');
      expect(result).toEqual(getUserResponse());
    });
  });
});
