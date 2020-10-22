import Joi from '@hapi/joi';
import { OrcidWork, TeamMember, UserResponse } from '@asap-hub/model';
import { parseDate, createURL } from '../utils/squidex';

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
    skillsDescription?: { iv: string };
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
    avatar: {
      id: string;
    }[];
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
  const { avatar, ...flatData } = item.flatData;
  return {
    id: item.id,
    createdDate: parseDate(item.created).toISOString(),
    questions: [],
    teams: [],
    skills: [],
    ...flatData,
    avatarUrl: avatar && createURL(avatar.map((a) => a.id))[0],
  };
};

export const transform = (user: CMSUser): UserResponse => {
  return JSON.parse(
    JSON.stringify({
      id: user.id,
      createdDate: user.created,
      lastModifiedDate: user.data.lastModifiedDate?.iv ?? user.created,
      displayName: user.data.displayName.iv,
      email: user.data.email.iv,
      degree: user.data.degree?.iv,
      firstName: user.data.firstName?.iv,
      lastName: user.data.lastName?.iv,
      biography: user.data.biography?.iv,
      jobTitle: user.data.jobTitle?.iv,
      institution: user.data.institution?.iv,
      teams:
        user.data.teams?.iv.map(({ id, ...t }) => ({ id: id[0], ...t })) || [],
      location: user.data.location?.iv,
      orcid: user.data.orcid?.iv,
      orcidLastSyncDate: user.data.orcidLastSyncDate?.iv,
      orcidLastModifiedDate: user.data.orcidLastModifiedDate?.iv,
      orcidWorks: user.data.orcidWorks?.iv,
      skills: user.data.skills?.iv || [],
      questions: user.data.questions?.iv.map(({ question }) => question) || [],
      avatarURL: user.data.avatar && createURL(user.data.avatar.iv)[0],
    }),
  );
};
