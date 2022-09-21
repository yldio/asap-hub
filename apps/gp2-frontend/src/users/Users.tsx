import { UsersPage } from '@asap-hub/gp2-components';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useUsersState } from './state';

export const usePaginationParams = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const pageSize = 2;

  return {
    currentPage,
    pageSize,
  };
};

export const usePagination = (numberOfItems: number, pageSize: number) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);

  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / pageSize) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;

  const renderPageHref = (page: number) => {
    const newSearchParams = new URLSearchParams(history.location.search);

    if (page === currentPage) return '';
    if (page === 0) newSearchParams.delete('currentPage');
    else newSearchParams.set('currentPage', String(page));

    const newParams = newSearchParams.toString();
    return `${newParams.length ? '?' : history.location.pathname}${newParams}`;
  };

  useEffect(() => {
    if (numberOfItems && currentPage > lastAllowedPage)
      history.replace({
        search: renderPageHref(lastAllowedPage),
      });
  });

  return {
    numberOfPages,
    renderPageHref,
  };
};

const Users: React.FC<Record<string, never>> = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const users = useUsersState({
    currentPage,
    pageSize,
    searchQuery: '',
    filters: new Set(),
  });
  const { numberOfPages, renderPageHref } = usePagination(
    users.total,
    pageSize,
  );
  return (
    <UsersPage
      users={users}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};
export default Users;
