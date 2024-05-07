import { FetchPaginationOptions, ListResponse } from './common';
import { TeamResponse, TeamRole } from './team';

export const timeRanges = [
  '30d',
  '90d',
  'current-year',
  'last-year',
  'all',
] as const;

export type TimeRangeOption = (typeof timeRanges)[number];

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
export type UserProductivityAlgoliaResponse = UserProductivityDataObject & {
  objectID: string;
};
export type ListUserProductivityResponse =
  ListResponse<UserProductivityResponse>;
export type ListUserProductivityAlgoliaResponse =
  ListResponse<UserProductivityAlgoliaResponse>;

export type ListTeamProductivityDataObject =
  ListResponse<TeamProductivityDataObject>;
export type TeamProductivityResponse = TeamProductivityDataObject;
export type TeamProductivityAlgoliaResponse = TeamProductivityDataObject & {
  objectID: string;
};
export type ListTeamProductivityResponse =
  ListResponse<TeamProductivityResponse>;
export type ListTeamProductivityAlgoliaResponse =
  ListResponse<TeamProductivityAlgoliaResponse>;

export type UserCollaborationTeam = {
  team: string;
  role?: TeamRole;
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
export type ListUserCollaborationDataObject =
  ListResponse<UserCollaborationDataObject>;
export type UserCollaborationResponse = UserCollaborationDataObject;
export type ListUserCollaborationResponse =
  ListResponse<UserCollaborationDataObject>;

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
