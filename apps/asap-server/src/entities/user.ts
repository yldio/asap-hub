import Joi from '@hapi/joi';
import { OrcidWork, UserResponse, UserTeam } from '@asap-hub/model';
import { GraphqlUser, RestUser } from '@asap-hub/squidex';
import { parseDate, createURL } from '../utils/squidex';

export type CMSOrcidWork = OrcidWork;

export const userUpdateSchema = Joi.object({
  contactEmail: Joi.string().allow(''),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  jobTitle: Joi.string().allow(''),
  degree: Joi.string()
    .allow('BA', 'BSc', 'MSc', 'PhD', 'MD', 'PhD, MD')
    .allow(''),
  institution: Joi.string().allow(''),
  biography: Joi.string().allow(''),
  location: Joi.string().allow(''),
  orcid: Joi.string().allow(''),
  skills: Joi.array().items(Joi.string()),
  skillsDescription: Joi.string().allow(''),
  questions: Joi.array().items(Joi.string()),
  teams: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      responsibilities: Joi.string().allow(''),
      approach: Joi.string().allow(''),
    })
      .min(2)
      .required(),
  ),
  social: Joi.object({
    website1: Joi.string(),
    website2: Joi.string(),
    linkedIn: Joi.string(),
    orcid: Joi.string(),
    researcherId: Joi.string(),
    twitter: Joi.string(),
    github: Joi.string(),
    googleScholar: Joi.string(),
    researchGate: Joi.string(),
  }),
})
  .min(1)
  .required();

export const parseGraphQLUserTeamConnection = (
  item: NonNullable<NonNullable<GraphqlUser['flatData']>['teams']>[0],
): UserTeam => {
  const team = item.id[0];
  const displayName = team.flatData?.displayName;
  const proposal = team.flatData?.proposal;

  return {
    id: team.id,
    role: item.role,
    approach:
      item.approach !== 'null' && item.approach !== null // Squidex bug: nulls converted to string
        ? item.approach
        : undefined,
    responsibilities:
      item.responsibilities !== 'null' && item.responsibilities !== null
        ? item.responsibilities
        : undefined,
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
    parseGraphQLUserTeamConnection,
  );

  const orcid = item.flatData?.orcid || undefined;
  // merge both and remove null values
  const social = Object.entries({
    ...((item.flatData?.social && item.flatData?.social[0]) || {}),
    orcid,
  }).reduce((acc, [k, v]) => {
    if (v == null) return acc;
    return { ...acc, [k]: v };
  }, {} as { [key: string]: string });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const displayName = `${item.flatData!.firstName} ${item.flatData!.lastName}`;

  return {
    id: item.id,
    createdDate,
    displayName,
    orcid, // TODO: remove once edit social is added
    firstName: item.flatData?.firstName || '',
    lastName: item.flatData?.lastName || '',
    biography: item.flatData?.biography || undefined,
    degree: item.flatData?.degree || undefined,
    email: item.flatData?.email || '',
    contactEmail: item.flatData?.contactEmail || undefined,
    institution: item.flatData?.institution || undefined,
    jobTitle: item.flatData?.jobTitle || undefined,
    location: item.flatData?.location || undefined,
    orcidWorks: item.flatData?.orcidWorks?.slice(0, 5) || [],
    questions: flatQuestions.map((q) => q.question) || [],
    skills: flatSkills,
    skillsDescription: item.flatData?.skillsDescription ?? undefined,
    lastModifiedDate: item.flatData?.lastModifiedDate || createdDate,
    teams,
    social,
    avatarUrl: flatAvatar?.length
      ? createURL(flatAvatar.map((a) => a.id))[0]
      : undefined,
    role,
    responsibilities: item.flatData?.responsibilities || undefined,
    reachOut: item.flatData?.reachOut || undefined,
  };
};

export const parseUser = (user: RestUser): UserResponse => {
  const teams: UserTeam[] =
    user.data.teams?.iv.map(({ id, ...t }) => ({
      id: id[0],
      displayName: 'Unknown',
      ...t,
      approach: t.approach ? t.approach : undefined,
      responsibilities: t.responsibilities ? t.responsibilities : undefined,
    })) || [];

  const orcid = user.data.orcid?.iv;
  const social = {
    ...((user.data.social?.iv && user.data.social?.iv[0]) || {}),
    orcid,
  };

  const displayName = `${user.data.firstName.iv} ${user.data.lastName.iv}`;

  return JSON.parse(
    JSON.stringify({
      id: user.id,
      displayName,
      createdDate: parseDate(user.created).toISOString(),
      lastModifiedDate: user.data.lastModifiedDate?.iv ?? user.created,
      email: user.data.email.iv,
      contactEmail: user.data?.contactEmail?.iv,
      degree: user.data.degree?.iv,
      firstName: user.data.firstName?.iv,
      lastName: user.data.lastName?.iv,
      biography: user.data.biography?.iv,
      jobTitle: user.data.jobTitle?.iv,
      institution: user.data.institution?.iv,
      teams,
      social,
      location: user.data.location?.iv,
      orcid: user.data.orcid?.iv,
      orcidLastSyncDate: user.data.orcidLastSyncDate?.iv,
      orcidLastModifiedDate: user.data.orcidLastModifiedDate?.iv,
      orcidWorks: user.data.orcidWorks?.iv,
      skills: user.data.skills?.iv || [],
      skillsDescription: user.data.skillsDescription,
      questions: user.data.questions?.iv.map(({ question }) => question) || [],
      avatarUrl: user.data.avatar && createURL(user.data.avatar.iv)[0],
      role: user.data.role.iv === 'Hidden' ? 'Guest' : user.data.role.iv,
      responsibilities: user.data.responsibilities?.iv || undefined,
      reachOut: user.data.reachOut?.iv || undefined,
    }),
  );
};
