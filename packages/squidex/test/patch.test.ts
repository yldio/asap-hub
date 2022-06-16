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

  it('returns GenericError when squidex returns bad request', async () => {
    nock(baseUrl)
      .patch(`/api/content/${appName}/${collection}/42`)
      .query(() => true)
      .reply(400, {
        details: ['Request  body has an invalid format'],
        message: 'The model is not valid',
      });

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(GenericError);
  });

  it('returns GenericError when squidex returns with unparsable content', async () => {
    nock(baseUrl)
      .patch(`/api/content/${appName}/${collection}/42`)
      .reply(200, 'unparsable}json');

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(GenericError);
  });

  it('returns NotFoundError when document doesnt exist', async () => {
    nock(baseUrl).patch(`/api/content/${appName}/${collection}/42`).reply(404);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('returns GenericError when squidex returns error', async () => {
    nock(baseUrl).patch(`/api/content/${appName}/${collection}/42`).reply(500);

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(GenericError);
  });

  it('patch a specific document based on filter', async () => {
    nock(baseUrl)
      .patch(`/api/content/${appName}/${collection}/42`, {
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
