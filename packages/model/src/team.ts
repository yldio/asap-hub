import { ListResponse } from './common';
import { ResearchOutputResponse } from './research-output';
import { Lab } from './lab';

export const teamRole = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Collaborating PI',
  'Project Manager',
  'Key Personnel',
] as const;

export type TeamRole = typeof teamRole[number];

export const isTeamRole = (data: string | null): data is TeamRole =>
  teamRole.includes(data as TeamRole);

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
  skills: string[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: TeamMember;
  tools?: TeamTool[];
  outputs: ResearchOutputResponse[];
  labCount: number;
}

export type ListTeamResponse = ListResponse<TeamResponse>;
