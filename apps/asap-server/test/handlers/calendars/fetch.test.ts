import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config, RestCalendar, Results } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/calendars/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';

jest.mock('../../../src/utils/validate-token');

const getCalendarsResponse: Results<RestCalendar> = {
  total: 2,
  items: [
    {
      id: 'cms-calendar-id-1',
      data: {
        id: { iv: 'calendar-id-1' },
        color: { iv: '#5C1158' },
        name: { iv: 'Kubernetes Meetups' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
    {
      id: 'cms-calendar-id-2',
      data: {
        id: { iv: 'calendar-id-2' },
        color: { iv: '#B1365F' },
        name: { iv: 'Service Mesh Conferences' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
  ],
};

describe('Get /calendars', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no calendars are found', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/calendars`)
      .query({
        q: JSON.stringify({
          take: 50,
          skip: 0,
          sort: [{ path: 'data.name.iv', order: 'ascending' }],
        }),
      })
      .reply(200, { total: 0, items: [] });

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(res.body);
    expect(res.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({ total: 0, items: [] });
  });

  test('returns 200 when calendars are found', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/calendars`)
      .query({
        q: JSON.stringify({
          take: 20,
          skip: 10,
          sort: [{ path: 'data.name.iv', order: 'ascending' }],
        }),
      })
      .reply(200, getCalendarsResponse);

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        queryStringParameters: {
          take: '20',
          skip: '10',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(res.body);
    expect(res.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({
      total: 2,
      items: [
        {
          id: 'calendar-id-1',
          color: '#5C1158',
          name: 'Kubernetes Meetups',
        },
        {
          id: 'calendar-id-2',
          color: '#B1365F',
          name: 'Service Mesh Conferences',
        },
      ],
    });
  });
});
