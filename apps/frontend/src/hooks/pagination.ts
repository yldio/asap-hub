import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 10;

export const usePaginationParams = (pageSize = DEFAULT_PAGE_SIZE) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  return { currentPage, pageSize };
};

export const usePagination = (numberOfItems: number, pageSize: number) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / pageSize) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;
  const renderPageHref = (page: number) => {
    if (page === currentPage) return '';
    if (page === 0) searchParams.delete('currentPage');
    else searchParams.set('currentPage', String(page));
    return `?${searchParams.toString()}`;
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

export default usePagination;
