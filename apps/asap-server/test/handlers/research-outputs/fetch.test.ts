import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ResearchOutputResponse } from '@asap-hub/model';
import { config, RestResearchOutput, RestTeam } from '@asap-hub/squidex';

import { identity } from '../../helpers/squidex';
import { handler } from '../../../src/handlers/research-outputs/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import decodeToken from '../../../src/utils/validate-token';

jest.mock('../../../src/utils/validate-token');

describe('GET /research-outputs - failure', () => {
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
          Authorization: `Basic token`,
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
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });
});

describe('GET /research-outputs - success', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 with a list of empty research outputs', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/research-outputs`)
      .query({
        $top: 8,
        $skip: 0,
        $orderby: 'created desc',
        $filter: '',
      })
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
    expect(res).toStrictEqual({ total: 0, items: [] });
  });

  test('returns 200 with a list of research outputs', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/research-outputs`)
      .query({
        $top: 8,
        $skip: 0,
        $orderby: 'created desc',
        $filter: '',
      })
      .reply(200, {
        total: 1,
        items: [
          {
            id: 'uuid',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'Proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
              link: { iv: 'test' },
            },
          },
        ],
      } as { total: number; items: RestResearchOutput[] })
      .get(`/api/content/${config.appName}/teams`)
      .query(() => true)
      .reply(200, {
        total: 1,
        items: [
          {
            id: 'uuid',
            created: '2020-09-23T16:34:26.842Z',
            lastModified: '2020-09-23T16:34:26.842Z',
            data: {
              displayName: { iv: 'Unknown' },
              applicationNumber: { iv: 'APP' },
            },
          },
        ],
      } as { total: number; items: RestTeam[] });

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
    expect(res).toStrictEqual({
      total: 1,
      items: [
        {
          created: '2020-09-23T16:34:26.842Z',
          id: 'uuid',
          text: 'Text',
          title: 'Title',
          type: 'Proposal',
          link: 'test',
        },
      ],
    });
  });

  test('returns 200 with a list of research outputs - when searching', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/research-outputs`)
      .query({
        $top: 8,
        $skip: 0,
        $orderby: 'created desc',
        $filter: [
          "(data/type/iv eq 'Proposal' or data/type/iv eq 'Presentation')",
          "(contains(data/firstName/iv, 'Title'))",
        ].join(' and '),
      })
      .reply(200, {
        total: 3,
        items: [
          {
            id: 'uuid-1',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'Proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
            },
          },
          {
            id: 'uuid-2',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'Proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
            },
          },
          {
            id: 'uuid-3',
            created: '2020-09-23T16:34:26.842Z',
            data: {
              type: { iv: 'Proposal' },
              title: { iv: 'Title' },
              text: { iv: 'Text' },
            },
          },
        ],
      } as { total: number; items: RestResearchOutput[] })
      .get(`/api/content/${config.appName}/teams`)
      .query(() => true)
      .reply(200, {
        total: 2,
        items: [
          {
            id: 'uuid-team-1',
            created: '2020-09-23T16:34:26.842Z',
            lastModified: '2020-09-23T16:34:26.842Z',
            data: {
              displayName: { iv: 'Team 1' },
              applicationNumber: { iv: 'APP' },
              outputs: {
                iv: ['uuid-1', 'uuid-3'],
              },
            },
          },
          {
            id: 'uuid-team-2',
            created: '2020-09-23T16:34:26.842Z',
            lastModified: '2020-09-23T16:34:26.842Z',
            data: {
              displayName: { iv: 'Team 2' },
              applicationNumber: { iv: 'APP' },
              outputs: {
                iv: ['uuid-2'],
              },
            },
          },
        ],
      } as { total: number; items: RestTeam[] });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        queryStringParameters: {
          search: 'Title',
          filter: ['Proposal', 'Presentation'],
        },
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const res = JSON.parse(result.body) as ResearchOutputResponse;
    expect(result.statusCode).toStrictEqual(200);
    expect(res).toStrictEqual({
      total: 3,
      items: [
        {
          created: '2020-09-23T16:34:26.842Z',
          id: 'uuid-1',
          text: 'Text',
          title: 'Title',
          type: 'Proposal',
          team: {
            id: 'uuid-team-1',
            displayName: 'Team 1',
          },
        },
        {
          created: '2020-09-23T16:34:26.842Z',
          id: 'uuid-2',
          text: 'Text',
          title: 'Title',
          type: 'Proposal',
          team: {
            id: 'uuid-team-2',
            displayName: 'Team 2',
          },
        },
        {
          created: '2020-09-23T16:34:26.842Z',
          id: 'uuid-3',
          text: 'Text',
          title: 'Title',
          type: 'Proposal',
          team: {
            id: 'uuid-team-1',
            displayName: 'Team 1',
          },
        },
      ],
    });
  });
});
