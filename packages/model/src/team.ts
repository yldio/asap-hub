import { FetchOptions, ListResponse } from './common';
import { LabResponse } from './lab';

export const teamRole = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Collaborating PI',
  'Project Manager',
  'Key Personnel',
  'Scientific Advisory Board',
  'ASAP Staff',
] as const;

export type TeamRole = typeof teamRole[number];

export type TeamTool = { name: string; description?: string; url: string };

export interface TeamCreateRequest {
  displayName: string;
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
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
  labs?: LabResponse[];
}

export type TeamDataObject = Omit<TeamCreateRequest, 'applicationNumber'> & {
  id: string;
  expertiseAndResourceTags: string[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: TeamMember;
  tools?: TeamTool[];
  labCount: number;
  outputs?: string[];
};

export type TeamCreateDataObject = {
  applicationNumber: string;
  displayName: string;
  expertiseAndResourceTags: string[];
  researchOutputIds?: string[];
  projectSummary?: string;
  projectTitle: string;
  tools?: TeamTool[];
};

export type ListTeamDataObject = ListResponse<TeamDataObject>;

export type TeamResponse = TeamDataObject;

export type ListTeamResponse = ListResponse<TeamResponse>;

export type FetchTeamsOptions = {
  // select team IDs of which tools should be returned
  // leave undefined to return all teams' tools
  showTeamTools?: string[];
} & Omit<FetchOptions, 'filter'>;
