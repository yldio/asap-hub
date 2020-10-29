import Joi from '@hapi/joi';
import {
  OrcidWork,
  UserResponse,
  UserTeam,
  TeamRole,
  TeamMember,
} from '@asap-hub/model';
import { GraphqlUser } from '@asap-hub/squidex';
import { parseDate, createURL } from '../utils/squidex';

interface CMSTeamMember
  extends Omit<TeamMember, 'id' | 'email' | 'displayName'> {
  id: string[];
  role: TeamRole;
  responsibilities?: string;
  approach?: string;
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
    role: {
      iv: 'Staff' | 'Grantee' | 'Guest' | 'Hidden';
    };
    responsibilities?: {
      iv: string;
    };
    reachOut?: {
      iv: string;
    };
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

export const parseGraphqlUserTeamConnection = (
  item: NonNullable<NonNullable<GraphqlUser['flatData']>['teams']>[0],
): UserTeam => {
  const team = item.id[0];
  const displayName = team.flatData?.displayName;
  const proposal = team.flatData?.proposal;

  return {
    id: team.id,
    role: item.role,
    approach: item.approach,
    responsibilities: item.responsibilities,
    proposal: proposal?.length ? proposal[0].id : undefined,
    displayName: displayName || '',
  };
};

export const parseGraphQLUser = (item: GraphqlUser): UserResponse => {
  const flatTeams: NonNullable<GraphqlUser['flatData']>['teams'] =
    item.flatData?.teams || [];
  const flatAvatar: NonNullable<GraphqlUser['flatData']>['avatar'] =
    item.flatData?.avatar || [];
  const flatQuestions = item.flatData?.questions || [];
  const flatSkills = item.flatData?.skills || [];
  const createdDate = parseDate(item.created).toISOString();

  const role = ['Guest', 'Staff', 'Grantee'].includes(item.flatData?.role || '')
    ? (item.flatData?.role as 'Guest' | 'Staff' | 'Grantee')
    : 'Guest';
  const teams: UserTeam[] = (flatTeams || []).map(
    parseGraphqlUserTeamConnection,
  );
  return {
    id: item.id,
    createdDate,
    firstName: item.flatData?.firstName || undefined,
    biography: item.flatData?.biography || undefined,
    degree: item.flatData?.degree || undefined,
    displayName: item.flatData?.displayName || '',
    email: item.flatData?.email || '',
    institution: item.flatData?.institution || undefined,
    jobTitle: item.flatData?.jobTitle || undefined,
    lastName: item.flatData?.lastName || undefined,
    location: item.flatData?.location || undefined,
    orcid: item.flatData?.orcid || undefined,
    questions: flatQuestions.map((q) => q.question) || [],
    skills: flatSkills,
    lastModifiedDate: item.flatData?.lastModifiedDate ?? createdDate,
    teams:
      item.flatData?.role === 'Staff'
        ? [
            {
              id: '0',
              displayName: 'ASAP',
              role: 'Staff',
              responsibilities: item.flatData.responsibilities || undefined,
              approach: item.flatData.reachOut || undefined,
            },
            ...teams,
          ]
        : teams,
    avatarUrl: flatAvatar?.length
      ? createURL(flatAvatar.map((a) => a.id))[0]
      : undefined,
    role,
  };
};

export const parseUser = (user: CMSUser): UserResponse => {
  const teams: UserTeam[] =
    user.data.teams?.iv.map(({ id, ...t }) => ({
      id: id[0],
      displayName: 'Unknown',
      ...t,
    })) || [];

  return JSON.parse(
    JSON.stringify({
      id: user.id,
      createdDate: parseDate(user.created).toISOString(),
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
        user.data.role.iv === 'Staff'
          ? [
              {
                id: '0',
                displayName: 'ASAP',
                role: user.data.jobTitle?.iv
                  ? `${user.data.jobTitle.iv}${
                      user.data.institution?.iv
                        ? ` at ${user.data.institution?.iv}`
                        : ''
                    }`
                  : 'Staff',
                responsibilities: user.data.responsibilities?.iv,
                approach: user.data.reachOut?.iv,
              },
              ...teams,
            ]
          : teams,
      location: user.data.location?.iv,
      orcid: user.data.orcid?.iv,
      orcidLastSyncDate: user.data.orcidLastSyncDate?.iv,
      orcidLastModifiedDate: user.data.orcidLastModifiedDate?.iv,
      orcidWorks: user.data.orcidWorks?.iv,
      skills: user.data.skills?.iv || [],
      questions: user.data.questions?.iv.map(({ question }) => question) || [],
      avatarUrl: user.data.avatar && createURL(user.data.avatar.iv)[0],
      role: user.data.role.iv === 'Hidden' ? 'Guest' : user.data.role.iv,
    }),
  );
};
