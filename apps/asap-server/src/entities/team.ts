export interface CMSGraphQLTeam {
  id: string;
  created: string;
  lastModified: string;
  flatData: {
    displayName: string;
    applicationNumber: string;
    projectTitle: string;
    projectSummary?: string;
    proposal?: { id: string }[] | null;
    skills: string[];
  };
}
