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

export type PerformanceMetricByDocumentType = {
  article: PerformanceMetrics;
  bioinformatics: PerformanceMetrics;
  dataset: PerformanceMetrics;
  labMaterial: PerformanceMetrics;
  protocol: PerformanceMetrics;
};

export type TeamProductivityPerformance = PerformanceMetricByDocumentType;

export type TeamCollaborationPerformance = {
  withinTeam: PerformanceMetricByDocumentType;
  acrossTeam: PerformanceMetricByDocumentType;
};

export type UserCollaborationPerformance = {
  withinTeam: PerformanceMetrics;
  acrossTeam: PerformanceMetrics;
};

export type EngagementPerformance = {
  events: PerformanceMetrics;
  totalSpeakers: PerformanceMetrics;
  uniqueAllRoles: PerformanceMetrics;
  uniqueKeyPersonnel: PerformanceMetrics;
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

export type SortOSChampion =
  | 'team_asc'
  | 'team_desc'
  | 'os_champion_awards_asc'
  | 'os_champion_awards_desc';

export type LeadershipAndMembershipFields =
  | 'team'
  | 'currentLeadership'
  | 'previousLeadership'
  | 'currentMembership'
  | 'previousMembership';

export type OSChampionFields = 'team' | 'osChampionAwards';

export type SortingDirection = 'asc' | 'desc';

export const ascending: SortingDirection = 'asc';
export const descending: SortingDirection = 'desc';

export const initialSortingDirection = {
  team: ascending,
  currentLeadership: descending,
  previousLeadership: descending,
  currentMembership: descending,
  previousMembership: descending,
  osChampionAwards: descending,
};

export const osChampionInitialSortingDirection = {
  team: ascending,
  osChampionAwards: descending,
};

export type LeadershipAndMembershipSortingDirection = {
  [key in LeadershipAndMembershipFields]: SortingDirection;
};

export type OSChampionSortingDirection = {
  [key in OSChampionFields]: SortingDirection;
};

export const timeRanges = [
  '30d',
  '90d',
  'current-year',
  'last-year',
  'all',
] as const;

export type MetricExportKeys =
  | 'user-productivity'
  | 'team-productivity'
  | 'user-collaboration-within'
  | 'user-collaboration-across'
  | 'team-collaboration-within'
  | 'team-collaboration-across'
  | 'wg-leadership'
  | 'ig-leadership'
  | 'engagement';

export const metricsExportMap: Record<MetricExportKeys, string> = {
  'user-productivity': 'User Productivity',
  'team-productivity': 'Team Productivity',
  'user-collaboration-within': 'User Co-Production: Within Team',
  'user-collaboration-across': 'User Co-Production: Across Teams',
  'team-collaboration-within': 'Team Co-Production: Within Team',
  'team-collaboration-across': 'Team Co-Production: Across Teams',
  'wg-leadership': 'Working Groups',
  'ig-leadership': 'Interest Groups',
  engagement: 'Speaker Diversity',
};

// Sheet names cannot exceed 31 chars
export const metricsSheetName: Record<MetricExportKeys, string> = {
  'user-productivity': 'User Productivity',
  'team-productivity': 'Team Productivity',
  'user-collaboration-within': 'User Co-Prod Within Team',
  'user-collaboration-across': 'User Co-Prod Across Teams',
  'team-collaboration-within': 'Team Co-Prod Within Team',
  'team-collaboration-across': 'Team Co-Prod Across Teams',
  'wg-leadership': 'Working Groups',
  'ig-leadership': 'Interest Groups',
  engagement: 'Speaker Diversity',
};

export const documentCategories = [
  'all',
  'article',
  'bioinformatics',
  'dataset',
  'lab-material',
  'protocol',
] as const;

export const outputTypes = ['public', 'all'] as const;

export type TimeRangeOption = (typeof timeRanges)[number];

export type TimeRangeOptionPreliminaryDataSharing = Extract<
  TimeRangeOption,
  'all' | 'last-year'
>;

export const timeRangeOptions: Record<TimeRangeOption, string> = {
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  'current-year': 'This year (Jan-Today)',
  'last-year': 'Last 12 months',
  all: 'Since Hub Launch (2020)',
};

export type DocumentCategoryOption = (typeof documentCategories)[number];
export type OutputTypeOption = (typeof outputTypes)[number];

export type FilterAnalyticsOptions = {
  timeRange?: TimeRangeOption;
  documentCategory?: DocumentCategoryOption;
  outputType?: OutputTypeOption;
};

export type FetchAnalyticsOptions = FetchPaginationOptions & {
  filter?: FilterAnalyticsOptions;
};

export type AnalyticsTeamLeadershipDataObject = Pick<
  TeamResponse,
  'id' | 'displayName' | 'inactiveSince'
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
  | 'lab_material_asc'
  | 'lab_material_desc'
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
  | 'labMaterial'
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
  labMaterial: descending,
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
  'Lab Material',
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
  'Lab Material': number;
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
  teamInactiveSince?: string;
  teamMembershipInactiveSince?: string;
  outputsCoAuthoredWithinTeam: number;
  outputsCoAuthoredAcrossTeams: number;
};
export type UserCollaborationDataObject = {
  id: string;
  alumniSince?: string;
  name: string;
  teams: UserCollaborationTeam[];
  totalUniqueOutputsCoAuthoredAcrossTeams: number;
  totalUniqueOutputsCoAuthoredWithinTeam: number;
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
  'Lab Material': number;
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
  inactiveSince?: string;
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

export type SortUserCollaboration =
  | 'user_asc'
  | 'user_desc'
  | 'team_asc'
  | 'team_desc'
  | 'role_asc'
  | 'role_desc'
  | 'outputs_coauthored_within_asc'
  | 'outputs_coauthored_across_asc'
  | 'outputs_coauthored_within_desc'
  | 'outputs_coauthored_across_desc';

export type SortTeamCollaboration =
  | 'team_asc'
  | 'team_desc'
  | 'article_asc'
  | 'article_desc'
  | 'bioinformatics_asc'
  | 'bioinformatics_desc'
  | 'dataset_asc'
  | 'dataset_desc'
  | 'lab_material_asc'
  | 'lab_material_desc'
  | 'protocol_asc'
  | 'protocol_desc'
  | 'article_across_asc'
  | 'article_across_desc'
  | 'bioinformatics_across_asc'
  | 'bioinformatics_across_desc'
  | 'dataset_across_asc'
  | 'dataset_across_desc'
  | 'lab_material_across_asc'
  | 'lab_material_across_desc'
  | 'protocol_across_asc'
  | 'protocol_across_desc';

export type UserCollaborationFields =
  | 'user'
  | 'team'
  | 'role'
  | 'outputsCoAuthored';

export type TeamCollaborationFields =
  | 'team'
  | 'article'
  | 'bioinformatics'
  | 'dataset'
  | 'labMaterial'
  | 'protocol';

export type SharingPrelimFindingsFields = 'team' | 'percentShared';

export type TeamCollaborationSortingDirection = {
  [key in TeamCollaborationFields]: SortingDirection;
};

export type UserCollaborationSortingDirection = {
  [key in UserCollaborationFields]: SortingDirection;
};

export type SharingPrelimFindingsSortingDirection = {
  [key in SharingPrelimFindingsFields]: SortingDirection;
};

export const userCollaborationInitialSortingDirection = {
  user: ascending,
  team: ascending,
  role: ascending,
  outputsCoAuthored: descending,
};

export const teamCollaborationInitialSortingDirection = {
  team: ascending,
  article: descending,
  bioinformatics: descending,
  dataset: descending,
  labMaterial: descending,
  protocol: descending,
};

export const sharingPrelimFindingsInitialSortingDirection = {
  team: ascending,
  percentShared: descending,
};

export type CollaborationType = 'across-teams' | 'within-team';

export type EngagementDataObject = {
  id: string;
  name: string;
  inactiveSince: string | null;
  memberCount: number;
  eventCount: number;
  totalSpeakerCount: number;
  uniqueAllRolesCount: number;
  uniqueAllRolesCountPercentage: number;
  uniqueKeyPersonnelCount: number;
  uniqueKeyPersonnelCountPercentage: number;
};
export type ListEngagementDataObject = ListResponse<EngagementDataObject>;
export type EngagementResponse = EngagementDataObject;
export type ListEngagementResponse = ListResponse<EngagementResponse>;
export type EngagementAlgoliaResponse = EngagementResponse & {
  objectID: string;
};
export type ListEngagementAlgoliaResponse =
  ListResponse<EngagementAlgoliaResponse>;

export type SortEngagement =
  | 'team_asc'
  | 'team_desc'
  | 'members_asc'
  | 'members_desc'
  | 'events_asc'
  | 'events_desc'
  | 'total_speakers_asc'
  | 'total_speakers_desc'
  | 'unique_speakers_all_roles_asc'
  | 'unique_speakers_all_roles_desc'
  | 'unique_speakers_all_roles_percentage_asc'
  | 'unique_speakers_all_roles_percentage_desc'
  | 'unique_speakers_key_personnel_asc'
  | 'unique_speakers_key_personnel_desc'
  | 'unique_speakers_key_personnel_percentage_asc'
  | 'unique_speakers_key_personnel_percentage_desc';

export type SortEngagementFields =
  | 'team'
  | 'members'
  | 'events'
  | 'totalSpeakers'
  | 'uniqueSpeakersAllRoles'
  | 'uniqueSpeakersAllRolesPercentage'
  | 'uniqueSpeakersKeyPersonnel'
  | 'uniqueSpeakersKeyPersonnelPercentage';

export type EngagementSortingDirection = {
  [key in SortEngagementFields]: SortingDirection;
};

export const engagementInitialSortingDirection = {
  team: ascending,
  members: descending,
  events: descending,
  totalSpeakers: descending,
  uniqueSpeakersAllRoles: descending,
  uniqueSpeakersAllRolesPercentage: descending,
  uniqueSpeakersKeyPersonnel: descending,
  uniqueSpeakersKeyPersonnelPercentage: descending,
};

export type Metric =
  | 'team-leadership'
  | 'team-productivity'
  | 'user-productivity'
  | 'team-collaboration'
  | 'user-collaboration'
  | 'engagement'
  | 'open-science';

export type AnalyticsSortOptions =
  | SortEngagement
  | SortLeadershipAndMembership
  | SortTeamCollaboration
  | SortTeamProductivity
  | SortUserCollaboration
  | SortUserProductivity;

export type OSChampionDataObject = {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  teamAwardsCount: number;
  timeRange: TimeRangeOption;
  users: {
    id: string;
    name: string;
    awardsCount: number;
  }[];
};
export type ListOSChampionDataObject = ListResponse<OSChampionDataObject>;
export type OSChampionResponse = OSChampionDataObject;
export type OSChampionOpensearchResponse = OSChampionResponse & {
  objectID: string;
};
export type ListOSChampionResponse = ListResponse<OSChampionResponse>;
export type ListOSChampionOpensearchResponse =
  ListResponse<OSChampionOpensearchResponse>;

export type PreliminaryDataSharingDataObject = {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  limitedData?: boolean;
  percentShared: number;
  timeRange: Extract<TimeRangeOption, 'all' | 'last-year'>;
};
export type ListPreliminaryDataSharingDataObject =
  ListResponse<PreliminaryDataSharingDataObject>;
export type PreliminaryDataSharingResponse = PreliminaryDataSharingDataObject;
export type ListPreliminaryDataSharingResponse =
  ListResponse<PreliminaryDataSharingResponse>;

export type SharingPrelimFindingsDataObject = {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  teamPercentShared: number;
};
export type ListSharingPrelimFindingsDataObject =
  ListResponse<SharingPrelimFindingsDataObject>;
export type SharingPrelimFindingsResponse = SharingPrelimFindingsDataObject;
export type ListSharingPrelimFindingsResponse =
  ListResponse<SharingPrelimFindingsResponse>;

export type SortSharingPrelimFindings =
  | 'team_asc'
  | 'team_desc'
  | 'percent_shared_asc'
  | 'percent_shared_desc';

export type MeetingRepAttendanceDataObject = {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  attendancePercentage: number;
  limitedData: boolean;
  timeRange: Extract<TimeRangeOption, 'all' | 'last-year'>;
};
export type ListMeetingRepAttendanceDataObject =
  ListResponse<MeetingRepAttendanceDataObject>;
export type MeetingRepAttendanceResponse = MeetingRepAttendanceDataObject;
export type ListMeetingRepAttendanceResponse =
  ListResponse<MeetingRepAttendanceResponse>;

export type SortMeetingRepAttendance =
  | 'team_asc'
  | 'team_desc'
  | 'attendance_percentage_asc'
  | 'attendance_percentage_desc';

export type MeetingRepAttendanceFields = 'team' | 'attendancePercentage';

export type MeetingRepAttendanceSortingDirection = {
  [key in MeetingRepAttendanceFields]: SortingDirection;
};

export const meetingRepAttendanceInitialSortingDirection = {
  team: ascending,
  attendancePercentage: descending,
};

export type EngagementType = 'presenters' | 'attendance';

export type SortPublicationCompliance =
  | 'team_asc'
  | 'team_desc'
  | 'publications_asc'
  | 'publications_desc'
  | 'datasets_asc'
  | 'datasets_desc'
  | 'protocols_asc'
  | 'protocols_desc'
  | 'code_asc'
  | 'code_desc'
  | 'lab_materials_asc'
  | 'lab_materials_desc';

export type PublicationComplianceSortingDirection = 'asc' | 'desc';

export interface PublicationComplianceResponse {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  publications: number;
  datasets: number;
  protocols: number;
  code: number;
  labMaterials: number;
}

export type SortPreprintCompliance =
  | 'team_asc'
  | 'preprints_asc'
  | 'posted_prior_asc';

export type PreprintComplianceSortingDirection = 'asc' | 'desc';

export interface PreprintComplianceResponse {
  teamId: string;
  teamName: string;
  isTeamInactive: boolean;
  numberOfPreprints: number;
  postedPriorToJournalSubmission: number;
  postedPriorPercentage: number;
}
