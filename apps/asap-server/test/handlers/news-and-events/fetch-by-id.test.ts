import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ResearchOutputResponse, NewsOrEventResponse } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';

import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/news-and-events/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import decodeToken from '../../../src/utils/validate-token';

jest.mock('../../../src/utils/validate-token');

const id = 'uuid';

describe('GET /news-and-events/{id} - validations', () => {
  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Basic token`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when Auth0 fails to verify token', async () => {
    const mockDecodeToken = decodeToken as jest.MockedFunction<
      typeof decodeToken
    >;
    mockDecodeToken.mockRejectedValueOnce(new Error());

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });
});

describe('GET /news-and-events/{id}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 and the news or event', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/news-and-events/${id}`)
      .reply(200, {
        id: 'uuid',
        created: '2020-09-23T16:34:26.842Z',
        data: {
          type: { iv: 'News' },
          title: { iv: 'Title' },
          text: { iv: 'Text' },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    const res = JSON.parse(result.body) as ResearchOutputResponse;
    expect(result.statusCode).toStrictEqual(200);
    expect(res).toStrictEqual({
      created: '2020-09-23T16:34:26.842Z',
      id: 'uuid',
      text: 'Text',
      title: 'Title',
      type: 'News',
    });
  });

  test('returns 200 and the research output without team', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/news-and-events/${id}`)
      .reply(200, {
        id: 'uuid',
        created: '2020-09-23T16:34:26.842Z',
        data: {
          type: { iv: 'News' },
          title: { iv: 'Title' },
          text: { iv: 'Text' },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    const res = JSON.parse(result.body) as NewsOrEventResponse;
    expect(result.statusCode).toStrictEqual(200);
    expect(res).toStrictEqual({
      created: '2020-09-23T16:34:26.842Z',
      id: 'uuid',
      text: 'Text',
      title: 'Title',
      type: 'News',
    });
  });
});
