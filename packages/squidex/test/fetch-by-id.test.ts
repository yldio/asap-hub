import nock from 'nock';
import { GenericError, NotFoundError } from '@asap-hub/errors';
import { Squidex } from '../src/rest';
import { getAccessTokenMock } from './mocks/access-token.mock';

interface Content {
  id: string;
  data: {
    string: {
      iv: string;
    };
  };
}

const collection = 'contents';
describe('squidex wrapper', () => {
  const appName = 'test-app';
  const baseUrl = 'http://test-url.com';
  const client = new Squidex<Content>(getAccessTokenMock, collection, {
    appName,
    baseUrl,
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("return NotFoundError when document doesn't exist", async () => {
    nock(baseUrl).get(`/api/content/${appName}/${collection}/42`).reply(404);

    await expect(() => client.fetchById('42')).rejects.toThrow(NotFoundError);
  });

  it('return GenericError on HTTP Error', async () => {
    nock(baseUrl).get(`/api/content/${appName}/${collection}/42`).reply(405);

    await expect(() => client.fetchById('42')).rejects.toThrow(GenericError);
  });

  it('returns GenericError when squidex returns error', async () => {
    nock(baseUrl).get(`/api/content/${appName}/${collection}/42`).reply(500);

    await expect(() => client.fetchById('42')).rejects.toThrow(GenericError);
  });

  it('returns a single document using id', async () => {
    nock(baseUrl, { badheaders: ['X-Unpublished'] })
      .get(`/api/content/${appName}/${collection}/42`)

      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.fetchById('42');
    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'value',
        },
      },
    });
  });

  it('returns a single, unpublished document using id', async () => {
    nock(baseUrl)
      .get(`/api/content/${appName}/${collection}/42`)
      .matchHeader('X-Unpublished', `true`)
      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.fetchById('42', false);
    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'value',
        },
      },
    });
  });

  it('returns a single document based on filter', async () => {
    nock(baseUrl)
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.string.iv',
            op: 'eq',
            value: 'value',
          },
        })}`,
      )
      .reply(200, {
        items: [
          {
            id: '42',
            data: {
              string: {
                iv: 'value',
              },
            },
          },
        ],
      });

    const result = await client.fetchOne({
      filter: {
        path: 'data.string.iv',
        op: 'eq',
        value: 'value',
      },
    });

    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'value',
        },
      },
    });
  });

  it('returns not found if no document exists based on filter', async () => {
    nock(baseUrl)
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.string.iv',
            op: 'eq',
            value: 'value',
          },
        })}`,
      )
      .reply(200, {
        total: 0,
        items: [],
      });

    await expect(() =>
      client.fetchOne({
        filter: {
          path: 'data.string.iv',
          op: 'eq',
          value: 'value',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
