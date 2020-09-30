export interface CMSTeam {
  id: string;
  created: string;
  lastModified: string;
  data: {
    displayName: { iv: string };
    applicationNumber: { iv: string };
    projectTitle: { iv: string };
    projectSummary?: { iv: string };
    email?: { iv: string };
    proposal?: { iv: string[] };
    skills: {
      iv: string[];
    };
  };
}
