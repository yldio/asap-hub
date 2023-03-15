import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
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
      sort: { sortBy: 'endDate', sortOrder: 'desc' },
    };

    const eventsResponse: gp2Model.ListEventResponse =
      gp2Fixtures.createListEventResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/events')
      .query({
        before: 'before',
        sortBy: 'endDate',
        sortOrder: 'desc',
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
      })
      .reply(500);

    await expect(
      getEvents('Bearer x', options),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Events. Expected status 2xx. Received status 500."`,
    );
  });
});
