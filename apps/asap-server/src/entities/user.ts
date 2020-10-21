import Joi from '@hapi/joi';
import { OrcidWork, TeamMember, UserResponse } from '@asap-hub/model';
import { parseDate } from '../utils/squidex';

interface CMSTeamMember extends Omit<TeamMember, 'id' | 'email'> {
  id: string[];
}

export interface CMSUser {
  id: string;
  lastModified: string;
  created: string;
  data: {
    lastModifiedDate: { iv: string };
    displayName: { iv: string };
    email: { iv: string };
    firstName?: { iv: string };
    lastName?: { iv: string };
    jobTitle?: { iv: string };
    degree?: { iv: 'BA' | 'BSc' | 'MSc' | 'PhD' | 'MD' | 'PhD, MD' };
    institution?: { iv: string };
    connections: { iv: { code: string }[] };
    biography?: { iv: string };
    location?: { iv: string };
    teams?: { iv: CMSTeamMember[] };
    orcid?: { iv: string };
    orcidLastModifiedDate?: { iv: string };
    orcidLastSyncDate?: { iv: string };
    orcidWorks?: { iv: CMSOrcidWork[] };
    skills?: { iv: string[] };
    questions?: {
      iv: {
        question: string;
      }[];
    };
    avatar?: { iv: string[] };
  };
}

export interface CMSGraphQLUser {
  id: string;
  lastModified: string;
  created: string;
  flatData: {
    displayName: string;
    email: string;
    firstName?: string;
    lastModifiedDate: string;
    lastName?: string;
  };
}

export type CMSOrcidWork = OrcidWork;
export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  title: Joi.string(),
  orcid: Joi.string(),
  biography: Joi.string(),
  institution: Joi.string(),
  connections: Joi.string(),
});

export const parseGraphQL = (item: CMSGraphQLUser): UserResponse => {
  return {
    id: item.id,
    createdDate: parseDate(item.created).toISOString(),
    questions: [],
    teams: [],
    skills: [],
    ...item.flatData,
  };
};
