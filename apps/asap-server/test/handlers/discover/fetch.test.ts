import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DiscoverResponse } from '@asap-hub/model';

import { handler } from '../../../src/handlers/discover/fetch';
import { cms } from '../../../src/config';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';

jest.mock('../../../src/utils/validate-token');

describe('GET /discover', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no information exists', async () => {
    nock(cms.baseUrl)
      .post(`/api/content/${cms.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDiscoverContents: [
            { flatData: { aboutUs: null, pages: null, members: null } },
          ],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      aboutUs: '',
      training: [],
      members: [],
      pages: [],
    } as DiscoverResponse);
  });

  test('returns 200 when no news and events exist', async () => {
    nock(cms.baseUrl)
      .post(`/api/content/${cms.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDiscoverContents: [
            {
              flatData: {
                pages: [
                  {
                    id: 'uuid',
                    flatData: {
                      path: '/',
                      title: 'Title',
                      text: 'Content',
                    },
                  },
                  {
                    id: 'uuid',
                    flatData: {
                      path: '/',
                      title: 'Title',
                    },
                  },
                ],
                members: [
                  {
                    id: 'uuid-1',
                    created: '2020-10-15T17:55:21Z',
                    flatData: {
                      avatar: [
                        {
                          id: 'uuid-1',
                        },
                      ],
                      displayName: 'John',
                      email: 'john@example.com',
                      firstName: 'John',
                      lastModifiedDate: '2020-10-15T17:55:21Z',
                      lastName: 'Doe',
                    },
                  },
                  {
                    id: 'uuid-2',
                    created: '2020-10-14T17:55:21Z',
                    flatData: {
                      displayName: 'Jon',
                      email: 'doe@example.com',
                      firstName: 'Jon',
                      lastModifiedDate: '2020-10-15T17:55:21Z',
                      lastName: 'Do',
                    },
                  },
                ],
                aboutUs: '<p>content<p>',
              },
            },
          ],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      training: [],
      pages: [
        {
          id: 'uuid',
          path: '/',
          shortText: '',
          title: 'Title',
          text: 'Content',
        },
        {
          id: 'uuid',
          path: '/',
          shortText: '',
          title: 'Title',
          text: '',
        },
      ],
      members: [
        {
          id: 'uuid-1',
          createdDate: '2020-10-15T17:55:21.000Z',
          displayName: 'John',
          email: 'john@example.com',
          firstName: 'John',
          lastModifiedDate: '2020-10-15T17:55:21Z',
          lastName: 'Doe',
          questions: [],
          skills: [],
          teams: [],
          avatarUrl: `${cms.baseUrl}/api/assets/${cms.appName}/uuid-1`,
        },
        {
          id: 'uuid-2',
          createdDate: '2020-10-14T17:55:21.000Z',
          displayName: 'Jon',
          email: 'doe@example.com',
          firstName: 'Jon',
          lastModifiedDate: '2020-10-15T17:55:21Z',
          lastName: 'Do',
          questions: [],
          skills: [],
          teams: [],
        },
      ],
      aboutUs: '<p>content<p>',
    });
  });
});
