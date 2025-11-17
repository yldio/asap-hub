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
  // If themes are loaded, validate against them. Otherwise, pass through non-status filters.
  if (availableThemes.length > 0) {
    const themeNames = new Set(availableThemes.map((theme) => theme.name));
    return Array.from(filters).filter((filter) => themeNames.has(filter));
  }
  // Fallback: if themes aren't loaded yet, pass through filters that aren't status filters
  // This allows filters to work even if themes haven't loaded yet
  return Array.from(filters).filter(
    (filter) => !PROJECT_STATUSES.includes(filter as ProjectStatus),
  );
};

// Helper function to extract resource type filters from a set of filters
export const toResourceTypeFilters = (
  filters: ReadonlySet<string> | undefined,
  availableTypes: ReadonlyArray<{ id: string; name: string }>,
): string[] => {
  if (!filters) {
    return [];
  }
  // If types are loaded, validate against them. Otherwise, pass through non-status filters.
  if (availableTypes.length > 0) {
    const typeNames = new Set(availableTypes.map((type) => type.name));
    return Array.from(filters).filter((filter) => typeNames.has(filter));
  }
  // Fallback: if types aren't loaded yet, pass through filters that aren't status filters
  // This allows filters to work even if types haven't loaded yet
  return Array.from(filters).filter(
    (filter) => !PROJECT_STATUSES.includes(filter as ProjectStatus),
  );
};
