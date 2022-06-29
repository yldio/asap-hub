import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvent, getEvents, getEventsFromAlgolia } from '../api';
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

describe('getEventsFromAlgolia', () => {
  const search: jest.MockedFunction<AlgoliaSearchClient['search']> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient;

  beforeEach(() => {
    search.mockReset();
  });

  it('makes request for events before a date', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEventsFromAlgolia(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), true),
    );

    expect(search).toBeCalledWith(['event'], '', {
      filters: 'endDateTimestamp < 1609498800',
      hitsPerPage: 10,
      page: 0,
    });
  });
  it('makes for events after a date', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEventsFromAlgolia(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), false),
    );
    expect(search).toBeCalledWith(['event'], '', {
      filters: 'endDateTimestamp > 1609498800',
      hitsPerPage: 10,
      page: 0,
    });
  });

  it('calls for upcoming events with a certain speaker user id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEventsFromAlgolia(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      constraint: { userId: 'user-1' },
    });
    expect(search).toBeCalledWith(['event'], '', {
      filters:
        '(endDateTimestamp > 1609498800) AND (speakers.user.id: "user-1")',
      hitsPerPage: 10,
      page: 0,
    });
  });

  it('calls for upcoming events with a certain speaker team id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEventsFromAlgolia(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      constraint: { teamId: 'team-1' },
    });
    expect(search).toBeCalledWith(['event'], '', {
      filters:
        '(endDateTimestamp > 1609498800) AND (speakers.team.id: "team-1")',
      hitsPerPage: 10,
      page: 0,
    });
  });

  it('returns successfully fetched events', async () => {
    const events = createListEventResponse(1);

    search.mockResolvedValueOnce(
      createAlgoliaResponse<'event'>(
        events.items.map((event) => ({
          ...event,
          objectID: event.id,
          __meta: {
            type: 'event',
          },
        })),
      ),
    );

    expect(
      await getEventsFromAlgolia(
        algoliaSearchClient,
        getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      ),
    ).toEqual({
      items: events.items.map((event) => ({
        ...event,
        objectID: event.id,
        __meta: {
          type: 'event',
        },
      })),
      total: 1,
    });
  });

  it('calls for upcoming events with a certain group id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEventsFromAlgolia(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), false),
      constraint: { groupId: 'group-5' },
    });
    expect(search).toBeCalledWith(['event'], '', {
      filters: '(endDateTimestamp > 1609498800) AND (group.id: "group-5")',
      hitsPerPage: 10,
      page: 0,
    });
  });
});
