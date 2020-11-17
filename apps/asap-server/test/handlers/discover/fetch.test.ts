import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DiscoverResponse } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/discover/fetch';
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
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
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
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDiscoverContents: [
            {
              flatData: {
                training: [
                  {
                    id: 'uuid',
                    created: '2020-09-24T11:06:27.164Z',
                    flatData: {
                      path: '/',
                      title: 'Title',
                      text: 'Content',
                      link: 'https://hub.asap.science',
                      linkText: 'ASAP Training',
                      type: 'Training',
                    },
                  },
                ],
                pages: [
                  {
                    id: 'uuid',
                    flatData: {
                      path: '/',
                      title: 'Title',
                      text: 'Content',
                      link: 'https://hub.asap.science',
                      linkText: 'ASAP Hub',
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
                      displayName: null,
                      email: null,
                      firstName: 'Jon',
                      lastModifiedDate: '2020-10-15T17:55:21Z',
                      lastName: 'Do',
                      role: 'Staff',
                      responsibilities: 'responsibilities',
                      reachOut: 'reach out',
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
      training: [
        {
          created: '2020-09-24T11:06:27.164Z',
          id: 'uuid',
          link: 'https://hub.asap.science',
          linkText: 'ASAP Training',
          shortText: '',
          text: 'Content',
          title: 'Title',
          type: 'Training',
        },
      ],
      pages: [
        {
          id: 'uuid',
          link: 'https://hub.asap.science',
          linkText: 'ASAP Hub',
          path: '/',
          shortText: '',
          title: 'Title',
          text: 'Content',
        },
        {
          id: 'uuid',
          link: '',
          linkText: '',
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
          displayName: 'John Doe',
          email: 'john@example.com',
          firstName: 'John',
          lastModifiedDate: '2020-10-15T17:55:21Z',
          lastName: 'Doe',
          orcidWorks: [],
          questions: [],
          skills: [],
          teams: [],
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-1`,
          role: 'Guest',
        },
        {
          id: 'uuid-2',
          createdDate: '2020-10-14T17:55:21.000Z',
          displayName: 'Jon Do',
          email: '',
          firstName: 'Jon',
          lastModifiedDate: '2020-10-15T17:55:21Z',
          lastName: 'Do',
          orcidWorks: [],
          questions: [],
          skills: [],
          teams: [],
          reachOut: 'reach out',
          responsibilities: 'responsibilities',
          role: 'Staff',
        },
      ],
      aboutUs: '<p>content<p>',
    });
  });
});
