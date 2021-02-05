import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { buildGraphQLQueryFetchGroups } from '../../../src/controllers/groups';
import { handler } from '../../../src/handlers/groups/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from '../../fixtures/groups.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /groups', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no groups exist', async () => {
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

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      items: [],
      total: 0,
    });
  });

  test('returns 200 when searching groups by name', async () => {
    const filter =
      "(contains(data/name/iv, 'first')" +
      " or contains(data/description/iv, 'first')" +
      " or contains(data/tags/iv, 'first'))" +
      ' and' +
      " (contains(data/name/iv, 'last')" +
      " or contains(data/description/iv, 'last')" +
      " or contains(data/tags/iv, 'last'))";

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchGroups(filter),
      })
      .reply(200, fixtures.queryGroupsResponse);

    const result = (await handler(
      apiGatewayEvent({
        queryStringParameters: {
          search: 'first last',
        },
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(fixtures.queryGroupsExpectation);
  });
});
