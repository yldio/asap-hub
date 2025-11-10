import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  ProjectsPage,
  DiscoveryProjectsList,
} from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { isDiscoveryProject } from './utils';
import { ProjectListOptions } from './api';

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
  const result = useProjects(options);
  const projects = useMemo(
    () => result.items.filter(isDiscoveryProject),
    [result.items],
  );
  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <DiscoveryProjectsList
      projects={projects}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={result.algoliaIndexName}
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

  const listOptions = useMemo(
    () => ({
      projectType: 'Discovery' as const,
      searchQuery: debouncedSearchQuery,
      currentPage,
      pageSize,
      filters: filters ?? new Set<string>(),
    }),
    [currentPage, debouncedSearchQuery, pageSize, filters],
  );

  return (
    <ProjectsPage
      page="Discovery"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
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
