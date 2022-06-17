import { GenericError } from '@asap-hub/errors';
import nock from 'nock';
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

  it('returns GenericError when squidex returns error', async () => {
    nock(baseUrl)
      .get(`/api/content/${appName}/${collection}`)
      .query(() => true)
      .reply(500);

    await expect(() => client.fetch()).rejects.toThrow(GenericError);
  });

  it('returns GenericError on HTTP error', async () => {
    nock(baseUrl)
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(401);

    await expect(() => client.fetch()).rejects.toThrow(GenericError);
  });

  it('returns a list of documents', async () => {
    nock(baseUrl)
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
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
    nock(baseUrl)
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(404);

    const result = await client.fetch();
    expect(result).toEqual({ total: 0, items: [] });
  });

  it('returns draft documents', async () => {
    nock(baseUrl, {
      reqheaders: {
        'X-Unpublished': 'true',
      },
    })
      .get(
        `/api/content/${appName}/${collection}?q=${JSON.stringify({
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

    const client = new Squidex<Content>(
      getAccessTokenMock,
      collection,
      { appName, baseUrl },
      {
        unpublished: true,
      },
    );

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
