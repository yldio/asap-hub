import nock from 'nock';
import { config } from '@asap-hub/squidex';

import {
  default as Groups,
  buildGraphQLQueryFetchGroup,
  buildGraphQLQueryFetchGroups,
} from '../../src/controllers/groups';
import { identity } from '../helpers/squidex';
import * as fixtures from '../fixtures/groups.fixtures';
import { FetchOptions } from '../../src/utils/types';

const groups = new Groups();

describe('Group controller', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(''),
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await groups.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should query with filters and return the groups', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };

      const filterQuery =
        "(contains(data/name/iv, 'first')" +
        " or contains(data/description/iv, 'first')" +
        " or contains(data/tags/iv, 'first'))" +
        ' and' +
        " (contains(data/name/iv, 'last')" +
        " or contains(data/description/iv, 'last')" +
        " or contains(data/tags/iv, 'last'))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(filterQuery, 12, 2),
        })
        .reply(200, fixtures.queryGroupsResponse);

      const result = await groups.fetch(fetchOptions);
      expect(result).toEqual(fixtures.queryGroupsExpectation);
    });
  });

  describe('Fetch by id method', () => {
    test('Should return an empty result', async () => {
      const groupId = 'not-found';
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroup(groupId),
        })
        .reply(200, {
          data: {
            findGroupsContent: null,
          },
        });

      await expect(groups.fetchById(groupId)).rejects.toThrow('Not Found');
    });

    test('Should return the group', async () => {
      const groupId = 'group-id-1';
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroup(groupId),
        })
        .reply(200, fixtures.findGroupResponse);

      const result = await groups.fetchById(groupId);
      expect(result).toEqual(fixtures.findGroupExpectation);
    });
  });

  describe('Fetch-by-team-ID method', () => {
    test('Should return an empty result', async () => {
      const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const filter = `data/teams/iv eq '${teamUUID}'`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(filter),
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await groups.fetchByTeamId(teamUUID, {});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('returns groups - with filters', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };

      const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const filterQuery = `data/teams/iv eq '${teamUUID}'`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(filterQuery, 12, 2),
        })
        .reply(200, fixtures.queryGroupsResponse);

      const result = await groups.fetchByTeamId(teamUUID, fetchOptions);
      expect(result).toEqual(fixtures.queryGroupsExpectation);
    });
  });

  describe('Fetch-by-user-ID method', () => {
    test('Should apply the filters and return an empty response', async () => {
      const userUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';

      const userFilter = `data/leaders/iv/user eq '${userUUID}'`;
      const teamFilter = `data/teams/iv in ['team-id-1', 'team-id-3']`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(userFilter),
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        })
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(teamFilter),
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await groups.fetchByUserId(
        userUUID,
        ['team-id-1', 'team-id-3'],
        {},
      );
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return the deduped result', async () => {
      const userUUID = 'user-id-1';

      const userFilter = `data/leaders/iv/user eq '${userUUID}'`;
      const teamFilter = `data/teams/iv in ['team-id-1', 'team-id-3']`;

      // same response since the user is group leader and member a team
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(userFilter),
        })
        .reply(200, fixtures.queryGroupsResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchGroups(teamFilter),
        })
        .reply(200, fixtures.queryGroupsResponse);

      const result = await groups.fetchByUserId(
        userUUID,
        ['team-id-1', 'team-id-3'],
        {},
      );

      expect(result).toEqual(fixtures.queryGroupsExpectation);
    });
  });
});
