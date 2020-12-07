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

  it('returns 400 when squidex returns bad request', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/42`)
      .query(() => true)
      .reply(400, {
        details: ['Request  body has an invalid format'],
        message: 'The model is not valid',
      });

    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.patch(42, { array: { iv: 'value' } }),
    ).rejects.toThrow('Bad Request');
  });

  it('returns 403 when squidex returns with credentials error', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/42`)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns 404 when document doesnt exist', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/42`)
      .reply(404);
    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('Not Found');
  });

  it('returns 500 when squidex returns error', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/42`)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('squidex');
  });

  it('patch a specific document based on filter', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/42`, {
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
  });
});
