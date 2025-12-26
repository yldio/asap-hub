import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const PAGE_SIZE = 10;

export const usePaginationParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const pageSize = PAGE_SIZE;

  const resetPagination = () => {
    const resetPaginationSearchParams = new URLSearchParams(location.search);
    resetPaginationSearchParams.delete('currentPage');
    navigate({ search: resetPaginationSearchParams.toString() } as never, {
      replace: true,
    });
  };

  return {
    currentPage,
    pageSize,
    resetPagination,
  };
};

export const usePagination = (numberOfItems: number, pageSize: number) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Parse currentPage from query string, fallback to 0 if not present
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  // Calculate pagination boundaries based on total items and page size
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / pageSize) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;

  // GP2-specific: Build href string for pagination navigation
  const renderPageHref = (page: number) => {
    const newSearchParams = new URLSearchParams(location.search);

    // No href needed when staying on same page
    if (page === currentPage) return '';
    // Clear currentPage param when going to first page, set it otherwise
    if (page === 0) newSearchParams.delete('currentPage');
    else newSearchParams.set('currentPage', String(page));

    const newParams = newSearchParams.toString();
    return `${newParams.length ? '?' : location.pathname}${newParams}`;
  };

  // Prevent users from accessing pages beyond the last available page
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (numberOfItems && currentPage > lastAllowedPage)
      navigate(
        {
          search: renderPageHref(lastAllowedPage),
        } as never,
        { replace: true },
      );
  });

  return {
    numberOfPages,
    renderPageHref,
  };
};
