import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  ProjectsPage,
  DiscoveryProjectsList,
} from '@asap-hub/react-components';
import { DiscoveryProject } from '@asap-hub/model';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects, useProjectFacets } from './state';
import { toDiscoveryThemeFilters, toStatusFilters } from './utils';
import { ProjectListOptions } from './api';
import {
  FilterOption,
  STATUS_FILTER_OPTIONS,
  createDiscoveryThemeFilterOptions,
} from './filter-options';

const discoveryFacetRequest = {
  projectType: 'Discovery' as const,
  facets: ['researchTheme'] as const,
};

type DiscoveryProjectsProps = {
  searchQuery: string;
  debouncedSearchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

type DiscoveryProjectsListContentProps = {
  options: ProjectListOptions;
  currentPage: number;
  pageSize: number;
};

const DiscoveryProjectsListContent: FC<DiscoveryProjectsListContentProps> = ({
  options,
  currentPage,
  pageSize,
}) => {
  const projects = useProjects(options);

  const { numberOfPages, renderPageHref } = usePagination(
    projects.total,
    pageSize,
  );

  return (
    <DiscoveryProjectsList
      projects={projects.items as DiscoveryProject[]}
      numberOfItems={projects.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={projects.algoliaIndexName}
    />
  );
};

const DiscoveryProjects: FC<DiscoveryProjectsProps> = ({
  searchQuery,
  debouncedSearchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const statusFilters = useMemo(() => toStatusFilters(filters), [filters]);
  const themeFilters = useMemo(
    () => toDiscoveryThemeFilters(filters),
    [filters],
  );
  const emptyFilters = useMemo(() => new Set<string>(), []);
  const normalizedFilters = useMemo(
    () => (filters ? new Set(filters) : undefined),
    [filters],
  );
  const facetFilters = useMemo(
    () =>
      themeFilters.length
        ? { researchTheme: themeFilters as ReadonlyArray<string> }
        : undefined,
    [themeFilters],
  );

  const listOptions = useMemo(
    () => ({
      projectType: 'Discovery' as const,
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
  const facets = useProjectFacets(discoveryFacetRequest);
  const themeFilterOptions: ReadonlyArray<FilterOption> = useMemo(
    () => createDiscoveryThemeFilterOptions(facets?.researchTheme),
    [facets],
  );
  const filterOptions = useMemo(
    () => [...themeFilterOptions, ...STATUS_FILTER_OPTIONS],
    [themeFilterOptions],
  );

  return (
    <ProjectsPage
      page="Discovery"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
      filterOptions={filterOptions}
    >
      <SearchFrame title="Discovery Projects">
        <DiscoveryProjectsListContent
          options={listOptions}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </SearchFrame>
    </ProjectsPage>
  );
};

export default DiscoveryProjects;
