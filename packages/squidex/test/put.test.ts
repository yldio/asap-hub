import { AsapError, NotFoundError } from '@asap-hub/errors';
import nock from 'nock';
import config from '../src/config';
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
  const client = new Squidex<Content>(collection, getAccessTokenMock);

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns AsapError when squidex returns bad request', async () => {
    nock(config.baseUrl)
      .put(`/api/content/${config.appName}/${collection}/42`)
      .query(() => true)
      .reply(400, {
        details: ['Request  body has an invalid format'],
        message: 'The model is not valid',
      });

    await expect(() =>
      client.put('42', { string: { iv: 'value' } }),
    ).rejects.toThrow(AsapError);
  });

  it('returns NotFoundError when document doesnt exist', async () => {
    nock(config.baseUrl)
      .put(`/api/content/${config.appName}/${collection}/42`)
      .reply(404);

    await expect(() =>
      client.put('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('returns AsapError when squidex returns error', async () => {
    nock(config.baseUrl)
      .put(`/api/content/${config.appName}/${collection}/42`)
      .query(() => true)
      .reply(500);

    await expect(() =>
      client.put('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(AsapError);
  });

  it('updates a specific document', async () => {
    nock(config.baseUrl)
      .put(`/api/content/${config.appName}/${collection}/42`, {
        string: {
          iv: 'value',
        },
      })
      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.put('42', {
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
});
