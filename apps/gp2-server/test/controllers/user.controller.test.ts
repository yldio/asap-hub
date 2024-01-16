import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import nock from 'nock';
import Users from '../../src/controllers/user.controller';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import { getUserDataObject, getUserResponse } from '../fixtures/user.fixtures';
import { assetDataProviderMock } from '../mocks/asset.data-provider.mock';
import { userDataProviderMock } from '../mocks/user.data-provider.mock';
jest.mock('../../src/utils/logger');

describe('Users controller', () => {
  const userController = new Users(userDataProviderMock, assetDataProviderMock);

  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    beforeEach(jest.resetAllMocks);

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
          tags: ['Aging', 'RNA'],
          projects: ['a project'],
          workingGroups: ['a working group'],
          orcid: '0000-0001-9884-1913',
          orcidLastSyncDate: '2020-09-23T20:45:22.000Z',
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
    beforeEach(jest.resetAllMocks);

    test('Should throw when user is not found', async () => {
      userDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        userController.fetchById('not-found', 'user-id'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the user when it finds it', async () => {
      const user = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(user);
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

    describe('Display name', () => {
      test('Should drop nickname and middle name when not available', async () => {
        const user = getUserDataObject() as gp2.UserDataObject;
        user.firstName = 'John';
        user.lastName = 'Smith';
        delete user.middleName;
        delete user.nickname;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(
          user.id,
          user.id,
        );

        expect(displayName).toEqual('John Smith');
      });

      test('Should use all middle name initials', async () => {
        const user = getUserDataObject() as gp2.UserDataObject;
        user.firstName = 'John';
        user.middleName = 'Wilbur Thomas Geofrey';
        user.lastName = 'Smith';
        delete user.nickname;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(
          user.id,
          user.id,
        );

        expect(displayName).toEqual('John W. T. G. Smith');
      });

      test('Should put any nickname in brackets', async () => {
        const user = getUserDataObject() as gp2.UserDataObject;
        user.firstName = 'John';
        user.nickname = 'R2 D2';
        user.lastName = 'Smith';
        delete user.middleName;

        userDataProviderMock.fetchById.mockResolvedValue(user);
        const { displayName } = await userController.fetchById(
          user.id,
          user.id,
        );

        expect(displayName).toEqual('John (R2 D2) Smith');
      });
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';

    beforeEach(jest.resetAllMocks);

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
        filter: { code, hidden: false },
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
    beforeEach(jest.resetAllMocks);

    test('Should return the newly updated user', async () => {
      const user = getUserDataObject();
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const result = await userController.update(user.id, {});

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith(user.id, {});
    });
  });

  describe('updateAvatar', () => {
    beforeEach(jest.resetAllMocks);

    test('should return 200 when syncs asset and updates users profile', async () => {
      const user = getUserDataObject();
      const userId = user.id;
      assetDataProviderMock.create.mockResolvedValueOnce('42');
      userDataProviderMock.fetchById.mockResolvedValueOnce(user);
      const result = await userController.updateAvatar(
        userId,
        Buffer.from('avatar'),
        'image/jpeg',
      );

      expect(result).toEqual(getUserResponse());
      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        avatar: '42',
      });
      expect(assetDataProviderMock.create).toHaveBeenCalledWith({
        id: userId,
        avatar: Buffer.from('avatar'),
        contentType: 'image/jpeg',
      });
      expect(userDataProviderMock.fetchById).toHaveBeenCalledWith(userId);
    });

    test('should throw when fails to update asset - contentful error', async () => {
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

    test('should throw when fails to update user - contentful error', async () => {
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
      jest.resetAllMocks().useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should replace the welcome code with connection code, set the activatedDate to current time and return the user on success', async () => {
      const currentTime = '2021-12-28T14:00:00.000Z';
      jest.setSystemTime(new Date(currentTime));
      const userId = '42';
      const welcomeCode = 'welcome-code';
      const user = {
        ...getUserDataObject(),
        id: userId,
        connections: [{ code: welcomeCode }],
        activatedDate: undefined,
      };
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [user],
      });
      userDataProviderMock.fetchById.mockResolvedValue({
        ...user,
        activatedDate: currentTime,
      });
      const newConnectionCode = 'auth0|auth-user-id';
      const result = await userController.connectByCode(
        welcomeCode,
        newConnectionCode,
      );

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [{ code: newConnectionCode }],
        activatedDate: currentTime,
      });
      expect(result).toMatchObject({
        ...getUserResponse(),
        id: userId,
        activatedDate: currentTime,
      });
    });

    test('should not update the activated date if already exists', async () => {
      const currentTime = '2022-12-28T14:00:00.000Z';
      jest.setSystemTime(new Date(currentTime));

      const activatedDate = '2021-12-28T14:00:00.000Z';
      const userId = '42';
      const user = {
        ...getUserDataObject(),
        id: userId,
        activatedDate,
      };
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [user],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      await userController.connectByCode('some code', 'auth-user-id');

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: expect.anything(),
        activatedDate,
      });
    });
    test('should not update the user when connecting with existing connection code', async () => {
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
      await userController.connectByCode('asapWelcomeCode', userCode);

      expect(userDataProviderMock.update).not.toHaveBeenCalled();
    });

    test('should keep the existing connections when creating a new one', async () => {
      const userId = '42';
      const welcomeCode = 'welcome-code';
      const existingConnectionCode = 'google-oauth2|token';
      const user = {
        ...getUserDataObject(),
        id: userId,
        connections: [{ code: existingConnectionCode }, { code: welcomeCode }],
        activatedDate: undefined,
      };
      userDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [user],
      });
      userDataProviderMock.fetchById.mockResolvedValue(user);
      const newConnectionCode = 'auth0|auth-user-id';
      await userController.connectByCode(welcomeCode, newConnectionCode);

      expect(userDataProviderMock.update).toHaveBeenCalledWith(userId, {
        email: user.email,
        connections: [
          { code: existingConnectionCode },
          { code: newConnectionCode },
        ],
        activatedDate: expect.anything(),
      });
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

    test('Should update user profile orcidLastSyncDate when ORCID returns 500', async () => {
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
      expect(userDataProviderMock.update).toHaveBeenCalledWith(user.id, {
        email: user.email,
        orcidLastSyncDate: expect.any(String),
      });
      expect(result).toEqual({ ...getUserResponse(), orcid });
    });

    test('Should update user profile orcidLastSyncDate when last-modified-date is null', async () => {
      const user = { ...getUserDataObject(), orcid };
      userDataProviderMock.fetchById.mockResolvedValue(user);

      const orcidWorksResponse = {
        ...orcidFixtures.orcidWorksResponse,
      };
      orcidWorksResponse['last-modified-date'] = null;

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidWorksResponse);

      await userController.syncOrcidProfile(userId);

      expect(userDataProviderMock.update).toHaveBeenCalledWith(user.id, {
        email: user.email,
        orcidLastSyncDate: expect.any(String),
      });
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
            orcidFixtures.orcidWorksResponse['last-modified-date']!.value,
          ).toISOString(),
        }),
      );
    });
  });
});
