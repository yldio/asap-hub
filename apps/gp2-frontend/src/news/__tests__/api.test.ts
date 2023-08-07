import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getNewsById, getNews } from '../api';

jest.mock('../../config');

beforeEach(() => nock.cleanAll());
describe('getNewsById', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  it('returns a news item by id', async () => {
    const newsResponse = gp2Fixtures.createNewsResponse();
    const { items } = newsResponse;
    const item = items[0] as gp2Model.NewsDataObject;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/news/${item.id}`)
      .reply(200, item);
    const result = await getNewsById(item.id, 'Bearer x');
    expect(result).toEqual(item);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/news/unknown-id`)
      .reply(404);
    const result = await getNewsById('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/news/unknown-id`)
      .reply(500);

    await expect(
      getNewsById('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch news with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getNews', () => {
  const options: GetListOptions = {
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    filters: new Set(),
  };

  it('makes an authorized GET request for news', async () => {
    const news = gp2Fixtures.createListNewsResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/news')
      .query({ take: '10', skip: '10' })
      .reply(200, news);
    expect(await getNews(options, 'Bearer x')).toEqual(news);
  });

  it('returns successfully fetched news', async () => {
    const news = gp2Fixtures.createListNewsResponse();

    nock(API_BASE_URL)
      .get('/news')
      .query({ take: '10', skip: '10' })
      .reply(200, news);
    expect(await getNews(options, '')).toEqual(news);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/news')
      .query({ take: '10', skip: '10' })
      .reply(500);
    await expect(
      getNews(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the news. Expected status 2xx. Received status 500."`,
    );
  });
});
