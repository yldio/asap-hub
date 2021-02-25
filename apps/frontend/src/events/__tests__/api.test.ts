import nock from 'nock';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../config';
import { getEvent, getEvents } from '../api';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getEvents', () => {
  it('makes an authorized GET request for events', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({ take: '10', skip: '0', before: '123' })
      .reply(200, {});
    await getEvents({ before: '123' }, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched events for before query', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/events')
      .query({ take: '10', skip: '0', before: '123' })
      .reply(200, events);
    expect(await getEvents({ before: '123' }, '')).toEqual(events);
  });
  it('returns a successfully fetched events for after query', async () => {
    const group = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/events')
      .query({ take: '10', skip: '0', after: '456' })
      .reply(200, group);
    expect(await getEvents({ after: '456' }, '')).toEqual(group);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/events')
      .query({ take: '10', skip: '0', before: '123' })
      .reply(500);
    await expect(
      getEvents({ before: '123' }, ''),
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
