import { FetchOptions, ListResponse } from './common';
import { LabResponse } from './lab';
import { ManuscriptResponse } from './manuscript';
import { ResearchTagDataObject } from './research-tag';

export const teamRole = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Collaborating PI',
  'Project Manager',
  'Key Personnel',
  'Scientific Advisory Board',
  'ASAP Staff',
  'Trainee',
] as const;

export type TeamRole = (typeof teamRole)[number];

export type TeamTool = { name: string; description?: string; url: string };

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
  'id' | 'title' | 'versions'
>;

export type TeamSupplementGrant = {
  title: string;
  description?: string;
  proposalURL?: string;
  startDate?: string;
  endDate?: string;
};

export type TeamDataObject = Omit<TeamCreateRequest, 'applicationNumber'> & {
  id: string;
  tags: Pick<ResearchTagDataObject, 'id' | 'name'>[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: TeamMember;
  tools?: TeamTool[];
  manuscripts: TeamManuscript[];
  labCount: number;
  inactiveSince?: string;
  supplementGrant?: TeamSupplementGrant;
};

export type TeamCreateDataObject = {
  applicationNumber: string;
  displayName: string;
  inactiveSince?: string;
  researchOutputIds?: string[];
  projectSummary?: string;
  projectTitle: string;
  tools?: TeamTool[];
};

export type TeamResponse = TeamDataObject;

export type FetchTeamsOptions = FetchOptions;

export type TeamListItemDataObject = Pick<
  TeamDataObject,
  'id' | 'displayName' | 'inactiveSince' | 'projectTitle' | 'tags' | 'labCount'
> & { memberCount: number };

export type ListTeamDataObject = ListResponse<TeamListItemDataObject>;

export type TeamListItemResponse = TeamListItemDataObject;

export type ListTeamResponse = ListResponse<TeamListItemResponse>;
