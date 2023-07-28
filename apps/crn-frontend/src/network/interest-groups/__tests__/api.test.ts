import nock from 'nock';
import {
  createListInterestGroupResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';

import { API_BASE_URL } from '../../../config';
import { getInterestGroups, getInterestGroup } from '../api';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getGroups', () => {
  it('makes an authorized GET request for groups', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/interest-groups')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getInterestGroups(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched groups', async () => {
    const groups = createListInterestGroupResponse(1);
    nock(API_BASE_URL)
      .get('/interest-groups')
      .query({ take: '10', skip: '0' })
      .reply(200, groups);
    expect(await getInterestGroups(options, '')).toEqual(groups);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/interest-groups')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getInterestGroups(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getGroup', () => {
  it('makes an authorized GET request for the group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/interest-groups/42')
      .reply(200, {});
    await getInterestGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched group', async () => {
    const group = createInterestGroupResponse();
    nock(API_BASE_URL).get('/interest-groups/42').reply(200, group);
    expect(await getInterestGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/interest-groups/42').reply(404);
    expect(await getInterestGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/interest-groups/42').reply(500);
    await expect(
      getInterestGroup('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
