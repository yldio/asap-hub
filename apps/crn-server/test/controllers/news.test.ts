import nock from 'nock';
import { NotFoundError } from '@asap-hub/errors';
import { identity } from '../helpers/squidex';
import News from '../../src/controllers/news';
import {
  newsSquidexApiResponse,
  listNewsResponse,
} from '../fixtures/news.fixtures';
import { NewsResponse } from '@asap-hub/model';
import { RestNews, SquidexRest } from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';

describe('News controller', () => {
  const newsRestClient = new SquidexRest<RestNews>(
    getAuthToken,
    'news-and-events',
    { appName, baseUrl },
  );
  const news = new News(newsRestClient);

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no news exist', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await news.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when resource does not exists', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(404);

      const result = await news.fetch({ take: 8, skip: 5 });

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
            filter: { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, newsSquidexApiResponse);

      const result = await news.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(listNewsResponse);
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
            filter: { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, squidexResponse);

      const result = await news.fetch({ take: 8, skip: 5 });

      expect(result.items[0]!.thumbnail).toBeUndefined();
    });

    test('Should query data properly when request does not have options', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, newsSquidexApiResponse);

      const result = await news.fetch();

      expect(result).toEqual(listNewsResponse);
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
                and: [
                  { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
                  {
                    path: 'data.frequency.iv',
                    op: 'in',
                    value: ['CRN Quarterly'],
                  },
                ],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await news.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
          },
        });

        expect(result).toEqual(listNewsResponse);
      });

      test('Should query data properly when CRN Quarterly and News Articles frequency is selected', async () => {
        nock(baseUrl)
          .get(`/api/content/${appName}/news-and-events`)
          .query({
            q: JSON.stringify({
              take: 8,
              skip: 5,
              filter: {
                and: [
                  { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
                  {
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
                ],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await news.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly', 'News Articles'],
          },
        });

        expect(result).toEqual(listNewsResponse);
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
                and: [
                  { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
                  { path: 'data.title.iv', op: 'contains', value: 'hey' },
                ],
              },
              sort: [{ order: 'descending', path: 'created' }],
            }),
          })
          .reply(200, newsSquidexApiResponse);

        const result = await news.fetch({
          take: 8,
          skip: 5,
          search: 'hey',
        });

        expect(result).toEqual(listNewsResponse);
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
                  { path: 'data.type.iv', op: 'ne', value: 'Tutorial' },
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

        const result = await news.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
          },
          search: 'hey',
        });

        expect(result).toEqual(listNewsResponse);
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw a Not Found error when the news and event are not found', async () => {
      const id = 'some-id';

      nock(baseUrl)
        .get(`/api/content/${appName}/news-and-events/${id}`)
        .reply(404);

      await expect(news.fetchById(id)).rejects.toThrow(NotFoundError);
    });

    test('Should return the result when the news and event exists', async () => {
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

      const result = await news.fetchById(id);

      const expectedResponse: NewsResponse = {
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
