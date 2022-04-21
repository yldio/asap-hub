import nock from 'nock';
import config from '../src/config';
import * as helpers from '../src/helpers';
import { Squidex } from '../src/rest';
import {
  SquidexValidationError,
  SquidexError,
  SquidexUnauthorizedError,
} from '../src/errors';
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
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('returns 400 when squidex returns bad request', async () => {
    const spy = jest.spyOn(helpers, 'parseErrorResponseBody');

    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(
        400,
        {
          details: ['Request  body has an invalid format'],
          message: 'The model is not valid',
        },
        {
          'Content-Type': 'application/json',
        },
      );

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(SquidexError);
    expect(spy).toHaveBeenCalled();
  });

  it('returns 400 along with the response payload formatted to json when squidex returns validation error', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(400, {
        message: 'Validation error',
        traceId: '00-ba8100d975b2cb551a023702a7d0d5b7-891e647127349001-01',
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        details: ['link.iv: Another content with the same value exists.'],
        statusCode: 400,
      });

    await expect(() =>
      client.create({
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

  it('returns SquidexError along with the raw response payload when squidex returns an error response which is not json', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(400, '<not>json</not>');

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrowError(SquidexError);
  });

  it('returns SquidexError on unparsable JSON', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(200, '<not>json</not>');

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrowError(SquidexError);
  });

  it('returns SquidexUnauthorizedError when squidex returns with credentials error', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(SquidexUnauthorizedError);
  });

  it('returns SquidexValidationError when squidex returns conflict', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(409, {
        details: 'user with same email already exists',
        statusCode: 409,
      });

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(SquidexValidationError);
  });

  it('returns SquidexError when squidex returns error', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(500);

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow(SquidexError);
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

function parseErrorResponse(err: { response: { body: string } }) {
  throw new Error('Function not implemented.');
}
