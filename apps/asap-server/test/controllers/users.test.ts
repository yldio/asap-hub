import nock from 'nock';
import { config } from '@asap-hub/squidex';

import { default as Users, buildGraphQLQueryFetchUsers } from '../../src/controllers/users';
import { identity } from '../helpers/squidex';
import * as fixtures from '../fixtures/groups.fixtures';
import { FetchOptions } from '../../src/utils/types';

const users = new Users();

describe('Users controller', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
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
        "(data/teams/iv/role eq 'role'" +
        " or data/role/iv eq 'Staff')" +
        " and ((contains(data/name/iv, 'first')" +
        " or contains(data/description/iv, 'first')" +
        " or contains(data/tags/iv, 'first'))" +
        ' and' +
        " (contains(data/name/iv, 'last')" +
        " or contains(data/description/iv, 'last')" +
        " or contains(data/tags/iv, 'last')))";

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUsers(filterQuery, 12, 2),
        })
        .reply(200, fixtures.response);

      const result = await users.fetch(fetchOptions);
      expect(result).toEqual(fixtures.expectation);
    });
  });

});
