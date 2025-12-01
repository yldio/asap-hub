import {
  DiscoveryProject,
  ProjectResponse,
  ProjectStatus,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';

export const isDiscoveryProject = (
  project: ProjectResponse,
): project is DiscoveryProject => project.projectType === 'Discovery Project';

export const isResourceProject = (
  project: ProjectResponse,
): project is ResourceProject => project.projectType === 'Resource Project';

export const isTraineeProject = (
  project: ProjectResponse,
): project is TraineeProject => project.projectType === 'Trainee Project';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'Active',
  'Completed',
  'Closed',
];

// Helper function to extract status filters from a set of filters
export const toStatusFilters = (
  filters: ReadonlySet<string> | undefined,
): ProjectStatus[] => {
  if (!filters) {
    return [];
  }
  return Array.from(filters).filter((filter): filter is ProjectStatus =>
    PROJECT_STATUSES.includes(filter as ProjectStatus),
  );
};

// Helper function to extract discovery theme filters from a set of filters
export const toDiscoveryThemeFilters = (
  filters: ReadonlySet<string> | undefined,
  availableThemes: ReadonlyArray<{ id: string; name: string }>,
): string[] => {
  if (!filters) {
    return [];
  }
  const themeNames = new Set(availableThemes.map((theme) => theme.name));
  return Array.from(filters).filter((filter) => themeNames.has(filter));
};

// Helper function to extract resource type filters from a set of filters
export const toResourceTypeFilters = (
  filters: ReadonlySet<string> | undefined,
  availableTypes: ReadonlyArray<{ id: string; name: string }>,
): string[] => {
  if (!filters) {
    return [];
  }
  const typeNames = new Set(availableTypes.map((type) => type.name));
  return Array.from(filters).filter((filter) => typeNames.has(filter));
};
