import { ListResponse } from './common';
import { TeamResponse } from './team';

export type AnalyticsTeamLeadershipResponse = Pick<
  TeamResponse,
  'id' | 'displayName'
> & {
  // Working Groups
  workingGroupLeadershipRoleCount: number;
  workingGroupPreviousLeadershipRoleCount: number;
  workingGroupMemberCount: number;
  workingGroupPreviousMemberCount: number;

  // Interest Groups
  interestGroupLeadershipRoleCount: number;
  interestGroupPreviousLeadershipRoleCount: number;
  interestGroupMemberCount: number;
  interestGroupPreviousMemberCount: number;
};
export type ListAnalyticsTeamLeadershipResponse =
  ListResponse<AnalyticsTeamLeadershipResponse>;
