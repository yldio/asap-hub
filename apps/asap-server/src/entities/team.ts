export interface CMSTeam {
  id: string;
  created: string;
  lastModified: string;
  data: {
    displayName: { iv: string };
    applicationNumber: { iv: string };
    projectTitle: { iv: string };
    projectSummary?: { iv: string };
    proposal?: { iv: string[] };
    skills: {
      iv: string[];
    };
  };
}

export interface CMSGraphQLTeam {
  id: string;
  created: string;
  lastModified: string;
  flatData: {
    displayName: string;
    applicationNumber: string;
    projectTitle: string;
    projectSummary?: string;
    proposal?: string[] | null;
    skills: string[];
  };
}
