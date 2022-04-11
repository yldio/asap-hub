import nock from 'nock';
import { createListEventResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '@asap-hub/crn-frontend/src/config';
import { getEventListOptions } from '@asap-hub/crn-frontend/src/events/options';
import { getGroupEvents } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getGroupEvents', () => {
  it('makes an authorized GET request for events before a date', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups/42/events')
      .query({
        take: '10',
        skip: '0',
        before: new Date('2021-01-01T11:00:00').toISOString(),
        sortBy: 'endDate',
        sortOrder: 'desc',
      })
      .reply(200, {});
    await getGroupEvents(
      '42',
      getEventListOptions(new Date('2021-01-01T12:00:00'), true),
      'Bearer x',
    );
    expect(nock.isDone()).toBe(true);
  });
  it('makes an authorized GET request for events after a date', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/groups/42/events')
      .query({
        take: '10',
        skip: '0',
        after: new Date('2021-01-01T11:00:00').toISOString(),
      })
      .reply(200, events);
    await getGroupEvents(
      '42',
      getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      'Bearer x',
    );
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched events', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(200, events);
    expect(
      await getGroupEvents(
        '42',
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
        '',
      ),
    ).toEqual(events);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(404);
    expect(
      await getGroupEvents(
        '42',
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
        '',
      ),
    ).toBe(undefined);
  });
  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(500);
    await expect(
      getGroupEvents(
        '42',
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
        '',
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch events for group with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});
