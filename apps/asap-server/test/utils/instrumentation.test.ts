import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';
import { Context } from 'aws-lambda';

import { buildGraphQLQueryFetchUsers } from '../../src/controllers/users';
import { auth0SharedSecret as secret } from '../../src/config';
import { handler } from '../../src/handlers/webhooks/webhook-fetch-by-code';
import { apiGatewayEvent } from '../helpers/events';
import { identity } from '../helpers/squidex';
import { fetchUserResponse } from '../handlers/webhooks/webhook-fetch-by-code.fixtures';

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
        query: buildGraphQLQueryFetchUsers(),
        variables: {
          filter: `data/connections/iv/code eq 'notFound'`,
          top: 1,
          skip: 0,
        },
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
        pathParameters: {
          code: 'notFound',
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
      context,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 when user exists', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUsers(),
        variables: {
          filter: `data/connections/iv/code eq 'welcomeCode'`,
          top: 1,
          skip: 0,
        },
      })
      .reply(200, fetchUserResponse);

    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          code: 'welcomeCode',
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
      context,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
