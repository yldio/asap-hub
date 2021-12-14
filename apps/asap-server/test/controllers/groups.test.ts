import nock from 'nock';
import { config, SquidexGraphql } from '@asap-hub/squidex';
import { print } from 'graphql';
import Groups from '../../src/controllers/groups';
import { identity } from '../helpers/squidex';
import * as fixtures from '../fixtures/groups.fixtures';
import { FetchOptions } from '../../src/utils/types';
import {
  getGroupResponse,
  getListGroupResponse,
  getResponseFetchGroup,
} from '../fixtures/groups.fixtures';
import { FETCH_GROUP, FETCH_GROUPS } from '../../src/queries/groups.queries';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';

describe('Group controller', () => {
  const squidexGraphqlClient = new SquidexGraphql();
  const groupController = new Groups(squidexGraphqlClient);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const groupControllerMockGraphql = new Groups(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the groups from squidex graphql', async () => {
        const result = await groupControllerMockGraphql.fetch({});

        expect(result).toMatchObject(getListGroupResponse());
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });

      afterEach(() => {
        nock.cleanAll();
      });

      test('Should return an empty result', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: '',
              top: 50,
              skip: 0,
            },
          })
          .reply(200, {
            data: {
              queryGroupsContentsWithTotal: {
                total: 0,
                items: [],
              },
            },
          });

        const result = await groupController.fetch({});
        expect(result).toEqual({ items: [], total: 0 });
      });
      test('Should return an empty result when the client returns a response with queryGroupsContentsWithTotal property set to null', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: '',
              top: 50,
              skip: 0,
            },
          })
          .reply(200, {
            data: {
              queryGroupsContentsWithTotal: {
                total: 0,
                items: null,
              },
            },
          });

        const result = await groupController.fetch({});
        expect(result).toEqual({ items: [], total: 0 });
      });
      test('Should return an empty result when the client returns a response with item property set to null', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: '',
              top: 50,
              skip: 0,
            },
          })
          .reply(200, {
            data: {
              queryGroupsContentsWithTotal: null,
            },
          });

        const result = await groupController.fetch({});
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should query with filters and return the groups', async () => {
        const fetchOptions: FetchOptions = {
          take: 12,
          skip: 2,
          search: 'first last',
        };

        const expetedFilter =
          "(contains(data/name/iv, 'first')" +
          " or contains(data/description/iv, 'first')" +
          " or contains(data/tags/iv, 'first'))" +
          ' and' +
          " (contains(data/name/iv, 'last')" +
          " or contains(data/description/iv, 'last')" +
          " or contains(data/tags/iv, 'last'))";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: expetedFilter,
              top: 12,
              skip: 2,
            },
          })
          .reply(200, fixtures.queryGroupsResponse);

        const result = await groupController.fetch(fetchOptions);
        expect(result).toEqual(fixtures.listGroupsResponse);
      });

      test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
        const fetchOptions: FetchOptions = {
          take: 12,
          skip: 2,
          search: "'",
        };

        const expectedFilter =
          "(contains(data/name/iv, '%27%27')" +
          " or contains(data/description/iv, '%27%27')" +
          " or contains(data/tags/iv, '%27%27'))";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: expectedFilter,
              top: 12,
              skip: 2,
            },
          })
          .reply(200, fixtures.queryGroupsResponse);

        const result = await groupController.fetch(fetchOptions);

        expect(result).toEqual(fixtures.listGroupsResponse);
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        const fetchOptions: FetchOptions = {
          take: 12,
          skip: 2,
          search: '"',
        };

        const expectedFilter =
          "(contains(data/name/iv, '%22')" +
          " or contains(data/description/iv, '%22')" +
          " or contains(data/tags/iv, '%22'))";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUPS),
            variables: {
              filter: expectedFilter,
              top: 12,
              skip: 2,
            },
          })
          .reply(200, fixtures.queryGroupsResponse);

        const result = await groupController.fetch(fetchOptions);

        expect(result).toEqual(fixtures.listGroupsResponse);
      });
    });
  });

  describe('Fetch by id method', () => {
    describe('with mock-server', () => {
      test('Should fetch the groups from squidex graphql', async () => {
        const result = await groupControllerMockGraphql.fetchById('group-id-1');

        expect(result).toMatchObject(getGroupResponse());
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });

      afterEach(() => {
        nock.cleanAll();
      });

      test("Should return 404 when the group doesn't exist", async () => {
        const groupId = 'not-found';
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUP),
            variables: {
              id: groupId,
            },
          })
          .reply(200, {
            data: {
              findGroupsContent: null,
            },
          });

        await expect(groupController.fetchById(groupId)).rejects.toThrow(
          'Not Found',
        );
      });

      test('Should return the group', async () => {
        const groupId = 'group-id-1';
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUP),
            variables: {
              id: groupId,
            },
          })
          .reply(200, getResponseFetchGroup());

        const result = await groupController.fetchById(groupId);
        expect(result).toEqual(getGroupResponse());
      });

      test('Should return the group when the leader user is undefined (ie entity marked as a draft) and skip the leader', async () => {
        const groupId = 'group-id-1';
        const responseFetchGroup = getResponseFetchGroup();
        responseFetchGroup.data.findGroupsContent!.flatData!.leaders![0]!.user =
          [];

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUP),
            variables: {
              id: groupId,
            },
          })
          .reply(200, responseFetchGroup);

        const result = await groupController.fetchById(groupId);

        const expectedGroupResponse = getGroupResponse();
        expect(result).toEqual(
          expect.objectContaining({
            leaders: [expectedGroupResponse.leaders[1]],
          }),
        );
      });
    });
  });

  describe('Fetch-by-team-ID method', () => {
    test('Should return an empty result', async () => {
      const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const expectedFilter = `data/teams/iv eq '${teamUUID}'`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_GROUPS),
          variables: {
            filter: expectedFilter,
            top: 50,
            skip: 0,
          },
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await groupController.fetchByTeamId(teamUUID, {});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('returns groups - with filters', async () => {
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };

      const teamUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const expectedFilter = `data/teams/iv eq '${teamUUID}'`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_GROUPS),
          variables: {
            filter: expectedFilter,
            top: 12,
            skip: 2,
          },
        })
        .reply(200, fixtures.queryGroupsResponse);

      const result = await groupController.fetchByTeamId(
        teamUUID,
        fetchOptions,
      );
      expect(result).toEqual(fixtures.listGroupsResponse);
    });
  });

  describe('Fetch-by-user-ID method', () => {
    test('Should apply the filters and return an empty response', async () => {
      const userUUID = 'eb531b6e-195c-46e2-b347-58fb86715033';

      const userFilter = `data/leaders/iv/user eq '${userUUID}'`;
      const teamFilter = `data/teams/iv in ['team-id-1', 'team-id-3']`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_GROUPS),
          variables: {
            filter: userFilter,
            top: 50,
            skip: 0,
          },
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
          query: print(FETCH_GROUPS),
          variables: {
            filter: teamFilter,
            top: 50,
            skip: 0,
          },
        })
        .reply(200, {
          data: {
            queryGroupsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await groupController.fetchByUserId(
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
          query: print(FETCH_GROUPS),
          variables: {
            filter: userFilter,
            top: 50,
            skip: 0,
          },
        })
        .reply(200, fixtures.queryGroupsResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_GROUPS),
          variables: {
            filter: teamFilter,
            top: 50,
            skip: 0,
          },
        })
        .reply(200, fixtures.queryGroupsResponse);

      const result = await groupController.fetchByUserId(
        userUUID,
        ['team-id-1', 'team-id-3'],
        {},
      );

      expect(result).toEqual(fixtures.listGroupsResponse);
    });
  });
});
