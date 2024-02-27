import {
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';

export const getAnalyticsTeamLeadershipResponse =
  (): AnalyticsTeamLeadershipResponse => ({
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
  });

export const getListAnalyticsTeamLeadershipResponse =
  (): ListAnalyticsTeamLeadershipResponse => ({
    total: 1,
    items: [getAnalyticsTeamLeadershipResponse()],
  });
