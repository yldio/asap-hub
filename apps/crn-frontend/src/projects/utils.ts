import {
  DiscoveryProject,
  ProjectResponse,
  ProjectStatus,
  ResourceProject,
  TraineeProject,
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

export const PROJECT_STATUS_FILTER_PREFIX = 'status:';
export const DISCOVERY_THEME_FILTER_PREFIX = 'theme:';
export const RESOURCE_TYPE_FILTER_PREFIX = 'resource-type:';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'Active',
  'Completed',
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
