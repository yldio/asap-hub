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
    nock.cleanAll();
  });

  it('returns GenericError with request body when squidex returns bad request', async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42`)
      .query(() => true)
      .reply(400, {
        details: ['Request body has an invalid format'],
        message: 'The model is not valid',
      });

    const putResult = client.put('42', { string: { iv: 'value' } });

    await expect(putResult).rejects.toThrow(GenericError);
    await expect(putResult).rejects.toThrow(
      expect.objectContaining({
        httpResponseBody: JSON.stringify({
          details: ['Request body has an invalid format'],
          message: 'The model is not valid',
        }),
      }),
    );
  });

  it('returns NotFoundError when document doesnt exist', async () => {
    nock(baseUrl).put(`/api/content/${appName}/${collection}/42`).reply(404);

    await expect(() =>
      client.put('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('returns GenericError when squidex returns error', async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42`)
      .query(() => true)
      .reply(500);

    await expect(() =>
      client.put('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(GenericError);
  });

  it('updates a specific document', async () => {
    nock(baseUrl)
      .put(`/api/content/${appName}/${collection}/42`, {
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
