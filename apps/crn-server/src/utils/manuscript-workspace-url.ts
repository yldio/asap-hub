import {
  ManuscriptResponse,
  ManuscriptWorkspaceContext,
  ManuscriptWorkspaceTab,
  ManuscriptWorkspaceUserContext,
  ProjectType,
} from '@asap-hub/model';

const projectTypeUrlSegment: Record<ProjectType, string> = {
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
    manuscript.projectId && manuscript.projectType && submittingTeamId
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
  useProjectWorkspace: boolean,
): string => {
  const projectLinkedToTeam = manuscript.projectsByTeamId[teamId];

  if (useProjectWorkspace && projectLinkedToTeam) {
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
  useProjectWorkspace: boolean,
): string | null => {
  const collaborationTeamId = getUserCollaboratingTeamId(manuscript, user);
  if (!collaborationTeamId) {
    return null;
  }

  return buildWorkspacePathForTeam(
    manuscript,
    collaborationTeamId,
    options,
    useProjectWorkspace,
  );
};

const resolveTeamBasedManuscriptPath = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
  options: WorkspacePathOptions,
  useProjectWorkspace: boolean,
): string | null => {
  if (
    manuscript.submittingTeamId &&
    isUserOnTeam(user, manuscript.submittingTeamId)
  ) {
    return buildWorkspacePathForTeam(
      manuscript,
      manuscript.submittingTeamId,
      options,
      useProjectWorkspace,
    );
  }

  return resolveCollaboratorPath(
    manuscript,
    user,
    options,
    useProjectWorkspace,
  );
};

const resolveOpenScienceMemberPath = (
  manuscript: ManuscriptWorkspaceContext,
  options: WorkspacePathOptions,
  useProjectWorkspace: boolean,
): string | null => {
  if (useProjectWorkspace && isUserBasedManuscript(manuscript)) {
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
    useProjectWorkspace,
  );
};

export const resolveManuscriptWorkspacePath = (
  manuscript: ManuscriptWorkspaceContext,
  user: ManuscriptWorkspaceUserContext,
  options?: { tab?: ManuscriptWorkspaceTab; projectWorkspaceEnabled?: boolean },
): string | null => {
  const pathOptions: WorkspacePathOptions = {
    tab: options?.tab,
  };
  const useProjectWorkspace = options?.projectWorkspaceEnabled ?? false;

  if (user.openScienceTeamMember) {
    return resolveOpenScienceMemberPath(
      manuscript,
      pathOptions,
      useProjectWorkspace,
    );
  }

  if (isUserBasedManuscript(manuscript)) {
    if (useProjectWorkspace && isUserPartOfProject(user, manuscript.project)) {
      return buildProjectWorkspacePath(
        manuscript.project,
        manuscript.manuscriptId,
        pathOptions.tab,
      );
    }

    return resolveCollaboratorPath(
      manuscript,
      user,
      pathOptions,
      useProjectWorkspace,
    );
  }

  return resolveTeamBasedManuscriptPath(
    manuscript,
    user,
    pathOptions,
    useProjectWorkspace,
  );
};
