import { ProjectsBody } from '@asap-hub/gp2-components';
import { FC } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useProjectsState } from './state';

const ProjectList: FC<Record<string, never>> = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { total, items } = useProjectsState({
    searchQuery: '',
    currentPage,
    pageSize,
    filters: new Set(),
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <ProjectsBody
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      projects={items}
    />
  );
};

export default ProjectList;
