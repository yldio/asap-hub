import { NotFoundError } from '@asap-hub/errors';
import { config, RestUser } from '@asap-hub/squidex';
import matches from 'lodash.matches';
import nock, { DataMatcherMap } from 'nock';
import Users, { FetchUsersOptions } from '../../src/controllers/users';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import {
  fetchUserResponse,
  getListUserResponse,
  getSquidexUserGraphqlResponse,
  getSquidexUsersGraphqlResponse,
  getUserDataObject,
  getUserResponse,
  patchResponse,
} from '../fixtures/users.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

const mockUserDataProvider = {
  fetchById: jest.fn(),
};
jest.mock('../../src/data-providers/users', () => {
  return jest.fn().mockImplementation(() => {
    return mockUserDataProvider;
  });
});

describe('Users controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const usersMockGraphqlClient = new Users(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const usersMockGraphqlServer = new Users(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetch({});

      expect(result).toMatchObject(getListUserResponse());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = [];
      mockResponse.queryUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should query with filters and return the users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
        filter: {
          role: ['role', 'Staff'],
          labId: ['lab-123', 'lab-456'],
          teamId: ['team-123', 'team-456'],
        },
      };
      await usersMockGraphqlClient.fetch(fetchOptions);

      const filterQuery =
        "(data/teams/iv/id eq 'team-123' or data/teams/iv/id eq 'team-456')" +
        ' and' +
        " (data/teams/iv/role eq 'role' or data/teams/iv/role eq 'Staff')" +
        ' and' +
        " (data/labs/iv eq 'lab-123' or data/labs/iv eq 'lab-456')" +
        ' and' +
        ' data/onboarded/iv eq true' +
        ' and' +
        " data/role/iv ne 'Hidden'" +
        ' and' +
        " ((contains(data/firstName/iv, 'first')" +
        " or contains(data/lastName/iv, 'first')" +
        " or contains(data/institution/iv, 'first')" +
        " or contains(data/expertiseAndResourceTags/iv, 'first'))" +
        ' and' +
        " (contains(data/firstName/iv, 'last')" +
        " or contains(data/lastName/iv, 'last')" +
        " or contains(data/institution/iv, 'last')" +
        " or contains(data/expertiseAndResourceTags/iv, 'last')))";
      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: filterQuery,
        },
      );
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };
      await usersMockGraphqlClient.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%27%27')" +
        " or contains(data/lastName/iv, '%27%27')" +
        " or contains(data/institution/iv, '%27%27')" +
        " or contains(data/expertiseAndResourceTags/iv, '%27%27')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };
      await usersMockGraphqlClient.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%22')" +
        " or contains(data/lastName/iv, '%22')" +
        " or contains(data/institution/iv, '%22')" +
        " or contains(data/expertiseAndResourceTags/iv, '%22')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
    });

    test('Should search with special characters', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: 'Solène',
      };
      await usersMockGraphqlClient.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, 'Solène')" +
        " or contains(data/lastName/iv, 'Solène')" +
        " or contains(data/institution/iv, 'Solène')" +
        " or contains(data/expertiseAndResourceTags/iv, 'Solène')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
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
    const code = 'some-uuid-code';

    test('Should fetch the user by code from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetchByCode(code);

      expect(result).toMatchObject(getUserResponse());
    });

    test('Should throw 403 when no user is found', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = [];
      mockResponse.queryUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should throw 403 when the query returns null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal = null;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should throw when it finds more than one user', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.total = 2;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should return user when it finds it', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetchByCode(code);
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const userId = 'user-id';

    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(404);

      await expect(
        usersMockGraphqlClient.update(userId, { jobTitle: 'CEO' }),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update job title through a clean-update', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(200, fetchUserResponse);

      expect(
        await usersMockGraphqlClient.update(userId, { jobTitle: 'CEO' }),
      ).toEqual(getUserResponse());
    });

    test('Should update the country and city through a clean-update', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          country: { iv: 'United Kingdom' },
          city: { iv: 'Brighton' },
        })
        .reply(200, fetchUserResponse);
      expect(
        await usersMockGraphqlClient.update(userId, {
          country: 'United Kingdom',
          city: 'Brighton',
        }),
      ).toEqual(getUserResponse());
    });

    test('Should delete user fields', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.contactEmail = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fetchUserResponse.data,
          contactEmail: { iv: null },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse); // this response is ignored

      const result = await usersMockGraphqlClient.update(userId, {
        contactEmail: '',
      });
      expect(result.contactEmail).not.toBeDefined();
    });

    test('Should update social and questions', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.questions = [
        { question: 'To be or not to be?' },
      ];
      mockResponse.findUsersContent!.flatData.social = [
        {
          github: 'johnytiago',
          googleScholar: null,
          linkedIn: null,
          researcherId: null,
          researchGate: null,
          twitter: null,
          website1: null,
          website2: null,
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          questions: { iv: [{ question: 'To be or not to be?' }] },
          social: { iv: [{ github: 'johnytiago' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse);

      const result = await usersMockGraphqlClient.update(userId, {
        questions: ['To be or not to be?'],
        social: {
          github: 'johnytiago',
        },
      });
      expect(result.questions).toEqual(['To be or not to be?']);
      expect(result.social).toEqual({
        github: 'johnytiago',
        orcid: '123-456-789',
      });
    });

    test('Should update Research Interests and Responsibility', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.researchInterests =
        'new research interests';
      mockResponse.findUsersContent!.flatData.responsibilities =
        'new responsibilities';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const expectedPatchRequest: Partial<RestUser['data']> = {
        researchInterests: {
          iv: 'new research interests',
        },
        responsibilities: {
          iv: 'new responsibilities',
        },
      };

      nock(config.baseUrl)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          expectedPatchRequest as DataMatcherMap,
        )
        .reply(200, fetchUserResponse);

      const result = await usersMockGraphqlClient.update(userId, {
        researchInterests: 'new research interests',
        responsibilities: 'new responsibilities',
      });
      expect(result.researchInterests).toEqual('new research interests');
      expect(result.responsibilities).toEqual('new responsibilities');
    });
  });

  describe('updateAvatar', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(500);

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });

    test('should throw when fails to update user - squidex error', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' })
        .patch(`/api/content/${config.appName}/users/user-id`, {
          avatar: { iv: ['squidex-asset-id'] },
        })
        .reply(500);

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });

    test('should return 200 when syncs asset and updates users profile', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' })
        .patch(`/api/content/${config.appName}/users/user-id`, {
          avatar: { iv: ['squidex-asset-id'] },
        })
        .reply(200, patchResponse);

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
