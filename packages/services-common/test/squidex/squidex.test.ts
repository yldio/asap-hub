import nock from 'nock';
import encode from 'jwt-encode';
import { Squidex } from '../../src/squidex';
import { cms as squidex } from '../../src/config';

interface Content {
  id: string;
  data: {
    string: {
      iv: string;
    };
  };
}

const collection = 'contents';
const identity = () => {
  return nock(squidex.baseUrl)
    .post(
      '/identity-server/connect/token',
      `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
        squidex.clientId,
      )}&client_secret=${squidex.clientSecret}`,
    )
    .reply(200, {
      access_token: encode(
        {
          exp: Math.floor((new Date().getTime() + 1) / 1000),
          nbf: Math.floor(new Date().getTime() / 1000),
        },
        'secret',
      ),
      expires_in: 2592000,
      token_type: 'Bearer',
      scope: 'squidex-api',
    });
};

describe('squidex wrapper', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('returns a list of documents', async () => {
    identity()
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
          take: 8,
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
    expect(nock.isDone()).toBeTruthy();
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
    expect(result).toEqual({ items: [] });
    expect(nock.isDone()).toBeTruthy();
  });

  it('propagates squidex error when fetching a collection', async () => {
    identity()
      .get(
        `/api/content/${squidex.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetch()).rejects.toThrow('squidex');
    expect(nock.isDone()).toBeTruthy();
  });

  it("return 404 when document doesn't exist", async () => {
    identity()
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(404);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('Not Found');
    expect(nock.isDone()).toBeTruthy();
  });

  it('propagates squidex error when fetching a document', async () => {
    identity()
      .get(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('squidex');
    expect(nock.isDone()).toBeTruthy();
  });

  it('returns a single document using id', async () => {
    identity()
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
    expect(nock.isDone()).toBeTruthy();
  });

  it('returns a single document based on filter', async () => {
    identity()
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
    expect(nock.isDone()).toBeTruthy();
  });

  it('returns not found if no document exists based on filter', async () => {
    identity()
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
    expect(nock.isDone()).toBeTruthy();
  });

  it('creates a specific document as published', async () => {
    identity()
      .post(`/api/content/${squidex.appName}/${collection}?publish=true`, {
        string: {
          iv: 'value',
        },
      })
      .reply(201, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const client = new Squidex<Content>(collection);
    const result = await client.create({
      string: {
        iv: 'value',
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

    expect(nock.isDone()).toBeTruthy();
  });

  it('creates a specific document as draft', async () => {
    identity()
      .post(`/api/content/${squidex.appName}/${collection}?publish=false`, {
        string: {
          iv: 'value',
        },
      })
      .reply(201, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const client = new Squidex<Content>(collection);
    const result = await client.create(
      {
        string: {
          iv: 'value',
        },
      },
      false,
    );

    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'value',
        },
      },
    });

    expect(nock.isDone()).toBeTruthy();
  });

  it('patch a specific document based on filter', async () => {
    identity()
      .patch(`/api/content/${squidex.appName}/${collection}/42`, {
        string: {
          iv: 'value',
        },
      })
      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'newValue',
          },
        },
      });

    const client = new Squidex<Content>(collection);
    const result = await client.patch('42', {
      string: {
        iv: 'value',
      },
    });

    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'newValue',
        },
      },
    });
    expect(nock.isDone()).toBeTruthy();
  });

  it('deletes a specific document', async () => {
    identity()
      .delete(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(204);

    const client = new Squidex<Content>(collection);
    const result = await client.delete('42');

    expect(result).toEqual('');
    expect(nock.isDone()).toBeTruthy();
  });
});
