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
  role: string;
  avatarURL?: string;
}

export interface TeamResponse extends TeamCreateRequest {
  id: string;
  skills: string[];
  members: TeamMember[];
  lastModifiedDate: string;
}
