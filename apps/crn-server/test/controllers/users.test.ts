import { GenericError, NotFoundError } from '@asap-hub/errors';
import nock from 'nock';
import Users from '../../src/controllers/users';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import { getUserDataObject, getUserResponse } from '../fixtures/users.fixtures';
import { assetDataProviderMock } from '../mocks/asset-data-provider.mock';
import { userDataProviderMock } from '../mocks/user-data-provider.mock';

describe('Users controller', () => {
  const userController = new Users(userDataProviderMock, assetDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getUserDataObject()],
      });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [getUserResponse()], total: 1 });
    });

    test('Should return empty list when there are no users', async () => {
      userDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });
      const result = await userController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
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

  describe('updateAvatar', () => {
    beforeEach(nock.cleanAll);

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('should return 200 when syncs asset and updates users profile', async () => {
      assetDataProviderMock.create.mockResolvedValueOnce('42');
      userDataProviderMock.fetchById.mockResolvedValueOnce(getUserDataObject());
      const result = await userController.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );

      expect(result).toEqual(getUserResponse());
      expect(nock.isDone()).toBe(true);
      expect(userDataProviderMock.update).toHaveBeenCalledWith('user-id', {
        avatar: '42',
      });
      expect(assetDataProviderMock.create).toHaveBeenCalledWith(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(userDataProviderMock.fetchById).toHaveBeenCalledWith('user-id');
    });

    test('should throw when fails to update asset - squidex error', async () => {
      assetDataProviderMock.create.mockResolvedValue('42');
      userDataProviderMock.update.mockRejectedValue(new Error());

      await expect(
        userController.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
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

  describe('syncOrcidProfile', () => {
    const userId = 'userId';
    const orcid = '363-98-9330';

    beforeEach(() => jest.resetAllMocks());

    test('should successfully fetch and update user - with id', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(result).toEqual({ ...getUserResponse(), orcid });
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
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
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: 'cache-user-email',
        orcid,
      });

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
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
      userDataProviderMock.fetchById.mockResolvedValue(user);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .times(3)
        .reply(502, orcidFixtures.orcidWorksResponse);

      const result = await userController.syncOrcidProfile(userId, {
        ...getUserResponse(),
        email: user.email,
        orcid,
      });

      expect(userDataProviderMock.update).toHaveBeenCalled();
      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          email: user.email,
        }),
      );
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });

    test('Throws when user does not exist', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        userController.syncOrcidProfile('user-not-found'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
