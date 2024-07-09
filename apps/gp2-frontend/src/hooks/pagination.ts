import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export const PAGE_SIZE = 10;

export const usePaginationParams = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const pageSize = PAGE_SIZE;

  const resetPaginationSearchParams = new URLSearchParams(searchParams);
  resetPaginationSearchParams.delete('currentPage');

  // const resetPagination = () => {
  //   history.replace({ search: resetPaginationSearchParams.toString() });
  // };

  const resetPagination = () => {
    navigate(
      { search: resetPaginationSearchParams.toString() },
      { replace: true },
    );
  };

  return {
    currentPage,
    pageSize,
    resetPagination,
  };
};

export const usePagination = (numberOfItems: number, pageSize: number) => {
  const navigate = useNavigate();
  // const searchParams = new URLSearchParams(useLocation().search);
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / pageSize) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;

  const renderPageHref = (page: number) => {
    const { pathname } = useLocation();
    // const newSearchParams = new URLSearchParams(history.location.search);

    if (page === currentPage) return '';
    // if (page === 0) newSearchParams.delete('currentPage');
    // else newSearchParams.set('currentPage', String(page));
    if (page === 0) searchParams.delete('currentPage');
    else searchParams.set('currentPage', String(page));

    // const newParams = newSearchParams.toString();
    const newParams = searchParams.toString();
    return `${newParams.length ? '?' : pathname}${newParams}`;
  };

  // const renderPageHref = (page: number) => {
  //   const newSearchParams = new URLSearchParams(history.location.search);

  //   if (page === currentPage) return '';
  //   if (page === 0) newSearchParams.delete('currentPage');
  //   else newSearchParams.set('currentPage', String(page));

  //   const newParams = newSearchParams.toString();
  //   return `${newParams.length ? '?' : history.location.pathname}${newParams}`;
  // };

  // useEffect(() => {
  //   if (numberOfItems && currentPage > lastAllowedPage)
  //     history.replace({
  //       search: renderPageHref(lastAllowedPage),
  //     });
  // });
  useEffect(() => {
    if (numberOfItems && currentPage > lastAllowedPage)
      navigate(
        {
          search: renderPageHref(lastAllowedPage),
        },
        { replace: true },
      );
  });

  return {
    numberOfPages,
    renderPageHref,
  };
};
