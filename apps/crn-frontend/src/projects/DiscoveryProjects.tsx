import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  ProjectsPage,
  DiscoveryProjectsList,
} from '@asap-hub/react-components';
import {
  DiscoveryProject,
  DISCOVERY_THEME_TYPES,
  FetchTeamsFilter,
  ProjectStatus,
} from '@asap-hub/model';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import {
  DiscoveryProjectCSV,
  discoveryProjectToCSV,
  exportProjects,
  isDiscoveryProject,
  PROJECT_STATUSES,
} from './utils';
import { ProjectListOptions } from './api';
import {
  FilterOption,
  STATUS_FILTER_OPTIONS,
  createResearchThemeFilterOptions,
} from './filter-options';
import { useResearchThemes } from '../shared-state/shared-research';
import { useAlgolia } from '../hooks/algolia';

type DiscoveryProjectsProps = {
  searchQuery: string;
  debouncedSearchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  filtersMap?: FetchTeamsFilter;
  onChangeFilter?: (filter: string, filterName?: string) => void;
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

  const { client } = useAlgolia();

  const exportResults = () =>
    exportProjects<DiscoveryProject, DiscoveryProjectCSV>(
      client,
      'DiscoveryProjects',
      isDiscoveryProject,
      discoveryProjectToCSV,
      options,
    );

  return (
    <DiscoveryProjectsList
      projects={projects.items as DiscoveryProject[]}
      numberOfItems={projects.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={projects.algoliaIndexName}
      exportResults={exportResults}
    />
  );
};

const DiscoveryProjects: FC<DiscoveryProjectsProps> = ({
  searchQuery,
  debouncedSearchQuery,
  onChangeSearchQuery,
  filters,
  filtersMap,
  onChangeFilter,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const researchThemes = useResearchThemes(DISCOVERY_THEME_TYPES);

  const statusFilters = useMemo(
    () =>
      ((filtersMap?.status ?? []) as string[]).filter(
        (value): value is ProjectStatus =>
          (PROJECT_STATUSES as readonly string[]).includes(value),
      ),
    [filtersMap?.status],
  );
  const themeFilters = useMemo(
    () => filtersMap?.researchTheme ?? [],
    [filtersMap?.researchTheme],
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
      projectType: 'Discovery Project' as const,
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
  const themeFilterOptions: ReadonlyArray<FilterOption> = useMemo(
    () => createResearchThemeFilterOptions(researchThemes),
    [researchThemes],
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
