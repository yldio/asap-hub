import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';
import type { ProjectMember, ResourceProject } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { ProjectListOptions } from './api';
import {
  exportProjects,
  isResourceProject,
  ResourceProjectCSV,
  resourceProjectToCSV,
  toResourceTypeFilters,
  toStatusFilters,
} from './utils';
import {
  FilterOption,
  STATUS_FILTER_OPTIONS,
  createResourceTypeFilterOptionsFromTypes,
} from './filter-options';
import { useResourceTypes } from '../shared-state/shared-research';
import { useAlgolia } from '../hooks/algolia';

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
  const statusFilters = useMemo(() => toStatusFilters(filters), [filters]);
  const resourceTypeFilters = useMemo(
    () => toResourceTypeFilters(filters, resourceTypes),
    [filters, resourceTypes],
  );
  const emptyFilters = useMemo(() => new Set<string>(), []);
  const normalizedFilters = useMemo(
    () => (filters ? new Set(filters) : undefined),
    [filters],
  );
  const facetFilters = useMemo(
    () =>
      resourceTypeFilters.length
        ? { resourceType: resourceTypeFilters as ReadonlyArray<string> }
        : undefined,
    [resourceTypeFilters],
  );
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
  const filterOptions = useMemo(
    () => [...resourceFilterOptions, ...STATUS_FILTER_OPTIONS],
    [resourceFilterOptions],
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
