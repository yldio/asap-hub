import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';
import type {
  ProjectMember,
  ResearchThemeType,
  ResourceProject,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { ProjectListOptions } from './api';
import {
  exportProjects,
  isResourceProject,
  ResourceProjectCSV,
  resourceProjectToCSV,
  toDiscoveryThemeFilters,
  toResourceTypeFilters,
  toStatusFilters,
} from './utils';
import {
  FilterOption,
  STATUS_FILTER_OPTIONS,
  createDiscoveryThemeFilterOptionsFromThemes,
  createResourceTypeFilterOptionsFromTypes,
} from './filter-options';
import {
  useResearchThemes,
  useResourceTypes,
} from '../shared-state/shared-research';
import { useAlgolia } from '../hooks/algolia';

const RESOURCE_THEME_TYPES: ReadonlyArray<ResearchThemeType> = ['Resource'];

type ResourceProjectsProps = {
  searchQuery: string;
  debouncedSearchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

type ResourceProjectsListContentProps = {
  options: ProjectListOptions;
  currentPage: number;
  pageSize: number;
};

const withMemberHref = (members?: ReadonlyArray<ProjectMember>) =>
  members?.map((member) => ({
    ...member,
    href: network({}).users({}).user({ userId: member.id }).$,
  }));

const ResourceProjectsListContent: FC<ResourceProjectsListContentProps> = ({
  options,
  currentPage,
  pageSize,
}) => {
  const projects = useProjects(options);

  const projectsWithMemberLinks = useMemo(
    () =>
      (projects.items as ResourceProject[]).map((project) =>
        project.isTeamBased
          ? project
          : {
              ...project,
              members: withMemberHref(project.members) ?? project.members,
            },
      ),
    [projects],
  );
  const { numberOfPages, renderPageHref } = usePagination(
    projects.total,
    pageSize,
  );

  const { client } = useAlgolia();

  const exportResults = () =>
    exportProjects<ResourceProject, ResourceProjectCSV>(
      client,
      'ResourceProjects',
      isResourceProject,
      resourceProjectToCSV,
      options,
    );

  return (
    <ResourceProjectsList
      projects={projectsWithMemberLinks}
      numberOfItems={projects.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={projects.algoliaIndexName}
      exportResults={exportResults}
    />
  );
};

const ResourceProjects: FC<ResourceProjectsProps> = ({
  searchQuery,
  debouncedSearchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const resourceTypes = useResourceTypes();
  const researchThemes = useResearchThemes(RESOURCE_THEME_TYPES);
  const statusFilters = useMemo(() => toStatusFilters(filters), [filters]);
  const resourceTypeFilters = useMemo(
    () => toResourceTypeFilters(filters, resourceTypes),
    [filters, resourceTypes],
  );
  const themeFilters = useMemo(
    () => toDiscoveryThemeFilters(filters, researchThemes),
    [filters, researchThemes],
  );
  const emptyFilters = useMemo(() => new Set<string>(), []);
  const normalizedFilters = useMemo(
    () => (filters ? new Set(filters) : undefined),
    [filters],
  );
  const facetFilters = useMemo(() => {
    const filtersByAttribute: Record<string, ReadonlyArray<string>> = {};
    if (resourceTypeFilters.length) {
      filtersByAttribute.resourceType = resourceTypeFilters;
    }
    if (themeFilters.length) {
      filtersByAttribute.researchTheme = themeFilters;
    }
    return Object.keys(filtersByAttribute).length
      ? filtersByAttribute
      : undefined;
  }, [resourceTypeFilters, themeFilters]);
  const listOptions = useMemo(
    () => ({
      projectType: 'Resource Project' as const,
      searchQuery: debouncedSearchQuery,
      statusFilters,
      currentPage,
      pageSize,
      filters: normalizedFilters ?? emptyFilters,
      facetFilters,
    }),
    [
      currentPage,
      debouncedSearchQuery,
      emptyFilters,
      facetFilters,
      normalizedFilters,
      pageSize,
      statusFilters,
    ],
  );
  const resourceFilterOptions: ReadonlyArray<FilterOption> = useMemo(
    () => createResourceTypeFilterOptionsFromTypes(resourceTypes),
    [resourceTypes],
  );
  const themeFilterOptions: ReadonlyArray<FilterOption> = useMemo(
    () => createDiscoveryThemeFilterOptionsFromThemes(researchThemes),
    [researchThemes],
  );
  const filterOptions = useMemo(
    () => [
      ...resourceFilterOptions,
      ...themeFilterOptions,
      ...STATUS_FILTER_OPTIONS,
    ],
    [resourceFilterOptions, themeFilterOptions],
  );

  return (
    <ProjectsPage
      page="Resource"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
      filterOptions={filterOptions}
    >
      <SearchFrame title="Resource Projects">
        <ResourceProjectsListContent
          options={listOptions}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </SearchFrame>
    </ProjectsPage>
  );
};

export default ResourceProjects;
