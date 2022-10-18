import nock from 'nock';
import { RestNews, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { getAuthToken } from '../../src/utils/auth';
import { identity } from '../helpers/squidex';
import {
  getListNewsDataObject,
  newsSquidexApiResponse,
} from '../fixtures/news.fixtures';
import { NewsDataObject } from '@asap-hub/model';
import { NewsSquidexDataProvider } from '../../src/data-providers/news.data-provider';

describe('News data provider', () => {
  const newsRestClient = new SquidexRest<RestNews>(
    getAuthToken,
    'news-and-events',
    { appName, baseUrl },
  );
  const newsDataProvider = new NewsSquidexDataProvider(newsRestClient);

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no news exist', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when resource does not exist', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(404);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return news', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, newsSquidexApiResponse);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(getListNewsDataObject());
    });

    test('Should return news when the thumbnail is null', async () => {
      const squidexResponse = {
        total: 1,
        items: [
          {
            ...newsSquidexApiResponse.items[0],
            data: {
              ...newsSquidexApiResponse.items[0]!.data,
              thumbnail: {
                iv: null,
              },
            },
          },
        ],
      };

      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, squidexResponse);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result.items[0]!.thumbnail).toBeUndefined();
    });

    test('Should query data properly when request does not have options', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, newsSquidexApiResponse);

      const result = await newsDataProvider.fetch();

      expect(result).toEqual(getListNewsDataObject());
    });

    describe('Frequency Filter', () => {
      test('Should query data properly when only CRN Quarterly frequency is selected', async () => {
        nock(baseUrl)
          .get(`/api/content/${appName}/news-and-events`)
          .query({
            q: JSON.stringify({
              take: 8,
              skip: 5,
              filter: {
                path: 'data.frequency.iv',
                op: 'in',
                value: ['CRN Quarterly'],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });

      test('Should query data properly when CRN Quarterly and News Articles frequency are selected', async () => {
        nock(baseUrl)
          .get(`/api/content/${appName}/news-and-events`)
          .query({
            q: JSON.stringify({
              take: 8,
              skip: 5,
              filter: {
                or: [
                  {
                    path: 'data.frequency.iv',
                    op: 'empty',
                    value: null,
                  },
                  {
                    path: 'data.frequency.iv',
                    op: 'in',
                    value: ['CRN Quarterly', 'News Articles'],
                  },
                ],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly', 'News Articles'],
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });
    });

    describe('Text Filter', () => {
      test('Should query data properly when passing search param and no frequency is selected', async () => {
        nock(baseUrl)
          .get(`/api/content/${appName}/news-and-events`)
          .query({
            q: JSON.stringify({
              take: 8,
              skip: 5,
              filter: {
                path: 'data.title.iv',
                op: 'contains',
                value: 'hey',
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: { title: 'hey' },
        });

        expect(result).toEqual(getListNewsDataObject());
      });

      test('Should query data properly when passing search param and frequency is selected', async () => {
        nock(baseUrl)
          .get(`/api/content/${appName}/news-and-events`)
          .query({
            q: JSON.stringify({
              take: 8,
              skip: 5,
              filter: {
                and: [
                  {
                    path: 'data.frequency.iv',
                    op: 'in',
                    value: ['CRN Quarterly'],
                  },
                  { path: 'data.title.iv', op: 'contains', value: 'hey' },
                ],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
            title: 'hey',
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should return null when the news is not found', async () => {
      const id = 'some-id';

      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events/${id}`)
        .reply(404);

      expect(await newsDataProvider.fetchById(id)).toBeNull();
    });

    test('Should throw when the server responds with an error', async () => {
      const id = 'some-id';

      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events/${id}`)
        .reply(500);

      await expect(newsDataProvider.fetchById(id)).rejects.toThrow();
    });

    test('Should return the result when the news exists', async () => {
      const id = 'some-id';

      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events/${id}`)
        .reply(200, {
          id: 'uuid',
          created: '2020-09-23T16:34:26.842Z',
          data: {
            type: { iv: 'News' },
            title: { iv: 'Title' },
            text: { iv: 'Text' },
          },
        });

      const result = await newsDataProvider.fetchById(id);

      const expectedResponse: NewsDataObject = {
        created: '2020-09-23T16:34:26.842Z',
        id: 'uuid',
        text: 'Text',
        title: 'Title',
        type: 'News',
      };

      expect(result).toEqual(expectedResponse);
    });
  });
});
