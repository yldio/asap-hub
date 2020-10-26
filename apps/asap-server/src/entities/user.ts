import Joi from '@hapi/joi';
import { OrcidWork, TeamMember, UserResponse, UserTeam } from '@asap-hub/model';
import { parseDate, createURL } from '../utils/squidex';
import { CMSGraphQLTeam } from './team';

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

interface CMSGraphQLUserTeamConnection {
  role: string;
  approach?: string;
  responsibilities?: string;
  id: CMSGraphQLTeam[];
}

export interface CMSGraphQLUser {
  id: string;
  lastModified: string;
  created: string;
  flatData: {
    avatar:
      | {
          id: string;
        }[]
      | null;
    displayName: string;
    email: string;
    firstName?: string;
    lastModifiedDate: string | null;
    lastName?: string;
    teams: CMSGraphQLUserTeamConnection[];
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

export const parseGraphQLUserTeamConnection = (
  item: CMSGraphQLUserTeamConnection,
): UserTeam => {
  const {
    id,
    flatData: { displayName, proposal },
  } = item.id[0];
  return {
    id,
    role: item.role,
    approach: item.approach,
    responsibilities: item.responsibilities,
    proposalURL: proposal ? proposal[0] : undefined,
    displayName,
  };
};

export const parseGraphQLUser = (item: CMSGraphQLUser): UserResponse => {
  const { avatar, teams, lastModifiedDate, ...flatData } = item.flatData;
  const createdDate = parseDate(item.created).toISOString();
  return {
    id: item.id,
    createdDate,
    questions: [],
    skills: [],
    ...flatData,
    lastModifiedDate: lastModifiedDate ?? createdDate,
    teams: teams.map(parseGraphQLUserTeamConnection),
    avatarUrl: avatar ? createURL(avatar.map((a) => a.id))[0] : undefined,
  };
};

export const parseUser = (user: CMSUser): UserResponse => {
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
