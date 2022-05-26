import { GenericError, NotFoundError } from '@asap-hub/errors';
import { config } from '@asap-hub/squidex';
import matches from 'lodash.matches';
import nock from 'nock';
import Users from '../../src/controllers/users';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import {
  fetchUserResponse,
  getUserDataObject,
  getUserResponse,
  patchResponse,
} from '../fixtures/users.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

const mockUserDataProvider = {
  fetchById: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchByCode: jest.fn(),
  updateAvatar: jest.fn(),
};
jest.mock('../../src/data-providers/users', () =>
  jest.fn().mockImplementation(() => mockUserDataProvider),
);

describe('Users controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const usersMockGraphqlClient = new Users(squidexGraphqlClientMock);

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the users', async () => {
      mockUserDataProvider.fetch = jest
        .fn()
        .mockResolvedValue([getUserDataObject()]);
      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [getUserResponse()], total: 1 });
    });
    test('Should return empty list when there are no users', async () => {
      mockUserDataProvider.fetch = jest.fn().mockResolvedValue([]);
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
      mockUserDataProvider.fetchByCode = jest.fn().mockResolvedValue([]);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw when it finds more than one user', async () => {
      mockUserDataProvider.fetchByCode = jest
        .fn()
        .mockResolvedValue([getUserDataObject(), getUserDataObject()]);
      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        GenericError,
      );
    });
    test('Should return the users', async () => {
      mockUserDataProvider.fetchByCode = jest
        .fn()
        .mockResolvedValue([getUserDataObject()]);
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
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw forbidden when doesn find connection code', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'invalid-code'`,
        })
        .reply(404);

      await expect(
        usersMockGraphqlClient.connectByCode('invalid-code', 'user-id'),
      ).rejects.toThrow('Forbidden');
    });

    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });

    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];
      connectedUser.data.teams = undefined;

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });

    test('Should filter teams where teamId is undefined', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];
      connectedUser.data.teams.iv = [
        {
          id: [],
          role: 'Lead PI (Core Leadership)',
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
        },
        {
          id: ['team-id-3'],
          role: 'Collaborating PI',
        },
      ];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });
      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
      expect(result.teams).toEqual([
        {
          approach: undefined,
          displayName: 'Unknown',
          id: 'team-id-3',
          responsibilities: undefined,
          role: 'Collaborating PI',
        },
      ]);
    });

    test('Should connect user', async () => {
      const userId = 'google-oauth2|token';
      const patchedUser = JSON.parse(JSON.stringify(patchResponse));
      patchedUser.data.connections.iv = [{ code: userId }];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [patchResponse] })
        .patch(`/api/content/${config.appName}/users/${patchResponse.id}`, {
          email: { iv: patchResponse.data.email.iv },
          connections: { iv: [{ code: userId }] },
        })
        .reply(200, patchedUser);

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('syncOrcidProfile', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const userId = 'userId';
    const orcid = '363-98-9330';

    test('Throws when user does not exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/user-not-found`)
        .reply(404);

      await expect(
        usersMockGraphqlClient.syncOrcidProfile('user-not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update user profile even when ORCID returns 500', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .patch(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse);

      // times 3 because got will retry on 5XXs
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .times(3)
        .reply(502);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId);
      expect(result).toBeDefined(); // we only care that the update is made
    });

    test('Should successfully fetch and update user - with id', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          matches({
            email: { iv: fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fetchUserResponse);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId);
      expect(result).toBeDefined(); // we only care that the update is made
    });

    test('Should successfully fetch and update user - with user', async () => {
      nock(config.baseUrl)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          matches({
            email: { iv: fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fetchUserResponse);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(
        userId,
        fetchUserResponse,
      );
      expect(result).toBeDefined(); // we only care that the update is made
    });
  });
});
