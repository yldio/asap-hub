export interface CMSTeam {
  id: string;
  data: {
    displayName: { iv: string };
    applicationNumber: { iv: string };
    projectTitle: { iv: string };
    projectSummary: { iv: string };
    tags: {
      iv: string[];
    };
  };
}
