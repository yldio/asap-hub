import {
  ManuscriptResponse,
  ManuscriptWorkspaceContext,
  ManuscriptWorkspaceTab,
  ManuscriptWorkspaceUserContext,
  ProjectType,
} from '@asap-hub/model';

export const projectTypeUrlSegment: Record<ProjectType, string> = {
  'Discovery Project': 'discovery',
  'Resource Project': 'resource',
  'Trainee Project': 'trainee',
};

type ManuscriptProject = NonNullable<ManuscriptWorkspaceContext['project']>;

type ManuscriptVersionTeam =
  ManuscriptResponse['versions'][number]['teams'][number];

type TeamWithProject = ManuscriptVersionTeam & {
  id: string;
  projectId: string;
  projectType: ProjectType;
};

type ProjectLinkedManuscriptWorkspaceContext = ManuscriptWorkspaceContext & {
  project: ManuscriptProject;
};

type WorkspacePathOptions = {
  tab?: ManuscriptWorkspaceTab;
};

const discussionsTabQuery = (tab?: ManuscriptWorkspaceTab) =>
  tab === 'discussions' ? '?tab=discussions' : '';

const manuscriptHash = (manuscriptId: string) => `#${manuscriptId}`;

const teamHasProject = (team: ManuscriptVersionTeam): team is TeamWithProject =>
  Boolean(team.id && team.projectId && team.projectType);

const buildProjectsByTeamId = (
  teams: ManuscriptVersionTeam[],
): ManuscriptWorkspaceContext['projectsByTeamId'] =>
  teams.reduce(
    (acc, team) => {
      if (teamHasProject(team)) {
        acc[team.id] = {
          id: team.projectId,
          type: team.projectType,
        };
      }

      return acc;
    },
    {} as ManuscriptWorkspaceContext['projectsByTeamId'],
  );

export const getManuscriptComplianceRedirectUrl = (
  manuscriptId: string,
  origin: string,
  options?: { tab?: ManuscriptWorkspaceTab },
): string =>
  `${origin}/compliance/manuscripts/${manuscriptId}${discussionsTabQuery(
    options?.tab,
  )}`;

export const getManuscriptWorkspaceContextFromResponse = (
  manuscript: Pick<
    ManuscriptResponse,
    'id' | 'teamId' | 'projectId' | 'projectType' | 'versions'
  >,
): ManuscriptWorkspaceContext | null => {
  const latestVersion = manuscript.versions.at(-1);
  if (!latestVersion) {
    return null;
  }

  const contributingTeamIds = latestVersion.teams.map((team) => team.id);
  const submittingTeamId = manuscript.teamId ?? contributingTeamIds[0];
  const projectsByTeamId = buildProjectsByTeamId(latestVersion.teams);

  const project =
    manuscript.projectId && manuscript.projectType
      ? {
          id: manuscript.projectId,
          type: manuscript.projectType,
        }
      : undefined;

  return {
    projectsByTeamId,
    manuscriptId: manuscript.id,
    submittingTeamId,
    contributingTeamIds,
    project,
  };
};

export const buildProjectWorkspacePath = (
  project: ManuscriptProject,
  manuscriptId: string,
  tab?: ManuscriptWorkspaceTab,
): string => {
  const segment = projectTypeUrlSegment[project.type];
  return `/projects/${segment}/${project.id}/workspace${discussionsTabQuery(
    tab,
  )}${manuscriptHash(manuscriptId)}`;
};

export const buildTeamWorkspacePath = (
  teamId: string,
  manuscriptId: string,
  tab?: ManuscriptWorkspaceTab,
): string =>
  `/network/teams/${teamId}/workspace${discussionsTabQuery(
    tab,
  )}${manuscriptHash(manuscriptId)}`;

const buildWorkspacePathForTeam = (
  manuscript: ManuscriptWorkspaceContext,
  teamId: string,
  options: WorkspacePathOptions,
): string => {
  const projectLinkedToTeam = manuscript.projectsByTeamId[teamId];

  if (projectLinkedToTeam) {
    return buildProjectWorkspacePath(
      projectLinkedToTeam,
      manuscript.manuscriptId,
      options.tab,
    );
  }

  return buildTeamWorkspacePath(teamId, manuscript.manuscriptId, options.tab);
};

export const isUserBasedManuscript = (
  manuscript: ManuscriptWorkspaceContext,
): manuscript is ProjectLinkedManuscriptWorkspaceContext =>
  !!manuscript.project;

export const isUserPartOfProject = (
  user: ManuscriptWorkspaceUserContext,
  project: ManuscriptProject,
): boolean => user.projects.some(({ id }) => id === project.id);

const isUserOnTeam = (user: ManuscriptWorkspaceUserContext, teamId: string) =>
  user.teams.some(({ id }) => id === teamId);

export const getUserCollaboratingTeamId = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
) =>
  user.teams.find(({ id }) => manuscript.contributingTeamIds.includes(id))
    ?.id ?? null;

const resolveCollaboratorPath = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
  options: WorkspacePathOptions,
): string | null => {
  const collaborationTeamId = getUserCollaboratingTeamId(manuscript, user);
  if (!collaborationTeamId) {
    return null;
  }

  return buildWorkspacePathForTeam(manuscript, collaborationTeamId, options);
};

const resolveTeamBasedManuscriptPath = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
  options: WorkspacePathOptions,
): string | null => {
  if (
    manuscript.submittingTeamId &&
    isUserOnTeam(user, manuscript.submittingTeamId)
  ) {
    return buildWorkspacePathForTeam(
      manuscript,
      manuscript.submittingTeamId,
      options,
    );
  }

  return resolveCollaboratorPath(manuscript, user, options);
};

const resolveOpenScienceMemberPath = (
  manuscript: ManuscriptWorkspaceContext,
  options: WorkspacePathOptions,
): string | null => {
  if (isUserBasedManuscript(manuscript)) {
    return buildProjectWorkspacePath(
      manuscript.project,
      manuscript.manuscriptId,
      options.tab,
    );
  }

  if (!manuscript.submittingTeamId) {
    return null;
  }

  return buildWorkspacePathForTeam(
    manuscript,
    manuscript.submittingTeamId,
    options,
  );
};

export const resolveManuscriptWorkspacePath = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
  options?: { tab?: ManuscriptWorkspaceTab },
): string | null => {
  const pathOptions: WorkspacePathOptions = {
    tab: options?.tab,
  };

  if (user.openScienceTeamMember) {
    return resolveOpenScienceMemberPath(manuscript, pathOptions);
  }

  if (isUserBasedManuscript(manuscript)) {
    if (isUserPartOfProject(user, manuscript.project)) {
      return buildProjectWorkspacePath(
        manuscript.project,
        manuscript.manuscriptId,
        pathOptions.tab,
      );
    }

    return resolveCollaboratorPath(manuscript, user, pathOptions);
  }

  return resolveTeamBasedManuscriptPath(manuscript, user, pathOptions);
};
