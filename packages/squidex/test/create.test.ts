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

  it('returns 400 when squidex returns bad request', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(400, {
        details: ['Request  body has an invalid format'],
        message: 'The model is not valid',
      });

    await expect(() =>
      client.create({
        string: {
          iv: 'value',
        },
      }),
    ).rejects.toThrow('Bad Request');
  });

  it('returns 403 when squidex returns with credentials error', async () => {
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
    ).rejects.toThrow('Unauthorized');
  });

  it('returns 409 when squidex returns conflict', async () => {
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
    ).rejects.toThrow('Conflict');
  });

  it('returns 500 when squidex returns error', async () => {
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
