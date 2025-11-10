import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects, useProjectFacets } from './state';
import { ProjectListOptions } from './api';
import {
  isResourceProject,
  toResourceTypeFilters,
  toStatusFilters,
} from './utils';
import {
  FilterOption,
  STATUS_FILTER_OPTIONS,
  createResourceTypeFilterOptions,
} from './filter-options';

const resourceFacetRequest = {
  projectType: 'Resource' as const,
  facets: ['resourceType'] as const,
};

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

const ResourceProjectsListContent: FC<ResourceProjectsListContentProps> = ({
  options,
  currentPage,
  pageSize,
}) => {
  const result = useProjects(options);
  const projects = useMemo(
    () => result.items.filter(isResourceProject),
    [result.items],
  );
  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <ResourceProjectsList
      projects={projects}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={result.algoliaIndexName}
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
  const statusFilters = useMemo(() => toStatusFilters(filters), [filters]);
  const resourceTypeFilters = useMemo(
    () => toResourceTypeFilters(filters),
    [filters],
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
      projectType: 'Resource' as const,
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
  const facets = useProjectFacets(resourceFacetRequest);
  const resourceFilterOptions: ReadonlyArray<FilterOption> = useMemo(
    () => createResourceTypeFilterOptions(facets?.resourceType),
    [facets],
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
