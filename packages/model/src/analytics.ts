import { FetchPaginationOptions, ListResponse } from './common';
import { TeamResponse, TeamRole } from './team';

export type PerformanceMetrics = {
  belowAverageMin: number;
  belowAverageMax: number;
  averageMin: number;
  averageMax: number;
  aboveAverageMin: number;
  aboveAverageMax: number;
};

export type UserProductivityPerformance = {
  asapOutput: PerformanceMetrics;
  asapPublicOutput: PerformanceMetrics;
  ratio: PerformanceMetrics;
};

type PerformanceMetricByDocumentType = {
  article: PerformanceMetrics;
  bioinformatics: PerformanceMetrics;
  dataset: PerformanceMetrics;
  labResource: PerformanceMetrics;
  protocol: PerformanceMetrics;
};

export type TeamProductivityPerformance = PerformanceMetricByDocumentType;

export type TeamCollaborationPerformance = {
  withinTeam: PerformanceMetricByDocumentType;
  accrossTeam: PerformanceMetricByDocumentType;
};

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
export type AnalyticsTeamLeadershipAlgoliaResponse =
  AnalyticsTeamLeadershipDataObject & {
    objectID: string;
  };

export type ListAnalyticsTeamLeadershipResponse =
  ListResponse<AnalyticsTeamLeadershipResponse>;

export type SortUserProductivity =
  | 'user_asc'
  | 'user_desc'
  | 'team_asc'
  | 'team_desc'
  | 'role_asc'
  | 'role_desc'
  | 'asap_output_asc'
  | 'asap_output_desc'
  | 'asap_public_output_asc'
  | 'asap_public_output_desc'
  | 'ratio_asc'
  | 'ratio_desc';

export type SortTeamProductivity =
  | 'team_asc'
  | 'team_desc'
  | 'article_asc'
  | 'article_desc'
  | 'bioinformatics_asc'
  | 'bioinformatics_desc'
  | 'dataset_asc'
  | 'dataset_desc'
  | 'lab_resource_asc'
  | 'lab_resource_desc'
  | 'protocol_asc'
  | 'protocol_desc';

export type UserProductivityFields =
  | 'user'
  | 'team'
  | 'role'
  | 'asapOutput'
  | 'asapPublicOutput'
  | 'ratio';

export type TeamProductivityFields =
  | 'team'
  | 'article'
  | 'bioinformatics'
  | 'dataset'
  | 'labResource'
  | 'protocol';

export type TeamProductivitySortingDirection = {
  [key in TeamProductivityFields]: SortingDirection;
};

export type UserProductivitySortingDirection = {
  [key in UserProductivityFields]: SortingDirection;
};

export const userProductivityInitialSortingDirection = {
  user: ascending,
  team: ascending,
  role: ascending,
  asapOutput: descending,
  asapPublicOutput: descending,
  ratio: descending,
};

export const teamProductivityInitialSortingDirection = {
  team: ascending,
  article: descending,
  bioinformatics: descending,
  dataset: descending,
  labResource: descending,
  protocol: descending,
};

export type UserProductivityTeam = {
  team: string;
  id: string;
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

export const teamOutputDocumentTypes = [
  'Article',
  'Bioinformatics',
  'Dataset',
  'Lab Resource',
  'Protocol',
] as const;

export type TeamOutputDocumentType = (typeof teamOutputDocumentTypes)[number];

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
  id: string;
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
export type UserCollaborationAlgoliaResponse = UserCollaborationDataObject & {
  objectID: string;
};
export type ListUserCollaborationResponse =
  ListResponse<UserCollaborationResponse>;
export type ListUserCollaborationAlgoliaResponse =
  ListResponse<UserCollaborationAlgoliaResponse>;

export type TeamCollaborationWithinOutputData = {
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Resource': number;
  Protocol: number;
};
export type TeamCollaborationAcrossOutputData = {
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
export type ListTeamCollaborationDataObject =
  ListResponse<TeamCollaborationDataObject>;
export type TeamCollaborationResponse = TeamCollaborationDataObject;
export type TeamCollaborationAlgoliaResponse = TeamCollaborationDataObject & {
  objectID: string;
};
export type ListTeamCollaborationResponse =
  ListResponse<TeamCollaborationResponse>;
export type ListTeamCollaborationAlgoliaResponse =
  ListResponse<TeamCollaborationAlgoliaResponse>;
