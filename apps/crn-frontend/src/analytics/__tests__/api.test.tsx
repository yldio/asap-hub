import nock from 'nock';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import { getAnalyticsLeadership } from '../api';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: Pick<GetListOptions, 'currentPage' | 'pageSize'> = {
  pageSize: 10,
  currentPage: 0,
};

const teamLeadershipResponse: ListAnalyticsTeamLeadershipResponse = {
  items: [
    {
      id: '1',
      displayName: 'Team 1',
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    },
    {
      id: '2',
      displayName: 'Team 2',
      workingGroupLeadershipRoleCount: 2,
      workingGroupPreviousLeadershipRoleCount: 3,
      workingGroupMemberCount: 4,
      workingGroupPreviousMemberCount: 5,
      interestGroupLeadershipRoleCount: 4,
      interestGroupPreviousLeadershipRoleCount: 3,
      interestGroupMemberCount: 2,
      interestGroupPreviousMemberCount: 1,
    },
  ],
  total: 2,
};

describe('getMemberships', () => {
  it('makes an authorized GET request for analytics team-leadership section', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/analytics/team-leadership')
      .query({ take: '10', skip: '0' })
      .reply(200, {});

    await getAnalyticsLeadership(options, 'Bearer x');

    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched teams', async () => {
    nock(API_BASE_URL)
      .get('/analytics/team-leadership')
      .query({ take: '10', skip: '0' })
      .reply(200, teamLeadershipResponse);
    expect(await getAnalyticsLeadership(options, '')).toEqual(
      teamLeadershipResponse,
    );
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/analytics/team-leadership')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getAnalyticsLeadership(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch analytics team leadership list. Expected status 2xx. Received status 500."`,
    );
  });
});
