import {
  DiscoveryProject,
  DiscoveryProjectDetail,
  ProjectDetail,
  ProjectResponse,
  ResourceProject,
  ResourceProjectDetail,
  TraineeProject,
  TraineeProjectDetail,
} from '@asap-hub/model';

export const isDiscoveryProject = (
  project: ProjectResponse,
): project is DiscoveryProject => project.projectType === 'Discovery';

export const isResourceProject = (
  project: ProjectResponse,
): project is ResourceProject => project.projectType === 'Resource';

export const isTraineeProject = (
  project: ProjectResponse,
): project is TraineeProject => project.projectType === 'Trainee';

const defaultGrant = { title: '', description: '' } as const;

export const toDiscoveryProjectDetail = (
  project: DiscoveryProject,
): DiscoveryProjectDetail => ({
  ...project,
  description: '',
  originalGrant: defaultGrant,
  supplementGrant: undefined,
  milestones: [],
  fundedTeam: {
    id: project.teamId,
    name: project.teamName,
    type: 'Discovery Team',
    researchTheme: project.researchTheme || undefined,
    description: '',
  },
  collaborators: [],
});

export const toResourceProjectDetail = (
  project: ResourceProject,
): ResourceProjectDetail => ({
  ...project,
  description: '',
  originalGrant: defaultGrant,
  supplementGrant: undefined,
  milestones: [],
  fundedTeam: project.isTeamBased
    ? {
        id: project.teamId,
        name: project.teamName ?? '',
        type: 'Resource Project Team',
        researchTheme: undefined,
        description: '',
      }
    : undefined,
  collaborators: project.isTeamBased ? [] : project.members,
});

export const toTraineeProjectDetail = (
  project: TraineeProject,
): TraineeProjectDetail => ({
  ...project,
  description: '',
  originalGrant: defaultGrant,
  supplementGrant: undefined,
  milestones: [],
});

export const toProjectDetail = (project: ProjectResponse): ProjectDetail =>
  ({
    Discovery: toDiscoveryProjectDetail(project as DiscoveryProject),
    Resource: toResourceProjectDetail(project as ResourceProject),
    Trainee: toTraineeProjectDetail(project as TraineeProject),
  })[project.projectType];
