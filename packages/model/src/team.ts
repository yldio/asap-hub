export interface TeamMember {
  id: string;
  displayName: string;
  role: string;
}

export interface TeamResponse {
  id: string;
  displayName: string;
  applicationNumber: string;
  projectTitle: string;
  projectSummary: string;
  tags: string[];
  members: TeamMember[];
}
