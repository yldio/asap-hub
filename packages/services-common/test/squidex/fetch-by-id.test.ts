import nock from 'nock';
import { Squidex } from '../../src/squidex';
import { cms as squidex } from '../../src/config';
import { identity } from './identity';

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
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it("return 404 when document doesn't exist", async () => {
    nock(squidex.baseUrl)
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(404);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('Not Found');
  });

  it('returns 403 when squidex returns with credentials error', async () => {
    nock(squidex.baseUrl)
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('Unauthorized');
  });

  it('returns 500 when squidex returns error', async () => {
    nock(squidex.baseUrl)
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('squidex');
  });

  it('returns a single document using id', async () => {
    nock(squidex.baseUrl)
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const client = new Squidex<Content>(collection);
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

  it('returns a single document based on filter', async () => {
    nock(squidex.baseUrl)
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
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

    const client = new Squidex<Content>(collection);
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
    nock(squidex.baseUrl)
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
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

    const client = new Squidex<Content>(collection);
    await expect(() =>
      client.fetchOne({
        filter: {
          path: 'data.string.iv',
          op: 'eq',
          value: 'value',
        },
      }),
    ).rejects.toThrow('Not Found');
  });
});
