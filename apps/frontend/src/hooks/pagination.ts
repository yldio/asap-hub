import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const DEFAULT_PAGE_SIZE = 10;

export const usePaginationParams = (pageSize = DEFAULT_PAGE_SIZE) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;

  const resetPagination = () => {
    const newSearchParams = new URLSearchParams(history.location.search);
    newSearchParams.delete('currentPage');
    history.replace({ search: newSearchParams.toString() });
  };
  return { currentPage, pageSize, resetPagination };
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
