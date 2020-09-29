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
      .post(`/api/content/${squidex.appName}/${collection}`)
      .query(() => true)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('Unauthorized');
    expect(nock.isDone()).toBe(true);
  });

  it('returns 500 when squidex returns error', async () => {
    identity()
      .post(`/api/content/${squidex.appName}/${collection}`)
      .query(() => true)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('squidex');
    expect(nock.isDone()).toBe(true);
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

    expect(nock.isDone()).toBe(true);
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

    expect(nock.isDone()).toBe(true);
  });
});
