import { FetchOptions, ListResponse } from './common';
import { LabResponse } from './lab';
import { ManuscriptResponse } from './manuscript';
import { ResearchTagDataObject } from './research-tag';

export const teamRole = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Project Manager',
  'Data Manager',
  'Collaborating PI',
  'Key Personnel',
  'Scientific Advisory Board',
  'ASAP Staff',
  'Trainee',
] as const;

const teamType = ['Discovery Team', 'Resource Team'] as const;

export type TeamRole = (typeof teamRole)[number];

export type TeamTool = { name: string; description?: string; url: string };

export type TeamType = (typeof teamType)[number];

export const teamStatus = ['Active', 'Inactive'] as const;

export type TeamStatus = (typeof teamStatus)[number];

export interface TeamCreateRequest {
  displayName: string;
  inactiveSince?: string;
  applicationNumber: string;
  projectTitle: string;
  projectSummary?: string;
  proposalURL?: string;
}

export type TeamUpdateDataObject = {
  tools: TeamTool[];
};

export type TeamPatchRequest = TeamUpdateDataObject;

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
  labs?: LabResponse[];
  alumniSinceDate?: string;
  inactiveSinceDate?: string;
}

export type TeamManuscript = Pick<
  ManuscriptResponse,
  | 'id'
  | 'title'
  | 'url'
  | 'versions'
  | 'status'
  | 'count'
  | 'teamId'
  | 'impact'
  | 'categories'
> & {
  grantId: string;
};

export type TeamSupplementGrant = {
  title: string;
  description?: string;
  proposalURL?: string;
  startDate?: string;
  endDate?: string;
};

export type TeamDataObject = Omit<TeamCreateRequest, 'applicationNumber'> & {
  id: string;
  teamId?: string;
  grantId?: string;
  teamType: TeamType;
  tags: Pick<ResearchTagDataObject, 'id' | 'name'>[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: TeamMember;
  tools?: TeamTool[];
  manuscripts: TeamManuscript[];
  collaborationManuscripts?: TeamManuscript[];
  labCount: number;
  inactiveSince?: string;
  teamStatus: TeamStatus;
  linkedProjectId?: string;
  supplementGrant?: TeamSupplementGrant;
  researchTheme?: string;
  resourceType?: string;
  teamDescription?: string;
};

export type TeamCreateDataObject = {
  applicationNumber: string;
  displayName: string;
  inactiveSince?: string;
  researchOutputIds?: string[];
  projectSummary?: string;
  projectTitle: string;
  tools?: TeamTool[];
  teamId: string;
  grantId: string;
  teamType: TeamType;
};

export type TeamResponse = TeamDataObject;

export type FetchTeamsOptions = FetchOptions & {
  teamType?: TeamType;
  teamIds?: string[];
};

export type TeamListItemDataObject = Pick<
  TeamDataObject,
  | 'id'
  | 'displayName'
  | 'inactiveSince'
  | 'teamStatus'
  | 'projectTitle'
  | 'linkedProjectId'
  | 'teamType'
  | 'tags'
  | 'labCount'
  | 'researchTheme'
> & { memberCount: number; resourceType?: string };

export type ListTeamDataObject = ListResponse<TeamListItemDataObject>;

export type TeamListItemResponse = TeamListItemDataObject;

export type ListTeamResponse = ListResponse<TeamListItemResponse>;

export type TeamLeader = Pick<TeamMember, 'id' | 'avatarUrl' | 'displayName'>;
export type PublicTeamMember = Pick<
  TeamMember,
  'id' | 'avatarUrl' | 'role' | 'firstName' | 'lastName' | 'displayName'
> & {
  status: string;
};

export type PublicTeamResponse = {
  id: string;
  name: string;
  status: string;
  tags: string[];
  title: string;
  projectSummary?: string;
  researchTheme?: string;
  members: PublicTeamMember[];
};

export type PublicTeamListItemDataObject = {
  id: string;
  name: string;
  researchTheme?: string;
  activeTeamMembers: string[];
  activeInterestGroups: string[];
  inactiveTeamMembers: string[];
  noOfTeamMembers: number;
  teamLeaders: TeamLeader[];
};

export type ListPublicTeamDataObject =
  ListResponse<PublicTeamListItemDataObject>;

export type PublicTeamListItemResponse = PublicTeamListItemDataObject;

export type ListPublicTeamResponse = ListResponse<PublicTeamListItemResponse>;
