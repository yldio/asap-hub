import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getDashboard, getReminders } from '../api';

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

describe('getReminders', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched reminder response', async () => {
    const reminderResponse: ListReminderResponse = {
      items: [
        {
          description: 'description',
          entity: 'Event',
          id: 'id',
          href: 'http://example.com',
        },
      ],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/reminders')
      .reply(200, reminderResponse);

    const result = await getReminders('Bearer x');
    expect(result).toEqual(reminderResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/reminders')
      .reply(500);

    await expect(
      getReminders('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch reminders. Expected status 2xx. Received status 500."`,
    );
  });
});
