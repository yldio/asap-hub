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

describe('Groups - Fetch by team ID', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('empty response', async () => {
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
    expect(result).toStrictEqual({ items: [], total: 0 });
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
      .reply(200, fixtures.response);

    const result = await groups.fetchByTeamId(teamUUID, fetchOptions);
    expect(JSON.parse(JSON.stringify(result))).toStrictEqual(
      fixtures.expectation,
    );
  });
});
