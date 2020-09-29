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
      .patch(`/api/content/${squidex.appName}/${collection}/42`)
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
    expect(nock.isDone()).toBe(true);
  });

  it('returns 500 when squidex returns error', async () => {
    identity()
      .patch(`/api/content/${squidex.appName}/${collection}/42`)
      .reply(500);
    const client = new Squidex<Content>(collection);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('squidex');
    expect(nock.isDone()).toBe(true);
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
    expect(nock.isDone()).toBe(true);
  });
});
