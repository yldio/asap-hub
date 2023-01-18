import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import Users from '../../src/controllers/user.controller';
import { getUserDataObject, getUserResponse } from '../fixtures/user.fixtures';
import { assetDataProviderMock } from '../mocks/asset-data-provider.mock';
import { userDataProviderMock } from '../mocks/user-data-provider.mock';

describe('Users controller', () => {
  const userController = new Users(userDataProviderMock, assetDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return the users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserDataObject()],
      });
      const result = await userController.fetch({});

      const { telephone: _, ...expectedUser } = getUserResponse();
      expect(result).toEqual({ items: [expectedUser], total: 1 });
    });

    test('Should return empty list when there are no users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data-provider with correct parameters', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });

      const params: gp2.FetchUsersOptions = {
        take: 15,
        skip: 5,
        search: 'something',
        filter: {
          code: '123',
          onlyOnboarded: false,
          regions: ['Europe'],
          keywords: ['Bash', 'R'],
          projects: ['a project'],
          workingGroups: ['a working group'],
        },
      };
      await userController.fetch(params);

      expect(userDataProviderMock.fetch).toHaveBeenCalledWith(params);
    });

    test('Should default to onboarded users only', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });

      await userController.fetch({});

      const params: gp2.FetchUsersOptions = {
        filter: {
          onlyOnboarded: true,
        },
      };
      expect(userDataProviderMock.fetch).toHaveBeenCalledWith(params);
    });
  });

  describe('FetchById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should throw when user is not found', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        userController.fetchById('not-found', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the user when it finds it', async () => {
      const user = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(getUserDataObject());
      const result = await userController.fetchById(user.id, user.id);

      expect(result).toEqual(getUserResponse());
    });
    test('should only return telephone for own user', async () => {
      const user = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.fetchById(
        user.id,
        'not-the-current-users-id',
      );

      expect(result.telephone).toBeUndefined();
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return the users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserDataObject()],
      });
      const result = await userController.fetchByCode(code);

      expect(result).toEqual(getUserResponse());
    });

    test('Should call the data provider with correct parameters', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserDataObject()],
      });
      await userController.fetchByCode(code);

      expect(userDataProviderMock.fetch).toBeCalledWith({
        filter: { code },
        take: 1,
        skip: 0,
      });
    });

    test('Should throw 404 when no user is found', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });

      await expect(userController.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw when it finds more than one user', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 2,
        items: [getUserDataObject(), getUserDataObject()],
      });

      await expect(userController.fetchByCode(code)).rejects.toThrow(
        GenericError,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return the newly updated user', async () => {
      const user = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.update(user.id, {}, user.id);

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith(user.id, {});
    });
  });

  describe('updateAvatar', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should return 200 when syncs asset and updates users profile', async () => {
      const user = getUserDataObject();
      const userId = user.id;
      assetDataProviderMock.create.mockResolvedValueOnce('42');
      userDataProviderMock.fetchById.mockResolvedValueOnce(user);
      const result = await userController.updateAvatar(
        userId,
        Buffer.from('avatar'),
        'image/jpeg',
        userId,
      );

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        avatarUrl: '42',
      });
      expect(assetDataProviderMock.create).toHaveBeenCalledWith(
        userId,
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(userDataProviderMock.fetchById).toHaveBeenCalledWith(userId);
    });

    test('should throw when fails to update asset - squidex error', async () => {
      assetDataProviderMock.create.mockResolvedValue('42');
      userDataProviderMock.update.mockRejectedValue(new Error());

      await expect(
        userController.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
          'user-id',
        ),
      ).rejects.toThrow();
    });

    test('should throw when fails to update user - squidex error', async () => {
      assetDataProviderMock.create.mockRejectedValue(new Error());

      await expect(
        userController.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
          'user-id',
        ),
      ).rejects.toThrow();
    });
  });

  describe('connectByCode', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should connect and return the user on success', async () => {
      const userId = '42';
      const user = {
        ...getUserDataObject(),
        id: userId,
      };
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.connectByCode(
        'some code',
        'auth-user-id',
      );

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [{ code: 'auth-user-id' }],
      });
      expect(result).toEqual({ ...getUserResponse(), id: userId });
    });
    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = '42';
      const userCode = 'google-oauth2|token';
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [
          {
            ...getUserDataObject(),
            id: userId,
            connections: [{ code: userCode }],
          },
        ],
      });
      userDataProviderMock.fetchById.mockResolvedValue(getUserDataObject());
      const result = await userController.connectByCode(
        'asapWelcomeCode',
        userCode,
      );

      expect(userDataProviderMock.update).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    test('throws if no user is returned', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });

      await expect(
        userController.connectByCode('some code', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
