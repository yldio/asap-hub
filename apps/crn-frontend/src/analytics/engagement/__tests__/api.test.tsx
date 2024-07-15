import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListEngagementResponse } from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../../config';
import { getEngagement } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: Pick<GetListOptions, 'currentPage' | 'pageSize'> = {
  pageSize: 10,
  currentPage: 0,
};

const listEngagementResponse: ListEngagementResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test Team',
      inactiveSince: null,
      memberCount: 5,
      eventCount: 2,
      totalSpeakerCount: 3,
      uniqueAllRolesCount: 2,
      uniqueKeyPersonnelCount: 1,
    },
  ],
};

describe('getEngagement', () => {
  it('makes an authorized GET request for analytics engagement section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/engagement')
      .query({ take: '10', skip: '0' })
      .reply(200, {});

    await getEngagement(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched engagement', async () => {
    nock(API_BASE_URL)
      .get('/analytics/engagement')
      .query({ take: '10', skip: '0' })
      .reply(200, listEngagementResponse);
    expect(await getEngagement(options, '')).toEqual(listEngagementResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/engagement')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getEngagement(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics engagement. Expected status 2xx. Received status 500."`,
    );
  });
});
