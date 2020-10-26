import nock from 'nock';
import config from '../src/config';
import { Squidex } from '../src/squidex';
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

  it('returns 403 when squidex returns with credentials error', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
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
  });

  it('returns 500 when squidex returns error', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
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
  });

  it('creates a specific document as published', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}?publish=true`, {
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
  });

  it('creates a specific document as draft', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}?publish=false`, {
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
  });
});
