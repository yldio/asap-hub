import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import { config } from '@asap-hub/services-common';

import { identity } from '../../helpers/squidex';
import { CMSResearchOutput } from '../../../src/entities/research-outputs';
import { handler } from '../../../src/handlers/research-outputs/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { ResearchOutputResponse } from '@asap-hub/model';

const chance = new Chance();
describe('GET /research-outputs', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
      }),
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
      }),
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
      }),
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
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 with a list of empty research outputs', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(
        `/api/content/${
          config.cms.appName
        }/research-outputs?q=${JSON.stringify({ take: 8 })}`,
      )
      .reply(200, { total: 0, items: [] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const res = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(res).toStrictEqual([]);
  });

  test('returns 200 with a list of research outputs', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(
        `/api/content/${
          config.cms.appName
        }/research-outputs?q=${JSON.stringify({ take: 8 })}`,
      )
      .reply(200, {
        total: 1,
        items: [
          {
            id: 'uuid',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
            },
          },
        ],
      } as { total: number; items: CMSResearchOutput[] });

    identity()
      .get(`/api/content/${config.cms.appName}/teams`)
      .query(() => true)
      .reply(200, {
        total: 1,
        items: [
          {
            id: 'uuid',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
            },
          },
        ],
      } as { total: number; items: CMSResearchOutput[] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const res = JSON.parse(result.body) as ResearchOutputResponse;
    expect(result.statusCode).toStrictEqual(200);
    expect(res).toStrictEqual([
      {
        created: '2020-09-23T16:34:26.842Z',
        doi: '',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'proposal',
        url: '',
      },
    ]);
  });
});
