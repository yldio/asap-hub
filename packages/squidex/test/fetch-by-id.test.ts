import nock from 'nock';
import config from '../src/config';
import { Squidex } from '../src/rest';
import {
  SquidexError,
  SquidexUnauthorizedError,
  SquidexNotFoundError,
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
    nock.cleanAll();
  });

  it("return 404 when document doesn't exist", async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/${collection}/42`)
      .reply(404);

    await expect(() => client.fetchById('42')).rejects.toThrow(
      SquidexNotFoundError,
    );
  });

  it('returns 403 when squidex returns with credentials error', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/${collection}/42`)
      .reply(400, {
        details: 'invalid_client',
        statusCode: 400,
      });

    await expect(() => client.fetchById('42')).rejects.toThrow(
      SquidexUnauthorizedError,
    );
  });

  it('returns 500 when squidex returns error', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/${collection}/42`)
      .reply(500);

    await expect(() => client.fetchById('42')).rejects.toThrow(SquidexError);
  });

  it('returns a single document using id', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/${collection}/42`)
      .reply(200, {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      });

    const result = await client.fetchById('42');
    expect(result).toEqual({
      id: '42',
      data: {
        string: {
          iv: 'value',
        },
      },
    });
  });

  it('returns a single document based on filter', async () => {
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.string.iv',
            op: 'eq',
            value: 'value',
          },
        })}`,
      )
      .reply(200, {
        items: [
          {
            id: '42',
            data: {
              string: {
                iv: 'value',
              },
            },
          },
        ],
      });

    const result = await client.fetchOne({
      filter: {
        path: 'data.string.iv',
        op: 'eq',
        value: 'value',
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

  it('returns not found if no document exists based on filter', async () => {
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 1,
          filter: {
            path: 'data.string.iv',
            op: 'eq',
            value: 'value',
          },
        })}`,
      )
      .reply(200, {
        total: 0,
        items: [],
      });

    await expect(() =>
      client.fetchOne({
        filter: {
          path: 'data.string.iv',
          op: 'eq',
          value: 'value',
        },
      }),
    ).rejects.toThrow(SquidexNotFoundError);
  });
});
