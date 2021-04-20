import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import NewsAndEvents from '../../src/controllers/news-and-events';
import {
  newsAndEventsSquidexApiResponse,
  listNewsAndEventsResponse,
} from '../fixtures/news-and-events.fixtures';
import { NewsOrEventResponse } from '@asap-hub/model';

describe('NewsAndEvents controller', () => {
  const newsAndEvents = new NewsAndEvents();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no news and events exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await newsAndEvents.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when resource does not exists', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(404);

      const result = await newsAndEvents.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return news and events', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, newsAndEventsSquidexApiResponse);

      const result = await newsAndEvents.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(listNewsAndEventsResponse);
    });

    test('Should return news and events when the thumbnail is null', async () => {
      const squidexResponse = {
        total: 1,
        items: [
          {
            ...newsAndEventsSquidexApiResponse.items[0],
            data: {
              ...newsAndEventsSquidexApiResponse.items[0].data,
              thumbnail: {
                iv: null,
              },
            },
          },
        ],
      };

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events`)
        .query({
          q: JSON.stringify({
            take: 8,
            skip: 5,
            filter: { path: 'data.type.iv', op: 'ne', value: 'Training' },
            sort: [{ order: 'descending', path: 'created' }],
          }),
        })
        .reply(200, squidexResponse);

      const result = await newsAndEvents.fetch({ take: 8, skip: 5 });

      expect(result.items[0].thumbnail).toBeUndefined();
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw a Not Found error when the news and event are not found', async () => {
      const id = 'some-id';

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events/${id}`)
        .reply(404);

      await expect(newsAndEvents.fetchById(id)).rejects.toThrow('Not Found');
    });

    test('Should return the result when the news and event exists', async () => {
      const id = 'some-id';

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/news-and-events/${id}`)
        .reply(200, {
          id: 'uuid',
          created: '2020-09-23T16:34:26.842Z',
          data: {
            type: { iv: 'News' },
            title: { iv: 'Title' },
            text: { iv: 'Text' },
          },
        });

      const result = await newsAndEvents.fetchById(id);

      const expectedResponse: NewsOrEventResponse = {
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
