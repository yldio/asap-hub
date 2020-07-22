export interface CMSTeam {
  id: string;
  data: {
    id: string;
    displayName: string;
    applicationNumber: string;
    projectTitle: string;
    projectSummary: string;
    tags: string[];
  };
}
