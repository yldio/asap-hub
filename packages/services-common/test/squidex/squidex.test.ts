import nock from 'nock';
import encode from 'jwt-encode';
import { Squidex } from '../../src/squidex';
import { cms } from '../../src/config';

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
  return nock(cms.baseUrl)
    .post(
      '/identity-server/connect/token',
      `grant_type=client_credentials&scope=squidex-api&client_id=${cms.clientId}&client_secret=${cms.clientSecret}`,
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
        `/api/content/${cms.appName}/${collection}?q=${JSON.stringify({
          take: 30,
        })}`,
      )
      .reply(200, [
        {
          id: '42',
          data: {
            string: {
              iv: 'value',
            },
          },
        },
      ]);

    const client = new Squidex<Content>(collection);
    const result = await client.fetch();
    expect(result).toEqual([
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

  it("return 404 when document doesn't exist", async () => {
    identity().get(`/api/content/${cms.appName}/${collection}/42`).reply(404);
    const client = new Squidex<Content>(collection);

    await expect(() => client.fetchById('42')).rejects.toThrow('Not Found');
    expect(nock.isDone()).toBeTruthy();
  });

  it('returns a single document using id', async () => {
    identity()
      .get(`/api/content/${cms.appName}/${collection}/42`)
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

  it('creates a specific document as published', async () => {
    identity()
      .post(`/api/content/${cms.appName}/${collection}?publish=true`, {
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
      .post(`/api/content/${cms.appName}/${collection}?publish=false`, {
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

  it('deletes a specific document', async () => {
    identity()
      .delete(`/api/content/${cms.appName}/${collection}/42`)
      .reply(204);

    const client = new Squidex<Content>(collection);
    const result = await client.delete('42');

    expect(result).toEqual('');
    expect(nock.isDone()).toBeTruthy();
  });
});
