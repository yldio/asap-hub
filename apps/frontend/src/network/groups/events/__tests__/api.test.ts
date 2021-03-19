import nock from 'nock';
import { createListEventResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '@asap-hub/frontend/src/config';
import { getGroupEvents } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getGroupEvents', () => {
  it('makes an authorized GET request for events before a date', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups/42/events')
      .query({ take: '10', skip: '0', before: '2021-01-01' })
      .reply(200, {});
    await getGroupEvents('42', { before: '2021-01-01' }, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });
  it('makes an authorized GET request for events after a date', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL)
      .get('/groups/42/events')
      .query({ take: '10', skip: '0', after: '2021-01-01' })
      .reply(200, events);
    await getGroupEvents('42', { after: '2021-01-01' }, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched events', async () => {
    const events = createListEventResponse(1);
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(200, events);
    expect(await getGroupEvents('42', { after: '2021-01-01' }, '')).toEqual(
      events,
    );
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(404);
    expect(await getGroupEvents('42', { before: '2021-01-01' }, '')).toBe(
      undefined,
    );
  });
  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/groups/42/events').query(true).reply(500);
    await expect(
      getGroupEvents('42', { after: '2021-01-01' }, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch events for group with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});
