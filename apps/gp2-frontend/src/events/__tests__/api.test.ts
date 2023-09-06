import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { PAGE_SIZE } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import {
  EventListOptions,
  getAlgoliaEvents,
  getEvent,
  getEvents,
} from '../api';

jest.mock('../../config');

describe('getEvent', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched event by id', async () => {
    const eventResponse = gp2Fixtures.createEventResponse();
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

describe('getAlgoliaEvents', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;
  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest
      .fn()
      .mockResolvedValue(createEventListAlgoliaResponse(10));
  });
  const options: EventListOptions = {
    filters: new Set<string>(),
    after: new Date('1-1-2020').toDateString(),
    before: undefined,
    pageSize: PAGE_SIZE,
    currentPage: 0,
    searchQuery: '',
  };

  it('makes a search request with query, default page and page size', async () => {
    await getAlgoliaEvents(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['event'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });

  it('passes page number and page size to request', async () => {
    await getAlgoliaEvents(mockAlgoliaSearchClient, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['event'],
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });

  it('builds a single status filter query', async () => {
    await getAlgoliaEvents(mockAlgoliaSearchClient, {
      ...options,
      eventType: ['GP2 Hub'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['event'],
      '',
      expect.objectContaining({
        filters: 'endDateTimestamp > 1577836800 AND _tags:"GP2 Hub"',
      }),
    );
  });

  it('builds a multiple status filter query', async () => {
    await getAlgoliaEvents(mockAlgoliaSearchClient, {
      ...options,
      eventType: ['GP2 Hub', 'Projects'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['event'],
      '',
      expect.objectContaining({
        filters:
          'endDateTimestamp > 1577836800 AND _tags:"GP2 Hub" OR _tags:"Projects"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getAlgoliaEvents(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});

describe('getEvents', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });
  it('returns a successfully fetched events with after parameter', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      after: 'after',
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
        skip: 10,
        take: 10,
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });
  it('returns a successfully fetched events with before parameter', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      before: 'before',
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        before: 'before',
        sortBy: 'endDate',
        sortOrder: 'desc',
        skip: 10,
        take: 10,
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });
  it('returns a successfully fetched events with working group parameter', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      after: 'after',
      constraint: {
        workingGroupId: '42',
      },
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
        filter: { workingGroupId: '42' },
        skip: 10,
        take: 10,
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });
  it('returns a successfully fetched events with project parameter', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      after: 'after',
      constraint: {
        projectId: '42',
      },
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
        filter: { projectId: '42' },
        skip: 10,
        take: 10,
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });
  it('returns a successfully fetched events with user parameter', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      after: 'after',
      constraint: {
        userId: '42',
      },
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
        filter: { userId: '42' },
        skip: 10,
        take: 10,
      })
      .reply(200, eventsResponse);

    const result = await getEvents('Bearer x', options);
    expect(result).toEqual(eventsResponse);
  });

  it('errors for error status', async () => {
    const options: GetEventListOptions<gp2Model.EventConstraint> = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
      after: 'after',
    };

    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        after: 'after',
        skip: 10,
        take: 10,
      })
      .reply(500);

    await expect(
      getEvents('Bearer x', options),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Events. Expected status 2xx. Received status 500."`,
    );
  });
});
