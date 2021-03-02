import nock from 'nock';
import {
  createListGroupResponse,
  createGroupResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../../config';
import { getGroups, getGroup, getGroupEvents } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getGroups', () => {
  it('makes an authorized GET request for groups', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getGroups({}, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched groups', async () => {
    const groups = createListGroupResponse(1);
    nock(API_BASE_URL)
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(200, groups);
    expect(await getGroups({}, '')).toEqual(groups);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(getGroups({}, '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getGroup', () => {
  it('makes an authorized GET request for the group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups/42')
      .reply(200, {});
    await getGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched group', async () => {
    const group = createGroupResponse();
    nock(API_BASE_URL).get('/groups/42').reply(200, group);
    expect(await getGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/groups/42').reply(404);
    expect(await getGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/groups/42').reply(500);
    await expect(getGroup('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
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
    nock(API_BASE_URL)
      .get('/groups/42/events')
      .query({ take: '10', skip: '0', after: '2021-01-01' })
      .reply(200, events);
    expect(await getGroupEvents('42', { after: '2021-01-01' }, '')).toEqual(
      events,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/groups/42/events')
      .query({ take: '10', skip: '0', after: '2021-01-01' })
      .reply(500);
    await expect(
      getGroupEvents('42', { after: '2021-01-01' }, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch events for group with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});
