import nock from 'nock';
import { GenericError, NotFoundError } from '@asap-hub/errors';
import { Squidex } from '../rest';
// eslint-disable-next-line jest/no-mocks-import
import { getAccessTokenMock } from '../__mocks__/access-token.mock';

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
    // eslint-disable-next-line jest/no-standalone-expect
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

  it('returns ValidationError along with the response payload formatted to json when squidex returns validation error', async () => {
    nock(baseUrl)
      .patch(`/api/content/${appName}/${collection}/42`)
      .query(() => true)
      .reply(400, {
        message: 'Validation error',
        traceId: '00-ba8100d975b2cb551a023702a7d0d5b7-891e647127349001-01',
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        details: ['link.iv: Another content with the same value exists.'],
        statusCode: 400,
      });

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrowError(
      expect.objectContaining({
        details: ['link.iv: Another content with the same value exists.'],
      }),
    );
  });

  it('returns GenericError along with the raw response payload when squidex returns an error response which is not json', async () => {
    nock(baseUrl)
      .patch(`/api/content/${appName}/${collection}/42`)
      .query(() => true)
      .reply(400, '<not>json</not>');

    await expect(() =>
      client.patch('42', {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrowError(GenericError);
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
