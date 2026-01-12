import { AlgoliaClient } from '@asap-hub/algolia';
import {
  createCsvFileStream,
  CSVValue,
  resultsToStream,
} from '@asap-hub/frontend-utils';
import {
  DiscoveryProject,
  ProjectResponse,
  ProjectStatus,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';
import format from 'date-fns/format';
import { getProjects, ProjectListOptions, toListProjectResponse } from './api';

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

export const exportProjects = async <
  T extends ProjectResponse,
  U extends Record<string, unknown>,
>(
  client: AlgoliaClient<'crn'>,
  fileNamePrefix: string,
  projectTypeGuard: (p: ProjectResponse) => p is T,
  mapper: (project: T) => U,
  options: ProjectListOptions,
) =>
  resultsToStream<T>(
    createCsvFileStream(
      `${fileNamePrefix}_${format(new Date(), 'MMddyy')}.csv`,
      {
        header: true,
      },
    ),
    (paginationParams) =>
      getProjects(client, { ...options, ...paginationParams }).then((res) => {
        const list = toListProjectResponse(res);
        return {
          ...list,
          items: list.items.filter(projectTypeGuard),
        };
      }),
    mapper,
  );

export const discoveryProjectToCSV = (
  project: DiscoveryProject,
): DiscoveryProjectCSV => ({
  'Project Title': project.title,
  'Original Grant': project.originalGrant,
  'Supplement Grant': project.supplementGrantDescription,
  'Project Type': project.projectType,
  'Project Status': project.status,
  'Research Theme': project.researchTheme,
  'Funded Team Name': project.teamName,
  'Project Start Date': project.startDate,
  'Project End Date': project.endDate,
  Tags: project.tags?.join(','),
});

export const resourceProjectToCSV = (
  project: ResourceProject,
): ResourceProjectCSV => ({
  'Project Title': project.title,
  'Original Grant': project.originalGrant,
  'Supplement Grant': project.supplementGrantDescription,
  'Project Type': project.projectType,
  'Project Status': project.status,
  'Resource Type': project.resourceType,
  'Funded Team Name': project.isTeamBased ? project.teamName : '',
  'Project Members': project.isTeamBased
    ? ''
    : project.members?.map((member) => member.displayName).join(','),
  'Project Start Date': project.startDate,
  'Project End Date': project.endDate,
  Tags: project.tags?.join(','),
});

export const traineeProjectToCSV = (
  project: TraineeProject,
): TraineeProjectCSV => ({
  'Project Title': project.title,
  'Original Grant': project.originalGrant,
  'Supplement Grant': project.supplementGrantDescription,
  'Project Type': project.projectType,
  'Project Status': project.status,
  'Project Members': project.members
    ?.map((member) => member.displayName)
    .join(','),
  'Project Start Date': project.startDate,
  'Project End Date': project.endDate,
  Tags: project.tags?.join(','),
});

const DISCOVERY_PROJECT_CSV_COLUMNS = [
  'Project Title',
  'Original Grant',
  'Supplement Grant',
  'Project Type',
  'Project Status',
  'Research Theme',
  'Funded Team Name',
  'Project Start Date',
  'Project End Date',
  'Tags',
];
const RESOURCE_PROJECT_CSV_COLUMNS = [
  'Project Title',
  'Original Grant',
  'Supplement Grant',
  'Project Type',
  'Project Status',
  'Resource Type',
  'Funded Team',
  'Project Members',
  'Project Start Date',
  'Project End Date',
  'Tags',
];
const TRAINEE_PROJECT_CSV_COLUMNS = [
  'Project Title',
  'Original Grant',
  'Supplement Grant',
  'Project Type',
  'Project Status',
  'Project Members',
  'Project Start Date',
  'Project End Date',
  'Tags',
];

export type DiscoveryProjectCSV = Record<
  (typeof DISCOVERY_PROJECT_CSV_COLUMNS)[number],
  CSVValue
>;

export type ResourceProjectCSV = Record<
  (typeof RESOURCE_PROJECT_CSV_COLUMNS)[number],
  CSVValue
>;

export type TraineeProjectCSV = Record<
  (typeof TRAINEE_PROJECT_CSV_COLUMNS)[number],
  CSVValue
>;
