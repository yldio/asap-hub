import { GenericError, ValidationError } from '@asap-hub/errors';
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
describe('squidex wrapper - upsert', () => {
  const contentId = 'content-id';
  const client = new Squidex<Content>(collection, getAccessTokenMock);

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('returns GenericError when squidex returns bad request', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/${contentId}`)
      .query(() => true)
      .reply(400, {
        details: ['Request  body has an invalid format'],
        message: 'The model is not valid',
      });

    // JSON parse/stringify so TS won't complain
    await expect(() =>
      client.upsert(
        contentId,
        JSON.parse(
          JSON.stringify({
            array: {
              iv: 'value',
            },
          }),
        ),
      ),
    ).rejects.toThrow(GenericError);
  });

  it('returns ValidationError along with the response payload formatted to json when squidex returns validation error', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/${contentId}`)
      .query(() => true)
      .reply(400, {
        message: 'Validation error',
        traceId: '00-ba8100d975b2cb551a023702a7d0d5b7-891e647127349001-01',
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        details: ['link.iv: Another content with the same value exists.'],
        statusCode: 400,
      });

    await expect(() =>
      client.upsert(
        contentId,
        JSON.parse(
          JSON.stringify({
            array: {
              iv: 'value',
            },
          }),
        ),
      ),
    ).rejects.toThrowError(
      expect.objectContaining({
        details: ['link.iv: Another content with the same value exists.'],
      }),
    );
  });

  it('returns GenericError along with the raw response payload when squidex returns an error response which is not json', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/${contentId}`)
      .query(() => true)
      .reply(400, '<not>json</not>');

    await expect(() =>
      client.upsert(
        contentId,
        JSON.parse(
          JSON.stringify({
            array: {
              iv: 'value',
            },
          }),
        ),
      ),
    ).rejects.toThrowError(GenericError);
  });

  it('returns GenericError when squidex returns error', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/${collection}/${contentId}`)
      .query(() => true)
      .reply(500);

    await expect(() =>
      client.upsert(contentId, {
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(GenericError);
  });

  it('upserts a specific document as published', async () => {
    nock(config.baseUrl)
      .patch(
        `/api/content/${config.appName}/${collection}/${contentId}?publish=true`,
        {
          string: {
            iv: 'value',
          },
        },
      )
      .reply(201, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.upsert(contentId, {
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

  it('upserts a specific document as draft', async () => {
    nock(config.baseUrl)
      .patch(
        `/api/content/${config.appName}/${collection}/${contentId}?publish=false`,
        {
          string: {
            iv: 'value',
          },
        },
      )
      .reply(201, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.upsert(
      contentId,
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
