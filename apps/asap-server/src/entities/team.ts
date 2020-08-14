export interface CMSTeam {
  id: string;
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
