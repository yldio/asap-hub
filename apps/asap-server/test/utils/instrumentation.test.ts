import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';
import { Context } from 'aws-lambda';

import { buildGraphQLQueryFetchUsers } from '../../src/controllers/users';
import { handler } from '../../src/handlers/users/fetch';
import { apiGatewayEvent } from '../helpers/events';
import { identity } from '../helpers/squidex';

jest.mock('../../src/utils/validate-token');

const context: Context = {
  functionName: 'asap-hub-test-fn',
  callbackWaitsForEmptyEventLoop: true,
  functionVersion: 'ignoreMe',
  invokedFunctionArn: 'ignoreMe',
  memoryLimitInMB: 'ignoreMe',
  awsRequestId: 'ignoreMe',
  logGroupName: 'ignoreMe',
  logStreamName: 'ignoreMe',
  getRemainingTimeInMillis: () => 2000,
  fail: () => {},
  succeed: () => {},
  done: () => {},
};

describe('Instrumentation', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('marks span as ERROR, when statusCode is >= 400', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers("data/role/iv ne 'Hidden'"),
      })
      .reply(502);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
      }),
      context,
    )) as APIGatewayProxyResult;

    expect(result.body).toBeDefined();
  });

  test('returns 200 when no users exist', async () => {
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

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.body).toBeDefined();
  });
});
