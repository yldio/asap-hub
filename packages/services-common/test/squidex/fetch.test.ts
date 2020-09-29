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
  afterEach(() => {
    nock.cleanAll();
  });

  it('returns 403 when squidex returns with credentials error', async () => {
    identity()
      .get(`/api/content/${squidex.appName}/${collection}`)
      .query(() => true)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    const client = new Squidex<Content>(collection);

    await expect(() => client.fetch()).rejects.toThrow('Unauthorized');
    expect(nock.isDone()).toBe(true);
  });

  it('returns 500 when squidex returns error', async () => {
    identity()
      .get(`/api/content/${squidex.appName}/${collection}`)
      .query(() => true)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetch()).rejects.toThrow('squidex');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a list of documents', async () => {
    identity()
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(200, {
        total: 1,
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
    const result = await client.fetch();
    expect(result.items).toEqual([
      {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      },
    ]);
    expect(nock.isDone()).toBe(true);
  });

  it("returns an empty list of documents if collection doesn't exist", async () => {
    identity()
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(404);

    const client = new Squidex<Content>(collection);
    const result = await client.fetch();
    expect(result).toEqual({ total: 0, items: [] });
    expect(nock.isDone()).toBe(true);
  });
});
