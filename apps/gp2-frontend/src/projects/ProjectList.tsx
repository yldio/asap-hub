import { ProjectsBody } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import { useSearch } from '../hooks';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useProjects } from './state';

const ProjectList: FC<Record<string, never>> = () => {
  const {
    debouncedSearchQuery,
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch<gp2.FetchProjectFilter>(['status', 'type']);

  const filterList = [filters.status, filters.type]
    .filter((value) => value !== undefined)
    .flat() as string[];

  const filterSet = new Set<string>(filterList);
  const onChangeFilter = (filter: string) => {
    if (gp2.projectStatus.includes(filter as unknown as gp2.ProjectStatus)) {
      toggleFilter(filter, 'status');
    } else {
      toggleFilter(filter, 'type');
    }
  };

  const { currentPage, pageSize } = usePaginationParams();
  const { total, items } = useProjects({
    searchQuery: debouncedSearchQuery,
    filters: filterSet,
    status: filters.status,
    type: filters.type,
    currentPage,
    pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <ProjectsBody
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      projects={items}
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
    />
  );
};

export default ProjectList;
