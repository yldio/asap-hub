import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { viewParam, listViewValue } from '@asap-hub/routing';

export const CARD_VIEW_PAGE_SIZE = 10;
export const LIST_VIEW_PAGE_SIZE = 20;

export const usePaginationParams = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;

  const resetPaginationSearchParams = new URLSearchParams(searchParams);
  resetPaginationSearchParams.delete('currentPage');

  const isListView = searchParams.get(viewParam) === listViewValue;
  const listViewParams = new URLSearchParams(resetPaginationSearchParams);
  listViewParams.set(viewParam, listViewValue);
  const cardViewParams = new URLSearchParams(resetPaginationSearchParams);
  cardViewParams.delete(viewParam);

  const resetPagination = () => {
    history.replace({ search: resetPaginationSearchParams.toString() });
  };

  return {
    currentPage,
    pageSize: isListView ? LIST_VIEW_PAGE_SIZE : CARD_VIEW_PAGE_SIZE,
    isListView,
    listViewParams: `?${listViewParams}`,
    cardViewParams: `${[...cardViewParams].length ? '?' : ''}${cardViewParams}`,
    resetPagination,
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
