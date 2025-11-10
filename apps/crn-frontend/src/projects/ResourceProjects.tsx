import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { ProjectListOptions } from './api';
import { isResourceProject } from './utils';

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
  const listOptions = useMemo(
    () => ({
      projectType: 'Resource' as const,
      searchQuery: debouncedSearchQuery,
      currentPage,
      pageSize,
      filters: filters ?? new Set<string>(),
    }),
    [currentPage, debouncedSearchQuery, pageSize, filters],
  );

  return (
    <ProjectsPage
      page="Resource"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
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
