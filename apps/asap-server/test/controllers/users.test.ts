import nock from 'nock';
import { config } from '@asap-hub/squidex';
import matches from 'lodash.matches';

import {
  default as Users,
  buildGraphQLQueryFetchUsers,
  buildGraphQLQueryFetchUser,
} from '../../src/controllers/users';
import { identity } from '../helpers/squidex';
import * as fixtures from '../fixtures/users.fixtures';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import { FetchOptions } from '../../src/utils/types';

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
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers("data/role/iv ne 'Hidden'"),
        })
        .reply(200, {
          data: {
            queryUsersContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await users.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
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
        " (data/role/iv ne 'Hidden' and" +
        " (contains(data/firstName/iv, 'first')" +
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
          query: buildGraphQLQueryFetchUsers(filterQuery, 12, 2),
        })
        .reply(200, fixtures.graphQlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);
      expect(result).toEqual(fixtures.fetchExpectation);
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };

      const expectedFilter =
        "data/role/iv ne 'Hidden' and" +
        " (contains(data/firstName/iv, '%27%27')" +
        " or contains(data/lastName/iv, '%27%27')" +
        " or contains(data/institution/iv, '%27%27')" +
        " or contains(data/skills/iv, '%27%27'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(expectedFilter, 12, 2),
        })
        .reply(200, fixtures.graphQlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);

      expect(result).toEqual(fixtures.fetchExpectation);
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };

      const expectedFilter =
        "data/role/iv ne 'Hidden' and" +
        " (contains(data/firstName/iv, '%22')" +
        " or contains(data/lastName/iv, '%22')" +
        " or contains(data/institution/iv, '%22')" +
        " or contains(data/skills/iv, '%22'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(expectedFilter, 12, 2),
        })
        .reply(200, fixtures.graphQlResponseFetchUsers);

      const result = await users.fetch(fetchOptions);

      expect(result).toEqual(fixtures.fetchExpectation);
    });
  });

  describe('fetchById', () => {
    test('Should throw when user is not found', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('not-found'),
        })
        .reply(200, {
          data: {
            findUsersContent: null,
          },
        });

      await expect(users.fetchById('not-found')).rejects.toThrow('Not Found');
    });

    test('Should return user when it finds it', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('user-id'),
        })
        .reply(200, fixtures.graphQlResponseFetchUser);

      const result = await users.fetchById('user-id');
      expect(result).toEqual(fixtures.fetchUserExpectation);
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';
    const filter = `data/connections/iv/code eq '${code}'`;

    test('Should throw when no user', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(filter, 1, 0),
        })
        .reply(200, {
          data: {
            queryUsersContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      await expect(users.fetchByCode(code)).rejects.toThrow('Forbidden');
    });

    test('Should throw when it finds more than one user', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(filter, 1, 0),
        })
        .reply(200, fixtures.graphQlResponseFetchUsers);

      await expect(users.fetchByCode(code)).rejects.toThrow('Forbidden');
    });

    test('Should return user when it finds it', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(filter, 1, 0),
        })
        .reply(200, {
          data: {
            queryUsersContentsWithTotal: {
              total: 1,
              items: [fixtures.graphQlResponseFetchUser.data.findUsersContent],
            },
          },
        });

      const result = await users.fetchByCode(code);
      expect(result).toEqual(fixtures.fetchUserExpectation);
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

    test('Should delete user fields', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fixtures.fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fixtures.fetchUserResponse.data,
          contactEmail: { iv: null },
        } as { [k: string]: any })
        .reply(200, fixtures.fetchUserResponse) // this response is ignored
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser(userId),
        })
        .reply(
          200,
          fixtures.buildUserGraphqlResponse({
            contactEmail: null,
          }),
        );

      const result = await users.update(userId, {
        contactEmail: '',
      });
      expect(result.contactEmail).not.toBeDefined();
    });

    test('Should update social and questions', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          questions: { iv: [{ question: 'To be or not to be?' }] },
          social: { iv: [{ github: 'johnytiago' }] },
        } as { [k: string]: any })
        .reply(200, fixtures.fetchUserResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser(userId),
        })
        .reply(
          200,
          fixtures.buildUserGraphqlResponse({
            questions: [{ question: 'To be or not to be?' }],
            social: [
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
            ],
          }),
        );

      const result = await users.update(userId, {
        questions: ['To be or not to be?'],
        social: {
          github: 'johnytiago',
        },
      });
      expect(result.questions).toEqual(['To be or not to be?']);
      expect(result.social).toEqual({
        github: 'johnytiago',
        orcid: '363-98-9330',
      });
    });

    test('Should update and delete user team properties', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fixtures.fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fixtures.fetchUserResponse.data,
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
        .reply(200, fixtures.fetchUserResponse) // this response is ignored
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser(userId),
        })
        .reply(
          200,
          fixtures.buildUserGraphqlResponse({
            teams: [
              {
                role: 'Lead PI (Core Leadership)',
                approach: null,
                responsibilities: null,
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: [{ id: 'proposal-id-1' }],
                      skills: [],
                      outputs: [],
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
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Another Awesome project',
                      displayName: 'Tarantino, M',
                      proposal: [{ id: 'proposal-id-2' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
            ],
          }),
        );

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
        .reply(200, fixtures.patchResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('user-id'),
        })
        .reply(200, fixtures.graphQlResponseFetchUser);

      const result = await users.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual(fixtures.fetchUserExpectation);
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
      const connectedUser = JSON.parse(JSON.stringify(fixtures.patchResponse));
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

    test('Should connect user', async () => {
      const userId = 'google-oauth2|token';
      const patchedUser = JSON.parse(JSON.stringify(fixtures.patchResponse));
      patchedUser.data.connections.iv = [{ code: userId }];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [fixtures.patchResponse] })
        .patch(
          `/api/content/${config.appName}/users/${fixtures.patchResponse.id}`,
          {
            email: { iv: fixtures.patchResponse.data.email.iv },
            connections: { iv: [{ code: userId }] },
          },
        )
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
        .reply(200, fixtures.fetchUserResponse)
        .patch(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fixtures.fetchUserResponse);

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
        .reply(200, fixtures.fetchUserResponse)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          matches({
            email: { iv: fixtures.fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fixtures.fetchUserResponse);

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
            email: { iv: fixtures.fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fixtures.fetchUserResponse);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await users.syncOrcidProfile(
        userId,
        fixtures.fetchUserResponse,
      );
      expect(result).toBeDefined(); // we only care that the update is made
    });
  });
});
