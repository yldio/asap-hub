import { ProjectType } from './project';
import { UserResponse } from './user';

export type ManuscriptWorkspaceTab = 'discussions';

export type ManuscriptWorkspaceContext = {
  projectsByTeamId: Record<string, { id: string; type: ProjectType }>;
  manuscriptId: string;
  submittingTeamId: string | undefined;
  contributingTeamIds: ReadonlyArray<string>;
  project?: {
    id: string;
    type: ProjectType;
  };
};

export type ManuscriptWorkspaceUserContext = Pick<
  UserResponse,
  'openScienceTeamMember'
> & {
  teams: ReadonlyArray<{ id: string }>;
  projects: ReadonlyArray<{ id: string }>;
};

export type ManuscriptWorkspaceUrlResponse = {
  url: string;
};
