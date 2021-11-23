import { createNewsResponse } from '@asap-hub/fixtures';
import { ListNewsResponse } from '@asap-hub/model';
import nock from 'nock';
import { GetListOptions } from '../../api-util';
import { API_BASE_URL } from '../../config';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { getNews, getNewsById } from '../api';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getNews', () => {
  it('makes an authorized GET request for news', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/news')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getNews(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched news', async () => {
    const news = {
      total: 1,
      items: [createNewsResponse(1)],
    } as ListNewsResponse;
    nock(API_BASE_URL)
      .get('/news')
      .query({ take: '10', skip: '0' })
      .reply(200, news);
    expect(await getNews(options, '')).toEqual(news);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/news').query({ take: '10', skip: '0' }).reply(500);
    await expect(
      getNews(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the news. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getNewsById', () => {
  it('makes an authorized GET request for the newsItem id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/news/42')
      .reply(200, {});
    await getNewsById('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched newsItem', async () => {
    const newsItem = createNewsResponse('42');
    nock(API_BASE_URL).get('/news/42').reply(200, newsItem);
    expect(await getNewsById('42', '')).toEqual(newsItem);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/news/42').reply(404);
    expect(await getNewsById('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/news/42').reply(500);
    await expect(
      getNewsById('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch news with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
