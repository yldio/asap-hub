export interface CMSTeam {
  id: string;
  created: string;
  lastModified: string;
  data: {
    displayName: { iv: string };
    applicationNumber: { iv: string };
    projectTitle: { iv: string };
    projectSummary?: { iv: string };
    proposalURL?: { iv: string };
    skills: {
      iv: string[];
    };
  };
}
