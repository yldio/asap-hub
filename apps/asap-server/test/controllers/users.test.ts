import { config } from '@asap-hub/squidex';
import { print } from 'graphql';
import matches from 'lodash.matches';
import nock from 'nock';
import Users from '../../src/controllers/users';
import { identity } from '../helpers/squidex';
import { FETCH_USER, FETCH_USERS } from '../../src/queries/users.queries';
import { FetchOptions } from '../../src/utils/types';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import {
  fetchExpectation,
  fetchUserResponse,
  getGraphqlResponseFetchUser,
  getGraphqlResponseFetchUsers,
  getUserResponse,
  patchResponse,
} from '../fixtures/users.fixtures';

const users = new Users();

describe('Users controller', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('fetch', () => {
    test('Should return an empty result', async () => {
      const mockResponse = getGraphqlResponseFetchUsers();
      mockResponse.data.queryUsersContentsWithTotal!.items = [];
      mockResponse.data.queryUsersContentsWithTotal!.total = 0;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter: "data/onboarded/iv eq true and data/role/iv ne 'Hidden'",
            top: 8,
            skip: 0,
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getGraphqlResponseFetchUsers();
      mockResponse.data.queryUsersContentsWithTotal = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            top: 8,
            skip: 0,
            filter: "data/onboarded/iv eq true and data/role/iv ne 'Hidden'",
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getGraphqlResponseFetchUsers();
      mockResponse.data.queryUsersContentsWithTotal!.items = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            top: 8,
            skip: 0,
            filter: "data/onboarded/iv eq true and data/role/iv ne 'Hidden'",
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should query with filters and return the users', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
        filter: ['role', 'Staff'],
      };

      const filterQuery =
        "(data/teams/iv/role eq 'role' or data/role/iv eq 'Staff')" +
        ' and' +
        ' data/onboarded/iv eq true' +
        ' and' +
        " data/role/iv ne 'Hidden'" +
        ' and' +
        " ((contains(data/firstName/iv, 'first')" +
        " or contains(data/lastName/iv, 'first')" +
        " or contains(data/institution/iv, 'first')" +
        " or contains(data/skills/iv, 'first'))" +
        ' and' +
        " (contains(data/firstName/iv, 'last')" +
        " or contains(data/lastName/iv, 'last')" +
        " or contains(data/institution/iv, 'last')" +
        " or contains(data/skills/iv, 'last')))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter: filterQuery,
            top: 12,
            skip: 2,
          },
        })
        .reply(200, getGraphqlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);
      expect(result).toEqual(fetchExpectation);
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%27%27')" +
        " or contains(data/lastName/iv, '%27%27')" +
        " or contains(data/institution/iv, '%27%27')" +
        " or contains(data/skills/iv, '%27%27')))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter: expectedFilter,
            top: 12,
            skip: 2,
          },
        })
        .reply(200, getGraphqlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);

      expect(result).toEqual(fetchExpectation);
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%22')" +
        " or contains(data/lastName/iv, '%22')" +
        " or contains(data/institution/iv, '%22')" +
        " or contains(data/skills/iv, '%22')))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter: expectedFilter,
            top: 12,
            skip: 2,
          },
        })
        .reply(200, getGraphqlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);

      expect(result).toEqual(fetchExpectation);
    });

    test('Should search with special characters', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'Solène',
      };

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, 'Solène')" +
        " or contains(data/lastName/iv, 'Solène')" +
        " or contains(data/institution/iv, 'Solène')" +
        " or contains(data/skills/iv, 'Solène')))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter: expectedFilter,
            top: 12,
            skip: 2,
          },
        })
        .reply(200, getGraphqlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);

      expect(result).toEqual(fetchExpectation);
    });
  });

  describe('fetchById', () => {
    test('Should throw when user is not found', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'not-found',
          },
        })
        .reply(200, mockResponse);

      await expect(users.fetchById('not-found')).rejects.toThrow('Not Found');
    });

    test('Should return the user when they are found, even if they are not onboarded', async () => {
      const nonOnboardedUserResponse = getGraphqlResponseFetchUser();
      nonOnboardedUserResponse.data.findUsersContent!.flatData.onboarded =
        false;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, nonOnboardedUserResponse);

      const result = await users.fetchById('user-id');

      expect(result.id).toEqual(
        nonOnboardedUserResponse.data.findUsersContent!.id,
      );
    });

    test('Should return the user when it finds it', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, getGraphqlResponseFetchUser());

      const result = await users.fetchById('user-id');
      expect(result).toEqual(getUserResponse());
    });

    test('Should filter out team the team role is invalid', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.teams![0]!.role =
        'invalid role';
      const expectedResponse = getUserResponse();
      expectedResponse.teams = [];
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetchById('user-id');
      expect(result).toEqual(expectedResponse);
    });

    test('Should skip the user lab if it does not have a name', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.labs = [
        {
          id: 'lab1',
          flatData: {
            name: 'lab 1',
          },
        },
        {
          id: 'lab2',
          flatData: {
            name: null,
          },
        },
        {
          id: 'lab3',
          flatData: {
            name: 'lab 3',
          },
        },
      ];
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetchById('user-id');

      expect(result.labs).toEqual([
        {
          id: 'lab1',
          name: 'lab 1',
        },
        {
          id: 'lab3',
          name: 'lab 3',
        },
      ]);
    });

    test('Should skip the user orcid work if it does not have an ID or a lastModifiedDate', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          publicationDate: 'publicationDate1',
          title: 'title1',
          type: 'ANNOTATION',
        },
        {
          id: null,
          doi: 'doi2',
          lastModifiedDate: 'lastModifiedDate2',
          publicationDate: 'publicationDate2',
          title: 'title2',
          type: 'ANNOTATION',
        },
        {
          id: 'id3',
          doi: 'doi3',
          lastModifiedDate: 'lastModifiedDate3',
          publicationDate: 'publicationDate3',
          title: 'title3',
          type: 'ANNOTATION',
        },
        {
          id: 'id4',
          doi: 'doi4',
          lastModifiedDate: null,
          publicationDate: 'publicationDate4',
          title: 'title4',
          type: 'ANNOTATION',
        },
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetchById('user-id');

      expect(result.orcidWorks).toMatchObject([
        {
          id: 'id1',
        },
        {
          id: 'id3',
        },
      ]);
    });

    test('Should default the user orcid work type to UNDEFINED if it is not present or invalid', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          publicationDate: 'publicationDate1',
          title: 'title1',
          type: null,
        },
        {
          id: 'id2',
          doi: 'doi2',
          lastModifiedDate: 'lastModifiedDate2',
          publicationDate: 'publicationDate2',
          title: 'title2',
          type: 'invalid',
        },
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, mockResponse);

      const result = await users.fetchById('user-id');

      expect(result.orcidWorks).toMatchObject([
        {
          id: 'id1',
          type: 'UNDEFINED',
        },
        {
          id: 'id2',
          type: 'UNDEFINED',
        },
      ]);
    });

    test('Should default onboarded flag to true when its null', async () => {
      const userWithNoOnboardedFlagResponse = getGraphqlResponseFetchUser();
      userWithNoOnboardedFlagResponse.data.findUsersContent!.flatData!.onboarded =
        null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, userWithNoOnboardedFlagResponse);

      const result = await users.fetchById('user-id');

      expect(result.onboarded).toEqual(true);
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';
    const filter = `data/connections/iv/code eq '${code}'`;

    test('Should throw 403 when no user is found', async () => {
      const mockResponse = getGraphqlResponseFetchUsers();
      mockResponse.data.queryUsersContentsWithTotal!.items = [];
      mockResponse.data.queryUsersContentsWithTotal!.total = 0;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter,
            top: 1,
            skip: 0,
          },
        })
        .reply(200, mockResponse);

      await expect(users.fetchByCode(code)).rejects.toThrow('Forbidden');
    });

    test('Should throw 403 when the query returns null', async () => {
      const mockResponse = getGraphqlResponseFetchUsers();
      mockResponse.data.queryUsersContentsWithTotal = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter,
            top: 1,
            skip: 0,
          },
        })
        .reply(200, mockResponse);

      await expect(users.fetchByCode(code)).rejects.toThrow('Forbidden');
    });

    test('Should throw when it finds more than one user', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter,
            top: 1,
            skip: 0,
          },
        })
        .reply(200, getGraphqlResponseFetchUsers);

      await expect(users.fetchByCode(code)).rejects.toThrow('Forbidden');
    });

    test('Should return user when it finds it', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USERS),
          variables: {
            filter,
            top: 1,
            skip: 0,
          },
        })
        .reply(200, {
          data: {
            queryUsersContentsWithTotal: {
              total: 1,
              items: [getGraphqlResponseFetchUser().data.findUsersContent],
            },
          },
        });

      const result = await users.fetchByCode(code);
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('update', () => {
    const userId = 'user-id';

    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(404);

      await expect(users.update(userId, { jobTitle: 'CEO' })).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should update job title through a clean-update', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(200, fetchUserResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: userId,
          },
        })
        .reply(200, getGraphqlResponseFetchUser());

      expect(await users.update(userId, { jobTitle: 'CEO' })).toEqual(
        getUserResponse(),
      );
    });

    test('Should update the country and city through a clean-update', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          country: { iv: 'United Kingdom' },
          city: { iv: 'Brighton' },
        })
        .reply(200, fetchUserResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: userId,
          },
        })
        .reply(200, getGraphqlResponseFetchUser());

      expect(
        await users.update(userId, {
          country: 'United Kingdom',
          city: 'Brighton',
        }),
      ).toEqual(getUserResponse());
    });

    test('Should delete user fields', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.contactEmail = null;

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fetchUserResponse.data,
          contactEmail: { iv: null },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse) // this response is ignored
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: userId,
          },
        })
        .reply(200, mockResponse);

      const result = await users.update(userId, {
        contactEmail: '',
      });
      expect(result.contactEmail).not.toBeDefined();
    });

    test('Should update social and questions', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.questions = [
        { question: 'To be or not to be?' },
      ];
      mockResponse.data.findUsersContent!.flatData.social = [
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

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          questions: { iv: [{ question: 'To be or not to be?' }] },
          social: { iv: [{ github: 'johnytiago' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: userId,
          },
        })
        .reply(200, mockResponse);

      const result = await users.update(userId, {
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

    test('Should update and delete user team properties', async () => {
      const mockResponse = getGraphqlResponseFetchUser();
      mockResponse.data.findUsersContent!.flatData.teams = [
        {
          role: 'Lead PI (Core Leadership)',
          approach: null,
          responsibilities: null,
          id: [
            {
              id: 'team-id-1',
              flatData: {
                displayName: 'Jackson, M',
                proposal: [{ id: 'proposal-id-1' }],
              },
            },
          ],
        },
        {
          role: 'Collaborating PI',
          responsibilities: 'I do stuff',
          approach: 'orthodox',
          id: [
            {
              id: 'team-id-3',
              flatData: {
                displayName: 'Tarantino, M',
                proposal: [{ id: 'proposal-id-2' }],
              },
            },
          ],
        },
      ];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fetchUserResponse.data,
          teams: {
            iv: [
              {
                role: 'Lead PI (Core Leadership)',
                id: ['team-id-1'],
                approach: null,
                responsibilities: null,
              },
              {
                role: 'Collaborating PI',
                id: ['team-id-3'],
                responsibilities: 'I do stuff',
                approach: 'orthodox',
              },
            ],
          },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse) // this response is ignored
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: userId,
          },
        })
        .reply(200, mockResponse);

      const result = await users.update(userId, {
        teams: [
          {
            id: 'team-id-1',
            responsibilities: '',
            approach: '',
          },
          {
            id: 'team-id-3',
            responsibilities: 'I do stuff',
            approach: 'orthodox',
          },
        ],
      });

      expect(result.teams).toEqual([
        {
          id: 'team-id-1',
          displayName: 'Jackson, M',
          proposal: 'proposal-id-1',
          role: 'Lead PI (Core Leadership)',
        },
        {
          displayName: 'Tarantino, M',
          id: 'team-id-3',
          proposal: 'proposal-id-2',
          role: 'Collaborating PI',
          responsibilities: 'I do stuff',
          approach: 'orthodox',
        },
      ]);
    });
  });

  describe('updateAvatar', () => {
    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(500);

      await expect(
        users.updateAvatar('user-id', Buffer.from('avatar'), 'image/jpeg'),
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
        users.updateAvatar('user-id', Buffer.from('avatar'), 'image/jpeg'),
      ).rejects.toThrow();
    });

    test('should return 200 when syncs asset and updates users profile', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' })
        .patch(`/api/content/${config.appName}/users/user-id`, {
          avatar: { iv: ['squidex-asset-id'] },
        })
        .reply(200, patchResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_USER),
          variables: {
            id: 'user-id',
          },
        })
        .reply(200, getGraphqlResponseFetchUser());

      const result = await users.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('connectByCode', () => {
    test('Should throw forbidden when doesn find connection code', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'invalid-code'`,
        })
        .reply(404);

      await expect(
        users.connectByCode('invalid-code', 'user-id'),
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

      const result = await users.connectByCode('asapWelcomeCode', userId);
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

      const result = await users.connectByCode('asapWelcomeCode', userId);
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
      const result = await users.connectByCode('asapWelcomeCode', userId);
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

      const result = await users.connectByCode('asapWelcomeCode', userId);
      expect(result).toBeDefined();
    });
  });

  describe('syncOrcidProfile', () => {
    const userId = 'userId';
    const orcid = '363-98-9330';

    test('Throws when user does not exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/user-not-found`)
        .reply(404);

      await expect(users.syncOrcidProfile('user-not-found')).rejects.toThrow(
        'Not Found',
      );
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

      const result = await users.syncOrcidProfile(userId);
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

      const result = await users.syncOrcidProfile(userId);
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

      const result = await users.syncOrcidProfile(userId, fetchUserResponse);
      expect(result).toBeDefined(); // we only care that the update is made
    });
  });
});
