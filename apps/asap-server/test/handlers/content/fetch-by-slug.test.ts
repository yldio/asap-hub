import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { handler } from '../../../src/handlers/content/fetch-by-slug';
import { apiGatewayEvent } from '../../helpers/events';

jest.mock('@asap-hub/auth');

const chance = new Chance();

describe('GET /content/{content}/{slug}', () => {
  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Basic ${chance.string()}`,
        },
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 403 when Auth0 fails to verify token', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 403 when Auth0 is unavailable', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(500);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
  test('returns 404 when no content is found', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    const result = await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          content: 'news',
          slug: 'not-found-slug',
        },
      }),
      null,
      null,
    );

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when content is found', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    const result = await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    );

    expect(result.statusCode).toStrictEqual(200);
  });
});
