import { GenericError, NotFoundError } from '@asap-hub/errors';
import Users from '../../src/controllers/user.controller';
import { getUserDataObject, getUserResponse } from '../fixtures/user.fixtures';
import { userDataProviderMock } from '../mocks/user-data-provider.mock';

describe('Users controller', () => {
  const userController = new Users(userDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('FetchById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should throw when user is not found', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(userController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the user when it finds it', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(getUserDataObject());
      const result = await userController.fetchById('user-id');

      expect(result).toEqual(getUserResponse());
    });

    test('Should default onboarded flag to true when its null', async () => {
      const userData = getUserDataObject();
      userData.onboarded = null;
      userDataProviderMock.fetchById.mockResolvedValue(userData);
      const result = await userController.fetchById('user-id');

      expect(result?.onboarded).toEqual(true);
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
        filter: { code, hidden: false, onboarded: false },
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
      const mockResponse = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await userController.update('user-id', {});

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith('user-id', {});
    });
  });

  describe('connectByCode', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should connect and return the user on success', async () => {
      const userId = '42';
      const user = getUserDataObject();
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.connectByCode('some code', 'user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [{ code: 'user-id' }],
      });
      expect(result).toEqual(getUserResponse());
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
