import { ListResponse } from './common';

export interface TeamCreateRequest {
  displayName: string;
  applicationNumber: string;
  projectTitle: string;
  projectSummary?: string;
  proposalURL?: string;
}

export interface TeamMember {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  role: string;
  avatarURL?: string;
}

export interface TeamResponse extends TeamCreateRequest {
  id: string;
  skills: string[];
  members: TeamMember[];
  lastModifiedDate: string;
  pointOfContact?: string;
}

export type ListTeamResponse = ListResponse<TeamResponse>;
