import { GenericError } from '@asap-hub/errors';
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

  it('returns GenericError when squidex returns error', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/${collection}`)
      .query(() => true)
      .reply(500);

    await expect(() => client.fetch()).rejects.toThrow(GenericError);
  });

  it('returns GenericError on HTTP error', async () => {
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(401);

    await expect(() => client.fetch()).rejects.toThrow(GenericError);
  });

  it('returns a list of documents', async () => {
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(200, {
        total: 1,
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

    const result = await client.fetch();
    expect(result.items).toEqual([
      {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      },
    ]);
  });

  it("returns an empty list of documents if collection doesn't exist", async () => {
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(404);

    const result = await client.fetch();
    expect(result).toEqual({ total: 0, items: [] });
  });

  it('returns draft documents', async () => {
    nock(config.baseUrl, {
      reqheaders: {
        'X-Unpublished': 'true',
      },
    })
      .get(
        `/api/content/${config.appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(200, {
        total: 1,
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

    const client = new Squidex<Content>(collection, getAccessTokenMock, {
      unpublished: true,
    });
    const result = await client.fetch();
    expect(result.items).toEqual([
      {
        id: '42',
        data: {
          string: {
            iv: 'value',
          },
        },
      },
    ]);
  });
});
