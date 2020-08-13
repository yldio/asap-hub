export interface TeamCreateRequest {
  displayName: string;
  applicationNumber: string;
  projectTitle: string;
  projectSummary?: string;
  proposalURL?: string;
  skills?: string[];
}

export interface TeamMember {
  id: string;
  displayName: string;
  role: string;
  avatarURL?: string;
}

export interface TeamResponse extends TeamCreateRequest {
  id: string;
  members: TeamMember[];
}
