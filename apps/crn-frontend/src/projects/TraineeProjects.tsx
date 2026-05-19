import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, TraineeProjectsList } from '@asap-hub/react-components';
import type {
  FetchTeamsFilter,
  ProjectMember,
  ProjectStatus,
  TraineeProject,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../hooks';
import { useProjects } from './state';
import { ProjectListOptions } from './api';
import {
  exportProjects,
  isTraineeProject,
  PROJECT_STATUSES,
  TraineeProjectCSV,
  traineeProjectToCSV,
} from './utils';
import { STATUS_FILTER_OPTIONS } from './filter-options';
import { useAlgolia } from '../hooks/algolia';

type TraineeProjectsProps = {
  searchQuery: string;
  debouncedSearchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  filtersMap?: FetchTeamsFilter;
  onChangeFilter?: (filter: string, filterName?: string) => void;
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

  const { client } = useAlgolia();

  const exportResults = () =>
    exportProjects<TraineeProject, TraineeProjectCSV>(
      client,
      'TraineeProjects',
      isTraineeProject,
      traineeProjectToCSV,
      options,
    );

  return (
    <TraineeProjectsList
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

const TraineeProjects: FC<TraineeProjectsProps> = ({
  searchQuery,
  debouncedSearchQuery,
  onChangeSearchQuery,
  filters,
  filtersMap,
  onChangeFilter,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const statusFilters = useMemo(
    () =>
      ((filtersMap?.status ?? []) as string[]).filter(
        (value): value is ProjectStatus =>
          (PROJECT_STATUSES as readonly string[]).includes(value),
      ),
    [filtersMap?.status],
  );
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
