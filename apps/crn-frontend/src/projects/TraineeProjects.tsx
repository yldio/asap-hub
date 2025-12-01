import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, TraineeProjectsList } from '@asap-hub/react-components';
import type { ProjectMember, TraineeProject } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { ProjectListOptions } from './api';
import { toStatusFilters } from './utils';
import { STATUS_FILTER_OPTIONS } from './filter-options';

type TraineeProjectsProps = {
  searchQuery: string;
  debouncedSearchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

type TraineeProjectsListContentProps = {
  options: ProjectListOptions;
  currentPage: number;
  pageSize: number;
};

const withMemberHref = (member: ProjectMember) => ({
  ...member,
  href: network({}).users({}).user({ userId: member.id }).$,
});

const TraineeProjectsListContent: FC<TraineeProjectsListContentProps> = ({
  options,
  currentPage,
  pageSize,
}) => {
  const projects = useProjects(options);

  const projectsWithMemberLinks = useMemo(
    () =>
      (projects.items as TraineeProject[]).map((project) => ({
        ...project,
        members: project.members.map(withMemberHref),
      })),
    [projects],
  );
  const { numberOfPages, renderPageHref } = usePagination(
    projects.total,
    pageSize,
  );

  return (
    <TraineeProjectsList
      projects={projectsWithMemberLinks}
      numberOfItems={projects.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      algoliaIndexName={projects.algoliaIndexName}
    />
  );
};

const TraineeProjects: FC<TraineeProjectsProps> = ({
  searchQuery,
  debouncedSearchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const statusFilters = useMemo(() => toStatusFilters(filters), [filters]);
  const emptyFilters = useMemo(() => new Set<string>(), []);
  const normalizedFilters = useMemo(
    () => (filters ? new Set(filters) : emptyFilters),
    [emptyFilters, filters],
  );

  const listOptions = useMemo(
    () => ({
      projectType: 'Trainee Project' as const,
      searchQuery: debouncedSearchQuery,
      statusFilters,
      currentPage,
      pageSize,
      filters: normalizedFilters,
    }),
    [
      currentPage,
      debouncedSearchQuery,
      normalizedFilters,
      pageSize,
      statusFilters,
    ],
  );

  return (
    <ProjectsPage
      page="Trainee"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
      filterOptions={STATUS_FILTER_OPTIONS}
    >
      <SearchFrame title="Trainee Projects">
        <TraineeProjectsListContent
          options={listOptions}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </SearchFrame>
    </ProjectsPage>
  );
};

export default TraineeProjects;
