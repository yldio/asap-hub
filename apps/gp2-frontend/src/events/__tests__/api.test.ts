import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { PAGE_SIZE } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { EventListOptions, getEvent, getEvents } from '../api';

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
    await getEvents(mockAlgoliaSearchClient, {
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
    await getEvents(mockAlgoliaSearchClient, {
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
    await getEvents(mockAlgoliaSearchClient, {
      ...options,
      eventType: ['GP2 Hub'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['event'],
      '',
      expect.objectContaining({
        filters: 'endDateTimestamp > 1577836800 AND eventTypes:"GP2 Hub"',
      }),
    );
  });

  it('builds a multiple status filter query', async () => {
    await getEvents(mockAlgoliaSearchClient, {
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
          'endDateTimestamp > 1577836800 AND eventTypes:"GP2 Hub" OR eventTypes:"Projects"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getEvents(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});
