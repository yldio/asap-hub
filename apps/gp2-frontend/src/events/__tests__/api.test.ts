import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { ListEventResponse } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getEvent, getEvents } from '../api';

jest.mock('../../config');

describe('getEvent', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched event by id', async () => {
    const eventResponse = createEventResponse();
    const { id } = eventResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/events/${id}`)
      .reply(200, eventResponse);
    const result = await getEvent(id, 'Bearer x');
    expect(result).toEqual(eventResponse);
  });
  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/events/unknown-id`)
      .reply(404);
    const result = await getEvent('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/events/unknown-id`)
      .reply(500);

    await expect(
      getEvent('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch event with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getEvents', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  const options: GetEventListOptions = {
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    filters: new Set(),
    after: 'after',
  };

  it('returns a successfully fetched events', async () => {
    const eventsResponse: ListEventResponse = createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
      })
      .reply(500);

    await expect(
      getEvents('Bearer x', options),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Events. Expected status 2xx. Received status 500."`,
    );
  });
});
