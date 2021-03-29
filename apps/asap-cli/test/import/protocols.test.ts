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
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('create research output in squidex', async () => {
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

  test('create research output in squidex - with abstract', async () => {
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
        text: {
          iv:
            'Abstract text here\nFrom Team team and authors: author 1, author 2.',
        },
      })
      .reply(200);

    await importProtocols(
      join(__dirname, 'protocols-with-abstract.fixture.csv'),
    );
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
