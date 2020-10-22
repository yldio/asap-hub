import { TeamResponse } from '@asap-hub/model';
import { parseDate } from '../utils/squidex';

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
    proposal?: string[];
    skills: string[];
  };
}

export const parseGraphQL = (item: CMSGraphQLTeam): TeamResponse => {
  return {
    id: item.id,
    createdDate: parseDate(item.created).toISOString(),
    members: [],
    ...item.flatData,
    proposal: item.flatData?.proposal[0]
  };
};
