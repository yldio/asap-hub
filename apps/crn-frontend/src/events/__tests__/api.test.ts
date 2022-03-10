import nock from 'nock';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../config';
import { getEvent, getEvents } from '../api';
import { getEventListOptions } from '../options';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getEvents', () => {
  it('makes an authorized GET request for events before a date', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        take: '10',
        skip: '0',
        before: new Date('2021-01-01T11:00:00').toISOString(),
        sortBy: 'endDate',
        sortOrder: 'desc',
      })
      .reply(200, {});
    await getEvents(
      getEventListOptions(new Date('2021-01-01T12:00:00'), true),
      'Bearer x',
    );
    expect(nock.isDone()).toBe(true);
  });
  it('makes an authorized GET request for events after a date', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/events')
      .query({
        take: '10',
        skip: '0',
        after: new Date('2021-01-01T11:00:00').toISOString(),
      })
      .reply(200, events);
    await getEvents(
      getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      'Bearer x',
    );
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched events', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/events')
      .query({
        take: '10',
        skip: '0',
        after: new Date('2021-01-01T11:00:00').toISOString(),
      })
      .reply(200, events);
    expect(
      await getEvents(
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
        '',
      ),
    ).toEqual(events);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/events')
      .query({
        take: '10',
        skip: '0',
        after: new Date('2021-01-01T11:00:00').toISOString(),
      })
      .reply(500);
    await expect(
      getEvents(
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
        '',
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch event list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getEvent', () => {
  it('makes an authorized GET request for the event id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events/42')
      .reply(200, {});
    await getEvent('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched event', async () => {
    const event = createEventResponse();
    nock(API_BASE_URL).get('/events/42').reply(200, event);
    expect(await getEvent('42', '')).toEqual(event);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/events/42').reply(404);
    expect(await getEvent('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/events/42').reply(500);
    await expect(getEvent('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch event with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
