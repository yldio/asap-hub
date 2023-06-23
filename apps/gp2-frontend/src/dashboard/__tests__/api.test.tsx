import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getDashboardStats, getNews } from '../api';

jest.mock('../../config');

describe('getNews', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  it('returns a successfully fetched news', async () => {
    const newsResponse: gp2Model.ListNewsResponse =
      gp2Fixtures.createNewsResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/news')
      .reply(200, newsResponse);

    const result = await getNews('Bearer x');
    expect(result).toEqual(newsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/news')
      .reply(500);

    await expect(
      getNews('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the News. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getDashboardStats', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  it('returns a successfully fetched dashboard stats', async () => {
    const dashboardResponse: gp2Model.ListDashboardResponse =
      gp2Fixtures.createDashboardStatsResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/dashboard')
      .reply(200, dashboardResponse);

    const result = await getDashboardStats('Bearer x');
    expect(result).toEqual(dashboardResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/dashboard')
      .reply(500);

    await expect(
      getDashboardStats('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Dashboard Stats. Expected status 2xx. Received status 500."`,
    );
  });
});
