import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import { config } from '@asap-hub/services-common';

import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/research-outputs/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { ResearchOutputResponse } from '@asap-hub/model';

const chance = new Chance();
describe('GET /research-outputs/{id}', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });
  const id = 'uuid';

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
          Authorization: `Basic ${chance.string()}`,
        },
        pathParameters: {
          id,
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
        pathParameters: {
          id,
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
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 200 and the research output content a list of research outputs', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(`/api/content/${config.cms.appName}/research-outputs/${id}`)
      .reply(200, {
        id: 'uuid',
        created: '2020-09-23T16:34:26.842Z',
        data: {
          type: { iv: 'proposal' },
          title: { iv: 'Title' },
          text: { iv: 'Text' },
        },
      });
    identity()
      .get(
        `/api/content/${config.cms.appName}/teams?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.proposal.iv',
            op: 'eq',
            value: 'uuid',
          },
        })}`,
      )
      .reply(200, {
        items: [
          {
            id: 'uuid-team',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              displayName: { iv: 'team' },
            },
          },
        ],
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
      doi: '',
      id: 'uuid',
      text: 'Text',
      title: 'Title',
      type: 'proposal',
      url: '',
      team: {
        id: 'uuid-team',
        displayName: 'team',
      },
    });
  });

  test('returns 200 and the research output without team', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    identity()
      .get(`/api/content/${config.cms.appName}/research-outputs/${id}`)
      .reply(200, {
        id: 'uuid',
        created: '2020-09-23T16:34:26.842Z',
        data: {
          type: { iv: 'proposal' },
          title: { iv: 'Title' },
          text: { iv: 'Text' },
        },
      });
    identity()
      .get(
        `/api/content/${config.cms.appName}/teams?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.proposal.iv',
            op: 'eq',
            value: 'uuid',
          },
        })}`,
      )
      .reply(200, {
        items: [],
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
      doi: '',
      id: 'uuid',
      text: 'Text',
      title: 'Title',
      type: 'proposal',
      url: '',
    });
  });
});
