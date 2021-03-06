import nock from 'nock';
import { join } from 'path';

import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import { protocols as importProtocols } from '../../src/import';
import {
  createProtocolsRequest,
  fetchProtocolsResponse,
  fetchUserResponse,
  fetchTeamResponse,
} from './protocols.fixture';

describe('Import protocol', () => {
  const realDateNow = Date.now.bind(global.Date);

  beforeAll(() => {
    identity();
    global.Date.now = jest.fn().mockReturnValue(1618926950256);
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  describe('create research output', () => {
    test('ignore abstract', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.link.iv',
              value: 'https://www.protocols.io/view/link1',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .get(`/api/content/${config.appName}/users`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.lastName.iv',
              value: 'team',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .post(
          `/api/content/${config.appName}/research-outputs?publish=false`,
          createProtocolsRequest,
        )
        .reply(200);

      await importProtocols(join(__dirname, 'protocols.fixture.csv'));
    });

    test('with text abstract', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.link.iv',
              value: 'https://www.protocols.io/view/link1',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .get(`/api/content/${config.appName}/users`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.lastName.iv',
              value: 'team',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .post(
          `/api/content/${config.appName}/research-outputs?publish=false`,

          {
            ...createProtocolsRequest,
            description: {
              iv: 'Abstract text here\n || From Team team || Authors: author 1, author 2.',
            },
          },
        )
        .reply(200);

      await importProtocols(
        join(__dirname, 'protocols-with-abstract.fixture.csv'),
      );
    });

    test('with JSON abstract', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/research-outputs`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.link.iv',
              value: 'https://www.protocols.io/view/link1',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .get(`/api/content/${config.appName}/users`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              op: 'eq',
              path: 'data.lastName.iv',
              value: 'team',
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        })
        .post(`/api/content/${config.appName}/research-outputs?publish=false`, {
          ...createProtocolsRequest,
          description: {
            iv: 'THIS IS\nMY TEST ABSTRACT\n || From Team team || Authors: author 1, author 2.',
          },
        })
        .reply(200);

      await importProtocols(
        join(__dirname, 'protocols-with-json-abstract.fixture.csv'),
      );
    });
  });

  test('update research output in squidex', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/research-outputs`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            op: 'eq',
            path: 'data.link.iv',
            value: 'https://www.protocols.io/view/link1',
          },
        }),
      })
      .reply(200, {
        total: 1,
        items: [fetchProtocolsResponse],
      })
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            op: 'eq',
            path: 'data.lastName.iv',
            value: 'team',
          },
        }),
      })
      .reply(200, {
        total: 1,
        items: [],
      })
      .patch(
        `/api/content/${config.appName}/research-outputs/${fetchProtocolsResponse.id}`,
        createProtocolsRequest,
      )
      .reply(200);

    await importProtocols(join(__dirname, 'protocols.fixture.csv'));
  });

  test('create research output in squidex and associate team', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/research-outputs`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            op: 'eq',
            path: 'data.link.iv',
            value: 'https://www.protocols.io/view/link1',
          },
        }),
      })
      .reply(200, {
        total: 0,
        items: [],
      })
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            op: 'eq',
            path: 'data.lastName.iv',
            value: 'team',
          },
        }),
      })
      .reply(200, {
        total: 1,
        items: [fetchUserResponse],
      })
      .post(
        `/api/content/${config.appName}/research-outputs?publish=false`,
        createProtocolsRequest,
      )
      .reply(200, fetchProtocolsResponse)
      .get(`/api/content/${config.appName}/teams/team-uuid-1`)
      .reply(200, fetchTeamResponse)
      .patch(`/api/content/${config.appName}/teams/team-uuid-1`, {
        outputs: {
          iv: [fetchProtocolsResponse.id, 'ro-uuid-1'],
        },
      })
      .reply(200);

    await importProtocols(join(__dirname, 'protocols.fixture.csv'));
  });
});
