import nock from 'nock';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../../config';
import { getCalendars } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getCalendars', () => {
  it('makes an authorized GET request for calendars', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/calendars')
      .reply(200, {});
    await getCalendars('Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched calendars', async () => {
    const team = createListCalendarResponse();
    nock(API_BASE_URL).get('/calendars').reply(200, team);
    expect(await getCalendars('')).toEqual(team);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).get('/calendars').reply(500);
    await expect(getCalendars('')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch calendars. Expected status 2xx. Received status 500."`,
    );
  });
});
