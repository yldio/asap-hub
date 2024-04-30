import { FetchPaginationOptions, ListResponse } from './common';
import { TeamResponse, TeamRole } from './team';

export type SortLeadershipAndMembership =
  | 'team_asc'
  | 'team_desc'
  | 'wg_current_leadership_asc'
  | 'wg_current_leadership_desc'
  | 'wg_previous_leadership_asc'
  | 'wg_previous_leadership_desc'
  | 'wg_current_membership_asc'
  | 'wg_current_membership_desc'
  | 'wg_previous_membership_asc'
  | 'wg_previous_membership_desc'
  | 'ig_current_leadership_asc'
  | 'ig_current_leadership_desc'
  | 'ig_previous_leadership_asc'
  | 'ig_previous_leadership_desc'
  | 'ig_current_membership_asc'
  | 'ig_current_membership_desc'
  | 'ig_previous_membership_asc'
  | 'ig_previous_membership_desc';

export type LeadershipAndMembershipFields =
  | 'team'
  | 'currentLeadership'
  | 'previousLeadership'
  | 'currentMembership'
  | 'previousMembership';

export type SortingDirection = 'asc' | 'desc';

const ascending: SortingDirection = 'asc';
const descending: SortingDirection = 'desc';

export const initialSortingDirection = {
  team: ascending,
  currentLeadership: descending,
  previousLeadership: descending,
  currentMembership: descending,
  previousMembership: descending,
};

export type LeadershipAndMembershipSortingDirection = {
  [key in LeadershipAndMembershipFields]: SortingDirection;
};

export type TimeRangeOption =
  | '30d'
  | '90d'
  | 'current-year'
  | 'last-year'
  | 'all';

export type FetchAnalyticsOptions = FetchPaginationOptions & {
  filter?: TimeRangeOption;
};

export type AnalyticsTeamLeadershipDataObject = Pick<
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
export type ListAnalyticsTeamLeadershipDataObject =
  ListResponse<AnalyticsTeamLeadershipDataObject>;

export type AnalyticsTeamLeadershipResponse = AnalyticsTeamLeadershipDataObject;
export type ListAnalyticsTeamLeadershipResponse =
  ListResponse<AnalyticsTeamLeadershipResponse>;

export type UserProductivityTeam = {
  team: string;
  role: TeamRole;
  isTeamInactive: boolean;
  isUserInactiveOnTeam: boolean;
};

export type UserProductivityDataObject = {
  id: string;
  name: string;
  isAlumni: boolean;
  teams: UserProductivityTeam[];
  asapOutput: number;
  asapPublicOutput: number;
  ratio: string;
};

export const teamProductivityDocumentTypes = [
  'Article',
  'Bioinformatics',
  'Dataset',
  'Lab Resource',
  'Protocol',
] as const;

export type TeamProductivityDocumentType =
  (typeof teamProductivityDocumentTypes)[number];

export type TeamProductivityDataObject = {
  id: string;
  name: string;
  isInactive: boolean;
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Resource': number;
  Protocol: number;
};

export type ListUserProductivityDataObject =
  ListResponse<UserProductivityDataObject>;
export type UserProductivityResponse = UserProductivityDataObject;
export type ListUserProductivityResponse =
  ListResponse<UserProductivityResponse>;

export type ListTeamProductivityDataObject =
  ListResponse<TeamProductivityDataObject>;
export type TeamProductivityResponse = TeamProductivityDataObject;
export type ListTeamProductivityResponse =
  ListResponse<TeamProductivityResponse>;

export type UserCollaborationTeam = {
  team: string;
  role: TeamRole;
  isTeamInactive: boolean;
  outputsCoAuthoredWithinTeam: number;
  outputsCoAuthoredAcrossTeams: number;
};
export type UserCollaborationDataObject = {
  id: string;
  isAlumni: boolean;
  name: string;
  teams: UserCollaborationTeam[];
};
export type UserCollaborationResponse = UserCollaborationDataObject;

type TeamCollaborationWithinOutputData = {
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Resource': number;
  Protocol: number;
};
type TeamCollaborationAcrossOutputData = {
  byDocumentType: TeamCollaborationWithinOutputData;
  byTeam: Array<
    {
      id: string;
      name: string;
      isInactive: boolean;
    } & TeamCollaborationWithinOutputData
  >;
};

export type TeamCollaborationDataObject = {
  id: string;
  name: string;
  isInactive: boolean;
  outputsCoProducedWithin: TeamCollaborationWithinOutputData;
  outputsCoProducedAcross: TeamCollaborationAcrossOutputData;
};

export type TeamCollaborationResponse = TeamCollaborationDataObject;
