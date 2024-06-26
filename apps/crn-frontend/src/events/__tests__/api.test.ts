import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  ClientSearch,
} from '@asap-hub/algolia';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getEvent, getEvents } from '../api';

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
  type Search = ClientSearch<'crn', 'event'>;
  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'crn'>;

  beforeEach(() => {
    search.mockReset();
  });

  it('makes request for events before a date', async () => {
    const res = createAlgoliaResponse<'crn', 'event'>([]);
    search.mockResolvedValueOnce(res);

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), { past: true }),
    );

    expect(search).toHaveBeenCalledWith(
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
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), {
        past: true,
        constraint: { notStatus: 'Cancelled' },
      }),
    );

    expect(search).toHaveBeenCalledWith(
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
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(
      algoliaSearchClient,
      getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
    );
    expect(search).toHaveBeenCalledWith(
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
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { userId: 'user-1' },
    });
    expect(search).toHaveBeenCalledWith(
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
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00Z'), { past: true }),
      constraint: { userId: 'user-1' },
    });
    expect(search).toHaveBeenCalledWith(
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
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { teamId: 'team-1' },
    });
    expect(search).toHaveBeenCalledWith(
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
      createAlgoliaResponse<'crn', 'event'>(
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

  it('calls for upcoming events with a certain interest group id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { interestGroupId: 'group-5' },
    });
    expect(search).toHaveBeenCalledWith(
      ['event'],
      '',
      {
        filters:
          '(endDateTimestamp > 1609498800) AND (interestGroup.id: "group-5")',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
  });

  it('calls for upcoming events with a certain working group id', async () => {
    search.mockResolvedValueOnce(createAlgoliaResponse<'crn', 'event'>([]));

    await getEvents(algoliaSearchClient, {
      ...getEventListOptions(new Date('2021-01-01T12:00:00'), { past: false }),
      constraint: { workingGroupId: 'wg-1' },
    });
    expect(search).toHaveBeenCalledWith(
      ['event'],
      '',
      {
        filters:
          '(endDateTimestamp > 1609498800) AND (workingGroup.id: "wg-1")',
        hitsPerPage: 10,
        page: 0,
      },
      false,
    );
  });
});
