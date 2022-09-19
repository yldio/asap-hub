import { AlgoliaSearchClient } from '@asap-hub/algolia';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvent, getEvents, getSquidexUrl } from '../api';
import { GetEventListOptions, getEventListOptions } from '../options';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
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

describe('getEvents', () => {
  const search: jest.MockedFunction<AlgoliaSearchClient['search']> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient;

  beforeEach(() => {
    search.mockReset();
  });

  it('makes request for events before a date', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), { past: true }),
    );

    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters: 'endDateTimestamp < 1609498800',
        hitsPerPage: 10,
        page: 0,
      },
      true,
    );
  });

  it('makes request for events before a date filtering cancelled ones', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), {
        past: true,
        constraint: { notStatus: 'Cancelled' },
      }),
    );

    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters: '(endDateTimestamp < 1609498800) AND (NOT status:Cancelled)',
        hitsPerPage: 10,
        page: 0,
      },
      true,
    );
  });
  it('makes for events after a date', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
    );
    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters: 'endDateTimestamp > 1609498800',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
  });

  it('calls for upcoming events with a certain speaker user id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { userId: 'user-1' },
    });
    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters:
          '(endDateTimestamp > 1609498800) AND (speakers.user.id: "user-1")',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
  });

  it('calls for past events with a certain speaker user id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00Z'), { past: true }),
      constraint: { userId: 'user-1' },
    });
    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters:
          '(endDateTimestamp < 1609498800) AND (speakers.user.id: "user-1")',
        hitsPerPage: 10,
        page: 0,
      },
      true,
    );
  });

  it('calls for upcoming events with a certain speaker team id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { teamId: 'team-1' },
    });
    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters:
          '(endDateTimestamp > 1609498800) AND (speakers.team.id: "team-1")',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
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
      await getEvents(
        algoliaSearchClient,
        getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
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

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { groupId: 'group-5' },
    });
    expect(search).toBeCalledWith(
      ['event'],
      '',
      {
        filters: '(endDateTimestamp > 1609498800) AND (group.id: "group-5")',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
  });
});

describe('getSquidexUrl', () => {
  const options: GetEventListOptions = {
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    filters: new Set(),
    after: new Date('2021-01-01T12:00:00').toString(),
  };

  it('returns the user or team url', () => {
    options.constraint = { teamId: 'team-1' };
    expect(getSquidexUrl(options).toString()).toEqual(
      'http://api/events?take=10&skip=10',
    );
  });

  it('returns the group url if the constraint contains group id', () => {
    options.constraint = { groupId: 'group-1' };
    expect(getSquidexUrl(options).toString()).toEqual(
      'http://api/groups/group-1/events?take=10&skip=10',
    );
  });
});
