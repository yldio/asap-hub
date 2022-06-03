import { GenericError, NotFoundError } from '@asap-hub/errors';
import nock from 'nock';
import Users from '../../src/controllers/users';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import { getUserDataObject, getUserResponse } from '../fixtures/users.fixtures';

const mockUserDataProvider = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  syncOrcidProfile: jest.fn(),
};
const mockAssetDataProvider = {
  create: jest.fn(),
};

describe('Users controller', () => {
  const usersMockGraphqlClient = new Users(
    mockUserDataProvider,
    mockAssetDataProvider,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
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
    beforeEach(() => {
      jest.resetAllMocks();
    });
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
      jest.resetAllMocks();
    });
    const code = 'some-uuid-code';

    test('Should return the users', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue({ total: 1, items: [getUserDataObject()] });
      const result = await usersMockGraphqlClient.fetchByCode(code);
      expect(result).toEqual(getUserResponse());
    });
    test('Should throw 404 when no user is found', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue({ total: 0, items: [] });

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw when it finds more than one user', async () => {
      mockUserDataProvider.fetch = jest.fn().mockResolvedValue({
        total: 2,
        items: [getUserDataObject(), getUserDataObject()],
      });
      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        GenericError,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('Should return the newly updated user', async () => {
      mockUserDataProvider.update = jest.fn();
      const mockResponse = getUserDataObject();
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await usersMockGraphqlClient.update('user-id', {});
      expect(result).toEqual(getUserResponse());
      expect(mockUserDataProvider.update).toHaveBeenCalledWith('user-id', {});
    });
  });

  describe('updateAvatar', () => {
    beforeEach(nock.cleanAll);
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('should return 200 when syncs asset and updates users profile', async () => {
      mockAssetDataProvider.create = jest.fn().mockResolvedValue(42);
      mockUserDataProvider.update = jest.fn();
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(getUserDataObject());

      const result = await usersMockGraphqlClient.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual(getUserResponse());
      expect(nock.isDone()).toBe(true);
      expect(mockUserDataProvider.update).toHaveBeenCalledWith('user-id', {
        avatar: 42,
      });
      expect(mockAssetDataProvider.create).toHaveBeenCalledWith(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(mockUserDataProvider.fetchById).toHaveBeenCalledWith('user-id');
    });
    test('should throw when fails to update asset - squidex error', async () => {
      mockAssetDataProvider.create = jest.fn().mockResolvedValue(42);
      mockUserDataProvider.update = jest.fn().mockRejectedValue(new Error());

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });
    test('should throw when fails to update user - squidex error', async () => {
      mockAssetDataProvider.create = jest.fn().mockRejectedValue(new Error());

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });
  });

  describe('connectByCode', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test('should connect and return the user on success', async () => {
      const userId = 42;
      const user = getUserDataObject();
      mockUserDataProvider.fetch = jest.fn().mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      mockUserDataProvider.update = jest.fn();
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(user);
      const result = await usersMockGraphqlClient.connectByCode(
        'some code',
        'user-id',
      );
      expect(mockUserDataProvider.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [{ code: 'user-id' }],
      });
      expect(result).toEqual(getUserResponse());
    });
    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = 42;
      const userCode = 'google-oauth2|token';

      mockUserDataProvider.fetch = jest.fn().mockResolvedValue({
        total: 1,
        items: [
          {
            ...getUserDataObject(),
            id: userId,
            connections: [{ code: userCode }],
          },
        ],
      });
      mockUserDataProvider.update = jest.fn();
      mockUserDataProvider.fetchById = jest
        .fn()
        .mockResolvedValue(getUserDataObject());

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userCode,
      );
      expect(mockUserDataProvider.update).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    test('throws if no user is returned', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue({ total: 0, items: [] });

      await expect(
        usersMockGraphqlClient.connectByCode('some code', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('syncOrcidProfile', () => {
    const userId = 'userId';
    const orcid = '363-98-9330';

    beforeEach(() => jest.resetAllMocks());
    test('should successfully fetch and update user - with id', async () => {
      const user = { ...getUserDataObject(), orcid };
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(user);
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId);
      expect(mockUserDataProvider.update).toHaveBeenCalled();
      expect(result).toEqual({ ...getUserResponse(), orcid });
      expect(mockUserDataProvider.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: user.email,
          orcidLastModifiedDate: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
          orcidWorks: orcidFixtures.orcidWorksDeserialisedExpectation,
        }),
      );
    });
    test('successfully fetch and update user - with user', async () => {
      const user = { ...getUserDataObject(), orcid };
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(user);
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: 'cache-user-email',
        orcid,
      });
      expect(mockUserDataProvider.update).toHaveBeenCalled();
      expect(mockUserDataProvider.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: 'cache-user-email',
          orcidLastModifiedDate: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
          orcidWorks: orcidFixtures.orcidWorksDeserialisedExpectation,
        }),
      );
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });
    test('Should update user profile even when ORCID returns 500', async () => {
      const user = { ...getUserDataObject(), orcid };
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(user);
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .times(3)
        .reply(502, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: user.email,
        orcid,
      });
      expect(mockUserDataProvider.update).toHaveBeenCalled();
      expect(mockUserDataProvider.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: user.email,
        }),
      );
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });
    test('Throws when user does not exist', async () => {
      mockUserDataProvider.fetchById = jest.fn().mockResolvedValue(null);

      await expect(
        usersMockGraphqlClient.syncOrcidProfile('user-not-found'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
