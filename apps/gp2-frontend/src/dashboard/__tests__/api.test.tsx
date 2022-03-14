import { DashboardResponse } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getDashboard } from '../api';

jest.mock('../../config');

describe('getDashboard', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched dashboard', async () => {
    const dashboardResponse: DashboardResponse = {
      news: [
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb6',
          created: '2020-09-07T17:36:54Z',
          title: 'News Title',
          type: 'News',
        },
      ],
      pages: [],
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/dashboard')
      .reply(200, dashboardResponse);

    const result = await getDashboard('Bearer x');
    expect(result).toEqual(dashboardResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/dashboard')
      .reply(500);

    await expect(
      getDashboard('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the dashboard. Expected status 2xx. Received status 500."`,
    );
  });
});
