import nock from 'nock';
import { config } from '@asap-hub/squidex';

import {
  default as Groups,
  FetchOptions,
  buildGraphQLQueryFetchGroups,
} from '../../../src/controllers/groups';
import { identity } from '../../helpers/squidex';
import * as fixtures from '../../handlers/groups/fetch.fixtures';

const groups = new Groups();

describe('Groups - Fetch', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('empty response', async () => {
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
    expect(result).toStrictEqual({ items: [], total: 0 });
  });

  test('returns groups - with filters', async () => {
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
      .reply(200, fixtures.response);

    const result = await groups.fetch(fetchOptions);
    expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
      fixtures.expectation,
    );
  });
});
