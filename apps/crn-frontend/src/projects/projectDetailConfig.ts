import type { ProjectDetail, ProjectType } from '@asap-hub/model';
import { projects } from '@asap-hub/routing';

const getProjectRoute = (projectId: string) =>
  projects({}).discoveryProjects({}).discoveryProject({ projectId });

type ProjectRoute = ReturnType<typeof getProjectRoute>;

export type ProjectDetailConfig = {
  projectType: ProjectType;
  projectTypeKey: 'discovery' | 'resource' | 'trainee';
  getRoute: (projectId: string) => ProjectRoute;
  getIsTeamBased: (projectDetail: ProjectDetail) => boolean;
  getContactName: (projectDetail: ProjectDetail) => string | undefined;
};

export const discoveryConfig: ProjectDetailConfig = {
  projectType: 'Discovery Project',
  projectTypeKey: 'discovery',
  getRoute: (projectId) =>
    projects({}).discoveryProjects({}).discoveryProject({ projectId }),
  getIsTeamBased: () => true,
  getContactName: (pd) =>
    pd.projectType === 'Discovery Project'
      ? pd.collaborators?.find((m) => m.email === pd.contactEmail)?.displayName
      : undefined,
};

export const resourceConfig: ProjectDetailConfig = {
  projectType: 'Resource Project',
  projectTypeKey: 'resource',
  getRoute: (projectId) =>
    projects({}).resourceProjects({}).resourceProject({ projectId }),
  getIsTeamBased: (pd) =>
    pd.projectType === 'Resource Project' ? pd.isTeamBased : true,
  getContactName: (pd) =>
    pd.projectType === 'Resource Project'
      ? pd.members?.find((m) => m.email === pd.contactEmail)?.displayName ||
        pd.collaborators?.find((m) => m.email === pd.contactEmail)?.displayName
      : undefined,
};

export const traineeConfig: ProjectDetailConfig = {
  projectType: 'Trainee Project',
  projectTypeKey: 'trainee',
  getRoute: (projectId) =>
    projects({}).traineeProjects({}).traineeProject({ projectId }),
  getIsTeamBased: () => false,
  getContactName: (pd) =>
    pd.projectType === 'Trainee Project'
      ? pd.members?.find((m) => m.email === pd.contactEmail)?.displayName
      : undefined,
};
