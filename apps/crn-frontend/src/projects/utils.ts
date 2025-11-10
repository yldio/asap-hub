import {
  DiscoveryProject,
  DiscoveryProjectDetail,
  ProjectDetail,
  ProjectResponse,
  ProjectStatus,
  ResourceProject,
  ResourceProjectDetail,
  TraineeProject,
  TraineeProjectDetail,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';

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

const addMemberHref = <T extends { id: string }>(
  member: T | undefined,
): (T & { href: string }) | undefined =>
  member
    ? {
        ...member,
        href: network({}).users({}).user({ userId: member.id }).$,
      }
    : undefined;

const addHrefToMembers = <T extends { id: string }>(
  members: ReadonlyArray<T> | undefined,
) => members?.map((member) => addMemberHref(member) as T & { href: string });

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
  collaborators: project.isTeamBased
    ? []
    : addHrefToMembers(project.members) ?? project.members,
  members: addHrefToMembers(project.members) ?? project.members,
});

export const toTraineeProjectDetail = (
  project: TraineeProject,
): TraineeProjectDetail => ({
  ...project,
  description: '',
  originalGrant: defaultGrant,
  supplementGrant: undefined,
  milestones: [],
  trainer: addMemberHref(project.trainer) ?? project.trainer,
  members: addHrefToMembers(project.members) ?? project.members,
});

export const toProjectDetail = (project: ProjectResponse): ProjectDetail =>
  ({
    Discovery: toDiscoveryProjectDetail(project as DiscoveryProject),
    Resource: toResourceProjectDetail(project as ResourceProject),
    Trainee: toTraineeProjectDetail(project as TraineeProject),
  })[project.projectType];

export const PROJECT_STATUS_FILTER_PREFIX = 'status:';
export const DISCOVERY_THEME_FILTER_PREFIX = 'theme:';
export const RESOURCE_TYPE_FILTER_PREFIX = 'resource-type:';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'Active',
  'Complete',
  'Closed',
];

const extractPrefixedValues = (
  filters: ReadonlySet<string> | undefined,
  prefix: string,
): string[] => {
  if (!filters) {
    return [];
  }
  const values: string[] = [];
  filters.forEach((filter) => {
    if (filter.startsWith(prefix)) {
      values.push(filter.slice(prefix.length));
    }
  });
  return values;
};

// Helper function to extract status filters from a set of filters
export const toStatusFilters = (
  filters: ReadonlySet<string> | undefined,
): ProjectStatus[] =>
  extractPrefixedValues(filters, PROJECT_STATUS_FILTER_PREFIX).filter(
    (status): status is ProjectStatus =>
      PROJECT_STATUSES.includes(status as ProjectStatus),
  );

// Helper function to extract discovery theme filters from a set of filters
export const toDiscoveryThemeFilters = (
  filters: ReadonlySet<string> | undefined,
): string[] => extractPrefixedValues(filters, DISCOVERY_THEME_FILTER_PREFIX);

// Helper function to extract resource type filters from a set of filters
export const toResourceTypeFilters = (
  filters: ReadonlySet<string> | undefined,
): string[] => extractPrefixedValues(filters, RESOURCE_TYPE_FILTER_PREFIX);
