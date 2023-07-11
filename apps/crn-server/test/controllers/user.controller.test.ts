import { GenericError, NotFoundError } from '@asap-hub/errors';
import nock from 'nock';
import Users from '../../src/controllers/user.controller';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import { getUserDataObject, getUserResponse } from '../fixtures/users.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Users controller', () => {
  const assetDataProviderMock = getDataProviderMock();
  const userDataProviderMock = getDataProviderMock();
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
      expect(assetDataProviderMock.create).toHaveBeenCalledWith({
        id: 'user-id',
        avatar: Buffer.from('avatar'),
        contentType: 'image/jpeg',
      });
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
    test('should replace the welcome code with the connection code and return the user on success', async () => {
      const userId = '42';
      const user = getUserDataObject();
      const welcomeCode = 'welcome-code';
      user.connections = [{ code: welcomeCode }];
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.connectByCode(welcomeCode, 'user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [{ code: 'user-id' }],
      });
      expect(result).toEqual(getUserResponse());
    });

    test('should keep the existing connections when creating a new one', async () => {
      const userId = '42';
      const user = getUserDataObject();
      const existingConnection = 'auth0|123456';
      const welcomeCode = 'welcome-code';
      user.connections = [{ code: existingConnection }, { code: welcomeCode }];
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [{ ...user, id: userId }],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      await userController.connectByCode('some code', 'user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: expect.arrayContaining([
          {
            code: existingConnection,
          },
        ]),
      });
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
          orcidLastModifiedDate: '2020-07-14T01:36:15.911Z',
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
          orcidLastModifiedDate: '2020-07-14T01:36:15.911Z',
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

    test('should convert the modified date to ISO before sending to data provider', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      const orcidWorksResponse = {
        ...orcidFixtures.orcidWorksResponse,
      };
      orcidWorksResponse['last-modified-date'] = { value: 1594690575911 };

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidWorksResponse);

      await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          orcidLastModifiedDate: new Date(
            orcidFixtures.orcidWorksResponse['last-modified-date'].value,
          ).toISOString(),
        }),
      );
    });
  });
});
