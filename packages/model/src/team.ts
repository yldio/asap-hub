import { ListResponse } from './common';
import { Lab } from './lab';

export const teamRole = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Collaborating PI',
  'Project Manager',
  'Key Personnel',
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

export interface TeamPatchRequest {
  tools: TeamTool[];
}

export interface TeamMember {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
  labs?: Lab[];
}

export interface TeamResponse
  extends Omit<TeamCreateRequest, 'applicationNumber'> {
  id: string;
  expertiseAndResourceTags: string[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: TeamMember;
  tools?: TeamTool[];
  labCount: number;
  outputs?: { id: string }[];
}

export type ListTeamResponse = ListResponse<TeamResponse>;
